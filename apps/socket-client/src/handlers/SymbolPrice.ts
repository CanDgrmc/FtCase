export const handlePriceUpdate = (ev: string) => {
  const updatedSymbols: string[] = JSON.parse(ev);
  updatedSymbols.map((symbolStr) => {
    const symbol = JSON.parse(symbolStr);

    if (symbol.symbol === "DCTTR") {
      console.log(
        `[CLIENT]: Price updated: ${
          symbol.symbol
        } [${symbol.direction.toUpperCase()}] > from ${symbol.open} to ${
          symbol.close
        } with %${symbol.percentage} and daily %${
          symbol.dailyChangePercentage
        }. (Time: ${symbol.dataTimestamp})`
      );
    }
  });
};
