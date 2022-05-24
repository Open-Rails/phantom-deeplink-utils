# Phantom Deeplinks Builder

Phantom just released their [Deeplinks](https://docs.phantom.app/integrating/deeplinks) method of integrating with your application.

This library helps you with all the cumbersome state management and encryption you usually need to do when developing 

## A brief introduction to deeplinking

Surely you have used deeplinking in your day to day. 
For example when you are on your phone and you click on a spotify song and the following happens:

1. The spotify app opens
2. The App takes you to the song you want 
3. Spotify plays the song for you 

Your Phone OS and Spotify cooperate for these actions to happen and this whole process is called Deeplinking, It can however be split in two, Redirecting and Handling the redirection.

### Handling the redirection
So we know that given a URL we can run some code in our application, for that to happen we need to know the URL we currently are on, parse It to extract the URL and query parameters and get all the data we need to do what we want.

We can do lots with Deeplinks and creativity, take these examples:

`/playSong?songId=aee2193183&time=80`

`/addToCard?itemId=ae245orj6&quantity=2`

### Redirecting


## Demo
We think the best way to learn is by doing, in our repo you can find a demo of a Phantom Deeplinks application that fulfils the minimum requirements


