/** Meta Instagram API 설정 (src/lib/config.ts) */
/** graph.me 의 user_id (Instagram professional account ID) */
export const INSTAGRAM_USER_ID = "17841469544017471";
export const INSTAGRAM_ACCESS_TOKEN = "IGAASpHQZCAuNFBZAFlwNHdaSkR4Mk85ZAXExMGIzQlFJQk01bU9DY0hpQzVmTlB0NWF3RXNVZAWduV2pvLThOOTJRdUNla3djMDd5dk9JbEdFaDFEdEowcmFtc2RDcEd3YjU2cmQzeTR1MmlLc2k2UTBDWjEwLWhxNXYwdElYUUpyRQZDZD";

/** Meta App Dashboard > Webhooks > Verify Token 과 동일해야 함 */
export const WEBHOOK_VERIFY_TOKEN = "instagram-dm-verify-2026";

/** 두 번째 앱 — Callback: /api/webhook */
export const META_APP_SECRET = "96475708c56ec230b132ac884150d295";

/** 첫 번째 앱 — Callback: /api/webhook2 (Settings > Basic > App Secret) */
export const META_APP_SECRET_APP1 = "96475708c56ec230b132ac884150d295";

/** 첫 번째 앱 Webhooks Verify Token (같으면 WEBHOOK_VERIFY_TOKEN 과 동일하게) */
export const WEBHOOK_VERIFY_TOKEN_APP1 = "instagram-dm-verify-2026";

/** Instagram User 토큰(IG…) → graph.instagram.com | Page 토큰(EAA…) → graph.facebook.com */
export const GRAPH_API_HOST = "graph.instagram.com";
export const GRAPH_API_VERSION = "v22.0";

/** 댓글에 이 문구가 포함되면 DM 발송 */
export const TRIGGER_PHRASE = "프롬프트 주세요";

/** 발송할 DM 내용 */
export const DM_MESSAGE = "test";

const PLACEHOLDER = /^YOUR_/;

/** Instagram User 토큰(IG…) 여부 */
export function usesInstagramLoginApi(): boolean {
  return INSTAGRAM_ACCESS_TOKEN.startsWith("IG");
}

/** DM 발송용 (두 앱 공통 Instagram 설정) */
export function isAppConfigured(): boolean {
  return (
    Boolean(INSTAGRAM_USER_ID) &&
    Boolean(INSTAGRAM_ACCESS_TOKEN) &&
    Boolean(WEBHOOK_VERIFY_TOKEN) &&
    Boolean(META_APP_SECRET) &&
    !PLACEHOLDER.test(INSTAGRAM_USER_ID) &&
    !PLACEHOLDER.test(INSTAGRAM_ACCESS_TOKEN) &&
    !PLACEHOLDER.test(WEBHOOK_VERIFY_TOKEN) &&
    !PLACEHOLDER.test(META_APP_SECRET)
  );
}

/** /api/webhook2 (첫 번째 앱) 웹훅 검증용 */
export function isWebhookApp1Configured(): boolean {
  return (
    Boolean(WEBHOOK_VERIFY_TOKEN_APP1) &&
    Boolean(META_APP_SECRET_APP1) &&
    !PLACEHOLDER.test(WEBHOOK_VERIFY_TOKEN_APP1) &&
    !PLACEHOLDER.test(META_APP_SECRET_APP1)
  );
}
