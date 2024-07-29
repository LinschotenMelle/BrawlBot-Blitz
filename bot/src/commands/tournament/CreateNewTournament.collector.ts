import {
  EmbedBuilder,
  Guild,
  Message,
  TextChannel,
  ThreadChannel,
} from "discord.js";
import { RegisteredTeam } from "./CreateNewTournament";
import { BrawlStarsService } from "../../core/services/Brawlstars-service";
import { ColorCodes } from "../../static/Theme";
import axios from "axios";
import * as Sentry from "@sentry/browser";

interface ImageToTextResponse {
  annotations: string[];
}

async function recognizeImage(url: string): Promise<string> {
  const response = await axios.get<ImageToTextResponse>(
    process.env.IMAGE_TO_TEXT_API_URL ?? "",
    {
      params: {
        url: url,
      },
      headers: {
        apikey: process.env.IMAGE_TO_TEXT_API_KEY,
      },
    }
  );
  const imageAnnotations = response.data.annotations;

  var index = 0;
  imageAnnotations.forEach((text, i) => {
    if (text.includes("#")) index = i;
  });

  return imageAnnotations[index + 1];
}

function validateParams(
  msg: Message,
  guild: Guild,
  registeredUsers: RegisteredTeam[],
  totalMembersPerTeam: number
): [string, string[]] {
  const text = msg.content;

  const memberIds = text
    .split(" ")
    .slice(0, totalMembersPerTeam)
    .map((mention) => mention.replace(/\D/g, ""));

  if (memberIds.length !== totalMembersPerTeam) {
    throw new Error(`Please mention exactly ${totalMembersPerTeam} members.`);
  }

  const members = memberIds.map((id) => guild.members.cache.get(id));

  if (members.includes(undefined)) {
    throw new Error("One of the mentioned users is not found in this guild.");
  }

  const teamName = text.split(" ").slice(totalMembersPerTeam).join(" ");

  if (!teamName) {
    throw new Error("Please provide a team name.");
  }

  if (
    registeredUsers.some((team) =>
      team.members.some((member) =>
        members.some((m) => m?.id === member.member)
      )
    )
  ) {
    throw new Error("One of the mentioned users is already registered.");
  }

  if (registeredUsers.some((team) => team.teamName === teamName)) {
    throw new Error("Team name already exists. Choose a unique name.");
  }

  return [teamName, memberIds as string[]];
}

async function validateAttachments(
  msg: Message,
  registeredUsers: RegisteredTeam[],
  totalMembersPerTeam: number
): Promise<string[]> {
  const attachments = Array.from(msg.attachments.values());

  if (attachments.length < totalMembersPerTeam) {
    throw new Error(
      `Please provide ${totalMembersPerTeam} different attachments.`
    );
  }

  const tags = await Promise.all(
    attachments.map(async (attachment) => await recognizeImage(attachment.url))
  );

  if (new Set(tags).size !== tags.length) {
    throw new Error("Please provide different attachments with unique tags.");
  }

  if (
    registeredUsers.some((team) =>
      team.members.some((member) => tags.includes(member.user.tag))
    )
  ) {
    throw new Error("One of the users is already registered.");
  }

  return tags;
}

export async function handleTeamRegistrations(
  createdChannel: TextChannel,
  guild: Guild,
  registeredUsers: RegisteredTeam[],
  embed: EmbedBuilder,
  introductionMessage: Message,
  teamsThread: ThreadChannel<boolean>,
  totalMembersPerTeam: number,
  maxTeams: number | undefined
): Promise<void> {
  const filter = (msg: Message) => !msg.author.bot;
  const collector = createdChannel.createMessageCollector({ filter });

  collector.on("collect", async (msg: Message) => {
    try {
      if (maxTeams && registeredUsers.length >= maxTeams) {
        throw new Error("Maximum teams have been registered.");
      }

      const [teamName, members] = validateParams(
        msg,
        guild,
        registeredUsers,
        totalMembersPerTeam
      );
      const tags = await validateAttachments(
        msg,
        registeredUsers,
        totalMembersPerTeam
      );

      const users = await Promise.all(
        tags.map(async (tag) => {
          const user = await BrawlStarsService.instance.getProfileByTag(
            `%23${tag}`
          );
          if (!user) {
            throw new Error(`User with tag ${tag} not found.`);
          }
          return user;
        })
      );

      const registeredTeam: RegisteredTeam = {
        teamName,
        members: members.map((member, index) => ({
          member,
          user: users[index],
        })),
      };

      registeredUsers.push(registeredTeam);

      embed.setFields({
        name: `Total Registered Teams: ${registeredUsers.length}`,
        value: "Register below by sending attachments with your tags.",
      });

      await introductionMessage.edit({ embeds: [embed] });

      const registeryEmbed = new EmbedBuilder()
        .setTitle("Registered")
        .setColor(ColorCodes.primaryColor)
        .setDescription(
          `${users.map((user) => user.name).join(", ")} have been registered.`
        );

      await msg.member?.send({ embeds: [registeryEmbed] });

      const teamEmbed = new EmbedBuilder()
        .setTitle(`#${registeredUsers.length} ${teamName}`)
        .setColor(ColorCodes.primaryColor)
        .setDescription(
          `${users.map((user) => `${user.name} - ${user.tag}`).join("\n")}`
        );

      await teamsThread.send({ embeds: [teamEmbed] });
    } catch (ex: Error | any) {
      Sentry.captureException(ex);
      const errorEmbed = new EmbedBuilder()
        .setColor(ColorCodes.errorRedColor)
        .setTitle("Error")
        .setDescription(ex.message);

      await msg.member?.send({ embeds: [errorEmbed] });
    }

    await msg.delete();
  });
}
