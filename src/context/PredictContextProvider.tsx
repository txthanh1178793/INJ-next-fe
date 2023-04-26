import { COUNTER_CONTRACT_ADDRESS, PREDICT_CONTRACT_ADDRESS } from "@/services/constants";
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

enum Status {
    Idle = "idle",
    Loading = "loading",
}

type StoreState = {
    id: number;
    status: number;
    totalUp: bigint;
    totalDown: bigint;
    startTime: bigint;
    endTime: bigint;
    startPrice: bigint;
    upPosition: bigint;
    downPosition: bigint;

    // incrementCount: () => void;
    // setContractCounter: (number: string) => void;
};

const CounterContext = createContext<StoreState>({
    id: 0,
    status: 0,
    totalUp: 0,
    totalDown: 0,
    startTime: 0,
    endTime: 0,
    startPrice: 0,
    upPosition: 0,
    downPosition: 0,

    // incrementCount: () => { },
    // setContractCounter: (number) => { },
});

export const useCounterStore = () => useContext(CounterContext);

type Props = {
    children?: React.ReactNode;
};

const CounterContextProvider = (props: Props) => {
    const [count, setCount] = useState(0);
    const [status, setStatus] = useState<Status>(Status.Idle);
    const isLoading = status == Status.Loading;
    const { injectiveAddress } = useWalletStore();

    useEffect(() => {
        fetchCount();
    }, []);

    async function fetchCount() {
        try {
            const response = (await chainGrpcWasmApi.fetchSmartContractState(
                PREDICT_CONTRACT_ADDRESS,
                toBase64({ get_currentinfo: {} })
            )) as { data: string };

            // const { count } = fromBase64(response.data) as { count: number };
            // setCount(count);

            const count = response.data;
            console.log(count);
        } catch (e) {
            alert((e as any).message);
        }
    }

    return (
        <CounterContext.Provider
            value={{
                count,
                isLoading,
                // incrementCount,
                // setContractCounter,
            }}
        >
            {props.children}
        </CounterContext.Provider>
    );
};
export default CounterContextProvider;