// This file is auto-generated by @hey-api/openapi-ts

import { createClient, createConfig, type Options } from '@hey-api/client-axios';
import type { AuthControllerLoginData, AuthControllerLoginError, AuthControllerLoginResponse, AuthControllerRedirectData, AuthControllerRedirectError, AuthControllerRedirectResponse, AuthControllerMeData, AuthControllerMeError, AuthControllerMeResponse, AuthControllerLogoutData, AuthControllerLogoutError, AuthControllerLogoutResponse, DiscordControllerGetGuildsData, DiscordControllerGetGuildsError, DiscordControllerGetGuildsResponse, DiscordControllerGetGuildDetailsData, DiscordControllerGetGuildDetailsError, DiscordControllerGetGuildDetailsResponse, DiscordControllerGetGuildChannelsData, DiscordControllerGetGuildChannelsError, DiscordControllerGetGuildChannelsResponse, DiscordControllerGetWelcomeMessageData, DiscordControllerGetWelcomeMessageError, DiscordControllerGetWelcomeMessageResponse, DiscordControllerPostMemberCountData, DiscordControllerPostMemberCountError, DiscordControllerPostMemberCountResponse, DiscordControllerGetMemberCountData, DiscordControllerGetMemberCountError, DiscordControllerGetMemberCountResponse, YoutubeControllerCreateChannelData, YoutubeControllerCreateChannelError, YoutubeControllerCreateChannelResponse, YoutubeControllerGetChannelsData, YoutubeControllerGetChannelsError, YoutubeControllerGetChannelsResponse, YoutubeControllerGetChannelData, YoutubeControllerGetChannelError, YoutubeControllerGetChannelResponse, YoutubeControllerUpdateChannelData, YoutubeControllerUpdateChannelError, YoutubeControllerUpdateChannelResponse, OpenaiControllerCreateImageData, OpenaiControllerCreateImageError, OpenaiControllerCreateImageResponse, BrawlStarsControllerSaveProfileData, BrawlStarsControllerSaveProfileError, BrawlStarsControllerSaveProfileResponse, BrawlStarsControllerUpdateProfileData, BrawlStarsControllerUpdateProfileError, BrawlStarsControllerUpdateProfileResponse, BrawlStarsControllerGetProfileData, BrawlStarsControllerGetProfileError, BrawlStarsControllerGetProfileResponse } from './types.gen';

export const client = createClient(createConfig());

export const authControllerLogin = (options?: Options<AuthControllerLoginData>) => { return (options?.client ?? client).get<AuthControllerLoginResponse, AuthControllerLoginError>({
    ...options,
    url: '/api/auth/login'
}); };

export const authControllerRedirect = (options?: Options<AuthControllerRedirectData>) => { return (options?.client ?? client).get<AuthControllerRedirectResponse, AuthControllerRedirectError>({
    ...options,
    url: '/api/auth/redirect'
}); };

export const authControllerMe = (options?: Options<AuthControllerMeData>) => { return (options?.client ?? client).get<AuthControllerMeResponse, AuthControllerMeError>({
    ...options,
    url: '/api/auth/me'
}); };

export const authControllerLogout = (options?: Options<AuthControllerLogoutData>) => { return (options?.client ?? client).post<AuthControllerLogoutResponse, AuthControllerLogoutError>({
    ...options,
    url: '/api/auth/logout'
}); };

export const discordControllerGetGuilds = (options?: Options<DiscordControllerGetGuildsData>) => { return (options?.client ?? client).get<DiscordControllerGetGuildsResponse, DiscordControllerGetGuildsError>({
    ...options,
    url: '/api/discord/guilds'
}); };

export const discordControllerGetGuildDetails = (options: Options<DiscordControllerGetGuildDetailsData>) => { return (options?.client ?? client).get<DiscordControllerGetGuildDetailsResponse, DiscordControllerGetGuildDetailsError>({
    ...options,
    url: '/api/discord/guilds/{guildId}'
}); };

export const discordControllerGetGuildChannels = (options: Options<DiscordControllerGetGuildChannelsData>) => { return (options?.client ?? client).get<DiscordControllerGetGuildChannelsResponse, DiscordControllerGetGuildChannelsError>({
    ...options,
    url: '/api/discord/guilds/{guildId}/channels'
}); };

export const discordControllerGetWelcomeMessage = (options: Options<DiscordControllerGetWelcomeMessageData>) => { return (options?.client ?? client).get<DiscordControllerGetWelcomeMessageResponse, DiscordControllerGetWelcomeMessageError>({
    ...options,
    url: '/api/discord/guilds/{guildId}/welcome-message'
}); };

export const discordControllerPostMemberCount = (options: Options<DiscordControllerPostMemberCountData>) => { return (options?.client ?? client).post<DiscordControllerPostMemberCountResponse, DiscordControllerPostMemberCountError>({
    ...options,
    url: '/api/discord/guilds/{guildId}/member-count'
}); };

export const discordControllerGetMemberCount = (options: Options<DiscordControllerGetMemberCountData>) => { return (options?.client ?? client).get<DiscordControllerGetMemberCountResponse, DiscordControllerGetMemberCountError>({
    ...options,
    url: '/api/discord/guilds/{guildId}/member-count'
}); };

export const youtubeControllerCreateChannel = (options: Options<YoutubeControllerCreateChannelData>) => { return (options?.client ?? client).post<YoutubeControllerCreateChannelResponse, YoutubeControllerCreateChannelError>({
    ...options,
    url: '/api/youtube'
}); };

export const youtubeControllerGetChannels = (options?: Options<YoutubeControllerGetChannelsData>) => { return (options?.client ?? client).get<YoutubeControllerGetChannelsResponse, YoutubeControllerGetChannelsError>({
    ...options,
    url: '/api/youtube/channels'
}); };

export const youtubeControllerGetChannel = (options: Options<YoutubeControllerGetChannelData>) => { return (options?.client ?? client).get<YoutubeControllerGetChannelResponse, YoutubeControllerGetChannelError>({
    ...options,
    url: '/api/youtube/{guildId}'
}); };

export const youtubeControllerUpdateChannel = (options: Options<YoutubeControllerUpdateChannelData>) => { return (options?.client ?? client).put<YoutubeControllerUpdateChannelResponse, YoutubeControllerUpdateChannelError>({
    ...options,
    url: '/api/youtube/channels/{guildId}'
}); };

export const openaiControllerCreateImage = (options: Options<OpenaiControllerCreateImageData>) => { return (options?.client ?? client).post<OpenaiControllerCreateImageResponse, OpenaiControllerCreateImageError>({
    ...options,
    url: '/api/openai/generate-image'
}); };

export const brawlStarsControllerSaveProfile = (options: Options<BrawlStarsControllerSaveProfileData>) => { return (options?.client ?? client).post<BrawlStarsControllerSaveProfileResponse, BrawlStarsControllerSaveProfileError>({
    ...options,
    url: '/api/brawl-stars/save'
}); };

export const brawlStarsControllerUpdateProfile = (options: Options<BrawlStarsControllerUpdateProfileData>) => { return (options?.client ?? client).put<BrawlStarsControllerUpdateProfileResponse, BrawlStarsControllerUpdateProfileError>({
    ...options,
    url: '/api/brawl-stars/update'
}); };

export const brawlStarsControllerGetProfile = (options: Options<BrawlStarsControllerGetProfileData>) => { return (options?.client ?? client).get<BrawlStarsControllerGetProfileResponse, BrawlStarsControllerGetProfileError>({
    ...options,
    url: '/api/brawl-stars/profile/{userId}'
}); };