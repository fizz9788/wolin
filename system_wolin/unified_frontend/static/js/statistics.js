// 数据统计 JavaScript

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

// 加载工资前5
async function loadTopSalary() {
    try {
        showMessage('正在加载数据...', 'info');
        const response = await fetch('/employment/statistics/salary');
        const result = await response.json();
        
        const tbody = document.getElementById('topSalaryTableBody');
        tbody.innerHTML = '';
        
        if (result.code === 200 && result.data) {
            result.data.forEach((student, index) => {
                const row = document.createElement('tr');
                const medal = index === 0 ? '🥇' : index === 1 ? '🥈' : index === 2 ? '🥉' : '';
                row.innerHTML = `
                    <td>${medal} ${index + 1}</td>
                    <td>${student.student_name}</td>
                    <td>${student.class_name}</td>
                    <td>${student.company_name}</td>
                    <td style="color: #28a745; font-weight: bold;">¥${student.salary.toLocaleString()}</td>
                    <td>${student.offer_down_time}</td>
                `;
                tbody.appendChild(row);
            });
            showMessage('数据加载成功', 'success');
        } else {
            tbody.innerHTML = '<tr><td colspan="6" class="no-data">暂无数据</td></tr>';
            showMessage('暂无数据', 'info');
        }
    } catch (error) {
        console.error('加载工资前5失败:', error);
        // 演示数据
        const tbody = document.getElementById('topSalaryTableBody');
        tbody.innerHTML = '';
        const demoData = [
            {
                student_name: '张三',
                class_name: '三班',
                company_name: '字节跳动',
                salary: 35000,
                offer_down_time: '2024-05-15'
            },
            {
                student_name: '李四',
                class_name: '二班',
                company_name: '阿里巴巴',
                salary: 30000,
                offer_down_time: '2024-04-10'
            },
            {
                student_name: '王五',
                class_name: '三班',
                company_name: '腾讯',
                salary: 28000,
                offer_down_time: '2024-04-20'
            },
            {
                student_name: '赵六',
                class_name: '一班',
                company_name: '美团',
                salary: 25000,
                offer_down_time: '2024-03-20'
            },
            {
                student_name: '孙七',
                class_name: '二班',
                company_name: '京东',
                salary: 23000,
                offer_down_time: '2024-05-25'
            }
        ];
        
        demoData.forEach((student, index) => {
            const medal = index === 0 ? '🥇' : index === 1 ? '🥈' : index === 2 ? '🥉' : '';
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${medal} ${index + 1}</td>
                <td>${student.student_name}</td>
                <td>${student.class_name}</td>
                <td>${student.company_name}</td>
                <td style="color: #28a745; font-weight: bold;">¥${student.salary.toLocaleString()}</td>
                <td>${student.offer_down_time}</td>
            `;
            tbody.appendChild(row);
        });
        showMessage('数据加载成功（演示数据）', 'success');
    }
}

// 加载就业时长
async function loadEmpTime() {
    try {
        showMessage('正在加载数据...', 'info');
        const response = await fetch('/employment/statistics/emp_time');
        const result = await response.json();
        
        const tbody = document.getElementById('empTimeTableBody');
        tbody.innerHTML = '';
        
        if (result.code === 200 && result.data) {
            result.data.forEach(student => {
                const row = document.createElement('tr');
                const days = student.emp_time || 0;
                const color = days < 30 ? '#dc3545' : days < 60 ? '#ffc107' : '#28a745';
                row.innerHTML = `
                    <td>${student.student_name}</td>
                    <td>${student.emp_open_time || '-'}</td>
                    <td>${student.offer_down_time || '-'}</td>
                    <td style="color: ${color}; font-weight: bold;">${days} 天</td>
                `;
                tbody.appendChild(row);
            });
            showMessage('数据加载成功', 'success');
        } else {
            tbody.innerHTML = '<tr><td colspan="4" class="no-data">暂无数据</td></tr>';
            showMessage('暂无数据', 'info');
        }
    } catch (error) {
        console.error('加载就业时长失败:', error);
        // 演示数据
        const tbody = document.getElementById('empTimeTableBody');
        tbody.innerHTML = '';
        const demoData = [
            {
                student_name: '张三',
                emp_open_time: '2024-01-15',
                offer_down_time: '2024-03-20',
                emp_time: 65
            },
            {
                student_name: '李四',
                emp_open_time: '2024-02-01',
                offer_down_time: '2024-04-10',
                emp_time: 68
            },
            {
                student_name: '王五',
                emp_open_time: '2024-03-01',
                offer_down_time: '2024-05-15',
                emp_time: 75
            },
            {
                student_name: '赵六',
                emp_open_time: '2024-02-15',
                offer_down_time: '2024-03-20',
                emp_time: 34
            },
            {
                student_name: '孙七',
                emp_open_time: '2024-03-10',
                offer_down_time: '2024-04-25',
                emp_time: 46
            }
        ];
        
        demoData.forEach(student => {
            const days = student.emp_time || 0;
            const color = days < 30 ? '#dc3545' : days < 60 ? '#ffc107' : '#28a745';
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${student.student_name}</td>
                <td>${student.emp_open_time}</td>
                <td>${student.offer_down_time}</td>
                <td style="color: ${color}; font-weight: bold;">${days} 天</td>
            `;
            tbody.appendChild(row);
        });
        showMessage('数据加载成功（演示数据）', 'success');
    }
}

