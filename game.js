Game = {};

//Load Scene------------------------------------------------------------------------
Game.Load = Scene.new_scene("load");

Game.Load.entered = function() {
		this.get_html_elements();
		this.load_menu.css("display","flex");
		this.expand();
		Scene.push_scene("main_menu");
};
		
Game.Load.obscuring = function() {
	this.load_menu.hide();
};
	
Game.Load.get_html_elements = function() {
	this.window = $(window);
	this.viewport = $("#viewport");
	this.load_menu = $("#loading");
};
	
Game.Load.expand = function() {
	this.viewport.height(this.window.height());
};
//TODO: load sounds and images
//----------------------------------------------------------------------------------	



//Main Menu Scene-------------------------------------------------------------------
Game.MainMenu = Scene.new_scene("main_menu");

Game.MainMenu.entered = function() {
	this.get_html_elements();
	this.bind_events();
	this.main_menu.css("display","flex");
};
	
Game.MainMenu.obscuring = function() {
	this.main_menu.hide();
};
	
Game.MainMenu.revealed = function() {
	this.main_menu.show();
};
			
Game.MainMenu.get_html_elements = function() {
	this.main_menu = $("#main_menu");
	this.start_button = $("#start_button").button();
	this.options_button = $("#options_button").button();
	this.calibrate_button = $("#calibrate_button").button();
	this.instructions_button = $("#instructions_button").button();
};

Game.MainMenu.bind_events = function() {
	this.start_button.bind("click", function(){
		Scene.push_scene("level");			
	});
	this.options_button.bind("click", function(){
		Scene.push_scene("options_menu");
	});
	this.calibrate_button.bind("click", function(){
		Scene.push_scene("calibrate_menu");
	});
};
//----------------------------------------------------------------------------------



//Options Menu Scene----------------------------------------------------------------
Game.OptionsMenu = Scene.new_scene("options_menu");
	
Game.OptionsMenu.entered = function() {
	this.get_html_elements();
	this.orb = Object.create(Game.Orb).init(this.window.width()/2, this.window.height()/2);
	this.orb.new_answer();
	this.show();		
	this.bind_events();
	this.update_form();
	this.expand();
	this.update_background();
	this.update_blendmode();
};

Game.OptionsMenu.determine_max_scale = function() {
	var window_height = this.window.height();
	var ctx = U.testContext;
	var orb_height = 0;
	var scale = 0;
	
	do {
		scale += 1;
		ctx.font = "bold " + S.ORB_FONT_SIZE*scale+"px " + S.ORB_FONT;
		orb_height = ctx.measureText("12345678").width + S.ORB_LINE_WIDTH*scale;
	} while (orb_height <= window_height);
	
	return scale-1;
};

Game.OptionsMenu.show = function() {
	this.options_menu.css("display","flex");	
};
	
Game.OptionsMenu.exiting = function() {
	this.release_events();
	this.options_menu.hide();
};
		
Game.OptionsMenu.update = function() {
	var bounce_ratio;
	switch(true) {
		case (this.radio_bounce_norm.prop('checked')):
			bounce_ratio = S.ORB_BOUNCE_VALUES.NORMAL;
			break;
		case (this.radio_bounce_horz.prop('checked')):
			bounce_ratio = S.ORB_BOUNCE_VALUES.HORIZONTAL;
			break;
		case (this.radio_bounce_vert.prop('checked')):
			bounce_ratio = S.ORB_BOUNCE_VALUES.VERTICAL;
			break;
	}
	
	var separation = this.vergence_slider.slider("value")*S.ORB_SCALE_STEP;
	var speed = this.speed_spinner.spinner("value")*S.ORB_SPEED_STEP;
	var scale = this.size_spinner.spinner("value");
	
	this.orb.update(this.canvas, {bounce_ratio:bounce_ratio, separation:separation, speed:speed, scale:scale});
};
		
