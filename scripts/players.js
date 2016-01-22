module.exports = function(req, res){

    var pos = req.params.pos;
    var utils = require('./mongooseutil');
    var Client = require('node-rest-client').Client;
    var client = new Client();

    var Player = mongoose.model('Player', utils.schemas.playerSchema);
    var errors = [];
    var onSave = function(err, user){
        if (err) {
            console.error(err);
            errors.push(err);
        }
    };

    var playerIdCallback = function(data, response){
        var idmap = JSON.parse(data).playerIds;
        console.log('**PLAYERS** '+ idmap.length + ' returned');
        var transCallback = function(err, transactions){
            if (err) return console.error(err);
            transactions.forEach(function(trans, index, arr){
                //this is where any manipulation goes

                var playername = trans.name.replace(' ', '').toLowerCase();
                if (trans.position === "D/ST"){
                    var team = trans.team.toLowerCase();
                    if (team === "wsh"){
                        team = 'was'
                    }
                    if (team === 'jax'){
                        team = 'jac';
                    }
                    playername = team.toLowerCase() + "d/st";
                }
                if (idmap[playername] === undefined){
                    console.log('**PLAYERS** could not find CBSid for: ' + playername);
                }
                trans.cbsid = idmap[playername];
                var player = new Player(trans);
                player.save(onSave);


            });
            if (errors.length == 0){ //avoid infinite loop 
                primed.push('players');
                performSearch();
            }else{
                res.json({errors: errors});
            }
        };

        //TODO do not call db, call api
        var Trans = mongoose.model('Transaction', utils.schemas.transactionSchema);
        console.log('**PLAYERS** making call to transactions collection');
        Trans.distinct('player',transCallback);


    };

    var findCallback = function(err, players){
        if (err) return console.error(err);
        if (players.length === 0){
            console.log("**PLAYERS** Database miss, sending request to /playerId");

            client.get("http://localhost:3000/playerid", playerIdCallback);
        }else{
            console.log('**PLAYERS** database hit');
            res.json({players: players});
        }

    }

    var performSearch = function(){
        if (pos){
            console.log('**PLAYERS** finding all players of position: ' + pos); 
            Player.find({position: pos}).select({__v:0}).sort({name: 'asc'}).exec(findCallback);
        }else{
            console.log('**PLAYERS** finding all players');
            Player.find().select({__v:0}).sort({name: 'asc'}).exec(findCallback);
        }
    }

    performSearch();

}
