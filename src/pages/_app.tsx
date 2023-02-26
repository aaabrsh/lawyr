/* eslint-disable @typescript-eslint/ban-ts-comment */
//@ts-nocheck
import Router from "next/router";
import "../styles/globals.css";
import type { AppType } from "next/app";
import type { Session } from "next-auth";
import Footer from "../components/ui/Footer";
import Header from "../components/Header";
import { SessionProvider } from "next-auth/react";
import NProgress from "nprogress"; //nprogress module
import "nprogress/nprogress.css"; //styles of nprogress
import { Toaster } from "react-hot-toast";
//Binding events.
Router.events.on("routeChangeStart", () => NProgress.start());
Router.events.on("routeChangeComplete", () => NProgress.done());
Router.events.on("routeChangeError", () => NProgress.done());

const MyApp: AppType<{ session: Session | null }> = ({
  Component,
  pageProps: { session, ...pageProps },
}) => {
  return (
    <SessionProvider session={session}>
      {/* <Header /> */}
      <Toaster />
      <Component {...pageProps} />
      {/* <Footer /> */}
    </SessionProvider>
  );
};

export default MyApp;
