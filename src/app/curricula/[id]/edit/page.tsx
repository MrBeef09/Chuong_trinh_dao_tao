import { notFound, redirect } from 'next/navigation';
import Link from 'next/link';
import { prisma } from '@/lib/prisma';
import { ArrowLeft, Save } from 'lucide-react';
import CurriculumEditForm from '@/components/CurriculumEditForm';

interface CurriculumEditPageProps {
    params: {
        id: string;
    };
}

export default async function CurriculumEditPage({ params }: CurriculumEditPageProps) {
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
                    knowledgeBlock: true
                },
                orderBy: {
                    order: 'asc'
                }
            }
        }
    });

    if (!curriculum) {
        notFound();
    }

    const majors = await prisma.major.findMany({
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
        },
        orderBy: {
            name: 'asc'
        }
    });

    const knowledgeBlocks = await prisma.knowledgeBlock.findMany({
        orderBy: {
            order: 'asc'
        }
    });

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="max-w-4xl mx-auto">
                <div className="flex items-center gap-4 mb-8">
                    <Link
                        href={`/curricula/${curriculum.id}`}
                        className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
                    >
                        <ArrowLeft className="h-5 w-5" />
                    </Link>
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900">Chỉnh sửa chương trình đào tạo</h1>
                        <p className="text-gray-600 mt-2">
                            Cập nhật thông tin cho chương trình đào tạo: {curriculum.name}
                        </p>
                    </div>
                </div>

                <CurriculumEditForm
                    curriculum={curriculum}
                    majors={majors}
                    knowledgeBlocks={knowledgeBlocks}
                />
            </div>
        </div>
    );
}

