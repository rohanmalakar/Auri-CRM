import { OrgBranch, BranchAttributes } from '@models/branch';
import { ERRORS, RequestError } from '@utils/error';
import createLogger from '@utils/logger';
import { Transaction } from 'sequelize';

const logger = createLogger('@branchRepository');

export default class BranchRepository {
  /**
   * Check if branch exists by name in organization
   */
  async checkIfBranchExists(
    org_id: string,
    name_en: string,
    name_ar: string,
    transaction?: Transaction
  ): Promise<void> {
    try {
      const branch = await OrgBranch.findOne({
        where: { 
          org_id,
          name_en,
          status: ['Active', 'Inactive']
        },
        transaction,
      });
      
      if (branch) {
        throw new RequestError('Branch name (English) already exists in this organization', 30101, 400);
      }

      const branchAr = await OrgBranch.findOne({
        where: { 
          org_id,
          name_ar,
          status: ['Active', 'Inactive']
        },
        transaction,
      });
      
      if (branchAr) {
        throw new RequestError('Branch name (Arabic) already exists in this organization', 30101, 400);
      }
    } catch (e) {
      if (e instanceof RequestError) {
        throw e;
      }
      logger.error('Error checking if branch exists:', e);
      throw ERRORS.DATABASE_ERROR;
    }
  }

  /**
   * Create a new branch
   */
  async createBranch(
    data: Partial<BranchAttributes>,
    transaction?: Transaction
  ): Promise<OrgBranch> {
    try {
      const branch = await OrgBranch.create(data as any, { transaction });
      return branch;
    } catch (e) {
      logger.error('Error creating branch:', e);
      throw ERRORS.DATABASE_ERROR;
    }
  }

  /**
   * Get branch by ID
   */
  async getBranchById(
    branch_id: string,
    transaction?: Transaction
  ): Promise<OrgBranch> {
    try {
      const branch = await OrgBranch.findOne({
        where: { 
          branch_id,
          status: ['Active', 'Inactive']
        },
        transaction
      });
      
      if (!branch) {
        throw new RequestError('Branch not found', 30102, 404);
      }
      
      return branch;
    } catch (e) {
      if (e instanceof RequestError) {
        throw e;
      }
      logger.error('Error getting branch by ID:', e);
      throw ERRORS.DATABASE_ERROR;
    }
  }

  /**
   * Get all branches for an organization
   */
  async getBranchesByOrgId(
    org_id: string,
    transaction?: Transaction
  ): Promise<OrgBranch[]> {
    try {
      const branches = await OrgBranch.findAll({
        where: { 
          org_id,
          status: ['Active', 'Inactive']
        },
        transaction,
      });
      return branches;
    } catch (e) {
      logger.error('Error getting branches by org ID:', e);
      throw ERRORS.DATABASE_ERROR;
    }
  }

  /**
   * Get all active branches for an organization
   */
  async getActiveBranchesByOrgId(
    org_id: string,
    transaction?: Transaction
  ): Promise<OrgBranch[]> {
    try {
      const branches = await OrgBranch.findAll({
        where: { 
          org_id,
          status: 'Active'
        },
        transaction,
      });
      return branches;
    } catch (e) {
      logger.error('Error getting active branches by org ID:', e);
      throw ERRORS.DATABASE_ERROR;
    }
  }

  /**
   * Update branch
   */
  async updateBranch(
    branch_id: string,
    data: Partial<BranchAttributes>,
    transaction?: Transaction
  ): Promise<OrgBranch> {
    try {
      const branch = await this.getBranchById(branch_id, transaction);
      await branch.update(data, { transaction });
      return branch;
    } catch (e) {
      if (e instanceof RequestError) {
        throw e;
      }
      logger.error('Error updating branch:', e);
      throw ERRORS.DATABASE_ERROR;
    }
  }

  /**
   * Delete branch (soft delete by setting status to Deleted)
   */
  async deleteBranch(
    branch_id: string,
    transaction?: Transaction
  ): Promise<void> {
    try {
      const branch = await this.getBranchById(branch_id, transaction);
      await branch.update({ status: 'Deleted' }, { transaction });
    } catch (e) {
      if (e instanceof RequestError) {
        throw e;
      }
      logger.error('Error deleting branch:', e);
      throw ERRORS.DATABASE_ERROR;
    }
  }
}
