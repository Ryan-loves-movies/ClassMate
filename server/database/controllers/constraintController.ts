import Constraints from '@models/Constraints';
import { Request, Response } from 'express';

async function updateConstraint(req: Request, res: Response) {
    const username = req.body.username as string;
    const actAy = parseInt(req.body.ay as string);
    const actSem = parseInt(req.body.semester as string);
    const startTime = req.body.startTime as string;
    const endTime = req.body.endTime as string;

    return await Constraints.findOne({
        where: {
            username: username,
            ay: actAy,
            sem: actSem
        }
    })
        .then(async (constraint) => {
            if (!constraint) {
                await Constraints.create({
                    username: username,
                    ay: actAy,
                    sem: actSem,
                    startTime: startTime,
                    endTime: endTime
                });
            } else {
                await constraint.update({
                    startTime: startTime,
                    endTime: endTime
                });
            }
            return res.status(201).json({ message: 'Updated!' });
        })
        .catch((err) =>
            res.status(400).json({
                message: 'Error occured when updating entry!',
                error: err
            })
        );
}

async function getConstraint(req: Request, res: Response) {
    const username = req.query.username as string;
    const actAy = parseInt(req.query.ay as string);
    const actSem = parseInt(req.query.semester as string);

    return await Constraints.findOne({
        where: {
            username: username,
            ay: actAy,
            sem: actSem
        }
    })
        .then((constraint) =>
            res.status(200).json({ constraint: constraint?.toJSON() })
        )
        .catch((err) =>
            res
                .status(404)
                .json({ message: 'Constraint could not be found!', error: err })
        );
}

export default {
    getConstraint,
    updateConstraint
};
