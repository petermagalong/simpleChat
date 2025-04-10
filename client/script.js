const SERVER = 'http://localhost:5000';
const socket = io(SERVER);

const inputForm = document.getElementById('inputForm');
const usersCount = document.getElementById('usersCount');
let users_count;
let registeredUser = false;

function displayMyChat(yourchat) {
    const chatContainer = document.createElement('div');
    chatContainer.className = 'yourChat';
    const chat = document.createElement('p');
    chat.textContent = yourchat;
    const sender = document.createElement('small');
    sender.innerHTML = 'You';
    chatContainer.appendChild(chat);
    chatContainer.appendChild(sender);
    document.getElementById('chatsContainer').appendChild(chatContainer);
}

function displayOthersChat(othersChat){
    const chatContainer = document.createElement("div")
    chatContainer.className = "othersChat"
    const chat = document.createElement("p")
    chat.textContent = othersChat.chat
    const sender = document.createElement("small")
    sender.textContent = othersChat.name
    chatContainer.appendChild(chat)
    chatContainer.appendChild(sender)
    document.getElementById("chatsContainer").appendChild(chatContainer)

    const chatsDiv = document.getElementById("chatsContainer")
    chatsDiv.scrollTop = chatsDiv.scrollHeight
}

inputForm.addEventListener('submit', (e) => {
    e.preventDefault();
    if(registeredUser === false) {
        const userName = e.target.formInput.value;
        // emit mag papasa nang data to client to server
        socket.emit('new-user', userName);

        e.target.formInput.value = '';
        displayMyChat("You joined as " + userName);

        users_count += 1;
        usersCount.innerHTML = users_count;

        // Change the input form to a chat form
        inputForm.className = 'chat-form';
        inputForm.formInput.placeholder = 'Aa'
        inputForm.formBtn.innerHTML = 'Send';
        registeredUser = true;
    } else {
        const userChat = e.target.formInput.value.toString();
        e.target.formInput.value = '';

        socket.emit('new-chat', userChat);
        displayMyChat(userChat);
    }
    
})
socket.on('connect', () => {
    socket.on('users-count', (count) => {
        users_count = count;
        usersCount.innerHTML = users_count;
    })
})

socket.on('users-connected', (name) => {
    users_count++;
    usersCount.innerHTML = users_count;
    displayOthersChat({
        name: name,
        chat: name+' joined the chat!'
    });
})

socket.on('added-new-chat', (data) => {
    console.log(data);
    displayOthersChat(data);
})


socket.on('users-disconnected', (name) => {
    users_count--;
    usersCount.innerHTML = users_count;
    displayOthersChat({
        name: name,
        chat: name+' disconnected!'
    });
})