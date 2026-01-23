import { OrgCustomer, CustomerAttributes } from '@models/customer';
import { ERRORS, RequestError } from '@utils/error';
import createLogger from '@utils/logger';
import { Transaction, Op } from 'sequelize';

const logger = createLogger('@customerRepository');

export default class CustomerRepository {
  /**
   * Check if customer exists by phone in organization
   */
  async checkIfCustomerExists(
    org_id: string,
    phone: string,
    transaction?: Transaction
  ): Promise<void> {
    try {
      const customer = await OrgCustomer.findOne({
        where: {
          org_id,
          phone,
          status: ['Active', 'Inactive']
        },
        transaction,
      });

      if (customer) {
        throw new RequestError('Customer with this phone number already exists in this organization', 30201, 400);
      }
    } catch (e) {
      if (e instanceof RequestError) {
        throw e;
      }
      logger.error('Error checking if customer exists:', e);
      throw ERRORS.DATABASE_ERROR;
    }
  }

  /**
   * Create a new customer
   */
  async createCustomer(
    data: Partial<CustomerAttributes>,
    transaction?: Transaction
  ): Promise<OrgCustomer> {
    try {
      const customer = await OrgCustomer.create(data as any, { transaction });
      return customer;
    } catch (e) {
      logger.error('Error creating customer:', e);
      throw ERRORS.DATABASE_ERROR;
    }
  }

  /**
   * Get customer by ID
   */
  async getCustomerById(
    customer_id: string,
    transaction?: Transaction
  ): Promise<OrgCustomer> {
    try {
      const customer = await OrgCustomer.findOne({
        where: {
          customer_id,
          status: ['Active', 'Inactive']
        },
        transaction
      });

      if (!customer) {
        throw new RequestError('Customer not found', 30202, 404);
      }

      return customer;
    } catch (e) {
      if (e instanceof RequestError) {
        throw e;
      }
      logger.error('Error getting customer by ID:', e);
      throw ERRORS.DATABASE_ERROR;
    }
  }

  /**
   * Get customer by ID
   */
  async getCustomerByPhoneOrNull(
    phone: string,
    transaction?: Transaction
  ): Promise< OrgCustomer | null> {
    try {
      const customer = await OrgCustomer.findOne({
        where: {
          phone
        },
        transaction
      });

      if (!customer) {
         return null
      }

      return customer;
    } catch (e) {
      if (e instanceof RequestError) {
        throw e;
      }
      logger.error('Error getting customer by ID:', e);
      throw ERRORS.DATABASE_ERROR;
    }
  }


  

  /**
   * Get all customers for an organization
   */
  async getCustomersByOrgId(
    org_id: string,
    transaction?: Transaction
  ): Promise<OrgCustomer[]> {
    try {
      const customers = await OrgCustomer.findAll({
        where: {
          org_id,
          status: ['Active', 'Inactive']
        },
        order: [['creation_datetime', 'DESC']],
        transaction,
      });
      return customers;
    } catch (e) {
      logger.error('Error getting customers by org ID:', e);
      throw ERRORS.DATABASE_ERROR;
    }
  }

  /**
   * Update customer
   */
  async updateCustomer(
    customer_id: string,
    data: Partial<CustomerAttributes>,
    transaction?: Transaction
  ): Promise<OrgCustomer> {
    try {
      const customer = await this.getCustomerById(customer_id, transaction);
      await customer.update(data, { transaction });
      return customer;
    } catch (e) {
      if (e instanceof RequestError) {
        throw e;
      }
      logger.error('Error updating customer:', e);
      throw ERRORS.DATABASE_ERROR;
    }
  }

  /**
   * Delete customer (soft delete by setting status to Deleted)
   */
  async deleteCustomer(
    customer_id: string,
    transaction?: Transaction
  ): Promise<void> {
    try {
      const customer = await this.getCustomerById(customer_id, transaction);
      await customer.update({ status: 'Deleted' }, { transaction });
    } catch (e) {
      if (e instanceof RequestError) {
        throw e;
      }
      logger.error('Error deleting customer:', e);
      throw ERRORS.DATABASE_ERROR;
    }
  }
}