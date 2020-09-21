# Confusion-React-Native-Application

A cross platform mobile application built for a restaurant where customers can make their restaurant bookings, know what all dishes the restorant serves, add dishes to their favourites and know more about the restaurant.

# Screenshots

<div style="display: grid;">
  <img src="/images/Image1.jpeg" height="580px" width="320px">
  <img src="/images/Image2.jpeg" height="580px" width="320px">
  <img src="/images/Image3.jpeg" height="580px" width="320px">
  <img src="/images/Image4.jpeg" height="580px" width="320px">
  <img src="/images/Image5.jpeg" height="580px" width="320px">
  <img src="/images/Image6.jpeg" height="580px" width="320px">
 </div>
 
 # Quick Starter guide :rocket:
 
Before you run the react application you need to start up the JSON Server. <br />
This is because application data will be served up by the local JSON Server to the application.

### Steps to start the JSON Server :

- Install JSON Server by `npm install -g json-server`
- `cd` to the json-server directory which is inside the root directory.
- Now start the json-server by `json-server --host <Your-IP-Address> --watch db.json -p 3001`
- Change the baseUrl.js file in the shared directory as 
```
export const baseUrl = "http://<Your-IP-Address>:3001/";
```

This will start the server at \<Your-IP-Address>:3001 .<br />

You can learn more in the [JSON server documentation](https://github.com/typicode/json-server).

### Steps to start the application :

- Install all the dependencies using `npm install`
- Run the application in development mode on your browser by `npm run web`
