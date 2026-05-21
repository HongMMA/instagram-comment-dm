# Instagram Comment → DM Bot

Instagram 댓글에 **"프롬프트 주세요"**가 포함되면, 해당 댓글 작성자에게 DM **"test"**를 자동 발송하는 Next.js 서버리스 앱입니다.

Vercel에 배포해 Meta Webhooks 콜백 URL로 사용합니다.

## 필요한 것 (Meta Developers)

| 항목 | 설명 |
|------|------|
| Meta 앱 | [developers.facebook.com](https://developers.facebook.com) 에서 생성 |
| Instagram Professional 계정 | 비즈니스 또는 크리에이터 계정 |
| Facebook 페이지 | Instagram 계정과 연결된 페이지 |
| 액세스 토큰 | `instagram_manage_comments` 등 권한이 포함된 토큰 |
| IG User ID | API로 조회한 Instagram 비즈니스 계정 ID |
| Webhooks | `comments` 필드 구독 |

일반 DM이 아니라 **Private Reply** API를 사용합니다. 댓글 ID를 기준으로 해당 사용자에게 1회 메시지를 보낼 수 있습니다.

## 빠른 시작

```bash
cd instagram-comment-dm
npm install
```

`src/lib/config.ts` 에 실제 값 입력:

```ts
export const INSTAGRAM_USER_ID = "123456789";
export const INSTAGRAM_ACCESS_TOKEN = "EAAx...";
export const WEBHOOK_VERIFY_TOKEN = "my-secret-verify-token";
export const META_APP_SECRET = "your-app-secret";
```

로컬 실행:

```bash
npm run dev
```

로컬에서 웹훅을 받으려면 ngrok 등으로 `https://xxxx.ngrok.io/api/webhook` 을 Meta에 등록하세요.

## Vercel 배포

1. GitHub에 푸시 후 Vercel에서 Import
2. 배포 URL 확인 (예: `https://instagram-comment-dm-two.vercel.app`)
3. Meta **Settings → Basic** (Live/Publish 전 필수):

| 필드 | 예시 값 |
|------|---------|
| App Domains | `instagram-comment-dm-two.vercel.app` |
| Privacy Policy URL | `https://instagram-comment-dm-two.vercel.app/privacy` |
| Site URL | `https://instagram-comment-dm-two.vercel.app/` |

4. Meta App Dashboard → Webhooks:
   - **Callback URL**: `https://YOUR_DOMAIN/api/webhook`
   - **Verify Token**: `config.ts`의 `WEBHOOK_VERIFY_TOKEN`과 동일
   - **Fields**: `comments`
4. 앱 **Live** 모드, Advanced Access(댓글 웹훅) 완료 후 테스트
5. **실제 댓글 웹훅** — Dashboard 구독만으로는 부족할 수 있음. Instagram 계정에 앱 구독 API 호출:

```bash
curl -X POST "https://graph.instagram.com/v22.0/{INSTAGRAM_USER_ID}/subscribed_apps?subscribed_fields=comments&access_token={INSTAGRAM_ACCESS_TOKEN}"
```

`INSTAGRAM_USER_ID`는 `GET graph.instagram.com/me?fields=user_id` 응답의 `user_id` 값입니다.

## API 엔드포인트

| Method | Path | 용도 |
|--------|------|------|
| GET | `/api/webhook` | Meta 웹훅 검증 (`hub.challenge` 응답) |
| POST | `/api/webhook` | 댓글 이벤트 수신 → 키워드 매칭 시 DM 발송 |

## 커스터마이즈

`src/lib/config.ts`:

- `TRIGGER_PHRASE` — 감지할 댓글 문구 (기본: `프롬프트 주세요`)
- `DM_MESSAGE` — 보낼 DM 내용 (기본: `test`)
- `GRAPH_API_HOST` — `graph.facebook.com` 또는 `graph.instagram.com`

## 제한 사항 (Meta 정책)

- 댓글당 **Private Reply 1회**만 가능
- 댓글 작성 후 **7일 이내**에만 발송 가능
- 추가 메시지는 상대방이 답장한 뒤 24시간 안에만 가능

## 프로젝트 구조

```
src/
  lib/
    config.ts      # 상수 (토큰, ID, 키워드)
    instagram.ts   # Private Reply API 호출
    webhook.ts     # 웹훅 파싱·서명 검증
  app/
    api/webhook/route.ts
    page.tsx         # 설정 안내 페이지
```
