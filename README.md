# Gradie's Grueling Grind
Those damn adventurers! They've chased you, a defenseless Kobold, deep into this cave system and away from the rest of your tribe. Now you have to figure your way home though you feel hopelessly lost. Explore the cave and deal with the adventurers along the way in order to get back to the other Kobolds!

[Gradie's Grueling Grind Live Demo](https://melissay94.github.io/gradies-grueling-grind/)

## Setting up Project
+ clone or download
+ run `npm install`
+ NOTE: This requires that you have the parcel CLI installed
+ run `parcel index.html`
+ Happy Gaming!

## About the Game
This is going to be a top down 2D rouge-like dungeon crawler! The game will start in a safe area, but after that all other rooms will have some sort of danger in it that you can combat or attempt to run away from. The game will have permanent death, where the player has to start over completely every time they die. Eventually you may run into your tribe and then the game will be over.

## The Wireframes
![Wireframes](/assets/wireframe.png)


## Tech Being Used
* HTML/CSS - Canvas to hold the game
* JavaScript
* Bootstrap for page styling
* Phaser 3 for game logic
* Parcel for building

## Sprites Created
![Sprites](/assets/sprites.png)

## MVP Checklist
* Render the starting area **Completed**
* Render a random room when a player goes through a door **Completed**
* Render enemies within a room **Completed**
* Have player able to attack enemies **Completed**
* Have enemies able to attack players **Completed**
* Track a health bar for the player **Completed**
* Have an end state once a player's health is 0. **Completed**
* Keep track of how long the player stays alive. - Counter, clock, how many enemies killed, etc. **Completed**

## Stretch Goals
* While the map does now stretch forever, you can't loop back to previous rooms, only follow the already discovered path back to them. At some point, I want to change the logic for saving rooms to a resizing array that will be able to check for previous rooms on all sides, not just where it originated from.
* Add some beautiful artwork for the sprites **Completed**
	- New Goal: Add some animations for Gradie and his sword
* Have different types of attack for players (ie stab, range, magic)
* Have different types of enemies that have different level of difficulties
* Have items that help the player (Health potions, armor, magical items(?))
* Have doors that you can't just walk through. (Need a key, or a magical item, or to defeat all monsters in the room)
* Having a winning state where you find the tribe and made it through the caves.

## Issues and Bugs
* Enemies follow you from one room to the next - Even when I told them to destroy themselves in the stopRoom function, it would lead to different issues down the line that I haven't figureed out yet.
* Enemies will not collide with walls. I'm not getting any errors for it, and they collide with everything else, but for some reason they complete ignore the walls. The player can collide with the walls, and the enemies collide with the player so that's really stumping me.
* Sometimes your sword just flys away. This probably has to do with how I'm implementing the sword start and stop for it's movement, but right now if you go fast enough it starts going all around the room.
* You cannot move and stab at the same time. Like London Tipton chewing gum. Again, probably has to do with my implementation of the sword movement but it likes to stay sheathed when you're running.
* The code structure is kind of bonkers, and I would like to clean it up and refactor it to be more expandable. Right now it's very tightly coupled.

## Images of Game Play
#### Spawning into the start area  
![Start Area](/assets/starting_area.png)

#### Moving to a new room  
![switching rooms](/assets/switching_rooms.png)

#### Ghosts Spawning  
![ghosties](/assets/ghosties_spawn.png)

## Game Planning and Implementation

1. Learn more about Phaser via the Internets
	- The first part of making my game meant doing research on the technology I wanted to use, namely Phaser. 
	- I decided to spend my time going through Phaser tutorials on [Codecademy](https://www.codecademy.com/learn/learn-phaser), since it's a platform that I'm familiar with.
	- I also looked through quite a few examples on the [Phaser]([https://phaser.io/examples](https://phaser.io/examples)) website to get a better idea of how some concepts like the physics were implemented in different ways.
2. Adding Phaser to my project
	- This actually took way more time that I originally thought it would. It was just a link to be added right? Like Bootstrap!
	- (Spoilers: It was not like that) I didn't want Phaser just living in a script tag in my HTML like the tutorials I had done, and for some reason I had a hard time finding an example of separating the script out into it's own file.
	- Eventually, I got some help from a friend, who had me add Parcel to my project, which is a web application bundler that's super easy to use for simple stuff. It gave my project the ability to hot reload, as well as let me use the "require" syntax for all my JavaScript files. Ready to go!
3.  What's in a game?
	- Planning out all the different types of game objects that would be in the game and their relationships to each other:
	
|  |Player |Wall | Door| Room | Sword | Enemy | 
|--|--|--|--|--|--|--|
| **Player** | N/A |Player has no effect on Wall.  | Player overlaps with door.| Player can move around Room. | Player moves Sword with it and triggers it. | Enemy and Player do not pass through each other.  | 
| **Wall** | Wall prevents player from passing through it.| N/A | Wall has no effect on Door. | Wall has no effect on Room. | Wall has no effect on Sword. | Wall bounces enemies off of it when they collide. |
| **Door** | Door triggers room movement when a player overlaps it. | Door has no effect on Wall  | N/A | Door has no effect on Room. | Door has no effect on Sword. | Door has no effect on Enemy.
|**Room**| Room has no effect on Player. | Room moves Wall with it. | Room moves Door with it. | N/A | Room has no effect on Sword. | Room keeps all enemies contained within it. |
|**Sword** | Has no Effect on Player. | Has no effect on Wall. | Has no effect on Door. | Has no effect on Room. | N/A | When Sword overlaps Enemy, the Enemy is destroyed. |
|**Enemy**| Player takes damage when an Enemy collides with them. |Has no effect on Wall. | Has no effect on Door. | Has no effect on Room. | Has no effect on Sword. | Bounces off of each other on impact.

4.  Rooms on Rooms on Rooms
	 - Since I was going for a never ending rouge-like here, I had to think about how my dungeon expands and how I keep track of it.
	 - Wanted players to be able to retrace their steps, and for each room to randomize the danger within it.
	 - Being in one room would take up the entire view screen.
	 - A big chunk of figuring out this logic was the realization that since the doors and walls make up the room, they are all children of the room and thus need their coordinates based on the position of the room, and not their position within the view.
	 - Also wanted to be sure to keep track of rooms but not end up with 100+ rooms rendered at one time and growing, so I went back later and added logic for destroying a room, but making sure the information of it was saved.
5. Testing the room's movements, which means movement.
	- Next came working on Player movement,  and by extension Room movement, and this was one of the areas that Phaser saves you time once you understand it. Though it took me a bit of reading and checking examples, I realized that you can easily use Phaser's built in Physics to do things such as setting Game Object velocity without having to calculate it yourself.
	- Using the Phaser key logic as well I set up typical `WASD` keys as the up, left, down, and right direction keys, which was pretty quick.
	- Then came triggering room movement. While getting the trigger to recognize the Player overlapping a Door, it took me quite a bit of trial and error to find the right combination of physics to make the transition smooth.
	- You can check out both here: [Room Videos](https://www.instagram.com/p/B8PXuY6FNZT/)
6. It's dangerous to go alone!
	 - So now we have rooms with doors and walls and a player that can go between them. But this is an dungeon crawl. And what is a dungeon crawl with out something to defend yourself with?!
	 - Here comes our trusty sword! I added the sword so that it's always overlapping with the player, and tied it's movement to the space bar. On every just down call, the sword goes out in from of the player in the direction they're facing, and then comes back in.
7. DANGER ZONE!!!
	- All that's left is some enemies! At first I tried really hard to make my own enemy class that would give them a path to follow, something thatI could potentially update in the future to be a smarter path or a player-seeking path.
	- However, I ran into a lot of difficulty later when it came to collision detection between the enemies and the player as the path following always seemed to override the collision, meaning that they overlapped each other a lot. 
	- As such, I switched gears to a simpler bouncing back and forth, where the enemies collided   with the sides, each other, and the player. If they collided with something, they bounce off, and if that something is you, then you lost health.
8. All that was left was the win/lose condition, or in this case, the lose forever condition.
	- Eventually I'd like the game to follow the pitch I made for it originally where you're looking for the other Kobolds, and there's a chance of the game ending when you find them, but for now it's survival of the fittest.
	- The game will keep going while you have health, and the minute you're out, you have the option to restart, but with no saves or progress made. That is the brutal world of rogue-like dungeon crawlers.
	- Right now, the progress is kept track by how long you survive for in the shape of a count up clock!

## Final Thoughts

One of the biggest take aways I have from completing my MVP for this project is that I wish I had taken more time to do research ahead of time. There were multiple occasions while working on something that I figured out a better way to do it and was super tempted to refactor everything right then and there. It's really hard to not just keep cleaning up code as you go because a part of me knows that if it's organized now, it'll save me a lot of time and effort down the road. However, when you're on a tight timeline, you don't always have the luxury of thinking about down the road.

I also learned that what you think is going to be the easiest part isn't always true. I really didn't expect to take more than a day figuring out how all the rooms moved and went together, but that ended up being the longest part of the project, which in retrospective made sense. After all, the majority of the game takes place in relation to a room object, so it has to hold a ton of information at any one time.
