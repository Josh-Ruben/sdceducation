const programs=[
['BBA','Business','3-year, 6-semester Bachelor of Business Administration.'],
['BCA','Computing','Computer Applications.'],
['B.Com','Commerce','Bachelor of Commerce.'],
['B.B.A / B.Com — Aviation & Hospitality','Business','Aviation and Hospitality Management.'],
['B.B.A / B.Com — Supply Chain & Logistics','Business','Supply Chain and Logistics Management.'],
['BCA / BBA / B.Com — Data Analytics, AI & Cyber Security','Computing','Data Analytics, Artificial Intelligence and Cyber Security.'],
['B.E.','Engineering','Engineering programmes at Shree Devi Institute of Technology.'],
['M.Tech.','Engineering','Postgraduate engineering programme.'],
['M.B.A.','Management','Master of Business Administration.'],
['M.C.A.','Computing','Master of Computer Applications.'],
['B.Sc. Medical Laboratory Technology','Allied Health','Medical Laboratory Technology.'],
['B.Sc. Medical Imaging Technology','Allied Health','Medical Imaging Technology.'],
['B.Sc. Anaesthesia & Operation Theatre Technology','Allied Health','Anaesthesia and Operation Theatre Technology.'],
['B.Sc. Respiratory Care Technology','Allied Health','Respiratory Care Technology.'],
['B.Sc. Renal Dialysis Technology','Allied Health','Renal Dialysis Technology.'],
['B.P.T. / M.P.T.','Physiotherapy','Physiotherapy programmes.'],
['B.Sc. Nursing / M.Sc. Nursing','Nursing','Nursing programmes.'],
['B.S.W. / M.S.W.','Social Work','Social Work programmes.'],
['B.Sc. Fashion Design','Design','Fashion Design.'],
['G.N.M.','Nursing','General Nursing and Midwifery.'],
['B.Sc. Interior Design & Decoration','Design','Interior Design and Decoration.'],
['B.Pharm. / M.Pharm. / Pharm.D.','Pharmacy','Pharmacy programmes.']
];
const $=s=>document.querySelector(s); const $$=s=>document.querySelectorAll(s);
function bindNav(){const menu=$('.menu-btn'); if(menu) menu.addEventListener('click',()=>document.body.classList.toggle('nav-open'));}
function initSearch(){const input=$('#programSearch'), list=$('#programList'); if(!input||!list)return; const render=()=>{const q=input.value.toLowerCase().trim(); list.innerHTML=programs.filter(p=>p.join(' ').toLowerCase().includes(q)).map((p,i)=>`<article class="program"><small>${String(i+1).padStart(2,'0')}</small><div><h3>${p[0]}</h3><div>${p[2]}</div></div><span class="tag">${p[1]}</span></article>`).join('')||'<div class="notice">No matching programme found.</div>';}; input.addEventListener('input',render); render();}
async function initChat(){
  const fab=$('.chat-fab'),chat=$('.chat'),close=$('.chat-close'),form=$('.chat-form'),input=$('#chatInput'),log=$('.chat-log');
  if(!fab||!chat)return;
  fab.onclick=()=>chat.classList.add('open');
  if(close) close.onclick=()=>chat.classList.remove('open');
  const endpoint=window.SDC_AI_ENDPOINT;
  const history=[];
  const addBubble=(text,kind='')=>{const el=document.createElement('div'); el.className=`bubble ${kind}`; el.textContent=text; log.appendChild(el); log.scrollTop=log.scrollHeight; return el;};
  form.addEventListener('submit',async e=>{
    e.preventDefault();
    const q=input.value.trim(); if(!q)return;
    addBubble(q,'user'); input.value=''; input.disabled=true;
    const pending=addBubble('Thinking…');
    const controller=new AbortController();
    const timer=setTimeout(()=>controller.abort(),30000);
    try{
      if(!endpoint || endpoint.includes('YOUR-SDC-AI-BACKEND')) throw new Error('SDC AI backend is not configured yet.');
      const res=await fetch(endpoint,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({message:q,history}),signal:controller.signal});
      let data={};
      try{data=await res.json();}catch{}
      if(!res.ok) throw new Error(data.error||`Request failed (${res.status})`);
      const answer=data.answer||'No answer returned.';
      pending.textContent=answer;
      history.push({role:'user',content:q},{role:'assistant',content:answer});
      if(Array.isArray(data.sources)&&data.sources.length){
        const source=document.createElement('div'); source.className='bubble source';
        source.textContent=`Official sources: ${data.sources.slice(0,3).map(s=>s.title).join(' · ')}`;
        log.appendChild(source); log.scrollTop=log.scrollHeight;
      }
    }catch(err){
      console.error('SDC AI request failed',err);
      pending.textContent=err.name==='AbortError'?'SDC AI took too long to respond. Please try again.':(err.message||'SDC AI is temporarily unavailable.');
    }finally{clearTimeout(timer);input.disabled=false;input.focus();}
  });
}

bindNav();initSearch();initChat();
