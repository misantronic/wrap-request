export declare type WrapRequestState = 'loading' | 'fetched' | 'error';
interface WrapRequestOptions<T = any, Y = any> {
    /** when provided, the result will globally cached  */
    cacheKey?: string;
    /** a function which receives the request `$` and returns a new value */
    transform?: ($: T) => Y;
}
export declare class WrapRequest<T = any, U = any, X = any, Y = any, Z = T | X> {
    error?: Error;
    private _$;
    transform?: (value: T | X) => Y;
    private state?;
    private options;
    private req;
    constructor(req: (params?: U) => Promise<T>, $?: T | X, options?: WrapRequestOptions);
    request(params?: U): Promise<T | X>;
    readonly $: T | X;
    /** alias for this.$ */
    readonly result: T | X;
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
    reset(value: T | X): void;
    didFetch<R = any>(cb: ($: T) => R): R | null;
    when(): Promise<T>;
}
export declare function wrapRequest<T = any, U = any, X = undefined>(request: (params: U) => Promise<T>): WrapRequest<T, U, X>;
export declare function wrapRequest<T = any, U = any, X = T>(request: (params: U) => Promise<T>, defaultData: T): WrapRequest<T, U, X>;
export declare function wrapRequest<T = any, U = any, X = T, Y = any>(request: (params: U) => Promise<T>, defaultData: T, options?: WrapRequestOptions<T | X, Y>): WrapRequest<Y, U, Y, Y, T>;
export {};
