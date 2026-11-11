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

  // The switcher shows only when there is more than one finished language.
  var select = document.getElementById("lang-select");
  if (select && ready.length > 1) {
    ready.forEach(function (l) {
      var o = document.createElement("option");
      o.value = l.code;
      o.textContent = l.label;
      if (l.code === start) o.selected = true;
      select.appendChild(o);
    });
    select.addEventListener("change", function () {
      store.set("kontomate-lang", select.value);
      choose(select.value);
    });
    select.closest(".lang").hidden = false;
  }
})();
