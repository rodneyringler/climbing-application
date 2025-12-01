// This file contains type definitions for your data.
// It describes the shape of the data, and what data type each property should accept.
// For simplicity of teaching, we're manually defining these types.
// However, these types are generated automatically if you're using an ORM such as Prisma.
export type User = {
  id: string;
  name: string;
  email: string;
  password: string;
};

export type ExerciseTypeItem = {
  id: string;
  name: string;
  description: string;
};

export type ExerciseItem = {
  id: string;
  title: string;
  user: string;
  exerciseType: string;
  isTimed: boolean;
  reps: number;
  sets: number;
  restTime: number;
  workTime: number;
  isPublic: boolean;
  description: string;
};

export type ExerciseForm = {
  id: string;
  title: string;
  user: string;
  exerciseType: string;
  isTimed: boolean;
  reps: number;
  sets: number;
  restTime: number;
  workTime: number;
  isPublic: boolean;
  description: string;
  userName?: string;
};

export type ExercisesTable = {
  id: string;
  title: string;
  user: string;
  exerciseType: string;
  isTimed: boolean;
  reps: number;
  sets: number;
  restTime: number;
  workTime: number;
  isPublic: boolean;
  description: string;
  exerciseTypeName?: string;
};

export type ExerciseTypeForm = {
  id: string;
  name: string;
  description: string;
};

export type ExerciseTypesTable = {
  id: string;
  name: string;
  description: string;
};

export type ProgramItem = {
  id: string;
  user: string;
  exercise: string;
  name: string;
  description: string;
};

export type ProgramExercise = {
  id: string;
  title: string;
  exerciseType: string;
  exerciseTypeName?: string;
  isTimed: boolean;
  reps: number;
  sets: number;
  restTime: number;
  workTime: number;
  isPublic: boolean;
  description: string;
};

export type ProgramForm = {
  name: string;
  description: string;
  exercises: string[];
  userName?: string;
};

export type ProgramsTable = {
  name: string;
  description: string;
  user: string;
  userName?: string;
  exerciseCount: number;
  exercises: ProgramExercise[];
};

export type WorkoutItem = {
  id: string;
  user: string;
  program: string;
  name: string;
  started: string | null;
  ended: string | null;
};

export type WorkoutForm = {
  id: string;
  user: string;
  program: string;
  name: string;
  started: string | null;
  ended: string | null;
  userName?: string;
  programName?: string;
};

export type WorkoutsTable = {
  id: string;
  user: string;
  program: string;
  name: string;
  started: string | null;
  ended: string | null;
  userName?: string;
  programName?: string;
};

export type LogbookItem = {
  id: string;
  user: string;
  program: string;
  workout: string;
  name: string;
  date: string;
  location?: string | null;
  notes?: string | null;
  isPublic: boolean;
}

export type LogbookForm = {
  id: string;
  user: string;
  program: string;
  workout: string;
  name: string;
  date: string;
  location?: string | null;
  notes?: string | null;
  userName?: string;
  isPublic: boolean;
}

export type LogbookTable = {
  id: string;
  user: string;
  program: string;
  workout: string;
  name: string;
  date: string;
  location?: string | null;
  notes?: string | null;
  userName?: string;
  isPublic: boolean;
}