import { Router } from "express";
import { Customer } from "@ftcase-sdk/data";
import CustomerRepository from "../../repositories/CustomerRepository";
import CustomerService from "./customer.service";
import CustomerController from "./customer.controller";
import routes from "./routes";
import { IModuleInit } from "@ftcase-sdk/types";
import ResponseDecorator from "../../common/ResponseDecorator";

export const init: IModuleInit = (router: Router) => {
  const customerRepository = new CustomerRepository(Customer);
  const customerService = new CustomerService(customerRepository);
  const customerController = new CustomerController(customerService);

  routes(customerController).forEach((route) => {
    const { method, url, handler, decorate } = route;

    router[method.toLowerCase()](url, async (req, res) => {
      try {
        const data = await handler(req, res);
        res.json(decorate ? ResponseDecorator(data) : data);
      } catch (err) {
        console.error(err);
        res.status(500).json(ResponseDecorator(err, false));
      }
    });
  });

  return { prefix: "/customers", router };
};
