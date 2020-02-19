import Problems from '../models/Problems';
import Package from '../models/Package';
import Courier from '../models/Courier';
import DeletedPkgMail from '../jobs/deletedPkgMail';
import Queue from '../../lib/Queue';

class AdmProblemsController {
    async index(req, res) {
        const prob = await Problems.findAll({ include: [{ all: true }] });
        return res.json(prob);
    }

    async list(req, res) {
        const prob = await Package.findAll({
            include: [{ model: Problems, as: 'problems', required: true }],
        });
        return res.json(prob);
    }

    async delete(req, res) {
        const problem = await Problems.findByPk(req.body.id);

        const pkg = await Package.findByPk(problem.package_id);

        const courier = await Courier.findByPk(pkg.courier_id);

        const dPkg = await Package.destroy({
            where: { id: problem.package_id },
        });

        await Queue.add(DeletedPkgMail.key, { courier, pkg, problem });

        return res.json(dPkg);
    }
}

export default new AdmProblemsController();
