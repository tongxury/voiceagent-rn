import { Scene } from "@/types";
import {
    AccountDiagnosisIcon, ContentExtractionIcon,
    ContentGenerationIcon,
    CoverPredictionIcon,
    ScriptCloneIcon,
    ScriptOptimizationIcon,
    TrafficLimitIcon,
    TrendAnalysisIcon,
    TrendPredictionIcon
} from './scene_icons';

export const localScenes: { [key: string]: Scene } =
    {
        noteGeneration: {
            value: "noteGeneration",
            tag: {
                value: 'new',
                color: '#029415'
            },
            getSceneIcon: ({size, color}) => <ContentGenerationIcon size={size} color={color}/>
        },

        analysis: {
            value: "analysis",
            getSceneIcon: ({size, color}) => <TrendAnalysisIcon size={size} color={color}/>
        },

        limitAnalysis: {
            value: "limitAnalysis",
            getSceneIcon: ({size, color}) => <TrafficLimitIcon size={size} color={color}/>
        },
        coverAnalysis: {
            value: "coverAnalysis",
            getSceneIcon: ({size, color}) => <CoverPredictionIcon size={size} color={color}/>
        },
        preAnalysis: {
            value: "preAnalysis",
            getSceneIcon: ({size, color}) => <TrendPredictionIcon size={size} color={color}/>
        },
        duplicateScript: {
            value: "duplicateScript",
            getSceneIcon: ({size, color}) => <ScriptCloneIcon size={size} color={color}/>

        },
        // scriptGeneration: {
        //     value: "scriptGeneration",
        //     tag: {
        //         value: 'new',
        //         color: '#029415'
        //     },
        //     getSceneIcon: ({size, color}) => <ScriptGenerationIcon size={size} color={color}/>
        // },
        scriptOptimization: {
            value: "scriptOptimization",
           
            getSceneIcon: ({size, color}) => <ScriptOptimizationIcon size={size} color={color}/>
        },
        contentExtraction: {
            value: "contentExtraction",
            getSceneIcon: ({size, color}) => <ContentExtractionIcon size={size} color={color}/>
        },
        // contentGeneration: {
        //     value: "contentGeneration",
        //     tag: {
        //         value: 'new',
        //         color: '#029415'
        //     },
        //     getSceneIcon: ({size, color}) => <ContentGenerationIcon size={size} color={color}/>
        // },

        accountAnalysis: {
            value: "accountAnalysis",
            isPopular: true,
            getSceneIcon: ({size, color}) => <AccountDiagnosisIcon size={size} color={color}/>,
            hideInHome: true,
            tag: {
                value: 'free',
                color: '#f1661b'
            },
        },
    }
