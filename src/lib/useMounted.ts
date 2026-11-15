import { useSyncExternalStore } from "react";
const noop = () => () => {};
/** true on the client after hydration — avoids persisted-cart hydration mismatches */
export const useMounted = () => useSyncExternalStore(noop, () => true, () => false);
