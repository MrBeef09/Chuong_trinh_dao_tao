import { notFound } from 'next/navigation';
import Link from 'next/link';
import { prisma } from '@/lib/prisma';
import { ArrowLeft, Edit, Plus, BookOpen, CheckCircle, AlertCircle, FileText } from 'lucide-react';
import CurriculumBuilder from '@/components/CurriculumBuilder';

interface CurriculumPageProps {
    params: {
        id: string;
    };
}

export default async function CurriculumPage({ params }: CurriculumPageProps) {
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
                        },
                        orderBy: {
                            order: 'asc'
                        }
                    }
                },
                orderBy: {
                    order: 'asc'
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

    const getTotalCredits = () => {
        return curriculum.subjects.reduce((total, cs) => total + cs.credits, 0);
    };

    const getRequiredCredits = () => {
        return curriculum.subjects
            .filter(cs => cs.type === 'Required')
            .reduce((total, cs) => total + cs.credits, 0);
    };

    const getElectiveCredits = () => {
        return curriculum.subjects
            .filter(cs => cs.type === 'Elective')
            .reduce((total, cs) => total + cs.credits, 0);
    };

    const totalCredits = getTotalCredits();
    const requiredCredits = getRequiredCredits();
    const electiveCredits = getElectiveCredits();

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="flex items-center gap-4 mb-8">
                    <Link
                        href="/curricula"
                        className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
                    >
                        <ArrowLeft className="h-5 w-5" />
                    </Link>
                    <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                            <h1 className="text-3xl font-bold text-gray-900">{curriculum.name}</h1>
                            <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(curriculum.status)}`}>
                                {curriculum.status}
                            </span>
                        </div>
                        <div className="text-gray-600 space-y-1">
                            <p><span className="font-medium">Mã CTĐT:</span> {curriculum.code}</p>
                            <p><span className="font-medium">Phiên bản:</span> {curriculum.version}</p>
                            <p><span className="font-medium">Năm học:</span> {curriculum.academicYear}</p>
                            <p><span className="font-medium">Ngành:</span> {curriculum.major.name} ({curriculum.major.code})</p>
                            <p><span className="font-medium">Khoa:</span> {curriculum.major.faculty.name}</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-2">
                        <Link
                            href={`/curricula/${curriculum.id}/display`}
                            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
                        >
                            <FileText className="h-4 w-4" />
                            Hiển thị CTĐT
                        </Link>
                        <Link
                            href={`/curricula/${curriculum.id}/edit`}
                            className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
                        >
                            <Edit className="h-4 w-4" />
                            Chỉnh sửa
                        </Link>
                    </div>
                </div>

                {/* Summary Cards */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                    <div className="bg-blue-50 p-6 rounded-lg">
                        <div className="flex items-center gap-3 mb-2">
                            <BookOpen className="h-6 w-6 text-blue-600" />
                            <div className="text-sm text-blue-600 font-medium">Tổng tín chỉ</div>
                        </div>
                        <div className="text-2xl font-bold text-blue-900">
                            {totalCredits} / {curriculum.totalCredits}
                        </div>
                        <div className="text-xs text-blue-600 mt-1">
                            {totalCredits >= curriculum.totalCredits ? (
                                <span className="flex items-center gap-1">
                                    <CheckCircle className="h-3 w-3" />
                                    Đủ tín chỉ
                                </span>
                            ) : (
                                <span className="flex items-center gap-1">
                                    <AlertCircle className="h-3 w-3" />
                                    Thiếu {curriculum.totalCredits - totalCredits} tín chỉ
                                </span>
                            )}
                        </div>
                    </div>

                    <div className="bg-green-50 p-6 rounded-lg">
                        <div className="flex items-center gap-3 mb-2">
                            <CheckCircle className="h-6 w-6 text-green-600" />
                            <div className="text-sm text-green-600 font-medium">Bắt buộc</div>
                        </div>
                        <div className="text-2xl font-bold text-green-900">
                            {requiredCredits}
                        </div>
                        <div className="text-xs text-green-600 mt-1">
                            {curriculum.subjects.filter(cs => cs.type === 'Required').length} học phần
                        </div>
                    </div>

                    <div className="bg-purple-50 p-6 rounded-lg">
                        <div className="flex items-center gap-3 mb-2">
                            <Plus className="h-6 w-6 text-purple-600" />
                            <div className="text-sm text-purple-600 font-medium">Tự chọn</div>
                        </div>
                        <div className="text-2xl font-bold text-purple-900">
                            {electiveCredits}
                        </div>
                        <div className="text-xs text-purple-600 mt-1">
                            {curriculum.subjects.filter(cs => cs.type === 'Elective').length} học phần
                        </div>
                    </div>

                    <div className="bg-orange-50 p-6 rounded-lg">
                        <div className="flex items-center gap-3 mb-2">
                            <BookOpen className="h-6 w-6 text-orange-600" />
                            <div className="text-sm text-orange-600 font-medium">Khối kiến thức</div>
                        </div>
                        <div className="text-2xl font-bold text-orange-900">
                            {curriculum.knowledgeBlocks.length}
                        </div>
                        <div className="text-xs text-orange-600 mt-1">
                            Khối kiến thức
                        </div>
                    </div>
                </div>

                {/* Curriculum Builder */}
                <CurriculumBuilder curriculum={curriculum} />

                {/* Description */}
                {curriculum.description && (
                    <div className="bg-white rounded-lg border border-gray-200 p-6 mt-8">
                        <h3 className="text-lg font-semibold text-gray-900 mb-3">Mô tả</h3>
                        <p className="text-gray-700 whitespace-pre-wrap">{curriculum.description}</p>
                    </div>
                )}
            </div>
        </div>
    );
}
