// ==============================
// AUTH CHECK
// ==============================
let user = JSON.parse(localStorage.getItem("nexoraUser"));
if (!user) window.location.href = "login.html";

if (!user.dateJoined) {
    user.dateJoined = new Date().toLocaleDateString();
    localStorage.setItem("nexoraUser", JSON.stringify(user));
}
// ==============================
// PROFILE ICON SETUP
// ==============================

const profileIcon = document.getElementById("profileIcon");

function renderProfileIcon() {

    if (user.avatar) {
        profileIcon.innerHTML = `
            <img src="${user.avatar}" class="topbar-avatar">
        `;
    } else {
        profileIcon.innerHTML = `
            <i class="fa fa-user-circle"></i>
        `;
    }
}

renderProfileIcon();


// Click redirects to profile page
profileIcon.addEventListener("click", () => {

    // Activate profile nav link visually
    document.querySelectorAll(".nav-link").forEach(l => l.classList.remove("active"));

    const profileLink = document.querySelector('[data-page="profile"]');
    if (profileLink) profileLink.classList.add("active");

    loadPage("profile");
});

function getNotificationCount() {
    return user.notifications ? user.notifications.length : 0;
}

function formatCurrency(amount) {
    return new Intl.NumberFormat('en-NG', {
        style: 'currency',
        currency: 'NGN'
    }).format(amount);
}
// Ensure structure exists
user.paidCourses = user.paidCourses || [];
user.progress = user.progress || {};


document.getElementById("welcomeText").innerText =
    "Welcome, " + user.name;

function updateStudentStatus() {

    const statusBadge = document.getElementById("studentStatus");
    const isActive = user.paidCourses.length > 0;

    statusBadge.innerText = isActive
        ? "Active Student"
        : "Not Enrolled";

    statusBadge.style.background = isActive
        ? "#00c6ff"
        : "#555";
}
updateStudentStatus();
// ==============================
// SIDEBAR TOGGLE
// ==============================
const sidebar = document.getElementById("sidebar");
const hamburger = document.getElementById("hamburger");

hamburger.addEventListener("click", () => {
    sidebar.classList.toggle("active");
});

// ==============================
// COURSE DATABASE
// ==============================
const coursesDB = [
{
    id: "fullstack",
    title: "Full Stack Development",
    duration: "4 Months",
    price: 1190,
    level: "Advanced",
    description: "Become a complete developer mastering frontend, backend, databases and deployment.",
    skills: ["HTML, CSS, JS", "React", "Node.js", "APIs", "MongoDB", "Deployment"]
},
{
    id: "frontend",
    title: "Frontend Development",
    duration: "4 Months",
    price: 2990,
    level: "Beginner",
    description: "Master modern UI engineering and responsive web design.",
    skills: ["HTML5", "CSS3", "JavaScript", "React", "Responsive Design"]
},
{
    id: "backend",
    title: "Backend Development",
    duration: "4 Months",
    price: 3490,
    level: "Intermediate",
    description: "Build scalable APIs and secure server systems.",
    skills: ["Node.js", "Express", "Authentication", "Databases"]
},
{
    id: "cyber",
    title: "Cyber Security",
    duration: "4 Months",
    price: 3990,
    level: "Advanced",
    description: "Learn ethical hacking and modern network defense.",
    skills: ["Pen Testing", "Network Security", "Threat Detection"]
},
{
    id: "game",
    title: "Game Development",
    duration: "4 Months",
    price: 4490,
    level: "Intermediate",
    description: "Create immersive 2D & 3D games using modern engines.",
    skills: ["Unity", "C#", "Game Physics", "3D Environments"]
},
{
    id: "marketing",
    title: "Digital Marketing",
    duration: "3 Months",
    price: 1990,
    level: "Beginner",
    description: "Master online growth and digital advertising.",
    skills: ["SEO", "Ads", "Analytics", "Content Strategy"]
},
{
    id: "uiux",
    title: "UI/UX Design",
    duration: "4 Months",
    price: 2990,
    level: "Beginner",
    description: "Design intuitive digital experiences.",
    skills: ["Figma", "User Research", "Wireframing", "Prototyping"]
},
{
    id: "3d",
    title: "3D Modeling & Animation",
    duration: "4 Months",
    price: 4490,
    level: "Intermediate",
    description: "Produce professional 3D visuals and animation.",
    skills: ["Blender", "Maya", "Lighting", "Animation"]
}
];

