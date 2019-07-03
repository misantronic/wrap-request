import { computed, decorate, observable } from 'mobx';
import { WrapRequest } from '.';

export function decorateWithMobx() {
    decorate(WrapRequest, {
        _$: observable,
        $: computed,
        error: observable,
        transform: observable,
        state: observable,
        source: computed,
        loading: computed,
        fetched: computed,
        empty: computed
    });
}
