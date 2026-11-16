export type Student = {
  id: string;
  registrationNumber: string;
  lastName: string;
  firstName: string;
  gender: 'M' | 'F';
  birthDate: string;
  previousSchool?: string;
  createdAt: string;
};

export type Guardian = {
  id: string;
  fullName: string;
  phone: string;
  secondaryPhone?: string;
};

export type EnrollmentStatus = 'Nouveau' | 'Passant' | 'Redoublant' | 'Transféré' | 'Candidat Examen';

export type Enrollment = {
  id: string;
  studentId: string;
  classroomId: string;
  schoolYearId: string;
  status: EnrollmentStatus;
  totalTuition: number;
  paidTuition: number;
  entryDate: string;
};