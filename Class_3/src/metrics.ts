import {LevelDB} from './leveldb';
import WriteStream from 'level-ws';

export class Metric {
  public timestamp: string
  public value: number

  constructor(ts: string, v: number) {
    this.timestamp = ts
    this.value = v
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

  public get(callback: (error: Error | null, result?: Metric[]) => void) {
    var Data = Array();
    const result = this.db.createReadStream()
    .on('data', function (data) {
      Data.push(data);
    })
    .on('error', function (err) {
      callback(err,[]);
    })
    .on('close', function() {
      callback(null,Data)
    })
    .on('end', function () {
      console.log('Stream ended')
    })
  }

  public save(key: number, metrics: Metric[], callback: (error: Error | null) => void) {
    const stream = WriteStream(this.db)
    stream.on('error', callback)
    stream.on('close', callback)
    metrics.forEach((m: Metric) => {
      stream.write({ key: `metric:${key}${m.timestamp}`, value: m.value })
    })
    stream.end()
  }

  public delete(key: string, callback: (error: Error | null, result: any) => void) {
    this.db.del(key,(err: any,res: any) => {
      if(err) callback(err,null);
      else callback(null,res);
    });
  }
}
