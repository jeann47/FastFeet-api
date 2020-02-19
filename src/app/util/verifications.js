import {
    setHours,
    setMinutes,
    setSeconds,
    isAfter,
    isBefore,
    parseISO,
} from 'date-fns';
import { Op } from 'sequelize';
import Package from '../models/Package';

export default {
    Package: {
        async startable(pkg, start_date) {
            const serviceInit = setSeconds(
                setMinutes(setHours(new Date().getTime(), 8), 0),
                0
            );
            const serviceEnd = setSeconds(
                setMinutes(setHours(new Date().getTime(), 18), 0),
                0
            );

            const deliveries = await Package.findAndCountAll({
                where: {
                    courier_id: pkg.courier_id,
                    start_date: { [Op.between]: [serviceInit, serviceEnd] },
                },
            });

            if (deliveries.count >= 5) {
                return {
                    status: 401,
                    res: {
                        error: 'Is not allowed to start more then 5 deliveries',
                    },
                };
            }

            if (
                !(
                    isAfter(parseISO(start_date), serviceInit) &&
                    isBefore(parseISO(start_date), serviceEnd)
                )
            ) {
                return {
                    status: 403,
                    res: {
                        error:
                            'Deliveries can only start between 8:00 and 18:00',
                    },
                };
            }
            if (pkg.start_date) {
                return {
                    status: 400,
                    res: {
                        error: 'This delivery is already started',
                    },
                };
            }
            if (pkg.canceled_at) {
                return {
                    status: 403,
                    res: {
                        error: 'Is not allowed to start a canceled delivery',
                    },
                };
            }
            if (!pkg.recipient_id) {
                // in case of a deleted recipient
                return {
                    status: 403,
                    res: {
                        error: 'This package do not have a recipient',
                    },
                };
            }
            if (!pkg.courier_id) {
                // in case of a deleted courier
                return {
                    status: 403,
                    res: {
                        error: 'This package do not have a courier',
                    },
                };
            }
            return { status: 200 };
        },
        finalizable(pkg) {
            if (pkg.end_date) {
                return {
                    status: 400,
                    res: {
                        error: 'This delivery is already finished',
                    },
                };
            }

            if (pkg.canceled_at) {
                return {
                    status: 400,
                    res: {
                        error: 'This delivery was canceled',
                    },
                };
            }

            if (!pkg.start_date) {
                return {
                    status: 403,
                    res: {
                        error:
                            'Is not allowed to end a delivery that was never started',
                    },
                };
            }
            return { status: 200 };
        },
        cancelable(pkg) {
            if (!pkg.canceled_at) {
                return {
                    status: 400,
                    res: {
                        error: 'This delivery is already canceled',
                    },
                };
            }
            if (pkg.end_date) {
                return {
                    status: 400,
                    res: {
                        error: 'This delivery was already finished',
                    },
                };
            }
            return { status: 200 };
        },
    },
};
