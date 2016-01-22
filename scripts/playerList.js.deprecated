module.exports = function(req, res){

    var utils = require('./mongooseutil');
    var Client = require('node-rest-client').Client;
    var PlayerList = mongoose.model('PlayerList', utils.schemas.playerListSchema);
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
        if (players.length === 0){
            var client = new Client();
            client.get(utils.cbsurl('players/list'), function(data, response){

                JSON.parse(data).body.players.forEach(function(player, index, arr){
                    console.log(player.fullname);
                    var name = player.fullname;
                    var pro_team = player.pro_team;
                    var position = player.position;
                    var id = player.id;

                    var p= new PlayerList({
                        name: name,
                        pro_team: pro_team,
                        position:position,
                        id: id

                    }); 

                    p.save(onSave);
                }); 


            });
           if (errors.length !== 0){
               PlayerList.find().exec(findCallback);
           }    
        }
        else{
            res.json({playerList: players});
        }
    };

    PlayerList.find().exec(findCallback);


}
