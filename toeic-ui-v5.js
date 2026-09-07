(()=>{
const meta=window.TOEIC_VOCAB_META||{senses:{},important:new Set()};
const term=q=>q.o[q.a];
const choiceText=q=>q.meaning||'';
const senseText=q=>q.c==='vocab'&&q.senses?.length?q.senses.map(x=>x[0]+'：'+x[1]).join(' / '):(q.meaning||'');
const searchSenseText=q=>q.c==='vocab'&&q.senses?.length?q.senses.map(x=>x[0]+' '+x[1]).join(' '):(q.meaning||'');
questions.filter(q=>q.c==='vocab').forEach(q=>{const t=term(q),s=meta.senses?.[t];if(s)q.senses=s;q.important=!!meta.important?.has?.(t)});

const style=document.createElement('style');style.id='toeicImportanceStyles';style.textContent=`
#quiz.toeic-important{border-color:#fbbf24!important;box-shadow:0 0 0 1px rgba(251,191,36,.35),0 18px 50px rgba(0,0,0,.38)!important;background:linear-gradient(180deg,rgba(65,48,10,.86),#0c192b)!important}
#quiz.toeic-important .qtext{color:#ffe08a}
.toeic-important-badge{display:inline-flex;align-items:center;margin-left:7px;padding:3px 7px;border-radius:999px;background:#5a4308;color:#ffe08a;border:1px solid #9c7618;font-size:10px;font-weight:950;vertical-align:middle}
.senseBox{margin:12px 0;padding:12px 13px;border:1px solid #34506f;border-radius:12px;background:#0a1728}
.senseBox strong{display:block;margin-bottom:7px;color:#d8ecff}.senseLine{padding:3px 0}.sensePos{display:inline-block;min-width:46px;color:#8fd3ff;font-weight:900}
.qtable tr.toeic-important-row td{background:rgba(251,191,36,.07)}
.qtable tr.toeic-important-row td:first-child{box-shadow:inset 3px 0 0 #fbbf24}
.toeic-list-star{color:#fbbf24;font-weight:950;margin-right:4px}
`;document.head.appendChild(style);

const shuffled=a=>[...a].sort(()=>Math.random()-.5);
const shown=q=>q.c==='phrase'?(q.display||term(q)):term(q);
const meaningOptions=c=>[...new Set(questions.filter(q=>q.c===c&&q.meaning).map(q=>q.meaning))];
function choiceMeanings(q){const correct=choiceText(q),rest=shuffled(meaningOptions(q.c).filter(x=>x!==correct)).slice(0,3);return shuffled([correct,...rest])}
function setImportance(q){const quiz=document.getElementById('quiz');quiz?.classList.toggle('toeic-important',!!q.important);const cat=document.getElementById('qcat');if(!cat)return;cat.textContent=q.c==='grammar'?'文法・'+(q.gc||'総合'):labels[q.c]+'問題';if(q.important){const b=document.createElement('span');b.className='toeic-important-badge';b.textContent='★ TOEIC重要';cat.appendChild(b)}}
function senseHtml(q){if(q.c!=='vocab'||!q.senses?.length)return'';return '<div class="senseBox"><strong>品詞ごとの意味</strong>'+q.senses.map(x=>'<div class="senseLine"><span class="sensePos">'+escapeHtml(x[0])+'</span>'+escapeHtml(x[1])+'</div>').join('')+'</div>'}

window.renderQuestion=function(){
  locked=false;const q=pool[pos];if(!q){showHome();return}setImportance(q);document.getElementById('qnum').textContent=(pos+1)+' / '+pool.length;
  const qt=document.getElementById('qtext'),box=document.getElementById('choices');box.innerHTML='';
  if(q.c==='vocab'||q.c==='phrase'){
    qt.textContent=shown(q);q._meanOpts=choiceMeanings(q);q._correct=q._meanOpts.indexOf(choiceText(q));
    q._meanOpts.forEach((x,i)=>{const b=document.createElement('button');b.className='choice';b.textContent=String.fromCharCode(65+i)+'. '+x;b.onclick=()=>answer(i,b);box.appendChild(b)});
  }else{
    qt.textContent=q.q;q.o.forEach((x,i)=>{const b=document.createElement('button');b.className='choice';b.textContent=String.fromCharCode(65+i)+'. '+x;b.onclick=()=>answer(i,b);box.appendChild(b)});
  }
  document.getElementById('explain').classList.add('hidden');document.getElementById('nextBtn').classList.add('hidden');
};

window.answer=function(i,b){
  if(locked)return;locked=true;const q=pool[pos],correct=(q.c==='vocab'||q.c==='phrase')?q._correct:q.a,buttons=[...document.querySelectorAll('.choice')];
  buttons[correct]?.classList.add('correct');if(i!==correct)b.classList.add('wrong');state.history[q.i]=i===correct;save();const e=document.getElementById('explain');
  if(q.c==='vocab'||q.c==='phrase'){
    const sentence=q.q.replace('_____',term(q)),meaning=choiceText(q),important=q.important?'<div style="margin:8px 0;color:#ffe08a;font-weight:900">★ TOEICで重要度が高い語</div>':'';
    e.innerHTML='<b>'+(i===correct?'正解！':'正解：'+String.fromCharCode(65+correct)+'. '+escapeHtml(meaning))+'</b><br><strong>'+escapeHtml(shown(q))+'：TOEIC頻出の意味「'+escapeHtml(meaning)+'」</strong>'+important+senseHtml(q)+'<br>📝 例文：'+escapeHtml(sentence)+'<br><br>📘 '+escapeHtml(q.e);
  }else{
    e.innerHTML='<b>'+(i===q.a?'正解！':'正解：'+String.fromCharCode(65+q.a)+'. '+escapeHtml(q.o[q.a]))+'</b><br><br>🇯🇵 <strong>問題の和訳</strong><br>'+escapeHtml(q.jp||'')+'<br><br>📘 <strong>解説</strong><br>'+escapeHtml(q.e);
  }
  e.classList.remove('hidden');document.getElementById('nextBtn').classList.remove('hidden');
};

window.renderList=function(){
  const cat=document.getElementById('listCat').value,s=document.getElementById('listSearch').value.toLowerCase(),body=document.getElementById('listBody');body.innerHTML='';
  questions.forEach((q,i)=>{
    if(cat!=='all'&&q.c!==cat)return;const text=q.c==='grammar'?q.q:shown(q),ans=q.c==='grammar'?String.fromCharCode(65+q.a)+'. '+q.o[q.a]:choiceText(q),category=q.c==='grammar'?'文法・'+(q.gc||'総合'):labels[q.c];
    const search=[text,ans,searchSenseText(q),q.q,q.o.join(' '),q.e,q.jp||'',q.gc||''].join(' ').toLowerCase();if(s&&!search.includes(s))return;
    const h=state.history[i],status=h===true?'<span class="ok">○ 正解</span>':h===false?'<span class="ng">× 復習</span>':'<span class="none">未回答</span>',tr=document.createElement('tr');if(q.important)tr.className='toeic-important-row';
    const mark=q.important?'<span class="toeic-list-star">★重要</span> ':'';const answerHtml=q.c==='vocab'&&q.senses?.length?'<strong>頻出：</strong>'+escapeHtml(ans)+'<br>'+q.senses.map(x=>'<span class="sensePos">'+escapeHtml(x[0])+'</span>'+escapeHtml(x[1])).join('<br>'):escapeHtml(ans||'');
    tr.innerHTML='<td>'+(i+1)+'</td><td>'+escapeHtml(category)+'</td><td>'+mark+'<strong>'+escapeHtml(text)+'</strong>'+(q.c==='grammar'&&q.jp?'<br><span class="none">'+escapeHtml(q.jp)+'</span>':'')+'</td><td>'+answerHtml+'</td><td>'+status+'</td>';body.appendChild(tr);
  });
};

const vc=[...document.querySelectorAll('button.card')].find(b=>b.querySelector('h3')?.textContent.includes('単語問題'));if(vc){const p=vc.querySelector('p');if(p)p.textContent='全300問。選択肢はTOEIC頻出の意味だけ。複数の品詞・意味は解説で確認できます。★金色はTOEIC重要語。'}
const ver=document.querySelector('.ver');if(ver)ver.textContent='ver 1.5.6';
})();