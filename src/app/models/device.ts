export class Device {
    constructor(
        public id?: string,
        public type?: string,
        public manager?: string,
        public hospital?: string,
        public update?: string,
        public used?: boolean
    ) { }
}
