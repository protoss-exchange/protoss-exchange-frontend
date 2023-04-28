import { Provider } from "starknet";
import { getNetwork } from "../utils";
//@ts-ignore
export const defaultProvider = new Provider({ network: getNetwork() });
