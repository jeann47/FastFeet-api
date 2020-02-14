import * as Yup from 'yup';
import Courier from '../models/Courier';
import File from '../models/Files';

class CourierController {
    async store(req, res) {
        const schema = Yup.object().shape({
            name: Yup.string().required(),
            email: Yup.string()
                .email()
                .required(),
            avatar_id: Yup.number(),
        });

        if (!(await schema.isValid(req.body))) {
            return res.status(400).json({ error: 'Validation fails!' });
        }

        const exist = await Courier.findOne({
            where: { email: req.body.email },
        });

        if (exist) {
            return res
                .status(400)
                .json({ error: 'There is another courier using this email!' });
        }
        const courier = await Courier.create(req.body);

        return res.json(courier);
    }

    async index(req, res) {
        const courier = await Courier.findAll({
            include: [
                {
                    model: File,
                    as: 'avatar',
                    attributes: ['name', 'path', 'url'],
                },
            ],
        });
        return res.json(courier);
    }

    async update(req, res) {
        const schema = Yup.object().shape({
            id: Yup.number().required(),
            name: Yup.string(),
            email: Yup.string().email(),
            avatar_id: Yup.number(),
        });

        if (!(await schema.isValid(req.body))) {
            return res.status(400).json({ error: 'Validation fails!' });
        }

        const { id, email, avatar_id } = req.body;

        if (email) {
            const exist = await Courier.findOne({
                where: { email },
            });

            if (exist.dataValues.email === email) {
                return res.status(401).json({
                    error: 'This courier already use this email!',
                });
            }

            if (exist) {
                return res.status(400).json({
                    error: 'There is another courier using this email!',
                });
            }
        }

        if (avatar_id) {
            const exist = await File.findByPk(avatar_id);

            if (!exist) {
                return res.status(400).json({
                    error: 'Image not found!',
                });
            }
        }

        const courier = Courier.update(req.body, { where: { id } });
        return res.json(courier);
    }

    async delete(req, res) {
        const { id } = req.body;
        const deleted = Courier.destroy({ where: { id } });
        return res.json(deleted);
    }
}

export default new CourierController();
