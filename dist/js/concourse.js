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
                    gid = todaysScoresData.gs.g[i].gid;
                    loadRosterData(awayTeam);
                    scoresInit(todaysScoresData);
                    standingsInit(awayTeam);
                    mobileAppInit();
                    leagueLeaders();
                    leftWrap();

                    // TRANSITIONS
                    setInterval(function () {
                        mobileApp();
                        setTimeout(leaders, 3000); //
                        setTimeout(social, 28000);
                        setTimeout(function () {
                            playerSpotlight(rosterObj, playerSpotlightCounter);
                        }, 35500);
                    }, 44500);
                    /*                    playerSpotlight(rosterObj, playerSpotlightCounter);
                                        allStar();
                                        highlights();*/
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

function round(number) {
    if (typeof number !== "number" || number == undefined) {
        return number;
    } else {
        return number.toFixed(1);
    }
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
    }, 3000);
    /* 5 - PLAYER SELECT */
    var selectedPlayer = '';
    setTimeout(function () {
        $('.player-box').addClass('transition-2');
        $('.player-box:nth-child(' + (playerSpotlightCounter + 1) + ')').addClass('selected');
        selectedPlayer = $('.player-box:nth-child(' + (playerSpotlightCounter + 1) + ')').attr('data-pid');
        console.log(selectedPlayer);
        $('.player-box').not('.replacement.selected').delay(500).addClass('transition-4');
    }, 4000);
    /* 6 - PLAYER BOX EXPAND */
    setTimeout(function () {
        $('.block-wrap.social').addClass('transition-3');
        $('.player-box.replacement.selected').addClass('transition-3');
    }, 5000);
    /* 7 - SPOTLIGHT HTML */
    setTimeout(function () {
        generateTimeline(selectedPlayer);
        $('.player-box.replacement.selected').clone().appendTo('.block-wrap.player-spotlight .top-wrap');
        $('.player-spotlight .selected').addClass('.appended');
        $('.block-wrap.player-spotlight').addClass('transition-1');
        $('.block-wrap.social').addClass('transition-1');
        var stats = rosterObj.celtics.roster[selectedPlayer].stats;
        $('.player-spotlight .top-wrap .player-top').append('<img class="silo appended" src="http://io.cnn.net/nba/nba/.element/media/2.0/teamsites/celtics/media/silo-466x591-' + rosterObj.celtics.roster[selectedPlayer].pid + '.png" /><div class="top appended"><div class="player-name-wrap"><p class="player-name"><span>' + rosterObj.celtics.roster[selectedPlayer].fn.toUpperCase() + '</span> <br> ' + rosterObj.celtics.roster[selectedPlayer].ln.toUpperCase() + '</p></div><p class="player-number">' + rosterObj.celtics.roster[selectedPlayer].num + '</br><span>' + rosterObj.celtics.roster[selectedPlayer].pos + '</span></p></div><div class="middle appended"><ul class="info clearfix"><li><p>AGE<span class="sm-hide">:&nbsp;</span> </br><span class="info-value">' + playerAge(rosterObj.celtics.roster[selectedPlayer].dob) + '</span></p></li><li><p>HT<span class="sm-hide">:&nbsp;</span> </br><span class="info-value">' + rosterObj.celtics.roster[selectedPlayer].ht + '</span></p></li><li><p>WT<span class="sm-hide">:&nbsp;</span> </br><span class="info-value">' + rosterObj.celtics.roster[selectedPlayer].wt + '</span></p></li></ul></div><div class="bottom full clearfix sm-hide appended"><table class="averages"><tr class="averages-labels"><td><p>GP</p></td><td><p>PPG</p></td><td><p>RPG</p></td><td><p>APG</p></td></tr><tr class="averages-season"><td class="gp"><p></p></td><td class="pts"><p></p></td><td class="reb"><p></p></td><td class="ast"><p></p></td></tr></table></div>');
        $(".player-spotlight .averages-season").html('<td class="appended"><p>' + stats.sa[0].gp + '</p></td><td class="appended"><p>' + stats.sa[0].pts + '</p></td><td class="appended"><p>' + stats.sa[0].reb + '</p></td><td class="appended"><p>' + stats.sa[0].ast + '</p></td>');
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
    }, 6000);
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
    }, 7000);
    /* 9 - SPOTLIGHT SLIDE OUT */
    setTimeout(function () {
        $('.player-spotlight .bottom-wrap, .player-spotlight .top-wrap').addClass('transition-2');
    }, 8000);
    /* 10 - DONE. REMOVE */
    setTimeout(function () {
        $(' .player-spotlight .appended').remove();
        $(' .player-spotlight .selected').removeClass('selected');
        for (var i = 1; i < 10; i++) {
            $('.transition-' + i).removeClass('transition-' + i);
        }
    }, 9000);
}

function leaders(gid, gameStarted) {
    $('.leaders').addClass('active');
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
                $('.leader-section:nth-of-type(' + (i + 2) + ') .' + stat + '.' + team + ' .stat').html('<span class="appended ' + rosterObj[team].ta + '">' + rosterObj[team].leaders[stat][i][2] + '</span> ' + stat.toUpperCase());
                // LEADER NAME
                if (rosterObj[team].leaders[stat][i][0].length + rosterObj[team].leaders[stat][i][1].length >= 15) {
                    rosterObj[team].leaders[stat][i][0] = rosterObj[team].leaders[stat][i][0].substr(0, 1) + '.';
                }
                $('.leader-section:nth-of-type(' + (i + 2) + ') .' + stat + '.' + team + ' .name').html('<span class="appended">' + rosterObj[team].leaders[stat][i][0] + '</span> ' + rosterObj[team].leaders[stat][i][1]);
                // LEADER HEADSHOT
                $('.leader-section:nth-of-type(' + (i + 2) + ') .' + stat + '.' + team + ' .headshot').attr('src', 'https://ak-static.cms.nba.com/wp-content/uploads/headshots/nba/latest/1040x760/' + rosterObj[team].leaders[stat][i][3] + '.png');
            }
        }
    }
    setTimeout(function () {
        $('.leaders, .leaders .block-inner').addClass('transition-1');
    }, 1000);
    setTimeout(function () {
        $('.leaders .leader-section').addClass('transition-1');
        $('.leader-subsection.bottom p:nth-of-type(1)').addClass('transition-1');
        $('.leaders .leader-section .underline, .leaders .leader-subsection.top').addClass(rosterObj.celtics.ta + '-bg');
    }, 2000);
    setTimeout(function () {
        $('.leaders .leader-section').addClass('transition-2');
        $('.leaders .block-inner').addClass('transition-2');
    }, 3000);
    var transitionCounter = 1;
    setTimeout(function () {
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
            }, 3500 * _i);
        };

        for (var _i = 1; _i < 6; _i++) {
            _loop(_i);
        }
    }, 1000);
    setTimeout(function () {
        $('.leaders .leader-section, .leaders .leader-subsection').addClass('transition-3');
    }, 25000);
    setTimeout(function () {
        $('.leaders').addClass('transition-2');
    }, 25000);
    setTimeout(function () {
        $('.leaders').removeClass('active');
        $('.leaders .appended').remove();
        for (var i = 1; i < 10; i++) {
            $('.transition-' + i).removeClass('transition-' + i);
        }
    }, 30000);
};

function social() {
    $('.social .text-wrap, .social .underline').removeClass('transition-1');
    $('.social').addClass('active');
    setTimeout(function () {
        $('.social .text-wrap, .social .underline').addClass('transition-1');
    }, 2500);
    /*    setTimeout(function(){
            $('.social').removeClass('active');
        }, 3000);*/
};

