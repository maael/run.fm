var commands = [];
commands["pause"] = function(){$("body").trigger("pause");};
commands["resume"] = function(){$("body").trigger("resume");};
commands["stop"] = function(){term.print("Stopped");$("body").trigger("stop");};
commands["clear"] = function(){$('#term').empty();};
commands["cls"] = function(){term.commands["clear"]();}
commands["show"] = function(){term.print("<a href='"+player.track.permalink_url+"'>Playing "+player.track.title+" by "+ player.track.user.username+"</a>");$(".player").parent().remove();};
commands["showtime"] = function(parts){
    if(typeof parts == "undefined"){
        if(player.showtime){
            if(player.position==player.track.duration){$(".player").parent().remove();}
            var bar = "";
            var numberOfBars = Math.round((player.position/player.track.duration)*50);
            for(var i = 0;i<numberOfBars;i++){bar += "|";}
            for(var i = 0;i<(50-numberOfBars);i++){bar += " ";}
            if($('.player').length>0){$(".player pre").html(player.milli_to_minute(player.position)+" ["+bar+"] "+player.milli_to_minute(player.track.duration));} 
            else {term.print("<div class='player'><pre>"+player.position+" ["+bar+"] "+player.track.duration+"</pre></div>");}
        }
    } else {
        if (typeof parts[1] != 'undefined') {
            if(parts[1]=="off"){
                player.showtime = false;
                if($(".player").length>0){$(".player").parent().remove();}
            } else if(parts[1]=="on"){player.showtime = true;}
        } else {player.showtime = true;}
    }
};
commands["refresh"] = function(){location.reload();};
commands["genre"] = function(){term.print("Playing tracks of the "+player.genre+" genre")};
commands["playcount"] =  function (){(player.track !== null) ? term.print("Play Count: "+player.track.playback_count) : term.print("No track playing");};
commands["play"] =  function (parts){
    if (typeof parts != 'undefined') {
        if (typeof parts[1] != 'undefined') {
            term.commands['clear']();
            player.genre = parts[1];
        }
    }
    var url = 'https://api.soundcloud.com/tracks.json?genres='+player.genre+'&limit=200&client_id='+api_key;
    console.log("Getting tracks for " + player.genre + " from " + url);
    $.getJSON(url, function(tracks) {var id = term.getRandomInt(0,(tracks.length-1));player.track = tracks[id];})
    .done(function(){$("body").trigger("play");})
    .fail(function(){term.print("Skipping " + player.track);term.commands['play']();});
};
commands['next'] = function(){term.commands['play']();}
commands['help'] = function(){
    term.printTitle("Avaiable Commands");
    term.printHelpTitle("Music Commands");
    term.printHelp("pause, resume","Pause or resume playback");
    term.printHelp("play [genre]","Play the specified genre");
    term.printHelp("playcount","Show the play count for the current track");
    term.printHelp("mute, unmute","Volume shortcuts");
    term.printHelp("next","Go to the next track")
    term.printHelp("stop","Stop the current track");
    term.printHelpTitle("Player Commands");
    term.printHelp("clear","Clears the screen");
    term.printHelp("cls","Same as clear");
    term.printHelp("help","Shows this help text");
    term.printHelp("history","Shows played songs for current session");
    term.printHelp("setcolor","Set the text color of the terminal with hex");
    term.printHelp("show","Show title/time for current track");
    term.printHelp("showtime [on|off]","Show time progress for tracks");
    term.printHelpTitle("User Commands");
    term.printHelp("create","Makes a new account");
    term.printHelp("like","Like the current track");
    term.printHelp("likes","Show all your saved likes");
    term.printHelp("login","Log in to your account");
    term.printHelp("savesettings","Saves text color and background to your account");
}
commands['history'] = function(){term.print("History");for(id in player.history){var h=player.history;term.print("<a href='"+h[id].permalink_url+"'>"+h[id].title+" by "+ h[id].user.username+"</a>");}}
commands['like'] = function(){
    if(user.username != null && player.is_playing){
        var newtrack = {permalink_url: null,title: null, username: null};
        newtrack.permalink_url = player.track.permalink_url;
        newtrack.title = player.track.title;
        newtrack.username = player.track.user.username; 
        user.likes.push(newtrack);
        $.post("./actions/like.php", {username : user.username,track : JSON.stringify(newtrack)}, function(data){
            if (data.length>0){
                var obj = jQuery.parseJSON(data);
                (obj.success) ? term.print("Liked!") : term.print('Failed to like this track!');;
            } else {
                term.print('Failed to like this track!');
            }
        });
    } else {
        if(user.username == null){term.print('Please login in to save your likes!');}else if(!player.is_playing){term.print('Please start playing a track to save your likes!');};
    }
}
commands['likes'] = function(){
    if(user.username != null){
        term.print("Likes");
        $.post("./actions/likes.php", {username : user.username}, function(data){
            user.likes = [];
            if (data.length>0){
                var obj = jQuery.parseJSON(data);
                for(id in obj.likes){
                    var like = jQuery.parseJSON(obj.likes[id]);
                    user.likes.push({permalink_url: like.permalink_url, title: like.title,username: like.username});
                }
                for(var i=0;i<user.likes.length;i++){term.print("<a href='"+user.likes[i].permalink_url+"'>"+user.likes[i].title + " by " + user.likes[i].username+"</a>");}
            } else {
                term.print('Failed to get your likes!');
            }           
        });    
    } else {
        term.print('Please login in to see your likes!');
    }
}
commands['mute'] = function(){$("body").trigger("mute");}
commands['unmute'] = function(){$("body").trigger("unmute");}
commands['setcolor'] = function(parts){
    if (typeof parts != 'undefined') {
        if (typeof parts[1] != 'undefined') {term.setColor(parts[1]);}
    }
}
commands['create'] = function(parts){
    if (term.password || typeof parts != 'undefined') {
        if (term.password || ((typeof parts != 'undefined') ? typeof parts[1] != 'undefined' : false)) {   
            if(term.password){
                $.post("./actions/make.php", {username : user.tempuser,password : md5(parts[0])}, function(data){
                    var obj = jQuery.parseJSON(data);
                    if(obj.username==user.tempuser){term.print('Account ' + user.tempuser + ' made, you may now login');}
                    else{term.print("Could not make account for "+user.tempuser);}
                });
            } else {
                user.tempuser = parts[1];
                term.password = true;
            }
        }
    }             
}
commands['user'] = function(){term.print("Logged in as " + ((user.username === null) ? "no one" : user.username));}
commands['userload'] = function(){$('body').css('background-image', 'url(' + user.bg + ')');term.setColor(user.color);term.draw_cursor(0);}
commands['login'] = function(parts){
    if (term.password || typeof parts != 'undefined') {
        if (term.password || ((typeof parts != 'undefined') ? typeof parts[1] != 'undefined' : false)) {   
            if(term.password){
                $.post("./actions/login.php", {username : user.tempuser,password : md5(parts[0])}, function(data){
                    if (data.length>0){
                        var obj = jQuery.parseJSON(data);
                        user.username = obj.username;
                        user.color = obj.color;
                        user.bg = obj.bg;
                        term.commands['cls']();
                        term.print('Logged in as '+user.username);
                        term.commands['userload']();
                    } else {
                        term.print('Failed to log in as '+user.tempuser);
                    }
                });
            } else {
                user.tempuser = parts[1];
                term.password = true;
            }
        }
    }          
}
commands['savesettings'] = function(){
    if(user.username != null){
        $.post("./actions/saveSettings.php", {username : user.username,text_color : term.color,bg : user.bg}, function(data){
            if (data.length>0){
                var obj = jQuery.parseJSON(data);
                (obj.success) ? term.print("Saved!") : term.print('Failed to save your settings!');;
            } else {
                term.print('Failed to save your settings!');
            }
        });
    } else {
        if(user.username == null){term.print('Please login in to save your settings!');};
    }    
}