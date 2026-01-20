import React from 'react';
import Svg, {Circle, Path, Rect} from 'react-native-svg';

interface IconProps {
    size?: number;
    color?: string;
    strokeWidth?: number;
}

// 1. 账号诊断
export const AccountDiagnosisIcon: React.FC<IconProps> = ({
                                                              size = 24,
                                                              color = '#000',
                                                              strokeWidth = 2
                                                          }) => (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
        <Circle cx="12" cy="8" r="4" stroke={color} strokeWidth={strokeWidth}/>
        <Path d="M16 14h2a2 2 0 0 1 2 2v4a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2v-4a2 2 0 0 1 2-2h2"
              stroke={color} strokeWidth={strokeWidth}/>
        <Path d="M12 14v8" stroke={color} strokeWidth={strokeWidth}/>
        <Path d="M10 18h4" stroke={color} strokeWidth={strokeWidth}/>
    </Svg>
);

// 2. 脚本生成
export const ScriptGenerationIcon: React.FC<IconProps> = ({
                                                              size = 24,
                                                              color = '#000',
                                                              strokeWidth = 2
                                                          }) => (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
        <Rect x="3" y="3" width="18" height="18" rx="2" stroke={color} strokeWidth={strokeWidth}/>
        <Path d="M8 9l3 3-3 3" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round"/>
        <Path d="M13 15h3" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round"/>
    </Svg>
);

// 3. 脚本优化
export const ScriptOptimizationIcon: React.FC<IconProps> = ({
                                                                size = 24,
                                                                color = '#000',
                                                                strokeWidth = 2
                                                            }) => (
    <Svg width={size} height={size} viewBox="0 0 1024 1024" fill="none">
        <Path
            d="M768.608 450.56l-271.168-273.472L160 517.344v273.184h271.424L768.64 450.56z m-271.2-182.592l181.024 182.56-273.696 276H224v-182.816l273.408-275.744zM588.064 96l269.504 271.808-45.44 45.056-269.504-271.808zM799.776 886.528v64H160v-64z"
            fill={color}
            stroke="none"
        />
    </Svg>
);
// 4. 文案生成
export const ContentGenerationIcon: React.FC<IconProps> = ({
                                                               size = 24,
                                                               color = '#000',
                                                               strokeWidth = 2
                                                           }) => (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
        <Rect x="4" y="2" width="16" height="20" rx="2" stroke={color} strokeWidth={strokeWidth}/>
        <Path d="M8 6h8" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round"/>
        <Path d="M8 10h8" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round"/>
        <Path d="M8 14h5" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round"/>
        <Path d="M15 14l2 2-2 2" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round"/>
    </Svg>
);

// 5. 封面预测
export const CoverPredictionIcon: React.FC<IconProps> = ({
                                                             size = 24,
                                                             color = '#000',
                                                             strokeWidth = 2
                                                         }) => (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
        <Rect x="3" y="3" width="18" height="18" rx="2" stroke={color} strokeWidth={strokeWidth}/>
        <Circle cx="8.5" cy="8.5" r="1.5" stroke={color} strokeWidth={strokeWidth}/>
        <Path d="M21 15l-5-5L5 21" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round"
              strokeLinejoin="round"/>
        {/*<Path d="M12 2v4" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" />*/}
        {/*<Path d="M10 4h4" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" />*/}
    </Svg>
);

// 6. 爆款分析
export const TrendAnalysisIcon: React.FC<IconProps> = ({
                                                           size = 24,
                                                           color = '#000',
                                                           strokeWidth = 2
                                                       }) => (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
        {/* 主火焰外形 */}
        <Path
            d="M12 23c3.5 0 7.5-3 7.5-7.5 0-0.9-0.2-1.7-0.5-2.5-1.7 1.6-2.9 2.5-3.8 2.5 4-7 1.8-10-4.2-14 0.5 5-2.8 7.3-4.1 8.5A7.5 7.5 0 0 0 12 23z"
            stroke={color}
            strokeWidth={strokeWidth}
            strokeLinecap="round"
            strokeLinejoin="round"
        />

        {/*/!* 内部火焰细节 *!/*/}
        {/*<Path*/}
        {/*    d="M12.7 5.2c3.2 2.7 3.3 4.9 0.8 9.3-0.8 1.3 0.2 3 1.7 3 0.7 0 1.4-0.2 2.1-0.6a5.5 5.5 0 1 1-9.1-5.4c0.1-0.1 0.8-0.7 0.8-0.7 0.4-0.4 0.8-0.7 1.1-1.1 1.2-1.3 2.1-2.8 2.6-4.5z"*/}
        {/*    stroke={color}*/}
        {/*    strokeWidth={strokeWidth}*/}
        {/*    strokeLinecap="round"*/}
        {/*    strokeLinejoin="round"*/}
        {/*/>*/}
    </Svg>
);
// 7. 脚本复刻
export const ScriptCloneIcon: React.FC<IconProps> = ({
                                                         size = 24,
                                                         color = '#000',
                                                         strokeWidth = 2
                                                     }) => (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
        <Rect x="9" y="9" width="13" height="13" rx="2" stroke={color} strokeWidth={strokeWidth}/>
        <Path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"
              stroke={color} strokeWidth={strokeWidth}/>
        <Path d="M13 13l2 2-2 2" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round"/>
        <Path d="M17 15h2" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round"/>
    </Svg>
);