// ==============================
// NAVIGATION
// ==============================
const contentArea = document.getElementById("contentArea");
const navLinks = document.querySelectorAll(".nav-link");

navLinks.forEach(link => {
    link.addEventListener("click", function(e) {
        e.preventDefault();

        navLinks.forEach(l => l.classList.remove("active"));
        this.classList.add("active");

        loadPage(this.dataset.page);

        if (window.innerWidth < 900) {
            sidebar.classList.remove("active");
        }
    });
});

// ==============================
// PAGE LOADER
// ==============================
function loadPage(page) {

    if (page === "home") {

        let totalProgress = 0;
        let count = 0;

        for (let key in user.progress) {
            totalProgress += user.progress[key];
            count++;
        }

        let overall = count ? Math.floor(totalProgress / count) : 0;

        // Recommended / Available Courses
        const availableCourses = coursesDB
            .filter(course => !user.paidCourses.includes(course.id))
            .slice(0, 3);

        let availableHTML = availableCourses.length > 0
            ? availableCourses.map(course => `
                <div class="course-card small">
                    <div style="display:flex;align-items:center;gap:10px;">
                        <i class="fa-solid fa-code"></i>
                        <h4>${course.title}</h4>
                    </div>

                    <p>
                        <i class="fa-regular fa-clock"></i>
                        ${course.duration}
                    </p>

                    <span class="price">
                        <i class="fa-solid fa-naira-sign"></i>
                        ${formatCurrency(course.price)}
                    </span>

                    <button onclick="openCourseModal('${course.id}')"
                        class="course-btn small-btn">
                        <i class="fa-solid fa-eye"></i>
                        View
                    </button>
                </div>
            `).join("")
            : `<p><i class="fa-solid fa-circle-check"></i> You have enrolled in all available courses.</p>`;

        contentArea.innerHTML = `
            <h2><i class="fa-solid fa-chart-line"></i> Dashboard Overview</h2>

            <div class="grid">

                <div class="card">
                    <h3><i class="fa-solid fa-graduation-cap"></i> Enrolled Courses</h3>
                    <p>${user.paidCourses.length}</p>
                </div>

                <div class="card">
                    <h3><i class="fa-solid fa-chart-pie"></i> Overall Progress</h3>
                    <p>${overall}%</p>
                    <div class="progress-bar">
                        <div class="progress-fill"
                            style="width:${overall}%"></div>
                    </div>
                </div>

                <div class="card">
                    <h3><i class="fa-solid fa-bell"></i> Notifications</h3>
                    ${
                        user.notifications && user.notifications.length > 0
                        ? `<ul class="mini-list">
                            ${user.notifications.slice(0,5).map(n => `
                                <li>
                                    <i class="fa-solid fa-circle-check"></i>
                                    ${n.message}
                                    <small style="display:block;color:#666;">
                                        ${n.date}
                                    </small>
                                </li>
                            `).join("")}
                        </ul>`
                        : `<p><i class="fa-solid fa-inbox"></i> No recent activity.</p>`
                    }
                </div>

            </div>

            <h3 style="margin-top:40px;">
                <i class="fa-solid fa-layer-group"></i> Courses Available
            </h3>

            <div class="grid">
                ${availableHTML}
            </div>
        `;
    }

    if (page === "courses") {
        renderCourses();
    }

    if (page === "myCourses") {
        renderMyCourses();
    }

    if (page === "profile") {

        const overallProgress = calculateOverallProgress();

        contentArea.innerHTML = `
            <div class="profile-container">

                <div class="profile-left">
                    <div class="profile-picture-wrapper">
                        <img src="${user.avatar || 'https://via.placeholder.com/150'}" 
                            id="profilePreview"
                            class="profile-picture">

                        <label class="upload-btn">
                            Change Photo
                            <input type="file" id="avatarInput" hidden>
                        </label>
                    </div>

                    <h3>${user.name}</h3>
                    <p class="profile-status">
                        <i class="fa-solid fa-user-check"></i>
                        ${user.paidCourses.length > 0 ? "Active Student" : "Not Enrolled"}
                    </p>
                </div>

                <div class="profile-right">

                    <div class="profile-card">
                        <h4><i class="fa-solid fa-id-card"></i> Account Information</h4>
                        <label>Full Name</label>
                        <input type="text" id="nameInput" value="${user.name}">
                        
                        <label>Email</label>
                        <input type="text" value="${user.email}" disabled>

                        <label>Date Joined</label>
                        <input type="text" value="${user.dateJoined}" disabled>

                        <button onclick="updateProfile()" class="save-btn">
                            Save Changes
                        </button>
                    </div>

                    <div class="profile-card">
                        <h4><i class="fa-solid fa-chart-line"></i> Learning Progress</h4>

                        <p>Courses Enrolled: ${user.paidCourses.length}</p>
                        <p>Overall Progress: ${overallProgress}%</p>

                        <div class="progress-bar">
                            <div class="progress-fill" 
                                style="width:${overallProgress}%"></div>
                        </div>
                    </div>

                </div>
            </div>
        `;

        attachProfileEvents();

    }
}
function calculateOverallProgress() {
    let total = 0;
    let count = 0;

    for (let key in user.progress) {
        total += user.progress[key];
        count++;
    }

    return count ? Math.floor(total / count) : 0;
}

