"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/** @see https://stackoverflow.com/a/4994244/1138860 */
function isEmpty(obj) {
    if (!obj)
        return true;
    if (obj > 0)
        return false;
    if (obj.length > 0)
        return false;
    if (obj.length === 0)
        return true;
    if (typeof obj !== 'object')
        return true;
    if (obj instanceof Map || obj instanceof Set)
        return obj.size === 0;
    for (const key in obj) {
        if (Object.prototype.hasOwnProperty.call(obj, key))
            return false;
    }
    return true;
}
const wrapRequestCache = {};
class WrapRequest {
    constructor(req, options) {
        this.xhrVersion = 0;
        this.options = {};
        this.req = req;
        this.options = options || {};
        this.transform = this.options.transform;
        const cacheData = this.getCachedData(this.params);
        if (cacheData) {
            this._$ = cacheData;
        }
        else if (this.options.defaultData) {
            this._$ = this.options.defaultData;
        }
    }
    getCacheKey(params) {
        const { cacheKey } = this.options;
        if (!cacheKey) {
            return undefined;
        }
        if (params) {
            return `${cacheKey}-${JSON.stringify(params)}`;
        }
        return cacheKey;
    }
    getCachedData(params) {
        const cacheKey = this.getCacheKey(params);
        if (cacheKey && wrapRequestCache[cacheKey]) {
            return wrapRequestCache[cacheKey];
        }
        return undefined;
    }
    async request(params, { stateLoading = true, throwError = false } = {}) {
        const version = ++this.xhrVersion;
        const cacheKey = this.getCacheKey(params);
        const cacheData = this.getCachedData(params);
        this.params = params;
        this.error = undefined;
        try {
            if (cacheData) {
                this._$ = cacheData;
                if (this.options.metadata) {
                    this._metadata = this.options.metadata(cacheData);
                }
                this.state = 'fetched';
            }
            else {
                if (stateLoading) {
                    this.state = 'loading';
                }
            }
            this.xhr = this.req(params);
            const result = await this.xhr;
            if (this.xhrVersion === version) {
                this._$ = result;
                if (this.options.metadata) {
                    this._metadata = this.options.metadata(result);
                }
                this.state = 'fetched';
                if (cacheKey) {
                    wrapRequestCache[cacheKey] = this.$;
                }
            }
        }
        catch (e) {
            if (this.xhrVersion === version) {
                this.error = e;
                this.state = 'error';
            }
            if (throwError) {
                throw e;
            }
        }
        return this.$;
    }
    get $() {
        if (this.transform && this._$) {
            return this.transform(this._$);
        }
        return this._$;
    }
    set $(value) {
        this.reset(value);
    }
    /** alias for this.$ */
    get result() {
        return this.$;
    }
    /** alias for this.$ */
    set result(value) {
        this.$ = value;
    }
    get source() {
        return this._$;
    }
    get metadata() {
        return this._metadata;
    }
    get loading() {
        return this.state === 'loading';
    }
    set loading(value) {
        this.state = value ? 'loading' : undefined;
    }
    get fetched() {
        return this.state === 'fetched';
    }
    set fetched(value) {
        this.state = value ? 'fetched' : undefined;
    }
    get empty() {
        if (this.fetched && isEmpty(this.$)) {
            return true;
        }
        return false;
    }
    match(handlers) {
        if (this.error && handlers.error) {
            return handlers.error(this.error);
        }
        if (this.empty && handlers.empty) {
            return handlers.empty();
        }
        if (this.loading && handlers.loading) {
            return handlers.loading();
        }
        if (this.fetched && handlers.fetched) {
            return handlers.fetched(this.$);
        }
        if (handlers.default) {
            return handlers.default();
        }
        return null;
    }
    reset(value, params) {
        const cacheKey = this.getCacheKey(params);
        this._$ = value;
        if (cacheKey) {
            wrapRequestCache[cacheKey] = this.$;
        }
    }
    didFetch(cb) {
        if (this.fetched) {
            return cb(this.$);
        }
        return null;
    }
    async when() {
        if (this.error) {
            return Promise.reject(this.error);
        }
        if (!this.fetched) {
            return new Promise(resolve => {
                setTimeout(() => resolve(this.when()), 50);
            });
        }
        return this.$;
    }
    disposeCache(key) {
        if (key) {
            delete wrapRequestCache[key];
        }
        else {
            Object.keys(wrapRequestCache).forEach(key => {
                delete wrapRequestCache[key];
            });
        }
    }
}
exports.WrapRequest = WrapRequest;
/**
 * @param request The request to perform when calling `wrapRequest.request`
 * @param options {WrapRequestOptions}
 */
function wrapRequest(request, options) {
    return new WrapRequest(request, options);
}
exports.wrapRequest = wrapRequest;
//# sourceMappingURL=index.js.map