document.addEventListener('DOMContentLoaded', () => {
    const historyList = document.getElementById('history-list');
    const conversations = JSON.parse(localStorage.getItem('conversationHistory')) || [];

    if (conversations.length === 0) {
        historyList.innerHTML = `<div class="empty-state">You don't have any previous conversations.</div>`;
        return;
    }

    conversations.forEach(conv => {
        // Get the last message in the array to show as a preview
        const lastMsg = conv.messages[conv.messages.length - 1].text;
        
        const card = document.createElement('div');
        card.className = 'history-card';
        card.innerHTML = `
            <div class="card-left">
                <div class="card-meta">
                    <span class="conv-id">${conv.id}</span>
                    <span class="conv-date">${conv.date}</span>
                    <span class="conv-tag">${conv.tag}</span>
                </div>
                <div class="last-message">"${lastMsg}"</div>
            </div>
            <a href="index.html?id=${conv.id}" class="view-btn">Resume Chat</a>
        `;
        
        historyList.appendChild(card);
    });
});