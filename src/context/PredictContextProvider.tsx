import { PREDICT_CONTRACT_ADDRESS } from "@/services/constants";
import { chainGrpcWasmApi, msgBroadcastClient } from "@/services/services";
import { getAddresses } from "@/services/wallet";
import { BigNumberInBase } from '@injectivelabs/utils'
import {
    MsgSend,
    MsgExecuteContractCompat,
    fromBase64,
    getInjectiveAddress,
    toBase64,
} from "@injectivelabs/sdk-ts";
import React, { createContext, useContext, useEffect, useState } from "react";
import { useWalletStore } from "./WalletContextProvider";

const default_addr = "inj1jx9uecvwlf94skkwrfumhv0sjsm85um9mmg9ny";

type StoreState = {
    data: {
        id: string;
        status: string;
        totalUp: string;
        totalDown: string;
        startTime: string;
        endTime: string;
        startPrice: string;
        upPosition: string;
        downPosition: string;
        binancePrice: string;
        timeStamp: string

    },
    betInfo: {
        upBet: string,
        downBet: string,
        endPrice: string,
        startPrice: string,
        totalPrize: string,

    },
    reward: string,
    queryBetInfo: (value: string) => void,
    queryReward: (id: string) => void,
    startBet: () => void,
    endBet: () => void,
    upBet: (value: string) => void,
    downBet: (value: string) => void,
    claimReward: (value: string) => void,
    fetchCurrentInfo: () => void
};

const PredictContext = createContext<StoreState>({
    data: {
        id: '0',
        status: '0',
        totalUp: '0',
        totalDown: '0',
        startTime: '0',
        endTime: '0',
        startPrice: '0',
        upPosition: '0',
        downPosition: '0',
        binancePrice: '0',
        timeStamp: '0'
    },
    betInfo: {
        upBet: "0",
        downBet: "0",
        endPrice: "0",
        startPrice: "0",
        totalPrize: "0",

    },
    reward: '0',
    queryBetInfo: (value) => { },
    queryReward: (id) => { },
    startBet: () => { },
    endBet: () => { },
    upBet: (value) => { },
    downBet: (value) => { },
    claimReward: (value) => { },
    fetchCurrentInfo: () => { }
});

export const usePredictStore = () => useContext(PredictContext);

type Props = {
    children?: React.ReactNode;
};

