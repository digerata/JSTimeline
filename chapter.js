f.Chapter = function(stage, title, config) {
	this.constructor.call(this, stage, title, config);	
};

Ext.extend(f.Chapter, Ext.util.Observable, {
	stage: null,
	sceneIndex: 0,
	
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
		this.assets.each(function(asset) {
			// need to track when assets are loaded...
			asset.insert(this.stage.el);
			asset.el.setStyle("position: absolute");
			asset.el.setLeftTop(0, -200);
		}, this);
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
		console.log("Starting chapter: " + this.title);
		this.preload();
		this.currentScene = this.scenes.itemAt(this.sceneIndex);
		this.currentScene.start();
	},
	
	stop: function() {
		if(this.currentScene) {
			this.currentScene.stop();
		}
	},
	
	exit: function() {
		this.stop();
		this.assets.each(function(asset, index) {
			asset.remove();
		});
		this.assets.clear();
	}
	
	
});
