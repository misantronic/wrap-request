export type WrapRequestState = 'loading' | 'fetched' | 'error';

interface WrapRequestOptions<T = any, Y = any> {
    /** set a default value for `wrapRequest.$` e.g. `[]` */
    defaultData?: T;
    /** when provided, the result will be globally cached  */
    cacheKey?: string;
    /** a function which receives the request `$` and returns a new value */
    transform?: ($: T) => Y;
}

interface WrapRequestRequestOptions {
    stateLoading?: boolean;
    throwError?: boolean;
}

/** @see https://stackoverflow.com/a/4994244/1138860 */
function isEmpty(obj: any): boolean {
    if (!obj) return true;
    if (obj > 0) return false;
    if (obj.length > 0) return false;
    if (obj.length === 0) return true;
    if (typeof obj !== 'object') return true;
    for (const key in obj) {
        if (Object.prototype.hasOwnProperty.call(obj, key)) return false;
    }
    return true;
}

const wrapRequestCache: { [key: string]: any } = {};

export class WrapRequest<T = any, U = any, X = any, Y = any, Z = T | X> {
    public _$!: T | X;
    public error?: Error;
    public transform?: (value: T | X) => Y;
    public state?: WrapRequestState;
    public xhr?: Promise<T>;
    private xhrVersion = 0;

    private params?: U;
    private options: WrapRequestOptions = {};
    private req: (params?: U) => Promise<T>;

    constructor(req: (params?: U) => Promise<T>, options?: WrapRequestOptions) {
        this.req = req;
        this.options = options || {};
        this.transform = this.options.transform;

        const cacheData = this.getCachedData(this.params);

        if (cacheData) {
            this._$ = cacheData;
        } else if (this.options.defaultData) {
            this._$ = this.options.defaultData;
        }
    }

    private getCacheKey(params?: U) {
        const { cacheKey } = this.options;

        if (!cacheKey) {
            return undefined;
        }

        if (params) {
            return `${cacheKey}-${JSON.stringify(params)}`;
        }

        return cacheKey;
    }

    private getCachedData(params?: U): (T | X) | undefined {
        const cacheKey = this.getCacheKey(params);

        if (cacheKey && wrapRequestCache[cacheKey]) {
            return wrapRequestCache[cacheKey];
        }

        return undefined;
    }

    public async request(
        params?: U,
        { stateLoading = true, throwError = false }: WrapRequestRequestOptions = {}
    ) {
        const version = ++this.xhrVersion;
        const cacheKey = this.getCacheKey(params);
        const cacheData = this.getCachedData(params);

        this.params = params;
        this.error = undefined;

        try {
            if (cacheData) {
                this._$ = cacheData;

                this.state = 'fetched';
            } else {
                if (stateLoading) {
                    this.state = 'loading';
                }
            }

            this.xhr = this.req(params);

            const result = await this.xhr;

            if (this.xhrVersion === version) {
                this._$ = result;

                this.state = 'fetched';

                if (cacheKey) {
                    wrapRequestCache[cacheKey] = this.$;
                }
            }
        } catch (e) {
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

    public get $(): T | X {
        if (this.transform && this._$) {
            return this.transform(this._$) as any;
        }

        return this._$;
    }

    public set $(value: T | X) {
        this.reset(value);
    }

    /** alias for this.$ */
    public get result() {
        return this.$;
    }

    /** alias for this.$ */
    public set result(value: T | X) {
        this.$ = value;
    }

    public get source(): Z {
        return this._$ as any;
    }

    public get loading() {
        return this.state === 'loading';
    }

    public set loading(value: boolean) {
        this.state = value ? 'loading' : undefined;
    }

    public get fetched() {
        return this.state === 'fetched';
    }

    public set fetched(value: boolean) {
        this.state = value ? 'fetched' : undefined;
    }

    public get empty() {
        if (this.fetched && isEmpty(this.$)) {
            return true;
        }

        return false;
    }

    public match(handlers: {
        default?(): any;
        loading?(): any;
        fetched?(value: T): any;
        empty?(): any;
        error?(e: Error): any;
    }) {
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
            return handlers.fetched(this.$ as T);
        }

        if (handlers.default) {
            return handlers.default();
        }

        return null;
    }

    public reset(value: T | X, params?: U) {
        const cacheKey = this.getCacheKey(params);

        this._$ = value;

        if (cacheKey) {
            wrapRequestCache[cacheKey] = this.$;
        }
    }

    public didFetch<R = any>(cb: ($: T) => R) {
        if (this.fetched) {
            return cb(this.$ as T);
        }

        return null;
    }

    public async when(): Promise<T> {
        if (this.error) {
            return Promise.reject(this.error);
        }

        if (!this.fetched) {
            return new Promise(resolve => {
                setTimeout(() => resolve(this.when()), 50);
            });
        }

        return this.$ as T;
    }

    public disposeCache(key?: string) {
        if (key) {
            delete wrapRequestCache[key];
        } else {
            Object.keys(wrapRequestCache).forEach(key => {
                delete wrapRequestCache[key];
            });
        }
    }
}

export function wrapRequest<T = any, U = any, X = undefined>(
    request: (params: U, options?: WrapRequestRequestOptions) => Promise<T>
): WrapRequest<T, U, X>;

export function wrapRequest<T = any, U = any, X = T, Y = T>(
    request: (params: U, options?: WrapRequestRequestOptions) => Promise<T>,
    options?: WrapRequestOptions<T & X, Y>
): WrapRequest<Y, U, Y, Y, Y>;

/**
 * @param request The request to perform when calling `wrapRequest.request`
 * @param options {WrapRequestOptions}
 */
export function wrapRequest<T = any, U = any, X = any, Y = undefined>(
    request: (params?: U, options?: WrapRequestRequestOptions) => Promise<T>,
    options?: WrapRequestOptions<T & X, Y>
): WrapRequest<T, U> {
    return new WrapRequest<T, U, X, Y>(request, options);
}
