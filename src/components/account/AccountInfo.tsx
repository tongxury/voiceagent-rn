import {Image, Text, TouchableOpacity, View} from "react-native";
import SocialIcon from "@/assets/svgs";
import React from "react";
import {Account} from "@/types";
import useLinking from "@/hooks/useLinking";

const AccountInfo = ({account, simple}: { account: Account, simple?: boolean }) => {
    const {openXhsProfile} = useLinking()

    if (!account) {
        return null;
    }

    return (
        <View className="bg-background2/70 rounded-2xl overflow-hidden">
            {/* 头部区域 */}
            <View className="p-4">
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
                            {/*{account.followers || 0} 粉丝 • {account.posts || 0} 作品*/}
                            {account.followers || 0} 粉丝
                        </Text>
                    </View>
                </View>

                {/* Sign区域重新设计 */}
                {account.sign && (
                    <View className="mt-4 p-3 bg-gray-800/30 rounded-xl border border-gray-700/30">
                        <View className="flex-row items-start">
                            <View className="w-1 h-4 bg-primary rounded-full mr-3 mt-1"/>
                            <View className="flex-1">
                                <Text className="text-gray-300 text-sm leading-6">
                                    {account.sign}
                                </Text>
                            </View>
                        </View>
                    </View>
                )}

                {/* 统计信息区域 */}
                <View className="bg-gray-800/20 mt-4 px-4 py-3">
                    <View className="flex-row justify-around">
                        {/* 粉丝数 */}
                        <View className="items-center">
                            <Text className="text-white text-lg font-bold mb-1">
                                {account.followers || 0}
                            </Text>
                            <Text className="text-gray-400 text-xs">粉丝</Text>
                        </View>

                        {/* 分隔线 */}
                        <View className="w-px h-8 bg-gray-600/50"/>


                        {/* 作品数 */}
                        {
                            account.posts &&
                            <>
                                <View className="items-center">
                                    <Text className="text-white text-lg font-bold mb-1">
                                        {account.posts || 0}
                                    </Text>
                                    <Text className="text-gray-400 text-xs">作品</Text>
                                </View>

                                {/* 分隔线 */}
                                <View className="w-px h-8 bg-gray-600/50"/>

                            </>

                        }


                        {/* 获赞数（如果有的话） */}
                        <View className="items-center">
                            <Text className="text-white text-lg font-bold mb-1">
                                {account.interacts || 0}
                            </Text>
                            <Text className="text-gray-400 text-xs">获赞</Text>
                        </View>
                    </View>
                </View>
            </View>
        </View>
    )
}

export default AccountInfo;
