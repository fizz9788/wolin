// 就业管理 JavaScript
let employmentData = [];
let currentPage = 1;
let pageSize = 10;

// 页面加载完成后初始化
document.addEventListener('DOMContentLoaded', function() {
    loadEmployments();
    
    // 表单提交事件
    document.getElementById('employmentForm').addEventListener('submit', function(e) {
        e.preventDefault();
        saveEmployment();
    });
});

// 加载就业信息列表
async function loadEmployments() {
    try {
        showMessage('正在加载就业数据...', 'info');
        
        // 演示数据
        const demoEmployments = [
            {
                student_id: 1,
                student_name: '张三',
                class_name: '一班',
                emp_open_time: '2024-01-15',
                offer_down_time: '2024-03-20',
                company_name: '腾讯',
                salary: 25000
            },
            {
                student_id: 2,
                student_name: '李四',
                class_name: '二班',
                emp_open_time: '2024-02-01',
                offer_down_time: '2024-04-10',
                company_name: '阿里巴巴',
                salary: 30000
            },
            {
                student_id: 3,
                student_name: '王五',
                class_name: '三班',
                emp_open_time: '2024-03-01',
                offer_down_time: '2024-05-15',
                company_name: '字节跳动',
                salary: 35000
            },
            {
                student_id: 4,
                student_name: '赵六',
                class_name: '一班',
                emp_open_time: '2024-02-15',
                offer_down_time: '2024-04-20',
                company_name: '美团',
                salary: 22000
            },
            {
                student_id: 5,
                student_name: '孙七',
                class_name: '二班',
                emp_open_time: '2024-03-10',
                offer_down_time: '2024-05-25',
                company_name: '京东',
                salary: 28000
            }
        ];
        
        employmentData = demoEmployments;
        renderEmploymentTable();
        updateStats();
        showMessage('就业数据加载成功', 'success');
    } catch (error) {
        console.error('加载就业信息失败:', error);
        showMessage('加载失败：' + error.message, 'error');
    }
}

// 渲染就业信息表格
function renderEmploymentTable() {
    const tbody = document.getElementById('employmentTableBody');
    tbody.innerHTML = '';
    
    if (employmentData.length === 0) {
        tbody.innerHTML = '<tr><td colspan="8" class="no-data">暂无数据</td></tr>';
        return;
    }
    
    const startIndex = (currentPage - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    const pageData = employmentData.slice(startIndex, endIndex);
    
    pageData.forEach(emp => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${emp.student_id}</td>
            <td>${emp.student_name}</td>
            <td>${emp.class_name}</td>
            <td>${emp.company_name}</td>
            <td>¥${emp.salary.toLocaleString()}</td>
            <td>${emp.emp_open_time}</td>
            <td>${emp.offer_down_time}</td>
            <td>
                <button class="btn btn-info" onclick="editEmployment(${emp.student_id})">编辑</button>
                <button class="btn btn-danger" onclick="deleteEmployment(${emp.student_id})">删除</button>
            </td>
        `;
        tbody.appendChild(row);
    });
    
    updatePageInfo();
}

// 更新统计信息
function updateStats() {
    if (employmentData.length === 0) {
        document.getElementById('employedCount').textContent = '0';
        document.getElementById('avgSalary').textContent = '¥0';
        document.getElementById('maxSalaryStat').textContent = '¥0';
        document.getElementById('minSalaryStat').textContent = '¥0';
        return;
    }
    
    document.getElementById('employedCount').textContent = employmentData.length;
    
    const salaries = employmentData.map(e => e.salary);
    const avgSalary = Math.round(salaries.reduce((a, b) => a + b, 0) / salaries.length);
    const maxSalary = Math.max(...salaries);
    const minSalary = Math.min(...salaries);
    
    document.getElementById('avgSalary').textContent = '¥' + avgSalary.toLocaleString();
    document.getElementById('maxSalaryStat').textContent = '¥' + maxSalary.toLocaleString();
    document.getElementById('minSalaryStat').textContent = '¥' + minSalary.toLocaleString();
}

// 更新分页信息
function updatePageInfo() {
    const totalPages = Math.ceil(employmentData.length / pageSize);
    document.getElementById('pageInfo').textContent = `第 ${currentPage} 页 / 共 ${totalPages || 1} 页`;
}

// 上一页
function prevPage() {
    if (currentPage > 1) {
        currentPage--;
        renderEmploymentTable();
    }
}

// 下一页
function nextPage() {
    const totalPages = Math.ceil(employmentData.length / pageSize);
    if (currentPage < totalPages) {
        currentPage++;
        renderEmploymentTable();
    }
}

// 搜索就业信息
function searchEmployments() {
    const searchText = document.getElementById('searchInput').value.toLowerCase();
    
    let filtered = employmentData;
    
    if (searchText) {
        filtered = filtered.filter(e => 
            e.student_name.toLowerCase().includes(searchText) || 
            e.class_name.toLowerCase().includes(searchText) ||
            e.company_name.toLowerCase().includes(searchText) ||
            e.student_id.toString().includes(searchText)
        );
    }
    
    const tbody = document.getElementById('employmentTableBody');
    tbody.innerHTML = '';
    
    if (filtered.length === 0) {
        tbody.innerHTML = '<tr><td colspan="8" class="no-data">未找到匹配的就业信息</td></tr>';
        return;
    }
    
    filtered.forEach(emp => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${emp.student_id}</td>
            <td>${emp.student_name}</td>
            <td>${emp.class_name}</td>
            <td>${emp.company_name}</td>
            <td>¥${emp.salary.toLocaleString()}</td>
            <td>${emp.emp_open_time}</td>
            <td>${emp.offer_down_time}</td>
            <td>
                <button class="btn btn-info" onclick="editEmployment(${emp.student_id})">编辑</button>
                <button class="btn btn-danger" onclick="deleteEmployment(${emp.student_id})">删除</button>
            </td>
        `;
        tbody.appendChild(row);
    });
}

