
import s from './PasswordStrength.module.css';import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";

function getStrength(p) {
  let score = 0;
  if (p.length >= 8) score++;
  if (p.length >= 12) score++;
  if (/[A-Z]/.test(p)) score++;
  if (/[0-9]/.test(p)) score++;
  if (/[^A-Za-z0-9]/.test(p)) score++;

  const map = [
  { label: 'Muy débil', color: '#f23f43' },
  { label: 'Débil', color: '#f23f43' },
  { label: 'Regular', color: '#f0b232' },
  { label: 'Buena', color: '#f0b232' },
  { label: 'Fuerte', color: '#23a55a' },
  { label: 'Perfecta', color: '#23a55a' }];

  return { score, ...map[score] };
}

export default function PasswordStrength({ password }) {
  if (!password) return null;
  const { score, label, color } = getStrength(password);

  return (
    _jsxs("div", { className: s.wrap, children: [
      _jsx("div", { className: s.bars, children:
        [0, 1, 2, 3, 4].map((i) =>
        _jsx("div", {

          className: s.bar,
          style: { background: i < score ? color : undefined } }, i
        )
        ) }
      ),
      _jsx("span", { className: s.label, style: { color }, children: label })] }
    ));

}