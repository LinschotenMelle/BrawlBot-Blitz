import { User } from './typeorm/entities/User';

export type UserDetails = {
  discordId: string;
  accessToken: string;
  refreshToken: string;
  username: string;
  discriminator: string;
  avatar: string | null;
};

export type UpdateUserDetails = {
  accessToken: string;
  refreshToken: string;
};

export type PartialGuild = {
  id: string;
  name: string;
  icon: string;
  owner: boolean;
  permissions: number;
  features: string[];
  isActive: boolean;
};

export type Done = (error: Error, user: User) => void;
