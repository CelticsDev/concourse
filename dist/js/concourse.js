(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
'use strict';

var rosterObj = {
    celtics: {
        roster: {},
        leaders: {
            pts: [['--', '--', 0, '--'], ['--', '--', 0, '--'], ['--', '--', 0, '--']],
            ast: [['--', '--', 0, '--'], ['--', '--', 0, '--'], ['--', '--', 0, '--']],
            reb: [['--', '--', 0, '--'], ['--', '--', 0, '--'], ['--', '--', 0, '--']]
        }
    },
    away: {
        roster: {},
        leaders: {
            pts: [['--', '--', 0, '--'], ['--', '--', 0, '--'], ['--', '--', 0, '--']],
            ast: [['--', '--', 0, '--'], ['--', '--', 0, '--'], ['--', '--', 0, '--']],
            reb: [['--', '--', 0, '--'], ['--', '--', 0, '--'], ['--', '--', 0, '--']]
        }
    }
};

if (window.location.href.indexOf('nba.com') > -1) {
    var dummyVar = '&';
    var feeds = {
        todaysScores: 'http://data.nba.com/data/v2015/json/mobile_teams/nba/2017/scores/00_todays_scores.json',
        celticsRoster: 'http://data.nba.com/data/v2015/json/mobile_teams/nba/2017/teams/celtics_roster.json',
        awayRoster: function awayRoster(awayTn) {
            return 'http://data.nba.com/data/v2015/json/mobile_teams/nba/2017/teams/' + awayTn + '_roster.json';
        },
        bioData: 'http://io.cnn.net/nba/nba/.element/media/2.0/teamsites/celtics/json/bio-data.json',
        playercard: function playercard(pid) {
            return 'http://data.nba.com/data/v2015/json/mobile_teams/nba/2017/players/playercard_' + pid + '_02.json';
        },
        playercardAway: function playercardAway(pid) {
            return 'http://data.nba.com/data/v2015/json/mobile_teams/nba/2017/players/playercard_' + pid + '_02.json';
        },
        gamedetail: function gamedetail(gid) {
            return 'http://data.nba.com/data/v2015/json/mobile_teams/nba/2017/scores/gamedetail/' + gid + '_gamedetail.json';
        },
        standings: 'http://data.nba.com/data/v2015/json/mobile_teams/nba/2017/00_standings.json',
        leagueLeaders: 'http://stats.nba.com/stats/homepagev2?GameScope=Season&LeagueID=00&PlayerOrTeam=Player&PlayerScope=All+Players&Season=2017-18&SeasonType=Regular+Season&StatType=Traditional&callback=?'
    };
} else {
    var feeds = {
        todaysScores: 'http://localhost:8888/data/mobile-stats-feed/todays_scores.json',
        celticsRoster: 'http://localhost:8888/data/mobile-stats-feed/celtics_roster.json',
        awayRoster: function awayRoster(awayTn) {
            return 'http://localhost:8888/data/mobile-stats-feed/away_roster.json';
        },
        bioData: 'http://localhost:8888/data/bio-data.json',
        playercard: function playercard(pid) {
            return 'http://localhost:8888/data/mobile-stats-feed/playercards/playercard-' + pid + '.json';
        },
        playercardAway: function playercardAway(pid) {
            return 'http://localhost:8888/data/mobile-stats-feed/playercards/playercard-202330.json';
        },
        gamedetail: function gamedetail(gid) {
            return 'http://localhost:8888/data/mobile-stats-feed/gamedetail.json';
        },
        standings: 'http://localhost:8888/data/mobile-stats-feed/standings.json',
        leagueLeaders: 'http://localhost:8888/data/league_leaders.json'
    };
}

var gameStarted = false;
var playerSpotlightCounter = 1;
jQuery(document).ready(function () {
    var gid = '';
    var awayTeam = '';
    var awayTn = '';
    var date = new Date();
    var leftWrapCounter = false;
    jQuery.ajax({
        url: feeds.todaysScores,
        async: false,
        success: function success(todaysScoresData) {
            for (var i = 0; i < todaysScoresData.gs.g.length; i++) {
                if (todaysScoresData.gs.g[i].h.ta == 'CHA') {
                    // TRANSITIONS
                    var _cycle = function _cycle() {
                        /*                        mobileApp(); // DURATION: 25000
                                                setTimeout(function() {
                                                    leaders(gid);
                                                }, 25000); // DURATION: 44100
                                                setTimeout(social, 69000); //DURATION: 150000*/
                        setTimeout(function () {
                            playerSpotlight(rosterObj);
                        }, 1000); //DURATION: 9000...
                    };

                    //CHANGE THIS
                    awayTeam = todaysScoresData.gs.g[i].v.ta;
                    awayTn = todaysScoresData.gs.g[i].v.tn.toLowerCase();
                    gid = todaysScoresData.gs.g[i].gid;
                    loadRosterData(awayTeam, awayTn);
                    scoresInit(todaysScoresData);
                    standingsInit(awayTeam);
                    leagueLeaders();
                    leftWrap();
                    _cycle();
                    /*                    setInterval(cycle, 91000);*/
                }
            }
        }
    });
});

function cycle() {}
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
function checkGameStatus() {
    var check = false;
    if (!gameStarted) {
        jQuery.ajax({
            url: feeds.todaysScores,
            async: false,
            success: function success(datadata) {
                var gid = '';
                for (var i = 0; i < 5; i++) {
                    if (datadata.gs.g[i].h.ta == 'CHA' && datadata.gs.g[i].st !== "1") {
                        check = true;
                        gameStarted = true;
                    }
                }
            }
        });
    }
    return check;
};
/*============================================================
=            LOAD ROSTER INFO (build rosterObj)              =
============================================================*/
function loadRosterData(awayTeam, awayTn) {
    var roster = '';
    jQuery.ajax({
        url: feeds.celticsRoster,
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
        url: feeds.awayRoster(awayTn),
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
        url: feeds.bioData,
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
            url: feeds.playercard(pid),
            async: false,
            success: function success(data) {
                if (data.pl.ca.hasOwnProperty('sa')) {
                    rosterObj.celtics.roster[pid].stats = data.pl.ca.sa[data.pl.ca.sa.length - 1];
                    rosterObj.celtics.roster[pid].stats.sa = data.pl.ca.sa;
                } else {
                    rosterObj.celtics.roster[pid].stats = data.pl.ca;
                }
            },
            error: function error() {}
        });
    }
    for (var i = 0; i < awayRoster.t.pl.length; i++) {
        var pid = awayRoster.t.pl[i].pid;
        rosterObj.away.roster[pid] = awayRoster.t.pl[i];
        jQuery.ajax({
            url: feeds.playercardAway(pid), // CHANGE PID
            async: false,
            success: function success(data) {
                if (data.pl.ca.hasOwnProperty('sa')) {
                    rosterObj.away.roster[pid].stats = data.pl.ca.sa[data.pl.ca.sa.length - 1];
                    rosterObj.away.roster[pid].stats.sa = data.pl.ca.sa;
                } else {
                    rosterObj.away.roster[pid].stats = data.pl.ca;
                }
            },
            error: function error() {}
        });
    }
    for (var team in rosterObj) {
        for (var player in rosterObj[team].roster) {
            for (var stat in rosterObj[team].leaders) {
                rosterObj[team].leaders[stat].push([rosterObj[team].roster[player].fn.toUpperCase(), rosterObj[team].roster[player].ln.toUpperCase(), rosterObj[team].roster[player].stats[stat], rosterObj[team].roster[player].pid]);
            }
        }
    }
    for (var team in rosterObj) {
        for (var stat in rosterObj[team].leaders) {
            rosterObj[team].leaders[stat].sort(function (a, b) {
                return b[2] - a[2];
            });
        }
    }
    console.log('SORTED:');
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
            rosterObj[pid].stats.sa[0][saIndex[i]] = 'CHA';
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
function playerSpotlight(rosterObj) {
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
    }, 1700);
    /* 5 - PLAYER SELECT */
    var selectedPlayer = '';
    setTimeout(function () {
        jQuery('.player-box').addClass('transition-2');
        jQuery('.player-box:nth-child(' + playerSpotlightCounter + ')').addClass('selected');
        selectedPlayer = jQuery('.player-box:nth-child(' + playerSpotlightCounter + ')').attr('data-pid');
        setTimeout(function () {
            jQuery('.player-box').not('.replacement.selected').addClass('transition-4');
        }, 500);
    }, 3000);
    /* 6 - PLAYER BOX EXPAND */
    setTimeout(function () {
        jQuery('.block-wrap.social').addClass('transition-3');
        jQuery('.player-box.replacement.selected').addClass('transition-3');
    }, 3800);
    /* 7 - SPOTLIGHT HTML */
    setTimeout(function () {
        generateTimeline(selectedPlayer);
        jQuery('.player-box.replacement.selected').clone().appendTo('.block-wrap.player-spotlight .top-wrap');
        jQuery('.player-spotlight .selected').addClass('.appended');
        jQuery('.block-wrap.player-spotlight').addClass('transition-1');
        jQuery('.block-wrap.social').addClass('transition-1');
        var stats = rosterObj.celtics.roster[selectedPlayer].stats;
        jQuery('.player-spotlight .top-wrap .player-top').append('<img class="silo appended" src="http://io.cnn.net/nba/nba/.element/media/2.0/teamsites/celtics/media/silo-466x591-' + rosterObj.celtics.roster[selectedPlayer].pid + '.png" /><div class="top appended"><div class="player-name-wrap"><p class="player-name"><span>' + rosterObj.celtics.roster[selectedPlayer].fn.toUpperCase() + '</span> <br> ' + rosterObj.celtics.roster[selectedPlayer].ln.toUpperCase() + '</p></div><p class="player-number">' + rosterObj.celtics.roster[selectedPlayer].num + '</br><span>' + rosterObj.celtics.roster[selectedPlayer].pos + '</span></p></div><div class="middle appended"><ul class="info clearfix"><li><p>AGE<span class="sm-hide">:&nbsp;</span> </br><span class="info-value">' + playerAge(rosterObj.celtics.roster[selectedPlayer].dob) + '</span></p></li><li><p>HT<span class="sm-hide">:&nbsp;</span> </br><span class="info-value">' + rosterObj.celtics.roster[selectedPlayer].ht + '</span></p></li><li><p>WT<span class="sm-hide">:&nbsp;</span> </br><span class="info-value">' + rosterObj.celtics.roster[selectedPlayer].wt + '</span></p></li></ul></div><div class="bottom full clearfix sm-hide appended"><table class="averages"><tr class="averages-labels"><td><p>GP</p></td><td><p>PPG</p></td><td><p>RPG</p></td><td><p>APG</p></td></tr><tr class="averages-season"><td class="gp"><p></p></td><td class="pts"><p></p></td><td class="reb"><p></p></td><td class="ast"><p></p></td></tr></table></div>');
        jQuery(".player-spotlight .averages-season").html('<td class="appended"><p>' + stats.sa[0].gp + '</p></td><td class="appended"><p>' + stats.sa[0].pts + '</p></td><td class="appended"><p>' + stats.sa[0].reb + '</p></td><td class="appended"><p>' + stats.sa[0].ast + '</p></td>');
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
    }, 6000);
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
    }, 7000);
    /* 9 - SPOTLIGHT SLIDE OUT */
    setTimeout(function () {
        jQuery('.player-spotlight .bottom-wrap, .player-spotlight .top-wrap').addClass('transition-2');
    }, 8000);
    /* 10 - DONE. REMOVE */
    setTimeout(function () {
        jQuery(' .player-spotlight .appended').remove();
        jQuery(' .player-spotlight .selected').removeClass('selected');
        for (var i = 1; i < 10; i++) {
            jQuery('.right-wrap .transition-' + i).removeClass('transition-' + i);
        }
    }, 9000);
}

function leaders(gid, gameStarted) {
    jQuery('.leaders').addClass('active');
    var gameDetail = '';
    var detailAvailable = false;
    var leadersTitle = 'SEASON LEADERS';
    if (checkGameStatus()) {
        leadersTitle = 'GAME LEADERS';
        jQuery.ajax({
            url: feeds.gamedetail(gid),
            async: false,
            success: function success(data) {
                var teamLineScore = ["hls", "vls"];
                for (var x = 0; x < teamLineScore.length; x++) {
                    var stats = data.g[teamLineScore[x]];
                    var team = '';
                    if (stats.ta === 'CHA') {
                        team = 'celtics';
                    } else {
                        team = 'away';
                    }
                    for (var stat in rosterObj[team].leaders) {
                        rosterObj[team].leaders[stat] = [['--', '--', 0, '--'], ['--', '--', 0, '--'], ['--', '--', 0, '--']];
                    }
                    for (var p = 0; p < stats.pstsg.length; p++) {
                        for (var stat in rosterObj[team].leaders) {
                            rosterObj[team].leaders[stat].push([stats.pstsg[p].fn.toUpperCase(), stats.pstsg[p].ln.toUpperCase(), stats.pstsg[p][stat], stats.pstsg[p].pid]);
                        }
                        rosterObj[team].leaders[stat].sort(function (a, b) {
                            return a[2] - b[2];
                        });
                    }
                    for (var team in rosterObj) {
                        for (var stat in rosterObj[team].leaders) {
                            rosterObj[team].leaders[stat].sort(function (a, b) {
                                return b[2] - a[2];
                            });
                        }
                    }
                    console.log('SORTED:');
                    console.log(rosterObj);
                }
            }
        });
    }
    jQuery('.leaders-title').html(leadersTitle);
    for (var team in rosterObj) {
        for (var i = 0; i < 3; i++) {
            for (var stat in rosterObj[team].leaders) {
                // LEADER STAT VALUE
                jQuery('.leader-section:nth-of-type(' + (i + 2) + ') .' + stat + '.' + team + ' .stat').html('<span class="appended ' + rosterObj[team].ta + '">' + rosterObj[team].leaders[stat][i][2] + '</span> ' + stat.toUpperCase());
                // LEADER NAME
                if (rosterObj[team].leaders[stat][i][0].length + rosterObj[team].leaders[stat][i][1].length >= 14) {
                    rosterObj[team].leaders[stat][i][0] = rosterObj[team].leaders[stat][i][0].substr(0, 1) + '.';
                }
                jQuery('.leader-section:nth-of-type(' + (i + 2) + ') .' + stat + '.' + team + ' .name').html('<span class="appended">' + rosterObj[team].leaders[stat][i][0] + '</span> ' + rosterObj[team].leaders[stat][i][1]);
                // LEADER HEADSHOT
                jQuery('.leader-section:nth-of-type(' + (i + 2) + ') .' + stat + '.' + team + ' .headshot').attr('src', 'https://ak-static.cms.nba.com/wp-content/uploads/headshots/nba/latest/1040x760/' + rosterObj[team].leaders[stat][i][3] + '.png');
            }
        }
    }
    setTimeout(function () {
        jQuery('.leaders, .leaders .block-inner').addClass('transition-1');
    }, 100);
    setTimeout(function () {
        jQuery('.leaders .leader-section').addClass('transition-1');
        jQuery('.leader-subsection.bottom p:nth-of-type(1)').addClass('transition-1');
        jQuery('.leaders .leader-section .underline, .leaders .leader-subsection.top').addClass(rosterObj.celtics.ta + '-bg');
    }, 1100);
    setTimeout(function () {
        jQuery('.leaders .leader-section').addClass('transition-2');
        jQuery('.leaders .block-inner').addClass('transition-2');
    }, 2100);
    var transitionCounter = 1;
    setTimeout(function () {
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
            }, 7000 * _i);
        };

        for (var _i = 1; _i < 6; _i++) {
            _loop(_i);
        }
    }, 2100);
    setTimeout(function () {
        jQuery('.leaders .leader-section, .leaders .leader-subsection').addClass('transition-3');
    }, 44100);
    setTimeout(function () {
        jQuery('.leaders').addClass('transition-2');
    }, 44100);
    setTimeout(function () {
        jQuery('.leaders .leader-section .underline, .leaders .leader-subsection.top').removeClass(rosterObj.away.ta + '-bg');
        jQuery('.leaders .leader-section .underline, .leaders .leader-subsection.top').addClass(rosterObj.celtics.ta + '-bg');
        jQuery('.leaders').removeClass('active');
        jQuery('.leaders .appended').remove();
        for (var i = 1; i < 10; i++) {
            jQuery('.leaders .transition-' + i + ', .leaders.transition-' + i).removeClass('transition-' + i);
        }
    }, 45000);
};

