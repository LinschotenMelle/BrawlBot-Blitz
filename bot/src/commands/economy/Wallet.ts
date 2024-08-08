import { EmbedBuilder } from "discord.js";
import { userControllerGetWalletBalance } from "../../client";
import { Emojis } from "../../static/Emojis";
import { ColorCodes } from "../../static/Theme";
import { Command } from "../../structures/Command";
import { CommandTypes } from "../../typings/Command";
import { discordClient } from "../..";

export default new Command({
  name: "wallet",
  description: "Check your wallet balance",
  category: CommandTypes.ECONOMY,
  run: async ({ interaction }) => {
    const response = await userControllerGetWalletBalance({
      path: {
        userId: interaction.user.id,
      },
    });

    const wallet = response.data;

    if (!wallet) {
      return interaction.followUp({
        content: "You don't have a wallet yet",
      });
    }

    const emojis = Emojis.getInstance(discordClient);

    const embed = new EmbedBuilder();
    embed.setTitle("Wallet Balance");
    embed.setColor(ColorCodes.primaryColor);
    embed.setFields([
      {
        name: "Your balance:",
        value: `${emojis.coin} ${wallet.coins} coins \n ${emojis.powerpoints} ${wallet.powerpoints} powerpoints`,
      },
    ]);

    return interaction.followUp({ embeds: [embed] });
  },
});
