import * as Yup from 'yup';
import Package from '../models/Package';
import Courier from '../models/Courier';
import Recipient from '../models/Recipients';
import Queue from '../../lib/Queue';
import NewPkgMail from '../jobs/newPkgMail';
import verifications from '../util/verifications';

const verify = verifications.Package;

class AdmPackageController {
    async store(req, res) {
        const schema = Yup.object().shape({
            recipient_id: Yup.number().required(),
            courier_id: Yup.number().required(),
            product: Yup.string().required(),
        });

        if (!(await schema.isValid(req.body))) {
            return res.status(400).json({ error: 'Validation fails!' });
        }

        const pkg = await Package.create(req.body);
        const courier = await Courier.findByPk(req.body.courier_id);
        const recipient = await Recipient.findByPk(req.body.recipient_id);
        // add notifications too
        await Queue.add(NewPkgMail.key, { courier, recipient, pkg });

        return res.json(pkg);
    }

    async index(req, res) {
        const packages = await Package.findAll();
        return res.json(packages);
    }

    async update(req, res) {
        const schema = Yup.object().shape({
            id: Yup.number().required(),
            recipient_id: Yup.number(),
            courier_id: Yup.number(),
            product: Yup.string(),
            canceled_at: Yup.date(),
        });

        if (!(await schema.isValid(req.body))) {
            return res.status(400).json({ error: 'Validation fails!' });
        }

        let pkg = await Package.findByPk(req.body.id);

        if (!pkg) {
            return res.status(404).json({
                error: `Could not find a package with id ${req.body.id}`,
            });
        }

        if (req.canceled_at) {
            const canGo = await verify.cancelable(pkg);

            if (canGo.status !== 200) {
                return res.status(canGo.status).json(canGo.res);
            }
        }

        pkg = await Package.update(req.body, { where: { id: req.body.id } });

        return res.json(pkg);
    }

    async delete(req, res) {
        const pkg = await Package.destroy({ where: { id: req.body.id } });
        return res.json(pkg);
    }
}

export default new AdmPackageController();
