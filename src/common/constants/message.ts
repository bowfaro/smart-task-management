export const MESSAGE = {
  //auth
  ACCOUNT_REGISTER_SUCCESS: 'auth.account_register_success',
  ACCOUNT_LOGIN_FAILED: 'auth.account_login_failed',
  ACCOUNT_NOT_EXISTED: 'auth.account_not_existed',
  ACCOUNT_CONFIRMED: 'auth.account_confirmed',
  ACCOUNT_VERIFY_FAILED: 'auth.account_verify_failed',
  ACCOUNT_VERIFIED_SUCCESS: 'auth.account_verified_success',
  ACCOUNT_NOT_ACTIVATED: 'auth.account_not_activated',
  ACCOUNT_RESET_PASSWORD_FAILED: 'auth.account_reset_password_failed',
  FORBIDDEN: 'auth.forbidden ',
  ACCOUNT_INCORRECT_PASSWORD: 'auth.account_incorrect_password',
  ACCOUNT_CHANGE_PASSWORD_SUCCESS: 'auth.account_change_password_success',
  ACCOUNT_CHANGE_PASSWORD_FAILED: 'auth.account_change_password_failed',
  ACCOUNT_LOCKED: 'auth.account_locked',
  ACCOUNT_INACTIVE: 'auth.account_inactive',

  //token
  INVALID_OR_EXPIRED_TOKEN: 'token.invalid_or_expired_token',

  //otp
  INVALID_OR_EXPIRED_OTP: 'otp.otp_expired',
  OTP_INCORRECT: 'otp.otp_incorrect',
  OTP_NOT_FOUND: 'otp.otp_not_found',
  OTP_VERIFIED_SUCCESS: 'otp.otp_verified_success',
  OTP_RESEND_SUCCESS: 'otp.otp_resend_success',

  //user
  USER_NOT_FOUND: 'user.user_notfound',
  PHONE_EXISTED: 'user.phone_existed',
  EMAIL_NOT_EXIST: 'user.email_not_exist',
  UPDATE_USER_SUCCESS: 'user.update_success',
  UPDATE_USER_FAIL: 'user.update_user_failed',
  SOFT_DELETE_SUCCESS: 'user.soft_delete_user_success',
  SOFT_DELETE_FAIL: 'user.soft_delete_user_fail',
  HARD_DELETE_USER_SUCCESS: 'user.hard_delete_success',
  HARD_DELETE_USER_FAIL: 'user.hard_delete_fail',

  //task
  TASK_CREATED: 'task.task_created',
  TASK_UPDATED: 'task.task_updated',
  TASK_NOT_FOUND: 'task.task_not_found',
  TASK_STATUS_UPDATED: 'task.task_status_updated',
};
