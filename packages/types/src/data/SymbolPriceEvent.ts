export type SymbolPriceUpdatedEvent = {
  symbol: string;
  percentage: number;
  newPrice: number;
  direction: string;
  closePrice: number;
};
