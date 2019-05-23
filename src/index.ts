import { observable, computed } from 'mobx';

export type WrapRequestState = 'loading' | 'fetched' | 'error';

interface WrapRequestOptions<T = any, Y = any> {
    /** when provided, the result will be globally cached  */
    cacheKey?: string;
    /** a function which receives the request `$` and returns a new value */
    transform?: ($: T) => Y;
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
    @observable
    public error?: Error;

    @observable
    private _$!: T | X;

    @observable
    public transform?: (value: T | X) => Y;

    @observable
    private state?: WrapRequestState;

    private options: WrapRequestOptions = {};
    private req: (params?: U) => Promise<T>;

    constructor(
        req: (params?: U) => Promise<T>,
        $?: T | X,
        options?: WrapRequestOptions
    ) {
        this.req = req;
        this.options = options || {};
        this.transform = this.options.transform;

        if ($) {
            this._$ = $;
        }
    }

    public async request(params?: U) {
        const { cacheKey } = this.options;

        this.error = undefined;

        try {
            if (cacheKey && wrapRequestCache[cacheKey]) {
                this._$ = wrapRequestCache[cacheKey];

                this.state = 'fetched';
            } else {
                this.state = 'loading';
            }

            const result = await this.req(params);

            this._$ = result;
            this.state = 'fetched';

            if (cacheKey) {
                wrapRequestCache[cacheKey] = this.$;
            }
        } catch (e) {
            this.error = e;
            this.state = 'error';
        }

        return this.$;
    }

    @computed
    public get $(): T | X {
        if (this.transform) {
            return this.transform(this._$) as any;
        }

        return this._$;
    }

    /** alias for this.$ */
    public get result() {
        return this.$;
    }

    @computed
    public get source(): Z {
        return this._$ as any;
    }

    @computed
    public get loading() {
        return this.state === 'loading';
    }

    public set loading(value: boolean) {
        this.state = value ? 'loading' : undefined;
    }

    @computed
    public get fetched() {
        return this.state === 'fetched';
    }

    public set fetched(value: boolean) {
        this.state = value ? 'fetched' : undefined;
    }

    @computed
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

    public reset(value: T | X) {
        const { cacheKey } = this.options;

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
        if (!this.fetched) {
            return new Promise(resolve => {
                setTimeout(() => resolve(this.when()), 50);
            });
        }

        return this.$ as T;
    }
}

export function wrapRequest<T = any, U = any, X = undefined>(
    request: (params: U) => Promise<T>
): WrapRequest<T, U, X>;

export function wrapRequest<T = any, U = any, X = T>(
    request: (params: U) => Promise<T>,
    defaultData: T
): WrapRequest<T, U, X>;

export function wrapRequest<T = any, U = any, X = T, Y = any>(
    request: (params: U) => Promise<T>,
    defaultData: T,
    options?: WrapRequestOptions<T | X, Y>
): WrapRequest<Y, U, Y, Y, T>;

/**
 * @param request The request to perform when calling `wrapRequest.request`
 * @param defaultData set a default value for `wrapRequest.$` e.g. `[]`
 * @param options
 */
export function wrapRequest<T = any, U = any, X = any, Y = undefined>(
    request: (params?: U) => Promise<T>,
    defaultData?: T,
    options?: WrapRequestOptions<T | X, Y>
): WrapRequest<T, U> {
    return new WrapRequest<T, U, X, Y>(request, defaultData, options);
}
