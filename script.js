/* =========================================================
   Glow & Grace Beauty Studio - script.js
   ---------------------------------------------------------
   1. SITE_CONFIG  (EDIT THIS for every new client)
   2. Apply config to the page
   3. Header, mobile menu & active link
   4. Scroll-reveal animations
   5. Service buttons -> preselect in booking form
   6. Gallery lightbox
   7. Booking form validation + WhatsApp enquiry
   ========================================================= */

/* ---------- 1. SITE CONFIG ----------
   Change the values below to customise the website.
   phone formats:
   - whatsappNumber: country code + number, digits only, NO "+" or spaces
     e.g. India 98765 43210  ->  "919876543210"
*/
const SITE_CONFIG = {
  brandName: "Glow & Grace",
  whatsappNumber: "919999999999",            // <-- replace with the client's WhatsApp number
  displayPhone: "+91 99999 99999",           // shown on the contact section
  email: "hello@glowandgrace.example",
  address: "123 Sample Street, Your City, State 000000",
  instagramUrl: "https://instagram.com/",    // <-- client's Instagram profile link
  // Paste ONLY the src="..." URL from Google Maps > Share > Embed a map. Leave "" to show the placeholder.
  mapEmbedUrl: ""
};

document.documentElement.classList.remove("no-js");

/* ---------- 2. APPLY CONFIG ---------- */
function buildWhatsAppUrl(text) {
  const base = "https://wa.me/" + SITE_CONFIG.whatsappNumber;
  return text ? base + "?text=" + encodeURIComponent(text) : base;
}

(function applyConfig() {
  document.querySelectorAll("[data-brand-name]").forEach(el => { el.textContent = SITE_CONFIG.brandName; });

  const defaultMsg = "Hello " + SITE_CONFIG.brandName + " Beauty Studio, I would like to enquire about your services.";
  document.querySelectorAll("[data-whatsapp-link]").forEach(el => { el.href = buildWhatsAppUrl(defaultMsg); });

  document.querySelectorAll("[data-phone-link]").forEach(el => {
    el.href = "tel:+" + SITE_CONFIG.whatsappNumber;
    el.textContent = SITE_CONFIG.displayPhone;
  });
  document.querySelectorAll("[data-email-link]").forEach(el => {
    el.href = "mailto:" + SITE_CONFIG.email;
    el.textContent = SITE_CONFIG.email;
  });
  document.querySelectorAll("[data-address]").forEach(el => { el.textContent = SITE_CONFIG.address; });
  document.querySelectorAll("[data-instagram-link]").forEach(el => { el.href = SITE_CONFIG.instagramUrl; });

  if (SITE_CONFIG.mapEmbedUrl) {
    const box = document.getElementById("mapBox");
    if (box) {
      const frame = document.createElement("iframe");
      frame.src = SITE_CONFIG.mapEmbedUrl;
      frame.title = "Salon location on Google Maps";
      frame.loading = "lazy";
      frame.referrerPolicy = "no-referrer-when-downgrade";
      frame.setAttribute("allowfullscreen", "");
      box.replaceChildren(frame);
    }
  }

  const year = document.getElementById("year");
  if (year) year.textContent = new Date().getFullYear();
})();

/* ---------- 3. HEADER, MOBILE MENU, ACTIVE LINK ---------- */
(function navigation() {
  const header = document.getElementById("header");
  const toggle = document.getElementById("navToggle");
  const menu = document.getElementById("navMenu");
  const links = document.querySelectorAll(".nav-link");

  const backdrop = document.createElement("div");
  backdrop.className = "nav-backdrop";
  document.body.appendChild(backdrop);

  function setMenu(open) {
    menu.classList.toggle("open", open);
    backdrop.classList.toggle("show", open);
    header.classList.toggle("menu-open", open);
    toggle.setAttribute("aria-expanded", String(open));
    toggle.setAttribute("aria-label", open ? "Close menu" : "Open menu");
    document.body.style.overflow = open ? "hidden" : "";
  }

  toggle.addEventListener("click", () => setMenu(!menu.classList.contains("open")));
  backdrop.addEventListener("click", () => setMenu(false));
  menu.querySelectorAll("a").forEach(a => a.addEventListener("click", () => setMenu(false)));
  document.addEventListener("keydown", e => { if (e.key === "Escape") setMenu(false); });
  window.addEventListener("resize", () => { if (window.innerWidth > 880) setMenu(false); });

  function onScroll() {
    header.classList.toggle("scrolled", window.scrollY > 40);
  }
  onScroll();
  window.addEventListener("scroll", onScroll, { passive: true });

  // Highlight the nav link of the section currently in view
  const sections = Array.from(links)
    .map(l => document.querySelector(l.getAttribute("href")))
    .filter(Boolean);
  if ("IntersectionObserver" in window) {
    const spy = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          links.forEach(l => l.classList.toggle("active", l.getAttribute("href") === "#" + entry.target.id));
        }
      });
    }, { rootMargin: "-45% 0px -50% 0px" });
    sections.forEach(s => spy.observe(s));
  }
})();

