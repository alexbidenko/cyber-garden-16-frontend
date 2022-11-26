import {UserType} from "~/types/base";

export default (user: UserType) => `${user.lastName || ''} ${user.firstName || ''} ${user.patronymic || ''}`.trim() || 'Безликий';
