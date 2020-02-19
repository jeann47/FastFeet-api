import { Router } from 'express';
import multer from 'multer';
import multerConfig from './config/multer';
// import authToken from './app/middlewares/auth';

import UserController from './app/controllers/UserController';
import SessionController from './app/controllers/SessionController';
import RecipientController from './app/controllers/RecipientController';
import FileController from './app/controllers/FileController';
import CourierController from './app/controllers/CourierController';
import PackageController from './app/controllers/PackageController';
import AdmProblemsController from './app/controllers/AdmProblemsController';
import ProblemsController from './app/controllers/ProblemsController';

const routes = new Router();
const upload = multer(multerConfig);

// routes.post('/pkg', PackageController.store);
routes.get('/pkg/:courier_id', PackageController.index);
routes.get('/prob', AdmProblemsController.list);
routes.post('/prob', ProblemsController.store);
// routes.delete('/prob', ProblemsController.delete);
// routes.put('/pkg', PackageController.update);

routes.post('/file', upload.single('file'), FileController.store);
routes.post('/courier', CourierController.store);
routes.get('/couriers', CourierController.index);
routes.put('/couriersu', CourierController.update);
routes.delete('/couriersd', CourierController.delete);

routes.post('/users', UserController.store);
routes.post('/login', SessionController.store);
routes.get('/rec', RecipientController.index);
routes.post('/recu', RecipientController.store);

export default routes;
