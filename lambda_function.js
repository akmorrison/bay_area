'use strict';

const AWS = require('aws-sdk');
const qs = require('querystring');

const oauth_token = "xoxp-9721384605-92804653710-019853264799-dlolyouthoughtidputmyactualtokenc95";

var https = require('https');

function send_json_request(done, domain, user_id, slack_token, text){
    var token = "token=" + oauth_token;
    var data= token + "&user=" + user_id;
    if(text === "")
        data += "&name=status_emoji&value=:rocket:";
    else{
        text = text.replace(/"/g, "\\\"")
        var profile = '{"status_emoji":":rocket:", "status_text":"'+ text +'"}'
        profile = encodeURIComponent(profile);
        data += "&profile=" + profile;
    }
    text = text.replace(/ /g, '%20');
    
    var domain_name = domain + '.slack.com';
    var path = '/api/users.profile.set?' + data;

    var request_data = {hostname: domain_name,
                        path: path,
                        port: 443,
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json; charset=utf-8',
                            'Content-Length': Buffer.byteLength(data),
                        },
                        
    };
    var post_req = https.request(request_data, function(res){
        res.on('data', function(d){
            if(user_id == "U2W19KS75"){
                done(null, domain_name + path + " text: " + text);
            }

            else
                done(null, "successfully set status");
        });
    });
    post_req.write(data);
    post_req.end();
}

function maintain_status_request(done, domain, user_id, slack_token){
    var token = "token=" + oauth_token;
    
    var domain_name = 'https://' + domain + '.slack.com';
    var path = '/api/users.list?' + token;

    try{
        https.get(domain_name + path, function(res){
            var responseString = '';
            res.on('data', function(d){
                responseString += d;
            });
            res.on('end', function(){
                var json_data = JSON.parse(responseString);
                
                for(var i in json_data.members){
                    if(json_data.members[i].id == user_id){
                        send_json_request(done, domain, user_id, slack_token, json_data.members[i].profile.status_text);
                        return;
                    }
                }
                done(null, "status text not found");
            });
        });

    }
    catch(e){
        done(null, e);
    }
}

function who_command(domain, done){
    var token = "token=" + oauth_token;
    
    var domain_name = 'https://' + domain + '.slack.com';
    var path = '/api/users.list?' + token;

    try{
        https.get(domain_name + path, function(res){
            var responseString = '';
            res.on('data', function(d){
                responseString += d;
            });
            res.on('end', function(){
                var json_data = JSON.parse(responseString);
                
                var members_string = '';
                var members_with_rocket_emoji = [];
                for(var i in json_data.members){
                    if(!json_data.members[i].deleted)
                        members_string += json_data.members[i].real_name + ',';
                        if(json_data.members[i].profile.status_emoji == ":rocket:")
                            members_with_rocket_emoji.push(json_data.members[i].real_name);
                }
                if(members_with_rocket_emoji.length === 0){
                    done(null, "There's no one in the bay right now");
                }
                else if(members_with_rocket_emoji.length === 1){
                    done(null, "There's one person in the bay right now, it's " + members_with_rocket_emoji[0]);
                }
                else{
                    var return_string = 'There are ' + members_with_rocket_emoji.length.toString() + ' people in the bay right now: ';
                    for(var j in members_with_rocket_emoji){
                        return_string += members_with_rocket_emoji[j];
                        if(j != (members_with_rocket_emoji.length -1)){
                            return_string += ', ';
                        }
                    }
                    done(null, return_string);
                }
            });
        });

    }
    catch(e){
        done(null, e);
    }
}

exports.handler = (event, context, callback) => {
    const done = (err, res) => callback(null, res);
    
    var params = qs.parse(event.body);
    var team_domain = params.team_domain;
    var user_id = params.user_id;
    var command = params.command;
    var token = params.token;
    var text = params.text;
    
    if((command === "/bay" && text === "who") || command === '/who')
        who_command(team_domain, done);
    else if(command === "/bay" && text === "")
        maintain_status_request(done, team_domain, user_id, token);
    else if(command === "/bay")
        send_json_request(done, team_domain, user_id, token, text);
};
