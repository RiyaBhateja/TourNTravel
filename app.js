const EngineLogic = {
    calculateDailyBudget(maxBudget, days) {
        if (!maxBudget || maxBudget <= 0 || !days || days <= 0) return 0;
        return Math.round(maxBudget / days);
    },
    
    generateAlerts(constraints, style) {
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
        return mockAlerts;
    }
};

const app = {
    currentView: 'hero-view',
    mapInstance: null,
    currentBudget: 0,

    // Initialize application
    init() {
        console.log('TourNTravel Engine Initialized');
        
        // GDPR Banner Logic
        const consent = localStorage.getItem('gdpr_consent');
        const banner = document.getElementById('gdpr-banner');
        if (banner) {
            if (!consent) {
                banner.style.display = 'flex';
            } else if (consent === 'accepted' && typeof window.initializeAnalytics === 'function') {
                window.initializeAnalytics();
            }
        }

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
        const loaderText = document.getElementById('loader-text');
        loader.style.display = 'flex';
        
        // Security Data Protection UI
        if(loaderText) loaderText.innerText = "Encrypting Data Payload...";

        // Simulate secure API call and Engine processing
        setTimeout(() => {
            if(loaderText) loaderText.innerText = "Engine calculating optimal routes...";
        }, 1200);

        setTimeout(() => {
            loader.style.display = 'none';
            this.populateDashboard(destination, duration, budget, style, constraints, maxBudget, commute);
            this.navigateTo('dashboard-view');
        }, 2500);
    },

    // Render the dashboard data
    populateDashboard(dest, days, budget, style, constraints, maxBudget, commute) {
        // Update Headers
        document.getElementById('dash-title').innerText = `Your Trip to ${dest}`;
        document.getElementById('dash-subtitle').innerText = `${days} Days • ${budget} • ${style}`;
        this.currentBudget = parseInt(maxBudget) || 0;

        // Fetch Dynamic Cover Image (Powered by Google Images)
        const dashCover = document.getElementById('dash-cover');
        if (dashCover) {
            const imageMap = {
                'tokyo': 'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?auto=format&fit=crop&w=1200&q=80',
                'paris': 'https://images.unsplash.com/photo-1499856871958-5b9627545d1a?auto=format&fit=crop&w=1200&q=80',
                'bali': 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?auto=format&fit=crop&w=1200&q=80',
                'london': 'https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?auto=format&fit=crop&w=1200&q=80',
                'new york': 'https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?auto=format&fit=crop&w=1200&q=80',
                'kyoto': 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?auto=format&fit=crop&w=1200&q=80'
            };
            
            // Search mapping or use generic high-quality travel image
            let targetImage = 'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?auto=format&fit=crop&w=1200&q=80';
            for (let city in imageMap) {
                if (dest.toLowerCase().includes(city)) {
                    targetImage = imageMap[city];
                    break;
                }
            }
            dashCover.style.backgroundImage = `url('${targetImage}')`;
        }

        // Generate Mock Alerts
        const alertsList = document.getElementById('alerts-list');
        alertsList.innerHTML = ''; // clear existing
        
        const mockAlerts = EngineLogic.generateAlerts(constraints, style);

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
            let dailyBudget = EngineLogic.calculateDailyBudget(maxBudget, days) || 'N/A';
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

        // Initialize Map (Google Maps Embed)
        const mapContainer = document.getElementById('map-container');
        if (mapContainer) {
            const encodedDest = encodeURIComponent(dest);
            mapContainer.innerHTML = `
                <iframe 
                    width="100%" 
                    height="100%" 
                    style="border:0; border-radius: 12px;" 
                    loading="lazy" 
                    allowfullscreen 
                    src="https://maps.google.com/maps?q=${encodedDest}&t=&z=13&ie=UTF8&iwloc=&output=embed">
                </iframe>
            `;
        }

        const packageOptions = document.getElementById('package-options');
        
        if (packageOptions && timeline) {
            timeline.style.display = 'none';
            packageOptions.style.display = 'flex';
            packageOptions.innerHTML = `
                <div class="package-card" onclick="app.selectItinerary('balanced', ${days}, '${dest.replace(/'/g, "\\'")}', this)">
                    <h4><i class="fa-solid fa-scale-balanced"></i> Balanced Explorer</h4>
                    <p>Perfect mix of culture, leisure, and popular sights. Ideal pace.</p>
                </div>
                <div class="package-card" onclick="app.selectItinerary('fast', ${days}, '${dest.replace(/'/g, "\\'")}', this)">
                    <h4><i class="fa-solid fa-bolt"></i> Fast-Paced</h4>
                    <p>Action-packed. See as much as possible, rest later.</p>
                </div>
                <div class="package-card" onclick="app.selectItinerary('relaxed', ${days}, '${dest.replace(/'/g, "\\'")}', this)">
                    <h4><i class="fa-solid fa-mug-hot"></i> Relaxed Nomad</h4>
                    <p>Late mornings, slow afternoons, and deep cultural immersion.</p>
                </div>
            `;
        }
    },

    selectItinerary(type, days, dest, element) {
        document.querySelectorAll('.package-card').forEach(c => c.classList.remove('selected'));
        if (element) element.classList.add('selected');

        const timeline = document.getElementById('itinerary-timeline');
        timeline.style.display = 'block';
        timeline.innerHTML = ''; // clear existing

        let paceText = 'Exploration';
        let morningText = 'Morning: Artisan Cafe & City Walk';
        let afternoonText = 'Afternoon: Primary Landmarks';
        
        if (type === 'fast') {
            paceText = 'High-Speed Tour';
            morningText = 'Early Morning: 3 Major Sights';
            afternoonText = 'Afternoon: Museum Hopping';
        } else if (type === 'relaxed') {
            paceText = 'Slow Living';
            morningText = 'Late Morning: Brunch & Neighborhood Stroll';
            afternoonText = 'Afternoon: Park Picnic & Local Shops';
        }

        for(let i = 1; i <= Math.min(days, 5); i++) {
            timeline.innerHTML += `
                <div class="timeline-item">
                    <div class="day-marker">D${i}</div>
                    <div class="day-content">
                        <h4>Day ${i}: ${i===1 ? 'Arrival & Acclimation' : paceText}</h4>
                        <div class="activity">
                            <img src="https://images.unsplash.com/photo-1554118811-1e0d58224f24?auto=format&fit=crop&w=150&q=80" alt="Cafe" class="activity-img">
                            <div style="flex: 1;">
                                <strong>${morningText}</strong>
                                <p class="small-text">Engine matched with highly-rated spots.</p>
                                ${type === 'balanced' && i === 1 ? `
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
                                ` : ''}
                            </div>
                        </div>
                        <div class="activity">
                            <img src="https://images.unsplash.com/photo-1499856871958-5b9627545d1a?auto=format&fit=crop&w=150&q=80" alt="Landmark" class="activity-img">
                            <div style="flex: 1;">
                                <strong>${afternoonText}</strong>
                                <p class="small-text">Optimized route to avoid traffic.</p>
                            </div>
                        </div>
                        <!-- Nearby Places Suggestion Module -->
                        <div class="nearby-places">
                            <strong><i class="fa-solid fa-clock"></i> Got extra time? Nearby:</strong>
                            <p style="margin-top: 4px; margin-bottom: 0; color: var(--text-main);">Local boutique market (5 min walk), Scenic river viewpoint (10 min walk)</p>
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
                        <p class="small-text">Dynamic suggestions will be unlocked closer to dates.</p>
                    </div>
                </div>
            `;
        }
    },

    // New Features Logic
    acceptCookies() {
        localStorage.setItem('gdpr_consent', 'accepted');
        document.getElementById('gdpr-banner').style.display = 'none';
        if (typeof window.initializeAnalytics === 'function') window.initializeAnalytics();
    },

    declineCookies() {
        localStorage.setItem('gdpr_consent', 'declined');
        document.getElementById('gdpr-banner').style.display = 'none';
    },

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

// Expose EngineLogic for testing if module object exists
if (typeof module !== 'undefined' && typeof module.exports !== 'undefined') {
    module.exports = { EngineLogic, app };
}

// Initialize app when DOM loads
if (typeof document !== 'undefined') {
    document.addEventListener('DOMContentLoaded', () => {
        app.init();
    });
}
