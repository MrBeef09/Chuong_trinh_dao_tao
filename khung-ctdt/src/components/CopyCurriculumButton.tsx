'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Copy, Check } from 'lucide-react';

interface Major {
    id: string;
    name: string;
    code: string;
    faculty: {
        name: string;
        school: {
            name: string;
            university: {
                name: string;
            };
        };
    };
}

interface Curriculum {
    id: string;
    name: string;
    code: string;
    academicYear: string;
    major: Major;
}

interface CopyCurriculumButtonProps {
    curriculum: Curriculum;
}

export default function CopyCurriculumButton({ curriculum }: CopyCurriculumButtonProps) {
    const router = useRouter();
    const [showModal, setShowModal] = useState(false);
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        newName: `${curriculum.name} - Bản sao`,
        newCode: `${curriculum.code}_COPY`,
        newAcademicYear: ''
    });

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!formData.newName || !formData.newCode || !formData.newAcademicYear) {
            alert('Vui lòng điền đầy đủ thông tin');
            return;
        }

        setLoading(true);

        try {
            const response = await fetch(`/api/curricula/${curriculum.id}/copy`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            });

            if (response.ok) {
                const result = await response.json();
                setShowModal(false);
                // Redirect to the new curriculum
                router.push(`/curricula/${result.curriculum.id}`);
            } else {
                const error = await response.json();
                alert(error.error || 'Có lỗi xảy ra khi sao chép chương trình đào tạo');
            }
        } catch (error) {
            console.error('Error copying curriculum:', error);
            alert('Có lỗi xảy ra khi sao chép chương trình đào tạo');
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <button
                onClick={() => setShowModal(true)}
                className="p-2 text-gray-600 hover:text-purple-600 hover:bg-purple-50 rounded-lg transition-colors"
                title="Sao chép CTĐT"
            >
                <Copy className="h-5 w-5" />
            </button>

            {/* Copy Modal */}
            {showModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg shadow-xl w-full max-w-md mx-4">
                        <div className="bg-gray-50 px-6 py-4 border-b border-gray-200">
                            <div className="flex items-center gap-3">
                                <Copy className="h-6 w-6 text-purple-600" />
                                <h3 className="text-lg font-semibold text-gray-900">
                                    Sao chép chương trình đào tạo
                                </h3>
                            </div>
                        </div>

                        <div className="p-6">
                            <div className="mb-4 p-3 bg-blue-50 rounded-lg">
                                <p className="text-sm text-blue-800">
                                    <strong>Gốc:</strong> {curriculum.name} ({curriculum.code})
                                </p>
                                <p className="text-sm text-blue-600">
                                    {curriculum.major.name} - {curriculum.academicYear}
                                </p>
                            </div>

                            <form onSubmit={handleSubmit} className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Tên chương trình đào tạo mới *
                                    </label>
                                    <input
                                        type="text"
                                        name="newName"
                                        value={formData.newName}
                                        onChange={handleInputChange}
                                        required
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Mã chương trình đào tạo mới *
                                    </label>
                                    <input
                                        type="text"
                                        name="newCode"
                                        value={formData.newCode}
                                        onChange={handleInputChange}
                                        required
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Năm học áp dụng mới *
                                    </label>
                                    <input
                                        type="text"
                                        name="newAcademicYear"
                                        value={formData.newAcademicYear}
                                        onChange={handleInputChange}
                                        required
                                        placeholder="VD: 2025-2026"
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                                    />
                                </div>

                                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
                                    <div className="flex items-start gap-2">
                                        <Check className="h-4 w-4 text-yellow-600 mt-0.5 flex-shrink-0" />
                                        <div className="text-sm text-yellow-800">
                                            <p className="font-medium">Sẽ sao chép:</p>
                                            <ul className="mt-1 space-y-1">
                                                <li>• Tất cả khối kiến thức</li>
                                                <li>• Tất cả học phần và phân loại</li>
                                                <li>• Cấu trúc và thứ tự học phần</li>
                                                <li>• Điều kiện tiên quyết</li>
                                            </ul>
                                        </div>
                                    </div>
                                </div>

                                <div className="flex justify-end gap-3 pt-4">
                                    <button
                                        type="button"
                                        onClick={() => setShowModal(false)}
                                        className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                                    >
                                        Hủy
                                    </button>
                                    <button
                                        type="submit"
                                        disabled={loading}
                                        className="bg-purple-600 hover:bg-purple-700 disabled:bg-purple-400 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
                                    >
                                        {loading ? (
                                            <>
                                                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                                                Đang sao chép...
                                            </>
                                        ) : (
                                            <>
                                                <Copy className="h-4 w-4" />
                                                Sao chép
                                            </>
                                        )}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}

