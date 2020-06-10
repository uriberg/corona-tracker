import App, { Container } from 'next/app'
import React from 'react'
import Layout from "../components/Layout";
import '../sass/main.scss';
import 'fomantic-ui-css/semantic.css';

export default class MyApp extends App {
    render () {
        const { Component, pageProps } = this.props;
        return (
            <Container>
               <Layout>
                    <Component {...pageProps} />
               </Layout>
            </Container>
        )
    }
}
