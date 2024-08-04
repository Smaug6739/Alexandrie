import { Router } from 'express';
//import statsCtrl from '../../controllers/stats.controller';
//import authMid from '../../middlewares/auth';
//import isAdmin from '../../middlewares/is_admin';

const UsersRouter: Router = Router();

export default (_: App): Iroute => {
  //const controller = new statsCtrl(client);
  return {
    route: 'stats',
    version: 1,
    router() {
      //   UsersRouter.get('/', authMid, isAdmin, (req, res) => {});
      return UsersRouter;
    },
  };
};
