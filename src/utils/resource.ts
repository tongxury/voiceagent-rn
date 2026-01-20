import {Account, Resource} from '@/types';

export const isMedia = (resource: Resource) => {
    return isVideo(resource) || isImage(resource);
};

export const isVideo = (resource: Resource) => {
    return resource?.mimeType?.startsWith('video/');
};

export const isImage = (resource: Resource) => {
    return resource?.mimeType?.startsWith('image/');
};


export const packTitleResource = (title: string): Resource => (
    {
        category: 'title',
        mimeType: 'text/plain',
        content: title,
    }
);

export const packTopicResource = (title: string): Resource => (
    {
        category: 'topic',
        mimeType: 'text/plain',
        content: title,
    }
);

export const packItemResource = (item: any): Resource[] => (
    [{
        category: '',
        mimeType: 'video/mp4',

    }]
);

export const packScriptResource = (title: string): Resource => (
    {
        category: 'script',
        mimeType: 'text/plain',
        content: title,
    }
);

export const packPersonalAccountResource = (acc: Account): Resource => (
    {
        category: 'personalProfile',
        mimeType: 'text/plain',
        // content: JSON.stringify({
        //     'followerCount': String(acc.followers),
        //     'interacts': String(acc.interacts),
        //     'platform': String(acc.platform),
        //     'sign': String(acc.sign || ''),
        //     'username': String(acc.nickname || ''),
        // }),
        content: JSON.stringify(acc)
    }
);
