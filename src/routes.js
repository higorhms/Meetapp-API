import { Router } from 'express';
import multer from 'multer';
import UserController from './app/controllers/UserController';
import SessionController from './app/controllers/SessionController';
import authMiddleware from './app/middlewares/auth';

import multerConfig from './config/multer';
import FileController from './app/controllers/FileController';
import MeetupController from './app/controllers/MeetupController';
import SubscriptionController from './app/controllers/SubscriptionController';
import MeetupEventController from './app/controllers/MeetupEventController';
import RegistrationsController from './app/controllers/RegistrationsController';

const routes = new Router();
const upload = multer(multerConfig);

routes.post('/users', UserController.store);
routes.post('/sessions', SessionController.store);

routes.use(authMiddleware);

// Route for upload of files
routes.post('/files', upload.single('file'), FileController.store);
routes.get('/files/:banner_id', FileController.index);

routes.put('/users', UserController.update);

routes.get('/meetups/:meetupId', MeetupController.index);
routes.get('/meetups', MeetupController.index);
routes.post('/meetups', MeetupController.store);
routes.put('/meetups/:meetupId', MeetupController.update);
routes.delete('/meetups/:meetupId', MeetupController.delete);

routes.get('/events', MeetupEventController.index);

routes.post('/subscriptions', SubscriptionController.store);
routes.delete('/subscriptions/:meetupId', SubscriptionController.delete);

routes.get('/registrations', RegistrationsController.index);

export default routes;
