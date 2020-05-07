import Sequelize, { Model } from 'sequelize';
import { isBefore } from 'date-fns';

class Subscription extends Model {
    static init(sequelize) {
        super.init(
            {
                meetup_id: Sequelize.INTEGER,
                date: Sequelize.DATE,
                past: {
                    type: Sequelize.VIRTUAL,
                    get() {
                        return isBefore(this.date, new Date());
                    },
                },
            },
            { sequelize }
        );
        return this;
    }

    static associate(models) {
        this.belongsTo(models.User, { foreignKey: 'user_id', as: 'user' });
        this.belongsTo(models.Meetup, {
            foreignKey: 'meetup_id',
            as: 'meetup',
        });
    }
}
export default Subscription;
