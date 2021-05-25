import Database from "better-sqlite3";
import {CurrencyService} from "../../src/services/currency-service";
import {expect} from "chai";

describe('services', () => {
    describe('currency-service', () => {
        let baseDb: any;
        let db: any;
        let currencyService: CurrencyService;

        beforeEach(() => {
            baseDb = new Database('tests.db');
            const buffer = baseDb.serialize();
            baseDb.close();

            db = new Database(buffer);
            currencyService = new CurrencyService(db);
        });

        it('should return 100 for account 1', async () => {
            const account = '1';
            const expectedBalance = 100;

            const balance = await currencyService.getBalance(account);
            expect(balance).to.equal(expectedBalance);
        });

        afterEach(() => db.close());
    });
});
