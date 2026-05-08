/* ==========================================================================
   Firebase Configuration (Fatma's Real Keys)
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

// Initialize Firebase
const app = firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();

/* ==========================================================================
   State Management
   ========================================================================== */
let currentLang = localStorage.getItem('site_lang') || 'en';
let currentTheme = localStorage.getItem('site_theme') || 'dark';

const htmlElement = document.documentElement;
const langToggleBtn = document.getElementById('langToggle');
const themeToggleBtn = document.getElementById('themeToggle');
const sunIcon = document.querySelector('.sun-icon');
const moonIcon = document.querySelector('.moon-icon');

function init() {
    document.getElementById('year').textContent = new Date().getFullYear();
    setLanguage(currentLang);
    setTheme(currentTheme);
    loadProjects();
    loadReviews();
    setupIntersectionObservers();
    setupChatbot();
}

/* ==========================================================================
   Translations
   ========================================================================== */
const translations = {
    en: {
        nav_home: "Home", nav_about: "About", nav_services: "Services", nav_projects: "Projects", nav_testimonials: "Reviews", nav_contact: "Contact",
        hero_pill: "WordPress Developer | Digital Marketing Specialist",
        hero_title: "Building Beautiful <span>WordPress Websites</span> That Attract, Engage, and Convert",
        hero_subtitle: "I create modern, fast, and user-friendly WordPress websites designed to help your business grow and stand out in the digital world.",
        hero_cta1: "View My Work", hero_cta2: "Start Your Project",
        about_heading: "About Me", about_text: "I am a passionate WordPress developer with a strong background in digital marketing and content creation.",
        services_heading: "My Services", projects_heading: "Featured Projects", projects_subtitle: "A showcase of my recent WordPress websites and creative design work.", testimonials_heading: "What Clients Say", contact_heading: "Let’s Build Something Amazing Together",
        filter_all: "All", filter_wp: "WordPress Websites", filter_other: "Other Projects",
        chat_status: "Online", chat_ph: "Type a message...", chat_q1: "Pricing & Value", chat_q2: "Your Services", chat_q3: "Hire Fatma"
    },
    ar: {
        nav_home: "الرئيسية", nav_about: "نبذة عني", nav_services: "خدماتي", nav_projects: "مشاريعي", nav_testimonials: "الآراء", nav_contact: "تواصل معي",
        hero_pill: "مطور ووردبريس | أخصائي تسويق رقمي",
        hero_title: "بناء <span>مواقع ووردبريس</span> جذابة وتفاعلية تحول الزوار إلى عملاء",
        hero_subtitle: "أقوم بإنشاء مواقع ووردبريس حديثة وسريعة وسهلة الاستخدام مصممة لمساعدة عملك على النمو والتميز في العالم الرقمي.",
        hero_cta1: "شاهد أعمالي", hero_cta2: "ابدأ مشروعك",
        about_heading: "نبذة عني", about_text: "أنا مطور ووردبريس شغوف بخلفية قوية في التسويق الرقمي وإنشاء المحتوى.",
        services_heading: "خدماتي", projects_heading: "أبرز المشاريع", projects_subtitle: "عرض لأحدث المواقع التي قمت ببنائها باستخدام ووردبريس بالإضافة إلى مشاريعي الإبداعية الأخرى.", testimonials_heading: "ماذا يقول العملاء", contact_heading: "لنقم ببناء شيء مذهل معاً",
        filter_all: "الكل", filter_wp: "مواقع ووردبريس", filter_other: "مشاريع أخرى",
        chat_status: "نشط الآن", chat_ph: "اكتب رسالة...", chat_q1: "الأسعار والقيمة", chat_q2: "خدمات فاطمة", chat_q3: "توظيف فاطمة"
    }
};

/* ==========================================================================
   Theme & Language Functions
   ========================================================================== */
