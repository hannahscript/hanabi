import * as dotenv from 'dotenv';
import {CommandoClient} from 'discord.js-commando';
import {PingCommand} from "./commands/basic/ping";
import {BalanceCommand} from "./commands/currency/balance";
import {Services, setUpServices} from "./services/factory";
import {TransferCommand} from "./commands/currency/transfer";
import Database from "better-sqlite3";

dotenv.config();

function setUpClient(services: Services): CommandoClient {
    const client = new CommandoClient({
        commandPrefix: '&',
        owner: process.env.OWNER_ID
    });

    client.registry
        .registerDefaultTypes()
        .registerGroups([
            ['basic', 'Basic commands without any particular category'],
            ['currency', 'Commands for checking and transferring your coins']
        ])
        .registerDefaultGroups()
        .registerDefaultCommands({ping: false})
        .registerCommand(new PingCommand(client))
        .registerCommand(new BalanceCommand(client, services.currency))
        .registerCommand(new TransferCommand(client, services.currency));

    client.once('ready', () => {
        console.log('Bot is ready');
        client.user?.setActivity('with Commando');
    });

    client.on('error', console.error);

    return client;
}

async function main() {
    const db = new Database('database.db');

    const services = setUpServices(db);
    const client = setUpClient(services);

    await client.login(process.env.DISCORD_TOKEN);
}

main();


