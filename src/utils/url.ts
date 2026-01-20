/**
 * 从字符串中提取小红书链接
 * @param {string} text - 输入的字符串
 * @returns {string|null} - 找到的链接或null
 */
export function extractLink(text: string): string {

    // 定义要查找的前缀
    const prefixes = [
        "https://v.douyin.com/",
        "http://xhslink.com/",
        "https://xhslink.com/",
        "xhslink.com",
        "https://www.xiaohongshu.com/discovery/item/"
    ];

    // 尝试找到任一前缀
    for (const prefix of prefixes) {
        const startIndex = text.indexOf(prefix);

        // 如果找到前缀
        if (startIndex !== -1) {
            // 从前缀开始位置截取
            let link = text.substring(startIndex);

            // 查找可能的结束字符
            const endChars = [' ', '\n', '\t', ',', '，', ';', '；', '。', '!', '！', '？', '"', "'", ')', '）', ']', '】', '}', '」', '』'];

            // 找到最早的结束字符位置
            let endIndex = link.length;
            for (const char of endChars) {
                const charIndex = link.indexOf(char);
                if (charIndex !== -1 && charIndex < endIndex) {
                    endIndex = charIndex;
                }
            }

            // 截取到结束字符位置
            link = link.substring(0, endIndex);

            link = link.startsWith("http") ? link : "http://" + link;

            return link;
        }
    }

    return "";
}
