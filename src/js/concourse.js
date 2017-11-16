jQuery(document).ready(function() {
    /*========================================
    =            LOAD STATIC DATA            =
    ========================================*/
    var rosterObj = '';
    var playerSpotlightCounter = 10;
    var date = new Date();
    /* beautify preserve:start */
    var roster =
        @import "../js/data/rosterObj.js";
    var teamStats =
        @import "../js/data/teamStats.js";
    var bioObj =
        @import "../js/data/bioObj.js";
    /* beautify preserve:end */

    // APPEND: TIMELINE
    var seasonsPlayed = rosterObj[pid].stats.seasonAvg.length;
    var timelineHTML = '';
    var seasonYearHTML = '';
    for (i = 0; i < seasonsPlayed; i++) {
        var teamAbbreviation = rosterObj[pid].stats.seasonAvg[i].ta;
        var traded = rosterObj[pid].stats.seasonAvg[i].spl.length;
        var segmentInner = "";
        var title = "";
        var seasonYearText = rosterObj[pid].stats.seasonAvg[i].val;
        if (rosterObj[pid].stats.hasStats == false) {
            seasonYearText = "";
        }
        if (i === 0 || teamAbbreviation !== rosterObj[pid].stats.seasonAvg[i - 1].ta) { // If this is a new team, start the team wrap.
            title = teamAbbreviation;
        }
        if (traded) {
            for (var x = 0; x < traded; x++) {
                var gpTot = rosterObj[pid].stats.seasonAvg[i].gp;
                var gp = rosterObj[pid].stats.seasonAvg[i].spl[x].gp;
                var gpPercentage = Math.round((gp / gpTot) * 100);
                teamAbbreviation = rosterObj[pid].stats.seasonAvg[i].spl[x].ta;
                if (i === 0 || teamAbbreviation !== rosterObj[pid].stats.seasonAvg[i - 1].ta && teamAbbreviation !== rosterObj[pid].stats.seasonAvg[i + 1].ta) { // If this is a new team, start the team wrap.
                    title = teamAbbreviation;
                } else {
                    title = "";
                }
                segmentInner += '<div data-season-year="' + seasonYearText + '" data-team="' + teamAbbreviation + '" style="" class="segment-inner ' + teamAbbreviation + '-bg"><p>' + title + '</p></div>';
            }
        } else {
            segmentInner = '<div data-season-year="' + seasonYearText + '" data-team="' + teamAbbreviation + '" class="segment-inner ' + teamAbbreviation + '-bg"><p>' + title + '</p></div>';
        }
        timelineHTML += '<div class="segment">' + segmentInner + '</div>';
        seasonYearHTML += '<div class="segment"><p>' + seasonYearText + '</p></div>';
    }
    jQuery("." + pid + " .timeline-wrap").html('<div class="timeline">' + timelineHTML + '</div><div class="season-year">' + seasonYearHTML + '</div>')

    /*=================================================
    =            SOCIAL => PLAYERSPOTLIGHT            =
    =================================================*/
    playerSpotlight(roster, bioObj, teamStats, playerSpotlightCounter);
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
function playerSpotlight(roster, bioObj, teamStats, playerSpotlightCounter) {
    /* 1 - WHITE LINE HORIZTONAL */
    setTimeout(function() {
        jQuery('.white-line.horizontal').addClass('transition');
    }, 500);
    setTimeout(function() {
        jQuery('.social-top .white-line.vertical:nth-child(odd)').addClass('transition');
        jQuery('.social-bottom .white-line.vertical:nth-child(even)').addClass('transition');
    }, 800);
    /* 2b - WHITE LINE VERTICAL */
    setTimeout(function() {
        jQuery('.social-top .white-line.vertical:nth-child(even)').addClass('transition');
        jQuery('.social-bottom .white-line.vertical:nth-child(odd)').addClass('transition');
    }, 1000);
    setTimeout(function() {
        jQuery('.social-top, .social-bottom').fadeOut(100);
        jQuery('.player-box-wrap').fadeTo(100, 1);
    }, 1200);
    /* 4 - APPEND HEADSHOTS */
    setTimeout(function() {
        jQuery('.player-box-wrap, .player-box').addClass("transition");
        var delay = 0;
        for (i = 0; i < roster.length; i++) {
            var headshot = 'https://ak-static.cms.nba.com/wp-content/uploads/headshots/nba/latest/1040x760/' + roster[i].pid + '.png';
            jQuery('.player-box:nth-child(' + (i + 1) + ')').append('<img class="headshot" src="' + headshot + '"/>');
            jQuery('.player-box:nth-child(' + (i + 1) + ')').attr('data-pid', roster[i].pid);
            jQuery('.player-box img').on("error", function() {
                jQuery(this).attr('src', 'https://i.cdn.turner.com/nba/nba/.element/media/2.0/teamsites/celtics/media/generic-player-light_600x438.png');
            });
            jQuery('.player-box:nth-child(' + (i + 1) + ') img').delay(delay).fadeTo(300, 1);
            delay += 30;
        }
    }, 1300);
    /* 5 - PLAYER SELECT */
    setTimeout(function() {
        jQuery('.player-box').addClass('transition-2');
        jQuery('.player-box:nth-child(' + (playerSpotlightCounter + 1) + ')').addClass('selected');
        jQuery('.player-box').not('.replacement.selected').delay(500).fadeTo(100, 0);
    }, 2000);
    /* 6 - PLAYER BOX EXPAND */
    setTimeout(function() {
        jQuery('.block-wrap.social').addClass('transition-3');
        jQuery('.player-box.replacement.selected').addClass('transition-3');
    }, 3000);
    /* 7 - SPOTLIGHT HTML */
    setTimeout(function() {
        jQuery('.player-box.replacement.selected').clone().appendTo('.block-wrap.player-spotlight .top-wrap');
        jQuery('.block-wrap.player-spotlight').show();
        jQuery('.block-wrap.social').hide();
        var stats = teamStats.tpsts.pl.filter(function(player) {
            return player.pid == roster[playerSpotlightCounter].pid;
        });
        jQuery('.player-spotlight .top-wrap .player-top').append(' <img class="silo" src="http://io.cnn.net/nba/nba/.element/media/2.0/teamsites/celtics/media/silo-466x591-' + roster[playerSpotlightCounter].pid + '.png"/><div class="top"><div class="player-name-wrap"><p class="player-name"><span>' + roster[playerSpotlightCounter].fn.toUpperCase() + '</span><br> ' + roster[playerSpotlightCounter].ln.toUpperCase() + '</p></div><p class="player-number">' + roster[playerSpotlightCounter].num + '</br><span>' + roster[playerSpotlightCounter].pos + '</span></p></div>   <div class="middle"><ul class="info clearfix"><li><p>AGE<span class="sm-hide">:&nbsp;</span></br><span class="info-value">' + playerAge(roster[playerSpotlightCounter].dob) + '</span></p></li><li><p>HT<span class="sm-hide">:&nbsp;</span></br><span class="info-value">' + roster[playerSpotlightCounter].ht + '</span></p></li><li><p>WT<span class="sm-hide">:&nbsp;</span></br><span class="info-value">' + roster[playerSpotlightCounter].wt + '</span></p></li></ul></div><div class="bottom full clearfix sm-hide"><table class="averages"><tr class="averages-labels"><td><p>GP</p></td><td><p>PPG</p></td><td><p>RPG</p></td><td><p>APG</p></td></tr><tr class="averages-season"><td class="gp"><p></p></td><td class="pts"><p></p></td><td class="reb"><p></p></td><td class="ast"><p></p></td></tr></table></div>');
        jQuery(".player-spotlight .averages-season").html('<td><p>' + stats[0].avg.gp + '</p></td><td><p>' + stats[0].avg.pts + '</p></td><td><p>' + stats[0].avg.reb + '</p></td><td><p>' + stats[0].avg.ast + '</p></td>')
        jQuery('.player-spotlight .player-name').fadeTo(200, 1);
        var playerFacts = bioObj[roster[playerSpotlightCounter].pid].personal;
        for (var i = 0; i < 3; i ++){
            var factIndex = Math.floor(Math.random() * playerFacts.length);
            jQuery('.player-spotlight .bottom-wrap').append('<div class="dyk-box"><p>' + playerFacts[factIndex] + '</p></div>');
        };
        jQuery('.player-spotlight .bottom-wrap').addClass('transition-1');
        setTimeout(function(){
            jQuery('.player-spotlight .bottom-wrap .dyk-box:nth-of-type(2)').addClass('transition-1');
        },8000)
        setTimeout(function(){
            jQuery('.player-spotlight .bottom-wrap .dyk-box:nth-of-type(3)').addClass('transition-1');
        },16000)
    }, 3600);
    /* 8 - SPOTLIGHT SLIDE IN */
    setTimeout(function() {
        jQuery('.player-spotlight .player-top .player-name, .player-spotlight .player-name-wrap, .player-spotlight .headshot, .player-spotlight .info, .player-spotlight .silo, .player-spotlight .averages, .player-spotlight .player-number').addClass('transition-1');
        setTimeout(function() {
            jQuery('.block-wrap.player-spotlight .player-box').remove();
        }, 4000);
        if (playerSpotlightCounter < 16) {
            playerSpotlightCounter++;
        } else {
            playerSpotlightCounter = 0;
        }
    }, 4100);
}

function statsNotAvailable(pid) {
    rosterObj[pid].stats.careerAvg = {};
    rosterObj[pid].stats.seasonAvg = [{}];
    rosterObj[pid].stats.hasStats = false;
    var caIndex = ['gp', 'gs', 'min', 'fgp', 'tpp', 'ftp', 'oreb', 'dreb', 'reb', 'ast', 'stl', 'blk', 'tov', 'pf', 'pts', 'nostats'];
    var saIndex = ['tid', 'val', 'gp', 'gs', 'min', 'fgp', 'tpp', 'ftp', 'oreb', 'dreb', 'reb', 'ast', 'stl', 'blk', 'tov', 'pf', 'pts', 'spl', 'ta', 'tn', 'tc'];
    for (var i = 0; i < saIndex.length; i++) {
        rosterObj[pid].stats.seasonAvg[0][saIndex[i]] = "N/A";
        if (i === 1) {
            rosterObj[pid].stats.seasonAvg[0][saIndex[i]] = playerCardYear.toString().substr(2, 2) + "-" + (playerCardYear + 1).toString().substr(2, 2);
        }
        if (i === 17) {
            rosterObj[pid].stats.seasonAvg[0][saIndex[i]] = [];
        }
        if (i === 18) {
            rosterObj[pid].stats.seasonAvg[0][saIndex[i]] = 'BOS';
        }
    }
    for (var i = 0; i < caIndex.length; i++) {
        rosterObj[pid].stats.careerAvg[caIndex[i]] = "N/A";
        if (i === 15) {
            rosterObj[pid].stats.careerAvg[caIndex[i]] = true;
        }
    }
}

/*=====================================================
=            LOAD PLAYER INFO => rosterObj            =
=====================================================*/


function loadPlayerInfo(pid) {
    var playerCard = '';
    var roster = '';
    jQuery.ajax({ // CHECK IF PLAYERCARDS ARE AVAILABLE FOR CURRENT YEAR. IF NOT, RETURN PREVIOUS YEAR.
        url: "http://data.nba.com/data/v2015/json/mobile_teams/nba/" + playerCardYear + "/players/playercard_" + pid + "_02.json",
        async: false,
        success: function(data) {
            playerCard = data.pl;
            rosterObj[pid].stats.hasStats = true;
            rosterObj[pid].info.draftYear = playerCard.dy;
            rosterObj[pid].stats.careerAvg = playerCard.ca;
            if (rosterObj[pid].stats.careerAvg.hasOwnProperty("sa")) {
                rosterObj[pid].stats.seasonAvg = playerCard.ca.sa;
            } else {
                statsNotAvailable(pid);
            }
        },
        error: function() {
            statsNotAvailable(pid);
        }
    })
};
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
function social(roster) {};
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