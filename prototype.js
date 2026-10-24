/* EcoPilot AI: explicitly illustrative interactive front-end mockup.
   No data retrieval, ML inference, or empirical validation is performed. */
(() => {
  'use strict';
  const view = document.getElementById('appView');
  const tabs = [...document.querySelectorAll('.app-tab')];
  const demand = document.getElementById('prototypeDemand');
  const missing = document.getElementById('prototypeMissing');
  const missingOut = document.getElementById('prototypeMissingOutput');
  if (!view || !tabs.length || !demand || !missing || !missingOut) return;
  const state = {view: 'overview', selectedAction: 'audit'};
  const scenario = {
    normal: {label:'Normal operations', forecast:126, change:7, production:100, actual:118},
    high: {label:'Higher production', forecast:151, change:28, production:124, actual:118},
    efficient: {label:'Efficiency programme', forecast:106, change:-10, production:100, actual:118}
  };
  const get = () => {
    const s = scenario[demand.value] || scenario.normal;
    const gap = Number(missing.value);
    return {...s, gap, completeness:100-gap, spread:Math.round(6+gap*.72), low:s.forecast-Math.round(6+gap*.72), high:s.forecast+Math.round(6+gap*.72), intensity: Math.round((s.forecast/s.production)*44*10)/10};
  };
  const fmt = x => Math.round(x).toLocaleString('en-GB');
  function sparkPoints(values, height=170, width=630, x0=45, y0=15){
    const min=65,max=170; const dx=(width-2*x0)/(values.length-1);
    return values.map((v,i)=>[(x0+i*dx).toFixed(1),(y0+(max-v)/(max-min)*(height-2*y0)).toFixed(1)]);
  }
  const dLine = points => points.map((p,i)=>`${i?'L':'M'}${p[0]} ${p[1]}`).join(' ');
  function chart(s){
    const xs=[86,101,96,112,s.actual,s.forecast];
    const p=sparkPoints(xs,200,620,41,24), low=sparkPoints([86,101,96,112,s.actual,s.low],200,620,41,24), high=sparkPoints([86,101,96,112,s.actual,s.high],200,620,41,24);
    const band=`M ${high[4][0]} ${high[4][1]} L ${high[5][0]} ${high[5][1]} L ${low[5][0]} ${low[5][1]} L ${low[4][0]} ${low[4][1]} Z`;
    return `<svg class="app-chart-svg" viewBox="0 0 620 220" role="img" aria-label="Illustrative monthly energy chart with a forecast interval widening as missing data increases"><g stroke="#e1e9de" stroke-width="1">${[38,76,114,152,190].map(y=>`<path d="M38 ${y} H590"/>`).join('')}</g><g font-family="DM Sans,sans-serif" font-size="11" fill="#849588">${['JAN','FEB','MAR','APR','MAY','JUN'].map((x,i)=>`<text x="${26+i*107}" y="214">${x}</text>`).join('')}</g><path d="${band}" fill="#d6e4b3" opacity=".9"/><path d="${dLine(p.slice(0,5))}" fill="none" stroke="#255846" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/><path d="M${p[4][0]} ${p[4][1]} L${p[5][0]} ${p[5][1]}" stroke="#79a65a" stroke-dasharray="7 6" stroke-width="4" fill="none" stroke-linecap="round"/><circle cx="${p[5][0]}" cy="${p[5][1]}" r="6" fill="#4f9869"/><text x="510" y="22" font-family="DM Sans" font-size="12" font-weight="700" fill="#317449">${s.forecast}k kWh</text></svg>`;
  }
  function stat(label,value,foot='',highlight=false){return `<div class="app-stat ${highlight?'highlight':''}"><span>${label}</span><strong>${value}</strong><small>${foot}</small></div>`;}
  const qualityTag = s => s.gap>=25 ? ['Needs review','danger'] : s.gap>=10 ? ['Check inputs','warning'] : ['Inputs relatively complete',''];
  const n = s=> `<div class="app-method-note">Illustrative simulation only. These values come from demonstration rules, not a trained AI model or measured SME performance. The research would test these relationships empirically.</div>`;
  function overview(s){
    const tag=qualityTag(s);
    return `<div class="app-summary-grid">${stat('Latest measured energy',`${s.actual}k <i>kWh</i>`,'Illustrative previous month')}${stat('Next-month prediction',`${s.forecast}k <i>kWh</i>`,'Synthetic forecast',true)}${stat('Readings present',`${s.completeness}%`,'Completeness only')}${stat('Illustrative interval',`±${s.spread}k <i>kWh</i>`,'Not statistically calibrated')}</div>
      <div class="app-columns"><div class="app-card"><h4>Electricity: measured → predicted</h4><p>A visual preview of the proposed operational forecasting interface.</p>${chart(s)}<div class="app-chart-legend"><span><i style="background:#255846"></i>Sample history</span><span><i style="background:#79a65a"></i>Example forecast</span><span><i style="background:#d6e4b3"></i>Illustrative interval</span></div></div><div class="app-card"><h4>Manager's briefing</h4><div class="app-insights"><div class="app-insight"><b>Scenario: ${s.label}</b>Compared with the previous example period, the forecast change is ${s.change>0?'+':''}${s.change}%.</div><div class="app-insight warn"><b>Quality signal</b>${s.gap}% missing readings. <span class="app-flag ${tag[1]}">${tag[0]}</span></div><div class="app-insight"><b>Next action</b>Inspect data quality before acting on a predicted exceedance.</div></div></div></div>${n(s)}`;
  }
  function forecast(s){
    return `<div class="app-summary-grid">${stat('Prediction',`${s.forecast}k <i>kWh</i>`,'Next reporting period',true)}${stat('Illustrative lower',`${s.low}k <i>kWh</i>`,'Synthetic bound')}${stat('Illustrative upper',`${s.high}k <i>kWh</i>`,'Synthetic bound')}${stat('Input completeness',`${s.completeness}%`,'Affects the example band')}</div><div class="app-columns"><div class="app-card"><h4>A forecast should include its limits</h4><p>Use the missing-data slider above. The shaded band becomes wider as the example dataset becomes less complete.</p>${chart(s)}<div class="app-chart-legend">Shaded area = illustrative uncertainty, <b>not a confidence interval derived from a trained model</b>.</div></div><div class="app-card"><h4>The scientific experiment</h4><div class="app-metric-line"><span>Control baseline</span><b>Seasonal naïve / ML</b></div><div class="app-metric-line"><span>Experimental approach</span><b>Quality-aware learning</b></div><div class="app-metric-line"><span>Compare</span><b>Error · coverage · robustness</b></div><div class="app-insight warn"><b>The research question</b>Can explicit quality information improve uncertainty calibration when readings are missing or delayed?</div></div></div>${n(s)}`;
  }
  function quality(s){
    const completeness=s.completeness; const validity=Math.max(65,99-Math.round(s.gap*.26));const consistency=Math.max(63,97-Math.round(s.gap*.12));const freshness=Math.max(60,98-Math.round(s.gap*.20));
    const values=[['Completeness',completeness],['Validity (illustrative)',validity],['Consistency (illustrative)',consistency],['Freshness (illustrative)',freshness]];
    return `<div class="app-summary-grid">${stat('Missing readings',`${s.gap}%`,'Adjust slider above',true)}${stat('Available data',`${completeness}%`,'Synthetic completeness')}${stat('Checks configured','4','Quality dimensions')}${stat('Next step','Review','Before prediction')}</div><div class="app-columns"><div class="app-card"><h4>Make invisible data problems visible</h4><p>Illustrative quality dimensions. Each real indicator would require documented validation rules.</p><div class="app-quality-list">${values.map(([name,v])=>`<div class="app-quality-row"><b>${name}</b><div class="app-quality-track"><span style="width:${v}%"></span></div><output>${v}%</output></div>`).join('')}</div><div class="app-method-note">A thesis contribution would preserve quality indicators and investigate how they influence model predictions, uncertainty and explanations.</div></div><div class="app-card"><h4>Where would problems arise?</h4><div class="app-insights"><div class="app-insight warn"><b>Meter readings</b>Missing time windows may require review or careful imputation.</div><div class="app-insight"><b>ERP & production</b>Different units or reporting periods can break KPI comparisons.</div><div class="app-insight"><b>External data</b>Weather and emissions factors require timestamps and provenance.</div></div></div></div>`;
  }
  function explain(s){
    const drivers=[['Production workload',Math.max(24, s.production-56),'+'],['Ambient temperature',62,'+'],['Operating hours',44,'+'],['Efficiency measures',demand.value==='efficient'?81:19,'−']];
    return `<div class="app-summary-grid">${stat('Forecast',`${s.forecast}k <i>kWh</i>`,'Illustrative')}${stat('Readings missing',`${s.gap}%`,'Input quality')}${stat('Interpretation','Context','Not causality',true)}${stat('Stability','To test','Research objective')}</div><div class="app-columns"><div class="app-card"><h4>Why might the forecast change?</h4><p>Example visual explanation drivers — <b>not computed SHAP values</b>.</p><div class="app-drivers">${drivers.map(([label,v,sign])=>`<div class="app-driver"><span>${label}</span><div class="app-driver-track"><span style="width:${v}%"></span></div><b>${sign}</b></div>`).join('')}</div><div class="app-method-note">Scientific novelty: test whether explanations become unstable as data quality deteriorates, and design appropriate reliability warnings.</div></div><div class="app-card"><h4>Explain the explanation</h4><div class="app-insights"><div class="app-insight"><b>What is this?</b>Feature influence is a model-level interpretation, not proof that a variable caused the outcome.</div><div class="app-insight warn"><b>Data limitation</b>${s.gap}% of example readings are missing. A deployed system should quantify when this undermines interpretation.</div><div class="app-insight"><b>Scientific test</b>Fidelity and stability across controlled corruption settings.</div></div></div></div>`;
  }
  const actions = {audit:['Check meter readings','Review missing intervals, unit conversions and source system freshness before making a management decision.'],shift:['Review production scheduling','Evaluate whether the planned operating schedule explains the predicted load; discuss constraints with operations.'],efficiency:['Consider an energy-efficiency audit','Identify relevant equipment and gather additional evidence before committing to an intervention.']};
  function action(s){
    const threshold=130;const risk=s.low>threshold?'Likely exceedance in illustration':s.high>threshold?'Possible exceedance':'Below threshold in illustration';
    const selected=actions[state.selectedAction];
    return `<div class="app-summary-grid">${stat('Illustrative target',`${threshold}k <i>kWh</i>`,'Next month')}${stat('Predicted load',`${s.forecast}k <i>kWh</i>`,'Scenario-driven',true)}${stat('Risk signal',risk,'Depends on chosen scenario')}${stat('Human approval','Required','Research design')}</div><div class="app-columns"><div class="app-card"><h4>From an alert to a business process</h4><p>Choose a manager action to preview how a decision could be documented and reviewed.</p><div class="app-action-options">${Object.entries(actions).map(([key,v])=>`<button type="button" class="app-action-choice ${key===state.selectedAction?'selected':''}" data-action="${key}" aria-pressed="${key===state.selectedAction}">${v[0]} <span>↗</span></button>`).join('')}</div><div class="app-decision-output"><h4>Proposed review: ${selected[0]}</h4><p>${selected[1]}</p><small>RECOMMENDATION FOR HUMAN REVIEW · NOT AUTOMATICALLY EXECUTED</small></div></div><div class="app-card"><h4>Research link: process management</h4><div class="app-insights"><div class="app-insight"><b>1 · Detect</b>Identify an upcoming KPI threshold deviation.</div><div class="app-insight"><b>2 · Explain</b>Display data-quality limits, plausible drivers and prediction uncertainty.</div><div class="app-insight"><b>3 · Decide</b>Managers review options, record a decision and its rationale.</div><div class="app-insight"><b>4 · Evaluate</b>Study whether this improves real decision quality compared with ordinary reporting.</div></div></div></div>${n(s)}`;
  }
  const screens={overview:['Sustainability overview','The management picture, with tomorrow in view.',overview],forecast:['Predictive sustainability AI','An uncertain forecast should look uncertain.',forecast],quality:['Data quality control room','Trust begins with knowing what is missing.',quality],explain:['Explainable AI studio','Understand what the model knows—and what it does not.',explain],action:['Business decision lab','Connect insight to a transparent management process.',action]};
  function render(){
    const s=get(), screen=screens[state.view]||screens.overview;
    document.getElementById('appTitle').textContent=screen[0];document.getElementById('appSubtitle').textContent=screen[1];
    missingOut.textContent=s.gap+'%';
    tabs.forEach(b=>{const yes=b.dataset.view===state.view;b.classList.toggle('is-active',yes);b.setAttribute('aria-selected',yes?'true':'false');b.tabIndex=yes?0:-1;});
    view.innerHTML=screen[2](s);
    view.querySelectorAll('[data-action]').forEach(b=>b.addEventListener('click',()=>{state.selectedAction=b.dataset.action;render();}));
  }
  tabs.forEach((b,i)=>{
    b.addEventListener('click',()=>{state.view=b.dataset.view;render();});
    b.addEventListener('keydown',e=>{if(!['ArrowRight','ArrowLeft','Home','End'].includes(e.key))return;e.preventDefault();let index=e.key==='Home'?0:e.key==='End'?tabs.length-1:(i+(e.key==='ArrowRight'?1:-1)+tabs.length)%tabs.length;tabs[index].focus();state.view=tabs[index].dataset.view;render();});
  });
  demand.addEventListener('change',render);missing.addEventListener('input',render);render();
})();