// 加载班级平均就业时长
async function loadAvgEmpTime() {
    try {
        showMessage('正在加载数据...', 'info');
        const response = await fetch('/employment/statistics/avg_emp_time_class');
        const result = await response.json();
        
        const tbody = document.getElementById('avgEmpTimeTableBody');
        tbody.innerHTML = '';
        
        if (result.code === 200 && result.data) {
            result.data.forEach(item => {
                const row = document.createElement('tr');
                const avgTime = item.avg_emp_time || 0;
                const color = avgTime < 40 ? '#dc3545' : avgTime < 60 ? '#ffc107' : '#28a745';
                row.innerHTML = `
                    <td>${item.sclass}</td>
                    <td style="color: ${color}; font-weight: bold; font-size: 18px;">${avgTime} 天</td>
                `;
                tbody.appendChild(row);
            });
            showMessage('数据加载成功', 'success');
        } else {
            tbody.innerHTML = '<tr><td colspan="2" class="no-data">暂无数据</td></tr>';
            showMessage('暂无数据', 'info');
        }
    } catch (error) {
        console.error('加载班级平均就业时长失败:', error);
        // 演示数据
        const tbody = document.getElementById('avgEmpTimeTableBody');
        tbody.innerHTML = '';
        const demoData = [
            { sclass: '一班', avg_emp_time: 55.5 },
            { sclass: '二班', avg_emp_time: 62.3 },
            { sclass: '三班', avg_emp_time: 48.7 },
            { sclass: '四班', avg_emp_time: 58.9 },
            { sclass: '五班', avg_emp_time: 65.2 }
        ];
        
        demoData.forEach(item => {
            const avgTime = item.avg_emp_time || 0;
            const color = avgTime < 40 ? '#dc3545' : avgTime < 60 ? '#ffc107' : '#28a745';
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${item.sclass}</td>
                <td style="color: ${color}; font-weight: bold; font-size: 18px;">${avgTime} 天</td>
            `;
            tbody.appendChild(row);
        });
        showMessage('数据加载成功（演示数据）', 'success');
    }
}

// 刷新所有数据
function refreshAll() {
    const activeTab = document.querySelector('.tab-btn.active');
    if (activeTab) {
        const tabText = activeTab.textContent;
        if (tabText.includes('工资前5')) {
            loadTopSalary();
        } else if (tabText.includes('就业时长')) {
            loadEmpTime();
        } else if (tabText.includes('班级平均')) {
            loadAvgEmpTime();
        }
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
