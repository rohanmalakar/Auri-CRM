import BranchRepository from '@repository/branch';
import OrganizationRepository from '@repository/organization';
import { OrgBranch, BranchAttributes } from '@models/branch';
import { ERRORS, RequestError } from '@utils/error';
import createLogger from '@utils/logger';
import sequelize from '@utils/sequelize';

const logger = createLogger('@branchService');

export class BranchService {
  branchRepository: BranchRepository;
  organizationRepository: OrganizationRepository;

  constructor() {
    this.branchRepository = new BranchRepository();
    this.organizationRepository = new OrganizationRepository();
  }

  /**
   * Create a new branch
   */
  async createBranch(data: {
    org_id: string;
    name_en: string;
    name_ar: string;
    branch_phone_number: string;
    city: string;
    address: string;
    location_link?: string;
  }): Promise<OrgBranch> {
    const transaction = await sequelize.transaction();
    try {
      // Verify organization exists
      await this.organizationRepository.getOrganizationById(data.org_id, transaction);

      // Check if branch name already exists in this organization
      await this.branchRepository.checkIfBranchExists(
        data.org_id,
        data.name_en,
        data.name_ar,
        transaction
      );

      // Create branch
      const branch = await this.branchRepository.createBranch(data, transaction);

      await transaction.commit();
      return branch;
    } catch (e) {
      await transaction.rollback();
      if (e instanceof RequestError) {
        throw e;
      }
      logger.error('Error creating branch:', e);
      throw ERRORS.INTERNAL_SERVER_ERROR;
    }
  }

  /**
   * Get all branches for an organization
   */
  async getBranchesByOrgId(org_id: string): Promise<OrgBranch[]> {
    try {
      // Verify organization exists
      await this.organizationRepository.getOrganizationById(org_id);
      
      const branches = await this.branchRepository.getBranchesByOrgId(org_id);
      return branches;
    } catch (e) {
      if (e instanceof RequestError) {
        throw e;
      }
      logger.error('Error getting branches by org ID:', e);
      throw ERRORS.INTERNAL_SERVER_ERROR;
    }
  }

  /**
   * Get active branches for an organization
   */
  async getActiveBranchesByOrgId(org_id: string): Promise<OrgBranch[]> {
    try {
      // Verify organization exists
      await this.organizationRepository.getOrganizationById(org_id);
      
      const branches = await this.branchRepository.getActiveBranchesByOrgId(org_id);
      return branches;
    } catch (e) {
      if (e instanceof RequestError) {
        throw e;
      }
      logger.error('Error getting active branches by org ID:', e);
      throw ERRORS.INTERNAL_SERVER_ERROR;
    }
  }

  /**
   * Get a branch by ID
   */
  async getBranchById(branch_id: string): Promise<OrgBranch> {
    try {
      const branch = await this.branchRepository.getBranchById(branch_id);
      return branch;
    } catch (e) {
      if (e instanceof RequestError) {
        throw e;
      }
      logger.error('Error getting branch by ID:', e);
      throw ERRORS.INTERNAL_SERVER_ERROR;
    }
  }

  /**
   * Update a branch
   */
  async updateBranch(
    branch_id: string,
    data: Partial<BranchAttributes>
  ): Promise<OrgBranch> {
    const transaction = await sequelize.transaction();
    try {
      // Get existing branch
      const existingBranch = await this.branchRepository.getBranchById(branch_id, transaction);

      // If branch names are being updated, check if new names already exist
      if (data.name_en || data.name_ar) {
        const checkNameEn = data.name_en || existingBranch.name_en;
        const checkNameAr = data.name_ar || existingBranch.name_ar;
        
        if (data.name_en !== existingBranch.name_en || data.name_ar !== existingBranch.name_ar) {
          await this.branchRepository.checkIfBranchExists(
            existingBranch.org_id,
            checkNameEn,
            checkNameAr,
            transaction
          );
        }
      }

      // Update branch
      const branch = await this.branchRepository.updateBranch(
        branch_id,
        data,
        transaction
      );

      await transaction.commit();
      return branch;
    } catch (e) {
      await transaction.rollback();
      if (e instanceof RequestError) {
        throw e;
      }
      logger.error('Error updating branch:', e);
      throw ERRORS.INTERNAL_SERVER_ERROR;
    }
  }

  /**
   * Delete a branch (soft delete)
   */
  async deleteBranch(branch_id: string): Promise<void> {
    const transaction = await sequelize.transaction();
    try {
      await this.branchRepository.deleteBranch(branch_id, transaction);
      await transaction.commit();
    } catch (e) {
      await transaction.rollback();
      if (e instanceof RequestError) {
        throw e;
      }
      logger.error('Error deleting branch:', e);
      throw ERRORS.INTERNAL_SERVER_ERROR;
    }
  }
}
