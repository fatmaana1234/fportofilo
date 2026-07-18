/* ==========================================================================
   Firebase Configuration
   ========================================================================== */
const firebaseConfig = {
  apiKey: "AIzaSyAZvvJOO9pZUODb4v9MMbYsxhk-64Ai7Vc",
  authDomain: "fatma-portfolio.firebaseapp.com",
  projectId: "fatma-portfolio",
  storageBucket: "fatma-portfolio.firebasestorage.app",
  messagingSenderId: "611447591534",
  appId: "1:611447591534:web:b17ef5b85692885c964c7f",
  measurementId: "G-57NCH1TCSQ"
};

// Initialize Firebase (guarded so a network failure doesn't break the page)
let db = null;
try {
  if (typeof firebase !== 'undefined' && firebase.initializeApp) {
    firebase.initializeApp(firebaseConfig);
    db = firebase.firestore();
  }
} catch (e) {
  console.warn('Firebase init failed, using fallback data only:', e);
}

/* ==========================================================================
   State Management
   ========================================================================== */
let currentLang = localStorage.getItem('site_lang') || 'en';
let currentTheme = localStorage.getItem('site_theme') || 'dark';
let soundEnabled = localStorage.getItem('sound_enabled') !== 'false';
let allProjectsCache = [];
let currentFilter = 'all';
let visibleCount = 6;
const MOBILE_INITIAL_COUNT = 4;
const DESKTOP_INITIAL_COUNT = 999;

const htmlElement = document.documentElement;
const langToggleBtn = document.getElementById('langToggle');
const themeToggleBtn = document.getElementById('themeToggle');
const sunIcon = document.querySelector('.sun-icon');
const moonIcon = document.querySelector('.moon-icon');
const hamburgerBtn = document.getElementById('hamburger');
const navLinks = document.getElementById('navLinks');
const mobileMenuOverlay = document.getElementById('mobileMenuOverlay');
const scrollTopBtn = document.getElementById('scrollTopBtn');
const soundToggleBtn = document.getElementById('soundToggle');
const navbar = document.getElementById('navbar');
const scrollProgress = document.getElementById('scrollProgress');
const preloader = document.getElementById('preloader');

/* ==========================================================================
   Translations (Complete — covers EVERY visible string)
   ========================================================================== */
