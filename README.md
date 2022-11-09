# wrap-request

a request wrapper for asynchronous operations

## basic usage

```js
const wrappedXhr = wrapRequest((config) => fetch('...'));

const { loading, fetched, error } = wrappedXhr;

const result = await wrappedXhr.request({ id: 1 });
```

## pattern matching

based on the [tc39-proposal for pattern matching](https://github.com/tc39/proposal-pattern-matching) you can display all states that your wrap-requests might enter.

```js
const wrappedXhr = wrapRequest((config) => fetch('...'));

wrappedXhr.match({
    loading: () => 'Loading...',
    error: (e) => e.message,
    empty: () => 'No data.',
    fetched: (res) => res.data,
    default: () => 'Nothing to display'
});
```

### react example

```js
const MyComponent = () => {
    return wrappedXhr.match({
        loading: () => 'Loading...',
        error: (e) => e.message,
        empty: () => 'No data.',
        fetched: (res) => res.data,
        default: () => 'Nothing to display'
    });
};
```

## default data

especially when dealing with lists it comes in handy to set a default value.

```js
const wrappedXhr = wrapRequest(() => fetch('...'), { defaultData: [] });
```

## pipe

sometimes it is useful, to directly pipe the result and keep a copy of the original data in the wrapper.

```js
const wrappedXhr = wrapRequest(() => fetch('...'), {
    defaultData: []
}).pipe((res) => res.slice(0, 15));

const result = await wrappedXhr.request();

console.log(result); // capped list containing 15 items
console.log(wrappedXhr.$); // same as result
console.log(wrappedXhr.source); // list containing all items
```

you can also chain or use pipes as often as you like:

```js
const wrappedXhr = wrapRequest(async () => [1, 2, 3, 4, 5], {
    defaultData: []
}).pipe((res) => res.map((num) => num.toString()));

await wrappedXhr.request();

const pipe1 = wrappedXhr.pipe((res) => res.slice(0, 2)); // [ '1', '2' ]
const pipe2 = pipe1.pipe((res) => res.slice(0, 1)); // [ '1' ]
const pipe3 = pipe2.pipe((res) => res[0]); // '1'
```

## reset

Reset all wrapper-values to its initial state.

```js
const wrappedXhr = wrapRequest(() => fetch('...'), {
    defaultData: []
});

await wrappedXhr.request();

wrappedXhr.reset();
```

## metadata

You can save any metadata on the wrapper to store further informations.

```js
const wrappedXhr = wrapRequest(() => fetch('...'), {
    metadata: (res) => ({
        fullName: `${res.firstname} ${res.lastname}`
    })
});

await wrappedXhr.request();

console.log(wrappedXhr.metadata);
```

## streaming

The nature of promises is to resolve data only once. In some cases you need to update resolve multiple times f.e. when working with websockets. Enter streaming.

```js
import websocket from 'my-websocket-lib';

const streamWr = wrapRequest.stream<{}, { id: string }>((update, resolve, params) => {
    websocket.on('update', updatedData => update(JSON.parse(updatedData)));
    websocket.on('close', () => resolve({}));
    websocket.connect(params.id);
});

streamWr.on('update', (data) => console.log('update', data));
streamWr.on('resolve', (data) => console.log('resolve', data));
streamWr.request({ id: 'ABCD1234HIJK' });
```

When working with `mobx-wrap-request`, all observable-values are updated when calling `update` / `resolve` that means when rendering data, you may not need events but receive streamlined updates in your component.

# react hook

There is an implementation for working with react-hooks inside your components. [react-wrap-request](https://github.com/misantronic/react-wrap-request)

# mobx dependency

wrap-request used to have a direct dependency on mobx. this was removed in 3.0.0
please use [mobx-wrap-request](https://github.com/misantronic/mobx-wrap-request) for further support.
