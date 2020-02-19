import Mail from '../../lib/Mail';

class DeletedPkgMail {
    get key() {
        return 'DeletedPkgMail';
    }

    async handle({ data }) {
        const { courier, pkg, problem } = data;

        console.log('Run');
        Mail.sendMail({
            to: `${courier.name} <${courier.email}>`,
            subject: `A entrega do produto ${pkg.product} foi cancelada`,
            template: 'delPkg',
            context: {
                courier: courier.name,
                product: pkg.product,
                problem: problem.description,
            },
        }); // upgrade later
    }
}

export default new DeletedPkgMail();
