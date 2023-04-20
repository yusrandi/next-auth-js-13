import type { AppProps } from 'next/app';
import type { Page } from '../types/types';
import React from 'react';
import { LayoutProvider } from '../layout/context/layoutcontext';
import Layout from '../layout/layout';
import 'primereact/resources/primereact.css';
import 'primeflex/primeflex.css';
import 'primeicons/primeicons.css';
import '../styles/layout/layout.scss';
import '../styles/demo/Demos.scss';
import { SessionProvider } from "next-auth/react"


type Props = AppProps & {
    Component: Page;
};

export default function MyApp({ Component, pageProps }: Props) {

    return (
        <SessionProvider session={pageProps.session}>
            <LayoutProvider>
                <Layout>
                    <Component {...pageProps} />
                </Layout>
            </LayoutProvider>
        </SessionProvider>
    );

    // if (Component.getLayout) {
    //     return (
    //         <div>
    //             <LayoutProvider>
    //                 {Component.getLayout(<Component {...pageProps} />)}
    //             </LayoutProvider>
    //         </div>
    //     )
    // } else {
    //     return (
    //         <SessionProvider session={pageProps.session}>
    //             <LayoutProvider>
    //                 <Layout>
    //                     <Component {...pageProps} />
    //                 </Layout>
    //             </LayoutProvider>
    //         </SessionProvider>
    //     );
    // }
}
