import {Request, Response} from 'express'

class UserController {
    public async getInfo(req: Request, res: Response) {
        return res.status(200).json({msg: "Info user"})
    }
}

export default new UserController()