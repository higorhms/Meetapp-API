import Subscription from '../models/Subscription';
import Meetup from '../models/Meetup';
import File from '../models/File';

class RegistrationsController {
    async index(req, res) {
        const subscriptions = await Subscription.findAll({
            where: { user_id: req.userId },
            attributes: ['id', 'date', 'past'],
            order: ['date'],
            include: [
                {
                    model: Meetup,
                    as: 'meetup',
                    attributes: [
                        'id',
                        'title',
                        'description',
                        'location',
                        'date',
                    ],
                    include: [
                        {
                            model: File,
                            as: 'banner',
                        },
                    ],
                },
            ],
        });

        const subFilter = subscriptions.filter(sub => !sub.past);

        return res.json(subFilter);
    }
}
export default new RegistrationsController();
