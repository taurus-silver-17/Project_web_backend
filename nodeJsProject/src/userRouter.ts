import express = require('express');
import { UserHandler, User } from './user'
import { join } from 'path'

const dbUser: UserHandler = new UserHandler(join(__dirname, "..", "db", "user"))
const userRouter = express.Router()

userRouter.post('/', (req: any, res: any, next: any) => {
  dbUser.get(req.body.username, function (err: Error | null, result?: User) {
    if (!err || result !== undefined) {
      res.status(409).send("user already exists")
    } else {
      dbUser.save(req.body, function (err: Error | null) {
        if (err) next(err)
        else res.redirect('/login');
      })
    }
  })
})

userRouter.get('/:username', (req: any, res: any, next: any) => {
  dbUser.get(req.params.username, function (err: Error | null, result?: User) {
    if (err || result === undefined) {
      res.status(404).send("user not found")
    } else {
      let Response = { ...result, password: null }
      res.status(200).json(Response)
    }
  })
})

userRouter.delete('/:username', (req: any, res: any, next: any) => {
  if (req.params.username == req.session.user.username) {
    dbUser.delete(req.params.username, function (err: Error | null | string, result?: User) {
      if (err) {
        res.status(404).send(err);
      }
      else {
        res.status(200).send(result);
      }
    })
  }
  else {
    res.status(401).send("You can only delete your account.");
  }
})

userRouter.put("/:username", (req: any, res: any, next: any) => {
  if (req.params.username === req.session.user.username) {
    dbUser.put(`${req.params.username}`, function (err: Error | null | string, result?: User) {
      if (err != null) {
        res.status(404).send(err)
      }
      else
        res.status(200).json(result);
    }, req.body ? req.body.email : undefined, req.body ? req.body.password : undefined)
  }
  else
    res.status(401).send("You can't do that.")
})

export default userRouter