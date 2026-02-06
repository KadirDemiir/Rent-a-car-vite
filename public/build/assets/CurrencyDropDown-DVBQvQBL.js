import{r as i,u as B,i as O,l as L}from"./vendor-inertia-B45ElSyl.js";import{j as s,u as R}from"./app-B7Z6uk3I.js";import{u as S}from"./vendor-i18n-Chr7C2QM.js";/**
 * @license lucide-react v0.513.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const H=t=>t.replace(/([a-z0-9])([A-Z])/g,"$1-$2").toLowerCase(),P=t=>t.replace(/^([A-Z])|[\s-_]+(\w)/g,(e,n,r)=>r?r.toUpperCase():n.toLowerCase()),M=t=>{const e=P(t);return e.charAt(0).toUpperCase()+e.slice(1)},E=(...t)=>t.filter((e,n,r)=>!!e&&e.trim()!==""&&r.indexOf(e)===n).join(" ").trim(),T=t=>{for(const e in t)if(e.startsWith("aria-")||e==="role"||e==="title")return!0};/**
 * @license lucide-react v0.513.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */var W={xmlns:"http://www.w3.org/2000/svg",width:24,height:24,viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:2,strokeLinecap:"round",strokeLinejoin:"round"};/**
 * @license lucide-react v0.513.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const D=i.forwardRef(({color:t="currentColor",size:e=24,strokeWidth:n=2,absoluteStrokeWidth:r,className:c="",children:l,iconNode:a,...d},w)=>i.createElement("svg",{ref:w,...W,width:e,height:e,stroke:t,strokeWidth:r?Number(n)*24/Number(e):n,className:E("lucide",c),...!l&&!T(d)&&{"aria-hidden":"true"},...d},[...a.map(([h,x])=>i.createElement(h,x)),...Array.isArray(l)?l:[l]]));/**
 * @license lucide-react v0.513.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const f=(t,e)=>{const n=i.forwardRef(({className:r,...c},l)=>i.createElement(D,{ref:l,iconNode:e,className:E(`lucide-${H(M(t))}`,`lucide-${t}`,r),...c}));return n.displayName=M(t),n};/**
 * @license lucide-react v0.513.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const q=[["path",{d:"m21 8-2 2-1.5-3.7A2 2 0 0 0 15.646 5H8.4a2 2 0 0 0-1.903 1.257L5 10 3 8",key:"1imjwt"}],["path",{d:"M7 14h.01",key:"1qa3f1"}],["path",{d:"M17 14h.01",key:"7oqj8z"}],["rect",{width:"18",height:"8",x:"3",y:"10",rx:"2",key:"a7itu8"}],["path",{d:"M5 18v2",key:"ppbyun"}],["path",{d:"M19 18v2",key:"gy7782"}]],G=f("car-front",q);/**
 * @license lucide-react v0.513.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const z=[["path",{d:"m16 17 5-5-5-5",key:"1bji2h"}],["path",{d:"M21 12H9",key:"dn1m92"}],["path",{d:"M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4",key:"1uf3rs"}]],J=f("log-out",z);/**
 * @license lucide-react v0.513.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const I=[["path",{d:"M4 12h16",key:"1lakjw"}],["path",{d:"M4 18h16",key:"19g7jn"}],["path",{d:"M4 6h16",key:"1o0s65"}]],Q=f("menu",I);/**
 * @license lucide-react v0.513.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Z=[["path",{d:"M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2",key:"975kel"}],["circle",{cx:"12",cy:"7",r:"4",key:"17ys0d"}]],Y=f("user",Z);/**
 * @license lucide-react v0.513.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const F=[["path",{d:"M18 6 6 18",key:"1bl5f8"}],["path",{d:"m6 6 12 12",key:"d8bk6v"}]],ee=f("x",F),$={en:{name:"English",flag:""},tr:{name:"Türkçe",flag:""}};function te(){var j;const{i18n:t}=S(),{languages:e,locale:n}=B().props,r=i.useRef(null),[c,l]=i.useState(!1),[a,d]=i.useState(!1),w=i.useMemo(()=>(e==null?void 0:e.map(o=>o.code).filter(o=>o!=="cimode"))||["tr"],[e]);i.useEffect(()=>{n&&t.language.split("-")[0]!==n&&t.changeLanguage(n)},[n,t]),i.useEffect(()=>{const o=u=>r.current&&!r.current.contains(u.target)&&l(!1);return document.addEventListener("mousedown",o),()=>document.removeEventListener("mousedown",o)},[]);const h=t.language.split("-")[0],x=async o=>{var u,k;if(!(h===o||a)){d(!0);try{const v=t.language.split("-")[0],p=window.location.pathname.split("/").filter(Boolean);let m=(u=t.store.data[o])==null?void 0:u.translation;(!m||Object.keys(m).length===0)&&(m=(await O.get(`/locales/${o}/translation.json`)).data,t.addResourceBundle(o,"translation",m,!0,!0)),await t.changeLanguage(o);let y="/"+o;const C=((k=t.store.data[v])==null?void 0:k.translation)||{};for(let g=1;g<p.length;g++){const N=p[g],b=Object.keys(C).find(U=>C[U]===N);b&&m[b]?y+="/"+m[b]:y+="/"+N}const _=window.location.search,A=window.location.hash;L.visit(y+_+A)}catch{const p=window.location.pathname.split("/").filter(Boolean);p[0]=o,L.visit("/"+p.join("/")+window.location.search+window.location.hash)}finally{d(!1)}}};return s.jsxs("div",{ref:r,className:"w-28 relative flex items-center justify-center",children:[s.jsxs("button",{type:"button",onClick:()=>!a&&l(!c),className:`w-full px-2 py-1.5 border border-gray-400/60 bg-gray-500 text-white rounded-xl flex items-center justify-center gap-2 ${a?"opacity-70 cursor-wait":""}`,children:[a?s.jsx("div",{className:"h-5 w-5 border-2 border-white border-t-transparent rounded-full animate-spin"}):s.jsx("img",{src:(j=$[h])==null?void 0:j.flag,alt:"",className:"h-5 w-5 rounded-full"}),s.jsx("span",{className:"text-sm font-semibold",children:h.toUpperCase()}),s.jsx("div",{className:"h-5 w-5",children:s.jsx("svg",{xmlns:"http://www.w3.org/2000/svg",width:"100%",height:"100%",viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:"2",strokeLinecap:"round",strokeLinejoin:"round",className:`h-5 w-5 ${c?"rotate-180":""} transition-transform`,children:s.jsx("path",{d:"M6 9l6 6 6-6"})})})]}),c&&!a&&s.jsx("ul",{className:"absolute top-full mt-2 bg-white border border-gray-200 rounded-lg shadow-lg w-full z-40 text-center overflow-hidden",children:w.map(o=>{var u;return s.jsx("li",{children:s.jsxs("button",{onClick:()=>{l(!1),x(o)},className:`flex items-center justify-between w-full px-3 py-2 text-sm ${h===o?"bg-gray-700 text-white":"text-gray-700 hover:bg-gray-50"}`,children:[s.jsx("img",{src:(u=$[o])==null?void 0:u.flag,alt:"",className:"h-5 w-5 rounded-full"}),o.toUpperCase()]})},o)})})]})}function se(){const{currencies:t,current:e,changeCurrency:n}=R(),[r,c]=i.useState(!1),l=i.useRef(null);return i.useEffect(()=>{const a=d=>{l.current&&!l.current.contains(d.target)&&c(!1)};return document.addEventListener("mousedown",a),()=>document.removeEventListener("mousedown",a)},[]),s.jsxs("div",{ref:l,className:"w-32 relative flex flex-col items-center",children:[s.jsxs("button",{type:"button",onClick:()=>c(!r),className:"w-full px-2 py-1.5 border border-gray-400/60 bg-gray-500 text-white rounded-xl flex items-center justify-between",children:[s.jsxs("span",{className:"flex items-center gap-1 text-sm font-semibold",children:[e==null?void 0:e.symbol," ",e==null?void 0:e.code]}),s.jsx("svg",{xmlns:"http://www.w3.org/2000/svg",className:`h-5 w-5 transition-transform ${r?"rotate-180":""}`,fill:"none",viewBox:"0 0 24 24",stroke:"currentColor",children:s.jsx("path",{strokeLinecap:"round",strokeLinejoin:"round",strokeWidth:2,d:"M6 9l6 6 6-6"})})]}),r&&s.jsx("ul",{className:"absolute top-full mt-2 bg-white border border-gray-200 rounded-lg shadow-lg w-full z-40 text-center max-h-60 overflow-auto",children:t.map(a=>s.jsxs("li",{className:`flex items-center justify-center gap-2 px-3 py-2 text-sm cursor-pointer ${e.code===a.code?"bg-gray-700 text-white":"text-gray-700 hover:bg-gray-50"}`,onClick:()=>{n(a),c(!1)},children:[s.jsx("span",{className:"font-semibold",children:a.symbol}),s.jsx("span",{className:"font-semibold",children:a.name}),s.jsx("span",{className:"font-medium",children:a.code.toUpperCase()})]},a.id))})]})}export{G as C,J as L,Q as M,Y as U,ee as X,te as a,se as b,f as c};
