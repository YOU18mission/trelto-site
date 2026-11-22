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

  function fieldValue(form, name) {
    var el = form.elements.namedItem(name);
    return el && "value" in el ? String(el.value).trim() : "";
  }

  function openMailto(subject, lines, email, status, thanks) {
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
      status.textContent = thanks;
    }
    window.location.href = href;
  }

  var snapshotForm = document.getElementById("snapshot-form");
  if (snapshotForm) {
    snapshotForm.addEventListener("submit", function (event) {
      event.preventDefault();
      var status = document.getElementById("form-status");
      var honey = snapshotForm.querySelector("[name='company_website_confirm']");
      if (honey && honey.value) {
        if (status) {
          status.dataset.state = "ok";
          status.textContent = "Thanks. We’ll email you within one business day.";
        }
        snapshotForm.reset();
        return;
      }

      if (!snapshotForm.reportValidity()) return;

      var get = function (name) {
        return fieldValue(snapshotForm, name);
      };

      var services = Array.prototype.slice
        .call(snapshotForm.querySelectorAll("input[name='services']:checked"))
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

      var endpoint = snapshotForm.getAttribute("data-formspree");
      if (endpoint && endpoint.indexOf("https://formspree.io/") === 0) {
        var data = new FormData(snapshotForm);
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
            snapshotForm.reset();
          })
          .catch(function () {
            openMailto(
              "AI Snapshot request: " + (get("business") || "HVAC shop"),
              lines,
              get("email"),
              status,
              "Your email app should open with the request filled in. If it doesn’t, write to hello@trelto.com."
            );
          });
        return;
      }

      openMailto(
        "AI Snapshot request: " + (get("business") || "HVAC shop"),
        lines,
        get("email"),
        status,
        "Your email app should open with the request filled in. If it doesn’t, write to hello@trelto.com."
      );
    });
  }

  var checkForm = document.getElementById("check-form");
  if (checkForm) {
    checkForm.addEventListener("submit", function (event) {
      event.preventDefault();
      var status = document.getElementById("form-status");
      var honey = checkForm.querySelector("[name='company_website_confirm']");
      if (honey && honey.value) {
        if (status) {
          status.dataset.state = "ok";
          status.textContent = "Thanks. We’ll email you a Snapshot within 48 hours.";
        }
        checkForm.reset();
        return;
      }

      if (!checkForm.reportValidity()) return;

      var get = function (name) {
        return fieldValue(checkForm, name);
      };

      var lines = [
        "Free AI visibility check request from trelto.com/check.html",
        "",
        "Business: " + get("business"),
        "City: " + get("city"),
        "Website: " + (get("website") || "(none)"),
        "Email: " + get("email")
      ];

      var mailtoThanks =
        "Your email app should open with the request filled in. If it doesn’t, write to hello@trelto.com. We’ll email a Snapshot within 48 hours of a complete request.";

      var googleUrl = (checkForm.getAttribute("data-google-form") || "").trim();
      var entryBusiness = (checkForm.getAttribute("data-entry-business") || "").trim();
      var entryCity = (checkForm.getAttribute("data-entry-city") || "").trim();
      var entryWebsite = (checkForm.getAttribute("data-entry-website") || "").trim();
      var entryEmail = (checkForm.getAttribute("data-entry-email") || "").trim();
      var googleReady =
        googleUrl.indexOf("https://docs.google.com/forms/d/e/") === 0 &&
        googleUrl.indexOf("/formResponse") !== -1 &&
        entryBusiness &&
        entryCity &&
        entryWebsite &&
        entryEmail;

      if (googleReady) {
        postGoogleForm(googleUrl, [
          [entryBusiness, get("business")],
          [entryCity, get("city")],
          [entryWebsite, get("website")],
          [entryEmail, get("email")]
        ]);
        if (status) {
          status.dataset.state = "ok";
          status.textContent = "Got it. You’ll get a Snapshot by email within 48 hours.";
        }
        checkForm.reset();
        return;
      }

      openMailto(
        "Free AI visibility check: " + (get("business") || "HVAC shop"),
        lines,
        get("email"),
        status,
        mailtoThanks
      );
    });
  }

  function postGoogleForm(url, fields) {
    var frameName = "trelto-google-form";
    var iframe = document.getElementById(frameName);
    if (!iframe) {
      iframe = document.createElement("iframe");
      iframe.name = frameName;
      iframe.id = frameName;
      iframe.style.display = "none";
      iframe.setAttribute("aria-hidden", "true");
      iframe.setAttribute("tabindex", "-1");
      document.body.appendChild(iframe);
    }

    var hidden = document.createElement("form");
    hidden.action = url;
    hidden.method = "POST";
    hidden.target = frameName;
    hidden.style.display = "none";
    hidden.setAttribute("aria-hidden", "true");

    fields.forEach(function (pair) {
      var input = document.createElement("input");
      input.type = "hidden";
      input.name = pair[0];
      input.value = pair[1];
      hidden.appendChild(input);
    });

    document.body.appendChild(hidden);
    hidden.submit();
    document.body.removeChild(hidden);
  }
})();
