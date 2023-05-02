import { usePredictStore } from "@/context/PredictContextProvider";
import React, { useEffect, useState } from "react";
import { useQuery } from 'react-query'


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
        binancePrice: '0',
        timeStamp: '0'
    });
    const { data,
        queryBetInfo,
        queryReward,
        startBet,
        endBet,
        upBet,
        downBet,
        claimReward,
        fetchCurrentInfo
    } = usePredictStore();

    // https://data.binance.com/api/v3/ticker/price?symbol=INJUSDT

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
        setInputValue("0");
    }
    function handleDownBet() {
        downBet(inputValue);
        setInputValue("0");
        console.log(info.downPosition);
    }
    function handleClaimReward() {
        claimReward(inpuId);
    }
    function handleQueryBetInfo() {
        queryBetInfo(inpuId as string);
    }
    function handleQueryCurrentInfo() {
        fetchCurrentInfo();
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
    // onMouseOver={handleQueryCurrentInfo} 
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
                    <div className="--bet-info-id">#120</div>
                    <a href="#" className="previous round">&#8249;</a>
                    <a href="#" className="next round">&#8250;</a>
                </div>
                <div>
                    <table className="info">
                        <tr>
                            <th className="--bet-info-data">Start Price</th>
                            <th className="--bet-info-data">$7.862</th>
                        </tr>
                        <tr>
                            <td className="--bet-info-data">End Price</td>
                            <td className="--bet-info-data">$7.862</td>
                        </tr>
                        <tr>
                            <td className="--bet-info-data">Total Prize</td>
                            <td className="--bet-info-data">1100.2 INJ</td>
                        </tr>
                    </table>
                </div>
                <div className="--margin">

                </div>
                <div className=".--bet-info-button">
                    <button className="--check-and-claim">CHECK</button>
                    <button className="--check-and-claim --claim"></button>
                </div>
            </div>
        </div>

    );
};

export default CurrentBet;
