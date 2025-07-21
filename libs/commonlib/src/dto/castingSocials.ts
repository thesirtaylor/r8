import { SocialLinks } from '../protos_output/r8.pb';

export function toSocialLinks(raw: Record<string, any>): SocialLinks {
  return {
    facebook: raw.facebook ?? '',
    twitter: raw.twitter ?? '',
    linkedin: raw.linkedin ?? '',
    instagram: raw.instagram ?? '',
    youtube: raw.youtube ?? '',
    wechat: raw.wechat ?? '',
    telegram: raw.telegram ?? '',
    url: raw.url ?? '',
    truthSocials: raw.truthSocials ?? '',
    tiktok: raw.tiktok ?? '',
    threads: raw.threads ?? '',
    twitch: raw.twitch ?? '',
    snapchat: raw.snapchat ?? '',
    reddit: raw.reddit ?? '',
    quora: raw.quora ?? '',
    discord: raw.discord ?? '',
  };
}
