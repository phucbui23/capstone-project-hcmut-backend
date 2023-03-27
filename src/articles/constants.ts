import { Prisma } from '@prisma/client';

export const articleIncludeFields: Prisma.ArticleInclude = {
  hospital: false,
  patientSavesArticles: false,
  articleIncludesTags: false,
  articleIncludesAttachments: false,
  _count: true,
};
