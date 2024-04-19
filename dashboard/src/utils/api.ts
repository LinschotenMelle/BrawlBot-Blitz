import axios from "axios";
import { User } from "common/types/User";
import { PartialGuild } from "common/types/Guild";

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

export const postLogout = () =>
  axios.post("http://localhost:3001/api/auth/logout");
