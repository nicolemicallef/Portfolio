gsap.registerPlugin(ScrollTrigger);

gsap.to(".pen-cap", {
    scrollTrigger: {
        trigger: ".intro-title",
        start: "bottom center", // starts earlier
        end: "+=100vh",
        scrub: 0.5
    },
    y: "-64vh"
});

gsap.to(".pen-body", {
    scrollTrigger: {
        trigger: ".intro-title",
        start: "bottom center",
        end: "+=100vh",
        scrub: 0.5
    },
    y: "20vh"
});


