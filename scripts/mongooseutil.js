var mongoose = require('mongoose');
var Client = require('node-rest-client').Client;
var client = new Client();

module.exports = {
    url: 'mongodb://localhost:27017/fantasy',
    cbsurl: function(endpoint, options){
        return "http://api.cbssports.com/fantasy/" + endpoint + "?version=3.0&SPORT=football&response_format=json" + (options !== undefined ? "&" + options : "");
                },
    "schemas": {
        "transactionSchema": mongoose.Schema({
            "raw": String,
            "team": String,
            "type": String,
            "to": String,
            "from": String,
            "date": {
                month: String,
                day: String,
                year: Number,
                time: String,
                date: Date,
                week: Number
            },
            "player": {
                name: String,
                team: String,
                position: String
            }
        }),
        userSchema: mongoose.Schema({
            name: String,
            abbr: String
        }),
        playerSchema: mongoose.Schema({
            name: String,
            position: String,
            cbsid: String,
            team: String,
        }),
        playerListSchema: mongoose.Schema({
            name: String,
            id: String,
            position: String,
            pro_team: String,
        }),
        pointsSchema: mongoose.Schema({
            player_id: String,
            week: String,
            total: {type:Number, default:0},
            RuYd: {type:Number, default:0},
            RuTD: {type:Number, default:0},
            Ru2P:{type:Number, default:0},
            ReYd: {type:Number, default:0},
            ReTD: {type:Number, default:0},
            Re2P:{type:Number, default:0},
            PaYd: {type:Number, default:0},
            PaTD: {type:Number, default:0},
            Pa2P:{type:Number, default:0},
            PaInt: {type:Number, default:0},
            DTD: {type:Number, default:0},
            FL: {type:Number, default:0}
        })
    }
}
