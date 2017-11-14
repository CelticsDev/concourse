    /* 5 - SELECT A PLAYER */
    /*    for (i = 0; i < roster.length; i++) {
            var playerWrapHTML = '@import "../html/min/_player-wrap.min.html"';
            jQuery('.player-spotlight').append(playerWrapHTML);
            jQuery("div[data-pid='" + roster[i].pid + "'] .averages-season").html('<td><p>' + teamStats[roster[i].pid].avg.gp + '</p></td><td><p>' + teamStats[roster[i].pid].avg.pts + '</p></td><td><p>' + teamStats[roster[i].pid].avg.reb + '</p></td><td><p>' + teamStats[roster[i].pid].avg.ast + '</p></td>')
        }*/
jQuery('.player-spotlight .player-wrap:nth-child(1)').addClass("active");



// LOAD ROSTER (AND GET YEAR)
/*    jQuery.ajax({
        url: 'http://data.nba.com/data/v2015/json/mobile_teams/nba/' + rosterYear + '/teams/celtics_roster.json',
        async: false,
        success: function(data) {
            roster = data.t.pl;
        },
        error: function() {
            rosterYear--;
            jQuery.ajax({
                url: "http://data.nba.com/data/v2015/json/mobile_teams/nba/" + rosterYear + "/teams/celtics_roster.json",
                async: false,
                success: function(data) {
                    roster = data.t.pl;
                }
            });
        }
    });
    // LOAD TEAM STATS
    jQuery.ajax({
        url: 'http://data.nba.com/data/v2015/json/mobile_teams/nba/' + rosterYear + '/teams/celtics/player_averages_02.json',
        async: false,
        success: function(data) {
            for (var i = 0; i < data.tpsts.pl.length; i++) {
                teamStats[data.tpsts.pl[i].pid] = data.tpsts.pl[i]
            }
        },
        error: function() {
            rosterYear--;
            jQuery.ajax({
                url: 'http://data.nba.com/data/v2015/json/mobile_teams/nba/' + rosterYear + '/teams/celtics/player_averages_02.json',
                async: false,
                success: function(data) {
                    for (var i = 0; i < data.tpsts.pl.length; i++) {
                        teamStats[data.tpsts.pl[i].pid] = data.tpsts.pl[i]
                    }
                }
            });
        }
    });*/
bioData = '';
/*	jQuery.getJSON('http://io.cnn.net/nba/nba/.element/media/2.0/teamsites/celtics/misc/bioObj.json?', function(data) {
	    bioData = data;
	});*/