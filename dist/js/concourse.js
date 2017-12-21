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
                if (todaysScoresData.gs.g[i].h.ta == 'IND') {
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
            $('.scores').empty().append(scoresHTML);
        }
        if (liveScores.length < 5) {
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
}

},{}]},{},[1])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJzcmMvanMvY29uY291cnNlLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7QUNBQSxJQUFJLFlBQVk7QUFDWixhQUFTO0FBQ0wsZ0JBQVEsRUFESDtBQUVMLGlCQUFTO0FBQ0wsaUJBQUssQ0FDRCxDQUFDLElBQUQsRUFBTyxJQUFQLEVBQWEsSUFBYixFQUFtQixJQUFuQixDQURDLEVBRUQsQ0FBQyxJQUFELEVBQU8sSUFBUCxFQUFhLElBQWIsRUFBbUIsSUFBbkIsQ0FGQyxFQUdELENBQUMsSUFBRCxFQUFPLElBQVAsRUFBYSxJQUFiLEVBQW1CLElBQW5CLENBSEMsQ0FEQTtBQU1MLGlCQUFLLENBQ0QsQ0FBQyxJQUFELEVBQU8sSUFBUCxFQUFhLElBQWIsRUFBbUIsSUFBbkIsQ0FEQyxFQUVELENBQUMsSUFBRCxFQUFPLElBQVAsRUFBYSxJQUFiLEVBQW1CLElBQW5CLENBRkMsRUFHRCxDQUFDLElBQUQsRUFBTyxJQUFQLEVBQWEsSUFBYixFQUFtQixJQUFuQixDQUhDLENBTkE7QUFXTCxpQkFBSyxDQUNELENBQUMsSUFBRCxFQUFPLElBQVAsRUFBYSxJQUFiLEVBQW1CLElBQW5CLENBREMsRUFFRCxDQUFDLElBQUQsRUFBTyxJQUFQLEVBQWEsSUFBYixFQUFtQixJQUFuQixDQUZDLEVBR0QsQ0FBQyxJQUFELEVBQU8sSUFBUCxFQUFhLElBQWIsRUFBbUIsSUFBbkIsQ0FIQztBQVhBO0FBRkosS0FERztBQXFCWixVQUFNO0FBQ0YsZ0JBQVEsRUFETjtBQUVGLGlCQUFTO0FBQ0wsaUJBQUssQ0FDRCxDQUFDLElBQUQsRUFBTyxJQUFQLEVBQWEsSUFBYixFQUFtQixJQUFuQixDQURDLEVBRUQsQ0FBQyxJQUFELEVBQU8sSUFBUCxFQUFhLElBQWIsRUFBbUIsSUFBbkIsQ0FGQyxFQUdELENBQUMsSUFBRCxFQUFPLElBQVAsRUFBYSxJQUFiLEVBQW1CLElBQW5CLENBSEMs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RUEsTUFBRSxJQUFGLENBQU87QUFDSCxhQUFLLGdEQURGO0FBRUgsZUFBTyxLQUZKO0FBR0gsaUJBQVMsaUJBQVMsSUFBVCxFQUFlO0FBQ3BCLGdCQUFJLGNBQWMsS0FBSyxVQUF2QjtBQUNBLGlCQUFLLElBQUksSUFBSSxDQUFiLEVBQWdCLElBQUksWUFBWSxNQUFoQyxFQUF3QyxHQUF4QyxFQUE0QztBQUN4QyxvQkFBSSxRQUFRLFlBQVksU0FBWixFQUF1QixZQUFZLENBQVosRUFBZSxPQUF0QyxDQUFaO0FBQ0Esb0JBQUksT0FBTyxFQUFYO0FBQ0EscUJBQUssSUFBSSxJQUFJLENBQWIsRUFBZ0IsSUFBSSxZQUFZLENBQVosRUFBZSxNQUFmLENBQXNCLE1BQTFDLEVBQWtELEdBQWxELEVBQXNEO0FBQ2xELDRCQUFRLDJEQUEyRCxZQUFZLENBQVosRUFBZSxNQUFmLENBQXNCLENBQXRCLEVBQXlCLENBQXpCLENBQTNELEdBQXlGLGlHQUF6RixHQUE2TCxZQUFZLENBQVosRUFBZSxNQUFmLENBQXNCLENBQXRCLEVBQXlCLENBQXpCLENBQTdMLEdBQTJOLHNDQUEzTixHQUFvUSxZQUFZLENBQVosRUFBZSxNQUFmLENBQXNCLENBQXRCLEVBQXlCLENBQXpCLEVBQTRCLFdBQTVCLEVBQXBRLEdBQWdULG9EQUFoVCxHQUF1VyxZQUFZLENBQVosRUFBZSxNQUFmLENBQXNCLENBQXRCLEVBQXlCLENBQXpCLENBQXZXLEdBQXFZLG9CQUE3WTtBQUNIO0FBQ0QscUNBQXFCLHNDQUFzQyxJQUF0QyxHQUE2QyxRQUFsRTtBQUNIO0FBQ0o7QUFiRSxLQUFQO0FBZUEsTUFBRSxpQkFBRixFQUFxQixLQUFyQixHQUE2QixNQUE3QixDQUFvQyxpQkFBcEM7QUFDSCIsImZpbGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uIGUodCxuLHIpe2Z1bmN0aW9uIHMobyx1KXtpZighbltvXSl7aWYoIXRbb10pe3ZhciBhPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7aWYoIXUmJmEpcmV0dXJuIGEobywhMCk7aWYoaSlyZXR1cm4gaShvLCEwKTt2YXIgZj1uZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK28rXCInXCIpO3Rocm93IGYuY29kZT1cIk1PRFVMRV9OT1RfRk9VTkRcIixmfXZhciBsPW5bb109e2V4cG9ydHM6e319O3Rbb11bMF0uY2FsbChsLmV4cG9ydHMsZnVuY3Rpb24oZSl7dmFyIG49dFtvXVsxXVtlXTtyZXR1cm4gcyhuP246ZSl9LGwsbC5leHBvcnRzLGUsdCxuLHIpfXJldHVybiBuW29dLmV4cG9ydHN9dmFyIGk9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtmb3IodmFyIG89MDtvPHIubGVuZ3RoO28rKylzKHJbb10pO3JldHVybiBzfSkiLCJ2YXIgcm9zdGVyT2JqID0ge1xuICAgIGNlbHRpY3M6IHtcbiAgICAgICAgcm9zdGVyOiB7fSxcbiAgICAgICAgbGVhZGVyczoge1xuICAgICAgICAgICAgcHRzOiBbXG4gICAgICAgICAgICAgICAgWyctLScsICctLScsICctLScsICctLSddLFxuICAgICAgICAgICAgICAgIFsnLS0nLCAnLS0nLCAnLS0nLCAnLS0nXSxcbiAgICAgICAgICAgICAgICBbJy0tJywgJy0tJywgJy0tJywgJy0tJ11cbiAgICAgICAgICAgIF0sXG4gICAgICAgICAgICBhc3Q6IFtcbiAgICAgICAgICAgICAgICBbJy0tJywgJy0tJywgJy0tJywgJy0tJ10sXG4gICAgICAgICAgICAgICAgWyctLScsICctLScsICctLScsICctLSddLFxuICAgICAgICAgICAgICAgIFsnLS0nLCAnLS0nLCAnLS0nLCAnLS0nXVxuICAgICAgICAgICAgXSxcbiAgICAgICAgICAgIHJlYjogW1xuICAgICAgICAgICAgICAgIFsnLS0nLCAnLS0nLCAnLS0nLCAnLS0nXSxcbiAgICAgICAgICAgICAgICBbJy0tJywgJy0tJywgJy0tJywgJy0tJ10sXG4gICAgICAgICAgICAgICAgWyctLScsICctLScsICctLScsICctLSddXG4gICAgICAgICAgICBdXG4gICAgICAgIH1cbiAgICB9LFxuICAgIGF3YXk6IHtcbiAgICAgICAgcm9zdGVyOiB7fSxcbiAgICAgICAgbGVhZGVyczoge1xuICAgICAgICAgICAgcHRzOiBbXG4gICAgICAgICAgICAgICAgWyctLScsICctLScsICctLScsICctLSddLFxuICAgICAgICAgICAgICAgIFsnLS0nLCAnLS0nLCAnLS0nLCAnLS0nXSxcbiAgICAgICAgICAgICAgICBbJy0tJywgJy0tJywgJy0tJywgJy0tJ11cbiAgICAgICAgICAgIF0sXG4gICAgICAgICAgICBhc3Q6IFtcbiAgICAgICAgICAgICAgICBbJy0tJywgJy0tJywgJy0tJywgJy0tJ10sXG4gICAgICAgICAgICAgICAgWyctLScsICctLScsICctLScsICctLSddLFxuICAgICAgICAgICAgICAgIFsnLS0nLCAnLS0nLCAnLS0nLCAnLS0nXVxuICAgICAgICAgICAgXSxcbiAgICAgICAgICAgIHJlYjogW1xuICAgICAgICAgICAgICAgIFsnLS0nLCAnLS0nLCAnLS0nLCAnLS0nXSxcbiAgICAgICAgICAgICAgICBbJy0tJywgJy0tJywgJy0tJywgJy0tJ10sXG4gICAgICAgICAgICAgICAgWyctLScsICctLScsICctLScsICctLSddXG4gICAgICAgICAgICBdXG4gICAgICAgIH1cbiAgICB9XG59O1xuJChkb2N1bWVudCkucmVhZHkoZnVuY3Rpb24oKSB7XG4gICAgdmFyIGdpZCA9ICcnO1xuICAgIHZhciBhd2F5VGVhbSA9ICcnO1xuICAgIHZhciBnYW1lU3RhcnRlZCA9IGZhbHNlO1xuICAgIHZhciBwbGF5ZXJTcG90bGlnaHRDb3VudGVyID0gMTA7XG4gICAgdmFyIGRhdGUgPSBuZXcgRGF0ZSgpO1xuICAgIHZhciBsZWZ0V3JhcENvdW50ZXIgPSBmYWxzZTtcbiAgICAkLmFqYXgoe1xuICAgICAgICB1cmw6ICdodHRwOi8vbG9jYWxob3N0Ojg4ODgvZGF0YS9tb2JpbGUtc3RhdHMtZmVlZC90b2RheXNfc2NvcmVzLmpzb24nLFxuICAgICAgICBhc3luYzogZmFsc2UsXG4gICAgICAgIHN1Y2Nlc3M6IGZ1bmN0aW9uKHRvZGF5c1Njb3Jlc0RhdGEpIHtcbiAgICAgICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgdG9kYXlzU2NvcmVzRGF0YS5ncy5nLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICAgICAgaWYgKHRvZGF5c1Njb3Jlc0RhdGEuZ3MuZ1tpXS5oLnRhID09ICdJTkQnKSB7IC8vQ0hBTkdFIFRISVNcbiAgICAgICAgICAgICAgICAgICAgYXdheVRlYW0gPSB0b2RheXNTY29yZXNEYXRhLmdzLmdbaV0udi50YTtcbiAgICAgICAgICAgICAgICAgICAgbG9hZFJvc3RlckRhdGEoYXdheVRlYW0pO1xuICAgICAgICAgICAgICAgICAgICBzY29yZXNJbml0KHRvZGF5c1Njb3Jlc0RhdGEpO1xuICAgICAgICAgICAgICAgICAgICBzdGFuZGluZ3NJbml0KGF3YXlUZWFtKTtcbiAgICAgICAgICAgICAgICAgICAgbGVhZ3VlTGVhZGVycygpO1xuLyogICAgICAgICAgICAgICAgICAgIHNldEludGVydmFsKGxlZnRXcmFwLCAzMDAwKTsqL1xuICAgICAgICAgICAgICAgICAgICBnaWQgPSB0b2RheXNTY29yZXNEYXRhLmdzLmdbaV0uZ2lkO1xuLyogICAgICAgICAgICAgICAgICAgIGluaXRNb2JpbGVBcHAoKTtcbiAgICAgICAgICAgICAgICAgICAgbW9iaWxlQXBwKCk7Ki9cbiAgICAgICAgICAgICAgICAgICAgLyogICAgICAgICAgICAgICAgICAgIHBsYXllclNwb3RsaWdodChyb3N0ZXJPYmosIHBsYXllclNwb3RsaWdodENvdW50ZXIpOyovXG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfSk7XG4gICAgLy8gbG9hZFJvc3RlckRhdGEoKTsgT05MWSBPTkNFXG4gICAgLyogICAgc2V0VGltZW91dChsZWFkZXJzKGdpZCwgZ2FtZVN0YXJ0ZWQpLCA0MDApOyovXG59KTtcbi8qPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbj0gICAgICAgICAgICBNSVNDIEZVTkNUSU9OUyAgICAgICAgICAgID1cbj09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09Ki9cbmZ1bmN0aW9uIHBsYXllckFnZShkb2IpIHtcbiAgICB2YXIgdG9kYXkgPSBuZXcgRGF0ZSgpO1xuICAgIHZhciBiaXJ0aERhdGUgPSBuZXcgRGF0ZShkb2IpO1xuICAgIHZhciBhZ2UgPSB0b2RheS5nZXRGdWxsWWVhcigpIC0gYmlydGhEYXRlLmdldEZ1bGxZZWFyKCk7XG4gICAgcmV0dXJuIGFnZTtcbn1cblxuZnVuY3Rpb24gZ2VuZXJhdGVUaW1lbGluZShzZWxlY3RlZFBsYXllcikge1xuICAgIC8vIEFQUEVORDogVElNRUxJTkVcbiAgICB2YXIgc2Vhc29uc1BsYXllZCA9IHJvc3Rlck9iai5jZWx0aWNzLnJvc3RlcltzZWxlY3RlZFBsYXllcl0uc3RhdHMuc2EubGVuZ3RoO1xuICAgIHZhciB0aW1lbGluZUhUTUwgPSAnJztcbiAgICB2YXIgc2Vhc29uWWVhckhUTUwgPSAnJztcbiAgICBmb3IgKHZhciBpID0gMDsgaSA8IHNlYXNvbnNQbGF5ZWQ7IGkrKykge1xuICAgICAgICB2YXIgdGVhbUFiYnJldmlhdGlvbiA9IHJvc3Rlck9iai5jZWx0aWNzLnJvc3RlcltzZWxlY3RlZFBsYXllcl0uc3RhdHMuc2FbaV0udGE7XG4gICAgICAgIHZhciB0cmFkZWQgPSByb3N0ZXJPYmouY2VsdGljcy5yb3N0ZXJbc2VsZWN0ZWRQbGF5ZXJdLnN0YXRzLnNhW2ldLnNwbC5sZW5ndGg7XG4gICAgICAgIHZhciBzZWdtZW50SW5uZXIgPSBcIlwiO1xuICAgICAgICB2YXIgdGl0bGUgPSBcIlwiO1xuICAgICAgICB2YXIgc2Vhc29uWWVhclRleHQgPSByb3N0ZXJPYmouY2VsdGljcy5yb3N0ZXJbc2VsZWN0ZWRQbGF5ZXJdLnN0YXRzLnNhW2ldLnZhbDtcbiAgICAgICAgaWYgKGkgPT09IDAgfHwgdGVhbUFiYnJldmlhdGlvbiAhPT0gcm9zdGVyT2JqLmNlbHRpY3Mucm9zdGVyW3NlbGVjdGVkUGxheWVyXS5zdGF0cy5zYVtpIC0gMV0udGEpIHsgLy8gSWYgdGhpcyBpcyBhIG5ldyB0ZWFtLCBzdGFydCB0aGUgdGVhbSB3cmFwLlxuICAgICAgICAgICAgdGl0bGUgPSB0ZWFtQWJicmV2aWF0aW9uO1xuICAgICAgICB9XG4gICAgICAgIGlmICh0cmFkZWQpIHtcbiAgICAgICAgICAgIGZvciAodmFyIHggPSAwOyB4IDwgdHJhZGVkOyB4KyspIHtcbiAgICAgICAgICAgICAgICB2YXIgZ3BUb3QgPSByb3N0ZXJPYmouY2VsdGljcy5yb3N0ZXJbc2VsZWN0ZWRQbGF5ZXJdLnN0YXRzLnNhW2ldLmdwO1xuICAgICAgICAgICAgICAgIHZhciBncCA9IHJvc3Rlck9iai5jZWx0aWNzLnJvc3RlcltzZWxlY3RlZFBsYXllcl0uc3RhdHMuc2FbaV0uc3BsW3hdLmdwO1xuICAgICAgICAgICAgICAgIHZhciBncFBlcmNlbnRhZ2UgPSBNYXRoLnJvdW5kKChncCAvIGdwVG90KSAqIDEwMCk7XG4gICAgICAgICAgICAgICAgdGVhbUFiYnJldmlhdGlvbiA9IHJvc3Rlck9iai5jZWx0aWNzLnJvc3RlcltzZWxlY3RlZFBsYXllcl0uc3RhdHMuc2FbaV0uc3BsW3hdLnRhO1xuICAgICAgICAgICAgICAgIGlmIChpID09PSAwIHx8IHRlYW1BYmJyZXZpYXRpb24gIT09IHJvc3Rlck9iai5jZWx0aWNzLnJvc3RlcltzZWxlY3RlZFBsYXllcl0uc3RhdHMuc2FbaSAtIDFdLnRhICYmIHRlYW1BYmJyZXZpYXRpb24gIT09IHJvc3Rlck9iai5jZWx0aWNzLnJvc3RlcltzZWxlY3RlZFBsYXllcl0uc3RhdHMuc2FbaSArIDFdLnRhKSB7IC8vIElmIHRoaXMgaXMgYSBuZXcgdGVhbSwgc3RhcnQgdGhlIHRlYW0gd3JhcC5cbiAgICAgICAgICAgICAgICAgICAgdGl0bGUgPSB0ZWFtQWJicmV2aWF0aW9uO1xuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIHRpdGxlID0gXCJcIjtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgc2VnbWVudElubmVyICs9ICc8ZGl2IGRhdGEtc2Vhc29uLXllYXI9XCInICsgc2Vhc29uWWVhclRleHQgKyAnXCIgZGF0YS10ZWFtPVwiJyArIHRlYW1BYmJyZXZpYXRpb24gKyAnXCIgc3R5bGU9XCJcIiBjbGFzcz1cInNlZ21lbnQtaW5uZXIgJyArIHRlYW1BYmJyZXZpYXRpb24gKyAnLWJnXCI+PHA+JyArIHRpdGxlICsgJzwvcD48L2Rpdj4nO1xuICAgICAgICAgICAgfVxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgc2VnbWVudElubmVyID0gJzxkaXYgZGF0YS1zZWFzb24teWVhcj1cIicgKyBzZWFzb25ZZWFyVGV4dCArICdcIiBkYXRhLXRlYW09XCInICsgdGVhbUFiYnJldmlhdGlvbiArICdcIiBjbGFzcz1cInNlZ21lbnQtaW5uZXIgJyArIHRlYW1BYmJyZXZpYXRpb24gKyAnLWJnXCI+PHA+JyArIHRpdGxlICsgJzwvcD48L2Rpdj4nO1xuICAgICAgICB9XG4gICAgICAgIHRpbWVsaW5lSFRNTCArPSAnPGRpdiBjbGFzcz1cInNlZ21lbnRcIj4nICsgc2VnbWVudElubmVyICsgJzwvZGl2Pic7XG4gICAgICAgIHNlYXNvblllYXJIVE1MICs9ICc8ZGl2IGNsYXNzPVwic2VnbWVudFwiPjxwPicgKyBzZWFzb25ZZWFyVGV4dCArICc8L3A+PC9kaXY+JztcbiAgICB9XG4gICAgJChcIi50aW1lbGluZS13cmFwXCIpLmh0bWwoJzxkaXYgY2xhc3M9XCJ0aW1lbGluZSBhcHBlbmRlZFwiPicgKyB0aW1lbGluZUhUTUwgKyAnPC9kaXY+PGRpdiBjbGFzcz1cInNlYXNvbi15ZWFyIGFwcGVuZGVkXCI+JyArIHNlYXNvblllYXJIVE1MICsgJzwvZGl2PicpO1xufVxuXG5mdW5jdGlvbiBjcmVhdGVJbmRleChrZXlzLCBhcnJheSkge1xuICAgIHZhciBuZXdBcnIgPSBrZXlzLm1hcChpdGVtID0+IGFycmF5LmluZGV4T2YoaXRlbSkpO1xuICAgIHJldHVybiBuZXdBcnI7XG59XG4vKj09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbj0gICAgICAgICAgICBJTklUSUFMSVpFICAgICAgICAgICAgPVxuPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PSovXG5mdW5jdGlvbiBpbml0KCkge1xuICAgIGlmICghZ2FtZVN0YXJ0ZWQpIHtcbiAgICAgICAgJC5hamF4KHtcbiAgICAgICAgICAgIHVybDogJ2h0dHA6Ly9sb2NhbGhvc3Q6ODg4OC9kYXRhL21vYmlsZS1zdGF0cy1mZWVkL3RvZGF5c19zY29yZXMuanNvbicsXG4gICAgICAgICAgICBhc3luYzogZmFsc2UsXG4gICAgICAgICAgICBzdWNjZXNzOiBmdW5jdGlvbih0b2RheXNTY29yZXNEYXRhKSB7XG4gICAgICAgICAgICAgICAgdmFyIGdpZCA9ICcnO1xuICAgICAgICAgICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgdG9kYXlzU2NvcmVzRGF0YS5ncy5nLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICAgICAgICAgIGlmICh0b2RheXNTY29yZXNEYXRhLmdzLmdbaV0uaC50YSA9PSAnT1JMJykgeyAvLyBDSEFOR0UgVEhJUyBUTyAnQk9TJyBXSEVOIFRIRSBUSU1FIENPTUVTXG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAodG9kYXlzU2NvcmVzRGF0YS5ncy5nW2ldICE9PSAxKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZ2FtZVN0YXJ0ZWQgPSB0cnVlO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICB9XG59O1xuXG5mdW5jdGlvbiBpbml0TW9iaWxlQXBwKCkge1xuICAgIHZhciBjb3VudGVyID0gMTtcbiAgICBzZXRJbnRlcnZhbChmdW5jdGlvbigpIHtcbiAgICAgICAgJCgnLmFwcCAuYm90dG9tLXdyYXAgaW1nJykucmVtb3ZlQ2xhc3MoJ2FjdGl2ZScpO1xuICAgICAgICAkKCcuYXBwIC5mZWF0dXJlLWxpc3QgcCcpLnJlbW92ZUNsYXNzKCdhY3RpdmUnKTtcbiAgICAgICAgJCgnLmFwcCAuZmVhdHVyZS1saXN0IHA6bnRoLW9mLXR5cGUoJyArIGNvdW50ZXIgKyAnKScpLmFkZENsYXNzKCdhY3RpdmUnKTtcbiAgICAgICAgJCgnLmFwcCAuYm90dG9tLXdyYXAgaW1nOm50aC1vZi10eXBlKCcgKyBjb3VudGVyICsgJyknKS5hZGRDbGFzcygnYWN0aXZlJyk7XG4gICAgICAgIGlmIChjb3VudGVyID09IDUpIHtcbiAgICAgICAgICAgIGNvdW50ZXIgPSAxO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgY291bnRlcisrO1xuICAgICAgICB9XG4gICAgfSwgMjAwMCk7XG59O1xuXG4vKj09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuPSAgICAgICAgICAgIExPQUQgUk9TVEVSIElORk8gKGJ1aWxkIHJvc3Rlck9iaikgICAgICAgICAgICAgID1cbj09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PSovXG5cbmZ1bmN0aW9uIGxvYWRSb3N0ZXJEYXRhKGF3YXlUZWFtKSB7XG4gICAgdmFyIHJvc3RlciA9ICcnO1xuICAgICQuYWpheCh7XG4gICAgICAgIHVybDogJ2h0dHA6Ly9sb2NhbGhvc3Q6ODg4OC9kYXRhL21vYmlsZS1zdGF0cy1mZWVkL2NlbHRpY3Nfcm9zdGVyLmpzb24nLFxuICAgICAgICBhc3luYzogZmFsc2UsXG4gICAgICAgIHN1Y2Nlc3M6IGZ1bmN0aW9uKGRhdGEpIHtcbiAgICAgICAgICAgIHJvc3RlciA9IGRhdGE7XG4gICAgICAgICAgICBmb3IgKHZhciBwcm9wZXJ0eSBpbiByb3N0ZXIudCkge1xuICAgICAgICAgICAgICAgIGlmIChwcm9wZXJ0eSAhPT0gJ3BsJykge1xuICAgICAgICAgICAgICAgICAgICByb3N0ZXJPYmouY2VsdGljc1twcm9wZXJ0eV0gPSByb3N0ZXIudFtwcm9wZXJ0eV07XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9LFxuICAgICAgICBlcnJvcjogZnVuY3Rpb24oKSB7fVxuICAgIH0pO1xuICAgIHZhciBhd2F5Um9zdGVyID0gJyc7XG4gICAgJC5hamF4KHtcbiAgICAgICAgdXJsOiAnaHR0cDovL2xvY2FsaG9zdDo4ODg4L2RhdGEvbW9iaWxlLXN0YXRzLWZlZWQvYXdheV9yb3N0ZXIuanNvbicsXG4gICAgICAgIGFzeW5jOiBmYWxzZSxcbiAgICAgICAgc3VjY2VzczogZnVuY3Rpb24oZGF0YSkge1xuICAgICAgICAgICAgYXdheVJvc3RlciA9IGRhdGE7XG4gICAgICAgICAgICBmb3IgKHZhciBwcm9wZXJ0eSBpbiBhd2F5Um9zdGVyLnQpIHtcbiAgICAgICAgICAgICAgICBpZiAocHJvcGVydHkgIT09ICdwbCcpIHtcbiAgICAgICAgICAgICAgICAgICAgcm9zdGVyT2JqLmF3YXlbcHJvcGVydHldID0gYXdheVJvc3Rlci50W3Byb3BlcnR5XTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH0sXG4gICAgICAgIGVycm9yOiBmdW5jdGlvbigpIHt9XG4gICAgfSk7XG4gICAgdmFyIGJpb0RhdGEgPSAnJztcbiAgICAkLmFqYXgoe1xuICAgICAgICB1cmw6ICdodHRwOi8vbG9jYWxob3N0Ojg4ODgvZGF0YS9iaW8tZGF0YS5qc29uJyxcbiAgICAgICAgYXN5bmM6IGZhbHNlLFxuICAgICAgICBzdWNjZXNzOiBmdW5jdGlvbihkYXRhKSB7XG4gICAgICAgICAgICBiaW9EYXRhID0gZGF0YTtcbiAgICAgICAgfSxcbiAgICAgICAgZXJyb3I6IGZ1bmN0aW9uKCkge31cbiAgICB9KTtcbiAgICBmb3IgKHZhciBpID0gMDsgaSA8IHJvc3Rlci50LnBsLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgIHZhciBwaWQgPSByb3N0ZXIudC5wbFtpXS5waWQ7XG4gICAgICAgIHJvc3Rlck9iai5jZWx0aWNzLnJvc3RlcltwaWRdID0gcm9zdGVyLnQucGxbaV07XG4gICAgICAgIGZvciAodmFyIHByb3BlcnR5IGluIGJpb0RhdGFbcGlkXSkge1xuICAgICAgICAgICAgcm9zdGVyT2JqLmNlbHRpY3Mucm9zdGVyW3BpZF0uYmlvID0gYmlvRGF0YVtwaWRdO1xuICAgICAgICB9O1xuICAgICAgICAkLmFqYXgoe1xuICAgICAgICAgICAgdXJsOiAnaHR0cDovL2xvY2FsaG9zdDo4ODg4L2RhdGEvbW9iaWxlLXN0YXRzLWZlZWQvcGxheWVyY2FyZHMvcGxheWVyY2FyZC0nICsgcGlkICsgJy5qc29uJyxcbiAgICAgICAgICAgIGFzeW5jOiBmYWxzZSxcbiAgICAgICAgICAgIHN1Y2Nlc3M6IGZ1bmN0aW9uKGRhdGEpIHtcbiAgICAgICAgICAgICAgICByb3N0ZXJPYmouY2VsdGljcy5yb3N0ZXJbcGlkXS5zdGF0cyA9IGRhdGEucGwuY2E7XG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgZXJyb3I6IGZ1bmN0aW9uKCkge31cbiAgICAgICAgfSk7XG4gICAgfVxuICAgIGZvciAodmFyIGkgPSAwOyBpIDwgYXdheVJvc3Rlci50LnBsLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgIHZhciBwaWQgPSBhd2F5Um9zdGVyLnQucGxbaV0ucGlkO1xuICAgICAgICByb3N0ZXJPYmouYXdheS5yb3N0ZXJbcGlkXSA9IGF3YXlSb3N0ZXIudC5wbFtpXTtcbiAgICAgICAgJC5hamF4KHtcbiAgICAgICAgICAgIHVybDogJ2h0dHA6Ly9sb2NhbGhvc3Q6ODg4OC9kYXRhL21vYmlsZS1zdGF0cy1mZWVkL3BsYXllcmNhcmRzL3BsYXllcmNhcmQtMjAyMzMwLmpzb24nLCAvLyBDSEFOR0UgUElEXG4gICAgICAgICAgICBhc3luYzogZmFsc2UsXG4gICAgICAgICAgICBzdWNjZXNzOiBmdW5jdGlvbihkYXRhKSB7XG4gICAgICAgICAgICAgICAgcm9zdGVyT2JqLmF3YXkucm9zdGVyW3BpZF0uc3RhdHMgPSBkYXRhLnBsLmNhO1xuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIGVycm9yOiBmdW5jdGlvbigpIHt9XG4gICAgICAgIH0pO1xuICAgIH1cbiAgICBmb3IgKHZhciB0ZWFtIGluIHJvc3Rlck9iaikge1xuICAgICAgICBmb3IgKHZhciBwbGF5ZXIgaW4gcm9zdGVyT2JqW3RlYW1dLnJvc3Rlcikge1xuICAgICAgICAgICAgdmFyIHB0TGVhZGVycyA9IHJvc3Rlck9ialt0ZWFtXS5sZWFkZXJzLnB0cztcbiAgICAgICAgICAgIHZhciBhc3RMZWFkZXJzID0gcm9zdGVyT2JqW3RlYW1dLmxlYWRlcnMuYXN0O1xuICAgICAgICAgICAgdmFyIHJlYkxlYWRlcnMgPSByb3N0ZXJPYmpbdGVhbV0ubGVhZGVycy5yZWI7XG4gICAgICAgICAgICBmb3IgKHZhciBzdGF0IGluIHJvc3Rlck9ialt0ZWFtXS5sZWFkZXJzKSB7XG4gICAgICAgICAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCAzOyBpKyspIHtcbiAgICAgICAgICAgICAgICAgICAgaWYgKHJvc3Rlck9ialt0ZWFtXS5sZWFkZXJzW3N0YXRdW2ldWzJdID09ICctLScgJiYgcm9zdGVyT2JqW3RlYW1dLnJvc3RlcltwbGF5ZXJdLnN0YXRzW3N0YXRdID4gMCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgcm9zdGVyT2JqW3RlYW1dLmxlYWRlcnNbc3RhdF1baV1bMF0gPSByb3N0ZXJPYmpbdGVhbV0ucm9zdGVyW3BsYXllcl0uZm4udG9VcHBlckNhc2UoKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJvc3Rlck9ialt0ZWFtXS5sZWFkZXJzW3N0YXRdW2ldWzFdID0gcm9zdGVyT2JqW3RlYW1dLnJvc3RlcltwbGF5ZXJdLmxuLnRvVXBwZXJDYXNlKCk7XG4gICAgICAgICAgICAgICAgICAgICAgICByb3N0ZXJPYmpbdGVhbV0ubGVhZGVyc1tzdGF0XVtpXVsyXSA9IHJvc3Rlck9ialt0ZWFtXS5yb3N0ZXJbcGxheWVyXS5zdGF0c1tzdGF0XTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJvc3Rlck9ialt0ZWFtXS5sZWFkZXJzW3N0YXRdW2ldWzNdID0gcm9zdGVyT2JqW3RlYW1dLnJvc3RlcltwbGF5ZXJdLnBpZDtcbiAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgICAgICB9IGVsc2UgaWYgKHJvc3Rlck9ialt0ZWFtXS5yb3N0ZXJbcGxheWVyXS5zdGF0c1tzdGF0XSA+IHJvc3Rlck9ialt0ZWFtXS5sZWFkZXJzW3N0YXRdW2ldWzJdICYmIHJvc3Rlck9ialt0ZWFtXS5yb3N0ZXJbcGxheWVyXS5zdGF0c1tzdGF0XSA+IDApIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJvc3Rlck9ialt0ZWFtXS5sZWFkZXJzW3N0YXRdW2ldWzBdID0gcm9zdGVyT2JqW3RlYW1dLnJvc3RlcltwbGF5ZXJdLmZuLnRvVXBwZXJDYXNlKCk7XG4gICAgICAgICAgICAgICAgICAgICAgICByb3N0ZXJPYmpbdGVhbV0ubGVhZGVyc1tzdGF0XVtpXVsxXSA9IHJvc3Rlck9ialt0ZWFtXS5yb3N0ZXJbcGxheWVyXS5sbi50b1VwcGVyQ2FzZSgpO1xuICAgICAgICAgICAgICAgICAgICAgICAgcm9zdGVyT2JqW3RlYW1dLmxlYWRlcnNbc3RhdF1baV1bMl0gPSByb3N0ZXJPYmpbdGVhbV0ucm9zdGVyW3BsYXllcl0uc3RhdHNbc3RhdF07XG4gICAgICAgICAgICAgICAgICAgICAgICByb3N0ZXJPYmpbdGVhbV0ubGVhZGVyc1tzdGF0XVtpXVszXSA9IHJvc3Rlck9ialt0ZWFtXS5yb3N0ZXJbcGxheWVyXS5waWQ7XG4gICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH07XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9XG4gICAgY29uc29sZS5sb2cocm9zdGVyT2JqKTtcbn07XG5cbmZ1bmN0aW9uIHN0YXRzTm90QXZhaWxhYmxlKHBpZCkge1xuICAgIHJvc3Rlck9ialtwaWRdLnN0YXRzID0ge307XG4gICAgcm9zdGVyT2JqW3BpZF0uc3RhdHMuc2EgPSBbe31dO1xuICAgIHJvc3Rlck9ialtwaWRdLnN0YXRzLmhhc1N0YXRzID0gZmFsc2U7XG4gICAgdmFyIGNhSW5kZXggPSBbJ2dwJywgJ2dzJywgJ21pbicsICdmZ3AnLCAndHBwJywgJ2Z0cCcsICdvcmViJywgJ2RyZWInLCAncmViJywgJ2FzdCcsICdzdGwnLCAnYmxrJywgJ3RvdicsICdwZicsICdwdHMnLCAnbm9zdGF0cyddO1xuICAgIHZhciBzYUluZGV4ID0gWyd0aWQnLCAndmFsJywgJ2dwJywgJ2dzJywgJ21pbicsICdmZ3AnLCAndHBwJywgJ2Z0cCcsICdvcmViJywgJ2RyZWInLCAncmViJywgJ2FzdCcsICdzdGwnLCAnYmxrJywgJ3RvdicsICdwZicsICdwdHMnLCAnc3BsJywgJ3RhJywgJ3RuJywgJ3RjJ107XG4gICAgZm9yICh2YXIgaSA9IDA7IGkgPCBzYUluZGV4Lmxlbmd0aDsgaSsrKSB7XG4gICAgICAgIHJvc3Rlck9ialtwaWRdLnN0YXRzLnNhWzBdW3NhSW5kZXhbaV1dID0gXCJOL0FcIjtcbiAgICAgICAgaWYgKGkgPT09IDEpIHtcbiAgICAgICAgICAgIHJvc3Rlck9ialtwaWRdLnN0YXRzLnNhWzBdW3NhSW5kZXhbaV1dID0gcGxheWVyQ2FyZFllYXIudG9TdHJpbmcoKS5zdWJzdHIoMiwgMikgKyBcIi1cIiArIChwbGF5ZXJDYXJkWWVhciArIDEpLnRvU3RyaW5nKCkuc3Vic3RyKDIsIDIpO1xuICAgICAgICB9XG4gICAgICAgIGlmIChpID09PSAxNykge1xuICAgICAgICAgICAgcm9zdGVyT2JqW3BpZF0uc3RhdHMuc2FbMF1bc2FJbmRleFtpXV0gPSBbXTtcbiAgICAgICAgfVxuICAgICAgICBpZiAoaSA9PT0gMTgpIHtcbiAgICAgICAgICAgIHJvc3Rlck9ialtwaWRdLnN0YXRzLnNhWzBdW3NhSW5kZXhbaV1dID0gJ0JPUyc7XG4gICAgICAgIH1cbiAgICB9XG4gICAgZm9yICh2YXIgaSA9IDA7IGkgPCBjYUluZGV4Lmxlbmd0aDsgaSsrKSB7XG4gICAgICAgIHJvc3Rlck9ialtwaWRdLnN0YXRzW2NhSW5kZXhbaV1dID0gXCJOL0FcIjtcbiAgICAgICAgaWYgKGkgPT09IDE1KSB7XG4gICAgICAgICAgICByb3N0ZXJPYmpbcGlkXS5zdGF0c1tjYUluZGV4W2ldXSA9IHRydWU7XG4gICAgICAgIH1cbiAgICB9XG59O1xuXG5mdW5jdGlvbiBsb2FkR2FtZURldGFpbChnaWQpIHt9O1xuXG5mdW5jdGlvbiBsb2FkQXdheVRlYW1EYXRhKCkge31cbi8qPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuPSAgICAgICAgICAgIFJJR0hUIFdSQVAgICAgICAgICAgICA9XG49PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09Ki9cbmZ1bmN0aW9uIHBsYXllclNwb3RsaWdodChyb3N0ZXJPYmosIHBsYXllclNwb3RsaWdodENvdW50ZXIpIHtcbiAgICAvKiAxIC0gV0hJVEUgTElORSBIT1JJWlRPTkFMICovXG4gICAgc2V0VGltZW91dChmdW5jdGlvbigpIHtcbiAgICAgICAgJCgnLndoaXRlLWxpbmUuaG9yaXpvbnRhbCcpLmFkZENsYXNzKCd0cmFuc2l0aW9uLTEnKTtcbiAgICB9LCA1MDApO1xuICAgIHNldFRpbWVvdXQoZnVuY3Rpb24oKSB7XG4gICAgICAgICQoJy5zb2NpYWwtdG9wIC53aGl0ZS1saW5lLnZlcnRpY2FsOm50aC1jaGlsZChvZGQpJykuYWRkQ2xhc3MoJ3RyYW5zaXRpb24tMScpO1xuICAgICAgICAkKCcuc29jaWFsLWJvdHRvbSAud2hpdGUtbGluZS52ZXJ0aWNhbDpudGgtY2hpbGQoZXZlbiknKS5hZGRDbGFzcygndHJhbnNpdGlvbi0xJyk7XG4gICAgfSwgODAwKTtcbiAgICAvKiAyYiAtIFdISVRFIExJTkUgVkVSVElDQUwgKi9cbiAgICBzZXRUaW1lb3V0KGZ1bmN0aW9uKCkge1xuICAgICAgICAkKCcuc29jaWFsLXRvcCAud2hpdGUtbGluZS52ZXJ0aWNhbDpudGgtY2hpbGQoZXZlbiknKS5hZGRDbGFzcygndHJhbnNpdGlvbi0xJyk7XG4gICAgICAgICQoJy5zb2NpYWwtYm90dG9tIC53aGl0ZS1saW5lLnZlcnRpY2FsOm50aC1jaGlsZChvZGQpJykuYWRkQ2xhc3MoJ3RyYW5zaXRpb24tMScpO1xuICAgIH0sIDEwMDApO1xuICAgIC8qIDMgLSBHRU5FUkFURSBBTkQgUkVWRUFMIFBMQVlFUiBCT1hFUyAqL1xuICAgIHNldFRpbWVvdXQoZnVuY3Rpb24oKSB7XG4gICAgICAgICQoJy5zb2NpYWwtdG9wLCAuc29jaWFsLWJvdHRvbScpLmFkZENsYXNzKCd0cmFuc2l0aW9uLTEnKTtcbiAgICAgICAgJCgnLnBsYXllci1ib3gtd3JhcCcpLmFkZENsYXNzKCd0cmFuc2l0aW9uLTEnKTtcbiAgICB9LCAxMjAwKTtcbiAgICAvKiA0IC0gQVBQRU5EIEhFQURTSE9UUyAqL1xuICAgIHNldFRpbWVvdXQoZnVuY3Rpb24oKSB7XG4gICAgICAgICQoJy5wbGF5ZXItYm94LXdyYXAnKS5hZGRDbGFzcygndHJhbnNpdGlvbi0yJyk7XG4gICAgICAgICQoJy5wbGF5ZXItYm94JykuYWRkQ2xhc3MoJ3RyYW5zaXRpb24tMScpO1xuICAgICAgICB2YXIgZGVsYXkgPSAwO1xuICAgICAgICB2YXIgZm9yaW5Db3VudGVyID0gMDtcbiAgICAgICAgZm9yICh2YXIgcGxheWVyIGluIHJvc3Rlck9iai5jZWx0aWNzLnJvc3Rlcikge1xuICAgICAgICAgICAgY29uc29sZS5sb2cocGxheWVyKTtcbiAgICAgICAgICAgIHZhciBoZWFkc2hvdCA9ICdodHRwczovL2FrLXN0YXRpYy5jbXMubmJhLmNvbS93cC1jb250ZW50L3VwbG9hZHMvaGVhZHNob3RzL25iYS9sYXRlc3QvMTA0MHg3NjAvJyArIHJvc3Rlck9iai5jZWx0aWNzLnJvc3RlcltwbGF5ZXJdLnBpZCArICcucG5nJztcbiAgICAgICAgICAgICQoJy5wbGF5ZXItYm94Om50aC1jaGlsZCgnICsgKGZvcmluQ291bnRlciArIDEpICsgJyknKS5hcHBlbmQoJzxpbWcgY2xhc3M9XCJhcHBlbmRlZCBoZWFkc2hvdFwiIHNyYz1cIicgKyBoZWFkc2hvdCArICdcIi8+Jyk7XG4gICAgICAgICAgICAkKCcucGxheWVyLWJveDpudGgtY2hpbGQoJyArIChmb3JpbkNvdW50ZXIgKyAxKSArICcpJykuYXR0cignZGF0YS1waWQnLCByb3N0ZXJPYmouY2VsdGljcy5yb3N0ZXJbcGxheWVyXS5waWQpO1xuICAgICAgICAgICAgJCgnLnBsYXllci1ib3ggaW1nJykub24oXCJlcnJvclwiLCBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgICAgICAkKHRoaXMpLmF0dHIoJ3NyYycsICdodHRwczovL2kuY2RuLnR1cm5lci5jb20vbmJhL25iYS8uZWxlbWVudC9tZWRpYS8yLjAvdGVhbXNpdGVzL2NlbHRpY3MvbWVkaWEvZ2VuZXJpYy1wbGF5ZXItbGlnaHRfNjAweDQzOC5wbmcnKTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgJCgnLnBsYXllci1ib3g6bnRoLWNoaWxkKCcgKyAoZm9yaW5Db3VudGVyICsgMSkgKyAnKSBpbWcnKS5kZWxheShkZWxheSkuZmFkZVRvKDMwMCwgMSk7XG4gICAgICAgICAgICBkZWxheSArPSAzMDtcbiAgICAgICAgICAgIGZvcmluQ291bnRlcisrO1xuICAgICAgICB9XG4gICAgfSwgMTMwMCk7XG4gICAgLyogNSAtIFBMQVlFUiBTRUxFQ1QgKi9cbiAgICB2YXIgc2VsZWN0ZWRQbGF5ZXIgPSAnJztcbiAgICBzZXRUaW1lb3V0KGZ1bmN0aW9uKCkge1xuICAgICAgICAkKCcucGxheWVyLWJveCcpLmFkZENsYXNzKCd0cmFuc2l0aW9uLTInKTtcbiAgICAgICAgJCgnLnBsYXllci1ib3g6bnRoLWNoaWxkKCcgKyAocGxheWVyU3BvdGxpZ2h0Q291bnRlciArIDEpICsgJyknKS5hZGRDbGFzcygnc2VsZWN0ZWQnKTtcbiAgICAgICAgc2VsZWN0ZWRQbGF5ZXIgPSAkKCcucGxheWVyLWJveDpudGgtY2hpbGQoJyArIChwbGF5ZXJTcG90bGlnaHRDb3VudGVyICsgMSkgKyAnKScpLmF0dHIoJ2RhdGEtcGlkJyk7XG4gICAgICAgIGNvbnNvbGUubG9nKHNlbGVjdGVkUGxheWVyKTtcbiAgICAgICAgJCgnLnBsYXllci1ib3gnKS5ub3QoJy5yZXBsYWNlbWVudC5zZWxlY3RlZCcpLmRlbGF5KDUwMCkuYWRkQ2xhc3MoJ3RyYW5zaXRpb24tNCcpO1xuICAgIH0sIDIwMDApO1xuICAgIC8qIDYgLSBQTEFZRVIgQk9YIEVYUEFORCAqL1xuICAgIHNldFRpbWVvdXQoZnVuY3Rpb24oKSB7XG4gICAgICAgICQoJy5ibG9jay13cmFwLnNvY2lhbCcpLmFkZENsYXNzKCd0cmFuc2l0aW9uLTMnKTtcbiAgICAgICAgJCgnLnBsYXllci1ib3gucmVwbGFjZW1lbnQuc2VsZWN0ZWQnKS5hZGRDbGFzcygndHJhbnNpdGlvbi0zJyk7XG4gICAgfSwgMzAwMCk7XG4gICAgLyogNyAtIFNQT1RMSUdIVCBIVE1MICovXG4gICAgc2V0VGltZW91dChmdW5jdGlvbigpIHtcbiAgICAgICAgZ2VuZXJhdGVUaW1lbGluZShzZWxlY3RlZFBsYXllcik7XG4gICAgICAgICQoJy5wbGF5ZXItYm94LnJlcGxhY2VtZW50LnNlbGVjdGVkJykuY2xvbmUoKS5hcHBlbmRUbygnLmJsb2NrLXdyYXAucGxheWVyLXNwb3RsaWdodCAudG9wLXdyYXAnKTtcbiAgICAgICAgJCgnLnBsYXllci1zcG90bGlnaHQgLnNlbGVjdGVkJykuYWRkQ2xhc3MoJy5hcHBlbmRlZCcpO1xuICAgICAgICAkKCcuYmxvY2std3JhcC5wbGF5ZXItc3BvdGxpZ2h0JykuYWRkQ2xhc3MoJ3RyYW5zaXRpb24tMScpO1xuICAgICAgICAkKCcuYmxvY2std3JhcC5zb2NpYWwnKS5hZGRDbGFzcygndHJhbnNpdGlvbi0xJyk7XG4gICAgICAgIHZhciBzdGF0cyA9IHJvc3Rlck9iai5jZWx0aWNzLnJvc3RlcltzZWxlY3RlZFBsYXllcl0uc3RhdHM7XG4gICAgICAgICQoJy5wbGF5ZXItc3BvdGxpZ2h0IC50b3Atd3JhcCAucGxheWVyLXRvcCcpLmFwcGVuZCgnPGltZyBjbGFzcz1cInNpbG8gYXBwZW5kZWRcIiBzcmM9XCJodHRwOi8vaW8uY25uLm5ldC9uYmEvbmJhLy5lbGVtZW50L21lZGlhLzIuMC90ZWFtc2l0ZXMvY2VsdGljcy9tZWRpYS9zaWxvLTQ2Nng1OTEtJyArIHJvc3Rlck9iai5jZWx0aWNzLnJvc3RlcltzZWxlY3RlZFBsYXllcl0ucGlkICsgJy5wbmdcIiAvPjxkaXYgY2xhc3M9XCJ0b3AgYXBwZW5kZWRcIj48ZGl2IGNsYXNzPVwicGxheWVyLW5hbWUtd3JhcFwiPjxwIGNsYXNzPVwicGxheWVyLW5hbWVcIj48c3Bhbj4nICsgcm9zdGVyT2JqLmNlbHRpY3Mucm9zdGVyW3NlbGVjdGVkUGxheWVyXS5mbi50b1VwcGVyQ2FzZSgpICsgJzwvc3Bhbj4gPGJyPiAnICsgcm9zdGVyT2JqLmNlbHRpY3Mucm9zdGVyW3NlbGVjdGVkUGxheWVyXS5sbi50b1VwcGVyQ2FzZSgpICsgJzwvcD48L2Rpdj48cCBjbGFzcz1cInBsYXllci1udW1iZXJcIj4nICsgcm9zdGVyT2JqLmNlbHRpY3Mucm9zdGVyW3NlbGVjdGVkUGxheWVyXS5udW0gKyAnPC9icj48c3Bhbj4nICsgcm9zdGVyT2JqLmNlbHRpY3Mucm9zdGVyW3NlbGVjdGVkUGxheWVyXS5wb3MgKyAnPC9zcGFuPjwvcD48L2Rpdj48ZGl2IGNsYXNzPVwibWlkZGxlIGFwcGVuZGVkXCI+PHVsIGNsYXNzPVwiaW5mbyBjbGVhcmZpeFwiPjxsaT48cD5BR0U8c3BhbiBjbGFzcz1cInNtLWhpZGVcIj46Jm5ic3A7PC9zcGFuPiA8L2JyPjxzcGFuIGNsYXNzPVwiaW5mby12YWx1ZVwiPicgKyBwbGF5ZXJBZ2Uocm9zdGVyT2JqLmNlbHRpY3Mucm9zdGVyW3NlbGVjdGVkUGxheWVyXS5kb2IpICsgJzwvc3Bhbj48L3A+PC9saT48bGk+PHA+SFQ8c3BhbiBjbGFzcz1cInNtLWhpZGVcIj46Jm5ic3A7PC9zcGFuPiA8L2JyPjxzcGFuIGNsYXNzPVwiaW5mby12YWx1ZVwiPicgKyByb3N0ZXJPYmouY2VsdGljcy5yb3N0ZXJbc2VsZWN0ZWRQbGF5ZXJdLmh0ICsgJzwvc3Bhbj48L3A+PC9saT48bGk+PHA+V1Q8c3BhbiBjbGFzcz1cInNtLWhpZGVcIj46Jm5ic3A7PC9zcGFuPiA8L2JyPjxzcGFuIGNsYXNzPVwiaW5mby12YWx1ZVwiPicgKyByb3N0ZXJPYmouY2VsdGljcy5yb3N0ZXJbc2VsZWN0ZWRQbGF5ZXJdLnd0ICsgJzwvc3Bhbj48L3A+PC9saT48L3VsPjwvZGl2PjxkaXYgY2xhc3M9XCJib3R0b20gZnVsbCBjbGVhcmZpeCBzbS1oaWRlIGFwcGVuZGVkXCI+PHRhYmxlIGNsYXNzPVwiYXZlcmFnZXNcIj48dHIgY2xhc3M9XCJhdmVyYWdlcy1sYWJlbHNcIj48dGQ+PHA+R1A8L3A+PC90ZD48dGQ+PHA+UFBHPC9wPjwvdGQ+PHRkPjxwPlJQRzwvcD48L3RkPjx0ZD48cD5BUEc8L3A+PC90ZD48L3RyPjx0ciBjbGFzcz1cImF2ZXJhZ2VzLXNlYXNvblwiPjx0ZCBjbGFzcz1cImdwXCI+PHA+PC9wPjwvdGQ+PHRkIGNsYXNzPVwicHRzXCI+PHA+PC9wPjwvdGQ+PHRkIGNsYXNzPVwicmViXCI+PHA+PC9wPjwvdGQ+PHRkIGNsYXNzPVwiYXN0XCI+PHA+PC9wPjwvdGQ+PC90cj48L3RhYmxlPjwvZGl2PicpO1xuICAgICAgICAkKFwiLnBsYXllci1zcG90bGlnaHQgLmF2ZXJhZ2VzLXNlYXNvblwiKS5odG1sKCc8dGQ+PHA+JyArIHN0YXRzLnNhWzBdLmdwICsgJzwvcD48L3RkPjx0ZD48cD4nICsgc3RhdHMuc2FbMF0ucHRzICsgJzwvcD48L3RkPjx0ZD48cD4nICsgc3RhdHMuc2FbMF0ucmViICsgJzwvcD48L3RkPjx0ZD48cD4nICsgc3RhdHMuc2FbMF0uYXN0ICsgJzwvcD48L3RkPicpO1xuICAgICAgICAkKCcucGxheWVyLXNwb3RsaWdodCAucGxheWVyLW5hbWUnKS5mYWRlVG8oMjAwLCAxKTtcbiAgICAgICAgdmFyIHBsYXllckZhY3RzID0gcm9zdGVyT2JqLmNlbHRpY3Mucm9zdGVyW3NlbGVjdGVkUGxheWVyXS5iaW8ucGVyc29uYWw7XG4gICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgMzsgaSsrKSB7XG4gICAgICAgICAgICB2YXIgZmFjdEluZGV4ID0gTWF0aC5mbG9vcihNYXRoLnJhbmRvbSgpICogcGxheWVyRmFjdHMubGVuZ3RoKTtcbiAgICAgICAgICAgICQoJy5wbGF5ZXItc3BvdGxpZ2h0IC5ib3R0b20td3JhcCcpLmFwcGVuZCgnPGRpdiBjbGFzcz1cImR5ay1ib3ggYXBwZW5kZWRcIj48cD4nICsgcGxheWVyRmFjdHNbZmFjdEluZGV4XSArICc8L3A+PC9kaXY+Jyk7XG4gICAgICAgIH07XG4gICAgICAgICQoJy5wbGF5ZXItc3BvdGxpZ2h0IC5ib3R0b20td3JhcCcpLmFkZENsYXNzKCd0cmFuc2l0aW9uLTEnKTtcbiAgICAgICAgc2V0VGltZW91dChmdW5jdGlvbigpIHtcbiAgICAgICAgICAgICQoJy5wbGF5ZXItc3BvdGxpZ2h0IC5ib3R0b20td3JhcCAuZHlrLWJveDpudGgtb2YtdHlwZSgyKScpLmFkZENsYXNzKCd0cmFuc2l0aW9uLTInKTtcbiAgICAgICAgICAgICQoJy5wbGF5ZXItc3BvdGxpZ2h0IC5ib3R0b20td3JhcCAuZHlrLWJveDpudGgtb2YtdHlwZSgzKScpLmFkZENsYXNzKCd0cmFuc2l0aW9uLTEnKTtcbiAgICAgICAgfSwgMTAwMCk7XG4gICAgICAgIHNldFRpbWVvdXQoZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICAkKCcucGxheWVyLXNwb3RsaWdodCAuYm90dG9tLXdyYXAgLmR5ay1ib3g6bnRoLW9mLXR5cGUoMyknKS5hZGRDbGFzcygndHJhbnNpdGlvbi0yJyk7XG4gICAgICAgICAgICAkKCcucGxheWVyLXNwb3RsaWdodCAuYm90dG9tLXdyYXAgLmR5ay1ib3g6bnRoLW9mLXR5cGUoNCknKS5hZGRDbGFzcygndHJhbnNpdGlvbi0xJyk7XG4gICAgICAgIH0sIDE1MDApO1xuICAgIH0sIDM2MDApO1xuICAgIC8qIDggLSBTUE9UTElHSFQgU0xJREUgSU4gKi9cbiAgICBzZXRUaW1lb3V0KGZ1bmN0aW9uKCkge1xuICAgICAgICAkKCcucGxheWVyLXNwb3RsaWdodCAucGxheWVyLXRvcCAucGxheWVyLW5hbWUsIC5wbGF5ZXItc3BvdGxpZ2h0IC5wbGF5ZXItbmFtZS13cmFwLCAucGxheWVyLXNwb3RsaWdodCAuaGVhZHNob3QsIC5wbGF5ZXItc3BvdGxpZ2h0IC5pbmZvLCAucGxheWVyLXNwb3RsaWdodCAuc2lsbywgLnBsYXllci1zcG90bGlnaHQgLmF2ZXJhZ2VzLCAucGxheWVyLXNwb3RsaWdodCAucGxheWVyLW51bWJlcicpLmFkZENsYXNzKCd0cmFuc2l0aW9uLTEnKTtcbiAgICAgICAgc2V0VGltZW91dChmdW5jdGlvbigpIHtcbiAgICAgICAgICAgICQoJy5ibG9jay13cmFwLnBsYXllci1zcG90bGlnaHQgLnBsYXllci1ib3gnKS5yZW1vdmUoKTtcbiAgICAgICAgfSwgNDAwMCk7XG4gICAgICAgIGlmIChwbGF5ZXJTcG90bGlnaHRDb3VudGVyIDwgMTYpIHtcbiAgICAgICAgICAgIHBsYXllclNwb3RsaWdodENvdW50ZXIrKztcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHBsYXllclNwb3RsaWdodENvdW50ZXIgPSAwO1xuICAgICAgICB9XG4gICAgfSwgNDEwMCk7XG4gICAgLyogOSAtIFNQT1RMSUdIVCBTTElERSBPVVQgKi9cbiAgICBzZXRUaW1lb3V0KGZ1bmN0aW9uKCkge1xuICAgICAgICAkKCcucGxheWVyLXNwb3RsaWdodCAuYm90dG9tLXdyYXAsIC5wbGF5ZXItc3BvdGxpZ2h0IC50b3Atd3JhcCcpLmFkZENsYXNzKCd0cmFuc2l0aW9uLTInKTtcbiAgICB9LCA2MDAwKTtcbiAgICAvKiAxMCAtIERPTkUuIFJFTU9WRSBUSEFUIFNISVQgKi9cbiAgICBzZXRUaW1lb3V0KGZ1bmN0aW9uKCkge1xuICAgICAgICAkKCcuYXBwZW5kZWQnKS5yZW1vdmUoKTtcbiAgICAgICAgJCgnLnRyYW5zaXRpb24sIC50cmFuc2l0aW9uLTEsIC50cmFuc2l0aW9uLTIsIC50cmFuc2l0aW9uLTMsIC50cmFuc2l0aW9uLTQnKS5yZW1vdmVDbGFzcygndHJhbnNpdGlvbiB0cmFuc2l0aW9uLTEgdHJhbnNpdGlvbi0yIHRyYW5zaXRpb24tMyB0cmFuc2l0aW9uLTQnKTtcbiAgICB9LCA3MDAwKTtcbn1cblxuZnVuY3Rpb24gbGVhZGVycyhnaWQsIGdhbWVTdGFydGVkKSB7XG4gICAgdmFyIGdhbWVEZXRhaWwgPSAnJztcbiAgICB2YXIgZGV0YWlsQXZhaWxhYmxlID0gZmFsc2U7XG4gICAgZ2FtZVN0YXJ0ZWQgPSB0cnVlOyAvLyBETzogREVMRVRFIFRISVMgV0hFTiBPTkxJTkUuIEpVU1QgRk9SIFRFU1RJTkcgUFVSUE9TRVMgUk5cbiAgICBpZiAoZ2FtZVN0YXJ0ZWQpIHtcbiAgICAgICAgJC5hamF4KHtcbiAgICAgICAgICAgIHVybDogJ2h0dHA6Ly9sb2NhbGhvc3Q6ODg4OC9kYXRhL21vYmlsZS1zdGF0cy1mZWVkL2dhbWVkZXRhaWwuanNvbicsXG4gICAgICAgICAgICBhc3luYzogZmFsc2UsXG4gICAgICAgICAgICBzdWNjZXNzOiBmdW5jdGlvbihkYXRhKSB7XG4gICAgICAgICAgICAgICAgLy8gRE86IFVQREFURSBUSEUgTEVBREVSIE9CSkVDVFNcbiAgICAgICAgICAgICAgICBnYW1lRGV0YWlsID0gZGF0YTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgfVxuICAgIGZvciAodmFyIHRlYW0gaW4gcm9zdGVyT2JqKSB7XG4gICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgMzsgaSsrKSB7XG4gICAgICAgICAgICBmb3IgKHZhciBzdGF0IGluIHJvc3Rlck9ialt0ZWFtXS5sZWFkZXJzKSB7XG4gICAgICAgICAgICAgICAgLy8gTEVBREVSIFNUQVQgVkFMVUVcbiAgICAgICAgICAgICAgICAkKCcubGVhZGVyLXNlY3Rpb246bnRoLW9mLXR5cGUoJyArIChpICsgMikgKyAnKSAuJyArIHN0YXQgKyAnLicgKyB0ZWFtICsgJyAuc3RhdCcpLmFwcGVuZCgnPHNwYW4gY2xhc3M9XCInICsgcm9zdGVyT2JqW3RlYW1dLnRhICsgJ1wiPicgKyByb3N0ZXJPYmpbdGVhbV0ubGVhZGVyc1tzdGF0XVtpXVsyXSArICc8L3NwYW4+ICcgKyBzdGF0LnRvVXBwZXJDYXNlKCkpO1xuICAgICAgICAgICAgICAgIC8vIExFQURFUiBOQU1FXG4gICAgICAgICAgICAgICAgaWYgKHJvc3Rlck9ialt0ZWFtXS5sZWFkZXJzW3N0YXRdW2ldWzBdLmxlbmd0aCArIHJvc3Rlck9ialt0ZWFtXS5sZWFkZXJzW3N0YXRdW2ldWzFdLmxlbmd0aCA+PSAxNSkge1xuICAgICAgICAgICAgICAgICAgICByb3N0ZXJPYmpbdGVhbV0ubGVhZGVyc1tzdGF0XVtpXVswXSA9IHJvc3Rlck9ialt0ZWFtXS5sZWFkZXJzW3N0YXRdW2ldWzBdLnN1YnN0cigwLCAxKSArICcuJztcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgJCgnLmxlYWRlci1zZWN0aW9uOm50aC1vZi10eXBlKCcgKyAoaSArIDIpICsgJykgLicgKyBzdGF0ICsgJy4nICsgdGVhbSArICcgLm5hbWUnKS5hcHBlbmQoJzxzcGFuPicgKyByb3N0ZXJPYmpbdGVhbV0ubGVhZGVyc1tzdGF0XVtpXVswXSArICc8L3NwYW4+ICcgKyByb3N0ZXJPYmpbdGVhbV0ubGVhZGVyc1tzdGF0XVtpXVsxXSk7XG4gICAgICAgICAgICAgICAgLy8gTEVBREVSIEhFQURTSE9UXG4gICAgICAgICAgICAgICAgJCgnLmxlYWRlci1zZWN0aW9uOm50aC1vZi10eXBlKCcgKyAoaSArIDIpICsgJykgLicgKyBzdGF0ICsgJy4nICsgdGVhbSArICcgLmhlYWRzaG90JykuYXR0cignc3JjJywgJ2h0dHBzOi8vYWstc3RhdGljLmNtcy5uYmEuY29tL3dwLWNvbnRlbnQvdXBsb2Fkcy9oZWFkc2hvdHMvbmJhL2xhdGVzdC8xMDQweDc2MC8nICsgcm9zdGVyT2JqW3RlYW1dLmxlYWRlcnNbc3RhdF1baV1bM10gKyAnLnBuZycpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxuICAgIHZhciB0aW1lQmV0d2VlbiA9IDEwMDA7XG4gICAgJCgnLmxlYWRlcnMsIC5sZWFkZXJzIC5ibG9jay1pbm5lcicpLmFkZENsYXNzKCd0cmFuc2l0aW9uLTEnKTtcbiAgICBzZXRUaW1lb3V0KGZ1bmN0aW9uKCkge1xuICAgICAgICAkKCcubGVhZGVycyAubGVhZGVyLXNlY3Rpb24nKS5hZGRDbGFzcygndHJhbnNpdGlvbi0xJyk7XG4gICAgICAgICQoJy5sZWFkZXItc3Vic2VjdGlvbi5ib3R0b20gcDpudGgtb2YtdHlwZSgxKScpLmFkZENsYXNzKCd0cmFuc2l0aW9uLTEnKTtcbiAgICAgICAgJCgnLmxlYWRlcnMgLmxlYWRlci1zZWN0aW9uIC51bmRlcmxpbmUsIC5sZWFkZXJzIC5sZWFkZXItc3Vic2VjdGlvbi50b3AnKS5hZGRDbGFzcyhyb3N0ZXJPYmouY2VsdGljcy50YSArICctYmcnKTtcbiAgICB9LCA4MDApO1xuICAgIHZhciB0cmFuc2l0aW9uQ291bnRlciA9IDE7XG4gICAgZm9yIChsZXQgaSA9IDE7IGkgPD0gNjsgaSsrKSB7XG4gICAgICAgIHNldFRpbWVvdXQoZnVuY3Rpb24obnVtYmVyU3RyaW5nKSB7XG4gICAgICAgICAgICAkKCcubGVhZGVycyAubGVhZGVyLXNlY3Rpb24gLmxlYWRlci1zdGF0LXdyYXAnKS5hZGRDbGFzcygndHJhbnNpdGlvbi0nICsgaSk7XG4gICAgICAgICAgICAkKCcubGVhZGVycyAubGVhZGVyLXNlY3Rpb24gLnVuZGVybGluZSwgLmxlYWRlcnMgLmxlYWRlci1zdWJzZWN0aW9uLnRvcCcpLnJlbW92ZUNsYXNzKHJvc3Rlck9iai5jZWx0aWNzLnRhICsgJy1iZycpO1xuICAgICAgICAgICAgJCgnLmxlYWRlcnMgLmxlYWRlci1zZWN0aW9uIC51bmRlcmxpbmUsIC5sZWFkZXJzIC5sZWFkZXItc3Vic2VjdGlvbi50b3AnKS5hZGRDbGFzcyhyb3N0ZXJPYmouYXdheS50YSArICctYmcnKTtcbiAgICAgICAgICAgIGlmICh0cmFuc2l0aW9uQ291bnRlciAlIDIgPT0gMCkge1xuICAgICAgICAgICAgICAgIHNldFRpbWVvdXQoZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICAgICAgICAgICQoJy5sZWFkZXJzIC5sZWFkZXItc2VjdGlvbiAudW5kZXJsaW5lLCAubGVhZGVycyAubGVhZGVyLXN1YnNlY3Rpb24udG9wJykucmVtb3ZlQ2xhc3Mocm9zdGVyT2JqLmF3YXkudGEgKyAnLWJnJyk7XG4gICAgICAgICAgICAgICAgICAgICQoJy5sZWFkZXJzIC5sZWFkZXItc2VjdGlvbiAudW5kZXJsaW5lLCAubGVhZGVycyAubGVhZGVyLXN1YnNlY3Rpb24udG9wJykuYWRkQ2xhc3Mocm9zdGVyT2JqLmNlbHRpY3MudGEgKyAnLWJnJyk7XG4gICAgICAgICAgICAgICAgICAgICQoJy5sZWFkZXItc3Vic2VjdGlvbi5ib3R0b20gcCcpLnJlbW92ZUNsYXNzKCd0cmFuc2l0aW9uLTEnKTtcbiAgICAgICAgICAgICAgICAgICAgJCgnLmxlYWRlcnMgLmxlYWRlci1zZWN0aW9uIC51bmRlcmxpbmUnKS5hZGRDbGFzcygndHJhbnNpdGlvbi0nICsgKGkgLyAyKSk7XG4gICAgICAgICAgICAgICAgICAgICQoJy5sZWFkZXItc3Vic2VjdGlvbi5ib3R0b20gcDpudGgtb2YtdHlwZSgnICsgKGkgLSAoaSAvIDIpICsgMSkgKyAnKScpLmFkZENsYXNzKCd0cmFuc2l0aW9uLTEnKTsgLy8gbG9sXG4gICAgICAgICAgICAgICAgfSwgMjAwKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHRyYW5zaXRpb25Db3VudGVyKys7XG4gICAgICAgIH0sIDIwMDAgKiBpKTtcbiAgICB9XG59O1xuXG5mdW5jdGlvbiBzb2NpYWwocm9zdGVyKSB7fTtcblxuZnVuY3Rpb24gbW9iaWxlQXBwKCkge1xuICAgICQoJy5hcHAnKS5zaG93KCk7XG59O1xuLyo9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbj0gICAgICAgICAgICBMRUZUIFdSQVAgICAgICAgICAgICA9XG49PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT0qL1xuXG5mdW5jdGlvbiBsZWZ0V3JhcCgpIHtcbiAgICBpZiAoJCgnLmxlZnQtd3JhcCAuc3RhbmRpbmdzJykuaGFzQ2xhc3MoJ3RyYW5zaXRpb24tMScpKXtcbiAgICAgICAgJCgnLmxlZnQtd3JhcCAuc3RhbmRpbmdzJykucmVtb3ZlQ2xhc3MoJ3RyYW5zaXRpb24tMScpO1xuICAgIH1cbiAgICBlbHNlIHtcbiAgICAgICAgJCgnLmxlZnQtd3JhcCAuc3RhbmRpbmdzJykuYWRkQ2xhc3MoJ3RyYW5zaXRpb24tMScpO1xuICAgIH1cblxuICAgIGlmICgkKCcubGVmdC13cmFwIC5zY29yZXMtYW5kLWxlYWRlcnMnKS5oYXNDbGFzcygndHJhbnNpdGlvbi0xJykpe1xuICAgICAgICAkKCcubGVmdC13cmFwIC5zY29yZXMtYW5kLWxlYWRlcnMnKS5yZW1vdmVDbGFzcygndHJhbnNpdGlvbi0xJyk7XG4gICAgfVxuICAgIGVsc2Uge1xuICAgICAgICAkKCcubGVmdC13cmFwIC5zY29yZXMtYW5kLWxlYWRlcnMnKS5hZGRDbGFzcygndHJhbnNpdGlvbi0xJyk7XG4gICAgfVxufVxuXG5cbmZ1bmN0aW9uIHN0YW5kaW5nc0luaXQoYXdheVRlYW0pIHtcbiAgICAkLmFqYXgoe1xuICAgICAgICB1cmw6ICdodHRwOi8vbG9jYWxob3N0Ojg4ODgvZGF0YS9tb2JpbGUtc3RhdHMtZmVlZC9zdGFuZGluZ3MuanNvbicsXG4gICAgICAgIGFzeW5jOiBmYWxzZSxcbiAgICAgICAgc3VjY2VzczogZnVuY3Rpb24oc3RhbmRpbmdzRGF0YSkge1xuICAgICAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBzdGFuZGluZ3NEYXRhLnN0YS5jby5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgICAgIGZvciAobGV0IHggPSAwOyB4IDwgc3RhbmRpbmdzRGF0YS5zdGEuY29baV0uZGkubGVuZ3RoOyB4KyspIHtcbiAgICAgICAgICAgICAgICAgICAgZm9yIChsZXQgdCA9IDA7IHQgPCBzdGFuZGluZ3NEYXRhLnN0YS5jb1tpXS5kaVt4XS50Lmxlbmd0aDsgdCsrKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICB2YXIgY29uZmVyZW5jZXMgPSBbJy5lYXN0JywgJy53ZXN0J107XG4gICAgICAgICAgICAgICAgICAgICAgICB2YXIgcGxhY2UgPSBzdGFuZGluZ3NEYXRhLnN0YS5jb1tpXS5kaVt4XS50W3RdLnNlZTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHZhciBzZWVkID0gJyc7XG4gICAgICAgICAgICAgICAgICAgICAgICB2YXIgYWN0aXZlU3RhdHVzID0gJyc7XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoc3RhbmRpbmdzRGF0YS5zdGEuY29baV0uZGlbeF0udFt0XS5zZWUgPD0gOCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHNlZWQgPSBzdGFuZGluZ3NEYXRhLnN0YS5jb1tpXS5kaVt4XS50W3RdLnNlZTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChzdGFuZGluZ3NEYXRhLnN0YS5jb1tpXS5kaVt4XS50W3RdLnRhID09ICdCT1MnKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgYWN0aXZlU3RhdHVzID0gJ2FjdGl2ZSc7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoc3RhbmRpbmdzRGF0YS5zdGEuY29baV0uZGlbeF0udFt0XS50YSA9PSBhd2F5VGVhbSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGFjdGl2ZVN0YXR1cyA9ICdhY3RpdmUtYXdheSc7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICB2YXIgcm93SFRNTCA9ICc8ZGl2IGNsYXNzPVwicGxhY2VcIj4nICsgc2VlZCArICc8L2Rpdj48ZGl2IGNsYXNzPVwibG9nby13cmFwXCI+PGltZyBjbGFzcz1cImxvZ29cIiBzcmM9aHR0cDovL2kuY2RuLnR1cm5lci5jb20vbmJhL25iYS9hc3NldHMvbG9nb3MvdGVhbXMvcHJpbWFyeS93ZWIvJyArIHN0YW5kaW5nc0RhdGEuc3RhLmNvW2ldLmRpW3hdLnRbdF0udGEgKyAnLnN2Zz48L2Rpdj48ZGl2IGNsYXNzPVwidGVhbSArICcgKyBzdGFuZGluZ3NEYXRhLnN0YS5jb1tpXS5kaVt4XS50W3RdLnRhICsgJ1wiPicgKyBzdGFuZGluZ3NEYXRhLnN0YS5jb1tpXS5kaVt4XS50W3RdLnRhICsgJzwvZGl2PjxkaXYgY2xhc3M9XCJ3aW5zXCI+JyArIHN0YW5kaW5nc0RhdGEuc3RhLmNvW2ldLmRpW3hdLnRbdF0udyArICc8L2Rpdj48ZGl2IGNsYXNzPVwibG9zc2VzXCI+JyArIHN0YW5kaW5nc0RhdGEuc3RhLmNvW2ldLmRpW3hdLnRbdF0ubCArICc8L2Rpdj48ZGl2IGNsYXNzPVwiZ2FtZXMtYmVoaW5kXCI+JyArIHN0YW5kaW5nc0RhdGEuc3RhLmNvW2ldLmRpW3hdLnRbdF0uZ2IgKyAnPC9kaXY+JztcbiAgICAgICAgICAgICAgICAgICAgICAgICQoY29uZmVyZW5jZXNbaV0gKyAnID4gZGl2Om50aC1jaGlsZCgnICsgKHBsYWNlICsgMSkgKyAnKScpLmh0bWwocm93SFRNTCk7XG4gICAgICAgICAgICAgICAgICAgICAgICAkKGNvbmZlcmVuY2VzW2ldICsgJyA+IGRpdjpudGgtY2hpbGQoJyArIChwbGFjZSArIDEpICsgJyknKS5hZGRDbGFzcyhhY3RpdmVTdGF0dXMpO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfSk7XG59O1xuXG5mdW5jdGlvbiBzY29yZXNJbml0KHRvZGF5c1Njb3Jlc0RhdGEpIHtcbiAgICB2YXIgbGl2ZVNjb3JlcyA9IHRvZGF5c1Njb3Jlc0RhdGEuZ3MuZztcbiAgICBpZiAobGl2ZVNjb3Jlcy5sZW5ndGggIT0gMCkge1xuICAgICAgICB2YXIgc2Vhc29uVHlwZSA9ICcnO1xuICAgICAgICBpZiAobGl2ZVNjb3Jlc1swXS5naWQuc3Vic3RyKDAsIDMpID09ICcwMDEnKSB7XG4gICAgICAgICAgICBzZWFzb25UeXBlID0gJ3ByZSc7XG4gICAgICAgIH0gZWxzZSBpZiAobGl2ZVNjb3Jlc1swXS5naWQuc3Vic3RyKDAsIDMpID09ICcwMDQnKSB7XG4gICAgICAgICAgICBzZWFzb25UeXBlID0gJ3Bvc3QnO1xuICAgICAgICB9XG4gICAgICAgIGlmIChsaXZlU2NvcmVzLmxlbmd0aCA+IDEgfHwgKGxpdmVTY29yZXMubGVuZ3RoID09IDEgJiYgbGl2ZVNjb3Jlc1swXS5oLnRhICE9ICdCT1MnKSkge1xuICAgICAgICAgICAgdmFyIHN0YXR1c0NvZGVzID0gWycxc3QgUXRyJywgJzJuZCBRdHInLCAnM3JkIFF0cicsICc0dGggUXRyJywgJzFzdCBPVCcsICcybmQgT1QnLCAnM3JkIE9UJywgJzR0aCBPVCcsICc1dGggT1QnLCAnNnRoIE9UJywgJzd0aCBPVCcsICc4dGggT1QnLCAnOXRoIE9UJywgJzEwdGggT1QnXTtcbiAgICAgICAgICAgIHZhciBzY29yZXNIVE1MID0gJyc7XG4gICAgICAgICAgICBmb3IgKHZhciBpID0gbGl2ZVNjb3Jlcy5sZW5ndGggLSAxOyBpID49IDA7IGktLSkge1xuICAgICAgICAgICAgICAgIGlmIChsaXZlU2NvcmVzW2ldLmgudGEgIT09ICdCT1MnKSB7XG4gICAgICAgICAgICAgICAgICAgIHZhciB2U2NvcmUgPSAnJztcbiAgICAgICAgICAgICAgICAgICAgdmFyIGhTY29yZSA9ICcnO1xuICAgICAgICAgICAgICAgICAgICBpZiAobGl2ZVNjb3Jlc1tpXS5zdCAhPSAxKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICB2U2NvcmUgPSBsaXZlU2NvcmVzW2ldLnYucztcbiAgICAgICAgICAgICAgICAgICAgICAgIGhTY29yZSA9IGxpdmVTY29yZXNbaV0uaC5zO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIHZhciBzVGV4dCA9IGxpdmVTY29yZXNbaV0uc3R0O1xuICAgICAgICAgICAgICAgICAgICBpZiAoc3RhdHVzQ29kZXMuaW5kZXhPZihsaXZlU2NvcmVzW2ldLnN0dCkgIT09IC0xKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBzVGV4dCA9IGxpdmVTY29yZXNbaV0uc3R0ICsgJyAtICcgKyBsaXZlU2NvcmVzW2ldLmNsO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIHNjb3Jlc0hUTUwgKz0gJzxkaXYgY2xhc3M9XCJzY29yZS13cmFwXCI+PGRpdiBjbGFzcz1cInNjb3JlLXN0YXR1c1wiPicgKyBzVGV4dCArICc8L2Rpdj48ZGl2IGNsYXNzPVwiJyArIGxpdmVTY29yZXNbaV0udi50YSArICdcIj48aW1nIHNyYz1cImh0dHA6Ly9zdGF0cy5uYmEuY29tL21lZGlhL2ltZy90ZWFtcy9sb2dvcy8nICsgbGl2ZVNjb3Jlc1tpXS52LnRhLnRvVXBwZXJDYXNlKCkgKyAnX2xvZ28uc3ZnXCI+ICcgKyBsaXZlU2NvcmVzW2ldLnYudGMudG9VcHBlckNhc2UoKSArICcgJyArIGxpdmVTY29yZXNbaV0udi50bi50b1VwcGVyQ2FzZSgpICsgJyA8ZGl2IGNsYXNzPVwic2NvcmUtbnVtXCI+JyArIHZTY29yZSArICc8L2Rpdj48L2Rpdj48ZGl2IGNsYXNzPVwiJyArIGxpdmVTY29yZXNbaV0uaC50YSArICdcIj48aW1nIHNyYz1cImh0dHA6Ly9zdGF0cy5uYmEuY29tL21lZGlhL2ltZy90ZWFtcy9sb2dvcy8nICsgbGl2ZVNjb3Jlc1tpXS5oLnRhLnRvVXBwZXJDYXNlKCkgKyAnX2xvZ28uc3ZnXCI+ICcgKyBsaXZlU2NvcmVzW2ldLmgudGMudG9VcHBlckNhc2UoKSArICcgJyArIGxpdmVTY29yZXNbaV0uaC50bi50b1VwcGVyQ2FzZSgpICsgJyA8ZGl2IGNsYXNzPVwic2NvcmUtbnVtXCI+JyArIGhTY29yZSArICc8L2Rpdj48L2Rpdj48L2Rpdj4nO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgICQoJy5zY29yZXMnKS5lbXB0eSgpLmFwcGVuZChzY29yZXNIVE1MKTtcbiAgICAgICAgfVxuICAgICAgICBpZiAobGl2ZVNjb3Jlcy5sZW5ndGggPCA1KXtcbiAgICAgICAgICAgICQoJy5sZWFndWUtbGVhZGVycycpLnNob3coKTtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICQoJy5sZWFndWUtbGVhZGVycycpLmhpZGUoKTtcbiAgICAgICAgfVxuICAgIH1cbn1cblxuZnVuY3Rpb24gdXBkYXRlTGVhZ3VlU2NvcmVzKHRvZGF5c1Njb3Jlc0RhdGEpIHtcbiAgICB2YXIgbGl2ZVNjb3JlcyA9IHRvZGF5c1Njb3Jlc0RhdGEuZ3MuZztcbiAgICBpZiAobGl2ZVNjb3Jlcy5sZW5ndGggIT0gMCkge1xuICAgICAgICB2YXIgc2Vhc29uVHlwZSA9ICdSZWd1bGFyK1NlYXNvbic7XG4gICAgICAgIGlmIChsaXZlU2NvcmVzWzBdLmdpZC5zdWJzdHIoMCwzKSA9PSAnMDAxJykge1xuICAgICAgICAgICAgc2Vhc29uVHlwZSA9ICdQcmUrU2Vhc29uJztcbiAgICAgICAgfVxuICAgICAgICBlbHNlIGlmIChsaXZlU2NvcmVzWzBdLmdpZC5zdWJzdHIoMCwzKSA9PSAnMDA0Jykge1xuICAgICAgICAgICAgc2Vhc29uVHlwZSA9ICdQbGF5b2Zmcyc7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKGxpdmVTY29yZXMubGVuZ3RoID4gMSB8fCAobGl2ZVNjb3Jlcy5sZW5ndGggPT0gMSAmJiBsaXZlU2NvcmVzWzBdLmgudGEgIT0gJ0JPUycpKSB7XG4gICAgICAgICAgICB2YXIgc3RhdHVzQ29kZXMgPSBbJzFzdCBRdHInLCcybmQgUXRyJywnM3JkIFF0cicsJzR0aCBRdHInLCcxc3QgT1QnLCcybmQgT1QnLCczcmQgT1QnLCc0dGggT1QnLCc1dGggT1QnLCc2dGggT1QnLCc3dGggT1QnLCc4dGggT1QnLCc5dGggT1QnLCcxMHRoIE9UJ107XG4gICAgICAgICAgICB2YXIgc2NvcmVzSFRNTCA9ICcnO1xuICAgICAgICAgICAgaWYgKCQoJy5hdGwtaGVhZGVyJykubGVuZ3RoID09PSAwKSB7XG4gICAgICAgICAgICAgICAgJCgnI2xlZnR3cmFwJykucHJlcGVuZCgnPGltZyBjbGFzcz1cImF0bC1oZWFkZXJcIiBzcmM9XCJodHRwOi8vaS5jZG4udHVybmVyLmNvbS9uYmEvbmJhLy5lbGVtZW50L21lZGlhLzIuMC90ZWFtc2l0ZXMvY2VsdGljcy9tZWRpYS9zaWduYWdlLWF0bC05NjB4MTM1LnBuZ1wiPicpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZm9yICh2YXIgaSA9IGxpdmVTY29yZXMubGVuZ3RoIC0gMTsgaSA+PSAwOyBpLS0pIHtcbiAgICAgICAgICAgICAgICBpZiAobGl2ZVNjb3Jlc1tpXS5oLnRhICE9PSAnQk9TJykge1xuICAgICAgICAgICAgICAgICAgICB2YXIgdlNjb3JlID0gJyc7XG4gICAgICAgICAgICAgICAgICAgIHZhciBoU2NvcmUgPSAnJztcbiAgICAgICAgICAgICAgICAgICAgaWYgKGxpdmVTY29yZXNbaV0uc3QgIT0gMSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgdlNjb3JlID0gbGl2ZVNjb3Jlc1tpXS52LnM7XG4gICAgICAgICAgICAgICAgICAgICAgICBoU2NvcmUgPSBsaXZlU2NvcmVzW2ldLmgucztcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB2YXIgc1RleHQgPSBsaXZlU2NvcmVzW2ldLnN0dDtcbiAgICAgICAgICAgICAgICAgICAgaWYgKHN0YXR1c0NvZGVzLmluZGV4T2YobGl2ZVNjb3Jlc1tpXS5zdHQpICE9PSAtMSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgc1RleHQgPSBsaXZlU2NvcmVzW2ldLnN0dCArICcgLSAnICsgbGl2ZVNjb3Jlc1tpXS5jbDtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICBzY29yZXNIVE1MICs9ICc8ZGl2IGNsYXNzPVwic2NvcmUtd3JhcFwiPjxkaXYgY2xhc3M9XCJzY29yZS1jb250YWluZXJcIj48ZGl2IGNsYXNzPVwiJyArIGxpdmVTY29yZXNbaV0udi50YSArICdcIj48aW1nIHNyYz1cImh0dHA6Ly9zdGF0cy5uYmEuY29tL21lZGlhL2ltZy90ZWFtcy9sb2dvcy8nICsgbGl2ZVNjb3Jlc1tpXS52LnRhLnRvVXBwZXJDYXNlKCkgKyAnX2xvZ28uc3ZnXCI+ICcgKyBsaXZlU2NvcmVzW2ldLnYudGMudG9VcHBlckNhc2UoKSArICcgJyArIGxpdmVTY29yZXNbaV0udi50bi50b1VwcGVyQ2FzZSgpICsgJyA8ZGl2IGNsYXNzPVwic2NvcmUtbnVtXCI+JyArIHZTY29yZSArICc8L2Rpdj48L2Rpdj48ZGl2IGNsYXNzPVwiJyArIGxpdmVTY29yZXNbaV0uaC50YSArICdcIj48aW1nIHNyYz1cImh0dHA6Ly9zdGF0cy5uYmEuY29tL21lZGlhL2ltZy90ZWFtcy9sb2dvcy8nICsgbGl2ZVNjb3Jlc1tpXS5oLnRhLnRvVXBwZXJDYXNlKCkgKyAnX2xvZ28uc3ZnXCI+ICcgKyBsaXZlU2NvcmVzW2ldLmgudGMudG9VcHBlckNhc2UoKSArICcgJyArIGxpdmVTY29yZXNbaV0uaC50bi50b1VwcGVyQ2FzZSgpICsgJyA8ZGl2IGNsYXNzPVwic2NvcmUtbnVtXCI+JyArIGhTY29yZSArICc8L2Rpdj48L2Rpdj48ZGl2IGNsYXNzPVwic2NvcmUtc3RhdHVzXCI+JyArIHNUZXh0ICsgJzwvZGl2PjwvZGl2PjwvZGl2Pic7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgJCgnLnNjb3JlcycpLmVtcHR5KCkuYXBwZW5kKHNjb3Jlc0hUTUwpO1xuICAgICAgICAgICAgbGVhZ3VlTGVhZGVycyhzZWFzb25UeXBlKTtcbiAgICAgICAgfVxuICAgIH1cbn1cblxuZnVuY3Rpb24gbGVhZ3VlTGVhZGVycygpe1xuICAgIHZhciBsZWFndWVMZWFkZXJzSFRNTCA9ICc8ZGl2IGNsYXNzPVwidGl0bGVcIj48cD5MRUFERVJTPC9wPjxwPlBUUzwvcD48cD5SRUI8L3A+PHA+QVNUPC9wPjxwPlNUTDwvcD48cD5CTEs8L3A+PC9kaXY+JztcbiAgICB2YXIgc3RhdFR5cGUgPSAnJztcbiAgICB2YXIgZGF0YUluZGV4ID0gW1wiUkFOS1wiLFwiUExBWUVSX0lEXCIsXCJQTEFZRVJcIixcIlRFQU1fSURcIixcIlRFQU1fQUJCUkVWSUFUSU9OXCJdO1xuXG4gICAgJC5hamF4KHtcbiAgICAgICAgdXJsOiAnaHR0cDovL2xvY2FsaG9zdDo4ODg4L2RhdGEvbGVhZ3VlX2xlYWRlcnMuanNvbicsXG4gICAgICAgIGFzeW5jOiBmYWxzZSxcbiAgICAgICAgc3VjY2VzczogZnVuY3Rpb24oZGF0YSkge1xuICAgICAgICAgICAgdmFyIGxlYWRlcnNEYXRhID0gZGF0YS5yZXN1bHRTZXRzO1xuICAgICAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBsZWFkZXJzRGF0YS5sZW5ndGg7IGkrKyl7XG4gICAgICAgICAgICAgICAgdmFyIGluZGV4ID0gY3JlYXRlSW5kZXgoZGF0YUluZGV4LCBsZWFkZXJzRGF0YVtpXS5oZWFkZXJzKTtcbiAgICAgICAgICAgICAgICB2YXIgcm93cyA9ICcnO1xuICAgICAgICAgICAgICAgIGZvciAobGV0IHggPSAwOyB4IDwgbGVhZGVyc0RhdGFbaV0ucm93U2V0Lmxlbmd0aDsgeCsrKXtcbiAgICAgICAgICAgICAgICAgICAgcm93cyArPSAnPGRpdiBjbGFzcz1cInJvd1wiPjxkaXYgY2xhc3M9XCJsZWZ0XCI+PGRpdiBjbGFzcz1cInBsYWNlXCI+JyArIGxlYWRlcnNEYXRhW2ldLnJvd1NldFt4XVswXSArICc8L2Rpdj48ZGl2IGNsYXNzPVwibG9nby13cmFwXCI+PGltZyBjbGFzcz1cImxvZ29cIiBzcmM9XCJodHRwOi8vc3RhdHMubmJhLmNvbS9tZWRpYS9pbWcvdGVhbXMvbG9nb3MvJyArIGxlYWRlcnNEYXRhW2ldLnJvd1NldFt4XVs0XSArICdfbG9nby5zdmdcIi8+PC9kaXY+PGRpdiBjbGFzcz1cIm5hbWVcIj4nICsgbGVhZGVyc0RhdGFbaV0ucm93U2V0W3hdWzJdLnRvVXBwZXJDYXNlKCkgKyAnPC9kaXY+PC9kaXY+PGRpdiBjbGFzcz1cInJpZ2h0XCI+PGRpdiBjbGFzcz1cInZhbHVlXCI+JyArIGxlYWRlcnNEYXRhW2ldLnJvd1NldFt4XVs4XSArICc8L2Rpdj48L2Rpdj48L2Rpdj4nO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBsZWFndWVMZWFkZXJzSFRNTCArPSAnPGRpdiBjbGFzcz1cImxlYWd1ZS1sZWFkZXJzLXdyYXBcIj4nICsgcm93cyArICc8L2Rpdj4nO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfSk7XG4gICAgJCgnLmxlYWd1ZS1sZWFkZXJzJykuZW1wdHkoKS5hcHBlbmQobGVhZ3VlTGVhZGVyc0hUTUwpO1xufVxuIl19
