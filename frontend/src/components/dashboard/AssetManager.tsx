import type { DashboardData } from '../../types/dashboard'

interface AssetSlot {
  id: string
  name: string
  icon: string
  description: string
  category: string
}

const ASSET_SLOTS: AssetSlot[] = [
  { id: 'website',  name: 'Website',             icon: '🌐', description: 'Your main website and landing pages',      category: 'Web'       },
  { id: 'gbp',      name: 'Google Business',      icon: '📍', description: 'Manage your Google listing and reviews',  category: 'Local'     },
  { id: 'ga4',      name: 'Google Analytics',     icon: '📊', description: 'Traffic, sessions, and conversion data',  category: 'Analytics' },
  { id: 'gsc',      name: 'Search Console',       icon: '🔍', description: 'Keyword rankings and search impressions', category: 'SEO'       },
  { id: 'social',   name: 'Facebook / Instagram', icon: '📱', description: 'Social media presence and engagement',    category: 'Social'    },
  { id: 'listings', name: 'Local Listings',       icon: '📋', description: 'Yelp, TripAdvisor, and directories',     category: 'Local'     },
  { id: 'ads',      name: 'Google Ads',           icon: '💰', description: 'Paid search campaigns and spend',         category: 'Ads'       },
  { id: 'email',    name: 'Email Marketing',      icon: '✉️', description: 'Mailchimp, Klaviyo, or similar',          category: 'Marketing' },
]

function safeHostname(url: string): string {
  try { return new URL(url).hostname }
  catch { return url }
}

export function AssetManager({ data }: { data: DashboardData }) {
  const websiteUrl = data.recentAudits?.[0]?.inputUrl ?? null

  return (
    <div style={{ paddingBottom: 24 }}>
      <div style={{ padding: '12px 16px' }}>
        <div className="os-gt-section-title">Connected assets</div>
        <div style={{ marginTop: 4, fontSize: 12, color: 'var(--os-text-tert)', fontFamily: 'var(--ff-sans)', lineHeight: 1.6, maxWidth: 420 }}>
          Connect your platforms so agents can read data and take action across your entire growth stack.
        </div>
      </div>

      <div className="os-am-grid">
        {ASSET_SLOTS.map(slot => {
          const connected = slot.id === 'website' && !!websiteUrl
          return (
            <div key={slot.id} className={`os-am-card${connected ? ' connected' : ''}`}>
              <div className="os-am-card-top">
                <div className="os-am-icon">{slot.icon}</div>
                <div className={`os-am-status-dot ${connected ? 'connected' : 'missing'}`} />
              </div>
              <div className="os-am-name">{slot.name}</div>
              <div className="os-am-category">{slot.category}</div>
              <div className="os-am-desc">{slot.description}</div>
              {connected ? (
                <div className="os-am-connected-label">
                  {websiteUrl ? safeHostname(websiteUrl) : 'Connected'}
                </div>
              ) : (
                <button
                  className="os-am-connect-btn"
                  onClick={() => window.location.href = '/settings'}
                >
                  Connect
                </button>
              )}
            </div>
          )
        })}
      </div>

      {/* Summary row */}
      <div className="os-am-summary-row">
        <div className="os-am-summary-item">
          <span className="os-am-summary-val">
            {ASSET_SLOTS.filter(s => s.id === 'website' && !!websiteUrl).length}
          </span>
          <span className="os-am-summary-label">Connected</span>
        </div>
        <div className="os-am-summary-divider" />
        <div className="os-am-summary-item">
          <span className="os-am-summary-val">
            {ASSET_SLOTS.filter(s => s.id !== 'website' || !websiteUrl).length}
          </span>
          <span className="os-am-summary-label">Missing</span>
        </div>
        <div className="os-am-summary-divider" />
        <div className="os-am-summary-item">
          <span className="os-am-summary-label" style={{ color: 'var(--os-amber)' }}>
            Connect more to unlock deeper agent intelligence
          </span>
        </div>
      </div>
    </div>
  )
}
