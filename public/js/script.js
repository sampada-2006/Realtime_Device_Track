//initializing socket.io
//connection request goes to backend/server
const socket= io(); //returns an object when connection is established and that object is stored in socket

//get users latitude and longitude and send it to server
if(navigator.geolocation){ 
  navigator.geolocation.watchPosition((position)=> {
     const {latitude, longitude} = position.coords;
     socket.emit("send-location",{latitude,longitude});
  },(error)=>{
    console.error(error);
  },
  {
   enableHighAccuracy:true,
   timeout:5000,
   maximumAge:0,
  });
}


//Displaying user's location on map
const map=L.map("map").setView([0,0],16); //blank map

L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',{
    attribution:"Open Street Map"
}).addTo(map); //open street map will be provided inside blank map


//updating the live marker
const markers ={}

socket.on("received-location",(data)=>{
  const {id, latitude, longitude}=data;
  map.setView([latitude,longitude]);
  if(markers[id]){
    markers[id].setLatLng([latitude,longitude]);
  }else{
    markers[id]=L.marker([latitude,longitude]).addTo(map);
  }
});

//when a user disconnects or closes the app
socket.on("user-disconnected",(id)=>{
  if(markers[id]){
    map.removeLayer(markers[id]);
    delete markers[id];
  }
})
