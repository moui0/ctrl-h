export class ResultJSON {
    constructor(
        public results: Results[],
    ) {
    }
}
    
class Results {
    constructor(
        public path: string,
        public path_res: PathResult[],
    ) {
    }
}

class PathResult {
    constructor(
        public label: number,
        public label_res: LabelRes[],
    ) {
    }
}

class LabelRes {
    constructor(
        public position: Position,
        public subNode: Position[],
    ) {
    }
}

class Position {
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