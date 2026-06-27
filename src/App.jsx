import React, { useState, useEffect } from 'react';
import Papa from 'papaparse';

function App() {
  // Navigation State Management (Master Tabs & Sub Tabs Hierarchy)
  const [activeMasterTab, setActiveMasterTab] = useState('Performance Test');
  const [activeTab, setActiveTab] = useState('Recovery Rates');
  
  const [csvData, setCsvData] = useState([]);
  const [hoveredIndex, setHoveredIndex] = useState(null);
  
  // Fully Consolidated Routing Map (Phase 1 & Phase 2 URLs)
  const LINKS = {
    // Tier 1: Performance Test Logs Links
    'Recovery Rates': 'https://docs.google.com/spreadsheets/d/e/2PACX-1vQb7dtwmqSKn6lys3pd1WT2NmAAwdc_fVJ6YpNpMobWimEktQhWyRNdMy4EUFOnUzUtzWemhf3U6ijH/pub?gid=666154525&single=true&output=csv',
    'Flowrates': 'https://docs.google.com/spreadsheets/d/e/2PACX-1vQb7dtwmqSKn6lys3pd1WT2NmAAwdc_fVJ6YpNpMobWimEktQhWyRNdMy4EUFOnUzUtzWemhf3U6ijH/pub?gid=752533846&single=true&output=csv',
    'Energy': 'https://docs.google.com/spreadsheets/d/e/2PACX-1vQb7dtwmqSKn6lys3pd1WT2NmAAwdc_fVJ6YpNpMobWimEktQhWyRNdMy4EUFOnUzUtzWemhf3U6ijH/pub?gid=1410646242&single=true&output=csv',
    'Water Quality': 'https://docs.google.com/spreadsheets/d/e/2PACX-1vQb7dtwmqSKn6lys3pd1WT2NmAAwdc_fVJ6YpNpMobWimEktQhWyRNdMy4EUFOnUzUtzWemhf3U6ijH/pub?gid=94469735&single=true&output=csv',
    'Chemicals': 'https://docs.google.com/spreadsheets/d/e/2PACX-1vQb7dtwmqSKn6lys3pd1WT2NmAAwdc_fVJ6YpNpMobWimEktQhWyRNdMy4EUFOnUzUtzWemhf3U6ijH/pub?gid=1249471558&single=true&output=csv',
    'Lab Sample': 'https://docs.google.com/spreadsheets/d/e/2PACX-1vQb7dtwmqSKn6lys3pd1WT2NmAAwdc_fVJ6YpNpMobWimEktQhWyRNdMy4EUFOnUzUtzWemhf3U6ijH/pub?gid=1527181083&single=true&output=csv',
    'DM Water Cost': 'https://docs.google.com/spreadsheets/d/e/2PACX-1vQb7dtwmqSKn6lys3pd1WT2NmAAwdc_fVJ6YpNpMobWimEktQhWyRNdMy4EUFOnUzUtzWemhf3U6ijH/pub?gid=1077795434&single=true&output=csv',

    // Tier 2: Monthly Performance OPEX Links (Phase 2 Uploads)
    'DM Water Production': 'https://docs.google.com/spreadsheets/d/e/2PACX-1vSve3TGoAt4cBMLzvfCu5u5YWl57WENTY4s6R96RqBIFGv278WIk3Wx9vo92qV8e4wBZ-92txgKaafn/pub?gid=0&single=true&output=csv',
    'Chemical Cost': 'https://docs.google.com/spreadsheets/d/e/2PACX-1vSve3TGoAt4cBMLzvfCu5u5YWl57WENTY4s6R96RqBIFGv278WIk3Wx9vo92qV8e4wBZ-92txgKaafn/pub?gid=1660321018&single=true&output=csv',
    'WTP Energy Cost': 'https://docs.google.com/spreadsheets/d/e/2PACX-1vSve3TGoAt4cBMLzvfCu5u5YWl57WENTY4s6R96RqBIFGv278WIk3Wx9vo92qV8e4wBZ-92txgKaafn/pub?gid=677778686&single=true&output=csv'
  };

  // Automated layout reset coordinator when jumping between master structures
  const switchMaster = (targetMaster) => {
    setActiveMasterTab(targetMaster);
    if (targetMaster === 'Performance Test') {
      setActiveTab('Recovery Rates');
    } else {
      setActiveTab('DM Water Production');
    }
  };

  useEffect(() => {
    if (LINKS[activeTab]) {
      setCsvData([]); // Flushing local matrix to clear cross-tab animations cleanly
      fetch(LINKS[activeTab])
        .then(res => res.text())
        .then(text => {
          Papa.parse(text, { header: true, skipEmptyLines: true, complete: (res) => setCsvData(res.data) });
        })
        .catch(err => console.error("Error streaming ledger parameters: ", err));
    }
  }, [activeTab, activeMasterTab]);

  // Dynamic cell extractor reading your rows instantly
  const cell = (rowIndex, key, fallback) => {
    if (csvData && csvData[rowIndex] && csvData[rowIndex][key] !== undefined) {
      return csvData[rowIndex][key];
    }
    return fallback;
  };

  // Safe vector coordinates parse utility for the dynamic graphs
  const getNumericVal = (idx, key, fallback) => {
    const raw = cell(idx, key, String(fallback));
    return parseFloat(raw.replace(/[^0-9.]/g, '')) || fallback;
  };

  // Safe conversion function turning calendar ISO stamps (2026-05-01) into formal ordinals (1st May)
  const convertToOrdinalDay = (dateStr) => {
    if (!dateStr || typeof dateStr !== 'string') return 'N/A';
    const cleanStr = dateStr.trim();
    if (!cleanStr.includes('-')) return cleanStr;
    const parts = cleanStr.split('-');
    if (parts.length < 3) return cleanStr;
    const dayNum = parseInt(parts[2], 10);
    if (isNaN(dayNum)) return cleanStr;

    let suffix = 'th';
    if (dayNum === 1 || dayNum === 21 || dayNum === 31) suffix = 'st';
    else if (dayNum === 2 || dayNum === 22) suffix = 'nd';
    else if (dayNum === 3 || dayNum === 23) suffix = 'rd';

    return `${dayNum}${suffix} May`;
  };

  // Modern Executive Inline Styles UI Framework
  const styles = {
    wrapper: { backgroundColor: '#e2e8f0', minHeight: '100vh', padding: '24px', fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif' },
    container: { maxWidth: '1300px', margin: '0 auto', backgroundColor: '#ffffff', borderRadius: '16px', overflow: 'hidden', boxShadow: '0 10px 25px rgba(0,0,0,0.05)' },
    topBanner: { backgroundColor: '#1e293b', padding: '24px 32px', color: '#ffffff', display: 'flex', justifyContent: 'space-between', alignItems: 'center' },
    plantTitle: { fontSize: '28px', fontWeight: '800', margin: 0, letterSpacing: '-0.02em' },
    plantSub: { fontSize: '15px', color: '#94a3b8', margin: '4px 0 0 0' },
    metaBox: { textAlign: 'right', fontSize: '13px', color: '#94a3b8', lineHeight: '1.5' },
    masterTabRow: { display: 'flex', gap: '32px', backgroundColor: '#0f172a', padding: '0 32px', borderBottom: '2px solid #1e293b' },
    masterTabBtn: (isActive) => ({
      padding: '18px 4px', border: 'none', background: 'transparent',
      color: isActive ? '#ffffff' : '#94a3b8', fontWeight: '700', fontSize: '14px', cursor: 'pointer',
      borderBottom: isActive ? '3px solid #3b82f6' : '3px solid transparent', 
      transition: 'all 0.4s cubic-bezier(0.22, 1, 0.36, 1)', // Buttery tab fade
      letterSpacing: '0.04em', textTransform: 'uppercase'
    }),
    tabRow: { display: 'flex', gap: '4px', backgroundColor: '#f1f5f9', padding: '12px 24px 0 24px', borderBottom: '1px solid #cbd5e1', overflowX: 'auto' },
    tabBtn: (isActive) => ({
      padding: '14px 22px', border: 'none', background: isActive ? '#ffffff' : 'transparent',
      color: isActive ? '#2563eb' : '#64748b', fontWeight: '600', fontSize: '14px', cursor: 'pointer',
      borderRadius: '8px 8px 0 0', borderTop: isActive ? '3px solid #2563eb' : '3px solid transparent', 
      whiteSpace: 'nowrap', transition: 'all 0.4s cubic-bezier(0.22, 1, 0.36, 1)' // Buttery sub-tab shift
    }),
    contentArea: { padding: '32px' },
    viewTitle: { fontSize: '20px', fontWeight: '700', color: '#0f172a', marginBottom: '24px' },
    grid2x2: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' },
    card: { backgroundColor: '#ffffff', borderRadius: '12px', border: '1px solid #e2e8f0', padding: '24px', boxShadow: '0 2px 4px rgba(0,0,0,0.02)' },
    cardHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' },
    cardTitle: { fontSize: '18px', fontWeight: '700', color: '#1e293b', margin: 0 },
    badge: () => ({ fontSize: '11px', fontWeight: '700', padding: '4px 12px', borderRadius: '20px', backgroundColor: '#eff6ff', color: '#2563eb', letterSpacing: '0.05em' }),
    flowFlex: { display: 'flex', gap: '16px', marginBottom: '20px' },
    flowBox: { flex: 1, backgroundColor: '#f8fafc', padding: '16px', borderRadius: '8px' },
    flowLabel: { fontSize: '11px', fontWeight: '600', color: '#94a3b8', textTransform: 'uppercase', marginBottom: '6px' },
    flowVal: { fontSize: '24px', fontWeight: '700', color: '#1e293b' },
    unit: { fontSize: '14px', color: '#64748b', marginLeft: '4px' },
    limitLabelRow: { display: 'flex', justifyContent: 'space-between', fontSize: '13px', fontWeight: '600', marginBottom: '6px' },
    progressBarOuter: { width: '100%', height: '10px', backgroundColor: '#e2e8f0', borderRadius: '10px', overflow: 'hidden', marginBottom: '12px', position: 'relative' },
    progressBarInner: (percent, color) => ({ height: '100%', width: `${percent}%`, backgroundColor: color, borderRadius: '10px' }),
    alertRow: (color) => ({ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px', fontWeight: '600', color: color }),
    table: { width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '14px' },
    th: { padding: '16px 20px', color: '#475569', fontWeight: '600', borderBottom: '2px solid #e2e8f0', backgroundColor: '#f8fafc', textTransform: 'uppercase', fontSize: '11px', letterSpacing: '0.05em' },
    td: { padding: '16px 20px', color: '#334155', borderBottom: '1px solid #f1f5f9' },
    statusBadge: (status) => ({
      padding: '4px 12px', borderRadius: '20px', fontSize: '12px', fontWeight: '600', display: 'inline-block',
      backgroundColor: status === 'Optimal' || status === 'Within Parameters' ? '#f0fdf4' : '#fffbeb',
      color: status === 'Optimal' || status === 'Within Parameters' ? '#16a34a' : '#d97706'
    }),
    chemGrid: { display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '20px' },
    chemInput: { width: '100%', padding: '12px', borderRadius: '6px', border: '1px solid #2563eb', color: '#2563eb', fontFamily: 'monospace', fontWeight: '600', backgroundColor: '#ffffff', boxSizing: 'border-box', marginTop: '8px' },
    energyHero: { backgroundColor: '#1e293b', padding: '24px 32px', borderRadius: '12px', color: '#ffffff', display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' },
    costRow: { display: 'flex', gap: '24px', marginBottom: '24px' },
    costHeroCard: (color) => ({ flex: 1, background: color, padding: '24px 32px', borderRadius: '12px', color: '#ffffff', textAlign: 'center' }),
    chartContainer: { backgroundColor: '#ffffff', borderRadius: '12px', border: '1px solid #e2e8f0', padding: '24px', marginTop: '24px' },
    splitLayout: { display: 'flex', gap: '40px', alignItems: 'center', marginTop: '20px' }
  };

  // Phase 1 SVG Vector calculation references
  const p1_y = 140 - ((getNumericVal(0, 'Active Power (KWHR)', 194.6) - 150) * 2);
  const p2_y = 140 - ((getNumericVal(1, 'Active Power (KWHR)', 193.7) - 150) * 2);
  const p3_y = 140 - ((getNumericVal(2, 'Active Power (KWHR)', 182.3) - 150) * 2);
  const p4_y = 140 - ((getNumericVal(3, 'Active Power (KWHR)', 195.5) - 150) * 2);
  const p5_y = 140 - ((getNumericVal(4, 'Active Power (KWHR)', 193.4) - 150) * 2);
  const p6_y = 140 - ((getNumericVal(5, 'Active Power (KWHR)', 194.7) - 150) * 2);
  const p7_y = 140 - ((getNumericVal(6, 'Active Power (KWHR)', 193.5) - 150) * 2);

  // Robust Row Sanitizer checking cell types to protect dashboard lifecycle layout threads
  const cleanDataRows = csvData.filter((r) => {
    if (!r) return false;
    const values = Object.values(r).map(v => String(v).toLowerCase());
    
    // Drop metadata, signature headers, averages, and summary total rows
    const isMetaOrSummary = values.some(v => 
      v.includes('report') || 
      v.includes('prepared') || 
      v.includes('designation') || 
      v.includes('total') || 
      v.includes('summary') || 
      v.includes('average') ||
      v.includes('grand total')
    );
    
    const firstKey = Object.keys(r)[0];
    const val = r[firstKey];
    return val && typeof val === 'string' && val.trim() !== '' && !isMetaOrSummary;
  });

  return (
    <div style={styles.wrapper}>
      {/* Dynamic Global Custom CSS Injections for Unified Butter Animations */}
      <style>{`
        @keyframes drawLineEffect { from { stroke-dashoffset: 3000; } to { stroke-dashoffset: 0; } }
        @keyframes growPieEffect { from { stroke-dasharray: 0 100; transform: rotate(-90deg) scale(0.85); opacity: 0; } to { transform: rotate(-90deg) scale(1); opacity: 1; } }
        .draw-line-anim { stroke-dasharray: 3000; stroke-dashoffset: 3000; animation: drawLineEffect 1.8s cubic-bezier(0.22, 1, 0.36, 1) forwards; }
        .pie-segment-anim { animation: growPieEffect 1.8s cubic-bezier(0.22, 1, 0.36, 1) forwards; transform-origin: center; }
      `}</style>

      <div style={styles.container}>
        
        {/* Plant Header Banner */}
        <div style={styles.topBanner}>
          <div>
            <h1 style={styles.plantTitle}>Sobadhanavi 350MW CCPP</h1>
            <p style={styles.plantSub}>Water Treatment Plant - Performance Test Dashboard</p>
          </div>
          <div style={styles.metaBox}>
            <div>Test Date: <strong>Feb 13, 2026</strong></div>
            <div>Ref: <strong>SOBA-O&M-PPT-WTP-001</strong></div>
          </div>
        </div>

        {/* Master Tier 1 Module Tabs Headers */}
        <div style={styles.masterTabRow}>
          <button style={styles.masterTabBtn(activeMasterTab === 'Performance Test')} onClick={() => switchMaster('Performance Test')}>
            Performance Test
          </button>
          <button style={styles.masterTabBtn(activeMasterTab === 'Monthly Performance')} onClick={() => switchMaster('Monthly Performance')}>
            Monthly Performance
          </button>
        </div>

        {/* Tier 2 Sub-Navigation Rows selector conditional switch */}
        <div style={styles.tabRow}>
          {activeMasterTab === 'Performance Test' ? (
            ['Recovery Rates', 'Flowrates', 'Energy', 'Water Quality', 'Chemicals', 'Lab Sample', 'DM Water Cost'].map(tab => (
              <button key={tab} style={styles.tabBtn(activeTab === tab)} onClick={() => setActiveTab(tab)}>
                {tab} {tab === 'Recovery Rates' && <span style={{ color: '#ef4444' }}>●</span>}
              </button>
            ))
          ) : (
            ['DM Water Production', 'Chemical Cost', 'WTP Energy Cost'].map(tab => (
              <button key={tab} style={styles.tabBtn(activeTab === tab)} onClick={() => setActiveTab(tab)}>
                {tab}
              </button>
            ))
          )}
        </div>

        <div style={styles.contentArea}>
          
          {/* ======================================================== */}
          {/* MASTER TAB MODULE 1: PERFORMANCE TEST ANCHOR STREAM      */}
          {/* ======================================================== */}
          {activeMasterTab === 'Performance Test' && (
            <>
              {/* SUB TAB 1: RECOVERY RATES */}
              {activeTab === 'Recovery Rates' && (
                <div>
                  <div style={styles.viewTitle}>RO Skid Recovery Analysis</div>
                  <div style={styles.grid2x2}>
                    {[
                      { idx: 0, name: 'SWRO 1', badge: 'SEAWATER', lbl: 'Inlet Flow' },
                      { idx: 1, name: 'SWRO 2', badge: 'SEAWATER', lbl: 'Inlet Flow' },
                      { idx: 2, name: 'BWRO 1', badge: 'BRACKISH', lbl: 'Inlet Flow' },
                      { idx: 3, name: 'BWRO 2', badge: 'BRACKISH', lbl: 'Inlet Flow' }
                    ].map((item) => {
                      const skidName = cell(item.idx, 'Skid', item.name);
                      const inletRaw = cell(item.idx, 'Inlet flow rate', '0.00');
                      const outletRaw = cell(item.idx, 'Outlet flow rate', '0.00');
                      const rawActual = cell(item.idx, 'Recovery%', '0');
                      const rawGuarantee = cell(item.idx, 'Guaranteed recovery%', '0');
                      
                      const actualPct = parseFloat(rawActual) || 0;
                      const guaranteePct = parseFloat(rawGuarantee) || 0;
                      
                      const isPassing = actualPct >= guaranteePct;
                      const themeColor = isPassing ? '#22c55e' : '#ef4444';
                      const alertMsg = isPassing ? 'Performance within guarantee window.' : '⚠️ Performance below guaranteed limits.';
                      return (
                        <div key={item.idx} style={styles.card}>
                          <div style={styles.cardHeader}>
                            <h3 style={styles.cardTitle}>{skidName}</h3>
                            <span style={styles.badge()}>{item.badge}</span>
                          </div>
                          <div style={styles.flowFlex}>
                            <div style={styles.flowBox}>
                              <div style={styles.flowLabel}>Outlet Flow Rate</div>
                              <div style={styles.flowVal}>{outletRaw}<span style={styles.unit}>m³/h</span></div>
                            </div>
                            <div style={styles.flowBox}>
                              <div style={styles.flowLabel}>{item.lbl} Rate</div>
                              <div style={styles.flowVal}>{inletRaw}<span style={styles.unit}>m³/h</span></div>
                            </div>
                          </div>
                          <div style={styles.limitLabelRow}>
                            <span style={{ color: themeColor }}>Actual: {actualPct.toFixed(2)}%</span>
                            <span>Guarantee: {guaranteePct}%</span>
                          </div>
                          <div style={styles.progressBarOuter}>
                            <div style={{ ...styles.progressBarInner(actualPct, themeColor), width: `${Math.min(actualPct, 100)}%` }}></div>
                            <div style={{ position: 'absolute', left: `${guaranteePct}%`, top: 0, bottom: 0, width: '2px', backgroundColor: '#0f172a', zIndex: 2 }} />
                          </div>
                          <div style={styles.alertRow(themeColor)}>{alertMsg}</div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* SUB TAB 2: FLOWRATES */}
              {activeTab === 'Flowrates' && (
                <div>
                  <div style={styles.viewTitle}>Average Flowrates (11:00 - 17:00)</div>
                  <div style={styles.card}><table style={styles.table}>
                    <thead><tr><th style={styles.th}>Measuring Point</th><th style={styles.th}>Average Flow (m³/h)</th><th style={styles.th}>Guaranteed (m³/h)</th><th style={styles.th}>Status</th></tr></thead>
                    <tbody>
                      {[
                        { mp: 'Seawater Inlet flow', avg: '90.90', guar: '91.50', st: 'Under Target' },
                        { mp: 'UF 1 Inlet flow', avg: '44.80', guar: '45.50', st: 'Under Target' },
                        { mp: 'UF 2 Inlet flow', avg: '45.40', guar: '45.50', st: 'Under Target' },
                        { mp: 'SWRO 1 Feed flow', avg: '45.70', guar: '43.00', st: 'Optimal' },
                        { mp: 'SWRO 1 Product flow', avg: '19.00', guar: '19.35', st: 'Under Target' },
                        { mp: 'SWRO 2 Feed flow', avg: '44.20', guar: '43.00', st: 'Optimal' },
                        { mp: 'SWRO 2 Product flow', avg: '19.10', guar: '19.35', st: 'Under Target' },
                        { mp: 'BWRO 1 Product flow', avg: '11.60', guar: '11.80', st: 'Under Target' },
                        { mp: 'BWRO 2 Product flow', avg: '11.70', guar: '11.80', st: 'Under Target' },
                        { mp: 'MB 1 Product flow', avg: '11.80', guar: '12.00', st: 'Under Target' },
                        { mp: 'MB 2 Product flow', avg: '11.90', guar: '12.00', st: 'Under Target' }
                      ].map((row, i) => (
                        <tr key={i}>
                          <td style={styles.td}>{cell(i, 'Measuring Point', row.mp)}</td>
                          <td style={styles.td}><strong>{cell(i, 'Average Flow (M³/H)', row.avg)}</strong></td>
                          <td style={styles.td}>{cell(i, 'Guaranteed (M³/H)', row.guar)}</td>
                          <td style={styles.td}><span style={styles.statusBadge(cell(i, 'Status', row.st))}>{cell(i, 'Status', row.st)}</span></td>
                        </tr>
                      ))}
                    </tbody>
                  </table></div>
                </div>
              )}

              {/* SUB TAB 3: WATER QUALITY */}
              {activeTab === 'Water Quality' && (
                <div>
                  <div style={{ ...styles.cardHeader, marginBottom: '16px' }}><div style={styles.viewTitle}>Mixed Bed (MB) Water Quality</div><span style={styles.statusBadge('Within Parameters')}>✓ Within Parameters</span></div>
                  <div style={styles.card}><table style={styles.table}>
                    <thead><tr><th style={styles.th}>Parameter</th><th style={styles.th}>MB 1 Actual (17:00)</th><th style={styles.th}>MB 2 Actual (17:00)</th><th style={styles.th}>Design Guarantee</th></tr></thead>
                    <tbody>
                      {[
                        { p: 'pH', m1: '6.64', m2: '6.66', dg: '6.5 - 7.5' },
                        { p: 'Total Hardness (µmol/L)', m1: '0', m2: '0', dg: '0' },
                        { p: 'Conductivity (µS/cm)', m1: '0.09', m2: '0.11', dg: '< 0.2' },
                        { p: 'Na (µg/kg)', m1: '< 2', m2: '< 2', dg: '< 3' },
                        { p: 'Fe (µg/kg)', m1: '1', m2: '1', dg: '< 2' },
                        { p: 'Cu (µg/kg)', m1: '0', m2: '0', dg: '< 2' },
                        { p: 'Silica (µg/kg)', m1: '5', m2: '3', dg: '< 10' },
                        { p: 'TOC (µg/kg as C)', m1: '0', m2: '0', dg: '< 0.2' }
                      ].map((row, i) => (
                        <tr key={i}>
                          <td style={styles.td}>{cell(i, 'Parameter', row.p)}</td>
                          <td style={styles.td}>{cell(i, 'MB 1 Actual (17:00)', row.m1)}</td>
                          <td style={styles.td}>{cell(i, 'MB 2 Actual (17:00)', row.m2)}</td>
                          <td style={styles.td}>{cell(i, 'Design Guarantee', row.dg)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table></div>
                </div>
              )}

              {/* SUB TAB 4: CHEMICALS */}
              {activeTab === 'Chemicals' && (
                <div>
                  <div style={styles.viewTitle}>Chemical Dosing & Concentration</div>
                  <div style={styles.chemGrid}>
                    {[
                      { name: 'FeCl3', dosage: '250 mm / 10 stroke', price: '300 LKR/kg' },
                      { name: 'Polyelectrolyte', dosage: '520 mm / 10 stroke', price: '2,361.18 LKR/kg' },
                      { name: 'NaOCl 10%', dosage: '140 mm / 50 stroke', price: '' },
                      { name: 'NaOH', dosage: '245 mm / 60 stroke', price: '' },
                      { name: 'HCl', dosage: '359 mm / 30 stroke', price: '' },
                      { name: 'Antiscalant', dosage: '390 mm / 20 stroke', price: '' },
                      { name: 'SMBS', dosage: '300 mm / 30 stroke', price: '' }
                    ].map((chem, i) => (
                      <div key={i} style={styles.card}>
                        <div style={{ fontWeight: '700', color: '#1e293b' }}>🧪 {cell(i, 'Chemical Name', chem.name)}</div>
                        <div style={{ ...styles.flowLabel, marginTop: '12px', marginBottom: 0 }}>Average Dosage</div>
                        <div style={styles.chemInput}>{cell(i, 'Average Dosage', chem.dosage)}</div>
                        {chem.price && <div style={{ fontSize: '12px', color: '#64748b', marginTop: '8px' }}>Price: <strong>{cell(i, 'Price LKR/kg', chem.price)}</strong></div>}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* SUB TAB 5: ENERGY */}
              {activeTab === 'Energy' && (
                <div>
                  <div style={styles.viewTitle}>Energy Consumption Log</div>
                  <div style={styles.energyHero}>
                    <div><div style={{ fontSize: '12px', textTransform: 'uppercase', color: '#94a3b8', fontWeight: '600' }}>Average Active Power</div><div style={{ fontSize: '32px', fontWeight: '800', color: '#fbbf24', marginTop: '4px' }}>{cell(7, 'Active Power (KWHR)', '192.6')} <span style={{ fontSize: '18px', color: '#ffffff' }}>kW</span></div></div>
                    <div style={{ textAlign: 'right' }}><div style={{ fontSize: '12px', textTransform: 'uppercase', color: '#94a3b8', fontWeight: '600' }}>Guaranteed Limit</div><div style={{ fontSize: '20px', fontWeight: '700', marginTop: '8px' }}>&lt; 286 kW</div></div>
                  </div>

                  <div style={styles.card}><table style={styles.table}>
                    <thead><tr><th style={styles.th}>Time</th><th style={styles.th}>Running Hours (h)</th><th style={styles.th}>Active Power (KWh)</th><th style={styles.th}>Cumulative Energy (MWh)</th></tr></thead>
                    <tbody>
                      {['11:00', '12:00', '13:00', '14:00', '15:00', '16:00', '17:00'].map((time, i) => (
                        <tr key={i}>
                          <td style={styles.td}><strong>{cell(i, 'Time', time)}</strong></td>
                          <td style={styles.td}>{cell(i, 'Run Hours (RH)', 9935.59 + i)}</td>
                          <td style={styles.td}>{cell(i, 'Active Power (KWHR)', '194.6')}</td>
                          <td style={styles.td}>{cell(i, 'Cumulative Energy (MWHR)', '236.95')}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table></div>

                  <div style={styles.chartContainer}>
                    <div style={{ ...styles.flowLabel, marginBottom: '16px', color: '#1e293b' }}>Hourly Load Profile Matrix (kW)</div>
                    <div style={{ position: 'relative', height: '160px', width: '100%' }}>
                      <svg viewBox="0 0 600 160" style={{ width: '100%', height: '100%', overflow: 'visible' }}>
                        <line x1="0" y1="40" x2="600" y2="40" stroke="#f1f5f9" strokeWidth="2" />
                        <line x1="0" y1="90" x2="600" y2="90" stroke="#f1f5f9" strokeWidth="1" />
                        <line x1="0" y1="140" x2="600" y2="140" stroke="#cbd5e1" strokeWidth="2" />
                        <line x1="0" y1="20" x2="600" y2="20" stroke="#ef4444" strokeWidth="2" strokeDasharray="4 4" />
                        <text x="590" y="14" fill="#ef4444" fontSize="10" fontWeight="700" textAnchor="end">CONTRACT SPEC MAX LIMIT (&lt; 286 kW)</text>

                        <path
                          className="draw-line-anim"
                          d={`M 15 ${p1_y} L 110 ${p2_y} L 205 ${p3_y} L 300 ${p4_y} L 395 ${p5_y} L 490 ${p6_y} L 585 ${p7_y}`}
                          fill="none" stroke="#2563eb" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round"
                        />

                        {[p1_y, p2_y, p3_y, p4_y, p5_y, p6_y, p7_y].map((yVal, idx) => {
                          const xVal = 15 + idx * 95;
                          const timeLabels = ['11:00', '12:00', '13:00', '14:00', '15:00', '16:00', '17:00'];
                          const isNodeHovered = hoveredIndex === idx;
                          const currentKw = cell(idx, 'Active Power (KWHR)', '194.6');

                          return (
                            <g key={idx} onMouseEnter={() => setHoveredIndex(idx)} onMouseLeave={() => setHoveredIndex(null)} style={{ cursor: 'pointer' }}>
                              <circle cx={xVal} cy={yVal} r={isNodeHovered ? 7 : 4.5} fill={isNodeHovered ? '#1d4ed8' : '#2563eb'} 
                                style={{ transition: 'all 0.4s cubic-bezier(0.22, 1, 0.36, 1)' }} // Buttery node expand
                              />
                              <text x={xVal} y="156" fill="#64748b" fontSize="10" textAnchor="middle" fontWeight="600">{timeLabels[idx]}</text>
                              {isNodeHovered && (
                                <g>
                                  <rect x={xVal - 35} y={yVal - 32} width="70" height="22" rx="4" fill="#1e293b" />
                                  <text x={xVal} y={yVal - 18} fill="#ffffff" fontSize="11" fontWeight="700" textAnchor="middle">{currentKw} kW</text>
                                </g>
                              )}
                            </g>
                          );
                        })}
                      </svg>
                    </div>
                  </div>
                </div>
              )}

              {/* SUB TAB 6: LAB SAMPLE */}
              {activeTab === 'Lab Sample' && (
                <div>
                  <div style={styles.viewTitle}>Lab Sample Consumables</div>
                  <div style={styles.card}><table style={styles.table}>
                    <thead><tr><th style={styles.th}>Test Name</th><th style={styles.th}>Times Conducted</th><th style={styles.th}>Price (LKR)</th><th style={styles.th}>Total Cost (LKR)</th></tr></thead>
                    <tbody>
                      {[
                        { name: 'FRC', times: '6', price: '125.36', total: '752.16' },
                        { name: 'Silica', times: '1', price: '1310.00', total: '1310.00' },
                        { name: 'Iron', times: '1', price: '300.00', total: '300.00' }
                      ].map((row, i) => (
                        <tr key={i}>
                          <td style={styles.td}><strong>{cell(i, 'Test Name', row.name)}</strong></td>
                          <td style={styles.td}>{cell(i, 'Times Conducted', row.times)}</td>
                          <td style={styles.td}>{cell(i, 'Price (LKR)', row.price)}</td>
                          <td style={styles.td}><strong>{cell(i, 'Total Cost (LKR)', row.total)}</strong></td>
                        </tr>
                      ))}
                      <tr style={{ backgroundColor: '#f8fafc' }}>
                        <td colSpan="3" style={{ ...styles.td, textAlign: 'right', fontWeight: '700', color: '#64748b' }}>TOTAL LAB COST</td>
                        <td style={{ ...styles.td, fontSize: '16px', fontWeight: '800', color: '#0f172a' }}>{cell(3, 'Total Cost (LKR)', '2,362.16')} LKR</td>
                      </tr>
                    </tbody>
                  </table></div>
                </div>
              )}

              {/* SUB TAB 7: DM WATER COST */}
              {activeTab === 'DM Water Cost' && (
                <div>
                  <div style={styles.viewTitle}>DM Water Production Cost Summary</div>
                  <div style={styles.costRow}>
                    <div style={styles.costHeroCard('linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)')}><div style={{ fontSize: '32px', fontWeight: '800', marginTop: '8px' }}>{cell(0, 'Value', '127,000')} <span style={{ fontSize: '16px', fontWeight: '500' }}>Liters</span></div></div>
                    <div style={styles.costHeroCard('linear-gradient(135deg, #10b981 0%, #047857 100%)')}><div style={{ fontSize: '32px', fontWeight: '800', marginTop: '8px' }}>{cell(1, 'Value', '3.63')} <span style={{ fontSize: '16px', fontWeight: '500' }}>LKR/L</span></div></div>
                  </div>
                  <div style={{ ...styles.flowLabel, marginBottom: '12px' }}>Cost Breakdown (LKR)</div>
                  <div style={{ ...styles.chemGrid, marginBottom: '24px' }}>
                    <div style={styles.flowBox}><div style={styles.flowLabel}>Energy Cost</div><div style={{ ...styles.flowVal, fontSize: '20px' }}>{cell(3, 'Value', '24,108.00')}</div></div>
                    <div style={styles.flowBox}><div style={styles.flowLabel}>Chemical Cost</div><div style={{ ...styles.flowVal, fontSize: '20px' }}>{cell(4, 'Value', '8,476.64')}</div></div>
                    <div style={styles.flowBox}><div style={styles.flowLabel}>Lab Consumables</div><div style={{ ...styles.flowVal, fontSize: '20px' }}>{cell(5, 'Value', '2,362.16')}</div></div>
                  </div>

                  <div style={styles.chartContainer}>
                    <div style={{ ...styles.flowLabel, marginBottom: '20px', color: '#1e293b' }}>DM Water Production Cost Breakdown</div>
                    <div style={styles.splitLayout}>
                      <div style={{ width: '220px', height: '220px' }}>
                        <svg viewBox="0 0 36 36" style={{ width: '100%', height: '100%' }}>
                          <circle className="pie-segment-anim" cx="18" cy="18" r="15.915" fill="none" stroke="#3b82f6" strokeWidth="4.2" strokeDasharray="69 100" strokeDashoffset="0" 
                            style={{ cursor: 'pointer', filter: hoveredIndex === 'pie-energy' ? 'drop-shadow(0 4px 6px rgba(0,0,0,0.15))' : 'none', transition: 'all 0.4s cubic-bezier(0.22, 1, 0.36, 1)' }} 
                            onMouseEnter={() => setHoveredIndex('pie-energy')} onMouseLeave={() => setHoveredIndex(null)} 
                          />
                          <circle className="pie-segment-anim" cx="18" cy="18" r="15.915" fill="none" stroke="#10b981" strokeWidth="4.2" strokeDasharray="24.3 100" strokeDashoffset="-69" 
                            style={{ cursor: 'pointer', filter: hoveredIndex === 'pie-chem' ? 'drop-shadow(0 4px 6px rgba(0,0,0,0.15))' : 'none', transition: 'all 0.4s cubic-bezier(0.22, 1, 0.36, 1)' }} 
                            onMouseEnter={() => setHoveredIndex('pie-chem')} onMouseLeave={() => setHoveredIndex(null)} 
                          />
                          <circle className="pie-segment-anim" cx="18" cy="18" r="15.915" fill="none" stroke="#8b5cf6" strokeWidth="4.2" strokeDasharray="6.7 100" strokeDashoffset="-93.3" 
                            style={{ cursor: 'pointer', filter: hoveredIndex === 'pie-lab' ? 'drop-shadow(0 4px 6px rgba(0,0,0,0.15))' : 'none', transition: 'all 0.4s cubic-bezier(0.22, 1, 0.36, 1)' }} 
                            onMouseEnter={() => setHoveredIndex('pie-lab')} onMouseLeave={() => setHoveredIndex(null)} 
                          />
                          <circle cx="18" cy="18" r="11" fill="#ffffff" />
                          <text x="18" y="20" textAnchor="middle" fontSize="4" fontWeight="800" fill="#1e293b">100%</text>
                        </svg>
                      </div>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', flex: 1 }}>
                        {[
                          { id: 'pie-energy', label: 'Energy Cost', percent: '69%', color: '#3b82f6', val: cell(3, 'Value', '24,108.00') },
                          { id: 'pie-chem', label: 'Chemical Cost', percent: '24.3%', color: '#10b981', val: cell(4, 'Value', '8,476.64') },
                          { id: 'pie-lab', label: 'Lab Samples', percent: '6.7%', color: '#8b5cf6', val: cell(5, 'Value', '2,362.16') }
                        ].map((item) => {
                          const isTargetActive = hoveredIndex === item.id;
                          return (
                            <div key={item.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 16px', borderRadius: '8px', backgroundColor: isTargetActive ? '#f8fafc' : 'transparent', border: isTargetActive ? '1px solid #cbd5e1' : '1px solid transparent', transition: 'all 0.4s cubic-bezier(0.22, 1, 0.36, 1)' }}>
                              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                <span style={{ width: '12px', height: '12px', backgroundColor: item.color, borderRadius: '50%', display: 'inline-block' }} />
                                <span style={{ fontSize: '13px', fontWeight: '600', color: '#334155' }}>{item.label}</span>
                              </div>
                              <div style={{ textAlign: 'right' }}>
                                <span style={{ fontSize: '13px', fontWeight: '700', color: '#0f172a', marginRight: '12px' }}>{item.val} LKR</span>
                                <span style={{ fontSize: '12px', fontWeight: '600', color: '#64748b' }}>{item.percent}</span>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </div>

                  <div style={{ ...styles.card, backgroundColor: '#f8fafc', display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px 24px', marginTop: '24px' }}>
                    <span style={{ fontSize: '12px', fontWeight: '700', color: '#64748b', textTransform: 'uppercase' }}>Total Test Period Cost</span>
                    <span style={{ fontSize: '18px', fontWeight: '800', color: '#0f172a' }}>{cell(6, 'Value', '34,946.80')} LKR</span>
                  </div>
                </div>
              )}
            </>
          )}

          {/* ======================================================== */}
          {/* MASTER TAB MODULE 2: MONTHLY PERFORMANCE ENGINE LAYER    */}
          {/* ======================================================== */}
          {activeMasterTab === 'Monthly Performance' && (
            <>
              {/* MONTHLY VIEW 1: DM WATER PRODUCTION */}
              {activeTab === 'DM Water Production' && (
                <div className="tab-entry-anim">
                  {/* Calmed breathing cycles and unified cubic-bezier for liquid curves */}
                  <style>{`
                    @keyframes tabFadeInUp { from { opacity: 0; transform: translateY(15px); } to { opacity: 1; transform: translateY(0); } }
                    @keyframes themePulseGlow { 0% { box-shadow: 0 4px 12px rgba(37, 99, 235, 0.15); } 50% { box-shadow: 0 4px 22px rgba(56, 189, 248, 0.4); } 100% { box-shadow: 0 4px 12px rgba(37, 99, 235, 0.15); } }
                    @keyframes themeFluidDraw { from { stroke-dashoffset: 2000; } to { stroke-dashoffset: 0; } }
                    .tab-entry-anim { animation: tabFadeInUp 0.8s cubic-bezier(0.22, 1, 0.36, 1) forwards; }
                    .theme-heatmap-block:hover { animation: themePulseGlow 2.5s infinite ease-in-out; }
                    .theme-spline-main { stroke-dasharray: 2000; stroke-dashoffset: 2000; animation: themeFluidDraw 1.8s cubic-bezier(0.22, 1, 0.36, 1) forwards; }
                  `}</style>

                  <div style={styles.viewTitle}>Monthly Production Summary</div>

                  {/* High-Fidelity Data Aggregation Processing Engine */}
                  {(() => {
                    const grossDMProduction = cleanDataRows.reduce((sum, r) => {
                      return sum + (parseFloat(String(Object.values(r)[8] || '0').replace(/[^0-9.]/g, '')) || 0);
                    }, 0);

                    const grossOpHours = cleanDataRows.reduce((sum, r) => {
                      return sum + (parseFloat(String(Object.values(r)[1] || '0').replace(/[^0-9.]/g, '')) || 0);
                    }, 0);

                    const avgDailyOutput = cleanDataRows.length > 0 ? (grossDMProduction / cleanDataRows.length) : 0;

                    return (
                      <>
                        {/* EXECUTIVE DM PRODUCTION KPI BANNER */}
                        <div style={{ display: 'flex', gap: '20px', marginBottom: '24px' }}>
                          <div style={{ ...styles.card, flex: 1, borderLeft: '4px solid #2563eb', background: '#ffffff' }}>
                            <div style={styles.flowLabel}>Total Monthly DM Production</div>
                            <div style={{ ...styles.flowVal, fontSize: '26px', color: '#0f172a', fontWeight: '800', marginTop: '4px' }}>
                              {grossDMProduction.toLocaleString(undefined, { maximumFractionDigits: 2 })} <span style={{ fontSize: '14px', color: '#64748b', fontWeight: '600' }}>m³</span>
                            </div>
                          </div>
                          <div style={{ ...styles.card, flex: 1, borderLeft: '4px solid #10b981', background: '#ffffff' }}>
                            <div style={styles.flowLabel}>Gross Plant Operating Runtime</div>
                            <div style={{ ...styles.flowVal, fontSize: '26px', color: '#0f172a', fontWeight: '800', marginTop: '4px' }}>
                              {grossOpHours.toLocaleString(undefined, { maximumFractionDigits: 1 })} <span style={{ fontSize: '14px', color: '#64748b', fontWeight: '600' }}>hrs</span>
                            </div>
                          </div>
                          <div style={{ ...styles.card, flex: 1, borderLeft: '4px solid #0284c7', background: '#ffffff' }}>
                            <div style={styles.flowLabel}>Average Daily Plant Output</div>
                            <div style={{ ...styles.flowVal, fontSize: '26px', color: '#0284c7', fontWeight: '800', marginTop: '4px' }}>
                              {avgDailyOutput.toFixed(2)} <span style={{ fontSize: '14px', color: '#64748b', fontWeight: '600' }}>m³/day</span>
                            </div>
                          </div>
                        </div>

                        {/* CONCEPT 2: PRODUCTION CALENDAR HEATMAP */}
                        <div style={{ ...styles.card, marginBottom: '32px' }}>
                          <div style={{ ...styles.flowLabel, marginBottom: '16px', color: '#1e293b' }}>
                            DM Water Production Heatmap (Daily Demin Total Volume)
                          </div>
                          
                          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
                            {cleanDataRows.map((row, i) => {
                              const rowVals = Object.values(row);
                              const dateStr = String(rowVals[0] || 'N/A');
                              const deminVolume = parseFloat(String(rowVals[8] || '0').replace(/[^0-9.]/g, '')) || 0;
                              const opHours = parseFloat(String(rowVals[1] || '0').replace(/[^0-9.]/g, '')) || 0;

                              const maxDailyVolume = Math.max(...cleanDataRows.map(r => parseFloat(String(Object.values(r)[8] || '0').replace(/[^0-9.]/g, '')) || 1), 1);
                              const intensity = deminVolume / maxDailyVolume;

                              const extractDayNumber = (str, fallbackIdx) => {
                                if (!str) return fallbackIdx + 1;
                                const parts = str.trim().split(/[\s,/\-]+/);
                                for (let part of parts) {
                                  if (part.length >= 1 && part.length <= 2 && !isNaN(part)) {
                                    return parseInt(part, 10);
                                  }
                                }
                                return fallbackIdx + 1;
                              };

                              const displayDay = extractDayNumber(dateStr, i);

                              let blockColor = '#ffe4e6'; // Shutdown state
                              let textColor = '#e11d48';
                              if (deminVolume > 0) {
                                blockColor = `rgba(37, 99, 235, ${0.15 + intensity * 0.85})`;
                                textColor = intensity > 0.6 ? '#ffffff' : '#475569';
                              }

                              const isBlockHovered = hoveredIndex === `heatmap-${i}`;
                              return (
                                <div
                                  key={`heat-${i}`}
                                  className="theme-heatmap-block"
                                  onMouseEnter={() => setHoveredIndex(`heatmap-${i}`)}
                                  onMouseLeave={() => setHoveredIndex(null)}
                                  style={{
                                    position: 'relative',
                                    width: '65px',
                                    height: '65px',
                                    backgroundColor: blockColor,
                                    borderRadius: '8px',
                                    display: 'flex',
                                    flexDirection: 'column',
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                    cursor: 'pointer',
                                    border: isBlockHovered ? '2px solid #38bdf8' : '1px solid rgba(0,0,0,0.05)',
                                    transform: isBlockHovered ? 'scale(1.10) translateY(-2px)' : 'scale(1) translateY(0)',
                                    zIndex: isBlockHovered ? 10 : 1,
                                    transition: 'all 0.5s cubic-bezier(0.22, 1, 0.36, 1)', // Silky micro-spring transition
                                  }}
                                >
                                  <span style={{ fontSize: '11px', fontWeight: '700', color: isBlockHovered ? '#2563eb' : textColor }}>
                                    {displayDay}
                                  </span>
                                  <span style={{ fontSize: '10px', fontWeight: '500', marginTop: '2px', color: deminVolume > 0 && intensity > 0.6 && !isBlockHovered ? '#ffffff' : '#64748b' }}>
                                    {deminVolume > 0 ? `${Math.round(deminVolume)}m³` : 'OFF'}
                                  </span>

                                  {isBlockHovered && (
                                    <div style={{
                                      position: 'absolute',
                                      bottom: '75px',
                                      left: '50%',
                                      transform: 'translateX(-50%)',
                                      backgroundColor: '#1e293b',
                                      color: '#ffffff',
                                      padding: '12px',
                                      borderRadius: '8px',
                                      fontSize: '11px',
                                      zIndex: 100,
                                      width: '180px',
                                      boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.4)',
                                      pointerEvents: 'none',
                                      lineHeight: '1.6',
                                      border: '1px solid #38bdf8'
                                    }}>
                                      <div style={{ fontWeight: '700', borderBottom: '1px solid #475569', paddingBottom: '4px', marginBottom: '6px', color: '#38bdf8' }}>{dateStr}</div>
                                      <div>⚡ Run Hours: <strong>{opHours} hrs</strong></div>
                                      <div>Raw Clear Water: <strong>{rowVals[2]} m³</strong></div>
                                      <div>UF Permeate: <strong>{rowVals[3]} m³</strong></div>
                                      <div>🏆 Demin Total: <strong>{deminVolume.toLocaleString()} m³</strong></div>
                                    </div>
                                  )}
                                </div>
                              );
                            })}
                          </div>
                          
                          <div style={{ display: 'flex', gap: '16px', marginTop: '16px', fontSize: '11px', fontWeight: '600', color: '#64748b', alignItems: 'center' }}>
                            <span>Legend:</span>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}><span style={{ width: '12px', height: '12px', backgroundColor: '#ffe4e6', border: '1px solid #fecaca', borderRadius: '3px', display: 'inline-block' }} /> WTP Shutdown</div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}><span style={{ width: '12px', height: '12px', backgroundColor: 'rgba(37, 99, 235, 0.25)', borderRadius: '3px', display: 'inline-block' }} /> Low Flow Operations</div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}><span style={{ width: '12px', height: '12px', backgroundColor: 'rgba(37, 99, 235, 1)', borderRadius: '3px', display: 'inline-block' }} /> Peak Capacity Production</div>
                          </div>
                        </div>

                        {/* CONCEPT 1: THE WATER JOURNEY SPLINE CHART */}
                        <div style={styles.chartContainer}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                            <div style={{ ...styles.flowLabel, margin: 0, color: '#1e293b' }}>
                               Daily Water Production Trend (m³/day) 
                            </div>
                            <div style={{ display: 'flex', gap: '16px', fontSize: '12px', fontWeight: '700' }}>
                              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}><span style={{ width: '12px', height: '3px', backgroundColor: '#94a3b8', display: 'inline-block' }} /> Clear Water Intake</div>
                              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}><span style={{ width: '12px', height: '3px', backgroundColor: '#38bdf8', display: 'inline-block' }} /> UF Filtered Permeate</div>
                              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}><span style={{ width: '12px', height: '3.5px', backgroundColor: '#2563eb', display: 'inline-block' }} /> Demineralized Product</div>
                            </div>
                          </div>

                          <div style={{ position: 'relative', width: '100%' }}>
                            <svg viewBox="0 0 1000 260" style={{ width: '100%', height: 'auto', overflow: 'visible' }}>
                              <line x1="60" y1="40" x2="980" y2="40" stroke="#f1f5f9" strokeWidth="1" />
                              <line x1="60" y1="95" x2="980" y2="95" stroke="#f1f5f9" strokeWidth="1" />
                              <line x1="60" y1="150" x2="980" y2="150" stroke="#f1f5f9" strokeWidth="1" />
                              <line x1="60" y1="205" x2="980" y2="205" stroke="#cbd5e1" strokeWidth="2" />

                              {(() => {
                                const absolutePeak = Math.max(...cleanDataRows.map(r => {
                                  const v = Object.values(r);
                                  return Math.max(parseFloat(String(v[2])) || 0, parseFloat(String(v[8])) || 0);
                                }), 100) * 1.15;
                                const stepX = 920 / (cleanDataRows.length - 1 || 1);
                                const generatePoints = (valIdx) => {
                                  return cleanDataRows.map((row, i) => {
                                    const val = parseFloat(String(Object.values(row)[valIdx] || '0').replace(/[^0-9.]/g, '')) || 0;
                                    const x = 60 + (i * stepX);
                                    const y = 205 - ((val / absolutePeak) * 165);
                                    return { x, y, val };
                                  });
                                };

                                const clearWaterPoints = generatePoints(2);
                                const ufPoints = generatePoints(3);
                                const deminPoints = generatePoints(8);
                                return (
                                  <>
                                    <text x="52" y="44" fill="#94a3b8" fontSize="10" textAnchor="end">{Math.round(absolutePeak * 0.75).toLocaleString()} m³</text>
                                    <text x="52" y="99" fill="#94a3b8" fontSize="10" textAnchor="end">{Math.round(absolutePeak * 0.5).toLocaleString()} m³</text>
                                    <text x="52" y="154" fill="#94a3b8" fontSize="10" textAnchor="end">{Math.round(absolutePeak * 0.25).toLocaleString()} m³</text>
                                    <text x="52" y="209" fill="#475569" fontSize="10" textAnchor="end" fontWeight="700">0 m³</text>

                                    <path className="theme-spline-main" fill="none" stroke="#94a3b8" strokeWidth="1.5" strokeDasharray="4 4" d={clearWaterPoints.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`).join(' ')} />
                                    <path className="theme-spline-main" fill="none" stroke="#38bdf8" strokeWidth="2" d={ufPoints.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`).join(' ')} />
                                    <path className="theme-spline-main" fill="none" stroke="#2563eb" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round" d={deminPoints.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`).join(' ')} />

                                    {deminPoints.map((p, i) => {
                                      const dateString = String(Object.values(cleanDataRows[i])[0] || '');
                                      const isNodeActive = hoveredIndex === `line-node-${i}`;

                                      return (
                                        <g key={`node-group-${i}`} onMouseEnter={() => setHoveredIndex(`line-node-${i}`)} onMouseLeave={() => setHoveredIndex(null)} style={{ cursor: 'pointer' }}>
                                          {isNodeActive && <line x1={p.x} y1="40" x2={p.x} y2="205" stroke="#38bdf8" strokeWidth="1.5" strokeDasharray="2 2" />}
                                          <circle cx={p.x} cy={p.y} r={isNodeActive ? 7.5 : 4} fill={isNodeActive ? '#38bdf8' : '#2563eb'} 
                                            style={{ transition: 'all 0.5s cubic-bezier(0.22, 1, 0.36, 1)', filter: isNodeActive ? 'drop-shadow(0 0 8px #38bdf8)' : 'none' }} 
                                          />

                                          {(i % 3 === 0 || isNodeActive) && (
                                            <text x={p.x} y="224" fill={isNodeActive ? '#38bdf8' : '#64748b'} fontSize="9" textAnchor="middle" fontWeight="700" transform={`rotate(15, ${p.x}, 224)`}>
                                              {dateString}
                                            </text>
                                          )}

                                          {isNodeActive && (
                                            <g style={{ pointerEvents: 'none' }}>
                                              <rect x={p.x > 800 ? p.x - 145 : p.x + 15} y={p.y - 45} width="130" height="52" rx="6" fill="#1e293b" opacity="0.95" stroke="#38bdf8" strokeWidth="1" />
                                              <text x={p.x > 800 ? p.x - 80 : p.x + 80} y={p.y - 30} fill="#38bdf8" fontSize="10" fontWeight="700" textAnchor="middle">{dateString}</text>
                                              <text x={p.x > 800 ? p.x - 80 : p.x + 80} y={p.y - 12} fill="#ffffff" fontSize="11" fontWeight="800" textAnchor="middle">{p.val.toLocaleString()} m³</text>
                                            </g>
                                          )}
                                        </g>
                                      );
                                    })}
                                  </>
                                );
                              })()}
                            </svg>
                          </div>
                        </div>
                      </>
                    );
                  })()}
                </div>
              )} 

              {/* MONTHLY VIEW 2: CHEMICAL COST */}
              {activeTab === 'Chemical Cost' && (
                <div className="tab-entry-anim">
                  <div style={styles.viewTitle}>Chemical Inventory Status & Financial Analytics</div>

                  {(() => {
                    const processedChemRows = csvData.map((row) => {
                      if (!row) return null;
                      const trueColumns = [];
                      Object.keys(row).forEach(key => {
                        if (key !== '__parsed_extra') trueColumns.push(row[key]);
                      });
                      if (row.__parsed_extra && Array.isArray(row.__parsed_extra)) {
                        trueColumns.push(...row.__parsed_extra);
                      }

                      const noNum = parseInt(String(trueColumns[1]).replace(/[^0-9]/g, ''), 10);
                      if (isNaN(noNum) || noNum < 1 || noNum > 25) return null;
                      
                      let assignedArea = "Other Operations";
                      if (noNum >= 1 && noNum <= 4) assignedArea = "Pre-Treatment";
                      else if (noNum >= 5 && noNum <= 13) assignedArea = "RO Skid";
                      else if (noNum >= 14 && noNum <= 15) assignedArea = "DM Plant";
                      else if (noNum >= 16 && noNum <= 19) assignedArea = "Aux Boiler";
                      else if (noNum === 20) assignedArea = "CCW";
                      else if (noNum >= 21 && noNum <= 22) assignedArea = "HRSG";
                      else if (noNum >= 23 && noNum <= 25) assignedArea = "Cooling Tower";

                      const sanitizeMathField = (val) => {
                        if (!val || String(val).trim() === '-' || String(val).trim() === '') return 0;
                        return parseFloat(String(val).replace(/[^0-9.]/g, '')) || 0;
                      };

                      return {
                        area: assignedArea,
                        no: String(noNum),
                        name: String(trueColumns[2] || '').trim(),
                        type: String(trueColumns[3] || 'Process Feed'),
                        packageSize: String(trueColumns[4] || 'N/A'),
                        stockKg: sanitizeMathField(trueColumns[5]),
                        consumptionKg: sanitizeMathField(trueColumns[6]),
                        unitPrice: sanitizeMathField(trueColumns[7]),
                        totalOpex: sanitizeMathField(trueColumns[8])
                      };
                    }).filter(Boolean);

                    const areaBudgets = processedChemRows.reduce((acc, item) => {
                      acc[item.area] = (acc[item.area] || 0) + item.totalOpex;
                      return acc;
                    }, {});

                    const totalMonthlyOPEX = Object.values(areaBudgets).reduce((a, b) => a + b, 0);
                    const maxStockInSheet = Math.max(...processedChemRows.map(r => r.stockKg), 1);

                    return (
                      <>
                        <div style={{ ...styles.card, marginBottom: '32px', background: '#ffffff' }}>
                          <div style={{ ...styles.flowLabel, marginBottom: '16px', color: '#1e293b' }}>
                            Operational Expenditure (OPEX) Budget Allocations by Process Group
                          </div>
                          
                          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                            {["Pre-Treatment", "RO Skid", "DM Plant", "Aux Boiler", "CCW", "HRSG", "Cooling Tower"].map((area) => {
                              const cost = areaBudgets[area] || 0;
                              const budgetPct = totalMonthlyOPEX > 0 ? (cost / totalMonthlyOPEX) * 100 : 0;
                              return (
                                <div key={area} style={{ width: '100%' }}>
                                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', fontWeight: '700', color: '#334155', marginBottom: '6px' }}>
                                    <span>🏭 {area}</span>
                                    <span>{cost.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })} LKR <span style={{ color: '#64748b', fontWeight: '500' }}>({budgetPct.toFixed(1)}%)</span></span>
                                  </div>
                                  <div style={{ ...styles.progressBarOuter, height: '8px', backgroundColor: '#f1f5f9', marginBottom: 0 }}>
                                    <div style={{ ...styles.progressBarInner(budgetPct, '#2563eb'), height: '100%', transition: 'width 1s cubic-bezier(0.22, 1, 0.36, 1)' }}></div>
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                          
                          <div style={{ borderTop: '1px solid #e2e8f0', marginTop: '24px', paddingTop: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <span style={{ fontSize: '12px', fontWeight: '700', color: '#64748b', textTransform: 'uppercase' }}>Consolidated Chemical OPEX Pool</span>
                            <span style={{ fontSize: '22px', fontWeight: '800', color: '#0f172a' }}>{totalMonthlyOPEX.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })} LKR</span>
                          </div>
                        </div>

                        <div style={{ ...styles.flowLabel, marginBottom: '16px', color: '#1e293b' }}>
                          Active Chemical Warehouse Balance & Reserve Levels
                        </div>

                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(290px, 1fr))', gap: '20px' }}>
                          {processedChemRows.map((item, idx) => {
                            const isStockCritical = item.stockKg < 500;
                            const cardBorderColor = isStockCritical ? '#f43f5e' : 'rgba(0,0,0,0.05)';
                            const systemBadgeColor = isStockCritical ? '#ffe4e6' : '#eff6ff';
                            const systemBadgeText = isStockCritical ? '#e11d48' : '#2563eb';
                            const stockBarPct = (item.stockKg / maxStockInSheet) * 100;

                            const isCardHovered = hoveredIndex === `chem-card-${idx}`;
                            return (
                              <div
                                key={`chem-card-${idx}`}
                                className="theme-heatmap-block"
                                onMouseEnter={() => setHoveredIndex(`chem-card-${idx}`)}
                                onMouseLeave={() => setHoveredIndex(null)}
                                style={{
                                  backgroundColor: '#ffffff',
                                  borderRadius: '12px',
                                  border: isCardHovered ? '2px solid #38bdf8' : `1px solid ${cardBorderColor}`,
                                  padding: '20px',
                                  cursor: 'pointer',
                                  transform: isCardHovered ? 'scale(1.04) translateY(-4px)' : 'scale(1) translateY(0)',
                                  boxShadow: isCardHovered ? '0 12px 20px -5px rgba(0,0,0,0.08)' : '0 2px 4px rgba(0,0,0,0.01)',
                                  transition: 'all 0.5s cubic-bezier(0.22, 1, 0.36, 1)', // Smooth cards pop
                                  display: 'flex',
                                  flexDirection: 'column',
                                  justifyContent: 'space-between',
                                  position: 'relative'
                                }}
                              >
                                <div>
                                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '8px', marginBottom: '8px' }}>
                                    <h4 style={{ fontSize: '15px', fontWeight: '800', color: '#1e293b', margin: 0, lineHeight: '1.3' }}>
                                      {item.no}. {item.name}
                                    </h4>
                                    <span style={{ fontSize: '9px', fontWeight: '700', padding: '4px 8px', borderRadius: '6px', backgroundColor: systemBadgeColor, color: systemBadgeText, whiteSpace: 'nowrap', letterSpacing: '0.02em', textTransform: 'uppercase' }}>
                                      {isStockCritical ? '⚠️ LOW STOCK' : item.type}
                                    </span>
                                  </div>
                                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', fontWeight: '600', color: '#94a3b8', textTransform: 'uppercase', marginBottom: '16px' }}>
                                    <span>📍 {item.area}</span>
                                    <span style={{ color: '#64748b' }}>Pack: {item.packageSize} kg</span>
                                  </div>
                                </div>

                                <div style={{ backgroundColor: '#f8fafc', padding: '12px', borderRadius: '8px', marginBottom: '16px' }}>
                                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                                    <div>
                                      <div style={{ fontSize: '10px', fontWeight: '600', color: '#94a3b8', textTransform: 'uppercase' }}>Available Stock</div>
                                      <div style={{ fontSize: '18px', fontWeight: '800', color: isStockCritical ? '#e11d48' : '#0f172a' }}>
                                        {item.stockKg.toLocaleString()} <span style={{ fontSize: '12px', fontWeight: '500', color: '#64748b' }}>kg</span>
                                      </div>
                                    </div>
                                    <div style={{ textAlign: 'right' }}>
                                      <div style={{ fontSize: '10px', fontWeight: '600', color: '#94a3b8', textTransform: 'uppercase' }}>May Usage</div>
                                      <div style={{ fontSize: '18px', fontWeight: '800', color: '#334155' }}>
                                        {item.consumptionKg > 0 ? `${item.consumptionKg.toLocaleString()} kg` : '0 kg'}
                                      </div>
                                    </div>
                                  </div>
                                  <div style={{ ...styles.progressBarOuter, height: '6px', backgroundColor: '#e2e8f0', marginBottom: 0 }}>
                                    <div style={{ ...styles.progressBarInner(stockBarPct, isStockCritical ? '#e11d48' : '#10b981'), height: '100%' }}></div>
                                  </div>
                                </div>

                                <div style={{ borderTop: '1px dashed #e2e8f0', paddingTop: '12px', display: 'flex', justifyContent: 'space-between', fontSize: '12px' }}>
                                  <div>
                                    <span style={{ color: '#94a3b8', fontWeight: '500' }}>Rate: </span>
                                    <strong style={{ color: '#475569' }}>{item.unitPrice > 0 ? `${item.unitPrice.toLocaleString()} LKR` : 'N/A'}</strong>
                                  </div>
                                  <div style={{ textAlign: 'right' }}>
                                    <span style={{ color: '#94a3b8', fontWeight: '500' }}>Cost: </span>
                                    <strong style={{ color: '#2563eb' }}>{item.totalOpex > 0 ? `${item.totalOpex.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })} LKR` : '0.00 LKR'}</strong>
                                  </div>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </>
                    );
                  })()}
                </div>
              )}

              {/* MONTHLY VIEW 3: WTP ENERGY COST */}
              {activeTab === 'WTP Energy Cost' && (
                <div className="tab-entry-anim">
                  {/* Harmonized line animations using absolute global ease-out quint values */}
                  <style>{`
                    @keyframes energyFluidDraw { from { stroke-dashoffset: 2000; } to { stroke-dashoffset: 0; } }
                    .energy-spline-path { stroke-dasharray: 2000; stroke-dashoffset: 2000; animation: energyFluidDraw 1.8s cubic-bezier(0.22, 1, 0.36, 1) forwards; }
                  `}</style>

                  <div style={styles.viewTitle}>Monthly Power Metrics & Specific Energy Index</div>
                  
                  {(() => {
                    const TARIFF_RATE = 21;

                    const processedEnergyRows = csvData.map((row) => {
                      if (!row) return null;
                      const rowVals = Object.values(row);
                      const dateStr = String(rowVals[0] || '').trim();
                      
                      if (dateStr.toLowerCase() === 'date' || dateStr === '' || dateStr.toLowerCase().includes('total')) return null;
                      
                      const kwhVal = parseFloat(String(rowVals[2] || '0').replace(/[^0-9.]/g, '')) || 0;
                      const dmVal = parseFloat(String(rowVals[4] || '0').replace(/[^0-9.]/g, '')) || 0;
                      
                      return {
                        date: dateStr,
                        cumulativeGrid: parseFloat(String(rowVals[1] || '0').replace(/[^0-9.]/g, '')) || 0,
                        dailyKwh: kwhVal,
                        dmProd: dmVal,
                        calculatedCost: kwhVal * TARIFF_RATE
                      };
                    }).filter(Boolean);

                    const grossMonthlyKwh = processedEnergyRows.reduce((sum, r) => sum + r.dailyKwh, 0);
                    const grossMonthlyDM = processedEnergyRows.reduce((sum, r) => sum + r.dmProd, 0);
                    const grossEnergyCostPool = grossMonthlyKwh * TARIFF_RATE;
                    const plantSecIndex = grossMonthlyDM > 0 ? (grossMonthlyKwh / grossMonthlyDM) : 0;

                    const peakDailyCost = Math.max(...processedEnergyRows.map(d => d.calculatedCost), 10000) * 1.15;
                    const stepX = 920 / (processedEnergyRows.length - 1 || 1);

                    const graphPoints = processedEnergyRows.map((d, i) => {
                      const x = 75 + (i * stepX);
                      const y = 190 - ((d.calculatedCost / peakDailyCost) * 150);
                      return { ...d, x, y };
                    });

                    return (
                      <>
                        {/* EXECUTIVE ENERGY PROFILE KPI BANNER */}
                        <div style={{ display: 'flex', gap: '20px', marginBottom: '24px' }}>
                          <div style={{ ...styles.card, flex: 1, borderLeft: '4px solid #2563eb', background: '#ffffff' }}>
                            <div style={styles.flowLabel}>Consolidated Power Cost Pool</div>
                            <div style={{ ...styles.flowVal, fontSize: '26px', color: '#0f172a', fontWeight: '800', marginTop: '4px' }}>
                              {grossEnergyCostPool.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })} <span style={{ fontSize: '14px', color: '#64748b', fontWeight: '600' }}>LKR</span>
                            </div>
                          </div>
                          <div style={{ ...styles.card, flex: 1, borderLeft: '4px solid #10b981', background: '#ffffff' }}>
                            <div style={styles.flowLabel}>Gross Power Consumption</div>
                            <div style={{ ...styles.flowVal, fontSize: '26px', color: '#0f172a', fontWeight: '800', marginTop: '4px' }}>
                              {grossMonthlyKwh.toLocaleString()} <span style={{ fontSize: '14px', color: '#64748b', fontWeight: '600' }}>kWh</span>
                            </div>
                          </div>
                          <div style={{ ...styles.card, flex: 1, borderLeft: '4px solid #0284c7', background: '#ffffff' }}>
                            <div style={styles.flowLabel}>Specific Energy Consumption (SEC)</div>
                            <div style={{ ...styles.flowVal, fontSize: '26px', color: '#0284c7', fontWeight: '800', marginTop: '4px' }}>
                              {plantSecIndex.toFixed(2)} <span style={{ fontSize: '14px', color: '#64748b', fontWeight: '600' }}>kWh/m³</span>
                            </div>
                          </div>
                        </div>

                        {/* ANIMATED AREA-GRAPHS SPLINE MONITOR */}
                        <div style={styles.chartContainer}>
                          <div style={{ ...styles.flowLabel, marginBottom: '24px', color: '#1e293b' }}>
                            Daily Electricity Cost Operations Profile (Y-Axis: Cost [LKR] | X-Axis: Date)
                          </div>
                          <div style={{ position: 'relative', width: '100%' }}>
                            <svg viewBox="0 0 1000 240" style={{ width: '100%', height: 'auto', overflow: 'visible' }}>
                              <line x1="60" y1="40" x2="980" y2="40" stroke="#f1f5f9" strokeWidth="1" />
                              <line x1="60" y1="90" x2="980" y2="90" stroke="#f1f5f9" strokeWidth="1" />
                              <line x1="60" y1="140" x2="980" y2="140" stroke="#f1f5f9" strokeWidth="1" />
                              <line x1="60" y1="190" x2="980" y2="190" stroke="#cbd5e1" strokeWidth="2" />
                              
                              <text x="52" y="44" fill="#94a3b8" fontSize="10" textAnchor="end">{Math.round(peakDailyCost * 1.0).toLocaleString()} LKR</text>
                              <text x="52" y="94" fill="#94a3b8" fontSize="10" textAnchor="end">{Math.round(peakDailyCost * 0.66).toLocaleString()} LKR</text>
                              <text x="52" y="144" fill="#94a3b8" fontSize="10" textAnchor="end">{Math.round(peakDailyCost * 0.33).toLocaleString()} LKR</text>
                              <text x="52" y="194" fill="#475569" fontSize="10" textAnchor="end" fontWeight="700">0 LKR</text>

                              <defs>
                                <linearGradient id="energyCostGrad" x1="0" y1="0" x2="0" y2="1">
                                  <stop offset="0%" stopColor="#2563eb" stopOpacity="0.22"/>
                                  <stop offset="100%" stopColor="#2563eb" stopOpacity="0.00"/>
                                </linearGradient>
                              </defs>

                              {graphPoints.length > 0 && (
                                <>
                                  <path
                                    className="energy-spline-path"
                                    fill="url(#energyCostGrad)"
                                    d={`M 75 190 ${graphPoints.map(p => `L ${p.x} ${p.y}`).join(' ')} L ${graphPoints[graphPoints.length - 1].x} 190 Z`}
                                  />

                                  <path
                                    className="energy-spline-path"
                                    fill="none" stroke="#2563eb" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round"
                                    d={graphPoints.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`).join(' ')}
                                  />

                                  {graphPoints.map((p, i) => {
                                    const isHovered = hoveredIndex === `cost-node-${i}`;

                                    return (
                                      <g key={i} onMouseEnter={() => setHoveredIndex(`cost-node-${i}`)} onMouseLeave={() => setHoveredIndex(null)} style={{ cursor: 'pointer' }}>
                                        {isHovered && <line x1={p.x} y1="40" x2={p.x} y2="190" stroke="#38bdf8" strokeWidth="1.5" strokeDasharray="2 2" />}
                                        
                                        <circle 
                                          cx={p.x} 
                                          cy={p.y} 
                                          r={isHovered ? 7.5 : 4.5} 
                                          fill={isHovered ? '#38bdf8' : '#2563eb'} 
                                          style={{ 
                                            transition: 'all 0.5s cubic-bezier(0.22, 1, 0.36, 1)', // Smooth circle track expansion
                                            filter: isHovered ? 'drop-shadow(0 0 8px #38bdf8)' : 'none'
                                          }} 
                                        />
                                        
                                        {(i % 3 === 0 || isHovered) && (
                                          <text x={p.x} y="212" fill={isHovered ? '#2563eb' : '#64748b'} fontSize="9" textAnchor="middle" fontWeight="700" transform={`rotate(15, ${p.x}, 212)`}>
                                            {p.date}
                                          </text>
                                        )}

                                        {isHovered && (
                                          <g style={{ pointerEvents: 'none' }}>
                                            <rect x={p.x > 800 ? p.x - 155 : p.x + 15} y={p.y - 45} width="140" height="52" rx="6" fill="#1e293b" opacity="0.95" stroke="#38bdf8" strokeWidth="1" />
                                            <text x={p.x > 800 ? p.x - 85 : p.x + 85} y={p.y - 30} fill="#38bdf8" fontSize="10" fontWeight="700" textAnchor="middle">{p.date}</text>
                                            <text x={p.x > 800 ? p.x - 85 : p.x + 85} y={p.y - 12} fill="#ffffff" fontSize="11" fontWeight="800" textAnchor="middle">
                                              {p.calculatedCost.toLocaleString(undefined, { maximumFractionDigits: 2 })} LKR
                                            </text>
                                          </g>
                                        )}
                                      </g>
                                    );
                                  })}
                                </>
                              )}
                            </svg>
                          </div>
                        </div>

                        {/* Clean Data Ledger Table */}
                        <div style={{ ...styles.card, marginTop: '24px' }}>
                          <table style={styles.table}>
                            <thead>
                              <tr>
                                <th style={styles.th}>Date</th>
                                <th style={styles.th}>Cumulative Grid Value (kWh)</th>
                                <th style={styles.th}>Daily Consumption (kWh)</th>
                                <th style={styles.th}>DM Production (m³)</th>
                                <th style={styles.th}>Daily Energy Cost (LKR)</th>
                              </tr>
                            </thead>
                            <tbody>
                              {processedEnergyRows.map((row, i) => (
                                <tr key={i}>
                                  <td style={styles.td}><strong>{row.date}</strong></td>
                                  <td style={styles.td}>{row.cumulativeGrid.toLocaleString()}</td>
                                  <td style={styles.td}>{row.dailyKwh.toLocaleString()}</td>
                                  <td style={styles.td}>{row.dmProd.toLocaleString()} m³</td>
                                  <td style={styles.td}>
                                    <strong style={{ color: '#2563eb' }}>{row.calculatedCost.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })} LKR</strong>
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      </>
                    );
                  })()}
                </div>
              )}
            </>
          )}

        </div>
      </div>
    </div>
  );
}

export default App;