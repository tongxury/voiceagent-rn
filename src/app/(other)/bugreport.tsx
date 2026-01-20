import React, {useState} from "react";
import {ScrollView} from "react-native";
import Picker from "@/components/Picker";
import {Resource} from "@/types";
import ScreenContainer from "@/shared/components/ScreenContainer";
import { useTranslation } from "@/i18n/translation";

export default function BugReportScreen() {
    const { t } = useTranslation();
    const [files, setFiles] = useState<Resource[]>([])

    return (
        <ScreenContainer edges={['top']} stackScreenProps={{ headerShown: true, title: t('common.bugReportTitle') }}>
            <ScrollView className="flex-1 bg-background">
                <Picker
                    selectFilesTitle={t('common.uploadScreenshot')}
                    files={files}
                    maxFiles={1}
                    onChange={files => {
                        setFiles(files);
                    }}
                    allowedTypes={['image']}/>
            </ScrollView>
        </ScreenContainer>
    );
}

