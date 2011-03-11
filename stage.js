Ext.namespace("f");

f.Stage = function(config) {
	this.constructor.call(this, config);	
};

Ext.extend(f.Stage, Ext.util.Observable, {
	width: 1000,
	height: 600,
	chapterIndex: 0,
	isTablet: false,
	
	constructor: function(config) {
		this.isTablet = (navigator.userAgent.indexOf("iPad") > -1) ||
					(navigator.userAgent.indexOf("Android") > -1);
		
		console.log("User Agent: " + navigator.userAgent + ", which is a tablet: " + this.isTablet);
		this.chapters = new Ext.util.MixedCollection();
		
		if(config) {
			if(config.width)
				this.width = config.width;
				
			if(config.height)
				this.height = config.height;
				
			if(this.height > 768)
				this.height = 768;
				
			if(config.chapterIndex)
				this.chapterIndex = config.chapterIndex;
		}
		
		this.el = Ext.DomHelper.insertFirst(Ext.getBody(), {
			style: "width: " + this.width + "px; height: " + this.height + "px; overflow: hidden; position: relative;"
		}, true);
		
		this.promptEl = Ext.DomHelper.insertFirst(this.el, {
			id: "stage-prompt",
			style: "width: " + parseInt(this.width / 3) + "px; height: 50px; position: absolute; z-index: 100; font-size: 24px; font-weight: bold; margin: auto;", html: "Touch to Start"
		}, true);
		
		this.promptEl.setLeftTop(360, (this.height / 2) - this.promptEl.getHeight());
		
		this.promptEl.on("click", function() {
			this.promptEl.hide();
			this.start();
			this.promptEl.removeAllListeners();
		}, this);
	},
	
	prompt: function(message, onclick) {
		this.promptEl.update(message);
		this.promptEl.on("click", function() {
			this.promptEl.hide();
			onclick();
			this.promptEl.removeAllListeners();
		}, this);
		
		this.promptEl.show(true);
	},
	
	updatePrompt: function(message) {
		this.promptEl.update(message);
	},
	
	dismissPrompt: function() {
		this.promptEl.hide(true);
	},
	
	defaults: function(config) {
		console.log("defaults()");
	},
	
	chapter: function(title) {
		console.log("creating new chapter: " + title);
		var chapter = new f.Chapter(this, title);
		this.chapters.add(this.chapters.getCount(), chapter);
		return chapter;
	},
	
	nextChapter: function() {
		this.currentChapter.stop();
		this.currentChapter.exit();
		this.chapterIndex++;
		if(this.chapterIndex >= this.chapters.getCount()) {
			// we are done, now what?
			alert("The show is over.");
			return;
		}
		this.currentChapter = this.chapters.itemAt(this.chapterIndex);
		this.currentChapter.start();
	},
	
	start: function(chapterIndex) {
		if(chapterIndex)
			this.chapterIndex = chapterIndex - 1;
			
		this.currentChapter = this.chapters.itemAt(this.chapterIndex);
		this.currentChapter.start();
	}
});

// Let's get these to be static and hang off Stage.

function registerAssetType(type, klass) {
//	console.log("Registering asset type: " + type + " for class: " + klass);
	_asset_types.add(type, klass);
}
	
function assetForType(type, config) {
	/*
	console.log("Looking up type: " + type);
	_asset_types.eachKey(function(key, item) {
		console.log("Have type: " + key + " and class: "+ item);
	});
	*/
	var klass = _asset_types.key(type);
	// console.log("Found class: " + klass);
	if(klass)
		return new klass(config);
	return new f.Asset(config);
}

_asset_types = new Ext.util.MixedCollection();
