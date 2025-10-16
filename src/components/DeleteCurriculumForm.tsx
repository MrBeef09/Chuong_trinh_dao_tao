'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Trash2, AlertTriangle } from 'lucide-react';

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
    description?: string;
    version: string;
    academicYear: string;
    totalCredits: number;
    duration: number;
    level: string;
    status: string;
    approvedBy?: string;
    approvedAt?: Date;
    major: Major;
}

interface DeleteCurriculumFormProps {
    curriculum: Curriculum;
}

export default function DeleteCurriculumForm({ curriculum }: DeleteCurriculumFormProps) {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [confirmText, setConfirmText] = useState('');
    const [confirmDelete, setConfirmDelete] = useState(false);

    const expectedText = `DELETE ${curriculum.code}`;
    const isConfirmTextValid = confirmText === expectedText;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!isConfirmTextValid) {
            alert('Vui lòng nhập đúng mã xác nhận');
            return;
        }

        if (!confirmDelete) {
            alert('Vui lòng xác nhận rằng bạn muốn xóa chương trình đào tạo này');
            return;
        }

        setLoading(true);

        try {
            const response = await fetch(`/api/curricula/${curriculum.id}`, {
                method: 'DELETE',
            });

            if (response.ok) {
                router.push('/curricula');
            } else {
                const error = await response.json();
                alert(error.error || 'Có lỗi xảy ra khi xóa chương trình đào tạo');
            }
        } catch (error) {
            console.error('Error deleting curriculum:', error);
            alert('Có lỗi xảy ra khi xóa chương trình đào tạo');
        } finally {
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            <div className="bg-white rounded-lg border border-gray-200 p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-6">Xác nhận xóa</h2>

                {/* Confirmation Checkbox */}
                <div className="mb-6">
                    <label className="flex items-start gap-3 cursor-pointer">
                        <input
                            type="checkbox"
                            checked={confirmDelete}
                            onChange={(e) => setConfirmDelete(e.target.checked)}
                            className="mt-1 h-4 w-4 text-red-600 focus:ring-red-500 border-gray-300 rounded"
                        />
                        <div>
                            <p className="text-gray-900 font-medium">
                                Tôi hiểu rằng hành động này không thể hoàn tác
                            </p>
                            <p className="text-sm text-gray-600 mt-1">
                                Tôi xác nhận rằng tôi muốn xóa vĩnh viễn chương trình đào tạo "{curriculum.name}"
                                và tất cả dữ liệu liên quan.
                            </p>
                        </div>
                    </label>
                </div>

                {/* Confirmation Text Input */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Để xác nhận, vui lòng nhập: <code className="bg-gray-100 px-2 py-1 rounded text-red-600 font-mono">
                            DELETE {curriculum.code}
                        </code>
                    </label>
                    <input
                        type="text"
                        value={confirmText}
                        onChange={(e) => setConfirmText(e.target.value)}
                        placeholder={`DELETE ${curriculum.code}`}
                        className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent ${confirmText && !isConfirmTextValid
                                ? 'border-red-300 bg-red-50'
                                : 'border-gray-300'
                            }`}
                    />
                    {confirmText && !isConfirmTextValid && (
                        <p className="text-red-600 text-sm mt-1">
                            Mã xác nhận không đúng
                        </p>
                    )}
                </div>

                {/* Warning */}
                <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                    <div className="flex items-start gap-3">
                        <AlertTriangle className="h-5 w-5 text-red-600 flex-shrink-0 mt-0.5" />
                        <div>
                            <p className="text-red-800 font-medium">
                                Dữ liệu sẽ bị xóa vĩnh viễn
                            </p>
                            <p className="text-red-700 text-sm mt-1">
                                Sau khi xóa, bạn sẽ không thể khôi phục lại chương trình đào tạo này
                                và tất cả dữ liệu liên quan.
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Action Buttons */}
            <div className="flex justify-end gap-4">
                <Link
                    href={`/curricula/${curriculum.id}`}
                    className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                    Hủy
                </Link>
                <button
                    type="submit"
                    disabled={loading || !confirmDelete || !isConfirmTextValid}
                    className="bg-red-600 hover:bg-red-700 disabled:bg-red-400 text-white px-6 py-2 rounded-lg flex items-center gap-2 transition-colors"
                >
                    <Trash2 className="h-4 w-4" />
                    {loading ? 'Đang xóa...' : 'Xóa chương trình đào tạo'}
                </button>
            </div>
        </form>
    );
}

