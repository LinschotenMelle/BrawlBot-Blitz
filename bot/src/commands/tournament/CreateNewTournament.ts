import {
  ApplicationCommandOptionType,
  AttachmentBuilder,
  ChannelType,
  EmbedBuilder,
  Guild,
  Message,
  PermissionFlagsBits,
  TextChannel,
  ThreadAutoArchiveDuration,
} from "discord.js";
import { CommandTypes } from "../../core/enums/CommandType";
import { Command } from "../../structures/Command";
import { ColorCodes } from "../../static/Theme";
import { client } from "../..";
import { Constants } from "../../static/Contants";
import axios from "axios";
import { BrawlStarsService } from "../../core/services/Brawlstars-service";
import { BrawlStarsPlayer } from "../../core/dto/brawlstars/Player.dto";
import moment = require("moment");
import humanizeDuration = require("humanize-duration");
import { createCanvas, loadImage, registerFont } from "canvas";
import * as Sentry from "@sentry/browser";

interface ImageToTextResponse {
  annotations: string[];
}

export class RegisteredTeam {
  public teamName!: string;
  public member1!: string;
  public user1!: BrawlStarsPlayer;
  public member2!: string;
  public user2!: BrawlStarsPlayer;
}

export default new Command({
  name: "create-new-tournament",
  description: "Create a new tournament",
  userPermission: [PermissionFlagsBits.ManageGuild],
  category: CommandTypes.OTHER,
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
  ],
  run: async ({ interaction }) => {
    try {
      const name = interaction.options.get("name")?.value;
      const role = interaction.options.get("role")?.value;

      const endDateRegister =
        interaction.options.get("end-date-register")?.value;

      await interaction.editReply({
        content:
          "Please provide a description for the tournament. Type `skip` to skip this step.",
      });

      const collector = interaction.channel?.createMessageCollector({
        filter: (i) => i.author.id === interaction.user.id,
        max: 1,
      });

      if (!collector) return;

      collector.on("collect", async (response) => {
        const desc = response.content;

        const guild = client.guilds.cache.get(interaction.guildId ?? "");

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

        collector?.dispose(response);

        const registeredUsers: RegisteredTeam[] = [];

        const embed = new EmbedBuilder()
          .setTitle(name?.toString() ?? "Tournament")
          .addFields({
            name: `Total Registered Teams: ${registeredUsers.length}`,
            value:
              "Register below by sending 2 different attachments with your tags.",
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

        var formattedDate = moment(endDateRegister?.toString(), "DD-MM HH:mm");

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
          try {
            await createTimer(
              formattedDate,
              createdChannel,
              guild,
              async () => {
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
                  endDateRegister.toString()
                );

                const bracket = new AttachmentBuilder(buffer, {
                  name: "bracket.png",
                });

                const bracketEmbed = new EmbedBuilder()
                  .setTitle("Regitrations have ended!!")
                  .setColor(ColorCodes.primaryColor)
                  .setDescription("The tournament bracket is ready.");

                createdChannel.send({
                  embeds: [bracketEmbed],
                });
                createdChannel.send({
                  files: [bracket],
                });
              }
            );
          } catch (ex: Error | any) {
            console.log("hier komt ie in");
            Sentry.captureException(ex);
          }
        }

        // Create a thread for the admin notes
        await createdChannel.threads.create({
          name: "Admin Notes",
          autoArchiveDuration: ThreadAutoArchiveDuration.OneWeek,
          type: ChannelType.PrivateThread,
        });

        // Create a thread for the tournament rules
        const rulesThread = await createdChannel.threads.create({
          name: "Rules",
          autoArchiveDuration: ThreadAutoArchiveDuration.OneWeek,
          type: ChannelType.PublicThread,
        });
        await rulesThread.setLocked(true);

        // Create a thread that show the teams
        const teamsThread = await createdChannel.threads.create({
          name: "Teams",
          autoArchiveDuration: ThreadAutoArchiveDuration.OneWeek,
          type: ChannelType.PublicThread,
          invitable: false,
        });
        await teamsThread.setLocked(true);

        const channelCollector = createdChannel.createMessageCollector({
          filter: (i) => !i.author.bot,
        });

        if (!channelCollector) return;

        channelCollector.on("collect", async (msg) => {
          try {
            const [teamName, member1, member2] = validateParams(
              msg,
              guild,
              registeredUsers
            );

            const [tag1, tag2] = await validateAttachments(
              msg,
              registeredUsers
            );

            const user1 = await BrawlStarsService.instance.getProfileByTag(
              `%23${tag1}`
            );

            const user2 = await BrawlStarsService.instance.getProfileByTag(
              `%23${tag2}`
            );

            if (!user1 || !user2) {
              throw new Error("One of the users has not been found.");
            }

            registeredUsers.push({ teamName, member1, user1, member2, user2 });

            embed.setFields({
              name: `Total Registered Teams: ${registeredUsers.length}`,
              value:
                "Register below by sending 2 different attachments with your tags.",
            });

            introductionMessage.edit({
              embeds: [embed],
            });

            const registeryEmbed = new EmbedBuilder()
              .setTitle("Registered")
              .setColor(ColorCodes.primaryColor)
              .setDescription(
                `${user1?.name} and ${user2?.name} have been registered.`
              );

            msg.member?.send({
              embeds: [registeryEmbed],
            });

            const teamEmbed = new EmbedBuilder()
              .setTitle(`#${registeredUsers.length} ${teamName}`)
              .setColor(ColorCodes.primaryColor)
              .setDescription(
                `${user1?.name} - ${user1?.tag}\n${user2?.name} - ${user2?.tag}`
              );

            teamsThread.send({
              embeds: [teamEmbed],
            });
          } catch (ex: Error | any) {
            Sentry.captureException(ex);
            const errorEmbed = new EmbedBuilder()
              .setColor(ColorCodes.errorRedColor)
              .setTitle("Error")
              .setDescription(ex.message);

            msg.member?.send({
              embeds: [errorEmbed],
            });
          }

          msg.delete();
        });

        await interaction.channel?.messages.delete(response.id);
        interaction.editReply({
          content: `Tournament created successfully. Check <#${createdChannel.id}>`,
        });
      });
    } catch (ex: Error | any) {
      Sentry.captureException(ex);
    }
  },
});

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
        onTimerEnded();
        clearInterval(intervalId);
      }
    }, 1000);
  } catch (ex: Error | any) {
    Sentry.captureException(ex);
  }
}

