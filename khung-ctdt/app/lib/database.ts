// Simple in-memory mock database for khung dao tao

let khungDaoTaoData: any[] = [];

export function saveKhungDaoTao(data: any) {
  khungDaoTaoData.push({
    id: Date.now(),
    ...data,
  });
  return data;
}

export function getAllKhungDaoTao() {
  return khungDaoTaoData;
}