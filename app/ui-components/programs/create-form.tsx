'use client';

import { createProgram } from '@/app/lib/program/program-actions';
import { Button } from '@/app/ui-components/button';
import { Exercise } from '@/app/lib/exercise/exercise';

export default function CreateProgramForm({ exercises }: { exercises: { id: string; title: string; description: string; exerciseTypeName?: string }[] }) {
  return (
    <form action={createProgram}>
      <div className="rounded-md bg-gray-50 p-4 md:p-6">
        {/* Program Name */}
        <div className="mb-4">
          <label htmlFor="name" className="mb-2 block text-sm font-medium">
            Program Name
          </label>
          <div className="relative mt-2 rounded-md">
            <input
              id="name"
              name="name"
              type="text"
              placeholder="Enter program name"
              className="peer block w-full rounded-md border border-gray-200 py-2 pl-10 text-sm outline-2 placeholder:text-gray-500"
              required
            />
          </div>
        </div>

        {/* Description */}
        <div className="mb-4">
          <label htmlFor="description" className="mb-2 block text-sm font-medium">
            Description
          </label>
          <div className="relative mt-2 rounded-md">
            <textarea
              id="description"
              name="description"
              rows={3}
              placeholder="Enter program description"
              className="peer block w-full rounded-md border border-gray-200 py-2 pl-10 text-sm outline-2 placeholder:text-gray-500"
              required
            />
          </div>
        </div>

        {/* Exercise Selection */}
        <div className="mb-4">
          <label className="mb-2 block text-sm font-medium">
            Select Exercises
          </label>
          <div className="mt-2 max-h-60 overflow-y-auto rounded-md border border-gray-200 bg-white p-2">
            {exercises.length === 0 ? (
              <p className="text-sm text-gray-500">No exercises available. Create some exercises first.</p>
            ) : (
              exercises.map((exercise) => (
                <div key={exercise.id} className="flex items-start space-x-2 py-2 border-b border-gray-100 last:border-b-0">
                  <input
                    id={`exercise-${exercise.id}`}
                    name="exercises"
                    type="checkbox"
                    value={exercise.id}
                    className="h-4 w-4 cursor-pointer border-gray-300 bg-gray-100 text-gray-600 focus:ring-2 mt-0.5"
                  />
                  <label
                    htmlFor={`exercise-${exercise.id}`}
                    className="flex-1 cursor-pointer text-sm"
                  >
                    <div className="font-medium text-gray-900">{exercise.title}</div>
                    {exercise.exerciseTypeName && (
                      <div className="text-xs text-gray-500 mb-1">Type: {exercise.exerciseTypeName}</div>
                    )}
                    <div className="text-xs text-gray-600 line-clamp-2">{exercise.description}</div>
                  </label>
                </div>
              ))
            )}
          </div>
          <p className="mt-1 text-xs text-gray-500">
            Select at least one exercise for your program.
          </p>
        </div>
      </div>
      <div className="mt-6 flex justify-end gap-4">
        <Button type="submit">Create Program</Button>
      </div>
    </form>
  );
}
