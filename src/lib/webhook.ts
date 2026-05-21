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

function verifyHmac(
  rawBody: string,
  signatureHeader: string,
  appSecret: string,
  algorithm: "sha256" | "sha1",
): boolean {
  const prefix = algorithm === "sha256" ? "sha256=" : "sha1=";
  if (!signatureHeader.toLowerCase().startsWith(prefix)) {
    return false;
  }

  const expected = createHmac(algorithm, appSecret.trim())
    .update(rawBody)
    .digest("hex")
    .toLowerCase();
  const received = signatureHeader.slice(prefix.length).toLowerCase();

  if (expected.length !== received.length) {
    return false;
  }

  try {
    return timingSafeEqual(
      Buffer.from(expected, "utf8"),
      Buffer.from(received, "utf8"),
    );
  } catch {
    return false;
  }
}

/** Meta는 sha256 hex를 대문자로 보내는 경우가 있어 소문자로 정규화 후 비교 */
export function verifyWebhookSignature(
  rawBody: string,
  signatureHeader256: string | null,
  appSecret: string,
  signatureHeaderSha1?: string | null,
): boolean {
  if (
    signatureHeader256 &&
    verifyHmac(rawBody, signatureHeader256, appSecret, "sha256")
  ) {
    return true;
  }

  if (
    signatureHeaderSha1 &&
    verifyHmac(rawBody, signatureHeaderSha1, appSecret, "sha1")
  ) {
    return true;
  }

  return false;
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
