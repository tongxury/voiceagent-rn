import {useTranslation} from "@/i18n/translation";


const usePricing = () => {

    const {t} = useTranslation()


    const plans = [
        {
            "id": "l1-monthly",
            "iosAlias": "veogo_l1_monthly",
            "title": "500积分连续包月",
            "amount": 38,
            "cnyAmount": 38,
            "months": 1,
            "creditPerMonth": 500,
            "mode": "recurring",
            "features": [
                {
                    "name": "coverAnalysisImages",
                    "value": 16
                },
                {
                    "name": "analysisImages",
                    "value": 25
                },
                {
                    "name": "preAnalysisImages",
                    "value": 25
                },
                {
                    "name": "limitAnalysisImages",
                    "value": 25
                },
                {
                    "name": "analysis",
                    "value": 12
                },
                {
                    "name": "limitAnalysis",
                    "value": 12
                },
                {
                    "name": "preAnalysis",
                    "value": 6
                },
                {
                    "name": "duplicateScript",
                    "value": 6
                }
            ]
        },
        {
            "id": "l2-monthly",
            "iosAlias": "veogo_l2_monthly",
            "title": "1500积分连续包月",
            "amount": 98,
            "cnyAmount": 98,
            "months": 1,
            "creditPerMonth": 1500,
            "tag": "popular",
            "mode": "recurring",
            "features": [
                {
                    "name": "coverAnalysisImages",
                    "value": 50
                },
                {
                    "name": "analysisImages",
                    "value": 75
                },
                {
                    "name": "preAnalysisImages",
                    "value": 75
                },
                {
                    "name": "limitAnalysisImages",
                    "value": 75
                },
                {
                    "name": "analysis",
                    "value": 37
                },
                {
                    "name": "limitAnalysis",
                    "value": 37
                },
                {
                    "name": "preAnalysis",
                    "value": 18
                },
                {
                    "name": "duplicateScript",
                    "value": 18
                }
            ]
        },
        {
            "id": "l3-monthly",
            "iosAlias": "veogo_l3_monthly",
            "title": "7000积分连续包月",
            "amount": 399,
            "cnyAmount": 399,
            "months": 1,
            "creditPerMonth": 7000,
            "mode": "recurring",
            "features": [
                {
                    "name": "coverAnalysisImages",
                    "value": 233
                },
                {
                    "name": "analysisImages",
                    "value": 350
                },
                {
                    "name": "preAnalysisImages",
                    "value": 350
                },
                {
                    "name": "limitAnalysisImages",
                    "value": 350
                },
                {
                    "name": "analysis",
                    "value": 175
                },
                {
                    "name": "limitAnalysis",
                    "value": 175
                },
                {
                    "name": "preAnalysis",
                    "value": 87
                },
                {
                    "name": "duplicateScript",
                    "value": 87
                }
            ],
            "extra": "赠送: 自媒体起号操作分享(价值198元)"
        },
        {
            "id": "l4-monthly",
            "iosAlias": "veogo_l4_monthly",
            "title": "20000积分连续包月",
            "amount": 999,
            "cnyAmount": 999,
            "months": 1,
            "creditPerMonth": 20000,
            "tag": 'costEfficient',
            "mode": "recurring",
            "features": [
                {
                    "name": "coverAnalysisImages",
                    "value": 666
                },
                {
                    "name": "analysisImages",
                    "value": 1000
                },
                {
                    "name": "preAnalysisImages",
                    "value": 1000
                },
                {
                    "name": "limitAnalysisImages",
                    "value": 1000
                },
                {
                    "name": "analysis",
                    "value": 500
                },
                {
                    "name": "limitAnalysis",
                    "value": 500
                },
                {
                    "name": "preAnalysis",
                    "value": 250
                },
                {
                    "name": "duplicateScript",
                    "value": 250
                }
            ],
            "extra": "赠送: 1v1账号深度分析咨询60分钟(价值800元)"
        },
    ]

    const packages = [
        {
            "id": "l1-pkg",
            "iosAlias": "com_veogo_l1_pkg",
            "title": t(`payment.planTitle`, {quota: 500, days: 30}),
            "amount": 38,
            "cnyAmount": 38,
            "months": 1,
            "creditPerMonth": 500,
            "mode": "oneOff",
            "features": [
                {
                    "name": "coverAnalysisImages",
                    "value": 16
                },
                {
                    "name": "analysisImages",
                    "value": 25
                },
                {
                    "name": "preAnalysisImages",
                    "value": 25
                },
                {
                    "name": "limitAnalysisImages",
                    "value": 25
                },
                {
                    "name": "analysis",
                    "value": 12
                },
                {
                    "name": "limitAnalysis",
                    "value": 12
                },
                {
                    "name": "preAnalysis",
                    "value": 6
                },
                {
                    "name": "duplicateScript",
                    "value": 6
                }
            ]
        },
        {
            "id": "l2-pkg",
            "iosAlias": "com_veogo_l2_pkg",
            "title": t(`payment.planTitle`, {quota: 1500, days: 30}),
            "amount": 98,
            "cnyAmount": 98,
            "months": 1,
            "tag": "popular",
            "creditPerMonth": 1500,
            "mode": "oneOff",
            "features": [
                {
                    "name": "coverAnalysisImages",
                    "value": 50
                },
                {
                    "name": "analysisImages",
                    "value": 75
                },
                {
                    "name": "preAnalysisImages",
                    "value": 75
                },
                {
                    "name": "limitAnalysisImages",
                    "value": 75
                },
                {
                    "name": "analysis",
                    "value": 37
                },
                {
                    "name": "limitAnalysis",
                    "value": 37
                },
                {
                    "name": "preAnalysis",
                    "value": 18
                },
                {
                    "name": "duplicateScript",
                    "value": 18
                }
            ]
        },
        {
            "id": "l3-pkg",
            "iosAlias": "com_veogo_l3_pkg",
            "title": t(`payment.planTitle`, {quota: 7000, days: 30}),
            "amount": 399,
            "cnyAmount": 399,
            "months": 1,
            "creditPerMonth": 7000,
            "mode": "oneOff",
            "features": [
                {
                    "name": "coverAnalysisImages",
                    "value": 233
                },
                {
                    "name": "analysisImages",
                    "value": 350
                },
                {
                    "name": "preAnalysisImages",
                    "value": 350
                },
                {
                    "name": "limitAnalysisImages",
                    "value": 350
                },
                {
                    "name": "analysis",
                    "value": 175
                },
                {
                    "name": "limitAnalysis",
                    "value": 175
                },
                {
                    "name": "preAnalysis",
                    "value": 87
                },
                {
                    "name": "duplicateScript",
                    "value": 87
                }
            ],
            "extra": "赠送: 自媒体起号操作分享(价值198元)"
        },
        {
            "id": "l4-pkg",
            "iosAlias": "com_veogo_l4_pkg",
            "title": t(`payment.planTitle`, {quota: 20000, days: 30}),
            "amount": 999,
            "cnyAmount": 999,
            "tag": 'costEfficient',
            "months": 1,
            "creditPerMonth": 20000,
            "mode": "oneOff",
            "features": [
                {
                    "name": "coverAnalysisImages",
                    "value": 666
                },
                {
                    "name": "analysisImages",
                    "value": 1000
                },
                {
                    "name": "preAnalysisImages",
                    "value": 1000
                },
                {
                    "name": "limitAnalysisImages",
                    "value": 1000
                },
                {
                    "name": "analysis",
                    "value": 500
                },
                {
                    "name": "limitAnalysis",
                    "value": 500
                },
                {
                    "name": "preAnalysis",
                    "value": 250
                },
                {
                    "name": "duplicateScript",
                    "value": 250
                }
            ],
            "extra": "赠送: 1v1账号深度分析咨询60分钟(价值800元)"
        }
    ]

    return {
        plans, packages
    }
}

export default usePricing
