import {
  ApplicationCommandOptionType,
  AttachmentBuilder,
  ChannelType,
  EmbedBuilder,
  Guild,
  PermissionFlagsBits,
  TextChannel,
  ThreadAutoArchiveDuration,
  ThreadChannel,
} from "discord.js";
import { CommandTypes } from "../../typings/Command";
import { Command } from "../../structures/Command";
import { ColorCodes } from "../../static/Theme";
import { discordClient } from "../..";
import { Constants } from "../../static/Contants";
import moment = require("moment");
import humanizeDuration = require("humanize-duration");
import * as Sentry from "@sentry/browser";
import { handleTeamRegistrations } from "./CreateNewTournament.collector";
import { createBracket } from "./CreateNewTournament.bracket";
import { PlayerDto } from "../../client";
import { collectFirstMessageOfUser } from "../../static/Converters";

export class RegisteredTeam {
  public teamName!: string;
  public members!: RegisteredUser[];
}

export class RegisteredUser {
  public member!: string;
  public user!: PlayerDto;
}

export default new Command({
  name: "create-new-tournament",
  description: "Create a new tournament",
  userPermission: [PermissionFlagsBits.ManageGuild],
  category: CommandTypes.BRAWL_STARS,
  options: [
    {
      name: "name",
      description: "Tournament Name",
      type: ApplicationCommandOptionType.String,
      required: true,
    },
    {
      name: "role",
      description: "Role",
      type: ApplicationCommandOptionType.Role,
      required: true,
    },
    {
      name: "end-date-register",
      description:
        "Format like the following: 'DD-MM HH:MM'. End Date Time to Register for the tournament.",
      type: ApplicationCommandOptionType.String,
      required: true,
    },
    {
      name: "type-team",
      description: "Type of team for the tournament",
      type: ApplicationCommandOptionType.Integer,
      required: true,
      choices: [
        { name: "Solo", value: 1 },
        { name: "Duo", value: 2 },
        { name: "Team", value: 3 },
        { name: "Club", value: 5 },
      ],
    },
    {
      name: "max-teams",
      description: "Max amount of teams that can participate",
      type: ApplicationCommandOptionType.Integer,
      required: false,
      choices: [
        { name: "2", value: 2 },
        { name: "4", value: 4 },
        { name: "8", value: 8 },
        { name: "16", value: 16 },
        { name: "32", value: 32 },
      ],
    },
  ],
  run: async ({ interaction }) => {
    try {
      const name = interaction.options.get("name")?.value;
      const role = interaction.options.get("role")?.value;
      const endDateRegister =
        interaction.options.get("end-date-register")?.value;

      const maxTeams = interaction.options.get("max-teams")?.value;

      await interaction.editReply({
        content:
          "Please provide a description for the tournament. Type `skip` to skip this step.",
      });

      const membersPerTeam = interaction.options.get("type-team")?.value;

      const descResponse = await collectFirstMessageOfUser(interaction);
      const desc = descResponse?.content ?? "skip";
      await descResponse?.delete();

      const guild = discordClient.guilds.cache.get(interaction.guildId ?? "");
      if (!guild) {
        await interaction.followUp({
          content: "Guild not found.",
          ephemeral: true,
        });
        return;
      }

      const category = await guild.channels.create({
        name: name?.toString() ?? "Tournament",
        type: ChannelType.GuildCategory,
        permissionOverwrites: [
          {
            id: guild.roles.everyone.id,
            deny: [
              PermissionFlagsBits.ViewChannel,
              PermissionFlagsBits.CreatePublicThreads,
              PermissionFlagsBits.CreatePrivateThreads,
            ],
          },
        ],
      });

      const createdChannel = await guild.channels.create({
        name: name?.toString() ?? "Tournament",
        type: ChannelType.GuildText,
        parent: category.id,
      });

      const registeredUsers: RegisteredTeam[] = [];
      const embed = new EmbedBuilder()
        .setTitle(name?.toString() ?? "Tournament")
        .addFields({
          name: `Total Registered Teams: ${registeredUsers.length}`,
          value: "Register below by sending attachments with your tags.",
        })
        .setColor(ColorCodes.primaryColor)
        .setTimestamp()
        .setFooter({ text: `Tournament created by ${interaction.user.tag}` });

      if (desc.toLowerCase() !== "skip") {
        embed.setDescription(desc);
      }

      const introductionMessage = await createdChannel.send({
        content: `<@&${role}>`,
        embeds: [embed],
      });

      let formattedDate = moment(endDateRegister?.toString(), "DD-MM HH:mm");

      if (!formattedDate.isValid()) {
        await createdChannel.send({
          content: "Invalid date format. Please provide a valid format.",
        });
        return;
      }

      if (formattedDate.isBefore(Date.now())) {
        formattedDate = formattedDate.add(1, "year");
      }

      if (endDateRegister) {
        const timer = new EmbedBuilder();
        timer.setThumbnail(Constants.timerGif);
        timer.setTitle(
          `Registration ends at: ${formattedDate.toLocaleString()}`
        );
        timer.setThumbnail(Constants.timer.name);

        await createdChannel.send({
          embeds: [timer],
        });
      }

      const teamsThread = await createThreads(createdChannel);
      await handleTeamRegistrations(
        createdChannel,
        guild,
        registeredUsers,
        embed,
        introductionMessage,
        teamsThread,
        Number.parseInt(membersPerTeam?.toString() ?? ""),
        Number.parseInt(maxTeams?.toString() ?? ""),
        formattedDate,
        async () => {
          sendBracket(
            name?.toString(),
            registeredUsers,
            interaction,
            endDateRegister?.toString(),
            createdChannel
          );
        }
      );

      await interaction.editReply({
        content: `Tournament created successfully. Check <#${createdChannel.id}>`,
      });
    } catch (ex: Error | any) {
      Sentry.captureException(ex);
    }
  },
});

