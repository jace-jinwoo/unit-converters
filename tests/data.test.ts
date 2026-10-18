import { describe, expect, it } from 'vitest';
import { GUIDES } from '@/data/guides';
import { getTool, TOOLS } from '@/data/tools';

describe('도구 메타데이터', () => {
  it('slug 는 유일하다', () => {
    const slugs = TOOLS.map((t) => t.slug);
    expect(new Set(slugs).size).toBe(slugs.length);
  });
  it('모든 페이지에 사용 방법·예제·FAQ·출처가 있다', () => {
    for (const t of TOOLS) {
      expect(t.howTo.length, `${t.slug} howTo`).toBeGreaterThanOrEqual(3);
      expect(t.example.input && t.example.output, `${t.slug} example`).toBeTruthy();
      expect(t.faq.length, `${t.slug} faq`).toBeGreaterThanOrEqual(3);
      expect(t.sources.length, `${t.slug} sources`).toBeGreaterThanOrEqual(1);
      expect(t.details.length, `${t.slug} details`).toBeGreaterThanOrEqual(2);
    }
  });
  it('title/description 은 중복되지 않는다', () => {
    expect(new Set(TOOLS.map((t) => t.title)).size).toBe(TOOLS.length);
    expect(new Set(TOOLS.map((t) => t.description)).size).toBe(TOOLS.length);
  });
  it('관련 도구는 모두 존재하며 자기 자신이 아니다', () => {
    for (const t of TOOLS) {
      for (const r of t.related) {
        expect(getTool(r), `${t.slug} → ${r}`).toBeDefined();
        expect(r).not.toBe(t.slug);
      }
    }
  });
  it('출처 URL 은 https 이다', () => {
    for (const t of TOOLS) for (const s of t.sources) if (s.url) expect(s.url.startsWith('https://')).toBe(true);
  });
  it('필수 8개 도구 경로가 모두 있다', () => {
    const required = ['area', 'length', 'weight', 'temperature', 'shoe-size', 'clothing-size', 'base64', 'json-formatter'];
    for (const r of required) expect(getTool(r)).toBeDefined();
  });
});

describe('안내 콘텐츠', () => {
  it('id 는 유일하고 연결된 도구가 존재한다', () => {
    expect(new Set(GUIDES.map((g) => g.id)).size).toBe(GUIDES.length);
    for (const g of GUIDES) expect(getTool(g.toolSlug)).toBeDefined();
  });
});
