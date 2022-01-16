import { Command } from './handler.interfaces';
import {  Client, ClientOptions, Collection } from 'discord.js';
import { RESTPostAPIApplicationCommandsJSONBody } from 'discord-api-types/v9';

class client extends Client {
    slashCommands: Collection<string, Command>;
    allCommands: Collection<string, RESTPostAPIApplicationCommandsJSONBody[]>;

    constructor(options: ClientOptions) {
        super(options);
        this.slashCommands = new Collection();
        this.allCommands = new Collection();
    }
}

export default client;