function setTheme(theme) {
    htmlElement.setAttribute('data-theme', theme);
    localStorage.setItem('site_theme', theme);
    sunIcon.style.display = theme === 'dark' ? 'block' : 'none';
    moonIcon.style.display = theme === 'dark' ? 'none' : 'block';
}
themeToggleBtn.addEventListener('click', () => setTheme(currentTheme === 'dark' ? 'light' : 'dark'));

function setLanguage(lang) {
    localStorage.setItem('site_lang', lang);
    htmlElement.setAttribute('lang', lang);
    htmlElement.setAttribute('dir', lang === 'ar' ? 'rtl' : 'ltr');
    document.querySelectorAll('[data-i18n]').forEach(el => {
        const key = el.getAttribute('data-i18n');
        if (translations[lang][key]) el.innerHTML = translations[lang][key];
    });
    document.querySelectorAll('[data-i18n-ph]').forEach(el => {
        const key = el.getAttribute('data-i18n-ph');
        if (translations[lang][key]) el.setAttribute('placeholder', translations[lang][key]);
    });
}
langToggleBtn.addEventListener('click', () => { currentLang = currentLang === 'en' ? 'ar' : 'en'; setLanguage(currentLang); });

/* ==========================================================================
   Projects Management (Firebase Firestore)
   ========================================================================== */
