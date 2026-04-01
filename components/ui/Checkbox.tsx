
import { IconCheck } from '../icons';
import s from './Checkbox.module.css';import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";








export default function Checkbox({ checked, onChange, children, error }) {
  return (
    _jsxs("div", { className: s.wrap, children: [
      _jsxs("label", { className: s.row, onClick: onChange, children: [
        _jsx("span", { className: [s.box, checked ? s.checked : ''].join(' '), children:
          checked && _jsx(IconCheck, { size: 11, color: "#fff" }) }
        ),
        _jsx("span", { className: s.text, children: children })] }
      ),
      error && _jsx("span", { className: s.err, children: error })] }
    ));

}