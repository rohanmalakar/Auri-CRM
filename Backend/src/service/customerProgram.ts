import CustomerRepository from "@repository/customer";
import CustomerProgramRepository from "@repository/customerProgram";
import LoyaltyProgramRepository from "@repository/loyaltyProgram";
import OrganizationRepository from "@repository/organization";
import { ERRORS, RequestError } from "@utils/error";
import createLogger from "@utils/logger";
import sequelize from "@utils/sequelize";

const logger = createLogger("@customerProgramService");

export class CustomerProgramService {
  customerRepository: CustomerRepository;
  organizationRepository: OrganizationRepository; 
  loyaltyProgramRepository: LoyaltyProgramRepository;
  customerProgramRepository: CustomerProgramRepository;
  constructor() {
    this.customerRepository = new CustomerRepository();
    this.organizationRepository = new OrganizationRepository();
    this.loyaltyProgramRepository = new LoyaltyProgramRepository();
    this.customerProgramRepository = new CustomerProgramRepository();
  } 

  /**
   * Enroll a customer in a loyalty program
   */ 
  async enrollCustomerInProgram(data: {
    org_id: string; 
    program_id: string;
    name_en: string;
    name_ar: string;
    email?: string;
    phone: string;
  }): Promise<void> {
    const transaction = await sequelize.transaction();  
    try {
      // Verify organization existsSync
      await this.organizationRepository.getOrganizationById(data.org_id, transaction);
      // Additional logic to enroll customer in program can be added here

      await this.loyaltyProgramRepository.getProgramById(data.program_id, transaction);

      // check if user existsSync
     let customer = await this.customerRepository.getCustomerByPhoneOrNull(data.phone, transaction);

     if(!customer){
        // Create customer
        customer = await this.customerRepository.createCustomer({
          org_id: data.org_id,
          name_en: data.name_en,
          name_ar: data.name_ar,
          phone: data.phone,
          email: data.email,
        }, transaction);
     }

      // Logic to link customer to loyalty program can be added here
      
      const customerProgram = await this.customerProgramRepository.enrollCustomerInProgram({
        org_id: data.org_id,
        customer_id: customer.customer_id ,
        program_id: data.program_id,
        qr_code_url: '', // Logic to generate or fetch QR code URL can be added here
      }, transaction);
      
      await transaction.commit();
    } catch (e: unknown) {
      await transaction.rollback();
      if (e instanceof RequestError) {
        throw e;
      }
      logger.error("Error enrolling customer in program:", e as Error);
      throw ERRORS.INTERNAL_SERVER_ERROR;
    }
  }
}

// Additional methods for CustomerProgramService can be added here

//create methods to enroll customer in program, opt-out, suspend, etc.
