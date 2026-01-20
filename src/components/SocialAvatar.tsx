import {Image, View} from "react-native";
import SocialIcon from "@/assets/svgs";
import React from "react";


const SocialAvatar = ({avatar, platform}: { avatar: string, platform: string }) => {
    return (
        <View className="relative">
            <Image
                source={{uri: avatar}}
                style={{width: 70, height: 70}}
                className="rounded-2xl"
            />

            {/* 平台标识 */}
            <View
                className="absolute -top-2 -right-2 w-8 h-8 bg-background2 rounded-full items-center justify-center border-2 border-primary">
                <SocialIcon name={platform} size={16}/>
            </View>
        </View>
    )
}

export default SocialAvatar
