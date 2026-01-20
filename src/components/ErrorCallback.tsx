import {Button, ScrollView, Text, View} from "react-native";
import React from "react";

export default function ErrorFallback(props: any) {
    return (
        <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
            <Text style={{fontSize: 20, color: 'red', marginBottom: 10}}>出错啦！</Text>
            <Text style={{marginBottom: 20, color: 'white'}}>{props.error?.toString()}</Text>
            <Text style={{marginBottom: 20, color: 'white'}}>{JSON.stringify(props.error?.name)}</Text>

            <ScrollView>
                <Text style={{marginBottom: 20, color: 'white'}}>{JSON.stringify(props.error?.stack)}</Text>
            </ScrollView>
            <Button title="重试" onPress={props.resetError}/>
        </View>
    );
}
