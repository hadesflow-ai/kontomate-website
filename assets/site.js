// KontoMate landing: light/dark switch and the language switcher. No trackers, no cookies:
// the two choices are kept in localStorage on this device only.
(function () {
  var root = document.documentElement;
  var base = document.currentScript ? document.currentScript.src.replace(/[^/]*$/, "") : "assets/";
  var store = {
    get: function (k) { try { return localStorage.getItem(k); } catch (e) { return null; } },
    set: function (k, v) { try { localStorage.setItem(k, v); } catch (e) { /* storage blocked: the choice lasts this visit */ } },
  };

  // Theme (assets/theme-init.js applied it before paint).
  var toggle = document.getElementById("theme-toggle");
  if (toggle) {
    toggle.addEventListener("click", function () {
      var dark = !root.classList.contains("dark");
      root.classList.toggle("dark", dark);
      store.set("kontomate-theme", dark ? "dark" : "light");
      var meta = document.querySelector('meta[name="theme-color"]');
      if (meta) meta.setAttribute("content", dark ? "#181a20" : "#f5f5f5");
    });
  }

  // Waitlist (Soon mode). Posts JSON to /api/waitlist; without JavaScript the form posts itself and the
  // function redirects back to /?waitlist=<result>#waitlist, which is shown here too.
  var form = document.getElementById("waitlist-form");
  if (form) {
    var status = document.getElementById("waitlist-status");
    var email = form.elements.namedItem("email");
    var consent = form.elements.namedItem("consent");
    var button = form.querySelector('button[type="submit"]');
    var show = function (code) {
      var ok = code === "ok";
      var id = { ok: "msg-ok", invalid: "msg-invalid", consent: "msg-consent" }[code] || "msg-error";
      var msg = document.getElementById(id);
      status.textContent = msg ? msg.textContent : "";
      status.className = "waitlist-status " + (ok ? "ok" : "err");
      email.setAttribute("aria-invalid", code === "invalid" ? "true" : "false");
      if (ok) { form.reset(); }
    };
    var result = new URLSearchParams(location.search).get("waitlist");
    if (result) show(result);

    form.addEventListener("submit", function (e) {
      e.preventDefault();
      var value = email.value.trim();
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(value)) { show("invalid"); email.focus(); return; }
      if (!consent.checked) { show("consent"); consent.focus(); return; }
      button.disabled = true;
      fetch(form.action, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: value,
          consent: true,
          lang: root.getAttribute("lang") || "en",
          website: form.elements.namedItem("website").value,
        }),
      })
        .then(function (r) { return r.json().catch(function () { return {}; }); })
        .then(function (d) { show(d.result || "error"); })
        .catch(function () { show("error"); })
        .then(function () { button.disabled = false; });
    });
  }

  // Languages (assets/i18n.js). English is the HTML; other languages replace the data-i18n texts.
  var I18N = window.KM_I18N;
  if (!I18N) return;
  var english = {};
  var nodes = document.querySelectorAll("[data-i18n]");
  nodes.forEach(function (el) { english[el.getAttribute("data-i18n")] = el.textContent; });
  var attrNodes = document.querySelectorAll("[data-i18n-attr]");
  attrNodes.forEach(function (el) {
    var parts = el.getAttribute("data-i18n-attr").split(":");
    english[parts[1]] = el.getAttribute(parts[0]);
  });

  function apply(code) {
    var dict = code === "en" ? english : (I18N.strings[code] || {});
    nodes.forEach(function (el) {
      var key = el.getAttribute("data-i18n");
      el.textContent = dict[key] || english[key];
    });
    attrNodes.forEach(function (el) {
      var parts = el.getAttribute("data-i18n-attr").split(":");
      el.setAttribute(parts[0], dict[parts[1]] || english[parts[1]]);
    });
    root.setAttribute("lang", code);
  }

  function load(code, done) {
    if (code === "en" || I18N.strings[code]) return done();
    var s = document.createElement("script");
    s.src = base + "locales/" + code + ".js";
    s.onload = done;
    s.onerror = function () { apply("en"); };
    document.head.appendChild(s);
  }

  function choose(code) { load(code, function () { apply(code); }); }

  var ready = I18N.languages.filter(function (l) { return I18N.READY.indexOf(l.code) > -1; });
  var isReady = function (c) { return ready.some(function (l) { return l.code === c; }); };
  var fromUrl = new URLSearchParams(location.search).get("lang");
  var browser = (navigator.language || "en").slice(0, 2).toLowerCase();
  var start = [fromUrl, store.get("kontomate-lang"), browser, "en"].filter(isReady)[0] || "en";
  if (start !== "en") choose(start);

  // The switcher (same look and keys as the app's Radix select) shows only when more than one language is ready.
  var trigger = document.getElementById("lang-trigger");
  var menu = document.getElementById("lang-menu");
  if (trigger && menu && ready.length > 1) {
    var current = document.getElementById("lang-current");
    var selected = start;
    var check = '<svg class="icon" aria-hidden="true"><use href="#i-check"/></svg>';
    var options = ready.map(function (l) {
      var li = document.createElement("li");
      li.id = "lang-opt-" + l.code;
      li.setAttribute("role", "option");
      li.setAttribute("lang", l.code);
      li.dataset.code = l.code;
      li.innerHTML = '<span class="lang-check">' + check + "</span>";
      li.appendChild(document.createTextNode(l.label));
      menu.appendChild(li);
      return li;
    });
    var active = 0;
    var mark = function () {
      options.forEach(function (li) { li.setAttribute("aria-selected", li.dataset.code === selected ? "true" : "false"); });
      current.textContent = ready.filter(function (l) { return l.code === selected; })[0].label;
    };
    var focusOpt = function (i) {
      active = (i + options.length) % options.length;
      options.forEach(function (li, j) { li.classList.toggle("is-active", j === active); });
      menu.setAttribute("aria-activedescendant", options[active].id);
      options[active].scrollIntoView({ block: "nearest" });
    };
    var open = function () {
      menu.hidden = false;
      trigger.setAttribute("aria-expanded", "true");
      focusOpt(Math.max(0, ready.findIndex(function (l) { return l.code === selected; })));
      menu.focus();
    };
    var close = function (refocus) {
      if (menu.hidden) return;
      menu.hidden = true;
      trigger.setAttribute("aria-expanded", "false");
      if (refocus) trigger.focus();
    };
    var pick = function (code) {
      close(true);
      if (code === selected) return;
      selected = code;
      mark();
      store.set("kontomate-lang", code);
      choose(code);
    };

    trigger.addEventListener("click", function () { menu.hidden ? open() : close(true); });
    trigger.addEventListener("keydown", function (e) {
      if (e.key === "ArrowDown" || e.key === "ArrowUp") { e.preventDefault(); open(); }
    });
    menu.addEventListener("click", function (e) {
      var li = e.target.closest("[role=option]");
      if (li) pick(li.dataset.code);
    });
    menu.addEventListener("mousemove", function (e) {
      var li = e.target.closest("[role=option]");
      if (li) focusOpt(options.indexOf(li));
    });
    menu.addEventListener("keydown", function (e) {
      if (e.key === "ArrowDown") { e.preventDefault(); focusOpt(active + 1); }
      else if (e.key === "ArrowUp") { e.preventDefault(); focusOpt(active - 1); }
      else if (e.key === "Home") { e.preventDefault(); focusOpt(0); }
      else if (e.key === "End") { e.preventDefault(); focusOpt(options.length - 1); }
      else if (e.key === "Enter" || e.key === " ") { e.preventDefault(); pick(options[active].dataset.code); }
      else if (e.key === "Escape") { e.preventDefault(); close(true); }
      else if (e.key === "Tab") { close(false); }
    });
    document.addEventListener("click", function (e) {
      if (!e.target.closest(".lang")) close(false);
    });

    mark();
    trigger.closest(".lang").hidden = false;
  }
})();
