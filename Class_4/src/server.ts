import express = require('express')
import metricsRouter from "./metricsRouter";
import session = require('express-session')
import levelSession = require('level-session-store')
import { UserHandler, User } from './user'

const LevelStore = levelSession(session)
const dbUser: UserHandler = new UserHandler('../db/users')
const authRouter = express.Router()

const app = express(),handles = require('./handles'), metrics = require("./metrics"), path = require('path'), bodyparser = require('body-parser');
const port: string = process.env.PORT || '8080';

app.set('views', __dirname + "/views");
app.set('view engine', 'ejs');
app.use(bodyparser.json());
app.use(bodyparser.urlencoded());

app.use(express.static(path.join(__dirname, "public")));
app.use(express.urlencoded({ extended: true }));
app.use(session({
  secret: 'my very secret phrase',
  store: new LevelStore('../db/sessions'),
  resave: true,
  saveUninitialized: true
}))

authRouter.get('/login', (req: any, res: any) => {
  res.render('login')
})

authRouter.get('/signup', (req: any, res: any) => {
  res.render('signup')
})

authRouter.get('/logout', (req: any, res: any) => {
  delete req.session.loggedIn
  delete req.session.user
  res.redirect('/login')
})

authRouter.post('/login', (req: any, res: any, next: any) => {  
  dbUser.get(req.body.username, (err: Error | null, result?: User) => {   
    if (err) next(err)
    if (result === undefined || !result.validatePassword(req.body.password)) {
      res.redirect('/login')
    } else {
      req.session.loggedIn = true
      req.session.user = result
      res.redirect('/')
    }
  })
})

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
      let Response = { ...result, password: null}
      res.status(200).json(Response)
    }
  })
})

userRouter.delete('/:username', (req: any, res: any, next: any) => {
  if (req.params.username == req.session.user.username) {
    dbUser.delete(req.params.username, function (err: Error | null | string, result?: User){
      if (err) {
        res.status(404).send(err);
      }
      else{
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
    dbUser.put(`${req.params.username}`,function(err: Error | null | string, result?: User) {
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


const authCheck = function (req: any, res: any, next: any) {
  if (req.session.loggedIn) {
    next()
  } else res.redirect('/login')
}

app.get('/', authCheck, (req: any, res: any) => {
  res.render('index', { name: req.session.username })
})

app.use("/", handles);
app.use(authRouter)
app.use('/user', userRouter)
app.use("/metrics", metricsRouter);

app.listen(port, (err: Error) => {
  if (err) {
    throw err
  }
  console.log(`server is listening on http://localhost:${port}`)
})