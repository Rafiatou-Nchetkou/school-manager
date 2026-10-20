import { MoreHorizontal } from 'lucide-react';
import { Badge } from '@/components/ui/Badge';
import { GradeLevel, Teacher } from '@/types';

type TeacherWithClass = Teacher & { className: GradeLevel | null };

export function TeacherTable({ teachers }: { teachers: TeacherWithClass[] }) {
  return (
    <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left">
          <thead className="bg-gray-50 border-b border-gray-200 text-xs uppercase text-gray-500 font-semibold tracking-wider">
            <tr>
              <th className="px-6 py-4">Enseignant</th>
              <th className="px-6 py-4">Statut</th>
              <th className="px-6 py-4">Matricule</th>
              <th className="px-6 py-4">Classe tenue</th>
              <th className="px-6 py-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {teachers.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-6 py-12 text-center text-gray-500">
                  Aucun enseignant trouvé.
                </td>
              </tr>
            ) : (
              teachers.map((teacher) => (
                <tr key={teacher.id} className="hover:bg-gray-50/50 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex flex-col">
                      <span className="font-medium text-gray-900">{teacher.nom} {teacher.prenom}</span>
                      <span className="text-xs text-gray-500">{teacher.telephone}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <Badge variant={teacher.statut === 'Fonctionnaire' ? 'info' : 'warning'}>
                      {teacher.statut}
                    </Badge>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap font-mono text-xs text-gray-600">
                    {teacher.matricule || '-'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {teacher.className ? (
                      <span className="font-semibold text-gray-700 bg-gray-100 px-2 py-1 rounded">
                        {teacher.className}
                      </span>
                    ) : (
                      <span className="text-xs text-gray-400 italic">Non assigné</span>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button className="text-gray-400 hover:text-gray-900 p-2 rounded-lg hover:bg-gray-100 transition-colors">
                      <MoreHorizontal size={18} />
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
