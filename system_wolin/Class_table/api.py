from fastapi import APIRouter, Depends,HTTPException
from database_info import get_db
from response import HttpResponse
from sqlalchemy.orm import Session
from models import ClassInfo
from pdc_models import Classinfo_pdc_model

class_app=APIRouter()

@class_app.get("/class_info/{class_id}",summary="根据班级id查询班级信息")
def query_class_info(class_id:int,db:Session=Depends(get_db)):
    result=db.query(ClassInfo).filter(ClassInfo.id==class_id).first()
    if result:
        return HttpResponse.success(message="查询成功", data=result)
    else:
        raise HTTPException(404,f"没找到{class_id}编号的班级信息")

@class_app.post("/updata_classinfo",summary="新增或修改班级信息")
def updata_classinfo(c_info:Classinfo_pdc_model,db:Session=Depends(get_db)):
    result=db.query(ClassInfo).filter(ClassInfo.id==c_info.id).first()
    result_dict = {
        "class_id":c_info.id,
        "start_data":c_info.start_date,
        "head_teacher":c_info.head_teacher,
        "teaching_teacher":c_info.teaching_teacher
    }
    if result:
        result.class_id=c_info.class_id
        result.start_data=c_info.start_data
        result.head_teacher=c_info.head_teacher
        result.teaching_teacher=c_info.teaching_teacher
        db.commit()
        return HttpResponse.success(message=f"修改:班级信息修改成功", data=result_dict)
    else:
        class_info = ClassInfo(**c_info.dict())
        db.add(class_info)
        db.commit()
        return HttpResponse.success(message=f"新增:班级信息新增成功", data=result_dict)

@class_app.delete("/delete_classinfo",summary="班级信息删除")
def delete_classinfo(class_id:int,db:Session=Depends(get_db)):
    result=db.query(ClassInfo).filter(ClassInfo.id==class_id).first()
    if result:
        db.delete(result)
        db.commit()
        return HttpResponse.success(message=f"班级id为{class_id}的信息已删除成功")
    else:
        raise HTTPException(404,f"没有找到班级id为:{class_id}的信息")










