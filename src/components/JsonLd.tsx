import { faqs } from "@/lib/faq";

export function HomeJsonLd() {
    const data = {
        "@context": "https://schema.org",
        "@graph": [
            {
                "@type": "WebApplication",
                name: "RoastGit",
                url: "https://roastgit.in",
                description:
                    "AI-powered GitHub profile roasting tool. Analyze repos, commits, and activity to get an honest, tasteful roast.",
                applicationCategory: "DeveloperApplication",
                operatingSystem: "Web",
                offers: {
                    "@type": "Offer",
                    price: "0",
                    priceCurrency: "USD",
                },
                sameAs: [
                    "https://x.com/shxrdexe",
                    "https://github.com/carnifex-cmd/roastGit",
                ],
            },
            {
                "@type": "FAQPage",
                mainEntity: faqs.map((faq) => ({
                    "@type": "Question",
                    name: faq.question,
                    acceptedAnswer: {
                        "@type": "Answer",
                        text: faq.answer,
                    },
                })),
            },
        ],
    };

    return (
        <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
        />
    );
}

export function RoastJsonLd({
    username,
    score,
    verdict,
}: {
    username: string;
    score?: number;
    verdict?: string;
}) {
    const data = {
        "@context": "https://schema.org",
        "@graph": [
            {
                "@type": "Review",
                name: `GitHub Profile Roast for @${username}`,
                ...(verdict && { reviewBody: verdict }),
                author: {
                    "@type": "Organization",
                    name: "RoastGit",
                    url: "https://roastgit.in",
                },
                itemReviewed: {
                    "@type": "WebPage",
                    url: `https://github.com/${username}`,
                    name: `${username}'s GitHub Profile`,
                },
                ...(score && {
                    reviewRating: {
                        "@type": "Rating",
                        ratingValue: score,
                        bestRating: 10,
                        worstRating: 1,
                    },
                }),
            },
            {
                "@type": "BreadcrumbList",
                itemListElement: [
                    {
                        "@type": "ListItem",
                        position: 1,
                        name: "Home",
                        item: "https://roastgit.in",
                    },
                    {
                        "@type": "ListItem",
                        position: 2,
                        name: `@${username}'s Roast`,
                        item: `https://roastgit.in/roast/${username}`,
                    },
                ],
            },
        ],
    };

    return (
        <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
        />
    );
}
