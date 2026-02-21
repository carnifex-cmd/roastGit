import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "RoastGit | GitHub Profile Roast";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function OGImage({
    params,
}: {
    params: { username: string };
}) {
    return new ImageResponse(
        (
            <div
                style={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                    width: "100%",
                    height: "100%",
                    backgroundColor: "#1D1D1B",
                    color: "#F5F2ED",
                    fontFamily: "system-ui, sans-serif",
                    padding: "60px",
                }}
            >
                <div
                    style={{
                        display: "flex",
                        fontSize: "24px",
                        letterSpacing: "0.3em",
                        textTransform: "uppercase" as const,
                        opacity: 0.5,
                        marginBottom: "24px",
                    }}
                >
                    RoastGit
                </div>
                <div
                    style={{
                        display: "flex",
                        fontSize: "64px",
                        fontWeight: 700,
                        letterSpacing: "-0.03em",
                        marginBottom: "16px",
                    }}
                >
                    @{params.username}
                </div>
                <div
                    style={{
                        display: "flex",
                        fontSize: "28px",
                        opacity: 0.6,
                    }}
                >
                    GitHub Profile Roast Report
                </div>
            </div>
        ),
        { ...size }
    );
}
