import {
  ActionRowBuilder,
  ApplicationCommandOptionType,
  ButtonBuilder,
  ButtonStyle,
  ComponentType,
  EmbedBuilder,
  GuildEmoji,
  TextChannel,
} from "discord.js";
import { CommandTypes } from "../../typings/Command";
import { Command } from "../../structures/Command";
import { collectFirstMessageOfUser } from "../../static/Converters";
import { BBEmbedButton } from "../../static/embed-button";
import { ColorCodes } from "../../static/Theme";
import { Emojis } from "../../static/Emojis";
import { discordClient } from "../..";

export class Poll {
  voteYes: PollVote[] = [];
  voteNo: PollVote[] = [];
}

export class PollVote {
  userId!: string;
}

export default new Command({
  name: "poll",
  description: "Help of all commands",
  category: CommandTypes.OTHER,
  options: [
    {
      name: "title",
      description: "Title of the poll",
      type: ApplicationCommandOptionType.String,
      required: true,
    },
    {
      name: "channel",
      description: "Channel to send the poll",
      type: ApplicationCommandOptionType.Channel,
      required: false,
    },
    {
      name: "role",
      description: "Role",
      type: ApplicationCommandOptionType.Role,
      required: false,
    },
  ],
  run: async ({ interaction }) => {
    const title = interaction.options.get("title")?.value?.toString();
    const channelId = interaction.options.get("channel")?.value?.toString();
    const roleId = interaction.options.get("role")?.value?.toString();

    if (!title) {
      return await interaction.editReply({
        content: "Please provide a title for the poll.",
      });
    }

    const channel = interaction.guild?.channels.cache.get(
      channelId ?? interaction.channelId
    );

    if (!channel || !(channel instanceof TextChannel)) {
      return await interaction.editReply({
        content: "Channel not found.",
      });
    }

    const hasPermissions = channel.members
      .find((m) => m.id === interaction.user.id)
      ?.permissionsIn(channel)
      .has("SendMessages");

    if (!hasPermissions) {
      return await interaction.editReply({
        content:
          "You do not have permissions to send messages in this channel.",
      });
    }

    await interaction.editReply({
      content:
        "Please provide a description for the poll. Type `skip` to skip this step.",
    });

    const response = await collectFirstMessageOfUser(interaction);
    const description = response?.content ?? "skip";
    await response?.delete();

    if (!channel) {
      return await interaction.editReply({
        content: "Channel not found.",
      });
    }

    const embed = new EmbedBuilder();
    embed.setColor(ColorCodes.primaryColor);
    embed.setTitle(title);

    const explanation = "**Vote:**\n👍 = Yes\n👎 = No";
    if (description !== "skip") {
      embed.setDescription(`${description}\n\n${explanation}`);
    } else {
      embed.setDescription(explanation);
    }

    const emojis = emojiPollBuilder(0);

    embed.setFields([
      {
        name: "Votes",
        value: `0% ${emojis.join("")} 0%`,
      },
    ]);

    const thumbsUpButton = new BBEmbedButton("👍", "yes", ButtonStyle.Success);
    const thumbsDownButton = new BBEmbedButton("👎", "no", ButtonStyle.Danger);
    const viewVotesButton = new BBEmbedButton("👀 Votes", "view-votes");
    const openThreadButton = new BBEmbedButton("🧵 Open Thread", "open-thread");

    const poll = new Poll();

    const bbButtons = [
      thumbsUpButton,
      thumbsDownButton,
      viewVotesButton,
      openThreadButton,
    ];
    const buttons = bbButtons.map((button) => button.button);

    const component = new ActionRowBuilder<ButtonBuilder>().setComponents(
      buttons
    );

    var content = undefined;
    if (roleId) {
      content = `<@&${roleId}>`;
    }

    const message = await channel.send({
      content: content,
      embeds: [embed],
      components: [component],
    });

    const collector = channel.createMessageComponentCollector({
      componentType: ComponentType.Button,
      filter: (i) => message.id === i.message.id,
    });

    collector.on("collect", async (i) => {
      const buttonPressed = bbButtons.find((b) => b.customId === i.customId);

      if (!buttonPressed) {
        return;
      }

      if (buttonPressed.id === "view-votes") {
        const viewVotesEmbed = new EmbedBuilder()
          .setColor(ColorCodes.primaryColor)
          .setTitle("Votes")
          .setFields([
            {
              name: "Yes",
              value:
                poll.voteYes.map((v) => `<@${v.userId}>`).join(", ") || " ",
              inline: true,
            },
            {
              name: "No",
              value: poll.voteNo.map((v) => `<@${v.userId}>`).join(", ") || " ",
              inline: true,
            },
          ])
          .setTimestamp();
        await i.user.send({ embeds: [viewVotesEmbed] });
      }

      if (buttonPressed.id === "open-thread") {
        await channel.threads.create({
          name: title,
          startMessage: message,
        });
        openThreadButton.enabled(false);
      }

      if (buttonPressed.id === "yes") {
        if (poll.voteNo.find((v) => v.userId === i.user.id)) {
          poll.voteNo = poll.voteNo.filter((v) => v.userId !== i.user.id);
        }
        if (!poll.voteYes.find((v) => v.userId === i.user.id)) {
          poll.voteYes.push({ userId: i.user.id });
        }
      } else if (buttonPressed.id === "no") {
        if (poll.voteYes.find((v) => v.userId === i.user.id)) {
          poll.voteYes = poll.voteYes.filter((v) => v.userId !== i.user.id);
        }
        if (!poll.voteNo.find((v) => v.userId === i.user.id)) {
          poll.voteNo.push({ userId: i.user.id });
        }
      }

      const totalVotes = poll.voteYes.length + poll.voteNo.length;

      if (totalVotes === 0) {
        return;
      }

      const calculatedPercentageOfEmojiVotedYes = Math.round(
        (poll.voteYes.length / totalVotes) * 100
      );

      const calculatedAmountOfEmojiVotedYes = Math.round(
        calculatedPercentageOfEmojiVotedYes / 10
      );

      const calculatedPercentageOfEmojiVotedNo =
        100 - calculatedPercentageOfEmojiVotedYes;

      const builder = emojiPollBuilder(calculatedAmountOfEmojiVotedYes);

      embed.setFields([
        {
          name: `Votes (${totalVotes}):`,
          value: `${calculatedPercentageOfEmojiVotedYes}% ${builder.join(
            ""
          )} ${calculatedPercentageOfEmojiVotedNo}%`,
        },
      ]);

      await i.update({
        embeds: [embed],
        components: [
          new ActionRowBuilder<ButtonBuilder>().addComponents(
            thumbsUpButton.button,
            thumbsDownButton.button,
            viewVotesButton.button,
            openThreadButton.button
          ),
        ],
      });
    });

    await interaction.editReply({
      content: `Poll created successfully. You can view it in ${channel}.`,
    });
  },
});

function emojiPollBuilder(votedYes: number): GuildEmoji[] {
  const emojis = Emojis.getInstance(discordClient);

  var array: GuildEmoji[] = [];

  for (let i = 0; i < 10; i++) {
    if (i < votedYes) {
      if (i === 0) {
        array.push(emojis.barBlueOne!);
        continue;
      }

      if (i === 9) {
        array.push(emojis.barBlueThree!);
        continue;
      }
      array.push(emojis.barBlueTwo!);
    } else {
      if (i === 0) {
        array.push(emojis.barRedOne!);
        continue;
      }

      if (i === 9) {
        array.push(emojis.barRedThree!);
        continue;
      }

      array.push(emojis.barRedTwo!);
    }
  }

  return array;
}
