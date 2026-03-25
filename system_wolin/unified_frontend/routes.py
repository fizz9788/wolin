from fastapi import FastAPI
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse
import os


def register_unified_frontend_routes(app: FastAPI):
    """
    注册统一前端系统路由
    
    Args:
        app: FastAPI 实例对象
    """
    # 获取当前文件所在目录
    current_dir = os.path.dirname(os.path.abspath(__file__))
    static_dir = os.path.join(current_dir, 'static')
    pages_dir = os.path.join(current_dir, 'pages')
    
    # 挂载静态文件
    app.mount("/unified_frontend/static", StaticFiles(directory=static_dir), name="unified-frontend-static")
    
    # 主页路由
    @app.get("/unified_frontend", tags=["前端"])
    async def unified_frontend_index():
        """
        教务管理系统首页
        """
        index_path = os.path.join(current_dir, 'index.html')
        return FileResponse(index_path)
    
    @app.get("/unified_frontend/", tags=["前端"])
    async def unified_frontend_index_slash():
        """
        教务管理系统首页（带斜杠）
        """
        index_path = os.path.join(current_dir, 'index.html')
        return FileResponse(index_path)
    
    # 学生管理页面路由
    @app.get("/unified_frontend/pages/student.html", tags=["前端"])
    async def student_management_page():
        """
        学生管理页面
        """
        page_path = os.path.join(pages_dir, 'student.html')
        return FileResponse(page_path)
    
    # 班级管理页面路由
    @app.get("/unified_frontend/pages/class.html", tags=["前端"])
    async def class_management_page():
        """
        班级管理页面
        """
        page_path = os.path.join(pages_dir, 'class.html')
        return FileResponse(page_path)
    
    # 就业管理页面路由
    @app.get("/unified_frontend/pages/employment.html", tags=["前端"])
    async def employment_management_page():
        """
        就业管理页面
        """
        page_path = os.path.join(pages_dir, 'employment.html')
        return FileResponse(page_path)
    
    # 多表查询页面路由
    @app.get("/unified_frontend/pages/query.html", tags=["前端"])
    async def query_page():
        """
        多表查询页面
        """
        page_path = os.path.join(pages_dir, 'query.html')
        return FileResponse(page_path)
    
    # 成绩管理页面路由
    @app.get("/unified_frontend/pages/grade.html", tags=["前端"])
    async def grade_management_page():
        """
        成绩管理页面（开发中）
        """
        page_path = os.path.join(pages_dir, 'grade.html')
        return FileResponse(page_path)
    
    # 数据统计页面路由
    @app.get("/unified_frontend/pages/statistics.html", tags=["前端"])
    async def statistics_page():
        """
        数据统计页面
        """
        page_path = os.path.join(pages_dir, 'statistics.html')
        return FileResponse(page_path)
<<<<<<< HEAD

    # AI 智能查询页面路由
    @app.get("/unified_frontend/pages/text2sql.html", tags=["前端"])
    async def text2sql_page():
        """
        AI 智能查询页面
        """
        page_path = os.path.join(pages_dir, 'text2sql.html')
        return FileResponse(page_path)
=======
>>>>>>> 7390b552a56d837bac6bb6601a7a1c71cf80d4bf
