import { wrapRequest, __wrapRequest__ } from '../';

interface Obj {
    id: number;
    name: string;
}

afterEach(() => {
    __wrapRequest__.cache.clear();
});

test('it should set loading state', () => {
    const wrap = wrapRequest(
        () => new Promise((resolve) => setTimeout(resolve, 0))
    );

    wrap.request();

    expect(wrap.fetched).toBeFalsy();
    expect(wrap.loading).toBeTruthy();
});

test('it should set fetched state', async () => {
    const wrap = wrapRequest(
        () => new Promise((resolve) => setTimeout(resolve, 0))
    );

    await wrap.request();

    expect(wrap.fetched).toBeTruthy();
    expect(wrap.loading).toBeFalsy();
});

test('it should set data', async () => {
    const wrap = wrapRequest(
        () =>
            new Promise<number>((resolve) => setTimeout(() => resolve(1337), 0))
    );

    const data = await wrap.request();

    expect(wrap.$).toEqual(1337);
    expect(data).toEqual(1337);
});

test('it should set request data without loading-state', async () => {
    const wrap = wrapRequest(
        () => new Promise((resolve) => setTimeout(() => resolve(1337), 0))
    );

    wrap.request({}, { stateLoading: false });

    expect(wrap.loading).toBeFalsy();
});

test('it should set error', async () => {
    const error = new Error('Error');
    const wrap = wrapRequest(
        () => new Promise((_, reject) => setTimeout(() => reject(error), 0))
    );

    await wrap.request();

    expect(wrap.error).toEqual(error);
});

test('it should match loading', async () => {
    const wrap = wrapRequest(
        () => new Promise((resolve) => setTimeout(() => resolve(1337), 0))
    );

    wrap.request();

    expect(
        wrap.match({
            loading: () => 'Loading',
            fetched: () => 'Fetched',
            empty: () => 'Empty',
            error: (e) => e.message
        })
    ).toEqual('Loading');
});

test('it should match fetched', async () => {
    const wrap = wrapRequest(
        () => new Promise((resolve) => setTimeout(() => resolve(1337), 0))
    );

    await wrap.request();

    expect(
        wrap.match({
            loading: () => 'Loading',
            fetched: () => 'Fetched',
            empty: () => 'Empty',
            error: (e) => e.message
        })
    ).toEqual('Fetched');
});

test('it should match empty', async () => {
    const wrap = wrapRequest(
        () => new Promise((resolve) => setTimeout(() => resolve([]), 0))
    );

    await wrap.request();

    expect(
        wrap.match({
            loading: () => 'Loading',
            fetched: () => 'Fetched',
            empty: () => 'Empty',
            error: (e) => e.message
        })
    ).toEqual('Empty');
});

test('it should match error', async () => {
    const wrap = wrapRequest(
        () =>
            new Promise((_, reject) =>
                setTimeout(() => reject(new Error('Error')), 0)
            )
    );

    await wrap.request();

    expect(
        wrap.match({
            loading: () => 'Loading',
            fetched: () => 'Fetched',
            empty: () => 'Empty',
            error: (e) => e.message
        })
    ).toEqual('Error');
});

test('it should invoke didFetch', async () => {
    const wrap = wrapRequest(
        () => new Promise((resolve) => setTimeout(() => resolve(1337), 0))
    );

    await wrap.request();

    const fetchedValue = wrap.didFetch((val) => `My val is ${val}`);

    expect(fetchedValue).toEqual('My val is 1337');
});

test('it should set default data', async () => {
    const wrap = wrapRequest(
        () =>
            new Promise<Obj[]>((resolve) =>
                setTimeout(() => resolve([{ id: 1, name: 'Foo' }]), 0)
            ),
        { defaultData: [] }
    );

    expect(wrap.$).toEqual([]);
});

test('it should not set default data when request errors', async () => {
    const wrap = wrapRequest(
        async (): Promise<any[]> => {
            throw new Error('Error');
        },
        { defaultData: [] }
    ).pipe((data) => data.filter((x) => x));

    await wrap.request();

    expect(wrap.$).toEqual(undefined);
});

