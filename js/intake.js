(function () {
  "use strict";
  var form = document.getElementById("intake-form");
  if (!form) return;
  form.addEventListener("submit", function (event) {
    event.preventDefault();
    var status = document.getElementById("form-status");
    var honey = form.querySelector("[name='company_website_confirm']");
    if (honey && honey.value) { form.reset(); return; }
    if (!form.reportValidity()) return;
    var lines = ["Trelto client intake from trelto.com/intake.html", ""];
    var seen = {};
    Array.prototype.forEach.call(form.querySelectorAll("[data-label]"), function (el) {
      var label = el.getAttribute("data-label");
      var value;
      if (el.tagName === "FIELDSET") {
        var name = el.getAttribute("data-name");
        if (seen[name]) return; seen[name] = true;
        value = Array.prototype.map.call(
          el.querySelectorAll("input:checked"), function (c) { return c.value; }).join(", ");
      } else {
        value = String(el.value || "").trim();
      }
      lines.push(label + ": " + (value || "(blank)"));
    });
    var get = function (n) { var e = form.elements.namedItem(n); return e && "value" in e ? String(e.value).trim() : ""; };
    var href = "mailto:hello@trelto.com?subject=" +
      encodeURIComponent("Trelto intake: " + (get("business") || "new client")) +
      "&body=" + encodeURIComponent(lines.join("\n"));
    if (get("email")) href += "&cc=" + encodeURIComponent(get("email"));
    if (status) {
      status.dataset.state = "ok";
      status.textContent = "Your email app should open with your answers filled in. Press send. If it doesn’t open, email hello@trelto.com.";
    }
    var out = document.getElementById("intake-copy");
    if (out) {
      out.hidden = false;
      var ta = out.querySelector("textarea");
      ta.value = lines.join("\n");
    }
    window.location.href = href;
  });
})();
