import { PREDICT_CONTRACT_ADDRESS } from "@/services/constants";
import { chainGrpcWasmApi, msgBroadcastClient } from "@/services/services";
import { getAddresses } from "@/services/wallet";
import {
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
};

const CounterContext = createContext<StoreState>({
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
});

export const useCounterStore = () => useContext(CounterContext);





type Props = {
    children?: React.ReactNode;
};

const CounterContextProvider = (props: Props) => {
    const [count, setCount] = useState({
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
    const [status, setStatus] = useState<Status>(Status.Idle);
    const isLoading = status == Status.Loading;
    const { injectiveAddress } = useWalletStore();

    useEffect(() => {
        fetchCount();
    }, []);

    async function fetchCount() {
        let addr = default_addr;
        if (injectiveAddress) addr = injectiveAddress;
        try {
            const response = await chainGrpcWasmApi.fetchSmartContractState(
                PREDICT_CONTRACT_ADDRESS,
                toBase64({ current_info: { addr: addr } })
            ) as { data: string };

            const count = fromBase64(response.data);
            setCount({
                id: count.id as string,
                status: count.status as string,
                totalUp: count.totalUp as string,
                totalDown: count.totalDown as string,
                startTime: count.startTime as string,
                endTime: count.endTime as string,
                startPrice: count.startPrice as string,
                upPosition: count.upPosition as string,
                downPosition: count.downPosition as string,
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
        } catch (e) {
            alert((e as any).message);
        } finally {
            setStatus(Status.Idle);
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
        } catch (e) {
            alert((e as any).message);
        } finally {
            setStatus(Status.Idle);
        }
    }


    return (
        <CounterContext.Provider
            value={{
                data: count,
                startBet,
                endBet
            }}
        >
            {props.children}
        </CounterContext.Provider>
    );
};
export default CounterContextProvider;