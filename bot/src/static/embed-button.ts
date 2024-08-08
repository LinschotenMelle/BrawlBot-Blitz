import { ButtonBuilder, ButtonStyle } from "discord.js";

export class BBEmbedButton {
  private name!: string;
  private customID!: string;
  private style!: ButtonStyle;
  private isEnabled!: boolean;

  constructor(
    name: string,
    customId: string,
    style: ButtonStyle = ButtonStyle.Primary,
    initialDisabled: boolean = true
  ) {
    this.name = name;
    this.customID = customId;
    this.style = style;
    this.isEnabled = initialDisabled;
  }

  enabled(isEnabled: boolean = true): void {
    this.isEnabled = isEnabled;
  }

  private get _customId(): string {
    return `${this.customID}_${this.name}`;
  }

  public get button(): ButtonBuilder {
    return new ButtonBuilder()
      .setCustomId(this._customId)
      .setLabel(this.name)
      .setStyle(this.style ?? ButtonStyle.Primary)
      .setDisabled(!this.isEnabled);
  }

  public get customId(): string {
    return this._customId;
  }

  public get id(): string {
    return this._customId.split("_")[0];
  }

  public get displayName(): string {
    return this.name;
  }
}
