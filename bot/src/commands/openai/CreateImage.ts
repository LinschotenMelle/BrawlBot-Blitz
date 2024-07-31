import { ApplicationCommandOptionType, EmbedBuilder } from "discord.js";
import { CommandTypes } from "../../core/enums/CommandType";
import { Command } from "../../structures/Command";
import { HttpService } from "../../core/services/HttpService";
import { ColorCodes } from "../../static/Theme";

interface OpenAIResponse {
  url: string;
}

export default new Command({
  name: "create-image",
  description: "Create your own image using OpenAI's DALL-E model",
  category: CommandTypes.OPENAI,
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

    const response = await HttpService.instance.post<OpenAIResponse>(
      "/openai/generate-image",
      {
        prompt: prompt,
      }
    );

    if (!response) {
      return interaction.editReply({
        content: "There was an error generating the image!",
      });
    }

    const embed = new EmbedBuilder()
      .setImage(response.url)
      .setTitle(`Generated Image: ${prompt}`)
      .setColor(ColorCodes.primaryColor)
      .setFooter({
        text: "Powered by OpenAI",
      });

    await interaction.editReply({
      embeds: [embed],
    });
  },
});
