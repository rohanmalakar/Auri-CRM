import OrganizationRepository from '@repository/organization';
import OrgUserRepository from '@repository/orgUser';
import { Organization, OrganizationAttributes } from '@models/organization';
import { OrgUser } from '@models/orgUser';
import { ERRORS, RequestError } from '@utils/error';
import createLogger from '@utils/logger';
import sequelize from '@utils/sequelize';

const logger = createLogger('@organizationService');

export class OrganizationService {
  organizationRepository: OrganizationRepository;
  orgUserRepository: OrgUserRepository;

  constructor() {
    this.organizationRepository = new OrganizationRepository();
    this.orgUserRepository = new OrgUserRepository();
  }

  /**
   * Create a new organization
   */
  async createOrganization(data: {
    name_en: string;
    name_ar: string;
    email: string;
    vat_no?: string;
    tel?: string;
    country?: string;
    state?: string;
    city?: string;
    pin?: string;
    contact_person?: string;
    c_mobile?: string;
    c_email?: string;
    picture?: string;
    type?: string;
  }): Promise<Organization> {
    const transaction = await sequelize.transaction();
    try {
      // Check if organization already exists
      await this.organizationRepository.checkIfOrganizationExists(
        data.email,
        data.vat_no,
        transaction
      );

      // Create organization
      const organization = await this.organizationRepository.createOrganization(
        data,
        transaction
      );

      await transaction.commit();
      return organization;
    } catch (e) {
      await transaction.rollback();
      if (e instanceof RequestError) {
        throw e;
      }
      logger.error('Error creating organization:', e);
      throw ERRORS.INTERNAL_SERVER_ERROR;
    }
  }

  /**
   * Get organization by ID
   */
  async getOrganizationById(org_id: string): Promise<Organization> {
    try {
      const organization = await this.organizationRepository.getOrganizationById(org_id);
      return organization;
    } catch (e) {
      if (e instanceof RequestError) {
        throw e;
      }
      logger.error('Error getting organization by ID:', e);
      throw ERRORS.INTERNAL_SERVER_ERROR;
    }
  }

  /**
   * Get all organizations
   */
  async getAllOrganizations(): Promise<Organization[]> {
    try {
      const organizations = await this.organizationRepository.getAllOrganizations();
      return organizations;
    } catch (e) {
      logger.error('Error getting all organizations:', e);
      throw ERRORS.INTERNAL_SERVER_ERROR;
    }
  }

  /**
   * Get active organizations
   */
  async getActiveOrganizations(): Promise<Organization[]> {
    try {
      const organizations = await this.organizationRepository.getActiveOrganizations();
      return organizations;
    } catch (e) {
      logger.error('Error getting active organizations:', e);
      throw ERRORS.INTERNAL_SERVER_ERROR;
    }
  }

  /**
   * Update organization
   */
  async updateOrganization(
    org_id: string,
    data: Partial<OrganizationAttributes>
  ): Promise<Organization> {
    const transaction = await sequelize.transaction();
    try {
      // Don't allow updating org_id
      delete (data as any).org_id;

      const organization = await this.organizationRepository.updateOrganization(
        org_id,
        data,
        transaction
      );

      await transaction.commit();
      return organization;
    } catch (e) {
      await transaction.rollback();
      if (e instanceof RequestError) {
        throw e;
      }
      logger.error('Error updating organization:', e);
      throw ERRORS.INTERNAL_SERVER_ERROR;
    }
  }

  /**
   * Delete organization (soft delete)
   */
  async deleteOrganization(org_id: string): Promise<void> {
    const transaction = await sequelize.transaction();
    try {
      await this.organizationRepository.deleteOrganization(org_id, transaction);
      await transaction.commit();
    } catch (e) {
      await transaction.rollback();
      if (e instanceof RequestError) {
        throw e;
      }
      logger.error('Error deleting organization:', e);
      throw ERRORS.INTERNAL_SERVER_ERROR;
    }
  }

  /**
   * Get all users for an organization
   */
  async getOrganizationUsers(org_id: string): Promise<OrgUser[]> {
    try {
      // Verify organization exists
      await this.organizationRepository.getOrganizationById(org_id);
      
      const users = await this.orgUserRepository.getOrgUsersByOrgId(org_id);
      return users;
    } catch (e) {
      if (e instanceof RequestError) {
        throw e;
      }
      logger.error('Error getting organization users:', e);
      throw ERRORS.INTERNAL_SERVER_ERROR;
    }
  }

  /**
   * Get a specific user in an organization
   */
  async getOrganizationUserById(org_id: string, org_user_id: string): Promise<OrgUser> {
    try {
      const user = await this.orgUserRepository.getOrgUserById(org_user_id);
      
      // Verify user belongs to the organization
      if (user.org_id !== org_id) {
        throw new RequestError('User does not belong to this organization', 30013, 403);
      }
      
      return user;
    } catch (e) {
      if (e instanceof RequestError) {
        throw e;
      }
      logger.error('Error getting organization user by ID:', e);
      throw ERRORS.INTERNAL_SERVER_ERROR;
    }
  }
}
