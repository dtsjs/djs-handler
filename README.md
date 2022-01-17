<div align="center">
<br/>
<h1> djs-handler </h1>
<p>
<a href="https://www.npmjs.com/package/@dtsjs/djs-handler"><img src="https://img.shields.io/npm/dw/@dtsjs/djs-handler?style=flat-square"></a>
<a href="https://www.npmjs.com/package/@dtsjs/djs-handler"><img src="https://img.shields.io/npm/v/@dtsjs/djs-handler?style=flat-square"></a>
<a href="https://instagram.com/tirupatibalajithedev"><img src="https://img.shields.io/badge/Instagram-Follow-FD1D1D?style=flat-square&logo=instagram"></a>
</p>

<br/>
</div>

# About

djs-handler is powerful module for creating and managing [Discord.js](https://discord.js.org) slash commands, events, etc.

- Easy to Use
- Write bot in minimum lines of code
- Support Slash Commands, Slash Command options

# Installation

```bash
npm i @dtsjs/djs-handler
```

# Example Usage

### Directory tree

```bash
discord-bot/
├── ...
├── index.js
├── events
│   ├── ...
│   └── ready.js
├── commands
│   ├── ...
│   └── info
│       ├── ...
│       └── ping.js
└── ...
```

### Main File

```js
const { Client, Intent } = require("discord.js");
const { Handler } = require("@dtsjs/djs-handler");

const client = new Client({ intents: [Intent.FLAGS.GUILD] });

client.once("ready", () => {
  console.log("Ready!");

  new Handler(client, {
    commandFolder: "commands",
    registerCommands: true,
    deferReply: false,
    // guilds: ['123456789012345678'], # Optional - Only register commands for these guilds
  });
});

client.login("token");
```

### Command File

```js
module.exports = {
    name: 'ping',
    description: 'Ping!',

    //optional - this is example of command options
    options: {
        string: [
            {
                name: 'string_choices_name', description: 'option string with choices', 
                required: false,
                choices: [
                        { name: 'choice 1', value: 'ch1' },
                        { name: 'choice 2', value: 'c2' }
                    ]
                },
            { name: 'string_name', description: 'option string', required: false }
        ],

        user: [
            { name: 'user_name', description: 'user input', required: false }
        ],

        channel: [
            { name: 'channel_name', description: 'channel input', required: false }
        ],

        role: [
            { name: 'role_name', description: ' role input', required: false }
        ]
    }

    run(client, interaction) {

        const user = interaction.options.getUser('user_name')

        interaction.reply(`Pong! ${user.username}`);
    }
}
```

## Event File

```js
module.exports = {
    name: 'ready',

    run async (client) {
        console.log(`Bot is ready!`);
    }
}
```

<br>

# Help

If you don't understand how to use this module, please check out the [documentation](https://dtsjs.github.io/djs-handler/) or join the [discord server](https://discord.gg/dtsjs)
