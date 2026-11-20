// After `npm run preview:site`: make the browser preview never show a blank screen.
// Adds a "Loading" message the app replaces when it starts, and shows any startup error on screen.
const fs = require("fs");
const path = require("path");
const file = path.resolve(__dirname, "../../public/app/index.html");
let html = fs.readFileSync(file, "utf8");
const boot = `<div id="tk-boot" style="position:fixed;inset:0;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:12px;background:#000;color:#fff;font-family:-apple-system,system-ui,sans-serif;z-index:0;text-align:center;padding:24px">
<div style="width:56px;height:56px;border-radius:18px;background:#8b1e3f;display:flex;align-items:center;justify-content:center;font-weight:800;font-size:20px">TK</div>
<div id="tk-boot-msg" style="opacity:.8">Loading Tokende…</div></div>
<script>
window.addEventListener("error",function(e){var m=document.getElementById("tk-boot-msg");if(m){m.style.opacity=1;m.innerHTML="Something went wrong starting the app.<br><small style='opacity:.7'>"+String(e.message||e.error||"Unknown error").replace(/</g,"&lt;")+"</small><br><small style='opacity:.7'>Please screenshot this and send it to us.</small>";}});
setTimeout(function(){var b=document.getElementById("tk-boot");if(b&&!window.__tkStarted){var m=document.getElementById("tk-boot-msg");if(m)m.innerHTML="Still loading… If this doesn't change, close the tab and open the link again.";}},12000);
</script>`;
if (!html.includes('id="tk-boot"')) html = html.replace("<body>", "<body>" + boot);
fs.writeFileSync(file, html);
console.log("Added the loading screen to public/app/index.html");
