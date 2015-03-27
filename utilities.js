//utility functions

var U = {
	randInt : function(min,max) {
		return Math.floor(Math.random()*(max-min+1)+min);
	},

	nearestMultiple : function(number, multiple, method) {
		switch (method) {
			case "floor":
				return Math.floor(number/multiple)*multiple;
			case "ceil":
				return Math.ceil(number/multiple)*multiple;
			case "round":
				return Math.round(number/multiple)*multiple;
		}
	},

	RGB : function(color) {
		return "rgb("+color[0]+","+color[1]+","+color[2]+")";
	},

	RGBtoHex : function(triplet) {
		return "0x" + triplet.reduce(function(prev, curr){
			var hex = curr.toString(16);
			if (hex.length < 2) {
				hex = "0" + hex;
			}
		return prev+hex;
		}, "");
	},
	
	HexToWeb : function(hex) {
		return "#" + hex.slice(2);
	},
	
	replaceAt : function(string, index, character) {
		return string.substr(0, index) + character + string.substr(index+character.length);
	},
};

U.testCanvas = document.createElement("canvas");
U.testContext = U.testCanvas.getContext("2d");

var i; //used in loops
