'use client';

import { useState } from 'react';
import { X, UserCheck } from 'lucide-react';
import { GradeLevel, Teacher } from '@/types';
import { Button } from '@/components/ui/Button';
import { assignClassTeacherAction } from '@/app/classes/actions';

export function AssignTeacherModal({ 
  classId,
  classroomName,
  currentTeacherId,
  teachers
}: { 
  classId: string;
  classroomName: GradeLevel;
  currentTeacherId: string | null;
  teachers: Teacher[];
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedId, setSelectedId] = useState(currentTeacherId || 'none');
  const [isPending, setIsPending] = useState(false);

  const handleSave = async () => {
    setIsPending(true);
    await assignClassTeacherAction(classId, selectedId);
    setIsPending(false);
    setIsOpen(false);
  };

  return (
    <>
      <Button 
        variant="primary" // ou "secondary" selon ta préférence
        onClick={() => setIsOpen(true)}
        className="text-xs h-8 px-3 flex items-center gap-1.5"
      >
        <UserCheck size={14} />
        {currentTeacherId ? 'Changer' : 'Affecter'}
      </Button>

      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            
            <div className="flex justify-between items-center p-5 border-b border-gray-100">
              <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                <UserCheck size={20} className="text-primary-600" />
                Titulaire de la classe {classroomName}
              </h2>
              <button onClick={() => setIsOpen(false)} className="text-gray-400 hover:text-gray-600">
                <X size={20} />
              </button>
            </div>

            <div className="p-5 space-y-4">
              <p className="text-sm text-gray-500">
                Sélectionnez l'enseignant qui sera responsable de cette classe pour l'année en cours.
              </p>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Enseignant titulaire</label>
                <select
                  value={selectedId}
                  onChange={(e) => setSelectedId(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:ring-2 focus:ring-primary-500 focus:outline-none bg-white"
                >
                  <option value="none">-- Aucun titulaire (Classe vacante) --</option>
                  {teachers.map((teacher) => (
                    <option key={teacher.id} value={teacher.id}>
                      {teacher.nom} {teacher.prenom} ({teacher.statut})
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="p-5 bg-gray-50 flex justify-end gap-3 border-t border-gray-100">
              <Button variant="ghost" onClick={() => setIsOpen(false)}>
                Annuler
              </Button>
              <Button variant="primary" onClick={handleSave} disabled={isPending}>
                {isPending ? 'Enregistrement...' : 'Confirmer'}
              </Button>
            </div>

          </div>
        </div>
      )}
    </>
  );
}