Game.OptionsMenu.draw = function() {
	var width = this.canvas.width;
	var height = this.canvas.height;
	
	var color1;
	var color2;
	switch(true) {
		case (this.radio_palette_rb.prop('checked')):
			color1 = U.RGB(S.RED);
			color2 = U.RGB(S.BLUE);
			break;
		case (this.radio_palette_pt.prop('checked')):
			color1 = U.RGB(S.PURPLE);
			color2 = U.RGB(S.TEAL);
			break;
		case (this.radio_palette_rg.prop('checked')):
			color1 = U.RGB(S.RED2);
			color2 = U.RGB(S.GREEN);
	}		
	
	//clear
	this.context.clearRect(0,0,width,height);
	
	//draw orb
	this.orb.draw(this.context, color1, color2);
};

Game.OptionsMenu.expand = function() {
	this.options_menu.width(this.window.width());
	this.options_menu.height(this.window.height());
	this.canvas.width = this.window.width();
	this.canvas.height = this.window.height();
};
	
Game.OptionsMenu.update_background = function() {
	var bg_color;
	switch(true) {
		case (this.radio_palette_rb.prop('checked')):
			bg_color = S.BLACK;
			break;
		case (this.radio_palette_pt.prop('checked')):
			bg_color = S.GRAY;
			break;
		case (this.radio_palette_rg.prop('checked')):
			bg_color = S.ORANGE;
			break;
	}
	this.options_menu.css("background", U.RGB(bg_color));
};
	
Game.OptionsMenu.update_blendmode = function() {
	var blend;
	switch(true) {
		case (this.radio_palette_rb.prop('checked')):
			blend = "screen";
			break;
		case (this.radio_palette_pt.prop('checked') || this.radio_palette_rg.prop('checked')):
			blend = "multiply";
			break;
	}
	this.context.globalCompositeOperation = blend;		
};
	
Game.OptionsMenu.get_html_elements = function() {
	this.window = $(window);
	this.body = $('body');
	this.options_menu = $("#options_menu");
	this.canvas = $("#options_canvas")[0];
	this.context = this.canvas.getContext('2d');
	
	$("#palette_radio").buttonset();
	this.radio_palette_rb = $("#pal_rad_1");
	this.radio_palette_pt = $("#pal_rad_2");
	this.radio_palette_rg = $("#pal_rad_3");
	
	$("#bounce_radio").buttonset();
	this.radio_bounce_norm = $("#bounce_rad_1");
	this.radio_bounce_horz = $("#bounce_rad_2");
	this.radio_bounce_vert = $("#bounce_rad_3");
	
	this.time_spinner = $("#time_spinner").minute_spinner();
	this.time_spinner.minute_spinner("option", "min", 1);

	this.size_spinner = $("#size_spinner").spinner();
	this.size_spinner.spinner("option", "min", 1);
	this.size_spinner.spinner("option", "max", this.determine_max_scale());
	
	this.speed_spinner = $("#speed_spinner").spinner();
	this.speed_spinner.spinner("option", "min", 0);

	this.vergence_slider = $("#vergence_slider").slider();
	
	this.save_button = $("#options_save").button();
	this.cancel_button = $("#options_cancel").button();
};

Game.OptionsMenu.bind_events = function() {
	this.body.on('keyup', function(event){
		if (event.keyCode === 27) {
			Scene.pop_scene();
		}
	});
	
	this.vergence_slider.on("slidestop", (function(){
										this.orb.set_xy(this.window.width()/2, this.window.height()/2);
										this.orb.new_answer();
												}).bind(this)); 
	this.size_spinner.spinner({stop: (function(){
										this.size_slider();
										this.orb.set_xy(this.window.width()/2, this.window.height()/2);
										this.orb.new_answer();
												}).bind(this)}); 
	this.radio_palette_rb.on("click", (function(){
										this.update_background();
										this.update_blendmode();		 
												 }).bind(this));
	this.radio_palette_pt.on("click", (function(){
										this.update_background();
										this.update_blendmode();
												 }).bind(this));
	this.radio_palette_rg.on("click", (function(){
										this.update_background();
										this.update_blendmode();
												 }).bind(this));
	this.save_button.on("click", (function(){
		this.save_form();
		Scene.pop_scene();
	}).bind(this));
	this.cancel_button.on("click", function(){
		Scene.pop_scene();
	});		
};
	
Game.OptionsMenu.release_events = function() {
	this.body.off('keyup');
	this.radio_palette_rb.off("click");
	this.radio_palette_pt.off("click");
	this.radio_palette_rg.off("click");
	this.save_button.off("click");
	this.cancel_button.off("click");
};
	
