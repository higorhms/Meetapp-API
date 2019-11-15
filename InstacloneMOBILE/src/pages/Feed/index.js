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
        setTotal(Math.ceil(totalItems / 5));

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
                data={feed} // dados que serão renderizados na lista
                keyExtractor={post => String(post.id)} // key para diferenciar um item do outro
                onEndReached={() => loadPage()} // função chamada quando o scroll chega ao fim da pagina
                onEndReachedThreshold={0.1} // porcentagem do fim da pagina para disparar o onEndReached
                onRefresh={refreshList} // função chamada quando o usuario puxa a lista pra cima
                refreshing={refreshing} // boolean que determina o refreshing
                onViewableItemsChanged={handleViewableChanged} // Called when the viewability of rows changes, as defined by the viewabilityConfig prop.
                viewabilityConfig={{ viewAreaCoveragePercentThreshold: 20 }} // porcentagem visualizada para chamar o onViewableItemsChanged
                ListFooterComponent={loading && <Loading />} // Componente que será renderizado no fim da lista
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
