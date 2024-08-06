# BrawlBot-Blitz

## Introduction

This Discord bot is designed to provide various utilities and fun features for your Discord server. It includes functionalities such as `Brawl Stars commands`, `Moderation commands`, `Utility commands`, and `Entertainment commands`.

## How to Set Up the Bot (Local)

Follow these steps to set up the bot on your Discord server:

**Setup your enviroment:**

- Install `npm`;
- Clone this repository
- Ask Melle (Product Owner) for credentials
  or go to the [Discord Developer Portal](https://discord.com/developers/applications);
- Set up your own `.env` file in your files and set the credentials from the step above in here. See `.env.example` for the template that we use;
- Run the commmand `npm run dev` in your terminal
- **And your bot is running!!!**

## Commands

Here are the commands available for use with this bot:

- **Brawl Stars Commands:**

  - ✅ `/save <@tag>` - Saves your userId and tag in DataStax Db so your tag can be used over multple commands.
  - ✅ `/rotation` - Get the rotation of maps in realtime in Brawl Stars.
  - ✅ `/profile <@?tag>` - Displays your profile from your tag from db or if set tag of param.

- **Moderation Commands:**

  - ❌ `!kick <@user>` - Kick a user from the server.
  - ❌ `!ban <@user>` - Ban a user from the server.
  - ❌ `!mute <@user>` - Mute a user in the server.

- **Utility Commands:**

  - ❌ `!help` - Display a list of available commands and their descriptions.
  - ❌ `!ping` - Check the bot's latency.
  - ❌ `!serverinfo` - Display information about the server.
  - ❌ `!userinfo <@user>` - Display information about a user.
  - ❌ `!avatar <@user>` - Get the avatar of a user.

- **Entertainment Commands:**
  - ❌ `!roll <number>` - Roll a dice.
  - ❌ `!flip` - Flip a coin.
  - ❌ `!quote` - Get a random quote.

Feel free to customize and extend the bot's functionalities according to your requirements.

## Contributors

- [MelleLintje06](https://github.com/MelleLintje06/)
