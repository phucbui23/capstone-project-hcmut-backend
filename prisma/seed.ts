import { Prisma, PrismaClient, Resource, UserRole } from '@prisma/client';
import * as bcrypt from 'bcrypt';
import {
  collection,
  deleteDoc,
  doc,
  getDocs,
  query,
  setDoc,
} from 'firebase/firestore';
import { User } from 'src/decorator/user.decorator';
import { firestore } from './firebase';

import articlesJson from './json/articles.json';
import medicationsJson from './json/medications.json';
import { DOCTORS } from './seed-data/doctors';
import { HOSPITAL_ADMINS } from './seed-data/hospital-admins';
import { HOSPITALS } from './seed-data/hospitals';
import { PATIENTS } from './seed-data/patients';
import { INDEPENDENT_RESOURCE_LIST, RESOURCES } from './seed-data/resources';

interface FirebaseUser {
  id: string;
  displayName: string;
  phoneNumber: string;
  photoUrl: string;
  username: string;
  rooms: string[];
  role: UserRole;
}

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

async function findAllFirebaseUserIds() {
  const querySnapshot = await getDocs(query(collection(firestore, 'users')));
  const ids = [];
  querySnapshot.forEach((doc) => {
    ids.push(doc.id);
  });

  return ids;
}

async function clearTables(): Promise<void> {
  // Remove all firebase users
  const firebaseUserIds = await findAllFirebaseUserIds();
  for (const firebaseUserId of firebaseUserIds) {
    await deleteDoc(doc(firestore, 'users', firebaseUserId));
  }

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
  for (const patient of PATIENTS) {
    const patientAccount = await prisma.patientAccount.create({
      data: {
        phoneNumber: patient.phoneNumber,
        userAccount: {
          create: {
            passwordHash: await hashPassword(patient.password),
            role: {
              connect: {
                name: UserRole.PATIENT,
              },
            },
          },
        },
      },
    });

    const userAccount = await prisma.userAccount.findUnique({
      where: { id: patientAccount.userAccountId },
    });

    const firebaseUser: FirebaseUser = {
      id: userAccount.code,
      displayName: `${userAccount.firstName}` + ' ' + `${userAccount.lastName}`,
      phoneNumber: patientAccount.phoneNumber,
      photoUrl: '',
      username: '',
      rooms: [],
      role: UserRole.PATIENT,
    };

    await setDoc(
      doc(collection(firestore, 'users'), userAccount.code),
      firebaseUser,
    );
  }
}

async function populateDoctors() {
  for (const doctor of DOCTORS) {
    const numOfUser = (await prisma.userAccount.count({})) + 1;
    const username =
      `${doctor.firstName}.${doctor.lastName}.${numOfUser}`.replace(/\s+/g, '');

    const doctorAccount = await prisma.doctorAccount.create({
      data: {
        operatorAccount: {
          create: {
            username,
            hospital: { connect: { id: doctor.hospitalId } },
            userAccount: {
              create: {
                firstName: doctor.firstName,
                lastName: doctor.lastName,
                passwordHash: await hashPassword(
                  process.env.DOCTOR_PASSWORD || '123456',
                ),
                role: { connect: { name: doctor.role } },
              },
            },
          },
        },
      },
    });

    const userAccount = await prisma.userAccount.findUnique({
      where: { id: doctorAccount.operatorAccountId },
    });

    const firebaseUser: FirebaseUser = {
      username,
      id: userAccount.code,
      displayName: `${userAccount.firstName.trim()} ${userAccount.lastName.trim()}`,
      phoneNumber: '',
      photoUrl: '',
      rooms: [],
      role: UserRole.DOCTOR,
    };

    await setDoc(
      doc(collection(firestore, 'users'), userAccount.code),
      firebaseUser,
    );
  }
}

async function populateHospitalAdmins() {
  for (const hospitalAdmin of HOSPITAL_ADMINS) {
    const numOfUser = (await prisma.userAccount.count({})) + 1;
    const username =
      `${hospitalAdmin.firstName}.${hospitalAdmin.lastName}.${numOfUser}`.replace(
        /\s+/g,
        '',
      );

    const hospitalAdminAccount = await prisma.hospitalAdminAccount.create({
      data: {
        operatorAccount: {
          create: {
            username,
            hospital: {
              connect: { id: hospitalAdmin.hospitalId },
            },
            userAccount: {
              create: {
                firstName: hospitalAdmin.firstName,
                lastName: hospitalAdmin.lastName,
                passwordHash: await hashPassword(
                  process.env.HOSPITAL_ADMIN_PASSWORD || '123456',
                ),
                role: {
                  connect: { name: hospitalAdmin.role },
                },
              },
            },
          },
        },
      },
    });

    const userAccount = await prisma.userAccount.findUnique({
      where: { id: hospitalAdminAccount.operatorAccountId },
    });

    const firebaseUser: FirebaseUser = {
      username,
      id: userAccount.code,
      displayName: `${userAccount.firstName.trim()} ${userAccount.lastName.trim()}`,
      phoneNumber: '',
      photoUrl: '',
      rooms: [],
      role: UserRole.HOSPITAL_ADMIN,
    };

    await setDoc(
      doc(collection(firestore, 'users'), userAccount.code),
      firebaseUser,
    );
  }
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
