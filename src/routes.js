import { Router } from 'express';
import multer from 'multer';
import multerConfig from './config/multer';
import authToken from './app/middlewares/auth';

import Controller from './app/controllers';

const routes = new Router();
const upload = multer(multerConfig);

// login

routes.post('/login', Controller.SessionController.store);

// Admin user
routes.post('/singup', Controller.UserController.store);

// problems
routes.post(
    '/delivery/:package_id/problems',
    Controller.ProblemsController.store
);
routes.get(
    '/courier/:courier_id/packages/problems',
    Controller.ProblemsController.list
);
routes.get(
    '/package/:package_id/problems',
    Controller.ProblemsController.index
);

// packages
routes.get('/packages', Controller.PackageController.index);
routes.put('/package/update', Controller.PackageController.update);

// ADMINS ONLY
routes.use(authToken);

routes.put('/user/update', Controller.UserController.update);
routes.delete('/user/delete', Controller.UserController.delete);

// recipient
routes.post('/recipient', Controller.RecipientController.store);
routes.get('/recipient', Controller.RecipientController.index);
routes.put('/recipient', Controller.RecipientController.update);

// problems
routes.get('packages', Controller.AdmProblemsController.index);
routes.delete(
    'problem/:id/cancel-delivery',
    Controller.AdmProblemsController.delete
);

// packages

routes.post('package/add', Controller.AdmPackageController.store);
routes.get('/packages/all', Controller.AdmPackageController.index);
routes.put('package/:id/update', Controller.AdmPackageController.update);
routes.delete('package/:id/delete', Controller.AdmPackageController.delete);

// files
routes.post('/file', upload.single('file'), Controller.FileController.store);

// courier
routes.post('/courier/add', Controller.CourierController.store);
routes.get('/couriers', Controller.CourierController.index);
routes.put('/courier/:id/update', Controller.CourierController.update);
routes.delete('/courier/:id/delete', Controller.CourierController.delete);

export default routes;
