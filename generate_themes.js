const fs = require('fs');

const NEW_THEMES = [
{ key: "crimson", label: "Crimson Blood", desc: "Rojos intensos y oscuros, ideal para ambientes nocturnos o vampíricos.", base: "#1a0505", side: "#260a0a", dark: "#0f0202", primary: "#e60000" },
{ key: "nebula", label: "Nebula Dreams", desc: "Morados y violetas del espacio profundo. Elegante y cósmico.", base: "#0f051a", side: "#170a26", dark: "#09020f", primary: "#9d4edd" },
{ key: "solar", label: "Solar Flare", desc: "Naranjas y amarillos ardientes. Siente el poder del sol.", base: "#1a0f05", side: "#26170a", dark: "#0f0902", primary: "#ffaa00" },
{ key: "abyss", label: "Abyssal Depths", desc: "Azules marinos casi negros. El vacío total.", base: "#050a1a", side: "#0a1226", dark: "#02050f", primary: "#0077b6" },
{ key: "jade", label: "Jade Serenity", desc: "El verde pulido del jade. Tranquilidad y equilibrio.", base: "#051a14", side: "#0a261d", dark: "#020f09", primary: "#00b48a" },
{ key: "bubblegum", label: "Bubblegum Pop", desc: "Rosa chicle explosivo. Muy brillante, muy pop.", base: "#1a0515", side: "#260a1f", dark: "#0f020c", primary: "#ff70a6" },
{ key: "lavender", label: "Lavender Frost", desc: "Tonos pastel suaves de lavanda.", base: "#242038", side: "#332d52", dark: "#1a1629", primary: "#c8b6ff" },
{ key: "hacker", label: "Hacker Terminal", desc: "Clásico fósforo verde sobre negro terminal retro.", base: "#000000", side: "#050505", dark: "#000000", primary: "#00ff00" },
{ key: "dracula", label: "Dracula", desc: "La famosa paleta dracula para vampiros de la programación.", base: "#282a36", side: "#44475a", dark: "#21222c", primary: "#ff79c6" },
{ key: "nord", label: "Nord", desc: "Frío invierno ártico, inspirado en la paleta Nord.", base: "#2e3440", side: "#3b4252", dark: "#242933", primary: "#88c0d0" },
{ key: "monokai", label: "Monokai Pro", desc: "Alto contraste oscuro, inspirado en Monokai.", base: "#272822", side: "#3e3d32", dark: "#1c1d19", primary: "#f92672" },
{ key: "tokyo", label: "Tokyo Night", desc: "Colores suaves del Japón nocturno.", base: "#1a1b26", side: "#24283b", dark: "#16161e", primary: "#7aa2f7" },
{ key: "synthwave", label: "Synthwave '84", desc: "Directamente sacado de la estética retro futurista ochentera.", base: "#262335", side: "#322d45", dark: "#1f1d2c", primary: "#ff007f" },
{ key: "gruvbox", label: "Gruvbox Dark", desc: "Tonos tierra cálidos inspirados en el clásico gruvbox.", base: "#282828", side: "#3c3836", dark: "#1d2021", primary: "#fb4934" },
{ key: "material", label: "Material Oceanic", desc: "Elegancia pura con azul profundo inspirado en Material Design.", base: "#263238", side: "#37474f", dark: "#1d262b", primary: "#80cbc4" },
{ key: "rose", label: "Rosé Pine", desc: "Tonos pino y rosa cálido, minimalista y limpio.", base: "#191724", side: "#26233a", dark: "#110f18", primary: "#ebbcba" },
{ key: "catppuccin", label: "Catppuccin Mocha", desc: "Tonos pastel súper cálidos y agradables a la vista.", base: "#1e1e2e", side: "#313244", dark: "#181825", primary: "#cba6f7" },
{ key: "github", label: "GitHub Dark", desc: "El famoso modo oscuro de GitHub.", base: "#0d1117", side: "#161b22", dark: "#010409", primary: "#58a6ff" },
{ key: "obsidian", label: "Obsidian", desc: "Gris oscuro liso para extrema concentración.", base: "#1c1e26", side: "#252733", dark: "#15171e", primary: "#ff6bb3" },
{ key: "cobalt", label: "Cobalt 2", desc: "El clásico Cobalt2, azul intenso y amarillo.", base: "#193549", side: "#224b67", dark: "#122633", primary: "#ffc600" },
{ key: "vampire", label: "Vampire Lord", desc: "El contraste absoluto entre negro azabache y rojo sangre.", base: "#000000", side: "#0a0a0a", dark: "#000000", primary: "#ff0000" },
{ key: "slime", label: "Slime Green", desc: "Rebosa energía con un verde ácido y fluorescente.", base: "#051a05", side: "#0a260a", dark: "#020f02", primary: "#aaff00" },
{ key: "coral", label: "Coral Reef", desc: "Rojos y naranjas exóticos del arrecife marino.", base: "#1a0b0a", side: "#261311", dark: "#0f0504", primary: "#ff6b6b" },
{ key: "quartz", label: "Quartz Crystal", desc: "Rosado suave de cuarzo pálido.", base: "#211a1d", side: "#2e242a", dark: "#171013", primary: "#f4acb7" },
{ key: "amber", label: "Amber Alert", desc: "Color ámbar vintage, terminal computacional de los 70s.", base: "#120a00", side: "#1c1000", dark: "#0a0500", primary: "#ffb000" },
{ key: "electric", label: "Electric Cyan", desc: "Cyan impactante como un rayo de electricidad puro.", base: "#001a1a", side: "#002626", dark: "#000f0f", primary: "#00ffff" },
{ key: "magenta", label: "Magenta Madness", desc: "Morado fucsia rompedor.", base: "#1a001a", side: "#260026", dark: "#0f000f", primary: "#ff00ff" },
{ key: "sapphire", label: "Sapphire Glow", desc: "Brillo de zafiro iridiscente.", base: "#020b1c", side: "#04163a", dark: "#010712", primary: "#4361ee" },
{ key: "emerald", label: "Emerald City", desc: "El verde brillante de la ciudad esmeralda.", base: "#051f11", side: "#0a331c", dark: "#03120a", primary: "#2ecc71" },
{ key: "royal", label: "Royal Purple", desc: "Violeta de la realeza, distinguido y solemne.", base: "#10091f", side: "#191133", dark: "#0a0514", primary: "#7b2cbf" },
{ key: "peach", label: "Peach Puff", desc: "Tonos durazno para una experiencia dulzona.", base: "#2b1c18", side: "#402b25", dark: "#1c110d", primary: "#ffb5a7" },
{ key: "olive", label: "Olive Grove", desc: "Verde aceituna relajante, perfecto de día y noche.", base: "#171c0d", side: "#242b15", dark: "#0e1208", primary: "#a7c957" },
{ key: "chestnut", label: "Chestnut Wood", desc: "Colores madera cálidos acogedores.", base: "#1c110a", side: "#2b1b10", dark: "#110a05", primary: "#d4a373" }];