function loadProjects() {
    // Definitive projects list with updated titles and goals
    const myProjects = [
        { 
            title: "رحلة عبر الزمن مع علماء المسلمين", 
            desc: "منصة تعليمية تهدف لتعريف الطلاب بإسهامات علماء المسلمين عبر التاريخ بأسلوب تفاعلي.", 
            image: "assets/img/smart_scientists_ui_1778252949835.png", 
            link: "https://sites.google.com/view/smart-scientists-2026/%D8%A7%D9%84%D8%B5%D9%81%D8%AD%D8%A9-%D8%A7%D9%84%D8%B1%D8%A6%D9%8A%D8%B3%D9%8A%D8%A9", 
            category: "WordPress" 
        },
        { 
            title: "رحلة الأبطال في عالم الجمال والآداب", 
            desc: "مشروع تعليمي قيمي يهدف لغرس الآداب الجميلة والقيم الأخلاقية في نفوس الناشئة.", 
            image: "assets/img/journey_heroes_ui_1778253140090.png", 
            link: "https://sites.google.com/view/journey-of-heroes-in-the-world/%D8%A7%D9%84%D8%B1%D8%A6%D9%8A%D8%B3%D9%8A%D8%A9-%D8%A7%D9%86%D8%B7%D9%84%D8%A7%D9%82-%D8%A7%D9%84%D8%B1%D8%AD%D9%84%D8%A9", 
            category: "WordPress" 
        },
        { 
            title: "أكاديمية بطل الصحة (مغامرة الحياة الصحية)", 
            desc: "منصة تهدف لتعليم الأطفال العادات الصحية السليمة والتغذية المفيدة من خلال مغامرات ممتعة.", 
            image: "assets/img/health_hero_ui_1778253153287.png", 
            link: "https://sites.google.com/view/health-hero-academy-/home-page-start-here", 
            category: "WordPress" 
        },
        { 
            title: "بطل العلوم: رحلة في عالم المادة", 
            desc: "تبسيط مفاهيم العلوم والفيزياء للمستكشف الصغير بأسلوب مشوق وتجريبي.", 
            image: "assets/img/science_hero_ui_1778253379691.png", 
            link: "https://sites.google.com/view/science-hero-2026/%D8%A7%D9%84%D8%B5%D9%81%D8%AD%D8%A9-%D8%A7%D9%84%D8%B1%D8%A6%D9%8A%D8%B3%D9%8A%D8%A9", 
            category: "WordPress" 
        },
        { 
            title: "سلسلة تعلم الإنجليزية الممتعة", 
            desc: "فيديو تعليمي يهدف لتبسيط قواعد ومفردات اللغة الإنجليزية للمبتدئين.", 
            image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=800&auto=format&fit=crop", 
            link: "https://drive.google.com/file/d/1bf2efrCZKlenyns5MbQY-QZIOX7wz7GL/view?usp=sharing", 
            category: "Other" 
        },
        { 
            title: "تعلم الإنجليزية - الجزء الرابع", 
            desc: "استكمال لسلسلة دروس اللغة الإنجليزية التفاعلية لتعزيز مهارات الاستماع والنطق.", 
            image: "https://images.unsplash.com/photo-1552664730-d307ca884978?q=80&w=800&auto=format&fit=crop", 
            link: "https://drive.google.com/file/d/14XB4cpFs-gkePKS_YanoB4wMX-3OMh-j/view?usp=sharing", 
            category: "Other" 
        },
        { 
            title: "تعلم الإنجليزية - الجزء الثالث", 
            desc: "درس متقدم في مهارات المحادثة واللغة الإنجليزية اليومية.", 
            image: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=800&auto=format&fit=crop", 
            link: "https://drive.google.com/file/d/1xqBJJD_trhGlycUAHcOUfhdR4hocOaaQ/view?usp=sharing", 
            category: "Other" 
        },
        { 
            title: "تعلم الإنجليزية - الجزء الثاني", 
            desc: "تأسيس قوي في قواعد اللغة الإنجليزية الأساسية بأسلوب مبسط.", 
            image: "https://images.unsplash.com/photo-1507679799987-c73774586594?q=80&w=800&auto=format&fit=crop", 
            link: "https://drive.google.com/file/d/1MA_eLqWRYjchUT8-F4Wkvjtdz_PQCcjv/view?usp=sharing", 
            category: "Other" 
        },
        { 
            title: "مغامرات معسكر أبطال الصحة", 
            desc: "فيديو حركي يهدف لتعزيز النشاط البدني والحيوية لدى الأطفال.", 
            image: "https://images.unsplash.com/photo-1485827404703-89b55fcc595e?q=80&w=800&auto=format&fit=crop", 
            link: "https://drive.google.com/file/d/13L93OX0y-YlrzBbAs877Upe_o_dRP7U0/view?usp=sharing", 
            category: "Other" 
        },
        { 
            title: "دليل الحياة الصحية (English Guide)", 
            desc: "ملف تعليمي يربط بين تعلم اللغة الإنجليزية والمفاهيم الصحية الأساسية.", 
            image: "https://images.unsplash.com/photo-1541462608141-ad4d157ed7f4?q=80&w=800&auto=format&fit=crop", 
            link: "https://drive.google.com/file/d/19DaMioNm2g6LBheM6LraIt-fl6fRprvr/view?usp=sharing", 
            category: "Other" 
        },
        { 
            title: "عالم الدراسات الاجتماعية", 
            desc: "فيديو تعليمي يهدف لتعريف الطلاب بالتاريخ والجغرافيا بأسلوب قصصي.", 
            image: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?q=80&w=800&auto=format&fit=crop", 
            link: "https://drive.google.com/file/d/1t5MHmL4pstdSdltSp-0rzeE5N88brjxJ/view?usp=sharing", 
            category: "Other" 
        },
        { 
            title: "الدراسات الاجتماعية - الجزء الثالث", 
            desc: "رحلة معرفية في تاريخ وحضارات العالم من خلال فيديو تعليمي مشوق.", 
            image: "https://images.unsplash.com/photo-1586717791821-3f44a563eb4c?q=80&w=800&auto=format&fit=crop", 
            link: "https://drive.google.com/file/d/1U3bWtzUEDqjMQs3RqK7K5bn-4vIXFNem/view?usp=sharing", 
            category: "Other" 
        },
        { 
            title: "الدراسات الاجتماعية - الجزء الثاني", 
            desc: "تعزيز القيم الوطنية والوعي الجغرافي لدى الطلاب بأسلوب مرئي.", 
            image: "https://images.unsplash.com/photo-1434626881859-194d67b2b86f?q=80&w=800&auto=format&fit=crop", 
            link: "https://drive.google.com/file/d/16cTCTfofl1cgnRCcJwg_m1oGRkcOgj-f/view?usp=sharing", 
            category: "Other" 
        },
        { 
            title: "آدابنا الجميلة (النمط السعودي)", 
            desc: "فيديو يهدف لتعزيز الهوية الوطنية والآداب الاجتماعية السائدة في المملكة.", 
            image: "https://images.unsplash.com/photo-1519389950473-47ba0277781c?q=80&w=800&auto=format&fit=crop", 
            link: "https://drive.google.com/file/d/11KGDjBBigrb6oE4q75TCKqC4ss3SUWBG/view?usp=sharing", 
            category: "Other" 
        },
        { 
            title: "مغامرات الدراسات الإسلامية", 
            desc: "ملف تفاعلي يهدف لغرس القيم والأخلاق الإسلامية من خلال قصص وأنشطة.", 
            image: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=800&auto=format&fit=crop", 
            link: "https://drive.google.com/file/d/1Y-nad8dno_w64_--ZGjLfgcx-CT-Hrdn/view?usp=sharing", 
            category: "Other" 
        },
        { 
            title: "روائع اللغة العربية", 
            desc: "فيديو تعليمي يهدف لتبسيط قواعد اللغة العربية وحب القراءة.", 
            image: "https://images.unsplash.com/photo-1558494949-ef010cbdcc4b?q=80&w=800&auto=format&fit=crop", 
            link: "https://drive.google.com/file/d/1sCX3SrvIkyzML_1Wo9qFxgEDo1Lh-iFB/view?usp=sharing", 
            category: "Other" 
        },
        { 
            title: "اللغة العربية - مراجعة وتعزيز", 
            desc: "فيديو يركز على مهارات الكتابة والإملاء بأسلوب تفاعلي.", 
            image: "https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?q=80&w=800&auto=format&fit=crop", 
            link: "https://drive.google.com/file/d/1328QaGOXBmVOzpi245s262O7cD1kTF6Y/view?usp=sharing", 
            category: "Other" 
        },
        { 
            title: "اللغة العربية - المستوى الثاني", 
            desc: "تطوير مهارات التعبير والفهم القرائي من خلال محتوى مرئي غني.", 
            image: "https://images.unsplash.com/photo-1551288049-bbbda536339a?q=80&w=800&auto=format&fit=crop", 
            link: "https://drive.google.com/file/d/19NGxAlHVpMshAkQ8-ZHD9GYoEsnXQAbk/view?usp=sharing", 
            category: "Other" 
        },
        { 
            title: "بوابة علماء المسلمين الاستكشافية", 
            desc: "جولة مرئية تهدف لإبراز عبقرية العلماء العرب والمسلمين واختراعاتهم.", 
            image: "https://images.unsplash.com/photo-1531403009284-440f080d1e12?q=80&w=800&auto=format&fit=crop", 
            link: "https://drive.google.com/file/d/14sDe7FHIAk0NSvCPVkLu9NlwEO6oEVpA/view?usp=sharing", 
            category: "Other" 
        },
        { 
            title: "جابر بن حيان والورق السحري", 
            desc: "قصة علمية مصورة تهدف لتعريف الأطفال بإنجازات الكيميائي جابر بن حيان.", 
            image: "https://images.unsplash.com/photo-1454165833767-1330084b1d3a?q=80&w=800&auto=format&fit=crop", 
            link: "https://drive.google.com/file/d/1Acw5fgDkzbeCkr636dj2yQFz0B2fFGm4/view?usp=sharing", 
            category: "Other" 
        },
        { 
            title: "مغامرات العلماء العرب", 
            desc: "ملف شامل يهدف لتوثيق تاريخ العلوم العربية وإلهام الجيل القادم.", 
            image: "https://images.unsplash.com/photo-1518770660439-4636190af475?q=80&w=800&auto=format&fit=crop", 
            link: "https://drive.google.com/file/d/1uiiD6_cfvYOB-2-aIv0W0WUHwrUY24PE/view?usp=sharing", 
            category: "Other" 
        },
        { 
            title: "رحلة في عالم العلوم", 
            desc: "فيديو تعليمي يهدف لاستكشاف ظواهر الطبيعة من حولنا بأسلوب علمي.", 
            image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=800&auto=format&fit=crop", 
            link: "https://drive.google.com/file/d/1OmYYSheXme3GecSbjP7XRFwXks6o0cNL/view?usp=sharing", 
            category: "Other" 
        },
        { 
            title: "مختبر العلوم التفاعلي", 
            desc: "فيديو يركز على التجارب العلمية البسيطة التي يمكن تنفيذها في الفصل.", 
            image: "https://images.unsplash.com/photo-1551288049-bbbda536339a?q=80&w=800&auto=format&fit=crop", 
            link: "https://drive.google.com/file/d/1TenJeNksZvFCjiVLhqeqcziynrSMCasN/view?usp=sharing", 
            category: "Other" 
        },
        { 
            title: "العلوم - الجزء الثالث", 
            desc: "تعميق فهم الطلاب لدروس العلوم من خلال محتوى مرئي تفاعلي.", 
            image: "https://images.unsplash.com/photo-1614850523296-d8c1af93d400?q=80&w=800&auto=format&fit=crop", 
            link: "https://drive.google.com/file/d/16-6ISHkIZVl7_8eAlysq9QJVX7yYXQ-U/view?usp=sharing", 
            category: "Other" 
        },
        { 
            title: "العلوم - الجزء الثاني", 
            desc: "محتوى تعليمي يهدف لتبسيط المفاهيم العلمية المعقدة بأسلوب بصري.", 
            image: "https://images.unsplash.com/photo-1639762681485-074b7f938ba0?q=80&w=800&auto=format&fit=crop", 
            link: "https://drive.google.com/file/d/167cVIZ_lcZD58L49aj3G_wwo0UFq1A_Q/view?usp=sharing", 
            category: "Other" 
        },
        { 
            title: "مغامرات العلوم (أنشطة وتجارب)", 
            desc: "دليل عملي يهدف لتشجيع الطلاب على البحث والاستقصاء العلمي.", 
            image: "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?q=80&w=800&auto=format&fit=crop", 
            link: "https://drive.google.com/file/d/18kjnBym5bU7Rd5a1RuOnlFOBxRKkB851/view?usp=sharing", 
            category: "Other" 
        },
        { 
            title: "رحلة المحقق الرياضي", 
            desc: "عرض تقديمي يهدف لتبسيط مفاهيم التجميع والمساحة في الرياضيات.", 
            image: "https://images.unsplash.com/photo-1524178232363-1fb2b075b655?q=80&w=800&auto=format&fit=crop", 
            link: "https://docs.google.com/presentation/d/1Qi2RMMvFOZ5yYOYDU7ijli82Ggl0g2oJ/edit?usp=sharing", 
            category: "Other" 
        },
        { 
            title: "وسيلة الرياضيات الإيضاحية", 
            desc: "أداة بصرية تهدف لتعزيز الفهم الهندسي والرياضي لدى الطلاب.", 
            image: "https://images.unsplash.com/photo-1454165833767-1330084b1d3a?q=80&w=800&auto=format&fit=crop", 
            link: "https://drive.google.com/file/d/1rWPJFscc9Wz3WS0kKSwopY8t4Zr1nn36/view?usp=sharing", 
            category: "Other" 
        },
        { 
            title: "رياضيات الصف الثالث الابتدائي", 
            desc: "درس تفاعلي يهدف لتعلم حساب المساحة وخاصية التجميع بذكاء.", 
            image: "https://images.unsplash.com/photo-1544391682-1717bf70ce01?q=80&w=800&auto=format&fit=crop", 
            link: "https://docs.google.com/presentation/d/13HBsXSM9_UZhYdB0Q_DOups_TMiYzTc_/edit?usp=sharing", 
            category: "Other" 
        },
        { 
            title: "أساسيات الرياضيات (Math Essentials)", 
            desc: "وسيلة تعليمية تهدف لتبسيط العمليات الحسابية الأساسية.", 
            image: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=800&auto=format&fit=crop", 
            link: "https://drive.google.com/file/d/12xWq7_V4cxLIvWhJaIRJFE4VFWUJ2BDg/view?usp=sharing", 
            category: "Other" 
        },
        { 
            title: "الهندسة والمساحة (Basic Geometry)", 
            desc: "شرح مرئي يهدف لتبسيط المفاهيم الهندسية وقياس المساحات.", 
            image: "https://images.unsplash.com/photo-1498050108023-c5249f4df085?q=80&w=800&auto=format&fit=crop", 
            link: "https://drive.google.com/file/d/1oF2i1ujoPTbP_Uhi2n4csY4bh6CQblcy/view?usp=sharing", 
            category: "Other" 
        }
    ];

    // Combine Firebase projects with hardcoded ones
    db.collection("projects").orderBy("createdAt", "desc").onSnapshot((snapshot) => {
        const firebaseProjects = [];
        snapshot.forEach(doc => firebaseProjects.push({id: doc.id, ...doc.data()}));
        
        const otherFirebaseProjects = firebaseProjects.filter(fp => 
            !myProjects.some(mp => mp.link === fp.link || mp.title === fp.title)
        );

        const finalProjects = [...myProjects, ...otherFirebaseProjects];
        renderProjects(finalProjects);
        setupProjectFilters(finalProjects);
    }, (err) => {
        console.warn("Firebase Error, using fallback:", err);
        renderProjects(myProjects);
        setupProjectFilters(myProjects);
    });
}