async function createTimer(
  formattedDate: moment.Moment,
  channel: TextChannel,
  guild: Guild,
  onTimerEnded: () => Promise<void>
): Promise<void> {
  try {
    const timer = new EmbedBuilder();
    timer.setTitle(`Time left to register: ${formattedDate}`);
    timer.setThumbnail(Constants.timer.name);

    const message = await channel.send({
      embeds: [timer],
    });

    const intervalId = setInterval(async () => {
      const difference = moment(formattedDate).diff(Date.now());
      const time = humanizeDuration(difference, {
        maxDecimalPoints: 0,
        round: true,
      });

      timer.setTitle(`Time left to register: ${time}`);

      await message
        .edit({
          embeds: [timer],
        })
        .catch((_) => {
          clearInterval(intervalId);
        });

      if (difference <= 0) {
        await channel.permissionOverwrites.edit(guild.roles.everyone.id, {
          SendMessages: false,
        });
        await onTimerEnded();
        clearInterval(intervalId);
      }
    }, 1000);
  } catch (ex: Error | any) {
    Sentry.captureException(ex);
  }
}

async function createThreads(
  createdChannel: TextChannel
): Promise<ThreadChannel<boolean>> {
  await createdChannel.threads.create({
    name: "Admin Notes",
    autoArchiveDuration: ThreadAutoArchiveDuration.OneWeek,
    type: ChannelType.PrivateThread,
  });

  const rulesThread = await createdChannel.threads.create({
    name: "Rules",
    autoArchiveDuration: ThreadAutoArchiveDuration.OneWeek,
    type: ChannelType.PublicThread,
  });
  await rulesThread.setLocked(true);

  const teamsThread = await createdChannel.threads.create({
    name: "Teams",
    autoArchiveDuration: ThreadAutoArchiveDuration.OneWeek,
    type: ChannelType.PublicThread,
    invitable: false,
  });
  await teamsThread.setLocked(true);

  return teamsThread;
}

async function sendBracket(
  name: string | undefined,
  registeredUsers: RegisteredTeam[],
  interaction: any,
  endDateRegister: string | undefined,
  createdChannel: TextChannel
) {
  if (registeredUsers.length < 2) {
    await createdChannel.send({
      content: "Not enough teams registered.",
    });
    return;
  }

  const buffer = await createBracket(
    name?.toString() ?? "Tournament",
    registeredUsers,
    interaction.user.tag,
    endDateRegister?.toString() ?? ""
  );

  const bracket = new AttachmentBuilder(buffer, {
    name: "bracket.png",
  });

  const bracketEmbed = new EmbedBuilder()
    .setTitle("Registrations have ended!!")
    .setColor(ColorCodes.primaryColor)
    .setDescription("The tournament bracket is ready.");

  await createdChannel.send({
    embeds: [bracketEmbed],
  });
  await createdChannel.send({
    files: [bracket],
  });
}
