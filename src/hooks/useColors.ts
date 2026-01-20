import useTailwindVars from './useTailwindVars';

export const useColors = () => {
    const { colors } = useTailwindVars();
    return colors;
};

export const useThemeColors = () => {
    const { colors } = useTailwindVars();
    return { colors };
};

export default useColors;
