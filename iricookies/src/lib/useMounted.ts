"use client";
import { useSyncExternalStore } from "react";

const subscribe = () => () => {};
/** true only on the client, after hydration — safe for persisted-store reads. */
export const useMounted = () => useSyncExternalStore(subscribe, () => true, () => false);
