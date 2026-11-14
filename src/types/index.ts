export type GradeLevel = string;

export type StudentStatus = 
  | 'Nouveau' 
  | 'Passant' 
  | 'Redoublant' 
  | 'Transféré' 
  | 'Candidat Examen'
  | 'Incomplet';

export type ExamResult = 'En attente' | 'Admis' | 'Ajourné' | 'Absent';

export type Student = {
  id: string;
  matricule: string;
  nom: string;
  prenom: string;
  sexe: 'M' | 'F' | null;
  dateNaissance: string;
  tuteurNom: string;
  tuteurTelephone: string;
  dateInscription: string;
  anneeScolaire: string;
  classe: GradeLevel;
  statut: StudentStatus;
  fraisScolariteTotal: number;
  fraisScolaritePayes: number;
  ecolePrecedente?: string;
  resultatCEP?: ExamResult;
  resultatConcours6e?: ExamResult;
  fraisExamenPayes?: boolean;
  isIncomplete?: boolean;
};

export type StaffRecord = {
  id: string;
  nomPrenom: string;
  sexe: 'M' | 'F';
  dateLieuNaissance: string;
  matricule: string;
  statut: 'Fonctionnaire' | 'Contractuel' | 'Stagiaire';
  categorie: string;
  diplome: string;
  anneeDiplome: string;
  fonction: string;
  classeTenue: string;
  numeroDecision: string;
  dateEntree: string;
  fonctionOrigine: string;
  avancement: string;
  contact: string;
};

export type Teacher = {
  id: string;
  nom: string;
  prenom: string;
  telephone: string;
  statut: 'Fonctionnaire' | 'Contractuel';
  matricule?: string;
};

export type Classroom = {
  id: string;
  nom: GradeLevel;
  anneeScolaire: string;
  enseignantTitulaireId: string | null;
};
