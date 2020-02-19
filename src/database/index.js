import Sequelize from 'sequelize';

import conn from '../config/database';

import User from '../app/models/User';
import Recipient from '../app/models/Recipients';
import File from '../app/models/Files';
import Courier from '../app/models/Courier';
import Package from '../app/models/Package';
import DeliveryProblems from '../app/models/Problems';

const models = [User, Recipient, File, Courier, Package, DeliveryProblems];

class Database {
    constructor() {
        this.init();
    }

    init() {
        this.connection = new Sequelize(conn);

        models
            .map(model => model.init(this.connection))
            .map(
                model =>
                    model.associate && model.associate(this.connection.models)
            );
    }
}

export default new Database();
