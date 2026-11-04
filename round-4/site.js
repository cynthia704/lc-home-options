/* Liberation Coach round 4: motion engine. Every scene is optional and page-safe.
   Without JS, GSAP, WebGL or with reduced motion the page stays complete and readable. */
(function(){
 var doc=document.documentElement,reduce=matchMedia('(prefers-reduced-motion: reduce)').matches;
 var fine=matchMedia('(hover: hover) and (pointer: fine)').matches,big=matchMedia('(min-width:901px)').matches;
 var hasG=!!(window.gsap&&window.ScrollTrigger),anim=hasG&&!reduce;
 doc.classList.add('js');if(!anim)doc.classList.add('static');
 function $(s,r){return (r||document).querySelector(s)}function $$(s,r){return [].slice.call((r||document).querySelectorAll(s))}
 function clamp(v,a,b){return Math.max(a,Math.min(b,v))}

 /* Menu, planned links, video lightbox: these work with or without motion */
 var mb=$('.menu-btn'),mn=$('#mnav');
 if(mb)mb.addEventListener('click',function(){var o=mn.classList.toggle('open');mb.setAttribute('aria-expanded',o);mb.textContent=o?'Close':'Menu'});
 var toast=document.createElement('div');toast.className='toast';toast.setAttribute('role','status');document.body.appendChild(toast);var tt;
 document.addEventListener('click',function(e){var a=e.target.closest&&e.target.closest('[data-planned]');if(!a)return;e.preventDefault();toast.textContent=a.getAttribute('data-planned')||'This page comes in the next phase';toast.classList.add('on');clearTimeout(tt);tt=setTimeout(function(){toast.classList.remove('on')},1900)});
 var lb=$('.lb');
 if(lb){var fr=$('.fr',lb),cl=$('button',lb),lastV;
  function closeLb(){lb.classList.remove('open');fr.innerHTML='';if(lastV)lastV.focus()}
  $$('[data-yt]').forEach(function(b){b.addEventListener('click',function(){var id=b.getAttribute('data-yt');if(!/^[\w-]{11}$/.test(id))return;lastV=b;
   var f=document.createElement('iframe');f.src='https://www.youtube-nocookie.com/embed/'+id+'?autoplay=1&rel=0';f.title='Victor Pierantoni on YouTube';f.allow='autoplay; encrypted-media; picture-in-picture';f.allowFullscreen=true;fr.appendChild(f);lb.classList.add('open');cl.focus()})});
  cl.addEventListener('click',closeLb);lb.addEventListener('click',function(e){if(e.target===lb)closeLb()});document.addEventListener('keydown',function(e){if(e.key==='Escape'&&lb.classList.contains('open'))closeLb()});
 }

 /* Torn edges: a jagged polygon, seeded so each edge is different and stable */
 function rnd(seed){var s=seed;return function(){s=(s*16807)%2147483647;return (s-1)/2147483646}}
 function tornTop(seed,amp){var r=rnd(seed),n=70,pts=[],y=50;for(var i=0;i<=n;i++){y+=(r()-.5)*amp;y=clamp(y,8,92);if(i%5===0)y+=(r()-.5)*amp*1.5;y=clamp(y,6,94);pts.push((i/n*100).toFixed(2)+'% '+y.toFixed(1)+'%')}return 'polygon('+pts.join(',')+',100% 100%,0 100%)'}
 $$('[data-tear]').forEach(function(s,i){var kind=s.getAttribute('data-tear'),f=document.createElement('div'),t=document.createElement('div');f.className='tear-f';t.className='tear '+kind;
  f.style.clipPath=tornTop(1213+i*77,22);t.style.clipPath=tornTop(3301+i*91,20);f.setAttribute('aria-hidden','true');t.setAttribute('aria-hidden','true');s.insertBefore(t,s.firstChild);s.insertBefore(f,s.firstChild)});

 /* Tape tickers run even in static mode only if motion is allowed */
 if(!anim)return;
 gsap.registerPlugin(ScrollTrigger);

 /* Smooth wheel */
 var lenis=null;
 if(window.Lenis&&fine){lenis=new Lenis({lerp:.11,smoothWheel:true});lenis.on('scroll',ScrollTrigger.update);gsap.ticker.add(function(t){lenis.raf(t*1000)});gsap.ticker.lagSmoothing(0);window.__lenis=lenis}

 /* Progress + velocity */
 var vel=0,lastY=scrollY;
 gsap.ticker.add(function(){var y=scrollY;vel+=(y-lastY-vel)*.12;lastY=y});
 var pr=$('.prog');if(pr)gsap.to(pr,{scaleX:1,ease:'none',scrollTrigger:{start:0,end:'max',scrub:true}});

 /* Opening rip, under a second */
 var cu=$('.curtain');
 if(cu){var ct=$('.ct',cu),cb=$('.cb',cu);ct.style.clipPath=tornTop(991,18).replace(/polygon\(/,'polygon(').replace(/,100% 100%,0 100%\)$/,',100% 0,0 0)');cb.style.clipPath=tornTop(991,18);
  gsap.timeline({onComplete:function(){cu.remove()}}).to($('img',cu),{opacity:0,scale:1.25,duration:.22,delay:.2}).to(ct,{yPercent:-105,rotation:-1.5,duration:.55,ease:'power3.inOut'},.28).to(cb,{yPercent:105,rotation:1.5,duration:.55,ease:'power3.inOut'},.28)}

 /* Hero headline: letters rise, then widen under the pointer */
 var h1=$('.hero h1');
 if(h1){var label=h1.textContent.replace(/\s+/g,' ').trim(),chars=[];
  (function split(node){[].slice.call(node.childNodes).forEach(function(c){if(c.nodeType===3){var f=document.createDocumentFragment();c.textContent.split(/(\s+)/).forEach(function(w){if(!w)return;if(/^\s+$/.test(w)){f.appendChild(document.createTextNode(' '));return}var wd=document.createElement('span');wd.className='wd';w.split('').forEach(function(ch){var s=document.createElement('span');s.className='ch';s.textContent=ch;wd.appendChild(s);chars.push(s)});f.appendChild(wd)});node.replaceChild(f,c)}else split(c)})})(h1);
  h1.setAttribute('aria-label',label);$$('.wd',h1).forEach(function(w){w.setAttribute('aria-hidden','true')});
  gsap.from(chars,{yPercent:80,opacity:0,rotation:6,duration:.7,stagger:.012,ease:'power4.out',delay:.42});
  var hl=$('.hl',h1);if(hl){hl.style.setProperty('--hl','0%');gsap.to(hl,{'--hl':'100%',duration:.8,ease:'power3.inOut',delay:1.05})}
  if(fine){var px=-9999,py=-9999,act=false,rects=[];
   function measure(){rects=chars.map(function(c){var r=c.getBoundingClientRect();return [r.left+r.width/2,r.top+r.height/2]})}
   h1.addEventListener('pointerenter',function(){measure();act=true});h1.addEventListener('pointerleave',function(){act=false;gsap.to(chars,{fontWeight:800,fontStretch:'62%',duration:.5,overwrite:true})});
   h1.addEventListener('pointermove',function(e){px=e.clientX;py=e.clientY;if(!act)return;chars.forEach(function(c,i){var d=Math.hypot(rects[i][0]-px,rects[i][1]-py),k=clamp(1-d/170,0,1);c.style.fontStretch=(62+k*30)+'%';c.style.fontWeight=800+k*100})})}
 }
 /* Hero depth: spotlight, wall word, Victor */
 var hero=$('.hero');
 if(hero){var word=$('.hero-word'),hv=$('.hero-v img');
  if(fine)hero.addEventListener('pointermove',function(e){var r=hero.getBoundingClientRect(),x=(e.clientX-r.left)/r.width,y=(e.clientY-r.top)/r.height;hero.style.setProperty('--mx',x*100+'%');hero.style.setProperty('--my',y*100+'%');if(hv)gsap.to(hv,{x:(x-.5)*-22,rotation:(x-.5)*-1.4,duration:.8,overwrite:'auto'})});
  if(word)gsap.fromTo(word,{xPercent:0},{xPercent:-22,ease:'none',scrollTrigger:{trigger:hero,start:'top top',end:'bottom top',scrub:true}});
  if(hv){gsap.from(hv,{y:90,opacity:0,duration:1,ease:'power3.out',delay:.5});gsap.to($('.hero-v'),{y:-70,ease:'none',scrollTrigger:{trigger:hero,start:'top top',end:'bottom top',scrub:true}})}
  gsap.to($('.hero-copy'),{y:60,ease:'none',scrollTrigger:{trigger:hero,start:'top top',end:'bottom top',scrub:true}});
 }
 /* Tape tickers: speed follows the scroll */
 var ticks=$$('.tick span').map(function(s,i){var w=s.scrollWidth/2,x=i?-w*.4:0;return {s:s,w:w,x:x,d:i?1:-1}});
 if(ticks.length)gsap.ticker.add(function(){ticks.forEach(function(t){t.x+=t.d*(1.1+Math.abs(vel)*.14);if(t.x<=-t.w)t.x+=t.w;if(t.x>0)t.x-=t.w;t.s.style.transform='translate3d('+t.x.toFixed(1)+'px,0,0)'})});

 /* Words ink in as you scroll */
 $$('.ink-t').forEach(function(p){var words=[];(function walk(n){[].slice.call(n.childNodes).forEach(function(c){if(c.nodeType===3){var f=document.createDocumentFragment();c.textContent.split(/(\s+)/).forEach(function(w){if(!w)return;if(/^\s+$/.test(w)){f.appendChild(document.createTextNode(' '));return}var s=document.createElement('span');s.className='wrd';s.textContent=w;f.appendChild(s);words.push(s)});n.replaceChild(f,c)}else walk(c)})})(p);
  gsap.set(words,{color:'#a9adb2'});var ink=getComputedStyle(p).color;ScrollTrigger.create({trigger:p,start:'top 82%',end:'bottom 52%',scrub:true,onUpdate:function(st){var a=st.progress*words.length*1.05;words.forEach(function(w,i){w.style.color=i<a?'':'#a9adb2'})}})});

 /* Generic rise-in */
 $$('[data-r]').forEach(function(el){gsap.from(el,{y:46,opacity:0,rotation:el.getAttribute('data-r')||0,duration:.9,ease:'power3.out',scrollTrigger:{trigger:el,start:'top 88%',once:true}})});

 /* Routes: torn seam follows the pointer */
 var routes=$('.routes');
 if(routes&&big){var pa=$('.rp.a',routes),se=$('.seam',routes),r2=rnd(5521),noise=[];for(var ni=0;ni<=46;ni++)noise.push((r2()-.5)*1.5+(ni%6===0?(r2()-.5)*2:0));
  var tgt=50,cur=50,tilt=4;
  function seam(off){var p=[];for(var i=0;i<=46;i++){var y=i/46;p.push((cur+off+tilt*(y-.5)+noise[i]).toFixed(2)+'% '+(y*100).toFixed(1)+'%')}return p}
  function draw(){var a=seam(0),b=seam(-.55);pa.style.clipPath='polygon('+a.join(',')+',100% 100%,100% 0)';se.style.clipPath='polygon('+b.join(',')+',100% 100%,100% 0)'}
  draw();if(fine)routes.addEventListener('pointermove',function(e){var r=routes.getBoundingClientRect();tgt=40+((e.clientX-r.left)/r.width)*20});
  routes.addEventListener('pointerleave',function(){tgt=50});
  ScrollTrigger.create({trigger:routes,start:'top bottom',end:'bottom top',scrub:true,onUpdate:function(s){tilt=-8+s.progress*16;}});
  gsap.ticker.add(function(){var d=tgt-cur;if(Math.abs(d)>.01||tilt){cur+=d*.09;draw()}});
  $$('.im',routes).forEach(function(im,i){gsap.fromTo(im,{yPercent:-4},{yPercent:4,ease:'none',scrollTrigger:{trigger:routes,start:'top bottom',end:'bottom top',scrub:true}})});
 }

 /* Tangle: the scribble unravels into one straight line, and the three questions land on it */
 var tg=$('#tangleC');
 if(tg){var ctx=tg.getContext('2d'),tn=$('.tangle'),pin=$('.pin',tn),qs=$$('.tq',tn),tv=$('.t-v',tn),N=big?760:560,pts=[],W=0,H=0,dpr=Math.min(devicePixelRatio||1,2),P=0,dirty=true,inView=false;
  function build(){var r=tg.getBoundingClientRect();W=r.width;H=r.height;tg.width=W*dpr;tg.height=H*dpr;
   var rr=rnd(77),cx=big?W*.34:W*.5,cy=big?H*.66:H*.6,R=big?Math.min(W*.15,H*.2):Math.min(W*.36,H*.15);pts=[];var qt=$('.t-qs',tn).getBoundingClientRect(),line=big?(qt.top-tn.getBoundingClientRect().top>0?qt.top-tg.getBoundingClientRect().top:H*.66)-22:0;
   if(big)line=H*.8;
   /* a real scribble: overlapping loops around wandering centers, never a filled block */
   var i=0,lc=cx,lcy=cy,a=rr()*6.28,lr=R*.6,left=0,lsp=.3;
   for(i=0;i<N;i++){if(left<=0){lc=cx+(rr()-.5)*R*1.15;lcy=cy+(rr()-.5)*R*.95;lr=R*(.28+rr()*.72);left=26+rr()*44;lsp=(.16+rr()*.2)*(rr()>.3?1:-1)}left--;a+=lsp;
    var tx=lc+Math.cos(a)*lr,ty=lcy+Math.sin(a*1.03)*lr*.86,u=i/(N-1);
    var lx,ly;if(big){lx=-30+u*(W+60);ly=line+Math.sin(u*9)*5}else{lx=22+Math.sin(u*16)*3;ly=H*.42+u*(H*.6)}
    pts.push([tx,ty,lx,ly,u])}
   dirty=true}
  function ease(t){return t<.5?4*t*t*t:1-Math.pow(-2*t+2,3)/2}
  function paint(ts){ctx.setTransform(dpr,0,0,dpr,0,0);ctx.clearRect(0,0,W,H);
   var p=clamp(P/.72,0,1),time=(ts||0)/1000,wob=(1-p)*1.6;ctx.beginPath();var prev=null;
   for(var i=0;i<N;i+=1){var q=pts[i],d=Math.abs(q[4]-.5)*2,lt=ease(clamp(p*1.5-(1-d)*.5,0,1)),x=q[0]+(q[2]-q[0])*lt+Math.sin(time*1.6+i*.21)*wob,y=q[1]+(q[3]-q[1])*lt+Math.cos(time*1.3+i*.17)*wob;
    if(!prev)ctx.moveTo(x,y);else ctx.quadraticCurveTo(prev[0],prev[1],(prev[0]+x)/2,(prev[1]+y)/2);prev=[x,y]}
   ctx.lineCap='round';ctx.lineJoin='round';ctx.strokeStyle='#f2b21b';ctx.lineWidth=big?3.2:2.6;ctx.shadowColor='rgba(242,178,27,.35)';ctx.shadowBlur=10;ctx.stroke();ctx.shadowBlur=0}
  build();addEventListener('resize',function(){build();ScrollTrigger.refresh()});
  ScrollTrigger.create({trigger:pin,start:'top top',end:'bottom bottom',scrub:true,onUpdate:function(s){P=s.progress;dirty=true;qs.forEach(function(q,i){q.classList.toggle('on',P>.44+i*.13)});if(tv)tv.style.transform='translate3d(0,'+(-P*26).toFixed(1)+'px,0) rotate('+(2.4-P*4).toFixed(2)+'deg)'},onToggle:function(s){inView=s.isActive}});
  new IntersectionObserver(function(e){inView=e[0].isIntersecting}).observe(tg);
  gsap.ticker.add(function(t){if(inView)paint(t*1000)});paint(0);
 }

 /* Meet: outlined words slide, and a 3D dot portrait of Victor resolves into his real photo */
 $$('.m-words div').forEach(function(d,i){gsap.fromTo(d,{xPercent:i?-30:0},{xPercent:i?0:-30,ease:'none',scrollTrigger:{trigger:'.meet',start:'top bottom',end:'bottom top',scrub:true}})});
 var mf=$('.m-fig');
 if(mf&&big&&window.THREE){(function(){
  var canvas=document.createElement('canvas'),gl=null;try{gl=new THREE.WebGLRenderer({canvas:canvas,alpha:true,antialias:false})}catch(e){return}
  var img=new Image();img.onload=function(){
   var c=document.createElement('canvas');c.width=img.width;c.height=img.height;var g=c.getContext('2d',{willReadFrequently:true});g.drawImage(img,0,0);var d=g.getImageData(0,0,img.width,img.height).data;
   var pos=[],rnd3=[],sz=[],stp=2,w=img.width,h=img.height,r3=rnd(4242);
   for(var y=0;y<h;y+=stp)for(var x=0;x<w;x+=stp){var o=(y*w+x)*4,al=d[o+3],lum=d[o]/255;if(al<200||lum>.86)continue;var dk=1-lum;
    pos.push(x-w/2,h/2-y,dk*-26);rnd3.push((r3()-.5)*900,(r3()-.5)*900,(r3()-.5)*700);sz.push(.5+dk*2.1)}
   var geo=new THREE.BufferGeometry();geo.setAttribute('position',new THREE.Float32BufferAttribute(pos,3));geo.setAttribute('aRnd',new THREE.Float32BufferAttribute(rnd3,3));geo.setAttribute('aSize',new THREE.Float32BufferAttribute(sz,1));
   var uni={uP:{value:0},uT:{value:0},uS:{value:1},uA:{value:1}};
   var mat=new THREE.ShaderMaterial({transparent:true,depthWrite:false,uniforms:uni,
    vertexShader:'attribute vec3 aRnd;attribute float aSize;uniform float uP,uT,uS;varying float vK;void main(){float e=smoothstep(0.,1.,uP);vec3 p=mix(position+aRnd,position,e);p.xy+=sin(uT*.8+position.yx*.03)*(1.-e)*16.;vec4 mv=modelViewMatrix*vec4(p,1.);gl_Position=projectionMatrix*mv;gl_PointSize=aSize*uS;vK=aSize;}',
    fragmentShader:'uniform float uA;varying float vK;void main(){vec2 d=gl_PointCoord-.5;if(dot(d,d)>.25)discard;gl_FragColor=vec4(.05,.055,.065,uA*(.55+.45*min(vK/2.,1.)));}'});
   var pts3=new THREE.Points(geo,mat),scene=new THREE.Scene(),cam=new THREE.PerspectiveCamera(30,1,1,4000);scene.add(pts3);
   mf.appendChild(canvas);mf.classList.add('gl');
   function size(){var r=mf.getBoundingClientRect();gl.setPixelRatio(Math.min(devicePixelRatio,1.5));gl.setSize(r.width,r.height,false);cam.aspect=r.width/r.height;cam.updateProjectionMatrix();
    var ia=w/h,visH=cam.aspect<ia?h*ia/cam.aspect:h;cam.position.z=visH/2/Math.tan(cam.fov*Math.PI/360);pts3.position.y=-(visH-h)/2;uni.uS.value=(r.height/visH)*Math.min(devicePixelRatio,1.5)*1.25}
   size();addEventListener('resize',size);
   var mx=0,my=0,cx=0,cy=0,prog=0,vis=false,photo=$('img',mf);
   if(fine)$('.meet').addEventListener('pointermove',function(e){mx=e.clientX/innerWidth-.5;my=e.clientY/innerHeight-.5});
   ScrollTrigger.create({trigger:'.meet .pin',start:'top 70%',end:'bottom bottom',scrub:true,onUpdate:function(s){prog=s.progress;var a=clamp((prog-.72)/.2,0,1);photo.style.opacity=a;uni.uA.value=1-a*.92;canvas.style.opacity=a>=.99?0:1}});
   new IntersectionObserver(function(e){vis=e[0].isIntersecting},{rootMargin:'120px'}).observe(mf);
   gsap.ticker.add(function(t){if(!vis)return;uni.uT.value=t;uni.uP.value=clamp(prog/.62,0,1);var free=1-clamp((prog-.62)/.2,0,1);cx+=(mx-cx)*.06;cy+=(my-cy)*.06;pts3.rotation.y=cx*.9*free;pts3.rotation.x=cy*.5*free;gl.render(scene,cam)});
  };img.src=mf.getAttribute('data-sample');
 })()}

 /* Water: real ripples on the still photo */
 $$('.water').forEach(function(cv){if(!window.THREE)return;var gl=null;try{gl=new THREE.WebGLRenderer({canvas:cv,antialias:false})}catch(e){cv.remove();return}
  var host=cv.parentNode,tex=new THREE.TextureLoader().load(cv.getAttribute('data-img'),function(t){uni.uI.value=t.image.width/t.image.height;ready()});tex.minFilter=THREE.LinearFilter;
  var rip=[];for(var i=0;i<6;i++)rip.push(new THREE.Vector3(0,0,-99));
  var uni={uTex:{value:tex},uT:{value:0},uR:{value:rip},uA:{value:1},uI:{value:1.33},uH:{value:parseFloat(cv.getAttribute('data-horizon')||'.42')}};
  var mat=new THREE.ShaderMaterial({uniforms:uni,vertexShader:'varying vec2 vU;void main(){vU=uv;gl_Position=vec4(position.xy,0.,1.);}',
   fragmentShader:'precision mediump float;varying vec2 vU;uniform sampler2D uTex;uniform float uT,uA,uI,uH;uniform vec3 uR[6];void main(){vec2 u=vU;vec2 s=vec2(uA,1.);vec2 d=vec2(0.);float light=0.;for(int i=0;i<6;i++){float age=uT-uR[i].z;if(age<0.||age>6.)continue;vec2 q=(u-uR[i].xy)*s;q.y*=1.8;float l=length(q);float w=sin(l*72.-age*7.)*exp(-l*5.)*exp(-age*.75)*smoothstep(age*.22+.04,age*.22-.02,l-.02);d+=normalize(q+.0001)*w*.018;light+=w*.16;}float below=smoothstep(uH+.02,uH-.06,1.-u.y);below=smoothstep(1.-uH+.02,1.-uH-.04,u.y);float sw=sin(u.y*190.+uT*1.1+sin(u.x*9.+uT*.5)*2.)*.0011*below;d*=mix(.25,1.,below);vec2 c=u+d+vec2(sw,0.);vec2 f=c-.5;if(uA>uI)f.y*=uI/uA;else f.x*=uA/uI;c=f+.5;vec3 col=texture2D(uTex,c).rgb;float g=dot(col,vec3(.3,.59,.11));col=mix(vec3(g),col,.45);gl_FragColor=vec4(col+light*below,1.);}'});
  var scene=new THREE.Scene(),cam=new THREE.Camera();scene.add(new THREE.Mesh(new THREE.PlaneGeometry(2,2),mat));
  function size(){var r=host.getBoundingClientRect();gl.setPixelRatio(Math.min(devicePixelRatio,big?1.25:1));gl.setSize(r.width,r.height,false);uni.uA.value=r.width/r.height}
  size();addEventListener('resize',size);var idx=0,vis=false,lastAuto=0,lastP=0,rx=parseFloat(cv.getAttribute('data-drop')||'.62');
  function drop(x,y,t){rip[idx].set(x,y,t);idx=(idx+1)%6}
  function ready(){}
  if(fine)host.addEventListener('pointermove',function(e){var now=uni.uT.value;if(now-lastP<.28)return;lastP=now;var r=host.getBoundingClientRect();drop((e.clientX-r.left)/r.width,1-(e.clientY-r.top)/r.height,now)});
  host.addEventListener('pointerdown',function(e){var r=host.getBoundingClientRect();drop((e.clientX-r.left)/r.width,1-(e.clientY-r.top)/r.height,uni.uT.value)});
  new IntersectionObserver(function(e){vis=e[0].isIntersecting}).observe(host);
  gsap.ticker.add(function(t){if(!vis)return;uni.uT.value=t;if(t-lastAuto>3.5){lastAuto=t;drop(rx+Math.sin(t)*.14,.22+Math.cos(t*.7)*.08,t)}gl.render(scene,cam)});
 });

 /* Steps: sideways along the wall, with a marker line that draws itself */
 var stp=$('.steps');
 if(stp&&big){var tr=$('.track',stp),sl=$('#stepLine'),pth=sl?$('path',sl):null;
  function setL(){var w=tr.scrollWidth;if(sl){sl.setAttribute('width',w);sl.style.width=w+'px';var h=tr.offsetHeight,y=h*.5,d='M0 '+y;for(var x=0;x<w;x+=260){d+=' C '+(x+80)+' '+(y-70+((x/260)%2)*140)+', '+(x+180)+' '+(y+70-((x/260)%2)*140)+', '+(x+260)+' '+y}pth.setAttribute('d',d);var L=pth.getTotalLength();pth.style.strokeDasharray=L;pth.dataset.l=L}}
  setL();addEventListener('resize',setL);
  ScrollTrigger.create({trigger:$('.pin',stp),start:'top top',end:'bottom bottom',scrub:.4,onUpdate:function(s){var mv=tr.scrollWidth-innerWidth;tr.style.transform='translate3d('+(-mv*s.progress).toFixed(1)+'px,0,0)';if(pth)pth.style.strokeDashoffset=pth.dataset.l*(1-s.progress*1.05)}});
 }

 /* Final: headline stretches open, seal turns in real 3D, Victor rises */
 var fin=$('.final');
 if(fin){var fh=$('h2',fin);if(fh&&big)ScrollTrigger.create({trigger:fin,start:'top 90%',end:'top 20%',scrub:true,onUpdate:function(s){fh.style.fontStretch=(62+s.progress*5)+'%'}});
  var fv=$('.f-v img',fin);if(fv)gsap.from(fv,{yPercent:18,ease:'none',scrollTrigger:{trigger:fin,start:'top bottom',end:'bottom bottom',scrub:true}});
  var sp=$('.seal .sp',fin);if(sp){var src=sp.getAttribute('data-src');for(var si=0;si<16;si++){var im=new Image();im.src=src;im.alt='';im.style.transform='translateZ('+(si-8)*1.3+'px)';im.style.filter=si===15?'none':'brightness(.42) sepia(1) saturate(4) hue-rotate(5deg)';sp.appendChild(im)}gsap.fromTo(sp,{rotationY:-38,rotationX:6},{rotationY:38,rotationX:-6,duration:3.6,repeat:-1,yoyo:true,ease:'sine.inOut'})}
 }

 /* Magnetic Apply + cursor ring */
 if(fine){$$('.btn').forEach(function(b){if(b.closest('.mbar'))return;b.addEventListener('pointermove',function(e){var r=b.getBoundingClientRect();gsap.to(b,{x:(e.clientX-r.left-r.width/2)*.16,y:(e.clientY-r.top-r.height/2)*.28,duration:.3})});b.addEventListener('pointerleave',function(){gsap.to(b,{x:0,y:0,duration:.6,ease:'elastic.out(1,.4)'})})});
  var ring=$('.cur');if(ring){ring.style.display='block';var qx=gsap.quickTo(ring,'x',{duration:.25}),qy=gsap.quickTo(ring,'y',{duration:.25});addEventListener('pointermove',function(e){ring.style.opacity=1;qx(e.clientX);qy(e.clientY)});document.addEventListener('pointerover',function(e){ring.classList.toggle('big',!!(e.target.closest&&e.target.closest('a,button')))})}}

 addEventListener('load',function(){ScrollTrigger.refresh()});
})();
