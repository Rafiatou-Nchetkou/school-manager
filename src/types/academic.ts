export type GradeLevel = 'SIL' | 'CP' | 'CE1' | 'CE2' | 'CM1' | 'CM2';

export type SchoolYear = {
  id: string;
  name: string;
  isActive: boolean;
};

export type Classroom = {
  id: string;
  gradeLevel: GradeLevel;
  schoolYearId: string;
  headTeacherId: string | null;
};