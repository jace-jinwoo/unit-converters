# 단위·규격 변환기 (unit-converters)

평↔㎡, 길이, 무게, 온도, 신발·의류 사이즈 참고표, Base64, JSON Formatter를 제공하는 한국어 정적 웹사이트입니다.
Next.js(App Router) + TypeScript + Tailwind CSS, `output: 'export'` 정적 배포, Netlify 자동 배포를 전제로 합니다.

## 페이지

| 경로 | 내용 |
| --- | --- |
| `/` | 검색·카테고리·인기 도구·안내 콘텐츠 |
| `/area/` `/length/` `/weight/` `/temperature/` | 단위 변환 (양방향 실시간, 소수점 선택, 복사) |
| `/shoe-size/` `/clothing-size/` | 사이즈 **근사 참고표** (브랜드별 차이 명시) |
| `/base64/` `/json-formatter/` | 브라우저 내부 처리 (서버 전송 없음) |
| `/about/` `/guide/` `/privacy/` `/terms/` `/contact/` | 소개·이용 안내·정책·문의 |
| `/sitemap.xml` `/robots.txt` `/icon.svg` | SEO·파비콘 (빌드 시 생성) |

도구 페이지는 `src/data/tools.ts` 한 곳에서 관리하며, `src/app/[tool]/page.tsx`가 `generateStaticParams`로 정적 경로를 만듭니다(`dynamicParams = false`).

## 로컬 실행

```bash
npm install
npm run dev        # 개발 서버
npm test           # 단위 테스트 (vitest)
npm run typecheck  # 타입 검사
npm run build      # 정적 빌드 → out/
npm run verify     # out/ 검증: 필수 페이지, 메타데이터, 내부 링크, sitemap, 광고 코드 미노출
npm run preview    # out/ 미리보기
```

Node 20 이상을 권장합니다 (Netlify는 `netlify.toml`에서 22로 지정).

## 환경변수

`.env.example`를 참고해 Netlify 사이트 설정(Site configuration → Environment variables)에 등록합니다. `NEXT_PUBLIC_*` 값은 **빌드 시점**에 인라인되므로 변경 후 재배포가 필요합니다.

| 변수 | 설명 |
| --- | --- |
| `NEXT_PUBLIC_SITE_URL` | 배포 도메인 (canonical·sitemap·OG 기준, 끝 슬래시 없이) |
| `NEXT_PUBLIC_CONTACT_EMAIL` | 문의 페이지 이메일 (비우면 "설정 필요" 안내 표시) |
| `NEXT_PUBLIC_ADSENSE_ENABLED` | AdSense 승인 전에는 `false` |
| `NEXT_PUBLIC_ADSENSE_CLIENT` | `ca-pub-…` |
| `NEXT_PUBLIC_ADSENSE_SLOT_HOME / TOOL / CONTENT` | 위치별 광고 단위 ID |

## GitHub Private 저장소 연결

```bash
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin git@github.com:<계정>/<저장소>.git   # Private 저장소
git push -u origin main
```

## Netlify 배포

1. Netlify → Add new site → Import an existing project → GitHub 선택 후 저장소 연결
2. 설정은 `netlify.toml`이 지정합니다: Build command `npm run build`, Publish directory `out`
3. 환경변수 등록(위 표) 후 Deploy
4. 배포 후 `https://<도메인>/sitemap.xml`, `/robots.txt`, 각 도구 경로를 직접 열어 확인
5. Google Search Console에 사이트를 등록하고 sitemap.xml 제출

`trailingSlash: true`이므로 모든 페이지가 `경로/index.html`로 생성되어 정적 호스팅에서 새로고침 시 404가 나지 않습니다.

## AdSense 광고

- `src/components/AdSlot.tsx`가 광고 영역을 담당하며 `home` / `tool` / `content` 위치를 지원합니다.
- `NEXT_PUBLIC_ADSENSE_ENABLED`가 `true`가 아니거나 client/slot이 비어 있으면 **아무것도 렌더링하지 않고** AdSense 스크립트도 로드하지 않습니다. (`npm run verify`가 비활성 빌드에 광고 코드가 없는지 확인합니다.)
- 승인 후: 환경변수 4~6개를 입력하고 `ENABLED=true`로 바꿔 재배포합니다.
- 광고에는 "광고" 라벨이 붙고 도구 버튼과 분리됩니다. 승인 보장이나 클릭 유도 문구는 사용하지 않습니다.
- 사이트 루트에 `ads.txt`가 필요하면 `public/ads.txt`를 추가하세요 (승인 후 AdSense 안내에 따름).

## 데이터 정확성 정책

- 길이·무게 상수(인치·피트·야드·마일·파운드·온스)는 국제 협정의 정확값, 평은 400/121㎡ 관용 환산값입니다. 평은 법정 계량단위가 아님을 화면에 안내합니다.
- 신발·의류 사이즈는 단일 공식 환산표가 없어 **근사 참고값**으로만 표시하며, 계산식과 한계를 화면에 공개합니다. 검증 가능한 기준이 없는 해외 숫자 의류 사이즈는 포함하지 않았습니다.
- 출처 링크는 일반 참고 경로입니다. 배포 전 운영자가 각 링크와 설명을 한 번 더 확인하세요.

## 유지보수 절차

- 도구 추가: `src/lib/`에 순수 함수 → `tests/`에 테스트 → `src/data/tools.ts`에 메타·FAQ·출처 추가 → `src/app/[tool]/page.tsx`의 `renderTool`에 연결. sitemap·홈 검색·푸터에는 자동 반영됩니다.
- 안내 글 추가: `src/data/guides.ts`
- `LAST_UPDATED`(`src/lib/site.ts`)는 내용 갱신 시 수정합니다.
- 배포 전 체크: `npm test && npm run typecheck && npm run build && npm run verify`

## 프로젝트 구조

```
src/app/         페이지, sitemap.ts, robots.ts, icon.svg
src/components/  도구 UI, AdSlot, SEO(JsonLd), 공통 레이아웃
src/data/        tools.ts, guides.ts
src/lib/         units, temperature, sizes, base64, json, format, site
tests/           vitest 단위 테스트
scripts/         verify-static.mjs
```

## 검증 상태

개발 환경의 npm 레지스트리 접속이 차단되어 **`npm install`, `npm test`, `npm run typecheck`, `npm run build`, `npm run verify`는 아직 실행하지 못했습니다.** 배포 전에 위 "배포 전 체크" 명령을 직접 실행해 결과를 확인해야 합니다.
