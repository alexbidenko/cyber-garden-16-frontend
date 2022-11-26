import {request, toSnakeCase} from "#imports";
import {UserType} from "~/types/base";

type ParametersType = {
  order?: 'random',
  not_empty?: (keyof UserType)[],
  uuid_to_exclude?: string[],
  limit_of_set?: number,
  page?: number,
  first_name?: string,
  introduced?: number,
  not_introduced?: number,
};

export default async ({not_empty, uuid_to_exclude, introduced, not_introduced, ...parameters}: ParametersType): Promise<UserType[]> => {
  let users: UserType[] = [];
  const get = (p: { introduced?: boolean, not_introduced?: boolean } & Pick<ParametersType, 'limit_of_set'> = {}) => {
    return request.get<UserType[]>('user/list_of_users_filter/', {
      params: {
        ...parameters,
        ...p,
        not_empty: not_empty?.map((el) => toSnakeCase(el)).join(','),
      },
    });
  }
  if (!introduced && !not_introduced) return get();
  users = users.concat(await get({ introduced: true, limit_of_set: introduced || 0 }));
  users = users.concat(await get({ not_introduced: true, limit_of_set: (not_introduced || 0) + (introduced || 0) - users.length }));
  if ((not_introduced || 0) + (introduced || 0) > users.length) {
    users = users.concat(await get({ introduced: true, limit_of_set: (not_introduced || 0) + (introduced || 0) - users.length }));
  }
  return users;
};
