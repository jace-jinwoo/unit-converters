export type ToolCategory = 'unit' | 'size' | 'dev';

export const CATEGORY_LABELS: Record<ToolCategory, string> = {
  unit: '단위 변환',
  size: '사이즈 참고표',
  dev: '개발자 도구',
};

export interface SourceRef {
  label: string;
  url?: string;
}

export interface ToolMeta {
  slug: string;
  name: string;
  category: ToolCategory;
  popular: boolean;
  title: string;
  description: string;
  shortDescription: string;
  keywords: string[];
  howTo: string[];
  example: { input: string; output: string; note?: string };
  details: string[];
  faq: { q: string; a: string }[];
  sources: SourceRef[];
  related: string[];
}

export const TOOLS: ToolMeta[] = [
  {
    slug: 'area',
    name: '평↔제곱미터 변환기',
    category: 'unit',
    popular: true,
    title: '평 제곱미터 변환기 - 평수 ㎡ 계산',
    description:
      '평과 제곱미터(㎡)를 양방향으로 실시간 변환합니다. 제곱피트, 에이커, 헥타르 등 면적 단위도 지원하며 소수점 자리수를 선택할 수 있습니다.',
    shortDescription: '평·㎡·ft²·에이커·헥타르 면적 단위를 양방향 실시간 변환',
    keywords: ['평', '제곱미터', '㎡', '평수', '면적', '아파트', '전용면적', '에이커'],
    howTo: [
      '왼쪽 칸에 변환할 값을 입력하고 단위를 선택합니다.',
      '오른쪽 칸에 변환 결과가 실시간으로 표시됩니다. 오른쪽 칸에 입력해도 반대로 변환됩니다.',
      '소수점 자리수를 바꾸거나 ⇄ 버튼으로 두 단위를 맞바꿀 수 있습니다.',
      '복사 버튼으로 결과 값을 클립보드에 복사합니다.',
    ],
    example: {
      input: '30평 → ㎡',
      output: '≈ 99.1736 ㎡',
      note: '30 × 400 ÷ 121 = 99.17355… 이며 4자리에서 반올림한 값입니다. 84㎡는 25.41평입니다.',
    },
    details: [
      '평은 척관법에서 유래한 면적 단위로, 1평은 400/121㎡(약 3.3058㎡)로 환산합니다. 이 변환기는 소수 근사값이 아니라 분수 400/121을 그대로 사용해 반올림 오차를 줄였습니다.',
      '평은 법정 계량단위가 아니어서 공적인 거래·증명 서류의 면적 표기에는 ㎡를 사용하도록 되어 있습니다. 이 도구의 평 값은 이해를 돕는 참고용이며, 계약서나 공문서의 면적은 반드시 해당 서류에 표기된 ㎡를 기준으로 확인하세요.',
      '아파트 광고에서 말하는 평형은 공급면적(전용면적+주거공용면적)을 기준으로 하는 경우가 많아, 전용면적을 단순히 환산한 값과 다를 수 있습니다.',
    ],
    faq: [
      {
        q: '1평은 몇 ㎡인가요?',
        a: '1평은 400/121㎡이며 소수로는 약 3.305785㎡입니다. 반대로 1㎡는 약 0.3025평입니다.',
      },
      {
        q: '전용면적 84㎡는 몇 평인가요?',
        a: '84 × 121 ÷ 400 = 25.41평입니다. 다만 흔히 말하는 "33평형"은 공급면적 기준이라 전용면적 환산값과 다릅니다.',
      },
      {
        q: '계약서에 평으로 적어도 되나요?',
        a: '평은 법정 계량단위가 아니므로 공적 거래·증명 서류에는 ㎡ 표기가 원칙입니다. 자세한 기준은 계량에 관한 법률과 관련 기관의 안내를 확인하세요.',
      },
    ],
    sources: [
      { label: '국가법령정보센터 - 계량에 관한 법률', url: 'https://www.law.go.kr/' },
      { label: '국가기술표준원', url: 'https://www.kats.go.kr/' },
      { label: 'BIPM - 국제단위계(SI) 안내서', url: 'https://www.bipm.org/en/publications/si-brochure' },
    ],
    related: ['length', 'weight', 'temperature'],
  },
  {
    slug: 'length',
    name: '길이 변환기',
    category: 'unit',
    popular: false,
    title: '길이 변환기 - cm 인치 피트 마일 계산',
    description:
      'mm, cm, m, km와 인치, 피트, 야드, 마일을 양방향으로 실시간 변환합니다. 키·화면 크기·거리 단위 환산에 사용하세요.',
    shortDescription: 'mm·cm·m·km·인치·피트·야드·마일 길이 단위 변환',
    keywords: ['길이', '인치', '피트', 'cm', '마일', '야드', '키', '화면 크기'],
    howTo: [
      '왼쪽 칸에 값을 입력하고 단위를 고릅니다. 예: 180 cm',
      '오른쪽 칸에서 변환할 단위를 선택하면 결과가 즉시 표시됩니다.',
      '소수점 자리수를 조정해 필요한 정밀도로 맞춥니다.',
      '⇄ 버튼으로 단위를 맞바꾸고 복사 버튼으로 결과를 복사합니다.',
    ],
    example: {
      input: '180 cm → 인치',
      output: '≈ 70.8661 in',
      note: '1인치는 정확히 2.54cm이므로 180 ÷ 2.54 = 70.86614… 입니다.',
    },
    details: [
      '1인치 = 25.4mm, 1피트 = 0.3048m, 1야드 = 0.9144m, 1마일 = 1609.344m는 국제 야드·파운드 협정에서 정해진 정확한 값입니다. 따라서 이 변환의 오차는 소수점 표시 자리수 반올림에서만 생깁니다.',
      '모니터·TV 크기의 인치는 대각선 길이입니다. 가로·세로 길이는 화면 비율에 따라 달라지므로 대각선 값만으로는 가로세로를 알 수 없습니다.',
    ],
    faq: [
      { q: '1인치는 몇 cm인가요?', a: '정확히 2.54cm입니다.' },
      { q: '1마일은 몇 km인가요?', a: '정확히 1.609344km입니다.' },
      {
        q: '미국 측량 피트와 국제 피트가 다른가요?',
        a: '미국 일부 측량 분야에서는 과거 정의의 측량 피트(US survey foot)를 쓰기도 합니다. 이 변환기는 국제 피트(0.3048m)를 사용합니다.',
      },
    ],
    sources: [
      { label: 'NIST - Special Publication 811 (단위 사용 지침)', url: 'https://www.nist.gov/pml/special-publication-811' },
      { label: 'BIPM - 국제단위계(SI) 안내서', url: 'https://www.bipm.org/en/publications/si-brochure' },
    ],
    related: ['area', 'weight', 'shoe-size'],
  },
  {
    slug: 'weight',
    name: '무게 변환기',
    category: 'unit',
    popular: false,
    title: '무게 변환기 - kg 파운드 온스 계산',
    description: 'mg, g, kg, 톤과 온스, 파운드를 양방향으로 실시간 변환합니다. 체중·요리·해외 직구 무게 환산에 사용하세요.',
    shortDescription: 'mg·g·kg·톤·온스·파운드 무게 단위 변환',
    keywords: ['무게', '파운드', '온스', 'kg', 'lb', 'oz', '체중', '직구'],
    howTo: [
      '왼쪽 칸에 값을 입력하고 단위를 선택합니다. 예: 70 kg',
      '오른쪽 칸에서 파운드, 온스 등 원하는 단위를 선택합니다.',
      '필요에 따라 소수점 자리수를 변경합니다.',
      '복사 버튼으로 결과를 복사합니다.',
    ],
    example: {
      input: '70 kg → 파운드',
      output: '≈ 154.3236 lb',
      note: '1lb = 0.45359237kg(정확값)이므로 70 ÷ 0.45359237 = 154.32358… 입니다.',
    },
    details: [
      '1파운드 = 0.45359237kg, 1온스 = 28.349523125g은 국제 협정으로 정해진 정확한 값입니다. 1파운드는 16온스입니다.',
      '이 변환기의 온스는 질량 단위(avoirdupois oz)입니다. 금·귀금속에 쓰는 트로이온스(약 31.1g)나 부피 단위인 액량 온스(fl oz)와는 다릅니다.',
    ],
    faq: [
      { q: '1kg은 몇 파운드인가요?', a: '약 2.20462파운드입니다.' },
      { q: '1파운드는 몇 g인가요?', a: '정확히 453.59237g입니다.' },
      { q: '트로이온스도 변환되나요?', a: '아니요. 이 도구의 온스는 일반 상거래용 질량 온스입니다. 트로이온스는 별도 단위이므로 지원하지 않습니다.' },
    ],
    sources: [
      { label: 'NIST - Special Publication 811 (단위 사용 지침)', url: 'https://www.nist.gov/pml/special-publication-811' },
      { label: 'BIPM - 국제단위계(SI) 안내서', url: 'https://www.bipm.org/en/publications/si-brochure' },
    ],
    related: ['length', 'area', 'temperature'],
  },
  {
    slug: 'temperature',
    name: '온도 변환기',
    category: 'unit',
    popular: false,
    title: '온도 변환기 - 섭씨 화씨 켈빈 계산',
    description: '섭씨(°C), 화씨(°F), 켈빈(K)을 양방향으로 실시간 변환합니다. 절대영도 미만 값은 오류로 안내합니다.',
    shortDescription: '섭씨·화씨·켈빈 온도 양방향 변환',
    keywords: ['온도', '섭씨', '화씨', '켈빈', '°C', '°F', '체온'],
    howTo: [
      '왼쪽 칸에 온도를 입력하고 단위(섭씨·화씨·켈빈)를 선택합니다.',
      '오른쪽 칸에서 변환 단위를 선택하면 결과가 즉시 표시됩니다.',
      '음수 온도도 입력할 수 있습니다. 단, 절대영도 미만이면 오류 메시지가 표시됩니다.',
    ],
    example: {
      input: '36.5 °C → °F',
      output: '97.7 °F',
      note: '36.5 × 9/5 + 32 = 97.7 입니다.',
    },
    details: [
      '섭씨→화씨는 °F = °C × 9/5 + 32, 켈빈은 K = °C + 273.15 로 계산합니다. 섭씨와 화씨는 −40도에서 같은 값이 됩니다.',
      '켈빈은 절대영도(0 K = −273.15 °C)를 기준으로 하는 SI 기본 단위입니다. 이 변환기는 절대영도보다 낮은 온도를 입력하면 결과를 표시하지 않고 오류를 안내합니다.',
    ],
    faq: [
      { q: '섭씨 0도는 화씨로 몇 도인가요?', a: '32°F입니다. 끓는점 100°C는 212°F입니다.' },
      { q: '섭씨와 화씨가 같아지는 온도가 있나요?', a: '−40도에서 섭씨와 화씨가 같습니다.' },
      { q: '켈빈에는 왜 도(°) 기호가 없나요?', a: '켈빈은 SI 단위로 "K"만 씁니다. 0 K는 절대영도입니다.' },
    ],
    sources: [{ label: 'BIPM - 국제단위계(SI) 안내서', url: 'https://www.bipm.org/en/publications/si-brochure' }],
    related: ['weight', 'length', 'area'],
  },
  {
    slug: 'shoe-size',
    name: '신발 사이즈 변환 참고표',
    category: 'size',
    popular: true,
    title: '신발 사이즈 변환표 - 한국 mm 미국 유럽 영국 참고',
    description:
      '한국 신발 사이즈(mm)를 EU·UK·US 사이즈로 근사 변환한 참고표입니다. 브랜드별 차이가 크므로 구매 전 해당 브랜드 사이즈표를 확인하세요.',
    shortDescription: '한국 mm 사이즈를 EU·UK·US로 근사 변환(브랜드별 차이 있음)',
    keywords: ['신발 사이즈', '사이즈표', 'mm', '미국 사이즈', '유럽 사이즈', '직구', '운동화'],
    howTo: [
      '발 길이 또는 평소 신는 한국 사이즈(mm)를 입력합니다. (150~330mm)',
      '근사 EU·UK·US(남/여) 사이즈가 표시됩니다.',
      '아래 참고표에서 주변 사이즈도 함께 비교합니다.',
      '구매 전 반드시 해당 브랜드의 공식 사이즈표와 리뷰를 확인합니다.',
    ],
    example: {
      input: '260 mm',
      output: 'EU 40.5 · UK 7 · US 남성 8 · US 여성 9.5',
      note: '발 길이에 10mm 여유를 더한 라스트 길이로 계산한 근사값이며 브랜드마다 ±1 사이즈 가량 달라질 수 있습니다.',
    },
    details: [
      '이 표는 수학적 단위 변환이 아니라 근사 참고값입니다. 계산식은 라스트 길이 = 발 길이 + 10mm, EU = 라스트(cm) × 1.5, UK = 3 × 라스트(inch) − 25, US 남성 = UK + 1, US 여성 = US 남성 + 1.5 입니다.',
      '실제 사이즈는 브랜드, 모델, 라스트 형태에 따라 달라집니다. 특히 나이키·아디다스·뉴발란스 등 브랜드별 표는 서로 일치하지 않는 경우가 많으므로 이 표만 믿고 구매하지 마세요.',
      '발볼 너비는 이 표에 반영되지 않습니다. 발볼이 넓거나 좁다면 정사이즈에서 반 사이즈 조정이 필요할 수 있습니다.',
    ],
    faq: [
      { q: '이 표는 공식 환산표인가요?', a: '아니요. 국가·브랜드 간 단일 공식 환산표가 없어 공개된 정의(파리 포인트, 배리콘)로 계산한 근사값입니다.' },
      { q: '왜 브랜드 표와 다르게 나오나요?', a: '브랜드마다 라스트 여유분과 반올림 방식이 달라서 생기는 차이입니다. 구매할 브랜드의 표를 우선하세요.' },
      { q: '정확히 맞는 사이즈를 알려면?', a: '발 길이를 실측한 뒤 브랜드 사이즈표를 확인하고, 가능하면 착용 후기나 교환 정책을 함께 참고하세요.' },
    ],
    sources: [
      { label: 'ISO 9407 - 신발 사이즈 체계(몬도포인트) 개요 (규격 원문은 유료)' },
      { label: '국가기술표준원 - 신발 치수 관련 표준 안내', url: 'https://www.kats.go.kr/' },
    ],
    related: ['clothing-size', 'length', 'area'],
  },
  {
    slug: 'clothing-size',
    name: '의류 사이즈 참고표',
    category: 'size',
    popular: false,
    title: '의류 사이즈 표 - 한국 44 55 66 S M L 비교 참고',
    description:
      '한국에서 널리 쓰이는 숫자 사이즈(44·55·66 / 90·95·100)와 알파벳 사이즈(S·M·L)의 관행적 대응표입니다. 표준이 아니며 브랜드별로 다릅니다.',
    shortDescription: '한국 숫자 사이즈와 S·M·L 알파벳 사이즈의 관행적 대응표',
    keywords: ['의류 사이즈', '옷 사이즈', '44 55 66', '95 100 105', 'S M L', '직구', '사이즈표'],
    howTo: [
      '여성/남성을 선택합니다.',
      '한국 숫자 사이즈를 고르면 대응하는 알파벳 사이즈가 표시됩니다.',
      '하단 표에서 전체 대응 관계를 확인합니다.',
      '구매 전 반드시 해당 브랜드의 실측 사이즈표(cm)를 확인합니다.',
    ],
    example: {
      input: '여성 55',
      output: '관행적으로 S에 대응',
      note: '브랜드에 따라 55가 S 또는 M으로 표기되기도 합니다.',
    },
    details: [
      '이 표는 국내에서 흔히 쓰이는 관행적 대응을 정리한 것으로 국가표준이 아닙니다. 같은 55라도 브랜드와 핏에 따라 실제 치수가 다릅니다.',
      '미국·유럽·영국의 숫자형 사이즈는 브랜드와 국가별 기준이 달라 검증 가능한 단일 환산 기준이 없어 포함하지 않았습니다. 해외 직구 시에는 해당 쇼핑몰의 cm/inch 실측표를 기준으로 하세요.',
    ],
    faq: [
      { q: '여성 55는 S인가요 M인가요?', a: '관행적으로는 S로 보지만 브랜드에 따라 M으로 표기하기도 합니다. 실측 치수를 확인하세요.' },
      { q: '남성 100은 L인가요?', a: '관행적으로 L에 대응하지만 브랜드와 핏에 따라 다를 수 있습니다.' },
      { q: '해외 직구 사이즈는 어떻게 고르나요?', a: '알파벳 사이즈에 의존하지 말고 쇼핑몰이 제공하는 cm 단위 실측표와 내 옷의 실측 치수를 비교하세요.' },
    ],
    sources: [{ label: '국가기술표준원 - 의류 치수 관련 표준 안내', url: 'https://www.kats.go.kr/' }],
    related: ['shoe-size', 'length', 'weight'],
  },
  {
    slug: 'base64',
    name: 'Base64 인코더·디코더',
    category: 'dev',
    popular: true,
    title: 'Base64 인코딩 디코딩 - 온라인 변환기',
    description:
      '텍스트를 Base64로 인코딩하거나 디코딩합니다. 한글(UTF-8)과 URL-safe 형식을 지원하며 입력한 내용은 서버로 전송되지 않고 브라우저에서만 처리됩니다.',
    shortDescription: '한글(UTF-8)·URL-safe 지원 Base64 인코딩/디코딩, 브라우저 내부 처리',
    keywords: ['base64', '인코딩', '디코딩', '인코더', 'url safe', 'utf-8'],
    howTo: [
      '인코딩 또는 디코딩 모드를 선택합니다.',
      '입력 칸에 텍스트 또는 Base64 문자열을 붙여 넣습니다.',
      '필요하면 URL-safe 형식, 패딩(=) 제거 옵션을 켭니다.',
      '결과 칸의 복사 버튼으로 복사합니다.',
    ],
    example: {
      input: 'Hello (인코딩)',
      output: 'SGVsbG8=',
      note: '"SGVsbG8="를 디코딩하면 다시 Hello가 됩니다.',
    },
    details: [
      'Base64는 바이너리 데이터를 64개의 문자(A–Z, a–z, 0–9, +, /)로 표현하는 인코딩 방식입니다. 암호화가 아니므로 누구나 쉽게 되돌릴 수 있어 비밀번호나 개인정보 보호 수단이 될 수 없습니다.',
      '이 도구는 입력을 UTF-8 바이트로 변환한 뒤 Base64로 인코딩하므로 한글과 이모지도 올바르게 처리됩니다. URL-safe 형식은 + 를 -, / 를 _ 로 바꿉니다.',
      '모든 처리는 브라우저 안에서 이루어지며 입력한 내용은 서버로 전송되지 않습니다. 이미지 등 바이너리 파일의 변환은 이 도구의 범위에 포함되지 않습니다.',
    ],
    faq: [
      { q: 'Base64는 암호화인가요?', a: '아니요. 단순한 인코딩이라 누구나 디코딩할 수 있습니다. 민감한 정보 보호용으로 사용하면 안 됩니다.' },
      { q: '디코딩 결과가 깨져 보여요.', a: '원본이 UTF-8 텍스트가 아니라 이미지·파일 등 바이너리일 수 있습니다. 이 경우 오류 메시지가 표시됩니다.' },
      { q: '입력한 내용이 서버에 저장되나요?', a: '아니요. 변환은 브라우저 안에서만 수행되며 서버로 전송하지 않습니다.' },
    ],
    sources: [
      { label: 'RFC 4648 - Base16, Base32, Base64 데이터 인코딩', url: 'https://www.rfc-editor.org/rfc/rfc4648' },
      { label: 'MDN - Window.btoa()', url: 'https://developer.mozilla.org/en-US/docs/Web/API/Window/btoa' },
    ],
    related: ['json-formatter', 'length', 'area'],
  },
  {
    slug: 'json-formatter',
    name: 'JSON Formatter',
    category: 'dev',
    popular: true,
    title: 'JSON 포맷터 - JSON 정렬 검증 압축 온라인',
    description:
      'JSON을 들여쓰기로 보기 좋게 정리하거나 한 줄로 압축하고, 문법 오류 위치를 알려줍니다. 입력한 데이터는 서버로 전송되지 않고 브라우저에서만 처리됩니다.',
    shortDescription: 'JSON 정렬·압축·문법 검증, 오류 위치 안내, 브라우저 내부 처리',
    keywords: ['json', '포맷터', 'formatter', 'json 정렬', 'json 검증', 'minify', 'beautify'],
    howTo: [
      '정렬 또는 압축 모드를 선택합니다.',
      '입력 칸에 JSON을 붙여 넣으면 결과가 실시간으로 표시됩니다.',
      '들여쓰기(2칸/4칸/탭)와 키 정렬 옵션을 선택합니다.',
      '문법 오류가 있으면 오류 위치(행·열)가 표시됩니다.',
    ],
    example: {
      input: '{"a":1,"b":[1,2]}',
      output: '들여쓰기 2칸으로 여러 줄 정리',
      note: '"예제 불러오기" 버튼으로 바로 시험해 볼 수 있습니다.',
    },
    details: [
      'JSON 표준(RFC 8259)은 문자열에 큰따옴표만 허용하고 마지막 요소 뒤 쉼표(trailing comma)와 주석을 허용하지 않습니다. 이런 형식은 이 도구에서 문법 오류로 표시됩니다.',
      '자바스크립트의 JSON.parse를 사용하므로 2^53을 넘는 큰 정수는 정밀도가 손실될 수 있습니다. ID 같은 큰 숫자는 문자열로 다루는 것을 권장합니다.',
      '입력한 JSON은 브라우저 안에서만 처리되며 서버로 전송되지 않습니다. 처리 가능한 입력 크기는 최대 5,000,000자입니다.',
    ],
    faq: [
      { q: '왜 작은따옴표 JSON은 오류인가요?', a: 'JSON 표준은 문자열에 큰따옴표(")만 허용합니다.' },
      { q: '키 정렬을 켜면 배열 순서도 바뀌나요?', a: '아니요. 객체의 키만 알파벳 순으로 정렬하며 배열 요소 순서는 유지됩니다.' },
      { q: '입력한 JSON이 서버로 전송되나요?', a: '아니요. 모든 처리는 브라우저에서만 이루어집니다.' },
    ],
    sources: [
      { label: 'RFC 8259 - JSON 데이터 교환 형식', url: 'https://www.rfc-editor.org/rfc/rfc8259' },
      { label: 'MDN - JSON.parse()', url: 'https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/JSON/parse' },
    ],
    related: ['base64', 'length', 'area'],
  },
];

export function getTool(slug: string): ToolMeta | undefined {
  return TOOLS.find((t) => t.slug === slug);
}
