'use client';

import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Save, User } from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { schoolService } from '@/services/schoolService';
import { useState } from 'react';

export default function NouvelEnseignantPage() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    nom: '',
    prenom: '',
    telephone: '',
    statut: 'Fonctionnaire' as 'Fonctionnaire' | 'Contractuel',
    matricule: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await schoolService.addTeacher(formData);
      router.push('/enseignants');
      router.refresh(); // Force le rechargement des données serveur
    } catch (error) {
      console.error(error);
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6 md:p-10">
      <div className="mb-8">
        <Link href="/enseignants" className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-gray-900 mb-4 transition-colors">
          <ArrowLeft size={16} /> Retour au personnel
        </Link>
        <h1 className="text-2xl font-bold text-gray-900">Ajouter un enseignant</h1>
      </div>

      <form onSubmit={handleSubmit}>
        <Card className="space-y-6">
          <div className="flex items-center gap-2 border-b border-gray-100 pb-3 mb-4">
            <User size={20} className="text-primary-600" />
            <h2 className="text-lg font-semibold text-gray-900">Informations personnelles</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Nom *</label>
              <input required type="text" name="nom" value={formData.nom} onChange={handleChange} className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:ring-2 focus:ring-primary-500 focus:outline-none" placeholder="Ex: NKOMBI" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Prénom(s) *</label>
              <input required type="text" name="prenom" value={formData.prenom} onChange={handleChange} className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:ring-2 focus:ring-primary-500 focus:outline-none" placeholder="Ex: Marie Paule" />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Téléphone *</label>
              <input required type="tel" name="telephone" value={formData.telephone} onChange={handleChange} className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:ring-2 focus:ring-primary-500 focus:outline-none" placeholder="Ex: 6XX XX XX XX" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Statut *</label>
              <select name="statut" value={formData.statut} onChange={handleChange} className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:ring-2 focus:ring-primary-500 focus:outline-none bg-white">
                <option value="Fonctionnaire">Fonctionnaire</option>
                <option value="Contractuel">Contractuel</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Matricule (Optionnel)</label>
            <input type="text" name="matricule" value={formData.matricule} onChange={handleChange} className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:ring-2 focus:ring-primary-500 focus:outline-none" placeholder="Ex: 253136" />
          </div>

          <div className="flex justify-end pt-4 border-t border-gray-100">
            <Button type="submit" variant="primary" className="w-full md:w-auto px-8 py-3" disabled={isSubmitting}>
              <Save size={20} />
              {isSubmitting ? 'Enregistrement...' : 'Enregistrer l\'enseignant'}
            </Button>
          </div>
        </Card>
      </form>
    </div>
  );
}