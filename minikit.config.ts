const ROOT_URL =
  process.env.NEXT_PUBLIC_URL ||
  (process.env.VERCEL_PROJECT_PRODUCTION_URL
    ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
    : "http://localhost:3000");

/**
 * MiniApp configuration object. Must follow the Farcaster MiniApp specification.
 *
 * @see {@link https://miniapps.farcaster.xyz/docs/guides/publishing}
 * @see {@link https://docs.base.org/mini-apps/core-concepts/manifest}
 */
export const minikitConfig = {
  
  // Paste accountAssociation object here
  

  miniapp: {
    version: "1",
    name: "BaseGenius",
    subtitle: "Stay Updated, Earn Rewards",
    description:
      "Answer 5 questions about this week's Farcaster & Base news and earn an NFT badge! New questions every week.",
    screenshotUrls: [],
    iconUrl: `${ROOT_URL}/icon.png`,
    splashImageUrl: `${ROOT_URL}/splash.png`,
    splashBackgroundColor: "#0052FF",
    homeUrl: ROOT_URL,
    webhookUrl: `${ROOT_URL}/api/webhook`,
    primaryCategory: "games",
    tags: ["games", "education", "news", "nft"],
    heroImageUrl: `${ROOT_URL}/hero.png`,
    tagline: "Test your Base knowledge, win NFT badges",
    ogTitle: "BaseGenius",
    ogDescription:
      "Answer 5 questions about Farcaster & Base news. Score 5/5 to claim an exclusive NFT badge!",
    ogImageUrl: `${ROOT_URL}/hero.png`,
  },
} as const;
