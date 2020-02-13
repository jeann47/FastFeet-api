import * as Yup from 'yup';
import Recipient from '../models/Recipients';

class RecipientController {
    async store(req, res) {
        const schema = Yup.object().shape({
            name: Yup.string().required(),
            address: Yup.object()
                .shape({
                    street: Yup.string().required(),
                    number: Yup.number().required(),
                    complement: Yup.string(),
                    state: Yup.string().required(),
                    city: Yup.string().required(),
                    zipcode: Yup.string().required(),
                    type: Yup.string().default('Casa'),
                })
                .required(),
        });

        if (!(await schema.isValid(req.body)))
            return res.status(400).json({ error: 'Validation fails!' });

        const { name, address } = await Recipient.create({
            name: req.body.name,
            ...req.body.address,
        });
        return res.json({ name, address });
    }

    async index(req, res) {
        const { name, address } = await Recipient.findAll();
        return res.json({ name, address });
    }

    async update(req, res) {
        const schema = Yup.object().shape({
            id: Yup.number().required(),
            name: Yup.string(),
            address: Yup.object().shape({
                street: Yup.string(),
                number: Yup.number(),
                complement: Yup.string(),
                state: Yup.string(),
                city: Yup.string(),
                zipcode: Yup.string(),
                type: Yup.string(),
            }),
        });

        if (!(await schema.isValid(req.body)))
            return res.status(400).json({ error: 'Validation fails!' });

        const { id, name, address } = req.body;

        const done = await Recipient.update(
            { name, ...address },
            { where: { id } }
        );
        return res.json(done);
    }
}

export default new RecipientController();
