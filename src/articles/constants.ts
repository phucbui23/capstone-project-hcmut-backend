import { Prisma } from '@prisma/client';

export const articleIncludeFields: Prisma.ArticleInclude = {
  hospital: false,
  patientSavesArticles: false,
  articleIncludesTags: {
    select: {
      tag: {
        select: {
          id: true,
          name: true,
        },
      },
    },
  },
  attachment: {
    select: {
      filePath: true,
    },
  },
  _count: true,
};
