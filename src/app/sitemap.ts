import type { MetadataRoute } from "next";
import { getRecentRoasts } from "@/lib/cache";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
    const baseUrl = "https://roastgit.in";

    // Fetch recently roasted usernames for dynamic entries
    let usernames: string[] = [];
    try {
        usernames = await getRecentRoasts(200);
    } catch {
        // Redis unavailable — return static pages only
    }

    const staticPages: MetadataRoute.Sitemap = [
        {
            url: baseUrl,
            lastModified: new Date(),
            changeFrequency: "weekly",
            priority: 1.0,
        },
    ];

    const roastPages: MetadataRoute.Sitemap = usernames.map((username) => ({
        url: `${baseUrl}/roast/${username}`,
        lastModified: new Date(),
        changeFrequency: "monthly" as const,
        priority: 0.6,
    }));

    return [...staticPages, ...roastPages];
}

