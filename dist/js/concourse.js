(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
'use strict';

var rosterObj = {
    celtics: {
        roster: {},
        leaders: {
            pts: [['--', '--', '--', '--'], ['--', '--', '--', '--'], ['--', '--', '--', '--']],
            ast: [['--', '--', '--', '--'], ['--', '--', '--', '--'], ['--', '--', '--', '--']],
            reb: [['--', '--', '--', '--'], ['--', '--', '--', '--'], ['--', '--', '--', '--']]
        }
    },
    away: {
        roster: {},
        leaders: {
            pts: [['--', '--', '--', '--'], ['--', '--', '--', '--'], ['--', '--', '--', '--']],
            ast: [['--', '--', '--', '--'], ['--', '--', '--', '--'], ['--', '--', '--', '--']],
            reb: [['--', '--', '--', '--'], ['--', '--', '--', '--'], ['--', '--', '--', '--']]
        }
    }
};

jQuery(document).ready(function () {
    var gid = '';
    var awayTeam = '';
    var gameStarted = false;
    var playerSpotlightCounter = 10;
    var date = new Date();
    jQuery.ajax({
        url: 'http://localhost:8888/data/mobile-stats-feed/todays_scores.json',
        async: false,
        success: function success(todaysScoresData) {
            for (var i = 0; i < todaysScoresData.gs.g.length; i++) {
                if (todaysScoresData.gs.g[i].h.ta == 'ORL') {
                    //CHANGE THIS
                    awayTeam = todaysScoresData.gs.g[i].v.ta;
                    loadRosterData(awayTeam);
                    gid = todaysScoresData.gs.g[i].gid;
                    initMobileApp();
                    mobileApp();
                    standings(awayTeam);
                    /*                    playerSpotlight(rosterObj, playerSpotlightCounter);*/
                }
            }
        }
    });
    // loadRosterData(); ONLY ONCE
    /*    setTimeout(leaders(gid, gameStarted), 400);*/
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

function generateTimeline(selectedPlayer) {
    // APPEND: TIMELINE
    var seasonsPlayed = rosterObj.celtics.roster[selectedPlayer].stats.sa.length;
    var timelineHTML = '';
    var seasonYearHTML = '';
    for (var i = 0; i < seasonsPlayed; i++) {
        var teamAbbreviation = rosterObj.celtics.roster[selectedPlayer].stats.sa[i].ta;
        var traded = rosterObj.celtics.roster[selectedPlayer].stats.sa[i].spl.length;
        var segmentInner = "";
        var title = "";
        var seasonYearText = rosterObj.celtics.roster[selectedPlayer].stats.sa[i].val;
        if (i === 0 || teamAbbreviation !== rosterObj.celtics.roster[selectedPlayer].stats.sa[i - 1].ta) {
            // If this is a new team, start the team wrap.
            title = teamAbbreviation;
        }
        if (traded) {
            for (var x = 0; x < traded; x++) {
                var gpTot = rosterObj.celtics.roster[selectedPlayer].stats.sa[i].gp;
                var gp = rosterObj.celtics.roster[selectedPlayer].stats.sa[i].spl[x].gp;
                var gpPercentage = Math.round(gp / gpTot * 100);
                teamAbbreviation = rosterObj.celtics.roster[selectedPlayer].stats.sa[i].spl[x].ta;
                if (i === 0 || teamAbbreviation !== rosterObj.celtics.roster[selectedPlayer].stats.sa[i - 1].ta && teamAbbreviation !== rosterObj.celtics.roster[selectedPlayer].stats.sa[i + 1].ta) {
                    // If this is a new team, start the team wrap.
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
    jQuery(".timeline-wrap").html('<div class="timeline appended">' + timelineHTML + '</div><div class="season-year appended">' + seasonYearHTML + '</div>');
}
/*==================================
=            INITIALIZE            =
==================================*/
function init() {
    if (!gameStarted) {
        jQuery.ajax({
            url: 'http://localhost:8888/data/mobile-stats-feed/todays_scores.json',
            async: false,
            success: function success(todaysScoresData) {
                var gid = '';
                for (var i = 0; i < todaysScoresData.gs.g.length; i++) {
                    if (todaysScoresData.gs.g[i].h.ta == 'ORL') {
                        // CHANGE THIS TO 'BOS' WHEN THE TIME COMES
                        if (todaysScoresData.gs.g[i] !== 1) {
                            gameStarted = true;
                        }
                    }
                }
            }
        });
    }
};
/*========================================
=            PLAYER SPOTLIGHT            =
========================================*/
function playerSpotlight(rosterObj, playerSpotlightCounter) {
    /* 1 - WHITE LINE HORIZTONAL */
    setTimeout(function () {
        jQuery('.white-line.horizontal').addClass('transition-1');
    }, 500);
    setTimeout(function () {
        jQuery('.social-top .white-line.vertical:nth-child(odd)').addClass('transition-1');
        jQuery('.social-bottom .white-line.vertical:nth-child(even)').addClass('transition-1');
    }, 800);
    /* 2b - WHITE LINE VERTICAL */
    setTimeout(function () {
        jQuery('.social-top .white-line.vertical:nth-child(even)').addClass('transition-1');
        jQuery('.social-bottom .white-line.vertical:nth-child(odd)').addClass('transition-1');
    }, 1000);
    /* 3 - GENERATE AND REVEAL PLAYER BOXES */
    setTimeout(function () {
        jQuery('.social-top, .social-bottom').addClass('transition-1');
        jQuery('.player-box-wrap').addClass('transition-1');
    }, 1200);
    /* 4 - APPEND HEADSHOTS */
    setTimeout(function () {
        jQuery('.player-box-wrap').addClass('transition-2');
        jQuery('.player-box').addClass('transition-1');
        var delay = 0;
        var forinCounter = 0;
        for (var player in rosterObj.celtics.roster) {
            console.log(player);
            var headshot = 'https://ak-static.cms.nba.com/wp-content/uploads/headshots/nba/latest/1040x760/' + rosterObj.celtics.roster[player].pid + '.png';
            jQuery('.player-box:nth-child(' + (forinCounter + 1) + ')').append('<img class="appended headshot" src="' + headshot + '"/>');
            jQuery('.player-box:nth-child(' + (forinCounter + 1) + ')').attr('data-pid', rosterObj.celtics.roster[player].pid);
            jQuery('.player-box img').on("error", function () {
                jQuery(this).attr('src', 'https://i.cdn.turner.com/nba/nba/.element/media/2.0/teamsites/celtics/media/generic-player-light_600x438.png');
            });
            jQuery('.player-box:nth-child(' + (forinCounter + 1) + ') img').delay(delay).fadeTo(300, 1);
            delay += 30;
            forinCounter++;
        }
    }, 1300);
    /* 5 - PLAYER SELECT */
    var selectedPlayer = '';
    setTimeout(function () {
        jQuery('.player-box').addClass('transition-2');
        jQuery('.player-box:nth-child(' + (playerSpotlightCounter + 1) + ')').addClass('selected');
        selectedPlayer = jQuery('.player-box:nth-child(' + (playerSpotlightCounter + 1) + ')').attr('data-pid');
        console.log(selectedPlayer);
        jQuery('.player-box').not('.replacement.selected').delay(500).addClass('transition-4');
    }, 2000);
    /* 6 - PLAYER BOX EXPAND */
    setTimeout(function () {
        jQuery('.block-wrap.social').addClass('transition-3');
        jQuery('.player-box.replacement.selected').addClass('transition-3');
    }, 3000);
    /* 7 - SPOTLIGHT HTML */
    setTimeout(function () {
        generateTimeline(selectedPlayer);
        jQuery('.player-box.replacement.selected').clone().appendTo('.block-wrap.player-spotlight .top-wrap');
        jQuery('.player-spotlight .selected').addClass('.appended');
        jQuery('.block-wrap.player-spotlight').addClass('transition-1');
        jQuery('.block-wrap.social').addClass('transition-1');
        var stats = rosterObj.celtics.roster[selectedPlayer].stats;
        jQuery('.player-spotlight .top-wrap .player-top').append('<img class="silo appended" src="http://io.cnn.net/nba/nba/.element/media/2.0/teamsites/celtics/media/silo-466x591-' + rosterObj.celtics.roster[selectedPlayer].pid + '.png" /><div class="top appended"><div class="player-name-wrap"><p class="player-name"><span>' + rosterObj.celtics.roster[selectedPlayer].fn.toUpperCase() + '</span> <br> ' + rosterObj.celtics.roster[selectedPlayer].ln.toUpperCase() + '</p></div><p class="player-number">' + rosterObj.celtics.roster[selectedPlayer].num + '</br><span>' + rosterObj.celtics.roster[selectedPlayer].pos + '</span></p></div><div class="middle appended"><ul class="info clearfix"><li><p>AGE<span class="sm-hide">:&nbsp;</span> </br><span class="info-value">' + playerAge(rosterObj.celtics.roster[selectedPlayer].dob) + '</span></p></li><li><p>HT<span class="sm-hide">:&nbsp;</span> </br><span class="info-value">' + rosterObj.celtics.roster[selectedPlayer].ht + '</span></p></li><li><p>WT<span class="sm-hide">:&nbsp;</span> </br><span class="info-value">' + rosterObj.celtics.roster[selectedPlayer].wt + '</span></p></li></ul></div><div class="bottom full clearfix sm-hide appended"><table class="averages"><tr class="averages-labels"><td><p>GP</p></td><td><p>PPG</p></td><td><p>RPG</p></td><td><p>APG</p></td></tr><tr class="averages-season"><td class="gp"><p></p></td><td class="pts"><p></p></td><td class="reb"><p></p></td><td class="ast"><p></p></td></tr></table></div>');
        jQuery(".player-spotlight .averages-season").html('<td><p>' + stats.sa[0].gp + '</p></td><td><p>' + stats.sa[0].pts + '</p></td><td><p>' + stats.sa[0].reb + '</p></td><td><p>' + stats.sa[0].ast + '</p></td>');
        jQuery('.player-spotlight .player-name').fadeTo(200, 1);
        var playerFacts = rosterObj.celtics.roster[selectedPlayer].bio.personal;
        for (var i = 0; i < 3; i++) {
            var factIndex = Math.floor(Math.random() * playerFacts.length);
            jQuery('.player-spotlight .bottom-wrap').append('<div class="dyk-box appended"><p>' + playerFacts[factIndex] + '</p></div>');
        };
        jQuery('.player-spotlight .bottom-wrap').addClass('transition-1');
        setTimeout(function () {
            jQuery('.player-spotlight .bottom-wrap .dyk-box:nth-of-type(2)').addClass('transition-2');
            jQuery('.player-spotlight .bottom-wrap .dyk-box:nth-of-type(3)').addClass('transition-1');
        }, 1000);
        setTimeout(function () {
            jQuery('.player-spotlight .bottom-wrap .dyk-box:nth-of-type(3)').addClass('transition-2');
            jQuery('.player-spotlight .bottom-wrap .dyk-box:nth-of-type(4)').addClass('transition-1');
        }, 1500);
    }, 3600);
    /* 8 - SPOTLIGHT SLIDE IN */
    setTimeout(function () {
        jQuery('.player-spotlight .player-top .player-name, .player-spotlight .player-name-wrap, .player-spotlight .headshot, .player-spotlight .info, .player-spotlight .silo, .player-spotlight .averages, .player-spotlight .player-number').addClass('transition-1');
        setTimeout(function () {
            jQuery('.block-wrap.player-spotlight .player-box').remove();
        }, 4000);
        if (playerSpotlightCounter < 16) {
            playerSpotlightCounter++;
        } else {
            playerSpotlightCounter = 0;
        }
    }, 4100);
    /* 9 - SPOTLIGHT SLIDE OUT */
    setTimeout(function () {
        jQuery('.player-spotlight .bottom-wrap, .player-spotlight .top-wrap').addClass('transition-2');
    }, 6000);
    /* 10 - DONE. REMOVE THAT SHIT */
    setTimeout(function () {
        jQuery('.appended').remove();
        jQuery('.transition, .transition-1, .transition-2, .transition-3, .transition-4').removeClass('transition transition-1 transition-2 transition-3 transition-4');
    }, 7000);
}
/*=====================================================
=            LOAD ROSTER INFO => rosterObj            =
=====================================================*/
function loadRosterData(awayTeam) {
    var roster = '';
    jQuery.ajax({
        url: 'http://localhost:8888/data/mobile-stats-feed/celtics_roster.json',
        async: false,
        success: function success(data) {
            roster = data;
            for (var property in roster.t) {
                if (property !== 'pl') {
                    rosterObj.celtics[property] = roster.t[property];
                }
            }
        },
        error: function error() {}
    });
    var awayRoster = '';
    jQuery.ajax({
        url: 'http://localhost:8888/data/mobile-stats-feed/away_roster.json',
        async: false,
        success: function success(data) {
            awayRoster = data;
            for (var property in awayRoster.t) {
                if (property !== 'pl') {
                    rosterObj.away[property] = awayRoster.t[property];
                }
            }
        },
        error: function error() {}
    });
    var bioData = '';
    jQuery.ajax({
        url: 'http://localhost:8888/data/bio-data.json',
        async: false,
        success: function success(data) {
            bioData = data;
        },
        error: function error() {}
    });
    for (var i = 0; i < roster.t.pl.length; i++) {
        var pid = roster.t.pl[i].pid;
        rosterObj.celtics.roster[pid] = roster.t.pl[i];
        for (var property in bioData[pid]) {
            rosterObj.celtics.roster[pid].bio = bioData[pid];
        };
        jQuery.ajax({
            url: 'http://localhost:8888/data/mobile-stats-feed/playercards/playercard-' + pid + '.json',
            async: false,
            success: function success(data) {
                rosterObj.celtics.roster[pid].stats = data.pl.ca;
            },
            error: function error() {}
        });
    }
    for (var i = 0; i < awayRoster.t.pl.length; i++) {
        var pid = awayRoster.t.pl[i].pid;
        rosterObj.away.roster[pid] = awayRoster.t.pl[i];
        jQuery.ajax({
            url: 'http://localhost:8888/data/mobile-stats-feed/playercards/playercard-202330.json', // CHANGE PID
            async: false,
            success: function success(data) {
                rosterObj.away.roster[pid].stats = data.pl.ca;
            },
            error: function error() {}
        });
    }
    for (var team in rosterObj) {
        for (var player in rosterObj[team].roster) {
            var ptLeaders = rosterObj[team].leaders.pts;
            var astLeaders = rosterObj[team].leaders.ast;
            var rebLeaders = rosterObj[team].leaders.reb;
            for (var stat in rosterObj[team].leaders) {
                for (var i = 0; i < 3; i++) {
                    if (rosterObj[team].leaders[stat][i][2] == '--' && rosterObj[team].roster[player].stats[stat] > 0) {
                        rosterObj[team].leaders[stat][i][0] = rosterObj[team].roster[player].fn.toUpperCase();
                        rosterObj[team].leaders[stat][i][1] = rosterObj[team].roster[player].ln.toUpperCase();
                        rosterObj[team].leaders[stat][i][2] = rosterObj[team].roster[player].stats[stat];
                        rosterObj[team].leaders[stat][i][3] = rosterObj[team].roster[player].pid;
                        break;
                    } else if (rosterObj[team].roster[player].stats[stat] > rosterObj[team].leaders[stat][i][2] && rosterObj[team].roster[player].stats[stat] > 0) {
                        rosterObj[team].leaders[stat][i][0] = rosterObj[team].roster[player].fn.toUpperCase();
                        rosterObj[team].leaders[stat][i][1] = rosterObj[team].roster[player].ln.toUpperCase();
                        rosterObj[team].leaders[stat][i][2] = rosterObj[team].roster[player].stats[stat];
                        rosterObj[team].leaders[stat][i][3] = rosterObj[team].roster[player].pid;
                        break;
                    }
                };
            }
        }
    }
    console.log(rosterObj);
};

function statsNotAvailable(pid) {
    rosterObj[pid].stats = {};
    rosterObj[pid].stats.sa = [{}];
    rosterObj[pid].stats.hasStats = false;
    var caIndex = ['gp', 'gs', 'min', 'fgp', 'tpp', 'ftp', 'oreb', 'dreb', 'reb', 'ast', 'stl', 'blk', 'tov', 'pf', 'pts', 'nostats'];
    var saIndex = ['tid', 'val', 'gp', 'gs', 'min', 'fgp', 'tpp', 'ftp', 'oreb', 'dreb', 'reb', 'ast', 'stl', 'blk', 'tov', 'pf', 'pts', 'spl', 'ta', 'tn', 'tc'];
    for (var i = 0; i < saIndex.length; i++) {
        rosterObj[pid].stats.sa[0][saIndex[i]] = "N/A";
        if (i === 1) {
            rosterObj[pid].stats.sa[0][saIndex[i]] = playerCardYear.toString().substr(2, 2) + "-" + (playerCardYear + 1).toString().substr(2, 2);
        }
        if (i === 17) {
            rosterObj[pid].stats.sa[0][saIndex[i]] = [];
        }
        if (i === 18) {
            rosterObj[pid].stats.sa[0][saIndex[i]] = 'BOS';
        }
    }
    for (var i = 0; i < caIndex.length; i++) {
        rosterObj[pid].stats[caIndex[i]] = "N/A";
        if (i === 15) {
            rosterObj[pid].stats[caIndex[i]] = true;
        }
    }
};

function loadGameDetail(gid) {};

function loadAwayTeamData() {}
/*====================================
=            STAT LEADERS            =
====================================*/

function leaders(gid, gameStarted) {
    var gameDetail = '';
    var detailAvailable = false;
    gameStarted = true; // DO: DELETE THIS WHEN ONLINE. JUST FOR TESTING PURPOSES RN
    if (gameStarted) {
        jQuery.ajax({
            url: 'http://localhost:8888/data/mobile-stats-feed/gamedetail.json',
            async: false,
            success: function success(data) {
                // DO: UPDATE THE LEADER OBJECTS
                gameDetail = data;
            }
        });
    }
    for (var team in rosterObj) {
        for (var i = 0; i < 3; i++) {
            for (var stat in rosterObj[team].leaders) {
                // LEADER STAT VALUE
                jQuery('.leader-section:nth-of-type(' + (i + 2) + ') .' + stat + '.' + team + ' .stat').append('<span class="' + rosterObj[team].ta + '">' + rosterObj[team].leaders[stat][i][2] + '</span> ' + stat.toUpperCase());
                // LEADER NAME
                if (rosterObj[team].leaders[stat][i][0].length + rosterObj[team].leaders[stat][i][1].length >= 15) {
                    rosterObj[team].leaders[stat][i][0] = rosterObj[team].leaders[stat][i][0].substr(0, 1) + '.';
                }
                jQuery('.leader-section:nth-of-type(' + (i + 2) + ') .' + stat + '.' + team + ' .name').append('<span>' + rosterObj[team].leaders[stat][i][0] + '</span> ' + rosterObj[team].leaders[stat][i][1]);
                // LEADER HEADSHOT
                jQuery('.leader-section:nth-of-type(' + (i + 2) + ') .' + stat + '.' + team + ' .headshot').attr('src', 'https://ak-static.cms.nba.com/wp-content/uploads/headshots/nba/latest/1040x760/' + rosterObj[team].leaders[stat][i][3] + '.png');
            }
        }
    }
    var timeBetween = 1000;
    jQuery('.leaders, .leaders .block-inner').addClass('transition-1');
    setTimeout(function () {
        jQuery('.leaders .leader-section').addClass('transition-1');
        jQuery('.leader-subsection.bottom p:nth-of-type(1)').addClass('transition-1');
        jQuery('.leaders .leader-section .underline, .leaders .leader-subsection.top').addClass(rosterObj.celtics.ta + '-bg');
    }, 800);
    var transitionCounter = 1;

    var _loop = function _loop(_i) {
        setTimeout(function (numberString) {
            jQuery('.leaders .leader-section .leader-stat-wrap').addClass('transition-' + _i);
            jQuery('.leaders .leader-section .underline, .leaders .leader-subsection.top').removeClass(rosterObj.celtics.ta + '-bg');
            jQuery('.leaders .leader-section .underline, .leaders .leader-subsection.top').addClass(rosterObj.away.ta + '-bg');
            if (transitionCounter % 2 == 0) {
                setTimeout(function () {

                    jQuery('.leaders .leader-section .underline, .leaders .leader-subsection.top').removeClass(rosterObj.away.ta + '-bg');
                    jQuery('.leaders .leader-section .underline, .leaders .leader-subsection.top').addClass(rosterObj.celtics.ta + '-bg');
                    jQuery('.leader-subsection.bottom p').removeClass('transition-1');
                    jQuery('.leaders .leader-section .underline').addClass('transition-' + _i / 2);
                    jQuery('.leader-subsection.bottom p:nth-of-type(' + (_i - _i / 2 + 1) + ')').addClass('transition-1'); // lol
                }, 200);
            }
            transitionCounter++;
        }, 2000 * _i);
    };

    for (var _i = 1; _i <= 6; _i++) {
        _loop(_i);
    }
};
/*==============================
=            SOCIAL            =
==============================*/
function social(roster) {};
/*==================================
=            MOBILE APP            =
==================================*/
function initMobileApp() {
    var counter = 1;
    setInterval(function () {
        jQuery('.app .bottom-wrap img').removeClass('active');
        jQuery('.app .feature-list p').removeClass('active');
        jQuery('.app .feature-list p:nth-of-type(' + counter + ')').addClass('active');
        jQuery('.app .bottom-wrap img:nth-of-type(' + counter + ')').addClass('active');
        if (counter == 5) {
            counter = 1;
        } else {
            counter++;
        }
    }, 2000);
};

function mobileApp() {
    jQuery('.app').show();
};
/*=================================
=            STANDINGS            =
=================================*/
function standings(awayTeam) {
    jQuery.ajax({
        url: 'http://localhost:8888/data/mobile-stats-feed/standings.json',
        async: false,
        success: function success(standingsData) {
            console.log("YEAAAAH");
            for (var i = 0; i < standingsData.sta.co.length; i++) {
                for (var x = 0; x < standingsData.sta.co[i].di.length; x++) {
                    for (var t = 0; t < standingsData.sta.co[i].di[x].t.length; t++) {
                        var conferences = ['.east', '.west'];
                        var place = standingsData.sta.co[i].di[x].t[t].see;
                        var seed = '';
                        var activeStatus = '';
                        if (standingsData.sta.co[i].di[x].t[t].see <= 8) {
                            seed = standingsData.sta.co[i].di[x].t[t].see;
                        }
                        if (standingsData.sta.co[i].di[x].t[t].ta == 'BOS') {
                            activeStatus = 'active';
                        }
                        if (standingsData.sta.co[i].di[x].t[t].ta == awayTeam) {
                            activeStatus = 'active-away';
                        }
                        var rowHTML = '<div class="place">' + seed + '</div><div class="logo-wrap"><img class="logo" src=http://i.cdn.turner.com/nba/nba/assets/logos/teams/primary/web/' + standingsData.sta.co[i].di[x].t[t].ta + '.svg></div><div class="team + ' + standingsData.sta.co[i].di[x].t[t].ta + '">' + standingsData.sta.co[i].di[x].t[t].ta + '</div><div class="wins">' + standingsData.sta.co[i].di[x].t[t].w + '</div><div class="losses">' + standingsData.sta.co[i].di[x].t[t].l + '</div><div class="games-behind">' + standingsData.sta.co[i].di[x].t[t].gb + '</div>';
                        jQuery(conferences[i] + ' > div:nth-child(' + (place + 1) + ')').html(rowHTML);
                        jQuery(conferences[i] + ' > div:nth-child(' + (place + 1) + ')').addClass(activeStatus);
                    }
                }
            }
        }
    });
};
/*=========================================
=            AROUND THE LEAGUE            =
=========================================*/
function scores() {};

},{}]},{},[1])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJzcmMvanMvY29uY291cnNlLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7QUNBQSxJQUFJLFlBQVk7QUFDWixhQUFTO0FBQ0wsZ0JBQVEsRUFESDtBQUVMLGlCQUFTO0FBQ0wsaUJBQUssQ0FBQyxDQUFDLElBQUQsRUFBTyxJQUFQLEVBQWEsSUFBYixFQUFtQixJQUFuQixDQUFELEVBQTJCLENBQUMsSUFBRCxFQUFPLElBQVAsRUFBYSxJQUFiLEVBQW1CLElBQW5CLENBQTNCLEVBQXFELENBQUMsSUFBRCxFQUFPLElBQVAsRUFBYSxJQUFiLEVBQW1CLElBQW5CLENBQXJELENBREE7QUFFTCxpQkFBSyxDQUFDLENBQUMsSUFBRCxFQUFPLElBQVAsRUFBYSxJQUFiLEVBQW1CLElBQW5CLENBQUQsRUFBMkIsQ0FBQyxJQUFELEVBQU8sSUFBUCxFQUFhLElBQWIsRUFBbUIsSUFBbkIsQ0FBM0IsRUFBcUQsQ0FBQyxJQUFELEVBQU8sSUFBUCxFQUFhLElBQWIsRUFBbUIsSUFBbkIsQ0FBckQsQ0FGQTtBQUdMLGlCQUFLLENBQUMsQ0FBQyxJQUFELEVBQU8sSUFBUCxFQUFhLElBQWIsRUFBbUIsSUFBbkIsQ0FBRCxFQUEyQixDQUFDLElBQUQsRUFBTyxJQUFQLEVBQWEsSUFBYixFQUFtQixJQUFuQixDQUEzQixFQUFxRCxDQUFDLElBQUQsRUFBTyxJQUFQLEVBQWEsSUFBYixFQUFtQixJQUFuQixDQUFyRDtBQUhBO0FBRkosS0FERztBQVNaLFVBQU07QUFDRixnQkFBUSxFQUROO0FBRUYsaUJBQVM7QUFDTCxpQkFBSyxDQUFDLENBQUMsSUFBRCxFQUFPLElBQVAsRUFBYSxJQUFiLEVBQW1CLElBQW5CLENBQUQsRUFBMkIsQ0FBQyxJQUFELEVBQU8sSUFBUCxFQUFhLElBQWIsRUFBbUIsSUFBbkIsQ0FBM0IsRUFBcUQsQ0FBQyxJQUFELEVBQU8sSUFBUCxFQUFhLElBQWIsRUFB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c0NvbnRlbnQiOlsiKGZ1bmN0aW9uIGUodCxuLHIpe2Z1bmN0aW9uIHMobyx1KXtpZighbltvXSl7aWYoIXRbb10pe3ZhciBhPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7aWYoIXUmJmEpcmV0dXJuIGEobywhMCk7aWYoaSlyZXR1cm4gaShvLCEwKTt2YXIgZj1uZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK28rXCInXCIpO3Rocm93IGYuY29kZT1cIk1PRFVMRV9OT1RfRk9VTkRcIixmfXZhciBsPW5bb109e2V4cG9ydHM6e319O3Rbb11bMF0uY2FsbChsLmV4cG9ydHMsZnVuY3Rpb24oZSl7dmFyIG49dFtvXVsxXVtlXTtyZXR1cm4gcyhuP246ZSl9LGwsbC5leHBvcnRzLGUsdCxuLHIpfXJldHVybiBuW29dLmV4cG9ydHN9dmFyIGk9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtmb3IodmFyIG89MDtvPHIubGVuZ3RoO28rKylzKHJbb10pO3JldHVybiBzfSkiLCJ2YXIgcm9zdGVyT2JqID0ge1xuICAgIGNlbHRpY3M6IHtcbiAgICAgICAgcm9zdGVyOiB7fSxcbiAgICAgICAgbGVhZGVyczoge1xuICAgICAgICAgICAgcHRzOiBbWyctLScsICctLScsICctLScsICctLSddLCBbJy0tJywgJy0tJywgJy0tJywgJy0tJ10sIFsnLS0nLCAnLS0nLCAnLS0nLCAnLS0nXV0sXG4gICAgICAgICAgICBhc3Q6IFtbJy0tJywgJy0tJywgJy0tJywgJy0tJ10sIFsnLS0nLCAnLS0nLCAnLS0nLCAnLS0nXSwgWyctLScsICctLScsICctLScsICctLSddXSxcbiAgICAgICAgICAgIHJlYjogW1snLS0nLCAnLS0nLCAnLS0nLCAnLS0nXSwgWyctLScsICctLScsICctLScsICctLSddLCBbJy0tJywgJy0tJywgJy0tJywgJy0tJ11dXG4gICAgICAgIH1cbiAgICB9LFxuICAgIGF3YXk6IHtcbiAgICAgICAgcm9zdGVyOiB7fSxcbiAgICAgICAgbGVhZGVyczoge1xuICAgICAgICAgICAgcHRzOiBbWyctLScsICctLScsICctLScsICctLSddLCBbJy0tJywgJy0tJywgJy0tJywgJy0tJ10sIFsnLS0nLCAnLS0nLCAnLS0nLCAnLS0nXV0sXG4gICAgICAgICAgICBhc3Q6IFtbJy0tJywgJy0tJywgJy0tJywgJy0tJ10sIFsnLS0nLCAnLS0nLCAnLS0nLCAnLS0nXSwgWyctLScsICctLScsICctLScsICctLSddXSxcbiAgICAgICAgICAgIHJlYjogW1snLS0nLCAnLS0nLCAnLS0nLCAnLS0nXSwgWyctLScsICctLScsICctLScsICctLSddLCBbJy0tJywgJy0tJywgJy0tJywgJy0tJ11dXG4gICAgICAgIH1cbiAgICB9XG59O1xuXG5qUXVlcnkoZG9jdW1lbnQpLnJlYWR5KGZ1bmN0aW9uKCkge1xuICAgIHZhciBnaWQgPSAnJztcbiAgICB2YXIgYXdheVRlYW0gPSAnJztcbiAgICB2YXIgZ2FtZVN0YXJ0ZWQgPSBmYWxzZTtcbiAgICB2YXIgcGxheWVyU3BvdGxpZ2h0Q291bnRlciA9IDEwO1xuICAgIHZhciBkYXRlID0gbmV3IERhdGUoKTtcbiAgICBqUXVlcnkuYWpheCh7XG4gICAgICAgIHVybDogJ2h0dHA6Ly9sb2NhbGhvc3Q6ODg4OC9kYXRhL21vYmlsZS1zdGF0cy1mZWVkL3RvZGF5c19zY29yZXMuanNvbicsXG4gICAgICAgIGFzeW5jOiBmYWxzZSxcbiAgICAgICAgc3VjY2VzczogZnVuY3Rpb24odG9kYXlzU2NvcmVzRGF0YSkge1xuICAgICAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCB0b2RheXNTY29yZXNEYXRhLmdzLmcubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgICAgICBpZiAodG9kYXlzU2NvcmVzRGF0YS5ncy5nW2ldLmgudGEgPT0gJ09STCcpIHsgLy9DSEFOR0UgVEhJU1xuICAgICAgICAgICAgICAgICAgICBhd2F5VGVhbSA9IHRvZGF5c1Njb3Jlc0RhdGEuZ3MuZ1tpXS52LnRhO1xuICAgICAgICAgICAgICAgICAgICBsb2FkUm9zdGVyRGF0YShhd2F5VGVhbSk7XG4gICAgICAgICAgICAgICAgICAgIGdpZCA9IHRvZGF5c1Njb3Jlc0RhdGEuZ3MuZ1tpXS5naWQ7XG4gICAgICAgICAgICAgICAgICAgIGluaXRNb2JpbGVBcHAoKTtcbiAgICAgICAgICAgICAgICAgICAgbW9iaWxlQXBwKCk7XG4gICAgICAgICAgICAgICAgICAgIHN0YW5kaW5ncyhhd2F5VGVhbSk7XG4vKiAgICAgICAgICAgICAgICAgICAgcGxheWVyU3BvdGxpZ2h0KHJvc3Rlck9iaiwgcGxheWVyU3BvdGxpZ2h0Q291bnRlcik7Ki9cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9KTtcbiAgICAvLyBsb2FkUm9zdGVyRGF0YSgpOyBPTkxZIE9OQ0Vcbi8qICAgIHNldFRpbWVvdXQobGVhZGVycyhnaWQsIGdhbWVTdGFydGVkKSwgNDAwKTsqL1xufSk7XG4vKj09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG49ICAgICAgICAgICAgTUlTQyBGVU5DVElPTlMgICAgICAgICAgICA9XG49PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PSovXG5mdW5jdGlvbiBwbGF5ZXJBZ2UoZG9iKSB7XG4gICAgdmFyIHRvZGF5ID0gbmV3IERhdGUoKTtcbiAgICB2YXIgYmlydGhEYXRlID0gbmV3IERhdGUoZG9iKTtcbiAgICB2YXIgYWdlID0gdG9kYXkuZ2V0RnVsbFllYXIoKSAtIGJpcnRoRGF0ZS5nZXRGdWxsWWVhcigpO1xuICAgIHJldHVybiBhZ2U7XG59XG5cbmZ1bmN0aW9uIGdlbmVyYXRlVGltZWxpbmUoc2VsZWN0ZWRQbGF5ZXIpIHtcbiAgICAvLyBBUFBFTkQ6IFRJTUVMSU5FXG4gICAgdmFyIHNlYXNvbnNQbGF5ZWQgPSByb3N0ZXJPYmouY2VsdGljcy5yb3N0ZXJbc2VsZWN0ZWRQbGF5ZXJdLnN0YXRzLnNhLmxlbmd0aDtcbiAgICB2YXIgdGltZWxpbmVIVE1MID0gJyc7XG4gICAgdmFyIHNlYXNvblllYXJIVE1MID0gJyc7XG4gICAgZm9yICh2YXIgaSA9IDA7IGkgPCBzZWFzb25zUGxheWVkOyBpKyspIHtcbiAgICAgICAgdmFyIHRlYW1BYmJyZXZpYXRpb24gPSByb3N0ZXJPYmouY2VsdGljcy5yb3N0ZXJbc2VsZWN0ZWRQbGF5ZXJdLnN0YXRzLnNhW2ldLnRhO1xuICAgICAgICB2YXIgdHJhZGVkID0gcm9zdGVyT2JqLmNlbHRpY3Mucm9zdGVyW3NlbGVjdGVkUGxheWVyXS5zdGF0cy5zYVtpXS5zcGwubGVuZ3RoO1xuICAgICAgICB2YXIgc2VnbWVudElubmVyID0gXCJcIjtcbiAgICAgICAgdmFyIHRpdGxlID0gXCJcIjtcbiAgICAgICAgdmFyIHNlYXNvblllYXJUZXh0ID0gcm9zdGVyT2JqLmNlbHRpY3Mucm9zdGVyW3NlbGVjdGVkUGxheWVyXS5zdGF0cy5zYVtpXS52YWw7XG4gICAgICAgIGlmIChpID09PSAwIHx8IHRlYW1BYmJyZXZpYXRpb24gIT09IHJvc3Rlck9iai5jZWx0aWNzLnJvc3RlcltzZWxlY3RlZFBsYXllcl0uc3RhdHMuc2FbaSAtIDFdLnRhKSB7IC8vIElmIHRoaXMgaXMgYSBuZXcgdGVhbSwgc3RhcnQgdGhlIHRlYW0gd3JhcC5cbiAgICAgICAgICAgIHRpdGxlID0gdGVhbUFiYnJldmlhdGlvbjtcbiAgICAgICAgfVxuICAgICAgICBpZiAodHJhZGVkKSB7XG4gICAgICAgICAgICBmb3IgKHZhciB4ID0gMDsgeCA8IHRyYWRlZDsgeCsrKSB7XG4gICAgICAgICAgICAgICAgdmFyIGdwVG90ID0gcm9zdGVyT2JqLmNlbHRpY3Mucm9zdGVyW3NlbGVjdGVkUGxheWVyXS5zdGF0cy5zYVtpXS5ncDtcbiAgICAgICAgICAgICAgICB2YXIgZ3AgPSByb3N0ZXJPYmouY2VsdGljcy5yb3N0ZXJbc2VsZWN0ZWRQbGF5ZXJdLnN0YXRzLnNhW2ldLnNwbFt4XS5ncDtcbiAgICAgICAgICAgICAgICB2YXIgZ3BQZXJjZW50YWdlID0gTWF0aC5yb3VuZCgoZ3AgLyBncFRvdCkgKiAxMDApO1xuICAgICAgICAgICAgICAgIHRlYW1BYmJyZXZpYXRpb24gPSByb3N0ZXJPYmouY2VsdGljcy5yb3N0ZXJbc2VsZWN0ZWRQbGF5ZXJdLnN0YXRzLnNhW2ldLnNwbFt4XS50YTtcbiAgICAgICAgICAgICAgICBpZiAoaSA9PT0gMCB8fCB0ZWFtQWJicmV2aWF0aW9uICE9PSByb3N0ZXJPYmouY2VsdGljcy5yb3N0ZXJbc2VsZWN0ZWRQbGF5ZXJdLnN0YXRzLnNhW2kgLSAxXS50YSAmJiB0ZWFtQWJicmV2aWF0aW9uICE9PSByb3N0ZXJPYmouY2VsdGljcy5yb3N0ZXJbc2VsZWN0ZWRQbGF5ZXJdLnN0YXRzLnNhW2kgKyAxXS50YSkgeyAvLyBJZiB0aGlzIGlzIGEgbmV3IHRlYW0sIHN0YXJ0IHRoZSB0ZWFtIHdyYXAuXG4gICAgICAgICAgICAgICAgICAgIHRpdGxlID0gdGVhbUFiYnJldmlhdGlvbjtcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICB0aXRsZSA9IFwiXCI7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIHNlZ21lbnRJbm5lciArPSAnPGRpdiBkYXRhLXNlYXNvbi15ZWFyPVwiJyArIHNlYXNvblllYXJUZXh0ICsgJ1wiIGRhdGEtdGVhbT1cIicgKyB0ZWFtQWJicmV2aWF0aW9uICsgJ1wiIHN0eWxlPVwiXCIgY2xhc3M9XCJzZWdtZW50LWlubmVyICcgKyB0ZWFtQWJicmV2aWF0aW9uICsgJy1iZ1wiPjxwPicgKyB0aXRsZSArICc8L3A+PC9kaXY+JztcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHNlZ21lbnRJbm5lciA9ICc8ZGl2IGRhdGEtc2Vhc29uLXllYXI9XCInICsgc2Vhc29uWWVhclRleHQgKyAnXCIgZGF0YS10ZWFtPVwiJyArIHRlYW1BYmJyZXZpYXRpb24gKyAnXCIgY2xhc3M9XCJzZWdtZW50LWlubmVyICcgKyB0ZWFtQWJicmV2aWF0aW9uICsgJy1iZ1wiPjxwPicgKyB0aXRsZSArICc8L3A+PC9kaXY+JztcbiAgICAgICAgfVxuICAgICAgICB0aW1lbGluZUhUTUwgKz0gJzxkaXYgY2xhc3M9XCJzZWdtZW50XCI+JyArIHNlZ21lbnRJbm5lciArICc8L2Rpdj4nO1xuICAgICAgICBzZWFzb25ZZWFySFRNTCArPSAnPGRpdiBjbGFzcz1cInNlZ21lbnRcIj48cD4nICsgc2Vhc29uWWVhclRleHQgKyAnPC9wPjwvZGl2Pic7XG4gICAgfVxuICAgIGpRdWVyeShcIi50aW1lbGluZS13cmFwXCIpLmh0bWwoJzxkaXYgY2xhc3M9XCJ0aW1lbGluZSBhcHBlbmRlZFwiPicgKyB0aW1lbGluZUhUTUwgKyAnPC9kaXY+PGRpdiBjbGFzcz1cInNlYXNvbi15ZWFyIGFwcGVuZGVkXCI+JyArIHNlYXNvblllYXJIVE1MICsgJzwvZGl2PicpO1xufVxuLyo9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG49ICAgICAgICAgICAgSU5JVElBTElaRSAgICAgICAgICAgID1cbj09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT0qL1xuZnVuY3Rpb24gaW5pdCgpIHtcbiAgICBpZiAoIWdhbWVTdGFydGVkKSB7XG4gICAgICAgIGpRdWVyeS5hamF4KHtcbiAgICAgICAgICAgIHVybDogJ2h0dHA6Ly9sb2NhbGhvc3Q6ODg4OC9kYXRhL21vYmlsZS1zdGF0cy1mZWVkL3RvZGF5c19zY29yZXMuanNvbicsXG4gICAgICAgICAgICBhc3luYzogZmFsc2UsXG4gICAgICAgICAgICBzdWNjZXNzOiBmdW5jdGlvbih0b2RheXNTY29yZXNEYXRhKSB7XG4gICAgICAgICAgICAgICAgdmFyIGdpZCA9ICcnO1xuICAgICAgICAgICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgdG9kYXlzU2NvcmVzRGF0YS5ncy5nLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICAgICAgICAgIGlmICh0b2RheXNTY29yZXNEYXRhLmdzLmdbaV0uaC50YSA9PSAnT1JMJykgeyAvLyBDSEFOR0UgVEhJUyBUTyAnQk9TJyBXSEVOIFRIRSBUSU1FIENPTUVTXG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAodG9kYXlzU2NvcmVzRGF0YS5ncy5nW2ldICE9PSAxKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZ2FtZVN0YXJ0ZWQgPSB0cnVlO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICB9XG59O1xuLyo9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG49ICAgICAgICAgICAgUExBWUVSIFNQT1RMSUdIVCAgICAgICAgICAgID1cbj09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT0qL1xuZnVuY3Rpb24gcGxheWVyU3BvdGxpZ2h0KHJvc3Rlck9iaiwgcGxheWVyU3BvdGxpZ2h0Q291bnRlcikge1xuICAgIC8qIDEgLSBXSElURSBMSU5FIEhPUklaVE9OQUwgKi9cbiAgICBzZXRUaW1lb3V0KGZ1bmN0aW9uKCkge1xuICAgICAgICBqUXVlcnkoJy53aGl0ZS1saW5lLmhvcml6b250YWwnKS5hZGRDbGFzcygndHJhbnNpdGlvbi0xJyk7XG4gICAgfSwgNTAwKTtcbiAgICBzZXRUaW1lb3V0KGZ1bmN0aW9uKCkge1xuICAgICAgICBqUXVlcnkoJy5zb2NpYWwtdG9wIC53aGl0ZS1saW5lLnZlcnRpY2FsOm50aC1jaGlsZChvZGQpJykuYWRkQ2xhc3MoJ3RyYW5zaXRpb24tMScpO1xuICAgICAgICBqUXVlcnkoJy5zb2NpYWwtYm90dG9tIC53aGl0ZS1saW5lLnZlcnRpY2FsOm50aC1jaGlsZChldmVuKScpLmFkZENsYXNzKCd0cmFuc2l0aW9uLTEnKTtcbiAgICB9LCA4MDApO1xuICAgIC8qIDJiIC0gV0hJVEUgTElORSBWRVJUSUNBTCAqL1xuICAgIHNldFRpbWVvdXQoZnVuY3Rpb24oKSB7XG4gICAgICAgIGpRdWVyeSgnLnNvY2lhbC10b3AgLndoaXRlLWxpbmUudmVydGljYWw6bnRoLWNoaWxkKGV2ZW4pJykuYWRkQ2xhc3MoJ3RyYW5zaXRpb24tMScpO1xuICAgICAgICBqUXVlcnkoJy5zb2NpYWwtYm90dG9tIC53aGl0ZS1saW5lLnZlcnRpY2FsOm50aC1jaGlsZChvZGQpJykuYWRkQ2xhc3MoJ3RyYW5zaXRpb24tMScpO1xuICAgIH0sIDEwMDApO1xuICAgIC8qIDMgLSBHRU5FUkFURSBBTkQgUkVWRUFMIFBMQVlFUiBCT1hFUyAqL1xuICAgIHNldFRpbWVvdXQoZnVuY3Rpb24oKSB7XG4gICAgICAgIGpRdWVyeSgnLnNvY2lhbC10b3AsIC5zb2NpYWwtYm90dG9tJykuYWRkQ2xhc3MoJ3RyYW5zaXRpb24tMScpO1xuICAgICAgICBqUXVlcnkoJy5wbGF5ZXItYm94LXdyYXAnKS5hZGRDbGFzcygndHJhbnNpdGlvbi0xJyk7XG4gICAgfSwgMTIwMCk7XG4gICAgLyogNCAtIEFQUEVORCBIRUFEU0hPVFMgKi9cbiAgICBzZXRUaW1lb3V0KGZ1bmN0aW9uKCkge1xuICAgICAgICBqUXVlcnkoJy5wbGF5ZXItYm94LXdyYXAnKS5hZGRDbGFzcygndHJhbnNpdGlvbi0yJyk7XG4gICAgICAgIGpRdWVyeSgnLnBsYXllci1ib3gnKS5hZGRDbGFzcygndHJhbnNpdGlvbi0xJyk7XG4gICAgICAgIHZhciBkZWxheSA9IDA7XG4gICAgICAgIHZhciBmb3JpbkNvdW50ZXIgPSAwO1xuICAgICAgICBmb3IgKHZhciBwbGF5ZXIgaW4gcm9zdGVyT2JqLmNlbHRpY3Mucm9zdGVyKSB7XG4gICAgICAgICAgICBjb25zb2xlLmxvZyhwbGF5ZXIpO1xuICAgICAgICAgICAgdmFyIGhlYWRzaG90ID0gJ2h0dHBzOi8vYWstc3RhdGljLmNtcy5uYmEuY29tL3dwLWNvbnRlbnQvdXBsb2Fkcy9oZWFkc2hvdHMvbmJhL2xhdGVzdC8xMDQweDc2MC8nICsgcm9zdGVyT2JqLmNlbHRpY3Mucm9zdGVyW3BsYXllcl0ucGlkICsgJy5wbmcnO1xuICAgICAgICAgICAgalF1ZXJ5KCcucGxheWVyLWJveDpudGgtY2hpbGQoJyArIChmb3JpbkNvdW50ZXIgKyAxKSArICcpJykuYXBwZW5kKCc8aW1nIGNsYXNzPVwiYXBwZW5kZWQgaGVhZHNob3RcIiBzcmM9XCInICsgaGVhZHNob3QgKyAnXCIvPicpO1xuICAgICAgICAgICAgalF1ZXJ5KCcucGxheWVyLWJveDpudGgtY2hpbGQoJyArIChmb3JpbkNvdW50ZXIgKyAxKSArICcpJykuYXR0cignZGF0YS1waWQnLCByb3N0ZXJPYmouY2VsdGljcy5yb3N0ZXJbcGxheWVyXS5waWQpO1xuICAgICAgICAgICAgalF1ZXJ5KCcucGxheWVyLWJveCBpbWcnKS5vbihcImVycm9yXCIsIGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgICAgIGpRdWVyeSh0aGlzKS5hdHRyKCdzcmMnLCAnaHR0cHM6Ly9pLmNkbi50dXJuZXIuY29tL25iYS9uYmEvLmVsZW1lbnQvbWVkaWEvMi4wL3RlYW1zaXRlcy9jZWx0aWNzL21lZGlhL2dlbmVyaWMtcGxheWVyLWxpZ2h0XzYwMHg0MzgucG5nJyk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIGpRdWVyeSgnLnBsYXllci1ib3g6bnRoLWNoaWxkKCcgKyAoZm9yaW5Db3VudGVyICsgMSkgKyAnKSBpbWcnKS5kZWxheShkZWxheSkuZmFkZVRvKDMwMCwgMSk7XG4gICAgICAgICAgICBkZWxheSArPSAzMDtcbiAgICAgICAgICAgIGZvcmluQ291bnRlcisrO1xuICAgICAgICB9XG4gICAgfSwgMTMwMCk7XG4gICAgLyogNSAtIFBMQVlFUiBTRUxFQ1QgKi9cbiAgICB2YXIgc2VsZWN0ZWRQbGF5ZXIgPSAnJztcbiAgICBzZXRUaW1lb3V0KGZ1bmN0aW9uKCkge1xuICAgICAgICBqUXVlcnkoJy5wbGF5ZXItYm94JykuYWRkQ2xhc3MoJ3RyYW5zaXRpb24tMicpO1xuICAgICAgICBqUXVlcnkoJy5wbGF5ZXItYm94Om50aC1jaGlsZCgnICsgKHBsYXllclNwb3RsaWdodENvdW50ZXIgKyAxKSArICcpJykuYWRkQ2xhc3MoJ3NlbGVjdGVkJyk7XG4gICAgICAgIHNlbGVjdGVkUGxheWVyID0galF1ZXJ5KCcucGxheWVyLWJveDpudGgtY2hpbGQoJyArIChwbGF5ZXJTcG90bGlnaHRDb3VudGVyICsgMSkgKyAnKScpLmF0dHIoJ2RhdGEtcGlkJyk7XG4gICAgICAgIGNvbnNvbGUubG9nKHNlbGVjdGVkUGxheWVyKTtcbiAgICAgICAgalF1ZXJ5KCcucGxheWVyLWJveCcpLm5vdCgnLnJlcGxhY2VtZW50LnNlbGVjdGVkJykuZGVsYXkoNTAwKS5hZGRDbGFzcygndHJhbnNpdGlvbi00Jyk7XG4gICAgfSwgMjAwMCk7XG4gICAgLyogNiAtIFBMQVlFUiBCT1ggRVhQQU5EICovXG4gICAgc2V0VGltZW91dChmdW5jdGlvbigpIHtcbiAgICAgICAgalF1ZXJ5KCcuYmxvY2std3JhcC5zb2NpYWwnKS5hZGRDbGFzcygndHJhbnNpdGlvbi0zJyk7XG4gICAgICAgIGpRdWVyeSgnLnBsYXllci1ib3gucmVwbGFjZW1lbnQuc2VsZWN0ZWQnKS5hZGRDbGFzcygndHJhbnNpdGlvbi0zJyk7XG4gICAgfSwgMzAwMCk7XG4gICAgLyogNyAtIFNQT1RMSUdIVCBIVE1MICovXG4gICAgc2V0VGltZW91dChmdW5jdGlvbigpIHtcbiAgICAgICAgZ2VuZXJhdGVUaW1lbGluZShzZWxlY3RlZFBsYXllcik7XG4gICAgICAgIGpRdWVyeSgnLnBsYXllci1ib3gucmVwbGFjZW1lbnQuc2VsZWN0ZWQnKS5jbG9uZSgpLmFwcGVuZFRvKCcuYmxvY2std3JhcC5wbGF5ZXItc3BvdGxpZ2h0IC50b3Atd3JhcCcpO1xuICAgICAgICBqUXVlcnkoJy5wbGF5ZXItc3BvdGxpZ2h0IC5zZWxlY3RlZCcpLmFkZENsYXNzKCcuYXBwZW5kZWQnKTtcbiAgICAgICAgalF1ZXJ5KCcuYmxvY2std3JhcC5wbGF5ZXItc3BvdGxpZ2h0JykuYWRkQ2xhc3MoJ3RyYW5zaXRpb24tMScpO1xuICAgICAgICBqUXVlcnkoJy5ibG9jay13cmFwLnNvY2lhbCcpLmFkZENsYXNzKCd0cmFuc2l0aW9uLTEnKTtcbiAgICAgICAgdmFyIHN0YXRzID0gcm9zdGVyT2JqLmNlbHRpY3Mucm9zdGVyW3NlbGVjdGVkUGxheWVyXS5zdGF0cztcbiAgICAgICAgalF1ZXJ5KCcucGxheWVyLXNwb3RsaWdodCAudG9wLXdyYXAgLnBsYXllci10b3AnKS5hcHBlbmQoJzxpbWcgY2xhc3M9XCJzaWxvIGFwcGVuZGVkXCIgc3JjPVwiaHR0cDovL2lvLmNubi5uZXQvbmJhL25iYS8uZWxlbWVudC9tZWRpYS8yLjAvdGVhbXNpdGVzL2NlbHRpY3MvbWVkaWEvc2lsby00NjZ4NTkxLScgKyByb3N0ZXJPYmouY2VsdGljcy5yb3N0ZXJbc2VsZWN0ZWRQbGF5ZXJdLnBpZCArICcucG5nXCIgLz48ZGl2IGNsYXNzPVwidG9wIGFwcGVuZGVkXCI+PGRpdiBjbGFzcz1cInBsYXllci1uYW1lLXdyYXBcIj48cCBjbGFzcz1cInBsYXllci1uYW1lXCI+PHNwYW4+JyArIHJvc3Rlck9iai5jZWx0aWNzLnJvc3RlcltzZWxlY3RlZFBsYXllcl0uZm4udG9VcHBlckNhc2UoKSArICc8L3NwYW4+IDxicj4gJyArIHJvc3Rlck9iai5jZWx0aWNzLnJvc3RlcltzZWxlY3RlZFBsYXllcl0ubG4udG9VcHBlckNhc2UoKSArICc8L3A+PC9kaXY+PHAgY2xhc3M9XCJwbGF5ZXItbnVtYmVyXCI+JyArIHJvc3Rlck9iai5jZWx0aWNzLnJvc3RlcltzZWxlY3RlZFBsYXllcl0ubnVtICsgJzwvYnI+PHNwYW4+JyArIHJvc3Rlck9iai5jZWx0aWNzLnJvc3RlcltzZWxlY3RlZFBsYXllcl0ucG9zICsgJzwvc3Bhbj48L3A+PC9kaXY+PGRpdiBjbGFzcz1cIm1pZGRsZSBhcHBlbmRlZFwiPjx1bCBjbGFzcz1cImluZm8gY2xlYXJmaXhcIj48bGk+PHA+QUdFPHNwYW4gY2xhc3M9XCJzbS1oaWRlXCI+OiZuYnNwOzwvc3Bhbj4gPC9icj48c3BhbiBjbGFzcz1cImluZm8tdmFsdWVcIj4nICsgcGxheWVyQWdlKHJvc3Rlck9iai5jZWx0aWNzLnJvc3RlcltzZWxlY3RlZFBsYXllcl0uZG9iKSArICc8L3NwYW4+PC9wPjwvbGk+PGxpPjxwPkhUPHNwYW4gY2xhc3M9XCJzbS1oaWRlXCI+OiZuYnNwOzwvc3Bhbj4gPC9icj48c3BhbiBjbGFzcz1cImluZm8tdmFsdWVcIj4nICsgcm9zdGVyT2JqLmNlbHRpY3Mucm9zdGVyW3NlbGVjdGVkUGxheWVyXS5odCArICc8L3NwYW4+PC9wPjwvbGk+PGxpPjxwPldUPHNwYW4gY2xhc3M9XCJzbS1oaWRlXCI+OiZuYnNwOzwvc3Bhbj4gPC9icj48c3BhbiBjbGFzcz1cImluZm8tdmFsdWVcIj4nICsgcm9zdGVyT2JqLmNlbHRpY3Mucm9zdGVyW3NlbGVjdGVkUGxheWVyXS53dCArICc8L3NwYW4+PC9wPjwvbGk+PC91bD48L2Rpdj48ZGl2IGNsYXNzPVwiYm90dG9tIGZ1bGwgY2xlYXJmaXggc20taGlkZSBhcHBlbmRlZFwiPjx0YWJsZSBjbGFzcz1cImF2ZXJhZ2VzXCI+PHRyIGNsYXNzPVwiYXZlcmFnZXMtbGFiZWxzXCI+PHRkPjxwPkdQPC9wPjwvdGQ+PHRkPjxwPlBQRzwvcD48L3RkPjx0ZD48cD5SUEc8L3A+PC90ZD48dGQ+PHA+QVBHPC9wPjwvdGQ+PC90cj48dHIgY2xhc3M9XCJhdmVyYWdlcy1zZWFzb25cIj48dGQgY2xhc3M9XCJncFwiPjxwPjwvcD48L3RkPjx0ZCBjbGFzcz1cInB0c1wiPjxwPjwvcD48L3RkPjx0ZCBjbGFzcz1cInJlYlwiPjxwPjwvcD48L3RkPjx0ZCBjbGFzcz1cImFzdFwiPjxwPjwvcD48L3RkPjwvdHI+PC90YWJsZT48L2Rpdj4nKTtcbiAgICAgICAgalF1ZXJ5KFwiLnBsYXllci1zcG90bGlnaHQgLmF2ZXJhZ2VzLXNlYXNvblwiKS5odG1sKCc8dGQ+PHA+JyArIHN0YXRzLnNhWzBdLmdwICsgJzwvcD48L3RkPjx0ZD48cD4nICsgc3RhdHMuc2FbMF0ucHRzICsgJzwvcD48L3RkPjx0ZD48cD4nICsgc3RhdHMuc2FbMF0ucmViICsgJzwvcD48L3RkPjx0ZD48cD4nICsgc3RhdHMuc2FbMF0uYXN0ICsgJzwvcD48L3RkPicpO1xuICAgICAgICBqUXVlcnkoJy5wbGF5ZXItc3BvdGxpZ2h0IC5wbGF5ZXItbmFtZScpLmZhZGVUbygyMDAsIDEpO1xuICAgICAgICB2YXIgcGxheWVyRmFjdHMgPSByb3N0ZXJPYmouY2VsdGljcy5yb3N0ZXJbc2VsZWN0ZWRQbGF5ZXJdLmJpby5wZXJzb25hbDtcbiAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCAzOyBpKyspIHtcbiAgICAgICAgICAgIHZhciBmYWN0SW5kZXggPSBNYXRoLmZsb29yKE1hdGgucmFuZG9tKCkgKiBwbGF5ZXJGYWN0cy5sZW5ndGgpO1xuICAgICAgICAgICAgalF1ZXJ5KCcucGxheWVyLXNwb3RsaWdodCAuYm90dG9tLXdyYXAnKS5hcHBlbmQoJzxkaXYgY2xhc3M9XCJkeWstYm94IGFwcGVuZGVkXCI+PHA+JyArIHBsYXllckZhY3RzW2ZhY3RJbmRleF0gKyAnPC9wPjwvZGl2PicpO1xuICAgICAgICB9O1xuICAgICAgICBqUXVlcnkoJy5wbGF5ZXItc3BvdGxpZ2h0IC5ib3R0b20td3JhcCcpLmFkZENsYXNzKCd0cmFuc2l0aW9uLTEnKTtcbiAgICAgICAgc2V0VGltZW91dChmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIGpRdWVyeSgnLnBsYXllci1zcG90bGlnaHQgLmJvdHRvbS13cmFwIC5keWstYm94Om50aC1vZi10eXBlKDIpJykuYWRkQ2xhc3MoJ3RyYW5zaXRpb24tMicpO1xuICAgICAgICAgICAgalF1ZXJ5KCcucGxheWVyLXNwb3RsaWdodCAuYm90dG9tLXdyYXAgLmR5ay1ib3g6bnRoLW9mLXR5cGUoMyknKS5hZGRDbGFzcygndHJhbnNpdGlvbi0xJyk7XG4gICAgICAgIH0sIDEwMDApO1xuICAgICAgICBzZXRUaW1lb3V0KGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgalF1ZXJ5KCcucGxheWVyLXNwb3RsaWdodCAuYm90dG9tLXdyYXAgLmR5ay1ib3g6bnRoLW9mLXR5cGUoMyknKS5hZGRDbGFzcygndHJhbnNpdGlvbi0yJyk7XG4gICAgICAgICAgICBqUXVlcnkoJy5wbGF5ZXItc3BvdGxpZ2h0IC5ib3R0b20td3JhcCAuZHlrLWJveDpudGgtb2YtdHlwZSg0KScpLmFkZENsYXNzKCd0cmFuc2l0aW9uLTEnKTtcbiAgICAgICAgfSwgMTUwMCk7XG4gICAgfSwgMzYwMCk7XG4gICAgLyogOCAtIFNQT1RMSUdIVCBTTElERSBJTiAqL1xuICAgIHNldFRpbWVvdXQoZnVuY3Rpb24oKSB7XG4gICAgICAgIGpRdWVyeSgnLnBsYXllci1zcG90bGlnaHQgLnBsYXllci10b3AgLnBsYXllci1uYW1lLCAucGxheWVyLXNwb3RsaWdodCAucGxheWVyLW5hbWUtd3JhcCwgLnBsYXllci1zcG90bGlnaHQgLmhlYWRzaG90LCAucGxheWVyLXNwb3RsaWdodCAuaW5mbywgLnBsYXllci1zcG90bGlnaHQgLnNpbG8sIC5wbGF5ZXItc3BvdGxpZ2h0IC5hdmVyYWdlcywgLnBsYXllci1zcG90bGlnaHQgLnBsYXllci1udW1iZXInKS5hZGRDbGFzcygndHJhbnNpdGlvbi0xJyk7XG4gICAgICAgIHNldFRpbWVvdXQoZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICBqUXVlcnkoJy5ibG9jay13cmFwLnBsYXllci1zcG90bGlnaHQgLnBsYXllci1ib3gnKS5yZW1vdmUoKTtcbiAgICAgICAgfSwgNDAwMCk7XG4gICAgICAgIGlmIChwbGF5ZXJTcG90bGlnaHRDb3VudGVyIDwgMTYpIHtcbiAgICAgICAgICAgIHBsYXllclNwb3RsaWdodENvdW50ZXIrKztcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHBsYXllclNwb3RsaWdodENvdW50ZXIgPSAwO1xuICAgICAgICB9XG4gICAgfSwgNDEwMCk7XG4gICAgLyogOSAtIFNQT1RMSUdIVCBTTElERSBPVVQgKi9cbiAgICBzZXRUaW1lb3V0KGZ1bmN0aW9uKCkge1xuICAgICAgICBqUXVlcnkoJy5wbGF5ZXItc3BvdGxpZ2h0IC5ib3R0b20td3JhcCwgLnBsYXllci1zcG90bGlnaHQgLnRvcC13cmFwJykuYWRkQ2xhc3MoJ3RyYW5zaXRpb24tMicpO1xuICAgIH0sIDYwMDApO1xuICAgIC8qIDEwIC0gRE9ORS4gUkVNT1ZFIFRIQVQgU0hJVCAqL1xuICAgIHNldFRpbWVvdXQoZnVuY3Rpb24oKSB7XG4gICAgICAgIGpRdWVyeSgnLmFwcGVuZGVkJykucmVtb3ZlKCk7XG4gICAgICAgIGpRdWVyeSgnLnRyYW5zaXRpb24sIC50cmFuc2l0aW9uLTEsIC50cmFuc2l0aW9uLTIsIC50cmFuc2l0aW9uLTMsIC50cmFuc2l0aW9uLTQnKS5yZW1vdmVDbGFzcygndHJhbnNpdGlvbiB0cmFuc2l0aW9uLTEgdHJhbnNpdGlvbi0yIHRyYW5zaXRpb24tMyB0cmFuc2l0aW9uLTQnKTtcbiAgICB9LCA3MDAwKTtcbn1cbi8qPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbj0gICAgICAgICAgICBMT0FEIFJPU1RFUiBJTkZPID0+IHJvc3Rlck9iaiAgICAgICAgICAgID1cbj09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09Ki9cbmZ1bmN0aW9uIGxvYWRSb3N0ZXJEYXRhKGF3YXlUZWFtKSB7XG4gICAgdmFyIHJvc3RlciA9ICcnO1xuICAgIGpRdWVyeS5hamF4KHtcbiAgICAgICAgdXJsOiAnaHR0cDovL2xvY2FsaG9zdDo4ODg4L2RhdGEvbW9iaWxlLXN0YXRzLWZlZWQvY2VsdGljc19yb3N0ZXIuanNvbicsXG4gICAgICAgIGFzeW5jOiBmYWxzZSxcbiAgICAgICAgc3VjY2VzczogZnVuY3Rpb24oZGF0YSkge1xuICAgICAgICAgICAgcm9zdGVyID0gZGF0YTtcbiAgICAgICAgICAgIGZvciAodmFyIHByb3BlcnR5IGluIHJvc3Rlci50KXtcbiAgICAgICAgICAgICAgICBpZiAocHJvcGVydHkgIT09ICdwbCcpe1xuICAgICAgICAgICAgICAgICAgICByb3N0ZXJPYmouY2VsdGljc1twcm9wZXJ0eV0gPSByb3N0ZXIudFtwcm9wZXJ0eV07XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9LFxuICAgICAgICBlcnJvcjogZnVuY3Rpb24oKSB7fVxuICAgIH0pO1xuICAgIHZhciBhd2F5Um9zdGVyID0gJyc7XG4gICAgalF1ZXJ5LmFqYXgoe1xuICAgICAgICB1cmw6ICdodHRwOi8vbG9jYWxob3N0Ojg4ODgvZGF0YS9tb2JpbGUtc3RhdHMtZmVlZC9hd2F5X3Jvc3Rlci5qc29uJyxcbiAgICAgICAgYXN5bmM6IGZhbHNlLFxuICAgICAgICBzdWNjZXNzOiBmdW5jdGlvbihkYXRhKSB7XG4gICAgICAgICAgICBhd2F5Um9zdGVyID0gZGF0YTtcbiAgICAgICAgICAgIGZvciAodmFyIHByb3BlcnR5IGluIGF3YXlSb3N0ZXIudCl7XG4gICAgICAgICAgICAgICAgaWYgKHByb3BlcnR5ICE9PSAncGwnKXtcbiAgICAgICAgICAgICAgICAgICAgcm9zdGVyT2JqLmF3YXlbcHJvcGVydHldID0gYXdheVJvc3Rlci50W3Byb3BlcnR5XTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH0sXG4gICAgICAgIGVycm9yOiBmdW5jdGlvbigpIHt9XG4gICAgfSk7XG4gICAgdmFyIGJpb0RhdGEgPSAnJztcbiAgICBqUXVlcnkuYWpheCh7XG4gICAgICAgIHVybDogJ2h0dHA6Ly9sb2NhbGhvc3Q6ODg4OC9kYXRhL2Jpby1kYXRhLmpzb24nLFxuICAgICAgICBhc3luYzogZmFsc2UsXG4gICAgICAgIHN1Y2Nlc3M6IGZ1bmN0aW9uKGRhdGEpIHtcbiAgICAgICAgICAgIGJpb0RhdGEgPSBkYXRhO1xuICAgICAgICB9LFxuICAgICAgICBlcnJvcjogZnVuY3Rpb24oKSB7fVxuICAgIH0pO1xuICAgIGZvciAodmFyIGkgPSAwOyBpIDwgcm9zdGVyLnQucGwubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgdmFyIHBpZCA9IHJvc3Rlci50LnBsW2ldLnBpZDtcbiAgICAgICAgcm9zdGVyT2JqLmNlbHRpY3Mucm9zdGVyW3BpZF0gPSByb3N0ZXIudC5wbFtpXTtcbiAgICAgICAgZm9yICh2YXIgcHJvcGVydHkgaW4gYmlvRGF0YVtwaWRdKSB7XG4gICAgICAgICAgICByb3N0ZXJPYmouY2VsdGljcy5yb3N0ZXJbcGlkXS5iaW8gPSBiaW9EYXRhW3BpZF07XG4gICAgICAgIH07XG4gICAgICAgIGpRdWVyeS5hamF4KHtcbiAgICAgICAgICAgIHVybDogJ2h0dHA6Ly9sb2NhbGhvc3Q6ODg4OC9kYXRhL21vYmlsZS1zdGF0cy1mZWVkL3BsYXllcmNhcmRzL3BsYXllcmNhcmQtJyArIHBpZCArICcuanNvbicsXG4gICAgICAgICAgICBhc3luYzogZmFsc2UsXG4gICAgICAgICAgICBzdWNjZXNzOiBmdW5jdGlvbihkYXRhKSB7XG4gICAgICAgICAgICAgICAgcm9zdGVyT2JqLmNlbHRpY3Mucm9zdGVyW3BpZF0uc3RhdHMgPSBkYXRhLnBsLmNhO1xuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIGVycm9yOiBmdW5jdGlvbigpIHt9XG4gICAgICAgIH0pO1xuICAgIH1cbiAgICBmb3IgKHZhciBpID0gMDsgaSA8IGF3YXlSb3N0ZXIudC5wbC5sZW5ndGg7IGkrKykge1xuICAgICAgICB2YXIgcGlkID0gYXdheVJvc3Rlci50LnBsW2ldLnBpZDtcbiAgICAgICAgcm9zdGVyT2JqLmF3YXkucm9zdGVyW3BpZF0gPSBhd2F5Um9zdGVyLnQucGxbaV07XG4gICAgICAgIGpRdWVyeS5hamF4KHtcbiAgICAgICAgICAgIHVybDogJ2h0dHA6Ly9sb2NhbGhvc3Q6ODg4OC9kYXRhL21vYmlsZS1zdGF0cy1mZWVkL3BsYXllcmNhcmRzL3BsYXllcmNhcmQtMjAyMzMwLmpzb24nLCAvLyBDSEFOR0UgUElEXG4gICAgICAgICAgICBhc3luYzogZmFsc2UsXG4gICAgICAgICAgICBzdWNjZXNzOiBmdW5jdGlvbihkYXRhKSB7XG4gICAgICAgICAgICAgICAgcm9zdGVyT2JqLmF3YXkucm9zdGVyW3BpZF0uc3RhdHMgPSBkYXRhLnBsLmNhO1xuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIGVycm9yOiBmdW5jdGlvbigpIHt9XG4gICAgICAgIH0pO1xuICAgIH1cbiAgICBmb3IgKHZhciB0ZWFtIGluIHJvc3Rlck9iaikge1xuICAgICAgICBmb3IgKHZhciBwbGF5ZXIgaW4gcm9zdGVyT2JqW3RlYW1dLnJvc3Rlcikge1xuICAgICAgICAgICAgdmFyIHB0TGVhZGVycyA9IHJvc3Rlck9ialt0ZWFtXS5sZWFkZXJzLnB0cztcbiAgICAgICAgICAgIHZhciBhc3RMZWFkZXJzID0gcm9zdGVyT2JqW3RlYW1dLmxlYWRlcnMuYXN0O1xuICAgICAgICAgICAgdmFyIHJlYkxlYWRlcnMgPSByb3N0ZXJPYmpbdGVhbV0ubGVhZGVycy5yZWI7XG4gICAgICAgICAgICBmb3IgKHZhciBzdGF0IGluIHJvc3Rlck9ialt0ZWFtXS5sZWFkZXJzKSB7XG4gICAgICAgICAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCAzOyBpKyspIHtcbiAgICAgICAgICAgICAgICAgICAgaWYgKHJvc3Rlck9ialt0ZWFtXS5sZWFkZXJzW3N0YXRdW2ldWzJdID09ICctLScgJiYgcm9zdGVyT2JqW3RlYW1dLnJvc3RlcltwbGF5ZXJdLnN0YXRzW3N0YXRdID4gMCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgcm9zdGVyT2JqW3RlYW1dLmxlYWRlcnNbc3RhdF1baV1bMF0gPSByb3N0ZXJPYmpbdGVhbV0ucm9zdGVyW3BsYXllcl0uZm4udG9VcHBlckNhc2UoKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJvc3Rlck9ialt0ZWFtXS5sZWFkZXJzW3N0YXRdW2ldWzFdID0gcm9zdGVyT2JqW3RlYW1dLnJvc3RlcltwbGF5ZXJdLmxuLnRvVXBwZXJDYXNlKCk7XG4gICAgICAgICAgICAgICAgICAgICAgICByb3N0ZXJPYmpbdGVhbV0ubGVhZGVyc1tzdGF0XVtpXVsyXSA9IHJvc3Rlck9ialt0ZWFtXS5yb3N0ZXJbcGxheWVyXS5zdGF0c1tzdGF0XTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJvc3Rlck9ialt0ZWFtXS5sZWFkZXJzW3N0YXRdW2ldWzNdID0gcm9zdGVyT2JqW3RlYW1dLnJvc3RlcltwbGF5ZXJdLnBpZDtcbiAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgICAgICB9IGVsc2UgaWYgKHJvc3Rlck9ialt0ZWFtXS5yb3N0ZXJbcGxheWVyXS5zdGF0c1tzdGF0XSA+IHJvc3Rlck9ialt0ZWFtXS5sZWFkZXJzW3N0YXRdW2ldWzJdICYmIHJvc3Rlck9ialt0ZWFtXS5yb3N0ZXJbcGxheWVyXS5zdGF0c1tzdGF0XSA+IDApIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJvc3Rlck9ialt0ZWFtXS5sZWFkZXJzW3N0YXRdW2ldWzBdID0gcm9zdGVyT2JqW3RlYW1dLnJvc3RlcltwbGF5ZXJdLmZuLnRvVXBwZXJDYXNlKCk7XG4gICAgICAgICAgICAgICAgICAgICAgICByb3N0ZXJPYmpbdGVhbV0ubGVhZGVyc1tzdGF0XVtpXVsxXSA9IHJvc3Rlck9ialt0ZWFtXS5yb3N0ZXJbcGxheWVyXS5sbi50b1VwcGVyQ2FzZSgpO1xuICAgICAgICAgICAgICAgICAgICAgICAgcm9zdGVyT2JqW3RlYW1dLmxlYWRlcnNbc3RhdF1baV1bMl0gPSByb3N0ZXJPYmpbdGVhbV0ucm9zdGVyW3BsYXllcl0uc3RhdHNbc3RhdF07XG4gICAgICAgICAgICAgICAgICAgICAgICByb3N0ZXJPYmpbdGVhbV0ubGVhZGVyc1tzdGF0XVtpXVszXSA9IHJvc3Rlck9ialt0ZWFtXS5yb3N0ZXJbcGxheWVyXS5waWQ7XG4gICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH07XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9XG4gICAgY29uc29sZS5sb2cocm9zdGVyT2JqKTtcbn07XG5cbmZ1bmN0aW9uIHN0YXRzTm90QXZhaWxhYmxlKHBpZCkge1xuICAgIHJvc3Rlck9ialtwaWRdLnN0YXRzID0ge307XG4gICAgcm9zdGVyT2JqW3BpZF0uc3RhdHMuc2EgPSBbe31dO1xuICAgIHJvc3Rlck9ialtwaWRdLnN0YXRzLmhhc1N0YXRzID0gZmFsc2U7XG4gICAgdmFyIGNhSW5kZXggPSBbJ2dwJywgJ2dzJywgJ21pbicsICdmZ3AnLCAndHBwJywgJ2Z0cCcsICdvcmViJywgJ2RyZWInLCAncmViJywgJ2FzdCcsICdzdGwnLCAnYmxrJywgJ3RvdicsICdwZicsICdwdHMnLCAnbm9zdGF0cyddO1xuICAgIHZhciBzYUluZGV4ID0gWyd0aWQnLCAndmFsJywgJ2dwJywgJ2dzJywgJ21pbicsICdmZ3AnLCAndHBwJywgJ2Z0cCcsICdvcmViJywgJ2RyZWInLCAncmViJywgJ2FzdCcsICdzdGwnLCAnYmxrJywgJ3RvdicsICdwZicsICdwdHMnLCAnc3BsJywgJ3RhJywgJ3RuJywgJ3RjJ107XG4gICAgZm9yICh2YXIgaSA9IDA7IGkgPCBzYUluZGV4Lmxlbmd0aDsgaSsrKSB7XG4gICAgICAgIHJvc3Rlck9ialtwaWRdLnN0YXRzLnNhWzBdW3NhSW5kZXhbaV1dID0gXCJOL0FcIjtcbiAgICAgICAgaWYgKGkgPT09IDEpIHtcbiAgICAgICAgICAgIHJvc3Rlck9ialtwaWRdLnN0YXRzLnNhWzBdW3NhSW5kZXhbaV1dID0gcGxheWVyQ2FyZFllYXIudG9TdHJpbmcoKS5zdWJzdHIoMiwgMikgKyBcIi1cIiArIChwbGF5ZXJDYXJkWWVhciArIDEpLnRvU3RyaW5nKCkuc3Vic3RyKDIsIDIpO1xuICAgICAgICB9XG4gICAgICAgIGlmIChpID09PSAxNykge1xuICAgICAgICAgICAgcm9zdGVyT2JqW3BpZF0uc3RhdHMuc2FbMF1bc2FJbmRleFtpXV0gPSBbXTtcbiAgICAgICAgfVxuICAgICAgICBpZiAoaSA9PT0gMTgpIHtcbiAgICAgICAgICAgIHJvc3Rlck9ialtwaWRdLnN0YXRzLnNhWzBdW3NhSW5kZXhbaV1dID0gJ0JPUyc7XG4gICAgICAgIH1cbiAgICB9XG4gICAgZm9yICh2YXIgaSA9IDA7IGkgPCBjYUluZGV4Lmxlbmd0aDsgaSsrKSB7XG4gICAgICAgIHJvc3Rlck9ialtwaWRdLnN0YXRzW2NhSW5kZXhbaV1dID0gXCJOL0FcIjtcbiAgICAgICAgaWYgKGkgPT09IDE1KSB7XG4gICAgICAgICAgICByb3N0ZXJPYmpbcGlkXS5zdGF0c1tjYUluZGV4W2ldXSA9IHRydWU7XG4gICAgICAgIH1cbiAgICB9XG59O1xuXG5mdW5jdGlvbiBsb2FkR2FtZURldGFpbChnaWQpIHt9O1xuXG5mdW5jdGlvbiBsb2FkQXdheVRlYW1EYXRhKCkge31cbi8qPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG49ICAgICAgICAgICAgU1RBVCBMRUFERVJTICAgICAgICAgICAgPVxuPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09Ki9cblxuZnVuY3Rpb24gbGVhZGVycyhnaWQsIGdhbWVTdGFydGVkKSB7XG4gICAgdmFyIGdhbWVEZXRhaWwgPSAnJztcbiAgICB2YXIgZGV0YWlsQXZhaWxhYmxlID0gZmFsc2U7XG4gICAgZ2FtZVN0YXJ0ZWQgPSB0cnVlOyAvLyBETzogREVMRVRFIFRISVMgV0hFTiBPTkxJTkUuIEpVU1QgRk9SIFRFU1RJTkcgUFVSUE9TRVMgUk5cbiAgICBpZiAoZ2FtZVN0YXJ0ZWQpIHtcbiAgICAgICAgalF1ZXJ5LmFqYXgoe1xuICAgICAgICAgICAgdXJsOiAnaHR0cDovL2xvY2FsaG9zdDo4ODg4L2RhdGEvbW9iaWxlLXN0YXRzLWZlZWQvZ2FtZWRldGFpbC5qc29uJyxcbiAgICAgICAgICAgIGFzeW5jOiBmYWxzZSxcbiAgICAgICAgICAgIHN1Y2Nlc3M6IGZ1bmN0aW9uKGRhdGEpIHtcbiAgICAgICAgICAgICAgICAvLyBETzogVVBEQVRFIFRIRSBMRUFERVIgT0JKRUNUU1xuICAgICAgICAgICAgICAgIGdhbWVEZXRhaWwgPSBkYXRhO1xuICAgICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICB9XG4gICAgZm9yICh2YXIgdGVhbSBpbiByb3N0ZXJPYmope1xuICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IDM7IGkrKyl7XG4gICAgICAgICAgICBmb3IgKHZhciBzdGF0IGluIHJvc3Rlck9ialt0ZWFtXS5sZWFkZXJzKXtcbiAgICAgICAgICAgICAgICAvLyBMRUFERVIgU1RBVCBWQUxVRVxuICAgICAgICAgICAgICAgIGpRdWVyeSgnLmxlYWRlci1zZWN0aW9uOm50aC1vZi10eXBlKCcgKyAoaSArIDIpICsgJykgLicgKyBzdGF0ICsgJy4nICsgdGVhbSArICcgLnN0YXQnKS5hcHBlbmQoJzxzcGFuIGNsYXNzPVwiJyArIHJvc3Rlck9ialt0ZWFtXS50YSArJ1wiPicgKyByb3N0ZXJPYmpbdGVhbV0ubGVhZGVyc1tzdGF0XVtpXVsyXSArICc8L3NwYW4+ICcgKyBzdGF0LnRvVXBwZXJDYXNlKCkpO1xuICAgICAgICAgICAgICAgIC8vIExFQURFUiBOQU1FXG4gICAgICAgICAgICAgICAgaWYgKHJvc3Rlck9ialt0ZWFtXS5sZWFkZXJzW3N0YXRdW2ldWzBdLmxlbmd0aCArIHJvc3Rlck9ialt0ZWFtXS5sZWFkZXJzW3N0YXRdW2ldWzFdLmxlbmd0aCA+PSAxNSl7XG4gICAgICAgICAgICAgICAgICAgIHJvc3Rlck9ialt0ZWFtXS5sZWFkZXJzW3N0YXRdW2ldWzBdID0gcm9zdGVyT2JqW3RlYW1dLmxlYWRlcnNbc3RhdF1baV1bMF0uc3Vic3RyKDAsMSkgKyAnLic7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGpRdWVyeSgnLmxlYWRlci1zZWN0aW9uOm50aC1vZi10eXBlKCcgKyAoaSArIDIpICsgJykgLicgKyBzdGF0ICsgJy4nICsgdGVhbSArICcgLm5hbWUnKS5hcHBlbmQoJzxzcGFuPicgKyByb3N0ZXJPYmpbdGVhbV0ubGVhZGVyc1tzdGF0XVtpXVswXSArICc8L3NwYW4+ICcgKyByb3N0ZXJPYmpbdGVhbV0ubGVhZGVyc1tzdGF0XVtpXVsxXSk7XG4gICAgICAgICAgICAgICAgLy8gTEVBREVSIEhFQURTSE9UXG4gICAgICAgICAgICAgICAgalF1ZXJ5KCcubGVhZGVyLXNlY3Rpb246bnRoLW9mLXR5cGUoJyArIChpICsgMikgKyAnKSAuJyArIHN0YXQgKyAnLicgKyB0ZWFtICsgJyAuaGVhZHNob3QnKS5hdHRyKCdzcmMnLCdodHRwczovL2FrLXN0YXRpYy5jbXMubmJhLmNvbS93cC1jb250ZW50L3VwbG9hZHMvaGVhZHNob3RzL25iYS9sYXRlc3QvMTA0MHg3NjAvJyArIHJvc3Rlck9ialt0ZWFtXS5sZWFkZXJzW3N0YXRdW2ldWzNdICsgJy5wbmcnKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cbiAgICB2YXIgdGltZUJldHdlZW4gPSAxMDAwO1xuICAgIGpRdWVyeSgnLmxlYWRlcnMsIC5sZWFkZXJzIC5ibG9jay1pbm5lcicpLmFkZENsYXNzKCd0cmFuc2l0aW9uLTEnKTtcbiAgICBzZXRUaW1lb3V0KGZ1bmN0aW9uKCkge1xuICAgICAgICBqUXVlcnkoJy5sZWFkZXJzIC5sZWFkZXItc2VjdGlvbicpLmFkZENsYXNzKCd0cmFuc2l0aW9uLTEnKTtcbiAgICAgICAgalF1ZXJ5KCcubGVhZGVyLXN1YnNlY3Rpb24uYm90dG9tIHA6bnRoLW9mLXR5cGUoMSknKS5hZGRDbGFzcygndHJhbnNpdGlvbi0xJyk7XG4gICAgICAgIGpRdWVyeSgnLmxlYWRlcnMgLmxlYWRlci1zZWN0aW9uIC51bmRlcmxpbmUsIC5sZWFkZXJzIC5sZWFkZXItc3Vic2VjdGlvbi50b3AnKS5hZGRDbGFzcyhyb3N0ZXJPYmouY2VsdGljcy50YSArICctYmcnKTtcbiAgICB9LCA4MDApO1xuICAgIHZhciB0cmFuc2l0aW9uQ291bnRlciA9IDE7XG4gICAgZm9yIChsZXQgaT0xOyBpIDw9IDY7IGkrKyl7XG4gICAgICAgIHNldFRpbWVvdXQoZnVuY3Rpb24obnVtYmVyU3RyaW5nKSB7XG4gICAgICAgICAgICBqUXVlcnkoJy5sZWFkZXJzIC5sZWFkZXItc2VjdGlvbiAubGVhZGVyLXN0YXQtd3JhcCcpLmFkZENsYXNzKCd0cmFuc2l0aW9uLScgKyBpKTtcbiAgICAgICAgICAgIGpRdWVyeSgnLmxlYWRlcnMgLmxlYWRlci1zZWN0aW9uIC51bmRlcmxpbmUsIC5sZWFkZXJzIC5sZWFkZXItc3Vic2VjdGlvbi50b3AnKS5yZW1vdmVDbGFzcyhyb3N0ZXJPYmouY2VsdGljcy50YSArICctYmcnKTtcbiAgICAgICAgICAgIGpRdWVyeSgnLmxlYWRlcnMgLmxlYWRlci1zZWN0aW9uIC51bmRlcmxpbmUsIC5sZWFkZXJzIC5sZWFkZXItc3Vic2VjdGlvbi50b3AnKS5hZGRDbGFzcyhyb3N0ZXJPYmouYXdheS50YSArICctYmcnKTtcbiAgICAgICAgICAgIGlmICh0cmFuc2l0aW9uQ291bnRlciAlIDIgPT0gMCl7XG4gICAgICAgICAgICAgICAgc2V0VGltZW91dChmdW5jdGlvbigpe1xuXG4gICAgICAgICAgICAgICAgICAgIGpRdWVyeSgnLmxlYWRlcnMgLmxlYWRlci1zZWN0aW9uIC51bmRlcmxpbmUsIC5sZWFkZXJzIC5sZWFkZXItc3Vic2VjdGlvbi50b3AnKS5yZW1vdmVDbGFzcyhyb3N0ZXJPYmouYXdheS50YSArICctYmcnKTtcbiAgICAgICAgICAgICAgICAgICAgalF1ZXJ5KCcubGVhZGVycyAubGVhZGVyLXNlY3Rpb24gLnVuZGVybGluZSwgLmxlYWRlcnMgLmxlYWRlci1zdWJzZWN0aW9uLnRvcCcpLmFkZENsYXNzKHJvc3Rlck9iai5jZWx0aWNzLnRhICsgJy1iZycpO1xuICAgICAgICAgICAgICAgICAgICBqUXVlcnkoJy5sZWFkZXItc3Vic2VjdGlvbi5ib3R0b20gcCcpLnJlbW92ZUNsYXNzKCd0cmFuc2l0aW9uLTEnKTtcbiAgICAgICAgICAgICAgICAgICAgalF1ZXJ5KCcubGVhZGVycyAubGVhZGVyLXNlY3Rpb24gLnVuZGVybGluZScpLmFkZENsYXNzKCd0cmFuc2l0aW9uLScgKyAoaS8yKSk7XG4gICAgICAgICAgICAgICAgICAgIGpRdWVyeSgnLmxlYWRlci1zdWJzZWN0aW9uLmJvdHRvbSBwOm50aC1vZi10eXBlKCcgKyAoaS0oaS8yKSsxKSArICcpJykuYWRkQ2xhc3MoJ3RyYW5zaXRpb24tMScpOyAvLyBsb2xcbiAgICAgICAgICAgICAgICB9LCAyMDApO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgdHJhbnNpdGlvbkNvdW50ZXIrKztcbiAgICAgICAgfSwgMjAwMCAqIGkpO1xuICAgIH1cbn07XG4vKj09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuPSAgICAgICAgICAgIFNPQ0lBTCAgICAgICAgICAgID1cbj09PT09PT09PT09PT09PT09PT09PT09PT09PT09PSovXG5mdW5jdGlvbiBzb2NpYWwocm9zdGVyKSB7fTtcbi8qPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuPSAgICAgICAgICAgIE1PQklMRSBBUFAgICAgICAgICAgICA9XG49PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09Ki9cbmZ1bmN0aW9uIGluaXRNb2JpbGVBcHAoKSB7XG4gICAgdmFyIGNvdW50ZXIgPSAxO1xuICAgIHNldEludGVydmFsKGZ1bmN0aW9uKCkge1xuICAgICAgICBqUXVlcnkoJy5hcHAgLmJvdHRvbS13cmFwIGltZycpLnJlbW92ZUNsYXNzKCdhY3RpdmUnKTtcbiAgICAgICAgalF1ZXJ5KCcuYXBwIC5mZWF0dXJlLWxpc3QgcCcpLnJlbW92ZUNsYXNzKCdhY3RpdmUnKTtcbiAgICAgICAgalF1ZXJ5KCcuYXBwIC5mZWF0dXJlLWxpc3QgcDpudGgtb2YtdHlwZSgnICsgY291bnRlciArICcpJykuYWRkQ2xhc3MoJ2FjdGl2ZScpO1xuICAgICAgICBqUXVlcnkoJy5hcHAgLmJvdHRvbS13cmFwIGltZzpudGgtb2YtdHlwZSgnICsgY291bnRlciArICcpJykuYWRkQ2xhc3MoJ2FjdGl2ZScpO1xuICAgICAgICBpZiAoY291bnRlciA9PSA1KSB7XG4gICAgICAgICAgICBjb3VudGVyID0gMTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGNvdW50ZXIrKztcbiAgICAgICAgfVxuICAgIH0sIDIwMDApO1xufTtcblxuZnVuY3Rpb24gbW9iaWxlQXBwKCkge1xuICAgIGpRdWVyeSgnLmFwcCcpLnNob3coKTtcbn07XG4vKj09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuPSAgICAgICAgICAgIFNUQU5ESU5HUyAgICAgICAgICAgID1cbj09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PSovXG5mdW5jdGlvbiBzdGFuZGluZ3MoYXdheVRlYW0pIHtcbiAgICBqUXVlcnkuYWpheCh7XG4gICAgICAgIHVybDogJ2h0dHA6Ly9sb2NhbGhvc3Q6ODg4OC9kYXRhL21vYmlsZS1zdGF0cy1mZWVkL3N0YW5kaW5ncy5qc29uJyxcbiAgICAgICAgYXN5bmM6IGZhbHNlLFxuICAgICAgICBzdWNjZXNzOiBmdW5jdGlvbihzdGFuZGluZ3NEYXRhKSB7XG4gICAgICAgICAgICBjb25zb2xlLmxvZyhcIllFQUFBQUhcIik7XG4gICAgICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IHN0YW5kaW5nc0RhdGEuc3RhLmNvLmxlbmd0aDsgaSsrKXtcbiAgICAgICAgICAgICAgICBmb3IgKGxldCB4ID0gMDsgeCA8IHN0YW5kaW5nc0RhdGEuc3RhLmNvW2ldLmRpLmxlbmd0aDsgeCsrKXtcbiAgICAgICAgICAgICAgICAgICAgZm9yIChsZXQgdCA9IDA7IHQgPCBzdGFuZGluZ3NEYXRhLnN0YS5jb1tpXS5kaVt4XS50Lmxlbmd0aDsgdCsrKXtcbiAgICAgICAgICAgICAgICAgICAgICAgIHZhciBjb25mZXJlbmNlcyA9IFsnLmVhc3QnLCcud2VzdCddO1xuICAgICAgICAgICAgICAgICAgICAgICAgdmFyIHBsYWNlID0gc3RhbmRpbmdzRGF0YS5zdGEuY29baV0uZGlbeF0udFt0XS5zZWU7XG4gICAgICAgICAgICAgICAgICAgICAgICB2YXIgc2VlZCA9ICcnO1xuICAgICAgICAgICAgICAgICAgICAgICAgdmFyIGFjdGl2ZVN0YXR1cyA9ICcnO1xuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHN0YW5kaW5nc0RhdGEuc3RhLmNvW2ldLmRpW3hdLnRbdF0uc2VlIDw9IDgpe1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHNlZWQgPSBzdGFuZGluZ3NEYXRhLnN0YS5jb1tpXS5kaVt4XS50W3RdLnNlZTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChzdGFuZGluZ3NEYXRhLnN0YS5jb1tpXS5kaVt4XS50W3RdLnRhID09ICdCT1MnKXtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBhY3RpdmVTdGF0dXMgPSAnYWN0aXZlJztcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChzdGFuZGluZ3NEYXRhLnN0YS5jb1tpXS5kaVt4XS50W3RdLnRhID09IGF3YXlUZWFtKXtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBhY3RpdmVTdGF0dXMgPSAnYWN0aXZlLWF3YXknO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgdmFyIHJvd0hUTUwgPSAnPGRpdiBjbGFzcz1cInBsYWNlXCI+JyArIHNlZWQgKyAnPC9kaXY+PGRpdiBjbGFzcz1cImxvZ28td3JhcFwiPjxpbWcgY2xhc3M9XCJsb2dvXCIgc3JjPWh0dHA6Ly9pLmNkbi50dXJuZXIuY29tL25iYS9uYmEvYXNzZXRzL2xvZ29zL3RlYW1zL3ByaW1hcnkvd2ViLycgKyBzdGFuZGluZ3NEYXRhLnN0YS5jb1tpXS5kaVt4XS50W3RdLnRhICsgJy5zdmc+PC9kaXY+PGRpdiBjbGFzcz1cInRlYW0gKyAnICsgc3RhbmRpbmdzRGF0YS5zdGEuY29baV0uZGlbeF0udFt0XS50YSArICdcIj4nICsgc3RhbmRpbmdzRGF0YS5zdGEuY29baV0uZGlbeF0udFt0XS50YSArICc8L2Rpdj48ZGl2IGNsYXNzPVwid2luc1wiPicgKyBzdGFuZGluZ3NEYXRhLnN0YS5jb1tpXS5kaVt4XS50W3RdLncgKyAnPC9kaXY+PGRpdiBjbGFzcz1cImxvc3Nlc1wiPicgKyBzdGFuZGluZ3NEYXRhLnN0YS5jb1tpXS5kaVt4XS50W3RdLmwgKyAnPC9kaXY+PGRpdiBjbGFzcz1cImdhbWVzLWJlaGluZFwiPicgKyBzdGFuZGluZ3NEYXRhLnN0YS5jb1tpXS5kaVt4XS50W3RdLmdiICsgJzwvZGl2Pic7XG4gICAgICAgICAgICAgICAgICAgICAgICBqUXVlcnkoY29uZmVyZW5jZXNbaV0gKyAnID4gZGl2Om50aC1jaGlsZCgnICsgKHBsYWNlICsgMSkgKyAnKScpLmh0bWwocm93SFRNTCk7XG4gICAgICAgICAgICAgICAgICAgICAgICBqUXVlcnkoY29uZmVyZW5jZXNbaV0gKyAnID4gZGl2Om50aC1jaGlsZCgnICsgKHBsYWNlICsgMSkgKyAnKScpLmFkZENsYXNzKGFjdGl2ZVN0YXR1cyk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9KTtcbn07XG4vKj09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG49ICAgICAgICAgICAgQVJPVU5EIFRIRSBMRUFHVUUgICAgICAgICAgICA9XG49PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PSovXG5mdW5jdGlvbiBzY29yZXMoKSB7fTsiXX0=
