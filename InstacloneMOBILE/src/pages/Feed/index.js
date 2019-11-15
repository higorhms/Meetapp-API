import React, { useState, useEffect, useCallback } from 'react';

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
    const [viewable, setViewable] = useState([]);

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

    const handleViewableChanged = useCallback(({ changed }) => {
        setViewable(changed.map(({ item }) => item.id));
    }, []);

    return (
        <View>
            <FlatList
                data={feed}
                keyExtractor={post => String(post.id)}
                onEndReached={() => loadPage()}
                onEndReachedThreshold={0.1}
                onRefresh={refreshList}
                refreshing={refreshing}
                onViewableItemsChanged={handleViewableChanged}
                viewabilityConfig={{ viewAreaCoveragePercentThreshold: 20 }}
                ListFooterComponent={loading && <Loading />}
                renderItem={({ item }) => (
                    <Post>
                        <Header>
                            <Avatar source={{ uri: item.author.avatar }} />
                            <Name>{item.author.name}</Name>
                        </Header>
                        <LazyImage
                            shouldLoad={viewable.includes(item.id)}
                            ratio={item.aspectRatio}
                            source={{ uri: item.image }}
                            smallSource={{ uri: item.image }}
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
