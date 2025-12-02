// Tehranak Real Estate PWA Application with Dynamic Island
class TehranakApp {
    constructor() {
        this.currentTab = 'home';
        this.data = {
            properties: [],
            clients: [],
            tasks: [],
            commissions: []
        };
        
        // Dynamic Island State
        this.dynamicIslandExpanded = false;
        this.isVoiceModeActive = false;
        this.isListeningStatus = false;
        this.messages = [];
        this.currentTime = '';
        this.displayMode = 'logo'; // 'logo' or 'datetime'
        
        // Initialize app
        this.init();
    }

    init() {
        this.loadData();
        this.setupEventListeners();
        this.updateStatistics();
        this.installPrompt();
        this.initDynamicIsland();
    }

    setupEventListeners() {
        // Bottom navigation
        document.querySelectorAll('[data-tab]').forEach(tab => {
            tab.addEventListener('click', (e) => {
                this.switchTab(e.target.closest('[data-tab]').dataset.tab);
            });
        });

        // Header buttons
        document.getElementById('searchBtn')?.addEventListener('click', () => {
            this.showSearchModal();
        });

        document.getElementById('settingsBtn')?.addEventListener('click', () => {
            this.showSettingsModal();
        });

        // Dynamic Island
        document.getElementById('dynamicIsland')?.addEventListener('click', () => {
            this.toggleDynamicIsland();
        });

        // Property slider interactions
        this.setupSlider();
    }

    // === Dynamic Island Functions ===
    initDynamicIsland() {
        this.updateTime();
        // Update time every minute
        setInterval(() => this.updateTime(), 60000);
        
        // Alternate between logo and time every 7 seconds
        setInterval(() => {
            this.displayMode = this.displayMode === 'logo' ? 'datetime' : 'logo';
            this.updateDynamicIslandDisplay();
        }, 7000);
    }

    updateTime() {
        const now = new Date();
        this.currentTime = now.toLocaleTimeString('fa-IR', { hour: '2-digit', minute: '2-digit' });
        if (this.displayMode === 'datetime') {
            this.updateDynamicIslandDisplay();
        }
    }

    updateDynamicIslandDisplay() {
        const island = document.getElementById('dynamicIsland');
        const logo = document.getElementById('islandLogo');
        
        if (island && logo) {
            if (this.displayMode === 'logo') {
                logo.innerHTML = '<span class="text-[10px] font-extrabold text-gray-300 tracking-[0.15em]">TEHRA</span><span class="text-[10px] font-extrabold text-green-500 tracking-[0.15em]">NAK</span>';
            } else {
                const now = new Date();
                const time = now.toLocaleTimeString('fa-IR', { hour: '2-digit', minute: '2-digit' });
                const date = now.toLocaleDateString('fa-IR', { month: 'long', day: 'numeric' });
                logo.innerHTML = `<span class="text-[10px] font-extrabold text-gray-200">${time}</span><span class="w-1 h-1 bg-gray-600 rounded-full"></span><span class="text-[9px] font-bold text-gray-400">${date}</span>`;
            }
        }
    }

