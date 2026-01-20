import React, { useState, useRef } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  Pressable,
  Dimensions,
} from "react-native";
import { AntDesign } from "@expo/vector-icons";
import { useColors } from "@/hooks/useColors";

export interface SelectOption {
  label: string;
  value: string;
}

interface SelectProps {
  options: SelectOption[];
  value?: string;
  onSelect: (value: string) => void;
  placeholder?: string;
  style?: any;
}

const Select: React.FC<SelectProps> = ({
  options,
  value,
  onSelect,
  placeholder = "Select...",
  style,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [dropdownTop, setDropdownTop] = useState(0);
  const [dropdownLeft, setDropdownLeft] = useState(0);
  const [dropdownWidth, setDropdownWidth] = useState(100);
  const { white, grey2, grey5, primary, background } = useColors();
  const buttonRef = useRef<any>(null);

  const selectedOption = options.find((option) => option.value === value);

  const handleSelect = (selectedValue: string) => {
    onSelect(selectedValue);
    setIsOpen(false);
  };

  const toggleDropdown = () => {
    if (!isOpen) {
      // 测量按钮位置和尺寸
      buttonRef.current?.measure((x, y, width, height, pageX, pageY) => {
        setDropdownTop(pageY + height + 4);
        setDropdownLeft(pageX);
        setDropdownWidth(width);
        setIsOpen(true);
      });
    } else {
      setIsOpen(false);
    }
  };

  return (
    <>
      {/* 选择器主体 */}
      <TouchableOpacity
        ref={buttonRef}
        onPress={toggleDropdown}
        style={[
          {
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
            paddingHorizontal: 12,
            paddingVertical: 8,
            backgroundColor: grey5,
            borderRadius: 8,
            minWidth: 100,
          },
          style,
        ]}
      >
        <Text
          style={{
            color: selectedOption ? white : grey2,
            fontSize: 14,
          }}
          numberOfLines={1}
        >
          {selectedOption ? selectedOption.label : placeholder}
        </Text>
        <AntDesign
          name={isOpen ? "up" : "down"}
          size={12}
          color={grey2}
          style={{ marginLeft: 8 }}
        />
      </TouchableOpacity>

      {/* 下拉选项列表 - 使用绝对定位 */}
      {isOpen && (
        <View
          style={{
            position: "absolute",
            top: dropdownTop,
            left: dropdownLeft,
            width: Math.max(dropdownWidth, 100),
            backgroundColor: background,
            borderRadius: 8,
            shadowColor: "#000",
            shadowOffset: {
              width: 0,
              height: 2,
            },
            shadowOpacity: 0.25,
            shadowRadius: 3.84,
            elevation: 5,
            maxHeight: 200,
            zIndex: 9999,
          }}
        >
          <FlatList
            data={options}
            keyExtractor={(item) => item.value}
            renderItem={({ item, index }) => (
              <TouchableOpacity
                style={{
                  paddingHorizontal: 12,
                  paddingVertical: 12,
                  borderBottomWidth: index < options.length - 1 ? 1 : 0,
                  borderBottomColor: grey5,
                }}
                onPress={() => handleSelect(item.value)}
              >
                <Text
                  style={{
                    color: item.value === value ? primary : white,
                    fontSize: 14,
                    fontWeight: item.value === value ? "600" : "400",
                  }}
                >
                  {item.label}
                </Text>
              </TouchableOpacity>
            )}
            nestedScrollEnabled={true}
          />
        </View>
      )}

      {/* 背景遮罩，点击关闭下拉框 */}
      {isOpen && (
        <Pressable
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            width: Dimensions.get("window").width,
            height: Dimensions.get("window").height,
            zIndex: 9998,
          }}
          onPress={() => setIsOpen(false)}
        />
      )}
    </>
  );
};

export default Select;
