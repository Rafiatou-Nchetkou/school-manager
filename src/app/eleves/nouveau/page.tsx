'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Save, User, Phone, BookOpen, AlertCircle } from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { schoolService } from '@/services/schoolService';
import { GradeLevel, StudentStatus } from '@/types';
import { Button } from '@/components/ui/Button';

export default function NouvelElevePage() {
  const router = useRouter();
  
  // État initial du formulaire
  const [formData, setFormData] = useState({
    prenom: '',
    nom: '',
    sexe: 'M' as 'M' | 'F',
    dateNaissance: '',
    classe: 'SIL' as GradeLevel,
    statut: 'Nouveau' as StudentStatus,
    tuteurNom: '',
    tuteurTelephone: '',
    ecolePrecedente: '',
    fraisScolariteTotal: 15000,
    fraisScolaritePayes: 0,
    anneeScolaire: '2026-2027',
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  // Mise à jour des champs
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  // Soumission du formulaire
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      schoolService.addStudent({
        ...formData,
        dateInscription: new Date().toISOString().slice(0, 10),
        // Si l'élève n'est pas nouveau, on vide l'école précédente
        ecolePrecedente: formData.statut === 'Nouveau' ? formData.ecolePrecedente : undefined,
      });
      
      // Redirection vers le tableau de bord après succès
      router.push('/');
    } catch (error) {
      console.error(error);
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-6 md:p-10 pb-24">
      {/* En-tête avec bouton retour */}
      <div className="mb-8">
        <Link href="/" className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-gray-900 mb-4 transition-colors">
          <ArrowLeft size={16} /> Retour au tableau de bord
        </Link>
        <h1 className="text-2xl font-bold text-gray-900">Inscrire un nouvel élève</h1>
        <p className="text-gray-500 mt-1">Remplissez les informations pour l'année scolaire {formData.anneeScolaire}.</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        
        {/* Bloc 1 : Identité de l'élève */}
        <Card className="space-y-4">
          <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2 border-b border-gray-100 pb-3">
            <User size={20} className="text-blue-600" /> Identité de l'élève
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Prénom(s) *</label>
              <input required type="text" name="prenom" value={formData.prenom} onChange={handleChange} className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:outline-none" placeholder="Ex: Jean" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Nom *</label>
              <input required type="text" name="nom" value={formData.nom} onChange={handleChange} className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:outline-none" placeholder="Ex: NKOMO" />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Sexe *</label>
              <select name="sexe" value={formData.sexe} onChange={handleChange} className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:outline-none bg-white">
                <option value="M">Masculin</option>
                <option value="F">Féminin</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Date de naissance *</label>
              <input required type="date" name="dateNaissance" value={formData.dateNaissance} onChange={handleChange} className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:outline-none" />
            </div>
          </div>
        </Card>

        {/* Bloc 2 : Scolarité */}
        <Card className="space-y-4">
          <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2 border-b border-gray-100 pb-3">
            <BookOpen size={20} className="text-blue-600" /> Scolarité
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Classe *</label>
              <select name="classe" value={formData.classe} onChange={handleChange} className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:outline-none bg-white">
                <option value="SIL">SIL</option>
                <option value="CP">CP</option>
                <option value="CE1">CE1</option>
                <option value="CE2">CE2</option>
                <option value="CM1">CM1</option>
                <option value="CM2">CM2</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Statut de l'élève *</label>
              <select name="statut" value={formData.statut} onChange={handleChange} className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:outline-none bg-white">
                <option value="Nouveau">Nouveau (Première inscription)</option>
                <option value="Passant">Passant (Vient de la classe inférieure)</option>
                <option value="Redoublant">Redoublant</option>
                <option value="Transféré">Transféré (Vient d'une autre école)</option>
              </select>
            </div>
          </div>

          {/* Champ conditionnel : École précédente */}
          {(formData.statut === 'Nouveau' || formData.statut === 'Transféré') && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">École précédente</label>
              <input type="text" name="ecolePrecedente" value={formData.ecolePrecedente} onChange={handleChange} className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:outline-none" placeholder="Nom de l'ancienne école (si applicable)" />
            </div>
          )}
        </Card>

        {/* Bloc 3 : Tuteur & Finances */}
        <Card className="space-y-4">
          <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2 border-b border-gray-100 pb-3">
            <Phone size={20} className="text-blue-600" /> Parent / Tuteur
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Nom du parent/tuteur *</label>
              <input required type="text" name="tuteurNom" value={formData.tuteurNom} onChange={handleChange} className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:outline-none" placeholder="Ex: M. NKOMO" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Téléphone *</label>
              <input required type="tel" name="tuteurTelephone" value={formData.tuteurTelephone} onChange={handleChange} className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:outline-none" placeholder="Ex: 6XX XX XX XX" />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Frais de scolarité totaux (FCFA) *</label>
              <input required type="number" name="fraisScolariteTotal" value={formData.fraisScolariteTotal} onChange={handleChange} className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:outline-none" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Montant payé aujourd'hui (FCFA)</label>
              <input type="number" name="fraisScolaritePayes" value={formData.fraisScolaritePayes} onChange={handleChange} className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:outline-none" />
            </div>
          </div>
        </Card>

        {/* Info pour le CM2 */}
        {formData.classe === 'CM2' && (
          <div className="bg-amber-50 border border-amber-200 p-4 rounded-xl flex gap-3 text-amber-800 text-sm">
            <AlertCircle className="shrink-0" />
            <p>Cet élève sera automatiquement ajouté à la liste des candidats pour le <strong>CEP</strong> et le <strong>Concours d'entrée en 6ème</strong>. Vous pourrez gérer ses résultats plus tard.</p>
          </div>
        )}

        {/* Bouton de soumission */}
        <div className="flex justify-end pt-4">
          <Button type="submit" variant="primary" className="w-full md:w-auto px-8 py-3" disabled={isSubmitting}>
            <Save size={20} />
            {isSubmitting ? 'Enregistrement...' : 'Enregistrer l\'élève'}
          </Button>
        </div>
      </form>
    </div>
  );
}