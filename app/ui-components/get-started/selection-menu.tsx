'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ClockIcon, ListBulletIcon, FolderIcon } from '@heroicons/react/24/outline';
import type {
  SelectableExercise,
  SelectableProgram,
  SelectableCategory,
  SelectableExerciseType,
} from '@/app/ui/dashboard/get-started/page';

type Mode = 'exercise' | 'program';

interface Props {
  exercises: SelectableExercise[];
  programs: SelectableProgram[];
  exerciseTypes: SelectableExerciseType[];
  categories: SelectableCategory[];
}

export default function SelectionMenu({ exercises, programs, exerciseTypes, categories }: Props) {
  const [mode, setMode] = useState<Mode>('exercise');
  const [typeFilter, setTypeFilter] = useState('all');
  const [categoryFilter, setCategoryFilter] = useState('all');

  const filteredExercises = typeFilter === 'all'
    ? exercises
    : exercises.filter((e) => e.exerciseTypeId === typeFilter);

  const filteredPrograms = categoryFilter === 'all'
    ? programs
    : programs.filter((p) => p.categoryIds.includes(categoryFilter));

  return (
    <div className="space-y-5">
      {/* Mode toggle */}
      <div className="flex gap-2 p-1 bg-stone-100 rounded-xl w-fit">
        <button
          onClick={() => setMode('exercise')}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
            mode === 'exercise'
              ? 'bg-white text-sage-700 shadow-sm'
              : 'text-stone-500 hover:text-stone-700'
          }`}
        >
          <ListBulletIcon className="w-4 h-4" />
          Exercise
        </button>
        <button
          onClick={() => setMode('program')}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
            mode === 'program'
              ? 'bg-white text-sage-700 shadow-sm'
              : 'text-stone-500 hover:text-stone-700'
          }`}
        >
          <FolderIcon className="w-4 h-4" />
          Program
        </button>
      </div>

      {/* Filter row */}
      {mode === 'exercise' ? (
        <div className="flex items-center gap-3">
          <label htmlFor="type-filter" className="text-sm text-stone-500 whitespace-nowrap">
            Filter by type
          </label>
          <select
            id="type-filter"
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            className="text-sm border border-stone-200 rounded-lg px-3 py-1.5 bg-white text-stone-700 focus:outline-none focus:ring-2 focus:ring-sage-400"
          >
            <option value="all">All types</option>
            {exerciseTypes.map((t) => (
              <option key={t.id} value={t.id}>{t.name}</option>
            ))}
          </select>
        </div>
      ) : (
        <div className="flex items-center gap-3">
          <label htmlFor="category-filter" className="text-sm text-stone-500 whitespace-nowrap">
            Filter by category
          </label>
          <select
            id="category-filter"
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="text-sm border border-stone-200 rounded-lg px-3 py-1.5 bg-white text-stone-700 focus:outline-none focus:ring-2 focus:ring-sage-400"
          >
            <option value="all">All categories</option>
            {categories.map((c) => (
              <option key={c.id} value={c.id}>{c.name}</option>
            ))}
          </select>
        </div>
      )}

      {/* Item list */}
      {mode === 'exercise' ? (
        <div className="grid gap-3">
          {filteredExercises.length === 0 && (
            <p className="text-sm text-stone-400 py-6 text-center">No exercises found.</p>
          )}
          {filteredExercises.map((ex) => (
            <Link
              key={ex.id}
              href={`/ui/dashboard/get-started/execute?type=exercise&id=${ex.id}`}
              className="flex items-start justify-between gap-4 p-4 bg-white rounded-xl border border-stone-200 hover:border-sage-400 hover:shadow-sm transition-all"
            >
              <div className="flex-1 min-w-0">
                <p className="font-medium text-stone-800 text-sm">{ex.title}</p>
                <p className="text-xs text-stone-400 mt-0.5">{ex.exerciseTypeName}</p>
                {ex.description && (
                  <p className="text-xs text-stone-500 mt-1 line-clamp-2">{ex.description}</p>
                )}
              </div>
              <div className="flex-none flex flex-col items-end gap-1 text-xs text-stone-400">
                {ex.isTimed ? (
                  <span className="flex items-center gap-1">
                    <ClockIcon className="w-3.5 h-3.5" />
                    {ex.workTime}s work
                  </span>
                ) : (
                  <span>{ex.reps} reps</span>
                )}
                <span>{ex.sets} sets</span>
              </div>
            </Link>
          ))}
        </div>
      ) : (
        <div className="grid gap-3">
          {filteredPrograms.length === 0 && (
            <p className="text-sm text-stone-400 py-6 text-center">No programs found.</p>
          )}
          {filteredPrograms.map((prog) => (
            <Link
              key={prog.id}
              href={`/ui/dashboard/get-started/execute?type=program&id=${prog.id}`}
              className="flex items-start justify-between gap-4 p-4 bg-white rounded-xl border border-stone-200 hover:border-sage-400 hover:shadow-sm transition-all"
            >
              <div className="flex-1 min-w-0">
                <p className="font-medium text-stone-800 text-sm">{prog.name}</p>
                {prog.categoryNames.length > 0 && (
                  <div className="flex flex-wrap gap-1 mt-1">
                    {prog.categoryNames.map((name) => (
                      <span key={name} className="text-xs bg-sage-100 text-sage-700 px-2 py-0.5 rounded-full">
                        {name}
                      </span>
                    ))}
                  </div>
                )}
                {prog.description && (
                  <p className="text-xs text-stone-500 mt-1 line-clamp-2">{prog.description}</p>
                )}
              </div>
              <div className="flex-none text-xs text-stone-400">
                {prog.exerciseCount} exercise{prog.exerciseCount !== 1 ? 's' : ''}
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
