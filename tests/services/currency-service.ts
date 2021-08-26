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

        afterEach(() => db.close());

        describe('createWallet', () => {
            it('should return false for already-existing account 1', () => {
                const account = '1';
                const balance = 100;

                const success = currencyService.createWallet(account, balance);
                expect(success).to.be.false;
            });

            it('should return true for non-existent account 999 and afterwards, getBalance should succeed', () => {
                const account = '999';
                const balance = 100;

                const success = currencyService.createWallet(account, balance);
                const actualBalance = currencyService.getBalance(account);

                expect(success).to.be.true;
                expect(actualBalance).to.equal(balance);
            });
        });

        describe('getBalance', () => {
            it('should return 100 for account 1', async () => {
                const account = '1';
                const expectedBalance = 100;

                const balance = await currencyService.getBalance(account);
                expect(balance).to.equal(expectedBalance);
            });

            it('should return null for non-existent account 999', () => {
                const account = '999';
                const expectedBalance = null;

                const balance = currencyService.getBalance(account);
                expect(balance).to.equal(expectedBalance);
            });
        });

        describe('hasAccount', () => {
            it('should return true for account 1', async () => {
                const account = '1';

                const accountExists = currencyService.hasAccount(account);
                expect(accountExists).to.be.true;
            });

            it('should return false for non-existent account 999', async () => {
                const account = '999';

                const accountExists = currencyService.hasAccount(account);
                expect(accountExists).to.be.false;
            });
        });
    });
});
