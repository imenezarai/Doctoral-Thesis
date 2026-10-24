(() => {
  'use strict';
  const $ = (id) => document.getElementById(id);
  const menu = $('menuButton');
  menu.addEventListener('click', () => { const expanded=menu.getAttribute('aria-expanded') === 'true'; menu.setAttribute('aria-expanded',String(!expanded)); $('mobileNav').hidden=expanded; });
  document.querySelectorAll('.mobile-nav a').forEach(a=>a.addEventListener('click',()=>{menu.setAttribute('aria-expanded','false');$('mobileNav').hidden=true;}));
  let ticking=false;
  window.addEventListener('scroll',()=>{if(!ticking){requestAnimationFrame(()=>{let max=document.documentElement.scrollHeight-window.innerHeight; $('progress').style.width=`${max>0?(window.scrollY/max*100):0}%`; ticking=false;});ticking=true;}},{passive:true});
  // Conceptual scenario only: NOT an actual fitted forecasting algorithm.
  function updateSimulation() {
    const missing=Number($('missing').value); $('missingValue').value=`${missing}%`;
    const center = 121, uncertainty=5+missing*.36, x=532;
    const y=(v)=>214-(v-70)*2.30;
    $('confidenceBand').setAttribute('d',`M422 131 L${x} ${y(center+uncertainty).toFixed(1)} L${x} ${y(center-uncertainty).toFixed(1)} Z`);
    $('forecastLine').setAttribute('d',`M422 131 L${x} ${y(center).toFixed(1)}`);
    $('forecastRange').innerHTML=`± ${Math.round(uncertainty)}k <i>kWh</i>`;
    const tag = missing<10?'Fewer gaps':missing<25?'Review inputs':'Low data quality';
    $('reliabilityLabel').textContent=tag;
    $('reliabilityLabel').style.color=missing<10?'#3d8a66':missing<25?'#9a674b':'#b45e48';
    $('qualityMessage').textContent=missing===0?'No synthetic gaps are shown here. Real reliability still depends on measurement validity, model calibration and other quality dimensions.':`${missing}% of readings are missing in this illustration. A trustworthy system should communicate wider uncertainty and possible limitations, not false confidence.`;
  }
  $('missing').addEventListener('input',updateSimulation);updateSimulation();
  const stepData=[
    {kick:'STEP 01 / DATA FOUNDATION',title:'Connect real business signals.',desc:'Integrate energy readings, production volumes, operating hours, and external context. Document source, units and timestamps.',tools:['Python','SQL','ETL'],points:[58,68,78,64,81]},
    {kick:'STEP 02 / DATA QUALITY',title:'Make imperfections visible.',desc:'Measure missing readings, invalid values, inconsistent units, and delays. Preserve quality flags rather than hiding them.',tools:['Validation rules','Missingness','Data lineage'],points:[82,52,74,43,68]},
    {kick:'STEP 03 / PREDICTIVE AI',title:'Forecast with quality awareness.',desc:'Compare transparent baselines, conventional ML, and proposed quality-aware methods with appropriately calibrated uncertainty.',tools:['XGBoost','Time-series','Calibration'],points:[95,76,66,54,38]},
    {kick:'STEP 04 / EXPLAINABLE AI',title:'Explain the forecast and its limits.',desc:'Analyze important predictors and how stable explanations remain when input data are degraded. Separate association from causal claims.',tools:['SHAP','Stability','Uncertainty'],points:[88,61,73,45,58]},
    {kick:'STEP 05 / DECISION SUPPORT',title:'Turn insight into a human decision.',desc:'Prototype risk alerts and scenario reviews in a management dashboard. Measure whether the information improves real decisions.',tools:['Business Intelligence','Alerts','User study'],points:[77,66,46,59,34]}
  ];
  function chooseStep(index){let item=stepData[index];document.querySelectorAll('.arch-step').forEach((e,i)=>{e.classList.toggle('active',i===index);e.setAttribute('aria-pressed',String(i===index));});$('archKicker').textContent=item.kick;$('archTitle').textContent=item.title;$('archDescription').textContent=item.desc;$('archTools').innerHTML=item.tools.map(x=>`<span>${x}</span>`).join('');$('archGraphic').innerHTML=`<path d="M55 125 ${item.points.map((v,i)=>'L'+(110+i*50)+' '+v).join(' ')}" stroke="#ddff8c" stroke-width="5" fill="none" stroke-linecap="round" stroke-linejoin="round"/><g fill="#ddff8c">${item.points.map((v,i)=>`<circle cx="${110+i*50}" cy="${v}" r="5"/>`).join('')}</g><rect x="52" y="42" width="130" height="22" rx="10" fill="#315d4d"/><text x="64" y="57" fill="#e6ffbb" font-size="10" font-family="monospace">RESEARCH LAYER ${String(index+1).padStart(2,'0')}</text>`;}
  document.querySelectorAll('.arch-step').forEach(button=>button.addEventListener('click',()=>chooseStep(Number(button.dataset.step))));chooseStep(0);
  const phases=[
    {name:'Research & scope',start:1,end:6,kind:'method',tag:'METHODS',desc:'Define a narrow, publishable scientific question.',tasks:['Review Prof. Kruse’s public research and relevant literature.','Choose one KPI and forecast horizon; formulate testable hypotheses.','Specify data access, ethics, baselines and evaluation protocol.'],out:'Research Exposé + experimental protocol'},
    {name:'Data & baselines',start:5,end:12,kind:'engineering',tag:'ENGINEERING',desc:'Build an honest data foundation before developing new AI.',tasks:['Design reproducible ingestion and SQL data models.','Measure completeness, consistency, validity and timeliness.','Implement naïve, statistical and ML forecasting baselines.'],out:'Quality-assessed dataset + baseline repository'},
    {name:'Quality-aware ML',start:11,end:22,kind:'method',tag:'METHODS',desc:'Investigate a methodological contribution—not just a dashboard.',tasks:['Develop quality-aware forecasting and uncertainty variants.','Test controlled missingness, delays and anomalous readings.','Compare accuracy, interval calibration and robustness across methods.'],out:'Evaluated method + first research manuscript'},
    {name:'Explain & prototype',start:19,end:28,kind:'engineering',tag:'ENGINEERING',desc:'Connect trustworthy predictions to a usable interface.',tasks:['Test explanation fidelity and stability under data degradation.','Build a lightweight BI decision-support prototype.','Study risk alerts, quality warnings and manager trust.'],out:'Explainable AI prototype + research manuscript'},
    {name:'SME validation',start:25,end:33,kind:'evaluation',tag:'EVALUATION',desc:'Validate usefulness against authentic SME needs.',tasks:['Seek SME case studies and assess cross-company generalization.','Run scenario-based user evaluation with decision-makers.','Report limitations and reproduce all experiments.'],out:'Industrial/user study + empirical evidence'},
    {name:'Thesis & publications',start:28,end:36,kind:'evaluation',tag:'EVALUATION',desc:'Synthesize research results into a defensible thesis.',tasks:['Complete and revise papers and dissertation chapters.','Integrate feedback from doctoral supervisors.','Prepare final submission and defense according to regulations.'],out:'Dissertation manuscript and examination preparation'}
  ];
  let activePhase=2;
  const board=$('ganttBoard');
  const top=document.createElement('div');top.className='gantt-months'; const lbl=document.createElement('span');lbl.textContent='RESEARCH STREAM';top.appendChild(lbl);for(let m=1;m<=36;m++){let el=document.createElement('span');el.textContent=String(m).padStart(2,'0');top.appendChild(el)}board.appendChild(top);
  phases.forEach((phase,i)=>{
    const row=document.createElement('div');row.className='gantt-row'; const name=document.createElement('div');name.className='gantt-name';name.textContent=phase.name;row.appendChild(name);
    for(let n=1;n<=36;n++){const cell=document.createElement('span');cell.className='gantt-cell';cell.setAttribute('aria-hidden','true');row.appendChild(cell);}
    const bar=document.createElement('button');bar.type='button';bar.className='gantt-bar';bar.style.left=`calc(180px + (100% - 180px) * ${(phase.start-1)/36})`;bar.style.width=`calc((100% - 180px) * ${(phase.end-phase.start+1)/36})`;bar.style.background=phase.kind==='method'?'#d5fa87':phase.kind==='engineering'?'#8fcbbb':'#e6a781';bar.title=`${phase.name}: months ${phase.start}–${phase.end}`;bar.setAttribute('aria-label',`${phase.name}, months ${phase.start} to ${phase.end}: view tasks`);bar.textContent=`M${phase.start}–${phase.end}`;bar.addEventListener('click',()=>choosePhase(i));row.appendChild(bar);board.appendChild(row);
  });
  function choosePhase(i){activePhase=i;const p=phases[i];document.querySelectorAll('.gantt-bar').forEach((bar,j)=>bar.classList.toggle('active',j===i));$('ganttDetail').innerHTML=`<div><small>${p.tag} · MONTHS ${p.start}–${p.end}</small><h4>${p.name}</h4><p style="font-size:12px;color:#b7cfbf">${p.desc}</p><small>OUTPUT: ${p.out}</small></div><ul>${p.tasks.map(t=>`<li>${t}</li>`).join('')}</ul>`;}
  choosePhase(activePhase);
  const pitch='Dear Professor Kruse, my name is Imen Zarai. I am a Computer Science Engineer, former university lecturer and entrepreneur. I am interested in researching how SMEs can move from sustainability assessment toward trustworthy, explainable predictive decision support. The proposal builds on themes from your work in digital transformation, business process management and DiNaOpt4KMU. I would welcome your feedback on its scientific scope and whether a funded doctoral researcher position could be possible.';
  $('copyPitch').addEventListener('click',async()=>{try{await navigator.clipboard.writeText(pitch);$('copyMessage').textContent='Pitch copied — ready to share.';}catch(e){const ta=document.createElement('textarea');ta.value=pitch;document.body.appendChild(ta);ta.select();try{document.execCommand('copy');$('copyMessage').textContent='Pitch copied — ready to share.';}catch(_){$('copyMessage').textContent='Please select and copy the text manually.';}ta.remove();}});
})();
