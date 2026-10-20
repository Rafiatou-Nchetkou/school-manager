import Link from 'next/link';
import { Users, UserX, Settings } from 'lucide-react';
import { schoolService } from '@/services/schoolService';
import { Button } from '@/components/ui/Button';
import { AssignTeacherModal } from '@/components/classrooms/AssignTeacherModal';

export default async function ClassesPage() {
  const classrooms = await schoolService.getClassrooms();
  const { data: teachers } = await schoolService.getFilteredTeachers({ status: 'all' });

  return (
    <div className="max-w-7xl mx-auto p-6 md:p-8 space-y-6">
      
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900 tracking-tight">Gestion des Classes</h1>
          <p className="text-sm text-gray-500 mt-1">
            Année scolaire 2026-2027 • Vue d&apos;ensemble des effectifs et des titulaires.
          </p>
        </div>
        <Button variant="primary" className="gap-2">
          <Settings size={16} /> Configurer les classes
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {classrooms.map((classroom) => {
          const hasTeacher = !!classroom.teacher;

          return (
            <div key={classroom.id} className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden flex flex-col">
              
              <div className="p-5 border-b border-gray-100 flex justify-between items-start bg-gray-50/50">
                <div>
                  <h2 className="text-xl font-bold text-gray-900">{classroom.nom}</h2>
                  <p className="text-xs text-gray-500 mt-1 uppercase tracking-wider font-semibold">Classe</p>
                </div>
                <div className="flex items-center gap-1.5 bg-white border border-gray-200 px-3 py-1 rounded-full shadow-sm">
                  <Users size={14} className="text-gray-400" />
                  <span className="text-sm font-semibold text-gray-700">{classroom.studentCount}</span>
                </div>
              </div>

              <div className="p-5 flex-1 flex flex-col justify-center">
                <div className="flex justify-between items-center mb-2">
                  <p className="text-xs text-gray-500 font-medium uppercase tracking-wider">Enseignant Titulaire</p>
                  {/* La modale est placée ici */}
                  <AssignTeacherModal 
                    classId={classroom.id}
                    classroomName={classroom.nom}
                    currentTeacherId={classroom.enseignantTitulaireId}
                    teachers={teachers}
                  />
                </div>
                
                {hasTeacher ? (
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center font-bold text-sm shrink-0">
                      {classroom.teacher!.prenom[0]}{classroom.teacher!.nom[0]}
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900 text-sm">
                        {classroom.teacher!.nom} {classroom.teacher!.prenom}
                      </p>
                      <p className="text-xs text-gray-500">{classroom.teacher!.telephone}</p>
                    </div>
                  </div>
                ) : (
                  <div className="flex items-center gap-2 text-red-600 bg-red-50 p-3 rounded-lg border border-red-100">
                    <UserX size={18} />
                    <p className="text-sm font-medium">Aucun titulaire assigné</p>
                  </div>
                )}
              </div>

              <div className="px-5 py-3 border-t border-gray-100 bg-gray-50 flex justify-between items-center text-sm">
                <span className="text-gray-500">{classroom.studentCount} élèves inscrits</span>
                <Link href={`/eleves?gradeLevel=${classroom.nom}`} className="text-blue-600 font-medium hover:underline">
                  Voir les élèves
                </Link>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}