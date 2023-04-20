import {prisma} from '../../../config/db'
import bcrypt from 'bcrypt'


export default async function handler(req: any, res: any) {
    // res.status(200).setHeader('Access-Control-Allow-Origin', '*').json({ name: 'this is users api route' });

    switch (req.method) {
        case 'GET':
            return await getUsers(req, res)
            break;

        case 'POST':
            return await createUser(req, res)
            break;
    
        default:
            break;
    }
}

async function getUsers(req: any, res: any){
    try {
        const result = await prisma.user.findMany({
            select: {
                id: true,
                fullname: true,
                email: true,
                role: true
              }
        })
        return res.status(200).json(result)
    } catch (error) {
        return res.status(500).json(error)
    }
}
async function createUser(req: any, res: any){
    
    const {fullname, email, password, roleId} = req.body

    const salt = await bcrypt.genSalt();
    const hashPassword = await bcrypt.hash(password, salt);

    try {
        const data = {
            fullname: fullname,
            email: email,
            password: hashPassword,
            roleId: roleId,
        }
        await prisma.user.create({data: data})
        const result = await prisma.user.findMany({
            select: {
                id: true,
                fullname: true,
                email: true,
                role: true
              }
        })
        return res.status(200).json(result)
    } catch (error) {
        return res.status(500).json(error)
        
    }
}