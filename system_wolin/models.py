from sqlalchemy import Column, Integer, String, Date, ForeignKey
from sqlalchemy.orm import relationship,declarative_base

Base=declarative_base()
# 1. 班级表（修复字段名笔误）
class ClassInfo(Base):
    __tablename__ = 'class_info'
    id = Column(Integer, primary_key=True, name='class_id')
    # 关键：模型字段名 start_date 映射到数据库的 start_data 列
    start_date = Column(Date, nullable=False, name='start_data')
    head_teacher = Column(String(50), nullable=False)
    teaching_teacher = Column(String(50), nullable=False)
    students = relationship("Student", back_populates="class_info", lazy="select")

# 2. 学生表（添加 ForeignKey 关联班级表）
class Student(Base):
    __tablename__ = 'students'
    id = Column(Integer, primary_key=True, autoincrement=True, name='stu_id')
    name = Column(String(20), nullable=False, name='stu_name')
    age = Column(Integer, nullable=False, name='stu_age')
    gender = Column(String(3), nullable=False, name='stu_gender')
    address = Column(String(50), nullable=False, name='stu_address')
    academic = Column(String(5), nullable=False, name='stu_academic')
    school = Column(String(20), nullable=False, name='stu_school')
    major = Column(String(20), nullable=False, name='stu_major')
    graduation_time = Column(String(20), nullable=False, name='stu_graduation_time')
    enrollment_time = Column(String(20), nullable=False, name='stu_enrollment_time')
    # 关键修复：添加 ForeignKey 关联班级表的 class_id
    class_id = Column(Integer, ForeignKey('class_info.class_id'), nullable=False, name='stu_class')
    counselor_id = Column(Integer, nullable=False)
    # 关联班级
    class_info = relationship("ClassInfo", back_populates="students", lazy="select")
    # 关联就业：uselist=False 表示一对一关系
    employment = relationship("Employment", back_populates="student", uselist=False, lazy="select")

# 3. 就业表（添加 ForeignKey 关联学生表）
class Employment(Base):
    __tablename__ = 'employment'
    student_id = Column(Integer, ForeignKey('students.stu_id'), primary_key=True, name='sno')
    student_name = Column(String(50), nullable=False, name='sname')
    class_name = Column(String(20), nullable=False, name='sclass')
    emp_open_time = Column(Date, nullable=False)
    offer_down_time = Column(Date, nullable=False)
    company_name = Column(String(100), nullable=False, name='emp_company_name')
    salary = Column(Integer, nullable=False, name='emp_salary')
    student = relationship("Student", back_populates="employment", lazy="select")