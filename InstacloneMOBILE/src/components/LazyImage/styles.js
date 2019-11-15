import styled from 'styled-components/native';

export const Container = styled.View``;

export const Small = styled.ImageBackground`
    width: 100%;
    aspect-ratio: ${props => props.ratio};
`;

export const Original = styled.Image`
    width: 100%;
    aspect-ratio: ${props => props.ratio};
`;
