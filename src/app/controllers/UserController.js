import * as Yup from 'yup';
import User from '../models/User';

class UserController {
    async store(req, res) {
        const schema = Yup.object().shape({
            name: Yup.string().required(),
            email: Yup.string()
                .email()
                .required(),
            password: Yup.string().required(),
        });

        if (!(await schema.isValid(req.body))) {
            return res.status(400).json({ error: 'Validation fails!' });
        }

        const exist = await User.findOne({ where: { email: req.body.email } });
        if (exist) {
            return res
                .status(400)
                .json({ error: 'There is another user using this email!' });
        }
        const { name, email } = await User.create(req.body);

        return res.json({ name, email });
    }

    async update(req, res) {
        const schema = Yup.object().shape({
            name: Yup.string(),
            email: Yup.string().email(),
            oldPassword: Yup.string(),
            password: Yup.string().when('oldPassword', (oldPassword, field) =>
                oldPassword ? field.required() : field
            ),
            confirmPassword: Yup.string().when('password', (password, field) =>
                password ? field.required().oneOf([Yup.ref('password')]) : field
            ),
        });
        if (!(await schema.isValid(req.body))) {
            return res.status(400).json({ error: 'validation fails' });
        }

        const { email, oldPassword } = req.body;

        const user = await User.findByPk(req.userId);

        if (email !== user.email) {
            const exist = await User.findOne({ where: { email } });
            if (exist)
                return res
                    .status(400)
                    .json({ error: 'There is another user using this email!' });
        }
        if (oldPassword && !(await User.checkPass(oldPassword)))
            return res.status(401).json({ error: 'Passoword does not match' });

        const { id, name, provider } = await User.update(req.body, {
            where: { id: req.userId },
        });
        return res.json({ id, name, email, provider });
    }

    async delete(req, res) {
        const deleted = await User.destroy({ where: { id: req.userId } });
        return res.json(deleted);
    }
}

export default new UserController();
