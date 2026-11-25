/* Liberation Coach round 6: video engine, situation tabs, question panels and scroll scenes.
   Without JS, GSAP or with reduced motion the page is a plain, complete stack showing posters. */
(function(){
 var doc=document.documentElement,reduce=matchMedia('(prefers-reduced-motion: reduce)').matches;
 var fine=matchMedia('(hover: hover) and (pointer: fine)').matches,big=matchMedia('(min-width:901px)').matches,wide=matchMedia('(min-width:1180px)').matches;
 var anim=!!(window.gsap&&window.ScrollTrigger)&&!reduce;
 function $(s,r){return (r||document).querySelector(s)}function $$(s,r){return [].slice.call((r||document).querySelectorAll(s))}
 function clamp(v,a,b){return Math.max(a,Math.min(b,v))}
 if(anim&&wide&&$('.ones'))doc.classList.add('pinny');

 /* Menu */
 var mb=$('.menu-btn'),mn=$('#mnav');
 if(mb)mb.addEventListener('click',function(){var o=mn.classList.toggle('open');mb.setAttribute('aria-expanded',o);mb.textContent=o?'Close':'Menu'});

 /* The sticky Apply bar on phones steps aside whenever an Apply button is already on screen, so it never covers text or a second button */
 var mbar=$('.mbar');
 if(mbar&&'IntersectionObserver' in window){var ab=$$('main .btn'),mio=new IntersectionObserver(function(es){es.forEach(function(e){e.target._v=e.isIntersecting});mbar.classList.toggle('off',ab.some(function(b){return b._v}))},{threshold:.6});ab.forEach(function(b){mio.observe(b)})}

 /* Videos: only the ones on screen play. A visible button pauses all of them */
 var vids=$$('video'),paused=reduce,pv=document.createElement('button');
 pv.className='pv';pv.type='button';
 function label(){pv.textContent=paused?'Play video':'Pause video';pv.setAttribute('aria-pressed',paused)}
 function sync(v){if(paused||!v._in){v.pause();return}if(v._late){v.src=v._late;v._late=null}var p=v.play();if(p&&p.catch)p.catch(function(){})}
 if(vids.length){label();var hr=$('.hd-r'),phone=matchMedia('(max-width:699px)');
  /* On phones the video control lives in the menu so the logo has room */
  var place=function(){if(phone.matches&&mn)mn.appendChild(pv);else if(hr)hr.insertBefore(pv,hr.firstChild)};place();if(phone.addEventListener)phone.addEventListener('change',place);
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

 /* Situation tabs: tap, click or arrow keys. Without scripts every panel stays visible */
 $$('[data-tabs]').forEach(function(box){var bs=$$('[role=tab]',box),ps=$$('[role=tabpanel]',box),wrap=$('.tab-ps',box);if(!bs.length)return;box.classList.add('js-tabs');
  function pick(i,focus){bs.forEach(function(x,k){x.setAttribute('aria-selected',k===i);x.tabIndex=k===i?0:-1});ps.forEach(function(x,k){x.hidden=k!==i});if(focus)bs[i].focus()}
  bs.forEach(function(x,i){x.addEventListener('click',function(){pick(i)});x.addEventListener('keydown',function(e){var d=(e.key==='ArrowRight'||e.key==='ArrowDown')?1:(e.key==='ArrowLeft'||e.key==='ArrowUp')?-1:0;if(!d)return;e.preventDefault();pick((i+d+bs.length)%bs.length,true)})});
  /* hold the height of the tallest panel so nothing jumps when you switch */
  function hold(){wrap.style.minHeight='';var h=0;ps.forEach(function(x){var was=x.hidden;ps.forEach(function(y){y.hidden=y!==x});h=Math.max(h,wrap.offsetHeight);x.hidden=was});var on=bs.map(function(x){return x.getAttribute('aria-selected')==='true'}).indexOf(true);pick(on<0?0:on);wrap.style.minHeight=h+'px'}
  pick(0);hold();if(document.fonts&&document.fonts.ready)document.fonts.ready.then(hold);var rt;addEventListener('resize',function(){clearTimeout(rt);rt=setTimeout(hold,200)});
 });

 /* The three questions: each opens and closes on its own; the first starts open */
 $$('[data-acc] .q').forEach(function(q,i){var a=document.getElementById(q.getAttribute('aria-controls'));function set(o){q.setAttribute('aria-expanded',o);a.hidden=!o}set(i===0);q.addEventListener('click',function(){set(q.getAttribute('aria-expanded')!=='true');if(window.ScrollTrigger)ScrollTrigger.refresh()})});

 if(!anim)return;
 gsap.registerPlugin(ScrollTrigger);
 if(window.Lenis&&fine){var lenis=new Lenis({lerp:.11,smoothWheel:true});lenis.on('scroll',ScrollTrigger.update);gsap.ticker.add(function(t){lenis.raf(t*1000)});gsap.ticker.lagSmoothing(0);window.__lenis=lenis}
 var pr=$('.prog');if(pr)gsap.to(pr,{scaleX:1,ease:'none',scrollTrigger:{start:0,end:'max',scrub:true}});

 /* Hero entrance: the numerals rise, Victor steps in. The offer is never hidden while it waits */
 var oa=$('.one.a'),ob=$('.one.b'),hv=$('.h-v'),band=$('.h-band'),colon=$('.colon');
 if(oa){gsap.from([oa,ob],{yPercent:12,opacity:0,duration:1.1,ease:'power3.out',stagger:.12});if(hv)gsap.from(hv,{yPercent:18,opacity:0,duration:1.1,ease:'power3.out',delay:.25});if(colon)gsap.from($$('i',colon),{scale:0,duration:.5,stagger:.12,ease:'back.out(2.6)',delay:.7});
  var cta=$('.h-band .btn');
  gsap.delayedCall(1.5,function(){var d=$$('.colon i')[1];if(!d||!cta||scrollY>20)return;var a=d.getBoundingClientRect(),b=cta.getBoundingClientRect();if(b.bottom>innerHeight||!a.width)return;
   var narrow=b.width>innerWidth*.7,x1=narrow?b.left+b.width/2:b.right+18,y1=narrow?b.top-9:b.top+b.height/2,dot=document.createElement('span');dot.className='guide';dot.setAttribute('aria-hidden','true');document.body.appendChild(dot);
   gsap.set(dot,{x:a.left+a.width/2,y:a.top+a.height/2,width:a.width,height:a.height,xPercent:-50,yPercent:-50});
   var done=function(){if(dot.parentNode)dot.remove()};addEventListener('scroll',done,{once:true,passive:true});
   gsap.timeline({onComplete:done}).to(dot,{x:x1,duration:1.25,ease:'power1.inOut'},0).to(dot,{y:y1,duration:1.25,ease:'power2.in'},0).to(dot,{width:15,height:15,duration:1.25},0).add(function(){cta.classList.add('ring')},1.2).to(dot,{scale:0,duration:.4},1.75)});
  if(cta){var beat=function(){gsap.fromTo($$('.colon i'),{scale:1},{scale:1.35,duration:.22,yoyo:true,repeat:1,stagger:.08})};cta.addEventListener('pointerenter',beat);cta.addEventListener('focus',beat)}
  if(fine&&hv&&wide)$('.h-stage').addEventListener('pointermove',function(e){var x=e.clientX/innerWidth-.5,y=e.clientY/innerHeight-.5;gsap.to(hv,{x:x*14,duration:1,overwrite:'auto'})})}

 /* One short move: the 1s open into two cards for founders and athletes. The cards are shorter than the screen */
 if(doc.classList.contains('pinny')){
  var rect='polygon(0% 0%,50% 0%,100% 0%,100% 50%,100% 100%,0% 100%,0% 80%,0% 60%,0% 40%,0% 20%,0% 10%)',rts=$('.rts'),ra=$('.rt.a .tx'),rb=$('.rt.b .tx'),seam=$('.seam');
  var stage=$('.h-stage');
  function cardH(){return Math.min(innerHeight*.76,740)}
  function cardTop(){return 66+(innerHeight-66-cardH())/2}
  function cardW(){return (doc.clientWidth-48)/2}
  function spot(el){var r=el.getBoundingClientRect(),s=stage.getBoundingClientRect(),x=+gsap.getProperty(el,'x')||0,y=+gsap.getProperty(el,'y')||0;return {l:r.left-s.left-x,r:r.right-s.left-x,t:r.top-s.top-y}}
  var tl=gsap.timeline({defaults:{ease:'none'},scrollTrigger:{trigger:'.ones',start:'top top',end:'bottom bottom',scrub:.3,invalidateOnRefresh:true}});
  tl.to(band,{autoAlpha:0,y:40,duration:.2},0).to(colon,{autoAlpha:0,duration:.12},0).to(hv,{yPercent:60,autoAlpha:0,duration:.35},0)
    .to(oa,{x:function(){return 16-spot(oa).l},y:function(){return cardTop()-spot(oa).t},width:function(){return cardW()},height:function(){return cardH()},clipPath:rect,duration:.6,ease:'power2.inOut'},.02)
    .to(ob,{x:function(){return (doc.clientWidth-16)-spot(ob).r},y:function(){return cardTop()-spot(ob).t},width:function(){return cardW()},height:function(){return cardH()},clipPath:rect,duration:.6,ease:'power2.inOut'},.02)
    .fromTo(seam,{scaleY:0},{scaleY:1,duration:.15},.55)
    .set(rts,{visibility:'visible'},.58)
    .fromTo([ra,rb],{autoAlpha:0,y:30},{autoAlpha:1,y:0,duration:.2},.6)
    .to({}, {duration:.2},.8);
  var note=$('.h-note');if(note)tl.to(note,{autoAlpha:0,duration:.1},.05);
 }

 /* The colon's two dots drift apart slightly as this section passes */
 var sc=$$('.st-c');if(sc.length&&big){gsap.fromTo(sc[0],{y:-7},{y:7,ease:'none',scrollTrigger:{trigger:'.stmt',start:'top bottom',end:'bottom top',scrub:true}});gsap.fromTo(sc[1],{y:7},{y:-7,ease:'none',scrollTrigger:{trigger:'.stmt',start:'top bottom',end:'bottom top',scrub:true}})}

 /* Reflection: the window breathes on its own and opens a little with the scroll */
 var br=$('.b-win');
 if(br){var open={v:0};ScrollTrigger.create({trigger:'.breath',start:'top 90%',end:'top 10%',scrub:true,onUpdate:function(s){open.v=s.progress}});
  gsap.ticker.add(function(t){var base=Math.min(br.offsetHeight*.95,innerWidth*.3),b=(Math.sin(t*.78)+1)/2,r=base*(.8+b*.14)+open.v*base*.3;br.style.setProperty('--r',r.toFixed(0)+'px')})}

 /* Steps: scroll opens each panel in turn on large screens */
 if(pns.length&&big)ScrollTrigger.create({trigger:'.panels',start:'top 75%',end:'bottom 45%',scrub:true,onUpdate:function(s){setPn(Math.min(pns.length-1,Math.floor(s.progress*pns.length)))}});

 /* A small moving window follows the pointer over the answers */
 var pk=$('.peek');if(pk&&fine){pk.style.display='block';var qx=gsap.quickTo(pk,'x',{duration:.35}),qy=gsap.quickTo(pk,'y',{duration:.35}),qas=$$('.qa');qas.forEach(function(q){q.addEventListener('pointerenter',function(){pk.style.opacity=1});q.addEventListener('pointerleave',function(){pk.style.opacity=0});q.addEventListener('pointermove',function(e){qx(e.clientX+26);qy(e.clientY-120)})})}

 /* Generic rise-in */
 $$('[data-r]').forEach(function(el){gsap.from(el,{y:28,duration:.8,ease:'power3.out',scrollTrigger:{trigger:el,start:'top 92%',once:true}})});
 addEventListener('load',function(){ScrollTrigger.refresh()});
})();
