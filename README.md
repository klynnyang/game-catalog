<h1 align="center"><b>Games Catalog - Project 2</b></h1>
Games Catalog is a prototype game review application, created for General Assembly's Software Engineering Immersive program. 
<p>Below is a screenshot of the application displayed in a web browser</p>

<img src="https://i.imgur.com/WgaZ7k6.png" style="width: 450px; height: auto;">

<p>
<h2><b>Technologies Used</b></h2>
The Games Catalog application is built using NodeJS, Express and MongoDB. The database is currently hosted on MongoDB Atlas, and the web application is deployed on Heroku.

<h2><b>Database Information</b></h2>
The raw data for the database was acquired through Steam Web API from a previous project linked below:
<p><a hre="https://github.com/klynnyang/Steam_games_analysis">https://github.com/klynnyang/Steam_games_analysis</a>
<p>The data encapsulates majority of the games available on Steam as of May 2021. The information may not be accurate and is used for prototype testing only.

<p>
<h2><b>Getting Started</b></h2>
This application is accessable through the link below:
<p><a hre="https://catalog-for-games.herokuapp.com/">https://catalog-for-games.herokuapp.com/</a>

<h3><u>Application Features</u></h3>
<li>This application is made to be mobile compatiable</li>
<li>It supports both google and local authentication</li>
<li>Basic users has the ability to: </li>
<ul>
    <li>Add and delete their own reviews and rating</li>
    <li>Add and remove games from their own watchlist</li>
    <li>View other user's profiles</li>
    <li>Add new games to the database</li>
</ul>
<li>Admin users has the ability to: </li>
<ul>
    <li>All features for basic users</li>
    <li>Update game information</li>
    <li>Delete games</li>
    <li>Delete all user comments & reviews</li>
</ul>
<p>
<h2><b>Next Steps</b></h3>
<li>Ability to add other users as friends</li>
<li>Ability to communicate with friends through real-time messaging</li>
