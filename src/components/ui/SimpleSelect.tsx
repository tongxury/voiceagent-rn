import React, {useState, useRef, useEffect} from "react";
import {
    View,
    Text,
    TouchableOpacity,
    Modal,
    TouchableWithoutFeedback,
    Animated,
    Dimensions,
    Platform
} from "react-native";
import {AntDesign} from "@expo/vector-icons";
import useTailwindVars from "@/hooks/useTailwindVars";

export interface SelectOption {
    label: string;
    value: string;
    disabled?: boolean; // 新增：禁用选项
}

interface SimpleSelectProps {
    options: SelectOption[];
    value?: string;
    onSelect: (value: string) => void;
    placeholder?: string;
    disabled?: boolean;
    maxHeight?: number;
    style?: any;
    dropdownStyle?: any;
    optionStyle?: any;
}

const SimpleSelect: React.FC<SimpleSelectProps> = ({
                                                       options,
                                                       value,
                                                       onSelect,
                                                       placeholder = "Select...",
                                                       disabled = false,
                                                       maxHeight = 200,
                                                       style,
                                                       dropdownStyle,
                                                       optionStyle,
                                                   }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [dropdownLayout, setDropdownLayout] = useState({x: 0, y: 0, width: 0, height: 0});
    const {colors} = useTailwindVars();

    const withAlpha = (rgb: string, alpha: number) => {
        return rgb.replace('rgb', 'rgba').replace(')', `, ${alpha})`);
    };

    const selectRef = useRef<any>(null);
    const fadeAnim = useRef(new Animated.Value(0)).current;
    const scaleAnim = useRef(new Animated.Value(0.95)).current;

    const selectedOption = options.find((option) => option.value === value);
    const screenHeight = Dimensions.get('window').height;

    // 动画效果
    useEffect(() => {
        if (isOpen) {
            Animated.parallel([
                Animated.timing(fadeAnim, {
                    toValue: 1,
                    duration: 200,
                    useNativeDriver: true,
                }),
                Animated.spring(scaleAnim, {
                    toValue: 1,
                    tension: 100,
                    friction: 8,
                    useNativeDriver: true,
                }),
            ]).start();
        } else {
            Animated.parallel([
                Animated.timing(fadeAnim, {
                    toValue: 0,
                    duration: 150,
                    useNativeDriver: true,
                }),
                Animated.timing(scaleAnim, {
                    toValue: 0.95,
                    duration: 150,
                    useNativeDriver: true,
                }),
            ]).start();
        }
    }, [isOpen]);

    const handleOpen = () => {
        if (disabled) return;

        selectRef.current?.measureInWindow((x: number, y: number, width: number, height: number) => {
            setDropdownLayout({x, y, width, height});
            setIsOpen(true);
        });
    };

    const handleClose = () => {
        setIsOpen(false);
    };

    const handleSelect = (optionValue: string) => {
        onSelect(optionValue);
        handleClose();
    };

    // 计算下拉框位置
    const getDropdownPosition = () => {
        const dropdownHeight = Math.min(options.length * 48, maxHeight);
        const spaceBelow = screenHeight - dropdownLayout.y - dropdownLayout.height;
        const spaceAbove = dropdownLayout.y;

        const shouldShowAbove = spaceBelow < dropdownHeight && spaceAbove > dropdownHeight;

        return {
            top: shouldShowAbove
                ? dropdownLayout.y - dropdownHeight - 8
                : dropdownLayout.y + dropdownLayout.height + 8,
            left: dropdownLayout.x,
            width: dropdownLayout.width,
            maxHeight: shouldShowAbove ? spaceAbove - 20 : spaceBelow - 20,
        };
    };

    return (
        <>
            <TouchableOpacity
                ref={selectRef}
                activeOpacity={disabled ? 1 : 0.8}
                onPress={handleOpen}
                style={[
                    {
                        flexDirection: "row",
                        alignItems: "center",
                        justifyContent: "space-between",
                        paddingHorizontal: 16,
                        paddingVertical: 8,
                        backgroundColor: disabled ? withAlpha(colors.background, 0.5) : colors.background,
                        borderRadius: 8,
                        minWidth: 120,
                        borderWidth: 1,
                        borderColor: isOpen ? colors.primary : 'transparent',
                        shadowColor: "#000",
                        shadowOffset: {
                            width: 0,
                            height: 1,
                        },
                        shadowOpacity: 0.1,
                        shadowRadius: 2,
                        elevation: 2,
                    },
                    style,
                ]}
            >
                <Text
                    style={{
                        color: disabled
                            ? withAlpha(colors.mutedForeground, 0.5)
                            : selectedOption
                                ? colors.foreground
                                : colors.mutedForeground,
                        fontSize: 15,
                        fontWeight: selectedOption ? '500' : '400',
                        flex: 1,
                    }}
                    numberOfLines={1}
                    ellipsizeMode="tail"
                >
                    {selectedOption ? selectedOption.label : placeholder}
                </Text>

                <Animated.View
                    style={{
                        transform: [{
                            rotate: isOpen ? '180deg' : '0deg'
                        }],
                        marginLeft: 8,
                    }}
                >
                    <AntDesign
                        name="down"
                        size={14}
                        color={disabled ? withAlpha(colors.mutedForeground, 0.5) : colors.mutedForeground}
                    />
                </Animated.View>
            </TouchableOpacity>

            <Modal
                visible={isOpen}
                transparent={true}
                animationType="none"
                onRequestClose={handleClose}
            >
                <TouchableWithoutFeedback onPress={handleClose}>
                    <View style={{flex: 1}}>
                        <TouchableWithoutFeedback>
                            <Animated.View
                                style={[
                                    {
                                        position: 'absolute',
                                        backgroundColor: colors.card,
                                        borderRadius: 12,
                                        marginHorizontal: 4,
                                        shadowColor: "#000",
                                        shadowOffset: {
                                            width: 0,
                                            height: 8,
                                        },
                                        shadowOpacity: 0.25,
                                        shadowRadius: 12,
                                        elevation: 16,
                                        borderWidth: Platform.OS === 'ios' ? 0.5 : 0,
                                        borderColor: colors.border,
                                        overflow: 'hidden',
                                    },
                                    getDropdownPosition(),
                                    dropdownStyle,
                                    {
                                        opacity: fadeAnim,
                                        transform: [{scale: scaleAnim}],
                                    }
                                ]}
                            >
                                {options.map((item, index) => {
                                    const isSelected = item.value === value;
                                    const isDisabled = item.disabled;

                                    return (
                                        <TouchableOpacity
                                            key={item.value}
                                            style={[
                                                {
                                                    paddingHorizontal: 16,
                                                    paddingVertical: 14,
                                                    borderBottomWidth: index < options.length - 1 ? 0.5 : 0,
                                                    borderBottomColor: colors.border,
                                                    backgroundColor: isSelected
                                                        ? withAlpha(colors.primary, 0.1)
                                                        : 'transparent',
                                                    opacity: isDisabled ? 0.5 : 1,
                                                },
                                                optionStyle,
                                            ]}
                                            onPress={() => !isDisabled && handleSelect(item.value)}
                                            disabled={isDisabled}
                                            activeOpacity={isDisabled ? 1 : 0.7}
                                        >
                                            <View style={{
                                                flexDirection: 'row',
                                                alignItems: 'center',
                                                justifyContent: 'space-between'
                                            }}>
                                                <Text
                                                    style={{
                                                        color: isDisabled
                                                            ? withAlpha(colors.mutedForeground, 0.6)
                                                            : isSelected
                                                                ? colors.primary
                                                                : colors.foreground,
                                                        fontSize: 15,
                                                        fontWeight: isSelected ? "600" : "400",
                                                        flex: 1,
                                                    }}
                                                    numberOfLines={1}
                                                    ellipsizeMode="tail"
                                                >
                                                    {item.label}
                                                </Text>

                                            </View>
                                        </TouchableOpacity>
                                    );
                                })}
                            </Animated.View>
                        </TouchableWithoutFeedback>
                    </View>
                </TouchableWithoutFeedback>
            </Modal>
        </>
    );
};

export default SimpleSelect;
