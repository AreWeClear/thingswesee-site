// Simple password screen while the app is in private testing.
// Not real security: it only keeps casual visitors out.
// To remove it: delete this file, the <script> lines in each page, and the "locked" CSS in style.css.
(function () {
  var HASH = "cd261b2e969841b9428ccf3e0e0ca32abfc59057b1fc566185c523885a10791f";
  var KEY = "tws-gate";
  var root = document.documentElement;

  function ok() { try { return localStorage.getItem(KEY) === HASH; } catch (e) { return false; } }
  if (ok()) { root.classList.remove("locked"); return; }

  function sha256(text) {
    return crypto.subtle.digest("SHA-256", new TextEncoder().encode(text)).then(function (buf) {
      return Array.from(new Uint8Array(buf)).map(function (b) { return b.toString(16).padStart(2, "0"); }).join("");
    });
  }

  function build() {
    var gate = document.createElement("div");
    gate.id = "gate";
    gate.innerHTML =
      '<form autocomplete="off">' +
      '<img src="/favicon.svg" alt="" width="56" height="56">' +
      '<h1>Things We See</h1>' +
      '<label for="gate-pw">Password</label>' +
      '<input id="gate-pw" type="password" autocomplete="current-password" required>' +
      '<button type="submit">Enter</button>' +
      '<p class="gate-msg" role="alert"></p>' +
      '</form>';
    document.body.appendChild(gate);
    var form = gate.querySelector("form");
    var input = gate.querySelector("input");
    var msg = gate.querySelector(".gate-msg");
    input.focus();
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      sha256(input.value.trim()).then(function (h) {
        if (h === HASH) {
          try { localStorage.setItem(KEY, HASH); } catch (err) {}
          gate.remove();
          root.classList.remove("locked");
        } else {
          msg.textContent = "That password isn't right.";
          input.select();
        }
      });
    });
  }

  if (document.body) build(); else document.addEventListener("DOMContentLoaded", build);
})();
