// interface for Needs
export interface Needs {
    needid: string;
    userid: string;
    bloodgroup: string;
    district: string;
    city: string;
    emergencystatus: string;
    needbefore: Date;
    desc: string;
    currentstatus: string;
    enrolleddonors: {};
}