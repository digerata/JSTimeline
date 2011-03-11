f.Event = function(scene) {
	this.constructor.call(this, scene);
};

Ext.extend(f.Event, Ext.util.Observable, {
	hasPrompt: false,
	
	constructor: function(scene) {
		this.scene = scene;
		this.action = function () { };
		this.setup = function() { };
		this.prompt = function() { };
		return this;
	},
	
	stage: function() {
		return this.scene.chapter.stage;
	},
	
	asset: function(id) {
		this.asset = this.scene.asset(id);
		if(!this.asset) {
			alert("Chapter[" + this.scene.chapter.title + "] -> \nScene[" + this.scene.title + "] -> Asset: '" + id + "' is not found in asset list for this chapter.");
		}
		//this.asset.el.hide();
		return this;
	},

	update: function(htmlfrag) {
		// only for html elements...
		this.addAction(function() {
			this.asset.el.update(htmlfrag);
		});
	},
	
	endScene: function() {
		this.addSetup(function() {
			this.scene.sceneComplete();
		});		
	},
	
	zindex: function(index) {
		this.addSetup(function() {
			console.log("On " + this.asset.name + " - Setting z-index: " + index);
			this.asset.el.setStyle("position: absolute; z-index: " + index);
		});
		return this;
	},
	
	handleRelative: function(x, y) {
		if((x != parseInt(x))) {
			// console.log("Relative position: " + x);
			// relative?
			var swidth = this.stage().width;
			var sheight = this.stage().height;
			var awidth  = this.asset.width;
			var aheight = this.asset.height;
			// console.log("Stage: " + swidth + " x " + sheight);
			// console.log("Asset: " + awidth + " x " + aheight);
			if(x == "CENTER") {
				x = parseInt((swidth / 2) - (awidth / 2));
				y = parseInt((sheight / 2) - (aheight / 2));
				
			} else if(x == "TOPLEFT") {
				x = 0;
				y = 15;
				
			} else if(x == "TOPRIGHT") {
				x = swidth - awidth - 15;
				y = 15;
				
			} else if(x == "BOTTOMLEFT") {
				x = 15;
				y = sheight - aheight - 15;
				
			} else if(x == "BOTTOMRIGHT") {
				x = swidth - awidth - 15;
				y = sheight - aheight - 15;
				
			} else if(x == "LEFTCENTER") {
				x = parseInt((swidth / 4) - (awidth / 2));
				y = parseInt((sheight / 2) - (aheight / 2));
			
			} else if(x == "RIGHTCENTER") {
				x = parseInt(((swidth / 4) * 3) - (awidth / 2));
				y = parseInt((sheight / 2) - (aheight / 2));
			}
			
		} else {
			// console.log("position(" + x + ", " + y + ")");
		}
		return { x: x, y: y};
	},
	
	show: function(x, y) {
		this.addSetup(function() {
			var pos = this.handleRelative(x, y);
			console.log("On " + this.asset.name + " - show (" + pos.x + ", " + pos.y + ")");
			this.asset.el.setLeftTop(pos.x, pos.y);
		});
		return this;
	},
	
	position: function(x, y) {
		this.addSetup(function() {
			var pos = this.handleRelative(x, y);			
			console.log("On " + this.asset.name + " - Setting position (" + pos.x + ", " + pos.y + ")");
			this.asset.el.setLeftTop(pos.x, pos.y);
		});
		return this;
	},
	
	fadeIn: function() {
		this.addSetup(function() {
			this.asset.el.hide();
		});		
		this.addAction(function() {
			console.log("On " + this.asset.name + " - FadeIn");
			this.asset.el.show(true);
		})
		return this;
	},
	
	fadeOut: function() {
		this.addSetup(function() {
			this.asset.el.show();
		});
		this.addAction(function () {
			console.log("On " + this.asset.name + " - FadeOut");
			this.asset.el.hide(true);
		});
		return this;
	},
	
	slideTo: function(x, y) {
		this.addAction(function() {
			var pos = this.handleRelative(x, y);
			console.log("On " + this.asset.name + " - slideTo ");
			this.asset.el.shift({left: pos.x, top: pos.y, easing: 'easeBothStrong' });
		})
	},
	
	slideInFromTop: function(x, y) {
		this.addSetup(function() {
			var pos = this.handleRelative(x, y);			
			
			var height = this.asset.el.getHeight();
			if(height == 0)
				height = this.asset.height;
			if(height == 0)			
				height = 200;

			this.asset.el.setLeftTop(pos.x, height * -1);
		});
		this.addAction(function () {
			var pos = this.handleRelative(x, y);			
			console.log("On " + this.asset.name + " - slideInFromTop ");
			this.asset.el.shift({ left: pos.x, top: pos.y, easing: 'easeBothStrong' });
		});
	},

	slideInFromBottom: function(x, y) {
		
	},
	
	slideInFromLeft: function(x, y) {
		this.addSetup(function() {
			var pos = this.handleRelative(x, y);
			var width = this.asset.width;
			this.asset.el.setLeftTop(width * -1, pos.y);
		});
		this.addAction(function() {
			console.log("On " + this.asset.name + " - slideInFromRight ");
			var pos = this.handleRelative(x, y);			
			//if(this.stage().isTablet) {
			if(false) {
				
				//this.asset.el.setStyle("-webkit-transform", "translate(" + (-1 * (width - x)) + "px, 0px)");
				this.asset.el.setStyle("-webkit-transition", "all 1.0s ease-in-out");
				this.asset.el.setStyle("-webkit-transform", "translate(-600px, 0px)");				
				/*
				this.asset.el.setStyle("-moz-transition", "all 1.0s ease-in-out");
				this.asset.el.setStyle("-o-transition", "all 1.0s ease-in-out");
				this.asset.el.setStyle("transition", "all 1.0s ease-in-out");
				*/

			} else {
				this.asset.el.shift({ left: pos.x, easing: 'easeBothStrong' });
			}
			//
			
		});
	},
	
	slideInFromRight: function(x, y) {
		
		this.addSetup(function() {
			var pos = this.handleRelative(x, y);			
			var width = this.stage().width;
			this.asset.el.setLeftTop(width, pos.y);
		});
		this.addAction(function() {
			console.log("On " + this.asset.name + " - slideInFromRight ");
			var pos = this.handleRelative(x, y);
			//if(this.stage().isTablet) {
			if(false) {
				
				//this.asset.el.setStyle("-webkit-transform", "translate(" + (-1 * (width - x)) + "px, 0px)");
				this.asset.el.setStyle("-webkit-transition", "all 1.0s ease-in-out");
				this.asset.el.setStyle("-webkit-transform", "translate(-600px, 0px)");				
				/*
				this.asset.el.setStyle("-moz-transition", "all 1.0s ease-in-out");
				this.asset.el.setStyle("-o-transition", "all 1.0s ease-in-out");
				this.asset.el.setStyle("transition", "all 1.0s ease-in-out");
				*/

			} else {
				this.asset.el.shift({ left: pos.x, easing: 'easeBothStrong' });
			}
			//
			
		});
	},
	
	slideOutToTop: function() {
		
	},

	slideOutToBottom: function() {
		this.addSetup(function() {
			var height = this.asset.el.getHeight();
			var stageHeight = this.scene.chapter.stage.height;
		});
		//this.asset.el.show();
		this.addAction(function() {
			console.log("On " + this.asset.name + " - slideOutToBottom ");
			this.asset.el.shift({ top: stageHeight + height, easing: 'easeBothStrong' });
		});
	},
	
	slideOutToLeft: function() {
		this.addAction(function() {
			var width = this.stage().width;
			var left = this.asset.el.getLeft();
			console.log("On " + this.asset.name + " - slideOutToLeft: " + (width - left));
			//if(this.stage().isTablet) {
			if(false) {
				
				//this.asset.el.setStyle("-webkit-transform", "translate(" + (-1 * (width - x)) + "px, 0px)");
				this.asset.el.setStyle("-webkit-transition", "all 1.0s ease-in-out");
				this.asset.el.setStyle("-webkit-transform", "translate(-600px, 0px)");				
				/*
				this.asset.el.setStyle("-moz-transition", "all 1.0s ease-in-out");
				this.asset.el.setStyle("-o-transition", "all 1.0s ease-in-out");
				this.asset.el.setStyle("transition", "all 1.0s ease-in-out");
				*/

			} else {
				this.asset.el.shift({ left: (left + width) * -1, easing: 'easeBothStrong' });
			}
			//
			
		});
	},
	
	slideOutToRight: function() {
		this.addAction(function() {
			var width = this.stage().width;
			
			console.log("On " + this.asset.name + " - slideOutToRight ");
			//if(this.stage().isTablet) {
			if(false) {
				
				//this.asset.el.setStyle("-webkit-transform", "translate(" + (-1 * (width - x)) + "px, 0px)");
				this.asset.el.setStyle("-webkit-transition", "all 1.0s ease-in-out");
				this.asset.el.setStyle("-webkit-transform", "translate(-600px, 0px)");				
				/*
				this.asset.el.setStyle("-moz-transition", "all 1.0s ease-in-out");
				this.asset.el.setStyle("-o-transition", "all 1.0s ease-in-out");
				this.asset.el.setStyle("transition", "all 1.0s ease-in-out");
				*/

			} else {
				this.asset.el.shift({ left: width, easing: 'easeBothStrong' });
			}
		});
	},
	
	play: function() {
		if(this.asset.type == "audio" || this.asset.type == "video") {
			this.addPrompt(function() {
				console.log("Prompting for play...");
				this.scene.stop();
				
				this.stage().prompt("Touch next to continue...", function() {
				
				this.asset.play(function() {
					console.log("On " + this.asset.name + " - playing " + this.asset.type);
					this.scene.unpause();
				}.createDelegate(this));
				
				}.createDelegate(this));
				
			});
		}
	},
	
	addPrompt: function(f) {
		this.hasPrompt = true;
		this.prompt = this.prompt.createSequence(f, this);
	},
	
	addSetup: function(f) {
		this.setup = this.setup.createSequence(f, this);
	},
	
	addAction: function(f) {
		this.action = this.action.createSequence(f, this);
	},
	
	
	start: function() {
		if(!this.asset) {
			console.log("Skipping event, missing asset.");
			return;
		}
		if(this.hasPrompt)
			this.prompt();
		this.setup();
		this.action();
		return this;
	}
});