const translations = {
    en: {
        // Brand & nav
        brand: 'Fatma <span>Rabea</span>',
        nav_home: "Home", nav_about: "About", nav_services: "Services",
        nav_projects: "Projects", nav_testimonials: "Reviews", nav_contact: "Contact",

        // Preloader
        preloader_text: "Loading Experience…",

        // Hero
        hero_pill: "WordPress Developer | Digital Marketing Specialist",
        hero_title: "Building Beautiful <span>WordPress Websites</span> That Attract, Engage, and Convert",
        hero_subtitle: "I create modern, fast, and user-friendly WordPress websites designed to help your business grow and stand out in the digital world.",
        hero_cta1: "View My Work", hero_cta2: "Start Your Project",
        stat_projects: "Projects", stat_years: "Years", stat_satisfaction: "Satisfaction",
        badge_1: "WP Expert ✦", badge_2: "SEO Optimized ⚡",

        // About
        about_heading: "About Me",
        about_text_full: "I am a passionate WordPress developer with a strong background in digital marketing and content creation. I specialize in building responsive, visually appealing, and performance-optimized websites. My goal is to create digital experiences that not only look beautiful but also deliver real business results.",
        career_obj_heading: "Career Objective",
        career_obj_text: "To design and develop high-quality WordPress websites that help businesses grow, attract customers, and succeed online.",
        exp_title: "Freelance WordPress Developer",
        exp_1: "Built responsive WordPress websites",
        exp_2: "Customized themes and plugins",
        exp_3: "Improved website performance and SEO",
        exp_4: "Worked with clients remotely",

        // Skills
        skills_heading: "My Skills",
        skills_technical: "Technical",
        skills_professional: "Professional",
        skill_1: "WordPress Development",
        skill_2: "CSS & Responsive Design",
        skill_3: "SEO Basics",
        skill_4: "Digital Marketing",
        skill_5: "Adobe Tools",
        skill_6: "Video Editing",
        skill_7: "Communication",
        skill_8: "Problem Solving",
        skill_9: "Creativity",
        skill_10: "Time Management",

        // Services
        services_heading: "My Services",
        srv_1_title: "Custom WordPress Design",
        srv_1_desc: "Tailored, modern website designs built specifically to reflect your brand identity and convert visitors.",
        srv_2_title: "WooCommerce Store Setup",
        srv_2_desc: "Fully functional and beautifully designed e-commerce stores ready to sell your products.",
        srv_3_title: "Website Speed Optimization",
        srv_3_desc: "Enhancing website loading times to improve user experience and boost search rankings.",
        srv_4_title: "SEO Optimization",
        srv_4_desc: "On-page SEO setup ensuring your website ranks higher on search engines and attracts organic traffic.",
        srv_5_title: "Website Maintenance",
        srv_5_desc: "Ongoing support, security updates, and performance monitoring to keep your site running smoothly.",

        // Projects
        projects_heading: "Featured Projects",
        projects_subtitle: "A showcase of my recent WordPress websites and creative design work.",
        filter_all: "All",
        filter_wordpress: "WordPress",
        filter_english: "English Learning",
        filter_arabic: "Arabic Language",
        filter_science: "Science",
        filter_math: "Mathematics",
        filter_social: "Social Studies",
        filter_islamic: "Islamic Studies",
        filter_health: "Health & Activity",
        filter_other: "Other",
        show_more: "Show More",
        show_less: "Show Less",
        no_projects: "No projects available yet.",
        preview_project: "Preview Project",
        cat_wordpress: "WordPress Website",
        cat_creative: "Creative Work",
        cat_english: "English Learning",
        cat_arabic: "Arabic Language",
        cat_science: "Science",
        cat_math: "Mathematics",
        cat_social: "Social Studies",
        cat_islamic: "Islamic Studies",
        cat_health: "Health & Activity",

        // Slider
        slider_heading: "Project Highlights",
        slider_subtitle: "A quick glimpse of recent work — swipe through to explore.",

        // Testimonials
        testimonials_heading: "What Clients Say",
        review_leave_heading: "Leave a Review",
        review_ph_name: "Your Name",
        review_ph_text: "Write your feedback...",
        review_submit: "Submit Review",
        no_reviews: "No reviews yet.",
        review_thanks: "Thank you for your review! It will appear shortly.",

        // Contact
        contact_heading: "Let's Build Something Amazing Together",
        contact_text: "Have a project idea? I'd love to help you bring it to life.",
        contact_email_label: "Email",
        contact_linkedin_label: "LinkedIn Profile",
        contact_ph_name: "Name",
        contact_ph_email: "Email",
        contact_ph_message: "Message",
        contact_submit: "Send Message",
        contact_success: "Message sent! I'll get back to you soon.",

        // Footer
        footer_rights: "&copy; <span id='year'></span> Fatma Rabea. All Rights Reserved.",
        footer_admin: "Admin Login",

        // Chatbot
        chat_title: "AI Assistant",
        chat_status: "Online",
        chat_ph: "Type a message...",
        chat_q1: "Pricing & Value",
        chat_q2: "Your Services",
        chat_q3: "Hire Fatma",
        chat_welcome: "Hi there! I'm Fatma's AI assistant. How can I help you with your next WordPress project today? ✨"
    },
    ar: {
        // Brand & nav
        brand: 'فاطمة <span>ربيع</span>',
        nav_home: "الرئيسية", nav_about: "نبذة عني", nav_services: "خدماتي",
        nav_projects: "مشاريعي", nav_testimonials: "الآراء", nav_contact: "تواصل معي",

        // Preloader
        preloader_text: "جارٍ التحضير…",

        // Hero
        hero_pill: "مطور ووردبريس | أخصائي تسويق رقمي",
        hero_title: "بناء <span>مواقع ووردبريس</span> جذابة وتفاعلية تحول الزوار إلى عملاء",
        hero_subtitle: "أقوم بإنشاء مواقع ووردبريس حديثة وسريعة وسهلة الاستخدام مصممة لمساعدة عملك على النمو والتميز في العالم الرقمي.",
        hero_cta1: "شاهد أعمالي", hero_cta2: "ابدأ مشروعك",
        stat_projects: "مشروع", stat_years: "سنوات", stat_satisfaction: "رضا العملاء",
        badge_1: "خبير ووردبريس ✦", badge_2: "تحسين محركات البحث ⚡",

        // About
        about_heading: "نبذة عني",
        about_text_full: "أنا مطورة ووردبريس شغوفة بخلفية قوية في التسويق الرقمي وإنشاء المحتوى. أتخصص في بناء مواقع متجاوبة وجذابة بصريًا ومحسّنة للأداء. هدفي هو إنشاء تجارب رقمية لا تبدو جميلة فحسب، بل تحقق نتائج أعمال حقيقية.",
        career_obj_heading: "الهدف المهني",
        career_obj_text: "تصميم وتطوير مواقع ووردبريس عالية الجودة تساعد الشركات على النمو وجذب العملاء والنجاح عبر الإنترنت.",
        exp_title: "مطورة ووردبريس مستقلة",
        exp_1: "بناء مواقع ووردبريس متجاوبة",
        exp_2: "تخصيص القوالب والإضافات",
        exp_3: "تحسين أداء المواقع وSEO",
        exp_4: "العمل عن بُعد مع العملاء",

        // Skills
        skills_heading: "مهاراتي",
        skills_technical: "تقنية",
        skills_professional: "مهنية",
        skill_1: "تطوير ووردبريس",
        skill_2: "CSS وتصميم متجاوب",
        skill_3: "أساسيات SEO",
        skill_4: "التسويق الرقمي",
        skill_5: "أدوات Adobe",
        skill_6: "تحرير الفيديو",
        skill_7: "التواصل",
        skill_8: "حل المشكلات",
        skill_9: "الإبداع",
        skill_10: "إدارة الوقت",

        // Services
        services_heading: "خدماتي",
        srv_1_title: "تصميم ووردبريس مخصص",
        srv_1_desc: "تصاميم مواقع حديثة ومخصصة تعكس هوية علامتك التجارية وتحوّل الزوار إلى عملاء.",
        srv_2_title: "إعداد متاجر ووكومرس",
        srv_2_desc: "متاجر إلكترونية كاملة الوظائف وذات تصميم جميل وجاهزة لبيع منتجاتك.",
        srv_3_title: "تحسين سرعة الموقع",
        srv_3_desc: "تحسين أوقات تحميل الموقع لتحسين تجربة المستخدم ورفع ترتيب البحث.",
        srv_4_title: "تحسين محركات البحث",
        srv_4_desc: "إعداد SEO على الصفحة لضمان ترتيب أعلى لموقعك في محركات البحث وجذب زيارات عضوية.",
        srv_5_title: "صيانة المواقع",
        srv_5_desc: "دعم مستمر وتحديثات أمنية ومراقبة الأداء للحفاظ على سلاسة تشغيل موقعك.",

        // Projects
        projects_heading: "أبرز المشاريع",
        projects_subtitle: "عرض لأحدث المواقع التي قمت ببنائها باستخدام ووردبريس بالإضافة إلى مشاريعي الإبداعية الأخرى.",
        filter_all: "الكل",
        filter_wordpress: "ووردبريس",
        filter_english: "تعلم الإنجليزية",
        filter_arabic: "اللغة العربية",
        filter_science: "العلوم",
        filter_math: "الرياضيات",
        filter_social: "الدراسات الاجتماعية",
        filter_islamic: "الدراسات الإسلامية",
        filter_health: "الصحة والنشاط",
        filter_other: "أخرى",
        show_more: "عرض المزيد",
        show_less: "عرض أقل",
        no_projects: "لا توجد مشاريع حالياً.",
        preview_project: "معاينة المشروع",
        cat_wordpress: "موقع ووردبريس",
        cat_creative: "أعمال إبداعية",
        cat_english: "تعلم الإنجليزية",
        cat_arabic: "اللغة العربية",
        cat_science: "العلوم",
        cat_math: "الرياضيات",
        cat_social: "الدراسات الاجتماعية",
        cat_islamic: "الدراسات الإسلامية",
        cat_health: "الصحة والنشاط",

        // Slider
        slider_heading: "أبرز المشاريع",
        slider_subtitle: "لمحة سريعة عن أحدث الأعمال — اسحب للتنقل بينها.",

        // Testimonials
        testimonials_heading: "ماذا يقول العملاء",
        review_leave_heading: "اترك تقييمك",
        review_ph_name: "اسمك",
        review_ph_text: "اكتب ملاحظاتك...",
        review_submit: "إرسال التقييم",
        no_reviews: "لا توجد تقييمات بعد.",
        review_thanks: "شكراً لتقييمك! سيظهر قريباً.",

        // Contact
        contact_heading: "لنبنِ شيئاً مذهلاً معاً",
        contact_text: "لديك فكرة مشروع؟ يسعدني مساعدتك في تحويلها إلى واقع.",
        contact_email_label: "البريد الإلكتروني",
        contact_linkedin_label: "ملف لينكدإن",
        contact_ph_name: "الاسم",
        contact_ph_email: "البريد الإلكتروني",
        contact_ph_message: "الرسالة",
        contact_submit: "إرسال الرسالة",
        contact_success: "تم إرسال رسالتك! سأرد عليك قريباً.",

        // Footer
        footer_rights: "&copy; <span id='year'></span> فاطمة ربيع. جميع الحقوق محفوظة.",
        footer_admin: "دخول المسؤول",

        // Chatbot
        chat_title: "المساعد الذكي",
        chat_status: "نشط الآن",
        chat_ph: "اكتب رسالة...",
        chat_q1: "الأسعار والقيمة",
        chat_q2: "خدمات فاطمة",
        chat_q3: "توظيف فاطمة",
        chat_welcome: "مرحباً! أنا مساعد فاطمة الذكي. كيف يمكنني مساعدتك في مشروع الووردبريس القادم الخاص بك اليوم؟ ✨"
    }
};

/* ==========================================================================
   Theme Functions  (FIX: properly update currentTheme on toggle)
   ========================================================================== */
function setTheme(theme) {
    currentTheme = theme; // 🔑 critical fix — update the variable
    htmlElement.setAttribute('data-theme', theme);
    localStorage.setItem('site_theme', theme);
    if (sunIcon && moonIcon) {
        sunIcon.style.display = theme === 'dark' ? 'block' : 'none';
        moonIcon.style.display = theme === 'dark' ? 'none' : 'block';
    }
}
if (themeToggleBtn) {
    themeToggleBtn.addEventListener('click', () => {
        const next = currentTheme === 'dark' ? 'light' : 'dark';
        setTheme(next);
        playSound('toggle');
    });
}

/* ==========================================================================
   Language Functions
   ========================================================================== */
function setLanguage(lang) {
    currentLang = lang;
    localStorage.setItem('site_lang', lang);
    htmlElement.setAttribute('lang', lang);
    htmlElement.setAttribute('dir', lang === 'ar' ? 'rtl' : 'ltr');

    // Update text content
    document.querySelectorAll('[data-i18n]').forEach(el => {
        const key = el.getAttribute('data-i18n');
        if (translations[lang] && translations[lang][key]) {
            el.innerHTML = translations[lang][key];
        }
    });
    // Update placeholders
    document.querySelectorAll('[data-i18n-ph]').forEach(el => {
        const key = el.getAttribute('data-i18n-ph');
        if (translations[lang] && translations[lang][key]) {
            el.setAttribute('placeholder', translations[lang][key]);
        }
    });
    // Update lang toggle label
    const langLabel = document.querySelector('.lang-label');
    if (langLabel) langLabel.textContent = lang === 'en' ? 'AR' : 'EN';

    // Re-render dynamic content that has language-dependent text
    if (allProjectsCache.length) {
        renderProjects(allProjectsCache, currentFilter);
        renderSlider(allProjectsCache);
    }
    // Update year span if footer rebuilt
    const yearEl = document.getElementById('year');
    if (yearEl) yearEl.textContent = new Date().getFullYear();
}
if (langToggleBtn) {
    langToggleBtn.addEventListener('click', () => {
        const next = currentLang === 'en' ? 'ar' : 'en';
        setLanguage(next);
        playSound('toggle');
    });
}

