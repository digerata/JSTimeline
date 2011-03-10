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
		console.log("this.markup");
		console.log(this.markup);
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
		console.log("this.markup");
		console.log(this.markup);
		this.el = Ext.DomHelper.append(parentEl, {tag:'img', src: this.src, border: 0, style: "position: absolute; top: -1000px; z-index: 10;" }, true);
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
		this.el = Ext.DomHelper.append(parentEl, { tag: "audio", preload: "auto", autobuffer: "1", children: [
			{ tag: "source", src: this.src }
		]}, true);
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