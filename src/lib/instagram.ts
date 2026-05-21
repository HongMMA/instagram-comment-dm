import {
  DM_MESSAGE,
  GRAPH_API_HOST,
  GRAPH_API_VERSION,
  INSTAGRAM_ACCESS_TOKEN,
  INSTAGRAM_USER_ID,
  isAppConfigured,
} from "./config";

export type SendPrivateReplyResult =
  | { ok: true; recipientId: string; messageId: string }
  | { ok: false; error: string; status?: number };

export async function sendPrivateReplyToComment(
  commentId: string,
  message: string = DM_MESSAGE,
): Promise<SendPrivateReplyResult> {
  if (!isAppConfigured()) {
    return { ok: false, error: "config.ts 설정이 완료되지 않았습니다." };
  }

  const url = `https://${GRAPH_API_HOST}/${GRAPH_API_VERSION}/${INSTAGRAM_USER_ID}/messages`;

  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${INSTAGRAM_ACCESS_TOKEN}`,
    },
    body: JSON.stringify({
      recipient: { comment_id: commentId },
      message: { text: message },
    }),
  });

  const data = (await response.json()) as {
    recipient_id?: string;
    message_id?: string;
    error?: { message: string; type?: string; code?: number };
  };

  if (!response.ok) {
    return {
      ok: false,
      status: response.status,
      error: data.error?.message ?? `API 요청 실패 (${response.status})`,
    };
  }

  if (!data.recipient_id || !data.message_id) {
    return { ok: false, error: "응답에 recipient_id 또는 message_id가 없습니다." };
  }

  return {
    ok: true,
    recipientId: data.recipient_id,
    messageId: data.message_id,
  };
}