/* ==========================================================================
   Mobile Menu / Hamburger  (FIX: was completely missing event binding)
   ========================================================================== */
function closeMobileMenu() {
    if (!navLinks || !hamburgerBtn) return;
    navLinks.classList.remove('active');
    hamburgerBtn.classList.remove('active');
    hamburgerBtn.setAttribute('aria-expanded', 'false');
    if (mobileMenuOverlay) mobileMenuOverlay.classList.remove('active');
    document.body.style.overflow = '';
}
function openMobileMenu() {
    if (!navLinks || !hamburgerBtn) return;
    navLinks.classList.add('active');
    hamburgerBtn.classList.add('active');
    hamburgerBtn.setAttribute('aria-expanded', 'true');
    if (mobileMenuOverlay) mobileMenuOverlay.classList.add('active');
    document.body.style.overflow = 'hidden';
}
function toggleMobileMenu() {
    if (navLinks.classList.contains('active')) {
        closeMobileMenu();
    } else {
        openMobileMenu();
    }
    playSound('toggle');
}
if (hamburgerBtn) {
    hamburgerBtn.addEventListener('click', toggleMobileMenu);
}
if (mobileMenuOverlay) {
    mobileMenuOverlay.addEventListener('click', closeMobileMenu);
}
// Close menu when a nav link is clicked
if (navLinks) {
    navLinks.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', closeMobileMenu);
    });
}
// Close on Escape
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeMobileMenu();
});

/* ==========================================================================
   Sound System (subtle UI feedback)
   ========================================================================== */
let audioCtx = null;
function getAudioCtx() {
    if (!audioCtx) {
        try {
            audioCtx = new (window.AudioContext || window.webkitAudioContext)();
        } catch (e) { return null; }
    }
    return audioCtx;
}
function playSound(type) {
    if (!soundEnabled) return;
    const ctx = getAudioCtx();
    if (!ctx) return;
    if (ctx.state === 'suspended') ctx.resume();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.connect(gain);
    gain.connect(ctx.destination);

    const freqMap = {
        toggle: 660,
        click: 880,
        hover: 1200,
        send: 540,
        open: 720
    };
    osc.frequency.value = freqMap[type] || 660;
    osc.type = 'sine';
    gain.gain.setValueAtTime(0.0001, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.06, ctx.currentTime + 0.01);
    gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.15);
    osc.start(ctx.currentTime);
    osc.stop(ctx.currentTime + 0.16);
}
function updateSoundToggleUI() {
    if (!soundToggleBtn) return;
    const onIcon = soundToggleBtn.querySelector('.sound-on-icon');
    const offIcon = soundToggleBtn.querySelector('.sound-off-icon');
    if (onIcon && offIcon) {
        onIcon.style.display = soundEnabled ? 'block' : 'none';
        offIcon.style.display = soundEnabled ? 'none' : 'block';
    }
    soundToggleBtn.setAttribute('aria-pressed', soundEnabled);
}
if (soundToggleBtn) {
    soundToggleBtn.addEventListener('click', () => {
        soundEnabled = !soundEnabled;
        localStorage.setItem('sound_enabled', soundEnabled);
        updateSoundToggleUI();
        if (soundEnabled) playSound('toggle');
    });
    updateSoundToggleUI();
}

/* ==========================================================================
   Scroll Progress + Navbar behaviour + Scroll-to-top
   ========================================================================== */
let lastScrollY = 0;
function onScroll() {
    const sy = window.scrollY;
    const docH = document.documentElement.scrollHeight - window.innerHeight;
    const progress = docH > 0 ? (sy / docH) * 100 : 0;
    if (scrollProgress) scrollProgress.style.width = progress + '%';

    // Navbar hide on scroll down, show on scroll up
    if (navbar) {
        if (sy > 60) navbar.classList.add('scrolled');
        else navbar.classList.remove('scrolled');
        if (sy > 240 && sy > lastScrollY) {
            navbar.classList.add('hidden-nav');
        } else {
            navbar.classList.remove('hidden-nav');
        }
    }

    // Scroll-to-top button
    if (scrollTopBtn) {
        if (sy > 400) scrollTopBtn.classList.add('visible');
        else scrollTopBtn.classList.remove('visible');
    }

    lastScrollY = sy;
}
window.addEventListener('scroll', onScroll, { passive: true });
if (scrollTopBtn) {
    scrollTopBtn.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
        playSound('click');
    });
}

/* ==========================================================================
   Animated counters for hero stats
   ========================================================================== */
function animateCounter(el, target) {
    const duration = 1800;
    const startTime = performance.now();
    const step = (now) => {
        const t = Math.min((now - startTime) / duration, 1);
        const eased = 1 - Math.pow(1 - t, 3);
        el.textContent = Math.floor(eased * target);
        if (t < 1) requestAnimationFrame(step);
        else el.textContent = target;
    };
    requestAnimationFrame(step);
}

/* ==========================================================================
   Projects Data  (built-in, with rich categories)
   ========================================================================== */
