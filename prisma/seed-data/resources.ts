export const DEPENDENT_RESOURCES = {
  roleAccessResource: 'role_accesses_resource',
  userAccountHasRole: 'user_account_has_role',
  operatorAccount: 'operator_account',
  hospitalAdminAccount: 'hospital_admin_account',
  doctorAccount: 'doctor_account',
  doctorManagesPatient: 'doctor_manages_patient',
  qualification: 'qualification',
  patientAccount: 'patient_account',
  patientSavesArticle: 'patient_saves_article',
  reminderPlanIncludesMedication: 'reminder_plan_includes_medication',
  articleIncludesAttachment: 'article_includes_attachment',
};

export const RESOURCES = {
  resource: 'resource',
  roleAccessResource: 'role_accesses_resource',
  role: 'role',
  userAccountHasRole: 'user_account_has_role',
  userAccount: 'user_account',
  operatorAccount: 'operator_account',
  hospitalAdminAccount: 'hospital_admin_account',
  doctorAccount: 'doctor_account',
  doctorManagesPatient: 'doctor_manages_patient',
  qualification: 'qualification',
  patientAccount: 'patient_account',
  article: 'article',
  patientSavesArticle: 'patient_saves_article',
  hospital: 'hospital',
  medicationPlan: 'medication_plan',
  reminderPlan: 'reminder_plan',
  reminderPlanIncludesMedication: 'reminder_plan_includes_medication',
  medication: 'medication',
  articleIncludesAttachment: 'article_includes_attachment',
  attachment: 'attachment'
};

export const RESOURCE_LIST = Object.values(RESOURCES);

export const DEPENDENT_RESOURCE_LIST = Object.values(DEPENDENT_RESOURCES);
