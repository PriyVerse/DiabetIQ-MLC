import re
import os

css_path = r"e:\MLC 2 prj\frontend\src\index.css"

with open(css_path, "r", encoding="utf-8") as f:
    css = f.read()

# 1. Replace the tokens in :root
new_tokens = """:root {
  --primary-50: #020617;
  --primary-100: #0f172a;
  --primary-200: #1e293b;
  --primary-300: #334155;
  --primary-400: #475569;
  --primary-500: #3b82f6;
  --primary-600: #60a5fa;
  --primary-700: #93c5fd;
  --primary-800: #bfdbfe;
  --primary-900: #dbeafe;
  --primary-950: #eff6ff;

  --accent-green: #10b981;
  --accent-green-light: #34d399;
  --accent-green-dark: #059669;

  --accent-red: #ef4444;
  --accent-red-light: #f87171;
  --accent-red-dark: #b91c1c;

  --accent-amber: #f59e0b;
  --accent-amber-light: #fbbf24;

  --surface: #0f172a;
  --surface-secondary: #1e293b;
  --surface-tertiary: #334155;
  --surface-glass: rgba(15, 23, 42, 0.7);

  --text-primary: #f8fafc;
  --text-secondary: #cbd5e1;
  --text-muted: #94a3b8;

  --border: #334155;
  --border-light: #1e293b;

  --shadow-sm: 0 1px 2px 0 rgba(0, 0, 0, 0.5);
  --shadow-md: 0 4px 6px -1px rgba(0, 0, 0, 0.5), 0 2px 4px -2px rgba(0, 0, 0, 0.5);
  --shadow-lg: 0 10px 15px -3px rgba(0, 0, 0, 0.6), 0 4px 6px -4px rgba(0, 0, 0, 0.4);
  --shadow-xl: 0 20px 25px -5px rgba(0, 0, 0, 0.6), 0 8px 10px -6px rgba(0, 0, 0, 0.4);
  --shadow-glow-blue: 0 0 40px rgba(59, 130, 246, 0.3);
  --shadow-glow-green: 0 0 40px rgba(16, 185, 129, 0.3);
  --shadow-glow-red: 0 0 40px rgba(239, 68, 68, 0.3);

  --radius-sm: 8px;
  --radius-md: 12px;
  --radius-lg: 16px;
  --radius-xl: 24px;
  --radius-full: 9999px;

  --font-sans: 'Inter', system-ui, -apple-system, sans-serif;
  --font-display: 'Inter', system-ui, sans-serif;
}"""

# Using regex to replace the :root block
css = re.sub(r':root\s*\{.*?\n\}', new_tokens, css, flags=re.DOTALL)

# 2. Replace hardcoded body background
body_bg = """body {
  margin: 0;
  padding: 0;
  font-family: var(--font-sans);
  color: var(--text-primary);
  background: radial-gradient(circle at top right, #0f172a, #020617 40%, #000000);
  min-height: 100vh;
  line-height: 1.6;
}"""
css = re.sub(r'body\s*\{[^}]*background:[^}]*\}', body_bg, css)

# 3. Replace all "background: white;" and "background: #ffffff;" to "background: var(--surface);"
css = re.sub(r'background:\s*white;', 'background: var(--surface);', css)
css = re.sub(r'background:\s*#ffffff;', 'background: var(--surface);', css)

# 4. Replace specific background rules for insight cards
css = css.replace("background: linear-gradient(135deg, #f0fdf4, #ecfdf5);", "background: linear-gradient(135deg, rgba(16, 185, 129, 0.1), rgba(16, 185, 129, 0.05));")
css = css.replace("border-color: #bbf7d0;", "border-color: rgba(16, 185, 129, 0.3);")

css = css.replace("background: linear-gradient(135deg, #fffbeb, #fef3c7);", "background: linear-gradient(135deg, rgba(245, 158, 11, 0.1), rgba(245, 158, 11, 0.05));")
css = css.replace("border-color: #fde68a;", "border-color: rgba(245, 158, 11, 0.3);")

css = css.replace("background: linear-gradient(135deg, #eff6ff, #dbeafe);", "background: linear-gradient(135deg, rgba(59, 130, 246, 0.1), rgba(59, 130, 246, 0.05));")
css = css.replace("border-color: #bfdbfe;", "border-color: rgba(59, 130, 246, 0.3);")

with open(css_path, "w", encoding="utf-8") as f:
    f.write(css)

print("Updated index.css successfully.")
