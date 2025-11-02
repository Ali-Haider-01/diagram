import { Request } from 'express';

export interface UserRoleDetails {
  _id: string;
  name: string;
  isAdmin: boolean;
}
export interface ProductsDetail {
  _id: string;
  name: string;
  shortCode: string;
}

export interface AppRequest extends Request {
  chatUser: {
    _id: string;
    firstName: string;
    lastName: string;
    email: string;
    contactNumber: string;
    roleId: string;
    products: string[];
    isActive: boolean;
    profilePicture?: string;
    createdAt: string;
    updatedAt: string;
    userRoleDetails: UserRoleDetails;
    productsDetail: ProductsDetail[];
    userId: string;
    role: string;
  };
}
