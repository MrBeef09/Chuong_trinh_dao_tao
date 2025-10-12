'use client'

import React, { useEffect, useState } from 'react'
import { PieChart, Pie, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Cell } from 'recharts'
import { useRouter } from 'next/navigation'

type Subject = {
  id: number
  program: string
  cohort: string
  block: string
  subjects: Array<{
    id: string
    name: string
    credits: number
    type: 'required' | 'elective'
  }>
  totalCredits: number
  createdAt: string
}

export default function ViewCurriculumPage() {
  const router = useRouter()
  const [data, setData] = useState<Subject[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedItem, setSelectedItem] = useState<Subject | null>(null)

  useEffect(() => {
    fetchData()
  }, [])

  async function fetchData() {
    try {
      const res = await fetch('/api/khung-ctdt')
      const result = await res.json()
      setData(Array.isArray(result) ? result : [])
      if (Array.isArray(result) && result.length > 0) {
        setSelectedItem(result[0])
      }
    } catch (error) {
      console.error('Error fetching data:', error)
      setData([])
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>
  }

  if (data.length === 0) {
    return (
      <div className="min-h-screen bg-gray-100 p-6">
        <div className="max-w-6xl mx-auto">
          <div className="bg-white rounded-lg shadow p-8 text-center">
            <h2 className="text-2xl font-bold text-gray-700 mb-4">No Data Available</h2>
            <p className="text-gray-600 mb-6">Please create a curriculum framework first</p>
            <button
              onClick={() => router.push('/build-curriculum')}
              className="bg-blue-700 hover:bg-blue-800 text-white px-6 py-2 rounded"
            >
              Back to Build Curriculum
            </button>
          </div>
        </div>
      </div>
    )
  }

  const current = selectedItem || data[0];
  const requiredSubjects = current.subjects.filter(s => s.type === 'required');
  const electiveSubjects = current.subjects.filter(s => s.type === 'elective');
  const requiredCredits = requiredSubjects.reduce((sum, s) => sum + s.credits, 0);
  const electiveCredits = electiveSubjects.reduce((sum, s) => sum + s.credits, 0);

  const pieData = [
    { name: 'Bắt buộc', value: requiredCredits, fill: '#2c5aa0' },
    { name: 'Tự chọn', value: electiveCredits, fill: '#f4b740' },
  ];

  const barData = [
    { name: 'Đại cương', value: 24 },
    { name: 'Cơ sở ngành', value: 30 },
    { name: 'Tốt nghiệp', value: 16 },
  ];

  return (
    <div className="min-h-screen bg-gray-100 p-6">
  <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Header */}
        <div className="bg-blue-900 text-white rounded-lg p-6 flex flex-col md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-2xl font-bold mb-1">CTĐT CÔNG NGHỆ THÔNG TIN - KHÓA 2023-2027</h1>
            <p className="text-blue-100 text-sm">Khoa: Công nghệ Thông tin | Trình độ: Đại học | Phiên bản: 1.0 (Dự thảo)</p>
          </div>
          <div className="flex gap-2 mt-4 md:mt-0">
            <button className="bg-blue-700 hover:bg-blue-600 px-4 py-2 rounded text-sm">Lưu chỉnh thức</button>
            <button className="bg-blue-700 hover:bg-blue-600 px-4 py-2 rounded text-sm">Xuất PDF / Excel</button>
            <button className="bg-blue-700 hover:bg-blue-600 px-4 py-2 rounded text-sm">Gửi phê duyệt</button>
            <button className="bg-blue-700 hover:bg-blue-600 px-4 py-2 rounded text-sm">Chỉnh sửa khung CTĐT</button>
          </div>
        </div>

      <div className="flex flex-col gap-6 lg:flex-row lg:gap-6 col-span-2">
        <div className="flex flex-col gap-6 flex-1">
          {/* Tổng hợp khung chương trình đào tạo */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-lg font-bold text-gray-800 mb-4">Tổng hợp khung chương trình đào tạo</h2>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-gray-200">
                  <tr>
                    <th className="px-4 py-2 text-left font-semibold">Khối kiến thức</th>
                    <th className="px-4 py-2 text-center font-semibold">Tổng tín chỉ</th>
                    <th className="px-4 py-2 text-center font-semibold">Bắt buộc</th>
                    <th className="px-4 py-2 text-center font-semibold">Tự chọn</th>
                    <th className="px-4 py-2 text-center font-semibold">Số học phần</th>
                    <th className="px-4 py-2 text-center font-semibold">Số VĐ</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b">
                    <td className="px-4 py-3 font-medium">Kiến thức đại cương</td>
                    <td className="px-4 py-3 text-center">24</td>
                    <td className="px-4 py-3 text-center">18</td>
                    <td className="px-4 py-3 text-center">6</td>
                    <td className="px-4 py-3 text-center">8</td>
                    <td className="px-4 py-3 text-center">-</td>
                  </tr>
                  <tr className="border-b">
                    <td className="px-4 py-3 font-medium">Cơ sở ngành</td>
                    <td className="px-4 py-3 text-center">30</td>
                    <td className="px-4 py-3 text-center">24</td>
                    <td className="px-4 py-3 text-center">6</td>
                    <td className="px-4 py-3 text-center">14</td>
                    <td className="px-4 py-3 text-center">-</td>
                  </tr>
                  <tr className="border-b">
                    <td className="px-4 py-3 font-medium">Chuyên ngành</td>
                    <td className="px-4 py-3 text-center">42</td>
                    <td className="px-4 py-3 text-center">32</td>
                    <td className="px-4 py-3 text-center">10</td>
                    <td className="px-4 py-3 text-center">12</td>
                    <td className="px-4 py-3 text-center">-</td>
                  </tr>
                  <tr className="border-b">
                    <td className="px-4 py-3 font-medium">Thực tập, khóa luận</td>
                    <td className="px-4 py-3 text-center">102</td>
                    <td className="px-4 py-3 text-center">78</td>
                    <td className="px-4 py-3 text-center">24</td>
                    <td className="px-4 py-3 text-center">16</td>
                    <td className="px-4 py-3 text-center">-</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
          {/* Khối cơ sở ngành */}
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <div className="p-6 border-b border-gray-200 bg-gray-50">
              <h3 className="text-lg font-bold text-gray-800">Khối Cơ sở ngành</h3>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-blue-50 border-b">
                  <tr>
                    <th className="px-6 py-3 text-left font-semibold text-gray-700">Mã HP</th>
                    <th className="px-6 py-3 text-left font-semibold text-gray-700">Tên học phần</th>
                    <th className="px-6 py-3 text-center font-semibold text-gray-700">Số tín chỉ</th>
                    <th className="px-6 py-3 text-center font-semibold text-gray-700">Loại</th>
                    <th className="px-6 py-3 text-center font-semibold text-gray-700">Học kỳ đề xuất</th>
                    <th className="px-6 py-3 text-center font-semibold text-gray-700">Số VĐ</th>
                  </tr>
                </thead>
                <tbody>
                  {/* Dữ liệu mẫu, bạn có thể thay bằng dữ liệu thực tế */}
                  <tr className="border-b hover:bg-gray-50">
                    <td className="px-6 py-3 font-medium text-gray-800">IT201</td>
                    <td className="px-6 py-3 text-gray-700">Cấu trúc dữ liệu & Giải thuật</td>
                    <td className="px-6 py-3 text-center text-gray-700">3</td>
                    <td className="px-6 py-3 text-center">Bắt buộc</td>
                    <td className="px-6 py-3 text-center">HK2</td>
                    <td className="px-6 py-3 text-center">2</td>
                  </tr>
                  <tr className="border-b hover:bg-gray-50">
                    <td className="px-6 py-3 font-medium text-gray-800">IT202</td>
                    <td className="px-6 py-3 text-gray-700">Cơ sở dữ liệu</td>
                    <td className="px-6 py-3 text-center text-gray-700">3</td>
                    <td className="px-6 py-3 text-center">Bắt buộc</td>
                    <td className="px-6 py-3 text-center">HK3</td>
                    <td className="px-6 py-3 text-center">2</td>
                  </tr>
                  <tr className="border-b hover:bg-gray-50">
                    <td className="px-6 py-3 font-medium text-gray-800">IT203</td>
                    <td className="px-6 py-3 text-gray-700">Hệ điều hành</td>
                    <td className="px-6 py-3 text-center text-gray-700">3</td>
                    <td className="px-6 py-3 text-center">Bắt buộc</td>
                    <td className="px-6 py-3 text-center">HK2</td>
                    <td className="px-6 py-3 text-center">4</td>
                  </tr>
                  <tr className="border-b hover:bg-gray-50">
                    <td className="px-6 py-3 font-medium text-gray-800">IT204</td>
                    <td className="px-6 py-3 text-gray-700">Lập trình hướng đối tượng</td>
                    <td className="px-6 py-3 text-center text-gray-700">3</td>
                    <td className="px-6 py-3 text-center">Tự chọn</td>
                    <td className="px-6 py-3 text-center">HK5</td>
                    <td className="px-6 py-3 text-center">5</td>
                  </tr>
                  <tr className="border-b hover:bg-gray-50">
                    <td className="px-6 py-3 font-medium text-gray-800">IT205</td>
                    <td className="px-6 py-3 text-gray-700">Lập trình web</td>
                    <td className="px-6 py-3 text-center text-gray-700">3</td>
                    <td className="px-6 py-3 text-center">Tự chọn</td>
                    <td className="px-6 py-3 text-center">HK5</td>
                    <td className="px-6 py-3 text-center">5</td>
                  </tr>
                  <tr className="border-b hover:bg-gray-50">
                    <td className="px-6 py-3 font-medium text-gray-800">IT206</td>
                    <td className="px-6 py-3 text-gray-700">Phân tích & thiết kế hệ thống</td>
                    <td className="px-6 py-3 text-center text-gray-700">3</td>
                    <td className="px-6 py-3 text-center">Tự chọn</td>
                    <td className="px-6 py-3 text-center">HK5</td>
                    <td className="px-6 py-3 text-center">5</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <div className="p-4 bg-gray-50 border-t text-sm text-gray-600">
              Tổng số tín chỉ toàn CTĐT: 120 | Học phần: 45 môn | 8 học kỳ
            </div>
          </div>
        </div>
        <div className="flex flex-col gap-6 flex-1">
          {/* Pie Chart */}
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-bold text-gray-800 mb-4">Tóm tắt CTĐT</h3>
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie 
                  data={pieData} 
                  cx="50%" 
                  cy="50%" 
                  labelLine={false} 
                  label={({ name, value, percent }) => `${name}: ${value} (${(percent * 100).toFixed(0)}%)`}
                  outerRadius={80}
                  dataKey="value"
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.fill} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => `${value} tín chỉ`} />
              </PieChart>
            </ResponsiveContainer>
            <div className="flex justify-center gap-4 mt-4">
              <div className="flex items-center gap-2">
                <span className="inline-block w-3 h-3 rounded-full bg-[#2c5aa0]"></span>
                <span>Bắt buộc</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="inline-block w-3 h-3 rounded-full bg-[#f4b740]"></span>
                <span>Tự chọn</span>
              </div>
            </div>
          </div>
          {/* Bar Chart */}
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-bold text-gray-800 mb-4">Biểu đồ tổng hợp</h3>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={barData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="value" fill="#2c5aa0" name="Tín chỉ" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  </div>
);
