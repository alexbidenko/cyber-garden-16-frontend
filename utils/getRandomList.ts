import getRandomAndExclude from "~/utils/getRandomAndExclude";

export default <T extends object>(array: T[], count: number): T[] => {
  const data: T[] = [];
  for (let i = 0; i < count; i++) {
    let u = {} as T;
    getRandomAndExclude(array, (item, list) => {
      u = item;
      array = list;
    });
    data.push(u);
  }
  return data;
};
