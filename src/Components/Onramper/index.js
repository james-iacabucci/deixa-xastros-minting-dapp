import * as React from 'react';
import { useEffect, useState } from 'react';
import { useMoralis } from 'react-moralis';

export default function Onramper() {
  const { account, Moralis } = useMoralis();
  const [fiatUrl, setFiatUrl] = useState();
  useEffect(() => {
    const getFiatPlugin = async () => {
      if (!Moralis.Plugins.fiat) return;
      let response = await Moralis.Plugins.fiat.buy(
        {
          coin: 'ETH',
          receiver: account,
        },
        {
          disableTriggers: true,
        },
      );
      setFiatUrl(response.data);
    };
    getFiatPlugin();
  }, [Moralis.Plugins.fiat, account]);

  return (
    <div>
      {fiatUrl && (
        <iframe
          src={fiatUrl}
          height="595px"
          width="440px"
          title="Buy ETH on Deixa"
          frameborder="0"
          allow="accelerometer;
    autoplay; camera; gyroscope; payment"
        />
      )}
    </div>
  );
}
