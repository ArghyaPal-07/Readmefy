// Shared social-platform registry used by the Social Badges block.


export interface SocialPlatform {
  logo: string;
  color: string;
}

export const SOCIAL_PLATFORMS: Record<string, SocialPlatform> = {
  "Twitter/X": { logo: "x", color: "000000" },
  "LinkedIn": { logo: "linkedin", color: "0A66C2" },
  "GitHub": { logo: "github", color: "181717" },
  "Instagram": { logo: "instagram", color: "E4405F" },
  "YouTube": { logo: "youtube", color: "FF0000" },
  "Discord": { logo: "discord", color: "5865F2" },
  "Facebook": { logo: "facebook", color: "1877F2" },
  "Twitch": { logo: "twitch", color: "9146FF" },
  "TikTok": { logo: "tiktok", color: "000000" },
  "Reddit": { logo: "reddit", color: "FF4500" },
  "Medium": { logo: "medium", color: "000000" },
  "Dev.to": { logo: "devdotto", color: "0A0A0A" },
  "Hashnode": { logo: "hashnode", color: "2962FF" },
  "Stack Overflow": { logo: "stackoverflow", color: "F58025" },
  "Telegram": { logo: "telegram", color: "26A5E4" },
  "WhatsApp": { logo: "whatsapp", color: "25D366" },
  "Mastodon": { logo: "mastodon", color: "6364FF" },
  "Threads": { logo: "threads", color: "000000" },
  "Dribbble": { logo: "dribbble", color: "EA4C89" },
  "Behance": { logo: "behance", color: "1769FF" },
  "Spotify": { logo: "spotify", color: "1DB954" },
  "CodePen": { logo: "codepen", color: "000000" },
  "Patreon": { logo: "patreon", color: "FF424D" },
  "Buy Me a Coffee": { logo: "buymeacoffee", color: "FFDD00" },
  "Portfolio": { logo: "googlechrome", color: "0190FF" },
  "Email": { logo: "gmail", color: "EA4335" },
};

export const SOCIAL_PLATFORM_NAMES = Object.keys(SOCIAL_PLATFORMS);

export function getPlatform(name: string): SocialPlatform {
  return SOCIAL_PLATFORMS[name] || { logo: "github", color: "24292e" };
}

// Build a shields.io badge URL for a social item. 
export function socialBadgeUrl(
  platform: string,
  label: string,
  style: string,
  logoOnly: boolean
): string {
  const { logo, color } = getPlatform(platform);
  const text = logoOnly ? "" : encodeURIComponent(label || platform);
  return `https://img.shields.io/badge/${text}-${color}?style=${style}&logo=${logo}&logoColor=white`;
}
