import { AttachmentBuilder, TextChannel, VoiceChannel } from "discord.js";
import { Event } from "../structures/Event";
import { Canvas, loadImage } from "canvas";
import {
  discordControllerGetMemberCount,
  discordControllerGetWelcomeMessage,
} from "../client";

export default new Event("guildMemberAdd", async (member) => {
  try {
    const [response, response2] = await Promise.all([
      discordControllerGetWelcomeMessage({
        path: {
          guildId: member.guild.id,
        },
      }),
      discordControllerGetMemberCount({
        path: {
          guildId: member.guild.id,
        },
      }),
    ]);
    const welcome = response.data;

    if (!welcome) {
      return;
    }

    const logChannel = member.guild.channels.cache.find(
      (channel) => channel.id == welcome.channelId
    );

    if (!logChannel || !(logChannel instanceof TextChannel)) {
      return;
    }

    const canvas = new Canvas(1024, 500);
    const ctx = canvas.getContext("2d");

    const font = "sans-serif";
    const font_color = "#ffffff";
    const title = `${member.user.username} has joined the server`;
    const subtitle = `${member.guild.name} now has ${member.guild.memberCount} members!`;

    ctx.font = `42px ${font}`;
    ctx.textAlign = "center";
    ctx.fillStyle = font_color;
    ctx.fillText(title, 512, 390, 950);

    ctx.font = `32px ${font}`;
    ctx.fillStyle = font_color;
    ctx.fillText(subtitle, 512, 440, 950);

    ctx.beginPath();
    ctx.arc(512, 179, 129, 0, Math.PI * 2, true);
    ctx.stroke();
    ctx.fill();

    ctx.beginPath();
    ctx.arc(512, 179, 119, 0, Math.PI * 2, true);
    ctx.closePath();
    ctx.clip();

    const avatar = await loadImage(
      member.user.displayAvatarURL({ extension: "jpg", size: 1024 })
    );
    ctx.drawImage(avatar, 393, 60, 238, 238);

    const card = new AttachmentBuilder(canvas.toBuffer(), {
      name: "card.png",
    });

    const content = `Hallo ${member}, Welkom bij ${member.guild.name}! Lees <#1021479095877505085> en verifieer jezelf in <#1021479095877505085>`;

    logChannel.send({
      content: content,
      files: [card],
    });

    const memberCount = response2.data;

    const memberCountChannel = member.guild.channels.cache.find(
      (channel) => channel.id == memberCount.channelId
    );

    if (memberCountChannel && memberCountChannel instanceof VoiceChannel) {
      memberCountChannel.setName(`Members: ${member.guild.memberCount}`);
    }
  } catch (_) {
    // NOOP
  }
});
