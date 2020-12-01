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
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
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
    for (var key in obj) {
        if (Object.prototype.hasOwnProperty.call(obj, key))
            return false;
    }
    return true;
}
var wrapRequestCache = {};
var WrapRequest = /** @class */ (function () {
    function WrapRequest(req, options) {
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
        Object.defineProperty(this, "transform", {
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
        this.transform = this.options.transform;
        var cacheData = this.getCachedData(this.requestParams);
        if (cacheData) {
            this._$ = cacheData;
        }
        else if (this.options.defaultData) {
            this._$ = this.options.defaultData;
        }
    }
    Object.defineProperty(WrapRequest.prototype, "getCacheKey", {
        enumerable: false,
        configurable: true,
        writable: true,
        value: function (params) {
            var cacheKey = this.options.cacheKey;
            if (!cacheKey) {
                return undefined;
            }
            if (params) {
                return cacheKey + "-" + JSON.stringify(params);
            }
            return cacheKey;
        }
    });
    Object.defineProperty(WrapRequest.prototype, "getCachedData", {
        enumerable: false,
        configurable: true,
        writable: true,
        value: function (params) {
            var cacheKey = this.getCacheKey(params);
            if (cacheKey && wrapRequestCache[cacheKey]) {
                return wrapRequestCache[cacheKey];
            }
            return undefined;
        }
    });
    Object.defineProperty(WrapRequest.prototype, "checkXhrVersion", {
        enumerable: false,
        configurable: true,
        writable: true,
        value: function (version, stateLoading) {
            if (stateLoading) {
                return this.xhrVersion === version;
            }
            return this.xhrVersion >= version;
        }
    });
    Object.defineProperty(WrapRequest.prototype, "request", {
        enumerable: false,
        configurable: true,
        writable: true,
        value: function (params, _a) {
            var _b = _a === void 0 ? {} : _a, _c = _b.stateLoading, stateLoading = _c === void 0 ? true : _c, _d = _b.throwError, throwError = _d === void 0 ? false : _d, _e = _b.__ignoreXhrVersion__, __ignoreXhrVersion__ = _e === void 0 ? false : _e;
            return __awaiter(this, void 0, void 0, function () {
                var version, cacheKey, cacheData, setFetched, result, e_1;
                var _this = this;
                return __generator(this, function (_f) {
                    switch (_f.label) {
                        case 0:
                            version = __ignoreXhrVersion__
                                ? this.xhrVersion
                                : ++this.xhrVersion;
                            cacheKey = this.getCacheKey(params);
                            cacheData = this.getCachedData(params);
                            this.requestParams = params;
                            this.error = undefined;
                            setFetched = function (result) {
                                _this._$ = result;
                                if (_this.options.metadata) {
                                    _this._metadata = _this.options.metadata(result);
                                }
                                _this.state = 'fetched';
                                if (cacheKey) {
                                    wrapRequestCache[cacheKey] = _this._$;
                                }
                            };
                            _f.label = 1;
                        case 1:
                            _f.trys.push([1, 5, , 6]);
                            if (!cacheData) return [3 /*break*/, 2];
                            setFetched(cacheData);
                            return [3 /*break*/, 4];
                        case 2:
                            if (stateLoading) {
                                this.state = 'loading';
                            }
                            this.xhr = this.req(params);
                            return [4 /*yield*/, this.xhr];
                        case 3:
                            result = _f.sent();
                            if (this.checkXhrVersion(version, stateLoading)) {
                                setFetched(result);
                            }
                            _f.label = 4;
                        case 4: return [3 /*break*/, 6];
                        case 5:
                            e_1 = _f.sent();
                            if (this.checkXhrVersion(version, stateLoading)) {
                                this.error = e_1;
                                this.state = 'error';
                            }
                            if (throwError) {
                                throw e_1;
                            }
                            return [3 /*break*/, 6];
                        case 6: return [2 /*return*/, this.$];
                    }
                });
            });
        }
    });
    Object.defineProperty(WrapRequest.prototype, "$", {
        get: function () {
            if (this.transform && this._$) {
                return this.transform(this._$);
            }
            return this._$;
        },
        set: function (value) {
            this.reset(value);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(WrapRequest.prototype, "result", {
        /** alias for this.$ */
        get: function () {
            return this.$;
        },
        /** alias for this.$ */
        set: function (value) {
            this.$ = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(WrapRequest.prototype, "source", {
        get: function () {
            return this._$;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(WrapRequest.prototype, "metadata", {
        get: function () {
            return this._metadata;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(WrapRequest.prototype, "loading", {
        get: function () {
            return this.state === 'loading';
        },
        set: function (value) {
            this.state = value ? 'loading' : undefined;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(WrapRequest.prototype, "fetched", {
        get: function () {
            return this.state === 'fetched';
        },
        set: function (value) {
            this.state = value ? 'fetched' : undefined;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(WrapRequest.prototype, "empty", {
        get: function () {
            if (this.fetched && isEmpty(this.$)) {
                return true;
            }
            return false;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(WrapRequest.prototype, "match", {
        enumerable: false,
        configurable: true,
        writable: true,
        value: function (handlers) {
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
    });
    Object.defineProperty(WrapRequest.prototype, "reset", {
        enumerable: false,
        configurable: true,
        writable: true,
        value: function (value, params) {
            var cacheKey = this.getCacheKey(params);
            this._$ = value;
            this.error = undefined;
            this.state = isEmpty(value) ? undefined : 'fetched';
            if (cacheKey) {
                wrapRequestCache[cacheKey] = this._$;
            }
            if (this.options.metadata) {
                this._metadata = this.options.metadata(value);
            }
        }
    });
    Object.defineProperty(WrapRequest.prototype, "didFetch", {
        enumerable: false,
        configurable: true,
        writable: true,
        value: function (cb) {
            if (this.fetched) {
                return cb(this.$);
            }
            return null;
        }
    });
    Object.defineProperty(WrapRequest.prototype, "when", {
        enumerable: false,
        configurable: true,
        writable: true,
        value: function () {
            return __awaiter(this, void 0, void 0, function () {
                var e_2;
                var _this = this;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            if (this.error) {
                                return [2 /*return*/, Promise.reject(this.error)];
                            }
                            if (!!this.fetched) return [3 /*break*/, 6];
                            if (!this.xhr) return [3 /*break*/, 5];
                            _a.label = 1;
                        case 1:
                            _a.trys.push([1, 3, , 4]);
                            return [4 /*yield*/, this.xhr];
                        case 2:
                            _a.sent();
                            return [3 /*break*/, 4];
                        case 3:
                            e_2 = _a.sent();
                            return [2 /*return*/, this.when()];
                        case 4: return [3 /*break*/, 6];
                        case 5: return [2 /*return*/, new Promise(function (resolve) {
                                setTimeout(function () { return resolve(_this.when()); }, 50);
                            })];
                        case 6: return [2 /*return*/, this.$];
                    }
                });
            });
        }
    });
    Object.defineProperty(WrapRequest.prototype, "disposeCache", {
        enumerable: false,
        configurable: true,
        writable: true,
        value: function (key) {
            if (key) {
                delete wrapRequestCache[key];
            }
            else {
                Object.keys(wrapRequestCache).forEach(function (key) {
                    delete wrapRequestCache[key];
                });
            }
        }
    });
    return WrapRequest;
}());
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