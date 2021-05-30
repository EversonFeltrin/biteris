import * as httpStatus from 'http-status';
import {CashMachineModel} from '../models/CashMachineModel';

const defaultResponse = (data: object, statusCode: number = httpStatus.OK) => ({ data, statusCode });

const errorResponse = (message: string, statusCode: number = httpStatus.BAD_REQUEST) => defaultResponse({ error: message }, statusCode );

interface ICashObject {
    account: string,
    value: number
};

class CashMachineController {
    async cashDeposit(data: ICashObject, type: string) {
        const cashMachineModel = new CashMachineModel();

        return cashMachineModel.deposit(data, type)
            .then(response => defaultResponse(response))
            .catch(error => errorResponse(error.message))
    };    
}

export { CashMachineController }