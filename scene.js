f.Scene = function(chapter, title, config) {
	this.constructor.call(this, chapter, title, config);	
};

Ext.extend(f.Scene, Ext.util.Observable, {
	chapter: null,
	title: null,
	voiceoverTrack: null,
	started: false,
	
	constructor: function(chapter, title, config) {
		this.chapter = chapter;
		this.title = title;
		this.timecodes = new Ext.util.MixedCollection();
		return this;
	},
	
	duration: function(time) {
		console.log("duration called.");
		this.length = time;
		return this;
	},
	
	voiceover: function(assetId) {
		console.log("Voiceover assetId: " + assetId);
		this.voiceoverTrack = this.asset(assetId);
		console.log("Have voice over with id: " + assetId + " and src: " + this.voiceoverTrack.src);
		return this;
	},
	
	asset: function(id) {
		return this.chapter.assets.get(id);
	},
	
	at: function(timecode) {
		var list = this.timecodes.get(timecode);
		if(!list) {
			list = new Array();
		}
		var event = new f.Event(this);
		list.push(event);
		this.timecodes.add(timecode, list);
		console.log("Created new event for timecode: " + timecode);
		return event;
	},
	
	start: function() {
		console.log("starting scene: " + this.title);
		
		if(this.voiceoverTrack) {
			// start audio and register events
			console.log("Starting voice over.");
			
			this.voiceoverTrack.el.on("timeupdate", this.htmlEventFired.createDelegate(this));
			this.voiceoverTrack.el.on("ended", this.sceneComplete.createDelegate(this));
			
			if(this.chapter.stage.isTablet) {
				// we have to prompt the user to continue due to audio issues.
				
				this.voiceoverTrack.el.dom.play();
				
			} else {
				console.log(this.voiceoverTrack)
				this.voiceoverTrack.el.dom.play();
			}		
			
			
		} else {
			console.log("Starting timer based.");
			// start timer
			var task = {
			    run: this.timerFired,
			    interval: 1000,
				scope:this
			}
			this.seconds = 0;
			/*
			this.runner = new Ext.util.TaskRunner();
			this.runner.start(task);
			*/
			Ext.TaskMgr.start(task);
//			this.timerFired();
		}
	},
	
	pause: function() {
		this.stop(); // pause == stop.  Have pause to match unpause.
	},
	
	unpause: function() {
		if(this.voiceoverTrack) {
			// start audio and register events
			console.log("Restarting voice over.");
			this.voiceoverTrack.el.dom.play();
			
		} else {
			console.log("Restarting timer based.");
			// start timer
			var task = {
			    run: this.timerFired,
			    interval: 1000,
				scope:this
			}
			
			Ext.TaskMgr.start(task);
			
		}
	},
	
	stop: function() {
		/*
		if(this.runner)
			this.runner.stopAll();
			*/
			
		Ext.TaskMgr.stopAll();
	},
	
	htmlEventFired: function(event, el) {
		console.log("htmlEventFired: " + el.currentTime);
		this.timeEvent(el.currentTime);
	},
	
	timerFired: function() {
		if(this.seconds > this.length) {
			// next scene...
			this.sceneComplete();
			return;
		}
		this.timeEvent(this.seconds);
		this.seconds++;
	},
	
	convertToTimeCode: function(seconds) {
		var minutes = seconds / 60;
		seconds = seconds % 60;
		return sprintf("%d:%02d", minutes, seconds);
	},
	
	timeEvent: function(time) {
		// coalesce similar events...
		if(this.started || this.currentTime) {  // started is a flag because when current time is zero, it evaluates to false and we call 0:00 multiple times.
			if(Math.floor(time) == this.currentTime)
				return;
		}
		this.started = true;
		this.currentTime = Math.floor(time);
		
		try {
			var timecode = this.convertToTimeCode(time);
			console.log("Timecode: " + timecode);
			
			var list = this.timecodes.get(timecode);
			if(list) {
				Ext.each(list, function(item) {
					item.start();
				})
			}

		} catch(exception) {
			console.log("Caught exception: ");
			console.log(exception);
		}
	},
	
	sceneComplete: function() {
		console.log("Scene[" + this.title + "] complete");
		this.chapter.sceneComplete();
	}
});
