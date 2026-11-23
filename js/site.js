(function () {
  "use strict";
  var toggle = document.querySelector(".nav-toggle");
  var nav = document.getElementById("site-nav");
  if (toggle && nav) {
    toggle.addEventListener("click", function () {
      var open = nav.classList.toggle("is-open");
      toggle.setAttribute("aria-expanded", open ? "true" : "false");
      toggle.textContent = open ? "Close" : "Menu";
    });
    nav.querySelectorAll("a").forEach(function (a) {
      a.addEventListener("click", function () {
        nav.classList.remove("is-open");
        toggle.setAttribute("aria-expanded", "false");
        toggle.textContent = "Menu";
      });
    });
  }

  function val(form, name) {
    var el = form.elements.namedItem(name);
    return el && "value" in el ? String(el.value).trim() : "";
  }

  function frame() {
    var f = document.getElementById("gf-sink");
    if (!f) {
      f = document.createElement("iframe");
      f.name = "gf-sink"; f.id = "gf-sink";
      f.setAttribute("aria-hidden", "true"); f.tabIndex = -1;
      f.style.display = "none";
      document.body.appendChild(f);
    }
    return f;
  }

  document.querySelectorAll("form.lead-form").forEach(function (form) {
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      var status = form.querySelector(".form-status");
      var say = function (msg, state) { if (status) { status.dataset.state = state; status.textContent = msg; } };
      if (val(form, "company_website_confirm")) { say("Thanks. We’ll be in touch by email.", "ok"); form.reset(); return; }
      if (!form.checkValidity()) { form.reportValidity(); say("Please fill in your business name, city, and a valid email.", "err"); return; }

      var fields = [
        [form.dataset.entryBusiness, val(form, "business")],
        [form.dataset.entryCity, val(form, "city")],
        [form.dataset.entryWebsite, val(form, "website")],
        [form.dataset.entryEmail, val(form, "email")]
      ];
      var hidden = document.createElement("form");
      hidden.action = form.getAttribute("action");
      hidden.method = "POST";
      hidden.target = frame().name;
      hidden.style.display = "none";
      fields.forEach(function (p) {
        var i = document.createElement("input");
        i.type = "hidden"; i.name = p[0]; i.value = p[1];
        hidden.appendChild(i);
      });
      document.body.appendChild(hidden);
      try {
        hidden.submit();
        say("Got it. Your free visibility check will arrive by email within 48 hours. If you don’t see it, write to hello@trelto.com.", "ok");
        form.reset();
      } catch (err) {
        say("Something went wrong. Please email hello@trelto.com and we’ll run your check.", "err");
      }
      document.body.removeChild(hidden);
    });
  });
})();
