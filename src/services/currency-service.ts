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

    async createWallet(userId: string, balance: number): Promise<boolean> {
        try {
            this.createWalletStm.run({userId, balance});
        } catch (ex) {
            return false;
        }

        return true;
    }

    async getBalance(userId: string): Promise<number | null> {
        const result = this.getBalanceStm.get({userId});
        return result ? result.balance : null;
    }

    async hasAccount(userId: string): Promise<boolean> {
        return (await this.getBalance(userId)) !== null;
    }

    async transfer(originUserId: string, targetUserId: string, amount: number) {
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
