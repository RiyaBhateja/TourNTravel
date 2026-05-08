const app = {
    currentView: 'hero-view',
    mapInstance: null,
    currentBudget: 0,

    // Initialize application
    init() {
        console.log('TourNTravel Engine Initialized');
        // Check hash to determine initial view
        const hash = window.location.hash.replace('#', '');
        if (hash && document.getElementById(hash)) {
            this.navigateTo(hash, false);
        } else {
            this.navigateTo('hero-view', false);
        }
        
        // Listen for history back/forward
        window.addEventListener('popstate', (e) => {
            if(e.state && e.state.view) {
                this.navigateTo(e.state.view, false);
            }
        });
    },

    // Navigation Logic
    navigateTo(viewId, pushState = true) {
        // Hide current view
        document.getElementById(this.currentView).classList.remove('active');
        
        // Show new view
        const newView = document.getElementById(viewId);
        // Small delay to allow CSS transition
        setTimeout(() => {
            newView.classList.add('active');
        }, 50);

        this.currentView = viewId;

        // Update URL
        if (pushState) {
            window.history.pushState({ view: viewId }, '', `#${viewId}`);
        }
        
        // Scroll to top
        window.scrollTo({ top: 0, behavior: 'smooth' });
    },

    // Handle form submission
    generateTrip(e) {
        e.preventDefault();
        
        // Get form data
        const destination = document.getElementById('destination').value;
        const duration = document.getElementById('duration').value;
        const budget = document.getElementById('budget').options[document.getElementById('budget').selectedIndex].text;
        const style = document.getElementById('style').options[document.getElementById('style').selectedIndex].text;
        const maxBudget = document.getElementById('max-budget').value;
        const commute = document.getElementById('commute').options[document.getElementById('commute').selectedIndex].text;
        
        const constraints = Array.from(document.querySelectorAll('.constraint-chk:checked'))
                                .map(cb => cb.parentElement.innerText.trim());

        // Show Loading State
        const loader = document.getElementById('loading-overlay');
        loader.style.display = 'flex';

        // Simulate API call and Engine processing
        setTimeout(() => {
            loader.style.display = 'none';
            this.populateDashboard(destination, duration, budget, style, constraints, maxBudget, commute);
            this.navigateTo('dashboard-view');
        }, 2000);
    },

    // Render the dashboard data
    populateDashboard(dest, days, budget, style, constraints, maxBudget, commute) {
        // Update Headers
        document.getElementById('dash-title').innerText = `Your Trip to ${dest}`;
        document.getElementById('dash-subtitle').innerText = `${days} Days • ${budget} • ${style}`;
        this.currentBudget = parseInt(maxBudget) || 0;

        // Generate Mock Alerts
        const alertsList = document.getElementById('alerts-list');
        alertsList.innerHTML = ''; // clear existing
        
        const mockAlerts = [
            { type: 'warning', title: 'High Tourist Traffic', desc: 'Expected heavy crowds at popular landmarks today.' },
            { type: 'info', title: 'Local Festival', desc: 'A street food festival was detected near your hotel.' }
        ];

        if (constraints.includes('Vegan Options')) {
            mockAlerts.push({ type: 'success', title: 'Constraint Met', desc: 'Found 12 highly-rated vegan restaurants nearby.' });
        }
        
        if (constraints.includes('VPN Friendly Networks')) {
            mockAlerts.push({ type: 'info', title: 'Cybersecurity Guard', desc: 'Hotel and suggested cafes verified for unrestricted VPN traffic.' });
        }

        if (constraints.includes('Strict Data Privacy')) {
            mockAlerts.push({ type: 'warning', title: 'Privacy Notice', desc: 'Avoid local SIM vendors requiring biometric registration in this area.' });
        }

        if (style.includes('Nomad') || style.includes('Business')) {
            mockAlerts.push({ type: 'success', title: 'Workspace Ready', desc: 'Added 3 high-speed Wi-Fi coworking spaces to your itinerary.' });
        }

        mockAlerts.forEach(alert => {
            alertsList.innerHTML += `
                <div class="alert-card ${alert.type}">
                    <h4>${alert.title}</h4>
                    <p>${alert.desc}</p>
                </div>
            `;
        });

        // Populate Logistics Panel
        const logisticsPanel = document.getElementById('logistics-content');
        if (logisticsPanel) {
            let dailyBudget = maxBudget ? Math.round(maxBudget / days) : 'N/A';
            logisticsPanel.innerHTML = `
                <div class="logistics-item" style="display: flex; gap: 12px; align-items: center; border-bottom: 1px solid rgba(255,255,255,0.05); padding-bottom: 12px;">
                    <div style="background: rgba(59, 130, 246, 0.2); padding: 10px; border-radius: 8px; color: var(--primary);">
                        <i class="fa-solid fa-money-bill-wave"></i>
                    </div>
                    <div>
                        <p class="small-text">Total Budget Limit</p>
                        <strong>$${maxBudget || '0'}</strong> <span class="small-text">(~$${dailyBudget}/day)</span>
                    </div>
                </div>
                <div class="logistics-item" style="display: flex; gap: 12px; align-items: center; padding-top: 4px;">
                    <div style="background: rgba(16, 185, 129, 0.2); padding: 10px; border-radius: 8px; color: var(--secondary);">
                        <i class="fa-solid fa-train-subway"></i>
                    </div>
                    <div>
                        <p class="small-text">Primary Commute</p>
                        <strong>${commute || 'Not specified'}</strong>
                    </div>
                </div>
            `;
        }

        // Generate Mock Itinerary Timeline
        const timeline = document.getElementById('itinerary-timeline');
        timeline.innerHTML = ''; // clear existing

        // Populate Culture Panel
        const culturePanel = document.getElementById('culture-content');
        if (culturePanel) {
            culturePanel.innerHTML = `
                <ul style="list-style: none; padding: 0; color: var(--text-main); font-size: 0.95rem; line-height: 1.8;">
                    <li><i class="fa-solid fa-handshake-angle" style="color: var(--primary); margin-right: 8px;"></i> <strong>Tipping:</strong> Usually 10-15% in ${dest}</li>
                    <li><i class="fa-solid fa-tower-broadcast" style="color: var(--primary); margin-right: 8px;"></i> <strong>Emergency:</strong> Dial 112</li>
                    <li><i class="fa-solid fa-language" style="color: var(--primary); margin-right: 8px;"></i> <strong>Greeting:</strong> Learn local 'Hello' and 'Thank you'</li>
                    <li><i class="fa-solid fa-plug" style="color: var(--primary); margin-right: 8px;"></i> <strong>Power:</strong> Type C/F plugs, 230V</li>
                </ul>
            `;
        }

        // Initialize Map
        const mapContainer = document.getElementById('map-container');
        if (mapContainer && typeof L !== 'undefined') {
            if (this.mapInstance) {
                this.mapInstance.remove();
            }
            this.mapInstance = L.map('map-container').setView([35.6762, 139.6503], 13); // Default Tokyo coordinates
            L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
                attribution: '&copy; OpenStreetMap contributors'
            }).addTo(this.mapInstance);

            L.marker([35.6762, 139.6503]).addTo(this.mapInstance)
                .bindPopup('<b>Start Location</b><br>Your starting point.').openPopup();

            setTimeout(() => { this.mapInstance.invalidateSize(); }, 500);
        }

        for(let i = 1; i <= Math.min(days, 5); i++) {
            // Cap at 5 days for mock UI brevity
            timeline.innerHTML += `
                <div class="timeline-item">
                    <div class="day-marker">D${i}</div>
                    <div class="day-content">
                        <h4>Day ${i}: ${i===1 ? 'Arrival & Acclimation' : 'Exploration'}</h4>
                        <div class="activity">
                            <img src="https://images.unsplash.com/photo-1554118811-1e0d58224f24?auto=format&fit=crop&w=150&q=80" alt="Cafe" class="activity-img">
                            <div style="flex: 1;">
                                <strong>Morning: Artisan Cafe</strong>
                                <p class="small-text">Local cafe breakfast and introductory city walk.</p>
                                <button class="btn-ghost btn-small" onclick="this.nextElementSibling.style.display = this.nextElementSibling.style.display === 'none' ? 'block' : 'none'">
                                    <i class="fa-solid fa-utensils"></i> View Menu
                                </button>
                                <div class="menu-card" style="display: none; margin-top: 10px;">
                                    <h5>Today's Menu</h5>
                                    <ul>
                                        <li><span>Avocado Toast</span> <span>$12</span></li>
                                        <li><span>Matcha Latte</span> <span>$5</span></li>
                                        <li><span>House Pastry</span> <span>$4</span></li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                        <div class="activity">
                            <img src="https://images.unsplash.com/photo-1499856871958-5b9627545d1a?auto=format&fit=crop&w=150&q=80" alt="Landmark" class="activity-img">
                            <div style="flex: 1;">
                                <strong>Afternoon: Landmarks</strong>
                                <p class="small-text">Visit to primary cultural landmarks.</p>
                            </div>
                        </div>
                    </div>
                </div>
            `;
        }
        
        if (days > 5) {
            timeline.innerHTML += `
                <div class="timeline-item">
                    <div class="day-marker"><i class="fa-solid fa-ellipsis"></i></div>
                    <div class="day-content">
                        <h4>Remaining ${days - 5} Days</h4>
                        <p class="small-text">Engine is dynamically adjusting schedule based on real-time factors...</p>
                    </div>
                </div>
            `;
        }
    },

    // New Features Logic
    downloadPDF() {
        alert("Downloading high-res PDF itinerary... (Mock)");
    },

    syncCalendar() {
        alert("Syncing to Google Calendar... (Mock)");
    },

    logExpense() {
        const input = document.getElementById('expense-input');
        const amount = parseInt(input.value);
        if (!amount || amount <= 0) return;

        this.currentBudget -= amount;
        input.value = '';
        
        // Update UI
        const budgetDisplay = document.querySelector('.budget-panel strong');
        if (budgetDisplay) {
            budgetDisplay.innerText = `$${this.currentBudget}`;
            if (this.currentBudget < 0) {
                budgetDisplay.style.color = '#ef4444'; // red text
            }
        }
    },

    toggleChat() {
        const chatWindow = document.getElementById('chat-window');
        if (chatWindow.style.display === 'none' || chatWindow.style.display === '') {
            chatWindow.style.display = 'flex';
        } else {
            chatWindow.style.display = 'none';
        }
    },

    sendChatMessage() {
        const input = document.getElementById('chat-input');
        const msg = input.value.trim();
        if (!msg) return;

        const messagesContainer = document.getElementById('chat-messages');
        
        // User message
        messagesContainer.innerHTML += `
            <div style="background: rgba(255, 255, 255, 0.1); padding: 12px; border-radius: 12px 12px 0 12px; max-width: 80%; align-self: flex-end; border: 1px solid rgba(255,255,255,0.2);">
                <p style="font-size: 0.9rem; margin: 0;">${msg}</p>
            </div>
        `;
        
        input.value = '';
        messagesContainer.scrollTop = messagesContainer.scrollHeight;

        // Simulated AI response
        setTimeout(() => {
            messagesContainer.innerHTML += `
                <div style="background: rgba(59, 130, 246, 0.2); padding: 12px; border-radius: 12px 12px 12px 0; max-width: 80%; align-self: flex-start; border: 1px solid rgba(59,130,246,0.3);">
                    <p style="font-size: 0.9rem; margin: 0;">I have dynamically adjusted your itinerary based on that request!</p>
                </div>
            `;
            messagesContainer.scrollTop = messagesContainer.scrollHeight;
        }, 1000);
    }
};

// Initialize app when DOM loads
document.addEventListener('DOMContentLoaded', () => {
    app.init();
});
