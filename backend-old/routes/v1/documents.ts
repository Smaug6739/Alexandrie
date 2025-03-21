import { Router } from 'express';
import DocumentsCtrl from '../../controllers/documents.controller';
import authMid from '../../middlewares/auth';

const DocumentsRouter: Router = Router();

export default (client: App): Iroute => {
  const controller = new DocumentsCtrl(client);
  return {
    route: 'documents',
    version: 1,
    router() {
      DocumentsRouter.get('/', authMid, (req, res) => controller.getAllDocuments(req, res));
      DocumentsRouter.get('/:id', authMid, (req, res) => controller.getDocument(req, res));
      DocumentsRouter.post('/', authMid, (req, res) => controller.add(req, res));
      DocumentsRouter.patch('/:id', authMid, (req, res) => controller.updateDocument(req, res));
      DocumentsRouter.delete('/:id', authMid, (req, res) => controller.deleteDocument(req, res));
      return DocumentsRouter;
    },
  };
};
