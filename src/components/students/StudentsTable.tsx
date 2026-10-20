import Link from 'next/link';
import { ChevronLeft, ChevronRight, MoreHorizontal } from 'lucide-react';
import { Badge } from '@/components/ui/Badge';
import { Student, StudentStatus } from '@/types';

export function StudentTable({ 
  students, 
  total, 
  totalPages, 
  currentPage,
  searchParams
}: { 
  students: Student[]; 
  total: number; 
  totalPages: number; 
  currentPage: number;
  searchParams: Record<string, string>;
}) {
  
  const getStatutVariant = (statut: StudentStatus) => {
    switch (statut) {
      case 'Nouveau': return 'info';
      case 'Passant': return 'success';
      case 'Redoublant': return 'warning';
      case 'Transféré': return 'default';
      case 'Candidat Examen': return 'danger';
      default: return 'default';
    }
  };

  // Fonction pour générer l'URL de pagination
  const createPageURL = (pageNumber: number) => {
    const params = new URLSearchParams(searchParams);
    params.set('page', pageNumber.toString());
    return `/eleves?${params.toString()}`;
  };

  return (
    <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left">
          <thead className="bg-gray-50 border-b border-gray-200 text-xs uppercase text-gray-500 font-semibold tracking-wider">
            <tr>
              <th className="px-6 py-4">Élève</th>
              <th className="px-6 py-4">Classe</th>
              <th className="px-6 py-4">Statut</th>
              <th className="px-6 py-4">Scolarité</th>
              <th className="px-6 py-4">Tuteur</th>
              <th className="px-6 py-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {students.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-6 py-12 text-center text-gray-500">
                  Aucun élève trouvé avec ces critères.
                </td>
              </tr>
            ) : (
              students.map((eleve) => {
                const resteAPayer = eleve.fraisScolariteTotal - eleve.fraisScolaritePayes;
                const estAJour = resteAPayer <= 0;

                return (
                  <tr key={eleve.id} className="hover:bg-gray-50/50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex flex-col">
                        <span className="font-medium text-gray-900">{eleve.nom} {eleve.prenom}</span>
                        <span className="text-xs text-gray-500 font-mono mt-0.5">{eleve.matricule}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap font-medium text-gray-700">{eleve.classe}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <Badge variant={getStatutVariant(eleve.statut)}>{eleve.statut}</Badge>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {estAJour ? (
                        <span className="text-xs font-medium text-emerald-600 bg-emerald-50 px-2 py-1 rounded w-fit">À jour</span>
                      ) : (
                        <span className="text-xs font-medium text-red-600 bg-red-50 px-2 py-1 rounded w-fit">
                          Reste : {resteAPayer.toLocaleString('fr-FR')} F
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-gray-600">
                      <div className="flex flex-col">
                        <span>{eleve.tuteurNom}</span>
                        <span className="text-xs text-gray-400">{eleve.tuteurTelephone}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <button className="text-gray-400 hover:text-gray-900 p-2 rounded-lg hover:bg-gray-100 transition-colors">
                        <MoreHorizontal size={18} />
                      </button>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination (Liens) */}
      <div className="bg-white border-t border-gray-200 px-6 py-3 flex items-center justify-between">
        <div className="text-sm text-gray-500">
          Affichage de <span className="font-medium text-gray-900">{total > 0 ? (currentPage - 1) * 8 + 1 : 0}</span> à <span className="font-medium text-gray-900">{Math.min(currentPage * 8, total)}</span> sur <span className="font-medium text-gray-900">{total}</span> élèves
        </div>
        <div className="flex items-center gap-2">
          <Link
            href={createPageURL(currentPage - 1)}
            className={`p-1.5 rounded-md border border-gray-200 text-gray-500 hover:bg-gray-50 transition-colors ${currentPage === 1 ? 'pointer-events-none opacity-50' : ''}`}
          >
            <ChevronLeft size={16} />
          </Link>
          <span className="text-sm text-gray-600 px-2">
            Page {currentPage} sur {totalPages || 1}
          </span>
          <Link
            href={createPageURL(currentPage + 1)}
            className={`p-1.5 rounded-md border border-gray-200 text-gray-500 hover:bg-gray-50 transition-colors ${currentPage === totalPages || totalPages === 0 ? 'pointer-events-none opacity-50' : ''}`}
          >
            <ChevronRight size={16} />
          </Link>
        </div>
      </div>
    </div>
  );
}