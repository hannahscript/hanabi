import {ArgumentCollectorResult, Command, CommandoClient, CommandoMessage} from 'discord.js-commando';
import {CurrencyService} from "../../services/currency-service";

export class BalanceCommand extends Command {
    constructor(client: CommandoClient, private readonly currencyService: CurrencyService) {
        super(client, {
            name: 'balance',
            group: 'currency',
            memberName: 'balance',
            description: 'See how many coins you have in your wallet'
        });
    }

    async run(message: CommandoMessage, args: object | string | string[], fromPattern: boolean, result?: ArgumentCollectorResult) {
        const userId = message.member?.id;
        if (userId) {
            let balance = await this.currencyService.getBalance(userId);
            if (balance === null) {
                const startingBalance = 50;
                this.currencyService.createWallet(userId, startingBalance);
                balance = startingBalance;
            }

            return message.say(`Your current balance is ${balance} coin${balance === 1 ? '' : 's'}.`);
        } else {
            return null;
        }
    }
}
