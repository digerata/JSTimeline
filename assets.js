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
		this.el = Ext.DomHelper.append(parentEl, {tag:'img', src: this.src, border: 0, style: "position: absolute; top: 768px; z-index: 10;" }, true);
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
	},
	
	play: function(callback) {
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
				if(this.loadCallback)
					this.loadCallback();
					
				video.play();
			}
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