    toggleDynamicIsland() {
        this.dynamicIslandExpanded = !this.dynamicIslandExpanded;
        const island = document.getElementById('dynamicIsland');
        
        if (this.dynamicIslandExpanded) {
            // Expand to full chat interface
            island.style.width = '92%';
            island.style.height = '500px';
            island.style.borderRadius = '40px';
            island.innerHTML = `
                <div class="flex flex-col h-full w-full p-4">
                    <!-- Header -->
                    <div class="flex justify-between items-center mb-4 border-b border-white/10 pb-2">
                        <div class="flex items-center gap-2">
                            <div class="relative w-10 h-10 rounded-full bg-gradient-to-tr from-indigo-500 via-purple-500 to-pink-500 flex items-center justify-center overflow-hidden">
                                <span class="font-bold text-white text-xs">A</span>
                            </div>
                            <div>
                                <h3 class="font-bold text-white text-sm">الکسا (دستیار صوتی)</h3>
                                <span class="text-[10px] text-gray-500">دستیار هوشمند</span>
                            </div>
                        </div>
                        <button onclick="window.tehranakApp.toggleDynamicIsland()" class="p-2 bg-white/5 rounded-full hover:bg-white/10">
                            <svg class="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
                            </svg>
                        </button>
                    </div>

                    <!-- Chat Area -->
                    <div class="flex-1 overflow-y-auto space-y-3 mb-4 pr-1 pl-1">
                        <div class="flex justify-end">
                            <div class="max-w-[80%] p-3 rounded-2xl bg-gradient-to-br from-purple-600 to-blue-600 text-white rounded-br-none shadow-lg shadow-purple-500/20">
                                سلام! من الکسا هستم. برای صحبت با من، روی میکروفون بزنید و صدام کنید!
                            </div>
                        </div>
                    </div>

                    <!-- Input Area -->
                    <div class="flex items-center gap-2 mt-auto relative">
                        <button onclick="window.tehranakApp.toggleVoiceMode()" class="p-3 rounded-full bg-white/10 hover:bg-white/20 transition-colors">
                            <svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z"></path>
                            </svg>
                        </button>
                        <div class="flex-1 relative">
                            <input type="text" placeholder="پیام بنویسید..." 
                                   class="w-full bg-[#1c1c1e] border border-white/10 text-white text-right rounded-full py-2.5 px-4 text-sm focus:outline-none focus:border-purple-500">
                        </div>
                        <button class="p-2.5 bg-blue-500 rounded-full hover:bg-blue-600 text-white">
                            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"></path>
                            </svg>
                        </button>
                    </div>
                </div>
            `;
        } else {
            // Collapse to original state
            island.style.width = '180px';
            island.style.height = '36px';
            island.style.borderRadius = '50%';
            this.updateDynamicIslandDisplay();
            // Add back click listener
            setTimeout(() => {
                island.addEventListener('click', () => this.toggleDynamicIsland());
            }, 100);
        }
    }

    toggleVoiceMode() {
        this.isVoiceModeActive = !this.isVoiceModeActive;
        
        if (this.isVoiceModeActive) {
            this.startVoiceRecognition();
        } else {
            this.stopVoiceRecognition();
        }
        
        // Update the voice button in the expanded island
        const voiceBtn = document.querySelector('.bg-red-500.animate-pulse, .bg-white\\/10');
        if (voiceBtn) {
            voiceBtn.className = this.isVoiceModeActive 
                ? 'p-3 rounded-full bg-red-500 animate-pulse shadow-[0_0_15px_red] transition-all duration-500' 
                : 'p-3 rounded-full bg-white/10 hover:bg-white/20 transition-colors';
        }
    }

    startVoiceRecognition() {
        if ('webkitSpeechRecognition' in window) {
            const recognition = new webkitSpeechRecognition();
            recognition.lang = 'fa-IR';
            recognition.continuous = true;
            recognition.interimResults = false;
            
            recognition.onstart = () => {
                this.isListeningStatus = true;
            };
            
            recognition.onend = () => {
                this.isListeningStatus = false;
                if (this.isVoiceModeActive) {
                    setTimeout(() => recognition.start(), 300);
                }
            };
            
            recognition.onresult = (event) => {
                const transcript = event.results[0][0].transcript;
                this.handleVoiceInput(transcript);
            };
            
            recognition.start();
        } else {
            alert("مرورگر شما از تشخیص گفتار پشتیبانی نمی‌کند.");
        }
    }

    stopVoiceRecognition() {
        this.isListeningStatus = false;
        // Speech recognition will be stopped automatically when isVoiceModeActive is false
    }

    handleVoiceInput(text) {
        const lowerText = text.toLowerCase();
        const wakeWords = ['الکسا', 'alexa', 'تهرانک', 'خانم'];
        
        const hasWakeWord = wakeWords.some(w => lowerText.includes(w));
        
        if (hasWakeWord) {
            // Process the command
            this.addMessage(text, true);
            this.processCommand(text);
        }
    }

    processCommand(command) {
        // Simple command processing
        let response = '';
        
        if (command.includes('سلام')) {
            response = 'سلام! چطور می‌تونم کمکتون کنم؟';
        } else if (command.includes('املاک')) {
            response = `شما ${this.data.properties.length} ملک دارید.`;
        } else if (command.includes('مشتری')) {
            response = `تعداد مشتریان شما ${this.data.clients.length} نفر است.`;
        } else if (command.includes('وظیفه')) {
            const incompleteTasks = this.data.tasks.filter(t => !t.completed).length;
            response = `شما ${incompleteTasks} وظیفه انجام نشده دارید.`;
        } else {
            response = 'متوجه نشدم. می‌تونید واضح‌تر بگید؟';
        }
        
        setTimeout(() => {
            this.addMessage(response, false);
            this.speak(response);
        }, 1000);
    }

    addMessage(text, isUser) {
        this.messages.push({ text, isUser });
        // Update chat area if expanded
        if (this.dynamicIslandExpanded) {
            this.updateChatDisplay();
        }
    }

