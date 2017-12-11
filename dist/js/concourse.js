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
    var playerSpotlightCounter = 15;
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
                }
            }
        }
    });
    // loadRosterData(); ONLY ONCE
    // initMobileApp();
    // playerSpotlight(rosterObj, playerSpotlightCounter);
    // mobileApp();
    setTimeout(leaders(gid, gameStarted), 400);
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
    var seasonsPlayed = rosterObj[selectedPlayer].stats.seasonAvg.length;
    var timelineHTML = '';
    var seasonYearHTML = '';
    for (i = 0; i < seasonsPlayed; i++) {
        var teamAbbreviation = rosterObj[selectedPlayer].stats.seasonAvg[i].ta;
        var traded = rosterObj[selectedPlayer].stats.seasonAvg[i].spl.length;
        var segmentInner = "";
        var title = "";
        var seasonYearText = rosterObj[selectedPlayer].stats.seasonAvg[i].val;
        if (rosterObj[selectedPlayer].stats.hasStats == false) {
            seasonYearText = "";
        }
        if (i === 0 || teamAbbreviation !== rosterObj[selectedPlayer].stats.seasonAvg[i - 1].ta) {
            // If this is a new team, start the team wrap.
            title = teamAbbreviation;
        }
        if (traded) {
            for (var x = 0; x < traded; x++) {
                var gpTot = rosterObj[selectedPlayer].stats.seasonAvg[i].gp;
                var gp = rosterObj[selectedPlayer].stats.seasonAvg[i].spl[x].gp;
                var gpPercentage = Math.round(gp / gpTot * 100);
                teamAbbreviation = rosterObj[selectedPlayer].stats.seasonAvg[i].spl[x].ta;
                if (i === 0 || teamAbbreviation !== rosterObj[selectedPlayer].stats.seasonAvg[i - 1].ta && teamAbbreviation !== rosterObj[selectedPlayer].stats.seasonAvg[i + 1].ta) {
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
        for (var player in rosterObj) {
            console.log(player);
            var headshot = 'https://ak-static.cms.nba.com/wp-content/uploads/headshots/nba/latest/1040x760/' + rosterObj[player].pid + '.png';
            jQuery('.player-box:nth-child(' + (forinCounter + 1) + ')').append('<img class="appended headshot" src="' + headshot + '"/>');
            jQuery('.player-box:nth-child(' + (forinCounter + 1) + ')').attr('data-pid', rosterObj[player].pid);
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
        var stats = rosterObj[selectedPlayer].stats;
        jQuery('.player-spotlight .top-wrap .player-top').append('<img class="silo appended" src="http://io.cnn.net/nba/nba/.element/media/2.0/teamsites/celtics/media/silo-466x591-' + rosterObj[selectedPlayer].pid + '.png" /><div class="top appended"><div class="player-name-wrap"><p class="player-name"><span>' + rosterObj[selectedPlayer].fn.toUpperCase() + '</span> <br> ' + rosterObj[selectedPlayer].ln.toUpperCase() + '</p></div><p class="player-number">' + rosterObj[selectedPlayer].num + '</br><span>' + rosterObj[selectedPlayer].pos + '</span></p></div><div class="middle appended"><ul class="info clearfix"><li><p>AGE<span class="sm-hide">:&nbsp;</span> </br><span class="info-value">' + playerAge(rosterObj[selectedPlayer].dob) + '</span></p></li><li><p>HT<span class="sm-hide">:&nbsp;</span> </br><span class="info-value">' + rosterObj[selectedPlayer].ht + '</span></p></li><li><p>WT<span class="sm-hide">:&nbsp;</span> </br><span class="info-value">' + rosterObj[selectedPlayer].wt + '</span></p></li></ul></div><div class="bottom full clearfix sm-hide appended"><table class="averages"><tr class="averages-labels"><td><p>GP</p></td><td><p>PPG</p></td><td><p>RPG</p></td><td><p>APG</p></td></tr><tr class="averages-season"><td class="gp"><p></p></td><td class="pts"><p></p></td><td class="reb"><p></p></td><td class="ast"><p></p></td></tr></table></div>');
        jQuery(".player-spotlight .averages-season").html('<td><p>' + stats.seasonAvg[0].gp + '</p></td><td><p>' + stats.seasonAvg[0].pts + '</p></td><td><p>' + stats.seasonAvg[0].reb + '</p></td><td><p>' + stats.seasonAvg[0].ast + '</p></td>');
        jQuery('.player-spotlight .player-name').fadeTo(200, 1);
        var playerFacts = rosterObj[selectedPlayer].bio.personal;
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
        },
        error: function error() {}
    });
    var awayRoster = '';
    jQuery.ajax({
        url: 'http://localhost:8888/data/mobile-stats-feed/away_roster.json',
        async: false,
        success: function success(data) {
            awayRoster = data;
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

var test = '';

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
                jQuery('.leader-section:nth-of-type(' + (i + 2) + ') .' + stat + '.' + team + ' .stat').append('<span>' + rosterObj[team].leaders[stat][i][2] + '</span> ' + stat.toUpperCase());
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
    }, 800);
    var transitionCounter = 1;

    var _loop = function _loop(_i) {
        setTimeout(function (numberString) {
            jQuery('.leaders .leader-section .leader-stat-wrap').addClass('transition-' + _i);
            jQuery('.leader-subsection.bottom p').removeClass('transition-' + _i);
            if (transitionCounter % 2 == 0) {
                setTimeout(function () {
                    console.log(_i);
                    jQuery('.leaders .leader-section .underline').addClass('transition-' + _i / 2);
                    jQuery('.leader-subsection.bottom p:nth-of-type(2)').addClass('transition-' + _i / 2);
                }, 400);
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJzcmMvanMvY29uY291cnNlLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7QUNBQSxJQUFJLFlBQVk7QUFDWixhQUFTO0FBQ0wsZ0JBQVEsRUFESDtBQUVMLGlCQUFTO0FBQ0wsaUJBQUssQ0FBQyxDQUFDLElBQUQsRUFBTyxJQUFQLEVBQWEsSUFBYixFQUFtQixJQUFuQixDQUFELEVBQTJCLENBQUMsSUFBRCxFQUFPLElBQVAsRUFBYSxJQUFiLEVBQW1CLElBQW5CLENBQTNCLEVBQXFELENBQUMsSUFBRCxFQUFPLElBQVAsRUFBYSxJQUFiLEVBQW1CLElBQW5CLENBQXJELENBREE7QUFFTCxpQkFBSyxDQUFDLENBQUMsSUFBRCxFQUFPLElBQVAsRUFBYSxJQUFiLEVBQW1CLElBQW5CLENBQUQsRUFBMkIsQ0FBQyxJQUFELEVBQU8sSUFBUCxFQUFhLElBQWIsRUFBbUIsSUFBbkIsQ0FBM0IsRUFBcUQsQ0FBQyxJQUFELEVBQU8sSUFBUCxFQUFhLElBQWIsRUFBbUIsSUFBbkIsQ0FBckQsQ0FGQTtBQUdMLGlCQUFLLENBQUMsQ0FBQyxJQUFELEVBQU8sSUFBUCxFQUFhLElBQWIsRUFBbUIsSUFBbkIsQ0FBRCxFQUEyQixDQUFDLElBQUQsRUFBTyxJQUFQLEVBQWEsSUFBYixFQUFtQixJQUFuQixDQUEzQixFQUFxRCxDQUFDLElBQUQsRUFBTyxJQUFQLEVBQWEsSUFBYixFQUFtQixJQUFuQixDQUFyRDtBQUhBO0FBRkosS0FERztBQVNaLFVBQU07QUFDRixnQkFBUSxFQUROO0FBRUYsaUJBQVM7QUFDTCxpQkFBSyxDQUFDLENBQUMsSUFBRCxFQUFPLElBQVAsRUFBYSxJQUFiLEVBQW1CLElBQW5CLENBQUQsRUFBMkIsQ0FBQyxJQUFELEVBQU8sSUFBUCxFQUFhLElBQWIsRUFBbUIsSUFBbkIsQ0FBM0IsRUFBcUQsQ0FBQyxJQUFELEVBQU8sSUFBUCxFQUFhLElBQWIsRUFB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RUFBK0IsV0FBL0IsQ0FBMkMsUUFBM0M7QUFDQSxlQUFPLHNDQUFzQyxPQUF0QyxHQUFnRCxHQUF2RCxFQUE0RCxRQUE1RCxDQUFxRSxRQUFyRTtBQUNBLGVBQU8sdUNBQXVDLE9BQXZDLEdBQWlELEdBQXhELEVBQTZELFFBQTdELENBQXNFLFFBQXRFO0FBQ0EsWUFBSSxXQUFXLENBQWYsRUFBa0I7QUFDZCxzQkFBVSxDQUFWO0FBQ0gsU0FGRCxNQUVPO0FBQ0g7QUFDSDtBQUNKLEtBVkQsRUFVRyxJQVZIO0FBV0g7O0FBRUQsU0FBUyxTQUFULEdBQXFCO0FBQ2pCLFdBQU8sTUFBUCxFQUFlLElBQWY7QUFDSDtBQUNEOzs7QUFHQSxTQUFTLFNBQVQsR0FBcUIsQ0FBRTtBQUN2Qjs7O0FBR0EsU0FBUyxlQUFULEdBQTJCLENBQUUiLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbiBlKHQsbixyKXtmdW5jdGlvbiBzKG8sdSl7aWYoIW5bb10pe2lmKCF0W29dKXt2YXIgYT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2lmKCF1JiZhKXJldHVybiBhKG8sITApO2lmKGkpcmV0dXJuIGkobywhMCk7dmFyIGY9bmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitvK1wiJ1wiKTt0aHJvdyBmLmNvZGU9XCJNT0RVTEVfTk9UX0ZPVU5EXCIsZn12YXIgbD1uW29dPXtleHBvcnRzOnt9fTt0W29dWzBdLmNhbGwobC5leHBvcnRzLGZ1bmN0aW9uKGUpe3ZhciBuPXRbb11bMV1bZV07cmV0dXJuIHMobj9uOmUpfSxsLGwuZXhwb3J0cyxlLHQsbixyKX1yZXR1cm4gbltvXS5leHBvcnRzfXZhciBpPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7Zm9yKHZhciBvPTA7bzxyLmxlbmd0aDtvKyspcyhyW29dKTtyZXR1cm4gc30pIiwidmFyIHJvc3Rlck9iaiA9IHtcbiAgICBjZWx0aWNzOiB7XG4gICAgICAgIHJvc3Rlcjoge30sXG4gICAgICAgIGxlYWRlcnM6IHtcbiAgICAgICAgICAgIHB0czogW1snLS0nLCAnLS0nLCAnLS0nLCAnLS0nXSwgWyctLScsICctLScsICctLScsICctLSddLCBbJy0tJywgJy0tJywgJy0tJywgJy0tJ11dLFxuICAgICAgICAgICAgYXN0OiBbWyctLScsICctLScsICctLScsICctLSddLCBbJy0tJywgJy0tJywgJy0tJywgJy0tJ10sIFsnLS0nLCAnLS0nLCAnLS0nLCAnLS0nXV0sXG4gICAgICAgICAgICByZWI6IFtbJy0tJywgJy0tJywgJy0tJywgJy0tJ10sIFsnLS0nLCAnLS0nLCAnLS0nLCAnLS0nXSwgWyctLScsICctLScsICctLScsICctLSddXVxuICAgICAgICB9XG4gICAgfSxcbiAgICBhd2F5OiB7XG4gICAgICAgIHJvc3Rlcjoge30sXG4gICAgICAgIGxlYWRlcnM6IHtcbiAgICAgICAgICAgIHB0czogW1snLS0nLCAnLS0nLCAnLS0nLCAnLS0nXSwgWyctLScsICctLScsICctLScsICctLSddLCBbJy0tJywgJy0tJywgJy0tJywgJy0tJ11dLFxuICAgICAgICAgICAgYXN0OiBbWyctLScsICctLScsICctLScsICctLSddLCBbJy0tJywgJy0tJywgJy0tJywgJy0tJ10sIFsnLS0nLCAnLS0nLCAnLS0nLCAnLS0nXV0sXG4gICAgICAgICAgICByZWI6IFtbJy0tJywgJy0tJywgJy0tJywgJy0tJ10sIFsnLS0nLCAnLS0nLCAnLS0nLCAnLS0nXSwgWyctLScsICctLScsICctLScsICctLSddXVxuICAgICAgICB9XG4gICAgfVxufTtcblxualF1ZXJ5KGRvY3VtZW50KS5yZWFkeShmdW5jdGlvbigpIHtcbiAgICB2YXIgZ2lkID0gJyc7XG4gICAgdmFyIGdhbWVTdGFydGVkID0gZmFsc2U7XG4gICAgdmFyIHBsYXllclNwb3RsaWdodENvdW50ZXIgPSAxNTtcbiAgICB2YXIgZGF0ZSA9IG5ldyBEYXRlKCk7XG4gICAgalF1ZXJ5LmFqYXgoe1xuICAgICAgICB1cmw6ICdodHRwOi8vbG9jYWxob3N0Ojg4ODgvZGF0YS9tb2JpbGUtc3RhdHMtZmVlZC90b2RheXNfc2NvcmVzLmpzb24nLFxuICAgICAgICBhc3luYzogZmFsc2UsXG4gICAgICAgIHN1Y2Nlc3M6IGZ1bmN0aW9uKHRvZGF5c1Njb3Jlc0RhdGEpIHtcbiAgICAgICAgICAgIHZhciBnaWQgPSAnJztcbiAgICAgICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgdG9kYXlzU2NvcmVzRGF0YS5ncy5nLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICAgICAgaWYgKHRvZGF5c1Njb3Jlc0RhdGEuZ3MuZ1tpXS5oLnRhID09ICdPUkwnKSB7IC8vQ0hBTkdFIFRISVNcbiAgICAgICAgICAgICAgICAgICAgbG9hZFJvc3RlckRhdGEodG9kYXlzU2NvcmVzRGF0YS5ncy5nW2ldLnYudGEpO1xuICAgICAgICAgICAgICAgICAgICBnaWQgPSB0b2RheXNTY29yZXNEYXRhLmdzLmdbaV0uZ2lkO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH0pO1xuICAgIC8vIGxvYWRSb3N0ZXJEYXRhKCk7IE9OTFkgT05DRVxuICAgIC8vIGluaXRNb2JpbGVBcHAoKTtcbiAgICAvLyBwbGF5ZXJTcG90bGlnaHQocm9zdGVyT2JqLCBwbGF5ZXJTcG90bGlnaHRDb3VudGVyKTtcbiAgICAvLyBtb2JpbGVBcHAoKTtcbiAgICBzZXRUaW1lb3V0KGxlYWRlcnMoZ2lkLCBnYW1lU3RhcnRlZCksIDQwMCk7XG59KTtcbi8qPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbj0gICAgICAgICAgICBNSVNDIEZVTkNUSU9OUyAgICAgICAgICAgID1cbj09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09Ki9cbmZ1bmN0aW9uIHBsYXllckFnZShkb2IpIHtcbiAgICB2YXIgdG9kYXkgPSBuZXcgRGF0ZSgpO1xuICAgIHZhciBiaXJ0aERhdGUgPSBuZXcgRGF0ZShkb2IpO1xuICAgIHZhciBhZ2UgPSB0b2RheS5nZXRGdWxsWWVhcigpIC0gYmlydGhEYXRlLmdldEZ1bGxZZWFyKCk7XG4gICAgcmV0dXJuIGFnZTtcbn1cblxuZnVuY3Rpb24gZ2VuZXJhdGVUaW1lbGluZShzZWxlY3RlZFBsYXllcikge1xuICAgIC8vIEFQUEVORDogVElNRUxJTkVcbiAgICB2YXIgc2Vhc29uc1BsYXllZCA9IHJvc3Rlck9ialtzZWxlY3RlZFBsYXllcl0uc3RhdHMuc2Vhc29uQXZnLmxlbmd0aDtcbiAgICB2YXIgdGltZWxpbmVIVE1MID0gJyc7XG4gICAgdmFyIHNlYXNvblllYXJIVE1MID0gJyc7XG4gICAgZm9yIChpID0gMDsgaSA8IHNlYXNvbnNQbGF5ZWQ7IGkrKykge1xuICAgICAgICB2YXIgdGVhbUFiYnJldmlhdGlvbiA9IHJvc3Rlck9ialtzZWxlY3RlZFBsYXllcl0uc3RhdHMuc2Vhc29uQXZnW2ldLnRhO1xuICAgICAgICB2YXIgdHJhZGVkID0gcm9zdGVyT2JqW3NlbGVjdGVkUGxheWVyXS5zdGF0cy5zZWFzb25BdmdbaV0uc3BsLmxlbmd0aDtcbiAgICAgICAgdmFyIHNlZ21lbnRJbm5lciA9IFwiXCI7XG4gICAgICAgIHZhciB0aXRsZSA9IFwiXCI7XG4gICAgICAgIHZhciBzZWFzb25ZZWFyVGV4dCA9IHJvc3Rlck9ialtzZWxlY3RlZFBsYXllcl0uc3RhdHMuc2Vhc29uQXZnW2ldLnZhbDtcbiAgICAgICAgaWYgKHJvc3Rlck9ialtzZWxlY3RlZFBsYXllcl0uc3RhdHMuaGFzU3RhdHMgPT0gZmFsc2UpIHtcbiAgICAgICAgICAgIHNlYXNvblllYXJUZXh0ID0gXCJcIjtcbiAgICAgICAgfVxuICAgICAgICBpZiAoaSA9PT0gMCB8fCB0ZWFtQWJicmV2aWF0aW9uICE9PSByb3N0ZXJPYmpbc2VsZWN0ZWRQbGF5ZXJdLnN0YXRzLnNlYXNvbkF2Z1tpIC0gMV0udGEpIHsgLy8gSWYgdGhpcyBpcyBhIG5ldyB0ZWFtLCBzdGFydCB0aGUgdGVhbSB3cmFwLlxuICAgICAgICAgICAgdGl0bGUgPSB0ZWFtQWJicmV2aWF0aW9uO1xuICAgICAgICB9XG4gICAgICAgIGlmICh0cmFkZWQpIHtcbiAgICAgICAgICAgIGZvciAodmFyIHggPSAwOyB4IDwgdHJhZGVkOyB4KyspIHtcbiAgICAgICAgICAgICAgICB2YXIgZ3BUb3QgPSByb3N0ZXJPYmpbc2VsZWN0ZWRQbGF5ZXJdLnN0YXRzLnNlYXNvbkF2Z1tpXS5ncDtcbiAgICAgICAgICAgICAgICB2YXIgZ3AgPSByb3N0ZXJPYmpbc2VsZWN0ZWRQbGF5ZXJdLnN0YXRzLnNlYXNvbkF2Z1tpXS5zcGxbeF0uZ3A7XG4gICAgICAgICAgICAgICAgdmFyIGdwUGVyY2VudGFnZSA9IE1hdGgucm91bmQoKGdwIC8gZ3BUb3QpICogMTAwKTtcbiAgICAgICAgICAgICAgICB0ZWFtQWJicmV2aWF0aW9uID0gcm9zdGVyT2JqW3NlbGVjdGVkUGxheWVyXS5zdGF0cy5zZWFzb25BdmdbaV0uc3BsW3hdLnRhO1xuICAgICAgICAgICAgICAgIGlmIChpID09PSAwIHx8IHRlYW1BYmJyZXZpYXRpb24gIT09IHJvc3Rlck9ialtzZWxlY3RlZFBsYXllcl0uc3RhdHMuc2Vhc29uQXZnW2kgLSAxXS50YSAmJiB0ZWFtQWJicmV2aWF0aW9uICE9PSByb3N0ZXJPYmpbc2VsZWN0ZWRQbGF5ZXJdLnN0YXRzLnNlYXNvbkF2Z1tpICsgMV0udGEpIHsgLy8gSWYgdGhpcyBpcyBhIG5ldyB0ZWFtLCBzdGFydCB0aGUgdGVhbSB3cmFwLlxuICAgICAgICAgICAgICAgICAgICB0aXRsZSA9IHRlYW1BYmJyZXZpYXRpb247XG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgdGl0bGUgPSBcIlwiO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBzZWdtZW50SW5uZXIgKz0gJzxkaXYgZGF0YS1zZWFzb24teWVhcj1cIicgKyBzZWFzb25ZZWFyVGV4dCArICdcIiBkYXRhLXRlYW09XCInICsgdGVhbUFiYnJldmlhdGlvbiArICdcIiBzdHlsZT1cIlwiIGNsYXNzPVwic2VnbWVudC1pbm5lciAnICsgdGVhbUFiYnJldmlhdGlvbiArICctYmdcIj48cD4nICsgdGl0bGUgKyAnPC9wPjwvZGl2Pic7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBzZWdtZW50SW5uZXIgPSAnPGRpdiBkYXRhLXNlYXNvbi15ZWFyPVwiJyArIHNlYXNvblllYXJUZXh0ICsgJ1wiIGRhdGEtdGVhbT1cIicgKyB0ZWFtQWJicmV2aWF0aW9uICsgJ1wiIGNsYXNzPVwic2VnbWVudC1pbm5lciAnICsgdGVhbUFiYnJldmlhdGlvbiArICctYmdcIj48cD4nICsgdGl0bGUgKyAnPC9wPjwvZGl2Pic7XG4gICAgICAgIH1cbiAgICAgICAgdGltZWxpbmVIVE1MICs9ICc8ZGl2IGNsYXNzPVwic2VnbWVudFwiPicgKyBzZWdtZW50SW5uZXIgKyAnPC9kaXY+JztcbiAgICAgICAgc2Vhc29uWWVhckhUTUwgKz0gJzxkaXYgY2xhc3M9XCJzZWdtZW50XCI+PHA+JyArIHNlYXNvblllYXJUZXh0ICsgJzwvcD48L2Rpdj4nO1xuICAgIH1cbiAgICBqUXVlcnkoXCIudGltZWxpbmUtd3JhcFwiKS5odG1sKCc8ZGl2IGNsYXNzPVwidGltZWxpbmUgYXBwZW5kZWRcIj4nICsgdGltZWxpbmVIVE1MICsgJzwvZGl2PjxkaXYgY2xhc3M9XCJzZWFzb24teWVhciBhcHBlbmRlZFwiPicgKyBzZWFzb25ZZWFySFRNTCArICc8L2Rpdj4nKTtcbn1cbi8qPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuPSAgICAgICAgICAgIElOSVRJQUxJWkUgICAgICAgICAgICA9XG49PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09Ki9cbmZ1bmN0aW9uIGluaXQoKSB7XG4gICAgaWYgKCFnYW1lU3RhcnRlZCkge1xuICAgICAgICBqUXVlcnkuYWpheCh7XG4gICAgICAgICAgICB1cmw6ICdodHRwOi8vbG9jYWxob3N0Ojg4ODgvZGF0YS9tb2JpbGUtc3RhdHMtZmVlZC90b2RheXNfc2NvcmVzLmpzb24nLFxuICAgICAgICAgICAgYXN5bmM6IGZhbHNlLFxuICAgICAgICAgICAgc3VjY2VzczogZnVuY3Rpb24odG9kYXlzU2NvcmVzRGF0YSkge1xuICAgICAgICAgICAgICAgIHZhciBnaWQgPSAnJztcbiAgICAgICAgICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IHRvZGF5c1Njb3Jlc0RhdGEuZ3MuZy5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgICAgICAgICBpZiAodG9kYXlzU2NvcmVzRGF0YS5ncy5nW2ldLmgudGEgPT0gJ09STCcpIHsgLy8gQ0hBTkdFIFRISVMgVE8gJ0JPUycgV0hFTiBUSEUgVElNRSBDT01FU1xuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHRvZGF5c1Njb3Jlc0RhdGEuZ3MuZ1tpXSAhPT0gMSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGdhbWVTdGFydGVkID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgfVxufTtcbi8qPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuPSAgICAgICAgICAgIFBMQVlFUiBTUE9UTElHSFQgICAgICAgICAgICA9XG49PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09Ki9cbmZ1bmN0aW9uIHBsYXllclNwb3RsaWdodChyb3N0ZXJPYmosIHBsYXllclNwb3RsaWdodENvdW50ZXIpIHtcbiAgICAvKiAxIC0gV0hJVEUgTElORSBIT1JJWlRPTkFMICovXG4gICAgc2V0VGltZW91dChmdW5jdGlvbigpIHtcbiAgICAgICAgalF1ZXJ5KCcud2hpdGUtbGluZS5ob3Jpem9udGFsJykuYWRkQ2xhc3MoJ3RyYW5zaXRpb24tMScpO1xuICAgIH0sIDUwMCk7XG4gICAgc2V0VGltZW91dChmdW5jdGlvbigpIHtcbiAgICAgICAgalF1ZXJ5KCcuc29jaWFsLXRvcCAud2hpdGUtbGluZS52ZXJ0aWNhbDpudGgtY2hpbGQob2RkKScpLmFkZENsYXNzKCd0cmFuc2l0aW9uLTEnKTtcbiAgICAgICAgalF1ZXJ5KCcuc29jaWFsLWJvdHRvbSAud2hpdGUtbGluZS52ZXJ0aWNhbDpudGgtY2hpbGQoZXZlbiknKS5hZGRDbGFzcygndHJhbnNpdGlvbi0xJyk7XG4gICAgfSwgODAwKTtcbiAgICAvKiAyYiAtIFdISVRFIExJTkUgVkVSVElDQUwgKi9cbiAgICBzZXRUaW1lb3V0KGZ1bmN0aW9uKCkge1xuICAgICAgICBqUXVlcnkoJy5zb2NpYWwtdG9wIC53aGl0ZS1saW5lLnZlcnRpY2FsOm50aC1jaGlsZChldmVuKScpLmFkZENsYXNzKCd0cmFuc2l0aW9uLTEnKTtcbiAgICAgICAgalF1ZXJ5KCcuc29jaWFsLWJvdHRvbSAud2hpdGUtbGluZS52ZXJ0aWNhbDpudGgtY2hpbGQob2RkKScpLmFkZENsYXNzKCd0cmFuc2l0aW9uLTEnKTtcbiAgICB9LCAxMDAwKTtcbiAgICAvKiAzIC0gR0VORVJBVEUgQU5EIFJFVkVBTCBQTEFZRVIgQk9YRVMgKi9cbiAgICBzZXRUaW1lb3V0KGZ1bmN0aW9uKCkge1xuICAgICAgICBqUXVlcnkoJy5zb2NpYWwtdG9wLCAuc29jaWFsLWJvdHRvbScpLmFkZENsYXNzKCd0cmFuc2l0aW9uLTEnKTtcbiAgICAgICAgalF1ZXJ5KCcucGxheWVyLWJveC13cmFwJykuYWRkQ2xhc3MoJ3RyYW5zaXRpb24tMScpO1xuICAgIH0sIDEyMDApO1xuICAgIC8qIDQgLSBBUFBFTkQgSEVBRFNIT1RTICovXG4gICAgc2V0VGltZW91dChmdW5jdGlvbigpIHtcbiAgICAgICAgalF1ZXJ5KCcucGxheWVyLWJveC13cmFwJykuYWRkQ2xhc3MoJ3RyYW5zaXRpb24tMicpO1xuICAgICAgICBqUXVlcnkoJy5wbGF5ZXItYm94JykuYWRkQ2xhc3MoJ3RyYW5zaXRpb24tMScpO1xuICAgICAgICB2YXIgZGVsYXkgPSAwO1xuICAgICAgICB2YXIgZm9yaW5Db3VudGVyID0gMDtcbiAgICAgICAgZm9yICh2YXIgcGxheWVyIGluIHJvc3Rlck9iaikge1xuICAgICAgICAgICAgY29uc29sZS5sb2cocGxheWVyKTtcbiAgICAgICAgICAgIHZhciBoZWFkc2hvdCA9ICdodHRwczovL2FrLXN0YXRpYy5jbXMubmJhLmNvbS93cC1jb250ZW50L3VwbG9hZHMvaGVhZHNob3RzL25iYS9sYXRlc3QvMTA0MHg3NjAvJyArIHJvc3Rlck9ialtwbGF5ZXJdLnBpZCArICcucG5nJztcbiAgICAgICAgICAgIGpRdWVyeSgnLnBsYXllci1ib3g6bnRoLWNoaWxkKCcgKyAoZm9yaW5Db3VudGVyICsgMSkgKyAnKScpLmFwcGVuZCgnPGltZyBjbGFzcz1cImFwcGVuZGVkIGhlYWRzaG90XCIgc3JjPVwiJyArIGhlYWRzaG90ICsgJ1wiLz4nKTtcbiAgICAgICAgICAgIGpRdWVyeSgnLnBsYXllci1ib3g6bnRoLWNoaWxkKCcgKyAoZm9yaW5Db3VudGVyICsgMSkgKyAnKScpLmF0dHIoJ2RhdGEtcGlkJywgcm9zdGVyT2JqW3BsYXllcl0ucGlkKTtcbiAgICAgICAgICAgIGpRdWVyeSgnLnBsYXllci1ib3ggaW1nJykub24oXCJlcnJvclwiLCBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgICAgICBqUXVlcnkodGhpcykuYXR0cignc3JjJywgJ2h0dHBzOi8vaS5jZG4udHVybmVyLmNvbS9uYmEvbmJhLy5lbGVtZW50L21lZGlhLzIuMC90ZWFtc2l0ZXMvY2VsdGljcy9tZWRpYS9nZW5lcmljLXBsYXllci1saWdodF82MDB4NDM4LnBuZycpO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICBqUXVlcnkoJy5wbGF5ZXItYm94Om50aC1jaGlsZCgnICsgKGZvcmluQ291bnRlciArIDEpICsgJykgaW1nJykuZGVsYXkoZGVsYXkpLmZhZGVUbygzMDAsIDEpO1xuICAgICAgICAgICAgZGVsYXkgKz0gMzA7XG4gICAgICAgICAgICBmb3JpbkNvdW50ZXIrKztcbiAgICAgICAgfVxuICAgIH0sIDEzMDApO1xuICAgIC8qIDUgLSBQTEFZRVIgU0VMRUNUICovXG4gICAgdmFyIHNlbGVjdGVkUGxheWVyID0gJyc7XG4gICAgc2V0VGltZW91dChmdW5jdGlvbigpIHtcbiAgICAgICAgalF1ZXJ5KCcucGxheWVyLWJveCcpLmFkZENsYXNzKCd0cmFuc2l0aW9uLTInKTtcbiAgICAgICAgalF1ZXJ5KCcucGxheWVyLWJveDpudGgtY2hpbGQoJyArIChwbGF5ZXJTcG90bGlnaHRDb3VudGVyICsgMSkgKyAnKScpLmFkZENsYXNzKCdzZWxlY3RlZCcpO1xuICAgICAgICBzZWxlY3RlZFBsYXllciA9IGpRdWVyeSgnLnBsYXllci1ib3g6bnRoLWNoaWxkKCcgKyAocGxheWVyU3BvdGxpZ2h0Q291bnRlciArIDEpICsgJyknKS5hdHRyKCdkYXRhLXBpZCcpO1xuICAgICAgICBqUXVlcnkoJy5wbGF5ZXItYm94Jykubm90KCcucmVwbGFjZW1lbnQuc2VsZWN0ZWQnKS5kZWxheSg1MDApLmFkZENsYXNzKCd0cmFuc2l0aW9uLTQnKTtcbiAgICB9LCAyMDAwKTtcbiAgICAvKiA2IC0gUExBWUVSIEJPWCBFWFBBTkQgKi9cbiAgICBzZXRUaW1lb3V0KGZ1bmN0aW9uKCkge1xuICAgICAgICBqUXVlcnkoJy5ibG9jay13cmFwLnNvY2lhbCcpLmFkZENsYXNzKCd0cmFuc2l0aW9uLTMnKTtcbiAgICAgICAgalF1ZXJ5KCcucGxheWVyLWJveC5yZXBsYWNlbWVudC5zZWxlY3RlZCcpLmFkZENsYXNzKCd0cmFuc2l0aW9uLTMnKTtcbiAgICB9LCAzMDAwKTtcbiAgICAvKiA3IC0gU1BPVExJR0hUIEhUTUwgKi9cbiAgICBzZXRUaW1lb3V0KGZ1bmN0aW9uKCkge1xuICAgICAgICBnZW5lcmF0ZVRpbWVsaW5lKHNlbGVjdGVkUGxheWVyKTtcbiAgICAgICAgalF1ZXJ5KCcucGxheWVyLWJveC5yZXBsYWNlbWVudC5zZWxlY3RlZCcpLmNsb25lKCkuYXBwZW5kVG8oJy5ibG9jay13cmFwLnBsYXllci1zcG90bGlnaHQgLnRvcC13cmFwJyk7XG4gICAgICAgIGpRdWVyeSgnLnBsYXllci1zcG90bGlnaHQgLnNlbGVjdGVkJykuYWRkQ2xhc3MoJy5hcHBlbmRlZCcpO1xuICAgICAgICBqUXVlcnkoJy5ibG9jay13cmFwLnBsYXllci1zcG90bGlnaHQnKS5hZGRDbGFzcygndHJhbnNpdGlvbi0xJyk7XG4gICAgICAgIGpRdWVyeSgnLmJsb2NrLXdyYXAuc29jaWFsJykuYWRkQ2xhc3MoJ3RyYW5zaXRpb24tMScpO1xuICAgICAgICB2YXIgc3RhdHMgPSByb3N0ZXJPYmpbc2VsZWN0ZWRQbGF5ZXJdLnN0YXRzO1xuICAgICAgICBqUXVlcnkoJy5wbGF5ZXItc3BvdGxpZ2h0IC50b3Atd3JhcCAucGxheWVyLXRvcCcpLmFwcGVuZCgnPGltZyBjbGFzcz1cInNpbG8gYXBwZW5kZWRcIiBzcmM9XCJodHRwOi8vaW8uY25uLm5ldC9uYmEvbmJhLy5lbGVtZW50L21lZGlhLzIuMC90ZWFtc2l0ZXMvY2VsdGljcy9tZWRpYS9zaWxvLTQ2Nng1OTEtJyArIHJvc3Rlck9ialtzZWxlY3RlZFBsYXllcl0ucGlkICsgJy5wbmdcIiAvPjxkaXYgY2xhc3M9XCJ0b3AgYXBwZW5kZWRcIj48ZGl2IGNsYXNzPVwicGxheWVyLW5hbWUtd3JhcFwiPjxwIGNsYXNzPVwicGxheWVyLW5hbWVcIj48c3Bhbj4nICsgcm9zdGVyT2JqW3NlbGVjdGVkUGxheWVyXS5mbi50b1VwcGVyQ2FzZSgpICsgJzwvc3Bhbj4gPGJyPiAnICsgcm9zdGVyT2JqW3NlbGVjdGVkUGxheWVyXS5sbi50b1VwcGVyQ2FzZSgpICsgJzwvcD48L2Rpdj48cCBjbGFzcz1cInBsYXllci1udW1iZXJcIj4nICsgcm9zdGVyT2JqW3NlbGVjdGVkUGxheWVyXS5udW0gKyAnPC9icj48c3Bhbj4nICsgcm9zdGVyT2JqW3NlbGVjdGVkUGxheWVyXS5wb3MgKyAnPC9zcGFuPjwvcD48L2Rpdj48ZGl2IGNsYXNzPVwibWlkZGxlIGFwcGVuZGVkXCI+PHVsIGNsYXNzPVwiaW5mbyBjbGVhcmZpeFwiPjxsaT48cD5BR0U8c3BhbiBjbGFzcz1cInNtLWhpZGVcIj46Jm5ic3A7PC9zcGFuPiA8L2JyPjxzcGFuIGNsYXNzPVwiaW5mby12YWx1ZVwiPicgKyBwbGF5ZXJBZ2Uocm9zdGVyT2JqW3NlbGVjdGVkUGxheWVyXS5kb2IpICsgJzwvc3Bhbj48L3A+PC9saT48bGk+PHA+SFQ8c3BhbiBjbGFzcz1cInNtLWhpZGVcIj46Jm5ic3A7PC9zcGFuPiA8L2JyPjxzcGFuIGNsYXNzPVwiaW5mby12YWx1ZVwiPicgKyByb3N0ZXJPYmpbc2VsZWN0ZWRQbGF5ZXJdLmh0ICsgJzwvc3Bhbj48L3A+PC9saT48bGk+PHA+V1Q8c3BhbiBjbGFzcz1cInNtLWhpZGVcIj46Jm5ic3A7PC9zcGFuPiA8L2JyPjxzcGFuIGNsYXNzPVwiaW5mby12YWx1ZVwiPicgKyByb3N0ZXJPYmpbc2VsZWN0ZWRQbGF5ZXJdLnd0ICsgJzwvc3Bhbj48L3A+PC9saT48L3VsPjwvZGl2PjxkaXYgY2xhc3M9XCJib3R0b20gZnVsbCBjbGVhcmZpeCBzbS1oaWRlIGFwcGVuZGVkXCI+PHRhYmxlIGNsYXNzPVwiYXZlcmFnZXNcIj48dHIgY2xhc3M9XCJhdmVyYWdlcy1sYWJlbHNcIj48dGQ+PHA+R1A8L3A+PC90ZD48dGQ+PHA+UFBHPC9wPjwvdGQ+PHRkPjxwPlJQRzwvcD48L3RkPjx0ZD48cD5BUEc8L3A+PC90ZD48L3RyPjx0ciBjbGFzcz1cImF2ZXJhZ2VzLXNlYXNvblwiPjx0ZCBjbGFzcz1cImdwXCI+PHA+PC9wPjwvdGQ+PHRkIGNsYXNzPVwicHRzXCI+PHA+PC9wPjwvdGQ+PHRkIGNsYXNzPVwicmViXCI+PHA+PC9wPjwvdGQ+PHRkIGNsYXNzPVwiYXN0XCI+PHA+PC9wPjwvdGQ+PC90cj48L3RhYmxlPjwvZGl2PicpO1xuICAgICAgICBqUXVlcnkoXCIucGxheWVyLXNwb3RsaWdodCAuYXZlcmFnZXMtc2Vhc29uXCIpLmh0bWwoJzx0ZD48cD4nICsgc3RhdHMuc2Vhc29uQXZnWzBdLmdwICsgJzwvcD48L3RkPjx0ZD48cD4nICsgc3RhdHMuc2Vhc29uQXZnWzBdLnB0cyArICc8L3A+PC90ZD48dGQ+PHA+JyArIHN0YXRzLnNlYXNvbkF2Z1swXS5yZWIgKyAnPC9wPjwvdGQ+PHRkPjxwPicgKyBzdGF0cy5zZWFzb25BdmdbMF0uYXN0ICsgJzwvcD48L3RkPicpO1xuICAgICAgICBqUXVlcnkoJy5wbGF5ZXItc3BvdGxpZ2h0IC5wbGF5ZXItbmFtZScpLmZhZGVUbygyMDAsIDEpO1xuICAgICAgICB2YXIgcGxheWVyRmFjdHMgPSByb3N0ZXJPYmpbc2VsZWN0ZWRQbGF5ZXJdLmJpby5wZXJzb25hbDtcbiAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCAzOyBpKyspIHtcbiAgICAgICAgICAgIHZhciBmYWN0SW5kZXggPSBNYXRoLmZsb29yKE1hdGgucmFuZG9tKCkgKiBwbGF5ZXJGYWN0cy5sZW5ndGgpO1xuICAgICAgICAgICAgalF1ZXJ5KCcucGxheWVyLXNwb3RsaWdodCAuYm90dG9tLXdyYXAnKS5hcHBlbmQoJzxkaXYgY2xhc3M9XCJkeWstYm94IGFwcGVuZGVkXCI+PHA+JyArIHBsYXllckZhY3RzW2ZhY3RJbmRleF0gKyAnPC9wPjwvZGl2PicpO1xuICAgICAgICB9O1xuICAgICAgICBqUXVlcnkoJy5wbGF5ZXItc3BvdGxpZ2h0IC5ib3R0b20td3JhcCcpLmFkZENsYXNzKCd0cmFuc2l0aW9uLTEnKTtcbiAgICAgICAgc2V0VGltZW91dChmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIGpRdWVyeSgnLnBsYXllci1zcG90bGlnaHQgLmJvdHRvbS13cmFwIC5keWstYm94Om50aC1vZi10eXBlKDIpJykuYWRkQ2xhc3MoJ3RyYW5zaXRpb24tMicpO1xuICAgICAgICAgICAgalF1ZXJ5KCcucGxheWVyLXNwb3RsaWdodCAuYm90dG9tLXdyYXAgLmR5ay1ib3g6bnRoLW9mLXR5cGUoMyknKS5hZGRDbGFzcygndHJhbnNpdGlvbi0xJyk7XG4gICAgICAgIH0sIDEwMDApO1xuICAgICAgICBzZXRUaW1lb3V0KGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgalF1ZXJ5KCcucGxheWVyLXNwb3RsaWdodCAuYm90dG9tLXdyYXAgLmR5ay1ib3g6bnRoLW9mLXR5cGUoMyknKS5hZGRDbGFzcygndHJhbnNpdGlvbi0yJyk7XG4gICAgICAgICAgICBqUXVlcnkoJy5wbGF5ZXItc3BvdGxpZ2h0IC5ib3R0b20td3JhcCAuZHlrLWJveDpudGgtb2YtdHlwZSg0KScpLmFkZENsYXNzKCd0cmFuc2l0aW9uLTEnKTtcbiAgICAgICAgfSwgMTUwMCk7XG4gICAgfSwgMzYwMCk7XG4gICAgLyogOCAtIFNQT1RMSUdIVCBTTElERSBJTiAqL1xuICAgIHNldFRpbWVvdXQoZnVuY3Rpb24oKSB7XG4gICAgICAgIGpRdWVyeSgnLnBsYXllci1zcG90bGlnaHQgLnBsYXllci10b3AgLnBsYXllci1uYW1lLCAucGxheWVyLXNwb3RsaWdodCAucGxheWVyLW5hbWUtd3JhcCwgLnBsYXllci1zcG90bGlnaHQgLmhlYWRzaG90LCAucGxheWVyLXNwb3RsaWdodCAuaW5mbywgLnBsYXllci1zcG90bGlnaHQgLnNpbG8sIC5wbGF5ZXItc3BvdGxpZ2h0IC5hdmVyYWdlcywgLnBsYXllci1zcG90bGlnaHQgLnBsYXllci1udW1iZXInKS5hZGRDbGFzcygndHJhbnNpdGlvbi0xJyk7XG4gICAgICAgIHNldFRpbWVvdXQoZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICBqUXVlcnkoJy5ibG9jay13cmFwLnBsYXllci1zcG90bGlnaHQgLnBsYXllci1ib3gnKS5yZW1vdmUoKTtcbiAgICAgICAgfSwgNDAwMCk7XG4gICAgICAgIGlmIChwbGF5ZXJTcG90bGlnaHRDb3VudGVyIDwgMTYpIHtcbiAgICAgICAgICAgIHBsYXllclNwb3RsaWdodENvdW50ZXIrKztcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHBsYXllclNwb3RsaWdodENvdW50ZXIgPSAwO1xuICAgICAgICB9XG4gICAgfSwgNDEwMCk7XG4gICAgLyogOSAtIFNQT1RMSUdIVCBTTElERSBPVVQgKi9cbiAgICBzZXRUaW1lb3V0KGZ1bmN0aW9uKCkge1xuICAgICAgICBqUXVlcnkoJy5wbGF5ZXItc3BvdGxpZ2h0IC5ib3R0b20td3JhcCwgLnBsYXllci1zcG90bGlnaHQgLnRvcC13cmFwJykuYWRkQ2xhc3MoJ3RyYW5zaXRpb24tMicpO1xuICAgIH0sIDYwMDApO1xuICAgIC8qIDEwIC0gRE9ORS4gUkVNT1ZFIFRIQVQgU0hJVCAqL1xuICAgIHNldFRpbWVvdXQoZnVuY3Rpb24oKSB7XG4gICAgICAgIGpRdWVyeSgnLmFwcGVuZGVkJykucmVtb3ZlKCk7XG4gICAgICAgIGpRdWVyeSgnLnRyYW5zaXRpb24sIC50cmFuc2l0aW9uLTEsIC50cmFuc2l0aW9uLTIsIC50cmFuc2l0aW9uLTMsIC50cmFuc2l0aW9uLTQnKS5yZW1vdmVDbGFzcygndHJhbnNpdGlvbiB0cmFuc2l0aW9uLTEgdHJhbnNpdGlvbi0yIHRyYW5zaXRpb24tMyB0cmFuc2l0aW9uLTQnKTtcbiAgICB9LCA3MDAwKTtcbn1cbi8qPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbj0gICAgICAgICAgICBMT0FEIFJPU1RFUiBJTkZPID0+IHJvc3Rlck9iaiAgICAgICAgICAgID1cbj09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09Ki9cbmZ1bmN0aW9uIGxvYWRSb3N0ZXJEYXRhKGF3YXlUZWFtKSB7XG4gICAgdmFyIHJvc3RlciA9ICcnO1xuICAgIGpRdWVyeS5hamF4KHtcbiAgICAgICAgdXJsOiAnaHR0cDovL2xvY2FsaG9zdDo4ODg4L2RhdGEvbW9iaWxlLXN0YXRzLWZlZWQvY2VsdGljc19yb3N0ZXIuanNvbicsXG4gICAgICAgIGFzeW5jOiBmYWxzZSxcbiAgICAgICAgc3VjY2VzczogZnVuY3Rpb24oZGF0YSkge1xuICAgICAgICAgICAgcm9zdGVyID0gZGF0YTtcbiAgICAgICAgfSxcbiAgICAgICAgZXJyb3I6IGZ1bmN0aW9uKCkge31cbiAgICB9KTtcbiAgICB2YXIgYXdheVJvc3RlciA9ICcnO1xuICAgIGpRdWVyeS5hamF4KHtcbiAgICAgICAgdXJsOiAnaHR0cDovL2xvY2FsaG9zdDo4ODg4L2RhdGEvbW9iaWxlLXN0YXRzLWZlZWQvYXdheV9yb3N0ZXIuanNvbicsXG4gICAgICAgIGFzeW5jOiBmYWxzZSxcbiAgICAgICAgc3VjY2VzczogZnVuY3Rpb24oZGF0YSkge1xuICAgICAgICAgICAgYXdheVJvc3RlciA9IGRhdGE7XG4gICAgICAgIH0sXG4gICAgICAgIGVycm9yOiBmdW5jdGlvbigpIHt9XG4gICAgfSk7XG4gICAgdmFyIGJpb0RhdGEgPSAnJztcbiAgICBqUXVlcnkuYWpheCh7XG4gICAgICAgIHVybDogJ2h0dHA6Ly9sb2NhbGhvc3Q6ODg4OC9kYXRhL2Jpby1kYXRhLmpzb24nLFxuICAgICAgICBhc3luYzogZmFsc2UsXG4gICAgICAgIHN1Y2Nlc3M6IGZ1bmN0aW9uKGRhdGEpIHtcbiAgICAgICAgICAgIGJpb0RhdGEgPSBkYXRhO1xuICAgICAgICB9LFxuICAgICAgICBlcnJvcjogZnVuY3Rpb24oKSB7fVxuICAgIH0pO1xuICAgIGZvciAodmFyIGkgPSAwOyBpIDwgcm9zdGVyLnQucGwubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgdmFyIHBpZCA9IHJvc3Rlci50LnBsW2ldLnBpZDtcbiAgICAgICAgcm9zdGVyT2JqLmNlbHRpY3Mucm9zdGVyW3BpZF0gPSByb3N0ZXIudC5wbFtpXTtcbiAgICAgICAgZm9yICh2YXIgcHJvcGVydHkgaW4gYmlvRGF0YVtwaWRdKSB7XG4gICAgICAgICAgICByb3N0ZXJPYmouY2VsdGljcy5yb3N0ZXJbcGlkXS5iaW8gPSBiaW9EYXRhW3BpZF07XG4gICAgICAgIH07XG4gICAgICAgIGpRdWVyeS5hamF4KHtcbiAgICAgICAgICAgIHVybDogJ2h0dHA6Ly9sb2NhbGhvc3Q6ODg4OC9kYXRhL21vYmlsZS1zdGF0cy1mZWVkL3BsYXllcmNhcmRzL3BsYXllcmNhcmQtJyArIHBpZCArICcuanNvbicsXG4gICAgICAgICAgICBhc3luYzogZmFsc2UsXG4gICAgICAgICAgICBzdWNjZXNzOiBmdW5jdGlvbihkYXRhKSB7XG4gICAgICAgICAgICAgICAgcm9zdGVyT2JqLmNlbHRpY3Mucm9zdGVyW3BpZF0uc3RhdHMgPSBkYXRhLnBsLmNhO1xuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIGVycm9yOiBmdW5jdGlvbigpIHt9XG4gICAgICAgIH0pO1xuICAgIH1cbiAgICBmb3IgKHZhciBpID0gMDsgaSA8IGF3YXlSb3N0ZXIudC5wbC5sZW5ndGg7IGkrKykge1xuICAgICAgICB2YXIgcGlkID0gYXdheVJvc3Rlci50LnBsW2ldLnBpZDtcbiAgICAgICAgcm9zdGVyT2JqLmF3YXkucm9zdGVyW3BpZF0gPSBhd2F5Um9zdGVyLnQucGxbaV07XG4gICAgICAgIGpRdWVyeS5hamF4KHtcbiAgICAgICAgICAgIHVybDogJ2h0dHA6Ly9sb2NhbGhvc3Q6ODg4OC9kYXRhL21vYmlsZS1zdGF0cy1mZWVkL3BsYXllcmNhcmRzL3BsYXllcmNhcmQtMjAyMzMwLmpzb24nLCAvLyBDSEFOR0UgUElEXG4gICAgICAgICAgICBhc3luYzogZmFsc2UsXG4gICAgICAgICAgICBzdWNjZXNzOiBmdW5jdGlvbihkYXRhKSB7XG4gICAgICAgICAgICAgICAgcm9zdGVyT2JqLmF3YXkucm9zdGVyW3BpZF0uc3RhdHMgPSBkYXRhLnBsLmNhO1xuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIGVycm9yOiBmdW5jdGlvbigpIHt9XG4gICAgICAgIH0pO1xuICAgIH1cbiAgICBmb3IgKHZhciB0ZWFtIGluIHJvc3Rlck9iaikge1xuICAgICAgICBmb3IgKHZhciBwbGF5ZXIgaW4gcm9zdGVyT2JqW3RlYW1dLnJvc3Rlcikge1xuICAgICAgICAgICAgdmFyIHB0TGVhZGVycyA9IHJvc3Rlck9ialt0ZWFtXS5sZWFkZXJzLnB0cztcbiAgICAgICAgICAgIHZhciBhc3RMZWFkZXJzID0gcm9zdGVyT2JqW3RlYW1dLmxlYWRlcnMuYXN0O1xuICAgICAgICAgICAgdmFyIHJlYkxlYWRlcnMgPSByb3N0ZXJPYmpbdGVhbV0ubGVhZGVycy5yZWI7XG4gICAgICAgICAgICBmb3IgKHZhciBzdGF0IGluIHJvc3Rlck9ialt0ZWFtXS5sZWFkZXJzKSB7XG4gICAgICAgICAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCAzOyBpKyspIHtcbiAgICAgICAgICAgICAgICAgICAgaWYgKHJvc3Rlck9ialt0ZWFtXS5sZWFkZXJzW3N0YXRdW2ldWzJdID09ICctLScgJiYgcm9zdGVyT2JqW3RlYW1dLnJvc3RlcltwbGF5ZXJdLnN0YXRzW3N0YXRdID4gMCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgcm9zdGVyT2JqW3RlYW1dLmxlYWRlcnNbc3RhdF1baV1bMF0gPSByb3N0ZXJPYmpbdGVhbV0ucm9zdGVyW3BsYXllcl0uZm4udG9VcHBlckNhc2UoKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJvc3Rlck9ialt0ZWFtXS5sZWFkZXJzW3N0YXRdW2ldWzFdID0gcm9zdGVyT2JqW3RlYW1dLnJvc3RlcltwbGF5ZXJdLmxuLnRvVXBwZXJDYXNlKCk7XG4gICAgICAgICAgICAgICAgICAgICAgICByb3N0ZXJPYmpbdGVhbV0ubGVhZGVyc1tzdGF0XVtpXVsyXSA9IHJvc3Rlck9ialt0ZWFtXS5yb3N0ZXJbcGxheWVyXS5zdGF0c1tzdGF0XTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJvc3Rlck9ialt0ZWFtXS5sZWFkZXJzW3N0YXRdW2ldWzNdID0gcm9zdGVyT2JqW3RlYW1dLnJvc3RlcltwbGF5ZXJdLnBpZDtcbiAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgICAgICB9IGVsc2UgaWYgKHJvc3Rlck9ialt0ZWFtXS5yb3N0ZXJbcGxheWVyXS5zdGF0c1tzdGF0XSA+IHJvc3Rlck9ialt0ZWFtXS5sZWFkZXJzW3N0YXRdW2ldWzJdICYmIHJvc3Rlck9ialt0ZWFtXS5yb3N0ZXJbcGxheWVyXS5zdGF0c1tzdGF0XSA+IDApIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJvc3Rlck9ialt0ZWFtXS5sZWFkZXJzW3N0YXRdW2ldWzBdID0gcm9zdGVyT2JqW3RlYW1dLnJvc3RlcltwbGF5ZXJdLmZuLnRvVXBwZXJDYXNlKCk7XG4gICAgICAgICAgICAgICAgICAgICAgICByb3N0ZXJPYmpbdGVhbV0ubGVhZGVyc1tzdGF0XVtpXVsxXSA9IHJvc3Rlck9ialt0ZWFtXS5yb3N0ZXJbcGxheWVyXS5sbi50b1VwcGVyQ2FzZSgpO1xuICAgICAgICAgICAgICAgICAgICAgICAgcm9zdGVyT2JqW3RlYW1dLmxlYWRlcnNbc3RhdF1baV1bMl0gPSByb3N0ZXJPYmpbdGVhbV0ucm9zdGVyW3BsYXllcl0uc3RhdHNbc3RhdF07XG4gICAgICAgICAgICAgICAgICAgICAgICByb3N0ZXJPYmpbdGVhbV0ubGVhZGVyc1tzdGF0XVtpXVszXSA9IHJvc3Rlck9ialt0ZWFtXS5yb3N0ZXJbcGxheWVyXS5waWQ7XG4gICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH07XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9XG4gICAgY29uc29sZS5sb2cocm9zdGVyT2JqKTtcbn07XG5cbmZ1bmN0aW9uIHN0YXRzTm90QXZhaWxhYmxlKHBpZCkge1xuICAgIHJvc3Rlck9ialtwaWRdLnN0YXRzLmNhcmVlckF2ZyA9IHt9O1xuICAgIHJvc3Rlck9ialtwaWRdLnN0YXRzLnNlYXNvbkF2ZyA9IFt7fV07XG4gICAgcm9zdGVyT2JqW3BpZF0uc3RhdHMuaGFzU3RhdHMgPSBmYWxzZTtcbiAgICB2YXIgY2FJbmRleCA9IFsnZ3AnLCAnZ3MnLCAnbWluJywgJ2ZncCcsICd0cHAnLCAnZnRwJywgJ29yZWInLCAnZHJlYicsICdyZWInLCAnYXN0JywgJ3N0bCcsICdibGsnLCAndG92JywgJ3BmJywgJ3B0cycsICdub3N0YXRzJ107XG4gICAgdmFyIHNhSW5kZXggPSBbJ3RpZCcsICd2YWwnLCAnZ3AnLCAnZ3MnLCAnbWluJywgJ2ZncCcsICd0cHAnLCAnZnRwJywgJ29yZWInLCAnZHJlYicsICdyZWInLCAnYXN0JywgJ3N0bCcsICdibGsnLCAndG92JywgJ3BmJywgJ3B0cycsICdzcGwnLCAndGEnLCAndG4nLCAndGMnXTtcbiAgICBmb3IgKHZhciBpID0gMDsgaSA8IHNhSW5kZXgubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgcm9zdGVyT2JqW3BpZF0uc3RhdHMuc2Vhc29uQXZnWzBdW3NhSW5kZXhbaV1dID0gXCJOL0FcIjtcbiAgICAgICAgaWYgKGkgPT09IDEpIHtcbiAgICAgICAgICAgIHJvc3Rlck9ialtwaWRdLnN0YXRzLnNlYXNvbkF2Z1swXVtzYUluZGV4W2ldXSA9IHBsYXllckNhcmRZZWFyLnRvU3RyaW5nKCkuc3Vic3RyKDIsIDIpICsgXCItXCIgKyAocGxheWVyQ2FyZFllYXIgKyAxKS50b1N0cmluZygpLnN1YnN0cigyLCAyKTtcbiAgICAgICAgfVxuICAgICAgICBpZiAoaSA9PT0gMTcpIHtcbiAgICAgICAgICAgIHJvc3Rlck9ialtwaWRdLnN0YXRzLnNlYXNvbkF2Z1swXVtzYUluZGV4W2ldXSA9IFtdO1xuICAgICAgICB9XG4gICAgICAgIGlmIChpID09PSAxOCkge1xuICAgICAgICAgICAgcm9zdGVyT2JqW3BpZF0uc3RhdHMuc2Vhc29uQXZnWzBdW3NhSW5kZXhbaV1dID0gJ0JPUyc7XG4gICAgICAgIH1cbiAgICB9XG4gICAgZm9yICh2YXIgaSA9IDA7IGkgPCBjYUluZGV4Lmxlbmd0aDsgaSsrKSB7XG4gICAgICAgIHJvc3Rlck9ialtwaWRdLnN0YXRzLmNhcmVlckF2Z1tjYUluZGV4W2ldXSA9IFwiTi9BXCI7XG4gICAgICAgIGlmIChpID09PSAxNSkge1xuICAgICAgICAgICAgcm9zdGVyT2JqW3BpZF0uc3RhdHMuY2FyZWVyQXZnW2NhSW5kZXhbaV1dID0gdHJ1ZTtcbiAgICAgICAgfVxuICAgIH1cbn07XG5cbmZ1bmN0aW9uIGxvYWRHYW1lRGV0YWlsKGdpZCkge307XG5cbmZ1bmN0aW9uIGxvYWRBd2F5VGVhbURhdGEoKSB7fVxuLyo9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbj0gICAgICAgICAgICBTVEFUIExFQURFUlMgICAgICAgICAgICA9XG49PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT0qL1xuXG5jb25zdCB0ZXN0ID0gJyc7XG5cbmZ1bmN0aW9uIGxlYWRlcnMoZ2lkLCBnYW1lU3RhcnRlZCkge1xuICAgIHZhciBnYW1lRGV0YWlsID0gJyc7XG4gICAgdmFyIGRldGFpbEF2YWlsYWJsZSA9IGZhbHNlO1xuICAgIGdhbWVTdGFydGVkID0gdHJ1ZTsgLy8gRE86IERFTEVURSBUSElTIFdIRU4gT05MSU5FLiBKVVNUIEZPUiBURVNUSU5HIFBVUlBPU0VTIFJOXG4gICAgaWYgKGdhbWVTdGFydGVkKSB7XG4gICAgICAgIGpRdWVyeS5hamF4KHtcbiAgICAgICAgICAgIHVybDogJ2h0dHA6Ly9sb2NhbGhvc3Q6ODg4OC9kYXRhL21vYmlsZS1zdGF0cy1mZWVkL2dhbWVkZXRhaWwuanNvbicsXG4gICAgICAgICAgICBhc3luYzogZmFsc2UsXG4gICAgICAgICAgICBzdWNjZXNzOiBmdW5jdGlvbihkYXRhKSB7XG4gICAgICAgICAgICAgICAgLy8gRE86IFVQREFURSBUSEUgTEVBREVSIE9CSkVDVFNcbiAgICAgICAgICAgICAgICBnYW1lRGV0YWlsID0gZGF0YTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgfVxuICAgIGZvciAodmFyIHRlYW0gaW4gcm9zdGVyT2JqKXtcbiAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCAzOyBpKyspe1xuICAgICAgICAgICAgZm9yICh2YXIgc3RhdCBpbiByb3N0ZXJPYmpbdGVhbV0ubGVhZGVycyl7XG4gICAgICAgICAgICAgICAgLy8gTEVBREVSIFNUQVQgVkFMVUVcbiAgICAgICAgICAgICAgICBqUXVlcnkoJy5sZWFkZXItc2VjdGlvbjpudGgtb2YtdHlwZSgnICsgKGkgKyAyKSArICcpIC4nICsgc3RhdCArICcuJyArIHRlYW0gKyAnIC5zdGF0JykuYXBwZW5kKCc8c3Bhbj4nICsgcm9zdGVyT2JqW3RlYW1dLmxlYWRlcnNbc3RhdF1baV1bMl0gKyAnPC9zcGFuPiAnICsgc3RhdC50b1VwcGVyQ2FzZSgpKTtcbiAgICAgICAgICAgICAgICAvLyBMRUFERVIgTkFNRVxuICAgICAgICAgICAgICAgIGlmIChyb3N0ZXJPYmpbdGVhbV0ubGVhZGVyc1tzdGF0XVtpXVswXS5sZW5ndGggKyByb3N0ZXJPYmpbdGVhbV0ubGVhZGVyc1tzdGF0XVtpXVsxXS5sZW5ndGggPj0gMTUpe1xuICAgICAgICAgICAgICAgICAgICByb3N0ZXJPYmpbdGVhbV0ubGVhZGVyc1tzdGF0XVtpXVswXSA9IHJvc3Rlck9ialt0ZWFtXS5sZWFkZXJzW3N0YXRdW2ldWzBdLnN1YnN0cigwLDEpICsgJy4nO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBqUXVlcnkoJy5sZWFkZXItc2VjdGlvbjpudGgtb2YtdHlwZSgnICsgKGkgKyAyKSArICcpIC4nICsgc3RhdCArICcuJyArIHRlYW0gKyAnIC5uYW1lJykuYXBwZW5kKCc8c3Bhbj4nICsgcm9zdGVyT2JqW3RlYW1dLmxlYWRlcnNbc3RhdF1baV1bMF0gKyAnPC9zcGFuPiAnICsgcm9zdGVyT2JqW3RlYW1dLmxlYWRlcnNbc3RhdF1baV1bMV0pO1xuICAgICAgICAgICAgICAgIC8vIExFQURFUiBIRUFEU0hPVFxuICAgICAgICAgICAgICAgIGpRdWVyeSgnLmxlYWRlci1zZWN0aW9uOm50aC1vZi10eXBlKCcgKyAoaSArIDIpICsgJykgLicgKyBzdGF0ICsgJy4nICsgdGVhbSArICcgLmhlYWRzaG90JykuYXR0cignc3JjJywnaHR0cHM6Ly9hay1zdGF0aWMuY21zLm5iYS5jb20vd3AtY29udGVudC91cGxvYWRzL2hlYWRzaG90cy9uYmEvbGF0ZXN0LzEwNDB4NzYwLycgKyByb3N0ZXJPYmpbdGVhbV0ubGVhZGVyc1tzdGF0XVtpXVszXSArICcucG5nJyk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9XG4gICAgdmFyIHRpbWVCZXR3ZWVuID0gMTAwMDtcbiAgICBqUXVlcnkoJy5sZWFkZXJzLCAubGVhZGVycyAuYmxvY2staW5uZXInKS5hZGRDbGFzcygndHJhbnNpdGlvbi0xJyk7XG4gICAgc2V0VGltZW91dChmdW5jdGlvbigpIHtcbiAgICAgICAgalF1ZXJ5KCcubGVhZGVycyAubGVhZGVyLXNlY3Rpb24nKS5hZGRDbGFzcygndHJhbnNpdGlvbi0xJyk7XG4gICAgICAgIGpRdWVyeSgnLmxlYWRlci1zdWJzZWN0aW9uLmJvdHRvbSBwOm50aC1vZi10eXBlKDEpJykuYWRkQ2xhc3MoJ3RyYW5zaXRpb24tMScpO1xuICAgIH0sIDgwMCk7XG4gICAgdmFyIHRyYW5zaXRpb25Db3VudGVyID0gMTtcbiAgICBmb3IgKGxldCBpPTE7IGkgPD0gNjsgaSsrKXtcbiAgICAgICAgc2V0VGltZW91dChmdW5jdGlvbihudW1iZXJTdHJpbmcpIHtcbiAgICAgICAgICAgIGpRdWVyeSgnLmxlYWRlcnMgLmxlYWRlci1zZWN0aW9uIC5sZWFkZXItc3RhdC13cmFwJykuYWRkQ2xhc3MoJ3RyYW5zaXRpb24tJyArIGkpO1xuICAgICAgICAgICAgalF1ZXJ5KCcubGVhZGVyLXN1YnNlY3Rpb24uYm90dG9tIHAnKS5yZW1vdmVDbGFzcygndHJhbnNpdGlvbi0nICsgaSk7XG4gICAgICAgICAgICBpZiAodHJhbnNpdGlvbkNvdW50ZXIgJSAyID09IDApe1xuICAgICAgICAgICAgICAgIHNldFRpbWVvdXQoZnVuY3Rpb24oKXtcbiAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2coaSk7XG4gICAgICAgICAgICAgICAgICAgIGpRdWVyeSgnLmxlYWRlcnMgLmxlYWRlci1zZWN0aW9uIC51bmRlcmxpbmUnKS5hZGRDbGFzcygndHJhbnNpdGlvbi0nICsgKGkvMikpO1xuICAgICAgICAgICAgICAgICAgICBqUXVlcnkoJy5sZWFkZXItc3Vic2VjdGlvbi5ib3R0b20gcDpudGgtb2YtdHlwZSgyKScpLmFkZENsYXNzKCd0cmFuc2l0aW9uLScgKyAoaS8yKSk7XG4gICAgICAgICAgICAgICAgfSwgNDAwKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHRyYW5zaXRpb25Db3VudGVyKys7XG4gICAgICAgIH0sIDIwMDAgKiBpKTtcbiAgICB9XG59O1xuLyo9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbj0gICAgICAgICAgICBTT0NJQUwgICAgICAgICAgICA9XG49PT09PT09PT09PT09PT09PT09PT09PT09PT09PT0qL1xuZnVuY3Rpb24gc29jaWFsKHJvc3Rlcikge307XG4vKj09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbj0gICAgICAgICAgICBNT0JJTEUgQVBQICAgICAgICAgICAgPVxuPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PSovXG5mdW5jdGlvbiBpbml0TW9iaWxlQXBwKCkge1xuICAgIHZhciBjb3VudGVyID0gMTtcbiAgICBzZXRJbnRlcnZhbChmdW5jdGlvbigpIHtcbiAgICAgICAgalF1ZXJ5KCcuYXBwIC5ib3R0b20td3JhcCBpbWcnKS5yZW1vdmVDbGFzcygnYWN0aXZlJyk7XG4gICAgICAgIGpRdWVyeSgnLmFwcCAuZmVhdHVyZS1saXN0IHAnKS5yZW1vdmVDbGFzcygnYWN0aXZlJyk7XG4gICAgICAgIGpRdWVyeSgnLmFwcCAuZmVhdHVyZS1saXN0IHA6bnRoLW9mLXR5cGUoJyArIGNvdW50ZXIgKyAnKScpLmFkZENsYXNzKCdhY3RpdmUnKTtcbiAgICAgICAgalF1ZXJ5KCcuYXBwIC5ib3R0b20td3JhcCBpbWc6bnRoLW9mLXR5cGUoJyArIGNvdW50ZXIgKyAnKScpLmFkZENsYXNzKCdhY3RpdmUnKTtcbiAgICAgICAgaWYgKGNvdW50ZXIgPT0gNSkge1xuICAgICAgICAgICAgY291bnRlciA9IDE7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBjb3VudGVyKys7XG4gICAgICAgIH1cbiAgICB9LCAyMDAwKTtcbn07XG5cbmZ1bmN0aW9uIG1vYmlsZUFwcCgpIHtcbiAgICBqUXVlcnkoJy5hcHAnKS5zaG93KCk7XG59O1xuLyo9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbj0gICAgICAgICAgICBTVEFORElOR1MgICAgICAgICAgICA9XG49PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT0qL1xuZnVuY3Rpb24gc3RhbmRpbmdzKCkge307XG4vKj09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG49ICAgICAgICAgICAgQVJPVU5EIFRIRSBMRUFHVUUgICAgICAgICAgICA9XG49PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PSovXG5mdW5jdGlvbiBhcm91bmRUaGVMZWFndWUoKSB7fTsiXX0=
