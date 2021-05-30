import mysql from '../helpers/mysqlHelper';
import * as _ from 'lodash';

interface ICashObject {
    account: string,
    value: number
};

interface ICashObjectResponse {
    accountType: string,
    account: string,
    oldBalance: string,
    deposit?: string,
    withdraw?: string,
    discontedAmount: string,
    balance: string
};

class CashMachineModel {
    /**
     * @name Create Account
     * @description Create account when account not exist
     * @param account Account code
     * @param value Value desposited
     * @param type Account type (corrente | poupanca)
     * @author Everson F. Feltrin
     * @since 2021-05-29
     */
    async createAccount(account: string, value: number, type: string): Promise<any> {
        return mysql.connect(
            'INSERT INTO accounts(`account`, `type`, `balance`) VALUES (?, ?, ?);',
            [
                account,
                type,
                value
            ]
        );
    };

    /**
     * @name Verify Account Exist
     * @description Verify account exist to create or update account
     * @param account Account code
     * @param type Account type (corrente | poupanca)
     * @author Everson F. Feltrin
     * @since 2021-05-29
     */
    async verifyAccountExist (account: string, type: string): Promise<any> {
        return mysql.connect(
            `SELECT id, balance FROM accounts WHERE account = ? AND  type = ? LIMIT 1;`,
            [
                account,
                type
            ]
        );
    }

    /**
     * @name Save Account Transaction
     * @description Save account transaction (deposit | withdraw)
     * @param accountId Account identification
     * @param value Value desposited
     * @param operation Transaction operation (deposit | withdraw)
     * @param discontedAmount Disconted amount in transaction if exist
     * @author Everson F. Feltrin
     * @since 2021-05-29
     */
    async saveAccountTransaction(accountId: number, value: number, operation: string, discontedAmount: number = 0.00): Promise<any> {
        return mysql.connect(
            'INSERT INTO transactions(`operation`, `value`, `disconted_amount`, `account_id`) VALUES (?, ?, ?, ?);',
            [
                operation,
                value,
                discontedAmount, 
                accountId
            ]
        );
    }

    /**
     * @name Update Account Balance
     * @description Update balance account after operation
     * @param accountId Account identification
     * @param balance Balance to update in account
     * @param type Account type
     * @author Everson F. Feltrin
     * @since 2021-05-29
     */
    async updateAccountBalance(accountId: number, balance: number, type: string): Promise<any> {
        return mysql.connect(
            'UPDATE accounts SET balance = ? WHERE id = ? AND type = ?;',
            [
                balance,
                accountId,
                type
            ]
        );
    }

    /**
     * @name Deposit
     * @description Deposit value into account
     * @param data Deposit data (account, value)
     * @param type Account type
     * @author Everson F. Feltrin
     * @since 2021-05-29
     */
    async deposit(data: ICashObject, type: string): Promise<ICashObjectResponse> {
        // VALIDATE DATA  
        if (!_.has(data, 'account')) return Promise.reject(new Error('VAL_001 - Account is required!'));
        if (!_.has(data, 'value')) return Promise.reject(new Error('VAL_002 - Value is required!'));
        if (!_.isString(data.account)) return Promise.reject(new Error('VAL_003 - Account needs to be a string!'));
        if (!_.isNumber(data.value)) return Promise.reject(new Error('VAL_003 - Value needs to be a float!'));
        
        const { account, value } = data;        
        let oldBalance = 0;
        let newBalance = 0;

        // VERIFY ACCOUNT EXIST
        const verifyAccountExist = await this.verifyAccountExist(account, type);
        if (verifyAccountExist.error) return Promise.reject(new Error('DEP_001 - Error while deposit value in account!'));

        if (verifyAccountExist.data.length <= 0) {
            // CREATE ACCOUNT IF ACCOUNT NOT EXISTS 
            const createAccount = await this.createAccount(account, value, type);
            if (createAccount.error) return Promise.reject(new Error('DEP_002 - Error while deposit value in account!'));
            if (createAccount.data.affectedRows <= 0) return Promise.reject(new Error('DEP_003 - Error while create account!'));
            
            // SAVE TRANSACTION REGISTER
            const saveTransaction = await this.saveAccountTransaction(parseInt(createAccount.data.insertId), value, 'deposit');
            if (saveTransaction.error) return Promise.reject(new Error('DEP_004Error while deposit value in account!'));
            if (saveTransaction.data.affectedRows <= 0) return Promise.reject(new Error('DEP_005 - Error while deposit value in account!'));
            
            oldBalance = 0.00;
            newBalance = value;
        }
        else {
            // SAVE TRANSACTION REGISTER
            const accountId = verifyAccountExist.data[0].id;
            const saveTransaction = await this.saveAccountTransaction(parseInt(accountId), value, 'deposit');
            if (saveTransaction.error) return Promise.reject(new Error('DEP_006 - Error while deposit value in account!'));
            if (saveTransaction.data.affectedRows <= 0) return Promise.reject(new Error('DEP_007 - Error while deposit value in account!'));

            // UPDATE BALANCE IN ACCOUNT
            oldBalance = verifyAccountExist.data[0].balance;
            newBalance = verifyAccountExist.data[0].balance + value;
            const updateBalance = await this.updateAccountBalance(parseInt(accountId), newBalance, type);
            if (updateBalance.error) return Promise.reject(new Error('DEP_008 - Error while deposit value in account!'));
            if (updateBalance.data.affectedRows <= 0) return Promise.reject(new Error('DEP_009 - Error while deposit value in account!'));
        }
       
        return {
            accountType: type === 'poupanca' ? 'Conta Poupança' : 'Conta Corrente',
            account: account,
            oldBalance: `B$ ${_.replace(oldBalance.toFixed(2), '.', ',')}`,
            deposit: `B$ ${_.replace(value.toFixed(2), '.', ',')}`,
            discontedAmount: `B$ 0,00`,
            balance: `B$ ${_.replace(newBalance.toFixed(2), '.', ',')}`
        };       
    }

