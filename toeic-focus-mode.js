(()=>{
  const style=document.createElement('style');
  style.id='toeicQuizFocusStyles';
  style.textContent=`
    body.toeic-quiz-focus #article-hub-card,
    body.toeic-quiz-focus #udemy-recommend,
    body.toeic-quiz-focus #guide,
    body.toeic-quiz-focus #seo-guides,
    body.toeic-quiz-focus a[href^="articles/"] {display:none!important}

    /* ORIVECTOR quiz polish: visual-only. No quiz DOM or start/answer logic is changed. */
    #quiz.quiz{max-width:760px;margin:18px auto 0;padding:20px;background:rgba(16,29,49,.96);border:1px solid #29425f;border-radius:20px;box-shadow:0 16px 42px #0005}
    #quiz .qmeta{margin:0 0 14px;padding:10px 12px;background:#0a1728;border:1px solid #29425f;border-radius:13px;color:#aebed1;font-size:12px;font-weight:800}
    #toeicQuizProgress{height:8px;background:#07111f;border:1px solid #29425f;border-radius:999px;overflow:hidden;margin:0 2px 16px}
    #toeicQuizProgressFill{height:100%;width:0;background:#22c55e;border-radius:999px;transition:width .2s ease}
    #quiz .qtext{font-size:clamp(20px,4.8vw,25px);line-height:1.65;margin:18px 2px 20px;font-weight:900}
    #quiz .choices{display:grid;gap:10px}
    #quiz .choice{min-height:56px;padding:15px 16px;border-radius:14px;background:#0d1c30;border:1px solid #2b4563;font-size:15px;line-height:1.55;box-shadow:none}
    #quiz .choice:hover{filter:brightness(1.06)}
    #quiz .choice.correct{border-color:#34d399;background:#103524}
    #quiz .choice.wrong{border-color:#fb7185;background:#3a1822}
    #quiz .explain{margin-top:16px;padding:17px;background:#0b1728;border:1px solid #29425f;border-left:4px solid #22c55e;border-radius:14px;line-height:1.8}
    #quiz #nextBtn{min-height:52px;border-radius:14px;font-size:15px;font-weight:900;box-shadow:0 10px 26px #0007}
    #quiz .btn.ghost.next{min-height:48px;border-radius:14px;background:#0d1c30}
    @media(max-width:520px){#quiz.quiz{margin-top:12px;padding:15px;border-radius:17px}#quiz .qmeta{padding:9px 10px}#quiz .choice{padding:14px 13px}}
  `;
  document.head.appendChild(style);

  const quiz=document.getElementById('quiz');
  const qmeta=quiz?.querySelector('.qmeta');
  const qnum=document.getElementById('qnum');
  if(quiz&&qmeta&&qnum&&!document.getElementById('toeicQuizProgress')){
    const track=document.createElement('div');
    track.id='toeicQuizProgress';
    track.setAttribute('aria-hidden','true');
    const fill=document.createElement('div');
    fill.id='toeicQuizProgressFill';
    track.appendChild(fill);
    qmeta.insertAdjacentElement('afterend',track);

    const updateProgress=()=>{
      const m=(qnum.textContent||'').match(/(\d+)\s*[\/／]\s*(\d+)/);
      if(!m)return;
      const current=Number(m[1]),total=Number(m[2]);
      const pct=total>0?Math.max(0,Math.min(100,current/total*100)):0;
      fill.style.width=pct+'%';
    };
    new MutationObserver(updateProgress).observe(qnum,{subtree:true,childList:true,characterData:true});
    updateProgress();
  }

  function syncQuizFocus(){
    const quiz=document.getElementById('quiz');
    const active=!!quiz&&!quiz.classList.contains('hidden');
    document.body.classList.toggle('toeic-quiz-focus',active);
  }

  const observer=new MutationObserver(syncQuizFocus);
  observer.observe(document.body,{subtree:true,attributes:true,attributeFilter:['class']});
  syncQuizFocus();

  const ver=document.querySelector('.ver');
  if(ver)ver.textContent='ver 1.5.6';
})();