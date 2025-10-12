import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { saveKhungDaoTao, getAllKhungDaoTao } from "../../lib/database";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const saved = saveKhungDaoTao(body);
    return NextResponse.json({
      message: "Lưu thành công",
      data: saved
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Lỗi khi lưu dữ liệu" },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    const all = getAllKhungDaoTao();
    return NextResponse.json(all);
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Không thể lấy dữ liệu" },
      { status: 500 }
    );
  }
}