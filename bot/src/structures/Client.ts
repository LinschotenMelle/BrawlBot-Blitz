import {
  ApplicationCommandDataResolvable,
  Client,
  Collection,
  ClientEvents,
  ActivityType,
  GatewayIntentBits,
  IntentsBitField,
} from "discord.js";
import { CommandType } from "../typings/Command";
import { globSync } from "glob";
import { RegisterCommandsOptions } from "../typings/Client";
import { Event } from "./Event";
import { analytics, discordClient } from "..";
import { client } from "../client";

export class ExtendedClient extends Client {
  commands: Collection<string, CommandType> = new Collection();
  constructor() {
    super({
      intents: [
        32767,
        IntentsBitField.Flags.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
      ],
    });
  }

  start() {
    this.registerModules();
    this.setHttpClientConfig();
    analytics.trackEvents();
    this.login(process.env.TOKEN);
  }

  async importFile(filePath: string) {
    return (await import(filePath))?.default;
  }

  async registerCommands({ commands, guildId }: RegisterCommandsOptions) {
    if (guildId) {
      this.guilds.cache.get(guildId)?.commands.set(commands);
    } else {
      this.application?.commands.set(commands);
    }
  }

  async registerModules() {
    const slashCommands: ApplicationCommandDataResolvable[] = [];
    // Commands
    const commandFiles = globSync(`${__dirname}/../commands/*/*{.js,.ts}`);

    commandFiles.forEach(async (filePath) => {
      const command = await this.importFile(filePath);

      if (!command?.name) return;

      this.commands.set(command.name, command);
      slashCommands.push(command);
    });

    this.on("ready", () => {
      this.registerCommands({
        commands: slashCommands,
        guildId: process.env.GUILD_ID,
      });
      // Register commands
      const commandsArray = Array.from(this.commands.values());
      setInterval(() => {
        const randomCommand =
          commandsArray[Math.floor(Math.random() * commandsArray.length)];
        discordClient.user?.setActivity(`/${randomCommand.name}`, {
          type: ActivityType.Playing,
        });
      }, 30000);
    });

    // Event
    const eventFiles = globSync(`${__dirname}/../events/*{.ts,.js}`);
    eventFiles.forEach(async (filePath) => {
      const event: Event<keyof ClientEvents> = await this.importFile(filePath);
      this.on(event.event, event.run);
    });
  }

  async setHttpClientConfig() {
    client.setConfig({
      baseURL: process.env.HTTP_API_URL,
      headers: {
        token: process.env.TOKEN,
      },
    });
  }
}