function shadeColor(color, percent) {
  if (!color) return "";
  let R = parseInt(color.substring(1, 3), 16);
  let G = parseInt(color.substring(3, 5), 16);
  let B = parseInt(color.substring(5, 7), 16);
  if (isNaN(R) || isNaN(G) || isNaN(B)) return color;
  R = parseInt(R * (100 + percent) / 100);
  G = parseInt(G * (100 + percent) / 100);
  B = parseInt(B * (100 + percent) / 100);
  R = R < 255 ? R : R < 0 ? 0 : R;
  G = G < 255 ? G : G < 0 ? 0 : G;
  B = B < 255 ? B : B < 0 ? 0 : B;
  const RR = R.toString(16).length == 1 ? "0" + R.toString(16) : R.toString(16);
  const GG = G.toString(16).length == 1 ? "0" + G.toString(16) : G.toString(16);
  const BB = B.toString(16).length == 1 ? "0" + B.toString(16) : B.toString(16);
  return "#" + RR + GG + BB;
}


const hookFile = 'hooks/use-app-state.ts';
let hookContent = fs.readFileSync(hookFile, 'utf-8');
const allKeys = NEW_THEMES.map((t) => `"${t.key}"`).join(" | ");
hookContent = hookContent.replace(/export type AppTheme = (.*)/, `export type AppTheme = $1 | ${allKeys}`);
const removesStr = NEW_THEMES.map((t) => `"theme-${t.key}"`).join(", ");
hookContent = hookContent.replace(/"theme-forest", "theme-matrix"/, `"theme-forest", "theme-matrix", ${removesStr}`);
fs.writeFileSync(hookFile, hookContent);


const beSettings = '../Astro Backend/routes/settings.js';
let beContent = fs.readFileSync(beSettings, 'utf-8');
const validThemesString = NEW_THEMES.map((t) => `'${t.key}'`).join(", ");
beContent = beContent.replace(/const validThemes = \[(.*?)\];/, `const validThemes = [$1, ${validThemesString}];`);
fs.writeFileSync(beSettings, beContent);


let extraCSS = `\n\n/* ================= ${NEW_THEMES.length} NEW PREMIUM THEMES ================= */\n`;
NEW_THEMES.forEach((t) => {
  const hover = shadeColor(t.primary, -15);
  const accent = shadeColor(t.primary, 30);
  const border = shadeColor(t.side, 20);
  const fg = shadeColor(t.primary, 200);
  extraCSS += `\n/* ${t.label} */
.theme-${t.key} {
  --background: ${t.base};
  --discord-chat: ${t.base};
  --discord-sidebar: ${t.side};
  --discord-darker: ${t.dark};
  --discord-blurple: ${t.primary};
  --discord-blurple-hover: ${hover};
  --primary: ${t.primary};
  --accent: ${accent};
  --border: ${border};
  --foreground: ${fg};
}\n`;
});
fs.appendFileSync('app/globals.css', extraCSS);


const settingsFile = 'components/app/overlays/SettingsOverlay.tsx';
let settingsContent = fs.readFileSync(settingsFile, 'utf-8');
const injectionObjects = NEW_THEMES.map((t) => `    { 
      key: "${t.key}", label: "${t.label}", 
      desc: "${t.desc}", 
      color: "${t.base}",
      preview: ["${t.base}", "${t.side}", "${t.primary}"]
    },`).join("\n");
settingsContent = settingsContent.replace(/key: "matrix"(.*?)\},\n  \]/s, `key: "matrix"$1},\n${injectionObjects}\n  ]`);
fs.writeFileSync(settingsFile, settingsContent);

console.log("SUCCESS");