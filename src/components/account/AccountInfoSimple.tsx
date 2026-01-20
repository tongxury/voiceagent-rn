import {Image, Text, TouchableOpacity, View} from "react-native";
import SocialIcon from "@/assets/svgs";
import React from "react";
import {Account} from "@/types";
import useLinking from "@/hooks/useLinking";

const AccountInfo = ({account}: { account: Account }) => {
    const {openXhsProfile} = useLinking()

    if (!account) {
        return null;
    }

    return (
        <View className="">
            <View className="flex-row items-start">
                {/* 头像区域 */}
                <TouchableOpacity
                    activeOpacity={0.9}
                    onPress={() => openXhsProfile(account?.extra?.id)}
                    className="relative"
                >
                    <View className="relative">
                        <Image
                            source={{uri: account.avatar}}
                            style={{width: 70, height: 70}}
                            className="rounded-2xl"
                        />

                        {/* 平台标识 */}
                        <View
                            className="absolute -top-2 -right-2 w-8 h-8 bg-background2 rounded-full items-center justify-center border-2 border-primary">
                            <SocialIcon name={account.platform} size={16}/>
                        </View>
                    </View>
                </TouchableOpacity>

                {/* 基本信息 */}
                <View className="flex-1 ml-4">
                    <Text className="text-white font-bold text-xl mb-2">
                        {account.nickname || ''}
                    </Text>

                    <Text className="text-grey2 text-sm mb-3">
                        {account.followers || 0} 粉丝 • {account.posts || 0} 作品
                    </Text>
                </View>
            </View>
        </View>
    )
}

export default AccountInfo;