function mobileAppInit() {
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

function mobileApp() {
    $('.app .block-inner').removeClass('transition-1');
    $('.app').addClass('active');
    setTimeout(function () {
        $('.app .block-inner').addClass('transition-1');
    }, 2500);
    setTimeout(function () {
        $('.app').removeClass('active');
    }, 3000);
};
/*=================================
=            LEFT WRAP            =
=================================*/

function leftWrap() {
    setInterval(function () {
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
    }, 45000);
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
    var leagueLeadersHTML = '<div class="title"><p>LEAGUE LEADERS</p><p>PTS</p><p>REB</p><p>AST</p><p>STL</p><p>BLK</p></div>';
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
                if (["PTS", "REB", "AST", "STL", "BLK"].indexOf(leadersData[i].headers[8]) !== -1) {
                    for (var x = 0; x < leadersData[i].rowSet.length; x++) {
                        rows += '<div class="row"><div class="left"><div class="place">' + leadersData[i].rowSet[x][0] + '</div><div class="logo-wrap"><img class="logo" src="http://stats.nba.com/media/img/teams/logos/' + leadersData[i].rowSet[x][4] + '_logo.svg"/></div><div class="name">' + leadersData[i].rowSet[x][2].toUpperCase() + '</div></div><div class="right"><div class="value">' + round(leadersData[i].rowSet[x][8]) + '</div></div></div>';
                    }
                    leagueLeadersHTML += '<div class="league-leaders-wrap">' + rows + '</div>';
                }
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJzcmMvanMvY29uY291cnNlLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7QUNBQSxJQUFJLFlBQVk7QUFDWixhQUFTO0FBQ0wsZ0JBQVEsRUFESDtBQUVMLGlCQUFTO0FBQ0wsaUJBQUssQ0FDRCxDQUFDLElBQUQsRUFBTyxJQUFQLEVBQWEsSUFBYixFQUFtQixJQUFuQixDQURDLEVBRUQsQ0FBQyxJQUFELEVBQU8sSUFBUCxFQUFhLElBQWIsRUFBbUIsSUFBbkIsQ0FGQyxFQUdELENBQUMsSUFBRCxFQUFPLElBQVAsRUFBYSxJQUFiLEVBQW1CLElBQW5CLENBSEMsQ0FEQTtBQU1MLGlCQUFLLENBQ0QsQ0FBQyxJQUFELEVBQU8sSUFBUCxFQUFhLElBQWIsRUFBbUIsSUFBbkIsQ0FEQyxFQUVELENBQUMsSUFBRCxFQUFPLElBQVAsRUFBYSxJQUFiLEVBQW1CLElBQW5CLENBRkMsRUFHRCxDQUFDLElBQUQsRUFBTyxJQUFQLEVBQWEsSUFBYixFQUFtQixJQUFuQixDQUhDLENBTkE7QUFXTCxpQkFBSyxDQUNELENBQUMsSUFBRCxFQUFPLElBQVAsRUFBYSxJQUFiLEVBQW1CLElBQW5CLENBREMsRUFFRCxDQUFDLElBQUQsRUFBTyxJQUFQLEVBQWEsSUFBYixFQUFtQixJQUFuQixDQUZDLEVBR0QsQ0FBQyxJQUFELEVBQU8sSUFBUCxFQUFhLElBQWIsRUFBbUIsSUFBbkIsQ0FIQztBQVhBO0FBRkosS0FERztBQXFCWixVQUFNO0FBQ0YsZ0JBQVEsRUFETjtBQUVGLGlCQUFTO0FBQ0wsaUJBQUssQ0FDRCxDQUFDLElBQUQsRUFBTyxJQUFQLEVBQWEsSUFBYixFQUFtQixJQUFuQixDQURDLEVBRUQsQ0FBQyxJQUFELEVBQU8sSUFBUCxFQUFhLElBQWIsRUFBbUIsSUFBbkIsQ0FGQyxFQUdELENBQUMsSUFBRCxFQUFPLElBQVAsRUFBYSxJQUFiLEVBQW1CLElBQW5CLENBSEMs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cil7ZnVuY3Rpb24gcyhvLHUpe2lmKCFuW29dKXtpZighdFtvXSl7dmFyIGE9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtpZighdSYmYSlyZXR1cm4gYShvLCEwKTtpZihpKXJldHVybiBpKG8sITApO3ZhciBmPW5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIrbytcIidcIik7dGhyb3cgZi5jb2RlPVwiTU9EVUxFX05PVF9GT1VORFwiLGZ9dmFyIGw9bltvXT17ZXhwb3J0czp7fX07dFtvXVswXS5jYWxsKGwuZXhwb3J0cyxmdW5jdGlvbihlKXt2YXIgbj10W29dWzFdW2VdO3JldHVybiBzKG4/bjplKX0sbCxsLmV4cG9ydHMsZSx0LG4scil9cmV0dXJuIG5bb10uZXhwb3J0c312YXIgaT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2Zvcih2YXIgbz0wO288ci5sZW5ndGg7bysrKXMocltvXSk7cmV0dXJuIHN9KSIsInZhciByb3N0ZXJPYmogPSB7XG4gICAgY2VsdGljczoge1xuICAgICAgICByb3N0ZXI6IHt9LFxuICAgICAgICBsZWFkZXJzOiB7XG4gICAgICAgICAgICBwdHM6IFtcbiAgICAgICAgICAgICAgICBbJy0tJywgJy0tJywgJy0tJywgJy0tJ10sXG4gICAgICAgICAgICAgICAgWyctLScsICctLScsICctLScsICctLSddLFxuICAgICAgICAgICAgICAgIFsnLS0nLCAnLS0nLCAnLS0nLCAnLS0nXVxuICAgICAgICAgICAgXSxcbiAgICAgICAgICAgIGFzdDogW1xuICAgICAgICAgICAgICAgIFsnLS0nLCAnLS0nLCAnLS0nLCAnLS0nXSxcbiAgICAgICAgICAgICAgICBbJy0tJywgJy0tJywgJy0tJywgJy0tJ10sXG4gICAgICAgICAgICAgICAgWyctLScsICctLScsICctLScsICctLSddXG4gICAgICAgICAgICBdLFxuICAgICAgICAgICAgcmViOiBbXG4gICAgICAgICAgICAgICAgWyctLScsICctLScsICctLScsICctLSddLFxuICAgICAgICAgICAgICAgIFsnLS0nLCAnLS0nLCAnLS0nLCAnLS0nXSxcbiAgICAgICAgICAgICAgICBbJy0tJywgJy0tJywgJy0tJywgJy0tJ11cbiAgICAgICAgICAgIF1cbiAgICAgICAgfVxuICAgIH0sXG4gICAgYXdheToge1xuICAgICAgICByb3N0ZXI6IHt9LFxuICAgICAgICBsZWFkZXJzOiB7XG4gICAgICAgICAgICBwdHM6IFtcbiAgICAgICAgICAgICAgICBbJy0tJywgJy0tJywgJy0tJywgJy0tJ10sXG4gICAgICAgICAgICAgICAgWyctLScsICctLScsICctLScsICctLSddLFxuICAgICAgICAgICAgICAgIFsnLS0nLCAnLS0nLCAnLS0nLCAnLS0nXVxuICAgICAgICAgICAgXSxcbiAgICAgICAgICAgIGFzdDogW1xuICAgICAgICAgICAgICAgIFsnLS0nLCAnLS0nLCAnLS0nLCAnLS0nXSxcbiAgICAgICAgICAgICAgICBbJy0tJywgJy0tJywgJy0tJywgJy0tJ10sXG4gICAgICAgICAgICAgICAgWyctLScsICctLScsICctLScsICctLSddXG4gICAgICAgICAgICBdLFxuICAgICAgICAgICAgcmViOiBbXG4gICAgICAgICAgICAgICAgWyctLScsICctLScsICctLScsICctLSddLFxuICAgICAgICAgICAgICAgIFsnLS0nLCAnLS0nLCAnLS0nLCAnLS0nXSxcbiAgICAgICAgICAgICAgICBbJy0tJywgJy0tJywgJy0tJywgJy0tJ11cbiAgICAgICAgICAgIF1cbiAgICAgICAgfVxuICAgIH1cbn07XG4kKGRvY3VtZW50KS5yZWFkeShmdW5jdGlvbigpIHtcbiAgICB2YXIgZ2lkID0gJyc7XG4gICAgdmFyIGF3YXlUZWFtID0gJyc7XG4gICAgdmFyIGdhbWVTdGFydGVkID0gZmFsc2U7XG4gICAgdmFyIHBsYXllclNwb3RsaWdodENvdW50ZXIgPSAxMDtcbiAgICB2YXIgZGF0ZSA9IG5ldyBEYXRlKCk7XG4gICAgdmFyIGxlZnRXcmFwQ291bnRlciA9IGZhbHNlO1xuICAgICQuYWpheCh7XG4gICAgICAgIHVybDogJ2h0dHA6Ly9sb2NhbGhvc3Q6ODg4OC9kYXRhL21vYmlsZS1zdGF0cy1mZWVkL3RvZGF5c19zY29yZXMuanNvbicsXG4gICAgICAgIGFzeW5jOiBmYWxzZSxcbiAgICAgICAgc3VjY2VzczogZnVuY3Rpb24odG9kYXlzU2NvcmVzRGF0YSkge1xuICAgICAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCB0b2RheXNTY29yZXNEYXRhLmdzLmcubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgICAgICBpZiAodG9kYXlzU2NvcmVzRGF0YS5ncy5nW2ldLmgudGEgPT0gJ0JPUycpIHsgLy9DSEFOR0UgVEhJU1xuICAgICAgICAgICAgICAgICAgICBhd2F5VGVhbSA9IHRvZGF5c1Njb3Jlc0RhdGEuZ3MuZ1tpXS52LnRhO1xuICAgICAgICAgICAgICAgICAgICBnaWQgPSB0b2RheXNTY29yZXNEYXRhLmdzLmdbaV0uZ2lkO1xuICAgICAgICAgICAgICAgICAgICBsb2FkUm9zdGVyRGF0YShhd2F5VGVhbSk7XG4gICAgICAgICAgICAgICAgICAgIHNjb3Jlc0luaXQodG9kYXlzU2NvcmVzRGF0YSk7XG4gICAgICAgICAgICAgICAgICAgIHN0YW5kaW5nc0luaXQoYXdheVRlYW0pO1xuICAgICAgICAgICAgICAgICAgICBtb2JpbGVBcHBJbml0KCk7XG4gICAgICAgICAgICAgICAgICAgIGxlYWd1ZUxlYWRlcnMoKTtcbiAgICAgICAgICAgICAgICAgICAgbGVmdFdyYXAoKTtcblxuICAgICAgICAgICAgICAgICAgICAvLyBUUkFOU0lUSU9OU1xuICAgICAgICAgICAgICAgICAgICBzZXRJbnRlcnZhbChmdW5jdGlvbigpe1xuICAgICAgICAgICAgICAgICAgICAgICAgbW9iaWxlQXBwKCk7XG4gICAgICAgICAgICAgICAgICAgICAgICBzZXRUaW1lb3V0KGxlYWRlcnMsIDMwMDApOyAvL1xuICAgICAgICAgICAgICAgICAgICAgICAgc2V0VGltZW91dChzb2NpYWwsIDI4MDAwKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHNldFRpbWVvdXQoZnVuY3Rpb24oKXtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBwbGF5ZXJTcG90bGlnaHQocm9zdGVyT2JqLCBwbGF5ZXJTcG90bGlnaHRDb3VudGVyKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH0sIDM1NTAwKTtcbiAgICAgICAgICAgICAgICAgICAgfSw0NDUwMCk7XG4vKiAgICAgICAgICAgICAgICAgICAgcGxheWVyU3BvdGxpZ2h0KHJvc3Rlck9iaiwgcGxheWVyU3BvdGxpZ2h0Q291bnRlcik7XG4gICAgICAgICAgICAgICAgICAgIGFsbFN0YXIoKTtcbiAgICAgICAgICAgICAgICAgICAgaGlnaGxpZ2h0cygpOyovXG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfSk7XG4gICAgLy8gbG9hZFJvc3RlckRhdGEoKTsgT05MWSBPTkNFXG4gICAgLyogICAgc2V0VGltZW91dChsZWFkZXJzKGdpZCwgZ2FtZVN0YXJ0ZWQpLCA0MDApOyovXG59KTtcbi8qPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbj0gICAgICAgICAgICBNSVNDIEZVTkNUSU9OUyAgICAgICAgICAgID1cbj09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09Ki9cbmZ1bmN0aW9uIHBsYXllckFnZShkb2IpIHtcbiAgICB2YXIgdG9kYXkgPSBuZXcgRGF0ZSgpO1xuICAgIHZhciBiaXJ0aERhdGUgPSBuZXcgRGF0ZShkb2IpO1xuICAgIHZhciBhZ2UgPSB0b2RheS5nZXRGdWxsWWVhcigpIC0gYmlydGhEYXRlLmdldEZ1bGxZZWFyKCk7XG4gICAgcmV0dXJuIGFnZTtcbn1cblxuZnVuY3Rpb24gZ2VuZXJhdGVUaW1lbGluZShzZWxlY3RlZFBsYXllcikge1xuICAgIC8vIEFQUEVORDogVElNRUxJTkVcbiAgICB2YXIgc2Vhc29uc1BsYXllZCA9IHJvc3Rlck9iai5jZWx0aWNzLnJvc3RlcltzZWxlY3RlZFBsYXllcl0uc3RhdHMuc2EubGVuZ3RoO1xuICAgIHZhciB0aW1lbGluZUhUTUwgPSAnJztcbiAgICB2YXIgc2Vhc29uWWVhckhUTUwgPSAnJztcbiAgICBmb3IgKHZhciBpID0gMDsgaSA8IHNlYXNvbnNQbGF5ZWQ7IGkrKykge1xuICAgICAgICB2YXIgdGVhbUFiYnJldmlhdGlvbiA9IHJvc3Rlck9iai5jZWx0aWNzLnJvc3RlcltzZWxlY3RlZFBsYXllcl0uc3RhdHMuc2FbaV0udGE7XG4gICAgICAgIHZhciB0cmFkZWQgPSByb3N0ZXJPYmouY2VsdGljcy5yb3N0ZXJbc2VsZWN0ZWRQbGF5ZXJdLnN0YXRzLnNhW2ldLnNwbC5sZW5ndGg7XG4gICAgICAgIHZhciBzZWdtZW50SW5uZXIgPSBcIlwiO1xuICAgICAgICB2YXIgdGl0bGUgPSBcIlwiO1xuICAgICAgICB2YXIgc2Vhc29uWWVhclRleHQgPSByb3N0ZXJPYmouY2VsdGljcy5yb3N0ZXJbc2VsZWN0ZWRQbGF5ZXJdLnN0YXRzLnNhW2ldLnZhbDtcbiAgICAgICAgaWYgKGkgPT09IDAgfHwgdGVhbUFiYnJldmlhdGlvbiAhPT0gcm9zdGVyT2JqLmNlbHRpY3Mucm9zdGVyW3NlbGVjdGVkUGxheWVyXS5zdGF0cy5zYVtpIC0gMV0udGEpIHsgLy8gSWYgdGhpcyBpcyBhIG5ldyB0ZWFtLCBzdGFydCB0aGUgdGVhbSB3cmFwLlxuICAgICAgICAgICAgdGl0bGUgPSB0ZWFtQWJicmV2aWF0aW9uO1xuICAgICAgICB9XG4gICAgICAgIGlmICh0cmFkZWQpIHtcbiAgICAgICAgICAgIGZvciAodmFyIHggPSAwOyB4IDwgdHJhZGVkOyB4KyspIHtcbiAgICAgICAgICAgICAgICB2YXIgZ3BUb3QgPSByb3N0ZXJPYmouY2VsdGljcy5yb3N0ZXJbc2VsZWN0ZWRQbGF5ZXJdLnN0YXRzLnNhW2ldLmdwO1xuICAgICAgICAgICAgICAgIHZhciBncCA9IHJvc3Rlck9iai5jZWx0aWNzLnJvc3RlcltzZWxlY3RlZFBsYXllcl0uc3RhdHMuc2FbaV0uc3BsW3hdLmdwO1xuICAgICAgICAgICAgICAgIHZhciBncFBlcmNlbnRhZ2UgPSBNYXRoLnJvdW5kKChncCAvIGdwVG90KSAqIDEwMCk7XG4gICAgICAgICAgICAgICAgdGVhbUFiYnJldmlhdGlvbiA9IHJvc3Rlck9iai5jZWx0aWNzLnJvc3RlcltzZWxlY3RlZFBsYXllcl0uc3RhdHMuc2FbaV0uc3BsW3hdLnRhO1xuICAgICAgICAgICAgICAgIGlmIChpID09PSAwIHx8IHRlYW1BYmJyZXZpYXRpb24gIT09IHJvc3Rlck9iai5jZWx0aWNzLnJvc3RlcltzZWxlY3RlZFBsYXllcl0uc3RhdHMuc2FbaSAtIDFdLnRhICYmIHRlYW1BYmJyZXZpYXRpb24gIT09IHJvc3Rlck9iai5jZWx0aWNzLnJvc3RlcltzZWxlY3RlZFBsYXllcl0uc3RhdHMuc2FbaSArIDFdLnRhKSB7IC8vIElmIHRoaXMgaXMgYSBuZXcgdGVhbSwgc3RhcnQgdGhlIHRlYW0gd3JhcC5cbiAgICAgICAgICAgICAgICAgICAgdGl0bGUgPSB0ZWFtQWJicmV2aWF0aW9uO1xuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIHRpdGxlID0gXCJcIjtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgc2VnbWVudElubmVyICs9ICc8ZGl2IGRhdGEtc2Vhc29uLXllYXI9XCInICsgc2Vhc29uWWVhclRleHQgKyAnXCIgZGF0YS10ZWFtPVwiJyArIHRlYW1BYmJyZXZpYXRpb24gKyAnXCIgc3R5bGU9XCJcIiBjbGFzcz1cInNlZ21lbnQtaW5uZXIgJyArIHRlYW1BYmJyZXZpYXRpb24gKyAnLWJnXCI+PHA+JyArIHRpdGxlICsgJzwvcD48L2Rpdj4nO1xuICAgICAgICAgICAgfVxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgc2VnbWVudElubmVyID0gJzxkaXYgZGF0YS1zZWFzb24teWVhcj1cIicgKyBzZWFzb25ZZWFyVGV4dCArICdcIiBkYXRhLXRlYW09XCInICsgdGVhbUFiYnJldmlhdGlvbiArICdcIiBjbGFzcz1cInNlZ21lbnQtaW5uZXIgJyArIHRlYW1BYmJyZXZpYXRpb24gKyAnLWJnXCI+PHA+JyArIHRpdGxlICsgJzwvcD48L2Rpdj4nO1xuICAgICAgICB9XG4gICAgICAgIHRpbWVsaW5lSFRNTCArPSAnPGRpdiBjbGFzcz1cInNlZ21lbnRcIj4nICsgc2VnbWVudElubmVyICsgJzwvZGl2Pic7XG4gICAgICAgIHNlYXNvblllYXJIVE1MICs9ICc8ZGl2IGNsYXNzPVwic2VnbWVudFwiPjxwPicgKyBzZWFzb25ZZWFyVGV4dCArICc8L3A+PC9kaXY+JztcbiAgICB9XG4gICAgJChcIi50aW1lbGluZS13cmFwXCIpLmh0bWwoJzxkaXYgY2xhc3M9XCJ0aW1lbGluZSBhcHBlbmRlZFwiPicgKyB0aW1lbGluZUhUTUwgKyAnPC9kaXY+PGRpdiBjbGFzcz1cInNlYXNvbi15ZWFyIGFwcGVuZGVkXCI+JyArIHNlYXNvblllYXJIVE1MICsgJzwvZGl2PicpO1xufVxuXG5mdW5jdGlvbiBjcmVhdGVJbmRleChrZXlzLCBhcnJheSkge1xuICAgIHZhciBuZXdBcnIgPSBrZXlzLm1hcChpdGVtID0+IGFycmF5LmluZGV4T2YoaXRlbSkpO1xuICAgIHJldHVybiBuZXdBcnI7XG59XG5cbmZ1bmN0aW9uIHJvdW5kKG51bWJlcikge1xuICAgIGlmICh0eXBlb2YgbnVtYmVyICE9PSBcIm51bWJlclwiIHx8IG51bWJlciA9PSB1bmRlZmluZWQpIHtcbiAgICAgICAgcmV0dXJuIG51bWJlcjtcbiAgICB9IGVsc2Uge1xuICAgICAgICByZXR1cm4gbnVtYmVyLnRvRml4ZWQoMSk7XG4gICAgfVxufVxuLyo9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG49ICAgICAgICAgICAgSU5JVElBTElaRSAgICAgICAgICAgID1cbj09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT0qL1xuZnVuY3Rpb24gaW5pdCgpIHtcbiAgICBpZiAoIWdhbWVTdGFydGVkKSB7XG4gICAgICAgICQuYWpheCh7XG4gICAgICAgICAgICB1cmw6ICdodHRwOi8vbG9jYWxob3N0Ojg4ODgvZGF0YS9tb2JpbGUtc3RhdHMtZmVlZC90b2RheXNfc2NvcmVzLmpzb24nLFxuICAgICAgICAgICAgYXN5bmM6IGZhbHNlLFxuICAgICAgICAgICAgc3VjY2VzczogZnVuY3Rpb24odG9kYXlzU2NvcmVzRGF0YSkge1xuICAgICAgICAgICAgICAgIHZhciBnaWQgPSAnJztcbiAgICAgICAgICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IHRvZGF5c1Njb3Jlc0RhdGEuZ3MuZy5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgICAgICAgICBpZiAodG9kYXlzU2NvcmVzRGF0YS5ncy5nW2ldLmgudGEgPT0gJ09STCcpIHsgLy8gQ0hBTkdFIFRISVMgVE8gJ0JPUycgV0hFTiBUSEUgVElNRSBDT01FU1xuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHRvZGF5c1Njb3Jlc0RhdGEuZ3MuZ1tpXSAhPT0gMSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGdhbWVTdGFydGVkID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgfVxufTtcbi8qPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG49ICAgICAgICAgICAgTE9BRCBST1NURVIgSU5GTyAoYnVpbGQgcm9zdGVyT2JqKSAgICAgICAgICAgICAgPVxuPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09Ki9cblxuZnVuY3Rpb24gbG9hZFJvc3RlckRhdGEoYXdheVRlYW0pIHtcbiAgICB2YXIgcm9zdGVyID0gJyc7XG4gICAgJC5hamF4KHtcbiAgICAgICAgdXJsOiAnaHR0cDovL2xvY2FsaG9zdDo4ODg4L2RhdGEvbW9iaWxlLXN0YXRzLWZlZWQvY2VsdGljc19yb3N0ZXIuanNvbicsXG4gICAgICAgIGFzeW5jOiBmYWxzZSxcbiAgICAgICAgc3VjY2VzczogZnVuY3Rpb24oZGF0YSkge1xuICAgICAgICAgICAgcm9zdGVyID0gZGF0YTtcbiAgICAgICAgICAgIGZvciAodmFyIHByb3BlcnR5IGluIHJvc3Rlci50KSB7XG4gICAgICAgICAgICAgICAgaWYgKHByb3BlcnR5ICE9PSAncGwnKSB7XG4gICAgICAgICAgICAgICAgICAgIHJvc3Rlck9iai5jZWx0aWNzW3Byb3BlcnR5XSA9IHJvc3Rlci50W3Byb3BlcnR5XTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH0sXG4gICAgICAgIGVycm9yOiBmdW5jdGlvbigpIHt9XG4gICAgfSk7XG4gICAgdmFyIGF3YXlSb3N0ZXIgPSAnJztcbiAgICAkLmFqYXgoe1xuICAgICAgICB1cmw6ICdodHRwOi8vbG9jYWxob3N0Ojg4ODgvZGF0YS9tb2JpbGUtc3RhdHMtZmVlZC9hd2F5X3Jvc3Rlci5qc29uJyxcbiAgICAgICAgYXN5bmM6IGZhbHNlLFxuICAgICAgICBzdWNjZXNzOiBmdW5jdGlvbihkYXRhKSB7XG4gICAgICAgICAgICBhd2F5Um9zdGVyID0gZGF0YTtcbiAgICAgICAgICAgIGZvciAodmFyIHByb3BlcnR5IGluIGF3YXlSb3N0ZXIudCkge1xuICAgICAgICAgICAgICAgIGlmIChwcm9wZXJ0eSAhPT0gJ3BsJykge1xuICAgICAgICAgICAgICAgICAgICByb3N0ZXJPYmouYXdheVtwcm9wZXJ0eV0gPSBhd2F5Um9zdGVyLnRbcHJvcGVydHldO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfSxcbiAgICAgICAgZXJyb3I6IGZ1bmN0aW9uKCkge31cbiAgICB9KTtcbiAgICB2YXIgYmlvRGF0YSA9ICcnO1xuICAgICQuYWpheCh7XG4gICAgICAgIHVybDogJ2h0dHA6Ly9sb2NhbGhvc3Q6ODg4OC9kYXRhL2Jpby1kYXRhLmpzb24nLFxuICAgICAgICBhc3luYzogZmFsc2UsXG4gICAgICAgIHN1Y2Nlc3M6IGZ1bmN0aW9uKGRhdGEpIHtcbiAgICAgICAgICAgIGJpb0RhdGEgPSBkYXRhO1xuICAgICAgICB9LFxuICAgICAgICBlcnJvcjogZnVuY3Rpb24oKSB7fVxuICAgIH0pO1xuICAgIGZvciAodmFyIGkgPSAwOyBpIDwgcm9zdGVyLnQucGwubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgdmFyIHBpZCA9IHJvc3Rlci50LnBsW2ldLnBpZDtcbiAgICAgICAgcm9zdGVyT2JqLmNlbHRpY3Mucm9zdGVyW3BpZF0gPSByb3N0ZXIudC5wbFtpXTtcbiAgICAgICAgZm9yICh2YXIgcHJvcGVydHkgaW4gYmlvRGF0YVtwaWRdKSB7XG4gICAgICAgICAgICByb3N0ZXJPYmouY2VsdGljcy5yb3N0ZXJbcGlkXS5iaW8gPSBiaW9EYXRhW3BpZF07XG4gICAgICAgIH07XG4gICAgICAgICQuYWpheCh7XG4gICAgICAgICAgICB1cmw6ICdodHRwOi8vbG9jYWxob3N0Ojg4ODgvZGF0YS9tb2JpbGUtc3RhdHMtZmVlZC9wbGF5ZXJjYXJkcy9wbGF5ZXJjYXJkLScgKyBwaWQgKyAnLmpzb24nLFxuICAgICAgICAgICAgYXN5bmM6IGZhbHNlLFxuICAgICAgICAgICAgc3VjY2VzczogZnVuY3Rpb24oZGF0YSkge1xuICAgICAgICAgICAgICAgIHJvc3Rlck9iai5jZWx0aWNzLnJvc3RlcltwaWRdLnN0YXRzID0gZGF0YS5wbC5jYTtcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBlcnJvcjogZnVuY3Rpb24oKSB7fVxuICAgICAgICB9KTtcbiAgICB9XG4gICAgZm9yICh2YXIgaSA9IDA7IGkgPCBhd2F5Um9zdGVyLnQucGwubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgdmFyIHBpZCA9IGF3YXlSb3N0ZXIudC5wbFtpXS5waWQ7XG4gICAgICAgIHJvc3Rlck9iai5hd2F5LnJvc3RlcltwaWRdID0gYXdheVJvc3Rlci50LnBsW2ldO1xuICAgICAgICAkLmFqYXgoe1xuICAgICAgICAgICAgdXJsOiAnaHR0cDovL2xvY2FsaG9zdDo4ODg4L2RhdGEvbW9iaWxlLXN0YXRzLWZlZWQvcGxheWVyY2FyZHMvcGxheWVyY2FyZC0yMDIzMzAuanNvbicsIC8vIENIQU5HRSBQSURcbiAgICAgICAgICAgIGFzeW5jOiBmYWxzZSxcbiAgICAgICAgICAgIHN1Y2Nlc3M6IGZ1bmN0aW9uKGRhdGEpIHtcbiAgICAgICAgICAgICAgICByb3N0ZXJPYmouYXdheS5yb3N0ZXJbcGlkXS5zdGF0cyA9IGRhdGEucGwuY2E7XG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgZXJyb3I6IGZ1bmN0aW9uKCkge31cbiAgICAgICAgfSk7XG4gICAgfVxuICAgIGZvciAodmFyIHRlYW0gaW4gcm9zdGVyT2JqKSB7XG4gICAgICAgIGZvciAodmFyIHBsYXllciBpbiByb3N0ZXJPYmpbdGVhbV0ucm9zdGVyKSB7XG4gICAgICAgICAgICB2YXIgcHRMZWFkZXJzID0gcm9zdGVyT2JqW3RlYW1dLmxlYWRlcnMucHRzO1xuICAgICAgICAgICAgdmFyIGFzdExlYWRlcnMgPSByb3N0ZXJPYmpbdGVhbV0ubGVhZGVycy5hc3Q7XG4gICAgICAgICAgICB2YXIgcmViTGVhZGVycyA9IHJvc3Rlck9ialt0ZWFtXS5sZWFkZXJzLnJlYjtcbiAgICAgICAgICAgIGZvciAodmFyIHN0YXQgaW4gcm9zdGVyT2JqW3RlYW1dLmxlYWRlcnMpIHtcbiAgICAgICAgICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IDM7IGkrKykge1xuICAgICAgICAgICAgICAgICAgICBpZiAocm9zdGVyT2JqW3RlYW1dLmxlYWRlcnNbc3RhdF1baV1bMl0gPT0gJy0tJyAmJiByb3N0ZXJPYmpbdGVhbV0ucm9zdGVyW3BsYXllcl0uc3RhdHNbc3RhdF0gPiAwKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICByb3N0ZXJPYmpbdGVhbV0ubGVhZGVyc1tzdGF0XVtpXVswXSA9IHJvc3Rlck9ialt0ZWFtXS5yb3N0ZXJbcGxheWVyXS5mbi50b1VwcGVyQ2FzZSgpO1xuICAgICAgICAgICAgICAgICAgICAgICAgcm9zdGVyT2JqW3RlYW1dLmxlYWRlcnNbc3RhdF1baV1bMV0gPSByb3N0ZXJPYmpbdGVhbV0ucm9zdGVyW3BsYXllcl0ubG4udG9VcHBlckNhc2UoKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJvc3Rlck9ialt0ZWFtXS5sZWFkZXJzW3N0YXRdW2ldWzJdID0gcm9zdGVyT2JqW3RlYW1dLnJvc3RlcltwbGF5ZXJdLnN0YXRzW3N0YXRdO1xuICAgICAgICAgICAgICAgICAgICAgICAgcm9zdGVyT2JqW3RlYW1dLmxlYWRlcnNbc3RhdF1baV1bM10gPSByb3N0ZXJPYmpbdGVhbV0ucm9zdGVyW3BsYXllcl0ucGlkO1xuICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgICAgIH0gZWxzZSBpZiAocm9zdGVyT2JqW3RlYW1dLnJvc3RlcltwbGF5ZXJdLnN0YXRzW3N0YXRdID4gcm9zdGVyT2JqW3RlYW1dLmxlYWRlcnNbc3RhdF1baV1bMl0gJiYgcm9zdGVyT2JqW3RlYW1dLnJvc3RlcltwbGF5ZXJdLnN0YXRzW3N0YXRdID4gMCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgcm9zdGVyT2JqW3RlYW1dLmxlYWRlcnNbc3RhdF1baV1bMF0gPSByb3N0ZXJPYmpbdGVhbV0ucm9zdGVyW3BsYXllcl0uZm4udG9VcHBlckNhc2UoKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJvc3Rlck9ialt0ZWFtXS5sZWFkZXJzW3N0YXRdW2ldWzFdID0gcm9zdGVyT2JqW3RlYW1dLnJvc3RlcltwbGF5ZXJdLmxuLnRvVXBwZXJDYXNlKCk7XG4gICAgICAgICAgICAgICAgICAgICAgICByb3N0ZXJPYmpbdGVhbV0ubGVhZGVyc1tzdGF0XVtpXVsyXSA9IHJvc3Rlck9ialt0ZWFtXS5yb3N0ZXJbcGxheWVyXS5zdGF0c1tzdGF0XTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJvc3Rlck9ialt0ZWFtXS5sZWFkZXJzW3N0YXRdW2ldWzNdID0gcm9zdGVyT2JqW3RlYW1dLnJvc3RlcltwbGF5ZXJdLnBpZDtcbiAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cbiAgICBjb25zb2xlLmxvZyhyb3N0ZXJPYmopO1xufTtcblxuZnVuY3Rpb24gc3RhdHNOb3RBdmFpbGFibGUocGlkKSB7XG4gICAgcm9zdGVyT2JqW3BpZF0uc3RhdHMgPSB7fTtcbiAgICByb3N0ZXJPYmpbcGlkXS5zdGF0cy5zYSA9IFt7fV07XG4gICAgcm9zdGVyT2JqW3BpZF0uc3RhdHMuaGFzU3RhdHMgPSBmYWxzZTtcbiAgICB2YXIgY2FJbmRleCA9IFsnZ3AnLCAnZ3MnLCAnbWluJywgJ2ZncCcsICd0cHAnLCAnZnRwJywgJ29yZWInLCAnZHJlYicsICdyZWInLCAnYXN0JywgJ3N0bCcsICdibGsnLCAndG92JywgJ3BmJywgJ3B0cycsICdub3N0YXRzJ107XG4gICAgdmFyIHNhSW5kZXggPSBbJ3RpZCcsICd2YWwnLCAnZ3AnLCAnZ3MnLCAnbWluJywgJ2ZncCcsICd0cHAnLCAnZnRwJywgJ29yZWInLCAnZHJlYicsICdyZWInLCAnYXN0JywgJ3N0bCcsICdibGsnLCAndG92JywgJ3BmJywgJ3B0cycsICdzcGwnLCAndGEnLCAndG4nLCAndGMnXTtcbiAgICBmb3IgKHZhciBpID0gMDsgaSA8IHNhSW5kZXgubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgcm9zdGVyT2JqW3BpZF0uc3RhdHMuc2FbMF1bc2FJbmRleFtpXV0gPSBcIk4vQVwiO1xuICAgICAgICBpZiAoaSA9PT0gMSkge1xuICAgICAgICAgICAgcm9zdGVyT2JqW3BpZF0uc3RhdHMuc2FbMF1bc2FJbmRleFtpXV0gPSBwbGF5ZXJDYXJkWWVhci50b1N0cmluZygpLnN1YnN0cigyLCAyKSArIFwiLVwiICsgKHBsYXllckNhcmRZZWFyICsgMSkudG9TdHJpbmcoKS5zdWJzdHIoMiwgMik7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKGkgPT09IDE3KSB7XG4gICAgICAgICAgICByb3N0ZXJPYmpbcGlkXS5zdGF0cy5zYVswXVtzYUluZGV4W2ldXSA9IFtdO1xuICAgICAgICB9XG4gICAgICAgIGlmIChpID09PSAxOCkge1xuICAgICAgICAgICAgcm9zdGVyT2JqW3BpZF0uc3RhdHMuc2FbMF1bc2FJbmRleFtpXV0gPSAnQk9TJztcbiAgICAgICAgfVxuICAgIH1cbiAgICBmb3IgKHZhciBpID0gMDsgaSA8IGNhSW5kZXgubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgcm9zdGVyT2JqW3BpZF0uc3RhdHNbY2FJbmRleFtpXV0gPSBcIk4vQVwiO1xuICAgICAgICBpZiAoaSA9PT0gMTUpIHtcbiAgICAgICAgICAgIHJvc3Rlck9ialtwaWRdLnN0YXRzW2NhSW5kZXhbaV1dID0gdHJ1ZTtcbiAgICAgICAgfVxuICAgIH1cbn07XG5cbmZ1bmN0aW9uIGxvYWRHYW1lRGV0YWlsKGdpZCkge307XG5cbmZ1bmN0aW9uIGxvYWRBd2F5VGVhbURhdGEoKSB7fVxuLyo9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG49ICAgICAgICAgICAgUklHSFQgV1JBUCAgICAgICAgICAgID1cbj09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT0qL1xuXG5cbmZ1bmN0aW9uIHBsYXllclNwb3RsaWdodChyb3N0ZXJPYmosIHBsYXllclNwb3RsaWdodENvdW50ZXIpIHtcbiAgICAvKiAxIC0gV0hJVEUgTElORSBIT1JJWlRPTkFMICovXG4gICAgc2V0VGltZW91dChmdW5jdGlvbigpIHtcbiAgICAgICAgJCgnLndoaXRlLWxpbmUuaG9yaXpvbnRhbCcpLmFkZENsYXNzKCd0cmFuc2l0aW9uLTEnKTtcbiAgICB9LCA1MDApO1xuICAgIHNldFRpbWVvdXQoZnVuY3Rpb24oKSB7XG4gICAgICAgICQoJy5zb2NpYWwtdG9wIC53aGl0ZS1saW5lLnZlcnRpY2FsOm50aC1jaGlsZChvZGQpJykuYWRkQ2xhc3MoJ3RyYW5zaXRpb24tMScpO1xuICAgICAgICAkKCcuc29jaWFsLWJvdHRvbSAud2hpdGUtbGluZS52ZXJ0aWNhbDpudGgtY2hpbGQoZXZlbiknKS5hZGRDbGFzcygndHJhbnNpdGlvbi0xJyk7XG4gICAgfSwgODAwKTtcbiAgICAvKiAyYiAtIFdISVRFIExJTkUgVkVSVElDQUwgKi9cbiAgICBzZXRUaW1lb3V0KGZ1bmN0aW9uKCkge1xuICAgICAgICAkKCcuc29jaWFsLXRvcCAud2hpdGUtbGluZS52ZXJ0aWNhbDpudGgtY2hpbGQoZXZlbiknKS5hZGRDbGFzcygndHJhbnNpdGlvbi0xJyk7XG4gICAgICAgICQoJy5zb2NpYWwtYm90dG9tIC53aGl0ZS1saW5lLnZlcnRpY2FsOm50aC1jaGlsZChvZGQpJykuYWRkQ2xhc3MoJ3RyYW5zaXRpb24tMScpO1xuICAgIH0sIDEwMDApO1xuICAgIC8qIDMgLSBHRU5FUkFURSBBTkQgUkVWRUFMIFBMQVlFUiBCT1hFUyAqL1xuICAgIHNldFRpbWVvdXQoZnVuY3Rpb24oKSB7XG4gICAgICAgICQoJy5zb2NpYWwtdG9wLCAuc29jaWFsLWJvdHRvbScpLmFkZENsYXNzKCd0cmFuc2l0aW9uLTEnKTtcbiAgICAgICAgJCgnLnBsYXllci1ib3gtd3JhcCcpLmFkZENsYXNzKCd0cmFuc2l0aW9uLTEnKTtcbiAgICB9LCAxMjAwKTtcbiAgICAvKiA0IC0gQVBQRU5EIEhFQURTSE9UUyAqL1xuICAgIHNldFRpbWVvdXQoZnVuY3Rpb24oKSB7XG4gICAgICAgICQoJy5wbGF5ZXItYm94LXdyYXAnKS5hZGRDbGFzcygndHJhbnNpdGlvbi0yJyk7XG4gICAgICAgICQoJy5wbGF5ZXItYm94JykuYWRkQ2xhc3MoJ3RyYW5zaXRpb24tMScpO1xuICAgICAgICB2YXIgZGVsYXkgPSAwO1xuICAgICAgICB2YXIgZm9yaW5Db3VudGVyID0gMDtcbiAgICAgICAgZm9yICh2YXIgcGxheWVyIGluIHJvc3Rlck9iai5jZWx0aWNzLnJvc3Rlcikge1xuICAgICAgICAgICAgY29uc29sZS5sb2cocGxheWVyKTtcbiAgICAgICAgICAgIHZhciBoZWFkc2hvdCA9ICdodHRwczovL2FrLXN0YXRpYy5jbXMubmJhLmNvbS93cC1jb250ZW50L3VwbG9hZHMvaGVhZHNob3RzL25iYS9sYXRlc3QvMTA0MHg3NjAvJyArIHJvc3Rlck9iai5jZWx0aWNzLnJvc3RlcltwbGF5ZXJdLnBpZCArICcucG5nJztcbiAgICAgICAgICAgICQoJy5wbGF5ZXItYm94Om50aC1jaGlsZCgnICsgKGZvcmluQ291bnRlciArIDEpICsgJyknKS5hcHBlbmQoJzxpbWcgY2xhc3M9XCJhcHBlbmRlZCBoZWFkc2hvdFwiIHNyYz1cIicgKyBoZWFkc2hvdCArICdcIi8+Jyk7XG4gICAgICAgICAgICAkKCcucGxheWVyLWJveDpudGgtY2hpbGQoJyArIChmb3JpbkNvdW50ZXIgKyAxKSArICcpJykuYXR0cignZGF0YS1waWQnLCByb3N0ZXJPYmouY2VsdGljcy5yb3N0ZXJbcGxheWVyXS5waWQpO1xuICAgICAgICAgICAgJCgnLnBsYXllci1ib3ggaW1nJykub24oXCJlcnJvclwiLCBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgICAgICAkKHRoaXMpLmF0dHIoJ3NyYycsICdodHRwczovL2kuY2RuLnR1cm5lci5jb20vbmJhL25iYS8uZWxlbWVudC9tZWRpYS8yLjAvdGVhbXNpdGVzL2NlbHRpY3MvbWVkaWEvZ2VuZXJpYy1wbGF5ZXItbGlnaHRfNjAweDQzOC5wbmcnKTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgJCgnLnBsYXllci1ib3g6bnRoLWNoaWxkKCcgKyAoZm9yaW5Db3VudGVyICsgMSkgKyAnKSBpbWcnKS5kZWxheShkZWxheSkuZmFkZVRvKDMwMCwgMSk7XG4gICAgICAgICAgICBkZWxheSArPSAzMDtcbiAgICAgICAgICAgIGZvcmluQ291bnRlcisrO1xuICAgICAgICB9XG4gICAgfSwgMzAwMCk7XG4gICAgLyogNSAtIFBMQVlFUiBTRUxFQ1QgKi9cbiAgICB2YXIgc2VsZWN0ZWRQbGF5ZXIgPSAnJztcbiAgICBzZXRUaW1lb3V0KGZ1bmN0aW9uKCkge1xuICAgICAgICAkKCcucGxheWVyLWJveCcpLmFkZENsYXNzKCd0cmFuc2l0aW9uLTInKTtcbiAgICAgICAgJCgnLnBsYXllci1ib3g6bnRoLWNoaWxkKCcgKyAocGxheWVyU3BvdGxpZ2h0Q291bnRlciArIDEpICsgJyknKS5hZGRDbGFzcygnc2VsZWN0ZWQnKTtcbiAgICAgICAgc2VsZWN0ZWRQbGF5ZXIgPSAkKCcucGxheWVyLWJveDpudGgtY2hpbGQoJyArIChwbGF5ZXJTcG90bGlnaHRDb3VudGVyICsgMSkgKyAnKScpLmF0dHIoJ2RhdGEtcGlkJyk7XG4gICAgICAgIGNvbnNvbGUubG9nKHNlbGVjdGVkUGxheWVyKTtcbiAgICAgICAgJCgnLnBsYXllci1ib3gnKS5ub3QoJy5yZXBsYWNlbWVudC5zZWxlY3RlZCcpLmRlbGF5KDUwMCkuYWRkQ2xhc3MoJ3RyYW5zaXRpb24tNCcpO1xuICAgIH0sIDQwMDApO1xuICAgIC8qIDYgLSBQTEFZRVIgQk9YIEVYUEFORCAqL1xuICAgIHNldFRpbWVvdXQoZnVuY3Rpb24oKSB7XG4gICAgICAgICQoJy5ibG9jay13cmFwLnNvY2lhbCcpLmFkZENsYXNzKCd0cmFuc2l0aW9uLTMnKTtcbiAgICAgICAgJCgnLnBsYXllci1ib3gucmVwbGFjZW1lbnQuc2VsZWN0ZWQnKS5hZGRDbGFzcygndHJhbnNpdGlvbi0zJyk7XG4gICAgfSwgNTAwMCk7XG4gICAgLyogNyAtIFNQT1RMSUdIVCBIVE1MICovXG4gICAgc2V0VGltZW91dChmdW5jdGlvbigpIHtcbiAgICAgICAgZ2VuZXJhdGVUaW1lbGluZShzZWxlY3RlZFBsYXllcik7XG4gICAgICAgICQoJy5wbGF5ZXItYm94LnJlcGxhY2VtZW50LnNlbGVjdGVkJykuY2xvbmUoKS5hcHBlbmRUbygnLmJsb2NrLXdyYXAucGxheWVyLXNwb3RsaWdodCAudG9wLXdyYXAnKTtcbiAgICAgICAgJCgnLnBsYXllci1zcG90bGlnaHQgLnNlbGVjdGVkJykuYWRkQ2xhc3MoJy5hcHBlbmRlZCcpO1xuICAgICAgICAkKCcuYmxvY2std3JhcC5wbGF5ZXItc3BvdGxpZ2h0JykuYWRkQ2xhc3MoJ3RyYW5zaXRpb24tMScpO1xuICAgICAgICAkKCcuYmxvY2std3JhcC5zb2NpYWwnKS5hZGRDbGFzcygndHJhbnNpdGlvbi0xJyk7XG4gICAgICAgIHZhciBzdGF0cyA9IHJvc3Rlck9iai5jZWx0aWNzLnJvc3RlcltzZWxlY3RlZFBsYXllcl0uc3RhdHM7XG4gICAgICAgICQoJy5wbGF5ZXItc3BvdGxpZ2h0IC50b3Atd3JhcCAucGxheWVyLXRvcCcpLmFwcGVuZCgnPGltZyBjbGFzcz1cInNpbG8gYXBwZW5kZWRcIiBzcmM9XCJodHRwOi8vaW8uY25uLm5ldC9uYmEvbmJhLy5lbGVtZW50L21lZGlhLzIuMC90ZWFtc2l0ZXMvY2VsdGljcy9tZWRpYS9zaWxvLTQ2Nng1OTEtJyArIHJvc3Rlck9iai5jZWx0aWNzLnJvc3RlcltzZWxlY3RlZFBsYXllcl0ucGlkICsgJy5wbmdcIiAvPjxkaXYgY2xhc3M9XCJ0b3AgYXBwZW5kZWRcIj48ZGl2IGNsYXNzPVwicGxheWVyLW5hbWUtd3JhcFwiPjxwIGNsYXNzPVwicGxheWVyLW5hbWVcIj48c3Bhbj4nICsgcm9zdGVyT2JqLmNlbHRpY3Mucm9zdGVyW3NlbGVjdGVkUGxheWVyXS5mbi50b1VwcGVyQ2FzZSgpICsgJzwvc3Bhbj4gPGJyPiAnICsgcm9zdGVyT2JqLmNlbHRpY3Mucm9zdGVyW3NlbGVjdGVkUGxheWVyXS5sbi50b1VwcGVyQ2FzZSgpICsgJzwvcD48L2Rpdj48cCBjbGFzcz1cInBsYXllci1udW1iZXJcIj4nICsgcm9zdGVyT2JqLmNlbHRpY3Mucm9zdGVyW3NlbGVjdGVkUGxheWVyXS5udW0gKyAnPC9icj48c3Bhbj4nICsgcm9zdGVyT2JqLmNlbHRpY3Mucm9zdGVyW3NlbGVjdGVkUGxheWVyXS5wb3MgKyAnPC9zcGFuPjwvcD48L2Rpdj48ZGl2IGNsYXNzPVwibWlkZGxlIGFwcGVuZGVkXCI+PHVsIGNsYXNzPVwiaW5mbyBjbGVhcmZpeFwiPjxsaT48cD5BR0U8c3BhbiBjbGFzcz1cInNtLWhpZGVcIj46Jm5ic3A7PC9zcGFuPiA8L2JyPjxzcGFuIGNsYXNzPVwiaW5mby12YWx1ZVwiPicgKyBwbGF5ZXJBZ2Uocm9zdGVyT2JqLmNlbHRpY3Mucm9zdGVyW3NlbGVjdGVkUGxheWVyXS5kb2IpICsgJzwvc3Bhbj48L3A+PC9saT48bGk+PHA+SFQ8c3BhbiBjbGFzcz1cInNtLWhpZGVcIj46Jm5ic3A7PC9zcGFuPiA8L2JyPjxzcGFuIGNsYXNzPVwiaW5mby12YWx1ZVwiPicgKyByb3N0ZXJPYmouY2VsdGljcy5yb3N0ZXJbc2VsZWN0ZWRQbGF5ZXJdLmh0ICsgJzwvc3Bhbj48L3A+PC9saT48bGk+PHA+V1Q8c3BhbiBjbGFzcz1cInNtLWhpZGVcIj46Jm5ic3A7PC9zcGFuPiA8L2JyPjxzcGFuIGNsYXNzPVwiaW5mby12YWx1ZVwiPicgKyByb3N0ZXJPYmouY2VsdGljcy5yb3N0ZXJbc2VsZWN0ZWRQbGF5ZXJdLnd0ICsgJzwvc3Bhbj48L3A+PC9saT48L3VsPjwvZGl2PjxkaXYgY2xhc3M9XCJib3R0b20gZnVsbCBjbGVhcmZpeCBzbS1oaWRlIGFwcGVuZGVkXCI+PHRhYmxlIGNsYXNzPVwiYXZlcmFnZXNcIj48dHIgY2xhc3M9XCJhdmVyYWdlcy1sYWJlbHNcIj48dGQ+PHA+R1A8L3A+PC90ZD48dGQ+PHA+UFBHPC9wPjwvdGQ+PHRkPjxwPlJQRzwvcD48L3RkPjx0ZD48cD5BUEc8L3A+PC90ZD48L3RyPjx0ciBjbGFzcz1cImF2ZXJhZ2VzLXNlYXNvblwiPjx0ZCBjbGFzcz1cImdwXCI+PHA+PC9wPjwvdGQ+PHRkIGNsYXNzPVwicHRzXCI+PHA+PC9wPjwvdGQ+PHRkIGNsYXNzPVwicmViXCI+PHA+PC9wPjwvdGQ+PHRkIGNsYXNzPVwiYXN0XCI+PHA+PC9wPjwvdGQ+PC90cj48L3RhYmxlPjwvZGl2PicpO1xuICAgICAgICAkKFwiLnBsYXllci1zcG90bGlnaHQgLmF2ZXJhZ2VzLXNlYXNvblwiKS5odG1sKCc8dGQgY2xhc3M9XCJhcHBlbmRlZFwiPjxwPicgKyBzdGF0cy5zYVswXS5ncCArICc8L3A+PC90ZD48dGQgY2xhc3M9XCJhcHBlbmRlZFwiPjxwPicgKyBzdGF0cy5zYVswXS5wdHMgKyAnPC9wPjwvdGQ+PHRkIGNsYXNzPVwiYXBwZW5kZWRcIj48cD4nICsgc3RhdHMuc2FbMF0ucmViICsgJzwvcD48L3RkPjx0ZCBjbGFzcz1cImFwcGVuZGVkXCI+PHA+JyArIHN0YXRzLnNhWzBdLmFzdCArICc8L3A+PC90ZD4nKTtcbiAgICAgICAgJCgnLnBsYXllci1zcG90bGlnaHQgLnBsYXllci1uYW1lJykuZmFkZVRvKDIwMCwgMSk7XG4gICAgICAgIHZhciBwbGF5ZXJGYWN0cyA9IHJvc3Rlck9iai5jZWx0aWNzLnJvc3RlcltzZWxlY3RlZFBsYXllcl0uYmlvLnBlcnNvbmFsO1xuICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IDM7IGkrKykge1xuICAgICAgICAgICAgdmFyIGZhY3RJbmRleCA9IE1hdGguZmxvb3IoTWF0aC5yYW5kb20oKSAqIHBsYXllckZhY3RzLmxlbmd0aCk7XG4gICAgICAgICAgICAkKCcucGxheWVyLXNwb3RsaWdodCAuYm90dG9tLXdyYXAnKS5hcHBlbmQoJzxkaXYgY2xhc3M9XCJkeWstYm94IGFwcGVuZGVkXCI+PHA+JyArIHBsYXllckZhY3RzW2ZhY3RJbmRleF0gKyAnPC9wPjwvZGl2PicpO1xuICAgICAgICB9O1xuICAgICAgICAkKCcucGxheWVyLXNwb3RsaWdodCAuYm90dG9tLXdyYXAnKS5hZGRDbGFzcygndHJhbnNpdGlvbi0xJyk7XG4gICAgICAgIHNldFRpbWVvdXQoZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICAkKCcucGxheWVyLXNwb3RsaWdodCAuYm90dG9tLXdyYXAgLmR5ay1ib3g6bnRoLW9mLXR5cGUoMiknKS5hZGRDbGFzcygndHJhbnNpdGlvbi0yJyk7XG4gICAgICAgICAgICAkKCcucGxheWVyLXNwb3RsaWdodCAuYm90dG9tLXdyYXAgLmR5ay1ib3g6bnRoLW9mLXR5cGUoMyknKS5hZGRDbGFzcygndHJhbnNpdGlvbi0xJyk7XG4gICAgICAgIH0sIDEwMDApO1xuICAgICAgICBzZXRUaW1lb3V0KGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgJCgnLnBsYXllci1zcG90bGlnaHQgLmJvdHRvbS13cmFwIC5keWstYm94Om50aC1vZi10eXBlKDMpJykuYWRkQ2xhc3MoJ3RyYW5zaXRpb24tMicpO1xuICAgICAgICAgICAgJCgnLnBsYXllci1zcG90bGlnaHQgLmJvdHRvbS13cmFwIC5keWstYm94Om50aC1vZi10eXBlKDQpJykuYWRkQ2xhc3MoJ3RyYW5zaXRpb24tMScpO1xuICAgICAgICB9LCAxNTAwKTtcbiAgICB9LCA2MDAwKTtcbiAgICAvKiA4IC0gU1BPVExJR0hUIFNMSURFIElOICovXG4gICAgc2V0VGltZW91dChmdW5jdGlvbigpIHtcbiAgICAgICAgJCgnLnBsYXllci1zcG90bGlnaHQgLnBsYXllci10b3AgLnBsYXllci1uYW1lLCAucGxheWVyLXNwb3RsaWdodCAucGxheWVyLW5hbWUtd3JhcCwgLnBsYXllci1zcG90bGlnaHQgLmhlYWRzaG90LCAucGxheWVyLXNwb3RsaWdodCAuaW5mbywgLnBsYXllci1zcG90bGlnaHQgLnNpbG8sIC5wbGF5ZXItc3BvdGxpZ2h0IC5hdmVyYWdlcywgLnBsYXllci1zcG90bGlnaHQgLnBsYXllci1udW1iZXInKS5hZGRDbGFzcygndHJhbnNpdGlvbi0xJyk7XG4gICAgICAgIHNldFRpbWVvdXQoZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICAkKCcuYmxvY2std3JhcC5wbGF5ZXItc3BvdGxpZ2h0IC5wbGF5ZXItYm94JykucmVtb3ZlKCk7XG4gICAgICAgIH0sIDQwMDApO1xuICAgICAgICBpZiAocGxheWVyU3BvdGxpZ2h0Q291bnRlciA8IDE2KSB7XG4gICAgICAgICAgICBwbGF5ZXJTcG90bGlnaHRDb3VudGVyKys7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBwbGF5ZXJTcG90bGlnaHRDb3VudGVyID0gMDtcbiAgICAgICAgfVxuICAgIH0sIDcwMDApO1xuICAgIC8qIDkgLSBTUE9UTElHSFQgU0xJREUgT1VUICovXG4gICAgc2V0VGltZW91dChmdW5jdGlvbigpIHtcbiAgICAgICAgJCgnLnBsYXllci1zcG90bGlnaHQgLmJvdHRvbS13cmFwLCAucGxheWVyLXNwb3RsaWdodCAudG9wLXdyYXAnKS5hZGRDbGFzcygndHJhbnNpdGlvbi0yJyk7XG4gICAgfSwgODAwMCk7XG4gICAgLyogMTAgLSBET05FLiBSRU1PVkUgKi9cbiAgICBzZXRUaW1lb3V0KGZ1bmN0aW9uKCkge1xuICAgICAgICAkKCcgLnBsYXllci1zcG90bGlnaHQgLmFwcGVuZGVkJykucmVtb3ZlKCk7XG4gICAgICAgICQoJyAucGxheWVyLXNwb3RsaWdodCAuc2VsZWN0ZWQnKS5yZW1vdmVDbGFzcygnc2VsZWN0ZWQnKTtcbiAgICAgICAgZm9yICh2YXIgaSA9IDE7IGkgPCAxMDsgaSsrKXtcbiAgICAgICAgICAgICQoJy50cmFuc2l0aW9uLScgKyBpKS5yZW1vdmVDbGFzcygndHJhbnNpdGlvbi0nICsgaSk7XG4gICAgICAgIH1cbiAgICB9LCA5MDAwKTtcbn1cblxuZnVuY3Rpb24gbGVhZGVycyhnaWQsIGdhbWVTdGFydGVkKSB7XG4gICAgJCgnLmxlYWRlcnMnKS5hZGRDbGFzcygnYWN0aXZlJyk7XG4gICAgdmFyIGdhbWVEZXRhaWwgPSAnJztcbiAgICB2YXIgZGV0YWlsQXZhaWxhYmxlID0gZmFsc2U7XG4gICAgZ2FtZVN0YXJ0ZWQgPSB0cnVlOyAvLyBETzogREVMRVRFIFRISVMgV0hFTiBPTkxJTkUuIEpVU1QgRk9SIFRFU1RJTkcgUFVSUE9TRVMgUk5cbiAgICBpZiAoZ2FtZVN0YXJ0ZWQpIHtcbiAgICAgICAgJC5hamF4KHtcbiAgICAgICAgICAgIHVybDogJ2h0dHA6Ly9sb2NhbGhvc3Q6ODg4OC9kYXRhL21vYmlsZS1zdGF0cy1mZWVkL2dhbWVkZXRhaWwuanNvbicsXG4gICAgICAgICAgICBhc3luYzogZmFsc2UsXG4gICAgICAgICAgICBzdWNjZXNzOiBmdW5jdGlvbihkYXRhKSB7XG4gICAgICAgICAgICAgICAgLy8gRE86IFVQREFURSBUSEUgTEVBREVSIE9CSkVDVFNcbiAgICAgICAgICAgICAgICBnYW1lRGV0YWlsID0gZGF0YTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgfVxuICAgIGZvciAodmFyIHRlYW0gaW4gcm9zdGVyT2JqKSB7XG4gICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgMzsgaSsrKSB7XG4gICAgICAgICAgICBmb3IgKHZhciBzdGF0IGluIHJvc3Rlck9ialt0ZWFtXS5sZWFkZXJzKSB7XG4gICAgICAgICAgICAgICAgLy8gTEVBREVSIFNUQVQgVkFMVUVcbiAgICAgICAgICAgICAgICAkKCcubGVhZGVyLXNlY3Rpb246bnRoLW9mLXR5cGUoJyArIChpICsgMikgKyAnKSAuJyArIHN0YXQgKyAnLicgKyB0ZWFtICsgJyAuc3RhdCcpLmh0bWwoJzxzcGFuIGNsYXNzPVwiYXBwZW5kZWQgJyArIHJvc3Rlck9ialt0ZWFtXS50YSArICdcIj4nICsgcm9zdGVyT2JqW3RlYW1dLmxlYWRlcnNbc3RhdF1baV1bMl0gKyAnPC9zcGFuPiAnICsgc3RhdC50b1VwcGVyQ2FzZSgpKTtcbiAgICAgICAgICAgICAgICAvLyBMRUFERVIgTkFNRVxuICAgICAgICAgICAgICAgIGlmIChyb3N0ZXJPYmpbdGVhbV0ubGVhZGVyc1tzdGF0XVtpXVswXS5sZW5ndGggKyByb3N0ZXJPYmpbdGVhbV0ubGVhZGVyc1tzdGF0XVtpXVsxXS5sZW5ndGggPj0gMTUpIHtcbiAgICAgICAgICAgICAgICAgICAgcm9zdGVyT2JqW3RlYW1dLmxlYWRlcnNbc3RhdF1baV1bMF0gPSByb3N0ZXJPYmpbdGVhbV0ubGVhZGVyc1tzdGF0XVtpXVswXS5zdWJzdHIoMCwgMSkgKyAnLic7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICQoJy5sZWFkZXItc2VjdGlvbjpudGgtb2YtdHlwZSgnICsgKGkgKyAyKSArICcpIC4nICsgc3RhdCArICcuJyArIHRlYW0gKyAnIC5uYW1lJykuaHRtbCgnPHNwYW4gY2xhc3M9XCJhcHBlbmRlZFwiPicgKyByb3N0ZXJPYmpbdGVhbV0ubGVhZGVyc1tzdGF0XVtpXVswXSArICc8L3NwYW4+ICcgKyByb3N0ZXJPYmpbdGVhbV0ubGVhZGVyc1tzdGF0XVtpXVsxXSk7XG4gICAgICAgICAgICAgICAgLy8gTEVBREVSIEhFQURTSE9UXG4gICAgICAgICAgICAgICAgJCgnLmxlYWRlci1zZWN0aW9uOm50aC1vZi10eXBlKCcgKyAoaSArIDIpICsgJykgLicgKyBzdGF0ICsgJy4nICsgdGVhbSArICcgLmhlYWRzaG90JykuYXR0cignc3JjJywgJ2h0dHBzOi8vYWstc3RhdGljLmNtcy5uYmEuY29tL3dwLWNvbnRlbnQvdXBsb2Fkcy9oZWFkc2hvdHMvbmJhL2xhdGVzdC8xMDQweDc2MC8nICsgcm9zdGVyT2JqW3RlYW1dLmxlYWRlcnNbc3RhdF1baV1bM10gKyAnLnBuZycpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxuICAgIHNldFRpbWVvdXQoZnVuY3Rpb24oKSB7XG4gICAgICAgICQoJy5sZWFkZXJzLCAubGVhZGVycyAuYmxvY2staW5uZXInKS5hZGRDbGFzcygndHJhbnNpdGlvbi0xJyk7XG4gICAgfSwgMTAwMCk7XG4gICAgc2V0VGltZW91dChmdW5jdGlvbigpIHtcbiAgICAgICAgJCgnLmxlYWRlcnMgLmxlYWRlci1zZWN0aW9uJykuYWRkQ2xhc3MoJ3RyYW5zaXRpb24tMScpO1xuICAgICAgICAkKCcubGVhZGVyLXN1YnNlY3Rpb24uYm90dG9tIHA6bnRoLW9mLXR5cGUoMSknKS5hZGRDbGFzcygndHJhbnNpdGlvbi0xJyk7XG4gICAgICAgICQoJy5sZWFkZXJzIC5sZWFkZXItc2VjdGlvbiAudW5kZXJsaW5lLCAubGVhZGVycyAubGVhZGVyLXN1YnNlY3Rpb24udG9wJykuYWRkQ2xhc3Mocm9zdGVyT2JqLmNlbHRpY3MudGEgKyAnLWJnJyk7XG4gICAgfSwgMjAwMCk7XG4gICAgc2V0VGltZW91dChmdW5jdGlvbigpIHtcbiAgICAgICAgJCgnLmxlYWRlcnMgLmxlYWRlci1zZWN0aW9uJykuYWRkQ2xhc3MoJ3RyYW5zaXRpb24tMicpO1xuICAgICAgICAkKCcubGVhZGVycyAuYmxvY2staW5uZXInKS5hZGRDbGFzcygndHJhbnNpdGlvbi0yJyk7XG4gICAgfSwgMzAwMCk7XG4gICAgdmFyIHRyYW5zaXRpb25Db3VudGVyID0gMTtcbiAgICBzZXRUaW1lb3V0KGZ1bmN0aW9uKCl7XG4gICAgICAgIGZvciAobGV0IGkgPSAxOyBpIDwgNjsgaSsrKSB7XG4gICAgICAgICAgICBzZXRUaW1lb3V0KGZ1bmN0aW9uKG51bWJlclN0cmluZykge1xuICAgICAgICAgICAgICAgICQoJy5sZWFkZXJzIC5sZWFkZXItc2VjdGlvbiAubGVhZGVyLXN0YXQtd3JhcCcpLmFkZENsYXNzKCd0cmFuc2l0aW9uLScgKyBpKTtcbiAgICAgICAgICAgICAgICAkKCcubGVhZGVycyAubGVhZGVyLXNlY3Rpb24gLnVuZGVybGluZSwgLmxlYWRlcnMgLmxlYWRlci1zdWJzZWN0aW9uLnRvcCcpLnJlbW92ZUNsYXNzKHJvc3Rlck9iai5jZWx0aWNzLnRhICsgJy1iZycpO1xuICAgICAgICAgICAgICAgICQoJy5sZWFkZXJzIC5sZWFkZXItc2VjdGlvbiAudW5kZXJsaW5lLCAubGVhZGVycyAubGVhZGVyLXN1YnNlY3Rpb24udG9wJykuYWRkQ2xhc3Mocm9zdGVyT2JqLmF3YXkudGEgKyAnLWJnJyk7XG4gICAgICAgICAgICAgICAgaWYgKHRyYW5zaXRpb25Db3VudGVyICUgMiA9PSAwKSB7XG4gICAgICAgICAgICAgICAgICAgIHNldFRpbWVvdXQoZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAkKCcubGVhZGVycyAubGVhZGVyLXNlY3Rpb24gLnVuZGVybGluZSwgLmxlYWRlcnMgLmxlYWRlci1zdWJzZWN0aW9uLnRvcCcpLnJlbW92ZUNsYXNzKHJvc3Rlck9iai5hd2F5LnRhICsgJy1iZycpO1xuICAgICAgICAgICAgICAgICAgICAgICAgJCgnLmxlYWRlcnMgLmxlYWRlci1zZWN0aW9uIC51bmRlcmxpbmUsIC5sZWFkZXJzIC5sZWFkZXItc3Vic2VjdGlvbi50b3AnKS5hZGRDbGFzcyhyb3N0ZXJPYmouY2VsdGljcy50YSArICctYmcnKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICQoJy5sZWFkZXItc3Vic2VjdGlvbi5ib3R0b20gcCcpLnJlbW92ZUNsYXNzKCd0cmFuc2l0aW9uLTEnKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICQoJy5sZWFkZXJzIC5sZWFkZXItc2VjdGlvbiAudW5kZXJsaW5lJykuYWRkQ2xhc3MoJ3RyYW5zaXRpb24tJyArIChpIC8gMikpO1xuICAgICAgICAgICAgICAgICAgICAgICAgJCgnLmxlYWRlci1zdWJzZWN0aW9uLmJvdHRvbSBwOm50aC1vZi10eXBlKCcgKyAoaSAtIChpIC8gMikgKyAxKSArICcpJykuYWRkQ2xhc3MoJ3RyYW5zaXRpb24tMScpOyAvLyBsb2xcbiAgICAgICAgICAgICAgICAgICAgfSwgMjAwKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgdHJhbnNpdGlvbkNvdW50ZXIrKztcbiAgICAgICAgICAgIH0sIDM1MDAgKiBpKTtcbiAgICAgICAgfVxuICAgIH0sMTAwMCk7XG4gICAgc2V0VGltZW91dChmdW5jdGlvbigpIHtcbiAgICAgICAgJCgnLmxlYWRlcnMgLmxlYWRlci1zZWN0aW9uLCAubGVhZGVycyAubGVhZGVyLXN1YnNlY3Rpb24nKS5hZGRDbGFzcygndHJhbnNpdGlvbi0zJyk7XG4gICAgfSwgMjUwMDApO1xuICAgIHNldFRpbWVvdXQoZnVuY3Rpb24oKSB7XG4gICAgICAgICQoJy5sZWFkZXJzJykuYWRkQ2xhc3MoJ3RyYW5zaXRpb24tMicpO1xuICAgIH0sIDI1MDAwKTtcbiAgICBzZXRUaW1lb3V0KGZ1bmN0aW9uKCkge1xuICAgICAgICAkKCcubGVhZGVycycpLnJlbW92ZUNsYXNzKCdhY3RpdmUnKTtcbiAgICAgICAgJCgnLmxlYWRlcnMgLmFwcGVuZGVkJykucmVtb3ZlKCk7XG4gICAgICAgIGZvciAodmFyIGkgPSAxOyBpIDwgMTA7IGkrKyl7XG4gICAgICAgICAgICAkKCcudHJhbnNpdGlvbi0nICsgaSkucmVtb3ZlQ2xhc3MoJ3RyYW5zaXRpb24tJyArIGkpO1xuICAgICAgICB9XG4gICAgfSwgMzAwMDApO1xufTtcblxuZnVuY3Rpb24gc29jaWFsKCkge1xuICAgICQoJy5zb2NpYWwgLnRleHQtd3JhcCwgLnNvY2lhbCAudW5kZXJsaW5lJykucmVtb3ZlQ2xhc3MoJ3RyYW5zaXRpb24tMScpO1xuICAgICQoJy5zb2NpYWwnKS5hZGRDbGFzcygnYWN0aXZlJyk7XG4gICAgc2V0VGltZW91dChmdW5jdGlvbigpe1xuICAgICAgICAkKCcuc29jaWFsIC50ZXh0LXdyYXAsIC5zb2NpYWwgLnVuZGVybGluZScpLmFkZENsYXNzKCd0cmFuc2l0aW9uLTEnKTtcbiAgICB9LCAyNTAwKTtcbi8qICAgIHNldFRpbWVvdXQoZnVuY3Rpb24oKXtcbiAgICAgICAgJCgnLnNvY2lhbCcpLnJlbW92ZUNsYXNzKCdhY3RpdmUnKTtcbiAgICB9LCAzMDAwKTsqL1xufTtcblxuZnVuY3Rpb24gbW9iaWxlQXBwSW5pdCgpIHtcbiAgICB2YXIgY291bnRlciA9IDE7XG4gICAgc2V0SW50ZXJ2YWwoZnVuY3Rpb24oKSB7XG4gICAgICAgICQoJy5hcHAgLmJvdHRvbS13cmFwIGltZycpLnJlbW92ZUNsYXNzKCdhY3RpdmUnKTtcbiAgICAgICAgJCgnLmFwcCAuZmVhdHVyZS1saXN0IHAnKS5yZW1vdmVDbGFzcygnYWN0aXZlJyk7XG4gICAgICAgICQoJy5hcHAgLmZlYXR1cmUtbGlzdCBwOm50aC1vZi10eXBlKCcgKyBjb3VudGVyICsgJyknKS5hZGRDbGFzcygnYWN0aXZlJyk7XG4gICAgICAgICQoJy5hcHAgLmJvdHRvbS13cmFwIGltZzpudGgtb2YtdHlwZSgnICsgY291bnRlciArICcpJykuYWRkQ2xhc3MoJ2FjdGl2ZScpO1xuICAgICAgICBpZiAoY291bnRlciA9PSA1KSB7XG4gICAgICAgICAgICBjb3VudGVyID0gMTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGNvdW50ZXIrKztcbiAgICAgICAgfVxuICAgIH0sIDIwMDApO1xufTtcblxuZnVuY3Rpb24gbW9iaWxlQXBwKCkge1xuICAgICQoJy5hcHAgLmJsb2NrLWlubmVyJykucmVtb3ZlQ2xhc3MoJ3RyYW5zaXRpb24tMScpO1xuICAgICQoJy5hcHAnKS5hZGRDbGFzcygnYWN0aXZlJyk7XG4gICAgc2V0VGltZW91dChmdW5jdGlvbigpe1xuICAgICAgICAkKCcuYXBwIC5ibG9jay1pbm5lcicpLmFkZENsYXNzKCd0cmFuc2l0aW9uLTEnKTtcbiAgICB9LCAyNTAwKTtcbiAgICBzZXRUaW1lb3V0KGZ1bmN0aW9uKCl7XG4gICAgICAgICQoJy5hcHAnKS5yZW1vdmVDbGFzcygnYWN0aXZlJyk7XG4gICAgfSwgMzAwMCk7XG59O1xuLyo9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbj0gICAgICAgICAgICBMRUZUIFdSQVAgICAgICAgICAgICA9XG49PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT0qL1xuXG5mdW5jdGlvbiBsZWZ0V3JhcCgpIHtcbiAgICBzZXRJbnRlcnZhbChmdW5jdGlvbigpe1xuICAgICAgICBpZiAoJCgnLmxlZnQtd3JhcCAuc3RhbmRpbmdzJykuaGFzQ2xhc3MoJ3RyYW5zaXRpb24tMScpKXtcbiAgICAgICAgICAgICQoJy5sZWZ0LXdyYXAgLnN0YW5kaW5ncycpLnJlbW92ZUNsYXNzKCd0cmFuc2l0aW9uLTEnKTtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICQoJy5sZWZ0LXdyYXAgLnN0YW5kaW5ncycpLmFkZENsYXNzKCd0cmFuc2l0aW9uLTEnKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmICgkKCcubGVmdC13cmFwIC5zY29yZXMtYW5kLWxlYWRlcnMnKS5oYXNDbGFzcygndHJhbnNpdGlvbi0xJykpe1xuICAgICAgICAgICAgJCgnLmxlZnQtd3JhcCAuc2NvcmVzLWFuZC1sZWFkZXJzJykucmVtb3ZlQ2xhc3MoJ3RyYW5zaXRpb24tMScpO1xuICAgICAgICB9XG4gICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgJCgnLmxlZnQtd3JhcCAuc2NvcmVzLWFuZC1sZWFkZXJzJykuYWRkQ2xhc3MoJ3RyYW5zaXRpb24tMScpO1xuICAgICAgICB9XG4gICAgfSwgNDUwMDApO1xufVxuXG5cbmZ1bmN0aW9uIHN0YW5kaW5nc0luaXQoYXdheVRlYW0pIHtcbiAgICAkLmFqYXgoe1xuICAgICAgICB1cmw6ICdodHRwOi8vbG9jYWxob3N0Ojg4ODgvZGF0YS9tb2JpbGUtc3RhdHMtZmVlZC9zdGFuZGluZ3MuanNvbicsXG4gICAgICAgIGFzeW5jOiBmYWxzZSxcbiAgICAgICAgc3VjY2VzczogZnVuY3Rpb24oc3RhbmRpbmdzRGF0YSkge1xuICAgICAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBzdGFuZGluZ3NEYXRhLnN0YS5jby5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgICAgIGZvciAobGV0IHggPSAwOyB4IDwgc3RhbmRpbmdzRGF0YS5zdGEuY29baV0uZGkubGVuZ3RoOyB4KyspIHtcbiAgICAgICAgICAgICAgICAgICAgZm9yIChsZXQgdCA9IDA7IHQgPCBzdGFuZGluZ3NEYXRhLnN0YS5jb1tpXS5kaVt4XS50Lmxlbmd0aDsgdCsrKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICB2YXIgY29uZmVyZW5jZXMgPSBbJy5lYXN0JywgJy53ZXN0J107XG4gICAgICAgICAgICAgICAgICAgICAgICB2YXIgcGxhY2UgPSBzdGFuZGluZ3NEYXRhLnN0YS5jb1tpXS5kaVt4XS50W3RdLnNlZTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHZhciBzZWVkID0gJyc7XG4gICAgICAgICAgICAgICAgICAgICAgICB2YXIgYWN0aXZlU3RhdHVzID0gJyc7XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoc3RhbmRpbmdzRGF0YS5zdGEuY29baV0uZGlbeF0udFt0XS5zZWUgPD0gOCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHNlZWQgPSBzdGFuZGluZ3NEYXRhLnN0YS5jb1tpXS5kaVt4XS50W3RdLnNlZTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChzdGFuZGluZ3NEYXRhLnN0YS5jb1tpXS5kaVt4XS50W3RdLnRhID09ICdCT1MnKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgYWN0aXZlU3RhdHVzID0gJ2FjdGl2ZSc7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoc3RhbmRpbmdzRGF0YS5zdGEuY29baV0uZGlbeF0udFt0XS50YSA9PSBhd2F5VGVhbSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGFjdGl2ZVN0YXR1cyA9ICdhY3RpdmUtYXdheSc7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICB2YXIgcm93SFRNTCA9ICc8ZGl2IGNsYXNzPVwicGxhY2VcIj4nICsgc2VlZCArICc8L2Rpdj48ZGl2IGNsYXNzPVwibG9nby13cmFwXCI+PGltZyBjbGFzcz1cImxvZ29cIiBzcmM9aHR0cDovL2kuY2RuLnR1cm5lci5jb20vbmJhL25iYS9hc3NldHMvbG9nb3MvdGVhbXMvcHJpbWFyeS93ZWIvJyArIHN0YW5kaW5nc0RhdGEuc3RhLmNvW2ldLmRpW3hdLnRbdF0udGEgKyAnLnN2Zz48L2Rpdj48ZGl2IGNsYXNzPVwidGVhbSArICcgKyBzdGFuZGluZ3NEYXRhLnN0YS5jb1tpXS5kaVt4XS50W3RdLnRhICsgJ1wiPicgKyBzdGFuZGluZ3NEYXRhLnN0YS5jb1tpXS5kaVt4XS50W3RdLnRhICsgJzwvZGl2PjxkaXYgY2xhc3M9XCJ3aW5zXCI+JyArIHN0YW5kaW5nc0RhdGEuc3RhLmNvW2ldLmRpW3hdLnRbdF0udyArICc8L2Rpdj48ZGl2IGNsYXNzPVwibG9zc2VzXCI+JyArIHN0YW5kaW5nc0RhdGEuc3RhLmNvW2ldLmRpW3hdLnRbdF0ubCArICc8L2Rpdj48ZGl2IGNsYXNzPVwiZ2FtZXMtYmVoaW5kXCI+JyArIHN0YW5kaW5nc0RhdGEuc3RhLmNvW2ldLmRpW3hdLnRbdF0uZ2IgKyAnPC9kaXY+JztcbiAgICAgICAgICAgICAgICAgICAgICAgICQoY29uZmVyZW5jZXNbaV0gKyAnID4gZGl2Om50aC1jaGlsZCgnICsgKHBsYWNlICsgMSkgKyAnKScpLmh0bWwocm93SFRNTCk7XG4gICAgICAgICAgICAgICAgICAgICAgICAkKGNvbmZlcmVuY2VzW2ldICsgJyA+IGRpdjpudGgtY2hpbGQoJyArIChwbGFjZSArIDEpICsgJyknKS5hZGRDbGFzcyhhY3RpdmVTdGF0dXMpO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfSk7XG59O1xuXG5mdW5jdGlvbiBzY29yZXNJbml0KHRvZGF5c1Njb3Jlc0RhdGEpIHtcbiAgICB2YXIgbGl2ZVNjb3JlcyA9IHRvZGF5c1Njb3Jlc0RhdGEuZ3MuZztcbiAgICBpZiAobGl2ZVNjb3Jlcy5sZW5ndGggIT0gMCkge1xuICAgICAgICB2YXIgc2Vhc29uVHlwZSA9ICcnO1xuICAgICAgICBpZiAobGl2ZVNjb3Jlc1swXS5naWQuc3Vic3RyKDAsIDMpID09ICcwMDEnKSB7XG4gICAgICAgICAgICBzZWFzb25UeXBlID0gJ3ByZSc7XG4gICAgICAgIH0gZWxzZSBpZiAobGl2ZVNjb3Jlc1swXS5naWQuc3Vic3RyKDAsIDMpID09ICcwMDQnKSB7XG4gICAgICAgICAgICBzZWFzb25UeXBlID0gJ3Bvc3QnO1xuICAgICAgICB9XG4gICAgICAgIGlmIChsaXZlU2NvcmVzLmxlbmd0aCA+IDEgfHwgKGxpdmVTY29yZXMubGVuZ3RoID09IDEgJiYgbGl2ZVNjb3Jlc1swXS5oLnRhICE9ICdCT1MnKSkge1xuICAgICAgICAgICAgdmFyIHN0YXR1c0NvZGVzID0gWycxc3QgUXRyJywgJzJuZCBRdHInLCAnM3JkIFF0cicsICc0dGggUXRyJywgJzFzdCBPVCcsICcybmQgT1QnLCAnM3JkIE9UJywgJzR0aCBPVCcsICc1dGggT1QnLCAnNnRoIE9UJywgJzd0aCBPVCcsICc4dGggT1QnLCAnOXRoIE9UJywgJzEwdGggT1QnXTtcbiAgICAgICAgICAgIHZhciBzY29yZXNIVE1MID0gJyc7XG4gICAgICAgICAgICB2YXIgYWRkZWQgPSAwO1xuICAgICAgICAgICAgZm9yICh2YXIgaSA9IGxpdmVTY29yZXMubGVuZ3RoIC0gMTsgaSA+PSAwOyBpLS0pIHtcbiAgICAgICAgICAgICAgICBpZiAobGl2ZVNjb3Jlc1tpXS5oLnRhICE9PSAnQk9TJyAmJiBpIDwgMTEpIHtcbiAgICAgICAgICAgICAgICAgICAgYWRkZWQrKztcbiAgICAgICAgICAgICAgICAgICAgdmFyIHZTY29yZSA9ICcnO1xuICAgICAgICAgICAgICAgICAgICB2YXIgaFNjb3JlID0gJyc7XG4gICAgICAgICAgICAgICAgICAgIGlmIChsaXZlU2NvcmVzW2ldLnN0ICE9IDEpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHZTY29yZSA9IGxpdmVTY29yZXNbaV0udi5zO1xuICAgICAgICAgICAgICAgICAgICAgICAgaFNjb3JlID0gbGl2ZVNjb3Jlc1tpXS5oLnM7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgdmFyIHNUZXh0ID0gbGl2ZVNjb3Jlc1tpXS5zdHQ7XG4gICAgICAgICAgICAgICAgICAgIGlmIChzdGF0dXNDb2Rlcy5pbmRleE9mKGxpdmVTY29yZXNbaV0uc3R0KSAhPT0gLTEpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHNUZXh0ID0gbGl2ZVNjb3Jlc1tpXS5zdHQgKyAnIC0gJyArIGxpdmVTY29yZXNbaV0uY2w7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgc2NvcmVzSFRNTCArPSAnPGRpdiBjbGFzcz1cInNjb3JlLXdyYXBcIj48ZGl2IGNsYXNzPVwic2NvcmUtc3RhdHVzXCI+JyArIHNUZXh0ICsgJzwvZGl2PjxkaXYgY2xhc3M9XCInICsgbGl2ZVNjb3Jlc1tpXS52LnRhICsgJ1wiPjxpbWcgc3JjPVwiaHR0cDovL3N0YXRzLm5iYS5jb20vbWVkaWEvaW1nL3RlYW1zL2xvZ29zLycgKyBsaXZlU2NvcmVzW2ldLnYudGEudG9VcHBlckNhc2UoKSArICdfbG9nby5zdmdcIj4gJyArIGxpdmVTY29yZXNbaV0udi50Yy50b1VwcGVyQ2FzZSgpICsgJyAnICsgbGl2ZVNjb3Jlc1tpXS52LnRuLnRvVXBwZXJDYXNlKCkgKyAnIDxkaXYgY2xhc3M9XCJzY29yZS1udW1cIj4nICsgdlNjb3JlICsgJzwvZGl2PjwvZGl2PjxkaXYgY2xhc3M9XCInICsgbGl2ZVNjb3Jlc1tpXS5oLnRhICsgJ1wiPjxpbWcgc3JjPVwiaHR0cDovL3N0YXRzLm5iYS5jb20vbWVkaWEvaW1nL3RlYW1zL2xvZ29zLycgKyBsaXZlU2NvcmVzW2ldLmgudGEudG9VcHBlckNhc2UoKSArICdfbG9nby5zdmdcIj4gJyArIGxpdmVTY29yZXNbaV0uaC50Yy50b1VwcGVyQ2FzZSgpICsgJyAnICsgbGl2ZVNjb3Jlc1tpXS5oLnRuLnRvVXBwZXJDYXNlKCkgKyAnIDxkaXYgY2xhc3M9XCJzY29yZS1udW1cIj4nICsgaFNjb3JlICsgJzwvZGl2PjwvZGl2PjwvZGl2Pic7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgJCgnLnNjb3JlcycpLmVtcHR5KCkuYXBwZW5kKHNjb3Jlc0hUTUwpO1xuICAgICAgICB9XG4gICAgICAgIGlmIChhZGRlZCA8IDUpe1xuICAgICAgICAgICAgJCgnLmxlYWd1ZS1sZWFkZXJzJykuc2hvdygpO1xuICAgICAgICB9XG4gICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgJCgnLmxlYWd1ZS1sZWFkZXJzJykuaGlkZSgpO1xuICAgICAgICB9XG4gICAgfVxufVxuXG5mdW5jdGlvbiB1cGRhdGVMZWFndWVTY29yZXModG9kYXlzU2NvcmVzRGF0YSkge1xuICAgIHZhciBsaXZlU2NvcmVzID0gdG9kYXlzU2NvcmVzRGF0YS5ncy5nO1xuICAgIGlmIChsaXZlU2NvcmVzLmxlbmd0aCAhPSAwKSB7XG4gICAgICAgIHZhciBzZWFzb25UeXBlID0gJ1JlZ3VsYXIrU2Vhc29uJztcbiAgICAgICAgaWYgKGxpdmVTY29yZXNbMF0uZ2lkLnN1YnN0cigwLDMpID09ICcwMDEnKSB7XG4gICAgICAgICAgICBzZWFzb25UeXBlID0gJ1ByZStTZWFzb24nO1xuICAgICAgICB9XG4gICAgICAgIGVsc2UgaWYgKGxpdmVTY29yZXNbMF0uZ2lkLnN1YnN0cigwLDMpID09ICcwMDQnKSB7XG4gICAgICAgICAgICBzZWFzb25UeXBlID0gJ1BsYXlvZmZzJztcbiAgICAgICAgfVxuICAgICAgICBpZiAobGl2ZVNjb3Jlcy5sZW5ndGggPiAxIHx8IChsaXZlU2NvcmVzLmxlbmd0aCA9PSAxICYmIGxpdmVTY29yZXNbMF0uaC50YSAhPSAnQk9TJykpIHtcbiAgICAgICAgICAgIHZhciBzdGF0dXNDb2RlcyA9IFsnMXN0IFF0cicsJzJuZCBRdHInLCczcmQgUXRyJywnNHRoIFF0cicsJzFzdCBPVCcsJzJuZCBPVCcsJzNyZCBPVCcsJzR0aCBPVCcsJzV0aCBPVCcsJzZ0aCBPVCcsJzd0aCBPVCcsJzh0aCBPVCcsJzl0aCBPVCcsJzEwdGggT1QnXTtcbiAgICAgICAgICAgIHZhciBzY29yZXNIVE1MID0gJyc7XG4gICAgICAgICAgICBpZiAoJCgnLmF0bC1oZWFkZXInKS5sZW5ndGggPT09IDApIHtcbiAgICAgICAgICAgICAgICAkKCcjbGVmdHdyYXAnKS5wcmVwZW5kKCc8aW1nIGNsYXNzPVwiYXRsLWhlYWRlclwiIHNyYz1cImh0dHA6Ly9pLmNkbi50dXJuZXIuY29tL25iYS9uYmEvLmVsZW1lbnQvbWVkaWEvMi4wL3RlYW1zaXRlcy9jZWx0aWNzL21lZGlhL3NpZ25hZ2UtYXRsLTk2MHgxMzUucG5nXCI+Jyk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBmb3IgKHZhciBpID0gbGl2ZVNjb3Jlcy5sZW5ndGggLSAxOyBpID49IDA7IGktLSkge1xuICAgICAgICAgICAgICAgIGlmIChsaXZlU2NvcmVzW2ldLmgudGEgIT09ICdCT1MnKSB7XG4gICAgICAgICAgICAgICAgICAgIHZhciB2U2NvcmUgPSAnJztcbiAgICAgICAgICAgICAgICAgICAgdmFyIGhTY29yZSA9ICcnO1xuICAgICAgICAgICAgICAgICAgICBpZiAobGl2ZVNjb3Jlc1tpXS5zdCAhPSAxKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICB2U2NvcmUgPSBsaXZlU2NvcmVzW2ldLnYucztcbiAgICAgICAgICAgICAgICAgICAgICAgIGhTY29yZSA9IGxpdmVTY29yZXNbaV0uaC5zO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIHZhciBzVGV4dCA9IGxpdmVTY29yZXNbaV0uc3R0O1xuICAgICAgICAgICAgICAgICAgICBpZiAoc3RhdHVzQ29kZXMuaW5kZXhPZihsaXZlU2NvcmVzW2ldLnN0dCkgIT09IC0xKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBzVGV4dCA9IGxpdmVTY29yZXNbaV0uc3R0ICsgJyAtICcgKyBsaXZlU2NvcmVzW2ldLmNsO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIHNjb3Jlc0hUTUwgKz0gJzxkaXYgY2xhc3M9XCJzY29yZS13cmFwXCI+PGRpdiBjbGFzcz1cInNjb3JlLWNvbnRhaW5lclwiPjxkaXYgY2xhc3M9XCInICsgbGl2ZVNjb3Jlc1tpXS52LnRhICsgJ1wiPjxpbWcgc3JjPVwiaHR0cDovL3N0YXRzLm5iYS5jb20vbWVkaWEvaW1nL3RlYW1zL2xvZ29zLycgKyBsaXZlU2NvcmVzW2ldLnYudGEudG9VcHBlckNhc2UoKSArICdfbG9nby5zdmdcIj4gJyArIGxpdmVTY29yZXNbaV0udi50Yy50b1VwcGVyQ2FzZSgpICsgJyAnICsgbGl2ZVNjb3Jlc1tpXS52LnRuLnRvVXBwZXJDYXNlKCkgKyAnIDxkaXYgY2xhc3M9XCJzY29yZS1udW1cIj4nICsgdlNjb3JlICsgJzwvZGl2PjwvZGl2PjxkaXYgY2xhc3M9XCInICsgbGl2ZVNjb3Jlc1tpXS5oLnRhICsgJ1wiPjxpbWcgc3JjPVwiaHR0cDovL3N0YXRzLm5iYS5jb20vbWVkaWEvaW1nL3RlYW1zL2xvZ29zLycgKyBsaXZlU2NvcmVzW2ldLmgudGEudG9VcHBlckNhc2UoKSArICdfbG9nby5zdmdcIj4gJyArIGxpdmVTY29yZXNbaV0uaC50Yy50b1VwcGVyQ2FzZSgpICsgJyAnICsgbGl2ZVNjb3Jlc1tpXS5oLnRuLnRvVXBwZXJDYXNlKCkgKyAnIDxkaXYgY2xhc3M9XCJzY29yZS1udW1cIj4nICsgaFNjb3JlICsgJzwvZGl2PjwvZGl2PjxkaXYgY2xhc3M9XCJzY29yZS1zdGF0dXNcIj4nICsgc1RleHQgKyAnPC9kaXY+PC9kaXY+PC9kaXY+JztcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICAkKCcuc2NvcmVzJykuZW1wdHkoKS5hcHBlbmQoc2NvcmVzSFRNTCk7XG4gICAgICAgICAgICBsZWFndWVMZWFkZXJzKHNlYXNvblR5cGUpO1xuICAgICAgICB9XG4gICAgfVxufVxuXG5mdW5jdGlvbiBsZWFndWVMZWFkZXJzKCl7XG4gICAgdmFyIGxlYWd1ZUxlYWRlcnNIVE1MID0gJzxkaXYgY2xhc3M9XCJ0aXRsZVwiPjxwPkxFQUdVRSBMRUFERVJTPC9wPjxwPlBUUzwvcD48cD5SRUI8L3A+PHA+QVNUPC9wPjxwPlNUTDwvcD48cD5CTEs8L3A+PC9kaXY+JztcbiAgICB2YXIgc3RhdFR5cGUgPSAnJztcbiAgICB2YXIgZGF0YUluZGV4ID0gW1wiUkFOS1wiLFwiUExBWUVSX0lEXCIsXCJQTEFZRVJcIixcIlRFQU1fSURcIixcIlRFQU1fQUJCUkVWSUFUSU9OXCJdO1xuXG4gICAgJC5hamF4KHtcbiAgICAgICAgdXJsOiAnaHR0cDovL2xvY2FsaG9zdDo4ODg4L2RhdGEvbGVhZ3VlX2xlYWRlcnMuanNvbicsXG4gICAgICAgIGFzeW5jOiBmYWxzZSxcbiAgICAgICAgc3VjY2VzczogZnVuY3Rpb24oZGF0YSkge1xuICAgICAgICAgICAgdmFyIGxlYWRlcnNEYXRhID0gZGF0YS5yZXN1bHRTZXRzO1xuICAgICAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBsZWFkZXJzRGF0YS5sZW5ndGg7IGkrKyl7XG4gICAgICAgICAgICAgICAgdmFyIGluZGV4ID0gY3JlYXRlSW5kZXgoZGF0YUluZGV4LCBsZWFkZXJzRGF0YVtpXS5oZWFkZXJzKTtcbiAgICAgICAgICAgICAgICB2YXIgcm93cyA9ICcnO1xuICAgICAgICAgICAgICAgIGlmIChbXCJQVFNcIixcIlJFQlwiLFwiQVNUXCIsXCJTVExcIixcIkJMS1wiXS5pbmRleE9mKGxlYWRlcnNEYXRhW2ldLmhlYWRlcnNbOF0pICE9PSAtMSl7XG4gICAgICAgICAgICAgICAgICAgIGZvciAobGV0IHggPSAwOyB4IDwgbGVhZGVyc0RhdGFbaV0ucm93U2V0Lmxlbmd0aDsgeCsrKXtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJvd3MgKz0gJzxkaXYgY2xhc3M9XCJyb3dcIj48ZGl2IGNsYXNzPVwibGVmdFwiPjxkaXYgY2xhc3M9XCJwbGFjZVwiPicgKyBsZWFkZXJzRGF0YVtpXS5yb3dTZXRbeF1bMF0gKyAnPC9kaXY+PGRpdiBjbGFzcz1cImxvZ28td3JhcFwiPjxpbWcgY2xhc3M9XCJsb2dvXCIgc3JjPVwiaHR0cDovL3N0YXRzLm5iYS5jb20vbWVkaWEvaW1nL3RlYW1zL2xvZ29zLycgKyBsZWFkZXJzRGF0YVtpXS5yb3dTZXRbeF1bNF0gKyAnX2xvZ28uc3ZnXCIvPjwvZGl2PjxkaXYgY2xhc3M9XCJuYW1lXCI+JyArIGxlYWRlcnNEYXRhW2ldLnJvd1NldFt4XVsyXS50b1VwcGVyQ2FzZSgpICsgJzwvZGl2PjwvZGl2PjxkaXYgY2xhc3M9XCJyaWdodFwiPjxkaXYgY2xhc3M9XCJ2YWx1ZVwiPicgKyByb3VuZChsZWFkZXJzRGF0YVtpXS5yb3dTZXRbeF1bOF0pICsgJzwvZGl2PjwvZGl2PjwvZGl2Pic7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgbGVhZ3VlTGVhZGVyc0hUTUwgKz0gJzxkaXYgY2xhc3M9XCJsZWFndWUtbGVhZGVycy13cmFwXCI+JyArIHJvd3MgKyAnPC9kaXY+JztcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9KTtcbiAgICAkKCcubGVhZ3VlLWxlYWRlcnMnKS5lbXB0eSgpLmFwcGVuZChsZWFndWVMZWFkZXJzSFRNTCk7XG4gICAgdmFyIGNvdW50ZXIgPSAyO1xuICAgIHNldEludGVydmFsKGZ1bmN0aW9uKCl7XG4gICAgICAgIGpRdWVyeSgnLmxlYWd1ZS1sZWFkZXJzLXdyYXAsIC5sZWFndWUtbGVhZGVycyAudGl0bGUgcCcpLnJlbW92ZUNsYXNzKCdhY3RpdmUnKTtcbiAgICAgICAgalF1ZXJ5KCcubGVhZ3VlLWxlYWRlcnMtd3JhcDpudGgtb2YtdHlwZSgnICsgY291bnRlciArICcpLCAubGVhZ3VlLWxlYWRlcnMgLnRpdGxlIHA6bnRoLW9mLXR5cGUoJyArIGNvdW50ZXIgKyAnKScpLmFkZENsYXNzKCdhY3RpdmUnKTtcbiAgICAgICAgaWYgKGNvdW50ZXIgPT0gNikge1xuICAgICAgICAgICAgY291bnRlciA9IDI7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICBjb3VudGVyKys7XG4gICAgICAgIH1cbiAgICB9LCA0MDAwKTtcbn1cbiJdfQ==
