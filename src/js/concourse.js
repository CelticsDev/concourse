var rosterObj = {
    celtics: {
        roster: {},
        leaders: {
            pts: [
                ['--', '--', 0, '--'],
                ['--', '--', 0, '--'],
                ['--', '--', 0, '--']
            ],
            ast: [
                ['--', '--', 0, '--'],
                ['--', '--', 0, '--'],
                ['--', '--', 0, '--']
            ],
            reb: [
                ['--', '--', 0, '--'],
                ['--', '--', 0, '--'],
                ['--', '--', 0, '--']
            ]
        }
    },
    away: {
        roster: {},
        leaders: {
            pts: [
                ['--', '--', 0, '--'],
                ['--', '--', 0, '--'],
                ['--', '--', 0, '--']
            ],
            ast: [
                ['--', '--', 0, '--'],
                ['--', '--', 0, '--'],
                ['--', '--', 0, '--']
            ],
            reb: [
                ['--', '--', 0, '--'],
                ['--', '--', 0, '--'],
                ['--', '--', 0, '--']
            ]
        }
    }
};

if (window.location.href.indexOf('nba.com') > -1){
    var dummyVar = '&';
    var feeds = {
        todaysScores: 'http://data.nba.com/data/v2015/json/mobile_teams/nba/2017/scores/00_todays_scores.json',
        celticsRoster: 'http://data.nba.com/data/v2015/json/mobile_teams/nba/2017/teams/celtics_roster.json',
        awayRoster: function(awayTn){
            return 'http://data.nba.com/data/v2015/json/mobile_teams/nba/2017/teams/' + awayTn + '_roster.json';
        },
        bioData: 'http://io.cnn.net/nba/nba/.element/media/2.0/teamsites/celtics/json/bio-data.json',
        playercard: function(pid){
            return 'http://data.nba.com/data/v2015/json/mobile_teams/nba/2017/players/playercard_' + pid + '_02.json';
        },
        playercardAway: function(pid){
            return 'http://data.nba.com/data/v2015/json/mobile_teams/nba/2017/players/playercard_' + pid + '_02.json';
        },
        gamedetail: function(gid) {
            return 'http://data.nba.com/data/v2015/json/mobile_teams/nba/2017/scores/gamedetail/' + gid + '_gamedetail.json';
        },
        standings: 'http://data.nba.com/data/v2015/json/mobile_teams/nba/2017/00_standings.json',
        leagueLeaders: 'http://stats.nba.com/stats/homepagev2?GameScope=Season&LeagueID=00&PlayerOrTeam=Player&PlayerScope=All+Players&Season=2017-18&SeasonType=Regular+Season&StatType=Traditional&callback=?'
    };
}
else {
    var feeds = {
        todaysScores: 'http://localhost:8888/data/mobile-stats-feed/todays_scores.json',
        celticsRoster: 'http://localhost:8888/data/mobile-stats-feed/celtics_roster.json',
        awayRoster: function(awayTn) {
            return 'http://localhost:8888/data/mobile-stats-feed/away_roster.json';
        },
        bioData: 'http://localhost:8888/data/bio-data.json',
        playercard: function(pid) {
            return 'http://localhost:8888/data/mobile-stats-feed/playercards/playercard-' + pid + '.json';
        },
        playercardAway: function(pid) {
            return 'http://localhost:8888/data/mobile-stats-feed/playercards/playercard-202330.json';
        },
        gamedetail: function(gid) {
            return 'http://localhost:8888/data/mobile-stats-feed/gamedetail.json';
        },
        standings: 'http://localhost:8888/data/mobile-stats-feed/standings.json',
        leagueLeaders: 'http://localhost:8888/data/league_leaders.json'
    };
}

