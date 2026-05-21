import {
  DM_MESSAGE,
  GRAPH_API_HOST,
  TRIGGER_PHRASE,
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
          <h2 className="text-lg font-semibold">설정할 값</h2>
          <p className="text-sm text-zinc-600">
            <code className="rounded bg-zinc-100 px-1">src/lib/config.ts</code>{" "}
            파일에 아래 값을 넣으세요.
          </p>
          <ul className="list-disc space-y-1 pl-5 text-sm text-zinc-700">
            <li>
              <strong>INSTAGRAM_USER_ID</strong> — 비즈니스/크리에이터 계정 ID
            </li>
            <li>
              <strong>INSTAGRAM_ACCESS_TOKEN</strong> — Page 또는 Instagram User
              액세스 토큰
            </li>
            <li>
              <strong>WEBHOOK_VERIFY_TOKEN</strong> — Meta 웹훅 설정 시 사용할
              임의 문자열 (현재: {WEBHOOK_VERIFY_TOKEN})
            </li>
            <li>
              <strong>META_APP_SECRET</strong> — 앱 시크릿 (웹훅 서명 검증)
            </li>
          </ul>
        </section>

        <section className="space-y-3">
          <h2 className="text-lg font-semibold">Meta Developers 설정</h2>
          <ul className="list-disc space-y-2 pl-5 text-sm text-zinc-700">
            <li>Instagram 비즈니스/크리에이터 계정 + Facebook 페이지 연결</li>
            <li>
              권한: <code className="rounded bg-zinc-100 px-1">instagram_manage_comments</code>
              ,{" "}
              <code className="rounded bg-zinc-100 px-1">instagram_basic</code>{" "}
              (Facebook Login 사용 시)
            </li>
            <li>Webhooks → object: Instagram → field: comments 구독</li>
            <li>
              Callback URL:{" "}
              <code className="rounded bg-zinc-100 px-1">
                https://your-domain.vercel.app/api/webhook
              </code>
            </li>
            <li>Verify Token은 config.ts의 WEBHOOK_VERIFY_TOKEN과 동일하게</li>
            <li>앱을 Live 모드로 전환 (실서비스 웹훅 수신)</li>
          </ul>
        </section>

        <section className="rounded-lg bg-violet-50 p-4 text-sm text-violet-900">
          <p>
            API 호스트: <strong>{GRAPH_API_HOST}</strong>. Instagram Login만
            쓰는 경우 config.ts에서{" "}
            <code className="rounded bg-white/60 px-1">graph.instagram.com</code>
            로 변경하세요.
          </p>
        </section>
      </main>
    </div>
  );
}
