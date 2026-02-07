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
  }

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
