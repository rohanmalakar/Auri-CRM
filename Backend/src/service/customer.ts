import CustomerRepository from '@repository/customer';
import OrganizationRepository from '@repository/organization';
import { OrgCustomer, CustomerAttributes } from '@models/customer';
import { ERRORS, RequestError } from '@utils/error';
import createLogger from '@utils/logger';
import sequelize from '@utils/sequelize';

const logger = createLogger('@customerService');

export class CustomerService {
  customerRepository: CustomerRepository;
  organizationRepository: OrganizationRepository;

  constructor() {
    this.customerRepository = new CustomerRepository();
    this.organizationRepository = new OrganizationRepository();
  }

  /**
   * Create a new customer
   */
  async createCustomer(data: {
    customer_id?: string;
    org_id: string;
    name_en: string;
    name_ar: string;
    phone: string;
    email?: string;
    joined_at?: Date;
  }): Promise<OrgCustomer> {
    const transaction = await sequelize.transaction();
    try {
      // Verify organization exists
      await this.organizationRepository.getOrganizationById(data.org_id, transaction);

      // Check if customer phone already exists in this organization
      await this.customerRepository.checkIfCustomerExists(
        data.org_id,
        data.phone,
        transaction
      );

      // Create customer
      // Note: qr_token is auto-generated in the model via UUID if not provided
      const customer = await this.customerRepository.createCustomer(data, transaction);

      await transaction.commit();
      return customer;
    } catch (e) {
      await transaction.rollback();
      if (e instanceof RequestError) {
        throw e;
      }
      logger.error('Error creating customer:', e);
      throw ERRORS.INTERNAL_SERVER_ERROR;
    }
  }

  /**
   * Get all customers for an organization
   */
  async getCustomersByOrgId(org_id: string): Promise<OrgCustomer[]> {
    try {
      // Verify organization exists
      await this.organizationRepository.getOrganizationById(org_id);

      const customers = await this.customerRepository.getCustomersByOrgId(org_id);
      return customers;
    } catch (e) {
      if (e instanceof RequestError) {
        throw e;
      }
      logger.error('Error getting customers by org ID:', e);
      throw ERRORS.INTERNAL_SERVER_ERROR;
    }
  }

  /**
   * Get a customer by ID
   */
  async getCustomerById(customer_id: string): Promise<OrgCustomer> {
    try {
      const customer = await this.customerRepository.getCustomerById(customer_id);
      return customer;
    } catch (e) {
      if (e instanceof RequestError) {
        throw e;
      }
      logger.error('Error getting customer by ID:', e);
      throw ERRORS.INTERNAL_SERVER_ERROR;
    }
  }

  /**
   * Update a customer
   */
  async updateCustomer(
    customer_id: string,
    data: Partial<CustomerAttributes>
  ): Promise<OrgCustomer> {
    const transaction = await sequelize.transaction();
    try {
      // Get existing customer
      const existingCustomer = await this.customerRepository.getCustomerById(customer_id, transaction);

      // If phone is being updated, check if new phone already exists in the same org
      if (data.phone && data.phone !== existingCustomer.phone) {
        await this.customerRepository.checkIfCustomerExists(
          existingCustomer.org_id,
          data.phone,
          transaction
        );
      }

      // Update customer
      const customer = await this.customerRepository.updateCustomer(
        customer_id,
        data,
        transaction
      );

      await transaction.commit();
      return customer;
    } catch (e) {
      await transaction.rollback();
      if (e instanceof RequestError) {
        throw e;
      }
      logger.error('Error updating customer:', e);
      throw ERRORS.INTERNAL_SERVER_ERROR;
    }
  }

  /**
   * Delete a customer (soft delete)
   */
  async deleteCustomer(customer_id: string): Promise<void> {
    const transaction = await sequelize.transaction();
    try {
      await this.customerRepository.deleteCustomer(customer_id, transaction);
      await transaction.commit();
    } catch (e) {
      await transaction.rollback();
      if (e instanceof RequestError) {
        throw e;
      }
      logger.error('Error deleting customer:', e);
      throw ERRORS.INTERNAL_SERVER_ERROR;
    }
  }
}