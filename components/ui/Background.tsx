
import s from './Background.module.css';import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";

export default function Background() {
  return (
    _jsxs("div", { className: s.bg, children: [

      _jsx("div", { className: s.mesh }),


      _jsx("div", { className: `${s.orb} ${s.orb1}` }),
      _jsx("div", { className: `${s.orb} ${s.orb2}` }),
      _jsx("div", { className: `${s.orb} ${s.orb3}` }),


      _jsx("div", { className: s.grain }),


      _jsx("div", { className: s.vignette })] }
    ));

}