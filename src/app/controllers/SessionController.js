import jwt from 'jsonwebtoken';
import User from '../models/User';
import authCfg from '../../config/auth';

class SessionController {
    async store(req, res) {
        const { email, password } = req.body;

        const user = await User.findOne({ where: { email } });
        if (!user)
            return res
                .status(401)
                .json({ error: 'This email is not registered!' });

        if (!(await user.checkPass(password)))
            return res.status(401).json({ error: 'Password does not match!' });

        const { id, name } = user;

        return res.json({
            user: { id, name, email },
            token: jwt.sign({ id }, authCfg.secret, {
                expiresIn: '7d',
            }),
        });
    }
}

export default new SessionController();
