// This line is needed for debugging under --debug-brk as well
console.log("Beginning Rackspace Server Builder...");

var pkgcloud = require('pkgcloud'),
  _ = require('underscore');

// create our client with your rackspace credentials
var client = pkgcloud.providers.rackspace.compute.createClient({
  username: 'rrockers',
  apiKey: 'fc8463f10c0d52237819b9e9d05173e4'
});

// first we're going to get our flavors
client.getFlavors(function (err, flavors) {
  if (err) {
    console.dir(err);
    return;
  }

  // then get our base images
  client.getImages(function (err, images) {
    if (err) {
      console.dir(err);
      return;
    }

    // Pick a 512MB instance flavor
    var flavor = _.findWhere(flavors, { name: '512MB Standard Instance' });

    // Pick an image based on Ubuntu 12.04
    var image = _.findWhere(images, { name: 'itt-nt1430-testserver' });
		
		for(var i = 1; i <= 9; i++) {
			// Create our first server
			client.createServer({
				name: 'ITT Test Server ' + i,
				image: image,
				flavor: flavor
			}, handleServerResponse);
		};
	});
});

// This function will handle our server creation,
// as well as waiting for the server to come online after we've
// created it.
function handleServerResponse(err, server) {
  if (err) {
    console.dir(err);
    return;
  }

  console.log('SERVER CREATED: ' + server.name + ', waiting for active status');

  // Wait for status: ACTIVE on our server, and then callback
  server.setWait({ status: server.STATUS.running }, 5000, function (err) {
    if (err) {
      console.dir(err);
      return;
    }

    console.log('---');
    console.log(server.name);
		var v4addr = _.findWhere(server.addresses.public, {version: 4});
		console.log(v4addr.addr);
    console.log(server.adminPass);
  });
}
