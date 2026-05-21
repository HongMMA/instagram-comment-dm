# Instagram Comment → DM Bot

Instagram 댓글에 **"프롬프트 주세요"**가 포함되면, 해당 댓글 작성자에게 DM **"test"**를 자동 발송하는 Next.js 서버리스 앱입니다.

Vercel에 배포해 Meta Webhooks 콜백 URL로 사용합니다.

## 필요한 것 (Meta Developers)

| 항목 | 설명 |
|------|------|
| Meta 앱 | [developers.facebook.com](https://developers.facebook.com) 에서 생성 |
| Instagram Professional 계정 | 비즈니스 또는 크리에이터 계정 |
| 액세스 토큰 | `instagram_business_manage_comments` 등 |
| IG User ID | `me?fields=user_id` 의 `user_id` |
| Webhooks | `comments` 필드 구독 |

일반 DM이 아니라 **Private Reply** API를 사용합니다. 댓글 ID를 기준으로 해당 사용자에게 1회 메시지를 보낼 수 있습니다.

## 빠른 시작

```bash
npm install
```

`src/lib/config.ts` 에 실제 값 입력:

```ts
export const INSTAGRAM_USER_ID = "17841469544017471";
export const INSTAGRAM_ACCESS_TOKEN = "IGAA...";
export const META_APP_SECRET_APP1 = "첫번째_Meta_앱_App_Secret";
export const WEBHOOK_VERIFY_TOKEN_APP1 = "instagram-dm-verify-2026";
```

## Vercel 배포

1. GitHub에 푸시 후 Vercel에서 Import
2. Meta **Settings → Basic** (Privacy URL, App Domains 등)
3. Meta **Webhooks** (Instagram → `comments`):
   - **Callback URL**: `https://instagram-comment-dm-two.vercel.app/api/webhook2`
   - **Verify Token**: `WEBHOOK_VERIFY_TOKEN_APP1` 과 동일
4. 앱 **Live** + `comments` Advanced Access
5. Instagram 계정 구독:

```bash
curl -X POST "https://graph.instagram.com/v22.0/{INSTAGRAM_USER_ID}/subscribed_apps?subscribed_fields=comments&access_token={INSTAGRAM_ACCESS_TOKEN}"
```

## API 엔드포인트

| Method | Path | 용도 |
|--------|------|------|
| GET | `/api/webhook2` | Meta 웹훅 검증 (`hub.challenge`) |
| POST | `/api/webhook2` | 댓글 이벤트 → 키워드 매칭 시 DM |

## 커스터마이즈

- `TRIGGER_PHRASE` — 감지할 댓글 문구
- `DM_MESSAGE` — 보낼 DM 내용
- `META_APP_SECRET_APP1` — **Webhooks 등록한 Meta 앱**의 App Secret

## 프로젝트 구조

```
src/
  lib/
    config.ts
    instagram.ts
    webhook.ts
    webhook-handler.ts
  app/
    api/webhook2/route.ts
    page.tsx
```
