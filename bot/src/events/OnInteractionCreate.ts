import { CommandInteractionOptionResolver } from "discord.js";
import { discordClient } from "..";
import { Event } from "../structures/Event";
import { ExtendedInteraction } from "../typings/Command";
import * as Sentry from "@sentry/browser";

const cooldowns = new Map<string, Map<string, number>>();

export default new Event("interactionCreate", async (interaction) => {
  if (interaction.isCommand()) {
    await interaction.deferReply();
    const command = discordClient.commands.get(interaction.commandName);

    if (!command) {
      return interaction.followUp("You have used a non existent command");
    }

    if (
      process.env.TEST_CHANNEL_ID != null &&
      interaction.channel?.id != process.env.TEST_CHANNEL_ID &&
      process.env.ENV != "PROD"
    ) {
      return interaction.followUp(
        "You do not have permission to use this command in this channel"
      );
    }

    if (
      command.userPermission &&
      !interaction.memberPermissions?.has(command.userPermission)
    ) {
      return interaction.followUp(
        "You do not have permission to use this command"
      );
    }

    if (command.timeout) {
      const userId = interaction.user.id;
      const commandName = interaction.commandName;
      const now = Date.now();

      if (!cooldowns.has(commandName)) {
        cooldowns.set(commandName, new Map());
      }

      const timestamps = cooldowns.get(commandName)!;
      const expirationTime = (timestamps.get(userId) || 0) + command.timeout;

      if (now < expirationTime) {
        const timeLeft = (expirationTime - now) / 1000;
        return interaction.followUp(
          "Please wait `" +
            timeLeft.toFixed(0) +
            " more second(s)` before reusing the " +
            "`/" +
            commandName +
            "` command."
        );
      }

      timestamps.set(userId, now);
    }

    command.run({
      args: interaction.options as CommandInteractionOptionResolver,
      client: discordClient,
      interaction: interaction as ExtendedInteraction,
    });
  }
});
