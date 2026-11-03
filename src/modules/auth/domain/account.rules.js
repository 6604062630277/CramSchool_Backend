import { Conflict } from '../../../shared/errors/AppError.js';
import { ROLES } from './roles.js';

export const ACCOUNT_STATUS = Object.freeze({
  NEEDS_REGISTRATION: 'needs_registration',
  PENDING_APPROVAL: 'pending_approval',
  ACTIVE: 'active',
});

export function getAccountStatus({ role, hasTeacherApplication }) {
  if (role) return ACCOUNT_STATUS.ACTIVE;
  if (hasTeacherApplication) return ACCOUNT_STATUS.PENDING_APPROVAL;
  return ACCOUNT_STATUS.NEEDS_REGISTRATION;
}

// กฎ: สมัครได้ครั้งเดียว ตอนที่ยังไม่ได้สมัครเท่านั้น
export function assertCanRegister(status) {
  if (status !== ACCOUNT_STATUS.NEEDS_REGISTRATION) {
    throw Conflict('Account already registered', 'ALREADY_REGISTERED');
  }
}

// กฎ: ครูต้องรอ admin อนุมัติ จึงยังไม่ได้ role
export function roleAfterRegistration(requestedRole) {
  return requestedRole === ROLES.TEACHER ? null : requestedRole;
}

// กฎ: ชื่อเต็มเก็บเป็น "ชื่อ นามสกุล"
export function buildFullName(firstName, lastName) {
  return `${firstName} ${lastName}`.trim();
}

// กฎ: อนุมัติหรือปฏิเสธได้เฉพาะครูที่รออนุมัติอยู่
export function assertPendingApproval(status) {
  if (status !== ACCOUNT_STATUS.PENDING_APPROVAL) {
    throw Conflict('User is not waiting for approval', 'NOT_PENDING');
  }
}