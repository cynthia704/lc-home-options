/* Design 3: menu, planned-link note, and a handful of scroll-triggered reveals. No libraries, no pinned sections. */
(function(){
 var doc=document.documentElement,mb=document.querySelector('.menu-btn'),mn=document.getElementById('mnav');
 if(mb)mb.addEventListener('click',function(){var o=mn.classList.toggle('open');mb.setAttribute('aria-expanded',o);mb.textContent=o?'Close':'Menu'});
 var toast=document.createElement('div'),tt;toast.className='toast';toast.setAttribute('role','status');document.body.appendChild(toast);
 document.addEventListener('click',function(e){var a=e.target.closest&&e.target.closest('[data-planned]');if(!a)return;e.preventDefault();toast.textContent=a.getAttribute('data-planned')||'This page comes in the next phase';toast.classList.add('on');clearTimeout(tt);tt=setTimeout(function(){toast.classList.remove('on')},1900)});
 if(!('IntersectionObserver' in window)||matchMedia('(prefers-reduced-motion: reduce)').matches){doc.classList.remove('js');return}
 var $$=function(q){return [].slice.call(document.querySelectorAll(q))};

 /* Headlines: wrap each word so it can slide up from behind its own edge. Text stays real text */
 $$('h1,h2').forEach(function(h){var i=0;h.classList.add('ws');
  (function walk(n){[].slice.call(n.childNodes).forEach(function(c){if(c.nodeType===3){var f=document.createDocumentFragment();c.textContent.split(/(\s+)/).forEach(function(w){if(!w)return;if(/^\s+$/.test(w)){f.appendChild(document.createTextNode(' '));return}var o=document.createElement('span'),b=document.createElement('b');o.className='wd';o.style.setProperty('--i',i++);b.textContent=w;o.appendChild(b);f.appendChild(o)});n.replaceChild(f,c)}else walk(c)})})(h)});

 var io=new IntersectionObserver(function(es){es.forEach(function(e){if(e.isIntersecting){e.target.classList.add('in');io.unobserve(e.target)}})},{rootMargin:'0px 0px -10% 0px'});
 $$('.rv,.ws,.cir,.bull,.st,.f-pic,.pathw').forEach(function(r){io.observe(r)});

 /* A clipped photo never counts as on screen for the browser's lazy loader, so start loading it just before it is reached */
 var near=new IntersectionObserver(function(es){es.forEach(function(e){if(e.isIntersecting){var i=e.target.querySelector('img');if(i)i.loading='eager';near.unobserve(e.target)}})},{rootMargin:'900px 0px'});
 $$('.cir').forEach(function(c){near.observe(c)});

 /* The winding line connects the three discs and stays in the gaps between the columns, clear of the text */
 var pw=document.querySelector('.pathw'),pl=pw&&pw.querySelector('.pline'),pa=pl&&pl.querySelector('path');
 function route(){if(!pa||!innerWidth||innerWidth<1000)return;var b=pw.getBoundingClientRect(),c=[].slice.call(pw.querySelectorAll('.st .n')).map(function(n){var r=n.getBoundingClientRect();return [r.left+r.width/2-b.left,r.top+r.height/2-b.top]});if(c.length<3)return;
  pl.setAttribute('viewBox','0 0 '+b.width+' '+b.height);pl.setAttribute('preserveAspectRatio','none');
  var seg=function(p,q){var m=(p[0]+q[0])/2+ (q[0]-p[0])*.12;return 'C '+m+' '+p[1]+', '+m+' '+q[1]+', '+q[0]+' '+q[1]};
  pa.setAttribute('d','M '+c[0][0]+' '+c[0][1]+' '+seg(c[0],c[1])+' '+seg(c[1],c[2]))}
 route();addEventListener('resize',route);addEventListener('load',route);
})();
