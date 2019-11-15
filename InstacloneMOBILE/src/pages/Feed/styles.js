import styled from 'styled-components/native';

export const Post = styled.View`
    margin-top: 15px;
`;

export const Header = styled.View`
    padding: 15px;
    flex-direction: row;
    align-items: center;
`;

export const Avatar = styled.Image`
    width: 32px;
    height: 32px;
    border-radius: 16px;
`;

export const Name = styled.Text`
    color: #333;
    font-weight: bold;
    margin-left: 5px;
`;

export const Description = styled.Text`
    padding: 15px;
    line-height: 18px;
`;

export const Loading = styled.ActivityIndicator.attrs({
    size: 'small',
    color: '#999',
})`
    margin: 30px 0;
`;
