from fastapi import FastAPI
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse
import os


def register_class_management_routes(app: FastAPI):
    """
    注册班级管理前端路由
    
    Args:
        app: FastAPI 实例对象
    """
    # 获取当前文件所在目录
    current_dir = os.path.dirname(os.path.abspath(__file__))
    static_dir = os.path.join(current_dir, 'static')
    pages_dir = os.path.join(current_dir, 'pages')
    
    # 挂载静态文件
    app.mount("/class_frontend/static", StaticFiles(directory=static_dir), name="class-frontend-static")
    
    # 主页路由
    @app.get("/class_frontend", tags=["前端"])
    async def class_management_index():
        """
        班级管理系统首页
        """
        index_path = os.path.join(current_dir, 'index.html')
        return FileResponse(index_path)
    
    @app.get("/class_frontend/", tags=["前端"])
    async def class_management_index_slash():
        """
        班级管理系统首页（带斜杠）
        """
        index_path = os.path.join(current_dir, 'index.html')
        return FileResponse(index_path)
    
    # 班级管理页面路由
    @app.get("/class_frontend/pages/class.html", tags=["前端"])
    async def class_management_page():
        """
        班级管理页面
        """
        page_path = os.path.join(pages_dir, 'class.html')
        return FileResponse(page_path)
    
    # 多表查询页面路由
    @app.get("/class_frontend/pages/query.html", tags=["前端"])
    async def query_page():
        """
        多表查询页面
        """
        page_path = os.path.join(pages_dir, 'query.html')
        return FileResponse(page_path)
    
    # 成绩管理页面路由
    @app.get("/class_frontend/pages/grade.html", tags=["前端"])
    async def grade_page():
        """
        成绩管理页面（开发中）
        """
        page_path = os.path.join(pages_dir, 'grade.html')
        return FileResponse(page_path)
