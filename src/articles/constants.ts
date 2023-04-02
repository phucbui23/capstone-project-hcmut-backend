import { Prisma } from '@prisma/client';

export const articleIncludeFields: Prisma.ArticleInclude = {
  hospital: false,
  patientSavesArticles: false,
  articleIncludesTags: false,
  _count: true,
};
