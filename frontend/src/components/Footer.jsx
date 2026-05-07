import { Activity, Heart } from 'lucide-react'

export default function Footer() {
  return (
    <footer style={{
      borderTop: '1px solid var(--border)',
      background: 'var(--surface-glass)',
      width: '100%',
      marginTop: 'auto',
    }}>
      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '32px 24px' }}>
        <div style={{
          display: 'flex', flexWrap: 'wrap', alignItems: 'center',
          justifyContent: 'space-between', gap: 16,
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <div style={{
              width: 28, height: 28, borderRadius: 8,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              background: 'linear-gradient(135deg, var(--primary-600), var(--accent-green))',
            }}>
              <Activity style={{ width: 16, height: 16, color: 'white' }} />
            </div>
            <span className="font-display gradient-text" style={{ fontSize: '0.875rem', fontWeight: 600 }}>DiabetIQ</span>
          </div>
          <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: 4 }}>
            Built with <Heart style={{ width: 12, height: 12, color: 'var(--accent-red)' }} /> using PIMA Indians Diabetes Dataset
          </p>
          <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
            © {new Date().getFullYear()} DiabetIQ. For educational purposes only.
          </p>
        </div>
      </div>
    </footer>
  )
}
