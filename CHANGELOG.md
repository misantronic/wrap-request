# Changelog

All notable changes to this project will be documented in this file. See [standard-version](https://github.com/conventional-changelog/standard-version) for commit guidelines.

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
