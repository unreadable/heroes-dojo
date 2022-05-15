export default class Logger {
    constructor() {}

    public info(message: string) {
        console.log('-> \x1b[36m%s\x1b[0m', message);
    }

    public success(message: string) {
        console.log('-> \x1b[32m%s\x1b[0m', message);
    }

    public warning(message: string) {
        console.log('-> \x1b[33m%s\x1b[0m', message);
    }

    public wow(message: string) {
        console.log('-> ✨✨✨ \x1b[32m%s\x1b[0m ✨✨✨', message);
    }
};
