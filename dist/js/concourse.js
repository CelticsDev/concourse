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

// LOCAL
/*var feeds = {
    todaysScores: 'http://localhost:8888/data/mobile-stats-feed/todays_scores.json',
    celticsRoster: 'http://localhost:8888/data/mobile-stats-feed/celtics_roster.json',
    awayRoster: function(awayTn){
        return 'http://localhost:8888/data/mobile-stats-feed/away_roster.json';
    },
    bioData: 'http://localhost:8888/data/bio-data.json',
    playercard: function(pid){
        return 'http://localhost:8888/data/mobile-stats-feed/playercards/playercard-' + pid + '.json';
    },
    playercardAway: function(pid){
        return 'http://localhost:8888/data/mobile-stats-feed/playercards/playercard-202330.json';
    },
    gamedetail: function(gid) {
        return 'http://localhost:8888/data/mobile-stats-feed/gamedetail.json';
    },
    standings: 'http://localhost:8888/data/mobile-stats-feed/standings.json',
    leagueLeaders: 'http://localhost:8888/data/league_leaders.json'
};
*/
// ONLINE

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
                if (todaysScoresData.gs.g[i].h.ta == 'BOS') {
                    // TRANSITIONS
                    var _cycle = function _cycle() {
                        mobileApp(); // DURATION: 25s
                        setTimeout(function () {
                            leaders(gid);
                        }, 25000);
                        setTimeout(social, 69000);
                        /*                        setTimeout(function(){
                                                    playerSpotlight(rosterObj);
                                                }, 79000);*/
                    };

                    //CHANGE THIS
                    awayTeam = todaysScoresData.gs.g[i].v.ta;
                    awayTn = todaysScoresData.gs.g[i].v.tn.toLowerCase();
                    gid = todaysScoresData.gs.g[i].gid;
                    loadRosterData(awayTeam, awayTn);
                    scoresInit(todaysScoresData);
                    standingsInit(awayTeam);
                    /*                    mobileAppInit();*/
                    leagueLeaders();
                    leftWrap();
                    _cycle();
                    setInterval(_cycle, 85000);
                }
            }
        }
    });
    // loadRosterData(); ONLY ONCE
    /*    setTimeout(leaders(gid, gameStarted), 400);*/
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
    if (!gameStarted) {
        jQuery.ajax({
            url: feeds.todaysScores,
            async: false,
            success: function success(todaysScoresData) {
                var gid = '';
                for (var i = 0; i < todaysScoresData.gs.g.length; i++) {
                    if (todaysScoresData.gs.g[i].h.ta == 'BOS') {
                        if (todaysScoresData.gs.g[i] !== 1) {
                            gameStarted = true;
                        }
                    }
                }
            }
        });
    }
    return true;
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
    }, 3000);
    /* 5 - PLAYER SELECT */
    var selectedPlayer = '';
    setTimeout(function () {
        jQuery('.player-box').addClass('transition-2');
        jQuery('.player-box:nth-child(' + playerSpotlightCounter + ')').addClass('selected');
        selectedPlayer = jQuery('.player-box:nth-child(' + playerSpotlightCounter + ')').attr('data-pid');
        jQuery('.player-box').not('.replacement.selected').delay(500).addClass('transition-4');
    }, 4000);
    /* 6 - PLAYER BOX EXPAND */
    setTimeout(function () {
        jQuery('.block-wrap.social').addClass('transition-3');
        jQuery('.player-box.replacement.selected').addClass('transition-3');
    }, 5000);
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
                    if (stats.ta === 'BOS') {
                        team = 'celtics';
                    } else {
                        team = 'away';
                    }
                    for (var stat in rosterObj[team].leaders) {
                        rosterObj[team].leaders[stat] = [['--', '--', '--', '--'], ['--', '--', '--', '--'], ['--', '--', '--', '--']];
                    }
                    for (var p = 0; p < stats.pstsg.length; p++) {
                        for (var stat in rosterObj[team].leaders) {
                            for (var i = 0; i >= 0; i++) {
                                if (rosterObj[team].leaders[stat][i][2] == '--' && stats.pstsg[p][stat] > 0) {
                                    rosterObj[team].leaders[stat][i][0] = stats.pstsg[p].fn.toUpperCase();
                                    rosterObj[team].leaders[stat][i][1] = stats.pstsg[p].ln.toUpperCase();
                                    rosterObj[team].leaders[stat][i][2] = stats.pstsg[p][stat];
                                    rosterObj[team].leaders[stat][i][3] = stats.pstsg[p].pid;
                                    break;
                                }
                                if (stats.pstsg[p][stat] > rosterObj[team].leaders[stat][i][2] && stats.pstsg[p][stat] > 0) {
                                    rosterObj[team].leaders[stat][i][0] = stats.pstsg[p].fn.toUpperCase();
                                    rosterObj[team].leaders[stat][i][1] = stats.pstsg[p].ln.toUpperCase();
                                    rosterObj[team].leaders[stat][i][2] = stats.pstsg[p][stat];
                                    rosterObj[team].leaders[stat][i][3] = stats.pstsg[p].pid;
                                    break;
                                }
                            };
                        }
                    }
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
                if (rosterObj[team].leaders[stat][i][0].length + rosterObj[team].leaders[stat][i][1].length >= 15) {
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
    }, 15000);
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
            var added = 0;
            for (var i = liveScores.length - 1; i >= 0; i--) {
                if (liveScores[i].h.ta !== 'BOS' && i < 11) {
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
        if (added < 5) {
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJzcmMvanMvY29uY291cnNlLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7QUNBQSxJQUFJLFlBQVk7QUFDWixhQUFTO0FBQ0wsZ0JBQVEsRUFESDtBQUVMLGlCQUFTO0FBQ0wsaUJBQUssQ0FDRCxDQUFDLElBQUQsRUFBTyxJQUFQLEVBQWEsSUFBYixFQUFtQixJQUFuQixDQURDLEVBRUQsQ0FBQyxJQUFELEVBQU8sSUFBUCxFQUFhLElBQWIsRUFBbUIsSUFBbkIsQ0FGQyxFQUdELENBQUMsSUFBRCxFQUFPLElBQVAsRUFBYSxJQUFiLEVBQW1CLElBQW5CLENBSEMsQ0FEQTtBQU1MLGlCQUFLLENBQ0QsQ0FBQyxJQUFELEVBQU8sSUFBUCxFQUFhLElBQWIsRUFBbUIsSUFBbkIsQ0FEQyxFQUVELENBQUMsSUFBRCxFQUFPLElBQVAsRUFBYSxJQUFiLEVBQW1CLElBQW5CLENBRkMsRUFHRCxDQUFDLElBQUQsRUFBTyxJQUFQLEVBQWEsSUFBYixFQUFtQixJQUFuQixDQUhDLENBTkE7QUFXTCxpQkFBSyxDQUNELENBQUMsSUFBRCxFQUFPLElBQVAsRUFBYSxJQUFiLEVBQW1CLElBQW5CLENBREMsRUFFRCxDQUFDLElBQUQsRUFBTyxJQUFQLEVBQWEsSUFBYixFQUFtQixJQUFuQixDQUZDLEVBR0QsQ0FBQyxJQUFELEVBQU8sSUFBUCxFQUFhLElBQWIsRUFBbUIsSUFBbkIsQ0FIQztBQVhBO0FBRkosS0FERztBQXFCWixVQUFNO0FBQ0YsZ0JBQVEsRUFETjtBQUVGLGlCQUFTO0FBQ0wsaUJBQUssQ0FDRCxDQUFDLElBQUQsRUFBTyxJQUFQLEVBQWEsSUFBYixFQUFtQixJQUFuQixDQURDLEVBRUQsQ0FBQyxJQUFELEVBQU8sSUFBUCxFQUFhLElBQWIsRUFBbUIsSUFBbkIsQ0FGQyxFQUdELENBQUMsSUFBRCxFQUFPLElBQVAsRUFBYSxJQUFiLEVBQW1CLElBQW5CLENBSEMs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RDtBQUNIO0FBQ0osS0FURCxFQVNHLEtBVEg7QUFVSCIsImZpbGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uIGUodCxuLHIpe2Z1bmN0aW9uIHMobyx1KXtpZighbltvXSl7aWYoIXRbb10pe3ZhciBhPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7aWYoIXUmJmEpcmV0dXJuIGEobywhMCk7aWYoaSlyZXR1cm4gaShvLCEwKTt2YXIgZj1uZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK28rXCInXCIpO3Rocm93IGYuY29kZT1cIk1PRFVMRV9OT1RfRk9VTkRcIixmfXZhciBsPW5bb109e2V4cG9ydHM6e319O3Rbb11bMF0uY2FsbChsLmV4cG9ydHMsZnVuY3Rpb24oZSl7dmFyIG49dFtvXVsxXVtlXTtyZXR1cm4gcyhuP246ZSl9LGwsbC5leHBvcnRzLGUsdCxuLHIpfXJldHVybiBuW29dLmV4cG9ydHN9dmFyIGk9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtmb3IodmFyIG89MDtvPHIubGVuZ3RoO28rKylzKHJbb10pO3JldHVybiBzfSkiLCJ2YXIgcm9zdGVyT2JqID0ge1xuICAgIGNlbHRpY3M6IHtcbiAgICAgICAgcm9zdGVyOiB7fSxcbiAgICAgICAgbGVhZGVyczoge1xuICAgICAgICAgICAgcHRzOiBbXG4gICAgICAgICAgICAgICAgWyctLScsICctLScsICctLScsICctLSddLFxuICAgICAgICAgICAgICAgIFsnLS0nLCAnLS0nLCAnLS0nLCAnLS0nXSxcbiAgICAgICAgICAgICAgICBbJy0tJywgJy0tJywgJy0tJywgJy0tJ11cbiAgICAgICAgICAgIF0sXG4gICAgICAgICAgICBhc3Q6IFtcbiAgICAgICAgICAgICAgICBbJy0tJywgJy0tJywgJy0tJywgJy0tJ10sXG4gICAgICAgICAgICAgICAgWyctLScsICctLScsICctLScsICctLSddLFxuICAgICAgICAgICAgICAgIFsnLS0nLCAnLS0nLCAnLS0nLCAnLS0nXVxuICAgICAgICAgICAgXSxcbiAgICAgICAgICAgIHJlYjogW1xuICAgICAgICAgICAgICAgIFsnLS0nLCAnLS0nLCAnLS0nLCAnLS0nXSxcbiAgICAgICAgICAgICAgICBbJy0tJywgJy0tJywgJy0tJywgJy0tJ10sXG4gICAgICAgICAgICAgICAgWyctLScsICctLScsICctLScsICctLSddXG4gICAgICAgICAgICBdXG4gICAgICAgIH1cbiAgICB9LFxuICAgIGF3YXk6IHtcbiAgICAgICAgcm9zdGVyOiB7fSxcbiAgICAgICAgbGVhZGVyczoge1xuICAgICAgICAgICAgcHRzOiBbXG4gICAgICAgICAgICAgICAgWyctLScsICctLScsICctLScsICctLSddLFxuICAgICAgICAgICAgICAgIFsnLS0nLCAnLS0nLCAnLS0nLCAnLS0nXSxcbiAgICAgICAgICAgICAgICBbJy0tJywgJy0tJywgJy0tJywgJy0tJ11cbiAgICAgICAgICAgIF0sXG4gICAgICAgICAgICBhc3Q6IFtcbiAgICAgICAgICAgICAgICBbJy0tJywgJy0tJywgJy0tJywgJy0tJ10sXG4gICAgICAgICAgICAgICAgWyctLScsICctLScsICctLScsICctLSddLFxuICAgICAgICAgICAgICAgIFsnLS0nLCAnLS0nLCAnLS0nLCAnLS0nXVxuICAgICAgICAgICAgXSxcbiAgICAgICAgICAgIHJlYjogW1xuICAgICAgICAgICAgICAgIFsnLS0nLCAnLS0nLCAnLS0nLCAnLS0nXSxcbiAgICAgICAgICAgICAgICBbJy0tJywgJy0tJywgJy0tJywgJy0tJ10sXG4gICAgICAgICAgICAgICAgWyctLScsICctLScsICctLScsICctLSddXG4gICAgICAgICAgICBdXG4gICAgICAgIH1cbiAgICB9XG59O1xuXG4vLyBMT0NBTFxuLyp2YXIgZmVlZHMgPSB7XG4gICAgdG9kYXlzU2NvcmVzOiAnaHR0cDovL2xvY2FsaG9zdDo4ODg4L2RhdGEvbW9iaWxlLXN0YXRzLWZlZWQvdG9kYXlzX3Njb3Jlcy5qc29uJyxcbiAgICBjZWx0aWNzUm9zdGVyOiAnaHR0cDovL2xvY2FsaG9zdDo4ODg4L2RhdGEvbW9iaWxlLXN0YXRzLWZlZWQvY2VsdGljc19yb3N0ZXIuanNvbicsXG4gICAgYXdheVJvc3RlcjogZnVuY3Rpb24oYXdheVRuKXtcbiAgICAgICAgcmV0dXJuICdodHRwOi8vbG9jYWxob3N0Ojg4ODgvZGF0YS9tb2JpbGUtc3RhdHMtZmVlZC9hd2F5X3Jvc3Rlci5qc29uJztcbiAgICB9LFxuICAgIGJpb0RhdGE6ICdodHRwOi8vbG9jYWxob3N0Ojg4ODgvZGF0YS9iaW8tZGF0YS5qc29uJyxcbiAgICBwbGF5ZXJjYXJkOiBmdW5jdGlvbihwaWQpe1xuICAgICAgICByZXR1cm4gJ2h0dHA6Ly9sb2NhbGhvc3Q6ODg4OC9kYXRhL21vYmlsZS1zdGF0cy1mZWVkL3BsYXllcmNhcmRzL3BsYXllcmNhcmQtJyArIHBpZCArICcuanNvbic7XG4gICAgfSxcbiAgICBwbGF5ZXJjYXJkQXdheTogZnVuY3Rpb24ocGlkKXtcbiAgICAgICAgcmV0dXJuICdodHRwOi8vbG9jYWxob3N0Ojg4ODgvZGF0YS9tb2JpbGUtc3RhdHMtZmVlZC9wbGF5ZXJjYXJkcy9wbGF5ZXJjYXJkLTIwMjMzMC5qc29uJztcbiAgICB9LFxuICAgIGdhbWVkZXRhaWw6IGZ1bmN0aW9uKGdpZCkge1xuICAgICAgICByZXR1cm4gJ2h0dHA6Ly9sb2NhbGhvc3Q6ODg4OC9kYXRhL21vYmlsZS1zdGF0cy1mZWVkL2dhbWVkZXRhaWwuanNvbic7XG4gICAgfSxcbiAgICBzdGFuZGluZ3M6ICdodHRwOi8vbG9jYWxob3N0Ojg4ODgvZGF0YS9tb2JpbGUtc3RhdHMtZmVlZC9zdGFuZGluZ3MuanNvbicsXG4gICAgbGVhZ3VlTGVhZGVyczogJ2h0dHA6Ly9sb2NhbGhvc3Q6ODg4OC9kYXRhL2xlYWd1ZV9sZWFkZXJzLmpzb24nXG59O1xuKi9cbi8vIE9OTElORVxuXG52YXIgZmVlZHMgPSB7XG4gICAgdG9kYXlzU2NvcmVzOiAnaHR0cDovL2RhdGEubmJhLmNvbS9kYXRhL3YyMDE1L2pzb24vbW9iaWxlX3RlYW1zL25iYS8yMDE3L3Njb3Jlcy8wMF90b2RheXNfc2NvcmVzLmpzb24nLFxuICAgIGNlbHRpY3NSb3N0ZXI6ICdodHRwOi8vZGF0YS5uYmEuY29tL2RhdGEvdjIwMTUvanNvbi9tb2JpbGVfdGVhbXMvbmJhLzIwMTcvdGVhbXMvY2VsdGljc19yb3N0ZXIuanNvbicsXG4gICAgYXdheVJvc3RlcjogZnVuY3Rpb24oYXdheVRuKXtcbiAgICAgICAgcmV0dXJuICdodHRwOi8vZGF0YS5uYmEuY29tL2RhdGEvdjIwMTUvanNvbi9tb2JpbGVfdGVhbXMvbmJhLzIwMTcvdGVhbXMvJyArIGF3YXlUbiArICdfcm9zdGVyLmpzb24nO1xuICAgIH0sXG4gICAgYmlvRGF0YTogJ2h0dHA6Ly9pby5jbm4ubmV0L25iYS9uYmEvLmVsZW1lbnQvbWVkaWEvMi4wL3RlYW1zaXRlcy9jZWx0aWNzL2pzb24vYmlvLWRhdGEuanNvbicsXG4gICAgcGxheWVyY2FyZDogZnVuY3Rpb24ocGlkKXtcbiAgICAgICAgcmV0dXJuICdodHRwOi8vZGF0YS5uYmEuY29tL2RhdGEvdjIwMTUvanNvbi9tb2JpbGVfdGVhbXMvbmJhLzIwMTcvcGxheWVycy9wbGF5ZXJjYXJkXycgKyBwaWQgKyAnXzAyLmpzb24nO1xuICAgIH0sXG4gICAgcGxheWVyY2FyZEF3YXk6IGZ1bmN0aW9uKHBpZCl7XG4gICAgICAgIHJldHVybiAnaHR0cDovL2RhdGEubmJhLmNvbS9kYXRhL3YyMDE1L2pzb24vbW9iaWxlX3RlYW1zL25iYS8yMDE3L3BsYXllcnMvcGxheWVyY2FyZF8nICsgcGlkICsgJ18wMi5qc29uJztcbiAgICB9LFxuICAgIGdhbWVkZXRhaWw6IGZ1bmN0aW9uKGdpZCkge1xuICAgICAgICByZXR1cm4gJ2h0dHA6Ly9kYXRhLm5iYS5jb20vZGF0YS92MjAxNS9qc29uL21vYmlsZV90ZWFtcy9uYmEvMjAxNy9zY29yZXMvZ2FtZWRldGFpbC8nICsgZ2lkICsgJ19nYW1lZGV0YWlsLmpzb24nO1xuICAgIH0sXG4gICAgc3RhbmRpbmdzOiAnaHR0cDovL2RhdGEubmJhLmNvbS9kYXRhL3YyMDE1L2pzb24vbW9iaWxlX3RlYW1zL25iYS8yMDE3LzAwX3N0YW5kaW5ncy5qc29uJyxcbiAgICBsZWFndWVMZWFkZXJzOiAnaHR0cDovL3N0YXRzLm5iYS5jb20vc3RhdHMvaG9tZXBhZ2V2Mj9HYW1lU2NvcGU9U2Vhc29uJkxlYWd1ZUlEPTAwJlBsYXllck9yVGVhbT1QbGF5ZXImUGxheWVyU2NvcGU9QWxsK1BsYXllcnMmU2Vhc29uPTIwMTctMTgmU2Vhc29uVHlwZT1SZWd1bGFyK1NlYXNvbiZTdGF0VHlwZT1UcmFkaXRpb25hbCZjYWxsYmFjaz0/J1xufTtcblxudmFyIGdhbWVTdGFydGVkID0gZmFsc2U7XG5sZXQgcGxheWVyU3BvdGxpZ2h0Q291bnRlciA9IDE7XG5cbmpRdWVyeShkb2N1bWVudCkucmVhZHkoZnVuY3Rpb24oKSB7XG4gICAgdmFyIGdpZCA9ICcnO1xuICAgIHZhciBhd2F5VGVhbSA9ICcnO1xuICAgIHZhciBhd2F5VG4gPSAnJztcbiAgICB2YXIgZGF0ZSA9IG5ldyBEYXRlKCk7XG4gICAgdmFyIGxlZnRXcmFwQ291bnRlciA9IGZhbHNlO1xuICAgIGpRdWVyeS5hamF4KHtcbiAgICAgICAgdXJsOiBmZWVkcy50b2RheXNTY29yZXMsXG4gICAgICAgIGFzeW5jOiBmYWxzZSxcbiAgICAgICAgc3VjY2VzczogZnVuY3Rpb24odG9kYXlzU2NvcmVzRGF0YSkge1xuICAgICAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCB0b2RheXNTY29yZXNEYXRhLmdzLmcubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgICAgICBpZiAodG9kYXlzU2NvcmVzRGF0YS5ncy5nW2ldLmgudGEgPT0gJ0JPUycpIHsgLy9DSEFOR0UgVEhJU1xuICAgICAgICAgICAgICAgICAgICBhd2F5VGVhbSA9IHRvZGF5c1Njb3Jlc0RhdGEuZ3MuZ1tpXS52LnRhO1xuICAgICAgICAgICAgICAgICAgICBhd2F5VG4gPSB0b2RheXNTY29yZXNEYXRhLmdzLmdbaV0udi50bi50b0xvd2VyQ2FzZSgpO1xuICAgICAgICAgICAgICAgICAgICBnaWQgPSB0b2RheXNTY29yZXNEYXRhLmdzLmdbaV0uZ2lkO1xuICAgICAgICAgICAgICAgICAgICBsb2FkUm9zdGVyRGF0YShhd2F5VGVhbSwgYXdheVRuKTtcbiAgICAgICAgICAgICAgICAgICAgc2NvcmVzSW5pdCh0b2RheXNTY29yZXNEYXRhKTtcbiAgICAgICAgICAgICAgICAgICAgc3RhbmRpbmdzSW5pdChhd2F5VGVhbSk7XG4vKiAgICAgICAgICAgICAgICAgICAgbW9iaWxlQXBwSW5pdCgpOyovXG4gICAgICAgICAgICAgICAgICAgIGxlYWd1ZUxlYWRlcnMoKTtcbiAgICAgICAgICAgICAgICAgICAgbGVmdFdyYXAoKTtcbiAgICAgICAgICAgICAgICAgICAgLy8gVFJBTlNJVElPTlNcbiAgICAgICAgICAgICAgICAgICAgZnVuY3Rpb24gY3ljbGUoKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBtb2JpbGVBcHAoKTsgLy8gRFVSQVRJT046IDI1c1xuICAgICAgICAgICAgICAgICAgICAgICAgc2V0VGltZW91dChmdW5jdGlvbigpe1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGxlYWRlcnMoZ2lkKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH0sIDI1MDAwKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHNldFRpbWVvdXQoc29jaWFsLCA2OTAwMCk7XG4vKiAgICAgICAgICAgICAgICAgICAgICAgIHNldFRpbWVvdXQoZnVuY3Rpb24oKXtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBwbGF5ZXJTcG90bGlnaHQocm9zdGVyT2JqKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH0sIDc5MDAwKTsqL1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIGN5Y2xlKCk7XG4gICAgICAgICAgICAgICAgICAgIHNldEludGVydmFsKGN5Y2xlLCA4NTAwMCk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfSk7XG4gICAgLy8gbG9hZFJvc3RlckRhdGEoKTsgT05MWSBPTkNFXG4gICAgLyogICAgc2V0VGltZW91dChsZWFkZXJzKGdpZCwgZ2FtZVN0YXJ0ZWQpLCA0MDApOyovXG59KTtcblxuZnVuY3Rpb24gY3ljbGUoKSB7XG5cbn1cbi8qPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbj0gICAgICAgICAgICBNSVNDIEZVTkNUSU9OUyAgICAgICAgICAgID1cbj09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09Ki9cbmZ1bmN0aW9uIHBsYXllckFnZShkb2IpIHtcbiAgICB2YXIgdG9kYXkgPSBuZXcgRGF0ZSgpO1xuICAgIHZhciBiaXJ0aERhdGUgPSBuZXcgRGF0ZShkb2IpO1xuICAgIHZhciBhZ2UgPSB0b2RheS5nZXRGdWxsWWVhcigpIC0gYmlydGhEYXRlLmdldEZ1bGxZZWFyKCk7XG4gICAgcmV0dXJuIGFnZTtcbn1cblxuZnVuY3Rpb24gZ2VuZXJhdGVUaW1lbGluZShzZWxlY3RlZFBsYXllcikge1xuICAgIC8vIEFQUEVORDogVElNRUxJTkVcbiAgICB2YXIgc2Vhc29uc1BsYXllZCA9IHJvc3Rlck9iai5jZWx0aWNzLnJvc3RlcltzZWxlY3RlZFBsYXllcl0uc3RhdHMuc2EubGVuZ3RoO1xuICAgIHZhciB0aW1lbGluZUhUTUwgPSAnJztcbiAgICB2YXIgc2Vhc29uWWVhckhUTUwgPSAnJztcbiAgICBmb3IgKHZhciBpID0gMDsgaSA8IHNlYXNvbnNQbGF5ZWQ7IGkrKykge1xuICAgICAgICB2YXIgdGVhbUFiYnJldmlhdGlvbiA9IHJvc3Rlck9iai5jZWx0aWNzLnJvc3RlcltzZWxlY3RlZFBsYXllcl0uc3RhdHMuc2FbaV0udGE7XG4gICAgICAgIHZhciB0cmFkZWQgPSByb3N0ZXJPYmouY2VsdGljcy5yb3N0ZXJbc2VsZWN0ZWRQbGF5ZXJdLnN0YXRzLnNhW2ldLnNwbC5sZW5ndGg7XG4gICAgICAgIHZhciBzZWdtZW50SW5uZXIgPSBcIlwiO1xuICAgICAgICB2YXIgdGl0bGUgPSBcIlwiO1xuICAgICAgICB2YXIgc2Vhc29uWWVhclRleHQgPSByb3N0ZXJPYmouY2VsdGljcy5yb3N0ZXJbc2VsZWN0ZWRQbGF5ZXJdLnN0YXRzLnNhW2ldLnZhbDtcbiAgICAgICAgaWYgKGkgPT09IDAgfHwgdGVhbUFiYnJldmlhdGlvbiAhPT0gcm9zdGVyT2JqLmNlbHRpY3Mucm9zdGVyW3NlbGVjdGVkUGxheWVyXS5zdGF0cy5zYVtpIC0gMV0udGEpIHsgLy8gSWYgdGhpcyBpcyBhIG5ldyB0ZWFtLCBzdGFydCB0aGUgdGVhbSB3cmFwLlxuICAgICAgICAgICAgdGl0bGUgPSB0ZWFtQWJicmV2aWF0aW9uO1xuICAgICAgICB9XG4gICAgICAgIGlmICh0cmFkZWQpIHtcbiAgICAgICAgICAgIGZvciAodmFyIHggPSAwOyB4IDwgdHJhZGVkOyB4KyspIHtcbiAgICAgICAgICAgICAgICB2YXIgZ3BUb3QgPSByb3N0ZXJPYmouY2VsdGljcy5yb3N0ZXJbc2VsZWN0ZWRQbGF5ZXJdLnN0YXRzLnNhW2ldLmdwO1xuICAgICAgICAgICAgICAgIHZhciBncCA9IHJvc3Rlck9iai5jZWx0aWNzLnJvc3RlcltzZWxlY3RlZFBsYXllcl0uc3RhdHMuc2FbaV0uc3BsW3hdLmdwO1xuICAgICAgICAgICAgICAgIHZhciBncFBlcmNlbnRhZ2UgPSBNYXRoLnJvdW5kKChncCAvIGdwVG90KSAqIDEwMCk7XG4gICAgICAgICAgICAgICAgdGVhbUFiYnJldmlhdGlvbiA9IHJvc3Rlck9iai5jZWx0aWNzLnJvc3RlcltzZWxlY3RlZFBsYXllcl0uc3RhdHMuc2FbaV0uc3BsW3hdLnRhO1xuICAgICAgICAgICAgICAgIGlmIChpID09PSAwIHx8IHRlYW1BYmJyZXZpYXRpb24gIT09IHJvc3Rlck9iai5jZWx0aWNzLnJvc3RlcltzZWxlY3RlZFBsYXllcl0uc3RhdHMuc2FbaSAtIDFdLnRhICYmIHRlYW1BYmJyZXZpYXRpb24gIT09IHJvc3Rlck9iai5jZWx0aWNzLnJvc3RlcltzZWxlY3RlZFBsYXllcl0uc3RhdHMuc2FbaSArIDFdLnRhKSB7IC8vIElmIHRoaXMgaXMgYSBuZXcgdGVhbSwgc3RhcnQgdGhlIHRlYW0gd3JhcC5cbiAgICAgICAgICAgICAgICAgICAgdGl0bGUgPSB0ZWFtQWJicmV2aWF0aW9uO1xuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIHRpdGxlID0gXCJcIjtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgc2VnbWVudElubmVyICs9ICc8ZGl2IGRhdGEtc2Vhc29uLXllYXI9XCInICsgc2Vhc29uWWVhclRleHQgKyAnXCIgZGF0YS10ZWFtPVwiJyArIHRlYW1BYmJyZXZpYXRpb24gKyAnXCIgc3R5bGU9XCJcIiBjbGFzcz1cInNlZ21lbnQtaW5uZXIgJyArIHRlYW1BYmJyZXZpYXRpb24gKyAnLWJnXCI+PHA+JyArIHRpdGxlICsgJzwvcD48L2Rpdj4nO1xuICAgICAgICAgICAgfVxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgc2VnbWVudElubmVyID0gJzxkaXYgZGF0YS1zZWFzb24teWVhcj1cIicgKyBzZWFzb25ZZWFyVGV4dCArICdcIiBkYXRhLXRlYW09XCInICsgdGVhbUFiYnJldmlhdGlvbiArICdcIiBjbGFzcz1cInNlZ21lbnQtaW5uZXIgJyArIHRlYW1BYmJyZXZpYXRpb24gKyAnLWJnXCI+PHA+JyArIHRpdGxlICsgJzwvcD48L2Rpdj4nO1xuICAgICAgICB9XG4gICAgICAgIHRpbWVsaW5lSFRNTCArPSAnPGRpdiBjbGFzcz1cInNlZ21lbnRcIj4nICsgc2VnbWVudElubmVyICsgJzwvZGl2Pic7XG4gICAgICAgIHNlYXNvblllYXJIVE1MICs9ICc8ZGl2IGNsYXNzPVwic2VnbWVudFwiPjxwPicgKyBzZWFzb25ZZWFyVGV4dCArICc8L3A+PC9kaXY+JztcbiAgICB9XG4gICAgalF1ZXJ5KFwiLnRpbWVsaW5lLXdyYXBcIikuaHRtbCgnPGRpdiBjbGFzcz1cInRpbWVsaW5lIGFwcGVuZGVkXCI+JyArIHRpbWVsaW5lSFRNTCArICc8L2Rpdj48ZGl2IGNsYXNzPVwic2Vhc29uLXllYXIgYXBwZW5kZWRcIj4nICsgc2Vhc29uWWVhckhUTUwgKyAnPC9kaXY+Jyk7XG59XG5cbmZ1bmN0aW9uIGNyZWF0ZUluZGV4KGtleXMsIGFycmF5KSB7XG4gICAgdmFyIG5ld0FyciA9IGtleXMubWFwKGl0ZW0gPT4gYXJyYXkuaW5kZXhPZihpdGVtKSk7XG4gICAgcmV0dXJuIG5ld0Fycjtcbn1cblxuZnVuY3Rpb24gcm91bmQobnVtYmVyKSB7XG4gICAgaWYgKHR5cGVvZiBudW1iZXIgIT09IFwibnVtYmVyXCIgfHwgbnVtYmVyID09IHVuZGVmaW5lZCkge1xuICAgICAgICByZXR1cm4gbnVtYmVyO1xuICAgIH0gZWxzZSB7XG4gICAgICAgIHJldHVybiBudW1iZXIudG9GaXhlZCgxKTtcbiAgICB9XG59XG4vKj09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbj0gICAgICAgICAgICBJTklUSUFMSVpFICAgICAgICAgICAgPVxuPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PSovXG5mdW5jdGlvbiBjaGVja0dhbWVTdGF0dXMoKSB7XG4gICAgaWYgKCFnYW1lU3RhcnRlZCkge1xuICAgICAgICBqUXVlcnkuYWpheCh7XG4gICAgICAgICAgICB1cmw6IGZlZWRzLnRvZGF5c1Njb3JlcyxcbiAgICAgICAgICAgIGFzeW5jOiBmYWxzZSxcbiAgICAgICAgICAgIHN1Y2Nlc3M6IGZ1bmN0aW9uKHRvZGF5c1Njb3Jlc0RhdGEpIHtcbiAgICAgICAgICAgICAgICB2YXIgZ2lkID0gJyc7XG4gICAgICAgICAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCB0b2RheXNTY29yZXNEYXRhLmdzLmcubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgICAgICAgICAgaWYgKHRvZGF5c1Njb3Jlc0RhdGEuZ3MuZ1tpXS5oLnRhID09ICdCT1MnKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAodG9kYXlzU2NvcmVzRGF0YS5ncy5nW2ldICE9PSAxKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZ2FtZVN0YXJ0ZWQgPSB0cnVlO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICB9XG4gICAgcmV0dXJuIHRydWU7XG59O1xuLyo9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbj0gICAgICAgICAgICBMT0FEIFJPU1RFUiBJTkZPIChidWlsZCByb3N0ZXJPYmopICAgICAgICAgICAgICA9XG49PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT0qL1xuXG5mdW5jdGlvbiBsb2FkUm9zdGVyRGF0YShhd2F5VGVhbSwgYXdheVRuKSB7XG4gICAgdmFyIHJvc3RlciA9ICcnO1xuICAgIGpRdWVyeS5hamF4KHtcbiAgICAgICAgdXJsOiBmZWVkcy5jZWx0aWNzUm9zdGVyLFxuICAgICAgICBhc3luYzogZmFsc2UsXG4gICAgICAgIHN1Y2Nlc3M6IGZ1bmN0aW9uKGRhdGEpIHtcbiAgICAgICAgICAgIHJvc3RlciA9IGRhdGE7XG4gICAgICAgICAgICBmb3IgKHZhciBwcm9wZXJ0eSBpbiByb3N0ZXIudCkge1xuICAgICAgICAgICAgICAgIGlmIChwcm9wZXJ0eSAhPT0gJ3BsJykge1xuICAgICAgICAgICAgICAgICAgICByb3N0ZXJPYmouY2VsdGljc1twcm9wZXJ0eV0gPSByb3N0ZXIudFtwcm9wZXJ0eV07XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9LFxuICAgICAgICBlcnJvcjogZnVuY3Rpb24oKSB7fVxuICAgIH0pO1xuICAgIHZhciBhd2F5Um9zdGVyID0gJyc7XG4gICAgalF1ZXJ5LmFqYXgoe1xuICAgICAgICB1cmw6IGZlZWRzLmF3YXlSb3N0ZXIoYXdheVRuKSxcbiAgICAgICAgYXN5bmM6IGZhbHNlLFxuICAgICAgICBzdWNjZXNzOiBmdW5jdGlvbihkYXRhKSB7XG4gICAgICAgICAgICBhd2F5Um9zdGVyID0gZGF0YTtcbiAgICAgICAgICAgIGZvciAodmFyIHByb3BlcnR5IGluIGF3YXlSb3N0ZXIudCkge1xuICAgICAgICAgICAgICAgIGlmIChwcm9wZXJ0eSAhPT0gJ3BsJykge1xuICAgICAgICAgICAgICAgICAgICByb3N0ZXJPYmouYXdheVtwcm9wZXJ0eV0gPSBhd2F5Um9zdGVyLnRbcHJvcGVydHldO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfSxcbiAgICAgICAgZXJyb3I6IGZ1bmN0aW9uKCkge31cbiAgICB9KTtcbiAgICB2YXIgYmlvRGF0YSA9ICcnO1xuICAgIGpRdWVyeS5hamF4KHtcbiAgICAgICAgdXJsOiBmZWVkcy5iaW9EYXRhLFxuICAgICAgICBhc3luYzogZmFsc2UsXG4gICAgICAgIHN1Y2Nlc3M6IGZ1bmN0aW9uKGRhdGEpIHtcbiAgICAgICAgICAgIGJpb0RhdGEgPSBkYXRhO1xuICAgICAgICB9LFxuICAgICAgICBlcnJvcjogZnVuY3Rpb24oKSB7fVxuICAgIH0pO1xuICAgIGZvciAodmFyIGkgPSAwOyBpIDwgcm9zdGVyLnQucGwubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgdmFyIHBpZCA9IHJvc3Rlci50LnBsW2ldLnBpZDtcbiAgICAgICAgcm9zdGVyT2JqLmNlbHRpY3Mucm9zdGVyW3BpZF0gPSByb3N0ZXIudC5wbFtpXTtcbiAgICAgICAgZm9yICh2YXIgcHJvcGVydHkgaW4gYmlvRGF0YVtwaWRdKSB7XG4gICAgICAgICAgICByb3N0ZXJPYmouY2VsdGljcy5yb3N0ZXJbcGlkXS5iaW8gPSBiaW9EYXRhW3BpZF07XG4gICAgICAgIH07XG4gICAgICAgIGpRdWVyeS5hamF4KHtcbiAgICAgICAgICAgIHVybDogZmVlZHMucGxheWVyY2FyZChwaWQpLFxuICAgICAgICAgICAgYXN5bmM6IGZhbHNlLFxuICAgICAgICAgICAgc3VjY2VzczogZnVuY3Rpb24oZGF0YSkge1xuICAgICAgICAgICAgICAgIGlmIChkYXRhLnBsLmNhLmhhc093blByb3BlcnR5KCdzYScpKXtcbiAgICAgICAgICAgICAgICAgICAgcm9zdGVyT2JqLmNlbHRpY3Mucm9zdGVyW3BpZF0uc3RhdHMgPSBkYXRhLnBsLmNhLnNhWyhkYXRhLnBsLmNhLnNhLmxlbmd0aCAtIDEpXTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIHJvc3Rlck9iai5jZWx0aWNzLnJvc3RlcltwaWRdLnN0YXRzID0gZGF0YS5wbC5jYTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgZXJyb3I6IGZ1bmN0aW9uKCkge31cbiAgICAgICAgfSk7XG4gICAgfVxuICAgIGZvciAodmFyIGkgPSAwOyBpIDwgYXdheVJvc3Rlci50LnBsLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgIHZhciBwaWQgPSBhd2F5Um9zdGVyLnQucGxbaV0ucGlkO1xuICAgICAgICByb3N0ZXJPYmouYXdheS5yb3N0ZXJbcGlkXSA9IGF3YXlSb3N0ZXIudC5wbFtpXTtcbiAgICAgICAgalF1ZXJ5LmFqYXgoe1xuICAgICAgICAgICAgdXJsOiBmZWVkcy5wbGF5ZXJjYXJkQXdheShwaWQpLCAvLyBDSEFOR0UgUElEXG4gICAgICAgICAgICBhc3luYzogZmFsc2UsXG4gICAgICAgICAgICBzdWNjZXNzOiBmdW5jdGlvbihkYXRhKSB7XG4gICAgICAgICAgICAgICAgaWYgKGRhdGEucGwuY2EuaGFzT3duUHJvcGVydHkoJ3NhJykpe1xuICAgICAgICAgICAgICAgICAgICByb3N0ZXJPYmouYXdheS5yb3N0ZXJbcGlkXS5zdGF0cyA9IGRhdGEucGwuY2Euc2FbKGRhdGEucGwuY2Euc2EubGVuZ3RoIC0gMSldO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgcm9zdGVyT2JqLmF3YXkucm9zdGVyW3BpZF0uc3RhdHMgPSBkYXRhLnBsLmNhO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBlcnJvcjogZnVuY3Rpb24oKSB7fVxuICAgICAgICB9KTtcbiAgICB9XG4gICAgZm9yICh2YXIgdGVhbSBpbiByb3N0ZXJPYmopIHtcbiAgICAgICAgZm9yICh2YXIgcGxheWVyIGluIHJvc3Rlck9ialt0ZWFtXS5yb3N0ZXIpIHtcbiAgICAgICAgICAgIGZvciAodmFyIHN0YXQgaW4gcm9zdGVyT2JqW3RlYW1dLmxlYWRlcnMpIHtcbiAgICAgICAgICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IDM7IGkrKykge1xuICAgICAgICAgICAgICAgICAgICBpZiAocm9zdGVyT2JqW3RlYW1dLmxlYWRlcnNbc3RhdF1baV1bMl0gPT0gJy0tJyAmJiByb3N0ZXJPYmpbdGVhbV0ucm9zdGVyW3BsYXllcl0uc3RhdHNbc3RhdF0gPiAwKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICByb3N0ZXJPYmpbdGVhbV0ubGVhZGVyc1tzdGF0XVtpXVswXSA9IHJvc3Rlck9ialt0ZWFtXS5yb3N0ZXJbcGxheWVyXS5mbi50b1VwcGVyQ2FzZSgpO1xuICAgICAgICAgICAgICAgICAgICAgICAgcm9zdGVyT2JqW3RlYW1dLmxlYWRlcnNbc3RhdF1baV1bMV0gPSByb3N0ZXJPYmpbdGVhbV0ucm9zdGVyW3BsYXllcl0ubG4udG9VcHBlckNhc2UoKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJvc3Rlck9ialt0ZWFtXS5sZWFkZXJzW3N0YXRdW2ldWzJdID0gcm9zdGVyT2JqW3RlYW1dLnJvc3RlcltwbGF5ZXJdLnN0YXRzW3N0YXRdO1xuICAgICAgICAgICAgICAgICAgICAgICAgcm9zdGVyT2JqW3RlYW1dLmxlYWRlcnNbc3RhdF1baV1bM10gPSByb3N0ZXJPYmpbdGVhbV0ucm9zdGVyW3BsYXllcl0ucGlkO1xuICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgICAgIH0gZWxzZSBpZiAocm9zdGVyT2JqW3RlYW1dLnJvc3RlcltwbGF5ZXJdLnN0YXRzW3N0YXRdID4gcm9zdGVyT2JqW3RlYW1dLmxlYWRlcnNbc3RhdF1baV1bMl0gJiYgcm9zdGVyT2JqW3RlYW1dLnJvc3RlcltwbGF5ZXJdLnN0YXRzW3N0YXRdID4gMCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgcm9zdGVyT2JqW3RlYW1dLmxlYWRlcnNbc3RhdF1baV1bMF0gPSByb3N0ZXJPYmpbdGVhbV0ucm9zdGVyW3BsYXllcl0uZm4udG9VcHBlckNhc2UoKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJvc3Rlck9ialt0ZWFtXS5sZWFkZXJzW3N0YXRdW2ldWzFdID0gcm9zdGVyT2JqW3RlYW1dLnJvc3RlcltwbGF5ZXJdLmxuLnRvVXBwZXJDYXNlKCk7XG4gICAgICAgICAgICAgICAgICAgICAgICByb3N0ZXJPYmpbdGVhbV0ubGVhZGVyc1tzdGF0XVtpXVsyXSA9IHJvc3Rlck9ialt0ZWFtXS5yb3N0ZXJbcGxheWVyXS5zdGF0c1tzdGF0XTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJvc3Rlck9ialt0ZWFtXS5sZWFkZXJzW3N0YXRdW2ldWzNdID0gcm9zdGVyT2JqW3RlYW1dLnJvc3RlcltwbGF5ZXJdLnBpZDtcbiAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cbiAgICBjb25zb2xlLmxvZyhyb3N0ZXJPYmopO1xufTtcblxuZnVuY3Rpb24gc3RhdHNOb3RBdmFpbGFibGUocGlkKSB7XG4gICAgcm9zdGVyT2JqW3BpZF0uc3RhdHMgPSB7fTtcbiAgICByb3N0ZXJPYmpbcGlkXS5zdGF0cy5zYSA9IFt7fV07XG4gICAgcm9zdGVyT2JqW3BpZF0uc3RhdHMuaGFzU3RhdHMgPSBmYWxzZTtcbiAgICB2YXIgY2FJbmRleCA9IFsnZ3AnLCAnZ3MnLCAnbWluJywgJ2ZncCcsICd0cHAnLCAnZnRwJywgJ29yZWInLCAnZHJlYicsICdyZWInLCAnYXN0JywgJ3N0bCcsICdibGsnLCAndG92JywgJ3BmJywgJ3B0cycsICdub3N0YXRzJ107XG4gICAgdmFyIHNhSW5kZXggPSBbJ3RpZCcsICd2YWwnLCAnZ3AnLCAnZ3MnLCAnbWluJywgJ2ZncCcsICd0cHAnLCAnZnRwJywgJ29yZWInLCAnZHJlYicsICdyZWInLCAnYXN0JywgJ3N0bCcsICdibGsnLCAndG92JywgJ3BmJywgJ3B0cycsICdzcGwnLCAndGEnLCAndG4nLCAndGMnXTtcbiAgICBmb3IgKHZhciBpID0gMDsgaSA8IHNhSW5kZXgubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgcm9zdGVyT2JqW3BpZF0uc3RhdHMuc2FbMF1bc2FJbmRleFtpXV0gPSBcIk4vQVwiO1xuICAgICAgICBpZiAoaSA9PT0gMSkge1xuICAgICAgICAgICAgcm9zdGVyT2JqW3BpZF0uc3RhdHMuc2FbMF1bc2FJbmRleFtpXV0gPSBwbGF5ZXJDYXJkWWVhci50b1N0cmluZygpLnN1YnN0cigyLCAyKSArIFwiLVwiICsgKHBsYXllckNhcmRZZWFyICsgMSkudG9TdHJpbmcoKS5zdWJzdHIoMiwgMik7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKGkgPT09IDE3KSB7XG4gICAgICAgICAgICByb3N0ZXJPYmpbcGlkXS5zdGF0cy5zYVswXVtzYUluZGV4W2ldXSA9IFtdO1xuICAgICAgICB9XG4gICAgICAgIGlmIChpID09PSAxOCkge1xuICAgICAgICAgICAgcm9zdGVyT2JqW3BpZF0uc3RhdHMuc2FbMF1bc2FJbmRleFtpXV0gPSAnQk9TJztcbiAgICAgICAgfVxuICAgIH1cbiAgICBmb3IgKHZhciBpID0gMDsgaSA8IGNhSW5kZXgubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgcm9zdGVyT2JqW3BpZF0uc3RhdHNbY2FJbmRleFtpXV0gPSBcIk4vQVwiO1xuICAgICAgICBpZiAoaSA9PT0gMTUpIHtcbiAgICAgICAgICAgIHJvc3Rlck9ialtwaWRdLnN0YXRzW2NhSW5kZXhbaV1dID0gdHJ1ZTtcbiAgICAgICAgfVxuICAgIH1cbn07XG5cbmZ1bmN0aW9uIGxvYWRHYW1lRGV0YWlsKGdpZCkge307XG5cbmZ1bmN0aW9uIGxvYWRBd2F5VGVhbURhdGEoKSB7fVxuLyo9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG49ICAgICAgICAgICAgUklHSFQgV1JBUCAgICAgICAgICAgID1cbj09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT0qL1xuXG5cbmZ1bmN0aW9uIHBsYXllclNwb3RsaWdodChyb3N0ZXJPYmopIHtcbiAgICAvKiAxIC0gV0hJVEUgTElORSBIT1JJWlRPTkFMICovXG4gICAgc2V0VGltZW91dChmdW5jdGlvbigpIHtcbiAgICAgICAgalF1ZXJ5KCcud2hpdGUtbGluZS5ob3Jpem9udGFsJykuYWRkQ2xhc3MoJ3RyYW5zaXRpb24tMScpO1xuICAgIH0sIDUwMCk7XG4gICAgc2V0VGltZW91dChmdW5jdGlvbigpIHtcbiAgICAgICAgalF1ZXJ5KCcuc29jaWFsLXRvcCAud2hpdGUtbGluZS52ZXJ0aWNhbDpudGgtY2hpbGQob2RkKScpLmFkZENsYXNzKCd0cmFuc2l0aW9uLTEnKTtcbiAgICAgICAgalF1ZXJ5KCcuc29jaWFsLWJvdHRvbSAud2hpdGUtbGluZS52ZXJ0aWNhbDpudGgtY2hpbGQoZXZlbiknKS5hZGRDbGFzcygndHJhbnNpdGlvbi0xJyk7XG4gICAgfSwgODAwKTtcbiAgICAvKiAyYiAtIFdISVRFIExJTkUgVkVSVElDQUwgKi9cbiAgICBzZXRUaW1lb3V0KGZ1bmN0aW9uKCkge1xuICAgICAgICBqUXVlcnkoJy5zb2NpYWwtdG9wIC53aGl0ZS1saW5lLnZlcnRpY2FsOm50aC1jaGlsZChldmVuKScpLmFkZENsYXNzKCd0cmFuc2l0aW9uLTEnKTtcbiAgICAgICAgalF1ZXJ5KCcuc29jaWFsLWJvdHRvbSAud2hpdGUtbGluZS52ZXJ0aWNhbDpudGgtY2hpbGQob2RkKScpLmFkZENsYXNzKCd0cmFuc2l0aW9uLTEnKTtcbiAgICB9LCAxMDAwKTtcbiAgICAvKiAzIC0gR0VORVJBVEUgQU5EIFJFVkVBTCBQTEFZRVIgQk9YRVMgKi9cbiAgICBzZXRUaW1lb3V0KGZ1bmN0aW9uKCkge1xuICAgICAgICBqUXVlcnkoJy5zb2NpYWwtdG9wLCAuc29jaWFsLWJvdHRvbScpLmFkZENsYXNzKCd0cmFuc2l0aW9uLTEnKTtcbiAgICAgICAgalF1ZXJ5KCcucGxheWVyLWJveC13cmFwJykuYWRkQ2xhc3MoJ3RyYW5zaXRpb24tMScpO1xuICAgIH0sIDEyMDApO1xuICAgIC8qIDQgLSBBUFBFTkQgSEVBRFNIT1RTICovXG4gICAgc2V0VGltZW91dChmdW5jdGlvbigpIHtcbiAgICAgICAgalF1ZXJ5KCcucGxheWVyLWJveC13cmFwJykuYWRkQ2xhc3MoJ3RyYW5zaXRpb24tMicpO1xuICAgICAgICBqUXVlcnkoJy5wbGF5ZXItYm94JykuYWRkQ2xhc3MoJ3RyYW5zaXRpb24tMScpO1xuICAgICAgICB2YXIgZGVsYXkgPSAwO1xuICAgICAgICB2YXIgZm9yaW5Db3VudGVyID0gMDtcbiAgICAgICAgZm9yICh2YXIgcGxheWVyIGluIHJvc3Rlck9iai5jZWx0aWNzLnJvc3Rlcikge1xuICAgICAgICAgICAgdmFyIGhlYWRzaG90ID0gJ2h0dHBzOi8vYWstc3RhdGljLmNtcy5uYmEuY29tL3dwLWNvbnRlbnQvdXBsb2Fkcy9oZWFkc2hvdHMvbmJhL2xhdGVzdC8xMDQweDc2MC8nICsgcm9zdGVyT2JqLmNlbHRpY3Mucm9zdGVyW3BsYXllcl0ucGlkICsgJy5wbmcnO1xuICAgICAgICAgICAgalF1ZXJ5KCcucGxheWVyLWJveDpudGgtY2hpbGQoJyArIChmb3JpbkNvdW50ZXIgKyAxKSArICcpJykuYXBwZW5kKCc8aW1nIGNsYXNzPVwiYXBwZW5kZWQgaGVhZHNob3RcIiBzcmM9XCInICsgaGVhZHNob3QgKyAnXCIvPicpO1xuICAgICAgICAgICAgalF1ZXJ5KCcucGxheWVyLWJveDpudGgtY2hpbGQoJyArIChmb3JpbkNvdW50ZXIgKyAxKSArICcpJykuYXR0cignZGF0YS1waWQnLCByb3N0ZXJPYmouY2VsdGljcy5yb3N0ZXJbcGxheWVyXS5waWQpO1xuICAgICAgICAgICAgalF1ZXJ5KCcucGxheWVyLWJveCBpbWcnKS5vbihcImVycm9yXCIsIGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgICAgIGpRdWVyeSh0aGlzKS5hdHRyKCdzcmMnLCAnaHR0cHM6Ly9pLmNkbi50dXJuZXIuY29tL25iYS9uYmEvLmVsZW1lbnQvbWVkaWEvMi4wL3RlYW1zaXRlcy9jZWx0aWNzL21lZGlhL2dlbmVyaWMtcGxheWVyLWxpZ2h0XzYwMHg0MzgucG5nJyk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIGpRdWVyeSgnLnBsYXllci1ib3g6bnRoLWNoaWxkKCcgKyAoZm9yaW5Db3VudGVyICsgMSkgKyAnKSBpbWcnKS5kZWxheShkZWxheSkuZmFkZVRvKDMwMCwgMSk7XG4gICAgICAgICAgICBkZWxheSArPSAzMDtcbiAgICAgICAgICAgIGZvcmluQ291bnRlcisrO1xuICAgICAgICB9XG4gICAgfSwgMzAwMCk7XG4gICAgLyogNSAtIFBMQVlFUiBTRUxFQ1QgKi9cbiAgICB2YXIgc2VsZWN0ZWRQbGF5ZXIgPSAnJztcbiAgICBzZXRUaW1lb3V0KGZ1bmN0aW9uKCkge1xuICAgICAgICBqUXVlcnkoJy5wbGF5ZXItYm94JykuYWRkQ2xhc3MoJ3RyYW5zaXRpb24tMicpO1xuICAgICAgICBqUXVlcnkoJy5wbGF5ZXItYm94Om50aC1jaGlsZCgnICsgKHBsYXllclNwb3RsaWdodENvdW50ZXIpICsgJyknKS5hZGRDbGFzcygnc2VsZWN0ZWQnKTtcbiAgICAgICAgc2VsZWN0ZWRQbGF5ZXIgPSBqUXVlcnkoJy5wbGF5ZXItYm94Om50aC1jaGlsZCgnICsgKHBsYXllclNwb3RsaWdodENvdW50ZXIpICsgJyknKS5hdHRyKCdkYXRhLXBpZCcpO1xuICAgICAgICBqUXVlcnkoJy5wbGF5ZXItYm94Jykubm90KCcucmVwbGFjZW1lbnQuc2VsZWN0ZWQnKS5kZWxheSg1MDApLmFkZENsYXNzKCd0cmFuc2l0aW9uLTQnKTtcbiAgICB9LCA0MDAwKTtcbiAgICAvKiA2IC0gUExBWUVSIEJPWCBFWFBBTkQgKi9cbiAgICBzZXRUaW1lb3V0KGZ1bmN0aW9uKCkge1xuICAgICAgICBqUXVlcnkoJy5ibG9jay13cmFwLnNvY2lhbCcpLmFkZENsYXNzKCd0cmFuc2l0aW9uLTMnKTtcbiAgICAgICAgalF1ZXJ5KCcucGxheWVyLWJveC5yZXBsYWNlbWVudC5zZWxlY3RlZCcpLmFkZENsYXNzKCd0cmFuc2l0aW9uLTMnKTtcbiAgICB9LCA1MDAwKTtcbiAgICAvKiA3IC0gU1BPVExJR0hUIEhUTUwgKi9cbiAgICBzZXRUaW1lb3V0KGZ1bmN0aW9uKCkge1xuICAgICAgICBnZW5lcmF0ZVRpbWVsaW5lKHNlbGVjdGVkUGxheWVyKTtcbiAgICAgICAgalF1ZXJ5KCcucGxheWVyLWJveC5yZXBsYWNlbWVudC5zZWxlY3RlZCcpLmNsb25lKCkuYXBwZW5kVG8oJy5ibG9jay13cmFwLnBsYXllci1zcG90bGlnaHQgLnRvcC13cmFwJyk7XG4gICAgICAgIGpRdWVyeSgnLnBsYXllci1zcG90bGlnaHQgLnNlbGVjdGVkJykuYWRkQ2xhc3MoJy5hcHBlbmRlZCcpO1xuICAgICAgICBqUXVlcnkoJy5ibG9jay13cmFwLnBsYXllci1zcG90bGlnaHQnKS5hZGRDbGFzcygndHJhbnNpdGlvbi0xJyk7XG4gICAgICAgIGpRdWVyeSgnLmJsb2NrLXdyYXAuc29jaWFsJykuYWRkQ2xhc3MoJ3RyYW5zaXRpb24tMScpO1xuICAgICAgICB2YXIgc3RhdHMgPSByb3N0ZXJPYmouY2VsdGljcy5yb3N0ZXJbc2VsZWN0ZWRQbGF5ZXJdLnN0YXRzO1xuICAgICAgICBqUXVlcnkoJy5wbGF5ZXItc3BvdGxpZ2h0IC50b3Atd3JhcCAucGxheWVyLXRvcCcpLmFwcGVuZCgnPGltZyBjbGFzcz1cInNpbG8gYXBwZW5kZWRcIiBzcmM9XCJodHRwOi8vaW8uY25uLm5ldC9uYmEvbmJhLy5lbGVtZW50L21lZGlhLzIuMC90ZWFtc2l0ZXMvY2VsdGljcy9tZWRpYS9zaWxvLTQ2Nng1OTEtJyArIHJvc3Rlck9iai5jZWx0aWNzLnJvc3RlcltzZWxlY3RlZFBsYXllcl0ucGlkICsgJy5wbmdcIiAvPjxkaXYgY2xhc3M9XCJ0b3AgYXBwZW5kZWRcIj48ZGl2IGNsYXNzPVwicGxheWVyLW5hbWUtd3JhcFwiPjxwIGNsYXNzPVwicGxheWVyLW5hbWVcIj48c3Bhbj4nICsgcm9zdGVyT2JqLmNlbHRpY3Mucm9zdGVyW3NlbGVjdGVkUGxheWVyXS5mbi50b1VwcGVyQ2FzZSgpICsgJzwvc3Bhbj4gPGJyPiAnICsgcm9zdGVyT2JqLmNlbHRpY3Mucm9zdGVyW3NlbGVjdGVkUGxheWVyXS5sbi50b1VwcGVyQ2FzZSgpICsgJzwvcD48L2Rpdj48cCBjbGFzcz1cInBsYXllci1udW1iZXJcIj4nICsgcm9zdGVyT2JqLmNlbHRpY3Mucm9zdGVyW3NlbGVjdGVkUGxheWVyXS5udW0gKyAnPC9icj48c3Bhbj4nICsgcm9zdGVyT2JqLmNlbHRpY3Mucm9zdGVyW3NlbGVjdGVkUGxheWVyXS5wb3MgKyAnPC9zcGFuPjwvcD48L2Rpdj48ZGl2IGNsYXNzPVwibWlkZGxlIGFwcGVuZGVkXCI+PHVsIGNsYXNzPVwiaW5mbyBjbGVhcmZpeFwiPjxsaT48cD5BR0U8c3BhbiBjbGFzcz1cInNtLWhpZGVcIj46Jm5ic3A7PC9zcGFuPiA8L2JyPjxzcGFuIGNsYXNzPVwiaW5mby12YWx1ZVwiPicgKyBwbGF5ZXJBZ2Uocm9zdGVyT2JqLmNlbHRpY3Mucm9zdGVyW3NlbGVjdGVkUGxheWVyXS5kb2IpICsgJzwvc3Bhbj48L3A+PC9saT48bGk+PHA+SFQ8c3BhbiBjbGFzcz1cInNtLWhpZGVcIj46Jm5ic3A7PC9zcGFuPiA8L2JyPjxzcGFuIGNsYXNzPVwiaW5mby12YWx1ZVwiPicgKyByb3N0ZXJPYmouY2VsdGljcy5yb3N0ZXJbc2VsZWN0ZWRQbGF5ZXJdLmh0ICsgJzwvc3Bhbj48L3A+PC9saT48bGk+PHA+V1Q8c3BhbiBjbGFzcz1cInNtLWhpZGVcIj46Jm5ic3A7PC9zcGFuPiA8L2JyPjxzcGFuIGNsYXNzPVwiaW5mby12YWx1ZVwiPicgKyByb3N0ZXJPYmouY2VsdGljcy5yb3N0ZXJbc2VsZWN0ZWRQbGF5ZXJdLnd0ICsgJzwvc3Bhbj48L3A+PC9saT48L3VsPjwvZGl2PjxkaXYgY2xhc3M9XCJib3R0b20gZnVsbCBjbGVhcmZpeCBzbS1oaWRlIGFwcGVuZGVkXCI+PHRhYmxlIGNsYXNzPVwiYXZlcmFnZXNcIj48dHIgY2xhc3M9XCJhdmVyYWdlcy1sYWJlbHNcIj48dGQ+PHA+R1A8L3A+PC90ZD48dGQ+PHA+UFBHPC9wPjwvdGQ+PHRkPjxwPlJQRzwvcD48L3RkPjx0ZD48cD5BUEc8L3A+PC90ZD48L3RyPjx0ciBjbGFzcz1cImF2ZXJhZ2VzLXNlYXNvblwiPjx0ZCBjbGFzcz1cImdwXCI+PHA+PC9wPjwvdGQ+PHRkIGNsYXNzPVwicHRzXCI+PHA+PC9wPjwvdGQ+PHRkIGNsYXNzPVwicmViXCI+PHA+PC9wPjwvdGQ+PHRkIGNsYXNzPVwiYXN0XCI+PHA+PC9wPjwvdGQ+PC90cj48L3RhYmxlPjwvZGl2PicpO1xuICAgICAgICBqUXVlcnkoXCIucGxheWVyLXNwb3RsaWdodCAuYXZlcmFnZXMtc2Vhc29uXCIpLmh0bWwoJzx0ZCBjbGFzcz1cImFwcGVuZGVkXCI+PHA+JyArIHN0YXRzLnNhWzBdLmdwICsgJzwvcD48L3RkPjx0ZCBjbGFzcz1cImFwcGVuZGVkXCI+PHA+JyArIHN0YXRzLnNhWzBdLnB0cyArICc8L3A+PC90ZD48dGQgY2xhc3M9XCJhcHBlbmRlZFwiPjxwPicgKyBzdGF0cy5zYVswXS5yZWIgKyAnPC9wPjwvdGQ+PHRkIGNsYXNzPVwiYXBwZW5kZWRcIj48cD4nICsgc3RhdHMuc2FbMF0uYXN0ICsgJzwvcD48L3RkPicpO1xuICAgICAgICBqUXVlcnkoJy5wbGF5ZXItc3BvdGxpZ2h0IC5wbGF5ZXItbmFtZScpLmZhZGVUbygyMDAsIDEpO1xuICAgICAgICB2YXIgcGxheWVyRmFjdHMgPSByb3N0ZXJPYmouY2VsdGljcy5yb3N0ZXJbc2VsZWN0ZWRQbGF5ZXJdLmJpby5wZXJzb25hbDtcbiAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCAzOyBpKyspIHtcbiAgICAgICAgICAgIHZhciBmYWN0SW5kZXggPSBNYXRoLmZsb29yKE1hdGgucmFuZG9tKCkgKiBwbGF5ZXJGYWN0cy5sZW5ndGgpO1xuICAgICAgICAgICAgalF1ZXJ5KCcucGxheWVyLXNwb3RsaWdodCAuYm90dG9tLXdyYXAnKS5hcHBlbmQoJzxkaXYgY2xhc3M9XCJkeWstYm94IGFwcGVuZGVkXCI+PHA+JyArIHBsYXllckZhY3RzW2ZhY3RJbmRleF0gKyAnPC9wPjwvZGl2PicpO1xuICAgICAgICB9O1xuICAgICAgICBqUXVlcnkoJy5wbGF5ZXItc3BvdGxpZ2h0IC5ib3R0b20td3JhcCcpLmFkZENsYXNzKCd0cmFuc2l0aW9uLTEnKTtcbiAgICAgICAgc2V0VGltZW91dChmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIGpRdWVyeSgnLnBsYXllci1zcG90bGlnaHQgLmJvdHRvbS13cmFwIC5keWstYm94Om50aC1vZi10eXBlKDIpJykuYWRkQ2xhc3MoJ3RyYW5zaXRpb24tMicpO1xuICAgICAgICAgICAgalF1ZXJ5KCcucGxheWVyLXNwb3RsaWdodCAuYm90dG9tLXdyYXAgLmR5ay1ib3g6bnRoLW9mLXR5cGUoMyknKS5hZGRDbGFzcygndHJhbnNpdGlvbi0xJyk7XG4gICAgICAgIH0sIDEwMDApO1xuICAgICAgICBzZXRUaW1lb3V0KGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgalF1ZXJ5KCcucGxheWVyLXNwb3RsaWdodCAuYm90dG9tLXdyYXAgLmR5ay1ib3g6bnRoLW9mLXR5cGUoMyknKS5hZGRDbGFzcygndHJhbnNpdGlvbi0yJyk7XG4gICAgICAgICAgICBqUXVlcnkoJy5wbGF5ZXItc3BvdGxpZ2h0IC5ib3R0b20td3JhcCAuZHlrLWJveDpudGgtb2YtdHlwZSg0KScpLmFkZENsYXNzKCd0cmFuc2l0aW9uLTEnKTtcbiAgICAgICAgfSwgMTUwMCk7XG4gICAgfSwgNjAwMCk7XG4gICAgLyogOCAtIFNQT1RMSUdIVCBTTElERSBJTiAqL1xuICAgIHNldFRpbWVvdXQoZnVuY3Rpb24oKSB7XG4gICAgICAgIGpRdWVyeSgnLnBsYXllci1zcG90bGlnaHQgLnBsYXllci10b3AgLnBsYXllci1uYW1lLCAucGxheWVyLXNwb3RsaWdodCAucGxheWVyLW5hbWUtd3JhcCwgLnBsYXllci1zcG90bGlnaHQgLmhlYWRzaG90LCAucGxheWVyLXNwb3RsaWdodCAuaW5mbywgLnBsYXllci1zcG90bGlnaHQgLnNpbG8sIC5wbGF5ZXItc3BvdGxpZ2h0IC5hdmVyYWdlcywgLnBsYXllci1zcG90bGlnaHQgLnBsYXllci1udW1iZXInKS5hZGRDbGFzcygndHJhbnNpdGlvbi0xJyk7XG4gICAgICAgIHNldFRpbWVvdXQoZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICBqUXVlcnkoJy5ibG9jay13cmFwLnBsYXllci1zcG90bGlnaHQgLnBsYXllci1ib3gnKS5yZW1vdmUoKTtcbiAgICAgICAgfSwgNDAwMCk7XG4gICAgICAgIGlmIChwbGF5ZXJTcG90bGlnaHRDb3VudGVyIDwgMTYpIHtcbiAgICAgICAgICAgIHBsYXllclNwb3RsaWdodENvdW50ZXIrKztcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHBsYXllclNwb3RsaWdodENvdW50ZXIgPSAwO1xuICAgICAgICB9XG4gICAgfSwgNzAwMCk7XG4gICAgLyogOSAtIFNQT1RMSUdIVCBTTElERSBPVVQgKi9cbiAgICBzZXRUaW1lb3V0KGZ1bmN0aW9uKCkge1xuICAgICAgICBqUXVlcnkoJy5wbGF5ZXItc3BvdGxpZ2h0IC5ib3R0b20td3JhcCwgLnBsYXllci1zcG90bGlnaHQgLnRvcC13cmFwJykuYWRkQ2xhc3MoJ3RyYW5zaXRpb24tMicpO1xuICAgIH0sIDgwMDApO1xuICAgIC8qIDEwIC0gRE9ORS4gUkVNT1ZFICovXG4gICAgc2V0VGltZW91dChmdW5jdGlvbigpIHtcbiAgICAgICAgalF1ZXJ5KCcgLnBsYXllci1zcG90bGlnaHQgLmFwcGVuZGVkJykucmVtb3ZlKCk7XG4gICAgICAgIGpRdWVyeSgnIC5wbGF5ZXItc3BvdGxpZ2h0IC5zZWxlY3RlZCcpLnJlbW92ZUNsYXNzKCdzZWxlY3RlZCcpO1xuICAgICAgICBmb3IgKHZhciBpID0gMTsgaSA8IDEwOyBpKyspe1xuICAgICAgICAgICAgalF1ZXJ5KCcucmlnaHQtd3JhcCAudHJhbnNpdGlvbi0nICsgaSkucmVtb3ZlQ2xhc3MoJ3RyYW5zaXRpb24tJyArIGkpO1xuICAgICAgICB9XG4gICAgfSwgOTAwMCk7XG59XG5cbmZ1bmN0aW9uIGxlYWRlcnMoZ2lkLCBnYW1lU3RhcnRlZCkge1xuICAgIGpRdWVyeSgnLmxlYWRlcnMnKS5hZGRDbGFzcygnYWN0aXZlJyk7XG4gICAgdmFyIGdhbWVEZXRhaWwgPSAnJztcbiAgICB2YXIgZGV0YWlsQXZhaWxhYmxlID0gZmFsc2U7XG4gICAgdmFyIGxlYWRlcnNUaXRsZSA9ICdTRUFTT04gTEVBREVSUyc7XG4gICAgaWYgKGNoZWNrR2FtZVN0YXR1cygpKSB7XG4gICAgICAgIGxlYWRlcnNUaXRsZSA9ICdHQU1FIExFQURFUlMnO1xuICAgICAgICBqUXVlcnkuYWpheCh7XG4gICAgICAgICAgICAgdXJsOiBmZWVkcy5nYW1lZGV0YWlsKGdpZCksXG4gICAgICAgICAgICAgYXN5bmM6IGZhbHNlLFxuICAgICAgICAgICAgIHN1Y2Nlc3M6IGZ1bmN0aW9uKGRhdGEpIHtcbiAgICAgICAgICAgICAgICAgdmFyIHRlYW1MaW5lU2NvcmUgPSBbXCJobHNcIixcInZsc1wiXTtcbiAgICAgICAgICAgICAgICAgZm9yICh2YXIgeCA9IDA7IHggPCB0ZWFtTGluZVNjb3JlLmxlbmd0aDsgeCsrKXtcbiAgICAgICAgICAgICAgICAgICAgIHZhciBzdGF0cyA9IGRhdGEuZ1t0ZWFtTGluZVNjb3JlW3hdXTtcbiAgICAgICAgICAgICAgICAgICAgIHZhciB0ZWFtID0gJyc7XG4gICAgICAgICAgICAgICAgICAgICBpZiAoc3RhdHMudGEgPT09ICdCT1MnKXtcbiAgICAgICAgICAgICAgICAgICAgICAgICB0ZWFtID0gJ2NlbHRpY3MnO1xuICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgdGVhbSA9ICdhd2F5JztcbiAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgIGZvciAodmFyIHN0YXQgaW4gcm9zdGVyT2JqW3RlYW1dLmxlYWRlcnMpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICByb3N0ZXJPYmpbdGVhbV0ubGVhZGVyc1tzdGF0XSA9IFtbJy0tJywgJy0tJywgJy0tJywgJy0tJ10sWyctLScsICctLScsICctLScsICctLSddLFsnLS0nLCAnLS0nLCAnLS0nLCAnLS0nXV07XG4gICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICBmb3IgKHZhciBwID0gMDsgcCA8IHN0YXRzLnBzdHNnLmxlbmd0aDsgcCsrKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgZm9yICh2YXIgc3RhdCBpbiByb3N0ZXJPYmpbdGVhbV0ubGVhZGVycykge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA+PSAwOyBpKyspIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmIChyb3N0ZXJPYmpbdGVhbV0ubGVhZGVyc1tzdGF0XVtpXVsyXSA9PSAnLS0nICYmIHN0YXRzLnBzdHNnW3BdW3N0YXRdID4gMCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJvc3Rlck9ialt0ZWFtXS5sZWFkZXJzW3N0YXRdW2ldWzBdID0gc3RhdHMucHN0c2dbcF0uZm4udG9VcHBlckNhc2UoKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICByb3N0ZXJPYmpbdGVhbV0ubGVhZGVyc1tzdGF0XVtpXVsxXSA9IHN0YXRzLnBzdHNnW3BdLmxuLnRvVXBwZXJDYXNlKCk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcm9zdGVyT2JqW3RlYW1dLmxlYWRlcnNbc3RhdF1baV1bMl0gPSBzdGF0cy5wc3RzZ1twXVtzdGF0XTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICByb3N0ZXJPYmpbdGVhbV0ubGVhZGVyc1tzdGF0XVtpXVszXSA9IHN0YXRzLnBzdHNnW3BdLnBpZDtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmIChzdGF0cy5wc3RzZ1twXVtzdGF0XSA+IHJvc3Rlck9ialt0ZWFtXS5sZWFkZXJzW3N0YXRdW2ldWzJdICYmIHN0YXRzLnBzdHNnW3BdW3N0YXRdID4gMCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJvc3Rlck9ialt0ZWFtXS5sZWFkZXJzW3N0YXRdW2ldWzBdID0gc3RhdHMucHN0c2dbcF0uZm4udG9VcHBlckNhc2UoKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICByb3N0ZXJPYmpbdGVhbV0ubGVhZGVyc1tzdGF0XVtpXVsxXSA9IHN0YXRzLnBzdHNnW3BdLmxuLnRvVXBwZXJDYXNlKCk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcm9zdGVyT2JqW3RlYW1dLmxlYWRlcnNbc3RhdF1baV1bMl0gPSBzdGF0cy5wc3RzZ1twXVtzdGF0XTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICByb3N0ZXJPYmpbdGVhbV0ubGVhZGVyc1tzdGF0XVtpXVszXSA9IHN0YXRzLnBzdHNnW3BdLnBpZDtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfTtcbiAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICB9XG4gICAgICAgICB9KTtcbiAgICB9XG4gICAgalF1ZXJ5KCcubGVhZGVycy10aXRsZScpLmh0bWwobGVhZGVyc1RpdGxlKTtcbiAgICBmb3IgKHZhciB0ZWFtIGluIHJvc3Rlck9iaikge1xuICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IDM7IGkrKykge1xuICAgICAgICAgICAgZm9yICh2YXIgc3RhdCBpbiByb3N0ZXJPYmpbdGVhbV0ubGVhZGVycykge1xuICAgICAgICAgICAgICAgIC8vIExFQURFUiBTVEFUIFZBTFVFXG4gICAgICAgICAgICAgICAgalF1ZXJ5KCcubGVhZGVyLXNlY3Rpb246bnRoLW9mLXR5cGUoJyArIChpICsgMikgKyAnKSAuJyArIHN0YXQgKyAnLicgKyB0ZWFtICsgJyAuc3RhdCcpLmh0bWwoJzxzcGFuIGNsYXNzPVwiYXBwZW5kZWQgJyArIHJvc3Rlck9ialt0ZWFtXS50YSArICdcIj4nICsgcm9zdGVyT2JqW3RlYW1dLmxlYWRlcnNbc3RhdF1baV1bMl0gKyAnPC9zcGFuPiAnICsgc3RhdC50b1VwcGVyQ2FzZSgpKTtcbiAgICAgICAgICAgICAgICAvLyBMRUFERVIgTkFNRVxuICAgICAgICAgICAgICAgIGlmIChyb3N0ZXJPYmpbdGVhbV0ubGVhZGVyc1tzdGF0XVtpXVswXS5sZW5ndGggKyByb3N0ZXJPYmpbdGVhbV0ubGVhZGVyc1tzdGF0XVtpXVsxXS5sZW5ndGggPj0gMTUpIHtcbiAgICAgICAgICAgICAgICAgICAgcm9zdGVyT2JqW3RlYW1dLmxlYWRlcnNbc3RhdF1baV1bMF0gPSByb3N0ZXJPYmpbdGVhbV0ubGVhZGVyc1tzdGF0XVtpXVswXS5zdWJzdHIoMCwgMSkgKyAnLic7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGpRdWVyeSgnLmxlYWRlci1zZWN0aW9uOm50aC1vZi10eXBlKCcgKyAoaSArIDIpICsgJykgLicgKyBzdGF0ICsgJy4nICsgdGVhbSArICcgLm5hbWUnKS5odG1sKCc8c3BhbiBjbGFzcz1cImFwcGVuZGVkXCI+JyArIHJvc3Rlck9ialt0ZWFtXS5sZWFkZXJzW3N0YXRdW2ldWzBdICsgJzwvc3Bhbj4gJyArIHJvc3Rlck9ialt0ZWFtXS5sZWFkZXJzW3N0YXRdW2ldWzFdKTtcbiAgICAgICAgICAgICAgICAvLyBMRUFERVIgSEVBRFNIT1RcbiAgICAgICAgICAgICAgICBqUXVlcnkoJy5sZWFkZXItc2VjdGlvbjpudGgtb2YtdHlwZSgnICsgKGkgKyAyKSArICcpIC4nICsgc3RhdCArICcuJyArIHRlYW0gKyAnIC5oZWFkc2hvdCcpLmF0dHIoJ3NyYycsICdodHRwczovL2FrLXN0YXRpYy5jbXMubmJhLmNvbS93cC1jb250ZW50L3VwbG9hZHMvaGVhZHNob3RzL25iYS9sYXRlc3QvMTA0MHg3NjAvJyArIHJvc3Rlck9ialt0ZWFtXS5sZWFkZXJzW3N0YXRdW2ldWzNdICsgJy5wbmcnKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cbiAgICBzZXRUaW1lb3V0KGZ1bmN0aW9uKCkge1xuICAgICAgICBqUXVlcnkoJy5sZWFkZXJzLCAubGVhZGVycyAuYmxvY2staW5uZXInKS5hZGRDbGFzcygndHJhbnNpdGlvbi0xJyk7XG4gICAgfSwgMTAwKTtcbiAgICBzZXRUaW1lb3V0KGZ1bmN0aW9uKCkge1xuICAgICAgICBqUXVlcnkoJy5sZWFkZXJzIC5sZWFkZXItc2VjdGlvbicpLmFkZENsYXNzKCd0cmFuc2l0aW9uLTEnKTtcbiAgICAgICAgalF1ZXJ5KCcubGVhZGVyLXN1YnNlY3Rpb24uYm90dG9tIHA6bnRoLW9mLXR5cGUoMSknKS5hZGRDbGFzcygndHJhbnNpdGlvbi0xJyk7XG4gICAgICAgIGpRdWVyeSgnLmxlYWRlcnMgLmxlYWRlci1zZWN0aW9uIC51bmRlcmxpbmUsIC5sZWFkZXJzIC5sZWFkZXItc3Vic2VjdGlvbi50b3AnKS5hZGRDbGFzcyhyb3N0ZXJPYmouY2VsdGljcy50YSArICctYmcnKTtcbiAgICB9LCAxMTAwKTtcbiAgICBzZXRUaW1lb3V0KGZ1bmN0aW9uKCkge1xuICAgICAgICBqUXVlcnkoJy5sZWFkZXJzIC5sZWFkZXItc2VjdGlvbicpLmFkZENsYXNzKCd0cmFuc2l0aW9uLTInKTtcbiAgICAgICAgalF1ZXJ5KCcubGVhZGVycyAuYmxvY2staW5uZXInKS5hZGRDbGFzcygndHJhbnNpdGlvbi0yJyk7XG4gICAgfSwgMjEwMCk7XG4gICAgdmFyIHRyYW5zaXRpb25Db3VudGVyID0gMTtcbiAgICBzZXRUaW1lb3V0KGZ1bmN0aW9uKCl7XG4gICAgICAgIGZvciAobGV0IGkgPSAxOyBpIDwgNjsgaSsrKSB7XG4gICAgICAgICAgICBzZXRUaW1lb3V0KGZ1bmN0aW9uKG51bWJlclN0cmluZykge1xuICAgICAgICAgICAgICAgIGpRdWVyeSgnLmxlYWRlcnMgLmxlYWRlci1zZWN0aW9uIC5sZWFkZXItc3RhdC13cmFwJykuYWRkQ2xhc3MoJ3RyYW5zaXRpb24tJyArIGkpO1xuICAgICAgICAgICAgICAgIGpRdWVyeSgnLmxlYWRlcnMgLmxlYWRlci1zZWN0aW9uIC51bmRlcmxpbmUsIC5sZWFkZXJzIC5sZWFkZXItc3Vic2VjdGlvbi50b3AnKS5yZW1vdmVDbGFzcyhyb3N0ZXJPYmouY2VsdGljcy50YSArICctYmcnKTtcbiAgICAgICAgICAgICAgICBqUXVlcnkoJy5sZWFkZXJzIC5sZWFkZXItc2VjdGlvbiAudW5kZXJsaW5lLCAubGVhZGVycyAubGVhZGVyLXN1YnNlY3Rpb24udG9wJykuYWRkQ2xhc3Mocm9zdGVyT2JqLmF3YXkudGEgKyAnLWJnJyk7XG4gICAgICAgICAgICAgICAgaWYgKHRyYW5zaXRpb25Db3VudGVyICUgMiA9PSAwKSB7XG4gICAgICAgICAgICAgICAgICAgIHNldFRpbWVvdXQoZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBqUXVlcnkoJy5sZWFkZXJzIC5sZWFkZXItc2VjdGlvbiAudW5kZXJsaW5lLCAubGVhZGVycyAubGVhZGVyLXN1YnNlY3Rpb24udG9wJykucmVtb3ZlQ2xhc3Mocm9zdGVyT2JqLmF3YXkudGEgKyAnLWJnJyk7XG4gICAgICAgICAgICAgICAgICAgICAgICBqUXVlcnkoJy5sZWFkZXJzIC5sZWFkZXItc2VjdGlvbiAudW5kZXJsaW5lLCAubGVhZGVycyAubGVhZGVyLXN1YnNlY3Rpb24udG9wJykuYWRkQ2xhc3Mocm9zdGVyT2JqLmNlbHRpY3MudGEgKyAnLWJnJyk7XG4gICAgICAgICAgICAgICAgICAgICAgICBqUXVlcnkoJy5sZWFkZXItc3Vic2VjdGlvbi5ib3R0b20gcCcpLnJlbW92ZUNsYXNzKCd0cmFuc2l0aW9uLTEnKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGpRdWVyeSgnLmxlYWRlcnMgLmxlYWRlci1zZWN0aW9uIC51bmRlcmxpbmUnKS5hZGRDbGFzcygndHJhbnNpdGlvbi0nICsgKGkgLyAyKSk7XG4gICAgICAgICAgICAgICAgICAgICAgICBqUXVlcnkoJy5sZWFkZXItc3Vic2VjdGlvbi5ib3R0b20gcDpudGgtb2YtdHlwZSgnICsgKGkgLSAoaSAvIDIpICsgMSkgKyAnKScpLmFkZENsYXNzKCd0cmFuc2l0aW9uLTEnKTsgLy8gbG9sXG4gICAgICAgICAgICAgICAgICAgIH0sIDIwMCk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIHRyYW5zaXRpb25Db3VudGVyKys7XG4gICAgICAgICAgICB9LCA3MDAwICogaSk7XG4gICAgICAgIH1cbiAgICB9LDIxMDApO1xuICAgIHNldFRpbWVvdXQoZnVuY3Rpb24oKSB7XG4gICAgICAgIGpRdWVyeSgnLmxlYWRlcnMgLmxlYWRlci1zZWN0aW9uLCAubGVhZGVycyAubGVhZGVyLXN1YnNlY3Rpb24nKS5hZGRDbGFzcygndHJhbnNpdGlvbi0zJyk7XG4gICAgfSwgNDQxMDApO1xuICAgIHNldFRpbWVvdXQoZnVuY3Rpb24oKSB7XG4gICAgICAgIGpRdWVyeSgnLmxlYWRlcnMnKS5hZGRDbGFzcygndHJhbnNpdGlvbi0yJyk7XG4gICAgfSwgNDQxMDApO1xuICAgIHNldFRpbWVvdXQoZnVuY3Rpb24oKSB7XG4gICAgICAgIGpRdWVyeSgnLmxlYWRlcnMgLmxlYWRlci1zZWN0aW9uIC51bmRlcmxpbmUsIC5sZWFkZXJzIC5sZWFkZXItc3Vic2VjdGlvbi50b3AnKS5yZW1vdmVDbGFzcyhyb3N0ZXJPYmouYXdheS50YSArICctYmcnKTtcbiAgICAgICAgalF1ZXJ5KCcubGVhZGVycyAubGVhZGVyLXNlY3Rpb24gLnVuZGVybGluZSwgLmxlYWRlcnMgLmxlYWRlci1zdWJzZWN0aW9uLnRvcCcpLmFkZENsYXNzKHJvc3Rlck9iai5jZWx0aWNzLnRhICsgJy1iZycpO1xuICAgICAgICBqUXVlcnkoJy5sZWFkZXJzJykucmVtb3ZlQ2xhc3MoJ2FjdGl2ZScpO1xuICAgICAgICBqUXVlcnkoJy5sZWFkZXJzIC5hcHBlbmRlZCcpLnJlbW92ZSgpO1xuICAgICAgICBmb3IgKHZhciBpID0gMTsgaSA8IDEwOyBpKyspe1xuICAgICAgICAgICAgalF1ZXJ5KCcubGVhZGVycyAudHJhbnNpdGlvbi0nICsgaSArICcsIC5sZWFkZXJzLnRyYW5zaXRpb24tJyArIGkpLnJlbW92ZUNsYXNzKCd0cmFuc2l0aW9uLScgKyBpKTtcbiAgICAgICAgfVxuICAgIH0sIDQ1MDAwKTtcbn07XG5cbmZ1bmN0aW9uIHNvY2lhbCgpIHtcbiAgICBqUXVlcnkoJy5zb2NpYWwgLnRleHQtd3JhcCwgLnNvY2lhbCAudW5kZXJsaW5lJykucmVtb3ZlQ2xhc3MoJ3RyYW5zaXRpb24tMScpO1xuICAgIGpRdWVyeSgnLnNvY2lhbCcpLmFkZENsYXNzKCdhY3RpdmUnKTtcbiAgICBzZXRUaW1lb3V0KGZ1bmN0aW9uKCl7XG4gICAgICAgIGpRdWVyeSgnLnNvY2lhbCAudGV4dC13cmFwLCAuc29jaWFsIC51bmRlcmxpbmUnKS5hZGRDbGFzcygndHJhbnNpdGlvbi0xJyk7XG4gICAgfSwgMTUwMDApO1xuICAgc2V0VGltZW91dChmdW5jdGlvbigpe1xuICAgICAgICBqUXVlcnkoJy5zb2NpYWwgLmFwcGVuZGVkJykucmVtb3ZlKCk7XG4gICAgICAgIGpRdWVyeSgnLnNvY2lhbCAuc2VsZWN0ZWQnKS5yZW1vdmVDbGFzcygnc2VsZWN0ZWQnKTtcbiAgICAgICAgalF1ZXJ5KCcuc29jaWFsJykucmVtb3ZlQ2xhc3MoJ2FjdGl2ZScpO1xuICAgIH0sIDE1MDAwKTtcbn07XG5cbi8qZnVuY3Rpb24gbW9iaWxlQXBwSW5pdCgpIHtcbiAgICB2YXIgY291bnRlciA9IDE7XG4gICAgc2V0SW50ZXJ2YWwoZnVuY3Rpb24oKSB7XG4gICAgICAgIGpRdWVyeSgnLmFwcCAuYm90dG9tLXdyYXAgaW1nJykucmVtb3ZlQ2xhc3MoJ2FjdGl2ZScpO1xuICAgICAgICBqUXVlcnkoJy5hcHAgLmZlYXR1cmUtbGlzdCBwJykucmVtb3ZlQ2xhc3MoJ2FjdGl2ZScpO1xuICAgICAgICBqUXVlcnkoJy5hcHAgLmZlYXR1cmUtbGlzdCBwOm50aC1vZi10eXBlKCcgKyBjb3VudGVyICsgJyknKS5hZGRDbGFzcygnYWN0aXZlJyk7XG4gICAgICAgIGpRdWVyeSgnLmFwcCAuYm90dG9tLXdyYXAgaW1nOm50aC1vZi10eXBlKCcgKyBjb3VudGVyICsgJyknKS5hZGRDbGFzcygnYWN0aXZlJyk7XG4gICAgICAgIGlmIChjb3VudGVyID09IDUpIHtcbiAgICAgICAgICAgIGNvdW50ZXIgPSAxO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgY291bnRlcisrO1xuICAgICAgICB9XG4gICAgfSwgMjAwMCk7XG59O1xuKi9cbmZ1bmN0aW9uIG1vYmlsZUFwcCgpIHtcbiAgICBqUXVlcnkoJy5hcHAgLmJsb2NrLWlubmVyJykucmVtb3ZlQ2xhc3MoJ3RyYW5zaXRpb24tMScpO1xuICAgIGpRdWVyeSgnLmFwcCcpLmFkZENsYXNzKCdhY3RpdmUnKTtcbiAgICB2YXIgY291bnRlciA9IDE7XG4gICAgdmFyIHJvdGF0ZVNjcmVlbnMgPSBzZXRJbnRlcnZhbChmdW5jdGlvbigpIHtcbiAgICAgICAgalF1ZXJ5KCcuYXBwIC5ib3R0b20td3JhcCBpbWcnKS5yZW1vdmVDbGFzcygnYWN0aXZlJyk7XG4gICAgICAgIGpRdWVyeSgnLmFwcCAuZmVhdHVyZS1saXN0IHAnKS5yZW1vdmVDbGFzcygnYWN0aXZlJyk7XG4gICAgICAgIGpRdWVyeSgnLmFwcCAuZmVhdHVyZS1saXN0IHA6bnRoLW9mLXR5cGUoJyArIGNvdW50ZXIgKyAnKScpLmFkZENsYXNzKCdhY3RpdmUnKTtcbiAgICAgICAgalF1ZXJ5KCcuYXBwIC5ib3R0b20td3JhcCBpbWc6bnRoLW9mLXR5cGUoJyArIGNvdW50ZXIgKyAnKScpLmFkZENsYXNzKCdhY3RpdmUnKTtcbiAgICAgICAgaWYgKGNvdW50ZXIgPT0gNSkge1xuICAgICAgICAgICAgY291bnRlciA9IDE7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBjb3VudGVyKys7XG4gICAgICAgIH1cbiAgICB9LCA0MDAwKTtcbiAgICByb3RhdGVTY3JlZW5zO1xuICAgIHNldFRpbWVvdXQoZnVuY3Rpb24oKXtcbiAgICAgICAgalF1ZXJ5KCcuYXBwIC5ibG9jay1pbm5lcicpLmFkZENsYXNzKCd0cmFuc2l0aW9uLTEnKTtcbiAgICB9LCAyNDAwMCk7XG4gICAgc2V0VGltZW91dChmdW5jdGlvbigpe1xuICAgICAgICBqUXVlcnkoJy5hcHAnKS5yZW1vdmVDbGFzcygnYWN0aXZlJyk7XG4gICAgICAgIGNsZWFySW50ZXJ2YWwocm90YXRlU2NyZWVucyk7XG4gICAgfSwgMjUwMDApO1xufTtcbi8qPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG49ICAgICAgICAgICAgTEVGVCBXUkFQICAgICAgICAgICAgPVxuPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09Ki9cblxuZnVuY3Rpb24gbGVmdFdyYXAoKSB7XG4gICAgc2V0SW50ZXJ2YWwoZnVuY3Rpb24oKXtcbiAgICAgICAgaWYgKGpRdWVyeSgnLmxlZnQtd3JhcCAuc3RhbmRpbmdzJykuaGFzQ2xhc3MoJ3RyYW5zaXRpb24tMScpKXtcbiAgICAgICAgICAgIGpRdWVyeSgnLmxlZnQtd3JhcCAuc3RhbmRpbmdzJykucmVtb3ZlQ2xhc3MoJ3RyYW5zaXRpb24tMScpO1xuICAgICAgICB9XG4gICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgalF1ZXJ5KCcubGVmdC13cmFwIC5zdGFuZGluZ3MnKS5hZGRDbGFzcygndHJhbnNpdGlvbi0xJyk7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKGpRdWVyeSgnLmxlZnQtd3JhcCAuc2NvcmVzLWFuZC1sZWFkZXJzJykuaGFzQ2xhc3MoJ3RyYW5zaXRpb24tMScpKXtcbiAgICAgICAgICAgIGpRdWVyeSgnLmxlZnQtd3JhcCAuc2NvcmVzLWFuZC1sZWFkZXJzJykucmVtb3ZlQ2xhc3MoJ3RyYW5zaXRpb24tMScpO1xuICAgICAgICAgICAgdXBkYXRlTGVhZ3VlU2NvcmVzKCk7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICBqUXVlcnkoJy5sZWZ0LXdyYXAgLnNjb3Jlcy1hbmQtbGVhZGVycycpLmFkZENsYXNzKCd0cmFuc2l0aW9uLTEnKTtcbiAgICAgICAgfVxuICAgIH0sIDUwMDAwKTtcbn1cblxuXG5mdW5jdGlvbiBzdGFuZGluZ3NJbml0KGF3YXlUZWFtKSB7XG4gICAgalF1ZXJ5LmFqYXgoe1xuICAgICAgICB1cmw6IGZlZWRzLnN0YW5kaW5ncyxcbiAgICAgICAgYXN5bmM6IGZhbHNlLFxuICAgICAgICBzdWNjZXNzOiBmdW5jdGlvbihzdGFuZGluZ3NEYXRhKSB7XG4gICAgICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IHN0YW5kaW5nc0RhdGEuc3RhLmNvLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICAgICAgZm9yIChsZXQgeCA9IDA7IHggPCBzdGFuZGluZ3NEYXRhLnN0YS5jb1tpXS5kaS5sZW5ndGg7IHgrKykge1xuICAgICAgICAgICAgICAgICAgICBmb3IgKGxldCB0ID0gMDsgdCA8IHN0YW5kaW5nc0RhdGEuc3RhLmNvW2ldLmRpW3hdLnQubGVuZ3RoOyB0KyspIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHZhciBjb25mZXJlbmNlcyA9IFsnLmVhc3QnLCAnLndlc3QnXTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHZhciBwbGFjZSA9IHN0YW5kaW5nc0RhdGEuc3RhLmNvW2ldLmRpW3hdLnRbdF0uc2VlO1xuICAgICAgICAgICAgICAgICAgICAgICAgdmFyIHNlZWQgPSAnJztcbiAgICAgICAgICAgICAgICAgICAgICAgIHZhciBhY3RpdmVTdGF0dXMgPSAnJztcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChzdGFuZGluZ3NEYXRhLnN0YS5jb1tpXS5kaVt4XS50W3RdLnNlZSA8PSA4KSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgc2VlZCA9IHN0YW5kaW5nc0RhdGEuc3RhLmNvW2ldLmRpW3hdLnRbdF0uc2VlO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHN0YW5kaW5nc0RhdGEuc3RhLmNvW2ldLmRpW3hdLnRbdF0udGEgPT0gJ0JPUycpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBhY3RpdmVTdGF0dXMgPSAnYWN0aXZlJztcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChzdGFuZGluZ3NEYXRhLnN0YS5jb1tpXS5kaVt4XS50W3RdLnRhID09IGF3YXlUZWFtKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgYWN0aXZlU3RhdHVzID0gJ2FjdGl2ZS1hd2F5JztcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgIHZhciByb3dIVE1MID0gJzxkaXYgY2xhc3M9XCJwbGFjZVwiPicgKyBzZWVkICsgJzwvZGl2PjxkaXYgY2xhc3M9XCJsb2dvLXdyYXBcIj48aW1nIGNsYXNzPVwibG9nb1wiIHNyYz1odHRwOi8vaS5jZG4udHVybmVyLmNvbS9uYmEvbmJhL2Fzc2V0cy9sb2dvcy90ZWFtcy9wcmltYXJ5L3dlYi8nICsgc3RhbmRpbmdzRGF0YS5zdGEuY29baV0uZGlbeF0udFt0XS50YSArICcuc3ZnPjwvZGl2PjxkaXYgY2xhc3M9XCJ0ZWFtICsgJyArIHN0YW5kaW5nc0RhdGEuc3RhLmNvW2ldLmRpW3hdLnRbdF0udGEgKyAnXCI+JyArIHN0YW5kaW5nc0RhdGEuc3RhLmNvW2ldLmRpW3hdLnRbdF0udGEgKyAnPC9kaXY+PGRpdiBjbGFzcz1cIndpbnNcIj4nICsgc3RhbmRpbmdzRGF0YS5zdGEuY29baV0uZGlbeF0udFt0XS53ICsgJzwvZGl2PjxkaXYgY2xhc3M9XCJsb3NzZXNcIj4nICsgc3RhbmRpbmdzRGF0YS5zdGEuY29baV0uZGlbeF0udFt0XS5sICsgJzwvZGl2PjxkaXYgY2xhc3M9XCJnYW1lcy1iZWhpbmRcIj4nICsgc3RhbmRpbmdzRGF0YS5zdGEuY29baV0uZGlbeF0udFt0XS5nYiArICc8L2Rpdj4nO1xuICAgICAgICAgICAgICAgICAgICAgICAgalF1ZXJ5KGNvbmZlcmVuY2VzW2ldICsgJyA+IGRpdjpudGgtY2hpbGQoJyArIChwbGFjZSArIDEpICsgJyknKS5odG1sKHJvd0hUTUwpO1xuICAgICAgICAgICAgICAgICAgICAgICAgalF1ZXJ5KGNvbmZlcmVuY2VzW2ldICsgJyA+IGRpdjpudGgtY2hpbGQoJyArIChwbGFjZSArIDEpICsgJyknKS5hZGRDbGFzcyhhY3RpdmVTdGF0dXMpO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfSk7XG59O1xuXG5mdW5jdGlvbiBzY29yZXNJbml0KHRvZGF5c1Njb3Jlc0RhdGEpIHtcbiAgICB2YXIgbGl2ZVNjb3JlcyA9IHRvZGF5c1Njb3Jlc0RhdGEuZ3MuZztcbiAgICBpZiAobGl2ZVNjb3Jlcy5sZW5ndGggIT0gMCkge1xuICAgICAgICB2YXIgc2Vhc29uVHlwZSA9ICcnO1xuICAgICAgICBpZiAobGl2ZVNjb3Jlc1swXS5naWQuc3Vic3RyKDAsIDMpID09ICcwMDEnKSB7XG4gICAgICAgICAgICBzZWFzb25UeXBlID0gJ3ByZSc7XG4gICAgICAgIH0gZWxzZSBpZiAobGl2ZVNjb3Jlc1swXS5naWQuc3Vic3RyKDAsIDMpID09ICcwMDQnKSB7XG4gICAgICAgICAgICBzZWFzb25UeXBlID0gJ3Bvc3QnO1xuICAgICAgICB9XG4gICAgICAgIGlmIChsaXZlU2NvcmVzLmxlbmd0aCA+IDEgfHwgKGxpdmVTY29yZXMubGVuZ3RoID09IDEgJiYgbGl2ZVNjb3Jlc1swXS5oLnRhICE9ICdCT1MnKSkge1xuICAgICAgICAgICAgdmFyIHN0YXR1c0NvZGVzID0gWycxc3QgUXRyJywgJzJuZCBRdHInLCAnM3JkIFF0cicsICc0dGggUXRyJywgJzFzdCBPVCcsICcybmQgT1QnLCAnM3JkIE9UJywgJzR0aCBPVCcsICc1dGggT1QnLCAnNnRoIE9UJywgJzd0aCBPVCcsICc4dGggT1QnLCAnOXRoIE9UJywgJzEwdGggT1QnXTtcbiAgICAgICAgICAgIHZhciBzY29yZXNIVE1MID0gJyc7XG4gICAgICAgICAgICB2YXIgYWRkZWQgPSAwO1xuICAgICAgICAgICAgZm9yICh2YXIgaSA9IGxpdmVTY29yZXMubGVuZ3RoIC0gMTsgaSA+PSAwOyBpLS0pIHtcbiAgICAgICAgICAgICAgICBpZiAobGl2ZVNjb3Jlc1tpXS5oLnRhICE9PSAnQk9TJyAmJiBpIDwgMTEpIHtcbiAgICAgICAgICAgICAgICAgICAgYWRkZWQrKztcbiAgICAgICAgICAgICAgICAgICAgdmFyIHZTY29yZSA9ICcnO1xuICAgICAgICAgICAgICAgICAgICB2YXIgaFNjb3JlID0gJyc7XG4gICAgICAgICAgICAgICAgICAgIHZhciB2UmVzdWx0ID0gJyc7XG4gICAgICAgICAgICAgICAgICAgIHZhciBoUmVzdWx0ID0gJyc7XG4gICAgICAgICAgICAgICAgICAgIGlmIChsaXZlU2NvcmVzW2ldLnN0ICE9IDEpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHZTY29yZSA9IGxpdmVTY29yZXNbaV0udi5zO1xuICAgICAgICAgICAgICAgICAgICAgICAgaFNjb3JlID0gbGl2ZVNjb3Jlc1tpXS5oLnM7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgdmFyIHNUZXh0ID0gbGl2ZVNjb3Jlc1tpXS5zdHQ7XG4gICAgICAgICAgICAgICAgICAgIGlmIChzdGF0dXNDb2Rlcy5pbmRleE9mKGxpdmVTY29yZXNbaV0uc3R0KSAhPT0gLTEpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHNUZXh0ID0gbGl2ZVNjb3Jlc1tpXS5zdHQgKyAnIC0gJyArIGxpdmVTY29yZXNbaV0uY2w7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgaWYgKGxpdmVTY29yZXNbaV0uc3QgPT0gMyAmJiB2U2NvcmUgPCBoU2NvcmUpe1xuICAgICAgICAgICAgICAgICAgICAgICAgdlJlc3VsdCA9ICdsb3Nlcic7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgZWxzZSBpZiAobGl2ZVNjb3Jlc1tpXS5zdCA9PSAzICYmIGhTY29yZSA8IHZTY29yZSl7XG4gICAgICAgICAgICAgICAgICAgICAgICBoUmVzdWx0ID0gJ2xvc2VyJztcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICBzY29yZXNIVE1MICs9ICc8ZGl2IGNsYXNzPVwic2NvcmUtd3JhcFwiPjxkaXYgY2xhc3M9XCJzY29yZS1zdGF0dXNcIj4nICsgc1RleHQgKyAnPC9kaXY+PGRpdiBjbGFzcz1cIicgKyBsaXZlU2NvcmVzW2ldLnYudGEgKyAnXCI+PGltZyBzcmM9XCJodHRwOi8vc3RhdHMubmJhLmNvbS9tZWRpYS9pbWcvdGVhbXMvbG9nb3MvJyArIGxpdmVTY29yZXNbaV0udi50YS50b1VwcGVyQ2FzZSgpICsgJ19sb2dvLnN2Z1wiPiAnICsgbGl2ZVNjb3Jlc1tpXS52LnRjLnRvVXBwZXJDYXNlKCkgKyAnICcgKyBsaXZlU2NvcmVzW2ldLnYudG4udG9VcHBlckNhc2UoKSArICcgPGRpdiBjbGFzcz1cInNjb3JlLW51bSAnICsgdlJlc3VsdCArICdcIj4nICsgdlNjb3JlICsgJzwvZGl2PjwvZGl2PjxkaXYgY2xhc3M9XCInICsgbGl2ZVNjb3Jlc1tpXS5oLnRhICsgJ1wiPjxpbWcgc3JjPVwiaHR0cDovL3N0YXRzLm5iYS5jb20vbWVkaWEvaW1nL3RlYW1zL2xvZ29zLycgKyBsaXZlU2NvcmVzW2ldLmgudGEudG9VcHBlckNhc2UoKSArICdfbG9nby5zdmdcIj4gJyArIGxpdmVTY29yZXNbaV0uaC50Yy50b1VwcGVyQ2FzZSgpICsgJyAnICsgbGl2ZVNjb3Jlc1tpXS5oLnRuLnRvVXBwZXJDYXNlKCkgKyAnIDxkaXYgY2xhc3M9XCJzY29yZS1udW0gJyArIGhSZXN1bHQgKyAnXCI+JyArIGhTY29yZSArICc8L2Rpdj48L2Rpdj48L2Rpdj4nO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGpRdWVyeSgnLnNjb3JlcycpLmVtcHR5KCkuYXBwZW5kKHNjb3Jlc0hUTUwpO1xuICAgICAgICB9XG4gICAgICAgIGlmIChhZGRlZCA8IDUpe1xuICAgICAgICAgICAgalF1ZXJ5KCcubGVhZ3VlLWxlYWRlcnMnKS5zaG93KCk7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICBqUXVlcnkoJy5sZWFndWUtbGVhZGVycycpLmhpZGUoKTtcbiAgICAgICAgfVxuICAgIH1cbn1cblxuZnVuY3Rpb24gdXBkYXRlTGVhZ3VlU2NvcmVzKCkge1xuICAgIGpRdWVyeS5hamF4KHtcbiAgICAgICAgdXJsOiBmZWVkcy50b2RheXNTY29yZXMsXG4gICAgICAgIGFzeW5jOiBmYWxzZSxcbiAgICAgICAgc3VjY2VzczogZnVuY3Rpb24oZGF0YSkge1xuICAgICAgICAgICAgc2NvcmVzSW5pdChkYXRhKTtcbiAgICAgICAgfVxuICAgIH0pO1xufVxuXG5mdW5jdGlvbiBsZWFndWVMZWFkZXJzKCl7XG4gICAgdmFyIGxlYWd1ZUxlYWRlcnNIVE1MID0gJzxkaXYgY2xhc3M9XCJ0aXRsZVwiPjxwPkxFQUdVRSBMRUFERVJTPC9wPjxwPlBUUzwvcD48cD5SRUI8L3A+PHA+QVNUPC9wPjxwPlNUTDwvcD48cD5CTEs8L3A+PC9kaXY+JztcbiAgICB2YXIgc3RhdFR5cGUgPSAnJztcbiAgICB2YXIgZGF0YUluZGV4ID0gW1wiUkFOS1wiLFwiUExBWUVSX0lEXCIsXCJQTEFZRVJcIixcIlRFQU1fSURcIixcIlRFQU1fQUJCUkVWSUFUSU9OXCJdO1xuXG4gICAgalF1ZXJ5LmFqYXgoe1xuICAgICAgICB1cmw6IGZlZWRzLmxlYWd1ZUxlYWRlcnMsXG4gICAgICAgIGRhdGFUeXBlOiAnanNvbnAnLFxuICAgICAgICBhc3luYzogZmFsc2UsXG4gICAgICAgIHN1Y2Nlc3M6IGZ1bmN0aW9uKGRhdGEpIHtcbiAgICAgICAgICAgIHZhciBsZWFkZXJzRGF0YSA9IGRhdGEucmVzdWx0U2V0cztcbiAgICAgICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgbGVhZGVyc0RhdGEubGVuZ3RoOyBpKyspe1xuICAgICAgICAgICAgICAgIHZhciBpbmRleCA9IGNyZWF0ZUluZGV4KGRhdGFJbmRleCwgbGVhZGVyc0RhdGFbaV0uaGVhZGVycyk7XG4gICAgICAgICAgICAgICAgdmFyIHJvd3MgPSAnJztcbiAgICAgICAgICAgICAgICBpZiAoW1wiUFRTXCIsXCJSRUJcIixcIkFTVFwiLFwiU1RMXCIsXCJCTEtcIl0uaW5kZXhPZihsZWFkZXJzRGF0YVtpXS5oZWFkZXJzWzhdKSAhPT0gLTEpe1xuICAgICAgICAgICAgICAgICAgICBmb3IgKGxldCB4ID0gMDsgeCA8IGxlYWRlcnNEYXRhW2ldLnJvd1NldC5sZW5ndGg7IHgrKyl7XG4gICAgICAgICAgICAgICAgICAgICAgICB2YXIgbiA9IGxlYWRlcnNEYXRhW2ldLnJvd1NldFt4XVsyXS5zcGxpdCgnICcpO1xuICAgICAgICAgICAgICAgICAgICAgICAgdmFyIGZuID0gblswXS50b1VwcGVyQ2FzZSgpO1xuICAgICAgICAgICAgICAgICAgICAgICAgdmFyIGxuID0gblsxXS50b1VwcGVyQ2FzZSgpO1xuICAgICAgICAgICAgICAgICAgICAgICAgcm93cyArPSAnPGRpdiBjbGFzcz1cInJvd1wiPjxkaXYgY2xhc3M9XCJsZWZ0XCI+PGRpdiBjbGFzcz1cInBsYWNlXCI+JyArIGxlYWRlcnNEYXRhW2ldLnJvd1NldFt4XVswXSArICc8L2Rpdj48ZGl2IGNsYXNzPVwibG9nby13cmFwXCI+PGltZyBjbGFzcz1cImxvZ29cIiBzcmM9XCJodHRwOi8vc3RhdHMubmJhLmNvbS9tZWRpYS9pbWcvdGVhbXMvbG9nb3MvJyArIGxlYWRlcnNEYXRhW2ldLnJvd1NldFt4XVs0XSArICdfbG9nby5zdmdcIi8+PC9kaXY+PGRpdiBjbGFzcz1cIm5hbWVcIj48c3Bhbj4nICsgZm4gKyAnPC9zcGFuPiAnICsgbG4gKyAnPC9kaXY+PC9kaXY+PGRpdiBjbGFzcz1cInJpZ2h0XCI+PGRpdiBjbGFzcz1cInZhbHVlXCI+JyArIHJvdW5kKGxlYWRlcnNEYXRhW2ldLnJvd1NldFt4XVs4XSkgKyAnPC9kaXY+PC9kaXY+PC9kaXY+JztcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICBsZWFndWVMZWFkZXJzSFRNTCArPSAnPGRpdiBjbGFzcz1cImxlYWd1ZS1sZWFkZXJzLXdyYXBcIj4nICsgcm93cyArICc8L2Rpdj4nO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGpRdWVyeSgnLmxlYWd1ZS1sZWFkZXJzJykuZW1wdHkoKS5hcHBlbmQobGVhZ3VlTGVhZGVyc0hUTUwpO1xuICAgICAgICB9XG4gICAgfSk7XG4gICAgdmFyIGNvdW50ZXIgPSAyO1xuICAgIHNldEludGVydmFsKGZ1bmN0aW9uKCl7XG4gICAgICAgIGpRdWVyeSgnLmxlYWd1ZS1sZWFkZXJzLXdyYXAsIC5sZWFndWUtbGVhZGVycyAudGl0bGUgcCcpLnJlbW92ZUNsYXNzKCdhY3RpdmUnKTtcbiAgICAgICAgalF1ZXJ5KCcubGVhZ3VlLWxlYWRlcnMtd3JhcDpudGgtb2YtdHlwZSgnICsgY291bnRlciArICcpLCAubGVhZ3VlLWxlYWRlcnMgLnRpdGxlIHA6bnRoLW9mLXR5cGUoJyArIGNvdW50ZXIgKyAnKScpLmFkZENsYXNzKCdhY3RpdmUnKTtcbiAgICAgICAgaWYgKGNvdW50ZXIgPT0gNikge1xuICAgICAgICAgICAgY291bnRlciA9IDI7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICBjb3VudGVyKys7XG4gICAgICAgIH1cbiAgICB9LCAxMDAwMCk7XG59XG4iXX0=
