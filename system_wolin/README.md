# 学生管理系统 (Student Management System)

基于 FastAPI + SQLAlchemy + MySQL 开发的学生就业信息管理系统，提供完整的 CRUD 操作和统计分析功能。

## 功能特性

### 班级信息管理
- ✅ 根据班级 ID 查询班级信息
- ✅ 新增或修改班级信息
- ✅ 删除班级信息

### 学生信息管理
- ✅ 添加/修改学生信息
- ✅ 查询学生薪资信息
- ✅ 前端可视化界面操作

### 学生就业管理
- ✅ 根据学生 ID 查询就业信息
- ✅ 根据班级名称查询就业信息
- ✅ 更新/新增学生就业信息
- ✅ 删除学生就业信息
- ✅ 工资范围查询
- ✅ 工资前 5 学生统计

### 多表查询
- ✅ 班级就业信息查询（多表关联）
- ✅ 学历平均工资统计

### 前端界面
- ✅ 学生信息可视化管理
- ✅ 响应式设计，支持移动端
- ✅ 现代化 UI 界面

## 技术栈

- **后端框架**: FastAPI
- **ORM**: SQLAlchemy
- **数据库**: MySQL
- **前端**: HTML5 + CSS3 + JavaScript
- **API 文档**: Swagger UI

## 项目结构

```
system_wolin/
├── Class_table/           # 班级管理模块
│   ├── __init__.py
│   └── api.py            # 班级 API 接口
├── Employment/            # 就业管理模块
│   ├── __init__.py
│   ├── api.py            # 就业 API 接口
│   └── dao.py            # 数据访问层
├── multi_tables_query/    # 多表查询模块
│   ├── __init__.py
│   └── api.py            # 多表查询接口
├── student_info/          # 学生管理模块
│   ├── __init__.py
│   └── api.py            # 学生 API 接口
├── frontend/              # 前端页面
│   ├── __init__.py
│   ├── index.html        # 主页面
│   ├── routes.py         # 前端路由注册
│   └── static/
│       ├── css/
│       │   └── style.css # 样式文件
│       └── js/
│           └── app.js    # 前端脚本
├── database_info.py      # 数据库配置
├── models.py             # 数据模型
├── pdc_models.py         # Pydantic 数据模型
├── response.py           # 统一响应类
└── wlstu_system.py       # 应用入口
```

## 安装部署

### 1. 环境要求

- Python 3.8+
- MySQL 5.7+
- pip

### 2. 安装依赖

```bash
pip install fastapi uvicorn sqlalchemy pymysql pydantic
```

### 3. 数据库配置

修改 `database_info.py` 中的数据库连接信息：

```python
URL_emp = "mysql+pymysql://用户名:密码@主机:端口/数据库名"
```

示例：
```python
URL_emp = "mysql+pymysql://root:123456@localhost:3306/wolin_system"
```

### 4. 创建数据库

```sql
CREATE DATABASE wolin_system CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

### 5. 数据库表结构

系统包含三个主要数据表：

#### 班级表 (class_info)
- `class_id`: 班级 ID（主键）
- `start_data`: 开班日期
- `head_teacher`: 班主任
- `teaching_teacher`: 任课教师

#### 学生表 (students)
- `stu_id`: 学号（主键）
- `stu_name`: 姓名
- `stu_age`: 年龄
- `stu_gender`: 性别
- `stu_address`: 地址
- `stu_academic`: 学历
- `stu_school`: 学校
- `stu_major`: 专业
- `stu_graduation_time`: 毕业时间
- `stu_enrollment_time`: 入学时间
- `stu_class`: 班级 ID（外键）
- `counselor_id`: 辅导员 ID

#### 就业表 (employment)
- `sno`: 学号（主键，外键）
- `sname`: 学生姓名
- `sclass`: 班级名称
- `emp_open_time`: 就业开始时间
- `offer_down_time`: offer 下发时间
- `emp_company_name`: 公司名称
- `emp_salary`: 薪资

### 6. 启动服务

```bash
python wlstu_system.py
```

服务将在 `http://127.0.0.1:8020` 启动

## API 文档

启动服务后访问 Swagger 文档：
- **Swagger UI**: http://127.0.0.1:8020/docs
- **ReDoc**: http://127.0.0.1:8020/redoc

### API 接口列表

#### 班级管理 (`/class`)
- `GET /class/class_info/{class_id}` - 查询班级信息
- `POST /class/updata_classinfo` - 新增或修改班级信息
- `DELETE /class/delete_classinfo` - 删除班级信息

#### 学生管理 (`/student`)
- `POST /student/add_student` - 添加或修改学生信息
- `GET /student/get_stu_salary` - 查询学生薪资

#### 就业管理 (`/employment`)
- `GET /employment/students/{id}` - 根据学生 ID 查询就业信息
- `GET /employment/class/{class_name}` - 根据班级名称查询就业信息
- `POST /employment/students/` - 更新或新增就业信息
- `DELETE /employment/students/` - 删除就业信息
- `GET /employment/salary` - 工资范围查询
- `GET /employment/statistics/salary` - 工资前 5 统计
- `GET /employment/statistics/emp_time` - 每个学生的就业时长
- `GET /employment/statistics/avg_emp_time_class` - 每个班级的平均就业时长

#### 多表查询 (`/multi_query`)
- `GET /multi_query/class_stu_emp_info` - 班级就业信息查询
- `GET /multi_query/avg_salary_Edu` - 学历平均工资统计

## 前端使用

启动服务后访问前端页面：
```
http://127.0.0.1:8020/frontend
```

### 前端功能
- 📋 查看学生列表
- ➕ 添加新学生
- ✏️ 编辑学生信息
- 🗑️ 删除学生记录
- 🔄 刷新数据列表

## 统一响应格式

所有 API 接口返回统一的 JSON 格式：

```json
{
  "code": 200,
  "message": "操作成功",
  "data": {...}
}
```

### 响应码说明
- `200`: 操作成功
- `400`: 请求参数错误
- `404`: 资源未找到
- `419`: 数据不足

## 开发说明

### 添加新的 API 接口

1. 在对应模块的 `api.py` 中定义路由
2. 使用 `HttpResponse` 类统一返回格式
3. 使用 `Depends(get_db)` 获取数据库会话

示例：
```python
from pythonProject.system_wolin.response import HttpResponse

@app.get("/example", tags=["示例"])
def example_api(db: Session = Depends(get_db)):
    result = db.query(Model).all()
    return HttpResponse.success(message="查询成功", data=result)
```

### 数据库操作

使用 SQLAlchemy ORM 进行数据库操作：

```python
# 查询
result = db.query(Student).filter(Student.id == id).first()

# 新增
new_student = Student(**data)
db.add(new_student)
db.commit()

# 更新
student.name = "新名字"
db.commit()

# 删除
db.delete(student)
db.commit()
```

## 许可证

MIT License

## 联系方式

如有问题或建议，欢迎提交 Issue 或 Pull Request。
