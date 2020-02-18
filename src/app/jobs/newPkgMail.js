import Mail from '../../lib/Mail';

class NewPkgMail {
    get key() {
        return 'NewPkgMail';
    }

    async handle({ data }) {
        const { courier, recipient, pkg } = data;

        console.log('Run');
        Mail.sendMail({
            to: `${courier.name} <${courier.email}>`,
            subject: 'Novo pacote',
            template: 'newPkg',
            context: {
                courier: courier.name,
                recipient: recipient.name,
                product: pkg.product,
            },
        }); // upgrade later
    }
}

export default new NewPkgMail();
