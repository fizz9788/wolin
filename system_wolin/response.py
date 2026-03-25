from typing import Generic, TypeVar, Optional, Any
from pydantic import BaseModel, Field

T = TypeVar('T')


class HttpResponse(BaseModel, Generic[T]):
    """
    统一的 HTTP 响应类
    """
    code: int = Field(description="状态码，200表示成功，其他表示失败")
    message: str = Field(description="响应消息")
    data: Optional[T] = Field(default=None, description="响应数据")

    @classmethod
    def success(cls, message: str = "操作成功", data: Optional[T] = None) -> "HttpResponse[T]":
        """
        成功响应
        """
        return cls(code=200, message=message, data=data)

    @classmethod
    def error(cls, code: int, message: str, data: Optional[T] = None) -> "HttpResponse[T]":
        """
        错误响应
        """
        return cls(code=code, message=message, data=data)

    @classmethod
    def not_found(cls, message: str = "未找到相关数据") -> "HttpResponse[T]":
        """
        404 响应
        """
        return cls(code=404, message=message, data=None)

    @classmethod
    def bad_request(cls, message: str = "请求参数错误") -> "HttpResponse[T]":
        """
        400 响应
        """
        return cls(code=400, message=message, data=None)
