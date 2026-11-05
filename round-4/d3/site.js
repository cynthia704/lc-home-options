/* Design 3: menu, a note for planned links, and one short fade-up. No libraries. The page is complete without this file. */
(function(){
 var doc=document.documentElement,mb=document.querySelector('.menu-btn'),mn=document.getElementById('mnav');
 if(mb)mb.addEventListener('click',function(){var o=mn.classList.toggle('open');mb.setAttribute('aria-expanded',o);mb.textContent=o?'Close':'Menu'});
 var toast=document.createElement('div'),tt;toast.className='toast';toast.setAttribute('role','status');document.body.appendChild(toast);
 document.addEventListener('click',function(e){var a=e.target.closest&&e.target.closest('[data-planned]');if(!a)return;e.preventDefault();toast.textContent=a.getAttribute('data-planned')||'This page comes in the next phase';toast.classList.add('on');clearTimeout(tt);tt=setTimeout(function(){toast.classList.remove('on')},1900)});
 var rv=[].slice.call(document.querySelectorAll('.rv'));
 if(!('IntersectionObserver' in window)||matchMedia('(prefers-reduced-motion: reduce)').matches){doc.classList.remove('js');return}
 var io=new IntersectionObserver(function(es){es.forEach(function(e){if(e.isIntersecting){e.target.classList.add('in');io.unobserve(e.target)}})},{rootMargin:'0px 0px -8% 0px'});
 rv.forEach(function(r){io.observe(r)});
})();
