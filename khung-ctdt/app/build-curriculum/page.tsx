// File: app/build-curriculum/page.tsx
// Next.js (App Router) page component written in TypeScript + React using Tailwind CSS

'use client'

import React, { useEffect, useMemo, useState } from 'react'
import { useRouter } from 'next/navigation'

// ---------- Mock data ----------
type KnowledgeBlock = {
  id: string
  name: string
}

type Subject = {
  id: string
  name: string
  credits: number
}

const PROGRAMS = [
  { id: 'it', name: 'Information Technology' },
  { id: 'biz', name: 'Business Administration' },
]

const COHORTS = [
  { id: 'k17', name: 'K17 (2023–2027)' },
  { id: 'k16', name: 'K16 (2022–2026)' },
]

const BLOCKS: KnowledgeBlock[] = [
  { id: 'core', name: 'Core Knowledge' },
  { id: 'gen', name: 'General Knowledge' },
  { id: 'major', name: 'Major Knowledge' },
]

const SUBJECTS_BY_BLOCK: Record<string, Subject[]> = {
  core: [
    { id: 's1', name: 'Data Structures & Algorithms', credits: 3 },
    { id: 's2', name: 'Database Systems', credits: 3 },
    { id: 's3', name: 'Operating Systems', credits: 3 },
    { id: 's4', name: 'Object-Oriented Programming', credits: 3 },
  ],
  gen: [
    { id: 'g1', name: 'English for IT', credits: 2 },
    { id: 'g2', name: 'Mathematics for Computing', credits: 3 },
  ],
  major: [
    { id: 'm1', name: 'Machine Learning', credits: 3 },
    { id: 'm2', name: 'Software Engineering', credits: 3 },
  ],
}

// ---------- Main Page ----------
export default function BuildCurriculumPage() {
  const router = useRouter();
  const [program, setProgram] = useState<string>(PROGRAMS[0].id)
  const [cohort, setCohort] = useState<string>(COHORTS[0].id)
  const [block, setBlock] = useState<string>(BLOCKS[0].id)
  const [selectedSubjects, setSelectedSubjects] = useState<Record<string, boolean>>({})
  const [subjectType, setSubjectType] = useState<Record<string, 'required' | 'elective'>>({})
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    // Reset selections when block changes
    const list = SUBJECTS_BY_BLOCK[block] || []
    const initialSel: Record<string, boolean> = {}
    const initialType: Record<string, 'required' | 'elective'> = {}
    list.forEach((s) => {
      initialSel[s.id] = true
      initialType[s.id] = 'required'
    })

    setSelectedSubjects(initialSel)
    setSubjectType(initialType)
  }, [block])

  const subjects = SUBJECTS_BY_BLOCK[block] || []

  const totalCredits = useMemo(() => {
    return subjects.reduce((acc, s) => (selectedSubjects[s.id] ? acc + s.credits : acc), 0)
  }, [subjects, selectedSubjects])

  function toggleSubject(id: string) {
    setSelectedSubjects((prev) => ({ ...prev, [id]: !prev[id] }))
  }

  function changeType(id: string, t: 'required' | 'elective') {
    setSubjectType((prev) => ({ ...prev, [id]: t }))
  }

  async function handleSave() {
    setLoading(true)
    try {
      const body = {
        program: program,
        cohort: cohort,
        block: block,
        subjects: subjects.filter(s => selectedSubjects[s.id]).map(s => ({ ...s, type: subjectType[s.id] })),
        totalCredits,
      };
      
      // ✅ Sửa URL từ /api/123/khung-ctdt sang /api/khung-ctdt
      const res = await fetch("/api/khung-ctdt", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      
      const data = await res.json();
      
      if (res.ok) {
        alert("✅ " + (data.message || "success!"));
      } else {
        alert("❌ " + (data.error || "failed!"));
      }
    } catch (error) {
      console.error("Error:", error);
      alert("❌ error!");
    } finally {
      setLoading(false)
    }
  }

  function handleView() {
  router.push('/view-curriculum')
}

  return (
    <div className="min-h-screen flex items-start justify-center bg-slate-50 p-6">
      <div className="w-full max-w-md bg-white shadow-md rounded-lg overflow-hidden">
        <div className="bg-blue-800 text-white py-4 px-6">
          <h1 className="text-xl font-semibold">Build Curriculum Framework</h1>
        </div>

        <div className="p-6 space-y-4">
          {/* Select program */}
          <div>
            <label className="block text-sm font-medium text-slate-700">Select Program</label>
            <select
              value={program}
              onChange={(e) => setProgram(e.target.value)}
              className="mt-2 block w-full border rounded-md p-2"
            >
              {PROGRAMS.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name}
                </option>
              ))}
            </select>
          </div>

          {/* Select cohort */}
          <div>
            <label className="block text-sm font-medium text-slate-700">Select Cohort</label>
            <select
              value={cohort}
              onChange={(e) => setCohort(e.target.value)}
              className="mt-2 block w-full border rounded-md p-2"
            >
              {COHORTS.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>

          {/* Knowledge block */}
          <div>
            <label className="block text-sm font-medium text-slate-700">Knowledge Block</label>
            <div className="flex items-center gap-3 mt-2">
              <div className="flex-1">
                <select value={block} onChange={(e) => setBlock(e.target.value)} className="block w-full border rounded-md p-2">
                  {BLOCKS.map((b) => (
                    <option key={b.id} value={b.id}>
                      {b.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Subject list */}
          <div>
            <label className="block text-sm font-medium text-slate-700">Subject List</label>

            <div className="mt-2 border rounded-md p-3 bg-white">
              {subjects.map((s) => (
                <div key={s.id} className="flex items-center justify-between py-2 border-b last:border-b-0">
                  <div className="flex items-start gap-3">
                    <input type="checkbox" checked={!!selectedSubjects[s.id]} onChange={() => toggleSubject(s.id)} className="mt-1" />
                    <div>
                      <div className="font-medium">{s.name}</div>
                      <div className="text-xs text-slate-500">({s.credits} credits)</div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <select value={subjectType[s.id] ?? 'required'} onChange={(e) => changeType(s.id, e.target.value as any)} className="border rounded-md p-1 text-sm">
                      <option value="required">Required</option>
                      <option value="elective">Elective</option>
                    </select>
                  </div>
                </div>
              ))}

              {/* total */}
              <div className="pt-3">
                <div className="text-sm font-medium">Total Credits: <span className="font-semibold">{totalCredits}</span></div>
              </div>

              {/* actions */}
              <div className="mt-4 flex gap-3">
                <button 
                  disabled={loading}
                  className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white py-2 rounded-md font-medium transition"
                  onClick={handleSave}
                >
                  {loading ? 'Saving...' : 'Save Changes'}
                </button>
                <button onClick={handleView} className="flex-1 border border-slate-300 py-2 rounded-md hover:bg-slate-50 transition">View Curriculum</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}