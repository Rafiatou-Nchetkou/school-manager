import { StaffReport } from '@/components/documents/EtatMiseEnPlace';

export default function RapportPersonnelPage() {
  return (
    <div className="p-6 md:p-10 max-w-7xl mx-auto">
      <div className="mb-6 print:hidden">
        <h1 className="text-2xl font-bold text-gray-900">État de mise en place du personnel</h1>
        <p className="text-gray-500 mt-1">
          Générez le document officiel à présenter à l'inspection. Cliquez sur le bouton pour l'imprimer ou le sauvegarder en PDF.
        </p>
      </div>

      <StaffReport />
    </div>
  );
}