import * as Yup from 'yup';
import { isBefore } from 'date-fns';
import Meetup from '../models/Meetup';
import Subscription from '../models/Subscription';
import Mail from '../../lib/Mail';
import User from '../models/User';

class SubscriptionController {
    async store(req, res) {
        const schema = Yup.object().shape({
            meetup_id: Yup.number().required(),
        });

        if (!(await schema.isValid(req.body))) {
            return res.status(400).json({ error: 'Validation fails' });
        }

        /**
         * Check if the meetup is this user
         */
        const { meetup_id } = req.body;
        const meetup = await Meetup.findByPk(meetup_id, {
            include: [
                { model: User, as: 'user', attributes: ['name', 'email'] },
            ],
        });

        if (meetup.user_id === req.userId) {
            return res
                .status(401)
                .json({ error: 'You can not subscribe in your meetups' });
        }

        /**
         * Check if the meetup already done
         */
        if (isBefore(meetup.date, new Date())) {
            return res
                .status(401)
                .json({ error: 'This meetup only have finished' });
        }

        /**
         * Check if user already subscribed
         */
        const alreadySubscribed = await Subscription.findOne({
            where: { meetup_id, user_id: req.userId },
        });

        if (alreadySubscribed) {
            return res
                .status(401)
                .json({ error: 'You are already subscribed' });
        }

        /**
         * Check if hour are disponible
         */
        const ifHourIsAvailable = await Subscription.findOne({
            where: { user_id: req.userId, date: meetup.date },
        });

        if (ifHourIsAvailable) {
            return res.status(401).json({
                error:
                    'You can not subscribe in two meetups with the same hour',
            });
        }

        /**
         * Sending email
         */
        const user = await User.findByPk(req.userId);

        await Mail.sendEmail({
            to: `${meetup.user.name} <${meetup.user.email}>`,
            subject: 'Novo integrante Inscrito',
            template: 'cancellation',
            context: {
                user: meetup.user.name,
                meetup: meetup.title,
                cliente: user.name,
                email: user.email,
            },
        });

        const subscription = await Subscription.create({
            meetup_id,
            user_id: req.userId,
            date: meetup.date,
        });

        return res.json(subscription);
    }

    async delete(req, res) {
        const { userId } = req;
        const { meetupId } = req.params;

        const subscription = await Subscription.findOne({
            where: { meetup_id: meetupId, user_id: userId },
        });

        if (!subscription) {
            return res
                .status(401)
                .json({ error: 'You can only delete your subscriptions' });
        }

        await subscription.destroy();

        return res.json({ message: 'Deleted sucessfull' });
    }
}

export default new SubscriptionController();
