export type Teacher = {
  id: string;
  lastName: string;
  firstName: string;
  phone: string;
  status: 'Fonctionnaire' | 'Contractuel';
  registrationNumber?: string;
};