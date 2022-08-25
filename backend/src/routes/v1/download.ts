import { Router } from 'express';
import * as downloadCtrl from '../../controllers/download';
import { Iroute } from '../../types';
const DownloadRouter: Router = Router();

DownloadRouter.get('/image/:file', downloadCtrl.downloadImage)
DownloadRouter.get('/archive/:file', downloadCtrl.downloadArchive)


export const infos: Iroute = {
	route: "download",
	version: 1,
	router: DownloadRouter
};