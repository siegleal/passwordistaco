module.exports = function(req, res){
	
	var cheerio = require('cheerio');
	var jquery = require('jquery');
	var fs = require('fs');
    var utils = require('./mongooseutil');

    var Transaction = mongoose.model('Transaction', utils.schemas.transactionSchema);
    Transaction.find(function(err, transactions) {
        if (err) return console.error(err);
        console.log(transactions.length + " records found in db");
        if (transactions.length > 0){
            console.log('Returning transaction results from db');
            res.json({"transactions": transactions});

        }else{
            console.log('Performing scraping');
            scrape();
        };
        
    });

    var scrape = function(){

	var weeks = [
		new Date("15 Sep 2015 00:00:00"),
		new Date("22 Sep 2015 00:00:00"),
		new Date("28 Sep 2015 00:00:00"),
		new Date("06 Oct 2015 00:00:00"),
		new Date("13 Oct 2015 00:00:00"),
		new Date("20 Oct 2015 00:00:00"),
		new Date("27 Oct 2015 00:00:00"),
		new Date("03 Nov 2015 00:00:00"),
		new Date("10 Nov 2015 00:00:00"),
		new Date("17 Nov 2015 00:00:00"),
		new Date("24 Nov 2015 00:00:00"),
		new Date("01 Dec 2015 00:00:00"),
		new Date("08 Dec 2015 00:00:00"),
		new Date("15 Dec 2015 00:00:00"),
		new Date("22 Dec 2015 00:00:00"),
		new Date("29 Dec 2015 00:00:00"),
		new Date("05 Jan 2016 00:00:00"),
	];
	
	var safeMatch = function(str, reg){
    if (str.match(reg)){
        return str.match(new RegExp(reg))[0];
    }
    return "";
	}
	
	var parsePlayers = function(arr){
	
		var result = [];
		for (var i = 0; i < arr.length; i++){
			var current = arr[i];
				result.push({
					"name": current.match(/.*,/)[0].slice(0,-1).replace(' Jr.', '').replace(' Sr.','').replace('*',''),
					"team": current.match(/ \w{2,3} /)[0].trim().toUpperCase(),
					"position": current.match(/(QB|RB|WR|TE|K|D\/ST)/)[0]
				});
		}
		return result;
	}
	
	var extractTrans = function(detailsText){
		var arr = [];
		var regTeamLite = "WEST|TITS|CMEN|SERB|BUTT|BUST|JEW|JR|WPF|NUT";
		var regTeam = "(" + regTeamLite + ")";
		var regType = "(added|dropped|traded|drafted)";
		var regPlayer = "([A-Za-z'.]+ [A-Za-z'.\\-]+( Jr\\.| Sr\\.)?\\*?|\\w+ D.ST), \\w{2,3} (QB|RB|WR|TE|K|D\/ST)";
		var regFrom = "from (Free Agency|Waivers)";
		var regTo = "to (Bench|Waivers|" + regTeamLite + ")";
	
		var regTrans = regTeam + " " + regType + " " + regPlayer + "(, " + regPlayer + ")* ?(" + regFrom + ")* ?(" + regTo + ")*";
	
		var trans = detailsText.match(new RegExp(regTrans, 'g'));
	
		if (trans === null){
			console.log(detailsText);
			arr.push({
				"raw": detailsText,
				"regex": regTrans
			});
		}else{
			for (var i = 0; i < trans.length; i++){
				var details = trans[i];
				var players =  parsePlayers(details.match(new RegExp(regPlayer, 'g')));
				players.forEach(function(player){
					arr.push({
						"raw": details,
						"team": safeMatch(details, regTeam),
						"type": safeMatch(details, regType),
						"to": safeMatch(details, regTo).replace('to ',''),
						"from": safeMatch(details, regFrom).replace('from ', ''),
						"player": player
					});
				});
			}
		}
		return arr;
	};

	var getWeek = function(date){
		var i = 0;
		while (date >= weeks[i]){
		i++; 
		}
	
		return i + 1;
	
	}

	var file = fs.readFileSync(__dirname + '/../public/history.html', {"encoding": "UTF-8"});
    var $ = cheerio.load(file);
    var table = $('table.tableBody');
    var result = []
    $('table.tableBody tr').each(function(i, tr){
        if (i < 2) return;
        var children = $(this).children();
        var dateCell = children.eq(0);
        var detailsCell = children.eq(2);

        var dateString = dateCell.children().eq(0)["0"].prev.data
        var month = dateString.match(/[A-Z][a-z]{2}/g)[1];
        var day = dateString.match(/\d{1,2}/)[0];
        //hacky
        var year = (month == "Jan" ? 2016 : 2015);
        var time = dateCell.children().eq(0)["0"].next.data
        var date = Date.parse(day + " " + month + " " + year + " " + time);

        var transactions = extractTrans(detailsCell.text());
        for (var j = 0; j < transactions.length;j++){
            var data = {
                    "month": month,
                    "day": day,
                    "year": 2015,
                    "time": time,
                    "date": date,
                    "week": getWeek(date)
            }

            transactions[j].date = data;
            result.push(transactions[j]);
            var trans = new Transaction(transactions[j]);
            trans.save(function(err, trans){
                if (err) return console.error(err);
            });
        }
    });

    result.sort(function(a, b) {return a.date.date - b.date.date;});

    res.json({"transactions": result});

    };
	
}
