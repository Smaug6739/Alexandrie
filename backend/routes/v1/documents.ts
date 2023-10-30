import { Router } from 'express';
import DocumentsCtrl from '../../controllers/documents.controller';
import authMid from '../../middlewares/auth';
import type { App } from '../../app';
import type { Iroute } from '../../types';

const DocumentsRouter: Router = Router();

export default (client: App): Iroute => {
  const controller = new DocumentsCtrl(client);
  return {
    route: 'documents',
    version: 1,
    router() {
      DocumentsRouter.get('/', (req, res) => controller.getAllDocuments(req, res));
      DocumentsRouter.get('/:id', (req, res) => controller.getDocument(req, res));
      DocumentsRouter.post('/', authMid, (req, res) => controller.add(req, res));
      DocumentsRouter.patch('/:id', authMid, (req, res) => controller.updateDocument(req, res));
      DocumentsRouter.delete('/:id', authMid, (req, res) => controller.deleteDocument(req, res));
      return DocumentsRouter;
    },
  };
};
