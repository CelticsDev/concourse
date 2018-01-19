(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
"use strict";

var rosterObj = {
  celtics: {
    roster: {},
    leaders: {
      pts: [["--", "--", 0, "--"], ["--", "--", 0, "--"], ["--", "--", 0, "--"]],
      ast: [["--", "--", 0, "--"], ["--", "--", 0, "--"], ["--", "--", 0, "--"]],
      reb: [["--", "--", 0, "--"], ["--", "--", 0, "--"], ["--", "--", 0, "--"]]
    }
  },
  away: {
    roster: {},
    leaders: {
      pts: [["--", "--", 0, "--"], ["--", "--", 0, "--"], ["--", "--", 0, "--"]],
      ast: [["--", "--", 0, "--"], ["--", "--", 0, "--"], ["--", "--", 0, "--"]],
      reb: [["--", "--", 0, "--"], ["--", "--", 0, "--"], ["--", "--", 0, "--"]]
    }
  }
};

if (window.location.href.indexOf("nba.com") > -1) {
  var dummyVar = "&";
  var feeds = {
    todaysScores: "http://data.nba.com/data/v2015/json/mobile_teams/nba/2017/scores/00_todays_scores.json",
    celticsRoster: "http://data.nba.com/data/v2015/json/mobile_teams/nba/2017/teams/celtics_roster.json",
    awayRoster: function awayRoster(awayTn) {
      return "http://data.nba.com/data/v2015/json/mobile_teams/nba/2017/teams/" + awayTn + "_roster.json";
    },
    bioData: "http://io.cnn.net/nba/nba/.element/media/2.0/teamsites/celtics/json/bio-data.json",
    playercard: function playercard(pid) {
      return "http://data.nba.com/data/v2015/json/mobile_teams/nba/2017/players/playercard_" + pid + "_02.json";
    },
    playercardAway: function playercardAway(pid) {
      return "http://data.nba.com/data/v2015/json/mobile_teams/nba/2017/players/playercard_" + pid + "_02.json";
    },
    gamedetail: function gamedetail(gid) {
      return "http://data.nba.com/data/v2015/json/mobile_teams/nba/2017/scores/gamedetail/" + gid + "_gamedetail.json";
    },
    standings: "http://data.nba.com/data/v2015/json/mobile_teams/nba/2017/00_standings.json",
    leagueLeaders: "http://stats.nba.com/stats/homepagev2?GameScope=Season&LeagueID=00&PlayerOrTeam=Player&PlayerScope=All+Players&Season=2017-18&SeasonType=Regular+Season&StatType=Traditional&callback=?"
  };
} else {
  var feeds = {
    todaysScores: "http://localhost:8888/data/mobile-stats-feed/todays_scores.json",
    celticsRoster: "http://localhost:8888/data/mobile-stats-feed/celtics_roster.json",
    awayRoster: function awayRoster(awayTn) {
      return "http://localhost:8888/data/mobile-stats-feed/away_roster.json";
    },
    bioData: "http://localhost:8888/data/bio-data.json",
    playercard: function playercard(pid) {
      return "http://localhost:8888/data/mobile-stats-feed/playercards/playercard-" + pid + ".json";
    },
    playercardAway: function playercardAway(pid) {
      return "http://localhost:8888/data/mobile-stats-feed/playercards/playercard-202330.json";
    },
    gamedetail: function gamedetail(gid) {
      return "http://localhost:8888/data/mobile-stats-feed/gamedetail.json";
    },
    standings: "http://localhost:8888/data/mobile-stats-feed/standings.json",
    leagueLeaders: "http://localhost:8888/data/league_leaders.json"
  };
}

var gameStarted = false;
var playerSpotlightCounter = 1;
jQuery(document).ready(function () {
  mobileApp();
  var gid = "";
  var awayTeam = "";
  var awayTn = "";
  var date = new Date();
  var leftWrapCounter = false;
  jQuery.ajax({
    url: feeds.todaysScores,
    async: false,
    success: function success(todaysScoresData) {
      for (var i = 0; i < todaysScoresData.gs.g.length; i++) {
        if (todaysScoresData.gs.g[i].h.ta == "BOS") {
          // TRANSITIONS
          var _cycle = function _cycle() {
            /*                        mobileApp();*/
            // DURATION: 25000
            /*                        setTimeout(allStar, 0);*/
            /*                        setTimeout(function() {
                            leaders(gid);
                        }, 25000);*/
            // DURATION: 44100
            /*                         setTimeout(social, 69000); */
            //DURATION: 150000
            /*                         setTimeout(function(){
                            playerSpotlight(rosterObj);
                        },85000)*/
            //DURATION: 40000
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
  var timelineHTML = "";
  var seasonYearHTML = "";
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
        segmentInner += '<div data-season-year="' + seasonYearText + '" data-team="' + teamAbbreviation + '" style="" class="segment-inner ' + teamAbbreviation + '-bg"><p>' + title + "</p></div>";
      }
    } else {
      segmentInner = '<div data-season-year="' + seasonYearText + '" data-team="' + teamAbbreviation + '" class="segment-inner ' + teamAbbreviation + '-bg"><p>' + title + "</p></div>";
    }
    timelineHTML += '<div class="segment">' + segmentInner + "</div>";
    seasonYearHTML += '<div class="segment"><p>' + seasonYearText + "</p></div>";
  }
  jQuery(".timeline-wrap").html('<div class="timeline appended">' + timelineHTML + '</div><div class="season-year appended">' + seasonYearHTML + "</div>");
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
        var gid = "";
        for (var i = 0; i < 5; i++) {
          if (datadata.gs.g[i].h.ta == "BOS" && datadata.gs.g[i].st == 2) {
            gameStarted = true;
            console.log("gamestarted");
          }
        }
      }
    });
  }
  return gameStarted;
}
/*============================================================
=            LOAD ROSTER INFO (build rosterObj)              =
============================================================*/
function loadRosterData(awayTeam, awayTn) {
  var roster = "";
  jQuery.ajax({
    url: feeds.celticsRoster,
    async: false,
    success: function success(data) {
      roster = data;
      for (var property in roster.t) {
        if (property !== "pl") {
          rosterObj.celtics[property] = roster.t[property];
        }
      }
    },
    error: function error() {}
  });
  var awayRoster = "";
  jQuery.ajax({
    url: feeds.awayRoster(awayTn),
    async: false,
    success: function success(data) {
      awayRoster = data;
      for (var property in awayRoster.t) {
        if (property !== "pl") {
          rosterObj.away[property] = awayRoster.t[property];
        }
      }
    },
    error: function error() {}
  });
  var bioData = "";
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
    }
    jQuery.ajax({
      url: feeds.playercard(pid),
      async: false,
      success: function success(data) {
        if (data.pl.ca.hasOwnProperty("sa")) {
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
        if (data.pl.ca.hasOwnProperty("sa")) {
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
  console.log("SORTED:");
  console.log(rosterObj);
}

function statsNotAvailable(pid) {
  rosterObj[pid].stats = {};
  rosterObj[pid].stats.sa = [{}];
  rosterObj[pid].stats.hasStats = false;
  var caIndex = ["gp", "gs", "min", "fgp", "tpp", "ftp", "oreb", "dreb", "reb", "ast", "stl", "blk", "tov", "pf", "pts", "nostats"];
  var saIndex = ["tid", "val", "gp", "gs", "min", "fgp", "tpp", "ftp", "oreb", "dreb", "reb", "ast", "stl", "blk", "tov", "pf", "pts", "spl", "ta", "tn", "tc"];
  for (var i = 0; i < saIndex.length; i++) {
    rosterObj[pid].stats.sa[0][saIndex[i]] = "N/A";
    if (i === 1) {
      rosterObj[pid].stats.sa[0][saIndex[i]] = playerCardYear.toString().substr(2, 2) + "-" + (playerCardYear + 1).toString().substr(2, 2);
    }
    if (i === 17) {
      rosterObj[pid].stats.sa[0][saIndex[i]] = [];
    }
    if (i === 18) {
      rosterObj[pid].stats.sa[0][saIndex[i]] = "BOS";
    }
  }
  for (var i = 0; i < caIndex.length; i++) {
    rosterObj[pid].stats[caIndex[i]] = "N/A";
    if (i === 15) {
      rosterObj[pid].stats[caIndex[i]] = true;
    }
  }
}

function loadGameDetail(gid) {}

function loadAwayTeamData() {}
/*==================================
=            RIGHT WRAP            =
==================================*/
function playerSpotlight(rosterObj) {
  /* 1 - WHITE LINE HORIZTONAL */
  setTimeout(function () {
    jQuery(".white-line.horizontal").addClass("transition-1");
  }, 500);
  setTimeout(function () {
    jQuery(".social-top .white-line.vertical:nth-child(odd)").addClass("transition-1");
    jQuery(".social-bottom .white-line.vertical:nth-child(even)").addClass("transition-1");
  }, 800);
  /* 2b - WHITE LINE VERTICAL */
  setTimeout(function () {
    jQuery(".social-top .white-line.vertical:nth-child(even)").addClass("transition-1");
    jQuery(".social-bottom .white-line.vertical:nth-child(odd)").addClass("transition-1");
  }, 1000);
  /* 3 - GENERATE AND REVEAL PLAYER BOXES */
  setTimeout(function () {
    jQuery(".social-top, .social-bottom").addClass("transition-1");
    jQuery(".player-box-wrap").addClass("transition-1");
  }, 1200);
  /* 4 - APPEND HEADSHOTS */
  setTimeout(function () {
    jQuery(".player-box-wrap").addClass("transition-2");
    jQuery(".player-box").addClass("transition-1");
    var delay = 0;
    var forinCounter = 0;
    for (var player in rosterObj.celtics.roster) {
      var headshot = "https://ak-static.cms.nba.com/wp-content/uploads/headshots/nba/latest/1040x760/" + rosterObj.celtics.roster[player].pid + ".png";
      jQuery(".player-box:nth-child(" + (forinCounter + 1) + ")").append('<img class="appended headshot" src="' + headshot + '"/>');
      jQuery(".player-box:nth-child(" + (forinCounter + 1) + ")").attr("data-pid", rosterObj.celtics.roster[player].pid);
      jQuery(".player-box img").on("error", function () {
        jQuery(this).attr("src", "https://i.cdn.turner.com/nba/nba/.element/media/2.0/teamsites/celtics/media/generic-player-light_600x438.png");
      });
      jQuery(".player-box:nth-child(" + (forinCounter + 1) + ") img").delay(delay).fadeTo(300, 1);
      delay += 30;
      forinCounter++;
    }
  }, 1700);
  /* 5 - PLAYER SELECT */
  var selectedPlayer = "";
  setTimeout(function () {
    jQuery(".player-box").addClass("transition-2");
    jQuery(".player-box:nth-child(" + playerSpotlightCounter + ")").addClass("selected");
    selectedPlayer = jQuery(".player-box:nth-child(" + playerSpotlightCounter + ")").attr("data-pid");
    setTimeout(function () {
      jQuery(".player-box").not(".replacement.selected").addClass("transition-4");
    }, 800);
  }, 3000);
  /* 6 - PLAYER BOX EXPAND */
  setTimeout(function () {
    jQuery(".block-wrap.social").addClass("transition-3");
    jQuery(".player-box.replacement.selected").addClass("transition-3");
  }, 4000);
  /* 7 - SPOTLIGHT HTML */
  setTimeout(function () {
    generateTimeline(selectedPlayer);
    jQuery(".player-box.replacement.selected").clone().appendTo(".block-wrap.player-spotlight .top-wrap");
    jQuery(".player-spotlight .selected").addClass(".appended");
    jQuery(".block-wrap.player-spotlight").addClass("transition-1");
    jQuery(".block-wrap.social").addClass("transition-1");
    var stats = rosterObj.celtics.roster[selectedPlayer].stats;
    jQuery(".player-spotlight .top-wrap .player-top").append('<img class="silo appended" src="http://io.cnn.net/nba/nba/.element/media/2.0/teamsites/celtics/media/silo-466x591-' + rosterObj.celtics.roster[selectedPlayer].pid + '.png" /><div class="top appended"><div class="player-name-wrap"><p class="player-name"><span>' + rosterObj.celtics.roster[selectedPlayer].fn.toUpperCase() + "</span> <br> " + rosterObj.celtics.roster[selectedPlayer].ln.toUpperCase() + '</p></div><p class="player-number">' + rosterObj.celtics.roster[selectedPlayer].num + "</br><span>" + rosterObj.celtics.roster[selectedPlayer].pos + '</span></p></div><div class="middle appended"><ul class="info clearfix"><li><p>AGE<span class="sm-hide">:&nbsp;</span> </br><span class="info-value">' + playerAge(rosterObj.celtics.roster[selectedPlayer].dob) + '</span></p></li><li><p>HT<span class="sm-hide">:&nbsp;</span> </br><span class="info-value">' + rosterObj.celtics.roster[selectedPlayer].ht + '</span></p></li><li><p>WT<span class="sm-hide">:&nbsp;</span> </br><span class="info-value">' + rosterObj.celtics.roster[selectedPlayer].wt + '</span></p></li></ul></div><div class="bottom full clearfix sm-hide appended"><table class="averages"><tr class="averages-labels"><td><p>GP</p></td><td><p>PPG</p></td><td><p>RPG</p></td><td><p>APG</p></td></tr><tr class="averages-season"><td class="gp"><p></p></td><td class="pts"><p></p></td><td class="reb"><p></p></td><td class="ast"><p></p></td></tr></table></div>');
    jQuery(".player-spotlight .averages-season").html('<td class="appended"><p>' + stats.sa[0].gp + '</p></td><td class="appended"><p>' + stats.sa[0].pts + '</p></td><td class="appended"><p>' + stats.sa[0].reb + '</p></td><td class="appended"><p>' + stats.sa[0].ast + "</p></td>");
    jQuery(".player-spotlight .player-name").fadeTo(200, 1);
    var playerFacts = rosterObj.celtics.roster[selectedPlayer].bio.personal;
    for (var i = 0; i < 3; i++) {
      if (i <= rosterObj.celtics.roster[selectedPlayer].bio.personal.length) {
        jQuery(".player-spotlight .bottom-wrap").append('<div class="dyk-box appended"><p>' + playerFacts[i] + "</p></div>");
      }
    }
    jQuery(".player-spotlight .bottom-wrap").addClass("transition-1");
    if (jQuery(".player-spotlight .bottom-wrap .dyk-box").length > 1) {
      setTimeout(function () {
        jQuery(".player-spotlight .bottom-wrap .dyk-box:nth-of-type(2)").addClass("transition-2");
        jQuery(".player-spotlight .bottom-wrap .dyk-box:nth-of-type(3)").addClass("transition-1");
      }, 10000);
    }
    if (jQuery(".player-spotlight .bottom-wrap .dyk-box").length > 2) {
      setTimeout(function () {
        jQuery(".player-spotlight .bottom-wrap .dyk-box:nth-of-type(3)").addClass("transition-2");
        jQuery(".player-spotlight .bottom-wrap .dyk-box:nth-of-type(4)").addClass("transition-1");
      }, 20000);
    }
  }, 5000);
  /* 8 - SPOTLIGHT SLIDE IN */
  setTimeout(function () {
    jQuery(".player-spotlight .player-top .player-name, .player-spotlight .player-name-wrap, .player-spotlight .headshot, .player-spotlight .info, .player-spotlight .silo, .player-spotlight .averages, .player-spotlight .player-number").addClass("transition-1");
    setTimeout(function () {
      jQuery(".block-wrap.player-spotlight .player-box").remove();
    }, 15000);
    if (playerSpotlightCounter < 16) {
      playerSpotlightCounter++;
    } else {
      playerSpotlightCounter = 0;
    }
  }, 6000);
  /* 9 - SPOTLIGHT SLIDE OUT */
  setTimeout(function () {
    jQuery(".player-spotlight .bottom-wrap, .player-spotlight .top-wrap").addClass("transition-2");
  }, 40000);
  /* 10 - DONE. REMOVE */
  setTimeout(function () {
    jQuery(" .player-spotlight .appended").remove();
    jQuery(" .player-spotlight .selected").removeClass("selected");
    for (var i = 1; i < 10; i++) {
      jQuery(".right-wrap .transition-" + i).removeClass("transition-" + i);
    }
  }, 45000);
}

function leaders(gid, gameStarted) {
  jQuery(".leaders").addClass("active");
  var gameDetail = "";
  var detailAvailable = false;
  var leadersTitle = "SEASON LEADERS";
  if (checkGameStatus()) {
    leadersTitle = "GAME LEADERS";
    jQuery.ajax({
      url: feeds.gamedetail(gid),
      async: false,
      success: function success(data) {
        var teamLineScore = ["hls", "vls"];
        for (var x = 0; x < teamLineScore.length; x++) {
          var stats = data.g[teamLineScore[x]];
          var team = "";
          if (stats.ta === "BOS") {
            team = "celtics";
          } else {
            team = "away";
          }
          for (var stat in rosterObj[team].leaders) {
            rosterObj[team].leaders[stat] = [["--", "--", 0, "--"], ["--", "--", 0, "--"], ["--", "--", 0, "--"]];
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
          console.log("SORTED:");
          console.log(rosterObj);
        }
      }
    });
  }
  jQuery(".leaders-title").html(leadersTitle);
  for (var team in rosterObj) {
    for (var i = 0; i < 3; i++) {
      for (var stat in rosterObj[team].leaders) {
        // LEADER STAT VALUE
        jQuery(".leader-section:nth-of-type(" + (i + 2) + ") ." + stat + "." + team + " .stat").html('<span class="appended ' + rosterObj[team].ta + '">' + rosterObj[team].leaders[stat][i][2] + "</span> " + stat.toUpperCase());
        // LEADER NAME
        if (rosterObj[team].leaders[stat][i][0].length + rosterObj[team].leaders[stat][i][1].length >= 14) {
          rosterObj[team].leaders[stat][i][0] = rosterObj[team].leaders[stat][i][0].substr(0, 1) + ".";
        }
        jQuery(".leader-section:nth-of-type(" + (i + 2) + ") ." + stat + "." + team + " .name").html('<span class="appended">' + rosterObj[team].leaders[stat][i][0] + "</span> " + rosterObj[team].leaders[stat][i][1]);
        // LEADER HEADSHOT
        jQuery(".leader-section:nth-of-type(" + (i + 2) + ") ." + stat + "." + team + " .headshot").attr("src", "https://ak-static.cms.nba.com/wp-content/uploads/headshots/nba/latest/1040x760/" + rosterObj[team].leaders[stat][i][3] + ".png");
      }
    }
  }
  setTimeout(function () {
    jQuery(".leaders, .leaders .block-inner").addClass("transition-1");
  }, 100);
  setTimeout(function () {
    jQuery(".leaders .leader-section").addClass("transition-1");
    jQuery(".leader-subsection.bottom p:nth-of-type(1)").addClass("transition-1");
    jQuery(".leaders .leader-section .underline, .leaders .leader-subsection.top").addClass(rosterObj.celtics.ta + "-bg");
  }, 1100);
  setTimeout(function () {
    jQuery(".leaders .leader-section").addClass("transition-2");
    jQuery(".leaders .block-inner").addClass("transition-2");
  }, 2100);
  var transitionCounter = 1;
  setTimeout(function () {
    var _loop = function _loop(_i) {
      setTimeout(function (numberString) {
        jQuery(".leaders .leader-section .leader-stat-wrap").addClass("transition-" + _i);
        jQuery(".leaders .leader-section .underline, .leaders .leader-subsection.top").removeClass(rosterObj.celtics.ta + "-bg");
        jQuery(".leaders .leader-section .underline, .leaders .leader-subsection.top").addClass(rosterObj.away.ta + "-bg");
        if (transitionCounter % 2 == 0) {
          setTimeout(function () {
            jQuery(".leaders .leader-section .underline, .leaders .leader-subsection.top").removeClass(rosterObj.away.ta + "-bg");
            jQuery(".leaders .leader-section .underline, .leaders .leader-subsection.top").addClass(rosterObj.celtics.ta + "-bg");
            jQuery(".leader-subsection.bottom p").removeClass("transition-1");
            jQuery(".leaders .leader-section .underline").addClass("transition-" + _i / 2);
            jQuery(".leader-subsection.bottom p:nth-of-type(" + (_i - _i / 2 + 1) + ")").addClass("transition-1"); // lol
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
    jQuery(".leaders .leader-section, .leaders .leader-subsection").addClass("transition-3");
  }, 44100);
  setTimeout(function () {
    jQuery(".leaders").addClass("transition-2");
  }, 44100);
  setTimeout(function () {
    jQuery(".leaders .leader-section .underline, .leaders .leader-subsection.top").removeClass(rosterObj.away.ta + "-bg");
    jQuery(".leaders .leader-section .underline, .leaders .leader-subsection.top").addClass(rosterObj.celtics.ta + "-bg");
    jQuery(".leaders").removeClass("active");
    jQuery(".leaders .appended").remove();
    for (var i = 1; i < 10; i++) {
      jQuery(".leaders .transition-" + i + ", .leaders.transition-" + i).removeClass("transition-" + i);
    }
  }, 45000);
}

function social() {
  jQuery(".social .text-wrap, .social .underline").removeClass("transition-1");
  jQuery(".social").addClass("active");
  setTimeout(function () {
    jQuery(".social .text-wrap, .social .underline").addClass("transition-1");
  }, 15000);
  setTimeout(function () {
    jQuery(".social .appended").remove();
    jQuery(".social .selected").removeClass("selected");
    jQuery(".social").removeClass("active");
  }, 20000);
}
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
  jQuery(".app .block-inner").removeClass("transition-1");
  jQuery(".app").addClass("active");
  var counter = 1;
  var rotateScreens = setInterval(function () {
    jQuery(".app .bottom-wrap img").removeClass("active");
    jQuery(".app .feature-list p").removeClass("active");
    jQuery(".app .feature-list p:nth-of-type(" + counter + ")").addClass("active");
    jQuery(".app .bottom-wrap img:nth-of-type(" + counter + ")").addClass("active");
    if (counter == 5) {
      counter = 1;
    } else {
      counter++;
    }
  }, 4000);
  rotateScreens;
  setTimeout(function () {
    jQuery(".app .block-inner").addClass("transition-1");
  }, 24000);
  setTimeout(function () {
    jQuery(".app").removeClass("active");
    clearInterval(rotateScreens);
  }, 25000);
}

function allStar() {
  jQuery(".all-star .block-inner").removeClass("transition-1");
  jQuery(".all-star").addClass("active");
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
    if (jQuery(".left-wrap .standings").hasClass("transition-1")) {
      jQuery(".left-wrap .standings").removeClass("transition-1");
    } else {
      jQuery(".left-wrap .standings").addClass("transition-1");
    }
    if (jQuery(".left-wrap .scores-and-leaders").hasClass("transition-1")) {
      jQuery(".left-wrap .scores-and-leaders").removeClass("transition-1");
      updateLeagueScores();
    } else {
      jQuery(".left-wrap .scores-and-leaders").addClass("transition-1");
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
            var conferences = [".east", ".west"];
            var place = standingsData.sta.co[i].di[x].t[t].see;
            var seed = "";
            var activeStatus = "";
            if (standingsData.sta.co[i].di[x].t[t].see <= 8) {
              seed = standingsData.sta.co[i].di[x].t[t].see;
            }
            if (standingsData.sta.co[i].di[x].t[t].ta == "BOS") {
              activeStatus = "active";
            }
            if (standingsData.sta.co[i].di[x].t[t].ta == awayTeam) {
              activeStatus = "active-away";
            }
            var rowHTML = '<div class="place">' + seed + '</div><div class="logo-wrap"><img class="logo" src=http://i.cdn.turner.com/nba/nba/assets/logos/teams/primary/web/' + standingsData.sta.co[i].di[x].t[t].ta + '.svg></div><div class="team + ' + standingsData.sta.co[i].di[x].t[t].ta + '">' + standingsData.sta.co[i].di[x].t[t].ta + '</div><div class="wins">' + standingsData.sta.co[i].di[x].t[t].w + '</div><div class="losses">' + standingsData.sta.co[i].di[x].t[t].l + '</div><div class="games-behind">' + standingsData.sta.co[i].di[x].t[t].gb + "</div>";
            jQuery(conferences[i] + " > div:nth-child(" + (place + 1) + ")").html(rowHTML);
            jQuery(conferences[i] + " > div:nth-child(" + (place + 1) + ")").addClass(activeStatus);
          }
        }
      }
    }
  });
}

function scoresInit(todaysScoresData) {
  var liveScores = todaysScoresData.gs.g;
  if (liveScores.length != 0) {
    var seasonType = "";
    if (liveScores[0].gid.substr(0, 3) == "001") {
      seasonType = "pre";
    } else if (liveScores[0].gid.substr(0, 3) == "004") {
      seasonType = "post";
    }
    if (liveScores.length > 1 || liveScores.length == 1 && liveScores[0].h.ta != "BOS") {
      var statusCodes = ["1st Qtr", "2nd Qtr", "3rd Qtr", "4th Qtr", "1st OT", "2nd OT", "3rd OT", "4th OT", "5th OT", "6th OT", "7th OT", "8th OT", "9th OT", "10th OT"];
      var scoresHTML = "";
      var added = 0;
      for (var i = liveScores.length - 1; i >= 0; i--) {
        if (liveScores[i].h.ta !== "BOS" && i < 11) {
          added++;
          var vScore = "";
          var hScore = "";
          var vResult = "";
          var hResult = "";
          var isLive = "";
          if (liveScores[i].st != 1) {
            vScore = liveScores[i].v.s;
            hScore = liveScores[i].h.s;
            isLive = "live";
          }
          var sText = liveScores[i].stt;
          if (statusCodes.indexOf(liveScores[i].stt) !== -1) {
            sText = liveScores[i].stt + " - " + liveScores[i].cl;
          }
          if (liveScores[i].st == 3 && vScore < hScore) {
            vResult = "loser";
          } else if (liveScores[i].st == 3 && hScore < vScore) {
            hResult = "loser";
          }
          scoresHTML += '<div class="score-wrap"><div class="score-status ' + isLive + '">' + sText.toUpperCase() + '</div><div class="' + liveScores[i].v.ta + '"><img src="http://stats.nba.com/media/img/teams/logos/' + liveScores[i].v.ta.toUpperCase() + '_logo.svg"> ' + liveScores[i].v.tc.toUpperCase() + " " + liveScores[i].v.tn.toUpperCase() + ' <div class="score-num ' + vResult + '">' + vScore + '</div></div><div class="' + liveScores[i].h.ta + '"><img src="http://stats.nba.com/media/img/teams/logos/' + liveScores[i].h.ta.toUpperCase() + '_logo.svg"> ' + liveScores[i].h.tc.toUpperCase() + " " + liveScores[i].h.tn.toUpperCase() + ' <div class="score-num ' + hResult + '">' + hScore + "</div></div></div>";
        }
      }
      jQuery(".scores").empty().append(scoresHTML);
    }
    if (added < 6) {
      jQuery(".league-leaders").show();
    } else {
      jQuery(".league-leaders").hide();
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
  var statType = "";
  var dataIndex = ["RANK", "PLAYER_ID", "PLAYER", "TEAM_ID", "TEAM_ABBREVIATION"];
  jQuery.ajax({
    url: feeds.leagueLeaders,
    dataType: "jsonp",
    async: false,
    success: function success(data) {
      var leadersData = data.resultSets;
      for (var i = 0; i < leadersData.length; i++) {
        var index = createIndex(dataIndex, leadersData[i].headers);
        var rows = "";
        if (["PTS", "REB", "AST", "STL", "BLK"].indexOf(leadersData[i].headers[8]) !== -1) {
          for (var x = 0; x < leadersData[i].rowSet.length; x++) {
            var n = leadersData[i].rowSet[x][2].split(" ");
            var fn = n[0].toUpperCase();
            var ln = n[1].toUpperCase();
            rows += '<div class="row"><div class="left"><div class="place">' + leadersData[i].rowSet[x][0] + '</div><div class="logo-wrap"><img class="logo" src="http://stats.nba.com/media/img/teams/logos/' + leadersData[i].rowSet[x][4] + '_logo.svg"/></div><div class="name"><span>' + fn + "</span> " + ln + '</div></div><div class="right"><div class="value">' + round(leadersData[i].rowSet[x][8]) + "</div></div></div>";
          }
          leagueLeadersHTML += '<div class="league-leaders-wrap">' + rows + "</div>";
        }
      }
      jQuery(".league-leaders").empty().append(leagueLeadersHTML);
    }
  });
  var counter = 2;
  setInterval(function () {
    jQuery(".league-leaders-wrap, .league-leaders .title p").removeClass("active");
    jQuery(".league-leaders-wrap:nth-of-type(" + counter + "), .league-leaders .title p:nth-of-type(" + counter + ")").addClass("active");
    if (counter == 6) {
      counter = 2;
    } else {
      counter++;
    }
  }, 10000);
}

},{}]},{},[1])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJzcmMvanMvY29uY291cnNlLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7QUNBQSxJQUFJLFlBQVk7QUFDZCxXQUFTO0FBQ1AsWUFBUSxFQUREO0FBRVAsYUFBUztBQUNQLFdBQUssQ0FDSCxDQUFDLElBQUQsRUFBTyxJQUFQLEVBQWEsQ0FBYixFQUFnQixJQUFoQixDQURHLEVBRUgsQ0FBQyxJQUFELEVBQU8sSUFBUCxFQUFhLENBQWIsRUFBZ0IsSUFBaEIsQ0FGRyxFQUdILENBQUMsSUFBRCxFQUFPLElBQVAsRUFBYSxDQUFiLEVBQWdCLElBQWhCLENBSEcsQ0FERTtBQU1QLFdBQUssQ0FDSCxDQUFDLElBQUQsRUFBTyxJQUFQLEVBQWEsQ0FBYixFQUFnQixJQUFoQixDQURHLEVBRUgsQ0FBQyxJQUFELEVBQU8sSUFBUCxFQUFhLENBQWIsRUFBZ0IsSUFBaEIsQ0FGRyxFQUdILENBQUMsSUFBRCxFQUFPLElBQVAsRUFBYSxDQUFiLEVBQWdCLElBQWhCLENBSEcsQ0FORTtBQVdQLFdBQUssQ0FBQyxDQUFDLElBQUQsRUFBTyxJQUFQLEVBQWEsQ0FBYixFQUFnQixJQUFoQixDQUFELEVBQXdCLENBQUMsSUFBRCxFQUFPLElBQVAsRUFBYSxDQUFiLEVBQWdCLElBQWhCLENBQXhCLEVBQStDLENBQUMsSUFBRCxFQUFPLElBQVAsRUFBYSxDQUFiLEVBQWdCLElBQWhCLENBQS9DO0FBWEU7QUFGRixHQURLO0FBaUJkLFFBQU07QUFDSixZQUFRLEVBREo7QUFFSixhQUFTO0FBQ1AsV0FBSyxDQUNILENBQUMsSUFBRCxFQUFPLElBQVAsRUFBYSxDQUFiLEVBQWdCLElBQWhCLENBREcsRUFFSCxDQUFDLElBQUQsRUFBTyxJQUFQLEVBQWEsQ0FBYixFQUFnQixJQUFoQixDQUZHLEVBR0gsQ0FBQyxJQUFELEVBQU8sSUFBUCxFQUFhLENBQWIsRUFBZ0IsSUFBaEIsQ0FIRyxDQURF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LENBQXpCLENBSEEsR0FJQSw0Q0FKQSxHQUtBLEVBTEEsR0FNQSxVQU5BLEdBT0EsRUFQQSxHQVFBLG9EQVJBLEdBU0EsTUFBTSxZQUFZLENBQVosRUFBZSxNQUFmLENBQXNCLENBQXRCLEVBQXlCLENBQXpCLENBQU4sQ0FUQSxHQVVBLG9CQVhGO0FBWUQ7QUFDRCwrQkFDRSxzQ0FBc0MsSUFBdEMsR0FBNkMsUUFEL0M7QUFFRDtBQUNGO0FBQ0QsYUFBTyxpQkFBUCxFQUNHLEtBREgsR0FFRyxNQUZILENBRVUsaUJBRlY7QUFHRDtBQXRDUyxHQUFaO0FBd0NBLE1BQUksVUFBVSxDQUFkO0FBQ0EsY0FBWSxZQUFXO0FBQ3JCLFdBQU8sZ0RBQVAsRUFBeUQsV0FBekQsQ0FDRSxRQURGO0FBR0EsV0FDRSxzQ0FDRSxPQURGLEdBRUUsMENBRkYsR0FHRSxPQUhGLEdBSUUsR0FMSixFQU1FLFFBTkYsQ0FNVyxRQU5YO0FBT0EsUUFBSSxXQUFXLENBQWYsRUFBa0I7QUFDaEIsZ0JBQVUsQ0FBVjtBQUNELEtBRkQsTUFFTztBQUNMO0FBQ0Q7QUFDRixHQWhCRCxFQWdCRyxLQWhCSDtBQWlCRCIsImZpbGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uIGUodCxuLHIpe2Z1bmN0aW9uIHMobyx1KXtpZighbltvXSl7aWYoIXRbb10pe3ZhciBhPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7aWYoIXUmJmEpcmV0dXJuIGEobywhMCk7aWYoaSlyZXR1cm4gaShvLCEwKTt2YXIgZj1uZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK28rXCInXCIpO3Rocm93IGYuY29kZT1cIk1PRFVMRV9OT1RfRk9VTkRcIixmfXZhciBsPW5bb109e2V4cG9ydHM6e319O3Rbb11bMF0uY2FsbChsLmV4cG9ydHMsZnVuY3Rpb24oZSl7dmFyIG49dFtvXVsxXVtlXTtyZXR1cm4gcyhuP246ZSl9LGwsbC5leHBvcnRzLGUsdCxuLHIpfXJldHVybiBuW29dLmV4cG9ydHN9dmFyIGk9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtmb3IodmFyIG89MDtvPHIubGVuZ3RoO28rKylzKHJbb10pO3JldHVybiBzfSkiLCJ2YXIgcm9zdGVyT2JqID0ge1xuICBjZWx0aWNzOiB7XG4gICAgcm9zdGVyOiB7fSxcbiAgICBsZWFkZXJzOiB7XG4gICAgICBwdHM6IFtcbiAgICAgICAgW1wiLS1cIiwgXCItLVwiLCAwLCBcIi0tXCJdLFxuICAgICAgICBbXCItLVwiLCBcIi0tXCIsIDAsIFwiLS1cIl0sXG4gICAgICAgIFtcIi0tXCIsIFwiLS1cIiwgMCwgXCItLVwiXVxuICAgICAgXSxcbiAgICAgIGFzdDogW1xuICAgICAgICBbXCItLVwiLCBcIi0tXCIsIDAsIFwiLS1cIl0sXG4gICAgICAgIFtcIi0tXCIsIFwiLS1cIiwgMCwgXCItLVwiXSxcbiAgICAgICAgW1wiLS1cIiwgXCItLVwiLCAwLCBcIi0tXCJdXG4gICAgICBdLFxuICAgICAgcmViOiBbW1wiLS1cIiwgXCItLVwiLCAwLCBcIi0tXCJdLCBbXCItLVwiLCBcIi0tXCIsIDAsIFwiLS1cIl0sIFtcIi0tXCIsIFwiLS1cIiwgMCwgXCItLVwiXV1cbiAgICB9XG4gIH0sXG4gIGF3YXk6IHtcbiAgICByb3N0ZXI6IHt9LFxuICAgIGxlYWRlcnM6IHtcbiAgICAgIHB0czogW1xuICAgICAgICBbXCItLVwiLCBcIi0tXCIsIDAsIFwiLS1cIl0sXG4gICAgICAgIFtcIi0tXCIsIFwiLS1cIiwgMCwgXCItLVwiXSxcbiAgICAgICAgW1wiLS1cIiwgXCItLVwiLCAwLCBcIi0tXCJdXG4gICAgICBdLFxuICAgICAgYXN0OiBbXG4gICAgICAgIFtcIi0tXCIsIFwiLS1cIiwgMCwgXCItLVwiXSxcbiAgICAgICAgW1wiLS1cIiwgXCItLVwiLCAwLCBcIi0tXCJdLFxuICAgICAgICBbXCItLVwiLCBcIi0tXCIsIDAsIFwiLS1cIl1cbiAgICAgIF0sXG4gICAgICByZWI6IFtbXCItLVwiLCBcIi0tXCIsIDAsIFwiLS1cIl0sIFtcIi0tXCIsIFwiLS1cIiwgMCwgXCItLVwiXSwgW1wiLS1cIiwgXCItLVwiLCAwLCBcIi0tXCJdXVxuICAgIH1cbiAgfVxufTtcblxuaWYgKHdpbmRvdy5sb2NhdGlvbi5ocmVmLmluZGV4T2YoXCJuYmEuY29tXCIpID4gLTEpIHtcbiAgdmFyIGR1bW15VmFyID0gXCImXCI7XG4gIHZhciBmZWVkcyA9IHtcbiAgICB0b2RheXNTY29yZXM6XG4gICAgICBcImh0dHA6Ly9kYXRhLm5iYS5jb20vZGF0YS92MjAxNS9qc29uL21vYmlsZV90ZWFtcy9uYmEvMjAxNy9zY29yZXMvMDBfdG9kYXlzX3Njb3Jlcy5qc29uXCIsXG4gICAgY2VsdGljc1Jvc3RlcjpcbiAgICAgIFwiaHR0cDovL2RhdGEubmJhLmNvbS9kYXRhL3YyMDE1L2pzb24vbW9iaWxlX3RlYW1zL25iYS8yMDE3L3RlYW1zL2NlbHRpY3Nfcm9zdGVyLmpzb25cIixcbiAgICBhd2F5Um9zdGVyOiBmdW5jdGlvbihhd2F5VG4pIHtcbiAgICAgIHJldHVybiAoXG4gICAgICAgIFwiaHR0cDovL2RhdGEubmJhLmNvbS9kYXRhL3YyMDE1L2pzb24vbW9iaWxlX3RlYW1zL25iYS8yMDE3L3RlYW1zL1wiICtcbiAgICAgICAgYXdheVRuICtcbiAgICAgICAgXCJfcm9zdGVyLmpzb25cIlxuICAgICAgKTtcbiAgICB9LFxuICAgIGJpb0RhdGE6XG4gICAgICBcImh0dHA6Ly9pby5jbm4ubmV0L25iYS9uYmEvLmVsZW1lbnQvbWVkaWEvMi4wL3RlYW1zaXRlcy9jZWx0aWNzL2pzb24vYmlvLWRhdGEuanNvblwiLFxuICAgIHBsYXllcmNhcmQ6IGZ1bmN0aW9uKHBpZCkge1xuICAgICAgcmV0dXJuIChcbiAgICAgICAgXCJodHRwOi8vZGF0YS5uYmEuY29tL2RhdGEvdjIwMTUvanNvbi9tb2JpbGVfdGVhbXMvbmJhLzIwMTcvcGxheWVycy9wbGF5ZXJjYXJkX1wiICtcbiAgICAgICAgcGlkICtcbiAgICAgICAgXCJfMDIuanNvblwiXG4gICAgICApO1xuICAgIH0sXG4gICAgcGxheWVyY2FyZEF3YXk6IGZ1bmN0aW9uKHBpZCkge1xuICAgICAgcmV0dXJuIChcbiAgICAgICAgXCJodHRwOi8vZGF0YS5uYmEuY29tL2RhdGEvdjIwMTUvanNvbi9tb2JpbGVfdGVhbXMvbmJhLzIwMTcvcGxheWVycy9wbGF5ZXJjYXJkX1wiICtcbiAgICAgICAgcGlkICtcbiAgICAgICAgXCJfMDIuanNvblwiXG4gICAgICApO1xuICAgIH0sXG4gICAgZ2FtZWRldGFpbDogZnVuY3Rpb24oZ2lkKSB7XG4gICAgICByZXR1cm4gKFxuICAgICAgICBcImh0dHA6Ly9kYXRhLm5iYS5jb20vZGF0YS92MjAxNS9qc29uL21vYmlsZV90ZWFtcy9uYmEvMjAxNy9zY29yZXMvZ2FtZWRldGFpbC9cIiArXG4gICAgICAgIGdpZCArXG4gICAgICAgIFwiX2dhbWVkZXRhaWwuanNvblwiXG4gICAgICApO1xuICAgIH0sXG4gICAgc3RhbmRpbmdzOlxuICAgICAgXCJodHRwOi8vZGF0YS5uYmEuY29tL2RhdGEvdjIwMTUvanNvbi9tb2JpbGVfdGVhbXMvbmJhLzIwMTcvMDBfc3RhbmRpbmdzLmpzb25cIixcbiAgICBsZWFndWVMZWFkZXJzOlxuICAgICAgXCJodHRwOi8vc3RhdHMubmJhLmNvbS9zdGF0cy9ob21lcGFnZXYyP0dhbWVTY29wZT1TZWFzb24mTGVhZ3VlSUQ9MDAmUGxheWVyT3JUZWFtPVBsYXllciZQbGF5ZXJTY29wZT1BbGwrUGxheWVycyZTZWFzb249MjAxNy0xOCZTZWFzb25UeXBlPVJlZ3VsYXIrU2Vhc29uJlN0YXRUeXBlPVRyYWRpdGlvbmFsJmNhbGxiYWNrPT9cIlxuICB9O1xufSBlbHNlIHtcbiAgdmFyIGZlZWRzID0ge1xuICAgIHRvZGF5c1Njb3JlczpcbiAgICAgIFwiaHR0cDovL2xvY2FsaG9zdDo4ODg4L2RhdGEvbW9iaWxlLXN0YXRzLWZlZWQvdG9kYXlzX3Njb3Jlcy5qc29uXCIsXG4gICAgY2VsdGljc1Jvc3RlcjpcbiAgICAgIFwiaHR0cDovL2xvY2FsaG9zdDo4ODg4L2RhdGEvbW9iaWxlLXN0YXRzLWZlZWQvY2VsdGljc19yb3N0ZXIuanNvblwiLFxuICAgIGF3YXlSb3N0ZXI6IGZ1bmN0aW9uKGF3YXlUbikge1xuICAgICAgcmV0dXJuIFwiaHR0cDovL2xvY2FsaG9zdDo4ODg4L2RhdGEvbW9iaWxlLXN0YXRzLWZlZWQvYXdheV9yb3N0ZXIuanNvblwiO1xuICAgIH0sXG4gICAgYmlvRGF0YTogXCJodHRwOi8vbG9jYWxob3N0Ojg4ODgvZGF0YS9iaW8tZGF0YS5qc29uXCIsXG4gICAgcGxheWVyY2FyZDogZnVuY3Rpb24ocGlkKSB7XG4gICAgICByZXR1cm4gKFxuICAgICAgICBcImh0dHA6Ly9sb2NhbGhvc3Q6ODg4OC9kYXRhL21vYmlsZS1zdGF0cy1mZWVkL3BsYXllcmNhcmRzL3BsYXllcmNhcmQtXCIgK1xuICAgICAgICBwaWQgK1xuICAgICAgICBcIi5qc29uXCJcbiAgICAgICk7XG4gICAgfSxcbiAgICBwbGF5ZXJjYXJkQXdheTogZnVuY3Rpb24ocGlkKSB7XG4gICAgICByZXR1cm4gXCJodHRwOi8vbG9jYWxob3N0Ojg4ODgvZGF0YS9tb2JpbGUtc3RhdHMtZmVlZC9wbGF5ZXJjYXJkcy9wbGF5ZXJjYXJkLTIwMjMzMC5qc29uXCI7XG4gICAgfSxcbiAgICBnYW1lZGV0YWlsOiBmdW5jdGlvbihnaWQpIHtcbiAgICAgIHJldHVybiBcImh0dHA6Ly9sb2NhbGhvc3Q6ODg4OC9kYXRhL21vYmlsZS1zdGF0cy1mZWVkL2dhbWVkZXRhaWwuanNvblwiO1xuICAgIH0sXG4gICAgc3RhbmRpbmdzOiBcImh0dHA6Ly9sb2NhbGhvc3Q6ODg4OC9kYXRhL21vYmlsZS1zdGF0cy1mZWVkL3N0YW5kaW5ncy5qc29uXCIsXG4gICAgbGVhZ3VlTGVhZGVyczogXCJodHRwOi8vbG9jYWxob3N0Ojg4ODgvZGF0YS9sZWFndWVfbGVhZGVycy5qc29uXCJcbiAgfTtcbn1cblxudmFyIGdhbWVTdGFydGVkID0gZmFsc2U7XG5sZXQgcGxheWVyU3BvdGxpZ2h0Q291bnRlciA9IDE7XG5qUXVlcnkoZG9jdW1lbnQpLnJlYWR5KGZ1bmN0aW9uKCkge1xuICBtb2JpbGVBcHAoKTtcbiAgdmFyIGdpZCA9IFwiXCI7XG4gIHZhciBhd2F5VGVhbSA9IFwiXCI7XG4gIHZhciBhd2F5VG4gPSBcIlwiO1xuICB2YXIgZGF0ZSA9IG5ldyBEYXRlKCk7XG4gIHZhciBsZWZ0V3JhcENvdW50ZXIgPSBmYWxzZTtcbiAgalF1ZXJ5LmFqYXgoe1xuICAgIHVybDogZmVlZHMudG9kYXlzU2NvcmVzLFxuICAgIGFzeW5jOiBmYWxzZSxcbiAgICBzdWNjZXNzOiBmdW5jdGlvbih0b2RheXNTY29yZXNEYXRhKSB7XG4gICAgICBmb3IgKHZhciBpID0gMDsgaSA8IHRvZGF5c1Njb3Jlc0RhdGEuZ3MuZy5sZW5ndGg7IGkrKykge1xuICAgICAgICBpZiAodG9kYXlzU2NvcmVzRGF0YS5ncy5nW2ldLmgudGEgPT0gXCJCT1NcIikge1xuICAgICAgICAgIC8vQ0hBTkdFIFRISVNcbiAgICAgICAgICBhd2F5VGVhbSA9IHRvZGF5c1Njb3Jlc0RhdGEuZ3MuZ1tpXS52LnRhO1xuICAgICAgICAgIGF3YXlUbiA9IHRvZGF5c1Njb3Jlc0RhdGEuZ3MuZ1tpXS52LnRuLnRvTG93ZXJDYXNlKCk7XG4gICAgICAgICAgZ2lkID0gdG9kYXlzU2NvcmVzRGF0YS5ncy5nW2ldLmdpZDtcbiAgICAgICAgICBsb2FkUm9zdGVyRGF0YShhd2F5VGVhbSwgYXdheVRuKTtcbiAgICAgICAgICBzY29yZXNJbml0KHRvZGF5c1Njb3Jlc0RhdGEpO1xuICAgICAgICAgIHN0YW5kaW5nc0luaXQoYXdheVRlYW0pO1xuICAgICAgICAgIGxlYWd1ZUxlYWRlcnMoKTtcbiAgICAgICAgICBsZWZ0V3JhcCgpO1xuICAgICAgICAgIC8vIFRSQU5TSVRJT05TXG4gICAgICAgICAgZnVuY3Rpb24gY3ljbGUoKSB7XG4gICAgICAgICAgICAvKiAgICAgICAgICAgICAgICAgICAgICAgIG1vYmlsZUFwcCgpOyovXG4gICAgICAgICAgICAvLyBEVVJBVElPTjogMjUwMDBcbiAgICAgICAgICAgIC8qICAgICAgICAgICAgICAgICAgICAgICAgc2V0VGltZW91dChhbGxTdGFyLCAwKTsqL1xuICAgICAgICAgICAgLyogICAgICAgICAgICAgICAgICAgICAgICBzZXRUaW1lb3V0KGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGxlYWRlcnMoZ2lkKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH0sIDI1MDAwKTsqL1xuICAgICAgICAgICAgLy8gRFVSQVRJT046IDQ0MTAwXG4gICAgICAgICAgICAvKiAgICAgICAgICAgICAgICAgICAgICAgICBzZXRUaW1lb3V0KHNvY2lhbCwgNjkwMDApOyAqL1xuICAgICAgICAgICAgLy9EVVJBVElPTjogMTUwMDAwXG4gICAgICAgICAgICAvKiAgICAgICAgICAgICAgICAgICAgICAgICBzZXRUaW1lb3V0KGZ1bmN0aW9uKCl7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcGxheWVyU3BvdGxpZ2h0KHJvc3Rlck9iaik7XG4gICAgICAgICAgICAgICAgICAgICAgICB9LDg1MDAwKSovXG4gICAgICAgICAgICAvL0RVUkFUSU9OOiA0MDAwMFxuICAgICAgICAgIH1cbiAgICAgICAgICBjeWNsZSgpO1xuICAgICAgICAgIC8qICAgICAgICAgICAgICAgICAgICBzZXRJbnRlcnZhbChjeWNsZSwgMTIzMDAwKTsqL1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuICB9KTtcbn0pO1xuXG5mdW5jdGlvbiBjeWNsZSgpIHt9XG4vKj09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG49ICAgICAgICAgICAgTUlTQyBGVU5DVElPTlMgICAgICAgICAgICA9XG49PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PSovXG5mdW5jdGlvbiBwbGF5ZXJBZ2UoZG9iKSB7XG4gIHZhciB0b2RheSA9IG5ldyBEYXRlKCk7XG4gIHZhciBiaXJ0aERhdGUgPSBuZXcgRGF0ZShkb2IpO1xuICB2YXIgYWdlID0gdG9kYXkuZ2V0RnVsbFllYXIoKSAtIGJpcnRoRGF0ZS5nZXRGdWxsWWVhcigpO1xuICByZXR1cm4gYWdlO1xufVxuXG5mdW5jdGlvbiBnZW5lcmF0ZVRpbWVsaW5lKHNlbGVjdGVkUGxheWVyKSB7XG4gIC8vIEFQUEVORDogVElNRUxJTkVcbiAgdmFyIHNlYXNvbnNQbGF5ZWQgPSByb3N0ZXJPYmouY2VsdGljcy5yb3N0ZXJbc2VsZWN0ZWRQbGF5ZXJdLnN0YXRzLnNhLmxlbmd0aDtcbiAgdmFyIHRpbWVsaW5lSFRNTCA9IFwiXCI7XG4gIHZhciBzZWFzb25ZZWFySFRNTCA9IFwiXCI7XG4gIGZvciAodmFyIGkgPSAwOyBpIDwgc2Vhc29uc1BsYXllZDsgaSsrKSB7XG4gICAgdmFyIHRlYW1BYmJyZXZpYXRpb24gPVxuICAgICAgcm9zdGVyT2JqLmNlbHRpY3Mucm9zdGVyW3NlbGVjdGVkUGxheWVyXS5zdGF0cy5zYVtpXS50YTtcbiAgICB2YXIgdHJhZGVkID1cbiAgICAgIHJvc3Rlck9iai5jZWx0aWNzLnJvc3RlcltzZWxlY3RlZFBsYXllcl0uc3RhdHMuc2FbaV0uc3BsLmxlbmd0aDtcbiAgICB2YXIgc2VnbWVudElubmVyID0gXCJcIjtcbiAgICB2YXIgdGl0bGUgPSBcIlwiO1xuICAgIHZhciBzZWFzb25ZZWFyVGV4dCA9XG4gICAgICByb3N0ZXJPYmouY2VsdGljcy5yb3N0ZXJbc2VsZWN0ZWRQbGF5ZXJdLnN0YXRzLnNhW2ldLnZhbDtcbiAgICBpZiAoXG4gICAgICBpID09PSAwIHx8XG4gICAgICB0ZWFtQWJicmV2aWF0aW9uICE9PVxuICAgICAgICByb3N0ZXJPYmouY2VsdGljcy5yb3N0ZXJbc2VsZWN0ZWRQbGF5ZXJdLnN0YXRzLnNhW2kgLSAxXS50YVxuICAgICkge1xuICAgICAgLy8gSWYgdGhpcyBpcyBhIG5ldyB0ZWFtLCBzdGFydCB0aGUgdGVhbSB3cmFwLlxuICAgICAgdGl0bGUgPSB0ZWFtQWJicmV2aWF0aW9uO1xuICAgIH1cbiAgICBpZiAodHJhZGVkKSB7XG4gICAgICBmb3IgKHZhciB4ID0gMDsgeCA8IHRyYWRlZDsgeCsrKSB7XG4gICAgICAgIHZhciBncFRvdCA9IHJvc3Rlck9iai5jZWx0aWNzLnJvc3RlcltzZWxlY3RlZFBsYXllcl0uc3RhdHMuc2FbaV0uZ3A7XG4gICAgICAgIHZhciBncCA9IHJvc3Rlck9iai5jZWx0aWNzLnJvc3RlcltzZWxlY3RlZFBsYXllcl0uc3RhdHMuc2FbaV0uc3BsW3hdLmdwO1xuICAgICAgICB2YXIgZ3BQZXJjZW50YWdlID0gTWF0aC5yb3VuZChncCAvIGdwVG90ICogMTAwKTtcbiAgICAgICAgdGVhbUFiYnJldmlhdGlvbiA9XG4gICAgICAgICAgcm9zdGVyT2JqLmNlbHRpY3Mucm9zdGVyW3NlbGVjdGVkUGxheWVyXS5zdGF0cy5zYVtpXS5zcGxbeF0udGE7XG4gICAgICAgIGlmIChcbiAgICAgICAgICBpID09PSAwIHx8XG4gICAgICAgICAgKHRlYW1BYmJyZXZpYXRpb24gIT09XG4gICAgICAgICAgICByb3N0ZXJPYmouY2VsdGljcy5yb3N0ZXJbc2VsZWN0ZWRQbGF5ZXJdLnN0YXRzLnNhW2kgLSAxXS50YSAmJlxuICAgICAgICAgICAgdGVhbUFiYnJldmlhdGlvbiAhPT1cbiAgICAgICAgICAgICAgcm9zdGVyT2JqLmNlbHRpY3Mucm9zdGVyW3NlbGVjdGVkUGxheWVyXS5zdGF0cy5zYVtpICsgMV0udGEpXG4gICAgICAgICkge1xuICAgICAgICAgIC8vIElmIHRoaXMgaXMgYSBuZXcgdGVhbSwgc3RhcnQgdGhlIHRlYW0gd3JhcC5cbiAgICAgICAgICB0aXRsZSA9IHRlYW1BYmJyZXZpYXRpb247XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgdGl0bGUgPSBcIlwiO1xuICAgICAgICB9XG4gICAgICAgIHNlZ21lbnRJbm5lciArPVxuICAgICAgICAgICc8ZGl2IGRhdGEtc2Vhc29uLXllYXI9XCInICtcbiAgICAgICAgICBzZWFzb25ZZWFyVGV4dCArXG4gICAgICAgICAgJ1wiIGRhdGEtdGVhbT1cIicgK1xuICAgICAgICAgIHRlYW1BYmJyZXZpYXRpb24gK1xuICAgICAgICAgICdcIiBzdHlsZT1cIlwiIGNsYXNzPVwic2VnbWVudC1pbm5lciAnICtcbiAgICAgICAgICB0ZWFtQWJicmV2aWF0aW9uICtcbiAgICAgICAgICAnLWJnXCI+PHA+JyArXG4gICAgICAgICAgdGl0bGUgK1xuICAgICAgICAgIFwiPC9wPjwvZGl2PlwiO1xuICAgICAgfVxuICAgIH0gZWxzZSB7XG4gICAgICBzZWdtZW50SW5uZXIgPVxuICAgICAgICAnPGRpdiBkYXRhLXNlYXNvbi15ZWFyPVwiJyArXG4gICAgICAgIHNlYXNvblllYXJUZXh0ICtcbiAgICAgICAgJ1wiIGRhdGEtdGVhbT1cIicgK1xuICAgICAgICB0ZWFtQWJicmV2aWF0aW9uICtcbiAgICAgICAgJ1wiIGNsYXNzPVwic2VnbWVudC1pbm5lciAnICtcbiAgICAgICAgdGVhbUFiYnJldmlhdGlvbiArXG4gICAgICAgICctYmdcIj48cD4nICtcbiAgICAgICAgdGl0bGUgK1xuICAgICAgICBcIjwvcD48L2Rpdj5cIjtcbiAgICB9XG4gICAgdGltZWxpbmVIVE1MICs9ICc8ZGl2IGNsYXNzPVwic2VnbWVudFwiPicgKyBzZWdtZW50SW5uZXIgKyBcIjwvZGl2PlwiO1xuICAgIHNlYXNvblllYXJIVE1MICs9XG4gICAgICAnPGRpdiBjbGFzcz1cInNlZ21lbnRcIj48cD4nICsgc2Vhc29uWWVhclRleHQgKyBcIjwvcD48L2Rpdj5cIjtcbiAgfVxuICBqUXVlcnkoXCIudGltZWxpbmUtd3JhcFwiKS5odG1sKFxuICAgICc8ZGl2IGNsYXNzPVwidGltZWxpbmUgYXBwZW5kZWRcIj4nICtcbiAgICAgIHRpbWVsaW5lSFRNTCArXG4gICAgICAnPC9kaXY+PGRpdiBjbGFzcz1cInNlYXNvbi15ZWFyIGFwcGVuZGVkXCI+JyArXG4gICAgICBzZWFzb25ZZWFySFRNTCArXG4gICAgICBcIjwvZGl2PlwiXG4gICk7XG59XG5cbmZ1bmN0aW9uIGNyZWF0ZUluZGV4KGtleXMsIGFycmF5KSB7XG4gIHZhciBuZXdBcnIgPSBrZXlzLm1hcChpdGVtID0+IGFycmF5LmluZGV4T2YoaXRlbSkpO1xuICByZXR1cm4gbmV3QXJyO1xufVxuXG5mdW5jdGlvbiByb3VuZChudW1iZXIpIHtcbiAgaWYgKHR5cGVvZiBudW1iZXIgIT09IFwibnVtYmVyXCIgfHwgbnVtYmVyID09IHVuZGVmaW5lZCkge1xuICAgIHJldHVybiBudW1iZXI7XG4gIH0gZWxzZSB7XG4gICAgcmV0dXJuIG51bWJlci50b0ZpeGVkKDEpO1xuICB9XG59XG4vKj09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbj0gICAgICAgICAgICBJTklUSUFMSVpFICAgICAgICAgICAgPVxuPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PSovXG5mdW5jdGlvbiBjaGVja0dhbWVTdGF0dXMoKSB7XG4gIGlmICghZ2FtZVN0YXJ0ZWQpIHtcbiAgICBqUXVlcnkuYWpheCh7XG4gICAgICB1cmw6IGZlZWRzLnRvZGF5c1Njb3JlcyxcbiAgICAgIGFzeW5jOiBmYWxzZSxcbiAgICAgIHN1Y2Nlc3M6IGZ1bmN0aW9uKGRhdGFkYXRhKSB7XG4gICAgICAgIHZhciBnaWQgPSBcIlwiO1xuICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IDU7IGkrKykge1xuICAgICAgICAgIGlmIChkYXRhZGF0YS5ncy5nW2ldLmgudGEgPT0gXCJCT1NcIiAmJiBkYXRhZGF0YS5ncy5nW2ldLnN0ID09IDIpIHtcbiAgICAgICAgICAgIGdhbWVTdGFydGVkID0gdHJ1ZTtcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiZ2FtZXN0YXJ0ZWRcIik7XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9XG4gICAgfSk7XG4gIH1cbiAgcmV0dXJuIGdhbWVTdGFydGVkO1xufVxuLyo9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbj0gICAgICAgICAgICBMT0FEIFJPU1RFUiBJTkZPIChidWlsZCByb3N0ZXJPYmopICAgICAgICAgICAgICA9XG49PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT0qL1xuZnVuY3Rpb24gbG9hZFJvc3RlckRhdGEoYXdheVRlYW0sIGF3YXlUbikge1xuICB2YXIgcm9zdGVyID0gXCJcIjtcbiAgalF1ZXJ5LmFqYXgoe1xuICAgIHVybDogZmVlZHMuY2VsdGljc1Jvc3RlcixcbiAgICBhc3luYzogZmFsc2UsXG4gICAgc3VjY2VzczogZnVuY3Rpb24oZGF0YSkge1xuICAgICAgcm9zdGVyID0gZGF0YTtcbiAgICAgIGZvciAodmFyIHByb3BlcnR5IGluIHJvc3Rlci50KSB7XG4gICAgICAgIGlmIChwcm9wZXJ0eSAhPT0gXCJwbFwiKSB7XG4gICAgICAgICAgcm9zdGVyT2JqLmNlbHRpY3NbcHJvcGVydHldID0gcm9zdGVyLnRbcHJvcGVydHldO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfSxcbiAgICBlcnJvcjogZnVuY3Rpb24oKSB7fVxuICB9KTtcbiAgdmFyIGF3YXlSb3N0ZXIgPSBcIlwiO1xuICBqUXVlcnkuYWpheCh7XG4gICAgdXJsOiBmZWVkcy5hd2F5Um9zdGVyKGF3YXlUbiksXG4gICAgYXN5bmM6IGZhbHNlLFxuICAgIHN1Y2Nlc3M6IGZ1bmN0aW9uKGRhdGEpIHtcbiAgICAgIGF3YXlSb3N0ZXIgPSBkYXRhO1xuICAgICAgZm9yICh2YXIgcHJvcGVydHkgaW4gYXdheVJvc3Rlci50KSB7XG4gICAgICAgIGlmIChwcm9wZXJ0eSAhPT0gXCJwbFwiKSB7XG4gICAgICAgICAgcm9zdGVyT2JqLmF3YXlbcHJvcGVydHldID0gYXdheVJvc3Rlci50W3Byb3BlcnR5XTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH0sXG4gICAgZXJyb3I6IGZ1bmN0aW9uKCkge31cbiAgfSk7XG4gIHZhciBiaW9EYXRhID0gXCJcIjtcbiAgalF1ZXJ5LmFqYXgoe1xuICAgIHVybDogZmVlZHMuYmlvRGF0YSxcbiAgICBhc3luYzogZmFsc2UsXG4gICAgc3VjY2VzczogZnVuY3Rpb24oZGF0YSkge1xuICAgICAgYmlvRGF0YSA9IGRhdGE7XG4gICAgfSxcbiAgICBlcnJvcjogZnVuY3Rpb24oKSB7fVxuICB9KTtcbiAgZm9yICh2YXIgaSA9IDA7IGkgPCByb3N0ZXIudC5wbC5sZW5ndGg7IGkrKykge1xuICAgIHZhciBwaWQgPSByb3N0ZXIudC5wbFtpXS5waWQ7XG4gICAgcm9zdGVyT2JqLmNlbHRpY3Mucm9zdGVyW3BpZF0gPSByb3N0ZXIudC5wbFtpXTtcbiAgICBmb3IgKHZhciBwcm9wZXJ0eSBpbiBiaW9EYXRhW3BpZF0pIHtcbiAgICAgIHJvc3Rlck9iai5jZWx0aWNzLnJvc3RlcltwaWRdLmJpbyA9IGJpb0RhdGFbcGlkXTtcbiAgICB9XG4gICAgalF1ZXJ5LmFqYXgoe1xuICAgICAgdXJsOiBmZWVkcy5wbGF5ZXJjYXJkKHBpZCksXG4gICAgICBhc3luYzogZmFsc2UsXG4gICAgICBzdWNjZXNzOiBmdW5jdGlvbihkYXRhKSB7XG4gICAgICAgIGlmIChkYXRhLnBsLmNhLmhhc093blByb3BlcnR5KFwic2FcIikpIHtcbiAgICAgICAgICByb3N0ZXJPYmouY2VsdGljcy5yb3N0ZXJbcGlkXS5zdGF0cyA9XG4gICAgICAgICAgICBkYXRhLnBsLmNhLnNhW2RhdGEucGwuY2Euc2EubGVuZ3RoIC0gMV07XG4gICAgICAgICAgcm9zdGVyT2JqLmNlbHRpY3Mucm9zdGVyW3BpZF0uc3RhdHMuc2EgPSBkYXRhLnBsLmNhLnNhO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIHJvc3Rlck9iai5jZWx0aWNzLnJvc3RlcltwaWRdLnN0YXRzID0gZGF0YS5wbC5jYTtcbiAgICAgICAgfVxuICAgICAgICByb3N0ZXJPYmouY2VsdGljcy5yb3N0ZXJbcGlkXS5zdGF0cy5wdHMgPSByb3VuZChcbiAgICAgICAgICByb3N0ZXJPYmouY2VsdGljcy5yb3N0ZXJbcGlkXS5zdGF0cy5wdHNcbiAgICAgICAgKTtcbiAgICAgICAgcm9zdGVyT2JqLmNlbHRpY3Mucm9zdGVyW3BpZF0uc3RhdHMuYXN0ID0gcm91bmQoXG4gICAgICAgICAgcm9zdGVyT2JqLmNlbHRpY3Mucm9zdGVyW3BpZF0uc3RhdHMuYXN0XG4gICAgICAgICk7XG4gICAgICAgIHJvc3Rlck9iai5jZWx0aWNzLnJvc3RlcltwaWRdLnN0YXRzLnJlYiA9IHJvdW5kKFxuICAgICAgICAgIHJvc3Rlck9iai5jZWx0aWNzLnJvc3RlcltwaWRdLnN0YXRzLnJlYlxuICAgICAgICApO1xuICAgICAgfSxcbiAgICAgIGVycm9yOiBmdW5jdGlvbigpIHt9XG4gICAgfSk7XG4gIH1cbiAgZm9yICh2YXIgaSA9IDA7IGkgPCBhd2F5Um9zdGVyLnQucGwubGVuZ3RoOyBpKyspIHtcbiAgICB2YXIgcGlkID0gYXdheVJvc3Rlci50LnBsW2ldLnBpZDtcbiAgICByb3N0ZXJPYmouYXdheS5yb3N0ZXJbcGlkXSA9IGF3YXlSb3N0ZXIudC5wbFtpXTtcbiAgICBqUXVlcnkuYWpheCh7XG4gICAgICB1cmw6IGZlZWRzLnBsYXllcmNhcmRBd2F5KHBpZCksIC8vIENIQU5HRSBQSURcbiAgICAgIGFzeW5jOiBmYWxzZSxcbiAgICAgIHN1Y2Nlc3M6IGZ1bmN0aW9uKGRhdGEpIHtcbiAgICAgICAgaWYgKGRhdGEucGwuY2EuaGFzT3duUHJvcGVydHkoXCJzYVwiKSkge1xuICAgICAgICAgIHJvc3Rlck9iai5hd2F5LnJvc3RlcltwaWRdLnN0YXRzID1cbiAgICAgICAgICAgIGRhdGEucGwuY2Euc2FbZGF0YS5wbC5jYS5zYS5sZW5ndGggLSAxXTtcbiAgICAgICAgICByb3N0ZXJPYmouYXdheS5yb3N0ZXJbcGlkXS5zdGF0cy5zYSA9IGRhdGEucGwuY2Euc2E7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgcm9zdGVyT2JqLmF3YXkucm9zdGVyW3BpZF0uc3RhdHMgPSBkYXRhLnBsLmNhO1xuICAgICAgICB9XG4gICAgICAgIHJvc3Rlck9iai5hd2F5LnJvc3RlcltwaWRdLnN0YXRzLnB0cyA9IHJvdW5kKFxuICAgICAgICAgIHJvc3Rlck9iai5hd2F5LnJvc3RlcltwaWRdLnN0YXRzLnB0c1xuICAgICAgICApO1xuICAgICAgICByb3N0ZXJPYmouYXdheS5yb3N0ZXJbcGlkXS5zdGF0cy5hc3QgPSByb3VuZChcbiAgICAgICAgICByb3N0ZXJPYmouYXdheS5yb3N0ZXJbcGlkXS5zdGF0cy5hc3RcbiAgICAgICAgKTtcbiAgICAgICAgcm9zdGVyT2JqLmF3YXkucm9zdGVyW3BpZF0uc3RhdHMucmViID0gcm91bmQoXG4gICAgICAgICAgcm9zdGVyT2JqLmF3YXkucm9zdGVyW3BpZF0uc3RhdHMucmViXG4gICAgICAgICk7XG4gICAgICB9LFxuICAgICAgZXJyb3I6IGZ1bmN0aW9uKCkge31cbiAgICB9KTtcbiAgfVxuICBmb3IgKHZhciB0ZWFtIGluIHJvc3Rlck9iaikge1xuICAgIGZvciAodmFyIHBsYXllciBpbiByb3N0ZXJPYmpbdGVhbV0ucm9zdGVyKSB7XG4gICAgICBmb3IgKHZhciBzdGF0IGluIHJvc3Rlck9ialt0ZWFtXS5sZWFkZXJzKSB7XG4gICAgICAgIHJvc3Rlck9ialt0ZWFtXS5sZWFkZXJzW3N0YXRdLnB1c2goW1xuICAgICAgICAgIHJvc3Rlck9ialt0ZWFtXS5yb3N0ZXJbcGxheWVyXS5mbi50b1VwcGVyQ2FzZSgpLFxuICAgICAgICAgIHJvc3Rlck9ialt0ZWFtXS5yb3N0ZXJbcGxheWVyXS5sbi50b1VwcGVyQ2FzZSgpLFxuICAgICAgICAgIHJvc3Rlck9ialt0ZWFtXS5yb3N0ZXJbcGxheWVyXS5zdGF0c1tzdGF0XSxcbiAgICAgICAgICByb3N0ZXJPYmpbdGVhbV0ucm9zdGVyW3BsYXllcl0ucGlkXG4gICAgICAgIF0pO1xuICAgICAgfVxuICAgIH1cbiAgfVxuICBmb3IgKHZhciB0ZWFtIGluIHJvc3Rlck9iaikge1xuICAgIGZvciAodmFyIHN0YXQgaW4gcm9zdGVyT2JqW3RlYW1dLmxlYWRlcnMpIHtcbiAgICAgIHJvc3Rlck9ialt0ZWFtXS5sZWFkZXJzW3N0YXRdLnNvcnQoZnVuY3Rpb24oYSwgYikge1xuICAgICAgICByZXR1cm4gYlsyXSAtIGFbMl07XG4gICAgICB9KTtcbiAgICB9XG4gIH1cbiAgY29uc29sZS5sb2coXCJTT1JURUQ6XCIpO1xuICBjb25zb2xlLmxvZyhyb3N0ZXJPYmopO1xufVxuXG5mdW5jdGlvbiBzdGF0c05vdEF2YWlsYWJsZShwaWQpIHtcbiAgcm9zdGVyT2JqW3BpZF0uc3RhdHMgPSB7fTtcbiAgcm9zdGVyT2JqW3BpZF0uc3RhdHMuc2EgPSBbe31dO1xuICByb3N0ZXJPYmpbcGlkXS5zdGF0cy5oYXNTdGF0cyA9IGZhbHNlO1xuICB2YXIgY2FJbmRleCA9IFtcbiAgICBcImdwXCIsXG4gICAgXCJnc1wiLFxuICAgIFwibWluXCIsXG4gICAgXCJmZ3BcIixcbiAgICBcInRwcFwiLFxuICAgIFwiZnRwXCIsXG4gICAgXCJvcmViXCIsXG4gICAgXCJkcmViXCIsXG4gICAgXCJyZWJcIixcbiAgICBcImFzdFwiLFxuICAgIFwic3RsXCIsXG4gICAgXCJibGtcIixcbiAgICBcInRvdlwiLFxuICAgIFwicGZcIixcbiAgICBcInB0c1wiLFxuICAgIFwibm9zdGF0c1wiXG4gIF07XG4gIHZhciBzYUluZGV4ID0gW1xuICAgIFwidGlkXCIsXG4gICAgXCJ2YWxcIixcbiAgICBcImdwXCIsXG4gICAgXCJnc1wiLFxuICAgIFwibWluXCIsXG4gICAgXCJmZ3BcIixcbiAgICBcInRwcFwiLFxuICAgIFwiZnRwXCIsXG4gICAgXCJvcmViXCIsXG4gICAgXCJkcmViXCIsXG4gICAgXCJyZWJcIixcbiAgICBcImFzdFwiLFxuICAgIFwic3RsXCIsXG4gICAgXCJibGtcIixcbiAgICBcInRvdlwiLFxuICAgIFwicGZcIixcbiAgICBcInB0c1wiLFxuICAgIFwic3BsXCIsXG4gICAgXCJ0YVwiLFxuICAgIFwidG5cIixcbiAgICBcInRjXCJcbiAgXTtcbiAgZm9yICh2YXIgaSA9IDA7IGkgPCBzYUluZGV4Lmxlbmd0aDsgaSsrKSB7XG4gICAgcm9zdGVyT2JqW3BpZF0uc3RhdHMuc2FbMF1bc2FJbmRleFtpXV0gPSBcIk4vQVwiO1xuICAgIGlmIChpID09PSAxKSB7XG4gICAgICByb3N0ZXJPYmpbcGlkXS5zdGF0cy5zYVswXVtzYUluZGV4W2ldXSA9XG4gICAgICAgIHBsYXllckNhcmRZZWFyLnRvU3RyaW5nKCkuc3Vic3RyKDIsIDIpICtcbiAgICAgICAgXCItXCIgK1xuICAgICAgICAocGxheWVyQ2FyZFllYXIgKyAxKS50b1N0cmluZygpLnN1YnN0cigyLCAyKTtcbiAgICB9XG4gICAgaWYgKGkgPT09IDE3KSB7XG4gICAgICByb3N0ZXJPYmpbcGlkXS5zdGF0cy5zYVswXVtzYUluZGV4W2ldXSA9IFtdO1xuICAgIH1cbiAgICBpZiAoaSA9PT0gMTgpIHtcbiAgICAgIHJvc3Rlck9ialtwaWRdLnN0YXRzLnNhWzBdW3NhSW5kZXhbaV1dID0gXCJCT1NcIjtcbiAgICB9XG4gIH1cbiAgZm9yICh2YXIgaSA9IDA7IGkgPCBjYUluZGV4Lmxlbmd0aDsgaSsrKSB7XG4gICAgcm9zdGVyT2JqW3BpZF0uc3RhdHNbY2FJbmRleFtpXV0gPSBcIk4vQVwiO1xuICAgIGlmIChpID09PSAxNSkge1xuICAgICAgcm9zdGVyT2JqW3BpZF0uc3RhdHNbY2FJbmRleFtpXV0gPSB0cnVlO1xuICAgIH1cbiAgfVxufVxuXG5mdW5jdGlvbiBsb2FkR2FtZURldGFpbChnaWQpIHt9XG5cbmZ1bmN0aW9uIGxvYWRBd2F5VGVhbURhdGEoKSB7fVxuLyo9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG49ICAgICAgICAgICAgUklHSFQgV1JBUCAgICAgICAgICAgID1cbj09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT0qL1xuZnVuY3Rpb24gcGxheWVyU3BvdGxpZ2h0KHJvc3Rlck9iaikge1xuICAvKiAxIC0gV0hJVEUgTElORSBIT1JJWlRPTkFMICovXG4gIHNldFRpbWVvdXQoZnVuY3Rpb24oKSB7XG4gICAgalF1ZXJ5KFwiLndoaXRlLWxpbmUuaG9yaXpvbnRhbFwiKS5hZGRDbGFzcyhcInRyYW5zaXRpb24tMVwiKTtcbiAgfSwgNTAwKTtcbiAgc2V0VGltZW91dChmdW5jdGlvbigpIHtcbiAgICBqUXVlcnkoXCIuc29jaWFsLXRvcCAud2hpdGUtbGluZS52ZXJ0aWNhbDpudGgtY2hpbGQob2RkKVwiKS5hZGRDbGFzcyhcbiAgICAgIFwidHJhbnNpdGlvbi0xXCJcbiAgICApO1xuICAgIGpRdWVyeShcIi5zb2NpYWwtYm90dG9tIC53aGl0ZS1saW5lLnZlcnRpY2FsOm50aC1jaGlsZChldmVuKVwiKS5hZGRDbGFzcyhcbiAgICAgIFwidHJhbnNpdGlvbi0xXCJcbiAgICApO1xuICB9LCA4MDApO1xuICAvKiAyYiAtIFdISVRFIExJTkUgVkVSVElDQUwgKi9cbiAgc2V0VGltZW91dChmdW5jdGlvbigpIHtcbiAgICBqUXVlcnkoXCIuc29jaWFsLXRvcCAud2hpdGUtbGluZS52ZXJ0aWNhbDpudGgtY2hpbGQoZXZlbilcIikuYWRkQ2xhc3MoXG4gICAgICBcInRyYW5zaXRpb24tMVwiXG4gICAgKTtcbiAgICBqUXVlcnkoXCIuc29jaWFsLWJvdHRvbSAud2hpdGUtbGluZS52ZXJ0aWNhbDpudGgtY2hpbGQob2RkKVwiKS5hZGRDbGFzcyhcbiAgICAgIFwidHJhbnNpdGlvbi0xXCJcbiAgICApO1xuICB9LCAxMDAwKTtcbiAgLyogMyAtIEdFTkVSQVRFIEFORCBSRVZFQUwgUExBWUVSIEJPWEVTICovXG4gIHNldFRpbWVvdXQoZnVuY3Rpb24oKSB7XG4gICAgalF1ZXJ5KFwiLnNvY2lhbC10b3AsIC5zb2NpYWwtYm90dG9tXCIpLmFkZENsYXNzKFwidHJhbnNpdGlvbi0xXCIpO1xuICAgIGpRdWVyeShcIi5wbGF5ZXItYm94LXdyYXBcIikuYWRkQ2xhc3MoXCJ0cmFuc2l0aW9uLTFcIik7XG4gIH0sIDEyMDApO1xuICAvKiA0IC0gQVBQRU5EIEhFQURTSE9UUyAqL1xuICBzZXRUaW1lb3V0KGZ1bmN0aW9uKCkge1xuICAgIGpRdWVyeShcIi5wbGF5ZXItYm94LXdyYXBcIikuYWRkQ2xhc3MoXCJ0cmFuc2l0aW9uLTJcIik7XG4gICAgalF1ZXJ5KFwiLnBsYXllci1ib3hcIikuYWRkQ2xhc3MoXCJ0cmFuc2l0aW9uLTFcIik7XG4gICAgdmFyIGRlbGF5ID0gMDtcbiAgICB2YXIgZm9yaW5Db3VudGVyID0gMDtcbiAgICBmb3IgKHZhciBwbGF5ZXIgaW4gcm9zdGVyT2JqLmNlbHRpY3Mucm9zdGVyKSB7XG4gICAgICB2YXIgaGVhZHNob3QgPVxuICAgICAgICBcImh0dHBzOi8vYWstc3RhdGljLmNtcy5uYmEuY29tL3dwLWNvbnRlbnQvdXBsb2Fkcy9oZWFkc2hvdHMvbmJhL2xhdGVzdC8xMDQweDc2MC9cIiArXG4gICAgICAgIHJvc3Rlck9iai5jZWx0aWNzLnJvc3RlcltwbGF5ZXJdLnBpZCArXG4gICAgICAgIFwiLnBuZ1wiO1xuICAgICAgalF1ZXJ5KFwiLnBsYXllci1ib3g6bnRoLWNoaWxkKFwiICsgKGZvcmluQ291bnRlciArIDEpICsgXCIpXCIpLmFwcGVuZChcbiAgICAgICAgJzxpbWcgY2xhc3M9XCJhcHBlbmRlZCBoZWFkc2hvdFwiIHNyYz1cIicgKyBoZWFkc2hvdCArICdcIi8+J1xuICAgICAgKTtcbiAgICAgIGpRdWVyeShcIi5wbGF5ZXItYm94Om50aC1jaGlsZChcIiArIChmb3JpbkNvdW50ZXIgKyAxKSArIFwiKVwiKS5hdHRyKFxuICAgICAgICBcImRhdGEtcGlkXCIsXG4gICAgICAgIHJvc3Rlck9iai5jZWx0aWNzLnJvc3RlcltwbGF5ZXJdLnBpZFxuICAgICAgKTtcbiAgICAgIGpRdWVyeShcIi5wbGF5ZXItYm94IGltZ1wiKS5vbihcImVycm9yXCIsIGZ1bmN0aW9uKCkge1xuICAgICAgICBqUXVlcnkodGhpcykuYXR0cihcbiAgICAgICAgICBcInNyY1wiLFxuICAgICAgICAgIFwiaHR0cHM6Ly9pLmNkbi50dXJuZXIuY29tL25iYS9uYmEvLmVsZW1lbnQvbWVkaWEvMi4wL3RlYW1zaXRlcy9jZWx0aWNzL21lZGlhL2dlbmVyaWMtcGxheWVyLWxpZ2h0XzYwMHg0MzgucG5nXCJcbiAgICAgICAgKTtcbiAgICAgIH0pO1xuICAgICAgalF1ZXJ5KFwiLnBsYXllci1ib3g6bnRoLWNoaWxkKFwiICsgKGZvcmluQ291bnRlciArIDEpICsgXCIpIGltZ1wiKVxuICAgICAgICAuZGVsYXkoZGVsYXkpXG4gICAgICAgIC5mYWRlVG8oMzAwLCAxKTtcbiAgICAgIGRlbGF5ICs9IDMwO1xuICAgICAgZm9yaW5Db3VudGVyKys7XG4gICAgfVxuICB9LCAxNzAwKTtcbiAgLyogNSAtIFBMQVlFUiBTRUxFQ1QgKi9cbiAgdmFyIHNlbGVjdGVkUGxheWVyID0gXCJcIjtcbiAgc2V0VGltZW91dChmdW5jdGlvbigpIHtcbiAgICBqUXVlcnkoXCIucGxheWVyLWJveFwiKS5hZGRDbGFzcyhcInRyYW5zaXRpb24tMlwiKTtcbiAgICBqUXVlcnkoXCIucGxheWVyLWJveDpudGgtY2hpbGQoXCIgKyBwbGF5ZXJTcG90bGlnaHRDb3VudGVyICsgXCIpXCIpLmFkZENsYXNzKFxuICAgICAgXCJzZWxlY3RlZFwiXG4gICAgKTtcbiAgICBzZWxlY3RlZFBsYXllciA9IGpRdWVyeShcbiAgICAgIFwiLnBsYXllci1ib3g6bnRoLWNoaWxkKFwiICsgcGxheWVyU3BvdGxpZ2h0Q291bnRlciArIFwiKVwiXG4gICAgKS5hdHRyKFwiZGF0YS1waWRcIik7XG4gICAgc2V0VGltZW91dChmdW5jdGlvbigpIHtcbiAgICAgIGpRdWVyeShcIi5wbGF5ZXItYm94XCIpXG4gICAgICAgIC5ub3QoXCIucmVwbGFjZW1lbnQuc2VsZWN0ZWRcIilcbiAgICAgICAgLmFkZENsYXNzKFwidHJhbnNpdGlvbi00XCIpO1xuICAgIH0sIDgwMCk7XG4gIH0sIDMwMDApO1xuICAvKiA2IC0gUExBWUVSIEJPWCBFWFBBTkQgKi9cbiAgc2V0VGltZW91dChmdW5jdGlvbigpIHtcbiAgICBqUXVlcnkoXCIuYmxvY2std3JhcC5zb2NpYWxcIikuYWRkQ2xhc3MoXCJ0cmFuc2l0aW9uLTNcIik7XG4gICAgalF1ZXJ5KFwiLnBsYXllci1ib3gucmVwbGFjZW1lbnQuc2VsZWN0ZWRcIikuYWRkQ2xhc3MoXCJ0cmFuc2l0aW9uLTNcIik7XG4gIH0sIDQwMDApO1xuICAvKiA3IC0gU1BPVExJR0hUIEhUTUwgKi9cbiAgc2V0VGltZW91dChmdW5jdGlvbigpIHtcbiAgICBnZW5lcmF0ZVRpbWVsaW5lKHNlbGVjdGVkUGxheWVyKTtcbiAgICBqUXVlcnkoXCIucGxheWVyLWJveC5yZXBsYWNlbWVudC5zZWxlY3RlZFwiKVxuICAgICAgLmNsb25lKClcbiAgICAgIC5hcHBlbmRUbyhcIi5ibG9jay13cmFwLnBsYXllci1zcG90bGlnaHQgLnRvcC13cmFwXCIpO1xuICAgIGpRdWVyeShcIi5wbGF5ZXItc3BvdGxpZ2h0IC5zZWxlY3RlZFwiKS5hZGRDbGFzcyhcIi5hcHBlbmRlZFwiKTtcbiAgICBqUXVlcnkoXCIuYmxvY2std3JhcC5wbGF5ZXItc3BvdGxpZ2h0XCIpLmFkZENsYXNzKFwidHJhbnNpdGlvbi0xXCIpO1xuICAgIGpRdWVyeShcIi5ibG9jay13cmFwLnNvY2lhbFwiKS5hZGRDbGFzcyhcInRyYW5zaXRpb24tMVwiKTtcbiAgICB2YXIgc3RhdHMgPSByb3N0ZXJPYmouY2VsdGljcy5yb3N0ZXJbc2VsZWN0ZWRQbGF5ZXJdLnN0YXRzO1xuICAgIGpRdWVyeShcIi5wbGF5ZXItc3BvdGxpZ2h0IC50b3Atd3JhcCAucGxheWVyLXRvcFwiKS5hcHBlbmQoXG4gICAgICAnPGltZyBjbGFzcz1cInNpbG8gYXBwZW5kZWRcIiBzcmM9XCJodHRwOi8vaW8uY25uLm5ldC9uYmEvbmJhLy5lbGVtZW50L21lZGlhLzIuMC90ZWFtc2l0ZXMvY2VsdGljcy9tZWRpYS9zaWxvLTQ2Nng1OTEtJyArXG4gICAgICAgIHJvc3Rlck9iai5jZWx0aWNzLnJvc3RlcltzZWxlY3RlZFBsYXllcl0ucGlkICtcbiAgICAgICAgJy5wbmdcIiAvPjxkaXYgY2xhc3M9XCJ0b3AgYXBwZW5kZWRcIj48ZGl2IGNsYXNzPVwicGxheWVyLW5hbWUtd3JhcFwiPjxwIGNsYXNzPVwicGxheWVyLW5hbWVcIj48c3Bhbj4nICtcbiAgICAgICAgcm9zdGVyT2JqLmNlbHRpY3Mucm9zdGVyW3NlbGVjdGVkUGxheWVyXS5mbi50b1VwcGVyQ2FzZSgpICtcbiAgICAgICAgXCI8L3NwYW4+IDxicj4gXCIgK1xuICAgICAgICByb3N0ZXJPYmouY2VsdGljcy5yb3N0ZXJbc2VsZWN0ZWRQbGF5ZXJdLmxuLnRvVXBwZXJDYXNlKCkgK1xuICAgICAgICAnPC9wPjwvZGl2PjxwIGNsYXNzPVwicGxheWVyLW51bWJlclwiPicgK1xuICAgICAgICByb3N0ZXJPYmouY2VsdGljcy5yb3N0ZXJbc2VsZWN0ZWRQbGF5ZXJdLm51bSArXG4gICAgICAgIFwiPC9icj48c3Bhbj5cIiArXG4gICAgICAgIHJvc3Rlck9iai5jZWx0aWNzLnJvc3RlcltzZWxlY3RlZFBsYXllcl0ucG9zICtcbiAgICAgICAgJzwvc3Bhbj48L3A+PC9kaXY+PGRpdiBjbGFzcz1cIm1pZGRsZSBhcHBlbmRlZFwiPjx1bCBjbGFzcz1cImluZm8gY2xlYXJmaXhcIj48bGk+PHA+QUdFPHNwYW4gY2xhc3M9XCJzbS1oaWRlXCI+OiZuYnNwOzwvc3Bhbj4gPC9icj48c3BhbiBjbGFzcz1cImluZm8tdmFsdWVcIj4nICtcbiAgICAgICAgcGxheWVyQWdlKHJvc3Rlck9iai5jZWx0aWNzLnJvc3RlcltzZWxlY3RlZFBsYXllcl0uZG9iKSArXG4gICAgICAgICc8L3NwYW4+PC9wPjwvbGk+PGxpPjxwPkhUPHNwYW4gY2xhc3M9XCJzbS1oaWRlXCI+OiZuYnNwOzwvc3Bhbj4gPC9icj48c3BhbiBjbGFzcz1cImluZm8tdmFsdWVcIj4nICtcbiAgICAgICAgcm9zdGVyT2JqLmNlbHRpY3Mucm9zdGVyW3NlbGVjdGVkUGxheWVyXS5odCArXG4gICAgICAgICc8L3NwYW4+PC9wPjwvbGk+PGxpPjxwPldUPHNwYW4gY2xhc3M9XCJzbS1oaWRlXCI+OiZuYnNwOzwvc3Bhbj4gPC9icj48c3BhbiBjbGFzcz1cImluZm8tdmFsdWVcIj4nICtcbiAgICAgICAgcm9zdGVyT2JqLmNlbHRpY3Mucm9zdGVyW3NlbGVjdGVkUGxheWVyXS53dCArXG4gICAgICAgICc8L3NwYW4+PC9wPjwvbGk+PC91bD48L2Rpdj48ZGl2IGNsYXNzPVwiYm90dG9tIGZ1bGwgY2xlYXJmaXggc20taGlkZSBhcHBlbmRlZFwiPjx0YWJsZSBjbGFzcz1cImF2ZXJhZ2VzXCI+PHRyIGNsYXNzPVwiYXZlcmFnZXMtbGFiZWxzXCI+PHRkPjxwPkdQPC9wPjwvdGQ+PHRkPjxwPlBQRzwvcD48L3RkPjx0ZD48cD5SUEc8L3A+PC90ZD48dGQ+PHA+QVBHPC9wPjwvdGQ+PC90cj48dHIgY2xhc3M9XCJhdmVyYWdlcy1zZWFzb25cIj48dGQgY2xhc3M9XCJncFwiPjxwPjwvcD48L3RkPjx0ZCBjbGFzcz1cInB0c1wiPjxwPjwvcD48L3RkPjx0ZCBjbGFzcz1cInJlYlwiPjxwPjwvcD48L3RkPjx0ZCBjbGFzcz1cImFzdFwiPjxwPjwvcD48L3RkPjwvdHI+PC90YWJsZT48L2Rpdj4nXG4gICAgKTtcbiAgICBqUXVlcnkoXCIucGxheWVyLXNwb3RsaWdodCAuYXZlcmFnZXMtc2Vhc29uXCIpLmh0bWwoXG4gICAgICAnPHRkIGNsYXNzPVwiYXBwZW5kZWRcIj48cD4nICtcbiAgICAgICAgc3RhdHMuc2FbMF0uZ3AgK1xuICAgICAgICAnPC9wPjwvdGQ+PHRkIGNsYXNzPVwiYXBwZW5kZWRcIj48cD4nICtcbiAgICAgICAgc3RhdHMuc2FbMF0ucHRzICtcbiAgICAgICAgJzwvcD48L3RkPjx0ZCBjbGFzcz1cImFwcGVuZGVkXCI+PHA+JyArXG4gICAgICAgIHN0YXRzLnNhWzBdLnJlYiArXG4gICAgICAgICc8L3A+PC90ZD48dGQgY2xhc3M9XCJhcHBlbmRlZFwiPjxwPicgK1xuICAgICAgICBzdGF0cy5zYVswXS5hc3QgK1xuICAgICAgICBcIjwvcD48L3RkPlwiXG4gICAgKTtcbiAgICBqUXVlcnkoXCIucGxheWVyLXNwb3RsaWdodCAucGxheWVyLW5hbWVcIikuZmFkZVRvKDIwMCwgMSk7XG4gICAgdmFyIHBsYXllckZhY3RzID0gcm9zdGVyT2JqLmNlbHRpY3Mucm9zdGVyW3NlbGVjdGVkUGxheWVyXS5iaW8ucGVyc29uYWw7XG4gICAgZm9yICh2YXIgaSA9IDA7IGkgPCAzOyBpKyspIHtcbiAgICAgIGlmIChpIDw9IHJvc3Rlck9iai5jZWx0aWNzLnJvc3RlcltzZWxlY3RlZFBsYXllcl0uYmlvLnBlcnNvbmFsLmxlbmd0aCkge1xuICAgICAgICBqUXVlcnkoXCIucGxheWVyLXNwb3RsaWdodCAuYm90dG9tLXdyYXBcIikuYXBwZW5kKFxuICAgICAgICAgICc8ZGl2IGNsYXNzPVwiZHlrLWJveCBhcHBlbmRlZFwiPjxwPicgKyBwbGF5ZXJGYWN0c1tpXSArIFwiPC9wPjwvZGl2PlwiXG4gICAgICAgICk7XG4gICAgICB9XG4gICAgfVxuICAgIGpRdWVyeShcIi5wbGF5ZXItc3BvdGxpZ2h0IC5ib3R0b20td3JhcFwiKS5hZGRDbGFzcyhcInRyYW5zaXRpb24tMVwiKTtcbiAgICBpZiAoalF1ZXJ5KFwiLnBsYXllci1zcG90bGlnaHQgLmJvdHRvbS13cmFwIC5keWstYm94XCIpLmxlbmd0aCA+IDEpIHtcbiAgICAgIHNldFRpbWVvdXQoZnVuY3Rpb24oKSB7XG4gICAgICAgIGpRdWVyeShcbiAgICAgICAgICBcIi5wbGF5ZXItc3BvdGxpZ2h0IC5ib3R0b20td3JhcCAuZHlrLWJveDpudGgtb2YtdHlwZSgyKVwiXG4gICAgICAgICkuYWRkQ2xhc3MoXCJ0cmFuc2l0aW9uLTJcIik7XG4gICAgICAgIGpRdWVyeShcbiAgICAgICAgICBcIi5wbGF5ZXItc3BvdGxpZ2h0IC5ib3R0b20td3JhcCAuZHlrLWJveDpudGgtb2YtdHlwZSgzKVwiXG4gICAgICAgICkuYWRkQ2xhc3MoXCJ0cmFuc2l0aW9uLTFcIik7XG4gICAgICB9LCAxMDAwMCk7XG4gICAgfVxuICAgIGlmIChqUXVlcnkoXCIucGxheWVyLXNwb3RsaWdodCAuYm90dG9tLXdyYXAgLmR5ay1ib3hcIikubGVuZ3RoID4gMikge1xuICAgICAgc2V0VGltZW91dChmdW5jdGlvbigpIHtcbiAgICAgICAgalF1ZXJ5KFxuICAgICAgICAgIFwiLnBsYXllci1zcG90bGlnaHQgLmJvdHRvbS13cmFwIC5keWstYm94Om50aC1vZi10eXBlKDMpXCJcbiAgICAgICAgKS5hZGRDbGFzcyhcInRyYW5zaXRpb24tMlwiKTtcbiAgICAgICAgalF1ZXJ5KFxuICAgICAgICAgIFwiLnBsYXllci1zcG90bGlnaHQgLmJvdHRvbS13cmFwIC5keWstYm94Om50aC1vZi10eXBlKDQpXCJcbiAgICAgICAgKS5hZGRDbGFzcyhcInRyYW5zaXRpb24tMVwiKTtcbiAgICAgIH0sIDIwMDAwKTtcbiAgICB9XG4gIH0sIDUwMDApO1xuICAvKiA4IC0gU1BPVExJR0hUIFNMSURFIElOICovXG4gIHNldFRpbWVvdXQoZnVuY3Rpb24oKSB7XG4gICAgalF1ZXJ5KFxuICAgICAgXCIucGxheWVyLXNwb3RsaWdodCAucGxheWVyLXRvcCAucGxheWVyLW5hbWUsIC5wbGF5ZXItc3BvdGxpZ2h0IC5wbGF5ZXItbmFtZS13cmFwLCAucGxheWVyLXNwb3RsaWdodCAuaGVhZHNob3QsIC5wbGF5ZXItc3BvdGxpZ2h0IC5pbmZvLCAucGxheWVyLXNwb3RsaWdodCAuc2lsbywgLnBsYXllci1zcG90bGlnaHQgLmF2ZXJhZ2VzLCAucGxheWVyLXNwb3RsaWdodCAucGxheWVyLW51bWJlclwiXG4gICAgKS5hZGRDbGFzcyhcInRyYW5zaXRpb24tMVwiKTtcbiAgICBzZXRUaW1lb3V0KGZ1bmN0aW9uKCkge1xuICAgICAgalF1ZXJ5KFwiLmJsb2NrLXdyYXAucGxheWVyLXNwb3RsaWdodCAucGxheWVyLWJveFwiKS5yZW1vdmUoKTtcbiAgICB9LCAxNTAwMCk7XG4gICAgaWYgKHBsYXllclNwb3RsaWdodENvdW50ZXIgPCAxNikge1xuICAgICAgcGxheWVyU3BvdGxpZ2h0Q291bnRlcisrO1xuICAgIH0gZWxzZSB7XG4gICAgICBwbGF5ZXJTcG90bGlnaHRDb3VudGVyID0gMDtcbiAgICB9XG4gIH0sIDYwMDApO1xuICAvKiA5IC0gU1BPVExJR0hUIFNMSURFIE9VVCAqL1xuICBzZXRUaW1lb3V0KGZ1bmN0aW9uKCkge1xuICAgIGpRdWVyeShcbiAgICAgIFwiLnBsYXllci1zcG90bGlnaHQgLmJvdHRvbS13cmFwLCAucGxheWVyLXNwb3RsaWdodCAudG9wLXdyYXBcIlxuICAgICkuYWRkQ2xhc3MoXCJ0cmFuc2l0aW9uLTJcIik7XG4gIH0sIDQwMDAwKTtcbiAgLyogMTAgLSBET05FLiBSRU1PVkUgKi9cbiAgc2V0VGltZW91dChmdW5jdGlvbigpIHtcbiAgICBqUXVlcnkoXCIgLnBsYXllci1zcG90bGlnaHQgLmFwcGVuZGVkXCIpLnJlbW92ZSgpO1xuICAgIGpRdWVyeShcIiAucGxheWVyLXNwb3RsaWdodCAuc2VsZWN0ZWRcIikucmVtb3ZlQ2xhc3MoXCJzZWxlY3RlZFwiKTtcbiAgICBmb3IgKHZhciBpID0gMTsgaSA8IDEwOyBpKyspIHtcbiAgICAgIGpRdWVyeShcIi5yaWdodC13cmFwIC50cmFuc2l0aW9uLVwiICsgaSkucmVtb3ZlQ2xhc3MoXCJ0cmFuc2l0aW9uLVwiICsgaSk7XG4gICAgfVxuICB9LCA0NTAwMCk7XG59XG5cbmZ1bmN0aW9uIGxlYWRlcnMoZ2lkLCBnYW1lU3RhcnRlZCkge1xuICBqUXVlcnkoXCIubGVhZGVyc1wiKS5hZGRDbGFzcyhcImFjdGl2ZVwiKTtcbiAgdmFyIGdhbWVEZXRhaWwgPSBcIlwiO1xuICB2YXIgZGV0YWlsQXZhaWxhYmxlID0gZmFsc2U7XG4gIHZhciBsZWFkZXJzVGl0bGUgPSBcIlNFQVNPTiBMRUFERVJTXCI7XG4gIGlmIChjaGVja0dhbWVTdGF0dXMoKSkge1xuICAgIGxlYWRlcnNUaXRsZSA9IFwiR0FNRSBMRUFERVJTXCI7XG4gICAgalF1ZXJ5LmFqYXgoe1xuICAgICAgdXJsOiBmZWVkcy5nYW1lZGV0YWlsKGdpZCksXG4gICAgICBhc3luYzogZmFsc2UsXG4gICAgICBzdWNjZXNzOiBmdW5jdGlvbihkYXRhKSB7XG4gICAgICAgIHZhciB0ZWFtTGluZVNjb3JlID0gW1wiaGxzXCIsIFwidmxzXCJdO1xuICAgICAgICBmb3IgKHZhciB4ID0gMDsgeCA8IHRlYW1MaW5lU2NvcmUubGVuZ3RoOyB4KyspIHtcbiAgICAgICAgICB2YXIgc3RhdHMgPSBkYXRhLmdbdGVhbUxpbmVTY29yZVt4XV07XG4gICAgICAgICAgdmFyIHRlYW0gPSBcIlwiO1xuICAgICAgICAgIGlmIChzdGF0cy50YSA9PT0gXCJCT1NcIikge1xuICAgICAgICAgICAgdGVhbSA9IFwiY2VsdGljc1wiO1xuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICB0ZWFtID0gXCJhd2F5XCI7XG4gICAgICAgICAgfVxuICAgICAgICAgIGZvciAodmFyIHN0YXQgaW4gcm9zdGVyT2JqW3RlYW1dLmxlYWRlcnMpIHtcbiAgICAgICAgICAgIHJvc3Rlck9ialt0ZWFtXS5sZWFkZXJzW3N0YXRdID0gW1xuICAgICAgICAgICAgICBbXCItLVwiLCBcIi0tXCIsIDAsIFwiLS1cIl0sXG4gICAgICAgICAgICAgIFtcIi0tXCIsIFwiLS1cIiwgMCwgXCItLVwiXSxcbiAgICAgICAgICAgICAgW1wiLS1cIiwgXCItLVwiLCAwLCBcIi0tXCJdXG4gICAgICAgICAgICBdO1xuICAgICAgICAgIH1cbiAgICAgICAgICBmb3IgKHZhciBwID0gMDsgcCA8IHN0YXRzLnBzdHNnLmxlbmd0aDsgcCsrKSB7XG4gICAgICAgICAgICBmb3IgKHZhciBzdGF0IGluIHJvc3Rlck9ialt0ZWFtXS5sZWFkZXJzKSB7XG4gICAgICAgICAgICAgIHJvc3Rlck9ialt0ZWFtXS5sZWFkZXJzW3N0YXRdLnB1c2goW1xuICAgICAgICAgICAgICAgIHN0YXRzLnBzdHNnW3BdLmZuLnRvVXBwZXJDYXNlKCksXG4gICAgICAgICAgICAgICAgc3RhdHMucHN0c2dbcF0ubG4udG9VcHBlckNhc2UoKSxcbiAgICAgICAgICAgICAgICBzdGF0cy5wc3RzZ1twXVtzdGF0XSxcbiAgICAgICAgICAgICAgICBzdGF0cy5wc3RzZ1twXS5waWRcbiAgICAgICAgICAgICAgXSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICByb3N0ZXJPYmpbdGVhbV0ubGVhZGVyc1tzdGF0XS5zb3J0KGZ1bmN0aW9uKGEsIGIpIHtcbiAgICAgICAgICAgICAgcmV0dXJuIGFbMl0gLSBiWzJdO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgfVxuICAgICAgICAgIGZvciAodmFyIHRlYW0gaW4gcm9zdGVyT2JqKSB7XG4gICAgICAgICAgICBmb3IgKHZhciBzdGF0IGluIHJvc3Rlck9ialt0ZWFtXS5sZWFkZXJzKSB7XG4gICAgICAgICAgICAgIHJvc3Rlck9ialt0ZWFtXS5sZWFkZXJzW3N0YXRdLnNvcnQoZnVuY3Rpb24oYSwgYikge1xuICAgICAgICAgICAgICAgIHJldHVybiBiWzJdIC0gYVsyXTtcbiAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuICAgICAgICAgIGNvbnNvbGUubG9nKFwiU09SVEVEOlwiKTtcbiAgICAgICAgICBjb25zb2xlLmxvZyhyb3N0ZXJPYmopO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfSk7XG4gIH1cbiAgalF1ZXJ5KFwiLmxlYWRlcnMtdGl0bGVcIikuaHRtbChsZWFkZXJzVGl0bGUpO1xuICBmb3IgKHZhciB0ZWFtIGluIHJvc3Rlck9iaikge1xuICAgIGZvciAodmFyIGkgPSAwOyBpIDwgMzsgaSsrKSB7XG4gICAgICBmb3IgKHZhciBzdGF0IGluIHJvc3Rlck9ialt0ZWFtXS5sZWFkZXJzKSB7XG4gICAgICAgIC8vIExFQURFUiBTVEFUIFZBTFVFXG4gICAgICAgIGpRdWVyeShcbiAgICAgICAgICBcIi5sZWFkZXItc2VjdGlvbjpudGgtb2YtdHlwZShcIiArXG4gICAgICAgICAgICAoaSArIDIpICtcbiAgICAgICAgICAgIFwiKSAuXCIgK1xuICAgICAgICAgICAgc3RhdCArXG4gICAgICAgICAgICBcIi5cIiArXG4gICAgICAgICAgICB0ZWFtICtcbiAgICAgICAgICAgIFwiIC5zdGF0XCJcbiAgICAgICAgKS5odG1sKFxuICAgICAgICAgICc8c3BhbiBjbGFzcz1cImFwcGVuZGVkICcgK1xuICAgICAgICAgICAgcm9zdGVyT2JqW3RlYW1dLnRhICtcbiAgICAgICAgICAgICdcIj4nICtcbiAgICAgICAgICAgIHJvc3Rlck9ialt0ZWFtXS5sZWFkZXJzW3N0YXRdW2ldWzJdICtcbiAgICAgICAgICAgIFwiPC9zcGFuPiBcIiArXG4gICAgICAgICAgICBzdGF0LnRvVXBwZXJDYXNlKClcbiAgICAgICAgKTtcbiAgICAgICAgLy8gTEVBREVSIE5BTUVcbiAgICAgICAgaWYgKFxuICAgICAgICAgIHJvc3Rlck9ialt0ZWFtXS5sZWFkZXJzW3N0YXRdW2ldWzBdLmxlbmd0aCArXG4gICAgICAgICAgICByb3N0ZXJPYmpbdGVhbV0ubGVhZGVyc1tzdGF0XVtpXVsxXS5sZW5ndGggPj1cbiAgICAgICAgICAxNFxuICAgICAgICApIHtcbiAgICAgICAgICByb3N0ZXJPYmpbdGVhbV0ubGVhZGVyc1tzdGF0XVtpXVswXSA9XG4gICAgICAgICAgICByb3N0ZXJPYmpbdGVhbV0ubGVhZGVyc1tzdGF0XVtpXVswXS5zdWJzdHIoMCwgMSkgKyBcIi5cIjtcbiAgICAgICAgfVxuICAgICAgICBqUXVlcnkoXG4gICAgICAgICAgXCIubGVhZGVyLXNlY3Rpb246bnRoLW9mLXR5cGUoXCIgK1xuICAgICAgICAgICAgKGkgKyAyKSArXG4gICAgICAgICAgICBcIikgLlwiICtcbiAgICAgICAgICAgIHN0YXQgK1xuICAgICAgICAgICAgXCIuXCIgK1xuICAgICAgICAgICAgdGVhbSArXG4gICAgICAgICAgICBcIiAubmFtZVwiXG4gICAgICAgICkuaHRtbChcbiAgICAgICAgICAnPHNwYW4gY2xhc3M9XCJhcHBlbmRlZFwiPicgK1xuICAgICAgICAgICAgcm9zdGVyT2JqW3RlYW1dLmxlYWRlcnNbc3RhdF1baV1bMF0gK1xuICAgICAgICAgICAgXCI8L3NwYW4+IFwiICtcbiAgICAgICAgICAgIHJvc3Rlck9ialt0ZWFtXS5sZWFkZXJzW3N0YXRdW2ldWzFdXG4gICAgICAgICk7XG4gICAgICAgIC8vIExFQURFUiBIRUFEU0hPVFxuICAgICAgICBqUXVlcnkoXG4gICAgICAgICAgXCIubGVhZGVyLXNlY3Rpb246bnRoLW9mLXR5cGUoXCIgK1xuICAgICAgICAgICAgKGkgKyAyKSArXG4gICAgICAgICAgICBcIikgLlwiICtcbiAgICAgICAgICAgIHN0YXQgK1xuICAgICAgICAgICAgXCIuXCIgK1xuICAgICAgICAgICAgdGVhbSArXG4gICAgICAgICAgICBcIiAuaGVhZHNob3RcIlxuICAgICAgICApLmF0dHIoXG4gICAgICAgICAgXCJzcmNcIixcbiAgICAgICAgICBcImh0dHBzOi8vYWstc3RhdGljLmNtcy5uYmEuY29tL3dwLWNvbnRlbnQvdXBsb2Fkcy9oZWFkc2hvdHMvbmJhL2xhdGVzdC8xMDQweDc2MC9cIiArXG4gICAgICAgICAgICByb3N0ZXJPYmpbdGVhbV0ubGVhZGVyc1tzdGF0XVtpXVszXSArXG4gICAgICAgICAgICBcIi5wbmdcIlxuICAgICAgICApO1xuICAgICAgfVxuICAgIH1cbiAgfVxuICBzZXRUaW1lb3V0KGZ1bmN0aW9uKCkge1xuICAgIGpRdWVyeShcIi5sZWFkZXJzLCAubGVhZGVycyAuYmxvY2staW5uZXJcIikuYWRkQ2xhc3MoXCJ0cmFuc2l0aW9uLTFcIik7XG4gIH0sIDEwMCk7XG4gIHNldFRpbWVvdXQoZnVuY3Rpb24oKSB7XG4gICAgalF1ZXJ5KFwiLmxlYWRlcnMgLmxlYWRlci1zZWN0aW9uXCIpLmFkZENsYXNzKFwidHJhbnNpdGlvbi0xXCIpO1xuICAgIGpRdWVyeShcIi5sZWFkZXItc3Vic2VjdGlvbi5ib3R0b20gcDpudGgtb2YtdHlwZSgxKVwiKS5hZGRDbGFzcyhcbiAgICAgIFwidHJhbnNpdGlvbi0xXCJcbiAgICApO1xuICAgIGpRdWVyeShcbiAgICAgIFwiLmxlYWRlcnMgLmxlYWRlci1zZWN0aW9uIC51bmRlcmxpbmUsIC5sZWFkZXJzIC5sZWFkZXItc3Vic2VjdGlvbi50b3BcIlxuICAgICkuYWRkQ2xhc3Mocm9zdGVyT2JqLmNlbHRpY3MudGEgKyBcIi1iZ1wiKTtcbiAgfSwgMTEwMCk7XG4gIHNldFRpbWVvdXQoZnVuY3Rpb24oKSB7XG4gICAgalF1ZXJ5KFwiLmxlYWRlcnMgLmxlYWRlci1zZWN0aW9uXCIpLmFkZENsYXNzKFwidHJhbnNpdGlvbi0yXCIpO1xuICAgIGpRdWVyeShcIi5sZWFkZXJzIC5ibG9jay1pbm5lclwiKS5hZGRDbGFzcyhcInRyYW5zaXRpb24tMlwiKTtcbiAgfSwgMjEwMCk7XG4gIHZhciB0cmFuc2l0aW9uQ291bnRlciA9IDE7XG4gIHNldFRpbWVvdXQoZnVuY3Rpb24oKSB7XG4gICAgZm9yIChsZXQgaSA9IDE7IGkgPCA2OyBpKyspIHtcbiAgICAgIHNldFRpbWVvdXQoZnVuY3Rpb24obnVtYmVyU3RyaW5nKSB7XG4gICAgICAgIGpRdWVyeShcIi5sZWFkZXJzIC5sZWFkZXItc2VjdGlvbiAubGVhZGVyLXN0YXQtd3JhcFwiKS5hZGRDbGFzcyhcbiAgICAgICAgICBcInRyYW5zaXRpb24tXCIgKyBpXG4gICAgICAgICk7XG4gICAgICAgIGpRdWVyeShcbiAgICAgICAgICBcIi5sZWFkZXJzIC5sZWFkZXItc2VjdGlvbiAudW5kZXJsaW5lLCAubGVhZGVycyAubGVhZGVyLXN1YnNlY3Rpb24udG9wXCJcbiAgICAgICAgKS5yZW1vdmVDbGFzcyhyb3N0ZXJPYmouY2VsdGljcy50YSArIFwiLWJnXCIpO1xuICAgICAgICBqUXVlcnkoXG4gICAgICAgICAgXCIubGVhZGVycyAubGVhZGVyLXNlY3Rpb24gLnVuZGVybGluZSwgLmxlYWRlcnMgLmxlYWRlci1zdWJzZWN0aW9uLnRvcFwiXG4gICAgICAgICkuYWRkQ2xhc3Mocm9zdGVyT2JqLmF3YXkudGEgKyBcIi1iZ1wiKTtcbiAgICAgICAgaWYgKHRyYW5zaXRpb25Db3VudGVyICUgMiA9PSAwKSB7XG4gICAgICAgICAgc2V0VGltZW91dChmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIGpRdWVyeShcbiAgICAgICAgICAgICAgXCIubGVhZGVycyAubGVhZGVyLXNlY3Rpb24gLnVuZGVybGluZSwgLmxlYWRlcnMgLmxlYWRlci1zdWJzZWN0aW9uLnRvcFwiXG4gICAgICAgICAgICApLnJlbW92ZUNsYXNzKHJvc3Rlck9iai5hd2F5LnRhICsgXCItYmdcIik7XG4gICAgICAgICAgICBqUXVlcnkoXG4gICAgICAgICAgICAgIFwiLmxlYWRlcnMgLmxlYWRlci1zZWN0aW9uIC51bmRlcmxpbmUsIC5sZWFkZXJzIC5sZWFkZXItc3Vic2VjdGlvbi50b3BcIlxuICAgICAgICAgICAgKS5hZGRDbGFzcyhyb3N0ZXJPYmouY2VsdGljcy50YSArIFwiLWJnXCIpO1xuICAgICAgICAgICAgalF1ZXJ5KFwiLmxlYWRlci1zdWJzZWN0aW9uLmJvdHRvbSBwXCIpLnJlbW92ZUNsYXNzKFwidHJhbnNpdGlvbi0xXCIpO1xuICAgICAgICAgICAgalF1ZXJ5KFwiLmxlYWRlcnMgLmxlYWRlci1zZWN0aW9uIC51bmRlcmxpbmVcIikuYWRkQ2xhc3MoXG4gICAgICAgICAgICAgIFwidHJhbnNpdGlvbi1cIiArIGkgLyAyXG4gICAgICAgICAgICApO1xuICAgICAgICAgICAgalF1ZXJ5KFxuICAgICAgICAgICAgICBcIi5sZWFkZXItc3Vic2VjdGlvbi5ib3R0b20gcDpudGgtb2YtdHlwZShcIiArIChpIC0gaSAvIDIgKyAxKSArIFwiKVwiXG4gICAgICAgICAgICApLmFkZENsYXNzKFwidHJhbnNpdGlvbi0xXCIpOyAvLyBsb2xcbiAgICAgICAgICB9LCAyMDApO1xuICAgICAgICB9XG4gICAgICAgIHRyYW5zaXRpb25Db3VudGVyKys7XG4gICAgICB9LCA3MDAwICogaSk7XG4gICAgfVxuICB9LCAyMTAwKTtcbiAgc2V0VGltZW91dChmdW5jdGlvbigpIHtcbiAgICBqUXVlcnkoXCIubGVhZGVycyAubGVhZGVyLXNlY3Rpb24sIC5sZWFkZXJzIC5sZWFkZXItc3Vic2VjdGlvblwiKS5hZGRDbGFzcyhcbiAgICAgIFwidHJhbnNpdGlvbi0zXCJcbiAgICApO1xuICB9LCA0NDEwMCk7XG4gIHNldFRpbWVvdXQoZnVuY3Rpb24oKSB7XG4gICAgalF1ZXJ5KFwiLmxlYWRlcnNcIikuYWRkQ2xhc3MoXCJ0cmFuc2l0aW9uLTJcIik7XG4gIH0sIDQ0MTAwKTtcbiAgc2V0VGltZW91dChmdW5jdGlvbigpIHtcbiAgICBqUXVlcnkoXG4gICAgICBcIi5sZWFkZXJzIC5sZWFkZXItc2VjdGlvbiAudW5kZXJsaW5lLCAubGVhZGVycyAubGVhZGVyLXN1YnNlY3Rpb24udG9wXCJcbiAgICApLnJlbW92ZUNsYXNzKHJvc3Rlck9iai5hd2F5LnRhICsgXCItYmdcIik7XG4gICAgalF1ZXJ5KFxuICAgICAgXCIubGVhZGVycyAubGVhZGVyLXNlY3Rpb24gLnVuZGVybGluZSwgLmxlYWRlcnMgLmxlYWRlci1zdWJzZWN0aW9uLnRvcFwiXG4gICAgKS5hZGRDbGFzcyhyb3N0ZXJPYmouY2VsdGljcy50YSArIFwiLWJnXCIpO1xuICAgIGpRdWVyeShcIi5sZWFkZXJzXCIpLnJlbW92ZUNsYXNzKFwiYWN0aXZlXCIpO1xuICAgIGpRdWVyeShcIi5sZWFkZXJzIC5hcHBlbmRlZFwiKS5yZW1vdmUoKTtcbiAgICBmb3IgKHZhciBpID0gMTsgaSA8IDEwOyBpKyspIHtcbiAgICAgIGpRdWVyeShcbiAgICAgICAgXCIubGVhZGVycyAudHJhbnNpdGlvbi1cIiArIGkgKyBcIiwgLmxlYWRlcnMudHJhbnNpdGlvbi1cIiArIGlcbiAgICAgICkucmVtb3ZlQ2xhc3MoXCJ0cmFuc2l0aW9uLVwiICsgaSk7XG4gICAgfVxuICB9LCA0NTAwMCk7XG59XG5cbmZ1bmN0aW9uIHNvY2lhbCgpIHtcbiAgalF1ZXJ5KFwiLnNvY2lhbCAudGV4dC13cmFwLCAuc29jaWFsIC51bmRlcmxpbmVcIikucmVtb3ZlQ2xhc3MoXCJ0cmFuc2l0aW9uLTFcIik7XG4gIGpRdWVyeShcIi5zb2NpYWxcIikuYWRkQ2xhc3MoXCJhY3RpdmVcIik7XG4gIHNldFRpbWVvdXQoZnVuY3Rpb24oKSB7XG4gICAgalF1ZXJ5KFwiLnNvY2lhbCAudGV4dC13cmFwLCAuc29jaWFsIC51bmRlcmxpbmVcIikuYWRkQ2xhc3MoXCJ0cmFuc2l0aW9uLTFcIik7XG4gIH0sIDE1MDAwKTtcbiAgc2V0VGltZW91dChmdW5jdGlvbigpIHtcbiAgICBqUXVlcnkoXCIuc29jaWFsIC5hcHBlbmRlZFwiKS5yZW1vdmUoKTtcbiAgICBqUXVlcnkoXCIuc29jaWFsIC5zZWxlY3RlZFwiKS5yZW1vdmVDbGFzcyhcInNlbGVjdGVkXCIpO1xuICAgIGpRdWVyeShcIi5zb2NpYWxcIikucmVtb3ZlQ2xhc3MoXCJhY3RpdmVcIik7XG4gIH0sIDIwMDAwKTtcbn1cbi8qZnVuY3Rpb24gbW9iaWxlQXBwSW5pdCgpIHtcbiAgICB2YXIgY291bnRlciA9IDE7XG4gICAgc2V0SW50ZXJ2YWwoZnVuY3Rpb24oKSB7XG4gICAgICAgIGpRdWVyeSgnLmFwcCAuYm90dG9tLXdyYXAgaW1nJykucmVtb3ZlQ2xhc3MoJ2FjdGl2ZScpO1xuICAgICAgICBqUXVlcnkoJy5hcHAgLmZlYXR1cmUtbGlzdCBwJykucmVtb3ZlQ2xhc3MoJ2FjdGl2ZScpO1xuICAgICAgICBqUXVlcnkoJy5hcHAgLmZlYXR1cmUtbGlzdCBwOm50aC1vZi10eXBlKCcgKyBjb3VudGVyICsgJyknKS5hZGRDbGFzcygnYWN0aXZlJyk7XG4gICAgICAgIGpRdWVyeSgnLmFwcCAuYm90dG9tLXdyYXAgaW1nOm50aC1vZi10eXBlKCcgKyBjb3VudGVyICsgJyknKS5hZGRDbGFzcygnYWN0aXZlJyk7XG4gICAgICAgIGlmIChjb3VudGVyID09IDUpIHtcbiAgICAgICAgICAgIGNvdW50ZXIgPSAxO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgY291bnRlcisrO1xuICAgICAgICB9XG4gICAgfSwgMjAwMCk7XG59O1xuKi9cbmZ1bmN0aW9uIG1vYmlsZUFwcCgpIHtcbiAgalF1ZXJ5KFwiLmFwcCAuYmxvY2staW5uZXJcIikucmVtb3ZlQ2xhc3MoXCJ0cmFuc2l0aW9uLTFcIik7XG4gIGpRdWVyeShcIi5hcHBcIikuYWRkQ2xhc3MoXCJhY3RpdmVcIik7XG4gIHZhciBjb3VudGVyID0gMTtcbiAgdmFyIHJvdGF0ZVNjcmVlbnMgPSBzZXRJbnRlcnZhbChmdW5jdGlvbigpIHtcbiAgICBqUXVlcnkoXCIuYXBwIC5ib3R0b20td3JhcCBpbWdcIikucmVtb3ZlQ2xhc3MoXCJhY3RpdmVcIik7XG4gICAgalF1ZXJ5KFwiLmFwcCAuZmVhdHVyZS1saXN0IHBcIikucmVtb3ZlQ2xhc3MoXCJhY3RpdmVcIik7XG4gICAgalF1ZXJ5KFwiLmFwcCAuZmVhdHVyZS1saXN0IHA6bnRoLW9mLXR5cGUoXCIgKyBjb3VudGVyICsgXCIpXCIpLmFkZENsYXNzKFxuICAgICAgXCJhY3RpdmVcIlxuICAgICk7XG4gICAgalF1ZXJ5KFwiLmFwcCAuYm90dG9tLXdyYXAgaW1nOm50aC1vZi10eXBlKFwiICsgY291bnRlciArIFwiKVwiKS5hZGRDbGFzcyhcbiAgICAgIFwiYWN0aXZlXCJcbiAgICApO1xuICAgIGlmIChjb3VudGVyID09IDUpIHtcbiAgICAgIGNvdW50ZXIgPSAxO1xuICAgIH0gZWxzZSB7XG4gICAgICBjb3VudGVyKys7XG4gICAgfVxuICB9LCA0MDAwKTtcbiAgcm90YXRlU2NyZWVucztcbiAgc2V0VGltZW91dChmdW5jdGlvbigpIHtcbiAgICBqUXVlcnkoXCIuYXBwIC5ibG9jay1pbm5lclwiKS5hZGRDbGFzcyhcInRyYW5zaXRpb24tMVwiKTtcbiAgfSwgMjQwMDApO1xuICBzZXRUaW1lb3V0KGZ1bmN0aW9uKCkge1xuICAgIGpRdWVyeShcIi5hcHBcIikucmVtb3ZlQ2xhc3MoXCJhY3RpdmVcIik7XG4gICAgY2xlYXJJbnRlcnZhbChyb3RhdGVTY3JlZW5zKTtcbiAgfSwgMjUwMDApO1xufVxuXG5mdW5jdGlvbiBhbGxTdGFyKCkge1xuICBqUXVlcnkoXCIuYWxsLXN0YXIgLmJsb2NrLWlubmVyXCIpLnJlbW92ZUNsYXNzKFwidHJhbnNpdGlvbi0xXCIpO1xuICBqUXVlcnkoXCIuYWxsLXN0YXJcIikuYWRkQ2xhc3MoXCJhY3RpdmVcIik7XG4gIC8qICAgIHNldFRpbWVvdXQoZnVuY3Rpb24oKSB7XG4gICAgICAgIGpRdWVyeSgnLmFsbC1zdGFyIC5ibG9jay1pbm5lcicpLmFkZENsYXNzKCd0cmFuc2l0aW9uLTEnKTtcbiAgICB9LCAyNDAwMCk7XG4gICAgc2V0VGltZW91dChmdW5jdGlvbigpIHtcbiAgICAgICAgalF1ZXJ5KCcuYWxsLXN0YXInKS5yZW1vdmVDbGFzcygnYWN0aXZlJyk7XG4gICAgICAgIGNsZWFySW50ZXJ2YWwocm90YXRlU2NyZWVucyk7XG4gICAgfSwgMjUwMDApOyovXG59XG4vKj09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuPSAgICAgICAgICAgIExFRlQgV1JBUCAgICAgICAgICAgID1cbj09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PSovXG5mdW5jdGlvbiBsZWZ0V3JhcCgpIHtcbiAgc2V0SW50ZXJ2YWwoZnVuY3Rpb24oKSB7XG4gICAgaWYgKGpRdWVyeShcIi5sZWZ0LXdyYXAgLnN0YW5kaW5nc1wiKS5oYXNDbGFzcyhcInRyYW5zaXRpb24tMVwiKSkge1xuICAgICAgalF1ZXJ5KFwiLmxlZnQtd3JhcCAuc3RhbmRpbmdzXCIpLnJlbW92ZUNsYXNzKFwidHJhbnNpdGlvbi0xXCIpO1xuICAgIH0gZWxzZSB7XG4gICAgICBqUXVlcnkoXCIubGVmdC13cmFwIC5zdGFuZGluZ3NcIikuYWRkQ2xhc3MoXCJ0cmFuc2l0aW9uLTFcIik7XG4gICAgfVxuICAgIGlmIChqUXVlcnkoXCIubGVmdC13cmFwIC5zY29yZXMtYW5kLWxlYWRlcnNcIikuaGFzQ2xhc3MoXCJ0cmFuc2l0aW9uLTFcIikpIHtcbiAgICAgIGpRdWVyeShcIi5sZWZ0LXdyYXAgLnNjb3Jlcy1hbmQtbGVhZGVyc1wiKS5yZW1vdmVDbGFzcyhcInRyYW5zaXRpb24tMVwiKTtcbiAgICAgIHVwZGF0ZUxlYWd1ZVNjb3JlcygpO1xuICAgIH0gZWxzZSB7XG4gICAgICBqUXVlcnkoXCIubGVmdC13cmFwIC5zY29yZXMtYW5kLWxlYWRlcnNcIikuYWRkQ2xhc3MoXCJ0cmFuc2l0aW9uLTFcIik7XG4gICAgfVxuICB9LCA1MDAwMCk7XG59XG5cbmZ1bmN0aW9uIHN0YW5kaW5nc0luaXQoYXdheVRlYW0pIHtcbiAgalF1ZXJ5LmFqYXgoe1xuICAgIHVybDogZmVlZHMuc3RhbmRpbmdzLFxuICAgIGFzeW5jOiBmYWxzZSxcbiAgICBzdWNjZXNzOiBmdW5jdGlvbihzdGFuZGluZ3NEYXRhKSB7XG4gICAgICBmb3IgKGxldCBpID0gMDsgaSA8IHN0YW5kaW5nc0RhdGEuc3RhLmNvLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgIGZvciAobGV0IHggPSAwOyB4IDwgc3RhbmRpbmdzRGF0YS5zdGEuY29baV0uZGkubGVuZ3RoOyB4KyspIHtcbiAgICAgICAgICBmb3IgKGxldCB0ID0gMDsgdCA8IHN0YW5kaW5nc0RhdGEuc3RhLmNvW2ldLmRpW3hdLnQubGVuZ3RoOyB0KyspIHtcbiAgICAgICAgICAgIHZhciBjb25mZXJlbmNlcyA9IFtcIi5lYXN0XCIsIFwiLndlc3RcIl07XG4gICAgICAgICAgICB2YXIgcGxhY2UgPSBzdGFuZGluZ3NEYXRhLnN0YS5jb1tpXS5kaVt4XS50W3RdLnNlZTtcbiAgICAgICAgICAgIHZhciBzZWVkID0gXCJcIjtcbiAgICAgICAgICAgIHZhciBhY3RpdmVTdGF0dXMgPSBcIlwiO1xuICAgICAgICAgICAgaWYgKHN0YW5kaW5nc0RhdGEuc3RhLmNvW2ldLmRpW3hdLnRbdF0uc2VlIDw9IDgpIHtcbiAgICAgICAgICAgICAgc2VlZCA9IHN0YW5kaW5nc0RhdGEuc3RhLmNvW2ldLmRpW3hdLnRbdF0uc2VlO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKHN0YW5kaW5nc0RhdGEuc3RhLmNvW2ldLmRpW3hdLnRbdF0udGEgPT0gXCJCT1NcIikge1xuICAgICAgICAgICAgICBhY3RpdmVTdGF0dXMgPSBcImFjdGl2ZVwiO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKHN0YW5kaW5nc0RhdGEuc3RhLmNvW2ldLmRpW3hdLnRbdF0udGEgPT0gYXdheVRlYW0pIHtcbiAgICAgICAgICAgICAgYWN0aXZlU3RhdHVzID0gXCJhY3RpdmUtYXdheVwiO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgdmFyIHJvd0hUTUwgPVxuICAgICAgICAgICAgICAnPGRpdiBjbGFzcz1cInBsYWNlXCI+JyArXG4gICAgICAgICAgICAgIHNlZWQgK1xuICAgICAgICAgICAgICAnPC9kaXY+PGRpdiBjbGFzcz1cImxvZ28td3JhcFwiPjxpbWcgY2xhc3M9XCJsb2dvXCIgc3JjPWh0dHA6Ly9pLmNkbi50dXJuZXIuY29tL25iYS9uYmEvYXNzZXRzL2xvZ29zL3RlYW1zL3ByaW1hcnkvd2ViLycgK1xuICAgICAgICAgICAgICBzdGFuZGluZ3NEYXRhLnN0YS5jb1tpXS5kaVt4XS50W3RdLnRhICtcbiAgICAgICAgICAgICAgJy5zdmc+PC9kaXY+PGRpdiBjbGFzcz1cInRlYW0gKyAnICtcbiAgICAgICAgICAgICAgc3RhbmRpbmdzRGF0YS5zdGEuY29baV0uZGlbeF0udFt0XS50YSArXG4gICAgICAgICAgICAgICdcIj4nICtcbiAgICAgICAgICAgICAgc3RhbmRpbmdzRGF0YS5zdGEuY29baV0uZGlbeF0udFt0XS50YSArXG4gICAgICAgICAgICAgICc8L2Rpdj48ZGl2IGNsYXNzPVwid2luc1wiPicgK1xuICAgICAgICAgICAgICBzdGFuZGluZ3NEYXRhLnN0YS5jb1tpXS5kaVt4XS50W3RdLncgK1xuICAgICAgICAgICAgICAnPC9kaXY+PGRpdiBjbGFzcz1cImxvc3Nlc1wiPicgK1xuICAgICAgICAgICAgICBzdGFuZGluZ3NEYXRhLnN0YS5jb1tpXS5kaVt4XS50W3RdLmwgK1xuICAgICAgICAgICAgICAnPC9kaXY+PGRpdiBjbGFzcz1cImdhbWVzLWJlaGluZFwiPicgK1xuICAgICAgICAgICAgICBzdGFuZGluZ3NEYXRhLnN0YS5jb1tpXS5kaVt4XS50W3RdLmdiICtcbiAgICAgICAgICAgICAgXCI8L2Rpdj5cIjtcbiAgICAgICAgICAgIGpRdWVyeShcbiAgICAgICAgICAgICAgY29uZmVyZW5jZXNbaV0gKyBcIiA+IGRpdjpudGgtY2hpbGQoXCIgKyAocGxhY2UgKyAxKSArIFwiKVwiXG4gICAgICAgICAgICApLmh0bWwocm93SFRNTCk7XG4gICAgICAgICAgICBqUXVlcnkoXG4gICAgICAgICAgICAgIGNvbmZlcmVuY2VzW2ldICsgXCIgPiBkaXY6bnRoLWNoaWxkKFwiICsgKHBsYWNlICsgMSkgKyBcIilcIlxuICAgICAgICAgICAgKS5hZGRDbGFzcyhhY3RpdmVTdGF0dXMpO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cbiAgfSk7XG59XG5cbmZ1bmN0aW9uIHNjb3Jlc0luaXQodG9kYXlzU2NvcmVzRGF0YSkge1xuICB2YXIgbGl2ZVNjb3JlcyA9IHRvZGF5c1Njb3Jlc0RhdGEuZ3MuZztcbiAgaWYgKGxpdmVTY29yZXMubGVuZ3RoICE9IDApIHtcbiAgICB2YXIgc2Vhc29uVHlwZSA9IFwiXCI7XG4gICAgaWYgKGxpdmVTY29yZXNbMF0uZ2lkLnN1YnN0cigwLCAzKSA9PSBcIjAwMVwiKSB7XG4gICAgICBzZWFzb25UeXBlID0gXCJwcmVcIjtcbiAgICB9IGVsc2UgaWYgKGxpdmVTY29yZXNbMF0uZ2lkLnN1YnN0cigwLCAzKSA9PSBcIjAwNFwiKSB7XG4gICAgICBzZWFzb25UeXBlID0gXCJwb3N0XCI7XG4gICAgfVxuICAgIGlmIChcbiAgICAgIGxpdmVTY29yZXMubGVuZ3RoID4gMSB8fFxuICAgICAgKGxpdmVTY29yZXMubGVuZ3RoID09IDEgJiYgbGl2ZVNjb3Jlc1swXS5oLnRhICE9IFwiQk9TXCIpXG4gICAgKSB7XG4gICAgICB2YXIgc3RhdHVzQ29kZXMgPSBbXG4gICAgICAgIFwiMXN0IFF0clwiLFxuICAgICAgICBcIjJuZCBRdHJcIixcbiAgICAgICAgXCIzcmQgUXRyXCIsXG4gICAgICAgIFwiNHRoIFF0clwiLFxuICAgICAgICBcIjFzdCBPVFwiLFxuICAgICAgICBcIjJuZCBPVFwiLFxuICAgICAgICBcIjNyZCBPVFwiLFxuICAgICAgICBcIjR0aCBPVFwiLFxuICAgICAgICBcIjV0aCBPVFwiLFxuICAgICAgICBcIjZ0aCBPVFwiLFxuICAgICAgICBcIjd0aCBPVFwiLFxuICAgICAgICBcIjh0aCBPVFwiLFxuICAgICAgICBcIjl0aCBPVFwiLFxuICAgICAgICBcIjEwdGggT1RcIlxuICAgICAgXTtcbiAgICAgIHZhciBzY29yZXNIVE1MID0gXCJcIjtcbiAgICAgIHZhciBhZGRlZCA9IDA7XG4gICAgICBmb3IgKHZhciBpID0gbGl2ZVNjb3Jlcy5sZW5ndGggLSAxOyBpID49IDA7IGktLSkge1xuICAgICAgICBpZiAobGl2ZVNjb3Jlc1tpXS5oLnRhICE9PSBcIkJPU1wiICYmIGkgPCAxMSkge1xuICAgICAgICAgIGFkZGVkKys7XG4gICAgICAgICAgdmFyIHZTY29yZSA9IFwiXCI7XG4gICAgICAgICAgdmFyIGhTY29yZSA9IFwiXCI7XG4gICAgICAgICAgdmFyIHZSZXN1bHQgPSBcIlwiO1xuICAgICAgICAgIHZhciBoUmVzdWx0ID0gXCJcIjtcbiAgICAgICAgICB2YXIgaXNMaXZlID0gXCJcIjtcbiAgICAgICAgICBpZiAobGl2ZVNjb3Jlc1tpXS5zdCAhPSAxKSB7XG4gICAgICAgICAgICB2U2NvcmUgPSBsaXZlU2NvcmVzW2ldLnYucztcbiAgICAgICAgICAgIGhTY29yZSA9IGxpdmVTY29yZXNbaV0uaC5zO1xuICAgICAgICAgICAgaXNMaXZlID0gXCJsaXZlXCI7XG4gICAgICAgICAgfVxuICAgICAgICAgIHZhciBzVGV4dCA9IGxpdmVTY29yZXNbaV0uc3R0O1xuICAgICAgICAgIGlmIChzdGF0dXNDb2Rlcy5pbmRleE9mKGxpdmVTY29yZXNbaV0uc3R0KSAhPT0gLTEpIHtcbiAgICAgICAgICAgIHNUZXh0ID0gbGl2ZVNjb3Jlc1tpXS5zdHQgKyBcIiAtIFwiICsgbGl2ZVNjb3Jlc1tpXS5jbDtcbiAgICAgICAgICB9XG4gICAgICAgICAgaWYgKGxpdmVTY29yZXNbaV0uc3QgPT0gMyAmJiB2U2NvcmUgPCBoU2NvcmUpIHtcbiAgICAgICAgICAgIHZSZXN1bHQgPSBcImxvc2VyXCI7XG4gICAgICAgICAgfSBlbHNlIGlmIChsaXZlU2NvcmVzW2ldLnN0ID09IDMgJiYgaFNjb3JlIDwgdlNjb3JlKSB7XG4gICAgICAgICAgICBoUmVzdWx0ID0gXCJsb3NlclwiO1xuICAgICAgICAgIH1cbiAgICAgICAgICBzY29yZXNIVE1MICs9XG4gICAgICAgICAgICAnPGRpdiBjbGFzcz1cInNjb3JlLXdyYXBcIj48ZGl2IGNsYXNzPVwic2NvcmUtc3RhdHVzICcgK1xuICAgICAgICAgICAgaXNMaXZlICtcbiAgICAgICAgICAgICdcIj4nICtcbiAgICAgICAgICAgIHNUZXh0LnRvVXBwZXJDYXNlKCkgK1xuICAgICAgICAgICAgJzwvZGl2PjxkaXYgY2xhc3M9XCInICtcbiAgICAgICAgICAgIGxpdmVTY29yZXNbaV0udi50YSArXG4gICAgICAgICAgICAnXCI+PGltZyBzcmM9XCJodHRwOi8vc3RhdHMubmJhLmNvbS9tZWRpYS9pbWcvdGVhbXMvbG9nb3MvJyArXG4gICAgICAgICAgICBsaXZlU2NvcmVzW2ldLnYudGEudG9VcHBlckNhc2UoKSArXG4gICAgICAgICAgICAnX2xvZ28uc3ZnXCI+ICcgK1xuICAgICAgICAgICAgbGl2ZVNjb3Jlc1tpXS52LnRjLnRvVXBwZXJDYXNlKCkgK1xuICAgICAgICAgICAgXCIgXCIgK1xuICAgICAgICAgICAgbGl2ZVNjb3Jlc1tpXS52LnRuLnRvVXBwZXJDYXNlKCkgK1xuICAgICAgICAgICAgJyA8ZGl2IGNsYXNzPVwic2NvcmUtbnVtICcgK1xuICAgICAgICAgICAgdlJlc3VsdCArXG4gICAgICAgICAgICAnXCI+JyArXG4gICAgICAgICAgICB2U2NvcmUgK1xuICAgICAgICAgICAgJzwvZGl2PjwvZGl2PjxkaXYgY2xhc3M9XCInICtcbiAgICAgICAgICAgIGxpdmVTY29yZXNbaV0uaC50YSArXG4gICAgICAgICAgICAnXCI+PGltZyBzcmM9XCJodHRwOi8vc3RhdHMubmJhLmNvbS9tZWRpYS9pbWcvdGVhbXMvbG9nb3MvJyArXG4gICAgICAgICAgICBsaXZlU2NvcmVzW2ldLmgudGEudG9VcHBlckNhc2UoKSArXG4gICAgICAgICAgICAnX2xvZ28uc3ZnXCI+ICcgK1xuICAgICAgICAgICAgbGl2ZVNjb3Jlc1tpXS5oLnRjLnRvVXBwZXJDYXNlKCkgK1xuICAgICAgICAgICAgXCIgXCIgK1xuICAgICAgICAgICAgbGl2ZVNjb3Jlc1tpXS5oLnRuLnRvVXBwZXJDYXNlKCkgK1xuICAgICAgICAgICAgJyA8ZGl2IGNsYXNzPVwic2NvcmUtbnVtICcgK1xuICAgICAgICAgICAgaFJlc3VsdCArXG4gICAgICAgICAgICAnXCI+JyArXG4gICAgICAgICAgICBoU2NvcmUgK1xuICAgICAgICAgICAgXCI8L2Rpdj48L2Rpdj48L2Rpdj5cIjtcbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgalF1ZXJ5KFwiLnNjb3Jlc1wiKVxuICAgICAgICAuZW1wdHkoKVxuICAgICAgICAuYXBwZW5kKHNjb3Jlc0hUTUwpO1xuICAgIH1cbiAgICBpZiAoYWRkZWQgPCA2KSB7XG4gICAgICBqUXVlcnkoXCIubGVhZ3VlLWxlYWRlcnNcIikuc2hvdygpO1xuICAgIH0gZWxzZSB7XG4gICAgICBqUXVlcnkoXCIubGVhZ3VlLWxlYWRlcnNcIikuaGlkZSgpO1xuICAgIH1cbiAgfVxufVxuXG5mdW5jdGlvbiB1cGRhdGVMZWFndWVTY29yZXMoKSB7XG4gIGpRdWVyeS5hamF4KHtcbiAgICB1cmw6IGZlZWRzLnRvZGF5c1Njb3JlcyxcbiAgICBhc3luYzogZmFsc2UsXG4gICAgc3VjY2VzczogZnVuY3Rpb24oZGF0YSkge1xuICAgICAgc2NvcmVzSW5pdChkYXRhKTtcbiAgICB9XG4gIH0pO1xufVxuXG5mdW5jdGlvbiBsZWFndWVMZWFkZXJzKCkge1xuICB2YXIgbGVhZ3VlTGVhZGVyc0hUTUwgPVxuICAgICc8ZGl2IGNsYXNzPVwidGl0bGVcIj48cD5MRUFHVUUgTEVBREVSUzwvcD48cD5QVFM8L3A+PHA+UkVCPC9wPjxwPkFTVDwvcD48cD5TVEw8L3A+PHA+QkxLPC9wPjwvZGl2Pic7XG4gIHZhciBzdGF0VHlwZSA9IFwiXCI7XG4gIHZhciBkYXRhSW5kZXggPSBbXG4gICAgXCJSQU5LXCIsXG4gICAgXCJQTEFZRVJfSURcIixcbiAgICBcIlBMQVlFUlwiLFxuICAgIFwiVEVBTV9JRFwiLFxuICAgIFwiVEVBTV9BQkJSRVZJQVRJT05cIlxuICBdO1xuICBqUXVlcnkuYWpheCh7XG4gICAgdXJsOiBmZWVkcy5sZWFndWVMZWFkZXJzLFxuICAgIGRhdGFUeXBlOiBcImpzb25wXCIsXG4gICAgYXN5bmM6IGZhbHNlLFxuICAgIHN1Y2Nlc3M6IGZ1bmN0aW9uKGRhdGEpIHtcbiAgICAgIHZhciBsZWFkZXJzRGF0YSA9IGRhdGEucmVzdWx0U2V0cztcbiAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgbGVhZGVyc0RhdGEubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgdmFyIGluZGV4ID0gY3JlYXRlSW5kZXgoZGF0YUluZGV4LCBsZWFkZXJzRGF0YVtpXS5oZWFkZXJzKTtcbiAgICAgICAgdmFyIHJvd3MgPSBcIlwiO1xuICAgICAgICBpZiAoXG4gICAgICAgICAgW1wiUFRTXCIsIFwiUkVCXCIsIFwiQVNUXCIsIFwiU1RMXCIsIFwiQkxLXCJdLmluZGV4T2YoXG4gICAgICAgICAgICBsZWFkZXJzRGF0YVtpXS5oZWFkZXJzWzhdXG4gICAgICAgICAgKSAhPT0gLTFcbiAgICAgICAgKSB7XG4gICAgICAgICAgZm9yIChsZXQgeCA9IDA7IHggPCBsZWFkZXJzRGF0YVtpXS5yb3dTZXQubGVuZ3RoOyB4KyspIHtcbiAgICAgICAgICAgIHZhciBuID0gbGVhZGVyc0RhdGFbaV0ucm93U2V0W3hdWzJdLnNwbGl0KFwiIFwiKTtcbiAgICAgICAgICAgIHZhciBmbiA9IG5bMF0udG9VcHBlckNhc2UoKTtcbiAgICAgICAgICAgIHZhciBsbiA9IG5bMV0udG9VcHBlckNhc2UoKTtcbiAgICAgICAgICAgIHJvd3MgKz1cbiAgICAgICAgICAgICAgJzxkaXYgY2xhc3M9XCJyb3dcIj48ZGl2IGNsYXNzPVwibGVmdFwiPjxkaXYgY2xhc3M9XCJwbGFjZVwiPicgK1xuICAgICAgICAgICAgICBsZWFkZXJzRGF0YVtpXS5yb3dTZXRbeF1bMF0gK1xuICAgICAgICAgICAgICAnPC9kaXY+PGRpdiBjbGFzcz1cImxvZ28td3JhcFwiPjxpbWcgY2xhc3M9XCJsb2dvXCIgc3JjPVwiaHR0cDovL3N0YXRzLm5iYS5jb20vbWVkaWEvaW1nL3RlYW1zL2xvZ29zLycgK1xuICAgICAgICAgICAgICBsZWFkZXJzRGF0YVtpXS5yb3dTZXRbeF1bNF0gK1xuICAgICAgICAgICAgICAnX2xvZ28uc3ZnXCIvPjwvZGl2PjxkaXYgY2xhc3M9XCJuYW1lXCI+PHNwYW4+JyArXG4gICAgICAgICAgICAgIGZuICtcbiAgICAgICAgICAgICAgXCI8L3NwYW4+IFwiICtcbiAgICAgICAgICAgICAgbG4gK1xuICAgICAgICAgICAgICAnPC9kaXY+PC9kaXY+PGRpdiBjbGFzcz1cInJpZ2h0XCI+PGRpdiBjbGFzcz1cInZhbHVlXCI+JyArXG4gICAgICAgICAgICAgIHJvdW5kKGxlYWRlcnNEYXRhW2ldLnJvd1NldFt4XVs4XSkgK1xuICAgICAgICAgICAgICBcIjwvZGl2PjwvZGl2PjwvZGl2PlwiO1xuICAgICAgICAgIH1cbiAgICAgICAgICBsZWFndWVMZWFkZXJzSFRNTCArPVxuICAgICAgICAgICAgJzxkaXYgY2xhc3M9XCJsZWFndWUtbGVhZGVycy13cmFwXCI+JyArIHJvd3MgKyBcIjwvZGl2PlwiO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgICBqUXVlcnkoXCIubGVhZ3VlLWxlYWRlcnNcIilcbiAgICAgICAgLmVtcHR5KClcbiAgICAgICAgLmFwcGVuZChsZWFndWVMZWFkZXJzSFRNTCk7XG4gICAgfVxuICB9KTtcbiAgdmFyIGNvdW50ZXIgPSAyO1xuICBzZXRJbnRlcnZhbChmdW5jdGlvbigpIHtcbiAgICBqUXVlcnkoXCIubGVhZ3VlLWxlYWRlcnMtd3JhcCwgLmxlYWd1ZS1sZWFkZXJzIC50aXRsZSBwXCIpLnJlbW92ZUNsYXNzKFxuICAgICAgXCJhY3RpdmVcIlxuICAgICk7XG4gICAgalF1ZXJ5KFxuICAgICAgXCIubGVhZ3VlLWxlYWRlcnMtd3JhcDpudGgtb2YtdHlwZShcIiArXG4gICAgICAgIGNvdW50ZXIgK1xuICAgICAgICBcIiksIC5sZWFndWUtbGVhZGVycyAudGl0bGUgcDpudGgtb2YtdHlwZShcIiArXG4gICAgICAgIGNvdW50ZXIgK1xuICAgICAgICBcIilcIlxuICAgICkuYWRkQ2xhc3MoXCJhY3RpdmVcIik7XG4gICAgaWYgKGNvdW50ZXIgPT0gNikge1xuICAgICAgY291bnRlciA9IDI7XG4gICAgfSBlbHNlIHtcbiAgICAgIGNvdW50ZXIrKztcbiAgICB9XG4gIH0sIDEwMDAwKTtcbn1cbiJdfQ==
