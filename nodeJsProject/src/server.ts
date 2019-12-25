// Setup
import express = require('express')
import userRouter from './userRouter'
import metricsRouter from "./metricsRouter"
import session = require('express-session')
import levelSession = require('level-session-store')
import { join } from 'path'
import { UserHandler, User } from './user'

const app = express(),
  handles = require('./handles'),
  path = require('path'),
  bodyparser = require('body-parser');

// Config 
const port: string = process.env.PORT || '8080';
const LevelStore = levelSession(session)
const dbUser: UserHandler = new UserHandler(join(__dirname, '..', 'db', 'user'))
const authRouter = express.Router()

// Middlewares 
app.set('views', __dirname + "/views");
app.set('view engine', 'ejs');

app.use(bodyparser.json());
app.use(bodyparser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, "public")));
app.use(express.urlencoded({ extended: true }));
app.use(session({
  secret: 'my very secret phrase',
  store: new LevelStore(join(__dirname, '..', 'db', 'sessions')),
  resave: true,
  saveUninitialized: true
}))

/*
** Routers
*/

// Auth Router (Main)
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