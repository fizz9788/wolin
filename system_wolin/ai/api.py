"""
TEXT2SQL API 接口
提供自然语言到 SQL 的查询功能
"""
import json
import os
from datetime import datetime
from typing import List, Dict
from fastapi import APIRouter, HTTPException
from pydantic import BaseModel, Field
from response import HttpResponse
from service.mysql_service import execute_sql
from .service import generate_sql

# 创建路由
text2sql_app = APIRouter()

# 查询历史存储（内存中）
query_history: Dict[str, List[Dict]] = {}

# 日志目录
LOG_DIR = os.path.join(os.path.dirname(__file__), '..', 'log')
os.makedirs(LOG_DIR, exist_ok=True)


class Text2SQLRequest(BaseModel):
    """TEXT2SQL 请求模型"""
    question: str = Field(..., description="用户的问题")
    session_id: str = Field(default="default", description="会话ID，用于多轮对话")


class Text2SQLResponse(BaseModel):
    """TEXT2SQL 响应模型"""
    sql: str = Field(description="生成的 SQL 语句")
    columns: List[str] = Field(description="查询结果的列名")
    data: List[Dict] = Field(description="查询结果数据")
    execution_time: float = Field(description="执行时间（秒）")


def save_query_log(session_id: str, question: str, sql: str, result: dict, error: str = None):
    """
    保存查询日志

    Args:
        session_id: 会话ID
        question: 用户问题
        sql: 生成的 SQL
        result: 执行结果
        error: 错误信息（如果有）
    """
    try:
        log_entry = {
            "timestamp": datetime.now().strftime('%Y-%m-%d %H:%M:%S'),
            "session_id": session_id,
            "question": question,
            "sql": sql,
            "result_rows": len(result.get('data', [])) if result else 0,
            "error": error,
            "success": error is None
        }

        # 保存到日志文件
        log_file = os.path.join(LOG_DIR, f"text2sql_{datetime.now().strftime('%Y%m%d')}.log")
        with open(log_file, 'a', encoding='utf-8') as f:
            f.write(json.dumps(log_entry, ensure_ascii=False) + '\n')

    except Exception as e:
        print(f"保存日志失败: {e}")


def get_conversation_history(session_id: str) -> List[Dict[str, str]]:
    """
    获取会话的历史对话记录

    Args:
        session_id: 会话ID

    Returns:
        对话历史记录列表
    """
    if session_id not in query_history:
        query_history[session_id] = []
    return query_history[session_id]


@text2sql_app.post("/text2sql", summary="自然语言转 SQL 查询", response_model=HttpResponse[Text2SQLResponse])
def text_to_sql(request: Text2SQLRequest):
    """
    将自然语言问题转换为 SQL 并执行查询

    Args:
        request: 包含用户问题和会话ID的请求

    Returns:
        查询结果，包含生成的 SQL、列名和数据
    """
    import time
    start_time = time.time()

    try:
        # 1. 获取历史对话
        history = get_conversation_history(request.session_id)

        # 2. 使用 AI 生成 SQL
        sql, success, error = generate_sql(request.question, history)

        if not success:
            # 保存失败日志
            save_query_log(request.session_id, request.question, None, None, error)
            raise HTTPException(status_code=400, detail=error)

        # 3. 执行 SQL
        try:
            result = execute_sql(sql)
        except Exception as e:
            error_msg = f"SQL 执行失败: {str(e)}"
            # 保存执行失败的日志
            save_query_log(request.session_id, request.question, sql, None, error_msg)

            # 更新历史对话
            history.append({
                "role": "user",
                "content": request.question
            })
            history.append({
                "role": "assistant",
                "content": f"生成的 SQL: {sql}\n执行错误: {str(e)}"
            })

            raise HTTPException(status_code=400, detail=error_msg)

        # 4. 保存成功的日志
        save_query_log(request.session_id, request.question, sql, result)

        # 5. 更新历史对话
        history.append({
            "role": "user",
            "content": request.question
        })
        history.append({
            "role": "assistant",
            "content": f"生成的 SQL: {sql}\n查询到 {len(result.get('data', []))} 条记录"
        })

        # 限制历史记录数量（最多保存最近10轮）
        if len(history) > 20:
            query_history[request.session_id] = history[-20:]

        # 6. 计算执行时间
        execution_time = time.time() - start_time

        # 7. 返回结果
        response_data = Text2SQLResponse(
            sql=sql,
            columns=result.get('columns', []),
            data=result.get('data', []),
            execution_time=round(execution_time, 3)
        )

        return HttpResponse.success(
            message=f"查询成功，共 {len(result.get('data', []))} 条记录",
            data=response_data
        )

    except HTTPException:
        raise
    except Exception as e:
        error_msg = f"服务异常: {str(e)}"
        save_query_log(request.session_id, request.question, sql if 'sql' in locals() else None, None, error_msg)
        raise HTTPException(status_code=500, detail=error_msg)


@text2sql_app.get("/history/{session_id}", summary="获取查询历史", response_model=HttpResponse[List[Dict]])
def get_history(session_id: str):
    """
    获取指定会话的查询历史

    Args:
        session_id: 会话ID

    Returns:
        该会话的查询历史记录
    """
    history = get_conversation_history(session_id)

    # 格式化历史记录
    formatted_history = []
    for i in range(0, len(history), 2):
        if i + 1 < len(history):
            formatted_history.append({
                "question": history[i]["content"],
                "answer": history[i + 1]["content"],
                "time": history[i + 1]["content"].split("\n")[0] if history[i + 1]["content"] else ""
            })

    return HttpResponse.success(message="获取历史记录成功", data=formatted_history)


@text2sql_app.delete("/history/{session_id}", summary="清除查询历史", response_model=HttpResponse)
def clear_history(session_id: str):
    """
    清除指定会话的查询历史

    Args:
        session_id: 会话ID

    Returns:
        操作结果
    """
    if session_id in query_history:
        query_history[session_id] = []

    return HttpResponse.success(message=f"会话 {session_id} 的历史记录已清除")
