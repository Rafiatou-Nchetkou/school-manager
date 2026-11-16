'use client';

import Link from 'next/link';
import { ArrowLeft, Save, User } from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { createTeacherAction, type CreateTeacherState } from '@/app/enseignants/actions';
import { useState } from 'react';

export default function NouvelEnseignantPage() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [result, setResult] = useState<CreateTeacherState>();
  const [formData, setFormData] = useState({
    nom: '',
    prenom: '',
    telephone: '',
    email: '',
    statut: 'Fonctionnaire' as 'Fonctionnaire' | 'Contractuel',
    matricule: '',
    password: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const response = await createTeacherAction(formData);
      setResult(response);
      if (response?.success) setFormData(previous => ({ ...previous, password: '' }));
    } catch (error) {
      console.error(error);
      setResult({ error: 'La création a échoué. Vérifiez la base de données et réessayez.' });
    } finally {
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

          <div className="border-t border-gray-100 pt-5">
            <h2 className="text-lg font-semibold text-gray-900">Accès à l’application</h2>
            <p className="mt-1 text-sm text-gray-500">L’e-mail est facultatif. Sans e-mail, un identifiant de connexion unique sera généré.</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Adresse e-mail (facultative)</label>
            <input type="email" name="email" value={formData.email} onChange={handleChange} maxLength={254} className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:ring-2 focus:ring-primary-500 focus:outline-none" placeholder="enseignant@ecole.cm" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Mot de passe initial (12 caractères minimum)</label>
            <input required type="password" name="password" value={formData.password} onChange={handleChange} minLength={12} maxLength={256} autoComplete="new-password" className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:ring-2 focus:ring-primary-500 focus:outline-none" />
          </div>
          {result?.error && <p role="alert" className="text-sm text-red-700">{result.error}</p>}
          {result?.success && <div role="status" className="rounded-lg bg-emerald-50 p-4 text-sm text-emerald-800">
            <p>{result.success}</p>
            <p className="mt-1">Identifiant de connexion : <strong>{result.loginIdentifier}</strong></p>
            <p>Communiquez cet identifiant et le mot de passe à l’enseignant de façon sécurisée.</p>
          </div>}

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
