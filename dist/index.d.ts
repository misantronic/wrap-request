export declare type WrapRequestState = 'loading' | 'fetched' | 'error';
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
}
export declare class WrapRequest<T = any, U = any, X = any, Y = any, Z = T | X> {
    error?: Error;
    private _$;
    transform?: (value: T | X) => Y;
    private state?;
    private options;
    private req;
    constructor(req: (params?: U) => Promise<T>, options?: WrapRequestOptions);
    private getCacheKey;
    request(params?: U, options?: WrapRequestRequestOptions): Promise<T | X>;
    $: T | X;
    /** alias for this.$ */
    /** alias for this.$ */
    result: T | X;
    readonly source: Z;
    loading: boolean;
    fetched: boolean;
    readonly empty: boolean;
    match(handlers: {
        default?(): any;
        loading?(): any;
        fetched?(value: T): any;
        empty?(): any;
        error?(e: Error): any;
    }): any;
    reset(value: T | X, params?: U): void;
    didFetch<R = any>(cb: ($: T) => R): R | null;
    when(): Promise<T>;
    disposeCache(key?: string): void;
}
export declare function wrapRequest<T = any, U = any, X = undefined>(request: (params: U) => Promise<T>): WrapRequest<T, U, X>;
export declare function wrapRequest<T = any, U = any, X = T, Y = T>(request: (params: U) => Promise<T>, options?: WrapRequestOptions<T & X, Y>): WrapRequest<Y, U, Y, Y, Y>;
export {};
