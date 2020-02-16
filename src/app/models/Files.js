import Sequelize, { Model } from 'sequelize';
import 'dotenv/config';

class File extends Model {
    static init(sequelize) {
        super.init(
            {
                avatar_id: Sequelize.VIRTUAL,
                name: Sequelize.STRING,
                path: Sequelize.STRING,
                url: {
                    type: Sequelize.VIRTUAL,
                    get() {
                        return `${process.env.APP_URL}/files/${this.path}`;
                    },
                },
            },
            { sequelize }
        );
        return this;
    }

    static associate(models) {
        this.hasOne(models.Courier, { as: 'avatar' });
    }
}

export default File;
