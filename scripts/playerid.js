module.exports = function(req, res){

    var playername = req.params.fullname;

    var utils = require('./mongooseutil');
    var Client = require('node-rest-client').Client;
    var PlayerId = mongoose.model('PlayerId', utils.schemas.playerListSchema);
    var errors = [];
    var results = [];

    var onSave = function(err, user){
        if (err) {
            console.error(err);
            errors.push(err);
        }
    };

    var findCallback = function(err, players){
        if (err) return console.error(err);
        if (players.length ===0){
            console.log('**player-id** making call to cbs');
            var client = new Client();
            client.get(utils.cbsurl('players/list'), function(data, response){

                console.log('**PLAYERID** parsing players');
                JSON.parse(data).body.players.forEach(function(player, index, arr){
                    var name = player.fullname.replace(' ','').toLowerCase();
                    var pro_team = player.pro_team;
                    var position = player.position;
                    if (position === "DST"){
                        name = pro_team.toLowerCase() + "d/st";
                    }
                    var id = player.id;

                    var p= new PlayerId({
                        name: name,
                        pro_team: pro_team,
                        position:position,
                        id: id

                    }); 

                    p.save(onSave);
                }); 
                if (errors.length === 0){
                    primed.push('playerid');
                    performSearch();
                }    
                else{
                    console.log('**PLAYERID** ' + errors);
                    res.status(500).send(errors);
                }


            });
        }
        else{
            var result = {};
            players.forEach(function(player, index, arr){
                result[player.name] = player.id;
            });
            res.json({playerIds: result});
        }
    };

    var performSearch = function(){
        if (playername){
            console.log('**PLAYERID** searching for playerid of: ' + playername);
            PlayerId.find({name: playername}).exec(findCallback);
        }else{
            console.log('**PLAYERID** searching for all playerids');
            PlayerId.find().exec(findCallback);
        }
    }

    performSearch();


}
