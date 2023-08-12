import { QueryObserver } from "@tanstack/react-query";
import { observable, runInAction } from "mobx";

export class MobxQuery {
    queryClient;
    reactQueryResult = observable({}, { deep: false });


    constructor(queryClient, options = {}) {
        this.queryClient = queryClient;
        const { _defaulted, ...defaultOptions } = this.queryClient.defaultQueryOptions(options);
        this.defaultOptions = defaultOptions;
    }

    query(options) {
        const opts = Object.assign({}, this.defaultOptions, options)
        if (this.observer) {
            this.observer.setOptions(opts);
        } else {
            const observer = (this.observer = new QueryObserver(
                this.queryClient,
                opts
            ));

            runInAction(() => Object.assign(this.reactQueryResult, observer.getCurrentResult()))
            this.subscription = observer.subscribe((result) => runInAction(() => Object.assign(this.reactQueryResult, result)))
        }
        return this.reactQueryResult;
    }

    dispose() {
        this.subscription?.();
        delete this.observer;
    }
}