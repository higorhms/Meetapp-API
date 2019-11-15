import React, { useState, useEffect } from 'react';
import { Animated } from 'react-native';

import { Small, Original } from './styles';

export default function LazyImage({ source, smallSource, ratio, shouldLoad }) {
    const [loaded, setLoaded] = useState(false);
    const opacity = new Animated.Value(0); // variavel que guarda o tipo de animação
    const OriginalAnimated = Animated.createAnimatedComponent(Original); // criando componente animado, com um componente ja existente

    useEffect(() => {
        if (shouldLoad) {
            setTimeout(() => {
                setLoaded(true);
            }, 1000);
        }
    }, [shouldLoad]);

    function handleAnimated() {
        Animated.timing(opacity, {
            toValue: 1,
            duration: 500,
            useNativeDriver: true,
        }).start();
    }

    return (
        <Small source={smallSource} ratio={ratio} blurRadius={4}>
            {loaded && (
                <OriginalAnimated
                    style={{ opacity }}
                    source={source}
                    ratio={ratio}
                    onLoadEnd={handleAnimated}
                />
            )}
        </Small>
    );
}
