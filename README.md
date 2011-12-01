# Cluster-Danzig
## a cluster plugin for killing children.

***

By default, a Cluster master process will close it's workers if told to exit.

However, if sent a SIGKILL, it seems that the master process will shut down, but the children will continue to live.

This is an issue, because ops guys *hate* killing zombies, but when things go wrong, you'll be in a confusing mess unless your sysadmin is [Rick Grimes]("http://en.wikipedia.org/wiki/Rick_Grimes" "Rick Grimes").

To make things worse, if you daemonize a process that forks a cluster, you can get yourself in a really big mess when you try to send a sigkill to what you think is the master process, and you leave a bunch of servers running.

So to solve this issue, I created cluster-danzig. It's named after the super brutal lead singer of the misfits because, well, he just loves [killing children]("http://en.wikipedia.org/wiki/Last_Caress" "killing children").

# What it does

***

Cluster-danzig just adds events to the cluster server's parent process, listening for events that would normally cause the workers to become zombies.

If it hears one of these events (for instance, [uncaughtException]("http://nodejs.org/docs/v0.4.12/api/process.html#event_uncaughtException_" "uncaughtException")), it will send the a SIGKILL (or the same signal that killed the parent process, SIGTERM, for instance) to all the workers, basically making sure that the server is doing what you expect.

# Usage

***

Using cluster-danzig is simple. Just add it as a plugin when you create your server, passing in the process that runs the server. Something like this:

	cluster(server)
  	  .use(danzig(process))
  	  .listen(3000);

simple!