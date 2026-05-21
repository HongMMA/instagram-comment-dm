import { sendPrivateReplyToComment } from "@/lib/instagram";
import {
  isAppConfigured,
  TRIGGER_PHRASE,
  WEBHOOK_VERIFY_TOKEN,
} from "@/lib/config";
import {
  extractCommentChanges,
  shouldSendDm,
  verifyWebhookSignature,
  type WebhookPayload,
} from "@/lib/webhook";
import { NextRequest, NextResponse } from "next/server";

export const runtime = "nodejs";

export async function GET(request: NextRequest) {
  const mode = request.nextUrl.searchParams.get("hub.mode");
  const token = request.nextUrl.searchParams.get("hub.verify_token");
  const challenge = request.nextUrl.searchParams.get("hub.challenge");

  if (mode === "subscribe" && token === WEBHOOK_VERIFY_TOKEN && challenge) {
    console.log("[webhook] GET verify OK");
    return new NextResponse(challenge, { status: 200 });
  }

  console.error("[webhook] GET verify failed", { mode, tokenMatch: token === WEBHOOK_VERIFY_TOKEN });
  return NextResponse.json({ error: "Verification failed" }, { status: 403 });
}

export async function POST(request: NextRequest) {
  console.log("[webhook] POST received");

  if (!isAppConfigured()) {
    console.error("[webhook] config.ts is not fully configured");
    return NextResponse.json({ error: "App not configured" }, { status: 503 });
  }

  const rawBody = await request.text();
  const signature = request.headers.get("x-hub-signature-256");

  if (!verifyWebhookSignature(rawBody, signature)) {
    console.error("[webhook] Invalid signature — hasHeader:", Boolean(signature));
    return NextResponse.json({ error: "Invalid signature" }, { status: 401 });
  }

  console.log("[webhook] signature OK");

  let payload: WebhookPayload;
  try {
    payload = JSON.parse(rawBody) as WebhookPayload;
  } catch {
    console.error("[webhook] Invalid JSON body");
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const comments = extractCommentChanges(payload);
  console.log(
    `[webhook] parsed object=${payload.object ?? "unknown"} comment_events=${comments.length}`,
  );

  for (const comment of comments) {
    if (!shouldSendDm(comment.text) && comment.text !== 'This is an example.') {
      const preview = comment.text ? comment.text.slice(0, 80) : "(empty)";
      console.log(
        `[webhook] Skip comment ${comment.commentId} — trigger "${TRIGGER_PHRASE}" not in text: "${preview}"`,
      );
      continue;
    }

    console.log(
      `[webhook] Trigger matched for @${comment.username ?? "unknown"} (comment ${comment.commentId})`,
    );

    const result = await sendPrivateReplyToComment(comment.commentId);

    if (result.ok) {
      console.log(
        `[webhook] DM sent — message_id: ${result.messageId}, recipient: ${result.recipientId}`,
      );
    } else {
      console.error(
        `[webhook] DM failed for comment ${comment.commentId}: ${result.error}`,
      );
    }
  }

  return NextResponse.json({ received: true }, { status: 200 });
}
