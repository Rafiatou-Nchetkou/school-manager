export type Teacher = {
  id: string;
  lastName: string;
  firstName: string;
  phone: string;
  email?: string;
  status: 'Fonctionnaire' | 'Contractuel';
  registrationNumber?: string;
};
