import * as httpStatus from 'http-status';
import {CashMachineModel} from '../models/CashMachineModel';

/**
 * @name Default Response
 * @description Success response structure
 * @param data Data response 
 * @param statusCode Response status code
 * @author Everson F. Feltrin
 * @since 2021-05-29 
 */
const defaultResponse = (data: object, statusCode: number = httpStatus.OK) => ({ data, statusCode });

/**
 * @name Error Response
 * @description Error response structure
 * @param message Error message
 * @param statusCode Response status code
 * @author Everson F. Feltrin
 * @since 2021-05-29
 */
const errorResponse = (message: string, statusCode: number = httpStatus.BAD_REQUEST) => defaultResponse({ error: message }, statusCode );

interface ICashObject {
    account: string,
    value: number
};

class CashMachineController {
    // DEPOSIT CONTROLLER
    async cashDeposit(data: ICashObject, type: string) {
        const cashMachineModel = new CashMachineModel();

        return cashMachineModel.deposit(data, type)
            .then(response => defaultResponse(response))
            .catch(error => errorResponse(error.message))
    };    

    // WITHDRAW CONTROLLER
    async cashWithdraw(data: ICashObject, type: string) {
        const cashMachineModel = new CashMachineModel();

        return cashMachineModel.withdraw(data, type)
            .then(response => defaultResponse(response))
            .catch(error => errorResponse(error.message))
    };    
}

export { CashMachineController }