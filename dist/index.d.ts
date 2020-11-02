export declare type WrapRequestState = 'loading' | 'fetched' | 'error';
interface WrapRequestOptions<T = any, Y = any, M = any> {
    /** set a default value for `wrapRequest.$` e.g. `[]` */
    defaultData?: T;
    /** when provided, the result will be globally cached  */
    cacheKey?: string;
    /** a function which receives the request `$` and returns a new value */
    transform?: ($: T) => Y;
    /** a function which return value will be set as metadata */
    metadata?: ($: T) => M;
}
interface WrapRequestRequestOptions {
    stateLoading?: boolean;
    throwError?: boolean;
    __ignoreXhrVersion__?: boolean;
}
export declare class WrapRequest<T = any, U = any, X = any, Y = any, Z = T | X, M = any> {
    _$: T | X;
    error?: Error;
    transform?: (value: T | X) => Y;
    state?: WrapRequestState;
    requestParams?: U;
    xhr?: Promise<T | X>;
    private xhrVersion;
    private _metadata?;
    private options;
    private req;
    constructor(req: (params?: U) => Promise<T>, options?: WrapRequestOptions);
    private getCacheKey;
    private getCachedData;
    private checkXhrVersion;
    request(params?: U, { stateLoading, throwError, __ignoreXhrVersion__ }?: WrapRequestRequestOptions): Promise<T | X>;
    get $(): T | X;
    set $(value: T | X);
    /** alias for this.$ */
    get result(): T | X;
    /** alias for this.$ */
    set result(value: T | X);
    get source(): Z;
    get metadata(): M | undefined;
    get loading(): boolean;
    set loading(value: boolean);
    get fetched(): boolean;
    set fetched(value: boolean);
    get empty(): boolean;
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
export declare function wrapRequest<T = any, U = any, X = undefined, M = any>(request: (params: U, options?: WrapRequestRequestOptions) => Promise<T>): WrapRequest<T, U, X, T | X, M>;
export declare function wrapRequest<T = any, U = any, X = T, Y = T, M = any>(request: (params: U, options?: WrapRequestRequestOptions) => Promise<T>, options?: WrapRequestOptions<T & X, Y, M>): WrapRequest<Y, U, Y, Y, Y, M>;
export {};
