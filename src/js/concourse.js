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
        var playerWrapHTML = '@import "../html/min/_player-wrap.min.html"';
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