test('it should transform data', async () => {
    const wrap = wrapRequest(
        () =>
            new Promise<Obj[]>((resolve) =>
                setTimeout(() => resolve([{ id: 1, name: 'Foo' }]), 0)
            ),
        { defaultData: [] }
    ).pipe((res) => res[0]);

    const data = await wrap.request();

    expect(wrap.$).toEqual({ id: 1, name: 'Foo' });
    expect(wrap.source).toEqual([{ id: 1, name: 'Foo' }]);
    expect(data).toEqual({ id: 1, name: 'Foo' });
});

test('it should fail to transform data', async () => {
    const wrap = wrapRequest(
        () =>
            new Promise<Obj[]>((_, reject) =>
                setTimeout(() => reject('Error'), 0)
            )
    ).pipe((res) => res?.[0]);

    await wrap.request();

    expect(wrap.$).toEqual(undefined);
});

test('it should transform data with different type', async () => {
    const wrap = wrapRequest(
        () =>
            new Promise<{ content: number[] }>((resolve) =>
                setTimeout(() => resolve({ content: [1, 2, 3] }), 0)
            ),
        { defaultData: { content: [] } }
    ).pipe((res) => res.content || []);

    const data = await wrap.request();

    expect(wrap.$).toEqual([1, 2, 3]);
    expect(data).toEqual([1, 2, 3]);
});

test('it should cache data', async () => {
    const wrap = wrapRequest(
        () =>
            new Promise<Obj>((resolve) =>
                setTimeout(() => resolve({ id: 1, name: 'Foo' }), 50)
            ),
        { cacheKey: 'test' }
    );

    await wrap.request();

    wrap.request();

    expect(wrap.fetched).toBeTruthy();
    expect(wrap.$).toEqual({ id: 1, name: 'Foo' });
});

test('it should ignore cache', async () => {
    let numRequest = 0;

    const result1 = { id: 1 };
    const result2 = { id: 2 };

    const wrap = wrapRequest(
        async () => (numRequest === 0 ? result1 : result2),
        {
            cacheKey: 'test'
        }
    );

    await wrap.request();

    numRequest++;

    await wrap.request(undefined, { ignoreCache: true });

    expect(wrap.$).toEqual(result2);
});

test('it should cache data with pipe', async () => {
    const wrap = wrapRequest(
        () =>
            new Promise<Obj>((resolve) =>
                setTimeout(() => resolve({ id: 1, name: 'Foo' }), 50)
            ),
        { cacheKey: 'test' }
    ).pipe((obj) => obj?.name);

    await wrap.request();

    wrap.request();

    expect(wrap.fetched).toBeTruthy();
    expect(wrap.$).toEqual('Foo');
});

test('it should cache data with parameters', async () => {
    const wrap = wrapRequest(
        () =>
            new Promise<Obj>((resolve) =>
                setTimeout(() => resolve({ id: 1, name: 'Foo' }), 50)
            ),
        { cacheKey: 'test' }
    );

    await wrap.request();

    wrap.request();

    expect(wrap.fetched).toBeTruthy();
    expect(wrap.$).toEqual({ id: 1, name: 'Foo' });
});

test('it should set default data from cache', async () => {
    const wrap = wrapRequest(
        () =>
            new Promise<Obj>((resolve) =>
                setTimeout(() => resolve({ id: 1, name: 'Foo' }), 50)
            ),
        { cacheKey: 'test' }
    );

    await wrap.request();

    const wrap2 = wrapRequest(
        () =>
            new Promise<Obj>((resolve) =>
                setTimeout(() => resolve({ id: 1, name: 'Foo' }), 50)
            ),
        { cacheKey: 'test' }
    );

    expect(wrap.fetched).toBeTruthy();
    expect(wrap2.$).toEqual({ id: 1, name: 'Foo' });
});

