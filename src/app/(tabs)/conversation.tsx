import React from "react";
import ScreenContainer from "@/shared/components/ScreenContainer";
import HistoryListScreen from "../conversation/list";

const Screen = () => {
    return  <ScreenContainer edges={['top']}>
        <HistoryListScreen />
    </ScreenContainer>
}

export default Screen;