// 8. 爆款预测
export const TrendPredictionIcon: React.FC<IconProps> = ({
                                                             size = 24,
                                                             color = '#000',
                                                             strokeWidth = 2
                                                         }) => (
    <Svg width={size} height={size} viewBox="0 0 1084 1024" fill="none">
        <Path
            d="M931.113133 997.907315l-63.685937-62.882134a82.791718 82.791718 0 0 1-24.299586-51.257905 483.703967 483.703967 0 0 1-172.446678 86.254255 478.695656 478.695656 0 0 1-131.947369 18.549302 492.916787 492.916787 0 0 1-412.165492-221.725991 45.198466 45.198466 0 0 1 75.371998-49.464805 403.941968 403.941968 0 1 0 478.571993-601.492036A404.869433 404.869433 0 0 0 222.591625 242.394242a44.580156 44.580156 0 0 1-62.882134 7.234227 43.714522 43.714522 0 0 1-17.065358-29.926207 43.281705 43.281705 0 0 1 9.954792-32.894096A493.967914 493.967914 0 0 1 1032.515985 515.316306a499.285381 499.285381 0 0 1-93.30299 266.800795 81.307774 81.307774 0 0 1 55.647906 25.103389l62.820303 63.624106a89.593129 89.593129 0 0 1 0 126.691733 89.840453 89.840453 0 0 1-126.629902 0z m-571.998645-315.956445a68.446925 68.446925 0 0 1-61.089035-45.754945l-42.230577-127.557368-32.213955 48.47551a66.282839 66.282839 0 0 1-55.647906 29.617052H45.012973a44.889311 44.889311 0 1 1 0-89.778622h110.368347l51.257905-76.299463a66.653825 66.653825 0 0 1 64.613402-29.617052 68.014108 68.014108 0 0 1 55.647907 45.878607l38.520717 115.685814L478.695656 297.671162a67.148474 67.148474 0 0 1 121.188773-2.720565l101.526514 202.063731h61.831006a44.889311 44.889311 0 1 1 0 89.778622h-76.361293a68.385094 68.385094 0 0 1-60.099739-36.789449L541.57779 377.618654l-117.478914 263.956568a66.839318 66.839318 0 0 1-61.831006 40.437479z"
            fill={color}
            stroke="none"
        />
    </Svg>
);
// 9. 限流预测
export const TrafficLimitIcon: React.FC<IconProps> = ({
                                                          size = 24,
                                                          color = '#000',
                                                          strokeWidth = 2
                                                      }) => (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
        <Rect x="3" y="11" width="18" height="10" rx="2" stroke={color} strokeWidth={strokeWidth}/>
        <Circle cx="12" cy="16" r="1" fill={color}/>
        <Path d="M7 11V7a5 5 0 0 1 10 0v4" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round"
              strokeLinejoin="round"/>
        {/*<Path d="M9 3l6 6" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" />*/}
        {/*<Path d="M15 3l-6 6" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" />*/}
    </Svg>
);

// 10. 文案提取
export const ContentExtractionIcon: React.FC<IconProps> = ({
                                                               size = 24,
                                                               color = '#000'
                                                           }) => (
    <Svg width={size} height={size} viewBox="0 0 1024 1024" fill={color}>
        <Path
            d="M192 682.666667v106.666666a42.666667 42.666667 0 0 0 39.466667 42.56L234.666667 832h106.666666v85.333333h-106.666666a128 128 0 0 1-128-128v-106.666666h85.333333z m725.333333 0v106.666666a128 128 0 0 1-128 128h-106.666666v-85.333333h106.666666a42.666667 42.666667 0 0 0 42.56-39.466667L832 789.333333v-106.666666h85.333333zM512 256a42.666667 42.666667 0 0 1 38.912 25.173333l192 426.666667a42.666667 42.666667 0 1 1-77.824 34.986667L609.194667 618.666667h-194.410667l-55.893333 124.16a42.666667 42.666667 0 1 1-77.802667-34.986667l192-426.666667A42.666667 42.666667 0 0 1 512 256z m0 146.645333L453.184 533.333333h117.632L512 402.645333zM341.333333 106.666667v85.333333h-106.666666a42.666667 42.666667 0 0 0-42.56 39.466667L192 234.666667v106.666666H106.666667v-106.666666a128 128 0 0 1 128-128h106.666666z m448 0a128 128 0 0 1 128 128v106.666666h-85.333333v-106.666666a42.666667 42.666667 0 0 0-39.466667-42.56L789.333333 192h-106.666666V106.666667h106.666666z"
            fill={color}
        />
    </Svg>
);


export const FlashIcon: React.FC<IconProps> = ({
                                                          size = 24,
                                                          color = '#000',
                                                          strokeWidth = 2
                                                      }) => (
    <Svg width={size} height={size} viewBox="0 0 1024 1024" fill="none">
        <Path
            d="M474.026667 981.333333a42.666667 42.666667 0 0 1-14.506667-2.56 42.666667 42.666667 0 0 1-27.733333-44.8l32.853333-302.506666H213.333333a42.666667 42.666667 0 0 1-35.413333-66.56l336.64-503.466667a42.666667 42.666667 0 0 1 49.92-16.213333 42.666667 42.666667 0 0 1 27.733333 42.666666l-32.853333 304.64H810.666667a42.666667 42.666667 0 0 1 35.413333 66.56l-336.64 503.466667a42.666667 42.666667 0 0 1-35.413333 18.773333z"
            fill={color}
        />
    </Svg>
);
