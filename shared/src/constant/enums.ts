export enum SERVICE {
  USER_ACCOUNT_PROFILE = 'USER_ACCOUNT_PROFILE',
  NOTIFICATION = 'NOTIFICATION',
  CHATS = 'CHATS',
  PRODUCTS = 'PRODUCTS',
  DIAGRAMS = 'DIAGRAMS',
}

export enum Role {
  USER = 'USER',
}

export enum CHAT_USER_ROLE {
  DELEGATE = 'delegate',
  STAKEHOLDER = 'stakeholder',
  EMPLOYEE = 'employee',
  CUSTOMER = 'customer',
}

export enum Gender {
  MALE = 'male',
  FEMALE = 'female',
  OTHER = 'other',
}

export enum WebhooksTypeEnum {
  EVENT = 'Event',
  DECISION = 'Decision',
  PROOF_ADDRESS = 'Proof Address',
}

export enum VerificationLinkTypeEnum {
  EMAIL = 'EMAIL',
  SMS = 'SMS',
  QRCODE = 'QRCODE',
}

export enum VerificationStatusEnum {
  NOT_STARTED = 'Not Started',
  STARTED = 'Started',
  SUBMITTED = 'Submitted',
  EXPIRED = 'Expired',
  ABANDONED = 'Abandoned',
  DECLINED = 'Declined',
  APPROVED = 'Approved',
  UNDER_REVIEW = 'Under Review',
}

export enum VerificationDocumentEnum {
  PASSPORT = 'Passport',
  LICENSE = 'License',
  ADDRESS_PERMIT = 'Address Permit',
  PROOF_ADDRESS = 'Proof Address',
}

export enum VerificationPlatformEnum {
  WEB_REACT_JS = 'Web-React-JS',
  IOS = 'IOS',
  ANDROID = 'Android',
}

export enum SwaggerQueryParamStyle {
  CSV = 'form',
  SPACE = 'spaceDelimited',
  PIPE = 'pipeDelimited',
}

export const SwaggerStyleSeparators: Record<SwaggerQueryParamStyle, string> = {
  [SwaggerQueryParamStyle.CSV]: ',',
  [SwaggerQueryParamStyle.SPACE]: ' ',
  [SwaggerQueryParamStyle.PIPE]: '|',
};

export enum FileContentTypes {
  CSV = 'application/vnd.openxmlformats',
  PDF = 'application/pdf',
  JSON = 'application/json',
  XLS = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
}

export const SOCKET_ROOM = 'Logger';

export enum USER_IDENTITY_ACTIVITY_TYPES {
  LOGIN = 'login',
  LOGOUT = 'logout',
  PASSWORD_RESET = 'password_reset',
  PASSWORD_CHANGE = 'password_change',
}

export enum SYSTEM_ERROR_ACTIVITY_TYPES {
  LOGIN_ATTEMPT = 'login_attempt',
  SYSTEM_ERROR = 'system_error',
  SECURITY_ALERT = 'security_alert',
  NAVIGATE_URL = 'navigate_url',
  CHAT_MESSAGE = 'chat_message',
}

export enum ALERT_TYPES {
  UNUSUAL_DEVICE_LOGIN = 'unusual_device_login',
}

export const ACTIVITIES = {
  SIGN_IN: 'sign-in',
  LOGOUT: 'logout',
  PASSWORD_RESET: 'reset-password',
  SUGGESTED_PRODUCTS: 'submit-data-for-suggestions',
  CHAT_MESSAGES: 'chat-messages',
  CHANGE_PASSWORD: 'change-password',
  PROGRESS_DIAGRAMS: 'diagrams/progress'
};

export enum DIAGRAM_STATUS {
  ACTIVE = 'ACTIVE',
  INACTIVE = 'INACTIVE',
}

export enum PROGRESS_STATUS {
  IN_PROGRESS = 'IN_PROGRESS',
  COMPLETE = 'COMPLETE',
  PENDING = 'PENDING',
}

export enum PRODUCTS_MODEL_TRAINING_STATUS {
  IN_REVIEW = 'IN_REVIEW',
  APPROVED = 'APPROVED',
  REJECTED = 'REJECTED',
}