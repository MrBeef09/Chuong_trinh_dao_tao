import { notFound } from 'next/navigation';
import Link from 'next/link';
import { prisma } from '@/lib/prisma';
import { ArrowLeft, AlertTriangle, Trash2 } from 'lucide-react';
import DeleteCurriculumForm from '@/components/DeleteCurriculumForm';

interface CurriculumDeletePageProps {
    params: {
        id: string;
    };
}

export default async function CurriculumDeletePage({ params }: CurriculumDeletePageProps) {
    const curriculum = await prisma.curriculum.findUnique({
        where: { id: params.id },
        include: {
            major: {
                include: {
                    faculty: {
                        include: {
                            school: {
                                include: {
                                    university: true
                                }
                            }
                        }
                    }
                }
            },
            knowledgeBlocks: {
                include: {
                    knowledgeBlock: true,
                    subjects: {
                        include: {
                            subject: true
                        }
                    }
                }
            },
            subjects: {
                include: {
                    subject: true
                }
            }
        }
    });

    if (!curriculum) {
        notFound();
    }

    const getTotalCredits = () => {
        return curriculum.subjects.reduce((total, cs) => total + cs.credits, 0);
    };

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="max-w-2xl mx-auto">
                <div className="flex items-center gap-4 mb-8">
                    <Link
                        href={`/curricula/${curriculum.id}`}
                        className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
                    >
                        <ArrowLeft className="h-5 w-5" />
                    </Link>
                    <div>
                        <h1 className="text-3xl font-bold text-red-600">Xóa chương trình đào tạo</h1>
                        <p className="text-gray-600 mt-2">
                            Xác nhận xóa chương trình đào tạo: {curriculum.name}
                        </p>
                    </div>
                </div>

                {/* Warning */}
                <div className="bg-red-50 border border-red-200 rounded-lg p-6 mb-8">
                    <div className="flex items-start gap-3">
                        <AlertTriangle className="h-6 w-6 text-red-600 flex-shrink-0 mt-0.5" />
                        <div>
                            <h3 className="text-lg font-semibold text-red-800 mb-2">
                                Cảnh báo: Hành động không thể hoàn tác
                            </h3>
                            <p className="text-red-700 mb-4">
                                Việc xóa chương trình đào tạo này sẽ xóa vĩnh viễn tất cả dữ liệu liên quan, bao gồm:
                            </p>
                            <ul className="text-red-700 space-y-1 ml-4">
                                <li>• Tất cả khối kiến thức trong chương trình đào tạo</li>
                                <li>• Tất cả học phần đã được gán vào chương trình đào tạo</li>
                                <li>• Lịch sử phê duyệt và thông tin liên quan</li>
                            </ul>
                        </div>
                    </div>
                </div>

                {/* Curriculum Details */}
                <div className="bg-white rounded-lg border border-gray-200 p-6 mb-8">
                    <h2 className="text-xl font-semibold text-gray-900 mb-4">Thông tin chương trình đào tạo</h2>

                    <div className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Tên CTĐT</label>
                                <p className="text-gray-900">{curriculum.name}</p>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Mã CTĐT</label>
                                <p className="text-gray-900">{curriculum.code}</p>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Phiên bản</label>
                                <p className="text-gray-900">{curriculum.version}</p>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Năm học</label>
                                <p className="text-gray-900">{curriculum.academicYear}</p>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Ngành học</label>
                                <p className="text-gray-900">{curriculum.major.name} ({curriculum.major.code})</p>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Khoa</label>
                                <p className="text-gray-900">{curriculum.major.faculty.name}</p>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Trạng thái</label>
                                <p className="text-gray-900">{curriculum.status}</p>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Tổng tín chỉ</label>
                                <p className="text-gray-900">{getTotalCredits()} / {curriculum.totalCredits}</p>
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Thống kê</label>
                            <div className="grid grid-cols-3 gap-4 text-center">
                                <div className="bg-blue-50 p-3 rounded-lg">
                                    <div className="text-2xl font-bold text-blue-900">
                                        {curriculum.knowledgeBlocks.length}
                                    </div>
                                    <div className="text-sm text-blue-600">Khối kiến thức</div>
                                </div>
                                <div className="bg-green-50 p-3 rounded-lg">
                                    <div className="text-2xl font-bold text-green-900">
                                        {curriculum.subjects.length}
                                    </div>
                                    <div className="text-sm text-green-600">Học phần</div>
                                </div>
                                <div className="bg-purple-50 p-3 rounded-lg">
                                    <div className="text-2xl font-bold text-purple-900">
                                        {curriculum.duration}
                                    </div>
                                    <div className="text-sm text-purple-600">Tháng</div>
                                </div>
                            </div>
                        </div>

                        {curriculum.description && (
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Mô tả</label>
                                <p className="text-gray-900 whitespace-pre-wrap">{curriculum.description}</p>
                            </div>
                        )}
                    </div>
                </div>

                {/* Delete Form */}
                <DeleteCurriculumForm curriculum={curriculum} />
            </div>
        </div>
    );
}

