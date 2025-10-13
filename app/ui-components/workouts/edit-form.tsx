'use client';

import { updateWorkout } from '@/app/lib/workout/workout-actions';
import { Button } from '@/app/ui-components/button';
import { WorkoutForm } from '@/app/lib/definitions';
import { useState } from 'react';

export default function EditWorkoutForm({ 
  workout, 
  programs 
}: { 
  workout: WorkoutForm;
  programs: { name: string; description: string }[];
}) {
  const updateWorkoutWithId = updateWorkout.bind(null, workout.id);
  
  // Format datetime for input fields
  const formatDateTimeForInput = (dateTime: string | null) => {
    if (!dateTime) return '';
    const date = new Date(dateTime);
    return date.toISOString().slice(0, 16); // Format as YYYY-MM-DDTHH:MM
  };
  
  const [workoutName, setWorkoutName] = useState(workout.name);
  const [startedTime, setStartedTime] = useState(formatDateTimeForInput(workout.started));
  const [endedTime, setEndedTime] = useState(formatDateTimeForInput(workout.ended));

  // Validation function to check if ended time is after started time
  const validateEndedTime = (started: string, ended: string) => {
    if (!started || !ended) return true; // Allow empty values
    return new Date(ended) > new Date(started);
  };

  const handleStartedTimeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newStartedTime = e.target.value;
    setStartedTime(newStartedTime);
    
    // If ended time is set and is before the new started time, clear it
    if (endedTime && !validateEndedTime(newStartedTime, endedTime)) {
      setEndedTime('');
    }
  };

  const handleEndedTimeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newEndedTime = e.target.value;
    if (validateEndedTime(startedTime, newEndedTime)) {
      setEndedTime(newEndedTime);
    }
    // If validation fails, don't update the state (keep the old value)
  };

  return (
    <form action={updateWorkoutWithId}>
      <div className="rounded-md bg-gray-50 p-4 md:p-6">
        {/* Workout Name */}
        <div className="mb-4">
          <label htmlFor="name" className="mb-2 block text-sm font-medium">
            Workout Name
          </label>
          <div className="relative mt-2 rounded-md">
            <input
              id="name"
              name="name"
              type="text"
              value={workoutName}
              onChange={(e) => setWorkoutName(e.target.value)}
              className="peer block w-full rounded-md border border-gray-200 py-2 pl-10 text-sm outline-2 placeholder:text-gray-500"
              required
            />
          </div>
        </div>

        {/* User */}
        <div className="mb-4">
          <label htmlFor="user" className="mb-2 block text-sm font-medium">
            User
          </label>
          <div className="relative mt-2 rounded-md">
            <input
              id="user"
              name="user"
              type="text"
              defaultValue={workout.userName || workout.user}
              className="peer block w-full rounded-md border border-gray-200 py-2 pl-10 text-sm outline-2 placeholder:text-gray-500 bg-gray-100"
              readOnly
            />
            {/* Hidden field to preserve the actual user ID for form submission */}
            <input
              type="hidden"
              name="userId"
              value={workout.user}
            />
          </div>
        </div>

        {/* Program Selection */}
        <div className="mb-4">
          <label htmlFor="program" className="mb-2 block text-sm font-medium">
            Program
          </label>
          <div className="relative">
            <select
              id="program"
              name="program"
              className="peer block w-full cursor-pointer rounded-md border border-gray-200 py-2 pl-10 text-sm outline-2 placeholder:text-gray-500"
              defaultValue={workout.program}
              required
            >
              <option value="" disabled>
                Select a program
              </option>
              {programs.map((program) => (
                <option key={program.name} value={program.name}>
                  {program.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Started Time */}
        <div className="mb-4">
          <label htmlFor="started" className="mb-2 block text-sm font-medium">
            Started
          </label>
          <div className="relative mt-2 rounded-md">
            <input
              id="started"
              name="started"
              type="datetime-local"
              value={startedTime}
              onChange={handleStartedTimeChange}
              className="peer block w-full rounded-md border border-gray-200 py-2 pl-10 text-sm outline-2 placeholder:text-gray-500"
            />
          </div>
        </div>

        {/* Ended Time */}
        <div className="mb-4">
          <label htmlFor="ended" className="mb-2 block text-sm font-medium">
            Ended
          </label>
          <div className="relative mt-2 rounded-md">
            <input
              id="ended"
              name="ended"
              type="datetime-local"
              value={endedTime}
              onChange={handleEndedTimeChange}
              min={startedTime || undefined}
              className="peer block w-full rounded-md border border-gray-200 py-2 pl-10 text-sm outline-2 placeholder:text-gray-500"
            />
            {endedTime && !validateEndedTime(startedTime, endedTime) && (
              <p className="mt-1 text-sm text-red-600">
                Ended time must be after started time
              </p>
            )}
          </div>
        </div>
      </div>
      <div className="mt-6 flex justify-end gap-4">
        <Button type="submit">Update Workout</Button>
      </div>
    </form>
  );
}
