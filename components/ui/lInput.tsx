
import s from './Input.module.css';import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";









export default function Input({
  label,
  error,
  icon,
  suffix,
  hint,
  className = '',
  ...rest
}) {
  return (
    _jsxs("div", { className: s.field, children: [
      label && _jsx("label", { className: s.label, children: label }),
      _jsxs("div", { className: s.inputWrap, children: [
        icon && _jsx("span", { className: s.icon, children: icon }),
        _jsx("input", {
          className: [s.input, icon ? s.hasIcon : '', error ? s.error : '', className].join(' '), ...
          rest }
        ),
        suffix && _jsx("span", { className: s.suffix, children: suffix })] }
      ),
      error && _jsx("span", { className: s.errMsg, children: error }),
      hint && !error && _jsx("span", { className: s.hint, children: hint })] }
    ));

}