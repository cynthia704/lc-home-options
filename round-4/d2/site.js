/* Liberation Coach round 4, Design 2: video engine and scroll scenes.
   Without JS, GSAP or with reduced motion the page is a plain, complete stack showing posters. */
(function(){
 var doc=document.documentElement,reduce=matchMedia('(prefers-reduced-motion: reduce)').matches;
 var fine=matchMedia('(hover: hover) and (pointer: fine)').matches,big=matchMedia('(min-width:901px)').matches;
 var anim=!!(window.gsap&&window.ScrollTrigger)&&!reduce;
 function $(s,r){return (r||document).querySelector(s)}function $$(s,r){return [].slice.call((r||document).querySelectorAll(s))}
 function clamp(v,a,b){return Math.max(a,Math.min(b,v))}
 if(anim&&big&&$('.ones'))doc.classList.add('pinny');

 /* Menu and planned links */
 var mb=$('.menu-btn'),mn=$('#mnav');
 if(mb)mb.addEventListener('click',function(){var o=mn.classList.toggle('open');mb.setAttribute('aria-expanded',o);mb.textContent=o?'Close':'Menu'});
 var toast=document.createElement('div');toast.className='toast';toast.setAttribute('role','status');document.body.appendChild(toast);var tt;
 document.addEventListener('click',function(e){var a=e.target.closest&&e.target.closest('[data-planned]');if(!a)return;e.preventDefault();toast.textContent=a.getAttribute('data-planned')||'This page comes in the next phase';toast.classList.add('on');clearTimeout(tt);tt=setTimeout(function(){toast.classList.remove('on')},1900)});

 /* Videos: only the ones on screen play. A visible button pauses all of them */
 var vids=$$('video'),paused=reduce,pv=document.createElement('button');
 pv.className='pv';pv.type='button';
 function label(){pv.textContent=paused?'Play video':'Pause video';pv.setAttribute('aria-pressed',paused)}
 function sync(v){if(paused||!v._in){v.pause();return}if(v._late){v.src=v._late;v._late=null}var p=v.play();if(p&&p.catch)p.catch(function(){})}
 if(vids.length){label();var hr=document.querySelector('.hd-r');if(hr)hr.insertBefore(pv,hr.firstChild);
  pv.addEventListener('click',function(){paused=!paused;label();vids.forEach(sync)});
  var io=new IntersectionObserver(function(es){es.forEach(function(e){e.target._in=e.isIntersecting;sync(e.target)})},{rootMargin:'200px'});
  vids.forEach(function(v){v.muted=true;v.setAttribute('muted','');v.setAttribute('playsinline','');v.loop=true;v._late=v.getAttribute('data-src');io.observe(v)});
 }

 /* Victor's own video plays only when someone asks for it */
 var lb=$('.lb');
 if(lb){var fr=$('.fr',lb),cl=$('button',lb),lastV;
  function closeLb(){lb.classList.remove('open');fr.textContent='';if(lastV)lastV.focus()}
  $$('[data-open-yt]').forEach(function(b){b.addEventListener('click',function(){var id=b.getAttribute('data-open-yt');if(!/^[\w-]{11}$/.test(id))return;lastV=b;var f=document.createElement('iframe');f.src='https://www.youtube-nocookie.com/embed/'+id+'?autoplay=1&rel=0';f.title='Victor Pierantoni on YouTube';f.allow='autoplay; encrypted-media; picture-in-picture';f.allowFullscreen=true;fr.appendChild(f);lb.classList.add('open');cl.focus()})});
  cl.addEventListener('click',closeLb);lb.addEventListener('click',function(e){if(e.target===lb)closeLb()});document.addEventListener('keydown',function(e){if(e.key==='Escape'&&lb.classList.contains('open'))closeLb()});
 }

 /* Steps panels work with or without motion */
 var pns=$$('.pn');function setPn(i){pns.forEach(function(p,k){p.classList.toggle('on',k===i)})}
 pns.forEach(function(p,i){p.addEventListener('click',function(){setPn(i)});if(fine)p.addEventListener('pointerenter',function(){setPn(i)})});

 /* Coaching: the video follows the paragraph you are reading */
 var spy=$('.spy');
 if(spy){var sv=$$('.scr video',spy),its=$$('.it',spy);
  var sio=new IntersectionObserver(function(es){es.forEach(function(e){if(e.isIntersecting){var k=its.indexOf(e.target);sv.forEach(function(v,i){v.classList.toggle('on',i===k)})}})},{rootMargin:'-45% 0px -45% 0px'});its.forEach(function(i){sio.observe(i)})}

 if(!anim)return;
 gsap.registerPlugin(ScrollTrigger);
 if(window.Lenis&&fine){var lenis=new Lenis({lerp:.11,smoothWheel:true});lenis.on('scroll',ScrollTrigger.update);gsap.ticker.add(function(t){lenis.raf(t*1000)});gsap.ticker.lagSmoothing(0);window.__lenis=lenis}
 var pr=$('.prog');if(pr)gsap.to(pr,{scaleX:1,ease:'none',scrollTrigger:{start:0,end:'max',scrub:true}});

 /* Hero entrance: the numerals rise, Victor steps in */
 var oa=$('.one.a'),ob=$('.one.b'),hv=$('.h-v'),band=$('.h-band'),colon=$('.colon');
 if(oa){gsap.from([oa,ob],{yPercent:12,opacity:0,duration:1.1,ease:'power3.out',stagger:.12});if(hv)gsap.from(hv,{yPercent:18,opacity:0,duration:1.1,ease:'power3.out',delay:.25});if(colon)gsap.from($$('i',colon),{scale:0,duration:.5,stagger:.12,ease:'back.out(2.6)',delay:.7});gsap.from($$('.h-band>*'),{y:26,opacity:0,duration:.8,stagger:.12,ease:'power3.out',delay:.35});
  if(fine&&hv)$('.h-stage').addEventListener('pointermove',function(e){var x=e.clientX/innerWidth-.5,y=e.clientY/innerHeight-.5;gsap.to(oa,{x:x*-26,y:y*-14,duration:1,overwrite:'auto'});gsap.to(ob,{x:x*-26,y:y*-14,duration:1,overwrite:'auto'});gsap.to(hv,{x:x*18,duration:1,overwrite:'auto'})})}

 /* One short move: the 1s open into the full split screen for founders and athletes */
 if(doc.classList.contains('pinny')){
  var rect='polygon(0% 0%,50% 0%,100% 0%,100% 50%,100% 100%,0% 100%,0% 80%,0% 60%,0% 40%,0% 20%,0% 10%)',rts=$('.rts'),ra=$('.rt.a .tx'),rb=$('.rt.b .tx'),seam=$('.seam');
  var tl=gsap.timeline({defaults:{ease:'none'},scrollTrigger:{trigger:'.ones',start:'top top',end:'bottom bottom',scrub:.3,invalidateOnRefresh:true}});
  tl.to(band,{autoAlpha:0,y:40,duration:.2},0).to(colon,{autoAlpha:0,duration:.12},0).to(hv,{yPercent:60,autoAlpha:0,duration:.35},0)
    .to(oa,{left:0,top:0,width:'50vw',height:'100svh',clipPath:rect,duration:.6,ease:'power2.inOut'},.02)
    .to(ob,{right:0,top:0,width:'50.2vw',height:'100svh',clipPath:rect,duration:.6,ease:'power2.inOut'},.02)
    .fromTo(seam,{scaleY:0},{scaleY:1,duration:.15},.55)
    .set(rts,{visibility:'visible'},.58)
    .fromTo([ra,rb],{autoAlpha:0,y:30},{autoAlpha:1,y:0,duration:.2},.6)
    .to({}, {duration:.2},.8);
  var note=$('.h-note');if(note)tl.to(note,{autoAlpha:0,duration:.1},.05);
 }

 /* The colon's two dots drift apart slightly as this section passes */
 var sc=$$('.st-c');if(sc.length&&big){gsap.fromTo(sc[0],{y:-7},{y:7,ease:'none',scrollTrigger:{trigger:'.stmt',start:'top bottom',end:'bottom top',scrub:true}});gsap.fromTo(sc[1],{y:7},{y:-7,ease:'none',scrollTrigger:{trigger:'.stmt',start:'top bottom',end:'bottom top',scrub:true}})}
 /* Fog: blur falls away as the three questions arrive */
 var fo=$('.focus');
 if(fo&&big){var fv=$('video',fo),qsl=$$('.qs li',fo);gsap.set(qsl,{opacity:.18});
  ScrollTrigger.create({trigger:$('.pin',fo),start:'top top',end:'bottom bottom',scrub:true,onUpdate:function(s){var p=s.progress;fv.style.filter='brightness('+(.5+p*.14).toFixed(3)+') blur('+((1-clamp(p/.86,0,1))*26).toFixed(1)+'px)';fv.style.transform='scale('+(1.14-p*.14).toFixed(3)+')';qsl.forEach(function(q,i){var o=clamp((p-(.14+i*.25))/.14,0,1);q.style.opacity=.18+o*.82;q.style.transform='translateX('+((1-o)*34).toFixed(1)+'px)'})}})}

 /* Reflection: window breathes on its own and opens with the scroll */
 var br=$('.b-win');
 if(br){var open={v:0},t0=0;ScrollTrigger.create({trigger:'.breath',start:'top 90%',end:'top 10%',scrub:true,onUpdate:function(s){open.v=s.progress}});
  gsap.ticker.add(function(t){var vmax=Math.max(innerWidth,innerHeight),b=(Math.sin(t*.78)+1)/2,r=vmax*.2+b*vmax*.05+open.v*vmax*.34;br.style.setProperty('--r',r.toFixed(0)+'px')})}

 /* Steps: scroll opens each panel in turn on large screens */
 if(pns.length&&big)ScrollTrigger.create({trigger:'.panels',start:'top 75%',end:'bottom 45%',scrub:true,onUpdate:function(s){setPn(Math.min(pns.length-1,Math.floor(s.progress*pns.length)))}});

 /* A small moving window follows the pointer over the answers */
 var pk=$('.peek');if(pk&&fine){pk.style.display='block';var qx=gsap.quickTo(pk,'x',{duration:.35}),qy=gsap.quickTo(pk,'y',{duration:.35}),qas=$$('.qa');qas.forEach(function(q){q.addEventListener('pointerenter',function(){pk.style.opacity=1});q.addEventListener('pointerleave',function(){pk.style.opacity=0});q.addEventListener('pointermove',function(e){qx(e.clientX+26);qy(e.clientY-120)})})}

 /* Generic rise-in */
 $$('[data-r]').forEach(function(el){gsap.from(el,{y:46,opacity:0,duration:.9,ease:'power3.out',scrollTrigger:{trigger:el,start:'top 88%',once:true}})});
 addEventListener('load',function(){ScrollTrigger.refresh()});
})();
