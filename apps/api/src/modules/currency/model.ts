export interface CurrencyBound {
  upper: number;
  lower: number;
}

export interface Currency {
  bound: CurrencyBound;
  current: number;
  exchange: number;
}
