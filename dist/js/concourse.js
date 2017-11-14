jQuery(document).ready(function() {
    /*========================================
    =            LOAD STATIC DATA            =
    ========================================*/
    var roster = '';
    var teamStats = {};
    var bioData = {};
    var playerSpotlightCounter = 10;
    var date = new Date();
    var rosterYear = date.getFullYear();
    var roster = [{
        "fn": "Kadeem",
        "ln": "Allen",
        "pid": 1628443,
        "num": "45",
        "pos": "G",
        "dob": "1993-01-15",
        "ht": "6-3",
        "wt": 200,
        "y": 0,
        "hcc": "ArizonaUSA/USA"
    }, {
        "fn": "Jabari",
        "ln": "Bird",
        "pid": 1628444,
        "num": "26",
        "pos": "G",
        "dob": "1994-07-03",
        "ht": "6-6",
        "wt": 198,
        "y": 0,
        "hcc": "California/USA"
    }, {
        "fn": "Daniel",
        "ln": "Theis",
        "pid": 1628464,
        "num": "27",
        "pos": "F-C",
        "dob": "1992-04-04",
        "ht": "6-9",
        "wt": 243,
        "y": 0,
        "hcc": "Germany/Germany"
    }, {
        "fn": "Terry",
        "ln": "Rozier",
        "pid": 1626179,
        "num": "12",
        "pos": "G",
        "dob": "1994-03-17",
        "ht": "6-2",
        "wt": 190,
        "y": 2,
        "hcc": "Louisville/USA"
    }, {
        "fn": "Gordon",
        "ln": "Hayward",
        "pid": 202330,
        "num": "20",
        "pos": "F",
        "dob": "1990-03-23",
        "ht": "6-8",
        "wt": 226,
        "y": 7,
        "hcc": "Butler/USA"
    }, {
        "fn": "Jaylen",
        "ln": "Brown",
        "pid": 1627759,
        "num": "7",
        "pos": "G-F",
        "dob": "1996-10-24",
        "ht": "6-7",
        "wt": 225,
        "y": 1,
        "hcc": "California/USA"
    }, {
        "fn": "Aron",
        "ln": "Baynes",
        "pid": 203382,
        "num": "46",
        "pos": "C",
        "dob": "1986-12-09",
        "ht": "6-10",
        "wt": 260,
        "y": 5,
        "hcc": "Washington State/Australia"
    }, {
        "fn": "Marcus",
        "ln": "Smart",
        "pid": 203935,
        "num": "36",
        "pos": "G",
        "dob": "1994-03-06",
        "ht": "6-4",
        "wt": 220,
        "y": 3,
        "hcc": "Oklahoma State/USA"
    }, {
        "fn": "Guerschon",
        "ln": "Yabusele",
        "pid": 1627824,
        "num": "30",
        "pos": "F",
        "dob": "1995-12-17",
        "ht": "6-8",
        "wt": 260,
        "y": 0,
        "hcc": "France/France"
    }, {
        "fn": "Al",
        "ln": "Horford",
        "pid": 201143,
        "num": "42",
        "pos": "F-C",
        "dob": "1986-06-03",
        "ht": "6-10",
        "wt": 245,
        "y": 10,
        "hcc": "Florida/Domincan Republic"
    }, {
        "fn": "Kyrie",
        "ln": "Irving",
        "pid": 202681,
        "num": "11",
        "pos": "G",
        "dob": "1992-03-23",
        "ht": "6-3",
        "wt": 193,
        "y": 6,
        "hcc": "Duke/Australia"
    }, {
        "fn": "Marcus",
        "ln": "Morris",
        "pid": 202694,
        "num": "13",
        "pos": "F",
        "dob": "1989-09-02",
        "ht": "6-9",
        "wt": 235,
        "y": 6,
        "hcc": "Kansas/USA"
    }, {
        "fn": "Abdel",
        "ln": "Nader",
        "pid": 1627846,
        "num": "28",
        "pos": "F",
        "dob": "1993-09-25",
        "ht": "6-6",
        "wt": 230,
        "y": 0,
        "hcc": "Egypt/Egypt"
    }, {
        "fn": "Jayson",
        "ln": "Tatum",
        "pid": 1628369,
        "num": "0",
        "pos": "F",
        "dob": "1998-03-03",
        "ht": "6-8",
        "wt": 205,
        "y": 0,
        "hcc": "Duke/USA"
    }, {
        "fn": "Shane",
        "ln": "Larkin",
        "pid": 203499,
        "num": "8",
        "pos": "G",
        "dob": "1992-10-02",
        "ht": "5-11",
        "wt": 175,
        "y": 3,
        "hcc": "Miami (Fla.)/USA"
    }, {
        "fn": "Semi",
        "ln": "Ojeleye",
        "pid": 1628400,
        "num": "37",
        "pos": "F",
        "dob": "1994-12-05",
        "ht": "6-7",
        "wt": 235,
        "y": 0,
        "hcc": "Southern Methodist/USA"
    }];
    var teamStats = {
            "tpsts": {
                "tid": 1610612738,
                "pl": [{
                    "pos": "F-C",
                    "pid": "201143",
                    "ln": "Horford",
                    "fn": "Al",
                    "avg": {
                        "gp": 11,
                        "gs": 11,
                        "min": 31.9,
                        "fgp": 0.531,
                        "tpp": 0.474,
                        "ftp": 0.821,
                        "oreb": 1.5,
                        "dreb": 7.7,
                        "reb": 9.2,
                        "ast": 4.7,
                        "stl": 0.6,
                        "blk": 0.7,
                        "tov": 2.5,
                        "pf": 1.8,
                        "pts": 14.6
                    },
                    "tot": {
                        "gp": 11,
                        "gs": 11,
                        "min": 351,
                        "fgm": 60,
                        "fga": 113,
                        "tpm": 18,
                        "tpa": 38,
                        "ftm": 23,
                        "fta": 28,
                        "oreb": 16,
                        "dreb": 85,
                        "reb": 101,
                        "ast": 52,
                        "stl": 7,
                        "blk": 8,
                        "tov": 28,
                        "pf": 20,
                        "pts": 161
                    }
                }, {
                    "pos": "F",
                    "pid": "202330",
                    "ln": "Hayward",
                    "fn": "Gordon",
                    "avg": {
                        "gp": 1,
                        "gs": 1,
                        "min": 5.0,
                        "fgp": 0.5,
                        "tpp": 0.0,
                        "ftp": 0.0,
                        "oreb": 0.0,
                        "dreb": 1.0,
                        "reb": 1.0,
                        "ast": 0.0,
                        "stl": 0.0,
                        "blk": 0.0,
                        "tov": 0.0,
                        "pf": 1.0,
                        "pts": 2.0
                    },
                    "tot": {
                        "gp": 1,
                        "gs": 1,
                        "min": 5,
                        "fgm": 1,
                        "fga": 2,
                        "tpm": 0,
                        "tpa": 1,
                        "ftm": 0,
                        "fta": 0,
                        "oreb": 0,
                        "dreb": 1,
                        "reb": 1,
                        "ast": 0,
                        "stl": 0,
                        "blk": 0,
                        "tov": 0,
                        "pf": 1,
                        "pts": 2
                    }
                }, {
                    "pos": "G",
                    "pid": "202681",
                    "ln": "Irving",
                    "fn": "Kyrie",
                    "avg": {
                        "gp": 12,
                        "gs": 12,
                        "min": 33.4,
                        "fgp": 0.446,
                        "tpp": 0.321,
                        "ftp": 0.884,
                        "oreb": 0.5,
                        "dreb": 2.8,
                        "reb": 3.3,
                        "ast": 5.7,
                        "stl": 2.1,
                        "blk": 0.3,
                        "tov": 2.1,
                        "pf": 2.3,
                        "pts": 22.0
                    },
                    "tot": {
                        "gp": 12,
                        "gs": 12,
                        "min": 401,
                        "fgm": 100,
                        "fga": 224,
                        "tpm": 26,
                        "tpa": 81,
                        "ftm": 38,
                        "fta": 43,
                        "oreb": 6,
                        "dreb": 34,
                        "reb": 40,
                        "ast": 68,
                        "stl": 25,
                        "blk": 4,
                        "tov": 25,
                        "pf": 28,
                        "pts": 264
                    }
                }, {
                    "pos": "F",
                    "pid": "202694",
                    "ln": "Morris",
                    "fn": "Marcus",
                    "avg": {
                        "gp": 3,
                        "gs": 2,
                        "min": 22.0,
                        "fgp": 0.424,
                        "tpp": 0.273,
                        "ftp": 0.889,
                        "oreb": 0.3,
                        "dreb": 3.7,
                        "reb": 4.0,
                        "ast": 1.3,
                        "stl": 1.3,
                        "blk": 0.0,
                        "tov": 0.3,
                        "pf": 2.3,
                        "pts": 13.0
                    },
                    "tot": {
                        "gp": 3,
                        "gs": 2,
                        "min": 66,
                        "fgm": 14,
                        "fga": 33,
                        "tpm": 3,
                        "tpa": 11,
                        "ftm": 8,
                        "fta": 9,
                        "oreb": 1,
                        "dreb": 11,
                        "reb": 12,
                        "ast": 4,
                        "stl": 4,
                        "blk": 0,
                        "tov": 1,
                        "pf": 7,
                        "pts": 39
                    }
                }, {
                    "pos": "C",
                    "pid": "203382",
                    "ln": "Baynes",
                    "fn": "Aron",
                    "avg": {
                        "gp": 12,
                        "gs": 8,
                        "min": 19.3,
                        "fgp": 0.515,
                        "tpp": 0.0,
                        "ftp": 0.68,
                        "oreb": 2.1,
                        "dreb": 3.7,
                        "reb": 5.8,
                        "ast": 1.0,
                        "stl": 0.3,
                        "blk": 0.7,
                        "tov": 0.8,
                        "pf": 2.5,
                        "pts": 7.1
                    },
                    "tot": {
                        "gp": 12,
                        "gs": 8,
                        "min": 232,
                        "fgm": 34,
                        "fga": 66,
                        "tpm": 0,
                        "tpa": 1,
                        "ftm": 17,
                        "fta": 25,
                        "oreb": 25,
                        "dreb": 44,
                        "reb": 69,
                        "ast": 12,
                        "stl": 3,
                        "blk": 8,
                        "tov": 10,
                        "pf": 30,
                        "pts": 85
                    }
                }, {
                    "pos": "G",
                    "pid": "203499",
                    "ln": "Larkin",
                    "fn": "Shane",
                    "avg": {
                        "gp": 10,
                        "gs": 0,
                        "min": 9.6,
                        "fgp": 0.241,
                        "tpp": 0.231,
                        "ftp": 0.833,
                        "oreb": 0.1,
                        "dreb": 0.9,
                        "reb": 1.0,
                        "ast": 1.5,
                        "stl": 0.3,
                        "blk": 0.0,
                        "tov": 0.3,
                        "pf": 0.8,
                        "pts": 2.2
                    },
                    "tot": {
                        "gp": 10,
                        "gs": 0,
                        "min": 96,
                        "fgm": 7,
                        "fga": 29,
                        "tpm": 3,
                        "tpa": 13,
                        "ftm": 5,
                        "fta": 6,
                        "oreb": 1,
                        "dreb": 9,
                        "reb": 10,
                        "ast": 15,
                        "stl": 3,
                        "blk": 0,
                        "tov": 3,
                        "pf": 8,
                        "pts": 22
                    }
                }, {
                    "pos": "G",
                    "pid": "203935",
                    "ln": "Smart",
                    "fn": "Marcus",
                    "avg": {
                        "gp": 10,
                        "gs": 1,
                        "min": 29.7,
                        "fgp": 0.307,
                        "tpp": 0.326,
                        "ftp": 0.7,
                        "oreb": 1.4,
                        "dreb": 3.2,
                        "reb": 4.6,
                        "ast": 5.4,
                        "stl": 1.7,
                        "blk": 0.4,
                        "tov": 2.2,
                        "pf": 2.5,
                        "pts": 9.7
                    },
                    "tot": {
                        "gp": 10,
                        "gs": 1,
                        "min": 297,
                        "fgm": 31,
                        "fga": 101,
                        "tpm": 14,
                        "tpa": 43,
                        "ftm": 21,
                        "fta": 30,
                        "oreb": 14,
                        "dreb": 32,
                        "reb": 46,
                        "ast": 54,
                        "stl": 17,
                        "blk": 4,
                        "tov": 22,
                        "pf": 25,
                        "pts": 97
                    }
                }, {
                    "pos": "G",
                    "pid": "1626179",
                    "ln": "Rozier",
                    "fn": "Terry",
                    "avg": {
                        "gp": 12,
                        "gs": 0,
                        "min": 24.2,
                        "fgp": 0.372,
                        "tpp": 0.315,
                        "ftp": 0.8,
                        "oreb": 0.8,
                        "dreb": 4.4,
                        "reb": 5.2,
                        "ast": 2.3,
                        "stl": 1.3,
                        "blk": 0.1,
                        "tov": 0.6,
                        "pf": 1.3,
                        "pts": 9.4
                    },
                    "tot": {
                        "gp": 12,
                        "gs": 0,
                        "min": 290,
                        "fgm": 42,
                        "fga": 113,
                        "tpm": 17,
                        "tpa": 54,
                        "ftm": 12,
                        "fta": 15,
                        "oreb": 9,
                        "dreb": 53,
                        "reb": 62,
                        "ast": 27,
                        "stl": 15,
                        "blk": 1,
                        "tov": 7,
                        "pf": 16,
                        "pts": 113
                    }
                }, {
                    "pos": "G-F",
                    "pid": "1627759",
                    "ln": "Brown",
                    "fn": "Jaylen",
                    "avg": {
                        "gp": 12,
                        "gs": 12,
                        "min": 31.7,
                        "fgp": 0.447,
                        "tpp": 0.382,
                        "ftp": 0.596,
                        "oreb": 1.2,
                        "dreb": 5.6,
                        "reb": 6.8,
                        "ast": 1.0,
                        "stl": 0.9,
                        "blk": 0.2,
                        "tov": 1.5,
                        "pf": 2.7,
                        "pts": 14.8
                    },
                    "tot": {
                        "gp": 12,
                        "gs": 12,
                        "min": 380,
                        "fgm": 63,
                        "fga": 141,
                        "tpm": 21,
                        "tpa": 55,
                        "ftm": 31,
                        "fta": 52,
                        "oreb": 14,
                        "dreb": 67,
                        "reb": 81,
                        "ast": 12,
                        "stl": 11,
                        "blk": 2,
                        "tov": 18,
                        "pf": 32,
                        "pts": 178
                    }
                }, {
                    "pos": "F",
                    "pid": "1627824",
                    "ln": "Yabusele",
                    "fn": "Guerschon",
                    "avg": {
                        "gp": 5,
                        "gs": 0,
                        "min": 3.4,
                        "fgp": 0.5,
                        "tpp": 0.4,
                        "ftp": 1.0,
                        "oreb": 0.8,
                        "dreb": 0.4,
                        "reb": 1.2,
                        "ast": 0.0,
                        "stl": 0.0,
                        "blk": 0.0,
                        "tov": 0.4,
                        "pf": 0.4,
                        "pts": 2.8
                    },
                    "tot": {
                        "gp": 5,
                        "gs": 0,
                        "min": 17,
                        "fgm": 5,
                        "fga": 10,
                        "tpm": 2,
                        "tpa": 5,
                        "ftm": 2,
                        "fta": 2,
                        "oreb": 4,
                        "dreb": 2,
                        "reb": 6,
                        "ast": 0,
                        "stl": 0,
                        "blk": 0,
                        "tov": 2,
                        "pf": 2,
                        "pts": 14
                    }
                }, {
                    "pos": "F",
                    "pid": "1627846",
                    "ln": "Nader",
                    "fn": "Abdel",
                    "avg": {
                        "gp": 7,
                        "gs": 0,
                        "min": 6.9,
                        "fgp": 0.375,
                        "tpp": 0.2,
                        "ftp": 0.0,
                        "oreb": 0.3,
                        "dreb": 0.6,
                        "reb": 0.9,
                        "ast": 0.4,
                        "stl": 0.3,
                        "blk": 0.1,
                        "tov": 0.6,
                        "pf": 0.6,
                        "pts": 1.9
                    },
                    "tot": {
                        "gp": 7,
                        "gs": 0,
                        "min": 48,
                        "fgm": 6,
                        "fga": 16,
                        "tpm": 1,
                        "tpa": 5,
                        "ftm": 0,
                        "fta": 0,
                        "oreb": 2,
                        "dreb": 4,
                        "reb": 6,
                        "ast": 3,
                        "stl": 2,
                        "blk": 1,
                        "tov": 4,
                        "pf": 4,
                        "pts": 13
                    }
                }, {
                    "pos": "F",
                    "pid": "1628369",
                    "ln": "Tatum",
                    "fn": "Jayson",
                    "avg": {
                        "gp": 12,
                        "gs": 12,
                        "min": 29.8,
                        "fgp": 0.5,
                        "tpp": 0.529,
                        "ftp": 0.833,
                        "oreb": 1.2,
                        "dreb": 4.8,
                        "reb": 6.0,
                        "ast": 1.8,
                        "stl": 0.8,
                        "blk": 0.9,
                        "tov": 1.7,
                        "pf": 2.3,
                        "pts": 13.5
                    },
                    "tot": {
                        "gp": 12,
                        "gs": 12,
                        "min": 357,
                        "fgm": 52,
                        "fga": 104,
                        "tpm": 18,
                        "tpa": 34,
                        "ftm": 40,
                        "fta": 48,
                        "oreb": 14,
                        "dreb": 58,
                        "reb": 72,
                        "ast": 22,
                        "stl": 9,
                        "blk": 11,
                        "tov": 20,
                        "pf": 27,
                        "pts": 162
                    }
                }, {
                    "pos": "F",
                    "pid": "1628400",
                    "ln": "Ojeleye",
                    "fn": "Semi",
                    "avg": {
                        "gp": 11,
                        "gs": 0,
                        "min": 15.8,
                        "fgp": 0.4,
                        "tpp": 0.391,
                        "ftp": 0.75,
                        "oreb": 0.5,
                        "dreb": 1.3,
                        "reb": 1.7,
                        "ast": 0.2,
                        "stl": 0.4,
                        "blk": 0.0,
                        "tov": 0.4,
                        "pf": 1.0,
                        "pts": 3.5
                    },
                    "tot": {
                        "gp": 11,
                        "gs": 0,
                        "min": 174,
                        "fgm": 12,
                        "fga": 30,
                        "tpm": 9,
                        "tpa": 23,
                        "ftm": 6,
                        "fta": 8,
                        "oreb": 5,
                        "dreb": 14,
                        "reb": 19,
                        "ast": 2,
                        "stl": 4,
                        "blk": 0,
                        "tov": 4,
                        "pf": 11,
                        "pts": 39
                    }
                }, {
                    "pos": "G",
                    "pid": "1628443",
                    "ln": "Allen",
                    "fn": "Kadeem",
                    "avg": {
                        "gp": 0,
                        "gs": 0,
                        "min": 0.0,
                        "fgp": 0.0,
                        "tpp": 0.0,
                        "ftp": 0.0,
                        "oreb": 0.0,
                        "dreb": 0.0,
                        "reb": 0.0,
                        "ast": 0.0,
                        "stl": 0.0,
                        "blk": 0.0,
                        "tov": 0.0,
                        "pf": 0.0,
                        "pts": 0.0
                    },
                    "tot": {
                        "gp": 0,
                        "gs": 0,
                        "min": 0,
                        "fgm": 0,
                        "fga": 0,
                        "tpm": 0,
                        "tpa": 0,
                        "ftm": 0,
                        "fta": 0,
                        "oreb": 0,
                        "dreb": 0,
                        "reb": 0,
                        "ast": 0,
                        "stl": 0,
                        "blk": 0,
                        "tov": 0,
                        "pf": 0,
                        "pts": 0
                    }
                }, {
                    "pos": "G",
                    "pid": "1628444",
                    "ln": "Bird",
                    "fn": "Jabari",
                    "avg": {
                        "gp": 2,
                        "gs": 0,
                        "min": 8.0,
                        "fgp": 0.0,
                        "tpp": 0.0,
                        "ftp": 0.6,
                        "oreb": 0.0,
                        "dreb": 0.5,
                        "reb": 0.5,
                        "ast": 0.0,
                        "stl": 0.0,
                        "blk": 0.0,
                        "tov": 0.0,
                        "pf": 0.5,
                        "pts": 1.5
                    },
                    "tot": {
                        "gp": 2,
                        "gs": 0,
                        "min": 16,
                        "fgm": 0,
                        "fga": 1,
                        "tpm": 0,
                        "tpa": 1,
                        "ftm": 3,
                        "fta": 5,
                        "oreb": 0,
                        "dreb": 1,
                        "reb": 1,
                        "ast": 0,
                        "stl": 0,
                        "blk": 0,
                        "tov": 0,
                        "pf": 1,
                        "pts": 3
                    }
                }, {
                    "pos": "F-C",
                    "pid": "1628464",
                    "ln": "Theis",
                    "fn": "Daniel",
                    "avg": {
                        "gp": 11,
                        "gs": 1,
                        "min": 13.5,
                        "fgp": 0.583,
                        "tpp": 0.25,
                        "ftp": 0.786,
                        "oreb": 1.7,
                        "dreb": 2.3,
                        "reb": 4.0,
                        "ast": 0.5,
                        "stl": 0.3,
                        "blk": 0.8,
                        "tov": 1.3,
                        "pf": 2.9,
                        "pts": 4.9
                    },
                    "tot": {
                        "gp": 11,
                        "gs": 1,
                        "min": 149,
                        "fgm": 21,
                        "fga": 36,
                        "tpm": 1,
                        "tpa": 4,
                        "ftm": 11,
                        "fta": 14,
                        "oreb": 19,
                        "dreb": 25,
                        "reb": 44,
                        "ast": 5,
                        "stl": 3,
                        "blk": 9,
                        "tov": 14,
                        "pf": 32,
                        "pts": 54
                    }
                }],
                "ta": "BOS",
                "tn": "Celtics",
                "tc": "Boston"
            }
        }

    var bioObj = {
    "1628443": {
        "imageLandscape": "http://io.cnn.net/nba/nba/.element/media/2.0/teamsites/celtics/media/profile-kadeem-allen_300x300.jpg",
        "imagePortrait": "http://io.cnn.net/nba/nba/.element/media/2.0/teamsites/celtics/media/profile-kadeem-allen_500x200.jpg",
        "overview": "Kadeem Allen played his first two years of college basketball at Hutchinson Community College (2012–2014) in Hutchinson, NC, before transferring to University of Arizona for his final two years (2015–2017). Allen was drafted by the Celtics in the 2017 NBA draft and signed the franchise's first two-way contract. Under the terms of the deal, he will split time between the Celtics and their G-League affiliate, the Maine Red Claws.",
        "acquired": "53rd overall pick, 2017 NBA Draft",
        "fullName": "Kadeem Frank Allen",
        "nicknames": "Big Bruiser, B.B",
        "birthplace": "Wilmington, NC",
        "highSchool": "New Hanover HS / Emsley A. Laney HS (Wilmington, NC)",
        "twitter": "N/A",
        "instagram": "N/A",
        "personal": [
            "Is looking to become the second alumnus of Emsley A. Laney High School (Wilmington, North Carolina) to make the NBA. The other was Michael Jordan.",
            "At age 24, was the oldest player selected in the 2017 Draft by 244 days."
        ],
        "awards": []
    },
    "203382": {
        "imageLandscape": "http://io.cnn.net/nba/nba/.element/media/2.0/teamsites/celtics/media/profile-aron-baynes_300x300.png",
        "imagePortrait": "http://io.cnn.net/nba/nba/.element/media/2.0/teamsites/celtics/media/profile-aron-baynes_300x300.png",
        "overview": "Aron Baynes attended the Australian Institute of Sport in 2005 and played college basketball for Washington State University (2005–2009). He began his professional career in 2009-10 playing for Lietuvos Rytas of the Lithuanian Basketball League, a squad that went on to win the Lithuanian National Championship. Baynes represents the Australian National Team.",
        "acquired": "Signed as a free agent on July 8, 2016.",
        "fullName": "Aron John Baynes",
        "nicknames": "Bangers",
        "birthplace": "Gisborne, New Zealand",
        "highSchool": "N/A",
        "twitter": "@aronbaynes",
        "instagram": "houseobayne",
        "personal": [
            "He and his wife, Rachel, were married in the summer of 2014 and have one son.",
            "He is the youngest of three children. Has a brother, Callum, and a sister, Rebecca.",
            "Played rugby while in high school.",
            "Enjoys cooking. Barbecuing is his specialty.",
            "Received his bachelors of science in kinesiology."
        ],
        "awards": []
    },
    "1628444": {
        "imageLandscape": "http://io.cnn.net/nba/nba/.element/media/2.0/teamsites/celtics/media/profile-jabari-bird_300x300.jpg",
        "imagePortrait": "http://io.cnn.net/nba/nba/.element/media/2.0/teamsites/celtics/media/profile-jabari-bird_300x300.jpgg",
        "overview": "Jabari Bird played college basketball for University of California, Berkeley (2013–2017) where he earned All-Pac-12 Honorable Mention honors in 2016-17 after leading the Golden Bears in scoring with 14.3 points on 43.9% shooting. He was signed to a two-way contract by the Celtics on September 5, 2017. Under the terms of the deal, he will split time between the Celtics and their G-League affiliate, the Maine Red Claws.",
        "acquired": "56th overall pick, 2017 NBA Draft",
        "fullName": "Jabari Carl Bird",
        "nicknames": "",
        "birthplace": "Walnut Creek, CA",
        "highSchool": "Salesian Prep HS (Richmond, CA)",
        "twitter": "N/A",
        "instagram": "Jabari_bird",
        "personal": [],
        "awards": []
    },
    "1627759": {
        "imageLandscape": "http://io.cnn.net/nba/nba/.element/media/2.0/teamsites/celtics/media/profile-test-photo_300x300.png",
        "imagePortrait": "http://io.cnn.net/nba/nba/.element/media/2.0/teamsites/celtics/media/profile-test-photo_300x300.png",
        "overview": "Jaylen Brown played college basketball for the California Golden Bears (2015–2016). As a freshman, he was named first-team All-Pac-12 and was also named Pac-12 Freshman of the Year. After the season, he decided to forgo his remaining college eligibility, and at age 19 was selected by Boston in the 2016 NBA draft.",
        "acquired": " 3rd overall pick, 2017 NBA Draft.",
        "fullName": "Jaylen Marselles Brown",
        "nicknames": ["JB"," Old Man"],
        "birthplace": "Marietta, GA",
        "highSchool": "Wheeler HS (Marietta, GA)",
        "twitter": "@FCHWPO",
        "instagram": "FCHWPO",
        "personal": [
            "In his free time, he enjoys playing chess, meditation, hot yoga and table tennis. He’s also very invested in education; he took a graduate-level class during his freshman year at Cal.",
            "His brother Quenton played Division I football at the University of North Texas, and his cousin A.J. Bouye is a cornerback for the Houston Texans.",
            "During his senior season at Wheeler High School, he clinched the Georgia Class 6A state title by sinking two free throws with 0.6 seconds remaining to give his team a 59-58 victory.",
            "His mother calls him 'old man' because he 'moves slow and talks slow'.",
            "He is fluent in Spanish. He also studied Italian in preparation for the Adidas Eurocamp in Italy so that he could converse with the referees.",
            "His father is Quenton Marselles Brown, a professional boxer, who is the 2016 WBU World Champion, the 2015 WBU C.A.M. Heavyweight Champion as well as a member of the Hawaii State Boxing Commission Board."
        ],
        "awards": []
    },
    "202330": {
        "imageLandscape": "http://io.cnn.net/nba/nba/.element/media/2.0/teamsites/celtics/media/profile-test-photo_300x300.png",
        "imagePortrait": "http://io.cnn.net/nba/nba/.element/media/2.0/teamsites/celtics/media/profile-test-photo_300x300.png",
        "overview": "Gordon Hayward played college basketball at Butler University (2008–2010) for two seasons where he led his team to a runner-up finish in the 2010 NCAA Tournament his sophomore season. He was selected by the Utah Jazz with the ninth overall pick in the 2010 NBA draft. Hayward was named an NBA All-Star for the first time in 2017.",
        "acquired": "Signed as a free agent on July 14, 2017.",
        "fullName": "Gordon Daniel Hayward",
        "nicknames": "",
        "birthplace": "Brownsburg, IN",
        "highSchool": "Brownsburg HS (Brownsburg, IN)",
        "twitter": "@gordonhayward",
        "instagram": "",
        "personal": [
            "Was a star tennis player at Brownsburg High School in Brownsburg, Indiana. He played mixed doubles with his twin sister, Heather, and the duo competed together in the Indiana State Open. Heather continued her tennis career at Butler University, where Gordon would also attend to pursue a basketball career.",
            "Almost gave up on basketball following his freshman season at Brownsburg. He stood 5-foot-11 at the time and was projected to top out at 6-2 at most, so he did not think playing college basketball was a realistic goal. Hayward’s mother, however, swayed him to continue to pursue his hoops dream. He surprisingly shot up to 6-4 by the start of his sophomore season and now stands 6-8.",
            "Both his parents stand 5-foot-10.",
            "NBA spokesperson for national #LeanIn campaign.",
            "His passion is video games. He is avid in the gaming community and has even participated in the IGN Pro League. Hayward competed in his first eSports event in 2011, when was one of 256 gamers who qualified for a Starcraft II tournament in Atlantic City, New Jersey.",
            "First Butler player drafted since 1983 NBA Draft (Lynn Mitchem in ninth round, 186th overall).",
            "Was majoring in computer engineering at Butler and maintained a 3.31 GPA (selected Third Team Academic All-American) and has continued his education through online coursework."
        ],
        "awards": []
    },
    "201143": {
        "imageLandscape": "http://io.cnn.net/nba/nba/.element/media/2.0/teamsites/celtics/media/profile-test-photo_300x300.png",
        "imagePortrait": "http://io.cnn.net/nba/nba/.element/media/2.0/teamsites/celtics/media/profile-test-photo_300x300.png",
        "overview": "Al Horford played college basketball for the University of Florida (2004–2007), and was the starting center on the Florida Gators teams that won back-to-back NCAA national championships in 2006 and 2007. He was drafted with the third overall pick in the 2007 NBA draft by the Atlanta Hawks, a team he played nine seasons with before joining the Celtics in 2016. He also represents the Dominican Republic national team.",
        "acquired": "Signed as a free agent on July 8, 2016.",
        "fullName": "Alfred Joel Horford Reynoso",
        "nicknames": "",
        "birthplace": "Puerto Planta, Dominican Republic",
        "highSchool": "Grand Ledge HS (Grand Ledge, MI)",
        "twitter": "@Al_Horford",
        "instagram": "al_horford",
        "personal": [
            "Married 2003 Miss Universe Amelia Vega in Santo Domingo (DR) on December 24, 2011",
            "His parents are Alfredo 'Tito' Horford and Arelis Reynoso • Tito played three years in the NBA with Milwaukee (1988-90) and Washington (1993-94).",
            "Has three brothers and two sisters.",
            "A telecommunications major at Florida, would work in TV or real estate if he wasn't playing pro ball.",
            "Earned the Jason Collier Memorial Trophy at the end of the ’09 season, presented annually to the individual who best exemplifies the characteristics Collier displayed off the court as a community ambassador.",
            "In 2011, donated $23,000 to Direct Relief International to help the people of Japan recover from the tsunami and earthquake.",
            "A two-time winner of the NBA’s Community Assist Award (February ’08 and March ’11).",
            "Loves all types of music and is a very good ping-pong player.",
            "He's visited the White House on two occasions following the NCAA championship and says if he could be anyone for a day it would be the President.",
            "Enjoys eating white rice and black beans, beef and chicken dishes and sweet plantains Horford's favorite actor and actress - Denzel Washington and Jessica Alba.",
            "His favorite movie is 'Dark Knight Rises” and top TV show is 'American Dad'."
        ],
        "awards": []
    },
    "202681": {
        "imageLandscape": "http://io.cnn.net/nba/nba/.element/media/2.0/teamsites/celtics/media/profile-test-photo_300x300.png",
        "imagePortrait": "http://io.cnn.net/nba/nba/.element/media/2.0/teamsites/celtics/media/profile-test-photo_300x300.png",
        "overview": "Kyrie Irving played college basketball for Duke University (2010–2011). He was named NBA Rookie of the Year after being selected by the Cleveland Cavaliers with the first overall pick in the 2011 NBA draft. He won an NBA Championship with the Cavaliers in 2016, thanks to his game-winning shot with 53 seconds remaining in Game 7. Irving has also played for the United States national team, with whom he has won gold at the 2014 FIBA Basketball World Cup and the 2016 Summer Olympics.",
        "acquired": "Acquired from Cleveland in exchange for Isaiah Thomas, Jae Crowder, Ante Zizic, a Brooklyn 2018 first round draft pick and a 2020 Miami second round draft pick on August 22, 2017.",
        "fullName": "Kyrie Andrew Irving",
        "nicknames": "Uncle Drew",
        "birthplace": "Melbourne, Victoria (Australia)",
        "highSchool": "St. Patrick’s HS (Elizabeth, NJ)",
        "twitter": "@KyrieIrving",
        "instagram": "kyrieirving",
        "personal": [
            "His father, Drederick, played at Boston University from 1984-88. Drederick had his jersey retired and ranks second in BU history with 1,931 career points.",
            "His father went on to play professionally for the Bulleen Boomers in Australia, where Kyrie was born and holds citizenship with along with the United States.",
            "Former All-NBA point guard Rod Strickland is Irving’s godfather. Strickland played 18 NBA seasons and led the league in assists during the 1997-98 season as a member of the Washington Wizards.",
            "Took on the role of 'Uncle Drew' in a series of Pepsi Max advertisements, which include appearances from Bill Russell, Kevin Love, Nate Robinson, Maya Moore, Baron Davis and Ray Allen.",
            "Favorite book is 'Catcher in the Rye'."
        ],
        "awards": []
    },
    "203499": {
        "imageLandscape": "http://io.cnn.net/nba/nba/.element/media/2.0/teamsites/celtics/media/profile-test-photo_300x300.png",
        "imagePortrait": "http://io.cnn.net/nba/nba/.element/media/2.0/teamsites/celtics/media/profile-test-photo_300x300.png",
        "overview": "Shane Larkin played college basketball for the University of Miami (2011–2013). He was selected by the Atlanta Hawks with the 18th overall pick in the 2013 NBA draft, where he was immediately traded to the Dallas Mavericks. Larkin is the son of Baseball Hall of Famer Barry Larkin.",
        "acquired": "Signed as a free agent on July 31, 2017",
        "fullName": "DeShane Davis Larkin",
        "nicknames": "",
        "birthplace": "Cincinnati, Ohio",
        "highSchool": "Dr. Phillips HS (Orlando, FL)",
        "twitter": "@ShaneLarkin_3",
        "instagram": "ShaneLarkin_0",
        "personal": [
            "Is the son of Hall-of-Fame shortstop Barry Larkin. Barry was the 1995 National League MVP, earned 12 All-Star selections, three Gold Glove Awards and nine Silver Slugger Awards during his 19 seasons with the Cincinnati Reds.",
            "Has three uncles on his father’s side who were also standout athletes. Stephen Larkin was a teammate of Barry on the Reds. Byron Larkin was a second-team All-American and the all-time leading scorer for the Xavier men’s basketball team. And Mike Larkin was a captain on Notre Dame’s football team during the mid-1980s.",
            "Originally wanted to follow in his father’s footsteps and become a baseball player. When he was in elementary school he received hitting tips from all-time hits leader Pete Rose and Hall-of-Fame infielder Tony Perez.",
            "Likes watching movies, listening to music and playing the piano in his spare time."
        ],
        "awards": []
    },
    "202694": {
        "imageLandscape": "http://io.cnn.net/nba/nba/.element/media/2.0/teamsites/celtics/media/profile-test-photo_300x300.png",
        "imagePortrait": "http://io.cnn.net/nba/nba/.element/media/2.0/teamsites/celtics/media/profile-test-photo_300x300.png",
        "overview": "Marcus Morris played college basketball at Kansas (2008–2011), alongside his twin brother Markieff, where he was named  Big 12 Player of the Year and the Big 12 Championship Most Outstanding Player following a standout junior season in which he averaged a team-best 17.2 points and 7.6 rebounds while finishing second in the Big 12 Conference in shooting percentage (57.0%). He was drafted 14th overall by the Houston Rockets in the 2011 NBA draft.",
        "acquired": " Acquired from Detroit in exchange for Avery Bradley and a future second round draft pick on July 7, 2017.",
        "fullName": "Marcus David Morris",
        "nicknames": "Mook",
        "birthplace": "Philadelphia, Pennsylvania",
        "highSchool": "Apex Academy (Pennsauken, NJ)",
        "twitter": "MookMorris2",
        "instagram": "foestar13",
        "personal": [
            "Enjoyed reading when he was a child, so his grandmother gave him the nickname “Mook Book.” The nickname was shortened to “Mook,” which has stuck with him ever since.",
            "Was born Sept. 2, 1989, seven minutes after Markieff. He was fittingly drafted five minutes after Markieff when Houston selected him 14th overall – one pick after his slightly-older brother – in the 2011 NBA Draft.",
            "He started a game for the Phoenix Suns alongside Markieff on March 10, 2013, marking the first time in NBA history that a set of twins were in the same starting lineup.",
            "Majored in American studies at KU.",
            "Grew up a fan of the hometown Philadelphia Eagles and was frequently at odds with brother Markieff, who is a supporter of the Dallas Cowboy.",
            "Favorite movies of all-time are 'The 6th Man', 'Good Burger' and 'Taken'.",
            "Favorite video game is 'Madden'.",
            "Would have pursued being a video game creator or football player if not in the NBA.",
            "He and Markieff have mostly identical tattoos.",
            "He and Markieff have the words 'Family Over Everything' tattooed on their left biceps and include 'FOE' at the end of most tweet.",
            "Favorite comfort food is cornbread."
        ],
        "awards": []
    },
    "1627846": {
        "imageLandscape": "http://io.cnn.net/nba/nba/.element/media/2.0/teamsites/celtics/media/profile-test-photo_300x300.png",
        "imagePortrait": "http://io.cnn.net/nba/nba/.element/media/2.0/teamsites/celtics/media/profile-test-photo_300x300.png",
        "overview": "Abdel Nader played college basketball for Northern Illinois (2011–2013) and Iowa State (2014–2016) before being drafted by the Boston Celtics with the 58th overall pick in the 2016 NBA draft. On April 14, 2017, he was named the 2016–17 NBA Development League Rookie of the Year, becoming the first internationally-born player to be named NBA D-League Rookie of the Year.",
        "acquired": "58th overall pick, 2016 NBA Draft",
        "fullName": "",
        "nicknames": "",
        "birthplace": "Alexandria, Egypt",
        "highSchool": "Niles North HS (Skokie, IL)",
        "twitter": "AbdelNader2",
        "instagram": "dulenader2",
        "personal": [
            "His family moved to the United States when he was three years old.",
            "Is the second Egypt native to play in an NBA game. The other was former Celtics forward Alaa Abdelnaby.",
            "Helped lead Niles North High School (Illinois) to its first sectional championship in 47 years during his final prep season."
        ],
        "awards": []
    },
    "1628400": {
        "imageLandscape": "http://io.cnn.net/nba/nba/.element/media/2.0/teamsites/celtics/media/profile-test-photo_300x300.png",
        "imagePortrait": "http://io.cnn.net/nba/nba/.element/media/2.0/teamsites/celtics/media/profile-test-photo_300x300.png",
        "overview": "Semi Ojeleye spent his first two collegiate years at Duke University (2013–2015) before transferring to Southern Methodist Univeristy (2016–2017) seeking a larger role. In 2016–17 he led the team to both American Athletic Conference (AAC) regular season and Tournament championships. Following the close of his redshirt junior season, Ojeleye entered his name for the 2017 NBA draft.",
        "acquired": "37th overall pick, 2017 NBA Draft",
        "fullName": "Jesusemilore Talodabijesu Ojeleye",
        "nicknames": "",
        "birthplace": "Overland Park, KS",
        "highSchool": "Ottawa HS (Ottawa, KS)",
        "twitter": "@semi",
        "instagram": "",
        "personal": [
            "His family is from Nigeria",
            "His father, Ernest, came to the United States for a residency at the University of Kansas medical center.",
            "His mother, Joy, is a registered nurse.",
            "His older brother, Victory, played basketball at Kansas State from 2008-11.",
            "Was a standout student athlete at Ottawa High School in Ottawa, Kansas, having graduated Magna Cum Laude with a 4.0 GPA.",
            "Majored in Psychology."
        ],
        "awards": []
    },
    "1626179": {
        "imageLandscape": "http://io.cnn.net/nba/nba/.element/media/2.0/teamsites/celtics/media/profile-test-photo_300x300.png",
        "imagePortrait": "http://io.cnn.net/nba/nba/.element/media/2.0/teamsites/celtics/media/profile-test-photo_300x300.png",
        "overview": "Terry Rozier played college basketball for the Louisville Cardinals (2013–2015) and made the AAC All-Rookie Team. In his second season he was the only player in the ACC to average at least two steals per game and was the fourth-highest scorer in the conference, putting up 17.1 points per game.",
        "acquired": "16th overall pick, 2015 NBA Draft",
        "fullName": "Terry William Rozier III",
        "nicknames": "",
        "birthplace": "Youngstown, OH",
        "highSchool": "Hargrave Military Academy (Chatham, VA)",
        "twitter": "T_Rozzay3",
        "instagram": "gmb_chum12",
        "personal": [
            "Majored in sports administration with a minor in communication.",
            "When he was in sixth grade, he set a goal to play for Rick Pitino at the University of Louisville. On. Sept. 11, 2011, Rozier committed to his dream university.",
            "His favorite food is spaghetti mixed with sugar and ranch dressing."
        ],
        "awards": []
    },
    "203935": {
        "imageLandscape": "http://io.cnn.net/nba/nba/.element/media/2.0/teamsites/celtics/media/profile-test-photo_300x300.png",
        "imagePortrait": "http://io.cnn.net/nba/nba/.element/media/2.0/teamsites/celtics/media/profile-test-photo_300x300.png",
        "overview": "Marcus Smart played college basketball for Oklahoma State University (2012–2014). During his second season, Smart was named one of the 30 finalists for the Naismith College Player of the Year. In his high school career, he achieved a record of 115–6 through three seasons and was a two-time 5A state champion.",
        "acquired": "6th overall pick, 2014 NBA Draft",
        "fullName": "Marcus Osmond Smart",
        "nicknames": "Hound Dog",
        "birthplace": "Flower Mound, TX",
        "highSchool": "Marcus (Flower Mound, TX)",
        "twitter": "@smart_MS3",
        "instagram": "youngamechanger",
        "personal": [
            "Smart holds the freshman steals record in the Big 12 after grabbing 99 of them in 2012-13.",
            "Was a football player growing up but stopped playing when he hit sixth grade.",
            "Enjoys playing tennis during his spare time.",
            "He has three older brothers: Todd Westbrook (deceased), Jeff Westbrook and Michael Smart.",
            "Wears number 36 because his siblings all wore #3 and #6 because of his draft position (sixth overall)."
        ],
        "awards": []
    },
    "1628369": {
        "imageLandscape": "http://io.cnn.net/nba/nba/.element/media/2.0/teamsites/celtics/media/profile-test-photo_300x300.png",
        "imagePortrait": "http://io.cnn.net/nba/nba/.element/media/2.0/teamsites/celtics/media/profile-test-photo_300x300.png",
        "overview": "Jayson Tatum attended Chaminade College Preparatory School, where he rated as five-star recruit and regarded as one of the top players in the Class of 2016 by most recruiting services. After playing basketball with the Duke Blue Devils (2016–2017), Tatum declared himself eligible for the 2017 NBA draft.",
        "acquired": "3rd overall pick, 2017 NBA Draft",
        "fullName": "Jayson Christopher Tatum",
        "nicknames": "J",
        "birthplace": "St. Louis, MO",
        "highSchool": "Chaminade College Prep (St. Louis, MO)",
        "twitter": "@jaytatum0",
        "instagram": "jaytatum0",
        "personal": [
            "His father Justin played Division I college basketball at Saint Louis University, before embarking on an international basketball career. He then became the head coach of the Christian Brothers College High School basketball team in St. Louis, which was the archrival squad of Jayson’s team at Chaminade College Preparatory School.",
            "Has a brother, Jaycob and a sister, Kayden.",
            "Began attending college when he was just an infant. His mother was 19 when he was born and he would regularly tag along to her undergrad, law school and business school classes."
        ],
        "awards": []
    },
    "1628464": {
        "imageLandscape": "http://io.cnn.net/nba/nba/.element/media/2.0/teamsites/celtics/media/profile-test-photo_300x300.png",
        "imagePortrait": "http://io.cnn.net/nba/nba/.element/media/2.0/teamsites/celtics/media/profile-test-photo_300x300.png",
        "overview": "Daniel Theis made his debut in the German top-tier level league, the Basketball Bundesliga, during the 2010–11 season. But he primarily gained playing time with the club’s development squad, where he played alongside his older brother, Frank from 2010 to 2012. In 2014, Theis signed with Brose Baskets where he played from 2014-2017 and won three straight German League championships.",
        "acquired": "Signed as a free agent on July 20, 20­­17.",
        "fullName": "",
        "nicknames": "",
        "birthplace": "Salzgitter, Germany",
        "highSchool": "",
        "twitter": "@dtheis10",
        "instagram": "dtheis10",
        "personal": [

        ],
        "awards": []
    },
    "1627824": {
        "imageLandscape": "http://io.cnn.net/nba/nba/.element/media/2.0/teamsites/celtics/media/profile-test-photo_300x300.png",
        "imagePortrait": "http://io.cnn.net/nba/nba/.element/media/2.0/teamsites/celtics/media/profile-test-photo_300x300.png",
        "overview": "Guerschon Yabusele began his pro career in 2013 with the official Roanne team of the LNB Pro B. He later signed with Rouen Métropole Basket of the LNB Pro A, the top league in France, in the summer of 2015. He was considered one of the best international prospects in the 2016 NBA Draft. Following the draft, he signed a deal with the Shanghai Sharks of the CBA where he was named a CBA All-Star.",
        "acquired": "16th overall pick, 2016 NBA Draft",
        "fullName": "",
        "nicknames": "The Dancing Bear, Yabu",
        "birthplace": "Dreux, France",
        "highSchool": "",
        "twitter": "",
        "instagram": "",
        "personal": [
            "Trained as a boxer throughout the early portions of his life.",
            "Started boxing when he was five years old and he attributes that to his great agility. After his workout with the Phoenix Suns, he said, 'It’s a great workout for your body, for your hands, [and allows you to] move quickly with your feet and your ankles.'",
            "He aspired to be a soccer player during his youth, but his father advised him to focus on basketball.",
            "Told Celtics.com that he’s been studying English during the past year by watching movies.",
            "According to Yabusele, as he was flying into New York City for the NBA Draft, a woman sitting next to him on the plane predicted that the Celtics would select him."
        ],
        "awards": []
    }
}
    /*=================================================
    =            SOCIAL => PLAYERSPOTLIGHT            =
    =================================================*/
    playerSpotlight(roster, bioObj, teamStats, playerSpotlightCounter);
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
/*========================================
=            PLAYER SPOTLIGHT            =
========================================*/
function playerSpotlight(roster, bioObj, teamStats, playerSpotlightCounter) {
    /* 1 - WHITE LINE HORIZTONAL */
    setTimeout(function() {
            jQuery('.white-line.horizontal').addClass('transition');
        }, 500)
        /* 2a - WHITE LINE VERTICAL */
    setTimeout(function() {
            jQuery('.social-top .white-line.vertical:nth-child(odd)').addClass('transition');
            jQuery('.social-bottom .white-line.vertical:nth-child(even)').addClass('transition');
        }, 800)
        /* 2b - WHITE LINE VERTICAL */
    setTimeout(function() {
        jQuery('.social-top .white-line.vertical:nth-child(even)').addClass('transition');
        jQuery('.social-bottom .white-line.vertical:nth-child(odd)').addClass('transition');
    }, 1000)
    setTimeout(function() {
            jQuery('.social-top, .social-bottom').fadeOut(100);
            jQuery('.player-box-wrap').fadeTo(100, 1);
        }, 1200)
        /* 4 - APPEND HEADSHOTS */
    setTimeout(function() {
            jQuery('.player-box-wrap, .player-box').addClass("transition");
            var delay = 0;
            for (i = 0; i < roster.length; i++) {
                var headshot = 'https://ak-static.cms.nba.com/wp-content/uploads/headshots/nba/latest/1040x760/' + roster[i].pid + '.png';
                jQuery('.player-box:nth-child(' + (i + 1) + ')').append('<img class="headshot" src="' + headshot + '"/>');
                jQuery('.player-box:nth-child(' + (i + 1) + ')').attr('data-pid', roster[i].pid);
                jQuery('.player-box img').on("error", function() {
                    jQuery(this).attr('src', 'https://i.cdn.turner.com/nba/nba/.element/media/2.0/teamsites/celtics/media/generic-player-light_600x438.png');
                });
                jQuery('.player-box:nth-child(' + (i + 1) + ') img').delay(delay).fadeTo(300, 1);
                delay += 30;
            }
        }, 1300)
        /* 5 - SELECT A PLAYER */
    setTimeout(function() {
        jQuery('.player-box').addClass('transition-2');
        jQuery('.player-box:nth-child(' + (playerSpotlightCounter + 1) + ')').addClass('selected');
        jQuery('.player-box').not('.replacement.selected').delay(500).fadeTo(100, 0);
    }, 2000)
    setTimeout(function() {
        jQuery('.block-wrap.social').addClass('transition-3');
        jQuery('.player-box.replacement.selected').addClass('transition-3');
    }, 3000)
    setTimeout(function() {
        jQuery('.player-box.replacement.selected').clone().appendTo('.block-wrap.player-spotlight .top-wrap');
        jQuery('.block-wrap.player-spotlight').show();
        jQuery('.block-wrap.social').hide();
        var stats = teamStats.tpsts.pl.filter(function (player){
            return player.pid  == roster[playerSpotlightCounter].pid;
        });
        console.log(stats);
        jQuery('.player-spotlight .top-wrap .player-top').append(' <img class="silo" src="http://io.cnn.net/nba/nba/.element/media/2.0/teamsites/celtics/media/silo-466x591-' + roster[playerSpotlightCounter].pid + '.png"/><div class="top"><div class="player-name-wrap"><p class="player-name"><span>' + roster[playerSpotlightCounter].fn.toUpperCase() + '</span><br> ' + roster[playerSpotlightCounter].ln.toUpperCase() + '</p></div><p class="player-number">' + roster[playerSpotlightCounter].num + '</br><span>' + roster[playerSpotlightCounter].pos + '</span></p></div>   <div class="middle"><ul class="info clearfix"><li><p>AGE<span class="sm-hide">:&nbsp;</span></br><span class="info-value">' + playerAge(roster[playerSpotlightCounter].dob) + '</span></p></li><li><p>HT<span class="sm-hide">:&nbsp;</span></br><span class="info-value">' + roster[playerSpotlightCounter].ht + '</span></p></li><li><p>WT<span class="sm-hide">:&nbsp;</span></br><span class="info-value">' + roster[playerSpotlightCounter].wt + '</span></p></li></ul></div><div class="bottom full clearfix sm-hide"><table class="averages"><tr class="averages-labels"><td><p>GP</p></td><td><p>PPG</p></td><td><p>RPG</p></td><td><p>APG</p></td></tr><tr class="averages-season"><td class="gp"><p></p></td><td class="pts"><p></p></td><td class="reb"><p></p></td><td class="ast"><p></p></td></tr></table></div>');
        jQuery(".player-spotlight .averages-season").html('<td><p>' + stats[0].avg.gp + '</p></td><td><p>' + stats[0].avg.pts + '</p></td><td><p>' + stats[0].avg.reb + '</p></td><td><p>' + stats[0].avg.ast + '</p></td>')
        jQuery('.player-spotlight .player-name').fadeTo(200,1);
            var min = Math.ceil(0);
            console.log(roster);
            console.log(bioObj);
            console.log(roster[playerSpotlightCounter].pid)
            var max = bioObj[roster[playerSpotlightCounter].pid].personal.length;
            console.log(max);
            var randomNumber = Math.floor(Math.random() * max);
                console.log(randomNumber);
        jQuery('.player-spotlight .dyk-box').append('<p>Lorem ipsum shnaaaa</p>')
        jQuery('.player-spotlight .bottom-wrap').addClass('transition-1')
    }, 3600)
    setTimeout(function() {
        jQuery('.player-spotlight .player-top .player-name, .player-spotlight .player-name-wrap, .player-spotlight .headshot, .player-spotlight .info, .player-spotlight .silo, .player-spotlight .averages, .player-spotlight .player-number').addClass('transition-1');
        if (playerSpotlightCounter < 16) {
            playerSpotlightCounter++;
        } else {
            playerSpotlightCounter = 0;
        }
    }, 4100)
    setTimeout(function() {
        jQuery('.block-wrap.player-spotlight .player-box').remove();
    }, 4600)
}
/*==================================
=            HIGHLIGHTS            =
==================================*/
function highlights() {};
/*====================================
=            STAT LEADERS            =
====================================*/
function statLeaders() {};
/*==============================
=            SOCIAL            =
==============================*/
function social(roster) {};
/*==================================
=            MOBILE APP            =
==================================*/
function mobileApp() {};
/*=================================
=            STANDINGS            =
=================================*/
function standings() {};
/*=========================================
=            AROUND THE LEAGUE            =
=========================================*/
function aroundTheLeague() {};