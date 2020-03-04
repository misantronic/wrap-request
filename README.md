# wrap-request

a request wrapper for asynchronous operations 

## basic usage

```js
const wrappedXhr = wrapRequest(config => fetch('...'));

const { loading, fetched, error } = wrappedXhr;

const result = await wrappedXhr.request({ id: 1 });
```

## pattern matching

```js
const wrappedXhr = wrapRequest(config => fetch('...'));

wrappedXhr.match({
  loading: () => 'Loading...',
  error: e => e.message,
  empty: () => 'No data.',
  fetched: res => res.data,
})
```

## default data

especially when dealing with lists it comes in handy to set a default value.

```js
const wrappedXhr = wrapRequest(() => fetch('...'), { defaultData: [] });
```

## react hook

There is an implementation for working with react-hooks inside your components. [react-wrap-request](https://github.com/misantronic/react-wrap-request)

## mobx dependency

wrap-request used to have a direct dependency on mobx. this was removed in 3.0.0
please use [mobx-wrap-request](https://github.com/misantronic/mobx-wrap-request) for further support.
