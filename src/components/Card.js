import { jsx as _jsx } from "react/jsx-runtime";
export default function Card({ children, className = '' }) {
    return (_jsx("div", { className: `bg-dark-surface border border-dark-border rounded-lg hover:border-accent/50 transition-colors ${className}`, children: children }));
}
