# wsky-neat
===========

A slack app that I made one time for the student design team that I'm on. It lives in Amazon Lambda, but I'm putting the code on github because I'm putting this on my resume (PUT ALL THE THINGS ON THE RESUME), and I figure that I should have a link to the code on the resume as well. If you're a recruiter reading this, hi. Nice to meet you. <sup>please <sup>hire <sup>me</sup></sup></sup>

description
-----------

I'm on a student design team at the University of Waterloo, and we use Slack to communicate. One of the things that always gets asked on our Slack channel is "who's working in the bay right now?" (the university gave us a bay/garage thing to do design work in). I figured there had to be a better way to report who was there than just asking in a public channel and hoping people respond. So I made this app.

Bay area is an incredibly simple app, all it does is change a user's status emoji to the rocket symbol when the user runs the slash command `/bay`. When someone types `/bay who`, the app responds with a list of all people who's status emoji is currently the rocket symbol.

It isn't a very complicated app, but it's been incredibly useful. This is the first time I've ever interacted with Amazon Web Services, so I learned a lot.

Anyways... yeah. That's about it.
