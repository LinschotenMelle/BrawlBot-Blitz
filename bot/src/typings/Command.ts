import {
  ChatInputApplicationCommandData,
  CommandInteraction,
  CommandInteractionOptionResolver,
  GuildMember,
  PermissionResolvable,
} from "discord.js";
import { ExtendedClient } from "../structures/Client";

export enum CommandTypes {
  BRAWL_STARS = "Brawl Stars",
  INFO = "Info",
  OTHER = "Other",
}

/**
 * {
 *  name: "commandname",
 * description: "any description",
 * run: async({ interaction }) => {
 *
 * }
 * }
 */
export interface ExtendedInteraction extends CommandInteraction {
  member: GuildMember;
}

interface RunOptions {
  client: ExtendedClient;
  interaction: CommandInteraction;
  args: CommandInteractionOptionResolver;
}

type RunFunction = (options: RunOptions) => any;

export type CommandType = {
  userPermission?: PermissionResolvable[];
  run: RunFunction;
  category: CommandTypes;
} & ChatInputApplicationCommandData;
