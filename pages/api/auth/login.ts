import {prisma} from '../../../config/db'
import bcrypt from 'bcrypt'

export default async function handler(req: any, res: any) {
    // res.status(200).setHeader('Access-Control-Allow-Origin', '*').json({ name: 'this is users api route' });

    switch (req.method) {
    
        case 'POST':
            return await loginUser(req, res)
            break;
    
        default:
            break;
    }
}

async function loginUser(req: any, res: any){
    const {email, password} = req.body

    try {

        const user = await prisma.user.findFirst({
            select: {
                id: true,
                fullname: true,
                email: true,
                role: true,
                password: true
              },
            where: {
                email: {
                    equals: email
                }
            },
            
        })

        console.log(user);

        if (!user) return res.status(404).json({msg: 'User Not Found'})

        const match = await bcrypt.compare(password, user.password);
        if (!match) return res.status(401).json({msg: 'Wrong Email Or Password'})

        return res.status(200).json(user)
    } catch (error) {
        return res.status(500).json(error)
    }
}