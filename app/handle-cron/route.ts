import { NextRequest } from "next/server";

const CRON_SECRET = process.env.CRON_SECRET as string
const DISCORD_WEBHOOK_URL = process.env.DISCORD_WEBHOOK_URL as string
const TEAM_F_ROLE_ID = process.env.TEAM_F_ROLE_ID as string

const message = ()=> `
<@&${TEAM_F_ROLE_ID}>
今週のペアプロ/レビュー会
`.trim()

export const GET = async (request: NextRequest) => {
    const authHeader = request.headers.get('authorization');
    if (authHeader !== `Bearer ${CRON_SECRET}`) {
      return new Response('Unauthorized', {
        status: 401,
      });
    }

    const webhookResponse = await fetch(DISCORD_WEBHOOK_URL, {
        method: 'POST',
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            "content": message(),
            "allowed_mentions": {
                "parse": ["roles"],
            },
        }),
    })

    console.log("webhookResponse", webhookResponse)

    return Response.json({ success: true });
}
