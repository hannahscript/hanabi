import {Database, Statement} from "better-sqlite3";

export class CurrencyService {
    private readonly createWalletStm: Statement;
    private readonly getBalanceStm: Statement;
    private readonly removeBalanceIfExistsStm: Statement;
    private readonly transferBalanceIfExistsStm: Statement;

    constructor(private readonly db: Database) {
        this.createWalletStm = db.prepare('insert into wallets values ($userId, $balance)');
        this.getBalanceStm = db.prepare('select balance from wallets where user_id = $userId');
        this.transferBalanceIfExistsStm = db.prepare('update wallets set balance = iif((select balance from wallets where user_id = $originUserId) < $amount, balance, balance + $amount) where user_id = $targetUserId');
        this.removeBalanceIfExistsStm = db.prepare('update wallets set balance = iif(balance < $amount, balance, balance - $amount) where user_id = $originUserId');
    }

    createWallet(userId: string, balance: number): boolean {
        try {
            this.createWalletStm.run({userId, balance});
        } catch (ex) {
            return false;
        }

        return true;
    }

    getBalance(userId: string): number | null {
        const result = this.getBalanceStm.get({userId});
        return result ? result.balance : null;
    }

    hasAccount(userId: string): boolean {
        return this.getBalance(userId) !== null;
    }

    transfer(originUserId: string, targetUserId: string, amount: number) {
        if (originUserId === targetUserId) {
            throw new Error('Can not transfer to same account');
        }

        if (amount <= 0) {
            throw new Error('Amount needs to be greater than zero');
        }

        (this.db.transaction(() => {
            this.transferBalanceIfExistsStm.run({originUserId, targetUserId, amount});
            this.removeBalanceIfExistsStm.run({originUserId, amount});
        }))();
    }
}
