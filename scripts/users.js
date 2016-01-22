module.exports = function(req, res){

    var results = [];
    var mongoose = require('mongoose');
    var utils = require('./mongooseutil');
    var db = mongoose.createConnection(utils.url);
    db.on('error', console.error.bind(console, 'connection error:'));

    //prime users
    var User = mongoose.model('User', utils.schemas.userSchema);
    var onSave = function(err, user){
        if (err) {console.error(err);}
    };

    var callback = function(err, users){
        if (users.length > 0){
            res.json({users: users});
        }else{
            var users = [
                new User({name: "Nick", abbr: "WEST"}),
                new User({name: "Andrew", abbr: "TITS"}),
                new User({name: "Thomas", abbr: "WPF"}),
                new User({name: "Eric", abbr: "BUST"}),
                new User({name: "Aly", abbr: "BUTT"}),
                new User({name: "Alex", abbr: "CMEN"}),
                new User({name: "Erica", abbr: "JR"}),
                new User({name: "Steve", abbr: "SERB"}),
                new User({name: "Michael", abbr: "NUT"}),
                new User({name: "Joel", abbr: "JEW"}),
            ];
            users.forEach(function(user, index, arr){
                user.save(onSave);
            });

            res.json({users: users});

        }
    };

    User.find().select({ name:1, abbr: 1}).exec(callback);
}
