import Sequelize, { Model } from 'sequelize';

class Recipient extends Model {
    static init(sequelize) {
        super.init(
            {
                name: Sequelize.STRING,
                address: {
                    type: Sequelize.VIRTUAL,
                    get() {
                        return {
                            street: this.street,
                            number: this.number,
                            complement: this.complement,
                            state: this.state,
                            city: this.city,
                            zipcode: this.zipcode,
                            type: this.type,
                        };
                    },
                    set() {
                        throw new Error('Do not try to set the adress value!');
                    },
                },
                street: Sequelize.STRING,
                number: Sequelize.INTEGER,
                complement: Sequelize.STRING,
                state: Sequelize.STRING,
                city: Sequelize.STRING,
                zipcode: Sequelize.STRING,
                type: Sequelize.STRING,
            },
            { sequelize }
        );
        return this;
    }
}

export default Recipient;
