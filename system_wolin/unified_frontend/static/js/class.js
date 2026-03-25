// 班级管理 JavaScript
let classesData = [];
let currentPage = 1;
let pageSize = 10;

// 页面加载完成后初始化
document.addEventListener('DOMContentLoaded', function() {
    loadClasses();
    
    // 表单提交事件
    document.getElementById('classForm').addEventListener('submit', function(e) {
        e.preventDefault();
        saveClass();
    });
});

// 加载班级列表
async function loadClasses() {
    try {
        showMessage('正在加载班级数据...', 'info');
        
        // 演示数据
        const demoClasses = [
            {
                id: 1,
                start_date: '2024-03-01',
                head_teacher: '张老师',
                teaching_teacher: '李老师',
                student_count: 30,
                employed_count: 25
            },
            {
                id: 2,
                start_date: '2024-06-01',
                head_teacher: '王老师',
                teaching_teacher: '赵老师',
                student_count: 28,
                employed_count: 22
            },
            {
                id: 3,
                start_date: '2024-09-01',
                head_teacher: '刘老师',
                teaching_teacher: '陈老师',
                student_count: 32,
                employed_count: 18
            },
            {
                id: 4,
                start_date: '2024-01-01',
                head_teacher: '周老师',
                teaching_teacher: '吴老师',
                student_count: 25,
                employed_count: 20
            },
            {
                id: 5,
                start_date: '2024-04-01',
                head_teacher: '郑老师',
                teaching_teacher: '冯老师',
                student_count: 30,
                employed_count: 26
            }
        ];
        
        classesData = demoClasses;
        renderClassTable();
        updateStats();
        showMessage('班级数据加载成功', 'success');
    } catch (error) {
        console.error('加载班级列表失败:', error);
        showMessage('加载失败：' + error.message, 'error');
    }
}

// 渲染班级表格
function renderClassTable() {
    const tbody = document.getElementById('classTableBody');
    tbody.innerHTML = '';
    
    if (classesData.length === 0) {
        tbody.innerHTML = '<tr><td colspan="7" class="no-data">暂无数据</td></tr>';
        return;
    }
    
    const startIndex = (currentPage - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    const pageData = classesData.slice(startIndex, endIndex);
    
    pageData.forEach(cls => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${cls.id}</td>
            <td>${cls.start_date}</td>
            <td>${cls.head_teacher}</td>
            <td>${cls.teaching_teacher}</td>
            <td>${cls.student_count || '-'}</td>
            <td>${cls.employed_count || '-'}</td>
            <td>
                <button class="btn btn-info" onclick="editClass(${cls.id})">编辑</button>
                <button class="btn btn-danger" onclick="deleteClass(${cls.id})">删除</button>
            </td>
        `;
        tbody.appendChild(row);
    });
    
    updatePageInfo();
}

// 更新统计信息
function updateStats() {
    document.getElementById('totalClasses').textContent = classesData.length;
    document.getElementById('totalStudents').textContent = classesData.reduce((sum, c) => sum + (c.student_count || 0), 0);
    document.getElementById('totalTeachers').textContent = [...new Set(classesData.map(c => c.head_teacher))].length;
}

// 更新分页信息
function updatePageInfo() {
    const totalPages = Math.ceil(classesData.length / pageSize);
    document.getElementById('pageInfo').textContent = `第 ${currentPage} 页 / 共 ${totalPages || 1} 页`;
}

// 上一页
function prevPage() {
    if (currentPage > 1) {
        currentPage--;
        renderClassTable();
    }
}

// 下一页
function nextPage() {
    const totalPages = Math.ceil(classesData.length / pageSize);
    if (currentPage < totalPages) {
        currentPage++;
        renderClassTable();
    }
}

// 搜索班级
function searchClasses() {
    const searchText = document.getElementById('searchInput').value.toLowerCase();
    
    let filtered = classesData;
    
    if (searchText) {
        filtered = filtered.filter(c => 
            c.head_teacher.toLowerCase().includes(searchText) || 
            c.teaching_teacher.toLowerCase().includes(searchText) ||
            c.id.toString().includes(searchText)
        );
    }
    
    const tbody = document.getElementById('classTableBody');
    tbody.innerHTML = '';
    
    if (filtered.length === 0) {
        tbody.innerHTML = '<tr><td colspan="7" class="no-data">未找到匹配的班级</td></tr>';
        return;
    }
    
    filtered.forEach(cls => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${cls.id}</td>
            <td>${cls.start_date}</td>
            <td>${cls.head_teacher}</td>
            <td>${cls.teaching_teacher}</td>
            <td>${cls.student_count || '-'}</td>
            <td>${cls.employed_count || '-'}</td>
            <td>
                <button class="btn btn-info" onclick="editClass(${cls.id})">编辑</button>
                <button class="btn btn-danger" onclick="deleteClass(${cls.id})">删除</button>
            </td>
        `;
        tbody.appendChild(row);
    });
}

