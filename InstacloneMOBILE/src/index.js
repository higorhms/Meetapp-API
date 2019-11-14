import React from 'react';
import {StatusBar} from 'react-native';
import Routes from './routes';
import {colors} from './styles/global';

// import { Container } from './styles';

export default function src() {
    return (
        <>
            <Routes />
            <StatusBar
                backgroundColor={colors.headerColor}
                barStyle="dark-content"
            />
        </>
    );
}
