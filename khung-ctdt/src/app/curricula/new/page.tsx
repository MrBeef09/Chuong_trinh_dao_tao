'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Plus, Trash2 } from 'lucide-react';

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

interface KnowledgeBlock {
    id: string;
    name: string;
    code: string;
    minCredits: number;
    maxCredits: number;
}

export default function NewCurriculumPage() {
    const router = useRouter();
    const [majors, setMajors] = useState<Major[]>([]);
    const [knowledgeBlocks, setKnowledgeBlocks] = useState<KnowledgeBlock[]>([]);
    const [selectedMajor, setSelectedMajor] = useState<string>('');
    const [selectedKnowledgeBlocks, setSelectedKnowledgeBlocks] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        code: '',
        description: '',
        version: '1.0',
        academicYear: '',
        totalCredits: '',
        duration: '',
        level: 'Đại học'
    });

    // Load majors and knowledge blocks on component mount
    useState(() => {
        const loadData = async () => {
            try {
                const [majorsRes, knowledgeBlocksRes] = await Promise.all([
                    fetch('/api/majors'),
                    fetch('/api/knowledge-blocks')
                ]);

                const majorsData = await majorsRes.json();
                const knowledgeBlocksData = await knowledgeBlocksRes.json();

                setMajors(majorsData);
                setKnowledgeBlocks(knowledgeBlocksData);
            } catch (error) {
                console.error('Error loading data:', error);
            }
        };

        loadData();
    });

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const addKnowledgeBlock = () => {
        if (selectedKnowledgeBlocks.length < knowledgeBlocks.length) {
            const availableBlocks = knowledgeBlocks.filter(
                kb => !selectedKnowledgeBlocks.some(skb => skb.knowledgeBlockId === kb.id)
            );

            if (availableBlocks.length > 0) {
                setSelectedKnowledgeBlocks(prev => [
                    ...prev,
                    {
                        knowledgeBlockId: availableBlocks[0].id,
                        requiredCredits: availableBlocks[0].minCredits,
                        order: prev.length + 1,
                        knowledgeBlock: availableBlocks[0]
                    }
                ]);
            }
        }
    };

    const updateKnowledgeBlock = (index: number, field: string, value: any) => {
        setSelectedKnowledgeBlocks(prev => prev.map((kb, i) =>
            i === index ? { ...kb, [field]: value } : kb
        ));
    };

    const removeKnowledgeBlock = (index: number) => {
        setSelectedKnowledgeBlocks(prev => prev.filter((_, i) => i !== index));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!selectedMajor || selectedKnowledgeBlocks.length === 0) {
            alert('Vui lòng chọn ngành học và ít nhất một khối kiến thức');
            return;
        }

        setLoading(true);

        try {
            const response = await fetch('/api/curricula', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    ...formData,
                    totalCredits: parseInt(formData.totalCredits),
                    duration: parseInt(formData.duration),
                    majorId: selectedMajor,
                    knowledgeBlocks: selectedKnowledgeBlocks.map(kb => ({
                        knowledgeBlockId: kb.knowledgeBlockId,
                        requiredCredits: parseInt(kb.requiredCredits),
                        order: kb.order
                    }))
                }),
            });

            if (response.ok) {
                const curriculum = await response.json();
                router.push(`/curricula/${curriculum.id}`);
            } else {
                const error = await response.json();
                alert(error.error || 'Có lỗi xảy ra khi tạo chương trình đào tạo');
            }
        } catch (error) {
            console.error('Error creating curriculum:', error);
            alert('Có lỗi xảy ra khi tạo chương trình đào tạo');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="max-w-4xl mx-auto">
                <div className="flex items-center gap-4 mb-8">
                    <Link
                        href="/curricula"
                        className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
                    >
                        <ArrowLeft className="h-5 w-5" />
                    </Link>
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900">Tạo chương trình đào tạo mới</h1>
                        <p className="text-gray-600 mt-2">
                            Tạo chương trình đào tạo và thiết lập khung CTĐT
                        </p>
                    </div>
                </div>

                <form onSubmit={handleSubmit} className="space-y-8">
                    {/* Basic Information */}
                    <div className="bg-white rounded-lg border border-gray-200 p-6">
                        <h2 className="text-xl font-semibold text-gray-900 mb-6">Thông tin cơ bản</h2>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Tên chương trình đào tạo *
                                </label>
                                <input
                                    type="text"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleInputChange}
                                    required
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    placeholder="VD: Công nghệ thông tin"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Mã chương trình đào tạo *
                                </label>
                                <input
                                    type="text"
                                    name="code"
                                    value={formData.code}
                                    onChange={handleInputChange}
                                    required
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    placeholder="VD: CNTT2024"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Ngành học *
                                </label>
                                <select
                                    value={selectedMajor}
                                    onChange={(e) => setSelectedMajor(e.target.value)}
                                    required
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                >
                                    <option value="">Chọn ngành học</option>
                                    {majors.map((major) => (
                                        <option key={major.id} value={major.id}>
                                            {major.name} ({major.code}) - {major.faculty.name}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Phiên bản
                                </label>
                                <input
                                    type="text"
                                    name="version"
                                    value={formData.version}
                                    onChange={handleInputChange}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Năm học áp dụng *
                                </label>
                                <input
                                    type="text"
                                    name="academicYear"
                                    value={formData.academicYear}
                                    onChange={handleInputChange}
                                    required
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    placeholder="VD: 2024-2025"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Trình độ đào tạo
                                </label>
                                <select
                                    name="level"
                                    value={formData.level}
                                    onChange={handleInputChange}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                >
                                    <option value="Đại học">Đại học</option>
                                    <option value="Thạc sĩ">Thạc sĩ</option>
                                    <option value="Tiến sĩ">Tiến sĩ</option>
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Tổng số tín chỉ *
                                </label>
                                <input
                                    type="number"
                                    name="totalCredits"
                                    value={formData.totalCredits}
                                    onChange={handleInputChange}
                                    required
                                    min="1"
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    placeholder="VD: 140"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Thời gian đào tạo (tháng) *
                                </label>
                                <input
                                    type="number"
                                    name="duration"
                                    value={formData.duration}
                                    onChange={handleInputChange}
                                    required
                                    min="1"
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    placeholder="VD: 48"
                                />
                            </div>
                        </div>

                        <div className="mt-6">
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Mô tả
                            </label>
                            <textarea
                                name="description"
                                value={formData.description}
                                onChange={handleInputChange}
                                rows={3}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                placeholder="Mô tả về chương trình đào tạo..."
                            />
                        </div>
                    </div>

                    {/* Knowledge Blocks */}
                    <div className="bg-white rounded-lg border border-gray-200 p-6">
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-xl font-semibold text-gray-900">Khối kiến thức</h2>
                            <button
                                type="button"
                                onClick={addKnowledgeBlock}
                                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
                            >
                                <Plus className="h-4 w-4" />
                                Thêm khối kiến thức
                            </button>
                        </div>

                        {selectedKnowledgeBlocks.length === 0 ? (
                            <div className="text-center py-8 text-gray-500">
                                <p>Chưa có khối kiến thức nào được chọn</p>
                                <p className="text-sm">Nhấn "Thêm khối kiến thức" để bắt đầu</p>
                            </div>
                        ) : (
                            <div className="space-y-4">
                                {selectedKnowledgeBlocks.map((kb, index) => (
                                    <div key={index} className="border border-gray-200 rounded-lg p-4">
                                        <div className="flex justify-between items-start mb-4">
                                            <div className="flex-1">
                                                <h3 className="font-medium text-gray-900">
                                                    {kb.knowledgeBlock?.name || 'Chọn khối kiến thức'}
                                                </h3>
                                                <p className="text-sm text-gray-600">
                                                    {kb.knowledgeBlock?.code || ''}
                                                </p>
                                            </div>
                                            <button
                                                type="button"
                                                onClick={() => removeKnowledgeBlock(index)}
                                                className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                            >
                                                <Trash2 className="h-4 w-4" />
                                            </button>
                                        </div>

                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                                    Khối kiến thức
                                                </label>
                                                <select
                                                    value={kb.knowledgeBlockId}
                                                    onChange={(e) => {
                                                        const selectedKB = knowledgeBlocks.find(k => k.id === e.target.value);
                                                        updateKnowledgeBlock(index, 'knowledgeBlockId', e.target.value);
                                                        updateKnowledgeBlock(index, 'knowledgeBlock', selectedKB);
                                                        updateKnowledgeBlock(index, 'requiredCredits', selectedKB?.minCredits || 0);
                                                    }}
                                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                                >
                                                    <option value="">Chọn khối kiến thức</option>
                                                    {knowledgeBlocks
                                                        .filter(k => !selectedKnowledgeBlocks.some(skb => skb.knowledgeBlockId === k.id && skb.knowledgeBlockId !== kb.knowledgeBlockId))
                                                        .map((knowledgeBlock) => (
                                                            <option key={knowledgeBlock.id} value={knowledgeBlock.id}>
                                                                {knowledgeBlock.name} ({knowledgeBlock.code})
                                                            </option>
                                                        ))}
                                                </select>
                                            </div>

                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                                    Số tín chỉ yêu cầu
                                                </label>
                                                <input
                                                    type="number"
                                                    value={kb.requiredCredits}
                                                    onChange={(e) => updateKnowledgeBlock(index, 'requiredCredits', e.target.value)}
                                                    min={kb.knowledgeBlock?.minCredits || 0}
                                                    max={kb.knowledgeBlock?.maxCredits || 999}
                                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                                />
                                                {kb.knowledgeBlock && (
                                                    <p className="text-xs text-gray-500 mt-1">
                                                        Từ {kb.knowledgeBlock.minCredits} đến {kb.knowledgeBlock.maxCredits} tín chỉ
                                                    </p>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Submit Button */}
                    <div className="flex justify-end gap-4">
                        <Link
                            href="/curricula"
                            className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                        >
                            Hủy
                        </Link>
                        <button
                            type="submit"
                            disabled={loading}
                            className="bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white px-6 py-2 rounded-lg transition-colors"
                        >
                            {loading ? 'Đang tạo...' : 'Tạo chương trình đào tạo'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

