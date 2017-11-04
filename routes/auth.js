module.exports = auth;


function auth(app, randomstrings, userModel){
    var passport = require('passport');
    var FacebookTokenStrategy = require('passport-facebook-token');

    app.use(passport.initialize());
    app.use(passport.session());

    passport.serializeUser(function(user, done) {
        done(null, user);
    });

    passport.deserializeUser(function(obj, done) {
        done(null, obj);
    });

    passport.use(new FacebookTokenStrategy({
        clientID : "1451732064907035",
        clientSecret: "6f035af55e134f2d45574c3d61543c16",
    }, (accessToken, refreshToken, profile, done)=> {
        userModel.findOne({"_id": profile.id}, (err, user) => {
            if(err){
                console.log("auth.js: user find err");
                throw err;
            }
            if(!user){
                console.log("user not found => create new fb user");
                newUser = new userModel({
                    '_id': profile.id,
                    'name': profile.displayName,
                    'acessToken': profile.acessToken,
                    'token': randomString.generate(16),
                });

                newUser.save((err)=>{
                    if(err){
                        console.log("auth.js: user save err");
                        throw err;
                    }
                }).then((user)=>{
                    done(null, user);
                })
            }else{
                done(null, user);
            }
        });
    }));

    app.get('/', (req, res)=>{
        res.send("auth!");
    });


    app.get('/auth/fb/authenticate', passport.authenticate('facebook-token'), (req, res)=> {
        if(req.user) {
            console.log('user : ', req.user)
            userModel.findOne({'_id' : req.user.id}, (err, user) => {
                if(err) throw err;
                if(user) res.send(200, user)
                else res.send(400,"user not found")
            })
        }else{
            res.send(400,"user not found in request")
        }
    });

    app.get('/fb/callback', passport.authenticate('facebook-token', {
        successRedirect: '/',
        ailureRedirect: '/'
    }));

    app.post('/auth/login', (req, res)=> {
        var email = req.body.email;
        var pw = req.body.pw;

        userModel.findOne({'email': email}, (err, user) => {
            if(err){
                console.log("auth.js: user find err");
                throw err;
            }
            if(!user)
                res.send(400, "user not found");
            else{
                if(user.pw != pw){
                    res.send(400, "password error");
                }else{
                    res.send(200, user);
                }
            }
        });
    });

    app.post("/auth/register", (req, res)=> {
        console.log(req.body)
        var email = req.body.email;
        var pw = req.body.pw;
        var name = req.body.name;

        userModel.findOne({'email' : email}, (err, user)=>{
            if(err){
                console.log("auth.js: user find err");
                throw err;
            }
            if(user){
                res.send(400,"user exist");
            }else{
                var newUser = new userModel({
                    '_id' : randomString.generate({
                        length: 16,
                        charset: 'numeric'
                    }),
                    'name': name,
                    'pw': pw,
                    'email': email,
                    'token': randomString.generate(16),
                    'money': "0"
                });

                newUser.save((err) => {
                    if(err){
                        console.log("auth.js: user save err");
                        throw err;
                    }
                }).then((user)=>{
                    res.send(200, user)
                })
            }
        })
    });

    app.post("/auth/local/authenticate", (req, res)=>{
        var token = req.body.token;

        userModel.findOne({'token' : token}, (err, user) => {
            if(err){
                console.log("auth.js: user find err");
                throw err;
            }

            if(user){
                res.send(200, user);
            }else{
                res.send(400,"user not find");
            }
        });
    });
}