function syncDefaultProjects() {
    const defaultProjects = [
        {
            title: "Smart Scientists 2026",
            desc: "Professional educational platform for science exploration.",
            image: "assets/img/smart_scientists_ui_1778252949835.png",
            link: "https://sites.google.com/view/smart-scientists-2026/%D8%A7%D9%84%D8%B5%D9%81%D8%AD%D8%A9-%D8%A7%D9%84%D8%B1%D8%A6%D9%8A%D8%B3%D9%8A%D8%A9",
            category: "WordPress"
        },
        {
            title: "Journey of Heroes",
            desc: "Heroic educational interface for modern learners.",
            image: "assets/img/journey_heroes_ui_1778253140090.png",
            link: "https://sites.google.com/view/journey-of-heroes-in-the-world/%D8%A7%D9%84%D8%B1%D8%A6%D9%8A%D8%B3%D9%8A%D8%A9-%D8%A7%D9%86%D8%B7%D9%84%D8%A7%D9%82-%D8%A7%D9%84%D8%B1%D8%AD%D9%84%D8%A9",
            category: "WordPress"
        },
        {
            title: "Health Hero Academy",
            desc: "Premium medical education platform.",
            image: "assets/img/health_hero_ui_1778253153287.png",
            link: "https://sites.google.com/view/health-hero-academy-/home-page-start-here",
            category: "WordPress"
        },
        {
            title: "Science Hero 2026",
            desc: "Futuristic science learning portal.",
            image: "assets/img/science_hero_ui_1778253379691.png",
            link: "https://sites.google.com/view/science-hero-2026/%D8%A7%D9%84%D8%B5%D9%81%D8%AD%D8%A9-%D8%A7%D9%84%D8%B1%D8%A6%D9%8A%D8%B3%D9%8A%D8%A9",
            category: "WordPress"
        }
    ];

    db.collection("projects").get().then((querySnapshot) => {
        if (querySnapshot.size < defaultProjects.length) {
            defaultProjects.forEach((proj) => {
                const exists = querySnapshot.docs.find(doc => doc.data().link === proj.link);
                if (!exists) {
                    const p = {...proj, createdAt: firebase.firestore.Timestamp.now()};
                    db.collection("projects").add(p);
                }
            });
        }
    });
}

