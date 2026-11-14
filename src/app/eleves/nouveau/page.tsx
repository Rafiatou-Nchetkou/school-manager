import { Suspense } from 'react';
import { schoolService } from '@/services/schoolService';
import { NewStudentForm } from '@/components/students/NewStudentForm';
import { isDatabaseConfigured } from '@/lib/database';
import { listGradeLevels, listSchoolYears } from '@/lib/studentLifecycle';

type NewStudentPageProps = {
  searchParams: Promise<{ schoolYear?: string }>;
};

export default function NouvelElevePage({ searchParams }: NewStudentPageProps) {
  return (
    <Suspense fallback={<div className="p-6 md:p-10">Chargement du formulaire…</div>}>
      <NewStudentPageContent searchParams={searchParams} />
    </Suspense>
  );
}

async function NewStudentPageContent({ searchParams }: NewStudentPageProps) {
  const params = await searchParams;
  const schoolYears = isDatabaseConfigured ? await listSchoolYears() : await schoolService.getSchoolYears();
  const gradeLevels = isDatabaseConfigured ? await listGradeLevels() : await schoolService.getGradeLevels();
  const activeSchoolYear = schoolYears.find(year => year.is_active)?.name ?? schoolYears[0]?.name ?? '2026-2027';
  return (
    <NewStudentForm
      gradeLevels={gradeLevels.map(level => level.name)}
      schoolYear={params.schoolYear || activeSchoolYear}
    />
  );
}
