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
    id: '0',
    status: '0',
    totalUp: '0',
    totalDown: '0',
    startTime: '0',
    endTime: '0',
    startPrice: '0',
    upPosition: '0',
    downPosition: '0',

    // incrementCount: () => { },
    // setContractCounter: (number) => { },
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
        try {
            const response = await chainGrpcWasmApi.fetchSmartContractState(
                PREDICT_CONTRACT_ADDRESS,
                toBase64({ current_info: { addr: "inj1lxz8ty4rdulcux5knduj686097gawxwmwe8w5w" } })
                // toBase64({ user_reward: { addr: "inj1lxz8ty4rdulcux5knduj686097gawxwmwe8w5w", bet_id: "0" } })

            ) as { data: string };

            const count = fromBase64(response.data);
            console.log();

            console.log("------------");
            console.log(count.totalUp);
            console.log("------------");
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

    return (
        <CounterContext.Provider
            value={count}
        >
            {props.children}
        </CounterContext.Provider>
    );
};
export default CounterContextProvider;