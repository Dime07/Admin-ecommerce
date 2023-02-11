import Head from "next/head";
// pages/_app.js
import { DM_Sans } from '@next/font/google'

// If loading a variable font, you don't need to specify the font weight
const dmsans = DM_Sans({subsets: ['latin'], weight: ["400"]})


import Navbar from "./Navbar";

interface LayoutInterface {
    children: any,
    title: string
}

export default function Layout(props: LayoutInterface) {
    
    return (
        <div className={dmsans.className + ' overflow-x-hidden'}>
            <Head>
                <title>{props.title}</title>
                <meta name="description" content="Admin to manage E commerce" />
                <meta name="viewport" content="width=device-width, initial-scale=1" />
                <link rel="icon" href="/favicon.ico" />
            </Head>
            <main className="flex lg:flex-row flex-col relative">
                <Navbar />
                <div className="lg:pl-56 pl-0 w-full lg:mt-0 mt-24">
                    {props.children}
                </div>
            </main>
        </div>
    )
}
