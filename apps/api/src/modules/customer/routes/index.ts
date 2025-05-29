import CustomerController from "../customer.controller";
import { Request, Response } from "express";

const routes = (controller: CustomerController) => [
  {
    method: "GET",
    url: "",
    decorate: true,
    handler: async (req: Request, res: Response) => controller.getCustomers(),
  },
  {
    method: "POST",
    url: "",
    decorate: true,
    handler: async (req: Request, res: Response) =>
      controller.createCustomer(req.body),
  },
  {
    method: "PATCH",
    url: "/:id",
    decorate: true,
    handler: async (req: Request, res: Response) =>
      controller.updateCustomer(req.params.id, req.body),
  },
  {
    method: "DELETE",
    url: "/:id",
    decorate: true,
    handler: async (req: Request, res: Response) =>
      controller.deleteCustomer(req.params.id),
  },
];

export default routes;
