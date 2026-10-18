import type { Metadata } from 'next';
import Link from 'next/link';
import AdSlot from '@/components/AdSlot';
import { GUIDES } from '@/data/guides';
import { SITE_NAME } from '@/lib/site';

export const metadata: Metadata = {
  title: '이용 안내',
  description: `${SITE_NAME} 사용 방법과 단위·사이즈 변환 시 주의사항, 개발자 도구의 개인정보 처리 방식을 안내합니다.`,
  alternates: { canonical: '/guide/' },
  openGraph: { url: '/guide/', title: `이용 안내 | ${SITE_NAME}` },
};

export default function GuidePage() {
  return (
    <article className="space-y-8">
      <h1 className="text-3xl font-bold text-gray-900">이용 안내</h1>

      <section aria-labelledby="howto-h">
        <h2 id="howto-h" className="text-xl font-semibold">기본 사용 방법</h2>
        <ol className="mt-3 list-decimal space-y-1 pl-5 text-gray-700">
          <li>홈 화면의 검색창이나 카테고리에서 필요한 도구를 선택합니다.</li>
          <li>값을 입력하면 결과가 실시간으로 표시됩니다. 변환 도구는 양쪽 칸 어느 쪽에 입력해도 됩니다.</li>
          <li>소수점 자리수를 조정하고 복사 버튼으로 결과를 복사합니다.</li>
          <li>각 도구 페이지 하단의 상세 설명, FAQ, 참고 출처를 함께 확인하세요.</li>
        </ol>
      </section>

      <section aria-labelledby="notes-h">
        <h2 id="notes-h" className="text-xl font-semibold">결과 해석 시 주의사항</h2>
        <ul className="mt-3 list-disc space-y-1 pl-5 text-gray-700">
          <li>표시되는 값은 지정한 소수점 자리에서 반올림한 값입니다.</li>
          <li>신발·의류 사이즈는 근사 참고값이며 브랜드 공식 사이즈표가 우선합니다.</li>
          <li>계약·의료·법률·안전과 관련된 판단에는 공식 문서와 전문가 확인을 우선하세요.</li>
        </ul>
      </section>

      <AdSlot placement="content" />

      <section aria-labelledby="articles-h">
        <h2 id="articles-h" className="text-xl font-semibold">안내 콘텐츠</h2>
        <div className="mt-4 space-y-8">
          {GUIDES.map((g) => (
            <section key={g.id} id={g.id} aria-labelledby={`${g.id}-h`} className="scroll-mt-4">
              <h3 id={`${g.id}-h`} className="text-lg font-semibold text-gray-900">{g.title}</h3>
              <p className="text-xs text-gray-400">{g.date}</p>
              <div className="mt-2 space-y-3 text-gray-700">
                {g.paragraphs.map((p) => (
                  <p key={p}>{p}</p>
                ))}
              </div>
              <p className="mt-2 text-sm">
                <Link href={`/${g.toolSlug}/`} className="text-brand-700 underline">관련 도구로 이동</Link>
              </p>
            </section>
          ))}
        </div>
      </section>
    </article>
  );
}
