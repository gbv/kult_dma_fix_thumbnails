var debugMode = true;
var thumbnailList = [];
var objectCounter = 0;
var listLength = 0;
var errorCounter = 0;
var errorList = [];

$( document ).ready( function() {

  var rows = "1000000";
  var solrQuery = "https://denkmalatlas.niedersachsen.de/solr/collection1/select?q=PI%3A*+AND+THUMBNAIL%3A*&rows="+rows+"&fl=PI%2CTHUMBNAIL&wt=json&indent=true";

  if (debugMode) logToPage(solrQuery);
  $.getJSON( solrQuery, {
    format: "json"
    })
    .done(function( objectList ) {
      logToPage("debug","Document is ready. JSON loaded.");
      thumbnailList = objectList.response.docs;
      if (debugMode) logToConsole(thumbnailList);
      listLength = objectList.response.docs.length;
      logToPage("debug", listLength+" Objects with thumbnails found. Start image check.");
      checkImage();
    });

});

function checkImage() {
  // if there are still images to check
  if ( objectCounter < listLength ) {
    // get current PI and its thumbnail image name
    let currentPi = thumbnailList[objectCounter].PI;
    let currentThumbnail = thumbnailList[objectCounter].THUMBNAIL;
    // build image path
    let thumnailUrl = "https://denkmalatlas.niedersachsen.de/viewer/rest/image/"+currentPi+"/"+currentThumbnail+"/full/!400,400/0/default.jpg";
    // create image
    const img = new Image();
    // set source
    img.src = thumnailUrl;
    // check image status
    if (img.complete) {
      // image works, nothing to do
      // check next image
      objectCounter++;
      checkImage();
    } else {
      img.onload = () => {
        // image works, nothing to do
        // check next image
        objectCounter++;
        checkImage();
      };
      img.onerror = () => {
        // increase error counter
        errorCounter++;
        // error on loading image
        logToPage("debug", "Fehler "+errorCounter+" für Objekt: "+currentPi);
        // log url
        errorList.push(thumnailUrl);
        // fix url
        let fixThumbnailUrl = thumnailUrl + "?ignoreCache";
        img.src = fixThumbnailUrl;
        // check next image
        objectCounter++;
        checkImage();
      }
    }
  // all images were checked
  } else {
    logToPage("debug", "Durchlauf beendet.");
    logToPage("result", errorCounter + " Fehler gefunden.");
    logToPage("result", "Diese URls gefunden und repariert.");
    logToPage("result", "{"+errorList.join(', ')+"}");
  }
}

function logToPage( channel, output ) {
  var debugElement = $(".debug");
  var resultsElement = $(".results");
  if (channel == "debug") {
    debugElement.prepend("<p>" + output + "</p>");
  }
  if (channel == "result") {
    resultsElement.append("<p>" + output + "</p>");
  }
}

function logToConsole( output ) {
  if (debugMode) {
    console.log(output);
  }
}