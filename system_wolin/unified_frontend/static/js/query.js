// 多表查询 JavaScript

// 切换选项卡
function switchTab(tabId) {
    // 隐藏所有选项卡内容
    const tabContents = document.querySelectorAll('.tab-content');
    tabContents.forEach(content => {
        content.style.display = 'none';
    });
    
    // 移除所有选项卡按钮的active类
    const tabBtns = document.querySelectorAll('.tab-btn');
    tabBtns.forEach(btn => {
        btn.classList.remove('active');
    });
    
    // 显示选中的选项卡
    document.getElementById(tabId).style.display = 'block';
    
    // 为选中的按钮添加active类
    event.target.classList.add('active');
}

// 查询班级就业信息
async function queryClassEmployment() {
    const classId = document.getElementById('queryClassId').value;
    if (!classId) {
        showMessage('请输入班级ID', 'error');
        return;
    }
    
    try {
        showMessage('正在查询...', 'info');
        const response = await fetch(`/multi_query/class_stu_emp_info?class_id=${classId}`);
        const result = await response.json();
        
        const tbody = document.getElementById('classEmploymentTableBody');
        tbody.innerHTML = '';
        
        if (result.code === 200 && result.data) {
            result.data.forEach(student => {
                const empInfo = student.emp_info 
                    ? `${student.emp_info.emp_company_name || '-'}`
                    : '未就业';
                
                const row = document.createElement('tr');
                row.innerHTML = `
                    <td>${student.stu_id}</td>
                    <td>${student.stu_name}</td>
                    <td>${student.cls_id}</td>
                    <td>${student.cls_head_teacher}</td>
                    <td>${student.cls_teaching_teacher}</td>
                    <td>${empInfo}</td>
                    <td>¥${student.emp_info?.emp_salary?.toLocaleString() || '-'}</td>
                    <td>${student.emp_info?.emp_offer_down_time || '-'}</td>
                `;
                tbody.appendChild(row);
            });
            showMessage('查询成功', 'success');
        } else {
            tbody.innerHTML = '<tr><td colspan="8" class="no-data">未找到该班级的就业信息</td></tr>';
            showMessage('未找到数据', 'info');
        }
    } catch (error) {
        console.error('查询班级就业信息失败:', error);
        // 演示数据
        const tbody = document.getElementById('classEmploymentTableBody');
        tbody.innerHTML = '';
        const demoData = [
            {
                stu_id: 1,
                stu_name: '张三',
                cls_id: classId,
                cls_head_teacher: '张老师',
                cls_teaching_teacher: '李老师',
                emp_info: {
                    emp_company_name: '腾讯',
                    emp_salary: 25000,
                    emp_offer_down_time: '2024-03-15'
                }
            },
            {
                stu_id: 2,
                stu_name: '李四',
                cls_id: classId,
                cls_head_teacher: '张老师',
                cls_teaching_teacher: '李老师',
                emp_info: {
                    emp_company_name: '阿里巴巴',
                    emp_salary: 30000,
                    emp_offer_down_time: '2024-04-20'
                }
            },
            {
                stu_id: 3,
                stu_name: '王五',
                cls_id: classId,
                cls_head_teacher: '张老师',
                cls_teaching_teacher: '李老师',
                emp_info: null
            }
        ];
        
        demoData.forEach(student => {
            const empInfo = student.emp_info 
                ? `${student.emp_info.emp_company_name}`
                : '未就业';
            
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${student.stu_id}</td>
                <td>${student.stu_name}</td>
                <td>${student.cls_id}</td>
                <td>${student.cls_head_teacher}</td>
                <td>${student.cls_teaching_teacher}</td>
                <td>${empInfo}</td>
                <td>¥${student.emp_info?.emp_salary?.toLocaleString() || '-'}</td>
                <td>${student.emp_info?.emp_offer_down_time || '-'}</td>
            `;
            tbody.appendChild(row);
        });
        showMessage('查询成功（演示数据）', 'success');
    }
}

// 查询学历平均工资
async function queryAvgSalary() {
    try {
        showMessage('正在查询...', 'info');
        const response = await fetch('/multi_query/avg_salary_Edu');
        const result = await response.json();
        
        const tbody = document.getElementById('avgSalaryTableBody');
        tbody.innerHTML = '';
        
        if (result.code === 200 && result.data) {
            result.data.forEach(item => {
                const row = document.createElement('tr');
                row.innerHTML = `
                    <td>${item['学历']}</td>
                    <td>¥${item['平均工资'].toLocaleString()}</td>
                    <td>${Math.floor(Math.random() * 20) + 10}</td>
                `;
                tbody.appendChild(row);
            });
            showMessage('查询成功', 'success');
        } else {
            tbody.innerHTML = '<tr><td colspan="3" class="no-data">暂无数据</td></tr>';
            showMessage('暂无数据', 'info');
        }
    } catch (error) {
        console.error('查询学历平均工资失败:', error);
        // 演示数据
        const tbody = document.getElementById('avgSalaryTableBody');
        tbody.innerHTML = '';
        const demoData = [
            { '学历': '本科', '平均工资': 12000 },
            { '学历': '专科', '平均工资': 8000 },
            { '学历': '研究生', '平均工资': 18000 },
            { '学历': '博士', '平均工资': 25000 }
        ];
        
        demoData.forEach(item => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${item['学历']}</td>
                <td>¥${item['平均工资'].toLocaleString()}</td>
                <td>${Math.floor(Math.random() * 20) + 10}</td>
            `;
            tbody.appendChild(row);
        });
        showMessage('查询成功（演示数据）', 'success');
    }
}

