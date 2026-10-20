'use client';

import { Printer } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { StaffRecord } from '@/types';

// Données de test basées sur ta photo pour voir le rendu
const MOCK_TEACHERS: StaffRecord[] = [
  {
    id: '1', nomPrenom: 'MBIA MARCEL', sexe: 'M', dateLieuNaissance: '1974 BIPINDI', matricule: '041136', statut: 'Fonctionnaire', categorie: 'BACC', diplome: 'BACC', anneeDiplome: '2006', fonction: 'DIR', classeTenue: 'CM2', numeroDecision: '002/08/MINEDUB/SG...', dateEntree: '2008', fonctionOrigine: 'DIRECTEUR', avancement: 'Nouveau', contact: '699 64...'
  },
  {
    id: '2', nomPrenom: 'NKOMBI MARIE PAULE', sexe: 'F', dateLieuNaissance: '1976 KRIBI', matricule: '253136', statut: 'Fonctionnaire', categorie: 'CAP', diplome: 'CAP', anneeDiplome: '2004', fonction: 'CEL', classeTenue: 'SIL', numeroDecision: '089/08...', dateEntree: '2004', fonctionOrigine: 'ENSEIGNANT', avancement: '', contact: '676 16...'
  },
  // Ajoute d'autres lignes si besoin...
];

export function StaffReport({ personnel = MOCK_TEACHERS }: { personnel?: StaffRecord[] }) {
  
  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="w-full">
      {/* Bouton d'impression (caché à l'impression) */}
      <div className="mb-6 flex justify-end print:hidden">
        <Button onClick={handlePrint} variant="primary" className="gap-2">
          <Printer size={18} /> Imprimer / Sauvegarder en PDF
        </Button>
      </div>

      {/* Le document à imprimer */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 overflow-x-auto print:shadow-none print:border-none print:p-0">
        
        {/* En-tête du document */}
        <div className="text-center mb-6">
          <h1 className="text-xl font-bold uppercase">État de Mise en Place du Personnel</h1>
          <p className="text-md">Année scolaire 2025/2026</p>
          <p className="text-sm font-semibold mt-1">École Publique de Bikondo</p>
        </div>

        {/* Tableau */}
        <table className="w-full border-collapse border border-black text-[10px] leading-tight text-center">
          <thead>
            <tr className="bg-gray-100 print:bg-gray-200">
              <th className="border border-black p-1">N°</th>
              <th className="border border-black p-1 text-left">Nom et Prénom(s)</th>
              <th className="border border-black p-1">Sexe</th>
              <th className="border border-black p-1 text-left">Date et Lieu de naissance</th>
              <th className="border border-black p-1">Matricule</th>
              <th className="border border-black p-1">Statut</th>
              <th className="border border-black p-1">Cat.</th>
              <th className="border border-black p-1">Diplôme</th>
              <th className="border border-black p-1">Année</th>
              <th className="border border-black p-1">Fonction</th>
              <th className="border border-black p-1">Classe Tenue</th>
              <th className="border border-black p-1">N° Prise de Service</th>
              <th className="border border-black p-1">Date d'entrée</th>
              <th className="border border-black p-1">Fonction d'origine</th>
              <th className="border border-black p-1">Avancement</th>
              <th className="border border-black p-1">Contact</th>
            </tr>
          </thead>
          <tbody>
            {personnel.map((p, index) => (
              <tr key={p.id}>
                <td className="border border-black p-1">{index + 1}</td>
                <td className="border border-black p-1 text-left uppercase">{p.nomPrenom}</td>
                <td className="border border-black p-1">{p.sexe}</td>
                <td className="border border-black p-1 text-left">{p.dateLieuNaissance}</td>
                <td className="border border-black p-1">{p.matricule}</td>
                <td className="border border-black p-1">{p.statut}</td>
                <td className="border border-black p-1">{p.categorie}</td>
                <td className="border border-black p-1">{p.diplome}</td>
                <td className="border border-black p-1">{p.anneeDiplome}</td>
                <td className="border border-black p-1">{p.fonction}</td>
                <td className="border border-black p-1">{p.classeTenue}</td>
                <td className="border border-black p-1">{p.numeroDecision}</td>
                <td className="border border-black p-1">{p.dateEntree}</td>
                <td className="border border-black p-1">{p.fonctionOrigine}</td>
                <td className="border border-black p-1">{p.avancement}</td>
                <td className="border border-black p-1">{p.contact}</td>
              </tr>
            ))}
            {/* Lignes vides pour compléter la page si besoin */}
            {[...Array(Math.max(0, 10 - personnel.length))].map((_, i) => (
              <tr key={`empty-${i}`}>
                {[...Array(16)].map((_, j) => (
                  <td key={j} className="border border-black p-2">&nbsp;</td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>

        {/* Pied de page */}
        <div className="mt-8 flex justify-between text-sm">
          <div className="text-center">
            <p className="font-semibold mb-8">Le Délégué Départemental</p>
            <p>Signature et Cachet</p>
          </div>
          <div className="text-center">
            <p className="font-semibold mb-8">La Directrice</p>
            <p>Signature et Cachet</p>
          </div>
        </div>
      </div>
    </div>
  );
}