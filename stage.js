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
				
			if(config.elid) {
				this.elid = config.elid;
			}
		}
		
		if(this.elid) {
			this.el = Ext.DomHelper.insertFirst(Ext.get(this.elid), {
				style: "width: " + this.width + "px; height: " + this.height + "px; overflow: hidden; position: relative;"
			}, true);
		} else {
			this.el = Ext.DomHelper.insertFirst(Ext.getBody(), {
				style: "width: " + this.width + "px; height: " + this.height + "px; overflow: hidden; position: relative;"
			}, true);
		}
		
		
		this.startEl = Ext.DomHelper.insertFirst(this.el, {
			id: "start-prompt"
		}, true);
		
		//this.startEl.setLeftTop(360, (this.height / 2) - this.startEl.getHeight());
		this.startEl.center();
		
		this.startEl.on("click", function() {
			this.start();
		}, this);
		
		this.promptEl = Ext.DomHelper.insertFirst(this.el, {
			id: "stage-prompt",
			style: "position: absolute; z-index: 100; font-size: 24px; font-weight: bold; margin: auto;"
		}, true);
		
		this.promptEl.hide();
		
		
	},
	
	prompt: function(message, onclick) {
		this.promptEl.update(message);
		this.promptEl.on("click", function() {
			this.dismissPrompt();
			onclick();
		}, this);
		
		Ext.get("next-button").on('click', function() {
			this.dismissPrompt();
			onclick();
			Ext.get("next-button").removeAllListeners();
		}, this);
		
		var x = parseInt((this.width / 2) - (this.promptEl.getWidth() / 2));
		//var y = this.height - (this.promptEl.getHeight() + 15);
		//var y = this.height - 15;
		var y = this.height + 30;
		
		this.promptEl.setLeftTop(x, this.height);
		this.promptEl.show();
		this.promptEl.shift({ x: x, y: y});
		
	},
	
	updatePrompt: function(message) {
		this.promptEl.update(message);
	},
	
	dismissPrompt: function() {
		console.log("Height: " + this.height);
		this.promptEl.shift({ top: this.height });
		this.promptEl.removeAllListeners();
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
		this.promptEl.hide();
		this.promptEl.removeAllListeners();
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
		this.startEl.hide();
		this.startEl.removeAllListeners();
		
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