// 显示添加班级模态框
function showAddClassModal() {
    document.getElementById('modalTitle').textContent = '添加班级';
    document.getElementById('classForm').reset();
    document.getElementById('classModal').style.display = 'block';
}

// 显示编辑班级模态框
function editClass(id) {
    const cls = classesData.find(c => c.id === id);
    if (cls) {
        document.getElementById('modalTitle').textContent = '编辑班级';
        document.getElementById('classId').value = cls.id;
        document.getElementById('classId').disabled = true;
        document.getElementById('startDate').value = cls.start_date;
        document.getElementById('headTeacher').value = cls.head_teacher;
        document.getElementById('teachingTeacher').value = cls.teaching_teacher;
        document.getElementById('classModal').style.display = 'block';
    } else {
        showMessage('未找到该班级信息', 'error');
    }
}

// 关闭模态框
function closeModal() {
    document.getElementById('classModal').style.display = 'none';
    document.getElementById('classForm').reset();
    document.getElementById('classId').disabled = false;
}

// 保存班级信息
async function saveClass() {
    const formData = new FormData(document.getElementById('classForm'));
    const classData = {
        id: parseInt(formData.get('id')),
        start_date: formData.get('start_date'),
        head_teacher: formData.get('head_teacher'),
        teaching_teacher: formData.get('teaching_teacher')
    };
    
    try {
        const response = await fetch('/class/updata_classinfo', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(classData)
        });
        
        const result = await response.json();
        
        if (result.code === 200) {
            showMessage(result.message, 'success');
            closeModal();
            
            // 更新本地数据
            const index = classesData.findIndex(c => c.id === classData.id);
            if (index !== -1) {
                classesData[index] = { ...classesData[index], ...classData };
            } else {
                classesData.push({ ...classData, student_count: 0, employed_count: 0 });
            }
            
            renderClassTable();
            updateStats();
        } else {
            showMessage('操作失败：' + result.message, 'error');
        }
    } catch (error) {
        console.error('保存班级信息失败:', error);
        // 演示模式：即使API调用失败也更新本地数据
        showMessage('保存成功（演示模式）', 'success');
        closeModal();
        
        const index = classesData.findIndex(c => c.id === classData.id);
        if (index !== -1) {
            classesData[index] = { ...classesData[index], ...classData };
        } else {
            classesData.push({ ...classData, student_count: 0, employed_count: 0 });
        }
        
        renderClassTable();
        updateStats();
    }
}

// 删除班级
function deleteClass(id) {
    if (!confirm('确定要删除该班级吗？')) {
        return;
    }
    
    // 从本地数据中删除
    const index = classesData.findIndex(c => c.id === id);
    if (index !== -1) {
        classesData.splice(index, 1);
        renderClassTable();
        updateStats();
        showMessage('删除成功', 'success');
    } else {
        showMessage('未找到该班级信息', 'error');
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
    const modal = document.getElementById('classModal');
    if (event.target === modal) {
        closeModal();
    }
};