function renderProjects(projects) {
    const container = document.getElementById('projectsContainer');
    if (!container) return;
    if (projects.length === 0) {
        container.innerHTML = `<p class="text-center w-full" style="grid-column: 1/-1;">${currentLang === 'ar' ? 'لا توجد مشاريع حالياً.' : 'No projects available yet.'}</p>`;
        return;
    }
    
    container.innerHTML = '';
    projects.forEach(proj => {
        const isVideo = proj.link.includes('canva.link') || proj.title.toLowerCase().includes('video') || proj.link.includes('.mp4') || proj.link === '#';
        const typeIcon = isVideo ? '🎬' : '🌐';
        
        const div = document.createElement('div');
        div.className = `project-card glass fade-up visible ${proj.category}`;
        div.innerHTML = `
            <a href="${proj.link}" target="_blank" class="project-card-link">
                <div class="project-img-container">
                    <img src="${proj.image}" alt="${proj.title}" class="project-img" onerror="this.src='https://images.unsplash.com/photo-1547658719-da2b51169166?q=80&w=600&auto=format&fit=crop'">
                    <div class="project-overlay">
                        <span class="btn btn-primary">${currentLang === 'ar' ? 'معاينة المشروع' : 'Preview Project'}</span>
                    </div>
                    <div class="project-type-badge">${typeIcon}</div>
                </div>
                <div class="project-info">
                    <span class="project-category">${proj.category === 'WordPress' ? (currentLang === 'ar' ? 'موقع ووردبريس' : 'WordPress Website') : (currentLang === 'ar' ? 'أعمال إبداعية' : 'Creative Work')}</span>
                    <h3>${proj.title}</h3>
                    <p>${proj.desc}</p>
                </div>
            </a>`;
        container.appendChild(div);
    });
}

