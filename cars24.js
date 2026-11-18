
(function(){
var rm=matchMedia('(prefers-reduced-motion:reduce)').matches,els=[].slice.call(document.querySelectorAll('.reveal'));
function all(){els.forEach(function(e){e.classList.add('in')})}
if('IntersectionObserver' in window&&!rm){var io=new IntersectionObserver(function(es){es.forEach(function(e){if(e.isIntersecting){e.target.classList.add('in');io.unobserve(e.target)}})},{threshold:.1});els.forEach(function(e){io.observe(e)});setTimeout(all,2500)}else all();
var names={hatch:'Compact hatchback',suv:'Compact SUV',cng:'Sedan with CNG'},done={},right=0;
[].forEach.call(document.querySelectorAll('.buyer'),function(b){var res=b.querySelector('.res');
 [].forEach.call(b.querySelectorAll('.opt'),function(o){o.addEventListener('click',function(){
  var ok=o.dataset.c===b.dataset.best;[].forEach.call(b.querySelectorAll('.opt'),function(x){x.classList.remove('good','bad')});
  o.classList.add(ok?'good':'bad');
  res.innerHTML=ok?'<b>Good fit.</b> The first thing I would still ask: '+b.dataset.ask:'<b>Not quite.</b> Try another. A match matters less than the question underneath: '+b.dataset.ask;
  done[b.dataset.id]=ok;right=Object.keys(done).filter(function(k){return done[k]}).length;
  var s=document.getElementById('score');s.textContent=right+' of 3 matched'+(right===3?'. Now ask each of them the question first, then pick the car.':'');
 })})});
})();
