import { Role } from "./Role";

export type Guild = {
  id: string;
  name: string;
  icon: string | null;
  description: string | null;
  splash: string | null;
  owner: boolean;
  permissions: number;
  features: string[];
  isActive: boolean;
  roles: Role[];
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
