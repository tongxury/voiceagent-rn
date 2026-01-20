import React from 'react';
import {View, ScrollView, ViewStyle, TextStyle} from 'react-native';

export interface GridProps<T = any> {
    data: T[];
    columns?: number;
    spacing?: number;
    horizontalSpacing?: number;
    verticalSpacing?: number;
    renderItem: (item: T, index: number) => React.ReactNode;
    keyExtractor?: (item: T, index: number) => string;
    containerStyle?: ViewStyle;
    itemStyle?: ViewStyle;
    scrollable?: boolean;
    fillEmptyItems?: boolean;
    emptyItemComponent?: React.ReactNode;
    responsive?: {
        small?: number;  // 小屏幕列数
        medium?: number; // 中等屏幕列数
        large?: number;  // 大屏幕列数
    };
}

interface GridItemProps {
    children: React.ReactNode;
    columns: number;
    spacing?: number;
    horizontalSpacing?: number;
    verticalSpacing?: number;
    itemStyle?: ViewStyle;
}

// 栅格项组件
const GridItem: React.FC<GridItemProps> = ({
                                               children,
                                               columns,
                                               spacing = 0,
                                               horizontalSpacing,
                                               verticalSpacing,
                                               itemStyle,
                                           }) => {
    const hSpacing = horizontalSpacing ?? spacing;
    const vSpacing = verticalSpacing ?? spacing;

    const itemStyles: ViewStyle = {
        width: `${100 / columns}%`,
        paddingHorizontal: hSpacing / 2,
        paddingVertical: vSpacing / 2,
        ...itemStyle,
    };

    return <View style={itemStyles}>{children}</View>;
};

// 主栅格组件
export const Grid = <T, >({
                              data,
                              columns = 2,
                              spacing = 0,
                              horizontalSpacing,
                              verticalSpacing,
                              renderItem,
                              keyExtractor,
                              containerStyle,
                              itemStyle,
                              scrollable = true,
                              fillEmptyItems = false,
                              emptyItemComponent,
                              responsive,
                          }: GridProps<T>) => {

    // 响应式列数计算
    const getResponsiveColumns = (): number => {
        if (!responsive) return columns;

        // 这里可以根据屏幕尺寸返回不同的列数
        // 实际项目中可以使用 useWindowDimensions 或 Dimensions
        return responsive.medium || columns;
    };

    const finalColumns = getResponsiveColumns();
    const hSpacing = horizontalSpacing ?? spacing;
    const vSpacing = verticalSpacing ?? spacing;

    // 数据分组
    const chunkData = (array: T[], size: number): T[][] => {
        const chunks: T[][] = [];
        for (let i = 0; i < array.length; i += size) {
            chunks.push(array.slice(i, i + size));
        }
        return chunks;
    };

    const rows = chunkData(data, finalColumns);

    // 容器样式
    const containerStyles: ViewStyle = {
        marginHorizontal: -hSpacing / 2,
        marginVertical: -vSpacing / 2,
        ...containerStyle,
    };

    const renderRow = (row: T[], rowIndex: number) => (
        <View key={rowIndex} className="flex-row">
            {row.map((item, itemIndex) => {
                const globalIndex = rowIndex * finalColumns + itemIndex;
                return (
                    <GridItem
                        key={keyExtractor ? keyExtractor(item, globalIndex) : globalIndex}
                        columns={finalColumns}
                        spacing={spacing}
                        horizontalSpacing={horizontalSpacing}
                        verticalSpacing={verticalSpacing}
                        itemStyle={itemStyle}
                    >
                        {renderItem(item, globalIndex)}
                    </GridItem>
                );
            })}

            {/* 填充空白项 */}
            {fillEmptyItems && row.length < finalColumns &&
                Array.from({length: finalColumns - row.length}).map((_, index) => (
                    <GridItem
                        key={`empty-${rowIndex}-${index}`}
                        columns={finalColumns}
                        spacing={spacing}
                        horizontalSpacing={horizontalSpacing}
                        verticalSpacing={verticalSpacing}
                        itemStyle={itemStyle}
                    >
                        {emptyItemComponent || <View/>}
                    </GridItem>
                ))
            }
        </View>
    );

    const content = (
        <View style={containerStyles}>
            {rows.map(renderRow)}
        </View>
    );

    return scrollable ? (
        <ScrollView showsVerticalScrollIndicator={false}>
            {content}
        </ScrollView>
    ) : (
        content
    );
};
