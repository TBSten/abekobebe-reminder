import { NextRequest } from "next/server";

const DISCORD_WEBHOOK_URL = process.env.DISCORD_WEBHOOK_URL as string

export const GET = async (request: NextRequest) => {
    const authHeader = request.headers.get('authorization');
    if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
      return new Response('Unauthorized', {
        status: 401,
      });
    }

    const now = new Date()
    const webhookResponse = await fetch(DISCORD_WEBHOOK_URL, {
        method: 'POST',
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            "content": `${now.getMonth() + 1}/${now.getDate()}~${now.getMonth() + 1}/${now.getDate() + 1 + 7} の ペアプロ/レビュー会 @チームF`,
            "allowed_mentions": {
                "parse": ["roles"],
            },
        }),
    })

    console.log("webhookResponse", webhookResponse)

    return Response.json({ success: true });
}
