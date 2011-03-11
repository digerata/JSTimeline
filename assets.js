// Assets

f.Asset = function(config) {
	this.constructor.call(this, config);
};

Ext.extend(f.Asset, Ext.util.Observable, {
	el: null,
	src: null,
	type: "default",
	name: null,
	markup: { tag: 'div', html: 'unsupported asset type' },
	
	constructor: function(config) {
		Ext.apply(this, config);
		/*
		console.log("config:");
		console.log(config);
		console.log("asset:");
		console.log(this);
		*/
		/*
		if(config) {
			
		 	if(config.src)
				this.src = config.src;
				
			if(this.config.name)
				this.name = config.name
		}
		**/
	},
	
	insert: function(parentEl) {
		this.el = Ext.DomHelper.append(parentEl, this.markup, true);
		//this.el.hide();
	},
	
	remove: function() {
		console.log("removing asset: " + this.type + " - " + this.name);
		this.el.remove();
	},
	
	getName: function() {
		return this.name
	}
});


// Asset types

f.ImageAsset = function(config) {
	this.constructor.call(this, config);
};

Ext.extend(f.ImageAsset, f.Asset, {
	type: "image",
	markup: { tag: 'img', src: this.src, border: 0 },
	constructor: function(config) {
		f.ImageAsset.superclass.constructor.call(this, config);
	},
	insert: function(parentEl) {
		if(this.placeholder) {
			if(!this.width)
				this.width = 100;
			if(!this.height) 
				this.height = 100;
			this.el = Ext.DomHelper.append(parentEld, {tag: 'div', cls: 'placeholder', style: "position: absolute; top: 768px; z-index: 10; width: " + this.width + "px; height: " + this.height + "px;"
				html: this.placeholder }, true);
		} else {
			this.el = Ext.DomHelper.append(parentEl, {tag:'img', src: this.src, border: 0, style: "position: absolute; top: 768px; z-index: 10;" }, true);
		}
	}
});

registerAssetType("image", f.ImageAsset);

f.VideoAsset = function(config) {
	this.constructor.call(this, config);
};

Ext.extend(f.VideoAsset, f.Asset, {
	type: "video",
	constructor: function(config) {
		f.VideoAsset.superclass.constructor.call(this, config);
	},

	insert: function(parentEl) {
		
		this.el = Ext.DomHelper.append(parentEl, { tag: "video", preload: "auto", autobuffer: "1", 
			style: "position: absolute; top: 768px; z-index: 10; width: " + this.width + "px; height: " + this.height + "px", 
			width: this.width, height: this.height, children: [
				{ tag: "source", src: this.src }
		]}, true);
		
		/*
		
		this.el = Ext.DomHelper.append(parentEl, 
			{ tag: "div", cls: "video-js-box", style: "position: absolute; top: 768px; z-index: 10; width: " + this.width + "px; height: " + this.height + "px",
			children: [
				{ tag: "video", cls: "video-js", preload: "auto", autobuffer: "1", width: this.width, height: this.height, children: [
					{ tag: "source", src: this.src, type: "video/mp4;" }
				]}
			]}, true);
			
		this.player = VideoJS.setup(this.el.id);
		console.log(this.player);
		this.player.play();
		*/
	},
	
	play: function(callback) {
		//this.player.play();

		if(callback) {
			this.loadCallback = callback;
		}
		
		this.el.on('progress', function(event, video) {
			var loaded = parseInt(((video.buffered.end(0) / video.duration) * 100), 10);
			console.log("loaded: " + loaded + "% of " + this.name);
			// because onload isn't called on mobile safari, we have to check here...
			if(loaded < 100) {
				this.stage.updatePrompt("Loading... " + loaded + "%");
			}
			if(loaded == 100) {
				this.stage.dismissPrompt();
			}
		}, this);
		
		this.el.on('canplaythrough', function(event, video) {
			console.log("Can play through received.");
			console.log(event);
			if(this.loadCallback)
				this.loadCallback();
			video.play();
		}, this);
		
		this.el.on("load", function() {
			console.log(this.name + " -> load");
		}, this);
		
		this.el.on("loadstart", function() {
			console.log(this.name + " -> loadstart");
		}, this);
		
		this.el.on("stalled", function() {
			this.stage.updatePrompt("Network Stalled");
			console.log(this.name + " -> stalled");
		}, this);
		
		this.el.on("loadedmetadata", function() {
			console.log(this.name + " -> loadedmetadata");
		}, this);
		
		this.el.on("loadeddata", function() {
			console.log(this.name + " -> loadeddata");
		}, this);
		
		this.el.dom.load();
		
		this.stage.prompt("Loading...");
	}
});

registerAssetType("video", f.VideoAsset);

f.AudioAsset = function(config) {
	this.constructor.call(this, config);
};

Ext.extend(f.AudioAsset, f.Asset, {
	type: "audio",
	/*
	<audio controls preload="auto" autobuffer> 
	  <source src="elvis.mp3" />
	  <source src="elvis.ogg" />
	  <!-- now include flash fall back -->
	</audio>
	*/
	constructor: function(config) {
		f.AudioAsset.superclass.constructor.call(this, config);
	},
	
	insert: function(parentEl) {
		this.el = Ext.DomHelper.append(parentEl, { tag: "audio", preload: "auto", autobuffer: "1", style: "position: absolute; top: 768px; z-index: 10;", children: [
			{ tag: "source", src: this.src }
		]}, true);
		
		this.el = Ext.get(this.el);
	},
	
	play: function(callback) {
		if(callback) {
			this.loadCallback = callback;
		}
		
		this.el.on('progress', function(event, audio) {
			var loaded = parseInt(((audio.buffered.end(0) / audio.duration) * 100), 10);
			console.log("loaded: " + loaded + "% of " + this.name);
			if(loaded < 100) {
				this.stage.updatePrompt("Loading... " + loaded + "%");
			}
			// because onload isn't called on mobile safari, we have to check here...
			if(loaded == 100) {
				this.stage.dismissPrompt();
				if(this.loadCallback)
					this.loadCallback();
					
				audio.play();
			}
		}, this);
		
		console.log("loading audio...");
		this.el.dom.load();
		
		this.stage.prompt("Loading...");
	}
});

registerAssetType("audio", f.AudioAsset);

f.HtmlAsset = function(config) {
	this.constructor.call(this, config);
};

Ext.extend(f.HtmlAsset, f.Asset, {
	type: "html",
	constructor: function(config) {
		f.HtmlAsset.superclass.constructor.call(this, config);
	},
	
	insert: function(parentEl) {
		this.el = Ext.DomHelper.append(parentEl, this.markup, true);
		this.el.setStyle("position: absolute; z-index: 10");
	}	
});

registerAssetType("html", f.HtmlAsset);