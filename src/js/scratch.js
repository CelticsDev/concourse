(function(){
const one = ["RANK","PLAYER_ID","PLAYER","TEAM_ID","TEAM_ABBREVIATION"];
const two = ["PLAYER","TEAM_ID"];
function createIndex(keys, array) {
    var newArr = keys.map(item => array.indexOf(item));
    return newArr;
}
console.log(createIndex(two,one));
})();





(function leagueLeaders(){
    var leagueLeadersHTML = '';
    var statType = '';
    var dataIndex = ["RANK","PLAYER_ID","PLAYER","TEAM_ID","TEAM_ABBREVIATION"];

    $.ajax({
        url: 'http://localhost:8888/data/league_leaders.json',
        success: function(data) {
            var leadersData = data.resultSets;
            for (let i = 0; i < leadersData.length; i++){
                var index = createIndex(dataIndex, leadersData[i].headers);
                for (let x = 0; x < index.length; x++){
                    console.log(leadersData[i].rowSet[0][index[x]]);
                }



                statType = leadersData[i].headers[(leadersData[i].headers.length - 1)];
                console.log(statType);
                for (let x = 0; x < leadersData[i].rowSet.length; x++){
                    leaderHTML = '<p>' + leadersData[i].rowSet[x][3] + '</p>';
                    $('.league-leaders-wrap div[data-stat-type="' + statType + '"]').append(leaderHTML);
                }
            }
/*            $('.league-leaders-wrap div[data-stat-type="' + statType + '"]').html(leaderHTML);*/
        }
    });
/*    $('.league-leaders').html(leagueLeadersHTML);*/
})();


var gid = jQuery(obj).attr("id").replace('gid-','');
    jQuery.getJSON("http://data.nba.com/data/v2015/json/mobile_teams/nba/2016/scores/gamedetail/" + gid + "_gamedetail.json", function(data) {
        if (data.g.st === 3){
        var statsObject = {
            celtics: {
                boxScore: '',
                leaders: {
                    pts: ['value','fn','ln','fga/fgm', 'fta/ftm'],
                    reb: ['value','fn','ln','dreb', 'oreb'],
                    ast: ['value','fn','ln','tov', 'min']
                },
                teamStats: {

                }
            },
            opponent: {
                boxScore: '',
                leaders: {
                    pts: ['value','fn','ln','fga/fgm', 'fta/ftm'],
                    reb: ['value','fn','ln','dreb', 'oreb'],
                    ast: ['value','fn','ln','tov', 'min']
                },
                teamStats: {

                }
            }
        };
        var teamLineScore = ["hls","vls"];
        for (var x = 0; x < teamLineScore.length; x++){
            var stats = data.g[teamLineScore[x]];
            var team = '';
            if (stats.ta === 'BOS'){
                team = 'celtics'
            }
            else {
                team = 'away'
            }
            rosterObj[team].leaders.pts = [stats.pstsg[0].pts, stats.pstsg[0].fn + " " + stats.pstsg[0].ln, stats.pstsg[0].pid, stats.pstsg[0].fgm + "-" + stats.pstsg[0].fga, stats.pstsg[0].ftm + "-" + stats.pstsg[0].fta];
            rosterObj[team].leaders.reb = [stats.pstsg[0].reb, stats.pstsg[0].fn + " " + stats.pstsg[0].ln, stats.pstsg[0].pid, stats.pstsg[0].dreb, stats.pstsg[0].oreb];
            rosterObj[team].leaders.ast = [stats.pstsg[0].ast, stats.pstsg[0].fn + " " + stats.pstsg[0].ln, stats.pstsg[0].pid, stats.pstsg[0].tov, stats.pstsg[0].min];
            for(var p = 0; p < stats.pstsg.length; p++){
                if(stats.pstsg[p].pts > rosterObj[team].leaders.pts[0]){
                    rosterObj[team].leaders.pts = [stats.pstsg[p].pts, stats.pstsg[p].fn + " " + stats.pstsg[p].ln, stats.pstsg[p].pid, stats.pstsg[p].fgm + "-" + stats.pstsg[p].fga, stats.pstsg[p].ftm + "-" + stats.pstsg[p].fta];
                }
                if(stats.pstsg[p].reb > rosterObj[team].leaders.reb[0]){
                    rosterObj[team].leaders.reb = [stats.pstsg[p].reb, stats.pstsg[p].fn + " " + stats.pstsg[p].ln, stats.pstsg[p].pid, stats.pstsg[p].dreb, stats.pstsg[p].oreb];
                }
                if(stats.pstsg[p].ast > rosterObj[team].leaders.ast[0]){
                    rosterObj[team].leaders.ast = [stats.pstsg[p].ast, stats.pstsg[p].fn + " " + stats.pstsg[p].ln, stats.pstsg[p].pid, stats.pstsg[p].tov, stats.pstsg[p].min];
                }

                var active = true;
                var plusMinus = '';
                var minutes = stats.pstsg[p].min;

                if (minutes === 0 && stats.pstsg[p].sec !== 0){
                    minutes = 1;
                }

                if (stats.pstsg[p].pm > 0){
                    plusMinus = '+';
                }
                if (stats.pstsg[p].memo !== ""){
                    rosterObj[team].boxScore +='<tr class="dnp static"><td>' + stats.pstsg[p].fn + " " + stats.pstsg[p].ln + '</td><td colspan="12" style="text-align:center">' + stats.pstsg[p].memo + '</td></tr>';
                }
                else if (stats.pstsg[p].memo === "" && minutes === 0){
                    rosterObj[team].boxScore +='<tr class="dnp static"><td>' + stats.pstsg[p].fn + " " + stats.pstsg[p].ln + '</td><td colspan="12" style="text-align:center">DNP</td></tr>';
                }
                else {
                    rosterObj[team].boxScore += '';
                }
            }
            rosterObj[team].teamStats = stats.tstsg;
            rosterObj[team].teamStats.tc = stats.tc;
            rosterObj[team].teamStats.s = stats.s;
            rosterObj[team].teamStats.fgp = shootingPercentage(rosterObj[team].teamStats.fgm, rosterObj[team].teamStats.fga);
            rosterObj[team].teamStats.tpp = shootingPercentage(rosterObj[team].teamStats.tpm, rosterObj[team].teamStats.tpa);
            rosterObj[team].teamStats.ftp = shootingPercentage(rosterObj[team].teamStats.ftm, rosterObj[team].teamStats.fta);
        }
        var ta = '';
        if (data.g.hls.ta === "BOS"){
            ta = data.g.vls.ta;
        }
        else {
            ta = data.g.hls.ta;
        }



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