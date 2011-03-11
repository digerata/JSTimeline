f.Chapter = function(stage, title, config) {
	this.constructor.call(this, stage, title, config);	
};

Ext.extend(f.Chapter, Ext.util.Observable, {
	stage: null,
	sceneIndex: 0,
	waiting: false,
	loaded: 0,
	
	constructor: function(stage, title, config) {
		this.stage = stage;
		this.title = title;
		this.scenes = new Ext.util.MixedCollection();
		this.assets = new Ext.util.MixedCollection();
	},
	
	asset: function(config) {
		if(!config.type)
			console.log("Can't create asset without specifying type.");
		/*
		{ src, type }
		*/
		//console.log("adding asset name: " + config.name + " type: " + config.type + " and src: " + config.src);
		var asset = assetForType(config.type, config);
		
		// this is messy, need a better way to prompt progress...
		asset.stage = this.stage;
		
		//console.log(asset);
		/*
		if(config.src)
			asset.src = config.src;
		if(config.markup)
			asset.markup = config.markup;
		*/	
		var id;
		if(asset.getName()) {
			id = asset.getName();
		} else {
			id = this.assets.getCount();
		}
		this.assets.add(id, asset);
	},
	
	preload: function() {
		var images = [];
		this.assets.each(function(asset, index) {
			// need to track when assets are loaded...
			
			if(asset.type == "image") {
				console.log("Preloading image: " + asset.src);
				images[index] = new Image();
				images[index].src = asset.src;
				images[index].onload = this.assetLoaded.createDelegate(this, [ asset, images[index] ]);
			} else {
				console.log("skipping preload on: " + asset.src);
				this.loaded++;
			}
			
			asset.insert(this.stage.el);
			asset.el.setStyle("position", "absolute");
			asset.el.setStyle("z-index", "1");
			asset.el.setTop(this.stage.height);
			if(asset.type == "html") {
				asset.width = asset.el.getWidth();
				asset.height = asset.el.getHeight();
			}
			//asset.el.setLeftTop(0, -200);
		}, this);
		
		this.checkLoaded();
	},
	
	checkLoaded: function() {
		if(this.loaded != this.assets.getCount()) {
			console.log("Still loading assets, waiting...");
			this.checkLoaded.defer(100, this);
			return;
		}
		console.log("Finished preload, continuing.");
		this.currentScene = this.scenes.itemAt(this.sceneIndex);
		this.currentScene.start();
	},
	
	assetLoaded: function(asset, dom) {
		this.loaded++;
		asset.width = dom.width;
		asset.height = dom.height;
		console.log("Loaded asset: " + asset.name + " is " + dom.width + " x " + dom.height);
		
	},
	
	wait: function() {
		this.waiting = true;
	},
	
	sceneComplete: function() {
		if(!this.waiting) {
			this.nextScene();
		}
	},
	
	nextScene: function() {
		this.sceneIndex++;
		if(this.sceneIndex >= this.scenes.getCount()) {
			this.stop();
			this.stage.nextChapter();
			return;
		}
		this.currentScene.stop();
		this.currentScene = this.scenes.itemAt(this.sceneIndex);
		this.currentScene.start();
	},
	
	scene: function(title) {
		var scene = new f.Scene(this, title);
		this.scenes.add(this.scenes.getCount(), scene);
		console.log("returning new scene: " + title);
		console.log(scene);
		return scene;
	},
	
	start: function() {
		console.log("Chapter[" + this.title + "] starting");
		this.preload();
	},
	
	stop: function() {
		if(this.currentScene) {
			this.currentScene.stop();
		}
	},
	
	exit: function() {
		console.log("Chapter[" + this.title + "] complete");
		this.stop();
		this.assets.each(function(asset, index) {
			asset.remove();
		});
		this.assets.clear();
	}
	
	
});
