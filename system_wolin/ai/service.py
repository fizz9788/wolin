"""
AI 服务层 - 处理自然语言到 SQL 的转换
"""
import os
from openai import OpenAI
from dotenv import load_dotenv
from typing import List, Dict

load_dotenv()

# 初始化阿里云通义千问客户端
aliyun_client = OpenAI(
    api_key=os.getenv("ALIYUN_API_KEY"),
    base_url="https://dashscope.aliyuncs.com/compatible-mode/v1"
)


# 数据库结构信息
DATABASE_SCHEMA = """
数据库表结构：

1. class_info（班级表）
   - class_id: 班级ID（主键）
   - start_data: 开班日期
   - head_teacher: 班主任姓名
   - teaching_teacher: 任课教师姓名

2. students（学生表）
   - stu_id: 学生ID（主键）
   - stu_name: 学生姓名
   - stu_age: 学生年龄
   - stu_gender: 学生性别
   - stu_address: 学生地址
   - stu_academic: 学历
   - stu_school: 学校
   - stu_major: 专业
   - stu_graduation_time: 毕业时间
   - stu_enrollment_time: 入学时间
   - stu_class: 班级ID（外键，关联 class_info.class_id）
   - counselor_id: 辅导员ID

3. employment（就业表）
   - sno: 学生ID（主键，外键，关联 students.stu_id）
   - sname: 学生姓名
   - sclass: 班级名称
   - emp_open_time: 就业开放时间
   - offer_down_time: Offer下达时间
   - emp_company_name: 公司名称
   - emp_salary: 薪资

表关系：
- class_info.id = students.stu_class（一对多）
- students.id = employment.sno（一对一）
"""


def build_prompt(user_question: str, conversation_history: List[Dict[str, str]] = None) -> str:
    """
    构建 AI 对话的 Prompt

    Args:
        user_question: 用户当前的问题
        conversation_history: 对话历史记录

    Returns:
        完整的 Prompt 字符串
    """
    messages = []

    # 系统提示
    system_prompt = f"""你是一个专业的 SQL 查询生成助手。根据用户的自然语言问题，生成对应的 SQL 查询语句。

{DATABASE_SCHEMA}

重要规则：
1. 只生成 SELECT 查询语句，不要生成 INSERT/UPDATE/DELETE
2. 使用表的实际字段名（如 stu_name 而不是 name）
3. 注意表之间的关联关系，正确使用 JOIN
4. 返回的 SQL 语句必须是可以直接执行的
5. 如果问题无法理解或无法生成 SQL，返回：ERROR: 无法理解问题
6. 保持回答简洁，只返回 SQL 语句，不要多余的解释

示例：
用户问题：查询班级ID为1的所有学生信息
生成的SQL: SELECT * FROM students WHERE stu_class = 1

用户问题：查询张三的就业信息
生成的SQL: SELECT * FROM employment WHERE sname = '张三'

用户问题：查询每个班级的平均薪资
生成的SQL: SELECT sclass, AVG(emp_salary) as avg_salary FROM employment GROUP BY sclass
"""
    messages.append({"role": "system", "content": system_prompt})

    # 添加历史对话
    if conversation_history:
        messages.extend(conversation_history)

    # 添加当前问题
    messages.append({"role": "user", "content": user_question})

    return messages


def generate_sql(question: str, conversation_history: List[Dict[str, str]] = None) -> tuple:
    """
    使用 AI 生成 SQL 语句

    Args:
        question: 用户的问题
        conversation_history: 对话历史记录

    Returns:
        tuple: (sql_statement, is_success, error_message)
    """
    try:
        messages = build_prompt(question, conversation_history)

        response = aliyun_client.chat.completions.create(
            model="qwen-plus",
            messages=messages,
            temperature=0.1,  # 降低随机性，提高准确性
            max_tokens=500
        )

        sql = response.choices[0].message.content.strip()

        # 检查是否生成成功
        if sql.startswith("ERROR:") or not sql.upper().startswith("SELECT"):
            return None, False, f"AI 生成失败: {sql}"

        # 清理 SQL 语句（移除 markdown 格式）
        sql = sql.replace("```sql", "").replace("```", "").strip()

        return sql, True, None

    except Exception as e:
        return None, False, f"AI 服务异常: {str(e)}"
