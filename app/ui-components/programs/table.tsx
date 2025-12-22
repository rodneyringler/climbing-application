'use client';

import React, { useState } from 'react';
import { UpdateProgram, DeleteProgram } from '@/app/ui-components/programs/buttons';
import type { ProgramsTable } from '@/app/lib/definitions';
import { ChevronDownIcon, ChevronRightIcon } from '@heroicons/react/24/outline';

export default function ProgramsTable({
  programs,
}: {
  programs: ProgramsTable[];
}) {
  const [expandedRows, setExpandedRows] = useState<Set<string>>(new Set());

  const toggleRow = (programName: string) => {
    const newExpanded = new Set(expandedRows);
    if (newExpanded.has(programName)) {
      newExpanded.delete(programName);
    } else {
      newExpanded.add(programName);
    }
    setExpandedRows(newExpanded);
  };

  return (
    <div className="mt-6 flow-root">
      <div className="inline-block min-w-full align-middle">
        <div className="rounded-lg bg-stone-100 p-2 md:pt-0">
          <div className="md:hidden">
            {programs?.map((program) => (
              <div
                key={program.id}
                className="mb-2 w-full rounded-md bg-white p-4"
              >
                <div className="flex items-center justify-between border-b pb-4">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => toggleRow(program.name)}
                      className="text-gray-500 hover:text-gray-700"
                    >
                      {expandedRows.has(program.name) ? (
                        <ChevronDownIcon className="h-4 w-4" />
                      ) : (
                        <ChevronRightIcon className="h-4 w-4" />
                      )}
                    </button>
                    <div>
                      <div className="mb-2 flex items-center">
                        <p className="text-sm font-medium">{program.name}</p>
                      </div>
                      <p className="text-sm text-gray-500">{program.description}</p>
                      <p className="text-sm text-gray-500">
                        {program.exerciseCount} exercises
                      </p>
                      <p className="text-sm text-gray-500">
                        Creator: {program.userName || program.user}
                      </p>
                    </div>
                  </div>
                </div>
                
                {expandedRows.has(program.name) && (
                  <div className="mt-4 space-y-2">
                    <h4 className="text-sm font-medium text-gray-700">Exercises:</h4>
                    {program.exercises.map((exercise) => (
                      <div key={exercise.id} className="rounded bg-gray-100 p-2">
                        <p className="text-sm font-medium">{exercise.title}</p>
                        <p className="text-xs text-gray-500">
                          {exercise.exerciseTypeName || exercise.exerciseType}
                        </p>
                        <p className="text-xs text-gray-500">
                          {exercise.sets} sets × {exercise.reps} reps
                        </p>
                      </div>
                    ))}
                  </div>
                )}

                <div className="flex w-full items-center justify-end gap-2 pt-4">
                  <UpdateProgram name={program.name} />
                  <DeleteProgram name={program.name} />
                </div>
              </div>
            ))}
          </div>
          <table className="hidden min-w-full text-gray-900 md:table">
            <thead className="rounded-lg text-left text-sm font-normal">
              <tr>
                <th scope="col" className="px-4 py-5 font-medium sm:pl-6">
                  Program Name
                </th>
                <th scope="col" className="px-3 py-5 font-medium">
                  Creator
                </th>
                <th scope="col" className="px-3 py-5 font-medium">
                  Description
                </th>
                <th scope="col" className="px-3 py-5 font-medium">
                  Exercises
                </th>
                <th scope="col" className="relative py-3 pl-6 pr-3">
                  <span className="sr-only">Edit</span>
                </th>
              </tr>
            </thead>
            <tbody className="bg-white">
              {programs?.map((program) => (
                <React.Fragment key={program.id}>
                  <tr
                    className="w-full border-b py-3 text-sm last-of-type:border-none [&:first-child>td:first-child]:rounded-tl-lg [&:first-child>td:last-child]:rounded-tr-lg [&:last-child>td:first-child]:rounded-bl-lg [&:last-child>td:last-child]:rounded-br-lg"
                  >
                    <td className="whitespace-nowrap py-3 pl-6 pr-3">
                      <div className="flex items-center gap-3">
                        <button
                          onClick={() => toggleRow(program.name)}
                          className="text-gray-500 hover:text-gray-700"
                        >
                          {expandedRows.has(program.name) ? (
                            <ChevronDownIcon className="h-4 w-4" />
                          ) : (
                            <ChevronRightIcon className="h-4 w-4" />
                          )}
                        </button>
                        <p className="font-medium">{program.name}</p>
                      </div>
                    </td>
                    <td className="whitespace-nowrap px-3 py-3">
                      {program.userName || program.user}
                    </td>
                    <td className="px-3 py-3">
                      <div className="max-w-xs truncate" title={program.description}>
                        {program.description}
                      </div>
                    </td>
                    <td className="whitespace-nowrap px-3 py-3">
                      {program.exerciseCount} exercises
                    </td>
                    <td className="whitespace-nowrap py-3 pl-6 pr-3">
                      <div className="flex justify-end gap-3">
                        <UpdateProgram name={program.name} />
                        <DeleteProgram name={program.name} />
                      </div>
                    </td>
                  </tr>
                  {expandedRows.has(program.name) && (
                    <tr>
                      <td colSpan={5} className="px-6 py-4 bg-gray-50">
                        <div className="space-y-2">
                          <h4 className="text-sm font-medium text-gray-700">Exercises in this program:</h4>
                          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
                            {program.exercises.map((exercise) => (
                              <div key={exercise.id} className="bg-white rounded p-3 border">
                                <p className="text-sm font-medium">{exercise.title}</p>
                                <p className="text-xs text-gray-500">
                                  Type: {exercise.exerciseTypeName || exercise.exerciseType}
                                </p>
                                <p className="text-xs text-gray-500">
                                  {exercise.sets} sets × {exercise.reps} reps
                                </p>
                                {exercise.isTimed && (
                                  <p className="text-xs text-gray-500">
                                    Work: {exercise.workTime}s, Rest: {exercise.restTime}s
                                  </p>
                                )}
                                <p className="text-xs text-gray-500 truncate" title={exercise.description}>
                                  {exercise.description}
                                </p>
                              </div>
                            ))}
                          </div>
                        </div>
                      </td>
                    </tr>
                  )}
                </React.Fragment>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
