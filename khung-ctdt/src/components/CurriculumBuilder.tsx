'use client';

import { useState, useEffect } from 'react';
import { Plus, Trash2, Edit, BookOpen, CheckCircle, AlertCircle, Search, X } from 'lucide-react';

interface Subject {
    id: string;
    code: string;
    name: string;
    description?: string;
    credits: number;
    hours?: number;
    semester?: string;
    prerequisites?: string;
    status: string;
}

interface CurriculumSubject {
    id: string;
    type: string;
    credits: number;
    semester?: number;
    prerequisite?: string;
    coRequisite?: string;
    order: number;
    subject: Subject;
}

interface CurriculumKnowledgeBlock {
    id: string;
    requiredCredits: number;
    order: number;
    knowledgeBlock: {
        id: string;
        name: string;
        code: string;
        minCredits: number;
        maxCredits: number;
    };
    subjects: CurriculumSubject[];
}

interface Curriculum {
    id: string;
    name: string;
    code: string;
    totalCredits: number;
    status: string;
    knowledgeBlocks: CurriculumKnowledgeBlock[];
}

interface CurriculumBuilderProps {
    curriculum: Curriculum;
}

export default function CurriculumBuilder({ curriculum }: CurriculumBuilderProps) {
    const [availableSubjects, setAvailableSubjects] = useState<Subject[]>([]);
    const [selectedKnowledgeBlock, setSelectedKnowledgeBlock] = useState<string>('');
    const [searchTerm, setSearchTerm] = useState('');
    const [showSubjectModal, setShowSubjectModal] = useState(false);
    const [loading, setLoading] = useState(false);

    // Load available subjects when knowledge block changes
    useEffect(() => {
        if (selectedKnowledgeBlock) {
            loadAvailableSubjects(selectedKnowledgeBlock);
        }
    }, [selectedKnowledgeBlock]);

    const loadAvailableSubjects = async (knowledgeBlockId: string, search = '') => {
        setLoading(true);
        try {
            const response = await fetch(
                `/api/curricula/${curriculum.id}/available-subjects?knowledgeBlockId=${knowledgeBlockId}&search=${search}`
            );
            const data = await response.json();
            setAvailableSubjects(data.subjects || []);
        } catch (error) {
            console.error('Error loading available subjects:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        if (selectedKnowledgeBlock) {
            loadAvailableSubjects(selectedKnowledgeBlock, searchTerm);
        }
    };

    const addSubjectToCurriculum = async (subjectId: string, knowledgeBlockId: string) => {
        try {
            const response = await fetch(`/api/curricula/${curriculum.id}/subjects`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    subjectId,
                    type: 'Required', // Default to Required, can be changed later
                    curriculumKnowledgeBlockId: knowledgeBlockId
                }),
            });

            if (response.ok) {
                // Refresh the page to show updated curriculum
                window.location.reload();
            } else {
                const error = await response.json();
                alert(error.error || 'Có lỗi xảy ra khi thêm học phần');
            }
        } catch (error) {
            console.error('Error adding subject:', error);
            alert('Có lỗi xảy ra khi thêm học phần');
        }
    };

    const removeSubjectFromCurriculum = async (curriculumSubjectId: string) => {
        if (!confirm('Bạn có chắc chắn muốn xóa học phần này khỏi chương trình đào tạo?')) {
            return;
        }

        try {
            // Find the subject ID from curriculum subjects
            const curriculumSubject = curriculum.knowledgeBlocks
                .flatMap(kb => kb.subjects)
                .find(cs => cs.id === curriculumSubjectId);

            if (!curriculumSubject) {
                alert('Không tìm thấy học phần');
                return;
            }

            const response = await fetch(
                `/api/curricula/${curriculum.id}/subjects/${curriculumSubject.subject.id}`,
                {
                    method: 'DELETE',
                }
            );

            if (response.ok) {
                // Refresh the page to show updated curriculum
                window.location.reload();
            } else {
                const error = await response.json();
                alert(error.error || 'Có lỗi xảy ra khi xóa học phần');
            }
        } catch (error) {
            console.error('Error removing subject:', error);
            alert('Có lỗi xảy ra khi xóa học phần');
        }
    };

    const getCreditsInKnowledgeBlock = (knowledgeBlock: CurriculumKnowledgeBlock) => {
        return knowledgeBlock.subjects.reduce((total, cs) => total + cs.credits, 0);
    };

    const getCreditsStatus = (knowledgeBlock: CurriculumKnowledgeBlock) => {
        const currentCredits = getCreditsInKnowledgeBlock(knowledgeBlock);
        const requiredCredits = knowledgeBlock.requiredCredits;

        if (currentCredits >= requiredCredits) {
            return { status: 'sufficient', color: 'text-green-600' };
        } else if (currentCredits > 0) {
            return { status: 'partial', color: 'text-yellow-600' };
        } else {
            return { status: 'empty', color: 'text-red-600' };
        }
    };

    return (
        <div className="space-y-6">
            {/* Knowledge Blocks */}
            {curriculum.knowledgeBlocks.map((knowledgeBlock) => {
                const creditsStatus = getCreditsStatus(knowledgeBlock);
                const currentCredits = getCreditsInKnowledgeBlock(knowledgeBlock);

                return (
                    <div key={knowledgeBlock.id} className="bg-white rounded-lg border border-gray-200 overflow-hidden">
                        {/* Knowledge Block Header */}
                        <div className="bg-gray-50 px-6 py-4 border-b border-gray-200">
                            <div className="flex justify-between items-center">
                                <div>
                                    <h3 className="text-lg font-semibold text-gray-900">
                                        {knowledgeBlock.knowledgeBlock.name}
                                    </h3>
                                    <p className="text-sm text-gray-600">
                                        {knowledgeBlock.knowledgeBlock.code} - {knowledgeBlock.knowledgeBlock.minCredits}-{knowledgeBlock.knowledgeBlock.maxCredits} tín chỉ
                                    </p>
                                </div>
                                <div className="flex items-center gap-4">
                                    <div className="text-right">
                                        <div className={`text-lg font-semibold ${creditsStatus.color}`}>
                                            {currentCredits} / {knowledgeBlock.requiredCredits} tín chỉ
                                        </div>
                                        <div className="text-xs text-gray-500">
                                            {currentCredits >= knowledgeBlock.requiredCredits ? (
                                                <span className="flex items-center gap-1">
                                                    <CheckCircle className="h-3 w-3" />
                                                    Đủ tín chỉ
                                                </span>
                                            ) : (
                                                <span className="flex items-center gap-1">
                                                    <AlertCircle className="h-3 w-3" />
                                                    Thiếu {knowledgeBlock.requiredCredits - currentCredits} tín chỉ
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                    <button
                                        onClick={() => {
                                            setSelectedKnowledgeBlock(knowledgeBlock.id);
                                            setShowSubjectModal(true);
                                        }}
                                        className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
                                    >
                                        <Plus className="h-4 w-4" />
                                        Thêm học phần
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* Subjects in Knowledge Block */}
                        <div className="p-6">
                            {knowledgeBlock.subjects.length === 0 ? (
                                <div className="text-center py-8 text-gray-500">
                                    <BookOpen className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                                    <p>Chưa có học phần nào trong khối kiến thức này</p>
                                    <p className="text-sm">Nhấn "Thêm học phần" để bắt đầu</p>
                                </div>
                            ) : (
                                <div className="grid gap-4">
                                    {knowledgeBlock.subjects.map((curriculumSubject) => (
                                        <div key={curriculumSubject.id} className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-colors">
                                            <div className="flex justify-between items-start">
                                                <div className="flex-1">
                                                    <div className="flex items-center gap-3 mb-2">
                                                        <h4 className="font-medium text-gray-900">
                                                            {curriculumSubject.subject.name}
                                                        </h4>
                                                        <span className="text-sm text-gray-600">
                                                            {curriculumSubject.subject.code}
                                                        </span>
                                                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${curriculumSubject.type === 'Required'
                                                                ? 'bg-green-100 text-green-800'
                                                                : 'bg-purple-100 text-purple-800'
                                                            }`}>
                                                            {curriculumSubject.type === 'Required' ? 'Bắt buộc' : 'Tự chọn'}
                                                        </span>
                                                    </div>
                                                    <div className="text-sm text-gray-600 space-y-1">
                                                        <p><span className="font-medium">Tín chỉ:</span> {curriculumSubject.credits}</p>
                                                        {curriculumSubject.semester && (
                                                            <p><span className="font-medium">Học kỳ:</span> {curriculumSubject.semester}</p>
                                                        )}
                                                        {curriculumSubject.prerequisite && (
                                                            <p><span className="font-medium">Điều kiện tiên quyết:</span> {curriculumSubject.prerequisite}</p>
                                                        )}
                                                    </div>
                                                    {curriculumSubject.subject.description && (
                                                        <p className="text-sm text-gray-600 mt-2 line-clamp-2">
                                                            {curriculumSubject.subject.description}
                                                        </p>
                                                    )}
                                                </div>
                                                <div className="flex items-center gap-2 ml-4">
                                                    <button
                                                        className="p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                                                        title="Chỉnh sửa"
                                                    >
                                                        <Edit className="h-4 w-4" />
                                                    </button>
                                                    <button
                                                        onClick={() => removeSubjectFromCurriculum(curriculumSubject.id)}
                                                        className="p-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                                        title="Xóa"
                                                    >
                                                        <Trash2 className="h-4 w-4" />
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                );
            })}

            {/* Subject Selection Modal */}
            {showSubjectModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] overflow-hidden">
                        <div className="bg-gray-50 px-6 py-4 border-b border-gray-200">
                            <div className="flex justify-between items-center">
                                <h3 className="text-lg font-semibold text-gray-900">
                                    Thêm học phần vào khối kiến thức
                                </h3>
                                <button
                                    onClick={() => {
                                        setShowSubjectModal(false);
                                        setSelectedKnowledgeBlock('');
                                        setSearchTerm('');
                                        setAvailableSubjects([]);
                                    }}
                                    className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
                                >
                                    <X className="h-5 w-5" />
                                </button>
                            </div>
                        </div>

                        <div className="p-6">
                            {/* Search */}
                            <form onSubmit={handleSearch} className="mb-6">
                                <div className="flex gap-4">
                                    <div className="flex-1">
                                        <div className="relative">
                                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                                            <input
                                                type="text"
                                                value={searchTerm}
                                                onChange={(e) => setSearchTerm(e.target.value)}
                                                placeholder="Tìm kiếm học phần theo tên, mã hoặc mô tả..."
                                                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                            />
                                        </div>
                                    </div>
                                    <button
                                        type="submit"
                                        disabled={loading}
                                        className="bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white px-6 py-2 rounded-lg transition-colors"
                                    >
                                        {loading ? 'Đang tìm...' : 'Tìm kiếm'}
                                    </button>
                                </div>
                            </form>

                            {/* Available Subjects */}
                            {loading ? (
                                <div className="text-center py-8">
                                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
                                    <p className="text-gray-600 mt-2">Đang tải học phần...</p>
                                </div>
                            ) : availableSubjects.length === 0 ? (
                                <div className="text-center py-8 text-gray-500">
                                    <BookOpen className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                                    <p>Không tìm thấy học phần nào</p>
                                    <p className="text-sm">Thử thay đổi từ khóa tìm kiếm</p>
                                </div>
                            ) : (
                                <div className="grid gap-4 max-h-96 overflow-y-auto">
                                    {availableSubjects.map((subject) => (
                                        <div key={subject.id} className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-colors">
                                            <div className="flex justify-between items-start">
                                                <div className="flex-1">
                                                    <div className="flex items-center gap-3 mb-2">
                                                        <h4 className="font-medium text-gray-900">
                                                            {subject.name}
                                                        </h4>
                                                        <span className="text-sm text-gray-600">
                                                            {subject.code}
                                                        </span>
                                                        <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                                                            {subject.credits} tín chỉ
                                                        </span>
                                                    </div>
                                                    <div className="text-sm text-gray-600 space-y-1">
                                                        {subject.hours && (
                                                            <p><span className="font-medium">Số giờ:</span> {subject.hours}</p>
                                                        )}
                                                        {subject.semester && (
                                                            <p><span className="font-medium">Học kỳ:</span> {subject.semester}</p>
                                                        )}
                                                        {subject.prerequisites && (
                                                            <p><span className="font-medium">Điều kiện tiên quyết:</span> {subject.prerequisites}</p>
                                                        )}
                                                    </div>
                                                    {subject.description && (
                                                        <p className="text-sm text-gray-600 mt-2 line-clamp-2">
                                                            {subject.description}
                                                        </p>
                                                    )}
                                                </div>
                                                <button
                                                    onClick={() => {
                                                        addSubjectToCurriculum(subject.id, selectedKnowledgeBlock);
                                                        setShowSubjectModal(false);
                                                    }}
                                                    className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors ml-4"
                                                >
                                                    <Plus className="h-4 w-4" />
                                                    Thêm
                                                </button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

