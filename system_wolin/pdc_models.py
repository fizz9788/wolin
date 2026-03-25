from pydantic import BaseModel,Field
from datetime import datetime

class Classinfo_pdc_model(BaseModel):
    id :int=Field(...)
    start_date :datetime=Field(...)
    head_teacher:str=Field(...)
    teaching_teacher:str=Field(...)

class Emp_pdc_model(BaseModel):
    student_id: int = Field(...)
    student_name: str = Field(...)
    class_name: str = Field(...)
    emp_open_time: datetime = Field(...)
    offer_down_time: datetime = Field(...)
    company_name: str = Field(...)
    salary: int = Field(...)

class Stu_pdc_model(BaseModel):
    id :int=Field(...)
    name :str=Field(...)
    age :int=Field(...)
    gender :str=Field(...)
    address :str=Field(...)
    academic :str=Field(...)
    school  :str=Field(...)
    major :str=Field(...)
    graduation_time :str=Field(...)
    enrollment_time :str=Field(...)
    class_id :int=Field(...)
    counselor_id :int=Field(...)