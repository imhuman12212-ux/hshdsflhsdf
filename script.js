/**
 * أكاديمية إنسان لبناء القيم
 * Official JavaScript Engine
 */

document.addEventListener("DOMContentLoaded", function () {
    "use strict";

    // Update Footer Year
    const yearEl = document.getElementById("year");
    if (yearEl) yearEl.textContent = new Date().getFullYear();

    // ==========================================
    // 1. NAVBAR SCROLL & MOBILE MENU
    // ==========================================
    const header = document.getElementById("header");
    const menuBtn = document.getElementById("menuBtn");
    const mobileMenu = document.getElementById("mobileMenu");

    function updateHeader() {
        if (header) {
            header.classList.toggle("scrolled", window.scrollY > 40);
        }
    }
    window.addEventListener("scroll", updateHeader, { passive: true });
    updateHeader();

    function closeMobileMenu() {
        if (mobileMenu && menuBtn) {
            mobileMenu.classList.remove("open");
            mobileMenu.setAttribute("aria-hidden", "true");
            menuBtn.innerHTML = '<i class="fa-solid fa-bars"></i>';
        }
    }

    if (menuBtn && mobileMenu) {
        menuBtn.addEventListener("click", function (e) {
            e.stopPropagation();
            const isOpen = mobileMenu.classList.toggle("open");
            mobileMenu.setAttribute("aria-hidden", String(!isOpen));
            menuBtn.innerHTML = isOpen
                ? '<i class="fa-solid fa-xmark"></i>'
                : '<i class="fa-solid fa-bars"></i>';
        });

        mobileMenu.querySelectorAll("a").forEach(function (link) {
            link.addEventListener("click", closeMobileMenu);
        });

        document.addEventListener("click", function (e) {
            if (mobileMenu.classList.contains("open") && !mobileMenu.contains(e.target) && !menuBtn.contains(e.target)) {
                closeMobileMenu();
            }
        });
    }

    // ==========================================
    // 2. SMOOTH SCROLL WITH HEADER OFFSET
    // ==========================================
    document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
        anchor.addEventListener("click", function (e) {
            const targetId = this.getAttribute("href");
            if (targetId === "#") return;
            const targetEl = document.querySelector(targetId);
            if (targetEl) {
                e.preventDefault();
                const headerHeight = header ? header.offsetHeight : 80;
                const targetPosition = targetEl.getBoundingClientRect().top + window.pageYOffset - headerHeight - 15;
                window.scrollTo({
                    top: targetPosition,
                    behavior: "smooth",
                });
            }
        });
    });

    // ==========================================
    // 3. ACTIVE NAV LINK HIGHLIGHT ON SCROLL
    // ==========================================
    const navLinks = document.querySelectorAll(".desktop-nav .nav-link");
    const trackedSections = document.querySelectorAll("section[id]");

    function updateActiveNavLink() {
        let currentId = "";
        const scrollPos = window.scrollY + 180;

        trackedSections.forEach(function (sec) {
            if (scrollPos >= sec.offsetTop) {
                currentId = sec.id;
            }
        });

        navLinks.forEach(function (link) {
            const href = link.getAttribute("href");
            link.classList.toggle("active", href === "#" + currentId);
        });
    }
    window.addEventListener("scroll", updateActiveNavLink, { passive: true });

    // ==========================================
    // 4. REVEAL ELEMENTS ON SCROLL
    // ==========================================
    const revealElements = document.querySelectorAll(".reveal");
    if ("IntersectionObserver" in window) {
        const revealObserver = new IntersectionObserver(
            function (entries) {
                entries.forEach(function (entry) {
                    if (entry.isIntersecting) {
                        entry.target.classList.add("show");
                        revealObserver.unobserve(entry.target);
                    }
                });
            },
            { threshold: 0.12 }
        );
        revealElements.forEach(function (el) {
            revealObserver.observe(el);
        });
    } else {
        revealElements.forEach(function (el) {
            el.classList.add("show");
        });
    }

    // ==========================================
    // 5. ANIMATED STAT COUNTERS
    // ==========================================
    function animateCounter(el) {
        const target = parseInt(el.dataset.target, 10) || 0;
        const duration = 2000;
        const steps = 60;
        const stepTime = duration / steps;
        let current = 0;
        const increment = target / steps;

        const timer = setInterval(function () {
            current += increment;
            if (current >= target) {
                current = target;
                clearInterval(timer);
            }
            el.textContent = Math.floor(current).toLocaleString("ar-EG");
        }, stepTime);
    }

    if ("IntersectionObserver" in window) {
        const counterObserver = new IntersectionObserver(
            function (entries) {
                entries.forEach(function (entry) {
                    if (entry.isIntersecting) {
                        animateCounter(entry.target);
                        counterObserver.unobserve(entry.target);
                    }
                });
            },
            { threshold: 0.4 }
        );
        document.querySelectorAll(".counter[data-target]").forEach(function (c) {
            counterObserver.observe(c);
        });
    }

    // ==========================================
    // 6. PROGRAM CARDS (FLIP & SELECT)
    // ==========================================
    const progBoxes = document.querySelectorAll(".prog-box");
    progBoxes.forEach(function (box) {
        box.setAttribute("tabindex", "0");
        box.setAttribute("role", "button");

        box.addEventListener("click", function (e) {
            if (e.target.closest(".prog-action-btn")) return;
            this.classList.toggle("flipped");
        });

        box.addEventListener("keydown", function (e) {
            if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                this.classList.toggle("flipped");
            }
        });
    });

    // When clicking "سجل في هذا المسار" on back of card:
    document.querySelectorAll(".prog-action-btn").forEach(function (btn) {
        btn.addEventListener("click", function (e) {
            e.preventDefault();
            const programName = this.dataset.selectProgram;
            const joinSection = document.getElementById("join");
            const joinPathSelect = document.getElementById("joinPath");

            if (joinPathSelect && programName) {
                joinPathSelect.value = programName;
                joinPathSelect.classList.remove("field-highlight");
                void joinPathSelect.offsetWidth; // trigger reflow
                joinPathSelect.classList.add("field-highlight");
            }

            if (joinSection) {
                const headerOffset = header ? header.offsetHeight + 20 : 80;
                const pos = joinSection.getBoundingClientRect().top + window.pageYOffset - headerOffset;
                window.scrollTo({ top: pos, behavior: "smooth" });
            }
        });
    });

    // ==========================================
    // 7. TESTIMONIALS AUTO-SLIDER (ROCK-SOLID RTL)
    // ==========================================
    const track = document.getElementById("testimonialsTrack");
    const prevBtn = document.getElementById("prevBtn");
    const nextBtn = document.getElementById("nextBtn");
    const dotsContainer = document.getElementById("carouselDots");
    const autoIndicatorText = document.querySelector(".auto-indicator-text");

    if (track) {
        const slides = track.querySelectorAll(".testimonial-slide");
        const totalSlides = slides.length;
        let currentIndex = 0;
        let autoPlayTimer = null;
        let isPaused = false;
        const gap = 24; // matches CSS gap: 24px

        function getVisibleSlidesCount() {
            return window.innerWidth <= 900 ? 1 : 2;
        }

        function getMaxIndex() {
            return Math.max(0, totalSlides - getVisibleSlidesCount());
        }

        function buildDots() {
            if (!dotsContainer) return;
            dotsContainer.innerHTML = "";
            const maxIdx = getMaxIndex();
            for (let i = 0; i <= maxIdx; i++) {
                const dot = document.createElement("button");
                dot.classList.add("carousel-dot");
                dot.setAttribute("aria-label", "شريحة " + (i + 1));
                if (i === currentIndex) dot.classList.add("active");
                dot.addEventListener("click", function () {
                    goToSlide(i);
                    resetAutoPlay();
                });
                dotsContainer.appendChild(dot);
            }
        }

        function updateSliderPosition() {
            const slideWidth = slides[0] ? slides[0].offsetWidth : 300;
            const moveStep = slideWidth + gap;
            const offset = currentIndex * moveStep;

            // In RTL, positive translateX shifts the track rightward to show next slides
            track.style.transform = "translateX(" + offset + "px)";

            if (dotsContainer) {
                const dots = dotsContainer.querySelectorAll(".carousel-dot");
                dots.forEach(function (d, i) {
                    d.classList.toggle("active", i === currentIndex);
                });
            }

            if (prevBtn) prevBtn.disabled = currentIndex === 0;
            if (nextBtn) nextBtn.disabled = currentIndex >= getMaxIndex();
        }

        function goToSlide(index) {
            const maxIdx = getMaxIndex();
            if (index < 0) {
                currentIndex = 0;
            } else if (index > maxIdx) {
                currentIndex = maxIdx;
            } else {
                currentIndex = index;
            }
            updateSliderPosition();
        }

        function nextSlide() {
            const maxIdx = getMaxIndex();
            if (currentIndex >= maxIdx) {
                goToSlide(0);
            } else {
                goToSlide(currentIndex + 1);
            }
        }

        function prevSlide() {
            if (currentIndex <= 0) {
                goToSlide(getMaxIndex());
            } else {
                goToSlide(currentIndex - 1);
            }
        }

        function startAutoPlay() {
            stopAutoPlay();
            autoPlayTimer = setInterval(function () {
                if (!isPaused) {
                    nextSlide();
                }
            }, 3600);
            if (autoIndicatorText) autoIndicatorText.textContent = "حركة تلقائية مستمرة";
        }

        function stopAutoPlay() {
            if (autoPlayTimer) {
                clearInterval(autoPlayTimer);
                autoPlayTimer = null;
            }
        }

        function resetAutoPlay() {
            startAutoPlay();
        }

        nextBtn?.addEventListener("click", function () {
            nextSlide();
            resetAutoPlay();
        });

        prevBtn?.addEventListener("click", function () {
            prevSlide();
            resetAutoPlay();
        });

        // Pause on Hover
        const wrapper = document.querySelector(".testimonials-wrapper");
        wrapper?.addEventListener("mouseenter", function () {
            isPaused = true;
            if (autoIndicatorText) autoIndicatorText.textContent = "متوقف مؤقتاً (عند التمرير)";
        });

        wrapper?.addEventListener("mouseleave", function () {
            isPaused = false;
            if (autoIndicatorText) autoIndicatorText.textContent = "حركة تلقائية مستمرة";
        });

        // Touch swipe support
        let touchStartX = 0;
        let touchEndX = 0;

        track.addEventListener("touchstart", function (e) {
            touchStartX = e.changedTouches[0].screenX;
        }, { passive: true });

        track.addEventListener("touchend", function (e) {
            touchEndX = e.changedTouches[0].screenX;
            const diff = touchStartX - touchEndX;
            if (Math.abs(diff) > 40) {
                if (diff > 0) {
                    nextSlide();
                } else {
                    prevSlide();
                }
                resetAutoPlay();
            }
        }, { passive: true });

        // Resize Listener
        let resizeTimer;
        window.addEventListener("resize", function () {
            clearTimeout(resizeTimer);
            resizeTimer = setTimeout(function () {
                buildDots();
                goToSlide(Math.min(currentIndex, getMaxIndex()));
            }, 100);
        });

        // Initial setup
        buildDots();
        updateSliderPosition();
        startAutoPlay();
    }

    // ==========================================
    // 8. FAQ ACCORDION
    // ==========================================
    const faqItems = document.querySelectorAll(".faq-item");
    faqItems.forEach(function (item) {
        const trigger = item.querySelector(".faq-trigger");
        const body = item.querySelector(".faq-body");

        trigger?.addEventListener("click", function () {
            const isOpen = item.classList.contains("open");

            faqItems.forEach(function (other) {
                other.classList.remove("open");
                other.querySelector(".faq-trigger")?.setAttribute("aria-expanded", "false");
                const otherBody = other.querySelector(".faq-body");
                if (otherBody) otherBody.style.maxHeight = null;
            });

            if (!isOpen) {
                item.classList.add("open");
                trigger.setAttribute("aria-expanded", "true");
                if (body) body.style.maxHeight = body.scrollHeight + "px";
            }
        });
    });

    // ==========================================
    // 9. JOIN REGISTRATION FORM
    // ==========================================
    const joinForm = document.getElementById("joinForm");
    const joinSuccess = document.getElementById("joinSuccess");
    const joinSubmitBtn = document.getElementById("joinSubmitBtn");
    const joinWhatsAppBtn = document.getElementById("joinWhatsAppBtn");

    function getJoinFormData() {
        return {
            name: document.getElementById("joinName")?.value.trim() || "",
            age: document.getElementById("joinAge")?.value.trim() || "",
            phone: document.getElementById("joinPhone")?.value.trim() || "",
            email: document.getElementById("joinEmail")?.value.trim() || "",
            path: document.getElementById("joinPath")?.value.trim() || "",
            studyMode: document.getElementById("joinStudyMode")?.value || "حضوري في إسطنبول",
            nationality: document.getElementById("joinNationality")?.value.trim() || "",
            residence: document.getElementById("joinResidence")?.value.trim() || "",
        };
    }

    function validateJoinForm(data) {
        if (!data.name) { alert("يرجى كتابة الاسم واللقب."); return false; }
        if (!data.age) { alert("يرجى كتابة العمر."); return false; }
        if (!data.phone) { alert("يرجى كتابة رقم الهاتف مع رمز الدولة."); return false; }
        if (!data.email) { alert("يرجى كتابة البريد الإلكتروني."); return false; }
        if (!data.path) { alert("يرجى اختيار المسار أو البرنامج المطلوب."); return false; }
        if (!data.nationality) { alert("يرجى كتابة الجنسية."); return false; }
        if (!data.residence) { alert("يرجى كتابة بلد الإقامة."); return false; }
        return true;
    }

    // Submit via WhatsApp
    joinWhatsAppBtn?.addEventListener("click", function () {
        const data = getJoinFormData();
        if (!validateJoinForm(data)) return;

        const messageText =
            "🌟 *طلب تسجيل جديد في أكاديمية إنسان لبناء القيم* 🌟\n" +
            "──────────────────\n" +
            "👤 *الاسم واللقب:* " + data.name + "\n" +
            "🎂 *العمر:* " + data.age + " سنة\n" +
            "📞 *رقم الهاتف:* " + data.phone + "\n" +
            "📧 *البريد الإلكتروني:* " + data.email + "\n" +
            "📚 *المسار المطلوب:* " + data.path + "\n" +
            "🏫 *طريقة الحضور:* " + data.studyMode + "\n" +
            "🌍 *الجنسية:* " + data.nationality + "\n" +
            "📍 *بلد الإقامة:* " + data.residence + "\n" +
            "──────────────────\n" +
            "أرجو تزويدي بكافة تفاصيل الحجز والمواعيد.";

        const waUrl = "https://wa.me/905009477911?text=" + encodeURIComponent(messageText);
        window.open(waUrl, "_blank");

        if (joinSuccess) {
            joinSuccess.classList.add("show");
            setTimeout(function () {
                joinSuccess.classList.remove("show");
            }, 8000);
        }
    });

    // Submit via Form
    joinForm?.addEventListener("submit", function (e) {
        e.preventDefault();
        const data = getJoinFormData();
        if (!validateJoinForm(data)) return;

        if (joinSubmitBtn) {
            joinSubmitBtn.disabled = true;
            joinSubmitBtn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> جاري حفظ الطلب...';
        }

        setTimeout(function () {
            joinForm.reset();
            if (joinSubmitBtn) {
                joinSubmitBtn.disabled = false;
                joinSubmitBtn.innerHTML = '<span>إرسال طلب التسجيل</span> <i class="fa-solid fa-arrow-left"></i>';
            }
            if (joinSuccess) {
                joinSuccess.classList.add("show");
                setTimeout(function () {
                    joinSuccess.classList.remove("show");
                }, 8000);
            }
        }, 1200);
    });

    // ==========================================
    // 10. CONTACT FORM
    // ==========================================
    const contactForm = document.getElementById("contactForm");
    const formSuccess = document.getElementById("formSuccess");
    const contactSubmitBtn = document.getElementById("contactSubmitBtn");

    contactForm?.addEventListener("submit", function (e) {
        e.preventDefault();

        const name = document.getElementById("fname")?.value.trim() || "";
        const email = document.getElementById("femail")?.value.trim() || "";
        const message = document.getElementById("fmessage")?.value.trim() || "";

        if (!name || !email || !message) {
            alert("يرجى ملء الحقول الأساسية (الاسم، البريد، والرسالة).");
            return;
        }

        if (contactSubmitBtn) {
            contactSubmitBtn.disabled = true;
            contactSubmitBtn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> جاري الإرسال...';
        }

        setTimeout(function () {
            contactForm.reset();
            if (contactSubmitBtn) {
                contactSubmitBtn.disabled = false;
                contactSubmitBtn.innerHTML = '<span>إرسال الرسالة</span> <i class="fa-solid fa-paper-plane"></i>';
            }
            if (formSuccess) {
                formSuccess.classList.add("show");
                setTimeout(function () {
                    formSuccess.classList.remove("show");
                }, 7000);
            }
        }, 1200);
    });

});