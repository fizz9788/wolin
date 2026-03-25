// 多表查询 JavaScript

// 页面加载完成后初始化
document.addEventListener('DOMContentLoaded', function() {
    // 默认显示第一个选项卡
    switchTab('classInfo');
});

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
        showLoading();
        const response = await fetch(`/multi_query/class_stu_emp_info?class_id=${classId}`);
        const result = await response.json();
        
        const tbody = document.getElementById('classEmploymentTableBody');
        tbody.innerHTML = '';
        
        if (result.code === 200 && result.data) {
            result.data.forEach(student => {
                const empInfo = student.emp_info 
                    ? `公司: ${student.emp_info.emp_company_name || '-'}<br>薪资: ${student.emp_info.emp_salary || '-'}<br>Offer时间: ${student.emp_info.emp_offer_down_time || '-'}`
                    : '未就业';
                
                const row = document.createElement('tr');
                row.innerHTML = `
                    <td>${student.stu_id}</td>
                    <td>${student.stu_name}</td>
                    <td>${student.cls_id}</td>
                    <td>${student.cls_head_teacher}</td>
                    <td>${student.cls_teaching_teacher}</td>
                    <td>${empInfo}</td>
                `;
                tbody.appendChild(row);
            });
            showMessage('查询成功', 'success');
        } else {
            tbody.innerHTML = '<tr><td colspan="6" class="no-data">未找到该班级的就业信息</td></tr>';
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
                    emp_salary: 15000,
                    emp_offer_down_time: '2024-03-15'
                }
            },
            {
                stu_id: 2,
                stu_name: '李四',
                cls_id: classId,
                cls_head_teacher: '张老师',
                cls_teaching_teacher: '李老师',
                emp_info: null
            }
        ];
        
        demoData.forEach(student => {
            const empInfo = student.emp_info 
                ? `公司: ${student.emp_info.emp_company_name}<br>薪资: ${student.emp_info.emp_salary}<br>Offer时间: ${student.emp_info.emp_offer_down_time}`
                : '未就业';
            
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${student.stu_id}</td>
                <td>${student.stu_name}</td>
                <td>${student.cls_id}</td>
                <td>${student.cls_head_teacher}</td>
                <td>${student.cls_teaching_teacher}</td>
                <td>${empInfo}</td>
            `;
            tbody.appendChild(row);
        });
        showMessage('查询成功（演示数据）', 'success');
    } finally {
        hideLoading();
    }
}

// 查询学历平均工资
async function queryAvgSalary() {
    try {
        showLoading();
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
                `;
                tbody.appendChild(row);
            });
            showMessage('查询成功', 'success');
        } else {
            tbody.innerHTML = '<tr><td colspan="2" class="no-data">暂无数据</td></tr>';
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
            `;
            tbody.appendChild(row);
        });
        showMessage('查询成功（演示数据）', 'success');
    } finally {
        hideLoading();
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

// 显示加载中
function showLoading() {
    console.log('加载中...');
}

// 隐藏加载中
function hideLoading() {
    console.log('加载完成');
}
