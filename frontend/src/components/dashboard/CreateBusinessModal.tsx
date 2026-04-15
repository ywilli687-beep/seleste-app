import { useState } from 'react'
import { useCreateBusiness } from '@/lib/hooks/useDashboard'

const INDUSTRIES = [
  ['AUTO_REPAIR','Auto Repair'],['DENTAL','Dental'],['RESTAURANT','Restaurant'],
  ['PLUMBING','Plumbing'],['HVAC','HVAC'],['LAW_FIRM','Law Firm'],
  ['REAL_ESTATE','Real Estate'],['MEDICAL','Medical'],['VETERINARY','Veterinary'],
  ['SALON_SPA','Salon / Spa'],['GYM_FITNESS','Gym / Fitness'],['ACCOUNTING','Accounting'],
  ['INSURANCE','Insurance'],['ROOFING','Roofing'],['LANDSCAPING','Landscaping'],
  ['OTHER','Other'],
]

interface Props { onClose: () => void }

export function CreateBusinessModal({ onClose }: Props) {
  const [name,     setName]     = useState('')
  const [website,  setWebsite]  = useState('')
  const [industry, setIndustry] = useState('')
  const [city,     setCity]     = useState('')
  const [region,   setRegion]   = useState('')
  const [err,      setErr]      = useState('')

  const createBusiness = useCreateBusiness()

  async function submit() {
    setErr('')
    if (!name.trim())    return setErr('Business name is required.')
    if (!website.trim()) return setErr('Website URL is required.')
    if (!industry)       return setErr('Industry is required.')

    let url = website.trim()
    if (!/^https?:\/\//i.test(url)) url = 'https://' + url
    try { new URL(url) } catch { return setErr('Enter a valid URL.') }

    try {
      await createBusiness.mutateAsync({ name: name.trim(), website: url, industry, city: city.trim() || undefined, region: region.trim() || undefined })
      onClose()
    } catch (e: any) {
      setErr(e?.message || 'Failed to create business.')
    }
  }

  return (
    <div className="modal-overlay" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="modal-box">
        <div className="modal-header">
          <span className="modal-title">Add business</span>
          <button className="modal-close" onClick={onClose}>×</button>
        </div>

        <div className="modal-body">
          <div className="modal-field">
            <label className="modal-label">Business name *</label>
            <input className="modal-input" value={name} onChange={(e) => setName(e.target.value)} placeholder="Apex Auto Repair" />
          </div>
          <div className="modal-field">
            <label className="modal-label">Website *</label>
            <input className="modal-input" value={website} onChange={(e) => setWebsite(e.target.value)} placeholder="https://yourbusiness.com" />
          </div>
          <div className="modal-field">
            <label className="modal-label">Industry *</label>
            <select className="modal-input" value={industry} onChange={(e) => setIndustry(e.target.value)}>
              <option value="">Select industry…</option>
              {INDUSTRIES.map(([v, l]) => <option key={v} value={v}>{l}</option>)}
            </select>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
            <div className="modal-field">
              <label className="modal-label">City</label>
              <input className="modal-input" value={city} onChange={(e) => setCity(e.target.value)} placeholder="Austin" />
            </div>
            <div className="modal-field">
              <label className="modal-label">State</label>
              <input className="modal-input" value={region} onChange={(e) => setRegion(e.target.value)} placeholder="TX" />
            </div>
          </div>
          {err && <div className="modal-error">{err}</div>}
        </div>

        <div className="modal-footer">
          <button className="os-btn os-btn--ghost" onClick={onClose}>Cancel</button>
          <button
            className="os-btn os-btn--primary"
            onClick={submit}
            disabled={createBusiness.isPending}
          >
            {createBusiness.isPending ? 'Creating…' : 'Create business'}
          </button>
        </div>
      </div>
    </div>
  )
}