function validateParams(
  msg: Message,
  guild: Guild,
  registeredUsers: RegisteredTeam[]
): string[] {
  const text = msg.content;

  const member1 = msg.member;
  const member2Text = text.substring(0, text.indexOf(" ") - 1);
  const member2Id = member2Text.substring(2, member2Text.length);
  const member2 = guild.members.cache.find((member) => member.id === member2Id);

  const teamName = text.substring(text.indexOf(" ") + 1);

  if (!teamName || !member1 || !member2) {
    throw new Error(
      "Invalid text format. Please provide a valid format.\n Example: `<@Member2> TeamName`"
    );
  }

  if (
    registeredUsers.find(
      (u) => u.member1 === member1?.id || u.member2 === member1?.id
    ) ||
    registeredUsers.find(
      (u) => u.member1 === member2?.id || u.member2 === member2?.id
    )
  ) {
    throw new Error("One of the discord users has already been registered.");
  }

  if (registeredUsers.find((u) => u.teamName === teamName)) {
    throw new Error("Team name already exists. Choose a unique name.");
  }

  if (member1?.id === member2?.id) {
    throw new Error("Members should be different.");
  }

  if (member1.user.bot || member2.user.bot) {
    throw new Error("Bots are not allowed to participate.");
  }

  return [teamName, member1?.id, member2?.id];
}

async function validateAttachments(
  msg: Message,
  registeredUsers: RegisteredTeam[]
): Promise<string[]> {
  const [firstAttachment, secondAttachment] = Array.from(
    msg.attachments.values()
  );

  if (msg.attachments.size < 2) {
    throw new Error(
      "Please provide 2 different attachments. The text in the attachments should be different."
    );
  }

  const tag1 = await recognizeImage(firstAttachment.url);

  const tag2 = await recognizeImage(secondAttachment.url);

  if (tag1 === tag2) {
    throw new Error(
      "Please provide 2 different attachments. The text in the attachments should be different."
    );
  }

  if (
    registeredUsers.find((u) => u.user1.tag === tag1 || u.user2.tag === tag1) ||
    registeredUsers.find((u) => u.user1.tag === tag2 || u.user2.tag === tag2)
  ) {
    throw new Error("One of the users has already been registered.");
  }

  return [tag1, tag2];
}

