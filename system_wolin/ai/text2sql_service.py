"""
TEXT2SQL 服务层
提供自然语言转 SQL 并执行查询的功能
"""
import os
import json
from typing import Dict, List, Optional
from openai import OpenAI
from dotenv import load_dotenv
from system_wolin.service.mysql_service import execute_sql

load_dotenv()

# 初始化阿里云 OpenAI 客户端
aliyun_client = OpenAI(
    api_key=os.getenv("ALIYUN_API_KEY"),
    base_url="https://dashscope.aliyuncs.com/compatible-mode/v1"
)

# 数据库表结构描述
DATABASE_SCHEMA = """
你是一个专业的 SQL 生成助手。请根据用户的自然语言问题生成对应的 SQL 查询语句。

数据库包含以下三张表：

1. 班级表 (class_info)
   - class_id (INT, 主键): 班级ID
   - start_data (DATE): 开始日期
   - head_teacher (VARCHAR): 班主任
   - teaching_teacher (VARCHAR): 任课教师

2. 学生表 (students)
   - stu_id (INT, 主键, 自增): 学号
   - stu_name (VARCHAR, 非空): 学生姓名
   - stu_age (INT, 非空): 年龄
   - stu_gender (VARCHAR, 非空): 性别
   - stu_address (VARCHAR, 非空): 地址
   - stu_academic (VARCHAR, 非空): 学历
   - stu_school (VARCHAR, 非空): 学校
   - stu_major (VARCHAR, 非空): 专业
   - stu_graduation_time (VARCHAR, 非空): 毕业时间
   - stu_enrollment_time (VARCHAR, 非空): 入学时间
   - stu_class (INT, 外键): 班级ID，关联 class_info.class_id
   - counselor_id (INT, 非空): 辅导员ID

3. 就业表 (employment)
   - sno (INT, 主键, 外键): 学号，关联 students.stu_id
   - sname (VARCHAR, 非空): 姓名
   - sclass (VARCHAR, 非空): 班级
   - emp_open_time (DATE, 非空): 就业开始时间
   - offer_down_time (DATE, 非空): Offer时间
   - emp_company_name (VARCHAR, 非空): 公司名称
   - emp_salary (INT, 非空): 薪资

注意事项：
1. 班级表和学生表通过 class_info.class_id = students.stu_class 关联
2. 学生表和就业表通过 students.stu_id = employment.sno 关联
3. 薪资字段是 emp_salary，平均薪资用 AVG(emp_salary)
4. 只生成 SELECT 查询语句，不要生成 INSERT/UPDATE/DELETE
5. 确保生成的 SQL 语法正确，可以直接在 MySQL 中执行
6. 对于中文列名，在查询时可以使用表中的字段名

请只返回 SQL 语句，不要包含任何解释或额外说明。
"""

# 对话历史存储（使用内存存储，可后续改为数据库）
class ConversationHistory:
    """对话历史管理器"""
    
    def __init__(self, max_history: int = 10):
        self.histories: Dict[str, List[Dict]] = {}
        self.max_history = max_history
    
    def get_history(self, session_id: str) -> List[Dict]:
        """获取指定会话的历史记录"""
        return self.histories.get(session_id, [])
    
    def add_message(self, session_id: str, role: str, content: str):
        """添加消息到历史记录"""
        if session_id not in self.histories:
            self.histories[session_id] = []
        
        self.histories[session_id].append({
            "role": role,
            "content": content
        })
        
        # 限制历史记录长度
        if len(self.histories[session_id]) > self.max_history:
            self.histories[session_id] = self.histories[session_id][-self.max_history:]
    
    def clear_history(self, session_id: str):
        """清空指定会话的历史记录"""
        if session_id in self.histories:
            del self.histories[session_id]

# 全局对话历史管理器
conversation_manager = ConversationHistory()


def generate_sql(question: str, session_id: Optional[str] = None) -> Dict:
    """
    使用 AI 生成 SQL 语句
    
    Args:
        question: 用户的自然语言问题
        session_id: 会话ID，用于保持对话上下文
    
    Returns:
        dict: {'sql': 生成的SQL语句, 'error': 错误信息(如果有)}
    """
    try:
        # 构建消息列表
        messages = [
            {"role": "system", "content": DATABASE_SCHEMA}
        ]
        
        # 如果有会话ID，添加历史上下文
        if session_id:
            history = conversation_manager.get_history(session_id)
            messages.extend(history[-6:])  # 最多保留最近3轮对话（6条消息）
        
        messages.append({"role": "user", "content": f"请根据以下问题生成 SQL 查询语句：{question}"})
        
        # 调用 AI 生成 SQL
        response = aliyun_client.chat.completions.create(
            model="qwen-plus",
            messages=messages,
            temperature=0.1  # 降低温度以获得更确定性的输出
        )
        
        sql = response.choices[0].message.content.strip()
        
        # 清理 SQL（移除可能的 markdown 标记）
        sql = sql.replace('```sql', '').replace('```', '').strip()
        
        # 保存用户问题和 AI 生成的 SQL 到历史
        if session_id:
            conversation_manager.add_message(session_id, "user", question)
            conversation_manager.add_message(session_id, "assistant", f"生成的SQL: {sql}")
        
        return {'sql': sql, 'error': None}
    
    except Exception as e:
        error_msg = f"SQL 生成失败: {str(e)}"
        return {'sql': None, 'error': error_msg}


def execute_text2sql(question: str, session_id: Optional[str] = None) -> Dict:
    """
    执行 TEXT2SQL 查询
    
    Args:
        question: 用户的自然语言问题
        session_id: 会话ID，用于保持对话上下文
    
    Returns:
        dict: 查询结果
    """
    # 1. 生成 SQL
    sql_result = generate_sql(question, session_id)
    
    if sql_result['error']:
        return {
            'success': False,
            'error': sql_result['error'],
            'question': question,
            'sql': None,
            'result': None
        }
    
    sql = sql_result['sql']
    
    # 2. 执行 SQL
    try:
        result = execute_sql(sql)
        
        # 保存执行结果到历史
        if session_id:
            conversation_manager.add_message(
                session_id,
                "assistant",
                f"查询成功，返回 {len(result.get('data', []))} 条结果"
            )
        
        return {
            'success': True,
            'error': None,
            'question': question,
            'sql': sql,
            'result': result
        }
    
    except Exception as e:
        error_msg = f"SQL 执行失败: {str(e)}"
        
        # 保存错误到历史
        if session_id:
            conversation_manager.add_message(session_id, "assistant", error_msg)
        
        return {
            'success': False,
            'error': error_msg,
            'question': question,
            'sql': sql,
            'result': None
        }


def get_conversation_history(session_id: str) -> List[Dict]:
    """
    获取对话历史
    
    Args:
        session_id: 会话ID
    
    Returns:
        list: 历史消息列表
    """
    return conversation_manager.get_history(session_id)


def clear_conversation(session_id: str) -> bool:
    """
    清空对话历史
    
    Args:
        session_id: 会话ID
    
    Returns:
        bool: 是否成功
    """
    try:
        conversation_manager.clear_history(session_id)
        return True
    except Exception:
        return False
