Accounts.onCreateUser(function(options, user){
    if(user.services.facebook){
        user.emails = [{
            address: user.services.facebook.email,
            verified: true,
        }];
        user.facebookId = user.services.facebook.id;
        user.profile = {};
        user.profile.firstName = user.services.facebook.first_name;
        user.profile.lastName = user.services.facebook.last_name;
        
        generateUsername = function(username) {
            var count;
            username = username.toLowerCase().trim().replace(" ", "");
            count = Meteor.users.find({"username": username}).count();
            if (count === 0) {
                return username;
            } 
            else {
                return username + (count + 1)
            }
        }
        
        username = user.services.facebook.name;
        user.username = generateUsername(username);
        
        if (user.services.facebook.email === "kopanda@gmail.com"){
            Roles.setRolesOnUserObj(user, 'admin', Roles.GLOBAL_GROUP);
        }
    }
    check(user, Schema.User);
    return user;
});

