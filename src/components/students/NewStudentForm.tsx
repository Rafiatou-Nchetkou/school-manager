'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Save, User, Phone, BookOpen, AlertCircle } from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { GradeLevel, StudentStatus } from '@/types';
import { createStudentEnrollmentAction } from '@/app/eleves/actions';

type FormState = {
  prenom: string;
  nom: string;
  sexe: '' | 'M' | 'F';
  dateNaissance: string;
  classe: GradeLevel;
  statut: StudentStatus;
  tuteurNom: string;
  tuteurTelephone: string;
  ecolePrecedente: string;
  fraisScolariteTotal: number;
  fraisScolaritePayes: number;
  anneeScolaire: string;
  dateTransfert: string;
  origineTransfert: string;
  destinationTransfert: string;
};

export function NewStudentForm({ gradeLevels, schoolYear }: { gradeLevels: string[]; schoolYear: string }) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState<FormState>({
    prenom: '',
    nom: '',
    sexe: '',
    dateNaissance: '',
    classe: (gradeLevels[0] ?? 'SIL') as GradeLevel,
    statut: 'Nouveau',
    tuteurNom: '',
    tuteurTelephone: '',
    ecolePrecedente: '',
    fraisScolariteTotal: 15000,
    fraisScolaritePayes: 0,
    anneeScolaire: schoolYear,
    dateTransfert: new Date().toISOString().slice(0, 10),
    origineTransfert: '',
    destinationTransfert: '',
  });

  const handleChange = (event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = event.target;
    setFormData(previous => ({ ...previous, [name]: name === 'fraisScolariteTotal' || name === 'fraisScolaritePayes' ? Number(value) : value }));
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsSubmitting(true);
    try {
      await createStudentEnrollmentAction({
        firstName: formData.prenom,
        lastName: formData.nom,
        gender: formData.sexe || undefined,
        birthDate: formData.dateNaissance,
        guardianName: formData.tuteurNom,
        guardianPhone: formData.tuteurTelephone,
        previousSchool: formData.ecolePrecedente,
        gradeLevel: formData.classe,
        schoolYear: formData.anneeScolaire,
        status: formData.statut,
        totalTuition: formData.fraisScolariteTotal,
        paidTuition: formData.fraisScolaritePayes,
        enteredAt: formData.dateTransfert,
        transferDirection: formData.statut === 'Transféré' ? 'Entrant' : undefined,
        transferOrigin: formData.origineTransfert,
        transferDestination: formData.destinationTransfert,
      });
      router.push('/eleves');
      router.refresh();
    } catch (error) {
      console.error(error);
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-6 md:p-10 pb-24">
      <div className="mb-8">
        <Link href="/eleves" className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-gray-900 mb-4 transition-colors">
          <ArrowLeft size={16} /> Retour aux élèves
        </Link>
        <h1 className="text-2xl font-bold text-gray-900">Inscrire un élève</h1>
        <p className="text-gray-500 mt-1">Année scolaire {formData.anneeScolaire}</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <Card className="space-y-4">
          <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2 border-b border-gray-100 pb-3"><User size={20} className="text-blue-600" /> Identité de l&apos;élève</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <label className="block text-sm font-medium text-gray-700">Prénom(s)<input type="text" name="prenom" value={formData.prenom} onChange={handleChange} className="mt-1 w-full rounded-xl border border-gray-200 px-4 py-2.5" placeholder="Ex. Jean" /></label>
            <label className="block text-sm font-medium text-gray-700">Nom<input type="text" name="nom" value={formData.nom} onChange={handleChange} className="mt-1 w-full rounded-xl border border-gray-200 px-4 py-2.5" placeholder="Ex. NKOMO" /></label>
            <label className="block text-sm font-medium text-gray-700">Sexe<select name="sexe" value={formData.sexe} onChange={handleChange} className="mt-1 w-full rounded-xl border border-gray-200 bg-white px-4 py-2.5"><option value="">Non renseigné</option><option value="M">Masculin</option><option value="F">Féminin</option></select></label>
            <label className="block text-sm font-medium text-gray-700">Date de naissance<input type="date" name="dateNaissance" value={formData.dateNaissance} onChange={handleChange} className="mt-1 w-full rounded-xl border border-gray-200 px-4 py-2.5" /></label>
          </div>
        </Card>

        <Card className="space-y-4">
          <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2 border-b border-gray-100 pb-3"><BookOpen size={20} className="text-blue-600" /> Scolarité</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <label className="block text-sm font-medium text-gray-700">Classe<select name="classe" value={formData.classe} onChange={handleChange} className="mt-1 w-full rounded-xl border border-gray-200 bg-white px-4 py-2.5">{gradeLevels.map(level => <option key={level} value={level}>{level}</option>)}</select></label>
            <label className="block text-sm font-medium text-gray-700">Statut de l&apos;inscription<select name="statut" value={formData.statut} onChange={handleChange} className="mt-1 w-full rounded-xl border border-gray-200 bg-white px-4 py-2.5"><option value="Nouveau">Nouveau</option><option value="Passant">Passant</option><option value="Redoublant">Redoublant</option><option value="Transféré">Transfert entrant</option><option value="Candidat Examen">Candidat examen</option></select></label>
          </div>
          {formData.statut === 'Nouveau' && <label className="block text-sm font-medium text-gray-700">École précédente (facultatif)<input type="text" name="ecolePrecedente" value={formData.ecolePrecedente} onChange={handleChange} className="mt-1 w-full rounded-xl border border-gray-200 px-4 py-2.5" /></label>}
          {formData.statut === 'Transféré' && <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <label className="block text-sm font-medium text-gray-700">Date du transfert<input type="date" name="dateTransfert" value={formData.dateTransfert} onChange={handleChange} className="mt-1 w-full rounded-xl border border-gray-200 px-4 py-2.5" /></label>
            <label className="block text-sm font-medium text-gray-700">École d&apos;origine<input type="text" name="origineTransfert" value={formData.origineTransfert} onChange={handleChange} className="mt-1 w-full rounded-xl border border-gray-200 px-4 py-2.5" /></label>
            <label className="block text-sm font-medium text-gray-700">Destination connue<input type="text" name="destinationTransfert" value={formData.destinationTransfert} onChange={handleChange} className="mt-1 w-full rounded-xl border border-gray-200 px-4 py-2.5" /></label>
          </div>}
        </Card>

        <Card className="space-y-4">
          <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2 border-b border-gray-100 pb-3"><Phone size={20} className="text-blue-600" /> Parent ou tuteur (facultatif)</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <label className="block text-sm font-medium text-gray-700">Nom du parent ou tuteur<input type="text" name="tuteurNom" value={formData.tuteurNom} onChange={handleChange} className="mt-1 w-full rounded-xl border border-gray-200 px-4 py-2.5" /></label>
            <label className="block text-sm font-medium text-gray-700">Téléphone<input type="tel" name="tuteurTelephone" value={formData.tuteurTelephone} onChange={handleChange} className="mt-1 w-full rounded-xl border border-gray-200 px-4 py-2.5" /></label>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <label className="block text-sm font-medium text-gray-700">Frais de scolarité totaux<input required type="number" min="0" step="0.01" name="fraisScolariteTotal" value={formData.fraisScolariteTotal} onChange={handleChange} className="mt-1 w-full rounded-xl border border-gray-200 px-4 py-2.5" /></label>
            <label className="block text-sm font-medium text-gray-700">Montant payé<input type="number" min="0" step="0.01" name="fraisScolaritePayes" value={formData.fraisScolaritePayes} onChange={handleChange} className="mt-1 w-full rounded-xl border border-gray-200 px-4 py-2.5" /></label>
          </div>
        </Card>

        {formData.classe === 'CM2' && <div className="flex gap-3 rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-800"><AlertCircle className="shrink-0" /><p>L&apos;élève pourra être suivi pour le CEP et le concours d&apos;entrée en 6ème.</p></div>}
        <div className="flex justify-end"><Button type="submit" variant="primary" disabled={isSubmitting}><Save size={20} />{isSubmitting ? 'Enregistrement...' : 'Enregistrer l’inscription'}</Button></div>
      </form>
    </div>
  );
}