Game.OptionsMenu.size_slider = function() {
	var old_value = this.vergence_slider.slider("value");
	
	this.vergence_slider.slider("destroy");
	this.vergence_slider = $("#vergence_slider").slider();
	var max_separation = Math.floor( (this.window.width() - (S.ORB_WIDTH*this.size_spinner.spinner("value") + 
	     S.ORB_LINE_WIDTH*this.size_spinner.spinner("value")) - S.ORB_LINE_WIDTH*this.size_spinner.spinner("value")) / S.ORB_SCALE_STEP);	
	
	
	
	
	
	this.vergence_slider.slider({min: -max_separation, max: max_separation})
						.slider('pips', {first: 'pip', last: 'pip', step: max_separation})
						.slider('float', {formatLabel: function(val){ if (val<0) {
																		  return val*(-1);  
																	  } else {
																		  return val;
																	  } } } );
	if (old_value > max_separation) {
		old_value = max_separation;
	} else if (old_value < -max_separation) {
		old_value = -max_separation;
	}
	this.vergence_slider.slider("value", old_value);
};
	
Game.OptionsMenu.update_form = function() {
	switch(S.PALETTE) {
		case "redblue":
			this.radio_palette_rb.prop('checked', true);
			break;
		case "purpteal":
			this.radio_palette_pt.prop('checked', true);
			break;
		case "redgreen":
			this.radio_palette_rg.prop('checked', true);
	}
	$("#palette_radio").buttonset("refresh");	

	switch(JSON.stringify(S.ORB_BOUNCE)) {
		case JSON.stringify(S.ORB_BOUNCE_VALUES.NORMAL):
			this.radio_bounce_norm.prop('checked', true);
			break;
		case JSON.stringify(S.ORB_BOUNCE_VALUES.HORIZONTAL):
			this.radio_bounce_horz.prop('checked', true);
			break;
		case JSON.stringify(S.ORB_BOUNCE_VALUES.VERTICAL):
			this.radio_bounce_vert.prop('checked', true);
			break;
	}
	$("#bounce_radio").buttonset("refresh");
	
	this.time_spinner.minute_spinner("value", S.GAME_LENGTH);
	this.size_spinner.spinner("value", S.ORB_SCALE);
	this.speed_spinner.spinner("value", Math.floor(S.ORB_SPEED/S.ORB_SPEED_STEP));
	this.vergence_slider.slider("value", Math.floor(S.ORB_SEPARATION/S.ORB_SCALE_STEP));
	this.size_slider();		
};
	
Game.OptionsMenu.save_form = function() {
	switch(true) {
		case (this.radio_palette_rb.prop('checked')):
			S.PALETTE = "redblue";
			break;
		case (this.radio_palette_pt.prop('checked')):
			S.PALETTE = "purpteal";
			break;
		case (this.radio_palette_rg.prop('checked')):
			S.PALETTE = "redgreen";
			break;
	}
	
	switch(true) {
		case (this.radio_bounce_norm.prop('checked')):
			S.ORB_BOUNCE = S.ORB_BOUNCE_VALUES.NORMAL;
			break;
		case (this.radio_bounce_horz.prop('checked')):
			S.ORB_BOUNCE = S.ORB_BOUNCE_VALUES.HORIZONTAL;
			break;
		case (this.radio_bounce_vert.prop('checked')):
			S.ORB_BOUNCE = S.ORB_BOUNCE_VALUES.VERTICAL;
			break;
	}
	
	S.ORB_SCALE = this.size_spinner.spinner("value");
	S.ORB_SPEED = this.speed_spinner.spinner("value")*S.ORB_SPEED_STEP;
	S.GAME_LENGTH = this.time_spinner.minute_spinner("value");
	S.ORB_SEPARATION = this.vergence_slider.slider("value")*S.ORB_SCALE_STEP;
};
//----------------------------------------------------------------------------------



//Level Scene-----------------------------------------------------------------------
Game.Level = Scene.new_scene("level");

