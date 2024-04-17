export type User = {
  id: string;
  discordId: string;
  avatar: string;
  username: string;
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