const myProjects = [
    {
        title: "Smart Scientists 2026",
        title_ar: "رحلة عبر الزمن مع علماء المسلمين",
        desc: "An interactive educational platform introducing students to the contributions of Muslim scientists throughout history.",
        desc_ar: "منصة تعليمية تهدف لتعريف الطلاب بإسهامات علماء المسلمين عبر التاريخ بأسلوب تفاعلي.",
        image: "assets/img/smart_scientists_ui_1778252949835.png",
        link: "https://sites.google.com/view/smart-scientists-2026/%D8%A7%D9%84%D8%B5%D9%81%D8%AD%D8%A9-%D8%A7%D9%84%D8%B1%D8%A6%D9%8A%D8%B3%D9%8A%D8%A9",
        category: "wordpress"
    },
    {
        title: "Journey of Heroes",
        title_ar: "رحلة الأبطال في عالم الجمال والآداب",
        desc: "An educational project that instills beautiful manners and moral values in young people.",
        desc_ar: "مشروع تعليمي قيمي يهدف لغرس الآداب الجميلة والقيم الأخلاقية في نفوس الناشئة.",
        image: "assets/img/journey_heroes_ui_1778253140090.png",
        link: "https://sites.google.com/view/journey-of-heroes-in-the-world/%D8%A7%D9%84%D8%B1%D8%A6%D9%8A%D8%B3%D9%8A%D8%A9-%D8%A7%D9%86%D8%B7%D9%84%D8%A7%D9%82-%D8%A7%D9%84%D8%B1%D8%AD%D9%84%D8%A9",
        category: "wordpress"
    },
    {
        title: "Health Hero Academy",
        title_ar: "أكاديمية بطل الصحة (مغامرة الحياة الصحية)",
        desc: "A platform teaching kids healthy habits and proper nutrition through fun adventures.",
        desc_ar: "منصة تهدف لتعليم الأطفال العادات الصحية السليمة والتغذية المفيدة من خلال مغامرات ممتعة.",
        image: "assets/img/health_hero_ui_1778253153287.png",
        link: "https://sites.google.com/view/health-hero-academy-/home-page-start-here",
        category: "wordpress"
    },
    {
        title: "Science Hero 2026",
        title_ar: "بطل العلوم: رحلة في عالم المادة",
        desc: "Simplifying science and physics concepts for young explorers in an engaging, experimental way.",
        desc_ar: "تبسيط مفاهيم العلوم والفيزياء للمستكشف الصغير بأسلوب مشوق وتجريبي.",
        image: "assets/img/science_hero_ui_1778253379691.png",
        link: "https://sites.google.com/view/science-hero-2026/%D8%A7%D9%84%D8%B5%D9%81%D8%AD%D8%A9-%D8%A7%D9%84%D8%B1%D8%A6%D9%8A%D8%B3%D9%8A%D8%A9",
        category: "wordpress"
    },
    {
        title: "Fun English Learning Series",
        title_ar: "سلسلة تعلم الإنجليزية الممتعة",
        desc: "An educational video that simplifies English grammar and vocabulary for beginners.",
        desc_ar: "فيديو تعليمي يهدف لتبسيط قواعد ومفردات اللغة الإنجليزية للمبتدئين.",
        image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=800&auto=format&fit=crop",
        link: "https://drive.google.com/file/d/1bf2efrCZKlenyns5MbQY-QZIOX7wz7GL/view?usp=sharing",
        category: "english"
    },
    {
        title: "English Learning — Part 4",
        title_ar: "تعلم الإنجليزية - الجزء الرابع",
        desc: "Continuation of the interactive English learning series to boost listening and pronunciation skills.",
        desc_ar: "استكمال لسلسلة دروس اللغة الإنجليزية التفاعلية لتعزيز مهارات الاستماع والنطق.",
        image: "https://images.unsplash.com/photo-1552664730-d307ca884978?q=80&w=800&auto=format&fit=crop",
        link: "https://drive.google.com/file/d/14XB4cpFs-gkePKS_YanoB4wMX-3OMh-j/view?usp=sharing",
        category: "english"
    },
    {
        title: "English Learning — Part 3",
        title_ar: "تعلم الإنجليزية - الجزء الثالث",
        desc: "An advanced lesson in everyday English conversation skills.",
        desc_ar: "درس متقدم في مهارات المحادثة واللغة الإنجليزية اليومية.",
        image: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=800&auto=format&fit=crop",
        link: "https://drive.google.com/file/d/1xqBJJD_trhGlycUAHcOUfhdR4hocOaaQ/view?usp=sharing",
        category: "english"
    },
    {
        title: "English Learning — Part 2",
        title_ar: "تعلم الإنجليزية - الجزء الثاني",
        desc: "A solid foundation in essential English grammar, simplified.",
        desc_ar: "تأسيس قوي في قواعد اللغة الإنجليزية الأساسية بأسلوب مبسط.",
        image: "https://images.unsplash.com/photo-1507679799987-c73774586594?q=80&w=800&auto=format&fit=crop",
        link: "https://drive.google.com/file/d/1MA_eLqWRYjchUT8-F4Wkvjtdz_PQCcjv/view?usp=sharing",
        category: "english"
    },
    {
        title: "Health Heroes Camp Adventures",
        title_ar: "مغامرات معسكر أبطال الصحة",
        desc: "An animated video promoting physical activity and vitality for children.",
        desc_ar: "فيديو حركي يهدف لتعزيز النشاط البدني والحيوية لدى الأطفال.",
        image: "https://images.unsplash.com/photo-1485827404703-89b55fcc595e?q=80&w=800&auto=format&fit=crop",
        link: "https://drive.google.com/file/d/13L93OX0y-YlrzBbAs877Upe_o_dRP7U0/view?usp=sharing",
        category: "health"
    },
    {
        title: "Healthy Life Guide (English)",
        title_ar: "دليل الحياة الصحية (English Guide)",
        desc: "An educational file linking English learning with essential health concepts.",
        desc_ar: "ملف تعليمي يربط بين تعلم اللغة الإنجليزية والمفاهيم الصحية الأساسية.",
        image: "https://images.unsplash.com/photo-1541462608141-ad4d157ed7f4?q=80&w=800&auto=format&fit=crop",
        link: "https://drive.google.com/file/d/19DaMioNm2g6LBheM6LraIt-fl6fRprvr/view?usp=sharing",
        category: "health"
    },
    {
        title: "World of Social Studies",
        title_ar: "عالم الدراسات الاجتماعية",
        desc: "An educational video introducing students to history and geography in a storytelling style.",
        desc_ar: "فيديو تعليمي يهدف لتعريف الطلاب بالتاريخ والجغرافيا بأسلوب قصصي.",
        image: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?q=80&w=800&auto=format&fit=crop",
        link: "https://drive.google.com/file/d/1t5MHmL4pstdSdltSp-0rzeE5N88brjxJ/view?usp=sharing",
        category: "social"
    },
    {
        title: "Social Studies — Part 3",
        title_ar: "الدراسات الاجتماعية - الجزء الثالث",
        desc: "A journey through the history and civilizations of the world via an engaging educational video.",
        desc_ar: "رحلة معرفية في تاريخ وحضارات العالم من خلال فيديو تعليمي مشوق.",
        image: "https://images.unsplash.com/photo-1586717791821-3f44a563eb4c?q=80&w=800&auto=format&fit=crop",
        link: "https://drive.google.com/file/d/1U3bWtzUEDqjMQs3RqK7K5bn-4vIXFNem/view?usp=sharing",
        category: "social"
    },
    {
        title: "Social Studies — Part 2",
        title_ar: "الدراسات الاجتماعية - الجزء الثاني",
        desc: "Strengthening national values and geographical awareness among students visually.",
        desc_ar: "تعزيز القيم الوطنية والوعي الجغرافي لدى الطلاب بأسلوب مرئي.",
        image: "https://images.unsplash.com/photo-1434626881859-194d67b2b86f?q=80&w=800&auto=format&fit=crop",
        link: "https://drive.google.com/file/d/16cTCTfofl1cgnRCcJwg_m1oGRkcOgj-f/view?usp=sharing",
        category: "social"
    },
    {
        title: "Our Beautiful Manners (Saudi Style)",
        title_ar: "آدابنا الجميلة (النمط السعودي)",
        desc: "A video promoting national identity and social etiquette prevalent in the Kingdom.",
        desc_ar: "فيديو يهدف لتعزيز الهوية الوطنية والآداب الاجتماعية السائدة في المملكة.",
        image: "https://images.unsplash.com/photo-1519389950473-47ba0277781c?q=80&w=800&auto=format&fit=crop",
        link: "https://drive.google.com/file/d/11KGDjBBigrb6oE4q75TCKqC4ss3SUWBG/view?usp=sharing",
        category: "social"
    },
    {
        title: "Islamic Studies Adventures",
        title_ar: "مغامرات الدراسات الإسلامية",
        desc: "An interactive file instilling Islamic values and morals through stories and activities.",
        desc_ar: "ملف تفاعلي يهدف لغرس القيم والأخلاق الإسلامية من خلال قصص وأنشطة.",
        image: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=800&auto=format&fit=crop",
        link: "https://drive.google.com/file/d/1Y-nad8dno_w64_--ZGjLfgcx-CT-Hrdn/view?usp=sharing",
        category: "islamic"
    },
    {
        title: "Arabic Language Masterpieces",
        title_ar: "روائع اللغة العربية",
        desc: "An educational video simplifying Arabic grammar and fostering a love of reading.",
        desc_ar: "فيديو تعليمي يهدف لتبسيط قواعد اللغة العربية وحب القراءة.",
        image: "https://images.unsplash.com/photo-1558494949-ef010cbdcc4b?q=80&w=800&auto=format&fit=crop",
        link: "https://drive.google.com/file/d/1sCX3SrvIkyzML_1Wo9qFxgEDo1Lh-iFB/view?usp=sharing",
        category: "arabic"
    },
    {
        title: "Arabic Language — Review & Reinforcement",
        title_ar: "اللغة العربية - مراجعة وتعزيز",
        desc: "A video focusing on writing and spelling skills in an interactive style.",
        desc_ar: "فيديو يركز على مهارات الكتابة والإملاء بأسلوب تفاعلي.",
        image: "https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?q=80&w=800&auto=format&fit=crop",
        link: "https://drive.google.com/file/d/1328QaGOXBmVOzpi245s262O7cD1kTF6Y/view?usp=sharing",
        category: "arabic"
    },
    {
        title: "Arabic Language — Level 2",
        title_ar: "اللغة العربية - المستوى الثاني",
        desc: "Developing expression and reading comprehension skills through rich visual content.",
        desc_ar: "تطوير مهارات التعبير والفهم القرائي من خلال محتوى مرئي غني.",
        image: "https://images.unsplash.com/photo-1551288049-bbbda536339a?q=80&w=800&auto=format&fit=crop",
        link: "https://drive.google.com/file/d/19NGxAlHVpMshAkQ8-ZHD9GYoEsnXQAbk/view?usp=sharing",
        category: "arabic"
    },
    {
        title: "Gateway to Muslim Scientists",
        title_ar: "بوابة علماء المسلمين الاستكشافية",
        desc: "A visual tour highlighting the genius of Arab and Muslim scientists and their inventions.",
        desc_ar: "جولة مرئية تهدف لإبراز عبقرية العلماء العرب والمسلمين واختراعاتهم.",
        image: "https://images.unsplash.com/photo-1531403009284-440f080d1e12?q=80&w=800&auto=format&fit=crop",
        link: "https://drive.google.com/file/d/14sDe7FHIAk0NSvCPVkLu9NlwEO6oEVpA/view?usp=sharing",
        category: "science"
    },
    {
        title: "Jabir ibn Hayyan & The Magic Paper",
        title_ar: "جابر بن حيان والورق السحري",
        desc: "An illustrated scientific story introducing children to the achievements of chemist Jabir ibn Hayyan.",
        desc_ar: "قصة علمية مصورة تهدف لتعريف الأطفال بإنجازات الكيميائي جابر بن حيان.",
        image: "https://images.unsplash.com/photo-1454165833767-1330084b1d3a?q=80&w=800&auto=format&fit=crop",
        link: "https://drive.google.com/file/d/1Acw5fgDkzbeCkr636dj2yQFz0B2fFGm4/view?usp=sharing",
        category: "science"
    },
    {
        title: "Arab Scientists Adventures",
        title_ar: "مغامرات العلماء العرب",
        desc: "A comprehensive file documenting the history of Arabic science and inspiring the next generation.",
        desc_ar: "ملف شامل يهدف لتوثيق تاريخ العلوم العربية وإلهام الجيل القادم.",
        image: "https://images.unsplash.com/photo-1518770660439-4636190af475?q=80&w=800&auto=format&fit=crop",
        link: "https://drive.google.com/file/d/1uiiD6_cfvYOB-2-aIv0W0WUHwrUY24PE/view?usp=sharing",
        category: "science"
    },
    {
        title: "Journey into the World of Science",
        title_ar: "رحلة في عالم العلوم",
        desc: "An educational video exploring natural phenomena around us in a scientific style.",
        desc_ar: "فيديو تعليمي يهدف لاستكشاف ظواهر الطبيعة من حولنا بأسلوب علمي.",
        image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=800&auto=format&fit=crop",
        link: "https://drive.google.com/file/d/1OmYYSheXme3GecSbjP7XRFwXks6o0cNL/view?usp=sharing",
        category: "science"
    },
    {
        title: "Interactive Science Lab",
        title_ar: "مختبر العلوم التفاعلي",
        desc: "A video focusing on simple science experiments that can be done in the classroom.",
        desc_ar: "فيديو يركز على التجارب العلمية البسيطة التي يمكن تنفيذها في الفصل.",
        image: "https://images.unsplash.com/photo-1551288049-bbbda536339a?q=80&w=800&auto=format&fit=crop",
        link: "https://drive.google.com/file/d/1TenJeNksZvFCjiVLhqeqcziynrSMCasN/view?usp=sharing",
        category: "science"
    },
    {
        title: "Science — Part 3",
        title_ar: "العلوم - الجزء الثالث",
        desc: "Deepening students' understanding of science lessons through interactive visual content.",
        desc_ar: "تعميق فهم الطلاب لدروس العلوم من خلال محتوى مرئي تفاعلي.",
        image: "https://images.unsplash.com/photo-1614850523296-d8c1af93d400?q=80&w=800&auto=format&fit=crop",
        link: "https://drive.google.com/file/d/16-6ISHkIZVl7_8eAlysq9QJVX7yYXQ-U/view?usp=sharing",
        category: "science"
    },
    {
        title: "Science — Part 2",
        title_ar: "العلوم - الجزء الثاني",
        desc: "Educational content simplifying complex scientific concepts visually.",
        desc_ar: "محتوى تعليمي يهدف لتبسيط المفاهيم العلمية المعقدة بأسلوب بصري.",
        image: "https://images.unsplash.com/photo-1639762681485-074b7f938ba0?q=80&w=800&auto=format&fit=crop",
        link: "https://drive.google.com/file/d/167cVIZ_lcZD58L49aj3G_wwo0UFq1A_Q/view?usp=sharing",
        category: "science"
    },
    {
        title: "Science Adventures (Activities & Experiments)",
        title_ar: "مغامرات العلوم (أنشطة وتجارب)",
        desc: "A practical guide encouraging students to engage in scientific inquiry and research.",
        desc_ar: "دليل عملي يهدف لتشجيع الطلاب على البحث والاستقصاء العلمي.",
        image: "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?q=80&w=800&auto=format&fit=crop",
        link: "https://drive.google.com/file/d/18kjnBym5bU7Rd5a1RuOnlFOBxRKkB851/view?usp=sharing",
        category: "science"
    },
    {
        title: "Math Detective Journey",
        title_ar: "رحلة المحقق الرياضي",
        desc: "A presentation simplifying concepts of grouping and area in mathematics.",
        desc_ar: "عرض تقديمي يهدف لتبسيط مفاهيم التجميع والمساحة في الرياضيات.",
        image: "https://images.unsplash.com/photo-1524178232363-1fb2b075b655?q=80&w=800&auto=format&fit=crop",
        link: "https://docs.google.com/presentation/d/1Qi2RMMvFOZ5yYOYDU7ijli82Ggl0g2oJ/edit?usp=sharing",
        category: "math"
    },
    {
        title: "Illustrative Math Tool",
        title_ar: "وسيلة الرياضيات الإيضاحية",
        desc: "A visual tool enhancing geometric and mathematical understanding for students.",
        desc_ar: "أداة بصرية تهدف لتعزيز الفهم الهندسي والرياضي لدى الطلاب.",
        image: "https://images.unsplash.com/photo-1454165833767-1330084b1d3a?q=80&w=800&auto=format&fit=crop",
        link: "https://drive.google.com/file/d/1rWPJFscc9Wz3WS0kKSwopY8t4Zr1nn36/view?usp=sharing",
        category: "math"
    },
    {
        title: "Grade 3 Primary Math",
        title_ar: "رياضيات الصف الثالث الابتدائي",
        desc: "An interactive lesson to learn area calculation and the grouping property smartly.",
        desc_ar: "درس تفاعلي يهدف لتعلم حساب المساحة وخاصية التجميع بذكاء.",
        image: "https://images.unsplash.com/photo-1544391682-1717bf70ce01?q=80&w=800&auto=format&fit=crop",
        link: "https://docs.google.com/presentation/d/13HBsXSM9_UZhYdB0Q_DOups_TMiYzTc_/edit?usp=sharing",
        category: "math"
    },
    {
        title: "Math Essentials",
        title_ar: "أساسيات الرياضيات",
        desc: "An educational tool simplifying basic arithmetic operations.",
        desc_ar: "وسيلة تعليمية تهدف لتبسيط العمليات الحسابية الأساسية.",
        image: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=800&auto=format&fit=crop",
        link: "https://drive.google.com/file/d/12xWq7_V4cxLIvWhJaIRJFE4VFWUJ2BDg/view?usp=sharing",
        category: "math"
    },
    {
        title: "Basic Geometry",
        title_ar: "الهندسة والمساحة",
        desc: "A visual explanation simplifying geometric concepts and area measurement.",
        desc_ar: "شرح مرئي يهدف لتبسيط المفاهيم الهندسية وقياس المساحات.",
        image: "https://images.unsplash.com/photo-1498050108023-c5249f4df085?q=80&w=800&auto=format&fit=crop",
        link: "https://drive.google.com/file/d/1oF2i1ujoPTbP_Uhi2n4csY4bh6CQblcy/view?usp=sharing",
        category: "math"
    }
];

