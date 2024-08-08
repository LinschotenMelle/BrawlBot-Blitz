import { EmbedBuilder } from "discord.js";
import { userControllerUpdateWalletBalance } from "../../client";
import { Command } from "../../structures/Command";
import { CommandTypes } from "../../typings/Command";
import { Emojis } from "../../static/Emojis";
import { discordClient } from "../..";
import { ColorCodes } from "../../static/Theme";

export default new Command({
  name: "box",
  description: "Collect coins from your brawl stars box",
  category: CommandTypes.ECONOMY,
  timeout: 10 * 60 * 1000, // 10 minutes
  run: async ({ interaction }) => {
    const randomCoins = Math.floor(Math.random() * 25) + 1;
    const randomPowerPoints = Math.floor(Math.random() * 100) + 1;
    const response = await userControllerUpdateWalletBalance({
      path: {
        userId: interaction.user.id,
      },
      body: {
        coins: randomCoins,
        powerpoints: randomPowerPoints,
      },
    });

    const wallet = response.data;

    const emojis = Emojis.getInstance(discordClient);
    const embed = new EmbedBuilder();
    embed.setTitle("Box Collected");
    embed.setColor(ColorCodes.primaryColor);
    embed.setDescription(
      `You have collected ${emojis.coin} ${randomCoins} coins and ${emojis.powerpoints} ${randomPowerPoints} powerpoints from the brawl stars box`
    );

    embed.addFields([
      {
        name: "Your balance:",
        value: `${emojis.coin} ${wallet.coins} coins \n ${emojis.powerpoints} ${wallet.powerpoints} powerpoints`,
      },
    ]);

    return interaction.followUp({ embeds: [embed] });
  },
});
