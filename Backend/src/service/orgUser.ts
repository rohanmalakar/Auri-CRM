import OrgUserRepository from '@repository/orgUser';
import BranchRepository from '@repository/branch';
import { OrgUser, OrgUserAttributes } from '@models/orgUser';
import { ERRORS, RequestError } from '@utils/error';
import createLogger from '@utils/logger';
import sequelize from '@utils/sequelize';
import { createAuthToken, createRefreshToken } from '@utils/jwt';
import { v4 as uuidv4 } from 'uuid';

const logger = createLogger('@orgUserService');

export interface AuthOrgUser {
  org_user_id: string;
  name: string;
  email: string;
  org_id: string;
  designation?: 'Cashier' | 'Manager' | 'Admin' | 'Other';
  access_token: string;
  branch_id?: string;
  refresh_token: string;
}

export class OrgUserService {
  orgUserRepository: OrgUserRepository;
  branchRepository: BranchRepository;

  constructor() {
    this.orgUserRepository = new OrgUserRepository();
    this.branchRepository = new BranchRepository();
  }

  /**
   * Create a new org user
   */
  async createOrgUser(data: {
    org_id: string;
    branch_id?: string;
    name: string;
    email: string;
    password: string;
    tel?: string;

    address?: string;
    picture?: string;
    designation?: 'Cashier' | 'Manager' | 'Admin' | 'Other';
  }): Promise<OrgUser> {
    const transaction = await sequelize.transaction();
    try {
      // Validate: Non-admin users must have branch_id
      if (data.designation && data.designation !== 'Admin' && !data.branch_id) {
        throw new RequestError('Branch ID is required for non-admin users', 30103, 400);
      }

      // Validate: If branch_id is provided, check if branch exists and is active
      if (data.branch_id) {
        const branch = await this.branchRepository.getBranchById(data.branch_id, transaction);
        
        if (branch.status !== 'Active') {
          throw new RequestError('Branch must be active to assign users', 30104, 400);
        }

        // Verify branch belongs to the same organization
        if (branch.org_id !== data.org_id) {
          throw new RequestError('Branch does not belong to this organization', 30105, 400);
        }
      }

      // Check if user already exists
      await this.orgUserRepository.checkIfOrgUserExists(
        data.email,
        data.tel || '',
        transaction
      );

      // Generate unique org_user_id
      const org_user_id = uuidv4();

      // Create org user
      const orgUser = await this.orgUserRepository.createOrgUser(
        {
          ...data,
          org_user_id,
        },
        transaction
      );

      await transaction.commit();
      return orgUser;
    } catch (e) {
      await transaction.rollback();
      if (e instanceof RequestError) {
        throw e;
      }
      logger.error('Error creating org user:', e);
      throw ERRORS.INTERNAL_SERVER_ERROR;
    }
  }

  /**
   * Login org user with email and password
   */
  async loginOrgUser(email: string, password: string): Promise<AuthOrgUser> {
    try {
      // Get user by email
      const orgUser = await this.orgUserRepository.getOrgUserByEmail(email);

      // Check if user is active
      if (orgUser.status !== 'Active') {
        throw ERRORS.USER_INACTIVE;
      }

      // Check password
      const isPasswordValid = await orgUser.checkPassword(password);
      if (!isPasswordValid) {
        throw ERRORS.INVALID_CREDENTIALS;
      }

      // Generate tokens
      const accessToken = createAuthToken({
        id: orgUser.org_user_id,
        org_id: orgUser.org_id,
        branch_id: orgUser.branch_id,
        designation: orgUser.designation,
      });
      const refreshToken = createRefreshToken({
        id: orgUser.org_user_id,
        org_id: orgUser.org_id,
        branch_id: orgUser.branch_id,
        designation: orgUser.designation,
      });

      return {
        org_user_id: orgUser.org_user_id,
        name: orgUser.name,
        email: orgUser.email,
        org_id: orgUser.org_id,
        branch_id: orgUser.branch_id ,
        designation: orgUser.designation,
        access_token: accessToken,
        refresh_token: refreshToken,
      };
    } catch (e) {
      if (e instanceof RequestError) {
        throw e;
      }
      logger.error('Error logging in org user:', e);
      throw ERRORS.INTERNAL_SERVER_ERROR;
    }
  }

