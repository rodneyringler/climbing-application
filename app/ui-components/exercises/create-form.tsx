'use client';

import { createExercise } from '@/app/lib/exercise/exercise-actions';
import { Button } from '@/app/ui-components/button';
import { ExerciseType } from '@/app/lib/exercise/exerciseType';

export default function CreateExerciseForm({ exerciseTypes }: { exerciseTypes: { id: string; name: string }[] }) {
  return (
    <form action={createExercise}>
      <div className="rounded-md bg-gray-50 p-4 md:p-6">
        {/* Exercise Title */}
        <div className="mb-4">
          <label htmlFor="title" className="mb-2 block text-sm font-medium">
            Exercise Title
          </label>
          <div className="relative mt-2 rounded-md">
            <input
              id="title"
              name="title"
              type="text"
              placeholder="Enter exercise title"
              className="peer block w-full rounded-md border border-gray-200 py-2 pl-10 text-sm outline-2 placeholder:text-gray-500"
              required
            />
          </div>
        </div>

        {/* Exercise Type */}
        <div className="mb-4">
          <label htmlFor="exerciseType" className="mb-2 block text-sm font-medium">
            Exercise Type
          </label>
          <div className="relative">
            <select
              id="exerciseType"
              name="exerciseType"
              className="peer block w-full cursor-pointer rounded-md border border-gray-200 py-2 pl-10 text-sm outline-2 placeholder:text-gray-500"
              defaultValue=""
              required
            >
              <option value="" disabled>
                Select an exercise type
              </option>
              {exerciseTypes.map((type) => (
                <option key={type.id} value={type.id}>
                  {type.name}
                </option>
              ))}
            </select>
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
              placeholder="Enter exercise description"
              className="peer block w-full rounded-md border border-gray-200 py-2 pl-10 text-sm outline-2 placeholder:text-gray-500"
              required
            />
          </div>
        </div>

        {/* Reps and Sets */}
        <div className="mb-4 grid grid-cols-1 gap-4 md:grid-cols-2">
          <div>
            <label htmlFor="reps" className="mb-2 block text-sm font-medium">
              Reps
            </label>
            <div className="relative mt-2 rounded-md">
              <input
                id="reps"
                name="reps"
                type="number"
                min="0"
                placeholder="0"
                className="peer block w-full rounded-md border border-gray-200 py-2 pl-10 text-sm outline-2 placeholder:text-gray-500"
                required
              />
            </div>
          </div>
          <div>
            <label htmlFor="sets" className="mb-2 block text-sm font-medium">
              Sets
            </label>
            <div className="relative mt-2 rounded-md">
              <input
                id="sets"
                name="sets"
                type="number"
                min="0"
                placeholder="0"
                className="peer block w-full rounded-md border border-gray-200 py-2 pl-10 text-sm outline-2 placeholder:text-gray-500"
                required
              />
            </div>
          </div>
        </div>

        {/* Rest Time and Work Time */}
        <div className="mb-4 grid grid-cols-1 gap-4 md:grid-cols-2">
          <div>
            <label htmlFor="restTime" className="mb-2 block text-sm font-medium">
              Rest Time (seconds)
            </label>
            <div className="relative mt-2 rounded-md">
              <input
                id="restTime"
                name="restTime"
                type="number"
                min="0"
                placeholder="0"
                className="peer block w-full rounded-md border border-gray-200 py-2 pl-10 text-sm outline-2 placeholder:text-gray-500"
                required
              />
            </div>
          </div>
          <div>
            <label htmlFor="workTime" className="mb-2 block text-sm font-medium">
              Work Time (seconds)
            </label>
            <div className="relative mt-2 rounded-md">
              <input
                id="workTime"
                name="workTime"
                type="number"
                min="0"
                placeholder="0"
                className="peer block w-full rounded-md border border-gray-200 py-2 pl-10 text-sm outline-2 placeholder:text-gray-500"
                required
              />
            </div>
          </div>
        </div>

        {/* Checkboxes */}
        <div className="mb-4 grid grid-cols-1 gap-4 md:grid-cols-2">
          <div className="flex items-center">
            <input
              id="isTimed"
              name="isTimed"
              type="checkbox"
              value="on"
              className="h-4 w-4 cursor-pointer border-gray-300 bg-gray-100 text-gray-600 focus:ring-2"
            />
            <label htmlFor="isTimed" className="ml-2 flex cursor-pointer items-center gap-1.5 rounded-full bg-gray-100 px-3 py-1.5 text-xs font-medium text-gray-600">
              Is Timed Exercise
            </label>
          </div>
          <div className="flex items-center">
            <input
              id="isPublic"
              name="isPublic"
              type="checkbox"
              value="on"
              className="h-4 w-4 cursor-pointer border-gray-300 bg-gray-100 text-gray-600 focus:ring-2"
            />
            <label htmlFor="isPublic" className="ml-2 flex cursor-pointer items-center gap-1.5 rounded-full bg-gray-100 px-3 py-1.5 text-xs font-medium text-gray-600">
              Public Exercise
            </label>
          </div>
        </div>
      </div>
      <div className="mt-6 flex justify-end gap-4">
        <Button type="submit">Create Exercise</Button>
      </div>
    </form>
  );
}