function social() {
    jQuery('.social .text-wrap, .social .underline').removeClass('transition-1');
    jQuery('.social').addClass('active');
    setTimeout(function () {
        jQuery('.social .text-wrap, .social .underline').addClass('transition-1');
    }, 15000);
    setTimeout(function () {
        jQuery('.social .appended').remove();
        jQuery('.social .selected').removeClass('selected');
        jQuery('.social').removeClass('active');
    }, 20000);
};
/*function mobileAppInit() {
    var counter = 1;
    setInterval(function() {
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
*/
function mobileApp() {
    jQuery('.app .block-inner').removeClass('transition-1');
    jQuery('.app').addClass('active');
    var counter = 1;
    var rotateScreens = setInterval(function () {
        jQuery('.app .bottom-wrap img').removeClass('active');
        jQuery('.app .feature-list p').removeClass('active');
        jQuery('.app .feature-list p:nth-of-type(' + counter + ')').addClass('active');
        jQuery('.app .bottom-wrap img:nth-of-type(' + counter + ')').addClass('active');
        if (counter == 5) {
            counter = 1;
        } else {
            counter++;
        }
    }, 4000);
    rotateScreens;
    setTimeout(function () {
        jQuery('.app .block-inner').addClass('transition-1');
    }, 24000);
    setTimeout(function () {
        jQuery('.app').removeClass('active');
        clearInterval(rotateScreens);
    }, 25000);
};
/*=================================
=            LEFT WRAP            =
=================================*/
function leftWrap() {
    setInterval(function () {
        if (jQuery('.left-wrap .standings').hasClass('transition-1')) {
            jQuery('.left-wrap .standings').removeClass('transition-1');
        } else {
            jQuery('.left-wrap .standings').addClass('transition-1');
        }
        if (jQuery('.left-wrap .scores-and-leaders').hasClass('transition-1')) {
            jQuery('.left-wrap .scores-and-leaders').removeClass('transition-1');
            updateLeagueScores();
        } else {
            jQuery('.left-wrap .scores-and-leaders').addClass('transition-1');
        }
    }, 50000);
}

