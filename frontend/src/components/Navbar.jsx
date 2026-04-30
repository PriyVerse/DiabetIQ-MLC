import { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { Activity, Home, Sparkles, BarChart3, Database, Menu, X } from 'lucide-react'

const navLinks = [
  { to: '/', label: 'Home', icon: Home },
  { to: '/predict', label: 'Predict', icon: Sparkles },
  { to: '/visualize', label: 'Visualize', icon: BarChart3 },
  { to: '/data', label: 'Data Info', icon: Database },
]

export default function Navbar() {
  const location = useLocation()
  const [mobileOpen, setMobileOpen] = useState(false)

  return (
    <nav className="glass" style={{
      position: 'sticky', top: 0, zIndex: 50, width: '100%',
      borderBottom: '1px solid rgba(255,255,255,0.2)',
      boxShadow: 'var(--shadow-md)',
    }}>
      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 24px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: 64 }}>
          {/* Logo */}
          <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: 10, textDecoration: 'none' }} id="nav-logo">
            <div style={{
              width: 36, height: 36, borderRadius: 12,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              background: 'linear-gradient(135deg, var(--primary-600), var(--accent-green))',
            }}>
              <Activity style={{ width: 20, height: 20, color: 'white' }} />
            </div>
            <span className="font-display gradient-text" style={{ fontSize: '1.25rem', fontWeight: 700 }}>DiabetIQ</span>
          </Link>

          {/* Desktop Links */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 4 }} className="nav-desktop">
            {navLinks.map(({ to, label, icon: Icon }) => {
              const active = location.pathname === to
              return (
                <Link
                  key={to}
                  to={to}
                  id={`nav-${label.toLowerCase().replace(/\s+/g, '-')}`}
                  style={{
                    display: 'flex', alignItems: 'center', gap: 8,
                    padding: '8px 16px', borderRadius: 12,
                    fontSize: '0.875rem', fontWeight: 500,
                    textDecoration: 'none',
                    transition: 'all 0.2s ease',
                    ...(active
                      ? {
                          background: 'linear-gradient(135deg, var(--primary-600), var(--primary-500))',
                          color: 'white',
                          boxShadow: '0 4px 12px rgba(37,99,235,0.3)',
                        }
                      : { color: 'var(--text-secondary)' }
                    ),
                  }}
                  onMouseEnter={(e) => { if (!active) e.currentTarget.style.background = 'rgba(255,255,255,0.5)' }}
                  onMouseLeave={(e) => { if (!active) e.currentTarget.style.background = 'transparent' }}
                >
                  <Icon style={{ width: 16, height: 16 }} />
                  {label}
                </Link>
              )
            })}
          </div>

          {/* Mobile toggle */}
          <button
            id="mobile-menu-toggle"
            className="nav-mobile-btn"
            onClick={() => setMobileOpen(!mobileOpen)}
            style={{
              display: 'none', padding: 8, borderRadius: 12, border: 'none', cursor: 'pointer',
              background: 'transparent', color: 'var(--text-secondary)',
            }}
          >
            {mobileOpen ? <X style={{ width: 20, height: 20 }} /> : <Menu style={{ width: 20, height: 20 }} />}
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileOpen && (
          <div className="animate-slide-down nav-mobile-menu" style={{ paddingBottom: 16 }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
              {navLinks.map(({ to, label, icon: Icon }) => {
                const active = location.pathname === to
                return (
                  <Link
                    key={to}
                    to={to}
                    onClick={() => setMobileOpen(false)}
                    style={{
                      display: 'flex', alignItems: 'center', gap: 12,
                      padding: '12px 16px', borderRadius: 12,
                      fontSize: '0.875rem', fontWeight: 500,
                      textDecoration: 'none',
                      ...(active
                        ? { background: 'linear-gradient(135deg, var(--primary-600), var(--primary-500))', color: 'white' }
                        : { color: 'var(--text-secondary)' }
                      ),
                    }}
                  >
                    <Icon style={{ width: 16, height: 16 }} />
                    {label}
                  </Link>
                )
              })}
            </div>
          </div>
        )}
      </div>

      <style>{`
        @media (max-width: 767px) {
          .nav-desktop { display: none !important; }
          .nav-mobile-btn { display: flex !important; }
        }
      `}</style>
    </nav>
  )
}
