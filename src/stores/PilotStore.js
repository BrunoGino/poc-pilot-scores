import { makeAutoObservable } from "mobx"
import { MobxQuery } from "../infra/mobx/MobxQuery";
import { data as apiData } from '../data';


function wait(duration) {
    return new Promise(resolve => setTimeout(resolve, duration))
}

export class PilotStore {
    queryClient;
    pilotQueryResult;

    constructor(queryClient) {
        this.queryClient = queryClient;
        this.pilotQueryResult = new MobxQuery(queryClient, {
            queryFn: () => wait(5000).then(() => apiData),
        })
    }

    get pilots() {
        return this.pilotQueryResult.query({
            queryKey: ['pilots']
        })
    }

    get flatData() {
        return this.pilots?.data.flatMap(d => d.cars.map(c => ({ name: d.name, brand: c.brand, year: c.year, plate: c.plate, ...Object.values(c.prizes) })))
    }

    dispose() {
        this.pilotQueryResult.dispose();
    }

}