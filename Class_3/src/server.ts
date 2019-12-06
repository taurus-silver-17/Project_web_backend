import express = require('express')
import { MetricsHandler } from './metrics'

const app = express(),handles = require('./handles'), metrics = require("./metrics"), path = require('path'), bodyparser = require('body-parser');
const port: string = process.env.PORT || '8080';
const dbMet: MetricsHandler = new MetricsHandler('./db/metrics');

app.set('views', __dirname + "/views");
app.set('view engine', 'ejs');


app.use(express.static(path.join(__dirname, "public")));
app.use(express.urlencoded({ extended: true }));

app.use(bodyparser.json());
app.use(bodyparser.urlencoded());

app.use("/", handles);

app.get('/metrics/:id', (req: any, res: any) => {
  dbMet.getOne(req.params.id,(err: Error | null, result?: any) => {
    if (err) throw err
    res.status(200).send()
  })
})

app.get('/metrics.json', (req: any, res: any) => {
  dbMet.get((err: Error | null, result?: any) => {
    if (err) {
      throw err
    }
    res.json(result)
  })
})

app.delete("/metrics/:id", (req: any, res: any) => {
  dbMet.delete(req.params.id, (err: Error | null, result: any) => {
    if(err) res.send({err: err});
    else res.status(200).send("saved");
  })
})

app.post('/metrics/:id', (req: any, res: any) => {
  dbMet.save(req.params.id, req.body, (err: Error | null) => {
    if (err) throw err
    res.status(200).send()
  })
})

app.listen(port, (err: Error) => {
  if (err) {
    throw err
  }
  console.log(`server is listening on port ${port}`)
})