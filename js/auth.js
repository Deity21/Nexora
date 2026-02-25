document.addEventListener("mousemove", function(e){
    document.body.style.backgroundPosition =
        `${e.clientX / 20}px ${e.clientY / 20}px`;
});
// ===========================
// SIGNUP LOGIC
// ===========================
const signupForm = document.getElementById("signupForm");

if (signupForm) {
    signupForm.addEventListener("submit", function(e) {
        e.preventDefault();

        const name = signupForm.querySelector("input[type='text']").value;
        const email = signupForm.querySelector("input[type='email']").value;
        const password = signupForm.querySelector("input[type='password']").value;

        const user = {
            name: name,
            email: email,
            password: password,
            role: "student",   // future-proof
            paidCourses: [],   // array of purchased courses
            progress: {}       // course progress tracking
        };

        localStorage.setItem("nexoraUser", JSON.stringify(user));

        window.location.href = "loading.html";
    });
}


// ===========================
// LOGIN LOGIC
// ===========================
const loginForm = document.getElementById("loginForm");

if (loginForm) {
    loginForm.addEventListener("submit", function(e) {
        e.preventDefault();

        const email = loginForm.querySelector("input[type='email']").value;
        const password = loginForm.querySelector("input[type='password']").value;

        const storedUser = JSON.parse(localStorage.getItem("nexoraUser"));

        if (!storedUser) {
            alert("No account found. Please sign up.");
            return;
        }

        if (email === storedUser.email && password === storedUser.password) {
            window.location.href = "loading.html";
        } else {
            alert("Invalid login credentials.");
        }
    });
}