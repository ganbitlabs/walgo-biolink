/* Walgo Biolink — Minimal JS */
(function () {
  "use strict";

  /* -------------------------------------------------------------------------
     Dark / Light Mode Toggle
     ------------------------------------------------------------------------- */
  var THEME_KEY = "walgo-biolink-theme";
  var html = document.documentElement;

  function getPreferred() {
    var stored = localStorage.getItem(THEME_KEY);
    if (stored) return stored;
    if (window.matchMedia && window.matchMedia("(prefers-color-scheme: light)").matches) return "light";
    return "dark";
  }

  function applyTheme(theme) {
    html.setAttribute("data-theme", theme);
    localStorage.setItem(THEME_KEY, theme);
    var darkIcon = document.querySelector(".theme-icon--dark");
    var lightIcon = document.querySelector(".theme-icon--light");
    if (darkIcon && lightIcon) {
      darkIcon.style.display = theme === "dark" ? "block" : "none";
      lightIcon.style.display = theme === "light" ? "block" : "none";
    }
  }

  var current = html.getAttribute("data-theme");
  if (current === "auto" || !current) {
    applyTheme(getPreferred());
  } else {
    applyTheme(current);
  }

  var btn = document.getElementById("theme-toggle");
  if (btn) {
    btn.addEventListener("click", function () {
      var now = html.getAttribute("data-theme");
      applyTheme(now === "dark" ? "light" : "dark");
    });
  }

  /* -------------------------------------------------------------------------
     Avatar Expand / Collapse — scales up and moves to viewport center
     ------------------------------------------------------------------------- */
  var avatarBtn = document.getElementById("avatar-toggle");

  if (avatarBtn) {
    var avatarScale = 2.4;
    var isAvatarOpen = false;
    var profileSection = avatarBtn.closest(".profile");

    function openAvatar() {
      var rect = avatarBtn.getBoundingClientRect();
      var cx = rect.left + rect.width / 2;
      var cy = rect.top + rect.height / 2;
      var dx = window.innerWidth / 2 - cx;
      var dy = window.innerHeight / 2 - cy;
      avatarBtn.style.transform = "translate(" + dx + "px," + dy + "px) scale(" + avatarScale + ")";
      avatarBtn.classList.add("profile__avatar-wrap--expanded");
      avatarBtn.setAttribute("aria-expanded", "true");
      if (profileSection) profileSection.classList.add("profile--avatar-open");
      isAvatarOpen = true;
    }

    function closeAvatar() {
      avatarBtn.style.transform = "";
      avatarBtn.classList.remove("profile__avatar-wrap--expanded");
      avatarBtn.setAttribute("aria-expanded", "false");
      if (profileSection) profileSection.classList.remove("profile--avatar-open");
      isAvatarOpen = false;
    }

    avatarBtn.addEventListener("click", function (e) {
      e.stopPropagation();
      if (isAvatarOpen) closeAvatar(); else openAvatar();
    });

    document.addEventListener("click", function () {
      if (isAvatarOpen) closeAvatar();
    });

    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && isAvatarOpen) closeAvatar();
    });
  }

  /* -------------------------------------------------------------------------
     Pager — Arrow Navigation with Crossfade
     ------------------------------------------------------------------------- */
  var containers = document.querySelectorAll("[data-page-size]");

  containers.forEach(function (container) {
    var pageSize = parseInt(container.getAttribute("data-page-size"), 10);
    var pager = container.querySelector(".pager");
    if (!pager) return;

    /* Collect pageable items (children that aren't the pager) */
    var items = [];
    var children = container.children;
    for (var i = 0; i < children.length; i++) {
      var child = children[i];
      if (child.classList.contains("pager")) continue;
      items.push(child);
    }

    if (items.length <= pageSize) return;

    var totalPages = Math.ceil(items.length / pageSize);
    var currentPage = 0;
    var isTransitioning = false;

    var prevBtn = pager.querySelector(".pager__prev");
    var nextBtn = pager.querySelector(".pager__next");
    var countEl = pager.querySelector(".pager__count");

    function updateCounter() {
      if (countEl) {
        countEl.textContent = (currentPage + 1) + " / " + totalPages;
      }
    }

    function updateButtons() {
      if (prevBtn) prevBtn.disabled = currentPage === 0;
      if (nextBtn) nextBtn.disabled = currentPage === totalPages - 1;
    }

    function showPage(page, direction) {
      if (isTransitioning || page === currentPage || page < 0 || page >= totalPages) return;
      isTransitioning = true;

      /* Phase 1: Fade out current items */
      var offsetX = direction > 0 ? "-8px" : "8px";
      items.forEach(function (item) {
        if (item.style.display !== "none") {
          item.style.opacity = "0";
          item.style.transform = "translateX(" + offsetX + ")";
        }
      });

      setTimeout(function () {
        /* Phase 2: Swap items */
        var start = page * pageSize;
        var end = Math.min(start + pageSize, items.length);
        var enterX = direction > 0 ? "8px" : "-8px";

        items.forEach(function (item) {
          item.style.display = "none";
          item.classList.remove("pager-hidden");
        });

        for (var k = start; k < end; k++) {
          items[k].style.display = "";
          items[k].style.opacity = "0";
          items[k].style.transform = "translateX(" + enterX + ")";
        }

        currentPage = page;
        updateCounter();
        updateButtons();

        /* Phase 3: Fade in new items */
        requestAnimationFrame(function () {
          requestAnimationFrame(function () {
            for (var k = start; k < end; k++) {
              items[k].style.opacity = "1";
              items[k].style.transform = "translateX(0)";
            }
            setTimeout(function () {
              isTransitioning = false;
            }, 200);
          });
        });
      }, 180);
    }

    /* Initialize: show first page, hide rest */
    items.forEach(function (item, idx) {
      item.classList.remove("pager-hidden");
      if (idx >= pageSize) {
        item.style.display = "none";
      }
    });

    updateCounter();
    updateButtons();

    /* Arrow click handlers */
    if (prevBtn) {
      prevBtn.addEventListener("click", function () {
        showPage(currentPage - 1, -1);
      });
    }
    if (nextBtn) {
      nextBtn.addEventListener("click", function () {
        showPage(currentPage + 1, 1);
      });
    }

    /* Touch swipe support */
    var touchStartX = 0;
    var touchStartY = 0;
    var SWIPE_THRESHOLD = 50;

    container.addEventListener("touchstart", function (e) {
      touchStartX = e.touches[0].clientX;
      touchStartY = e.touches[0].clientY;
    }, { passive: true });

    container.addEventListener("touchend", function (e) {
      var dx = e.changedTouches[0].clientX - touchStartX;
      var dy = e.changedTouches[0].clientY - touchStartY;
      /* Only trigger if horizontal swipe is dominant */
      if (Math.abs(dx) > SWIPE_THRESHOLD && Math.abs(dx) > Math.abs(dy) * 1.5) {
        if (dx < 0) {
          showPage(currentPage + 1, 1);
        } else {
          showPage(currentPage - 1, -1);
        }
      }
    }, { passive: true });
  });

  /* -------------------------------------------------------------------------
     Badge Marquee — clone sets to fill viewport for seamless scroll
     ------------------------------------------------------------------------- */
  var marqueeEl = document.querySelector(".badges--marquee");
  if (marqueeEl) {
    var track = marqueeEl.querySelector(".badges__track");
    var original = track.querySelector(".badges__set");
    if (track && original) {
      var setW = original.offsetWidth;
      var viewW = marqueeEl.offsetWidth;
      /* Need enough copies so total >= viewport + one extra set for scrolling */
      var copies = Math.max(2, Math.ceil((viewW + setW) / setW) + 1);
      for (var ci = 1; ci < copies; ci++) {
        var clone = original.cloneNode(true);
        clone.setAttribute("aria-hidden", "true");
        clone.querySelectorAll("a").forEach(function (a) { a.setAttribute("tabindex", "-1"); });
        track.appendChild(clone);
      }
      /* Shift by exactly one set = 1/copies of total track */
      track.style.setProperty("--badge-shift", "-" + (100 / copies).toFixed(4) + "%");
      /* Speed: ~50px per second */
      var dur = Math.max(6, setW / 50);
      track.style.setProperty("--badge-dur", dur.toFixed(1) + "s");
    }

    /* Touch/click toggle for pause — works on mobile where hover doesn't */
    marqueeEl.addEventListener("click", function (e) {
      /* Don't toggle if user tapped on a badge link */
      if (e.target.closest("a")) return;
      marqueeEl.classList.toggle("badges--paused");
    });
  }

  /* -------------------------------------------------------------------------
     Image Slider — autoplay, arrows, dots, swipe, keyboard
     ------------------------------------------------------------------------- */
  var sliders = document.querySelectorAll("[data-slider]");
  var reducedMotion = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var resizeTimer;

  /* Single global resize handler — debounced */
  window.addEventListener("resize", function () {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(function () {
      sliders.forEach(function (s) { if (s._sync) s._sync(); });
    }, 150);
  });

  /* Single global visibilitychange handler */
  document.addEventListener("visibilitychange", function () {
    sliders.forEach(function (s) {
      if (!s._auto) return;
      document.hidden ? s._auto.stop() : s._auto.start();
    });
  });

  sliders.forEach(function (slider) {
    var track = slider.querySelector(".slider__track");
    var slides = slider.querySelectorAll(".slider__slide");
    if (!track || slides.length < 2) return;

    var total = slides.length;
    var cur = 0;
    var doAutoplay = slider.getAttribute("data-autoplay") === "true" && !reducedMotion;
    var ms = parseInt(slider.getAttribute("data-interval"), 10) || 4000;
    var timer = null;
    var sliderW = 0; /* cached for touch, updated on touchstart */
    var prevSlide = slides[0];

    var section = slider.closest(".bio-section");
    var pager = section ? section.querySelector(".pager") : null;
    var prevBtn = pager ? pager.querySelector(".pager__prev") : null;
    var nextBtn = pager ? pager.querySelector(".pager__next") : null;
    var countEl = pager ? pager.querySelector(".pager__count") : null;

    function syncHeight() {
      var h = slides[cur].scrollHeight;
      if (h > 0) track.style.height = h + "px";
    }

    /* Expose for global handlers */
    slider._sync = syncHeight;

    function goTo(idx) {
      if (idx < 0) idx = total - 1;
      if (idx >= total) idx = 0;
      cur = idx;
      track.style.transform = "translateX(-" + (cur * 100) + "%)";

      /* Force lazy image to load */
      var img = slides[cur].querySelector("img[loading=lazy]");
      if (img) img.loading = "eager";

      syncHeight();

      /* Update pager counter + button states */
      if (countEl) countEl.textContent = (cur + 1) + " / " + total;
      if (prevBtn) prevBtn.disabled = cur === 0;
      if (nextBtn) nextBtn.disabled = cur === total - 1;

      /* Update only the changed slide aria */
      prevSlide.setAttribute("aria-hidden", "true");
      slides[cur].setAttribute("aria-hidden", "false");
      prevSlide = slides[cur];
    }

    /* Init aria */
    for (var si = 1; si < total; si++) slides[si].setAttribute("aria-hidden", "true");

    /* Recalculate height when images load, self-removing */
    slider.querySelectorAll("img").forEach(function (img) {
      function onLoad() {
        syncHeight();
        img.removeEventListener("load", onLoad);
      }
      if (img.complete) return;
      img.addEventListener("load", onLoad);
    });

    syncHeight();

    /* Autoplay */
    function start() {
      if (!doAutoplay) return;
      stop();
      timer = setInterval(function () { goTo(cur + 1); }, ms);
    }
    function stop() {
      if (timer) { clearInterval(timer); timer = null; }
    }
    function restart() { stop(); start(); }

    /* Expose for global visibilitychange */
    slider._auto = { start: start, stop: stop };

    /* Event delegation — pager buttons (pager is sibling in bio-section) */
    if (pager) {
      pager.addEventListener("click", function (e) {
        var btn = e.target.closest(".pager__btn");
        if (btn) {
          goTo(cur + (btn.classList.contains("pager__prev") ? -1 : 1));
          restart();
        }
      });
    }

    /* Keyboard */
    slider.setAttribute("tabindex", "0");
    slider.addEventListener("keydown", function (e) {
      if (e.key === "ArrowLeft" || e.key === "ArrowRight") {
        e.preventDefault();
        goTo(cur + (e.key === "ArrowLeft" ? -1 : 1));
        restart();
      }
    });

    /* Pause on hover / focus */
    slider.addEventListener("mouseenter", stop);
    slider.addEventListener("focusin", stop);
    slider.addEventListener("mouseleave", start);
    slider.addEventListener("focusout", start);

    start();

    /* Touch swipe */
    var tx0 = 0, ty0 = 0, tdx = 0, swiping = false;

    slider.addEventListener("touchstart", function (e) {
      tx0 = e.touches[0].clientX;
      ty0 = e.touches[0].clientY;
      tdx = 0;
      swiping = false;
      sliderW = slider.offsetWidth; /* cache once per gesture */
      track.classList.add("slider__track--dragging");
    }, { passive: true });

    slider.addEventListener("touchmove", function (e) {
      var dx = e.touches[0].clientX - tx0;
      if (!swiping && Math.abs(dx) > 10) {
        swiping = Math.abs(dx) > Math.abs(e.touches[0].clientY - ty0);
      }
      if (swiping) {
        tdx = dx;
        track.style.transform = "translateX(" + (-(cur * 100) + (dx / sliderW) * 100) + "%)";
      }
    }, { passive: true });

    slider.addEventListener("touchend", function () {
      track.classList.remove("slider__track--dragging");
      if (swiping) {
        goTo(tdx < -40 ? cur + 1 : tdx > 40 ? cur - 1 : cur);
        restart();
      }
      swiping = false;
    }, { passive: true });
  });

  /* -------------------------------------------------------------------------
     Text Collapsible — truncate long text blocks with "Read more"
     ------------------------------------------------------------------------- */
  var collapsibles = document.querySelectorAll("[data-collapsible]");

  collapsibles.forEach(function (el) {
    var toggle = el.nextElementSibling;
    if (!toggle || !toggle.classList.contains("bio-text__toggle")) return;

    /* Check if natural height exceeds the collapse threshold (6em) */
    var naturalHeight = el.scrollHeight;
    var maxHeight = parseFloat(getComputedStyle(el).fontSize) * 6;
    if (naturalHeight <= maxHeight) return;

    el.classList.add("bio-text--collapsed");

    toggle.hidden = false;

    toggle.addEventListener("click", function () {
      var isExpanded = el.classList.contains("bio-text--expanded");
      if (isExpanded) {
        el.classList.remove("bio-text--expanded");
        el.classList.add("bio-text--collapsed");
        toggle.setAttribute("aria-expanded", "false");
      } else {
        el.classList.remove("bio-text--collapsed");
        el.classList.add("bio-text--expanded");
        toggle.setAttribute("aria-expanded", "true");
      }
    });
  });

  /* -------------------------------------------------------------------------
     Copy to Clipboard
     ------------------------------------------------------------------------- */
  document.addEventListener("click", function (e) {
    var btn = e.target.closest("[data-copy]");
    if (!btn) return;

    var text = btn.getAttribute("data-copy");
    if (!text) return;

    navigator.clipboard.writeText(text).then(function () {
      btn.classList.add("wallet__btn--copied");
      var original = btn.getAttribute("title");
      btn.setAttribute("title", "Copied!");
      setTimeout(function () {
        btn.classList.remove("wallet__btn--copied");
        btn.setAttribute("title", original || "Copy");
      }, 2000);
    }).catch(function () {});
  });
})();