    updateChatDisplay() {
        const chatArea = document.querySelector('.overflow-y-auto.space-y-3');
        if (chatArea && this.messages.length > 0) {
            const lastMessage = this.messages[this.messages.length - 1];
            const messageDiv = document.createElement('div');
            messageDiv.className = `flex ${lastMessage.isUser ? 'justify-start' : 'justify-end'}`;
            messageDiv.innerHTML = `
                <div class="max-w-[80%] p-3 rounded-2xl text-sm leading-relaxed ${
                    lastMessage.isUser 
                        ? 'bg-[#333333] text-white rounded-br-none' 
                        : 'bg-gradient-to-br from-purple-600 to-blue-600 text-white rounded-bl-none shadow-lg shadow-purple-500/20'
                }">
                    ${lastMessage.text}
                </div>
            `;
            chatArea.appendChild(messageDiv);
            chatArea.scrollTop = chatArea.scrollHeight;
        }
    }

    speak(text) {
        if ('speechSynthesis' in window) {
            const utterance = new SpeechSynthesisUtterance(text);
            utterance.lang = 'fa-IR';
            utterance.pitch = 1.3;
            utterance.rate = 1.0;
            speechSynthesis.speak(utterance);
        }
    }

    switchTab(tab) {
        // Update navigation
        document.querySelectorAll('[data-tab]').forEach(item => {
            const isActive = item.dataset.tab === tab;
            item.className = `flex flex-col items-center justify-center w-1/6 pb-1 transition-all duration-300 ${
                isActive ? 'text-purple-600' : 'text-gray-400'
            }`;
            
            const span = item.querySelector('span');
            if (span) {
                span.className = isActive 
                    ? 'text-[9px] font-bold opacity-100' 
                    : 'text-[9px] font-medium opacity-80';
            }
        });

        // Update main content
        this.currentTab = tab;
        this.updateMainContent();
    }

    updateMainContent() {
        const homeContent = document.getElementById('homeContent');
        const otherContent = document.getElementById('otherContent');
        
        if (this.currentTab === 'home') {
            homeContent.classList.remove('hidden');
            otherContent.classList.add('hidden');
        } else {
            homeContent.classList.add('hidden');
            otherContent.classList.remove('hidden');
            this.renderOtherTabContent();
        }
    }

    renderOtherTabContent() {
        const otherContent = document.getElementById('otherContent');
        const tabContent = {
            properties: { title: 'املاک', description: 'مدیریت املاک و مستغلات' },
            add: { title: 'ثبت مورد جدید', description: 'ثبت ملک، مشتری، وظیفه یا کمیسیون جدید' },
            clients: { title: 'مشتریان', description: 'مدیریت اطلاعات مشتریان' },
            tasks: { title: 'وظایف', description: 'پیگیری و مدیریت وظایف' },
            commission: { title: 'کمیسیون', description: 'مدیریت کمیسیون‌ها و درآمدها' }
        };

        const content = tabContent[this.currentTab] || { title: 'در حال توسعه', description: 'این بخش به زودی آماده خواهد شد' };

        otherContent.innerHTML = `
            <div class="pt-16 space-y-6">
                <div class="text-center">
                    <div class="w-20 h-20 bg-gradient-to-br from-purple-600 to-blue-500 rounded-full flex items-center justify-center mx-auto mb-6">
                        ${this.getTabIcon(this.currentTab)}
                    </div>
                    <h2 class="text-2xl font-bold mb-2">${content.title}</h2>
                    <p class="text-gray-400 text-sm mb-8">${content.description}</p>
                </div>

                ${this.getTabSpecificContent()}
            </div>
        `;
    }

    getTabIcon(tab) {
        const icons = {
            properties: '<svg class="w-10 h-10 text-white" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"></path></svg>',
            add: '<svg class="w-10 h-10 text-white" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path></svg>',
            clients: '<svg class="w-10 h-10 text-white" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z"></path></svg>',
            tasks: '<svg class="w-10 h-10 text-white" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4"></path></svg>',
            commission: '<svg class="w-10 h-10 text-white" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1"></path></svg>'
        };
        return icons[tab] || icons.add;
    }

