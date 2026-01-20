import React from 'react';
import { View, Text } from 'react-native';

const LetterAvatar = ({name, size = 40}: { name: string, size?: number }) => {
    // 获取首字母
    const initial = name ? name.charAt(0).toUpperCase() : '?';

    // 基于名称生成一致的颜色
    const stringToColor = (str: string = "") => {
        let hash = 0;
        for (let i = 0; i < str.length; i++) {
            hash = str.charCodeAt(i) + ((hash << 5) - hash);
        }
        let color = '#';
        for (let i = 0; i < 3; i++) {
            const value = (hash >> (i * 8)) & 0xff;
            color += ('00' + value.toString(16)).substr(-2);
        }
        return color;
    };

    const backgroundColor = stringToColor(name);
    // 基于背景色选择文字颜色
    // @ts-ignore
    const textColor = backgroundColor.substring(1).match(/.{2}/g)
        .map(hex => parseInt(hex, 16))
        .reduce((sum, val) => sum + val, 0) > 382 ? '#fff' : '#fff';

    return (
        <View
            style={{
                borderWidth: 1,
                borderColor: 'white',
                width: size,
                height: size,
                borderRadius: size / 2,
                backgroundColor,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
            }}
        >
            <Text
                style={{
                    color: textColor,
                    fontSize: size / 2,
                    fontWeight: 'bold',
                }}
            >
                {initial}
            </Text>
        </View>
    );
};

export default LetterAvatar;
