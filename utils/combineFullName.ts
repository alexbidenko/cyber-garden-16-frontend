import {UserType} from "~/types/base";

const letter = (name: string) => name ? `${name.slice(0, 1)}.` : ''

export default (user: UserType, short: boolean = false) => `${
  user.lastName || ''
} ${
  short ? letter(user.firstName || '') : (user.firstName || '')
}${short ? '' : ' '}${
  short ? letter(user.patronymic || '') : (user.patronymic || '')
}`.trim() || 'Безликий';
