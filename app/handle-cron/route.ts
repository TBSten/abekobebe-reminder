import { NextRequest } from "next/server";

const CRON_SECRET = process.env.CRON_SECRET as string
const DISCORD_WEBHOOK_URL = process.env.DISCORD_WEBHOOK_URL as string

const message = ()=> {
    const now = new Date()
    const after7Days = new Date(now.valueOf())
    after7Days.setDate(after7Days.getDate() + 7)
    return `
<@チームF>
${now.getMonth() + 1}/${now.getDate()}~${after7Days.getMonth() + 1}/${after7Days.getDate() + 1} の ペアプロ/レビュー会
`.trim()
}

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
