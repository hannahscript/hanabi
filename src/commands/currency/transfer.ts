import {ArgumentCollectorResult, Command, CommandoClient, CommandoMessage} from "discord.js-commando";
import {CurrencyService} from "../../services/currency-service";
import {GuildMember} from "discord.js";

export class TransferCommand extends Command {
    constructor(client: CommandoClient, private readonly currencyService: CurrencyService) {
        super(client, {
            name: 'transfer',
            group: 'currency',
            memberName: 'transfer',
            description: 'Transfer coins from your wallet to another user\'s',
            args: [
                {
                    key: 'target',
                    prompt: 'Which user do you want to transfer your coins to?',
                    type: 'member'
                },
                {
                    key: 'amount',
                    prompt: 'How many coins do you want to send?',
                    type: 'integer',
                    validate: (amount: number) => {
                        if (amount > 0) return true;
                        return 'Amount needs to be greater than zero.'
                    }
                }
            ]
        });
    }

    async run(message: CommandoMessage, {
        target,
        amount
    }: { target: GuildMember, amount: number }, fromPattern: boolean, result?: ArgumentCollectorResult) {
        const originUserId = message.member?.id;
        const targetUserId = target.user.id;

        if (!originUserId) {
            return message.say('Command must be run by a user.');
        }

        const balance = await this.currencyService.getBalance(originUserId);
        if (balance === null) {
            return message.say('You need an account for this action. Use the &balance command to create one.');
        }

        if (balance < amount) {
            return message.say(`You have insufficient coins for this transaction (${balance}).`);
        }

        if (!await this.currencyService.hasAccount(targetUserId)) {
            return message.say('That user does not have an account.');
        }

        await this.currencyService.transfer(originUserId, targetUserId, amount);
        return message.say('Successfully transferred coins.')
    }
}
