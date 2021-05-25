"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
exports.__esModule = true;
exports.PingCommand = void 0;
var discord_js_commando_1 = require("discord.js-commando");
var PingCommand = /** @class */ (function (_super) {
    __extends(PingCommand, _super);
    function PingCommand(client) {
        return _super.call(this, client, {
            name: 'ping',
            aliases: ['pang'],
            group: 'basic',
            memberName: 'ping',
            description: 'Replies with pong'
        }) || this;
    }
    PingCommand.prototype.run = function (message, args, fromPattern, result) {
        return message.say('Pong');
    };
    return PingCommand;
}(discord_js_commando_1.Command));
exports.PingCommand = PingCommand;
