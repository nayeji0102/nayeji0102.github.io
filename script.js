/* GSAP ScrollTrigger: 페이지가 내려가지 않고 한 화면에서 계절만 변합니다. */
(()=>{
const clamp=(v,a=0,b=1)=>Math.max(a,Math.min(b,v));
const ease=t=>t*t*(3-2*t);
const seas=[...document.querySelectorAll('.sea')],fish=document.querySelector('#fishArrival'),desc=document.querySelector('#description'),traveler=document.querySelector('#silhouette'),mercury=document.querySelector('#mercury');
const reduced=matchMedia('(prefers-reduced-motion: reduce)').matches;
// 이미지의 계절표 실제 원 중심 좌표(2048x1152). 봄→여름→가을→겨울.
const spots=[{x:1728,y:174},{x:1175,y:129},{x:644,y:182},{x:165,y:123}];
// 실루엣 원본 PNG 크기 162×56, 기준 중심 좌표로 위치 정렬.
// 원본 일러스트에 수온 관측값이 없으므로 수은 높이는 시각적 예시 값.
const levels=[.40,.95,.60,.18];
// 스크롤 거리를 늘리고 전환 구간도 넓혀 한 번의 휠 동작에 계절이 여러 개 지나가지 않도록 조정.
const transitionStart=.30;
function render(p){
 const arrival=ease(clamp(p/.22));
 fish.style.transform=`translate(calc(-50% + ${(1-arrival)*115}vw),-50%)`;
 desc.style.transform=`translateX(${(1-arrival)*105}vw)`;
 desc.style.opacity=clamp((arrival-.10)/.8);
 const t=clamp((p-.22)/.78);
 const phase=Math.min(2.999999,t*3),seg=Math.floor(phase),within=phase-seg;
 const move=ease(within);
 const x=spots[seg].x+(spots[seg+1].x-spots[seg].x)*move;
 // 계절표 PNG의 곡선 형태를 따라가는 y는 원본 경로에 맞춘 보간
 const y0=spots[seg].y,y1=spots[seg+1].y;
 const y=y0+(y1-y0)*move + (seg===0?-14:seg===1?8:-15)*Math.sin(Math.PI*move);
 // 위 transform의 %는 자신의 크기를 기준으로 하므로 직접 px 대신 CSS 좌표 사용
 traveler.style.left=`${(x-81)/2048*100}%`;
 traveler.style.top=`${(y-28)/1152*100}%`;
 traveler.style.transform='none';
 traveler.style.opacity=p>=.22?'1':'0';
 const fade=ease(clamp((within-transitionStart)/(1-transitionStart)));
 seas.forEach((im,i)=>{im.style.opacity=i===seg?String(1-fade):i===seg+1?String(fade):'0';});
 const level=levels[seg]+(levels[seg+1]-levels[seg])*fade;
 // 원본 PNG에서 추출한 파란 잉크만 아래에서 위로 노출 (0~25°C 눈금 영역).
 // 파란 원본 PNG에서 수직 기둥(원본 y=534~1044)만 높이를 조절합니다.
 // 계절마다 바뀌는 영역은 원본 이미지의 파란 선이며, 원형 구근은 별도 고정됩니다.
 const inkBottom=90.7, inkTop=46.35;
 const top=inkBottom-(inkBottom-inkTop)*level;
 mercury.style.clipPath=`inset(${top}% 0 ${100-inkBottom}% 0)`;
 mercury.style.opacity='1';
}
// 브라우저 기본 스크롤 이벤트로 직접 연결: 외부 라이브러리 로딩과 무관하게 작동.
// 스크롤 목표값을 즉시 적용하지 않고 매 프레임 따라가게 하여 모든 요소를 동기화.
let current=0, target=0, running=false, lastTime=0;
const scrollSpace=document.querySelector('.scroll-space');
function readTarget(){
 const total=Math.max(1,scrollSpace.offsetHeight-window.innerHeight);
 target=clamp(-scrollSpace.getBoundingClientRect().top/total);
 if(!running){running=true;requestAnimationFrame(tick);}
}
function tick(time){
 const dt=Math.min(64,Math.max(0,time-(lastTime||time)));
 lastTime=time;
 // 프레임레이트와 관계없는 감쇠. 기존 1000vh 스크롤 속도는 유지.
 const factor=reduced?1:1-Math.exp(-dt/180);
 current+=(target-current)*factor;
 if(Math.abs(target-current)<0.00004)current=target;
 render(current);
 if(current!==target){requestAnimationFrame(tick);}
 else{running=false;lastTime=0;}
}
window.addEventListener('scroll',readTarget,{passive:true});
window.addEventListener('resize',readTarget);
window.addEventListener('load',readTarget);
readTarget();
})();
