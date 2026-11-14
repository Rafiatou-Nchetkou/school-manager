import { Suspense } from 'react';
import Link from 'next/link';
import { UserPlus } from 'lucide-react';
import { schoolService } from '@/services/schoolService';
import { Button } from '@/components/ui/Button';
import { StudentFilters } from '@/components/students/StudentsFilters';
import { StudentTable } from '@/components/students/StudentTable';
import { StudentConfiguration } from '@/components/students/StudentConfiguration';
import { isDatabaseConfigured } from '@/lib/database';
import { listEnrolledStudents, listGradeLevels, listSchoolYears } from '@/lib/studentLifecycle';

type StudentListPageProps = {
  searchParams: Promise<{ schoolYear?: string; gradeLevel?: string; status?: string; incomplete?: string; search?: string; page?: string }>;
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
  const schoolYears = isDatabaseConfigured ? await listSchoolYears() : await schoolService.getSchoolYears();
  const gradeLevels = isDatabaseConfigured ? await listGradeLevels() : await schoolService.getGradeLevels();
  const activeSchoolYear = schoolYears.find(year => year.is_active)?.name ?? schoolYears[0]?.name ?? '2026-2027';
  const schoolYear = params.schoolYear || activeSchoolYear;
  const gradeLevel = params.gradeLevel || 'all';
  const status = params.status || 'all';
  const incompleteOnly = params.incomplete === 'true';
  const searchActuel = params.search || '';
  const pageActuelle = Number(params.page) || 1;

  // 2. On demande les données filtrées au serveur
  const { data, total, totalPages } = isDatabaseConfigured
    ? await listEnrolledStudents({ schoolYear, gradeLevel, status, incompleteOnly, search: searchActuel, page: pageActuelle, limit: 8 })
    : await schoolService.getFilteredStudents({ schoolYear, gradeLevel, status, incompleteOnly, search: searchActuel, page: pageActuelle });

  return (
    <div className="max-w-7xl mx-auto p-6 md:p-8 space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900 tracking-tight">Dossiers Élèves</h1>
          <p className="text-sm text-gray-500 mt-1">
            {total} élève(s) au total dans l&apos;établissement.
          </p>
        </div>
        <Link href="/eleves/nouveau">
          <Button variant="primary" className="gap-2 shadow-sm rounded-lg">
            <UserPlus size={16} /> Inscrire un élève
          </Button>
        </Link>
      </div>

      {/* Les filtres (Client Component qui met à jour l'URL) */}
      <StudentFilters schoolYears={schoolYears.map(year => year.name)} selectedSchoolYear={schoolYear} incompleteOnly={incompleteOnly} />
      <StudentConfiguration schoolYear={schoolYear} enabled={schoolService.hasPersistentStorage()} />

      {/* Le tableau (Server Component) */}
      <StudentTable
        students={data} 
        total={total} 
        totalPages={totalPages} 
        currentPage={pageActuelle}
        searchParams={params}
        allowReEnrollment={schoolService.hasPersistentStorage()}
        gradeLevels={gradeLevels.map(level => level.name)}
        schoolYears={schoolYears.map(year => year.name)}
      />
    </div>
  );
}