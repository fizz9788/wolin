from fastapi import APIRouter, Depends,HTTPException
from sqlalchemy.orm import Session
from .dao import get_stu_empinfo_sno, get_stu_empinfo_Cname, updata_empinfo, show_db, get_stu_empinfo_salary, \
    salary_top5, show_db_1, emp_time, show_db_2, avg_emp_time, show_db_3, show_db_4
from system_wolin.database_info import get_db
from system_wolin.pdc_models import Emp_pdc_model
from system_wolin.response import HttpResponse

Emp_app = APIRouter()

@Emp_app.get("/students/{id}",summary="根据学生id查询学生就业信息")
def get_employees_sno(id:int,db:Session=Depends(get_db)):
    result=get_stu_empinfo_sno(id,db)
    if result:
        stu_info=show_db_4(result)
        return HttpResponse.success(message=f"查询学生id为:{id}，查询成功", data=stu_info)
    else:
        raise HTTPException(404,"没找到该学生的信息")


@Emp_app.get("/class/{class_name}",summary="根据班级名字查询学生就业信息")
def get_employees_sclass(class_name:str,db:Session=Depends(get_db)):
    result=get_stu_empinfo_Cname(class_name,db)
    if result:
        result_dict=show_db(result)
        return HttpResponse.success(message=f"查询班级为:{class_name}，查询成功", data=result_dict)
    else:
        raise HTTPException(404,"没找到这个班级的信息")

@Emp_app.post('/students/',summary="更新/新增学生就业信息")
def post_employees(stu:Emp_pdc_model,db:Session=Depends(get_db)):
    return updata_empinfo(stu,db)

@Emp_app.delete('/students/',summary="删除学生就业信息")
def delete_emp(id:int,db:Session=Depends(get_db)):
    result=get_stu_empinfo_sno(id,db)
    if result:
        db.delete(result)
        db.commit()
        return HttpResponse.success(message=f"学生id:{id}的就业信息已删除")
    else:
        raise HTTPException(404, "没找到该学生的信息")



@Emp_app.get("/salary",summary="工资范围查询")
def get_stuinfo_salary(min_salary:int,max_salary:int,db:Session=Depends(get_db)):
    result=get_stu_empinfo_salary(min_salary,max_salary,db)
    if result:
        result_dict=show_db(result)
        return HttpResponse.success(message=f"工资在{min_salary}到{max_salary}之间的学生信息", data=result_dict)
    else:
        raise HTTPException(404,"没找到这个薪资范围内的学生信息")


@Emp_app.get('/statistics/salary',summary="工资前5的学生就业信息")
def salary(db:Session=Depends(get_db)):
    result=salary_top5(db)
    if len(result)==5:
        return HttpResponse.success(message="工资前5的学生就业信息查询成功", data=show_db_1(result))
    else:
        raise HTTPException(419,"数据不足五条")

@Emp_app.get('/statistics/emp_time',summary="每个同学的就业时长")
def emptime(db:Session=Depends(get_db)):
    result=emp_time(db)
    if result:
        return HttpResponse.success(message="每个同学的就业时长查询成功", data=show_db_2(result))
    else:
        raise HTTPException(404, "数据库为空")

@Emp_app.get('/statistics/avg_emp_time_class',summary="每个班级的平均就业时长")
def avgemptime(db:Session=Depends(get_db)):
    result=avg_emp_time(db)
    formatted_result = show_db_3(result)
    return HttpResponse.success(message="每个班级的平均就业时长查询成功", data=formatted_result)



