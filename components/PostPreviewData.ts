export interface PostPreviewData {
    id: string;
    title: string;
    // date: string;
    cover: string;
    subtitle: string;
    slug: string;
}

export interface EventPreviewData {
    id: string;
    title: string;
    cover: string;
    published?: string;
    slug: string;
    subtitle: string;
}

export interface ArchiveHeaderData {
    categories: [{}]
}