/* ===========================
   NEXORA MAIN JS FILE
=========================== */

document.addEventListener("DOMContentLoaded", function () {

    /* ===========================
       AOS INIT
    =========================== */
    AOS.init({
        duration: 1000,
        once: true
    });


    /* ===========================
       GSAP HERO ANIMATION
    =========================== */
    gsap.from(".hero h1", {
        y: -50,
        opacity: 0,
        duration: 1.2,
        ease: "power3.out"
    });

    gsap.from(".hero p", {
        y: 30,
        opacity: 0,
        duration: 1.2,
        delay: 0.3,
        ease: "power3.out"
    });

    gsap.from(".hero-buttons a", {
        y: 20,
        opacity: 0,
        duration: 1,
        delay: 0.6,
        stagger: 0.2,
        ease: "power3.out"
    });
    gsap.from(".cta h2", {
        scrollTrigger: ".cta",
        y: 50,
        opacity: 0,
        duration: 1
    });

    gsap.from(".cta p", {
        scrollTrigger: ".cta",
        y: 30,
        opacity: 0,
        duration: 1,
        delay: 0.2
    });


    /* ===========================
       COUNTER ANIMATION
    =========================== */

    const counters = document.querySelectorAll(".stat h2");

    const animateCounter = (counter) => {
        const target = counter.innerText.replace(/[^0-9]/g, "");
        let count = 0;
        const increment = target / 100;

        const updateCounter = () => {
            count += increment;
            if (count < target) {
                counter.innerText = Math.ceil(count) + "+";
                requestAnimationFrame(updateCounter);
            } else {
                counter.innerText = counter.innerText;
            }
        };

        updateCounter();
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                animateCounter(entry.target);
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.6 });

    counters.forEach(counter => observer.observe(counter));


    /* ===========================
       CURSOR GLOW EFFECT
    =========================== */

    const cursor = document.createElement("div");
    cursor.classList.add("cursor-glow");
    document.body.appendChild(cursor);

    document.addEventListener("mousemove", (e) => {
        cursor.style.left = e.clientX + "px";
        cursor.style.top = e.clientY + "px";
    });



    const heroSection = document.querySelector(".hero");

    const scene = new THREE.Scene();

    const camera = new THREE.PerspectiveCamera(
        60,
        window.innerWidth / window.innerHeight,
        0.1,
        1000
    );

    const renderer = new THREE.WebGLRenderer({
        alpha: true,
        antialias: true
    });

    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.domElement.style.position = "absolute";
    renderer.domElement.style.top = "0";
    renderer.domElement.style.left = "0";
    renderer.domElement.style.zIndex = "0";

    heroSection.appendChild(renderer.domElement);

    // Smaller sphere
    const geometry = new THREE.SphereGeometry(2.6, 64, 64);

    const material = new THREE.MeshStandardMaterial({
        color: 0x1e40af,
        wireframe: true,
        transparent: true,
        opacity: 0.9
    });

    const globe = new THREE.Mesh(geometry, material);

    // Move globe to right side
    globe.position.x = 3;
    scene.add(globe);

    const light = new THREE.PointLight(0x00c6ff, 2);
    light.position.set(5, 5, 5);
    scene.add(light);

    camera.position.z = 7;

    function animate() {
        requestAnimationFrame(animate);

        globe.rotation.y += 0.0025;
        globe.rotation.x += 0.0008;

        renderer.render(scene, camera);
    }

    animate();

    window.addEventListener("resize", () => {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
    });

});
