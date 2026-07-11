(function () {
  var body = document.body;
  var navToggle = document.querySelector(".nav-toggle");
  var nav = document.querySelector(".site-nav");
  var backToTop = document.querySelector(".back-to-top");

  if (navToggle && nav) {
    navToggle.addEventListener("click", function () {
      var isOpen = nav.classList.toggle("is-open");
      body.classList.toggle("nav-open", isOpen);
      navToggle.setAttribute("aria-expanded", isOpen ? "true" : "false");
    });

    nav.querySelectorAll("a").forEach(function (link) {
      link.addEventListener("click", function () {
        nav.classList.remove("is-open");
        body.classList.remove("nav-open");
        navToggle.setAttribute("aria-expanded", "false");
      });
    });
  }

  var page = window.location.pathname.split("/").pop() || "index.html";
  document.querySelectorAll(".site-nav a").forEach(function (link) {
    var href = link.getAttribute("href");
    if (href === page || (page === "" && href === "index.html")) {
      link.classList.add("active");
      link.setAttribute("aria-current", "page");
    }
  });

  document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
    anchor.addEventListener("click", function (event) {
      var target = document.querySelector(anchor.getAttribute("href"));
      if (target) {
        event.preventDefault();
        target.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    });
  });

  if ("IntersectionObserver" in window) {
    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12 });

    document.querySelectorAll("[data-animate]").forEach(function (el) {
      observer.observe(el);
    });
  } else {
    document.querySelectorAll("[data-animate]").forEach(function (el) {
      el.classList.add("is-visible");
    });
  }

  document.querySelectorAll(".faq-button").forEach(function (button) {
    button.addEventListener("click", function () {
      var item = button.closest(".faq-item");
      var isOpen = item.classList.toggle("open");
      button.setAttribute("aria-expanded", isOpen ? "true" : "false");
    });
  });

  document.querySelectorAll('form[action="contact.php"]').forEach(function (form) {
    form.addEventListener("submit", function (event) {
      if (window.location.protocol !== "file:") {
        return;
      }

      event.preventDefault();
      var lines = ["New Royal Pro Services website request", ""];
      Array.from(form.elements).forEach(function (field) {
        if (!field.name || field.name === "website" || field.type === "submit") {
          return;
        }
        var label = field.name.replace(/_/g, " ").replace(/\b\w/g, function (letter) {
          return letter.toUpperCase();
        });
        lines.push(label + ": " + (field.value || ""));
      });
      window.location.href = "mailto:info@royalproservices.ca?subject=" + encodeURIComponent("New Royal Pro Services website request") + "&body=" + encodeURIComponent(lines.join("\n"));
    });
  });

  document.querySelectorAll("[data-project-slider]").forEach(function (slider) {
    var section = slider.closest(".project-slider-section");
    var prev = section ? section.querySelector("[data-slide-prev]") : null;
    var next = section ? section.querySelector("[data-slide-next]") : null;
    var originalCards = Array.from(slider.querySelectorAll(".photo-card"));
    var isAdjusting = false;

    if (originalCards.length < 2) {
      return;
    }

    function makeClone(card) {
      var clone = card.cloneNode(true);
      clone.setAttribute("aria-hidden", "true");
      clone.removeAttribute("data-animate");
      clone.classList.remove("is-visible");
      return clone;
    }

    originalCards.slice().reverse().forEach(function (card) {
      slider.insertBefore(makeClone(card), slider.firstChild);
    });

    originalCards.forEach(function (card) {
      slider.appendChild(makeClone(card));
    });

    function cardStep() {
      var card = slider.querySelector(".photo-card");
      if (!card) {
        return slider.clientWidth;
      }
      var styles = window.getComputedStyle(slider);
      var gap = parseFloat(styles.columnGap || styles.gap || "0") || 0;
      return card.getBoundingClientRect().width + gap;
    }

    function loopWidth() {
      return cardStep() * originalCards.length;
    }

    function moveToMiddle() {
      slider.scrollTo({ left: loopWidth(), behavior: "auto" });
    }

    function normalizeLoop() {
      if (isAdjusting) {
        return;
      }

      var width = loopWidth();
      var step = cardStep();
      var left = slider.scrollLeft;
      var maxScroll = slider.scrollWidth - slider.clientWidth - step;

      if (left <= step || left >= maxScroll) {
        isAdjusting = true;
        slider.scrollTo({
          left: left <= step ? left + width : left - width,
          behavior: "auto"
        });
        isAdjusting = false;
      }
    }

    function slide(direction) {
      var step = cardStep();
      slider.scrollBy({ left: step * direction, behavior: "smooth" });
    }

    if (prev) {
      prev.classList.remove("is-disabled");
      prev.setAttribute("aria-disabled", "false");
      prev.addEventListener("click", function () {
        slide(-1);
      });
    }

    if (next) {
      next.classList.remove("is-disabled");
      next.setAttribute("aria-disabled", "false");
      next.addEventListener("click", function () {
        slide(1);
      });
    }

    slider.addEventListener("scroll", function () {
      window.requestAnimationFrame(normalizeLoop);
    }, { passive: true });

    window.addEventListener("resize", function () {
      window.requestAnimationFrame(moveToMiddle);
    });

    window.requestAnimationFrame(moveToMiddle);
  });

  if (backToTop) {
    window.addEventListener("scroll", function () {
      backToTop.classList.toggle("visible", window.scrollY > 620);
    }, { passive: true });

    backToTop.addEventListener("click", function () {
      window.scrollTo({ top: 0, behavior: "smooth" });
    });
  }
})();
