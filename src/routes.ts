import { Router } from 'express';
import { Request, Response } from 'express';
import { CashMachineController } from './controllers/CashMachineController';
import * as _ from 'lodash';

const routes = Router();
const cashMachineController = new CashMachineController();

routes.get('/', (req, res) => {
    res.send('Hello World!')
});

// DEPOSIT ROUTES
routes.post('/conta-corrente/depositar', (req: Request, res: Response) => {
    return cashMachineController.cashDeposit(req.body, 'corrente')
        .then(response => {
            res.status(response.statusCode);

            return res.json(response);
        });
});

routes.post('/conta-poupanca/depositar', (req: Request, res: Response): Promise<Response> => {
    return cashMachineController.cashDeposit(req.body, 'poupanca')
        .then(response => {
            res.status(response.statusCode);

            return res.json(response);
        });
});

export { routes };