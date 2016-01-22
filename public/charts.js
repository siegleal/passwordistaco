(function(){

    google.load('visualization', '1', {'packages': ['corechart']});

    // Set a callback to run when the Google Visualization API is loaded.
    google.setOnLoadCallback(drawChart);
    // Callback that creates and populates a data table,
    // instantiates the pie chart, passes in the data and
    // draws it.
    function drawChart() {
        $.get("/transactions", function(data){
                fillChart(data);
        }
        );

    }
    var fillChart = function(json){
        var transactions = json.transactions;
        
        function getAddsByWeekAndTeam(week, team){
            return function(value){
                return value.team === team && value.date.week === week && value.type === "added";
            }
        }
        function getAddsByWeek(week){
            return function(value){
                return value.date.week === week && value.type === "added";
            }
        }


        var data = new google.visualization.DataTable();
        data.addColumn('string', 'Week');
        data.addColumn('number', 'WEST');
        data.addColumn('number', 'JEW');
        data.addColumn('number', 'JR');
        data.addColumn('number', 'SERB');
        data.addColumn('number', 'TITS');
        data.addColumn('number', 'NUT');
        data.addColumn('number', 'BUST');
        data.addColumn('number', 'BUTT');
        data.addColumn('number', 'CMEN');
        data.addColumn('number', 'WPF');

        var rows = [];
        for (var i = 1; i < 13; i++){
            var names = ['WEST', 'JEW', 'JR', 'SERB', 'TITS', 'NUT', 'BUST', 'BUTT', 'CMEN', 'WPF'];
            var row = ['Week ' + i];
            for (var j = 0; j < names.length; j++){
               row.push(transactions.filter(getAddsByWeekAndTeam(i, names[j])).length); 
            }
            rows.push(row);
        }
        data.addRows(rows);

        var options = {
            title: 'Adds by Week',
            height: 800,
            isStacked: true,
            hAxis: {
                title: 'Week',
            },
            vAxis: {
                title: 'Adds'
            }
        };

        var chart = new google.visualization.BarChart(
                document.getElementById('chartcontent'));

        chart.draw(data, options);
    }

})();