/* ==========================================================================
   Projects: load + render + filter + show-more
   ========================================================================== */
// Normalize old category values to the new lowercase scheme
function normalizeCategory(cat) {
    if (!cat) return 'other';
    const c = String(cat).toLowerCase().trim();
    if (c === 'wordpress' || c === 'wp') return 'wordpress';
    if (c === 'other') return 'other';
    return c;
}

function loadProjects() {
    // Try Firebase; fall back to local data immediately if no DB
    if (!db) {
        allProjectsCache = [...myProjects];
        renderFilters(allProjectsCache);
        renderSlider(allProjectsCache);
        renderProjects(allProjectsCache, 'all');
        return;
    }
    try {
        db.collection("projects").orderBy("createdAt", "desc").onSnapshot((snapshot) => {
            const firebaseProjects = [];
            snapshot.forEach(doc => {
                const data = doc.data();
                firebaseProjects.push({ id: doc.id, ...data, category: normalizeCategory(data.category) });
            });
            const otherFirebaseProjects = firebaseProjects.filter(fp =>
                !myProjects.some(mp => mp.link === fp.link || mp.title === fp.title)
            );
            allProjectsCache = [...myProjects, ...otherFirebaseProjects];
            renderFilters(allProjectsCache);
            renderSlider(allProjectsCache);
            renderProjects(allProjectsCache, currentFilter);
        }, (err) => {
            console.warn("Firebase error, using local data:", err);
            allProjectsCache = [...myProjects];
            renderFilters(allProjectsCache);
            renderSlider(allProjectsCache);
            renderProjects(allProjectsCache, 'all');
        });
    } catch (e) {
        console.warn("Firebase exception, using local data:", e);
        allProjectsCache = [...myProjects];
        renderFilters(allProjectsCache);
        renderSlider(allProjectsCache);
        renderProjects(allProjectsCache, 'all');
    }
}

