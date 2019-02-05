import { Image, View } from 'react-native';
import React from 'react';

export const Logo = () => (
    <View style={{flexDirection: 'row', justifyContent: 'center', marginBottom: 10}}>
        <Image resizeMode='contain'
            source={require('../../images/header-img-unicorn.png')}
            style={{width: 240, height: 160}}
        />
    </View>
);