function standingsInit(awayTeam) {
    jQuery.ajax({
        url: feeds.standings,
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
                        if (standingsData.sta.co[i].di[x].t[t].ta == 'CHA') {
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
        if (liveScores.length > 1 || liveScores.length == 1 && liveScores[0].h.ta != 'CHA') {
            var statusCodes = ['1st Qtr', '2nd Qtr', '3rd Qtr', '4th Qtr', '1st OT', '2nd OT', '3rd OT', '4th OT', '5th OT', '6th OT', '7th OT', '8th OT', '9th OT', '10th OT'];
            var scoresHTML = '';
            var added = 0;
            for (var i = liveScores.length - 1; i >= 0; i--) {
                if (liveScores[i].h.ta !== 'CHA' && i < 11) {
                    added++;
                    var vScore = '';
                    var hScore = '';
                    var vResult = '';
                    var hResult = '';
                    if (liveScores[i].st != 1) {
                        vScore = liveScores[i].v.s;
                        hScore = liveScores[i].h.s;
                    }
                    var sText = liveScores[i].stt;
                    if (statusCodes.indexOf(liveScores[i].stt) !== -1) {
                        sText = liveScores[i].stt + ' - ' + liveScores[i].cl;
                    }
                    if (liveScores[i].st == 3 && vScore < hScore) {
                        vResult = 'loser';
                    } else if (liveScores[i].st == 3 && hScore < vScore) {
                        hResult = 'loser';
                    }
                    scoresHTML += '<div class="score-wrap"><div class="score-status">' + sText + '</div><div class="' + liveScores[i].v.ta + '"><img src="http://stats.nba.com/media/img/teams/logos/' + liveScores[i].v.ta.toUpperCase() + '_logo.svg"> ' + liveScores[i].v.tc.toUpperCase() + ' ' + liveScores[i].v.tn.toUpperCase() + ' <div class="score-num ' + vResult + '">' + vScore + '</div></div><div class="' + liveScores[i].h.ta + '"><img src="http://stats.nba.com/media/img/teams/logos/' + liveScores[i].h.ta.toUpperCase() + '_logo.svg"> ' + liveScores[i].h.tc.toUpperCase() + ' ' + liveScores[i].h.tn.toUpperCase() + ' <div class="score-num ' + hResult + '">' + hScore + '</div></div></div>';
                }
            }
            jQuery('.scores').empty().append(scoresHTML);
        }
        if (added <= 5) {
            jQuery('.league-leaders').show();
        } else {
            jQuery('.league-leaders').hide();
        }
    }
}

function updateLeagueScores() {
    jQuery.ajax({
        url: feeds.todaysScores,
        async: false,
        success: function success(data) {
            scoresInit(data);
        }
    });
}

function leagueLeaders() {
    var leagueLeadersHTML = '<div class="title"><p>LEAGUE LEADERS</p><p>PTS</p><p>REB</p><p>AST</p><p>STL</p><p>BLK</p></div>';
    var statType = '';
    var dataIndex = ["RANK", "PLAYER_ID", "PLAYER", "TEAM_ID", "TEAM_ABBREVIATION"];
    jQuery.ajax({
        url: feeds.leagueLeaders,
        dataType: 'jsonp',
        async: false,
        success: function success(data) {
            var leadersData = data.resultSets;
            for (var i = 0; i < leadersData.length; i++) {
                var index = createIndex(dataIndex, leadersData[i].headers);
                var rows = '';
                if (["PTS", "REB", "AST", "STL", "BLK"].indexOf(leadersData[i].headers[8]) !== -1) {
                    for (var x = 0; x < leadersData[i].rowSet.length; x++) {
                        var n = leadersData[i].rowSet[x][2].split(' ');
                        var fn = n[0].toUpperCase();
                        var ln = n[1].toUpperCase();
                        rows += '<div class="row"><div class="left"><div class="place">' + leadersData[i].rowSet[x][0] + '</div><div class="logo-wrap"><img class="logo" src="http://stats.nba.com/media/img/teams/logos/' + leadersData[i].rowSet[x][4] + '_logo.svg"/></div><div class="name"><span>' + fn + '</span> ' + ln + '</div></div><div class="right"><div class="value">' + round(leadersData[i].rowSet[x][8]) + '</div></div></div>';
                    }
                    leagueLeadersHTML += '<div class="league-leaders-wrap">' + rows + '</div>';
                }
            }
            jQuery('.league-leaders').empty().append(leagueLeadersHTML);
        }
    });
    var counter = 2;
    setInterval(function () {
        jQuery('.league-leaders-wrap, .league-leaders .title p').removeClass('active');
        jQuery('.league-leaders-wrap:nth-of-type(' + counter + '), .league-leaders .title p:nth-of-type(' + counter + ')').addClass('active');
        if (counter == 6) {
            counter = 2;
        } else {
            counter++;
        }
    }, 10000);
}

},{}]},{},[1])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJzcmMvanMvY29uY291cnNlLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7QUNBQSxJQUFJLFlBQVk7QUFDWixhQUFTO0FBQ0wsZ0JBQVEsRUFESDtBQUVMLGlCQUFTO0FBQ0wsaUJBQUssQ0FDRCxDQUFDLElBQUQsRUFBTyxJQUFQLEVBQWEsQ0FBYixFQUFnQixJQUFoQixDQURDLEVBRUQsQ0FBQyxJQUFELEVBQU8sSUFBUCxFQUFhLENBQWIsRUFBZ0IsSUFBaEIsQ0FGQyxFQUdELENBQUMsSUFBRCxFQUFPLElBQVAsRUFBYSxDQUFiLEVBQWdCLElBQWhCLENBSEMsQ0FEQTtBQU1MLGlCQUFLLENBQ0QsQ0FBQyxJQUFELEVBQU8sSUFBUCxFQUFhLENBQWIsRUFBZ0IsSUFBaEIsQ0FEQyxFQUVELENBQUMsSUFBRCxFQUFPLElBQVAsRUFBYSxDQUFiLEVBQWdCLElBQWhCLENBRkMsRUFHRCxDQUFDLElBQUQsRUFBTyxJQUFQLEVBQWEsQ0FBYixFQUFnQixJQUFoQixDQUhDLENBTkE7QUFXTCxpQkFBSyxDQUNELENBQUMsSUFBRCxFQUFPLElBQVAsRUFBYSxDQUFiLEVBQWdCLElBQWhCLENBREMsRUFFRCxDQUFDLElBQUQsRUFBTyxJQUFQLEVBQWEsQ0FBYixFQUFnQixJQUFoQixDQUZDLEVBR0QsQ0FBQyxJQUFELEVBQU8sSUFBUCxFQUFhLENBQWIsRUFBZ0IsSUFBaEIsQ0FIQztBQVhBO0FBRkosS0FERztBQXFCWixVQUFNO0FBQ0YsZ0JBQVEsRUFETjtBQUVGLGlCQUFTO0FBQ0wsaUJBQUssQ0FDRCxDQUFDLElBQUQsRUFBTyxJQUFQLEVBQWEsQ0FBYixFQUFnQixJQUFoQixDQURDLEVBRUQsQ0FBQyxJQUFELEVBQU8sSUFBUCxFQUFhLENBQWIsRUFBZ0IsSUFBaEIsQ0FGQyxFQUdELENBQUMsSUFBRCxFQUFPLElBQVAsRUFBYSxDQUFiLEVBQWdCLElBQWhCLENBSEMs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cyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24gZSh0LG4scil7ZnVuY3Rpb24gcyhvLHUpe2lmKCFuW29dKXtpZighdFtvXSl7dmFyIGE9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtpZighdSYmYSlyZXR1cm4gYShvLCEwKTtpZihpKXJldHVybiBpKG8sITApO3ZhciBmPW5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIrbytcIidcIik7dGhyb3cgZi5jb2RlPVwiTU9EVUxFX05PVF9GT1VORFwiLGZ9dmFyIGw9bltvXT17ZXhwb3J0czp7fX07dFtvXVswXS5jYWxsKGwuZXhwb3J0cyxmdW5jdGlvbihlKXt2YXIgbj10W29dWzFdW2VdO3JldHVybiBzKG4/bjplKX0sbCxsLmV4cG9ydHMsZSx0LG4scil9cmV0dXJuIG5bb10uZXhwb3J0c312YXIgaT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2Zvcih2YXIgbz0wO288ci5sZW5ndGg7bysrKXMocltvXSk7cmV0dXJuIHN9KSIsInZhciByb3N0ZXJPYmogPSB7XG4gICAgY2VsdGljczoge1xuICAgICAgICByb3N0ZXI6IHt9LFxuICAgICAgICBsZWFkZXJzOiB7XG4gICAgICAgICAgICBwdHM6IFtcbiAgICAgICAgICAgICAgICBbJy0tJywgJy0tJywgMCwgJy0tJ10sXG4gICAgICAgICAgICAgICAgWyctLScsICctLScsIDAsICctLSddLFxuICAgICAgICAgICAgICAgIFsnLS0nLCAnLS0nLCAwLCAnLS0nXVxuICAgICAgICAgICAgXSxcbiAgICAgICAgICAgIGFzdDogW1xuICAgICAgICAgICAgICAgIFsnLS0nLCAnLS0nLCAwLCAnLS0nXSxcbiAgICAgICAgICAgICAgICBbJy0tJywgJy0tJywgMCwgJy0tJ10sXG4gICAgICAgICAgICAgICAgWyctLScsICctLScsIDAsICctLSddXG4gICAgICAgICAgICBdLFxuICAgICAgICAgICAgcmViOiBbXG4gICAgICAgICAgICAgICAgWyctLScsICctLScsIDAsICctLSddLFxuICAgICAgICAgICAgICAgIFsnLS0nLCAnLS0nLCAwLCAnLS0nXSxcbiAgICAgICAgICAgICAgICBbJy0tJywgJy0tJywgMCwgJy0tJ11cbiAgICAgICAgICAgIF1cbiAgICAgICAgfVxuICAgIH0sXG4gICAgYXdheToge1xuICAgICAgICByb3N0ZXI6IHt9LFxuICAgICAgICBsZWFkZXJzOiB7XG4gICAgICAgICAgICBwdHM6IFtcbiAgICAgICAgICAgICAgICBbJy0tJywgJy0tJywgMCwgJy0tJ10sXG4gICAgICAgICAgICAgICAgWyctLScsICctLScsIDAsICctLSddLFxuICAgICAgICAgICAgICAgIFsnLS0nLCAnLS0nLCAwLCAnLS0nXVxuICAgICAgICAgICAgXSxcbiAgICAgICAgICAgIGFzdDogW1xuICAgICAgICAgICAgICAgIFsnLS0nLCAnLS0nLCAwLCAnLS0nXSxcbiAgICAgICAgICAgICAgICBbJy0tJywgJy0tJywgMCwgJy0tJ10sXG4gICAgICAgICAgICAgICAgWyctLScsICctLScsIDAsICctLSddXG4gICAgICAgICAgICBdLFxuICAgICAgICAgICAgcmViOiBbXG4gICAgICAgICAgICAgICAgWyctLScsICctLScsIDAsICctLSddLFxuICAgICAgICAgICAgICAgIFsnLS0nLCAnLS0nLCAwLCAnLS0nXSxcbiAgICAgICAgICAgICAgICBbJy0tJywgJy0tJywgMCwgJy0tJ11cbiAgICAgICAgICAgIF1cbiAgICAgICAgfVxuICAgIH1cbn07XG5cbmlmICh3aW5kb3cubG9jYXRpb24uaHJlZi5pbmRleE9mKCduYmEuY29tJykgPiAtMSl7XG4gICAgdmFyIGR1bW15VmFyID0gJyYnO1xuICAgIHZhciBmZWVkcyA9IHtcbiAgICAgICAgdG9kYXlzU2NvcmVzOiAnaHR0cDovL2RhdGEubmJhLmNvbS9kYXRhL3YyMDE1L2pzb24vbW9iaWxlX3RlYW1zL25iYS8yMDE3L3Njb3Jlcy8wMF90b2RheXNfc2NvcmVzLmpzb24nLFxuICAgICAgICBjZWx0aWNzUm9zdGVyOiAnaHR0cDovL2RhdGEubmJhLmNvbS9kYXRhL3YyMDE1L2pzb24vbW9iaWxlX3RlYW1zL25iYS8yMDE3L3RlYW1zL2NlbHRpY3Nfcm9zdGVyLmpzb24nLFxuICAgICAgICBhd2F5Um9zdGVyOiBmdW5jdGlvbihhd2F5VG4pe1xuICAgICAgICAgICAgcmV0dXJuICdodHRwOi8vZGF0YS5uYmEuY29tL2RhdGEvdjIwMTUvanNvbi9tb2JpbGVfdGVhbXMvbmJhLzIwMTcvdGVhbXMvJyArIGF3YXlUbiArICdfcm9zdGVyLmpzb24nO1xuICAgICAgICB9LFxuICAgICAgICBiaW9EYXRhOiAnaHR0cDovL2lvLmNubi5uZXQvbmJhL25iYS8uZWxlbWVudC9tZWRpYS8yLjAvdGVhbXNpdGVzL2NlbHRpY3MvanNvbi9iaW8tZGF0YS5qc29uJyxcbiAgICAgICAgcGxheWVyY2FyZDogZnVuY3Rpb24ocGlkKXtcbiAgICAgICAgICAgIHJldHVybiAnaHR0cDovL2RhdGEubmJhLmNvbS9kYXRhL3YyMDE1L2pzb24vbW9iaWxlX3RlYW1zL25iYS8yMDE3L3BsYXllcnMvcGxheWVyY2FyZF8nICsgcGlkICsgJ18wMi5qc29uJztcbiAgICAgICAgfSxcbiAgICAgICAgcGxheWVyY2FyZEF3YXk6IGZ1bmN0aW9uKHBpZCl7XG4gICAgICAgICAgICByZXR1cm4gJ2h0dHA6Ly9kYXRhLm5iYS5jb20vZGF0YS92MjAxNS9qc29uL21vYmlsZV90ZWFtcy9uYmEvMjAxNy9wbGF5ZXJzL3BsYXllcmNhcmRfJyArIHBpZCArICdfMDIuanNvbic7XG4gICAgICAgIH0sXG4gICAgICAgIGdhbWVkZXRhaWw6IGZ1bmN0aW9uKGdpZCkge1xuICAgICAgICAgICAgcmV0dXJuICdodHRwOi8vZGF0YS5uYmEuY29tL2RhdGEvdjIwMTUvanNvbi9tb2JpbGVfdGVhbXMvbmJhLzIwMTcvc2NvcmVzL2dhbWVkZXRhaWwvJyArIGdpZCArICdfZ2FtZWRldGFpbC5qc29uJztcbiAgICAgICAgfSxcbiAgICAgICAgc3RhbmRpbmdzOiAnaHR0cDovL2RhdGEubmJhLmNvbS9kYXRhL3YyMDE1L2pzb24vbW9iaWxlX3RlYW1zL25iYS8yMDE3LzAwX3N0YW5kaW5ncy5qc29uJyxcbiAgICAgICAgbGVhZ3VlTGVhZGVyczogJ2h0dHA6Ly9zdGF0cy5uYmEuY29tL3N0YXRzL2hvbWVwYWdldjI/R2FtZVNjb3BlPVNlYXNvbiZMZWFndWVJRD0wMCZQbGF5ZXJPclRlYW09UGxheWVyJlBsYXllclNjb3BlPUFsbCtQbGF5ZXJzJlNlYXNvbj0yMDE3LTE4JlNlYXNvblR5cGU9UmVndWxhcitTZWFzb24mU3RhdFR5cGU9VHJhZGl0aW9uYWwmY2FsbGJhY2s9PydcbiAgICB9O1xufVxuZWxzZSB7XG4gICAgdmFyIGZlZWRzID0ge1xuICAgICAgICB0b2RheXNTY29yZXM6ICdodHRwOi8vbG9jYWxob3N0Ojg4ODgvZGF0YS9tb2JpbGUtc3RhdHMtZmVlZC90b2RheXNfc2NvcmVzLmpzb24nLFxuICAgICAgICBjZWx0aWNzUm9zdGVyOiAnaHR0cDovL2xvY2FsaG9zdDo4ODg4L2RhdGEvbW9iaWxlLXN0YXRzLWZlZWQvY2VsdGljc19yb3N0ZXIuanNvbicsXG4gICAgICAgIGF3YXlSb3N0ZXI6IGZ1bmN0aW9uKGF3YXlUbikge1xuICAgICAgICAgICAgcmV0dXJuICdodHRwOi8vbG9jYWxob3N0Ojg4ODgvZGF0YS9tb2JpbGUtc3RhdHMtZmVlZC9hd2F5X3Jvc3Rlci5qc29uJztcbiAgICAgICAgfSxcbiAgICAgICAgYmlvRGF0YTogJ2h0dHA6Ly9sb2NhbGhvc3Q6ODg4OC9kYXRhL2Jpby1kYXRhLmpzb24nLFxuICAgICAgICBwbGF5ZXJjYXJkOiBmdW5jdGlvbihwaWQpIHtcbiAgICAgICAgICAgIHJldHVybiAnaHR0cDovL2xvY2FsaG9zdDo4ODg4L2RhdGEvbW9iaWxlLXN0YXRzLWZlZWQvcGxheWVyY2FyZHMvcGxheWVyY2FyZC0nICsgcGlkICsgJy5qc29uJztcbiAgICAgICAgfSxcbiAgICAgICAgcGxheWVyY2FyZEF3YXk6IGZ1bmN0aW9uKHBpZCkge1xuICAgICAgICAgICAgcmV0dXJuICdodHRwOi8vbG9jYWxob3N0Ojg4ODgvZGF0YS9tb2JpbGUtc3RhdHMtZmVlZC9wbGF5ZXJjYXJkcy9wbGF5ZXJjYXJkLTIwMjMzMC5qc29uJztcbiAgICAgICAgfSxcbiAgICAgICAgZ2FtZWRldGFpbDogZnVuY3Rpb24oZ2lkKSB7XG4gICAgICAgICAgICByZXR1cm4gJ2h0dHA6Ly9sb2NhbGhvc3Q6ODg4OC9kYXRhL21vYmlsZS1zdGF0cy1mZWVkL2dhbWVkZXRhaWwuanNvbic7XG4gICAgICAgIH0sXG4gICAgICAgIHN0YW5kaW5nczogJ2h0dHA6Ly9sb2NhbGhvc3Q6ODg4OC9kYXRhL21vYmlsZS1zdGF0cy1mZWVkL3N0YW5kaW5ncy5qc29uJyxcbiAgICAgICAgbGVhZ3VlTGVhZGVyczogJ2h0dHA6Ly9sb2NhbGhvc3Q6ODg4OC9kYXRhL2xlYWd1ZV9sZWFkZXJzLmpzb24nXG4gICAgfTtcbn1cblxudmFyIGdhbWVTdGFydGVkID0gZmFsc2U7XG5sZXQgcGxheWVyU3BvdGxpZ2h0Q291bnRlciA9IDE7XG5qUXVlcnkoZG9jdW1lbnQpLnJlYWR5KGZ1bmN0aW9uKCkge1xuICAgIHZhciBnaWQgPSAnJztcbiAgICB2YXIgYXdheVRlYW0gPSAnJztcbiAgICB2YXIgYXdheVRuID0gJyc7XG4gICAgdmFyIGRhdGUgPSBuZXcgRGF0ZSgpO1xuICAgIHZhciBsZWZ0V3JhcENvdW50ZXIgPSBmYWxzZTtcbiAgICBqUXVlcnkuYWpheCh7XG4gICAgICAgIHVybDogZmVlZHMudG9kYXlzU2NvcmVzLFxuICAgICAgICBhc3luYzogZmFsc2UsXG4gICAgICAgIHN1Y2Nlc3M6IGZ1bmN0aW9uKHRvZGF5c1Njb3Jlc0RhdGEpIHtcbiAgICAgICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgdG9kYXlzU2NvcmVzRGF0YS5ncy5nLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICAgICAgaWYgKHRvZGF5c1Njb3Jlc0RhdGEuZ3MuZ1tpXS5oLnRhID09ICdDSEEnKSB7IC8vQ0hBTkdFIFRISVNcbiAgICAgICAgICAgICAgICAgICAgYXdheVRlYW0gPSB0b2RheXNTY29yZXNEYXRhLmdzLmdbaV0udi50YTtcbiAgICAgICAgICAgICAgICAgICAgYXdheVRuID0gdG9kYXlzU2NvcmVzRGF0YS5ncy5nW2ldLnYudG4udG9Mb3dlckNhc2UoKTtcbiAgICAgICAgICAgICAgICAgICAgZ2lkID0gdG9kYXlzU2NvcmVzRGF0YS5ncy5nW2ldLmdpZDtcbiAgICAgICAgICAgICAgICAgICAgbG9hZFJvc3RlckRhdGEoYXdheVRlYW0sIGF3YXlUbik7XG4gICAgICAgICAgICAgICAgICAgIHNjb3Jlc0luaXQodG9kYXlzU2NvcmVzRGF0YSk7XG4gICAgICAgICAgICAgICAgICAgIHN0YW5kaW5nc0luaXQoYXdheVRlYW0pO1xuICAgICAgICAgICAgICAgICAgICBsZWFndWVMZWFkZXJzKCk7XG4gICAgICAgICAgICAgICAgICAgIGxlZnRXcmFwKCk7XG4gICAgICAgICAgICAgICAgICAgIC8vIFRSQU5TSVRJT05TXG4gICAgICAgICAgICAgICAgICAgIGZ1bmN0aW9uIGN5Y2xlKCkge1xuLyogICAgICAgICAgICAgICAgICAgICAgICBtb2JpbGVBcHAoKTsgLy8gRFVSQVRJT046IDI1MDAwXG4gICAgICAgICAgICAgICAgICAgICAgICBzZXRUaW1lb3V0KGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGxlYWRlcnMoZ2lkKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH0sIDI1MDAwKTsgLy8gRFVSQVRJT046IDQ0MTAwXG4gICAgICAgICAgICAgICAgICAgICAgICBzZXRUaW1lb3V0KHNvY2lhbCwgNjkwMDApOyAvL0RVUkFUSU9OOiAxNTAwMDAqL1xuICAgICAgICAgICAgICAgICAgICAgICAgc2V0VGltZW91dChmdW5jdGlvbigpe1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHBsYXllclNwb3RsaWdodChyb3N0ZXJPYmopO1xuICAgICAgICAgICAgICAgICAgICAgICAgfSwgMTAwMCk7IC8vRFVSQVRJT046IDkwMDAuLi5cbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICBjeWNsZSgpO1xuLyogICAgICAgICAgICAgICAgICAgIHNldEludGVydmFsKGN5Y2xlLCA5MTAwMCk7Ki9cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9KTtcbn0pO1xuXG5mdW5jdGlvbiBjeWNsZSgpIHt9XG4vKj09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG49ICAgICAgICAgICAgTUlTQyBGVU5DVElPTlMgICAgICAgICAgICA9XG49PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PSovXG5mdW5jdGlvbiBwbGF5ZXJBZ2UoZG9iKSB7XG4gICAgdmFyIHRvZGF5ID0gbmV3IERhdGUoKTtcbiAgICB2YXIgYmlydGhEYXRlID0gbmV3IERhdGUoZG9iKTtcbiAgICB2YXIgYWdlID0gdG9kYXkuZ2V0RnVsbFllYXIoKSAtIGJpcnRoRGF0ZS5nZXRGdWxsWWVhcigpO1xuICAgIHJldHVybiBhZ2U7XG59XG5cbmZ1bmN0aW9uIGdlbmVyYXRlVGltZWxpbmUoc2VsZWN0ZWRQbGF5ZXIpIHtcbiAgICAvLyBBUFBFTkQ6IFRJTUVMSU5FXG4gICAgdmFyIHNlYXNvbnNQbGF5ZWQgPSByb3N0ZXJPYmouY2VsdGljcy5yb3N0ZXJbc2VsZWN0ZWRQbGF5ZXJdLnN0YXRzLnNhLmxlbmd0aDtcbiAgICB2YXIgdGltZWxpbmVIVE1MID0gJyc7XG4gICAgdmFyIHNlYXNvblllYXJIVE1MID0gJyc7XG4gICAgZm9yICh2YXIgaSA9IDA7IGkgPCBzZWFzb25zUGxheWVkOyBpKyspIHtcbiAgICAgICAgdmFyIHRlYW1BYmJyZXZpYXRpb24gPSByb3N0ZXJPYmouY2VsdGljcy5yb3N0ZXJbc2VsZWN0ZWRQbGF5ZXJdLnN0YXRzLnNhW2ldLnRhO1xuICAgICAgICB2YXIgdHJhZGVkID0gcm9zdGVyT2JqLmNlbHRpY3Mucm9zdGVyW3NlbGVjdGVkUGxheWVyXS5zdGF0cy5zYVtpXS5zcGwubGVuZ3RoO1xuICAgICAgICB2YXIgc2VnbWVudElubmVyID0gXCJcIjtcbiAgICAgICAgdmFyIHRpdGxlID0gXCJcIjtcbiAgICAgICAgdmFyIHNlYXNvblllYXJUZXh0ID0gcm9zdGVyT2JqLmNlbHRpY3Mucm9zdGVyW3NlbGVjdGVkUGxheWVyXS5zdGF0cy5zYVtpXS52YWw7XG4gICAgICAgIGlmIChpID09PSAwIHx8IHRlYW1BYmJyZXZpYXRpb24gIT09IHJvc3Rlck9iai5jZWx0aWNzLnJvc3RlcltzZWxlY3RlZFBsYXllcl0uc3RhdHMuc2FbaSAtIDFdLnRhKSB7IC8vIElmIHRoaXMgaXMgYSBuZXcgdGVhbSwgc3RhcnQgdGhlIHRlYW0gd3JhcC5cbiAgICAgICAgICAgIHRpdGxlID0gdGVhbUFiYnJldmlhdGlvbjtcbiAgICAgICAgfVxuICAgICAgICBpZiAodHJhZGVkKSB7XG4gICAgICAgICAgICBmb3IgKHZhciB4ID0gMDsgeCA8IHRyYWRlZDsgeCsrKSB7XG4gICAgICAgICAgICAgICAgdmFyIGdwVG90ID0gcm9zdGVyT2JqLmNlbHRpY3Mucm9zdGVyW3NlbGVjdGVkUGxheWVyXS5zdGF0cy5zYVtpXS5ncDtcbiAgICAgICAgICAgICAgICB2YXIgZ3AgPSByb3N0ZXJPYmouY2VsdGljcy5yb3N0ZXJbc2VsZWN0ZWRQbGF5ZXJdLnN0YXRzLnNhW2ldLnNwbFt4XS5ncDtcbiAgICAgICAgICAgICAgICB2YXIgZ3BQZXJjZW50YWdlID0gTWF0aC5yb3VuZCgoZ3AgLyBncFRvdCkgKiAxMDApO1xuICAgICAgICAgICAgICAgIHRlYW1BYmJyZXZpYXRpb24gPSByb3N0ZXJPYmouY2VsdGljcy5yb3N0ZXJbc2VsZWN0ZWRQbGF5ZXJdLnN0YXRzLnNhW2ldLnNwbFt4XS50YTtcbiAgICAgICAgICAgICAgICBpZiAoaSA9PT0gMCB8fCB0ZWFtQWJicmV2aWF0aW9uICE9PSByb3N0ZXJPYmouY2VsdGljcy5yb3N0ZXJbc2VsZWN0ZWRQbGF5ZXJdLnN0YXRzLnNhW2kgLSAxXS50YSAmJiB0ZWFtQWJicmV2aWF0aW9uICE9PSByb3N0ZXJPYmouY2VsdGljcy5yb3N0ZXJbc2VsZWN0ZWRQbGF5ZXJdLnN0YXRzLnNhW2kgKyAxXS50YSkgeyAvLyBJZiB0aGlzIGlzIGEgbmV3IHRlYW0sIHN0YXJ0IHRoZSB0ZWFtIHdyYXAuXG4gICAgICAgICAgICAgICAgICAgIHRpdGxlID0gdGVhbUFiYnJldmlhdGlvbjtcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICB0aXRsZSA9IFwiXCI7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIHNlZ21lbnRJbm5lciArPSAnPGRpdiBkYXRhLXNlYXNvbi15ZWFyPVwiJyArIHNlYXNvblllYXJUZXh0ICsgJ1wiIGRhdGEtdGVhbT1cIicgKyB0ZWFtQWJicmV2aWF0aW9uICsgJ1wiIHN0eWxlPVwiXCIgY2xhc3M9XCJzZWdtZW50LWlubmVyICcgKyB0ZWFtQWJicmV2aWF0aW9uICsgJy1iZ1wiPjxwPicgKyB0aXRsZSArICc8L3A+PC9kaXY+JztcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHNlZ21lbnRJbm5lciA9ICc8ZGl2IGRhdGEtc2Vhc29uLXllYXI9XCInICsgc2Vhc29uWWVhclRleHQgKyAnXCIgZGF0YS10ZWFtPVwiJyArIHRlYW1BYmJyZXZpYXRpb24gKyAnXCIgY2xhc3M9XCJzZWdtZW50LWlubmVyICcgKyB0ZWFtQWJicmV2aWF0aW9uICsgJy1iZ1wiPjxwPicgKyB0aXRsZSArICc8L3A+PC9kaXY+JztcbiAgICAgICAgfVxuICAgICAgICB0aW1lbGluZUhUTUwgKz0gJzxkaXYgY2xhc3M9XCJzZWdtZW50XCI+JyArIHNlZ21lbnRJbm5lciArICc8L2Rpdj4nO1xuICAgICAgICBzZWFzb25ZZWFySFRNTCArPSAnPGRpdiBjbGFzcz1cInNlZ21lbnRcIj48cD4nICsgc2Vhc29uWWVhclRleHQgKyAnPC9wPjwvZGl2Pic7XG4gICAgfVxuICAgIGpRdWVyeShcIi50aW1lbGluZS13cmFwXCIpLmh0bWwoJzxkaXYgY2xhc3M9XCJ0aW1lbGluZSBhcHBlbmRlZFwiPicgKyB0aW1lbGluZUhUTUwgKyAnPC9kaXY+PGRpdiBjbGFzcz1cInNlYXNvbi15ZWFyIGFwcGVuZGVkXCI+JyArIHNlYXNvblllYXJIVE1MICsgJzwvZGl2PicpO1xufVxuXG5mdW5jdGlvbiBjcmVhdGVJbmRleChrZXlzLCBhcnJheSkge1xuICAgIHZhciBuZXdBcnIgPSBrZXlzLm1hcChpdGVtID0+IGFycmF5LmluZGV4T2YoaXRlbSkpO1xuICAgIHJldHVybiBuZXdBcnI7XG59XG5cbmZ1bmN0aW9uIHJvdW5kKG51bWJlcikge1xuICAgIGlmICh0eXBlb2YgbnVtYmVyICE9PSBcIm51bWJlclwiIHx8IG51bWJlciA9PSB1bmRlZmluZWQpIHtcbiAgICAgICAgcmV0dXJuIG51bWJlcjtcbiAgICB9IGVsc2Uge1xuICAgICAgICByZXR1cm4gbnVtYmVyLnRvRml4ZWQoMSk7XG4gICAgfVxufVxuLyo9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG49ICAgICAgICAgICAgSU5JVElBTElaRSAgICAgICAgICAgID1cbj09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT0qL1xuZnVuY3Rpb24gY2hlY2tHYW1lU3RhdHVzKCkge1xuICAgIHZhciBjaGVjayA9IGZhbHNlO1xuICAgIGlmICghZ2FtZVN0YXJ0ZWQpIHtcbiAgICAgICAgalF1ZXJ5LmFqYXgoe1xuICAgICAgICAgICAgdXJsOiBmZWVkcy50b2RheXNTY29yZXMsXG4gICAgICAgICAgICBhc3luYzogZmFsc2UsXG4gICAgICAgICAgICBzdWNjZXNzOiBmdW5jdGlvbihkYXRhZGF0YSkge1xuICAgICAgICAgICAgICAgIHZhciBnaWQgPSAnJztcbiAgICAgICAgICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IDU7IGkrKykge1xuICAgICAgICAgICAgICAgICAgICBpZiAoZGF0YWRhdGEuZ3MuZ1tpXS5oLnRhID09ICdDSEEnICYmIGRhdGFkYXRhLmdzLmdbaV0uc3QgIT09IFwiMVwiKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBjaGVjayA9IHRydWU7XG4gICAgICAgICAgICAgICAgICAgICAgICBnYW1lU3RhcnRlZCA9IHRydWU7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgIH1cbiAgICByZXR1cm4gY2hlY2s7XG59O1xuLyo9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbj0gICAgICAgICAgICBMT0FEIFJPU1RFUiBJTkZPIChidWlsZCByb3N0ZXJPYmopICAgICAgICAgICAgICA9XG49PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT0qL1xuZnVuY3Rpb24gbG9hZFJvc3RlckRhdGEoYXdheVRlYW0sIGF3YXlUbikge1xuICAgIHZhciByb3N0ZXIgPSAnJztcbiAgICBqUXVlcnkuYWpheCh7XG4gICAgICAgIHVybDogZmVlZHMuY2VsdGljc1Jvc3RlcixcbiAgICAgICAgYXN5bmM6IGZhbHNlLFxuICAgICAgICBzdWNjZXNzOiBmdW5jdGlvbihkYXRhKSB7XG4gICAgICAgICAgICByb3N0ZXIgPSBkYXRhO1xuICAgICAgICAgICAgZm9yICh2YXIgcHJvcGVydHkgaW4gcm9zdGVyLnQpIHtcbiAgICAgICAgICAgICAgICBpZiAocHJvcGVydHkgIT09ICdwbCcpIHtcbiAgICAgICAgICAgICAgICAgICAgcm9zdGVyT2JqLmNlbHRpY3NbcHJvcGVydHldID0gcm9zdGVyLnRbcHJvcGVydHldO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfSxcbiAgICAgICAgZXJyb3I6IGZ1bmN0aW9uKCkge31cbiAgICB9KTtcbiAgICB2YXIgYXdheVJvc3RlciA9ICcnO1xuICAgIGpRdWVyeS5hamF4KHtcbiAgICAgICAgdXJsOiBmZWVkcy5hd2F5Um9zdGVyKGF3YXlUbiksXG4gICAgICAgIGFzeW5jOiBmYWxzZSxcbiAgICAgICAgc3VjY2VzczogZnVuY3Rpb24oZGF0YSkge1xuICAgICAgICAgICAgYXdheVJvc3RlciA9IGRhdGE7XG4gICAgICAgICAgICBmb3IgKHZhciBwcm9wZXJ0eSBpbiBhd2F5Um9zdGVyLnQpIHtcbiAgICAgICAgICAgICAgICBpZiAocHJvcGVydHkgIT09ICdwbCcpIHtcbiAgICAgICAgICAgICAgICAgICAgcm9zdGVyT2JqLmF3YXlbcHJvcGVydHldID0gYXdheVJvc3Rlci50W3Byb3BlcnR5XTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH0sXG4gICAgICAgIGVycm9yOiBmdW5jdGlvbigpIHt9XG4gICAgfSk7XG4gICAgdmFyIGJpb0RhdGEgPSAnJztcbiAgICBqUXVlcnkuYWpheCh7XG4gICAgICAgIHVybDogZmVlZHMuYmlvRGF0YSxcbiAgICAgICAgYXN5bmM6IGZhbHNlLFxuICAgICAgICBzdWNjZXNzOiBmdW5jdGlvbihkYXRhKSB7XG4gICAgICAgICAgICBiaW9EYXRhID0gZGF0YTtcbiAgICAgICAgfSxcbiAgICAgICAgZXJyb3I6IGZ1bmN0aW9uKCkge31cbiAgICB9KTtcbiAgICBmb3IgKHZhciBpID0gMDsgaSA8IHJvc3Rlci50LnBsLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgIHZhciBwaWQgPSByb3N0ZXIudC5wbFtpXS5waWQ7XG4gICAgICAgIHJvc3Rlck9iai5jZWx0aWNzLnJvc3RlcltwaWRdID0gcm9zdGVyLnQucGxbaV07XG4gICAgICAgIGZvciAodmFyIHByb3BlcnR5IGluIGJpb0RhdGFbcGlkXSkge1xuICAgICAgICAgICAgcm9zdGVyT2JqLmNlbHRpY3Mucm9zdGVyW3BpZF0uYmlvID0gYmlvRGF0YVtwaWRdO1xuICAgICAgICB9O1xuICAgICAgICBqUXVlcnkuYWpheCh7XG4gICAgICAgICAgICB1cmw6IGZlZWRzLnBsYXllcmNhcmQocGlkKSxcbiAgICAgICAgICAgIGFzeW5jOiBmYWxzZSxcbiAgICAgICAgICAgIHN1Y2Nlc3M6IGZ1bmN0aW9uKGRhdGEpIHtcbiAgICAgICAgICAgICAgICBpZiAoZGF0YS5wbC5jYS5oYXNPd25Qcm9wZXJ0eSgnc2EnKSkge1xuICAgICAgICAgICAgICAgICAgICByb3N0ZXJPYmouY2VsdGljcy5yb3N0ZXJbcGlkXS5zdGF0cyA9IGRhdGEucGwuY2Euc2FbKGRhdGEucGwuY2Euc2EubGVuZ3RoIC0gMSldO1xuICAgICAgICAgICAgICAgICAgICByb3N0ZXJPYmouY2VsdGljcy5yb3N0ZXJbcGlkXS5zdGF0cy5zYSA9IGRhdGEucGwuY2Euc2E7XG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgcm9zdGVyT2JqLmNlbHRpY3Mucm9zdGVyW3BpZF0uc3RhdHMgPSBkYXRhLnBsLmNhO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBlcnJvcjogZnVuY3Rpb24oKSB7fVxuICAgICAgICB9KTtcbiAgICB9XG4gICAgZm9yICh2YXIgaSA9IDA7IGkgPCBhd2F5Um9zdGVyLnQucGwubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgdmFyIHBpZCA9IGF3YXlSb3N0ZXIudC5wbFtpXS5waWQ7XG4gICAgICAgIHJvc3Rlck9iai5hd2F5LnJvc3RlcltwaWRdID0gYXdheVJvc3Rlci50LnBsW2ldO1xuICAgICAgICBqUXVlcnkuYWpheCh7XG4gICAgICAgICAgICB1cmw6IGZlZWRzLnBsYXllcmNhcmRBd2F5KHBpZCksIC8vIENIQU5HRSBQSURcbiAgICAgICAgICAgIGFzeW5jOiBmYWxzZSxcbiAgICAgICAgICAgIHN1Y2Nlc3M6IGZ1bmN0aW9uKGRhdGEpIHtcbiAgICAgICAgICAgICAgICBpZiAoZGF0YS5wbC5jYS5oYXNPd25Qcm9wZXJ0eSgnc2EnKSkge1xuICAgICAgICAgICAgICAgICAgICByb3N0ZXJPYmouYXdheS5yb3N0ZXJbcGlkXS5zdGF0cyA9IGRhdGEucGwuY2Euc2FbKGRhdGEucGwuY2Euc2EubGVuZ3RoIC0gMSldO1xuICAgICAgICAgICAgICAgICAgICByb3N0ZXJPYmouYXdheS5yb3N0ZXJbcGlkXS5zdGF0cy5zYSA9IGRhdGEucGwuY2Euc2E7XG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgcm9zdGVyT2JqLmF3YXkucm9zdGVyW3BpZF0uc3RhdHMgPSBkYXRhLnBsLmNhO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBlcnJvcjogZnVuY3Rpb24oKSB7fVxuICAgICAgICB9KTtcbiAgICB9XG4gICAgZm9yICh2YXIgdGVhbSBpbiByb3N0ZXJPYmopIHtcbiAgICAgICAgZm9yICh2YXIgcGxheWVyIGluIHJvc3Rlck9ialt0ZWFtXS5yb3N0ZXIpIHtcbiAgICAgICAgICAgIGZvciAodmFyIHN0YXQgaW4gcm9zdGVyT2JqW3RlYW1dLmxlYWRlcnMpIHtcbiAgICAgICAgICAgICAgICByb3N0ZXJPYmpbdGVhbV0ubGVhZGVyc1tzdGF0XS5wdXNoKFtyb3N0ZXJPYmpbdGVhbV0ucm9zdGVyW3BsYXllcl0uZm4udG9VcHBlckNhc2UoKSwgcm9zdGVyT2JqW3RlYW1dLnJvc3RlcltwbGF5ZXJdLmxuLnRvVXBwZXJDYXNlKCksIHJvc3Rlck9ialt0ZWFtXS5yb3N0ZXJbcGxheWVyXS5zdGF0c1tzdGF0XSwgcm9zdGVyT2JqW3RlYW1dLnJvc3RlcltwbGF5ZXJdLnBpZF0pO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxuICAgIGZvciAodmFyIHRlYW0gaW4gcm9zdGVyT2JqKSB7XG4gICAgICAgIGZvciAodmFyIHN0YXQgaW4gcm9zdGVyT2JqW3RlYW1dLmxlYWRlcnMpIHtcbiAgICAgICAgICAgIHJvc3Rlck9ialt0ZWFtXS5sZWFkZXJzW3N0YXRdLnNvcnQoZnVuY3Rpb24oYSwgYikge1xuICAgICAgICAgICAgICAgIHJldHVybiBiWzJdIC0gYVsyXTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9XG4gICAgfVxuICAgIGNvbnNvbGUubG9nKCdTT1JURUQ6Jyk7XG4gICAgY29uc29sZS5sb2cocm9zdGVyT2JqKTtcbn07XG5cbmZ1bmN0aW9uIHN0YXRzTm90QXZhaWxhYmxlKHBpZCkge1xuICAgIHJvc3Rlck9ialtwaWRdLnN0YXRzID0ge307XG4gICAgcm9zdGVyT2JqW3BpZF0uc3RhdHMuc2EgPSBbe31dO1xuICAgIHJvc3Rlck9ialtwaWRdLnN0YXRzLmhhc1N0YXRzID0gZmFsc2U7XG4gICAgdmFyIGNhSW5kZXggPSBbJ2dwJywgJ2dzJywgJ21pbicsICdmZ3AnLCAndHBwJywgJ2Z0cCcsICdvcmViJywgJ2RyZWInLCAncmViJywgJ2FzdCcsICdzdGwnLCAnYmxrJywgJ3RvdicsICdwZicsICdwdHMnLCAnbm9zdGF0cyddO1xuICAgIHZhciBzYUluZGV4ID0gWyd0aWQnLCAndmFsJywgJ2dwJywgJ2dzJywgJ21pbicsICdmZ3AnLCAndHBwJywgJ2Z0cCcsICdvcmViJywgJ2RyZWInLCAncmViJywgJ2FzdCcsICdzdGwnLCAnYmxrJywgJ3RvdicsICdwZicsICdwdHMnLCAnc3BsJywgJ3RhJywgJ3RuJywgJ3RjJ107XG4gICAgZm9yICh2YXIgaSA9IDA7IGkgPCBzYUluZGV4Lmxlbmd0aDsgaSsrKSB7XG4gICAgICAgIHJvc3Rlck9ialtwaWRdLnN0YXRzLnNhWzBdW3NhSW5kZXhbaV1dID0gXCJOL0FcIjtcbiAgICAgICAgaWYgKGkgPT09IDEpIHtcbiAgICAgICAgICAgIHJvc3Rlck9ialtwaWRdLnN0YXRzLnNhWzBdW3NhSW5kZXhbaV1dID0gcGxheWVyQ2FyZFllYXIudG9TdHJpbmcoKS5zdWJzdHIoMiwgMikgKyBcIi1cIiArIChwbGF5ZXJDYXJkWWVhciArIDEpLnRvU3RyaW5nKCkuc3Vic3RyKDIsIDIpO1xuICAgICAgICB9XG4gICAgICAgIGlmIChpID09PSAxNykge1xuICAgICAgICAgICAgcm9zdGVyT2JqW3BpZF0uc3RhdHMuc2FbMF1bc2FJbmRleFtpXV0gPSBbXTtcbiAgICAgICAgfVxuICAgICAgICBpZiAoaSA9PT0gMTgpIHtcbiAgICAgICAgICAgIHJvc3Rlck9ialtwaWRdLnN0YXRzLnNhWzBdW3NhSW5kZXhbaV1dID0gJ0NIQSc7XG4gICAgICAgIH1cbiAgICB9XG4gICAgZm9yICh2YXIgaSA9IDA7IGkgPCBjYUluZGV4Lmxlbmd0aDsgaSsrKSB7XG4gICAgICAgIHJvc3Rlck9ialtwaWRdLnN0YXRzW2NhSW5kZXhbaV1dID0gXCJOL0FcIjtcbiAgICAgICAgaWYgKGkgPT09IDE1KSB7XG4gICAgICAgICAgICByb3N0ZXJPYmpbcGlkXS5zdGF0c1tjYUluZGV4W2ldXSA9IHRydWU7XG4gICAgICAgIH1cbiAgICB9XG59O1xuXG5mdW5jdGlvbiBsb2FkR2FtZURldGFpbChnaWQpIHt9O1xuXG5mdW5jdGlvbiBsb2FkQXdheVRlYW1EYXRhKCkge31cbi8qPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuPSAgICAgICAgICAgIFJJR0hUIFdSQVAgICAgICAgICAgICA9XG49PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09Ki9cbmZ1bmN0aW9uIHBsYXllclNwb3RsaWdodChyb3N0ZXJPYmopIHtcbiAgICAvKiAxIC0gV0hJVEUgTElORSBIT1JJWlRPTkFMICovXG4gICAgc2V0VGltZW91dChmdW5jdGlvbigpIHtcbiAgICAgICAgalF1ZXJ5KCcud2hpdGUtbGluZS5ob3Jpem9udGFsJykuYWRkQ2xhc3MoJ3RyYW5zaXRpb24tMScpO1xuICAgIH0sIDUwMCk7XG4gICAgc2V0VGltZW91dChmdW5jdGlvbigpIHtcbiAgICAgICAgalF1ZXJ5KCcuc29jaWFsLXRvcCAud2hpdGUtbGluZS52ZXJ0aWNhbDpudGgtY2hpbGQob2RkKScpLmFkZENsYXNzKCd0cmFuc2l0aW9uLTEnKTtcbiAgICAgICAgalF1ZXJ5KCcuc29jaWFsLWJvdHRvbSAud2hpdGUtbGluZS52ZXJ0aWNhbDpudGgtY2hpbGQoZXZlbiknKS5hZGRDbGFzcygndHJhbnNpdGlvbi0xJyk7XG4gICAgfSwgODAwKTtcbiAgICAvKiAyYiAtIFdISVRFIExJTkUgVkVSVElDQUwgKi9cbiAgICBzZXRUaW1lb3V0KGZ1bmN0aW9uKCkge1xuICAgICAgICBqUXVlcnkoJy5zb2NpYWwtdG9wIC53aGl0ZS1saW5lLnZlcnRpY2FsOm50aC1jaGlsZChldmVuKScpLmFkZENsYXNzKCd0cmFuc2l0aW9uLTEnKTtcbiAgICAgICAgalF1ZXJ5KCcuc29jaWFsLWJvdHRvbSAud2hpdGUtbGluZS52ZXJ0aWNhbDpudGgtY2hpbGQob2RkKScpLmFkZENsYXNzKCd0cmFuc2l0aW9uLTEnKTtcbiAgICB9LCAxMDAwKTtcbiAgICAvKiAzIC0gR0VORVJBVEUgQU5EIFJFVkVBTCBQTEFZRVIgQk9YRVMgKi9cbiAgICBzZXRUaW1lb3V0KGZ1bmN0aW9uKCkge1xuICAgICAgICBqUXVlcnkoJy5zb2NpYWwtdG9wLCAuc29jaWFsLWJvdHRvbScpLmFkZENsYXNzKCd0cmFuc2l0aW9uLTEnKTtcbiAgICAgICAgalF1ZXJ5KCcucGxheWVyLWJveC13cmFwJykuYWRkQ2xhc3MoJ3RyYW5zaXRpb24tMScpO1xuICAgIH0sIDEyMDApO1xuICAgIC8qIDQgLSBBUFBFTkQgSEVBRFNIT1RTICovXG4gICAgc2V0VGltZW91dChmdW5jdGlvbigpIHtcbiAgICAgICAgalF1ZXJ5KCcucGxheWVyLWJveC13cmFwJykuYWRkQ2xhc3MoJ3RyYW5zaXRpb24tMicpO1xuICAgICAgICBqUXVlcnkoJy5wbGF5ZXItYm94JykuYWRkQ2xhc3MoJ3RyYW5zaXRpb24tMScpO1xuICAgICAgICB2YXIgZGVsYXkgPSAwO1xuICAgICAgICB2YXIgZm9yaW5Db3VudGVyID0gMDtcbiAgICAgICAgZm9yICh2YXIgcGxheWVyIGluIHJvc3Rlck9iai5jZWx0aWNzLnJvc3Rlcikge1xuICAgICAgICAgICAgdmFyIGhlYWRzaG90ID0gJ2h0dHBzOi8vYWstc3RhdGljLmNtcy5uYmEuY29tL3dwLWNvbnRlbnQvdXBsb2Fkcy9oZWFkc2hvdHMvbmJhL2xhdGVzdC8xMDQweDc2MC8nICsgcm9zdGVyT2JqLmNlbHRpY3Mucm9zdGVyW3BsYXllcl0ucGlkICsgJy5wbmcnO1xuICAgICAgICAgICAgalF1ZXJ5KCcucGxheWVyLWJveDpudGgtY2hpbGQoJyArIChmb3JpbkNvdW50ZXIgKyAxKSArICcpJykuYXBwZW5kKCc8aW1nIGNsYXNzPVwiYXBwZW5kZWQgaGVhZHNob3RcIiBzcmM9XCInICsgaGVhZHNob3QgKyAnXCIvPicpO1xuICAgICAgICAgICAgalF1ZXJ5KCcucGxheWVyLWJveDpudGgtY2hpbGQoJyArIChmb3JpbkNvdW50ZXIgKyAxKSArICcpJykuYXR0cignZGF0YS1waWQnLCByb3N0ZXJPYmouY2VsdGljcy5yb3N0ZXJbcGxheWVyXS5waWQpO1xuICAgICAgICAgICAgalF1ZXJ5KCcucGxheWVyLWJveCBpbWcnKS5vbihcImVycm9yXCIsIGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgICAgIGpRdWVyeSh0aGlzKS5hdHRyKCdzcmMnLCAnaHR0cHM6Ly9pLmNkbi50dXJuZXIuY29tL25iYS9uYmEvLmVsZW1lbnQvbWVkaWEvMi4wL3RlYW1zaXRlcy9jZWx0aWNzL21lZGlhL2dlbmVyaWMtcGxheWVyLWxpZ2h0XzYwMHg0MzgucG5nJyk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIGpRdWVyeSgnLnBsYXllci1ib3g6bnRoLWNoaWxkKCcgKyAoZm9yaW5Db3VudGVyICsgMSkgKyAnKSBpbWcnKS5kZWxheShkZWxheSkuZmFkZVRvKDMwMCwgMSk7XG4gICAgICAgICAgICBkZWxheSArPSAzMDtcbiAgICAgICAgICAgIGZvcmluQ291bnRlcisrO1xuICAgICAgICB9XG4gICAgfSwgMTcwMCk7XG4gICAgLyogNSAtIFBMQVlFUiBTRUxFQ1QgKi9cbiAgICB2YXIgc2VsZWN0ZWRQbGF5ZXIgPSAnJztcbiAgICBzZXRUaW1lb3V0KGZ1bmN0aW9uKCkge1xuICAgICAgICBqUXVlcnkoJy5wbGF5ZXItYm94JykuYWRkQ2xhc3MoJ3RyYW5zaXRpb24tMicpO1xuICAgICAgICBqUXVlcnkoJy5wbGF5ZXItYm94Om50aC1jaGlsZCgnICsgKHBsYXllclNwb3RsaWdodENvdW50ZXIpICsgJyknKS5hZGRDbGFzcygnc2VsZWN0ZWQnKTtcbiAgICAgICAgc2VsZWN0ZWRQbGF5ZXIgPSBqUXVlcnkoJy5wbGF5ZXItYm94Om50aC1jaGlsZCgnICsgKHBsYXllclNwb3RsaWdodENvdW50ZXIpICsgJyknKS5hdHRyKCdkYXRhLXBpZCcpO1xuICAgICAgICBzZXRUaW1lb3V0KGZ1bmN0aW9uKCl7XG4gICAgICAgICAgICBqUXVlcnkoJy5wbGF5ZXItYm94Jykubm90KCcucmVwbGFjZW1lbnQuc2VsZWN0ZWQnKS5hZGRDbGFzcygndHJhbnNpdGlvbi00Jyk7XG4gICAgICAgIH0sNTAwKTtcbiAgICB9LCAzMDAwKTtcbiAgICAvKiA2IC0gUExBWUVSIEJPWCBFWFBBTkQgKi9cbiAgICBzZXRUaW1lb3V0KGZ1bmN0aW9uKCkge1xuICAgICAgICBqUXVlcnkoJy5ibG9jay13cmFwLnNvY2lhbCcpLmFkZENsYXNzKCd0cmFuc2l0aW9uLTMnKTtcbiAgICAgICAgalF1ZXJ5KCcucGxheWVyLWJveC5yZXBsYWNlbWVudC5zZWxlY3RlZCcpLmFkZENsYXNzKCd0cmFuc2l0aW9uLTMnKTtcbiAgICB9LCAzODAwKTtcbiAgICAvKiA3IC0gU1BPVExJR0hUIEhUTUwgKi9cbiAgICBzZXRUaW1lb3V0KGZ1bmN0aW9uKCkge1xuICAgICAgICBnZW5lcmF0ZVRpbWVsaW5lKHNlbGVjdGVkUGxheWVyKTtcbiAgICAgICAgalF1ZXJ5KCcucGxheWVyLWJveC5yZXBsYWNlbWVudC5zZWxlY3RlZCcpLmNsb25lKCkuYXBwZW5kVG8oJy5ibG9jay13cmFwLnBsYXllci1zcG90bGlnaHQgLnRvcC13cmFwJyk7XG4gICAgICAgIGpRdWVyeSgnLnBsYXllci1zcG90bGlnaHQgLnNlbGVjdGVkJykuYWRkQ2xhc3MoJy5hcHBlbmRlZCcpO1xuICAgICAgICBqUXVlcnkoJy5ibG9jay13cmFwLnBsYXllci1zcG90bGlnaHQnKS5hZGRDbGFzcygndHJhbnNpdGlvbi0xJyk7XG4gICAgICAgIGpRdWVyeSgnLmJsb2NrLXdyYXAuc29jaWFsJykuYWRkQ2xhc3MoJ3RyYW5zaXRpb24tMScpO1xuICAgICAgICB2YXIgc3RhdHMgPSByb3N0ZXJPYmouY2VsdGljcy5yb3N0ZXJbc2VsZWN0ZWRQbGF5ZXJdLnN0YXRzO1xuICAgICAgICBqUXVlcnkoJy5wbGF5ZXItc3BvdGxpZ2h0IC50b3Atd3JhcCAucGxheWVyLXRvcCcpLmFwcGVuZCgnPGltZyBjbGFzcz1cInNpbG8gYXBwZW5kZWRcIiBzcmM9XCJodHRwOi8vaW8uY25uLm5ldC9uYmEvbmJhLy5lbGVtZW50L21lZGlhLzIuMC90ZWFtc2l0ZXMvY2VsdGljcy9tZWRpYS9zaWxvLTQ2Nng1OTEtJyArIHJvc3Rlck9iai5jZWx0aWNzLnJvc3RlcltzZWxlY3RlZFBsYXllcl0ucGlkICsgJy5wbmdcIiAvPjxkaXYgY2xhc3M9XCJ0b3AgYXBwZW5kZWRcIj48ZGl2IGNsYXNzPVwicGxheWVyLW5hbWUtd3JhcFwiPjxwIGNsYXNzPVwicGxheWVyLW5hbWVcIj48c3Bhbj4nICsgcm9zdGVyT2JqLmNlbHRpY3Mucm9zdGVyW3NlbGVjdGVkUGxheWVyXS5mbi50b1VwcGVyQ2FzZSgpICsgJzwvc3Bhbj4gPGJyPiAnICsgcm9zdGVyT2JqLmNlbHRpY3Mucm9zdGVyW3NlbGVjdGVkUGxheWVyXS5sbi50b1VwcGVyQ2FzZSgpICsgJzwvcD48L2Rpdj48cCBjbGFzcz1cInBsYXllci1udW1iZXJcIj4nICsgcm9zdGVyT2JqLmNlbHRpY3Mucm9zdGVyW3NlbGVjdGVkUGxheWVyXS5udW0gKyAnPC9icj48c3Bhbj4nICsgcm9zdGVyT2JqLmNlbHRpY3Mucm9zdGVyW3NlbGVjdGVkUGxheWVyXS5wb3MgKyAnPC9zcGFuPjwvcD48L2Rpdj48ZGl2IGNsYXNzPVwibWlkZGxlIGFwcGVuZGVkXCI+PHVsIGNsYXNzPVwiaW5mbyBjbGVhcmZpeFwiPjxsaT48cD5BR0U8c3BhbiBjbGFzcz1cInNtLWhpZGVcIj46Jm5ic3A7PC9zcGFuPiA8L2JyPjxzcGFuIGNsYXNzPVwiaW5mby12YWx1ZVwiPicgKyBwbGF5ZXJBZ2Uocm9zdGVyT2JqLmNlbHRpY3Mucm9zdGVyW3NlbGVjdGVkUGxheWVyXS5kb2IpICsgJzwvc3Bhbj48L3A+PC9saT48bGk+PHA+SFQ8c3BhbiBjbGFzcz1cInNtLWhpZGVcIj46Jm5ic3A7PC9zcGFuPiA8L2JyPjxzcGFuIGNsYXNzPVwiaW5mby12YWx1ZVwiPicgKyByb3N0ZXJPYmouY2VsdGljcy5yb3N0ZXJbc2VsZWN0ZWRQbGF5ZXJdLmh0ICsgJzwvc3Bhbj48L3A+PC9saT48bGk+PHA+V1Q8c3BhbiBjbGFzcz1cInNtLWhpZGVcIj46Jm5ic3A7PC9zcGFuPiA8L2JyPjxzcGFuIGNsYXNzPVwiaW5mby12YWx1ZVwiPicgKyByb3N0ZXJPYmouY2VsdGljcy5yb3N0ZXJbc2VsZWN0ZWRQbGF5ZXJdLnd0ICsgJzwvc3Bhbj48L3A+PC9saT48L3VsPjwvZGl2PjxkaXYgY2xhc3M9XCJib3R0b20gZnVsbCBjbGVhcmZpeCBzbS1oaWRlIGFwcGVuZGVkXCI+PHRhYmxlIGNsYXNzPVwiYXZlcmFnZXNcIj48dHIgY2xhc3M9XCJhdmVyYWdlcy1sYWJlbHNcIj48dGQ+PHA+R1A8L3A+PC90ZD48dGQ+PHA+UFBHPC9wPjwvdGQ+PHRkPjxwPlJQRzwvcD48L3RkPjx0ZD48cD5BUEc8L3A+PC90ZD48L3RyPjx0ciBjbGFzcz1cImF2ZXJhZ2VzLXNlYXNvblwiPjx0ZCBjbGFzcz1cImdwXCI+PHA+PC9wPjwvdGQ+PHRkIGNsYXNzPVwicHRzXCI+PHA+PC9wPjwvdGQ+PHRkIGNsYXNzPVwicmViXCI+PHA+PC9wPjwvdGQ+PHRkIGNsYXNzPVwiYXN0XCI+PHA+PC9wPjwvdGQ+PC90cj48L3RhYmxlPjwvZGl2PicpO1xuICAgICAgICBqUXVlcnkoXCIucGxheWVyLXNwb3RsaWdodCAuYXZlcmFnZXMtc2Vhc29uXCIpLmh0bWwoJzx0ZCBjbGFzcz1cImFwcGVuZGVkXCI+PHA+JyArIHN0YXRzLnNhWzBdLmdwICsgJzwvcD48L3RkPjx0ZCBjbGFzcz1cImFwcGVuZGVkXCI+PHA+JyArIHN0YXRzLnNhWzBdLnB0cyArICc8L3A+PC90ZD48dGQgY2xhc3M9XCJhcHBlbmRlZFwiPjxwPicgKyBzdGF0cy5zYVswXS5yZWIgKyAnPC9wPjwvdGQ+PHRkIGNsYXNzPVwiYXBwZW5kZWRcIj48cD4nICsgc3RhdHMuc2FbMF0uYXN0ICsgJzwvcD48L3RkPicpO1xuICAgICAgICBqUXVlcnkoJy5wbGF5ZXItc3BvdGxpZ2h0IC5wbGF5ZXItbmFtZScpLmZhZGVUbygyMDAsIDEpO1xuICAgICAgICB2YXIgcGxheWVyRmFjdHMgPSByb3N0ZXJPYmouY2VsdGljcy5yb3N0ZXJbc2VsZWN0ZWRQbGF5ZXJdLmJpby5wZXJzb25hbDtcbiAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCAzOyBpKyspIHtcbiAgICAgICAgICAgIHZhciBmYWN0SW5kZXggPSBNYXRoLmZsb29yKE1hdGgucmFuZG9tKCkgKiBwbGF5ZXJGYWN0cy5sZW5ndGgpO1xuICAgICAgICAgICAgalF1ZXJ5KCcucGxheWVyLXNwb3RsaWdodCAuYm90dG9tLXdyYXAnKS5hcHBlbmQoJzxkaXYgY2xhc3M9XCJkeWstYm94IGFwcGVuZGVkXCI+PHA+JyArIHBsYXllckZhY3RzW2ZhY3RJbmRleF0gKyAnPC9wPjwvZGl2PicpO1xuICAgICAgICB9O1xuICAgICAgICBqUXVlcnkoJy5wbGF5ZXItc3BvdGxpZ2h0IC5ib3R0b20td3JhcCcpLmFkZENsYXNzKCd0cmFuc2l0aW9uLTEnKTtcbiAgICAgICAgc2V0VGltZW91dChmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIGpRdWVyeSgnLnBsYXllci1zcG90bGlnaHQgLmJvdHRvbS13cmFwIC5keWstYm94Om50aC1vZi10eXBlKDIpJykuYWRkQ2xhc3MoJ3RyYW5zaXRpb24tMicpO1xuICAgICAgICAgICAgalF1ZXJ5KCcucGxheWVyLXNwb3RsaWdodCAuYm90dG9tLXdyYXAgLmR5ay1ib3g6bnRoLW9mLXR5cGUoMyknKS5hZGRDbGFzcygndHJhbnNpdGlvbi0xJyk7XG4gICAgICAgIH0sIDEwMDApO1xuICAgICAgICBzZXRUaW1lb3V0KGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgalF1ZXJ5KCcucGxheWVyLXNwb3RsaWdodCAuYm90dG9tLXdyYXAgLmR5ay1ib3g6bnRoLW9mLXR5cGUoMyknKS5hZGRDbGFzcygndHJhbnNpdGlvbi0yJyk7XG4gICAgICAgICAgICBqUXVlcnkoJy5wbGF5ZXItc3BvdGxpZ2h0IC5ib3R0b20td3JhcCAuZHlrLWJveDpudGgtb2YtdHlwZSg0KScpLmFkZENsYXNzKCd0cmFuc2l0aW9uLTEnKTtcbiAgICAgICAgfSwgMTUwMCk7XG4gICAgfSwgNjAwMCk7XG4gICAgLyogOCAtIFNQT1RMSUdIVCBTTElERSBJTiAqL1xuICAgIHNldFRpbWVvdXQoZnVuY3Rpb24oKSB7XG4gICAgICAgIGpRdWVyeSgnLnBsYXllci1zcG90bGlnaHQgLnBsYXllci10b3AgLnBsYXllci1uYW1lLCAucGxheWVyLXNwb3RsaWdodCAucGxheWVyLW5hbWUtd3JhcCwgLnBsYXllci1zcG90bGlnaHQgLmhlYWRzaG90LCAucGxheWVyLXNwb3RsaWdodCAuaW5mbywgLnBsYXllci1zcG90bGlnaHQgLnNpbG8sIC5wbGF5ZXItc3BvdGxpZ2h0IC5hdmVyYWdlcywgLnBsYXllci1zcG90bGlnaHQgLnBsYXllci1udW1iZXInKS5hZGRDbGFzcygndHJhbnNpdGlvbi0xJyk7XG4gICAgICAgIHNldFRpbWVvdXQoZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICBqUXVlcnkoJy5ibG9jay13cmFwLnBsYXllci1zcG90bGlnaHQgLnBsYXllci1ib3gnKS5yZW1vdmUoKTtcbiAgICAgICAgfSwgNDAwMCk7XG4gICAgICAgIGlmIChwbGF5ZXJTcG90bGlnaHRDb3VudGVyIDwgMTYpIHtcbiAgICAgICAgICAgIHBsYXllclNwb3RsaWdodENvdW50ZXIrKztcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHBsYXllclNwb3RsaWdodENvdW50ZXIgPSAwO1xuICAgICAgICB9XG4gICAgfSwgNzAwMCk7XG4gICAgLyogOSAtIFNQT1RMSUdIVCBTTElERSBPVVQgKi9cbiAgICBzZXRUaW1lb3V0KGZ1bmN0aW9uKCkge1xuICAgICAgICBqUXVlcnkoJy5wbGF5ZXItc3BvdGxpZ2h0IC5ib3R0b20td3JhcCwgLnBsYXllci1zcG90bGlnaHQgLnRvcC13cmFwJykuYWRkQ2xhc3MoJ3RyYW5zaXRpb24tMicpO1xuICAgIH0sIDgwMDApO1xuICAgIC8qIDEwIC0gRE9ORS4gUkVNT1ZFICovXG4gICAgc2V0VGltZW91dChmdW5jdGlvbigpIHtcbiAgICAgICAgalF1ZXJ5KCcgLnBsYXllci1zcG90bGlnaHQgLmFwcGVuZGVkJykucmVtb3ZlKCk7XG4gICAgICAgIGpRdWVyeSgnIC5wbGF5ZXItc3BvdGxpZ2h0IC5zZWxlY3RlZCcpLnJlbW92ZUNsYXNzKCdzZWxlY3RlZCcpO1xuICAgICAgICBmb3IgKHZhciBpID0gMTsgaSA8IDEwOyBpKyspIHtcbiAgICAgICAgICAgIGpRdWVyeSgnLnJpZ2h0LXdyYXAgLnRyYW5zaXRpb24tJyArIGkpLnJlbW92ZUNsYXNzKCd0cmFuc2l0aW9uLScgKyBpKTtcbiAgICAgICAgfVxuICAgIH0sIDkwMDApO1xufVxuXG5mdW5jdGlvbiBsZWFkZXJzKGdpZCwgZ2FtZVN0YXJ0ZWQpIHtcbiAgICBqUXVlcnkoJy5sZWFkZXJzJykuYWRkQ2xhc3MoJ2FjdGl2ZScpO1xuICAgIHZhciBnYW1lRGV0YWlsID0gJyc7XG4gICAgdmFyIGRldGFpbEF2YWlsYWJsZSA9IGZhbHNlO1xuICAgIHZhciBsZWFkZXJzVGl0bGUgPSAnU0VBU09OIExFQURFUlMnO1xuICAgIGlmIChjaGVja0dhbWVTdGF0dXMoKSkge1xuICAgICAgICBsZWFkZXJzVGl0bGUgPSAnR0FNRSBMRUFERVJTJztcbiAgICAgICAgalF1ZXJ5LmFqYXgoe1xuICAgICAgICAgICAgdXJsOiBmZWVkcy5nYW1lZGV0YWlsKGdpZCksXG4gICAgICAgICAgICBhc3luYzogZmFsc2UsXG4gICAgICAgICAgICBzdWNjZXNzOiBmdW5jdGlvbihkYXRhKSB7XG4gICAgICAgICAgICAgICAgdmFyIHRlYW1MaW5lU2NvcmUgPSBbXCJobHNcIiwgXCJ2bHNcIl07XG4gICAgICAgICAgICAgICAgZm9yICh2YXIgeCA9IDA7IHggPCB0ZWFtTGluZVNjb3JlLmxlbmd0aDsgeCsrKSB7XG4gICAgICAgICAgICAgICAgICAgIHZhciBzdGF0cyA9IGRhdGEuZ1t0ZWFtTGluZVNjb3JlW3hdXTtcbiAgICAgICAgICAgICAgICAgICAgdmFyIHRlYW0gPSAnJztcbiAgICAgICAgICAgICAgICAgICAgaWYgKHN0YXRzLnRhID09PSAnQ0hBJykge1xuICAgICAgICAgICAgICAgICAgICAgICAgdGVhbSA9ICdjZWx0aWNzJztcbiAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRlYW0gPSAnYXdheSc7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgZm9yICh2YXIgc3RhdCBpbiByb3N0ZXJPYmpbdGVhbV0ubGVhZGVycykge1xuICAgICAgICAgICAgICAgICAgICAgICAgcm9zdGVyT2JqW3RlYW1dLmxlYWRlcnNbc3RhdF0gPSBbXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgWyctLScsICctLScsIDAsICctLSddLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIFsnLS0nLCAnLS0nLCAwLCAnLS0nXSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBbJy0tJywgJy0tJywgMCwgJy0tJ11cbiAgICAgICAgICAgICAgICAgICAgICAgIF07XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgZm9yICh2YXIgcCA9IDA7IHAgPCBzdGF0cy5wc3RzZy5sZW5ndGg7IHArKykge1xuICAgICAgICAgICAgICAgICAgICAgICAgZm9yICh2YXIgc3RhdCBpbiByb3N0ZXJPYmpbdGVhbV0ubGVhZGVycykge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJvc3Rlck9ialt0ZWFtXS5sZWFkZXJzW3N0YXRdLnB1c2goW3N0YXRzLnBzdHNnW3BdLmZuLnRvVXBwZXJDYXNlKCksIHN0YXRzLnBzdHNnW3BdLmxuLnRvVXBwZXJDYXNlKCksIHN0YXRzLnBzdHNnW3BdW3N0YXRdLCBzdGF0cy5wc3RzZ1twXS5waWRdKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgIHJvc3Rlck9ialt0ZWFtXS5sZWFkZXJzW3N0YXRdLnNvcnQoZnVuY3Rpb24oYSwgYikge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBhWzJdIC0gYlsyXTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIGZvciAodmFyIHRlYW0gaW4gcm9zdGVyT2JqKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBmb3IgKHZhciBzdGF0IGluIHJvc3Rlck9ialt0ZWFtXS5sZWFkZXJzKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcm9zdGVyT2JqW3RlYW1dLmxlYWRlcnNbc3RhdF0uc29ydChmdW5jdGlvbihhLCBiKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBiWzJdIC0gYVsyXTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmxvZygnU09SVEVEOicpO1xuICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhyb3N0ZXJPYmopO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgfVxuICAgIGpRdWVyeSgnLmxlYWRlcnMtdGl0bGUnKS5odG1sKGxlYWRlcnNUaXRsZSk7XG4gICAgZm9yICh2YXIgdGVhbSBpbiByb3N0ZXJPYmopIHtcbiAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCAzOyBpKyspIHtcbiAgICAgICAgICAgIGZvciAodmFyIHN0YXQgaW4gcm9zdGVyT2JqW3RlYW1dLmxlYWRlcnMpIHtcbiAgICAgICAgICAgICAgICAvLyBMRUFERVIgU1RBVCBWQUxVRVxuICAgICAgICAgICAgICAgIGpRdWVyeSgnLmxlYWRlci1zZWN0aW9uOm50aC1vZi10eXBlKCcgKyAoaSArIDIpICsgJykgLicgKyBzdGF0ICsgJy4nICsgdGVhbSArICcgLnN0YXQnKS5odG1sKCc8c3BhbiBjbGFzcz1cImFwcGVuZGVkICcgKyByb3N0ZXJPYmpbdGVhbV0udGEgKyAnXCI+JyArIHJvc3Rlck9ialt0ZWFtXS5sZWFkZXJzW3N0YXRdW2ldWzJdICsgJzwvc3Bhbj4gJyArIHN0YXQudG9VcHBlckNhc2UoKSk7XG4gICAgICAgICAgICAgICAgLy8gTEVBREVSIE5BTUVcbiAgICAgICAgICAgICAgICBpZiAocm9zdGVyT2JqW3RlYW1dLmxlYWRlcnNbc3RhdF1baV1bMF0ubGVuZ3RoICsgcm9zdGVyT2JqW3RlYW1dLmxlYWRlcnNbc3RhdF1baV1bMV0ubGVuZ3RoID49IDE0KSB7XG4gICAgICAgICAgICAgICAgICAgIHJvc3Rlck9ialt0ZWFtXS5sZWFkZXJzW3N0YXRdW2ldWzBdID0gcm9zdGVyT2JqW3RlYW1dLmxlYWRlcnNbc3RhdF1baV1bMF0uc3Vic3RyKDAsIDEpICsgJy4nO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBqUXVlcnkoJy5sZWFkZXItc2VjdGlvbjpudGgtb2YtdHlwZSgnICsgKGkgKyAyKSArICcpIC4nICsgc3RhdCArICcuJyArIHRlYW0gKyAnIC5uYW1lJykuaHRtbCgnPHNwYW4gY2xhc3M9XCJhcHBlbmRlZFwiPicgKyByb3N0ZXJPYmpbdGVhbV0ubGVhZGVyc1tzdGF0XVtpXVswXSArICc8L3NwYW4+ICcgKyByb3N0ZXJPYmpbdGVhbV0ubGVhZGVyc1tzdGF0XVtpXVsxXSk7XG4gICAgICAgICAgICAgICAgLy8gTEVBREVSIEhFQURTSE9UXG4gICAgICAgICAgICAgICAgalF1ZXJ5KCcubGVhZGVyLXNlY3Rpb246bnRoLW9mLXR5cGUoJyArIChpICsgMikgKyAnKSAuJyArIHN0YXQgKyAnLicgKyB0ZWFtICsgJyAuaGVhZHNob3QnKS5hdHRyKCdzcmMnLCAnaHR0cHM6Ly9hay1zdGF0aWMuY21zLm5iYS5jb20vd3AtY29udGVudC91cGxvYWRzL2hlYWRzaG90cy9uYmEvbGF0ZXN0LzEwNDB4NzYwLycgKyByb3N0ZXJPYmpbdGVhbV0ubGVhZGVyc1tzdGF0XVtpXVszXSArICcucG5nJyk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9XG4gICAgc2V0VGltZW91dChmdW5jdGlvbigpIHtcbiAgICAgICAgalF1ZXJ5KCcubGVhZGVycywgLmxlYWRlcnMgLmJsb2NrLWlubmVyJykuYWRkQ2xhc3MoJ3RyYW5zaXRpb24tMScpO1xuICAgIH0sIDEwMCk7XG4gICAgc2V0VGltZW91dChmdW5jdGlvbigpIHtcbiAgICAgICAgalF1ZXJ5KCcubGVhZGVycyAubGVhZGVyLXNlY3Rpb24nKS5hZGRDbGFzcygndHJhbnNpdGlvbi0xJyk7XG4gICAgICAgIGpRdWVyeSgnLmxlYWRlci1zdWJzZWN0aW9uLmJvdHRvbSBwOm50aC1vZi10eXBlKDEpJykuYWRkQ2xhc3MoJ3RyYW5zaXRpb24tMScpO1xuICAgICAgICBqUXVlcnkoJy5sZWFkZXJzIC5sZWFkZXItc2VjdGlvbiAudW5kZXJsaW5lLCAubGVhZGVycyAubGVhZGVyLXN1YnNlY3Rpb24udG9wJykuYWRkQ2xhc3Mocm9zdGVyT2JqLmNlbHRpY3MudGEgKyAnLWJnJyk7XG4gICAgfSwgMTEwMCk7XG4gICAgc2V0VGltZW91dChmdW5jdGlvbigpIHtcbiAgICAgICAgalF1ZXJ5KCcubGVhZGVycyAubGVhZGVyLXNlY3Rpb24nKS5hZGRDbGFzcygndHJhbnNpdGlvbi0yJyk7XG4gICAgICAgIGpRdWVyeSgnLmxlYWRlcnMgLmJsb2NrLWlubmVyJykuYWRkQ2xhc3MoJ3RyYW5zaXRpb24tMicpO1xuICAgIH0sIDIxMDApO1xuICAgIHZhciB0cmFuc2l0aW9uQ291bnRlciA9IDE7XG4gICAgc2V0VGltZW91dChmdW5jdGlvbigpIHtcbiAgICAgICAgZm9yIChsZXQgaSA9IDE7IGkgPCA2OyBpKyspIHtcbiAgICAgICAgICAgIHNldFRpbWVvdXQoZnVuY3Rpb24obnVtYmVyU3RyaW5nKSB7XG4gICAgICAgICAgICAgICAgalF1ZXJ5KCcubGVhZGVycyAubGVhZGVyLXNlY3Rpb24gLmxlYWRlci1zdGF0LXdyYXAnKS5hZGRDbGFzcygndHJhbnNpdGlvbi0nICsgaSk7XG4gICAgICAgICAgICAgICAgalF1ZXJ5KCcubGVhZGVycyAubGVhZGVyLXNlY3Rpb24gLnVuZGVybGluZSwgLmxlYWRlcnMgLmxlYWRlci1zdWJzZWN0aW9uLnRvcCcpLnJlbW92ZUNsYXNzKHJvc3Rlck9iai5jZWx0aWNzLnRhICsgJy1iZycpO1xuICAgICAgICAgICAgICAgIGpRdWVyeSgnLmxlYWRlcnMgLmxlYWRlci1zZWN0aW9uIC51bmRlcmxpbmUsIC5sZWFkZXJzIC5sZWFkZXItc3Vic2VjdGlvbi50b3AnKS5hZGRDbGFzcyhyb3N0ZXJPYmouYXdheS50YSArICctYmcnKTtcbiAgICAgICAgICAgICAgICBpZiAodHJhbnNpdGlvbkNvdW50ZXIgJSAyID09IDApIHtcbiAgICAgICAgICAgICAgICAgICAgc2V0VGltZW91dChmdW5jdGlvbigpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGpRdWVyeSgnLmxlYWRlcnMgLmxlYWRlci1zZWN0aW9uIC51bmRlcmxpbmUsIC5sZWFkZXJzIC5sZWFkZXItc3Vic2VjdGlvbi50b3AnKS5yZW1vdmVDbGFzcyhyb3N0ZXJPYmouYXdheS50YSArICctYmcnKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGpRdWVyeSgnLmxlYWRlcnMgLmxlYWRlci1zZWN0aW9uIC51bmRlcmxpbmUsIC5sZWFkZXJzIC5sZWFkZXItc3Vic2VjdGlvbi50b3AnKS5hZGRDbGFzcyhyb3N0ZXJPYmouY2VsdGljcy50YSArICctYmcnKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGpRdWVyeSgnLmxlYWRlci1zdWJzZWN0aW9uLmJvdHRvbSBwJykucmVtb3ZlQ2xhc3MoJ3RyYW5zaXRpb24tMScpO1xuICAgICAgICAgICAgICAgICAgICAgICAgalF1ZXJ5KCcubGVhZGVycyAubGVhZGVyLXNlY3Rpb24gLnVuZGVybGluZScpLmFkZENsYXNzKCd0cmFuc2l0aW9uLScgKyAoaSAvIDIpKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGpRdWVyeSgnLmxlYWRlci1zdWJzZWN0aW9uLmJvdHRvbSBwOm50aC1vZi10eXBlKCcgKyAoaSAtIChpIC8gMikgKyAxKSArICcpJykuYWRkQ2xhc3MoJ3RyYW5zaXRpb24tMScpOyAvLyBsb2xcbiAgICAgICAgICAgICAgICAgICAgfSwgMjAwKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgdHJhbnNpdGlvbkNvdW50ZXIrKztcbiAgICAgICAgICAgIH0sIDcwMDAgKiBpKTtcbiAgICAgICAgfVxuICAgIH0sIDIxMDApO1xuICAgIHNldFRpbWVvdXQoZnVuY3Rpb24oKSB7XG4gICAgICAgIGpRdWVyeSgnLmxlYWRlcnMgLmxlYWRlci1zZWN0aW9uLCAubGVhZGVycyAubGVhZGVyLXN1YnNlY3Rpb24nKS5hZGRDbGFzcygndHJhbnNpdGlvbi0zJyk7XG4gICAgfSwgNDQxMDApO1xuICAgIHNldFRpbWVvdXQoZnVuY3Rpb24oKSB7XG4gICAgICAgIGpRdWVyeSgnLmxlYWRlcnMnKS5hZGRDbGFzcygndHJhbnNpdGlvbi0yJyk7XG4gICAgfSwgNDQxMDApO1xuICAgIHNldFRpbWVvdXQoZnVuY3Rpb24oKSB7XG4gICAgICAgIGpRdWVyeSgnLmxlYWRlcnMgLmxlYWRlci1zZWN0aW9uIC51bmRlcmxpbmUsIC5sZWFkZXJzIC5sZWFkZXItc3Vic2VjdGlvbi50b3AnKS5yZW1vdmVDbGFzcyhyb3N0ZXJPYmouYXdheS50YSArICctYmcnKTtcbiAgICAgICAgalF1ZXJ5KCcubGVhZGVycyAubGVhZGVyLXNlY3Rpb24gLnVuZGVybGluZSwgLmxlYWRlcnMgLmxlYWRlci1zdWJzZWN0aW9uLnRvcCcpLmFkZENsYXNzKHJvc3Rlck9iai5jZWx0aWNzLnRhICsgJy1iZycpO1xuICAgICAgICBqUXVlcnkoJy5sZWFkZXJzJykucmVtb3ZlQ2xhc3MoJ2FjdGl2ZScpO1xuICAgICAgICBqUXVlcnkoJy5sZWFkZXJzIC5hcHBlbmRlZCcpLnJlbW92ZSgpO1xuICAgICAgICBmb3IgKHZhciBpID0gMTsgaSA8IDEwOyBpKyspIHtcbiAgICAgICAgICAgIGpRdWVyeSgnLmxlYWRlcnMgLnRyYW5zaXRpb24tJyArIGkgKyAnLCAubGVhZGVycy50cmFuc2l0aW9uLScgKyBpKS5yZW1vdmVDbGFzcygndHJhbnNpdGlvbi0nICsgaSk7XG4gICAgICAgIH1cbiAgICB9LCA0NTAwMCk7XG59O1xuXG5mdW5jdGlvbiBzb2NpYWwoKSB7XG4gICAgalF1ZXJ5KCcuc29jaWFsIC50ZXh0LXdyYXAsIC5zb2NpYWwgLnVuZGVybGluZScpLnJlbW92ZUNsYXNzKCd0cmFuc2l0aW9uLTEnKTtcbiAgICBqUXVlcnkoJy5zb2NpYWwnKS5hZGRDbGFzcygnYWN0aXZlJyk7XG4gICAgc2V0VGltZW91dChmdW5jdGlvbigpIHtcbiAgICAgICAgalF1ZXJ5KCcuc29jaWFsIC50ZXh0LXdyYXAsIC5zb2NpYWwgLnVuZGVybGluZScpLmFkZENsYXNzKCd0cmFuc2l0aW9uLTEnKTtcbiAgICB9LCAxNTAwMCk7XG4gICAgc2V0VGltZW91dChmdW5jdGlvbigpIHtcbiAgICAgICAgalF1ZXJ5KCcuc29jaWFsIC5hcHBlbmRlZCcpLnJlbW92ZSgpO1xuICAgICAgICBqUXVlcnkoJy5zb2NpYWwgLnNlbGVjdGVkJykucmVtb3ZlQ2xhc3MoJ3NlbGVjdGVkJyk7XG4gICAgICAgIGpRdWVyeSgnLnNvY2lhbCcpLnJlbW92ZUNsYXNzKCdhY3RpdmUnKTtcbiAgICB9LCAyMDAwMCk7XG59O1xuLypmdW5jdGlvbiBtb2JpbGVBcHBJbml0KCkge1xuICAgIHZhciBjb3VudGVyID0gMTtcbiAgICBzZXRJbnRlcnZhbChmdW5jdGlvbigpIHtcbiAgICAgICAgalF1ZXJ5KCcuYXBwIC5ib3R0b20td3JhcCBpbWcnKS5yZW1vdmVDbGFzcygnYWN0aXZlJyk7XG4gICAgICAgIGpRdWVyeSgnLmFwcCAuZmVhdHVyZS1saXN0IHAnKS5yZW1vdmVDbGFzcygnYWN0aXZlJyk7XG4gICAgICAgIGpRdWVyeSgnLmFwcCAuZmVhdHVyZS1saXN0IHA6bnRoLW9mLXR5cGUoJyArIGNvdW50ZXIgKyAnKScpLmFkZENsYXNzKCdhY3RpdmUnKTtcbiAgICAgICAgalF1ZXJ5KCcuYXBwIC5ib3R0b20td3JhcCBpbWc6bnRoLW9mLXR5cGUoJyArIGNvdW50ZXIgKyAnKScpLmFkZENsYXNzKCdhY3RpdmUnKTtcbiAgICAgICAgaWYgKGNvdW50ZXIgPT0gNSkge1xuICAgICAgICAgICAgY291bnRlciA9IDE7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBjb3VudGVyKys7XG4gICAgICAgIH1cbiAgICB9LCAyMDAwKTtcbn07XG4qL1xuZnVuY3Rpb24gbW9iaWxlQXBwKCkge1xuICAgIGpRdWVyeSgnLmFwcCAuYmxvY2staW5uZXInKS5yZW1vdmVDbGFzcygndHJhbnNpdGlvbi0xJyk7XG4gICAgalF1ZXJ5KCcuYXBwJykuYWRkQ2xhc3MoJ2FjdGl2ZScpO1xuICAgIHZhciBjb3VudGVyID0gMTtcbiAgICB2YXIgcm90YXRlU2NyZWVucyA9IHNldEludGVydmFsKGZ1bmN0aW9uKCkge1xuICAgICAgICBqUXVlcnkoJy5hcHAgLmJvdHRvbS13cmFwIGltZycpLnJlbW92ZUNsYXNzKCdhY3RpdmUnKTtcbiAgICAgICAgalF1ZXJ5KCcuYXBwIC5mZWF0dXJlLWxpc3QgcCcpLnJlbW92ZUNsYXNzKCdhY3RpdmUnKTtcbiAgICAgICAgalF1ZXJ5KCcuYXBwIC5mZWF0dXJlLWxpc3QgcDpudGgtb2YtdHlwZSgnICsgY291bnRlciArICcpJykuYWRkQ2xhc3MoJ2FjdGl2ZScpO1xuICAgICAgICBqUXVlcnkoJy5hcHAgLmJvdHRvbS13cmFwIGltZzpudGgtb2YtdHlwZSgnICsgY291bnRlciArICcpJykuYWRkQ2xhc3MoJ2FjdGl2ZScpO1xuICAgICAgICBpZiAoY291bnRlciA9PSA1KSB7XG4gICAgICAgICAgICBjb3VudGVyID0gMTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGNvdW50ZXIrKztcbiAgICAgICAgfVxuICAgIH0sIDQwMDApO1xuICAgIHJvdGF0ZVNjcmVlbnM7XG4gICAgc2V0VGltZW91dChmdW5jdGlvbigpIHtcbiAgICAgICAgalF1ZXJ5KCcuYXBwIC5ibG9jay1pbm5lcicpLmFkZENsYXNzKCd0cmFuc2l0aW9uLTEnKTtcbiAgICB9LCAyNDAwMCk7XG4gICAgc2V0VGltZW91dChmdW5jdGlvbigpIHtcbiAgICAgICAgalF1ZXJ5KCcuYXBwJykucmVtb3ZlQ2xhc3MoJ2FjdGl2ZScpO1xuICAgICAgICBjbGVhckludGVydmFsKHJvdGF0ZVNjcmVlbnMpO1xuICAgIH0sIDI1MDAwKTtcbn07XG4vKj09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuPSAgICAgICAgICAgIExFRlQgV1JBUCAgICAgICAgICAgID1cbj09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PSovXG5mdW5jdGlvbiBsZWZ0V3JhcCgpIHtcbiAgICBzZXRJbnRlcnZhbChmdW5jdGlvbigpIHtcbiAgICAgICAgaWYgKGpRdWVyeSgnLmxlZnQtd3JhcCAuc3RhbmRpbmdzJykuaGFzQ2xhc3MoJ3RyYW5zaXRpb24tMScpKSB7XG4gICAgICAgICAgICBqUXVlcnkoJy5sZWZ0LXdyYXAgLnN0YW5kaW5ncycpLnJlbW92ZUNsYXNzKCd0cmFuc2l0aW9uLTEnKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGpRdWVyeSgnLmxlZnQtd3JhcCAuc3RhbmRpbmdzJykuYWRkQ2xhc3MoJ3RyYW5zaXRpb24tMScpO1xuICAgICAgICB9XG4gICAgICAgIGlmIChqUXVlcnkoJy5sZWZ0LXdyYXAgLnNjb3Jlcy1hbmQtbGVhZGVycycpLmhhc0NsYXNzKCd0cmFuc2l0aW9uLTEnKSkge1xuICAgICAgICAgICAgalF1ZXJ5KCcubGVmdC13cmFwIC5zY29yZXMtYW5kLWxlYWRlcnMnKS5yZW1vdmVDbGFzcygndHJhbnNpdGlvbi0xJyk7XG4gICAgICAgICAgICB1cGRhdGVMZWFndWVTY29yZXMoKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGpRdWVyeSgnLmxlZnQtd3JhcCAuc2NvcmVzLWFuZC1sZWFkZXJzJykuYWRkQ2xhc3MoJ3RyYW5zaXRpb24tMScpO1xuICAgICAgICB9XG4gICAgfSwgNTAwMDApO1xufVxuXG5mdW5jdGlvbiBzdGFuZGluZ3NJbml0KGF3YXlUZWFtKSB7XG4gICAgalF1ZXJ5LmFqYXgoe1xuICAgICAgICB1cmw6IGZlZWRzLnN0YW5kaW5ncyxcbiAgICAgICAgYXN5bmM6IGZhbHNlLFxuICAgICAgICBzdWNjZXNzOiBmdW5jdGlvbihzdGFuZGluZ3NEYXRhKSB7XG4gICAgICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IHN0YW5kaW5nc0RhdGEuc3RhLmNvLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICAgICAgZm9yIChsZXQgeCA9IDA7IHggPCBzdGFuZGluZ3NEYXRhLnN0YS5jb1tpXS5kaS5sZW5ndGg7IHgrKykge1xuICAgICAgICAgICAgICAgICAgICBmb3IgKGxldCB0ID0gMDsgdCA8IHN0YW5kaW5nc0RhdGEuc3RhLmNvW2ldLmRpW3hdLnQubGVuZ3RoOyB0KyspIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHZhciBjb25mZXJlbmNlcyA9IFsnLmVhc3QnLCAnLndlc3QnXTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHZhciBwbGFjZSA9IHN0YW5kaW5nc0RhdGEuc3RhLmNvW2ldLmRpW3hdLnRbdF0uc2VlO1xuICAgICAgICAgICAgICAgICAgICAgICAgdmFyIHNlZWQgPSAnJztcbiAgICAgICAgICAgICAgICAgICAgICAgIHZhciBhY3RpdmVTdGF0dXMgPSAnJztcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChzdGFuZGluZ3NEYXRhLnN0YS5jb1tpXS5kaVt4XS50W3RdLnNlZSA8PSA4KSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgc2VlZCA9IHN0YW5kaW5nc0RhdGEuc3RhLmNvW2ldLmRpW3hdLnRbdF0uc2VlO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHN0YW5kaW5nc0RhdGEuc3RhLmNvW2ldLmRpW3hdLnRbdF0udGEgPT0gJ0NIQScpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBhY3RpdmVTdGF0dXMgPSAnYWN0aXZlJztcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChzdGFuZGluZ3NEYXRhLnN0YS5jb1tpXS5kaVt4XS50W3RdLnRhID09IGF3YXlUZWFtKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgYWN0aXZlU3RhdHVzID0gJ2FjdGl2ZS1hd2F5JztcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgIHZhciByb3dIVE1MID0gJzxkaXYgY2xhc3M9XCJwbGFjZVwiPicgKyBzZWVkICsgJzwvZGl2PjxkaXYgY2xhc3M9XCJsb2dvLXdyYXBcIj48aW1nIGNsYXNzPVwibG9nb1wiIHNyYz1odHRwOi8vaS5jZG4udHVybmVyLmNvbS9uYmEvbmJhL2Fzc2V0cy9sb2dvcy90ZWFtcy9wcmltYXJ5L3dlYi8nICsgc3RhbmRpbmdzRGF0YS5zdGEuY29baV0uZGlbeF0udFt0XS50YSArICcuc3ZnPjwvZGl2PjxkaXYgY2xhc3M9XCJ0ZWFtICsgJyArIHN0YW5kaW5nc0RhdGEuc3RhLmNvW2ldLmRpW3hdLnRbdF0udGEgKyAnXCI+JyArIHN0YW5kaW5nc0RhdGEuc3RhLmNvW2ldLmRpW3hdLnRbdF0udGEgKyAnPC9kaXY+PGRpdiBjbGFzcz1cIndpbnNcIj4nICsgc3RhbmRpbmdzRGF0YS5zdGEuY29baV0uZGlbeF0udFt0XS53ICsgJzwvZGl2PjxkaXYgY2xhc3M9XCJsb3NzZXNcIj4nICsgc3RhbmRpbmdzRGF0YS5zdGEuY29baV0uZGlbeF0udFt0XS5sICsgJzwvZGl2PjxkaXYgY2xhc3M9XCJnYW1lcy1iZWhpbmRcIj4nICsgc3RhbmRpbmdzRGF0YS5zdGEuY29baV0uZGlbeF0udFt0XS5nYiArICc8L2Rpdj4nO1xuICAgICAgICAgICAgICAgICAgICAgICAgalF1ZXJ5KGNvbmZlcmVuY2VzW2ldICsgJyA+IGRpdjpudGgtY2hpbGQoJyArIChwbGFjZSArIDEpICsgJyknKS5odG1sKHJvd0hUTUwpO1xuICAgICAgICAgICAgICAgICAgICAgICAgalF1ZXJ5KGNvbmZlcmVuY2VzW2ldICsgJyA+IGRpdjpudGgtY2hpbGQoJyArIChwbGFjZSArIDEpICsgJyknKS5hZGRDbGFzcyhhY3RpdmVTdGF0dXMpO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfSk7XG59O1xuXG5mdW5jdGlvbiBzY29yZXNJbml0KHRvZGF5c1Njb3Jlc0RhdGEpIHtcbiAgICB2YXIgbGl2ZVNjb3JlcyA9IHRvZGF5c1Njb3Jlc0RhdGEuZ3MuZztcbiAgICBpZiAobGl2ZVNjb3Jlcy5sZW5ndGggIT0gMCkge1xuICAgICAgICB2YXIgc2Vhc29uVHlwZSA9ICcnO1xuICAgICAgICBpZiAobGl2ZVNjb3Jlc1swXS5naWQuc3Vic3RyKDAsIDMpID09ICcwMDEnKSB7XG4gICAgICAgICAgICBzZWFzb25UeXBlID0gJ3ByZSc7XG4gICAgICAgIH0gZWxzZSBpZiAobGl2ZVNjb3Jlc1swXS5naWQuc3Vic3RyKDAsIDMpID09ICcwMDQnKSB7XG4gICAgICAgICAgICBzZWFzb25UeXBlID0gJ3Bvc3QnO1xuICAgICAgICB9XG4gICAgICAgIGlmIChsaXZlU2NvcmVzLmxlbmd0aCA+IDEgfHwgKGxpdmVTY29yZXMubGVuZ3RoID09IDEgJiYgbGl2ZVNjb3Jlc1swXS5oLnRhICE9ICdDSEEnKSkge1xuICAgICAgICAgICAgdmFyIHN0YXR1c0NvZGVzID0gWycxc3QgUXRyJywgJzJuZCBRdHInLCAnM3JkIFF0cicsICc0dGggUXRyJywgJzFzdCBPVCcsICcybmQgT1QnLCAnM3JkIE9UJywgJzR0aCBPVCcsICc1dGggT1QnLCAnNnRoIE9UJywgJzd0aCBPVCcsICc4dGggT1QnLCAnOXRoIE9UJywgJzEwdGggT1QnXTtcbiAgICAgICAgICAgIHZhciBzY29yZXNIVE1MID0gJyc7XG4gICAgICAgICAgICB2YXIgYWRkZWQgPSAwO1xuICAgICAgICAgICAgZm9yICh2YXIgaSA9IGxpdmVTY29yZXMubGVuZ3RoIC0gMTsgaSA+PSAwOyBpLS0pIHtcbiAgICAgICAgICAgICAgICBpZiAobGl2ZVNjb3Jlc1tpXS5oLnRhICE9PSAnQ0hBJyAmJiBpIDwgMTEpIHtcbiAgICAgICAgICAgICAgICAgICAgYWRkZWQrKztcbiAgICAgICAgICAgICAgICAgICAgdmFyIHZTY29yZSA9ICcnO1xuICAgICAgICAgICAgICAgICAgICB2YXIgaFNjb3JlID0gJyc7XG4gICAgICAgICAgICAgICAgICAgIHZhciB2UmVzdWx0ID0gJyc7XG4gICAgICAgICAgICAgICAgICAgIHZhciBoUmVzdWx0ID0gJyc7XG4gICAgICAgICAgICAgICAgICAgIGlmIChsaXZlU2NvcmVzW2ldLnN0ICE9IDEpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHZTY29yZSA9IGxpdmVTY29yZXNbaV0udi5zO1xuICAgICAgICAgICAgICAgICAgICAgICAgaFNjb3JlID0gbGl2ZVNjb3Jlc1tpXS5oLnM7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgdmFyIHNUZXh0ID0gbGl2ZVNjb3Jlc1tpXS5zdHQ7XG4gICAgICAgICAgICAgICAgICAgIGlmIChzdGF0dXNDb2Rlcy5pbmRleE9mKGxpdmVTY29yZXNbaV0uc3R0KSAhPT0gLTEpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHNUZXh0ID0gbGl2ZVNjb3Jlc1tpXS5zdHQgKyAnIC0gJyArIGxpdmVTY29yZXNbaV0uY2w7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgaWYgKGxpdmVTY29yZXNbaV0uc3QgPT0gMyAmJiB2U2NvcmUgPCBoU2NvcmUpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHZSZXN1bHQgPSAnbG9zZXInO1xuICAgICAgICAgICAgICAgICAgICB9IGVsc2UgaWYgKGxpdmVTY29yZXNbaV0uc3QgPT0gMyAmJiBoU2NvcmUgPCB2U2NvcmUpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGhSZXN1bHQgPSAnbG9zZXInO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIHNjb3Jlc0hUTUwgKz0gJzxkaXYgY2xhc3M9XCJzY29yZS13cmFwXCI+PGRpdiBjbGFzcz1cInNjb3JlLXN0YXR1c1wiPicgKyBzVGV4dCArICc8L2Rpdj48ZGl2IGNsYXNzPVwiJyArIGxpdmVTY29yZXNbaV0udi50YSArICdcIj48aW1nIHNyYz1cImh0dHA6Ly9zdGF0cy5uYmEuY29tL21lZGlhL2ltZy90ZWFtcy9sb2dvcy8nICsgbGl2ZVNjb3Jlc1tpXS52LnRhLnRvVXBwZXJDYXNlKCkgKyAnX2xvZ28uc3ZnXCI+ICcgKyBsaXZlU2NvcmVzW2ldLnYudGMudG9VcHBlckNhc2UoKSArICcgJyArIGxpdmVTY29yZXNbaV0udi50bi50b1VwcGVyQ2FzZSgpICsgJyA8ZGl2IGNsYXNzPVwic2NvcmUtbnVtICcgKyB2UmVzdWx0ICsgJ1wiPicgKyB2U2NvcmUgKyAnPC9kaXY+PC9kaXY+PGRpdiBjbGFzcz1cIicgKyBsaXZlU2NvcmVzW2ldLmgudGEgKyAnXCI+PGltZyBzcmM9XCJodHRwOi8vc3RhdHMubmJhLmNvbS9tZWRpYS9pbWcvdGVhbXMvbG9nb3MvJyArIGxpdmVTY29yZXNbaV0uaC50YS50b1VwcGVyQ2FzZSgpICsgJ19sb2dvLnN2Z1wiPiAnICsgbGl2ZVNjb3Jlc1tpXS5oLnRjLnRvVXBwZXJDYXNlKCkgKyAnICcgKyBsaXZlU2NvcmVzW2ldLmgudG4udG9VcHBlckNhc2UoKSArICcgPGRpdiBjbGFzcz1cInNjb3JlLW51bSAnICsgaFJlc3VsdCArICdcIj4nICsgaFNjb3JlICsgJzwvZGl2PjwvZGl2PjwvZGl2Pic7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgalF1ZXJ5KCcuc2NvcmVzJykuZW1wdHkoKS5hcHBlbmQoc2NvcmVzSFRNTCk7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKGFkZGVkIDw9IDUpIHtcbiAgICAgICAgICAgIGpRdWVyeSgnLmxlYWd1ZS1sZWFkZXJzJykuc2hvdygpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgalF1ZXJ5KCcubGVhZ3VlLWxlYWRlcnMnKS5oaWRlKCk7XG4gICAgICAgIH1cbiAgICB9XG59XG5cbmZ1bmN0aW9uIHVwZGF0ZUxlYWd1ZVNjb3JlcygpIHtcbiAgICBqUXVlcnkuYWpheCh7XG4gICAgICAgIHVybDogZmVlZHMudG9kYXlzU2NvcmVzLFxuICAgICAgICBhc3luYzogZmFsc2UsXG4gICAgICAgIHN1Y2Nlc3M6IGZ1bmN0aW9uKGRhdGEpIHtcbiAgICAgICAgICAgIHNjb3Jlc0luaXQoZGF0YSk7XG4gICAgICAgIH1cbiAgICB9KTtcbn1cblxuZnVuY3Rpb24gbGVhZ3VlTGVhZGVycygpIHtcbiAgICB2YXIgbGVhZ3VlTGVhZGVyc0hUTUwgPSAnPGRpdiBjbGFzcz1cInRpdGxlXCI+PHA+TEVBR1VFIExFQURFUlM8L3A+PHA+UFRTPC9wPjxwPlJFQjwvcD48cD5BU1Q8L3A+PHA+U1RMPC9wPjxwPkJMSzwvcD48L2Rpdj4nO1xuICAgIHZhciBzdGF0VHlwZSA9ICcnO1xuICAgIHZhciBkYXRhSW5kZXggPSBbXCJSQU5LXCIsIFwiUExBWUVSX0lEXCIsIFwiUExBWUVSXCIsIFwiVEVBTV9JRFwiLCBcIlRFQU1fQUJCUkVWSUFUSU9OXCJdO1xuICAgIGpRdWVyeS5hamF4KHtcbiAgICAgICAgdXJsOiBmZWVkcy5sZWFndWVMZWFkZXJzLFxuICAgICAgICBkYXRhVHlwZTogJ2pzb25wJyxcbiAgICAgICAgYXN5bmM6IGZhbHNlLFxuICAgICAgICBzdWNjZXNzOiBmdW5jdGlvbihkYXRhKSB7XG4gICAgICAgICAgICB2YXIgbGVhZGVyc0RhdGEgPSBkYXRhLnJlc3VsdFNldHM7XG4gICAgICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IGxlYWRlcnNEYXRhLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICAgICAgdmFyIGluZGV4ID0gY3JlYXRlSW5kZXgoZGF0YUluZGV4LCBsZWFkZXJzRGF0YVtpXS5oZWFkZXJzKTtcbiAgICAgICAgICAgICAgICB2YXIgcm93cyA9ICcnO1xuICAgICAgICAgICAgICAgIGlmIChbXCJQVFNcIiwgXCJSRUJcIiwgXCJBU1RcIiwgXCJTVExcIiwgXCJCTEtcIl0uaW5kZXhPZihsZWFkZXJzRGF0YVtpXS5oZWFkZXJzWzhdKSAhPT0gLTEpIHtcbiAgICAgICAgICAgICAgICAgICAgZm9yIChsZXQgeCA9IDA7IHggPCBsZWFkZXJzRGF0YVtpXS5yb3dTZXQubGVuZ3RoOyB4KyspIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHZhciBuID0gbGVhZGVyc0RhdGFbaV0ucm93U2V0W3hdWzJdLnNwbGl0KCcgJyk7XG4gICAgICAgICAgICAgICAgICAgICAgICB2YXIgZm4gPSBuWzBdLnRvVXBwZXJDYXNlKCk7XG4gICAgICAgICAgICAgICAgICAgICAgICB2YXIgbG4gPSBuWzFdLnRvVXBwZXJDYXNlKCk7XG4gICAgICAgICAgICAgICAgICAgICAgICByb3dzICs9ICc8ZGl2IGNsYXNzPVwicm93XCI+PGRpdiBjbGFzcz1cImxlZnRcIj48ZGl2IGNsYXNzPVwicGxhY2VcIj4nICsgbGVhZGVyc0RhdGFbaV0ucm93U2V0W3hdWzBdICsgJzwvZGl2PjxkaXYgY2xhc3M9XCJsb2dvLXdyYXBcIj48aW1nIGNsYXNzPVwibG9nb1wiIHNyYz1cImh0dHA6Ly9zdGF0cy5uYmEuY29tL21lZGlhL2ltZy90ZWFtcy9sb2dvcy8nICsgbGVhZGVyc0RhdGFbaV0ucm93U2V0W3hdWzRdICsgJ19sb2dvLnN2Z1wiLz48L2Rpdj48ZGl2IGNsYXNzPVwibmFtZVwiPjxzcGFuPicgKyBmbiArICc8L3NwYW4+ICcgKyBsbiArICc8L2Rpdj48L2Rpdj48ZGl2IGNsYXNzPVwicmlnaHRcIj48ZGl2IGNsYXNzPVwidmFsdWVcIj4nICsgcm91bmQobGVhZGVyc0RhdGFbaV0ucm93U2V0W3hdWzhdKSArICc8L2Rpdj48L2Rpdj48L2Rpdj4nO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIGxlYWd1ZUxlYWRlcnNIVE1MICs9ICc8ZGl2IGNsYXNzPVwibGVhZ3VlLWxlYWRlcnMtd3JhcFwiPicgKyByb3dzICsgJzwvZGl2Pic7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgalF1ZXJ5KCcubGVhZ3VlLWxlYWRlcnMnKS5lbXB0eSgpLmFwcGVuZChsZWFndWVMZWFkZXJzSFRNTCk7XG4gICAgICAgIH1cbiAgICB9KTtcbiAgICB2YXIgY291bnRlciA9IDI7XG4gICAgc2V0SW50ZXJ2YWwoZnVuY3Rpb24oKSB7XG4gICAgICAgIGpRdWVyeSgnLmxlYWd1ZS1sZWFkZXJzLXdyYXAsIC5sZWFndWUtbGVhZGVycyAudGl0bGUgcCcpLnJlbW92ZUNsYXNzKCdhY3RpdmUnKTtcbiAgICAgICAgalF1ZXJ5KCcubGVhZ3VlLWxlYWRlcnMtd3JhcDpudGgtb2YtdHlwZSgnICsgY291bnRlciArICcpLCAubGVhZ3VlLWxlYWRlcnMgLnRpdGxlIHA6bnRoLW9mLXR5cGUoJyArIGNvdW50ZXIgKyAnKScpLmFkZENsYXNzKCdhY3RpdmUnKTtcbiAgICAgICAgaWYgKGNvdW50ZXIgPT0gNikge1xuICAgICAgICAgICAgY291bnRlciA9IDI7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBjb3VudGVyKys7XG4gICAgICAgIH1cbiAgICB9LCAxMDAwMCk7XG59Il19
