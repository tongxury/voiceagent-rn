import {ReactNode} from "react";

import {DarkTheme, ThemeProvider} from "@react-navigation/native";

const AppThemeProvider = ({children}: { children: ReactNode }) => {

    return (
        <ThemeProvider value={DarkTheme}>
            {children}
        </ThemeProvider>
    );
};

export default AppThemeProvider;
