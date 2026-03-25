"""
MySQL 服务层
提供原生 SQL 执行能力
"""
from datetime import date, datetime

from sqlalchemy import text

from system_wolin.database_info import Session


def serialize_value(value):
    """将值序列化为 JSON 可处理的类型"""
    if isinstance(value, datetime):
        return value.strftime('%Y-%m-%d %H:%M:%S')
    elif isinstance(value, date):
        return value.strftime('%Y-%m-%d')
    elif isinstance(value, (list, tuple)):
        return [serialize_value(v) for v in value]
    elif isinstance(value, dict):
        return {k: serialize_value(v) for k, v in value.items()}
    return value


def execute_sql(sql: str) -> dict:
    """
    执行 SQL 语句并返回结果

    Args:
        sql: SQL 语句字符串

    Returns:
        dict:
        - 查询语句 (SELECT): {'columns': [列名列表], 'data': [字典列表]}
        - 非查询语句 (INSERT/UPDATE/DELETE): {'rows_affected': int}

    Raises:
        Exception: SQL 执行失败时抛出异常
    """
    db = Session()
    try:
        result = db.execute(text(sql))

        # 判断是否为查询语句
        if sql.strip().upper().startswith('SELECT'):
            columns = result.keys()
            rows = result.fetchall()
            data = [dict(zip(columns, row)) for row in rows]
            # 序列化数据（处理 date/datetime 类型）
            data = [{k: serialize_value(v) for k, v in row.items()} for row in data]
            return {'columns': list(columns), 'data': data}
        else:
            # 非查询语句，提交事务并返回受影响行数
            db.commit()
            return {'rows_affected': result.rowcount}
    except Exception as e:
        db.rollback()
        raise e
    finally:
        db.close()