const PredictContextProvider = (props: Props) => {
    const [info, setInfo] = useState({
        id: '0',
        status: '0',
        totalUp: '0',
        totalDown: '0',
        startTime: '0',
        endTime: '0',
        startPrice: '0',
        upPosition: '0',
        downPosition: '0',
        binancePrice: '0',
        timeStamp: '0'
    });
    const [betInfoState, setBetInfo] = useState({
        upBet: "0",
        downBet: "0",
        endPrice: "0",
        startPrice: "0",
        totalPrize: "0",
    });
    const [reward, setReward] = useState("0");
    const { injectiveAddress } = useWalletStore();

    useEffect(() => {
        queryBetInfo("0");
        const interval = setInterval(() => fetchCurrentInfo(), 5000);
        return () => clearInterval(interval);
    }, []);

    const fetchFromBinance = async () => {
        try {
            const response = await fetch('https://data.binance.com/api/v3/ticker/price?symbol=INJUSDT');
            const data = response.json();
            return data;
        }
        catch {
            return { price: '0' };
        }
    };
    async function fetchCurrentInfo() {
        let binancePrice = await fetchFromBinance();
        let timeStamp = await queryTimeStamp();
        let addr = default_addr;
        if (injectiveAddress) addr = injectiveAddress;
        try {
            const response = await chainGrpcWasmApi.fetchSmartContractState(
                PREDICT_CONTRACT_ADDRESS,
                toBase64({ current_info: { addr: addr } })
            ) as { data: string };

            const info = fromBase64(response.data);
            setInfo({
                id: info.id as string,
                status: info.status as string,
                totalUp: info.totalUp as string,
                totalDown: info.totalDown as string,
                startTime: info.startTime as string,
                endTime: info.endTime as string,
                startPrice: info.startPrice as string,
                upPosition: info.upPosition as string,
                downPosition: info.downPosition as string,
                binancePrice: binancePrice.price,
                timeStamp: timeStamp as string,
            });
        } catch (e) {
            alert((e as any).message);
        }
    }

    async function queryTimeStamp() {
        try {
            const response = await chainGrpcWasmApi.fetchSmartContractState(
                PREDICT_CONTRACT_ADDRESS,
                toBase64({ time_stamp_info: {} })
            ) as { data: string };

            const info = fromBase64(response.data);
            return info;
        } catch (e) {
            return '0';
        }
    }

    async function queryBetInfo(value: string) {
        try {
            const response = await chainGrpcWasmApi.fetchSmartContractState(
                PREDICT_CONTRACT_ADDRESS,
                toBase64({ bet_info: { bet_id: parseInt(value, 10) } })
            ) as { data: string };

            const data = fromBase64(response.data);
            setBetInfo({
                upBet: data.upBet as string,
                downBet: data.downBet as string,
                endPrice: data.endPrice as string,
                startPrice: data.startPrice as string,
                totalPrize: data.totalPrize as string,
            });
            // console.log(data);
        } catch (e) {
            alert(e);
        }
    }
    async function queryReward(id: string) {
        if (!injectiveAddress) {
            return;
        }
        try {
            const response = await chainGrpcWasmApi.fetchSmartContractState(
                PREDICT_CONTRACT_ADDRESS,
                toBase64({ user_reward: { addr: injectiveAddress, bet_id: parseInt(id, 10) } })
            ) as { data: string };
            const desh_data = fromBase64(response.data).toString();
            console.log(desh_data);
            setReward(desh_data);
        } catch (e) {

        }
    }
    async function startBet() {
        if (!injectiveAddress) {
            alert("No Wallet Connected");
            return;
        }

        try {
            const msg = MsgExecuteContractCompat.fromJSON({
                contractAddress: PREDICT_CONTRACT_ADDRESS,
                sender: injectiveAddress,
                msg: {
                    start: {
                        price: '10000'
                    },
                },
            });

            await msgBroadcastClient.broadcast({
                msgs: msg,
                injectiveAddress: injectiveAddress,
            });
            fetchCurrentInfo();
        } catch (e) {
            alert((e as any).message);

        }
    }
    async function endBet() {
        if (!injectiveAddress) {
            alert("No Wallet Connected");
            return;
        }

        try {
            const msg = MsgExecuteContractCompat.fromJSON({
                contractAddress: PREDICT_CONTRACT_ADDRESS,
                sender: injectiveAddress,
                msg: {
                    end: {
                        price: "1000"
                    },
                },
            });

            await msgBroadcastClient.broadcast({
                msgs: msg,
                injectiveAddress: injectiveAddress,
            });
            fetchCurrentInfo();
        } catch (e) {
            alert((e as any).message);

        }
    }
    async function upBet(value: string) {
        if (!injectiveAddress) {
            alert("No Wallet Connected");
            return;
        }
        const amount = {
            denom: 'inj',
            amount: BigInt((parseFloat(value) * 1000000000000000000)).toString()
        }

        try {
            const msg = MsgExecuteContractCompat.fromJSON({
                funds: amount,
                contractAddress: PREDICT_CONTRACT_ADDRESS,
                sender: injectiveAddress,
                msg: {
                    up_bet: {},
                },
            });

            await msgBroadcastClient.broadcast({
                msgs: msg,
                injectiveAddress: injectiveAddress,
            });
            fetchCurrentInfo();
        } catch (e) {
            alert((e as any).message);
        }
    }
    async function downBet(value: string) {
        if (!injectiveAddress) {
            alert("No Wallet Connected");
            return;
        }
        const amount = {
            denom: 'inj',
            amount: BigInt((parseFloat(value) * 1000000000000000000)).toString()
        }

        try {
            const msg = MsgExecuteContractCompat.fromJSON({
                funds: amount,
                contractAddress: PREDICT_CONTRACT_ADDRESS,
                sender: injectiveAddress,
                msg: {
                    down_bet: {},
                },
            });

            await msgBroadcastClient.broadcast({
                msgs: msg,
                injectiveAddress: injectiveAddress,
            });
            fetchCurrentInfo();
        } catch (e) {
            alert((e as any).message);
        }
    }

    async function claimReward(value: string) {
        if (!injectiveAddress) {
            alert("No Wallet Connected");
            return;
        }
        try {
            const msg = MsgExecuteContractCompat.fromJSON({
                contractAddress: PREDICT_CONTRACT_ADDRESS,
                sender: injectiveAddress,
                msg: {
                    claim_reward: { bet_id: parseInt(value, 10) },
                },
            });

            await msgBroadcastClient.broadcast({
                msgs: msg,
                injectiveAddress: injectiveAddress,
            });
            fetchCurrentInfo();
        } catch (e) {
            alert((e as any).message);
        }
    }

    return (
        <PredictContext.Provider
            value={{
                data: info,
                betInfo: betInfoState,
                reward: "0",
                queryBetInfo,
                queryReward,
                startBet,
                endBet,
                upBet,
                downBet,
                claimReward,
                fetchCurrentInfo,
            }}
        >
            {props.children}
        </PredictContext.Provider>
    );
};
export default PredictContextProvider;