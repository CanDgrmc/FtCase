import { Customer } from "@ftcase-sdk/data";
import CustomerRepository from "../../repositories/CustomerRepository";

export default class CustomerService {
  customerRepository: CustomerRepository;
  constructor(customerRepository: CustomerRepository) {
    this.customerRepository = customerRepository;
  }

  async getCustomers() {
    return await this.customerRepository.findAll();
  }

  async createCustomer(payload: Partial<Customer>) {
    return await this.customerRepository.createCustomer(payload);
  }

  async updateCustomer(id: string, payload: Partial<Customer>) {
    this.customerRepository.updateCustomer({ id, ...payload });
  }

  async deleteCustomer(id: string) {
    return await this.customerRepository.deleteCustomer(id);
  }
}
