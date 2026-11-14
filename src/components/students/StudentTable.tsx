'use client';

import Link from 'next/link';
import { ChevronLeft, ChevronRight, MoreHorizontal } from 'lucide-react';
import { Badge } from '@/components/ui/Badge';
import { Student, StudentStatus } from '@/types';
import { useState } from 'react';
import { reEnrollStudentAction, recordStudentTransferAction } from '@/app/eleves/lifecycle-actions';

export function StudentTable({ 
  students, 
  total, 
  totalPages, 
  currentPage,
  searchParams,
  allowReEnrollment = false,
  gradeLevels = [],
  schoolYears = [],
}: { 
  students: Student[]; 
  total: number; 
  totalPages: number; 
  currentPage: number;
  searchParams: Record<string, string>;
  allowReEnrollment?: boolean;
  gradeLevels?: string[];
  schoolYears?: string[];
}) {
  const [activeDialog, setActiveDialog] = useState<{ kind: 'reenroll' | 'transfer'; student: Student } | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  
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
                      <div className="flex items-center justify-end gap-2">
                        {allowReEnrollment && <button type="button" onClick={() => setActiveDialog({ kind: 'reenroll', student: eleve })} className="text-xs font-medium text-primary-700 hover:underline">Réinscrire</button>}
                        {allowReEnrollment && <button type="button" onClick={() => setActiveDialog({ kind: 'transfer', student: eleve })} className="text-xs font-medium text-gray-600 hover:underline">Transfert sortant</button>}
                        <button type="button" aria-label={`Actions pour ${eleve.prenom} ${eleve.nom}`} className="text-gray-400 hover:text-gray-900 p-2 rounded-lg hover:bg-gray-100 transition-colors">
                          <MoreHorizontal size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {activeDialog && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4" role="presentation" onMouseDown={(event) => { if (event.target === event.currentTarget && !isSaving) setActiveDialog(null); }}>
          <form
            className="w-full max-w-md space-y-4 rounded-xl bg-white p-6 shadow-xl"
            onSubmit={async (event) => {
              event.preventDefault();
              const form = event.currentTarget;
              const formData = new FormData(form);
              setIsSaving(true);
              try {
                if (activeDialog.kind === 'reenroll') {
                  await reEnrollStudentAction({
                    studentId: activeDialog.student.id,
                    schoolYear: String(formData.get('schoolYear')),
                    gradeLevel: String(formData.get('gradeLevel')),
                    status: String(formData.get('status')),
                    totalTuition: formData.get('totalTuition'),
                    paidTuition: formData.get('paidTuition'),
                    enteredAt: String(formData.get('occurredAt')),
                  });
                } else {
                  await recordStudentTransferAction({
                    studentId: activeDialog.student.id,
                    occurredAt: String(formData.get('occurredAt')),
                    destination: String(formData.get('destination') || ''),
                    notes: String(formData.get('notes') || ''),
                  });
                }
                setActiveDialog(null);
              } finally {
                setIsSaving(false);
              }
            }}
          >
            <div>
              <h2 className="text-lg font-semibold text-gray-900">
                {activeDialog.kind === 'reenroll' ? 'Réinscrire cet élève' : 'Enregistrer un transfert sortant'}
              </h2>
              <p className="mt-1 text-sm text-gray-500">{activeDialog.student.prenom} {activeDialog.student.nom} · {activeDialog.student.matricule}</p>
            </div>
            {activeDialog.kind === 'reenroll' && <>
              <label className="block text-sm font-medium text-gray-700">Année scolaire<select name="schoolYear" required className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2">{schoolYears.map(year => <option key={year} value={year}>{year}</option>)}</select></label>
              <label className="block text-sm font-medium text-gray-700">Classe<select name="gradeLevel" required className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2">{gradeLevels.map(level => <option key={level} value={level}>{level}</option>)}</select></label>
              <label className="block text-sm font-medium text-gray-700">Parcours<select name="status" required className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2"><option value="Passant">Passant</option><option value="Redoublant">Redoublant</option><option value="Transféré">Transféré</option><option value="Candidat Examen">Candidat examen</option></select></label>
              <div className="grid grid-cols-2 gap-3"><label className="block text-sm font-medium text-gray-700">Frais totaux<input name="totalTuition" type="number" min="0" step="0.01" required defaultValue="0" className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2" /></label><label className="block text-sm font-medium text-gray-700">Déjà payé<input name="paidTuition" type="number" min="0" step="0.01" required defaultValue="0" className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2" /></label></div>
            </>}
            <label className="block text-sm font-medium text-gray-700">Date<input name="occurredAt" type="date" required defaultValue={new Date().toISOString().slice(0, 10)} className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2" /></label>
            {activeDialog.kind === 'transfer' && <>
              <label className="block text-sm font-medium text-gray-700">Établissement de destination (si connu)<input name="destination" maxLength={180} className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2" /></label>
              <label className="block text-sm font-medium text-gray-700">Notes<textarea name="notes" maxLength={1000} className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2" /></label>
            </>}
            <div className="flex justify-end gap-2"><button type="button" disabled={isSaving} onClick={() => setActiveDialog(null)} className="rounded-md px-4 py-2 text-sm text-gray-600">Annuler</button><button disabled={isSaving} className="rounded-md bg-primary-600 px-4 py-2 text-sm font-medium text-white disabled:opacity-50">{isSaving ? 'Enregistrement...' : 'Confirmer'}</button></div>
          </form>
        </div>
      )}

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