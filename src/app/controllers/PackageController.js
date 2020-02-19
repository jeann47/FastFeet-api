import * as Yup from 'yup';
import Package from '../models/Package';
import Recipient from '../models/Recipients';
import Problems from '../models/Problems';
import verifications from '../util/verifications';

const verify = verifications.Package;

class PackageController {
    async index(req, res) {
        const schema = Yup.object().shape({
            courier_id: Yup.number().required(),
            canceled_at: Yup.date(),
            start_date: Yup.date(),
            end_date: Yup.date(),
        });

        if (!(await schema.isValid(req.query))) {
            return res.status(400).json({ error: 'Validation fails!' });
        }

        const pkg = await Package.findAll({
            where: req.params,
            include: [
                { model: Recipient, as: 'recipient', required: true },
                { model: Problems, as: 'problems' },
            ],
            attributes: [
                'id',
                'product',
                'canceled_at',
                'start_date',
                'end_date',
            ],
        });
        return res.json(pkg);
    }

    async update(req, res) {
        const schema = Yup.object().shape({
            id: Yup.number().required(),
            courier_id: Yup.number().required(),
            canceled_at: Yup.date(),
            start_date: Yup.date(),
            end_date: Yup.date(),
            signature_id: Yup.number().when('end_date', (end_date, field) =>
                end_date ? field.required() : field
            ),
        });

        if (!(await schema.isValid(req.body))) {
            return res.status(400).json({ error: 'Validation fails!' });
        }

        const {
            id,
            courier_id,
            canceled_at,
            start_date,
            end_date,
            recipient_id,
            product,
        } = req.body;

        if (recipient_id || product) {
            return res.status(401).json({
                error: 'Only administrators can perform this request',
            });
        }

        let pkg = await Package.findByPk(id);

        if (!pkg) {
            return res
                .status(404)
                .json({ error: `Could not find a package with id ${id}` });
        }

        if (courier_id !== pkg.courier_id) {
            return res
                .status(401)
                .json({ error: 'This package is assigned to another courier' });
        }

        let canGo = null;

        if (canceled_at) {
            canGo = await verify.cancelable(pkg);

            if (canGo.status !== 200) {
                return res.status(canGo.status).json(canGo.res);
            }
        }

        if (start_date) {
            canGo = await verify.startable(pkg, start_date);

            if (canGo.status !== 200) {
                return res.status(canGo.status).json(canGo.res);
            }
        }

        if (end_date) {
            canGo = await verify.finalizable(pkg);

            if (canGo.status !== 200) {
                return res.status(canGo.status).json(canGo.res);
            }
        }

        pkg = await Package.update(req.body, { where: { id } });

        return res.json(pkg);
    }
}

export default new PackageController();
