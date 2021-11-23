# Testing
## Devices
+ The project was tested on: 
    + Desktop: 
        + Google Chrome,

            ![Google Chrome](documentation/images/chrome.png)
            ![Google Chrome](documentation/images/chrome2.png)

        + Edge,

            ![Edge](documentation/images/edge.png)
            ![Edge](documentation/images/edge2.png)

    + Mobile:
        + iPhone 12 Pro

            ![iPhone](documentation/images/iphone.jpg)
            ![iPhone](documentation/images/iphone2.jpg)

    + Tablet:
        + Samsung Galaxy Tab III

            ![Tablet](documentation/images/tab.jpg)
            ![Tablet](documentation/images/tab2.jpg)

## Testing User Stories 

### First Time Visitor Goals
+ As a First Time Visitor, I want to easly navigate through the game to find content and understand main purpose of it.
    + When enter the website for the first time I can easly navigate through the menu. It's clear and intuitive. I can easily find out purpose and rules of the game by clicking "Rules" button, or check score list by clicking "Scores" button.

        ![Menu](documentation/images/menu.png)

+ As a First Time Visitor, I want to start play the game and have fun.
    + I can easily start the game by giving a nickname and clicking "Start" button. 

        ![input](documentation/images/nickname-input.png)

    + If I forgot put a nickname it comes up modal with information that I need to provide nickname to start the game. 

        ![modal](documentation/images/warning1.png)

    + If I add to much spacing in nickname input it does not pass it into Local Storage, as I used trim function to avoid unnecessary spacing.

        ![spacing](documentation/images/trim.png)

    + if I add too long nickname it comes up modal with information that Nickname can not be longer than 12 characters.

        ![modal](documentation/images/warning2.png)

    + While playing the game I do have fun and my memory is getting better.

+ As a First Time Visitor, I want to know how much score I've reached.
    + After each finished game I know how much score I earned.

        ![score info](documentation/images/gameover-score.png)

    + While coming back to main menu I can check score list, the maximum capacity of score list has been achived.

        ![score list](documentation/images/max-score-list.png)

### Returning Visitors Goals
+ As a Returning Visitors, I want to see previous scores and try to beat it.
    + As I came back later I can try to beat my previous scores, but it's not an easy task.

        ![score list max](documentation/images/max-score-list-beat.png)

## Manual Testing (Added features after first Testing)
+ Show correct answer
    + After chosing wrong picture as user I wanted to know where was the correct one.

        ![correct answer](documentation/images/correct1.png)

    + When timer was up I wanted to know where was correct one.

        ![correct answer](documentation/images/correct2.png)

+ Clicked picture by player
    + As I added correct picture showing after game is over, there was some illusion that user chose correct answer and the game was finished. 
    + So when user clicked correct answer while time showed 0, the correct answer appeard after user clicked at this picture, but in reality user couldn't click it as when the time is up user is not allowed to click it.
    + For clear visualisation I added white shadow box for picture that user actually clicked in the game time.

        ![Chosen picture](documentation/images/chosen-picture.png)

+ Exit Icon
    + During testing sometimes I missed click buttons. Many times I clicked play but I didn't want to and there was no option on the game view of coming back then waiting 10 seconds for game to finish.
    + So I created Exit Icon in the game header that reset the game and getting user to the menu view.

        ![Exit Icon](documentation/images/exit.png)



## Code Validation
### HTML
+ [First input](documentation/images/error-html.png) to HTML Validator had couple errors:
    + Alt and src attributes were empty.
    + In game section was missing header.
    + In modal was h1 used.
+ I fixed all errors.

* The [W3C School Validator](https://validator.w3.org/) were used to validate the HTML code on the project.

![HTML Validator](documentation/images/html-validator.png)

### CSS
* The [W3C School CSS Validator](https://jigsaw.w3.org/css-validator/validator.html.en) were used to validate CSS code on the project.

![CSS Validator](documentation/images/css-validator.png)

### JavaScript
* The [JSHint Validator](https://jshint.com/) were used to validate JS code on the project.

![JSHint Validator](documentation/images/js-validator.png)

## Lighthouse DevTools
+ First Lighthouse Report had 90 points in SEO so to improve that I've added meta discription in index.html file. 

    ![First Report](documentation/images/lighthouse.png)

- Second Lighthouse Report had 97 points in performence so to improve it I deleted unused font weights from CSS @import element. I forgot to screenshot it.

+ Third Lighthouse Report had 99 points in performence so to improve it I change the way of import font from google fonts.

    ![Third Report](documentation/images/lighthouse2.png)

+ Fourth Lighthouse Report

    ![Fourth Report](documentation/images/lighthouse3.png)

## Bug 
+ Apple devices had problem with correct displaying pictures on the board.

    ![Bug](documentation/images/bug.png)

    + To fix it I used [autoprefixer](https://autoprefixer.github.io/) that helped with displaying front of the picture.
        ```
        .card .card-front {
            -webkit-transform: rotateY(180deg);
                    transform: rotateY(180deg);
            -webkit-backface-visibility: hidden;
                    backface-visibility: hidden;
        }
        ```

    + To fix display animation of flipping pictures I've added z-axis in 3D space. I used Layers tools in Chrome Dev Tools.
        ```
        .card .card-back {
            transform: translateZ(1px);
        }
        ```
