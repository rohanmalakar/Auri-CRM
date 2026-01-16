import { Organization, OrganizationAttributes } from '@models/organization';
import { ERRORS, RequestError } from '@utils/error';
import createLogger from '@utils/logger';
import { Transaction } from 'sequelize';

const logger = createLogger('@organizationRepository');

export default class OrganizationRepository {
  /**
   * Check if organization exists by email or vat_no
   */
  async checkIfOrganizationExists(
    email: string,
    vat_no?: string,
    transaction?: Transaction
  ): Promise<void> {
    try {
      // Check if email exists
      const orgByEmail = await Organization.findOne({
        where: { email },
        transaction,
      });
      
      if (orgByEmail) {
        throw ERRORS.EMAIL_ALREADY_EXISTS;
      }

      // Check if VAT number exists (if provided)
      if (vat_no) {
        const orgByVat = await Organization.findOne({
          where: { vat_no },
          transaction,
        });
        
        if (orgByVat) {
          throw new RequestError('VAT number already exists', 30011, 400);
        }
      }
    } catch (e) {
      if (e instanceof RequestError) {
        throw e;
      }
      logger.error('Error checking if organization exists:', e);
      throw ERRORS.DATABASE_ERROR;
    }
  }

  /**
   * Create a new organization
   */
  async createOrganization(
    data: Partial<OrganizationAttributes>,
    transaction?: Transaction
  ): Promise<Organization> {
    try {
      const organization = await Organization.create(data as any, { transaction });
      return organization;
    } catch (e) {
      logger.error('Error creating organization:', e);
      throw ERRORS.DATABASE_ERROR;
    }
  }

  /**
   * Get organization by ID
   */
  async getOrganizationById(
    org_id: string,
    transaction?: Transaction
  ): Promise<Organization> {
    try {
      const organization = await Organization.findByPk(org_id, { transaction });
      
      if (!organization) {
        throw new RequestError('Organization not found', 30012, 404);
      }
      
      return organization;
    } catch (e) {
      if (e instanceof RequestError) {
        throw e;
      }
      logger.error('Error getting organization by ID:', e);
      throw ERRORS.DATABASE_ERROR;
    }
  }

  /**
   * Get all organizations
   */
  async getAllOrganizations(transaction?: Transaction): Promise<Organization[]> {
    try {
      const organizations = await Organization.findAll({ transaction });
      return organizations;
    } catch (e) {
      logger.error('Error getting all organizations:', e);
      throw ERRORS.DATABASE_ERROR;
    }
  }

  /**
   * Get active organizations
   */
  async getActiveOrganizations(transaction?: Transaction): Promise<Organization[]> {
    try {
      const organizations = await Organization.findAll({
        where: { status: 'Active' },
        transaction,
      });
      return organizations;
    } catch (e) {
      logger.error('Error getting active organizations:', e);
      throw ERRORS.DATABASE_ERROR;
    }
  }

  /**
   * Update organization
   */
  async updateOrganization(
    org_id: string,
    data: Partial<OrganizationAttributes>,
    transaction?: Transaction
  ): Promise<Organization> {
    try {
      const organization = await this.getOrganizationById(org_id, transaction);
      await organization.update(data, { transaction });
      return organization;
    } catch (e) {
      if (e instanceof RequestError) {
        throw e;
      }
      logger.error('Error updating organization:', e);
      throw ERRORS.DATABASE_ERROR;
    }
  }

  /**
   * Delete organization (soft delete by setting status to Inactive)
   */
  async deleteOrganization(
    org_id: string,
    transaction?: Transaction
  ): Promise<void> {
    try {
      const organization = await this.getOrganizationById(org_id, transaction);
      await organization.update({ status: 'Inactive' }, { transaction });
    } catch (e) {
      if (e instanceof RequestError) {
        throw e;
      }
      logger.error('Error deleting organization:', e);
      throw ERRORS.DATABASE_ERROR;
    }
  }
}
