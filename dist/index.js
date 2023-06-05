"use strict";var __awaiter=this&&this.__awaiter||function(e,n,o,h){return new(o=o||Promise)(function(r,t){function i(e){try{a(h.next(e))}catch(e){t(e)}}function s(e){try{a(h.throw(e))}catch(e){t(e)}}function a(e){var t;e.done?r(e.value):((t=e.value)instanceof o?t:new o(function(e){e(t)})).then(i,s)}a((h=h.apply(e,n||[])).next())})},__rest=this&&this.__rest||function(e,t){var r={};for(s in e)Object.prototype.hasOwnProperty.call(e,s)&&t.indexOf(s)<0&&(r[s]=e[s]);if(null!=e&&"function"==typeof Object.getOwnPropertySymbols)for(var i=0,s=Object.getOwnPropertySymbols(e);i<s.length;i++)t.indexOf(s[i])<0&&Object.prototype.propertyIsEnumerable.call(e,s[i])&&(r[s[i]]=e[s[i]]);return r};function isEmpty(e){if(e){if(0<e)return!1;if(0<e.length)return!1;if(0!==e.length&&"object"==typeof e){if(e instanceof Map||e instanceof Set)return 0===e.size;for(const t in e)if(Object.prototype.hasOwnProperty.call(e,t))return!1}}return!0}Object.defineProperty(exports,"__esModule",{value:!0}),exports.WrapRequestStream=exports.wrapRequest=exports.WrapRequest=exports.__wrapRequest__=exports.__wrapRequestDebug__=void 0;let cache={};exports.__wrapRequestDebug__={wrapRequests:[]},exports.__wrapRequest__={cache:{clear:()=>{cache={}},contents:cache}};class WrapRequest{constructor(e,t){Object.defineProperty(this,"_$",{enumerable:!0,configurable:!0,writable:!0,value:void 0}),Object.defineProperty(this,"error",{enumerable:!0,configurable:!0,writable:!0,value:void 0}),Object.defineProperty(this,"state",{enumerable:!0,configurable:!0,writable:!0,value:void 0}),Object.defineProperty(this,"requestParams",{enumerable:!0,configurable:!0,writable:!0,value:void 0}),Object.defineProperty(this,"xhr",{enumerable:!0,configurable:!0,writable:!0,value:void 0}),Object.defineProperty(this,"xhrVersion",{enumerable:!0,configurable:!0,writable:!0,value:0}),Object.defineProperty(this,"_metadata",{enumerable:!0,configurable:!0,writable:!0,value:void 0}),Object.defineProperty(this,"options",{enumerable:!0,configurable:!0,writable:!0,value:{}}),Object.defineProperty(this,"req",{enumerable:!0,configurable:!0,writable:!0,value:void 0}),Object.defineProperty(this,"parent",{enumerable:!0,configurable:!0,writable:!0,value:void 0}),this.req=e,this.options=t||{};e=this.getCachedData(this.requestParams);this._$=null!=e?e:this.options.defaultData,exports.__wrapRequestDebug__.wrapRequests.push(this)}getCacheKey(e){var t=this.options["cacheKey"];if(t)return e?t+"-"+JSON.stringify(e):t}getCachedData(e){e=this.getCacheKey(e);if(e&&cache[e])return cache[e]}checkXhrVersion(e,t){return t?this.xhrVersion===e:this.xhrVersion>=e}request(...[o,h]){var u;return __awaiter(this,void 0,void 0,function*(){var t=null==(u=null==h?void 0:h.stateLoading)||u,r=null!=(u=null==h?void 0:h.throwError)&&u,i=null!=(u=null==h?void 0:h.__ignoreXhrVersion__)&&u?this.xhrVersion:++this.xhrVersion;const s=this.getCacheKey(o);var e,a=null!=h&&h.ignoreCache?void 0:this.getCachedData(o),n=(this.requestParams=o,this.error=void 0,e=>{var t,r;this._$=e,this.options.metadata&&(this._metadata=this.options.metadata(e)),this.state="fetched",s&&(cache[s]=this._$),null!=(r=(t=this.options).transform)&&r.call(t,e)});try{a?n(a):(t&&(this.state="loading"),this.xhr=this.req(o,Object.assign(Object.assign({},h),{context:this})),e=yield this.xhr,this.checkXhrVersion(i,t)&&n(e))}catch(e){if(this.checkXhrVersion(i,t)&&(this.error=e,this.state="error"),r)throw e}return this.$})}get $(){var e,{defaultData:t,transform:r}=this.options;return r?"fetched"===this.state&&null!=(e=r(null!=(r=null==(r=null==(r=this.parent)?void 0:(e=r.options).transform)?void 0:r.call(e,this._$))?r:this._$))?e:t:null!=(r=this._$)?r:t}get result(){return this.$}get source(){var e,t=this.options["defaultData"];return null!=(e=this._$)?e:t}get metadata(){return this._metadata}get loading(){return"loading"===this.state}set loading(e){this.state=e?"loading":void 0}get fetched(){return"fetched"===this.state}set fetched(e){this.state=e?"fetched":void 0}get empty(){return!(!this.fetched||!isEmpty(this.$))}match(e){return this.error&&e.error?e.error(this.error):this.empty&&e.empty?e.empty():this.loading&&e.loading?e.loading():this.fetched&&e.fetched?e.fetched(this.$):e.default?e.default():null}reset(e,t){t=this.getCacheKey(t);this._$=e,this.error=void 0,this.xhr=void 0,this.requestParams=void 0,this.state=isEmpty(e)?void 0:"fetched",t&&(cache[t]=void 0),this.options.metadata&&e&&(this._metadata=this.options.metadata(e))}didFetch(e){return this.fetched?e(this.$):null}when(){return __awaiter(this,void 0,void 0,function*(){if(this.error)return Promise.reject(this.error);if(!this.fetched){if(!this.xhr)return new Promise(e=>{setTimeout(()=>e(this.when()),50)});try{yield this.xhr}catch(e){return this.when()}}return this.$})}pipe(e,t){const r=this.options,i=r["defaultData"],s=__rest(r,["defaultData"]);t=t&&null!=t&&t.hasOwnProperty("defaultData")?t.defaultData:i;const a=new WrapRequest(this.req,Object.assign(Object.assign({},s),{defaultData:t,transform:e})),n=["options","parent"];return Object.keys(this).forEach(e=>{const t=e;n.includes(t)||Object.defineProperty(a,t,{get:()=>this[t],set:e=>{Object.assign(this,{[t]:e})}})}),a.parent=this,a}disposeCache(){var e=this.getCacheKey(this.requestParams);e&&delete cache[e]}}function wrapRequest(e,t){return new WrapRequest(e,t)}exports.WrapRequest=WrapRequest,exports.wrapRequest=wrapRequest;class WrapRequestStream extends WrapRequest{constructor(s){super((e,{context:i})=>new Promise((t,r)=>{try{s(e=>{i._$=e,this.invokeUpdate(e)},e=>{this.invokeResolve(e),t(e)},e)}catch(e){r(e)}})),Object.defineProperty(this,"listeners",{enumerable:!0,configurable:!0,writable:!0,value:[]})}on(e,t){const r={type:e,cb:t};return this.listeners=[...this.listeners,r],()=>{this.listeners=this.listeners.filter(e=>e===r)}}invokeUpdate(t){this.listeners.filter(({type:e})=>"update"===e).forEach(({cb:e})=>e(t))}invokeResolve(t){this.listeners.filter(({type:e})=>"resolve"===e).forEach(({cb:e})=>e(t)),this.listeners=[]}}exports.WrapRequestStream=WrapRequestStream,wrapRequest.stream=function(e){return new WrapRequestStream(e)};