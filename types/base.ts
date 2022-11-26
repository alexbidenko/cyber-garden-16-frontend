export type DepartmentType = {
  chief: UserType;
  chief_id: number;
  chief_name: string;
  id: number;
  title: string;
  members: UserType[];
}

export type UserType = {
  uuid: string;
  firstName: string;
  lastName: string;
  patronymic: string;
  avatar: string;
  email: string;
  grade: string;
  specialization: string;
  fact1: string;
  admin: boolean;
  department: DepartmentType;
};

export type ProductType = {
  id: number,
  title: string,
  icons: string,
  price: number,
  inStock: boolean,
};

export type WinCardType = {
  person: UserType;
  owner: UserType;
}

export enum Games {
  fullName = 'full-name',
  mapping = 'mapping',
  excluding = 'excluding',
  swiper = 'swiper',
}
