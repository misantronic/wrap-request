export type WrapRequestState = 'loading' | 'fetched' | 'error';

interface Options<T = any, Y = any, M = any> {
    /** set a default value for `wrapRequest.$` e.g. `[]` */
    defaultData?: Y | T;
    /** when provided, the result will be globally cached  */
    cacheKey?: string;
    /** a function which receives the request `$` and returns a new value */
    transform?: ($: T) => Y;
    /** a function which return value will be set as metadata */
    metadata?: ($: T) => M;
}

interface RequestOptions {
    stateLoading?: boolean;
    throwError?: boolean;
    __ignoreXhrVersion__?: boolean;
}

type RequestFn<T, U, X, Y, Z, M = any> = (
    params: U,
    context: WrapRequest<T, U, X, Y, Z, M>
) => Promise<T>;

/** @see https://stackoverflow.com/a/4994244/1138860 */
function isEmpty(obj: any): boolean {
    if (!obj) return true;
    if (obj > 0) return false;
    if (obj.length > 0) return false;
    if (obj.length === 0) return true;
    if (typeof obj !== 'object') return true;
    if (obj instanceof Map || obj instanceof Set) return obj.size === 0;
    for (const key in obj) {
        if (Object.prototype.hasOwnProperty.call(obj, key)) return false;
    }
    return true;
}

let cache: { [key: string]: any } = {};

export const __wrapRequestDebug__ = {
    cache: {
        clear: () => {
            cache = {};
        },
        contents: cache
    },
    wrapRequests: [] as WrapRequest[]
};

export class WrapRequest<
    T = any,
    U = any,
    X = any,
    Y = any,
    Z = T | X,
    M = any
> {
    public _$!: T | X;
    public error?: Error;
    public transform?: (value: T | X) => Y;
    public state?: WrapRequestState;
    public requestParams?: U;
    public xhr?: Promise<T | X>;

    private xhrVersion = 0;
    private _metadata?: M;
    private options: Options = {};
    private req: RequestFn<T, U, X, Y, Z, M>;

    constructor(req: RequestFn<T, U, X, Y, Z, M>, options?: Options) {
        this.req = req;
        this.options = options || {};
        this.transform = this.options.transform;

        const cacheData = this.getCachedData(this.requestParams);

        if (cacheData) {
            this._$ = cacheData;
        } else if (this.options.defaultData) {
            this._$ = this.options.defaultData;
        }

        __wrapRequestDebug__.wrapRequests.push(this);
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

        if (cacheKey && cache[cacheKey]) {
            return cache[cacheKey];
        }

        return undefined;
    }

    private checkXhrVersion(version: number, stateLoading?: boolean): boolean {
        if (stateLoading) {
            return this.xhrVersion === version;
        }
        return this.xhrVersion >= version;
    }

    public async request(
        params?: U,
        {
            stateLoading = true,
            throwError = false,
            __ignoreXhrVersion__ = false
        }: RequestOptions = {}
    ): Promise<T | X> {
        const version = __ignoreXhrVersion__
            ? this.xhrVersion
            : ++this.xhrVersion;
        const cacheKey = this.getCacheKey(params);
        const cacheData = this.getCachedData(params);

        this.requestParams = params;
        this.error = undefined;

        const setFetched = (result: T | X) => {
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
            } else {
                if (stateLoading) {
                    this.state = 'loading';
                }

                this.xhr = this.req(params as U, this);

                const result = await this.xhr;

                if (this.checkXhrVersion(version, stateLoading)) {
                    setFetched(result);
                }
            }
        } catch (e) {
            if (this.checkXhrVersion(version, stateLoading)) {
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

    public get metadata() {
        return this._metadata;
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

    public reset(value?: T | X, params?: U) {
        const cacheKey = this.getCacheKey(params);

        this._$ = value as T | X;
        this.error = undefined;
        this.xhr = undefined;
        this.requestParams = undefined;
        this.state = isEmpty(value) ? undefined : 'fetched';

        if (cacheKey) {
            cache[cacheKey] = this._$;
        }

        if (this.options.metadata) {
            this._metadata = this.options.metadata(value);
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
            if (this.xhr) {
                try {
                    await this.xhr;
                } catch (e) {
                    return this.when();
                }
            } else {
                return new Promise((resolve) => {
                    setTimeout(() => resolve(this.when()), 50);
                });
            }
        }

        return this.$ as T;
    }

    public disposeCache(key?: string) {
        if (key) {
            delete cache[key];
        } else {
            cache = {};
        }
    }
}

export function wrapRequest<T = any, U = any, X = undefined, M = any>(
    request: RequestFn<T, U, X, T, M>
): WrapRequest<T, U, X, T, M>;

export function wrapRequest<T = any, U = any, X = T, Y = T, M = any>(
    request: RequestFn<Y, U, Y, Y, T, M>,
    options?: Options<T & X, Y, M>
): WrapRequest<Y, U, Y, Y, T, M>;

/**
 * @param request The request to perform when calling `wrapRequest.request`
 * @param options {Options}
 */
export function wrapRequest<T = any, U = any, X = any, Y = undefined, M = any>(
    request: RequestFn<T, U, X, T, M>,
    options?: Options<T & X, Y, M>
): WrapRequest<T, U> {
    return new WrapRequest<T, U, X, T, M>(request, options);
}
