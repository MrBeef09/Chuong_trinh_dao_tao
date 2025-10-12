import { NextResponse } from "next/server";
import { saveKhungDaoTao, getAllKhungDaoTao } from "../../../lib/database";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const saved = saveKhungDaoTao(body);
    return NextResponse.json({ message: "Lưu thành công", data: saved });
  } catch (error) {
    return NextResponse.json({ error: "Lỗi khi lưu dữ liệu" }, { status: 500 });
  }
}

export async function GET() {
  const all = getAllKhungDaoTao();
  return NextResponse.json(all);
}