Game.Level.entered = function(){	
	this.elapsed = 0;
	
	this.determine_palette();
	this.get_html_elements();
	this.expand();
	this.context.globalCompositeOperation = this.blendmode;
	this.level.css("display","flex");
	this.orb = Object.create(Game.Orb).init(this.window.width()/2, this.window.height()/2);
	this.orb.new_answer();
	this.add_listeners();
};

Game.Level.obscuring = function(){
	this.remove_listners();
};

Game.Level.revealed = function(){
	this.add_listeners();
};

Game.Level.exiting = function(){
	this.remove_listners();
	this.level.hide();
};	

Game.Level.update = function() {
	if (this.pause.is(":hidden")) {
		this.orb.update(this.canvas);
		this.update_countdown();
	}
};

Game.Level.draw = function() {	
	//clear canvas
	var width = this.canvas.width;
	var height = this.canvas.height;
	this.context.clearRect(0,0,width,height);
	
	//draw orb
	this.orb.draw(this.context, this.color1, this.color2);
};

Game.Level.determine_palette = function(){
	if (S.PALETTE === "purpteal") {
		this.blendmode = "multiply";
		this.color1 = U.RGB(S.PURPLE);
		this.color2 = U.RGB(S.TEAL);
		this.background = U.RGB(S.GRAY);
	} else if (S.PALETTE === "redblue") {
		this.blendmode = "screen";
		this.color1 = U.RGB(S.RED);
		this.color2 = U.RGB(S.BLUE);
		this.background = U.RGB(S.BLACK);
	} else if (S.PALETTE === "redgreen") {
		this.blendmode = "multiply";
		this.color1 = U.RGB(S.RED2);
		this.color2 = U.RGB(S.GREEN);
		this.background = U.RGB(S.ORANGE);
	}	
};

Game.Level.get_html_elements = function(){
	this.window = $(window);
	this.body = $('body');
	this.level = $("#level");
	this.level.css("background", this.background);
	this.canvas = $("#canvas")[0];
	this.context = this.canvas.getContext('2d');
	this.countdown = $("#countdown");
	this.pause = $("#pause")
	$("#pause_tabs").tabs();
	this.hits_graph = $("#hits_graph");
	this.misses_graph = $("#misses_graph");
	this.resume_button = $("#resume_button").button().button("enable");
	this.quit_button = $("#quit_button").button();	
};

Game.Level.expand = function(){
	this.level.width(this.window.width());
	this.level.height(this.window.height());		
	this.canvas.width = this.window.width();
	this.canvas.height = this.window.height();	
};

Game.Level.add_listeners = function(){
	this.body.on('keyup', (function(event){
		var input = "";
		switch(event.keyCode) {
			case 37:
				input = "left";
				break;
			case 38:
				input = "up";
				break;
			case 39:
				input = "right";
				break;
			case 40:
				input = "down";
				break;
		};
		if (input.length > 0) {
			this.orb.check_input(input);
		}
		if (event.keyCode === 27) {
			this.pause.toggle();
			if (this.pause.is(":visible")) {
				this.update_pause();
			}
		}
	}).bind(this));
	
	this.resume_button.on("click", (function(){
		this.pause.toggle();
	}).bind(this));
	
	this.quit_button.on("click", (function(){
		this.pause.toggle();
		Scene.pop_scene();
	}).bind(this));
};

Game.Level.remove_listners = function(){
	this.body.off('keyup');
	this.resume_button.off("click");
	this.quit_button.off("click");
};

Game.Level.update_countdown = function(){		
	this.elapsed += 1;
	var remaining = (S.GAME_LENGTH*60) - (this.elapsed/S.TICKS);
	var minutes = Math.floor(remaining/60);
	var seconds = Math.floor(remaining%60);
	this.countdown.html(minutes + ":" + ("0"+seconds).slice(-2));		
	
	if (this.elapsed/S.TICKS >= S.GAME_LENGTH*60) {
		this.update_pause();
		this.pause.show();
		this.resume_button.button("disable");
		this.body.off('keyup');
	}
};
	
Game.Level.update_pause = function(){
	//destroy old hex graph
	this.hits_graph.empty();
	this.misses_graph.empty();
	
	//create new correct hex graph
	this.create_hex_graph(S.HEX_CORRECT_COLOR,"#hits_graph", this.orb.correct_guesses);
	
	//create new incorrect hex graph
	this.create_hex_graph(S.HEX_INCORRECT_COLOR,"#misses_graph", this.orb.incorrect_guesses);
};

