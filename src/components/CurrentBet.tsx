import { useWalletStore } from "@/context/WalletContextProvider";
import React from "react";

type Props = {};
const CurrentBet = (props: Props) => {
    return (
        <div className="--container-wrapper">
            <div className="--container-inner">
                <p className="order">#1420</p>
                <div className="line"></div>
                <div className="price-tag">
                    <p>INJ Price</p>
                    <p className="price">$7.863</p>
                    <table className="info">
                        <tr>
                            <th className="price-start">Start Price</th>
                            <th>$7.862</th>
                        </tr>
                        <tr>
                            <td className="prize">Total Prize</td>
                            <td>1100.2 INJ</td>
                        </tr>
                    </table>
                </div>
                <input type="number" className="input" />
                <div className="--button-container ---a">
                    <p className="--button-text">UP</p>
                    <object className="--center-vertical" data="up.svg" width="50" height="50"> </object>



                </div>
                <div className="--button-container ---b">
                    <object className="--center-vertical" data="down.svg" width="40" height="40"> </object>
                    <p className="--button-text">DOWN</p>
                </div>
            </div>

        </div>
    );
};

export default CurrentBet;
