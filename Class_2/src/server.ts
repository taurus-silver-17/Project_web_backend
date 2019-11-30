import express = require('express')
import { MetricsHandler } from './metrics'

const app = express(),handles = require('./handles'), metrics = require("./metrics"), path = require('path');
const port: string = process.env.PORT || '8080'

app.set('views', __dirname + "/views")
app.set('view engine', 'ejs')


app.use(express.static(path.join(__dirname, "public")));
app.use(express.urlencoded({ extended: true }));

app.use("/", handles);

app.get('/metrics.json', (req: any, res: any) => {
  MetricsHandler.get((err: Error | null, result?: any) => {
    if (err) {
      throw err
    }
    res.json(result)
  })
})

app.listen(port, (err: Error) => {
  if (err) {
    throw err
  }
  console.log(`server is listening on port ${port}`)
})