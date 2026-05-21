/** Meta Instagram API 설정 (src/lib/config.ts) */
/** graph.me 의 user_id (Instagram professional account ID) */
export const INSTAGRAM_USER_ID = "17841469544017471";
export const INSTAGRAM_ACCESS_TOKEN = "IGAASpHQZCAuNFBZAGEzUWU5c1V4X3dvNmFRbHBrZATYtbWg0MTdzOFRQX1AxUDBacEkyeS14ckNnOExncjN4TUtuemYyQmxsMUtmZAWJBbzUxdHF6Njh5UEU4RHRxN3A1TkRINjB6N01Vak9BY1h1MG0tTHozUTJLbkNMODJZAcmhRdwZDZD";

/** Instagram User 토큰(IG…) → graph.instagram.com | Page 토큰(EAA…) → graph.facebook.com */
export const GRAPH_API_HOST = "graph.instagram.com";
export const GRAPH_API_VERSION = "v22.0";

/** 댓글에 이 문구가 포함되면 DM 발송 */
export const TRIGGER_PHRASE = "프롬프트 주세요";

/** 발송할 DM 내용 */
export const DM_MESSAGE = "test";

const PLACEHOLDER = /^YOUR_/;

/**
 * Meta 첫 번째 앱 — Webhooks Callback: /api/webhook2
 * Dashboard > Settings > Basic > App Secret (이 앱 것만!)
 */
export const META_APP_SECRET_APP1 = "96475708c56ec230b132ac884150d295";

/** Meta Webhooks > Verify Token (첫 번째 앱 Dashboard와 동일) */
export const WEBHOOK_VERIFY_TOKEN_APP1 = "instagram-dm-verify-2026";

/** Instagram User 토큰(IG…) 여부 */
export function usesInstagramLoginApi(): boolean {
  return INSTAGRAM_ACCESS_TOKEN.startsWith("IG");
}

/** DM 발송용 Instagram 설정 */
export function isAppConfigured(): boolean {
  return (
    Boolean(INSTAGRAM_USER_ID) &&
    Boolean(INSTAGRAM_ACCESS_TOKEN) &&
    !PLACEHOLDER.test(INSTAGRAM_USER_ID) &&
    !PLACEHOLDER.test(INSTAGRAM_ACCESS_TOKEN)
  );
}

/** /api/webhook2 서명·검증용 (첫 번째 앱 App Secret) */
export function isWebhookApp1Configured(): boolean {
  return (
    Boolean(WEBHOOK_VERIFY_TOKEN_APP1) &&
    Boolean(META_APP_SECRET_APP1) &&
    !PLACEHOLDER.test(WEBHOOK_VERIFY_TOKEN_APP1) &&
    !PLACEHOLDER.test(META_APP_SECRET_APP1)
  );
}
