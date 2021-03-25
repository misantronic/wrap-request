export declare type WrapRequestState = 'loading' | 'fetched' | 'error';
interface Options<$, $$, MD> {
    /** set a default value for `wrapRequest.$` e.g. `[]` */
    defaultData?: any;
    /** when provided, the result will be globally cached  */
    cacheKey?: string;
    /**
     * @deprecated
     * use pipe instead
     */
    transform?: ($: $) => $$;
    /** a function which return value will be set as metadata */
    metadata?: ($: $) => MD;
}
interface RequestOptions {
    stateLoading?: boolean;
    throwError?: boolean;
    context: WrapRequest;
    __ignoreXhrVersion__?: boolean;
}
declare type RequestFn<$, P> = (params: P, options: RequestOptions) => Promise<$>;
export declare const __wrapRequestDebug__: {
    cache: {
        clear: () => void;
        contents: {
            [key: string]: any;
        };
    };
    wrapRequests: WrapRequest<any, any, any, any>[];
};
declare type RESULT<$, $$> = $$ extends any ? $$ : $;
export declare class WrapRequest<$ = any, $$ = $, P = any, MD = any> {
    _$: $;
    error?: Error;
    state?: WrapRequestState;
    requestParams?: P;
    xhr?: Promise<$>;
    private xhrVersion;
    private _metadata?;
    private options;
    private req;
    constructor(req: RequestFn<$, P>, options?: Options<$, $$, MD>);
    private getCacheKey;
    private getCachedData;
    private checkXhrVersion;
    request(...[params, options]: P extends undefined ? [undefined?, Omit<RequestOptions, 'context'>?] : [P, Omit<RequestOptions, 'context'>?]): Promise<RESULT<$, $$>>;
    get $(): RESULT<$, $$>;
    /** alias for this.$ */
    get result(): RESULT<$, $$>;
    get source(): $;
    get metadata(): MD | undefined;
    get loading(): boolean;
    set loading(value: boolean);
    get fetched(): boolean;
    set fetched(value: boolean);
    get empty(): boolean;
    match(handlers: {
        default?(): any;
        loading?(): any;
        fetched?(value: RESULT<$, $$>): any;
        empty?(): any;
        error?(e: Error): any;
    }): any;
    reset(value?: $, params?: P): void;
    didFetch<T = any>(cb: ($: RESULT<$, $$>) => T): T | null;
    when(): Promise<RESULT<$, $$>>;
    /**
     * Return a new copy of the wrap-request with a transformed `$` / `result`
     */
    pipe<NEW_$$ = any>(transform: ($: RESULT<$, $$>) => NEW_$$): WrapRequest<$, NEW_$$, P, MD>;
    disposeCache(key?: string): void;
}
/**
 * @param request The request to perform when calling `wrapRequest.request`
 * @param options {Options}
 */
export declare function wrapRequest<$, $$ = $, P = any, MD = any>(request: RequestFn<$, P>, options?: Options<$, $$, MD>): WrapRequest<$, $$, P, MD>;
export {};
