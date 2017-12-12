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
    var gameStarted = false;
    var playerSpotlightCounter = 10;
    var date = new Date();
    jQuery.ajax({
        url: 'http://localhost:8888/data/mobile-stats-feed/todays_scores.json',
        async: false,
        success: function success(todaysScoresData) {
            var gid = '';
            for (var i = 0; i < todaysScoresData.gs.g.length; i++) {
                if (todaysScoresData.gs.g[i].h.ta == 'ORL') {
                    //CHANGE THIS
                    loadRosterData(todaysScoresData.gs.g[i].v.ta);
                    gid = todaysScoresData.gs.g[i].gid;
                    playerSpotlight(rosterObj, playerSpotlightCounter);
                }
            }
        }
    });
    // loadRosterData(); ONLY ONCE
    // initMobileApp();
    // mobileApp();
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
    for (i = 0; i < seasonsPlayed; i++) {
        var teamAbbreviation = rosterObj.celtics.roster[selectedPlayer].stats.sa[i].ta;
        var traded = rosterObj.celtics.roster[selectedPlayer].stats.sa[i].spl.length;
        var segmentInner = "";
        var title = "";
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
        jQuery(".player-spotlight .averages-season").html('<td><p>' + stats.seasonAvg[0].gp + '</p></td><td><p>' + stats.seasonAvg[0].pts + '</p></td><td><p>' + stats.seasonAvg[0].reb + '</p></td><td><p>' + stats.seasonAvg[0].ast + '</p></td>');
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
function standings() {};
/*=========================================
=            AROUND THE LEAGUE            =
=========================================*/
function aroundTheLeague() {};

},{}]},{},[1])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJzcmMvanMvY29uY291cnNlLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7QUNBQSxJQUFJLFlBQVk7QUFDWixhQUFTO0FBQ0wsZ0JBQVEsRUFESDtBQUVMLGlCQUFTO0FBQ0wsaUJBQUssQ0FBQyxDQUFDLElBQUQsRUFBTyxJQUFQLEVBQWEsSUFBYixFQUFtQixJQUFuQixDQUFELEVBQTJCLENBQUMsSUFBRCxFQUFPLElBQVAsRUFBYSxJQUFiLEVBQW1CLElBQW5CLENBQTNCLEVBQXFELENBQUMsSUFBRCxFQUFPLElBQVAsRUFBYSxJQUFiLEVBQW1CLElBQW5CLENBQXJELENBREE7QUFFTCxpQkFBSyxDQUFDLENBQUMsSUFBRCxFQUFPLElBQVAsRUFBYSxJQUFiLEVBQW1CLElBQW5CLENBQUQsRUFBMkIsQ0FBQyxJQUFELEVBQU8sSUFBUCxFQUFhLElBQWIsRUFBbUIsSUFBbkIsQ0FBM0IsRUFBcUQsQ0FBQyxJQUFELEVBQU8sSUFBUCxFQUFhLElBQWIsRUFBbUIsSUFBbkIsQ0FBckQsQ0FGQTtBQUdMLGlCQUFLLENBQUMsQ0FBQyxJQUFELEVBQU8sSUFBUCxFQUFhLElBQWIsRUFBbUIsSUFBbkIsQ0FBRCxFQUEyQixDQUFDLElBQUQsRUFBTyxJQUFQLEVBQWEsSUFBYixFQUFtQixJQUFuQixDQUEzQixFQUFxRCxDQUFDLElBQUQsRUFBTyxJQUFQLEVBQWEsSUFBYixFQUFtQixJQUFuQixDQUFyRDtBQUhBO0FBRkosS0FERztBQVNaLFVBQU07QUFDRixnQkFBUSxFQUROO0FBRUYsaUJBQVM7QUFDTCxpQkFBSyxDQUFDLENBQUMsSUFBRCxFQUFPLElBQVAsRUFBYSxJQUFiLEVBQW1CLElBQW5CLENBQUQsRUFBMkIsQ0FBQyxJQUFELEVBQU8sSUFBUCxFQUFhLElBQWIsRUFBbUIsSUFBbkIsQ0FBM0IsRUFBcUQsQ0FBQyxJQUFELEVBQU8sSUFBUCxFQUFhLElBQWIsRUFB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LENBQUU7QUFDMUI7OztBQUdBLFNBQVMsYUFBVCxHQUF5QjtBQUNyQixRQUFJLFVBQVUsQ0FBZDtBQUNBLGdCQUFZLFlBQVc7QUFDbkIsZUFBTyx1QkFBUCxFQUFnQyxXQUFoQyxDQUE0QyxRQUE1QztBQUNBLGVBQU8sc0JBQVAsRUFBK0IsV0FBL0IsQ0FBMkMsUUFBM0M7QUFDQSxlQUFPLHNDQUFzQyxPQUF0QyxHQUFnRCxHQUF2RCxFQUE0RCxRQUE1RCxDQUFxRSxRQUFyRTtBQUNBLGVBQU8sdUNBQXVDLE9BQXZDLEdBQWlELEdBQXhELEVBQTZELFFBQTdELENBQXNFLFFBQXRFO0FBQ0EsWUFBSSxXQUFXLENBQWYsRUFBa0I7QUFDZCxzQkFBVSxDQUFWO0FBQ0gsU0FGRCxNQUVPO0FBQ0g7QUFDSDtBQUNKLEtBVkQsRUFVRyxJQVZIO0FBV0g7O0FBRUQsU0FBUyxTQUFULEdBQXFCO0FBQ2pCLFdBQU8sTUFBUCxFQUFlLElBQWY7QUFDSDtBQUNEOzs7QUFHQSxTQUFTLFNBQVQsR0FBcUIsQ0FBRTtBQUN2Qjs7O0FBR0EsU0FBUyxlQUFULEdBQTJCLENBQUUiLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbiBlKHQsbixyKXtmdW5jdGlvbiBzKG8sdSl7aWYoIW5bb10pe2lmKCF0W29dKXt2YXIgYT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2lmKCF1JiZhKXJldHVybiBhKG8sITApO2lmKGkpcmV0dXJuIGkobywhMCk7dmFyIGY9bmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitvK1wiJ1wiKTt0aHJvdyBmLmNvZGU9XCJNT0RVTEVfTk9UX0ZPVU5EXCIsZn12YXIgbD1uW29dPXtleHBvcnRzOnt9fTt0W29dWzBdLmNhbGwobC5leHBvcnRzLGZ1bmN0aW9uKGUpe3ZhciBuPXRbb11bMV1bZV07cmV0dXJuIHMobj9uOmUpfSxsLGwuZXhwb3J0cyxlLHQsbixyKX1yZXR1cm4gbltvXS5leHBvcnRzfXZhciBpPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7Zm9yKHZhciBvPTA7bzxyLmxlbmd0aDtvKyspcyhyW29dKTtyZXR1cm4gc30pIiwidmFyIHJvc3Rlck9iaiA9IHtcbiAgICBjZWx0aWNzOiB7XG4gICAgICAgIHJvc3Rlcjoge30sXG4gICAgICAgIGxlYWRlcnM6IHtcbiAgICAgICAgICAgIHB0czogW1snLS0nLCAnLS0nLCAnLS0nLCAnLS0nXSwgWyctLScsICctLScsICctLScsICctLSddLCBbJy0tJywgJy0tJywgJy0tJywgJy0tJ11dLFxuICAgICAgICAgICAgYXN0OiBbWyctLScsICctLScsICctLScsICctLSddLCBbJy0tJywgJy0tJywgJy0tJywgJy0tJ10sIFsnLS0nLCAnLS0nLCAnLS0nLCAnLS0nXV0sXG4gICAgICAgICAgICByZWI6IFtbJy0tJywgJy0tJywgJy0tJywgJy0tJ10sIFsnLS0nLCAnLS0nLCAnLS0nLCAnLS0nXSwgWyctLScsICctLScsICctLScsICctLSddXVxuICAgICAgICB9XG4gICAgfSxcbiAgICBhd2F5OiB7XG4gICAgICAgIHJvc3Rlcjoge30sXG4gICAgICAgIGxlYWRlcnM6IHtcbiAgICAgICAgICAgIHB0czogW1snLS0nLCAnLS0nLCAnLS0nLCAnLS0nXSwgWyctLScsICctLScsICctLScsICctLSddLCBbJy0tJywgJy0tJywgJy0tJywgJy0tJ11dLFxuICAgICAgICAgICAgYXN0OiBbWyctLScsICctLScsICctLScsICctLSddLCBbJy0tJywgJy0tJywgJy0tJywgJy0tJ10sIFsnLS0nLCAnLS0nLCAnLS0nLCAnLS0nXV0sXG4gICAgICAgICAgICByZWI6IFtbJy0tJywgJy0tJywgJy0tJywgJy0tJ10sIFsnLS0nLCAnLS0nLCAnLS0nLCAnLS0nXSwgWyctLScsICctLScsICctLScsICctLSddXVxuICAgICAgICB9XG4gICAgfVxufTtcblxualF1ZXJ5KGRvY3VtZW50KS5yZWFkeShmdW5jdGlvbigpIHtcbiAgICB2YXIgZ2lkID0gJyc7XG4gICAgdmFyIGdhbWVTdGFydGVkID0gZmFsc2U7XG4gICAgdmFyIHBsYXllclNwb3RsaWdodENvdW50ZXIgPSAxMDtcbiAgICB2YXIgZGF0ZSA9IG5ldyBEYXRlKCk7XG4gICAgalF1ZXJ5LmFqYXgoe1xuICAgICAgICB1cmw6ICdodHRwOi8vbG9jYWxob3N0Ojg4ODgvZGF0YS9tb2JpbGUtc3RhdHMtZmVlZC90b2RheXNfc2NvcmVzLmpzb24nLFxuICAgICAgICBhc3luYzogZmFsc2UsXG4gICAgICAgIHN1Y2Nlc3M6IGZ1bmN0aW9uKHRvZGF5c1Njb3Jlc0RhdGEpIHtcbiAgICAgICAgICAgIHZhciBnaWQgPSAnJztcbiAgICAgICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgdG9kYXlzU2NvcmVzRGF0YS5ncy5nLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICAgICAgaWYgKHRvZGF5c1Njb3Jlc0RhdGEuZ3MuZ1tpXS5oLnRhID09ICdPUkwnKSB7IC8vQ0hBTkdFIFRISVNcbiAgICAgICAgICAgICAgICAgICAgbG9hZFJvc3RlckRhdGEodG9kYXlzU2NvcmVzRGF0YS5ncy5nW2ldLnYudGEpO1xuICAgICAgICAgICAgICAgICAgICBnaWQgPSB0b2RheXNTY29yZXNEYXRhLmdzLmdbaV0uZ2lkO1xuICAgICAgICAgICAgICAgICAgICBwbGF5ZXJTcG90bGlnaHQocm9zdGVyT2JqLCBwbGF5ZXJTcG90bGlnaHRDb3VudGVyKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9KTtcbiAgICAvLyBsb2FkUm9zdGVyRGF0YSgpOyBPTkxZIE9OQ0VcbiAgICAvLyBpbml0TW9iaWxlQXBwKCk7XG4gICAgLy8gbW9iaWxlQXBwKCk7XG4vKiAgICBzZXRUaW1lb3V0KGxlYWRlcnMoZ2lkLCBnYW1lU3RhcnRlZCksIDQwMCk7Ki9cbn0pO1xuLyo9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuPSAgICAgICAgICAgIE1JU0MgRlVOQ1RJT05TICAgICAgICAgICAgPVxuPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT0qL1xuZnVuY3Rpb24gcGxheWVyQWdlKGRvYikge1xuICAgIHZhciB0b2RheSA9IG5ldyBEYXRlKCk7XG4gICAgdmFyIGJpcnRoRGF0ZSA9IG5ldyBEYXRlKGRvYik7XG4gICAgdmFyIGFnZSA9IHRvZGF5LmdldEZ1bGxZZWFyKCkgLSBiaXJ0aERhdGUuZ2V0RnVsbFllYXIoKTtcbiAgICByZXR1cm4gYWdlO1xufVxuXG5mdW5jdGlvbiBnZW5lcmF0ZVRpbWVsaW5lKHNlbGVjdGVkUGxheWVyKSB7XG4gICAgLy8gQVBQRU5EOiBUSU1FTElORVxuICAgIHZhciBzZWFzb25zUGxheWVkID0gcm9zdGVyT2JqLmNlbHRpY3Mucm9zdGVyW3NlbGVjdGVkUGxheWVyXS5zdGF0cy5zYS5sZW5ndGg7XG4gICAgdmFyIHRpbWVsaW5lSFRNTCA9ICcnO1xuICAgIHZhciBzZWFzb25ZZWFySFRNTCA9ICcnO1xuICAgIGZvciAoaSA9IDA7IGkgPCBzZWFzb25zUGxheWVkOyBpKyspIHtcbiAgICAgICAgdmFyIHRlYW1BYmJyZXZpYXRpb24gPSByb3N0ZXJPYmouY2VsdGljcy5yb3N0ZXJbc2VsZWN0ZWRQbGF5ZXJdLnN0YXRzLnNhW2ldLnRhO1xuICAgICAgICB2YXIgdHJhZGVkID0gcm9zdGVyT2JqLmNlbHRpY3Mucm9zdGVyW3NlbGVjdGVkUGxheWVyXS5zdGF0cy5zYVtpXS5zcGwubGVuZ3RoO1xuICAgICAgICB2YXIgc2VnbWVudElubmVyID0gXCJcIjtcbiAgICAgICAgdmFyIHRpdGxlID0gXCJcIjtcbiAgICAgICAgaWYgKGkgPT09IDAgfHwgdGVhbUFiYnJldmlhdGlvbiAhPT0gcm9zdGVyT2JqLmNlbHRpY3Mucm9zdGVyW3NlbGVjdGVkUGxheWVyXS5zdGF0cy5zYVtpIC0gMV0udGEpIHsgLy8gSWYgdGhpcyBpcyBhIG5ldyB0ZWFtLCBzdGFydCB0aGUgdGVhbSB3cmFwLlxuICAgICAgICAgICAgdGl0bGUgPSB0ZWFtQWJicmV2aWF0aW9uO1xuICAgICAgICB9XG4gICAgICAgIGlmICh0cmFkZWQpIHtcbiAgICAgICAgICAgIGZvciAodmFyIHggPSAwOyB4IDwgdHJhZGVkOyB4KyspIHtcbiAgICAgICAgICAgICAgICB2YXIgZ3BUb3QgPSByb3N0ZXJPYmouY2VsdGljcy5yb3N0ZXJbc2VsZWN0ZWRQbGF5ZXJdLnN0YXRzLnNhW2ldLmdwO1xuICAgICAgICAgICAgICAgIHZhciBncCA9IHJvc3Rlck9iai5jZWx0aWNzLnJvc3RlcltzZWxlY3RlZFBsYXllcl0uc3RhdHMuc2FbaV0uc3BsW3hdLmdwO1xuICAgICAgICAgICAgICAgIHZhciBncFBlcmNlbnRhZ2UgPSBNYXRoLnJvdW5kKChncCAvIGdwVG90KSAqIDEwMCk7XG4gICAgICAgICAgICAgICAgdGVhbUFiYnJldmlhdGlvbiA9IHJvc3Rlck9iai5jZWx0aWNzLnJvc3RlcltzZWxlY3RlZFBsYXllcl0uc3RhdHMuc2FbaV0uc3BsW3hdLnRhO1xuICAgICAgICAgICAgICAgIGlmIChpID09PSAwIHx8IHRlYW1BYmJyZXZpYXRpb24gIT09IHJvc3Rlck9iai5jZWx0aWNzLnJvc3RlcltzZWxlY3RlZFBsYXllcl0uc3RhdHMuc2FbaSAtIDFdLnRhICYmIHRlYW1BYmJyZXZpYXRpb24gIT09IHJvc3Rlck9iai5jZWx0aWNzLnJvc3RlcltzZWxlY3RlZFBsYXllcl0uc3RhdHMuc2FbaSArIDFdLnRhKSB7IC8vIElmIHRoaXMgaXMgYSBuZXcgdGVhbSwgc3RhcnQgdGhlIHRlYW0gd3JhcC5cbiAgICAgICAgICAgICAgICAgICAgdGl0bGUgPSB0ZWFtQWJicmV2aWF0aW9uO1xuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIHRpdGxlID0gXCJcIjtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgc2VnbWVudElubmVyICs9ICc8ZGl2IGRhdGEtc2Vhc29uLXllYXI9XCInICsgc2Vhc29uWWVhclRleHQgKyAnXCIgZGF0YS10ZWFtPVwiJyArIHRlYW1BYmJyZXZpYXRpb24gKyAnXCIgc3R5bGU9XCJcIiBjbGFzcz1cInNlZ21lbnQtaW5uZXIgJyArIHRlYW1BYmJyZXZpYXRpb24gKyAnLWJnXCI+PHA+JyArIHRpdGxlICsgJzwvcD48L2Rpdj4nO1xuICAgICAgICAgICAgfVxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgc2VnbWVudElubmVyID0gJzxkaXYgZGF0YS1zZWFzb24teWVhcj1cIicgKyBzZWFzb25ZZWFyVGV4dCArICdcIiBkYXRhLXRlYW09XCInICsgdGVhbUFiYnJldmlhdGlvbiArICdcIiBjbGFzcz1cInNlZ21lbnQtaW5uZXIgJyArIHRlYW1BYmJyZXZpYXRpb24gKyAnLWJnXCI+PHA+JyArIHRpdGxlICsgJzwvcD48L2Rpdj4nO1xuICAgICAgICB9XG4gICAgICAgIHRpbWVsaW5lSFRNTCArPSAnPGRpdiBjbGFzcz1cInNlZ21lbnRcIj4nICsgc2VnbWVudElubmVyICsgJzwvZGl2Pic7XG4gICAgICAgIHNlYXNvblllYXJIVE1MICs9ICc8ZGl2IGNsYXNzPVwic2VnbWVudFwiPjxwPicgKyBzZWFzb25ZZWFyVGV4dCArICc8L3A+PC9kaXY+JztcbiAgICB9XG4gICAgalF1ZXJ5KFwiLnRpbWVsaW5lLXdyYXBcIikuaHRtbCgnPGRpdiBjbGFzcz1cInRpbWVsaW5lIGFwcGVuZGVkXCI+JyArIHRpbWVsaW5lSFRNTCArICc8L2Rpdj48ZGl2IGNsYXNzPVwic2Vhc29uLXllYXIgYXBwZW5kZWRcIj4nICsgc2Vhc29uWWVhckhUTUwgKyAnPC9kaXY+Jyk7XG59XG4vKj09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbj0gICAgICAgICAgICBJTklUSUFMSVpFICAgICAgICAgICAgPVxuPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PSovXG5mdW5jdGlvbiBpbml0KCkge1xuICAgIGlmICghZ2FtZVN0YXJ0ZWQpIHtcbiAgICAgICAgalF1ZXJ5LmFqYXgoe1xuICAgICAgICAgICAgdXJsOiAnaHR0cDovL2xvY2FsaG9zdDo4ODg4L2RhdGEvbW9iaWxlLXN0YXRzLWZlZWQvdG9kYXlzX3Njb3Jlcy5qc29uJyxcbiAgICAgICAgICAgIGFzeW5jOiBmYWxzZSxcbiAgICAgICAgICAgIHN1Y2Nlc3M6IGZ1bmN0aW9uKHRvZGF5c1Njb3Jlc0RhdGEpIHtcbiAgICAgICAgICAgICAgICB2YXIgZ2lkID0gJyc7XG4gICAgICAgICAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCB0b2RheXNTY29yZXNEYXRhLmdzLmcubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgICAgICAgICAgaWYgKHRvZGF5c1Njb3Jlc0RhdGEuZ3MuZ1tpXS5oLnRhID09ICdPUkwnKSB7IC8vIENIQU5HRSBUSElTIFRPICdCT1MnIFdIRU4gVEhFIFRJTUUgQ09NRVNcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmICh0b2RheXNTY29yZXNEYXRhLmdzLmdbaV0gIT09IDEpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBnYW1lU3RhcnRlZCA9IHRydWU7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgIH1cbn07XG4vKj09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbj0gICAgICAgICAgICBQTEFZRVIgU1BPVExJR0hUICAgICAgICAgICAgPVxuPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PSovXG5mdW5jdGlvbiBwbGF5ZXJTcG90bGlnaHQocm9zdGVyT2JqLCBwbGF5ZXJTcG90bGlnaHRDb3VudGVyKSB7XG4gICAgLyogMSAtIFdISVRFIExJTkUgSE9SSVpUT05BTCAqL1xuICAgIHNldFRpbWVvdXQoZnVuY3Rpb24oKSB7XG4gICAgICAgIGpRdWVyeSgnLndoaXRlLWxpbmUuaG9yaXpvbnRhbCcpLmFkZENsYXNzKCd0cmFuc2l0aW9uLTEnKTtcbiAgICB9LCA1MDApO1xuICAgIHNldFRpbWVvdXQoZnVuY3Rpb24oKSB7XG4gICAgICAgIGpRdWVyeSgnLnNvY2lhbC10b3AgLndoaXRlLWxpbmUudmVydGljYWw6bnRoLWNoaWxkKG9kZCknKS5hZGRDbGFzcygndHJhbnNpdGlvbi0xJyk7XG4gICAgICAgIGpRdWVyeSgnLnNvY2lhbC1ib3R0b20gLndoaXRlLWxpbmUudmVydGljYWw6bnRoLWNoaWxkKGV2ZW4pJykuYWRkQ2xhc3MoJ3RyYW5zaXRpb24tMScpO1xuICAgIH0sIDgwMCk7XG4gICAgLyogMmIgLSBXSElURSBMSU5FIFZFUlRJQ0FMICovXG4gICAgc2V0VGltZW91dChmdW5jdGlvbigpIHtcbiAgICAgICAgalF1ZXJ5KCcuc29jaWFsLXRvcCAud2hpdGUtbGluZS52ZXJ0aWNhbDpudGgtY2hpbGQoZXZlbiknKS5hZGRDbGFzcygndHJhbnNpdGlvbi0xJyk7XG4gICAgICAgIGpRdWVyeSgnLnNvY2lhbC1ib3R0b20gLndoaXRlLWxpbmUudmVydGljYWw6bnRoLWNoaWxkKG9kZCknKS5hZGRDbGFzcygndHJhbnNpdGlvbi0xJyk7XG4gICAgfSwgMTAwMCk7XG4gICAgLyogMyAtIEdFTkVSQVRFIEFORCBSRVZFQUwgUExBWUVSIEJPWEVTICovXG4gICAgc2V0VGltZW91dChmdW5jdGlvbigpIHtcbiAgICAgICAgalF1ZXJ5KCcuc29jaWFsLXRvcCwgLnNvY2lhbC1ib3R0b20nKS5hZGRDbGFzcygndHJhbnNpdGlvbi0xJyk7XG4gICAgICAgIGpRdWVyeSgnLnBsYXllci1ib3gtd3JhcCcpLmFkZENsYXNzKCd0cmFuc2l0aW9uLTEnKTtcbiAgICB9LCAxMjAwKTtcbiAgICAvKiA0IC0gQVBQRU5EIEhFQURTSE9UUyAqL1xuICAgIHNldFRpbWVvdXQoZnVuY3Rpb24oKSB7XG4gICAgICAgIGpRdWVyeSgnLnBsYXllci1ib3gtd3JhcCcpLmFkZENsYXNzKCd0cmFuc2l0aW9uLTInKTtcbiAgICAgICAgalF1ZXJ5KCcucGxheWVyLWJveCcpLmFkZENsYXNzKCd0cmFuc2l0aW9uLTEnKTtcbiAgICAgICAgdmFyIGRlbGF5ID0gMDtcbiAgICAgICAgdmFyIGZvcmluQ291bnRlciA9IDA7XG4gICAgICAgIGZvciAodmFyIHBsYXllciBpbiByb3N0ZXJPYmouY2VsdGljcy5yb3N0ZXIpIHtcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKHBsYXllcik7XG4gICAgICAgICAgICB2YXIgaGVhZHNob3QgPSAnaHR0cHM6Ly9hay1zdGF0aWMuY21zLm5iYS5jb20vd3AtY29udGVudC91cGxvYWRzL2hlYWRzaG90cy9uYmEvbGF0ZXN0LzEwNDB4NzYwLycgKyByb3N0ZXJPYmouY2VsdGljcy5yb3N0ZXJbcGxheWVyXS5waWQgKyAnLnBuZyc7XG4gICAgICAgICAgICBqUXVlcnkoJy5wbGF5ZXItYm94Om50aC1jaGlsZCgnICsgKGZvcmluQ291bnRlciArIDEpICsgJyknKS5hcHBlbmQoJzxpbWcgY2xhc3M9XCJhcHBlbmRlZCBoZWFkc2hvdFwiIHNyYz1cIicgKyBoZWFkc2hvdCArICdcIi8+Jyk7XG4gICAgICAgICAgICBqUXVlcnkoJy5wbGF5ZXItYm94Om50aC1jaGlsZCgnICsgKGZvcmluQ291bnRlciArIDEpICsgJyknKS5hdHRyKCdkYXRhLXBpZCcsIHJvc3Rlck9iai5jZWx0aWNzLnJvc3RlcltwbGF5ZXJdLnBpZCk7XG4gICAgICAgICAgICBqUXVlcnkoJy5wbGF5ZXItYm94IGltZycpLm9uKFwiZXJyb3JcIiwgZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICAgICAgalF1ZXJ5KHRoaXMpLmF0dHIoJ3NyYycsICdodHRwczovL2kuY2RuLnR1cm5lci5jb20vbmJhL25iYS8uZWxlbWVudC9tZWRpYS8yLjAvdGVhbXNpdGVzL2NlbHRpY3MvbWVkaWEvZ2VuZXJpYy1wbGF5ZXItbGlnaHRfNjAweDQzOC5wbmcnKTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgalF1ZXJ5KCcucGxheWVyLWJveDpudGgtY2hpbGQoJyArIChmb3JpbkNvdW50ZXIgKyAxKSArICcpIGltZycpLmRlbGF5KGRlbGF5KS5mYWRlVG8oMzAwLCAxKTtcbiAgICAgICAgICAgIGRlbGF5ICs9IDMwO1xuICAgICAgICAgICAgZm9yaW5Db3VudGVyKys7XG4gICAgICAgIH1cbiAgICB9LCAxMzAwKTtcbiAgICAvKiA1IC0gUExBWUVSIFNFTEVDVCAqL1xuICAgIHZhciBzZWxlY3RlZFBsYXllciA9ICcnO1xuICAgIHNldFRpbWVvdXQoZnVuY3Rpb24oKSB7XG4gICAgICAgIGpRdWVyeSgnLnBsYXllci1ib3gnKS5hZGRDbGFzcygndHJhbnNpdGlvbi0yJyk7XG4gICAgICAgIGpRdWVyeSgnLnBsYXllci1ib3g6bnRoLWNoaWxkKCcgKyAocGxheWVyU3BvdGxpZ2h0Q291bnRlciArIDEpICsgJyknKS5hZGRDbGFzcygnc2VsZWN0ZWQnKTtcbiAgICAgICAgc2VsZWN0ZWRQbGF5ZXIgPSBqUXVlcnkoJy5wbGF5ZXItYm94Om50aC1jaGlsZCgnICsgKHBsYXllclNwb3RsaWdodENvdW50ZXIgKyAxKSArICcpJykuYXR0cignZGF0YS1waWQnKTtcbiAgICAgICAgY29uc29sZS5sb2coc2VsZWN0ZWRQbGF5ZXIpO1xuICAgICAgICBqUXVlcnkoJy5wbGF5ZXItYm94Jykubm90KCcucmVwbGFjZW1lbnQuc2VsZWN0ZWQnKS5kZWxheSg1MDApLmFkZENsYXNzKCd0cmFuc2l0aW9uLTQnKTtcbiAgICB9LCAyMDAwKTtcbiAgICAvKiA2IC0gUExBWUVSIEJPWCBFWFBBTkQgKi9cbiAgICBzZXRUaW1lb3V0KGZ1bmN0aW9uKCkge1xuICAgICAgICBqUXVlcnkoJy5ibG9jay13cmFwLnNvY2lhbCcpLmFkZENsYXNzKCd0cmFuc2l0aW9uLTMnKTtcbiAgICAgICAgalF1ZXJ5KCcucGxheWVyLWJveC5yZXBsYWNlbWVudC5zZWxlY3RlZCcpLmFkZENsYXNzKCd0cmFuc2l0aW9uLTMnKTtcbiAgICB9LCAzMDAwKTtcbiAgICAvKiA3IC0gU1BPVExJR0hUIEhUTUwgKi9cbiAgICBzZXRUaW1lb3V0KGZ1bmN0aW9uKCkge1xuICAgICAgICBnZW5lcmF0ZVRpbWVsaW5lKHNlbGVjdGVkUGxheWVyKTtcbiAgICAgICAgalF1ZXJ5KCcucGxheWVyLWJveC5yZXBsYWNlbWVudC5zZWxlY3RlZCcpLmNsb25lKCkuYXBwZW5kVG8oJy5ibG9jay13cmFwLnBsYXllci1zcG90bGlnaHQgLnRvcC13cmFwJyk7XG4gICAgICAgIGpRdWVyeSgnLnBsYXllci1zcG90bGlnaHQgLnNlbGVjdGVkJykuYWRkQ2xhc3MoJy5hcHBlbmRlZCcpO1xuICAgICAgICBqUXVlcnkoJy5ibG9jay13cmFwLnBsYXllci1zcG90bGlnaHQnKS5hZGRDbGFzcygndHJhbnNpdGlvbi0xJyk7XG4gICAgICAgIGpRdWVyeSgnLmJsb2NrLXdyYXAuc29jaWFsJykuYWRkQ2xhc3MoJ3RyYW5zaXRpb24tMScpO1xuICAgICAgICB2YXIgc3RhdHMgPSByb3N0ZXJPYmouY2VsdGljcy5yb3N0ZXJbc2VsZWN0ZWRQbGF5ZXJdLnN0YXRzO1xuICAgICAgICBqUXVlcnkoJy5wbGF5ZXItc3BvdGxpZ2h0IC50b3Atd3JhcCAucGxheWVyLXRvcCcpLmFwcGVuZCgnPGltZyBjbGFzcz1cInNpbG8gYXBwZW5kZWRcIiBzcmM9XCJodHRwOi8vaW8uY25uLm5ldC9uYmEvbmJhLy5lbGVtZW50L21lZGlhLzIuMC90ZWFtc2l0ZXMvY2VsdGljcy9tZWRpYS9zaWxvLTQ2Nng1OTEtJyArIHJvc3Rlck9iai5jZWx0aWNzLnJvc3RlcltzZWxlY3RlZFBsYXllcl0ucGlkICsgJy5wbmdcIiAvPjxkaXYgY2xhc3M9XCJ0b3AgYXBwZW5kZWRcIj48ZGl2IGNsYXNzPVwicGxheWVyLW5hbWUtd3JhcFwiPjxwIGNsYXNzPVwicGxheWVyLW5hbWVcIj48c3Bhbj4nICsgcm9zdGVyT2JqLmNlbHRpY3Mucm9zdGVyW3NlbGVjdGVkUGxheWVyXS5mbi50b1VwcGVyQ2FzZSgpICsgJzwvc3Bhbj4gPGJyPiAnICsgcm9zdGVyT2JqLmNlbHRpY3Mucm9zdGVyW3NlbGVjdGVkUGxheWVyXS5sbi50b1VwcGVyQ2FzZSgpICsgJzwvcD48L2Rpdj48cCBjbGFzcz1cInBsYXllci1udW1iZXJcIj4nICsgcm9zdGVyT2JqLmNlbHRpY3Mucm9zdGVyW3NlbGVjdGVkUGxheWVyXS5udW0gKyAnPC9icj48c3Bhbj4nICsgcm9zdGVyT2JqLmNlbHRpY3Mucm9zdGVyW3NlbGVjdGVkUGxheWVyXS5wb3MgKyAnPC9zcGFuPjwvcD48L2Rpdj48ZGl2IGNsYXNzPVwibWlkZGxlIGFwcGVuZGVkXCI+PHVsIGNsYXNzPVwiaW5mbyBjbGVhcmZpeFwiPjxsaT48cD5BR0U8c3BhbiBjbGFzcz1cInNtLWhpZGVcIj46Jm5ic3A7PC9zcGFuPiA8L2JyPjxzcGFuIGNsYXNzPVwiaW5mby12YWx1ZVwiPicgKyBwbGF5ZXJBZ2Uocm9zdGVyT2JqLmNlbHRpY3Mucm9zdGVyW3NlbGVjdGVkUGxheWVyXS5kb2IpICsgJzwvc3Bhbj48L3A+PC9saT48bGk+PHA+SFQ8c3BhbiBjbGFzcz1cInNtLWhpZGVcIj46Jm5ic3A7PC9zcGFuPiA8L2JyPjxzcGFuIGNsYXNzPVwiaW5mby12YWx1ZVwiPicgKyByb3N0ZXJPYmouY2VsdGljcy5yb3N0ZXJbc2VsZWN0ZWRQbGF5ZXJdLmh0ICsgJzwvc3Bhbj48L3A+PC9saT48bGk+PHA+V1Q8c3BhbiBjbGFzcz1cInNtLWhpZGVcIj46Jm5ic3A7PC9zcGFuPiA8L2JyPjxzcGFuIGNsYXNzPVwiaW5mby12YWx1ZVwiPicgKyByb3N0ZXJPYmouY2VsdGljcy5yb3N0ZXJbc2VsZWN0ZWRQbGF5ZXJdLnd0ICsgJzwvc3Bhbj48L3A+PC9saT48L3VsPjwvZGl2PjxkaXYgY2xhc3M9XCJib3R0b20gZnVsbCBjbGVhcmZpeCBzbS1oaWRlIGFwcGVuZGVkXCI+PHRhYmxlIGNsYXNzPVwiYXZlcmFnZXNcIj48dHIgY2xhc3M9XCJhdmVyYWdlcy1sYWJlbHNcIj48dGQ+PHA+R1A8L3A+PC90ZD48dGQ+PHA+UFBHPC9wPjwvdGQ+PHRkPjxwPlJQRzwvcD48L3RkPjx0ZD48cD5BUEc8L3A+PC90ZD48L3RyPjx0ciBjbGFzcz1cImF2ZXJhZ2VzLXNlYXNvblwiPjx0ZCBjbGFzcz1cImdwXCI+PHA+PC9wPjwvdGQ+PHRkIGNsYXNzPVwicHRzXCI+PHA+PC9wPjwvdGQ+PHRkIGNsYXNzPVwicmViXCI+PHA+PC9wPjwvdGQ+PHRkIGNsYXNzPVwiYXN0XCI+PHA+PC9wPjwvdGQ+PC90cj48L3RhYmxlPjwvZGl2PicpO1xuICAgICAgICBqUXVlcnkoXCIucGxheWVyLXNwb3RsaWdodCAuYXZlcmFnZXMtc2Vhc29uXCIpLmh0bWwoJzx0ZD48cD4nICsgc3RhdHMuc2Vhc29uQXZnWzBdLmdwICsgJzwvcD48L3RkPjx0ZD48cD4nICsgc3RhdHMuc2Vhc29uQXZnWzBdLnB0cyArICc8L3A+PC90ZD48dGQ+PHA+JyArIHN0YXRzLnNlYXNvbkF2Z1swXS5yZWIgKyAnPC9wPjwvdGQ+PHRkPjxwPicgKyBzdGF0cy5zZWFzb25BdmdbMF0uYXN0ICsgJzwvcD48L3RkPicpO1xuICAgICAgICBqUXVlcnkoJy5wbGF5ZXItc3BvdGxpZ2h0IC5wbGF5ZXItbmFtZScpLmZhZGVUbygyMDAsIDEpO1xuICAgICAgICB2YXIgcGxheWVyRmFjdHMgPSByb3N0ZXJPYmouY2VsdGljcy5yb3N0ZXJbc2VsZWN0ZWRQbGF5ZXJdLmJpby5wZXJzb25hbDtcbiAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCAzOyBpKyspIHtcbiAgICAgICAgICAgIHZhciBmYWN0SW5kZXggPSBNYXRoLmZsb29yKE1hdGgucmFuZG9tKCkgKiBwbGF5ZXJGYWN0cy5sZW5ndGgpO1xuICAgICAgICAgICAgalF1ZXJ5KCcucGxheWVyLXNwb3RsaWdodCAuYm90dG9tLXdyYXAnKS5hcHBlbmQoJzxkaXYgY2xhc3M9XCJkeWstYm94IGFwcGVuZGVkXCI+PHA+JyArIHBsYXllckZhY3RzW2ZhY3RJbmRleF0gKyAnPC9wPjwvZGl2PicpO1xuICAgICAgICB9O1xuICAgICAgICBqUXVlcnkoJy5wbGF5ZXItc3BvdGxpZ2h0IC5ib3R0b20td3JhcCcpLmFkZENsYXNzKCd0cmFuc2l0aW9uLTEnKTtcbiAgICAgICAgc2V0VGltZW91dChmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIGpRdWVyeSgnLnBsYXllci1zcG90bGlnaHQgLmJvdHRvbS13cmFwIC5keWstYm94Om50aC1vZi10eXBlKDIpJykuYWRkQ2xhc3MoJ3RyYW5zaXRpb24tMicpO1xuICAgICAgICAgICAgalF1ZXJ5KCcucGxheWVyLXNwb3RsaWdodCAuYm90dG9tLXdyYXAgLmR5ay1ib3g6bnRoLW9mLXR5cGUoMyknKS5hZGRDbGFzcygndHJhbnNpdGlvbi0xJyk7XG4gICAgICAgIH0sIDEwMDApO1xuICAgICAgICBzZXRUaW1lb3V0KGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgalF1ZXJ5KCcucGxheWVyLXNwb3RsaWdodCAuYm90dG9tLXdyYXAgLmR5ay1ib3g6bnRoLW9mLXR5cGUoMyknKS5hZGRDbGFzcygndHJhbnNpdGlvbi0yJyk7XG4gICAgICAgICAgICBqUXVlcnkoJy5wbGF5ZXItc3BvdGxpZ2h0IC5ib3R0b20td3JhcCAuZHlrLWJveDpudGgtb2YtdHlwZSg0KScpLmFkZENsYXNzKCd0cmFuc2l0aW9uLTEnKTtcbiAgICAgICAgfSwgMTUwMCk7XG4gICAgfSwgMzYwMCk7XG4gICAgLyogOCAtIFNQT1RMSUdIVCBTTElERSBJTiAqL1xuICAgIHNldFRpbWVvdXQoZnVuY3Rpb24oKSB7XG4gICAgICAgIGpRdWVyeSgnLnBsYXllci1zcG90bGlnaHQgLnBsYXllci10b3AgLnBsYXllci1uYW1lLCAucGxheWVyLXNwb3RsaWdodCAucGxheWVyLW5hbWUtd3JhcCwgLnBsYXllci1zcG90bGlnaHQgLmhlYWRzaG90LCAucGxheWVyLXNwb3RsaWdodCAuaW5mbywgLnBsYXllci1zcG90bGlnaHQgLnNpbG8sIC5wbGF5ZXItc3BvdGxpZ2h0IC5hdmVyYWdlcywgLnBsYXllci1zcG90bGlnaHQgLnBsYXllci1udW1iZXInKS5hZGRDbGFzcygndHJhbnNpdGlvbi0xJyk7XG4gICAgICAgIHNldFRpbWVvdXQoZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICBqUXVlcnkoJy5ibG9jay13cmFwLnBsYXllci1zcG90bGlnaHQgLnBsYXllci1ib3gnKS5yZW1vdmUoKTtcbiAgICAgICAgfSwgNDAwMCk7XG4gICAgICAgIGlmIChwbGF5ZXJTcG90bGlnaHRDb3VudGVyIDwgMTYpIHtcbiAgICAgICAgICAgIHBsYXllclNwb3RsaWdodENvdW50ZXIrKztcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHBsYXllclNwb3RsaWdodENvdW50ZXIgPSAwO1xuICAgICAgICB9XG4gICAgfSwgNDEwMCk7XG4gICAgLyogOSAtIFNQT1RMSUdIVCBTTElERSBPVVQgKi9cbiAgICBzZXRUaW1lb3V0KGZ1bmN0aW9uKCkge1xuICAgICAgICBqUXVlcnkoJy5wbGF5ZXItc3BvdGxpZ2h0IC5ib3R0b20td3JhcCwgLnBsYXllci1zcG90bGlnaHQgLnRvcC13cmFwJykuYWRkQ2xhc3MoJ3RyYW5zaXRpb24tMicpO1xuICAgIH0sIDYwMDApO1xuICAgIC8qIDEwIC0gRE9ORS4gUkVNT1ZFIFRIQVQgU0hJVCAqL1xuICAgIHNldFRpbWVvdXQoZnVuY3Rpb24oKSB7XG4gICAgICAgIGpRdWVyeSgnLmFwcGVuZGVkJykucmVtb3ZlKCk7XG4gICAgICAgIGpRdWVyeSgnLnRyYW5zaXRpb24sIC50cmFuc2l0aW9uLTEsIC50cmFuc2l0aW9uLTIsIC50cmFuc2l0aW9uLTMsIC50cmFuc2l0aW9uLTQnKS5yZW1vdmVDbGFzcygndHJhbnNpdGlvbiB0cmFuc2l0aW9uLTEgdHJhbnNpdGlvbi0yIHRyYW5zaXRpb24tMyB0cmFuc2l0aW9uLTQnKTtcbiAgICB9LCA3MDAwKTtcbn1cbi8qPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbj0gICAgICAgICAgICBMT0FEIFJPU1RFUiBJTkZPID0+IHJvc3Rlck9iaiAgICAgICAgICAgID1cbj09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09Ki9cbmZ1bmN0aW9uIGxvYWRSb3N0ZXJEYXRhKGF3YXlUZWFtKSB7XG4gICAgdmFyIHJvc3RlciA9ICcnO1xuICAgIGpRdWVyeS5hamF4KHtcbiAgICAgICAgdXJsOiAnaHR0cDovL2xvY2FsaG9zdDo4ODg4L2RhdGEvbW9iaWxlLXN0YXRzLWZlZWQvY2VsdGljc19yb3N0ZXIuanNvbicsXG4gICAgICAgIGFzeW5jOiBmYWxzZSxcbiAgICAgICAgc3VjY2VzczogZnVuY3Rpb24oZGF0YSkge1xuICAgICAgICAgICAgcm9zdGVyID0gZGF0YTtcbiAgICAgICAgICAgIGZvciAodmFyIHByb3BlcnR5IGluIHJvc3Rlci50KXtcbiAgICAgICAgICAgICAgICBpZiAocHJvcGVydHkgIT09ICdwbCcpe1xuICAgICAgICAgICAgICAgICAgICByb3N0ZXJPYmouY2VsdGljc1twcm9wZXJ0eV0gPSByb3N0ZXIudFtwcm9wZXJ0eV07XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9LFxuICAgICAgICBlcnJvcjogZnVuY3Rpb24oKSB7fVxuICAgIH0pO1xuICAgIHZhciBhd2F5Um9zdGVyID0gJyc7XG4gICAgalF1ZXJ5LmFqYXgoe1xuICAgICAgICB1cmw6ICdodHRwOi8vbG9jYWxob3N0Ojg4ODgvZGF0YS9tb2JpbGUtc3RhdHMtZmVlZC9hd2F5X3Jvc3Rlci5qc29uJyxcbiAgICAgICAgYXN5bmM6IGZhbHNlLFxuICAgICAgICBzdWNjZXNzOiBmdW5jdGlvbihkYXRhKSB7XG4gICAgICAgICAgICBhd2F5Um9zdGVyID0gZGF0YTtcbiAgICAgICAgICAgIGZvciAodmFyIHByb3BlcnR5IGluIGF3YXlSb3N0ZXIudCl7XG4gICAgICAgICAgICAgICAgaWYgKHByb3BlcnR5ICE9PSAncGwnKXtcbiAgICAgICAgICAgICAgICAgICAgcm9zdGVyT2JqLmF3YXlbcHJvcGVydHldID0gYXdheVJvc3Rlci50W3Byb3BlcnR5XTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH0sXG4gICAgICAgIGVycm9yOiBmdW5jdGlvbigpIHt9XG4gICAgfSk7XG4gICAgdmFyIGJpb0RhdGEgPSAnJztcbiAgICBqUXVlcnkuYWpheCh7XG4gICAgICAgIHVybDogJ2h0dHA6Ly9sb2NhbGhvc3Q6ODg4OC9kYXRhL2Jpby1kYXRhLmpzb24nLFxuICAgICAgICBhc3luYzogZmFsc2UsXG4gICAgICAgIHN1Y2Nlc3M6IGZ1bmN0aW9uKGRhdGEpIHtcbiAgICAgICAgICAgIGJpb0RhdGEgPSBkYXRhO1xuICAgICAgICB9LFxuICAgICAgICBlcnJvcjogZnVuY3Rpb24oKSB7fVxuICAgIH0pO1xuICAgIGZvciAodmFyIGkgPSAwOyBpIDwgcm9zdGVyLnQucGwubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgdmFyIHBpZCA9IHJvc3Rlci50LnBsW2ldLnBpZDtcbiAgICAgICAgcm9zdGVyT2JqLmNlbHRpY3Mucm9zdGVyW3BpZF0gPSByb3N0ZXIudC5wbFtpXTtcbiAgICAgICAgZm9yICh2YXIgcHJvcGVydHkgaW4gYmlvRGF0YVtwaWRdKSB7XG4gICAgICAgICAgICByb3N0ZXJPYmouY2VsdGljcy5yb3N0ZXJbcGlkXS5iaW8gPSBiaW9EYXRhW3BpZF07XG4gICAgICAgIH07XG4gICAgICAgIGpRdWVyeS5hamF4KHtcbiAgICAgICAgICAgIHVybDogJ2h0dHA6Ly9sb2NhbGhvc3Q6ODg4OC9kYXRhL21vYmlsZS1zdGF0cy1mZWVkL3BsYXllcmNhcmRzL3BsYXllcmNhcmQtJyArIHBpZCArICcuanNvbicsXG4gICAgICAgICAgICBhc3luYzogZmFsc2UsXG4gICAgICAgICAgICBzdWNjZXNzOiBmdW5jdGlvbihkYXRhKSB7XG4gICAgICAgICAgICAgICAgcm9zdGVyT2JqLmNlbHRpY3Mucm9zdGVyW3BpZF0uc3RhdHMgPSBkYXRhLnBsLmNhO1xuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIGVycm9yOiBmdW5jdGlvbigpIHt9XG4gICAgICAgIH0pO1xuICAgIH1cbiAgICBmb3IgKHZhciBpID0gMDsgaSA8IGF3YXlSb3N0ZXIudC5wbC5sZW5ndGg7IGkrKykge1xuICAgICAgICB2YXIgcGlkID0gYXdheVJvc3Rlci50LnBsW2ldLnBpZDtcbiAgICAgICAgcm9zdGVyT2JqLmF3YXkucm9zdGVyW3BpZF0gPSBhd2F5Um9zdGVyLnQucGxbaV07XG4gICAgICAgIGpRdWVyeS5hamF4KHtcbiAgICAgICAgICAgIHVybDogJ2h0dHA6Ly9sb2NhbGhvc3Q6ODg4OC9kYXRhL21vYmlsZS1zdGF0cy1mZWVkL3BsYXllcmNhcmRzL3BsYXllcmNhcmQtMjAyMzMwLmpzb24nLCAvLyBDSEFOR0UgUElEXG4gICAgICAgICAgICBhc3luYzogZmFsc2UsXG4gICAgICAgICAgICBzdWNjZXNzOiBmdW5jdGlvbihkYXRhKSB7XG4gICAgICAgICAgICAgICAgcm9zdGVyT2JqLmF3YXkucm9zdGVyW3BpZF0uc3RhdHMgPSBkYXRhLnBsLmNhO1xuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIGVycm9yOiBmdW5jdGlvbigpIHt9XG4gICAgICAgIH0pO1xuICAgIH1cbiAgICBmb3IgKHZhciB0ZWFtIGluIHJvc3Rlck9iaikge1xuICAgICAgICBmb3IgKHZhciBwbGF5ZXIgaW4gcm9zdGVyT2JqW3RlYW1dLnJvc3Rlcikge1xuICAgICAgICAgICAgdmFyIHB0TGVhZGVycyA9IHJvc3Rlck9ialt0ZWFtXS5sZWFkZXJzLnB0cztcbiAgICAgICAgICAgIHZhciBhc3RMZWFkZXJzID0gcm9zdGVyT2JqW3RlYW1dLmxlYWRlcnMuYXN0O1xuICAgICAgICAgICAgdmFyIHJlYkxlYWRlcnMgPSByb3N0ZXJPYmpbdGVhbV0ubGVhZGVycy5yZWI7XG4gICAgICAgICAgICBmb3IgKHZhciBzdGF0IGluIHJvc3Rlck9ialt0ZWFtXS5sZWFkZXJzKSB7XG4gICAgICAgICAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCAzOyBpKyspIHtcbiAgICAgICAgICAgICAgICAgICAgaWYgKHJvc3Rlck9ialt0ZWFtXS5sZWFkZXJzW3N0YXRdW2ldWzJdID09ICctLScgJiYgcm9zdGVyT2JqW3RlYW1dLnJvc3RlcltwbGF5ZXJdLnN0YXRzW3N0YXRdID4gMCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgcm9zdGVyT2JqW3RlYW1dLmxlYWRlcnNbc3RhdF1baV1bMF0gPSByb3N0ZXJPYmpbdGVhbV0ucm9zdGVyW3BsYXllcl0uZm4udG9VcHBlckNhc2UoKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJvc3Rlck9ialt0ZWFtXS5sZWFkZXJzW3N0YXRdW2ldWzFdID0gcm9zdGVyT2JqW3RlYW1dLnJvc3RlcltwbGF5ZXJdLmxuLnRvVXBwZXJDYXNlKCk7XG4gICAgICAgICAgICAgICAgICAgICAgICByb3N0ZXJPYmpbdGVhbV0ubGVhZGVyc1tzdGF0XVtpXVsyXSA9IHJvc3Rlck9ialt0ZWFtXS5yb3N0ZXJbcGxheWVyXS5zdGF0c1tzdGF0XTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJvc3Rlck9ialt0ZWFtXS5sZWFkZXJzW3N0YXRdW2ldWzNdID0gcm9zdGVyT2JqW3RlYW1dLnJvc3RlcltwbGF5ZXJdLnBpZDtcbiAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgICAgICB9IGVsc2UgaWYgKHJvc3Rlck9ialt0ZWFtXS5yb3N0ZXJbcGxheWVyXS5zdGF0c1tzdGF0XSA+IHJvc3Rlck9ialt0ZWFtXS5sZWFkZXJzW3N0YXRdW2ldWzJdICYmIHJvc3Rlck9ialt0ZWFtXS5yb3N0ZXJbcGxheWVyXS5zdGF0c1tzdGF0XSA+IDApIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJvc3Rlck9ialt0ZWFtXS5sZWFkZXJzW3N0YXRdW2ldWzBdID0gcm9zdGVyT2JqW3RlYW1dLnJvc3RlcltwbGF5ZXJdLmZuLnRvVXBwZXJDYXNlKCk7XG4gICAgICAgICAgICAgICAgICAgICAgICByb3N0ZXJPYmpbdGVhbV0ubGVhZGVyc1tzdGF0XVtpXVsxXSA9IHJvc3Rlck9ialt0ZWFtXS5yb3N0ZXJbcGxheWVyXS5sbi50b1VwcGVyQ2FzZSgpO1xuICAgICAgICAgICAgICAgICAgICAgICAgcm9zdGVyT2JqW3RlYW1dLmxlYWRlcnNbc3RhdF1baV1bMl0gPSByb3N0ZXJPYmpbdGVhbV0ucm9zdGVyW3BsYXllcl0uc3RhdHNbc3RhdF07XG4gICAgICAgICAgICAgICAgICAgICAgICByb3N0ZXJPYmpbdGVhbV0ubGVhZGVyc1tzdGF0XVtpXVszXSA9IHJvc3Rlck9ialt0ZWFtXS5yb3N0ZXJbcGxheWVyXS5waWQ7XG4gICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH07XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9XG4gICAgY29uc29sZS5sb2cocm9zdGVyT2JqKTtcbn07XG5cbmZ1bmN0aW9uIHN0YXRzTm90QXZhaWxhYmxlKHBpZCkge1xuICAgIHJvc3Rlck9ialtwaWRdLnN0YXRzLmNhcmVlckF2ZyA9IHt9O1xuICAgIHJvc3Rlck9ialtwaWRdLnN0YXRzLnNlYXNvbkF2ZyA9IFt7fV07XG4gICAgcm9zdGVyT2JqW3BpZF0uc3RhdHMuaGFzU3RhdHMgPSBmYWxzZTtcbiAgICB2YXIgY2FJbmRleCA9IFsnZ3AnLCAnZ3MnLCAnbWluJywgJ2ZncCcsICd0cHAnLCAnZnRwJywgJ29yZWInLCAnZHJlYicsICdyZWInLCAnYXN0JywgJ3N0bCcsICdibGsnLCAndG92JywgJ3BmJywgJ3B0cycsICdub3N0YXRzJ107XG4gICAgdmFyIHNhSW5kZXggPSBbJ3RpZCcsICd2YWwnLCAnZ3AnLCAnZ3MnLCAnbWluJywgJ2ZncCcsICd0cHAnLCAnZnRwJywgJ29yZWInLCAnZHJlYicsICdyZWInLCAnYXN0JywgJ3N0bCcsICdibGsnLCAndG92JywgJ3BmJywgJ3B0cycsICdzcGwnLCAndGEnLCAndG4nLCAndGMnXTtcbiAgICBmb3IgKHZhciBpID0gMDsgaSA8IHNhSW5kZXgubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgcm9zdGVyT2JqW3BpZF0uc3RhdHMuc2Vhc29uQXZnWzBdW3NhSW5kZXhbaV1dID0gXCJOL0FcIjtcbiAgICAgICAgaWYgKGkgPT09IDEpIHtcbiAgICAgICAgICAgIHJvc3Rlck9ialtwaWRdLnN0YXRzLnNlYXNvbkF2Z1swXVtzYUluZGV4W2ldXSA9IHBsYXllckNhcmRZZWFyLnRvU3RyaW5nKCkuc3Vic3RyKDIsIDIpICsgXCItXCIgKyAocGxheWVyQ2FyZFllYXIgKyAxKS50b1N0cmluZygpLnN1YnN0cigyLCAyKTtcbiAgICAgICAgfVxuICAgICAgICBpZiAoaSA9PT0gMTcpIHtcbiAgICAgICAgICAgIHJvc3Rlck9ialtwaWRdLnN0YXRzLnNlYXNvbkF2Z1swXVtzYUluZGV4W2ldXSA9IFtdO1xuICAgICAgICB9XG4gICAgICAgIGlmIChpID09PSAxOCkge1xuICAgICAgICAgICAgcm9zdGVyT2JqW3BpZF0uc3RhdHMuc2Vhc29uQXZnWzBdW3NhSW5kZXhbaV1dID0gJ0JPUyc7XG4gICAgICAgIH1cbiAgICB9XG4gICAgZm9yICh2YXIgaSA9IDA7IGkgPCBjYUluZGV4Lmxlbmd0aDsgaSsrKSB7XG4gICAgICAgIHJvc3Rlck9ialtwaWRdLnN0YXRzLmNhcmVlckF2Z1tjYUluZGV4W2ldXSA9IFwiTi9BXCI7XG4gICAgICAgIGlmIChpID09PSAxNSkge1xuICAgICAgICAgICAgcm9zdGVyT2JqW3BpZF0uc3RhdHMuY2FyZWVyQXZnW2NhSW5kZXhbaV1dID0gdHJ1ZTtcbiAgICAgICAgfVxuICAgIH1cbn07XG5cbmZ1bmN0aW9uIGxvYWRHYW1lRGV0YWlsKGdpZCkge307XG5cbmZ1bmN0aW9uIGxvYWRBd2F5VGVhbURhdGEoKSB7fVxuLyo9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbj0gICAgICAgICAgICBTVEFUIExFQURFUlMgICAgICAgICAgICA9XG49PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT0qL1xuXG5mdW5jdGlvbiBsZWFkZXJzKGdpZCwgZ2FtZVN0YXJ0ZWQpIHtcbiAgICB2YXIgZ2FtZURldGFpbCA9ICcnO1xuICAgIHZhciBkZXRhaWxBdmFpbGFibGUgPSBmYWxzZTtcbiAgICBnYW1lU3RhcnRlZCA9IHRydWU7IC8vIERPOiBERUxFVEUgVEhJUyBXSEVOIE9OTElORS4gSlVTVCBGT1IgVEVTVElORyBQVVJQT1NFUyBSTlxuICAgIGlmIChnYW1lU3RhcnRlZCkge1xuICAgICAgICBqUXVlcnkuYWpheCh7XG4gICAgICAgICAgICB1cmw6ICdodHRwOi8vbG9jYWxob3N0Ojg4ODgvZGF0YS9tb2JpbGUtc3RhdHMtZmVlZC9nYW1lZGV0YWlsLmpzb24nLFxuICAgICAgICAgICAgYXN5bmM6IGZhbHNlLFxuICAgICAgICAgICAgc3VjY2VzczogZnVuY3Rpb24oZGF0YSkge1xuICAgICAgICAgICAgICAgIC8vIERPOiBVUERBVEUgVEhFIExFQURFUiBPQkpFQ1RTXG4gICAgICAgICAgICAgICAgZ2FtZURldGFpbCA9IGRhdGE7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgIH1cbiAgICBmb3IgKHZhciB0ZWFtIGluIHJvc3Rlck9iail7XG4gICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgMzsgaSsrKXtcbiAgICAgICAgICAgIGZvciAodmFyIHN0YXQgaW4gcm9zdGVyT2JqW3RlYW1dLmxlYWRlcnMpe1xuICAgICAgICAgICAgICAgIC8vIExFQURFUiBTVEFUIFZBTFVFXG4gICAgICAgICAgICAgICAgalF1ZXJ5KCcubGVhZGVyLXNlY3Rpb246bnRoLW9mLXR5cGUoJyArIChpICsgMikgKyAnKSAuJyArIHN0YXQgKyAnLicgKyB0ZWFtICsgJyAuc3RhdCcpLmFwcGVuZCgnPHNwYW4gY2xhc3M9XCInICsgcm9zdGVyT2JqW3RlYW1dLnRhICsnXCI+JyArIHJvc3Rlck9ialt0ZWFtXS5sZWFkZXJzW3N0YXRdW2ldWzJdICsgJzwvc3Bhbj4gJyArIHN0YXQudG9VcHBlckNhc2UoKSk7XG4gICAgICAgICAgICAgICAgLy8gTEVBREVSIE5BTUVcbiAgICAgICAgICAgICAgICBpZiAocm9zdGVyT2JqW3RlYW1dLmxlYWRlcnNbc3RhdF1baV1bMF0ubGVuZ3RoICsgcm9zdGVyT2JqW3RlYW1dLmxlYWRlcnNbc3RhdF1baV1bMV0ubGVuZ3RoID49IDE1KXtcbiAgICAgICAgICAgICAgICAgICAgcm9zdGVyT2JqW3RlYW1dLmxlYWRlcnNbc3RhdF1baV1bMF0gPSByb3N0ZXJPYmpbdGVhbV0ubGVhZGVyc1tzdGF0XVtpXVswXS5zdWJzdHIoMCwxKSArICcuJztcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgalF1ZXJ5KCcubGVhZGVyLXNlY3Rpb246bnRoLW9mLXR5cGUoJyArIChpICsgMikgKyAnKSAuJyArIHN0YXQgKyAnLicgKyB0ZWFtICsgJyAubmFtZScpLmFwcGVuZCgnPHNwYW4+JyArIHJvc3Rlck9ialt0ZWFtXS5sZWFkZXJzW3N0YXRdW2ldWzBdICsgJzwvc3Bhbj4gJyArIHJvc3Rlck9ialt0ZWFtXS5sZWFkZXJzW3N0YXRdW2ldWzFdKTtcbiAgICAgICAgICAgICAgICAvLyBMRUFERVIgSEVBRFNIT1RcbiAgICAgICAgICAgICAgICBqUXVlcnkoJy5sZWFkZXItc2VjdGlvbjpudGgtb2YtdHlwZSgnICsgKGkgKyAyKSArICcpIC4nICsgc3RhdCArICcuJyArIHRlYW0gKyAnIC5oZWFkc2hvdCcpLmF0dHIoJ3NyYycsJ2h0dHBzOi8vYWstc3RhdGljLmNtcy5uYmEuY29tL3dwLWNvbnRlbnQvdXBsb2Fkcy9oZWFkc2hvdHMvbmJhL2xhdGVzdC8xMDQweDc2MC8nICsgcm9zdGVyT2JqW3RlYW1dLmxlYWRlcnNbc3RhdF1baV1bM10gKyAnLnBuZycpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxuICAgIHZhciB0aW1lQmV0d2VlbiA9IDEwMDA7XG4gICAgalF1ZXJ5KCcubGVhZGVycywgLmxlYWRlcnMgLmJsb2NrLWlubmVyJykuYWRkQ2xhc3MoJ3RyYW5zaXRpb24tMScpO1xuICAgIHNldFRpbWVvdXQoZnVuY3Rpb24oKSB7XG4gICAgICAgIGpRdWVyeSgnLmxlYWRlcnMgLmxlYWRlci1zZWN0aW9uJykuYWRkQ2xhc3MoJ3RyYW5zaXRpb24tMScpO1xuICAgICAgICBqUXVlcnkoJy5sZWFkZXItc3Vic2VjdGlvbi5ib3R0b20gcDpudGgtb2YtdHlwZSgxKScpLmFkZENsYXNzKCd0cmFuc2l0aW9uLTEnKTtcbiAgICAgICAgalF1ZXJ5KCcubGVhZGVycyAubGVhZGVyLXNlY3Rpb24gLnVuZGVybGluZSwgLmxlYWRlcnMgLmxlYWRlci1zdWJzZWN0aW9uLnRvcCcpLmFkZENsYXNzKHJvc3Rlck9iai5jZWx0aWNzLnRhICsgJy1iZycpO1xuICAgIH0sIDgwMCk7XG4gICAgdmFyIHRyYW5zaXRpb25Db3VudGVyID0gMTtcbiAgICBmb3IgKGxldCBpPTE7IGkgPD0gNjsgaSsrKXtcbiAgICAgICAgc2V0VGltZW91dChmdW5jdGlvbihudW1iZXJTdHJpbmcpIHtcbiAgICAgICAgICAgIGpRdWVyeSgnLmxlYWRlcnMgLmxlYWRlci1zZWN0aW9uIC5sZWFkZXItc3RhdC13cmFwJykuYWRkQ2xhc3MoJ3RyYW5zaXRpb24tJyArIGkpO1xuICAgICAgICAgICAgalF1ZXJ5KCcubGVhZGVycyAubGVhZGVyLXNlY3Rpb24gLnVuZGVybGluZSwgLmxlYWRlcnMgLmxlYWRlci1zdWJzZWN0aW9uLnRvcCcpLnJlbW92ZUNsYXNzKHJvc3Rlck9iai5jZWx0aWNzLnRhICsgJy1iZycpO1xuICAgICAgICAgICAgalF1ZXJ5KCcubGVhZGVycyAubGVhZGVyLXNlY3Rpb24gLnVuZGVybGluZSwgLmxlYWRlcnMgLmxlYWRlci1zdWJzZWN0aW9uLnRvcCcpLmFkZENsYXNzKHJvc3Rlck9iai5hd2F5LnRhICsgJy1iZycpO1xuICAgICAgICAgICAgaWYgKHRyYW5zaXRpb25Db3VudGVyICUgMiA9PSAwKXtcbiAgICAgICAgICAgICAgICBzZXRUaW1lb3V0KGZ1bmN0aW9uKCl7XG5cbiAgICAgICAgICAgICAgICAgICAgalF1ZXJ5KCcubGVhZGVycyAubGVhZGVyLXNlY3Rpb24gLnVuZGVybGluZSwgLmxlYWRlcnMgLmxlYWRlci1zdWJzZWN0aW9uLnRvcCcpLnJlbW92ZUNsYXNzKHJvc3Rlck9iai5hd2F5LnRhICsgJy1iZycpO1xuICAgICAgICAgICAgICAgICAgICBqUXVlcnkoJy5sZWFkZXJzIC5sZWFkZXItc2VjdGlvbiAudW5kZXJsaW5lLCAubGVhZGVycyAubGVhZGVyLXN1YnNlY3Rpb24udG9wJykuYWRkQ2xhc3Mocm9zdGVyT2JqLmNlbHRpY3MudGEgKyAnLWJnJyk7XG4gICAgICAgICAgICAgICAgICAgIGpRdWVyeSgnLmxlYWRlci1zdWJzZWN0aW9uLmJvdHRvbSBwJykucmVtb3ZlQ2xhc3MoJ3RyYW5zaXRpb24tMScpO1xuICAgICAgICAgICAgICAgICAgICBqUXVlcnkoJy5sZWFkZXJzIC5sZWFkZXItc2VjdGlvbiAudW5kZXJsaW5lJykuYWRkQ2xhc3MoJ3RyYW5zaXRpb24tJyArIChpLzIpKTtcbiAgICAgICAgICAgICAgICAgICAgalF1ZXJ5KCcubGVhZGVyLXN1YnNlY3Rpb24uYm90dG9tIHA6bnRoLW9mLXR5cGUoJyArIChpLShpLzIpKzEpICsgJyknKS5hZGRDbGFzcygndHJhbnNpdGlvbi0xJyk7IC8vIGxvbFxuICAgICAgICAgICAgICAgIH0sIDIwMCk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICB0cmFuc2l0aW9uQ291bnRlcisrO1xuICAgICAgICB9LCAyMDAwICogaSk7XG4gICAgfVxufTtcbi8qPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG49ICAgICAgICAgICAgU09DSUFMICAgICAgICAgICAgPVxuPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09Ki9cbmZ1bmN0aW9uIHNvY2lhbChyb3N0ZXIpIHt9O1xuLyo9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG49ICAgICAgICAgICAgTU9CSUxFIEFQUCAgICAgICAgICAgID1cbj09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT0qL1xuZnVuY3Rpb24gaW5pdE1vYmlsZUFwcCgpIHtcbiAgICB2YXIgY291bnRlciA9IDE7XG4gICAgc2V0SW50ZXJ2YWwoZnVuY3Rpb24oKSB7XG4gICAgICAgIGpRdWVyeSgnLmFwcCAuYm90dG9tLXdyYXAgaW1nJykucmVtb3ZlQ2xhc3MoJ2FjdGl2ZScpO1xuICAgICAgICBqUXVlcnkoJy5hcHAgLmZlYXR1cmUtbGlzdCBwJykucmVtb3ZlQ2xhc3MoJ2FjdGl2ZScpO1xuICAgICAgICBqUXVlcnkoJy5hcHAgLmZlYXR1cmUtbGlzdCBwOm50aC1vZi10eXBlKCcgKyBjb3VudGVyICsgJyknKS5hZGRDbGFzcygnYWN0aXZlJyk7XG4gICAgICAgIGpRdWVyeSgnLmFwcCAuYm90dG9tLXdyYXAgaW1nOm50aC1vZi10eXBlKCcgKyBjb3VudGVyICsgJyknKS5hZGRDbGFzcygnYWN0aXZlJyk7XG4gICAgICAgIGlmIChjb3VudGVyID09IDUpIHtcbiAgICAgICAgICAgIGNvdW50ZXIgPSAxO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgY291bnRlcisrO1xuICAgICAgICB9XG4gICAgfSwgMjAwMCk7XG59O1xuXG5mdW5jdGlvbiBtb2JpbGVBcHAoKSB7XG4gICAgalF1ZXJ5KCcuYXBwJykuc2hvdygpO1xufTtcbi8qPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG49ICAgICAgICAgICAgU1RBTkRJTkdTICAgICAgICAgICAgPVxuPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09Ki9cbmZ1bmN0aW9uIHN0YW5kaW5ncygpIHt9O1xuLyo9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuPSAgICAgICAgICAgIEFST1VORCBUSEUgTEVBR1VFICAgICAgICAgICAgPVxuPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT0qL1xuZnVuY3Rpb24gYXJvdW5kVGhlTGVhZ3VlKCkge307Il19
