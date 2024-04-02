import { Command } from "../../structures/Command";

export default new Command({
    name: "verify",
    description: "Set your Brawl Stars Tag",
    run: async ({ interaction }) => {
        interaction.followUp("Pong3");
    }
});