    getTabSpecificContent() {
        switch (this.currentTab) {
            case 'properties':
                return `
                    <div class="space-y-4">
                        <div class="bg-[#1E293B] rounded-2xl p-4">
                            <div class="flex justify-between items-center mb-4">
                                <h3 class="font-bold">لیست املاک</h3>
                                <button onclick="window.tehranakApp.showAddModal('res')" class="bg-purple-600 text-white px-4 py-2 rounded-lg text-sm">+ ثبت ملک</button>
                            </div>
                            <div class="space-y-3">
                                ${this.data.properties.map(property => `
                                    <div class="bg-[#0F172A] p-4 rounded-xl border border-white/10">
                                        <div class="flex justify-between items-start">
                                            <div>
                                                <h4 class="font-bold text-sm">${property.title}</h4>
                                                <p class="text-xs text-gray-400">${property.address}</p>
                                                <p class="text-xs text-purple-400">${property.type} • ${property.area} متر</p>
                                            </div>
                                            <div class="text-left">
                                                <span class="text-sm font-bold text-green-400">${this.formatPrice(property.priceTotal || property.priceRent)}</span>
                                            </div>
                                        </div>
                                    </div>
                                `).join('')}
                            </div>
                        </div>
                    </div>
                `;
            
            case 'add':
                return `
                    <div class="grid grid-cols-2 gap-4 px-4">
                        <button onclick="window.tehranakApp.showAddModal('res')" class="bg-[#1E293B] p-6 rounded-3xl shadow-lg flex flex-col items-center border border-white/10">
                            <svg class="w-8 h-8 text-purple-500 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"></path>
                            </svg>
                            <span class="font-bold text-white text-sm">مسکونی</span>
                        </button>
                        <button onclick="window.tehranakApp.showAddModal('com')" class="bg-[#1E293B] p-6 rounded-3xl shadow-lg flex flex-col items-center border border-white/10">
                            <svg class="w-8 h-8 text-blue-500 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"></path>
                            </svg>
                            <span class="font-bold text-white text-sm">تجاری</span>
                        </button>
                        <button onclick="window.tehranakApp.showAddModal('client')" class="bg-[#1E293B] p-6 rounded-3xl shadow-lg flex flex-col items-center border border-white/10">
                            <svg class="w-8 h-8 text-orange-500 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z"></path>
                            </svg>
                            <span class="font-bold text-white text-sm">مشتری</span>
                        </button>
                        <button onclick="window.tehranakApp.showAddModal('task')" class="bg-[#1E293B] p-6 rounded-3xl shadow-lg flex flex-col items-center border border-white/10">
                            <svg class="w-8 h-8 text-pink-500 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4"></path>
                            </svg>
                            <span class="font-bold text-white text-sm">وظیفه</span>
                        </button>
                        <button onclick="window.tehranakApp.showAddModal('commission')" class="bg-[#1E293B] p-6 rounded-3xl shadow-lg flex flex-col items-center border border-white/10 col-span-2">
                            <svg class="w-8 h-8 text-emerald-500 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1"></path>
                            </svg>
                            <span class="font-bold text-white text-sm">ثبت کمیسیون</span>
                        </button>
                    </div>
                `;
            
            default:
                return `
                    <div class="text-center py-12">
                        <div class="w-16 h-16 bg-purple-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                            <svg class="w-8 h-8 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
                            </svg>
                        </div>
                        <p class="text-sm text-gray-500">به زودی قابلیت‌های کامل اضافه خواهد شد</p>
                    </div>
                `;
        }
    }

    formatPrice(price) {
        if (!price) return 'رایگان';
        if (price >= 1000000000) {
            return `${(price / 1000000000).toFixed(1)} میلیارد تومان`;
        } else if (price >= 1000000) {
            return `${(price / 1000000).toFixed(0)} میلیون تومان`;
        } else {
            return `${price.toLocaleString()} تومان`;
        }
    }

    setupSlider() {
        // Property slider with sample data
        const sliderImages = [
            {
                url: 'https://images.unsplash.com/photo-1584622781564-1d7f7a2d2f5e?w=600&h=400&fit=crop',
                title: 'آپارتمان خام (تست چیدمان)'
            },
            {
                url: 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=600&h=400&fit=crop',
                title: 'ویلا مدرن شمالی'
            },
            {
                url: 'https://images.unsplash.com/photo-1570129477492-45c003edd2be?w=600&h=400&fit=crop',
                title: 'آپارتمان لوکس'
            }
        ];

        let currentSlide = 0;
        const sliderImage = document.getElementById('sliderImage');
        const sliderTitle = document.getElementById('sliderTitle');

        if (sliderImage && sliderTitle) {
            // Auto-rotate slider
            setInterval(() => {
                currentSlide = (currentSlide + 1) % sliderImages.length;
                sliderImage.src = sliderImages[currentSlide].url;
                sliderTitle.textContent = sliderImages[currentSlide].title;
            }, 4000);

            // Click to interact
            sliderImage.closest('.cursor-pointer')?.addEventListener('click', () => {
                this.showPropertyDetail();
            });
        }
    }

