import {Text, TouchableOpacity, View} from "react-native";
import React from "react";


export interface Option {
    value: string;
    label: string;
}

// todo
const Segments = ({value, options, onChange}: {
    value?: string,
    options: Option[],
    onChange: (options: Option) => void
}) => {

    return (
        <View
            className="flex-row p-1 mb-5 space-x-1 bg-primary/10 rounded-xl border-primary/30 border-[0.5px]">
            {
                options.map((x, index) => (
                    <TouchableOpacity
                        key={index}
                        onPress={() => onChange(x)}
                        className={`flex-1 items-center p-2 rounded-lg ${x.value === value ? 'bg-primary' : ''}`}
                    >
                        <Text
                            className={`text-base font-medium ${x.value === value ? 'text-white' : 'text-primary'}`}>{x.label}</Text>
                    </TouchableOpacity>
                ))
            }
            {/*<TouchableOpacity*/}
            {/*    onPress={() => setCategory('media')}*/}
            {/*    className={`flex-1 items-center p-2 rounded-lg ${category === 'media' ? 'bg-primary' : ''}`}*/}
            {/*>*/}
            {/*    <Text*/}
            {/*        className={`text-base font-medium ${category === 'media' ? 'text-white' : 'text-primary'}`}>{t('scene.media', 'Media')}</Text>*/}
            {/*</TouchableOpacity>*/}
            {/*<TouchableOpacity*/}
            {/*    onPress={() => setCategory('script')}*/}
            {/*    className={`flex-1 items-center p-2 rounded-lg ${category === 'script' ? 'bg-primary' : ''}`}*/}
            {/*>*/}
            {/*    <Text*/}
            {/*        className={`text-base font-medium ${category === 'script' ? 'text-white' : 'text-primary'}`}>{t('scene.script', 'Script')}</Text>*/}
            {/*</TouchableOpacity>*/}
        </View>
    )
}

export default Segments;
