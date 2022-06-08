export class ResultJSON {
    constructor(
        public results: Results[],
    ) {
    }
}
    
class Results {
    constructor(
        public result: Result[],
        public path: string,
    ) {
    }
}

class Result {
    constructor(
        public sr: number,
        public sc: number,
        public er: number,
        public ec: number,
        public si: number,
        public ei: number,
    ) {
    }
}