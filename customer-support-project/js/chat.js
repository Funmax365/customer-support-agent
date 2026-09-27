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
            // Ensure the click happened directly on the overlay, not on the modal content
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
                linkedConvId: currentConversation ? currentConversation.id : null // Link to chat
            };

            let tickets = JSON.parse(localStorage.getItem('supportTickets')) || [];
            tickets.unshift(newTicket);
            localStorage.setItem('supportTickets', JSON.stringify(tickets));

            const successMsg = document.getElementById('ticket-success-msg');
            successMsg.style.display = 'block';
            successMsg.innerHTML = `Ticket Created Successfully!<br><b>ID:</b> ${newTicket.id}<br><b>Status:</b> Open`;
            ticketForm.reset();
            
            setTimeout(() => {
                ticketModal.classList.remove('active');
                successMsg.style.display = 'none';
            }, 3000);
        }
    });
    const chatMessagesContainer = document.getElementById('chat-messages');
    const chatInput = document.getElementById('chat-input');
    const sendBtn = document.getElementById('send-btn');
    const newChatBtn = document.getElementById('new-chat-btn');

    // Generate real timestamp
    function getCurrentTime() {
        return new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    }

    // Bot Brain: Keywords and Responses
    const botKnowledge = [
        {
            keywords: ["complex", "human", "agent", "error", "broken"],
            tag: "Technical Support",
            response: "I recommend creating a formal request so our technical team can assist you. You can <a href='tickets.html' style='color:var(--primary-blue); text-decoration:underline;'>create a support ticket here</a>."
        },
        {
            keywords: ["menu", "cancel", "where", "find", "button", "profile", "dashboard", "navigate"],
            tag: "UI Assistance",
            response: "To find that feature, please click the menu icon (hamburger menu) at the top left of your screen. From that sidebar, you can navigate to 'My Tickets', 'Profile', or other sections."
        },
        {
            keywords: ["order", "missing", "delay", "track", "shipping"],
            tag: "Order Issue",
            response: "I can help you check the status of your order. Could you please provide your 5-digit order number?"
        },
        {
            keywords: [0, 1, 2, 3, 4, 5, 6, "ticket", 7, 8, 9],
            tag: "Ticket Support",
            response: "You can create a support ticket for an order by clicking on the 'Create Support Ticket' button at the top of this chat panel."
        },
        {
            keywords: ["refund", "return", "money"],
            tag: "Refund Request",
            response: "Refunds typically take 3-5 business days to process to your original payment method. Would you like me to open a refund ticket for you?"
        }
    ];