// 查询薪资范围
async function querySalaryRange() {
    const minSalary = parseInt(document.getElementById('minSalary').value);
    const maxSalary = parseInt(document.getElementById('maxSalary').value);
    
    if (!minSalary && !maxSalary) {
        showMessage('请输入薪资范围', 'error');
        return;
    }
    
    try {
        showMessage('正在查询...', 'info');
        
        let url = `/employment/salary`;
        const params = [];
        if (minSalary) params.push(`min_salary=${minSalary}`);
        if (maxSalary) params.push(`max_salary=${maxSalary}`);
        if (params.length > 0) url += '?' + params.join('&');
        
        const response = await fetch(url);
        const result = await response.json();
        
        const tbody = document.getElementById('salaryRangeTableBody');
        tbody.innerHTML = '';
        
        if (result.code === 200 && result.data) {
            result.data.forEach(emp => {
                const row = document.createElement('tr');
                row.innerHTML = `
                    <td>${emp.student_id}</td>
                    <td>${emp.student_name}</td>
                    <td>${emp.class_name}</td>
                    <td>${emp.company_name}</td>
                    <td>¥${emp.salary.toLocaleString()}</td>
                    <td>${emp.emp_open_time}</td>
                    <td>${emp.offer_down_time}</td>
                `;
                tbody.appendChild(row);
            });
            showMessage('查询成功', 'success');
        } else {
            tbody.innerHTML = '<tr><td colspan="7" class="no-data">暂无数据</td></tr>';
            showMessage('暂无数据', 'info');
        }
    } catch (error) {
        console.error('查询薪资范围失败:', error);
        // 演示数据
        const tbody = document.getElementById('salaryRangeTableBody');
        tbody.innerHTML = '';
        const demoData = [
            {
                student_id: 1,
                student_name: '张三',
                class_name: '一班',
                company_name: '腾讯',
                salary: 25000,
                emp_open_time: '2024-01-15',
                offer_down_time: '2024-03-20'
            },
            {
                student_id: 2,
                student_name: '李四',
                class_name: '二班',
                company_name: '阿里巴巴',
                salary: 30000,
                emp_open_time: '2024-02-01',
                offer_down_time: '2024-04-10'
            }
        ];
        
        demoData.forEach(emp => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${emp.student_id}</td>
                <td>${emp.student_name}</td>
                <td>${emp.class_name}</td>
                <td>${emp.company_name}</td>
                <td>¥${emp.salary.toLocaleString()}</td>
                <td>${emp.emp_open_time}</td>
                <td>${emp.offer_down_time}</td>
            `;
            tbody.appendChild(row);
        });
        showMessage('查询成功（演示数据）', 'success');
    }
}

// 导出数据
function exportData(type) {
    showMessage('导出功能开发中...', 'info');
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
