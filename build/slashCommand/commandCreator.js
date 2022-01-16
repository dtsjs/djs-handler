"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Handler = void 0;
var fs_1 = require("fs");
var discord_js_1 = require("discord.js");
var utils_1 = __importDefault(require("./utils"));
var Handler = /** @class */ (function () {
    /**
     * @name Handler
     * @kind constructor
     * @description Initializing the giveaway client
     * @param client - The Discord client instance
     * @param options - The options for the Handler
     */
    function Handler(client, options) {
        var _this = this;
        this.client = client;
        var commandFolder = options.commandFolder, registerCommands = options.registerCommands, deferReply = options.deferReply, guilds = options.guilds;
        this.client.slashCommands = new discord_js_1.Collection();
        this.client.allCommands = new discord_js_1.Collection();
        this.options = {
            commandFolder: commandFolder,
            registerCommands: registerCommands || false,
            deferReply: deferReply || false,
            guilds: guilds || []
        };
        this.loadCommands().then(function () {
            if (options.registerCommands)
                _this.registerSlashCommands();
            _this.handleSlashCommands();
        });
    }
    /**
     * @description Loads all commands from the command directory
     * @kind private
     */
    Handler.prototype.loadCommands = function () {
        var _this = this;
        var allCommands = [];
        return new Promise(function (resolve, reject) { return __awaiter(_this, void 0, void 0, function () {
            var main, commandFolderPath_1;
            var _this = this;
            return __generator(this, function (_a) {
                try {
                    main = require.main;
                    commandFolderPath_1 = "".concat(main === null || main === void 0 ? void 0 : main.path, "/").concat(this.options.commandFolder);
                    (0, fs_1.readdirSync)(commandFolderPath_1).forEach(function (dir) {
                        var commands = (0, fs_1.readdirSync)("".concat(commandFolderPath_1, "/").concat(dir)).filter(function (file) { return file.endsWith(".js") || file.endsWith(".ts"); });
                        var _loop_1 = function (file) {
                            var command = require("".concat(commandFolderPath_1, "/").concat(dir, "/").concat(file));
                            var cmd = utils_1.default.fixCommand(command);
                            if (_this.client.isReady() === true) {
                                _this.client.slashCommands.set(cmd.name, cmd);
                            }
                            else {
                                _this.client.once('ready', function () {
                                    _this.client.slashCommands.set(cmd.name, cmd);
                                });
                            }
                            allCommands.push(cmd);
                        };
                        for (var _i = 0, commands_1 = commands; _i < commands_1.length; _i++) {
                            var file = commands_1[_i];
                            _loop_1(file);
                        }
                    });
                    if (this.client.isReady() === true) {
                        this.client.allCommands.set('slashCommands', allCommands);
                    }
                    else {
                        this.client.once('ready', function () {
                            _this.client.allCommands.set('slashCommands', allCommands);
                        });
                    }
                    resolve(allCommands);
                    return [2 /*return*/, Handler];
                }
                catch (error) {
                    reject(error);
                }
                return [2 /*return*/];
            });
        }); });
    };
    Handler.prototype.registerSlashCommands = function () {
        var _a;
        return __awaiter(this, void 0, void 0, function () {
            var commands;
            var _this = this;
            return __generator(this, function (_b) {
                commands = this.client.allCommands.get('slashCommands');
                console.log(commands)
                if (!commands)
                    return [2 /*return*/];
                if (this.options.guilds)
                    this.options.guilds.forEach(function (g) { var _a; return (_a = _this.client.application) === null || _a === void 0 ? void 0 : _a.commands.set(commands, g); });
                else
                    (_a = this.client.application) === null || _a === void 0 ? void 0 : _a.commands.set(commands);
                return [2 /*return*/];
            });
        });
    };
    Handler.prototype.handleSlashCommands = function () {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                this.client.on('interactionCreate', function (interaction) { return __awaiter(_this, void 0, void 0, function () {
                    var command, member;
                    var _a;
                    return __generator(this, function (_b) {
                        switch (_b.label) {
                            case 0:
                                if (!interaction.isCommand())
                                    return [2 /*return*/];
                                command = this.client.slashCommands.get(interaction.commandName);
                                member = (_a = interaction.guild) === null || _a === void 0 ? void 0 : _a.members.cache.get(interaction.user.id);
                                if (!command || !member)
                                    return [2 /*return*/];
                                if (!(this.options.deferReply === true)) return [3 /*break*/, 2];
                                return [4 /*yield*/, interaction.deferReply()];
                            case 1:
                                _b.sent();
                                _b.label = 2;
                            case 2:
                                try {
                                    command.run(this.client, interaction);
                                }
                                catch (_c) {
                                    console.error();
                                }
                                return [2 /*return*/];
                        }
                    });
                }); });
                return [2 /*return*/];
            });
        });
    };
    /**
     * reloadCommands
     * @description Reloads all commands
     * @memberof Handler
     * @example Handler.reloadCommands()
     */
    Handler.prototype.reloadCommands = function () {
        var _this = this;
        this.loadCommands().then(function () {
            _this.registerSlashCommands();
        });
    };
    return Handler;
}());
exports.Handler = Handler;
