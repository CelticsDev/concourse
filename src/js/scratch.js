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