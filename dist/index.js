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
class WrapRequest {
    constructor(req, $, transform) {
        this.req = req;
        this.transform = transform;
        if ($) {
            this._$ = $;
        }
    }
    async request(params) {
        this.state = undefined;
        this.error = undefined;
        try {
            this.state = 'loading';
            const result = await this.req(params);
            this._$ = result;
            this.state = 'fetched';
        }
        catch (e) {
            this.error = e;
            this.state = 'error';
        }
        return this.$;
    }
    get $() {
        if (this.transform) {
            // tslint:disable-next-line:no-any
            return this.transform(this._$);
        }
        return this._$;
    }
    /** alias for this.$ */
    get result() {
        return this.$;
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
    reset(value) {
        this._$ = value;
    }
    didFetch(cb) {
        if (this.fetched) {
            return cb(this.$);
        }
        return null;
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
    tslib_1.__metadata("design:paramtypes", [])
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
 * @param defaultData set a default value for `wrapRequest.$` e.g. `[]`
 * @param transform a function which receives the request `$` and returns a new value
 */
function wrapRequest(request, defaultData, transform) {
    return new WrapRequest(request, defaultData, transform);
}
exports.wrapRequest = wrapRequest;
//# sourceMappingURL=index.js.map