import AdminRepository from '@repository/admin';
import { Admin, AdminAttributes } from '@models/admin';
import { ERRORS, RequestError } from '@utils/error';
import createLogger from '@utils/logger';
import sequelize from '@utils/sequelize';
import { createAuthToken, createRefreshToken } from '@utils/jwt';

const logger = createLogger('@adminService');

export interface AuthAdmin {
  super_u_id: string;
  email: string;
  name: string;
  type: string;
  access_token: string;
  refresh_token: string;
}

export class AdminService {
  adminRepository: AdminRepository;

  constructor() {
    this.adminRepository = new AdminRepository();
  }

  /**
   * Create a new admin
   */
  async createAdmin(data: {
    name: string;
    email: string;
    password: string;
    type?: string;
  }): Promise<Admin> {
    const transaction = await sequelize.transaction();
    try {
      // Check if admin already exists
      await this.adminRepository.checkIfAdminExists(data.email, transaction);

      // Create admin
      const admin = await this.adminRepository.createAdmin(data, transaction);

      await transaction.commit();
      return admin;
    } catch (e) {
      await transaction.rollback();
      if (e instanceof RequestError) {
        throw e;
      }
      logger.error('Error creating admin:', e);
      throw ERRORS.INTERNAL_SERVER_ERROR;
    }
  }

  /**
   * Login admin with email and password
   */
  async loginAdmin(email: string, password: string): Promise<AuthAdmin> {
    try {
      // Get admin by email
      const admin = await this.adminRepository.getAdminByEmail(email);

      // Check password
      const isPasswordValid = await admin.checkPassword(password);
      if (!isPasswordValid) {
        throw ERRORS.INVALID_CREDENTIALS;
      }

      // Generate tokens with super admin flag
      const accessToken = createAuthToken({
        id: admin.super_u_id,
        type: admin.type,
        is_super_admin: true,
      });
      const refreshToken = createRefreshToken({
        id: admin.super_u_id,
        type: admin.type,
        is_super_admin: true,
      });

    

      return {
        super_u_id: admin.super_u_id,
        email: admin.email,
        name: admin.name,
        type: admin.type,
        access_token: accessToken,
        refresh_token: refreshToken,
      };
    } catch (e) {
      if (e instanceof RequestError) {
        throw e;
      }
      logger.error('Error logging in admin:', e);
      throw ERRORS.INTERNAL_SERVER_ERROR;
    }
  }

  /**
   * Get admin by ID
   */
  async getAdminById(super_u_id: string): Promise<Admin> {
    try {
      const admin = await this.adminRepository.getAdminById(super_u_id);
      return admin;
    } catch (e) {
      if (e instanceof RequestError) {
        throw e;
      }
      logger.error('Error getting admin by ID:', e);
      throw ERRORS.INTERNAL_SERVER_ERROR;
    }
  }

  /**
   * Get all admins
   */
  async getAllAdmins(): Promise<Admin[]> {
    try {
      const admins = await this.adminRepository.getAllAdmins();
      return admins;
    } catch (e) {
      logger.error('Error getting all admins:', e);
      throw ERRORS.INTERNAL_SERVER_ERROR;
    }
  }

  /**
   * Update admin
   */
  async updateAdmin(
    super_u_id: string,
    data: Partial<AdminAttributes>
  ): Promise<Admin> {
    const transaction = await sequelize.transaction();
    try {
      // Don't allow updating super_u_id
      delete (data as any).super_u_id;

      const admin = await this.adminRepository.updateAdmin(
        super_u_id,
        data,
        transaction
      );

      await transaction.commit();
      return admin;
    } catch (e) {
      await transaction.rollback();
      if (e instanceof RequestError) {
        throw e;
      }
      logger.error('Error updating admin:', e);
      throw ERRORS.INTERNAL_SERVER_ERROR;
    }
  }

  /**
   * Delete admin (soft delete)
   */
  async deleteAdmin(super_u_id: string): Promise<void> {
    const transaction = await sequelize.transaction();
    try {
      await this.adminRepository.deleteAdmin(super_u_id, transaction);
      await transaction.commit();
    } catch (e) {
      await transaction.rollback();
      if (e instanceof RequestError) {
        throw e;
      }
      logger.error('Error deleting admin:', e);
      throw ERRORS.INTERNAL_SERVER_ERROR;
    }
  }

  /**
   * Change admin password
   */
  async changePassword(
    super_u_id: string,
    oldPassword: string,
    newPassword: string
  ): Promise<void> {
    const transaction = await sequelize.transaction();
    try {
      const admin = await this.adminRepository.getAdminById(
        super_u_id,
        transaction
      );

      // Verify old password
      const isPasswordValid = await admin.checkPassword(oldPassword);
      if (!isPasswordValid) {
        throw ERRORS.INVALID_CREDENTIALS;
      }

      // Update password
      await admin.update({ password: newPassword }, { transaction });

      await transaction.commit();
    } catch (e) {
      await transaction.rollback();
      if (e instanceof RequestError) {
        throw e;
      }
      logger.error('Error changing password:', e);
      throw ERRORS.INTERNAL_SERVER_ERROR;
    }
  }
}