test('it should wait for result with `when` (request-first)', async () => {
    const wrap = wrapRequest(
        () =>
            new Promise<number>((resolve) => setTimeout(() => resolve(1337), 0))
    );

    const request = wrap.request();
    const xhr = wrap.when();

    await request;

    expect(await xhr).toEqual(1337);
});

test('it should wait for result with `when` (request-last)', async () => {
    const wrap = wrapRequest(
        () =>
            new Promise<number>((resolve) => setTimeout(() => resolve(1337), 0))
    );

    const xhr = wrap.when();
    const request = wrap.request();

    await request;

    expect(await xhr).toEqual(1337);
});

test('it should error with `when` (request-first)', async () => {
    const wrap = wrapRequest(() => {
        throw new Error('Error');
    });

    wrap.request();

    try {
        await wrap.when();
    } catch (e) {
        if (e instanceof Error) {
            expect(e.message).toEqual('Error');
        }
    }
});

test('it should error with `when` (request-last)', async () => {
    const wrap = wrapRequest(() => {
        throw new Error('Error');
    });

    wrap.when().catch((e) => expect(e.message).toEqual('Error'));

    wrap.request();
});

test('it should always resolve the latest request', async () => {
    const wrap = wrapRequest(async (config: { delay: number }) => {
        return new Promise<number>((resolve, reject) =>
            setTimeout(() => {
                if (config.delay === 30) {
                    reject('Error');
                } else {
                    resolve(config.delay);
                }
            }, config.delay)
        );
    });

    wrap.request({ delay: 10 });
    wrap.request({ delay: 30 });
    wrap.request({ delay: 25 });
    wrap.request({ delay: 5 });

    await wrap.when();

    expect(wrap.error).toBeFalsy();
    expect(wrap.$).toEqual(5);
});

function timeout(timeout: number): Promise<void> {
    return new Promise<void>((resolve) => setTimeout(() => resolve(), timeout));
}

test('it should always resolve the interim results when stateLoading is set to false', async () => {
    const wrap = wrapRequest(
        async ({ delay, data }: { delay: number; data: string }) => {
            await timeout(delay);
            return data;
        }
    );

    const options = { stateLoading: false };
    wrap.request({ delay: 20, data: 'first' }, options);

    await timeout(10);

    expect(wrap.error).toBeFalsy();
    expect(wrap.$).toEqual(undefined);

    wrap.request({ delay: 22, data: 'second' }, options);

    await timeout(12);
    expect(wrap.error).toBeFalsy();
    expect(wrap.$).toEqual('first');

    await timeout(10);

    expect(wrap.error).toBeFalsy();
    expect(wrap.$).toEqual('second');
});

test('it should not throw error without throwError', async () => {
    const wrap = wrapRequest(
        () =>
            new Promise((_resolve, reject) =>
                setTimeout(() => reject('1337'), 0)
            )
    );

    await wrap.request();

    expect(wrap.result).toBeFalsy();
});

test('it should not throw error without throwError', async () => {
    const wrap = wrapRequest(
        () =>
            new Promise((_resolve, reject) =>
                setTimeout(() => reject('1337'), 0)
            )
    );

    let error;
    try {
        await wrap.request();
    } catch (e) {
        error = e;
    }

    expect(error).toBeFalsy();
});

test('it should throw error throwError', async () => {
    const wrap = wrapRequest(
        () =>
            new Promise((_resolve, reject) =>
                setTimeout(() => reject('1337'), 0)
            )
    );

    let error;
    try {
        await wrap.request({}, { throwError: true });
    } catch (e) {
        error = e;
    }
    expect(error).toBeTruthy();
});

test('it should set metadata', async () => {
    const wrap = wrapRequest(async () => 5, {
        metadata: (res) => ({ num: res })
    });

    await wrap.request();

    expect(wrap.metadata!.num).toBe(5);
});