function getProjTitle(p) { return currentLang === 'ar' ? (p.title_ar || p.title) : p.title; }
function getProjDesc(p) { return currentLang === 'ar' ? (p.desc_ar || p.desc) : p.desc; }

function getProjCategoryLabel(cat) {
    const keyMap = {
        wordpress: 'cat_wordpress',
        english: 'cat_english',
        arabic: 'cat_arabic',
        science: 'cat_science',
        math: 'cat_math',
        social: 'cat_social',
        islamic: 'cat_islamic',
        health: 'cat_health'
    };
    const key = keyMap[cat] || 'cat_creative';
    return translations[currentLang][key] || cat;
}

function isVideoProject(p) {
    return (p.link && (p.link.includes('canva.link') || p.link.includes('.mp4') || p.link === '#')) ||
           (p.title && p.title.toLowerCase().includes('video'));
}

function renderProjects(projects, filter = 'all') {
    const container = document.getElementById('projectsContainer');
    if (!container) return;

    const filtered = filter === 'all' ? projects : projects.filter(p => p.category === filter);

    if (filtered.length === 0) {
        container.innerHTML = `<p class="text-center w-full" style="grid-column: 1/-1; padding: 2rem;">${translations[currentLang].no_projects}</p>`;
        const showMoreBtn = document.getElementById('showMoreBtn');
        if (showMoreBtn) showMoreBtn.classList.remove('visible');
        return;
    }

    // Determine initial visible count based on screen size
    const isMobile = window.matchMedia('(max-width: 768px)').matches;
    const initialCount = isMobile ? MOBILE_INITIAL_COUNT : DESKTOP_INITIAL_COUNT;
    visibleCount = initialCount;

    container.innerHTML = '';
    filtered.forEach((proj, idx) => {
        const typeIcon = isVideoProject(proj) ? '🎬' : '🌐';
        const div = document.createElement('div');
        div.className = `project-card glass ${proj.category}`;
        if (idx >= visibleCount) div.classList.add('hidden-card');
        div.innerHTML = `
            <a href="${proj.link}" target="_blank" rel="noopener" class="project-card-link">
                <div class="project-img-container">
                    <img src="${proj.image}" alt="${getProjTitle(proj)}" class="project-img" loading="lazy" onerror="this.src='https://images.unsplash.com/photo-1547658719-da2b51169166?q=80&w=600&auto=format&fit=crop'">
                    <div class="project-overlay">
                        <span class="btn btn-primary">${translations[currentLang].preview_project}</span>
                    </div>
                    <div class="project-type-badge">${typeIcon}</div>
                </div>
                <div class="project-info">
                    <span class="project-category">${getProjCategoryLabel(proj.category)}</span>
                    <h3>${getProjTitle(proj)}</h3>
                    <p>${getProjDesc(proj)}</p>
                </div>
            </a>`;
        container.appendChild(div);
    });

    // Show / hide "Show More" button
    const showMoreBtn = document.getElementById('showMoreBtn');
    if (showMoreBtn) {
        if (isMobile && filtered.length > MOBILE_INITIAL_COUNT) {
            showMoreBtn.classList.add('visible');
            showMoreBtn.classList.remove('expanded');
            showMoreBtn.textContent = translations[currentLang].show_more;
        } else {
            showMoreBtn.classList.remove('visible');
            showMoreBtn.classList.remove('expanded');
        }
    }
}

function renderFilters(projects) {
    const filterContainer = document.getElementById('projectFilters');
    if (!filterContainer) return;

    // Build dynamic filters based on actual categories present
    const presentCats = new Set(projects.map(p => p.category));
    const catOrder = ['wordpress','english','arabic','science','math','social','islamic','health','other'];
    const labelKeyMap = {
        all: 'filter_all',
        wordpress: 'filter_wordpress',
        english: 'filter_english',
        arabic: 'filter_arabic',
        science: 'filter_science',
        math: 'filter_math',
        social: 'filter_social',
        islamic: 'filter_islamic',
        health: 'filter_health',
        other: 'filter_other'
    };
    const filters = ['all', ...catOrder.filter(c => presentCats.has(c))];

    filterContainer.innerHTML = '';
    filters.forEach(cat => {
        const btn = document.createElement('button');
        btn.className = 'filter-btn' + (cat === 'all' ? ' active' : '');
        btn.setAttribute('data-filter', cat);
        btn.setAttribute('data-i18n', labelKeyMap[cat]);
        btn.textContent = translations[currentLang][labelKeyMap[cat]] || cat;
        btn.addEventListener('click', () => {
            document.querySelectorAll('.filter-btn').forEach(f => f.classList.remove('active'));
            btn.classList.add('active');
            currentFilter = cat;
            renderProjects(allProjectsCache, cat);
            playSound('click');
        });
        filterContainer.appendChild(btn);
    });
}

