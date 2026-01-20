import React from 'react';
import {View, Text, TouchableOpacity, ScrollView} from "react-native";

export interface Option {
    value: string;
    label: string;
    badge?: number | boolean; // 徽标：数字或红点
}

interface TextTabsProps {
    current?: Option;
    options: Option[];
    onChange?: (option: Option) => void;
    showIndicator?: boolean;
}

const TextTabs = ({
                      current,
                      options,
                      onChange,
                      showIndicator = true
                  }: TextTabsProps) => {

    const handleTabPress = (option: Option) => {
        onChange?.(option);
    };

    const isSelected = (option: Option) => {
        return current?.value === option.value;
    };

    return (
        <View className="bg-background">
            <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
            >
                {options.map((option, index) => {
                    const selected = isSelected(option);

                    return (
                        <TouchableOpacity
                            key={option.value}
                            onPress={() => handleTabPress(option)}
                            className={'mx-[15px] mt-[5px] relative'}
                            activeOpacity={0.7}
                        >
                            <Text
                                className={`
                                    text-md font-medium text-center
                                   text-white
                                `}
                            >
                                {option.label}
                            </Text>

                            {/* 底部指示器 */}
                            {showIndicator && selected && (
                                <View className="h-1 mt-[5px] bg-primary rounded-full"/>
                            )}

                            {/* 徽标 */}
                            {option.badge && (
                                <View className="absolute -top-1 -right-2">
                                    {typeof option.badge === 'number' ? (
                                        // 数字徽标
                                        <View className="bg-red-500 rounded-full min-w-[20px] h-[14px] px-1 justify-center items-center">
                                            <Text className="text-white text-xs font-bold">
                                                {option.badge > 99 ? '99+' : option.badge}
                                            </Text>
                                        </View>
                                    ) : (
                                        // 红点徽标
                                        <View className="bg-red-500 w-2 h-2 rounded-full"/>
                                    )}
                                </View>
                            )}
                        </TouchableOpacity>
                    );
                })}
            </ScrollView>
        </View>
    );
};

export default TextTabs;
