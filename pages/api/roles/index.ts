import {prisma} from '../../../config/db'

export default async function handler(req: any, res: any) {
    // res.status(200).setHeader('Access-Control-Allow-Origin', '*').json({ name: 'this is users api route' });

    switch (req.method) {
        case 'GET':
            return await getRoles(req, res)
            break;

        case 'POST':
            // return await addUser(req, res)
            break;
    
        default:
            break;
    }
}

async function getRoles(req: any, res: any){
    try {
        const result = await prisma.role.findMany()
        return res.status(200).json(result)
    } catch (error) {
        return res.status(500).json(error)
    }
}