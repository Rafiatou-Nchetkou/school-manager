'use client';

import Link from 'next/link';
import { startTransition, useEffect, useState } from 'react';
import { schoolService } from '@/services/schoolService';
import { Student } from '@/types';

const formatMoney = (amount: number) => `${amount.toLocaleString('fr-FR')} FCFA`;

export default function FinancesPage() {
  const [eleves, setEleves] = useState<Student[]>([]);

  useEffect(() => {
    startTransition(() => setEleves(schoolService.getStudents()));
  }, []);

  const totalAttendu = eleves.reduce((total, eleve) => total + eleve.fraisScolariteTotal, 0);
  const totalPaye = eleves.reduce((total, eleve) => total + eleve.fraisScolaritePayes, 0);
  const resteAPayer = totalAttendu - totalPaye;

  return (
    <div className="mx-auto max-w-7xl space-y-6 p-6 pb-24 md:p-10">
      <header>
        <h1 className="text-2xl font-bold text-gray-900">Finances</h1>
        <p className="mt-1 text-gray-500">Suivi des frais de scolarité des élèves inscrits.</p>
      </header>

      <section className="grid gap-4 sm:grid-cols-3" aria-label="Résumé financier">
        <div className="rounded-lg border border-gray-200 bg-white p-5">
          <p className="text-sm text-gray-500">Montant attendu</p>
          <p className="mt-2 text-xl font-bold text-gray-900">{formatMoney(totalAttendu)}</p>
        </div>
        <div className="rounded-lg border border-gray-200 bg-white p-5">
          <p className="text-sm text-gray-500">Montant encaissé</p>
          <p className="mt-2 text-xl font-bold text-emerald-700">{formatMoney(totalPaye)}</p>
        </div>
        <div className="rounded-lg border border-gray-200 bg-white p-5">
          <p className="text-sm text-gray-500">Reste à payer</p>
          <p className="mt-2 text-xl font-bold text-amber-700">{formatMoney(resteAPayer)}</p>
        </div>
      </section>

      <section className="overflow-x-auto rounded-lg border border-gray-200 bg-white">
        <div className="flex items-center justify-between border-b border-gray-200 px-5 py-4">
          <h2 className="font-semibold text-gray-900">Paiements par élève</h2>
          <Link href="/eleves" className="text-sm font-medium text-primary-600 hover:text-primary-900">
            Voir les élèves
          </Link>
        </div>
        <table className="w-full min-w-[640px] text-left text-sm">
          <thead className="bg-gray-50 text-xs uppercase text-gray-500">
            <tr>
              <th className="px-5 py-3 font-medium">Élève</th>
              <th className="px-5 py-3 font-medium">Classe</th>
              <th className="px-5 py-3 font-medium">Payé</th>
              <th className="px-5 py-3 font-medium">Attendu</th>
              <th className="px-5 py-3 font-medium">Solde</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {eleves.map((eleve) => (
              <tr key={eleve.id} className="text-gray-700">
                <td className="whitespace-nowrap px-5 py-4 font-medium text-gray-900">{eleve.prenom} {eleve.nom}</td>
                <td className="px-5 py-4">{eleve.classe}</td>
                <td className="whitespace-nowrap px-5 py-4">{formatMoney(eleve.fraisScolaritePayes)}</td>
                <td className="whitespace-nowrap px-5 py-4">{formatMoney(eleve.fraisScolariteTotal)}</td>
                <td className="whitespace-nowrap px-5 py-4">{formatMoney(eleve.fraisScolariteTotal - eleve.fraisScolaritePayes)}</td>
              </tr>
            ))}
            {eleves.length === 0 && (
              <tr>
                <td colSpan={5} className="px-5 py-10 text-center text-gray-500">Aucune donnée financière à afficher.</td>
              </tr>
            )}
          </tbody>
        </table>
      </section>
    </div>
  );
}