"use strict";
exports.__esModule = true;
var dotenv = require("dotenv");
var discord_js_commando_1 = require("discord.js-commando");
var ping_1 = require("./commands/basic/ping");
dotenv.config();
var client = new discord_js_commando_1.CommandoClient({
    commandPrefix: '&',
    owner: '277146459080491008'
});
client.registry
    .registerDefaultTypes()
    .registerGroups([
    ['basic', 'Basic commands without any particular category']
])
    .registerDefaultGroups()
    .registerDefaultCommands()
    .registerCommand(new ping_1.PingCommand(client));
client.once('ready', function () {
    var _a;
    console.log('Bot is ready');
    (_a = client.user) === null || _a === void 0 ? void 0 : _a.setActivity('with Commando');
});
client.on('error', console.error);
client.login(process.env.DISCORD_TOKEN);
