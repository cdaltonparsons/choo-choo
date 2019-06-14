var firebaseConfig = {
  apiKey: "AIzaSyB4eSfu8ODYM89uzCL2bM_TCIaDSmcPCEA",
  authDomain: "my-awesome-project-ed513.firebaseapp.com",
  databaseURL: "https://my-awesome-project-ed513.firebaseio.com",
  projectId: "my-awesome-project-ed513",
  storageBucket: "my-awesome-project-ed513.appspot.com",
  messagingSenderId: "848683298775",
  appId: "1:848683298775:web:a49923dba1ecc8bb"
};
// Initialize Firebase
firebase.initializeApp(firebaseConfig);

var database = firebase.database();

var audio = new Audio("assets/train-whistle.wav")

var trainName = "";
var destination = "";
var firstTrain = "";
var frequency = "";

$("#button").on("click", function(event) {
  event.preventDefault();

  trainName = $("#train-name")
    .val()
    .trim();
  destination = $("#destination")
    .val()
    .trim();
  firstTrain = $("#time-first-train")
    .val()
    .trim();
  frequency = $("#frequency")
    .val()
    .trim();

  database.ref().push({
    train: trainName,
    destination: destination,
    firstTrain: firstTrain,
    frequency: frequency
  });
  $("#train-name").val("");
  $("#destination").val("");
  $("#time-first-train").val("");
  $("#frequency").val("");

  audio.play()
});

database.ref().on("child_added", function(snapshot) {
  
  var sv = snapshot.val();
  // Need to take the start time of the first train, then calculate how often that train runs
  
var trainFrequency = parseInt(sv.frequency);
var firstTime = sv.firstTrain;
var firstTimeConverted = moment(firstTime, "HH:mm").subtract(1, "days");
var currentTime = moment().subtract(1, "days");
var diffTime = currentTime.diff(firstTimeConverted, "minutes");
var tRemainder = diffTime % trainFrequency;
var minutesNextTrain = trainFrequency - tRemainder;
var nextTrain = moment().add(minutesNextTrain, "minutes").format("HH:mm");


  var tableRow = $("<tr>");
  var newTrain = $("<td>").text(sv.train);
  var newDestination = $("<td>").text(sv.destination);
  var newFrequency = $("<td>").text(sv.frequency);
  var nextArrival = $("<td>").text(nextTrain);
  var minutesAway = $("<td>").text(minutesNextTrain);

  tableRow.append(
    newTrain,
    newDestination,
    newFrequency,
    nextArrival,
    minutesAway
  );
  $("#table-body").append(tableRow);
});
