f.Event = function(scene) {
	this.constructor.call(this, scene);
};

Ext.extend(f.Event, Ext.util.Observable, {
	
	constructor: function(scene) {
		this.scene = scene;
		this.action = function () { };
		this.setup = function() { };
		return this;
	},
	
	asset: function(id) {
		this.asset = this.scene.asset(id);
		//this.asset.el.hide();
		return this;
	},

	update: function(htmlfrag) {
		// only for html elements...
		this.addAction(function() {
			this.el.update(htmlfrag);
		});
	},
	
	zindex: function(index) {
		this.addSetup(function() {
			console.log("Setting z-index: " + index);
			this.asset.el.setStyle("position: absolute; z-index: " + index);
		});
		return this;
	},
	
	position: function(x, y) {
		this.addSetup(function() {
			console.log("Setting position (" + x + ", " + y + ")");
			this.asset.el.setLeftTop(x, y);
		});
		return this;
	},
	
	fadeIn: function() {
		this.addSetup(function() {
			this.asset.el.hide();
		});		
		this.action = this.action.createSequence(function() {
			console.log("FadeIn");
			this.el.show(true);
		}, this.asset);
		return this;
	},
	
	fadeOut: function() {
		this.addSetup(function() {
			this.asset.el.show();
		});
		this.action = this.action.createSequence(function() {
			console.log("FadeOut");
			this.el.hide(true);
		}, this.asset);
		return this;
	},
	
	slideTo: function(x, y) {
		this.addAnim(function() {
			this.el.shift({left: x, top: y});
		})
	},
	
	slideInFromTop: function(x, y) {
		this.addSetup(function() {
			var height = this.asset.el.getHeight();
			if(height == 0)
				height = 200;

			this.asset.el.setLeftTop(x, height * -1);
		});
		this.action = this.action.createSequence(function() {
			//this.el.setLeftTop(x, y, true);
			this.el.shift({ left: x, top: y});
		}, this.asset);
	},

	slideInFromBottom: function(to) {
		
	},
	
	slideInFromLeft: function(to) {
		
	},
	
	slideInFromRight: function(to) {
		
	},
	
	slideOutToTop: function(to) {
		
	},

	slideOutToBottom: function() {
		this.addSetup(function() {
			var x = this.asset.el.getLeft();
			var height = this.asset.el.getHeight();
			var stageHeight = this.scene.chapter.stage.height;
		});
		//this.asset.el.show();
		this.action = this.action.createSequence(function() {
			//this.el.setLeftTop(x, y, true);
			this.el.shift({ left: x, top: stageHeight + height});
		}, this.asset);
	},
	
	slideOutToLeft: function(to) {
		
	},
	
	slideOutToRight: function(to) {
		
	},
	
	play: function() {
		if(this.asset.type == "audio" || this.asset.type == "video") {
			this.addAction(function() {
				this.el.dom.load();
				this.el.dom.play();
			});
		}
	},
	
	addSetup: function(f) {
		this.setup = this.setup.createSequence(f, this);
	},
	
	addAction: function(f) {
		this.action = this.action.createSequence(f, this.asset);
	},
	
	start: function() {
		console.log("Starting event!");
		this.setup();
		this.action();
		return this;
	}
});