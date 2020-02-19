import * as Yup from 'yup';
import Problems from '../models/Problems';
import Package from '../models/Package';

class ProblemsController {
    async store(req, res) {
        const schema = Yup.object().shape({
            package_id: Yup.number().required(),
            description: Yup.string().required(),
        });

        if (!(await schema.isValid(req.body))) {
            return res.status(400).json({ error: 'Validation fails!' });
        }

        const pkg = await Package.findByPk(req.body.package_id);

        if (!pkg) {
            return res.status(404).json({ error: 'package not found' });
        }

        const prob = await Problems.create(req.body);
        return res.json(prob);
    }

    async list(req, res) {
        const prob = await Problems.findAll({ where: { id: req.params.id } });
        return res.json(prob);
    }
}

export default new ProblemsController();
