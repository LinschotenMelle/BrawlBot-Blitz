import { AttachmentBuilder, TextChannel } from "discord.js";
import { Event } from "../structures/Event";
import Jimp = require("jimp");

export default new Event("guildMemberAdd", async (member) => {
  member.send("Welcome to the server!");

  const logChannel = member.guild.channels.cache.find(
    (channel) => channel.id == process.env.TEST_CHANNEL_ID
  );

  // const image = await Jimp.read("welcome.png");

  // image.composite(
  //   await Jimp.read(member.user.displayAvatarURL({ extension: "png" })),
  //   100,
  //   100
  // );

  // const font = await Jimp.loadFont(Jimp.FONT_SANS_64_BLACK);
  // image.print(font, 100, 300, member.user.username);

  // const buffer = await image.getBufferAsync(Jimp.MIME_PNG);

  // const attachment = new AttachmentBuilder(buffer, {
  //   name: `welcome-${member.user.globalName}-image.png`,
  // });

  if (!logChannel || !(logChannel instanceof TextChannel)) {
    return console.log("Log channel not found!");
  }

  logChannel.send({
    content: `Welcome to the server, ${member}!`,
    // files: [attachment],
  });
});
