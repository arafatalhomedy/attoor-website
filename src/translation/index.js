const translations = {
    en: {
        nav: {
            home: "Home",
            about: "About us",
            projects: "Projects",
            services: "Services",
            quote: "Get a quote",
            contact: "Contact us",
            team: "Our Team",
        },
        hero: {
            tagline: "Attoor.CEGS — Construction, Engineering & General Services",
            headline: "🏗️Building with Precision, Delivering with Pride",
            body: "From the ground up to the final touch, we bring residential and commercial projects to life with craftsmanship, reliability, and attention to detail. Every structure we deliver reflects our commitment to quality and the trust our clients place in us.",
            cta: "View Our Work",
        },
        services: {
            tagline: "What we do",
            headline: "Services built around your project",
            items: [
                {
                    title: "Residential Construction",
                    description: "New builds and custom homes delivered with precision from groundwork to handover.",
                },
                {
                    title: "Commercial Construction",
                    description: "Offices, retail spaces, and facilities built to schedule and to code.",
                },
                {
                    title: "Renovation & Restoration",
                    description: "Structural upgrades and modernization for existing buildings, done without cutting corners.",
                },
                {
                    title: "Structural Engineering",
                    description: "Design and analysis to make sure every structure stands on solid calculations.",
                },
                {
                    title: "Project Management",
                    description: "One point of contact from permits to final walkthrough, keeping budget and timeline on track.",
                },
                {
                    title: "Site Supervision",
                    description: "On-site quality control and safety oversight throughout every phase of construction.",
                },
            ],
        },
        projects: {
            tagline: "Our work",
            headline: "Projects we're proud of",
            filters: {
                all: "All",
                residential: "Residential",
                commercial: "Commercial",
                renovation: "Renovation",
            },
            labels: {
                name: "Project Name",
                date: "Date",
                work: "Work",
                category: "Category",
                budget: "Total Expenses",
            },

            detail: {
                overview: "Project Overview",
                gallery: "Project Gallery",
                timeline: "Construction Timeline",
                location: "Location",
                client: "Client",
                back: "Back to projects",
            },


        },
        about: {
            tagline: "Who we are",
            headline: "Building trust since day one",
            body: "Attoor.CEGS is a construction and engineering firm delivering residential, commercial, and renovation projects with precision and accountability. Every project is managed end-to-end by our own team, from initial design through final handover.",
            stats: [
                { value: "150+", label: "Projects completed" },
                { value: "12", label: "Years in operation" },
                { value: "40+", label: "Team members" },
                { value: "98%", label: "On-time delivery" },
            ],
        },
        team: {
            // inside en.team
            tagline: "Our people",
            headline: "The team behind the work",

        },
        contact: {
            tagline: "Get In Touch",
            headline: "Contact Us",
            intro: "Have a construction project in mind? Contact our team and let's discuss your next project.",
            formTitle: "Let's Work Together",
            officeLabel: "Our Office",
            officeAddress: "Your Office Address",
            officeCity: "Your City, Your Country",
            emailLabel: "Email",
            namePlaceholder: "Your Name",
            emailPlaceholder: "Your Email",
            phonePlaceholder: "Your Phone",
            subjectPlaceholder: "Subject",
            messagePlaceholder: "Your Message",
            send: "Send Message",
        },
        projectCta: {
            headline: "Interested in a similar project?",
            body: "Let's talk about what you're planning — we'll give you a clear, honest quote.",
            button: "Get a quote",
        },
        admin: {
            title: "Attoor Admin",
            dashboard: "Dashboard",
            logout: "Log out",
            dark: "Dark",
            light: "Light",
            manage: {
                projects: { title: "Projects", desc: "Manage portfolio projects" },
                team: { title: "Team", desc: "Manage team members" },
                services: { title: "Services", desc: "Manage services list" },
            },
            overview: "Overview",
            stats: {
                projects: "Projects",
                team: "Team Members",
                services: "Services",
                published: "published",
                draft: "draft",
            },
            security: {
                title: "Login Security",
                none: "No failed login attempts in the last 24 hours.",
                some: "failed login attempt(s) in the last 24 hours.",
            },
            recentActivity: "Recent Activity",
            noActivity: "Nothing added yet.",
            types: {
                Project: "Project",
                Team: "Team",
                Service: "Service",
            },
        },
    },
    ar: {
        nav: {
            home: "الرئيسية",
            about: "من نحن",
            projects: "المشاريع",
            services: "الخدمات",
            quote: "تصفح مشاريعنا",
            contact: "اتصل بنا",
            team: "فريقنا",
        },
        hero: {
            tagline: "الطور للهندسة و الانشاءات و الخدمات العامة",
            headline: "الجودة والنزاهة في كل مشروع.",
            body: "ننفذ مشاريع سكنية وتجارية بدقة عالية، من الأساس حتى اللمسة الأخيرة.",
            cta: "تصفح مشاريعنا",
        },
        services: {
            tagline: "ماذا نقدم",
            headline: "خدمات مصممة حول مشروعك",
            items: [
                {
                    title: "الإنشاءات السكنية",
                    description: "تنفيذ مبانٍ ومنازل مخصصة بدقة من الأساس حتى التسليم.",
                },
                {
                    title: "الإنشاءات التجارية",
                    description: "مكاتب ومساحات تجارية ومرافق تُبنى وفق الجدول الزمني والأنظمة المعتمدة.",
                },
                {
                    title: "الترميم والتجديد",
                    description: "تطوير هيكلي وتحديث للمباني القائمة دون التهاون في الجودة.",
                },
                {
                    title: "الهندسة الإنشائية",
                    description: "تصميم وتحليل يضمن قيام كل منشأة على حسابات دقيقة وصلبة.",
                },
                {
                    title: "إدارة المشاريع",
                    description: "جهة تواصل واحدة من التراخيص حتى التسليم النهائي، للحفاظ على الميزانية والجدول الزمني.",
                },
                {
                    title: "الإشراف على الموقع",
                    description: "مراقبة الجودة والسلامة في الموقع خلال جميع مراحل التنفيذ.",
                },
            ],
        },
        projects: {
            tagline: "أعمالنا",
            headline: "مشاريع نفخر بها",
            filters: {
                all: "الكل",
                residential: "سكني",
                commercial: "تجاري",
                renovation: "ترميم",
            },
            labels: {
                name: "اسم المشروع",
                date: "التاريخ",
                work: "نوع العمل",
                category: "الفئة",
                budget: "إجمالي التكلفة",
            },
            detail: {
                overview: "نظرة عامة على المشروع",
                gallery: "معرض صور المشروع",
                timeline: "الجدول الزمني للتنفيذ",
                location: "الموقع",
                client: "العميل",
                back: "العودة إلى المشاريع",
            },

        },
        about: {
            tagline: "من نحن",
            headline: "نبني الثقة منذ اليوم الأول",
            body: "عطور للإنشاءات والهندسة هي شركة متخصصة في تنفيذ المشاريع السكنية والتجارية وأعمال الترميم بدقة عالية ومسؤولية كاملة. يدير فريقنا كل مشروع من التصميم الأولي وحتى التسليم النهائي.",
            stats: [
                { value: "+150", label: "مشروع مكتمل" },
                { value: "12", label: "سنة من الخبرة" },
                { value: "+40", label: "عضو في الفريق" },
                { value: "98%", label: "التسليم في الموعد" },
            ],
        },
        team: {
            // inside ar.team
            tagline: "فريقنا",
            headline: "الفريق وراء العمل",

        },
        contact: {
            tagline: "تواصل معنا",
            headline: "اتصل بنا",
            intro: "هل لديك مشروع إنشائي في ذهنك؟ تواصل مع فريقنا لنناقش مشروعك القادم.",
            formTitle: "لنعمل معًا",
            officeLabel: "مكتبنا",
            officeAddress: "عنوان المكتب",
            officeCity: "المدينة، الدولة",
            emailLabel: "البريد الإلكتروني",
            namePlaceholder: "اسمك",
            emailPlaceholder: "بريدك الإلكتروني",
            phonePlaceholder: "رقم هاتفك",
            subjectPlaceholder: "الموضوع",
            messagePlaceholder: "رسالتك",
            send: "إرسال الرسالة",
        },
        projectCta: {
            headline: "مهتم بمشروع مشابه؟",
            body: "تحدث معنا حول ما تخطط له، وسنقدم لك عرض سعر واضح وصادق.",
            button: "اطلب عرض سعر",
        },

        admin: {
            title: "لوحة تحكم عطور",
            dashboard: "لوحة التحكم",
            logout: "تسجيل الخروج",
            dark: "داكن",
            light: "فاتح",
            manage: {
                projects: { title: "المشاريع", desc: "إدارة مشاريع المعرض" },
                team: { title: "الفريق", desc: "إدارة أعضاء الفريق" },
                services: { title: "الخدمات", desc: "إدارة قائمة الخدمات" },
            },
            overview: "نظرة عامة",
            stats: {
                projects: "المشاريع",
                team: "أعضاء الفريق",
                services: "الخدمات",
                published: "منشور",
                draft: "مسودة",
            },
            security: {
                title: "أمان تسجيل الدخول",
                none: "لا توجد محاولات دخول فاشلة خلال آخر 24 ساعة.",
                some: "محاولة دخول فاشلة خلال آخر 24 ساعة.",
            },
            recentActivity: "النشاط الأخير",
            noActivity: "لم تتم إضافة أي شيء بعد.",
            types: {
                Project: "مشروع",
                Team: "فريق",
                Service: "خدمة",
            },
        },


    },
};

export default translations;