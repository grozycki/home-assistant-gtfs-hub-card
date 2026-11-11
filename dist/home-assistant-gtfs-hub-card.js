var N=globalThis,I=N.ShadowRoot&&(N.ShadyCSS===void 0||N.ShadyCSS.nativeShadow)&&"adoptedStyleSheets"in Document.prototype&&"replace"in CSSStyleSheet.prototype,q=Symbol(),ot=new WeakMap,P=class{constructor(t,e,s){if(this._$cssResult$=!0,s!==q)throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");this.cssText=t,this.t=e}get styleSheet(){let t=this.o,e=this.t;if(I&&t===void 0){let s=e!==void 0&&e.length===1;s&&(t=ot.get(e)),t===void 0&&((this.o=t=new CSSStyleSheet).replaceSync(this.cssText),s&&ot.set(e,t))}return t}toString(){return this.cssText}},at=i=>new P(typeof i=="string"?i:i+"",void 0,q),M=(i,...t)=>{let e=i.length===1?i[0]:t.reduce((s,n,r)=>s+(o=>{if(o._$cssResult$===!0)return o.cssText;if(typeof o=="number")return o;throw Error("Value passed to 'css' function must be a 'css' function result: "+o+". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.")})(n)+i[r+1],i[0]);return new P(e,i,q)},ht=(i,t)=>{if(I)i.adoptedStyleSheets=t.map(e=>e instanceof CSSStyleSheet?e:e.styleSheet);else for(let e of t){let s=document.createElement("style"),n=N.litNonce;n!==void 0&&s.setAttribute("nonce",n),s.textContent=e.cssText,i.appendChild(s)}},K=I?i=>i:i=>i instanceof CSSStyleSheet?(t=>{let e="";for(let s of t.cssRules)e+=s.cssText;return at(e)})(i):i;var{is:Lt,defineProperty:Ht,getOwnPropertyDescriptor:Rt,getOwnPropertyNames:Tt,getOwnPropertySymbols:Ot,getPrototypeOf:Dt}=Object,z=globalThis,lt=z.trustedTypes,Ut=lt?lt.emptyScript:"",Nt=z.reactiveElementPolyfillSupport,k=(i,t)=>i,G={toAttribute(i,t){switch(t){case Boolean:i=i?Ut:null;break;case Object:case Array:i=i==null?i:JSON.stringify(i)}return i},fromAttribute(i,t){let e=i;switch(t){case Boolean:e=i!==null;break;case Number:e=i===null?null:Number(i);break;case Object:case Array:try{e=JSON.parse(i)}catch{e=null}}return e}},dt=(i,t)=>!Lt(i,t),ct={attribute:!0,type:String,converter:G,reflect:!1,useDefault:!1,hasChanged:dt};Symbol.metadata??=Symbol("metadata"),z.litPropertyMetadata??=new WeakMap;var g=class extends HTMLElement{static addInitializer(t){this._$Ei(),(this.l??=[]).push(t)}static get observedAttributes(){return this.finalize(),this._$Eh&&[...this._$Eh.keys()]}static createProperty(t,e=ct){if(e.state&&(e.attribute=!1),this._$Ei(),this.prototype.hasOwnProperty(t)&&((e=Object.create(e)).wrapped=!0),this.elementProperties.set(t,e),!e.noAccessor){let s=Symbol(),n=this.getPropertyDescriptor(t,s,e);n!==void 0&&Ht(this.prototype,t,n)}}static getPropertyDescriptor(t,e,s){let{get:n,set:r}=Rt(this.prototype,t)??{get(){return this[e]},set(o){this[e]=o}};return{get:n,set(o){let h=n?.call(this);r?.call(this,o),this.requestUpdate(t,h,s)},configurable:!0,enumerable:!0}}static getPropertyOptions(t){return this.elementProperties.get(t)??ct}static _$Ei(){if(this.hasOwnProperty(k("elementProperties")))return;let t=Dt(this);t.finalize(),t.l!==void 0&&(this.l=[...t.l]),this.elementProperties=new Map(t.elementProperties)}static finalize(){if(this.hasOwnProperty(k("finalized")))return;if(this.finalized=!0,this._$Ei(),this.hasOwnProperty(k("properties"))){let e=this.properties,s=[...Tt(e),...Ot(e)];for(let n of s)this.createProperty(n,e[n])}let t=this[Symbol.metadata];if(t!==null){let e=litPropertyMetadata.get(t);if(e!==void 0)for(let[s,n]of e)this.elementProperties.set(s,n)}this._$Eh=new Map;for(let[e,s]of this.elementProperties){let n=this._$Eu(e,s);n!==void 0&&this._$Eh.set(n,e)}this.elementStyles=this.finalizeStyles(this.styles)}static finalizeStyles(t){let e=[];if(Array.isArray(t)){let s=new Set(t.flat(1/0).reverse());for(let n of s)e.unshift(K(n))}else t!==void 0&&e.push(K(t));return e}static _$Eu(t,e){let s=e.attribute;return s===!1?void 0:typeof s=="string"?s:typeof t=="string"?t.toLowerCase():void 0}constructor(){super(),this._$Ep=void 0,this.isUpdatePending=!1,this.hasUpdated=!1,this._$Em=null,this._$Ev()}_$Ev(){this._$ES=new Promise(t=>this.enableUpdating=t),this._$AL=new Map,this._$E_(),this.requestUpdate(),this.constructor.l?.forEach(t=>t(this))}addController(t){(this._$EO??=new Set).add(t),this.renderRoot!==void 0&&this.isConnected&&t.hostConnected?.()}removeController(t){this._$EO?.delete(t)}_$E_(){let t=new Map,e=this.constructor.elementProperties;for(let s of e.keys())this.hasOwnProperty(s)&&(t.set(s,this[s]),delete this[s]);t.size>0&&(this._$Ep=t)}createRenderRoot(){let t=this.shadowRoot??this.attachShadow(this.constructor.shadowRootOptions);return ht(t,this.constructor.elementStyles),t}connectedCallback(){this.renderRoot??=this.createRenderRoot(),this.enableUpdating(!0),this._$EO?.forEach(t=>t.hostConnected?.())}enableUpdating(t){}disconnectedCallback(){this._$EO?.forEach(t=>t.hostDisconnected?.())}attributeChangedCallback(t,e,s){this._$AK(t,s)}_$ET(t,e){let s=this.constructor.elementProperties.get(t),n=this.constructor._$Eu(t,s);if(n!==void 0&&s.reflect===!0){let r=(s.converter?.toAttribute!==void 0?s.converter:G).toAttribute(e,s.type);this._$Em=t,r==null?this.removeAttribute(n):this.setAttribute(n,r),this._$Em=null}}_$AK(t,e){let s=this.constructor,n=s._$Eh.get(t);if(n!==void 0&&this._$Em!==n){let r=s.getPropertyOptions(n),o=typeof r.converter=="function"?{fromAttribute:r.converter}:r.converter?.fromAttribute!==void 0?r.converter:G;this._$Em=n;let h=o.fromAttribute(e,r.type);this[n]=h??this._$Ej?.get(n)??h,this._$Em=null}}requestUpdate(t,e,s,n=!1,r){if(t!==void 0){let o=this.constructor;if(n===!1&&(r=this[t]),s??=o.getPropertyOptions(t),!((s.hasChanged??dt)(r,e)||s.useDefault&&s.reflect&&r===this._$Ej?.get(t)&&!this.hasAttribute(o._$Eu(t,s))))return;this.C(t,e,s)}this.isUpdatePending===!1&&(this._$ES=this._$EP())}C(t,e,{useDefault:s,reflect:n,wrapped:r},o){s&&!(this._$Ej??=new Map).has(t)&&(this._$Ej.set(t,o??e??this[t]),r!==!0||o!==void 0)||(this._$AL.has(t)||(this.hasUpdated||s||(e=void 0),this._$AL.set(t,e)),n===!0&&this._$Em!==t&&(this._$Eq??=new Set).add(t))}async _$EP(){this.isUpdatePending=!0;try{await this._$ES}catch(e){Promise.reject(e)}let t=this.scheduleUpdate();return t!=null&&await t,!this.isUpdatePending}scheduleUpdate(){return this.performUpdate()}performUpdate(){if(!this.isUpdatePending)return;if(!this.hasUpdated){if(this.renderRoot??=this.createRenderRoot(),this._$Ep){for(let[n,r]of this._$Ep)this[n]=r;this._$Ep=void 0}let s=this.constructor.elementProperties;if(s.size>0)for(let[n,r]of s){let{wrapped:o}=r,h=this[n];o!==!0||this._$AL.has(n)||h===void 0||this.C(n,void 0,r,h)}}let t=!1,e=this._$AL;try{t=this.shouldUpdate(e),t?(this.willUpdate(e),this._$EO?.forEach(s=>s.hostUpdate?.()),this.update(e)):this._$EM()}catch(s){throw t=!1,this._$EM(),s}t&&this._$AE(e)}willUpdate(t){}_$AE(t){this._$EO?.forEach(e=>e.hostUpdated?.()),this.hasUpdated||(this.hasUpdated=!0,this.firstUpdated(t)),this.updated(t)}_$EM(){this._$AL=new Map,this.isUpdatePending=!1}get updateComplete(){return this.getUpdateComplete()}getUpdateComplete(){return this._$ES}shouldUpdate(t){return!0}update(t){this._$Eq&&=this._$Eq.forEach(e=>this._$ET(e,this[e])),this._$EM()}updated(t){}firstUpdated(t){}};g.elementStyles=[],g.shadowRootOptions={mode:"open"},g[k("elementProperties")]=new Map,g[k("finalized")]=new Map,Nt?.({ReactiveElement:g}),(z.reactiveElementVersions??=[]).push("2.1.2");var et=globalThis,pt=i=>i,j=et.trustedTypes,ut=j?j.createPolicy("lit-html",{createHTML:i=>i}):void 0,$t="$lit$",$=`lit$${Math.random().toFixed(9).slice(2)}$`,vt="?"+$,It=`<${vt}>`,A=document,H=()=>A.createComment(""),R=i=>i===null||typeof i!="object"&&typeof i!="function",st=Array.isArray,zt=i=>st(i)||typeof i?.[Symbol.iterator]=="function",J=`[ 	
\f\r]`,L=/<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g,ft=/-->/g,mt=/>/g,v=RegExp(`>|${J}(?:([^\\s"'>=/]+)(${J}*=${J}*(?:[^ 	
\f\r"'\`<>=]|("|')|))|$)`,"g"),gt=/'/g,_t=/"/g,bt=/^(?:script|style|textarea|title)$/i,it=i=>(t,...e)=>({_$litType$:i,strings:t,values:e}),p=it(1),le=it(2),ce=it(3),C=Symbol.for("lit-noChange"),l=Symbol.for("lit-nothing"),yt=new WeakMap,b=A.createTreeWalker(A,129);function At(i,t){if(!st(i)||!i.hasOwnProperty("raw"))throw Error("invalid template strings array");return ut!==void 0?ut.createHTML(t):t}var jt=(i,t)=>{let e=i.length-1,s=[],n,r=t===2?"<svg>":t===3?"<math>":"",o=L;for(let h=0;h<e;h++){let a=i[h],d,u,c=-1,m=0;for(;m<a.length&&(o.lastIndex=m,u=o.exec(a),u!==null);)m=o.lastIndex,o===L?u[1]==="!--"?o=ft:u[1]!==void 0?o=mt:u[2]!==void 0?(bt.test(u[2])&&(n=RegExp("</"+u[2],"g")),o=v):u[3]!==void 0&&(o=v):o===v?u[0]===">"?(o=n??L,c=-1):u[1]===void 0?c=-2:(c=o.lastIndex-u[2].length,d=u[1],o=u[3]===void 0?v:u[3]==='"'?_t:gt):o===_t||o===gt?o=v:o===ft||o===mt?o=L:(o=v,n=void 0);let y=o===v&&i[h+1].startsWith("/>")?" ":"";r+=o===L?a+It:c>=0?(s.push(d),a.slice(0,c)+$t+a.slice(c)+$+y):a+$+(c===-2?h:y)}return[At(i,r+(i[e]||"<?>")+(t===2?"</svg>":t===3?"</math>":"")),s]},T=class i{constructor({strings:t,_$litType$:e},s){let n;this.parts=[];let r=0,o=0,h=t.length-1,a=this.parts,[d,u]=jt(t,e);if(this.el=i.createElement(d,s),b.currentNode=this.el.content,e===2||e===3){let c=this.el.content.firstChild;c.replaceWith(...c.childNodes)}for(;(n=b.nextNode())!==null&&a.length<h;){if(n.nodeType===1){if(n.hasAttributes())for(let c of n.getAttributeNames())if(c.endsWith($t)){let m=u[o++],y=n.getAttribute(c).split($),U=/([.?@])?(.*)/.exec(m);a.push({type:1,index:r,name:U[2],strings:y,ctor:U[1]==="."?Z:U[1]==="?"?Q:U[1]==="@"?Y:x}),n.removeAttribute(c)}else c.startsWith($)&&(a.push({type:6,index:r}),n.removeAttribute(c));if(bt.test(n.tagName)){let c=n.textContent.split($),m=c.length-1;if(m>0){n.textContent=j?j.emptyScript:"";for(let y=0;y<m;y++)n.append(c[y],H()),b.nextNode(),a.push({type:2,index:++r});n.append(c[m],H())}}}else if(n.nodeType===8)if(n.data===vt)a.push({type:2,index:r});else{let c=-1;for(;(c=n.data.indexOf($,c+1))!==-1;)a.push({type:7,index:r}),c+=$.length-1}r++}}static createElement(t,e){let s=A.createElement("template");return s.innerHTML=t,s}};function w(i,t,e=i,s){if(t===C)return t;let n=s!==void 0?e._$Co?.[s]:e._$Cl,r=R(t)?void 0:t._$litDirective$;return n?.constructor!==r&&(n?._$AO?.(!1),r===void 0?n=void 0:(n=new r(i),n._$AT(i,e,s)),s!==void 0?(e._$Co??=[])[s]=n:e._$Cl=n),n!==void 0&&(t=w(i,n._$AS(i,t.values),n,s)),t}var X=class{constructor(t,e){this._$AV=[],this._$AN=void 0,this._$AD=t,this._$AM=e}get parentNode(){return this._$AM.parentNode}get _$AU(){return this._$AM._$AU}u(t){let{el:{content:e},parts:s}=this._$AD,n=(t?.creationScope??A).importNode(e,!0);b.currentNode=n;let r=b.nextNode(),o=0,h=0,a=s[0];for(;a!==void 0;){if(o===a.index){let d;a.type===2?d=new O(r,r.nextSibling,this,t):a.type===1?d=new a.ctor(r,a.name,a.strings,this,t):a.type===6&&(d=new tt(r,this,t)),this._$AV.push(d),a=s[++h]}o!==a?.index&&(r=b.nextNode(),o++)}return b.currentNode=A,n}p(t){let e=0;for(let s of this._$AV)s!==void 0&&(s.strings!==void 0?(s._$AI(t,s,e),e+=s.strings.length-2):s._$AI(t[e])),e++}},O=class i{get _$AU(){return this._$AM?._$AU??this._$Cv}constructor(t,e,s,n){this.type=2,this._$AH=l,this._$AN=void 0,this._$AA=t,this._$AB=e,this._$AM=s,this.options=n,this._$Cv=n?.isConnected??!0}get parentNode(){let t=this._$AA.parentNode,e=this._$AM;return e!==void 0&&t?.nodeType===11&&(t=e.parentNode),t}get startNode(){return this._$AA}get endNode(){return this._$AB}_$AI(t,e=this){t=w(this,t,e),R(t)?t===l||t==null||t===""?(this._$AH!==l&&this._$AR(),this._$AH=l):t!==this._$AH&&t!==C&&this._(t):t._$litType$!==void 0?this.$(t):t.nodeType!==void 0?this.T(t):zt(t)?this.k(t):this._(t)}O(t){return this._$AA.parentNode.insertBefore(t,this._$AB)}T(t){this._$AH!==t&&(this._$AR(),this._$AH=this.O(t))}_(t){this._$AH!==l&&R(this._$AH)?this._$AA.nextSibling.data=t:this.T(A.createTextNode(t)),this._$AH=t}$(t){let{values:e,_$litType$:s}=t,n=typeof s=="number"?this._$AC(t):(s.el===void 0&&(s.el=T.createElement(At(s.h,s.h[0]),this.options)),s);if(this._$AH?._$AD===n)this._$AH.p(e);else{let r=new X(n,this),o=r.u(this.options);r.p(e),this.T(o),this._$AH=r}}_$AC(t){let e=yt.get(t.strings);return e===void 0&&yt.set(t.strings,e=new T(t)),e}k(t){st(this._$AH)||(this._$AH=[],this._$AR());let e=this._$AH,s,n=0;for(let r of t)n===e.length?e.push(s=new i(this.O(H()),this.O(H()),this,this.options)):s=e[n],s._$AI(r),n++;n<e.length&&(this._$AR(s&&s._$AB.nextSibling,n),e.length=n)}_$AR(t=this._$AA.nextSibling,e){for(this._$AP?.(!1,!0,e);t!==this._$AB;){let s=pt(t).nextSibling;pt(t).remove(),t=s}}setConnected(t){this._$AM===void 0&&(this._$Cv=t,this._$AP?.(t))}},x=class{get tagName(){return this.element.tagName}get _$AU(){return this._$AM._$AU}constructor(t,e,s,n,r){this.type=1,this._$AH=l,this._$AN=void 0,this.element=t,this.name=e,this._$AM=n,this.options=r,s.length>2||s[0]!==""||s[1]!==""?(this._$AH=Array(s.length-1).fill(new String),this.strings=s):this._$AH=l}_$AI(t,e=this,s,n){let r=this.strings,o=!1;if(r===void 0)t=w(this,t,e,0),o=!R(t)||t!==this._$AH&&t!==C,o&&(this._$AH=t);else{let h=t,a,d;for(t=r[0],a=0;a<r.length-1;a++)d=w(this,h[s+a],e,a),d===C&&(d=this._$AH[a]),o||=!R(d)||d!==this._$AH[a],d===l?t=l:t!==l&&(t+=(d??"")+r[a+1]),this._$AH[a]=d}o&&!n&&this.j(t)}j(t){t===l?this.element.removeAttribute(this.name):this.element.setAttribute(this.name,t??"")}},Z=class extends x{constructor(){super(...arguments),this.type=3}j(t){this.element[this.name]=t===l?void 0:t}},Q=class extends x{constructor(){super(...arguments),this.type=4}j(t){this.element.toggleAttribute(this.name,!!t&&t!==l)}},Y=class extends x{constructor(t,e,s,n,r){super(t,e,s,n,r),this.type=5}_$AI(t,e=this){if((t=w(this,t,e,0)??l)===C)return;let s=this._$AH,n=t===l&&s!==l||t.capture!==s.capture||t.once!==s.once||t.passive!==s.passive,r=t!==l&&(s===l||n);n&&this.element.removeEventListener(this.name,this,s),r&&this.element.addEventListener(this.name,this,t),this._$AH=t}handleEvent(t){typeof this._$AH=="function"?this._$AH.call(this.options?.host??this.element,t):this._$AH.handleEvent(t)}},tt=class{constructor(t,e,s){this.element=t,this.type=6,this._$AN=void 0,this._$AM=e,this.options=s}get _$AU(){return this._$AM._$AU}_$AI(t){w(this,t)}};var Bt=et.litHtmlPolyfillSupport;Bt?.(T,O),(et.litHtmlVersions??=[]).push("3.3.3");var Ct=(i,t,e)=>{let s=e?.renderBefore??t,n=s._$litPart$;if(n===void 0){let r=e?.renderBefore??null;s._$litPart$=n=new O(t.insertBefore(H(),r),r,void 0,e??{})}return n._$AI(i),n};var nt=globalThis,f=class extends g{constructor(){super(...arguments),this.renderOptions={host:this},this._$Do=void 0}createRenderRoot(){let t=super.createRenderRoot();return this.renderOptions.renderBefore??=t.firstChild,t}update(t){let e=this.render();this.hasUpdated||(this.renderOptions.isConnected=this.isConnected),super.update(t),this._$Do=Ct(e,this.renderRoot,this.renderOptions)}connectedCallback(){super.connectedCallback(),this._$Do?.setConnected(!0)}disconnectedCallback(){super.disconnectedCallback(),this._$Do?.setConnected(!1)}render(){return C}};f._$litElement$=!0,f.finalized=!0,nt.litElementHydrateSupport?.({LitElement:f});var Ft=nt.litElementPolyfillSupport;Ft?.({LitElement:f});(nt.litElementVersions??=[]).push("4.2.2");var Et={en:{now:"now",min:"min",cancelled:"cancelled",skipped:"does not stop",none:"No departures",unavailable:"Unavailable",live:"Live",noPaths:"The map cannot draw paths in this version of Home Assistant.",entity:"Departures sensor",title:"Title",limit:"Departures shown",entry:"Source",line:"Line",routeType:"Route type",height:"Height in pixels"},pl:{now:"teraz",min:"min",cancelled:"odwo\u0142any",skipped:"nie zatrzymuje si\u0119",none:"Brak odjazd\xF3w",unavailable:"Niedost\u0119pne",live:"Na \u017Cywo",noPaths:"Mapa w tej wersji Home Assistanta nie umie narysowa\u0107 tras.",entity:"Sensor odjazd\xF3w",title:"Tytu\u0142",limit:"Liczba odjazd\xF3w",entry:"\u0179r\xF3d\u0142o",line:"Linia",routeType:"Typ trasy",height:"Wysoko\u015B\u0107 w pikselach"}};function _(i){return i?.toLowerCase().startsWith("pl")?Et.pl:Et.en}var E=5,Wt=3e4,Vt=6e4,qt=60,Kt={bus:"#1565C0",tram:"#C62828",trolleybus:"#2E7D32"};function Gt(i){return i===3||i>=700&&i<800?"bus":i===0||i>=900&&i<1e3?"tram":i===11||i>=800&&i<900?"trolleybus":"other"}function Jt(i){return i.line_color&&i.line_text_color?{background:i.line_color,text:i.line_text_color}:{background:Kt[Gt(i.route_type)]??"#455A64",text:"#FFFFFF"}}function Xt(i){return i==="12"?{hour12:!0}:i==="24"?{hour12:!1}:{}}function Zt(i,t,e,s,n){let r=_(e),o=Math.floor((i.getTime()-t.getTime())/Vt);return o<1?r.now:o<qt?`${o} ${r.min}`:new Intl.DateTimeFormat(e,{hour:"2-digit",minute:"2-digit",timeZone:s,...Xt(n)}).format(i)}function Qt(i){if(i.status!=="predicted"||i.delay===null)return null;let t=Math.trunc(i.delay/60);return t===0?null:t>0?`+${t}`:`\u2212${-t}`}function wt(i,t,e,s,n,r){let o=_(s);return i.filter(h=>new Date(h.predicted??h.scheduled).getTime()>=t.getTime()-Wt).slice(0,Math.min(e,E)).map(h=>{let a=new Date(h.predicted??h.scheduled),d=Jt(h);return{line:h.line,...d,headsign:h.headsign??"",time:Zt(a,t,s,n,r),live:h.status==="predicted",delay:Qt(h),note:h.status==="cancelled"?o.cancelled:h.status==="skipped"?o.skipped:null,struck:h.status==="cancelled"}})}function xt(i){return Array.isArray(i)?i.filter(t=>typeof t=="object"&&t!==null&&typeof t.line=="string"&&typeof t.scheduled=="string"):[]}var Yt=15e3;function D(i){return i.locale?.language??i.language??"en"}function te(i,t){let e=i.entities?.[t]?.device_id,s=e?i.devices?.[e]:void 0,n=s?.name_by_user??s?.name??i.states[t]?.attributes.friendly_name;return typeof n=="string"?n:void 0}var B=class extends f{static{this.properties={hass:{attribute:!1},_config:{state:!0},_now:{state:!0}}}constructor(){super(),this._now=new Date}static getConfigElement(){return document.createElement("gtfs-hub-departures-card-editor")}static getStubConfig(t){return{entity:Object.keys(t.states).find(s=>s.startsWith("sensor.")&&Array.isArray(t.states[s]?.attributes.departures))??"",limit:E}}setConfig(t){if(!t.entity)throw new Error("Choose a departures sensor");this._config=t}getCardSize(){return 1+Math.min(this._config?.limit??E,E)}connectedCallback(){super.connectedCallback(),this._timer=setInterval(()=>this._now=new Date,Yt)}disconnectedCallback(){super.disconnectedCallback(),clearInterval(this._timer)}shouldUpdate(t){if(!t.has("hass")||t.size>1)return!0;let e=t.get("hass"),s=this._config?.entity;return!e||!s||e.states[s]!==this.hass?.states[s]}render(){if(!this.hass||!this._config)return l;let t=D(this.hass),e=_(t),s=this.hass.states[this._config.entity],n=this._config.title??te(this.hass,this._config.entity),r=s?.attributes.attribution,o;if(!s||s.state==="unavailable")o=p`<div class="empty">${e.unavailable}</div>`;else{let h=wt(xt(s.attributes.departures),this._now,this._config.limit??E,t,this.hass.config.time_zone,this.hass.locale?.time_format);o=h.length?p`<ul>
            ${h.map(a=>p`<li class=${a.struck?"struck":""}>
                <span class="badge" style="background:${a.background};color:${a.text}"
                  >${a.line}</span
                >
                <span class="headsign"
                  >${a.headsign}${a.note?p` <em>${a.note}</em>`:l}</span
                >
                <span class="time">
                  ${a.live?p`<span class="live" title=${e.live}></span>`:l}
                  ${a.time}${a.delay?p` <span class="delay">${a.delay}</span>`:l}
                </span>
              </li>`)}
          </ul>`:p`<div class="empty">${e.none}</div>`}return p`<ha-card .header=${n}>
      <div class="card-content">${o}</div>
      ${typeof r=="string"?p`<div class="attribution">${r}</div>`:l}
    </ha-card>`}static{this.styles=M`
    ul {
      list-style: none;
      margin: 0;
      padding: 0;
    }
    li {
      display: grid;
      grid-template-columns: auto 1fr auto;
      align-items: center;
      gap: 12px;
      padding: 6px 0;
    }
    li + li {
      border-top: 1px solid var(--divider-color);
    }
    .badge {
      min-width: 2.6em;
      padding: 2px 6px;
      border-radius: 4px;
      font-weight: 700;
      text-align: center;
      box-sizing: border-box;
    }
    .headsign {
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
    .struck .headsign,
    .struck .time {
      text-decoration: line-through;
      color: var(--secondary-text-color);
    }
    em {
      font-style: normal;
      color: var(--error-color);
      text-decoration: none;
      display: inline-block;
    }
    .time {
      font-variant-numeric: tabular-nums;
      white-space: nowrap;
    }
    .live {
      display: inline-block;
      width: 8px;
      height: 8px;
      border-radius: 50%;
      background: var(--success-color, #43a047);
      margin-right: 4px;
    }
    .delay {
      color: var(--error-color);
      font-weight: 700;
    }
    .empty {
      color: var(--secondary-text-color);
    }
    .attribution {
      padding: 0 16px 12px;
      font-size: 0.75em;
      color: var(--secondary-text-color);
    }
  `}},F=class extends f{static{this.properties={hass:{attribute:!1},_config:{state:!0}}}setConfig(t){this._config=t}render(){if(!this.hass||!this._config)return l;let t=_(D(this.hass)),e={entity:t.entity,title:t.title,limit:t.limit},s=[{name:"entity",required:!0,selector:{entity:{integration:"gtfs_hub",domain:"sensor"}}},{name:"title",selector:{text:{}}},{name:"limit",selector:{number:{min:1,max:E,mode:"box"}}}];return p`<ha-form
      .hass=${this.hass}
      .data=${this._config}
      .schema=${s}
      .computeLabel=${n=>e[n.name]??n.name}
      @value-changed=${this._changed}
    ></ha-form>`}_changed(t){this.dispatchEvent(new CustomEvent("config-changed",{detail:{config:t.detail.value},bubbles:!0,composed:!0}))}};var S=16;function St(i){let t=i._engine;if(typeof t?.addPath=="function"&&typeof t.fitBounds=="function"){let{addPath:n,fitBounds:r}=t;return{path:(o,h)=>n.call(t,{color:h,segments:[{points:o}],markers:[]}),fit:o=>r.call(t,o,{pad:.05,padding:{top:S,right:S,bottom:S,left:S}})}}let{leafletMap:e,Leaflet:s}=i;if(e&&s)return{path:(n,r)=>s.polyline(n,{color:r,weight:4,opacity:.8,interactive:!1}).addTo(e),fit:n=>e.fitBounds(s.latLngBounds(n),{padding:[S,S]})}}var ee=36e5,Mt=5e3,Pt=400;function se(i,t){return Object.values(i).filter(e=>e!==void 0&&e.entity_id.startsWith("device_tracker.")&&e.state!=="unavailable"&&e.attributes.provider===t.provider&&e.attributes.line===t.line&&e.attributes.route_type===t.route_type).map(e=>e.entity_id).sort()}var rt=i=>new Promise(t=>setTimeout(t,i));async function ie(){if(customElements.get("ha-map"))return;let i=window.loadCardHelpers;i&&(await i()).createCardElement({type:"map",entities:["zone.home"]}),await Promise.race([customElements.whenDefined("ha-map"),rt(Mt)])}var W=class extends f{constructor(){super();this._layers=[];this._fitted=!1;this._fetching=!1;this._noPaths=!1,this._mapReady=!1}static{this.properties={hass:{attribute:!1},_config:{state:!0},_shapes:{state:!0},_error:{state:!0},_noPaths:{state:!0},_mapReady:{state:!0}}}static getConfigElement(){return document.createElement("gtfs-hub-line-map-card-editor")}static getStubConfig(){return{entry:"",line:""}}setConfig(e){if(!e.entry||!e.line)throw new Error("Choose a source and a line");let s=e.entry!==this._config?.entry||e.line!==this._config?.line||e.route_type!==this._config?.route_type;this._config=e,s&&(this._shapes=void 0,this._fitted=!1,this.isConnected&&this._fetch())}getCardSize(){return Math.ceil((this._config?.height??Pt)/50)}connectedCallback(){super.connectedCallback(),ie().then(()=>this._mapReady=!!customElements.get("ha-map")),this._fetch(),this._timer=setInterval(()=>void this._fetch(),ee)}disconnectedCallback(){super.disconnectedCallback(),clearInterval(this._timer)}async _fetch(){if(!this.hass||!this._config||this._fetching)return;this._fetching=!0;let e={config_entry_id:this._config.entry,line:this._config.line};this._config.route_type!==void 0&&(e.route_type=this._config.route_type);try{let s=await this.hass.callWS({type:"call_service",domain:"gtfs_hub",service:"get_line_shapes",service_data:e,return_response:!0});this._shapes=s.response,this._error=void 0}catch(s){this._error=s instanceof Error?s.message:String(s.message??s)}finally{this._fetching=!1}}updated(e){(e.has("_shapes")||e.has("_mapReady"))&&this._drawPaths(),e.has("hass")&&!this._shapes&&!this._error&&this._fetch()}async _drawPaths(){let e=this.renderRoot.querySelector("ha-map");if(!e||!this._shapes)return;let s=Date.now()+Mt,n=St(e);for(;!n&&Date.now()<s;)await(e.updateComplete??rt(100)),await rt(100),n=St(e);if(!n){this._noPaths=!0;return}this._noPaths=!1,this._layers.forEach(h=>h.remove());let r=this._shapes.path_color??this._shapes.line_color;this._layers=this._shapes.shapes.map(h=>n.path(h.points,r));let o=this._shapes.shapes.flatMap(h=>h.points);!this._fitted&&o.length&&(n.fit(o),this._fitted=!0)}render(){if(!this.hass||!this._config)return l;let e=_(D(this.hass)),s=this._shapes?se(this.hass.states,this._shapes):[],n=this._config.height??Pt;return p`<ha-card>
      ${this._error?p`<div class="note">${this._error}</div>`:l}
      ${this._noPaths?p`<div class="note">${e.noPaths}</div>`:l}
      ${this._mapReady?p`<ha-map
            style="height:${n}px"
            .hass=${this.hass}
            .entities=${s}
            .autoFit=${!1}
            .zoom=${13}
          ></ha-map>`:p`<div style="height:${n}px"></div>`}
    </ha-card>`}static{this.styles=M`
    ha-card {
      overflow: hidden;
    }
    .note {
      padding: 8px 16px;
      color: var(--secondary-text-color);
    }
  `}},V=class extends f{static{this.properties={hass:{attribute:!1},_config:{state:!0}}}setConfig(t){this._config=t}render(){if(!this.hass||!this._config)return l;let t=_(D(this.hass)),e={entry:t.entry,line:t.line,route_type:t.routeType,height:t.height},s=[{name:"entry",required:!0,selector:{config_entry:{integration:"gtfs_hub"}}},{name:"line",required:!0,selector:{text:{}}},{name:"route_type",selector:{number:{min:0,max:1799,mode:"box"}}},{name:"height",selector:{number:{min:200,max:1200,step:50,mode:"box"}}}];return p`<ha-form
      .hass=${this.hass}
      .data=${this._config}
      .schema=${s}
      .computeLabel=${n=>e[n.name]??n.name}
      @value-changed=${this._changed}
    ></ha-form>`}_changed(t){this.dispatchEvent(new CustomEvent("config-changed",{detail:{config:t.detail.value},bubbles:!0,composed:!0}))}};var ne=[["gtfs-hub-departures-card",B],["gtfs-hub-departures-card-editor",F],["gtfs-hub-line-map-card",W],["gtfs-hub-line-map-card-editor",V]];for(let[i,t]of ne)customElements.get(i)||customElements.define(i,t);var kt=window;kt.customCards??=[];kt.customCards.push({type:"gtfs-hub-departures-card",name:"GTFS Hub departures",description:"A stop board with live delays.",preview:!0},{type:"gtfs-hub-line-map-card",name:"GTFS Hub line map",description:"The paths of a tracked line with its vehicles."});
/*! Bundled license information:

@lit/reactive-element/css-tag.js:
  (**
   * @license
   * Copyright 2019 Google LLC
   * SPDX-License-Identifier: BSD-3-Clause
   *)

@lit/reactive-element/reactive-element.js:
  (**
   * @license
   * Copyright 2017 Google LLC
   * SPDX-License-Identifier: BSD-3-Clause
   *)

lit-html/lit-html.js:
  (**
   * @license
   * Copyright 2017 Google LLC
   * SPDX-License-Identifier: BSD-3-Clause
   *)

lit-element/lit-element.js:
  (**
   * @license
   * Copyright 2017 Google LLC
   * SPDX-License-Identifier: BSD-3-Clause
   *)

lit-html/is-server.js:
  (**
   * @license
   * Copyright 2022 Google LLC
   * SPDX-License-Identifier: BSD-3-Clause
   *)
*/
