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

    if ($('.left-wrap .scores').hasClass('transition-1')) {
        $('.left-wrap .scores').removeClass('transition-1');
    } else {
        $('.left-wrap .scores').addClass('transition-1');
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
            $('.scores').empty().append(scoresHTML + '<div class="league-leaders"></div>');
        }
        if (liveScores < 5) {
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
    var leagueLeadersHTML = '';
    var statType = '';
    $.ajax({
        url: 'http://localhost:8888/data/league_leaders.json',
        success: function success(data) {
            var leadersData = data.resultSets;
            for (var i = 0; i < leadersData.length; i++) {
                statType = leadersData[i].headers[leadersData[i].headers.length - 1];
                console.log(statType);
                for (var x = 0; x < leadersData[i].rowSet.length; x++) {
                    leaderHTML = '<p>' + leadersData[i].rowSet[x][3] + '</p>';
                    $('.league-leaders-wrap div[data-stat-type="' + statType + '"]').append(leaderHTML);
                }
            }
            $('.league-leaders-wrap div[data-stat-type="' + statType + '"]').html(leaderHTML);
        }
    });
    $('.league-leaders').html(leagueLeadersHTML);
}

},{}]},{},[1])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJzcmMvanMvY29uY291cnNlLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7QUNBQSxJQUFJLFlBQVk7QUFDWixhQUFTO0FBQ0wsZ0JBQVEsRUFESDtBQUVMLGlCQUFTO0FBQ0wsaUJBQUssQ0FDRCxDQUFDLElBQUQsRUFBTyxJQUFQLEVBQWEsSUFBYixFQUFtQixJQUFuQixDQURDLEVBRUQsQ0FBQyxJQUFELEVBQU8sSUFBUCxFQUFhLElBQWIsRUFBbUIsSUFBbkIsQ0FGQyxFQUdELENBQUMsSUFBRCxFQUFPLElBQVAsRUFBYSxJQUFiLEVBQW1CLElBQW5CLENBSEMsQ0FEQTtBQU1MLGlCQUFLLENBQ0QsQ0FBQyxJQUFELEVBQU8sSUFBUCxFQUFhLElBQWIsRUFBbUIsSUFBbkIsQ0FEQyxFQUVELENBQUMsSUFBRCxFQUFPLElBQVAsRUFBYSxJQUFiLEVBQW1CLElBQW5CLENBRkMsRUFHRCxDQUFDLElBQUQsRUFBTyxJQUFQLEVBQWEsSUFBYixFQUFtQixJQUFuQixDQUhDLENBTkE7QUFXTCxpQkFBSyxDQUNELENBQUMsSUFBRCxFQUFPLElBQVAsRUFBYSxJQUFiLEVBQW1CLElBQW5CLENBREMsRUFFRCxDQUFDLElBQUQsRUFBTyxJQUFQLEVBQWEsSUFBYixFQUFtQixJQUFuQixDQUZDLEVBR0QsQ0FBQyxJQUFELEVBQU8sSUFBUCxFQUFhLElBQWIsRUFBbUIsSUFBbkIsQ0FIQztBQVhBO0FBRkosS0FERztBQXFCWixVQUFNO0FBQ0YsZ0JBQVEsRUFETjtBQUVGLGlCQUFTO0FBQ0wsaUJBQUssQ0FDRCxDQUFDLElBQUQsRUFBTyxJQUFQLEVBQWEsSUFBYixFQUFtQixJQUFuQixDQURDLEVBRUQsQ0FBQyxJQUFELEVBQU8sSUFBUCxFQUFhLElBQWIsRUFBbUIsSUFBbkIsQ0FGQyxFQUdELENBQUMsSUFBRCxFQUFPLElBQVAsRUFBYSxJQUFiLEVBQW1CLElBQW5CLENBSEMsQ0FEQTtBQU1MLGlCQUFLLENBQ0QsQ0FBQyxJQUFELEVBQU8sSUFBUCxFQUFhLElBQWIsRUFBbUIsSUFBbkIsQ0FEQyxFQUVELENBQUMsSUFBRCxFQUFPLElBQVAsRUFBYSxJQUFiLEVBQW1CLElBQW5CLENBRkMsRUFHRCxDQUFDLElBQUQsRUFBTyxJQUFQLEVBQWEsSUFBYixFQUFtQixJQUFuQixDQUhDLENBTkE7QUFXTCxpQkFBSyxDQUNELENBQUMsSUFBRCxFQUFPLElBQVAsRUFBYSxJQUFiLEVBQW1CLElBQW5CLENBREMsRUFFRCxDQUFDLElBQUQsRUFBTyxJQUFQLEVBQWEsSUFBYixFQUFtQixJQUFuQixDQUZDLEVBR0QsQ0FBQyxJQUFELEVBQU8sSUFBUCxFQUFhLElBQWIsRUFBbUIsSUFBbkIsQ0FIQztBQVhBO0FBRlA7QUFyQk0sQ0FBaEI7QUEwQ0EsRUFBRSxRQUFGLEVBQVksS0FBWixDQUFrQixZQUFXO0FBQ3pCLFFBQUksTUFBTSxFQUFWO0FBQ0EsUUFBSSxXQUFXLEVBQWY7QUFDQSxRQUFJLGNBQWMsS0FBbEI7QUFDQSxRQUFJLHlCQUF5QixFQUE3QjtBQUNBLFFBQUksT0FBTyxJQUFJLElBQUosRUFBWDtBQUNBLFFBQUksa0JBQWtCLEtBQXRCO0FBQ0EsTUFBRSxJQUFGLENBQU87QUFDSCxhQUFLLGlFQURGO0FBRUgsZUFBTyxLQUZKO0FBR0gsaUJBQVMsaUJBQVMsZ0JBQVQsRUFBMkI7QUFDaEMsaUJBQUssSUFBSSxJQUFJLENBQWIsRUFBZ0IsSUFBSSxpQkFBaUIsRUFBakIsQ0FBb0IsQ0FBcEIsQ0FBc0IsTUFBMUMsRUFBa0QsR0FBbEQsRUFBdUQ7QUFDbkQsb0JBQUksaUJBQWlCLEVBQWpCLENBQW9CLENBQXBCLENBQXNCLENBQXRCLEVBQXlCLENBQXpCLENBQTJCLEVBQTNCLElBQWlDLEtBQXJDLEVBQTRDO0FBQUU7QUFDMUMsK0JBQVcsaUJBQWlCLEVBQWpCLENBQW9CLENBQXBCLENBQXNCLENBQXRCLEVBQXlCLENBQXpCLENBQTJCLEVBQXRDO0FBQ0EsbUNBQWUsUUFBZjtBQUNBLCtCQUFXLGdCQUFYO0FBQ0Esa0NBQWMsUUFBZDtBQUNBO0FBQ3BCO0FBQ29CLDBCQUFNLGlCQUFpQixFQUFqQixDQUFvQixDQUFwQixDQUFzQixDQUF0QixFQUF5QixHQUEvQjtBQUNwQjs7QUFFb0I7QUFDSDtBQUNKO0FBQ0o7QUFsQkUsS0FBUDtBQW9CQTtBQUNBO0FBQ0gsQ0E3QkQ7QUE4QkE7OztBQUdBLFNBQVMsU0FBVCxDQUFtQixHQUFuQixFQUF3QjtBQUNwQixRQUFJLFFBQVEsSUFBSSxJQUFKLEVBQVo7QUFDQSxRQUFJLFlBQVksSUFBSSxJQUFKLENBQVMsR0FBVCxDQUFoQjtBQUNBLFFBQUksTUFBTSxNQUFNLFdBQU4sS0FBc0IsVUFBVSxXQUFWLEVBQWhDO0FBQ0EsV0FBTyxHQUFQO0FBQ0g7O0FBRUQsU0FBUyxnQkFBVCxDQUEwQixjQUExQixFQUEwQztBQUN0QztBQUNBLFFBQUksZ0JBQWdCLFVBQVUsT0FBVixDQUFrQixNQUFsQixDQUF5QixjQUF6QixFQUF5QyxLQUF6QyxDQUErQyxFQUEvQyxDQUFrRCxNQUF0RTtBQUNBLFFBQUksZUFBZSxFQUFuQjtBQUNBLFFBQUksaUJBQWlCLEVBQXJCO0FBQ0EsU0FBSyxJQUFJLElBQUksQ0FBYixFQUFnQixJQUFJLGFBQXBCLEVBQW1DLEdBQW5DLEVBQXdDO0FBQ3BDLFlBQUksbUJBQW1CLFVBQVUsT0FBVixDQUFrQixNQUFsQixDQUF5QixjQUF6QixFQUF5QyxLQUF6QyxDQUErQyxFQUEvQyxDQUFrRCxDQUFsRCxFQUFxRCxFQUE1RTtBQUNBLFlBQUksU0FBUyxVQUFVLE9BQVYsQ0FBa0IsTUFBbEIsQ0FBeUIsY0FBekIsRUFBeUMsS0FBekMsQ0FBK0MsRUFBL0MsQ0FBa0QsQ0FBbEQsRUFBcUQsR0FBckQsQ0FBeUQsTUFBdEU7QUFDQSxZQUFJLGVBQWUsRUFBbkI7QUFDQSxZQUFJLFFBQVEsRUFBWjtBQUNBLFlBQUksaUJBQWlCLFVBQVUsT0FBVixDQUFrQixNQUFsQixDQUF5QixjQUF6QixFQUF5QyxLQUF6QyxDQUErQyxFQUEvQyxDQUFrRCxDQUFsRCxFQUFxRCxHQUExRTtBQUNBLFlBQUksTUFBTSxDQUFOLElBQVcscUJBQXFCLFVBQVUsT0FBVixDQUFrQixNQUFsQixDQUF5QixjQUF6QixFQUF5QyxLQUF6QyxDQUErQyxFQUEvQyxDQUFrRCxJQUFJLENBQXRELEVBQXlELEVBQTdGLEVBQWlHO0FBQUU7QUFDL0Ysb0JBQVEsZ0JBQVI7QUFDSDtBQUNELFlBQUksTUFBSixFQUFZO0FBQ1IsaUJBQUssSUFBSSxJQUFJLENBQWIsRUFBZ0IsSUFBSSxNQUFwQixFQUE0QixHQUE1QixFQUFpQztBQUM3QixvQkFBSSxRQUFRLFVBQVUsT0FBVixDQUFrQixNQUFsQixDQUF5QixjQUF6QixFQUF5QyxLQUF6QyxDQUErQyxFQUEvQyxDQUFrRCxDQUFsRCxFQUFxRCxFQUFqRTtBQUNBLG9CQUFJLEtBQUssVUFBVSxPQUFWLENBQWtCLE1BQWxCLENBQXlCLGNBQXpCLEVBQXlDLEtBQXpDLENBQStDLEVBQS9DLENBQWtELENBQWxELEVBQXFELEdBQXJELENBQXlELENBQXpELEVBQTRELEVBQXJFO0FBQ0Esb0JBQUksZUFBZSxLQUFLLEtBQUwsQ0FBWSxLQUFLLEtBQU4sR0FBZSxHQUExQixDQUFuQjtBQUNBLG1DQUFtQixVQUFVLE9BQVYsQ0FBa0IsTUFBbEIsQ0FBeUIsY0FBekIsRUFBeUMsS0FBekMsQ0FBK0MsRUFBL0MsQ0FBa0QsQ0FBbEQsRUFBcUQsR0FBckQsQ0FBeUQsQ0FBekQsRUFBNEQsRUFBL0U7QUFDQSxvQkFBSSxNQUFNLENBQU4sSUFBVyxxQkFBcUIsVUFBVSxPQUFWLENBQWtCLE1BQWxCLENBQXlCLGNBQXpCLEVBQXlDLEtBQXpDLENBQStDLEVBQS9DLENBQWtELElBQUksQ0FBdEQsRUFBeUQsRUFBOUUsSUFBb0YscUJBQXFCLFVBQVUsT0FBVixDQUFrQixNQUFsQixDQUF5QixjQUF6QixFQUF5QyxLQUF6QyxDQUErQyxFQUEvQyxDQUFrRCxJQUFJLENBQXRELEVBQXlELEVBQWpMLEVBQXFMO0FBQUU7QUFDbkwsNEJBQVEsZ0JBQVI7QUFDSCxpQkFGRCxNQUVPO0FBQ0gsNEJBQVEsRUFBUjtBQUNIO0FBQ0QsZ0NBQWdCLDRCQUE0QixjQUE1QixHQUE2QyxlQUE3QyxHQUErRCxnQkFBL0QsR0FBa0Ysa0NBQWxGLEdBQXVILGdCQUF2SCxHQUEwSSxVQUExSSxHQUF1SixLQUF2SixHQUErSixZQUEvSztBQUNIO0FBQ0osU0FiRCxNQWFPO0FBQ0gsMkJBQWUsNEJBQTRCLGNBQTVCLEdBQTZDLGVBQTdDLEdBQStELGdCQUEvRCxHQUFrRix5QkFBbEYsR0FBOEcsZ0JBQTlHLEdBQWlJLFVBQWpJLEdBQThJLEtBQTlJLEdBQXNKLFlBQXJLO0FBQ0g7QUFDRCx3QkFBZ0IsMEJBQTBCLFlBQTFCLEdBQXlDLFFBQXpEO0FBQ0EsMEJBQWtCLDZCQUE2QixjQUE3QixHQUE4QyxZQUFoRTtBQUNIO0FBQ0QsTUFBRSxnQkFBRixFQUFvQixJQUFwQixDQUF5QixvQ0FBb0MsWUFBcEMsR0FBbUQsMENBQW5ELEdBQWdHLGNBQWhHLEdBQWlILFFBQTFJO0FBQ0g7QUFDRDs7O0FBR0EsU0FBUyxJQUFULEdBQWdCO0FBQ1osUUFBSSxDQUFDLFdBQUwsRUFBa0I7QUFDZCxVQUFFLElBQUYsQ0FBTztBQUNILGlCQUFLLGlFQURGO0FBRUgsbUJBQU8sS0FGSjtBQUdILHFCQUFTLGlCQUFTLGdCQUFULEVBQTJCO0FBQ2hDLG9CQUFJLE1BQU0sRUFBVjtBQUNBLHFCQUFLLElBQUksSUFBSSxDQUFiLEVBQWdCLElBQUksaUJBQWlCLEVBQWpCLENBQW9CLENBQXBCLENBQXNCLE1BQTFDLEVBQWtELEdBQWxELEVBQXVEO0FBQ25ELHdCQUFJLGlCQUFpQixFQUFqQixDQUFvQixDQUFwQixDQUFzQixDQUF0QixFQUF5QixDQUF6QixDQUEyQixFQUEzQixJQUFpQyxLQUFyQyxFQUE0QztBQUFFO0FBQzFDLDRCQUFJLGlCQUFpQixFQUFqQixDQUFvQixDQUFwQixDQUFzQixDQUF0QixNQUE2QixDQUFqQyxFQUFvQztBQUNoQywwQ0FBYyxJQUFkO0FBQ0g7QUFDSjtBQUNKO0FBQ0o7QUFaRSxTQUFQO0FBY0g7QUFDSjs7QUFFRCxTQUFTLGFBQVQsR0FBeUI7QUFDckIsUUFBSSxVQUFVLENBQWQ7QUFDQSxnQkFBWSxZQUFXO0FBQ25CLFVBQUUsdUJBQUYsRUFBMkIsV0FBM0IsQ0FBdUMsUUFBdkM7QUFDQSxVQUFFLHNCQUFGLEVBQTBCLFdBQTFCLENBQXNDLFFBQXRDO0FBQ0EsVUFBRSxzQ0FBc0MsT0FBdEMsR0FBZ0QsR0FBbEQsRUFBdUQsUUFBdkQsQ0FBZ0UsUUFBaEU7QUFDQSxVQUFFLHVDQUF1QyxPQUF2QyxHQUFpRCxHQUFuRCxFQUF3RCxRQUF4RCxDQUFpRSxRQUFqRTtBQUNBLFlBQUksV0FBVyxDQUFmLEVBQWtCO0FBQ2Qsc0JBQVUsQ0FBVjtBQUNILFNBRkQsTUFFTztBQUNIO0FBQ0g7QUFDSixLQVZELEVBVUcsSUFWSDtBQVdIOztBQUVEOzs7O0FBSUEsU0FBUyxjQUFULENBQXdCLFFBQXhCLEVBQWtDO0FBQzlCLFFBQUksU0FBUyxFQUFiO0FBQ0EsTUFBRSxJQUFGLENBQU87QUFDSCxhQUFLLGtFQURGO0FBRUgsZUFBTyxLQUZKO0FBR0gsaUJBQVMsaUJBQVMsSUFBVCxFQUFlO0FBQ3BCLHFCQUFTLElBQVQ7QUFDQSxpQkFBSyxJQUFJLFFBQVQsSUFBcUIsT0FBTyxDQUE1QixFQUErQjtBQUMzQixvQkFBSSxhQUFhLElBQWpCLEVBQXVCO0FBQ25CLDhCQUFVLE9BQVYsQ0FBa0IsUUFBbEIsSUFBOEIsT0FBTyxDQUFQLENBQVMsUUFBVCxDQUE5QjtBQUNIO0FBQ0o7QUFDSixTQVZFO0FBV0gsZUFBTyxpQkFBVyxDQUFFO0FBWGpCLEtBQVA7QUFhQSxRQUFJLGFBQWEsRUFBakI7QUFDQSxNQUFFLElBQUYsQ0FBTztBQUNILGFBQUssK0RBREY7QUFFSCxlQUFPLEtBRko7QUFHSCxpQkFBUyxpQkFBUyxJQUFULEVBQWU7QUFDcEIseUJBQWEsSUFBYjtBQUNBLGlCQUFLLElBQUksUUFBVCxJQUFxQixXQUFXLENBQWhDLEVBQW1DO0FBQy9CLG9CQUFJLGFBQWEsSUFBakIsRUFBdUI7QUFDbkIsOEJBQVUsSUFBVixDQUFlLFFBQWYsSUFBMkIsV0FBVyxDQUFYLENBQWEsUUFBYixDQUEzQjtBQUNIO0FBQ0o7QUFDSixTQVZFO0FBV0gsZUFBTyxpQkFBVyxDQUFFO0FBWGpCLEtBQVA7QUFhQSxRQUFJLFVBQVUsRUFBZDtBQUNBLE1BQUUsSUFBRixDQUFPO0FBQ0gsYUFBSywwQ0FERjtBQUVILGVBQU8sS0FGSjtBQUdILGlCQUFTLGlCQUFTLElBQVQsRUFBZTtBQUNwQixzQkFBVSxJQUFWO0FBQ0gsU0FMRTtBQU1ILGVBQU8saUJBQVcsQ0FBRTtBQU5qQixLQUFQO0FBUUEsU0FBSyxJQUFJLElBQUksQ0FBYixFQUFnQixJQUFJLE9BQU8sQ0FBUCxDQUFTLEVBQVQsQ0FBWSxNQUFoQyxFQUF3QyxHQUF4QyxFQUE2QztBQUN6QyxZQUFJLE1BQU0sT0FBTyxDQUFQLENBQVMsRUFBVCxDQUFZLENBQVosRUFBZSxHQUF6QjtBQUNBLGtCQUFVLE9BQVYsQ0FBa0IsTUFBbEIsQ0FBeUIsR0FBekIsSUFBZ0MsT0FBTyxDQUFQLENBQVMsRUFBVCxDQUFZLENBQVosQ0FBaEM7QUFDQSxhQUFLLElBQUksUUFBVCxJQUFxQixRQUFRLEdBQVIsQ0FBckIsRUFBbUM7QUFDL0Isc0JBQVUsT0FBVixDQUFrQixNQUFsQixDQUF5QixHQUF6QixFQUE4QixHQUE5QixHQUFvQyxRQUFRLEdBQVIsQ0FBcEM7QUFDSDtBQUNELFVBQUUsSUFBRixDQUFPO0FBQ0gsaUJBQUsseUVBQXlFLEdBQXpFLEdBQStFLE9BRGpGO0FBRUgsbUJBQU8sS0FGSjtBQUdILHFCQUFTLGlCQUFTLElBQVQsRUFBZTtBQUNwQiwwQkFBVSxPQUFWLENBQWtCLE1BQWxCLENBQXlCLEdBQXpCLEVBQThCLEtBQTlCLEdBQXNDLEtBQUssRUFBTCxDQUFRLEVBQTlDO0FBQ0gsYUFMRTtBQU1ILG1CQUFPLGlCQUFXLENBQUU7QUFOakIsU0FBUDtBQVFIO0FBQ0QsU0FBSyxJQUFJLElBQUksQ0FBYixFQUFnQixJQUFJLFdBQVcsQ0FBWCxDQUFhLEVBQWIsQ0FBZ0IsTUFBcEMsRUFBNEMsR0FBNUMsRUFBaUQ7QUFDN0MsWUFBSSxNQUFNLFdBQVcsQ0FBWCxDQUFhLEVBQWIsQ0FBZ0IsQ0FBaEIsRUFBbUIsR0FBN0I7QUFDQSxrQkFBVSxJQUFWLENBQWUsTUFBZixDQUFzQixHQUF0QixJQUE2QixXQUFXLENBQVgsQ0FBYSxFQUFiLENBQWdCLENBQWhCLENBQTdCO0FBQ0EsVUFBRSxJQUFGLENBQU87QUFDSCxpQkFBSyxpRkFERixFQUNxRjtBQUN4RixtQkFBTyxLQUZKO0FBR0gscUJBQVMsaUJBQVMsSUFBVCxFQUFlO0FBQ3BCLDBCQUFVLElBQVYsQ0FBZSxNQUFmLENBQXNCLEdBQXRCLEVBQTJCLEtBQTNCLEdBQW1DLEtBQUssRUFBTCxDQUFRLEVBQTNDO0FBQ0gsYUFMRTtBQU1ILG1CQUFPLGlCQUFXLENBQUU7QUFOakIsU0FBUDtBQVFIO0FBQ0QsU0FBSyxJQUFJLElBQVQsSUFBaUIsU0FBakIsRUFBNEI7QUFDeEIsYUFBSyxJQUFJLE1BQVQsSUFBbUIsVUFBVSxJQUFWLEVBQWdCLE1BQW5DLEVBQTJDO0FBQ3ZDLGdCQUFJLFlBQVksVUFBVSxJQUFWLEVBQWdCLE9BQWhCLENBQXdCLEdBQXhDO0FBQ0EsZ0JBQUksYUFBYSxVQUFVLElBQVYsRUFBZ0IsT0FBaEIsQ0FBd0IsR0FBekM7QUFDQSxnQkFBSSxhQUFhLFVBQVUsSUFBVixFQUFnQixPQUFoQixDQUF3QixHQUF6QztBQUNBLGlCQUFLLElBQUksSUFBVCxJQUFpQixVQUFVLElBQVYsRUFBZ0IsT0FBakMsRUFBMEM7QUFDdEMscUJBQUssSUFBSSxJQUFJLENBQWIsRUFBZ0IsSUFBSSxDQUFwQixFQUF1QixHQUF2QixFQUE0QjtBQUN4Qix3QkFBSSxVQUFVLElBQVYsRUFBZ0IsT0FBaEIsQ0FBd0IsSUFBeEIsRUFBOEIsQ0FBOUIsRUFBaUMsQ0FBakMsS0FBdUMsSUFBdkMsSUFBK0MsVUFBVSxJQUFWLEVBQWdCLE1BQWhCLENBQXVCLE1BQXZCLEVBQStCLEtBQS9CLENBQXFDLElBQXJDLElBQTZDLENBQWhHLEVBQW1HO0FBQy9GLGtDQUFVLElBQVYsRUFBZ0IsT0FBaEIsQ0FBd0IsSUFBeEIsRUFBOEIsQ0FBOUIsRUFBaUMsQ0FBakMsSUFBc0MsVUFBVSxJQUFWLEVBQWdCLE1BQWhCLENBQXVCLE1BQXZCLEVBQStCLEVBQS9CLENBQWtDLFdBQWxDLEVBQXRDO0FBQ0Esa0NBQVUsSUFBVixFQUFnQixPQUFoQixDQUF3QixJQUF4QixFQUE4QixDQUE5QixFQUFpQyxDQUFqQyxJQUFzQyxVQUFVLElBQVYsRUFBZ0IsTUFBaEIsQ0FBdUIsTUFBdkIsRUFBK0IsRUFBL0IsQ0FBa0MsV0FBbEMsRUFBdEM7QUFDQSxrQ0FBVSxJQUFWLEVBQWdCLE9BQWhCLENBQXdCLElBQXhCLEVBQThCLENBQTlCLEVBQWlDLENBQWpDLElBQXNDLFVBQVUsSUFBVixFQUFnQixNQUFoQixDQUF1QixNQUF2QixFQUErQixLQUEvQixDQUFxQyxJQUFyQyxDQUF0QztBQUNBLGtDQUFVLElBQVYsRUFBZ0IsT0FBaEIsQ0FBd0IsSUFBeEIsRUFBOEIsQ0FBOUIsRUFBaUMsQ0FBakMsSUFBc0MsVUFBVSxJQUFWLEVBQWdCLE1BQWhCLENBQXVCLE1BQXZCLEVBQStCLEdBQXJFO0FBQ0E7QUFDSCxxQkFORCxNQU1PLElBQUksVUFBVSxJQUFWLEVBQWdCLE1BQWhCLENBQXVCLE1BQXZCLEVBQStCLEtBQS9CLENBQXFDLElBQXJDLElBQTZDLFVBQVUsSUFBVixFQUFnQixPQUFoQixDQUF3QixJQUF4QixFQUE4QixDQUE5QixFQUFpQyxDQUFqQyxDQUE3QyxJQUFvRixVQUFVLElBQVYsRUFBZ0IsTUFBaEIsQ0FBdUIsTUFBdkIsRUFBK0IsS0FBL0IsQ0FBcUMsSUFBckMsSUFBNkMsQ0FBckksRUFBd0k7QUFDM0ksa0NBQVUsSUFBVixFQUFnQixPQUFoQixDQUF3QixJQUF4QixFQUE4QixDQUE5QixFQUFpQyxDQUFqQyxJQUFzQyxVQUFVLElBQVYsRUFBZ0IsTUFBaEIsQ0FBdUIsTUFBdkIsRUFBK0IsRUFBL0IsQ0FBa0MsV0FBbEMsRUFBdEM7QUFDQSxrQ0FBVSxJQUFWLEVBQWdCLE9BQWhCLENBQXdCLElBQXhCLEVBQThCLENBQTlCLEVBQWlDLENBQWpDLElBQXNDLFVBQVUsSUFBVixFQUFnQixNQUFoQixDQUF1QixNQUF2QixFQUErQixFQUEvQixDQUFrQyxXQUFsQyxFQUF0QztBQUNBLGtDQUFVLElBQVYsRUFBZ0IsT0FBaEIsQ0FBd0IsSUFBeEIsRUFBOEIsQ0FBOUIsRUFBaUMsQ0FBakMsSUFBc0MsVUFBVSxJQUFWLEVBQWdCLE1BQWhCLENBQXVCLE1BQXZCLEVBQStCLEtBQS9CLENBQXFDLElBQXJDLENBQXRDO0FBQ0Esa0NBQVUsSUFBVixFQUFnQixPQUFoQixDQUF3QixJQUF4QixFQUE4QixDQUE5QixFQUFpQyxDQUFqQyxJQUFzQyxVQUFVLElBQVYsRUFBZ0IsTUFBaEIsQ0FBdUIsTUFBdkIsRUFBK0IsR0FBckU7QUFDQTtBQUNIO0FBQ0o7QUFDSjtBQUNKO0FBQ0o7QUFDRCxZQUFRLEdBQVIsQ0FBWSxTQUFaO0FBQ0g7O0FBRUQsU0FBUyxpQkFBVCxDQUEyQixHQUEzQixFQUFnQztBQUM1QixjQUFVLEdBQVYsRUFBZSxLQUFmLEdBQXVCLEVBQXZCO0FBQ0EsY0FBVSxHQUFWLEVBQWUsS0FBZixDQUFxQixFQUFyQixHQUEwQixDQUFDLEVBQUQsQ0FBMUI7QUFDQSxjQUFVLEdBQVYsRUFBZSxLQUFmLENBQXFCLFFBQXJCLEdBQWdDLEtBQWhDO0FBQ0EsUUFBSSxVQUFVLENBQUMsSUFBRCxFQUFPLElBQVAsRUFBYSxLQUFiLEVBQW9CLEtBQXBCLEVBQTJCLEtBQTNCLEVBQWtDLEtBQWxDLEVBQXlDLE1BQXpDLEVBQWlELE1BQWpELEVBQXlELEtBQXpELEVBQWdFLEtBQWhFLEVBQXVFLEtBQXZFLEVBQThFLEtBQTlFLEVBQXFGLEtBQXJGLEVBQTRGLElBQTVGLEVBQWtHLEtBQWxHLEVBQXlHLFNBQXpHLENBQWQ7QUFDQSxRQUFJLFVBQVUsQ0FBQyxLQUFELEVBQVEsS0FBUixFQUFlLElBQWYsRUFBcUIsSUFBckIsRUFBMkIsS0FBM0IsRUFBa0MsS0FBbEMsRUFBeUMsS0FBekMsRUFBZ0QsS0FBaEQsRUFBdUQsTUFBdkQsRUFBK0QsTUFBL0QsRUFBdUUsS0FBdkUsRUFBOEUsS0FBOUUsRUFBcUYsS0FBckYsRUFBNEYsS0FBNUYsRUFBbUcsS0FBbkcsRUFBMEcsSUFBMUcsRUFBZ0gsS0FBaEgsRUFBdUgsS0FBdkgsRUFBOEgsSUFBOUgsRUFBb0ksSUFBcEksRUFBMEksSUFBMUksQ0FBZDtBQUNBLFNBQUssSUFBSSxJQUFJLENBQWIsRUFBZ0IsSUFBSSxRQUFRLE1BQTVCLEVBQW9DLEdBQXBDLEVBQXlDO0FBQ3JDLGtCQUFVLEdBQVYsRUFBZSxLQUFmLENBQXFCLEVBQXJCLENBQXdCLENBQXhCLEVBQTJCLFFBQVEsQ0FBUixDQUEzQixJQUF5QyxLQUF6QztBQUNBLFlBQUksTUFBTSxDQUFWLEVBQWE7QUFDVCxzQkFBVSxHQUFWLEVBQWUsS0FBZixDQUFxQixFQUFyQixDQUF3QixDQUF4QixFQUEyQixRQUFRLENBQVIsQ0FBM0IsSUFBeUMsZUFBZSxRQUFmLEdBQTBCLE1BQTFCLENBQWlDLENBQWpDLEVBQW9DLENBQXBDLElBQXlDLEdBQXpDLEdBQStDLENBQUMsaUJBQWlCLENBQWxCLEVBQXFCLFFBQXJCLEdBQWdDLE1BQWhDLENBQXVDLENBQXZDLEVBQTBDLENBQTFDLENBQXhGO0FBQ0g7QUFDRCxZQUFJLE1BQU0sRUFBVixFQUFjO0FBQ1Ysc0JBQVUsR0FBVixFQUFlLEtBQWYsQ0FBcUIsRUFBckIsQ0FBd0IsQ0FBeEIsRUFBMkIsUUFBUSxDQUFSLENBQTNCLElBQXlDLEVBQXpDO0FBQ0g7QUFDRCxZQUFJLE1BQU0sRUFBVixFQUFjO0FBQ1Ysc0JBQVUsR0FBVixFQUFlLEtBQWYsQ0FBcUIsRUFBckIsQ0FBd0IsQ0FBeEIsRUFBMkIsUUFBUSxDQUFSLENBQTNCLElBQXlDLEtBQXpDO0FBQ0g7QUFDSjtBQUNELFNBQUssSUFBSSxJQUFJLENBQWIsRUFBZ0IsSUFBSSxRQUFRLE1BQTVCLEVBQW9DLEdBQXBDLEVBQXlDO0FBQ3JDLGtCQUFVLEdBQVYsRUFBZSxLQUFmLENBQXFCLFFBQVEsQ0FBUixDQUFyQixJQUFtQyxLQUFuQztBQUNBLFlBQUksTUFBTSxFQUFWLEVBQWM7QUFDVixzQkFBVSxHQUFWLEVBQWUsS0FBZixDQUFxQixRQUFRLENBQVIsQ0FBckIsSUFBbUMsSUFBbkM7QUFDSDtBQUNKO0FBQ0o7O0FBRUQsU0FBUyxjQUFULENBQXdCLEdBQXhCLEVBQTZCLENBQUU7O0FBRS9CLFNBQVMsZ0JBQVQsR0FBNEIsQ0FBRTtBQUM5Qjs7O0FBR0EsU0FBUyxlQUFULENBQXlCLFNBQXpCLEVBQW9DLHNCQUFwQyxFQUE0RDtBQUN4RDtBQUNBLGVBQVcsWUFBVztBQUNsQixVQUFFLHdCQUFGLEVBQTRCLFFBQTVCLENBQXFDLGNBQXJDO0FBQ0gsS0FGRCxFQUVHLEdBRkg7QUFHQSxlQUFXLFlBQVc7QUFDbEIsVUFBRSxpREFBRixFQUFxRCxRQUFyRCxDQUE4RCxjQUE5RDtBQUNBLFVBQUUscURBQUYsRUFBeUQsUUFBekQsQ0FBa0UsY0FBbEU7QUFDSCxLQUhELEVBR0csR0FISDtBQUlBO0FBQ0EsZUFBVyxZQUFXO0FBQ2xCLFVBQUUsa0RBQUYsRUFBc0QsUUFBdEQsQ0FBK0QsY0FBL0Q7QUFDQSxVQUFFLG9EQUFGLEVBQXdELFFBQXhELENBQWlFLGNBQWpFO0FBQ0gsS0FIRCxFQUdHLElBSEg7QUFJQTtBQUNBLGVBQVcsWUFBVztBQUNsQixVQUFFLDZCQUFGLEVBQWlDLFFBQWpDLENBQTBDLGNBQTFDO0FBQ0EsVUFBRSxrQkFBRixFQUFzQixRQUF0QixDQUErQixjQUEvQjtBQUNILEtBSEQsRUFHRyxJQUhIO0FBSUE7QUFDQSxlQUFXLFlBQVc7QUFDbEIsVUFBRSxrQkFBRixFQUFzQixRQUF0QixDQUErQixjQUEvQjtBQUNBLFVBQUUsYUFBRixFQUFpQixRQUFqQixDQUEwQixjQUExQjtBQUNBLFlBQUksUUFBUSxDQUFaO0FBQ0EsWUFBSSxlQUFlLENBQW5CO0FBQ0EsYUFBSyxJQUFJLE1BQVQsSUFBbUIsVUFBVSxPQUFWLENBQWtCLE1BQXJDLEVBQTZDO0FBQ3pDLG9CQUFRLEdBQVIsQ0FBWSxNQUFaO0FBQ0EsZ0JBQUksV0FBVyxvRkFBb0YsVUFBVSxPQUFWLENBQWtCLE1BQWxCLENBQXlCLE1BQXpCLEVBQWlDLEdBQXJILEdBQTJILE1BQTFJO0FBQ0EsY0FBRSw0QkFBNEIsZUFBZSxDQUEzQyxJQUFnRCxHQUFsRCxFQUF1RCxNQUF2RCxDQUE4RCx5Q0FBeUMsUUFBekMsR0FBb0QsS0FBbEg7QUFDQSxjQUFFLDRCQUE0QixlQUFlLENBQTNDLElBQWdELEdBQWxELEVBQXVELElBQXZELENBQTRELFVBQTVELEVBQXdFLFVBQVUsT0FBVixDQUFrQixNQUFsQixDQUF5QixNQUF6QixFQUFpQyxHQUF6RztBQUNBLGNBQUUsaUJBQUYsRUFBcUIsRUFBckIsQ0FBd0IsT0FBeEIsRUFBaUMsWUFBVztBQUN4QyxrQkFBRSxJQUFGLEVBQVEsSUFBUixDQUFhLEtBQWIsRUFBb0IsOEdBQXBCO0FBQ0gsYUFGRDtBQUdBLGNBQUUsNEJBQTRCLGVBQWUsQ0FBM0MsSUFBZ0QsT0FBbEQsRUFBMkQsS0FBM0QsQ0FBaUUsS0FBakUsRUFBd0UsTUFBeEUsQ0FBK0UsR0FBL0UsRUFBb0YsQ0FBcEY7QUFDQSxxQkFBUyxFQUFUO0FBQ0E7QUFDSDtBQUNKLEtBakJELEVBaUJHLElBakJIO0FBa0JBO0FBQ0EsUUFBSSxpQkFBaUIsRUFBckI7QUFDQSxlQUFXLFlBQVc7QUFDbEIsVUFBRSxhQUFGLEVBQWlCLFFBQWpCLENBQTBCLGNBQTFCO0FBQ0EsVUFBRSw0QkFBNEIseUJBQXlCLENBQXJELElBQTBELEdBQTVELEVBQWlFLFFBQWpFLENBQTBFLFVBQTFFO0FBQ0EseUJBQWlCLEVBQUUsNEJBQTRCLHlCQUF5QixDQUFyRCxJQUEwRCxHQUE1RCxFQUFpRSxJQUFqRSxDQUFzRSxVQUF0RSxDQUFqQjtBQUNBLGdCQUFRLEdBQVIsQ0FBWSxjQUFaO0FBQ0EsVUFBRSxhQUFGLEVBQWlCLEdBQWpCLENBQXFCLHVCQUFyQixFQUE4QyxLQUE5QyxDQUFvRCxHQUFwRCxFQUF5RCxRQUF6RCxDQUFrRSxjQUFsRTtBQUNILEtBTkQsRUFNRyxJQU5IO0FBT0E7QUFDQSxlQUFXLFlBQVc7QUFDbEIsVUFBRSxvQkFBRixFQUF3QixRQUF4QixDQUFpQyxjQUFqQztBQUNBLFVBQUUsa0NBQUYsRUFBc0MsUUFBdEMsQ0FBK0MsY0FBL0M7QUFDSCxLQUhELEVBR0csSUFISDtBQUlBO0FBQ0EsZUFBVyxZQUFXO0FBQ2xCLHlCQUFpQixjQUFqQjtBQUNBLFVBQUUsa0NBQUYsRUFBc0MsS0FBdEMsR0FBOEMsUUFBOUMsQ0FBdUQsd0NBQXZEO0FBQ0EsVUFBRSw2QkFBRixFQUFpQyxRQUFqQyxDQUEwQyxXQUExQztBQUNBLFVBQUUsOEJBQUYsRUFBa0MsUUFBbEMsQ0FBMkMsY0FBM0M7QUFDQSxVQUFFLG9CQUFGLEVBQXdCLFFBQXhCLENBQWlDLGNBQWpDO0FBQ0EsWUFBSSxRQUFRLFVBQVUsT0FBVixDQUFrQixNQUFsQixDQUF5QixjQUF6QixFQUF5QyxLQUFyRDtBQUNBLFVBQUUseUNBQUYsRUFBNkMsTUFBN0MsQ0FBb0QsdUhBQXVILFVBQVUsT0FBVixDQUFrQixNQUFsQixDQUF5QixjQUF6QixFQUF5QyxHQUFoSyxHQUFzSywrRkFBdEssR0FBd1EsVUFBVSxPQUFWLENBQWtCLE1BQWxCLENBQXlCLGNBQXpCLEVBQXlDLEVBQXpDLENBQTRDLFdBQTVDLEVBQXhRLEdBQW9VLGVBQXBVLEdBQXNWLFVBQVUsT0FBVixDQUFrQixNQUFsQixDQUF5QixjQUF6QixFQUF5QyxFQUF6QyxDQUE0QyxXQUE1QyxFQUF0VixHQUFrWixxQ0FBbFosR0FBMGIsVUFBVSxPQUFWLENBQWtCLE1BQWxCLENBQXlCLGNBQXpCLEVBQXlDLEdBQW5lLEdBQXllLGFBQXplLEdBQXlmLFVBQVUsT0FBVixDQUFrQixNQUFsQixDQUF5QixjQUF6QixFQUF5QyxHQUFsaUIsR0FBd2lCLHVKQUF4aUIsR0FBa3NCLFVBQVUsVUFBVSxPQUFWLENBQWtCLE1BQWxCLENBQXlCLGNBQXpCLEVBQXlDLEdBQW5ELENBQWxzQixHQUE0dkIsOEZBQTV2QixHQUE2MUIsVUFBVSxPQUFWLENBQWtCLE1BQWxCLENBQXlCLGNBQXpCLEVBQXlDLEVBQXQ0QixHQUEyNEIsOEZBQTM0QixHQUE0K0IsVUFBVSxPQUFWLENBQWtCLE1BQWxCLENBQXlCLGNBQXpCLEVBQXlDLEVBQXJoQyxHQUEwaEMsa1hBQTlrQztBQUNBLFVBQUUsb0NBQUYsRUFBd0MsSUFBeEMsQ0FBNkMsWUFBWSxNQUFNLEVBQU4sQ0FBUyxDQUFULEVBQVksRUFBeEIsR0FBNkIsa0JBQTdCLEdBQWtELE1BQU0sRUFBTixDQUFTLENBQVQsRUFBWSxHQUE5RCxHQUFvRSxrQkFBcEUsR0FBeUYsTUFBTSxFQUFOLENBQVMsQ0FBVCxFQUFZLEdBQXJHLEdBQTJHLGtCQUEzRyxHQUFnSSxNQUFNLEVBQU4sQ0FBUyxDQUFULEVBQVksR0FBNUksR0FBa0osV0FBL0w7QUFDQSxVQUFFLGdDQUFGLEVBQW9DLE1BQXBDLENBQTJDLEdBQTNDLEVBQWdELENBQWhEO0FBQ0EsWUFBSSxjQUFjLFVBQVUsT0FBVixDQUFrQixNQUFsQixDQUF5QixjQUF6QixFQUF5QyxHQUF6QyxDQUE2QyxRQUEvRDtBQUNBLGFBQUssSUFBSSxJQUFJLENBQWIsRUFBZ0IsSUFBSSxDQUFwQixFQUF1QixHQUF2QixFQUE0QjtBQUN4QixnQkFBSSxZQUFZLEtBQUssS0FBTCxDQUFXLEtBQUssTUFBTCxLQUFnQixZQUFZLE1BQXZDLENBQWhCO0FBQ0EsY0FBRSxnQ0FBRixFQUFvQyxNQUFwQyxDQUEyQyxzQ0FBc0MsWUFBWSxTQUFaLENBQXRDLEdBQStELFlBQTFHO0FBQ0g7QUFDRCxVQUFFLGdDQUFGLEVBQW9DLFFBQXBDLENBQTZDLGNBQTdDO0FBQ0EsbUJBQVcsWUFBVztBQUNsQixjQUFFLHdEQUFGLEVBQTRELFFBQTVELENBQXFFLGNBQXJFO0FBQ0EsY0FBRSx3REFBRixFQUE0RCxRQUE1RCxDQUFxRSxjQUFyRTtBQUNILFNBSEQsRUFHRyxJQUhIO0FBSUEsbUJBQVcsWUFBVztBQUNsQixjQUFFLHdEQUFGLEVBQTRELFFBQTVELENBQXFFLGNBQXJFO0FBQ0EsY0FBRSx3REFBRixFQUE0RCxRQUE1RCxDQUFxRSxjQUFyRTtBQUNILFNBSEQsRUFHRyxJQUhIO0FBSUgsS0F4QkQsRUF3QkcsSUF4Qkg7QUF5QkE7QUFDQSxlQUFXLFlBQVc7QUFDbEIsVUFBRSwrTkFBRixFQUFtTyxRQUFuTyxDQUE0TyxjQUE1TztBQUNBLG1CQUFXLFlBQVc7QUFDbEIsY0FBRSwwQ0FBRixFQUE4QyxNQUE5QztBQUNILFNBRkQsRUFFRyxJQUZIO0FBR0EsWUFBSSx5QkFBeUIsRUFBN0IsRUFBaUM7QUFDN0I7QUFDSCxTQUZELE1BRU87QUFDSCxxQ0FBeUIsQ0FBekI7QUFDSDtBQUNKLEtBVkQsRUFVRyxJQVZIO0FBV0E7QUFDQSxlQUFXLFlBQVc7QUFDbEIsVUFBRSw2REFBRixFQUFpRSxRQUFqRSxDQUEwRSxjQUExRTtBQUNILEtBRkQsRUFFRyxJQUZIO0FBR0E7QUFDQSxlQUFXLFlBQVc7QUFDbEIsVUFBRSxXQUFGLEVBQWUsTUFBZjtBQUNBLFVBQUUseUVBQUYsRUFBNkUsV0FBN0UsQ0FBeUYsZ0VBQXpGO0FBQ0gsS0FIRCxFQUdHLElBSEg7QUFJSDs7QUFFRCxTQUFTLE9BQVQsQ0FBaUIsR0FBakIsRUFBc0IsV0FBdEIsRUFBbUM7QUFDL0IsUUFBSSxhQUFhLEVBQWpCO0FBQ0EsUUFBSSxrQkFBa0IsS0FBdEI7QUFDQSxrQkFBYyxJQUFkLENBSCtCLENBR1g7QUFDcEIsUUFBSSxXQUFKLEVBQWlCO0FBQ2IsVUFBRSxJQUFGLENBQU87QUFDSCxpQkFBSyw4REFERjtBQUVILG1CQUFPLEtBRko7QUFHSCxxQkFBUyxpQkFBUyxJQUFULEVBQWU7QUFDcEI7QUFDQSw2QkFBYSxJQUFiO0FBQ0g7QUFORSxTQUFQO0FBUUg7QUFDRCxTQUFLLElBQUksSUFBVCxJQUFpQixTQUFqQixFQUE0QjtBQUN4QixhQUFLLElBQUksSUFBSSxDQUFiLEVBQWdCLElBQUksQ0FBcEIsRUFBdUIsR0FBdkIsRUFBNEI7QUFDeEIsaUJBQUssSUFBSSxJQUFULElBQWlCLFVBQVUsSUFBVixFQUFnQixPQUFqQyxFQUEwQztBQUN0QztBQUNBLGtCQUFFLGtDQUFrQyxJQUFJLENBQXRDLElBQTJDLEtBQTNDLEdBQW1ELElBQW5ELEdBQTBELEdBQTFELEdBQWdFLElBQWhFLEdBQXVFLFFBQXpFLEVBQW1GLE1BQW5GLENBQTBGLGtCQUFrQixVQUFVLElBQVYsRUFBZ0IsRUFBbEMsR0FBdUMsSUFBdkMsR0FBOEMsVUFBVSxJQUFWLEVBQWdCLE9BQWhCLENBQXdCLElBQXhCLEVBQThCLENBQTlCLEVBQWlDLENBQWpDLENBQTlDLEdBQW9GLFVBQXBGLEdBQWlHLEtBQUssV0FBTCxFQUEzTDtBQUNBO0FBQ0Esb0JBQUksVUFBVSxJQUFWLEVBQWdCLE9BQWhCLENBQXdCLElBQXhCLEVBQThCLENBQTlCLEVBQWlDLENBQWpDLEVBQW9DLE1BQXBDLEdBQTZDLFVBQVUsSUFBVixFQUFnQixPQUFoQixDQUF3QixJQUF4QixFQUE4QixDQUE5QixFQUFpQyxDQUFqQyxFQUFvQyxNQUFqRixJQUEyRixFQUEvRixFQUFtRztBQUMvRiw4QkFBVSxJQUFWLEVBQWdCLE9BQWhCLENBQXdCLElBQXhCLEVBQThCLENBQTlCLEVBQWlDLENBQWpDLElBQXNDLFVBQVUsSUFBVixFQUFnQixPQUFoQixDQUF3QixJQUF4QixFQUE4QixDQUE5QixFQUFpQyxDQUFqQyxFQUFvQyxNQUFwQyxDQUEyQyxDQUEzQyxFQUE4QyxDQUE5QyxJQUFtRCxHQUF6RjtBQUNIO0FBQ0Qsa0JBQUUsa0NBQWtDLElBQUksQ0FBdEMsSUFBMkMsS0FBM0MsR0FBbUQsSUFBbkQsR0FBMEQsR0FBMUQsR0FBZ0UsSUFBaEUsR0FBdUUsUUFBekUsRUFBbUYsTUFBbkYsQ0FBMEYsV0FBVyxVQUFVLElBQVYsRUFBZ0IsT0FBaEIsQ0FBd0IsSUFBeEIsRUFBOEIsQ0FBOUIsRUFBaUMsQ0FBakMsQ0FBWCxHQUFpRCxVQUFqRCxHQUE4RCxVQUFVLElBQVYsRUFBZ0IsT0FBaEIsQ0FBd0IsSUFBeEIsRUFBOEIsQ0FBOUIsRUFBaUMsQ0FBakMsQ0FBeEo7QUFDQTtBQUNBLGtCQUFFLGtDQUFrQyxJQUFJLENBQXRDLElBQTJDLEtBQTNDLEdBQW1ELElBQW5ELEdBQTBELEdBQTFELEdBQWdFLElBQWhFLEdBQXVFLFlBQXpFLEVBQXVGLElBQXZGLENBQTRGLEtBQTVGLEVBQW1HLG9GQUFvRixVQUFVLElBQVYsRUFBZ0IsT0FBaEIsQ0FBd0IsSUFBeEIsRUFBOEIsQ0FBOUIsRUFBaUMsQ0FBakMsQ0FBcEYsR0FBMEgsTUFBN047QUFDSDtBQUNKO0FBQ0o7QUFDRCxRQUFJLGNBQWMsSUFBbEI7QUFDQSxNQUFFLGlDQUFGLEVBQXFDLFFBQXJDLENBQThDLGNBQTlDO0FBQ0EsZUFBVyxZQUFXO0FBQ2xCLFVBQUUsMEJBQUYsRUFBOEIsUUFBOUIsQ0FBdUMsY0FBdkM7QUFDQSxVQUFFLDRDQUFGLEVBQWdELFFBQWhELENBQXlELGNBQXpEO0FBQ0EsVUFBRSxzRUFBRixFQUEwRSxRQUExRSxDQUFtRixVQUFVLE9BQVYsQ0FBa0IsRUFBbEIsR0FBdUIsS0FBMUc7QUFDSCxLQUpELEVBSUcsR0FKSDtBQUtBLFFBQUksb0JBQW9CLENBQXhCOztBQXBDK0IsK0JBcUN0QixFQXJDc0I7QUFzQzNCLG1CQUFXLFVBQVMsWUFBVCxFQUF1QjtBQUM5QixjQUFFLDRDQUFGLEVBQWdELFFBQWhELENBQXlELGdCQUFnQixFQUF6RTtBQUNBLGNBQUUsc0VBQUYsRUFBMEUsV0FBMUUsQ0FBc0YsVUFBVSxPQUFWLENBQWtCLEVBQWxCLEdBQXVCLEtBQTdHO0FBQ0EsY0FBRSxzRUFBRixFQUEwRSxRQUExRSxDQUFtRixVQUFVLElBQVYsQ0FBZSxFQUFmLEdBQW9CLEtBQXZHO0FBQ0EsZ0JBQUksb0JBQW9CLENBQXBCLElBQXlCLENBQTdCLEVBQWdDO0FBQzVCLDJCQUFXLFlBQVc7QUFDbEIsc0JBQUUsc0VBQUYsRUFBMEUsV0FBMUUsQ0FBc0YsVUFBVSxJQUFWLENBQWUsRUFBZixHQUFvQixLQUExRztBQUNBLHNCQUFFLHNFQUFGLEVBQTBFLFFBQTFFLENBQW1GLFVBQVUsT0FBVixDQUFrQixFQUFsQixHQUF1QixLQUExRztBQUNBLHNCQUFFLDZCQUFGLEVBQWlDLFdBQWpDLENBQTZDLGNBQTdDO0FBQ0Esc0JBQUUscUNBQUYsRUFBeUMsUUFBekMsQ0FBa0QsZ0JBQWlCLEtBQUksQ0FBdkU7QUFDQSxzQkFBRSw4Q0FBOEMsS0FBSyxLQUFJLENBQVQsR0FBYyxDQUE1RCxJQUFpRSxHQUFuRSxFQUF3RSxRQUF4RSxDQUFpRixjQUFqRixFQUxrQixDQUtnRjtBQUNyRyxpQkFORCxFQU1HLEdBTkg7QUFPSDtBQUNEO0FBQ0gsU0FkRCxFQWNHLE9BQU8sRUFkVjtBQXRDMkI7O0FBcUMvQixTQUFLLElBQUksS0FBSSxDQUFiLEVBQWdCLE1BQUssQ0FBckIsRUFBd0IsSUFBeEIsRUFBNkI7QUFBQSxjQUFwQixFQUFvQjtBQWdCNUI7QUFDSjs7QUFFRCxTQUFTLE1BQVQsQ0FBZ0IsTUFBaEIsRUFBd0IsQ0FBRTs7QUFFMUIsU0FBUyxTQUFULEdBQXFCO0FBQ2pCLE1BQUUsTUFBRixFQUFVLElBQVY7QUFDSDtBQUNEOzs7O0FBSUEsU0FBUyxRQUFULEdBQW9CO0FBQ2hCLFFBQUksRUFBRSx1QkFBRixFQUEyQixRQUEzQixDQUFvQyxjQUFwQyxDQUFKLEVBQXdEO0FBQ3BELFVBQUUsdUJBQUYsRUFBMkIsV0FBM0IsQ0FBdUMsY0FBdkM7QUFDSCxLQUZELE1BR0s7QUFDRCxVQUFFLHVCQUFGLEVBQTJCLFFBQTNCLENBQW9DLGNBQXBDO0FBQ0g7O0FBRUQsUUFBSSxFQUFFLG9CQUFGLEVBQXdCLFFBQXhCLENBQWlDLGNBQWpDLENBQUosRUFBcUQ7QUFDakQsVUFBRSxvQkFBRixFQUF3QixXQUF4QixDQUFvQyxjQUFwQztBQUNILEtBRkQsTUFHSztBQUNELFVBQUUsb0JBQUYsRUFBd0IsUUFBeEIsQ0FBaUMsY0FBakM7QUFDSDtBQUNKOztBQUdELFNBQVMsYUFBVCxDQUF1QixRQUF2QixFQUFpQztBQUM3QixNQUFFLElBQUYsQ0FBTztBQUNILGFBQUssNkRBREY7QUFFSCxlQUFPLEtBRko7QUFHSCxpQkFBUyxpQkFBUyxhQUFULEVBQXdCO0FBQzdCLGlCQUFLLElBQUksSUFBSSxDQUFiLEVBQWdCLElBQUksY0FBYyxHQUFkLENBQWtCLEVBQWxCLENBQXFCLE1BQXpDLEVBQWlELEdBQWpELEVBQXNEO0FBQ2xELHFCQUFLLElBQUksSUFBSSxDQUFiLEVBQWdCLElBQUksY0FBYyxHQUFkLENBQWtCLEVBQWxCLENBQXFCLENBQXJCLEVBQXdCLEVBQXhCLENBQTJCLE1BQS9DLEVBQXVELEdBQXZELEVBQTREO0FBQ3hELHlCQUFLLElBQUksSUFBSSxDQUFiLEVBQWdCLElBQUksY0FBYyxHQUFkLENBQWtCLEVBQWxCLENBQXFCLENBQXJCLEVBQXdCLEVBQXhCLENBQTJCLENBQTNCLEVBQThCLENBQTlCLENBQWdDLE1BQXBELEVBQTRELEdBQTVELEVBQWlFO0FBQzdELDRCQUFJLGNBQWMsQ0FBQyxPQUFELEVBQVUsT0FBVixDQUFsQjtBQUNBLDRCQUFJLFFBQVEsY0FBYyxHQUFkLENBQWtCLEVBQWxCLENBQXFCLENBQXJCLEVBQXdCLEVBQXhCLENBQTJCLENBQTNCLEVBQThCLENBQTlCLENBQWdDLENBQWhDLEVBQW1DLEdBQS9DO0FBQ0EsNEJBQUksT0FBTyxFQUFYO0FBQ0EsNEJBQUksZUFBZSxFQUFuQjtBQUNBLDRCQUFJLGNBQWMsR0FBZCxDQUFrQixFQUFsQixDQUFxQixDQUFyQixFQUF3QixFQUF4QixDQUEyQixDQUEzQixFQUE4QixDQUE5QixDQUFnQyxDQUFoQyxFQUFtQyxHQUFuQyxJQUEwQyxDQUE5QyxFQUFpRDtBQUM3QyxtQ0FBTyxjQUFjLEdBQWQsQ0FBa0IsRUFBbEIsQ0FBcUIsQ0FBckIsRUFBd0IsRUFBeEIsQ0FBMkIsQ0FBM0IsRUFBOEIsQ0FBOUIsQ0FBZ0MsQ0FBaEMsRUFBbUMsR0FBMUM7QUFDSDtBQUNELDRCQUFJLGNBQWMsR0FBZCxDQUFrQixFQUFsQixDQUFxQixDQUFyQixFQUF3QixFQUF4QixDQUEyQixDQUEzQixFQUE4QixDQUE5QixDQUFnQyxDQUFoQyxFQUFtQyxFQUFuQyxJQUF5QyxLQUE3QyxFQUFvRDtBQUNoRCwyQ0FBZSxRQUFmO0FBQ0g7QUFDRCw0QkFBSSxjQUFjLEdBQWQsQ0FBa0IsRUFBbEIsQ0FBcUIsQ0FBckIsRUFBd0IsRUFBeEIsQ0FBMkIsQ0FBM0IsRUFBOEIsQ0FBOUIsQ0FBZ0MsQ0FBaEMsRUFBbUMsRUFBbkMsSUFBeUMsUUFBN0MsRUFBdUQ7QUFDbkQsMkNBQWUsYUFBZjtBQUNIO0FBQ0QsNEJBQUksVUFBVSx3QkFBd0IsSUFBeEIsR0FBK0Isb0hBQS9CLEdBQXNKLGNBQWMsR0FBZCxDQUFrQixFQUFsQixDQUFxQixDQUFyQixFQUF3QixFQUF4QixDQUEyQixDQUEzQixFQUE4QixDQUE5QixDQUFnQyxDQUFoQyxFQUFtQyxFQUF6TCxHQUE4TCxnQ0FBOUwsR0FBaU8sY0FBYyxHQUFkLENBQWtCLEVBQWxCLENBQXFCLENBQXJCLEVBQXdCLEVBQXhCLENBQTJCLENBQTNCLEVBQThCLENBQTlCLENBQWdDLENBQWhDLEVBQW1DLEVBQXBRLEdBQXlRLElBQXpRLEdBQWdSLGNBQWMsR0FBZCxDQUFrQixFQUFsQixDQUFxQixDQUFyQixFQUF3QixFQUF4QixDQUEyQixDQUEzQixFQUE4QixDQUE5QixDQUFnQyxDQUFoQyxFQUFtQyxFQUFuVCxHQUF3VCwwQkFBeFQsR0FBcVYsY0FBYyxHQUFkLENBQWtCLEVBQWxCLENBQXFCLENBQXJCLEVBQXdCLEVBQXhCLENBQTJCLENBQTNCLEVBQThCLENBQTlCLENBQWdDLENBQWhDLEVBQW1DLENBQXhYLEdBQTRYLDRCQUE1WCxHQUEyWixjQUFjLEdBQWQsQ0FBa0IsRUFBbEIsQ0FBcUIsQ0FBckIsRUFBd0IsRUFBeEIsQ0FBMkIsQ0FBM0IsRUFBOEIsQ0FBOUIsQ0FBZ0MsQ0FBaEMsRUFBbUMsQ0FBOWIsR0FBa2Msa0NBQWxjLEdBQXVlLGNBQWMsR0FBZCxDQUFrQixFQUFsQixDQUFxQixDQUFyQixFQUF3QixFQUF4QixDQUEyQixDQUEzQixFQUE4QixDQUE5QixDQUFnQyxDQUFoQyxFQUFtQyxFQUExZ0IsR0FBK2dCLFFBQTdoQjtBQUNBLDBCQUFFLFlBQVksQ0FBWixJQUFpQixtQkFBakIsSUFBd0MsUUFBUSxDQUFoRCxJQUFxRCxHQUF2RCxFQUE0RCxJQUE1RCxDQUFpRSxPQUFqRTtBQUNBLDBCQUFFLFlBQVksQ0FBWixJQUFpQixtQkFBakIsSUFBd0MsUUFBUSxDQUFoRCxJQUFxRCxHQUF2RCxFQUE0RCxRQUE1RCxDQUFxRSxZQUFyRTtBQUNIO0FBQ0o7QUFDSjtBQUNKO0FBMUJFLEtBQVA7QUE0Qkg7O0FBRUQsU0FBUyxVQUFULENBQW9CLGdCQUFwQixFQUFzQztBQUNsQyxRQUFJLGFBQWEsaUJBQWlCLEVBQWpCLENBQW9CLENBQXJDO0FBQ0EsUUFBSSxXQUFXLE1BQVgsSUFBcUIsQ0FBekIsRUFBNEI7QUFDeEIsWUFBSSxhQUFhLEVBQWpCO0FBQ0EsWUFBSSxXQUFXLENBQVgsRUFBYyxHQUFkLENBQWtCLE1BQWxCLENBQXlCLENBQXpCLEVBQTRCLENBQTVCLEtBQWtDLEtBQXRDLEVBQTZDO0FBQ3pDLHlCQUFhLEtBQWI7QUFDSCxTQUZELE1BRU8sSUFBSSxXQUFXLENBQVgsRUFBYyxHQUFkLENBQWtCLE1BQWxCLENBQXlCLENBQXpCLEVBQTRCLENBQTVCLEtBQWtDLEtBQXRDLEVBQTZDO0FBQ2hELHlCQUFhLE1BQWI7QUFDSDtBQUNELFlBQUksV0FBVyxNQUFYLEdBQW9CLENBQXBCLElBQTBCLFdBQVcsTUFBWCxJQUFxQixDQUFyQixJQUEwQixXQUFXLENBQVgsRUFBYyxDQUFkLENBQWdCLEVBQWhCLElBQXNCLEtBQTlFLEVBQXNGO0FBQ2xGLGdCQUFJLGNBQWMsQ0FBQyxTQUFELEVBQVksU0FBWixFQUF1QixTQUF2QixFQUFrQyxTQUFsQyxFQUE2QyxRQUE3QyxFQUF1RCxRQUF2RCxFQUFpRSxRQUFqRSxFQUEyRSxRQUEzRSxFQUFxRixRQUFyRixFQUErRixRQUEvRixFQUF5RyxRQUF6RyxFQUFtSCxRQUFuSCxFQUE2SCxRQUE3SCxFQUF1SSxTQUF2SSxDQUFsQjtBQUNBLGdCQUFJLGFBQWEsRUFBakI7QUFDQSxpQkFBSyxJQUFJLElBQUksV0FBVyxNQUFYLEdBQW9CLENBQWpDLEVBQW9DLEtBQUssQ0FBekMsRUFBNEMsR0FBNUMsRUFBaUQ7QUFDN0Msb0JBQUksV0FBVyxDQUFYLEVBQWMsQ0FBZCxDQUFnQixFQUFoQixLQUF1QixLQUEzQixFQUFrQztBQUM5Qix3QkFBSSxTQUFTLEVBQWI7QUFDQSx3QkFBSSxTQUFTLEVBQWI7QUFDQSx3QkFBSSxXQUFXLENBQVgsRUFBYyxFQUFkLElBQW9CLENBQXhCLEVBQTJCO0FBQ3ZCLGlDQUFTLFdBQVcsQ0FBWCxFQUFjLENBQWQsQ0FBZ0IsQ0FBekI7QUFDQSxpQ0FBUyxXQUFXLENBQVgsRUFBYyxDQUFkLENBQWdCLENBQXpCO0FBQ0g7QUFDRCx3QkFBSSxRQUFRLFdBQVcsQ0FBWCxFQUFjLEdBQTFCO0FBQ0Esd0JBQUksWUFBWSxPQUFaLENBQW9CLFdBQVcsQ0FBWCxFQUFjLEdBQWxDLE1BQTJDLENBQUMsQ0FBaEQsRUFBbUQ7QUFDL0MsZ0NBQVEsV0FBVyxDQUFYLEVBQWMsR0FBZCxHQUFvQixLQUFwQixHQUE0QixXQUFXLENBQVgsRUFBYyxFQUFsRDtBQUNIO0FBQ0Qsa0NBQWMsdURBQXVELEtBQXZELEdBQStELG9CQUEvRCxHQUFzRixXQUFXLENBQVgsRUFBYyxDQUFkLENBQWdCLEVBQXRHLEdBQTJHLHlEQUEzRyxHQUF1SyxXQUFXLENBQVgsRUFBYyxDQUFkLENBQWdCLEVBQWhCLENBQW1CLFdBQW5CLEVBQXZLLEdBQTBNLGNBQTFNLEdBQTJOLFdBQVcsQ0FBWCxFQUFjLENBQWQsQ0FBZ0IsRUFBaEIsQ0FBbUIsV0FBbkIsRUFBM04sR0FBOFAsR0FBOVAsR0FBb1EsV0FBVyxDQUFYLEVBQWMsQ0FBZCxDQUFnQixFQUFoQixDQUFtQixXQUFuQixFQUFwUSxHQUF1UywwQkFBdlMsR0FBb1UsTUFBcFUsR0FBNlUsMEJBQTdVLEdBQTBXLFdBQVcsQ0FBWCxFQUFjLENBQWQsQ0FBZ0IsRUFBMVgsR0FBK1gseURBQS9YLEdBQTJiLFdBQVcsQ0FBWCxFQUFjLENBQWQsQ0FBZ0IsRUFBaEIsQ0FBbUIsV0FBbkIsRUFBM2IsR0FBOGQsY0FBOWQsR0FBK2UsV0FBVyxDQUFYLEVBQWMsQ0FBZCxDQUFnQixFQUFoQixDQUFtQixXQUFuQixFQUEvZSxHQUFraEIsR0FBbGhCLEdBQXdoQixXQUFXLENBQVgsRUFBYyxDQUFkLENBQWdCLEVBQWhCLENBQW1CLFdBQW5CLEVBQXhoQixHQUEyakIsMEJBQTNqQixHQUF3bEIsTUFBeGxCLEdBQWltQixvQkFBL21CO0FBQ0g7QUFDSjtBQUNELGNBQUUsU0FBRixFQUFhLEtBQWIsR0FBcUIsTUFBckIsQ0FBNEIsYUFBYSxvQ0FBekM7QUFDSDtBQUNELFlBQUksYUFBYSxDQUFqQixFQUFtQjtBQUNmLGNBQUUsaUJBQUYsRUFBcUIsSUFBckI7QUFDSCxTQUZELE1BR0s7QUFDRCxjQUFFLGlCQUFGLEVBQXFCLElBQXJCO0FBQ0g7QUFDSjtBQUNKOztBQUVELFNBQVMsa0JBQVQsQ0FBNEIsZ0JBQTVCLEVBQThDO0FBQzFDLFFBQUksYUFBYSxpQkFBaUIsRUFBakIsQ0FBb0IsQ0FBckM7QUFDQSxRQUFJLFdBQVcsTUFBWCxJQUFxQixDQUF6QixFQUE0QjtBQUN4QixZQUFJLGFBQWEsZ0JBQWpCO0FBQ0EsWUFBSSxXQUFXLENBQVgsRUFBYyxHQUFkLENBQWtCLE1BQWxCLENBQXlCLENBQXpCLEVBQTJCLENBQTNCLEtBQWlDLEtBQXJDLEVBQTRDO0FBQ3hDLHlCQUFhLFlBQWI7QUFDSCxTQUZELE1BR0ssSUFBSSxXQUFXLENBQVgsRUFBYyxHQUFkLENBQWtCLE1BQWxCLENBQXlCLENBQXpCLEVBQTJCLENBQTNCLEtBQWlDLEtBQXJDLEVBQTRDO0FBQzdDLHlCQUFhLFVBQWI7QUFDSDtBQUNELFlBQUksV0FBVyxNQUFYLEdBQW9CLENBQXBCLElBQTBCLFdBQVcsTUFBWCxJQUFxQixDQUFyQixJQUEwQixXQUFXLENBQVgsRUFBYyxDQUFkLENBQWdCLEVBQWhCLElBQXNCLEtBQTlFLEVBQXNGO0FBQ2xGLGdCQUFJLGNBQWMsQ0FBQyxTQUFELEVBQVcsU0FBWCxFQUFxQixTQUFyQixFQUErQixTQUEvQixFQUF5QyxRQUF6QyxFQUFrRCxRQUFsRCxFQUEyRCxRQUEzRCxFQUFvRSxRQUFwRSxFQUE2RSxRQUE3RSxFQUFzRixRQUF0RixFQUErRixRQUEvRixFQUF3RyxRQUF4RyxFQUFpSCxRQUFqSCxFQUEwSCxTQUExSCxDQUFsQjtBQUNBLGdCQUFJLGFBQWEsRUFBakI7QUFDQSxnQkFBSSxFQUFFLGFBQUYsRUFBaUIsTUFBakIsS0FBNEIsQ0FBaEMsRUFBbUM7QUFDL0Isa0JBQUUsV0FBRixFQUFlLE9BQWYsQ0FBdUIsbUlBQXZCO0FBQ0g7QUFDRCxpQkFBSyxJQUFJLElBQUksV0FBVyxNQUFYLEdBQW9CLENBQWpDLEVBQW9DLEtBQUssQ0FBekMsRUFBNEMsR0FBNUMsRUFBaUQ7QUFDN0Msb0JBQUksV0FBVyxDQUFYLEVBQWMsQ0FBZCxDQUFnQixFQUFoQixLQUF1QixLQUEzQixFQUFrQztBQUM5Qix3QkFBSSxTQUFTLEVBQWI7QUFDQSx3QkFBSSxTQUFTLEVBQWI7QUFDQSx3QkFBSSxXQUFXLENBQVgsRUFBYyxFQUFkLElBQW9CLENBQXhCLEVBQTJCO0FBQ3ZCLGlDQUFTLFdBQVcsQ0FBWCxFQUFjLENBQWQsQ0FBZ0IsQ0FBekI7QUFDQSxpQ0FBUyxXQUFXLENBQVgsRUFBYyxDQUFkLENBQWdCLENBQXpCO0FBQ0g7QUFDRCx3QkFBSSxRQUFRLFdBQVcsQ0FBWCxFQUFjLEdBQTFCO0FBQ0Esd0JBQUksWUFBWSxPQUFaLENBQW9CLFdBQVcsQ0FBWCxFQUFjLEdBQWxDLE1BQTJDLENBQUMsQ0FBaEQsRUFBbUQ7QUFDL0MsZ0NBQVEsV0FBVyxDQUFYLEVBQWMsR0FBZCxHQUFvQixLQUFwQixHQUE0QixXQUFXLENBQVgsRUFBYyxFQUFsRDtBQUNIO0FBQ0Qsa0NBQWMsc0VBQXNFLFdBQVcsQ0FBWCxFQUFjLENBQWQsQ0FBZ0IsRUFBdEYsR0FBMkYseURBQTNGLEdBQXVKLFdBQVcsQ0FBWCxFQUFjLENBQWQsQ0FBZ0IsRUFBaEIsQ0FBbUIsV0FBbkIsRUFBdkosR0FBMEwsY0FBMUwsR0FBMk0sV0FBVyxDQUFYLEVBQWMsQ0FBZCxDQUFnQixFQUFoQixDQUFtQixXQUFuQixFQUEzTSxHQUE4TyxHQUE5TyxHQUFvUCxXQUFXLENBQVgsRUFBYyxDQUFkLENBQWdCLEVBQWhCLENBQW1CLFdBQW5CLEVBQXBQLEdBQXVSLDBCQUF2UixHQUFvVCxNQUFwVCxHQUE2VCwwQkFBN1QsR0FBMFYsV0FBVyxDQUFYLEVBQWMsQ0FBZCxDQUFnQixFQUExVyxHQUErVyx5REFBL1csR0FBMmEsV0FBVyxDQUFYLEVBQWMsQ0FBZCxDQUFnQixFQUFoQixDQUFtQixXQUFuQixFQUEzYSxHQUE4YyxjQUE5YyxHQUErZCxXQUFXLENBQVgsRUFBYyxDQUFkLENBQWdCLEVBQWhCLENBQW1CLFdBQW5CLEVBQS9kLEdBQWtnQixHQUFsZ0IsR0FBd2dCLFdBQVcsQ0FBWCxFQUFjLENBQWQsQ0FBZ0IsRUFBaEIsQ0FBbUIsV0FBbkIsRUFBeGdCLEdBQTJpQiwwQkFBM2lCLEdBQXdrQixNQUF4a0IsR0FBaWxCLHdDQUFqbEIsR0FBNG5CLEtBQTVuQixHQUFvb0Isb0JBQWxwQjtBQUNIO0FBQ0o7QUFDRCxjQUFFLFNBQUYsRUFBYSxLQUFiLEdBQXFCLE1BQXJCLENBQTRCLFVBQTVCO0FBQ0EsMEJBQWMsVUFBZDtBQUNIO0FBQ0o7QUFDSjs7QUFFRCxTQUFTLGFBQVQsR0FBd0I7QUFDcEIsUUFBSSxvQkFBb0IsRUFBeEI7QUFDQSxRQUFJLFdBQVcsRUFBZjtBQUNBLE1BQUUsSUFBRixDQUFPO0FBQ0gsYUFBSyxnREFERjtBQUVILGlCQUFTLGlCQUFTLElBQVQsRUFBZTtBQUNwQixnQkFBSSxjQUFjLEtBQUssVUFBdkI7QUFDQSxpQkFBSyxJQUFJLElBQUksQ0FBYixFQUFnQixJQUFJLFlBQVksTUFBaEMsRUFBd0MsR0FBeEMsRUFBNEM7QUFDeEMsMkJBQVcsWUFBWSxDQUFaLEVBQWUsT0FBZixDQUF3QixZQUFZLENBQVosRUFBZSxPQUFmLENBQXVCLE1BQXZCLEdBQWdDLENBQXhELENBQVg7QUFDQSx3QkFBUSxHQUFSLENBQVksUUFBWjtBQUNBLHFCQUFLLElBQUksSUFBSSxDQUFiLEVBQWdCLElBQUksWUFBWSxDQUFaLEVBQWUsTUFBZixDQUFzQixNQUExQyxFQUFrRCxHQUFsRCxFQUFzRDtBQUNsRCxpQ0FBYSxRQUFRLFlBQVksQ0FBWixFQUFlLE1BQWYsQ0FBc0IsQ0FBdEIsRUFBeUIsQ0FBekIsQ0FBUixHQUFzQyxNQUFuRDtBQUNBLHNCQUFFLDhDQUE4QyxRQUE5QyxHQUF5RCxJQUEzRCxFQUFpRSxNQUFqRSxDQUF3RSxVQUF4RTtBQUNIO0FBQ0o7QUFDRCxjQUFFLDhDQUE4QyxRQUE5QyxHQUF5RCxJQUEzRCxFQUFpRSxJQUFqRSxDQUFzRSxVQUF0RTtBQUNIO0FBYkUsS0FBUDtBQWVBLE1BQUUsaUJBQUYsRUFBcUIsSUFBckIsQ0FBMEIsaUJBQTFCO0FBQ0giLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbiBlKHQsbixyKXtmdW5jdGlvbiBzKG8sdSl7aWYoIW5bb10pe2lmKCF0W29dKXt2YXIgYT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2lmKCF1JiZhKXJldHVybiBhKG8sITApO2lmKGkpcmV0dXJuIGkobywhMCk7dmFyIGY9bmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitvK1wiJ1wiKTt0aHJvdyBmLmNvZGU9XCJNT0RVTEVfTk9UX0ZPVU5EXCIsZn12YXIgbD1uW29dPXtleHBvcnRzOnt9fTt0W29dWzBdLmNhbGwobC5leHBvcnRzLGZ1bmN0aW9uKGUpe3ZhciBuPXRbb11bMV1bZV07cmV0dXJuIHMobj9uOmUpfSxsLGwuZXhwb3J0cyxlLHQsbixyKX1yZXR1cm4gbltvXS5leHBvcnRzfXZhciBpPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7Zm9yKHZhciBvPTA7bzxyLmxlbmd0aDtvKyspcyhyW29dKTtyZXR1cm4gc30pIiwidmFyIHJvc3Rlck9iaiA9IHtcbiAgICBjZWx0aWNzOiB7XG4gICAgICAgIHJvc3Rlcjoge30sXG4gICAgICAgIGxlYWRlcnM6IHtcbiAgICAgICAgICAgIHB0czogW1xuICAgICAgICAgICAgICAgIFsnLS0nLCAnLS0nLCAnLS0nLCAnLS0nXSxcbiAgICAgICAgICAgICAgICBbJy0tJywgJy0tJywgJy0tJywgJy0tJ10sXG4gICAgICAgICAgICAgICAgWyctLScsICctLScsICctLScsICctLSddXG4gICAgICAgICAgICBdLFxuICAgICAgICAgICAgYXN0OiBbXG4gICAgICAgICAgICAgICAgWyctLScsICctLScsICctLScsICctLSddLFxuICAgICAgICAgICAgICAgIFsnLS0nLCAnLS0nLCAnLS0nLCAnLS0nXSxcbiAgICAgICAgICAgICAgICBbJy0tJywgJy0tJywgJy0tJywgJy0tJ11cbiAgICAgICAgICAgIF0sXG4gICAgICAgICAgICByZWI6IFtcbiAgICAgICAgICAgICAgICBbJy0tJywgJy0tJywgJy0tJywgJy0tJ10sXG4gICAgICAgICAgICAgICAgWyctLScsICctLScsICctLScsICctLSddLFxuICAgICAgICAgICAgICAgIFsnLS0nLCAnLS0nLCAnLS0nLCAnLS0nXVxuICAgICAgICAgICAgXVxuICAgICAgICB9XG4gICAgfSxcbiAgICBhd2F5OiB7XG4gICAgICAgIHJvc3Rlcjoge30sXG4gICAgICAgIGxlYWRlcnM6IHtcbiAgICAgICAgICAgIHB0czogW1xuICAgICAgICAgICAgICAgIFsnLS0nLCAnLS0nLCAnLS0nLCAnLS0nXSxcbiAgICAgICAgICAgICAgICBbJy0tJywgJy0tJywgJy0tJywgJy0tJ10sXG4gICAgICAgICAgICAgICAgWyctLScsICctLScsICctLScsICctLSddXG4gICAgICAgICAgICBdLFxuICAgICAgICAgICAgYXN0OiBbXG4gICAgICAgICAgICAgICAgWyctLScsICctLScsICctLScsICctLSddLFxuICAgICAgICAgICAgICAgIFsnLS0nLCAnLS0nLCAnLS0nLCAnLS0nXSxcbiAgICAgICAgICAgICAgICBbJy0tJywgJy0tJywgJy0tJywgJy0tJ11cbiAgICAgICAgICAgIF0sXG4gICAgICAgICAgICByZWI6IFtcbiAgICAgICAgICAgICAgICBbJy0tJywgJy0tJywgJy0tJywgJy0tJ10sXG4gICAgICAgICAgICAgICAgWyctLScsICctLScsICctLScsICctLSddLFxuICAgICAgICAgICAgICAgIFsnLS0nLCAnLS0nLCAnLS0nLCAnLS0nXVxuICAgICAgICAgICAgXVxuICAgICAgICB9XG4gICAgfVxufTtcbiQoZG9jdW1lbnQpLnJlYWR5KGZ1bmN0aW9uKCkge1xuICAgIHZhciBnaWQgPSAnJztcbiAgICB2YXIgYXdheVRlYW0gPSAnJztcbiAgICB2YXIgZ2FtZVN0YXJ0ZWQgPSBmYWxzZTtcbiAgICB2YXIgcGxheWVyU3BvdGxpZ2h0Q291bnRlciA9IDEwO1xuICAgIHZhciBkYXRlID0gbmV3IERhdGUoKTtcbiAgICB2YXIgbGVmdFdyYXBDb3VudGVyID0gZmFsc2U7XG4gICAgJC5hamF4KHtcbiAgICAgICAgdXJsOiAnaHR0cDovL2xvY2FsaG9zdDo4ODg4L2RhdGEvbW9iaWxlLXN0YXRzLWZlZWQvdG9kYXlzX3Njb3Jlcy5qc29uJyxcbiAgICAgICAgYXN5bmM6IGZhbHNlLFxuICAgICAgICBzdWNjZXNzOiBmdW5jdGlvbih0b2RheXNTY29yZXNEYXRhKSB7XG4gICAgICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IHRvZGF5c1Njb3Jlc0RhdGEuZ3MuZy5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgICAgIGlmICh0b2RheXNTY29yZXNEYXRhLmdzLmdbaV0uaC50YSA9PSAnSU5EJykgeyAvL0NIQU5HRSBUSElTXG4gICAgICAgICAgICAgICAgICAgIGF3YXlUZWFtID0gdG9kYXlzU2NvcmVzRGF0YS5ncy5nW2ldLnYudGE7XG4gICAgICAgICAgICAgICAgICAgIGxvYWRSb3N0ZXJEYXRhKGF3YXlUZWFtKTtcbiAgICAgICAgICAgICAgICAgICAgc2NvcmVzSW5pdCh0b2RheXNTY29yZXNEYXRhKTtcbiAgICAgICAgICAgICAgICAgICAgc3RhbmRpbmdzSW5pdChhd2F5VGVhbSk7XG4gICAgICAgICAgICAgICAgICAgIGxlYWd1ZUxlYWRlcnMoKTtcbi8qICAgICAgICAgICAgICAgICAgICBzZXRJbnRlcnZhbChsZWZ0V3JhcCwgMzAwMCk7Ki9cbiAgICAgICAgICAgICAgICAgICAgZ2lkID0gdG9kYXlzU2NvcmVzRGF0YS5ncy5nW2ldLmdpZDtcbi8qICAgICAgICAgICAgICAgICAgICBpbml0TW9iaWxlQXBwKCk7XG4gICAgICAgICAgICAgICAgICAgIG1vYmlsZUFwcCgpOyovXG4gICAgICAgICAgICAgICAgICAgIC8qICAgICAgICAgICAgICAgICAgICBwbGF5ZXJTcG90bGlnaHQocm9zdGVyT2JqLCBwbGF5ZXJTcG90bGlnaHRDb3VudGVyKTsqL1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH0pO1xuICAgIC8vIGxvYWRSb3N0ZXJEYXRhKCk7IE9OTFkgT05DRVxuICAgIC8qICAgIHNldFRpbWVvdXQobGVhZGVycyhnaWQsIGdhbWVTdGFydGVkKSwgNDAwKTsqL1xufSk7XG4vKj09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG49ICAgICAgICAgICAgTUlTQyBGVU5DVElPTlMgICAgICAgICAgICA9XG49PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PSovXG5mdW5jdGlvbiBwbGF5ZXJBZ2UoZG9iKSB7XG4gICAgdmFyIHRvZGF5ID0gbmV3IERhdGUoKTtcbiAgICB2YXIgYmlydGhEYXRlID0gbmV3IERhdGUoZG9iKTtcbiAgICB2YXIgYWdlID0gdG9kYXkuZ2V0RnVsbFllYXIoKSAtIGJpcnRoRGF0ZS5nZXRGdWxsWWVhcigpO1xuICAgIHJldHVybiBhZ2U7XG59XG5cbmZ1bmN0aW9uIGdlbmVyYXRlVGltZWxpbmUoc2VsZWN0ZWRQbGF5ZXIpIHtcbiAgICAvLyBBUFBFTkQ6IFRJTUVMSU5FXG4gICAgdmFyIHNlYXNvbnNQbGF5ZWQgPSByb3N0ZXJPYmouY2VsdGljcy5yb3N0ZXJbc2VsZWN0ZWRQbGF5ZXJdLnN0YXRzLnNhLmxlbmd0aDtcbiAgICB2YXIgdGltZWxpbmVIVE1MID0gJyc7XG4gICAgdmFyIHNlYXNvblllYXJIVE1MID0gJyc7XG4gICAgZm9yICh2YXIgaSA9IDA7IGkgPCBzZWFzb25zUGxheWVkOyBpKyspIHtcbiAgICAgICAgdmFyIHRlYW1BYmJyZXZpYXRpb24gPSByb3N0ZXJPYmouY2VsdGljcy5yb3N0ZXJbc2VsZWN0ZWRQbGF5ZXJdLnN0YXRzLnNhW2ldLnRhO1xuICAgICAgICB2YXIgdHJhZGVkID0gcm9zdGVyT2JqLmNlbHRpY3Mucm9zdGVyW3NlbGVjdGVkUGxheWVyXS5zdGF0cy5zYVtpXS5zcGwubGVuZ3RoO1xuICAgICAgICB2YXIgc2VnbWVudElubmVyID0gXCJcIjtcbiAgICAgICAgdmFyIHRpdGxlID0gXCJcIjtcbiAgICAgICAgdmFyIHNlYXNvblllYXJUZXh0ID0gcm9zdGVyT2JqLmNlbHRpY3Mucm9zdGVyW3NlbGVjdGVkUGxheWVyXS5zdGF0cy5zYVtpXS52YWw7XG4gICAgICAgIGlmIChpID09PSAwIHx8IHRlYW1BYmJyZXZpYXRpb24gIT09IHJvc3Rlck9iai5jZWx0aWNzLnJvc3RlcltzZWxlY3RlZFBsYXllcl0uc3RhdHMuc2FbaSAtIDFdLnRhKSB7IC8vIElmIHRoaXMgaXMgYSBuZXcgdGVhbSwgc3RhcnQgdGhlIHRlYW0gd3JhcC5cbiAgICAgICAgICAgIHRpdGxlID0gdGVhbUFiYnJldmlhdGlvbjtcbiAgICAgICAgfVxuICAgICAgICBpZiAodHJhZGVkKSB7XG4gICAgICAgICAgICBmb3IgKHZhciB4ID0gMDsgeCA8IHRyYWRlZDsgeCsrKSB7XG4gICAgICAgICAgICAgICAgdmFyIGdwVG90ID0gcm9zdGVyT2JqLmNlbHRpY3Mucm9zdGVyW3NlbGVjdGVkUGxheWVyXS5zdGF0cy5zYVtpXS5ncDtcbiAgICAgICAgICAgICAgICB2YXIgZ3AgPSByb3N0ZXJPYmouY2VsdGljcy5yb3N0ZXJbc2VsZWN0ZWRQbGF5ZXJdLnN0YXRzLnNhW2ldLnNwbFt4XS5ncDtcbiAgICAgICAgICAgICAgICB2YXIgZ3BQZXJjZW50YWdlID0gTWF0aC5yb3VuZCgoZ3AgLyBncFRvdCkgKiAxMDApO1xuICAgICAgICAgICAgICAgIHRlYW1BYmJyZXZpYXRpb24gPSByb3N0ZXJPYmouY2VsdGljcy5yb3N0ZXJbc2VsZWN0ZWRQbGF5ZXJdLnN0YXRzLnNhW2ldLnNwbFt4XS50YTtcbiAgICAgICAgICAgICAgICBpZiAoaSA9PT0gMCB8fCB0ZWFtQWJicmV2aWF0aW9uICE9PSByb3N0ZXJPYmouY2VsdGljcy5yb3N0ZXJbc2VsZWN0ZWRQbGF5ZXJdLnN0YXRzLnNhW2kgLSAxXS50YSAmJiB0ZWFtQWJicmV2aWF0aW9uICE9PSByb3N0ZXJPYmouY2VsdGljcy5yb3N0ZXJbc2VsZWN0ZWRQbGF5ZXJdLnN0YXRzLnNhW2kgKyAxXS50YSkgeyAvLyBJZiB0aGlzIGlzIGEgbmV3IHRlYW0sIHN0YXJ0IHRoZSB0ZWFtIHdyYXAuXG4gICAgICAgICAgICAgICAgICAgIHRpdGxlID0gdGVhbUFiYnJldmlhdGlvbjtcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICB0aXRsZSA9IFwiXCI7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIHNlZ21lbnRJbm5lciArPSAnPGRpdiBkYXRhLXNlYXNvbi15ZWFyPVwiJyArIHNlYXNvblllYXJUZXh0ICsgJ1wiIGRhdGEtdGVhbT1cIicgKyB0ZWFtQWJicmV2aWF0aW9uICsgJ1wiIHN0eWxlPVwiXCIgY2xhc3M9XCJzZWdtZW50LWlubmVyICcgKyB0ZWFtQWJicmV2aWF0aW9uICsgJy1iZ1wiPjxwPicgKyB0aXRsZSArICc8L3A+PC9kaXY+JztcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHNlZ21lbnRJbm5lciA9ICc8ZGl2IGRhdGEtc2Vhc29uLXllYXI9XCInICsgc2Vhc29uWWVhclRleHQgKyAnXCIgZGF0YS10ZWFtPVwiJyArIHRlYW1BYmJyZXZpYXRpb24gKyAnXCIgY2xhc3M9XCJzZWdtZW50LWlubmVyICcgKyB0ZWFtQWJicmV2aWF0aW9uICsgJy1iZ1wiPjxwPicgKyB0aXRsZSArICc8L3A+PC9kaXY+JztcbiAgICAgICAgfVxuICAgICAgICB0aW1lbGluZUhUTUwgKz0gJzxkaXYgY2xhc3M9XCJzZWdtZW50XCI+JyArIHNlZ21lbnRJbm5lciArICc8L2Rpdj4nO1xuICAgICAgICBzZWFzb25ZZWFySFRNTCArPSAnPGRpdiBjbGFzcz1cInNlZ21lbnRcIj48cD4nICsgc2Vhc29uWWVhclRleHQgKyAnPC9wPjwvZGl2Pic7XG4gICAgfVxuICAgICQoXCIudGltZWxpbmUtd3JhcFwiKS5odG1sKCc8ZGl2IGNsYXNzPVwidGltZWxpbmUgYXBwZW5kZWRcIj4nICsgdGltZWxpbmVIVE1MICsgJzwvZGl2PjxkaXYgY2xhc3M9XCJzZWFzb24teWVhciBhcHBlbmRlZFwiPicgKyBzZWFzb25ZZWFySFRNTCArICc8L2Rpdj4nKTtcbn1cbi8qPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuPSAgICAgICAgICAgIElOSVRJQUxJWkUgICAgICAgICAgICA9XG49PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09Ki9cbmZ1bmN0aW9uIGluaXQoKSB7XG4gICAgaWYgKCFnYW1lU3RhcnRlZCkge1xuICAgICAgICAkLmFqYXgoe1xuICAgICAgICAgICAgdXJsOiAnaHR0cDovL2xvY2FsaG9zdDo4ODg4L2RhdGEvbW9iaWxlLXN0YXRzLWZlZWQvdG9kYXlzX3Njb3Jlcy5qc29uJyxcbiAgICAgICAgICAgIGFzeW5jOiBmYWxzZSxcbiAgICAgICAgICAgIHN1Y2Nlc3M6IGZ1bmN0aW9uKHRvZGF5c1Njb3Jlc0RhdGEpIHtcbiAgICAgICAgICAgICAgICB2YXIgZ2lkID0gJyc7XG4gICAgICAgICAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCB0b2RheXNTY29yZXNEYXRhLmdzLmcubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgICAgICAgICAgaWYgKHRvZGF5c1Njb3Jlc0RhdGEuZ3MuZ1tpXS5oLnRhID09ICdPUkwnKSB7IC8vIENIQU5HRSBUSElTIFRPICdCT1MnIFdIRU4gVEhFIFRJTUUgQ09NRVNcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmICh0b2RheXNTY29yZXNEYXRhLmdzLmdbaV0gIT09IDEpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBnYW1lU3RhcnRlZCA9IHRydWU7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgIH1cbn07XG5cbmZ1bmN0aW9uIGluaXRNb2JpbGVBcHAoKSB7XG4gICAgdmFyIGNvdW50ZXIgPSAxO1xuICAgIHNldEludGVydmFsKGZ1bmN0aW9uKCkge1xuICAgICAgICAkKCcuYXBwIC5ib3R0b20td3JhcCBpbWcnKS5yZW1vdmVDbGFzcygnYWN0aXZlJyk7XG4gICAgICAgICQoJy5hcHAgLmZlYXR1cmUtbGlzdCBwJykucmVtb3ZlQ2xhc3MoJ2FjdGl2ZScpO1xuICAgICAgICAkKCcuYXBwIC5mZWF0dXJlLWxpc3QgcDpudGgtb2YtdHlwZSgnICsgY291bnRlciArICcpJykuYWRkQ2xhc3MoJ2FjdGl2ZScpO1xuICAgICAgICAkKCcuYXBwIC5ib3R0b20td3JhcCBpbWc6bnRoLW9mLXR5cGUoJyArIGNvdW50ZXIgKyAnKScpLmFkZENsYXNzKCdhY3RpdmUnKTtcbiAgICAgICAgaWYgKGNvdW50ZXIgPT0gNSkge1xuICAgICAgICAgICAgY291bnRlciA9IDE7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBjb3VudGVyKys7XG4gICAgICAgIH1cbiAgICB9LCAyMDAwKTtcbn07XG5cbi8qPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG49ICAgICAgICAgICAgTE9BRCBST1NURVIgSU5GTyAoYnVpbGQgcm9zdGVyT2JqKSAgICAgICAgICAgICAgPVxuPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09Ki9cblxuZnVuY3Rpb24gbG9hZFJvc3RlckRhdGEoYXdheVRlYW0pIHtcbiAgICB2YXIgcm9zdGVyID0gJyc7XG4gICAgJC5hamF4KHtcbiAgICAgICAgdXJsOiAnaHR0cDovL2xvY2FsaG9zdDo4ODg4L2RhdGEvbW9iaWxlLXN0YXRzLWZlZWQvY2VsdGljc19yb3N0ZXIuanNvbicsXG4gICAgICAgIGFzeW5jOiBmYWxzZSxcbiAgICAgICAgc3VjY2VzczogZnVuY3Rpb24oZGF0YSkge1xuICAgICAgICAgICAgcm9zdGVyID0gZGF0YTtcbiAgICAgICAgICAgIGZvciAodmFyIHByb3BlcnR5IGluIHJvc3Rlci50KSB7XG4gICAgICAgICAgICAgICAgaWYgKHByb3BlcnR5ICE9PSAncGwnKSB7XG4gICAgICAgICAgICAgICAgICAgIHJvc3Rlck9iai5jZWx0aWNzW3Byb3BlcnR5XSA9IHJvc3Rlci50W3Byb3BlcnR5XTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH0sXG4gICAgICAgIGVycm9yOiBmdW5jdGlvbigpIHt9XG4gICAgfSk7XG4gICAgdmFyIGF3YXlSb3N0ZXIgPSAnJztcbiAgICAkLmFqYXgoe1xuICAgICAgICB1cmw6ICdodHRwOi8vbG9jYWxob3N0Ojg4ODgvZGF0YS9tb2JpbGUtc3RhdHMtZmVlZC9hd2F5X3Jvc3Rlci5qc29uJyxcbiAgICAgICAgYXN5bmM6IGZhbHNlLFxuICAgICAgICBzdWNjZXNzOiBmdW5jdGlvbihkYXRhKSB7XG4gICAgICAgICAgICBhd2F5Um9zdGVyID0gZGF0YTtcbiAgICAgICAgICAgIGZvciAodmFyIHByb3BlcnR5IGluIGF3YXlSb3N0ZXIudCkge1xuICAgICAgICAgICAgICAgIGlmIChwcm9wZXJ0eSAhPT0gJ3BsJykge1xuICAgICAgICAgICAgICAgICAgICByb3N0ZXJPYmouYXdheVtwcm9wZXJ0eV0gPSBhd2F5Um9zdGVyLnRbcHJvcGVydHldO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfSxcbiAgICAgICAgZXJyb3I6IGZ1bmN0aW9uKCkge31cbiAgICB9KTtcbiAgICB2YXIgYmlvRGF0YSA9ICcnO1xuICAgICQuYWpheCh7XG4gICAgICAgIHVybDogJ2h0dHA6Ly9sb2NhbGhvc3Q6ODg4OC9kYXRhL2Jpby1kYXRhLmpzb24nLFxuICAgICAgICBhc3luYzogZmFsc2UsXG4gICAgICAgIHN1Y2Nlc3M6IGZ1bmN0aW9uKGRhdGEpIHtcbiAgICAgICAgICAgIGJpb0RhdGEgPSBkYXRhO1xuICAgICAgICB9LFxuICAgICAgICBlcnJvcjogZnVuY3Rpb24oKSB7fVxuICAgIH0pO1xuICAgIGZvciAodmFyIGkgPSAwOyBpIDwgcm9zdGVyLnQucGwubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgdmFyIHBpZCA9IHJvc3Rlci50LnBsW2ldLnBpZDtcbiAgICAgICAgcm9zdGVyT2JqLmNlbHRpY3Mucm9zdGVyW3BpZF0gPSByb3N0ZXIudC5wbFtpXTtcbiAgICAgICAgZm9yICh2YXIgcHJvcGVydHkgaW4gYmlvRGF0YVtwaWRdKSB7XG4gICAgICAgICAgICByb3N0ZXJPYmouY2VsdGljcy5yb3N0ZXJbcGlkXS5iaW8gPSBiaW9EYXRhW3BpZF07XG4gICAgICAgIH07XG4gICAgICAgICQuYWpheCh7XG4gICAgICAgICAgICB1cmw6ICdodHRwOi8vbG9jYWxob3N0Ojg4ODgvZGF0YS9tb2JpbGUtc3RhdHMtZmVlZC9wbGF5ZXJjYXJkcy9wbGF5ZXJjYXJkLScgKyBwaWQgKyAnLmpzb24nLFxuICAgICAgICAgICAgYXN5bmM6IGZhbHNlLFxuICAgICAgICAgICAgc3VjY2VzczogZnVuY3Rpb24oZGF0YSkge1xuICAgICAgICAgICAgICAgIHJvc3Rlck9iai5jZWx0aWNzLnJvc3RlcltwaWRdLnN0YXRzID0gZGF0YS5wbC5jYTtcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBlcnJvcjogZnVuY3Rpb24oKSB7fVxuICAgICAgICB9KTtcbiAgICB9XG4gICAgZm9yICh2YXIgaSA9IDA7IGkgPCBhd2F5Um9zdGVyLnQucGwubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgdmFyIHBpZCA9IGF3YXlSb3N0ZXIudC5wbFtpXS5waWQ7XG4gICAgICAgIHJvc3Rlck9iai5hd2F5LnJvc3RlcltwaWRdID0gYXdheVJvc3Rlci50LnBsW2ldO1xuICAgICAgICAkLmFqYXgoe1xuICAgICAgICAgICAgdXJsOiAnaHR0cDovL2xvY2FsaG9zdDo4ODg4L2RhdGEvbW9iaWxlLXN0YXRzLWZlZWQvcGxheWVyY2FyZHMvcGxheWVyY2FyZC0yMDIzMzAuanNvbicsIC8vIENIQU5HRSBQSURcbiAgICAgICAgICAgIGFzeW5jOiBmYWxzZSxcbiAgICAgICAgICAgIHN1Y2Nlc3M6IGZ1bmN0aW9uKGRhdGEpIHtcbiAgICAgICAgICAgICAgICByb3N0ZXJPYmouYXdheS5yb3N0ZXJbcGlkXS5zdGF0cyA9IGRhdGEucGwuY2E7XG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgZXJyb3I6IGZ1bmN0aW9uKCkge31cbiAgICAgICAgfSk7XG4gICAgfVxuICAgIGZvciAodmFyIHRlYW0gaW4gcm9zdGVyT2JqKSB7XG4gICAgICAgIGZvciAodmFyIHBsYXllciBpbiByb3N0ZXJPYmpbdGVhbV0ucm9zdGVyKSB7XG4gICAgICAgICAgICB2YXIgcHRMZWFkZXJzID0gcm9zdGVyT2JqW3RlYW1dLmxlYWRlcnMucHRzO1xuICAgICAgICAgICAgdmFyIGFzdExlYWRlcnMgPSByb3N0ZXJPYmpbdGVhbV0ubGVhZGVycy5hc3Q7XG4gICAgICAgICAgICB2YXIgcmViTGVhZGVycyA9IHJvc3Rlck9ialt0ZWFtXS5sZWFkZXJzLnJlYjtcbiAgICAgICAgICAgIGZvciAodmFyIHN0YXQgaW4gcm9zdGVyT2JqW3RlYW1dLmxlYWRlcnMpIHtcbiAgICAgICAgICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IDM7IGkrKykge1xuICAgICAgICAgICAgICAgICAgICBpZiAocm9zdGVyT2JqW3RlYW1dLmxlYWRlcnNbc3RhdF1baV1bMl0gPT0gJy0tJyAmJiByb3N0ZXJPYmpbdGVhbV0ucm9zdGVyW3BsYXllcl0uc3RhdHNbc3RhdF0gPiAwKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICByb3N0ZXJPYmpbdGVhbV0ubGVhZGVyc1tzdGF0XVtpXVswXSA9IHJvc3Rlck9ialt0ZWFtXS5yb3N0ZXJbcGxheWVyXS5mbi50b1VwcGVyQ2FzZSgpO1xuICAgICAgICAgICAgICAgICAgICAgICAgcm9zdGVyT2JqW3RlYW1dLmxlYWRlcnNbc3RhdF1baV1bMV0gPSByb3N0ZXJPYmpbdGVhbV0ucm9zdGVyW3BsYXllcl0ubG4udG9VcHBlckNhc2UoKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJvc3Rlck9ialt0ZWFtXS5sZWFkZXJzW3N0YXRdW2ldWzJdID0gcm9zdGVyT2JqW3RlYW1dLnJvc3RlcltwbGF5ZXJdLnN0YXRzW3N0YXRdO1xuICAgICAgICAgICAgICAgICAgICAgICAgcm9zdGVyT2JqW3RlYW1dLmxlYWRlcnNbc3RhdF1baV1bM10gPSByb3N0ZXJPYmpbdGVhbV0ucm9zdGVyW3BsYXllcl0ucGlkO1xuICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgICAgIH0gZWxzZSBpZiAocm9zdGVyT2JqW3RlYW1dLnJvc3RlcltwbGF5ZXJdLnN0YXRzW3N0YXRdID4gcm9zdGVyT2JqW3RlYW1dLmxlYWRlcnNbc3RhdF1baV1bMl0gJiYgcm9zdGVyT2JqW3RlYW1dLnJvc3RlcltwbGF5ZXJdLnN0YXRzW3N0YXRdID4gMCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgcm9zdGVyT2JqW3RlYW1dLmxlYWRlcnNbc3RhdF1baV1bMF0gPSByb3N0ZXJPYmpbdGVhbV0ucm9zdGVyW3BsYXllcl0uZm4udG9VcHBlckNhc2UoKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJvc3Rlck9ialt0ZWFtXS5sZWFkZXJzW3N0YXRdW2ldWzFdID0gcm9zdGVyT2JqW3RlYW1dLnJvc3RlcltwbGF5ZXJdLmxuLnRvVXBwZXJDYXNlKCk7XG4gICAgICAgICAgICAgICAgICAgICAgICByb3N0ZXJPYmpbdGVhbV0ubGVhZGVyc1tzdGF0XVtpXVsyXSA9IHJvc3Rlck9ialt0ZWFtXS5yb3N0ZXJbcGxheWVyXS5zdGF0c1tzdGF0XTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJvc3Rlck9ialt0ZWFtXS5sZWFkZXJzW3N0YXRdW2ldWzNdID0gcm9zdGVyT2JqW3RlYW1dLnJvc3RlcltwbGF5ZXJdLnBpZDtcbiAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cbiAgICBjb25zb2xlLmxvZyhyb3N0ZXJPYmopO1xufTtcblxuZnVuY3Rpb24gc3RhdHNOb3RBdmFpbGFibGUocGlkKSB7XG4gICAgcm9zdGVyT2JqW3BpZF0uc3RhdHMgPSB7fTtcbiAgICByb3N0ZXJPYmpbcGlkXS5zdGF0cy5zYSA9IFt7fV07XG4gICAgcm9zdGVyT2JqW3BpZF0uc3RhdHMuaGFzU3RhdHMgPSBmYWxzZTtcbiAgICB2YXIgY2FJbmRleCA9IFsnZ3AnLCAnZ3MnLCAnbWluJywgJ2ZncCcsICd0cHAnLCAnZnRwJywgJ29yZWInLCAnZHJlYicsICdyZWInLCAnYXN0JywgJ3N0bCcsICdibGsnLCAndG92JywgJ3BmJywgJ3B0cycsICdub3N0YXRzJ107XG4gICAgdmFyIHNhSW5kZXggPSBbJ3RpZCcsICd2YWwnLCAnZ3AnLCAnZ3MnLCAnbWluJywgJ2ZncCcsICd0cHAnLCAnZnRwJywgJ29yZWInLCAnZHJlYicsICdyZWInLCAnYXN0JywgJ3N0bCcsICdibGsnLCAndG92JywgJ3BmJywgJ3B0cycsICdzcGwnLCAndGEnLCAndG4nLCAndGMnXTtcbiAgICBmb3IgKHZhciBpID0gMDsgaSA8IHNhSW5kZXgubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgcm9zdGVyT2JqW3BpZF0uc3RhdHMuc2FbMF1bc2FJbmRleFtpXV0gPSBcIk4vQVwiO1xuICAgICAgICBpZiAoaSA9PT0gMSkge1xuICAgICAgICAgICAgcm9zdGVyT2JqW3BpZF0uc3RhdHMuc2FbMF1bc2FJbmRleFtpXV0gPSBwbGF5ZXJDYXJkWWVhci50b1N0cmluZygpLnN1YnN0cigyLCAyKSArIFwiLVwiICsgKHBsYXllckNhcmRZZWFyICsgMSkudG9TdHJpbmcoKS5zdWJzdHIoMiwgMik7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKGkgPT09IDE3KSB7XG4gICAgICAgICAgICByb3N0ZXJPYmpbcGlkXS5zdGF0cy5zYVswXVtzYUluZGV4W2ldXSA9IFtdO1xuICAgICAgICB9XG4gICAgICAgIGlmIChpID09PSAxOCkge1xuICAgICAgICAgICAgcm9zdGVyT2JqW3BpZF0uc3RhdHMuc2FbMF1bc2FJbmRleFtpXV0gPSAnQk9TJztcbiAgICAgICAgfVxuICAgIH1cbiAgICBmb3IgKHZhciBpID0gMDsgaSA8IGNhSW5kZXgubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgcm9zdGVyT2JqW3BpZF0uc3RhdHNbY2FJbmRleFtpXV0gPSBcIk4vQVwiO1xuICAgICAgICBpZiAoaSA9PT0gMTUpIHtcbiAgICAgICAgICAgIHJvc3Rlck9ialtwaWRdLnN0YXRzW2NhSW5kZXhbaV1dID0gdHJ1ZTtcbiAgICAgICAgfVxuICAgIH1cbn07XG5cbmZ1bmN0aW9uIGxvYWRHYW1lRGV0YWlsKGdpZCkge307XG5cbmZ1bmN0aW9uIGxvYWRBd2F5VGVhbURhdGEoKSB7fVxuLyo9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG49ICAgICAgICAgICAgUklHSFQgV1JBUCAgICAgICAgICAgID1cbj09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT0qL1xuZnVuY3Rpb24gcGxheWVyU3BvdGxpZ2h0KHJvc3Rlck9iaiwgcGxheWVyU3BvdGxpZ2h0Q291bnRlcikge1xuICAgIC8qIDEgLSBXSElURSBMSU5FIEhPUklaVE9OQUwgKi9cbiAgICBzZXRUaW1lb3V0KGZ1bmN0aW9uKCkge1xuICAgICAgICAkKCcud2hpdGUtbGluZS5ob3Jpem9udGFsJykuYWRkQ2xhc3MoJ3RyYW5zaXRpb24tMScpO1xuICAgIH0sIDUwMCk7XG4gICAgc2V0VGltZW91dChmdW5jdGlvbigpIHtcbiAgICAgICAgJCgnLnNvY2lhbC10b3AgLndoaXRlLWxpbmUudmVydGljYWw6bnRoLWNoaWxkKG9kZCknKS5hZGRDbGFzcygndHJhbnNpdGlvbi0xJyk7XG4gICAgICAgICQoJy5zb2NpYWwtYm90dG9tIC53aGl0ZS1saW5lLnZlcnRpY2FsOm50aC1jaGlsZChldmVuKScpLmFkZENsYXNzKCd0cmFuc2l0aW9uLTEnKTtcbiAgICB9LCA4MDApO1xuICAgIC8qIDJiIC0gV0hJVEUgTElORSBWRVJUSUNBTCAqL1xuICAgIHNldFRpbWVvdXQoZnVuY3Rpb24oKSB7XG4gICAgICAgICQoJy5zb2NpYWwtdG9wIC53aGl0ZS1saW5lLnZlcnRpY2FsOm50aC1jaGlsZChldmVuKScpLmFkZENsYXNzKCd0cmFuc2l0aW9uLTEnKTtcbiAgICAgICAgJCgnLnNvY2lhbC1ib3R0b20gLndoaXRlLWxpbmUudmVydGljYWw6bnRoLWNoaWxkKG9kZCknKS5hZGRDbGFzcygndHJhbnNpdGlvbi0xJyk7XG4gICAgfSwgMTAwMCk7XG4gICAgLyogMyAtIEdFTkVSQVRFIEFORCBSRVZFQUwgUExBWUVSIEJPWEVTICovXG4gICAgc2V0VGltZW91dChmdW5jdGlvbigpIHtcbiAgICAgICAgJCgnLnNvY2lhbC10b3AsIC5zb2NpYWwtYm90dG9tJykuYWRkQ2xhc3MoJ3RyYW5zaXRpb24tMScpO1xuICAgICAgICAkKCcucGxheWVyLWJveC13cmFwJykuYWRkQ2xhc3MoJ3RyYW5zaXRpb24tMScpO1xuICAgIH0sIDEyMDApO1xuICAgIC8qIDQgLSBBUFBFTkQgSEVBRFNIT1RTICovXG4gICAgc2V0VGltZW91dChmdW5jdGlvbigpIHtcbiAgICAgICAgJCgnLnBsYXllci1ib3gtd3JhcCcpLmFkZENsYXNzKCd0cmFuc2l0aW9uLTInKTtcbiAgICAgICAgJCgnLnBsYXllci1ib3gnKS5hZGRDbGFzcygndHJhbnNpdGlvbi0xJyk7XG4gICAgICAgIHZhciBkZWxheSA9IDA7XG4gICAgICAgIHZhciBmb3JpbkNvdW50ZXIgPSAwO1xuICAgICAgICBmb3IgKHZhciBwbGF5ZXIgaW4gcm9zdGVyT2JqLmNlbHRpY3Mucm9zdGVyKSB7XG4gICAgICAgICAgICBjb25zb2xlLmxvZyhwbGF5ZXIpO1xuICAgICAgICAgICAgdmFyIGhlYWRzaG90ID0gJ2h0dHBzOi8vYWstc3RhdGljLmNtcy5uYmEuY29tL3dwLWNvbnRlbnQvdXBsb2Fkcy9oZWFkc2hvdHMvbmJhL2xhdGVzdC8xMDQweDc2MC8nICsgcm9zdGVyT2JqLmNlbHRpY3Mucm9zdGVyW3BsYXllcl0ucGlkICsgJy5wbmcnO1xuICAgICAgICAgICAgJCgnLnBsYXllci1ib3g6bnRoLWNoaWxkKCcgKyAoZm9yaW5Db3VudGVyICsgMSkgKyAnKScpLmFwcGVuZCgnPGltZyBjbGFzcz1cImFwcGVuZGVkIGhlYWRzaG90XCIgc3JjPVwiJyArIGhlYWRzaG90ICsgJ1wiLz4nKTtcbiAgICAgICAgICAgICQoJy5wbGF5ZXItYm94Om50aC1jaGlsZCgnICsgKGZvcmluQ291bnRlciArIDEpICsgJyknKS5hdHRyKCdkYXRhLXBpZCcsIHJvc3Rlck9iai5jZWx0aWNzLnJvc3RlcltwbGF5ZXJdLnBpZCk7XG4gICAgICAgICAgICAkKCcucGxheWVyLWJveCBpbWcnKS5vbihcImVycm9yXCIsIGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgICAgICQodGhpcykuYXR0cignc3JjJywgJ2h0dHBzOi8vaS5jZG4udHVybmVyLmNvbS9uYmEvbmJhLy5lbGVtZW50L21lZGlhLzIuMC90ZWFtc2l0ZXMvY2VsdGljcy9tZWRpYS9nZW5lcmljLXBsYXllci1saWdodF82MDB4NDM4LnBuZycpO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAkKCcucGxheWVyLWJveDpudGgtY2hpbGQoJyArIChmb3JpbkNvdW50ZXIgKyAxKSArICcpIGltZycpLmRlbGF5KGRlbGF5KS5mYWRlVG8oMzAwLCAxKTtcbiAgICAgICAgICAgIGRlbGF5ICs9IDMwO1xuICAgICAgICAgICAgZm9yaW5Db3VudGVyKys7XG4gICAgICAgIH1cbiAgICB9LCAxMzAwKTtcbiAgICAvKiA1IC0gUExBWUVSIFNFTEVDVCAqL1xuICAgIHZhciBzZWxlY3RlZFBsYXllciA9ICcnO1xuICAgIHNldFRpbWVvdXQoZnVuY3Rpb24oKSB7XG4gICAgICAgICQoJy5wbGF5ZXItYm94JykuYWRkQ2xhc3MoJ3RyYW5zaXRpb24tMicpO1xuICAgICAgICAkKCcucGxheWVyLWJveDpudGgtY2hpbGQoJyArIChwbGF5ZXJTcG90bGlnaHRDb3VudGVyICsgMSkgKyAnKScpLmFkZENsYXNzKCdzZWxlY3RlZCcpO1xuICAgICAgICBzZWxlY3RlZFBsYXllciA9ICQoJy5wbGF5ZXItYm94Om50aC1jaGlsZCgnICsgKHBsYXllclNwb3RsaWdodENvdW50ZXIgKyAxKSArICcpJykuYXR0cignZGF0YS1waWQnKTtcbiAgICAgICAgY29uc29sZS5sb2coc2VsZWN0ZWRQbGF5ZXIpO1xuICAgICAgICAkKCcucGxheWVyLWJveCcpLm5vdCgnLnJlcGxhY2VtZW50LnNlbGVjdGVkJykuZGVsYXkoNTAwKS5hZGRDbGFzcygndHJhbnNpdGlvbi00Jyk7XG4gICAgfSwgMjAwMCk7XG4gICAgLyogNiAtIFBMQVlFUiBCT1ggRVhQQU5EICovXG4gICAgc2V0VGltZW91dChmdW5jdGlvbigpIHtcbiAgICAgICAgJCgnLmJsb2NrLXdyYXAuc29jaWFsJykuYWRkQ2xhc3MoJ3RyYW5zaXRpb24tMycpO1xuICAgICAgICAkKCcucGxheWVyLWJveC5yZXBsYWNlbWVudC5zZWxlY3RlZCcpLmFkZENsYXNzKCd0cmFuc2l0aW9uLTMnKTtcbiAgICB9LCAzMDAwKTtcbiAgICAvKiA3IC0gU1BPVExJR0hUIEhUTUwgKi9cbiAgICBzZXRUaW1lb3V0KGZ1bmN0aW9uKCkge1xuICAgICAgICBnZW5lcmF0ZVRpbWVsaW5lKHNlbGVjdGVkUGxheWVyKTtcbiAgICAgICAgJCgnLnBsYXllci1ib3gucmVwbGFjZW1lbnQuc2VsZWN0ZWQnKS5jbG9uZSgpLmFwcGVuZFRvKCcuYmxvY2std3JhcC5wbGF5ZXItc3BvdGxpZ2h0IC50b3Atd3JhcCcpO1xuICAgICAgICAkKCcucGxheWVyLXNwb3RsaWdodCAuc2VsZWN0ZWQnKS5hZGRDbGFzcygnLmFwcGVuZGVkJyk7XG4gICAgICAgICQoJy5ibG9jay13cmFwLnBsYXllci1zcG90bGlnaHQnKS5hZGRDbGFzcygndHJhbnNpdGlvbi0xJyk7XG4gICAgICAgICQoJy5ibG9jay13cmFwLnNvY2lhbCcpLmFkZENsYXNzKCd0cmFuc2l0aW9uLTEnKTtcbiAgICAgICAgdmFyIHN0YXRzID0gcm9zdGVyT2JqLmNlbHRpY3Mucm9zdGVyW3NlbGVjdGVkUGxheWVyXS5zdGF0cztcbiAgICAgICAgJCgnLnBsYXllci1zcG90bGlnaHQgLnRvcC13cmFwIC5wbGF5ZXItdG9wJykuYXBwZW5kKCc8aW1nIGNsYXNzPVwic2lsbyBhcHBlbmRlZFwiIHNyYz1cImh0dHA6Ly9pby5jbm4ubmV0L25iYS9uYmEvLmVsZW1lbnQvbWVkaWEvMi4wL3RlYW1zaXRlcy9jZWx0aWNzL21lZGlhL3NpbG8tNDY2eDU5MS0nICsgcm9zdGVyT2JqLmNlbHRpY3Mucm9zdGVyW3NlbGVjdGVkUGxheWVyXS5waWQgKyAnLnBuZ1wiIC8+PGRpdiBjbGFzcz1cInRvcCBhcHBlbmRlZFwiPjxkaXYgY2xhc3M9XCJwbGF5ZXItbmFtZS13cmFwXCI+PHAgY2xhc3M9XCJwbGF5ZXItbmFtZVwiPjxzcGFuPicgKyByb3N0ZXJPYmouY2VsdGljcy5yb3N0ZXJbc2VsZWN0ZWRQbGF5ZXJdLmZuLnRvVXBwZXJDYXNlKCkgKyAnPC9zcGFuPiA8YnI+ICcgKyByb3N0ZXJPYmouY2VsdGljcy5yb3N0ZXJbc2VsZWN0ZWRQbGF5ZXJdLmxuLnRvVXBwZXJDYXNlKCkgKyAnPC9wPjwvZGl2PjxwIGNsYXNzPVwicGxheWVyLW51bWJlclwiPicgKyByb3N0ZXJPYmouY2VsdGljcy5yb3N0ZXJbc2VsZWN0ZWRQbGF5ZXJdLm51bSArICc8L2JyPjxzcGFuPicgKyByb3N0ZXJPYmouY2VsdGljcy5yb3N0ZXJbc2VsZWN0ZWRQbGF5ZXJdLnBvcyArICc8L3NwYW4+PC9wPjwvZGl2PjxkaXYgY2xhc3M9XCJtaWRkbGUgYXBwZW5kZWRcIj48dWwgY2xhc3M9XCJpbmZvIGNsZWFyZml4XCI+PGxpPjxwPkFHRTxzcGFuIGNsYXNzPVwic20taGlkZVwiPjombmJzcDs8L3NwYW4+IDwvYnI+PHNwYW4gY2xhc3M9XCJpbmZvLXZhbHVlXCI+JyArIHBsYXllckFnZShyb3N0ZXJPYmouY2VsdGljcy5yb3N0ZXJbc2VsZWN0ZWRQbGF5ZXJdLmRvYikgKyAnPC9zcGFuPjwvcD48L2xpPjxsaT48cD5IVDxzcGFuIGNsYXNzPVwic20taGlkZVwiPjombmJzcDs8L3NwYW4+IDwvYnI+PHNwYW4gY2xhc3M9XCJpbmZvLXZhbHVlXCI+JyArIHJvc3Rlck9iai5jZWx0aWNzLnJvc3RlcltzZWxlY3RlZFBsYXllcl0uaHQgKyAnPC9zcGFuPjwvcD48L2xpPjxsaT48cD5XVDxzcGFuIGNsYXNzPVwic20taGlkZVwiPjombmJzcDs8L3NwYW4+IDwvYnI+PHNwYW4gY2xhc3M9XCJpbmZvLXZhbHVlXCI+JyArIHJvc3Rlck9iai5jZWx0aWNzLnJvc3RlcltzZWxlY3RlZFBsYXllcl0ud3QgKyAnPC9zcGFuPjwvcD48L2xpPjwvdWw+PC9kaXY+PGRpdiBjbGFzcz1cImJvdHRvbSBmdWxsIGNsZWFyZml4IHNtLWhpZGUgYXBwZW5kZWRcIj48dGFibGUgY2xhc3M9XCJhdmVyYWdlc1wiPjx0ciBjbGFzcz1cImF2ZXJhZ2VzLWxhYmVsc1wiPjx0ZD48cD5HUDwvcD48L3RkPjx0ZD48cD5QUEc8L3A+PC90ZD48dGQ+PHA+UlBHPC9wPjwvdGQ+PHRkPjxwPkFQRzwvcD48L3RkPjwvdHI+PHRyIGNsYXNzPVwiYXZlcmFnZXMtc2Vhc29uXCI+PHRkIGNsYXNzPVwiZ3BcIj48cD48L3A+PC90ZD48dGQgY2xhc3M9XCJwdHNcIj48cD48L3A+PC90ZD48dGQgY2xhc3M9XCJyZWJcIj48cD48L3A+PC90ZD48dGQgY2xhc3M9XCJhc3RcIj48cD48L3A+PC90ZD48L3RyPjwvdGFibGU+PC9kaXY+Jyk7XG4gICAgICAgICQoXCIucGxheWVyLXNwb3RsaWdodCAuYXZlcmFnZXMtc2Vhc29uXCIpLmh0bWwoJzx0ZD48cD4nICsgc3RhdHMuc2FbMF0uZ3AgKyAnPC9wPjwvdGQ+PHRkPjxwPicgKyBzdGF0cy5zYVswXS5wdHMgKyAnPC9wPjwvdGQ+PHRkPjxwPicgKyBzdGF0cy5zYVswXS5yZWIgKyAnPC9wPjwvdGQ+PHRkPjxwPicgKyBzdGF0cy5zYVswXS5hc3QgKyAnPC9wPjwvdGQ+Jyk7XG4gICAgICAgICQoJy5wbGF5ZXItc3BvdGxpZ2h0IC5wbGF5ZXItbmFtZScpLmZhZGVUbygyMDAsIDEpO1xuICAgICAgICB2YXIgcGxheWVyRmFjdHMgPSByb3N0ZXJPYmouY2VsdGljcy5yb3N0ZXJbc2VsZWN0ZWRQbGF5ZXJdLmJpby5wZXJzb25hbDtcbiAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCAzOyBpKyspIHtcbiAgICAgICAgICAgIHZhciBmYWN0SW5kZXggPSBNYXRoLmZsb29yKE1hdGgucmFuZG9tKCkgKiBwbGF5ZXJGYWN0cy5sZW5ndGgpO1xuICAgICAgICAgICAgJCgnLnBsYXllci1zcG90bGlnaHQgLmJvdHRvbS13cmFwJykuYXBwZW5kKCc8ZGl2IGNsYXNzPVwiZHlrLWJveCBhcHBlbmRlZFwiPjxwPicgKyBwbGF5ZXJGYWN0c1tmYWN0SW5kZXhdICsgJzwvcD48L2Rpdj4nKTtcbiAgICAgICAgfTtcbiAgICAgICAgJCgnLnBsYXllci1zcG90bGlnaHQgLmJvdHRvbS13cmFwJykuYWRkQ2xhc3MoJ3RyYW5zaXRpb24tMScpO1xuICAgICAgICBzZXRUaW1lb3V0KGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgJCgnLnBsYXllci1zcG90bGlnaHQgLmJvdHRvbS13cmFwIC5keWstYm94Om50aC1vZi10eXBlKDIpJykuYWRkQ2xhc3MoJ3RyYW5zaXRpb24tMicpO1xuICAgICAgICAgICAgJCgnLnBsYXllci1zcG90bGlnaHQgLmJvdHRvbS13cmFwIC5keWstYm94Om50aC1vZi10eXBlKDMpJykuYWRkQ2xhc3MoJ3RyYW5zaXRpb24tMScpO1xuICAgICAgICB9LCAxMDAwKTtcbiAgICAgICAgc2V0VGltZW91dChmdW5jdGlvbigpIHtcbiAgICAgICAgICAgICQoJy5wbGF5ZXItc3BvdGxpZ2h0IC5ib3R0b20td3JhcCAuZHlrLWJveDpudGgtb2YtdHlwZSgzKScpLmFkZENsYXNzKCd0cmFuc2l0aW9uLTInKTtcbiAgICAgICAgICAgICQoJy5wbGF5ZXItc3BvdGxpZ2h0IC5ib3R0b20td3JhcCAuZHlrLWJveDpudGgtb2YtdHlwZSg0KScpLmFkZENsYXNzKCd0cmFuc2l0aW9uLTEnKTtcbiAgICAgICAgfSwgMTUwMCk7XG4gICAgfSwgMzYwMCk7XG4gICAgLyogOCAtIFNQT1RMSUdIVCBTTElERSBJTiAqL1xuICAgIHNldFRpbWVvdXQoZnVuY3Rpb24oKSB7XG4gICAgICAgICQoJy5wbGF5ZXItc3BvdGxpZ2h0IC5wbGF5ZXItdG9wIC5wbGF5ZXItbmFtZSwgLnBsYXllci1zcG90bGlnaHQgLnBsYXllci1uYW1lLXdyYXAsIC5wbGF5ZXItc3BvdGxpZ2h0IC5oZWFkc2hvdCwgLnBsYXllci1zcG90bGlnaHQgLmluZm8sIC5wbGF5ZXItc3BvdGxpZ2h0IC5zaWxvLCAucGxheWVyLXNwb3RsaWdodCAuYXZlcmFnZXMsIC5wbGF5ZXItc3BvdGxpZ2h0IC5wbGF5ZXItbnVtYmVyJykuYWRkQ2xhc3MoJ3RyYW5zaXRpb24tMScpO1xuICAgICAgICBzZXRUaW1lb3V0KGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgJCgnLmJsb2NrLXdyYXAucGxheWVyLXNwb3RsaWdodCAucGxheWVyLWJveCcpLnJlbW92ZSgpO1xuICAgICAgICB9LCA0MDAwKTtcbiAgICAgICAgaWYgKHBsYXllclNwb3RsaWdodENvdW50ZXIgPCAxNikge1xuICAgICAgICAgICAgcGxheWVyU3BvdGxpZ2h0Q291bnRlcisrO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgcGxheWVyU3BvdGxpZ2h0Q291bnRlciA9IDA7XG4gICAgICAgIH1cbiAgICB9LCA0MTAwKTtcbiAgICAvKiA5IC0gU1BPVExJR0hUIFNMSURFIE9VVCAqL1xuICAgIHNldFRpbWVvdXQoZnVuY3Rpb24oKSB7XG4gICAgICAgICQoJy5wbGF5ZXItc3BvdGxpZ2h0IC5ib3R0b20td3JhcCwgLnBsYXllci1zcG90bGlnaHQgLnRvcC13cmFwJykuYWRkQ2xhc3MoJ3RyYW5zaXRpb24tMicpO1xuICAgIH0sIDYwMDApO1xuICAgIC8qIDEwIC0gRE9ORS4gUkVNT1ZFIFRIQVQgU0hJVCAqL1xuICAgIHNldFRpbWVvdXQoZnVuY3Rpb24oKSB7XG4gICAgICAgICQoJy5hcHBlbmRlZCcpLnJlbW92ZSgpO1xuICAgICAgICAkKCcudHJhbnNpdGlvbiwgLnRyYW5zaXRpb24tMSwgLnRyYW5zaXRpb24tMiwgLnRyYW5zaXRpb24tMywgLnRyYW5zaXRpb24tNCcpLnJlbW92ZUNsYXNzKCd0cmFuc2l0aW9uIHRyYW5zaXRpb24tMSB0cmFuc2l0aW9uLTIgdHJhbnNpdGlvbi0zIHRyYW5zaXRpb24tNCcpO1xuICAgIH0sIDcwMDApO1xufVxuXG5mdW5jdGlvbiBsZWFkZXJzKGdpZCwgZ2FtZVN0YXJ0ZWQpIHtcbiAgICB2YXIgZ2FtZURldGFpbCA9ICcnO1xuICAgIHZhciBkZXRhaWxBdmFpbGFibGUgPSBmYWxzZTtcbiAgICBnYW1lU3RhcnRlZCA9IHRydWU7IC8vIERPOiBERUxFVEUgVEhJUyBXSEVOIE9OTElORS4gSlVTVCBGT1IgVEVTVElORyBQVVJQT1NFUyBSTlxuICAgIGlmIChnYW1lU3RhcnRlZCkge1xuICAgICAgICAkLmFqYXgoe1xuICAgICAgICAgICAgdXJsOiAnaHR0cDovL2xvY2FsaG9zdDo4ODg4L2RhdGEvbW9iaWxlLXN0YXRzLWZlZWQvZ2FtZWRldGFpbC5qc29uJyxcbiAgICAgICAgICAgIGFzeW5jOiBmYWxzZSxcbiAgICAgICAgICAgIHN1Y2Nlc3M6IGZ1bmN0aW9uKGRhdGEpIHtcbiAgICAgICAgICAgICAgICAvLyBETzogVVBEQVRFIFRIRSBMRUFERVIgT0JKRUNUU1xuICAgICAgICAgICAgICAgIGdhbWVEZXRhaWwgPSBkYXRhO1xuICAgICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICB9XG4gICAgZm9yICh2YXIgdGVhbSBpbiByb3N0ZXJPYmopIHtcbiAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCAzOyBpKyspIHtcbiAgICAgICAgICAgIGZvciAodmFyIHN0YXQgaW4gcm9zdGVyT2JqW3RlYW1dLmxlYWRlcnMpIHtcbiAgICAgICAgICAgICAgICAvLyBMRUFERVIgU1RBVCBWQUxVRVxuICAgICAgICAgICAgICAgICQoJy5sZWFkZXItc2VjdGlvbjpudGgtb2YtdHlwZSgnICsgKGkgKyAyKSArICcpIC4nICsgc3RhdCArICcuJyArIHRlYW0gKyAnIC5zdGF0JykuYXBwZW5kKCc8c3BhbiBjbGFzcz1cIicgKyByb3N0ZXJPYmpbdGVhbV0udGEgKyAnXCI+JyArIHJvc3Rlck9ialt0ZWFtXS5sZWFkZXJzW3N0YXRdW2ldWzJdICsgJzwvc3Bhbj4gJyArIHN0YXQudG9VcHBlckNhc2UoKSk7XG4gICAgICAgICAgICAgICAgLy8gTEVBREVSIE5BTUVcbiAgICAgICAgICAgICAgICBpZiAocm9zdGVyT2JqW3RlYW1dLmxlYWRlcnNbc3RhdF1baV1bMF0ubGVuZ3RoICsgcm9zdGVyT2JqW3RlYW1dLmxlYWRlcnNbc3RhdF1baV1bMV0ubGVuZ3RoID49IDE1KSB7XG4gICAgICAgICAgICAgICAgICAgIHJvc3Rlck9ialt0ZWFtXS5sZWFkZXJzW3N0YXRdW2ldWzBdID0gcm9zdGVyT2JqW3RlYW1dLmxlYWRlcnNbc3RhdF1baV1bMF0uc3Vic3RyKDAsIDEpICsgJy4nO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAkKCcubGVhZGVyLXNlY3Rpb246bnRoLW9mLXR5cGUoJyArIChpICsgMikgKyAnKSAuJyArIHN0YXQgKyAnLicgKyB0ZWFtICsgJyAubmFtZScpLmFwcGVuZCgnPHNwYW4+JyArIHJvc3Rlck9ialt0ZWFtXS5sZWFkZXJzW3N0YXRdW2ldWzBdICsgJzwvc3Bhbj4gJyArIHJvc3Rlck9ialt0ZWFtXS5sZWFkZXJzW3N0YXRdW2ldWzFdKTtcbiAgICAgICAgICAgICAgICAvLyBMRUFERVIgSEVBRFNIT1RcbiAgICAgICAgICAgICAgICAkKCcubGVhZGVyLXNlY3Rpb246bnRoLW9mLXR5cGUoJyArIChpICsgMikgKyAnKSAuJyArIHN0YXQgKyAnLicgKyB0ZWFtICsgJyAuaGVhZHNob3QnKS5hdHRyKCdzcmMnLCAnaHR0cHM6Ly9hay1zdGF0aWMuY21zLm5iYS5jb20vd3AtY29udGVudC91cGxvYWRzL2hlYWRzaG90cy9uYmEvbGF0ZXN0LzEwNDB4NzYwLycgKyByb3N0ZXJPYmpbdGVhbV0ubGVhZGVyc1tzdGF0XVtpXVszXSArICcucG5nJyk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9XG4gICAgdmFyIHRpbWVCZXR3ZWVuID0gMTAwMDtcbiAgICAkKCcubGVhZGVycywgLmxlYWRlcnMgLmJsb2NrLWlubmVyJykuYWRkQ2xhc3MoJ3RyYW5zaXRpb24tMScpO1xuICAgIHNldFRpbWVvdXQoZnVuY3Rpb24oKSB7XG4gICAgICAgICQoJy5sZWFkZXJzIC5sZWFkZXItc2VjdGlvbicpLmFkZENsYXNzKCd0cmFuc2l0aW9uLTEnKTtcbiAgICAgICAgJCgnLmxlYWRlci1zdWJzZWN0aW9uLmJvdHRvbSBwOm50aC1vZi10eXBlKDEpJykuYWRkQ2xhc3MoJ3RyYW5zaXRpb24tMScpO1xuICAgICAgICAkKCcubGVhZGVycyAubGVhZGVyLXNlY3Rpb24gLnVuZGVybGluZSwgLmxlYWRlcnMgLmxlYWRlci1zdWJzZWN0aW9uLnRvcCcpLmFkZENsYXNzKHJvc3Rlck9iai5jZWx0aWNzLnRhICsgJy1iZycpO1xuICAgIH0sIDgwMCk7XG4gICAgdmFyIHRyYW5zaXRpb25Db3VudGVyID0gMTtcbiAgICBmb3IgKGxldCBpID0gMTsgaSA8PSA2OyBpKyspIHtcbiAgICAgICAgc2V0VGltZW91dChmdW5jdGlvbihudW1iZXJTdHJpbmcpIHtcbiAgICAgICAgICAgICQoJy5sZWFkZXJzIC5sZWFkZXItc2VjdGlvbiAubGVhZGVyLXN0YXQtd3JhcCcpLmFkZENsYXNzKCd0cmFuc2l0aW9uLScgKyBpKTtcbiAgICAgICAgICAgICQoJy5sZWFkZXJzIC5sZWFkZXItc2VjdGlvbiAudW5kZXJsaW5lLCAubGVhZGVycyAubGVhZGVyLXN1YnNlY3Rpb24udG9wJykucmVtb3ZlQ2xhc3Mocm9zdGVyT2JqLmNlbHRpY3MudGEgKyAnLWJnJyk7XG4gICAgICAgICAgICAkKCcubGVhZGVycyAubGVhZGVyLXNlY3Rpb24gLnVuZGVybGluZSwgLmxlYWRlcnMgLmxlYWRlci1zdWJzZWN0aW9uLnRvcCcpLmFkZENsYXNzKHJvc3Rlck9iai5hd2F5LnRhICsgJy1iZycpO1xuICAgICAgICAgICAgaWYgKHRyYW5zaXRpb25Db3VudGVyICUgMiA9PSAwKSB7XG4gICAgICAgICAgICAgICAgc2V0VGltZW91dChmdW5jdGlvbigpIHtcbiAgICAgICAgICAgICAgICAgICAgJCgnLmxlYWRlcnMgLmxlYWRlci1zZWN0aW9uIC51bmRlcmxpbmUsIC5sZWFkZXJzIC5sZWFkZXItc3Vic2VjdGlvbi50b3AnKS5yZW1vdmVDbGFzcyhyb3N0ZXJPYmouYXdheS50YSArICctYmcnKTtcbiAgICAgICAgICAgICAgICAgICAgJCgnLmxlYWRlcnMgLmxlYWRlci1zZWN0aW9uIC51bmRlcmxpbmUsIC5sZWFkZXJzIC5sZWFkZXItc3Vic2VjdGlvbi50b3AnKS5hZGRDbGFzcyhyb3N0ZXJPYmouY2VsdGljcy50YSArICctYmcnKTtcbiAgICAgICAgICAgICAgICAgICAgJCgnLmxlYWRlci1zdWJzZWN0aW9uLmJvdHRvbSBwJykucmVtb3ZlQ2xhc3MoJ3RyYW5zaXRpb24tMScpO1xuICAgICAgICAgICAgICAgICAgICAkKCcubGVhZGVycyAubGVhZGVyLXNlY3Rpb24gLnVuZGVybGluZScpLmFkZENsYXNzKCd0cmFuc2l0aW9uLScgKyAoaSAvIDIpKTtcbiAgICAgICAgICAgICAgICAgICAgJCgnLmxlYWRlci1zdWJzZWN0aW9uLmJvdHRvbSBwOm50aC1vZi10eXBlKCcgKyAoaSAtIChpIC8gMikgKyAxKSArICcpJykuYWRkQ2xhc3MoJ3RyYW5zaXRpb24tMScpOyAvLyBsb2xcbiAgICAgICAgICAgICAgICB9LCAyMDApO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgdHJhbnNpdGlvbkNvdW50ZXIrKztcbiAgICAgICAgfSwgMjAwMCAqIGkpO1xuICAgIH1cbn07XG5cbmZ1bmN0aW9uIHNvY2lhbChyb3N0ZXIpIHt9O1xuXG5mdW5jdGlvbiBtb2JpbGVBcHAoKSB7XG4gICAgJCgnLmFwcCcpLnNob3coKTtcbn07XG4vKj09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuPSAgICAgICAgICAgIExFRlQgV1JBUCAgICAgICAgICAgID1cbj09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PSovXG5cbmZ1bmN0aW9uIGxlZnRXcmFwKCkge1xuICAgIGlmICgkKCcubGVmdC13cmFwIC5zdGFuZGluZ3MnKS5oYXNDbGFzcygndHJhbnNpdGlvbi0xJykpe1xuICAgICAgICAkKCcubGVmdC13cmFwIC5zdGFuZGluZ3MnKS5yZW1vdmVDbGFzcygndHJhbnNpdGlvbi0xJyk7XG4gICAgfVxuICAgIGVsc2Uge1xuICAgICAgICAkKCcubGVmdC13cmFwIC5zdGFuZGluZ3MnKS5hZGRDbGFzcygndHJhbnNpdGlvbi0xJyk7XG4gICAgfVxuXG4gICAgaWYgKCQoJy5sZWZ0LXdyYXAgLnNjb3JlcycpLmhhc0NsYXNzKCd0cmFuc2l0aW9uLTEnKSl7XG4gICAgICAgICQoJy5sZWZ0LXdyYXAgLnNjb3JlcycpLnJlbW92ZUNsYXNzKCd0cmFuc2l0aW9uLTEnKTtcbiAgICB9XG4gICAgZWxzZSB7XG4gICAgICAgICQoJy5sZWZ0LXdyYXAgLnNjb3JlcycpLmFkZENsYXNzKCd0cmFuc2l0aW9uLTEnKTtcbiAgICB9XG59XG5cblxuZnVuY3Rpb24gc3RhbmRpbmdzSW5pdChhd2F5VGVhbSkge1xuICAgICQuYWpheCh7XG4gICAgICAgIHVybDogJ2h0dHA6Ly9sb2NhbGhvc3Q6ODg4OC9kYXRhL21vYmlsZS1zdGF0cy1mZWVkL3N0YW5kaW5ncy5qc29uJyxcbiAgICAgICAgYXN5bmM6IGZhbHNlLFxuICAgICAgICBzdWNjZXNzOiBmdW5jdGlvbihzdGFuZGluZ3NEYXRhKSB7XG4gICAgICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IHN0YW5kaW5nc0RhdGEuc3RhLmNvLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICAgICAgZm9yIChsZXQgeCA9IDA7IHggPCBzdGFuZGluZ3NEYXRhLnN0YS5jb1tpXS5kaS5sZW5ndGg7IHgrKykge1xuICAgICAgICAgICAgICAgICAgICBmb3IgKGxldCB0ID0gMDsgdCA8IHN0YW5kaW5nc0RhdGEuc3RhLmNvW2ldLmRpW3hdLnQubGVuZ3RoOyB0KyspIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHZhciBjb25mZXJlbmNlcyA9IFsnLmVhc3QnLCAnLndlc3QnXTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHZhciBwbGFjZSA9IHN0YW5kaW5nc0RhdGEuc3RhLmNvW2ldLmRpW3hdLnRbdF0uc2VlO1xuICAgICAgICAgICAgICAgICAgICAgICAgdmFyIHNlZWQgPSAnJztcbiAgICAgICAgICAgICAgICAgICAgICAgIHZhciBhY3RpdmVTdGF0dXMgPSAnJztcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChzdGFuZGluZ3NEYXRhLnN0YS5jb1tpXS5kaVt4XS50W3RdLnNlZSA8PSA4KSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgc2VlZCA9IHN0YW5kaW5nc0RhdGEuc3RhLmNvW2ldLmRpW3hdLnRbdF0uc2VlO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHN0YW5kaW5nc0RhdGEuc3RhLmNvW2ldLmRpW3hdLnRbdF0udGEgPT0gJ0JPUycpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBhY3RpdmVTdGF0dXMgPSAnYWN0aXZlJztcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChzdGFuZGluZ3NEYXRhLnN0YS5jb1tpXS5kaVt4XS50W3RdLnRhID09IGF3YXlUZWFtKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgYWN0aXZlU3RhdHVzID0gJ2FjdGl2ZS1hd2F5JztcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgIHZhciByb3dIVE1MID0gJzxkaXYgY2xhc3M9XCJwbGFjZVwiPicgKyBzZWVkICsgJzwvZGl2PjxkaXYgY2xhc3M9XCJsb2dvLXdyYXBcIj48aW1nIGNsYXNzPVwibG9nb1wiIHNyYz1odHRwOi8vaS5jZG4udHVybmVyLmNvbS9uYmEvbmJhL2Fzc2V0cy9sb2dvcy90ZWFtcy9wcmltYXJ5L3dlYi8nICsgc3RhbmRpbmdzRGF0YS5zdGEuY29baV0uZGlbeF0udFt0XS50YSArICcuc3ZnPjwvZGl2PjxkaXYgY2xhc3M9XCJ0ZWFtICsgJyArIHN0YW5kaW5nc0RhdGEuc3RhLmNvW2ldLmRpW3hdLnRbdF0udGEgKyAnXCI+JyArIHN0YW5kaW5nc0RhdGEuc3RhLmNvW2ldLmRpW3hdLnRbdF0udGEgKyAnPC9kaXY+PGRpdiBjbGFzcz1cIndpbnNcIj4nICsgc3RhbmRpbmdzRGF0YS5zdGEuY29baV0uZGlbeF0udFt0XS53ICsgJzwvZGl2PjxkaXYgY2xhc3M9XCJsb3NzZXNcIj4nICsgc3RhbmRpbmdzRGF0YS5zdGEuY29baV0uZGlbeF0udFt0XS5sICsgJzwvZGl2PjxkaXYgY2xhc3M9XCJnYW1lcy1iZWhpbmRcIj4nICsgc3RhbmRpbmdzRGF0YS5zdGEuY29baV0uZGlbeF0udFt0XS5nYiArICc8L2Rpdj4nO1xuICAgICAgICAgICAgICAgICAgICAgICAgJChjb25mZXJlbmNlc1tpXSArICcgPiBkaXY6bnRoLWNoaWxkKCcgKyAocGxhY2UgKyAxKSArICcpJykuaHRtbChyb3dIVE1MKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICQoY29uZmVyZW5jZXNbaV0gKyAnID4gZGl2Om50aC1jaGlsZCgnICsgKHBsYWNlICsgMSkgKyAnKScpLmFkZENsYXNzKGFjdGl2ZVN0YXR1cyk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9KTtcbn07XG5cbmZ1bmN0aW9uIHNjb3Jlc0luaXQodG9kYXlzU2NvcmVzRGF0YSkge1xuICAgIHZhciBsaXZlU2NvcmVzID0gdG9kYXlzU2NvcmVzRGF0YS5ncy5nO1xuICAgIGlmIChsaXZlU2NvcmVzLmxlbmd0aCAhPSAwKSB7XG4gICAgICAgIHZhciBzZWFzb25UeXBlID0gJyc7XG4gICAgICAgIGlmIChsaXZlU2NvcmVzWzBdLmdpZC5zdWJzdHIoMCwgMykgPT0gJzAwMScpIHtcbiAgICAgICAgICAgIHNlYXNvblR5cGUgPSAncHJlJztcbiAgICAgICAgfSBlbHNlIGlmIChsaXZlU2NvcmVzWzBdLmdpZC5zdWJzdHIoMCwgMykgPT0gJzAwNCcpIHtcbiAgICAgICAgICAgIHNlYXNvblR5cGUgPSAncG9zdCc7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKGxpdmVTY29yZXMubGVuZ3RoID4gMSB8fCAobGl2ZVNjb3Jlcy5sZW5ndGggPT0gMSAmJiBsaXZlU2NvcmVzWzBdLmgudGEgIT0gJ0JPUycpKSB7XG4gICAgICAgICAgICB2YXIgc3RhdHVzQ29kZXMgPSBbJzFzdCBRdHInLCAnMm5kIFF0cicsICczcmQgUXRyJywgJzR0aCBRdHInLCAnMXN0IE9UJywgJzJuZCBPVCcsICczcmQgT1QnLCAnNHRoIE9UJywgJzV0aCBPVCcsICc2dGggT1QnLCAnN3RoIE9UJywgJzh0aCBPVCcsICc5dGggT1QnLCAnMTB0aCBPVCddO1xuICAgICAgICAgICAgdmFyIHNjb3Jlc0hUTUwgPSAnJztcbiAgICAgICAgICAgIGZvciAodmFyIGkgPSBsaXZlU2NvcmVzLmxlbmd0aCAtIDE7IGkgPj0gMDsgaS0tKSB7XG4gICAgICAgICAgICAgICAgaWYgKGxpdmVTY29yZXNbaV0uaC50YSAhPT0gJ0JPUycpIHtcbiAgICAgICAgICAgICAgICAgICAgdmFyIHZTY29yZSA9ICcnO1xuICAgICAgICAgICAgICAgICAgICB2YXIgaFNjb3JlID0gJyc7XG4gICAgICAgICAgICAgICAgICAgIGlmIChsaXZlU2NvcmVzW2ldLnN0ICE9IDEpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHZTY29yZSA9IGxpdmVTY29yZXNbaV0udi5zO1xuICAgICAgICAgICAgICAgICAgICAgICAgaFNjb3JlID0gbGl2ZVNjb3Jlc1tpXS5oLnM7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgdmFyIHNUZXh0ID0gbGl2ZVNjb3Jlc1tpXS5zdHQ7XG4gICAgICAgICAgICAgICAgICAgIGlmIChzdGF0dXNDb2Rlcy5pbmRleE9mKGxpdmVTY29yZXNbaV0uc3R0KSAhPT0gLTEpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHNUZXh0ID0gbGl2ZVNjb3Jlc1tpXS5zdHQgKyAnIC0gJyArIGxpdmVTY29yZXNbaV0uY2w7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgc2NvcmVzSFRNTCArPSAnPGRpdiBjbGFzcz1cInNjb3JlLXdyYXBcIj48ZGl2IGNsYXNzPVwic2NvcmUtc3RhdHVzXCI+JyArIHNUZXh0ICsgJzwvZGl2PjxkaXYgY2xhc3M9XCInICsgbGl2ZVNjb3Jlc1tpXS52LnRhICsgJ1wiPjxpbWcgc3JjPVwiaHR0cDovL3N0YXRzLm5iYS5jb20vbWVkaWEvaW1nL3RlYW1zL2xvZ29zLycgKyBsaXZlU2NvcmVzW2ldLnYudGEudG9VcHBlckNhc2UoKSArICdfbG9nby5zdmdcIj4gJyArIGxpdmVTY29yZXNbaV0udi50Yy50b1VwcGVyQ2FzZSgpICsgJyAnICsgbGl2ZVNjb3Jlc1tpXS52LnRuLnRvVXBwZXJDYXNlKCkgKyAnIDxkaXYgY2xhc3M9XCJzY29yZS1udW1cIj4nICsgdlNjb3JlICsgJzwvZGl2PjwvZGl2PjxkaXYgY2xhc3M9XCInICsgbGl2ZVNjb3Jlc1tpXS5oLnRhICsgJ1wiPjxpbWcgc3JjPVwiaHR0cDovL3N0YXRzLm5iYS5jb20vbWVkaWEvaW1nL3RlYW1zL2xvZ29zLycgKyBsaXZlU2NvcmVzW2ldLmgudGEudG9VcHBlckNhc2UoKSArICdfbG9nby5zdmdcIj4gJyArIGxpdmVTY29yZXNbaV0uaC50Yy50b1VwcGVyQ2FzZSgpICsgJyAnICsgbGl2ZVNjb3Jlc1tpXS5oLnRuLnRvVXBwZXJDYXNlKCkgKyAnIDxkaXYgY2xhc3M9XCJzY29yZS1udW1cIj4nICsgaFNjb3JlICsgJzwvZGl2PjwvZGl2PjwvZGl2Pic7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgJCgnLnNjb3JlcycpLmVtcHR5KCkuYXBwZW5kKHNjb3Jlc0hUTUwgKyAnPGRpdiBjbGFzcz1cImxlYWd1ZS1sZWFkZXJzXCI+PC9kaXY+Jyk7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKGxpdmVTY29yZXMgPCA1KXtcbiAgICAgICAgICAgICQoJy5sZWFndWUtbGVhZGVycycpLnNob3coKTtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICQoJy5sZWFndWUtbGVhZGVycycpLmhpZGUoKTtcbiAgICAgICAgfVxuICAgIH1cbn1cblxuZnVuY3Rpb24gdXBkYXRlTGVhZ3VlU2NvcmVzKHRvZGF5c1Njb3Jlc0RhdGEpIHtcbiAgICB2YXIgbGl2ZVNjb3JlcyA9IHRvZGF5c1Njb3Jlc0RhdGEuZ3MuZztcbiAgICBpZiAobGl2ZVNjb3Jlcy5sZW5ndGggIT0gMCkge1xuICAgICAgICB2YXIgc2Vhc29uVHlwZSA9ICdSZWd1bGFyK1NlYXNvbic7XG4gICAgICAgIGlmIChsaXZlU2NvcmVzWzBdLmdpZC5zdWJzdHIoMCwzKSA9PSAnMDAxJykge1xuICAgICAgICAgICAgc2Vhc29uVHlwZSA9ICdQcmUrU2Vhc29uJztcbiAgICAgICAgfVxuICAgICAgICBlbHNlIGlmIChsaXZlU2NvcmVzWzBdLmdpZC5zdWJzdHIoMCwzKSA9PSAnMDA0Jykge1xuICAgICAgICAgICAgc2Vhc29uVHlwZSA9ICdQbGF5b2Zmcyc7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKGxpdmVTY29yZXMubGVuZ3RoID4gMSB8fCAobGl2ZVNjb3Jlcy5sZW5ndGggPT0gMSAmJiBsaXZlU2NvcmVzWzBdLmgudGEgIT0gJ0JPUycpKSB7XG4gICAgICAgICAgICB2YXIgc3RhdHVzQ29kZXMgPSBbJzFzdCBRdHInLCcybmQgUXRyJywnM3JkIFF0cicsJzR0aCBRdHInLCcxc3QgT1QnLCcybmQgT1QnLCczcmQgT1QnLCc0dGggT1QnLCc1dGggT1QnLCc2dGggT1QnLCc3dGggT1QnLCc4dGggT1QnLCc5dGggT1QnLCcxMHRoIE9UJ107XG4gICAgICAgICAgICB2YXIgc2NvcmVzSFRNTCA9ICcnO1xuICAgICAgICAgICAgaWYgKCQoJy5hdGwtaGVhZGVyJykubGVuZ3RoID09PSAwKSB7XG4gICAgICAgICAgICAgICAgJCgnI2xlZnR3cmFwJykucHJlcGVuZCgnPGltZyBjbGFzcz1cImF0bC1oZWFkZXJcIiBzcmM9XCJodHRwOi8vaS5jZG4udHVybmVyLmNvbS9uYmEvbmJhLy5lbGVtZW50L21lZGlhLzIuMC90ZWFtc2l0ZXMvY2VsdGljcy9tZWRpYS9zaWduYWdlLWF0bC05NjB4MTM1LnBuZ1wiPicpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZm9yICh2YXIgaSA9IGxpdmVTY29yZXMubGVuZ3RoIC0gMTsgaSA+PSAwOyBpLS0pIHtcbiAgICAgICAgICAgICAgICBpZiAobGl2ZVNjb3Jlc1tpXS5oLnRhICE9PSAnQk9TJykge1xuICAgICAgICAgICAgICAgICAgICB2YXIgdlNjb3JlID0gJyc7XG4gICAgICAgICAgICAgICAgICAgIHZhciBoU2NvcmUgPSAnJztcbiAgICAgICAgICAgICAgICAgICAgaWYgKGxpdmVTY29yZXNbaV0uc3QgIT0gMSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgdlNjb3JlID0gbGl2ZVNjb3Jlc1tpXS52LnM7XG4gICAgICAgICAgICAgICAgICAgICAgICBoU2NvcmUgPSBsaXZlU2NvcmVzW2ldLmgucztcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB2YXIgc1RleHQgPSBsaXZlU2NvcmVzW2ldLnN0dDtcbiAgICAgICAgICAgICAgICAgICAgaWYgKHN0YXR1c0NvZGVzLmluZGV4T2YobGl2ZVNjb3Jlc1tpXS5zdHQpICE9PSAtMSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgc1RleHQgPSBsaXZlU2NvcmVzW2ldLnN0dCArICcgLSAnICsgbGl2ZVNjb3Jlc1tpXS5jbDtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICBzY29yZXNIVE1MICs9ICc8ZGl2IGNsYXNzPVwic2NvcmUtd3JhcFwiPjxkaXYgY2xhc3M9XCJzY29yZS1jb250YWluZXJcIj48ZGl2IGNsYXNzPVwiJyArIGxpdmVTY29yZXNbaV0udi50YSArICdcIj48aW1nIHNyYz1cImh0dHA6Ly9zdGF0cy5uYmEuY29tL21lZGlhL2ltZy90ZWFtcy9sb2dvcy8nICsgbGl2ZVNjb3Jlc1tpXS52LnRhLnRvVXBwZXJDYXNlKCkgKyAnX2xvZ28uc3ZnXCI+ICcgKyBsaXZlU2NvcmVzW2ldLnYudGMudG9VcHBlckNhc2UoKSArICcgJyArIGxpdmVTY29yZXNbaV0udi50bi50b1VwcGVyQ2FzZSgpICsgJyA8ZGl2IGNsYXNzPVwic2NvcmUtbnVtXCI+JyArIHZTY29yZSArICc8L2Rpdj48L2Rpdj48ZGl2IGNsYXNzPVwiJyArIGxpdmVTY29yZXNbaV0uaC50YSArICdcIj48aW1nIHNyYz1cImh0dHA6Ly9zdGF0cy5uYmEuY29tL21lZGlhL2ltZy90ZWFtcy9sb2dvcy8nICsgbGl2ZVNjb3Jlc1tpXS5oLnRhLnRvVXBwZXJDYXNlKCkgKyAnX2xvZ28uc3ZnXCI+ICcgKyBsaXZlU2NvcmVzW2ldLmgudGMudG9VcHBlckNhc2UoKSArICcgJyArIGxpdmVTY29yZXNbaV0uaC50bi50b1VwcGVyQ2FzZSgpICsgJyA8ZGl2IGNsYXNzPVwic2NvcmUtbnVtXCI+JyArIGhTY29yZSArICc8L2Rpdj48L2Rpdj48ZGl2IGNsYXNzPVwic2NvcmUtc3RhdHVzXCI+JyArIHNUZXh0ICsgJzwvZGl2PjwvZGl2PjwvZGl2Pic7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgJCgnLnNjb3JlcycpLmVtcHR5KCkuYXBwZW5kKHNjb3Jlc0hUTUwpO1xuICAgICAgICAgICAgbGVhZ3VlTGVhZGVycyhzZWFzb25UeXBlKTtcbiAgICAgICAgfVxuICAgIH1cbn1cblxuZnVuY3Rpb24gbGVhZ3VlTGVhZGVycygpe1xuICAgIHZhciBsZWFndWVMZWFkZXJzSFRNTCA9ICcnO1xuICAgIHZhciBzdGF0VHlwZSA9ICcnO1xuICAgICQuYWpheCh7XG4gICAgICAgIHVybDogJ2h0dHA6Ly9sb2NhbGhvc3Q6ODg4OC9kYXRhL2xlYWd1ZV9sZWFkZXJzLmpzb24nLFxuICAgICAgICBzdWNjZXNzOiBmdW5jdGlvbihkYXRhKSB7XG4gICAgICAgICAgICB2YXIgbGVhZGVyc0RhdGEgPSBkYXRhLnJlc3VsdFNldHM7XG4gICAgICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IGxlYWRlcnNEYXRhLmxlbmd0aDsgaSsrKXtcbiAgICAgICAgICAgICAgICBzdGF0VHlwZSA9IGxlYWRlcnNEYXRhW2ldLmhlYWRlcnNbKGxlYWRlcnNEYXRhW2ldLmhlYWRlcnMubGVuZ3RoIC0gMSldO1xuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKHN0YXRUeXBlKTtcbiAgICAgICAgICAgICAgICBmb3IgKGxldCB4ID0gMDsgeCA8IGxlYWRlcnNEYXRhW2ldLnJvd1NldC5sZW5ndGg7IHgrKyl7XG4gICAgICAgICAgICAgICAgICAgIGxlYWRlckhUTUwgPSAnPHA+JyArIGxlYWRlcnNEYXRhW2ldLnJvd1NldFt4XVszXSArICc8L3A+JztcbiAgICAgICAgICAgICAgICAgICAgJCgnLmxlYWd1ZS1sZWFkZXJzLXdyYXAgZGl2W2RhdGEtc3RhdC10eXBlPVwiJyArIHN0YXRUeXBlICsgJ1wiXScpLmFwcGVuZChsZWFkZXJIVE1MKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICAkKCcubGVhZ3VlLWxlYWRlcnMtd3JhcCBkaXZbZGF0YS1zdGF0LXR5cGU9XCInICsgc3RhdFR5cGUgKyAnXCJdJykuaHRtbChsZWFkZXJIVE1MKTtcbiAgICAgICAgfVxuICAgIH0pO1xuICAgICQoJy5sZWFndWUtbGVhZGVycycpLmh0bWwobGVhZ3VlTGVhZGVyc0hUTUwpO1xufVxuIl19
