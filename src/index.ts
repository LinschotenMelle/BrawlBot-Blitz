import 'dotenv/config';
import { Client } from "discord.js";

const client = new Client({
    intents: ['Guilds', 'GuildMessages', 'GuildMembers', 'MessageContent'],
})

client.on('ready', (e) => {
    console.log(`${e.user.username} is online.`)
});

client.login(process.env.TOKEN)

client.on('messageCreate', (message) => {
    if (message.channel.id !== "1224808943251882003") {
        return;
    }

    if (message.content === '!ping') {
        console.log(message.author.username);
        message.channel.send('hoi')
    }
});