function attachProfileEvents() {

    const avatarInput = document.getElementById("avatarInput");
    const preview = document.getElementById("profilePreview");

    avatarInput.addEventListener("change", function () {
        const file = this.files[0];
        const reader = new FileReader();

        reader.onload = function () {
            preview.src = reader.result;
            user.avatar = reader.result;
            localStorage.setItem("nexoraUser", JSON.stringify(user));
        };

        if (file) reader.readAsDataURL(file);
    });
    renderProfileIcon();
}

function updateProfile() {
    const newName = document.getElementById("nameInput").value;

    user.name = newName;
    localStorage.setItem("nexoraUser", JSON.stringify(user));

    document.getElementById("welcomeText").innerText =
        "Welcome, " + user.name;

    alert("Profile Updated Successfully!");
    renderProfileIcon();
}

// ==============================
// RENDER COURSES
// ==============================
function renderCourses() {

    let html = `<h2>Available Courses</h2><div class="grid">`;

    coursesDB.forEach(course => {

        const purchased = user.paidCourses.includes(course.id);

        html += `
            <div class="course-card">
                <div class="course-top">
                    <span class="course-level ${course.level.toLowerCase()}">
                        ${course.level}
                    </span>
                </div>

                <h3>
                    <i class="fa-solid fa-laptop-code"></i>
                    ${course.title}
                </h3>

                <p class="course-desc">
                    ${course.description}
                </p>

                <div class="course-meta">
                    <span>
                        <i class="fa-regular fa-clock"></i>
                        ${course.duration}
                    </span>
                    <span class="price">
                        <i class="fa-solid fa-naira-sign"></i>
                        ${formatCurrency(course.price)}
                    </span>
                </div>

                <button onclick="openCourseModal('${course.id}')"
                    class="course-btn">
                    <i class="fa-solid fa-circle-info"></i>
                    View Details
                </button>
            </div>
        `;
    });

    html += "</div>";
    contentArea.innerHTML = html;
}