function calculateTotalColumns(teamsLength: number, initialTeams: number) {
  let totalColumns = initialTeams;
  while (totalColumns < teamsLength) {
    totalColumns *= 2;
  }
  return totalColumns;
}

function shuffleArray(array: RegisteredTeam[]): RegisteredTeam[] {
  for (var i = array.length - 1; i > 0; i--) {
    var j = Math.floor(Math.random() * (i + 1));
    var temp = array[i];
    array[i] = array[j];
    array[j] = temp;
  }

  return array;
}

async function createBracket(
  title: string,
  teams: RegisteredTeam[],
  creator: string,
  time: string
): Promise<Buffer> {
  registerFont(require("@canvas-fonts/helveticaneue"), {
    family: "HelveticaNeue",
  });
  const initialTeams = 2;
  const totalColumns = calculateTotalColumns(teams.length, initialTeams);
  const totalRounds = Math.log2(totalColumns) + 1;

  const canvas = createCanvas(0, 0);
  const ctx = canvas.getContext("2d");

  const shuffedArray = shuffleArray(teams);
  const longestName = teams.sort(
    (a, b) => b.teamName.length - a.teamName.length
  )[0].teamName;

  // Draw the rectangles
  const rectWidth =
    longestName.length * 10 <= 180 ? 180 : longestName.length * 10;
  const rectHeight = 30;
  const spacing = 20;
  const lineWidth = 1;
  const bottomBarHeight = 30;

  const totalWidth = (rectWidth + spacing) * totalRounds * 1.5;
  canvas.width = totalWidth;
  canvas.height =
    totalColumns * (rectHeight + spacing) -
    spacing +
    (bottomBarHeight + spacing);

  ctx.fillStyle = "#f3f4f5";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // Stroked triangle
  ctx.fillStyle = "#fff";
  const triangleWidth =
    totalRounds - 2 == 0
      ? canvas.height / totalRounds
      : canvas.height / (totalRounds - 2);
  ctx.beginPath();
  ctx.moveTo(canvas.width, canvas.height - bottomBarHeight);
  ctx.lineTo(canvas.width - triangleWidth, canvas.height - bottomBarHeight);
  ctx.lineTo(canvas.width, canvas.height - bottomBarHeight - triangleWidth);
  ctx.closePath();
  ctx.fill();

  var fontSize = 30;
  if (teams.length <= 2) {
    fontSize = 20;
  }
  ctx.fillStyle = "#000";
  ctx.font = `${fontSize}px "HelveticaNeue"`;
  ctx.fillText(
    title,
    totalWidth - title.length * (fontSize / 2),
    fontSize,
    totalWidth
  );
  ctx.fillStyle = "#008E4F";
  ctx.fillRect(totalWidth - 6, 4, totalWidth, fontSize);

  for (var i = 0; i < totalColumns; i++) {
    ctx.fillStyle = "#D8D9D9";
    ctx.fillRect(0, i * (rectHeight + spacing), rectWidth, rectHeight);
    ctx.fillStyle = "#000";
    ctx.fillRect(0, i * (rectHeight + spacing), 6, rectHeight);

    // Lines
    ctx.fillRect(
      rectWidth,
      i * (rectHeight + spacing) + rectHeight / 2,
      spacing * lineWidth,
      lineWidth
    );
    if (i % 2 == 0) {
      ctx.fillRect(
        rectWidth + spacing * lineWidth,
        i * (rectHeight + spacing) + rectHeight / 2,
        lineWidth,
        (rectHeight + spacing) / 2
      );
    } else {
      ctx.fillRect(
        rectWidth + spacing * lineWidth,
        i * (rectHeight + spacing) + rectHeight / 2 + lineWidth,
        lineWidth,
        -(rectHeight + spacing) / 2
      );
    }
  }

  ctx.font = `14px "HelveticaNeue"`;
  for (var i = 0; i < shuffedArray.length; i++) {
    ctx.fillText(
      shuffedArray[i].teamName,
      10,
      20 + i * (rectHeight + spacing),
      rectWidth
    );
  }

  var totalPerRound = totalColumns / 2;
  var y = 2;
  var y2 = 0;
  for (var i = 0; i < totalRounds - 1; i++) {
    for (var j = 0; j < totalPerRound; j++) {
      // Line
      ctx.fillStyle = "#000";
      ctx.fillRect(
        (1.5 * i + 1.5) * (rectWidth + spacing) - spacing * 5,
        (y * j + (y2 + 0.5)) * (rectHeight + spacing) + rectHeight / 2,
        spacing * 5,
        lineWidth
      );
      if (1 != totalPerRound) {
        ctx.fillRect(
          (1.5 * i + 1.5) * (rectWidth + spacing) + rectWidth,
          (y * j + (y2 + 0.5)) * (rectHeight + spacing) + rectHeight / 2,
          spacing * lineWidth,
          lineWidth
        );
        if (j % 2 == 0) {
          ctx.fillRect(
            (1.5 * i + 1.5) * (rectWidth + spacing) +
              rectWidth +
              spacing * lineWidth,
            (y * j + (y2 + 0.5)) * (rectHeight + spacing) + rectHeight / 2,
            lineWidth,
            (rectHeight + spacing) * (y2 + 1)
          );
        } else {
          ctx.fillRect(
            (1.5 * i + 1.5) * (rectWidth + spacing) +
              rectWidth +
              spacing * lineWidth,
            (y * j + (y2 + 0.5)) * (rectHeight + spacing) +
              rectHeight / 2 +
              lineWidth,
            lineWidth,
            -(rectHeight + spacing) * (y2 + 1)
          );
        }
      }
      // Rectangle
      ctx.fillStyle = "#D8D9D9";
      ctx.fillRect(
        (1.5 * i + 1.5) * (rectWidth + spacing),
        (y * j + (y2 + 0.5)) * (rectHeight + spacing),
        rectWidth,
        rectHeight
      );
      if (i % 2 == 0) {
        ctx.fillStyle = "#008E4F";
      } else {
        ctx.fillStyle = "#000";
      }
      ctx.fillRect(
        (1.5 * i + 1.5) * (rectWidth + spacing),
        (y * j + (y2 + 0.5)) * (rectHeight + spacing),
        6,
        rectHeight
      );
    }
    totalPerRound /= 2;
    y *= 2;
    if (y2 == 0) {
      y2 = 1;
    } else {
      y2 = y2 + y2 + 1;
    }
  }

  const trophyImage = await loadImage(
    "https://images.emojiterra.com/google/noto-emoji/unicode-15.1/bw/128px/1f3c6.png"
  );

  var size = trophyImage.width;

  if (totalColumns <= 4) {
    size = 60;
  }
  if (totalColumns <= 2) {
    size = 30;
  }

  var math = totalRounds;
  if (totalColumns == 8) {
    math = 5;
  }

  ctx.drawImage(
    trophyImage,
    (totalWidth / totalRounds) * (totalRounds - 1) + (rectWidth - size) / 2,
    (totalColumns / 2 - 1) * (rectHeight + spacing) +
      (rectHeight - size) +
      rectHeight * math,
    size,
    size
  );

  // Bottom bar
  ctx.fillStyle = "#000";
  ctx.fillRect(
    0,
    canvas.height - bottomBarHeight,
    canvas.width,
    bottomBarHeight
  );
  ctx.fillStyle = "#008E4F";
  ctx.fillRect(
    canvas.width - triangleWidth,
    canvas.height - bottomBarHeight,
    triangleWidth,
    bottomBarHeight
  );
  ctx.beginPath();
  ctx.moveTo(canvas.width - triangleWidth + 1, canvas.height);
  ctx.lineTo(canvas.width - triangleWidth + 1, canvas.height - bottomBarHeight);
  ctx.lineTo(canvas.width - triangleWidth - 30, canvas.height);
  ctx.closePath();
  ctx.fill();
  ctx.fillStyle = "#fff";
  ctx.fillText(
    `Made by: ${creator} - Created at: ${time}`,
    4,
    canvas.height - 10,
    canvas.width
  );

  return canvas.toBuffer();
}
