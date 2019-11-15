import React, { useState, useEffect } from 'react';

import { View, FlatList } from 'react-native';
import { Post, Header, Avatar, Name, Description, Loading } from './styles';
import LazyImage from '../../components/LazyImage';
import api from '../../services/api';

export default function Feed() {
    const [feed, setFeed] = useState([]);
    const [total, setTotal] = useState(0);
    const [page, setPage] = useState(1);
    const [loading, setLoaging] = useState(false);
    const [refreshing, setRefreshing] = useState(false);

    async function loadPage(pageNumber = page, shouldRefresh = false) {
        if (total && pageNumber > total) return;

        setLoaging(true);

        const response = await api.get(
            `/feed?_expand=author&_limit=5&_page=${pageNumber}`,
        );

        // const totalItems = response.headers.get('X-Total-Count');
        const totalItems = response.headers['x-total-count'];
        setTotal(Math.floor(totalItems / 5));

        const { data } = response;

        setFeed(shouldRefresh ? data : [...feed, ...data]);
        setPage(pageNumber + 1);
        setLoaging(false);
    }

    useEffect(() => {
        loadPage();
    }, []);

    async function refreshList() {
        setRefreshing(true);

        await loadPage(1, true);

        setRefreshing(false);
    }

    return (
        <View>
            <FlatList
                data={feed}
                keyExtractor={post => String(post.id)}
                onEndReached={() => loadPage()}
                onEndReachedThreshold={0.1}
                ListFooterComponent={loading && <Loading />}
                onRefresh={refreshList}
                refreshing={refreshing}
                renderItem={({ item }) => (
                    <Post>
                        <Header>
                            <Avatar source={{ uri: item.author.avatar }} />
                            <Name>{item.author.name}</Name>
                        </Header>
                        <LazyImage
                            ratio={item.aspectRatio}
                            source={{ uri: item.image }}
                            smallSource={{ uri: item.small }}
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
