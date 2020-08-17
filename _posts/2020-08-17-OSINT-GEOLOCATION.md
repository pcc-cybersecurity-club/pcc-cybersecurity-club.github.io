---
layout: post
title: OSINT Geolocation Challenges
tags: [ncl, capture, the flag, osint, geolocation]
author: Blake Eakin
---
<em>OSINT Geolocation Challenges</em>

<p>This week we are retiring an OSINT geolocation challenge from the Spring 2020 Individual NCL where you were given a couple of pictures of a particular building from different points of view and asked to provide that particular building's address. While we can't provide a writeup of this exact challenge due to the terms of the NCL, we can still provide some general advice for solving similar challenges in the future, and explain the importance of this particular skillset.</p>

<h3>Exif Data</h3>

<p>While it's generally not going to be available in most CTF challenge settings, sometimes devices will store positional data from GPS in image metadata. Grabbing this data is rather simple. You just have to run exiftool against the image file and see if there is any GPS data available, or more specifically you can run <code>exiftool -a -gps:all [image path]</code> to specifically get only the gps data. Try it out on some of <a href="https://github.com/ianare/exif-samples/tree/master/jpg/gps" target="_blank">these images</a> and see what kind of GPS data can be available. Like I said, this often times won't be the path to the solution since most OSINT challenges of this variety will be tailored towards you using the context available in the image itself to guide you to a solution. All the same, it's so quick and simple to check for positional metadata that you might as well give it a shot before spending much time on anything else.</p>

<h3>Signage and Surrounding Environment</h3>

<p>Probably the most useful piece of visual information you can find in a picture to help you place it is any sort of signage whatsoever, especially if it has some sort of text on it. This can quickly cue you in to where in the world the picture is taken, and may even be specific enough to let you know the city a picture was taken in. Even a single non-descript <a href="https://en.wikipedia.org/wiki/Category:Road_signs_by_country" target="_blank">road sign</a> can help you locate it. Generally they are chock full of positional information. The language on the sign can serve as a clue, mile posts and town names can position you along a highway, street signs can point you to intersections, license plates can give you a good idea of a state, pretty much any writing is a major clue to lean on to start homing in on the position of an image once you get to looking at a map. After that, taking a good look at the surrounding environment can take you the rest of the way. Pay attention to unique markers that would make a specific position easy to spot on a map.</p>

<h3>Weather</h3>

<p>With regards to CTFs, this a factor that won't normally come into play, since many times it has to work in tandem with image metadata. While I've already discussed GPS metadata, a much more common piece of metadata that you'll find with an image is a timestamp. Pair that together with the visible weather in a picture and Wolfram Alpha's historical weather data and you're on the way towards verifying the location of an image.</p>

<h3>Reverse Image Search</h3>

<p>While just putting an image straight into a reverse image search usually won't lead you right to location, some of them provide unique features that can improve your chances of getting useful results. Google pairs your image with keywords, Bing allows you to crop your image to focus on specific areas, Yandex has an OCR feature to pull text out of images. I had a friend who picked up a large framed picture of a french streetside cafe during sunset from a thrift store, and they would tell me all the time how much they wished they could go to that exact spot, but all they knew about it was that it was in France. Doing a straight RIS of the image through Google returned every orange-toned street cafe image Google had to offer. However, just using a few extra keywords along with it based on available information - such as France, cafe, etc. - gave me a narrowed search of several strikingly similar areas. In turn these led me to a few towns I could look at on Google Maps where I could then search for noticeable landmarks. Within a few minutes we were able to locate the exact cafe with just a couple of searches.</p>

<h3>Why is this useful?</h3>

<p>OSINT Geolocation may seem like a trivial and out of place skill in a security CTF. A lot of times in investigations, or even pentesting, images and videos are the most accessible and sometimes only thing to work with. There's the infamous case of John Mcafee getting caught by way of <a href="https://www.wired.com/2012/12/oops-did-vice-just-give-away-john-mcafees-location-with-this-photo/" target="_blank">metadata</a>, there are projects just based around identifying the locations of pictures to aid child trafficking investigations, and outside of a law enforcement perspective it's good to know just what sort of information you are putting out into the world every time you post a picture.</p>

<h3>Resources for Practice</h3>

<ul>
    <li><a href="https://tracelabs.org" target="_blank">Trace Labs</a> - Crowdsourced OSINT for missing persons.</li>
    <li><a href="https://www.geoguessr.com/" target="_blank">Geoguessr</a> - Get placed in a random street view and guess where in the world you are.</li>
</ul>