    showPropertyDetail() {
        alert('جزئیات ملک نمایش داده می‌شود...');
    }

    showSearchModal() {
        this.createModal('جستجو', `
            <div class="space-y-4">
                <div class="relative">
                    <input type="text" placeholder="جستجو (محله، نام، امکانات...)" 
                           class="w-full p-4 pl-12 rounded-2xl bg-white/5 border border-white/10 text-white placeholder-gray-400 outline-none">
                    <svg class="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
                    </svg>
                </div>
                <div class="flex gap-2">
                    <button class="flex-1 py-3 rounded-xl text-xs font-bold border border-purple-500 bg-purple-500 text-white">مسکونی</button>
                    <button class="flex-1 py-3 rounded-xl text-xs font-bold border border-gray-300 text-gray-400 bg-transparent">تجاری</button>
                    <button class="flex-1 py-3 rounded-xl text-xs font-bold border border-gray-300 text-gray-400 bg-transparent">مشتریان</button>
                </div>
            </div>
        `);
    }

    showSettingsModal() {
        this.createModal('تنظیمات', `
            <div class="space-y-4">
                <div class="flex items-center justify-between p-3 bg-white/5 rounded-xl">
                    <span>تم تیره</span>
                    <label class="relative inline-flex items-center cursor-pointer">
                        <input type="checkbox" checked class="sr-only peer">
                        <div class="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-600"></div>
                    </label>
                </div>
                <div class="flex items-center justify-between p-3 bg-white/5 rounded-xl">
                    <span>دستیار صوتی (الکسا)</span>
                    <button onclick="window.tehranakApp.toggleAlexa()" class="text-purple-500 font-bold text-sm">فعال</button>
                </div>
                <div class="flex items-center justify-between p-3 bg-white/5 rounded-xl">
                    <span>یادآوری‌ها</span>
                    <span class="text-purple-500">فعال</span>
                </div>
                <div class="flex items-center justify-between p-3 bg-white/5 rounded-xl">
                    <span>نسخه برنامه</span>
                    <span class="text-gray-400">2.0.0</span>
                </div>
                <button onclick="window.tehranakApp.logout()" class="w-full py-3 bg-red-500/20 text-red-400 rounded-xl border border-red-500/30">
                    خروج از حساب
                </button>
            </div>
        `);
    }

    showAddModal(type = null) {
        if (type) {
            this.showAddForm(type);
        } else {
            this.createModal('ثبت مورد جدید', this.getAddModalContent());
        }
    }

    getAddModalContent() {
        return `
            <div class="grid grid-cols-2 gap-4">
                <button onclick="window.tehranakApp.showAddForm('res')" class="bg-[#1E293B] p-6 rounded-3xl shadow-lg flex flex-col items-center border border-white/10">
                    <svg class="w-8 h-8 text-purple-500 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"></path>
                    </svg>
                    <span class="font-bold text-white text-sm">مسکونی</span>
                </button>
                <button onclick="window.tehranakApp.showAddForm('com')" class="bg-[#1E293B] p-6 rounded-3xl shadow-lg flex flex-col items-center border border-white/10">
                    <svg class="w-8 h-8 text-blue-500 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"></path>
                    </svg>
                    <span class="font-bold text-white text-sm">تجاری</span>
                </button>
                <button onclick="window.tehranakApp.showAddForm('client')" class="bg-[#1E293B] p-6 rounded-3xl shadow-lg flex flex-col items-center border border-white/10">
                    <svg class="w-8 h-8 text-orange-500 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z"></path>
                    </svg>
                    <span class="font-bold text-white text-sm">مشتری</span>
                </button>
                <button onclick="window.tehranakApp.showAddForm('task')" class="bg-[#1E293B] p-6 rounded-3xl shadow-lg flex flex-col items-center border border-white/10">
                    <svg class="w-8 h-8 text-pink-500 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4"></path>
                    </svg>
                    <span class="font-bold text-white text-sm">وظیفه</span>
                </button>
                <button onclick="window.tehranakApp.showAddForm('commission')" class="bg-[#1E293B] p-6 rounded-3xl shadow-lg flex flex-col items-center border border-white/10 col-span-2">
                    <svg class="w-8 h-8 text-emerald-500 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1"></path>
                    </svg>
                    <span class="font-bold text-white text-sm">ثبت کمیسیون</span>
                </button>
            </div>
        `;
    }

