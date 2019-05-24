"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const mobx_1 = require("mobx");
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
    for (const key in obj) {
        if (Object.prototype.hasOwnProperty.call(obj, key))
            return false;
    }
    return true;
}
const wrapRequestCache = {};
class WrapRequest {
    constructor(req, options) {
        this.options = {};
        this.req = req;
        this.options = options || {};
        this.transform = this.options.transform;
        if (this.options.defaultData) {
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
    async request(params) {
        const cacheKey = this.getCacheKey(params);
        this.error = undefined;
        try {
            if (cacheKey && wrapRequestCache[cacheKey]) {
                this._$ = wrapRequestCache[cacheKey];
                this.state = 'fetched';
            }
            else {
                this.state = 'loading';
            }
            const result = await this.req(params);
            this._$ = result;
            this.state = 'fetched';
            if (cacheKey) {
                wrapRequestCache[cacheKey] = this.$;
            }
        }
        catch (e) {
            this.error = e;
            this.state = 'error';
        }
        return this.$;
    }
    get $() {
        if (this.transform) {
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
tslib_1.__decorate([
    mobx_1.observable,
    tslib_1.__metadata("design:type", Error)
], WrapRequest.prototype, "error", void 0);
tslib_1.__decorate([
    mobx_1.observable,
    tslib_1.__metadata("design:type", Object)
], WrapRequest.prototype, "_$", void 0);
tslib_1.__decorate([
    mobx_1.observable,
    tslib_1.__metadata("design:type", Function)
], WrapRequest.prototype, "transform", void 0);
tslib_1.__decorate([
    mobx_1.observable,
    tslib_1.__metadata("design:type", String)
], WrapRequest.prototype, "state", void 0);
tslib_1.__decorate([
    mobx_1.computed,
    tslib_1.__metadata("design:type", Object),
    tslib_1.__metadata("design:paramtypes", [Object])
], WrapRequest.prototype, "$", null);
tslib_1.__decorate([
    mobx_1.computed,
    tslib_1.__metadata("design:type", Object),
    tslib_1.__metadata("design:paramtypes", [])
], WrapRequest.prototype, "source", null);
tslib_1.__decorate([
    mobx_1.computed,
    tslib_1.__metadata("design:type", Boolean),
    tslib_1.__metadata("design:paramtypes", [Boolean])
], WrapRequest.prototype, "loading", null);
tslib_1.__decorate([
    mobx_1.computed,
    tslib_1.__metadata("design:type", Boolean),
    tslib_1.__metadata("design:paramtypes", [Boolean])
], WrapRequest.prototype, "fetched", null);
tslib_1.__decorate([
    mobx_1.computed,
    tslib_1.__metadata("design:type", Object),
    tslib_1.__metadata("design:paramtypes", [])
], WrapRequest.prototype, "empty", null);
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