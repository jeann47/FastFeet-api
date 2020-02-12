import { Router } from 'express';

const routes = new Router();

routes.get('/', (req, res) => res.json({ Work: true }));

export default routes;