// 按薪资筛选
function filterBySalary() {
    const minSalary = parseInt(document.getElementById('minSalary').value);
    const maxSalary = parseInt(document.getElementById('maxSalary').value);
    
    let filtered = employmentData;
    
    if (!isNaN(minSalary)) {
        filtered = filtered.filter(e => e.salary >= minSalary);
    }
    
    if (!isNaN(maxSalary)) {
        filtered = filtered.filter(e => e.salary <= maxSalary);
    }
    
    const tbody = document.getElementById('employmentTableBody');
    tbody.innerHTML = '';
    
    if (filtered.length === 0) {
        tbody.innerHTML = '<tr><td colspan="8" class="no-data">未找到符合条件的就业信息</td></tr>';
        return;
    }
    
    filtered.forEach(emp => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${emp.student_id}</td>
            <td>${emp.student_name}</td>
            <td>${emp.class_name}</td>
            <td>${emp.company_name}</td>
            <td>¥${emp.salary.toLocaleString()}</td>
            <td>${emp.emp_open_time}</td>
            <td>${emp.offer_down_time}</td>
            <td>
                <button class="btn btn-info" onclick="editEmployment(${emp.student_id})">编辑</button>
                <button class="btn btn-danger" onclick="deleteEmployment(${emp.student_id})">删除</button>
            </td>
        `;
        tbody.appendChild(row);
    });
}

// 显示添加就业信息模态框
function showAddEmploymentModal() {
    document.getElementById('modalTitle').textContent = '添加就业信息';
    document.getElementById('employmentForm').reset();
    document.getElementById('employmentModal').style.display = 'block';
}

// 显示编辑就业信息模态框
function editEmployment(id) {
    const emp = employmentData.find(e => e.student_id === id);
    if (emp) {
        document.getElementById('modalTitle').textContent = '编辑就业信息';
        document.getElementById('studentId').value = emp.student_id;
        document.getElementById('studentId').disabled = true;
        document.getElementById('studentName').value = emp.student_name;
        document.getElementById('className').value = emp.class_name;
        document.getElementById('empOpenTime').value = emp.emp_open_time;
        document.getElementById('offerDownTime').value = emp.offer_down_time;
        document.getElementById('companyName').value = emp.company_name;
        document.getElementById('salary').value = emp.salary;
        document.getElementById('employmentModal').style.display = 'block';
    } else {
        showMessage('未找到该就业信息', 'error');
    }
}

// 关闭模态框
function closeModal() {
    document.getElementById('employmentModal').style.display = 'none';
    document.getElementById('employmentForm').reset();
    document.getElementById('studentId').disabled = false;
}

// 保存就业信息
async function saveEmployment() {
    const formData = new FormData(document.getElementById('employmentForm'));
    const employmentInfo = {
        student_id: parseInt(formData.get('student_id')),
        student_name: formData.get('student_name'),
        class_name: formData.get('class_name'),
        emp_open_time: formData.get('emp_open_time'),
        offer_down_time: formData.get('offer_down_time'),
        company_name: formData.get('company_name'),
        salary: parseInt(formData.get('salary'))
    };
    
    try {
        const response = await fetch('/employment/students/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(employmentInfo)
        });
        
        const result = await response.json();
        
        if (result.code === 200) {
            showMessage(result.message, 'success');
            closeModal();
            
            // 更新本地数据
            const index = employmentData.findIndex(e => e.student_id === employmentInfo.student_id);
            if (index !== -1) {
                employmentData[index] = employmentInfo;
            } else {
                employmentData.push(employmentInfo);
            }
            
            renderEmploymentTable();
            updateStats();
        } else {
            showMessage('操作失败：' + result.message, 'error');
        }
    } catch (error) {
        console.error('保存就业信息失败:', error);
        // 演示模式：即使API调用失败也更新本地数据
        showMessage('保存成功（演示模式）', 'success');
        closeModal();
        
        const index = employmentData.findIndex(e => e.student_id === employmentInfo.student_id);
        if (index !== -1) {
            employmentData[index] = employmentInfo;
        } else {
            employmentData.push(employmentInfo);
        }
        
        renderEmploymentTable();
        updateStats();
    }
}

// 删除就业信息
function deleteEmployment(id) {
    if (!confirm('确定要删除该就业信息吗？')) {
        return;
    }
    
    // 从本地数据中删除
    const index = employmentData.findIndex(e => e.student_id === id);
    if (index !== -1) {
        employmentData.splice(index, 1);
        renderEmploymentTable();
        updateStats();
        showMessage('删除成功', 'success');
    } else {
        showMessage('未找到该就业信息', 'error');
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
    const modal = document.getElementById('employmentModal');
    if (event.target === modal) {
        closeModal();
    }
};
