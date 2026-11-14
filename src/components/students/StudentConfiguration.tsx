'use client';

import { useState } from 'react';
import { saveEvaluationPeriodAction, saveGradeLevelAction } from '@/app/eleves/configuration-actions';

export function StudentConfiguration({ schoolYear, enabled }: { schoolYear: string; enabled: boolean }) {
  const [open, setOpen] = useState(false);
  const [kind, setKind] = useState<'grade' | 'period'>('grade');
  const [message, setMessage] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  if (!enabled) {
    return <p className="text-xs text-gray-500">Configuration des niveaux et évaluations disponible après connexion de la base PostgreSQL.</p>;
  }

  return (
    <div>
      <button type="button" onClick={() => { setMessage(''); setOpen(true); }} className="text-sm font-medium text-primary-700 hover:underline">
        Configurer les niveaux et évaluations
      </button>
      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4" role="presentation" onMouseDown={(event) => { if (event.target === event.currentTarget && !isSaving) setOpen(false); }}>
          <form
            className="w-full max-w-md space-y-4 rounded-xl bg-white p-6 shadow-xl"
            onSubmit={async (event) => {
              event.preventDefault();
              const form = new FormData(event.currentTarget);
              setIsSaving(true);
              setMessage('');
              try {
                if (kind === 'grade') {
                  await saveGradeLevelAction({ name: form.get('name'), label: form.get('label'), position: form.get('position') });
                  setMessage('Niveau enregistré. Il sera proposé dans les inscriptions.');
                } else {
                  await saveEvaluationPeriodAction({ schoolYear, name: form.get('name'), startsOn: form.get('startsOn'), endsOn: form.get('endsOn') });
                  setMessage('Période d’évaluation enregistrée.');
                }
                event.currentTarget.reset();
              } catch (error) {
                setMessage(error instanceof Error ? error.message : 'Une erreur est survenue.');
              } finally {
                setIsSaving(false);
              }
            }}
          >
            <div className="flex items-start justify-between gap-4">
              <div>
                <h2 className="text-lg font-semibold text-gray-900">Configuration scolaire</h2>
                <p className="text-sm text-gray-500">Année sélectionnée : {schoolYear}</p>
              </div>
              <button type="button" aria-label="Fermer" onClick={() => setOpen(false)} className="text-gray-500 hover:text-gray-900">×</button>
            </div>
            <div className="flex gap-2 border-b border-gray-200">
              <button type="button" onClick={() => setKind('grade')} className={`px-3 py-2 text-sm ${kind === 'grade' ? 'border-b-2 border-primary-600 font-semibold text-primary-800' : 'text-gray-500'}`}>Niveau</button>
              <button type="button" onClick={() => setKind('period')} className={`px-3 py-2 text-sm ${kind === 'period' ? 'border-b-2 border-primary-600 font-semibold text-primary-800' : 'text-gray-500'}`}>Période d’évaluation</button>
            </div>
            <label className="block text-sm font-medium text-gray-700">{kind === 'grade' ? 'Code du niveau' : 'Nom de la période'}
              <input name="name" required maxLength={120} placeholder={kind === 'grade' ? 'Ex. CM3' : 'Ex. Trimestre 1'} className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2" />
            </label>
            {kind === 'grade' ? <>
              <label className="block text-sm font-medium text-gray-700">Libellé<input name="label" required maxLength={120} className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2" /></label>
              <label className="block text-sm font-medium text-gray-700">Ordre d’affichage<input name="position" type="number" min="0" defaultValue="0" className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2" /></label>
            </> : <div className="grid grid-cols-2 gap-3">
              <label className="block text-sm font-medium text-gray-700">Début<input name="startsOn" type="date" className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2" /></label>
              <label className="block text-sm font-medium text-gray-700">Fin<input name="endsOn" type="date" className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2" /></label>
            </div>}
            {message && <p role="status" className="text-sm text-gray-700">{message}</p>}
            <div className="flex justify-end gap-2"><button type="button" onClick={() => setOpen(false)} className="rounded-md px-4 py-2 text-sm text-gray-600">Fermer</button><button disabled={isSaving} className="rounded-md bg-primary-600 px-4 py-2 text-sm font-medium text-white disabled:opacity-50">{isSaving ? 'Enregistrement...' : 'Enregistrer'}</button></div>
          </form>
        </div>
      )}
    </div>
  );
}
