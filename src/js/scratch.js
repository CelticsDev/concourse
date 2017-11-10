    /* 5 - SELECT A PLAYER */
    /*    for (i = 0; i < roster.length; i++) {
            var playerWrapHTML = '@import "../html/min/_player-wrap.min.html"';
            jQuery('.player-spotlight').append(playerWrapHTML);
            jQuery("div[data-pid='" + roster[i].pid + "'] .averages-season").html('<td><p>' + teamStats[roster[i].pid].avg.gp + '</p></td><td><p>' + teamStats[roster[i].pid].avg.pts + '</p></td><td><p>' + teamStats[roster[i].pid].avg.reb + '</p></td><td><p>' + teamStats[roster[i].pid].avg.ast + '</p></td>')
        }*/
jQuery('.player-spotlight .player-wrap:nth-child(1)').addClass("active");