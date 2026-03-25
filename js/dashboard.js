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
user.payments = user.payments || {};
// Fix old payments before new system update
user.paidCourses.forEach(courseId => {

    if(!user.payments[courseId]){

        user.payments[courseId] = {
            package: "basic",
            total: 300000,
            paid: 300000,
            installments: 3
        }

    }

});
localStorage.setItem("nexoraUser", JSON.stringify(user));


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
// PACKAGE DATABASE
// ==============================

const packagesDB = [
{
id:"basic",
name:"Basic Package",
price:300000,
installments:2,
items:["Certification of Completion"]
},
{
id:"standard",
name:"Standard Package",
price:600000,
installments:4,
items:["Laptop","Certification of Completion"]
},
{
id:"premium",
name:"premium Package",
price:1000000,
installments:5,
items:["Laptop","Internet Router","Headphones","Certification of Completion"]
},
{
id:"golden",
name:"Golden Package",
price:2000000,
installments:5,
items:["Generator","Laptop","Internet Router","Headphones","Certification of Completion"]
}
];

// ==============================
// COURSE DATABASE
// ==============================
const coursesDB = [
{
    id: "fullstack",
    title: "Full Stack Development",
    duration: "4 Months",
    price: 300000,
    level: "Advanced",
    description: "Become a complete developer mastering frontend, backend, databases and deployment.",
    skills: ["HTML, CSS, JS", "React", "Node.js", "APIs", "MongoDB", "Deployment"]
},
{
    id: "frontend",
    title: "Frontend Development",
    duration: "4 Months",
    price: 300000,
    level: "Beginner",
    description: "Master modern UI engineering and responsive web design.",
    skills: ["HTML5", "CSS3", "JavaScript", "React", "Responsive Design"]
},
{
    id: "backend",
    title: "Backend Development",
    duration: "4 Months",
    price: 300000,
    level: "Intermediate",
    description: "Build scalable APIs and secure server systems.",
    skills: ["Node.js", "Express", "Authentication", "Databases"]
},
{
    id: "video",
    title: "Video Editing & Production",
    duration: "3 Months",
    price: 300000,
    level: "Beginner",
    description: "Learn professional video editing, shooting techniques, lighting setup and visual storytelling using industry-standard tools.",
    skills: [
        "Camera Angles & Shooting Techniques",
        "Lighting Setup",
        "CapCut Editing",
        "Adobe Premiere Pro",
        "DaVinci Resolve",
        "Basic Visual Effects"
    ]
},
{
    id: "data",
    title: "Data Analysis",
    duration: "4 Months",
    price: 300000,
    level: "Beginner",
    description: "Learn how to analyze, visualize and interpret data to make smart business decisions.",
    skills: ["Excel", "SQL", "Python", "Data Visualization", "Power BI"]
},

{
    id: "cyber",
    title: "Cyber Security",
    duration: "4 Months",
    price: 300000,
    level: "Advanced",
    description: "Learn ethical hacking and modern network defense.",
    skills: ["Pen Testing", "Network Security", "Threat Detection"]
},
{
    id: "game",
    title: "Game Development",
    duration: "4 Months",
    price: 300000,
    level: "Intermediate",
    description: "Create immersive 2D & 3D games using modern engines.",
    skills: ["Unity", "C#", "Game Physics", "3D Environments"]
},
{
    id: "marketing",
    title: "Digital Marketing",
    duration: "3 Months",
    price: 300000,
    level: "Beginner",
    description: "Master online growth and digital advertising.",
    skills: ["SEO", "Ads", "Analytics", "Content Strategy"]
},
{
    id: "uiux",
    title: "UI/UX Design",
    duration: "4 Months",
    price: 300000,
    level: "Beginner",
    description: "Design intuitive digital experiences.",
    skills: ["Figma", "User Research", "Wireframing", "Prototyping"]
},
{
    id: "3d",
    title: "3D Modeling & Animation",
    duration: "4 Months",
    price: 300000,
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

                ${
                user.paidCourses.includes(course.id)
                ?
                `<button class="purchase-btn disabled-btn">
                <i class="fa-solid fa-circle-check"></i>
                Enrolled
                </button>`
                :
                `<button onclick="openCourseModal('${course.id}')" class="course-btn">
                <i class="fa-solid fa-circle-info"></i>
                View Details
                </button>`
                }
            </div>
        `;
    });

    html += "</div>";
    contentArea.innerHTML = html;
}

// ==============================
// MY COURSES
// ==============================
function renderMyCourses(){

if (user.paidCourses.length === 0) {
contentArea.innerHTML = `
<p>
<i class="fa-solid fa-circle-info"></i>
You have not enrolled in any courses yet.
</p>`;
return;
}

let html = `<h2><i class="fa-solid fa-graduation-cap"></i> My Courses</h2>
<div class="grid">`;

user.paidCourses.forEach(id => {

const course = coursesDB.find(c => c.id === id);
const progress = user.progress[id] || 0;

const payment = user.payments[id];

const paid = payment ? payment.paid : 0;
const total = payment ? payment.total : 0;
const installments = payment ? payment.installments : 1;

const percent = total ? Math.floor((paid / total) * 100) : 0;

const installmentAmount = Math.ceil(total / installments)

const paidInstallments = Math.floor(paid / installmentAmount)

let ledgerRows = ""

for(let i=1;i<=installments;i++){

const status = i <= paidInstallments ? "Paid" : "Pending"

ledgerRows += `
<tr>
<td>${i}</td>
<td>${formatCurrency(installmentAmount)}</td>
<td class="${status==="Paid" ? "paid-ledger":"pending-ledger"}">
${status}
</td>
</tr>
`

}

const remaining = total - paid

html += `

<div class="course-card">

<h3>
<i class="fa-solid fa-book-open"></i>
${course.title}
</h3>

<p>
<i class="fa-solid fa-chart-simple"></i>
Course Progress: ${progress}%
</p>

<div class="progress-bar">
<div class="progress-fill" style="width:${progress}%"></div>
</div>

<hr style="margin:15px 0;opacity:0.2">

<p>
<i class="fa-solid fa-money-bill-wave"></i>
Payment Progress: ${percent}%
</p>

<div class="progress-bar">
<div class="progress-fill" style="width:${percent}%"></div>
</div>

<p style="margin-top:10px;">
Paid: <strong>${formatCurrency(paid)}</strong>
</p>

<p>
Remaining: <strong>${formatCurrency(remaining)}</strong>
</p>

<hr style="margin:15px 0;opacity:0.2">

<h4>
<i class="fa-solid fa-file-invoice"></i>
Payment Ledger
</h4>

<table class="ledger-table">

<thead>
<tr>
<th>Installment</th>
<th>Amount</th>
<th>Status</th>
</tr>
</thead>

<tbody>
${ledgerRows}
</tbody>

</table>

${
remaining > 0
? `
<button onclick="continuePayment('${id}')"
class="course-btn">
<i class="fa-solid fa-credit-card"></i>
Continue Payment
</button>
`
: `
<p style="color:#00c6ff;font-weight:600;margin-top:10px;">
<i class="fa-solid fa-circle-check"></i>
Fully Paid
</p>
`
}

</div>
`

})

html += "</div>"
contentArea.innerHTML = html

}
function continuePayment(courseId){

const payment = user.payments[courseId]

const remaining = payment.total - payment.paid

const installmentAmount = Math.ceil(payment.total / payment.installments)

const amount = remaining < installmentAmount ? remaining : installmentAmount

payWithPaystack(courseId, payment.package, amount)

}

function canGraduate(courseId){

const payment=user.payments[courseId]

if(!payment) return false

return payment.paid>=payment.total

}

// ==============================
// MODAL
// ==============================
function openCourseModal(id) {

    const course = coursesDB.find(c => c.id === id);

    let skillsHTML = course.skills.map(s => `<li>${s}</li>`).join("");

    let packagesHTML = packagesDB.map(pkg => {

        let itemsHTML = pkg.items.map(i => `<li>${i}</li>`).join("");

        return `
        <div class="package-option">

            <h3>
                <i class="fa-solid fa-box"></i>
                ${pkg.name}
            </h3>

            <p class="package-price">
                ${formatCurrency(pkg.price)}
            </p>

            <ul class="package-items">
                ${itemsHTML}
            </ul>

            <button onclick="startPayment('${id}','${pkg.id}')"
                class="purchase-btn">
                <i class="fa-solid fa-credit-card"></i>
                Select Package
            </button>

        </div>
        `;
    }).join("");

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

        <h4 style="margin-top:20px;">
            <i class="fa-solid fa-list-check"></i>
            What You'll Learn
        </h4>

        <ul>${skillsHTML}</ul>

        <h3 style="margin-top:30px;">
            Choose Your Package
        </h3>

        <div class="packages-grid">
            ${packagesHTML}
        </div>

    </div>
    `;

    modal.querySelector(".close-modal").onclick = () => modal.remove();

    modal.onclick = (e) => {
        if (e.target === modal) modal.remove();
    };

    document.body.appendChild(modal);
}

function startPayment(courseId, packageId){

const pkg = packagesDB.find(p => p.id === packageId)

const installmentAmount = Math.ceil(pkg.price / pkg.installments)

const modal = document.createElement("div")
modal.classList.add("course-modal")

modal.innerHTML = `
<div class="modal-content payment-modal">

<h2>
<i class="fa-solid fa-credit-card"></i>
Choose Payment Option
</h2>

<p class="payment-course">
${pkg.name}
</p>

<div class="payment-options">

<label class="payment-option">
<input type="radio" name="paymentType" value="full" checked>
<span>Pay Full</span>
<p class="payment-price">${formatCurrency(pkg.price)}</p>
</label>

<label class="payment-option">
<input type="radio" name="paymentType" value="installment">
<span>Installment Plan</span>
</label>

</div>

<div id="installmentDetails" class="installment-details" style="display:none;">

<p>
Installments: <strong>${pkg.installments}</strong>
</p>

<p>
Amount Per Payment:
<strong>${formatCurrency(installmentAmount)}</strong>
</p>

<select id="installmentSelect">

<option value="${installmentAmount}">
Pay Installment (${formatCurrency(installmentAmount)})
</option>

</select>

<div class="tos">

<label>
<input type="checkbox" id="tosCheck">
I agree to the payment terms. Course completion requires full payment.
</label>

</div>

</div>

<div class="modal-actions">

<button id="continuePayment" class="purchase-btn">
<i class="fa-solid fa-arrow-right"></i>
Continue Payment
</button>

</div>

<span class="close-modal">&times;</span>

</div>
`

document.body.appendChild(modal)

const radioButtons = modal.querySelectorAll('input[name="paymentType"]')
const installmentBox = modal.querySelector("#installmentDetails")

radioButtons.forEach(r => {
r.addEventListener("change", () => {

if(r.value === "installment"){
installmentBox.style.display = "block"
}else{
installmentBox.style.display = "none"
}

})
})

modal.querySelector("#continuePayment").onclick = () => {

const paymentType = modal.querySelector('input[name="paymentType"]:checked').value

if(paymentType === "installment"){

const tos = modal.querySelector("#tosCheck").checked

if(!tos){
alert("You must agree to the payment terms.")
return
}

payWithPaystack(courseId, packageId, installmentAmount)

}else{

payWithPaystack(courseId, packageId, pkg.price)

}

modal.remove()

}

modal.querySelector(".close-modal").onclick = () => modal.remove()

}

function completePurchase(courseId, packageName, reference) {

    if (!user.paidCourses.includes(courseId)) {

        user.paidCourses.push(courseId);
        user.progress[courseId] = 0;

        user.notifications = user.notifications || [];

        user.notifications.unshift({
            message: `Purchased ${packageName} for ${
                coursesDB.find(c => c.id === courseId).title
            }`,
            date: new Date().toLocaleString(),
            reference: reference
        });

        localStorage.setItem("nexoraUser", JSON.stringify(user));
    }

    document.querySelector(".course-modal")?.remove();

    updateStudentStatus();
    loadPage("home");
}

function payWithPaystack(courseId, packageId, amount){

const course = coursesDB.find(c=>c.id===courseId)
const pkg = packagesDB.find(p=>p.id===packageId)

let handler = PaystackPop.setup({

key:"pk_live_ba580dd3ff1099056c22c54e68a3b80bc48b7772",
email:user.email,
amount:amount*100,
currency:"NGN",

callback:function(response){

recordPayment(courseId,packageId,amount,response.reference)

},

onClose:function(){

alert("Transaction cancelled")

}

})

handler.openIframe()

}

function recordPayment(courseId, packageId, amount, reference){

const pkg = packagesDB.find(p => p.id === packageId)
const course = coursesDB.find(c => c.id === courseId)

// create payment record if first payment
if(!user.payments[courseId]){

user.payments[courseId] = {
package: packageId,
total: pkg.price,
paid: 0,
installments: pkg.installments
}

}

// add payment
user.payments[courseId].paid += amount

if(user.payments[courseId].paid > pkg.price){
user.payments[courseId].paid = pkg.price
}

const payment = user.payments[courseId]

// ENROLL STUDENT AFTER FIRST PAYMENT
if(!user.paidCourses.includes(courseId)){

user.paidCourses.push(courseId)
user.progress[courseId] = 0

}

// NOTIFICATIONS
user.notifications = user.notifications || []

user.notifications.unshift({

message:`Payment received ${formatCurrency(amount)} for ${course.title}`,
date:new Date().toLocaleString(),
reference:reference

})

// SAVE DATA
localStorage.setItem("nexoraUser", JSON.stringify(user))

// PAYMENT SUMMARY
const remaining = payment.total - payment.paid

showPaymentSuccess(course.title, payment.paid, remaining)

updateStudentStatus()

loadPage("myCourses")

}

function showPaymentSuccess(courseTitle, paid, remaining){

const modal = document.createElement("div")
modal.classList.add("course-modal")

modal.innerHTML = `

<div class="modal-content payment-success">

<div class="success-icon">
<i class="fa-solid fa-circle-check"></i>
</div>

<h2>Payment Successful</h2>

<p class="success-course">
${courseTitle}
</p>

<div class="payment-summary">

<div>
<span>Total Paid</span>
<strong>${formatCurrency(paid)}</strong>
</div>

<div>
<span>Remaining</span>
<strong>${formatCurrency(remaining)}</strong>
</div>

</div>

<p class="success-message">
${remaining <= 0 
? "You have fully paid and can graduate after completing the course."
: "You are now enrolled. Complete all installments before graduation."
}
</p>

<button class="purchase-btn close-success">
Go to My Courses
</button>

</div>
`

document.body.appendChild(modal)

modal.querySelector(".close-success").onclick = () => {

modal.remove()
loadPage("myCourses")

}

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
// ==============================
// LOGOUT FUNCTION
// ==============================

const logoutBtn = document.getElementById("logoutBtn");

if (logoutBtn) {
    logoutBtn.addEventListener("click", (e) => {
        e.preventDefault();

        // Remove user session
        localStorage.removeItem("nexoraUser");

        // Optional: smooth fade out
        document.body.style.opacity = "0";
        document.body.style.transition = "0.3s ease";

        setTimeout(() => {
            window.location.href = "index.html"; // landing page
        }, 300);
    });
}