/* ---------- 4. SCROLL-REVEAL ANIMATIONS ---------- */
(function reveal() {
  const items = document.querySelectorAll(".reveal");
  if (!("IntersectionObserver" in window)) {
    items.forEach(i => i.classList.add("visible"));
    return;
  }
  const io = new IntersectionObserver((entries, obs) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible");
        obs.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });
  items.forEach((el, i) => {
    el.style.transitionDelay = (i % 4) * 90 + "ms";
    io.observe(el);
  });
})();

/* ---------- 5. SERVICE BUTTONS -> BOOKING FORM ---------- */
function selectServiceAndScroll(serviceName) {
  const select = document.getElementById("service");
  if (select && serviceName) {
    const exists = Array.from(select.options).some(o => o.value === serviceName || o.text === serviceName);
    if (exists) {
      select.value = serviceName;
      select.dispatchEvent(new Event("change"));
    }
  }
}

document.querySelectorAll("[data-service]").forEach(btn => {
  btn.addEventListener("click", () => {
    selectServiceAndScroll(btn.dataset.service);
    document.getElementById("booking").scrollIntoView({ behavior: "smooth" });
    setTimeout(() => document.getElementById("name").focus({ preventScroll: true }), 700);
  });
});

// Footer service links jump to services and keep the page anchor working
document.querySelectorAll("[data-service-link]").forEach(a => {
  a.addEventListener("click", () => selectServiceAndScroll(a.dataset.serviceLink));
});

/* ---------- 6. GALLERY LIGHTBOX ---------- */
(function lightbox() {
  const box = document.getElementById("lightbox");
  const img = document.getElementById("lightboxImg");
  const cap = document.getElementById("lightboxCaption");
  const closeBtn = document.getElementById("lightboxClose");
  const prevBtn = document.getElementById("lightboxPrev");
  const nextBtn = document.getElementById("lightboxNext");
  const items = Array.from(document.querySelectorAll(".gallery-item"));
  let index = 0;
  let lastFocus = null;

  function show(i) {
    index = (i + items.length) % items.length;
    const it = items[index];
    img.src = it.dataset.full;
    img.alt = it.dataset.alt || "";
    cap.textContent = it.dataset.alt || "";
  }
  function open(i) {
    lastFocus = document.activeElement;
    show(i);
    box.hidden = false;
    document.body.style.overflow = "hidden";
    closeBtn.focus();
  }
  function close() {
    box.hidden = true;
    document.body.style.overflow = "";
    if (lastFocus) lastFocus.focus();
  }

  items.forEach((it, i) => it.addEventListener("click", () => open(i)));
  closeBtn.addEventListener("click", close);
  prevBtn.addEventListener("click", () => show(index - 1));
  nextBtn.addEventListener("click", () => show(index + 1));
  box.addEventListener("click", e => { if (e.target === box) close(); });
  document.addEventListener("keydown", e => {
    if (box.hidden) return;
    if (e.key === "Escape") close();
    if (e.key === "ArrowLeft") show(index - 1);
    if (e.key === "ArrowRight") show(index + 1);
  });
})();

