import { Command, HandlerOptions, Event } from './handler.interfaces';
import { RESTPostAPIApplicationCommandsJSONBody } from 'discord-api-types';
import { read, readdirSync } from 'fs';
import { Collection } from 'discord.js';
import client from './Client';
import Utils from './utils';

export class Handler {
    client: client;
    public options: HandlerOptions;

    /**
     * @name Handler
     * @kind constructor
     * @description Initializing the giveaway client
     * @param client - The Discord client instance
     * @param options - The options for the Handler
     */
    constructor(client: client, options: HandlerOptions) {
        this.client = client;

        const { commandFolder, eventFolder, registerCommands, deferReply, guilds } = options;

        this.client.slashCommands = new Collection();
        this.client.allCommands = new Collection();
        this.client.events = new Collection();

        const main = require.main;

        this.options = {
            commandFolder: commandFolder || `${main?.path}/commands`,
            eventFolder: eventFolder || `${main?.path}/events`,
            registerCommands: registerCommands || false,
            deferReply: deferReply || false,
            guilds: guilds || []
        }


        this.loadCommands().then(() => {
            if (options.registerCommands) this.registerSlashCommands();
            this.handleSlashCommands();
        })

        this.loadEvents();
    }

    /**
     * @description Loads all commands from the command directory
     */
    private loadCommands() {
        let allCommands: RESTPostAPIApplicationCommandsJSONBody[] = []

        return new Promise(async (resolve, reject) => {
            try {
                const main = require.main;
                const commandsDir = `${main?.path}/${this.options.commandFolder}`;
                readdirSync(commandsDir).forEach((dir) => {
                    const commands = readdirSync(`${commandsDir}/${dir}`).filter(file => file.endsWith(".js") || file.endsWith(".ts"));
                    for (const file of commands) {
                        const command = require(`${commandsDir}/${dir}/${file}`);

                        const cmd = Utils.fixCommand(command);

                        if (this.client.isReady() === true) {
                            this.client.slashCommands.set(cmd.name, cmd);
                        } else {
                            this.client.once('ready', () => {
                                this.client.slashCommands.set(cmd.name, cmd);
                            })
                        }
                        allCommands.push(cmd)
                    }
                })

                if (this.client.isReady() === true) {
                    this.client.allCommands.set('slashCommands', allCommands);
                } else {
                    this.client.once('ready', () => {
                        this.client.allCommands.set('slashCommands', allCommands);
                    })
                }
                resolve(allCommands)
                return Handler
            } catch (error) {
                reject(error);
            }
        })
    }

    private async registerSlashCommands() {
        const commands = this.client.allCommands.get('slashCommands');
        if (!commands) return;
        if (this.options.guilds) this.options.guilds.forEach(g => this.client.application?.commands.set(commands, g))
        else this.client.application?.commands.set(commands)
    }

    private async handleSlashCommands() {
        this.client.on('interactionCreate', async (interaction) => {
            if (!interaction.isCommand()) return;
            const command = this.client.slashCommands.get(interaction.commandName);
            const member = interaction.guild?.members.cache.get(interaction.user.id);
            if (!command || !member) return;

            if (this.options.deferReply === true) await interaction.deferReply();
            try {
                command.run(this.client, interaction)
            } catch {
                console.error()
            }
        })
    }

    private loadEvents() {
        const main = require.main;
        const eventsDir = `${main?.path}/${this.options.eventFolder}`;
        
        readdirSync(eventsDir).forEach(async (dir) => {
            const event: Event = require(`${eventsDir}/${dir}`);
            this.client.events.set(event.name, event);
            this.client.on(event.name, (...args) => event.run(this.client, ...args));
    })
}

    /**
     * reloadHandler
     * @description Reloads all commands
     * @memberof Handler
     * @example Handler.reloadHandler()
     */
    public reloadHandler() {
        this.loadCommands().then(() => {
            this.registerSlashCommands();
        })
        this.loadEvents();
    }
}