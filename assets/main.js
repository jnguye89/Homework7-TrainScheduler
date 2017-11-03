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

		var nextTrain = callNextArrival(childSnapshot.val().firstTime, childSnapshot.val().trainInterval);
		
		var minutesAway = callMinutesAway(nextTrain);

		//display each train schedule for each object in database
		var addRow = $("<tr>");
		var addRowBody = $("<tbody>");
		addRow.append("<td>" + childSnapshot.val().trainName);
		addRow.append("<td>" + childSnapshot.val().destination);
		addRow.append("<td>" + childSnapshot.val().trainInterval);
		addRow.append("<td>" + nextTrain.format("HH:mm"));
		addRow.append("<td>" + minutesAway.format("m"));
		addRowBody.append(addRow);
		$(".table").append(addRowBody);
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
function callMinutesAway(nextTrain){
	var currentTime = moment();
	var nextDeparture = moment(nextTrain);
	var minutesAway = nextDeparture - currentTime;
	return moment(minutesAway);
}

function callNextArrival(trainTime, frequency) {
  var firstDeparture = moment(trainTime, "HH:mm");
  // console.log(firstDeparture);
  var currentTime = moment();
  // console.log(currentTime);
  var currentInterval = moment(firstDeparture);
  var nextTrain;
  var counter = 0;
    
    // Assume there is no next train to start with
    while(!nextTrain && counter < 500) {
      
      // console.log('Train Arrival :: ', currentInterval.format("HH:mm"))
      // Define the situation where first train time is after current time
      if (firstDeparture.isAfter(currentTime)) {
        console.log('train has not left yet.')
      }
      
      if ( currentInterval.isAfter(currentTime) ) {
        // Shows next train departure time
        nextTrain = currentInterval
        
      } else {
        // Shows all previous departure time
        currentInterval.add(frequency, 'minutes')
      }
      // Shows mins away the next train
      //var timeUntil = currentTime.to(nextTrain)
      //console.log('Until next Train: ', timeUntil)
      counter++
    }
    return nextTrain
}

