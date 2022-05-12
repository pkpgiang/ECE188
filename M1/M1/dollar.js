/**
 * The $1 Unistroke Recognizer (JavaScript version)
 *
 *  Jacob O. Wobbrock, Ph.D.
 *  The Information School
 *  University of Washington
 *  Seattle, WA 98195-2840
 *  wobbrock@uw.edu
 *
 *  Andrew D. Wilson, Ph.D.
 *  Microsoft Research
 *  One Microsoft Way
 *  Redmond, WA 98052
 *  awilson@microsoft.com
 *
 *  Yang Li, Ph.D.
 *  Department of Computer Science and Engineering
 *  University of Washington
 *  Seattle, WA 98195-2840
 *  yangli@cs.washington.edu
 *
 * The academic publication for the $1 recognizer, and what should be
 * used to cite it, is:
 *
 *     Wobbrock, J.O., Wilson, A.D. and Li, Y. (2007). Gestures without
 *     libraries, toolkits or training: A $1 recognizer for user interface
 *     prototypes. Proceedings of the ACM Symposium on User Interface
 *     Software and Technology (UIST '07). Newport, Rhode Island (October
 *     7-10, 2007). New York: ACM Press, pp. 159-168.
 *     https://dl.acm.org/citation.cfm?id=1294238
 *
 * The Protractor enhancement was separately published by Yang Li and programmed
 * here by Jacob O. Wobbrock:
 *
 *     Li, Y. (2010). Protractor: A fast and accurate gesture
 *     recognizer. Proceedings of the ACM Conference on Human
 *     Factors in Computing Systems (CHI '10). Atlanta, Georgia
 *     (April 10-15, 2010). New York: ACM Press, pp. 2169-2172.
 *     https://dl.acm.org/citation.cfm?id=1753654
 *
 * This software is distributed under the "New BSD License" agreement:
 *
 * Copyright (C) 2007-2012, Jacob O. Wobbrock, Andrew D. Wilson and Yang Li.
 * All rights reserved. Last updated July 14, 2018.
 *
 * Redistribution and use in source and binary forms, with or without
 * modification, are permitted provided that the following conditions are met:
 *    * Redistributions of source code must retain the above copyright
 *      notice, this list of conditions and the following disclaimer.
 *    * Redistributions in binary form must reproduce the above copyright
 *      notice, this list of conditions and the following disclaimer in the
 *      documentation and/or other materials provided with the distribution.
 *    * Neither the names of the University of Washington nor Microsoft,
 *      nor the names of its contributors may be used to endorse or promote
 *      products derived from this software without specific prior written
 *      permission.
 *
 * THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS
 * IS" AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO,
 * THE IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR
 * PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL Jacob O. Wobbrock OR Andrew D. Wilson
 * OR Yang Li BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY,
 * OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF
 * SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS
 * INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT,
 * STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY
 * OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
**/
//
// Point class
//
function Point(x, y) // constructor
{
	this.X = x;
	this.Y = y;
}
//
// Rectangle class
//
function Rectangle(x, y, width, height) // constructor
{
	this.X = x;
	this.Y = y;
	this.Width = width;
	this.Height = height;
}
//
// Unistroke class: a unistroke template
//
function Unistroke(name, points) // constructor
{
	this.Name = name;
	this.Points = Resample(points, NumPoints);
	var radians = IndicativeAngle(this.Points);
	this.Points = RotateBy(this.Points, -radians);
	this.Points = ScaleTo(this.Points, SquareSize);
	this.Points = TranslateTo(this.Points, Origin);
	this.Vector = Vectorize(this.Points); // for Protractor
}
//
// Result class
//
function Result(name, score, ms) // constructor
{
	this.Name = name;
	this.Score = score;
	this.Time = ms;
}
//
// DollarRecognizer constants
//
const NumUnistrokes = 5;
const NumPoints = 64;
const SquareSize = 250.0;
const Origin = new Point(0,0);
const Diagonal = Math.sqrt(SquareSize * SquareSize + SquareSize * SquareSize);
const HalfDiagonal = 0.5 * Diagonal;
const AngleRange = Deg2Rad(45.0);
const AnglePrecision = Deg2Rad(2.0);
const Phi = 0.5 * (-1.0 + Math.sqrt(5.0)); // Golden Ratio
//
// DollarRecognizer class
//
function DollarRecognizer() // constructor
{
	//
	// one built-in unistroke per gesture type
	//
	this.Unistrokes = new Array(NumUnistrokes);
	this.Unistrokes[0] = new Unistroke("heart", new Array(new Point(171,162),new Point(171,161),new Point(171,160),new Point(172,160),new Point(172,159),new Point(172,158),new Point(173,158),new Point(173,157),new Point(174,157),new Point(174,156),new Point(174.12384409601182,156),new Point(175,156),new Point(176,155),new Point(176,154),new Point(176,153),new Point(177,152),new Point(178,152),new Point(178,151),new Point(179,150),new Point(179,149.99495249509562),new Point(179,149),new Point(180,149),new Point(180,148),new Point(181,148),new Point(181,147),new Point(181,146),new Point(182,145),new Point(183,144),new Point(183.30046447617002,144),new Point(184,144),new Point(184,143),new Point(185,142),new Point(185,141),new Point(186,141),new Point(186,140),new Point(187,140),new Point(187,139),new Point(188,139),new Point(188,138.98990499019123),new Point(188,138),new Point(189,138),new Point(189,137),new Point(190,137),new Point(190,136),new Point(191,136),new Point(192,136),new Point(192,135),new Point(193,135),new Point(193,134.8660608941794),new Point(193,134),new Point(194,134),new Point(194,133),new Point(195,133),new Point(196,133),new Point(196,132),new Point(197,132),new Point(198,132),new Point(198,131),new Point(198.2577832018324,131),new Point(199,131),new Point(200,131),new Point(201,130),new Point(202,130),new Point(202,129),new Point(203,129),new Point(204,129),new Point(205,128),new Point(205.55320017309805,128),new Point(206,128),new Point(207,128),new Point(207,127),new Point(208,127),new Point(209,127),new Point(210,127),new Point(210,126),new Point(211,126),new Point(212,125),new Point(212.2628307067368,125),new Point(213,125),new Point(214,125),new Point(215,125),new Point(216,125),new Point(216,124),new Point(217,124),new Point(218,124),new Point(219,124),new Point(219.9805271563241,123.01947284367593),new Point(220,123),new Point(221,123),new Point(222,123),new Point(223,123),new Point(224,123),new Point(225,123),new Point(226,123),new Point(226,122),new Point(227,122),new Point(228,122),new Point(228.0963053363874,122),new Point(229,122),new Point(230,122),new Point(231,122),new Point(232,122),new Point(233,122),new Point(234,122),new Point(235,122),new Point(235,123),new Point(236,123),new Point(236,123.22014943239923),new Point(236,124),new Point(237,124),new Point(237,125),new Point(238,125),new Point(238,126),new Point(238,127),new Point(239,127),new Point(239,128),new Point(239,129),new Point(239,129.34399352841106),new Point(239,130),new Point(240,130),new Point(240,131),new Point(240,132),new Point(241,132),new Point(241,133),new Point(242,133),new Point(242,134),new Point(242,135),new Point(242.33081115672363,135.33081115672363),new Point(243,136),new Point(243,137),new Point(243,138),new Point(243,139),new Point(244,139),new Point(244,140),new Point(244,141),new Point(244,142),new Point(245,142),new Point(245,142.17746815806163),new Point(245,143),new Point(246,144),new Point(246,145),new Point(246,146),new Point(246,147),new Point(246,148),new Point(246,149),new Point(246,150),new Point(246,150.88709869170037),new Point(246,151),new Point(246,152),new Point(246,153),new Point(246,154),new Point(246,155),new Point(246,156),new Point(246,157),new Point(246,158),new Point(246,159),new Point(246,160.0109427877122),new Point(246,161),new Point(246,162),new Point(246,163),new Point(246,164),new Point(246,165),new Point(245,165),new Point(245,166),new Point(245,168),new Point(244.90469128050373,168.09530871949627),new Point(244,169),new Point(244,170),new Point(244,171),new Point(243,172),new Point(243,173),new Point(242,174),new Point(241,175),new Point(241,175.6017767302435),new Point(241,176),new Point(241,177),new Point(241,178),new Point(240,179),new Point(240,180),new Point(239,180),new Point(239,181),new Point(238,181),new Point(238,182),new Point(238,182.31140726388224),new Point(238,183),new Point(237,184),new Point(237,185),new Point(236,186),new Point(236,187),new Point(235,188),new Point(235,189),new Point(234,189),new Point(233.9138618884967,189.17227622300658),new Point(233,191),new Point(233,192),new Point(232,192),new Point(232,193),new Point(232,194),new Point(231,194),new Point(230,195),new Point(230,195.66617322891375),new Point(230,196),new Point(229,196),new Point(229,198),new Point(228,199),new Point(227,201),new Point(226,202),new Point(226,202.72552222267961),new Point(226,203),new Point(225,204),new Point(225,205),new Point(224,205),new Point(223,207),new Point(223,209),new Point(222,209),new Point(221.93704386514625,209.18886840456125),new Point(221,212),new Point(220,212),new Point(220,214),new Point(219,215),new Point(218,215),new Point(218,215.74643765228893),new Point(218,217),new Point(217,219),new Point(216,220),new Point(215,221),new Point(215,223),new Point(214.1942133539452,223),new Point(214,223),new Point(213,224),new Point(211,228),new Point(211,229),new Point(210,230),new Point(210,230.62906766232086),new Point(210,231),new Point(209,232),new Point(208,233),new Point(208,234),new Point(207,235),new Point(207,236),new Point(206,236),new Point(205.32458624406308,237.35082751187386),new Point(205,238),new Point(204,239),new Point(204,240),new Point(203,241),new Point(202,242),new Point(202,243),new Point(201,244),new Point(201,244.74119294023308),new Point(201,245),new Point(200,245),new Point(199,246),new Point(199,247),new Point(198,248),new Point(197,249),new Point(197,250),new Point(196,251),new Point(195.79181721324747,251),new Point(195,251),new Point(195,252),new Point(194,253),new Point(194,254),new Point(193,254),new Point(193,255),new Point(193,256),new Point(192,256),new Point(191.351007977288,256.64899202271204),new Point(191,257),new Point(191,258),new Point(190,258),new Point(190,259),new Point(190,260),new Point(189,260),new Point(189,261),new Point(188,262),new Point(187.45742691909865,263.0851461618027),new Point(187,264),new Point(187,265),new Point(186,265),new Point(186,266),new Point(186,267),new Point(185,267),new Point(185,268),new Point(184,269),new Point(183.69285690117357,269.61428619765286),new Point(183,271),new Point(183,272),new Point(182,273),new Point(182,274),new Point(182,275),new Point(181,275),new Point(181,276),new Point(181,277),new Point(181,277.1603554039348),new Point(181,278),new Point(180,278),new Point(180,279),new Point(179,279),new Point(179,281),new Point(179,282),new Point(178,283),new Point(178,283.8699859375735),new Point(178,284),new Point(178,285),new Point(178,286),new Point(177,286),new Point(177,287),new Point(177,288),new Point(177,289),new Point(176,289),new Point(176,290),new Point(175.00616996641466,290),new Point(175,290),new Point(175,289),new Point(174,289),new Point(174,288),new Point(173,288),new Point(173,287),new Point(172,286),new Point(171,286),new Point(171,285),new Point(170.29653943277592,285),new Point(170,285),new Point(170,284),new Point(169,283),new Point(168,283),new Point(167,282),new Point(166,281),new Point(165,281),new Point(165,279.41533602388336),new Point(165,279),new Point(164,279),new Point(163,279),new Point(163,278),new Point(162,277),new Point(161,276),new Point(161,275),new Point(160,275),new Point(160,274.1199190526177),new Point(160,274),new Point(159,274),new Point(159,273),new Point(158,273),new Point(158,272),new Point(158,271),new Point(157,271),new Point(157,270),new Point(157,269),new Point(156,269),new Point(155.99722457519957,268.9972245751996),new Point(155,268),new Point(155,267),new Point(155,266),new Point(154,266),new Point(154,265),new Point(154,264),new Point(153,263),new Point(153,262),new Point(152.78833323154007,261.78833323154004),new Point(152,261),new Point(151,259),new Point(151,258),new Point(150,258),new Point(150,257),new Point(150,256),new Point(150,255),new Point(149.2270954292013,255),new Point(149,255),new Point(149,254),new Point(148,253),new Point(148,252),new Point(148,251),new Point(147,251),new Point(147,249),new Point(147,248),new Point(146.65879615549173,247.65879615549173),new Point(146,247),new Point(146,246),new Point(146,245),new Point(145,244),new Point(145,243),new Point(144,243),new Point(144,242),new Point(143,241),new Point(143,240.63626148667),new Point(143,240),new Point(143,239),new Point(142,238),new Point(142,237),new Point(142,236),new Point(141,235),new Point(140,235),new Point(140,234),new Point(139.5339066869861,233.5339066869861),new Point(139,233),new Point(139,232),new Point(138,231),new Point(138,230),new Point(138,229),new Point(137,228),new Point(136,227),new Point(136,226),new Point(135.8738546688849,226),new Point(135,226),new Point(135,225),new Point(135,224),new Point(134,223),new Point(134,222),new Point(133,221),new Point(132,220),new Point(132,219),new Point(131.99265125999233,219),new Point(131,219),new Point(131,218),new Point(130,217),new Point(130,216),new Point(129,215),new Point(128,214),new Point(128,213),new Point(127.37169875007477,212.37169875007478),new Point(127,212),new Point(127,211),new Point(126,210),new Point(126,209),new Point(125,208),new Point(124,207),new Point(124,206),new Point(124,205),new Point(123.64445800458033,205),new Point(123,205),new Point(123,204),new Point(122,203),new Point(122,202),new Point(122,201),new Point(121,201),new Point(121,200),new Point(120,200),new Point(120,199),new Point(120,198.9348274709416),new Point(120,198),new Point(119,197),new Point(119,196),new Point(119,195),new Point(118,194),new Point(118,193),new Point(118,192),new Point(117.03791793790965,191.03791793790964),new Point(117,191),new Point(117,190),new Point(116,190),new Point(116,189),new Point(116,188),new Point(116,187),new Point(115,187),new Point(115,186),new Point(115,185),new Point(115,184),new Point(114.95034693780975,183.95034693780977),new Point(114,183),new Point(114,182),new Point(114,181),new Point(114,180),new Point(113,180),new Point(113,179),new Point(112,178),new Point(112,177),new Point(112,176.63436299477158),new Point(112,176),new Point(112,175),new Point(111,175),new Point(111,174),new Point(111,173),new Point(111,172),new Point(111,171),new Point(111,170),new Point(110,169),new Point(110,168.92473246113283),new Point(110,168),new Point(110,167),new Point(110,166),new Point(110,165),new Point(110,164),new Point(110,163),new Point(110,162),new Point(110,161),new Point(111,161),new Point(111,160.800888365121),new Point(111,160),new Point(111,159),new Point(111,158),new Point(112,157),new Point(113,157),new Point(113,156),new Point(113,155),new Point(114,154),new Point(114,153.50547139385537),new Point(114,153),new Point(114,152),new Point(115,151),new Point(115,150),new Point(115,149),new Point(116,149),new Point(117,149),new Point(118,149),new Point(118,148),new Point(118.20415913978337,148),new Point(119,148),new Point(120,148),new Point(121,148),new Point(121,147),new Point(122,147),new Point(123,147),new Point(124,147),new Point(125,147),new Point(126,147),new Point(126.32800323579521,147),new Point(127,147),new Point(128,147),new Point(129,147),new Point(130,147),new Point(131,146),new Point(132,146),new Point(133,146),new Point(134,146),new Point(135,146),new Point(135.03763376943394,146),new Point(136,146),new Point(137,146),new Point(138,146),new Point(139,146),new Point(140,146),new Point(141,146),new Point(142,146),new Point(143,146),new Point(144,146),new Point(144.16147786544576,146),new Point(145,146),new Point(146,146),new Point(146,147),new Point(147,147),new Point(147,148),new Point(148,148),new Point(149,148),new Point(150,148),new Point(150,149),new Point(150.28532196145758,149),new Point(151,149),new Point(152,149),new Point(152,150),new Point(153,150),new Point(154,150),new Point(155,151),new Point(155,152),new Point(156,152),new Point(156.99495249509633,152),new Point(157,152),new Point(157,153),new Point(158,153),new Point(159,154),new Point(159,155),new Point(160,155),new Point(160,156),new Point(160,157),new Point(161,158),new Point(161,158.29036946636197),new Point(161,159),new Point(161,160),new Point(162,160),new Point(163,161),new Point(163,162),new Point(164,162),new Point(164,163),new Point(164,164),new Point(164,165)));
	this.Unistrokes[1] = new Unistroke("ok", new Array(new Point(208,95),new Point(208,94),new Point(209,94),new Point(210,94),new Point(211,94),new Point(212,93),new Point(213,93),new Point(214,93),new Point(215,93),new Point(215.2951953413129,92.7048046586871),new Point(216,92),new Point(217,92),new Point(218,92),new Point(219,92),new Point(220,92),new Point(221,92),new Point(221,91),new Point(222,91),new Point(222.83493851046813,91),new Point(223,91),new Point(224,91),new Point(224,90),new Point(225,90),new Point(226,90),new Point(227,90),new Point(228,90),new Point(229,90),new Point(230,90),new Point(230,89.3333786719247),new Point(230,89),new Point(231,89),new Point(232,89),new Point(233,89),new Point(234,89),new Point(235,89),new Point(236,89),new Point(237,89),new Point(238,89),new Point(238.49830414568245,89),new Point(239,89),new Point(240,89),new Point(241,89),new Point(242,89),new Point(243,89),new Point(244,89),new Point(245,89),new Point(246,89),new Point(247,89),new Point(247.32998696328963,89),new Point(248,89),new Point(249,90),new Point(250,90),new Point(250,91),new Point(251,91),new Point(252,91),new Point(253,91),new Point(253,92),new Point(253.7474562185237,92),new Point(254,92),new Point(255,92),new Point(256,93),new Point(257,93),new Point(258,93),new Point(258,94),new Point(259,94),new Point(259,95),new Point(260,95),new Point(260.16492547375776,95),new Point(261,95),new Point(261,96),new Point(262,96),new Point(263,96),new Point(263,97),new Point(264,97),new Point(265,97),new Point(265,98),new Point(265.70470848101087,98.70470848101088),new Point(266,99),new Point(267,99),new Point(267,100),new Point(268,100),new Point(269,100),new Point(269,101),new Point(270,101),new Point(270,102),new Point(271,102),new Point(271,102.41407754659899),new Point(271,103),new Point(272,103),new Point(273,104),new Point(274,105),new Point(274,106),new Point(275,106),new Point(275,107),new Point(276,108),new Point(276,108.00311967708687),new Point(276,109),new Point(277,109),new Point(278,109),new Point(278,110),new Point(278,111),new Point(279,111),new Point(279,112),new Point(279,113),new Point(279.83480249469403,113),new Point(280,113),new Point(280,114),new Point(280,115),new Point(281,116),new Point(282,116),new Point(282,117),new Point(282,118),new Point(283,119),new Point(283,119.838058187555),new Point(283,120),new Point(283,121),new Point(284,122),new Point(284,123),new Point(284,124),new Point(284,125),new Point(285,125),new Point(285,126),new Point(285,127),new Point(285,127.25552744278907),new Point(285,128),new Point(286,128),new Point(286,129),new Point(286,130),new Point(286,131),new Point(286,132),new Point(286,133),new Point(286,134),new Point(286.7687737477018,134.76877374770177),new Point(287,135),new Point(287,136),new Point(287,137),new Point(287,138),new Point(287,139),new Point(287,140),new Point(287,141),new Point(287,142),new Point(287,143),new Point(287,143.50467951563033),new Point(287,144),new Point(287,145),new Point(287,146),new Point(287,147),new Point(287,148),new Point(287,149),new Point(287,150),new Point(287,151),new Point(287,152),new Point(287,152.3363623332375),new Point(287,153),new Point(287,154),new Point(287,155),new Point(287,156),new Point(287,157),new Point(287,158),new Point(287,159),new Point(287,160),new Point(287,161),new Point(287,161.16804515084468),new Point(287,162),new Point(287,163),new Point(287,164),new Point(287,165),new Point(287,166),new Point(287,167),new Point(287,168),new Point(287,169),new Point(287,169.99972796845185),new Point(287,170),new Point(286,170),new Point(286,171),new Point(286,172),new Point(285,172),new Point(285,173),new Point(285,174),new Point(285,175),new Point(285,176),new Point(284.412103795226,176.58789620477395),new Point(284,177),new Point(284,178),new Point(284,179),new Point(283,180),new Point(283,181),new Point(283,182),new Point(282,183),new Point(282,184),new Point(281.70269489154003,184.29730510845997),new Point(281,185),new Point(281,186),new Point(280,186),new Point(280,187),new Point(280,188),new Point(279,189),new Point(279,190),new Point(278,191),new Point(278,191.00949504703476),new Point(278,192),new Point(277,192),new Point(277,193),new Point(276,193),new Point(276,194),new Point(276,195),new Point(275,196),new Point(274,197),new Point(274,197.01275073989575),new Point(274,198),new Point(273,199),new Point(272,200),new Point(272,201),new Point(271,201),new Point(271,202),new Point(270,202),new Point(270,203),new Point(269.98868174285514,203.0113182571449),new Point(269,204),new Point(268,204),new Point(268,205),new Point(267,205),new Point(267,206),new Point(266,207),new Point(265,207),new Point(265,208),new Point(264.98637962035565,208.01362037964432),new Point(264,209),new Point(263,209),new Point(263,210),new Point(262,210),new Point(262,211),new Point(261,211),new Point(260,212),new Point(260,213),new Point(259.97748218152134,213),new Point(259,213),new Point(259,214),new Point(258,214),new Point(258,215),new Point(257,215),new Point(256,215),new Point(256,216),new Point(255,217),new Point(254.56001292628727,217),new Point(254,217),new Point(254,218),new Point(253,218),new Point(252,218),new Point(252,219),new Point(251,219),new Point(250,220),new Point(250,221),new Point(249.1425436710532,221),new Point(249,221),new Point(248,221),new Point(247,222),new Point(246,222),new Point(245,223),new Point(244,223),new Point(243,223),new Point(243,224),new Point(242.39138469273095,224.60861530726905),new Point(242,225),new Point(241,225),new Point(240,225),new Point(239,225),new Point(239,226),new Point(238,226),new Point(237,226),new Point(236,226),new Point(235.09618935141805,226.90381064858195),new Point(235,227),new Point(234,227),new Point(233,227),new Point(232,227),new Point(231,227),new Point(231,228),new Point(230,228),new Point(229,228),new Point(228,228),new Point(227.3043494677241,228),new Point(227,228),new Point(226,228),new Point(226,229),new Point(225,229),new Point(224,229),new Point(223,229),new Point(222,229),new Point(221,229),new Point(219.47266665011693,229),new Point(219,229),new Point(218,229),new Point(217,229),new Point(216,229),new Point(215,229),new Point(214,230),new Point(213,230),new Point(212,230),new Point(211.05519739488287,230),new Point(211,230),new Point(210,230),new Point(209,230),new Point(208,230),new Point(207,230),new Point(206,230),new Point(205,230),new Point(204,230),new Point(203,230),new Point(202.2235145772757,230),new Point(202,230),new Point(201,230),new Point(200,230),new Point(199,230),new Point(198,230),new Point(197,230),new Point(196,230),new Point(195,230),new Point(194,230),new Point(193.39183175966852,230),new Point(193,230),new Point(192,230),new Point(191,230),new Point(190,230),new Point(189,230),new Point(188,230),new Point(187,230),new Point(186,230),new Point(186,229),new Point(185.56014894206135,229),new Point(185,229),new Point(184,229),new Point(184,228),new Point(183,228),new Point(182,227),new Point(181,227),new Point(180,227),new Point(180,226),new Point(179.14267968682728,226),new Point(179,226),new Point(178,225),new Point(178,224),new Point(177,224),new Point(176,224),new Point(175,223),new Point(173,222),new Point(173,221.3754919714661),new Point(173,221),new Point(172,221),new Point(172,220),new Point(171,220),new Point(170,219),new Point(169,219),new Point(168,219),new Point(168,218),new Point(167,218),new Point(167,217.95802271623202),new Point(167,217),new Point(166,217),new Point(166,216),new Point(165,216),new Point(164,216),new Point(163,215),new Point(162,215),new Point(161,214),new Point(161,213.95476702337106),new Point(161,213),new Point(160,213),new Point(159,212),new Point(158,212),new Point(157,211),new Point(156,211),new Point(156,210),new Point(155.25860655180642,209.25860655180642),new Point(155,209),new Point(154,209),new Point(153,208),new Point(152,208),new Point(152,207),new Point(151,207),new Point(150,207),new Point(149,206),new Point(148.36246920002222,206),new Point(148,206),new Point(148,205),new Point(147,204),new Point(146,204),new Point(146,203),new Point(145,203),new Point(144,202),new Point(143,202),new Point(143,201.35921350716126),new Point(143,201),new Point(142,200),new Point(141,200),new Point(141,199),new Point(140,199),new Point(140,198),new Point(139,198),new Point(139,197),new Point(139,196),new Point(138.9417442519272,196),new Point(138,196),new Point(137,195),new Point(137,194),new Point(136,194),new Point(136,193),new Point(136,192),new Point(136,191),new Point(135,191),new Point(135,190.52427499669312),new Point(135,190),new Point(135,189),new Point(135,188),new Point(135,187),new Point(135,186),new Point(135,185),new Point(135,184),new Point(135,183),new Point(135,182),new Point(135,181.69259217908595),new Point(135,181),new Point(135,180),new Point(135,179),new Point(135,178),new Point(135,177),new Point(135,176),new Point(135,175),new Point(135,174),new Point(135,173),new Point(135,172.86090936147878),new Point(135,172),new Point(135,171),new Point(135,170),new Point(135,169),new Point(135,168),new Point(135,167),new Point(135,166),new Point(135,165),new Point(135,164.0292265438716),new Point(135,164),new Point(135,163),new Point(135,162),new Point(135,161),new Point(135,160),new Point(135,159),new Point(135,158),new Point(135,157),new Point(135,156),new Point(135,155.19754372626443),new Point(135,155),new Point(136,155),new Point(136,154),new Point(136,153),new Point(137,153),new Point(138,151),new Point(138,150),new Point(138.9885855651794,149.0114144348206),new Point(139,149),new Point(139,148),new Point(139,147),new Point(140,147),new Point(140,146),new Point(140,145),new Point(141,145),new Point(141,144),new Point(142,143),new Point(142,142.59867319329607),new Point(142,142),new Point(143,142),new Point(143,141),new Point(143,140),new Point(144,139),new Point(144,138),new Point(145,138),new Point(145,137),new Point(145.818796061938,137),new Point(146,137),new Point(146,136),new Point(146,135),new Point(147,135),new Point(147,134),new Point(148,133),new Point(148,132),new Point(149,131),new Point(149.82205175479896,131),new Point(150,131),new Point(150,130),new Point(151,130),new Point(151,129),new Point(152,129),new Point(152,128),new Point(153,127),new Point(154,127),new Point(154,126),new Point(154.23952101003303,126),new Point(155,126),new Point(156,125),new Point(157,125),new Point(157,124),new Point(158,124),new Point(159,123),new Point(159,122),new Point(160,122),new Point(160.242776702894,122),new Point(161,122),new Point(161,121),new Point(162,121),new Point(162,120),new Point(163,120),new Point(164,119),new Point(164,118),new Point(165,118),new Point(165.46686439424337,117.53313560575664),new Point(166,117),new Point(167,116),new Point(168,116),new Point(168,115),new Point(168,114),new Point(169,114),new Point(169,113),new Point(170,113),new Point(170.66350165098905,113),new Point(171,113),new Point(171,112),new Point(172,112),new Point(172,111),new Point(173,110),new Point(174,109),new Point(175,109),new Point(175,108),new Point(175.66675734385,108),new Point(176,108),new Point(176,107),new Point(177,107),new Point(177,106),new Point(178,106),new Point(179,106),new Point(180,105),new Point(181,105),new Point(181,104),new Point(181.08422659908408,104),new Point(182,104),new Point(183,104),new Point(184,104),new Point(184,103),new Point(185,103),new Point(185,102),new Point(186,102),new Point(187,102),new Point(187.91590941669125,102),new Point(188,102),new Point(188,101),new Point(189,101),new Point(190,101),new Point(191,101),new Point(191,100),new Point(192,100),new Point(193,100),new Point(193,99),new Point(193.74759223429842,99),new Point(194,99),new Point(194,98),new Point(195,98),new Point(196,98),new Point(197,97),new Point(198,97),new Point(198,96),new Point(199,96),new Point(200,96),new Point(200.11671609856117,95.88328390143882),new Point(201,95),new Point(202,95),new Point(202,94),new Point(203,94),new Point(204,94),new Point(204,93),new Point(205,93),new Point(206,93),new Point(206.58253074476656,93),new Point(207,93),new Point(208,92),new Point(209,92),new Point(210,92),new Point(211,92),new Point(211,91),new Point(212,91),new Point(213,91),new Point(214,91)));
	this.Unistrokes[2] = new Unistroke("smile", new Array(new Point(121,168),new Point(120,168),new Point(120,169),new Point(120,170),new Point(120,171),new Point(120,171.80453380114895),new Point(120,172),new Point(120,173),new Point(120,174),new Point(120,175),new Point(119,176),new Point(119,176.1948540399248),new Point(119,177),new Point(119,178),new Point(119,179),new Point(118,180),new Point(118,180.58517427870063),new Point(118,181),new Point(118,182),new Point(118,183),new Point(118,184),new Point(118,185),new Point(118,185.38970807984958),new Point(118,186),new Point(118,187),new Point(118,188),new Point(118,189),new Point(118,190),new Point(118,190.19424188099853),new Point(118,191),new Point(118,192),new Point(118,193),new Point(118,194),new Point(118,194.99877568214748),new Point(118,195),new Point(118,196),new Point(118,197),new Point(118,199),new Point(118.80330948329643,199),new Point(119,199),new Point(119,200),new Point(119,201),new Point(119,202),new Point(120,203),new Point(120,203.19362972207227),new Point(120,204),new Point(120,205),new Point(121,206),new Point(121,207),new Point(121.26115036158295,207.5223007231659),new Point(122,209),new Point(123,209),new Point(123,210),new Point(123,211),new Point(123.10777423477789,211.1077742347779),new Point(124,212),new Point(124,213),new Point(125,214),new Point(126,214),new Point(126,214.12852246090003),new Point(126,216),new Point(127,216),new Point(127,217),new Point(127,217.93305626204898),new Point(127,218),new Point(128,219),new Point(129,220),new Point(130,221),new Point(130,221.49494937607864),new Point(130,222),new Point(131,223),new Point(132,225),new Point(132.6492016373547,225),new Point(133,225),new Point(133,226),new Point(134,227),new Point(134,228),new Point(135,228),new Point(135.02794618661713,228.02794618661713),new Point(136,229),new Point(137,230),new Point(137,231),new Point(138,231),new Point(138.01105105547643,231.01105105547643),new Point(139,232),new Point(139,233),new Point(140,234),new Point(140.88703495503293,234.44351747751648),new Point(142,235),new Point(143,237),new Point(143.9363034765863,237.9363034765863),new Point(144,238),new Point(145,238),new Point(145,239),new Point(146,240),new Point(147,240),new Point(147.21230156425904,240.21230156425904),new Point(148,241),new Point(149,242),new Point(150,243),new Point(150.86213286551782,243),new Point(151,243),new Point(151,244),new Point(153,245),new Point(154,245),new Point(154.30447925308002,245.30447925308002),new Point(155,246),new Point(156,247),new Point(157,248),new Point(157.99249180319666,248),new Point(158,248),new Point(159,248),new Point(159,249),new Point(160,250),new Point(161,250),new Point(161.27068899079862,250.27068899079862),new Point(162,251),new Point(163,251),new Point(164,252),new Point(165,252),new Point(165.25379385965792,252.25379385965792),new Point(166,253),new Point(167,254),new Point(168,254),new Point(169,254),new Point(169.29965582276492,254.14982791138246),new Point(171,255),new Point(172,256),new Point(173,257),new Point(173.07506409368096,257),new Point(174,257),new Point(175,257),new Point(176,258),new Point(177.4653843324568,258),new Point(178,258),new Point(179,258),new Point(180,259),new Point(181,259),new Point(181,259.85570457123265),new Point(181,260),new Point(182,260),new Point(183,260),new Point(184,261),new Point(185,261),new Point(185.2460248100085,261),new Point(186,261),new Point(188,261),new Point(188,262),new Point(189,262),new Point(189.05055861115744,262),new Point(190,262),new Point(191,262),new Point(192,262),new Point(193.65924509538445,262.8296225476922),new Point(194,263),new Point(195,263),new Point(196,264),new Point(197,264),new Point(198,264),new Point(198.00934467358243,264),new Point(200,264),new Point(201,265),new Point(202,265),new Point(202.39966491235828,265),new Point(204,265),new Point(205,266),new Point(206,266),new Point(206.78998515113412,266),new Point(207,266),new Point(209,266),new Point(210,266),new Point(211,266),new Point(211.59451895228307,266),new Point(212,266),new Point(213,266),new Point(214,266),new Point(215,266),new Point(216,266),new Point(216.39905275343202,266),new Point(217,266),new Point(218,266),new Point(219,266),new Point(220,266),new Point(221,266),new Point(221.20358655458097,266),new Point(222,266),new Point(223,266),new Point(225,266),new Point(226,266),new Point(226.00812035572991,266),new Point(228,266),new Point(229,266),new Point(230,266),new Point(230.81265415687886,266),new Point(231,266),new Point(232,265),new Point(233,264),new Point(234,264),new Point(234.5577381339478,263.4422618660522),new Point(235,263),new Point(236,263),new Point(236,262),new Point(237,261),new Point(237.6841182981741,260.65794085091295),new Point(239,260),new Point(240,259),new Point(241,258),new Point(241.3570226039553,257.6429773960447),new Point(242,257),new Point(243,256),new Point(244,255),new Point(244,254),new Point(244.066799322617,254),new Point(245,254),new Point(245,252),new Point(246,251),new Point(246.3232323416739,250.6767676583261),new Point(247,250),new Point(248,249),new Point(249,248),new Point(249,246.98098732457748),new Point(249,246),new Point(250,246),new Point(250,245),new Point(250.8155147763488,243.3689704473024),new Point(251,243),new Point(252,242),new Point(253,241),new Point(253,239.43641482452557),new Point(253,239),new Point(254,238),new Point(254,237),new Point(254.8738130655737,235.2523738688526),new Point(255,235),new Point(255,234),new Point(256,232),new Point(256.90955375809096,231.09044624190906),new Point(257,231),new Point(257,230),new Point(257,228),new Point(258,227),new Point(258,226.73759006319762),new Point(258,225),new Point(259,224),new Point(259,222.34726982442177),new Point(259,222),new Point(259,221),new Point(259,220),new Point(260,218),new Point(260,217.77880400077262),new Point(260,217),new Point(261,216),new Point(261,215),new Point(261,214),new Point(261,213.38848376199678),new Point(261,213),new Point(261,211),new Point(261,210),new Point(261,209),new Point(261.2941918039974,208.70580819600258),new Point(262,208),new Point(262,206),new Point(263,205),new Point(263,204.6078432844451),new Point(263,204),new Point(263,203),new Point(263,202),new Point(263,201),new Point(263,200),new Point(263,199.80330948329615),new Point(263,198),new Point(263,197),new Point(263,196),new Point(263,195),new Point(263,194.9987756821472),new Point(263,194),new Point(263,193),new Point(263,192),new Point(264,191),new Point(264,190.60845544337135),new Point(264,190),new Point(264,189),new Point(264,188),new Point(264,187),new Point(264,186),new Point(264,185.8039216422224),new Point(264,185),new Point(264,184),new Point(264,183),new Point(265,183),new Point(265,182),new Point(265,181.99938784107346),new Point(265,181),new Point(265,180),new Point(265,179),new Point(265,178),new Point(265,177.1948540399245),new Point(265,177),new Point(265,176),new Point(265,175),new Point(266,175),new Point(266,174),new Point(266,173.39032023877556),new Point(266,173),new Point(267,172),new Point(267,171),new Point(267,170),new Point(267,169)));
	this.Unistrokes[3] = new Unistroke("sad", new Array(new Point(114,263),new Point(114,262),new Point(114,261),new Point(114,260),new Point(114,259),new Point(114,258),new Point(114.59281020842216,257.4071897915778),new Point(115,257),new Point(115,255),new Point(116,254),new Point(117,253),new Point(117,252.56592021379157),new Point(117,252),new Point(118,251),new Point(119,249),new Point(119.72545132765292,247.54909734469416),new Point(120,247),new Point(120,246),new Point(122,245),new Point(122.88923180541539,243.22153638916922),new Point(123,243),new Point(123,242),new Point(124,241),new Point(125,239),new Point(125.66495860948812,238.3350413905119),new Point(126,238),new Point(127,236),new Point(127,234),new Point(128.00933620274603,233.495331898627),new Point(129,233),new Point(130,231),new Point(131,229),new Point(131.18287795548807,228.81712204451193),new Point(132,228),new Point(133,226),new Point(134,224),new Point(134.0942007158642,223.81159856827162),new Point(135,222),new Point(137,220),new Point(137.44028372505926,219.11943254988148),new Point(138,218),new Point(139,216),new Point(140,215),new Point(140.29615206460417,214.11154380618748),new Point(141,212),new Point(143,210),new Point(143,209.2158294903402),new Point(143,208),new Point(145,207),new Point(145.75466579006752,204.73600262979744),new Point(146,204),new Point(148,202),new Point(149,201),new Point(149.45480127478953,200.3177980878157),new Point(151,198),new Point(152,196),new Point(152.36521503376352,195.269569932473),new Point(153,194),new Point(154,193),new Point(155.66672118027464,190.49991822958805),new Point(156,190),new Point(157,188),new Point(158,187),new Point(159.12235648295902,185.87764351704098),new Point(160,185),new Point(161,183),new Point(162,182),new Point(162.2994371253321,181.10168862400366),new Point(163,179),new Point(165,178),new Point(165.98069907400065,177.01930092599935),new Point(166,177),new Point(168,174),new Point(169.55953343155917,172.44046656844083),new Point(170,172),new Point(171,171),new Point(173,168),new Point(173.1383677891177,167.8616322108823),new Point(174,167),new Point(176,166),new Point(176,165),new Point(177.2376728388231,164.38116358058846),new Point(178,164),new Point(179,164),new Point(181,162),new Point(181.81856479528602,161.18143520471398),new Point(182,161),new Point(184,160),new Point(185,160),new Point(186,159),new Point(186.6586632983702,158.3413367016298),new Point(187,158),new Point(188,158),new Point(190,157),new Point(190,156),new Point(191,156),new Point(191.11956926638348,156),new Point(193,156),new Point(194,155),new Point(195,155),new Point(196,154),new Point(196.12950237830114,154),new Point(197,154),new Point(199,153),new Point(200,153),new Point(201.73179463746519,153),new Point(202,153),new Point(203,152),new Point(204,152),new Point(205,151),new Point(206,151),new Point(206.74172774938285,151),new Point(207,151),new Point(209,151),new Point(210,151),new Point(211,151),new Point(212.5800879860467,151),new Point(213,151),new Point(214,150),new Point(215,150),new Point(216,150),new Point(217,150),new Point(218,150),new Point(218.00378759535045,149.99810620232478),new Point(220,149),new Point(221,149),new Point(222,149),new Point(223,149),new Point(223.60652691950148,149),new Point(225,149),new Point(226,149),new Point(227,149),new Point(228,149),new Point(229,149),new Point(229.44488715616532,149),new Point(230,149),new Point(232,149),new Point(233,149),new Point(234,149),new Point(235,149),new Point(235.28324739282917,149),new Point(236,149),new Point(237,149),new Point(239,149),new Point(240,149),new Point(240.79309636064508,149.79309636064508),new Point(241,150),new Point(242,150),new Point(243,150),new Point(244,150),new Point(246,150),new Point(246,150.54575430378375),new Point(246,151),new Point(247,152),new Point(249,152),new Point(250,152),new Point(250.9699009780745,152),new Point(251,152),new Point(252,153),new Point(253,153),new Point(254,154),new Point(254,155),new Point(254.97983408999215,155),new Point(256,155),new Point(257,156),new Point(258,156),new Point(258,157),new Point(258.9927643190799,157.99276431907992),new Point(259,158),new Point(260,158),new Point(261,159),new Point(262,160),new Point(263,160),new Point(263.7068948710617,160.70689487106173),new Point(264,161),new Point(265,163),new Point(266,163),new Point(267,164),new Point(267,164.77356544824534),new Point(267,165),new Point(269,166),new Point(270,167),new Point(270,168.9616441450363),new Point(270,169),new Point(271,169),new Point(272,171),new Point(273,171),new Point(273,172),new Point(273.25220002695573,172.50440005391152),new Point(274,174),new Point(275,174),new Point(275,176),new Point(275.8246481962791,176.8246481962791),new Point(276,177),new Point(277,178),new Point(278,180),new Point(279,181),new Point(279.2351807908797,181.47036158175942),new Point(280,183),new Point(280,184),new Point(281,185),new Point(281.7665057366085,186.53301147321702),new Point(282,187),new Point(283,188),new Point(284,189),new Point(284,191),new Point(284.3449437055316,191.34494370553162),new Point(285,192),new Point(286,194),new Point(287,195),new Point(287,196),new Point(287.18504220861576,196.18504220861576),new Point(289,198),new Point(289,199),new Point(290,201),new Point(290.0159003821939,201.03180076438775),new Point(291,203),new Point(291,204),new Point(292,205),new Point(292.54722532792266,206.09445065584532),new Point(293,207),new Point(294,209),new Point(295,211),new Point(295,211.35378933640916),new Point(295,212),new Point(297,215),new Point(297,216.58659829760902),new Point(297,217),new Point(298,218),new Point(299,219),new Point(299,221),new Point(299,221.59653140952668),new Point(299,223),new Point(300,223),new Point(301,224),new Point(301,225),new Point(301,226.02067808381742),new Point(301,227),new Point(302,228),new Point(302,229),new Point(302,230),new Point(302,231),new Point(302,231.44482475810815),new Point(302,232),new Point(302,233),new Point(302,234),new Point(303,234),new Point(303,235),new Point(303,236),new Point(303,236.283184994772),new Point(303,237),new Point(303,238),new Point(303,239),new Point(303,240),new Point(303,241),new Point(303,242),new Point(303,242.12154523143585),new Point(303,243),new Point(303,244),new Point(303,245),new Point(303,246),new Point(303,247),new Point(303,247.9599054680997),new Point(303,248),new Point(303,249),new Point(303,250),new Point(302,250),new Point(302,251),new Point(302,252),new Point(302,252.79826570476354),new Point(302,253),new Point(302,254),new Point(302,255),new Point(302,256),new Point(302,257),new Point(302,258),new Point(302,258.6366259414274),new Point(302,259),new Point(301,260),new Point(301,262),new Point(301,263),new Point(301,264),new Point(301,264.0607726157181),new Point(301,265),new Point(301,266),new Point(301,267),new Point(301,268),new Point(300,269),new Point(300,269.48491929000886),new Point(300,271),new Point(300,272),new Point(300,273),new Point(300,274),new Point(300,275),new Point(300,275.3232795266727),new Point(300,276),new Point(300,278),new Point(300,279),new Point(300,280),new Point(300,281),new Point(300,281.16163976333655),new Point(300,282),new Point(300,283),new Point(300,284),new Point(300,285),new Point(300,286),new Point(300,287)));
	this.Unistrokes[4] = new Unistroke("x", new Array(new Point(87,142),new Point(89,145),new Point(91,148),new Point(93,151),new Point(96,155),new Point(98,157),new Point(100,160),new Point(102,162),new Point(106,167),new Point(108,169),new Point(110,171),new Point(115,177),new Point(119,183),new Point(123,189),new Point(127,193),new Point(129,196),new Point(133,200),new Point(137,206),new Point(140,209),new Point(143,212),new Point(146,215),new Point(151,220),new Point(153,222),new Point(155,223),new Point(157,225),new Point(158,223),new Point(157,218),new Point(155,211),new Point(154,208),new Point(152,200),new Point(150,189),new Point(148,179),new Point(147,170),new Point(147,158),new Point(147,148),new Point(147,141),new Point(147,136),new Point(144,135),new Point(142,137),new Point(140,139),new Point(135,145),new Point(131,152),new Point(124,163),new Point(116,177),new Point(108,191),new Point(100,206),new Point(94,217),new Point(91,222),new Point(89,225),new Point(87,226),new Point(87,224)));
	//
	// The $1 Gesture Recognizer API begins here -- 3 methods: Recognize(), AddGesture(), and DeleteUserGestures()
	//
	this.Recognize = function(points, useProtractor)
	{
		var t0 = Date.now();
		var candidate = new Unistroke("", points);

		var u = -1;
		var b = +Infinity;
		for (var i = 0; i < this.Unistrokes.length; i++) // for each unistroke template
		{
			var d = OptimalCosineDistance(this.Unistrokes[i].Vector, candidate.Vector); // Protractor
			if (d < b) {
				b = d; // best (least) distance
				u = i; // unistroke index
			}
		}
		var t1 = Date.now();
		return (u == -1) ? new Result("No match.", 0.0, t1-t0) : new Result(this.Unistrokes[u].Name, useProtractor ? (1.0 - b) : (1.0 - b / HalfDiagonal), t1-t0);
	}
	this.AddGesture = function(name, points)
	{
		this.Unistrokes[this.Unistrokes.length] = new Unistroke(name, points); // append new unistroke
		var num = 0;
		for (var i = 0; i < this.Unistrokes.length; i++) {
			if (this.Unistrokes[i].Name == name)
				num++;
		}
		return num;
	}
	this.DeleteUserGestures = function()
	{
		this.Unistrokes.length = NumUnistrokes; // clear any beyond the original set
		return NumUnistrokes;
	}
}
//
// Private helper functions from here on down
//
function Resample(points, n)
{
	var I = PathLength(points) / (n - 1); // interval length
	var D = 0.0;
	var newpoints = new Array(points[0]);
	for (var i = 1; i < points.length; i++)
	{
		var d = Distance(points[i-1], points[i]);
		if ((D + d) >= I)
		{
			var qx = points[i-1].X + ((I - D) / d) * (points[i].X - points[i-1].X);
			var qy = points[i-1].Y + ((I - D) / d) * (points[i].Y - points[i-1].Y);
			var q = new Point(qx, qy);
			newpoints[newpoints.length] = q; // append new point 'q'
			points.splice(i, 0, q); // insert 'q' at position i in points s.t. 'q' will be the next i
			D = 0.0;
		}
		else D += d;
	}
	if (newpoints.length == n - 1) // somtimes we fall a rounding-error short of adding the last point, so add it if so
		newpoints[newpoints.length] = new Point(points[points.length - 1].X, points[points.length - 1].Y);
	return newpoints;
}
function IndicativeAngle(points)
{
	var c = Centroid(points);
	return Math.atan2(c.Y - points[0].Y, c.X - points[0].X);
}
function RotateBy(points, radians) // rotates points around centroid
{
	var c = Centroid(points);
	var cos = Math.cos(radians);
	var sin = Math.sin(radians);
	var newpoints = new Array();
	for (var i = 0; i < points.length; i++) {
		var qx = (points[i].X - c.X) * cos - (points[i].Y - c.Y) * sin + c.X
		var qy = (points[i].X - c.X) * sin + (points[i].Y - c.Y) * cos + c.Y;
		newpoints[newpoints.length] = new Point(qx, qy);
	}
	return newpoints;
}
function ScaleTo(points, size) // non-uniform scale; assumes 2D gestures (i.e., no lines)
{
	var B = BoundingBox(points);
	var newpoints = new Array();
	for (var i = 0; i < points.length; i++) {
		var qx = points[i].X * (size / B.Width);
		var qy = points[i].Y * (size / B.Height);
		newpoints[newpoints.length] = new Point(qx, qy);
	}
	return newpoints;
}
function TranslateTo(points, pt) // translates points' centroid
{
	var c = Centroid(points);
	var newpoints = new Array();
	for (var i = 0; i < points.length; i++) {
		var qx = points[i].X + pt.X - c.X;
		var qy = points[i].Y + pt.Y - c.Y;
		newpoints[newpoints.length] = new Point(qx, qy);
	}
	return newpoints;
}
function Vectorize(points) // for Protractor
{
	var sum = 0.0;
	var vector = new Array();
	for (var i = 0; i < points.length; i++) {
		vector[vector.length] = points[i].X;
		vector[vector.length] = points[i].Y;
		sum += points[i].X * points[i].X + points[i].Y * points[i].Y;
	}
	var magnitude = Math.sqrt(sum);
	for (var i = 0; i < vector.length; i++)
		vector[i] /= magnitude;
	return vector;
}
function OptimalCosineDistance(v1, v2) // for Protractor
{
	var a = 0.0;
	var b = 0.0;
	for (var i = 0; i < v1.length; i += 2) {
		a += v1[i] * v2[i] + v1[i+1] * v2[i+1];
		b += v1[i] * v2[i+1] - v1[i+1] * v2[i];
	}
	var angle = Math.atan(b / a);
	return Math.acos(a * Math.cos(angle) + b * Math.sin(angle));
}
function DistanceAtBestAngle(points, T, a, b, threshold)
{
	var x1 = Phi * a + (1.0 - Phi) * b;
	var f1 = DistanceAtAngle(points, T, x1);
	var x2 = (1.0 - Phi) * a + Phi * b;
	var f2 = DistanceAtAngle(points, T, x2);
	while (Math.abs(b - a) > threshold)
	{
		if (f1 < f2) {
			b = x2;
			x2 = x1;
			f2 = f1;
			x1 = Phi * a + (1.0 - Phi) * b;
			f1 = DistanceAtAngle(points, T, x1);
		} else {
			a = x1;
			x1 = x2;
			f1 = f2;
			x2 = (1.0 - Phi) * a + Phi * b;
			f2 = DistanceAtAngle(points, T, x2);
		}
	}
	return Math.min(f1, f2);
}
function DistanceAtAngle(points, T, radians)
{
	var newpoints = RotateBy(points, radians);
	return PathDistance(newpoints, T.Points);
}
function Centroid(points)
{
	var x = 0.0, y = 0.0;
	for (var i = 0; i < points.length; i++) {
		x += points[i].X;
		y += points[i].Y;
	}
	x /= points.length;
	y /= points.length;
	return new Point(x, y);
}
function BoundingBox(points)
{
	var minX = +Infinity, maxX = -Infinity, minY = +Infinity, maxY = -Infinity;
	for (var i = 0; i < points.length; i++) {
		minX = Math.min(minX, points[i].X);
		minY = Math.min(minY, points[i].Y);
		maxX = Math.max(maxX, points[i].X);
		maxY = Math.max(maxY, points[i].Y);
	}
	return new Rectangle(minX, minY, maxX - minX, maxY - minY);
}
function PathDistance(pts1, pts2)
{
	var d = 0.0;
	for (var i = 0; i < pts1.length; i++) // assumes pts1.length == pts2.length
		d += Distance(pts1[i], pts2[i]);
	return d / pts1.length;
}
function PathLength(points)
{
	var d = 0.0;
	for (var i = 1; i < points.length; i++)
		d += Distance(points[i - 1], points[i]);
	return d;
}
function Distance(p1, p2)
{
	var dx = p2.X - p1.X;
	var dy = p2.Y - p1.Y;
	return Math.sqrt(dx * dx + dy * dy);
}
function Deg2Rad(d) { return (d * Math.PI / 180.0); }