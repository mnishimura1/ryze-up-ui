import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
export default function Sidebar({ navItems, currentPage, onPageChange, isOpen }) {
    return (_jsx("aside", { className: `${isOpen ? 'w-64' : 'w-0'} bg-dark-surface border-r border-dark-border overflow-hidden transition-all duration-300 flex flex-col`, children: _jsx("nav", { className: "flex-1 p-4 space-y-2", children: navItems.map((item) => (_jsxs("button", { onClick: () => onPageChange(item.id), className: `w-full flex items-center gap-3 px-4 py-3 rounded transition-colors ${currentPage === item.id
                    ? 'bg-accent text-dark-bg font-semibold'
                    : 'text-dark-text hover:bg-dark-bg'}`, children: [item.icon, _jsx("span", { className: "text-sm", children: item.label })] }, item.id))) }) }));
}
