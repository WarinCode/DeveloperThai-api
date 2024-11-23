export interface BookModel {
    id: number;
    bookName: string;
    imageUrl: string;
    author: string;
    isbn: number;
    price: number;
}

export type Books = BookModel[];