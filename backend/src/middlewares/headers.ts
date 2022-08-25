import { IObject } from '../types';


export default (req: IObject, res: IObject, next: Function) => {
	res.setHeader('Access-Control-Allow-Origin', 'http://localhost:8080')
	res.setHeader("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
	res.setHeader('Access-Control-Allow-Credentials', 'true')
	next()
}