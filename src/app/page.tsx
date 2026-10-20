'use client';

import Link from 'next/link';
import { Users, Wallet, GraduationCap, UserPlus, ChevronDown } from 'lucide-react';
import { schoolService } from '@/services/schoolService';
import { Student } from '@/types';
import { StatCard } from '@/components/dashboard/StatCard';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';

export default function Dashboard() {
  const students: Student[] = schoolService.getStudents();
  const annee = '2026-2027';

  // Calculs des statistiques
  const elevesAnnee = students.filter(e => e.anneeScolaire === annee);
  const totalEleves = elevesAnnee.length;
  const filles = elevesAnnee.filter(e => e.sexe === 'F').length;
  const garcons = elevesAnnee.filter(e => e.sexe === 'M').length;

  const cm2 = elevesAnnee.filter(e => e.classe === 'CM2');
  const admisCEP = cm2.filter(e => e.resultatCEP === 'Admis').length;
  const admisConcours = cm2.filter(e => e.resultatConcours6e === 'Admis').length;
  
  const totalRecettes = elevesAnnee.reduce((acc, curr) => acc + curr.fraisScolaritePayes, 0);
  const totalAttendu = elevesAnnee.reduce((acc, curr) => acc + curr.fraisScolariteTotal, 0);
  const pourcentagePaye = totalAttendu === 0 ? 0 : Math.round((totalRecettes / totalAttendu) * 100);

  // Répartition par statut
  const statuts = {
    Nouveaux: elevesAnnee.filter(e => e.statut === 'Nouveau').length,
    Passants: elevesAnnee.filter(e => e.statut === 'Passant').length,
    Redoublants: elevesAnnee.filter(e => e.statut === 'Redoublant').length,
    Examens: elevesAnnee.filter(e => e.statut === 'Candidat Examen').length,
  };

  return (
    <div className="p-6 md:p-10 max-w-7xl mx-auto space-y-8">
      
      {/* En-tête */}
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Bonjour, Directrice 👋</h1>
          <p className="text-gray-500 mt-1">Voici l&apos;état de l&apos;école aujourd&apos;hui.</p>
        </div>
        
        {/* Sélecteur d'année scolaire */}
        <button className="flex items-center gap-2 bg-white border border-gray-200 px-4 py-2.5 rounded-xl text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 w-fit">
          Année scolaire : <span className="font-bold text-primary-600">{annee}</span>
          <ChevronDown size={16} className="text-gray-400 ml-2" />
        </button>
      </header>

      {/* Cartes KPI */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatCard 
          title="Effectif Total" 
          value={totalEleves} 
          icon={<Users size={24} />}
          trendLabel={`${filles} filles • ${garcons} garçons`}
          color="primary"
        />
        <StatCard 
          title="Recettes perçues" 
          value={`${totalRecettes.toLocaleString('fr-FR')} F`} 
          icon={<Wallet size={24} />}
          trend={`${pourcentagePaye}%`}
          trendLabel={`Sur un total attendu de ${totalAttendu.toLocaleString('fr-FR')} F`}
          color="success"
        />
        <StatCard 
          title="Candidats Examens (CM2)" 
          value={statuts.Examens} 
          icon={<GraduationCap size={24} />}
          trendLabel="Préparation CEP"
          color="warning"
        />
      </div>

      {/* Répartition des flux d'élèves */}
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
        <h2 className="text-lg font-bold text-gray-900 mb-4">Flux des élèves cette année</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="p-4 bg-gray-50 rounded-xl">
            <p className="text-sm text-gray-500 mb-1">Nouveaux</p>
            <p className="text-xl font-bold text-blue-600">{statuts.Nouveaux}</p>
          </div>
          <div className="p-4 bg-gray-50 rounded-xl">
            <p className="text-sm text-gray-500 mb-1">Passants</p>
            <p className="text-xl font-bold text-emerald-600">{statuts.Passants}</p>
          </div>
          <div className="p-4 bg-gray-50 rounded-xl">
            <p className="text-sm text-gray-500 mb-1">Redoublants</p>
            <p className="text-xl font-bold text-amber-600">{statuts.Redoublants}</p>
          </div>
          <div className="p-4 bg-gray-50 rounded-xl">
            <p className="text-sm text-gray-500 mb-1">Transférés</p>
            <p className="text-xl font-bold text-gray-500">
              {elevesAnnee.filter(e => e.statut === 'Transféré').length}
            </p>
          </div>
        </div>
      </div>

      {/* Actions Rapides */}
      <div>
        <h2 className="text-lg font-bold text-gray-900 mb-4">Actions Rapides</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Link href="/eleves/nouveau" className="flex items-center justify-between p-5 bg-primary-600 hover:bg-primary-900 text-white rounded-2xl shadow-md transition-all group">
            <div className="flex items-center gap-4">
              <div className="p-2 bg-white/20 rounded-lg group-hover:scale-110 transition-transform">
                <UserPlus size={24} />
              </div>
              <div className="text-left">
                <p className="font-semibold">Inscrire un élève</p>
                <p className="text-sm text-primary-100">Nouveau ou passant</p>
              </div>
            </div>
          </Link>
          
          <Link href="/finances" className="flex items-center justify-between p-5 bg-white border border-gray-200 hover:border-gray-300 rounded-2xl shadow-sm transition-all group">
            <div className="flex items-center gap-4">
              <div className="p-2 bg-gray-50 rounded-lg group-hover:scale-110 transition-transform text-gray-600">
                <Wallet size={24} />
              </div>
              <div className="text-left">
                <p className="font-semibold text-gray-900">Enregistrer un paiement</p>
                <p className="text-sm text-gray-500">Frais de scolarité</p>
              </div>
            </div>
          </Link>
        </div>
      </div>

      <section>
        <h2 className="text-lg font-bold text-gray-900 mb-4">Suivi des examens (CM2)</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Card>
            <div className="flex justify-between items-center mb-2">
              <h3 className="font-semibold text-gray-700">Certificat d&apos;Études Primaires (CEP)</h3>
              <Badge variant="info">Session 2026</Badge>
            </div>
            <p className="text-2xl font-bold text-gray-900">{admisCEP} <span className="text-sm font-normal text-gray-500">/ {cm2.length} admis</span></p>
            <div className="mt-2 flex gap-2">
              <Badge variant="success">Admis: {admisCEP}</Badge>
              <Badge variant="warning">En attente: {cm2.filter(e => e.resultatCEP === 'En attente').length}</Badge>
            </div>
          </Card>
          
          <Card>
            <div className="flex justify-between items-center mb-2">
              <h3 className="font-semibold text-gray-700">Concours d&apos;entrée en 6ème</h3>
              <Badge variant="info">Session 2026</Badge>
            </div>
            <p className="text-2xl font-bold text-gray-900">{admisConcours} <span className="text-sm font-normal text-gray-500">/ {cm2.length} admis</span></p>
            <div className="mt-2 flex gap-2">
              <Badge variant="success">Admis: {admisConcours}</Badge>
              <Badge variant="warning">En attente: {cm2.filter(e => e.resultatConcours6e === 'En attente').length}</Badge>
            </div>
          </Card>
        </div>
      </section>

    </div>
  );
}