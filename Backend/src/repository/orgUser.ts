import { OrgUser, OrgUserAttributes } from '@models/orgUser';
import { ERRORS, RequestError } from '@utils/error';
import createLogger from '@utils/logger';
import { Transaction } from 'sequelize';

const logger = createLogger('@orgUserRepository');

export default class OrgUserRepository {
  /**
   * Check if org user exists by email or tel
   */
  async checkIfOrgUserExists(
    email: string,
    tel: string,
    transaction?: Transaction
  ): Promise<void> {
    try {
      // Check if email exists
      const userByEmail = await OrgUser.findOne({
        where: { email },
        transaction,
      });
      
      if (userByEmail) {
        throw ERRORS.EMAIL_ALREADY_EXISTS;
      }

      // Check if phone exists
      if (tel) {
        const userByPhone = await OrgUser.findOne({
          where: { tel },
          transaction,
        });
        
        if (userByPhone) {
          throw ERRORS.PHONE_ALREADY_EXISTS;
        }
      }
    } catch (e) {
      if (e instanceof RequestError) {
        throw e;
      }
      logger.error('Error checking if org user exists:', e);
      throw ERRORS.DATABASE_ERROR;
    }
  }

  /**
   * Create a new org user
   */
  async createOrgUser(
    data: Partial<OrgUserAttributes>,
    transaction?: Transaction
  ): Promise<OrgUser> {
    try {
      const orgUser = await OrgUser.create(data as any, { transaction });
      return orgUser;
    } catch (e) {
      logger.error('Error creating org user:', e);
      throw ERRORS.DATABASE_ERROR;
    }
  }

  /**
   * Get org user by ID
   */
  async getOrgUserById(
    org_user_id: string,
    transaction?: Transaction
  ): Promise<OrgUser> {
    try {
      const orgUser = await OrgUser.findByPk(org_user_id, { transaction });
      
      if (!orgUser) {
        throw ERRORS.USER_NOT_FOUND;
      }
      
      return orgUser;
    } catch (e) {
      if (e instanceof RequestError) {
        throw e;
      }
      logger.error('Error getting org user by ID:', e);
      throw ERRORS.DATABASE_ERROR;
    }
  }

  /**
   * Get org user by email
   */
  async getOrgUserByEmail(
    email: string,
    transaction?: Transaction
  ): Promise<OrgUser> {
    try {
      const orgUser = await OrgUser.findOne({
        where: { email },
        transaction,
      });
      
      if (!orgUser) {
        throw ERRORS.USER_NOT_FOUND;
      }
      
      return orgUser;
    } catch (e) {
      if (e instanceof RequestError) {
        throw e;
      }
      logger.error('Error getting org user by email:', e);
      throw ERRORS.DATABASE_ERROR;
    }
  }

  /**
   * Get all org users
   */
  async getAllOrgUsers(transaction?: Transaction): Promise<OrgUser[]> {
    try {
      const orgUsers = await OrgUser.findAll({ transaction });
      return orgUsers;
    } catch (e) {
      logger.error('Error getting all org users:', e);
      throw ERRORS.DATABASE_ERROR;
    }
  }

  /**
   * Get org users by organization ID
   */
  async getOrgUsersByOrgId(
    org_id: string,
    transaction?: Transaction
  ): Promise<OrgUser[]> {
    try {
      const orgUsers = await OrgUser.findAll({
        where: { org_id },
        transaction,
      });
      return orgUsers;
    } catch (e) {
      logger.error('Error getting org users by org ID:', e);
      throw ERRORS.DATABASE_ERROR;
    }
  }

  /**
   * Update org user
   */
  async updateOrgUser(
    org_user_id: string,
    data: Partial<OrgUserAttributes>,
    transaction?: Transaction
  ): Promise<OrgUser> {
    try {
      const orgUser = await this.getOrgUserById(org_user_id, transaction);
      await orgUser.update(data, { transaction });
      return orgUser;
    } catch (e) {
      if (e instanceof RequestError) {
        throw e;
      }
      logger.error('Error updating org user:', e);
      throw ERRORS.DATABASE_ERROR;
    }
  }

  /**
   * Delete org user (soft delete by setting status to Inactive)
   */
  async deleteOrgUser(
    org_user_id: string,
    transaction?: Transaction
  ): Promise<void> {
    try {
      const orgUser = await this.getOrgUserById(org_user_id, transaction);
      await orgUser.update({ status: 'Inactive' }, { transaction });
    } catch (e) {
      if (e instanceof RequestError) {
        throw e;
      }
      logger.error('Error deleting org user:', e);
      throw ERRORS.DATABASE_ERROR;
    }
  }

  /**
   * Get active org users by organization ID
   */
  async getActiveOrgUsersByOrgId(
    org_id: string,
    transaction?: Transaction
  ): Promise<OrgUser[]> {
    try {
      const orgUsers = await OrgUser.findAll({
        where: { org_id, status: 'Active' },
        transaction,
      });
      return orgUsers;
    } catch (e) {
      logger.error('Error getting active org users by org ID:', e);
      throw ERRORS.DATABASE_ERROR;
    }
  }
}
