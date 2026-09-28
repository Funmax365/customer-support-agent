document.addEventListener('DOMContentLoaded', () => {
    // DOM Elements
    const dashUserName = document.getElementById('dash-user-name');
    const statOpenTickets = document.getElementById('stat-open-tickets');
    const statResolvedTickets = document.getElementById('stat-resolved-tickets');
    const statConversations = document.getElementById('stat-conversations');
    const statUnread = document.getElementById('stat-unread');
    
    const recentTicketsList = document.getElementById('recent-tickets-list');
    const recentChatCard = document.getElementById('recent-chat-card');

    // Load Data from LocalStorage
    const userProfile = JSON.parse(localStorage.getItem('userProfile')) || { name: 'Customer' };
    const tickets = JSON.parse(localStorage.getItem('supportTickets')) || [];
    const history = JSON.parse(localStorage.getItem('conversationHistory')) || [];

    // Helper for Status Badges
    function getStatusBadgeHTML(status) {
        let badgeClass = 'bg-closed';
        if (status === 'Open') badgeClass = 'bg-open-med';
        if (status === 'In Progress') badgeClass = 'bg-progress';
        if (status === 'Resolved') badgeClass = 'bg-resolved-low';
        return `<span class="badge ${badgeClass}">${status}</span>`;
    }

    // 1. Greet User
    if (userProfile.name) {
        const firstName = userProfile.name;
        dashUserName.textContent = firstName;
    }

    // 2. Calculate Statistics dynamically using filter() and length 
    const openTicketsCount = tickets.filter(t => t.status === 'Open').length;
    const resolvedTicketsCount = tickets.filter(t => t.status === 'Resolved').length;
    const activeConversationsCount = history.length;
    const unreadMessagesCount = 0; 

    // Inject Stats
    statOpenTickets.textContent = openTicketsCount;
    statResolvedTickets.textContent = resolvedTicketsCount;
    statConversations.textContent = activeConversationsCount;
    statUnread.textContent = unreadMessagesCount;

    // 3. Render Recent Tickets (Limit to 3)
    if (tickets.length === 0) {
        recentTicketsList.innerHTML = `<div style="text-align: center; color: var(--text-muted); padding: 20px 0;">You don't have any support tickets yet.</div>`;
    } else {
        const recentTickets = tickets.slice(0, 3);
        recentTicketsList.innerHTML = ''; // Clear loading state
        
        recentTickets.forEach(t => {
            const row = document.createElement('div');
            row.className = 'recent-ticket-row';
            row.innerHTML = `
                <div class="ticket-info">
                    <span class="ticket-title">${t.subject}</span>
                    <span class="ticket-id">${t.id}</span>
                </div>
                <div>${getStatusBadgeHTML(t.status)}</div>
            `;
            recentTicketsList.appendChild(row);
        });
    }

    // 4. Rendering Latest Chat Activity
    if (history.length === 0) {
        recentChatCard.innerHTML = `<p>No recent chat activity.</p>`;
    } else {
        const latestChat = history[0];
        const lastMsg = latestChat.messages[latestChat.messages.length - 1];
        
        recentChatCard.innerHTML = `
            <div style="display:flex; justify-content:space-between; margin-bottom: 4px;">
                <strong style="font-size:14px; color:var(--text-dark);">${lastMsg.sender === 'customer' ? 'You' : 'Agent'}</strong>
                <span style="font-size:12px; color:var(--text-muted);">${lastMsg.time}</span>
            </div>
            <p>"${lastMsg.text}"</p>
            <a href="index.html?id=${latestChat.id}" class="btn-secondary" style="margin-top:12px; justify-content:center;">Resume Chat</a>
        `;
    }
});