test('it should get metadata (and ignore the transformed value)', async () => {
    const wrap = wrapRequest(async () => [5], {
        metadata: (res) => ({ num: res[0] })
    }).pipe((res) => res?.[0]);

    await wrap.request();

    expect(wrap.$).toEqual(5);
    expect(wrap.metadata?.num).toEqual(5);
});

test('it should reset', async () => {
    const wrap = wrapRequest(async () => '', {});

    await wrap.request();

    wrap.reset();

    expect(wrap.xhr).toBeUndefined();
});

test('it should reset metadata', async () => {
    const wrap = wrapRequest(async () => [1, 2, 3], {
        metadata: (res) => res[0]
    });

    await wrap.request();

    wrap.reset([5]);

    expect(wrap.metadata).toBe(5);
});

test('it should set error', async () => {
    const wrap = wrapRequest(async () => {
        throw new Error('test');
    });

    await wrap.request();

    expect(wrap.error!.message).toBe('test');
});

test('it should reset error', async () => {
    const wrap = wrapRequest(async () => {
        throw new Error('test');
    });

    await wrap.request();

    wrap.reset(undefined);

    expect(wrap.error).toBeUndefined();
});

test('it should reset xhr', async () => {
    const wrap = wrapRequest(async () => '');

    await wrap.request();

    wrap.reset(undefined);

    expect(wrap.xhr).toBeUndefined();
});

test('it should reset requestParams', async () => {
    const wrap = wrapRequest(
        async (params: { timeout: number }) => params.timeout
    );

    await wrap.request({ timeout: 1 });

    wrap.reset(undefined);

    expect(wrap.requestParams).toBeUndefined();
});

test('it should access requestParams', () => {
    const wrap = wrapRequest(
        (params: { timeout: number }) =>
            new Promise((resolve) => setTimeout(resolve, params.timeout))
    );

    wrap.request({ timeout: 0 });

    expect(wrap.requestParams).toEqual({ timeout: 0 });
});

test('it should access source', async () => {
    const wrap = wrapRequest(async () => [1]).pipe((data) => data?.[0]);

    await wrap.request();

    expect(wrap.$).toEqual(1);
    expect(wrap.source).toEqual([1]);
});

test('it should access context', async () => {
    const wrap = wrapRequest<number>(
        async (params: { increase: number }, options) => {
            const prevValue = options.context.$ || 0;

            return prevValue + params.increase;
        }
    );

    await wrap.request({ increase: 1 });
    await wrap.request({ increase: 2 });
    await wrap.request({ increase: 3 });

    expect(wrap.$).toEqual(6);
});

test('it should pipe with result on unfetched', async () => {
    const wrap = wrapRequest(async () => [1, 2, 3], { defaultData: [] });

    wrap.request();

    const pipedWR = wrap.pipe((res) => res[0]);

    expect(wrap.$).toEqual([]);
    expect(pipedWR.loading).toBe(true);
    expect(pipedWR.fetched).toBe(false);
    expect(pipedWR.$).toEqual(undefined);
});

test('it should pipe with result (overwrite default data)', async () => {
    const wrap = wrapRequest(async () => [1, 2, 3], { defaultData: [] });

    wrap.request();

    const pipedWR = wrap.pipe((res) => res[0]);

    expect(wrap.$).toEqual([]);
    expect(pipedWR.loading).toBe(true);
    expect(pipedWR.fetched).toBe(false);
    expect(pipedWR.$).toEqual(undefined);
});

test('it should pipe without request', async () => {
    const wrap = wrapRequest(async () => [1, 2, 3]);
    const pipedWR = wrap.pipe((res) => res?.[0]);

    expect(pipedWR.loading).toBe(false);
    expect(pipedWR.fetched).toBe(false);
    expect(pipedWR.$).toEqual(undefined);
});

test('it should pipe after request', async () => {
    const wrap = wrapRequest(async () => [1, 2, 3]);

    await wrap.request();

    const pipedWR = wrap.pipe((res) => res?.[0]);

    expect(pipedWR.$).toBe(1);
    expect(pipedWR.source).toEqual([1, 2, 3]);
    expect(pipedWR.fetched).toBeTruthy();
    expect(pipedWR.loading).toBeFalsy();
});