function setupShowMore() {
    const showMoreBtn = document.getElementById('showMoreBtn');
    if (!showMoreBtn) return;
    showMoreBtn.addEventListener('click', () => {
        const cards = document.querySelectorAll('#projectsContainer .project-card');
        const isMobile = window.matchMedia('(max-width: 768px)').matches;
        if (!isMobile) return;

        const isExpanded = showMoreBtn.classList.contains('expanded');
        if (isExpanded) {
            // Collapse back to initial count
            cards.forEach((c, i) => {
                if (i >= MOBILE_INITIAL_COUNT) c.classList.add('hidden-card');
            });
            showMoreBtn.classList.remove('expanded');
            showMoreBtn.textContent = translations[currentLang].show_more;
        } else {
            // Expand all
            cards.forEach(c => c.classList.remove('hidden-card'));
            showMoreBtn.classList.add('expanded');
            showMoreBtn.textContent = translations[currentLang].show_less;
        }
        playSound('click');
    });

    // Re-render projects when viewport crosses the mobile/desktop boundary
    let wasMobile = window.matchMedia('(max-width: 768px)').matches;
    let resizeTimer = null;
    window.addEventListener('resize', () => {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(() => {
            const isMobile = window.matchMedia('(max-width: 768px)').matches;
            if (isMobile !== wasMobile) {
                wasMobile = isMobile;
                if (allProjectsCache.length) {
                    renderProjects(allProjectsCache, currentFilter);
                }
            }
        }, 250);
    });
}

/* ==========================================================================
   Projects Slider / Carousel
   ========================================================================== */
let sliderIndex = 0;
let sliderAutoplay = null;
let sliderCardsPerView = 3;

function getSliderCardsPerView() {
    const w = window.innerWidth;
    if (w <= 768) return 1;
    if (w <= 992) return 2;
    return 3;
}

function renderSlider(projects) {
    const track = document.getElementById('sliderTrack');
    const dotsContainer = document.getElementById('sliderDots');
    if (!track) return;

    // Pick top 8 projects for slider (mix categories)
    const featured = projects.slice(0, Math.min(8, projects.length));

    track.innerHTML = '';
    featured.forEach((proj, idx) => {
        const card = document.createElement('div');
        card.className = 'slider-card';
        card.innerHTML = `
            <a href="${proj.link}" target="_blank" rel="noopener" style="display:block; width:100%; height:100%; position:relative;">
                <img src="${proj.image}" alt="${getProjTitle(proj)}" loading="lazy" onerror="this.src='https://images.unsplash.com/photo-1547658719-da2b51169166?q=80&w=800&auto=format&fit=crop'">
                <div class="slider-card-tag">${getProjCategoryLabel(proj.category)}</div>
                <div class="slider-card-overlay">
                    <h3>${getProjTitle(proj)}</h3>
                    <p>${getProjDesc(proj)}</p>
                </div>
            </a>`;
        track.appendChild(card);
    });

    sliderCardsPerView = getSliderCardsPerView();
    sliderIndex = 0;
    buildDots(featured);
    updateSliderPosition();
    startAutoplay();
}

function buildDots(projects) {
    const dotsContainer = document.getElementById('sliderDots');
    if (!dotsContainer) return;
    const totalSlides = Math.max(1, projects.length - sliderCardsPerView + 1);
    dotsContainer.innerHTML = '';
    for (let i = 0; i < totalSlides; i++) {
        const dot = document.createElement('button');
        dot.className = 'slider-dot' + (i === 0 ? ' active' : '');
        dot.setAttribute('aria-label', `Go to slide ${i + 1}`);
        dot.addEventListener('click', () => {
            sliderIndex = i;
            updateSliderPosition();
            restartAutoplay();
            playSound('click');
        });
        dotsContainer.appendChild(dot);
    }
}

function updateSliderPosition() {
    const track = document.getElementById('sliderTrack');
    if (!track) return;
    const cards = track.children;
    if (!cards.length) return;
    const cardWidth = cards[0].getBoundingClientRect().width;
    const gap = 24; // matches CSS gap of 1.5rem
    const offset = sliderIndex * (cardWidth + gap);
    track.style.transform = `translateX(-${offset}px)`;

    // Update dots
    const dots = document.querySelectorAll('.slider-dot');
    dots.forEach((d, i) => d.classList.toggle('active', i === sliderIndex));
}

function nextSlider() {
    const track = document.getElementById('sliderTrack');
    if (!track) return;
    const totalCards = track.children.length;
    const maxIndex = Math.max(0, totalCards - sliderCardsPerView);
    sliderIndex = (sliderIndex + 1) > maxIndex ? 0 : sliderIndex + 1;
    updateSliderPosition();
}
function prevSlider() {
    const track = document.getElementById('sliderTrack');
    if (!track) return;
    const totalCards = track.children.length;
    const maxIndex = Math.max(0, totalCards - sliderCardsPerView);
    sliderIndex = (sliderIndex - 1) < 0 ? maxIndex : sliderIndex - 1;
    updateSliderPosition();
}
function startAutoplay() {
    stopAutoplay();
    sliderAutoplay = setInterval(nextSlider, 5000);
}
function stopAutoplay() {
    if (sliderAutoplay) { clearInterval(sliderAutoplay); sliderAutoplay = null; }
}
function restartAutoplay() {
    stopAutoplay();
    startAutoplay();
}

function setupSliderControls() {
    const prev = document.getElementById('sliderPrev');
    const next = document.getElementById('sliderNext');
    const wrapper = document.getElementById('projectsSlider');
    if (prev) prev.addEventListener('click', () => { prevSlider(); restartAutoplay(); playSound('click'); });
    if (next) next.addEventListener('click', () => { nextSlider(); restartAutoplay(); playSound('click'); });
    if (wrapper) {
        wrapper.addEventListener('mouseenter', stopAutoplay);
        wrapper.addEventListener('mouseleave', startAutoplay);

        // Touch swipe support
        let touchStartX = 0;
        wrapper.addEventListener('touchstart', (e) => { touchStartX = e.touches[0].clientX; }, { passive: true });
        wrapper.addEventListener('touchend', (e) => {
            const dx = e.changedTouches[0].clientX - touchStartX;
            if (Math.abs(dx) > 50) {
                if (dx < 0) nextSlider(); else prevSlider();
                restartAutoplay();
            }
        }, { passive: true });
    }
    // Recompute on resize
    window.addEventListener('resize', () => {
        sliderCardsPerView = getSliderCardsPerView();
        sliderIndex = 0;
        updateSliderPosition();
        if (allProjectsCache.length) buildDots(allProjectsCache.slice(0, Math.min(8, allProjectsCache.length)));
    });
}

/* ==========================================================================
   Reviews / Testimonials
   ========================================================================== */
function loadReviews() {
    const container = document.getElementById('testimonialsContainer');
    if (!container) return;
    if (!db) { container.innerHTML = `<p>${translations[currentLang].no_reviews}</p>`; return; }
    try {
        db.collection("reviews").orderBy("createdAt", "desc").onSnapshot((snapshot) => {
            const reviews = [];
            snapshot.forEach(doc => reviews.push(doc.data()));
            container.innerHTML = reviews.length === 0 ? `<p>${translations[currentLang].no_reviews}</p>` : '';
            reviews.forEach(review => {
                const div = document.createElement('div');
                div.className = 'testimonial-card glass';
                const stars = '★'.repeat(review.rating) + '☆'.repeat(5 - review.rating);
                div.innerHTML = `<div class="stars">${stars}</div><p style="font-style:italic; flex-grow:1;">"${review.text}"</p><p style="font-weight:bold; color: var(--clr-text-main);">- ${review.name}</p>`;
                container.appendChild(div);
            });
        }, (err) => {
            container.innerHTML = `<p>${translations[currentLang].no_reviews}</p>`;
        });
    } catch (e) {
        container.innerHTML = `<p>${translations[currentLang].no_reviews}</p>`;
    }
}

/* ==========================================================================
   Forms
   ========================================================================== */
