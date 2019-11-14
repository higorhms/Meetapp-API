import React from 'react';
import { StatusBar } from 'react-native';
import Routes from './routes';

// import { Container } from './styles';

export default function src() {
    return (
        <>
            <Routes />
            <StatusBar backgroundColor="#f5f5f5" barStyle="dark-content" />
        </>
    );
}
