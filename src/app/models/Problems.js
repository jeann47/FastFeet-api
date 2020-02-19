import Sequelize, { Model } from 'sequelize';
import 'dotenv/config';

class DeliveryProblems extends Model {
    static init(sequelize) {
        super.init(
            {
                description: Sequelize.STRING,
            },
            { sequelize }
        );
        return this;
    }

    static associate(models) {
        this.belongsTo(models.Package, {
            as: 'package',
            foreignKey: 'package_id',
        });
    }
}

export default DeliveryProblems;
