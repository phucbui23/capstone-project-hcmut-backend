import { PrismaClient, Prisma } from '@prisma/client';

import res from './sample_medication.json';
import {
  RESOURCES,
  RESOURCE_LIST,
  DEPENDENT_RESOURCE_LIST,
} from './seed-data/resources';
import { ROLES } from './seed-data/roles';

//Map the data to data array to be used in createMany
const data = res.drugbank.drug.map((drug) => ({
  code : drug['drugbank-id'][0],
  name : drug.name,
  description : drug.description,
}));

const prisma = new PrismaClient();

async function main() {
  await prisma.roleAccessesResource.deleteMany({});
  await prisma.role.deleteMany();
  await prisma.resource.deleteMany();
  // To reset the index of sequence primary keys of entities to 1
  RESOURCE_LIST.filter(
    (resource: string) => !DEPENDENT_RESOURCE_LIST.includes(resource),
  ).forEach(
    async (resource: string) =>
      await prisma.$queryRawUnsafe(`ALTER SEQUENCE ${resource}_id_seq RESTART`),
  );
  // Initialize resources
  const resourceResource = await prisma.resource.create({
    data: {
      name: RESOURCES.resource,
      description: RESOURCES.resource,
    },
  });

  const roleAccessesResourceResource = await prisma.resource.create({
    data: {
      name: RESOURCES.roleAccessResource,
      description: RESOURCES.roleAccessResource,
    },
  });

  const roleResource = await prisma.resource.create({
    data: {
      name: RESOURCES.role,
      description: RESOURCES.role,
    },
  });

  const userAccountHasRoleResource = await prisma.resource.create({
    data: {
      name: RESOURCES.userAccountHasRole,
      description: RESOURCES.userAccountHasRole,
    },
  });

  const userAccountResource = await prisma.resource.create({
    data: {
      name: RESOURCES.userAccount,
      description: RESOURCES.userAccount,
    },
  });

  const operatorAccountResource = await prisma.resource.create({
    data: {
      name: RESOURCES.operatorAccount,
      description: RESOURCES.operatorAccount,
    },
  });

  const hospitalAdminAccountResource = await prisma.resource.create({
    data: {
      name: RESOURCES.hospitalAdminAccount,
      description: RESOURCES.hospitalAdminAccount,
    },
  });

  const doctorAccountResource = await prisma.resource.create({
    data: {
      name: RESOURCES.doctorAccount,
      description: RESOURCES.doctorAccount,
    },
  });

  const doctorManagesPatientResource = await prisma.resource.create({
    data: {
      name: RESOURCES.doctorManagesPatient,
      description: RESOURCES.doctorManagesPatient,
    },
  });

  const patientAccountResource = await prisma.resource.create({
    data: {
      name: RESOURCES.patientAccount,
      description: RESOURCES.patientAccount,
    },
  });

  const articleResource = await prisma.resource.create({
    data: {
      name: RESOURCES.article,
      description: RESOURCES.article,
    },
  });

  const patientSavesArticleResource = await prisma.resource.create({
    data: {
      name: RESOURCES.patientSavesArticle,
      description: RESOURCES.patientSavesArticle,
    },
  });

  const hospitalResource = await prisma.resource.create({
    data: {
      name: RESOURCES.hospital,
      description: RESOURCES.hospital,
    },
  });

  const medicationPlanResource = await prisma.resource.create({
    data: {
      name: RESOURCES.medicationPlan,
      description: RESOURCES.medicationPlan,
    },
  });

  const reminderPlanResource = await prisma.resource.create({
    data: {
      name: RESOURCES.reminderPlan,
      description: RESOURCES.reminderPlan,
    },
  });

  const reminderPlanIncludesMedicationResource = await prisma.resource.create({
    data: {
      name: RESOURCES.reminderPlanIncludesMedication,
      description: RESOURCES.reminderPlanIncludesMedication,
    },
  });

  const medicationResource = await prisma.resource.create({
    data: {
      name: RESOURCES.medication,
      description: RESOURCES.medication,
    },
  });
  // Initialize RBAC model for specific type of users
  await prisma.role.create({
    data: {
      name: ROLES.admin,
      description: ROLES.admin,
      roleAccessesResources: {
        create: [
          ...[
            resourceResource,
            roleAccessesResourceResource,
            roleResource,
            userAccountHasRoleResource,
            userAccountResource,
            operatorAccountResource,
            hospitalAdminAccountResource,
            doctorAccountResource,
            doctorManagesPatientResource,
            patientAccountResource,
            articleResource,
            patientSavesArticleResource,
            hospitalResource,
            medicationPlanResource,
            reminderPlanResource,
            reminderPlanIncludesMedicationResource,
            medicationResource,
          ].map(
            (resource): Prisma.RoleAccessesResourceCreateWithoutRoleInput => ({
              canAdd: true,
              canDelete: true,
              canEdit: true,
              canView: true,
              resource: {
                connect: {
                  id: resource.id,
                },
              },
            }),
          ),
        ],
      },
    },
  });
  await prisma.role.create({
    data: {
      name: ROLES.hospitalAdmin,
      description: ROLES.hospitalAdmin,
      roleAccessesResources: {
        create: [
          ...[
            userAccountHasRoleResource,
            operatorAccountResource,
            doctorAccountResource,
            doctorManagesPatientResource,
            patientAccountResource,
            articleResource,
            patientSavesArticleResource,
            medicationPlanResource,
            reminderPlanResource,
            reminderPlanIncludesMedicationResource,
          ].map(
            (resource): Prisma.RoleAccessesResourceCreateWithoutRoleInput => ({
              canAdd: true,
              canDelete: true,
              canEdit: true,
              canView: true,
              resource: {
                connect: {
                  id: resource.id,
                },
              },
            }),
          ),
          ...[medicationResource, hospitalResource].map(
            (resource): Prisma.RoleAccessesResourceCreateWithoutRoleInput => ({
              canAdd: false,
              canDelete: false,
              canEdit: false,
              canView: true,
              resource: {
                connect: {
                  id: resource.id,
                },
              },
            }),
          ),
        ],
      },
    },
  });
  await prisma.role.create({
    data: {
      name: ROLES.doctor,
      description: ROLES.doctor,
      roleAccessesResources: {
        create: [
          ...[
            doctorManagesPatientResource,
            medicationPlanResource,
            reminderPlanResource,
            reminderPlanIncludesMedicationResource,
          ].map(
            (resource): Prisma.RoleAccessesResourceCreateWithoutRoleInput => ({
              canAdd: true,
              canDelete: true,
              canEdit: true,
              canView: true,
              resource: {
                connect: {
                  id: resource.id,
                },
              },
            }),
          ),
          ...[
            patientAccountResource,
            articleResource,
            patientSavesArticleResource,
            medicationResource,
          ].map(
            (resource): Prisma.RoleAccessesResourceCreateWithoutRoleInput => ({
              canAdd: false,
              canDelete: false,
              canEdit: false,
              canView: true,
              resource: {
                connect: {
                  id: resource.id,
                },
              },
            }),
          ),
        ],
      },
    },
  });
  await prisma.role.create({
    data: {
      name: ROLES.patient,
      description: ROLES.patient,
      roleAccessesResources: {
        create: [
          ...[
            medicationPlanResource,
            reminderPlanResource,
            reminderPlanIncludesMedicationResource,
            patientSavesArticleResource,
          ].map(
            (resource): Prisma.RoleAccessesResourceCreateWithoutRoleInput => ({
              canAdd: true,
              canDelete: true,
              canEdit: true,
              canView: true,
              resource: {
                connect: {
                  id: resource.id,
                },
              },
            }),
          ),
          ...[articleResource, medicationResource].map(
            (resource): Prisma.RoleAccessesResourceCreateWithoutRoleInput => ({
              canAdd: false,
              canDelete: false,
              canEdit: false,
              canView: true,
              resource: {
                connect: {
                  id: resource.id,
                },
              },
            }),
          ),
        ],
      },
    },
  })
  
  await prisma.medication.createMany({
    data,
    skipDuplicates: true, // Skip duplicate entries
  });
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
