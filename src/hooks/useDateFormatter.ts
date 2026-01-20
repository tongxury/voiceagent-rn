const useDateFormatter = () => {

    const formatToNow = (timestamp: number) => {
        if (!timestamp) return '';

        const date = new Date(timestamp * 1000);
        const now = new Date();

        // 计算天数差异
        const diffTime = now.getTime() - date.getTime();
        const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

        // 格式化时间部分
        const hours = date.getHours().toString().padStart(2, '0');
        const minutes = date.getMinutes().toString().padStart(2, '0');
        const timeStr = `${hours}:${minutes}`;

        // 根据天数差异返回不同格式
        if (diffDays === 0) {
            return `今天 ${timeStr}`;
        } else if (diffDays === 1) {
            return `昨天 ${timeStr}`;
        } else if (diffDays < 7) {
            const weekdays = ['周日', '周一', '周二', '周三', '周四', '周五', '周六'];
            return `${weekdays[date.getDay()]} ${timeStr}`;
        } else {
            const month = (date.getMonth() + 1).toString().padStart(2, '0');
            const day = date.getDate().toString().padStart(2, '0');
            return `${month}月${day}日 ${timeStr}`;
        }
    };

    const formatFromNow = (timestamp: number) => {
        if (!timestamp) return '';

        const date = new Date(timestamp * 1000);
        const now = new Date();

        // 计算天数差异（未来时间）
        const diffTime = date.getTime() - now.getTime();
        const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

        // 格式化时间部分
        const hours = date.getHours().toString().padStart(2, '0');
        const minutes = date.getMinutes().toString().padStart(2, '0');
        const timeStr = `${hours}:${minutes}`;

        // 根据天数差异返回不同格式
        if (diffDays === 0) {
            return `今天 ${timeStr}`;
        } else if (diffDays === 1) {
            return `明天 ${timeStr}`;
        } else if (diffDays === 2) {
            return `后天 ${timeStr}`;
        } else if (diffDays < 7) {
            const weekdays = ['周日', '周一', '周二', '周三', '周四', '周五', '周六'];
            return `下${weekdays[date.getDay()]} ${timeStr}`;
        } else if (diffDays < 365) {
            const month = (date.getMonth() + 1).toString().padStart(2, '0');
            const day = date.getDate().toString().padStart(2, '0');
            return `${month}月${day}日 ${timeStr}`;
        } else {
            const year = date.getFullYear();
            const month = (date.getMonth() + 1).toString().padStart(2, '0');
            const day = date.getDate().toString().padStart(2, '0');
            return `${year}年${month}月${day}日 ${timeStr}`;
        }
    };

    return {
        formatToNow: formatToNow,
        formatFromNow: formatFromNow
    };
}

export default useDateFormatter;
