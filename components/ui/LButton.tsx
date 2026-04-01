
import s from './Button.module.css';import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";







export default function Button({
  variant = 'primary',
  loading = false,
  fullWidth = true,
  children,
  disabled,
  className = '',
  ...rest
}) {
  return (
    _jsxs("button", {
      className: [s.btn, s[variant], fullWidth ? s.full : '', className].join(' '),
      disabled: disabled || loading, ...
      rest, children: [

      loading && _jsx("span", { className: s.spinner }),
      children] }
    ));

}