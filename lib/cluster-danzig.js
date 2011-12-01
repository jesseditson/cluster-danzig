/* cluster-danzig
* will monitor the process, and kill the cluster workers if it fails/dies.
* 
* @returns {Function} the configured plugin for the `cluster.use` method.
* @api public
*/ 

var danzig = function() {
	/* this shuts down the server */
	var danzig = function(instance,err){
		var children = instance.workerpids();
		for(var child=0;child<children.length;child++){
			process.kill(children[child],'SIGKILL');
		}
		process.exit(err==0?0:1);
	}
	
	/* This is what we return to cluster */
	var plugin = function (instance) {
		var danzig_curry = function(err){
			danzig(instance,err);
		};
		process.on('SIGTERM',danzig_curry);
		process.on('SIGINT',danzig_curry);
		process.on('SIGQUIT',danzig_curry);
		process.on('SIGKILL',danzig_curry);
		process.on('SIGHUP',danzig_curry);
		process.on('uncaughtException',danzig_curry);
	}
	return plugin;
}

exports = module.exports = danzig