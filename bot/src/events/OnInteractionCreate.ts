import { CommandInteractionOptionResolver } from "discord.js";
import { client } from "..";
import { Event } from "../structures/Event";
import { ExtendedInteraction } from "../typings/Command";
import * as Sentry from "@sentry/browser";

export default new Event("interactionCreate", async (interaction) => {
  if (interaction.isCommand()) {
    await interaction.deferReply();
    const command = client.commands.get(interaction.commandName);

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

    try {
      command.run({
        args: interaction.options as CommandInteractionOptionResolver,
        client,
        interaction: interaction as ExtendedInteraction,
      });
    } catch (error) {
      Sentry.captureException(error);
      interaction.followUp("There was an error while executing this command");
    }
  }
});