// ==============================
// MY COURSES
// ==============================
function renderMyCourses() {

    if (user.paidCourses.length === 0) {
        contentArea.innerHTML = "<p>You have not enrolled in any courses.</p>";
        return;
    }

    let html = `<h2>My Courses</h2><div class="grid">`;

    user.paidCourses.forEach(id => {

        const course = coursesDB.find(c => c.id === id);
        const progress = user.progress[id] || 0;

        html += `
            <div class="course-card">
                <h3>
                    <i class="fa-solid fa-book-open"></i>
                    ${course.title}
                </h3>

                <p>
                    <i class="fa-solid fa-chart-simple"></i>
                    Progress: ${progress}%
                </p>

                <div class="progress-bar">
                    <div class="progress-fill"
                        style="width:${progress}%"></div>
                </div>
            </div>
        `;
    });

    html += "</div>";
    contentArea.innerHTML = html;
}

// ==============================
// MODAL
// ==============================
function openCourseModal(id) {

    const course = coursesDB.find(c => c.id === id);

    let skillsHTML = course.skills
        .map(skill => `<li>${skill}</li>`)
        .join("");

    const enrolled = user.paidCourses.includes(id);

    const modal = document.createElement("div");
    modal.classList.add("course-modal");

    modal.innerHTML = `
        <div class="modal-content">
            <span class="close-modal">&times;</span>

            <h2>
                <i class="fa-solid fa-layer-group"></i>
                ${course.title}
            </h2>

            <p>${course.description}</p>

            <p>
                <i class="fa-regular fa-clock"></i>
                <strong>Duration:</strong> ${course.duration}
            </p>

            <p>
                <i class="fa-solid fa-naira-sign"></i>
                <strong>Price:</strong> ${formatCurrency(course.price)}
            </p>

            <h4 style="margin-top:20px;">
                <i class="fa-solid fa-list-check"></i>
                What You'll Learn
            </h4>

            <ul>${skillsHTML}</ul>

            ${
                enrolled
                ? `<button class="purchase-btn" disabled>
                        <i class="fa-solid fa-circle-check"></i>
                        Already Enrolled
                </button>`
                : `<button onclick="payWithPaystack('${id}')"
                    class="purchase-btn">
                    <i class="fa-solid fa-credit-card"></i>
                    Purchase Course
                </button>`
            }
        </div>
    `;

    modal.querySelector(".close-modal").onclick = () => modal.remove();

    modal.onclick = (e) => {
        if (e.target === modal) modal.remove();
    };

    document.body.appendChild(modal);
}

function completePurchase(courseId, reference) {

    if (!user.paidCourses.includes(courseId)) {

        user.paidCourses.push(courseId);
        user.progress[courseId] = 0;

        // Save notification
        user.notifications = user.notifications || [];
        user.notifications.unshift({
            message: "Successfully purchased " + 
                     coursesDB.find(c => c.id === courseId).title,
            date: new Date().toLocaleString(),
            reference: reference
        });

        localStorage.setItem("nexoraUser", JSON.stringify(user));
    }

    document.querySelector(".course-modal")?.remove();

    updateStudentStatus();
    renderCourses();
    loadPage("home"); 
    
}

function payWithPaystack(courseId) {

    const course = coursesDB.find(c => c.id === courseId);

    let handler = PaystackPop.setup({
        key: "pk_live_ba580dd3ff1099056c22c54e68a3b80bc48b7772", 
        email: user.email,
        amount: course.price * 100, // kobo
        currency: "NGN",

        callback: function(response) {

            // Payment successful
            completePurchase(courseId, response.reference);
        },

        onClose: function() {
            alert("Transaction cancelled.");
        }
    });

    handler.openIframe();
}
// ==============================
// LOAD DEFAULT PAGE ON REFRESH
// ==============================

document.addEventListener("DOMContentLoaded", () => {

    // Highlight Home link
    document.querySelectorAll(".nav-link").forEach(l => l.classList.remove("active"));

    const homeLink = document.querySelector('[data-page="home"]');
    if (homeLink) homeLink.classList.add("active");

    loadPage("home");
});