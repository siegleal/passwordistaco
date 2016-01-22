module.exports = function(req, res){
	function createCsv(arr){
		var result = "Timestamp,Week,Team, Player, PlayerTeam, Position, Type, To, From\n";
		arr.forEach(function(e){
			var date = new Date(e.date.date).toISOString();
			var data = [date,e.date.week,e.team,e.player.name, e.player.team, e.player.position, e.type, e.to, e.from];
			result += data.join(',') + '\n';
		});	
		return result;
	};
	
	var http = require('http');
	var options = {
		host: 'localhost',
		port: 3000,
		path: '/history',
		headers: {accept: 'application/json', charset: 'UTF-8'}
	}
	var x = http.request(options, function(httpres){
		var data = ""
		httpres.on('data', function(chunk){
			data += chunk.toString('utf8');
		});
		httpres.on('end', function(){
			var parsed = JSON.parse(data);
			var csv = createCsv(parsed.transactions);
			res.writeHead(200, {'Content-Type': 'text/csv'});
			res.write(csv);
			res.end();
		})
	});
	
	x.end();
}