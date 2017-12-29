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
                if (todaysScoresData.gs.g[i].h.ta == 'BOS') {
                    // TRANSITIONS
                    var _cycle = function _cycle() {
                        /*                        mobileApp();*/ // DURATION: 25000
                        setTimeout(allStar, 0);
                        /*                        setTimeout(function() {
                                                    leaders(gid);
                                                }, 25000);*/ // DURATION: 44100
                        /*                         setTimeout(social, 69000); */ //DURATION: 150000
                        /*                         setTimeout(function(){
                                                    playerSpotlight(rosterObj);
                                                },85000)*/; //DURATION: 40000
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
                    /*                    setInterval(cycle, 123000);*/
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
    if (!gameStarted) {
        jQuery.ajax({
            url: feeds.todaysScores,
            async: false,
            success: function success(datadata) {
                var gid = '';
                for (var i = 0; i < 5; i++) {
                    if (datadata.gs.g[i].h.ta == 'BOS' && datadata.gs.g[i].st == 2) {
                        gameStarted = true;
                        console.log('gamestarted');
                    }
                }
            }
        });
    }
    return gameStarted;
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
                rosterObj.celtics.roster[pid].stats.pts = round(rosterObj.celtics.roster[pid].stats.pts);
                rosterObj.celtics.roster[pid].stats.ast = round(rosterObj.celtics.roster[pid].stats.ast);
                rosterObj.celtics.roster[pid].stats.reb = round(rosterObj.celtics.roster[pid].stats.reb);
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
                rosterObj.away.roster[pid].stats.pts = round(rosterObj.away.roster[pid].stats.pts);
                rosterObj.away.roster[pid].stats.ast = round(rosterObj.away.roster[pid].stats.ast);
                rosterObj.away.roster[pid].stats.reb = round(rosterObj.away.roster[pid].stats.reb);
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
    }, 1700);
    /* 5 - PLAYER SELECT */
    var selectedPlayer = '';
    setTimeout(function () {
        jQuery('.player-box').addClass('transition-2');
        jQuery('.player-box:nth-child(' + playerSpotlightCounter + ')').addClass('selected');
        selectedPlayer = jQuery('.player-box:nth-child(' + playerSpotlightCounter + ')').attr('data-pid');
        setTimeout(function () {
            jQuery('.player-box').not('.replacement.selected').addClass('transition-4');
        }, 800);
    }, 3000);
    /* 6 - PLAYER BOX EXPAND */
    setTimeout(function () {
        jQuery('.block-wrap.social').addClass('transition-3');
        jQuery('.player-box.replacement.selected').addClass('transition-3');
    }, 4000);
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
            if (i <= rosterObj.celtics.roster[selectedPlayer].bio.personal.length) {
                jQuery('.player-spotlight .bottom-wrap').append('<div class="dyk-box appended"><p>' + playerFacts[i] + '</p></div>');
            }
        };
        jQuery('.player-spotlight .bottom-wrap').addClass('transition-1');
        if (jQuery('.player-spotlight .bottom-wrap .dyk-box').length > 1) {
            setTimeout(function () {
                jQuery('.player-spotlight .bottom-wrap .dyk-box:nth-of-type(2)').addClass('transition-2');
                jQuery('.player-spotlight .bottom-wrap .dyk-box:nth-of-type(3)').addClass('transition-1');
            }, 10000);
        }
        if (jQuery('.player-spotlight .bottom-wrap .dyk-box').length > 2) {
            setTimeout(function () {
                jQuery('.player-spotlight .bottom-wrap .dyk-box:nth-of-type(3)').addClass('transition-2');
                jQuery('.player-spotlight .bottom-wrap .dyk-box:nth-of-type(4)').addClass('transition-1');
            }, 20000);
        }
    }, 5000);
    /* 8 - SPOTLIGHT SLIDE IN */
    setTimeout(function () {
        jQuery('.player-spotlight .player-top .player-name, .player-spotlight .player-name-wrap, .player-spotlight .headshot, .player-spotlight .info, .player-spotlight .silo, .player-spotlight .averages, .player-spotlight .player-number').addClass('transition-1');
        setTimeout(function () {
            jQuery('.block-wrap.player-spotlight .player-box').remove();
        }, 15000);
        if (playerSpotlightCounter < 16) {
            playerSpotlightCounter++;
        } else {
            playerSpotlightCounter = 0;
        }
    }, 6000);
    /* 9 - SPOTLIGHT SLIDE OUT */
    setTimeout(function () {
        jQuery('.player-spotlight .bottom-wrap, .player-spotlight .top-wrap').addClass('transition-2');
    }, 40000);
    /* 10 - DONE. REMOVE */
    setTimeout(function () {
        jQuery(' .player-spotlight .appended').remove();
        jQuery(' .player-spotlight .selected').removeClass('selected');
        for (var i = 1; i < 10; i++) {
            jQuery('.right-wrap .transition-' + i).removeClass('transition-' + i);
        }
    }, 45000);
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

