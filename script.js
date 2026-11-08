/* =========================================
   ROYAL WEDDING INVITATION — JAVASCRIPT
   VLADIMIR & OLGA
========================================= */

(() => {

    "use strict";


    /* =====================================
       01. НАСТРОЙКИ
    ====================================== */

    const reducedMotion = window.matchMedia(
        "(prefers-reduced-motion: reduce)"
    ).matches;

    const finePointer = window.matchMedia(
        "(hover: hover) and (pointer: fine)"
    ).matches;

    let lenis = null;

    let invitationOpened = false;

    let siteAnimationsStarted = false;

    let countdownInterval = null;


    /* =====================================
       02. LENIS — ПЛАВНАЯ ПРОКРУТКА
    ====================================== */

    if (
        window.Lenis &&
        window.gsap &&
        !reducedMotion
    ) {

        lenis = new Lenis({

            duration: 1.2,

            easing: (t) =>
                Math.min(
                    1,
                    1.001 - Math.pow(2, -10 * t)
                ),

            smoothWheel: true,

            wheelMultiplier: 0.9

        });


        // Пока конверт закрыт, прокрутка заблокирована.

        lenis.stop();


        // Связь Lenis и ScrollTrigger.

        lenis.on("scroll", () => {

            if (window.ScrollTrigger) {

                window.ScrollTrigger.update();

            }

        });


        // Единый цикл анимации.

        gsap.ticker.add((time) => {

            lenis.raf(time * 1000);

        });

        gsap.ticker.lagSmoothing(0);

    }


    /* =====================================
       03. КАСТОМНЫЙ КУРСОР
    ====================================== */

    const cursorDot = document.querySelector(
        ".cursor-dot"
    );

    const cursorOutline = document.querySelector(
        ".cursor-outline"
    );


    if (
        finePointer &&
        cursorDot &&
        cursorOutline
    ) {

        window.addEventListener(

            "mousemove",

            (event) => {

                cursorDot.style.left =
                    event.clientX + "px";

                cursorDot.style.top =
                    event.clientY + "px";


                cursorOutline.animate(

                    {

                        left: event.clientX + "px",

                        top: event.clientY + "px"

                    },

                    {

                        duration: 400,

                        fill: "forwards"

                    }

                );

            },

            { passive: true }

        );


        // Изменение курсора при наведении.

        document.querySelectorAll(
            "a, button, input, select, textarea, #open-letter"
        ).forEach((element) => {


            element.addEventListener(

                "mouseenter",

                () => {

                    document.body.classList.add(
                        "cursor-hover"
                    );

                }

            );


            element.addEventListener(

                "mouseleave",

                () => {

                    document.body.classList.remove(
                        "cursor-hover"
                    );

                }

            );

        });

    }


    /* =====================================
       04. ПРОГРЕСС ПРОКРУТКИ
    ====================================== */

    const progressBar = document.querySelector(
        ".scroll-progress"
    );


    function updateScrollEffects() {

        if (progressBar) {

            const scrollHeight =
                document.documentElement.scrollHeight -
                window.innerHeight;


            const progress = scrollHeight > 0

                ? (window.scrollY / scrollHeight) * 100

                : 0;


            progressBar.style.width =
                Math.min(
                    100,
                    Math.max(0, progress)
                ) + "%";

        }

    }


    window.addEventListener(

        "scroll",

        updateScrollEffects,

        { passive: true }

    );


    window.addEventListener(

        "resize",

        updateScrollEffects

    );


    /* =====================================
       05. ЗОЛОТАЯ ПЫЛЬ
    ====================================== */

    const particleContainer = document.querySelector(
        ".floating-particles"
    );


    if (
        particleContainer &&
        !reducedMotion
    ) {

        for (let i = 0; i < 25; i++) {

            const particle =
                document.createElement("span");


            particle.className =
                "dust-particle";


            particle.style.left =
                Math.random() * 100 + "%";


            particle.style.setProperty(

                "--duration",

                (10 + Math.random() * 15) + "s"

            );


            particle.style.setProperty(

                "--delay",

                (-Math.random() * 20) + "s"

            );


            particleContainer.appendChild(
                particle
            );

        }

    }


    /* =====================================
       06. ИНТЕРАКТИВНОЕ 3D-ОТКРЫТИЕ КОНВЕРТА
    ====================================== */

    const openButton = document.getElementById("open-letter");
    const heroVideo = document.getElementById("hero-video-player");

    function openInvitation() {

        if (invitationOpened) return;

        invitationOpened = true;


        if (heroVideo) {
            heroVideo.muted = true;
            heroVideo.play().catch(err => console.log("Video play error:", err));
        }


        const wrapper = document.querySelector('.envelope-wrapper');

        const gate = document.getElementById('invitation-gate');


        if (wrapper) wrapper.classList.add('is-open');


        setTimeout(() => {

            if (gate) gate.classList.add('fade-out');

        }, 1200);


        setTimeout(() => {

            if (gate) gate.style.display = 'none';

            document.body.classList.remove('locked');

            if (lenis) lenis.start();

            startSiteAnimations();

            updateScrollEffects();

        }, 2200);

    }


    if (openButton) {

        openButton.addEventListener(
            "click",
            openInvitation
        );

    }


    /* =====================================
       07. ГИРОСКОП И 3D-TILT ДЛЯ СМАРТФОНОВ
    ====================================== */

    if (
        window.DeviceOrientationEvent && 
        /Mobi|Android|iPhone/i.test(navigator.userAgent)
    ) {

        window.addEventListener('deviceorientation', (e) => {

            if (!e.gamma || !e.beta) return;

            const tiltX = Math.min(Math.max(e.gamma, -20), 20);

            const tiltY = Math.min(Math.max(e.beta - 45, -20), 20);


            document.querySelectorAll(
                '.program-card, .detail-letter, .dress-palette-row, .moment-photo-card'
            ).forEach(card => {

                card.style.transform = 
                    `perspective(600px) rotateX(${tiltY * 0.2}deg) rotateY(${tiltX * 0.2}deg)`;

            });

        });

    }


    /* =====================================
       08. АНИМАЦИИ ОСНОВНОГО САЙТА (GSAP)
    ====================================== */

    function startSiteAnimations() {

        if (siteAnimationsStarted) return;

        siteAnimationsStarted = true;


        if (!window.gsap || reducedMotion) {

            document.querySelectorAll(
                ".reveal-up, .reveal-text"
            ).forEach(el => {

                el.style.opacity = "1";

                el.style.transform = "none";

                el.style.filter = "none";

            });

            return;

        }


        if (window.ScrollTrigger) {

            gsap.registerPlugin(window.ScrollTrigger);

        }


        const heroTimeline = gsap.timeline();


        heroTimeline.fromTo(
            ".hero-subtitle",
            { y: 35, opacity: 0, filter: "blur(8px)" },
            { y: 0, opacity: 1, filter: "blur(0px)", duration: 1, ease: "power3.out" }
        );

        heroTimeline.fromTo(
            ".hero-crown",
            { opacity: 0, scale: 0.5, rotation: -20 },
            { opacity: 1, scale: 1, rotation: 0, duration: 1, ease: "back.out(1.7)" },
            "-=0.6"
        );

        heroTimeline.fromTo(
            ".hero-scroll",
            { opacity: 0 },
            { opacity: 1, duration: 1 },
            "-=0.3"
        );


        if (!window.ScrollTrigger) return;


        // Появление заголовков

        gsap.utils.toArray(".reveal-text").forEach((element) => {

            gsap.fromTo(
                element, 
                { y: 40, opacity: 0, filter: "blur(6px)" },
                { 
                    y: 0, 
                    opacity: 1, 
                    filter: "blur(0px)", 
                    duration: 1.2, 
                    ease: "power3.out", 
                    scrollTrigger: { trigger: element, start: "top 85%", once: true } 
                }
            );

        });


        // Появление карточек

        gsap.utils.toArray(".reveal-up").forEach((element, index) => {

            gsap.fromTo(
                element,
                { y: 55, opacity: 0 },
                { 
                    y: 0, 
                    opacity: 1, 
                    duration: 1, 
                    delay: (index % 3) * 0.08, 
                    ease: "power2.out", 
                    scrollTrigger: { trigger: element, start: "top 90%", once: true } 
                }
            );

        });


        // Анимация прорисовывающихся золотых линий

        gsap.utils.toArray('.simple-divider, .final-divider').forEach(line => {

            ScrollTrigger.create({

                trigger: line,

                start: "top 90%",

                onEnter: () => line.classList.add('is-drawn')

            });

        });


        window.ScrollTrigger.refresh();

    }


    /* =====================================
       09. МУЗЫКАЛЬНОЕ СОПРОВОЖДЕНИЕ
    ====================================== */

    const musicButton = document.getElementById(
        "music-btn"
    );

    const backgroundMusic = document.getElementById(
        "bg-music"
    );

    let musicPlaying = false;


    if (musicButton && backgroundMusic) {

        musicButton.addEventListener("click", async () => {

            if (!musicPlaying) {

                try {

                    await backgroundMusic.play();

                    musicPlaying = true;

                    musicButton.classList.add("is-playing");

                    musicButton.setAttribute("aria-label", "Выключить музыку");

                } catch (error) {

                    alert("Не удалось загрузить аудиозапись. Проверьте подключение к сети.");

                }

            } else {

                backgroundMusic.pause();

                musicPlaying = false;

                musicButton.classList.remove("is-playing");

                musicButton.setAttribute("aria-label", "Включить музыку");

            }

        });

    }


    /* =====================================
       10. ТАЙМЕР (14 МАЯ 2027, 15:00)
    ====================================== */

    const weddingDate = new Date(2027, 4, 14, 15, 0, 0).getTime();

    const pad = (n) => String(n).padStart(2, "0");


    function updateCountdown() {

        const countdown = document.getElementById("countdown");

        if (!countdown) return;


        const distance = weddingDate - Date.now();


        if (distance <= 0) {

            countdown.innerHTML = `<div class="countdown-message">Мы поженились!</div>`;

            if (countdownInterval) clearInterval(countdownInterval);

            return;

        }


        const days = Math.floor(distance / (1000 * 60 * 60 * 24));

        const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));

        const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));

        const seconds = Math.floor((distance % (1000 * 60)) / 1000);


        const daysEl = document.getElementById("days");

        const hoursEl = document.getElementById("hours");

        const minutesEl = document.getElementById("minutes");

        const secondsEl = document.getElementById("seconds");


        if (daysEl) daysEl.textContent = days;

        if (hoursEl) hoursEl.textContent = pad(hours);

        if (minutesEl) minutesEl.textContent = pad(minutes);

        if (secondsEl) secondsEl.textContent = pad(seconds);

    }


    updateCountdown();

    if (Date.now() < weddingDate) {

        countdownInterval = setInterval(updateCountdown, 1000);

    }


    /* =====================================
       11. RSVP — ФОРМА
    ====================================== */

    const rsvpForm = document.getElementById("rsvp-form");

    if (rsvpForm) {

        rsvpForm.addEventListener("submit", (e) => {

            e.preventDefault();

            const formData = new FormData(rsvpForm);

            const guestName = formData.get("name");


            if (!guestName || !String(guestName).trim()) {

                alert("Пожалуйста, укажите ваше имя.");

                return;

            }


            alert(`Спасибо, ${guestName}!\n\nВаш ответ подготовлен. До встречи на нашем торжестве! ❤️`);

        });

    }


})();