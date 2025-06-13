export default class HttpResponseError extends Error {
    public constructor(public message: string, public statusCode: number = 500) {
        super(message);
    }

    public getMessage(): string {
        return this.message;
    }

    public getStatusCode(): number {
        return this.statusCode;
    }
}