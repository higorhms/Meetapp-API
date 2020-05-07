// import { startOfDay, endOfDay, isPast } from 'date-fns';
import { Op } from 'sequelize';
import Meetup from '../models/Meetup';
import User from '../models/User';
import File from '../models/File';

class MeetupEventController {
    async index(req, res) {
        const { date, page = 1 } = req.query;
        const { userId } = req;

        const formattedDate = new Date(date);

        const meetups = await Meetup.findAll({
            where: {
                user_id: {
                    [Op.not]: userId,
                },
                // date: {
                //     [Op.between]: [
                //         startOfDay(formattedDate),
                //         endOfDay(formattedDate),
                //     ],
                // },
                date: {
                    [Op.gt]: formattedDate,
                },
            },
            limit: 10,
            offset: (page - 1) * 10,
            order: ['date'],
            attributes: ['id', 'title', 'location', 'date'],
            include: [
                { model: User, as: 'user', attributes: ['name', 'email'] },
                { model: File, as: 'banner' },
            ],
        });

        res.json(meetups);
    }
}

export default new MeetupEventController();
