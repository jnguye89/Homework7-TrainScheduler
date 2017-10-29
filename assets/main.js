 var config = {
    apiKey: "AIzaSyA4gdRGTRZ1o4v5EGL-iq_ueyNjvMQcEvE",
    authDomain: "train-schedu.firebaseapp.com",
    databaseURL: "https://train-schedu.firebaseio.com",
    projectId: "train-schedu",
    storageBucket: "",
    messagingSenderId: "854088709989"
  };
  firebase.initializeApp(config);


var database = firebase.database();

//-----------------------------


database.ref().on("value", function(snapshot){
	//create the header table on each data load
	var addTable = $("<table>");
	var addRowHeader = $("<thead>");
	var addRow = $("<tr>");
	var addHeader = $("<th>");
	var addData = $("<td>");


	addTable.addClass("table table-striped table-hover");
	addRow.append("<th>Train Name</th>");
	addRow.append("<th>Destination</th>");
	addRow.append("<th>Frequency (min)</th>");
	addRow.append("<th>Next Arrival</th>");
	addRow.append("<th>Minutes Away</th>");
	addRowHeader.append(addRow);
	addTable.append(addRowHeader);

	$("#train-table").html(addTable);
	
	snapshot.forEach(function(childSnapshot){

		var currentTime = miliNowFunction();
		var timeSplit = childSnapshot.val().firstTime.split(":");
		
		var firstTrainMilli = (timeSplit[0] * 60 * 60 * 1000) + (timeSplit[1] * 60 * 1000);

		while (currentTime > firstTrainMilli) {
			firstTrainMilli  = firstTrainMilli + (childSnapshot.val().trainInterval * 60 * 1000);
		}

		var lastTrain = firstTrainMilli - (childSnapshot.val().trainInterval * 60 * 1000);

		var nextTrainMilli = currentTime - lastTrain;
		console.log(nextTrainMilli);
		var nextTrainMin = nextTrainMilli/1000/60;
		console.log(Math.floor(nextTrainMin));


		//display each train schedule for each object in database
		var addRow = $("<tr>");
		var addRowBody = $("<tbody>");
		addRow.append("<td>" + childSnapshot.val().trainName);
		addRow.append("<td>" + childSnapshot.val().destination);
		addRow.append("<td>" + childSnapshot.val().trainInterval);
		addRow.append("<td>" + childSnapshot.val().trainInterval);
		addRow.append("<td>" + Math.floor(nextTrainMin));
		addRowBody.append(addRow);
		$(".table").append(addRowBody);

		
		

		// console.log(firstTrainMilli);

	})
})

$("button").on("click", function() {
	//prevent default submit
  event.preventDefault();


  	//get input information when submit button is clicked
  var trainName = $("#train-name").val().trim();
  var destination = $("#train-destination").val().trim();
  var firstTime = $("#train-time").val().trim();
  var trainInterval = $("#train-interval").val().trim();

  console.log("Train Name: " + trainName);
  console.log("Destination: " + destination);
  console.log("First Train Time: " + firstTime);
  console.log("Train Frequency: " + trainInterval);


  //push data to firebase
  database.ref().push({
  	trainName: trainName,
  	destination: destination,
  	firstTime: firstTime,
  	trainInterval: trainInterval,

  })
})

var miliNowFunction = function(){

	//convert the current time to milliseconds
		var dateNowHour = moment().hour();
		var dateNowMinutes = moment().minute();
		var dateNowSeconds = moment().second();
		var dateNowMilli = moment().millisecond();
		var dateNow = (dateNowHour*60*60*1000)+(dateNowMinutes*60*1000)+(dateNowSeconds*1000)+dateNowMilli;
	
		
		return dateNow;
}

var firstTrainMilliFunction = function(){

	
}