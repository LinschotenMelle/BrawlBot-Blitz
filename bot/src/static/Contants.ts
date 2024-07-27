import { AttachmentBuilder } from "discord.js";

export class BBAttachment {
  private initName!: string;

  constructor(name: string) {
    this.initName = name;
  }

  public get attachment(): AttachmentBuilder {
    return new AttachmentBuilder(`./src/assets/${this.initName}`);
  }

  public get name(): string {
    return `attachment://${this.initName}`;
  }
}

export class Constants {
  private constructor() {
    throw new Error("Constants cannot be initialized");
  }

  static ab_logo = new AttachmentBuilder("./src/assets/logo.png");

  static timerGif: string =
    "https://cdn.discordapp.com/attachments/636267043452223498/711689977200771112/517785620060438548.gif?ex=661c48f1&is=6609d3f1&hm=fd15fd13b45942c7a054e3200fef564d4902a32436bd99faddcd2cd7e79acbee&";
  static logo: BBAttachment = new BBAttachment("logo.png");
  static timer: BBAttachment = new BBAttachment("timer.gif");
}
