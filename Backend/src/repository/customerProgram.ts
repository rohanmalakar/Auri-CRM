import CustomerProgram, { CustomerProgramAttributes } from '@models/customerProgram';
import { ERRORS, RequestError } from '@utils/error';
import createLogger from '@utils/logger';
import { Transaction } from 'sequelize';

const logger = createLogger('@customerProgramRepository');

export default class CustomerProgramRepository {
  /**
   * Check if customer program exists by program name in organization
   */
  // async checkIfCustomerProgramExists(
  //   org_id: string,
  //   program_name: string,
  //   transaction?: Transaction
  // ): Promise<void> {
  //   try {
  //     const program = await CustomerProgram.findOne({
  //       where: {
  //         org_id,
  //         program_name,
  //         status: ['Active', 'Inactive']
  //       },
  //       transaction,
  //     });

  //     if (program) {
  //       throw new RequestError('Customer program with this name already exists in this organization', 30201, 400);
  //     }
  //   } catch (e) {
  //     if (e instanceof RequestError) {
  //       throw e;
  //     }
  //     logger.error('Error checking if customer program exists:', e);
  //     throw ERRORS.DATABASE_ERROR;
  //   }
  // }

  /**
   * Create a new customer program
   */
  async enrollCustomerInProgram(
    data: Partial<CustomerProgramAttributes>,
    transaction?: Transaction
  ): Promise<CustomerProgram> {
    try {
      const program = await CustomerProgram.create(data as any, { transaction });
      return program;
    } catch (e) {
      logger.error('Error creating customer program:', e);
      throw ERRORS.DATABASE_ERROR;
    }
  }

  /**
   * Get customer program by ID
   */
  async getCustomerProgramById(
    program_id: string,
    transaction?: Transaction
  ): Promise<CustomerProgram> {
    try {
      const program = await CustomerProgram.findOne({
        where: {
          program_id,
          status: ['Active', 'Inactive']
        },
        transaction
      });

      if (!program) {
        throw new RequestError('Customer program not found', 30202, 404);
      }

      return program;
    } catch (e) {
      if (e instanceof RequestError) {
        throw e;
      }
      logger.error('Error getting customer program by ID:', e);
      throw ERRORS.DATABASE_ERROR;
    }
  }

 

  /**
   * Get all customer programs for an organization
   */
  async getCustomerProgramsByOrgId(
    org_id: string,
    transaction?: Transaction
  ): Promise<CustomerProgram[]> {
    try {
      const programs = await CustomerProgram.findAll({
        where: {
          org_id,
          status: ['Active', 'Inactive']
        },
        order: [['creation_datetime', 'DESC']],
        transaction,
      });
      return programs;
    } catch (e) {
      logger.error('Error getting customer programs by org ID:', e);
      throw ERRORS.DATABASE_ERROR;
    }
  }

  /**
   * Update customer program
   */
  async updateCustomerProgram(
    program_id: string,
    data: Partial<CustomerProgramAttributes>,
    transaction?: Transaction
  ): Promise<CustomerProgram> {
    try {
      const program = await this.getCustomerProgramById(program_id, transaction);
      await program.update(data, { transaction });
      return program;
    } catch (e) {
      if (e instanceof RequestError) {
        throw e;
      }
      logger.error('Error updating customer program:', e);
      throw ERRORS.DATABASE_ERROR;
    }
  }

  // /**
  //  * Delete customer program (soft delete by setting status to Deleted)
  //  */
  // async deleteCustomerProgram(
  //   program_id: string,
  //   transaction?: Transaction
  // ): Promise<void> {
  //   try {
  //     const program = await this.getCustomerProgramById(program_id, transaction);
  //     await program.update({ status: 'Deleted' }, { transaction });
  //   } catch (e) {
  //     if (e instanceof RequestError) {
  //       throw e;
  //     }
  //     logger.error('Error deleting customer program:', e);
  //     throw ERRORS.DATABASE_ERROR;
  //   }
  // }
}
