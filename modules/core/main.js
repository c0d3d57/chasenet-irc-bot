module.exports = {

    init: function(ircBot) {
        var modules = require('../../config/modules.json');
        var config = require('../../config/config.json');
        // First connection loop to the server
        ircBot.addListener('registered', function(message) {

            console.log(message);
        });

        ircBot.addListener('message', function(nick, to, text, message) {

            if( config.default_ignore_nicks.indexOf( nick.toLowerCase()) == -1) {

                if(text.substr(0, 1) == config.commandChar) {

                    var command = text.split(' ');

                    switch(command[0].substr(1)) {

                        case 'reload': {

                            // Disabled until further notice.
                            if(0) {

                                if(modules.length > 0) {

                                    modules.forEach(function(item) {

                                        var cacheItem = require.resolve(item.location + "main.js");

                                        if(item.id == cacheItem) {

                                            delete require.cache[cacheItem];
                                        }
                                    });

                                    initModules();

                                    console.log("Reinitializing modules");
                                }
                            }

                            break;
                        }
                        case 'help': {
                            modules.forEach(function(item, index) {

                                for (var key in item.commands) {
                                    if (item.commands.hasOwnProperty(key)) {
                                        ircBot.say(nick , config.commandChar + key + " " + item.commands[key]);
                                    }
                                }

                            });
                        }
                    }

                    if(command.length >= 2){

                        // Ensure the channel name starts with a #
                        if(command[1].substr(0,1) == '#') {

                            switch(command[0].substr(1)) {

                                case 'join': {

                                    ircBot.join(command[1]);

                                    break;
                                }

                                case 'part' : {

                                    if(config.botOwners.indexOf( nick ) > -1) {

                                        if(config.channels.indexOf(command[1]) > -1){

                                            ircBot.part(command[1]);
                                        }

                                    } else if(config.channels.indexOf(command[1]) == -1) {

                                        ircBot.part(command[1]);
                                    }

                                    break;
                                }
                            }
                        }
                    }
                }
            }

        });

        // Log out the motd
        ircBot.addListener('motd', function(message) {
            console.log(message);
        });

        // Catch the errors
        ircBot.addListener('error', function(err) {
            // err is an object?
            console.log(err);
        });

        // Welcome users on join
        ircBot.addListener('join', function(channel, nick) {
            if(nick == config.botName) {
                ircBot.say(channel, 'Hola!');
            } else {
                if( config.default_ignore_nicks.indexOf(nick.toLowerCase()) == -1) {
                    ircBot.say(channel, 'Welcome ' + nick + '!');
                }
            }
        });

        // Auto-join on invite
        ircBot.addListener('invite', function(channel, from, message) {
            ircBot.join(channel);
        });

        // On connection end
        ircBot.addListener('end', function() {
            console.log(arguments);
        });

    },
    reload: function() {

    },
    destroy: function() {

    }
};