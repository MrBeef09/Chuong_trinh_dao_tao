'use client';

import { notFound } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Printer } from 'lucide-react';
import { useEffect, useState } from 'react';
import CurriculumDisplay from '@/components/CurriculumDisplay';

interface CurriculumDisplayPageProps {
  params: {
    id: string;
  };
}

export default function CurriculumDisplayPage({ params }: CurriculumDisplayPageProps) {
  const [curriculum, setCurriculum] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCurriculum = async () => {
      try {
        const response = await fetch(`/api/curricula/${params.id}`);
        if (response.ok) {
          const data = await response.json();
          setCurriculum(data);
        } else {
          setError('Curriculum not found');
        }
      } catch (err) {
        setError('Failed to fetch curriculum');
      } finally {
        setLoading(false);
      }
    };

    fetchCurriculum();
  }, [params.id]);

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
      </div>
    );
  }

  if (error || !curriculum) {
    notFound();
  }

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="flex items-center gap-4 mb-8">
                    <Link
                        href={`/curricula/${curriculum.id}`}
                        className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
                    >
                        <ArrowLeft className="h-5 w-5" />
                    </Link>
                    <div className="flex-1">
                        <h1 className="text-3xl font-bold text-gray-900">Hiển thị chương trình đào tạo</h1>
                        <p className="text-gray-600 mt-2">
                            {curriculum.name} ({curriculum.code})
                        </p>
                    </div>
                    <div className="flex items-center gap-2">
                        <button
                            onClick={() => window.print()}
                            className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
                        >
                            <Printer className="h-4 w-4" />
                            In
                        </button>
                    </div>
                </div>

        {/* Print-only styles */}
        <style dangerouslySetInnerHTML={{
          __html: `
            @media print {
              .no-print {
                display: none !important;
              }
              body {
                font-size: 12px;
              }
              .print-break {
                page-break-before: always;
              }
            }
          `
        }} />

                {/* Curriculum Display Content */}
                <CurriculumDisplay curriculum={curriculum} showPDFButton={false} />
            </div>
        </div>
    );
}
