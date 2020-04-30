This online shopping application allows users to browse through an inventory of items and add those items to a shopping cart. 
Cookies are used to identify the user with their specific cart. No sign-in is necessary for regular users. 

The app also features user authentication for all admin panel pages. Must be signed in and registered to view admin pages. 
Anyone can register as an admin to view the admin panel by clicking on the Admin Panel link in the top right-hand corner of index page. I did this on purpose to showcase all pages. 
Once signed in as admin, the user has access to crud operations for all products. 

***Important
This app can be cloned and used immediately. The only requirement is to make your own password for cookie session. 
This code can be found in index.js in root folder. Enter your own password as a string inside the square brackets as shown below. 

<!-- app.use(
	cookieSession({
		keys : [ --Insert password here-- ]
	})
); -->
