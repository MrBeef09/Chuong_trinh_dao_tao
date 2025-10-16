import Link from 'next/link';
import { prisma } from '@/lib/prisma';
import { Plus, BookOpen, Edit, Eye, Trash2, Copy } from 'lucide-react';
import CopyCurriculumButton from '@/components/CopyCurriculumButton';

export default async function CurriculaPage() {
    const curricula = await prisma.curriculum.findMany({
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
            subjects: true
        },
        orderBy: {
            createdAt: 'desc'
        }
    });

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'Active':
                return 'bg-green-100 text-green-800';
            case 'Draft':
                return 'bg-yellow-100 text-yellow-800';
            case 'Archived':
                return 'bg-gray-100 text-gray-800';
            default:
                return 'bg-gray-100 text-gray-800';
        }
    };

    const getTotalCredits = (curriculum: any) => {
        return curriculum.subjects.reduce((total: number, cs: any) => total + cs.credits, 0);
    };

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">Chương trình đào tạo</h1>
                    <p className="text-gray-600 mt-2">
                        Quản lý các chương trình đào tạo và khung CTĐT
                    </p>
                </div>
                <Link
                    href="/curricula/new"
                    className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
                >
                    <Plus className="h-5 w-5" />
                    Tạo CTĐT mới
                </Link>
            </div>

            {curricula.length === 0 ? (
                <div className="text-center py-12">
                    <BookOpen className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">
                        Chưa có chương trình đào tạo nào
                    </h3>
                    <p className="text-gray-500 mb-6">
                        Bắt đầu bằng cách tạo chương trình đào tạo đầu tiên
                    </p>
                    <Link
                        href="/curricula/new"
                        className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg inline-flex items-center gap-2 transition-colors"
                    >
                        <Plus className="h-5 w-5" />
                        Tạo CTĐT mới
                    </Link>
                </div>
            ) : (
                <div className="grid gap-6">
                    {curricula.map((curriculum) => (
                        <div key={curriculum.id} className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-md transition-shadow">
                            <div className="flex justify-between items-start mb-4">
                                <div className="flex-1">
                                    <div className="flex items-center gap-3 mb-2">
                                        <h3 className="text-xl font-semibold text-gray-900">
                                            {curriculum.name}
                                        </h3>
                                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(curriculum.status)}`}>
                                            {curriculum.status}
                                        </span>
                                    </div>
                                    <div className="text-sm text-gray-600 space-y-1">
                                        <p><span className="font-medium">Mã CTĐT:</span> {curriculum.code}</p>
                                        <p><span className="font-medium">Phiên bản:</span> {curriculum.version}</p>
                                        <p><span className="font-medium">Năm học:</span> {curriculum.academicYear}</p>
                                        <p><span className="font-medium">Ngành:</span> {curriculum.major.name}</p>
                                        <p><span className="font-medium">Khoa:</span> {curriculum.major.faculty.name}</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-2">
                                    <Link
                                        href={`/curricula/${curriculum.id}`}
                                        className="p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                                        title="Xem chi tiết"
                                    >
                                        <Eye className="h-5 w-5" />
                                    </Link>
                                    <CopyCurriculumButton curriculum={curriculum} />
                                    <Link
                                        href={`/curricula/${curriculum.id}/edit`}
                                        className="p-2 text-gray-600 hover:text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                                        title="Chỉnh sửa"
                                    >
                                        <Edit className="h-5 w-5" />
                                    </Link>
                                    <Link
                                        href={`/curricula/${curriculum.id}/delete`}
                                        className="p-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                        title="Xóa"
                                    >
                                        <Trash2 className="h-5 w-5" />
                                    </Link>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                                <div className="bg-blue-50 p-3 rounded-lg">
                                    <div className="text-sm text-blue-600 font-medium">Tổng tín chỉ</div>
                                    <div className="text-lg font-semibold text-blue-900">
                                        {getTotalCredits(curriculum)} / {curriculum.totalCredits}
                                    </div>
                                </div>
                                <div className="bg-green-50 p-3 rounded-lg">
                                    <div className="text-sm text-green-600 font-medium">Khối kiến thức</div>
                                    <div className="text-lg font-semibold text-green-900">
                                        {curriculum.knowledgeBlocks.length}
                                    </div>
                                </div>
                                <div className="bg-purple-50 p-3 rounded-lg">
                                    <div className="text-sm text-purple-600 font-medium">Học phần</div>
                                    <div className="text-lg font-semibold text-purple-900">
                                        {curriculum.subjects.length}
                                    </div>
                                </div>
                            </div>

                            {curriculum.description && (
                                <p className="text-gray-600 text-sm line-clamp-2">
                                    {curriculum.description}
                                </p>
                            )}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
