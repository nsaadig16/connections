<div align="center">
<img width="35" src="https://gremkin.carrd.co/assets/images/image01.gif?v56027378158651" alt="take your time"></img>
</div>

# Make Your Connections!

This is the repository for my project "Make Your Connections!", based on the game [Connections](https://www.nytimes.com/games/connections) by the New York Times, but in this version, you can make your own boards to challenge your friends!

Make Your Connections is available [**here**](https://nsaadig16.github.io/make-your-connections/).

## Make your own board
To make your own board, you can access the encoding page on the website. There, you can write the 4 groups of 4 words and the meaning of each group. The text should look something like this:
```
word1.a,word1.b,word1.c,word1.d
word2.a,word2.b,word2.c,word2.d
word3.a,word3.b,word3.c,word3.d
word4.a,word4.b,word4.c,word4.d
meaning1,meaning2,meaning3,meaning4
```
Once you've done it, you can get your **encoded board text**, which you can share with anyone!

## Play a board
To play a board, you just need to paste the **encoded board text** using the encoder available in the website. Is that easy!

## This project
This project was made almost entirely using OpenAI's *GPT-4o*, giving it a terminal-like version in Python (which you can find on [this branch](https://github.com/nsaadig16/make-your-connections/tree/python_base)) and requesting to make a page using JavaScript, CSS and HTML. 

This was also a great opportunity to have my first interaction with [GitHub Pages](https://pages.github.com/), learning how to deploy webs in an easy and comfortable way.