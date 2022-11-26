export type UserType = {
  uuid: string;
  firstName: string;
  lastName: string;
  patronymic: string;
  avatar: string;
  email: string;
  grade: string;
  specialization: string;
  admin: boolean;
};

export enum Games {
  fullName = 'full-name',
  mapping = 'mapping',
}
