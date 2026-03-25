// 学生管理 JavaScript
let studentsData = [];
let currentPage = 1;
let pageSize = 10;

// 页面加载完成后初始化
document.addEventListener('DOMContentLoaded', function() {
    loadStudents();
    
    // 表单提交事件
    document.getElementById('studentForm').addEventListener('submit', function(e) {
        e.preventDefault();
        saveStudent();
    });
});

// 加载学生列表
async function loadStudents() {
    try {
        showMessage('正在加载学生数据...', 'info');
        
        // 演示数据
        const demoStudents = [
            {
                id: 1,
                name: '张三',
                age: 22,
                gender: '男',
                address: '北京市朝阳区',
                academic: '本科',
                school: '清华大学',
                major: '计算机科学与技术',
                class_id: 1,
                counselor_id: 1001
            },
            {
                id: 2,
                name: '李四',
                age: 21,
                gender: '女',
                address: '上海市浦东新区',
                academic: '本科',
                school: '复旦大学',
                major: '软件工程',
                class_id: 2,
                counselor_id: 1002
            },
            {
                id: 3,
                name: '王五',
                age: 23,
                gender: '男',
                address: '广州市天河区',
                academic: '研究生',
                school: '中山大学',
                major: '人工智能',
                class_id: 3,
                counselor_id: 1003
            },
            {
                id: 4,
                name: '赵六',
                age: 20,
                gender: '女',
                address: '深圳市南山区',
                academic: '本科',
                school: '中山大学',
                major: '数据科学',
                class_id: 1,
                counselor_id: 1001
            },
            {
                id: 5,
                name: '孙七',
                age: 22,
                gender: '男',
                address: '杭州市西湖区',
                academic: '研究生',
                school: '浙江大学',
                major: '机器学习',
                class_id: 2,
                counselor_id: 1002
            }
        ];
        
        studentsData = demoStudents;
        renderStudentTable();
        updateStats();
        showMessage('学生数据加载成功', 'success');
    } catch (error) {
        console.error('加载学生列表失败:', error);
        showMessage('加载失败：' + error.message, 'error');
    }
}

// 渲染学生表格
function renderStudentTable() {
    const tbody = document.getElementById('studentTableBody');
    tbody.innerHTML = '';
    
    if (studentsData.length === 0) {
        tbody.innerHTML = '<tr><td colspan="9" class="no-data">暂无数据</td></tr>';
        return;
    }
    
    const startIndex = (currentPage - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    const pageData = studentsData.slice(startIndex, endIndex);
    
    pageData.forEach(student => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${student.id}</td>
            <td>${student.name}</td>
            <td>${student.age}</td>
            <td>${student.gender}</td>
            <td>${student.academic}</td>
            <td>${student.school}</td>
            <td>${student.major}</td>
            <td>${student.class_id}</td>
            <td>
                <button class="btn btn-info" onclick="editStudent(${student.id})">编辑</button>
                <button class="btn btn-danger" onclick="deleteStudent(${student.id})">删除</button>
            </td>
        `;
        tbody.appendChild(row);
    });
    
    updatePageInfo();
}

// 更新统计信息
function updateStats() {
    document.getElementById('totalStudents').textContent = studentsData.length;
    document.getElementById('maleCount').textContent = studentsData.filter(s => s.gender === '男').length;
    document.getElementById('femaleCount').textContent = studentsData.filter(s => s.gender === '女').length;
    document.getElementById('employedCount').textContent = Math.floor(studentsData.length * 0.8); // 演示数据
}

// 更新分页信息
function updatePageInfo() {
    const totalPages = Math.ceil(studentsData.length / pageSize);
    document.getElementById('pageInfo').textContent = `第 ${currentPage} 页 / 共 ${totalPages || 1} 页`;
}

// 上一页
function prevPage() {
    if (currentPage > 1) {
        currentPage--;
        renderStudentTable();
    }
}

// 下一页
function nextPage() {
    const totalPages = Math.ceil(studentsData.length / pageSize);
    if (currentPage < totalPages) {
        currentPage++;
        renderStudentTable();
    }
}

// 搜索学生
function searchStudents() {
    const searchText = document.getElementById('searchInput').value.toLowerCase();
    const academicFilter = document.getElementById('academicFilter').value;
    
    let filtered = studentsData;
    
    if (searchText) {
        filtered = filtered.filter(s => 
            s.name.toLowerCase().includes(searchText) || 
            s.id.toString().includes(searchText)
        );
    }
    
    if (academicFilter) {
        filtered = filtered.filter(s => s.academic === academicFilter);
    }
    
    const tbody = document.getElementById('studentTableBody');
    tbody.innerHTML = '';
    
    if (filtered.length === 0) {
        tbody.innerHTML = '<tr><td colspan="9" class="no-data">未找到匹配的学生</td></tr>';
        return;
    }
    
    filtered.forEach(student => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${student.id}</td>
            <td>${student.name}</td>
            <td>${student.age}</td>
            <td>${student.gender}</td>
            <td>${student.academic}</td>
            <td>${student.school}</td>
            <td>${student.major}</td>
            <td>${student.class_id}</td>
            <td>
                <button class="btn btn-info" onclick="editStudent(${student.id})">编辑</button>
                <button class="btn btn-danger" onclick="deleteStudent(${student.id})">删除</button>
            </td>
        `;
        tbody.appendChild(row);
    });
}

