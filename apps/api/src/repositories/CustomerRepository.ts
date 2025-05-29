import type { Customer } from "@ftcase-sdk/data";
import RepositoryBase from "./RepositoryBase";

export default class CustomerRepository extends RepositoryBase<Customer> {
  async getCustomers(): Promise<Customer[]> {
    const data = await this.findAll();
    return data;
  }

  async createCustomer(payload: Partial<Customer>): Promise<Customer> {
    const data = await this.create(payload);
    return data;
  }

  async updateCustomer(payload: Partial<Customer>): Promise<Customer> {
    const data = await this.update(payload, {
      where: { id: payload.id },
    });
    return data;
  }

  async deleteCustomer(id: string): Promise<boolean> {
    const data = await this.delete(id);
    return data;
  }
}
