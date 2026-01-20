import {PromptConfig, Scene} from "@/types";


export const localPrompts: PromptConfig[] = [
    // 预测
    {
        "promptId": "preAnalysis",
        "cost": 40
    },
    {
        "promptId": "preAnalysisImages",
        "cost": 20
    },
    // 限流
    {
        "promptId": "limitAnalysis",
        "cost": 40
    },
    {
        "promptId": "limitAnalysisImages",
        "cost": 20
    },
    // 封面
    {
        "promptId": "coverAnalysisImages",
        "maxFiles": 3,
        "cost": 30
    },
    // 爆款
    {
        "promptId": "analysis",
        "cost": 40
    },
    {
        "promptId": "analysisImages",
        "cost": 20
    },
    // 脚本复刻
    {
        "promptId": "duplicateScript",
        "cost": 40
    },
    {
        "promptId": "duplicateScriptImages",
        "cost": 20
    },
    // 脚本优化
    {
        "promptId": "scriptOptimization",
        "cost": 20
    },
    // 文本提前
    {
        "promptId": "contentExtraction",
        "cost": 20
    },
    // 文本生成
    {
        "promptId": "contentGeneration",
        "cost": 20
    },
    // 账号诊断
    {
        "promptId": "accountAnalysis",
        "cost": 0
    }
]
