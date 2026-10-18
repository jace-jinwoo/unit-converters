import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import type { ReactNode } from 'react';
import Base64Tool from '@/components/Base64Tool';
import { TemperatureTool, UnitConverterTool } from '@/components/Converters';
import JsonTool from '@/components/JsonTool';
import { ClothingSizeTool, ShoeSizeTool } from '@/components/SizeTools';
import ToolPage from '@/components/ToolPage';
import { getTool, TOOLS } from '@/data/tools';
import { SITE_NAME } from '@/lib/site';

// 정적 내보내기: 빌드 시 생성한 경로 외에는 404
export const dynamicParams = false;

export function generateStaticParams() {
  return TOOLS.map((t) => ({ tool: t.slug }));
}

type Props = { params: Promise<{ tool: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { tool } = await params;
  const meta = getTool(tool);
  if (!meta) return {};
  const path = `/${meta.slug}/`;
  return {
    title: meta.title,
    description: meta.description,
    keywords: meta.keywords,
    alternates: { canonical: path },
    openGraph: {
      type: 'website',
      locale: 'ko_KR',
      siteName: SITE_NAME,
      title: meta.title,
      description: meta.description,
      url: path,
    },
    twitter: { card: 'summary', title: meta.title, description: meta.description },
  };
}

function renderTool(slug: string): ReactNode {
  switch (slug) {
    case 'area':
      return <UnitConverterTool category="area" />;
    case 'length':
      return <UnitConverterTool category="length" />;
    case 'weight':
      return <UnitConverterTool category="weight" />;
    case 'temperature':
      return <TemperatureTool />;
    case 'shoe-size':
      return <ShoeSizeTool />;
    case 'clothing-size':
      return <ClothingSizeTool />;
    case 'base64':
      return <Base64Tool />;
    case 'json-formatter':
      return <JsonTool />;
    default:
      return null;
  }
}

export default async function ToolRoute({ params }: Props) {
  const { tool } = await params;
  const meta = getTool(tool);
  if (!meta) notFound();
  return <ToolPage meta={meta}>{renderTool(meta.slug)}</ToolPage>;
}
