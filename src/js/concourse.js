var rosterObj = {
    celtics: {
        roster: {},
        leaders: {
            pts: [
                ['--', '--', '--', '--'],
                ['--', '--', '--', '--'],
                ['--', '--', '--', '--']
            ],
            ast: [
                ['--', '--', '--', '--'],
                ['--', '--', '--', '--'],
                ['--', '--', '--', '--']
            ],
            reb: [
                ['--', '--', '--', '--'],
                ['--', '--', '--', '--'],
                ['--', '--', '--', '--']
            ]
        }
    },
    away: {
        roster: {},
        leaders: {
            pts: [
                ['--', '--', '--', '--'],
                ['--', '--', '--', '--'],
                ['--', '--', '--', '--']
            ],
            ast: [
                ['--', '--', '--', '--'],
                ['--', '--', '--', '--'],
                ['--', '--', '--', '--']
            ],
            reb: [
                ['--', '--', '--', '--'],
                ['--', '--', '--', '--'],
                ['--', '--', '--', '--']
            ]
        }
    }
};
$(document).ready(function() {
    var gid = '';
    var awayTeam = '';
    var gameStarted = false;
    var playerSpotlightCounter = 10;
    var date = new Date();
    var leftWrapCounter = false;
    $.ajax({
        url: 'http://localhost:8888/data/mobile-stats-feed/todays_scores.json',
        async: false,
        success: function(todaysScoresData) {
            for (var i = 0; i < todaysScoresData.gs.g.length; i++) {
                if (todaysScoresData.gs.g[i].h.ta == 'IND') { //CHANGE THIS
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
    $(".timeline-wrap").html('<div class="timeline appended">' + timelineHTML + '</div><div class="season-year appended">' + seasonYearHTML + '</div>');
}

function createIndex(keys, array) {
    var newArr = keys.map(item => array.indexOf(item));
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
            success: function(todaysScoresData) {
                var gid = '';
                for (var i = 0; i < todaysScoresData.gs.g.length; i++) {
                    if (todaysScoresData.gs.g[i].h.ta == 'ORL') { // CHANGE THIS TO 'BOS' WHEN THE TIME COMES
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
    setInterval(function() {
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
    $.ajax({
        url: 'http://localhost:8888/data/mobile-stats-feed/away_roster.json',
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
    $.ajax({
        url: 'http://localhost:8888/data/bio-data.json',
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
        $.ajax({
            url: 'http://localhost:8888/data/mobile-stats-feed/playercards/playercard-' + pid + '.json',
            async: false,
            success: function(data) {
                rosterObj.celtics.roster[pid].stats = data.pl.ca;
            },
            error: function() {}
        });
    }
    for (var i = 0; i < awayRoster.t.pl.length; i++) {
        var pid = awayRoster.t.pl[i].pid;
        rosterObj.away.roster[pid] = awayRoster.t.pl[i];
        $.ajax({
            url: 'http://localhost:8888/data/mobile-stats-feed/playercards/playercard-202330.json', // CHANGE PID
            async: false,
            success: function(data) {
                rosterObj.away.roster[pid].stats = data.pl.ca;
            },
            error: function() {}
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
    setTimeout(function() {
        $('.white-line.horizontal').addClass('transition-1');
    }, 500);
    setTimeout(function() {
        $('.social-top .white-line.vertical:nth-child(odd)').addClass('transition-1');
        $('.social-bottom .white-line.vertical:nth-child(even)').addClass('transition-1');
    }, 800);
    /* 2b - WHITE LINE VERTICAL */
    setTimeout(function() {
        $('.social-top .white-line.vertical:nth-child(even)').addClass('transition-1');
        $('.social-bottom .white-line.vertical:nth-child(odd)').addClass('transition-1');
    }, 1000);
    /* 3 - GENERATE AND REVEAL PLAYER BOXES */
    setTimeout(function() {
        $('.social-top, .social-bottom').addClass('transition-1');
        $('.player-box-wrap').addClass('transition-1');
    }, 1200);
    /* 4 - APPEND HEADSHOTS */
    setTimeout(function() {
        $('.player-box-wrap').addClass('transition-2');
        $('.player-box').addClass('transition-1');
        var delay = 0;
        var forinCounter = 0;
        for (var player in rosterObj.celtics.roster) {
            console.log(player);
            var headshot = 'https://ak-static.cms.nba.com/wp-content/uploads/headshots/nba/latest/1040x760/' + rosterObj.celtics.roster[player].pid + '.png';
            $('.player-box:nth-child(' + (forinCounter + 1) + ')').append('<img class="appended headshot" src="' + headshot + '"/>');
            $('.player-box:nth-child(' + (forinCounter + 1) + ')').attr('data-pid', rosterObj.celtics.roster[player].pid);
            $('.player-box img').on("error", function() {
                $(this).attr('src', 'https://i.cdn.turner.com/nba/nba/.element/media/2.0/teamsites/celtics/media/generic-player-light_600x438.png');
            });
            $('.player-box:nth-child(' + (forinCounter + 1) + ') img').delay(delay).fadeTo(300, 1);
            delay += 30;
            forinCounter++;
        }
    }, 1300);
    /* 5 - PLAYER SELECT */
    var selectedPlayer = '';
    setTimeout(function() {
        $('.player-box').addClass('transition-2');
        $('.player-box:nth-child(' + (playerSpotlightCounter + 1) + ')').addClass('selected');
        selectedPlayer = $('.player-box:nth-child(' + (playerSpotlightCounter + 1) + ')').attr('data-pid');
        console.log(selectedPlayer);
        $('.player-box').not('.replacement.selected').delay(500).addClass('transition-4');
    }, 2000);
    /* 6 - PLAYER BOX EXPAND */
    setTimeout(function() {
        $('.block-wrap.social').addClass('transition-3');
        $('.player-box.replacement.selected').addClass('transition-3');
    }, 3000);
    /* 7 - SPOTLIGHT HTML */
    setTimeout(function() {
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
        setTimeout(function() {
            $('.player-spotlight .bottom-wrap .dyk-box:nth-of-type(2)').addClass('transition-2');
            $('.player-spotlight .bottom-wrap .dyk-box:nth-of-type(3)').addClass('transition-1');
        }, 1000);
        setTimeout(function() {
            $('.player-spotlight .bottom-wrap .dyk-box:nth-of-type(3)').addClass('transition-2');
            $('.player-spotlight .bottom-wrap .dyk-box:nth-of-type(4)').addClass('transition-1');
        }, 1500);
    }, 3600);
    /* 8 - SPOTLIGHT SLIDE IN */
    setTimeout(function() {
        $('.player-spotlight .player-top .player-name, .player-spotlight .player-name-wrap, .player-spotlight .headshot, .player-spotlight .info, .player-spotlight .silo, .player-spotlight .averages, .player-spotlight .player-number').addClass('transition-1');
        setTimeout(function() {
            $('.block-wrap.player-spotlight .player-box').remove();
        }, 4000);
        if (playerSpotlightCounter < 16) {
            playerSpotlightCounter++;
        } else {
            playerSpotlightCounter = 0;
        }
    }, 4100);
    /* 9 - SPOTLIGHT SLIDE OUT */
    setTimeout(function() {
        $('.player-spotlight .bottom-wrap, .player-spotlight .top-wrap').addClass('transition-2');
    }, 6000);
    /* 10 - DONE. REMOVE THAT SHIT */
    setTimeout(function() {
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
            success: function(data) {
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
    setTimeout(function() {
        $('.leaders .leader-section').addClass('transition-1');
        $('.leader-subsection.bottom p:nth-of-type(1)').addClass('transition-1');
        $('.leaders .leader-section .underline, .leaders .leader-subsection.top').addClass(rosterObj.celtics.ta + '-bg');
    }, 800);
    var transitionCounter = 1;
    for (let i = 1; i <= 6; i++) {
        setTimeout(function(numberString) {
            $('.leaders .leader-section .leader-stat-wrap').addClass('transition-' + i);
            $('.leaders .leader-section .underline, .leaders .leader-subsection.top').removeClass(rosterObj.celtics.ta + '-bg');
            $('.leaders .leader-section .underline, .leaders .leader-subsection.top').addClass(rosterObj.away.ta + '-bg');
            if (transitionCounter % 2 == 0) {
                setTimeout(function() {
                    $('.leaders .leader-section .underline, .leaders .leader-subsection.top').removeClass(rosterObj.away.ta + '-bg');
                    $('.leaders .leader-section .underline, .leaders .leader-subsection.top').addClass(rosterObj.celtics.ta + '-bg');
                    $('.leader-subsection.bottom p').removeClass('transition-1');
                    $('.leaders .leader-section .underline').addClass('transition-' + (i / 2));
                    $('.leader-subsection.bottom p:nth-of-type(' + (i - (i / 2) + 1) + ')').addClass('transition-1'); // lol
                }, 200);
            }
            transitionCounter++;
        }, 2000 * i);
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
    if ($('.left-wrap .standings').hasClass('transition-1')){
        $('.left-wrap .standings').removeClass('transition-1');
    }
    else {
        $('.left-wrap .standings').addClass('transition-1');
    }

    if ($('.left-wrap .scores-and-leaders').hasClass('transition-1')){
        $('.left-wrap .scores-and-leaders').removeClass('transition-1');
    }
    else {
        $('.left-wrap .scores-and-leaders').addClass('transition-1');
    }
}


function standingsInit(awayTeam) {
    $.ajax({
        url: 'http://localhost:8888/data/mobile-stats-feed/standings.json',
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
        if (liveScores.length > 1 || (liveScores.length == 1 && liveScores[0].h.ta != 'BOS')) {
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
        if (liveScores.length < 5){
            $('.league-leaders').show();
        }
        else {
            $('.league-leaders').hide();
        }
    }
}

function updateLeagueScores(todaysScoresData) {
    var liveScores = todaysScoresData.gs.g;
    if (liveScores.length != 0) {
        var seasonType = 'Regular+Season';
        if (liveScores[0].gid.substr(0,3) == '001') {
            seasonType = 'Pre+Season';
        }
        else if (liveScores[0].gid.substr(0,3) == '004') {
            seasonType = 'Playoffs';
        }
        if (liveScores.length > 1 || (liveScores.length == 1 && liveScores[0].h.ta != 'BOS')) {
            var statusCodes = ['1st Qtr','2nd Qtr','3rd Qtr','4th Qtr','1st OT','2nd OT','3rd OT','4th OT','5th OT','6th OT','7th OT','8th OT','9th OT','10th OT'];
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

function leagueLeaders(){
    var leagueLeadersHTML = '<div class="title"><p>LEADERS</p><p>PTS</p><p>REB</p><p>AST</p><p>STL</p><p>BLK</p></div>';
    var statType = '';
    var dataIndex = ["RANK","PLAYER_ID","PLAYER","TEAM_ID","TEAM_ABBREVIATION"];

    $.ajax({
        url: 'http://localhost:8888/data/league_leaders.json',
        async: false,
        success: function(data) {
            var leadersData = data.resultSets;
            for (let i = 0; i < leadersData.length; i++){
                var index = createIndex(dataIndex, leadersData[i].headers);
                var rows = '';
                for (let x = 0; x < leadersData[i].rowSet.length; x++){
                    rows += '<div class="row"><div class="left"><div class="place">' + leadersData[i].rowSet[x][0] + '</div><div class="logo-wrap"><img class="logo" src="http://stats.nba.com/media/img/teams/logos/' + leadersData[i].rowSet[x][4] + '_logo.svg"/></div><div class="name">' + leadersData[i].rowSet[x][2].toUpperCase() + '</div></div><div class="right"><div class="value">' + leadersData[i].rowSet[x][8] + '</div></div></div>';
                }
                leagueLeadersHTML += '<div class="league-leaders-wrap">' + rows + '</div>';
            }
        }
    });
    $('.league-leaders').empty().append(leagueLeadersHTML);
}
