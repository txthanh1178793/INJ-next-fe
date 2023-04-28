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

enum Status {
    Idle = "idle",
    Loading = "loading",
}

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

    },
    startBet: () => void,
    endBet: () => void,
    upBet: () => void,
    // downBet: () => void,
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
    },
    startBet: () => { },
    endBet: () => { },
    upBet: () => { },
    // downBet: () => { },
});

export const useCounterStore = () => useContext(PredictContext);





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
    });
    const { injectiveAddress } = useWalletStore();

    useEffect(() => {
        fetchCurrentInfo();
    }, []);

    async function fetchCurrentInfo() {
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
            });
        } catch (e) {
            alert((e as any).message);
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
                        price: "10000"
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
    async function upBet() {
        if (!injectiveAddress) {
            alert("No Wallet Connected");
            return;
        }
        const amount = {
            denom: 'INJ',
            amount: "1"
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


    return (
        <PredictContext.Provider
            value={{
                data: info,
                startBet,
                endBet,
                upBet,
                // downBet
            }}
        >
            {props.children}
        </PredictContext.Provider>
    );
};
export default PredictContextProvider;