// 显示添加学生模态框
function showAddStudentModal() {
    document.getElementById('modalTitle').textContent = '添加学生';
    document.getElementById('studentForm').reset();
    document.getElementById('studentModal').style.display = 'block';
}

// 显示编辑学生模态框
function editStudent(id) {
    const student = studentsData.find(s => s.id === id);
    if (student) {
        document.getElementById('modalTitle').textContent = '编辑学生';
        document.getElementById('studentId').value = student.id;
        document.getElementById('studentId').disabled = true;
        document.getElementById('studentName').value = student.name;
        document.getElementById('studentAge').value = student.age;
        document.getElementById('studentGender').value = student.gender;
        document.getElementById('studentAddress').value = student.address;
        document.getElementById('studentAcademic').value = student.academic;
        document.getElementById('studentSchool').value = student.school;
        document.getElementById('studentMajor').value = student.major;
        document.getElementById('studentClassId').value = student.class_id;
        document.getElementById('studentCounselorId').value = student.counselor_id;
        document.getElementById('studentModal').style.display = 'block';
    } else {
        showMessage('未找到该学生信息', 'error');
    }
}

// 关闭模态框
function closeModal() {
    document.getElementById('studentModal').style.display = 'none';
    document.getElementById('studentForm').reset();
    document.getElementById('studentId').disabled = false;
}

// 保存学生信息
async function saveStudent() {
    const formData = new FormData(document.getElementById('studentForm'));
    const studentData = {
        id: parseInt(formData.get('id')),
        name: formData.get('name'),
        age: parseInt(formData.get('age')),
        gender: formData.get('gender'),
        address: formData.get('address'),
        academic: formData.get('academic'),
        school: formData.get('school'),
        major: formData.get('major'),
        class_id: parseInt(formData.get('class_id')),
        counselor_id: parseInt(formData.get('counselor_id')),
        graduation_time: formData.get('graduation_time'),
        enrollment_time: formData.get('enrollment_time')
    };
    
    try {
        const response = await fetch('/student/add_student', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(studentData)
        });
        
        const result = await response.json();
        
        if (result.code === 200) {
            showMessage(result.message, 'success');
            closeModal();
            
            // 更新本地数据
            const index = studentsData.findIndex(s => s.id === studentData.id);
            if (index !== -1) {
                studentsData[index] = studentData;
            } else {
                studentsData.push(studentData);
            }
            
            renderStudentTable();
            updateStats();
        } else {
            showMessage('操作失败：' + result.message, 'error');
        }
    } catch (error) {
        console.error('保存学生信息失败:', error);
        // 演示模式：即使API调用失败也更新本地数据
        showMessage('保存成功（演示模式）', 'success');
        closeModal();
        
        const index = studentsData.findIndex(s => s.id === studentData.id);
        if (index !== -1) {
            studentsData[index] = studentData;
        } else {
            studentsData.push(studentData);
        }
        
        renderStudentTable();
        updateStats();
    }
}

// 删除学生
function deleteStudent(id) {
    if (!confirm('确定要删除该学生吗？')) {
        return;
    }
    
    // 从本地数据中删除
    const index = studentsData.findIndex(s => s.id === id);
    if (index !== -1) {
        studentsData.splice(index, 1);
        renderStudentTable();
        updateStats();
        showMessage('删除成功', 'success');
    } else {
        showMessage('未找到该学生信息', 'error');
    }
}

// 显示消息提示
function showMessage(message, type = 'info') {
    const toast = document.getElementById('messageToast');
    toast.textContent = message;
    toast.className = 'toast ' + type;
    toast.style.display = 'block';
    
    setTimeout(() => {
        toast.style.display = 'none';
    }, 3000);
}

// 点击模态框外部关闭
window.onclick = function(event) {
    const modal = document.getElementById('studentModal');
    if (event.target === modal) {
        closeModal();
    }
};
