import os
from decimal import Decimal
from openai import OpenAI
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy import func
from sqlalchemy.orm import Session
from database_info import get_db
from response import HttpResponse
from models import ClassInfo
from models import Student
from models import Employment
from dotenv import load_dotenv

multi_tables_query_app=APIRouter()
load_dotenv()
aliyun_client=OpenAI(
    api_key=os.getenv("ALIYUN_API_KEY"),
    base_url="https://dashscope.aliyuncs.com/compatible-mode/v1"
)
@multi_tables_query_app.get("/class_stu_emp_info",summary='班级的就业信息')
def class_stu_emp_info(class_id:int,db:Session=Depends(get_db)):
    result=db.query(ClassInfo,Student,Employment).join(Student,ClassInfo.id==Student.class_id).outerjoin(Employment,Student.id==Employment.student_id).filter(ClassInfo.id==class_id).all()
    result_list=[]
    if result:
        for cls, stu, emp in result:
            student_info = {
                'stu_id': stu.id,
                'stu_name': stu.name,
                'cls_id': cls.id,
                'cls_head_teacher': cls.head_teacher,
                'cls_teaching_teacher': cls.teaching_teacher,
                'emp_info': None
            }
            if emp:
                student_info["emp_info"] = {
                    "emp_offer_ down_time": emp.offer_down_time,
                    'emp_salary': emp.salary,
                    'emp_company_name': emp.company_name

                }
            result_list.append(student_info)
        return HttpResponse.success(message=f"该班的就业学生信息查询成功", data=result_list)
    else:
        raise HTTPException(404,f"未找到{class_id}班的就业信息")


@multi_tables_query_app.get("/avg_salary_Edu",summary="学历的平均工资")
def avg_salary_Edu(db:Session=Depends(get_db)):
    result=db.query(Student.academic,func.avg(Employment.salary) ).join(Employment,Student.id==Employment.student_id).group_by(Student.academic).all()
    result_list=[]
    if result:
        for stu, emp in result:
            student_info = {
                "学历": stu,
                "平均工资":float(emp.quantize(Decimal("0.00")))
            }
            result_list.append(student_info)
        return HttpResponse.success(message="学历工资的平均值信息查询成功", data=result_list)

mesage=[]
@multi_tables_query_app.get("aiQandA",summary="ai问答")
def ai_qanda(st:str):

    mesage.append({"role": "user", "content": st})
    response=aliyun_client.chat.completions.create(
        model="qwen-plus",
        messages=mesage
    )
    mesage.append({"role": "assistant", "content": response.choices[0].message.content})
    return HttpResponse.success(message="ai问答成功", data=response.choices[0].message.content)



