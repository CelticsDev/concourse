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
    var leftWrapCounter = false;
    jQuery.ajax({
        url: 'http://localhost:8888/data/mobile-stats-feed/todays_scores.json',
        async: false,
        success: function success(todaysScoresData) {
            for (var i = 0; i < todaysScoresData.gs.g.length; i++) {
                if (todaysScoresData.gs.g[i].h.ta == 'BKN') {
                    //CHANGE THIS
                    awayTeam = todaysScoresData.gs.g[i].v.ta;
                    loadRosterData(awayTeam);
                    scoresInit(todaysScoresData);
                    standingsInit(awayTeam);
                    /*                    setInterval(leftWrap, 3000);*/
                    gid = todaysScoresData.gs.g[i].gid;
                    initMobileApp();
                    mobileApp();
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

/*============================================================
=            LOAD ROSTER INFO (build rosterObj)              =
============================================================*/

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
/*==================================
=            RIGHT WRAP            =
==================================*/
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

function social(roster) {};

function mobileApp() {
    jQuery('.app').show();
};
/*=================================
=            LEFT WRAP            =
=================================*/

function leftWrap() {
    if (jQuery('.left-wrap .standings').hasClass('transition-1')) {
        jQuery('.left-wrap .standings').removeClass('transition-1');
    } else {
        jQuery('.left-wrap .standings').addClass('transition-1');
    }

    if (jQuery('.left-wrap .scores').hasClass('transition-1')) {
        jQuery('.left-wrap .scores').removeClass('transition-1');
    } else {
        jQuery('.left-wrap .scores').addClass('transition-1');
    }
}

function standingsInit(awayTeam) {
    jQuery.ajax({
        url: 'http://localhost:8888/data/mobile-stats-feed/standings.json',
        async: false,
        success: function success(standingsData) {
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

function scoresInit(todaysScoresData) {
    var liveScores = todaysScoresData.gs.g;
    if (liveScores.length != 0) {
        var seasonType = '';
        if (liveScores[0].gid.substr(0, 3) == '001') {
            seasonType = 'pre';
        } else if (liveScores[0].gid.substr(0, 3) == '004') {
            seasonType = 'post';
        }
        if (liveScores.length > 1 || liveScores.length == 1 && liveScores[0].h.ta != 'BOS') {
            var statusCodes = ['1st Qtr', '2nd Qtr', '3rd Qtr', '4th Qtr', '1st OT', '2nd OT', '3rd OT', '4th OT', '5th OT', '6th OT', '7th OT', '8th OT', '9th OT', '10th OT'];
            var scoresHTML = '';
            for (var i = liveScores.length - 1; i >= 0; i--) {
                if (liveScores[i].h.ta !== 'BOS') {
                    var vScore = '';
                    var hScore = '';
                    if (liveScores[i].st != 1) {
                        vScore = liveScores[i].v.s;
                        hScore = liveScores[i].h.s;
                    }
                    var sText = liveScores[i].stt;
                    if (statusCodes.indexOf(liveScores[i].stt) !== -1) {
                        sText = liveScores[i].stt + ' - ' + liveScores[i].cl;
                    }
                    scoresHTML += '<div class="score-wrap"><div class="score-status">' + sText + '</div><div class="' + liveScores[i].v.ta + '"><img src="http://stats.nba.com/media/img/teams/logos/' + liveScores[i].v.ta.toUpperCase() + '_logo.svg"> ' + liveScores[i].v.tc.toUpperCase() + ' ' + liveScores[i].v.tn.toUpperCase() + ' <div class="score-num">' + vScore + '</div></div><div class="' + liveScores[i].h.ta + '"><img src="http://stats.nba.com/media/img/teams/logos/' + liveScores[i].h.ta.toUpperCase() + '_logo.svg"> ' + liveScores[i].h.tc.toUpperCase() + ' ' + liveScores[i].h.tn.toUpperCase() + ' <div class="score-num">' + hScore + '</div></div></div>';
                }
            }
            jQuery('.scores').empty().append(scoresHTML);
            if (jQuery('.score-wrap').length <= 6 && jQuery('.lleader-header').length === 0) {
                addLeagueLeaders(seasonType);
            }
        }
    }
}

function updateLeagueScores(todaysScoresData) {
    var liveScores = todaysScoresData.gs.g;
    if (liveScores.length != 0) {
        var seasonType = '';
        if (liveScores[0].gid.substr(0, 3) == '001') {
            seasonType = 'pre';
        } else if (liveScores[0].gid.substr(0, 3) == '004') {
            seasonType = 'post';
        }
        if (liveScores.length > 1 || liveScores.length == 1 && liveScores[0].h.ta != 'BOS') {
            var statusCodes = ['1st Qtr', '2nd Qtr', '3rd Qtr', '4th Qtr', '1st OT', '2nd OT', '3rd OT', '4th OT', '5th OT', '6th OT', '7th OT', '8th OT', '9th OT', '10th OT'];
            var scoresHTML = '';
            if (jQuery('.atl-header').length === 0) {
                jQuery('#leftwrap').prepend('<img class="atl-header" src="http://i.cdn.turner.com/nba/nba/.element/media/2.0/teamsites/celtics/media/signage-atl-960x135.png">');
            }
            for (var i = liveScores.length - 1; i >= 0; i--) {
                if (liveScores[i].h.ta !== 'BOS') {
                    var vScore = '';
                    var hScore = '';
                    if (liveScores[i].st != 1) {
                        vScore = liveScores[i].v.s;
                        hScore = liveScores[i].h.s;
                    }
                    var sText = liveScores[i].stt;
                    if (statusCodes.indexOf(liveScores[i].stt) !== -1) {
                        sText = liveScores[i].stt + ' - ' + liveScores[i].cl;
                    }
                    scoresHTML += '<div class="score-wrap"><div class="score-container"><div class="' + liveScores[i].v.ta + '"><img src="http://stats.nba.com/media/img/teams/logos/' + liveScores[i].v.ta.toUpperCase() + '_logo.svg"> ' + liveScores[i].v.tc.toUpperCase() + ' ' + liveScores[i].v.tn.toUpperCase() + ' <div class="score-num">' + vScore + '</div></div><div class="' + liveScores[i].h.ta + '"><img src="http://stats.nba.com/media/img/teams/logos/' + liveScores[i].h.ta.toUpperCase() + '_logo.svg"> ' + liveScores[i].h.tc.toUpperCase() + ' ' + liveScores[i].h.tn.toUpperCase() + ' <div class="score-num">' + hScore + '</div></div><div class="score-status">' + sText + '</div></div></div>';
                }
            }
            jQuery('.scores').empty().append(scoresHTML);
            if (jQuery('.score-wrap').length <= 6 && jQuery('.lleader-header').length === 0) {
                addLeagueLeaders(seasonType);
            }
        }
    }
}

},{}]},{},[1])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJzcmMvanMvY29uY291cnNlLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7QUNBQSxJQUFJLFlBQVk7QUFDWixhQUFTO0FBQ0wsZ0JBQVEsRUFESDtBQUVMLGlCQUFTO0FBQ0wsaUJBQUssQ0FDRCxDQUFDLElBQUQsRUFBTyxJQUFQLEVBQWEsSUFBYixFQUFtQixJQUFuQixDQURDLEVBRUQsQ0FBQyxJQUFELEVBQU8sSUFBUCxFQUFhLElBQWIsRUFBbUIsSUFBbkIsQ0FGQyxFQUdELENBQUMsSUFBRCxFQUFPLElBQVAsRUFBYSxJQUFiLEVBQW1CLElBQW5CLENBSEMsQ0FEQTtBQU1MLGlCQUFLLENBQ0QsQ0FBQyxJQUFELEVBQU8sSUFBUCxFQUFhLElBQWIsRUFBbUIsSUFBbkIsQ0FEQyxFQUVELENBQUMsSUFBRCxFQUFPLElBQVAsRUFBYSxJQUFiLEVBQW1CLElBQW5CLENBRkMsRUFHRCxDQUFDLElBQUQsRUFBTyxJQUFQLEVBQWEsSUFBYixFQUFtQixJQUFuQixDQUhDLENBTkE7QUFXTCxpQkFBSyxDQUNELENBQUMsSUFBRCxFQUFPLElBQVAsRUFBYSxJQUFiLEVBQW1CLElBQW5CLENBREMsRUFFRCxDQUFDLElBQUQsRUFBTyxJQUFQLEVBQWEsSUFBYixFQUFtQixJQUFuQixDQUZDLEVBR0QsQ0FBQyxJQUFELEVBQU8sSUFBUCxFQUFhLElBQWIsRUFBbUIsSUFBbkIsQ0FIQztBQVhBO0FBRkosS0FERztBQXFCWixVQUFNO0FBQ0YsZ0JBQVEsRUFETjtBQUVGLGlCQUFTO0FBQ0wsaUJBQUssQ0FDRCxDQUFDLElBQUQsRUFBTyxJQUFQLEVBQWEsSUFBYixFQUFtQixJQUFuQixDQURDLEVBRUQsQ0FBQyxJQUFELEVBQU8sSUFBUCxFQUFhLElBQWIsRUFBbUIsSUFBbkIsQ0FGQyxFQUdELENBQUMsSUFBRCxFQUFPLElBQVAsRUFBYSxJQUFiLEVBQW1CLElBQW5CLENBSEMs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YyxDQUFkLENBQWdCLEVBQWhCLENBQW1CLFdBQW5CLEVBQXZKLEdBQTBMLGNBQTFMLEdBQTJNLFdBQVcsQ0FBWCxFQUFjLENBQWQsQ0FBZ0IsRUFBaEIsQ0FBbUIsV0FBbkIsRUFBM00sR0FBOE8sR0FBOU8sR0FBb1AsV0FBVyxDQUFYLEVBQWMsQ0FBZCxDQUFnQixFQUFoQixDQUFtQixXQUFuQixFQUFwUCxHQUF1UiwwQkFBdlIsR0FBb1QsTUFBcFQsR0FBNlQsMEJBQTdULEdBQTBWLFdBQVcsQ0FBWCxFQUFjLENBQWQsQ0FBZ0IsRUFBMVcsR0FBK1cseURBQS9XLEdBQTJhLFdBQVcsQ0FBWCxFQUFjLENBQWQsQ0FBZ0IsRUFBaEIsQ0FBbUIsV0FBbkIsRUFBM2EsR0FBOGMsY0FBOWMsR0FBK2QsV0FBVyxDQUFYLEVBQWMsQ0FBZCxDQUFnQixFQUFoQixDQUFtQixXQUFuQixFQUEvZCxHQUFrZ0IsR0FBbGdCLEdBQXdnQixXQUFXLENBQVgsRUFBYyxDQUFkLENBQWdCLEVBQWhCLENBQW1CLFdBQW5CLEVBQXhnQixHQUEyaUIsMEJBQTNpQixHQUF3a0IsTUFBeGtCLEdBQWlsQix3Q0FBamxCLEdBQTRuQixLQUE1bkIsR0FBb29CLG9CQUFscEI7QUFDSDtBQUNKO0FBQ0QsbUJBQU8sU0FBUCxFQUFrQixLQUFsQixHQUEwQixNQUExQixDQUFpQyxVQUFqQztBQUNBLGdCQUFJLE9BQU8sYUFBUCxFQUFzQixNQUF0QixJQUFnQyxDQUFoQyxJQUFxQyxPQUFPLGlCQUFQLEVBQTBCLE1BQTFCLEtBQXFDLENBQTlFLEVBQWlGO0FBQzdFLGlDQUFpQixVQUFqQjtBQUNIO0FBQ0o7QUFDSjtBQUNKIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24gZSh0LG4scil7ZnVuY3Rpb24gcyhvLHUpe2lmKCFuW29dKXtpZighdFtvXSl7dmFyIGE9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtpZighdSYmYSlyZXR1cm4gYShvLCEwKTtpZihpKXJldHVybiBpKG8sITApO3ZhciBmPW5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIrbytcIidcIik7dGhyb3cgZi5jb2RlPVwiTU9EVUxFX05PVF9GT1VORFwiLGZ9dmFyIGw9bltvXT17ZXhwb3J0czp7fX07dFtvXVswXS5jYWxsKGwuZXhwb3J0cyxmdW5jdGlvbihlKXt2YXIgbj10W29dWzFdW2VdO3JldHVybiBzKG4/bjplKX0sbCxsLmV4cG9ydHMsZSx0LG4scil9cmV0dXJuIG5bb10uZXhwb3J0c312YXIgaT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2Zvcih2YXIgbz0wO288ci5sZW5ndGg7bysrKXMocltvXSk7cmV0dXJuIHN9KSIsInZhciByb3N0ZXJPYmogPSB7XG4gICAgY2VsdGljczoge1xuICAgICAgICByb3N0ZXI6IHt9LFxuICAgICAgICBsZWFkZXJzOiB7XG4gICAgICAgICAgICBwdHM6IFtcbiAgICAgICAgICAgICAgICBbJy0tJywgJy0tJywgJy0tJywgJy0tJ10sXG4gICAgICAgICAgICAgICAgWyctLScsICctLScsICctLScsICctLSddLFxuICAgICAgICAgICAgICAgIFsnLS0nLCAnLS0nLCAnLS0nLCAnLS0nXVxuICAgICAgICAgICAgXSxcbiAgICAgICAgICAgIGFzdDogW1xuICAgICAgICAgICAgICAgIFsnLS0nLCAnLS0nLCAnLS0nLCAnLS0nXSxcbiAgICAgICAgICAgICAgICBbJy0tJywgJy0tJywgJy0tJywgJy0tJ10sXG4gICAgICAgICAgICAgICAgWyctLScsICctLScsICctLScsICctLSddXG4gICAgICAgICAgICBdLFxuICAgICAgICAgICAgcmViOiBbXG4gICAgICAgICAgICAgICAgWyctLScsICctLScsICctLScsICctLSddLFxuICAgICAgICAgICAgICAgIFsnLS0nLCAnLS0nLCAnLS0nLCAnLS0nXSxcbiAgICAgICAgICAgICAgICBbJy0tJywgJy0tJywgJy0tJywgJy0tJ11cbiAgICAgICAgICAgIF1cbiAgICAgICAgfVxuICAgIH0sXG4gICAgYXdheToge1xuICAgICAgICByb3N0ZXI6IHt9LFxuICAgICAgICBsZWFkZXJzOiB7XG4gICAgICAgICAgICBwdHM6IFtcbiAgICAgICAgICAgICAgICBbJy0tJywgJy0tJywgJy0tJywgJy0tJ10sXG4gICAgICAgICAgICAgICAgWyctLScsICctLScsICctLScsICctLSddLFxuICAgICAgICAgICAgICAgIFsnLS0nLCAnLS0nLCAnLS0nLCAnLS0nXVxuICAgICAgICAgICAgXSxcbiAgICAgICAgICAgIGFzdDogW1xuICAgICAgICAgICAgICAgIFsnLS0nLCAnLS0nLCAnLS0nLCAnLS0nXSxcbiAgICAgICAgICAgICAgICBbJy0tJywgJy0tJywgJy0tJywgJy0tJ10sXG4gICAgICAgICAgICAgICAgWyctLScsICctLScsICctLScsICctLSddXG4gICAgICAgICAgICBdLFxuICAgICAgICAgICAgcmViOiBbXG4gICAgICAgICAgICAgICAgWyctLScsICctLScsICctLScsICctLSddLFxuICAgICAgICAgICAgICAgIFsnLS0nLCAnLS0nLCAnLS0nLCAnLS0nXSxcbiAgICAgICAgICAgICAgICBbJy0tJywgJy0tJywgJy0tJywgJy0tJ11cbiAgICAgICAgICAgIF1cbiAgICAgICAgfVxuICAgIH1cbn07XG5qUXVlcnkoZG9jdW1lbnQpLnJlYWR5KGZ1bmN0aW9uKCkge1xuICAgIHZhciBnaWQgPSAnJztcbiAgICB2YXIgYXdheVRlYW0gPSAnJztcbiAgICB2YXIgZ2FtZVN0YXJ0ZWQgPSBmYWxzZTtcbiAgICB2YXIgcGxheWVyU3BvdGxpZ2h0Q291bnRlciA9IDEwO1xuICAgIHZhciBkYXRlID0gbmV3IERhdGUoKTtcbiAgICB2YXIgbGVmdFdyYXBDb3VudGVyID0gZmFsc2U7XG4gICAgalF1ZXJ5LmFqYXgoe1xuICAgICAgICB1cmw6ICdodHRwOi8vbG9jYWxob3N0Ojg4ODgvZGF0YS9tb2JpbGUtc3RhdHMtZmVlZC90b2RheXNfc2NvcmVzLmpzb24nLFxuICAgICAgICBhc3luYzogZmFsc2UsXG4gICAgICAgIHN1Y2Nlc3M6IGZ1bmN0aW9uKHRvZGF5c1Njb3Jlc0RhdGEpIHtcbiAgICAgICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgdG9kYXlzU2NvcmVzRGF0YS5ncy5nLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICAgICAgaWYgKHRvZGF5c1Njb3Jlc0RhdGEuZ3MuZ1tpXS5oLnRhID09ICdCS04nKSB7IC8vQ0hBTkdFIFRISVNcbiAgICAgICAgICAgICAgICAgICAgYXdheVRlYW0gPSB0b2RheXNTY29yZXNEYXRhLmdzLmdbaV0udi50YTtcbiAgICAgICAgICAgICAgICAgICAgbG9hZFJvc3RlckRhdGEoYXdheVRlYW0pO1xuICAgICAgICAgICAgICAgICAgICBzY29yZXNJbml0KHRvZGF5c1Njb3Jlc0RhdGEpO1xuICAgICAgICAgICAgICAgICAgICBzdGFuZGluZ3NJbml0KGF3YXlUZWFtKTtcbi8qICAgICAgICAgICAgICAgICAgICBzZXRJbnRlcnZhbChsZWZ0V3JhcCwgMzAwMCk7Ki9cbiAgICAgICAgICAgICAgICAgICAgZ2lkID0gdG9kYXlzU2NvcmVzRGF0YS5ncy5nW2ldLmdpZDtcbiAgICAgICAgICAgICAgICAgICAgaW5pdE1vYmlsZUFwcCgpO1xuICAgICAgICAgICAgICAgICAgICBtb2JpbGVBcHAoKTtcbiAgICAgICAgICAgICAgICAgICAgLyogICAgICAgICAgICAgICAgICAgIHBsYXllclNwb3RsaWdodChyb3N0ZXJPYmosIHBsYXllclNwb3RsaWdodENvdW50ZXIpOyovXG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfSk7XG4gICAgLy8gbG9hZFJvc3RlckRhdGEoKTsgT05MWSBPTkNFXG4gICAgLyogICAgc2V0VGltZW91dChsZWFkZXJzKGdpZCwgZ2FtZVN0YXJ0ZWQpLCA0MDApOyovXG59KTtcbi8qPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbj0gICAgICAgICAgICBNSVNDIEZVTkNUSU9OUyAgICAgICAgICAgID1cbj09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09Ki9cbmZ1bmN0aW9uIHBsYXllckFnZShkb2IpIHtcbiAgICB2YXIgdG9kYXkgPSBuZXcgRGF0ZSgpO1xuICAgIHZhciBiaXJ0aERhdGUgPSBuZXcgRGF0ZShkb2IpO1xuICAgIHZhciBhZ2UgPSB0b2RheS5nZXRGdWxsWWVhcigpIC0gYmlydGhEYXRlLmdldEZ1bGxZZWFyKCk7XG4gICAgcmV0dXJuIGFnZTtcbn1cblxuZnVuY3Rpb24gZ2VuZXJhdGVUaW1lbGluZShzZWxlY3RlZFBsYXllcikge1xuICAgIC8vIEFQUEVORDogVElNRUxJTkVcbiAgICB2YXIgc2Vhc29uc1BsYXllZCA9IHJvc3Rlck9iai5jZWx0aWNzLnJvc3RlcltzZWxlY3RlZFBsYXllcl0uc3RhdHMuc2EubGVuZ3RoO1xuICAgIHZhciB0aW1lbGluZUhUTUwgPSAnJztcbiAgICB2YXIgc2Vhc29uWWVhckhUTUwgPSAnJztcbiAgICBmb3IgKHZhciBpID0gMDsgaSA8IHNlYXNvbnNQbGF5ZWQ7IGkrKykge1xuICAgICAgICB2YXIgdGVhbUFiYnJldmlhdGlvbiA9IHJvc3Rlck9iai5jZWx0aWNzLnJvc3RlcltzZWxlY3RlZFBsYXllcl0uc3RhdHMuc2FbaV0udGE7XG4gICAgICAgIHZhciB0cmFkZWQgPSByb3N0ZXJPYmouY2VsdGljcy5yb3N0ZXJbc2VsZWN0ZWRQbGF5ZXJdLnN0YXRzLnNhW2ldLnNwbC5sZW5ndGg7XG4gICAgICAgIHZhciBzZWdtZW50SW5uZXIgPSBcIlwiO1xuICAgICAgICB2YXIgdGl0bGUgPSBcIlwiO1xuICAgICAgICB2YXIgc2Vhc29uWWVhclRleHQgPSByb3N0ZXJPYmouY2VsdGljcy5yb3N0ZXJbc2VsZWN0ZWRQbGF5ZXJdLnN0YXRzLnNhW2ldLnZhbDtcbiAgICAgICAgaWYgKGkgPT09IDAgfHwgdGVhbUFiYnJldmlhdGlvbiAhPT0gcm9zdGVyT2JqLmNlbHRpY3Mucm9zdGVyW3NlbGVjdGVkUGxheWVyXS5zdGF0cy5zYVtpIC0gMV0udGEpIHsgLy8gSWYgdGhpcyBpcyBhIG5ldyB0ZWFtLCBzdGFydCB0aGUgdGVhbSB3cmFwLlxuICAgICAgICAgICAgdGl0bGUgPSB0ZWFtQWJicmV2aWF0aW9uO1xuICAgICAgICB9XG4gICAgICAgIGlmICh0cmFkZWQpIHtcbiAgICAgICAgICAgIGZvciAodmFyIHggPSAwOyB4IDwgdHJhZGVkOyB4KyspIHtcbiAgICAgICAgICAgICAgICB2YXIgZ3BUb3QgPSByb3N0ZXJPYmouY2VsdGljcy5yb3N0ZXJbc2VsZWN0ZWRQbGF5ZXJdLnN0YXRzLnNhW2ldLmdwO1xuICAgICAgICAgICAgICAgIHZhciBncCA9IHJvc3Rlck9iai5jZWx0aWNzLnJvc3RlcltzZWxlY3RlZFBsYXllcl0uc3RhdHMuc2FbaV0uc3BsW3hdLmdwO1xuICAgICAgICAgICAgICAgIHZhciBncFBlcmNlbnRhZ2UgPSBNYXRoLnJvdW5kKChncCAvIGdwVG90KSAqIDEwMCk7XG4gICAgICAgICAgICAgICAgdGVhbUFiYnJldmlhdGlvbiA9IHJvc3Rlck9iai5jZWx0aWNzLnJvc3RlcltzZWxlY3RlZFBsYXllcl0uc3RhdHMuc2FbaV0uc3BsW3hdLnRhO1xuICAgICAgICAgICAgICAgIGlmIChpID09PSAwIHx8IHRlYW1BYmJyZXZpYXRpb24gIT09IHJvc3Rlck9iai5jZWx0aWNzLnJvc3RlcltzZWxlY3RlZFBsYXllcl0uc3RhdHMuc2FbaSAtIDFdLnRhICYmIHRlYW1BYmJyZXZpYXRpb24gIT09IHJvc3Rlck9iai5jZWx0aWNzLnJvc3RlcltzZWxlY3RlZFBsYXllcl0uc3RhdHMuc2FbaSArIDFdLnRhKSB7IC8vIElmIHRoaXMgaXMgYSBuZXcgdGVhbSwgc3RhcnQgdGhlIHRlYW0gd3JhcC5cbiAgICAgICAgICAgICAgICAgICAgdGl0bGUgPSB0ZWFtQWJicmV2aWF0aW9uO1xuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIHRpdGxlID0gXCJcIjtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgc2VnbWVudElubmVyICs9ICc8ZGl2IGRhdGEtc2Vhc29uLXllYXI9XCInICsgc2Vhc29uWWVhclRleHQgKyAnXCIgZGF0YS10ZWFtPVwiJyArIHRlYW1BYmJyZXZpYXRpb24gKyAnXCIgc3R5bGU9XCJcIiBjbGFzcz1cInNlZ21lbnQtaW5uZXIgJyArIHRlYW1BYmJyZXZpYXRpb24gKyAnLWJnXCI+PHA+JyArIHRpdGxlICsgJzwvcD48L2Rpdj4nO1xuICAgICAgICAgICAgfVxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgc2VnbWVudElubmVyID0gJzxkaXYgZGF0YS1zZWFzb24teWVhcj1cIicgKyBzZWFzb25ZZWFyVGV4dCArICdcIiBkYXRhLXRlYW09XCInICsgdGVhbUFiYnJldmlhdGlvbiArICdcIiBjbGFzcz1cInNlZ21lbnQtaW5uZXIgJyArIHRlYW1BYmJyZXZpYXRpb24gKyAnLWJnXCI+PHA+JyArIHRpdGxlICsgJzwvcD48L2Rpdj4nO1xuICAgICAgICB9XG4gICAgICAgIHRpbWVsaW5lSFRNTCArPSAnPGRpdiBjbGFzcz1cInNlZ21lbnRcIj4nICsgc2VnbWVudElubmVyICsgJzwvZGl2Pic7XG4gICAgICAgIHNlYXNvblllYXJIVE1MICs9ICc8ZGl2IGNsYXNzPVwic2VnbWVudFwiPjxwPicgKyBzZWFzb25ZZWFyVGV4dCArICc8L3A+PC9kaXY+JztcbiAgICB9XG4gICAgalF1ZXJ5KFwiLnRpbWVsaW5lLXdyYXBcIikuaHRtbCgnPGRpdiBjbGFzcz1cInRpbWVsaW5lIGFwcGVuZGVkXCI+JyArIHRpbWVsaW5lSFRNTCArICc8L2Rpdj48ZGl2IGNsYXNzPVwic2Vhc29uLXllYXIgYXBwZW5kZWRcIj4nICsgc2Vhc29uWWVhckhUTUwgKyAnPC9kaXY+Jyk7XG59XG4vKj09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbj0gICAgICAgICAgICBJTklUSUFMSVpFICAgICAgICAgICAgPVxuPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PSovXG5mdW5jdGlvbiBpbml0KCkge1xuICAgIGlmICghZ2FtZVN0YXJ0ZWQpIHtcbiAgICAgICAgalF1ZXJ5LmFqYXgoe1xuICAgICAgICAgICAgdXJsOiAnaHR0cDovL2xvY2FsaG9zdDo4ODg4L2RhdGEvbW9iaWxlLXN0YXRzLWZlZWQvdG9kYXlzX3Njb3Jlcy5qc29uJyxcbiAgICAgICAgICAgIGFzeW5jOiBmYWxzZSxcbiAgICAgICAgICAgIHN1Y2Nlc3M6IGZ1bmN0aW9uKHRvZGF5c1Njb3Jlc0RhdGEpIHtcbiAgICAgICAgICAgICAgICB2YXIgZ2lkID0gJyc7XG4gICAgICAgICAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCB0b2RheXNTY29yZXNEYXRhLmdzLmcubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgICAgICAgICAgaWYgKHRvZGF5c1Njb3Jlc0RhdGEuZ3MuZ1tpXS5oLnRhID09ICdPUkwnKSB7IC8vIENIQU5HRSBUSElTIFRPICdCT1MnIFdIRU4gVEhFIFRJTUUgQ09NRVNcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmICh0b2RheXNTY29yZXNEYXRhLmdzLmdbaV0gIT09IDEpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBnYW1lU3RhcnRlZCA9IHRydWU7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgIH1cbn07XG5cbmZ1bmN0aW9uIGluaXRNb2JpbGVBcHAoKSB7XG4gICAgdmFyIGNvdW50ZXIgPSAxO1xuICAgIHNldEludGVydmFsKGZ1bmN0aW9uKCkge1xuICAgICAgICBqUXVlcnkoJy5hcHAgLmJvdHRvbS13cmFwIGltZycpLnJlbW92ZUNsYXNzKCdhY3RpdmUnKTtcbiAgICAgICAgalF1ZXJ5KCcuYXBwIC5mZWF0dXJlLWxpc3QgcCcpLnJlbW92ZUNsYXNzKCdhY3RpdmUnKTtcbiAgICAgICAgalF1ZXJ5KCcuYXBwIC5mZWF0dXJlLWxpc3QgcDpudGgtb2YtdHlwZSgnICsgY291bnRlciArICcpJykuYWRkQ2xhc3MoJ2FjdGl2ZScpO1xuICAgICAgICBqUXVlcnkoJy5hcHAgLmJvdHRvbS13cmFwIGltZzpudGgtb2YtdHlwZSgnICsgY291bnRlciArICcpJykuYWRkQ2xhc3MoJ2FjdGl2ZScpO1xuICAgICAgICBpZiAoY291bnRlciA9PSA1KSB7XG4gICAgICAgICAgICBjb3VudGVyID0gMTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGNvdW50ZXIrKztcbiAgICAgICAgfVxuICAgIH0sIDIwMDApO1xufTtcblxuLyo9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbj0gICAgICAgICAgICBMT0FEIFJPU1RFUiBJTkZPIChidWlsZCByb3N0ZXJPYmopICAgICAgICAgICAgICA9XG49PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT0qL1xuXG5mdW5jdGlvbiBsb2FkUm9zdGVyRGF0YShhd2F5VGVhbSkge1xuICAgIHZhciByb3N0ZXIgPSAnJztcbiAgICBqUXVlcnkuYWpheCh7XG4gICAgICAgIHVybDogJ2h0dHA6Ly9sb2NhbGhvc3Q6ODg4OC9kYXRhL21vYmlsZS1zdGF0cy1mZWVkL2NlbHRpY3Nfcm9zdGVyLmpzb24nLFxuICAgICAgICBhc3luYzogZmFsc2UsXG4gICAgICAgIHN1Y2Nlc3M6IGZ1bmN0aW9uKGRhdGEpIHtcbiAgICAgICAgICAgIHJvc3RlciA9IGRhdGE7XG4gICAgICAgICAgICBmb3IgKHZhciBwcm9wZXJ0eSBpbiByb3N0ZXIudCkge1xuICAgICAgICAgICAgICAgIGlmIChwcm9wZXJ0eSAhPT0gJ3BsJykge1xuICAgICAgICAgICAgICAgICAgICByb3N0ZXJPYmouY2VsdGljc1twcm9wZXJ0eV0gPSByb3N0ZXIudFtwcm9wZXJ0eV07XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9LFxuICAgICAgICBlcnJvcjogZnVuY3Rpb24oKSB7fVxuICAgIH0pO1xuICAgIHZhciBhd2F5Um9zdGVyID0gJyc7XG4gICAgalF1ZXJ5LmFqYXgoe1xuICAgICAgICB1cmw6ICdodHRwOi8vbG9jYWxob3N0Ojg4ODgvZGF0YS9tb2JpbGUtc3RhdHMtZmVlZC9hd2F5X3Jvc3Rlci5qc29uJyxcbiAgICAgICAgYXN5bmM6IGZhbHNlLFxuICAgICAgICBzdWNjZXNzOiBmdW5jdGlvbihkYXRhKSB7XG4gICAgICAgICAgICBhd2F5Um9zdGVyID0gZGF0YTtcbiAgICAgICAgICAgIGZvciAodmFyIHByb3BlcnR5IGluIGF3YXlSb3N0ZXIudCkge1xuICAgICAgICAgICAgICAgIGlmIChwcm9wZXJ0eSAhPT0gJ3BsJykge1xuICAgICAgICAgICAgICAgICAgICByb3N0ZXJPYmouYXdheVtwcm9wZXJ0eV0gPSBhd2F5Um9zdGVyLnRbcHJvcGVydHldO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfSxcbiAgICAgICAgZXJyb3I6IGZ1bmN0aW9uKCkge31cbiAgICB9KTtcbiAgICB2YXIgYmlvRGF0YSA9ICcnO1xuICAgIGpRdWVyeS5hamF4KHtcbiAgICAgICAgdXJsOiAnaHR0cDovL2xvY2FsaG9zdDo4ODg4L2RhdGEvYmlvLWRhdGEuanNvbicsXG4gICAgICAgIGFzeW5jOiBmYWxzZSxcbiAgICAgICAgc3VjY2VzczogZnVuY3Rpb24oZGF0YSkge1xuICAgICAgICAgICAgYmlvRGF0YSA9IGRhdGE7XG4gICAgICAgIH0sXG4gICAgICAgIGVycm9yOiBmdW5jdGlvbigpIHt9XG4gICAgfSk7XG4gICAgZm9yICh2YXIgaSA9IDA7IGkgPCByb3N0ZXIudC5wbC5sZW5ndGg7IGkrKykge1xuICAgICAgICB2YXIgcGlkID0gcm9zdGVyLnQucGxbaV0ucGlkO1xuICAgICAgICByb3N0ZXJPYmouY2VsdGljcy5yb3N0ZXJbcGlkXSA9IHJvc3Rlci50LnBsW2ldO1xuICAgICAgICBmb3IgKHZhciBwcm9wZXJ0eSBpbiBiaW9EYXRhW3BpZF0pIHtcbiAgICAgICAgICAgIHJvc3Rlck9iai5jZWx0aWNzLnJvc3RlcltwaWRdLmJpbyA9IGJpb0RhdGFbcGlkXTtcbiAgICAgICAgfTtcbiAgICAgICAgalF1ZXJ5LmFqYXgoe1xuICAgICAgICAgICAgdXJsOiAnaHR0cDovL2xvY2FsaG9zdDo4ODg4L2RhdGEvbW9iaWxlLXN0YXRzLWZlZWQvcGxheWVyY2FyZHMvcGxheWVyY2FyZC0nICsgcGlkICsgJy5qc29uJyxcbiAgICAgICAgICAgIGFzeW5jOiBmYWxzZSxcbiAgICAgICAgICAgIHN1Y2Nlc3M6IGZ1bmN0aW9uKGRhdGEpIHtcbiAgICAgICAgICAgICAgICByb3N0ZXJPYmouY2VsdGljcy5yb3N0ZXJbcGlkXS5zdGF0cyA9IGRhdGEucGwuY2E7XG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgZXJyb3I6IGZ1bmN0aW9uKCkge31cbiAgICAgICAgfSk7XG4gICAgfVxuICAgIGZvciAodmFyIGkgPSAwOyBpIDwgYXdheVJvc3Rlci50LnBsLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgIHZhciBwaWQgPSBhd2F5Um9zdGVyLnQucGxbaV0ucGlkO1xuICAgICAgICByb3N0ZXJPYmouYXdheS5yb3N0ZXJbcGlkXSA9IGF3YXlSb3N0ZXIudC5wbFtpXTtcbiAgICAgICAgalF1ZXJ5LmFqYXgoe1xuICAgICAgICAgICAgdXJsOiAnaHR0cDovL2xvY2FsaG9zdDo4ODg4L2RhdGEvbW9iaWxlLXN0YXRzLWZlZWQvcGxheWVyY2FyZHMvcGxheWVyY2FyZC0yMDIzMzAuanNvbicsIC8vIENIQU5HRSBQSURcbiAgICAgICAgICAgIGFzeW5jOiBmYWxzZSxcbiAgICAgICAgICAgIHN1Y2Nlc3M6IGZ1bmN0aW9uKGRhdGEpIHtcbiAgICAgICAgICAgICAgICByb3N0ZXJPYmouYXdheS5yb3N0ZXJbcGlkXS5zdGF0cyA9IGRhdGEucGwuY2E7XG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgZXJyb3I6IGZ1bmN0aW9uKCkge31cbiAgICAgICAgfSk7XG4gICAgfVxuICAgIGZvciAodmFyIHRlYW0gaW4gcm9zdGVyT2JqKSB7XG4gICAgICAgIGZvciAodmFyIHBsYXllciBpbiByb3N0ZXJPYmpbdGVhbV0ucm9zdGVyKSB7XG4gICAgICAgICAgICB2YXIgcHRMZWFkZXJzID0gcm9zdGVyT2JqW3RlYW1dLmxlYWRlcnMucHRzO1xuICAgICAgICAgICAgdmFyIGFzdExlYWRlcnMgPSByb3N0ZXJPYmpbdGVhbV0ubGVhZGVycy5hc3Q7XG4gICAgICAgICAgICB2YXIgcmViTGVhZGVycyA9IHJvc3Rlck9ialt0ZWFtXS5sZWFkZXJzLnJlYjtcbiAgICAgICAgICAgIGZvciAodmFyIHN0YXQgaW4gcm9zdGVyT2JqW3RlYW1dLmxlYWRlcnMpIHtcbiAgICAgICAgICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IDM7IGkrKykge1xuICAgICAgICAgICAgICAgICAgICBpZiAocm9zdGVyT2JqW3RlYW1dLmxlYWRlcnNbc3RhdF1baV1bMl0gPT0gJy0tJyAmJiByb3N0ZXJPYmpbdGVhbV0ucm9zdGVyW3BsYXllcl0uc3RhdHNbc3RhdF0gPiAwKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICByb3N0ZXJPYmpbdGVhbV0ubGVhZGVyc1tzdGF0XVtpXVswXSA9IHJvc3Rlck9ialt0ZWFtXS5yb3N0ZXJbcGxheWVyXS5mbi50b1VwcGVyQ2FzZSgpO1xuICAgICAgICAgICAgICAgICAgICAgICAgcm9zdGVyT2JqW3RlYW1dLmxlYWRlcnNbc3RhdF1baV1bMV0gPSByb3N0ZXJPYmpbdGVhbV0ucm9zdGVyW3BsYXllcl0ubG4udG9VcHBlckNhc2UoKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJvc3Rlck9ialt0ZWFtXS5sZWFkZXJzW3N0YXRdW2ldWzJdID0gcm9zdGVyT2JqW3RlYW1dLnJvc3RlcltwbGF5ZXJdLnN0YXRzW3N0YXRdO1xuICAgICAgICAgICAgICAgICAgICAgICAgcm9zdGVyT2JqW3RlYW1dLmxlYWRlcnNbc3RhdF1baV1bM10gPSByb3N0ZXJPYmpbdGVhbV0ucm9zdGVyW3BsYXllcl0ucGlkO1xuICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgICAgIH0gZWxzZSBpZiAocm9zdGVyT2JqW3RlYW1dLnJvc3RlcltwbGF5ZXJdLnN0YXRzW3N0YXRdID4gcm9zdGVyT2JqW3RlYW1dLmxlYWRlcnNbc3RhdF1baV1bMl0gJiYgcm9zdGVyT2JqW3RlYW1dLnJvc3RlcltwbGF5ZXJdLnN0YXRzW3N0YXRdID4gMCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgcm9zdGVyT2JqW3RlYW1dLmxlYWRlcnNbc3RhdF1baV1bMF0gPSByb3N0ZXJPYmpbdGVhbV0ucm9zdGVyW3BsYXllcl0uZm4udG9VcHBlckNhc2UoKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJvc3Rlck9ialt0ZWFtXS5sZWFkZXJzW3N0YXRdW2ldWzFdID0gcm9zdGVyT2JqW3RlYW1dLnJvc3RlcltwbGF5ZXJdLmxuLnRvVXBwZXJDYXNlKCk7XG4gICAgICAgICAgICAgICAgICAgICAgICByb3N0ZXJPYmpbdGVhbV0ubGVhZGVyc1tzdGF0XVtpXVsyXSA9IHJvc3Rlck9ialt0ZWFtXS5yb3N0ZXJbcGxheWVyXS5zdGF0c1tzdGF0XTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJvc3Rlck9ialt0ZWFtXS5sZWFkZXJzW3N0YXRdW2ldWzNdID0gcm9zdGVyT2JqW3RlYW1dLnJvc3RlcltwbGF5ZXJdLnBpZDtcbiAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cbiAgICBjb25zb2xlLmxvZyhyb3N0ZXJPYmopO1xufTtcblxuZnVuY3Rpb24gc3RhdHNOb3RBdmFpbGFibGUocGlkKSB7XG4gICAgcm9zdGVyT2JqW3BpZF0uc3RhdHMgPSB7fTtcbiAgICByb3N0ZXJPYmpbcGlkXS5zdGF0cy5zYSA9IFt7fV07XG4gICAgcm9zdGVyT2JqW3BpZF0uc3RhdHMuaGFzU3RhdHMgPSBmYWxzZTtcbiAgICB2YXIgY2FJbmRleCA9IFsnZ3AnLCAnZ3MnLCAnbWluJywgJ2ZncCcsICd0cHAnLCAnZnRwJywgJ29yZWInLCAnZHJlYicsICdyZWInLCAnYXN0JywgJ3N0bCcsICdibGsnLCAndG92JywgJ3BmJywgJ3B0cycsICdub3N0YXRzJ107XG4gICAgdmFyIHNhSW5kZXggPSBbJ3RpZCcsICd2YWwnLCAnZ3AnLCAnZ3MnLCAnbWluJywgJ2ZncCcsICd0cHAnLCAnZnRwJywgJ29yZWInLCAnZHJlYicsICdyZWInLCAnYXN0JywgJ3N0bCcsICdibGsnLCAndG92JywgJ3BmJywgJ3B0cycsICdzcGwnLCAndGEnLCAndG4nLCAndGMnXTtcbiAgICBmb3IgKHZhciBpID0gMDsgaSA8IHNhSW5kZXgubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgcm9zdGVyT2JqW3BpZF0uc3RhdHMuc2FbMF1bc2FJbmRleFtpXV0gPSBcIk4vQVwiO1xuICAgICAgICBpZiAoaSA9PT0gMSkge1xuICAgICAgICAgICAgcm9zdGVyT2JqW3BpZF0uc3RhdHMuc2FbMF1bc2FJbmRleFtpXV0gPSBwbGF5ZXJDYXJkWWVhci50b1N0cmluZygpLnN1YnN0cigyLCAyKSArIFwiLVwiICsgKHBsYXllckNhcmRZZWFyICsgMSkudG9TdHJpbmcoKS5zdWJzdHIoMiwgMik7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKGkgPT09IDE3KSB7XG4gICAgICAgICAgICByb3N0ZXJPYmpbcGlkXS5zdGF0cy5zYVswXVtzYUluZGV4W2ldXSA9IFtdO1xuICAgICAgICB9XG4gICAgICAgIGlmIChpID09PSAxOCkge1xuICAgICAgICAgICAgcm9zdGVyT2JqW3BpZF0uc3RhdHMuc2FbMF1bc2FJbmRleFtpXV0gPSAnQk9TJztcbiAgICAgICAgfVxuICAgIH1cbiAgICBmb3IgKHZhciBpID0gMDsgaSA8IGNhSW5kZXgubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgcm9zdGVyT2JqW3BpZF0uc3RhdHNbY2FJbmRleFtpXV0gPSBcIk4vQVwiO1xuICAgICAgICBpZiAoaSA9PT0gMTUpIHtcbiAgICAgICAgICAgIHJvc3Rlck9ialtwaWRdLnN0YXRzW2NhSW5kZXhbaV1dID0gdHJ1ZTtcbiAgICAgICAgfVxuICAgIH1cbn07XG5cbmZ1bmN0aW9uIGxvYWRHYW1lRGV0YWlsKGdpZCkge307XG5cbmZ1bmN0aW9uIGxvYWRBd2F5VGVhbURhdGEoKSB7fVxuLyo9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG49ICAgICAgICAgICAgUklHSFQgV1JBUCAgICAgICAgICAgID1cbj09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT0qL1xuZnVuY3Rpb24gcGxheWVyU3BvdGxpZ2h0KHJvc3Rlck9iaiwgcGxheWVyU3BvdGxpZ2h0Q291bnRlcikge1xuICAgIC8qIDEgLSBXSElURSBMSU5FIEhPUklaVE9OQUwgKi9cbiAgICBzZXRUaW1lb3V0KGZ1bmN0aW9uKCkge1xuICAgICAgICBqUXVlcnkoJy53aGl0ZS1saW5lLmhvcml6b250YWwnKS5hZGRDbGFzcygndHJhbnNpdGlvbi0xJyk7XG4gICAgfSwgNTAwKTtcbiAgICBzZXRUaW1lb3V0KGZ1bmN0aW9uKCkge1xuICAgICAgICBqUXVlcnkoJy5zb2NpYWwtdG9wIC53aGl0ZS1saW5lLnZlcnRpY2FsOm50aC1jaGlsZChvZGQpJykuYWRkQ2xhc3MoJ3RyYW5zaXRpb24tMScpO1xuICAgICAgICBqUXVlcnkoJy5zb2NpYWwtYm90dG9tIC53aGl0ZS1saW5lLnZlcnRpY2FsOm50aC1jaGlsZChldmVuKScpLmFkZENsYXNzKCd0cmFuc2l0aW9uLTEnKTtcbiAgICB9LCA4MDApO1xuICAgIC8qIDJiIC0gV0hJVEUgTElORSBWRVJUSUNBTCAqL1xuICAgIHNldFRpbWVvdXQoZnVuY3Rpb24oKSB7XG4gICAgICAgIGpRdWVyeSgnLnNvY2lhbC10b3AgLndoaXRlLWxpbmUudmVydGljYWw6bnRoLWNoaWxkKGV2ZW4pJykuYWRkQ2xhc3MoJ3RyYW5zaXRpb24tMScpO1xuICAgICAgICBqUXVlcnkoJy5zb2NpYWwtYm90dG9tIC53aGl0ZS1saW5lLnZlcnRpY2FsOm50aC1jaGlsZChvZGQpJykuYWRkQ2xhc3MoJ3RyYW5zaXRpb24tMScpO1xuICAgIH0sIDEwMDApO1xuICAgIC8qIDMgLSBHRU5FUkFURSBBTkQgUkVWRUFMIFBMQVlFUiBCT1hFUyAqL1xuICAgIHNldFRpbWVvdXQoZnVuY3Rpb24oKSB7XG4gICAgICAgIGpRdWVyeSgnLnNvY2lhbC10b3AsIC5zb2NpYWwtYm90dG9tJykuYWRkQ2xhc3MoJ3RyYW5zaXRpb24tMScpO1xuICAgICAgICBqUXVlcnkoJy5wbGF5ZXItYm94LXdyYXAnKS5hZGRDbGFzcygndHJhbnNpdGlvbi0xJyk7XG4gICAgfSwgMTIwMCk7XG4gICAgLyogNCAtIEFQUEVORCBIRUFEU0hPVFMgKi9cbiAgICBzZXRUaW1lb3V0KGZ1bmN0aW9uKCkge1xuICAgICAgICBqUXVlcnkoJy5wbGF5ZXItYm94LXdyYXAnKS5hZGRDbGFzcygndHJhbnNpdGlvbi0yJyk7XG4gICAgICAgIGpRdWVyeSgnLnBsYXllci1ib3gnKS5hZGRDbGFzcygndHJhbnNpdGlvbi0xJyk7XG4gICAgICAgIHZhciBkZWxheSA9IDA7XG4gICAgICAgIHZhciBmb3JpbkNvdW50ZXIgPSAwO1xuICAgICAgICBmb3IgKHZhciBwbGF5ZXIgaW4gcm9zdGVyT2JqLmNlbHRpY3Mucm9zdGVyKSB7XG4gICAgICAgICAgICBjb25zb2xlLmxvZyhwbGF5ZXIpO1xuICAgICAgICAgICAgdmFyIGhlYWRzaG90ID0gJ2h0dHBzOi8vYWstc3RhdGljLmNtcy5uYmEuY29tL3dwLWNvbnRlbnQvdXBsb2Fkcy9oZWFkc2hvdHMvbmJhL2xhdGVzdC8xMDQweDc2MC8nICsgcm9zdGVyT2JqLmNlbHRpY3Mucm9zdGVyW3BsYXllcl0ucGlkICsgJy5wbmcnO1xuICAgICAgICAgICAgalF1ZXJ5KCcucGxheWVyLWJveDpudGgtY2hpbGQoJyArIChmb3JpbkNvdW50ZXIgKyAxKSArICcpJykuYXBwZW5kKCc8aW1nIGNsYXNzPVwiYXBwZW5kZWQgaGVhZHNob3RcIiBzcmM9XCInICsgaGVhZHNob3QgKyAnXCIvPicpO1xuICAgICAgICAgICAgalF1ZXJ5KCcucGxheWVyLWJveDpudGgtY2hpbGQoJyArIChmb3JpbkNvdW50ZXIgKyAxKSArICcpJykuYXR0cignZGF0YS1waWQnLCByb3N0ZXJPYmouY2VsdGljcy5yb3N0ZXJbcGxheWVyXS5waWQpO1xuICAgICAgICAgICAgalF1ZXJ5KCcucGxheWVyLWJveCBpbWcnKS5vbihcImVycm9yXCIsIGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgICAgIGpRdWVyeSh0aGlzKS5hdHRyKCdzcmMnLCAnaHR0cHM6Ly9pLmNkbi50dXJuZXIuY29tL25iYS9uYmEvLmVsZW1lbnQvbWVkaWEvMi4wL3RlYW1zaXRlcy9jZWx0aWNzL21lZGlhL2dlbmVyaWMtcGxheWVyLWxpZ2h0XzYwMHg0MzgucG5nJyk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIGpRdWVyeSgnLnBsYXllci1ib3g6bnRoLWNoaWxkKCcgKyAoZm9yaW5Db3VudGVyICsgMSkgKyAnKSBpbWcnKS5kZWxheShkZWxheSkuZmFkZVRvKDMwMCwgMSk7XG4gICAgICAgICAgICBkZWxheSArPSAzMDtcbiAgICAgICAgICAgIGZvcmluQ291bnRlcisrO1xuICAgICAgICB9XG4gICAgfSwgMTMwMCk7XG4gICAgLyogNSAtIFBMQVlFUiBTRUxFQ1QgKi9cbiAgICB2YXIgc2VsZWN0ZWRQbGF5ZXIgPSAnJztcbiAgICBzZXRUaW1lb3V0KGZ1bmN0aW9uKCkge1xuICAgICAgICBqUXVlcnkoJy5wbGF5ZXItYm94JykuYWRkQ2xhc3MoJ3RyYW5zaXRpb24tMicpO1xuICAgICAgICBqUXVlcnkoJy5wbGF5ZXItYm94Om50aC1jaGlsZCgnICsgKHBsYXllclNwb3RsaWdodENvdW50ZXIgKyAxKSArICcpJykuYWRkQ2xhc3MoJ3NlbGVjdGVkJyk7XG4gICAgICAgIHNlbGVjdGVkUGxheWVyID0galF1ZXJ5KCcucGxheWVyLWJveDpudGgtY2hpbGQoJyArIChwbGF5ZXJTcG90bGlnaHRDb3VudGVyICsgMSkgKyAnKScpLmF0dHIoJ2RhdGEtcGlkJyk7XG4gICAgICAgIGNvbnNvbGUubG9nKHNlbGVjdGVkUGxheWVyKTtcbiAgICAgICAgalF1ZXJ5KCcucGxheWVyLWJveCcpLm5vdCgnLnJlcGxhY2VtZW50LnNlbGVjdGVkJykuZGVsYXkoNTAwKS5hZGRDbGFzcygndHJhbnNpdGlvbi00Jyk7XG4gICAgfSwgMjAwMCk7XG4gICAgLyogNiAtIFBMQVlFUiBCT1ggRVhQQU5EICovXG4gICAgc2V0VGltZW91dChmdW5jdGlvbigpIHtcbiAgICAgICAgalF1ZXJ5KCcuYmxvY2std3JhcC5zb2NpYWwnKS5hZGRDbGFzcygndHJhbnNpdGlvbi0zJyk7XG4gICAgICAgIGpRdWVyeSgnLnBsYXllci1ib3gucmVwbGFjZW1lbnQuc2VsZWN0ZWQnKS5hZGRDbGFzcygndHJhbnNpdGlvbi0zJyk7XG4gICAgfSwgMzAwMCk7XG4gICAgLyogNyAtIFNQT1RMSUdIVCBIVE1MICovXG4gICAgc2V0VGltZW91dChmdW5jdGlvbigpIHtcbiAgICAgICAgZ2VuZXJhdGVUaW1lbGluZShzZWxlY3RlZFBsYXllcik7XG4gICAgICAgIGpRdWVyeSgnLnBsYXllci1ib3gucmVwbGFjZW1lbnQuc2VsZWN0ZWQnKS5jbG9uZSgpLmFwcGVuZFRvKCcuYmxvY2std3JhcC5wbGF5ZXItc3BvdGxpZ2h0IC50b3Atd3JhcCcpO1xuICAgICAgICBqUXVlcnkoJy5wbGF5ZXItc3BvdGxpZ2h0IC5zZWxlY3RlZCcpLmFkZENsYXNzKCcuYXBwZW5kZWQnKTtcbiAgICAgICAgalF1ZXJ5KCcuYmxvY2std3JhcC5wbGF5ZXItc3BvdGxpZ2h0JykuYWRkQ2xhc3MoJ3RyYW5zaXRpb24tMScpO1xuICAgICAgICBqUXVlcnkoJy5ibG9jay13cmFwLnNvY2lhbCcpLmFkZENsYXNzKCd0cmFuc2l0aW9uLTEnKTtcbiAgICAgICAgdmFyIHN0YXRzID0gcm9zdGVyT2JqLmNlbHRpY3Mucm9zdGVyW3NlbGVjdGVkUGxheWVyXS5zdGF0cztcbiAgICAgICAgalF1ZXJ5KCcucGxheWVyLXNwb3RsaWdodCAudG9wLXdyYXAgLnBsYXllci10b3AnKS5hcHBlbmQoJzxpbWcgY2xhc3M9XCJzaWxvIGFwcGVuZGVkXCIgc3JjPVwiaHR0cDovL2lvLmNubi5uZXQvbmJhL25iYS8uZWxlbWVudC9tZWRpYS8yLjAvdGVhbXNpdGVzL2NlbHRpY3MvbWVkaWEvc2lsby00NjZ4NTkxLScgKyByb3N0ZXJPYmouY2VsdGljcy5yb3N0ZXJbc2VsZWN0ZWRQbGF5ZXJdLnBpZCArICcucG5nXCIgLz48ZGl2IGNsYXNzPVwidG9wIGFwcGVuZGVkXCI+PGRpdiBjbGFzcz1cInBsYXllci1uYW1lLXdyYXBcIj48cCBjbGFzcz1cInBsYXllci1uYW1lXCI+PHNwYW4+JyArIHJvc3Rlck9iai5jZWx0aWNzLnJvc3RlcltzZWxlY3RlZFBsYXllcl0uZm4udG9VcHBlckNhc2UoKSArICc8L3NwYW4+IDxicj4gJyArIHJvc3Rlck9iai5jZWx0aWNzLnJvc3RlcltzZWxlY3RlZFBsYXllcl0ubG4udG9VcHBlckNhc2UoKSArICc8L3A+PC9kaXY+PHAgY2xhc3M9XCJwbGF5ZXItbnVtYmVyXCI+JyArIHJvc3Rlck9iai5jZWx0aWNzLnJvc3RlcltzZWxlY3RlZFBsYXllcl0ubnVtICsgJzwvYnI+PHNwYW4+JyArIHJvc3Rlck9iai5jZWx0aWNzLnJvc3RlcltzZWxlY3RlZFBsYXllcl0ucG9zICsgJzwvc3Bhbj48L3A+PC9kaXY+PGRpdiBjbGFzcz1cIm1pZGRsZSBhcHBlbmRlZFwiPjx1bCBjbGFzcz1cImluZm8gY2xlYXJmaXhcIj48bGk+PHA+QUdFPHNwYW4gY2xhc3M9XCJzbS1oaWRlXCI+OiZuYnNwOzwvc3Bhbj4gPC9icj48c3BhbiBjbGFzcz1cImluZm8tdmFsdWVcIj4nICsgcGxheWVyQWdlKHJvc3Rlck9iai5jZWx0aWNzLnJvc3RlcltzZWxlY3RlZFBsYXllcl0uZG9iKSArICc8L3NwYW4+PC9wPjwvbGk+PGxpPjxwPkhUPHNwYW4gY2xhc3M9XCJzbS1oaWRlXCI+OiZuYnNwOzwvc3Bhbj4gPC9icj48c3BhbiBjbGFzcz1cImluZm8tdmFsdWVcIj4nICsgcm9zdGVyT2JqLmNlbHRpY3Mucm9zdGVyW3NlbGVjdGVkUGxheWVyXS5odCArICc8L3NwYW4+PC9wPjwvbGk+PGxpPjxwPldUPHNwYW4gY2xhc3M9XCJzbS1oaWRlXCI+OiZuYnNwOzwvc3Bhbj4gPC9icj48c3BhbiBjbGFzcz1cImluZm8tdmFsdWVcIj4nICsgcm9zdGVyT2JqLmNlbHRpY3Mucm9zdGVyW3NlbGVjdGVkUGxheWVyXS53dCArICc8L3NwYW4+PC9wPjwvbGk+PC91bD48L2Rpdj48ZGl2IGNsYXNzPVwiYm90dG9tIGZ1bGwgY2xlYXJmaXggc20taGlkZSBhcHBlbmRlZFwiPjx0YWJsZSBjbGFzcz1cImF2ZXJhZ2VzXCI+PHRyIGNsYXNzPVwiYXZlcmFnZXMtbGFiZWxzXCI+PHRkPjxwPkdQPC9wPjwvdGQ+PHRkPjxwPlBQRzwvcD48L3RkPjx0ZD48cD5SUEc8L3A+PC90ZD48dGQ+PHA+QVBHPC9wPjwvdGQ+PC90cj48dHIgY2xhc3M9XCJhdmVyYWdlcy1zZWFzb25cIj48dGQgY2xhc3M9XCJncFwiPjxwPjwvcD48L3RkPjx0ZCBjbGFzcz1cInB0c1wiPjxwPjwvcD48L3RkPjx0ZCBjbGFzcz1cInJlYlwiPjxwPjwvcD48L3RkPjx0ZCBjbGFzcz1cImFzdFwiPjxwPjwvcD48L3RkPjwvdHI+PC90YWJsZT48L2Rpdj4nKTtcbiAgICAgICAgalF1ZXJ5KFwiLnBsYXllci1zcG90bGlnaHQgLmF2ZXJhZ2VzLXNlYXNvblwiKS5odG1sKCc8dGQ+PHA+JyArIHN0YXRzLnNhWzBdLmdwICsgJzwvcD48L3RkPjx0ZD48cD4nICsgc3RhdHMuc2FbMF0ucHRzICsgJzwvcD48L3RkPjx0ZD48cD4nICsgc3RhdHMuc2FbMF0ucmViICsgJzwvcD48L3RkPjx0ZD48cD4nICsgc3RhdHMuc2FbMF0uYXN0ICsgJzwvcD48L3RkPicpO1xuICAgICAgICBqUXVlcnkoJy5wbGF5ZXItc3BvdGxpZ2h0IC5wbGF5ZXItbmFtZScpLmZhZGVUbygyMDAsIDEpO1xuICAgICAgICB2YXIgcGxheWVyRmFjdHMgPSByb3N0ZXJPYmouY2VsdGljcy5yb3N0ZXJbc2VsZWN0ZWRQbGF5ZXJdLmJpby5wZXJzb25hbDtcbiAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCAzOyBpKyspIHtcbiAgICAgICAgICAgIHZhciBmYWN0SW5kZXggPSBNYXRoLmZsb29yKE1hdGgucmFuZG9tKCkgKiBwbGF5ZXJGYWN0cy5sZW5ndGgpO1xuICAgICAgICAgICAgalF1ZXJ5KCcucGxheWVyLXNwb3RsaWdodCAuYm90dG9tLXdyYXAnKS5hcHBlbmQoJzxkaXYgY2xhc3M9XCJkeWstYm94IGFwcGVuZGVkXCI+PHA+JyArIHBsYXllckZhY3RzW2ZhY3RJbmRleF0gKyAnPC9wPjwvZGl2PicpO1xuICAgICAgICB9O1xuICAgICAgICBqUXVlcnkoJy5wbGF5ZXItc3BvdGxpZ2h0IC5ib3R0b20td3JhcCcpLmFkZENsYXNzKCd0cmFuc2l0aW9uLTEnKTtcbiAgICAgICAgc2V0VGltZW91dChmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIGpRdWVyeSgnLnBsYXllci1zcG90bGlnaHQgLmJvdHRvbS13cmFwIC5keWstYm94Om50aC1vZi10eXBlKDIpJykuYWRkQ2xhc3MoJ3RyYW5zaXRpb24tMicpO1xuICAgICAgICAgICAgalF1ZXJ5KCcucGxheWVyLXNwb3RsaWdodCAuYm90dG9tLXdyYXAgLmR5ay1ib3g6bnRoLW9mLXR5cGUoMyknKS5hZGRDbGFzcygndHJhbnNpdGlvbi0xJyk7XG4gICAgICAgIH0sIDEwMDApO1xuICAgICAgICBzZXRUaW1lb3V0KGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgalF1ZXJ5KCcucGxheWVyLXNwb3RsaWdodCAuYm90dG9tLXdyYXAgLmR5ay1ib3g6bnRoLW9mLXR5cGUoMyknKS5hZGRDbGFzcygndHJhbnNpdGlvbi0yJyk7XG4gICAgICAgICAgICBqUXVlcnkoJy5wbGF5ZXItc3BvdGxpZ2h0IC5ib3R0b20td3JhcCAuZHlrLWJveDpudGgtb2YtdHlwZSg0KScpLmFkZENsYXNzKCd0cmFuc2l0aW9uLTEnKTtcbiAgICAgICAgfSwgMTUwMCk7XG4gICAgfSwgMzYwMCk7XG4gICAgLyogOCAtIFNQT1RMSUdIVCBTTElERSBJTiAqL1xuICAgIHNldFRpbWVvdXQoZnVuY3Rpb24oKSB7XG4gICAgICAgIGpRdWVyeSgnLnBsYXllci1zcG90bGlnaHQgLnBsYXllci10b3AgLnBsYXllci1uYW1lLCAucGxheWVyLXNwb3RsaWdodCAucGxheWVyLW5hbWUtd3JhcCwgLnBsYXllci1zcG90bGlnaHQgLmhlYWRzaG90LCAucGxheWVyLXNwb3RsaWdodCAuaW5mbywgLnBsYXllci1zcG90bGlnaHQgLnNpbG8sIC5wbGF5ZXItc3BvdGxpZ2h0IC5hdmVyYWdlcywgLnBsYXllci1zcG90bGlnaHQgLnBsYXllci1udW1iZXInKS5hZGRDbGFzcygndHJhbnNpdGlvbi0xJyk7XG4gICAgICAgIHNldFRpbWVvdXQoZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICBqUXVlcnkoJy5ibG9jay13cmFwLnBsYXllci1zcG90bGlnaHQgLnBsYXllci1ib3gnKS5yZW1vdmUoKTtcbiAgICAgICAgfSwgNDAwMCk7XG4gICAgICAgIGlmIChwbGF5ZXJTcG90bGlnaHRDb3VudGVyIDwgMTYpIHtcbiAgICAgICAgICAgIHBsYXllclNwb3RsaWdodENvdW50ZXIrKztcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHBsYXllclNwb3RsaWdodENvdW50ZXIgPSAwO1xuICAgICAgICB9XG4gICAgfSwgNDEwMCk7XG4gICAgLyogOSAtIFNQT1RMSUdIVCBTTElERSBPVVQgKi9cbiAgICBzZXRUaW1lb3V0KGZ1bmN0aW9uKCkge1xuICAgICAgICBqUXVlcnkoJy5wbGF5ZXItc3BvdGxpZ2h0IC5ib3R0b20td3JhcCwgLnBsYXllci1zcG90bGlnaHQgLnRvcC13cmFwJykuYWRkQ2xhc3MoJ3RyYW5zaXRpb24tMicpO1xuICAgIH0sIDYwMDApO1xuICAgIC8qIDEwIC0gRE9ORS4gUkVNT1ZFIFRIQVQgU0hJVCAqL1xuICAgIHNldFRpbWVvdXQoZnVuY3Rpb24oKSB7XG4gICAgICAgIGpRdWVyeSgnLmFwcGVuZGVkJykucmVtb3ZlKCk7XG4gICAgICAgIGpRdWVyeSgnLnRyYW5zaXRpb24sIC50cmFuc2l0aW9uLTEsIC50cmFuc2l0aW9uLTIsIC50cmFuc2l0aW9uLTMsIC50cmFuc2l0aW9uLTQnKS5yZW1vdmVDbGFzcygndHJhbnNpdGlvbiB0cmFuc2l0aW9uLTEgdHJhbnNpdGlvbi0yIHRyYW5zaXRpb24tMyB0cmFuc2l0aW9uLTQnKTtcbiAgICB9LCA3MDAwKTtcbn1cblxuZnVuY3Rpb24gbGVhZGVycyhnaWQsIGdhbWVTdGFydGVkKSB7XG4gICAgdmFyIGdhbWVEZXRhaWwgPSAnJztcbiAgICB2YXIgZGV0YWlsQXZhaWxhYmxlID0gZmFsc2U7XG4gICAgZ2FtZVN0YXJ0ZWQgPSB0cnVlOyAvLyBETzogREVMRVRFIFRISVMgV0hFTiBPTkxJTkUuIEpVU1QgRk9SIFRFU1RJTkcgUFVSUE9TRVMgUk5cbiAgICBpZiAoZ2FtZVN0YXJ0ZWQpIHtcbiAgICAgICAgalF1ZXJ5LmFqYXgoe1xuICAgICAgICAgICAgdXJsOiAnaHR0cDovL2xvY2FsaG9zdDo4ODg4L2RhdGEvbW9iaWxlLXN0YXRzLWZlZWQvZ2FtZWRldGFpbC5qc29uJyxcbiAgICAgICAgICAgIGFzeW5jOiBmYWxzZSxcbiAgICAgICAgICAgIHN1Y2Nlc3M6IGZ1bmN0aW9uKGRhdGEpIHtcbiAgICAgICAgICAgICAgICAvLyBETzogVVBEQVRFIFRIRSBMRUFERVIgT0JKRUNUU1xuICAgICAgICAgICAgICAgIGdhbWVEZXRhaWwgPSBkYXRhO1xuICAgICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICB9XG4gICAgZm9yICh2YXIgdGVhbSBpbiByb3N0ZXJPYmopIHtcbiAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCAzOyBpKyspIHtcbiAgICAgICAgICAgIGZvciAodmFyIHN0YXQgaW4gcm9zdGVyT2JqW3RlYW1dLmxlYWRlcnMpIHtcbiAgICAgICAgICAgICAgICAvLyBMRUFERVIgU1RBVCBWQUxVRVxuICAgICAgICAgICAgICAgIGpRdWVyeSgnLmxlYWRlci1zZWN0aW9uOm50aC1vZi10eXBlKCcgKyAoaSArIDIpICsgJykgLicgKyBzdGF0ICsgJy4nICsgdGVhbSArICcgLnN0YXQnKS5hcHBlbmQoJzxzcGFuIGNsYXNzPVwiJyArIHJvc3Rlck9ialt0ZWFtXS50YSArICdcIj4nICsgcm9zdGVyT2JqW3RlYW1dLmxlYWRlcnNbc3RhdF1baV1bMl0gKyAnPC9zcGFuPiAnICsgc3RhdC50b1VwcGVyQ2FzZSgpKTtcbiAgICAgICAgICAgICAgICAvLyBMRUFERVIgTkFNRVxuICAgICAgICAgICAgICAgIGlmIChyb3N0ZXJPYmpbdGVhbV0ubGVhZGVyc1tzdGF0XVtpXVswXS5sZW5ndGggKyByb3N0ZXJPYmpbdGVhbV0ubGVhZGVyc1tzdGF0XVtpXVsxXS5sZW5ndGggPj0gMTUpIHtcbiAgICAgICAgICAgICAgICAgICAgcm9zdGVyT2JqW3RlYW1dLmxlYWRlcnNbc3RhdF1baV1bMF0gPSByb3N0ZXJPYmpbdGVhbV0ubGVhZGVyc1tzdGF0XVtpXVswXS5zdWJzdHIoMCwgMSkgKyAnLic7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGpRdWVyeSgnLmxlYWRlci1zZWN0aW9uOm50aC1vZi10eXBlKCcgKyAoaSArIDIpICsgJykgLicgKyBzdGF0ICsgJy4nICsgdGVhbSArICcgLm5hbWUnKS5hcHBlbmQoJzxzcGFuPicgKyByb3N0ZXJPYmpbdGVhbV0ubGVhZGVyc1tzdGF0XVtpXVswXSArICc8L3NwYW4+ICcgKyByb3N0ZXJPYmpbdGVhbV0ubGVhZGVyc1tzdGF0XVtpXVsxXSk7XG4gICAgICAgICAgICAgICAgLy8gTEVBREVSIEhFQURTSE9UXG4gICAgICAgICAgICAgICAgalF1ZXJ5KCcubGVhZGVyLXNlY3Rpb246bnRoLW9mLXR5cGUoJyArIChpICsgMikgKyAnKSAuJyArIHN0YXQgKyAnLicgKyB0ZWFtICsgJyAuaGVhZHNob3QnKS5hdHRyKCdzcmMnLCAnaHR0cHM6Ly9hay1zdGF0aWMuY21zLm5iYS5jb20vd3AtY29udGVudC91cGxvYWRzL2hlYWRzaG90cy9uYmEvbGF0ZXN0LzEwNDB4NzYwLycgKyByb3N0ZXJPYmpbdGVhbV0ubGVhZGVyc1tzdGF0XVtpXVszXSArICcucG5nJyk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9XG4gICAgdmFyIHRpbWVCZXR3ZWVuID0gMTAwMDtcbiAgICBqUXVlcnkoJy5sZWFkZXJzLCAubGVhZGVycyAuYmxvY2staW5uZXInKS5hZGRDbGFzcygndHJhbnNpdGlvbi0xJyk7XG4gICAgc2V0VGltZW91dChmdW5jdGlvbigpIHtcbiAgICAgICAgalF1ZXJ5KCcubGVhZGVycyAubGVhZGVyLXNlY3Rpb24nKS5hZGRDbGFzcygndHJhbnNpdGlvbi0xJyk7XG4gICAgICAgIGpRdWVyeSgnLmxlYWRlci1zdWJzZWN0aW9uLmJvdHRvbSBwOm50aC1vZi10eXBlKDEpJykuYWRkQ2xhc3MoJ3RyYW5zaXRpb24tMScpO1xuICAgICAgICBqUXVlcnkoJy5sZWFkZXJzIC5sZWFkZXItc2VjdGlvbiAudW5kZXJsaW5lLCAubGVhZGVycyAubGVhZGVyLXN1YnNlY3Rpb24udG9wJykuYWRkQ2xhc3Mocm9zdGVyT2JqLmNlbHRpY3MudGEgKyAnLWJnJyk7XG4gICAgfSwgODAwKTtcbiAgICB2YXIgdHJhbnNpdGlvbkNvdW50ZXIgPSAxO1xuICAgIGZvciAobGV0IGkgPSAxOyBpIDw9IDY7IGkrKykge1xuICAgICAgICBzZXRUaW1lb3V0KGZ1bmN0aW9uKG51bWJlclN0cmluZykge1xuICAgICAgICAgICAgalF1ZXJ5KCcubGVhZGVycyAubGVhZGVyLXNlY3Rpb24gLmxlYWRlci1zdGF0LXdyYXAnKS5hZGRDbGFzcygndHJhbnNpdGlvbi0nICsgaSk7XG4gICAgICAgICAgICBqUXVlcnkoJy5sZWFkZXJzIC5sZWFkZXItc2VjdGlvbiAudW5kZXJsaW5lLCAubGVhZGVycyAubGVhZGVyLXN1YnNlY3Rpb24udG9wJykucmVtb3ZlQ2xhc3Mocm9zdGVyT2JqLmNlbHRpY3MudGEgKyAnLWJnJyk7XG4gICAgICAgICAgICBqUXVlcnkoJy5sZWFkZXJzIC5sZWFkZXItc2VjdGlvbiAudW5kZXJsaW5lLCAubGVhZGVycyAubGVhZGVyLXN1YnNlY3Rpb24udG9wJykuYWRkQ2xhc3Mocm9zdGVyT2JqLmF3YXkudGEgKyAnLWJnJyk7XG4gICAgICAgICAgICBpZiAodHJhbnNpdGlvbkNvdW50ZXIgJSAyID09IDApIHtcbiAgICAgICAgICAgICAgICBzZXRUaW1lb3V0KGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgICAgICAgICBqUXVlcnkoJy5sZWFkZXJzIC5sZWFkZXItc2VjdGlvbiAudW5kZXJsaW5lLCAubGVhZGVycyAubGVhZGVyLXN1YnNlY3Rpb24udG9wJykucmVtb3ZlQ2xhc3Mocm9zdGVyT2JqLmF3YXkudGEgKyAnLWJnJyk7XG4gICAgICAgICAgICAgICAgICAgIGpRdWVyeSgnLmxlYWRlcnMgLmxlYWRlci1zZWN0aW9uIC51bmRlcmxpbmUsIC5sZWFkZXJzIC5sZWFkZXItc3Vic2VjdGlvbi50b3AnKS5hZGRDbGFzcyhyb3N0ZXJPYmouY2VsdGljcy50YSArICctYmcnKTtcbiAgICAgICAgICAgICAgICAgICAgalF1ZXJ5KCcubGVhZGVyLXN1YnNlY3Rpb24uYm90dG9tIHAnKS5yZW1vdmVDbGFzcygndHJhbnNpdGlvbi0xJyk7XG4gICAgICAgICAgICAgICAgICAgIGpRdWVyeSgnLmxlYWRlcnMgLmxlYWRlci1zZWN0aW9uIC51bmRlcmxpbmUnKS5hZGRDbGFzcygndHJhbnNpdGlvbi0nICsgKGkgLyAyKSk7XG4gICAgICAgICAgICAgICAgICAgIGpRdWVyeSgnLmxlYWRlci1zdWJzZWN0aW9uLmJvdHRvbSBwOm50aC1vZi10eXBlKCcgKyAoaSAtIChpIC8gMikgKyAxKSArICcpJykuYWRkQ2xhc3MoJ3RyYW5zaXRpb24tMScpOyAvLyBsb2xcbiAgICAgICAgICAgICAgICB9LCAyMDApO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgdHJhbnNpdGlvbkNvdW50ZXIrKztcbiAgICAgICAgfSwgMjAwMCAqIGkpO1xuICAgIH1cbn07XG5cbmZ1bmN0aW9uIHNvY2lhbChyb3N0ZXIpIHt9O1xuXG5mdW5jdGlvbiBtb2JpbGVBcHAoKSB7XG4gICAgalF1ZXJ5KCcuYXBwJykuc2hvdygpO1xufTtcbi8qPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG49ICAgICAgICAgICAgTEVGVCBXUkFQICAgICAgICAgICAgPVxuPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09Ki9cblxuZnVuY3Rpb24gbGVmdFdyYXAoKSB7XG4gICAgaWYgKGpRdWVyeSgnLmxlZnQtd3JhcCAuc3RhbmRpbmdzJykuaGFzQ2xhc3MoJ3RyYW5zaXRpb24tMScpKXtcbiAgICAgICAgalF1ZXJ5KCcubGVmdC13cmFwIC5zdGFuZGluZ3MnKS5yZW1vdmVDbGFzcygndHJhbnNpdGlvbi0xJyk7XG4gICAgfVxuICAgIGVsc2Uge1xuICAgICAgICBqUXVlcnkoJy5sZWZ0LXdyYXAgLnN0YW5kaW5ncycpLmFkZENsYXNzKCd0cmFuc2l0aW9uLTEnKTtcbiAgICB9XG5cbiAgICBpZiAoalF1ZXJ5KCcubGVmdC13cmFwIC5zY29yZXMnKS5oYXNDbGFzcygndHJhbnNpdGlvbi0xJykpe1xuICAgICAgICBqUXVlcnkoJy5sZWZ0LXdyYXAgLnNjb3JlcycpLnJlbW92ZUNsYXNzKCd0cmFuc2l0aW9uLTEnKTtcbiAgICB9XG4gICAgZWxzZSB7XG4gICAgICAgIGpRdWVyeSgnLmxlZnQtd3JhcCAuc2NvcmVzJykuYWRkQ2xhc3MoJ3RyYW5zaXRpb24tMScpO1xuICAgIH1cbn1cblxuXG5mdW5jdGlvbiBzdGFuZGluZ3NJbml0KGF3YXlUZWFtKSB7XG4gICAgalF1ZXJ5LmFqYXgoe1xuICAgICAgICB1cmw6ICdodHRwOi8vbG9jYWxob3N0Ojg4ODgvZGF0YS9tb2JpbGUtc3RhdHMtZmVlZC9zdGFuZGluZ3MuanNvbicsXG4gICAgICAgIGFzeW5jOiBmYWxzZSxcbiAgICAgICAgc3VjY2VzczogZnVuY3Rpb24oc3RhbmRpbmdzRGF0YSkge1xuICAgICAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBzdGFuZGluZ3NEYXRhLnN0YS5jby5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgICAgIGZvciAobGV0IHggPSAwOyB4IDwgc3RhbmRpbmdzRGF0YS5zdGEuY29baV0uZGkubGVuZ3RoOyB4KyspIHtcbiAgICAgICAgICAgICAgICAgICAgZm9yIChsZXQgdCA9IDA7IHQgPCBzdGFuZGluZ3NEYXRhLnN0YS5jb1tpXS5kaVt4XS50Lmxlbmd0aDsgdCsrKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICB2YXIgY29uZmVyZW5jZXMgPSBbJy5lYXN0JywgJy53ZXN0J107XG4gICAgICAgICAgICAgICAgICAgICAgICB2YXIgcGxhY2UgPSBzdGFuZGluZ3NEYXRhLnN0YS5jb1tpXS5kaVt4XS50W3RdLnNlZTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHZhciBzZWVkID0gJyc7XG4gICAgICAgICAgICAgICAgICAgICAgICB2YXIgYWN0aXZlU3RhdHVzID0gJyc7XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoc3RhbmRpbmdzRGF0YS5zdGEuY29baV0uZGlbeF0udFt0XS5zZWUgPD0gOCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHNlZWQgPSBzdGFuZGluZ3NEYXRhLnN0YS5jb1tpXS5kaVt4XS50W3RdLnNlZTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChzdGFuZGluZ3NEYXRhLnN0YS5jb1tpXS5kaVt4XS50W3RdLnRhID09ICdCT1MnKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgYWN0aXZlU3RhdHVzID0gJ2FjdGl2ZSc7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoc3RhbmRpbmdzRGF0YS5zdGEuY29baV0uZGlbeF0udFt0XS50YSA9PSBhd2F5VGVhbSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGFjdGl2ZVN0YXR1cyA9ICdhY3RpdmUtYXdheSc7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICB2YXIgcm93SFRNTCA9ICc8ZGl2IGNsYXNzPVwicGxhY2VcIj4nICsgc2VlZCArICc8L2Rpdj48ZGl2IGNsYXNzPVwibG9nby13cmFwXCI+PGltZyBjbGFzcz1cImxvZ29cIiBzcmM9aHR0cDovL2kuY2RuLnR1cm5lci5jb20vbmJhL25iYS9hc3NldHMvbG9nb3MvdGVhbXMvcHJpbWFyeS93ZWIvJyArIHN0YW5kaW5nc0RhdGEuc3RhLmNvW2ldLmRpW3hdLnRbdF0udGEgKyAnLnN2Zz48L2Rpdj48ZGl2IGNsYXNzPVwidGVhbSArICcgKyBzdGFuZGluZ3NEYXRhLnN0YS5jb1tpXS5kaVt4XS50W3RdLnRhICsgJ1wiPicgKyBzdGFuZGluZ3NEYXRhLnN0YS5jb1tpXS5kaVt4XS50W3RdLnRhICsgJzwvZGl2PjxkaXYgY2xhc3M9XCJ3aW5zXCI+JyArIHN0YW5kaW5nc0RhdGEuc3RhLmNvW2ldLmRpW3hdLnRbdF0udyArICc8L2Rpdj48ZGl2IGNsYXNzPVwibG9zc2VzXCI+JyArIHN0YW5kaW5nc0RhdGEuc3RhLmNvW2ldLmRpW3hdLnRbdF0ubCArICc8L2Rpdj48ZGl2IGNsYXNzPVwiZ2FtZXMtYmVoaW5kXCI+JyArIHN0YW5kaW5nc0RhdGEuc3RhLmNvW2ldLmRpW3hdLnRbdF0uZ2IgKyAnPC9kaXY+JztcbiAgICAgICAgICAgICAgICAgICAgICAgIGpRdWVyeShjb25mZXJlbmNlc1tpXSArICcgPiBkaXY6bnRoLWNoaWxkKCcgKyAocGxhY2UgKyAxKSArICcpJykuaHRtbChyb3dIVE1MKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGpRdWVyeShjb25mZXJlbmNlc1tpXSArICcgPiBkaXY6bnRoLWNoaWxkKCcgKyAocGxhY2UgKyAxKSArICcpJykuYWRkQ2xhc3MoYWN0aXZlU3RhdHVzKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH0pO1xufTtcblxuZnVuY3Rpb24gc2NvcmVzSW5pdCh0b2RheXNTY29yZXNEYXRhKSB7XG4gICAgdmFyIGxpdmVTY29yZXMgPSB0b2RheXNTY29yZXNEYXRhLmdzLmc7XG4gICAgaWYgKGxpdmVTY29yZXMubGVuZ3RoICE9IDApIHtcbiAgICAgICAgdmFyIHNlYXNvblR5cGUgPSAnJztcbiAgICAgICAgaWYgKGxpdmVTY29yZXNbMF0uZ2lkLnN1YnN0cigwLCAzKSA9PSAnMDAxJykge1xuICAgICAgICAgICAgc2Vhc29uVHlwZSA9ICdwcmUnO1xuICAgICAgICB9IGVsc2UgaWYgKGxpdmVTY29yZXNbMF0uZ2lkLnN1YnN0cigwLCAzKSA9PSAnMDA0Jykge1xuICAgICAgICAgICAgc2Vhc29uVHlwZSA9ICdwb3N0JztcbiAgICAgICAgfVxuICAgICAgICBpZiAobGl2ZVNjb3Jlcy5sZW5ndGggPiAxIHx8IChsaXZlU2NvcmVzLmxlbmd0aCA9PSAxICYmIGxpdmVTY29yZXNbMF0uaC50YSAhPSAnQk9TJykpIHtcbiAgICAgICAgICAgIHZhciBzdGF0dXNDb2RlcyA9IFsnMXN0IFF0cicsICcybmQgUXRyJywgJzNyZCBRdHInLCAnNHRoIFF0cicsICcxc3QgT1QnLCAnMm5kIE9UJywgJzNyZCBPVCcsICc0dGggT1QnLCAnNXRoIE9UJywgJzZ0aCBPVCcsICc3dGggT1QnLCAnOHRoIE9UJywgJzl0aCBPVCcsICcxMHRoIE9UJ107XG4gICAgICAgICAgICB2YXIgc2NvcmVzSFRNTCA9ICcnO1xuICAgICAgICAgICAgZm9yICh2YXIgaSA9IGxpdmVTY29yZXMubGVuZ3RoIC0gMTsgaSA+PSAwOyBpLS0pIHtcbiAgICAgICAgICAgICAgICBpZiAobGl2ZVNjb3Jlc1tpXS5oLnRhICE9PSAnQk9TJykge1xuICAgICAgICAgICAgICAgICAgICB2YXIgdlNjb3JlID0gJyc7XG4gICAgICAgICAgICAgICAgICAgIHZhciBoU2NvcmUgPSAnJztcbiAgICAgICAgICAgICAgICAgICAgaWYgKGxpdmVTY29yZXNbaV0uc3QgIT0gMSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgdlNjb3JlID0gbGl2ZVNjb3Jlc1tpXS52LnM7XG4gICAgICAgICAgICAgICAgICAgICAgICBoU2NvcmUgPSBsaXZlU2NvcmVzW2ldLmgucztcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB2YXIgc1RleHQgPSBsaXZlU2NvcmVzW2ldLnN0dDtcbiAgICAgICAgICAgICAgICAgICAgaWYgKHN0YXR1c0NvZGVzLmluZGV4T2YobGl2ZVNjb3Jlc1tpXS5zdHQpICE9PSAtMSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgc1RleHQgPSBsaXZlU2NvcmVzW2ldLnN0dCArICcgLSAnICsgbGl2ZVNjb3Jlc1tpXS5jbDtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICBzY29yZXNIVE1MICs9ICc8ZGl2IGNsYXNzPVwic2NvcmUtd3JhcFwiPjxkaXYgY2xhc3M9XCJzY29yZS1zdGF0dXNcIj4nICsgc1RleHQgKyAnPC9kaXY+PGRpdiBjbGFzcz1cIicgKyBsaXZlU2NvcmVzW2ldLnYudGEgKyAnXCI+PGltZyBzcmM9XCJodHRwOi8vc3RhdHMubmJhLmNvbS9tZWRpYS9pbWcvdGVhbXMvbG9nb3MvJyArIGxpdmVTY29yZXNbaV0udi50YS50b1VwcGVyQ2FzZSgpICsgJ19sb2dvLnN2Z1wiPiAnICsgbGl2ZVNjb3Jlc1tpXS52LnRjLnRvVXBwZXJDYXNlKCkgKyAnICcgKyBsaXZlU2NvcmVzW2ldLnYudG4udG9VcHBlckNhc2UoKSArICcgPGRpdiBjbGFzcz1cInNjb3JlLW51bVwiPicgKyB2U2NvcmUgKyAnPC9kaXY+PC9kaXY+PGRpdiBjbGFzcz1cIicgKyBsaXZlU2NvcmVzW2ldLmgudGEgKyAnXCI+PGltZyBzcmM9XCJodHRwOi8vc3RhdHMubmJhLmNvbS9tZWRpYS9pbWcvdGVhbXMvbG9nb3MvJyArIGxpdmVTY29yZXNbaV0uaC50YS50b1VwcGVyQ2FzZSgpICsgJ19sb2dvLnN2Z1wiPiAnICsgbGl2ZVNjb3Jlc1tpXS5oLnRjLnRvVXBwZXJDYXNlKCkgKyAnICcgKyBsaXZlU2NvcmVzW2ldLmgudG4udG9VcHBlckNhc2UoKSArICcgPGRpdiBjbGFzcz1cInNjb3JlLW51bVwiPicgKyBoU2NvcmUgKyAnPC9kaXY+PC9kaXY+PC9kaXY+JztcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBqUXVlcnkoJy5zY29yZXMnKS5lbXB0eSgpLmFwcGVuZChzY29yZXNIVE1MKTtcbiAgICAgICAgICAgIGlmIChqUXVlcnkoJy5zY29yZS13cmFwJykubGVuZ3RoIDw9IDYgJiYgalF1ZXJ5KCcubGxlYWRlci1oZWFkZXInKS5sZW5ndGggPT09IDApIHtcbiAgICAgICAgICAgICAgICBhZGRMZWFndWVMZWFkZXJzKHNlYXNvblR5cGUpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxufVxuXG5mdW5jdGlvbiB1cGRhdGVMZWFndWVTY29yZXModG9kYXlzU2NvcmVzRGF0YSkge1xuICAgIHZhciBsaXZlU2NvcmVzID0gdG9kYXlzU2NvcmVzRGF0YS5ncy5nO1xuICAgIGlmIChsaXZlU2NvcmVzLmxlbmd0aCAhPSAwKSB7XG4gICAgICAgIHZhciBzZWFzb25UeXBlID0gJyc7XG4gICAgICAgIGlmIChsaXZlU2NvcmVzWzBdLmdpZC5zdWJzdHIoMCwzKSA9PSAnMDAxJykge1xuICAgICAgICAgICAgc2Vhc29uVHlwZSA9ICdwcmUnO1xuICAgICAgICB9XG4gICAgICAgIGVsc2UgaWYgKGxpdmVTY29yZXNbMF0uZ2lkLnN1YnN0cigwLDMpID09ICcwMDQnKSB7XG4gICAgICAgICAgICBzZWFzb25UeXBlID0gJ3Bvc3QnO1xuICAgICAgICB9XG4gICAgICAgIGlmIChsaXZlU2NvcmVzLmxlbmd0aCA+IDEgfHwgKGxpdmVTY29yZXMubGVuZ3RoID09IDEgJiYgbGl2ZVNjb3Jlc1swXS5oLnRhICE9ICdCT1MnKSkge1xuICAgICAgICAgICAgdmFyIHN0YXR1c0NvZGVzID0gWycxc3QgUXRyJywnMm5kIFF0cicsJzNyZCBRdHInLCc0dGggUXRyJywnMXN0IE9UJywnMm5kIE9UJywnM3JkIE9UJywnNHRoIE9UJywnNXRoIE9UJywnNnRoIE9UJywnN3RoIE9UJywnOHRoIE9UJywnOXRoIE9UJywnMTB0aCBPVCddO1xuICAgICAgICAgICAgdmFyIHNjb3Jlc0hUTUwgPSAnJztcbiAgICAgICAgICAgIGlmIChqUXVlcnkoJy5hdGwtaGVhZGVyJykubGVuZ3RoID09PSAwKSB7XG4gICAgICAgICAgICAgICAgalF1ZXJ5KCcjbGVmdHdyYXAnKS5wcmVwZW5kKCc8aW1nIGNsYXNzPVwiYXRsLWhlYWRlclwiIHNyYz1cImh0dHA6Ly9pLmNkbi50dXJuZXIuY29tL25iYS9uYmEvLmVsZW1lbnQvbWVkaWEvMi4wL3RlYW1zaXRlcy9jZWx0aWNzL21lZGlhL3NpZ25hZ2UtYXRsLTk2MHgxMzUucG5nXCI+Jyk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBmb3IgKHZhciBpID0gbGl2ZVNjb3Jlcy5sZW5ndGggLSAxOyBpID49IDA7IGktLSkge1xuICAgICAgICAgICAgICAgIGlmIChsaXZlU2NvcmVzW2ldLmgudGEgIT09ICdCT1MnKSB7XG4gICAgICAgICAgICAgICAgICAgIHZhciB2U2NvcmUgPSAnJztcbiAgICAgICAgICAgICAgICAgICAgdmFyIGhTY29yZSA9ICcnO1xuICAgICAgICAgICAgICAgICAgICBpZiAobGl2ZVNjb3Jlc1tpXS5zdCAhPSAxKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICB2U2NvcmUgPSBsaXZlU2NvcmVzW2ldLnYucztcbiAgICAgICAgICAgICAgICAgICAgICAgIGhTY29yZSA9IGxpdmVTY29yZXNbaV0uaC5zO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIHZhciBzVGV4dCA9IGxpdmVTY29yZXNbaV0uc3R0O1xuICAgICAgICAgICAgICAgICAgICBpZiAoc3RhdHVzQ29kZXMuaW5kZXhPZihsaXZlU2NvcmVzW2ldLnN0dCkgIT09IC0xKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBzVGV4dCA9IGxpdmVTY29yZXNbaV0uc3R0ICsgJyAtICcgKyBsaXZlU2NvcmVzW2ldLmNsO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIHNjb3Jlc0hUTUwgKz0gJzxkaXYgY2xhc3M9XCJzY29yZS13cmFwXCI+PGRpdiBjbGFzcz1cInNjb3JlLWNvbnRhaW5lclwiPjxkaXYgY2xhc3M9XCInICsgbGl2ZVNjb3Jlc1tpXS52LnRhICsgJ1wiPjxpbWcgc3JjPVwiaHR0cDovL3N0YXRzLm5iYS5jb20vbWVkaWEvaW1nL3RlYW1zL2xvZ29zLycgKyBsaXZlU2NvcmVzW2ldLnYudGEudG9VcHBlckNhc2UoKSArICdfbG9nby5zdmdcIj4gJyArIGxpdmVTY29yZXNbaV0udi50Yy50b1VwcGVyQ2FzZSgpICsgJyAnICsgbGl2ZVNjb3Jlc1tpXS52LnRuLnRvVXBwZXJDYXNlKCkgKyAnIDxkaXYgY2xhc3M9XCJzY29yZS1udW1cIj4nICsgdlNjb3JlICsgJzwvZGl2PjwvZGl2PjxkaXYgY2xhc3M9XCInICsgbGl2ZVNjb3Jlc1tpXS5oLnRhICsgJ1wiPjxpbWcgc3JjPVwiaHR0cDovL3N0YXRzLm5iYS5jb20vbWVkaWEvaW1nL3RlYW1zL2xvZ29zLycgKyBsaXZlU2NvcmVzW2ldLmgudGEudG9VcHBlckNhc2UoKSArICdfbG9nby5zdmdcIj4gJyArIGxpdmVTY29yZXNbaV0uaC50Yy50b1VwcGVyQ2FzZSgpICsgJyAnICsgbGl2ZVNjb3Jlc1tpXS5oLnRuLnRvVXBwZXJDYXNlKCkgKyAnIDxkaXYgY2xhc3M9XCJzY29yZS1udW1cIj4nICsgaFNjb3JlICsgJzwvZGl2PjwvZGl2PjxkaXYgY2xhc3M9XCJzY29yZS1zdGF0dXNcIj4nICsgc1RleHQgKyAnPC9kaXY+PC9kaXY+PC9kaXY+JztcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBqUXVlcnkoJy5zY29yZXMnKS5lbXB0eSgpLmFwcGVuZChzY29yZXNIVE1MKTtcbiAgICAgICAgICAgIGlmIChqUXVlcnkoJy5zY29yZS13cmFwJykubGVuZ3RoIDw9IDYgJiYgalF1ZXJ5KCcubGxlYWRlci1oZWFkZXInKS5sZW5ndGggPT09IDApIHtcbiAgICAgICAgICAgICAgICBhZGRMZWFndWVMZWFkZXJzKHNlYXNvblR5cGUpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxufVxuIl19
