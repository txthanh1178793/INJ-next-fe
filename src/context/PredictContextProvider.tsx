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
            const response = await chainGrpcWasmApi.fetchSmartContractState(
                PREDICT_CONTRACT_ADDRESS,
                toBase64({ current_info: { addr: "inj1lxz8ty4rdulcux5knduj686097gawxwmwe8w5w" } })
                // toBase64({ user_reward: { addr: "inj1lxz8ty4rdulcux5knduj686097gawxwmwe8w5w", bet_id: "0" } })

            );
            console.log(response);

            const response2 = await chainGrpcWasmApi.fetchSmartContractState(
                PREDICT_CONTRACT_ADDRESS,
                toBase64({ bet_info: { bet_id: "0" } })
            );
            console.log(response2);
            // const { count } = fromBase64(response.data) as { count: number };
            // setCount(count);

            // const count = fromBase64(Buffer.from(response.data).toString("base64"));

            // console.log(count);

            // 
        } catch (e) {
            alert((e as any).message);
        }
    }

    return (
        <CounterContext.Provider
            value={{
                id: 0,
                status: 0,
                totalUp: BigInt("0"),
                totalDown: BigInt("0"),
                startTime: BigInt("0"),
                endTime: BigInt("0"),
                startPrice: BigInt("0"),
                upPosition: BigInt("0"),
                downPosition: BigInt("0"),
                // incrementCount,
                // setContractCounter,
            }}
        >
            {props.children}
        </CounterContext.Provider>
    );
};
export default CounterContextProvider;