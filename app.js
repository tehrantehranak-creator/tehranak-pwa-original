// Tehranak Real Estate PWA Application
class TehranakApp {
    constructor() {
        this.currentTab = 'home';
        this.data = {
            properties: [],
            clients: [],
            tasks: [],
            commissions: []
        };
        
        // Initialize app
        this.init();
    }

    init() {
        this.loadData();
        this.setupEventListeners();
        this.updateStatistics();
        this.installPrompt();
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

        // FAB
        document.getElementById('fab')?.addEventListener('click', () => {
            this.showAddModal();
        });

        // Property slider interactions
        this.setupSlider();
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
            properties: 'املاک',
            add: 'ثبت',
            clients: 'مشتریان',
            tasks: 'وظایف',
            commission: 'کمیسیون'
        };

        otherContent.innerHTML = `
            <div class="pt-20">
                <div class="bg-[#1E293B] rounded-2xl p-6 m-4">
                    <h2 class="text-xl font-bold mb-4">${tabContent[this.currentTab]}</h2>
                    <p class="text-gray-400 mb-4">این بخش در حال توسعه است.</p>
                    <div class="text-center py-8">
                        <div class="w-16 h-16 bg-purple-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                            <svg class="w-8 h-8 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
                            </svg>
                        </div>
                        <p class="text-sm text-gray-500">به زودی قابلیت‌های کامل اضافه خواهد شد</p>
                    </div>
                </div>
            </div>
        `;
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
                    <span>یادآوری‌ها</span>
                    <span class="text-purple-500">فعال</span>
                </div>
                <div class="flex items-center justify-between p-3 bg-white/5 rounded-xl">
                    <span>نسخه برنامه</span>
                    <span class="text-gray-400">1.4.0</span>
                </div>
                <button class="w-full py-3 bg-red-500/20 text-red-400 rounded-xl border border-red-500/30">
                    خروج از حساب
                </button>
            </div>
        `);
    }

    showAddModal() {
        this.createModal('ثبت مورد جدید', `
            <div class="grid grid-cols-2 gap-4">
                <button class="bg-[#1E293B] p-6 rounded-3xl shadow-lg flex flex-col items-center border border-white/10">
                    <svg class="w-8 h-8 text-purple-500 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"></path>
                    </svg>
                    <span class="font-bold text-white text-sm">مسکونی</span>
                </button>
                <button class="bg-[#1E293B] p-6 rounded-3xl shadow-lg flex flex-col items-center border border-white/10">
                    <svg class="w-8 h-8 text-blue-500 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"></path>
                    </svg>
                    <span class="font-bold text-white text-sm">تجاری</span>
                </button>
                <button class="bg-[#1E293B] p-6 rounded-3xl shadow-lg flex flex-col items-center border border-white/10">
                    <svg class="w-8 h-8 text-orange-500 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z"></path>
                    </svg>
                    <span class="font-bold text-white text-sm">مشتری</span>
                </button>
                <button class="bg-[#1E293B] p-6 rounded-3xl shadow-lg flex flex-col items-center border border-white/10">
                    <svg class="w-8 h-8 text-pink-500 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4"></path>
                    </svg>
                    <span class="font-bold text-white text-sm">وظیفه</span>
                </button>
                <button class="bg-[#1E293B] p-6 rounded-3xl shadow-lg flex flex-col items-center border border-white/10 col-span-2">
                    <svg class="w-8 h-8 text-emerald-500 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1"></path>
                    </svg>
                    <span class="font-bold text-white text-sm">ثبت کمیسیون</span>
                </button>
            </div>
        `);
    }

    createModal(title, content) {
        const modal = document.createElement('div');
        modal.className = 'fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-6';
        modal.innerHTML = `
            <div class="bg-[#0F172A] rounded-2xl border border-white/10 w-full max-w-md max-h-[80vh] overflow-y-auto">
                <div class="flex justify-between items-center p-6 border-b border-white/10">
                    <h3 class="text-xl font-bold text-white">${title}</h3>
                    <button class="text-gray-400 hover:text-white" onclick="this.closest('.fixed').remove()">
                        <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
                        </svg>
                    </button>
                </div>
                <div class="p-6">
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
                        price: 5000000000,
                        area: 120,
                        location: 'تهران',
                        images: ['https://images.unsplash.com/photo-1584622781564-1d7f7a2d2f5e?w=600&h=400&fit=crop']
                    },
                    {
                        id: '2',
                        title: 'ویلا مدرن',
                        category: 'residential',
                        price: 12000000000,
                        area: 250,
                        location: 'شمال',
                        images: ['https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=600&h=400&fit=crop']
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