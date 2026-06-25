// ── CURSOR ──
const cur = document.getElementById('cur');
const ring = document.getElementById('cur-ring');
if(cur && ring){
  let mx=0,my=0,rx=0,ry=0;
  document.addEventListener('mousemove',e=>{
    mx=e.clientX; my=e.clientY;
    cur.style.left=mx+'px'; cur.style.top=my+'px';
  });
  (function animR(){
    rx+=(mx-rx)*.12; ry+=(my-ry)*.12;
    ring.style.left=rx+'px'; ring.style.top=ry+'px';
    requestAnimationFrame(animR);
  })();
  document.querySelectorAll('a,button,.card-hover,.gallery-item,.pillar,.award-tile').forEach(el=>{
    el.addEventListener('mouseenter',()=>document.body.classList.add('cursor-hover'));
    el.addEventListener('mouseleave',()=>document.body.classList.remove('cursor-hover'));
  });
}

// ── LOADER ──
window.addEventListener('load',()=>{
  const ld=document.getElementById('loader');
  if(ld) setTimeout(()=>ld.classList.add('out'),1900);
});

// ── NAV SCROLL + ACTIVE ──
const navEl=document.getElementById('nav');
if(navEl){
  window.addEventListener('scroll',()=>navEl.classList.toggle('scrolled',scrollY>60));
  const page=location.pathname.split('/').pop().replace('.html','');
  document.querySelectorAll('.nav-links a').forEach(a=>{
    const href=a.getAttribute('href').replace('.html','').replace('./','');
    if(href===page||(page===''&&href==='index')) a.classList.add('active');
  });
}

// ── HAMBURGER ──
const ham=document.querySelector('.hamburger');
const mob=document.querySelector('.mobile-menu');
if(ham&&mob){
  ham.addEventListener('click',()=>{
    ham.classList.toggle('open');
    mob.classList.toggle('open');
    document.body.style.overflow=mob.classList.contains('open')?'hidden':'';
  });
  mob.querySelectorAll('a').forEach(a=>a.addEventListener('click',()=>{
    ham.classList.remove('open'); mob.classList.remove('open');
    document.body.style.overflow='';
  }));
}

// ── SCROLL REVEAL ──
const revObs=new IntersectionObserver(entries=>{
  entries.forEach(e=>{if(e.isIntersecting){e.target.classList.add('in');}});
},{threshold:.1});
document.querySelectorAll('.rev,.rev-l,.rev-r').forEach(el=>revObs.observe(el));

// ── STAGGER helper ──
function staggerReveal(selector,delay=0.08){
  document.querySelectorAll(selector).forEach((el,i)=>{
    el.style.transitionDelay=`${i*delay}s`;
    revObs.observe(el);
  });
}

// ── COUNTER ──
function initCounters(){
  const obs=new IntersectionObserver(entries=>{
    if(entries[0].isIntersecting){
      document.querySelectorAll('[data-count]').forEach(el=>{
        const t=+el.dataset.count, sfx=el.dataset.sfx||'+';
        let c=0;
        const timer=setInterval(()=>{c=Math.min(c+Math.ceil(t/50),t); el.textContent=c+sfx; if(c>=t)clearInterval(timer);},30);
      });
      obs.disconnect();
    }
  },{threshold:.4});
  const num=document.querySelector('.num-grid');
  if(num) obs.observe(num);
}
document.addEventListener('DOMContentLoaded',initCounters);

// ── SPEECH ──
const speechPhrases=[
  "Vanakkam! I'm Prof. Dr. P.S. Senthilkumar 🙏",
  "Principal · KR Arts & Science College",
  "Guinness World Record — 59 hrs Yoga! 🌍",
  "25+ years transforming lives through education.",
  "Welcome to my portfolio! ✨"
];
let spIdx=0,spChar=0,spTimer;
const spBox=document.getElementById('speechBox');
const spTxt=document.getElementById('bubbleText');
const spOuter=document.getElementById('photoOuter');

function typePhrase(){
  if(!spBox||!spTxt) return;
  const phrase=speechPhrases[spIdx];
  spChar=0; spTxt.textContent='';
  spBox.classList.add('on');
  function t(){
    if(spChar<phrase.length){spTxt.textContent+=phrase[spChar++];spTimer=setTimeout(t,42);}
    else{setTimeout(()=>{spBox.classList.remove('on');setTimeout(()=>{spIdx=(spIdx+1)%speechPhrases.length;typePhrase();},600);},2400);}
  }
  t();
}

function autoSpeak(){
  if(!window.speechSynthesis) return;
  const msg="Vanakkam! I am Professor Doctor P.S. Senthilkumar, Principal of KR Arts and Science College, Madurai. I hold a Guinness World Record for 59 hours of continuous Yoga without food or sleep! With 25 years in education, I believe teachers are the true architects of society. Welcome to my portfolio!";
  const u=new SpeechSynthesisUtterance(msg);
  u.lang='en-IN'; u.rate=0.88; u.pitch=1.05;
  const vs=speechSynthesis.getVoices();
  const maleNames=['Male','male','David','James','Daniel','Rishi','Google हिन्दी','en-IN-Standard-B','en-IN-Wavenet-B','en-IN-Standard-C','en-IN-Wavenet-C'];
  const v=vs.find(v=>maleNames.some(n=>v.name.includes(n))&&v.lang.startsWith('en'))
    ||vs.find(v=>v.lang==='en-IN'&&v.name.toLowerCase().includes('male'))
    ||vs.find(v=>v.name==='Google UK English Male')
    ||vs.find(v=>v.name==='Microsoft David')
    ||vs.find(v=>v.lang==='en-IN')
    ||vs.find(v=>v.lang.startsWith('en'));
  if(v) u.voice=v;
  u.pitch=0.85;
  if(spOuter){u.onstart=()=>spOuter.classList.add('speaking');u.onend=()=>spOuter.classList.remove('speaking');}
  speechSynthesis.cancel(); speechSynthesis.speak(u);
}

window.addEventListener('load',()=>{
  if(spBox){
    setTimeout(typePhrase,2200);
    let spoken=false;
    function doSpeak(){
      if(spoken) return;
      spoken=true;
      speechSynthesis.cancel();
      const vs=speechSynthesis.getVoices();
      if(vs.length>0){ autoSpeak(); }
      else{ speechSynthesis.onvoiceschanged=()=>{ speechSynthesis.onvoiceschanged=null; autoSpeak(); }; }
    }
    ['click','scroll','touchstart'].forEach(ev=>document.addEventListener(ev,doSpeak,{once:true,passive:true}));
  }
});
