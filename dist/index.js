"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.wrapRequest = exports.WrapRequest = exports.__wrapRequestDebug__ = void 0;
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
let cache = {};
exports.__wrapRequestDebug__ = {
    cache: {
        clear: () => {
            cache = {};
        },
        contents: cache
    },
    wrapRequests: []
};
class WrapRequest {
    constructor(req, options) {
        Object.defineProperty(this, "_$", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "error", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "state", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "requestParams", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "xhr", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "xhrVersion", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: 0
        });
        Object.defineProperty(this, "_metadata", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "options", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: {}
        });
        Object.defineProperty(this, "req", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        this.req = req;
        this.options = options || {};
        const cacheData = this.getCachedData(this.requestParams);
        this._$ = cacheData || this.options.defaultData;
        exports.__wrapRequestDebug__.wrapRequests.push(this);
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
        if (cacheKey && cache[cacheKey]) {
            return cache[cacheKey];
        }
        return undefined;
    }
    checkXhrVersion(version, stateLoading) {
        if (stateLoading) {
            return this.xhrVersion === version;
        }
        return this.xhrVersion >= version;
    }
    request(...[params, options]) {
        var _a, _b, _c;
        return __awaiter(this, void 0, void 0, function* () {
            const stateLoading = (_a = options === null || options === void 0 ? void 0 : options.stateLoading) !== null && _a !== void 0 ? _a : true;
            const throwError = (_b = options === null || options === void 0 ? void 0 : options.throwError) !== null && _b !== void 0 ? _b : false;
            const __ignoreXhrVersion__ = (_c = options === null || options === void 0 ? void 0 : options.__ignoreXhrVersion__) !== null && _c !== void 0 ? _c : false;
            const version = __ignoreXhrVersion__
                ? this.xhrVersion
                : ++this.xhrVersion;
            const cacheKey = this.getCacheKey(params);
            const cacheData = this.getCachedData(params);
            this.requestParams = params;
            this.error = undefined;
            const setFetched = (result) => {
                this._$ = result;
                if (this.options.metadata) {
                    this._metadata = this.options.metadata(result);
                }
                this.state = 'fetched';
                if (cacheKey) {
                    cache[cacheKey] = this._$;
                }
            };
            try {
                if (cacheData) {
                    setFetched(cacheData);
                }
                else {
                    if (stateLoading) {
                        this.state = 'loading';
                    }
                    this.xhr = this.req(params, Object.assign(Object.assign({}, options), { context: this }));
                    const result = yield this.xhr;
                    if (this.checkXhrVersion(version, stateLoading)) {
                        setFetched(result);
                    }
                }
            }
            catch (e) {
                if (this.checkXhrVersion(version, stateLoading)) {
                    this.error = e;
                    this.state = 'error';
                }
                if (throwError) {
                    throw e;
                }
            }
            return this.$;
        });
    }
    get $() {
        const { defaultData, transform } = this.options;
        if (transform) {
            return (transform(this._$) || defaultData);
        }
        return (this._$ || defaultData);
    }
    /** alias for this.$ */
    get result() {
        return this.$;
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
        this.error = undefined;
        this.xhr = undefined;
        this.requestParams = undefined;
        this.state = isEmpty(value) ? undefined : 'fetched';
        if (cacheKey) {
            cache[cacheKey] = this._$;
        }
        if (this.options.metadata && value) {
            this._metadata = this.options.metadata(value);
        }
    }
    didFetch(cb) {
        if (this.fetched) {
            return cb(this.$);
        }
        return null;
    }
    when() {
        return __awaiter(this, void 0, void 0, function* () {
            if (this.error) {
                return Promise.reject(this.error);
            }
            if (!this.fetched) {
                if (this.xhr) {
                    try {
                        yield this.xhr;
                    }
                    catch (e) {
                        return this.when();
                    }
                }
                else {
                    return new Promise((resolve) => {
                        setTimeout(() => resolve(this.when()), 50);
                    });
                }
            }
            return this.$;
        });
    }
    /**
     * Return a new copy of the wrap-request with a transformed `$` / `result`
     */
    pipe(transform) {
        return new Proxy(this, {
            get: (target, prop, receiver) => {
                if (prop === '$' || prop === 'result') {
                    try {
                        return transform(this.$) || this.options.defaultData;
                    }
                    catch (e) {
                        this.error = e;
                    }
                }
                return Reflect.get(target, prop, receiver);
            }
        });
    }
    disposeCache(key) {
        if (key) {
            delete cache[key];
        }
        else {
            cache = {};
        }
    }
}
exports.WrapRequest = WrapRequest;
/**
 * @param request The request to perform when calling `wrapRequest.request`
 * @param options {Options}
 */
function wrapRequest(request, options) {
    return new WrapRequest(request, options);
}
exports.wrapRequest = wrapRequest;
//# sourceMappingURL=index.js.map