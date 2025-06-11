export interface BookModel {
    bookName: string;
    imageUrl: string;
    author: string;
    isbn: number;
    price: number;
    pageCount: number;
    tableofContents: string[];
}

export type Books = BookModel[];