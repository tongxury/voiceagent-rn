import React from 'react';
import { ScrollView, Text } from 'react-native';
import ScreenContainer from "@/shared/components/ScreenContainer";
import { useTranslation } from "@/i18n/translation";

// AURA 付费服务协议（含自动续费服务规则）
// 使用 NativeWind (Tailwind CSS for React Native) 进行样式设置

export default function SubTerms() {
    const { t } = useTranslation();
    return (
        <ScreenContainer edges={['top']} stackScreenProps={{ headerShown: true, title: t('common.termsOfServiceTitle') }}>
            <ScrollView contentContainerClassName="px-4 py-6">
                <Text className="text-white text-xl font-bold text-center mb-1">
                    AURA 付费服务协议
                </Text>
                <Text className="text-white text-base text-center mb-6">
                    （含自动续费服务规则）
                </Text>

                <Text className="text-white text-base font-bold mt-4 mb-2">
                    【版本更新提示】
                </Text>
                <Text className="text-white text-sm leading-relaxed mb-3">
                    公司对《AURA 付费服务协议》进行了更新，本次更新重点内容提示如下：
                </Text>
                <Text className="text-white text-sm leading-relaxed mb-3">
                    （1）明确一般会员权益包括每月赠送积分；
                </Text>
                <Text className="text-white text-sm leading-relaxed mb-3">
                    （2）明确用户可在苹果设备客户端的“游客模式”下购买AURA付费服务；
                </Text>
                <Text className="text-white text-sm leading-relaxed mb-3">
                    （3）在原协议的基础上对部分协议措辞进行了调整和优化，例如完善“积分”定义、付费标准、知识产权条款等，使协议表述更清晰、准确，便于用户理解。
                </Text>
                <Text className="text-white text-sm leading-relaxed mb-3">更新日期：2025年7月23日</Text>
                <Text className="text-white text-sm leading-relaxed mb-3">生效日期：2025年7月30日</Text>
                <Text className="text-white text-sm leading-relaxed mb-3">
                    欢迎您使用AURA付费服务，请您仔细阅读、理解并遵守如下协议。
                </Text>

                <Text className="text-white text-lg font-bold mt-5 mb-3">一、导言</Text>
                <Text className="text-white text-sm leading-relaxed mb-3">
                    1.1 AURA付费服务（以下简称“本服务”或“付费服务”）由 AURA Team
                    及/或其关联方（以下简称“公司”或“我们”）为您（或称“用户”）提供，就您使用AURA付费服务相关事宜与您达成《AURA付费服务协议》，简称为“本协议”，本协议含附录《自动续费服务规则》。
                </Text>
                <Text className="text-white text-sm leading-relaxed mb-3">
                    1.2
                    您在购买、使用任一付费服务前，请务必审慎阅读、充分理解本协议，尤其是您拟开通或购买的具体付费服务的对应规则条款和特别提示，以及我们通过
                    <Text className="font-bold">
                        黑体加粗等合理方式提示您注意的条款（包括但不限于付费与退费条款、免除或限制责任条款、法律适用和争议解决条款等）
                    </Text>
                    。
                </Text>
                <Text className="text-white text-sm leading-relaxed mb-3">
                    1.3
                    如果您不同意本协议的任一或全部条款内容，请不要以确认形式（包括但不限于勾选同意本协议、点击立即开通或购买、支付行为等）进行下一步操作或使用相应付费服务。当您以确认形式进行下一步操作或使用相应付费服务，即表示您已阅读并同意签署本协议所有内容，本协议即在您与我们之间产生法律效力，成为对双方均具有约束力的法律文件。
                </Text>
                <Text className="text-white text-sm leading-relaxed mb-3">
                    1.4
                    如果您是中国大陆地区以外的用户，您订立或履行本协议还需要同时遵守您所属和/或所处国家或地区的法律
                    。
                </Text>
                <Text className="text-white text-sm leading-relaxed mb-3">
                    1.5
                    您需确认，您使用任一付费服务，应当具备中华人民共和国法律法规规定的与您行为相适应的民事行为能力。如果您不具备前述与您行为相适应的民事行为能力，则应获得您监护人的知情同意，您及您的监护人应依照法律规定承担因此而导致的相应的责任。特别地，如果您是未成年人，请在您监护人指导和陪同下阅读并判断是否同意本协议及其他相关协议，并特别注意未成年人使用相关约定。
                    若您不具备完全民事行为能力，在使用本服务前，应事先取得您的监护人的同意。
                </Text>

                <Text className="text-white text-lg font-bold mt-5 mb-3">二、本协议适用范围及说明</Text>
                <Text className="text-white text-sm leading-relaxed mb-3">
                    2.1 本协议适用于您在使用AURA过程中需以付费方式开通的各项服务，目前本协议覆盖系列会员服务、积分服务，您开通及使用以上任一项付费服务，均适用本协议。请您了解，以上所列各项付费服务属于不同的付费产品功能，您开通其中任一付费服务并不意味着您当然的可以同时获得其他单项付费服务的使用资格，请您根据实际需求前往对应的产品功能页面开通对应的付费服务。
                </Text>
                <Text className="text-white text-sm leading-relaxed mb-3">
                    2.2 请您了解，您在开通或使用付费服务时，本协议为《AURA用户服务协议》《AURA隐私政策》的补充协议，是其不可分割的组成部分，与其构成统一整体。本协议与上述内容存在冲突或不一致的，以本协议为准。
                </Text>

                <Text className="text-white text-lg font-bold mt-5 mb-3">三、名词定义</Text>
                <Text className="text-white text-sm leading-relaxed mb-3">
                    3.1 “AURA”/“平台”：指公司合法拥有并运营的、标注名称为“AURA”的客户端应用程序、官方网站（aura.ai）以及供第三方网站和应用程序使用的软件开发工具包（SDK）和应用程序编程接口（API）。公司有权根据业务发展、安排随时调整向您提供的具体AURA平台版本，请以您实际使用的版本为准。
                </Text>
                <Text className="text-white text-sm leading-relaxed mb-3">
                    3.2 “用户”：指登录、注册、使用AURA并拟开通或购买付费服务的AURA付费用户；在本协议中，该“用户”即指“您”。
                </Text>
                <Text className="text-white text-sm leading-relaxed mb-3">
                    3.3 “用户账号”：指用户用于开通付费服务的AURA账号。
                </Text>
                <Text className="text-white text-sm leading-relaxed mb-3">
                    3.4 “会员账号”：指与您的会员服务绑定的用户账号。
                </Text>
                <Text className="text-white text-sm leading-relaxed mb-3">
                    3.5 “普通账号”：指并非会员账号的AURA用户账号。
                </Text>
                <Text className="text-white text-sm leading-relaxed mb-3">
                    3.6 “积分”：指公司依据相关平台规则向用户提供的用于在AURA平台进行相关消费（如兑换特定AURA平台功能）的虚拟工具。兑换AURA平台内具体功能、模型和服务所需要的积分数可能不同，以届时AURA平台相关产品、服务页面的提示说明为准。您可在登录AURA后通过以下路径查阅积分余额及相关积分获取规则：AURA移动端【我的】-【会员中心】-【我的积分】；AURA网站【积分/会员】-【积分详情】。
                </Text>
                <Text className="text-white text-sm leading-relaxed mb-3">
                    3.7 “服务费”：指用户为开通付费服务所实际支付的费用，以相关付费服务产品页面公示为准。
                </Text>
                <Text className="text-white text-sm leading-relaxed mb-3">
                    3.8 “使用期限”：指用户开通某项付费服务后能够获得的使用该服务及相关权益的有效期限。
                </Text>
                <Text className="text-white text-sm leading-relaxed mb-3">
                    3.9 “平台规则”：指本协议、《AURA用户服务协议》《AURA隐私政策》，及公司已经或在未来不时发布的AURA相关服务、某一/多项付费服务的协议、规则、公告、附加条款、产品要求、购买须知、站内信通知等协议和内容的统称。
                </Text>

                <Text className="text-white text-lg font-bold mt-5 mb-3">四、付费服务说明及规则</Text>
                <Text className="text-white text-base font-bold mt-4 mb-2">4.1 系列会员服务</Text>
                <Text className="text-white text-sm leading-relaxed mb-3">AURA会员类别包括：基础会员、标准会员和高级会员（合称为“会员”），该三类会员在权益及服务方面存在差异，请您根据需求选择开通相关会员服务。公司有权根据实际需要不时调整会员类别、名称、权益等，并将以适当的方式通知您。</Text>

                <Text className="text-white text-base font-semibold mt-3 mb-2">4.1.1 用户权益</Text>
                <Text className="text-white text-sm leading-relaxed mb-3">
                    （1）您开通系列会员服务后，将获得一些一般会员权益，例如：每月赠送积分（具体积分数量随会员权益档位的不同有所差异，以会员购买页面展示为准）、生成作品去除品牌水印、其他为提升会员用户体验不时更新的一般会员权益（订阅系列会员所能享受的具体用户权益以产品页面及服务权益实际展示为准）。
                </Text>
                <Text className="text-white text-sm leading-relaxed mb-3">
                    （2）在您的系列会员服务使用期限内，您可使用积分进一步兑换特定特殊会员权益（具体权益随平台提供的功能、模型和服务不同存在差异），例如：数字人-大师模式、其他您需在系列会员服务使用期限内使用积分方可兑换的系列会员特殊权益（订阅系列会员所能享受的具体用户权益以产品页面及服务权益实际展示为准）。
                </Text>
                <Text className="text-white text-sm leading-relaxed mb-3">
                    前述需要您在系列会员服务使用期限内使用积分兑换的特殊权益，我们会在产品页面以显著标注的形式向您提示。请您仔细阅读相关提示，并自主决定是否进行购买和消耗积分。如您自主选择不使用系列会员特殊权益，不会影响您在系列会员服务使用期限内获得的系列会员一般权益。
                </Text>

                <Text className="text-white text-base font-semibold mt-3 mb-2">4.1.2 使用规则</Text>
                <Text className="text-white text-sm leading-relaxed mb-3">
                    （1）您按照实际产品购买页面完成相应操作步骤，并确认成功支付服务费后即可开通相应会员服务并获得对应用户权益、成为“会员用户”。请注意，您所获得的各类会员用户权益使用期限及所包含的权益范围以您购买时自行选择的会员类别及其会员套餐内对应权益及相关产品页面公示为准。
                </Text>
                <Text className="text-white text-sm leading-relaxed mb-3">
                    （2）请您了解，您所订阅的任一会员服务需要您登录您的会员账号方可使用。会员账号的管理及安全请您参照《AURA用户服务协议》项下关于“账号”的条款约定。
                </Text>
                <Text className="text-white text-sm leading-relaxed mb-3">
                    （3）请您了解，我们会对同一会员账号最多可登录的终端数量、同一会员账号同时在线的终端数量进行限制。如您超出上述限制，公司有权视您的超出使用情况对您作出限制登录、限制使用、中断或终止服务等处理措施。
                </Text>
                <Text className="text-white text-sm leading-relaxed mb-3">
                    （4）您所开通的会员服务使用期限届满（到期日的当天23:59）后，如您未续费或继续购买其他类别的会员套餐，您的会员账号即恢复为普通账号，您将无法再继续享有相应会员权益。
                </Text>
                <Text className="text-white text-sm leading-relaxed mb-3">
                    （5）本系列会员支持自动续费。目前基础会员、标准会员和高级会员服务支持的自动续费类型包括连续包月及连续包年，计费周期相应为月度和年度，详细规则请见本协议附录《自动续费服务规则》。公司可能会根据业务发展、用户需求的变化随时增加、调整自动续费服务类型、自动续费服务权益内容（以实际购买时产品页面展示及说明为准）。
                </Text>
                <Text className="text-white text-sm leading-relaxed mb-3">
                    （6）您开通会员服务后，您可登录会员账号查询您的付费权益信息（如已开通权限、使用期限等），查询路径为：AURA网站【积分/会员】；AURA移动端【我】-【设置】-【订阅和发票】/【会员中心】。
                </Text>

                <Text className="text-white text-base font-bold mt-4 mb-2">4.2 积分服务</Text>
                <Text className="text-white text-sm leading-relaxed mb-3">
                    4.2.1 “积分”是我们向您提供的用于在AURA平台上进行相关消费的虚拟工具，您可以使用积分兑换包括但不限于“图片生成”、“视频生成”和“数字人”等AURA平台功能（具体功能服务详情及其对应的积分兑换数量等请查看AURA平台相关产品、服务页面的提示说明）。您了解并确认，积分充值成功后将不支持退款或反向兑换为人民币及其他货币，积分只能兑换本协议约定的AURA平台功能或服务。
                </Text>
                <Text className="text-white text-sm leading-relaxed mb-3">
                    4.2.2 您理解并确认，积分的使用期限根据积分类型不同存在差异，具体如下：
                </Text>
                <Text className="text-white text-sm leading-relaxed mb-3">
                    （1）系列会员权益项下赠送的积分（订阅积分）：在系列会员（包括连续包月及连续包年的系列会员）使用期限内以月为周期赠送积分，积分的使用期限为用户获取积分之日起1个月内，即从用户的会员账号获取AURA平台赠送的积分之时开始，至1个自然月结束后的当日截止（例如，用户订阅连续包年的系列会员服务，在2025年1月1日10:00订阅成功并获取AURA平台赠送的积分之时，积分的使用期限开始，并在2025年2月1日10:00截止）。
                </Text>
                <Text className="text-white text-sm leading-relaxed mb-3">
                    （2）AURA平台每日赠送的积分（赠送积分）：积分的使用期限为当日，从用户登录账号并获取AURA平台赠送的积分之时开始，当日截止（例如，用户在2025年1月1日10:00登录并获取AURA平台赠送的积分之时，积分的使用期限开始，并在2025年1月1日23时59分59秒截止）。
                </Text>
                <Text className="text-white text-sm leading-relaxed mb-3">
                    （3）用户充值积分（充值积分）：积分的使用期限为2年，从用户充值成功之时开始，至2个自然年结束后的当日截止（例如，用户2025年1月1日10:00充值成功，用户账号内的积分有效期从用户充值成功时开始，2027年1月1日10:00截止）。
                </Text>
                <Text className="text-white text-sm leading-relaxed mb-3">
                    您可在AURA移动端【我】-【设置】-【会员中心】-【我的积分】、AURA网站【积分/会员】-【积分详情】中查看积分的余额情况、积分获得和消耗记录，该等记录将作为您使用积分情况的有效依据。如您对积分记录有异议，您可以通过本协议约定的联系方式与公司联系，我们调查核对后确有错误的，将予以更正。
                </Text>
                <Text className="text-white text-sm leading-relaxed mb-3">
                    4.2.3 您充值购买积分的费用将由公司或公司指定的合作方向您收取。各充值方式对应的渠道商可能会按其标准制定相关充值渠道手续费用，并在用户充值时收取，请用户务必注意各充值方式的渠道商服务手续费，并按自身需求选择充值方式。
                </Text>
                <Text className="text-white text-sm leading-relaxed mb-3">
                    4.2.4 平台倡导理性消费，请您务必根据自身实际需求购买相应数量的积分，同时，在充值过程中，请您务必谨慎确认您充值的设备、账号或账号绑定的手机号码，并仔细选择及/或输入充值设备/充值账号/账号绑定手机号码、充值金额等相关操作选项。若因您自身输入账号/账号绑定手机号错误、金额错误、操作不当或不了解、未充分了解充值计费方式等因素造成充错账号、充值金额错误、错选充值种类等情形而导致自身权益受损的，由此带来的损失由您自行承担，公司不会作出补偿或赔偿。
                </Text>
                <Text className="text-white text-sm leading-relaxed mb-3">
                    4.2.5 如果公司发现因系统故障或其他任何原因导致的处理错误，无论有利于公司还是有利于您，公司都有权纠正该错误。如果该错误导致您实际收到的积分数量少于您应获得的“积分”，则公司在确认该处理错误后会尽快将差额补足至您的账号中。如果该错误导致您实际收到的积分数量多于您应获得的积分，则无论错误的性质和原因如何，公司有权从您的账号中直接扣除差额。
                </Text>

                <Text className="text-white text-lg font-bold mt-5 mb-3">五、付费说明及退款</Text>
                <Text className="text-white text-base font-bold mt-4 mb-2">5.1 费用标准</Text>
                <Text className="text-white text-sm leading-relaxed mb-3">
                    5.1.1 AURA以AI技术为驱动，平台投入大量成本提升技术能力，用以更新迭代与优化为您提供的产品功能和服务。
                </Text>
                <Text className="text-white text-sm leading-relaxed mb-3">
                    5.1.2 请您了解，具体每项付费服务项下权益及内容的收费标准、积分兑换数量应以实际购买时或积分兑换时AURA平台相关产品、服务页面中所展示的标价或提示说明为准。
                </Text>
                <Text className="text-white text-sm leading-relaxed mb-3">
                    5.1.3 请您了解，公司对AURA平台提供的付费服务及其项下对应包含的用户权益享有自主定价的权利。
                </Text>
                <Text className="text-white text-sm leading-relaxed mb-3">
                    5.1.4 请您了解，基于AI技术的研发投入、更新迭代、产品功能、模型和服务的更新与优化、市场与业务发展、经营需要、权益调整，付费服务项下具体权益、内容的定价可能会不时调整，价格调整将自公布之日起生效，您于该等调整生效前已开通、购买的服务权益及内容不会受到影响，但若使用期限届满后需续费（含自动续费）或另行购买，以调整生效后的价格为准。其中特别说明的是，如您已对所购买的付费服务开通自动续费服务，则相关付费服务所包含的虚拟权益发生价格调整时，公司会以适当的方式通知您，并将尽力保障您的合法权益。
                </Text>
                <Text className="text-white text-sm leading-relaxed mb-3">
                    5.1.5 除具体付费服务购买页面及相关权益详情页另有解释说明外，购买页面及相关权益详情页中对于价格的说明以本条理解和解释为准：
                </Text>
                <Text className="text-white text-sm leading-relaxed mb-3 pl-4">
                    划线价格：指公司制定的付费服务权益市场参考价、指导价或其曾经展示过的销售价等。由于地区、时间的差异性和市场行情波动，付费服务权益的参考价、指导价等可能与您实际购买/消费时的展示销售价不一致，该划横线价格仅供您参考。
                </Text>
                <Text className="text-white text-sm leading-relaxed mb-3 pl-4">
                    未划线价格：指付费服务权益展示的销售价、实时标价，不因表述的差异改变性质。具体成交价格可能根据付费服务全部或部分权益促销活动或用户使用优惠券、积分等情况发生变化，您购买付费服务权益的实际价格应以订单结算页价格为准。
                </Text>
                <Text className="text-white text-sm leading-relaxed mb-3 pl-4">
                    活动促销价/折扣价：如无特殊说明，活动促销价/折扣价是在划线价格或市场参考价、指导价基础上给予的优惠价格。如有疑问，您可以在购买前与客服联系。
                </Text>
                <Text className="text-white text-sm leading-relaxed mb-3 pl-4">
                    会员价：如无特殊说明，指在划线价格或市场参考价、指导价基础上给予的会员用户专享优惠价格。如有疑问，您可以在购买前与客服联系。
                </Text>
                <Text className="text-white text-sm leading-relaxed mb-3 pl-4">
                    价格异常：因可能存在系统缓存、页面更新延迟等不确定性情况，导致价格显示异常，单项付费服务全部或部分权益的实际价格请以订单结算页价格为准。如您发现异常情况出现，请立即联系我们补正，以便您能顺利完成付费服务相关权益的购买。
                </Text>

                <Text className="text-white text-base font-bold mt-4 mb-2">5.2 购买和支付</Text>
                <Text className="text-white text-sm leading-relaxed mb-3">
                    5.2.1 请您注意，除本协议另有约定外，本协议项下付费服务的开通或购买均需在用户账号登录后操作，如您不使用用户账号进行登录，您将以“游客模式”使用AURA部分服务或功能的体验，但将无法开通、购买付费服务。
                </Text>
                <Text className="text-white text-sm leading-relaxed mb-3">
                    5.2.2 AURA移动端目前提供多种登录方式。特别提示您，如您需将所购买的单项付费服务及相关功能、权益在AURA平台各端口实现互通使用，您需使用同一账号登录。
                </Text>
                <Text className="text-white text-sm leading-relaxed mb-3">
                    5.2.3 您应该通过AURA平台指定的现有支付方式或今后AURA指定的支付方式支付购买费用。不同终端和系统可支持的支付方式可能不同，请根据支付页面的指示完成支付。
                </Text>

                <Text className="text-white text-base font-bold mt-4 mb-2">5.3 游客模式</Text>
                <Text className="text-white text-sm leading-relaxed mb-3">
                    5.3.1 苹果应用商店（App Store）渠道允许非注册用户在“游客模式”下购买AURA付费服务，即对应的付费权益将会绑定您购买付费服务时所用的苹果设备，且该等付费权益也将仅可在绑定设备上使用；但请您了解，您的付费权益可能会因为您使用游客模式而无法完整享受。公司提示您注意，若您绑定付费权益的苹果设备丢失、损坏，或您对其进行系统升级、还原、清空或其他类似行为的，将会导致您无法继续使用绑定于此设备的付费权益，由此造成的您的损失，您应当自行承担。
                </Text>
                <Text className="text-white text-sm leading-relaxed mb-3">
                    5.3.2 公司在此建议，您在购买付费服务前，按照AURA前端页面操作指引登录您的用户账号，以便于您在其他您所持有的设备上使用所购买的各项付费权益，以及更好、更安全地享受我们为您提供的付费服务。
                </Text>

                <Text className="text-white text-base font-bold mt-4 mb-2">5.4 退费规则</Text>
                <Text className="text-white text-sm leading-relaxed mb-3">
                    由于AURA付费服务及权益为虚拟消费商品，除因法定情形、本协议约定情形或因AURA服务及功能存在重大瑕疵导致您无法正常使用所购服务、权益等公司违约情形外，您在完成相应购买和支付行为后，原则上不可进行转让或要求退费，请您在购买相应付费服务（包括自动续费服务）之前，仔细核对服务及权益信息、价格、使用期限及本协议相关使用规则，并注意仔细核实您购买服务的用户账号信息。
                </Text>

                <Text className="text-white text-lg font-bold mt-5 mb-3">六、通用规则</Text>
                <Text className="text-white text-sm leading-relaxed mb-3">
                    6.1 请您了解，为了改善用户体验、完善服务内容，公司可能不时对各项付费服务及相关功能、用户权益进行更新、优化，更新及优化过程中可能涉及到部分已上线功能、权益的下线或调整，公司将会尽力保障您的用户权益。
                </Text>
                <Text className="text-white text-sm leading-relaxed mb-3">
                    6.2 请您注意，各项付费服务及相应付费权益仅限您本人通过您注册的用户账号使用。未经公司书面同意，禁止以任何形式赠与、借用、出租、转让、售卖或以其他方式许可他人使用该用户账号及账号内已购服务、权益。如果公司发现或者有合理理由认为实际使用者并非用户账号所有人，为保障用户账号及用户权益安全，公司有权立即暂停或终止向该用户账号提供相应服务或权益。您应正确使用及妥善保管、维护您的用户账号及密码，如非因AURA平台及公司过错而发生的泄露、遗失、被盗等情况，您需自行承担相应损失。
                </Text>
                <Text className="text-white text-sm leading-relaxed mb-3">
                    6.3 您开通、购买相应付费服务后，可以在相应使用期限内使用您所购买的付费服务及用户权益。公司在此提示您，由于使用期限等使用规则与您自身权益相关，请您在购买时务必仔细查阅相关付费服务购买页面及相关服务、权益的详情页说明，充分理解本协议、购买页面及相关服务、权益的详情页说明所公示的内容，以确保您对所购买的付费服务、您所获得的用户权益及使用规则有清晰地了解和认知。
                </Text>
                <Text className="text-white text-sm leading-relaxed mb-3">
                    6.4 如因法律法规变动、政府行为、情势变更等因素，导致您不能按照您正常获取全部或部分付费服务及用户权益的，公司会以适当方式通知您，但不承担由此对您造成的任何损失，您如对此有任何疑问，可以通过本协议约定的投诉和联系方式与公司联系。
                </Text>
                <Text className="text-white text-sm leading-relaxed mb-3">
                    6.5 如您存在如下违法、不当开通、使用付费服务的情形，公司有权取消/作废您已购买的相关付费服务及付费权益，且将不会退还您已支付的费用，您应对您违法、不当开通、使用付费服务的行为及法律后果负责，若因此给公司造成损失的，公司有权向您追偿，且公司有权视情况采取本协议第8.2条相关处理措施，并要求您退还您通过出售、转让、许可等其他方式取得的收益或非法获利（如有）：
                </Text>
                <Text className="text-white text-sm leading-relaxed mb-3 pl-4">
                    （1）以盗窃、利用系统漏洞（包括但不限于机器人软件、蜘蛛软件、爬虫软件、刷屏软件等）及规则/系统设置缺陷或错误、通过任何非公司官方或授权渠道、途径、方式获得的付费服务及权益（包括但不限于购买、租用、借用、分享、受让等方式获得）、恶意利用或破坏付费服务及权益的行为；
                </Text>
                <Text className="text-white text-sm leading-relaxed mb-3 pl-4">
                    （2）利用付费服务及权益进行营利（单项付费服务允许商业用途的除外）或非法获利，以各种方式销售、转让、许可或转移您所享有的付费服务或付费权益，或将本服务或付费权益有偿借给他人使用；
                </Text>
                <Text className="text-white text-sm leading-relaxed mb-3 pl-4">
                    （3）通过非法手段对用户账号项下已购付费服务的使用期限、消费记录、交易状态等进行修改，或用非法的方式或为了非法的目的使用已购买的付费服务；
                </Text>
                <Text className="text-white text-sm leading-relaxed mb-3 pl-4">
                    （4）主动对公司用于保护付费服务及权益的任何安全措施技术进行破解、更改、反操作、破坏或其他篡改，或协助他人进行上述行为；
                </Text>
                <Text className="text-white text-sm leading-relaxed mb-3 pl-4">
                    （5）利用付费服务及权益侵犯公司及任何第三方的知识产权、财产权、名誉权等合法权益的行为；
                </Text>
                <Text className="text-white text-sm leading-relaxed mb-3 pl-4">
                    （6）利用付费服务及权益危害或涉嫌危害未成年人的行为；
                </Text>
                <Text className="text-white text-sm leading-relaxed mb-3 pl-4">
                    （7）其他违反法律、法规、以及本协议及相关平台规则的行为。
                </Text>
                <Text className="text-white text-sm leading-relaxed mb-3">
                    6.6 请您了解，我们尊重并保护用户、创作者及他人的知识产权、肖像权、名誉权、隐私权等合法权益。您需保证，在使用AURA平台功能及各项服务时，如相关服务、功能支持您上传文字、图片、视频、音频或素材等内容的，您需确保您所上传的内容不侵犯任何第三方的知识产权、肖像权、名誉权、隐私权等权利及合法权益。如您违反该要求，相关侵权责任需由您自行承担，且我们有权在收到并按照相关平台规则核实相关权利方投诉的情况下，自主决定移除该等侵权内容，您需自行承担因此给您造成的损失或不利后果，且因此给公司造成损失的，公司有权向您追偿，并有权视情况按照第8.2条采取相关处理措施。
                </Text>
                <Text className="text-white text-sm leading-relaxed mb-3">
                    6.7 请您了解，您开通及使用本协议项下付费服务所需设备（如个人电脑、手机及其他与接入互联网或移动网有关的装置）及成本（如为接入互联网而支付的电话费及上网费、为使用移动网而支付的手机费）均应由您自行负担。
                </Text>
                <Text className="text-white text-sm leading-relaxed mb-3">
                    6.8 请您了解，公司可能会通过您用户账号所绑定的手机号或通过站内信、站内公告等其他方式向您发送推荐内容、付费用户福利、优惠活动等信息。如您不同意接收，您可随时按照前述信息随附的关闭或退订选项进行关闭或退订。
                </Text>

                <Text className="text-white text-lg font-bold mt-5 mb-3">七、服务中止、终止</Text>
                <Text className="text-white text-sm leading-relaxed mb-3">
                    7.1 您所开通、购买的付费服务的中止或终止包含如下情况：
                </Text>
                <Text className="text-white text-sm leading-relaxed mb-3 pl-4">
                    （1）您主动中止或终止，包括但不限于中止或终止已购付费服务、使用期限到期未进行续费，或您将用户账号注销等；
                </Text>
                <Text className="text-white text-sm leading-relaxed mb-3 pl-4">
                    （2）因为您的违约行为，公司主动中止或终止相应付费服务的；
                </Text>
                <Text className="text-white text-sm leading-relaxed mb-3 pl-4">
                    （3）因国家或相关政府监管部门要求或发生不可抗力事件时，公司中止或终止相应付费服务的；
                </Text>
                <Text className="text-white text-sm leading-relaxed mb-3 pl-4">
                    （4）其他根据法律法规应中止或终止相应付费服务的。
                </Text>
                <Text className="text-white text-sm leading-relaxed mb-3">
                    7.2 中止或终止相应付费服务后，公司有权利但无义务确保您收到特别提示或通知，当您发现无法正常使用服务时，可以与AURA平台客服联系。
                </Text>
                <Text className="text-white text-sm leading-relaxed mb-3">
                    7.3 当发生第7.1条约定的中止或终止情形时：
                </Text>
                <Text className="text-white text-sm leading-relaxed mb-3 pl-4">
                    （1）除法律规定的责任外，公司不对您和任何第三人承担任何责任；
                </Text>
                <Text className="text-white text-sm leading-relaxed mb-3 pl-4">
                    （2）除本协议特别约定外，已收取的费用不予退还；
                </Text>
                <Text className="text-white text-sm leading-relaxed mb-3 pl-4">
                    （3）公司有权利但无义务确保您就相关付费服务的用户数据信息能予以保留。
                </Text>
                <Text className="text-white text-sm leading-relaxed mb-3">
                    7.4 当发生付费服务终止情况后，您无权要求公司继续向您提供相应付费服务、用户权益，或要求公司履行任何其他已终止该付费服务相关的义务，但这并不影响终止前您与公司基于本协议产生的权利义务，因您的原因导致公司遭受第三方索赔、行政部门处罚等，您应当赔偿公司因此产生的损失及（或）发生的费用。
                </Text>

                <Text className="text-white text-lg font-bold mt-5 mb-3">八、风险和责任</Text>
                <Text className="text-white text-sm leading-relaxed mb-3">
                    8.1 您理解并同意，因您自身违反法律、法规，违反本协议或相关平台规则的规定，导致或产生第三方主张的任何索赔、要求或损失，您需独立承担责任，如因此给公司或AURA造成损失的，您需承担赔偿责任。
                </Text>
                <Text className="text-white text-sm leading-relaxed mb-3">
                    8.2 您使用付费服务时，应遵守法律法规，应遵守公共秩序，尊重公序良俗，不得危害网络安全，不得利用网络从事危害国家安全、荣誉和利益，煽动颠覆国家政权，推翻国家制度，煽动国家分裂，破坏国家统一，宣扬恐怖主义及极端主义，宣扬民族仇恨，传播暴力、淫秽色情信息，编造、传播虚假信息扰乱经济秩序和社会秩序，利用服务开展诈骗、洗钱、敲诈勒索、赌博等犯罪行为，从事侵害他人名誉、隐私、知识产权和其他合法权益等活动。如公司发现您存在前述行为，有权对您的用户账号及相关使用权限采取管理措施，该等措施包括但不限于：
                </Text>
                <Text className="text-white text-sm leading-relaxed mb-3 pl-4">
                    （1）通过站内信通知等方式发出警示，要求整改；
                </Text>
                <Text className="text-white text-sm leading-relaxed mb-3 pl-4">
                    （2）拒绝开通申请，或在不通知您的情况下立即终止您已购买的全部或部分服务及权益，并无需退费；
                </Text>
                <Text className="text-white text-sm leading-relaxed mb-3 pl-4">
                    （3）限制/冻结您的用户账号的部分或全部权限/功能；
                </Text>
                <Text className="text-white text-sm leading-relaxed mb-3 pl-4">
                    （4）暂时冻结或者永久性地封禁/冻结您的用户账号；
                </Text>
                <Text className="text-white text-sm leading-relaxed mb-3 pl-4">
                    （5）限制/禁止您继续购买付费服务或享受相应服务权益。
                </Text>
                <Text className="text-white text-sm leading-relaxed mb-3">
                    此外，公司及/或平台有权要求您赔偿公司因您的行为而造成的损失（包括但不限于公司向第三方支付的赔偿款、行政罚款、公证费、鉴定费、差旅费、律师费、诉讼费等合理费用）。
                </Text>
                <Text className="text-white text-sm leading-relaxed mb-3">
                    8.3 除此之外，对于您发生的相关违法、违规及犯罪行为，公司还有权保存您及您用户账号的相关信息并向相关主管部门、公安/司法机关汇报以依法追究相关法律责任。
                </Text>

                <Text className="text-white text-lg font-bold mt-5 mb-3">九、知识产权</Text>
                <Text className="text-white text-sm leading-relaxed mb-3">
                    9.1 公司是AURA（包括AURA整体及AURA涉及的所有内容、组成部分或构成要素，本段下同）的知识产权权利人，享有AURA的一切著作权、商标权、专利权、商业秘密等知识产权及其他合法权益，以及与AURA相关的所有信息内容（包括但不限于相关文字、图片、音频、视频、图表、产品页面设计、版面框架、有关数据或电子文档等）的知识产权和合法权益，但相关权利人依照法律规定应享有的权利除外。除本协议另有约定外，未经公司事先书面同意，您不得以任何方式将AURA平台功能、服务及前述AURA拥有知识产权的内容以商业用途进行使用，不得对AURA进行包括（但不限于）反向工程、反编译、反汇编等可能影响或改变其原有内容或功能的行为，不得破解或试图破解AURA的安全和保密措施，不得对AURA的资源进行爬取、存储、缓存、下载、镜像等，且不得利用AURA开发同类产品、服务，也不得协助或允许任何第三方进行上述行为，否则由此给公司及/或其他权利人造成的损失均应由您承担全部责任。
                </Text>
                <Text className="text-white text-sm leading-relaxed mb-3">
                    9.2 在AURA付费服务下，公司是在该付费服务中向用户提供的AI模型等权益内容（本条简称“公司提供内容”）的知识产权权利人，自行享有或者经授权享有前述内容的一切知识产权及其他合法权益。除公司作为权益提供方外，其他灵感模板、素材等内容由创作者提供（本条简称“创作者提供内容”），创作者享有创作者提供内容的一切知识产权及合法权益。除按照相关平台规则使用外，您无权对上述公司提供内容及创作者提供内容进行其他超出使用规则范围的使用或处分，否则由此给公司及/或创作者造成的损失均应由您承担全部责任。
                </Text>
                <Text className="text-white text-sm leading-relaxed mb-3">
                    9.3 公司提供内容的合法性、合规性由公司承担全部责任。请您了解，由于付费服务中包含大量创作者提供内容，该等创作者提供内容均系由创作者原创、或经第三方授权后上传、提供给用户，创作者需为其提供的内容负责并独立承担全部法律责任，如该等创作者提供内容存在违反法律、法规或侵犯您或他人合法权益情形，或您与创作者就创作者提供内容产生纠纷或争议，您可通过本协议约定的联系方式向公司进行投诉，公司将尽力为您与创作者之间的纠纷解决提供协助，但公司将不会承担由此导致的任何法律责任。
                </Text>
                <Text className="text-white text-sm leading-relaxed mb-3">
                    9.4 为持续改善AURA为您提供的各项服务，您理解并同意，对于您使用AURA平台的输入内容、AURA平台接收相应您的输入内容而生成图片、音视频、文字等生成内容及您发布的信息内容，您授予我们一项全球范围内、免费、非独家、可多层次再许可的权利，允许我们用于根据平台规则向您提供服务、优化我们的产品服务及模型以及确保服务的安全性和稳定性。如果您不希望我们用于前述目的，您可通过意见反馈相关页面或发送邮件至 support@aura.ai 联系我们。
                </Text>
                <Text className="text-white text-sm leading-relaxed mb-3">
                    9.5 平台提供的 AI 语音交互内容仅供娱乐与参考，不构成任何专业建议。
                </Text>

                <Text className="text-white text-lg font-bold mt-5 mb-3">十、变更及免责条款</Text>
                <Text className="text-white text-sm leading-relaxed mb-3">
                    10.1 请您了解，您为购买付费服务通过各类支付渠道进行的支付行为可能存在一定的风险（包括但不限于不法分子盗用用户账号或银行信息等进行违法活动、不法分子实施诈骗行为引导用户付费等），该等风险均会给您造成相应的经济损失。对于上述风险，公司无法控制且无法定义务向不法分子追究法律责任或代其向您赔偿损失。公司会在法律法规允许的范围为您提供帮助，以尽量减少您的损失，但公司提供任何帮助的行为，均不应成为公司应当承担法律责任的证据或依据。
                </Text>
                <Text className="text-white text-sm leading-relaxed mb-3">
                    10.2 请您了解，公司并不能随时或始终预见和防范技术及其他风险，包括但不限于因不可抗力、政府行为、网络原因、系统或设备故障（包括但不限于服务器宕机/崩溃、系统不稳定/故障、数据库故障等）、电力故障、第三方服务瑕疵、黑客攻击、计算机病毒/木马/恶意程序以及其无法控制或合理预见的其他情形等造成的服务中断和对用户个人数据及资料造成的损失，公司不承担由此对您造成的任何损失、损害或退还任何您已支付的费用，但公司会尽可能事先进行通告。
                </Text>
                <Text className="text-white text-sm leading-relaxed mb-3">
                    10.3 您理解并同意，如由于公司过错造成您所购买的付费服务或相关权益不正常中断或不可用，公司将会尽快采取措施恢复您的权益，并根据实际情况向您作出补偿（如延长相应使用期限、赠送部分免费体验权益等，以实际提供为准），公司会尽力保障您的权益。
                </Text>
                <Text className="text-white text-sm leading-relaxed mb-3">
                    10.4 因您自身的原因导致公司无法提供付费服务或提供付费服务时发生任何错误而产生的任何损失或责任，由您自行负责，公司不承担责任，包括但不限于：
                </Text>
                <Text className="text-white text-sm leading-relaxed mb-3 pl-4">
                    （1）因您的用户账号失效、丢失、被封停；
                </Text>
                <Text className="text-white text-sm leading-relaxed mb-3 pl-4">
                    （2）因您绑定的第三方支付机构、银行账户等原因导致的损失或责任，包括您使用未经认证的账户或使用非您本人的账户，您的账户被冻结、查封等；
                </Text>
                <Text className="text-white text-sm leading-relaxed mb-3 pl-4">
                    （3）因您将用户账号或绑定的账户密码告知他人导致财产损失；
                </Text>
                <Text className="text-white text-sm leading-relaxed mb-3 pl-4">
                    （4）因您个人的故意或重大过失所造成的财产损失。
                </Text>
                <Text className="text-white text-sm leading-relaxed mb-3">
                    10.5 如您在付费过程中涉及由第三方向您提供的相关服务，则除本协议约定外，您还需同意并遵守对您有约束力的该第三方的协议及相关规则，在任何情况下，对于该第三方及其提供的相关服务而产生的争议由您与该第三方解决，公司无需就此向您或第三方承担任何责任。
                </Text>
                <Text className="text-white text-sm leading-relaxed mb-3">
                    10.6 请您了解，公司可能会依据运营规划、市场环境、运营效果、政策变更等众多因素确定是否继续向您提供现有付费服务及相关用户权益，或对现有付费服务及相关用户权益进行修改或调整，您实际使用的付费服务及相关用户权益应以您届时实际可以使用的为准，公司会尽力保证您的权益。
                </Text>
                <Text className="text-white text-sm leading-relaxed mb-3">
                    10.7 请您了解，公司向您提供的付费服务及相关权益可能会受多种因素的影响或干扰，公司不保证（包括但不限于）：
                </Text>
                <Text className="text-white text-sm leading-relaxed mb-3 pl-4">
                    （1）您购买的付费服务及相关权益完全适合您的使用要求或能够符合您的预期；
                </Text>
                <Text className="text-white text-sm leading-relaxed mb-3 pl-4">
                    （2）您购买的付费服务及相关权益的使用不受到任何干扰，或及时、安全、可靠或不出现任何错误；
                </Text>
                <Text className="text-white text-sm leading-relaxed mb-3 pl-4">
                    （3）您购买的付费服务及相关权益中任何错误都能够得到及时更正。
                </Text>
                <Text className="text-white text-sm leading-relaxed mb-3">
                    但公司愿意并欢迎您对AURA、付费服务及相关用户权益的提升和改进提出您的宝贵意见，公司将对您的合理意见充分考虑，并不断优化平台功能及服务。
                </Text>

                <Text className="text-white text-lg font-bold mt-5 mb-3">十一、 投诉与联系方式</Text>
                <Text className="text-white text-sm leading-relaxed mb-3">
                    11.1 如您对本协议、付费服务及用户权益有任何疑问、投诉、意见和建议等，请前往AURA移动端【我】-【设置】-【帮助与反馈】进行意见反馈，或通过 support@aura.ai 联系我们，我们会及时响应和处理。
                </Text>
                <Text className="text-white text-sm leading-relaxed mb-3">
                    11.2 如您被他人投诉或您拟需投诉他人，公司有权将争议中相关方的主体信息、联系方式、投诉相关内容等必要信息提供给相关当事方或相关部门，以便及时解决投诉纠纷，保护当事人正当、合法权益。您需保证对您在投诉处理程序中提供的信息、材料、证据等的真实性、合法性、有效性负责。
                </Text>

                <Text className="text-white text-lg font-bold mt-5 mb-3">十二、 未成年人使用条款</Text>
                <Text className="text-white text-sm leading-relaxed mb-3">
                    12.1 AURA的主要适用人群是成年人，若您是未满18周岁的未成年人，您应在监护人指导下认真阅读本协议，经您的监护人同意本协议后，方可使用相应付费服务。若您未取得监护人的同意，监护人可以通过AURA公示渠道或本协议约定的联系方式通知公司处理相关账号，公司有权对相关用户账号的功能（包括但不限于浏览、使用、消费等）进行限制。
                </Text>
                <Text className="text-white text-sm leading-relaxed mb-3">
                    12.2 我们重视对未成年人个人信息及隐私的保护。我们特别提醒您在填写未成年人个人信息时应加强保护意识并谨慎发布包含未成年人素材的内容。您应当取得权利人同意展示未成年人的肖像、声音等信息，且允许我们依据本协议使用、处理该等与未成年人相关的内容。如相关内容侵犯未成年人权利，我们在收到权利人通知或基于其他保障未成年人合法权益的考虑，有权处理相关内容并视情况通知您。
                </Text>
                <Text className="text-white text-sm leading-relaxed mb-3">
                    12.3 我们将与监护人共同努力，保护未成年人身心健康。如果您是监护人，您亦应履行对未成年人的监护义务，关注未成年人网络安全，引导未成年人健康合理使用网络。未成年人应当在其监护人的监督指导下，在合理范围内正确学习使用网络，养成良好上网习惯，避免沉迷虚拟的网络空间。
                </Text>
                <Text className="text-white text-sm leading-relaxed mb-3">
                    12.4 青少年用户必须遵守《全国青少年网络文明公约》：（1）要善于网上学习，不浏览不良信息；（2）要诚实友好交流，不侮辱欺诈他人；（3）要增强自护意识，不随意约会网友；（4）要维护网络安全，不破坏网络秩序；（5）要有益身心健康，不沉溺虚拟时空。
                </Text>
                <Text className="text-white text-sm leading-relaxed mb-3">
                    12.5 监护人特别提示：（1）如您的被监护人使用付费服务的，您作为监护人应指导并监督被监护人的注册、登录和使用行为。如您的被监护人申请注册或登录用户账号，我们有权认为其已取得您的同意。 （2）您的被监护人在使用付费服务时可能使用支付、充值等功能。您作为监护人，请保管好您的支付设备、支付账户及支付密码等，以避免被监护人在未取得您同意的情况下通过您的用户账号使用支付、充值等功能。
                </Text>

                <Text className="text-white text-lg font-bold mt-5 mb-3">十三、 其他</Text>
                <Text className="text-white text-sm leading-relaxed mb-3">
                    13.1 本协议的成立、生效、履行、解释及争议的解决均应适用中华人民共和国法律。倘若本协议之任何约定因与相关法律法规抵触而无效，则这些条款应在不违反法律的前提下按照尽可能接近本协议目的之原则进行重新解释和适用，且本协议其它条款仍应具有完整的效力。
                </Text>
                <Text className="text-white text-sm leading-relaxed mb-3">
                    13.2 本协议的签署地点为中华人民共和国北京市海淀区，若您与我们发生任何基于本协议相关的争议，双方应尽量友好协商解决，协商不成，您同意应将争议提交至北京市海淀区有管辖权的人民法院诉讼解决。
                </Text>
                <Text className="text-white text-sm leading-relaxed mb-3">
                    13.3 本协议中的标题仅为方便阅读而设，并不影响本协议中任何约定的含义或解释。
                </Text>
                <Text className="text-white text-sm leading-relaxed mb-3">
                    13.4 您和我们均是独立的主体，在任何情况下本协议不构成我们对您的任何形式的明示或暗示担保或条件，双方之间亦不构成代理、合伙、合营或雇佣关系。
                </Text>
                <Text className="text-white text-sm leading-relaxed mb-3">
                    13.5 本协议条款无论因何种原因部分无效或不可执行，其余条款仍有效，对双方具有约束力。
                </Text>

                <Text className="text-white text-lg font-bold mt-5 mb-3">附录：《自动续费服务规则》</Text>
                <Text className="text-white text-sm leading-relaxed mb-3">
                    本《自动续费服务规则》（以下简称“本规则”）被视为《AURA付费服务协议》的补充协议，是其不可分割的组成部分，与其构成统一整体。如本规则与《AURA付费服务协议》存在冲突，则以本规则为准。 您在购买付费服务时，如确认选择“连续订阅”（例如“连续包月”“连续包年”等，以相应付费服务购买页面展示为准）并通过点击同意《AURA付费服务协议》、支付费用等确认行为进行下一步操作或使用付费服务，则视为您同意本规则。
                </Text>
                <Text className="text-white text-sm leading-relaxed mb-3">
                    您理解并同意：
                </Text>
                <Text className="text-white text-sm leading-relaxed mb-3">
                    1. 本自动续费服务是出于您对于自动续费的需求，在您已开通本服务的前提下，避免您因疏忽或其他原因导致未能及时续费造成损失而推出的服务。如果您选择使用自动续费服务，您即授权公司可在您购买的单项付费服务自动续费计费周期即将到期时，委托支付渠道（支付宝、微信、抖音支付等）从您的自有充值账户、与购买单项付费服务的用户账号绑定的第三方支付账户（统称“支付账户”）余额中代扣下一个计费周期费用。部分由支付渠道根据实际情况自行决定扣费周期的（例如，苹果公司iOS支付渠道在使用期限到期前24小时自动扣费），以实际扣费时间为准。一旦扣款成功，公司将自动延长对应付费服务的使用期限。
                </Text>
                <Text className="text-white text-sm leading-relaxed mb-3">
                    2. 自动续费服务类型/计费周期：根据不同付费服务，自动续费服务目前的类型可能包含连续包月、连续包年，相应的计费周期相应为月度、年度（以相应付费服务购买页面展示为准），用户可自行选择。公司可能会根据业务发展、用户需求的变化不时增加、调整自动续费服务类型、自动续费服务权益内容，请您以购买相应付费服务时的具体页面展示内容和详细说明为准。
                </Text>
                <Text className="text-white text-sm leading-relaxed mb-3">
                    3. 自动续费扣款规则
                </Text>
                <Text className="text-white text-sm leading-relaxed mb-3 pl-4">
                    （1） 您选择自动续费服务的，即同意支付渠道可在不验证支付账户密码、支付密码、短信校验码等信息的情况下从您绑定的支付账户中扣划下一个计费周期的服务费；
                </Text>
                <Text className="text-white text-sm leading-relaxed mb-3 pl-4">
                    （2） 除非您主动退订、或公司主动取消了自动续费服务，否则本自动续费服务将会自动续订及扣款，且不受次数限制；
                </Text>
                <Text className="text-white text-sm leading-relaxed mb-3 pl-4">
                    （3） 如果您未主动退订自动续费服务，则将视为您同意公司可依据支付渠道的扣款规则在相应自动续费计费周期到期后的一定期限内进行不时的扣款尝试（即使您支付账户内金额不足）；
                </Text>
                <Text className="text-white text-sm leading-relaxed mb-3 pl-4">
                    （4） 一旦自动续费扣款成功的，公司则为您自动延长对应的付费服务使用期限，延长时限以您选择自动续费服务时选定的计费周期为准；如果上一计费周期到期前扣费周期内出现不可抗力（如网络瘫痪等原因）导致不能正常扣费的，扣费日期向后顺延，直至扣费成功为止。
                </Text>
                <Text className="text-white text-sm leading-relaxed mb-3">
                    请您应关注支付账户及可扣款的余额状况，如因支付账户问题或余额不足导致续费失败等风险及/或损失将由您自行承担。
                </Text>
                <Text className="text-white text-sm leading-relaxed mb-3">
                    4. 为便于您了解自动续费的情况，公司将在扣费日期前5日以站内信、移动端设备系统消息推送等方式提示您即将发生续期扣费的信息，相关支付渠道也可能向您发送自动续费提示（支付渠道的通知请以支付渠道运营商的实际执行为准）。
                </Text>
                <Text className="text-white text-sm leading-relaxed mb-3">
                    5. 请您了解，公司有权调整付费服务自动续费服务套餐的价格。在您自动续费服务有效期内，如公司对您开通自动续费服务的相应付费服务价格调整，公司将会通过产品页面公示、平台公告、站内信通知等合理方式通知您，调整后的价格自调整时或公司通知您的生效日生效。如您不同意价格调整，您可按照本规则选择退订自动续费服务，相应付费服务使用期限将在当前的计费周期届满之日终止。特别提示您，除非您主动按期选择退订自动续费服务，否则公司委托支付渠道对服务费的扣款将不可撤销。
                </Text>
                <Text className="text-white text-sm leading-relaxed mb-3">
                    6. 您有权自由选择是否继续使用或退订自动续费服务。如您选择退订自动续费服务，您需要在相应选择自动续费计费周期届满前操作退订，退订后您所购买的相应付费服务使用周期自当前计费周期届满之日起终止，如您未及时操作退订，支付渠道将继续代扣下一个及后续计费周期的服务费，相应付费服务使用服务周期将会延期至下一个计費周期届满之日。此外，受部分支付渠道（如苹果公司iOS支付渠道）的规则限制，如您在当前自动续费服务计费周期到期前24小时内取消的，该等支付渠道将可能已完成下一个计费周期服务费的代扣，该扣款成功的则会使您所购付费服务的使用周期继续延期至下一个计费周期届满之日。
                </Text>

                <Text className="text-white text-base font-bold mt-4 mb-2">7. 退订方式</Text>
                <Text className="text-white text-sm leading-relaxed mb-3">
                    （1）苹果iOS用户：打开苹果iOS设备“App Store” --&gt; 点击右上角苹果账户头像--&gt;进入“账户”--&gt;
                    点击“订阅”--&gt;选择AURA相关拟取消自动续费的付费服务名称，取消订阅。
                </Text>
                <Text className="text-white text-sm leading-relaxed mb-3">
                    （2）AURA平台网站和安卓用户：
                </Text>
                <Text className="text-white text-sm leading-relaxed mb-3 pl-4">
                    i. 以支付宝支付： 打开“支付宝”App ，点击“我的”右上角设置，选择“支付设置”-“免密支付/自动扣款”，选择AURA相关自动续费的付费服务进行解约操作；
                </Text>
                <Text className="text-white text-sm leading-relaxed mb-3 pl-4">
                    ii. 以微信支付： 打开“微信”App，点击“我”-“服务”-“钱包”，点击页面下方“支付设置”-“自动续费”，选择AURA相关自动续费的付费服务进行解约操作；
                </Text>
                <Text className="text-white text-sm leading-relaxed mb-3 pl-4">
                    iii. 通过抖音支付：打开“抖音”App，点击我-右上角“我的钱包”-“抖音支付”-“设置”-“自动扣款管理”，选择AURA相关自动续费的付费服务进行解约操作 。
                </Text>
                <Text className="text-white text-sm leading-relaxed mb-3">
                    除上述退订方式外，您也可以通过AURA移动端【我】-【设置】-【订阅和发票】、AURA网站【积分/会员】-【订阅管理】页面中的“自动续费”模块进行取消续费操作。
                </Text>
                <Text className="text-white text-sm leading-relaxed mb-3">
                    请注意，您在选择退订自动续费服务前已经授权公司自动续费扣款的指令仍然有效，公司对于支付渠道基于该指令扣除的费用不予退还。
                </Text>
                <Text className="text-white text-sm leading-relaxed mb-3">
                    8. 公司有权根据运营策略需要，停止继续向您提供自动续费服务，并在停止该自动续费服务之前通过平台公示、站内信通知等方式向您发送通知。您所购买的付费服务使用期限将自当前自动续费计费周期届满之日起终止。
                </Text>

            </ScrollView>
        </ScreenContainer>
    );
}
