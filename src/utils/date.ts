export const getDateAndTime = (str: string): [number, number] => {
  const [hour, minutes, ...rest] = str
    .split(':')
    .map((amount) => parseInt(amount));

  return [hour, minutes];
};
