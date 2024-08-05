import { ApplicationCommandOptionType, EmbedBuilder } from "discord.js";
import { CommandTypes } from "../../core/enums/CommandType";
import { Command } from "../../structures/Command";
import { ColorCodes } from "../../static/Theme";
import { openaiControllerCreateImage } from "../../client";

export default new Command({
  name: "create-image",
  description: "Create your own image using OpenAI's DALL-E model",
  category: CommandTypes.OTHER,
  options: [
    {
      name: "prompt",
      description: "The prompt to generate the image",
      type: ApplicationCommandOptionType.String,
      required: true,
      max_length: 1000,
    },
  ],
  run: async ({ interaction }) => {
    const prompt = interaction.options.get("prompt", true)?.value?.toString();

    if (!prompt) {
      return interaction.editReply({
        content: "You need to provide a prompt to generate an image!",
      });
    }

    await interaction.editReply(
      "Generating the image, this may take a few seconds..."
    );

    const response = await openaiControllerCreateImage({
      body: {
        prompt: prompt,
      },
    });
    const image = response.data;

    if (!image) {
      return interaction.editReply({
        content: "There was an error generating the image!",
      });
    }

    const embed = new EmbedBuilder()
      .setImage(image.url)
      .setTitle(`Generated Image: '${prompt}'`)
      .setColor(ColorCodes.primaryColor)
      .setFooter({
        text: "Powered by OpenAI",
      });

    await interaction.editReply({
      content: null,
      embeds: [embed],
    });
  },
});