function allStar() {
    jQuery('.all-star .block-inner').removeClass('transition-1');
    jQuery('.all-star').addClass('active');
    /*    setTimeout(function() {
            jQuery('.all-star .block-inner').addClass('transition-1');
        }, 24000);
        setTimeout(function() {
            jQuery('.all-star').removeClass('active');
            clearInterval(rotateScreens);
        }, 25000);*/
}
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
                    var isLive = '';
                    if (liveScores[i].st != 1) {
                        vScore = liveScores[i].v.s;
                        hScore = liveScores[i].h.s;
                        isLive = "live";
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
                    scoresHTML += '<div class="score-wrap"><div class="score-status ' + isLive + '">' + sText.toUpperCase() + '</div><div class="' + liveScores[i].v.ta + '"><img src="http://stats.nba.com/media/img/teams/logos/' + liveScores[i].v.ta.toUpperCase() + '_logo.svg"> ' + liveScores[i].v.tc.toUpperCase() + ' ' + liveScores[i].v.tn.toUpperCase() + ' <div class="score-num ' + vResult + '">' + vScore + '</div></div><div class="' + liveScores[i].h.ta + '"><img src="http://stats.nba.com/media/img/teams/logos/' + liveScores[i].h.ta.toUpperCase() + '_logo.svg"> ' + liveScores[i].h.tc.toUpperCase() + ' ' + liveScores[i].h.tn.toUpperCase() + ' <div class="score-num ' + hResult + '">' + hScore + '</div></div></div>';
                }
            }
            jQuery('.scores').empty().append(scoresHTML);
        }
        if (added < 6) {
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJzcmMvanMvY29uY291cnNlLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7QUNBQSxJQUFJLFlBQVk7QUFDWixhQUFTO0FBQ0wsZ0JBQVEsRUFESDtBQUVMLGlCQUFTO0FBQ0wsaUJBQUssQ0FDRCxDQUFDLElBQUQsRUFBTyxJQUFQLEVBQWEsQ0FBYixFQUFnQixJQUFoQixDQURDLEVBRUQsQ0FBQyxJQUFELEVBQU8sSUFBUCxFQUFhLENBQWIsRUFBZ0IsSUFBaEIsQ0FGQyxFQUdELENBQUMsSUFBRCxFQUFPLElBQVAsRUFBYSxDQUFiLEVBQWdCLElBQWhCLENBSEMsQ0FEQTtBQU1MLGlCQUFLLENBQ0QsQ0FBQyxJQUFELEVBQU8sSUFBUCxFQUFhLENBQWIsRUFBZ0IsSUFBaEIsQ0FEQyxFQUVELENBQUMsSUFBRCxFQUFPLElBQVAsRUFBYSxDQUFiLEVBQWdCLElBQWhCLENBRkMsRUFHRCxDQUFDLElBQUQsRUFBTyxJQUFQLEVBQWEsQ0FBYixFQUFnQixJQUFoQixDQUhDLENBTkE7QUFXTCxpQkFBSyxDQUNELENBQUMsSUFBRCxFQUFPLElBQVAsRUFBYSxDQUFiLEVBQWdCLElBQWhCLENBREMsRUFFRCxDQUFDLElBQUQsRUFBTyxJQUFQLEVBQWEsQ0FBYixFQUFnQixJQUFoQixDQUZDLEVBR0QsQ0FBQyxJQUFELEVBQU8sSUFBUCxFQUFhLENBQWIsRUFBZ0IsSUFBaEIsQ0FIQztBQVhBO0FBRkosS0FERztBQXFCWixVQUFNO0FBQ0YsZ0JBQVEsRUFETjtBQUVGLGlCQUFTO0FBQ0wsaUJBQUssQ0FDRCxDQUFDLElBQUQsRUFBTyxJQUFQLEVBQWEsQ0FBYixFQUFnQixJQUFoQixDQURDLEVBRUQsQ0FBQyxJQUFELEVBQU8sSUFBUCxFQUFhLENBQWIsRUFBZ0IsSUFBaEIsQ0FGQyxFQUdELENBQUMsSUFBRCxFQUFPLElBQVAsRUFBYSxDQUFiLEVBQWdCLElBQWhCLENBSEMs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QUFwQk8sS0FBWjtBQXNCQSxRQUFJLFVBQVUsQ0FBZDtBQUNBLGdCQUFZLFlBQVc7QUFDbkIsZUFBTyxnREFBUCxFQUF5RCxXQUF6RCxDQUFxRSxRQUFyRTtBQUNBLGVBQU8sc0NBQXNDLE9BQXRDLEdBQWdELDBDQUFoRCxHQUE2RixPQUE3RixHQUF1RyxHQUE5RyxFQUFtSCxRQUFuSCxDQUE0SCxRQUE1SDtBQUNBLFlBQUksV0FBVyxDQUFmLEVBQWtCO0FBQ2Qsc0JBQVUsQ0FBVjtBQUNILFNBRkQsTUFFTztBQUNIO0FBQ0g7QUFDSixLQVJELEVBUUcsS0FSSDtBQVNIIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24gZSh0LG4scil7ZnVuY3Rpb24gcyhvLHUpe2lmKCFuW29dKXtpZighdFtvXSl7dmFyIGE9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtpZighdSYmYSlyZXR1cm4gYShvLCEwKTtpZihpKXJldHVybiBpKG8sITApO3ZhciBmPW5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIrbytcIidcIik7dGhyb3cgZi5jb2RlPVwiTU9EVUxFX05PVF9GT1VORFwiLGZ9dmFyIGw9bltvXT17ZXhwb3J0czp7fX07dFtvXVswXS5jYWxsKGwuZXhwb3J0cyxmdW5jdGlvbihlKXt2YXIgbj10W29dWzFdW2VdO3JldHVybiBzKG4/bjplKX0sbCxsLmV4cG9ydHMsZSx0LG4scil9cmV0dXJuIG5bb10uZXhwb3J0c312YXIgaT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2Zvcih2YXIgbz0wO288ci5sZW5ndGg7bysrKXMocltvXSk7cmV0dXJuIHN9KSIsInZhciByb3N0ZXJPYmogPSB7XG4gICAgY2VsdGljczoge1xuICAgICAgICByb3N0ZXI6IHt9LFxuICAgICAgICBsZWFkZXJzOiB7XG4gICAgICAgICAgICBwdHM6IFtcbiAgICAgICAgICAgICAgICBbJy0tJywgJy0tJywgMCwgJy0tJ10sXG4gICAgICAgICAgICAgICAgWyctLScsICctLScsIDAsICctLSddLFxuICAgICAgICAgICAgICAgIFsnLS0nLCAnLS0nLCAwLCAnLS0nXVxuICAgICAgICAgICAgXSxcbiAgICAgICAgICAgIGFzdDogW1xuICAgICAgICAgICAgICAgIFsnLS0nLCAnLS0nLCAwLCAnLS0nXSxcbiAgICAgICAgICAgICAgICBbJy0tJywgJy0tJywgMCwgJy0tJ10sXG4gICAgICAgICAgICAgICAgWyctLScsICctLScsIDAsICctLSddXG4gICAgICAgICAgICBdLFxuICAgICAgICAgICAgcmViOiBbXG4gICAgICAgICAgICAgICAgWyctLScsICctLScsIDAsICctLSddLFxuICAgICAgICAgICAgICAgIFsnLS0nLCAnLS0nLCAwLCAnLS0nXSxcbiAgICAgICAgICAgICAgICBbJy0tJywgJy0tJywgMCwgJy0tJ11cbiAgICAgICAgICAgIF1cbiAgICAgICAgfVxuICAgIH0sXG4gICAgYXdheToge1xuICAgICAgICByb3N0ZXI6IHt9LFxuICAgICAgICBsZWFkZXJzOiB7XG4gICAgICAgICAgICBwdHM6IFtcbiAgICAgICAgICAgICAgICBbJy0tJywgJy0tJywgMCwgJy0tJ10sXG4gICAgICAgICAgICAgICAgWyctLScsICctLScsIDAsICctLSddLFxuICAgICAgICAgICAgICAgIFsnLS0nLCAnLS0nLCAwLCAnLS0nXVxuICAgICAgICAgICAgXSxcbiAgICAgICAgICAgIGFzdDogW1xuICAgICAgICAgICAgICAgIFsnLS0nLCAnLS0nLCAwLCAnLS0nXSxcbiAgICAgICAgICAgICAgICBbJy0tJywgJy0tJywgMCwgJy0tJ10sXG4gICAgICAgICAgICAgICAgWyctLScsICctLScsIDAsICctLSddXG4gICAgICAgICAgICBdLFxuICAgICAgICAgICAgcmViOiBbXG4gICAgICAgICAgICAgICAgWyctLScsICctLScsIDAsICctLSddLFxuICAgICAgICAgICAgICAgIFsnLS0nLCAnLS0nLCAwLCAnLS0nXSxcbiAgICAgICAgICAgICAgICBbJy0tJywgJy0tJywgMCwgJy0tJ11cbiAgICAgICAgICAgIF1cbiAgICAgICAgfVxuICAgIH1cbn07XG5cbmlmICh3aW5kb3cubG9jYXRpb24uaHJlZi5pbmRleE9mKCduYmEuY29tJykgPiAtMSl7XG4gICAgdmFyIGR1bW15VmFyID0gJyYnO1xuICAgIHZhciBmZWVkcyA9IHtcbiAgICAgICAgdG9kYXlzU2NvcmVzOiAnaHR0cDovL2RhdGEubmJhLmNvbS9kYXRhL3YyMDE1L2pzb24vbW9iaWxlX3RlYW1zL25iYS8yMDE3L3Njb3Jlcy8wMF90b2RheXNfc2NvcmVzLmpzb24nLFxuICAgICAgICBjZWx0aWNzUm9zdGVyOiAnaHR0cDovL2RhdGEubmJhLmNvbS9kYXRhL3YyMDE1L2pzb24vbW9iaWxlX3RlYW1zL25iYS8yMDE3L3RlYW1zL2NlbHRpY3Nfcm9zdGVyLmpzb24nLFxuICAgICAgICBhd2F5Um9zdGVyOiBmdW5jdGlvbihhd2F5VG4pe1xuICAgICAgICAgICAgcmV0dXJuICdodHRwOi8vZGF0YS5uYmEuY29tL2RhdGEvdjIwMTUvanNvbi9tb2JpbGVfdGVhbXMvbmJhLzIwMTcvdGVhbXMvJyArIGF3YXlUbiArICdfcm9zdGVyLmpzb24nO1xuICAgICAgICB9LFxuICAgICAgICBiaW9EYXRhOiAnaHR0cDovL2lvLmNubi5uZXQvbmJhL25iYS8uZWxlbWVudC9tZWRpYS8yLjAvdGVhbXNpdGVzL2NlbHRpY3MvanNvbi9iaW8tZGF0YS5qc29uJyxcbiAgICAgICAgcGxheWVyY2FyZDogZnVuY3Rpb24ocGlkKXtcbiAgICAgICAgICAgIHJldHVybiAnaHR0cDovL2RhdGEubmJhLmNvbS9kYXRhL3YyMDE1L2pzb24vbW9iaWxlX3RlYW1zL25iYS8yMDE3L3BsYXllcnMvcGxheWVyY2FyZF8nICsgcGlkICsgJ18wMi5qc29uJztcbiAgICAgICAgfSxcbiAgICAgICAgcGxheWVyY2FyZEF3YXk6IGZ1bmN0aW9uKHBpZCl7XG4gICAgICAgICAgICByZXR1cm4gJ2h0dHA6Ly9kYXRhLm5iYS5jb20vZGF0YS92MjAxNS9qc29uL21vYmlsZV90ZWFtcy9uYmEvMjAxNy9wbGF5ZXJzL3BsYXllcmNhcmRfJyArIHBpZCArICdfMDIuanNvbic7XG4gICAgICAgIH0sXG4gICAgICAgIGdhbWVkZXRhaWw6IGZ1bmN0aW9uKGdpZCkge1xuICAgICAgICAgICAgcmV0dXJuICdodHRwOi8vZGF0YS5uYmEuY29tL2RhdGEvdjIwMTUvanNvbi9tb2JpbGVfdGVhbXMvbmJhLzIwMTcvc2NvcmVzL2dhbWVkZXRhaWwvJyArIGdpZCArICdfZ2FtZWRldGFpbC5qc29uJztcbiAgICAgICAgfSxcbiAgICAgICAgc3RhbmRpbmdzOiAnaHR0cDovL2RhdGEubmJhLmNvbS9kYXRhL3YyMDE1L2pzb24vbW9iaWxlX3RlYW1zL25iYS8yMDE3LzAwX3N0YW5kaW5ncy5qc29uJyxcbiAgICAgICAgbGVhZ3VlTGVhZGVyczogJ2h0dHA6Ly9zdGF0cy5uYmEuY29tL3N0YXRzL2hvbWVwYWdldjI/R2FtZVNjb3BlPVNlYXNvbiZMZWFndWVJRD0wMCZQbGF5ZXJPclRlYW09UGxheWVyJlBsYXllclNjb3BlPUFsbCtQbGF5ZXJzJlNlYXNvbj0yMDE3LTE4JlNlYXNvblR5cGU9UmVndWxhcitTZWFzb24mU3RhdFR5cGU9VHJhZGl0aW9uYWwmY2FsbGJhY2s9PydcbiAgICB9O1xufVxuZWxzZSB7XG4gICAgdmFyIGZlZWRzID0ge1xuICAgICAgICB0b2RheXNTY29yZXM6ICdodHRwOi8vbG9jYWxob3N0Ojg4ODgvZGF0YS9tb2JpbGUtc3RhdHMtZmVlZC90b2RheXNfc2NvcmVzLmpzb24nLFxuICAgICAgICBjZWx0aWNzUm9zdGVyOiAnaHR0cDovL2xvY2FsaG9zdDo4ODg4L2RhdGEvbW9iaWxlLXN0YXRzLWZlZWQvY2VsdGljc19yb3N0ZXIuanNvbicsXG4gICAgICAgIGF3YXlSb3N0ZXI6IGZ1bmN0aW9uKGF3YXlUbikge1xuICAgICAgICAgICAgcmV0dXJuICdodHRwOi8vbG9jYWxob3N0Ojg4ODgvZGF0YS9tb2JpbGUtc3RhdHMtZmVlZC9hd2F5X3Jvc3Rlci5qc29uJztcbiAgICAgICAgfSxcbiAgICAgICAgYmlvRGF0YTogJ2h0dHA6Ly9sb2NhbGhvc3Q6ODg4OC9kYXRhL2Jpby1kYXRhLmpzb24nLFxuICAgICAgICBwbGF5ZXJjYXJkOiBmdW5jdGlvbihwaWQpIHtcbiAgICAgICAgICAgIHJldHVybiAnaHR0cDovL2xvY2FsaG9zdDo4ODg4L2RhdGEvbW9iaWxlLXN0YXRzLWZlZWQvcGxheWVyY2FyZHMvcGxheWVyY2FyZC0nICsgcGlkICsgJy5qc29uJztcbiAgICAgICAgfSxcbiAgICAgICAgcGxheWVyY2FyZEF3YXk6IGZ1bmN0aW9uKHBpZCkge1xuICAgICAgICAgICAgcmV0dXJuICdodHRwOi8vbG9jYWxob3N0Ojg4ODgvZGF0YS9tb2JpbGUtc3RhdHMtZmVlZC9wbGF5ZXJjYXJkcy9wbGF5ZXJjYXJkLTIwMjMzMC5qc29uJztcbiAgICAgICAgfSxcbiAgICAgICAgZ2FtZWRldGFpbDogZnVuY3Rpb24oZ2lkKSB7XG4gICAgICAgICAgICByZXR1cm4gJ2h0dHA6Ly9sb2NhbGhvc3Q6ODg4OC9kYXRhL21vYmlsZS1zdGF0cy1mZWVkL2dhbWVkZXRhaWwuanNvbic7XG4gICAgICAgIH0sXG4gICAgICAgIHN0YW5kaW5nczogJ2h0dHA6Ly9sb2NhbGhvc3Q6ODg4OC9kYXRhL21vYmlsZS1zdGF0cy1mZWVkL3N0YW5kaW5ncy5qc29uJyxcbiAgICAgICAgbGVhZ3VlTGVhZGVyczogJ2h0dHA6Ly9sb2NhbGhvc3Q6ODg4OC9kYXRhL2xlYWd1ZV9sZWFkZXJzLmpzb24nXG4gICAgfTtcbn1cblxudmFyIGdhbWVTdGFydGVkID0gZmFsc2U7XG5sZXQgcGxheWVyU3BvdGxpZ2h0Q291bnRlciA9IDE7XG5qUXVlcnkoZG9jdW1lbnQpLnJlYWR5KGZ1bmN0aW9uKCkge1xuICAgIHZhciBnaWQgPSAnJztcbiAgICB2YXIgYXdheVRlYW0gPSAnJztcbiAgICB2YXIgYXdheVRuID0gJyc7XG4gICAgdmFyIGRhdGUgPSBuZXcgRGF0ZSgpO1xuICAgIHZhciBsZWZ0V3JhcENvdW50ZXIgPSBmYWxzZTtcbiAgICBqUXVlcnkuYWpheCh7XG4gICAgICAgIHVybDogZmVlZHMudG9kYXlzU2NvcmVzLFxuICAgICAgICBhc3luYzogZmFsc2UsXG4gICAgICAgIHN1Y2Nlc3M6IGZ1bmN0aW9uKHRvZGF5c1Njb3Jlc0RhdGEpIHtcbiAgICAgICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgdG9kYXlzU2NvcmVzRGF0YS5ncy5nLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICAgICAgaWYgKHRvZGF5c1Njb3Jlc0RhdGEuZ3MuZ1tpXS5oLnRhID09ICdCT1MnKSB7IC8vQ0hBTkdFIFRISVNcbiAgICAgICAgICAgICAgICAgICAgYXdheVRlYW0gPSB0b2RheXNTY29yZXNEYXRhLmdzLmdbaV0udi50YTtcbiAgICAgICAgICAgICAgICAgICAgYXdheVRuID0gdG9kYXlzU2NvcmVzRGF0YS5ncy5nW2ldLnYudG4udG9Mb3dlckNhc2UoKTtcbiAgICAgICAgICAgICAgICAgICAgZ2lkID0gdG9kYXlzU2NvcmVzRGF0YS5ncy5nW2ldLmdpZDtcbiAgICAgICAgICAgICAgICAgICAgbG9hZFJvc3RlckRhdGEoYXdheVRlYW0sIGF3YXlUbik7XG4gICAgICAgICAgICAgICAgICAgIHNjb3Jlc0luaXQodG9kYXlzU2NvcmVzRGF0YSk7XG4gICAgICAgICAgICAgICAgICAgIHN0YW5kaW5nc0luaXQoYXdheVRlYW0pO1xuICAgICAgICAgICAgICAgICAgICBsZWFndWVMZWFkZXJzKCk7XG4gICAgICAgICAgICAgICAgICAgIGxlZnRXcmFwKCk7XG4gICAgICAgICAgICAgICAgICAgIC8vIFRSQU5TSVRJT05TXG4gICAgICAgICAgICAgICAgICAgIGZ1bmN0aW9uIGN5Y2xlKCkge1xuLyogICAgICAgICAgICAgICAgICAgICAgICBtb2JpbGVBcHAoKTsqLyAvLyBEVVJBVElPTjogMjUwMDBcbiAgICAgICAgICAgICAgICAgICAgICAgIHNldFRpbWVvdXQoYWxsU3RhciwgMCk7XG4vKiAgICAgICAgICAgICAgICAgICAgICAgIHNldFRpbWVvdXQoZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgbGVhZGVycyhnaWQpO1xuICAgICAgICAgICAgICAgICAgICAgICAgfSwgMjUwMDApOyovIC8vIERVUkFUSU9OOiA0NDEwMFxuLyogICAgICAgICAgICAgICAgICAgICAgICAgc2V0VGltZW91dChzb2NpYWwsIDY5MDAwKTsgKi8vL0RVUkFUSU9OOiAxNTAwMDBcbi8qICAgICAgICAgICAgICAgICAgICAgICAgIHNldFRpbWVvdXQoZnVuY3Rpb24oKXtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBwbGF5ZXJTcG90bGlnaHQocm9zdGVyT2JqKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH0sODUwMDApKi87IC8vRFVSQVRJT046IDQwMDAwXG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgY3ljbGUoKTtcbi8qICAgICAgICAgICAgICAgICAgICBzZXRJbnRlcnZhbChjeWNsZSwgMTIzMDAwKTsqL1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH0pO1xufSk7XG5cbmZ1bmN0aW9uIGN5Y2xlKCkge31cbi8qPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbj0gICAgICAgICAgICBNSVNDIEZVTkNUSU9OUyAgICAgICAgICAgID1cbj09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09Ki9cbmZ1bmN0aW9uIHBsYXllckFnZShkb2IpIHtcbiAgICB2YXIgdG9kYXkgPSBuZXcgRGF0ZSgpO1xuICAgIHZhciBiaXJ0aERhdGUgPSBuZXcgRGF0ZShkb2IpO1xuICAgIHZhciBhZ2UgPSB0b2RheS5nZXRGdWxsWWVhcigpIC0gYmlydGhEYXRlLmdldEZ1bGxZZWFyKCk7XG4gICAgcmV0dXJuIGFnZTtcbn1cblxuZnVuY3Rpb24gZ2VuZXJhdGVUaW1lbGluZShzZWxlY3RlZFBsYXllcikge1xuICAgIC8vIEFQUEVORDogVElNRUxJTkVcbiAgICB2YXIgc2Vhc29uc1BsYXllZCA9IHJvc3Rlck9iai5jZWx0aWNzLnJvc3RlcltzZWxlY3RlZFBsYXllcl0uc3RhdHMuc2EubGVuZ3RoO1xuICAgIHZhciB0aW1lbGluZUhUTUwgPSAnJztcbiAgICB2YXIgc2Vhc29uWWVhckhUTUwgPSAnJztcbiAgICBmb3IgKHZhciBpID0gMDsgaSA8IHNlYXNvbnNQbGF5ZWQ7IGkrKykge1xuICAgICAgICB2YXIgdGVhbUFiYnJldmlhdGlvbiA9IHJvc3Rlck9iai5jZWx0aWNzLnJvc3RlcltzZWxlY3RlZFBsYXllcl0uc3RhdHMuc2FbaV0udGE7XG4gICAgICAgIHZhciB0cmFkZWQgPSByb3N0ZXJPYmouY2VsdGljcy5yb3N0ZXJbc2VsZWN0ZWRQbGF5ZXJdLnN0YXRzLnNhW2ldLnNwbC5sZW5ndGg7XG4gICAgICAgIHZhciBzZWdtZW50SW5uZXIgPSBcIlwiO1xuICAgICAgICB2YXIgdGl0bGUgPSBcIlwiO1xuICAgICAgICB2YXIgc2Vhc29uWWVhclRleHQgPSByb3N0ZXJPYmouY2VsdGljcy5yb3N0ZXJbc2VsZWN0ZWRQbGF5ZXJdLnN0YXRzLnNhW2ldLnZhbDtcbiAgICAgICAgaWYgKGkgPT09IDAgfHwgdGVhbUFiYnJldmlhdGlvbiAhPT0gcm9zdGVyT2JqLmNlbHRpY3Mucm9zdGVyW3NlbGVjdGVkUGxheWVyXS5zdGF0cy5zYVtpIC0gMV0udGEpIHsgLy8gSWYgdGhpcyBpcyBhIG5ldyB0ZWFtLCBzdGFydCB0aGUgdGVhbSB3cmFwLlxuICAgICAgICAgICAgdGl0bGUgPSB0ZWFtQWJicmV2aWF0aW9uO1xuICAgICAgICB9XG4gICAgICAgIGlmICh0cmFkZWQpIHtcbiAgICAgICAgICAgIGZvciAodmFyIHggPSAwOyB4IDwgdHJhZGVkOyB4KyspIHtcbiAgICAgICAgICAgICAgICB2YXIgZ3BUb3QgPSByb3N0ZXJPYmouY2VsdGljcy5yb3N0ZXJbc2VsZWN0ZWRQbGF5ZXJdLnN0YXRzLnNhW2ldLmdwO1xuICAgICAgICAgICAgICAgIHZhciBncCA9IHJvc3Rlck9iai5jZWx0aWNzLnJvc3RlcltzZWxlY3RlZFBsYXllcl0uc3RhdHMuc2FbaV0uc3BsW3hdLmdwO1xuICAgICAgICAgICAgICAgIHZhciBncFBlcmNlbnRhZ2UgPSBNYXRoLnJvdW5kKChncCAvIGdwVG90KSAqIDEwMCk7XG4gICAgICAgICAgICAgICAgdGVhbUFiYnJldmlhdGlvbiA9IHJvc3Rlck9iai5jZWx0aWNzLnJvc3RlcltzZWxlY3RlZFBsYXllcl0uc3RhdHMuc2FbaV0uc3BsW3hdLnRhO1xuICAgICAgICAgICAgICAgIGlmIChpID09PSAwIHx8IHRlYW1BYmJyZXZpYXRpb24gIT09IHJvc3Rlck9iai5jZWx0aWNzLnJvc3RlcltzZWxlY3RlZFBsYXllcl0uc3RhdHMuc2FbaSAtIDFdLnRhICYmIHRlYW1BYmJyZXZpYXRpb24gIT09IHJvc3Rlck9iai5jZWx0aWNzLnJvc3RlcltzZWxlY3RlZFBsYXllcl0uc3RhdHMuc2FbaSArIDFdLnRhKSB7IC8vIElmIHRoaXMgaXMgYSBuZXcgdGVhbSwgc3RhcnQgdGhlIHRlYW0gd3JhcC5cbiAgICAgICAgICAgICAgICAgICAgdGl0bGUgPSB0ZWFtQWJicmV2aWF0aW9uO1xuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIHRpdGxlID0gXCJcIjtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgc2VnbWVudElubmVyICs9ICc8ZGl2IGRhdGEtc2Vhc29uLXllYXI9XCInICsgc2Vhc29uWWVhclRleHQgKyAnXCIgZGF0YS10ZWFtPVwiJyArIHRlYW1BYmJyZXZpYXRpb24gKyAnXCIgc3R5bGU9XCJcIiBjbGFzcz1cInNlZ21lbnQtaW5uZXIgJyArIHRlYW1BYmJyZXZpYXRpb24gKyAnLWJnXCI+PHA+JyArIHRpdGxlICsgJzwvcD48L2Rpdj4nO1xuICAgICAgICAgICAgfVxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgc2VnbWVudElubmVyID0gJzxkaXYgZGF0YS1zZWFzb24teWVhcj1cIicgKyBzZWFzb25ZZWFyVGV4dCArICdcIiBkYXRhLXRlYW09XCInICsgdGVhbUFiYnJldmlhdGlvbiArICdcIiBjbGFzcz1cInNlZ21lbnQtaW5uZXIgJyArIHRlYW1BYmJyZXZpYXRpb24gKyAnLWJnXCI+PHA+JyArIHRpdGxlICsgJzwvcD48L2Rpdj4nO1xuICAgICAgICB9XG4gICAgICAgIHRpbWVsaW5lSFRNTCArPSAnPGRpdiBjbGFzcz1cInNlZ21lbnRcIj4nICsgc2VnbWVudElubmVyICsgJzwvZGl2Pic7XG4gICAgICAgIHNlYXNvblllYXJIVE1MICs9ICc8ZGl2IGNsYXNzPVwic2VnbWVudFwiPjxwPicgKyBzZWFzb25ZZWFyVGV4dCArICc8L3A+PC9kaXY+JztcbiAgICB9XG4gICAgalF1ZXJ5KFwiLnRpbWVsaW5lLXdyYXBcIikuaHRtbCgnPGRpdiBjbGFzcz1cInRpbWVsaW5lIGFwcGVuZGVkXCI+JyArIHRpbWVsaW5lSFRNTCArICc8L2Rpdj48ZGl2IGNsYXNzPVwic2Vhc29uLXllYXIgYXBwZW5kZWRcIj4nICsgc2Vhc29uWWVhckhUTUwgKyAnPC9kaXY+Jyk7XG59XG5cbmZ1bmN0aW9uIGNyZWF0ZUluZGV4KGtleXMsIGFycmF5KSB7XG4gICAgdmFyIG5ld0FyciA9IGtleXMubWFwKGl0ZW0gPT4gYXJyYXkuaW5kZXhPZihpdGVtKSk7XG4gICAgcmV0dXJuIG5ld0Fycjtcbn1cblxuZnVuY3Rpb24gcm91bmQobnVtYmVyKSB7XG4gICAgaWYgKHR5cGVvZiBudW1iZXIgIT09IFwibnVtYmVyXCIgfHwgbnVtYmVyID09IHVuZGVmaW5lZCkge1xuICAgICAgICByZXR1cm4gbnVtYmVyO1xuICAgIH0gZWxzZSB7XG4gICAgICAgIHJldHVybiBudW1iZXIudG9GaXhlZCgxKTtcbiAgICB9XG59XG4vKj09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbj0gICAgICAgICAgICBJTklUSUFMSVpFICAgICAgICAgICAgPVxuPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PSovXG5mdW5jdGlvbiBjaGVja0dhbWVTdGF0dXMoKSB7XG4gICAgaWYgKCFnYW1lU3RhcnRlZCkge1xuICAgICAgICBqUXVlcnkuYWpheCh7XG4gICAgICAgICAgICB1cmw6IGZlZWRzLnRvZGF5c1Njb3JlcyxcbiAgICAgICAgICAgIGFzeW5jOiBmYWxzZSxcbiAgICAgICAgICAgIHN1Y2Nlc3M6IGZ1bmN0aW9uKGRhdGFkYXRhKSB7XG4gICAgICAgICAgICAgICAgdmFyIGdpZCA9ICcnO1xuICAgICAgICAgICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgNTsgaSsrKSB7XG4gICAgICAgICAgICAgICAgICAgIGlmIChkYXRhZGF0YS5ncy5nW2ldLmgudGEgPT0gJ0JPUycgJiYgZGF0YWRhdGEuZ3MuZ1tpXS5zdCA9PSAyKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBnYW1lU3RhcnRlZCA9IHRydWU7XG4gICAgICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmxvZygnZ2FtZXN0YXJ0ZWQnKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgfVxuICAgIHJldHVybiBnYW1lU3RhcnRlZDtcbn07XG4vKj09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuPSAgICAgICAgICAgIExPQUQgUk9TVEVSIElORk8gKGJ1aWxkIHJvc3Rlck9iaikgICAgICAgICAgICAgID1cbj09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PSovXG5mdW5jdGlvbiBsb2FkUm9zdGVyRGF0YShhd2F5VGVhbSwgYXdheVRuKSB7XG4gICAgdmFyIHJvc3RlciA9ICcnO1xuICAgIGpRdWVyeS5hamF4KHtcbiAgICAgICAgdXJsOiBmZWVkcy5jZWx0aWNzUm9zdGVyLFxuICAgICAgICBhc3luYzogZmFsc2UsXG4gICAgICAgIHN1Y2Nlc3M6IGZ1bmN0aW9uKGRhdGEpIHtcbiAgICAgICAgICAgIHJvc3RlciA9IGRhdGE7XG4gICAgICAgICAgICBmb3IgKHZhciBwcm9wZXJ0eSBpbiByb3N0ZXIudCkge1xuICAgICAgICAgICAgICAgIGlmIChwcm9wZXJ0eSAhPT0gJ3BsJykge1xuICAgICAgICAgICAgICAgICAgICByb3N0ZXJPYmouY2VsdGljc1twcm9wZXJ0eV0gPSByb3N0ZXIudFtwcm9wZXJ0eV07XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9LFxuICAgICAgICBlcnJvcjogZnVuY3Rpb24oKSB7fVxuICAgIH0pO1xuICAgIHZhciBhd2F5Um9zdGVyID0gJyc7XG4gICAgalF1ZXJ5LmFqYXgoe1xuICAgICAgICB1cmw6IGZlZWRzLmF3YXlSb3N0ZXIoYXdheVRuKSxcbiAgICAgICAgYXN5bmM6IGZhbHNlLFxuICAgICAgICBzdWNjZXNzOiBmdW5jdGlvbihkYXRhKSB7XG4gICAgICAgICAgICBhd2F5Um9zdGVyID0gZGF0YTtcbiAgICAgICAgICAgIGZvciAodmFyIHByb3BlcnR5IGluIGF3YXlSb3N0ZXIudCkge1xuICAgICAgICAgICAgICAgIGlmIChwcm9wZXJ0eSAhPT0gJ3BsJykge1xuICAgICAgICAgICAgICAgICAgICByb3N0ZXJPYmouYXdheVtwcm9wZXJ0eV0gPSBhd2F5Um9zdGVyLnRbcHJvcGVydHldO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfSxcbiAgICAgICAgZXJyb3I6IGZ1bmN0aW9uKCkge31cbiAgICB9KTtcbiAgICB2YXIgYmlvRGF0YSA9ICcnO1xuICAgIGpRdWVyeS5hamF4KHtcbiAgICAgICAgdXJsOiBmZWVkcy5iaW9EYXRhLFxuICAgICAgICBhc3luYzogZmFsc2UsXG4gICAgICAgIHN1Y2Nlc3M6IGZ1bmN0aW9uKGRhdGEpIHtcbiAgICAgICAgICAgIGJpb0RhdGEgPSBkYXRhO1xuICAgICAgICB9LFxuICAgICAgICBlcnJvcjogZnVuY3Rpb24oKSB7fVxuICAgIH0pO1xuICAgIGZvciAodmFyIGkgPSAwOyBpIDwgcm9zdGVyLnQucGwubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgdmFyIHBpZCA9IHJvc3Rlci50LnBsW2ldLnBpZDtcbiAgICAgICAgcm9zdGVyT2JqLmNlbHRpY3Mucm9zdGVyW3BpZF0gPSByb3N0ZXIudC5wbFtpXTtcbiAgICAgICAgZm9yICh2YXIgcHJvcGVydHkgaW4gYmlvRGF0YVtwaWRdKSB7XG4gICAgICAgICAgICByb3N0ZXJPYmouY2VsdGljcy5yb3N0ZXJbcGlkXS5iaW8gPSBiaW9EYXRhW3BpZF07XG4gICAgICAgIH07XG4gICAgICAgIGpRdWVyeS5hamF4KHtcbiAgICAgICAgICAgIHVybDogZmVlZHMucGxheWVyY2FyZChwaWQpLFxuICAgICAgICAgICAgYXN5bmM6IGZhbHNlLFxuICAgICAgICAgICAgc3VjY2VzczogZnVuY3Rpb24oZGF0YSkge1xuICAgICAgICAgICAgICAgIGlmIChkYXRhLnBsLmNhLmhhc093blByb3BlcnR5KCdzYScpKSB7XG4gICAgICAgICAgICAgICAgICAgIHJvc3Rlck9iai5jZWx0aWNzLnJvc3RlcltwaWRdLnN0YXRzID0gZGF0YS5wbC5jYS5zYVsoZGF0YS5wbC5jYS5zYS5sZW5ndGggLSAxKV07XG4gICAgICAgICAgICAgICAgICAgIHJvc3Rlck9iai5jZWx0aWNzLnJvc3RlcltwaWRdLnN0YXRzLnNhID0gZGF0YS5wbC5jYS5zYTtcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICByb3N0ZXJPYmouY2VsdGljcy5yb3N0ZXJbcGlkXS5zdGF0cyA9IGRhdGEucGwuY2E7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIHJvc3Rlck9iai5jZWx0aWNzLnJvc3RlcltwaWRdLnN0YXRzLnB0cyA9IHJvdW5kKHJvc3Rlck9iai5jZWx0aWNzLnJvc3RlcltwaWRdLnN0YXRzLnB0cyk7XG4gICAgICAgICAgICAgICAgcm9zdGVyT2JqLmNlbHRpY3Mucm9zdGVyW3BpZF0uc3RhdHMuYXN0ID0gcm91bmQocm9zdGVyT2JqLmNlbHRpY3Mucm9zdGVyW3BpZF0uc3RhdHMuYXN0KTtcbiAgICAgICAgICAgICAgICByb3N0ZXJPYmouY2VsdGljcy5yb3N0ZXJbcGlkXS5zdGF0cy5yZWIgPSByb3VuZChyb3N0ZXJPYmouY2VsdGljcy5yb3N0ZXJbcGlkXS5zdGF0cy5yZWIpO1xuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIGVycm9yOiBmdW5jdGlvbigpIHt9XG4gICAgICAgIH0pO1xuICAgIH1cbiAgICBmb3IgKHZhciBpID0gMDsgaSA8IGF3YXlSb3N0ZXIudC5wbC5sZW5ndGg7IGkrKykge1xuICAgICAgICB2YXIgcGlkID0gYXdheVJvc3Rlci50LnBsW2ldLnBpZDtcbiAgICAgICAgcm9zdGVyT2JqLmF3YXkucm9zdGVyW3BpZF0gPSBhd2F5Um9zdGVyLnQucGxbaV07XG4gICAgICAgIGpRdWVyeS5hamF4KHtcbiAgICAgICAgICAgIHVybDogZmVlZHMucGxheWVyY2FyZEF3YXkocGlkKSwgLy8gQ0hBTkdFIFBJRFxuICAgICAgICAgICAgYXN5bmM6IGZhbHNlLFxuICAgICAgICAgICAgc3VjY2VzczogZnVuY3Rpb24oZGF0YSkge1xuICAgICAgICAgICAgICAgIGlmIChkYXRhLnBsLmNhLmhhc093blByb3BlcnR5KCdzYScpKSB7XG4gICAgICAgICAgICAgICAgICAgIHJvc3Rlck9iai5hd2F5LnJvc3RlcltwaWRdLnN0YXRzID0gZGF0YS5wbC5jYS5zYVsoZGF0YS5wbC5jYS5zYS5sZW5ndGggLSAxKV07XG4gICAgICAgICAgICAgICAgICAgIHJvc3Rlck9iai5hd2F5LnJvc3RlcltwaWRdLnN0YXRzLnNhID0gZGF0YS5wbC5jYS5zYTtcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICByb3N0ZXJPYmouYXdheS5yb3N0ZXJbcGlkXS5zdGF0cyA9IGRhdGEucGwuY2E7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIHJvc3Rlck9iai5hd2F5LnJvc3RlcltwaWRdLnN0YXRzLnB0cyA9IHJvdW5kKHJvc3Rlck9iai5hd2F5LnJvc3RlcltwaWRdLnN0YXRzLnB0cyk7XG4gICAgICAgICAgICAgICAgcm9zdGVyT2JqLmF3YXkucm9zdGVyW3BpZF0uc3RhdHMuYXN0ID0gcm91bmQocm9zdGVyT2JqLmF3YXkucm9zdGVyW3BpZF0uc3RhdHMuYXN0KTtcbiAgICAgICAgICAgICAgICByb3N0ZXJPYmouYXdheS5yb3N0ZXJbcGlkXS5zdGF0cy5yZWIgPSByb3VuZChyb3N0ZXJPYmouYXdheS5yb3N0ZXJbcGlkXS5zdGF0cy5yZWIpO1xuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIGVycm9yOiBmdW5jdGlvbigpIHt9XG4gICAgICAgIH0pO1xuICAgIH1cbiAgICBmb3IgKHZhciB0ZWFtIGluIHJvc3Rlck9iaikge1xuICAgICAgICBmb3IgKHZhciBwbGF5ZXIgaW4gcm9zdGVyT2JqW3RlYW1dLnJvc3Rlcikge1xuICAgICAgICAgICAgZm9yICh2YXIgc3RhdCBpbiByb3N0ZXJPYmpbdGVhbV0ubGVhZGVycykge1xuICAgICAgICAgICAgICAgIHJvc3Rlck9ialt0ZWFtXS5sZWFkZXJzW3N0YXRdLnB1c2goW3Jvc3Rlck9ialt0ZWFtXS5yb3N0ZXJbcGxheWVyXS5mbi50b1VwcGVyQ2FzZSgpLCByb3N0ZXJPYmpbdGVhbV0ucm9zdGVyW3BsYXllcl0ubG4udG9VcHBlckNhc2UoKSwgcm9zdGVyT2JqW3RlYW1dLnJvc3RlcltwbGF5ZXJdLnN0YXRzW3N0YXRdLCByb3N0ZXJPYmpbdGVhbV0ucm9zdGVyW3BsYXllcl0ucGlkXSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9XG4gICAgZm9yICh2YXIgdGVhbSBpbiByb3N0ZXJPYmopIHtcbiAgICAgICAgZm9yICh2YXIgc3RhdCBpbiByb3N0ZXJPYmpbdGVhbV0ubGVhZGVycykge1xuICAgICAgICAgICAgcm9zdGVyT2JqW3RlYW1dLmxlYWRlcnNbc3RhdF0uc29ydChmdW5jdGlvbihhLCBiKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIGJbMl0gLSBhWzJdO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgIH1cbiAgICB9XG4gICAgY29uc29sZS5sb2coJ1NPUlRFRDonKTtcbiAgICBjb25zb2xlLmxvZyhyb3N0ZXJPYmopO1xufTtcblxuZnVuY3Rpb24gc3RhdHNOb3RBdmFpbGFibGUocGlkKSB7XG4gICAgcm9zdGVyT2JqW3BpZF0uc3RhdHMgPSB7fTtcbiAgICByb3N0ZXJPYmpbcGlkXS5zdGF0cy5zYSA9IFt7fV07XG4gICAgcm9zdGVyT2JqW3BpZF0uc3RhdHMuaGFzU3RhdHMgPSBmYWxzZTtcbiAgICB2YXIgY2FJbmRleCA9IFsnZ3AnLCAnZ3MnLCAnbWluJywgJ2ZncCcsICd0cHAnLCAnZnRwJywgJ29yZWInLCAnZHJlYicsICdyZWInLCAnYXN0JywgJ3N0bCcsICdibGsnLCAndG92JywgJ3BmJywgJ3B0cycsICdub3N0YXRzJ107XG4gICAgdmFyIHNhSW5kZXggPSBbJ3RpZCcsICd2YWwnLCAnZ3AnLCAnZ3MnLCAnbWluJywgJ2ZncCcsICd0cHAnLCAnZnRwJywgJ29yZWInLCAnZHJlYicsICdyZWInLCAnYXN0JywgJ3N0bCcsICdibGsnLCAndG92JywgJ3BmJywgJ3B0cycsICdzcGwnLCAndGEnLCAndG4nLCAndGMnXTtcbiAgICBmb3IgKHZhciBpID0gMDsgaSA8IHNhSW5kZXgubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgcm9zdGVyT2JqW3BpZF0uc3RhdHMuc2FbMF1bc2FJbmRleFtpXV0gPSBcIk4vQVwiO1xuICAgICAgICBpZiAoaSA9PT0gMSkge1xuICAgICAgICAgICAgcm9zdGVyT2JqW3BpZF0uc3RhdHMuc2FbMF1bc2FJbmRleFtpXV0gPSBwbGF5ZXJDYXJkWWVhci50b1N0cmluZygpLnN1YnN0cigyLCAyKSArIFwiLVwiICsgKHBsYXllckNhcmRZZWFyICsgMSkudG9TdHJpbmcoKS5zdWJzdHIoMiwgMik7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKGkgPT09IDE3KSB7XG4gICAgICAgICAgICByb3N0ZXJPYmpbcGlkXS5zdGF0cy5zYVswXVtzYUluZGV4W2ldXSA9IFtdO1xuICAgICAgICB9XG4gICAgICAgIGlmIChpID09PSAxOCkge1xuICAgICAgICAgICAgcm9zdGVyT2JqW3BpZF0uc3RhdHMuc2FbMF1bc2FJbmRleFtpXV0gPSAnQk9TJztcbiAgICAgICAgfVxuICAgIH1cbiAgICBmb3IgKHZhciBpID0gMDsgaSA8IGNhSW5kZXgubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgcm9zdGVyT2JqW3BpZF0uc3RhdHNbY2FJbmRleFtpXV0gPSBcIk4vQVwiO1xuICAgICAgICBpZiAoaSA9PT0gMTUpIHtcbiAgICAgICAgICAgIHJvc3Rlck9ialtwaWRdLnN0YXRzW2NhSW5kZXhbaV1dID0gdHJ1ZTtcbiAgICAgICAgfVxuICAgIH1cbn07XG5cbmZ1bmN0aW9uIGxvYWRHYW1lRGV0YWlsKGdpZCkge307XG5cbmZ1bmN0aW9uIGxvYWRBd2F5VGVhbURhdGEoKSB7fVxuLyo9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG49ICAgICAgICAgICAgUklHSFQgV1JBUCAgICAgICAgICAgID1cbj09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT0qL1xuZnVuY3Rpb24gcGxheWVyU3BvdGxpZ2h0KHJvc3Rlck9iaikge1xuICAgIC8qIDEgLSBXSElURSBMSU5FIEhPUklaVE9OQUwgKi9cbiAgICBzZXRUaW1lb3V0KGZ1bmN0aW9uKCkge1xuICAgICAgICBqUXVlcnkoJy53aGl0ZS1saW5lLmhvcml6b250YWwnKS5hZGRDbGFzcygndHJhbnNpdGlvbi0xJyk7XG4gICAgfSwgNTAwKTtcbiAgICBzZXRUaW1lb3V0KGZ1bmN0aW9uKCkge1xuICAgICAgICBqUXVlcnkoJy5zb2NpYWwtdG9wIC53aGl0ZS1saW5lLnZlcnRpY2FsOm50aC1jaGlsZChvZGQpJykuYWRkQ2xhc3MoJ3RyYW5zaXRpb24tMScpO1xuICAgICAgICBqUXVlcnkoJy5zb2NpYWwtYm90dG9tIC53aGl0ZS1saW5lLnZlcnRpY2FsOm50aC1jaGlsZChldmVuKScpLmFkZENsYXNzKCd0cmFuc2l0aW9uLTEnKTtcbiAgICB9LCA4MDApO1xuICAgIC8qIDJiIC0gV0hJVEUgTElORSBWRVJUSUNBTCAqL1xuICAgIHNldFRpbWVvdXQoZnVuY3Rpb24oKSB7XG4gICAgICAgIGpRdWVyeSgnLnNvY2lhbC10b3AgLndoaXRlLWxpbmUudmVydGljYWw6bnRoLWNoaWxkKGV2ZW4pJykuYWRkQ2xhc3MoJ3RyYW5zaXRpb24tMScpO1xuICAgICAgICBqUXVlcnkoJy5zb2NpYWwtYm90dG9tIC53aGl0ZS1saW5lLnZlcnRpY2FsOm50aC1jaGlsZChvZGQpJykuYWRkQ2xhc3MoJ3RyYW5zaXRpb24tMScpO1xuICAgIH0sIDEwMDApO1xuICAgIC8qIDMgLSBHRU5FUkFURSBBTkQgUkVWRUFMIFBMQVlFUiBCT1hFUyAqL1xuICAgIHNldFRpbWVvdXQoZnVuY3Rpb24oKSB7XG4gICAgICAgIGpRdWVyeSgnLnNvY2lhbC10b3AsIC5zb2NpYWwtYm90dG9tJykuYWRkQ2xhc3MoJ3RyYW5zaXRpb24tMScpO1xuICAgICAgICBqUXVlcnkoJy5wbGF5ZXItYm94LXdyYXAnKS5hZGRDbGFzcygndHJhbnNpdGlvbi0xJyk7XG4gICAgfSwgMTIwMCk7XG4gICAgLyogNCAtIEFQUEVORCBIRUFEU0hPVFMgKi9cbiAgICBzZXRUaW1lb3V0KGZ1bmN0aW9uKCkge1xuICAgICAgICBqUXVlcnkoJy5wbGF5ZXItYm94LXdyYXAnKS5hZGRDbGFzcygndHJhbnNpdGlvbi0yJyk7XG4gICAgICAgIGpRdWVyeSgnLnBsYXllci1ib3gnKS5hZGRDbGFzcygndHJhbnNpdGlvbi0xJyk7XG4gICAgICAgIHZhciBkZWxheSA9IDA7XG4gICAgICAgIHZhciBmb3JpbkNvdW50ZXIgPSAwO1xuICAgICAgICBmb3IgKHZhciBwbGF5ZXIgaW4gcm9zdGVyT2JqLmNlbHRpY3Mucm9zdGVyKSB7XG4gICAgICAgICAgICB2YXIgaGVhZHNob3QgPSAnaHR0cHM6Ly9hay1zdGF0aWMuY21zLm5iYS5jb20vd3AtY29udGVudC91cGxvYWRzL2hlYWRzaG90cy9uYmEvbGF0ZXN0LzEwNDB4NzYwLycgKyByb3N0ZXJPYmouY2VsdGljcy5yb3N0ZXJbcGxheWVyXS5waWQgKyAnLnBuZyc7XG4gICAgICAgICAgICBqUXVlcnkoJy5wbGF5ZXItYm94Om50aC1jaGlsZCgnICsgKGZvcmluQ291bnRlciArIDEpICsgJyknKS5hcHBlbmQoJzxpbWcgY2xhc3M9XCJhcHBlbmRlZCBoZWFkc2hvdFwiIHNyYz1cIicgKyBoZWFkc2hvdCArICdcIi8+Jyk7XG4gICAgICAgICAgICBqUXVlcnkoJy5wbGF5ZXItYm94Om50aC1jaGlsZCgnICsgKGZvcmluQ291bnRlciArIDEpICsgJyknKS5hdHRyKCdkYXRhLXBpZCcsIHJvc3Rlck9iai5jZWx0aWNzLnJvc3RlcltwbGF5ZXJdLnBpZCk7XG4gICAgICAgICAgICBqUXVlcnkoJy5wbGF5ZXItYm94IGltZycpLm9uKFwiZXJyb3JcIiwgZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICAgICAgalF1ZXJ5KHRoaXMpLmF0dHIoJ3NyYycsICdodHRwczovL2kuY2RuLnR1cm5lci5jb20vbmJhL25iYS8uZWxlbWVudC9tZWRpYS8yLjAvdGVhbXNpdGVzL2NlbHRpY3MvbWVkaWEvZ2VuZXJpYy1wbGF5ZXItbGlnaHRfNjAweDQzOC5wbmcnKTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgalF1ZXJ5KCcucGxheWVyLWJveDpudGgtY2hpbGQoJyArIChmb3JpbkNvdW50ZXIgKyAxKSArICcpIGltZycpLmRlbGF5KGRlbGF5KS5mYWRlVG8oMzAwLCAxKTtcbiAgICAgICAgICAgIGRlbGF5ICs9IDMwO1xuICAgICAgICAgICAgZm9yaW5Db3VudGVyKys7XG4gICAgICAgIH1cbiAgICB9LCAxNzAwKTtcbiAgICAvKiA1IC0gUExBWUVSIFNFTEVDVCAqL1xuICAgIHZhciBzZWxlY3RlZFBsYXllciA9ICcnO1xuICAgIHNldFRpbWVvdXQoZnVuY3Rpb24oKSB7XG4gICAgICAgIGpRdWVyeSgnLnBsYXllci1ib3gnKS5hZGRDbGFzcygndHJhbnNpdGlvbi0yJyk7XG4gICAgICAgIGpRdWVyeSgnLnBsYXllci1ib3g6bnRoLWNoaWxkKCcgKyAocGxheWVyU3BvdGxpZ2h0Q291bnRlcikgKyAnKScpLmFkZENsYXNzKCdzZWxlY3RlZCcpO1xuICAgICAgICBzZWxlY3RlZFBsYXllciA9IGpRdWVyeSgnLnBsYXllci1ib3g6bnRoLWNoaWxkKCcgKyAocGxheWVyU3BvdGxpZ2h0Q291bnRlcikgKyAnKScpLmF0dHIoJ2RhdGEtcGlkJyk7XG4gICAgICAgIHNldFRpbWVvdXQoZnVuY3Rpb24oKXtcbiAgICAgICAgICAgIGpRdWVyeSgnLnBsYXllci1ib3gnKS5ub3QoJy5yZXBsYWNlbWVudC5zZWxlY3RlZCcpLmFkZENsYXNzKCd0cmFuc2l0aW9uLTQnKTtcbiAgICAgICAgfSw4MDApO1xuICAgIH0sIDMwMDApO1xuICAgIC8qIDYgLSBQTEFZRVIgQk9YIEVYUEFORCAqL1xuICAgIHNldFRpbWVvdXQoZnVuY3Rpb24oKSB7XG4gICAgICAgIGpRdWVyeSgnLmJsb2NrLXdyYXAuc29jaWFsJykuYWRkQ2xhc3MoJ3RyYW5zaXRpb24tMycpO1xuICAgICAgICBqUXVlcnkoJy5wbGF5ZXItYm94LnJlcGxhY2VtZW50LnNlbGVjdGVkJykuYWRkQ2xhc3MoJ3RyYW5zaXRpb24tMycpO1xuICAgIH0sIDQwMDApO1xuICAgIC8qIDcgLSBTUE9UTElHSFQgSFRNTCAqL1xuICAgIHNldFRpbWVvdXQoZnVuY3Rpb24oKSB7XG4gICAgICAgIGdlbmVyYXRlVGltZWxpbmUoc2VsZWN0ZWRQbGF5ZXIpO1xuICAgICAgICBqUXVlcnkoJy5wbGF5ZXItYm94LnJlcGxhY2VtZW50LnNlbGVjdGVkJykuY2xvbmUoKS5hcHBlbmRUbygnLmJsb2NrLXdyYXAucGxheWVyLXNwb3RsaWdodCAudG9wLXdyYXAnKTtcbiAgICAgICAgalF1ZXJ5KCcucGxheWVyLXNwb3RsaWdodCAuc2VsZWN0ZWQnKS5hZGRDbGFzcygnLmFwcGVuZGVkJyk7XG4gICAgICAgIGpRdWVyeSgnLmJsb2NrLXdyYXAucGxheWVyLXNwb3RsaWdodCcpLmFkZENsYXNzKCd0cmFuc2l0aW9uLTEnKTtcbiAgICAgICAgalF1ZXJ5KCcuYmxvY2std3JhcC5zb2NpYWwnKS5hZGRDbGFzcygndHJhbnNpdGlvbi0xJyk7XG4gICAgICAgIHZhciBzdGF0cyA9IHJvc3Rlck9iai5jZWx0aWNzLnJvc3RlcltzZWxlY3RlZFBsYXllcl0uc3RhdHM7XG4gICAgICAgIGpRdWVyeSgnLnBsYXllci1zcG90bGlnaHQgLnRvcC13cmFwIC5wbGF5ZXItdG9wJykuYXBwZW5kKCc8aW1nIGNsYXNzPVwic2lsbyBhcHBlbmRlZFwiIHNyYz1cImh0dHA6Ly9pby5jbm4ubmV0L25iYS9uYmEvLmVsZW1lbnQvbWVkaWEvMi4wL3RlYW1zaXRlcy9jZWx0aWNzL21lZGlhL3NpbG8tNDY2eDU5MS0nICsgcm9zdGVyT2JqLmNlbHRpY3Mucm9zdGVyW3NlbGVjdGVkUGxheWVyXS5waWQgKyAnLnBuZ1wiIC8+PGRpdiBjbGFzcz1cInRvcCBhcHBlbmRlZFwiPjxkaXYgY2xhc3M9XCJwbGF5ZXItbmFtZS13cmFwXCI+PHAgY2xhc3M9XCJwbGF5ZXItbmFtZVwiPjxzcGFuPicgKyByb3N0ZXJPYmouY2VsdGljcy5yb3N0ZXJbc2VsZWN0ZWRQbGF5ZXJdLmZuLnRvVXBwZXJDYXNlKCkgKyAnPC9zcGFuPiA8YnI+ICcgKyByb3N0ZXJPYmouY2VsdGljcy5yb3N0ZXJbc2VsZWN0ZWRQbGF5ZXJdLmxuLnRvVXBwZXJDYXNlKCkgKyAnPC9wPjwvZGl2PjxwIGNsYXNzPVwicGxheWVyLW51bWJlclwiPicgKyByb3N0ZXJPYmouY2VsdGljcy5yb3N0ZXJbc2VsZWN0ZWRQbGF5ZXJdLm51bSArICc8L2JyPjxzcGFuPicgKyByb3N0ZXJPYmouY2VsdGljcy5yb3N0ZXJbc2VsZWN0ZWRQbGF5ZXJdLnBvcyArICc8L3NwYW4+PC9wPjwvZGl2PjxkaXYgY2xhc3M9XCJtaWRkbGUgYXBwZW5kZWRcIj48dWwgY2xhc3M9XCJpbmZvIGNsZWFyZml4XCI+PGxpPjxwPkFHRTxzcGFuIGNsYXNzPVwic20taGlkZVwiPjombmJzcDs8L3NwYW4+IDwvYnI+PHNwYW4gY2xhc3M9XCJpbmZvLXZhbHVlXCI+JyArIHBsYXllckFnZShyb3N0ZXJPYmouY2VsdGljcy5yb3N0ZXJbc2VsZWN0ZWRQbGF5ZXJdLmRvYikgKyAnPC9zcGFuPjwvcD48L2xpPjxsaT48cD5IVDxzcGFuIGNsYXNzPVwic20taGlkZVwiPjombmJzcDs8L3NwYW4+IDwvYnI+PHNwYW4gY2xhc3M9XCJpbmZvLXZhbHVlXCI+JyArIHJvc3Rlck9iai5jZWx0aWNzLnJvc3RlcltzZWxlY3RlZFBsYXllcl0uaHQgKyAnPC9zcGFuPjwvcD48L2xpPjxsaT48cD5XVDxzcGFuIGNsYXNzPVwic20taGlkZVwiPjombmJzcDs8L3NwYW4+IDwvYnI+PHNwYW4gY2xhc3M9XCJpbmZvLXZhbHVlXCI+JyArIHJvc3Rlck9iai5jZWx0aWNzLnJvc3RlcltzZWxlY3RlZFBsYXllcl0ud3QgKyAnPC9zcGFuPjwvcD48L2xpPjwvdWw+PC9kaXY+PGRpdiBjbGFzcz1cImJvdHRvbSBmdWxsIGNsZWFyZml4IHNtLWhpZGUgYXBwZW5kZWRcIj48dGFibGUgY2xhc3M9XCJhdmVyYWdlc1wiPjx0ciBjbGFzcz1cImF2ZXJhZ2VzLWxhYmVsc1wiPjx0ZD48cD5HUDwvcD48L3RkPjx0ZD48cD5QUEc8L3A+PC90ZD48dGQ+PHA+UlBHPC9wPjwvdGQ+PHRkPjxwPkFQRzwvcD48L3RkPjwvdHI+PHRyIGNsYXNzPVwiYXZlcmFnZXMtc2Vhc29uXCI+PHRkIGNsYXNzPVwiZ3BcIj48cD48L3A+PC90ZD48dGQgY2xhc3M9XCJwdHNcIj48cD48L3A+PC90ZD48dGQgY2xhc3M9XCJyZWJcIj48cD48L3A+PC90ZD48dGQgY2xhc3M9XCJhc3RcIj48cD48L3A+PC90ZD48L3RyPjwvdGFibGU+PC9kaXY+Jyk7XG4gICAgICAgIGpRdWVyeShcIi5wbGF5ZXItc3BvdGxpZ2h0IC5hdmVyYWdlcy1zZWFzb25cIikuaHRtbCgnPHRkIGNsYXNzPVwiYXBwZW5kZWRcIj48cD4nICsgc3RhdHMuc2FbMF0uZ3AgKyAnPC9wPjwvdGQ+PHRkIGNsYXNzPVwiYXBwZW5kZWRcIj48cD4nICsgc3RhdHMuc2FbMF0ucHRzICsgJzwvcD48L3RkPjx0ZCBjbGFzcz1cImFwcGVuZGVkXCI+PHA+JyArIHN0YXRzLnNhWzBdLnJlYiArICc8L3A+PC90ZD48dGQgY2xhc3M9XCJhcHBlbmRlZFwiPjxwPicgKyBzdGF0cy5zYVswXS5hc3QgKyAnPC9wPjwvdGQ+Jyk7XG4gICAgICAgIGpRdWVyeSgnLnBsYXllci1zcG90bGlnaHQgLnBsYXllci1uYW1lJykuZmFkZVRvKDIwMCwgMSk7XG4gICAgICAgIHZhciBwbGF5ZXJGYWN0cyA9IHJvc3Rlck9iai5jZWx0aWNzLnJvc3RlcltzZWxlY3RlZFBsYXllcl0uYmlvLnBlcnNvbmFsO1xuICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IDM7IGkrKykge1xuICAgICAgICAgICAgaWYgKGkgPD0gcm9zdGVyT2JqLmNlbHRpY3Mucm9zdGVyW3NlbGVjdGVkUGxheWVyXS5iaW8ucGVyc29uYWwubGVuZ3RoKXtcbiAgICAgICAgICAgICAgICBqUXVlcnkoJy5wbGF5ZXItc3BvdGxpZ2h0IC5ib3R0b20td3JhcCcpLmFwcGVuZCgnPGRpdiBjbGFzcz1cImR5ay1ib3ggYXBwZW5kZWRcIj48cD4nICsgcGxheWVyRmFjdHNbaV0gKyAnPC9wPjwvZGl2PicpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9O1xuICAgICAgICBqUXVlcnkoJy5wbGF5ZXItc3BvdGxpZ2h0IC5ib3R0b20td3JhcCcpLmFkZENsYXNzKCd0cmFuc2l0aW9uLTEnKTtcbiAgICAgICAgaWYgKGpRdWVyeSgnLnBsYXllci1zcG90bGlnaHQgLmJvdHRvbS13cmFwIC5keWstYm94JykubGVuZ3RoID4gMSkge1xuICAgICAgICAgICAgc2V0VGltZW91dChmdW5jdGlvbigpIHtcbiAgICAgICAgICAgICAgICBqUXVlcnkoJy5wbGF5ZXItc3BvdGxpZ2h0IC5ib3R0b20td3JhcCAuZHlrLWJveDpudGgtb2YtdHlwZSgyKScpLmFkZENsYXNzKCd0cmFuc2l0aW9uLTInKTtcbiAgICAgICAgICAgICAgICBqUXVlcnkoJy5wbGF5ZXItc3BvdGxpZ2h0IC5ib3R0b20td3JhcCAuZHlrLWJveDpudGgtb2YtdHlwZSgzKScpLmFkZENsYXNzKCd0cmFuc2l0aW9uLTEnKTtcbiAgICAgICAgICAgIH0sIDEwMDAwKTtcbiAgICAgICAgfVxuICAgICAgICBpZiAoalF1ZXJ5KCcucGxheWVyLXNwb3RsaWdodCAuYm90dG9tLXdyYXAgLmR5ay1ib3gnKS5sZW5ndGggPiAyKSB7XG4gICAgICAgICAgICBzZXRUaW1lb3V0KGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgICAgIGpRdWVyeSgnLnBsYXllci1zcG90bGlnaHQgLmJvdHRvbS13cmFwIC5keWstYm94Om50aC1vZi10eXBlKDMpJykuYWRkQ2xhc3MoJ3RyYW5zaXRpb24tMicpO1xuICAgICAgICAgICAgICAgIGpRdWVyeSgnLnBsYXllci1zcG90bGlnaHQgLmJvdHRvbS13cmFwIC5keWstYm94Om50aC1vZi10eXBlKDQpJykuYWRkQ2xhc3MoJ3RyYW5zaXRpb24tMScpO1xuICAgICAgICAgICAgfSwgMjAwMDApO1xuICAgICAgICB9XG4gICAgfSwgNTAwMCk7XG4gICAgLyogOCAtIFNQT1RMSUdIVCBTTElERSBJTiAqL1xuICAgIHNldFRpbWVvdXQoZnVuY3Rpb24oKSB7XG4gICAgICAgIGpRdWVyeSgnLnBsYXllci1zcG90bGlnaHQgLnBsYXllci10b3AgLnBsYXllci1uYW1lLCAucGxheWVyLXNwb3RsaWdodCAucGxheWVyLW5hbWUtd3JhcCwgLnBsYXllci1zcG90bGlnaHQgLmhlYWRzaG90LCAucGxheWVyLXNwb3RsaWdodCAuaW5mbywgLnBsYXllci1zcG90bGlnaHQgLnNpbG8sIC5wbGF5ZXItc3BvdGxpZ2h0IC5hdmVyYWdlcywgLnBsYXllci1zcG90bGlnaHQgLnBsYXllci1udW1iZXInKS5hZGRDbGFzcygndHJhbnNpdGlvbi0xJyk7XG4gICAgICAgIHNldFRpbWVvdXQoZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICBqUXVlcnkoJy5ibG9jay13cmFwLnBsYXllci1zcG90bGlnaHQgLnBsYXllci1ib3gnKS5yZW1vdmUoKTtcbiAgICAgICAgfSwgMTUwMDApO1xuICAgICAgICBpZiAocGxheWVyU3BvdGxpZ2h0Q291bnRlciA8IDE2KSB7XG4gICAgICAgICAgICBwbGF5ZXJTcG90bGlnaHRDb3VudGVyKys7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBwbGF5ZXJTcG90bGlnaHRDb3VudGVyID0gMDtcbiAgICAgICAgfVxuICAgIH0sIDYwMDApO1xuICAgIC8qIDkgLSBTUE9UTElHSFQgU0xJREUgT1VUICovXG4gICAgc2V0VGltZW91dChmdW5jdGlvbigpIHtcbiAgICAgICAgalF1ZXJ5KCcucGxheWVyLXNwb3RsaWdodCAuYm90dG9tLXdyYXAsIC5wbGF5ZXItc3BvdGxpZ2h0IC50b3Atd3JhcCcpLmFkZENsYXNzKCd0cmFuc2l0aW9uLTInKTtcbiAgICB9LCA0MDAwMCk7XG4gICAgLyogMTAgLSBET05FLiBSRU1PVkUgKi9cbiAgICBzZXRUaW1lb3V0KGZ1bmN0aW9uKCkge1xuICAgICAgICBqUXVlcnkoJyAucGxheWVyLXNwb3RsaWdodCAuYXBwZW5kZWQnKS5yZW1vdmUoKTtcbiAgICAgICAgalF1ZXJ5KCcgLnBsYXllci1zcG90bGlnaHQgLnNlbGVjdGVkJykucmVtb3ZlQ2xhc3MoJ3NlbGVjdGVkJyk7XG4gICAgICAgIGZvciAodmFyIGkgPSAxOyBpIDwgMTA7IGkrKykge1xuICAgICAgICAgICAgalF1ZXJ5KCcucmlnaHQtd3JhcCAudHJhbnNpdGlvbi0nICsgaSkucmVtb3ZlQ2xhc3MoJ3RyYW5zaXRpb24tJyArIGkpO1xuICAgICAgICB9XG4gICAgfSwgNDUwMDApO1xufVxuXG5mdW5jdGlvbiBsZWFkZXJzKGdpZCwgZ2FtZVN0YXJ0ZWQpIHtcbiAgICBqUXVlcnkoJy5sZWFkZXJzJykuYWRkQ2xhc3MoJ2FjdGl2ZScpO1xuICAgIHZhciBnYW1lRGV0YWlsID0gJyc7XG4gICAgdmFyIGRldGFpbEF2YWlsYWJsZSA9IGZhbHNlO1xuICAgIHZhciBsZWFkZXJzVGl0bGUgPSAnU0VBU09OIExFQURFUlMnO1xuICAgIGlmIChjaGVja0dhbWVTdGF0dXMoKSkge1xuICAgICAgICBsZWFkZXJzVGl0bGUgPSAnR0FNRSBMRUFERVJTJztcbiAgICAgICAgalF1ZXJ5LmFqYXgoe1xuICAgICAgICAgICAgdXJsOiBmZWVkcy5nYW1lZGV0YWlsKGdpZCksXG4gICAgICAgICAgICBhc3luYzogZmFsc2UsXG4gICAgICAgICAgICBzdWNjZXNzOiBmdW5jdGlvbihkYXRhKSB7XG4gICAgICAgICAgICAgICAgdmFyIHRlYW1MaW5lU2NvcmUgPSBbXCJobHNcIiwgXCJ2bHNcIl07XG4gICAgICAgICAgICAgICAgZm9yICh2YXIgeCA9IDA7IHggPCB0ZWFtTGluZVNjb3JlLmxlbmd0aDsgeCsrKSB7XG4gICAgICAgICAgICAgICAgICAgIHZhciBzdGF0cyA9IGRhdGEuZ1t0ZWFtTGluZVNjb3JlW3hdXTtcbiAgICAgICAgICAgICAgICAgICAgdmFyIHRlYW0gPSAnJztcbiAgICAgICAgICAgICAgICAgICAgaWYgKHN0YXRzLnRhID09PSAnQk9TJykge1xuICAgICAgICAgICAgICAgICAgICAgICAgdGVhbSA9ICdjZWx0aWNzJztcbiAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRlYW0gPSAnYXdheSc7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgZm9yICh2YXIgc3RhdCBpbiByb3N0ZXJPYmpbdGVhbV0ubGVhZGVycykge1xuICAgICAgICAgICAgICAgICAgICAgICAgcm9zdGVyT2JqW3RlYW1dLmxlYWRlcnNbc3RhdF0gPSBbXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgWyctLScsICctLScsIDAsICctLSddLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIFsnLS0nLCAnLS0nLCAwLCAnLS0nXSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBbJy0tJywgJy0tJywgMCwgJy0tJ11cbiAgICAgICAgICAgICAgICAgICAgICAgIF07XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgZm9yICh2YXIgcCA9IDA7IHAgPCBzdGF0cy5wc3RzZy5sZW5ndGg7IHArKykge1xuICAgICAgICAgICAgICAgICAgICAgICAgZm9yICh2YXIgc3RhdCBpbiByb3N0ZXJPYmpbdGVhbV0ubGVhZGVycykge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJvc3Rlck9ialt0ZWFtXS5sZWFkZXJzW3N0YXRdLnB1c2goW3N0YXRzLnBzdHNnW3BdLmZuLnRvVXBwZXJDYXNlKCksIHN0YXRzLnBzdHNnW3BdLmxuLnRvVXBwZXJDYXNlKCksIHN0YXRzLnBzdHNnW3BdW3N0YXRdLCBzdGF0cy5wc3RzZ1twXS5waWRdKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgIHJvc3Rlck9ialt0ZWFtXS5sZWFkZXJzW3N0YXRdLnNvcnQoZnVuY3Rpb24oYSwgYikge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBhWzJdIC0gYlsyXTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIGZvciAodmFyIHRlYW0gaW4gcm9zdGVyT2JqKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBmb3IgKHZhciBzdGF0IGluIHJvc3Rlck9ialt0ZWFtXS5sZWFkZXJzKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcm9zdGVyT2JqW3RlYW1dLmxlYWRlcnNbc3RhdF0uc29ydChmdW5jdGlvbihhLCBiKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBiWzJdIC0gYVsyXTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmxvZygnU09SVEVEOicpO1xuICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhyb3N0ZXJPYmopO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgfVxuICAgIGpRdWVyeSgnLmxlYWRlcnMtdGl0bGUnKS5odG1sKGxlYWRlcnNUaXRsZSk7XG4gICAgZm9yICh2YXIgdGVhbSBpbiByb3N0ZXJPYmopIHtcbiAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCAzOyBpKyspIHtcbiAgICAgICAgICAgIGZvciAodmFyIHN0YXQgaW4gcm9zdGVyT2JqW3RlYW1dLmxlYWRlcnMpIHtcbiAgICAgICAgICAgICAgICAvLyBMRUFERVIgU1RBVCBWQUxVRVxuICAgICAgICAgICAgICAgIGpRdWVyeSgnLmxlYWRlci1zZWN0aW9uOm50aC1vZi10eXBlKCcgKyAoaSArIDIpICsgJykgLicgKyBzdGF0ICsgJy4nICsgdGVhbSArICcgLnN0YXQnKS5odG1sKCc8c3BhbiBjbGFzcz1cImFwcGVuZGVkICcgKyByb3N0ZXJPYmpbdGVhbV0udGEgKyAnXCI+JyArIHJvc3Rlck9ialt0ZWFtXS5sZWFkZXJzW3N0YXRdW2ldWzJdICsgJzwvc3Bhbj4gJyArIHN0YXQudG9VcHBlckNhc2UoKSk7XG4gICAgICAgICAgICAgICAgLy8gTEVBREVSIE5BTUVcbiAgICAgICAgICAgICAgICBpZiAocm9zdGVyT2JqW3RlYW1dLmxlYWRlcnNbc3RhdF1baV1bMF0ubGVuZ3RoICsgcm9zdGVyT2JqW3RlYW1dLmxlYWRlcnNbc3RhdF1baV1bMV0ubGVuZ3RoID49IDE0KSB7XG4gICAgICAgICAgICAgICAgICAgIHJvc3Rlck9ialt0ZWFtXS5sZWFkZXJzW3N0YXRdW2ldWzBdID0gcm9zdGVyT2JqW3RlYW1dLmxlYWRlcnNbc3RhdF1baV1bMF0uc3Vic3RyKDAsIDEpICsgJy4nO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBqUXVlcnkoJy5sZWFkZXItc2VjdGlvbjpudGgtb2YtdHlwZSgnICsgKGkgKyAyKSArICcpIC4nICsgc3RhdCArICcuJyArIHRlYW0gKyAnIC5uYW1lJykuaHRtbCgnPHNwYW4gY2xhc3M9XCJhcHBlbmRlZFwiPicgKyByb3N0ZXJPYmpbdGVhbV0ubGVhZGVyc1tzdGF0XVtpXVswXSArICc8L3NwYW4+ICcgKyByb3N0ZXJPYmpbdGVhbV0ubGVhZGVyc1tzdGF0XVtpXVsxXSk7XG4gICAgICAgICAgICAgICAgLy8gTEVBREVSIEhFQURTSE9UXG4gICAgICAgICAgICAgICAgalF1ZXJ5KCcubGVhZGVyLXNlY3Rpb246bnRoLW9mLXR5cGUoJyArIChpICsgMikgKyAnKSAuJyArIHN0YXQgKyAnLicgKyB0ZWFtICsgJyAuaGVhZHNob3QnKS5hdHRyKCdzcmMnLCAnaHR0cHM6Ly9hay1zdGF0aWMuY21zLm5iYS5jb20vd3AtY29udGVudC91cGxvYWRzL2hlYWRzaG90cy9uYmEvbGF0ZXN0LzEwNDB4NzYwLycgKyByb3N0ZXJPYmpbdGVhbV0ubGVhZGVyc1tzdGF0XVtpXVszXSArICcucG5nJyk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9XG4gICAgc2V0VGltZW91dChmdW5jdGlvbigpIHtcbiAgICAgICAgalF1ZXJ5KCcubGVhZGVycywgLmxlYWRlcnMgLmJsb2NrLWlubmVyJykuYWRkQ2xhc3MoJ3RyYW5zaXRpb24tMScpO1xuICAgIH0sIDEwMCk7XG4gICAgc2V0VGltZW91dChmdW5jdGlvbigpIHtcbiAgICAgICAgalF1ZXJ5KCcubGVhZGVycyAubGVhZGVyLXNlY3Rpb24nKS5hZGRDbGFzcygndHJhbnNpdGlvbi0xJyk7XG4gICAgICAgIGpRdWVyeSgnLmxlYWRlci1zdWJzZWN0aW9uLmJvdHRvbSBwOm50aC1vZi10eXBlKDEpJykuYWRkQ2xhc3MoJ3RyYW5zaXRpb24tMScpO1xuICAgICAgICBqUXVlcnkoJy5sZWFkZXJzIC5sZWFkZXItc2VjdGlvbiAudW5kZXJsaW5lLCAubGVhZGVycyAubGVhZGVyLXN1YnNlY3Rpb24udG9wJykuYWRkQ2xhc3Mocm9zdGVyT2JqLmNlbHRpY3MudGEgKyAnLWJnJyk7XG4gICAgfSwgMTEwMCk7XG4gICAgc2V0VGltZW91dChmdW5jdGlvbigpIHtcbiAgICAgICAgalF1ZXJ5KCcubGVhZGVycyAubGVhZGVyLXNlY3Rpb24nKS5hZGRDbGFzcygndHJhbnNpdGlvbi0yJyk7XG4gICAgICAgIGpRdWVyeSgnLmxlYWRlcnMgLmJsb2NrLWlubmVyJykuYWRkQ2xhc3MoJ3RyYW5zaXRpb24tMicpO1xuICAgIH0sIDIxMDApO1xuICAgIHZhciB0cmFuc2l0aW9uQ291bnRlciA9IDE7XG4gICAgc2V0VGltZW91dChmdW5jdGlvbigpIHtcbiAgICAgICAgZm9yIChsZXQgaSA9IDE7IGkgPCA2OyBpKyspIHtcbiAgICAgICAgICAgIHNldFRpbWVvdXQoZnVuY3Rpb24obnVtYmVyU3RyaW5nKSB7XG4gICAgICAgICAgICAgICAgalF1ZXJ5KCcubGVhZGVycyAubGVhZGVyLXNlY3Rpb24gLmxlYWRlci1zdGF0LXdyYXAnKS5hZGRDbGFzcygndHJhbnNpdGlvbi0nICsgaSk7XG4gICAgICAgICAgICAgICAgalF1ZXJ5KCcubGVhZGVycyAubGVhZGVyLXNlY3Rpb24gLnVuZGVybGluZSwgLmxlYWRlcnMgLmxlYWRlci1zdWJzZWN0aW9uLnRvcCcpLnJlbW92ZUNsYXNzKHJvc3Rlck9iai5jZWx0aWNzLnRhICsgJy1iZycpO1xuICAgICAgICAgICAgICAgIGpRdWVyeSgnLmxlYWRlcnMgLmxlYWRlci1zZWN0aW9uIC51bmRlcmxpbmUsIC5sZWFkZXJzIC5sZWFkZXItc3Vic2VjdGlvbi50b3AnKS5hZGRDbGFzcyhyb3N0ZXJPYmouYXdheS50YSArICctYmcnKTtcbiAgICAgICAgICAgICAgICBpZiAodHJhbnNpdGlvbkNvdW50ZXIgJSAyID09IDApIHtcbiAgICAgICAgICAgICAgICAgICAgc2V0VGltZW91dChmdW5jdGlvbigpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGpRdWVyeSgnLmxlYWRlcnMgLmxlYWRlci1zZWN0aW9uIC51bmRlcmxpbmUsIC5sZWFkZXJzIC5sZWFkZXItc3Vic2VjdGlvbi50b3AnKS5yZW1vdmVDbGFzcyhyb3N0ZXJPYmouYXdheS50YSArICctYmcnKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGpRdWVyeSgnLmxlYWRlcnMgLmxlYWRlci1zZWN0aW9uIC51bmRlcmxpbmUsIC5sZWFkZXJzIC5sZWFkZXItc3Vic2VjdGlvbi50b3AnKS5hZGRDbGFzcyhyb3N0ZXJPYmouY2VsdGljcy50YSArICctYmcnKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGpRdWVyeSgnLmxlYWRlci1zdWJzZWN0aW9uLmJvdHRvbSBwJykucmVtb3ZlQ2xhc3MoJ3RyYW5zaXRpb24tMScpO1xuICAgICAgICAgICAgICAgICAgICAgICAgalF1ZXJ5KCcubGVhZGVycyAubGVhZGVyLXNlY3Rpb24gLnVuZGVybGluZScpLmFkZENsYXNzKCd0cmFuc2l0aW9uLScgKyAoaSAvIDIpKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGpRdWVyeSgnLmxlYWRlci1zdWJzZWN0aW9uLmJvdHRvbSBwOm50aC1vZi10eXBlKCcgKyAoaSAtIChpIC8gMikgKyAxKSArICcpJykuYWRkQ2xhc3MoJ3RyYW5zaXRpb24tMScpOyAvLyBsb2xcbiAgICAgICAgICAgICAgICAgICAgfSwgMjAwKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgdHJhbnNpdGlvbkNvdW50ZXIrKztcbiAgICAgICAgICAgIH0sIDcwMDAgKiBpKTtcbiAgICAgICAgfVxuICAgIH0sIDIxMDApO1xuICAgIHNldFRpbWVvdXQoZnVuY3Rpb24oKSB7XG4gICAgICAgIGpRdWVyeSgnLmxlYWRlcnMgLmxlYWRlci1zZWN0aW9uLCAubGVhZGVycyAubGVhZGVyLXN1YnNlY3Rpb24nKS5hZGRDbGFzcygndHJhbnNpdGlvbi0zJyk7XG4gICAgfSwgNDQxMDApO1xuICAgIHNldFRpbWVvdXQoZnVuY3Rpb24oKSB7XG4gICAgICAgIGpRdWVyeSgnLmxlYWRlcnMnKS5hZGRDbGFzcygndHJhbnNpdGlvbi0yJyk7XG4gICAgfSwgNDQxMDApO1xuICAgIHNldFRpbWVvdXQoZnVuY3Rpb24oKSB7XG4gICAgICAgIGpRdWVyeSgnLmxlYWRlcnMgLmxlYWRlci1zZWN0aW9uIC51bmRlcmxpbmUsIC5sZWFkZXJzIC5sZWFkZXItc3Vic2VjdGlvbi50b3AnKS5yZW1vdmVDbGFzcyhyb3N0ZXJPYmouYXdheS50YSArICctYmcnKTtcbiAgICAgICAgalF1ZXJ5KCcubGVhZGVycyAubGVhZGVyLXNlY3Rpb24gLnVuZGVybGluZSwgLmxlYWRlcnMgLmxlYWRlci1zdWJzZWN0aW9uLnRvcCcpLmFkZENsYXNzKHJvc3Rlck9iai5jZWx0aWNzLnRhICsgJy1iZycpO1xuICAgICAgICBqUXVlcnkoJy5sZWFkZXJzJykucmVtb3ZlQ2xhc3MoJ2FjdGl2ZScpO1xuICAgICAgICBqUXVlcnkoJy5sZWFkZXJzIC5hcHBlbmRlZCcpLnJlbW92ZSgpO1xuICAgICAgICBmb3IgKHZhciBpID0gMTsgaSA8IDEwOyBpKyspIHtcbiAgICAgICAgICAgIGpRdWVyeSgnLmxlYWRlcnMgLnRyYW5zaXRpb24tJyArIGkgKyAnLCAubGVhZGVycy50cmFuc2l0aW9uLScgKyBpKS5yZW1vdmVDbGFzcygndHJhbnNpdGlvbi0nICsgaSk7XG4gICAgICAgIH1cbiAgICB9LCA0NTAwMCk7XG59O1xuXG5mdW5jdGlvbiBzb2NpYWwoKSB7XG4gICAgalF1ZXJ5KCcuc29jaWFsIC50ZXh0LXdyYXAsIC5zb2NpYWwgLnVuZGVybGluZScpLnJlbW92ZUNsYXNzKCd0cmFuc2l0aW9uLTEnKTtcbiAgICBqUXVlcnkoJy5zb2NpYWwnKS5hZGRDbGFzcygnYWN0aXZlJyk7XG4gICAgc2V0VGltZW91dChmdW5jdGlvbigpIHtcbiAgICAgICAgalF1ZXJ5KCcuc29jaWFsIC50ZXh0LXdyYXAsIC5zb2NpYWwgLnVuZGVybGluZScpLmFkZENsYXNzKCd0cmFuc2l0aW9uLTEnKTtcbiAgICB9LCAxNTAwMCk7XG4gICAgc2V0VGltZW91dChmdW5jdGlvbigpIHtcbiAgICAgICAgalF1ZXJ5KCcuc29jaWFsIC5hcHBlbmRlZCcpLnJlbW92ZSgpO1xuICAgICAgICBqUXVlcnkoJy5zb2NpYWwgLnNlbGVjdGVkJykucmVtb3ZlQ2xhc3MoJ3NlbGVjdGVkJyk7XG4gICAgICAgIGpRdWVyeSgnLnNvY2lhbCcpLnJlbW92ZUNsYXNzKCdhY3RpdmUnKTtcbiAgICB9LCAyMDAwMCk7XG59O1xuLypmdW5jdGlvbiBtb2JpbGVBcHBJbml0KCkge1xuICAgIHZhciBjb3VudGVyID0gMTtcbiAgICBzZXRJbnRlcnZhbChmdW5jdGlvbigpIHtcbiAgICAgICAgalF1ZXJ5KCcuYXBwIC5ib3R0b20td3JhcCBpbWcnKS5yZW1vdmVDbGFzcygnYWN0aXZlJyk7XG4gICAgICAgIGpRdWVyeSgnLmFwcCAuZmVhdHVyZS1saXN0IHAnKS5yZW1vdmVDbGFzcygnYWN0aXZlJyk7XG4gICAgICAgIGpRdWVyeSgnLmFwcCAuZmVhdHVyZS1saXN0IHA6bnRoLW9mLXR5cGUoJyArIGNvdW50ZXIgKyAnKScpLmFkZENsYXNzKCdhY3RpdmUnKTtcbiAgICAgICAgalF1ZXJ5KCcuYXBwIC5ib3R0b20td3JhcCBpbWc6bnRoLW9mLXR5cGUoJyArIGNvdW50ZXIgKyAnKScpLmFkZENsYXNzKCdhY3RpdmUnKTtcbiAgICAgICAgaWYgKGNvdW50ZXIgPT0gNSkge1xuICAgICAgICAgICAgY291bnRlciA9IDE7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBjb3VudGVyKys7XG4gICAgICAgIH1cbiAgICB9LCAyMDAwKTtcbn07XG4qL1xuZnVuY3Rpb24gbW9iaWxlQXBwKCkge1xuICAgIGpRdWVyeSgnLmFwcCAuYmxvY2staW5uZXInKS5yZW1vdmVDbGFzcygndHJhbnNpdGlvbi0xJyk7XG4gICAgalF1ZXJ5KCcuYXBwJykuYWRkQ2xhc3MoJ2FjdGl2ZScpO1xuICAgIHZhciBjb3VudGVyID0gMTtcbiAgICB2YXIgcm90YXRlU2NyZWVucyA9IHNldEludGVydmFsKGZ1bmN0aW9uKCkge1xuICAgICAgICBqUXVlcnkoJy5hcHAgLmJvdHRvbS13cmFwIGltZycpLnJlbW92ZUNsYXNzKCdhY3RpdmUnKTtcbiAgICAgICAgalF1ZXJ5KCcuYXBwIC5mZWF0dXJlLWxpc3QgcCcpLnJlbW92ZUNsYXNzKCdhY3RpdmUnKTtcbiAgICAgICAgalF1ZXJ5KCcuYXBwIC5mZWF0dXJlLWxpc3QgcDpudGgtb2YtdHlwZSgnICsgY291bnRlciArICcpJykuYWRkQ2xhc3MoJ2FjdGl2ZScpO1xuICAgICAgICBqUXVlcnkoJy5hcHAgLmJvdHRvbS13cmFwIGltZzpudGgtb2YtdHlwZSgnICsgY291bnRlciArICcpJykuYWRkQ2xhc3MoJ2FjdGl2ZScpO1xuICAgICAgICBpZiAoY291bnRlciA9PSA1KSB7XG4gICAgICAgICAgICBjb3VudGVyID0gMTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGNvdW50ZXIrKztcbiAgICAgICAgfVxuICAgIH0sIDQwMDApO1xuICAgIHJvdGF0ZVNjcmVlbnM7XG4gICAgc2V0VGltZW91dChmdW5jdGlvbigpIHtcbiAgICAgICAgalF1ZXJ5KCcuYXBwIC5ibG9jay1pbm5lcicpLmFkZENsYXNzKCd0cmFuc2l0aW9uLTEnKTtcbiAgICB9LCAyNDAwMCk7XG4gICAgc2V0VGltZW91dChmdW5jdGlvbigpIHtcbiAgICAgICAgalF1ZXJ5KCcuYXBwJykucmVtb3ZlQ2xhc3MoJ2FjdGl2ZScpO1xuICAgICAgICBjbGVhckludGVydmFsKHJvdGF0ZVNjcmVlbnMpO1xuICAgIH0sIDI1MDAwKTtcbn07XG5cbmZ1bmN0aW9uIGFsbFN0YXIoKXtcbiAgICBqUXVlcnkoJy5hbGwtc3RhciAuYmxvY2staW5uZXInKS5yZW1vdmVDbGFzcygndHJhbnNpdGlvbi0xJyk7XG4gICAgalF1ZXJ5KCcuYWxsLXN0YXInKS5hZGRDbGFzcygnYWN0aXZlJyk7XG4vKiAgICBzZXRUaW1lb3V0KGZ1bmN0aW9uKCkge1xuICAgICAgICBqUXVlcnkoJy5hbGwtc3RhciAuYmxvY2staW5uZXInKS5hZGRDbGFzcygndHJhbnNpdGlvbi0xJyk7XG4gICAgfSwgMjQwMDApO1xuICAgIHNldFRpbWVvdXQoZnVuY3Rpb24oKSB7XG4gICAgICAgIGpRdWVyeSgnLmFsbC1zdGFyJykucmVtb3ZlQ2xhc3MoJ2FjdGl2ZScpO1xuICAgICAgICBjbGVhckludGVydmFsKHJvdGF0ZVNjcmVlbnMpO1xuICAgIH0sIDI1MDAwKTsqL1xufVxuLyo9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbj0gICAgICAgICAgICBMRUZUIFdSQVAgICAgICAgICAgICA9XG49PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT0qL1xuZnVuY3Rpb24gbGVmdFdyYXAoKSB7XG4gICAgc2V0SW50ZXJ2YWwoZnVuY3Rpb24oKSB7XG4gICAgICAgIGlmIChqUXVlcnkoJy5sZWZ0LXdyYXAgLnN0YW5kaW5ncycpLmhhc0NsYXNzKCd0cmFuc2l0aW9uLTEnKSkge1xuICAgICAgICAgICAgalF1ZXJ5KCcubGVmdC13cmFwIC5zdGFuZGluZ3MnKS5yZW1vdmVDbGFzcygndHJhbnNpdGlvbi0xJyk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBqUXVlcnkoJy5sZWZ0LXdyYXAgLnN0YW5kaW5ncycpLmFkZENsYXNzKCd0cmFuc2l0aW9uLTEnKTtcbiAgICAgICAgfVxuICAgICAgICBpZiAoalF1ZXJ5KCcubGVmdC13cmFwIC5zY29yZXMtYW5kLWxlYWRlcnMnKS5oYXNDbGFzcygndHJhbnNpdGlvbi0xJykpIHtcbiAgICAgICAgICAgIGpRdWVyeSgnLmxlZnQtd3JhcCAuc2NvcmVzLWFuZC1sZWFkZXJzJykucmVtb3ZlQ2xhc3MoJ3RyYW5zaXRpb24tMScpO1xuICAgICAgICAgICAgdXBkYXRlTGVhZ3VlU2NvcmVzKCk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBqUXVlcnkoJy5sZWZ0LXdyYXAgLnNjb3Jlcy1hbmQtbGVhZGVycycpLmFkZENsYXNzKCd0cmFuc2l0aW9uLTEnKTtcbiAgICAgICAgfVxuICAgIH0sIDUwMDAwKTtcbn1cblxuZnVuY3Rpb24gc3RhbmRpbmdzSW5pdChhd2F5VGVhbSkge1xuICAgIGpRdWVyeS5hamF4KHtcbiAgICAgICAgdXJsOiBmZWVkcy5zdGFuZGluZ3MsXG4gICAgICAgIGFzeW5jOiBmYWxzZSxcbiAgICAgICAgc3VjY2VzczogZnVuY3Rpb24oc3RhbmRpbmdzRGF0YSkge1xuICAgICAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBzdGFuZGluZ3NEYXRhLnN0YS5jby5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgICAgIGZvciAobGV0IHggPSAwOyB4IDwgc3RhbmRpbmdzRGF0YS5zdGEuY29baV0uZGkubGVuZ3RoOyB4KyspIHtcbiAgICAgICAgICAgICAgICAgICAgZm9yIChsZXQgdCA9IDA7IHQgPCBzdGFuZGluZ3NEYXRhLnN0YS5jb1tpXS5kaVt4XS50Lmxlbmd0aDsgdCsrKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICB2YXIgY29uZmVyZW5jZXMgPSBbJy5lYXN0JywgJy53ZXN0J107XG4gICAgICAgICAgICAgICAgICAgICAgICB2YXIgcGxhY2UgPSBzdGFuZGluZ3NEYXRhLnN0YS5jb1tpXS5kaVt4XS50W3RdLnNlZTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHZhciBzZWVkID0gJyc7XG4gICAgICAgICAgICAgICAgICAgICAgICB2YXIgYWN0aXZlU3RhdHVzID0gJyc7XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoc3RhbmRpbmdzRGF0YS5zdGEuY29baV0uZGlbeF0udFt0XS5zZWUgPD0gOCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHNlZWQgPSBzdGFuZGluZ3NEYXRhLnN0YS5jb1tpXS5kaVt4XS50W3RdLnNlZTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChzdGFuZGluZ3NEYXRhLnN0YS5jb1tpXS5kaVt4XS50W3RdLnRhID09ICdCT1MnKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgYWN0aXZlU3RhdHVzID0gJ2FjdGl2ZSc7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoc3RhbmRpbmdzRGF0YS5zdGEuY29baV0uZGlbeF0udFt0XS50YSA9PSBhd2F5VGVhbSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGFjdGl2ZVN0YXR1cyA9ICdhY3RpdmUtYXdheSc7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICB2YXIgcm93SFRNTCA9ICc8ZGl2IGNsYXNzPVwicGxhY2VcIj4nICsgc2VlZCArICc8L2Rpdj48ZGl2IGNsYXNzPVwibG9nby13cmFwXCI+PGltZyBjbGFzcz1cImxvZ29cIiBzcmM9aHR0cDovL2kuY2RuLnR1cm5lci5jb20vbmJhL25iYS9hc3NldHMvbG9nb3MvdGVhbXMvcHJpbWFyeS93ZWIvJyArIHN0YW5kaW5nc0RhdGEuc3RhLmNvW2ldLmRpW3hdLnRbdF0udGEgKyAnLnN2Zz48L2Rpdj48ZGl2IGNsYXNzPVwidGVhbSArICcgKyBzdGFuZGluZ3NEYXRhLnN0YS5jb1tpXS5kaVt4XS50W3RdLnRhICsgJ1wiPicgKyBzdGFuZGluZ3NEYXRhLnN0YS5jb1tpXS5kaVt4XS50W3RdLnRhICsgJzwvZGl2PjxkaXYgY2xhc3M9XCJ3aW5zXCI+JyArIHN0YW5kaW5nc0RhdGEuc3RhLmNvW2ldLmRpW3hdLnRbdF0udyArICc8L2Rpdj48ZGl2IGNsYXNzPVwibG9zc2VzXCI+JyArIHN0YW5kaW5nc0RhdGEuc3RhLmNvW2ldLmRpW3hdLnRbdF0ubCArICc8L2Rpdj48ZGl2IGNsYXNzPVwiZ2FtZXMtYmVoaW5kXCI+JyArIHN0YW5kaW5nc0RhdGEuc3RhLmNvW2ldLmRpW3hdLnRbdF0uZ2IgKyAnPC9kaXY+JztcbiAgICAgICAgICAgICAgICAgICAgICAgIGpRdWVyeShjb25mZXJlbmNlc1tpXSArICcgPiBkaXY6bnRoLWNoaWxkKCcgKyAocGxhY2UgKyAxKSArICcpJykuaHRtbChyb3dIVE1MKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGpRdWVyeShjb25mZXJlbmNlc1tpXSArICcgPiBkaXY6bnRoLWNoaWxkKCcgKyAocGxhY2UgKyAxKSArICcpJykuYWRkQ2xhc3MoYWN0aXZlU3RhdHVzKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH0pO1xufTtcblxuZnVuY3Rpb24gc2NvcmVzSW5pdCh0b2RheXNTY29yZXNEYXRhKSB7XG4gICAgdmFyIGxpdmVTY29yZXMgPSB0b2RheXNTY29yZXNEYXRhLmdzLmc7XG4gICAgaWYgKGxpdmVTY29yZXMubGVuZ3RoICE9IDApIHtcbiAgICAgICAgdmFyIHNlYXNvblR5cGUgPSAnJztcbiAgICAgICAgaWYgKGxpdmVTY29yZXNbMF0uZ2lkLnN1YnN0cigwLCAzKSA9PSAnMDAxJykge1xuICAgICAgICAgICAgc2Vhc29uVHlwZSA9ICdwcmUnO1xuICAgICAgICB9IGVsc2UgaWYgKGxpdmVTY29yZXNbMF0uZ2lkLnN1YnN0cigwLCAzKSA9PSAnMDA0Jykge1xuICAgICAgICAgICAgc2Vhc29uVHlwZSA9ICdwb3N0JztcbiAgICAgICAgfVxuICAgICAgICBpZiAobGl2ZVNjb3Jlcy5sZW5ndGggPiAxIHx8IChsaXZlU2NvcmVzLmxlbmd0aCA9PSAxICYmIGxpdmVTY29yZXNbMF0uaC50YSAhPSAnQk9TJykpIHtcbiAgICAgICAgICAgIHZhciBzdGF0dXNDb2RlcyA9IFsnMXN0IFF0cicsICcybmQgUXRyJywgJzNyZCBRdHInLCAnNHRoIFF0cicsICcxc3QgT1QnLCAnMm5kIE9UJywgJzNyZCBPVCcsICc0dGggT1QnLCAnNXRoIE9UJywgJzZ0aCBPVCcsICc3dGggT1QnLCAnOHRoIE9UJywgJzl0aCBPVCcsICcxMHRoIE9UJ107XG4gICAgICAgICAgICB2YXIgc2NvcmVzSFRNTCA9ICcnO1xuICAgICAgICAgICAgdmFyIGFkZGVkID0gMDtcbiAgICAgICAgICAgIGZvciAodmFyIGkgPSBsaXZlU2NvcmVzLmxlbmd0aCAtIDE7IGkgPj0gMDsgaS0tKSB7XG4gICAgICAgICAgICAgICAgaWYgKGxpdmVTY29yZXNbaV0uaC50YSAhPT0gJ0JPUycgJiYgaSA8IDExKSB7XG4gICAgICAgICAgICAgICAgICAgIGFkZGVkKys7XG4gICAgICAgICAgICAgICAgICAgIHZhciB2U2NvcmUgPSAnJztcbiAgICAgICAgICAgICAgICAgICAgdmFyIGhTY29yZSA9ICcnO1xuICAgICAgICAgICAgICAgICAgICB2YXIgdlJlc3VsdCA9ICcnO1xuICAgICAgICAgICAgICAgICAgICB2YXIgaFJlc3VsdCA9ICcnO1xuICAgICAgICAgICAgICAgICAgICB2YXIgaXNMaXZlID0gJyc7XG4gICAgICAgICAgICAgICAgICAgIGlmIChsaXZlU2NvcmVzW2ldLnN0ICE9IDEpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHZTY29yZSA9IGxpdmVTY29yZXNbaV0udi5zO1xuICAgICAgICAgICAgICAgICAgICAgICAgaFNjb3JlID0gbGl2ZVNjb3Jlc1tpXS5oLnM7XG4gICAgICAgICAgICAgICAgICAgICAgICBpc0xpdmUgPSBcImxpdmVcIjtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB2YXIgc1RleHQgPSBsaXZlU2NvcmVzW2ldLnN0dDtcbiAgICAgICAgICAgICAgICAgICAgaWYgKHN0YXR1c0NvZGVzLmluZGV4T2YobGl2ZVNjb3Jlc1tpXS5zdHQpICE9PSAtMSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgc1RleHQgPSBsaXZlU2NvcmVzW2ldLnN0dCArICcgLSAnICsgbGl2ZVNjb3Jlc1tpXS5jbDtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICBpZiAobGl2ZVNjb3Jlc1tpXS5zdCA9PSAzICYmIHZTY29yZSA8IGhTY29yZSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgdlJlc3VsdCA9ICdsb3Nlcic7XG4gICAgICAgICAgICAgICAgICAgIH0gZWxzZSBpZiAobGl2ZVNjb3Jlc1tpXS5zdCA9PSAzICYmIGhTY29yZSA8IHZTY29yZSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgaFJlc3VsdCA9ICdsb3Nlcic7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgc2NvcmVzSFRNTCArPSAnPGRpdiBjbGFzcz1cInNjb3JlLXdyYXBcIj48ZGl2IGNsYXNzPVwic2NvcmUtc3RhdHVzICcgKyBpc0xpdmUgKyAnXCI+JyArIHNUZXh0LnRvVXBwZXJDYXNlKCkgKyAnPC9kaXY+PGRpdiBjbGFzcz1cIicgKyBsaXZlU2NvcmVzW2ldLnYudGEgKyAnXCI+PGltZyBzcmM9XCJodHRwOi8vc3RhdHMubmJhLmNvbS9tZWRpYS9pbWcvdGVhbXMvbG9nb3MvJyArIGxpdmVTY29yZXNbaV0udi50YS50b1VwcGVyQ2FzZSgpICsgJ19sb2dvLnN2Z1wiPiAnICsgbGl2ZVNjb3Jlc1tpXS52LnRjLnRvVXBwZXJDYXNlKCkgKyAnICcgKyBsaXZlU2NvcmVzW2ldLnYudG4udG9VcHBlckNhc2UoKSArICcgPGRpdiBjbGFzcz1cInNjb3JlLW51bSAnICsgdlJlc3VsdCArICdcIj4nICsgdlNjb3JlICsgJzwvZGl2PjwvZGl2PjxkaXYgY2xhc3M9XCInICsgbGl2ZVNjb3Jlc1tpXS5oLnRhICsgJ1wiPjxpbWcgc3JjPVwiaHR0cDovL3N0YXRzLm5iYS5jb20vbWVkaWEvaW1nL3RlYW1zL2xvZ29zLycgKyBsaXZlU2NvcmVzW2ldLmgudGEudG9VcHBlckNhc2UoKSArICdfbG9nby5zdmdcIj4gJyArIGxpdmVTY29yZXNbaV0uaC50Yy50b1VwcGVyQ2FzZSgpICsgJyAnICsgbGl2ZVNjb3Jlc1tpXS5oLnRuLnRvVXBwZXJDYXNlKCkgKyAnIDxkaXYgY2xhc3M9XCJzY29yZS1udW0gJyArIGhSZXN1bHQgKyAnXCI+JyArIGhTY29yZSArICc8L2Rpdj48L2Rpdj48L2Rpdj4nO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGpRdWVyeSgnLnNjb3JlcycpLmVtcHR5KCkuYXBwZW5kKHNjb3Jlc0hUTUwpO1xuICAgICAgICB9XG4gICAgICAgIGlmIChhZGRlZCA8IDYpIHtcbiAgICAgICAgICAgIGpRdWVyeSgnLmxlYWd1ZS1sZWFkZXJzJykuc2hvdygpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgalF1ZXJ5KCcubGVhZ3VlLWxlYWRlcnMnKS5oaWRlKCk7XG4gICAgICAgIH1cbiAgICB9XG59XG5cbmZ1bmN0aW9uIHVwZGF0ZUxlYWd1ZVNjb3JlcygpIHtcbiAgICBqUXVlcnkuYWpheCh7XG4gICAgICAgIHVybDogZmVlZHMudG9kYXlzU2NvcmVzLFxuICAgICAgICBhc3luYzogZmFsc2UsXG4gICAgICAgIHN1Y2Nlc3M6IGZ1bmN0aW9uKGRhdGEpIHtcbiAgICAgICAgICAgIHNjb3Jlc0luaXQoZGF0YSk7XG4gICAgICAgIH1cbiAgICB9KTtcbn1cblxuZnVuY3Rpb24gbGVhZ3VlTGVhZGVycygpIHtcbiAgICB2YXIgbGVhZ3VlTGVhZGVyc0hUTUwgPSAnPGRpdiBjbGFzcz1cInRpdGxlXCI+PHA+TEVBR1VFIExFQURFUlM8L3A+PHA+UFRTPC9wPjxwPlJFQjwvcD48cD5BU1Q8L3A+PHA+U1RMPC9wPjxwPkJMSzwvcD48L2Rpdj4nO1xuICAgIHZhciBzdGF0VHlwZSA9ICcnO1xuICAgIHZhciBkYXRhSW5kZXggPSBbXCJSQU5LXCIsIFwiUExBWUVSX0lEXCIsIFwiUExBWUVSXCIsIFwiVEVBTV9JRFwiLCBcIlRFQU1fQUJCUkVWSUFUSU9OXCJdO1xuICAgIGpRdWVyeS5hamF4KHtcbiAgICAgICAgdXJsOiBmZWVkcy5sZWFndWVMZWFkZXJzLFxuICAgICAgICBkYXRhVHlwZTogJ2pzb25wJyxcbiAgICAgICAgYXN5bmM6IGZhbHNlLFxuICAgICAgICBzdWNjZXNzOiBmdW5jdGlvbihkYXRhKSB7XG4gICAgICAgICAgICB2YXIgbGVhZGVyc0RhdGEgPSBkYXRhLnJlc3VsdFNldHM7XG4gICAgICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IGxlYWRlcnNEYXRhLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICAgICAgdmFyIGluZGV4ID0gY3JlYXRlSW5kZXgoZGF0YUluZGV4LCBsZWFkZXJzRGF0YVtpXS5oZWFkZXJzKTtcbiAgICAgICAgICAgICAgICB2YXIgcm93cyA9ICcnO1xuICAgICAgICAgICAgICAgIGlmIChbXCJQVFNcIiwgXCJSRUJcIiwgXCJBU1RcIiwgXCJTVExcIiwgXCJCTEtcIl0uaW5kZXhPZihsZWFkZXJzRGF0YVtpXS5oZWFkZXJzWzhdKSAhPT0gLTEpIHtcbiAgICAgICAgICAgICAgICAgICAgZm9yIChsZXQgeCA9IDA7IHggPCBsZWFkZXJzRGF0YVtpXS5yb3dTZXQubGVuZ3RoOyB4KyspIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHZhciBuID0gbGVhZGVyc0RhdGFbaV0ucm93U2V0W3hdWzJdLnNwbGl0KCcgJyk7XG4gICAgICAgICAgICAgICAgICAgICAgICB2YXIgZm4gPSBuWzBdLnRvVXBwZXJDYXNlKCk7XG4gICAgICAgICAgICAgICAgICAgICAgICB2YXIgbG4gPSBuWzFdLnRvVXBwZXJDYXNlKCk7XG4gICAgICAgICAgICAgICAgICAgICAgICByb3dzICs9ICc8ZGl2IGNsYXNzPVwicm93XCI+PGRpdiBjbGFzcz1cImxlZnRcIj48ZGl2IGNsYXNzPVwicGxhY2VcIj4nICsgbGVhZGVyc0RhdGFbaV0ucm93U2V0W3hdWzBdICsgJzwvZGl2PjxkaXYgY2xhc3M9XCJsb2dvLXdyYXBcIj48aW1nIGNsYXNzPVwibG9nb1wiIHNyYz1cImh0dHA6Ly9zdGF0cy5uYmEuY29tL21lZGlhL2ltZy90ZWFtcy9sb2dvcy8nICsgbGVhZGVyc0RhdGFbaV0ucm93U2V0W3hdWzRdICsgJ19sb2dvLnN2Z1wiLz48L2Rpdj48ZGl2IGNsYXNzPVwibmFtZVwiPjxzcGFuPicgKyBmbiArICc8L3NwYW4+ICcgKyBsbiArICc8L2Rpdj48L2Rpdj48ZGl2IGNsYXNzPVwicmlnaHRcIj48ZGl2IGNsYXNzPVwidmFsdWVcIj4nICsgcm91bmQobGVhZGVyc0RhdGFbaV0ucm93U2V0W3hdWzhdKSArICc8L2Rpdj48L2Rpdj48L2Rpdj4nO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIGxlYWd1ZUxlYWRlcnNIVE1MICs9ICc8ZGl2IGNsYXNzPVwibGVhZ3VlLWxlYWRlcnMtd3JhcFwiPicgKyByb3dzICsgJzwvZGl2Pic7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgalF1ZXJ5KCcubGVhZ3VlLWxlYWRlcnMnKS5lbXB0eSgpLmFwcGVuZChsZWFndWVMZWFkZXJzSFRNTCk7XG4gICAgICAgIH1cbiAgICB9KTtcbiAgICB2YXIgY291bnRlciA9IDI7XG4gICAgc2V0SW50ZXJ2YWwoZnVuY3Rpb24oKSB7XG4gICAgICAgIGpRdWVyeSgnLmxlYWd1ZS1sZWFkZXJzLXdyYXAsIC5sZWFndWUtbGVhZGVycyAudGl0bGUgcCcpLnJlbW92ZUNsYXNzKCdhY3RpdmUnKTtcbiAgICAgICAgalF1ZXJ5KCcubGVhZ3VlLWxlYWRlcnMtd3JhcDpudGgtb2YtdHlwZSgnICsgY291bnRlciArICcpLCAubGVhZ3VlLWxlYWRlcnMgLnRpdGxlIHA6bnRoLW9mLXR5cGUoJyArIGNvdW50ZXIgKyAnKScpLmFkZENsYXNzKCdhY3RpdmUnKTtcbiAgICAgICAgaWYgKGNvdW50ZXIgPT0gNikge1xuICAgICAgICAgICAgY291bnRlciA9IDI7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBjb3VudGVyKys7XG4gICAgICAgIH1cbiAgICB9LCAxMDAwMCk7XG59Il19
