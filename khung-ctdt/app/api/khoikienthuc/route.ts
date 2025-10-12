import { NextResponse } from 'next/server';
import { khoiKienThuc } from '@/lib/data';

export async function GET() {
  return NextResponse.json(khoiKienThuc);
}
