document.addEventListener('DOMContentLoaded', () => {
    const faqList = document.getElementById('faq-list');
    const searchInput = document.getElementById('faq-search');

    // 1. Array of Frequently Asked Questions
    const faqData = [
        {
            question: "How do I cancel an order?",
            answer: "If your order has not yet been processed for shipping, you can cancel it directly through the automated support chat by typing 'cancel order'. Alternatively, you can create a Support Ticket and set the priority to 'High'."
        },
        {
            question: "How long does delivery take?",
            answer: "Standard delivery typically takes 3-5 business days. Expedited shipping takes 1-2 business days. If you are experiencing a delay, please ask our live chat agent to check your order status."
        },
        {
            question: "How do I request a refund?",
            answer: "You can request a refund by creating a Support Ticket. Select 'Refund' as the category, provide your order ID in the description, and submit. Refunds typically take 3-5 days to process back to your original payment method."
        },
        {
            question: "How can I update my account information?",
            answer: "Click on your profile avatar in the top right corner of the dashboard to open the profile dropdown. From there, click 'Edit Profile' to navigate to your profile settings where you can update your phone number, email, and name."
        },
        {
            question: "How do I create a new support ticket?",
            answer: "You can create a support ticket directly from the Live Chat interface by clicking the blue 'Create Support Ticket' button at the top, or by navigating to the 'My Tickets' page via the left sidebar and clicking 'Create Support Ticket'."
        },
        {
            question: "Where can I find my previous support chats?",
            answer: "All your past conversations with our support agents are saved automatically. Open the sidebar menu and click on 'Conversation History' to view them. You can click 'Resume Chat' to continue an older conversation."
        },
        {
            question: "Why hasn't my ticket status changed?",
            answer: "Tickets are reviewed by our human agents during standard business hours. An 'Open' ticket means it is waiting for an agent. Once an agent begins looking into your issue, the status will change to 'In Progress'."
        }
    ];

    // 2. Render Function
    function renderFAQs(searchTerm = "") {
        faqList.innerHTML = ''; // Clear container

        // Filter the array based on the search query
        const filteredFAQs = faqData.filter(faq => {
            const query = searchTerm.toLowerCase();
            return faq.question.toLowerCase().includes(query) || 
                   faq.answer.toLowerCase().includes(query);
        });

        if (filteredFAQs.length === 0) {
            faqList.innerHTML = `<div class="no-results">No FAQs found matching "${searchTerm}".</div>`;
            return;
        }

        // Generate HTML for each matching FAQ
        filteredFAQs.forEach((faq, index) => {
            const faqItem = document.createElement('div');
            faqItem.className = 'faq-item';
            
            faqItem.innerHTML = `
                <div class="faq-question">
                    <span>${faq.question}</span>
                    <svg class="chevron-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="6 9 12 15 18 9"></polyline></svg>
                </div>
                <div class="faq-answer">
                    ${faq.answer}
                </div>
            `;

            // Accordion click logic
            const questionEl = faqItem.querySelector('.faq-question');
            questionEl.addEventListener('click', () => {
                // Optional: Close all other open FAQs (remove this block if you want multiple to stay open)
                const currentlyActive = document.querySelector('.faq-item.active');
                if (currentlyActive && currentlyActive !== faqItem) {
                    currentlyActive.classList.remove('active');
                }

                // Toggle the clicked one
                faqItem.classList.toggle('active');
            });

            faqList.appendChild(faqItem);
        });
    }

    // 3. Bind Search Input
    searchInput.addEventListener('input', (e) => {
        renderFAQs(e.target.value);
    });

    // 4. Initial Render
    renderFAQs();
});