function setupForms() {
    // Review form
    const reviewForm = document.getElementById('reviewForm');
    const starRating = document.getElementById('starRating');
    const ratingValue = document.getElementById('ratingValue');
    if (starRating && ratingValue) {
        const stars = starRating.querySelectorAll('span');
        let currentRating = 0;
        stars.forEach(star => {
            star.addEventListener('mouseenter', () => {
                const val = parseInt(star.getAttribute('data-value'));
                stars.forEach((s, i) => s.classList.toggle('active', i < val));
            });
            star.addEventListener('mouseleave', () => {
                stars.forEach((s, i) => s.classList.toggle('active', i < currentRating));
            });
            star.addEventListener('click', () => {
                currentRating = parseInt(star.getAttribute('data-value'));
                ratingValue.value = currentRating;
                stars.forEach((s, i) => s.classList.toggle('active', i < currentRating));
                playSound('click');
            });
        });
    }
    if (reviewForm) {
        reviewForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const name = document.getElementById('reviewerName').value.trim();
            const text = document.getElementById('reviewText').value.trim();
            const rating = parseInt(ratingValue.value);
            if (!name || !text || !rating) return;
            if (db) {
                db.collection("reviews").add({
                    name, text, rating,
                    createdAt: firebase.firestore.Timestamp.now()
                }).catch(err => console.warn(err));
            }
            reviewForm.reset();
            document.querySelectorAll('#starRating span').forEach(s => s.classList.remove('active'));
            ratingValue.value = '';
            alert(translations[currentLang].review_thanks);
            playSound('send');
        });
    }

    // Contact form
    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const name = document.getElementById('contactName').value.trim();
            const email = document.getElementById('contactEmail').value.trim();
            const message = document.getElementById('contactMessage').value.trim();
            if (!name || !email || !message) return;
            if (db) {
                db.collection("messages").add({
                    name, email, message,
                    createdAt: firebase.firestore.Timestamp.now()
                }).catch(err => console.warn(err));
            }
            contactForm.reset();
            alert(translations[currentLang].contact_success);
            playSound('send');
        });
    }
}

/* ==========================================================================
   Chatbot
   ========================================================================== */
function setupChatbot() {
    const chatToggleBtn = document.getElementById('chatToggleBtn');
    const chatCloseBtn = document.getElementById('chatCloseBtn');
    const chatInterface = document.getElementById('chatInterface');
    const chatInput = document.getElementById('chatInput');
    const chatSendBtn = document.getElementById('chatSendBtn');
    const chatBody = document.getElementById('chatBody');
    const quickReplies = document.querySelectorAll('.chat-chip');

    if (!chatInterface || !chatToggleBtn) return;

    const toggleChat = () => {
        const isVisible = chatInterface.style.display === 'flex';
        chatInterface.style.display = isVisible ? 'none' : 'flex';
        if (!isVisible && chatBody.children.length === 0) {
            sendBotMessage(translations[currentLang].chat_welcome);
        }
        playSound(isVisible ? 'click' : 'open');
    };

    chatToggleBtn.addEventListener('click', toggleChat);
    chatCloseBtn?.addEventListener('click', () => { chatInterface.style.display = 'none'; playSound('click'); });

    // Welcome after 3s (only if user hasn't opened)
    setTimeout(() => {
        if (chatInterface.style.display !== 'flex' && chatBody.children.length === 0) {
            sendBotMessage(translations[currentLang].chat_welcome);
        }
    }, 3000);

    const handleSend = () => {
        const text = chatInput.value.trim();
        if (!text) return;
        appendMessage('user', text);
        chatInput.value = '';
        processAIResponse(text);
        playSound('send');
    };

    chatSendBtn?.addEventListener('click', handleSend);
    chatInput?.addEventListener('keypress', (e) => { if (e.key === 'Enter') handleSend(); });

    quickReplies.forEach(chip => {
        chip.addEventListener('click', () => {
            const msg = chip.textContent;
            appendMessage('user', msg);
            processAIResponse(chip.getAttribute('data-msg'));
            playSound('send');
        });
    });
}

function appendMessage(role, text) {
    const chatBody = document.getElementById('chatBody');
    if (!chatBody) return;
    const div = document.createElement('div');
    div.className = `chat-message ${role}`;
    div.innerHTML = text;
    chatBody.appendChild(div);
    chatBody.scrollTop = chatBody.scrollHeight;
}

function sendBotMessage(text) {
    setTimeout(() => appendMessage('bot', text), 600);
}

function processAIResponse(input) {
    const lowerInput = (input || '').toLowerCase();
    let response = "";

    if (currentLang === 'ar') {
        if (lowerInput.includes('pricing') || lowerInput.includes('سعر') || lowerInput.includes('تكلفة') || lowerInput.includes('كم')) {
            response = "فاطمة تقدم باقات متنوعة تناسب احتياجاتك. هل تبحث عن متجر إلكتروني أم موقع تعريفي لخدماتك؟";
        } else if (lowerInput.includes('services') || lowerInput.includes('خدمات')) {
            response = "فاطمة متخصصة في تصميم مواقع الووردبريس، تحسين السرعة (SEO)، وإنشاء المتاجر الإلكترونية الاحترافية.";
        } else if (lowerInput.includes('contact') || lowerInput.includes('تواصل') || lowerInput.includes('توظيف') || lowerInput.includes('email') || lowerInput.includes('ايميل')) {
            response = "يمكنك مراسلة فاطمة مباشرة عبر البريد الإلكتروني: fatmaana4444@gmail.com أو ملء نموذج التواصل أسفله!";
        } else {
            response = "أنا هنا للمساعدة! هل تود معرفة المزيد عن أعمال فاطمة السابقة في الووردبريس؟";
        }
    } else {
        if (lowerInput.includes('pricing') || lowerInput.includes('cost') || lowerInput.includes('price') || lowerInput.includes('how much')) {
            response = "Fatma offers competitive pricing models. Are you looking for a simple portfolio or a full WooCommerce store?";
        } else if (lowerInput.includes('services') || lowerInput.includes('what do you do')) {
            response = "Fatma specializes in Custom WordPress Design, Speed Optimization, and E-commerce scaling.";
        } else if (lowerInput.includes('contact') || lowerInput.includes('hire') || lowerInput.includes('email')) {
            response = "You can reach Fatma at fatmaana4444@gmail.com. She usually responds within a few hours!";
        } else {
            response = "That sounds interesting! Fatma has helped many businesses grow with WordPress. Would you like to see her process?";
        }
    }
    sendBotMessage(response);
}

/* ==========================================================================
   Intersection Observers + active nav link
   ========================================================================== */
function setupIntersectionObservers() {
    const fadeElements = document.querySelectorAll('.fade-up, .fade-in, .scale-in');
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) entry.target.classList.add('visible');
        });
    }, { threshold: 0.1 });
    fadeElements.forEach(el => observer.observe(el));

    // Active nav link based on visible section
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-links a');
    const navObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const id = entry.target.id;
                navLinks.forEach(a => {
                    a.classList.toggle('active', a.getAttribute('href') === '#' + id);
                });
            }
        });
    }, { threshold: 0.4 });
    sections.forEach(s => navObserver.observe(s));
}

/* ==========================================================================
   Active section highlight on click
   ========================================================================== */
function setupSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                e.preventDefault();
                target.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        });
    });
}

/* ==========================================================================
   Init
   ========================================================================== */
function hidePreloader() {
    if (preloader) {
        preloader.classList.add('hidden');
        setTimeout(() => { if (preloader) preloader.style.display = 'none'; }, 700);
    }
}

function init() {
    // Apply theme + language first
    setTheme(currentTheme);
    setLanguage(currentLang);

    // Year
    const yearEl = document.getElementById('year');
    if (yearEl) yearEl.textContent = new Date().getFullYear();

    // Setup
    loadProjects();
    loadReviews();
    setupIntersectionObservers();
    setupChatbot();
    setupForms();
    setupShowMore();
    setupSliderControls();
    setupSmoothScroll();

    // Animate counters once hero is visible
    setTimeout(() => {
        document.querySelectorAll('.stat-num').forEach(el => {
            const target = parseInt(el.getAttribute('data-count'));
            if (!isNaN(target)) animateCounter(el, target);
        });
    }, 600);

    // Hide preloader once everything is ready
    setTimeout(hidePreloader, 400);

    // Initial scroll state
    onScroll();
}

document.addEventListener('DOMContentLoaded', init);
