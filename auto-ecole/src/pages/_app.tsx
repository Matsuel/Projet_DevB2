import "@/styles/globals.css";
import type { AppProps } from "next/app";
import { io } from "socket.io-client";
import React, { useEffect } from "react";

export const socket = io("http://localhost:3500");

export default function App({ Component, pageProps }: AppProps) {
  useEffect(() => {
    socket.emit("join", { userId: "123" });
  });

  return <Component {...pageProps} />;
}
