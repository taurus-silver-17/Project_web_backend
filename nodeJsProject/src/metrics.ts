import {LevelDB} from './leveldb';
import WriteStream from 'level-ws';

export class Metric {
  public timestamp: string
  public value: number

  constructor(ts: string, v: number) {
    this.timestamp = ts
    this.value = v
  }

  static fromDb(key: string, value: any) {
    const [type, user, timestamp] = key.split(":");
    return { user: user, timestamp: timestamp, value: value };
  }
}

export class MetricsHandler {
  private db: any 

  constructor(dbPath: string) {
    this.db = LevelDB.open(dbPath)
  }

  public getOne(key: string, callback: (error: Error | null, result?: Metric | null) => void) {
    if(key != null){this.db.get(key,(err,res) => {
      if(err) callback(err,null);
      else callback(null,res);
    })}else callback(new Error("there is no key"), null);
  }

  public get(user: string, callback: (error: Error | null, result?: Metric[]) => void) {
    var Data = Array();
    const result = this.db.createReadStream()
    .on('data', function (data) {
      let MetricToGet: any;
      MetricToGet = Metric.fromDb(data.key,data.value);      
      if(MetricToGet.user === user) 
      Data.push(MetricToGet);      
    })
    .on('error', function (err) {
      callback(err,[]);
    })
    .on('close', function() {
      callback(null,Data)
    })
  }

  public save(key: string, metrics: any, callback: (error: Error | null) => void) {
    let metric = new Metric(metrics.metric_date,metrics.metric_value);
    this.db.put(`metrics:${key}:${metrics.metric_date}`, `${metrics.metric_value}`, (err: Error | null) => {
        callback(err)
    })
  }

  public delete(key: string, callback: (error: Error | null, result: any) => void) {
    this.db.del(key,(err: any,res: any) => {
      if(err) callback(err,null);
      else callback(null,res);
    });
  }
}
