"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mobx_1 = require("mobx");
const _1 = require(".");
function decorateWithMobx() {
    mobx_1.decorate(_1.WrapRequest, {
        _$: mobx_1.observable,
        $: mobx_1.computed,
        error: mobx_1.observable,
        transform: mobx_1.observable,
        state: mobx_1.observable,
        source: mobx_1.computed,
        loading: mobx_1.computed,
        fetched: mobx_1.computed,
        empty: mobx_1.computed
    });
}
exports.decorateWithMobx = decorateWithMobx;
//# sourceMappingURL=mobx.js.map