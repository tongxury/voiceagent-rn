import {ActivityIndicator, Platform, StyleProp, Text, TouchableOpacity, View, ViewStyle} from 'react-native';
import {ReactNode} from 'react';
import {HStack} from 'react-native-flex-layout';
import {useColors} from '@/hooks/useColors';
import useTailwindVars from '@/hooks/useTailwindVars';

const Button = (
    {
        children,
        text,
        disabled,
        loading,
        onPress,
        style,
    }: {
        children?: ReactNode;
        text?: string
        disabled?: boolean;
        loading?: boolean;
        onPress?: () => void;
        style?: StyleProp<ViewStyle>;
    }) => {

    const colors = useColors();
    const { colors: tailwindColors } = useTailwindVars();
    const {primary, grey4, grey3} = colors;

    const buttonStyle = {
        backgroundColor: disabled ? grey4 : primary,
        // 阴影效果
        ...Platform.select({
            ios: {
                shadowColor: disabled ? 'transparent' : primary,
                shadowOffset: {width: 0, height: 2},
                shadowOpacity: disabled ? 0 : 0.3,
                shadowRadius: 4,
            },
            android: {
                elevation: disabled ? 0 : 4,
            },
        }),
    };

    return (
        <TouchableOpacity
            activeOpacity={disabled ? 1 : 0.8}
            onPress={disabled ? undefined : onPress}
            disabled={disabled}
            className="h-11 rounded-lg justify-center items-center flex-row"
            style={[buttonStyle, style]}
        >
            <View className={'gap-[8px] items-center flex-row'} >
                {loading && <ActivityIndicator color={tailwindColors.primaryForeground} size="small" />}
                {
                    text ?
                        <Text
                            className="text-primary-foreground text-md font-semibold"
                            style={disabled ? {color: grey3} : {}}
                        >
                            {text}
                        </Text>
                        :
                        children
                }
            </View>
        </TouchableOpacity>
    );
};

export default Button;
