import express = require('express');
import { MetricsHandler } from "./metrics";

const dbMet: MetricsHandler = new MetricsHandler("./db/metrics");
const metricsRouter: express.Router = express.Router();

metricsRouter.get("/:id", (req: any, res: any) => {
  dbMet.getOne(`metric:${req.session.user.username}:${req.params.id}`, (err: Error | null, result?: any) => {
    if (err) {
        res.status(500).send(err);
    } else 
        res.status(200).send(result);
  });
});
metricsRouter.get("/", (req: any, res: any) => {
  dbMet.get(req.session.user.username, (err: Error | null, result?: any) => {
    if (err) {
        res.status(500).send(err);
    } else 
        res.status(200).send(result);
  });
});

metricsRouter.post("/:id", (req: any, res: any) => {
  dbMet.save(`${req.session.user.username}:${req.params.id}`, req.body, (err: Error | null) => {
    if (err) 
        res.status(500).send(err);
    else
        res.status(200).send();
  });
});

metricsRouter.delete("/:id", (req: any, res: any) => {
  dbMet.delete(`metric:${req.session.user.username}:${req.params.id}`, (err: Error | null, result: any) => {
    if (err) 
        res.status(500).send({ err: err });
    else 
        res.status(200).send("saved");
  });
});

export default metricsRouter;