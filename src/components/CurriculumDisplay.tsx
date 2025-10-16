'use client';

import { useRef } from 'react';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { Download, FileText } from 'lucide-react';

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
    knowledgeBlocks: CurriculumKnowledgeBlock[];
    subjects: CurriculumSubject[];
}

interface CurriculumDisplayProps {
    curriculum: Curriculum;
    showPDFButton?: boolean;
}

export default function CurriculumDisplay({ curriculum, showPDFButton = true }: CurriculumDisplayProps) {
    const contentRef = useRef<HTMLDivElement>(null);

    const generatePDF = async () => {
        if (!contentRef.current) return;

        try {
            const canvas = await html2canvas(contentRef.current, {
                scale: 2,
                useCORS: true,
                allowTaint: true,
                backgroundColor: '#ffffff'
            });

            const imgData = canvas.toDataURL('image/png');
            const pdf = new jsPDF('p', 'mm', 'a4');

            const imgWidth = 210;
            const pageHeight = 295;
            const imgHeight = (canvas.height * imgWidth) / canvas.width;
            let heightLeft = imgHeight;

            let position = 0;

            pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
            heightLeft -= pageHeight;

            while (heightLeft >= 0) {
                position = heightLeft - imgHeight;
                pdf.addPage();
                pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
                heightLeft -= pageHeight;
            }

            pdf.save(`CTDT_${curriculum.code}_${curriculum.academicYear}.pdf`);
        } catch (error) {
            console.error('Error generating PDF:', error);
            alert('Có lỗi xảy ra khi tạo file PDF');
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

    const getCreditsInKnowledgeBlock = (knowledgeBlock: CurriculumKnowledgeBlock) => {
        return knowledgeBlock.subjects.reduce((total, cs) => total + cs.credits, 0);
    };

    return (
        <>
            {showPDFButton && (
                <button
                    onClick={generatePDF}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
                >
                    <Download className="h-4 w-4" />
                    Xuất PDF
                </button>
            )}

            {/* PDF Content */}
            <div ref={contentRef} className="bg-white p-8 text-gray-900">
                {/* Header */}
                <div className="text-center mb-8 border-b-2 border-gray-300 pb-6">
                    <h1 className="text-2xl font-bold mb-2">CHƯƠNG TRÌNH ĐÀO TẠO</h1>
                    <h2 className="text-xl font-semibold mb-4">{curriculum.name}</h2>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                            <p><strong>Mã CTĐT:</strong> {curriculum.code}</p>
                            <p><strong>Phiên bản:</strong> {curriculum.version}</p>
                            <p><strong>Năm học:</strong> {curriculum.academicYear}</p>
                        </div>
                        <div>
                            <p><strong>Ngành học:</strong> {curriculum.major.name} ({curriculum.major.code})</p>
                            <p><strong>Khoa:</strong> {curriculum.major.faculty.name}</p>
                            <p><strong>Trường:</strong> {curriculum.major.faculty.school.name}</p>
                        </div>
                    </div>
                </div>

                {/* Summary */}
                <div className="mb-8">
                    <h3 className="text-lg font-semibold mb-4 border-b border-gray-300 pb-2">THÔNG TIN TỔNG QUAN</h3>
                    <div className="grid grid-cols-4 gap-4 text-sm">
                        <div className="text-center p-3 bg-gray-50 rounded">
                            <div className="font-semibold text-lg">{getTotalCredits()}</div>
                            <div>Tổng tín chỉ</div>
                        </div>
                        <div className="text-center p-3 bg-green-50 rounded">
                            <div className="font-semibold text-lg">{getRequiredCredits()}</div>
                            <div>Bắt buộc</div>
                        </div>
                        <div className="text-center p-3 bg-purple-50 rounded">
                            <div className="font-semibold text-lg">{getElectiveCredits()}</div>
                            <div>Tự chọn</div>
                        </div>
                        <div className="text-center p-3 bg-blue-50 rounded">
                            <div className="font-semibold text-lg">{curriculum.duration}</div>
                            <div>Tháng</div>
                        </div>
                    </div>
                </div>

                {/* Knowledge Blocks */}
                <div className="mb-8">
                    <h3 className="text-lg font-semibold mb-4 border-b border-gray-300 pb-2">CẤU TRÚC CHƯƠNG TRÌNH ĐÀO TẠO</h3>

                    {curriculum.knowledgeBlocks.map((knowledgeBlock, blockIndex) => {
                        const currentCredits = getCreditsInKnowledgeBlock(knowledgeBlock);

                        return (
                            <div key={knowledgeBlock.id} className="mb-6">
                                {/* Knowledge Block Header */}
                                <div className="bg-gray-100 p-4 rounded-t-lg border border-gray-300">
                                    <div className="flex justify-between items-center">
                                        <div>
                                            <h4 className="text-lg font-semibold">
                                                {blockIndex + 1}. {knowledgeBlock.knowledgeBlock.name}
                                            </h4>
                                            <p className="text-sm text-gray-600">
                                                {knowledgeBlock.knowledgeBlock.code} - Yêu cầu: {knowledgeBlock.requiredCredits} tín chỉ
                                            </p>
                                        </div>
                                        <div className="text-right">
                                            <div className="text-lg font-semibold">{currentCredits} / {knowledgeBlock.requiredCredits}</div>
                                            <div className="text-sm text-gray-600">tín chỉ</div>
                                        </div>
                                    </div>
                                </div>

                                {/* Subjects Table */}
                                {knowledgeBlock.subjects.length > 0 ? (
                                    <div className="border border-gray-300 border-t-0 rounded-b-lg overflow-hidden">
                                        <table className="w-full">
                                            <thead className="bg-gray-50">
                                                <tr>
                                                    <th className="px-4 py-2 text-left text-sm font-medium text-gray-700 border-b border-gray-200">STT</th>
                                                    <th className="px-4 py-2 text-left text-sm font-medium text-gray-700 border-b border-gray-200">Mã HP</th>
                                                    <th className="px-4 py-2 text-left text-sm font-medium text-gray-700 border-b border-gray-200">Tên học phần</th>
                                                    <th className="px-4 py-2 text-center text-sm font-medium text-gray-700 border-b border-gray-200">TC</th>
                                                    <th className="px-4 py-2 text-center text-sm font-medium text-gray-700 border-b border-gray-200">Loại</th>
                                                    <th className="px-4 py-2 text-center text-sm font-medium text-gray-700 border-b border-gray-200">HK</th>
                                                    <th className="px-4 py-2 text-left text-sm font-medium text-gray-700 border-b border-gray-200">Điều kiện</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {knowledgeBlock.subjects.map((curriculumSubject, subjectIndex) => (
                                                    <tr key={curriculumSubject.id} className={subjectIndex % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                                                        <td className="px-4 py-2 text-sm border-b border-gray-200">{subjectIndex + 1}</td>
                                                        <td className="px-4 py-2 text-sm font-medium border-b border-gray-200">{curriculumSubject.subject.code}</td>
                                                        <td className="px-4 py-2 text-sm border-b border-gray-200">{curriculumSubject.subject.name}</td>
                                                        <td className="px-4 py-2 text-sm text-center border-b border-gray-200">{curriculumSubject.credits}</td>
                                                        <td className="px-4 py-2 text-sm text-center border-b border-gray-200">
                                                            <span className={`px-2 py-1 rounded text-xs ${curriculumSubject.type === 'Required'
                                                                    ? 'bg-green-100 text-green-800'
                                                                    : 'bg-purple-100 text-purple-800'
                                                                }`}>
                                                                {curriculumSubject.type === 'Required' ? 'BB' : 'TC'}
                                                            </span>
                                                        </td>
                                                        <td className="px-4 py-2 text-sm text-center border-b border-gray-200">
                                                            {curriculumSubject.semester || '-'}
                                                        </td>
                                                        <td className="px-4 py-2 text-sm border-b border-gray-200">
                                                            {curriculumSubject.prerequisite || '-'}
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                ) : (
                                    <div className="border border-gray-300 border-t-0 rounded-b-lg p-8 text-center text-gray-500">
                                        <FileText className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                                        <p>Chưa có học phần nào trong khối kiến thức này</p>
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </div>

                {/* Description */}
                {curriculum.description && (
                    <div className="mb-8">
                        <h3 className="text-lg font-semibold mb-4 border-b border-gray-300 pb-2">MÔ TẢ CHƯƠNG TRÌNH ĐÀO TẠO</h3>
                        <p className="text-sm leading-relaxed whitespace-pre-wrap">{curriculum.description}</p>
                    </div>
                )}

                {/* Footer */}
                <div className="mt-12 pt-6 border-t-2 border-gray-300">
                    <div className="grid grid-cols-2 gap-8 text-sm">
                        <div>
                            <p><strong>Trạng thái:</strong> {curriculum.status}</p>
                            <p><strong>Trình độ:</strong> {curriculum.level}</p>
                        </div>
                        <div>
                            {curriculum.approvedBy && (
                                <p><strong>Người phê duyệt:</strong> {curriculum.approvedBy}</p>
                            )}
                            {curriculum.approvedAt && (
                                <p><strong>Ngày phê duyệt:</strong> {new Date(curriculum.approvedAt).toLocaleDateString('vi-VN')}</p>
                            )}
                        </div>
                    </div>
                    <div className="text-center text-xs text-gray-500 mt-4">
                        <p>Tài liệu được tạo tự động từ hệ thống quản lý đại học</p>
                        <p>Ngày tạo: {new Date().toLocaleDateString('vi-VN')}</p>
                    </div>
                </div>
            </div>
        </>
    );
}