/* ---------- 7. BOOKING FORM ---------- */
(function bookingForm() {
  const form = document.getElementById("bookingForm");
  const status = document.getElementById("formStatus");
  const dateInput = document.getElementById("date");

  // Block past dates in the date picker
  const today = new Date();
  today.setMinutes(today.getMinutes() - today.getTimezoneOffset());
  const todayStr = today.toISOString().split("T")[0];
  dateInput.min = todayStr;

  const rules = {
    name(v) {
      if (!v.trim()) return "Please enter your name.";
      if (v.trim().length < 2) return "Name must be at least 2 characters.";
      if (!/^[\p{L}\s.'-]+$/u.test(v.trim())) return "Name can only contain letters and spaces.";
      return "";
    },
    phone(v) {
      const digits = v.replace(/[\s()+-]/g, "");
      if (!digits) return "Please enter your phone number.";
      if (!/^\d+$/.test(digits)) return "Phone number can only contain digits.";
      // Accepts 10-digit Indian mobile numbers, optionally with 91 / 0 prefix
      const local = digits.replace(/^(91|0)(?=\d{10}$)/, "");
      if (!/^[6-9]\d{9}$/.test(local)) return "Enter a valid 10-digit mobile number.";
      return "";
    },
    email(v) {
      if (!v.trim()) return "Please enter your email address.";
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v.trim())) return "Enter a valid email address.";
      return "";
    },
    service(v) { return v ? "" : "Please choose a service."; },
    date(v) {
      if (!v) return "Please choose a preferred date.";
      if (v < todayStr) return "Please choose today or a future date.";
      return "";
    },
    time(v) { return v ? "" : "Please choose a preferred time."; }
  };

  function validateField(id) {
    const input = document.getElementById(id);
    const msg = rules[id](input.value);
    const field = input.closest(".field");
    const err = document.getElementById(id + "Error");
    err.textContent = msg;
    field.classList.toggle("invalid", Boolean(msg));
    input.setAttribute("aria-invalid", msg ? "true" : "false");
    return !msg;
  }

  Object.keys(rules).forEach(id => {
    const input = document.getElementById(id);
    input.addEventListener("blur", () => validateField(id));
    input.addEventListener("input", () => {
      if (input.closest(".field").classList.contains("invalid")) validateField(id);
    });
    input.addEventListener("change", () => validateField(id));
  });

  function formatDate(str) {
    const [y, m, d] = str.split("-").map(Number);
    return new Date(y, m - 1, d).toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" });
  }
  function formatTime(str) {
    const [h, m] = str.split(":").map(Number);
    const suffix = h >= 12 ? "PM" : "AM";
    return ((h % 12) || 12) + ":" + String(m).padStart(2, "0") + " " + suffix;
  }

  form.addEventListener("submit", e => {
    e.preventDefault();
    status.className = "form-status";
    status.textContent = "";

    const valid = Object.keys(rules).map(validateField).every(Boolean);
    if (!valid) {
      const firstBad = form.querySelector(".field.invalid input, .field.invalid select");
      if (firstBad) firstBad.focus();
      status.classList.add("fail");
      status.textContent = "Please fix the highlighted fields and try again.";
      return;
    }

    const v = id => document.getElementById(id).value.trim();
    const message = [
      "Hello " + SITE_CONFIG.brandName + " Beauty Studio,",
      "I would like to enquire about an appointment.",
      "",
      "Name: " + v("name"),
      "Phone: " + v("phone"),
      "Email: " + v("email"),
      "Service: " + v("service"),
      "Preferred date: " + formatDate(v("date")),
      "Preferred time: " + formatTime(v("time")),
      v("message") ? "Message: " + v("message") : ""
    ].filter((line, i, arr) => line !== "" || (i > 0 && arr[i - 1] !== "")).join("\n");

    const url = buildWhatsAppUrl(message);
    const win = window.open(url, "_blank", "noopener");

    status.classList.add("success");
    status.textContent = win
      ? "Your enquiry is ready in WhatsApp. Press send there. Your appointment is confirmed only after the salon replies."
      : "Your browser blocked the pop-up. Please allow pop-ups and press the button again.";
    if (!win) { status.classList.remove("success"); status.classList.add("fail"); }
    else { form.reset(); form.querySelectorAll(".invalid").forEach(f => f.classList.remove("invalid")); }
  });
})();
