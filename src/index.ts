export type WrapRequestState = 'loading' | 'fetched' | 'error';

export interface Options<$, MD, DD> {
    /** set a default value for `wrapRequest.$` e.g. `[]` */
    defaultData?: DD;
    /** when provided, the result will be globally cached  */
    cacheKey?: string;
    /** a function which return value will be set as metadata */
    metadata?: ($: $) => MD;
}

interface InternalOptions<$, $$, MD, DD> extends Options<$, MD, DD> {
    transform?: ($: $) => $$;
}

export interface RequestOptions {
    stateLoading?: boolean;
    throwError?: boolean;
    ignoreCache?: boolean;
    context: WrapRequest;
    __ignoreXhrVersion__?: boolean;
}

export type RequestFn<$, P> = (
    params: P,
    options: RequestOptions
) => Promise<$>;

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
    wrapRequests: [] as WrapRequest[]
};

export const __wrapRequest__ = {
    cache: {
        clear: () => {
            cache = {};
        },
        contents: cache
    }
};

type RESULT<$$, DD> = DD extends undefined
    ? $$ | undefined
    : DD extends any
    ? $$
    : $$ | DD;

export class WrapRequest<$ = any, P = any, $$ = $, MD = any, DD = any> {
    public _$!: $;
    public error?: Error;
    public state?: WrapRequestState;
    public requestParams?: P;
    public xhr?: Promise<$>;

    private xhrVersion = 0;
    private _metadata?: MD;
    private options: InternalOptions<$, $$, MD, DD> = {};
    private req: RequestFn<$, P>;
    private parent?: WrapRequest;

    constructor(
        req: RequestFn<$, P>,
        options?: InternalOptions<$, $$, MD, DD>
    ) {
        this.req = req;
        this.options = options || {};

        const cacheData = this.getCachedData(this.requestParams);

        this._$ = cacheData || (this.options.defaultData as any);

        __wrapRequestDebug__.wrapRequests.push(this);
    }

    private getCacheKey(params?: P) {
        const { cacheKey } = this.options;

        if (!cacheKey) {
            return undefined;
        }

        if (params) {
            return `${cacheKey}-${JSON.stringify(params)}`;
        }

        return cacheKey;
    }

    private getCachedData(params?: P): $ | undefined {
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
        ...[params, options]: P extends undefined
            ? [undefined?, Omit<RequestOptions, 'context'>?]
            : [P, Omit<RequestOptions, 'context'>?]
    ) {
        const stateLoading = options?.stateLoading ?? true;
        const throwError = options?.throwError ?? false;
        const __ignoreXhrVersion__ = options?.__ignoreXhrVersion__ ?? false;

        const version = __ignoreXhrVersion__
            ? this.xhrVersion
            : ++this.xhrVersion;
        const cacheKey = this.getCacheKey(params);
        const cacheData = options?.ignoreCache
            ? undefined
            : this.getCachedData(params);

        this.requestParams = params;
        this.error = undefined;

        const setFetched = (result: $) => {
            this._$ = result;

            if (this.options.metadata) {
                this._metadata = this.options.metadata(result);
            }

            this.state = 'fetched';

            if (cacheKey) {
                cache[cacheKey] = this._$;
            }

            this.options.transform?.(result);
        };

        try {
            if (cacheData) {
                setFetched(cacheData);
            } else {
                if (stateLoading) {
                    this.state = 'loading';
                }

                this.xhr = this.req(params as P, { ...options, context: this });

                const result = await this.xhr;

                if (this.checkXhrVersion(version, stateLoading)) {
                    setFetched(result);
                }
            }
        } catch (e) {
            if (this.checkXhrVersion(version, stateLoading)) {
                this.error = e as Error;
                this.state = 'error';
            }
            if (throwError) {
                throw e;
            }
        }

        return this.$ as $$;
    }

    public get $(): RESULT<$$, DD> {
        const { defaultData, transform } = this.options;

        if (transform) {
            if (this.state === 'fetched') {
                const parent_$ =
                    this.parent?.options.transform?.(this._$) || this._$;

                return (transform(parent_$) || defaultData) as RESULT<$$, DD>;
            }

            return defaultData as RESULT<$$, DD>;
        }

        return (this._$ || defaultData) as RESULT<$$, DD>;
    }

