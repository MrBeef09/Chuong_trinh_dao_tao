import { NextResponse } from 'next/server';
import { hocPhan } from '@/lib/data';

export async function GET(
  req: Request,
  { params }: { params: { id: string } }
) {
  const list = hocPhan[params.id] || [];
  return NextResponse.json(list);
}
