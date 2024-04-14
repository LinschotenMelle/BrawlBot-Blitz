import { CommandTypes } from "../../../core/enums/CommandType";
import { Command } from "../../structures/Command";

export default new Command({
  name: "ping",
  description: "replies with pong",
  category: CommandTypes.OTHER,
  run: async ({ interaction }) => {
    interaction.followUp("Pong3");
  },
});
