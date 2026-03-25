from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from system_wolin.database_info import get_db
from system_wolin.response import HttpResponse
from system_wolin.models import Student, ClassInfo
from system_wolin.pdc_models import Stu_pdc_model

student_app = APIRouter()

@student_app.post("/add_student",summary="添加/修改学生信息")
def add_student(student: Stu_pdc_model,db: Session = Depends(get_db)):
    class_exists = db.query(ClassInfo).filter(ClassInfo.id == student.class_id).first()
    if not class_exists:
        raise HTTPException(400,f"添加失败：班级 ID {student.class_id} 不存在，请先添加该班级！"
        )
    result=db.query(Student).filter(Student.name==student.name).first()
    if result:
        result.id=student.id
        result.id = student.id
        result.name = student.name
        result.age = student.age
        result.gender = student.gender
        result.address = student.address
        result.academic = student.academic
        result.school = student.school
        result.major = student.major
        result.graduation_time = student.graduation_time
        result.enrollment_time = student.enrollment_time
        result.class_id = student.class_id
        result.counselor_id = student.counselor_id
        db.commit()
        return HttpResponse.success(message=f"修改：{student.name}的信息已修改成功")

    else:
        new_info=Student(**student.dict())
        db.add(new_info)
        db.commit()
        return HttpResponse.success(message=f"新增：{student.name}的信息已添加成功")


@student_app.get("/get_stu_salary")
def get_stu_salary(stu_id:int,db: Session = Depends(get_db)):
    result=db.query(Student).filter(Student.id==stu_id).first()
    if result:
        salary=result.employment.salary if result.employment.salary else 0
        return HttpResponse.success(message=f"学生id为:{stu_id}的工资查询成功", data={"salary": salary})
    else:
        raise HTTPException(404,f"没找到学号为{stu_id}的学生")