Game.Level.create_hex_graph = function(color, id, data){
	//use d3 to create hexbin
	var graph_width = this.window.width()*0.65;
	var graph_height = this.window.height()*0.65;
	
	var data_width = this.window.width();
	var data_height = this.window.height();

	var x = d3.scale.linear()
		.domain([0, data_width])
		.range([0, graph_width]);

	var y = d3.scale.linear()
		.domain([0, data_height])
		.range([0, graph_height]);		

	var points = data.map(function(xy){
		return [x(xy[0]),y(xy[1])];
	});

	var color = d3.scale.linear()
		.domain([0, 3])
		.range(["white", color])
		.interpolate(d3.interpolateLab);

	var hexbin = d3.hexbin()
		.size([graph_width, graph_height])
		.radius(25);

	var svg = d3.select(id).append("svg")
		.attr("width", graph_width)
		.attr("height", graph_height)
	  .append("g");

	svg.append("clipPath")
		.attr("id", "clip")
	  .append("rect")
		.attr("class", "mesh")
		.attr("width", graph_width)
		.attr("height", graph_height);
		
	svg.append("g")
		.attr("clip-path", "url(#clip)")
	  .selectAll(".hexagon")
		.data(hexbin(points))
	  .enter().append("path")
		.attr("class", "hexagon")
		.attr("d", hexbin.hexagon())
		.attr("transform", function(d) { return "translate(" + d.x + "," + d.y + ")"; })
		.style("fill", function(d) { return color(d.length); });

	svg.append("svg:path")
		.attr("clip-path", "url(#clip)")
		.attr("d",hexbin.mesh())
		.style("stroke-width", 0.1)
		.style("stroke", "gray")
		.style("fill", "none");			
};
//TODO: add other page of pause menu
//TODO: make hexes proportional to canvas
//TODO: comment all of the code
//----------------------------------------------------------------------------------



