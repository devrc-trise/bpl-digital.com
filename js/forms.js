//ClickDimensions Lab Pre-Fill Forms From URL Parameters
//For more information see http://blog.clickdimensions.com/2014/06/pre-fill-forms-from-links-or-webpages.html
//NOTE: This code is provided as a sample only for the purposes of illustration.

//This function gets the parameters from the URL and sets variables for the fields to be pre-filled
function getParm(name)
{
  name = name.replace(/[\[]/,"\\\[").replace(/[\]]/,"\\\]");
  var regexS = "[\\?&]"+name+"=([^&#]*)";
  var regex = new RegExp(regexS);
  var results = regex.exec(window.location.href);
  
  //set variables for each of the fields you wish to pre-file
  //reference them by the ID you found for the field when viewing the source
  Name = document.getElementById("name");
  Email = document.getElementById("email");

  if(results == null)
    return "";
  else
    return results[1];
}

//This function executes the function above and set the values in the fields
window.onload=function execParm() {
    var fName = getParm('name');
    var lName = getParm('email');   
    Name.value = fName;
    Email.value = lName;
  }