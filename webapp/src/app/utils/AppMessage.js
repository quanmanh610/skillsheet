export const Messages = {
  // Messeage type
  SUCCESS: 'success',
  ERROR: 'error',
  INFO: 'info',
  WARNING: 'warning',

  // Confirm delete?
  DELETE_CONFIRM: 'Are you sure to delete?',
  ACTIVE_CONFIRM: 'Are you sure to activate all?',
  UPDATE_REQUEST_CONFIRM: 'Are you sure to send emails to all staffs to request to update profile?',
  RESENDALL_CONFIRM: 'Are you sure resend all?',
  ACTIVE_EMAIL_CONFIRM: 'Are you sure to activate the email setting?',

  //
  activeAllSuccessMessage: (param) => {
    return `All ${param} has been activated successfully.`;
  },

  addSuccessMessage: (param) => {
    return `${param} has been added successfully.`;
  },
  editSuccessMessage: (param) => {
    return `${param} has been edited successfully.`;
  },
  deleteSuccessMessage: (param) => {
    return `${param} has been deleted successfully.`;
  },
  activeAllSUnsuccessMessage: (param) => {
    return `All ${param} has been activated unsuccessfully.`;
  },
  addUnsuccessMessage: (param) => {
    return `${param} has been added unsuccessfully.`;
  },
  editUnsuccessMessage: (param) => {
    return `${param} has been edited unsuccessfully.`;
  },
  deleteUnsuccessMessage: (param) => {
    return `${param} has been deleted unsuccessfully.`;
  },
  existingMessage: (param) => {
    return `${param} existed.`;
  },
  requiredMessage: (param) => {
    return `${param} is required.`;
  },

  requiredMessage2: (param) => {
    return `${param} is required.`;
  },

  // messages for Channel Setting
  DELETE_CHANNEL_SUCCESS: 'Channel has deleted successfully.',
  DELETE_CHANNEL_UNSUCCESS: 'Channel has deleted unsuccessfully.',

  // messages for Project Role Setting
  ADD_PROJECTROLE_SUCCESS: 'ProjectRole has added successfully.',
  EDIT_PROJECTROLE_SUCCESS: 'ProjectRole has edited successfully.',
  DELETE_PROJECTROLE_SUCCESS: 'ProjectRole has deleted successfully.',
  ADD_PROJECTROLE_UNSUCCESS: 'ProjectRole has added unsuccessfully.',
  EDIT_PROJECTROLE_UNSUCCESS: 'ProjectRole has edited unsuccessfully.',
  DELETE_PROJECTROLE_UNSUCCESS: 'ProjectRole has deleted unsuccessfully.',
  PROJECTROLE_EXISTING: 'ProjectRole existed.',
  PROJECTROLE_NAME_NOT_BE_EMPTY: 'ProjectRole name can not be empty.',
  PROJECTROLE_NAME_REQUIRE: 'Project role name is required.',
  PROJECTROLE_EXISTING_COMMA: 'Project role name cannot contain comma characters.',

  // messages for Email Setting
  ADD_EMAIL_SUCCESS: 'Email Setting has added successfully.',
  EDIT_EMAIL_SUCCESS: 'Email Setting has edited successfully.',
  DELETE_EMAIL_SUCCESS: 'Email Setting has deleted successfully.',
  ADD_EMAIL_UNSUCCESS: 'Email Setting has added unsuccessfully.',
  EDIT_EMAIL_UNSUCCESS: 'Email Setting has edited unsuccessfully.',
  DELETE_EMAIL_UNSUCCESS: 'Email Setting has deleted unsuccessfully.',
  UPDATE_REQUEST_EMAIL_SUCCESS: 'Update request email has been sended successfully.',
  UPDATE_REQUEST_EMAIL_UNSUCCESS: 'Send update request email unsuccessfully.',
  UPDATE_REQUEST_EMAIL_INACTIVE_STATUS: 'Email setting is inactive. You need to activate the email setting to send request to staffs.',

  // messages for Skill Setting
  ADD_SKILL_SUCCESS: 'Skill has added successfully.',
  EDIT_SKILL_SUCCESS: 'Skill has edited successfully.',
  DELETE_SKILL_SUCCESS: 'Skill has deleted successfully.',
  ADD_SKILL_UNSUCCESS: 'Skill has added unsuccessfully.',
  EDIT_SKILL_UNSUCCESS: 'Skill has edited unsuccessfully.',
  DELETE_SKILL_UNSUCCESS: 'Skill has deleted unsuccessfully.',
  SKILL_CATEGORY_NAME_REQUIRE: 'Category is required.',
  SKILL_SKILL_NAME_REQUIRE: 'Skill name is required.',
  SKILL_SKILL_EXISTING: 'Skill name existed.',
  SKILL_EXISTING_COMMA: 'Skill name cannot contain comma characters.',
  SKILL_CATEGORY_VALIDATE_MAX_LENGTH: 'Skill category cannot contain more than 100 characters.',
  SKILL_NAME_VALIDATE_MAX_LENGTH: 'Skill category cannot contain more than 100 characters.',

  // messages for Certificate Setting
  ADD_CERTIFICATE_SUCCESS: 'Certificate has added successfully.',
  EDIT_CERTIFICATE_SUCCESS: 'Certificate has edited successfully.',
  DELETE_CERTIFICATE_SUCCESS: 'Certificate has deleted successfully.',
  ADD_CERTIFICATE_UNSUCCESS: 'Certificate has added unsuccessfully.',
  EDIT_CERTIFICATE_FAIL: 'Certificate has edited unsuccessfully.',
  DELETE_CERTIFICATE_FAIL: 'Certificate has deleted unsuccessfully.',
  CERTIFICATE_CATEGORY_NAME_REQUIRE: 'Category is required.',
  CERTIFICATE_SKILL_NAME_REQUIRE: 'Certificate name is required.',
  CERTIFICATE_EXISTING: 'Certificate name existed.',
  CERTIFICATE_EXISTING_COMMA: 'Certificate name cannot contain comma characters.',
  CERTIFICATE_CATEGORY_VALIDATE_MAX_LENGTH: 'Certificate category cannot contain more than 100 characters.',
  CERTIFICATE_NAME_VALIDATE_MAX_LENGTH: 'Certificate name cannot contain more than 100 characters.',

  FULL_NAME_REQUIRE: 'Full name is required.',
  PHONE_REQUIRE: 'Phone is required.',
  EMAIL_REQUIRE: 'Email is required.',
  ROLE_NAME_REQUIRE: 'Role name is required.',

  // messages for School Setting
  ADD_SCHOOL_SUCCESS: 'School has added successfully.',
  EDIT_SCHOOL_SUCCESS: 'School has edited successfully.',
  DELETE_SCHOOL_SUCCESS: 'School has deleted successfully.',
  ADD_SCHOOL_UNSUCCESS: 'School has added unsuccessfully.',
  EDIT_SCHOOL_UNSUCCESS: 'School has edited unsuccessfully.',
  DELETE_SCHOOL_UNSUCCESS: 'School has deleted unsuccessfully.',
  SCHOOL_CATEGORY_NAME_REQUIRE: 'Category is required.',
  SCHOOL_SCHOOL_NAME_REQUIRE: 'School name is required.',
  SCHOOL_SCHOOL_EXISTING: 'School name existed.',
  SCHOOL_EXISTING_COMMA: 'School name cannot contain comma characters.',
  SCHOOL_VALIDATE_MAX_LENGTH: 'School name cannot contain more than 200 characters.',
  SCHOOL_CATEGORY_VALIDATE_MAX_LENGTH: 'School category cannot contain more than 100 characters.',

  // messages for Template Profile Setting
  TEMPLATE_PROFILE_EXISTING: 'The name already existed. Please change a different file name before uploading.',


  RESEND_REQUEST_SUCCESS: 'Request(s) has been resent.',
  ACTIVE_CANDIATE_SUCCESS: 'Candidate has been activated successfully.',
  ACTIVE_CANDIATE_UNSUCCESS: 'Candidate has been activated unsuccessfully.',

  DEACTIVE_CANDIATE_SUCCESS: 'Candidate has been deactivated successfully.',
  DEACTIVE_CANDIATE_UNSUCCESS: 'Candidate has been deactivated unsuccessfully.',

  DELETE_CANDIATE_SUCCESS: 'Candidate has been deleted successfully.',
  DELETE_CANDIATE_UNSUCCESS: 'Candidate has been deleted unsuccessfully.',

  LINK_CANDIDATE_COPY_SUCCESS: 'Request link has been copied to clipboard.',

  // Others
  INPUT_EMPTY: ' ',
};
