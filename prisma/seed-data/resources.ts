import { Resource, PrismaClient, Prisma } from '@prisma/client';

import { capitalizeFirstLetter } from './helpers';

export const RESOURCES = [
  'resource',
  'role_accesses_resource',
  'role',
  'user_account_has_role',
  'user_account',
  'operator_account',
  'hospital_admin_account',
  'doctor_account',
  'doctor_manages_patient',
  'qualification',
  'patient_account',
  'article',
  'patient_saves_article',
  'hospital',
  'medication_plan',
  'reminder_plan',
  'reminder_plan_includes_medication',
  'medication',
];

const createResourceList = (): Prisma.ResourceCreateManyInput[] => {
  const resourcesCreateManyInput = RESOURCES.map((resource) => {
    const words = resource.split('_');
    words[0] = capitalizeFirstLetter(words[0]);

    const resourceCreateManyInput: Prisma.ResourceCreateManyInput = {
      name: resource,
      description: words.concat('information').join(' '),
    };

    return resourceCreateManyInput;
  });

  return resourcesCreateManyInput;
};

export const resources: Prisma.ResourceCreateInput[] = createResourceList();
