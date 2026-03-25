// TEXT2SQL 页面交互逻辑

// 会话ID（用于多轮对话）
const SESSION_ID = 'session_' + Date.now();

// 页面加载完成后初始化
document.addEventListener('DOMContentLoaded', function() {
    loadHistory();

    // 为输入框添加键盘事件
    const input = document.getElementById('questionInput');
    input.addEventListener('keydown', function(e) {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            submitQuery();
        }
    });
});

// 提交查询
async function submitQuery() {
    const question = document.getElementById('questionInput').value.trim();

    if (!question) {
        showMessage('请输入您的问题', 'error');
        return;
    }

    // 显示加载动画
    showLoading(true);
    clearMessages();

    try {
        // 发送请求
        const response = await fetch('/ai/text2sql', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                question: question,
                session_id: SESSION_ID
            })
        });

        const result = await response.json();

        // 隐藏加载动画
        showLoading(false);

        if (result.code === 200) {
            // 查询成功
            displaySQL(result.data.sql);
            displayResult(result.data);
            showMessage(result.message, 'success');
            loadHistory(); // 重新加载历史记录
        } else {
            // 查询失败
            showMessage(result.message || '查询失败', 'error');
        }
    } catch (error) {
        showLoading(false);
        console.error('查询失败:', error);
        showMessage('网络请求失败，请稍后重试', 'error');
    }
}

// 显示 SQL 语句
function displaySQL(sql) {
    const sqlSection = document.getElementById('sqlSection');
    const sqlCode = document.getElementById('sqlCode');

    sqlSection.style.display = 'block';
    sqlCode.textContent = sql;
}

// 显示查询结果
function displayResult(data) {
    const resultSection = document.getElementById('resultSection');
    const tableHead = document.getElementById('tableHead');
    const tableBody = document.getElementById('tableBody');
    const rowCount = document.getElementById('rowCount');
    const executionTime = document.getElementById('executionTime');

    // 显示结果区域
    resultSection.style.display = 'block';

    // 显示统计信息
    rowCount.textContent = `记录数：${data.data.length}`;
    executionTime.textContent = `执行时间：${data.execution_time}s`;

    // 构建表头
    tableHead.innerHTML = '<tr>' + data.columns.map(col => `<th>${col}</th>`).join('') + '</tr>';

    // 构建表体
    if (data.data.length > 0) {
        tableBody.innerHTML = data.data.map(row => {
            return '<tr>' + data.columns.map(col => {
                const value = row[col];
                const displayValue = value === null || value === undefined ? '-' : value;
                return `<td>${displayValue}</td>`;
            }).join('') + '</tr>';
        }).join('');
    } else {
        tableBody.innerHTML = '<tr><td colspan="' + data.columns.length + '" class="no-data">查询结果为空</td></tr>';
    }
}

// 显示/隐藏加载动画
function showLoading(show) {
    document.getElementById('loading').style.display = show ? 'block' : 'none';
}

// 显示消息
function showMessage(message, type) {
    const messageArea = document.getElementById('messageArea');
    const messageDiv = document.createElement('div');
    messageDiv.className = type === 'error' ? 'error-message' : 'success-message';
    messageDiv.textContent = message;

    messageArea.innerHTML = '';
    messageArea.appendChild(messageDiv);

    // 5秒后自动隐藏成功消息
    if (type === 'success') {
        setTimeout(() => {
            messageDiv.style.opacity = '0';
            setTimeout(() => messageDiv.remove(), 300);
        }, 5000);
    }
}

// 清除消息
function clearMessages() {
    document.getElementById('messageArea').innerHTML = '';
}

// 清空输入
function clearInput() {
    document.getElementById('questionInput').value = '';
    document.getElementById('questionInput').focus();
}

// 加载查询历史
async function loadHistory() {
    try {
        const response = await fetch(`/ai/history/${SESSION_ID}`);
        const result = await response.json();

        const historyList = document.getElementById('historyList');

        if (result.code === 200 && result.data.length > 0) {
            historyList.innerHTML = result.data.map(item => `
                <div class="history-item">
                    <div class="history-question">❓ ${item.question}</div>
                    <div class="history-time">${item.time}</div>
                </div>
            `).join('');
        } else {
            historyList.innerHTML = '<p class="no-data">暂无查询历史</p>';
        }
    } catch (error) {
        console.error('加载历史记录失败:', error);
    }
}

// 清除历史记录
async function clearHistory() {
    if (!confirm('确定要清除所有查询历史吗？')) {
        return;
    }

    try {
        const response = await fetch(`/ai/history/${SESSION_ID}`, {
            method: 'DELETE'
        });

        const result = await response.json();

        if (result.code === 200) {
            showMessage('查询历史已清除', 'success');
            loadHistory();
            // 清空结果显示
            document.getElementById('resultSection').style.display = 'none';
            document.getElementById('sqlSection').style.display = 'none';
            document.getElementById('questionInput').value = '';
        } else {
            showMessage('清除历史记录失败', 'error');
        }
    } catch (error) {
        console.error('清除历史记录失败:', error);
        showMessage('操作失败，请稍后重试', 'error');
    }
}
