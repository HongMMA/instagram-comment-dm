import {
  DM_MESSAGE,
  GRAPH_API_HOST,
  isAppConfigured,
  TRIGGER_PHRASE,
  usesInstagramLoginApi,
  WEBHOOK_VERIFY_TOKEN,
} from "@/lib/config";

export default function Home() {
  return (
    <div className="min-h-screen bg-zinc-50 px-6 py-12 font-sans text-zinc-900">
      <main className="mx-auto max-w-2xl space-y-8 rounded-2xl border border-zinc-200 bg-white p-8 shadow-sm">
        <header className="space-y-2">
          <p className="text-sm font-medium text-violet-600">Instagram Comment → DM</p>
          <h1 className="text-2xl font-semibold tracking-tight">
            댓글 키워드 자동 DM 봇
          </h1>
          <p className="text-zinc-600">
            댓글에 &quot;{TRIGGER_PHRASE}&quot;가 포함되면 해당 댓글 작성자에게 DM
            &quot;{DM_MESSAGE}&quot;를 보냅니다.
          </p>
        </header>

        <section className="space-y-3">
          <h2 className="text-lg font-semibold">동작 방식</h2>
          <ol className="list-decimal space-y-2 pl-5 text-sm text-zinc-700">
            <li>Instagram에서 댓글이 달리면 Meta가 웹훅으로 알림을 보냅니다.</li>
            <li>
              <code className="rounded bg-zinc-100 px-1">/api/webhook</code> 이
              댓글 텍스트를 확인합니다.
            </li>
            <li>
              키워드가 맞으면 Instagram Private Reply API로 DM을 보냅니다.
            </li>
          </ol>
        </section>

        <section className="space-y-3">
          <h2 className="text-lg font-semibold">설정 상태</h2>
          <p className="text-sm text-zinc-600">
            <code className="rounded bg-zinc-100 px-1">src/lib/config.ts</code>{" "}
            기준 —{" "}
            {isAppConfigured() ? (
              <span className="font-medium text-emerald-700">설정 완료</span>
            ) : (
              <span className="font-medium text-amber-700">미완료</span>
            )}
          </p>
          <ul className="list-disc space-y-1 pl-5 text-sm text-zinc-700">
            <li>
              API: <strong>{GRAPH_API_HOST}</strong> (
              {usesInstagramLoginApi() ? "Instagram Login" : "Facebook Login"})
            </li>
            <li>
              Webhook Verify Token: <strong>{WEBHOOK_VERIFY_TOKEN}</strong>
            </li>
            <li>
              트리거: <strong>{TRIGGER_PHRASE}</strong> → DM:{" "}
              <strong>{DM_MESSAGE}</strong>
            </li>
          </ul>
        </section>

        <section className="space-y-3">
          <h2 className="text-lg font-semibold">Meta Developers 설정</h2>
          <ul className="list-disc space-y-2 pl-5 text-sm text-zinc-700">
            <li>Instagram 비즈니스/크리에이터 계정</li>
            <li>
              권한:{" "}
              {usesInstagramLoginApi() ? (
                <>
                  <code className="rounded bg-zinc-100 px-1">
                    instagram_business_manage_comments
                  </code>
                  ,{" "}
                  <code className="rounded bg-zinc-100 px-1">
                    instagram_business_basic
                  </code>
                </>
              ) : (
                <>
                  <code className="rounded bg-zinc-100 px-1">
                    instagram_manage_comments
                  </code>
                  ,{" "}
                  <code className="rounded bg-zinc-100 px-1">instagram_basic</code>
                </>
              )}
            </li>
            <li>Webhooks → object: Instagram → field: comments 구독</li>
            <li>
              Callback URL (앱 2):{" "}
              <code className="rounded bg-zinc-100 px-1">
                https://instagram-comment-dm-two.vercel.app/api/webhook
              </code>
            </li>
            <li>
              Callback URL (앱 1):{" "}
              <code className="rounded bg-zinc-100 px-1">
                https://instagram-comment-dm-two.vercel.app/api/webhook2
              </code>
            </li>
            <li>
              Verify Token — 앱1: WEBHOOK_VERIFY_TOKEN_APP1 / 앱2: WEBHOOK_VERIFY_TOKEN
            </li>
            <li>앱을 Live 모드로 전환 (실서비스 웹훅 수신)</li>
          </ul>
        </section>

        <section className="rounded-lg bg-violet-50 p-4 text-sm text-violet-900">
          <p>
            Meta Webhooks Verify Token에{" "}
            <code className="rounded bg-white/60 px-1">{WEBHOOK_VERIFY_TOKEN}</code>
            을 입력하세요. Callback URL은 Vercel 배포 주소의{" "}
            <code className="rounded bg-white/60 px-1">/api/webhook</code> 또는 앱1은{" "}
            <code className="rounded bg-white/60 px-1">/api/webhook2</code> 입니다.{" "}
            <a href="/privacy" className="text-violet-700 underline">
              개인정보처리방침
            </a>
            은 Live 전환·Basic 설정에 사용할 수 있습니다.
          </p>
        </section>
      </main>
    </div>
  );
}
