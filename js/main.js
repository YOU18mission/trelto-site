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
    nav.querySelectorAll("a").forEach(function (link) {
      link.addEventListener("click", function () {
        nav.classList.remove("is-open");
        toggle.setAttribute("aria-expanded", "false");
        toggle.textContent = "Menu";
      });
    });
  }

  var form = document.getElementById("snapshot-form");
  if (!form) return;

  form.addEventListener("submit", function (event) {
    event.preventDefault();
    var status = document.getElementById("form-status");
    var honey = form.querySelector("[name='company_website_confirm']");
    if (honey && honey.value) {
      if (status) {
        status.dataset.state = "ok";
        status.textContent = "Thanks. We’ll email you within one business day.";
      }
      form.reset();
      return;
    }

    if (!form.reportValidity()) return;

    var get = function (name) {
      var el = form.elements.namedItem(name);
      return el && "value" in el ? String(el.value).trim() : "";
    };

    var services = Array.prototype.slice
      .call(form.querySelectorAll("input[name='services']:checked"))
      .map(function (el) { return el.value; });

    var lines = [
      "AI Snapshot request from trelto.com",
      "",
      "Name: " + get("name"),
      "Business: " + get("business"),
      "Email: " + get("email"),
      "Phone: " + get("phone"),
      "Town: " + get("town"),
      "Other towns served: " + get("towns"),
      "Website: " + get("website"),
      "Services: " + (services.join(", ") || "not specified"),
      "",
      "Notes:",
      get("notes") || "(none)"
    ];

    var endpoint = form.getAttribute("data-formspree");
    if (endpoint && endpoint.indexOf("https://formspree.io/") === 0) {
      var data = new FormData(form);
      data.set("services", services.join(", "));
      fetch(endpoint, {
        method: "POST",
        body: data,
        headers: { Accept: "application/json" }
      })
        .then(function (res) {
          if (!res.ok) throw new Error("submit failed");
          if (status) {
            status.dataset.state = "ok";
            status.textContent = "Got it. You’ll get a Snapshot by email within one business day.";
          }
          form.reset();
        })
        .catch(function () {
          openMailto(get("email"), get("business"), lines, status);
        });
      return;
    }

    openMailto(get("email"), get("business"), lines, status);
  });

  function openMailto(email, business, lines, status) {
    var subject = "AI Snapshot request: " + (business || "HVAC shop");
    var href =
      "mailto:hello@trelto.com?subject=" +
      encodeURIComponent(subject) +
      "&body=" +
      encodeURIComponent(lines.join("\n"));
    if (email) {
      href += "&cc=" + encodeURIComponent(email);
    }
    if (status) {
      status.dataset.state = "ok";
      status.textContent =
        "Your email app should open with the request filled in. If it doesn’t, write to hello@trelto.com.";
    }
    window.location.href = href;
  }
})();
