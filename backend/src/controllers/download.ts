import { join } from 'path';
import { existsSync } from 'fs'
import { IObject } from '../types';
import { error } from '../utils/functions'

export function downloadImage(req: IObject, res: IObject): void {
	const file = req.params.file;
	const path = join(__dirname, `../../public/uploads/projects/images/${file}`)
	if (existsSync(path)) res.download(path);
	else res.status(404).json(error('File not found.'))
}

export function downloadArchive(req: IObject, res: IObject): void {
	const file = req.params.file;
	const path = join(__dirname, `../../public/uploads/projects/archives/${file}`)
	if (existsSync(path)) res.download(path);
	else res.status(404).json(error('File not found.'))
}