    showAddForm(type) {
        const forms = {
            res: this.getResidentialForm(),
            com: this.getCommercialForm(),
            client: this.getClientForm(),
            task: this.getTaskForm(),
            commission: this.getCommissionForm()
        };

        const formTitle = {
            res: 'ثبت ملک مسکونی',
            com: 'ثبت ملک تجاری',
            client: 'ثبت مشتری جدید',
            task: 'ثبت وظیفه جدید',
            commission: 'ثبت کمیسیون جدید'
        };

        this.createModal(formTitle[type], forms[type], true);
    }

    getResidentialForm() {
        return `
            <div class="space-y-4 max-h-96 overflow-y-auto">
                <div class="grid grid-cols-2 gap-3">
                    <select class="bg-white/5 border border-white/10 rounded-xl p-3 text-white text-sm">
                        <option>آپارتمان</option>
                        <option>خانه</option>
                        <option>ویلا</option>
                        <option>زمین</option>
                    </select>
                    <select class="bg-white/5 border border-white/10 rounded-xl p-3 text-white text-sm">
                        <option>فروش</option>
                        <option>رهن و اجاره</option>
                        <option>رهن کامل</option>
                    </select>
                </div>
                <input type="text" placeholder="آدرس دقیق" class="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-white text-sm" />
                <div class="grid grid-cols-3 gap-3">
                    <input type="number" placeholder="متراژ" class="bg-white/5 border border-white/10 rounded-xl p-3 text-white text-sm" />
                    <input type="number" placeholder="خواب" class="bg-white/5 border border-white/10 rounded-xl p-3 text-white text-sm" />
                    <input type="number" placeholder="طبقه" class="bg-white/5 border border-white/10 rounded-xl p-3 text-white text-sm" />
                </div>
                <input type="text" placeholder="قیمت (تومان)" class="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-white text-sm" />
                <textarea placeholder="توضیحات" class="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-white text-sm h-20"></textarea>
                <div class="flex gap-2 mt-4">
                    <button onclick="this.closest('.fixed').remove()" class="flex-1 py-3 bg-gray-600 text-white rounded-xl">انصراف</button>
                    <button onclick="alert('ملک با موفقیت ثبت شد!')" class="flex-1 py-3 bg-purple-600 text-white rounded-xl">ثبت ملک</button>
                </div>
            </div>
        `;
    }

    getCommercialForm() {
        return `
            <div class="space-y-4 max-h-96 overflow-y-auto">
                <div class="grid grid-cols-2 gap-3">
                    <select class="bg-white/5 border border-white/10 rounded-xl p-3 text-white text-sm">
                        <option>مغازه</option>
                        <option>اداری</option>
                        <option>انبار</option>
                        <option>کارگاه</option>
                    </select>
                    <select class="bg-white/5 border border-white/10 rounded-xl p-3 text-white text-sm">
                        <option>فروش</option>
                        <option>اجاره</option>
                    </select>
                </div>
                <input type="text" placeholder="آدرس دقیق" class="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-white text-sm" />
                <div class="grid grid-cols-2 gap-3">
                    <input type="number" placeholder="متراژ" class="bg-white/5 border border-white/10 rounded-xl p-3 text-white text-sm" />
                    <input type="number" placeholder="قیمت (تومان)" class="bg-white/5 border border-white/10 rounded-xl p-3 text-white text-sm" />
                </div>
                <textarea placeholder="توضیحات" class="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-white text-sm h-20"></textarea>
                <div class="flex gap-2 mt-4">
                    <button onclick="this.closest('.fixed').remove()" class="flex-1 py-3 bg-gray-600 text-white rounded-xl">انصراف</button>
                    <button onclick="alert('ملک تجاری با موفقیت ثبت شد!')" class="flex-1 py-3 bg-blue-600 text-white rounded-xl">ثبت ملک</button>
                </div>
            </div>
        `;
    }

