'use client';

import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  ArrowLeftIcon,
  PauseIcon,
  PlayIcon,
  ForwardIcon,
  CheckIcon,
} from '@heroicons/react/24/solid';
import { saveExecutionWorkout } from '@/app/lib/workout/workout-actions';
import type { ExecutorExercise, ExecutorProgram } from '@/app/ui/dashboard/get-started/execute/page';

// ─── Types ────────────────────────────────────────────────────────────────────

type Phase = 'ready' | 'exercising' | 'resting' | 'between' | 'complete';

type Props =
  | { mode: 'exercise'; exercise: ExecutorExercise; program?: never }
  | { mode: 'program'; program: ExecutorProgram; exercise?: never };

// ─── Helpers ─────────────────────────────────────────────────────────────────

function pad(n: number) {
  return String(n).padStart(2, '0');
}

function formatSeconds(s: number) {
  const mins = Math.floor(s / 60);
  const secs = s % 60;
  return `${pad(mins)}:${pad(secs)}`;
}

// ─── Sub-components ───────────────────────────────────────────────────────────

function ProgressBar({ value }: { value: number }) {
  return (
    <div className="w-full h-2 bg-stone-200 rounded-full overflow-hidden">
      <div
        className="h-full bg-sage-500 rounded-full transition-all duration-500"
        style={{ width: `${Math.min(100, Math.round(value * 100))}%` }}
      />
    </div>
  );
}

