import * as bcrypt from 'bcrypt';
import { PrismaClient, Prisma, UserRole, Resource } from '@prisma/client';

import medicationsJson from './json/medications.json';
import articlesJson from './json/articles.json';
import { HOSPITALS } from './seed-data/hospitals';
import { PATIENTS } from './seed-data/patients';
import { RESOURCES, INDEPENDENT_RESOURCE_LIST } from './seed-data/resources';
import { HOSPITAL_ADMINS } from './seed-data/hospital-admins';
import { DOCTORS } from './seed-data/doctors';

// Map the data to data array to be used in createMany
const data = medicationsJson.drugbank.drug.map((drug) => ({
  code: drug['drugbank-id'][0],
  name: drug.name,
  description: drug.description,
}));

const prisma = new PrismaClient();

async function hashPassword(password: string): Promise<string> {
  return await bcrypt.hash(password, process.env.BCRYPT_SALT);
}

async function clearTables(): Promise<void> {
  await prisma.reminderPlanTime.deleteMany({});
  await prisma.reminderPlan.deleteMany({});
  await prisma.medicationPlan.deleteMany({});
  await prisma.article.deleteMany({});

  await prisma.hospitalAdminAccount.deleteMany({});
  await prisma.doctorAccount.deleteMany({});
  await prisma.operatorAccount.deleteMany({});
  await prisma.patientAccount.deleteMany({});
  await prisma.userAccount.deleteMany({});
  await prisma.hospital.deleteMany({});
  await prisma.patientAccount.deleteMany({});
  await prisma.userAccount.deleteMany({});
  await prisma.roleAccessesResource.deleteMany({});
  await prisma.role.deleteMany();
  await prisma.resource.deleteMany();
}

async function resetTableIndex(): Promise<void> {
  for (const resource of INDEPENDENT_RESOURCE_LIST) {
    await prisma.$queryRawUnsafe(`ALTER SEQUENCE ${resource}_id_seq RESTART`);
  }
}

async function populateResources(): Promise<Resource[]> {
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

  const articleIncludesAttachmentResource = await prisma.resource.create({
    data: {
      name: RESOURCES.articleIncludesAttachment,
      description: RESOURCES.articleIncludesAttachment,
    },
  });

  const attachmentResource = await prisma.resource.create({
    data: {
      name: RESOURCES.attachment,
      description: RESOURCES.attachment,
    },
  });

  return [
    resourceResource,
    roleAccessesResourceResource,
    roleResource,
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
    articleIncludesAttachmentResource,
    attachmentResource,
  ];
}

async function populateUserRoles(resources: Resource[]) {
  const [
    resourceResource,
    roleAccessesResourceResource,
    roleResource,
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
    articleIncludesAttachmentResource,
    attachmentResource,
  ] = resources;

  await prisma.role.create({
    data: {
      name: UserRole.ADMIN,
      description: UserRole.ADMIN,
      roleAccessesResources: {
        create: [
          ...[
            resourceResource,
            roleAccessesResourceResource,
            roleResource,
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
            articleIncludesAttachmentResource,
            attachmentResource,
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
      name: UserRole.HOSPITAL_ADMIN,
      description: UserRole.HOSPITAL_ADMIN,
      roleAccessesResources: {
        create: [
          ...[
            operatorAccountResource,
            doctorAccountResource,
            doctorManagesPatientResource,
            patientAccountResource,
            articleResource,
            patientSavesArticleResource,
            medicationPlanResource,
            reminderPlanResource,
            reminderPlanIncludesMedicationResource,
            articleIncludesAttachmentResource,
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
          ...[medicationResource, hospitalResource, attachmentResource].map(
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
      name: UserRole.DOCTOR,
      description: UserRole.DOCTOR,
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
      name: UserRole.PATIENT,
      description: UserRole.PATIENT,
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
  });
}

async function populateMedications() {
  await prisma.medication.createMany({
    data,
    skipDuplicates: true, // Skip duplicate entries
  });
}

async function populateHospitals() {
  await prisma.hospital.createMany({
    data: HOSPITALS,
    skipDuplicates: true,
  });
}

async function populatePatients() {
  PATIENTS.forEach(async (patient) => {
    await prisma.patientAccount.create({
      data: {
        phoneNumber: patient.phoneNumber,
        userAccount: {
          create: {
            passwordHash: await hashPassword(patient.password),
            role: { connect: { name: UserRole.PATIENT } },
          },
        },
      },
    });
  });
}

async function populateDoctors() {
  DOCTORS.forEach(async (doctor) => {
    await prisma.doctorAccount.create({
      data: {
        operatorAccount: {
          create: {
            username: doctor.username,
            hospital: { connect: { id: doctor.hospitalId } },
            userAccount: {
              create: {
                passwordHash: await hashPassword(doctor.password),
                role: { connect: { name: doctor.role } },
              },
            },
          },
        },
      },
    });
  });
}

async function populateHospitalAdmins() {
  HOSPITAL_ADMINS.forEach(async (hospitalAdmin) => {
    await prisma.hospitalAdminAccount.create({
      data: {
        operatorAccount: {
          create: {
            username: hospitalAdmin.username,
            hospital: {
              connect: { id: hospitalAdmin.hospitalId },
            },
            userAccount: {
              create: {
                passwordHash: await hashPassword(hospitalAdmin.password),
                role: {
                  connect: { name: hospitalAdmin.role },
                },
              },
            },
          },
        },
      },
    });
  });
}

async function populateArticles() {
  const articles = articlesJson as Prisma.ArticleCreateManyInput[];
  await prisma.article.createMany({
    data: articles,
    skipDuplicates: true,
  });
}

async function main() {
  await clearTables();
  await resetTableIndex();
  const resources = await populateResources();
  await populateUserRoles(resources);
  await populateMedications();
  await populateHospitals();
  await populatePatients();
  await populateHospitalAdmins();
  await populateDoctors();
  await populateArticles();
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
