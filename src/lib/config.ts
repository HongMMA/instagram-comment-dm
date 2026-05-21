/** Meta Instagram API 설정 (src/lib/config.ts) */
export const INSTAGRAM_USER_ID = "1446745077479587";
export const INSTAGRAM_ACCESS_TOKEN = "IGAAUjzpZAseKNBZAFpJeTVqSzgwM0djVUhNTGpFS1l5dVlWcWU3TUlkOTFzZADMtYTRfSXpleFl6bzhZAcURwMkdfbGZAHNGxGTW5aRXhld3UtdnYtTWt3Wk41dk1qNzA5Y0ZANbU5ZAMWNBd192aFliRnA5a0d0Y0lVMGQzRHMtSUVBMAZDZD";

/** Meta App Dashboard > Webhooks > Verify Token 과 동일해야 함 */
export const WEBHOOK_VERIFY_TOKEN = "instagram-dm-verify-2026";

/** App Dashboard > Settings > Basic > App Secret (웹훅 서명 검증용) */
export const META_APP_SECRET = "afc138b1f0a800bd617407d4f36fb248";

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

/** 필수 config 값이 모두 채워졌는지 */
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
