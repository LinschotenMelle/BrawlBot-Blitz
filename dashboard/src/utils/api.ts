import axios from "axios";
import { PartialGuild, User } from "./types";

export const getAuthStatus = () =>
  axios.get<User>("http://localhost:3001/api/auth/me", {
    withCredentials: true,
  });

export const getGuilds = () =>
  axios.get<PartialGuild[]>("http://localhost:3001/api/discord/guilds", {
    withCredentials: true,
  });

export const getGuildDetails = (guildId: string) =>
  axios.get<PartialGuild[]>(
    `http://localhost:3001/api/discord/guild/${guildId}`,
    {
      withCredentials: true,
    }
  );
