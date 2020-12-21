var dog,dogImage,dogHappyImage;
var dataBase;
var fedTime,lastFed;
var feed,addFood;
var foodObj,position,dogRef;
var gameState="Hungry";
var livingroom,livingroomImg,garden,gardenImg;
var washroom,washroomImg,lazyImg;
var CurrentTime,Currenttime;

function preload(){

  dogImage = loadImage("Images/dogImg.png");
  dogHappyImage = loadImage("Images/dogImg1.png");
  lazyImg = loadImage("Images/Lazy.png");

  livingroomImg = loadImage("Images/Living Room.png");
  gardenImg = loadImage("Images/Garden.png");
  washroomImg = loadImage("Images/Wash Room.png");

}

function setup(){

  dataBase = firebase.database();

  createCanvas(700,730);

  foodObj = new Food();
  
  dog = createSprite(350,550,20,20);
  dog.addImage(dogImage);
  dog.scale = 0.2;

  dogRef = dataBase.ref('Food');
  dogRef.on("value",readStock);

  feed = createButton("Feed the dog");
  feed.position(340,70);
  feed.mousePressed(feedDog);

  addFood = createButton("Add Food");
  addFood.position(450,70);
  addFood.mousePressed(addFoods);

  var gamestateRef = dataBase.ref('Gamestate');
  gamestateRef.on("value",function(data){
    gameState = data.val();
  })
  
}

function draw(){  

  background("lavender");
  drawSprites();

  foodObj.display();

  fedTime = dataBase.ref('FeedTime');
  fedTime.on("value",function(data){
    lastFed = data.val();
  });

  textSize(15);
  fill("brown");
  if(lastFed >= 12){
    text("Last Fed: " + lastFed % 12 + " PM",190,75);
  }else if(lastFed === 0){
    text("Last Fed: 12 PM",190,75);
  }else{
    text("Last Fed: " + lastFed + " AM",190,75);
  }

  if(gameState !== "Hungry"){
  
    if(Currenttime === lastFed + 1){

      feed.hide();
      addFood.hide();
      foodObj.livingRoom();

      textSize(20);
      fill("red");
      text("The dog has not finished its food yet",200,175);

    }else if(Currenttime === lastFed + 2){

      feed.hide();
      addFood.hide();
      foodObj.washRoom();

      textSize(20);
      fill("blue");
      text("The dog is bathing",150,175);

    }else if(Currenttime >= lastFed + 2 && Currenttime <= lastFed + 4){

      feed.hide();
      addFood.hide();
      foodObj.Garden();

      textSize(20);
      fill("purple");
      text("The dog is playing",200,175);

    }else{

      feed.show();
      addFood.show();

    }

  }

  getCurrentTime();

}

function readStock(data){
  position = data.val();
  foodObj.updateFood(position);
}

function feedDog(){

  dog.addImage(dogHappyImage);

  foodObj.updateFood(foodObj.getFood()-1);
  dataBase.ref('/').update({
    Food:foodObj.getFood(),
    FeedTime:hour() 
  })

}

function addFoods(){
  position++;
  //you need to update the food that position holds
  dataBase.ref('/').update({
    Food:position
  })
  dog.addImage(dogImage);
}

function getCurrentTime(){

  CurrentTime = dataBase.ref('currentTime');
  CurrentTime.on("value",function(data){
    Currenttime = data.val();
  });

  dataBase.ref('/').update({
    currentTime:hour()
  })

}

function update(state){
  dataBase.ref('/').update({
    Gamestate:state
  })
}


