import { wrapRequest } from '../';

interface Obj {
    id: number;
    name: string;
}

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
        () => new Promise((resolve) => setTimeout(() => resolve(1337), 0))
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
            error: (e) => e
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
            error: (e) => e
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
            error: (e) => e
        })
    ).toEqual('Empty');
});

test('it should match error', async () => {
    const wrap = wrapRequest(
        () => new Promise((_, reject) => setTimeout(() => reject('Error'), 0))
    );

    await wrap.request();

    expect(
        wrap.match({
            loading: () => 'Loading',
            fetched: () => 'Fetched',
            empty: () => 'Empty',
            error: (e) => e
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

test('it should transform data', async () => {
    const wrap = wrapRequest(
        () =>
            new Promise<Obj[]>((resolve) =>
                setTimeout(() => resolve([{ id: 1, name: 'Foo' }]), 0)
            ),
        { defaultData: [], transform: (res) => res[0] }
    );

    const data = await wrap.request({ id: 1 });

    expect(wrap.$).toEqual({ id: 1, name: 'Foo' });
    expect(data).toEqual({ id: 1, name: 'Foo' });
});

test('it should fail to transform data', async () => {
    const wrap = wrapRequest(
        () =>
            new Promise<Obj[]>((_, reject) =>
                setTimeout(() => reject('Error'), 0)
            ),
        { transform: (res) => res[0] }
    );

    await wrap.request({ id: 1 });

    expect(wrap.$).toEqual(undefined);
});

// TODO: make this typings run
// test('it should transform data with different type', async () => {
//     const wrap = wrapRequest(
//         () =>
//             new Promise<{ content: number[] }>((resolve) =>
//                 setTimeout(() => resolve({ content: [1, 2, 3] }), 0)
//             ),
//         { defaultData: [], transform: (res) => res.content || [] }
//     );
//
//     const data = await wrap.request();
//
//     expect(wrap.$).toEqual([1, 2, 3]);
//     expect(data).toEqual([1, 2, 3]);
// });

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

test('it should cache data with parameters', async () => {
    const wrap = wrapRequest(
        () =>
            new Promise<Obj>((resolve) =>
                setTimeout(() => resolve({ id: 1, name: 'Foo' }), 50)
            ),
        { cacheKey: 'test' }
    );

    await wrap.request({ id: 1 });

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

    await wrap.request({ id: 1 });

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

test('it should wait for result with `when`', async () => {
    const wrap = wrapRequest(
        () =>
            new Promise<number>((resolve) => setTimeout(() => resolve(1337), 0))
    );

    const request = wrap.request();
    const xhr = wrap.when();

    await request;

    expect(await xhr).toEqual(1337);
});

test('it should error with `when`', async () => {
    const wrap = wrapRequest(() => {
        throw new Error('Error');
    });

    await wrap.request();

    try {
        await wrap.when();
    } catch (e) {
        expect(e.message).toEqual('Error');
    }
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
        await wrap.request({});
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
        transform: (res) => res[0],
        metadata: (res) => ({ num: res })
    });

    await wrap.request();

    expect(wrap.$).toEqual(5);
    expect(wrap.metadata!.num).toEqual([5]);
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