test('it should pipe before request', async () => {
    const wrap = wrapRequest(async () => [1, 2, 3], { defaultData: [] }).pipe(
        (res) => res[0]
    );

    await wrap.request();

    expect(wrap.$).toBe(1);
    expect(wrap.source).toEqual([1, 2, 3]);
    expect(wrap.fetched).toBeTruthy();
    expect(wrap.loading).toBeFalsy();
});

test('it should pipe multiple times', async () => {
    const wrap = wrapRequest(async () => [1, 2, 3], { defaultData: [] }).pipe(
        (res) => res[0]
    );

    const strigifiedWrap = wrap.pipe((res) => res?.toString());

    await wrap.request();

    expect(wrap.source).toEqual([1, 2, 3]);
    expect(wrap.$).toEqual(1);
    expect(strigifiedWrap.$).toBe('1');
    expect(strigifiedWrap.source).toEqual([1, 2, 3]);
});

test('it should pipe with match (fetched)', async () => {
    const wrap = wrapRequest(async () => [1, 2, 3], { defaultData: [] });

    await wrap.request();

    const pipedWR = wrap.pipe((res) => res[0]);
    const match = pipedWR.match({
        fetched: (res) => res
    });

    expect(match).toEqual(1);
});

test('it should pipe with match (loading)', async () => {
    const wrap = wrapRequest(async () => [1, 2, 3], { defaultData: [] });

    wrap.request();

    const pipedWR = wrap.pipe((res) => res[0]);

    const match = pipedWR.match({
        loading: () => 'Loading'
    });

    expect(match).toEqual('Loading');
});

test('it should pipe with match (empty)', async () => {
    const wrap = wrapRequest(async () => [1, 2, 3]).pipe(() => []);

    await wrap.request();

    const match = wrap.match({
        empty: () => 'Empty'
    });

    expect(match).toEqual('Empty');
});

test('it should pipe with match (error)', async () => {
    const wrap = wrapRequest(async () => [1, 2, 3], { defaultData: [] });

    const pipedWR = wrap.pipe(() => {
        throw new Error('Error');
    });

    await pipedWR.request();

    const match = pipedWR.match({
        error: () => 'Error'
    });

    expect(match).toEqual('Error');
});

test('it should stream data', async () => {
    const wr = wrapRequest.stream<number[]>((update, resolve) => {
        setTimeout(() => update([1]), 100);
        setTimeout(() => update([1, 2]), 200);
        setTimeout(() => update([1, 2, 3]), 300);
        setTimeout(() => resolve([1, 2, 3, 4]), 500);
    });

    setTimeout(() => expect(wr.$).toEqual([1]), 150);
    setTimeout(() => expect(wr.$).toEqual([1, 2]), 250);
    setTimeout(() => expect(wr.$).toEqual([1, 2, 3]), 350);

    setTimeout(() => expect(wr.loading).toBeTruthy(), 100);

    const $ = await wr.request();

    expect($).toEqual([1, 2, 3, 4]);
    expect(wr.fetched).toBeTruthy();
});

test('it should stream with parameters', async () => {
    const wr = wrapRequest.stream<number, number>(
        (_update, resolve, params) => {
            resolve(params);
        }
    );

    await wr.request(1);

    expect(wr.$).toEqual(1);
});

test('it should stream data with error', async () => {
    const wr = wrapRequest.stream(() => {
        throw new Error('error 12');
    });

    await wr.request();

    expect(wr.error?.message).toEqual('error 12');
});

test('it should stream with events', async () => {
    const wr = wrapRequest.stream<number[]>((update, resolve) => {
        setTimeout(() => update([1]), 100);
        setTimeout(() => resolve([1, 2]), 200);
    });

    wr.on('update', (data) => expect(data).toEqual([1]));
    wr.on('resolve', (data) => expect(data).toEqual([1, 2]));

    await wr.request();
});
