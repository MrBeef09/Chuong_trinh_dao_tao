// Mẫu dữ liệu cho khoiKienThuc và hocPhan

export const khoiKienThuc = [
  { id: 'kt1', name: 'Khối kiến thức chung' },
  { id: 'kt2', name: 'Khối kiến thức cơ sở ngành' }
];

export const hocPhan: Record<string, Array<{ id: string; name: string }>> = {
  kt1: [
    { id: 'hp1', name: 'Triết học Mác-Lênin' },
    { id: 'hp2', name: 'Toán cao cấp' }
  ],
  kt2: [
    { id: 'hp3', name: 'Cơ sở dữ liệu' },
    { id: 'hp4', name: 'Lập trình hướng đối tượng' }
  ]
};
