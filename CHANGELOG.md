# Changelog

All notable changes to this project will be documented in this file. See [standard-version](https://github.com/conventional-changelog/standard-version) for commit guidelines.

### [7.2.1](https://github.com/misantronic/wrap-request/compare/v7.2.0...v7.2.1) (2024-06-04)


### Bug Fixes

* disable error-handling notification when error is thrown ([9b3a30d](https://github.com/misantronic/wrap-request/commit/9b3a30dbbed5fffd2813a8f378e24f705a06ff8f))

## [7.2.0](https://github.com/misantronic/wrap-request/compare/v7.0.7...v7.2.0) (2024-06-04)


### Features

* add optional unhandled error-notification ([c86b488](https://github.com/misantronic/wrap-request/commit/c86b488d8964e97a68c9b9a2eda6de53cf228119))

### [7.0.7](https://github.com/misantronic/wrap-request/compare/v7.0.6...v7.0.7) (2024-04-23)


### Bug Fixes

* set state in reset depending on passed `value` -> remove `isEmpty`-check ([a8473ee](https://github.com/misantronic/wrap-request/commit/a8473eef983f06dd46259cd5bf8e5b54ed3d6b6e))

### [7.0.6](https://github.com/misantronic/wrap-request/compare/v7.0.5...v7.0.6) (2023-06-09)


### Bug Fixes

* update return-type of `didFetch` ([eff137a](https://github.com/misantronic/wrap-request/commit/eff137a0d296e4e2d975e420b3c7b77bd855e4af))

### [7.0.5](https://github.com/misantronic/wrap-request/compare/v7.0.4...v7.0.5) (2023-06-05)


### Bug Fixes

* piping with default-data ([672423e](https://github.com/misantronic/wrap-request/commit/672423e9577bb51c97e7e189d15dea9b87f84ef9))

### [7.0.4](https://github.com/misantronic/wrap-request/compare/v7.0.3...v7.0.4) (2023-05-22)


### Bug Fixes

* respect falsy-values when accessing `$` / `result` ([88fe72e](https://github.com/misantronic/wrap-request/commit/88fe72ea8cddeb624f1b22426b89e68e165fd108))

### [7.0.3](https://github.com/misantronic/wrap-request/compare/v7.0.2...v7.0.3) (2023-04-21)

### [7.0.2](https://github.com/misantronic/wrap-request/compare/v7.0.1...v7.0.2) (2023-04-21)

### [7.0.1](https://github.com/misantronic/wrap-request/compare/v7.0.0...v7.0.1) (2023-04-21)

## [7.0.0](https://github.com/misantronic/wrap-request/compare/v6.2.3...v7.0.0) (2023-04-20)


### ⚠ BREAKING CHANGES

* when `options.defaultData` is undefined, the result of a wrap-request can always be undefined.

### Features

* consider default-data in types ([2b5e80b](https://github.com/misantronic/wrap-request/commit/2b5e80bdde48df0f8fb4c36c9b107a1ff7484bb7))

### [6.2.3](https://github.com/misantronic/wrap-request/compare/v6.2.2...v6.2.3) (2023-03-13)


### Bug Fixes

* remove error-setting in transform/pipe-function ([7f3800b](https://github.com/misantronic/wrap-request/commit/7f3800b78a1a95de733b3b58fa75cf2427d60f65))

### [6.2.2](https://github.com/misantronic/wrap-request/compare/v6.2.1...v6.2.2) (2022-11-09)


### Bug Fixes

* improve `wrapRequest.stream` with events ([aa7e7b1](https://github.com/misantronic/wrap-request/commit/aa7e7b1f075f2ada433fb0c3338cc0387252acab))

### [6.2.1](https://github.com/misantronic/wrap-request/compare/v6.2.0...v6.2.1) (2022-11-08)


### Bug Fixes

* add parameters to wrapRequest.stream ([624d5f0](https://github.com/misantronic/wrap-request/commit/624d5f0fdb899c940cd0ad7c3cb6980c3c68d78e))

## [6.2.0](https://github.com/misantronic/wrap-request/compare/v6.1.0...v6.2.0) (2022-11-08)


### Features

* add first version of `wrapRequest.stream` ([1c6630f](https://github.com/misantronic/wrap-request/commit/1c6630fcd94e3d77ee7074d0dd9ddcb026471471))

## [6.1.0](https://github.com/misantronic/wrap-request/compare/v6.0.5...v6.1.0) (2022-09-30)


### Features

* add `ignore-cache`-option to request; optimize `disposeCache`-method ([20fabae](https://github.com/misantronic/wrap-request/commit/20fabaeb7c1548fb93f17e0105e578258da09c4b))

### [6.0.5](https://github.com/misantronic/wrap-request/compare/v6.0.4...v6.0.5) (2022-09-20)


### Bug Fixes

* pipe state-dependant return-value ([87f49ae](https://github.com/misantronic/wrap-request/commit/87f49aee40dd9885fb84d2b5d262ca0dd8a8a1c1))

### [6.0.4](https://github.com/misantronic/wrap-request/compare/v6.0.3...v6.0.4) (2022-09-20)

### [6.0.3](https://github.com/misantronic/wrap-request/compare/v6.0.2...v6.0.3) (2022-09-20)


### Bug Fixes

* check on fetched-state when piping / transforming data ([8143380](https://github.com/misantronic/wrap-request/commit/814338044ada2233fd2a858f9b710192e56a16b9))

### [6.0.2](https://github.com/misantronic/wrap-request/compare/v6.0.1...v6.0.2) (2022-09-09)

### [6.0.1](https://github.com/misantronic/wrap-request/compare/v6.0.0...v6.0.1) (2022-09-09)

## 6.0.0 (2022-09-08)


### ⚠ BREAKING CHANGES

* switch order of generics
* remove setter for `$` and `result`; use `reset` instead
* move transform-parameter to options

### Features

* improved match return typings ([d4226a4](https://github.com/misantronic/wrap-request/commit/d4226a4a10554e60209e7bc0d131bc8d64386311))


### Bug Fixes

* correct default-data typings ([ec1c3e9](https://github.com/misantronic/wrap-request/commit/ec1c3e97c48a820de31d88e3775127acdfd800bf))
* differentiated check for xhr version ([54c5dbc](https://github.com/misantronic/wrap-request/commit/54c5dbc65ffd18e9a7495bc4dfe3d1e9a746b306))
* disable fallthrough to `_$` when `transform` ([a01ba4a](https://github.com/misantronic/wrap-request/commit/a01ba4a3685095900c41c7fe4ef7927a0de628ab))
* fix issue with `pipe` and using `match` ([ccfca3e](https://github.com/misantronic/wrap-request/commit/ccfca3e3636b33ebdd07f3f56c62b1d48b09eddf))
* further improve `pipe` ([03a8155](https://github.com/misantronic/wrap-request/commit/03a8155b0c2179e3b677de4aeedf6c9ec605e065))
* output `pipe`-result only when state is fetched ([e874b86](https://github.com/misantronic/wrap-request/commit/e874b860dc4e6a97558f654c1ae94206166fe294))
* remove cache-key on `reset` ([e51688e](https://github.com/misantronic/wrap-request/commit/e51688eccfcb92cce3a9cc9e6a22aaf444b65e75))
* treat `result` equal to `$` in `pipe`-result ([d9d3a1e](https://github.com/misantronic/wrap-request/commit/d9d3a1e9fa774b226ea8b6b201fb0e891356f1dc))


* switch order of generics ([340a32b](https://github.com/misantronic/wrap-request/commit/340a32b9032addb6c940440b3ce4d102d24222d8))
* rewrite typings and generics ([dc37bbf](https://github.com/misantronic/wrap-request/commit/dc37bbfed6e43dc39085a05c018b008dc464d609))
* add wrapRequest-options and caching ([a1deb3e](https://github.com/misantronic/wrap-request/commit/a1deb3e193a7b60a214d139b6f9613c1765715c0))

## [5.2.0](https://github.com/misantronic/wrap-request/compare/v5.1.9...v5.2.0) (2021-09-27)


### Features

* improved match return typings ([d4226a4](https://github.com/misantronic/wrap-request/commit/d4226a4a10554e60209e7bc0d131bc8d64386311))

### [5.1.9](https://github.com/misantronic/wrap-request/compare/v5.1.8...v5.1.9) (2021-07-09)


### Bug Fixes

* remove cache-key on `reset` ([e51688e](https://github.com/misantronic/wrap-request/commit/e51688eccfcb92cce3a9cc9e6a22aaf444b65e75))

### [5.1.8](https://github.com/misantronic/wrap-request/compare/v5.1.7...v5.1.8) (2021-05-31)

### [5.1.7](https://github.com/misantronic/wrap-request/compare/v5.1.6...v5.1.7) (2021-05-28)


### Bug Fixes

* further improve `pipe` ([03a8155](https://github.com/misantronic/wrap-request/commit/03a8155b0c2179e3b677de4aeedf6c9ec605e065))

### [5.1.6](https://github.com/misantronic/wrap-request/compare/v5.1.5...v5.1.6) (2021-05-28)


### Bug Fixes

* output `pipe`-result only when state is fetched ([e874b86](https://github.com/misantronic/wrap-request/commit/e874b860dc4e6a97558f654c1ae94206166fe294))

### [5.1.5](https://github.com/misantronic/wrap-request/compare/v5.1.3...v5.1.5) (2021-05-27)


### Bug Fixes

* fix issue with `pipe` and using `match` ([ccfca3e](https://github.com/misantronic/wrap-request/commit/ccfca3e3636b33ebdd07f3f56c62b1d48b09eddf))

### [5.1.3](https://github.com/misantronic/wrap-request/compare/v5.1.2...v5.1.3) (2021-03-25)


### Bug Fixes

* treat `result` equal to `$` in `pipe`-result ([d9d3a1e](https://github.com/misantronic/wrap-request/commit/d9d3a1e9fa774b226ea8b6b201fb0e891356f1dc))

### [5.1.2](https://github.com/misantronic/wrap-request/compare/v5.1.1...v5.1.2) (2021-03-25)

### [5.1.1](https://github.com/misantronic/wrap-request/compare/v5.0.5...v5.1.1) (2021-03-24)


### Bug Fixes

* disable fallthrough to `_$` when `transform` ([a01ba4a](https://github.com/misantronic/wrap-request/commit/a01ba4a3685095900c41c7fe4ef7927a0de628ab))

### [5.0.5](https://github.com/misantronic/wrap-request/compare/v6.0.0...v5.0.5) (2021-02-26)

## [5.0.4](https://github.com/misantronic/wrap-request/compare/v1.0.1...v5.0.4) (2021-02-26)


### ⚠ BREAKING CHANGES

* remove setter for `$` and `result`; use `reset` instead
* move transform-parameter to options

### Bug Fixes

* correct default-data typings ([ec1c3e9](https://github.com/misantronic/wrap-request/commit/ec1c3e97c48a820de31d88e3775127acdfd800bf))
* differentiated check for xhr version ([54c5dbc](https://github.com/misantronic/wrap-request/commit/54c5dbc65ffd18e9a7495bc4dfe3d1e9a746b306))


* rewrite typings and generics ([dc37bbf](https://github.com/misantronic/wrap-request/commit/dc37bbfed6e43dc39085a05c018b008dc464d609))
* add wrapRequest-options and caching ([a1deb3e](https://github.com/misantronic/wrap-request/commit/a1deb3e193a7b60a214d139b6f9613c1765715c0))
