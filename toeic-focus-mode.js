(()=>{
  const style=document.createElement('style');
  style.id='toeicQuizFocusStyles';
  style.textContent=`
    body.toeic-quiz-focus #article-hub-card,
    body.toeic-quiz-focus #udemy-recommend,
    body.toeic-quiz-focus #guide {display:none!important}
  `;
  document.head.appendChild(style);

  function syncQuizFocus(){
    const quiz=document.getElementById('quiz');
    const active=!!quiz&&!quiz.classList.contains('hidden');
    document.body.classList.toggle('toeic-quiz-focus',active);
  }

  const observer=new MutationObserver(syncQuizFocus);
  observer.observe(document.body,{subtree:true,attributes:true,attributeFilter:['class']});
  syncQuizFocus();

  const ver=document.querySelector('.ver');
  if(ver)ver.textContent='ver 1.5.1';
})();
