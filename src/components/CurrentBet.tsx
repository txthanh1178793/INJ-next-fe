import { usePredictStore } from "@/context/PredictContextProvider";
import React, { useEffect, useState } from "react";
import { useQuery } from 'react-query'


type Props = {};
const CurrentBet = (props: Props) => {
    const [inputValue, setInputValue] = useState("0");
    const [inputAddress, setInputAddress] = useState("0");
    const [inpuId, setInpuId] = useState("0");
    const [betID, setBetID] = useState("0");
    const [rewardState, setReward] = useState("0");
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
    const { data,
        betInfo,
        reward,
        queryBetInfo,
        queryReward,
        startBet,
        endBet,
        upBet,
        downBet,
        claimReward,
        fetchCurrentInfo
    } = usePredictStore();

    useEffect(() => {
        setInfo(data);
        setBetInfo(betInfo);
        setReward(reward);
    }, [data]);

    function handleStartBet() {
        startBet();
    }
    function handleEndBet() {
        endBet();
    }
    function handleUpBet() {
        upBet(inputValue);
        setInputValue("0");
    }
    function handleDownBet() {
        downBet(inputValue);
        setInputValue("0");

    }
    function handleClaimReward() {
        claimReward(betID);
        setReward("0");
    }
    function handleQueryBetInfoNext() {
        setReward("0");
        setBetID((parseInt(betID, 10) + 1).toString());
        queryBetInfo(betID);
    }
    function handleQueryBetInfoPrevious() {
        setReward("0");
        setBetID((parseInt(betID, 10) - 1).toString());
        queryBetInfo(betID);
    }
    function handleQueryCurrentInfo() {
        fetchCurrentInfo();
    }
    function handleQueryReward() {
        queryReward(betID as string);
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

    const Claim = () => {
        <button className="--check-and-claim" onClick={handleClaimReward}></button>
    }
    return (
        <div>
            <div className="--container-wrapper" >
                <div className="--container-inner">
                    <p className="order">
                        #{info.id} {parseInt(info.endTime) == 0 ? "Pending" : (parseInt(info.endTime) < parseInt(info.timeStamp) ? "Watting for Result" : ("Betting End in " + (parseInt(info.endTime) - parseInt(info.timeStamp)).toString() + ' s'))}
                    </p>
                    <div className="line"></div>
                    <div className="price-tag">
                        <p>INJ Price</p>
                        <p className={parseFloat(info.binancePrice) >= parseFloat(info.startPrice) ? "price-up" : "price-down"} >${info.binancePrice}</p>
                        <table className="info">
                            <tr>
                                <th className="price-start">Start Price</th>
                                <th>${info.startPrice}</th>
                            </tr>
                            <tr>
                                <td className="prize">Total Prize</td>
                                <td>{(parseFloat(((BigInt(info.totalUp) + BigInt(info.totalDown)) / BigInt("100000000000000")).toString()) / 10000).toString()} $INJ</td>
                            </tr>
                            <tr>
                                <td className="prize">Up Postion</td>
                                <td>{(parseFloat((BigInt(info.upPosition) / BigInt('10000000000000')).toString()) / 100000).toString()} $INJ</td>
                            </tr>
                            <tr>
                                <td className="prize">Down Postion</td>
                                <td>{(parseFloat((BigInt(info.downPosition) / BigInt('10000000000000')).toString()) / 100000).toString()} $INJ</td>
                            </tr>
                        </table>
                    </div>
                    <input type="number" className="input" value={inputValue} onChange={(e) => handleChange(e)} />
                    <div className="--button-container ---a">
                        <button onClick={handleUpBet} disabled={info.status != "1"} className="button ---a">UP</button>
                        {/* <p className="--button-text">UP</p> */}
                        <object className="--center-vertical" data="up.svg" width="50" height="50"> </object>

                    </div>
                    <div className="--button-container ---b">
                        <button onClick={handleDownBet} disabled={info.status != "1"} className="button ---b">DOWN</button>
                        <object className="--center-vertical" data="down.svg" width="40" height="40"> </object>
                        {/* <p className="--button-text">DOWN</p> */}
                    </div>
                </div>
            </div >

            <div className="--margin"></div>

            <div className="--container-wrapper -bet--info">
                <div className="--step">
                    <div className="--bet-info-id">#{betID}</div>
                    <a className="previous round">
                        <button onClick={() => { betID != "0" ? handleQueryBetInfoPrevious() : {} }} className="--change-betId-button">
                            &#8249;
                        </button>
                    </a>
                    <a className="next round">
                        <button onClick={handleQueryBetInfoNext} className="--change-betId-button">
                            &#8250;
                        </button>
                    </a>
                </div>
                <div>
                    <table className="info">
                        <tr>
                            <th className="--bet-info-data">Start Price</th>
                            <th className="--bet-info-data">${betInfoState.startPrice}</th>
                        </tr>
                        <tr>
                            <td className="--bet-info-data">End Price</td>
                            <td className="--bet-info-data">${betInfoState.endPrice}</td>
                        </tr>
                        <tr>
                            <td className="--bet-info-data">Total Prize</td>
                            <td className="--bet-info-data">
                                {parseInt((BigInt(betInfoState.totalPrize as string) / BigInt("10000000000000")).toString()) / 100000} $INJ
                            </td>
                        </tr>
                    </table>
                </div>
                <div className="--margin">

                </div>
                <div className=".--bet-info-button">
                    <button className="--check-and-claim" onClick={handleQueryReward}>CHECK</button>
                    <div>
                        {rewardState != "0" ? <Claim /> : null}
                    </div>

                </div>
            </div>
        </div >

    );
};

export default CurrentBet;
