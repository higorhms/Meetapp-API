import React, { useState, useEffect } from 'react';

import { FlatList } from 'react-native-gesture-handler';
import { View } from 'react-native';
import { Post, Header, Avatar, Name, Description, PostImage } from './styles';
import api from '../../services/api';

export default function Feed() {
    const [feed, setFeed] = useState([]);

    useEffect(() => {
        async function fetchMyApi() {
            await api
                .get('/feed?_expand=author&_limit=5&_page=1')
                .then(resp => {
                    setFeed(resp.data);
                });
        }
        fetchMyApi();
    }, []);

    return (
        <View>
            <FlatList
                data={feed}
                keyExtractor={post => String(post.id)}
                renderItem={({ item }) => (
                    <Post>
                        <Header>
                            <Avatar source={{ uri: item.author.avatar }} />
                            <Name>{item.author.name}</Name>
                        </Header>
                        <PostImage
                            ratio={item.aspectRatio}
                            source={{ uri: item.image }}
                        />
                        <Description>
                            <Name>{item.author.name}:</Name> {item.description}
                        </Description>
                    </Post>
                )}
            />
        </View>
    );
}
