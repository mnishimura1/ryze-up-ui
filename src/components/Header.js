import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Menu } from 'lucide-react';
export default function Header({ onMenuClick }) {
    return (_jsxs("header", { className: "h-16 bg-dark-surface border-b border-dark-border flex items-center px-6", children: [_jsx("button", { onClick: onMenuClick, className: "p-2 hover:bg-dark-bg rounded transition-colors", children: _jsx(Menu, { className: "w-5 h-5" }) }), _jsx("h1", { className: "ml-4 text-2xl font-bold text-accent", children: "RYZE Pro" })] }));
}
