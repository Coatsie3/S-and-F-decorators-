import { cpSync, rmSync, copyFileSync } from "node:fs";
rmSync("dist", { recursive: true, force: true });
cpSync("public", "dist", { recursive: true });
// One HTML file per page so /services, /projects etc. load directly
for (const p of ["services", "projects", "about", "contact"]) {
  copyFileSync("dist/index.html", `dist/${p}.html`);
}
console.log("Built dist/");
