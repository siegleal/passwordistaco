(function(){
	var weeks = [
		new Date("13 Sep 2015 00:00:00"),
		new Date("20 Sep 2015 00:00:00"),
		new Date("26 Sep 2015 00:00:00"),
		new Date("04 Oct 2015 00:00:00"),
		new Date("11 Oct 2015 00:00:00"),
		new Date("18 Oct 2015 00:00:00"),
		new Date("25 Oct 2015 00:00:00"),
		new Date("01 Nov 2015 00:00:00"),
		new Date("08 Nov 2015 00:00:00"),
		new Date("15 Nov 2015 00:00:00"),
		new Date("22 Nov 2015 00:00:00"),
		new Date("29 Nov 2015 00:00:00"),
		new Date("06 Dec 2015 00:00:00"),
		new Date("13 Dec 2015 00:00:00"),
		new Date("20 Dec 2015 00:00:00"),
		new Date("27 Dec 2015 00:00:00"),
		new Date("03 Jan 2016 00:00:00"),
	];
	

    $('#goButton').on('click', function(e){
        var id = $('#players').val();
        
        $.get('/points/' + id, function(data){
            var totals = data.points.map(function(element){
                return element.total;
            });
            $.get('/transactions', function(data){
                var playerName = $("#players").find(":selected").html();
                var transactions = data.transactions.filter(function(element){
                    return (element.player.name === playerName)});
                drawChart(totals, transactions);
            });


        });

    });


    $.get('/players', function(data){
        data.players.forEach(function(elem, index){

            $('#players').append('<option value="' + elem.cbsid + '">' + elem.name + '</option>');

        });

    });

    google.charts.load('current', {'packages':['annotatedtimeline']});
//    google.charts.setOnLoadCallback(drawChart);

    function drawChart(points, transactions) {
        var data = new google.visualization.DataTable();
        data.addColumn('date', 'Week');
        data.addColumn('number', 'Points');
        data.addColumn({type:'string', role:'annotation'});
        data.addColumn({type:'string', role:'annotationText'});

        points.forEach(function(elem, index){
            var trans = transactions.filter(function(e){return e.date.week === index + 1;});

            data.addRow([weeks[index], elem, undefined, undefined]);
            for (var i = 0; i < trans.length;i++){

            data.addRow([new Date(trans[i].date.date), elem, trans[i].type , trans[i].raw ]);
            };

        });


        var options = {
            title: 'Player Performance',
            displayAnnotations: true,
            legend: { position: 'bottom' }
        };

        var chart = new google.visualization.AnnotatedTimeLine(document.getElementById('chartcontent'));

                                                    chart.draw(data, options);
                                                          }
    

})();
