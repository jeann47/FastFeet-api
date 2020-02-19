import * as Yup from 'yup';
import Problems from '../models/Problems';
import Package from '../models/Package';

class ProblemsController {
    async store(req, res) {
        const schema = Yup.object().shape({
            package_id: Yup.number().required(),
        });

        if (!(await schema.isValid(req.params))) {
            return res.status(400).json({ error: 'Validation fails!' });
        }

        const { package_id } = req.params;
        const { description } = req.body;
        const pkg = await Package.findByPk(package_id);

        if (!pkg) {
            return res.status(404).json({ error: 'package not found' });
        }

        const prob = await Problems.create({ package_id, description });
        return res.json(prob);
    }

    async list(req, res) {
        const prob = await Package.findAll({
            include: [{ model: Problems, as: 'problems', required: true }],
            where: { courier_id: req.params.courier_id },
        });
        return res.json(prob);
    }

    async index(req, res) {
        const prob = await Problems.findAll({
            where: { package_id: req.params.package_id },
        });
        return res.json(prob);
    }
}

export default new ProblemsController();
