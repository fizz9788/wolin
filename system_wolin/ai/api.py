"""
AI 模块 API 接口
提供 TEXT2SQL 相关的 RESTful API
"""
from fastapi import APIRouter, HTTPException
from pydantic import BaseModel, Field
from typing import Optional, List, Dict, Any
from system_wolin.response import HttpResponse
from .text2sql_service import (
    execute_text2sql,
    get_conversation_history,
    clear_conversation
)

ai_app = APIRouter()


class Text2SQLRequest(BaseModel):
    """TEXT2SQL 请求模型"""
    question: str = Field(..., description="用户的自然语言问题")
    session_id: Optional[str] = Field(None, description="会话ID，用于保持对话上下文")


class Text2SQLResponse(BaseModel):
    """TEXT2SQL 响应模型"""
    success: bool = Field(description="是否成功")
    error: Optional[str] = Field(None, description="错误信息")
    question: str = Field(description="用户的问题")
    sql: Optional[str] = Field(None, description="生成的SQL语句")
    result: Optional[Dict[str, Any]] = Field(None, description="查询结果")


class ClearHistoryRequest(BaseModel):
    """清空历史记录请求模型"""
    session_id: str = Field(..., description="会话ID")


class HistoryMessage(BaseModel):
    """历史消息模型"""
    role: str = Field(description="消息角色: user/assistant")
    content: str = Field(description="消息内容")


class HistoryResponse(BaseModel):
    """历史记录响应模型"""
    session_id: str = Field(description="会话ID")
    messages: List[HistoryMessage] = Field(description="历史消息列表")


@ai_app.post("/text2sql", summary="自然语言转SQL查询", response_model=HttpResponse[Text2SQLResponse])
def text2sql(request: Text2SQLRequest):
    """
    TEXT2SQL 接口
    
    将用户的自然语言问题转换为 SQL 并执行查询
    
    **功能说明：**
    - 支持对班级表、学生表、就业表的查询
    - 支持多表关联查询
    - 支持连续对话（通过 session_id 保持上下文）
    
    **示例请求：**
    ```json
    {
        "question": "查询所有学生的姓名和班级",
        "session_id": "user_123"
    }
    ```
    
    **示例响应：**
    ```json
    {
        "code": 200,
        "message": "查询成功",
        "data": {
            "success": true,
            "error": null,
            "question": "查询所有学生的姓名和班级",
            "sql": "SELECT stu_name, stu_class FROM students",
            "result": {
                "columns": ["stu_name", "stu_class"],
                "data": [{"stu_name": "张三", "stu_class": 1}, ...]
            }
        }
    }
    ```
    """
    try:
        # 如果没有提供 session_id，生成一个默认的
        if not request.session_id:
            request.session_id = "default_session"
        
        # 执行 TEXT2SQL
        result = execute_text2sql(request.question, request.session_id)
        
        # 构建响应
        if result['success']:
            return HttpResponse.success(
                message="查询成功",
                data=Text2SQLResponse(**result)
            )
        else:
            # SQL 生成或执行失败，返回友好的错误信息
            error_message = format_error_message(result['error'], result['sql'])
            return HttpResponse.error(400, error_message, Text2SQLResponse(**result))
    
    except Exception as e:
        return HttpResponse.error(500, f"服务器内部错误: {str(e)}", None)


@ai_app.get("/history/{session_id}", summary="获取对话历史", response_model=HttpResponse[HistoryResponse])
def get_history(session_id: str):
    """
    获取对话历史
    
    根据 session_id 获取该会话的所有对话历史
    
    **示例响应：**
    ```json
    {
        "code": 200,
        "message": "获取成功",
        "data": {
            "session_id": "user_123",
            "messages": [
                {"role": "user", "content": "查询所有学生"},
                {"role": "assistant", "content": "生成的SQL: SELECT * FROM students"}
            ]
        }
    }
    ```
    """
    try:
        messages = get_conversation_history(session_id)
        
        # 转换为响应模型
        history_messages = [HistoryMessage(**msg) for msg in messages]
        
        return HttpResponse.success(
            message="获取成功",
            data=HistoryResponse(
                session_id=session_id,
                messages=history_messages
            )
        )
    
    except Exception as e:
        return HttpResponse.error(500, f"获取历史记录失败: {str(e)}", None)


@ai_app.post("/history/clear", summary="清空对话历史", response_model=HttpResponse[Dict[str, str]])
def clear_history(request: ClearHistoryRequest):
    """
    清空对话历史
    
    清空指定会话的所有对话历史
    
    **示例请求：**
    ```json
    {
        "session_id": "user_123"
    }
    ```
    
    **示例响应：**
    ```json
    {
        "code": 200,
        "message": "清空成功",
        "data": {"session_id": "user_123", "status": "cleared"}
    }
    ```
    """
    try:
        success = clear_conversation(request.session_id)
        
        if success:
            return HttpResponse.success(
                message="清空成功",
                data={"session_id": request.session_id, "status": "cleared"}
            )
        else:
            return HttpResponse.error(400, "清空失败", None)
    
    except Exception as e:
        return HttpResponse.error(500, f"清空历史记录失败: {str(e)}", None)


def format_error_message(error: str, sql: Optional[str] = None) -> str:
    """
    格式化错误信息，使其更友好
    
    Args:
        error: 原始错误信息
        sql: 生成的SQL语句（如果有）
    
    Returns:
        str: 格式化后的错误信息
    """
    if "SQL 生成失败" in error:
        return "抱歉，我无法理解您的问题，请尝试使用更清晰的表达。"
    
    if "SQL 执行失败" in error:
        if "doesn't exist" in error:
            return "查询的表或字段不存在，请检查问题是否正确。"
        elif "syntax error" in error:
            return f"生成的SQL语法有误：{sql}"
        elif "Unknown column" in error:
            return "查询的字段不存在，请检查问题中的字段名称。"
        else:
            return f"查询执行失败：{error}"
    
    return error
