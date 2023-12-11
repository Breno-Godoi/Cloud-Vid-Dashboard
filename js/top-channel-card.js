//js\top-channel-card.js

let topChannelIndex = 0;

function topChannelCard(){
    // Find top ChannelName
    document.getElementById("topChannelCard").innerHTML = "#" + (topChannelIndex+1) + " " + top100data[topChannelIndex].ChannelName;
}

// Fix data loading after this.
setTimeout(topChannelCard, 20);

function changeChannel(direction){
    if(direction == 0 && topChannelIndex != 0){
        topChannelIndex--;
    }
    else if(direction == 1 && topChannelIndex != 84){
        topChannelIndex++;
    }
    else{
        topChannelIndex = 0;
    }

    // Update displayed channel.
    document.getElementById("topChannelCard").innerHTML = "#" + (topChannelIndex+1) + " " + top100data[topChannelIndex].ChannelName;
}