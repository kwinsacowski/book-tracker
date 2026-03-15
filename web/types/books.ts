export type Book = {
    status: string;
    Progress: number;
    progressUnit: string;
    book: {
        id: string;
        title: string;
        author?: string;
        pageCount?: number;
    };
};
