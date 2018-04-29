export class Alarm {
    constructor(
        public user_id?: string,
        public alarms?: InnerAlarm[]
    ) {}
}

export class InnerAlarm {
    constructor(
        public type?: string,
        public time?: string,
        public tag?: string,
        public description?: string,
        public code?: string
    ) {}
}