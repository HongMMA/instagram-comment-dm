export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-zinc-50 px-6 py-12 font-sans text-zinc-900">
      <main className="mx-auto max-w-2xl space-y-6 rounded-2xl border border-zinc-200 bg-white p-8 shadow-sm text-sm leading-relaxed text-zinc-700">
        <h1 className="text-2xl font-semibold text-zinc-900">개인정보처리방침</h1>
        <p>
          Instagram Comment → DM 서비스(이하 &quot;서비스&quot;)는 Instagram 댓글
          이벤트를 처리하고, 설정된 조건에 따라 자동 DM(비공개 답장)을 발송합니다.
        </p>
        <section className="space-y-2">
          <h2 className="text-lg font-semibold text-zinc-900">수집·이용 정보</h2>
          <ul className="list-disc space-y-1 pl-5">
            <li>Instagram 댓글 ID, 댓글 내용, 작성자 사용자명(웹훅 payload)</li>
            <li>서비스 운영에 필요한 기술 로그(요청 시간, 처리 결과 등)</li>
          </ul>
        </section>
        <section className="space-y-2">
          <h2 className="text-lg font-semibold text-zinc-900">이용 목적</h2>
          <p>댓글 키워드 감지 및 자동 DM 발송, 서비스 안정성·오류 확인</p>
        </section>
        <section className="space-y-2">
          <h2 className="text-lg font-semibold text-zinc-900">보관·제공</h2>
          <p>
            데이터는 서비스 제공 목적 범위에서만 처리하며, 법령에 따른 경우를
            제외하고 제3자에게 제공하지 않습니다. 로그는 운영 목적에 따라
            제한적으로 보관될 수 있습니다.
          </p>
        </section>
        <section className="space-y-2">
          <h2 className="text-lg font-semibold text-zinc-900">문의</h2>
          <p>서비스 운영자에게 Instagram 계정 DM 또는 등록된 연락처로 문의할 수 있습니다.</p>
        </section>
        <p className="text-xs text-zinc-500">시행일: 2026년 5월 21일</p>
        <a href="/" className="inline-block text-violet-600 hover:underline">
          ← 홈으로
        </a>
      </main>
    </div>
  );
}
