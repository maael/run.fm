var term = {
    password: false,
    previousCommand: null,
    cursor_location: 0,
    commands: null,
    color: null,
    getRandomInt: function(min, max) {return Math.floor(Math.random() * (max - min + 1) + min);},
    repeat: function(pattern,count){
        if (count < 1) return '';
        var result = '';
        while (count > 0) {
            if (count & 1) result += pattern;
            count >>= 1, pattern += pattern;
        }
        return result;        
    },
    printIntro: function(){$('#term').append("<div class='command main_title'><pre>"+" _____           ___       \n| __  |_ _ ___  |  _|_____ \n|    -| | |   |_|  _|     |\n|__|__|___|_|_|_|_| |_|_|_|\n"+"</pre></div>");},
    print: function(text){$('#term').append("<div class='command'>"+text+"</div>");},
    printTitle: function(text){$('#term').append("<div class='command title'>"+text+"</div>");},
    printHelpTitle: function(text){$('#term').append("<div class='command help title'>"+text+term.repeat(".",75-text.length)+"</div>");},
    printHelp: function(command,text){$('#term').append("<div class='command help'>"+command+"<span class='faded'>"+term.repeat(".",75-(text.length+command.length))+"</span>"+text+"</div>");},
    draw_cursor: function(change){
        if((term.cursor_location+change<=$('#input').text().length)&&(term.cursor_location+change>=0)){term.cursor_location += change;}
        if((term.cursor_location == $('#input').text().length)){$('#input').html($('#input').text());$('#input').append("<span class='cursor'></span>");} 
        else {$('#input').html($('#input').text());}
    },
    addLetter: function(keyCode){var a = $('#input').text();var output = a.substr(0, term.cursor_location)+String.fromCharCode(keyCode)+a.substr(term.cursor_location);$('#input').html(output);term.draw_cursor(1);},
    resetInput: function (){term.cursor_location = 0;$('#input').empty();term.draw_cursor(0);(term.password) ? $('#input').addClass('password') : $('#input').removeClass('password');},
    keydown: function(e){
        if(e.keyCode == 8){
            var a = $('#input').text();
            var output = a.substr(0, term.cursor_location-1) + a.substr(term.cursor_location);
            $('#input').html(output);  
            term.draw_cursor(-1);
            return true;
        } else if (e.keyCode == 38){
            return true;
        } else if (e.keyCode == 40){
            return true;
        } else if (e.keyCode == 39){
            term.draw_cursor(1);
            return true;
        } else if (e.keyCode == 37){
            term.draw_cursor(-1);
            return true;
        } else if (e.keyCode == 13){
            var command = $('#input').text();
            term.doCommand(command);
            term.resetInput(); 
            return true;                
        }
        return false;
    },
    loadCommands: function(commands){
        term.commands = commands;
    },
    doCommand: function(command){
        var parts = command.split(" ");
        if(term.password){
            if(term.previousCommand == 'login') {
                term.commands['login'](parts) 
            } else {
                term.commands['create'](parts);
            }
            term.password = false;
        } else {
            (parts[0] in term.commands) ? term.commands[parts[0]](parts) : term.print("No command " + parts[0] + " found");
        }
        if(parts[0] in term.commands){term.previousCommand = parts[0]};
    },
    setColor: function(hex){
        term.color = hex;
        $('body').css('color','#'+hex);
    }
}