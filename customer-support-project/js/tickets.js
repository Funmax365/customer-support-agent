document.addEventListener('DOMContentLoaded', () => {
    // --- Ticket Modal Logic ---
    const createTicketBtn = document.querySelector('.create-ticket-btn');
    const ticketModal = document.getElementById('ticket-modal');
    const closeBtn = document.getElementById('close-modal-btn');
    const ticketForm = document.getElementById('ticket-form');

    if (createTicketBtn) createTicketBtn.addEventListener('click', () => ticketModal.classList.add('active'));
    if (closeBtn) closeBtn.addEventListener('click', () => ticketModal.classList.remove('active'));
    if (ticketModal) {
        ticketModal.addEventListener('click', (e) => {
            // Ensuring the click happened directly on the overlay, not on the modal content
            if (e.target === ticketModal) {
                ticketModal.classList.remove('active');
            }
        });
    }

    ticketForm.addEventListener('submit', (e) => {
        e.preventDefault();
        let isValid = true;
        ['t-subject', 't-category', 't-priority', 't-desc'].forEach(id => {
            const el = document.getElementById(id);
            if (!el.value.trim()) {
                el.parentElement.classList.add('has-error');
                isValid = false;
            } else {
                el.parentElement.classList.remove('has-error');
            }
        });

        if (isValid) {
            const ticketId = `TKT-${new Date().getFullYear()}-${Math.floor(Math.random() * 90000 + 10000)}`;
            const newTicket = {
                id: ticketId,
                subject: document.getElementById('t-subject').value,
                category: document.getElementById('t-category').value,
                priority: document.getElementById('t-priority').value,
                description: document.getElementById('t-desc').value,
                status: 'Open',
                dateCreated: new Date().toLocaleDateString(),
                lastUpdated: new Date().toLocaleDateString(),
                linkedConvId: null // Explicitly unlinked for tickets created on the Tickets page
            };

            let tickets = JSON.parse(localStorage.getItem('supportTickets')) || [];
            tickets.unshift(newTicket);
            localStorage.setItem('supportTickets', JSON.stringify(tickets));

            const successMsg = document.getElementById('ticket-success-msg');
            successMsg.style.display = 'block';
            successMsg.innerHTML = `Ticket Created Successfully!<br><b>ID:</b> ${newTicket.id}<br><b>Status:</b> Open`;
            ticketForm.reset();

            // The code below Re-renders the tickets list immediately so the new ticket shows up
            allTickets = tickets; // Updating the global array
            renderTickets();
            
            setTimeout(() => {
                ticketModal.classList.remove('active');
                successMsg.style.display = 'none';
            }, 3000);
        }
    });
    const ticketsList = document.getElementById('tickets-list');
    const searchInput = document.getElementById('search-ticket');
    const statusFilter = document.getElementById('filter-status');
    const priorityFilter = document.getElementById('filter-priority');
    
    const listView = document.getElementById('tickets-list-view');
    const detailView = document.getElementById('ticket-detail-view');
    
    let allTickets = JSON.parse(localStorage.getItem('supportTickets')) || [];
    let currentActiveTicket = null;
    let linkedConversation = null;

    // Helper: Map status/priority to css colors
    function getStatusClass(status) {
        if (status === 'Open') return 'bg-open-med';
        if (status === 'In Progress') return 'bg-progress';
        if (status === 'Resolved') return 'bg-resolved-low';
        return 'bg-closed';
    }
    function getPriorityClass(prio) {
        if (prio === 'Urgent' || prio === 'High') return 'bg-urgent';
        if (prio === 'Medium') return 'bg-open-med';
        return 'bg-resolved-low';
    }

    function renderTickets() {
        ticketsList.innerHTML = '';
        const search = searchInput.value.toLowerCase();
        const stat = statusFilter.value;
        const prio = priorityFilter.value;

        // Dynamic Filtering array methods
        const filtered = allTickets.filter(t => {
            const matchesSearch = t.id.toLowerCase().includes(search) || t.subject.toLowerCase().includes(search);
            const matchesStatus = stat === 'All' || t.status === stat;
            const matchesPriority = prio === 'All' || t.priority === prio;
            return matchesSearch && matchesStatus && matchesPriority;
        });

        if (filtered.length === 0) {
            ticketsList.innerHTML = `<div style="padding: 40px; text-align: center; color: var(--text-muted);">No tickets found.</div>`;
            return;
        }

        filtered.forEach(t => {
            const row = document.createElement('div');
            row.className = 'ticket-row';
            row.innerHTML = `
                <span class="mono-id">${t.id}</span>
                <span style="font-weight: 500;">${t.subject}</span>
                <span style="color: var(--text-muted); font-size:14px;">${t.category}</span>
                <div><span class="badge ${getStatusClass(t.status)}">${t.status}</span></div>
                <div><span class="badge ${getPriorityClass(t.priority)}">${t.priority}</span></div>
            `;
            row.addEventListener('click', () => openTicketDetail(t));
            ticketsList.appendChild(row);
        });
    }

    function openTicketDetail(ticket) {
        currentActiveTicket = ticket;
        listView.style.display = 'none';
        detailView.style.display = 'flex';
        
        document.getElementById('detail-subject').textContent = ticket.subject;
        document.getElementById('detail-id').textContent = `${ticket.id} • Created: ${ticket.dateCreated}`;
        document.getElementById('detail-desc').textContent = ticket.description;
        document.getElementById('detail-badges').innerHTML = `
            <span class="badge ${getStatusClass(ticket.status)}">${ticket.status}</span>
            <span class="badge ${getPriorityClass(ticket.priority)}">${ticket.priority}</span>
        `;

        const chatBox = document.getElementById('linked-chat-box');
        
        if (ticket.linkedConvId) {
            chatBox.style.display = 'flex';
            let history = JSON.parse(localStorage.getItem('conversationHistory')) || [];
            linkedConversation = history.find(c => c.id === ticket.linkedConvId);
            renderTicketChat();
        } else {
            chatBox.style.display = 'none';
        }
    }

    // Integrated Chat Rendering
    function renderTicketChat() {
        const msgContainer = document.getElementById('ticket-chat-messages');
        msgContainer.innerHTML = '';
        if(!linkedConversation) return;

        linkedConversation.messages.forEach(msg => {
            const div = document.createElement('div');
            div.className = `message-group ${msg.sender}-group`;
            div.innerHTML = `
                <div class="message bubble ${msg.sender}">${msg.text}</div>
                <span class="timestamp">${msg.time}</span>
            `;
            msgContainer.appendChild(div);
        });
        msgContainer.scrollTop = msgContainer.scrollHeight;
    }

    // Send Message inside Ticket
    document.getElementById('ticket-send-btn').addEventListener('click', () => {
        const input = document.getElementById('ticket-chat-input');
        const text = input.value.trim();
        if (!text || !linkedConversation) return;

        // Append to conversation
        const time = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        linkedConversation.messages.push({ sender: 'customer', text: text, time: time });
        
        // Save to LocalStorage
        let history = JSON.parse(localStorage.getItem('conversationHistory')) || [];
        const index = history.findIndex(c => c.id === linkedConversation.id);
        if (index > -1) history[index] = linkedConversation;
        localStorage.setItem('conversationHistory', JSON.stringify(history));

        // Update Ticket last updated date
        currentActiveTicket.lastUpdated = new Date().toLocaleDateString();
        const tIndex = allTickets.findIndex(t => t.id === currentActiveTicket.id);
        if (tIndex > -1) allTickets[tIndex] = currentActiveTicket;
        localStorage.setItem('supportTickets', JSON.stringify(allTickets));

        input.value = '';
        renderTicketChat();
        
        // Agent auto-response simulator
        setTimeout(() => {
            linkedConversation.messages.push({ sender: 'agent', text: "Thank you for the update. Our team is reviewing this ticket.", time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) });
            localStorage.setItem('conversationHistory', JSON.stringify(history));
            renderTicketChat();
        }, 2000);
    });

    // Event Listeners for Filters
    searchInput.addEventListener('input', renderTickets);
    statusFilter.addEventListener('change', renderTickets);
    priorityFilter.addEventListener('change', renderTickets);
    
    document.getElementById('back-to-tickets').addEventListener('click', () => {
        listView.style.display = 'flex';
        detailView.style.display = 'none';
        renderTickets(); // Refresh list to show updated dates if modified
    });

    // Initial render
    renderTickets();
});