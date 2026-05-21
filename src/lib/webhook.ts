import { createHmac, timingSafeEqual } from "crypto";
import { TRIGGER_PHRASE } from "./config";

export type CommentChange = {
  commentId: string;
  text: string;
  username?: string;
  userId?: string;
  mediaId?: string;
};

type WebhookChange = {
  field: string;
  value: {
    id?: string;
    text?: string;
    from?: { id: string; username: string };
    media?: { id: string };
  };
};

type WebhookEntry = {
  id: string;
  time: number;
  changes?: WebhookChange[];
};

export type WebhookPayload = {
  object?: string;
  entry?: WebhookEntry[];
};

export function verifyWebhookSignature(
  rawBody: string,
  signatureHeader: string | null,
  appSecret: string,
): boolean {
  if (!signatureHeader?.startsWith("sha256=")) {
    return false;
  }

  const expected = createHmac("sha256", appSecret.trim())
    .update(rawBody)
    .digest("hex");
  const received = signatureHeader.slice(7);

  try {
    return timingSafeEqual(
      Buffer.from(expected, "utf8"),
      Buffer.from(received, "utf8"),
    );
  } catch {
    return false;
  }
}

export function extractCommentChanges(payload: WebhookPayload): CommentChange[] {
  const results: CommentChange[] = [];

  for (const entry of payload.entry ?? []) {
    for (const change of entry.changes ?? []) {
      if (change.field !== "comments") continue;

      const value = change.value;
      const commentId = value.id;
      const text = value.text ?? "";

      if (!commentId) continue;

      results.push({
        commentId,
        text,
        username: value.from?.username,
        userId: value.from?.id,
        mediaId: value.media?.id,
      });
    }
  }

  return results;
}

export function shouldSendDm(commentText: string): boolean {
  return commentText.includes(TRIGGER_PHRASE);
}