//Objects used by multiple scenes---------------------------------------------------
Game.Orb = {
	init : function(center_x, center_y){
		//starting coordinates
		this.center_x = center_x;
		this.center_y = center_y;

		//set initial orb properties according to settings
		this.speed = S.ORB_SPEED;
		this.bounce_ratio = S.ORB_BOUNCE;
		this.separation = S.ORB_SEPARATION;
		this.scale = S.ORB_SCALE;
		this.outer_line_width = this.scale * S.ORB_LINE_WIDTH;
		this.font = "bold " + S.ORB_FONT_SIZE*this.scale+"px " + S.ORB_FONT;
		U.testContext.font = this.font;
		this.outer_width = 	U.testContext.measureText("12345678").width;
		this.hex_points = this.calculate_hex_points();	
		
		this.rotation_counter = 0;
		
		this.underline_position = 0;
		
		//variables for movement
		this.x_dir = 1;
		this.y_dir = 1;
		
		//variables to store answers and guesses
		this.answer = "";
		this.correct_guesses = [];
		this.incorrect_guesses = [];
		
		//variables for wrong answer shake effect
		this.x_offset = 0;
		this.shaking = false;
		
		//variables for correct answer pulsate effect
		this.extra_thickness = 0;
		this.pulsating = false;
		
		//create functions that use closures
		this.shake = this.shake();
		this.pulsate = this.pulsate();

		return this;
	},
	
	calculate_hex_points : function(){
		var size = this.outer_width/2; 
 		var sides = 6;		
		var points = [];
		
		points.push([0 + size * Math.cos(0), 0 +  size *  Math.sin(0)]);          
		for (var i = 1; i < sides;i += 1) {
			points.push([0 + size * Math.cos(i * 2 * Math.PI / sides), 0 + size * Math.sin(i * 2 * Math.PI / sides)]);
		}
		return points;
	},

	pulsate : function() {
		var total = 0;
		var polarity = 1;
		var num_of_pulses = 1;
		var time = 0.3;
		var max = Math.round(this.outer_line_width*1.5);			
		var distance = num_of_pulses * max * 2;
		var speed = distance/time;
		var self = this;
		
		return function() {	
			self.pulsating = true;
			if (total >= distance) {
				total = 0;
				polarity = 1;
				self.extra_thickness = 0;
				self.pulsating = false;
				self.new_answer();
			} else {
				self.extra_thickness += (speed/S.TICKS*polarity);
				total += (speed/S.TICKS);
				if (self.extra_thickness >= max || self.extra_thickness <= 0) {
					self.extra_thickness = (self.extra_thickness > 0) ? max : 0;
					polarity *= (-1);
					total = U.nearestMultiple(total,max,"round");
				}
			}
		};
	},

	shake : function() {
		var total = 0;
		var polarity = 1;
		var num_of_shakes = 2;
		var time = 0.3;
		var self = this;
		
		return function(){
			var turn_point = self.outer_width/6;
			var distance = turn_point*4*num_of_shakes;
			var speed = distance/time;			
			self.shaking = true;
			
			if (total + (speed/S.TICKS) >= distance) {
				total = 0;
				polarity = 1;
				self.x_offset = 0;
				self.shaking = false;
			} else {		
				self.x_offset += (speed/S.TICKS*polarity);
				total += (speed/S.TICKS);
				if (self.x_offset >= turn_point || self.x_offset <= -turn_point) {
					self.x_offset = turn_point * polarity;
					polarity *= (-1);
					total = U.nearestMultiple(total,turn_point,"floor");
				}
			}
		};
	},
	
	draw : function(ctx, color1, color2){	
		this.draw_word(ctx,color1, this.word[0], 1);
		this.draw_word(ctx,color2, this.word[1], -1);
		if (this.pulsating || this.shaking) {
			this.draw_word(ctx,color1, this.word[1], 1);
			this.draw_word(ctx,color2, this.word[0], -1);			
		}
		this.draw_underline(ctx, color1, 1);		
		this.draw_underline(ctx, color2, -1);
		this.draw_outer_hex(ctx, color1, 1);
		this.draw_outer_hex(ctx, color2, -1);
	},	

	draw_underline : function(ctx,color,polarity){
		ctx.strokeStyle = color;		
		ctx.lineWidth = this.outer_line_width/2;
		var letter_width = ctx.measureText("m").width;
		var letter_height = ctx.measureText("m").width;		
		var word_width = ctx.measureText(this.word[0]).width;
		var word_length = this.word[0].length;
		var underline = letter_width * this.underline_position;
		
		var x = (this.center_x - word_width/2 + underline) + polarity*(this.separation/2) + this.x_offset;
		var y = this.center_y+letter_height;
		ctx.beginPath();
		ctx.moveTo(x, y);
		ctx.lineTo(x+letter_width, y);
		ctx.stroke();
	},
	
	draw_outer_hex : function(ctx, color, polarity){
		ctx.strokeStyle = color;
		ctx.lineWidth = this.outer_line_width + this.extra_thickness;
 
		var x = this.center_x + polarity*(this.separation/2) + this.x_offset; 
		var y = this.center_y;
		var rotation = this.rotation_counter * Math.PI/180;
		var points = this.hex_points;
		
		ctx.save();
		ctx.translate(x,y);
		ctx.rotate(rotation);
		ctx.beginPath();		
		ctx.moveTo(points[0][0], points[0][1]);          
		for (i=1; i<points.length; i++) {
			ctx.lineTo(points[i][0], points[i][1]);
		}		
		ctx.closePath();		
		ctx.stroke();
		ctx.restore();
	},	

	draw_word : function(ctx, color, word, polarity){	
		ctx.fillStyle = color;
		ctx.font = this.font;
		ctx.textAlign = "center";
		ctx.textBaseline = "middle";
		
		x = this.center_x + polarity*(this.separation/2) + this.x_offset;
		y = this.center_y;
		
		ctx.fillText(word,x,y);
	},
	
	bounce : function(axis) {
		if (axis === "x") {
			this.x_dir = this.x_dir * (-1);
		} else if (axis === "y") {
			this.y_dir = this.y_dir * (-1);
		}
	},
	
	update : function(canvas, options) {
		if (options !== undefined) {
			for (var key in options) {
				switch (key) {
					case "speed":
					case "bounce_ratio":
					case "separation":
						this[key] = options[key];
						break;						
					case "scale":
						this[key] = options[key];
						this.font = "bold " + S.ORB_FONT_SIZE*this.scale+"px " + S.ORB_FONT;
						U.testContext.font = this.font;
						this.outer_width = 	U.testContext.measureText("12345678").width;
						this.outer_line_width = this.scale * S.ORB_LINE_WIDTH;
						this.hex_points = this.calculate_hex_points();
						break;					
				}
			}
		}
				
		this.speed_x = this.speed*this.bounce_ratio[0] * this.x_dir;
		this.speed_y = this.speed*this.bounce_ratio[1] * this.y_dir;		
		this.check_bounds(canvas);
		
		this.rotation_counter += S.ORB_ROTATION_SPEED/S.TICKS;
		if (this.rotation_counter >= 360) {
			this.rotation_counter -= 360;
		}
		
		if (this.underline_position > this.word[0].length-1) {
			this.underline_position = this.word[0].length-1;
		}
		
		this.move();
		
		if (this.shaking) {
			this.shake();
		}
		
		if (this.pulsating) {
			this.pulsate();
		}
	},
	
	check_bounds : function(canvas) {
		var radius = ((this.outer_width/2)+this.outer_line_width/2);
		if (this.center_x + this.speed_x/S.TICKS + radius + this.separation/2 >= canvas.width ||
			this.center_x + this.speed_x/S.TICKS + radius - this.separation/2 >= canvas.width ||
			this.center_x + this.speed_x/S.TICKS - radius - this.separation/2  <= 0 ||
			this.center_x + this.speed_x/S.TICKS - radius + this.separation/2  <= 0){
				this.bounce("x");
		}
		if (this.center_y + this.speed_y/S.TICKS + radius >= canvas.height || this.center_y + this.speed_y/S.TICKS - radius <= 0) {
			this.bounce("y");
		}	
	},
	
	move : function() {
		this.center_x += this.speed_x/S.TICKS;
		this.center_y += this.speed_y/S.TICKS;
	},	

	new_answer : function() {	
		var word = Game.Word.new_word()
		
		this.answer = word[0];
		this.word = [word[1], word[2]];
	},
	
	set_xy : function(new_x, new_y) {
		this.center_x = new_x;
		this.center_y = new_y;
	},
	
	check_input : function(input) {
		//if not currently shaking or pulsating, check answers
		if (!this.shaking && !this.pulsating) {
			if (input === "up" || input === "down") {
				if ((this.answer === "spelled" && input === "up") || (this.answer === "misspelled" && input === "down")) {
					this.correct_guesses.push([this.center_x, this.center_y]);
					this.pulsate();
				} else {
					this.incorrect_guesses.push([this.center_x, this.center_y]);
					this.shake();
				}
			}	
			if (input === "right") {
				this.underline_position += 1;
				if (this.underline_position > this.word[0].length-1) {
					this.underline_position = 0;
				}			
			}
			if (input === "left") {
				this.underline_position -= 1;
				if (this.underline_position < 0) {
					this.underline_position = this.word[0].length-1;
				}
			}
		}
	},	
};

