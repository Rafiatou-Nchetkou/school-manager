import { Suspense } from 'react';
import Link from 'next/link';
import { UserPlus } from 'lucide-react';
import { schoolService } from '@/services/schoolService';
import { Button } from '@/components/ui/Button';
import { StudentFilters } from '@/components/students/StudentsFilters';
import { StudentTable } from '@/components/students/StudentTable';

type StudentListPageProps = {
  searchParams: Promise<{ gradeLevel?: string; status?: string; search?: string; page?: string }>;
};

export default function StudentListPage({ searchParams }: StudentListPageProps) {
  return (
    <Suspense fallback={<div className="p-6 md:p-8">Chargement des élèves...</div>}>
      <StudentListContent searchParams={searchParams} />
    </Suspense>
  );
}

async function StudentListContent({ searchParams }: StudentListPageProps) {
  // 1. On récupère les paramètres de l'URL
  const params = await searchParams;
  const gradeLevel = params.gradeLevel || 'all';
  const status = params.status || 'all';
  const searchActuel = params.search || '';
  const pageActuelle = Number(params.page) || 1;

  // 2. On demande les données filtrées au serveur
  const { data, total, totalPages } = await schoolService.getFilteredStudents({
    gradeLevel,
    status,
    search: searchActuel,
    page: pageActuelle,
  });

  return (
    <div className="max-w-7xl mx-auto p-6 md:p-8 space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900 tracking-tight">Dossiers Élèves</h1>
          <p className="text-sm text-gray-500 mt-1">
            {total} élève(s) au total dans l'établissement.
          </p>
        </div>
        <Link href="/eleves/nouveau">
          <Button variant="primary" className="gap-2 shadow-sm rounded-lg">
            <UserPlus size={16} /> Inscrire un élève
          </Button>
        </Link>
      </div>

      {/* Les filtres (Client Component qui met à jour l'URL) */}
      <StudentFilters />

      {/* Le tableau (Server Component) */}
      <StudentTable
        students={data} 
        total={total} 
        totalPages={totalPages} 
        currentPage={pageActuelle}
        searchParams={params}
      />
    </div>
  );
}