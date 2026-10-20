import { Classroom, Student, Teacher } from '@/types';

// On crée des données de test (Mock) pour que le dashboard soit joli dès le départ
const MOCK_STUDENTS: Student[] = [
  { id: '1', matricule: '2026-CM2-001', nom: 'NKOMO', prenom: 'Jean', sexe: 'M', dateNaissance: '2014-05-12', tuteurNom: 'M. Nkomo', tuteurTelephone: '699000000', dateInscription: '2025-09-01', anneeScolaire: '2026-2027', classe: 'CM2', statut: 'Candidat Examen', fraisScolariteTotal: 15000, fraisScolaritePayes: 15000 },
  { id: '2', matricule: '2026-SIL-002', nom: 'MBALLA', prenom: 'Marie', sexe: 'F', dateNaissance: '2018-11-20', tuteurNom: 'Mme Mbala', tuteurTelephone: '677000000', dateInscription: '2026-09-02', anneeScolaire: '2026-2027', classe: 'SIL', statut: 'Nouveau', fraisScolariteTotal: 10000, fraisScolaritePayes: 5000 },
  { id: '3', matricule: '2026-CE1-003', nom: 'TCHOUTA', prenom: 'Paul', sexe: 'M', dateNaissance: '2016-03-15', tuteurNom: 'M. Tchouta', tuteurTelephone: '655000000', dateInscription: '2025-09-01', anneeScolaire: '2026-2027', classe: 'CE1', statut: 'Redoublant', fraisScolariteTotal: 12000, fraisScolaritePayes: 12000 },
  { id: '4', matricule: '2026-CP-004', nom: 'ABENA', prenom: 'Sarah', sexe: 'F', dateNaissance: '2017-08-05', tuteurNom: 'Mme Abena', tuteurTelephone: '699111111', dateInscription: '2026-09-05', anneeScolaire: '2026-2027', classe: 'CP', statut: 'Nouveau', fraisScolariteTotal: 10000, fraisScolaritePayes: 0 },
];

export const MOCK_TEACHERS: Teacher[] = [
  { id: 'e1', nom: 'NKOMBI', prenom: 'Marie Paule', telephone: '676161616', statut: 'Fonctionnaire', matricule: '253136' },
  { id: 'e2', nom: 'NGO BEC', prenom: 'Marthe', telephone: '699161616', statut: 'Fonctionnaire', matricule: '415191' },
  { id: 'e3', nom: 'FOUDA', prenom: 'Laurentine', telephone: '699474747', statut: 'Contractuel' },
];

export const MOCK_CLASSROOMS: Classroom[] = [
  { id: 'c1', nom: 'SIL', anneeScolaire: '2026-2027', enseignantTitulaireId: 'e1' },
  { id: 'c2', nom: 'CP', anneeScolaire: '2026-2027', enseignantTitulaireId: 'e2' },
  { id: 'c3', nom: 'CE1', anneeScolaire: '2026-2027', enseignantTitulaireId: null },
  { id: 'c4', nom: 'CM2', anneeScolaire: '2026-2027', enseignantTitulaireId: 'e3' },
];

export const schoolService = {
  getStudents: (): Student[] => MOCK_STUDENTS,

  addStudent: (student: Omit<Student, 'id' | 'matricule'>): Student => {
    const newStudent: Student = {
      ...student,
      id: crypto.randomUUID(),
      matricule: `${student.anneeScolaire.slice(0, 4)}-${student.classe}-${String(MOCK_STUDENTS.length + 1).padStart(3, '0')}`,
    };
    MOCK_STUDENTS.push(newStudent);
    return newStudent;
  },

  getFilteredStudents: async ({
    gradeLevel,
    status,
    search,
    page = 1,
    limit = 8
  }: {
    gradeLevel?: string;
    status?: string;
    search?: string;
    page?: number;
    limit?: number;
  }) => {
    let result = MOCK_STUDENTS; // Ici, on fera un appel Supabase plus tard

    // Filtrage
    if (gradeLevel && gradeLevel !== 'all') result = result.filter(student => student.classe === gradeLevel);
    if (status && status !== 'all') result = result.filter(student => student.statut === status);
    if (search) {
      const s = search.toLowerCase();
      result = result.filter(student =>
        student.nom.toLowerCase().includes(s) ||
        student.prenom.toLowerCase().includes(s) ||
        student.matricule.toLowerCase().includes(s)
      );
    }

    // Pagination
    const total = result.length;
    const start = (page - 1) * limit;
    const data = result.slice(start, start + limit);

    return { data, total, totalPages: Math.ceil(total / limit) };
  },

  getClassrooms: async (): Promise<(Classroom & { teacher?: Teacher; studentCount: number })[]> => {
    return MOCK_CLASSROOMS.map(classroom => {
      const teacher = MOCK_TEACHERS.find(item => item.id === classroom.enseignantTitulaireId);
      const studentCount = MOCK_STUDENTS.filter(student => student.classe === classroom.nom).length;
      return { ...classroom, teacher, studentCount };
    });
  },

    // ... (previous getFilteredStudents and getClassrooms functions)

  getFilteredTeachers: async ({ search, status }: { search?: string; status?: string }) => {
    let result = MOCK_TEACHERS;

    if (status && status !== 'all') {
      result = result.filter(teacher => teacher.statut === status);
    }

    if (search) {
      const s = search.toLowerCase();
      result = result.filter(teacher =>
        teacher.nom.toLowerCase().includes(s) ||
        teacher.prenom.toLowerCase().includes(s) ||
        teacher.matricule?.toLowerCase().includes(s)
      );
    }

    // On joint la classe tenue par l'enseignant
    const data = result.map(teacher => {
      const assignedClass = MOCK_CLASSROOMS.find(classroom => classroom.enseignantTitulaireId === teacher.id);
      return { ...teacher, className: assignedClass ? assignedClass.nom : null };
    });

    return { data, total: data.length };
  },

  addTeacher: async (teacher: Omit<Teacher, 'id'>) => {
    // Simulation d'ajout dans la "base de données"
    const newTeacher = { ...teacher, id: crypto.randomUUID() };
    MOCK_TEACHERS.push(newTeacher);
    return newTeacher;
  },

  assignClassTeacher: async (classroomId: string, teacherId: string | null) => {
    const classroom = MOCK_CLASSROOMS.find(item => item.id === classroomId);
    if (classroom) {
      classroom.enseignantTitulaireId = teacherId;
    }
    return { success: true };
  },

};