import { ClientEvents, CommandInteraction } from 'discord.js';
import client from './Client';

export interface Run {
    (client: client, interaction: CommandInteraction): void
}

export interface Command {
    name: string,
    description: string,
    memberpermissions?: string[],
    requiredroles?: string[],
    alloweduserids?: string[],
    options?: {
        string?: { name: string, description: string, required: false, autocomplete?: boolean, choices?: { name: string, value: string }[] }[],
        user?: { name: string, description: string, required: false }[],
        role?: { name: string, description: string, required: false }[],
        channel?: { name: string, description: string, required: false }[]
    },
    default_permission?: null,

    run: Run;
}


/**
 * @name HandlerOptions
 * @description Options for the Handler
 * @param commandFolder - The folder where the commands are located
 * @param registerCommands - Whether or not to register the commands
 * @param deferReply - Whether or not to defer the reply to the user
 * @param guilds - The guilds to register the commands for
 * @kind interface
 */
export interface HandlerOptions {
    /**
     * The folder path to the commands
     */
    commandFolder: string;
    /**
     * The folder path to the events
     */
    eventFolder: string;
    /**
     * Whether to register the commands
     * @type boolean
     * @default false
    */
    registerCommands: boolean;
    /**
     * Whether to defer the reply
     * @type boolean
     * @default false
     */
    deferReply: boolean;
    /**
     * The guilds to register the commands for
     * @type string[]
     * @default []
     * @example ['123456789012345678']
     */
    guilds?: string[];
}

export interface EventRun {
    (client: client, ...args: any[]): void
}

export interface Event {
    /**
     * The name of the event
     * @type string
     * @example 'messageCreate'
     * @required
     * @keyof ClientEvents
     */
    name: keyof ClientEvents;
    run: EventRun;
}