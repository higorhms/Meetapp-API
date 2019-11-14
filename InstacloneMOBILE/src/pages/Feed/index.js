import React, { useState, useEffect } from 'react';

import { FlatList } from 'react-native-gesture-handler';
import { View } from 'react-native';
import { Post, Header, Avatar, Name, Description, PostImage } from './styles';
import api from '../../services/api';

export default function Feed() {
    const [feed, setFeed] = useState([]);
    const [total, setTotal] = useState(0);
    const [page, setPage] = useState(1);

    async function loadPage(pageNumber = page) {
        if (total && pageNumber > total) return;

        const response = await api.get(
            `/feed?_expand=author&_limit=5&_page=${pageNumber}`,
        );

        // const totalItems = response.headers.get('X-Total-Count');
        const totalItems = response.headers['x-total-count'];
        setTotal(Math.floor(totalItems / 5));

        const { data } = response;

        setFeed([...feed, ...data]);
        setPage(pageNumber + 1);
    }

    useEffect(() => {
        loadPage();
    }, []);

    return (
        <View>
            <FlatList
                onEndReached={() => loadPage()}
                onEndReachedThreshold={0.1}
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
