import { Customer } from "@ftcase-sdk/data";
import CustomerService from "./customer.service";

export default class CustomerController {
  constructor(private readonly service: CustomerService) {
    this.service = service;
  }

  async getCustomers() {
    return await this.service.getCustomers();
  }

  async createCustomer(payload: Partial<Customer>) {
    return await this.service.createCustomer(payload);
  }

  async updateCustomer(id: string, payload: Partial<Customer>) {
    return await this.service.updateCustomer(id, payload);
  }

  async deleteCustomer(id: string) {
    return await this.service.deleteCustomer(id);
  }
}
