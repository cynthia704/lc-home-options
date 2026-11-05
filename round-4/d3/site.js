/* Design 3: menu, planned-link note, and a handful of scroll-triggered reveals. No libraries, no pinned sections. */
(function(){
 var doc=document.documentElement,mb=document.querySelector('.menu-btn'),mn=document.getElementById('mnav');
 if(mb)mb.addEventListener('click',function(){var o=mn.classList.toggle('open');mb.setAttribute('aria-expanded',o);mb.textContent=o?'Close':'Menu'});
 var toast=document.createElement('div'),tt;toast.className='toast';toast.setAttribute('role','status');document.body.appendChild(toast);
 document.addEventListener('click',function(e){var a=e.target.closest&&e.target.closest('[data-planned]');if(!a)return;e.preventDefault();toast.textContent=a.getAttribute('data-planned')||'This page comes in the next phase';toast.classList.add('on');clearTimeout(tt);tt=setTimeout(function(){toast.classList.remove('on')},1900)});
 if(!('IntersectionObserver' in window)||matchMedia('(prefers-reduced-motion: reduce)').matches){doc.classList.remove('js');return}
 var $$=function(q){return [].slice.call(document.querySelectorAll(q))};

 /* Headlines: wrap each word so it can slide up from behind its own edge. Text stays real text */
 $$('h1,h2').forEach(function(h){var i=0;h.classList.remove('rv');h.classList.add('ws');
  (function walk(n){[].slice.call(n.childNodes).forEach(function(c){if(c.nodeType===3){var f=document.createDocumentFragment();c.textContent.split(/(\s+)/).forEach(function(w){if(!w)return;if(/^\s+$/.test(w)){f.appendChild(document.createTextNode(' '));return}var o=document.createElement('span'),b=document.createElement('b');o.className='wd';o.style.setProperty('--i',i++);b.textContent=w;o.appendChild(b);f.appendChild(o)});n.replaceChild(f,c)}else walk(c)})})(h)});

 /* Photos get the wiping color panel */
 $$('.intro figure,.rt figure,.m-pic,.e-pic,.bk.pic,.two figure').forEach(function(f){f.classList.remove('rv');f.classList.add('wipe')});
 /* Fact rows land in turn */
 $$('.facts li').forEach(function(l){l.classList.add('rv')});

 var io=new IntersectionObserver(function(es){es.forEach(function(e){if(e.isIntersecting){e.target.classList.add('in');io.unobserve(e.target)}})},{rootMargin:'0px 0px -10% 0px'});
 $$('.rv,.ws,.wipe,.f-pic').forEach(function(r){io.observe(r)});

 /* Gentle depth in the hero as the page scrolls: the disc drifts slower than the photo */
 var disc=document.querySelector('.h-pic .disc'),tick=false;
 if(disc){var mv=function(){tick=false;var y=Math.min(window.scrollY,innerHeight*1.2);disc.style.translate='0 '+(y*.09).toFixed(1)+'px'};addEventListener('scroll',function(){if(!tick){tick=true;requestAnimationFrame(mv)}},{passive:true})}
})();