function setupProjectFilters(allProjects) {
    const filters = document.querySelectorAll('.filter-btn');
    filters.forEach(btn => {
        btn.onclick = () => {
            filters.forEach(f => f.classList.remove('active'));
            btn.classList.add('active');
            const filter = btn.getAttribute('data-filter');
            const filtered = filter === 'all' ? allProjects : allProjects.filter(p => p.category === filter);
            renderProjects(filtered);
        };
    });
}

function loadReviews() {
    db.collection("reviews").orderBy("createdAt", "desc").onSnapshot((snapshot) => {
        const reviews = [];
        snapshot.forEach(doc => reviews.push(doc.data()));
        const container = document.getElementById('testimonialsContainer');
        if (!container) return;
        container.innerHTML = reviews.length === 0 ? '<p>No reviews yet.</p>' : '';
        reviews.forEach(review => {
            const div = document.createElement('div');
            div.className = 'testimonial-card glass fade-up visible';
            div.innerHTML = `<div class="stars">★`.repeat(review.rating) + `☆`.repeat(5-review.rating) + `</div><p>"${review.text}"</p><p><strong>- ${review.name}</strong></p>`;
            container.appendChild(div);
        });
    });
}

function setupChatbot() {
    const chatToggleBtn = document.getElementById('chatToggleBtn');
    const chatCloseBtn = document.getElementById('chatCloseBtn');
    const chatInterface = document.getElementById('chatInterface');
    const chatInput = document.getElementById('chatInput');
    const chatSendBtn = document.getElementById('chatSendBtn');
    const chatBody = document.getElementById('chatBody');
    const quickReplies = document.querySelectorAll('.chat-chip');

    if (!chatInterface) return;

    const toggleChat = () => {
        const isVisible = chatInterface.style.display === 'flex';
        chatInterface.style.display = isVisible ? 'none' : 'flex';
        if (!isVisible && chatBody.children.length === 0) {
            sendBotMessage(getWelcomeMessage());
        }
    };

    chatToggleBtn?.addEventListener('click', toggleChat);
    chatCloseBtn?.addEventListener('click', () => { chatInterface.style.display = 'none'; });

    setTimeout(() => {
        if (chatInterface.style.display !== 'flex') {
            toggleChat();
        }
    }, 2000);

    const handleSend = () => {
        const text = chatInput.value.trim();
        if (!text) return;
        appendMessage('user', text);
        chatInput.value = '';
        processAIResponse(text);
    };

    chatSendBtn?.addEventListener('click', handleSend);
    chatInput?.addEventListener('keypress', (e) => { if (e.key === 'Enter') handleSend(); });

    quickReplies.forEach(chip => {
        chip.addEventListener('click', () => {
            const msg = chip.textContent;
            appendMessage('user', msg);
            processAIResponse(chip.getAttribute('data-msg'));
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
    setTimeout(() => {
        appendMessage('bot', text);
    }, 600);
}

function getWelcomeMessage() {
    return currentLang === 'ar' 
        ? "مرحباً! أنا مساعد فاطمة الذكي. كيف يمكنني مساعدتك في مشروع الووردبريس القادم الخاص بك اليوم؟ ✨"
        : "Hi there! I'm Fatma's AI assistant. How can I help you with your next WordPress project today? ✨";
}

function processAIResponse(input) {
    const lowerInput = input.toLowerCase();
    let response = "";

    if (currentLang === 'ar') {
        if (lowerInput.includes('pricing') || lowerInput.includes('سعر') || lowerInput.includes('تكلفة')) {
            response = "فاطمة تقدم باقات متنوعة تناسب احتياجاتك. هل تبحث عن متجر إلكتروني أم موقع تعريفي لخدماتك؟";
        } else if (lowerInput.includes('services') || lowerInput.includes('خدمات')) {
            response = "فاطمة متخصصة في تصميم مواقع الووردبريس، تحسين السرعة (SEO)، وإنشاء المتاجر الإلكترونية الاحترافية.";
        } else if (lowerInput.includes('contact') || lowerInput.includes('تواصل') || lowerInput.includes('توظيف')) {
            response = "يمكنك مراسلة فاطمة مباشرة عبر البريد الإلكتروني: fatmaana4444@gmail.com أو ملء نموذج التواصل أسفله!";
        } else {
            response = "أنا هنا للمساعدة! هل تود معرفة المزيد عن أعمال فاطمة السابقة في الووردبريس؟";
        }
    } else {
        if (lowerInput.includes('pricing') || lowerInput.includes('cost') || lowerInput.includes('price')) {
            response = "Fatma offers competitive pricing models. Are you looking for a simple portfolio or a full WooCommerce store?";
        } else if (lowerInput.includes('services') || lowerInput.includes('what do you do')) {
            response = "Fatma specializes in Custom WordPress Design, Speed Optimization, and E-commerce scaling.";
        } else if (lowerInput.includes('contact') || lowerInput.includes('hire')) {
            response = "You can reach Fatma at fatmaana4444@gmail.com. She usually responds within a few hours!";
        } else {
            response = "That sounds interesting! Fatma has helped many businesses grow with WordPress. Would you like to see her process?";
        }
    }
    sendBotMessage(response);
}

function setupIntersectionObservers() {
    const fadeElements = document.querySelectorAll('.fade-up, .fade-in, .scale-in');
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => { if (entry.isIntersecting) entry.target.classList.add('visible'); });
    }, { threshold: 0.1 });
    fadeElements.forEach(el => observer.observe(el));
}

document.addEventListener('DOMContentLoaded', init);
