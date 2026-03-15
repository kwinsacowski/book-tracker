export type Book = {
    status: string;
    progress: number;
    progressUnit: string;
    book: {
        id: string;
        title: string;
        author?: string;
        pageCount?: number;
    };
};
