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
    totalUp: BigInt;
    totalDown: BigInt;
    startTime: BigInt;
    endTime: BigInt;
    startPrice: BigInt;
    upPosition: BigInt;
    downPosition: BigInt;

    // incrementCount: () => void;
    // setContractCounter: (number: string) => void;
};

const CounterContext = createContext<StoreState>({
    id: 0,
    status: 0,
    totalUp: BigInt("0"),
    totalDown: BigInt("0"),
    startTime: BigInt("0"),
    endTime: BigInt("0"),
    startPrice: BigInt("0"),
    upPosition: BigInt("0"),
    downPosition: BigInt("0"),

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
                // count,
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