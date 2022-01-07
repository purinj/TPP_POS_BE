const {
    Router
} = require('express');
 const Employee  = require('../model/Employee')
const cookieSession = require('cookie-session')
const bodyParser = require('body-parser')
const passport = require('passport')
const LocalStrategy = require('passport-local').Strategy;
const { session } = require('passport');
const router = Router();
const authMiddleware = (req, res, next) => {
    console.log('Middleware', req.isAuthenticated());
    if (!req.isAuthenticated()) {
        res.status(401).send('You are not authenticated')
    } else {
        return next()
    }
}
router.use(cookieSession({
    name: 'mysession',
    keys: ['vueauthrandomkey'],
    maxAge: 24 * 60 * 60 * 1000 // 24 hours 
}))
router.use(passport.initialize());
router.use(passport.session());
router.use(bodyParser.json());


router.post("/login", (req, res, next) => {
    passport.authenticate('local', (err, user, info) => {
        if (err) {
            return next(err);
        }

        if (!user) {
            return res.status(400).send([user, "Cannot log in", info])
        }


        req.login(user, (err) => {
            console.log('req = ', user);
            res.send("Logged in")
        })
    })(req, res, next)
})

router.post("/user", authMiddleware, async (req, res) => {
    try {
        employee = new Employee
        let user = await employee.selectById(req.session.passport.user)
        console.log([user, req.session])
        res.send({
            user: user
        })
    } catch (err) {
        console.log('user Err', err);
    } 
  
})

router.get('/logout', function (req, res) {
    req.logout();
    console.log("logged out")
    res.clearCookie(['vueauthrandomkey'])
    return res.send();
});

passport.use(new LocalStrategy({
        usernameField: 'email',
        passwordField: 'password'
    },
    async (username, password, done) => {
        employee = new Employee
        let user = await employee.AuthenUser(username, password)
        if (user) {
            done(null, user)
        } else {
            done(null, false, {
                message: 'Incorrect username or password'
            })
        }
    }
))

passport.serializeUser((user, done) => {
    console.log('user = ',user);
    console.log('done = ',done);
    done(null, user.employee_id)
})

passport.deserializeUser(async (id, done) => {
    employee = new Employee
    let user = await employee.selectById(id)
    done(null, user)
})



module.exports = router;