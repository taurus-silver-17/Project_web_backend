import { User, UserHandler} from "./user"
import { Metric, MetricsHandler} from "./metrics"
import {LevelDB} from './leveldb';

var dbUser: UserHandler;
var dbMet: MetricsHandler;

dbUser = new UserHandler("./db/users");
dbMet = new MetricsHandler("./db/metrics");


const newUsers = [
    new User("test", "t@t", "test"),    
    new User("Lilian", "Lilian.delaplace@gmail.com", "test"),    
]

const met = [
    [new Metric(`${new Date("2019-15-10").getTime()}`, 120),
    new Metric(`${new Date("2018-14-09").getTime()}`, 119),
    new Metric(`${new Date("2017-13-08").getTime()}`, 118)],
];


