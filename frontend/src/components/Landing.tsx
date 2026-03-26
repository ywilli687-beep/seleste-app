'use client'
const PILLARS = [
  {e:'🔍',n:'Discoverability'},{e:'⚡',n:'Performance'},{e:'🎯',n:'Conversion'},
  {e:'🛡️',n:'Trust'},{e:'✨',n:'UX'},{e:'📝',n:'Content'},
  {e:'📊',n:'Data & Tracking'},{e:'⚙️',n:'Technical'},{e:'📈',n:'Scalability'},{e:'💎',n:'Brand'},
]
export default function Landing({ onStart }: { onStart: () => void }) {
  return (
    <div style={{minHeight:'100vh',display:'flex',flexDirection:'column'}}>
      <nav style={{position:'fixed',top:0,left:0,right:0,zIndex:100,display:'flex',alignItems:'center',justifyContent:'space-between',padding:'0 2rem',height:60,background:'rgba(10,10,15,.92)',backdropFilter:'blur(20px)',borderBottom:'1px solid var(--border)'}}>
        <div style={{fontFamily:'var(--ff-display)',fontSize:'1.25rem',color:'var(--accent)'}}>Seleste <span style={{color:'var(--text3)',fontSize:'.65rem',fontFamily:'var(--ff-mono)',marginLeft:8}}>AUDIT ENGINE V2</span></div>
        <div style={{display:'flex',alignItems:'center',gap:10}}>
          <a href="/history" style={{fontSize:13,color:'var(--text2)',textDecoration:'none',fontFamily:'var(--ff-sans)'}}>My Audits</a>
          <a href="/dashboard" style={{fontSize:13,color:'var(--text2)',textDecoration:'none',fontFamily:'var(--ff-sans)'}}>Intelligence</a>
          <button onClick={onStart} style={{background:'var(--accent)',border:'none',color:'#0a0a0f',padding:'8px 20px',borderRadius:'var(--rs)',cursor:'pointer',fontFamily:'var(--ff-sans)',fontSize:13,fontWeight:600}}>Run Audit</button>
        </div>
      </nav>
      <div style={{flex:1,display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center',textAlign:'center',padding:'120px 2rem 80px',background:'radial-gradient(ellipse 60% 40% at 50% 0%,rgba(200,169,110,.07) 0%,transparent 70%)'}}>
        <div style={{display:'inline-flex',alignItems:'center',gap:8,background:'var(--adim)',border:'1px solid rgba(200,169,110,.22)',padding:'6px 16px',borderRadius:99,marginBottom:'2rem',fontSize:12,fontFamily:'var(--ff-mono)',color:'var(--accent)',letterSpacing:'.07em'}}>
          <span style={{width:6,height:6,background:'var(--green)',borderRadius:'50%',animation:'blink 2s infinite',display:'inline-block'}}/>LIVE · Real Website Analysis
        </div>
        <h1 style={{fontFamily:'var(--ff-display)',fontSize:'clamp(2.8rem,7vw,5rem)',lineHeight:1.05,maxWidth:840,marginBottom:'1.5rem'}}>
          See what&apos;s costing you <em style={{color:'var(--accent)',fontStyle:'italic'}}>customers.</em>
        </h1>
        <p style={{fontSize:'1.05rem',color:'var(--text2)',maxWidth:520,marginBottom:'3rem',lineHeight:1.7}}>
          Enter any business URL. Seleste fetches the real page, extracts 60+ structured signals, scores across 10 pillars with deterministic rules, and builds a living data profile that gets richer with every audit.
        </p>
        <button onClick={onStart} style={{background:'var(--accent)',color:'#0a0a0f',border:'none',padding:'14px 32px',borderRadius:'var(--r)',cursor:'pointer',fontSize:15,fontWeight:600,fontFamily:'var(--ff-sans)'}}>
          Audit Your Website →
        </button>
      </div>
      <div style={{display:'flex',gap:'3rem',justifyContent:'center',padding:'2.5rem 2rem',borderTop:'1px solid var(--border)',flexWrap:'wrap'}}>
        {[{n:'60+',l:'Signals Captured'},{n:'47+',l:'Deterministic Rules'},{n:'3',l:'Data Layers'},{n:'∞',l:'Compounds Over Time'}].map(s=>(
          <div key={s.l} style={{textAlign:'center'}}>
            <div style={{fontFamily:'var(--ff-display)',fontSize:'2.4rem',color:'var(--accent)'}}>{s.n}</div>
            <div style={{fontSize:11,color:'var(--text3)',fontFamily:'var(--ff-mono)',textTransform:'uppercase',letterSpacing:'.1em',marginTop:4}}>{s.l}</div>
          </div>
        ))}
      </div>
      <div style={{display:'grid',gridTemplateColumns:'repeat(5,1fr)',gap:1,borderTop:'1px solid var(--border)',background:'var(--border)'}}>
        {PILLARS.map(p=>(
          <div key={p.n} style={{background:'var(--bg)',padding:'1.25rem 1rem',textAlign:'center',fontSize:11,color:'var(--text3)'}}>
            <span style={{fontSize:'1.4rem',display:'block',marginBottom:6}}>{p.e}</span>{p.n}
          </div>
        ))}
      </div>
    </div>
  )
}