    /** alias for this.$ */
    public get result() {
        return this.$;
    }

    public get source(): $ {
        return this._$;
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

    public match<T extends any>(handlers: {
        default?(): T;
        loading?(): T;
        fetched?(value: $$): T;
        empty?(): T;
        error?(e: Error): T;
    }): T | null {
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
            return handlers.fetched(this.$ as $$);
        }

        if (handlers.default) {
            return handlers.default();
        }

        return null;
    }

    public reset(value?: $, params?: P) {
        const cacheKey = this.getCacheKey(params);

        this._$ = value as $;
        this.error = undefined;
        this.xhr = undefined;
        this.requestParams = undefined;
        this.state = isEmpty(value) ? undefined : 'fetched';

        if (cacheKey) {
            cache[cacheKey] = undefined;
        }

        if (this.options.metadata && value) {
            this._metadata = this.options.metadata(value);
        }
    }

    public didFetch<T = any>(cb: ($: RESULT<$$, DD>) => T) {
        if (this.fetched) {
            return cb(this.$);
        }

        return null;
    }

    public async when(): Promise<$$> {
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

        return this.$ as $$;
    }

    /**
     * Return a new copy of the wrap-request with a transformed `$` / `result`
     */
    public pipe<NEW_$$ = any>(transform: ($: RESULT<$$, DD>) => NEW_$$) {
        const { defaultData, ...restOptions } = this.options;

        const wr = new WrapRequest<
            $,
            P,
            NEW_$$,
            MD,
            $ extends undefined ? NEW_$$ | undefined : NEW_$$
        >(this.req, {
            ...restOptions,
            transform: transform as any
        });

        const propBlackList = ['options', 'parent'];

        Object.keys(this).forEach((rawKey) => {
            const key: keyof WrapRequest = rawKey as any;

            if (!propBlackList.includes(key)) {
                Object.defineProperty(wr, key, {
                    get: () => {
                        return this[key];
                    },
                    set: (newVal) => {
                        Object.assign(this, { [key]: newVal });
                    }
                });
            }
        });

        wr.parent = this;

        return wr;
    }

    public disposeCache() {
        const key = this.getCacheKey(this.requestParams);

        if (key) {
            delete cache[key];
        }
    }
}

/**
 * @param request The request to perform when calling `wrapRequest.request`
 * @param options {Options}
 */
export function wrapRequest<
    $ /* result */,
    P = any /* request-parameters */,
    $$ = $ /* piped result */,
    MD = any /* meta-data */,
    DD extends $ | undefined = undefined /* default-data */
>(request: RequestFn<$, P>, options?: Options<$, MD, DD>) {
    return new WrapRequest<$, P, $$, MD, DD>(request, options);
}

type StreamFn<$, P> = (
    update: ($: $) => void,
    resolve: ($: $) => void,
    params: P
) => Promise<void> | void;

type StreamType = 'update' | 'resolve';
type StreamHandler<$> = (val: $) => void;
type StreamUnsubscribe = () => void;

export class WrapRequestStream<$, P> extends WrapRequest<$, P> {
    private listeners: { type: StreamType; cb: StreamHandler<$> }[] = [];

    constructor(request: StreamFn<$, P>) {
        super((params, { context }) => {
            return new Promise((resolve, reject) => {
                try {
                    request(
                        (val) => {
                            context._$ = val;

                            this.invokeUpdate(val);
                        },
                        (val) => {
                            this.invokeResolve(val);
                            resolve(val);
                        },
                        params
                    );
                } catch (e) {
                    reject(e);
                }
            });
        });
    }

    public on(type: StreamType, cb: StreamHandler<$>): StreamUnsubscribe {
        const listener = { type, cb };

        this.listeners = [...this.listeners, listener];

        return () => {
            this.listeners = this.listeners.filter((l) => l === listener);
        };
    }

    private invokeUpdate(val: $) {
        this.listeners
            .filter(({ type }) => type === 'update')
            .forEach(({ cb }) => cb(val));
    }

    private invokeResolve(val: $) {
        this.listeners
            .filter(({ type }) => type === 'resolve')
            .forEach(({ cb }) => cb(val));

        this.listeners = [];
    }
}

wrapRequest.stream = function <$, P extends any = undefined>(
    request: StreamFn<$, P>
) {
    return new WrapRequestStream<$, P>(request);
};
