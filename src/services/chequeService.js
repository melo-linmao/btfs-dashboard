import BigNumber from 'bignumber.js';
import Client10 from "APIClient/APIClient10.js";
import {switchBalanceUnit} from "utils/BTFSUtil.js";

export const getChequeIncomeInfo = async () => {
    let data1 = Client10.getChequeValue();
    let data2 = Client10.getChequeTotalIncomeNumbers();
    return Promise.all([data1, data2]).then((result) => {
        return {
            chequeReceived: result[1]['count'],
            chequeEarning: switchBalanceUnit(result[0]['totalReceived'] ),
            uncashed: switchBalanceUnit((result[0]['totalReceived'] - result[0]['settlement_received_cashed']) ),
            cashed: switchBalanceUnit((result[0]['settlement_received_cashed']) ),
            cashedPercent: result[0]['totalReceived'] ? new BigNumber((result[0]['settlement_received_cashed'])).dividedBy(result[0]['totalReceived']).multipliedBy(100).toFixed(0) : 0,
        }
    })
};

export const getChequeExpenseInfo = async () => {
    let data1 = Client10.getChequeValue();
    let data2 = Client10.getChequeTotalExpenseNumbers();
    return Promise.all([data1, data2]).then((result) => {
        return {
            chequeSent: result[1]['count'],
            chequeExpense: switchBalanceUnit(result[0]['totalSent'] ),
            uncashed: switchBalanceUnit((result[0]['totalSent'] - result[0]['settlement_sent_cashed']) ),
            cashed: switchBalanceUnit((result[0]['settlement_sent_cashed']) ),
            cashedPercent: result[0]['totalSent'] ? new BigNumber((result[0]['settlement_sent_cashed'])).dividedBy(result[0]['totalSent']).multipliedBy(100).toFixed(0) : 0,
        }
    })
};

export const getChequeCashingList = async (offset, limit) => {
    let data = await Client10.getChequeCashingList(offset, limit);
    return {
        cheques: data['Cheques'] ? data['Cheques'] : [],
        total: data['Len']
    }
};

export const getChequeExpenseList = async () => {
    let data = await Client10.getChequeExpenseList();
    return {
        cheques: data['Cheques'] ? data['Cheques'] : [],
        total: data['Len']
    }
};

export const cash = async (cashList, onCashProgress, setErr, setMessage) => {
    try {
        let totalAmount = 0;
        let cashedAmount = 0;
        let hashList = [];
        cashList.forEach((item) => {
            totalAmount = totalAmount + item.amount;
        });

        if (!totalAmount) {
            setErr(true);
            return false;
        }

        for (let i = 0; i < cashList.length; i++) {
            let {TxHash, Type, Message} = await Client10.cash(cashList[i].id);
            if (Type === 'error') {
                setMessage(Message);
            }
            if (TxHash) {
                hashList.push(TxHash);
                cashedAmount = cashedAmount + cashList[i].amount;
            }
            onCashProgress(cashedAmount, totalAmount);
        }

        if (hashList.length === cashList.length) {
            console.log('done');
            return true;
        } else {
            setErr(true);
        }

    } catch (e) {
        console.log(e);
        setErr(true);
        return false;
    }
};