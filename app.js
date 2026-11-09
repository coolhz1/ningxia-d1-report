const $ = id => document.getElementById(id);
const fmt = n => Number(n).toFixed(2);
let report, scope = 'all', day = '2026-11-05';
let toastTimer;
function visibleDays(){return report.days.filter(d => scope === 'all' || d.date.startsWith(scope));}
function image(id, src){const el=$(id); if(el.getAttribute('src') !== src) el.src=src;}
function updateHash(){history.replaceState(null,'',`#scope=${scope}&day=${day}`);}
function renderDay(shouldScroll=false){
  const days=visibleDays(), selected=days.find(d=>d.date===day)||days[0]; day=selected.date;
  $('date').value=day; $('date').min=days[0].date; $('date').max=days[days.length-1].date;
  $('day-title').textContent=day; $('day-accuracy').textContent=fmt(selected.accuracy)+'%';
  $('day-mae').textContent=fmt(selected.mae); $('day-rmse').textContent=fmt(selected.rmse);
  image('day-price',selected.price); image('day-inputs',selected.inputs);
  $('previous').disabled=day===days[0].date; $('next').disabled=day===days[days.length-1].date;
  document.querySelectorAll('#daily-table tr').forEach(tr=>tr.classList.toggle('selected',tr.dataset.date===day));
  updateHash(); if(shouldScroll) $('daily').scrollIntoView({behavior:'smooth'});
}
function renderScope(){
  const s=report.scopes[scope];
  $('accuracy').innerHTML=fmt(s.accuracy)+'<span class="unit">%</span>';
  $('mae').textContent=fmt(s.mae); $('rmse').textContent=fmt(s.rmse);
  $('gain').innerHTML=fmt(s.gain)+'<span class="unit">%</span>';
  $('baseline').textContent='前日基线 MAE '+fmt(s.baseline_mae)+' 元/MWh';
  $('scope-range').textContent=`${s.start} 至 ${s.end} · ${s.days} 天 · ${s.hours} 个小时点`;
  document.querySelectorAll('[data-scope]').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.scope===scope)));
  image('overview-chart',s.chart); image('heatmap-chart',s.heatmap);
  $('daily-table').innerHTML=visibleDays().map(d=>`<tr data-date="${d.date}"><td><a href="#day=${d.date}" data-day="${d.date}">${d.date}</a></td><td>${fmt(d.accuracy)}%</td><td>${fmt(d.mae)}</td><td>${fmt(d.rmse)}</td><td>${fmt(d.bias)}</td><td>${d.clipped}</td></tr>`).join('');
  renderDay();
}
function shift(delta){const days=visibleDays(), index=days.findIndex(d=>d.date===day); if(days[index+delta]){day=days[index+delta].date;renderDay();}}
function toast(message){$('toast').textContent=message;$('toast').classList.add('visible');clearTimeout(toastTimer);toastTimer=setTimeout(()=>$('toast').classList.remove('visible'),2400);}
document.querySelectorAll('[data-scope]').forEach(b=>b.addEventListener('click',()=>{scope=b.dataset.scope;renderScope();}));
$('previous').addEventListener('click',()=>shift(-1));$('next').addEventListener('click',()=>shift(1));
$('date').addEventListener('change',e=>{if(visibleDays().some(d=>d.date===e.target.value)){day=e.target.value;renderDay();}else{e.target.value=day;}});
$('daily-table').addEventListener('click',e=>{const a=e.target.closest('[data-day]');if(a){e.preventDefault();day=a.dataset.day;renderDay(true);}});
document.querySelectorAll('[data-zoom]').forEach(el=>el.addEventListener('click',()=>{if(el.src){$('zoom-image').src=el.src;$('zoom-image').alt=el.alt;$('zoom-dialog').showModal();}}));
$('close-zoom').addEventListener('click',()=>$('zoom-dialog').close());
$('zoom-dialog').addEventListener('click',e=>{if(e.target===$('zoom-dialog'))$('zoom-dialog').close();});
$('share').addEventListener('click',async()=>{try{await navigator.clipboard.writeText(location.href);toast('网页链接已复制，可以直接转发。');}catch{toast('复制浏览器地址栏中的网址即可转发。');}});
fetch('report.json').then(r=>{if(!r.ok)throw Error('数据加载失败');return r.json();}).then(data=>{
  report=data; const params=new URLSearchParams(location.hash.slice(1));
  if(report.scopes[params.get('scope')])scope=params.get('scope');
  if(report.days.some(d=>d.date===params.get('day')))day=params.get('day');
  renderScope();
}).catch(e=>{$('scope-range').textContent='报告暂时无法加载，请刷新网页。';$('scope-range').classList.add('fatal');});