    getClientForm() {
        return `
            <div class="space-y-4 max-h-96 overflow-y-auto">
                <input type="text" placeholder="نام مشتری" class="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-white text-sm" />
                <input type="tel" placeholder="شماره تماس" class="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-white text-sm" />
                <div class="grid grid-cols-2 gap-3">
                    <select class="bg-white/5 border border-white/10 rounded-xl p-3 text-white text-sm">
                        <option>خرید</option>
                        <option>اجاره</option>
                    </select>
                    <select class="bg-white/5 border border-white/10 rounded-xl p-3 text-white text-sm">
                        <option>مسکونی</option>
                        <option>تجاری</option>
                    </select>
                </div>
                <input type="number" placeholder="حداکثر بودجه (تومان)" class="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-white text-sm" />
                <input type="text" placeholder="منطقه مورد نظر" class="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-white text-sm" />
                <textarea placeholder="توضیحات" class="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-white text-sm h-20"></textarea>
                <div class="flex gap-2 mt-4">
                    <button onclick="this.closest('.fixed').remove()" class="flex-1 py-3 bg-gray-600 text-white rounded-xl">انصراف</button>
                    <button onclick="alert('مشتری با موفقیت ثبت شد!')" class="flex-1 py-3 bg-orange-600 text-white rounded-xl">ثبت مشتری</button>
                </div>
            </div>
        `;
    }

    getTaskForm() {
        return `
            <div class="space-y-4 max-h-96 overflow-y-auto">
                <input type="text" placeholder="عنوان وظیفه" class="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-white text-sm" />
                <textarea placeholder="توضیحات وظیفه" class="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-white text-sm h-20"></textarea>
                <div class="grid grid-cols-2 gap-3">
                    <input type="date" class="bg-white/5 border border-white/10 rounded-xl p-3 text-white text-sm" />
                    <input type="time" class="bg-white/5 border border-white/10 rounded-xl p-3 text-white text-sm" />
                </div>
                <select class="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-white text-sm">
                    <option>عادی</option>
                    <option>مهم</option>
                    <option>فوری</option>
                </select>
                <div class="flex gap-2 mt-4">
                    <button onclick="this.closest('.fixed').remove()" class="flex-1 py-3 bg-gray-600 text-white rounded-xl">انصراف</button>
                    <button onclick="alert('وظیفه با موفقیت ثبت شد!')" class="flex-1 py-3 bg-pink-600 text-white rounded-xl">ثبت وظیفه</button>
                </div>
            </div>
        `;
    }

    getCommissionForm() {
        return `
            <div class="space-y-4 max-h-96 overflow-y-auto">
                <input type="text" placeholder="نام خریدار" class="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-white text-sm" />
                <input type="text" placeholder="نام فروشنده" class="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-white text-sm" />
                <div class="grid grid-cols-2 gap-3">
                    <input type="number" placeholder="کمیسیون کل (تومان)" class="bg-white/5 border border-white/10 rounded-xl p-3 text-white text-sm" />
                    <input type="number" placeholder="سهم مشاور (تومان)" class="bg-white/5 border border-white/10 rounded-xl p-3 text-white text-sm" />
                </div>
                <select class="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-white text-sm">
                    <option>پرداخت نشده</option>
                    <option>پرداخت شده</option>
                </select>
                <textarea placeholder="توضیحات" class="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-white text-sm h-20"></textarea>
                <div class="flex gap-2 mt-4">
                    <button onclick="this.closest('.fixed').remove()" class="flex-1 py-3 bg-gray-600 text-white rounded-xl">انصراف</button>
                    <button onclick="alert('کمیسیون با موفقیت ثبت شد!')" class="flex-1 py-3 bg-emerald-600 text-white rounded-xl">ثبت کمیسیون</button>
                </div>
            </div>
        `;
    }

