import {CurrencyService} from "./currency-service";
import {Database} from "better-sqlite3";

export interface Services {
    currency: CurrencyService;
}

export function setUpServices(db: Database): Services {
    return {
        currency: new CurrencyService(db)
    };
}
