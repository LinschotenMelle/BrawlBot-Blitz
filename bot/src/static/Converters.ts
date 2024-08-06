import { CacheType, CommandInteraction, Message } from "discord.js";

export class Converters {
  private constructor() {
    throw new Error("ColorCodes cannot be instantiated.");
  }

  static capitalizeFirstLetter(s: string): string {
    const items = s
      .toLowerCase()
      .split(/[\s-]+/)
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1));

    return items.join(s.includes("-") ? "-" : " ");
  }
}

export async function collectMessage(
  interaction: CommandInteraction<CacheType>
): Promise<Message | undefined> {
  const filter = (response: Message) =>
    response.author.id === interaction.user.id;
  const collected = await interaction.channel?.awaitMessages({
    filter,
    max: 1,
    time: 30000,
  });
  return collected?.first();
}