  /**
   * Get org user by ID
   */
  async getOrgUserById(org_user_id: string): Promise<OrgUser> {
    try {
      const orgUser = await this.orgUserRepository.getOrgUserById(org_user_id);
      return orgUser;
    } catch (e) {
      if (e instanceof RequestError) {
        throw e;
      }
      logger.error('Error getting org user by ID:', e);
      throw ERRORS.INTERNAL_SERVER_ERROR;
    }
  }

  /**
   * Get all org users
   */
  async getAllOrgUsers(): Promise<OrgUser[]> {
    try {
      const orgUsers = await this.orgUserRepository.getAllOrgUsers();
      return orgUsers;
    } catch (e) {
      logger.error('Error getting all org users:', e);
      throw ERRORS.INTERNAL_SERVER_ERROR;
    }
  }

  /**
   * Get org users by organization ID
   */
  async getOrgUsersByOrgId(org_id: string): Promise<OrgUser[]> {
    try {
      const orgUsers = await this.orgUserRepository.getOrgUsersByOrgId(org_id);
      return orgUsers;
    } catch (e) {
      logger.error('Error getting org users by org ID:', e);
      throw ERRORS.INTERNAL_SERVER_ERROR;
    }
  }

  /**
   * Update org user
   */
  async updateOrgUser(
    org_user_id: string,
    data: Partial<OrgUserAttributes>
  ): Promise<OrgUser> {
    const transaction = await sequelize.transaction();
    try {
      // Don't allow updating org_user_id
      delete (data as any).org_user_id;

      const orgUser = await this.orgUserRepository.updateOrgUser(
        org_user_id,
        data,
        transaction
      );

      await transaction.commit();
      return orgUser;
    } catch (e) {
      await transaction.rollback();
      if (e instanceof RequestError) {
        throw e;
      }
      logger.error('Error updating org user:', e);
      throw ERRORS.INTERNAL_SERVER_ERROR;
    }
  }

  /**
   * Delete org user (soft delete)
   */
  async deleteOrgUser(org_user_id: string): Promise<void> {
    const transaction = await sequelize.transaction();
    try {
      await this.orgUserRepository.deleteOrgUser(org_user_id, transaction);
      await transaction.commit();
    } catch (e) {
      await transaction.rollback();
      if (e instanceof RequestError) {
        throw e;
      }
      logger.error('Error deleting org user:', e);
      throw ERRORS.INTERNAL_SERVER_ERROR;
    }
  }

  /**
   * Get active org users by organization ID
   */
  async getActiveOrgUsersByOrgId(org_id: string): Promise<OrgUser[]> {
    try {
      const orgUsers = await this.orgUserRepository.getActiveOrgUsersByOrgId(
        org_id
      );
      return orgUsers;
    } catch (e) {
      logger.error('Error getting active org users by org ID:', e);
      throw ERRORS.INTERNAL_SERVER_ERROR;
    }
  }

  /**
   * Change org user password
   */
  async changePassword(
    org_user_id: string,
    oldPassword: string,
    newPassword: string
  ): Promise<void> {
    const transaction = await sequelize.transaction();
    try {
      const orgUser = await this.orgUserRepository.getOrgUserById(
        org_user_id,
        transaction
      );

      // Verify old password
      const isPasswordValid = await orgUser.checkPassword(oldPassword);
      if (!isPasswordValid) {
        throw ERRORS.INVALID_CREDENTIALS;
      }

      // Update password
      await orgUser.update({ password: newPassword }, { transaction });

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