Game.Word = {
	new_word : function(){
		var word = this.words[U.randInt(0,this.words.length-1)];
		var answer;
		if (U.randInt(1,100) > 50) {
			answer = "spelled";
		} else {
			answer = "misspelled";
			word = this.transpose(word);
		}		
		word = this.split(word);
		return [answer, word[0], word[1]];
	},

	transpose : function(word){
		var start;
		var new_word = word;
		
		do {
			start = U.randInt(0,word.length-2);
		} while (word[start] === word[start+1]);
		
		new_word = U.replaceAt(new_word, start, word[start+1]);
		new_word = U.replaceAt(new_word, start+1, word[start]);
		
		return new_word;
	},
	
	split : function(word){
		var split_word;
		var pattern;
		var five = ["xooxo", "oxoox", "xoxxo", "oxxox"];
		var six = ["xooxxo", "oxxoox"];		
		var parse = function(wrd, pttrn){
			var word1 = "";
			var word2 = "";
			for (i=0; i < wrd.length; i++) {
				if (pttrn[i] === "x") {
					word1 += wrd[i];
					word2 += " ";
				} else if (pttrn[i] === "o") {
					word1 += " ";
					word2 += wrd[i];
				}
			}
			return [word1, word2];
		};
			
		if (word.length === 5) {
			pattern = five[U.randInt(0, five.length-1)];
			split_word = parse(word, pattern);
		} else if (word.length === 6) {
			pattern = six[U.randInt(0, six.length-1)];
			split_word = parse(word, pattern);
		}
		
		return split_word;
	},
	
	words : [
		"staple", "zebra",  "donkey", "shrimp", "turkey", "tiger",  "horse",  "roach",  "sailor", "monkey", "rabbit", "eagle",
		"beaver", "animal", "woman",  "skunk",  "waiter", "kitten", "shark",  "snake",  "birds",  "daisy",  "people", "bushes",
		"priest", "whale",  "lizard", "goose",  "snail",  "grass",  "child",  "actor",  "writer", "puppy",  "human",  "parrot",
		"squid",  "trees",  "doggy",  "doctor", "goats",  "sheep",  "mouse",  "rhino",  "lions",  "bears",  "farmer", "parent",
		"worms",  "ducks",  "wolves", "walrus", "insect", "beetle", "author", "judge",            "uncle",  "turtle", "frogs",
		"panda",  "moose",  "oyster", "poodle", "baker",  "lawyer", "jaguar",           "koala",  "llama",  "gopher", "clams",
		"barber", "nurse",  "gerbil", "falcon", "toads",  "cattle", "hyena",  "bobcat", "coach",  "pirate", "dancer", "hornet",
		"spider", "baboon", "badger", "coyote", "camel",  "bunny",  "police", "pillow", "table",  "towel",  "shoes",  "knife", 
		"music",  "phone",  "paper",  "couch",  "socks",  "plate",  "radio",  "clock",  "pencil", "teapot",           "napkin",
		"butter", "chair",  "candle", "hammer", "pants",  "water",  "cookie", "bottle", "truck",  "string", "spoon",
		"cream",  "staple", "school", "sphere", "jacket", "steam",  "fridge", "cycle",  "ticket", "burger", "future", "house",
		"doors",  "glove",  "bagel",  "chalk",  "cloud",  "wallet", "toilet", "silver", "pizza",  "honey",  "games",  "tomato",
	],
};
//----------------------------------------------------------------------------------



