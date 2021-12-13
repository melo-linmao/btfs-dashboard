/*eslint-disable*/
import React, {useState, useEffect, useCallback} from "react";
import PropTypes from "prop-types";
import {Pagination} from 'antd';
import {getChequeCashingList} from "services/chequeService.js";
import ClipboardCopy from "../Utils/ClipboardCopy";
import {Truncate, t} from "utils/text.js"
import themeStyle from "utils/themeStyle.js";
import Emitter from "utils/eventBus";
import {switchBalanceUnit} from "utils/BTFSUtil.js";

let didCancel = false;

export default function ChequeCashingListTable({color, enableCash}) {

    const [uncashedOrder, setUncashedOrder] = useState('default');
    const [cashedOrder, setCashedOrder] = useState('default');
    const [cheques, setCheques] = useState(null);
    const [total, setTotal] = useState(0);
    const [current, setCurrent] = useState(1);

    const sorting = async (tag, order) => {
        if (tag === 'uncashed') {
            setCashedOrder('default');
            setUncashedOrder(order);
        }
        if (tag === 'cashed') {
            setUncashedOrder('default');
            setCashedOrder(order);
        }
    };

    const select = (e, id, amount) => {
        enableCash(e.target.checked, id, amount);
    };

    const unSelect = () => {
        enableCash(false, null, null, true);
        let checkbox = document.getElementsByName('checkbox');
        checkbox.forEach((item) => {
            item.checked = "";
        })
    };

    const pageChange = useCallback((page) => {
        updateTable(page);
    }, []);

    const updateTable = async (page) => {
        didCancel = false;
        let {cheques, total} = await getChequeCashingList((page - 1) * 10, 10);
        if (!didCancel) {
            setCheques(cheques);
            setTotal(total);
            setCurrent(page)
            unSelect();
        }
    };

    useEffect(() => {
        const set = async function () {
            setTimeout(() => {
                updateTable(1);
            }, 1000);
        };
        Emitter.on("updateCashingList", set);
        return () => {
            Emitter.removeListener('updateCashingList');
        }
    }, []);

    useEffect(() => {
        updateTable(1);
        return () => {
            didCancel = true;
        };
    }, []);

    return (

        <>
            <div
                className={
                    "relative flex flex-col min-w-0 break-words w-full shadow-lg rounded " +
                    themeStyle.bg[color] + ' ' + themeStyle.text[color]
                }
            >

                <div className="block w-full overflow-x-auto">

                    <table className="items-center w-full bg-transparent border-collapse">
                        <thead>
                        <tr>
                            <th className={
                                "px-6 align-middle border border-solid py-3 text-xs uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold text-left " +
                                (color === "light"
                                    ? "bg-blueGray-50 text-blueGray-500 border-blueGray-100"
                                    : "bg-lightBlue-800 text-lightBlue-300 border-lightBlue-700")
                            } style={{width: '50px'}}>

                            </th>
                            <th
                                className={
                                    "px-6 align-middle border border-solid py-3 text-xs uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold text-left " +
                                    (color === "light"
                                        ? "bg-blueGray-50 text-blueGray-500 border-blueGray-100"
                                        : "bg-lightBlue-800 text-lightBlue-300 border-lightBlue-700")
                                }
                            >
                                {t('host_id')}
                            </th>

                            <th
                                className={
                                    "px-6 align-middle border border-solid py-3 text-xs uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold text-left " +
                                    (color === "light"
                                        ? "bg-blueGray-50 text-blueGray-500 border-blueGray-100"
                                        : "bg-lightBlue-800 text-lightBlue-300 border-lightBlue-700")
                                }
                            >
                                {t('blockchain')}
                            </th>

                            <th
                                className={
                                    "px-6 align-middle border border-solid py-3 text-xs uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold text-left " +
                                    (color === "light"
                                        ? "bg-blueGray-50 text-blueGray-500 border-blueGray-100"
                                        : "bg-lightBlue-800 text-lightBlue-300 border-lightBlue-700")
                                }
                            >
                                {t('chequebook')}
                            </th>
                            <th
                                className={
                                    "cursor-pointer px-6 align-middle border border-solid py-3 text-xs uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold text-left " +
                                    (color === "light"
                                        ? "bg-blueGray-50 text-blueGray-500 border-blueGray-100"
                                        : "bg-lightBlue-800 text-lightBlue-300 border-lightBlue-700")
                                }

                                onClick={() => {
                                    sorting('uncashed', uncashedOrder === 'ascending' ? 'descending' : 'ascending')
                                }}

                            >

                                <div className='flex items-center'>
                                    <div>{t('uncashed')} (WBTT)</div>
                                    <div className='flex flex-col ml-4'>
                                        <i className={"fas fa-sort-up line-height-7px " + ((uncashedOrder === 'ascending') ? 'text-blue' : '')}></i>
                                        <i className={"fas fa-sort-down line-height-7px " + ((uncashedOrder === 'descending') ? 'text-blue' : '')}></i>
                                    </div>
                                </div>

                            </th>
                            <th
                                className={
                                    "cursor-pointer px-6 align-middle border border-solid py-3 text-xs uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold text-left " +
                                    (color === "light"
                                        ? "bg-blueGray-50 text-blueGray-500 border-blueGray-100"
                                        : "bg-lightBlue-800 text-lightBlue-300 border-lightBlue-700")
                                }
                                onClick={() => {
                                    sorting('cashed', cashedOrder === 'ascending' ? 'descending' : 'ascending')
                                }}
                            >

                                <div className='flex items-center'>
                                    <div>{t('cashed')} (WBTT)</div>
                                    <div className='flex flex-col ml-4'>
                                        <i className={"fas fa-sort-up line-height-7px " + ((cashedOrder === 'ascending') ? 'text-blue' : '')}></i>
                                        <i className={"fas fa-sort-down line-height-7px " + ((cashedOrder === 'descending') ? 'text-blue' : '')}></i>
                                    </div>
                                </div>
                            </th>
                        </tr>
                        </thead>
                        <tbody>

                        {cheques && cheques.map((item, index) => {
                            return (
                                <tr key={index}>
                                    <td className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4">
                                        <input
                                            type="checkbox" name="checkbox"
                                            className={"bg-gray form-checkbox border-0 rounded text-blueGray-700 ml-1 w-5 h-5 ease-linear transition-all duration-150 "}
                                            onClick={(e) => {
                                                select(e, item['PeerID'], (item['Payout'] - item['CashedAmount']))
                                            }}
                                        />
                                    </td>
                                    <td className="border-t-0 px-6 border-l-0 border-r-0 text-xs whitespace-nowrap p-4">
                                        <div className='flex'>
                                            <Truncate>{item['PeerID']}</Truncate>
                                            <ClipboardCopy value={item['PeerID']}/>
                                        </div>
                                    </td>

                                    <td className="border-t-0 px-6 border-l-0 border-r-0 text-xs whitespace-nowrap p-4">
                                        BTTC
                                    </td>

                                    <td className="border-t-0 px-6 border-l-0 border-r-0 text-xs whitespace-nowrap p-4">
                                        <div className='flex'>
                                            <Truncate>{item['Vault']}</Truncate>
                                            <ClipboardCopy value={item['Vault']}/>
                                        </div>
                                    </td>

                                    <td className="border-t-0 px-6 border-l-0 border-r-0 text-xs whitespace-nowrap p-4">
                                        {switchBalanceUnit((item['Payout'] - item['CashedAmount']))}
                                    </td>

                                    <td className="border-t-0 px-6 border-l-0 border-r-0 text-xs whitespace-nowrap p-4">
                                        {switchBalanceUnit(item['CashedAmount'])}
                                    </td>

                                </tr>
                            )
                        })
                        }

                        </tbody>
                    </table>

                    {
                        !cheques && <div className='w-full flex justify-center pt-4'>
                            <img alt='loading' src={require('../../assets/img/loading.svg').default}
                                 style={{width: '50px', height: '50px'}}/>
                        </div>
                    }

                </div>

                <div className='flex justify-between items-center'>
                    <div className='p-4'>Total: {total}</div>
                    <div>
                        <Pagination className='float-right p-4' simple current={current} total={total}
                                    hideOnSinglePage={true}
                                    onChange={pageChange}/>
                    </div>
                </div>

            </div>
        </>
    );
}

ChequeCashingListTable.defaultProps = {
    color: "light",
};

ChequeCashingListTable.propTypes = {
    color: PropTypes.oneOf(["light", "dark"]),
};