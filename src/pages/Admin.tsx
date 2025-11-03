import { useState } from 'react'
import Card from '../components/Card'

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
`)
  const [showPreview, setShowPreview] = useState(true)

  const handlePublish = () => {
    console.log('Publishing CSS:', cssCode)
    alert('CSS published! Changes applied to the UI.')
  }

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
`)
    alert('CSS reverted to defaults.')
  }

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-8">Admin Panel</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* CSS Editor */}
        <div className="lg:col-span-2">
          <Card>
            <div className="p-6">
              <h2 className="text-xl font-semibold mb-4">CSS Editor</h2>
              <p className="text-sm text-dark-text/70 mb-4">
                Edit custom CSS for the Ryze Pro UI. Changes are applied in real-time.
              </p>
              <textarea
                value={cssCode}
                onChange={(e) => setCssCode(e.target.value)}
                className="w-full h-96 bg-dark-bg border border-dark-border rounded p-3 text-dark-text font-mono text-sm resize-none focus:outline-none focus:border-accent"
                spellCheck="false"
              />
              <div className="flex gap-3 mt-4">
                <button
                  onClick={handlePublish}
                  className="flex-1 bg-accent text-dark-bg font-semibold py-2 rounded hover:bg-accent/90 transition"
                >
                  Publish CSS
                </button>
                <button
                  onClick={handleRevert}
                  className="flex-1 bg-dark-border text-dark-text font-semibold py-2 rounded hover:bg-dark-border/80 transition"
                >
                  Revert
                </button>
              </div>
            </div>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Quick Actions */}
          <Card>
            <div className="p-6">
              <h2 className="text-xl font-semibold mb-4">Quick Actions</h2>
              <div className="space-y-2">
                <button className="w-full bg-dark-bg border border-dark-border text-dark-text py-2 rounded hover:bg-dark-border transition text-sm">
                  Clear Cache
                </button>
                <button className="w-full bg-dark-bg border border-dark-border text-dark-text py-2 rounded hover:bg-dark-border transition text-sm">
                  Reset Preferences
                </button>
                <button className="w-full bg-dark-bg border border-dark-border text-dark-text py-2 rounded hover:bg-dark-border transition text-sm">
                  Download Logs
                </button>
                <button className="w-full bg-dark-bg border border-dark-border text-dark-text py-2 rounded hover:bg-dark-border transition text-sm">
                  System Status
                </button>
              </div>
            </div>
          </Card>

          {/* Preview Settings */}
          <Card>
            <div className="p-6">
              <h2 className="text-xl font-semibold mb-4">Preview</h2>
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={showPreview}
                  onChange={(e) => setShowPreview(e.target.checked)}
                  className="w-4 h-4 cursor-pointer"
                />
                <span className="text-sm">Live Preview</span>
              </label>
              <p className="text-xs text-dark-text/50 mt-3">
                {showPreview
                  ? 'Changes are shown in real-time'
                  : 'Preview disabled'}
              </p>
            </div>
          </Card>

          {/* Version Info */}
          <Card>
            <div className="p-6">
              <h2 className="text-xl font-semibold mb-4">System Info</h2>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-dark-text/70">Version</span>
                  <span className="font-mono">1.0.0</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-dark-text/70">Build</span>
                  <span className="font-mono">20251030</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-dark-text/70">Environment</span>
                  <span className="font-mono">Production</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-dark-text/70">API</span>
                  <span className="font-mono">v1</span>
                </div>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  )
}