Game.set_custom_widgets = function(){
	$.widget( "ui.minute_spinner", $.ui.spinner, {
		_format: function(value) { return value + ' min'; },
		_parse: function(value) { return parseInt(value); }
	});			
};

Game.set_default_values = function(){
	S.set_defaults({
		TICKS : 60,
		GRAY : [127,127,127],
		BLUE : [0,0,255],
		WHITE : [255,255,255],
		ORB_FONT_SIZE : 8,
		ORB_FONT : "monaco, Lucida Console, monospace",
		ORB_WIDTH : 50,
		ORB_LINE_WIDTH : 2,
		ORB_IRIS_WIDTH : 20,
		ORB_IRIS_LINE_WIDTH : 3,
		ORB_PUPIL_WIDTH : 4,
		ORB_SPEED_STEP : 20,
		ORB_SCALE_STEP : 15,
		ORB_ROTATION_SPEED : 45, //degrees per second
		ORB_BOUNCE_VALUES : {NORMAL: [1,1], HORIZONTAL: [1,0.1], VERTICAL: [0.1,1]},
		HEX_CORRECT_COLOR : "darkgreen",
		HEX_INCORRECT_COLOR : "darkred",

		RED2 : [255,0,0],
		ORANGE : [255,127,0],
		GREEN : [0,127,0],

		GAME_LENGTH : 1, //minutes
		ORB_SEPARATION : 0,
		ORB_SCALE : 7,
		ORB_SPEED : 0, //pixels per second
		PALETTE : "purpteal",  // purpteal, redblue, redgreen
		PURPLE : [132,0,132],
		TEAL : [0,129,129],
		RED : [255,0,0],
		BLACK : [0,0,0],	
	});
	
	S.set_defaults({ORB_BOUNCE : S.ORB_BOUNCE_VALUES.NORMAL});
};

Game.start = function(){
	this.set_custom_widgets();
	this.set_default_values();
	Scene.start("load",S.TICKS);
};