import { Authroutes } from "@/Modules/Auth/Auth.route";
import { UserRoutes } from "@/Modules/User/User.route";
import { Router } from "express";

const routes = Router();

export const moduleRoute = [
  {
    path: "/auth",
    route: Authroutes,
  },

  {
    path: "/users",
    route: UserRoutes,
  },
];

moduleRoute.forEach((Route) => routes.use(Route.path, Route.route));

export default routes;
