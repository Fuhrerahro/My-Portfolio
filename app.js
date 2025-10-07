// ===============================
// 📧 EMAILJS CONFIGURATION
// ===============================
const SERVICE_ID = "service_onkyr7u";
const TEMPLATE_ID = "template_pjo3v3d";
const PUBLIC_KEY = "blj9x2KhmaqUQsKeW";

// ===============================
// 🔔 POPUP ALERTS
// ===============================
function showPopup(message, type = "info") {
  const popup = document.createElement("div");
  popup.className = `popup ${type}`;
  popup.textContent = message;
  document.body.appendChild(popup);

  requestAnimationFrame(() => popup.classList.add("visible"));

  setTimeout(() => popup.classList.remove("visible"), 3200);
  setTimeout(() => popup.remove(), 3800);
}

// ===============================
// 🕒 WAIT FOR EMAILJS TO LOAD
// ===============================
async function waitForEmailJSLib(timeout = 3000) {
  return new Promise((resolve, reject) => {
    if (window.emailjs) return resolve();

    let elapsed = 0;
    const interval = setInterval(() => {
      elapsed += 100;
      if (window.emailjs) {
        clearInterval(interval);
        resolve();
      } else if (elapsed >= timeout) {
        clearInterval(interval);
        reject(
          new Error("❌ EmailJS not found. Ensure script is loaded before app.js.")
        );
      }
    }, 100);
  });
}

// ===============================
// ⚙️ INITIALIZE EMAILJS
// ===============================
document.addEventListener("DOMContentLoaded", async () => {
  try {
    await waitForEmailJSLib();
    emailjs.init(PUBLIC_KEY);
    console.log("✅ EmailJS initialized successfully");
  } catch (err) {
    console.error(err);
    showPopup("⚠️ Email service failed to initialize.", "error");
  }
});

// ===============================
// 🌓 THEME TOGGLE SYSTEM
// ===============================
const root = document.documentElement;
const themeToggle = document.getElementById("themeToggle");

function applyTheme(mode) {
  const isLight = mode === "light";
  root.setAttribute("data-theme", mode);
  document.body.style.transition = "background 0.4s, color 0.4s";

  root.style.setProperty("--bg", isLight ? "#f8f9fc" : "#0d1117");
  root.style.setProperty("--text", isLight ? "#111827" : "#e6edf3");
  root.style.setProperty("--card-bg", isLight ? "#ffffff" : "rgba(255,255,255,0.05)");
  root.style.setProperty("--glow", isLight ? "rgba(99,102,241,0.15)" : "rgba(99,102,241,0.35)");
  root.style.setProperty("--accent", "#6366f1");

  if (themeToggle) {
    themeToggle.textContent = isLight ? "🌙 Dark Mode" : "☀️ Light Mode";
  }

  localStorage.setItem("theme", mode);
}

// Apply saved theme or fallback to dark
applyTheme(localStorage.getItem("theme") === "light" ? "light" : "dark");

themeToggle?.addEventListener("click", () => {
  const newTheme = root.getAttribute("data-theme") === "light" ? "dark" : "light";
  applyTheme(newTheme);
});

// ===============================
// 🧩 PROJECT FILTER
// ===============================
const filterSelect = document.getElementById("filter");
const projectsGrid = document.getElementById("projectsGrid");

if (filterSelect && projectsGrid) {
  filterSelect.addEventListener("change", () => {
    const filterValue = filterSelect.value;
    const cards = projectsGrid.querySelectorAll(".project-card");

    cards.forEach((card) => {
      const matches = filterValue === "all" || card.classList.contains(filterValue);
      card.style.transition = "opacity 0.25s ease, transform 0.25s ease";
      card.style.opacity = matches ? "1" : "0";
      card.style.transform = matches ? "scale(1)" : "scale(0.97)";
      setTimeout(() => (card.style.display = matches ? "block" : "none"), 250);
    });
  });
}

// ===============================
// 🎬 SCROLL FADE-IN ANIMATION
// ===============================
const fadeEls = document.querySelectorAll(".fade-in, .fade-in-up, .fade-in-down");

if (fadeEls.length) {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.15 }
  );

  fadeEls.forEach((el) => observer.observe(el));
}

// ===============================
// 📬 CONTACT FORM HANDLER
// ===============================
const contactForm = document.getElementById("contactForm");

async function handleSubmit(e) {
  e.preventDefault();

  const form = e.target;
  const submitBtn = form.querySelector('button[type="submit"]');

  const name = form.name?.value.trim();
  const email = form.email?.value.trim();
  const subject = form.subject?.value.trim() || "Portfolio Message";
  const message = form.message?.value.trim();

  if (!name || !email || !message) {
    showPopup("⚠️ Please fill in all required fields.", "error");
    return;
  }

  submitBtn.disabled = true;
  submitBtn.textContent = "Sending...";

  try {
    await waitForEmailJSLib();

    const params = { from_name: name, from_email: email, subject, message };
    const result = await emailjs.send(SERVICE_ID, TEMPLATE_ID, params);

    console.log("✅ Email sent:", result);
    showPopup("✅ Message sent successfully!", "success");
    form.reset();
  } catch (err) {
    console.error("❌ EmailJS Error:", err);
    showPopup(`❌ Failed to send: ${err.text || err.message}`, "error");
  } finally {
    submitBtn.disabled = false;
    submitBtn.textContent = "Send message";
  }
}

if (contactForm) contactForm.addEventListener("submit", handleSubmit);

// ===============================
// 👤 COLLAPSIBLE INFO SECTION
// ===============================
const toggleBtn = document.querySelector(".toggle-info");
const infoPanel = document.getElementById("infoPanel");

if (toggleBtn && infoPanel) {
  toggleBtn.addEventListener("click", () => {
    const collapsed = infoPanel.classList.toggle("collapsed");
    toggleBtn.textContent = collapsed ? "👤 View Details" : "🔽 Hide Details";
  });
}
