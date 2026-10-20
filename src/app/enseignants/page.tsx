import { Suspense } from 'react';
import Link from 'next/link';
import { UserPlus } from 'lucide-react';
import { schoolService } from '@/services/schoolService';
import { Button } from '@/components/ui/Button';
import { TeacherFilters } from '@/components/teachers/TeacherFilters';
import { TeacherTable } from '@/components/teachers/TeacherTable';

type TeacherListPageProps = {
  searchParams: Promise<{ search?: string; status?: string }>;
};

export default function TeacherListPage({ searchParams }: TeacherListPageProps) {
  return (
    <Suspense fallback={<div className="p-6 md:p-8">Chargement des enseignants...</div>}>
      <TeacherListContent searchParams={searchParams} />
    </Suspense>
  );
}

async function TeacherListContent({ searchParams }: TeacherListPageProps) {
  const params = await searchParams;
  const { data, total } = await schoolService.getFilteredTeachers({
    search: params.search || '',
    status: params.status || 'all',
  });

  return (
    <div className="max-w-7xl mx-auto p-6 md:p-8 space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900 tracking-tight">Corps Enseignant</h1>
          <p className="text-sm text-gray-500 mt-1">
            {total} enseignant(s) enregistré(s) dans l'école.
          </p>
        </div>
        <Link href="/enseignants/nouveau">
          <Button variant="primary" className="gap-2 shadow-sm rounded-lg">
            <UserPlus size={16} /> Nouvel enseignant
          </Button>
        </Link>
      </div>

        <TeacherFilters />
        <TeacherTable teachers={data} />
    </div>
  );
}