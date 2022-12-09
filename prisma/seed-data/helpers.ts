import * as fs from 'fs';

export const capitalizeFirstLetter = (word: string): string => {
  return `${word.charAt(0).toUpperCase()}${word.slice(1)}`;
};

export const writeJSONFile = (filename: string, data: any): void => {
  fs.writeFileSync(`prisma/data/${filename}`, JSON.stringify(data, null, 2));
};
