export default <T>(array: T[], callback: (item: T, list: T[]) => void) => {
  const selected = array[Math.floor(Math.random() * array.length)];
  callback(selected, array.filter((el) => el !== selected));
};
