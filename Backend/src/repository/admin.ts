import { Admin, AdminAttributes } from '@models/admin';
import { ERRORS, RequestError } from '@utils/error';
import createLogger from '@utils/logger';
import { Transaction } from 'sequelize';

const logger = createLogger('@adminRepository');

export default class AdminRepository {
  /**
   * Check if admin exists by email
   */
  async checkIfAdminExists(
    email: string,
    transaction?: Transaction
  ): Promise<void> {
    try {
      const admin = await Admin.findOne({
        where: { 
          email,
          status: ['active', 'inactive']
        },
        transaction,
      });
      
      if (admin) {
        throw ERRORS.EMAIL_ALREADY_EXISTS;
      }
    } catch (e) {
      if (e instanceof RequestError) {
        throw e;
      }
      logger.error('Error checking if admin exists:', e);
      throw ERRORS.DATABASE_ERROR;
    }
  }

  /**
   * Create a new admin
   */
  async createAdmin(
    data: Partial<AdminAttributes>,
    transaction?: Transaction
  ): Promise<Admin> {
    try {
      const admin = await Admin.create(data as any, { transaction });
      return admin;
    } catch (e) {
      logger.error('Error creating admin:', e);
      throw ERRORS.DATABASE_ERROR;
    }
  }

  /**
   * Get admin by ID
   */
  async getAdminById(
    super_u_id: string,
    transaction?: Transaction
  ): Promise<Admin> {
    try {
      const admin = await Admin.findOne({
        where: { 
          super_u_id,
          status: ['active', 'inactive']
        },
        transaction
      });
      
      if (!admin) {
        throw new RequestError('Admin not found', 40001, 404);
      }
      
      return admin;
    } catch (e) {
      if (e instanceof RequestError) {
        throw e;
      }
      logger.error('Error getting admin by ID:', e);
      throw ERRORS.DATABASE_ERROR;
    }
  }

  /**
   * Get admin by email
   */
  async getAdminByEmail(
    email: string,
    transaction?: Transaction
  ): Promise<Admin> {
    try {
      const admin = await Admin.findOne({
        where: { 
          email,
          status: ['active', 'inactive']
        },
        transaction,
      });
      
      if (!admin) {
        throw new RequestError('Admin not found', 40001, 404);
      }
      
      return admin;
    } catch (e) {
      if (e instanceof RequestError) {
        throw e;
      }
      logger.error('Error getting admin by email:', e);
      throw ERRORS.DATABASE_ERROR;
    }
  }

  /**
   * Get all admins
   */
  async getAllAdmins(transaction?: Transaction): Promise<Admin[]> {
    try {
      const admins = await Admin.findAll({ 
        where: {
          status: ['active', 'inactive']
        },
        transaction 
      });
      return admins;
    } catch (e) {
      logger.error('Error getting all admins:', e);
      throw ERRORS.DATABASE_ERROR;
    }
  }

  /**
   * Update admin
   */
  async updateAdmin(
    super_u_id: string,
    data: Partial<AdminAttributes>,
    transaction?: Transaction
  ): Promise<Admin> {
    try {
      const admin = await this.getAdminById(super_u_id, transaction);
      await admin.update(data, { transaction });
      return admin;
    } catch (e) {
      if (e instanceof RequestError) {
        throw e;
      }
      logger.error('Error updating admin:', e);
      throw ERRORS.DATABASE_ERROR;
    }
  }

  /**
   * Delete admin (soft delete)
   */
  async deleteAdmin(
    super_u_id: string,
    transaction?: Transaction
  ): Promise<void> {
    try {
      const admin = await this.getAdminById(super_u_id, transaction);
      await admin.update({ status: 'deleted' }, { transaction });
    } catch (e) {
      if (e instanceof RequestError) {
        throw e;
      }
      logger.error('Error deleting admin:', e);
      throw ERRORS.DATABASE_ERROR;
    }
  }
}
