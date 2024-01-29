"use strict";class t{constructor(t=0,s=0,i=0,e=0){this.hue=t,this.saturation=s,this.lightness=i,this.alpha=e}static stringify({hue:t,saturation:s,lightness:i,alpha:e}){return`hsla(${t}, ${s}%, ${i}%, ${e})`}static grayscale({lightness:t,alpha:s}){return`hsla(0, 0%, ${t}%, ${s})`}}class s{constructor(s=0,i=0,e=new t){this.x=s,this.y=i,this.hsla=e,this.previous={x:s,y:i}}}const i=1/6,e=t=>0|Math.floor(t),a=new Float64Array([1,1,0,-1,1,0,1,-1,0,-1,-1,0,1,0,1,-1,0,1,1,0,-1,-1,0,-1,0,1,1,0,-1,1,0,1,-1,0,-1,-1]);const n=function(t=Math.random){const s=function(t){const s=512,i=new Uint8Array(s);for(let t=0;t<s/2;t++)i[t]=t;for(let e=0;e<s/2-1;e++){const s=e+~~(t()*(256-e)),a=i[e];i[e]=i[s],i[s]=a}for(let t=256;t<s;t++)i[t]=i[t-256];return i}(t),n=new Float64Array(s).map((t=>a[t%12*3])),h=new Float64Array(s).map((t=>a[t%12*3+1])),o=new Float64Array(s).map((t=>a[t%12*3+2]));return function(t,a,r){let c,l,p,f;const d=.3333333333333333*(t+a+r),u=e(t+d),v=e(a+d),m=e(r+d),x=(u+v+m)*i,g=t-(u-x),y=a-(v-x),w=r-(m-x);let M,b,O,z,P,$;g>=y?y>=w?(M=1,b=0,O=0,z=1,P=1,$=0):g>=w?(M=1,b=0,O=0,z=1,P=0,$=1):(M=0,b=0,O=1,z=1,P=0,$=1):y<w?(M=0,b=0,O=1,z=0,P=1,$=1):g<w?(M=0,b=1,O=0,z=0,P=1,$=1):(M=0,b=1,O=0,z=1,P=1,$=0);const C=g-M+i,A=y-b+i,S=w-O+i,k=g-z+2*i,E=y-P+2*i,F=w-$+2*i,I=g-1+.5,L=y-1+.5,R=w-1+.5,N=255&u,q=255&v,B=255&m;let D=.6-g*g-y*y-w*w;if(D<0)c=0;else{const t=N+s[q+s[B]];D*=D,c=D*D*(n[t]*g+h[t]*y+o[t]*w)}let W=.6-C*C-A*A-S*S;if(W<0)l=0;else{const t=N+M+s[q+b+s[B+O]];W*=W,l=W*W*(n[t]*C+h[t]*A+o[t]*S)}let j=.6-k*k-E*E-F*F;if(j<0)p=0;else{const t=N+z+s[q+P+s[B+$]];j*=j,p=j*j*(n[t]*k+h[t]*E+o[t]*F)}let J=.6-I*I-L*L-R*R;if(J<0)f=0;else{const t=N+1+s[q+1+s[B+1]];J*=J,f=J*J*(n[t]*I+h[t]*L+o[t]*R)}return 32*(c+l+p+f)}}();function h(t,s,i){let e=1,a=1,h=0;for(let o=1;o<4;o++)e*=.5,h+=e*(n(t*a,s*a,i*a)+1)*.5,a*=2;return h}class o{static range(t,s){return Math.floor(Math.random()*(s-t))+t}constructor(i,e={}){if(this.options={colorMode:"hsla",colorIntensityMix:1,colorLightnessMix:1,colorOpacityMix:1,frameRange:[250,500],particleNumber:1e3,base:1e3,step:5,zOffsetStep:.001},this.particles=[],this.zOffset=0,!document.querySelector(i))throw new Error(`#${i} is not found`);switch(this.options=Object.assign(Object.assign({},this.options),e),this.validate("colorIntensityMix",0,1),this.validate("colorLightnessMix",0,1),this.validate("colorOpacityMix",0,1),this.validate("particleNumber",500,1e3),this.validate("base",500,1e3),this.validate("step",5,10),this.validate("zOffsetStep",5e-4,.01),this.options.colorMode){case"hsla":default:this.colorize=t.stringify;break;case"grayscale":this.colorize=t.grayscale}this.canvas=document.querySelector(i),this.canvas.style.display="block",this.canvas.style.width="100%",this.canvas.style.height="100%",this.setCanvasDrawingBuffer(),this.ctx=this.canvas.getContext("2d"),this.ctx.lineWidth=.3,this.ctx.lineJoin="round",this.ctx.lineCap="round",this.frame={midpoint:{x:this.canvas.width/2,y:this.canvas.height/2},count:0,limit:o.range(...this.options.frameRange)};for(let t=0;t<this.options.particleNumber;t++)this.particles[t]=new s,this.setParticleProps(this.particles[t]);this.render(),window.addEventListener("resize",(()=>{this.rerender()})),this.canvas.addEventListener("click",(()=>{this.rerender()}))}validate(t,s,i){if(!(s<=this.options[t]&&this.options[t]<=i))throw new Error(`Error: this.config.${t} value from ${s} to ${i}]`)}setCanvasDrawingBuffer(){const t=this.canvas.clientWidth,s=this.canvas.clientHeight,i=Math.round(t*o.dpr),e=Math.round(s*o.dpr);this.canvas.width===i&&this.canvas.height===e||(this.canvas.width=i,this.canvas.height=e)}setParticleProps(t){t.x=t.previous.x=this.canvas.width*Math.random(),t.y=t.previous.y=this.canvas.height*Math.random();const s=Math.atan2(this.frame.midpoint.y-t.y,this.frame.midpoint.x-t.x);t.hsla.hue=180*s/Math.PI,t.hsla.saturation=100*this.options.colorIntensityMix,t.hsla.lightness=50*this.options.colorLightnessMix,t.hsla.alpha=0}rerender(){this.setCanvasDrawingBuffer(),this.ctx=this.canvas.getContext("2d"),this.ctx.lineWidth=.3,this.ctx.lineJoin="round",this.ctx.lineCap="round",this.frame.midpoint={x:this.canvas.width/2,y:this.canvas.height/2},this.frame.count>this.frame.limit?(this.frame.count=0,this.frame.limit=o.range(...this.options.frameRange),this.render()):(this.frame.count=0,this.frame.limit=o.range(...this.options.frameRange))}render(){if(!(this.frame.count>this.frame.limit)){this.frame.count++;for(let t=0;t<this.options.particleNumber;t++){const s=this.particles[t];s.previous.x=s.x,s.previous.y=s.y;const i=h(s.x/this.options.base*1.75,s.y/this.options.base*1.75,this.zOffset),e=6*Math.PI*i;s.x+=Math.cos(e)*this.options.step,s.y+=Math.sin(e)*this.options.step,s.hsla.alpha<1&&(s.hsla.alpha+=.003*this.options.colorOpacityMix),this.ctx.beginPath(),this.ctx.strokeStyle=this.colorize(s.hsla),this.ctx.moveTo(s.previous.x,s.previous.y),this.ctx.lineTo(s.x,s.y),this.ctx.stroke(),(s.x<0||s.y<0||s.x>this.canvas.width||s.y>this.canvas.height)&&this.setParticleProps(s)}this.zOffset+=this.options.zOffsetStep,window.requestAnimationFrame(this.render.bind(this))}}get self(){return this}get config(){return this.options}}o.dpr=window.devicePixelRatio||1,new o("#canvas");