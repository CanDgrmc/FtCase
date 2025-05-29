import { Router } from "express";
export type IModuleInit = (router: Router) => {
  prefix: string;
  router: Router;
};
