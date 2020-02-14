import { Router } from 'express';
import multer from 'multer';
import multerConfig from './config/multer';
// import authToken from './app/middlewares/auth';

import UserController from './app/controllers/UserController';
import SessionController from './app/controllers/SessionController';
import RecipientController from './app/controllers/RecipientController';
import FileController from './app/controllers/FileController';
import CourierController from './app/controllers/CourierController';

const routes = new Router();
const upload = multer(multerConfig);

routes.post('/file', upload.single('file'), FileController.store);
routes.post('/courier', CourierController.store);
routes.get('/couriers', CourierController.index);
routes.put('/couriersu', CourierController.update);
routes.delete('/couriersd', CourierController.delete);

routes.post('/users', UserController.store);
routes.post('/login', SessionController.store);
routes.post('/rec', RecipientController.store);
routes.post('/recu', RecipientController.update);

export default routes;
