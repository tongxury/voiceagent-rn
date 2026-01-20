import {ControllerFieldState} from 'react-hook-form';
import {Text, View} from 'react-native';

export default function FormValidationError({
    fieldState,
    className,
}: {
    fieldState: ControllerFieldState;
    className?: string;
}) {
    return (
        <View className={className}>
            {fieldState.error?.message && <Text className="mt-[3px] text-error">{fieldState.error.message}</Text>}
        </View>
    );
}
