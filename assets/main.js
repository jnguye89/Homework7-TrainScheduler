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

database.ref().on("value", function(snapshot){
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
		var addRow = $("<tr>");
		var addRowBody = $("<tbody>");
		
		addRow.append("<td>" + childSnapshot.val().trainName);
		addRow.append("<td>" + childSnapshot.val().destination);
		addRow.append("<td>" + childSnapshot.val().trainInterval);
		addRow.append("<td>" + childSnapshot.val().trainInterval);
		addRow.append("<td>" + childSnapshot.val().trainInterval);
		addRowBody.append(addRow);
		$(".table").append(addRowBody);

	})
})

$("button").on("click", function() {
  event.preventDefault();

  var trainName = $("#train-name").val().trim();
  var destination = $("#train-destination").val().trim();
  var firstTime = $("#train-time").val().trim();
  var trainInterval = $("#train-interval").val().trim();

  console.log("Train Name: " + trainName);
  console.log("Destination: " + destination);
  console.log("First Train Time: " + firstTime);
  console.log("Train Frequency: " + trainInterval);

  database.ref().push({
  	trainName: trainName,
  	destination: destination,
  	firstTime: firstTime,
  	trainInterval: trainInterval,

  })


})