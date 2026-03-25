// 主页 JavaScript
document.addEventListener('DOMContentLoaded', function() {
    // 添加卡片悬停效果
    const cards = document.querySelectorAll('.nav-card');
    cards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-10px)';
        });
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0)';
        });
    });

    // 快捷链接悬停效果
    const links = document.querySelectorAll('.link-btn');
    links.forEach(link => {
        link.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-3px)';
        });
        link.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0)';
        });
    });
});
