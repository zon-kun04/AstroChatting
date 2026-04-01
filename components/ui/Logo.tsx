
import s from './Logo.module.css';import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";

const astroMark = ({ size = 48 }) =>
_jsxs("svg", { width: size, height: size, viewBox: "0 0 48 48", fill: "none", xmlns: "http://www.w3.org/2000/svg", children: [
  _jsx("rect", { width: "48", height: "48", rx: "14", fill: "#5865F2" }),

  _jsx("path", {
    d: "M13 14L24 34L35 14",
    stroke: "white",
    strokeWidth: "4.5",
    strokeLinecap: "round",
    strokeLinejoin: "round" }
  ),
  _jsx("path", {
    d: "M18 14L24 26L30 14",
    stroke: "white",
    strokeWidth: "2.5",
    strokeLinecap: "round",
    strokeLinejoin: "round",
    opacity: "0.5" }
  )] }
);








const sizes = { sm: 36, md: 48, lg: 60 };
const textSizes = { sm: 18, md: 22, lg: 28 };

export default function Logo({ size = 'md', showText = true, centered = true }) {
  return (
    _jsxs("div", { className: [s.wrap, centered ? s.centered : ''].join(' '), children: [
      _jsx("div", { className: s.mark, style: { filter: 'drop-shadow(0 0 20px rgba(88,101,242,0.5))' }, children:
        _jsx("astroMark", { size: sizes[size] }) }
      ),
      showText &&
      _jsx("span", { className: s.text, style: { fontSize: textSizes[size] }, children: "Astro" }

      )] }

    ));

}