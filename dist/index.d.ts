export declare type WrapRequestState = 'loading' | 'fetched' | 'error';
interface Options<$, $$, MD> {
    /** set a default value for `wrapRequest.$` e.g. `[]` */
    defaultData?: any;
    /** when provided, the result will be globally cached  */
    cacheKey?: string;
    /** a function which receives the request `$` and returns a new value */
    transform?: ($: $) => $$;
    /** a function which return value will be set as metadata */
    metadata?: ($: $) => MD;
}
interface RequestOptions<$, $$, P, MD> {
    stateLoading?: boolean;
    throwError?: boolean;
    context: WrapRequest<$, $$, P, MD>;
    __ignoreXhrVersion__?: boolean;
}
declare type RequestFn<$, $$, P, MD> = (params: P, options: RequestOptions<$, $$, P, MD>) => Promise<$>;
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
    transform?: (value: $) => $$;
    state?: WrapRequestState;
    requestParams?: P;
    xhr?: Promise<$>;
    private xhrVersion;
    private _metadata?;
    private options;
    private req;
    constructor(req: RequestFn<$, $$, P, MD>, options?: Options<$, $$, MD>);
    private getCacheKey;
    private getCachedData;
    private checkXhrVersion;
    request(...[params, options]: P extends undefined ? [undefined?, Omit<RequestOptions<$, $$, P, MD>, 'context'>?] : [P, Omit<RequestOptions<$, $$, P, MD>, 'context'>?]): Promise<RESULT<$, $$>>;
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
    disposeCache(key?: string): void;
}
/**
 * @param request The request to perform when calling `wrapRequest.request`
 * @param options {Options}
 */
export declare function wrapRequest<$, $$ = $, P = any, MD = any>(request: RequestFn<$, $$, P, MD>, options?: Options<$, $$, MD>): WrapRequest<$, $$, P, MD>;
export {};
