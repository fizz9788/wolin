from datetime import date
from decimal import Decimal
from models import Student
from sqlalchemy import and_, desc
from sqlalchemy.orm import Session
from sqlalchemy.sql.functions import  func

from models import Employment
from pdc_models import Emp_pdc_model
from response import HttpResponse

def get_stu_empinfo_sno(id:int, db:Session):
    return db.query(Employment).filter(Employment.student_id==id).first()

def get_stu_empinfo_Cname(sclass:str, db:Session):
    return db.query(Employment).filter(Employment.class_name==sclass).all()

def get_stu_empinfo_salary(min_salary:int,max_salary:int, db:Session):
    return db.query(Employment).filter(and_(Employment.salary>=min_salary,Employment.salary<=max_salary)).all()




def updata_empinfo(stu:Emp_pdc_model, db:Session):
    student_exists = db.query(Student).filter(Student.id == stu.student_id).first()
    if not student_exists:
        return HttpResponse.bad_request(message=f"外键约束失败：学生ID {stu.student_id} 不存在于students表")
    result=db.query(Employment).filter(Employment.student_id==stu.student_id).first()
    if result:
        result.student_name = stu.student_name
        result.class_name = stu.class_name
        result.emp_open_time = stu.emp_open_time
        result.offer_down_time = stu.offer_down_time
        result.company_name = stu.company_name
        result.salary = stu.salary
        db.commit()
        return HttpResponse.success(message=f"修改:学生信息更新成功", data=stu.dict())
    else:
        stu_info = Employment(**stu.dict())
        db.add(stu_info)
        db.commit()
        return HttpResponse.success(message=f"新增:学生信息添加成功", data=stu.dict())


def show_db(result):
        stu_list = []
        for stu in result:
            stu_dict = {
                "student_id": stu.student_id,
                "student_name": stu.student_name,
                "class_name": stu.class_name,
                "emp_open_time": stu.emp_open_time.strftime("%Y-%m-%d") if isinstance(stu.emp_open_time, date) else "",
                "offer_down_time": stu.offer_down_time.strftime("%Y-%m-%d") if isinstance(stu.offer_down_time, date) else "",
                "company_name": stu.company_name,
                "salary": stu.salary
            }
            stu_list.append(stu_dict)
        return stu_list


def get_stu_empinfo_salary(min_salary:int,max_salary:int, db:Session):
    return db.query(Employment).filter(and_(Employment.salary>=min_salary,Employment.salary<=max_salary)).all()




def salary_top5(db:Session):
    result = db.query(Employment).order_by(desc(Employment.salary)).limit(5).all()
    return result

def show_db_1(result:Employment):
    stu_list = []
    for stu in result:
        stu_dict = {
            "student_name": stu.student_name,
            "class_name": stu.class_name,
            "offer_down_time": stu.offer_down_time.strftime("%Y-%m-%d") if isinstance(stu.offer_down_time,date) else "",
            "company_name": stu.company_name,
            "salary": stu.salary
        }
        stu_list.append(stu_dict)
    return stu_list

def emp_time(db:Session):
    result1=db.query(Employment.student_name,Employment.offer_down_time,Employment.emp_open_time).all()
    return result1

def show_db_2(result):
    stu_list = []
    for stu in result:
        open_time = stu.emp_open_time
        down_time = stu.offer_down_time
        if isinstance(open_time, date) and isinstance(down_time, date):
            days_diff = (down_time - open_time).days
        else:
            return ""
        stu_dict = {
            "student_name": stu.student_name,
            "emp_time":days_diff
        }
        stu_list.append(stu_dict)
    return stu_list

def avg_emp_time(db:Session):
    result = db.query(
        Employment.class_name,
        # 修复：用datediff计算天数差，再求平均（适配MySQL）
        func.avg(
            func.datediff(Employment.offer_down_time, Employment.emp_open_time)
        )
    ).filter(
        Employment.emp_open_time.isnot(None),
        Employment.offer_down_time.isnot(None),
        Employment.offer_down_time > Employment.emp_open_time  # 排除异常数据
    ).group_by(
        Employment.class_name
    ).all()
    return  result


def show_db_3(result):
    stu_list = []
    for i in result:
        stu_dict = {
            "sclass": i[0],
            "avg_emp_time":float(i[1].quantize(Decimal("0.00")))
        }
        stu_list.append(stu_dict)

    return stu_list


def show_db_4(result):
        stu_info = {
            "student_id": result.student_id,
            "student_name": result.student_name,
            "class_name": result.class_name,
            "emp_open_time": result.emp_open_time.strftime("%Y-%m-%d") if isinstance(result.emp_open_time, date) else "",
            "offer_down_time": result.offer_down_time.strftime("%Y-%m-%d") if isinstance(result.offer_down_time, date) else "",
            "emp_company_name": result.company_name,
            "emp_salary": result.salary
        }
        return stu_info