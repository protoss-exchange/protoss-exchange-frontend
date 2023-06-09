import {
  Token,
  TokenAmount,
  JSBI,
  Percent,
  TradeType,
  Fraction,
  ONE,
  ZERO,
} from "protoss-exchange-sdk";
import { parseUnits } from "@ethersproject/units";
import { bnToUint256, Uint256, uint256ToBN } from "starknet/utils/uint256";
import { toBN } from "starknet/utils/number";
import { Result } from "starknet";

// parse scientific notation to string, like this 1e5->10000
export function scientificNotationToString(param: string) {
  if (!/e/.test(param)) {
    return param;
  }

  let sysbol = true;
  if (/e-/.test(param)) {
    sysbol = false;
  }

  const index = Number(param.match(/\d+$/)?.[0]);
  const basis = param.match(/^[\d.]+/)?.[0].replace(/\./, "");

  if (!basis) {
    return param;
  }

  return sysbol
    ? basis.padEnd(index + 1, "0")
    : basis.padStart(index + (basis?.length ?? 0), "0").replace(/^0/, "0.");
}
export const tryParseAmount = (
  value?: string | number,
  currency?: Token | undefined
): TokenAmount | undefined => {
  if (!value || !currency) return undefined;
  value = scientificNotationToString(value.toString());

  try {
    const typedValueParsed = parseUnits(
      value.toString(),
      currency.decimals
    ).toString();
    if (typedValueParsed !== "0") {
      return new TokenAmount(currency, JSBI.BigInt(typedValueParsed));
    }
  } catch (error) {
    // should fail if the user specifies too many decimal places of precision (or maybe exceed max uint?)
    console.info(`Failed to parse input amount: "${value}"`, error);
  }
  // necessary for all paths to return a value
  return undefined;
};

export const decimalToHex = (decimal: string, addPrefix = true) => {
  let hex = addPrefix ? "0x" : "";

  for (let i = 0; i < decimal.length; i++) {
    const charCode = decimal.charCodeAt(i);
    const hexValue = charCode.toString(16);
    hex += hexValue;
  }
  return hex;
};

export const uint256ToReadable = (input: Uint256) => {
  const bigInt = JSBI.BigInt(uint256ToBN(input));
  return JSBI.divide(bigInt, JSBI.BigInt("1000000000000000000")).toString();
};

export const uint256ToHex = (input: Result) => {
  const bigInt = BigInt(input.toString());
  return bigInt.toString(16);
};
