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
    awayRoster: function(tn){
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
};*/

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
                    (function () {
                        var cycle = function cycle() {
                            mobileApp(); // DURATION: 25s
                            setTimeout(function () {
                                leaders(gid);
                            }, 25000);
                            setTimeout(social, 69000);
                            setTimeout(function () {
                                playerSpotlight(rosterObj, playerSpotlightCounter);
                            }, 75000);
                        };

                        //CHANGE THIS
                        awayTeam = todaysScoresData.gs.g[i].v.ta;
                        awayTn = todaysScoresData.gs.g[i].v.tn.toLowerCase();
                        console.log(awayTn);
                        gid = todaysScoresData.gs.g[i].gid;
                        loadRosterData(awayTeam, awayTn);
                        scoresInit(todaysScoresData);
                        standingsInit(awayTeam);
                        /*                    mobileAppInit();*/
                        leagueLeaders();
                        leftWrap();
                        // TRANSITIONS
                        var playerSpotlightCounter = 1;

                        cycle();
                        setInterval(cycle, 90000);
                    })();
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
function init() {
    if (!gameStarted) {
        jQuery.ajax({
            url: feeds.todaysScores,
            async: false,
            success: function success(todaysScoresData) {
                var gid = '';
                for (var i = 0; i < todaysScoresData.gs.g.length; i++) {
                    if (todaysScoresData.gs.g[i].h.ta == 'BOS') {
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
    console.log('ajax' + awayTn);
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
                rosterObj.celtics.roster[pid].stats = data.pl.ca;
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
                rosterObj.away.roster[pid].stats = data.pl.ca;
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
        console.log(selectedPlayer);
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
    gameStarted = true; // DO: DELETE THIS WHEN ONLINE. JUST FOR TESTING PURPOSES RN
    var leadersTitle = 'SEASON LEADERS';
    if (gameStarted) {
        leadersTitle = 'GAME LEADERS';
        jQuery.ajax({
            url: feeds.gamedetail(gid),
            async: false,
            success: function success(data) {
                // DO: UPDATE THE LEADER OBJECTS
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
                            for (var i = 0; i < 3; i++) {
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
                console.log(rosterObj);
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
    }, 10000);
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
        } else {
            jQuery('.left-wrap .scores-and-leaders').addClass('transition-1');
        }
    }, 45000);
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
            leagueLeaders(seasonType);
        }
    }
}

function leagueLeaders() {
    var leagueLeadersHTML = '<div class="title"><p>LEAGUE LEADERS</p><p>PTS</p><p>REB</p><p>AST</p><p>STL</p><p>BLK</p></div>';
    var statType = '';
    var dataIndex = ["RANK", "PLAYER_ID", "PLAYER", "TEAM_ID", "TEAM_ABBREVIATION"];

    jQuery.ajax({
        url: feeds.leagueLeaders,
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
        }
    });
    jQuery('.league-leaders').empty().append(leagueLeadersHTML);
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJzcmMvanMvY29uY291cnNlLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7QUNBQSxJQUFJLFlBQVk7QUFDWixhQUFTO0FBQ0wsZ0JBQVEsRUFESDtBQUVMLGlCQUFTO0FBQ0wsaUJBQUssQ0FDRCxDQUFDLElBQUQsRUFBTyxJQUFQLEVBQWEsSUFBYixFQUFtQixJQUFuQixDQURDLEVBRUQsQ0FBQyxJQUFELEVBQU8sSUFBUCxFQUFhLElBQWIsRUFBbUIsSUFBbkIsQ0FGQyxFQUdELENBQUMsSUFBRCxFQUFPLElBQVAsRUFBYSxJQUFiLEVBQW1CLElBQW5CLENBSEMsQ0FEQTtBQU1MLGlCQUFLLENBQ0QsQ0FBQyxJQUFELEVBQU8sSUFBUCxFQUFhLElBQWIsRUFBbUIsSUFBbkIsQ0FEQyxFQUVELENBQUMsSUFBRCxFQUFPLElBQVAsRUFBYSxJQUFiLEVBQW1CLElBQW5CLENBRkMsRUFHRCxDQUFDLElBQUQsRUFBTyxJQUFQLEVBQWEsSUFBYixFQUFtQixJQUFuQixDQUhDLENBTkE7QUFXTCxpQkFBSyxDQUNELENBQUMsSUFBRCxFQUFPLElBQVAsRUFBYSxJQUFiLEVBQW1CLElBQW5CLENBREMsRUFFRCxDQUFDLElBQUQsRUFBTyxJQUFQLEVBQWEsSUFBYixFQUFtQixJQUFuQixDQUZDLEVBR0QsQ0FBQyxJQUFELEVBQU8sSUFBUCxFQUFhLElBQWIsRUFBbUIsSUFBbkIsQ0FIQztBQVhBO0FBRkosS0FERztBQXFCWixVQUFNO0FBQ0YsZ0JBQVEsRUFETjtBQUVGLGlCQUFTO0FBQ0wsaUJBQUssQ0FDRCxDQUFDLElBQUQsRUFBTyxJQUFQLEVBQWEsSUFBYixFQUFtQixJQUFuQixDQURDLEVBRUQsQ0FBQyxJQUFELEVBQU8sSUFBUCxFQUFhLElBQWIsRUFBbUIsSUFBbkIsQ0FGQyxFQUdELENBQUMsSUFBRCxFQUFPLElBQVAsRUFBYSxJQUFiLEVBQW1CLElBQW5CLENBSEMs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QUFLLEVBQUUsQ0FBRixFQUFLLFdBQUwsRUFBVDtBQUNBLGdDQUFRLDJEQUEyRCxZQUFZLENBQVosRUFBZSxNQUFmLENBQXNCLENBQXRCLEVBQXlCLENBQXpCLENBQTNELEdBQXlGLGlHQUF6RixHQUE2TCxZQUFZLENBQVosRUFBZSxNQUFmLENBQXNCLENBQXRCLEVBQXlCLENBQXpCLENBQTdMLEdBQTJOLDRDQUEzTixHQUEwUSxFQUExUSxHQUErUSxVQUEvUSxHQUE0UixFQUE1UixHQUFpUyxvREFBalMsR0FBd1YsTUFBTSxZQUFZLENBQVosRUFBZSxNQUFmLENBQXNCLENBQXRCLEVBQXlCLENBQXpCLENBQU4sQ0FBeFYsR0FBNlgsb0JBQXJZO0FBQ0g7QUFDRCx5Q0FBcUIsc0NBQXNDLElBQXRDLEdBQTZDLFFBQWxFO0FBQ0g7QUFDSjtBQUNKO0FBbEJPLEtBQVo7QUFvQkEsV0FBTyxpQkFBUCxFQUEwQixLQUExQixHQUFrQyxNQUFsQyxDQUF5QyxpQkFBekM7QUFDQSxRQUFJLFVBQVUsQ0FBZDtBQUNBLGdCQUFZLFlBQVU7QUFDbEIsZUFBTyxnREFBUCxFQUF5RCxXQUF6RCxDQUFxRSxRQUFyRTtBQUNBLGVBQU8sc0NBQXNDLE9BQXRDLEdBQWdELDBDQUFoRCxHQUE2RixPQUE3RixHQUF1RyxHQUE5RyxFQUFtSCxRQUFuSCxDQUE0SCxRQUE1SDtBQUNBLFlBQUksV0FBVyxDQUFmLEVBQWtCO0FBQ2Qsc0JBQVUsQ0FBVjtBQUNILFNBRkQsTUFHSztBQUNEO0FBQ0g7QUFDSixLQVRELEVBU0csSUFUSDtBQVVIIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24gZSh0LG4scil7ZnVuY3Rpb24gcyhvLHUpe2lmKCFuW29dKXtpZighdFtvXSl7dmFyIGE9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtpZighdSYmYSlyZXR1cm4gYShvLCEwKTtpZihpKXJldHVybiBpKG8sITApO3ZhciBmPW5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIrbytcIidcIik7dGhyb3cgZi5jb2RlPVwiTU9EVUxFX05PVF9GT1VORFwiLGZ9dmFyIGw9bltvXT17ZXhwb3J0czp7fX07dFtvXVswXS5jYWxsKGwuZXhwb3J0cyxmdW5jdGlvbihlKXt2YXIgbj10W29dWzFdW2VdO3JldHVybiBzKG4/bjplKX0sbCxsLmV4cG9ydHMsZSx0LG4scil9cmV0dXJuIG5bb10uZXhwb3J0c312YXIgaT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2Zvcih2YXIgbz0wO288ci5sZW5ndGg7bysrKXMocltvXSk7cmV0dXJuIHN9KSIsInZhciByb3N0ZXJPYmogPSB7XG4gICAgY2VsdGljczoge1xuICAgICAgICByb3N0ZXI6IHt9LFxuICAgICAgICBsZWFkZXJzOiB7XG4gICAgICAgICAgICBwdHM6IFtcbiAgICAgICAgICAgICAgICBbJy0tJywgJy0tJywgJy0tJywgJy0tJ10sXG4gICAgICAgICAgICAgICAgWyctLScsICctLScsICctLScsICctLSddLFxuICAgICAgICAgICAgICAgIFsnLS0nLCAnLS0nLCAnLS0nLCAnLS0nXVxuICAgICAgICAgICAgXSxcbiAgICAgICAgICAgIGFzdDogW1xuICAgICAgICAgICAgICAgIFsnLS0nLCAnLS0nLCAnLS0nLCAnLS0nXSxcbiAgICAgICAgICAgICAgICBbJy0tJywgJy0tJywgJy0tJywgJy0tJ10sXG4gICAgICAgICAgICAgICAgWyctLScsICctLScsICctLScsICctLSddXG4gICAgICAgICAgICBdLFxuICAgICAgICAgICAgcmViOiBbXG4gICAgICAgICAgICAgICAgWyctLScsICctLScsICctLScsICctLSddLFxuICAgICAgICAgICAgICAgIFsnLS0nLCAnLS0nLCAnLS0nLCAnLS0nXSxcbiAgICAgICAgICAgICAgICBbJy0tJywgJy0tJywgJy0tJywgJy0tJ11cbiAgICAgICAgICAgIF1cbiAgICAgICAgfVxuICAgIH0sXG4gICAgYXdheToge1xuICAgICAgICByb3N0ZXI6IHt9LFxuICAgICAgICBsZWFkZXJzOiB7XG4gICAgICAgICAgICBwdHM6IFtcbiAgICAgICAgICAgICAgICBbJy0tJywgJy0tJywgJy0tJywgJy0tJ10sXG4gICAgICAgICAgICAgICAgWyctLScsICctLScsICctLScsICctLSddLFxuICAgICAgICAgICAgICAgIFsnLS0nLCAnLS0nLCAnLS0nLCAnLS0nXVxuICAgICAgICAgICAgXSxcbiAgICAgICAgICAgIGFzdDogW1xuICAgICAgICAgICAgICAgIFsnLS0nLCAnLS0nLCAnLS0nLCAnLS0nXSxcbiAgICAgICAgICAgICAgICBbJy0tJywgJy0tJywgJy0tJywgJy0tJ10sXG4gICAgICAgICAgICAgICAgWyctLScsICctLScsICctLScsICctLSddXG4gICAgICAgICAgICBdLFxuICAgICAgICAgICAgcmViOiBbXG4gICAgICAgICAgICAgICAgWyctLScsICctLScsICctLScsICctLSddLFxuICAgICAgICAgICAgICAgIFsnLS0nLCAnLS0nLCAnLS0nLCAnLS0nXSxcbiAgICAgICAgICAgICAgICBbJy0tJywgJy0tJywgJy0tJywgJy0tJ11cbiAgICAgICAgICAgIF1cbiAgICAgICAgfVxuICAgIH1cbn07XG5cbi8vIExPQ0FMXG4vKnZhciBmZWVkcyA9IHtcbiAgICB0b2RheXNTY29yZXM6ICdodHRwOi8vbG9jYWxob3N0Ojg4ODgvZGF0YS9tb2JpbGUtc3RhdHMtZmVlZC90b2RheXNfc2NvcmVzLmpzb24nLFxuICAgIGNlbHRpY3NSb3N0ZXI6ICdodHRwOi8vbG9jYWxob3N0Ojg4ODgvZGF0YS9tb2JpbGUtc3RhdHMtZmVlZC9jZWx0aWNzX3Jvc3Rlci5qc29uJyxcbiAgICBhd2F5Um9zdGVyOiBmdW5jdGlvbih0bil7XG4gICAgICAgIHJldHVybiAnaHR0cDovL2xvY2FsaG9zdDo4ODg4L2RhdGEvbW9iaWxlLXN0YXRzLWZlZWQvYXdheV9yb3N0ZXIuanNvbic7XG4gICAgfSxcbiAgICBiaW9EYXRhOiAnaHR0cDovL2xvY2FsaG9zdDo4ODg4L2RhdGEvYmlvLWRhdGEuanNvbicsXG4gICAgcGxheWVyY2FyZDogZnVuY3Rpb24ocGlkKXtcbiAgICAgICAgcmV0dXJuICdodHRwOi8vbG9jYWxob3N0Ojg4ODgvZGF0YS9tb2JpbGUtc3RhdHMtZmVlZC9wbGF5ZXJjYXJkcy9wbGF5ZXJjYXJkLScgKyBwaWQgKyAnLmpzb24nO1xuICAgIH0sXG4gICAgcGxheWVyY2FyZEF3YXk6IGZ1bmN0aW9uKHBpZCl7XG4gICAgICAgIHJldHVybiAnaHR0cDovL2xvY2FsaG9zdDo4ODg4L2RhdGEvbW9iaWxlLXN0YXRzLWZlZWQvcGxheWVyY2FyZHMvcGxheWVyY2FyZC0yMDIzMzAuanNvbic7XG4gICAgfSxcbiAgICBnYW1lZGV0YWlsOiBmdW5jdGlvbihnaWQpIHtcbiAgICAgICAgcmV0dXJuICdodHRwOi8vbG9jYWxob3N0Ojg4ODgvZGF0YS9tb2JpbGUtc3RhdHMtZmVlZC9nYW1lZGV0YWlsLmpzb24nO1xuICAgIH0sXG4gICAgc3RhbmRpbmdzOiAnaHR0cDovL2xvY2FsaG9zdDo4ODg4L2RhdGEvbW9iaWxlLXN0YXRzLWZlZWQvc3RhbmRpbmdzLmpzb24nLFxuICAgIGxlYWd1ZUxlYWRlcnM6ICdodHRwOi8vbG9jYWxob3N0Ojg4ODgvZGF0YS9sZWFndWVfbGVhZGVycy5qc29uJ1xufTsqL1xuXG4vLyBPTkxJTkVcblxudmFyIGZlZWRzID0ge1xuICAgIHRvZGF5c1Njb3JlczogJ2h0dHA6Ly9kYXRhLm5iYS5jb20vZGF0YS92MjAxNS9qc29uL21vYmlsZV90ZWFtcy9uYmEvMjAxNy9zY29yZXMvMDBfdG9kYXlzX3Njb3Jlcy5qc29uJyxcbiAgICBjZWx0aWNzUm9zdGVyOiAnaHR0cDovL2RhdGEubmJhLmNvbS9kYXRhL3YyMDE1L2pzb24vbW9iaWxlX3RlYW1zL25iYS8yMDE3L3RlYW1zL2NlbHRpY3Nfcm9zdGVyLmpzb24nLFxuICAgIGF3YXlSb3N0ZXI6IGZ1bmN0aW9uKGF3YXlUbil7XG4gICAgICAgIHJldHVybiAnaHR0cDovL2RhdGEubmJhLmNvbS9kYXRhL3YyMDE1L2pzb24vbW9iaWxlX3RlYW1zL25iYS8yMDE3L3RlYW1zLycgKyBhd2F5VG4gKyAnX3Jvc3Rlci5qc29uJztcbiAgICB9LFxuICAgIGJpb0RhdGE6ICdodHRwOi8vaW8uY25uLm5ldC9uYmEvbmJhLy5lbGVtZW50L21lZGlhLzIuMC90ZWFtc2l0ZXMvY2VsdGljcy9qc29uL2Jpby1kYXRhLmpzb24nLFxuICAgIHBsYXllcmNhcmQ6IGZ1bmN0aW9uKHBpZCl7XG4gICAgICAgIHJldHVybiAnaHR0cDovL2RhdGEubmJhLmNvbS9kYXRhL3YyMDE1L2pzb24vbW9iaWxlX3RlYW1zL25iYS8yMDE3L3BsYXllcnMvcGxheWVyY2FyZF8nICsgcGlkICsgJ18wMi5qc29uJztcbiAgICB9LFxuICAgIHBsYXllcmNhcmRBd2F5OiBmdW5jdGlvbihwaWQpe1xuICAgICAgICByZXR1cm4gJ2h0dHA6Ly9kYXRhLm5iYS5jb20vZGF0YS92MjAxNS9qc29uL21vYmlsZV90ZWFtcy9uYmEvMjAxNy9wbGF5ZXJzL3BsYXllcmNhcmRfJyArIHBpZCArICdfMDIuanNvbic7XG4gICAgfSxcbiAgICBnYW1lZGV0YWlsOiBmdW5jdGlvbihnaWQpIHtcbiAgICAgICAgcmV0dXJuICdodHRwOi8vZGF0YS5uYmEuY29tL2RhdGEvdjIwMTUvanNvbi9tb2JpbGVfdGVhbXMvbmJhLzIwMTcvc2NvcmVzL2dhbWVkZXRhaWwvJyArIGdpZCArICdfZ2FtZWRldGFpbC5qc29uJztcbiAgICB9LFxuICAgIHN0YW5kaW5nczogJ2h0dHA6Ly9kYXRhLm5iYS5jb20vZGF0YS92MjAxNS9qc29uL21vYmlsZV90ZWFtcy9uYmEvMjAxNy8wMF9zdGFuZGluZ3MuanNvbicsXG4gICAgbGVhZ3VlTGVhZGVyczogJ2h0dHA6Ly9zdGF0cy5uYmEuY29tL3N0YXRzL2hvbWVwYWdldjI/R2FtZVNjb3BlPVNlYXNvbiZMZWFndWVJRD0wMCZQbGF5ZXJPclRlYW09UGxheWVyJlBsYXllclNjb3BlPUFsbCtQbGF5ZXJzJlNlYXNvbj0yMDE3LTE4JlNlYXNvblR5cGU9UmVndWxhcitTZWFzb24mU3RhdFR5cGU9VHJhZGl0aW9uYWwmY2FsbGJhY2s9Pydcbn07XG5cbmpRdWVyeShkb2N1bWVudCkucmVhZHkoZnVuY3Rpb24oKSB7XG4gICAgdmFyIGdpZCA9ICcnO1xuICAgIHZhciBhd2F5VGVhbSA9ICcnO1xuICAgIHZhciBhd2F5VG4gPSAnJztcbiAgICB2YXIgZGF0ZSA9IG5ldyBEYXRlKCk7XG4gICAgdmFyIGxlZnRXcmFwQ291bnRlciA9IGZhbHNlO1xuICAgIGpRdWVyeS5hamF4KHtcbiAgICAgICAgdXJsOiBmZWVkcy50b2RheXNTY29yZXMsXG4gICAgICAgIGFzeW5jOiBmYWxzZSxcbiAgICAgICAgc3VjY2VzczogZnVuY3Rpb24odG9kYXlzU2NvcmVzRGF0YSkge1xuICAgICAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCB0b2RheXNTY29yZXNEYXRhLmdzLmcubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgICAgICBpZiAodG9kYXlzU2NvcmVzRGF0YS5ncy5nW2ldLmgudGEgPT0gJ0JPUycpIHsgLy9DSEFOR0UgVEhJU1xuICAgICAgICAgICAgICAgICAgICBhd2F5VGVhbSA9IHRvZGF5c1Njb3Jlc0RhdGEuZ3MuZ1tpXS52LnRhO1xuICAgICAgICAgICAgICAgICAgICBhd2F5VG4gPSB0b2RheXNTY29yZXNEYXRhLmdzLmdbaV0udi50bi50b0xvd2VyQ2FzZSgpO1xuICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhhd2F5VG4pO1xuICAgICAgICAgICAgICAgICAgICBnaWQgPSB0b2RheXNTY29yZXNEYXRhLmdzLmdbaV0uZ2lkO1xuICAgICAgICAgICAgICAgICAgICBsb2FkUm9zdGVyRGF0YShhd2F5VGVhbSwgYXdheVRuKTtcbiAgICAgICAgICAgICAgICAgICAgc2NvcmVzSW5pdCh0b2RheXNTY29yZXNEYXRhKTtcbiAgICAgICAgICAgICAgICAgICAgc3RhbmRpbmdzSW5pdChhd2F5VGVhbSk7XG4vKiAgICAgICAgICAgICAgICAgICAgbW9iaWxlQXBwSW5pdCgpOyovXG4gICAgICAgICAgICAgICAgICAgIGxlYWd1ZUxlYWRlcnMoKTtcbiAgICAgICAgICAgICAgICAgICAgbGVmdFdyYXAoKTtcbiAgICAgICAgICAgICAgICAgICAgLy8gVFJBTlNJVElPTlNcbiAgICAgICAgICAgICAgICAgICAgbGV0IHBsYXllclNwb3RsaWdodENvdW50ZXIgPSAxO1xuICAgICAgICAgICAgICAgICAgICBmdW5jdGlvbiBjeWNsZSgpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIG1vYmlsZUFwcCgpOyAvLyBEVVJBVElPTjogMjVzXG4gICAgICAgICAgICAgICAgICAgICAgICBzZXRUaW1lb3V0KGZ1bmN0aW9uKCl7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgbGVhZGVycyhnaWQpO1xuICAgICAgICAgICAgICAgICAgICAgICAgfSwgMjUwMDApO1xuICAgICAgICAgICAgICAgICAgICAgICAgc2V0VGltZW91dChzb2NpYWwsIDY5MDAwKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHNldFRpbWVvdXQoZnVuY3Rpb24oKXtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBwbGF5ZXJTcG90bGlnaHQocm9zdGVyT2JqLCBwbGF5ZXJTcG90bGlnaHRDb3VudGVyKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH0sIDc1MDAwKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICBjeWNsZSgpO1xuICAgICAgICAgICAgICAgICAgICBzZXRJbnRlcnZhbChjeWNsZSwgOTAwMDApO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH0pO1xuICAgIC8vIGxvYWRSb3N0ZXJEYXRhKCk7IE9OTFkgT05DRVxuICAgIC8qICAgIHNldFRpbWVvdXQobGVhZGVycyhnaWQsIGdhbWVTdGFydGVkKSwgNDAwKTsqL1xufSk7XG5cbmZ1bmN0aW9uIGN5Y2xlKCkge1xuXG59XG4vKj09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG49ICAgICAgICAgICAgTUlTQyBGVU5DVElPTlMgICAgICAgICAgICA9XG49PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PSovXG5mdW5jdGlvbiBwbGF5ZXJBZ2UoZG9iKSB7XG4gICAgdmFyIHRvZGF5ID0gbmV3IERhdGUoKTtcbiAgICB2YXIgYmlydGhEYXRlID0gbmV3IERhdGUoZG9iKTtcbiAgICB2YXIgYWdlID0gdG9kYXkuZ2V0RnVsbFllYXIoKSAtIGJpcnRoRGF0ZS5nZXRGdWxsWWVhcigpO1xuICAgIHJldHVybiBhZ2U7XG59XG5cbmZ1bmN0aW9uIGdlbmVyYXRlVGltZWxpbmUoc2VsZWN0ZWRQbGF5ZXIpIHtcbiAgICAvLyBBUFBFTkQ6IFRJTUVMSU5FXG4gICAgdmFyIHNlYXNvbnNQbGF5ZWQgPSByb3N0ZXJPYmouY2VsdGljcy5yb3N0ZXJbc2VsZWN0ZWRQbGF5ZXJdLnN0YXRzLnNhLmxlbmd0aDtcbiAgICB2YXIgdGltZWxpbmVIVE1MID0gJyc7XG4gICAgdmFyIHNlYXNvblllYXJIVE1MID0gJyc7XG4gICAgZm9yICh2YXIgaSA9IDA7IGkgPCBzZWFzb25zUGxheWVkOyBpKyspIHtcbiAgICAgICAgdmFyIHRlYW1BYmJyZXZpYXRpb24gPSByb3N0ZXJPYmouY2VsdGljcy5yb3N0ZXJbc2VsZWN0ZWRQbGF5ZXJdLnN0YXRzLnNhW2ldLnRhO1xuICAgICAgICB2YXIgdHJhZGVkID0gcm9zdGVyT2JqLmNlbHRpY3Mucm9zdGVyW3NlbGVjdGVkUGxheWVyXS5zdGF0cy5zYVtpXS5zcGwubGVuZ3RoO1xuICAgICAgICB2YXIgc2VnbWVudElubmVyID0gXCJcIjtcbiAgICAgICAgdmFyIHRpdGxlID0gXCJcIjtcbiAgICAgICAgdmFyIHNlYXNvblllYXJUZXh0ID0gcm9zdGVyT2JqLmNlbHRpY3Mucm9zdGVyW3NlbGVjdGVkUGxheWVyXS5zdGF0cy5zYVtpXS52YWw7XG4gICAgICAgIGlmIChpID09PSAwIHx8IHRlYW1BYmJyZXZpYXRpb24gIT09IHJvc3Rlck9iai5jZWx0aWNzLnJvc3RlcltzZWxlY3RlZFBsYXllcl0uc3RhdHMuc2FbaSAtIDFdLnRhKSB7IC8vIElmIHRoaXMgaXMgYSBuZXcgdGVhbSwgc3RhcnQgdGhlIHRlYW0gd3JhcC5cbiAgICAgICAgICAgIHRpdGxlID0gdGVhbUFiYnJldmlhdGlvbjtcbiAgICAgICAgfVxuICAgICAgICBpZiAodHJhZGVkKSB7XG4gICAgICAgICAgICBmb3IgKHZhciB4ID0gMDsgeCA8IHRyYWRlZDsgeCsrKSB7XG4gICAgICAgICAgICAgICAgdmFyIGdwVG90ID0gcm9zdGVyT2JqLmNlbHRpY3Mucm9zdGVyW3NlbGVjdGVkUGxheWVyXS5zdGF0cy5zYVtpXS5ncDtcbiAgICAgICAgICAgICAgICB2YXIgZ3AgPSByb3N0ZXJPYmouY2VsdGljcy5yb3N0ZXJbc2VsZWN0ZWRQbGF5ZXJdLnN0YXRzLnNhW2ldLnNwbFt4XS5ncDtcbiAgICAgICAgICAgICAgICB2YXIgZ3BQZXJjZW50YWdlID0gTWF0aC5yb3VuZCgoZ3AgLyBncFRvdCkgKiAxMDApO1xuICAgICAgICAgICAgICAgIHRlYW1BYmJyZXZpYXRpb24gPSByb3N0ZXJPYmouY2VsdGljcy5yb3N0ZXJbc2VsZWN0ZWRQbGF5ZXJdLnN0YXRzLnNhW2ldLnNwbFt4XS50YTtcbiAgICAgICAgICAgICAgICBpZiAoaSA9PT0gMCB8fCB0ZWFtQWJicmV2aWF0aW9uICE9PSByb3N0ZXJPYmouY2VsdGljcy5yb3N0ZXJbc2VsZWN0ZWRQbGF5ZXJdLnN0YXRzLnNhW2kgLSAxXS50YSAmJiB0ZWFtQWJicmV2aWF0aW9uICE9PSByb3N0ZXJPYmouY2VsdGljcy5yb3N0ZXJbc2VsZWN0ZWRQbGF5ZXJdLnN0YXRzLnNhW2kgKyAxXS50YSkgeyAvLyBJZiB0aGlzIGlzIGEgbmV3IHRlYW0sIHN0YXJ0IHRoZSB0ZWFtIHdyYXAuXG4gICAgICAgICAgICAgICAgICAgIHRpdGxlID0gdGVhbUFiYnJldmlhdGlvbjtcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICB0aXRsZSA9IFwiXCI7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIHNlZ21lbnRJbm5lciArPSAnPGRpdiBkYXRhLXNlYXNvbi15ZWFyPVwiJyArIHNlYXNvblllYXJUZXh0ICsgJ1wiIGRhdGEtdGVhbT1cIicgKyB0ZWFtQWJicmV2aWF0aW9uICsgJ1wiIHN0eWxlPVwiXCIgY2xhc3M9XCJzZWdtZW50LWlubmVyICcgKyB0ZWFtQWJicmV2aWF0aW9uICsgJy1iZ1wiPjxwPicgKyB0aXRsZSArICc8L3A+PC9kaXY+JztcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHNlZ21lbnRJbm5lciA9ICc8ZGl2IGRhdGEtc2Vhc29uLXllYXI9XCInICsgc2Vhc29uWWVhclRleHQgKyAnXCIgZGF0YS10ZWFtPVwiJyArIHRlYW1BYmJyZXZpYXRpb24gKyAnXCIgY2xhc3M9XCJzZWdtZW50LWlubmVyICcgKyB0ZWFtQWJicmV2aWF0aW9uICsgJy1iZ1wiPjxwPicgKyB0aXRsZSArICc8L3A+PC9kaXY+JztcbiAgICAgICAgfVxuICAgICAgICB0aW1lbGluZUhUTUwgKz0gJzxkaXYgY2xhc3M9XCJzZWdtZW50XCI+JyArIHNlZ21lbnRJbm5lciArICc8L2Rpdj4nO1xuICAgICAgICBzZWFzb25ZZWFySFRNTCArPSAnPGRpdiBjbGFzcz1cInNlZ21lbnRcIj48cD4nICsgc2Vhc29uWWVhclRleHQgKyAnPC9wPjwvZGl2Pic7XG4gICAgfVxuICAgIGpRdWVyeShcIi50aW1lbGluZS13cmFwXCIpLmh0bWwoJzxkaXYgY2xhc3M9XCJ0aW1lbGluZSBhcHBlbmRlZFwiPicgKyB0aW1lbGluZUhUTUwgKyAnPC9kaXY+PGRpdiBjbGFzcz1cInNlYXNvbi15ZWFyIGFwcGVuZGVkXCI+JyArIHNlYXNvblllYXJIVE1MICsgJzwvZGl2PicpO1xufVxuXG5mdW5jdGlvbiBjcmVhdGVJbmRleChrZXlzLCBhcnJheSkge1xuICAgIHZhciBuZXdBcnIgPSBrZXlzLm1hcChpdGVtID0+IGFycmF5LmluZGV4T2YoaXRlbSkpO1xuICAgIHJldHVybiBuZXdBcnI7XG59XG5cbmZ1bmN0aW9uIHJvdW5kKG51bWJlcikge1xuICAgIGlmICh0eXBlb2YgbnVtYmVyICE9PSBcIm51bWJlclwiIHx8IG51bWJlciA9PSB1bmRlZmluZWQpIHtcbiAgICAgICAgcmV0dXJuIG51bWJlcjtcbiAgICB9IGVsc2Uge1xuICAgICAgICByZXR1cm4gbnVtYmVyLnRvRml4ZWQoMSk7XG4gICAgfVxufVxuLyo9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG49ICAgICAgICAgICAgSU5JVElBTElaRSAgICAgICAgICAgID1cbj09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT0qL1xuZnVuY3Rpb24gaW5pdCgpIHtcbiAgICBpZiAoIWdhbWVTdGFydGVkKSB7XG4gICAgICAgIGpRdWVyeS5hamF4KHtcbiAgICAgICAgICAgIHVybDogZmVlZHMudG9kYXlzU2NvcmVzLFxuICAgICAgICAgICAgYXN5bmM6IGZhbHNlLFxuICAgICAgICAgICAgc3VjY2VzczogZnVuY3Rpb24odG9kYXlzU2NvcmVzRGF0YSkge1xuICAgICAgICAgICAgICAgIHZhciBnaWQgPSAnJztcbiAgICAgICAgICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IHRvZGF5c1Njb3Jlc0RhdGEuZ3MuZy5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgICAgICAgICBpZiAodG9kYXlzU2NvcmVzRGF0YS5ncy5nW2ldLmgudGEgPT0gJ0JPUycpIHsgLy8gQ0hBTkdFIFRISVMgVE8gJ0JPUycgV0hFTiBUSEUgVElNRSBDT01FU1xuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHRvZGF5c1Njb3Jlc0RhdGEuZ3MuZ1tpXSAhPT0gMSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGdhbWVTdGFydGVkID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgfVxufTtcbi8qPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG49ICAgICAgICAgICAgTE9BRCBST1NURVIgSU5GTyAoYnVpbGQgcm9zdGVyT2JqKSAgICAgICAgICAgICAgPVxuPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09Ki9cblxuZnVuY3Rpb24gbG9hZFJvc3RlckRhdGEoYXdheVRlYW0sIGF3YXlUbikge1xuICAgIHZhciByb3N0ZXIgPSAnJztcbiAgICBqUXVlcnkuYWpheCh7XG4gICAgICAgIHVybDogZmVlZHMuY2VsdGljc1Jvc3RlcixcbiAgICAgICAgYXN5bmM6IGZhbHNlLFxuICAgICAgICBzdWNjZXNzOiBmdW5jdGlvbihkYXRhKSB7XG4gICAgICAgICAgICByb3N0ZXIgPSBkYXRhO1xuICAgICAgICAgICAgZm9yICh2YXIgcHJvcGVydHkgaW4gcm9zdGVyLnQpIHtcbiAgICAgICAgICAgICAgICBpZiAocHJvcGVydHkgIT09ICdwbCcpIHtcbiAgICAgICAgICAgICAgICAgICAgcm9zdGVyT2JqLmNlbHRpY3NbcHJvcGVydHldID0gcm9zdGVyLnRbcHJvcGVydHldO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfSxcbiAgICAgICAgZXJyb3I6IGZ1bmN0aW9uKCkge31cbiAgICB9KTtcbiAgICB2YXIgYXdheVJvc3RlciA9ICcnO1xuICAgIGNvbnNvbGUubG9nKCdhamF4JyArIGF3YXlUbik7XG4gICAgalF1ZXJ5LmFqYXgoe1xuICAgICAgICB1cmw6IGZlZWRzLmF3YXlSb3N0ZXIoYXdheVRuKSxcbiAgICAgICAgYXN5bmM6IGZhbHNlLFxuICAgICAgICBzdWNjZXNzOiBmdW5jdGlvbihkYXRhKSB7XG4gICAgICAgICAgICBhd2F5Um9zdGVyID0gZGF0YTtcbiAgICAgICAgICAgIGZvciAodmFyIHByb3BlcnR5IGluIGF3YXlSb3N0ZXIudCkge1xuICAgICAgICAgICAgICAgIGlmIChwcm9wZXJ0eSAhPT0gJ3BsJykge1xuICAgICAgICAgICAgICAgICAgICByb3N0ZXJPYmouYXdheVtwcm9wZXJ0eV0gPSBhd2F5Um9zdGVyLnRbcHJvcGVydHldO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfSxcbiAgICAgICAgZXJyb3I6IGZ1bmN0aW9uKCkge31cbiAgICB9KTtcbiAgICB2YXIgYmlvRGF0YSA9ICcnO1xuICAgIGpRdWVyeS5hamF4KHtcbiAgICAgICAgdXJsOiBmZWVkcy5iaW9EYXRhLFxuICAgICAgICBhc3luYzogZmFsc2UsXG4gICAgICAgIHN1Y2Nlc3M6IGZ1bmN0aW9uKGRhdGEpIHtcbiAgICAgICAgICAgIGJpb0RhdGEgPSBkYXRhO1xuICAgICAgICB9LFxuICAgICAgICBlcnJvcjogZnVuY3Rpb24oKSB7fVxuICAgIH0pO1xuICAgIGZvciAodmFyIGkgPSAwOyBpIDwgcm9zdGVyLnQucGwubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgdmFyIHBpZCA9IHJvc3Rlci50LnBsW2ldLnBpZDtcbiAgICAgICAgcm9zdGVyT2JqLmNlbHRpY3Mucm9zdGVyW3BpZF0gPSByb3N0ZXIudC5wbFtpXTtcbiAgICAgICAgZm9yICh2YXIgcHJvcGVydHkgaW4gYmlvRGF0YVtwaWRdKSB7XG4gICAgICAgICAgICByb3N0ZXJPYmouY2VsdGljcy5yb3N0ZXJbcGlkXS5iaW8gPSBiaW9EYXRhW3BpZF07XG4gICAgICAgIH07XG4gICAgICAgIGpRdWVyeS5hamF4KHtcbiAgICAgICAgICAgIHVybDogZmVlZHMucGxheWVyY2FyZChwaWQpLFxuICAgICAgICAgICAgYXN5bmM6IGZhbHNlLFxuICAgICAgICAgICAgc3VjY2VzczogZnVuY3Rpb24oZGF0YSkge1xuICAgICAgICAgICAgICAgIHJvc3Rlck9iai5jZWx0aWNzLnJvc3RlcltwaWRdLnN0YXRzID0gZGF0YS5wbC5jYTtcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBlcnJvcjogZnVuY3Rpb24oKSB7fVxuICAgICAgICB9KTtcbiAgICB9XG4gICAgZm9yICh2YXIgaSA9IDA7IGkgPCBhd2F5Um9zdGVyLnQucGwubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgdmFyIHBpZCA9IGF3YXlSb3N0ZXIudC5wbFtpXS5waWQ7XG4gICAgICAgIHJvc3Rlck9iai5hd2F5LnJvc3RlcltwaWRdID0gYXdheVJvc3Rlci50LnBsW2ldO1xuICAgICAgICBqUXVlcnkuYWpheCh7XG4gICAgICAgICAgICB1cmw6IGZlZWRzLnBsYXllcmNhcmRBd2F5KHBpZCksIC8vIENIQU5HRSBQSURcbiAgICAgICAgICAgIGFzeW5jOiBmYWxzZSxcbiAgICAgICAgICAgIHN1Y2Nlc3M6IGZ1bmN0aW9uKGRhdGEpIHtcbiAgICAgICAgICAgICAgICByb3N0ZXJPYmouYXdheS5yb3N0ZXJbcGlkXS5zdGF0cyA9IGRhdGEucGwuY2E7XG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgZXJyb3I6IGZ1bmN0aW9uKCkge31cbiAgICAgICAgfSk7XG4gICAgfVxuICAgIGZvciAodmFyIHRlYW0gaW4gcm9zdGVyT2JqKSB7XG4gICAgICAgIGZvciAodmFyIHBsYXllciBpbiByb3N0ZXJPYmpbdGVhbV0ucm9zdGVyKSB7XG4gICAgICAgICAgICBmb3IgKHZhciBzdGF0IGluIHJvc3Rlck9ialt0ZWFtXS5sZWFkZXJzKSB7XG4gICAgICAgICAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCAzOyBpKyspIHtcbiAgICAgICAgICAgICAgICAgICAgaWYgKHJvc3Rlck9ialt0ZWFtXS5sZWFkZXJzW3N0YXRdW2ldWzJdID09ICctLScgJiYgcm9zdGVyT2JqW3RlYW1dLnJvc3RlcltwbGF5ZXJdLnN0YXRzW3N0YXRdID4gMCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgcm9zdGVyT2JqW3RlYW1dLmxlYWRlcnNbc3RhdF1baV1bMF0gPSByb3N0ZXJPYmpbdGVhbV0ucm9zdGVyW3BsYXllcl0uZm4udG9VcHBlckNhc2UoKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJvc3Rlck9ialt0ZWFtXS5sZWFkZXJzW3N0YXRdW2ldWzFdID0gcm9zdGVyT2JqW3RlYW1dLnJvc3RlcltwbGF5ZXJdLmxuLnRvVXBwZXJDYXNlKCk7XG4gICAgICAgICAgICAgICAgICAgICAgICByb3N0ZXJPYmpbdGVhbV0ubGVhZGVyc1tzdGF0XVtpXVsyXSA9IHJvc3Rlck9ialt0ZWFtXS5yb3N0ZXJbcGxheWVyXS5zdGF0c1tzdGF0XTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJvc3Rlck9ialt0ZWFtXS5sZWFkZXJzW3N0YXRdW2ldWzNdID0gcm9zdGVyT2JqW3RlYW1dLnJvc3RlcltwbGF5ZXJdLnBpZDtcbiAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgICAgICB9IGVsc2UgaWYgKHJvc3Rlck9ialt0ZWFtXS5yb3N0ZXJbcGxheWVyXS5zdGF0c1tzdGF0XSA+IHJvc3Rlck9ialt0ZWFtXS5sZWFkZXJzW3N0YXRdW2ldWzJdICYmIHJvc3Rlck9ialt0ZWFtXS5yb3N0ZXJbcGxheWVyXS5zdGF0c1tzdGF0XSA+IDApIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJvc3Rlck9ialt0ZWFtXS5sZWFkZXJzW3N0YXRdW2ldWzBdID0gcm9zdGVyT2JqW3RlYW1dLnJvc3RlcltwbGF5ZXJdLmZuLnRvVXBwZXJDYXNlKCk7XG4gICAgICAgICAgICAgICAgICAgICAgICByb3N0ZXJPYmpbdGVhbV0ubGVhZGVyc1tzdGF0XVtpXVsxXSA9IHJvc3Rlck9ialt0ZWFtXS5yb3N0ZXJbcGxheWVyXS5sbi50b1VwcGVyQ2FzZSgpO1xuICAgICAgICAgICAgICAgICAgICAgICAgcm9zdGVyT2JqW3RlYW1dLmxlYWRlcnNbc3RhdF1baV1bMl0gPSByb3N0ZXJPYmpbdGVhbV0ucm9zdGVyW3BsYXllcl0uc3RhdHNbc3RhdF07XG4gICAgICAgICAgICAgICAgICAgICAgICByb3N0ZXJPYmpbdGVhbV0ubGVhZGVyc1tzdGF0XVtpXVszXSA9IHJvc3Rlck9ialt0ZWFtXS5yb3N0ZXJbcGxheWVyXS5waWQ7XG4gICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH07XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9XG4gICAgY29uc29sZS5sb2cocm9zdGVyT2JqKTtcbn07XG5cbmZ1bmN0aW9uIHN0YXRzTm90QXZhaWxhYmxlKHBpZCkge1xuICAgIHJvc3Rlck9ialtwaWRdLnN0YXRzID0ge307XG4gICAgcm9zdGVyT2JqW3BpZF0uc3RhdHMuc2EgPSBbe31dO1xuICAgIHJvc3Rlck9ialtwaWRdLnN0YXRzLmhhc1N0YXRzID0gZmFsc2U7XG4gICAgdmFyIGNhSW5kZXggPSBbJ2dwJywgJ2dzJywgJ21pbicsICdmZ3AnLCAndHBwJywgJ2Z0cCcsICdvcmViJywgJ2RyZWInLCAncmViJywgJ2FzdCcsICdzdGwnLCAnYmxrJywgJ3RvdicsICdwZicsICdwdHMnLCAnbm9zdGF0cyddO1xuICAgIHZhciBzYUluZGV4ID0gWyd0aWQnLCAndmFsJywgJ2dwJywgJ2dzJywgJ21pbicsICdmZ3AnLCAndHBwJywgJ2Z0cCcsICdvcmViJywgJ2RyZWInLCAncmViJywgJ2FzdCcsICdzdGwnLCAnYmxrJywgJ3RvdicsICdwZicsICdwdHMnLCAnc3BsJywgJ3RhJywgJ3RuJywgJ3RjJ107XG4gICAgZm9yICh2YXIgaSA9IDA7IGkgPCBzYUluZGV4Lmxlbmd0aDsgaSsrKSB7XG4gICAgICAgIHJvc3Rlck9ialtwaWRdLnN0YXRzLnNhWzBdW3NhSW5kZXhbaV1dID0gXCJOL0FcIjtcbiAgICAgICAgaWYgKGkgPT09IDEpIHtcbiAgICAgICAgICAgIHJvc3Rlck9ialtwaWRdLnN0YXRzLnNhWzBdW3NhSW5kZXhbaV1dID0gcGxheWVyQ2FyZFllYXIudG9TdHJpbmcoKS5zdWJzdHIoMiwgMikgKyBcIi1cIiArIChwbGF5ZXJDYXJkWWVhciArIDEpLnRvU3RyaW5nKCkuc3Vic3RyKDIsIDIpO1xuICAgICAgICB9XG4gICAgICAgIGlmIChpID09PSAxNykge1xuICAgICAgICAgICAgcm9zdGVyT2JqW3BpZF0uc3RhdHMuc2FbMF1bc2FJbmRleFtpXV0gPSBbXTtcbiAgICAgICAgfVxuICAgICAgICBpZiAoaSA9PT0gMTgpIHtcbiAgICAgICAgICAgIHJvc3Rlck9ialtwaWRdLnN0YXRzLnNhWzBdW3NhSW5kZXhbaV1dID0gJ0JPUyc7XG4gICAgICAgIH1cbiAgICB9XG4gICAgZm9yICh2YXIgaSA9IDA7IGkgPCBjYUluZGV4Lmxlbmd0aDsgaSsrKSB7XG4gICAgICAgIHJvc3Rlck9ialtwaWRdLnN0YXRzW2NhSW5kZXhbaV1dID0gXCJOL0FcIjtcbiAgICAgICAgaWYgKGkgPT09IDE1KSB7XG4gICAgICAgICAgICByb3N0ZXJPYmpbcGlkXS5zdGF0c1tjYUluZGV4W2ldXSA9IHRydWU7XG4gICAgICAgIH1cbiAgICB9XG59O1xuXG5mdW5jdGlvbiBsb2FkR2FtZURldGFpbChnaWQpIHt9O1xuXG5mdW5jdGlvbiBsb2FkQXdheVRlYW1EYXRhKCkge31cbi8qPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuPSAgICAgICAgICAgIFJJR0hUIFdSQVAgICAgICAgICAgICA9XG49PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09Ki9cblxuXG5mdW5jdGlvbiBwbGF5ZXJTcG90bGlnaHQocm9zdGVyT2JqLCBwbGF5ZXJTcG90bGlnaHRDb3VudGVyKSB7XG4gICAgLyogMSAtIFdISVRFIExJTkUgSE9SSVpUT05BTCAqL1xuICAgIHNldFRpbWVvdXQoZnVuY3Rpb24oKSB7XG4gICAgICAgIGpRdWVyeSgnLndoaXRlLWxpbmUuaG9yaXpvbnRhbCcpLmFkZENsYXNzKCd0cmFuc2l0aW9uLTEnKTtcbiAgICB9LCA1MDApO1xuICAgIHNldFRpbWVvdXQoZnVuY3Rpb24oKSB7XG4gICAgICAgIGpRdWVyeSgnLnNvY2lhbC10b3AgLndoaXRlLWxpbmUudmVydGljYWw6bnRoLWNoaWxkKG9kZCknKS5hZGRDbGFzcygndHJhbnNpdGlvbi0xJyk7XG4gICAgICAgIGpRdWVyeSgnLnNvY2lhbC1ib3R0b20gLndoaXRlLWxpbmUudmVydGljYWw6bnRoLWNoaWxkKGV2ZW4pJykuYWRkQ2xhc3MoJ3RyYW5zaXRpb24tMScpO1xuICAgIH0sIDgwMCk7XG4gICAgLyogMmIgLSBXSElURSBMSU5FIFZFUlRJQ0FMICovXG4gICAgc2V0VGltZW91dChmdW5jdGlvbigpIHtcbiAgICAgICAgalF1ZXJ5KCcuc29jaWFsLXRvcCAud2hpdGUtbGluZS52ZXJ0aWNhbDpudGgtY2hpbGQoZXZlbiknKS5hZGRDbGFzcygndHJhbnNpdGlvbi0xJyk7XG4gICAgICAgIGpRdWVyeSgnLnNvY2lhbC1ib3R0b20gLndoaXRlLWxpbmUudmVydGljYWw6bnRoLWNoaWxkKG9kZCknKS5hZGRDbGFzcygndHJhbnNpdGlvbi0xJyk7XG4gICAgfSwgMTAwMCk7XG4gICAgLyogMyAtIEdFTkVSQVRFIEFORCBSRVZFQUwgUExBWUVSIEJPWEVTICovXG4gICAgc2V0VGltZW91dChmdW5jdGlvbigpIHtcbiAgICAgICAgalF1ZXJ5KCcuc29jaWFsLXRvcCwgLnNvY2lhbC1ib3R0b20nKS5hZGRDbGFzcygndHJhbnNpdGlvbi0xJyk7XG4gICAgICAgIGpRdWVyeSgnLnBsYXllci1ib3gtd3JhcCcpLmFkZENsYXNzKCd0cmFuc2l0aW9uLTEnKTtcbiAgICB9LCAxMjAwKTtcbiAgICAvKiA0IC0gQVBQRU5EIEhFQURTSE9UUyAqL1xuICAgIHNldFRpbWVvdXQoZnVuY3Rpb24oKSB7XG4gICAgICAgIGpRdWVyeSgnLnBsYXllci1ib3gtd3JhcCcpLmFkZENsYXNzKCd0cmFuc2l0aW9uLTInKTtcbiAgICAgICAgalF1ZXJ5KCcucGxheWVyLWJveCcpLmFkZENsYXNzKCd0cmFuc2l0aW9uLTEnKTtcbiAgICAgICAgdmFyIGRlbGF5ID0gMDtcbiAgICAgICAgdmFyIGZvcmluQ291bnRlciA9IDA7XG4gICAgICAgIGZvciAodmFyIHBsYXllciBpbiByb3N0ZXJPYmouY2VsdGljcy5yb3N0ZXIpIHtcbiAgICAgICAgICAgIHZhciBoZWFkc2hvdCA9ICdodHRwczovL2FrLXN0YXRpYy5jbXMubmJhLmNvbS93cC1jb250ZW50L3VwbG9hZHMvaGVhZHNob3RzL25iYS9sYXRlc3QvMTA0MHg3NjAvJyArIHJvc3Rlck9iai5jZWx0aWNzLnJvc3RlcltwbGF5ZXJdLnBpZCArICcucG5nJztcbiAgICAgICAgICAgIGpRdWVyeSgnLnBsYXllci1ib3g6bnRoLWNoaWxkKCcgKyAoZm9yaW5Db3VudGVyICsgMSkgKyAnKScpLmFwcGVuZCgnPGltZyBjbGFzcz1cImFwcGVuZGVkIGhlYWRzaG90XCIgc3JjPVwiJyArIGhlYWRzaG90ICsgJ1wiLz4nKTtcbiAgICAgICAgICAgIGpRdWVyeSgnLnBsYXllci1ib3g6bnRoLWNoaWxkKCcgKyAoZm9yaW5Db3VudGVyICsgMSkgKyAnKScpLmF0dHIoJ2RhdGEtcGlkJywgcm9zdGVyT2JqLmNlbHRpY3Mucm9zdGVyW3BsYXllcl0ucGlkKTtcbiAgICAgICAgICAgIGpRdWVyeSgnLnBsYXllci1ib3ggaW1nJykub24oXCJlcnJvclwiLCBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgICAgICBqUXVlcnkodGhpcykuYXR0cignc3JjJywgJ2h0dHBzOi8vaS5jZG4udHVybmVyLmNvbS9uYmEvbmJhLy5lbGVtZW50L21lZGlhLzIuMC90ZWFtc2l0ZXMvY2VsdGljcy9tZWRpYS9nZW5lcmljLXBsYXllci1saWdodF82MDB4NDM4LnBuZycpO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICBqUXVlcnkoJy5wbGF5ZXItYm94Om50aC1jaGlsZCgnICsgKGZvcmluQ291bnRlciArIDEpICsgJykgaW1nJykuZGVsYXkoZGVsYXkpLmZhZGVUbygzMDAsIDEpO1xuICAgICAgICAgICAgZGVsYXkgKz0gMzA7XG4gICAgICAgICAgICBmb3JpbkNvdW50ZXIrKztcbiAgICAgICAgfVxuICAgIH0sIDMwMDApO1xuICAgIC8qIDUgLSBQTEFZRVIgU0VMRUNUICovXG4gICAgdmFyIHNlbGVjdGVkUGxheWVyID0gJyc7XG4gICAgc2V0VGltZW91dChmdW5jdGlvbigpIHtcbiAgICAgICAgalF1ZXJ5KCcucGxheWVyLWJveCcpLmFkZENsYXNzKCd0cmFuc2l0aW9uLTInKTtcbiAgICAgICAgalF1ZXJ5KCcucGxheWVyLWJveDpudGgtY2hpbGQoJyArIChwbGF5ZXJTcG90bGlnaHRDb3VudGVyKSArICcpJykuYWRkQ2xhc3MoJ3NlbGVjdGVkJyk7XG4gICAgICAgIHNlbGVjdGVkUGxheWVyID0galF1ZXJ5KCcucGxheWVyLWJveDpudGgtY2hpbGQoJyArIChwbGF5ZXJTcG90bGlnaHRDb3VudGVyKSArICcpJykuYXR0cignZGF0YS1waWQnKTtcbiAgICAgICAgY29uc29sZS5sb2coc2VsZWN0ZWRQbGF5ZXIpO1xuICAgICAgICBqUXVlcnkoJy5wbGF5ZXItYm94Jykubm90KCcucmVwbGFjZW1lbnQuc2VsZWN0ZWQnKS5kZWxheSg1MDApLmFkZENsYXNzKCd0cmFuc2l0aW9uLTQnKTtcbiAgICB9LCA0MDAwKTtcbiAgICAvKiA2IC0gUExBWUVSIEJPWCBFWFBBTkQgKi9cbiAgICBzZXRUaW1lb3V0KGZ1bmN0aW9uKCkge1xuICAgICAgICBqUXVlcnkoJy5ibG9jay13cmFwLnNvY2lhbCcpLmFkZENsYXNzKCd0cmFuc2l0aW9uLTMnKTtcbiAgICAgICAgalF1ZXJ5KCcucGxheWVyLWJveC5yZXBsYWNlbWVudC5zZWxlY3RlZCcpLmFkZENsYXNzKCd0cmFuc2l0aW9uLTMnKTtcbiAgICB9LCA1MDAwKTtcbiAgICAvKiA3IC0gU1BPVExJR0hUIEhUTUwgKi9cbiAgICBzZXRUaW1lb3V0KGZ1bmN0aW9uKCkge1xuICAgICAgICBnZW5lcmF0ZVRpbWVsaW5lKHNlbGVjdGVkUGxheWVyKTtcbiAgICAgICAgalF1ZXJ5KCcucGxheWVyLWJveC5yZXBsYWNlbWVudC5zZWxlY3RlZCcpLmNsb25lKCkuYXBwZW5kVG8oJy5ibG9jay13cmFwLnBsYXllci1zcG90bGlnaHQgLnRvcC13cmFwJyk7XG4gICAgICAgIGpRdWVyeSgnLnBsYXllci1zcG90bGlnaHQgLnNlbGVjdGVkJykuYWRkQ2xhc3MoJy5hcHBlbmRlZCcpO1xuICAgICAgICBqUXVlcnkoJy5ibG9jay13cmFwLnBsYXllci1zcG90bGlnaHQnKS5hZGRDbGFzcygndHJhbnNpdGlvbi0xJyk7XG4gICAgICAgIGpRdWVyeSgnLmJsb2NrLXdyYXAuc29jaWFsJykuYWRkQ2xhc3MoJ3RyYW5zaXRpb24tMScpO1xuICAgICAgICB2YXIgc3RhdHMgPSByb3N0ZXJPYmouY2VsdGljcy5yb3N0ZXJbc2VsZWN0ZWRQbGF5ZXJdLnN0YXRzO1xuICAgICAgICBqUXVlcnkoJy5wbGF5ZXItc3BvdGxpZ2h0IC50b3Atd3JhcCAucGxheWVyLXRvcCcpLmFwcGVuZCgnPGltZyBjbGFzcz1cInNpbG8gYXBwZW5kZWRcIiBzcmM9XCJodHRwOi8vaW8uY25uLm5ldC9uYmEvbmJhLy5lbGVtZW50L21lZGlhLzIuMC90ZWFtc2l0ZXMvY2VsdGljcy9tZWRpYS9zaWxvLTQ2Nng1OTEtJyArIHJvc3Rlck9iai5jZWx0aWNzLnJvc3RlcltzZWxlY3RlZFBsYXllcl0ucGlkICsgJy5wbmdcIiAvPjxkaXYgY2xhc3M9XCJ0b3AgYXBwZW5kZWRcIj48ZGl2IGNsYXNzPVwicGxheWVyLW5hbWUtd3JhcFwiPjxwIGNsYXNzPVwicGxheWVyLW5hbWVcIj48c3Bhbj4nICsgcm9zdGVyT2JqLmNlbHRpY3Mucm9zdGVyW3NlbGVjdGVkUGxheWVyXS5mbi50b1VwcGVyQ2FzZSgpICsgJzwvc3Bhbj4gPGJyPiAnICsgcm9zdGVyT2JqLmNlbHRpY3Mucm9zdGVyW3NlbGVjdGVkUGxheWVyXS5sbi50b1VwcGVyQ2FzZSgpICsgJzwvcD48L2Rpdj48cCBjbGFzcz1cInBsYXllci1udW1iZXJcIj4nICsgcm9zdGVyT2JqLmNlbHRpY3Mucm9zdGVyW3NlbGVjdGVkUGxheWVyXS5udW0gKyAnPC9icj48c3Bhbj4nICsgcm9zdGVyT2JqLmNlbHRpY3Mucm9zdGVyW3NlbGVjdGVkUGxheWVyXS5wb3MgKyAnPC9zcGFuPjwvcD48L2Rpdj48ZGl2IGNsYXNzPVwibWlkZGxlIGFwcGVuZGVkXCI+PHVsIGNsYXNzPVwiaW5mbyBjbGVhcmZpeFwiPjxsaT48cD5BR0U8c3BhbiBjbGFzcz1cInNtLWhpZGVcIj46Jm5ic3A7PC9zcGFuPiA8L2JyPjxzcGFuIGNsYXNzPVwiaW5mby12YWx1ZVwiPicgKyBwbGF5ZXJBZ2Uocm9zdGVyT2JqLmNlbHRpY3Mucm9zdGVyW3NlbGVjdGVkUGxheWVyXS5kb2IpICsgJzwvc3Bhbj48L3A+PC9saT48bGk+PHA+SFQ8c3BhbiBjbGFzcz1cInNtLWhpZGVcIj46Jm5ic3A7PC9zcGFuPiA8L2JyPjxzcGFuIGNsYXNzPVwiaW5mby12YWx1ZVwiPicgKyByb3N0ZXJPYmouY2VsdGljcy5yb3N0ZXJbc2VsZWN0ZWRQbGF5ZXJdLmh0ICsgJzwvc3Bhbj48L3A+PC9saT48bGk+PHA+V1Q8c3BhbiBjbGFzcz1cInNtLWhpZGVcIj46Jm5ic3A7PC9zcGFuPiA8L2JyPjxzcGFuIGNsYXNzPVwiaW5mby12YWx1ZVwiPicgKyByb3N0ZXJPYmouY2VsdGljcy5yb3N0ZXJbc2VsZWN0ZWRQbGF5ZXJdLnd0ICsgJzwvc3Bhbj48L3A+PC9saT48L3VsPjwvZGl2PjxkaXYgY2xhc3M9XCJib3R0b20gZnVsbCBjbGVhcmZpeCBzbS1oaWRlIGFwcGVuZGVkXCI+PHRhYmxlIGNsYXNzPVwiYXZlcmFnZXNcIj48dHIgY2xhc3M9XCJhdmVyYWdlcy1sYWJlbHNcIj48dGQ+PHA+R1A8L3A+PC90ZD48dGQ+PHA+UFBHPC9wPjwvdGQ+PHRkPjxwPlJQRzwvcD48L3RkPjx0ZD48cD5BUEc8L3A+PC90ZD48L3RyPjx0ciBjbGFzcz1cImF2ZXJhZ2VzLXNlYXNvblwiPjx0ZCBjbGFzcz1cImdwXCI+PHA+PC9wPjwvdGQ+PHRkIGNsYXNzPVwicHRzXCI+PHA+PC9wPjwvdGQ+PHRkIGNsYXNzPVwicmViXCI+PHA+PC9wPjwvdGQ+PHRkIGNsYXNzPVwiYXN0XCI+PHA+PC9wPjwvdGQ+PC90cj48L3RhYmxlPjwvZGl2PicpO1xuICAgICAgICBqUXVlcnkoXCIucGxheWVyLXNwb3RsaWdodCAuYXZlcmFnZXMtc2Vhc29uXCIpLmh0bWwoJzx0ZCBjbGFzcz1cImFwcGVuZGVkXCI+PHA+JyArIHN0YXRzLnNhWzBdLmdwICsgJzwvcD48L3RkPjx0ZCBjbGFzcz1cImFwcGVuZGVkXCI+PHA+JyArIHN0YXRzLnNhWzBdLnB0cyArICc8L3A+PC90ZD48dGQgY2xhc3M9XCJhcHBlbmRlZFwiPjxwPicgKyBzdGF0cy5zYVswXS5yZWIgKyAnPC9wPjwvdGQ+PHRkIGNsYXNzPVwiYXBwZW5kZWRcIj48cD4nICsgc3RhdHMuc2FbMF0uYXN0ICsgJzwvcD48L3RkPicpO1xuICAgICAgICBqUXVlcnkoJy5wbGF5ZXItc3BvdGxpZ2h0IC5wbGF5ZXItbmFtZScpLmZhZGVUbygyMDAsIDEpO1xuICAgICAgICB2YXIgcGxheWVyRmFjdHMgPSByb3N0ZXJPYmouY2VsdGljcy5yb3N0ZXJbc2VsZWN0ZWRQbGF5ZXJdLmJpby5wZXJzb25hbDtcbiAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCAzOyBpKyspIHtcbiAgICAgICAgICAgIHZhciBmYWN0SW5kZXggPSBNYXRoLmZsb29yKE1hdGgucmFuZG9tKCkgKiBwbGF5ZXJGYWN0cy5sZW5ndGgpO1xuICAgICAgICAgICAgalF1ZXJ5KCcucGxheWVyLXNwb3RsaWdodCAuYm90dG9tLXdyYXAnKS5hcHBlbmQoJzxkaXYgY2xhc3M9XCJkeWstYm94IGFwcGVuZGVkXCI+PHA+JyArIHBsYXllckZhY3RzW2ZhY3RJbmRleF0gKyAnPC9wPjwvZGl2PicpO1xuICAgICAgICB9O1xuICAgICAgICBqUXVlcnkoJy5wbGF5ZXItc3BvdGxpZ2h0IC5ib3R0b20td3JhcCcpLmFkZENsYXNzKCd0cmFuc2l0aW9uLTEnKTtcbiAgICAgICAgc2V0VGltZW91dChmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIGpRdWVyeSgnLnBsYXllci1zcG90bGlnaHQgLmJvdHRvbS13cmFwIC5keWstYm94Om50aC1vZi10eXBlKDIpJykuYWRkQ2xhc3MoJ3RyYW5zaXRpb24tMicpO1xuICAgICAgICAgICAgalF1ZXJ5KCcucGxheWVyLXNwb3RsaWdodCAuYm90dG9tLXdyYXAgLmR5ay1ib3g6bnRoLW9mLXR5cGUoMyknKS5hZGRDbGFzcygndHJhbnNpdGlvbi0xJyk7XG4gICAgICAgIH0sIDEwMDApO1xuICAgICAgICBzZXRUaW1lb3V0KGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgalF1ZXJ5KCcucGxheWVyLXNwb3RsaWdodCAuYm90dG9tLXdyYXAgLmR5ay1ib3g6bnRoLW9mLXR5cGUoMyknKS5hZGRDbGFzcygndHJhbnNpdGlvbi0yJyk7XG4gICAgICAgICAgICBqUXVlcnkoJy5wbGF5ZXItc3BvdGxpZ2h0IC5ib3R0b20td3JhcCAuZHlrLWJveDpudGgtb2YtdHlwZSg0KScpLmFkZENsYXNzKCd0cmFuc2l0aW9uLTEnKTtcbiAgICAgICAgfSwgMTUwMCk7XG4gICAgfSwgNjAwMCk7XG4gICAgLyogOCAtIFNQT1RMSUdIVCBTTElERSBJTiAqL1xuICAgIHNldFRpbWVvdXQoZnVuY3Rpb24oKSB7XG4gICAgICAgIGpRdWVyeSgnLnBsYXllci1zcG90bGlnaHQgLnBsYXllci10b3AgLnBsYXllci1uYW1lLCAucGxheWVyLXNwb3RsaWdodCAucGxheWVyLW5hbWUtd3JhcCwgLnBsYXllci1zcG90bGlnaHQgLmhlYWRzaG90LCAucGxheWVyLXNwb3RsaWdodCAuaW5mbywgLnBsYXllci1zcG90bGlnaHQgLnNpbG8sIC5wbGF5ZXItc3BvdGxpZ2h0IC5hdmVyYWdlcywgLnBsYXllci1zcG90bGlnaHQgLnBsYXllci1udW1iZXInKS5hZGRDbGFzcygndHJhbnNpdGlvbi0xJyk7XG4gICAgICAgIHNldFRpbWVvdXQoZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICBqUXVlcnkoJy5ibG9jay13cmFwLnBsYXllci1zcG90bGlnaHQgLnBsYXllci1ib3gnKS5yZW1vdmUoKTtcbiAgICAgICAgfSwgNDAwMCk7XG4gICAgICAgIGlmIChwbGF5ZXJTcG90bGlnaHRDb3VudGVyIDwgMTYpIHtcbiAgICAgICAgICAgIHBsYXllclNwb3RsaWdodENvdW50ZXIrKztcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHBsYXllclNwb3RsaWdodENvdW50ZXIgPSAwO1xuICAgICAgICB9XG4gICAgfSwgNzAwMCk7XG4gICAgLyogOSAtIFNQT1RMSUdIVCBTTElERSBPVVQgKi9cbiAgICBzZXRUaW1lb3V0KGZ1bmN0aW9uKCkge1xuICAgICAgICBqUXVlcnkoJy5wbGF5ZXItc3BvdGxpZ2h0IC5ib3R0b20td3JhcCwgLnBsYXllci1zcG90bGlnaHQgLnRvcC13cmFwJykuYWRkQ2xhc3MoJ3RyYW5zaXRpb24tMicpO1xuICAgIH0sIDgwMDApO1xuICAgIC8qIDEwIC0gRE9ORS4gUkVNT1ZFICovXG4gICAgc2V0VGltZW91dChmdW5jdGlvbigpIHtcbiAgICAgICAgalF1ZXJ5KCcgLnBsYXllci1zcG90bGlnaHQgLmFwcGVuZGVkJykucmVtb3ZlKCk7XG4gICAgICAgIGpRdWVyeSgnIC5wbGF5ZXItc3BvdGxpZ2h0IC5zZWxlY3RlZCcpLnJlbW92ZUNsYXNzKCdzZWxlY3RlZCcpO1xuICAgICAgICBmb3IgKHZhciBpID0gMTsgaSA8IDEwOyBpKyspe1xuICAgICAgICAgICAgalF1ZXJ5KCcucmlnaHQtd3JhcCAudHJhbnNpdGlvbi0nICsgaSkucmVtb3ZlQ2xhc3MoJ3RyYW5zaXRpb24tJyArIGkpO1xuICAgICAgICB9XG4gICAgfSwgOTAwMCk7XG59XG5cbmZ1bmN0aW9uIGxlYWRlcnMoZ2lkLCBnYW1lU3RhcnRlZCkge1xuICAgIGpRdWVyeSgnLmxlYWRlcnMnKS5hZGRDbGFzcygnYWN0aXZlJyk7XG4gICAgdmFyIGdhbWVEZXRhaWwgPSAnJztcbiAgICB2YXIgZGV0YWlsQXZhaWxhYmxlID0gZmFsc2U7XG4gICAgZ2FtZVN0YXJ0ZWQgPSB0cnVlOyAvLyBETzogREVMRVRFIFRISVMgV0hFTiBPTkxJTkUuIEpVU1QgRk9SIFRFU1RJTkcgUFVSUE9TRVMgUk5cbiAgICB2YXIgbGVhZGVyc1RpdGxlID0gJ1NFQVNPTiBMRUFERVJTJztcbiAgICBpZiAoZ2FtZVN0YXJ0ZWQpIHtcbiAgICAgICAgbGVhZGVyc1RpdGxlID0gJ0dBTUUgTEVBREVSUyc7XG4gICAgICAgIGpRdWVyeS5hamF4KHtcbiAgICAgICAgICAgICB1cmw6IGZlZWRzLmdhbWVkZXRhaWwoZ2lkKSxcbiAgICAgICAgICAgICBhc3luYzogZmFsc2UsXG4gICAgICAgICAgICAgc3VjY2VzczogZnVuY3Rpb24oZGF0YSkge1xuICAgICAgICAgICAgICAgICAvLyBETzogVVBEQVRFIFRIRSBMRUFERVIgT0JKRUNUU1xuICAgICAgICAgICAgICAgICB2YXIgdGVhbUxpbmVTY29yZSA9IFtcImhsc1wiLFwidmxzXCJdO1xuICAgICAgICAgICAgICAgICBmb3IgKHZhciB4ID0gMDsgeCA8IHRlYW1MaW5lU2NvcmUubGVuZ3RoOyB4Kyspe1xuICAgICAgICAgICAgICAgICAgICAgdmFyIHN0YXRzID0gZGF0YS5nW3RlYW1MaW5lU2NvcmVbeF1dO1xuICAgICAgICAgICAgICAgICAgICAgdmFyIHRlYW0gPSAnJztcbiAgICAgICAgICAgICAgICAgICAgIGlmIChzdGF0cy50YSA9PT0gJ0JPUycpe1xuICAgICAgICAgICAgICAgICAgICAgICAgIHRlYW0gPSAnY2VsdGljcyc7XG4gICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICB0ZWFtID0gJ2F3YXknO1xuICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgZm9yICh2YXIgc3RhdCBpbiByb3N0ZXJPYmpbdGVhbV0ubGVhZGVycykge1xuICAgICAgICAgICAgICAgICAgICAgICAgIHJvc3Rlck9ialt0ZWFtXS5sZWFkZXJzW3N0YXRdID0gW1snLS0nLCAnLS0nLCAnLS0nLCAnLS0nXSxbJy0tJywgJy0tJywgJy0tJywgJy0tJ10sWyctLScsICctLScsICctLScsICctLSddXTtcbiAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgIGZvciAodmFyIHAgPSAwOyBwIDwgc3RhdHMucHN0c2cubGVuZ3RoOyBwKyspIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICBmb3IgKHZhciBzdGF0IGluIHJvc3Rlck9ialt0ZWFtXS5sZWFkZXJzKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgMzsgaSsrKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAocm9zdGVyT2JqW3RlYW1dLmxlYWRlcnNbc3RhdF1baV1bMl0gPT0gJy0tJyAmJiBzdGF0cy5wc3RzZ1twXVtzdGF0XSA+IDApIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICByb3N0ZXJPYmpbdGVhbV0ubGVhZGVyc1tzdGF0XVtpXVswXSA9IHN0YXRzLnBzdHNnW3BdLmZuLnRvVXBwZXJDYXNlKCk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcm9zdGVyT2JqW3RlYW1dLmxlYWRlcnNbc3RhdF1baV1bMV0gPSBzdGF0cy5wc3RzZ1twXS5sbi50b1VwcGVyQ2FzZSgpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJvc3Rlck9ialt0ZWFtXS5sZWFkZXJzW3N0YXRdW2ldWzJdID0gc3RhdHMucHN0c2dbcF1bc3RhdF07XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcm9zdGVyT2JqW3RlYW1dLmxlYWRlcnNbc3RhdF1baV1bM10gPSBzdGF0cy5wc3RzZ1twXS5waWQ7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAoc3RhdHMucHN0c2dbcF1bc3RhdF0gPiByb3N0ZXJPYmpbdGVhbV0ubGVhZGVyc1tzdGF0XVtpXVsyXSAmJiBzdGF0cy5wc3RzZ1twXVtzdGF0XSA+IDApIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICByb3N0ZXJPYmpbdGVhbV0ubGVhZGVyc1tzdGF0XVtpXVswXSA9IHN0YXRzLnBzdHNnW3BdLmZuLnRvVXBwZXJDYXNlKCk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcm9zdGVyT2JqW3RlYW1dLmxlYWRlcnNbc3RhdF1baV1bMV0gPSBzdGF0cy5wc3RzZ1twXS5sbi50b1VwcGVyQ2FzZSgpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJvc3Rlck9ialt0ZWFtXS5sZWFkZXJzW3N0YXRdW2ldWzJdID0gc3RhdHMucHN0c2dbcF1bc3RhdF07XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcm9zdGVyT2JqW3RlYW1dLmxlYWRlcnNbc3RhdF1baV1bM10gPSBzdGF0cy5wc3RzZ1twXS5waWQ7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgIH07XG4gICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKHJvc3Rlck9iaik7XG4gICAgICAgICAgICAgfVxuICAgICAgICAgfSk7XG4gICAgfVxuICAgIGpRdWVyeSgnLmxlYWRlcnMtdGl0bGUnKS5odG1sKGxlYWRlcnNUaXRsZSk7XG4gICAgZm9yICh2YXIgdGVhbSBpbiByb3N0ZXJPYmopIHtcbiAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCAzOyBpKyspIHtcbiAgICAgICAgICAgIGZvciAodmFyIHN0YXQgaW4gcm9zdGVyT2JqW3RlYW1dLmxlYWRlcnMpIHtcbiAgICAgICAgICAgICAgICAvLyBMRUFERVIgU1RBVCBWQUxVRVxuICAgICAgICAgICAgICAgIGpRdWVyeSgnLmxlYWRlci1zZWN0aW9uOm50aC1vZi10eXBlKCcgKyAoaSArIDIpICsgJykgLicgKyBzdGF0ICsgJy4nICsgdGVhbSArICcgLnN0YXQnKS5odG1sKCc8c3BhbiBjbGFzcz1cImFwcGVuZGVkICcgKyByb3N0ZXJPYmpbdGVhbV0udGEgKyAnXCI+JyArIHJvc3Rlck9ialt0ZWFtXS5sZWFkZXJzW3N0YXRdW2ldWzJdICsgJzwvc3Bhbj4gJyArIHN0YXQudG9VcHBlckNhc2UoKSk7XG4gICAgICAgICAgICAgICAgLy8gTEVBREVSIE5BTUVcbiAgICAgICAgICAgICAgICBpZiAocm9zdGVyT2JqW3RlYW1dLmxlYWRlcnNbc3RhdF1baV1bMF0ubGVuZ3RoICsgcm9zdGVyT2JqW3RlYW1dLmxlYWRlcnNbc3RhdF1baV1bMV0ubGVuZ3RoID49IDE1KSB7XG4gICAgICAgICAgICAgICAgICAgIHJvc3Rlck9ialt0ZWFtXS5sZWFkZXJzW3N0YXRdW2ldWzBdID0gcm9zdGVyT2JqW3RlYW1dLmxlYWRlcnNbc3RhdF1baV1bMF0uc3Vic3RyKDAsIDEpICsgJy4nO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBqUXVlcnkoJy5sZWFkZXItc2VjdGlvbjpudGgtb2YtdHlwZSgnICsgKGkgKyAyKSArICcpIC4nICsgc3RhdCArICcuJyArIHRlYW0gKyAnIC5uYW1lJykuaHRtbCgnPHNwYW4gY2xhc3M9XCJhcHBlbmRlZFwiPicgKyByb3N0ZXJPYmpbdGVhbV0ubGVhZGVyc1tzdGF0XVtpXVswXSArICc8L3NwYW4+ICcgKyByb3N0ZXJPYmpbdGVhbV0ubGVhZGVyc1tzdGF0XVtpXVsxXSk7XG4gICAgICAgICAgICAgICAgLy8gTEVBREVSIEhFQURTSE9UXG4gICAgICAgICAgICAgICAgalF1ZXJ5KCcubGVhZGVyLXNlY3Rpb246bnRoLW9mLXR5cGUoJyArIChpICsgMikgKyAnKSAuJyArIHN0YXQgKyAnLicgKyB0ZWFtICsgJyAuaGVhZHNob3QnKS5hdHRyKCdzcmMnLCAnaHR0cHM6Ly9hay1zdGF0aWMuY21zLm5iYS5jb20vd3AtY29udGVudC91cGxvYWRzL2hlYWRzaG90cy9uYmEvbGF0ZXN0LzEwNDB4NzYwLycgKyByb3N0ZXJPYmpbdGVhbV0ubGVhZGVyc1tzdGF0XVtpXVszXSArICcucG5nJyk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9XG4gICAgc2V0VGltZW91dChmdW5jdGlvbigpIHtcbiAgICAgICAgalF1ZXJ5KCcubGVhZGVycywgLmxlYWRlcnMgLmJsb2NrLWlubmVyJykuYWRkQ2xhc3MoJ3RyYW5zaXRpb24tMScpO1xuICAgIH0sIDEwMCk7XG4gICAgc2V0VGltZW91dChmdW5jdGlvbigpIHtcbiAgICAgICAgalF1ZXJ5KCcubGVhZGVycyAubGVhZGVyLXNlY3Rpb24nKS5hZGRDbGFzcygndHJhbnNpdGlvbi0xJyk7XG4gICAgICAgIGpRdWVyeSgnLmxlYWRlci1zdWJzZWN0aW9uLmJvdHRvbSBwOm50aC1vZi10eXBlKDEpJykuYWRkQ2xhc3MoJ3RyYW5zaXRpb24tMScpO1xuICAgICAgICBqUXVlcnkoJy5sZWFkZXJzIC5sZWFkZXItc2VjdGlvbiAudW5kZXJsaW5lLCAubGVhZGVycyAubGVhZGVyLXN1YnNlY3Rpb24udG9wJykuYWRkQ2xhc3Mocm9zdGVyT2JqLmNlbHRpY3MudGEgKyAnLWJnJyk7XG4gICAgfSwgMTEwMCk7XG4gICAgc2V0VGltZW91dChmdW5jdGlvbigpIHtcbiAgICAgICAgalF1ZXJ5KCcubGVhZGVycyAubGVhZGVyLXNlY3Rpb24nKS5hZGRDbGFzcygndHJhbnNpdGlvbi0yJyk7XG4gICAgICAgIGpRdWVyeSgnLmxlYWRlcnMgLmJsb2NrLWlubmVyJykuYWRkQ2xhc3MoJ3RyYW5zaXRpb24tMicpO1xuICAgIH0sIDIxMDApO1xuICAgIHZhciB0cmFuc2l0aW9uQ291bnRlciA9IDE7XG4gICAgc2V0VGltZW91dChmdW5jdGlvbigpe1xuICAgICAgICBmb3IgKGxldCBpID0gMTsgaSA8IDY7IGkrKykge1xuICAgICAgICAgICAgc2V0VGltZW91dChmdW5jdGlvbihudW1iZXJTdHJpbmcpIHtcbiAgICAgICAgICAgICAgICBqUXVlcnkoJy5sZWFkZXJzIC5sZWFkZXItc2VjdGlvbiAubGVhZGVyLXN0YXQtd3JhcCcpLmFkZENsYXNzKCd0cmFuc2l0aW9uLScgKyBpKTtcbiAgICAgICAgICAgICAgICBqUXVlcnkoJy5sZWFkZXJzIC5sZWFkZXItc2VjdGlvbiAudW5kZXJsaW5lLCAubGVhZGVycyAubGVhZGVyLXN1YnNlY3Rpb24udG9wJykucmVtb3ZlQ2xhc3Mocm9zdGVyT2JqLmNlbHRpY3MudGEgKyAnLWJnJyk7XG4gICAgICAgICAgICAgICAgalF1ZXJ5KCcubGVhZGVycyAubGVhZGVyLXNlY3Rpb24gLnVuZGVybGluZSwgLmxlYWRlcnMgLmxlYWRlci1zdWJzZWN0aW9uLnRvcCcpLmFkZENsYXNzKHJvc3Rlck9iai5hd2F5LnRhICsgJy1iZycpO1xuICAgICAgICAgICAgICAgIGlmICh0cmFuc2l0aW9uQ291bnRlciAlIDIgPT0gMCkge1xuICAgICAgICAgICAgICAgICAgICBzZXRUaW1lb3V0KGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgalF1ZXJ5KCcubGVhZGVycyAubGVhZGVyLXNlY3Rpb24gLnVuZGVybGluZSwgLmxlYWRlcnMgLmxlYWRlci1zdWJzZWN0aW9uLnRvcCcpLnJlbW92ZUNsYXNzKHJvc3Rlck9iai5hd2F5LnRhICsgJy1iZycpO1xuICAgICAgICAgICAgICAgICAgICAgICAgalF1ZXJ5KCcubGVhZGVycyAubGVhZGVyLXNlY3Rpb24gLnVuZGVybGluZSwgLmxlYWRlcnMgLmxlYWRlci1zdWJzZWN0aW9uLnRvcCcpLmFkZENsYXNzKHJvc3Rlck9iai5jZWx0aWNzLnRhICsgJy1iZycpO1xuICAgICAgICAgICAgICAgICAgICAgICAgalF1ZXJ5KCcubGVhZGVyLXN1YnNlY3Rpb24uYm90dG9tIHAnKS5yZW1vdmVDbGFzcygndHJhbnNpdGlvbi0xJyk7XG4gICAgICAgICAgICAgICAgICAgICAgICBqUXVlcnkoJy5sZWFkZXJzIC5sZWFkZXItc2VjdGlvbiAudW5kZXJsaW5lJykuYWRkQ2xhc3MoJ3RyYW5zaXRpb24tJyArIChpIC8gMikpO1xuICAgICAgICAgICAgICAgICAgICAgICAgalF1ZXJ5KCcubGVhZGVyLXN1YnNlY3Rpb24uYm90dG9tIHA6bnRoLW9mLXR5cGUoJyArIChpIC0gKGkgLyAyKSArIDEpICsgJyknKS5hZGRDbGFzcygndHJhbnNpdGlvbi0xJyk7IC8vIGxvbFxuICAgICAgICAgICAgICAgICAgICB9LCAyMDApO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB0cmFuc2l0aW9uQ291bnRlcisrO1xuICAgICAgICAgICAgfSwgNzAwMCAqIGkpO1xuICAgICAgICB9XG4gICAgfSwyMTAwKTtcbiAgICBzZXRUaW1lb3V0KGZ1bmN0aW9uKCkge1xuICAgICAgICBqUXVlcnkoJy5sZWFkZXJzIC5sZWFkZXItc2VjdGlvbiwgLmxlYWRlcnMgLmxlYWRlci1zdWJzZWN0aW9uJykuYWRkQ2xhc3MoJ3RyYW5zaXRpb24tMycpO1xuICAgIH0sIDQ0MTAwKTtcbiAgICBzZXRUaW1lb3V0KGZ1bmN0aW9uKCkge1xuICAgICAgICBqUXVlcnkoJy5sZWFkZXJzJykuYWRkQ2xhc3MoJ3RyYW5zaXRpb24tMicpO1xuICAgIH0sIDQ0MTAwKTtcbiAgICBzZXRUaW1lb3V0KGZ1bmN0aW9uKCkge1xuICAgICAgICBqUXVlcnkoJy5sZWFkZXJzIC5sZWFkZXItc2VjdGlvbiAudW5kZXJsaW5lLCAubGVhZGVycyAubGVhZGVyLXN1YnNlY3Rpb24udG9wJykucmVtb3ZlQ2xhc3Mocm9zdGVyT2JqLmF3YXkudGEgKyAnLWJnJyk7XG4gICAgICAgIGpRdWVyeSgnLmxlYWRlcnMgLmxlYWRlci1zZWN0aW9uIC51bmRlcmxpbmUsIC5sZWFkZXJzIC5sZWFkZXItc3Vic2VjdGlvbi50b3AnKS5hZGRDbGFzcyhyb3N0ZXJPYmouY2VsdGljcy50YSArICctYmcnKTtcbiAgICAgICAgalF1ZXJ5KCcubGVhZGVycycpLnJlbW92ZUNsYXNzKCdhY3RpdmUnKTtcbiAgICAgICAgalF1ZXJ5KCcubGVhZGVycyAuYXBwZW5kZWQnKS5yZW1vdmUoKTtcbiAgICAgICAgZm9yICh2YXIgaSA9IDE7IGkgPCAxMDsgaSsrKXtcbiAgICAgICAgICAgIGpRdWVyeSgnLmxlYWRlcnMgLnRyYW5zaXRpb24tJyArIGkgKyAnLCAubGVhZGVycy50cmFuc2l0aW9uLScgKyBpKS5yZW1vdmVDbGFzcygndHJhbnNpdGlvbi0nICsgaSk7XG4gICAgICAgIH1cbiAgICB9LCA0NTAwMCk7XG59O1xuXG5mdW5jdGlvbiBzb2NpYWwoKSB7XG4gICAgalF1ZXJ5KCcuc29jaWFsIC50ZXh0LXdyYXAsIC5zb2NpYWwgLnVuZGVybGluZScpLnJlbW92ZUNsYXNzKCd0cmFuc2l0aW9uLTEnKTtcbiAgICBqUXVlcnkoJy5zb2NpYWwnKS5hZGRDbGFzcygnYWN0aXZlJyk7XG4gICAgc2V0VGltZW91dChmdW5jdGlvbigpe1xuICAgICAgICBqUXVlcnkoJy5zb2NpYWwgLnRleHQtd3JhcCwgLnNvY2lhbCAudW5kZXJsaW5lJykuYWRkQ2xhc3MoJ3RyYW5zaXRpb24tMScpO1xuICAgIH0sIDEwMDAwKTtcbiAgIHNldFRpbWVvdXQoZnVuY3Rpb24oKXtcbiAgICAgICAgalF1ZXJ5KCcuc29jaWFsIC5hcHBlbmRlZCcpLnJlbW92ZSgpO1xuICAgICAgICBqUXVlcnkoJy5zb2NpYWwgLnNlbGVjdGVkJykucmVtb3ZlQ2xhc3MoJ3NlbGVjdGVkJyk7XG4gICAgICAgIGpRdWVyeSgnLnNvY2lhbCcpLnJlbW92ZUNsYXNzKCdhY3RpdmUnKTtcbiAgICB9LCAxNTAwMCk7XG59O1xuXG4vKmZ1bmN0aW9uIG1vYmlsZUFwcEluaXQoKSB7XG4gICAgdmFyIGNvdW50ZXIgPSAxO1xuICAgIHNldEludGVydmFsKGZ1bmN0aW9uKCkge1xuICAgICAgICBqUXVlcnkoJy5hcHAgLmJvdHRvbS13cmFwIGltZycpLnJlbW92ZUNsYXNzKCdhY3RpdmUnKTtcbiAgICAgICAgalF1ZXJ5KCcuYXBwIC5mZWF0dXJlLWxpc3QgcCcpLnJlbW92ZUNsYXNzKCdhY3RpdmUnKTtcbiAgICAgICAgalF1ZXJ5KCcuYXBwIC5mZWF0dXJlLWxpc3QgcDpudGgtb2YtdHlwZSgnICsgY291bnRlciArICcpJykuYWRkQ2xhc3MoJ2FjdGl2ZScpO1xuICAgICAgICBqUXVlcnkoJy5hcHAgLmJvdHRvbS13cmFwIGltZzpudGgtb2YtdHlwZSgnICsgY291bnRlciArICcpJykuYWRkQ2xhc3MoJ2FjdGl2ZScpO1xuICAgICAgICBpZiAoY291bnRlciA9PSA1KSB7XG4gICAgICAgICAgICBjb3VudGVyID0gMTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGNvdW50ZXIrKztcbiAgICAgICAgfVxuICAgIH0sIDIwMDApO1xufTtcbiovXG5mdW5jdGlvbiBtb2JpbGVBcHAoKSB7XG4gICAgalF1ZXJ5KCcuYXBwIC5ibG9jay1pbm5lcicpLnJlbW92ZUNsYXNzKCd0cmFuc2l0aW9uLTEnKTtcbiAgICBqUXVlcnkoJy5hcHAnKS5hZGRDbGFzcygnYWN0aXZlJyk7XG4gICAgdmFyIGNvdW50ZXIgPSAxO1xuICAgIHZhciByb3RhdGVTY3JlZW5zID0gc2V0SW50ZXJ2YWwoZnVuY3Rpb24oKSB7XG4gICAgICAgIGpRdWVyeSgnLmFwcCAuYm90dG9tLXdyYXAgaW1nJykucmVtb3ZlQ2xhc3MoJ2FjdGl2ZScpO1xuICAgICAgICBqUXVlcnkoJy5hcHAgLmZlYXR1cmUtbGlzdCBwJykucmVtb3ZlQ2xhc3MoJ2FjdGl2ZScpO1xuICAgICAgICBqUXVlcnkoJy5hcHAgLmZlYXR1cmUtbGlzdCBwOm50aC1vZi10eXBlKCcgKyBjb3VudGVyICsgJyknKS5hZGRDbGFzcygnYWN0aXZlJyk7XG4gICAgICAgIGpRdWVyeSgnLmFwcCAuYm90dG9tLXdyYXAgaW1nOm50aC1vZi10eXBlKCcgKyBjb3VudGVyICsgJyknKS5hZGRDbGFzcygnYWN0aXZlJyk7XG4gICAgICAgIGlmIChjb3VudGVyID09IDUpIHtcbiAgICAgICAgICAgIGNvdW50ZXIgPSAxO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgY291bnRlcisrO1xuICAgICAgICB9XG4gICAgfSwgNDAwMCk7XG4gICAgcm90YXRlU2NyZWVucztcbiAgICBzZXRUaW1lb3V0KGZ1bmN0aW9uKCl7XG4gICAgICAgIGpRdWVyeSgnLmFwcCAuYmxvY2staW5uZXInKS5hZGRDbGFzcygndHJhbnNpdGlvbi0xJyk7XG4gICAgfSwgMjQwMDApO1xuICAgIHNldFRpbWVvdXQoZnVuY3Rpb24oKXtcbiAgICAgICAgalF1ZXJ5KCcuYXBwJykucmVtb3ZlQ2xhc3MoJ2FjdGl2ZScpO1xuICAgICAgICBjbGVhckludGVydmFsKHJvdGF0ZVNjcmVlbnMpO1xuICAgIH0sIDI1MDAwKTtcbn07XG4vKj09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuPSAgICAgICAgICAgIExFRlQgV1JBUCAgICAgICAgICAgID1cbj09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PSovXG5cbmZ1bmN0aW9uIGxlZnRXcmFwKCkge1xuICAgIHNldEludGVydmFsKGZ1bmN0aW9uKCl7XG4gICAgICAgIGlmIChqUXVlcnkoJy5sZWZ0LXdyYXAgLnN0YW5kaW5ncycpLmhhc0NsYXNzKCd0cmFuc2l0aW9uLTEnKSl7XG4gICAgICAgICAgICBqUXVlcnkoJy5sZWZ0LXdyYXAgLnN0YW5kaW5ncycpLnJlbW92ZUNsYXNzKCd0cmFuc2l0aW9uLTEnKTtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgIGpRdWVyeSgnLmxlZnQtd3JhcCAuc3RhbmRpbmdzJykuYWRkQ2xhc3MoJ3RyYW5zaXRpb24tMScpO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKGpRdWVyeSgnLmxlZnQtd3JhcCAuc2NvcmVzLWFuZC1sZWFkZXJzJykuaGFzQ2xhc3MoJ3RyYW5zaXRpb24tMScpKXtcbiAgICAgICAgICAgIGpRdWVyeSgnLmxlZnQtd3JhcCAuc2NvcmVzLWFuZC1sZWFkZXJzJykucmVtb3ZlQ2xhc3MoJ3RyYW5zaXRpb24tMScpO1xuICAgICAgICB9XG4gICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgalF1ZXJ5KCcubGVmdC13cmFwIC5zY29yZXMtYW5kLWxlYWRlcnMnKS5hZGRDbGFzcygndHJhbnNpdGlvbi0xJyk7XG4gICAgICAgIH1cbiAgICB9LCA0NTAwMCk7XG59XG5cblxuZnVuY3Rpb24gc3RhbmRpbmdzSW5pdChhd2F5VGVhbSkge1xuICAgIGpRdWVyeS5hamF4KHtcbiAgICAgICAgdXJsOiBmZWVkcy5zdGFuZGluZ3MsXG4gICAgICAgIGFzeW5jOiBmYWxzZSxcbiAgICAgICAgc3VjY2VzczogZnVuY3Rpb24oc3RhbmRpbmdzRGF0YSkge1xuICAgICAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBzdGFuZGluZ3NEYXRhLnN0YS5jby5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgICAgIGZvciAobGV0IHggPSAwOyB4IDwgc3RhbmRpbmdzRGF0YS5zdGEuY29baV0uZGkubGVuZ3RoOyB4KyspIHtcbiAgICAgICAgICAgICAgICAgICAgZm9yIChsZXQgdCA9IDA7IHQgPCBzdGFuZGluZ3NEYXRhLnN0YS5jb1tpXS5kaVt4XS50Lmxlbmd0aDsgdCsrKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICB2YXIgY29uZmVyZW5jZXMgPSBbJy5lYXN0JywgJy53ZXN0J107XG4gICAgICAgICAgICAgICAgICAgICAgICB2YXIgcGxhY2UgPSBzdGFuZGluZ3NEYXRhLnN0YS5jb1tpXS5kaVt4XS50W3RdLnNlZTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHZhciBzZWVkID0gJyc7XG4gICAgICAgICAgICAgICAgICAgICAgICB2YXIgYWN0aXZlU3RhdHVzID0gJyc7XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoc3RhbmRpbmdzRGF0YS5zdGEuY29baV0uZGlbeF0udFt0XS5zZWUgPD0gOCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHNlZWQgPSBzdGFuZGluZ3NEYXRhLnN0YS5jb1tpXS5kaVt4XS50W3RdLnNlZTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChzdGFuZGluZ3NEYXRhLnN0YS5jb1tpXS5kaVt4XS50W3RdLnRhID09ICdCT1MnKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgYWN0aXZlU3RhdHVzID0gJ2FjdGl2ZSc7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoc3RhbmRpbmdzRGF0YS5zdGEuY29baV0uZGlbeF0udFt0XS50YSA9PSBhd2F5VGVhbSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGFjdGl2ZVN0YXR1cyA9ICdhY3RpdmUtYXdheSc7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICB2YXIgcm93SFRNTCA9ICc8ZGl2IGNsYXNzPVwicGxhY2VcIj4nICsgc2VlZCArICc8L2Rpdj48ZGl2IGNsYXNzPVwibG9nby13cmFwXCI+PGltZyBjbGFzcz1cImxvZ29cIiBzcmM9aHR0cDovL2kuY2RuLnR1cm5lci5jb20vbmJhL25iYS9hc3NldHMvbG9nb3MvdGVhbXMvcHJpbWFyeS93ZWIvJyArIHN0YW5kaW5nc0RhdGEuc3RhLmNvW2ldLmRpW3hdLnRbdF0udGEgKyAnLnN2Zz48L2Rpdj48ZGl2IGNsYXNzPVwidGVhbSArICcgKyBzdGFuZGluZ3NEYXRhLnN0YS5jb1tpXS5kaVt4XS50W3RdLnRhICsgJ1wiPicgKyBzdGFuZGluZ3NEYXRhLnN0YS5jb1tpXS5kaVt4XS50W3RdLnRhICsgJzwvZGl2PjxkaXYgY2xhc3M9XCJ3aW5zXCI+JyArIHN0YW5kaW5nc0RhdGEuc3RhLmNvW2ldLmRpW3hdLnRbdF0udyArICc8L2Rpdj48ZGl2IGNsYXNzPVwibG9zc2VzXCI+JyArIHN0YW5kaW5nc0RhdGEuc3RhLmNvW2ldLmRpW3hdLnRbdF0ubCArICc8L2Rpdj48ZGl2IGNsYXNzPVwiZ2FtZXMtYmVoaW5kXCI+JyArIHN0YW5kaW5nc0RhdGEuc3RhLmNvW2ldLmRpW3hdLnRbdF0uZ2IgKyAnPC9kaXY+JztcbiAgICAgICAgICAgICAgICAgICAgICAgIGpRdWVyeShjb25mZXJlbmNlc1tpXSArICcgPiBkaXY6bnRoLWNoaWxkKCcgKyAocGxhY2UgKyAxKSArICcpJykuaHRtbChyb3dIVE1MKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGpRdWVyeShjb25mZXJlbmNlc1tpXSArICcgPiBkaXY6bnRoLWNoaWxkKCcgKyAocGxhY2UgKyAxKSArICcpJykuYWRkQ2xhc3MoYWN0aXZlU3RhdHVzKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH0pO1xufTtcblxuZnVuY3Rpb24gc2NvcmVzSW5pdCh0b2RheXNTY29yZXNEYXRhKSB7XG4gICAgdmFyIGxpdmVTY29yZXMgPSB0b2RheXNTY29yZXNEYXRhLmdzLmc7XG4gICAgaWYgKGxpdmVTY29yZXMubGVuZ3RoICE9IDApIHtcbiAgICAgICAgdmFyIHNlYXNvblR5cGUgPSAnJztcbiAgICAgICAgaWYgKGxpdmVTY29yZXNbMF0uZ2lkLnN1YnN0cigwLCAzKSA9PSAnMDAxJykge1xuICAgICAgICAgICAgc2Vhc29uVHlwZSA9ICdwcmUnO1xuICAgICAgICB9IGVsc2UgaWYgKGxpdmVTY29yZXNbMF0uZ2lkLnN1YnN0cigwLCAzKSA9PSAnMDA0Jykge1xuICAgICAgICAgICAgc2Vhc29uVHlwZSA9ICdwb3N0JztcbiAgICAgICAgfVxuICAgICAgICBpZiAobGl2ZVNjb3Jlcy5sZW5ndGggPiAxIHx8IChsaXZlU2NvcmVzLmxlbmd0aCA9PSAxICYmIGxpdmVTY29yZXNbMF0uaC50YSAhPSAnQk9TJykpIHtcbiAgICAgICAgICAgIHZhciBzdGF0dXNDb2RlcyA9IFsnMXN0IFF0cicsICcybmQgUXRyJywgJzNyZCBRdHInLCAnNHRoIFF0cicsICcxc3QgT1QnLCAnMm5kIE9UJywgJzNyZCBPVCcsICc0dGggT1QnLCAnNXRoIE9UJywgJzZ0aCBPVCcsICc3dGggT1QnLCAnOHRoIE9UJywgJzl0aCBPVCcsICcxMHRoIE9UJ107XG4gICAgICAgICAgICB2YXIgc2NvcmVzSFRNTCA9ICcnO1xuICAgICAgICAgICAgdmFyIGFkZGVkID0gMDtcbiAgICAgICAgICAgIGZvciAodmFyIGkgPSBsaXZlU2NvcmVzLmxlbmd0aCAtIDE7IGkgPj0gMDsgaS0tKSB7XG4gICAgICAgICAgICAgICAgaWYgKGxpdmVTY29yZXNbaV0uaC50YSAhPT0gJ0JPUycgJiYgaSA8IDExKSB7XG4gICAgICAgICAgICAgICAgICAgIGFkZGVkKys7XG4gICAgICAgICAgICAgICAgICAgIHZhciB2U2NvcmUgPSAnJztcbiAgICAgICAgICAgICAgICAgICAgdmFyIGhTY29yZSA9ICcnO1xuICAgICAgICAgICAgICAgICAgICB2YXIgdlJlc3VsdCA9ICcnO1xuICAgICAgICAgICAgICAgICAgICB2YXIgaFJlc3VsdCA9ICcnO1xuICAgICAgICAgICAgICAgICAgICBpZiAobGl2ZVNjb3Jlc1tpXS5zdCAhPSAxKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICB2U2NvcmUgPSBsaXZlU2NvcmVzW2ldLnYucztcbiAgICAgICAgICAgICAgICAgICAgICAgIGhTY29yZSA9IGxpdmVTY29yZXNbaV0uaC5zO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIHZhciBzVGV4dCA9IGxpdmVTY29yZXNbaV0uc3R0O1xuICAgICAgICAgICAgICAgICAgICBpZiAoc3RhdHVzQ29kZXMuaW5kZXhPZihsaXZlU2NvcmVzW2ldLnN0dCkgIT09IC0xKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBzVGV4dCA9IGxpdmVTY29yZXNbaV0uc3R0ICsgJyAtICcgKyBsaXZlU2NvcmVzW2ldLmNsO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIGlmIChsaXZlU2NvcmVzW2ldLnN0ID09IDMgJiYgdlNjb3JlIDwgaFNjb3JlKXtcbiAgICAgICAgICAgICAgICAgICAgICAgIHZSZXN1bHQgPSAnbG9zZXInO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIGVsc2UgaWYgKGxpdmVTY29yZXNbaV0uc3QgPT0gMyAmJiBoU2NvcmUgPCB2U2NvcmUpe1xuICAgICAgICAgICAgICAgICAgICAgICAgaFJlc3VsdCA9ICdsb3Nlcic7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgc2NvcmVzSFRNTCArPSAnPGRpdiBjbGFzcz1cInNjb3JlLXdyYXBcIj48ZGl2IGNsYXNzPVwic2NvcmUtc3RhdHVzXCI+JyArIHNUZXh0ICsgJzwvZGl2PjxkaXYgY2xhc3M9XCInICsgbGl2ZVNjb3Jlc1tpXS52LnRhICsgJ1wiPjxpbWcgc3JjPVwiaHR0cDovL3N0YXRzLm5iYS5jb20vbWVkaWEvaW1nL3RlYW1zL2xvZ29zLycgKyBsaXZlU2NvcmVzW2ldLnYudGEudG9VcHBlckNhc2UoKSArICdfbG9nby5zdmdcIj4gJyArIGxpdmVTY29yZXNbaV0udi50Yy50b1VwcGVyQ2FzZSgpICsgJyAnICsgbGl2ZVNjb3Jlc1tpXS52LnRuLnRvVXBwZXJDYXNlKCkgKyAnIDxkaXYgY2xhc3M9XCJzY29yZS1udW0gJyArIHZSZXN1bHQgKyAnXCI+JyArIHZTY29yZSArICc8L2Rpdj48L2Rpdj48ZGl2IGNsYXNzPVwiJyArIGxpdmVTY29yZXNbaV0uaC50YSArICdcIj48aW1nIHNyYz1cImh0dHA6Ly9zdGF0cy5uYmEuY29tL21lZGlhL2ltZy90ZWFtcy9sb2dvcy8nICsgbGl2ZVNjb3Jlc1tpXS5oLnRhLnRvVXBwZXJDYXNlKCkgKyAnX2xvZ28uc3ZnXCI+ICcgKyBsaXZlU2NvcmVzW2ldLmgudGMudG9VcHBlckNhc2UoKSArICcgJyArIGxpdmVTY29yZXNbaV0uaC50bi50b1VwcGVyQ2FzZSgpICsgJyA8ZGl2IGNsYXNzPVwic2NvcmUtbnVtICcgKyBoUmVzdWx0ICsgJ1wiPicgKyBoU2NvcmUgKyAnPC9kaXY+PC9kaXY+PC9kaXY+JztcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBqUXVlcnkoJy5zY29yZXMnKS5lbXB0eSgpLmFwcGVuZChzY29yZXNIVE1MKTtcbiAgICAgICAgfVxuICAgICAgICBpZiAoYWRkZWQgPCA1KXtcbiAgICAgICAgICAgIGpRdWVyeSgnLmxlYWd1ZS1sZWFkZXJzJykuc2hvdygpO1xuICAgICAgICB9XG4gICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgalF1ZXJ5KCcubGVhZ3VlLWxlYWRlcnMnKS5oaWRlKCk7XG4gICAgICAgIH1cbiAgICB9XG59XG5cbmZ1bmN0aW9uIHVwZGF0ZUxlYWd1ZVNjb3Jlcyh0b2RheXNTY29yZXNEYXRhKSB7XG4gICAgdmFyIGxpdmVTY29yZXMgPSB0b2RheXNTY29yZXNEYXRhLmdzLmc7XG4gICAgaWYgKGxpdmVTY29yZXMubGVuZ3RoICE9IDApIHtcbiAgICAgICAgdmFyIHNlYXNvblR5cGUgPSAnUmVndWxhcitTZWFzb24nO1xuICAgICAgICBpZiAobGl2ZVNjb3Jlc1swXS5naWQuc3Vic3RyKDAsMykgPT0gJzAwMScpIHtcbiAgICAgICAgICAgIHNlYXNvblR5cGUgPSAnUHJlK1NlYXNvbic7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSBpZiAobGl2ZVNjb3Jlc1swXS5naWQuc3Vic3RyKDAsMykgPT0gJzAwNCcpIHtcbiAgICAgICAgICAgIHNlYXNvblR5cGUgPSAnUGxheW9mZnMnO1xuICAgICAgICB9XG4gICAgICAgIGlmIChsaXZlU2NvcmVzLmxlbmd0aCA+IDEgfHwgKGxpdmVTY29yZXMubGVuZ3RoID09IDEgJiYgbGl2ZVNjb3Jlc1swXS5oLnRhICE9ICdCT1MnKSkge1xuICAgICAgICAgICAgdmFyIHN0YXR1c0NvZGVzID0gWycxc3QgUXRyJywnMm5kIFF0cicsJzNyZCBRdHInLCc0dGggUXRyJywnMXN0IE9UJywnMm5kIE9UJywnM3JkIE9UJywnNHRoIE9UJywnNXRoIE9UJywnNnRoIE9UJywnN3RoIE9UJywnOHRoIE9UJywnOXRoIE9UJywnMTB0aCBPVCddO1xuICAgICAgICAgICAgdmFyIHNjb3Jlc0hUTUwgPSAnJztcbiAgICAgICAgICAgIGlmIChqUXVlcnkoJy5hdGwtaGVhZGVyJykubGVuZ3RoID09PSAwKSB7XG4gICAgICAgICAgICAgICAgalF1ZXJ5KCcjbGVmdHdyYXAnKS5wcmVwZW5kKCc8aW1nIGNsYXNzPVwiYXRsLWhlYWRlclwiIHNyYz1cImh0dHA6Ly9pLmNkbi50dXJuZXIuY29tL25iYS9uYmEvLmVsZW1lbnQvbWVkaWEvMi4wL3RlYW1zaXRlcy9jZWx0aWNzL21lZGlhL3NpZ25hZ2UtYXRsLTk2MHgxMzUucG5nXCI+Jyk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBmb3IgKHZhciBpID0gbGl2ZVNjb3Jlcy5sZW5ndGggLSAxOyBpID49IDA7IGktLSkge1xuICAgICAgICAgICAgICAgIGlmIChsaXZlU2NvcmVzW2ldLmgudGEgIT09ICdCT1MnKSB7XG4gICAgICAgICAgICAgICAgICAgIHZhciB2U2NvcmUgPSAnJztcbiAgICAgICAgICAgICAgICAgICAgdmFyIGhTY29yZSA9ICcnO1xuICAgICAgICAgICAgICAgICAgICBpZiAobGl2ZVNjb3Jlc1tpXS5zdCAhPSAxKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICB2U2NvcmUgPSBsaXZlU2NvcmVzW2ldLnYucztcbiAgICAgICAgICAgICAgICAgICAgICAgIGhTY29yZSA9IGxpdmVTY29yZXNbaV0uaC5zO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIHZhciBzVGV4dCA9IGxpdmVTY29yZXNbaV0uc3R0O1xuICAgICAgICAgICAgICAgICAgICBpZiAoc3RhdHVzQ29kZXMuaW5kZXhPZihsaXZlU2NvcmVzW2ldLnN0dCkgIT09IC0xKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBzVGV4dCA9IGxpdmVTY29yZXNbaV0uc3R0ICsgJyAtICcgKyBsaXZlU2NvcmVzW2ldLmNsO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIHNjb3Jlc0hUTUwgKz0gJzxkaXYgY2xhc3M9XCJzY29yZS13cmFwXCI+PGRpdiBjbGFzcz1cInNjb3JlLWNvbnRhaW5lclwiPjxkaXYgY2xhc3M9XCInICsgbGl2ZVNjb3Jlc1tpXS52LnRhICsgJ1wiPjxpbWcgc3JjPVwiaHR0cDovL3N0YXRzLm5iYS5jb20vbWVkaWEvaW1nL3RlYW1zL2xvZ29zLycgKyBsaXZlU2NvcmVzW2ldLnYudGEudG9VcHBlckNhc2UoKSArICdfbG9nby5zdmdcIj4gJyArIGxpdmVTY29yZXNbaV0udi50Yy50b1VwcGVyQ2FzZSgpICsgJyAnICsgbGl2ZVNjb3Jlc1tpXS52LnRuLnRvVXBwZXJDYXNlKCkgKyAnIDxkaXYgY2xhc3M9XCJzY29yZS1udW1cIj4nICsgdlNjb3JlICsgJzwvZGl2PjwvZGl2PjxkaXYgY2xhc3M9XCInICsgbGl2ZVNjb3Jlc1tpXS5oLnRhICsgJ1wiPjxpbWcgc3JjPVwiaHR0cDovL3N0YXRzLm5iYS5jb20vbWVkaWEvaW1nL3RlYW1zL2xvZ29zLycgKyBsaXZlU2NvcmVzW2ldLmgudGEudG9VcHBlckNhc2UoKSArICdfbG9nby5zdmdcIj4gJyArIGxpdmVTY29yZXNbaV0uaC50Yy50b1VwcGVyQ2FzZSgpICsgJyAnICsgbGl2ZVNjb3Jlc1tpXS5oLnRuLnRvVXBwZXJDYXNlKCkgKyAnIDxkaXYgY2xhc3M9XCJzY29yZS1udW1cIj4nICsgaFNjb3JlICsgJzwvZGl2PjwvZGl2PjxkaXYgY2xhc3M9XCJzY29yZS1zdGF0dXNcIj4nICsgc1RleHQgKyAnPC9kaXY+PC9kaXY+PC9kaXY+JztcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBqUXVlcnkoJy5zY29yZXMnKS5lbXB0eSgpLmFwcGVuZChzY29yZXNIVE1MKTtcbiAgICAgICAgICAgIGxlYWd1ZUxlYWRlcnMoc2Vhc29uVHlwZSk7XG4gICAgICAgIH1cbiAgICB9XG59XG5cbmZ1bmN0aW9uIGxlYWd1ZUxlYWRlcnMoKXtcbiAgICB2YXIgbGVhZ3VlTGVhZGVyc0hUTUwgPSAnPGRpdiBjbGFzcz1cInRpdGxlXCI+PHA+TEVBR1VFIExFQURFUlM8L3A+PHA+UFRTPC9wPjxwPlJFQjwvcD48cD5BU1Q8L3A+PHA+U1RMPC9wPjxwPkJMSzwvcD48L2Rpdj4nO1xuICAgIHZhciBzdGF0VHlwZSA9ICcnO1xuICAgIHZhciBkYXRhSW5kZXggPSBbXCJSQU5LXCIsXCJQTEFZRVJfSURcIixcIlBMQVlFUlwiLFwiVEVBTV9JRFwiLFwiVEVBTV9BQkJSRVZJQVRJT05cIl07XG5cbiAgICBqUXVlcnkuYWpheCh7XG4gICAgICAgIHVybDogZmVlZHMubGVhZ3VlTGVhZGVycyxcbiAgICAgICAgYXN5bmM6IGZhbHNlLFxuICAgICAgICBzdWNjZXNzOiBmdW5jdGlvbihkYXRhKSB7XG4gICAgICAgICAgICB2YXIgbGVhZGVyc0RhdGEgPSBkYXRhLnJlc3VsdFNldHM7XG4gICAgICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IGxlYWRlcnNEYXRhLmxlbmd0aDsgaSsrKXtcbiAgICAgICAgICAgICAgICB2YXIgaW5kZXggPSBjcmVhdGVJbmRleChkYXRhSW5kZXgsIGxlYWRlcnNEYXRhW2ldLmhlYWRlcnMpO1xuICAgICAgICAgICAgICAgIHZhciByb3dzID0gJyc7XG4gICAgICAgICAgICAgICAgaWYgKFtcIlBUU1wiLFwiUkVCXCIsXCJBU1RcIixcIlNUTFwiLFwiQkxLXCJdLmluZGV4T2YobGVhZGVyc0RhdGFbaV0uaGVhZGVyc1s4XSkgIT09IC0xKXtcbiAgICAgICAgICAgICAgICAgICAgZm9yIChsZXQgeCA9IDA7IHggPCBsZWFkZXJzRGF0YVtpXS5yb3dTZXQubGVuZ3RoOyB4Kyspe1xuICAgICAgICAgICAgICAgICAgICAgICAgdmFyIG4gPSBsZWFkZXJzRGF0YVtpXS5yb3dTZXRbeF1bMl0uc3BsaXQoJyAnKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHZhciBmbiA9IG5bMF0udG9VcHBlckNhc2UoKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHZhciBsbiA9IG5bMV0udG9VcHBlckNhc2UoKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJvd3MgKz0gJzxkaXYgY2xhc3M9XCJyb3dcIj48ZGl2IGNsYXNzPVwibGVmdFwiPjxkaXYgY2xhc3M9XCJwbGFjZVwiPicgKyBsZWFkZXJzRGF0YVtpXS5yb3dTZXRbeF1bMF0gKyAnPC9kaXY+PGRpdiBjbGFzcz1cImxvZ28td3JhcFwiPjxpbWcgY2xhc3M9XCJsb2dvXCIgc3JjPVwiaHR0cDovL3N0YXRzLm5iYS5jb20vbWVkaWEvaW1nL3RlYW1zL2xvZ29zLycgKyBsZWFkZXJzRGF0YVtpXS5yb3dTZXRbeF1bNF0gKyAnX2xvZ28uc3ZnXCIvPjwvZGl2PjxkaXYgY2xhc3M9XCJuYW1lXCI+PHNwYW4+JyArIGZuICsgJzwvc3Bhbj4gJyArIGxuICsgJzwvZGl2PjwvZGl2PjxkaXYgY2xhc3M9XCJyaWdodFwiPjxkaXYgY2xhc3M9XCJ2YWx1ZVwiPicgKyByb3VuZChsZWFkZXJzRGF0YVtpXS5yb3dTZXRbeF1bOF0pICsgJzwvZGl2PjwvZGl2PjwvZGl2Pic7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgbGVhZ3VlTGVhZGVyc0hUTUwgKz0gJzxkaXYgY2xhc3M9XCJsZWFndWUtbGVhZGVycy13cmFwXCI+JyArIHJvd3MgKyAnPC9kaXY+JztcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9KTtcbiAgICBqUXVlcnkoJy5sZWFndWUtbGVhZGVycycpLmVtcHR5KCkuYXBwZW5kKGxlYWd1ZUxlYWRlcnNIVE1MKTtcbiAgICB2YXIgY291bnRlciA9IDI7XG4gICAgc2V0SW50ZXJ2YWwoZnVuY3Rpb24oKXtcbiAgICAgICAgalF1ZXJ5KCcubGVhZ3VlLWxlYWRlcnMtd3JhcCwgLmxlYWd1ZS1sZWFkZXJzIC50aXRsZSBwJykucmVtb3ZlQ2xhc3MoJ2FjdGl2ZScpO1xuICAgICAgICBqUXVlcnkoJy5sZWFndWUtbGVhZGVycy13cmFwOm50aC1vZi10eXBlKCcgKyBjb3VudGVyICsgJyksIC5sZWFndWUtbGVhZGVycyAudGl0bGUgcDpudGgtb2YtdHlwZSgnICsgY291bnRlciArICcpJykuYWRkQ2xhc3MoJ2FjdGl2ZScpO1xuICAgICAgICBpZiAoY291bnRlciA9PSA2KSB7XG4gICAgICAgICAgICBjb3VudGVyID0gMjtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgIGNvdW50ZXIrKztcbiAgICAgICAgfVxuICAgIH0sIDQwMDApO1xufVxuIl19
