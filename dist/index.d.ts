export declare type WrapRequestState = 'loading' | 'fetched' | 'error';
export interface Options<$, MD> {
    /** set a default value for `wrapRequest.$` e.g. `[]` */
    defaultData?: any;
    /** when provided, the result will be globally cached  */
    cacheKey?: string;
    /** a function which return value will be set as metadata */
    metadata?: ($: $) => MD;
}
interface InternalOptions<$, $$, MD> extends Options<$, MD> {
    transform?: ($: $) => $$;
}
export interface RequestOptions {
    stateLoading?: boolean;
    throwError?: boolean;
    ignoreCache?: boolean;
    context: WrapRequest;
    __ignoreXhrVersion__?: boolean;
}
export declare type RequestFn<$, P> = (params: P, options: RequestOptions) => Promise<$>;
export declare const __wrapRequestDebug__: {
    wrapRequests: WrapRequest<any, any, any, any>[];
};
export declare const __wrapRequest__: {
    cache: {
        clear: () => void;
        contents: {
            [key: string]: any;
        };
    };
};
declare type RESULT<$, $$> = $$ extends any ? $$ : $;
export declare class WrapRequest<$ = any, P = any, $$ = $, MD = any> {
    _$: $;
    error?: Error;
    state?: WrapRequestState;
    requestParams?: P;
    xhr?: Promise<$>;
    private xhrVersion;
    private _metadata?;
    private options;
    private req;
    private parent?;
    constructor(req: RequestFn<$, P>, options?: InternalOptions<$, $$, MD>);
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
    match<T extends any>(handlers: {
        default?(): T;
        loading?(): T;
        fetched?(value: RESULT<$, $$>): T;
        empty?(): T;
        error?(e: Error): T;
    }): T | null;
    reset(value?: $, params?: P): void;
    didFetch<T = any>(cb: ($: RESULT<$, $$>) => T): T | null;
    when(): Promise<RESULT<$, $$>>;
    /**
     * Return a new copy of the wrap-request with a transformed `$` / `result`
     */
    pipe<NEW_$$ = any>(transform: ($: RESULT<$, $$>) => NEW_$$): WrapRequest<$, P, NEW_$$, MD>;
    disposeCache(): void;
}
/**
 * @param request The request to perform when calling `wrapRequest.request`
 * @param options {Options}
 */
export declare function wrapRequest<$, P = any, $$ = $, MD = any>(request: RequestFn<$, P>, options?: Options<$, MD>): WrapRequest<$, P, $$, MD>;
export declare namespace wrapRequest {
    var stream: <$, P extends unknown = undefined>(request: StreamFn<$, P>) => WrapRequestStream<$, P>;
}
declare type StreamFn<$, P> = (update: ($: $) => void, resolve: ($: $) => void, params: P) => Promise<void> | void;
declare type StreamType = 'update' | 'resolve';
declare type StreamHandler<$> = (val: $) => void;
declare type StreamUnsubscribe = () => void;
export declare class WrapRequestStream<$, P> extends WrapRequest<$, P> {
    private listeners;
    constructor(request: StreamFn<$, P>);
    on(type: StreamType, cb: StreamHandler<$>): StreamUnsubscribe;
    private invokeUpdate;
    private invokeResolve;
}
export {};