// --- State Management ---
    let currentConversation = null;

    // Check if we are resuming a chat from the History page via URL parameter
    const urlParams = new URLSearchParams(window.location.search);
    const resumeId = urlParams.get('id');

    if (resumeId) {
        const history = JSON.parse(localStorage.getItem('conversationHistory')) || [];
        const foundConv = history.find(c => c.id === resumeId);
        
        if (foundConv) {
            currentConversation = foundConv;
            // Set it as the active conversation so page refreshes keep this chat open
            localStorage.setItem('activeConversation', JSON.stringify(currentConversation));
            
            // Clean up the URL in the browser address bar (removes the ?id= part)
            window.history.replaceState({}, document.title, window.location.pathname);
        }
    }

    // If not resuming a specific chat, load the last active chat
    if (!currentConversation) {
        currentConversation = JSON.parse(localStorage.getItem('activeConversation'));
    }

    function saveConversationState() {
        localStorage.setItem('activeConversation', JSON.stringify(currentConversation));
        
        let history = JSON.parse(localStorage.getItem('conversationHistory')) || [];
        const existingIndex = history.findIndex(c => c.id === currentConversation.id);
        
        if (existingIndex > -1) {
            history[existingIndex] = currentConversation;
        } else {
            history.unshift(currentConversation); // Save new conversation to history
        }
        localStorage.setItem('conversationHistory', JSON.stringify(history));
    }

    function startNewChat() {
        currentConversation = {
            id: 'CONV-' + Math.floor(Math.random() * 90000 + 10000),
            tag: 'General Inquiry',
            date: new Date().toLocaleDateString(),
            messages: [
                { sender: 'customer', text: 'Hello.', time: getCurrentTime() },
                { sender: 'agent', text: "Hello! I'd be happy to help. What is the issue?", time: getCurrentTime() }
            ]
        };
        saveConversationState();
        renderMessages();
    }

    function renderMessages() {
        chatMessagesContainer.innerHTML = ''; // Clear hardcoded HTML
        currentConversation.messages.forEach(msg => {
            appendMessageHTML(msg.sender, msg.text, msg.time);
        });
        scrollToBottom();
    }

    function appendMessageHTML(sender, text, time) {
        const div = document.createElement('div');
        div.className = `message-group ${sender}-group`;

        if (sender === 'customer') {
            div.innerHTML = `
                <span class="sender-name you">You</span>
                <div class="message bubble customer">${text}</div>
                <span class="timestamp">${time}</span>
            `;
        } else {
            div.innerHTML = `
                <span class="sender-name">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" style="margin-right: 4px;"><path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/></svg>
                    Agent
                </span>
                <div class="message bubble agent">${text}</div>
                <span class="timestamp">${time}</span>
            `;
        }
        chatMessagesContainer.appendChild(div);
    }

    function scrollToBottom() {
        chatMessagesContainer.scrollTop = chatMessagesContainer.scrollHeight;
    }

    // Agent Bot Logic
    function handleAgentResponse(userText) {
        // Show Typing Indicator
        const typingDiv = document.createElement('div');
        typingDiv.className = 'typing-indicator';
        typingDiv.id = 'typing-indicator';
        typingDiv.innerHTML = 'Support is typing... <span class="dots"></span>';
        chatMessagesContainer.appendChild(typingDiv);
        scrollToBottom();

        // Calculate dynamic delay (2 to 4 seconds based on message length)
        const delay = Math.min(4000, Math.max(2000, userText.length * 50));

        setTimeout(() => {
            document.getElementById('typing-indicator').remove();
            
            const lowerText = userText.toLowerCase();
            let responseText = "I'm not exactly sure how to help with that. Could you provide more details, or would you like to create a support ticket for further assistance?";
            let assignedTag = currentConversation.tag;

            // Search for keywords
            for (const topic of botKnowledge) {
                if (topic.keywords.some(kw => lowerText.includes(kw))) {
                    responseText = topic.response;
                    assignedTag = topic.tag; // Update the conversation tag for history
                    break;
                }
            }

            const time = getCurrentTime();
            currentConversation.tag = assignedTag; 
            currentConversation.messages.push({ sender: 'agent', text: responseText, time: time });
            saveConversationState();
            appendMessageHTML('agent', responseText, time);
            scrollToBottom();

        }, delay);
    }

    function handleSend() {
        const text = chatInput.value.trim();
        if (!text) return; // Prevent empty messages

        const time = getCurrentTime();
        currentConversation.messages.push({ sender: 'customer', text: text, time: time });
        saveConversationState();
        appendMessageHTML('customer', text, time);
        
        chatInput.value = '';
        scrollToBottom();
        
        handleAgentResponse(text);
    }

    // Event Listeners
    sendBtn.addEventListener('click', (e) => {
        e.preventDefault(); // Prevent any page reload when the send button is clicked
        handleSend();
    });

    chatInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            e.preventDefault(); // Prevent form submission reload when the enter button is clicked inside the text area
            handleSend();
        }
    });

    if (newChatBtn) {
        newChatBtn.addEventListener('click', () => {
            startNewChat();
        });
    }

    // Initialize Page
    if (!currentConversation) {
        startNewChat();
    } else {
        renderMessages();
    }
});