export type UserDetailsDto = {
  discordId: string;
  accessToken: string;
  refreshToken: string;
  username: string;
  discriminator: string;
  avatar: string | null;
};
