const socket = io();


const form = document.getElementById('sendcontainer');
const messageInput = document.getElementById('messageInp')
const messageContainer = document.querySelector('.container')
const form1 = document.getElementById('closeChat');

var sound = new Audio('../music.mp3')

const append = (message, position) =>{
    const messageElement = document.createElement('div');
    
    messageElement.innerHTML = message;
    
    
    messageElement.classList.add('message');
    messageElement.classList.add(position);
    messageContainer.append(messageElement);

}

form1.addEventListener('submit' , e=>{
    e.preventDefault();
    if(Username === "Admin" || Username === "admin"){
        console.log("Admin closed the chat")
        socket.emit('closeChat' , Username);
    }
    
})

form.addEventListener('submit' , e=>{
    e.preventDefault();
    message = messageInput.value;
    append(`You : ${message}` , 'right');
    socket.emit('send' , message);
    messageInput.value = "";
    sound.play();
})

const showToast = (data , message) =>{
   
    
    var x = document.getElementById("snackbar");
    x.innerHTML = `${data} ${message} the chat`;
    x.className = "show";
    setTimeout(function(){ x.className = x.className.replace("show", ""); }, 3000);
    
}

const reload = () =>{
    location.replace("/removed");
}


socket.on('left' , data => {
    showToast(data , 'left');
    
})



const Username = prompt("Enter Your Name To Join");

socket.emit('new-userJoined' , Username );
socket.on('userJoined', Username =>{
    showToast(Username , 'joined');
    

})



socket.on('receive', data =>{
    append(`${data.name} : ${data.message}` , 'left');
})

socket.on('chatClosed' , data =>{
    reload();
})

