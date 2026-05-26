import{e as n,h as a,j as s}from"./index-UQC7nCWP.js";import{B as m}from"./button-C10Gx8cS.js";/**
 * @license lucide-react v0.575.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const h=[["path",{d:"M20.985 12.486a9 9 0 1 1-9.473-9.472c.405-.022.617.46.402.803a6 6 0 0 0 8.268 8.268c.344-.215.825-.004.803.401",key:"kfwtm"}]],l=n("moon",h);/**
 * @license lucide-react v0.575.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const r=[["circle",{cx:"12",cy:"12",r:"4",key:"4exip2"}],["path",{d:"M12 2v2",key:"tus03m"}],["path",{d:"M12 20v2",key:"1lh1kg"}],["path",{d:"m4.93 4.93 1.41 1.41",key:"149t6j"}],["path",{d:"m17.66 17.66 1.41 1.41",key:"ptbguv"}],["path",{d:"M2 12h2",key:"1t8f8n"}],["path",{d:"M20 12h2",key:"1q8mjw"}],["path",{d:"m6.34 17.66-1.41 1.41",key:"1m8zz5"}],["path",{d:"m19.07 4.93-1.41 1.41",key:"1shlcs"}]],d=n("sun",r),c="bh_theme";function g(){const[t,o]=a.useState("light");return a.useEffect(()=>{const e=localStorage.getItem(c)??"light";o(e),document.documentElement.classList.toggle("dark",e==="dark")},[]),{theme:t,toggle:()=>{const e=t==="dark"?"light":"dark";o(e),localStorage.setItem(c,e),document.documentElement.classList.toggle("dark",e==="dark")}}}function p(){const{theme:t,toggle:o}=g();return s.jsx(m,{variant:"ghost",size:"icon",onClick:o,"aria-label":"Toggle theme",children:t==="dark"?s.jsx(d,{className:"h-5 w-5"}):s.jsx(l,{className:"h-5 w-5"})})}export{p as T};
