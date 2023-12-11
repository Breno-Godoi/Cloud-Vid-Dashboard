//js\top-channel-card.js

let topChannelIndex = 0;

function topChannelCard(){
    // Find top ChannelName
    // Ensure data is loaded
    if (top100data && top100data.length > topChannelIndex) {
        document.getElementById("topChannelCard").innerHTML = "#" + (topChannelIndex + 1) + " " + top100data[topChannelIndex].ChannelName;
    } else {
        console.error('Data not loaded or index out of range');
    }
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