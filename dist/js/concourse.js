jQuery(document).ready(function() {
    /*========================================
    =            LOAD STATIC DATA            =
    ========================================*/
    var roster = '';
    var teamStats = {};
    var bioData = {};
    var date = new Date();
    var rosterYear = date.getFullYear();
    // LOAD ROSTER (AND GET YEAR)
    jQuery.ajax({
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
    });
    // LOAD BIO OBJECT
    bioData = '';
    /*	jQuery.getJSON('http://io.cnn.net/nba/nba/.element/media/2.0/teamsites/celtics/misc/bioObj.json?', function(data) {
    	    bioData = data;
    	});*/
    /*    playerSpotlight(roster, bioData, teamStats);
        var playerCounter = 2;
        setInterval(function() {
            jQuery('.player-spotlight').css('right', '0%');
            setTimeout(function() {
                jQuery('.player-spotlight').css('right', '100%');
            }, 2000);
            setTimeout(function() {
                jQuery('.player-spotlight').hide();
                jQuery('.player-spotlight').css('right', '-100%');
            }, 5000);
            setTimeout(function() {
                jQuery('.player-spotlight').show();
                jQuery('.player-spotlight .player-wrap').removeClass("active");
                jQuery('.player-spotlight .player-wrap:nth-child(' + playerCounter + ')').addClass("active");
                if (playerCounter == roster.length) {
                    playerCounter = 1;
                } else {
                    playerCounter++;
                }
            }, 9000)
        }, 10000);*/
    setTimeout(function() {
        jQuery('.social .top-wrap, .social .bottom-wrap, .social-top, .social-bottom').addClass('transition');
        jQuery('.player-spotlight .player-wrap:nth-child(' + playerCounter + ')').addClass("active");
        if (playerCounter == roster.length) {
            playerCounter = 1;
        } else {
            playerCounter++;
        }
    }, 1500)
});
/*======================================
=            MISC FUNCTIONS            =
======================================*/
function playerAge(dob) {
    var today = new Date();
    var birthDate = new Date(dob);
    var age = today.getFullYear() - birthDate.getFullYear();
    return age;
}
/*========================================
=            PLAYER SPOTLIGHT            =
========================================*/
function playerSpotlight(roster, bioObj, teamStats) {
    // GENERATE PLAYER-WRAPS
    for (i = 0; i < roster.length; i++) {
        var playerWrapHTML = '<div class="player-wrap" data-pid="' + roster[i].pid + '"><div class="top-wrap"><div class="player-top"><img src="http://io.cnn.net/nba/nba/.element/media/2.0/teamsites/celtics/media/silo-trimmed-' + roster[i].pid + '.jpg"><div class="top"><p class="player-name"><span>' + roster[i].fn.toUpperCase() + '&nbsp;</span><br>' + roster[i].ln.toUpperCase() + '</p><p class="player-number">' + roster[i].num + '<br><span>' + roster[i].pos + '</span></p></div><div class="middle"><ul class="info clearfix"><li><p>AGE<span class="sm-hide">:&nbsp;</span><br><span class="info-value">' + playerAge(roster[i].dob) + '</span></p></li><li><p>HT<span class="sm-hide">:&nbsp;</span><br><span class="info-value">' + roster[i].ht + '</span></p></li><li><p>WT<span class="sm-hide">:&nbsp;</span><br><span class="info-value">' + roster[i].wt + '</span></p></li></ul></div><div class="bottom full clearfix sm-hide"><table class="averages"><tr class="averages-labels"><td><p>GP</p></td><td><p>PPG</p></td><td><p>RPG</p></td><td><p>APG</p></td></tr><tr class="averages-season"><td class="gp"><p></p></td><td class="pts"><p></p></td><td class="reb"><p></p></td><td class="ast"><p></p></td></tr></table></div></div></div><div class="bottom-wrap"></div></div>';
        jQuery('.player-spotlight').append(playerWrapHTML);
        jQuery("div[data-pid='" + roster[i].pid + "'] .averages-season").html('<td><p>' + teamStats[roster[i].pid].avg.gp + '</p></td><td><p>' + teamStats[roster[i].pid].avg.pts + '</p></td><td><p>' + teamStats[roster[i].pid].avg.reb + '</p></td><td><p>' + teamStats[roster[i].pid].avg.ast + '</p></td>')
    }
    jQuery('.player-spotlight .player-wrap:nth-child(1)').addClass("active");
    // CHANGE THE DID YOU KNOW THING
}
/*==================================
=            HIGHLIGHTS            =
==================================*/
function highlights() {};
/*====================================
=            STAT LEADERS            =
====================================*/
function statLeaders() {};
/*==============================
=            SOCIAL            =
==============================*/
function social() {};
/*==================================
=            MOBILE APP            =
==================================*/
function mobileApp() {};
/*=================================
=            STANDINGS            =
=================================*/
function standings() {};
/*=========================================
=            AROUND THE LEAGUE            =
=========================================*/
function aroundTheLeague() {};