var gameStarted = false;
let playerSpotlightCounter = 1;
jQuery(document).ready(function() {
    var gid = '';
    var awayTeam = '';
    var awayTn = '';
    var date = new Date();
    var leftWrapCounter = false;
    jQuery.ajax({
        url: feeds.todaysScores,
        async: false,
        success: function(todaysScoresData) {
            for (var i = 0; i < todaysScoresData.gs.g.length; i++) {
                if (todaysScoresData.gs.g[i].h.ta == 'BOS') { //CHANGE THIS
                    awayTeam = todaysScoresData.gs.g[i].v.ta;
                    awayTn = todaysScoresData.gs.g[i].v.tn.toLowerCase();
                    gid = todaysScoresData.gs.g[i].gid;
                    loadRosterData(awayTeam, awayTn);
                    scoresInit(todaysScoresData);
                    standingsInit(awayTeam);
                    leagueLeaders();
                    leftWrap();
                    // TRANSITIONS
                    function cycle() {
/*                        mobileApp();*/ // DURATION: 25000
                        setTimeout(allStar, 0);
/*                        setTimeout(function() {
                            leaders(gid);
                        }, 25000);*/ // DURATION: 44100
/*                         setTimeout(social, 69000); *///DURATION: 150000
/*                         setTimeout(function(){
                            playerSpotlight(rosterObj);
                        },85000)*/; //DURATION: 40000
                    }
                    cycle();
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
        if (i === 0 || teamAbbreviation !== rosterObj.celtics.roster[selectedPlayer].stats.sa[i - 1].ta) { // If this is a new team, start the team wrap.
            title = teamAbbreviation;
        }
        if (traded) {
            for (var x = 0; x < traded; x++) {
                var gpTot = rosterObj.celtics.roster[selectedPlayer].stats.sa[i].gp;
                var gp = rosterObj.celtics.roster[selectedPlayer].stats.sa[i].spl[x].gp;
                var gpPercentage = Math.round((gp / gpTot) * 100);
                teamAbbreviation = rosterObj.celtics.roster[selectedPlayer].stats.sa[i].spl[x].ta;
                if (i === 0 || teamAbbreviation !== rosterObj.celtics.roster[selectedPlayer].stats.sa[i - 1].ta && teamAbbreviation !== rosterObj.celtics.roster[selectedPlayer].stats.sa[i + 1].ta) { // If this is a new team, start the team wrap.
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
    var newArr = keys.map(item => array.indexOf(item));
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
            success: function(datadata) {
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
        success: function(data) {
            roster = data;
            for (var property in roster.t) {
                if (property !== 'pl') {
                    rosterObj.celtics[property] = roster.t[property];
                }
            }
        },
        error: function() {}
    });
    var awayRoster = '';
    jQuery.ajax({
        url: feeds.awayRoster(awayTn),
        async: false,
        success: function(data) {
            awayRoster = data;
            for (var property in awayRoster.t) {
                if (property !== 'pl') {
                    rosterObj.away[property] = awayRoster.t[property];
                }
            }
        },
        error: function() {}
    });
    var bioData = '';
    jQuery.ajax({
        url: feeds.bioData,
        async: false,
        success: function(data) {
            bioData = data;
        },
        error: function() {}
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
            success: function(data) {
                if (data.pl.ca.hasOwnProperty('sa')) {
                    rosterObj.celtics.roster[pid].stats = data.pl.ca.sa[(data.pl.ca.sa.length - 1)];
                    rosterObj.celtics.roster[pid].stats.sa = data.pl.ca.sa;
                } else {
                    rosterObj.celtics.roster[pid].stats = data.pl.ca;
                }
                rosterObj.celtics.roster[pid].stats.pts = round(rosterObj.celtics.roster[pid].stats.pts);
                rosterObj.celtics.roster[pid].stats.ast = round(rosterObj.celtics.roster[pid].stats.ast);
                rosterObj.celtics.roster[pid].stats.reb = round(rosterObj.celtics.roster[pid].stats.reb);
            },
            error: function() {}
        });
    }
    for (var i = 0; i < awayRoster.t.pl.length; i++) {
        var pid = awayRoster.t.pl[i].pid;
        rosterObj.away.roster[pid] = awayRoster.t.pl[i];
        jQuery.ajax({
            url: feeds.playercardAway(pid), // CHANGE PID
            async: false,
            success: function(data) {
                if (data.pl.ca.hasOwnProperty('sa')) {
                    rosterObj.away.roster[pid].stats = data.pl.ca.sa[(data.pl.ca.sa.length - 1)];
                    rosterObj.away.roster[pid].stats.sa = data.pl.ca.sa;
                } else {
                    rosterObj.away.roster[pid].stats = data.pl.ca;
                }
                rosterObj.away.roster[pid].stats.pts = round(rosterObj.away.roster[pid].stats.pts);
                rosterObj.away.roster[pid].stats.ast = round(rosterObj.away.roster[pid].stats.ast);
                rosterObj.away.roster[pid].stats.reb = round(rosterObj.away.roster[pid].stats.reb);
            },
            error: function() {}
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
            rosterObj[team].leaders[stat].sort(function(a, b) {
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
    setTimeout(function() {
        jQuery('.white-line.horizontal').addClass('transition-1');
    }, 500);
    setTimeout(function() {
        jQuery('.social-top .white-line.vertical:nth-child(odd)').addClass('transition-1');
        jQuery('.social-bottom .white-line.vertical:nth-child(even)').addClass('transition-1');
    }, 800);
    /* 2b - WHITE LINE VERTICAL */
    setTimeout(function() {
        jQuery('.social-top .white-line.vertical:nth-child(even)').addClass('transition-1');
        jQuery('.social-bottom .white-line.vertical:nth-child(odd)').addClass('transition-1');
    }, 1000);
    /* 3 - GENERATE AND REVEAL PLAYER BOXES */
    setTimeout(function() {
        jQuery('.social-top, .social-bottom').addClass('transition-1');
        jQuery('.player-box-wrap').addClass('transition-1');
    }, 1200);
    /* 4 - APPEND HEADSHOTS */
    setTimeout(function() {
        jQuery('.player-box-wrap').addClass('transition-2');
        jQuery('.player-box').addClass('transition-1');
        var delay = 0;
        var forinCounter = 0;
        for (var player in rosterObj.celtics.roster) {
            var headshot = 'https://ak-static.cms.nba.com/wp-content/uploads/headshots/nba/latest/1040x760/' + rosterObj.celtics.roster[player].pid + '.png';
            jQuery('.player-box:nth-child(' + (forinCounter + 1) + ')').append('<img class="appended headshot" src="' + headshot + '"/>');
            jQuery('.player-box:nth-child(' + (forinCounter + 1) + ')').attr('data-pid', rosterObj.celtics.roster[player].pid);
            jQuery('.player-box img').on("error", function() {
                jQuery(this).attr('src', 'https://i.cdn.turner.com/nba/nba/.element/media/2.0/teamsites/celtics/media/generic-player-light_600x438.png');
            });
            jQuery('.player-box:nth-child(' + (forinCounter + 1) + ') img').delay(delay).fadeTo(300, 1);
            delay += 30;
            forinCounter++;
        }
    }, 1700);
    /* 5 - PLAYER SELECT */
    var selectedPlayer = '';
    setTimeout(function() {
        jQuery('.player-box').addClass('transition-2');
        jQuery('.player-box:nth-child(' + (playerSpotlightCounter) + ')').addClass('selected');
        selectedPlayer = jQuery('.player-box:nth-child(' + (playerSpotlightCounter) + ')').attr('data-pid');
        setTimeout(function(){
            jQuery('.player-box').not('.replacement.selected').addClass('transition-4');
        },800);
    }, 3000);
    /* 6 - PLAYER BOX EXPAND */
    setTimeout(function() {
        jQuery('.block-wrap.social').addClass('transition-3');
        jQuery('.player-box.replacement.selected').addClass('transition-3');
    }, 4000);
    /* 7 - SPOTLIGHT HTML */
    setTimeout(function() {
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
            if (i <= rosterObj.celtics.roster[selectedPlayer].bio.personal.length){
                jQuery('.player-spotlight .bottom-wrap').append('<div class="dyk-box appended"><p>' + playerFacts[i] + '</p></div>');
            }
        };
        jQuery('.player-spotlight .bottom-wrap').addClass('transition-1');
        if (jQuery('.player-spotlight .bottom-wrap .dyk-box').length > 1) {
            setTimeout(function() {
                jQuery('.player-spotlight .bottom-wrap .dyk-box:nth-of-type(2)').addClass('transition-2');
                jQuery('.player-spotlight .bottom-wrap .dyk-box:nth-of-type(3)').addClass('transition-1');
            }, 10000);
        }
        if (jQuery('.player-spotlight .bottom-wrap .dyk-box').length > 2) {
            setTimeout(function() {
                jQuery('.player-spotlight .bottom-wrap .dyk-box:nth-of-type(3)').addClass('transition-2');
                jQuery('.player-spotlight .bottom-wrap .dyk-box:nth-of-type(4)').addClass('transition-1');
            }, 20000);
        }
    }, 5000);
    /* 8 - SPOTLIGHT SLIDE IN */
    setTimeout(function() {
        jQuery('.player-spotlight .player-top .player-name, .player-spotlight .player-name-wrap, .player-spotlight .headshot, .player-spotlight .info, .player-spotlight .silo, .player-spotlight .averages, .player-spotlight .player-number').addClass('transition-1');
        setTimeout(function() {
            jQuery('.block-wrap.player-spotlight .player-box').remove();
        }, 15000);
        if (playerSpotlightCounter < 16) {
            playerSpotlightCounter++;
        } else {
            playerSpotlightCounter = 0;
        }
    }, 6000);
    /* 9 - SPOTLIGHT SLIDE OUT */
    setTimeout(function() {
        jQuery('.player-spotlight .bottom-wrap, .player-spotlight .top-wrap').addClass('transition-2');
    }, 40000);
    /* 10 - DONE. REMOVE */
    setTimeout(function() {
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
            success: function(data) {
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
                        rosterObj[team].leaders[stat] = [
                            ['--', '--', 0, '--'],
                            ['--', '--', 0, '--'],
                            ['--', '--', 0, '--']
                        ];
                    }
                    for (var p = 0; p < stats.pstsg.length; p++) {
                        for (var stat in rosterObj[team].leaders) {
                            rosterObj[team].leaders[stat].push([stats.pstsg[p].fn.toUpperCase(), stats.pstsg[p].ln.toUpperCase(), stats.pstsg[p][stat], stats.pstsg[p].pid]);
                        }
                        rosterObj[team].leaders[stat].sort(function(a, b) {
                            return a[2] - b[2];
                        });
                    }
                    for (var team in rosterObj) {
                        for (var stat in rosterObj[team].leaders) {
                            rosterObj[team].leaders[stat].sort(function(a, b) {
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
    setTimeout(function() {
        jQuery('.leaders, .leaders .block-inner').addClass('transition-1');
    }, 100);
    setTimeout(function() {
        jQuery('.leaders .leader-section').addClass('transition-1');
        jQuery('.leader-subsection.bottom p:nth-of-type(1)').addClass('transition-1');
        jQuery('.leaders .leader-section .underline, .leaders .leader-subsection.top').addClass(rosterObj.celtics.ta + '-bg');
    }, 1100);
    setTimeout(function() {
        jQuery('.leaders .leader-section').addClass('transition-2');
        jQuery('.leaders .block-inner').addClass('transition-2');
    }, 2100);
    var transitionCounter = 1;
    setTimeout(function() {
        for (let i = 1; i < 6; i++) {
            setTimeout(function(numberString) {
                jQuery('.leaders .leader-section .leader-stat-wrap').addClass('transition-' + i);
                jQuery('.leaders .leader-section .underline, .leaders .leader-subsection.top').removeClass(rosterObj.celtics.ta + '-bg');
                jQuery('.leaders .leader-section .underline, .leaders .leader-subsection.top').addClass(rosterObj.away.ta + '-bg');
                if (transitionCounter % 2 == 0) {
                    setTimeout(function() {
                        jQuery('.leaders .leader-section .underline, .leaders .leader-subsection.top').removeClass(rosterObj.away.ta + '-bg');
                        jQuery('.leaders .leader-section .underline, .leaders .leader-subsection.top').addClass(rosterObj.celtics.ta + '-bg');
                        jQuery('.leader-subsection.bottom p').removeClass('transition-1');
                        jQuery('.leaders .leader-section .underline').addClass('transition-' + (i / 2));
                        jQuery('.leader-subsection.bottom p:nth-of-type(' + (i - (i / 2) + 1) + ')').addClass('transition-1'); // lol
                    }, 200);
                }
                transitionCounter++;
            }, 7000 * i);
        }
    }, 2100);
    setTimeout(function() {
        jQuery('.leaders .leader-section, .leaders .leader-subsection').addClass('transition-3');
    }, 44100);
    setTimeout(function() {
        jQuery('.leaders').addClass('transition-2');
    }, 44100);
    setTimeout(function() {
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
    setTimeout(function() {
        jQuery('.social .text-wrap, .social .underline').addClass('transition-1');
    }, 15000);
    setTimeout(function() {
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
    var rotateScreens = setInterval(function() {
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
    setTimeout(function() {
        jQuery('.app .block-inner').addClass('transition-1');
    }, 24000);
    setTimeout(function() {
        jQuery('.app').removeClass('active');
        clearInterval(rotateScreens);
    }, 25000);
};

function allStar(){
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
    setInterval(function() {
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
        success: function(standingsData) {
            for (let i = 0; i < standingsData.sta.co.length; i++) {
                for (let x = 0; x < standingsData.sta.co[i].di.length; x++) {
                    for (let t = 0; t < standingsData.sta.co[i].di[x].t.length; t++) {
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
        if (liveScores.length > 1 || (liveScores.length == 1 && liveScores[0].h.ta != 'BOS')) {
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
        success: function(data) {
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
        success: function(data) {
            var leadersData = data.resultSets;
            for (let i = 0; i < leadersData.length; i++) {
                var index = createIndex(dataIndex, leadersData[i].headers);
                var rows = '';
                if (["PTS", "REB", "AST", "STL", "BLK"].indexOf(leadersData[i].headers[8]) !== -1) {
                    for (let x = 0; x < leadersData[i].rowSet.length; x++) {
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
    setInterval(function() {
        jQuery('.league-leaders-wrap, .league-leaders .title p').removeClass('active');
        jQuery('.league-leaders-wrap:nth-of-type(' + counter + '), .league-leaders .title p:nth-of-type(' + counter + ')').addClass('active');
        if (counter == 6) {
            counter = 2;
        } else {
            counter++;
        }
    }, 10000);
}