from fastapi import FastAPI
import uvicorn
from Employment.api import Emp_app
from Class_table.api import class_app
from student_info.api import student_app
from multi_tables_query.api import multi_tables_query_app
from ai.api import ai_app


app = FastAPI()
app.include_router(Emp_app, prefix="/employment", tags=["学生就业管理"])
app.include_router(class_app, prefix="/class", tags=["班级信息管理"])
app.include_router(student_app, prefix="/student", tags=["学生信息管理"])
app.include_router(multi_tables_query_app,prefix="/multi_query",tags=["多表查询功能"])
app.include_router(ai_app, prefix="/ai", tags=["AI智能查询"])


# 注册统一前端系统路由
from unified_frontend.routes import register_unified_frontend_routes
register_unified_frontend_routes(app)


if __name__ == '__main__':
    uvicorn.run("wlstu_system:app", host="127.0.0.1", port=8020)