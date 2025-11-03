import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from 'react';
import Card from '../components/Card';
export default function Admin() {
    const [cssCode, setCssCode] = useState(`/* Ryze Pro UI Custom Styles */

:root {
  --dark-bg: #0a0e27;
  --dark-surface: #111428;
  --dark-border: #1e223c;
  --accent: #22d3ee;
  --dark-text: #f0f4f8;
}

body {
  background-color: var(--dark-bg);
  color: var(--dark-text);
}

.card {
  background-color: var(--dark-surface);
  border: 1px solid var(--dark-border);
  border-radius: 0.5rem;
}
`);
    const [showPreview, setShowPreview] = useState(true);
    const handlePublish = () => {
        console.log('Publishing CSS:', cssCode);
        alert('CSS published! Changes applied to the UI.');
    };
    const handleRevert = () => {
        setCssCode(`/* Ryze Pro UI Custom Styles */

:root {
  --dark-bg: #0a0e27;
  --dark-surface: #111428;
  --dark-border: #1e223c;
  --accent: #22d3ee;
  --dark-text: #f0f4f8;
}

body {
  background-color: var(--dark-bg);
  color: var(--dark-text);
}

.card {
  background-color: var(--dark-surface);
  border: 1px solid var(--dark-border);
  border-radius: 0.5rem;
}
`);
        alert('CSS reverted to defaults.');
    };
    return (_jsxs("div", { className: "p-8", children: [_jsx("h1", { className: "text-3xl font-bold mb-8", children: "Admin Panel" }), _jsxs("div", { className: "grid grid-cols-1 lg:grid-cols-3 gap-6", children: [_jsx("div", { className: "lg:col-span-2", children: _jsx(Card, { children: _jsxs("div", { className: "p-6", children: [_jsx("h2", { className: "text-xl font-semibold mb-4", children: "CSS Editor" }), _jsx("p", { className: "text-sm text-dark-text/70 mb-4", children: "Edit custom CSS for the Ryze Pro UI. Changes are applied in real-time." }), _jsx("textarea", { value: cssCode, onChange: (e) => setCssCode(e.target.value), className: "w-full h-96 bg-dark-bg border border-dark-border rounded p-3 text-dark-text font-mono text-sm resize-none focus:outline-none focus:border-accent", spellCheck: "false" }), _jsxs("div", { className: "flex gap-3 mt-4", children: [_jsx("button", { onClick: handlePublish, className: "flex-1 bg-accent text-dark-bg font-semibold py-2 rounded hover:bg-accent/90 transition", children: "Publish CSS" }), _jsx("button", { onClick: handleRevert, className: "flex-1 bg-dark-border text-dark-text font-semibold py-2 rounded hover:bg-dark-border/80 transition", children: "Revert" })] })] }) }) }), _jsxs("div", { className: "space-y-6", children: [_jsx(Card, { children: _jsxs("div", { className: "p-6", children: [_jsx("h2", { className: "text-xl font-semibold mb-4", children: "Quick Actions" }), _jsxs("div", { className: "space-y-2", children: [_jsx("button", { className: "w-full bg-dark-bg border border-dark-border text-dark-text py-2 rounded hover:bg-dark-border transition text-sm", children: "Clear Cache" }), _jsx("button", { className: "w-full bg-dark-bg border border-dark-border text-dark-text py-2 rounded hover:bg-dark-border transition text-sm", children: "Reset Preferences" }), _jsx("button", { className: "w-full bg-dark-bg border border-dark-border text-dark-text py-2 rounded hover:bg-dark-border transition text-sm", children: "Download Logs" }), _jsx("button", { className: "w-full bg-dark-bg border border-dark-border text-dark-text py-2 rounded hover:bg-dark-border transition text-sm", children: "System Status" })] })] }) }), _jsx(Card, { children: _jsxs("div", { className: "p-6", children: [_jsx("h2", { className: "text-xl font-semibold mb-4", children: "Preview" }), _jsxs("label", { className: "flex items-center gap-3 cursor-pointer", children: [_jsx("input", { type: "checkbox", checked: showPreview, onChange: (e) => setShowPreview(e.target.checked), className: "w-4 h-4 cursor-pointer" }), _jsx("span", { className: "text-sm", children: "Live Preview" })] }), _jsx("p", { className: "text-xs text-dark-text/50 mt-3", children: showPreview
                                                ? 'Changes are shown in real-time'
                                                : 'Preview disabled' })] }) }), _jsx(Card, { children: _jsxs("div", { className: "p-6", children: [_jsx("h2", { className: "text-xl font-semibold mb-4", children: "System Info" }), _jsxs("div", { className: "space-y-2 text-sm", children: [_jsxs("div", { className: "flex justify-between", children: [_jsx("span", { className: "text-dark-text/70", children: "Version" }), _jsx("span", { className: "font-mono", children: "1.0.0" })] }), _jsxs("div", { className: "flex justify-between", children: [_jsx("span", { className: "text-dark-text/70", children: "Build" }), _jsx("span", { className: "font-mono", children: "20251030" })] }), _jsxs("div", { className: "flex justify-between", children: [_jsx("span", { className: "text-dark-text/70", children: "Environment" }), _jsx("span", { className: "font-mono", children: "Production" })] }), _jsxs("div", { className: "flex justify-between", children: [_jsx("span", { className: "text-dark-text/70", children: "API" }), _jsx("span", { className: "font-mono", children: "v1" })] })] })] }) })] })] })] }));
}
