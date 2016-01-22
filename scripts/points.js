module.exports = function(req, res){

    var player_id = req.params.id;
    var week = req.params.week;
    var utils = require('./mongooseutil');
    var Client = require('node-rest-client').Client;
    var client = new Client();

    var Points = mongoose.model('Points', utils.schemas.pointsSchema);
    var errors = [];
    var onSave = function(err, user){
        if (err) {
            console.error(err);
            errors.push(err);
        }
    };

    var findCallback = function (err, points){
        if (err) return console.error(err);
        if (points.length === 0){
            //read from file
            client.get('http://localhost:3000/' + week + '.json',
                    function(data, response){
                        var jsondata = data.body.player_stats;

                        var playerdata = jsondata[player_id];
                        if (playerdata === undefined) playerdata = {};
                        playerdata[player_id] = player_id;
                        playerdata[week] = week;
                        var point = new Points(playerdata);

                        //compute points
                        //multiplied by 100 for js rounding errors
                        var sum = 0;
                        sum += point.RuYd * 10;
                        sum += point.RuTD * 600;
                        sum += point.Ru2P * 200;
                        sum += point.ReYd * 10;
                        sum += point.ReTD * 600;
                        sum += point.Re2P * 200;
                        sum += point.FL * -200;
                        sum += point.PaYd * 4;
                        sum += point.PaTD * 600;
                        sum += point.Pa2P * 200;
                        sum += point.PaInt * -200;
                        sum += point.DTD * 600;

                        point.total = sum / 100;
                        
                        point.save(onSave);
                        res.json({points: point});
                    });
        }
        else{
            res.json({points: points[0]});
        }

    }

    if (player_id && week){
        //should check to see if player_id is in possible player ids
        Points.find({player_id:player_id, week:week}).exec(findCallback);
    }
    else if (player_id){
        var helper = function(currentweek, pointsData){
            if (currentweek === 18){
                res.json(pointsData);
            }
            else{
            client.get('http://localhost:3000/points/' + player_id + '/' + currentweek, function(data, response){
                    data = JSON.parse(data.toString('utf8'));
                    pointsData.points.push(data.points);
                    pointsData.seasontotal += data.points.total;
                    helper(currentweek + 1, pointsData);
                    });
            }
        }
        helper(1, {seasontotal:0, points:[]});
    }else{
        res.send(400, "Sorry");
    }


}
