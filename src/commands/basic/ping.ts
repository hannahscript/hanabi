import {ArgumentCollectorResult, Command, CommandoClient, CommandoMessage} from 'discord.js-commando';
import {Message} from "discord.js";

export class PingCommand extends Command {
    constructor(client: CommandoClient) {
        super(client, {
            name: 'ping',
            aliases: ['pang'],
            group: 'basic',
            memberName: 'ping',
            description: 'Replies with pong'
        });
    }

    run(message: CommandoMessage, args: object | string | string[], fromPattern: boolean, result?: ArgumentCollectorResult): Promise<Message | Message[] | null> | null {
        return message.say('Pong');
    }
}
