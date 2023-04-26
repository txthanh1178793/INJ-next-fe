import { useCounterStore } from "@/context/PredictContextProvider";
import ConnectWallet from "@/components/ConnectWallet";
import React, { useEffect, useState } from "react";
import Link from 'next/link';
type Props = {};

function Home({ }: Props) {
  const [inputCount, setInputCount] = useState("0");
  const { count, isLoading, incrementCount, setContractCounter } =
    useCounterStore();
  useEffect(() => {
    setInputCount(count.toString());
  }, [count]);

  function handleSetCount() {
    setContractCounter(inputCount);
  }


  return (
    <div>
      <body>
        <nav className="sc-ff5a39ab-1 cZeLOv">
          <div className="sc-3a5c8d1f-1 sc-32d5f017-0 glwDJB fOPopv">
            <div className="sc-3a5c8d1f-1 sc-32d5f017-0 glwDJB chfQFH">
              <object type="image/svg+xml" data="DOM_Predict.svg"></object>
              <svg viewBox="0 0 1281 199" className="sc-231a1e38-0 dPwWVs desktop-icon" color="text" width="200px">
                <use xlinkHref="#icomoon-ignore" />
              </svg>
            </div>
            <div className="ggzm1z0 _1nzuaz710 _1nzuaz72">
              <div className="sc-3a5c8d1f-1 sc-32d5f017-0 lbEZGW fOPopv">
                <Link href="/" className="sc-bcdfb9f2-0 fQQnxa sc-437c0afe-1 bTxNJR">Predict</Link>
                <Link href="/" className="sc-bcdfb9f2-0 fQQnxa sc-437c0afe-1 bTxNJR">Lottery</Link>
                <Link href="/" className="sc-bcdfb9f2-0 fQQnxa sc-437c0afe-1 bTxNJR">About</Link>
                <Link href="/" className="sc-bcdfb9f2-0 fQQnxa sc-437c0afe-1 bTxNJR">Community</Link>
              </div>
            </div>
          </div>

          <div className="sc-3a5c8d1f-1 sc-32d5f017-0 qopKT chfQFH">
            {/* <button className="sc-56a7a3a9-0 cyLbdv" >
              <div>Connect Wallet</div>
            </button> */}
            <ConnectWallet />
          </div>
        </nav>

        <div className="sc-3a5c8d1f-1 sc-ff5a39ab-4 iuuTdc ehOcez bPOyEc">
          <div className="sc-667a20da-4 eOKfsA">
            <div className="sc-667a20da-1 iWIALT">
              <div className="sc-667a20da-5 dGJnQD">
              </div>
            </div>
          </div>
        </div>
      </body >
    </div>
  );

}

export default Home;