    /**
     * @name Withdraw
     * @description Withdraw amount into account
     * @param data Withdraw data (account, value)
     * @param type Account type
     * @author Everson F. Feltrin
     * @since 2021-05-29
     */
    async withdraw(data: ICashObject, type: string): Promise<ICashObjectResponse> {
        // VALIDATE DATA  
        if (!_.has(data, 'account')) return Promise.reject(new Error('VAL_001 - Account is required!'));
        if (!_.has(data, 'value')) return Promise.reject(new Error('VAL_002 - Value is required!'));
        if (!_.isString(data.account)) return Promise.reject(new Error('VAL_003 - Account needs to be a string!'));
        if (!_.isNumber(data.value)) return Promise.reject(new Error('VAL_003 - Value needs to be a float!'));

        const { account, value } = data;

        // VERIFY ACCOUNT EXIST
        const verifyAccountExist = await this.verifyAccountExist(account, type);
        if (verifyAccountExist.error) return Promise.reject(new Error('WIT_001 - Error while withdraw value in account!'));
        if (verifyAccountExist.data.length <= 0) return Promise.reject(new Error('WIT_002 - Account not found! Make a deposit to activate your account!'));
        
        // VERIFY WITHDRAW LIMIT
        if (value > 600.00) return Promise.reject(new Error('WIT_003 - Value exceeds the limit! Limit equal B$ 600, 00.'));
        
        const accountId = verifyAccountExist.data[0].id;
        let oldBalance = verifyAccountExist.data[0].balance;
        let withdraw = data.value + 0.30;
        let newBalance = verifyAccountExist.data[0].balance - withdraw;

        // VERIFY IF CURRENT BALANCE IS LESS THAN THE WITHDRAW AMOUNT
        if (oldBalance < withdraw) return Promise.reject(new Error('WIT_005 - Your current balance is less than the withdrawal amount!'));
        
        // SAVE TRANSACTION REGISTER
        const saveTransaction = await this.saveAccountTransaction(parseInt(accountId), value, 'withdraw', 0.30);
        if (saveTransaction.error) return Promise.reject(new Error('WIT_006 - Error while withdraw value in account!'));
        if (saveTransaction.data.affectedRows <= 0) return Promise.reject(new Error('WIT_007 - Error while withdraw value in account!'));

        // UPDATE BALANCE IN ACCOUNT
        const updateBalance = await this.updateAccountBalance(parseInt(accountId), newBalance, type);
        if (updateBalance.error) return Promise.reject(new Error('DEP_008 - Error while withdraw value in account!'));
        if (updateBalance.data.affectedRows <= 0) return Promise.reject(new Error('DEP_009 - Error while withdraw value in account!'));

        return {
            accountType: type === 'poupanca' ? 'Conta Poupança' : 'Conta Corrente',
            account: account,
            oldBalance: `B$ ${_.replace(oldBalance.toFixed(2), '.', ',')}`,
            withdraw: `B$ ${_.replace(value.toFixed(2), '.', ',')}`,
            discontedAmount: `B$ 0,30`,
            balance: `B$ ${_.replace(newBalance.toFixed(2), '.', ',')}`
        };
    }
}
        
export { CashMachineModel };