    createModal(title, content, isForm = false) {
        const modal = document.createElement('div');
        modal.className = 'fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-6';
        modal.innerHTML = `
            <div class="bg-[#0F172A] rounded-2xl border border-white/10 w-full max-w-md max-h-[80vh] overflow-hidden">
                <div class="flex justify-between items-center p-6 border-b border-white/10">
                    <h3 class="text-xl font-bold text-white">${title}</h3>
                    <button onclick="this.closest('.fixed').remove()" class="text-gray-400 hover:text-white">
                        <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
                        </svg>
                    </button>
                </div>
                <div class="p-6 ${isForm ? '' : 'overflow-y-auto max-h-96'}">
                    ${content}
                </div>
            </div>
        `;
        
        document.body.appendChild(modal);
        
        // Close on outside click
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                modal.remove();
            }
        });
    }

    toggleAlexa() {
        // Toggle Alexa functionality
        const alexaBtn = event.target;
        if (alexaBtn.textContent === 'فعال') {
            alexaBtn.textContent = 'غیرفعال';
            alexaBtn.className = 'text-gray-400 font-bold text-sm';
        } else {
            alexaBtn.textContent = 'فعال';
            alexaBtn.className = 'text-purple-500 font-bold text-sm';
        }
    }

    logout() {
        if (confirm('آیا از حساب خارج شوید؟')) {
            alert('شما با موفقیت خارج شدید.');
            this.createModal('خروج موفق', '<p class="text-center text-green-400">شما با موفقیت خارج شدید.</p>');
        }
    }

    loadData() {
        // Load data from localStorage
        const savedData = localStorage.getItem('tehranak_data');
        if (savedData) {
            this.data = JSON.parse(savedData);
        } else {
            // Initialize with sample data matching the screenshot
            this.data = {
                properties: [
                    {
                        id: '1',
                        title: 'آپارتمان خام (تست چیدمان)',
                        category: 'residential',
                        type: 'آپارتمان',
                        priceTotal: 5000000000,
                        area: 120,
                        address: 'تهران - منطقه 1',
                        images: ['https://images.unsplash.com/photo-1584622781564-1d7f7a2d2f5e?w=600&h=400&fit=crop']
                    },
                    {
                        id: '2',
                        title: 'ویلا مدرن',
                        category: 'residential',
                        type: 'ویلا',
                        priceTotal: 12000000000,
                        area: 250,
                        address: 'شمال - لواسان',
                        images: ['https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=600&h=400&fit=crop']
                    },
                    {
                        id: '3',
                        title: 'مغازه تجاری',
                        category: 'commercial',
                        type: 'مغازه',
                        priceTotal: 3000000000,
                        area: 80,
                        address: 'تهران - خیابان ولیعصر',
                        images: ['https://images.unsplash.com/photo-1570129477492-45c003edd2be?w=600&h=400&fit=crop']
                    }
                ],
                clients: [],
                tasks: [],
                commissions: []
            };
        }
        
        this.saveData();
    }

    saveData() {
        localStorage.setItem('tehranak_data', JSON.stringify(this.data));
    }

    updateStatistics() {
        // Update statistics to match the screenshot exactly
        const propertiesCount = this.data.properties.length;
        const clientsCount = this.data.clients.length;
        const tasksCount = this.data.tasks.filter(t => !t.completed).length;
        const income = this.data.commissions.filter(c => c.paid).reduce((sum, c) => sum + (c.amount || 0), 0);
        
        document.getElementById('propertiesCount').textContent = propertiesCount;
        document.getElementById('clientsCount').textContent = clientsCount;
        document.getElementById('tasksCount').textContent = tasksCount;
        document.getElementById('incomeAmount').textContent = income > 0 ? `${(income / 1000000).toFixed(0)}M` : '0M';
    }

    installPrompt() {
        // Show install prompt for PWA
        let deferredPrompt;
        
        window.addEventListener('beforeinstallprompt', (e) => {
            e.preventDefault();
            deferredPrompt = e;
            
            // Show install button after a delay
            setTimeout(() => {
                if (deferredPrompt) {
                    this.showInstallPrompt(deferredPrompt);
                }
            }, 10000);
        });
    }

    showInstallPrompt(deferredPrompt) {
        const prompt = document.createElement('div');
        prompt.className = 'fixed top-4 left-4 right-4 bg-gradient-to-r from-purple-600 to-blue-500 rounded-xl p-4 z-50 text-white shadow-lg';
        prompt.innerHTML = `
            <div class="flex items-center justify-between">
                <div>
                    <h4 class="font-bold">نصب اپلیکیشن تهرانک</h4>
                    <p class="text-sm opacity-90">برای دسترسی آسان‌تر، اپ را نصب کنید</p>
                </div>
                <div class="flex gap-2">
                    <button onclick="this.parentElement.parentElement.parentElement.remove()" 
                            class="px-3 py-1 bg-white/20 rounded-lg text-sm">بعداً</button>
                    <button onclick="this.closest('.fixed').style.display='none'; deferredPrompt.prompt(); deferredPrompt.userChoice.then((choiceResult) => { if (choiceResult.outcome === 'accepted') { console.log('User accepted the install prompt'); } deferredPrompt = null; });" 
                            class="px-3 py-1 bg-white text-purple-600 rounded-lg text-sm font-bold">نصب</button>
                </div>
            </div>
        `;
        
        document.body.appendChild(prompt);
        
        // Auto-hide after 15 seconds
        setTimeout(() => {
            if (prompt.parentElement) {
                prompt.remove();
            }
        }, 15000);
    }
}

// Initialize app when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.tehranakApp = new TehranakApp();
});

// Export for use in other scripts
window.TehranakApp = TehranakApp;