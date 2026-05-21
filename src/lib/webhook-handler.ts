import { sendPrivateReplyToComment } from "@/lib/instagram";
import { isAppConfigured, TRIGGER_PHRASE } from "@/lib/config";
import {
  extractCommentChanges,
  shouldSendDm,
  verifyWebhookSignature,
  type WebhookPayload,
} from "@/lib/webhook";
import { NextRequest, NextResponse } from "next/server";

export type WebhookRouteConfig = {
  logTag: string;
  verifyToken: string;
  appSecret: string;
  isWebhookConfigured: () => boolean;
};

/** Meta Test 샘플 댓글 — 키워드 없어도 DM API 경로 테스트용 */
const META_TEST_COMMENT_TEXT = "This is an example.";

export function handleWebhookGet(
  request: NextRequest,
  config: WebhookRouteConfig,
): NextResponse {
  const mode = request.nextUrl.searchParams.get("hub.mode");
  const token = request.nextUrl.searchParams.get("hub.verify_token");
  const challenge = request.nextUrl.searchParams.get("hub.challenge");
  const { logTag, verifyToken } = config;

  if (mode === "subscribe" && token === verifyToken && challenge) {
    console.log(`[${logTag}] GET verify OK`);
    return new NextResponse(challenge, { status: 200 });
  }

  console.error(`[${logTag}] GET verify failed`, {
    mode,
    tokenMatch: token === verifyToken,
  });
  return NextResponse.json({ error: "Verification failed" }, { status: 403 });
}

export async function handleWebhookPost(
  request: NextRequest,
  config: WebhookRouteConfig,
): Promise<NextResponse> {
  const { logTag, appSecret, isWebhookConfigured } = config;
  console.log(`[${logTag}] POST received`);

  if (!isWebhookConfigured()) {
    console.error(`[${logTag}] webhook secret/token not configured`);
    return NextResponse.json({ error: "Webhook not configured" }, { status: 503 });
  }

  if (!isAppConfigured()) {
    console.error(`[${logTag}] DM config (Instagram token/ID) not configured`);
    return NextResponse.json({ error: "App not configured" }, { status: 503 });
  }

  const rawBody = await request.text();
  const signature = request.headers.get("x-hub-signature-256");

  if (!verifyWebhookSignature(rawBody, signature, appSecret)) {
    console.error(
      `[${logTag}] Invalid signature — hasHeader:`,
      Boolean(signature),
      `bodyBytes:`,
      rawBody.length,
    );
    return NextResponse.json({ error: "Invalid signature" }, { status: 401 });
  }

  console.log(`[${logTag}] signature OK`);

  let payload: WebhookPayload;
  try {
    payload = JSON.parse(rawBody) as WebhookPayload;
  } catch {
    console.error(`[${logTag}] Invalid JSON body`);
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const comments = extractCommentChanges(payload);
  console.log(
    `[${logTag}] parsed object=${payload.object ?? "unknown"} comment_events=${comments.length}`,
  );

  for (const comment of comments) {
    const isMetaTestSample = comment.text === META_TEST_COMMENT_TEXT;
    if (!shouldSendDm(comment.text) && !isMetaTestSample) {
      const preview = comment.text ? comment.text.slice(0, 80) : "(empty)";
      console.log(
        `[${logTag}] Skip comment ${comment.commentId} — trigger "${TRIGGER_PHRASE}" not in text: "${preview}"`,
      );
      continue;
    }

    console.log(
      `[${logTag}] Trigger matched for @${comment.username ?? "unknown"} (comment ${comment.commentId})`,
    );

    const result = await sendPrivateReplyToComment(comment.commentId);

    if (result.ok) {
      console.log(
        `[${logTag}] DM sent — message_id: ${result.messageId}, recipient: ${result.recipientId}`,
      );
    } else {
      console.error(
        `[${logTag}] DM failed for comment ${comment.commentId}: ${result.error}`,
      );
    }
  }

  return NextResponse.json({ received: true }, { status: 200 });
}
