const timeFormatter = (hours, minutes) => {
    let returnString = "";

    if(minutes >= 60) {
        const additionalHours = Math.floor(minutes/60);
        minutes = minutes - additionalHours * 60;
        hours = hours + additionalHours;
    }
    
    if (hours < 1) {
        returnString = "00:";
    } else if (hours < 10) {
        returnString = "0" + hours + ":";
    } else {
        returnString = hours + ":";
    }
    if (minutes < 1) {
        returnString = returnString + "00";
    } else if (minutes < 10) {
        returnString = returnString + "0" + minutes;
    } else {
        returnString = returnString + minutes;
    }

    return returnString;
} 

export default timeFormatter;