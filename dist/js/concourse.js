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
$(document).ready(function () {
    var gid = '';
    var awayTeam = '';
    var gameStarted = false;
    var playerSpotlightCounter = 10;
    var date = new Date();
    var leftWrapCounter = false;
    $.ajax({
        url: 'http://localhost:8888/data/mobile-stats-feed/todays_scores.json',
        async: false,
        success: function success(todaysScoresData) {
            for (var i = 0; i < todaysScoresData.gs.g.length; i++) {
                if (todaysScoresData.gs.g[i].h.ta == 'BOS') {
                    //CHANGE THIS
                    awayTeam = todaysScoresData.gs.g[i].v.ta;
                    loadRosterData(awayTeam);
                    scoresInit(todaysScoresData);
                    standingsInit(awayTeam);
                    leagueLeaders();
                    /*                    setInterval(leftWrap, 3000);*/
                    gid = todaysScoresData.gs.g[i].gid;
                    /*                    initMobileApp();
                                        mobileApp();*/
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
    $(".timeline-wrap").html('<div class="timeline appended">' + timelineHTML + '</div><div class="season-year appended">' + seasonYearHTML + '</div>');
}

function createIndex(keys, array) {
    var newArr = keys.map(function (item) {
        return array.indexOf(item);
    });
    return newArr;
}
/*==================================
=            INITIALIZE            =
==================================*/
function init() {
    if (!gameStarted) {
        $.ajax({
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
        $('.app .bottom-wrap img').removeClass('active');
        $('.app .feature-list p').removeClass('active');
        $('.app .feature-list p:nth-of-type(' + counter + ')').addClass('active');
        $('.app .bottom-wrap img:nth-of-type(' + counter + ')').addClass('active');
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
    $.ajax({
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
    $.ajax({
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
    $.ajax({
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
        $.ajax({
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
        $.ajax({
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
        $('.white-line.horizontal').addClass('transition-1');
    }, 500);
    setTimeout(function () {
        $('.social-top .white-line.vertical:nth-child(odd)').addClass('transition-1');
        $('.social-bottom .white-line.vertical:nth-child(even)').addClass('transition-1');
    }, 800);
    /* 2b - WHITE LINE VERTICAL */
    setTimeout(function () {
        $('.social-top .white-line.vertical:nth-child(even)').addClass('transition-1');
        $('.social-bottom .white-line.vertical:nth-child(odd)').addClass('transition-1');
    }, 1000);
    /* 3 - GENERATE AND REVEAL PLAYER BOXES */
    setTimeout(function () {
        $('.social-top, .social-bottom').addClass('transition-1');
        $('.player-box-wrap').addClass('transition-1');
    }, 1200);
    /* 4 - APPEND HEADSHOTS */
    setTimeout(function () {
        $('.player-box-wrap').addClass('transition-2');
        $('.player-box').addClass('transition-1');
        var delay = 0;
        var forinCounter = 0;
        for (var player in rosterObj.celtics.roster) {
            console.log(player);
            var headshot = 'https://ak-static.cms.nba.com/wp-content/uploads/headshots/nba/latest/1040x760/' + rosterObj.celtics.roster[player].pid + '.png';
            $('.player-box:nth-child(' + (forinCounter + 1) + ')').append('<img class="appended headshot" src="' + headshot + '"/>');
            $('.player-box:nth-child(' + (forinCounter + 1) + ')').attr('data-pid', rosterObj.celtics.roster[player].pid);
            $('.player-box img').on("error", function () {
                $(this).attr('src', 'https://i.cdn.turner.com/nba/nba/.element/media/2.0/teamsites/celtics/media/generic-player-light_600x438.png');
            });
            $('.player-box:nth-child(' + (forinCounter + 1) + ') img').delay(delay).fadeTo(300, 1);
            delay += 30;
            forinCounter++;
        }
    }, 1300);
    /* 5 - PLAYER SELECT */
    var selectedPlayer = '';
    setTimeout(function () {
        $('.player-box').addClass('transition-2');
        $('.player-box:nth-child(' + (playerSpotlightCounter + 1) + ')').addClass('selected');
        selectedPlayer = $('.player-box:nth-child(' + (playerSpotlightCounter + 1) + ')').attr('data-pid');
        console.log(selectedPlayer);
        $('.player-box').not('.replacement.selected').delay(500).addClass('transition-4');
    }, 2000);
    /* 6 - PLAYER BOX EXPAND */
    setTimeout(function () {
        $('.block-wrap.social').addClass('transition-3');
        $('.player-box.replacement.selected').addClass('transition-3');
    }, 3000);
    /* 7 - SPOTLIGHT HTML */
    setTimeout(function () {
        generateTimeline(selectedPlayer);
        $('.player-box.replacement.selected').clone().appendTo('.block-wrap.player-spotlight .top-wrap');
        $('.player-spotlight .selected').addClass('.appended');
        $('.block-wrap.player-spotlight').addClass('transition-1');
        $('.block-wrap.social').addClass('transition-1');
        var stats = rosterObj.celtics.roster[selectedPlayer].stats;
        $('.player-spotlight .top-wrap .player-top').append('<img class="silo appended" src="http://io.cnn.net/nba/nba/.element/media/2.0/teamsites/celtics/media/silo-466x591-' + rosterObj.celtics.roster[selectedPlayer].pid + '.png" /><div class="top appended"><div class="player-name-wrap"><p class="player-name"><span>' + rosterObj.celtics.roster[selectedPlayer].fn.toUpperCase() + '</span> <br> ' + rosterObj.celtics.roster[selectedPlayer].ln.toUpperCase() + '</p></div><p class="player-number">' + rosterObj.celtics.roster[selectedPlayer].num + '</br><span>' + rosterObj.celtics.roster[selectedPlayer].pos + '</span></p></div><div class="middle appended"><ul class="info clearfix"><li><p>AGE<span class="sm-hide">:&nbsp;</span> </br><span class="info-value">' + playerAge(rosterObj.celtics.roster[selectedPlayer].dob) + '</span></p></li><li><p>HT<span class="sm-hide">:&nbsp;</span> </br><span class="info-value">' + rosterObj.celtics.roster[selectedPlayer].ht + '</span></p></li><li><p>WT<span class="sm-hide">:&nbsp;</span> </br><span class="info-value">' + rosterObj.celtics.roster[selectedPlayer].wt + '</span></p></li></ul></div><div class="bottom full clearfix sm-hide appended"><table class="averages"><tr class="averages-labels"><td><p>GP</p></td><td><p>PPG</p></td><td><p>RPG</p></td><td><p>APG</p></td></tr><tr class="averages-season"><td class="gp"><p></p></td><td class="pts"><p></p></td><td class="reb"><p></p></td><td class="ast"><p></p></td></tr></table></div>');
        $(".player-spotlight .averages-season").html('<td><p>' + stats.sa[0].gp + '</p></td><td><p>' + stats.sa[0].pts + '</p></td><td><p>' + stats.sa[0].reb + '</p></td><td><p>' + stats.sa[0].ast + '</p></td>');
        $('.player-spotlight .player-name').fadeTo(200, 1);
        var playerFacts = rosterObj.celtics.roster[selectedPlayer].bio.personal;
        for (var i = 0; i < 3; i++) {
            var factIndex = Math.floor(Math.random() * playerFacts.length);
            $('.player-spotlight .bottom-wrap').append('<div class="dyk-box appended"><p>' + playerFacts[factIndex] + '</p></div>');
        };
        $('.player-spotlight .bottom-wrap').addClass('transition-1');
        setTimeout(function () {
            $('.player-spotlight .bottom-wrap .dyk-box:nth-of-type(2)').addClass('transition-2');
            $('.player-spotlight .bottom-wrap .dyk-box:nth-of-type(3)').addClass('transition-1');
        }, 1000);
        setTimeout(function () {
            $('.player-spotlight .bottom-wrap .dyk-box:nth-of-type(3)').addClass('transition-2');
            $('.player-spotlight .bottom-wrap .dyk-box:nth-of-type(4)').addClass('transition-1');
        }, 1500);
    }, 3600);
    /* 8 - SPOTLIGHT SLIDE IN */
    setTimeout(function () {
        $('.player-spotlight .player-top .player-name, .player-spotlight .player-name-wrap, .player-spotlight .headshot, .player-spotlight .info, .player-spotlight .silo, .player-spotlight .averages, .player-spotlight .player-number').addClass('transition-1');
        setTimeout(function () {
            $('.block-wrap.player-spotlight .player-box').remove();
        }, 4000);
        if (playerSpotlightCounter < 16) {
            playerSpotlightCounter++;
        } else {
            playerSpotlightCounter = 0;
        }
    }, 4100);
    /* 9 - SPOTLIGHT SLIDE OUT */
    setTimeout(function () {
        $('.player-spotlight .bottom-wrap, .player-spotlight .top-wrap').addClass('transition-2');
    }, 6000);
    /* 10 - DONE. REMOVE THAT SHIT */
    setTimeout(function () {
        $('.appended').remove();
        $('.transition, .transition-1, .transition-2, .transition-3, .transition-4').removeClass('transition transition-1 transition-2 transition-3 transition-4');
    }, 7000);
}

function leaders(gid, gameStarted) {
    var gameDetail = '';
    var detailAvailable = false;
    gameStarted = true; // DO: DELETE THIS WHEN ONLINE. JUST FOR TESTING PURPOSES RN
    if (gameStarted) {
        $.ajax({
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
                $('.leader-section:nth-of-type(' + (i + 2) + ') .' + stat + '.' + team + ' .stat').append('<span class="' + rosterObj[team].ta + '">' + rosterObj[team].leaders[stat][i][2] + '</span> ' + stat.toUpperCase());
                // LEADER NAME
                if (rosterObj[team].leaders[stat][i][0].length + rosterObj[team].leaders[stat][i][1].length >= 15) {
                    rosterObj[team].leaders[stat][i][0] = rosterObj[team].leaders[stat][i][0].substr(0, 1) + '.';
                }
                $('.leader-section:nth-of-type(' + (i + 2) + ') .' + stat + '.' + team + ' .name').append('<span>' + rosterObj[team].leaders[stat][i][0] + '</span> ' + rosterObj[team].leaders[stat][i][1]);
                // LEADER HEADSHOT
                $('.leader-section:nth-of-type(' + (i + 2) + ') .' + stat + '.' + team + ' .headshot').attr('src', 'https://ak-static.cms.nba.com/wp-content/uploads/headshots/nba/latest/1040x760/' + rosterObj[team].leaders[stat][i][3] + '.png');
            }
        }
    }
    var timeBetween = 1000;
    $('.leaders, .leaders .block-inner').addClass('transition-1');
    setTimeout(function () {
        $('.leaders .leader-section').addClass('transition-1');
        $('.leader-subsection.bottom p:nth-of-type(1)').addClass('transition-1');
        $('.leaders .leader-section .underline, .leaders .leader-subsection.top').addClass(rosterObj.celtics.ta + '-bg');
    }, 800);
    var transitionCounter = 1;

    var _loop = function _loop(_i) {
        setTimeout(function (numberString) {
            $('.leaders .leader-section .leader-stat-wrap').addClass('transition-' + _i);
            $('.leaders .leader-section .underline, .leaders .leader-subsection.top').removeClass(rosterObj.celtics.ta + '-bg');
            $('.leaders .leader-section .underline, .leaders .leader-subsection.top').addClass(rosterObj.away.ta + '-bg');
            if (transitionCounter % 2 == 0) {
                setTimeout(function () {
                    $('.leaders .leader-section .underline, .leaders .leader-subsection.top').removeClass(rosterObj.away.ta + '-bg');
                    $('.leaders .leader-section .underline, .leaders .leader-subsection.top').addClass(rosterObj.celtics.ta + '-bg');
                    $('.leader-subsection.bottom p').removeClass('transition-1');
                    $('.leaders .leader-section .underline').addClass('transition-' + _i / 2);
                    $('.leader-subsection.bottom p:nth-of-type(' + (_i - _i / 2 + 1) + ')').addClass('transition-1'); // lol
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
    $('.app').show();
};
/*=================================
=            LEFT WRAP            =
=================================*/

function leftWrap() {
    if ($('.left-wrap .standings').hasClass('transition-1')) {
        $('.left-wrap .standings').removeClass('transition-1');
    } else {
        $('.left-wrap .standings').addClass('transition-1');
    }

    if ($('.left-wrap .scores-and-leaders').hasClass('transition-1')) {
        $('.left-wrap .scores-and-leaders').removeClass('transition-1');
    } else {
        $('.left-wrap .scores-and-leaders').addClass('transition-1');
    }
}

function standingsInit(awayTeam) {
    $.ajax({
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
                        $(conferences[i] + ' > div:nth-child(' + (place + 1) + ')').html(rowHTML);
                        $(conferences[i] + ' > div:nth-child(' + (place + 1) + ')').addClass(activeStatus);
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
            var added = 0;
            for (var i = liveScores.length - 1; i >= 0; i--) {
                if (liveScores[i].h.ta !== 'BOS' && i < 11) {
                    added++;
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
            $('.scores').empty().append(scoresHTML);
        }
        if (added < 5) {
            $('.league-leaders').show();
        } else {
            $('.league-leaders').hide();
        }
    }
}

function updateLeagueScores(todaysScoresData) {
    var liveScores = todaysScoresData.gs.g;
    if (liveScores.length != 0) {
        var seasonType = 'Regular+Season';
        if (liveScores[0].gid.substr(0, 3) == '001') {
            seasonType = 'Pre+Season';
        } else if (liveScores[0].gid.substr(0, 3) == '004') {
            seasonType = 'Playoffs';
        }
        if (liveScores.length > 1 || liveScores.length == 1 && liveScores[0].h.ta != 'BOS') {
            var statusCodes = ['1st Qtr', '2nd Qtr', '3rd Qtr', '4th Qtr', '1st OT', '2nd OT', '3rd OT', '4th OT', '5th OT', '6th OT', '7th OT', '8th OT', '9th OT', '10th OT'];
            var scoresHTML = '';
            if ($('.atl-header').length === 0) {
                $('#leftwrap').prepend('<img class="atl-header" src="http://i.cdn.turner.com/nba/nba/.element/media/2.0/teamsites/celtics/media/signage-atl-960x135.png">');
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
            $('.scores').empty().append(scoresHTML);
            leagueLeaders(seasonType);
        }
    }
}

function leagueLeaders() {
    var leagueLeadersHTML = '<div class="title"><p>LEADERS</p><p>PTS</p><p>REB</p><p>AST</p><p>STL</p><p>BLK</p></div>';
    var statType = '';
    var dataIndex = ["RANK", "PLAYER_ID", "PLAYER", "TEAM_ID", "TEAM_ABBREVIATION"];

    $.ajax({
        url: 'http://localhost:8888/data/league_leaders.json',
        async: false,
        success: function success(data) {
            var leadersData = data.resultSets;
            for (var i = 0; i < leadersData.length; i++) {
                var index = createIndex(dataIndex, leadersData[i].headers);
                var rows = '';
                for (var x = 0; x < leadersData[i].rowSet.length; x++) {
                    rows += '<div class="row"><div class="left"><div class="place">' + leadersData[i].rowSet[x][0] + '</div><div class="logo-wrap"><img class="logo" src="http://stats.nba.com/media/img/teams/logos/' + leadersData[i].rowSet[x][4] + '_logo.svg"/></div><div class="name">' + leadersData[i].rowSet[x][2].toUpperCase() + '</div></div><div class="right"><div class="value">' + leadersData[i].rowSet[x][8] + '</div></div></div>';
                }
                leagueLeadersHTML += '<div class="league-leaders-wrap">' + rows + '</div>';
            }
        }
    });
    $('.league-leaders').empty().append(leagueLeadersHTML);
    var counter = 2;
    setInterval(function () {
        jQuery('.league-leaders-wrap, .league-leaders .title p').removeClass('active');
        jQuery('.league-leaders-wrap:nth-of-type(' + counter + '), .league-leaders .title p:nth-of-type(' + counter + ')').addClass('active');
        if (counter == 6) {
            counter = 2;
        } else {
            counter++;
        }
    }, 4000);
}

},{}]},{},[1])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJzcmMvanMvY29uY291cnNlLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7QUNBQSxJQUFJLFlBQVk7QUFDWixhQUFTO0FBQ0wsZ0JBQVEsRUFESDtBQUVMLGlCQUFTO0FBQ0wsaUJBQUssQ0FDRCxDQUFDLElBQUQsRUFBTyxJQUFQLEVBQWEsSUFBYixFQUFtQixJQUFuQixDQURDLEVBRUQsQ0FBQyxJQUFELEVBQU8sSUFBUCxFQUFhLElBQWIsRUFBbUIsSUFBbkIsQ0FGQyxFQUdELENBQUMsSUFBRCxFQUFPLElBQVAsRUFBYSxJQUFiLEVBQW1CLElBQW5CLENBSEMsQ0FEQTtBQU1MLGlCQUFLLENBQ0QsQ0FBQyxJQUFELEVBQU8sSUFBUCxFQUFhLElBQWIsRUFBbUIsSUFBbkIsQ0FEQyxFQUVELENBQUMsSUFBRCxFQUFPLElBQVAsRUFBYSxJQUFiLEVBQW1CLElBQW5CLENBRkMsRUFHRCxDQUFDLElBQUQsRUFBTyxJQUFQLEVBQWEsSUFBYixFQUFtQixJQUFuQixDQUhDLENBTkE7QUFXTCxpQkFBSyxDQUNELENBQUMsSUFBRCxFQUFPLElBQVAsRUFBYSxJQUFiLEVBQW1CLElBQW5CLENBREMsRUFFRCxDQUFDLElBQUQsRUFBTyxJQUFQLEVBQWEsSUFBYixFQUFtQixJQUFuQixDQUZDLEVBR0QsQ0FBQyxJQUFELEVBQU8sSUFBUCxFQUFhLElBQWIsRUFBbUIsSUFBbkIsQ0FIQztBQVhBO0FBRkosS0FERztBQXFCWixVQUFNO0FBQ0YsZ0JBQVEsRUFETjtBQUVGLGlCQUFTO0FBQ0wsaUJBQUssQ0FDRCxDQUFDLElBQUQsRUFBTyxJQUFQLEVBQWEsSUFBYixFQUFtQixJQUFuQixDQURDLEVBRUQsQ0FBQyxJQUFELEVBQU8sSUFBUCxFQUFhLElBQWIsRUFBbUIsSUFBbkIsQ0FGQyxFQUdELENBQUMsSUFBRCxFQUFPLElBQVAsRUFBYSxJQUFiLEVBQW1CLElBQW5CLENBSEMs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LE9BQTdGLEdBQXVHLEdBQTlHLEVBQW1ILFFBQW5ILENBQTRILFFBQTVIO0FBQ0EsWUFBSSxXQUFXLENBQWYsRUFBa0I7QUFDZCxzQkFBVSxDQUFWO0FBQ0gsU0FGRCxNQUdLO0FBQ0Q7QUFDSDtBQUNKLEtBVEQsRUFTRyxJQVRIO0FBVUgiLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbiBlKHQsbixyKXtmdW5jdGlvbiBzKG8sdSl7aWYoIW5bb10pe2lmKCF0W29dKXt2YXIgYT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2lmKCF1JiZhKXJldHVybiBhKG8sITApO2lmKGkpcmV0dXJuIGkobywhMCk7dmFyIGY9bmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitvK1wiJ1wiKTt0aHJvdyBmLmNvZGU9XCJNT0RVTEVfTk9UX0ZPVU5EXCIsZn12YXIgbD1uW29dPXtleHBvcnRzOnt9fTt0W29dWzBdLmNhbGwobC5leHBvcnRzLGZ1bmN0aW9uKGUpe3ZhciBuPXRbb11bMV1bZV07cmV0dXJuIHMobj9uOmUpfSxsLGwuZXhwb3J0cyxlLHQsbixyKX1yZXR1cm4gbltvXS5leHBvcnRzfXZhciBpPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7Zm9yKHZhciBvPTA7bzxyLmxlbmd0aDtvKyspcyhyW29dKTtyZXR1cm4gc30pIiwidmFyIHJvc3Rlck9iaiA9IHtcbiAgICBjZWx0aWNzOiB7XG4gICAgICAgIHJvc3Rlcjoge30sXG4gICAgICAgIGxlYWRlcnM6IHtcbiAgICAgICAgICAgIHB0czogW1xuICAgICAgICAgICAgICAgIFsnLS0nLCAnLS0nLCAnLS0nLCAnLS0nXSxcbiAgICAgICAgICAgICAgICBbJy0tJywgJy0tJywgJy0tJywgJy0tJ10sXG4gICAgICAgICAgICAgICAgWyctLScsICctLScsICctLScsICctLSddXG4gICAgICAgICAgICBdLFxuICAgICAgICAgICAgYXN0OiBbXG4gICAgICAgICAgICAgICAgWyctLScsICctLScsICctLScsICctLSddLFxuICAgICAgICAgICAgICAgIFsnLS0nLCAnLS0nLCAnLS0nLCAnLS0nXSxcbiAgICAgICAgICAgICAgICBbJy0tJywgJy0tJywgJy0tJywgJy0tJ11cbiAgICAgICAgICAgIF0sXG4gICAgICAgICAgICByZWI6IFtcbiAgICAgICAgICAgICAgICBbJy0tJywgJy0tJywgJy0tJywgJy0tJ10sXG4gICAgICAgICAgICAgICAgWyctLScsICctLScsICctLScsICctLSddLFxuICAgICAgICAgICAgICAgIFsnLS0nLCAnLS0nLCAnLS0nLCAnLS0nXVxuICAgICAgICAgICAgXVxuICAgICAgICB9XG4gICAgfSxcbiAgICBhd2F5OiB7XG4gICAgICAgIHJvc3Rlcjoge30sXG4gICAgICAgIGxlYWRlcnM6IHtcbiAgICAgICAgICAgIHB0czogW1xuICAgICAgICAgICAgICAgIFsnLS0nLCAnLS0nLCAnLS0nLCAnLS0nXSxcbiAgICAgICAgICAgICAgICBbJy0tJywgJy0tJywgJy0tJywgJy0tJ10sXG4gICAgICAgICAgICAgICAgWyctLScsICctLScsICctLScsICctLSddXG4gICAgICAgICAgICBdLFxuICAgICAgICAgICAgYXN0OiBbXG4gICAgICAgICAgICAgICAgWyctLScsICctLScsICctLScsICctLSddLFxuICAgICAgICAgICAgICAgIFsnLS0nLCAnLS0nLCAnLS0nLCAnLS0nXSxcbiAgICAgICAgICAgICAgICBbJy0tJywgJy0tJywgJy0tJywgJy0tJ11cbiAgICAgICAgICAgIF0sXG4gICAgICAgICAgICByZWI6IFtcbiAgICAgICAgICAgICAgICBbJy0tJywgJy0tJywgJy0tJywgJy0tJ10sXG4gICAgICAgICAgICAgICAgWyctLScsICctLScsICctLScsICctLSddLFxuICAgICAgICAgICAgICAgIFsnLS0nLCAnLS0nLCAnLS0nLCAnLS0nXVxuICAgICAgICAgICAgXVxuICAgICAgICB9XG4gICAgfVxufTtcbiQoZG9jdW1lbnQpLnJlYWR5KGZ1bmN0aW9uKCkge1xuICAgIHZhciBnaWQgPSAnJztcbiAgICB2YXIgYXdheVRlYW0gPSAnJztcbiAgICB2YXIgZ2FtZVN0YXJ0ZWQgPSBmYWxzZTtcbiAgICB2YXIgcGxheWVyU3BvdGxpZ2h0Q291bnRlciA9IDEwO1xuICAgIHZhciBkYXRlID0gbmV3IERhdGUoKTtcbiAgICB2YXIgbGVmdFdyYXBDb3VudGVyID0gZmFsc2U7XG4gICAgJC5hamF4KHtcbiAgICAgICAgdXJsOiAnaHR0cDovL2xvY2FsaG9zdDo4ODg4L2RhdGEvbW9iaWxlLXN0YXRzLWZlZWQvdG9kYXlzX3Njb3Jlcy5qc29uJyxcbiAgICAgICAgYXN5bmM6IGZhbHNlLFxuICAgICAgICBzdWNjZXNzOiBmdW5jdGlvbih0b2RheXNTY29yZXNEYXRhKSB7XG4gICAgICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IHRvZGF5c1Njb3Jlc0RhdGEuZ3MuZy5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgICAgIGlmICh0b2RheXNTY29yZXNEYXRhLmdzLmdbaV0uaC50YSA9PSAnQk9TJykgeyAvL0NIQU5HRSBUSElTXG4gICAgICAgICAgICAgICAgICAgIGF3YXlUZWFtID0gdG9kYXlzU2NvcmVzRGF0YS5ncy5nW2ldLnYudGE7XG4gICAgICAgICAgICAgICAgICAgIGxvYWRSb3N0ZXJEYXRhKGF3YXlUZWFtKTtcbiAgICAgICAgICAgICAgICAgICAgc2NvcmVzSW5pdCh0b2RheXNTY29yZXNEYXRhKTtcbiAgICAgICAgICAgICAgICAgICAgc3RhbmRpbmdzSW5pdChhd2F5VGVhbSk7XG4gICAgICAgICAgICAgICAgICAgIGxlYWd1ZUxlYWRlcnMoKTtcbi8qICAgICAgICAgICAgICAgICAgICBzZXRJbnRlcnZhbChsZWZ0V3JhcCwgMzAwMCk7Ki9cbiAgICAgICAgICAgICAgICAgICAgZ2lkID0gdG9kYXlzU2NvcmVzRGF0YS5ncy5nW2ldLmdpZDtcbi8qICAgICAgICAgICAgICAgICAgICBpbml0TW9iaWxlQXBwKCk7XG4gICAgICAgICAgICAgICAgICAgIG1vYmlsZUFwcCgpOyovXG4gICAgICAgICAgICAgICAgICAgIC8qICAgICAgICAgICAgICAgICAgICBwbGF5ZXJTcG90bGlnaHQocm9zdGVyT2JqLCBwbGF5ZXJTcG90bGlnaHRDb3VudGVyKTsqL1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH0pO1xuICAgIC8vIGxvYWRSb3N0ZXJEYXRhKCk7IE9OTFkgT05DRVxuICAgIC8qICAgIHNldFRpbWVvdXQobGVhZGVycyhnaWQsIGdhbWVTdGFydGVkKSwgNDAwKTsqL1xufSk7XG4vKj09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG49ICAgICAgICAgICAgTUlTQyBGVU5DVElPTlMgICAgICAgICAgICA9XG49PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PSovXG5mdW5jdGlvbiBwbGF5ZXJBZ2UoZG9iKSB7XG4gICAgdmFyIHRvZGF5ID0gbmV3IERhdGUoKTtcbiAgICB2YXIgYmlydGhEYXRlID0gbmV3IERhdGUoZG9iKTtcbiAgICB2YXIgYWdlID0gdG9kYXkuZ2V0RnVsbFllYXIoKSAtIGJpcnRoRGF0ZS5nZXRGdWxsWWVhcigpO1xuICAgIHJldHVybiBhZ2U7XG59XG5cbmZ1bmN0aW9uIGdlbmVyYXRlVGltZWxpbmUoc2VsZWN0ZWRQbGF5ZXIpIHtcbiAgICAvLyBBUFBFTkQ6IFRJTUVMSU5FXG4gICAgdmFyIHNlYXNvbnNQbGF5ZWQgPSByb3N0ZXJPYmouY2VsdGljcy5yb3N0ZXJbc2VsZWN0ZWRQbGF5ZXJdLnN0YXRzLnNhLmxlbmd0aDtcbiAgICB2YXIgdGltZWxpbmVIVE1MID0gJyc7XG4gICAgdmFyIHNlYXNvblllYXJIVE1MID0gJyc7XG4gICAgZm9yICh2YXIgaSA9IDA7IGkgPCBzZWFzb25zUGxheWVkOyBpKyspIHtcbiAgICAgICAgdmFyIHRlYW1BYmJyZXZpYXRpb24gPSByb3N0ZXJPYmouY2VsdGljcy5yb3N0ZXJbc2VsZWN0ZWRQbGF5ZXJdLnN0YXRzLnNhW2ldLnRhO1xuICAgICAgICB2YXIgdHJhZGVkID0gcm9zdGVyT2JqLmNlbHRpY3Mucm9zdGVyW3NlbGVjdGVkUGxheWVyXS5zdGF0cy5zYVtpXS5zcGwubGVuZ3RoO1xuICAgICAgICB2YXIgc2VnbWVudElubmVyID0gXCJcIjtcbiAgICAgICAgdmFyIHRpdGxlID0gXCJcIjtcbiAgICAgICAgdmFyIHNlYXNvblllYXJUZXh0ID0gcm9zdGVyT2JqLmNlbHRpY3Mucm9zdGVyW3NlbGVjdGVkUGxheWVyXS5zdGF0cy5zYVtpXS52YWw7XG4gICAgICAgIGlmIChpID09PSAwIHx8IHRlYW1BYmJyZXZpYXRpb24gIT09IHJvc3Rlck9iai5jZWx0aWNzLnJvc3RlcltzZWxlY3RlZFBsYXllcl0uc3RhdHMuc2FbaSAtIDFdLnRhKSB7IC8vIElmIHRoaXMgaXMgYSBuZXcgdGVhbSwgc3RhcnQgdGhlIHRlYW0gd3JhcC5cbiAgICAgICAgICAgIHRpdGxlID0gdGVhbUFiYnJldmlhdGlvbjtcbiAgICAgICAgfVxuICAgICAgICBpZiAodHJhZGVkKSB7XG4gICAgICAgICAgICBmb3IgKHZhciB4ID0gMDsgeCA8IHRyYWRlZDsgeCsrKSB7XG4gICAgICAgICAgICAgICAgdmFyIGdwVG90ID0gcm9zdGVyT2JqLmNlbHRpY3Mucm9zdGVyW3NlbGVjdGVkUGxheWVyXS5zdGF0cy5zYVtpXS5ncDtcbiAgICAgICAgICAgICAgICB2YXIgZ3AgPSByb3N0ZXJPYmouY2VsdGljcy5yb3N0ZXJbc2VsZWN0ZWRQbGF5ZXJdLnN0YXRzLnNhW2ldLnNwbFt4XS5ncDtcbiAgICAgICAgICAgICAgICB2YXIgZ3BQZXJjZW50YWdlID0gTWF0aC5yb3VuZCgoZ3AgLyBncFRvdCkgKiAxMDApO1xuICAgICAgICAgICAgICAgIHRlYW1BYmJyZXZpYXRpb24gPSByb3N0ZXJPYmouY2VsdGljcy5yb3N0ZXJbc2VsZWN0ZWRQbGF5ZXJdLnN0YXRzLnNhW2ldLnNwbFt4XS50YTtcbiAgICAgICAgICAgICAgICBpZiAoaSA9PT0gMCB8fCB0ZWFtQWJicmV2aWF0aW9uICE9PSByb3N0ZXJPYmouY2VsdGljcy5yb3N0ZXJbc2VsZWN0ZWRQbGF5ZXJdLnN0YXRzLnNhW2kgLSAxXS50YSAmJiB0ZWFtQWJicmV2aWF0aW9uICE9PSByb3N0ZXJPYmouY2VsdGljcy5yb3N0ZXJbc2VsZWN0ZWRQbGF5ZXJdLnN0YXRzLnNhW2kgKyAxXS50YSkgeyAvLyBJZiB0aGlzIGlzIGEgbmV3IHRlYW0sIHN0YXJ0IHRoZSB0ZWFtIHdyYXAuXG4gICAgICAgICAgICAgICAgICAgIHRpdGxlID0gdGVhbUFiYnJldmlhdGlvbjtcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICB0aXRsZSA9IFwiXCI7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIHNlZ21lbnRJbm5lciArPSAnPGRpdiBkYXRhLXNlYXNvbi15ZWFyPVwiJyArIHNlYXNvblllYXJUZXh0ICsgJ1wiIGRhdGEtdGVhbT1cIicgKyB0ZWFtQWJicmV2aWF0aW9uICsgJ1wiIHN0eWxlPVwiXCIgY2xhc3M9XCJzZWdtZW50LWlubmVyICcgKyB0ZWFtQWJicmV2aWF0aW9uICsgJy1iZ1wiPjxwPicgKyB0aXRsZSArICc8L3A+PC9kaXY+JztcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHNlZ21lbnRJbm5lciA9ICc8ZGl2IGRhdGEtc2Vhc29uLXllYXI9XCInICsgc2Vhc29uWWVhclRleHQgKyAnXCIgZGF0YS10ZWFtPVwiJyArIHRlYW1BYmJyZXZpYXRpb24gKyAnXCIgY2xhc3M9XCJzZWdtZW50LWlubmVyICcgKyB0ZWFtQWJicmV2aWF0aW9uICsgJy1iZ1wiPjxwPicgKyB0aXRsZSArICc8L3A+PC9kaXY+JztcbiAgICAgICAgfVxuICAgICAgICB0aW1lbGluZUhUTUwgKz0gJzxkaXYgY2xhc3M9XCJzZWdtZW50XCI+JyArIHNlZ21lbnRJbm5lciArICc8L2Rpdj4nO1xuICAgICAgICBzZWFzb25ZZWFySFRNTCArPSAnPGRpdiBjbGFzcz1cInNlZ21lbnRcIj48cD4nICsgc2Vhc29uWWVhclRleHQgKyAnPC9wPjwvZGl2Pic7XG4gICAgfVxuICAgICQoXCIudGltZWxpbmUtd3JhcFwiKS5odG1sKCc8ZGl2IGNsYXNzPVwidGltZWxpbmUgYXBwZW5kZWRcIj4nICsgdGltZWxpbmVIVE1MICsgJzwvZGl2PjxkaXYgY2xhc3M9XCJzZWFzb24teWVhciBhcHBlbmRlZFwiPicgKyBzZWFzb25ZZWFySFRNTCArICc8L2Rpdj4nKTtcbn1cblxuZnVuY3Rpb24gY3JlYXRlSW5kZXgoa2V5cywgYXJyYXkpIHtcbiAgICB2YXIgbmV3QXJyID0ga2V5cy5tYXAoaXRlbSA9PiBhcnJheS5pbmRleE9mKGl0ZW0pKTtcbiAgICByZXR1cm4gbmV3QXJyO1xufVxuLyo9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG49ICAgICAgICAgICAgSU5JVElBTElaRSAgICAgICAgICAgID1cbj09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT0qL1xuZnVuY3Rpb24gaW5pdCgpIHtcbiAgICBpZiAoIWdhbWVTdGFydGVkKSB7XG4gICAgICAgICQuYWpheCh7XG4gICAgICAgICAgICB1cmw6ICdodHRwOi8vbG9jYWxob3N0Ojg4ODgvZGF0YS9tb2JpbGUtc3RhdHMtZmVlZC90b2RheXNfc2NvcmVzLmpzb24nLFxuICAgICAgICAgICAgYXN5bmM6IGZhbHNlLFxuICAgICAgICAgICAgc3VjY2VzczogZnVuY3Rpb24odG9kYXlzU2NvcmVzRGF0YSkge1xuICAgICAgICAgICAgICAgIHZhciBnaWQgPSAnJztcbiAgICAgICAgICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IHRvZGF5c1Njb3Jlc0RhdGEuZ3MuZy5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgICAgICAgICBpZiAodG9kYXlzU2NvcmVzRGF0YS5ncy5nW2ldLmgudGEgPT0gJ09STCcpIHsgLy8gQ0hBTkdFIFRISVMgVE8gJ0JPUycgV0hFTiBUSEUgVElNRSBDT01FU1xuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHRvZGF5c1Njb3Jlc0RhdGEuZ3MuZ1tpXSAhPT0gMSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGdhbWVTdGFydGVkID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgfVxufTtcblxuZnVuY3Rpb24gaW5pdE1vYmlsZUFwcCgpIHtcbiAgICB2YXIgY291bnRlciA9IDE7XG4gICAgc2V0SW50ZXJ2YWwoZnVuY3Rpb24oKSB7XG4gICAgICAgICQoJy5hcHAgLmJvdHRvbS13cmFwIGltZycpLnJlbW92ZUNsYXNzKCdhY3RpdmUnKTtcbiAgICAgICAgJCgnLmFwcCAuZmVhdHVyZS1saXN0IHAnKS5yZW1vdmVDbGFzcygnYWN0aXZlJyk7XG4gICAgICAgICQoJy5hcHAgLmZlYXR1cmUtbGlzdCBwOm50aC1vZi10eXBlKCcgKyBjb3VudGVyICsgJyknKS5hZGRDbGFzcygnYWN0aXZlJyk7XG4gICAgICAgICQoJy5hcHAgLmJvdHRvbS13cmFwIGltZzpudGgtb2YtdHlwZSgnICsgY291bnRlciArICcpJykuYWRkQ2xhc3MoJ2FjdGl2ZScpO1xuICAgICAgICBpZiAoY291bnRlciA9PSA1KSB7XG4gICAgICAgICAgICBjb3VudGVyID0gMTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGNvdW50ZXIrKztcbiAgICAgICAgfVxuICAgIH0sIDIwMDApO1xufTtcblxuLyo9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbj0gICAgICAgICAgICBMT0FEIFJPU1RFUiBJTkZPIChidWlsZCByb3N0ZXJPYmopICAgICAgICAgICAgICA9XG49PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT0qL1xuXG5mdW5jdGlvbiBsb2FkUm9zdGVyRGF0YShhd2F5VGVhbSkge1xuICAgIHZhciByb3N0ZXIgPSAnJztcbiAgICAkLmFqYXgoe1xuICAgICAgICB1cmw6ICdodHRwOi8vbG9jYWxob3N0Ojg4ODgvZGF0YS9tb2JpbGUtc3RhdHMtZmVlZC9jZWx0aWNzX3Jvc3Rlci5qc29uJyxcbiAgICAgICAgYXN5bmM6IGZhbHNlLFxuICAgICAgICBzdWNjZXNzOiBmdW5jdGlvbihkYXRhKSB7XG4gICAgICAgICAgICByb3N0ZXIgPSBkYXRhO1xuICAgICAgICAgICAgZm9yICh2YXIgcHJvcGVydHkgaW4gcm9zdGVyLnQpIHtcbiAgICAgICAgICAgICAgICBpZiAocHJvcGVydHkgIT09ICdwbCcpIHtcbiAgICAgICAgICAgICAgICAgICAgcm9zdGVyT2JqLmNlbHRpY3NbcHJvcGVydHldID0gcm9zdGVyLnRbcHJvcGVydHldO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfSxcbiAgICAgICAgZXJyb3I6IGZ1bmN0aW9uKCkge31cbiAgICB9KTtcbiAgICB2YXIgYXdheVJvc3RlciA9ICcnO1xuICAgICQuYWpheCh7XG4gICAgICAgIHVybDogJ2h0dHA6Ly9sb2NhbGhvc3Q6ODg4OC9kYXRhL21vYmlsZS1zdGF0cy1mZWVkL2F3YXlfcm9zdGVyLmpzb24nLFxuICAgICAgICBhc3luYzogZmFsc2UsXG4gICAgICAgIHN1Y2Nlc3M6IGZ1bmN0aW9uKGRhdGEpIHtcbiAgICAgICAgICAgIGF3YXlSb3N0ZXIgPSBkYXRhO1xuICAgICAgICAgICAgZm9yICh2YXIgcHJvcGVydHkgaW4gYXdheVJvc3Rlci50KSB7XG4gICAgICAgICAgICAgICAgaWYgKHByb3BlcnR5ICE9PSAncGwnKSB7XG4gICAgICAgICAgICAgICAgICAgIHJvc3Rlck9iai5hd2F5W3Byb3BlcnR5XSA9IGF3YXlSb3N0ZXIudFtwcm9wZXJ0eV07XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9LFxuICAgICAgICBlcnJvcjogZnVuY3Rpb24oKSB7fVxuICAgIH0pO1xuICAgIHZhciBiaW9EYXRhID0gJyc7XG4gICAgJC5hamF4KHtcbiAgICAgICAgdXJsOiAnaHR0cDovL2xvY2FsaG9zdDo4ODg4L2RhdGEvYmlvLWRhdGEuanNvbicsXG4gICAgICAgIGFzeW5jOiBmYWxzZSxcbiAgICAgICAgc3VjY2VzczogZnVuY3Rpb24oZGF0YSkge1xuICAgICAgICAgICAgYmlvRGF0YSA9IGRhdGE7XG4gICAgICAgIH0sXG4gICAgICAgIGVycm9yOiBmdW5jdGlvbigpIHt9XG4gICAgfSk7XG4gICAgZm9yICh2YXIgaSA9IDA7IGkgPCByb3N0ZXIudC5wbC5sZW5ndGg7IGkrKykge1xuICAgICAgICB2YXIgcGlkID0gcm9zdGVyLnQucGxbaV0ucGlkO1xuICAgICAgICByb3N0ZXJPYmouY2VsdGljcy5yb3N0ZXJbcGlkXSA9IHJvc3Rlci50LnBsW2ldO1xuICAgICAgICBmb3IgKHZhciBwcm9wZXJ0eSBpbiBiaW9EYXRhW3BpZF0pIHtcbiAgICAgICAgICAgIHJvc3Rlck9iai5jZWx0aWNzLnJvc3RlcltwaWRdLmJpbyA9IGJpb0RhdGFbcGlkXTtcbiAgICAgICAgfTtcbiAgICAgICAgJC5hamF4KHtcbiAgICAgICAgICAgIHVybDogJ2h0dHA6Ly9sb2NhbGhvc3Q6ODg4OC9kYXRhL21vYmlsZS1zdGF0cy1mZWVkL3BsYXllcmNhcmRzL3BsYXllcmNhcmQtJyArIHBpZCArICcuanNvbicsXG4gICAgICAgICAgICBhc3luYzogZmFsc2UsXG4gICAgICAgICAgICBzdWNjZXNzOiBmdW5jdGlvbihkYXRhKSB7XG4gICAgICAgICAgICAgICAgcm9zdGVyT2JqLmNlbHRpY3Mucm9zdGVyW3BpZF0uc3RhdHMgPSBkYXRhLnBsLmNhO1xuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIGVycm9yOiBmdW5jdGlvbigpIHt9XG4gICAgICAgIH0pO1xuICAgIH1cbiAgICBmb3IgKHZhciBpID0gMDsgaSA8IGF3YXlSb3N0ZXIudC5wbC5sZW5ndGg7IGkrKykge1xuICAgICAgICB2YXIgcGlkID0gYXdheVJvc3Rlci50LnBsW2ldLnBpZDtcbiAgICAgICAgcm9zdGVyT2JqLmF3YXkucm9zdGVyW3BpZF0gPSBhd2F5Um9zdGVyLnQucGxbaV07XG4gICAgICAgICQuYWpheCh7XG4gICAgICAgICAgICB1cmw6ICdodHRwOi8vbG9jYWxob3N0Ojg4ODgvZGF0YS9tb2JpbGUtc3RhdHMtZmVlZC9wbGF5ZXJjYXJkcy9wbGF5ZXJjYXJkLTIwMjMzMC5qc29uJywgLy8gQ0hBTkdFIFBJRFxuICAgICAgICAgICAgYXN5bmM6IGZhbHNlLFxuICAgICAgICAgICAgc3VjY2VzczogZnVuY3Rpb24oZGF0YSkge1xuICAgICAgICAgICAgICAgIHJvc3Rlck9iai5hd2F5LnJvc3RlcltwaWRdLnN0YXRzID0gZGF0YS5wbC5jYTtcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBlcnJvcjogZnVuY3Rpb24oKSB7fVxuICAgICAgICB9KTtcbiAgICB9XG4gICAgZm9yICh2YXIgdGVhbSBpbiByb3N0ZXJPYmopIHtcbiAgICAgICAgZm9yICh2YXIgcGxheWVyIGluIHJvc3Rlck9ialt0ZWFtXS5yb3N0ZXIpIHtcbiAgICAgICAgICAgIHZhciBwdExlYWRlcnMgPSByb3N0ZXJPYmpbdGVhbV0ubGVhZGVycy5wdHM7XG4gICAgICAgICAgICB2YXIgYXN0TGVhZGVycyA9IHJvc3Rlck9ialt0ZWFtXS5sZWFkZXJzLmFzdDtcbiAgICAgICAgICAgIHZhciByZWJMZWFkZXJzID0gcm9zdGVyT2JqW3RlYW1dLmxlYWRlcnMucmViO1xuICAgICAgICAgICAgZm9yICh2YXIgc3RhdCBpbiByb3N0ZXJPYmpbdGVhbV0ubGVhZGVycykge1xuICAgICAgICAgICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgMzsgaSsrKSB7XG4gICAgICAgICAgICAgICAgICAgIGlmIChyb3N0ZXJPYmpbdGVhbV0ubGVhZGVyc1tzdGF0XVtpXVsyXSA9PSAnLS0nICYmIHJvc3Rlck9ialt0ZWFtXS5yb3N0ZXJbcGxheWVyXS5zdGF0c1tzdGF0XSA+IDApIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJvc3Rlck9ialt0ZWFtXS5sZWFkZXJzW3N0YXRdW2ldWzBdID0gcm9zdGVyT2JqW3RlYW1dLnJvc3RlcltwbGF5ZXJdLmZuLnRvVXBwZXJDYXNlKCk7XG4gICAgICAgICAgICAgICAgICAgICAgICByb3N0ZXJPYmpbdGVhbV0ubGVhZGVyc1tzdGF0XVtpXVsxXSA9IHJvc3Rlck9ialt0ZWFtXS5yb3N0ZXJbcGxheWVyXS5sbi50b1VwcGVyQ2FzZSgpO1xuICAgICAgICAgICAgICAgICAgICAgICAgcm9zdGVyT2JqW3RlYW1dLmxlYWRlcnNbc3RhdF1baV1bMl0gPSByb3N0ZXJPYmpbdGVhbV0ucm9zdGVyW3BsYXllcl0uc3RhdHNbc3RhdF07XG4gICAgICAgICAgICAgICAgICAgICAgICByb3N0ZXJPYmpbdGVhbV0ubGVhZGVyc1tzdGF0XVtpXVszXSA9IHJvc3Rlck9ialt0ZWFtXS5yb3N0ZXJbcGxheWVyXS5waWQ7XG4gICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICAgICAgfSBlbHNlIGlmIChyb3N0ZXJPYmpbdGVhbV0ucm9zdGVyW3BsYXllcl0uc3RhdHNbc3RhdF0gPiByb3N0ZXJPYmpbdGVhbV0ubGVhZGVyc1tzdGF0XVtpXVsyXSAmJiByb3N0ZXJPYmpbdGVhbV0ucm9zdGVyW3BsYXllcl0uc3RhdHNbc3RhdF0gPiAwKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICByb3N0ZXJPYmpbdGVhbV0ubGVhZGVyc1tzdGF0XVtpXVswXSA9IHJvc3Rlck9ialt0ZWFtXS5yb3N0ZXJbcGxheWVyXS5mbi50b1VwcGVyQ2FzZSgpO1xuICAgICAgICAgICAgICAgICAgICAgICAgcm9zdGVyT2JqW3RlYW1dLmxlYWRlcnNbc3RhdF1baV1bMV0gPSByb3N0ZXJPYmpbdGVhbV0ucm9zdGVyW3BsYXllcl0ubG4udG9VcHBlckNhc2UoKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJvc3Rlck9ialt0ZWFtXS5sZWFkZXJzW3N0YXRdW2ldWzJdID0gcm9zdGVyT2JqW3RlYW1dLnJvc3RlcltwbGF5ZXJdLnN0YXRzW3N0YXRdO1xuICAgICAgICAgICAgICAgICAgICAgICAgcm9zdGVyT2JqW3RlYW1dLmxlYWRlcnNbc3RhdF1baV1bM10gPSByb3N0ZXJPYmpbdGVhbV0ucm9zdGVyW3BsYXllcl0ucGlkO1xuICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9O1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxuICAgIGNvbnNvbGUubG9nKHJvc3Rlck9iaik7XG59O1xuXG5mdW5jdGlvbiBzdGF0c05vdEF2YWlsYWJsZShwaWQpIHtcbiAgICByb3N0ZXJPYmpbcGlkXS5zdGF0cyA9IHt9O1xuICAgIHJvc3Rlck9ialtwaWRdLnN0YXRzLnNhID0gW3t9XTtcbiAgICByb3N0ZXJPYmpbcGlkXS5zdGF0cy5oYXNTdGF0cyA9IGZhbHNlO1xuICAgIHZhciBjYUluZGV4ID0gWydncCcsICdncycsICdtaW4nLCAnZmdwJywgJ3RwcCcsICdmdHAnLCAnb3JlYicsICdkcmViJywgJ3JlYicsICdhc3QnLCAnc3RsJywgJ2JsaycsICd0b3YnLCAncGYnLCAncHRzJywgJ25vc3RhdHMnXTtcbiAgICB2YXIgc2FJbmRleCA9IFsndGlkJywgJ3ZhbCcsICdncCcsICdncycsICdtaW4nLCAnZmdwJywgJ3RwcCcsICdmdHAnLCAnb3JlYicsICdkcmViJywgJ3JlYicsICdhc3QnLCAnc3RsJywgJ2JsaycsICd0b3YnLCAncGYnLCAncHRzJywgJ3NwbCcsICd0YScsICd0bicsICd0YyddO1xuICAgIGZvciAodmFyIGkgPSAwOyBpIDwgc2FJbmRleC5sZW5ndGg7IGkrKykge1xuICAgICAgICByb3N0ZXJPYmpbcGlkXS5zdGF0cy5zYVswXVtzYUluZGV4W2ldXSA9IFwiTi9BXCI7XG4gICAgICAgIGlmIChpID09PSAxKSB7XG4gICAgICAgICAgICByb3N0ZXJPYmpbcGlkXS5zdGF0cy5zYVswXVtzYUluZGV4W2ldXSA9IHBsYXllckNhcmRZZWFyLnRvU3RyaW5nKCkuc3Vic3RyKDIsIDIpICsgXCItXCIgKyAocGxheWVyQ2FyZFllYXIgKyAxKS50b1N0cmluZygpLnN1YnN0cigyLCAyKTtcbiAgICAgICAgfVxuICAgICAgICBpZiAoaSA9PT0gMTcpIHtcbiAgICAgICAgICAgIHJvc3Rlck9ialtwaWRdLnN0YXRzLnNhWzBdW3NhSW5kZXhbaV1dID0gW107XG4gICAgICAgIH1cbiAgICAgICAgaWYgKGkgPT09IDE4KSB7XG4gICAgICAgICAgICByb3N0ZXJPYmpbcGlkXS5zdGF0cy5zYVswXVtzYUluZGV4W2ldXSA9ICdCT1MnO1xuICAgICAgICB9XG4gICAgfVxuICAgIGZvciAodmFyIGkgPSAwOyBpIDwgY2FJbmRleC5sZW5ndGg7IGkrKykge1xuICAgICAgICByb3N0ZXJPYmpbcGlkXS5zdGF0c1tjYUluZGV4W2ldXSA9IFwiTi9BXCI7XG4gICAgICAgIGlmIChpID09PSAxNSkge1xuICAgICAgICAgICAgcm9zdGVyT2JqW3BpZF0uc3RhdHNbY2FJbmRleFtpXV0gPSB0cnVlO1xuICAgICAgICB9XG4gICAgfVxufTtcblxuZnVuY3Rpb24gbG9hZEdhbWVEZXRhaWwoZ2lkKSB7fTtcblxuZnVuY3Rpb24gbG9hZEF3YXlUZWFtRGF0YSgpIHt9XG4vKj09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbj0gICAgICAgICAgICBSSUdIVCBXUkFQICAgICAgICAgICAgPVxuPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PSovXG5mdW5jdGlvbiBwbGF5ZXJTcG90bGlnaHQocm9zdGVyT2JqLCBwbGF5ZXJTcG90bGlnaHRDb3VudGVyKSB7XG4gICAgLyogMSAtIFdISVRFIExJTkUgSE9SSVpUT05BTCAqL1xuICAgIHNldFRpbWVvdXQoZnVuY3Rpb24oKSB7XG4gICAgICAgICQoJy53aGl0ZS1saW5lLmhvcml6b250YWwnKS5hZGRDbGFzcygndHJhbnNpdGlvbi0xJyk7XG4gICAgfSwgNTAwKTtcbiAgICBzZXRUaW1lb3V0KGZ1bmN0aW9uKCkge1xuICAgICAgICAkKCcuc29jaWFsLXRvcCAud2hpdGUtbGluZS52ZXJ0aWNhbDpudGgtY2hpbGQob2RkKScpLmFkZENsYXNzKCd0cmFuc2l0aW9uLTEnKTtcbiAgICAgICAgJCgnLnNvY2lhbC1ib3R0b20gLndoaXRlLWxpbmUudmVydGljYWw6bnRoLWNoaWxkKGV2ZW4pJykuYWRkQ2xhc3MoJ3RyYW5zaXRpb24tMScpO1xuICAgIH0sIDgwMCk7XG4gICAgLyogMmIgLSBXSElURSBMSU5FIFZFUlRJQ0FMICovXG4gICAgc2V0VGltZW91dChmdW5jdGlvbigpIHtcbiAgICAgICAgJCgnLnNvY2lhbC10b3AgLndoaXRlLWxpbmUudmVydGljYWw6bnRoLWNoaWxkKGV2ZW4pJykuYWRkQ2xhc3MoJ3RyYW5zaXRpb24tMScpO1xuICAgICAgICAkKCcuc29jaWFsLWJvdHRvbSAud2hpdGUtbGluZS52ZXJ0aWNhbDpudGgtY2hpbGQob2RkKScpLmFkZENsYXNzKCd0cmFuc2l0aW9uLTEnKTtcbiAgICB9LCAxMDAwKTtcbiAgICAvKiAzIC0gR0VORVJBVEUgQU5EIFJFVkVBTCBQTEFZRVIgQk9YRVMgKi9cbiAgICBzZXRUaW1lb3V0KGZ1bmN0aW9uKCkge1xuICAgICAgICAkKCcuc29jaWFsLXRvcCwgLnNvY2lhbC1ib3R0b20nKS5hZGRDbGFzcygndHJhbnNpdGlvbi0xJyk7XG4gICAgICAgICQoJy5wbGF5ZXItYm94LXdyYXAnKS5hZGRDbGFzcygndHJhbnNpdGlvbi0xJyk7XG4gICAgfSwgMTIwMCk7XG4gICAgLyogNCAtIEFQUEVORCBIRUFEU0hPVFMgKi9cbiAgICBzZXRUaW1lb3V0KGZ1bmN0aW9uKCkge1xuICAgICAgICAkKCcucGxheWVyLWJveC13cmFwJykuYWRkQ2xhc3MoJ3RyYW5zaXRpb24tMicpO1xuICAgICAgICAkKCcucGxheWVyLWJveCcpLmFkZENsYXNzKCd0cmFuc2l0aW9uLTEnKTtcbiAgICAgICAgdmFyIGRlbGF5ID0gMDtcbiAgICAgICAgdmFyIGZvcmluQ291bnRlciA9IDA7XG4gICAgICAgIGZvciAodmFyIHBsYXllciBpbiByb3N0ZXJPYmouY2VsdGljcy5yb3N0ZXIpIHtcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKHBsYXllcik7XG4gICAgICAgICAgICB2YXIgaGVhZHNob3QgPSAnaHR0cHM6Ly9hay1zdGF0aWMuY21zLm5iYS5jb20vd3AtY29udGVudC91cGxvYWRzL2hlYWRzaG90cy9uYmEvbGF0ZXN0LzEwNDB4NzYwLycgKyByb3N0ZXJPYmouY2VsdGljcy5yb3N0ZXJbcGxheWVyXS5waWQgKyAnLnBuZyc7XG4gICAgICAgICAgICAkKCcucGxheWVyLWJveDpudGgtY2hpbGQoJyArIChmb3JpbkNvdW50ZXIgKyAxKSArICcpJykuYXBwZW5kKCc8aW1nIGNsYXNzPVwiYXBwZW5kZWQgaGVhZHNob3RcIiBzcmM9XCInICsgaGVhZHNob3QgKyAnXCIvPicpO1xuICAgICAgICAgICAgJCgnLnBsYXllci1ib3g6bnRoLWNoaWxkKCcgKyAoZm9yaW5Db3VudGVyICsgMSkgKyAnKScpLmF0dHIoJ2RhdGEtcGlkJywgcm9zdGVyT2JqLmNlbHRpY3Mucm9zdGVyW3BsYXllcl0ucGlkKTtcbiAgICAgICAgICAgICQoJy5wbGF5ZXItYm94IGltZycpLm9uKFwiZXJyb3JcIiwgZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICAgICAgJCh0aGlzKS5hdHRyKCdzcmMnLCAnaHR0cHM6Ly9pLmNkbi50dXJuZXIuY29tL25iYS9uYmEvLmVsZW1lbnQvbWVkaWEvMi4wL3RlYW1zaXRlcy9jZWx0aWNzL21lZGlhL2dlbmVyaWMtcGxheWVyLWxpZ2h0XzYwMHg0MzgucG5nJyk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICQoJy5wbGF5ZXItYm94Om50aC1jaGlsZCgnICsgKGZvcmluQ291bnRlciArIDEpICsgJykgaW1nJykuZGVsYXkoZGVsYXkpLmZhZGVUbygzMDAsIDEpO1xuICAgICAgICAgICAgZGVsYXkgKz0gMzA7XG4gICAgICAgICAgICBmb3JpbkNvdW50ZXIrKztcbiAgICAgICAgfVxuICAgIH0sIDEzMDApO1xuICAgIC8qIDUgLSBQTEFZRVIgU0VMRUNUICovXG4gICAgdmFyIHNlbGVjdGVkUGxheWVyID0gJyc7XG4gICAgc2V0VGltZW91dChmdW5jdGlvbigpIHtcbiAgICAgICAgJCgnLnBsYXllci1ib3gnKS5hZGRDbGFzcygndHJhbnNpdGlvbi0yJyk7XG4gICAgICAgICQoJy5wbGF5ZXItYm94Om50aC1jaGlsZCgnICsgKHBsYXllclNwb3RsaWdodENvdW50ZXIgKyAxKSArICcpJykuYWRkQ2xhc3MoJ3NlbGVjdGVkJyk7XG4gICAgICAgIHNlbGVjdGVkUGxheWVyID0gJCgnLnBsYXllci1ib3g6bnRoLWNoaWxkKCcgKyAocGxheWVyU3BvdGxpZ2h0Q291bnRlciArIDEpICsgJyknKS5hdHRyKCdkYXRhLXBpZCcpO1xuICAgICAgICBjb25zb2xlLmxvZyhzZWxlY3RlZFBsYXllcik7XG4gICAgICAgICQoJy5wbGF5ZXItYm94Jykubm90KCcucmVwbGFjZW1lbnQuc2VsZWN0ZWQnKS5kZWxheSg1MDApLmFkZENsYXNzKCd0cmFuc2l0aW9uLTQnKTtcbiAgICB9LCAyMDAwKTtcbiAgICAvKiA2IC0gUExBWUVSIEJPWCBFWFBBTkQgKi9cbiAgICBzZXRUaW1lb3V0KGZ1bmN0aW9uKCkge1xuICAgICAgICAkKCcuYmxvY2std3JhcC5zb2NpYWwnKS5hZGRDbGFzcygndHJhbnNpdGlvbi0zJyk7XG4gICAgICAgICQoJy5wbGF5ZXItYm94LnJlcGxhY2VtZW50LnNlbGVjdGVkJykuYWRkQ2xhc3MoJ3RyYW5zaXRpb24tMycpO1xuICAgIH0sIDMwMDApO1xuICAgIC8qIDcgLSBTUE9UTElHSFQgSFRNTCAqL1xuICAgIHNldFRpbWVvdXQoZnVuY3Rpb24oKSB7XG4gICAgICAgIGdlbmVyYXRlVGltZWxpbmUoc2VsZWN0ZWRQbGF5ZXIpO1xuICAgICAgICAkKCcucGxheWVyLWJveC5yZXBsYWNlbWVudC5zZWxlY3RlZCcpLmNsb25lKCkuYXBwZW5kVG8oJy5ibG9jay13cmFwLnBsYXllci1zcG90bGlnaHQgLnRvcC13cmFwJyk7XG4gICAgICAgICQoJy5wbGF5ZXItc3BvdGxpZ2h0IC5zZWxlY3RlZCcpLmFkZENsYXNzKCcuYXBwZW5kZWQnKTtcbiAgICAgICAgJCgnLmJsb2NrLXdyYXAucGxheWVyLXNwb3RsaWdodCcpLmFkZENsYXNzKCd0cmFuc2l0aW9uLTEnKTtcbiAgICAgICAgJCgnLmJsb2NrLXdyYXAuc29jaWFsJykuYWRkQ2xhc3MoJ3RyYW5zaXRpb24tMScpO1xuICAgICAgICB2YXIgc3RhdHMgPSByb3N0ZXJPYmouY2VsdGljcy5yb3N0ZXJbc2VsZWN0ZWRQbGF5ZXJdLnN0YXRzO1xuICAgICAgICAkKCcucGxheWVyLXNwb3RsaWdodCAudG9wLXdyYXAgLnBsYXllci10b3AnKS5hcHBlbmQoJzxpbWcgY2xhc3M9XCJzaWxvIGFwcGVuZGVkXCIgc3JjPVwiaHR0cDovL2lvLmNubi5uZXQvbmJhL25iYS8uZWxlbWVudC9tZWRpYS8yLjAvdGVhbXNpdGVzL2NlbHRpY3MvbWVkaWEvc2lsby00NjZ4NTkxLScgKyByb3N0ZXJPYmouY2VsdGljcy5yb3N0ZXJbc2VsZWN0ZWRQbGF5ZXJdLnBpZCArICcucG5nXCIgLz48ZGl2IGNsYXNzPVwidG9wIGFwcGVuZGVkXCI+PGRpdiBjbGFzcz1cInBsYXllci1uYW1lLXdyYXBcIj48cCBjbGFzcz1cInBsYXllci1uYW1lXCI+PHNwYW4+JyArIHJvc3Rlck9iai5jZWx0aWNzLnJvc3RlcltzZWxlY3RlZFBsYXllcl0uZm4udG9VcHBlckNhc2UoKSArICc8L3NwYW4+IDxicj4gJyArIHJvc3Rlck9iai5jZWx0aWNzLnJvc3RlcltzZWxlY3RlZFBsYXllcl0ubG4udG9VcHBlckNhc2UoKSArICc8L3A+PC9kaXY+PHAgY2xhc3M9XCJwbGF5ZXItbnVtYmVyXCI+JyArIHJvc3Rlck9iai5jZWx0aWNzLnJvc3RlcltzZWxlY3RlZFBsYXllcl0ubnVtICsgJzwvYnI+PHNwYW4+JyArIHJvc3Rlck9iai5jZWx0aWNzLnJvc3RlcltzZWxlY3RlZFBsYXllcl0ucG9zICsgJzwvc3Bhbj48L3A+PC9kaXY+PGRpdiBjbGFzcz1cIm1pZGRsZSBhcHBlbmRlZFwiPjx1bCBjbGFzcz1cImluZm8gY2xlYXJmaXhcIj48bGk+PHA+QUdFPHNwYW4gY2xhc3M9XCJzbS1oaWRlXCI+OiZuYnNwOzwvc3Bhbj4gPC9icj48c3BhbiBjbGFzcz1cImluZm8tdmFsdWVcIj4nICsgcGxheWVyQWdlKHJvc3Rlck9iai5jZWx0aWNzLnJvc3RlcltzZWxlY3RlZFBsYXllcl0uZG9iKSArICc8L3NwYW4+PC9wPjwvbGk+PGxpPjxwPkhUPHNwYW4gY2xhc3M9XCJzbS1oaWRlXCI+OiZuYnNwOzwvc3Bhbj4gPC9icj48c3BhbiBjbGFzcz1cImluZm8tdmFsdWVcIj4nICsgcm9zdGVyT2JqLmNlbHRpY3Mucm9zdGVyW3NlbGVjdGVkUGxheWVyXS5odCArICc8L3NwYW4+PC9wPjwvbGk+PGxpPjxwPldUPHNwYW4gY2xhc3M9XCJzbS1oaWRlXCI+OiZuYnNwOzwvc3Bhbj4gPC9icj48c3BhbiBjbGFzcz1cImluZm8tdmFsdWVcIj4nICsgcm9zdGVyT2JqLmNlbHRpY3Mucm9zdGVyW3NlbGVjdGVkUGxheWVyXS53dCArICc8L3NwYW4+PC9wPjwvbGk+PC91bD48L2Rpdj48ZGl2IGNsYXNzPVwiYm90dG9tIGZ1bGwgY2xlYXJmaXggc20taGlkZSBhcHBlbmRlZFwiPjx0YWJsZSBjbGFzcz1cImF2ZXJhZ2VzXCI+PHRyIGNsYXNzPVwiYXZlcmFnZXMtbGFiZWxzXCI+PHRkPjxwPkdQPC9wPjwvdGQ+PHRkPjxwPlBQRzwvcD48L3RkPjx0ZD48cD5SUEc8L3A+PC90ZD48dGQ+PHA+QVBHPC9wPjwvdGQ+PC90cj48dHIgY2xhc3M9XCJhdmVyYWdlcy1zZWFzb25cIj48dGQgY2xhc3M9XCJncFwiPjxwPjwvcD48L3RkPjx0ZCBjbGFzcz1cInB0c1wiPjxwPjwvcD48L3RkPjx0ZCBjbGFzcz1cInJlYlwiPjxwPjwvcD48L3RkPjx0ZCBjbGFzcz1cImFzdFwiPjxwPjwvcD48L3RkPjwvdHI+PC90YWJsZT48L2Rpdj4nKTtcbiAgICAgICAgJChcIi5wbGF5ZXItc3BvdGxpZ2h0IC5hdmVyYWdlcy1zZWFzb25cIikuaHRtbCgnPHRkPjxwPicgKyBzdGF0cy5zYVswXS5ncCArICc8L3A+PC90ZD48dGQ+PHA+JyArIHN0YXRzLnNhWzBdLnB0cyArICc8L3A+PC90ZD48dGQ+PHA+JyArIHN0YXRzLnNhWzBdLnJlYiArICc8L3A+PC90ZD48dGQ+PHA+JyArIHN0YXRzLnNhWzBdLmFzdCArICc8L3A+PC90ZD4nKTtcbiAgICAgICAgJCgnLnBsYXllci1zcG90bGlnaHQgLnBsYXllci1uYW1lJykuZmFkZVRvKDIwMCwgMSk7XG4gICAgICAgIHZhciBwbGF5ZXJGYWN0cyA9IHJvc3Rlck9iai5jZWx0aWNzLnJvc3RlcltzZWxlY3RlZFBsYXllcl0uYmlvLnBlcnNvbmFsO1xuICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IDM7IGkrKykge1xuICAgICAgICAgICAgdmFyIGZhY3RJbmRleCA9IE1hdGguZmxvb3IoTWF0aC5yYW5kb20oKSAqIHBsYXllckZhY3RzLmxlbmd0aCk7XG4gICAgICAgICAgICAkKCcucGxheWVyLXNwb3RsaWdodCAuYm90dG9tLXdyYXAnKS5hcHBlbmQoJzxkaXYgY2xhc3M9XCJkeWstYm94IGFwcGVuZGVkXCI+PHA+JyArIHBsYXllckZhY3RzW2ZhY3RJbmRleF0gKyAnPC9wPjwvZGl2PicpO1xuICAgICAgICB9O1xuICAgICAgICAkKCcucGxheWVyLXNwb3RsaWdodCAuYm90dG9tLXdyYXAnKS5hZGRDbGFzcygndHJhbnNpdGlvbi0xJyk7XG4gICAgICAgIHNldFRpbWVvdXQoZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICAkKCcucGxheWVyLXNwb3RsaWdodCAuYm90dG9tLXdyYXAgLmR5ay1ib3g6bnRoLW9mLXR5cGUoMiknKS5hZGRDbGFzcygndHJhbnNpdGlvbi0yJyk7XG4gICAgICAgICAgICAkKCcucGxheWVyLXNwb3RsaWdodCAuYm90dG9tLXdyYXAgLmR5ay1ib3g6bnRoLW9mLXR5cGUoMyknKS5hZGRDbGFzcygndHJhbnNpdGlvbi0xJyk7XG4gICAgICAgIH0sIDEwMDApO1xuICAgICAgICBzZXRUaW1lb3V0KGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgJCgnLnBsYXllci1zcG90bGlnaHQgLmJvdHRvbS13cmFwIC5keWstYm94Om50aC1vZi10eXBlKDMpJykuYWRkQ2xhc3MoJ3RyYW5zaXRpb24tMicpO1xuICAgICAgICAgICAgJCgnLnBsYXllci1zcG90bGlnaHQgLmJvdHRvbS13cmFwIC5keWstYm94Om50aC1vZi10eXBlKDQpJykuYWRkQ2xhc3MoJ3RyYW5zaXRpb24tMScpO1xuICAgICAgICB9LCAxNTAwKTtcbiAgICB9LCAzNjAwKTtcbiAgICAvKiA4IC0gU1BPVExJR0hUIFNMSURFIElOICovXG4gICAgc2V0VGltZW91dChmdW5jdGlvbigpIHtcbiAgICAgICAgJCgnLnBsYXllci1zcG90bGlnaHQgLnBsYXllci10b3AgLnBsYXllci1uYW1lLCAucGxheWVyLXNwb3RsaWdodCAucGxheWVyLW5hbWUtd3JhcCwgLnBsYXllci1zcG90bGlnaHQgLmhlYWRzaG90LCAucGxheWVyLXNwb3RsaWdodCAuaW5mbywgLnBsYXllci1zcG90bGlnaHQgLnNpbG8sIC5wbGF5ZXItc3BvdGxpZ2h0IC5hdmVyYWdlcywgLnBsYXllci1zcG90bGlnaHQgLnBsYXllci1udW1iZXInKS5hZGRDbGFzcygndHJhbnNpdGlvbi0xJyk7XG4gICAgICAgIHNldFRpbWVvdXQoZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICAkKCcuYmxvY2std3JhcC5wbGF5ZXItc3BvdGxpZ2h0IC5wbGF5ZXItYm94JykucmVtb3ZlKCk7XG4gICAgICAgIH0sIDQwMDApO1xuICAgICAgICBpZiAocGxheWVyU3BvdGxpZ2h0Q291bnRlciA8IDE2KSB7XG4gICAgICAgICAgICBwbGF5ZXJTcG90bGlnaHRDb3VudGVyKys7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBwbGF5ZXJTcG90bGlnaHRDb3VudGVyID0gMDtcbiAgICAgICAgfVxuICAgIH0sIDQxMDApO1xuICAgIC8qIDkgLSBTUE9UTElHSFQgU0xJREUgT1VUICovXG4gICAgc2V0VGltZW91dChmdW5jdGlvbigpIHtcbiAgICAgICAgJCgnLnBsYXllci1zcG90bGlnaHQgLmJvdHRvbS13cmFwLCAucGxheWVyLXNwb3RsaWdodCAudG9wLXdyYXAnKS5hZGRDbGFzcygndHJhbnNpdGlvbi0yJyk7XG4gICAgfSwgNjAwMCk7XG4gICAgLyogMTAgLSBET05FLiBSRU1PVkUgVEhBVCBTSElUICovXG4gICAgc2V0VGltZW91dChmdW5jdGlvbigpIHtcbiAgICAgICAgJCgnLmFwcGVuZGVkJykucmVtb3ZlKCk7XG4gICAgICAgICQoJy50cmFuc2l0aW9uLCAudHJhbnNpdGlvbi0xLCAudHJhbnNpdGlvbi0yLCAudHJhbnNpdGlvbi0zLCAudHJhbnNpdGlvbi00JykucmVtb3ZlQ2xhc3MoJ3RyYW5zaXRpb24gdHJhbnNpdGlvbi0xIHRyYW5zaXRpb24tMiB0cmFuc2l0aW9uLTMgdHJhbnNpdGlvbi00Jyk7XG4gICAgfSwgNzAwMCk7XG59XG5cbmZ1bmN0aW9uIGxlYWRlcnMoZ2lkLCBnYW1lU3RhcnRlZCkge1xuICAgIHZhciBnYW1lRGV0YWlsID0gJyc7XG4gICAgdmFyIGRldGFpbEF2YWlsYWJsZSA9IGZhbHNlO1xuICAgIGdhbWVTdGFydGVkID0gdHJ1ZTsgLy8gRE86IERFTEVURSBUSElTIFdIRU4gT05MSU5FLiBKVVNUIEZPUiBURVNUSU5HIFBVUlBPU0VTIFJOXG4gICAgaWYgKGdhbWVTdGFydGVkKSB7XG4gICAgICAgICQuYWpheCh7XG4gICAgICAgICAgICB1cmw6ICdodHRwOi8vbG9jYWxob3N0Ojg4ODgvZGF0YS9tb2JpbGUtc3RhdHMtZmVlZC9nYW1lZGV0YWlsLmpzb24nLFxuICAgICAgICAgICAgYXN5bmM6IGZhbHNlLFxuICAgICAgICAgICAgc3VjY2VzczogZnVuY3Rpb24oZGF0YSkge1xuICAgICAgICAgICAgICAgIC8vIERPOiBVUERBVEUgVEhFIExFQURFUiBPQkpFQ1RTXG4gICAgICAgICAgICAgICAgZ2FtZURldGFpbCA9IGRhdGE7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgIH1cbiAgICBmb3IgKHZhciB0ZWFtIGluIHJvc3Rlck9iaikge1xuICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IDM7IGkrKykge1xuICAgICAgICAgICAgZm9yICh2YXIgc3RhdCBpbiByb3N0ZXJPYmpbdGVhbV0ubGVhZGVycykge1xuICAgICAgICAgICAgICAgIC8vIExFQURFUiBTVEFUIFZBTFVFXG4gICAgICAgICAgICAgICAgJCgnLmxlYWRlci1zZWN0aW9uOm50aC1vZi10eXBlKCcgKyAoaSArIDIpICsgJykgLicgKyBzdGF0ICsgJy4nICsgdGVhbSArICcgLnN0YXQnKS5hcHBlbmQoJzxzcGFuIGNsYXNzPVwiJyArIHJvc3Rlck9ialt0ZWFtXS50YSArICdcIj4nICsgcm9zdGVyT2JqW3RlYW1dLmxlYWRlcnNbc3RhdF1baV1bMl0gKyAnPC9zcGFuPiAnICsgc3RhdC50b1VwcGVyQ2FzZSgpKTtcbiAgICAgICAgICAgICAgICAvLyBMRUFERVIgTkFNRVxuICAgICAgICAgICAgICAgIGlmIChyb3N0ZXJPYmpbdGVhbV0ubGVhZGVyc1tzdGF0XVtpXVswXS5sZW5ndGggKyByb3N0ZXJPYmpbdGVhbV0ubGVhZGVyc1tzdGF0XVtpXVsxXS5sZW5ndGggPj0gMTUpIHtcbiAgICAgICAgICAgICAgICAgICAgcm9zdGVyT2JqW3RlYW1dLmxlYWRlcnNbc3RhdF1baV1bMF0gPSByb3N0ZXJPYmpbdGVhbV0ubGVhZGVyc1tzdGF0XVtpXVswXS5zdWJzdHIoMCwgMSkgKyAnLic7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICQoJy5sZWFkZXItc2VjdGlvbjpudGgtb2YtdHlwZSgnICsgKGkgKyAyKSArICcpIC4nICsgc3RhdCArICcuJyArIHRlYW0gKyAnIC5uYW1lJykuYXBwZW5kKCc8c3Bhbj4nICsgcm9zdGVyT2JqW3RlYW1dLmxlYWRlcnNbc3RhdF1baV1bMF0gKyAnPC9zcGFuPiAnICsgcm9zdGVyT2JqW3RlYW1dLmxlYWRlcnNbc3RhdF1baV1bMV0pO1xuICAgICAgICAgICAgICAgIC8vIExFQURFUiBIRUFEU0hPVFxuICAgICAgICAgICAgICAgICQoJy5sZWFkZXItc2VjdGlvbjpudGgtb2YtdHlwZSgnICsgKGkgKyAyKSArICcpIC4nICsgc3RhdCArICcuJyArIHRlYW0gKyAnIC5oZWFkc2hvdCcpLmF0dHIoJ3NyYycsICdodHRwczovL2FrLXN0YXRpYy5jbXMubmJhLmNvbS93cC1jb250ZW50L3VwbG9hZHMvaGVhZHNob3RzL25iYS9sYXRlc3QvMTA0MHg3NjAvJyArIHJvc3Rlck9ialt0ZWFtXS5sZWFkZXJzW3N0YXRdW2ldWzNdICsgJy5wbmcnKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cbiAgICB2YXIgdGltZUJldHdlZW4gPSAxMDAwO1xuICAgICQoJy5sZWFkZXJzLCAubGVhZGVycyAuYmxvY2staW5uZXInKS5hZGRDbGFzcygndHJhbnNpdGlvbi0xJyk7XG4gICAgc2V0VGltZW91dChmdW5jdGlvbigpIHtcbiAgICAgICAgJCgnLmxlYWRlcnMgLmxlYWRlci1zZWN0aW9uJykuYWRkQ2xhc3MoJ3RyYW5zaXRpb24tMScpO1xuICAgICAgICAkKCcubGVhZGVyLXN1YnNlY3Rpb24uYm90dG9tIHA6bnRoLW9mLXR5cGUoMSknKS5hZGRDbGFzcygndHJhbnNpdGlvbi0xJyk7XG4gICAgICAgICQoJy5sZWFkZXJzIC5sZWFkZXItc2VjdGlvbiAudW5kZXJsaW5lLCAubGVhZGVycyAubGVhZGVyLXN1YnNlY3Rpb24udG9wJykuYWRkQ2xhc3Mocm9zdGVyT2JqLmNlbHRpY3MudGEgKyAnLWJnJyk7XG4gICAgfSwgODAwKTtcbiAgICB2YXIgdHJhbnNpdGlvbkNvdW50ZXIgPSAxO1xuICAgIGZvciAobGV0IGkgPSAxOyBpIDw9IDY7IGkrKykge1xuICAgICAgICBzZXRUaW1lb3V0KGZ1bmN0aW9uKG51bWJlclN0cmluZykge1xuICAgICAgICAgICAgJCgnLmxlYWRlcnMgLmxlYWRlci1zZWN0aW9uIC5sZWFkZXItc3RhdC13cmFwJykuYWRkQ2xhc3MoJ3RyYW5zaXRpb24tJyArIGkpO1xuICAgICAgICAgICAgJCgnLmxlYWRlcnMgLmxlYWRlci1zZWN0aW9uIC51bmRlcmxpbmUsIC5sZWFkZXJzIC5sZWFkZXItc3Vic2VjdGlvbi50b3AnKS5yZW1vdmVDbGFzcyhyb3N0ZXJPYmouY2VsdGljcy50YSArICctYmcnKTtcbiAgICAgICAgICAgICQoJy5sZWFkZXJzIC5sZWFkZXItc2VjdGlvbiAudW5kZXJsaW5lLCAubGVhZGVycyAubGVhZGVyLXN1YnNlY3Rpb24udG9wJykuYWRkQ2xhc3Mocm9zdGVyT2JqLmF3YXkudGEgKyAnLWJnJyk7XG4gICAgICAgICAgICBpZiAodHJhbnNpdGlvbkNvdW50ZXIgJSAyID09IDApIHtcbiAgICAgICAgICAgICAgICBzZXRUaW1lb3V0KGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgICAgICAgICAkKCcubGVhZGVycyAubGVhZGVyLXNlY3Rpb24gLnVuZGVybGluZSwgLmxlYWRlcnMgLmxlYWRlci1zdWJzZWN0aW9uLnRvcCcpLnJlbW92ZUNsYXNzKHJvc3Rlck9iai5hd2F5LnRhICsgJy1iZycpO1xuICAgICAgICAgICAgICAgICAgICAkKCcubGVhZGVycyAubGVhZGVyLXNlY3Rpb24gLnVuZGVybGluZSwgLmxlYWRlcnMgLmxlYWRlci1zdWJzZWN0aW9uLnRvcCcpLmFkZENsYXNzKHJvc3Rlck9iai5jZWx0aWNzLnRhICsgJy1iZycpO1xuICAgICAgICAgICAgICAgICAgICAkKCcubGVhZGVyLXN1YnNlY3Rpb24uYm90dG9tIHAnKS5yZW1vdmVDbGFzcygndHJhbnNpdGlvbi0xJyk7XG4gICAgICAgICAgICAgICAgICAgICQoJy5sZWFkZXJzIC5sZWFkZXItc2VjdGlvbiAudW5kZXJsaW5lJykuYWRkQ2xhc3MoJ3RyYW5zaXRpb24tJyArIChpIC8gMikpO1xuICAgICAgICAgICAgICAgICAgICAkKCcubGVhZGVyLXN1YnNlY3Rpb24uYm90dG9tIHA6bnRoLW9mLXR5cGUoJyArIChpIC0gKGkgLyAyKSArIDEpICsgJyknKS5hZGRDbGFzcygndHJhbnNpdGlvbi0xJyk7IC8vIGxvbFxuICAgICAgICAgICAgICAgIH0sIDIwMCk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICB0cmFuc2l0aW9uQ291bnRlcisrO1xuICAgICAgICB9LCAyMDAwICogaSk7XG4gICAgfVxufTtcblxuZnVuY3Rpb24gc29jaWFsKHJvc3Rlcikge307XG5cbmZ1bmN0aW9uIG1vYmlsZUFwcCgpIHtcbiAgICAkKCcuYXBwJykuc2hvdygpO1xufTtcbi8qPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG49ICAgICAgICAgICAgTEVGVCBXUkFQICAgICAgICAgICAgPVxuPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09Ki9cblxuZnVuY3Rpb24gbGVmdFdyYXAoKSB7XG4gICAgaWYgKCQoJy5sZWZ0LXdyYXAgLnN0YW5kaW5ncycpLmhhc0NsYXNzKCd0cmFuc2l0aW9uLTEnKSl7XG4gICAgICAgICQoJy5sZWZ0LXdyYXAgLnN0YW5kaW5ncycpLnJlbW92ZUNsYXNzKCd0cmFuc2l0aW9uLTEnKTtcbiAgICB9XG4gICAgZWxzZSB7XG4gICAgICAgICQoJy5sZWZ0LXdyYXAgLnN0YW5kaW5ncycpLmFkZENsYXNzKCd0cmFuc2l0aW9uLTEnKTtcbiAgICB9XG5cbiAgICBpZiAoJCgnLmxlZnQtd3JhcCAuc2NvcmVzLWFuZC1sZWFkZXJzJykuaGFzQ2xhc3MoJ3RyYW5zaXRpb24tMScpKXtcbiAgICAgICAgJCgnLmxlZnQtd3JhcCAuc2NvcmVzLWFuZC1sZWFkZXJzJykucmVtb3ZlQ2xhc3MoJ3RyYW5zaXRpb24tMScpO1xuICAgIH1cbiAgICBlbHNlIHtcbiAgICAgICAgJCgnLmxlZnQtd3JhcCAuc2NvcmVzLWFuZC1sZWFkZXJzJykuYWRkQ2xhc3MoJ3RyYW5zaXRpb24tMScpO1xuICAgIH1cbn1cblxuXG5mdW5jdGlvbiBzdGFuZGluZ3NJbml0KGF3YXlUZWFtKSB7XG4gICAgJC5hamF4KHtcbiAgICAgICAgdXJsOiAnaHR0cDovL2xvY2FsaG9zdDo4ODg4L2RhdGEvbW9iaWxlLXN0YXRzLWZlZWQvc3RhbmRpbmdzLmpzb24nLFxuICAgICAgICBhc3luYzogZmFsc2UsXG4gICAgICAgIHN1Y2Nlc3M6IGZ1bmN0aW9uKHN0YW5kaW5nc0RhdGEpIHtcbiAgICAgICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgc3RhbmRpbmdzRGF0YS5zdGEuY28ubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgICAgICBmb3IgKGxldCB4ID0gMDsgeCA8IHN0YW5kaW5nc0RhdGEuc3RhLmNvW2ldLmRpLmxlbmd0aDsgeCsrKSB7XG4gICAgICAgICAgICAgICAgICAgIGZvciAobGV0IHQgPSAwOyB0IDwgc3RhbmRpbmdzRGF0YS5zdGEuY29baV0uZGlbeF0udC5sZW5ndGg7IHQrKykge1xuICAgICAgICAgICAgICAgICAgICAgICAgdmFyIGNvbmZlcmVuY2VzID0gWycuZWFzdCcsICcud2VzdCddO1xuICAgICAgICAgICAgICAgICAgICAgICAgdmFyIHBsYWNlID0gc3RhbmRpbmdzRGF0YS5zdGEuY29baV0uZGlbeF0udFt0XS5zZWU7XG4gICAgICAgICAgICAgICAgICAgICAgICB2YXIgc2VlZCA9ICcnO1xuICAgICAgICAgICAgICAgICAgICAgICAgdmFyIGFjdGl2ZVN0YXR1cyA9ICcnO1xuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHN0YW5kaW5nc0RhdGEuc3RhLmNvW2ldLmRpW3hdLnRbdF0uc2VlIDw9IDgpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBzZWVkID0gc3RhbmRpbmdzRGF0YS5zdGEuY29baV0uZGlbeF0udFt0XS5zZWU7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoc3RhbmRpbmdzRGF0YS5zdGEuY29baV0uZGlbeF0udFt0XS50YSA9PSAnQk9TJykge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGFjdGl2ZVN0YXR1cyA9ICdhY3RpdmUnO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHN0YW5kaW5nc0RhdGEuc3RhLmNvW2ldLmRpW3hdLnRbdF0udGEgPT0gYXdheVRlYW0pIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBhY3RpdmVTdGF0dXMgPSAnYWN0aXZlLWF3YXknO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgdmFyIHJvd0hUTUwgPSAnPGRpdiBjbGFzcz1cInBsYWNlXCI+JyArIHNlZWQgKyAnPC9kaXY+PGRpdiBjbGFzcz1cImxvZ28td3JhcFwiPjxpbWcgY2xhc3M9XCJsb2dvXCIgc3JjPWh0dHA6Ly9pLmNkbi50dXJuZXIuY29tL25iYS9uYmEvYXNzZXRzL2xvZ29zL3RlYW1zL3ByaW1hcnkvd2ViLycgKyBzdGFuZGluZ3NEYXRhLnN0YS5jb1tpXS5kaVt4XS50W3RdLnRhICsgJy5zdmc+PC9kaXY+PGRpdiBjbGFzcz1cInRlYW0gKyAnICsgc3RhbmRpbmdzRGF0YS5zdGEuY29baV0uZGlbeF0udFt0XS50YSArICdcIj4nICsgc3RhbmRpbmdzRGF0YS5zdGEuY29baV0uZGlbeF0udFt0XS50YSArICc8L2Rpdj48ZGl2IGNsYXNzPVwid2luc1wiPicgKyBzdGFuZGluZ3NEYXRhLnN0YS5jb1tpXS5kaVt4XS50W3RdLncgKyAnPC9kaXY+PGRpdiBjbGFzcz1cImxvc3Nlc1wiPicgKyBzdGFuZGluZ3NEYXRhLnN0YS5jb1tpXS5kaVt4XS50W3RdLmwgKyAnPC9kaXY+PGRpdiBjbGFzcz1cImdhbWVzLWJlaGluZFwiPicgKyBzdGFuZGluZ3NEYXRhLnN0YS5jb1tpXS5kaVt4XS50W3RdLmdiICsgJzwvZGl2Pic7XG4gICAgICAgICAgICAgICAgICAgICAgICAkKGNvbmZlcmVuY2VzW2ldICsgJyA+IGRpdjpudGgtY2hpbGQoJyArIChwbGFjZSArIDEpICsgJyknKS5odG1sKHJvd0hUTUwpO1xuICAgICAgICAgICAgICAgICAgICAgICAgJChjb25mZXJlbmNlc1tpXSArICcgPiBkaXY6bnRoLWNoaWxkKCcgKyAocGxhY2UgKyAxKSArICcpJykuYWRkQ2xhc3MoYWN0aXZlU3RhdHVzKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH0pO1xufTtcblxuZnVuY3Rpb24gc2NvcmVzSW5pdCh0b2RheXNTY29yZXNEYXRhKSB7XG4gICAgdmFyIGxpdmVTY29yZXMgPSB0b2RheXNTY29yZXNEYXRhLmdzLmc7XG4gICAgaWYgKGxpdmVTY29yZXMubGVuZ3RoICE9IDApIHtcbiAgICAgICAgdmFyIHNlYXNvblR5cGUgPSAnJztcbiAgICAgICAgaWYgKGxpdmVTY29yZXNbMF0uZ2lkLnN1YnN0cigwLCAzKSA9PSAnMDAxJykge1xuICAgICAgICAgICAgc2Vhc29uVHlwZSA9ICdwcmUnO1xuICAgICAgICB9IGVsc2UgaWYgKGxpdmVTY29yZXNbMF0uZ2lkLnN1YnN0cigwLCAzKSA9PSAnMDA0Jykge1xuICAgICAgICAgICAgc2Vhc29uVHlwZSA9ICdwb3N0JztcbiAgICAgICAgfVxuICAgICAgICBpZiAobGl2ZVNjb3Jlcy5sZW5ndGggPiAxIHx8IChsaXZlU2NvcmVzLmxlbmd0aCA9PSAxICYmIGxpdmVTY29yZXNbMF0uaC50YSAhPSAnQk9TJykpIHtcbiAgICAgICAgICAgIHZhciBzdGF0dXNDb2RlcyA9IFsnMXN0IFF0cicsICcybmQgUXRyJywgJzNyZCBRdHInLCAnNHRoIFF0cicsICcxc3QgT1QnLCAnMm5kIE9UJywgJzNyZCBPVCcsICc0dGggT1QnLCAnNXRoIE9UJywgJzZ0aCBPVCcsICc3dGggT1QnLCAnOHRoIE9UJywgJzl0aCBPVCcsICcxMHRoIE9UJ107XG4gICAgICAgICAgICB2YXIgc2NvcmVzSFRNTCA9ICcnO1xuICAgICAgICAgICAgdmFyIGFkZGVkID0gMDtcbiAgICAgICAgICAgIGZvciAodmFyIGkgPSBsaXZlU2NvcmVzLmxlbmd0aCAtIDE7IGkgPj0gMDsgaS0tKSB7XG4gICAgICAgICAgICAgICAgaWYgKGxpdmVTY29yZXNbaV0uaC50YSAhPT0gJ0JPUycgJiYgaSA8IDExKSB7XG4gICAgICAgICAgICAgICAgICAgIGFkZGVkKys7XG4gICAgICAgICAgICAgICAgICAgIHZhciB2U2NvcmUgPSAnJztcbiAgICAgICAgICAgICAgICAgICAgdmFyIGhTY29yZSA9ICcnO1xuICAgICAgICAgICAgICAgICAgICBpZiAobGl2ZVNjb3Jlc1tpXS5zdCAhPSAxKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICB2U2NvcmUgPSBsaXZlU2NvcmVzW2ldLnYucztcbiAgICAgICAgICAgICAgICAgICAgICAgIGhTY29yZSA9IGxpdmVTY29yZXNbaV0uaC5zO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIHZhciBzVGV4dCA9IGxpdmVTY29yZXNbaV0uc3R0O1xuICAgICAgICAgICAgICAgICAgICBpZiAoc3RhdHVzQ29kZXMuaW5kZXhPZihsaXZlU2NvcmVzW2ldLnN0dCkgIT09IC0xKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBzVGV4dCA9IGxpdmVTY29yZXNbaV0uc3R0ICsgJyAtICcgKyBsaXZlU2NvcmVzW2ldLmNsO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIHNjb3Jlc0hUTUwgKz0gJzxkaXYgY2xhc3M9XCJzY29yZS13cmFwXCI+PGRpdiBjbGFzcz1cInNjb3JlLXN0YXR1c1wiPicgKyBzVGV4dCArICc8L2Rpdj48ZGl2IGNsYXNzPVwiJyArIGxpdmVTY29yZXNbaV0udi50YSArICdcIj48aW1nIHNyYz1cImh0dHA6Ly9zdGF0cy5uYmEuY29tL21lZGlhL2ltZy90ZWFtcy9sb2dvcy8nICsgbGl2ZVNjb3Jlc1tpXS52LnRhLnRvVXBwZXJDYXNlKCkgKyAnX2xvZ28uc3ZnXCI+ICcgKyBsaXZlU2NvcmVzW2ldLnYudGMudG9VcHBlckNhc2UoKSArICcgJyArIGxpdmVTY29yZXNbaV0udi50bi50b1VwcGVyQ2FzZSgpICsgJyA8ZGl2IGNsYXNzPVwic2NvcmUtbnVtXCI+JyArIHZTY29yZSArICc8L2Rpdj48L2Rpdj48ZGl2IGNsYXNzPVwiJyArIGxpdmVTY29yZXNbaV0uaC50YSArICdcIj48aW1nIHNyYz1cImh0dHA6Ly9zdGF0cy5uYmEuY29tL21lZGlhL2ltZy90ZWFtcy9sb2dvcy8nICsgbGl2ZVNjb3Jlc1tpXS5oLnRhLnRvVXBwZXJDYXNlKCkgKyAnX2xvZ28uc3ZnXCI+ICcgKyBsaXZlU2NvcmVzW2ldLmgudGMudG9VcHBlckNhc2UoKSArICcgJyArIGxpdmVTY29yZXNbaV0uaC50bi50b1VwcGVyQ2FzZSgpICsgJyA8ZGl2IGNsYXNzPVwic2NvcmUtbnVtXCI+JyArIGhTY29yZSArICc8L2Rpdj48L2Rpdj48L2Rpdj4nO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgICQoJy5zY29yZXMnKS5lbXB0eSgpLmFwcGVuZChzY29yZXNIVE1MKTtcbiAgICAgICAgfVxuICAgICAgICBpZiAoYWRkZWQgPCA1KXtcbiAgICAgICAgICAgICQoJy5sZWFndWUtbGVhZGVycycpLnNob3coKTtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICQoJy5sZWFndWUtbGVhZGVycycpLmhpZGUoKTtcbiAgICAgICAgfVxuICAgIH1cbn1cblxuZnVuY3Rpb24gdXBkYXRlTGVhZ3VlU2NvcmVzKHRvZGF5c1Njb3Jlc0RhdGEpIHtcbiAgICB2YXIgbGl2ZVNjb3JlcyA9IHRvZGF5c1Njb3Jlc0RhdGEuZ3MuZztcbiAgICBpZiAobGl2ZVNjb3Jlcy5sZW5ndGggIT0gMCkge1xuICAgICAgICB2YXIgc2Vhc29uVHlwZSA9ICdSZWd1bGFyK1NlYXNvbic7XG4gICAgICAgIGlmIChsaXZlU2NvcmVzWzBdLmdpZC5zdWJzdHIoMCwzKSA9PSAnMDAxJykge1xuICAgICAgICAgICAgc2Vhc29uVHlwZSA9ICdQcmUrU2Vhc29uJztcbiAgICAgICAgfVxuICAgICAgICBlbHNlIGlmIChsaXZlU2NvcmVzWzBdLmdpZC5zdWJzdHIoMCwzKSA9PSAnMDA0Jykge1xuICAgICAgICAgICAgc2Vhc29uVHlwZSA9ICdQbGF5b2Zmcyc7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKGxpdmVTY29yZXMubGVuZ3RoID4gMSB8fCAobGl2ZVNjb3Jlcy5sZW5ndGggPT0gMSAmJiBsaXZlU2NvcmVzWzBdLmgudGEgIT0gJ0JPUycpKSB7XG4gICAgICAgICAgICB2YXIgc3RhdHVzQ29kZXMgPSBbJzFzdCBRdHInLCcybmQgUXRyJywnM3JkIFF0cicsJzR0aCBRdHInLCcxc3QgT1QnLCcybmQgT1QnLCczcmQgT1QnLCc0dGggT1QnLCc1dGggT1QnLCc2dGggT1QnLCc3dGggT1QnLCc4dGggT1QnLCc5dGggT1QnLCcxMHRoIE9UJ107XG4gICAgICAgICAgICB2YXIgc2NvcmVzSFRNTCA9ICcnO1xuICAgICAgICAgICAgaWYgKCQoJy5hdGwtaGVhZGVyJykubGVuZ3RoID09PSAwKSB7XG4gICAgICAgICAgICAgICAgJCgnI2xlZnR3cmFwJykucHJlcGVuZCgnPGltZyBjbGFzcz1cImF0bC1oZWFkZXJcIiBzcmM9XCJodHRwOi8vaS5jZG4udHVybmVyLmNvbS9uYmEvbmJhLy5lbGVtZW50L21lZGlhLzIuMC90ZWFtc2l0ZXMvY2VsdGljcy9tZWRpYS9zaWduYWdlLWF0bC05NjB4MTM1LnBuZ1wiPicpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZm9yICh2YXIgaSA9IGxpdmVTY29yZXMubGVuZ3RoIC0gMTsgaSA+PSAwOyBpLS0pIHtcbiAgICAgICAgICAgICAgICBpZiAobGl2ZVNjb3Jlc1tpXS5oLnRhICE9PSAnQk9TJykge1xuICAgICAgICAgICAgICAgICAgICB2YXIgdlNjb3JlID0gJyc7XG4gICAgICAgICAgICAgICAgICAgIHZhciBoU2NvcmUgPSAnJztcbiAgICAgICAgICAgICAgICAgICAgaWYgKGxpdmVTY29yZXNbaV0uc3QgIT0gMSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgdlNjb3JlID0gbGl2ZVNjb3Jlc1tpXS52LnM7XG4gICAgICAgICAgICAgICAgICAgICAgICBoU2NvcmUgPSBsaXZlU2NvcmVzW2ldLmgucztcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB2YXIgc1RleHQgPSBsaXZlU2NvcmVzW2ldLnN0dDtcbiAgICAgICAgICAgICAgICAgICAgaWYgKHN0YXR1c0NvZGVzLmluZGV4T2YobGl2ZVNjb3Jlc1tpXS5zdHQpICE9PSAtMSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgc1RleHQgPSBsaXZlU2NvcmVzW2ldLnN0dCArICcgLSAnICsgbGl2ZVNjb3Jlc1tpXS5jbDtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICBzY29yZXNIVE1MICs9ICc8ZGl2IGNsYXNzPVwic2NvcmUtd3JhcFwiPjxkaXYgY2xhc3M9XCJzY29yZS1jb250YWluZXJcIj48ZGl2IGNsYXNzPVwiJyArIGxpdmVTY29yZXNbaV0udi50YSArICdcIj48aW1nIHNyYz1cImh0dHA6Ly9zdGF0cy5uYmEuY29tL21lZGlhL2ltZy90ZWFtcy9sb2dvcy8nICsgbGl2ZVNjb3Jlc1tpXS52LnRhLnRvVXBwZXJDYXNlKCkgKyAnX2xvZ28uc3ZnXCI+ICcgKyBsaXZlU2NvcmVzW2ldLnYudGMudG9VcHBlckNhc2UoKSArICcgJyArIGxpdmVTY29yZXNbaV0udi50bi50b1VwcGVyQ2FzZSgpICsgJyA8ZGl2IGNsYXNzPVwic2NvcmUtbnVtXCI+JyArIHZTY29yZSArICc8L2Rpdj48L2Rpdj48ZGl2IGNsYXNzPVwiJyArIGxpdmVTY29yZXNbaV0uaC50YSArICdcIj48aW1nIHNyYz1cImh0dHA6Ly9zdGF0cy5uYmEuY29tL21lZGlhL2ltZy90ZWFtcy9sb2dvcy8nICsgbGl2ZVNjb3Jlc1tpXS5oLnRhLnRvVXBwZXJDYXNlKCkgKyAnX2xvZ28uc3ZnXCI+ICcgKyBsaXZlU2NvcmVzW2ldLmgudGMudG9VcHBlckNhc2UoKSArICcgJyArIGxpdmVTY29yZXNbaV0uaC50bi50b1VwcGVyQ2FzZSgpICsgJyA8ZGl2IGNsYXNzPVwic2NvcmUtbnVtXCI+JyArIGhTY29yZSArICc8L2Rpdj48L2Rpdj48ZGl2IGNsYXNzPVwic2NvcmUtc3RhdHVzXCI+JyArIHNUZXh0ICsgJzwvZGl2PjwvZGl2PjwvZGl2Pic7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgJCgnLnNjb3JlcycpLmVtcHR5KCkuYXBwZW5kKHNjb3Jlc0hUTUwpO1xuICAgICAgICAgICAgbGVhZ3VlTGVhZGVycyhzZWFzb25UeXBlKTtcbiAgICAgICAgfVxuICAgIH1cbn1cblxuZnVuY3Rpb24gbGVhZ3VlTGVhZGVycygpe1xuICAgIHZhciBsZWFndWVMZWFkZXJzSFRNTCA9ICc8ZGl2IGNsYXNzPVwidGl0bGVcIj48cD5MRUFERVJTPC9wPjxwPlBUUzwvcD48cD5SRUI8L3A+PHA+QVNUPC9wPjxwPlNUTDwvcD48cD5CTEs8L3A+PC9kaXY+JztcbiAgICB2YXIgc3RhdFR5cGUgPSAnJztcbiAgICB2YXIgZGF0YUluZGV4ID0gW1wiUkFOS1wiLFwiUExBWUVSX0lEXCIsXCJQTEFZRVJcIixcIlRFQU1fSURcIixcIlRFQU1fQUJCUkVWSUFUSU9OXCJdO1xuXG4gICAgJC5hamF4KHtcbiAgICAgICAgdXJsOiAnaHR0cDovL2xvY2FsaG9zdDo4ODg4L2RhdGEvbGVhZ3VlX2xlYWRlcnMuanNvbicsXG4gICAgICAgIGFzeW5jOiBmYWxzZSxcbiAgICAgICAgc3VjY2VzczogZnVuY3Rpb24oZGF0YSkge1xuICAgICAgICAgICAgdmFyIGxlYWRlcnNEYXRhID0gZGF0YS5yZXN1bHRTZXRzO1xuICAgICAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBsZWFkZXJzRGF0YS5sZW5ndGg7IGkrKyl7XG4gICAgICAgICAgICAgICAgdmFyIGluZGV4ID0gY3JlYXRlSW5kZXgoZGF0YUluZGV4LCBsZWFkZXJzRGF0YVtpXS5oZWFkZXJzKTtcbiAgICAgICAgICAgICAgICB2YXIgcm93cyA9ICcnO1xuICAgICAgICAgICAgICAgIGZvciAobGV0IHggPSAwOyB4IDwgbGVhZGVyc0RhdGFbaV0ucm93U2V0Lmxlbmd0aDsgeCsrKXtcbiAgICAgICAgICAgICAgICAgICAgcm93cyArPSAnPGRpdiBjbGFzcz1cInJvd1wiPjxkaXYgY2xhc3M9XCJsZWZ0XCI+PGRpdiBjbGFzcz1cInBsYWNlXCI+JyArIGxlYWRlcnNEYXRhW2ldLnJvd1NldFt4XVswXSArICc8L2Rpdj48ZGl2IGNsYXNzPVwibG9nby13cmFwXCI+PGltZyBjbGFzcz1cImxvZ29cIiBzcmM9XCJodHRwOi8vc3RhdHMubmJhLmNvbS9tZWRpYS9pbWcvdGVhbXMvbG9nb3MvJyArIGxlYWRlcnNEYXRhW2ldLnJvd1NldFt4XVs0XSArICdfbG9nby5zdmdcIi8+PC9kaXY+PGRpdiBjbGFzcz1cIm5hbWVcIj4nICsgbGVhZGVyc0RhdGFbaV0ucm93U2V0W3hdWzJdLnRvVXBwZXJDYXNlKCkgKyAnPC9kaXY+PC9kaXY+PGRpdiBjbGFzcz1cInJpZ2h0XCI+PGRpdiBjbGFzcz1cInZhbHVlXCI+JyArIGxlYWRlcnNEYXRhW2ldLnJvd1NldFt4XVs4XSArICc8L2Rpdj48L2Rpdj48L2Rpdj4nO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBsZWFndWVMZWFkZXJzSFRNTCArPSAnPGRpdiBjbGFzcz1cImxlYWd1ZS1sZWFkZXJzLXdyYXBcIj4nICsgcm93cyArICc8L2Rpdj4nO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfSk7XG4gICAgJCgnLmxlYWd1ZS1sZWFkZXJzJykuZW1wdHkoKS5hcHBlbmQobGVhZ3VlTGVhZGVyc0hUTUwpO1xuICAgIHZhciBjb3VudGVyID0gMjtcbiAgICBzZXRJbnRlcnZhbChmdW5jdGlvbigpe1xuICAgICAgICBqUXVlcnkoJy5sZWFndWUtbGVhZGVycy13cmFwLCAubGVhZ3VlLWxlYWRlcnMgLnRpdGxlIHAnKS5yZW1vdmVDbGFzcygnYWN0aXZlJyk7XG4gICAgICAgIGpRdWVyeSgnLmxlYWd1ZS1sZWFkZXJzLXdyYXA6bnRoLW9mLXR5cGUoJyArIGNvdW50ZXIgKyAnKSwgLmxlYWd1ZS1sZWFkZXJzIC50aXRsZSBwOm50aC1vZi10eXBlKCcgKyBjb3VudGVyICsgJyknKS5hZGRDbGFzcygnYWN0aXZlJyk7XG4gICAgICAgIGlmIChjb3VudGVyID09IDYpIHtcbiAgICAgICAgICAgIGNvdW50ZXIgPSAyO1xuICAgICAgICB9XG4gICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgY291bnRlcisrO1xuICAgICAgICB9XG4gICAgfSwgNDAwMCk7XG59XG4iXX0=