function BigDisplay({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex items-center justify-center w-44 h-44 rounded-full border-4 border-sage-400 bg-white shadow-inner">
      <span className="text-4xl font-bold text-stone-800 tabular-nums">{children}</span>
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────

export default function WorkoutExecutor({ mode, exercise, program }: Props) {
  const router = useRouter();

  // Normalise to a flat list of exercises regardless of mode
  const exercises: ExecutorExercise[] = mode === 'program'
    ? program.exercises
    : [exercise];

  const totalSets = exercises.reduce((s, e) => s + e.sets, 0);

  const [exerciseIdx, setExerciseIdx] = useState(0);
  const [setIdx, setSetIdx] = useState(0);          // 0-based
  const [phase, setPhase] = useState<Phase>('ready');
  const [secondsLeft, setSecondsLeft] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);

  // Track when the workout began for auto-save
  const startedAtRef = useRef<string | null>(null);

  const current = exercises[exerciseIdx];

  // Completed sets across all previous exercises + current setIdx
  const completedSets =
    exercises.slice(0, exerciseIdx).reduce((s, e) => s + e.sets, 0) + setIdx;
  const progress = totalSets > 0 ? completedSets / totalSets : 0;

  // ── Timer ────────────────────────────────────────────────────────────────
  useEffect(() => {
    if (phase !== 'exercising' && phase !== 'resting') return;
    if (!current.isTimed && phase === 'exercising') return; // reps-based, no tick
    if (isPaused) return;

    const interval = setInterval(() => {
      setSecondsLeft((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          if (phase === 'exercising') {
            // Work period done — start rest if there is one
            if (current.restTime > 0) {
              setPhase('resting');
              return current.restTime;
            }
            advanceSet();
            return 0;
          } else {
            // Rest done
            advanceSet();
            return 0;
          }
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [phase, isPaused, exerciseIdx, setIdx]); // eslint-disable-line react-hooks/exhaustive-deps

  // ── State transitions ────────────────────────────────────────────────────

  function beginExercise() {
    if (!startedAtRef.current) {
      startedAtRef.current = new Date().toISOString();
    }
    setPhase('exercising');
    setIsPaused(false);
    setSecondsLeft(current.isTimed ? current.workTime : 0);
  }

  function completeSet() {
    // Called when user taps "Complete Set" on a reps-based exercise
    if (current.restTime > 0) {
      setPhase('resting');
      setSecondsLeft(current.restTime);
    } else {
      advanceSet();
    }
  }

  function advanceSet() {
    const isLastSet = setIdx >= current.sets - 1;

    if (!isLastSet) {
      // More sets remain for this exercise
      setSetIdx((i) => i + 1);
      setPhase('exercising');
      setSecondsLeft(current.isTimed ? current.workTime : 0);
      setIsPaused(false);
    } else {
      // All sets done — check if more exercises remain
      const isLastExercise = exerciseIdx >= exercises.length - 1;
      if (isLastExercise) {
        setPhase('complete');
      } else if (mode === 'program') {
        setPhase('between');
      } else {
        setPhase('complete');
      }
    }
  }

  function skipRest() {
    advanceSet();
  }

  function skipExercise() {
    const isLastExercise = exerciseIdx >= exercises.length - 1;
    if (isLastExercise) {
      setPhase('complete');
    } else {
      setExerciseIdx((i) => i + 1);
      setSetIdx(0);
      setPhase('ready');
      setIsPaused(false);
    }
  }

  function nextExercise() {
    setExerciseIdx((i) => i + 1);
    setSetIdx(0);
    setPhase('ready');
    setIsPaused(false);
  }

  async function handleSave() {
    if (mode !== 'program') return;
    setSaving(true);
    setSaveError(null);
    const result = await saveExecutionWorkout(
      program.id,
      program.name,
      startedAtRef.current ?? new Date().toISOString(),
      new Date().toISOString(),
    );
    setSaving(false);
    if (result.success) {
      router.push('/ui/dashboard/workouts');
    } else {
      setSaveError(result.error ?? 'Unknown error');
    }
  }

  // ── Render ───────────────────────────────────────────────────────────────

  return (
    <div className="max-w-md mx-auto flex flex-col gap-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <button
          onClick={() => router.back()}
          className="p-2 rounded-lg hover:bg-stone-100 transition-colors"
          aria-label="Go back"
        >
          <ArrowLeftIcon className="w-4 h-4 text-stone-500" />
        </button>
        <div className="flex-1 min-w-0">
          <p className="text-xs text-stone-400 uppercase tracking-wide font-medium">
            {mode === 'program' ? program.name : 'Exercise'}
          </p>
          <h1 className="text-base font-semibold text-stone-800 truncate">{current.title}</h1>
        </div>
      </div>

      {/* Progress */}
      <div className="space-y-1">
        <ProgressBar value={progress} />
        <div className="flex justify-between text-xs text-stone-400">
          <span>
            {mode === 'program'
              ? `Exercise ${exerciseIdx + 1} of ${exercises.length}`
              : current.exerciseTypeName}
          </span>
          <span>{Math.round(progress * 100)}% complete</span>
        </div>
      </div>

      {/* Main card */}
      <div className="bg-white rounded-2xl border border-stone-200 shadow-sm p-6 flex flex-col items-center gap-6">

        {phase === 'ready' && (
          <>
            <div className="text-center space-y-1">
              <p className="text-sm text-stone-500">{current.exerciseTypeName}</p>
              <p className="text-sm font-medium text-stone-700">
                Set {setIdx + 1} of {current.sets}
              </p>
              {current.isTimed
                ? <p className="text-xs text-stone-400">{current.workTime}s work · {current.restTime}s rest</p>
                : <p className="text-xs text-stone-400">{current.reps} reps · {current.restTime}s rest</p>
              }
            </div>
            {current.description && (
              <p className="text-sm text-stone-600 text-center leading-relaxed">{current.description}</p>
            )}
            <button
              onClick={beginExercise}
              className="flex items-center gap-2 bg-sage-500 hover:bg-sage-600 text-white font-semibold px-8 py-3 rounded-full transition-colors"
            >
              <PlayIcon className="w-4 h-4" />
              {setIdx === 0 ? 'Begin' : 'Continue'}
            </button>
          </>
        )}

        {phase === 'exercising' && (
          <>
            <p className="text-xs font-semibold text-stone-400 uppercase tracking-wide">
              Set {setIdx + 1} of {current.sets}
            </p>

            <BigDisplay>
              {current.isTimed ? formatSeconds(secondsLeft) : `×${current.reps}`}
            </BigDisplay>

            <div className="flex items-center gap-3">
              {current.isTimed ? (
                <button
                  onClick={() => setIsPaused((p) => !p)}
                  className="flex items-center gap-2 bg-stone-100 hover:bg-stone-200 text-stone-700 font-medium px-6 py-2.5 rounded-full transition-colors text-sm"
                >
                  {isPaused
                    ? <><PlayIcon className="w-4 h-4" /> Resume</>
                    : <><PauseIcon className="w-4 h-4" /> Pause</>
                  }
                </button>
              ) : (
                <button
                  onClick={completeSet}
                  className="flex items-center gap-2 bg-sage-500 hover:bg-sage-600 text-white font-semibold px-6 py-2.5 rounded-full transition-colors text-sm"
                >
                  <CheckIcon className="w-4 h-4" /> Complete Set
                </button>
              )}
            </div>

            <button
              onClick={skipExercise}
              className="text-xs text-stone-400 hover:text-stone-600 underline underline-offset-2 transition-colors"
            >
              Skip exercise
            </button>
          </>
        )}

        {phase === 'resting' && (
          <>
            <p className="text-xs font-semibold text-stone-400 uppercase tracking-wide">Rest</p>
            <BigDisplay>{formatSeconds(secondsLeft)}</BigDisplay>
            <button
              onClick={skipRest}
              className="flex items-center gap-2 text-sm text-stone-500 hover:text-stone-700 font-medium px-5 py-2 rounded-full border border-stone-200 hover:border-stone-300 transition-colors"
            >
              <ForwardIcon className="w-4 h-4" /> Skip Rest
            </button>
          </>
        )}

        {phase === 'between' && (
          <>
            <p className="text-xs font-semibold text-sage-600 uppercase tracking-wide">
              Exercise Complete
            </p>
            <CheckIcon className="w-12 h-12 text-sage-500" />
            <div className="text-center space-y-1">
              <p className="text-sm text-stone-500">Up next</p>
              <p className="font-semibold text-stone-800">{exercises[exerciseIdx + 1]?.title}</p>
            </div>
            <button
              onClick={nextExercise}
              className="flex items-center gap-2 bg-sage-500 hover:bg-sage-600 text-white font-semibold px-8 py-3 rounded-full transition-colors"
            >
              <PlayIcon className="w-4 h-4" /> Next Exercise
            </button>
          </>
        )}

        {phase === 'complete' && (
          <>
            <p className="text-xs font-semibold text-sage-600 uppercase tracking-wide">
              {mode === 'program' ? 'Program Complete' : 'Exercise Complete'}
            </p>
            <CheckIcon className="w-16 h-16 text-sage-500" />
            <p className="text-stone-600 text-sm text-center">
              {mode === 'program'
                ? 'Great work! Save this session to your workout history?'
                : 'Great work! Run a full program to track your sessions.'}
            </p>

            {saveError && (
              <p className="text-xs text-red-500">{saveError}</p>
            )}

            <div className="flex gap-3">
              {mode === 'program' && (
                <button
                  onClick={handleSave}
                  disabled={saving}
                  className="flex items-center gap-2 bg-sage-500 hover:bg-sage-600 disabled:opacity-60 text-white font-semibold px-6 py-2.5 rounded-full transition-colors text-sm"
                >
                  {saving ? 'Saving…' : 'Save Workout'}
                </button>
              )}
              <button
                onClick={() => router.push('/ui/dashboard/get-started')}
                className="px-6 py-2.5 rounded-full border border-stone-200 hover:border-stone-300 text-stone-600 hover:text-stone-800 font-medium text-sm transition-colors"
              >
                {mode === 'program' ? 'Skip' : 'Done'}
              </button>
            </div>
          </>
        )}
      </div>

      {/* Set indicators (dots) */}
      {phase !== 'complete' && (
        <div className="flex justify-center gap-2">
          {Array.from({ length: current.sets }).map((_, i) => (
            <div
              key={i}
              className={`w-2 h-2 rounded-full transition-colors ${
                i < setIdx
                  ? 'bg-sage-500'
                  : i === setIdx
                  ? 'bg-sage-300'
                  : 'bg-stone-200'
              }`}
            />
          ))}
        </div>
      )}
    </div>
  );
}
