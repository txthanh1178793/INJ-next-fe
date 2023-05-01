import { usePredictStore } from "@/context/PredictContextProvider";
import React, { useEffect, useState } from "react";


type Props = {};
const CurrentBet = (props: Props) => {
    const [inputValue, setInputValue] = useState("0");
    const [inputAddress, setInputAddress] = useState("0");
    const [inpuId, setInpuId] = useState("0");
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
    const { data,
        queryBetInfo,
        queryReward,
        startBet,
        endBet,
        upBet,
        downBet,
        claimReward,
    } = usePredictStore();

    useEffect(() => {
        setInfo(data);
    }, [data]);

    function handleStartBet() {
        startBet();
    }
    function handleEndBet() {
        endBet();
    }
    function handleUpBet() {
        upBet(inputValue);
    }
    function handleDownBet() {
        downBet(inputValue);
    }
    function handleClaimReward() {
        claimReward(inpuId);
    }
    function handleQueryBetInfo() {
        queryBetInfo(inpuId as string);
    }
    function handleQueryReward() {
        queryReward(inputAddress as string, inpuId as string);
    }
    function handleChange(event: any) {
        let { value, min, max } = event.target;

        if (Number(value) > 1000) {
            value = 1000;
        }
        if (Number(value) < 0.001) {
            value = 0.001;
        }
        setInputValue(value);
    };

    return (
        <div className="--container-wrapper">
            <div className="--container-inner">
                <p className="order">#{info.id}</p>
                <div className="line"></div>
                <div className="price-tag">
                    <p>INJ Price</p>
                    <p className="price">$7.863</p>
                    <table className="info">
                        <tr>
                            <th className="price-start">Start Price</th>
                            <th>${info.startPrice}</th>
                        </tr>
                        <tr>
                            <td className="prize">Total Prize</td>
                            <td>${info.totalUp + info.totalDown} INJ</td>
                        </tr>
                    </table>
                </div>
                <input type="number" className="input" value={inputValue} onChange={(e) => handleChange(e)} />
                <div className="--button-container ---a">
                    <p className="--button-text">UP</p>
                    <object className="--center-vertical" data="up.svg" width="50" height="50"> </object>
                    <button onClick={handleUpBet} disabled={info.status != "1"}></button>
                </div>
                <div className="--button-container ---b">
                    <object className="--center-vertical" data="down.svg" width="40" height="40"> </object>
                    <p className="--button-text">DOWN</p>
                    <button onClick={handleDownBet} disabled={info.status != "1"}></button>
                </div>
            </div>
        </div>
    );
};

export default CurrentBet;
