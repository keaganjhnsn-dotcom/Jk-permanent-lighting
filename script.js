const form = document.getElementById("estimateForm");
const status = document.getElementById("formStatus");
const menuToggle = document.querySelector(".menu-toggle");
const mobileMenu = document.querySelector(".mobile-menu");

function closeMenu() {
  menuToggle?.setAttribute("aria-expanded", "false");
  mobileMenu?.classList.remove("open");
  mobileMenu?.setAttribute("aria-hidden", "true");
  document.body.classList.remove("menu-open");
}

menuToggle?.addEventListener("click", () => {
  const open = menuToggle.getAttribute("aria-expanded") === "true";
  menuToggle.setAttribute("aria-expanded", String(!open));
  mobileMenu?.classList.toggle("open", !open);
  mobileMenu?.setAttribute("aria-hidden", String(open));
  document.body.classList.toggle("menu-open", !open);
});

document.querySelectorAll('a[href^="#"]').forEach(link => {
  link.addEventListener("click", () => {
    const target = document.querySelector(link.getAttribute("href"));
    if (target) {
      closeMenu();
      setTimeout(() => target.scrollIntoView({ behavior: "smooth", block: "start" }), 0);
    }
  });
});

form?.addEventListener("submit", async event => {
  event.preventDefault();

  if (form.action.includes("REPLACE_WITH_YOUR_FORM_ID")) {
    status.textContent = "The estimate form is ready — connect your Formspree endpoint to start receiving requests.";
    status.scrollIntoView({ behavior: "smooth", block: "center" });
    return;
  }

  const button = form.querySelector("button[type='submit']");
  const original = button.innerHTML;
  button.disabled = true;
  button.innerHTML = "SENDING…";
  status.textContent = "";

  try {
    const response = await fetch(form.action, {
      method: "POST",
      body: new FormData(form),
      headers: { Accept: "application/json" }
    });

    if (response.ok) {
      form.reset();
      status.textContent = "Thank you — your estimate request has been sent. J&K will be in touch.";
    } else {
      status.textContent = "Something went wrong. Please call or text 806-206-4615.";
    }
  } catch (error) {
    status.textContent = "Something went wrong. Please call or text 806-206-4615.";
  } finally {
    button.disabled = false;
    button.innerHTML = original;
  }
});

document.querySelectorAll("details").forEach(detail => {
  detail.addEventListener("toggle", () => {
    if (detail.open) {
      document.querySelectorAll("details[open]").forEach(other => {
        if (other !== detail) other.removeAttribute("open");
      });
    }
  });
});

// Add a subtle reveal effect without a dependency.
const revealItems = document.querySelectorAll(".intro-grid, .feature-content, .occasion-grid article, .gallery-card, .process-grid article, .estimate-form, .faq-list");
const observer = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add("is-visible");
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.08 });
revealItems.forEach(item => observer.observe(item));
