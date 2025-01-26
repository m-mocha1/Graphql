This project is a web application that provides user authentication and displays various charts based on user data. It uses Chart.js for creating charts and fetches data from a GraphQL API.
## Installation

To install the necessary dependencies, run the following command in your terminal:
 * npm install chart.js

## Usage
Open index.html with live-server extension.
The login form will be displayed. Enter your username and password to log in.
After logging in, the main page will display user information and various charts.

## Files
index.html: The main HTML file that includes the login form and scripts.
enteryCss.css: CSS file for styling the login form and other elements.
main.css: CSS file for styling the main page and charts.
package.json: Contains the project dependencies.
scrips.js: Main JavaScript file that handles user authentication, data fetching, and chart creation.
temps/: Directory containing template files for the login form, main page, and chart creation.

## Scripts
scrips.js: This file contains the main logic for the application, including:
User authentication
Fetching user data from the GraphQL API
Creating charts using Chart.js

## Functions
* login(): Handles user login and fetches the JWT token.
* getuserdata(token): Fetches user data using the provided token.
* mainPage(id, username, totalXp): Displays the main page with user information.
* ChangeCss(name): Changes the CSS file dynamically.
* getSkills(token): Fetches and processes user skills data.
* createAskillsMap(data): Creates a map of user skills.
* deTok(): Clears the token.
* createAGradeMap(data): Creates a map of user grades.
* createAttemptsMap(data): Creates a map of user attempts.
* getProgressData(token): Fetches user progress data.
* getAttemptsData(token): Fetches user attempts data.

Dependencies
chart.js: A JavaScript library for creating chart
