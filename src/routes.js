import { Router } from 'express';

// import authToken from './app/middlewares/auth';

import UserController from './app/controllers/UserController';
import SessionController from './app/controllers/SessionController';
import RecipientController from './app/controllers/RecipientController';

const routes = new Router();

routes.post('/users', UserController.store);
routes.post('/login', SessionController.store);
routes.post('/rec', RecipientController.store);
routes.post('/recu', RecipientController.update);

export default routes;
