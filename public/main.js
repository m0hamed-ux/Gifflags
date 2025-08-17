function handleDecrease(country_name){
    fetch("/handleDecrease", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ countryName: country_name })
    }).then(response => response.json())
      .then(json => {
        document.getElementById(`${country_name}-score`).innerText = json.data;
      })
}      
function handleIncrease(country_name){
    fetch("/handleIncrease", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ countryName: country_name })
    }).then(response => response.json())
      .then(json => {
        document.getElementById(`${country_name}-score`).innerText = json.data;
      })
} 
function OpenGifChange(country_name){
    const country = countries.find(c => c.name === country_name);
    if (!country) return;
    document.body.innerHTML += `
    <div  id="change-gif" class="w-full p-4 h-screen flex justify-center items-center fixed top-0 bg-[#00000080]">
        <div class="w-full max-w-[500px] relative flex flex-col gap-2 p-4 rounded-xl bg-white">
            <button id="close-change-gif" class="text-gray-500 hover:text-black text-2xl absolute top-3 right-3">
                <i class="fas fa-times"></i>
            </button>
            <div class="w-full flex gap-2 justify-center items-center">
                <img class="w-14" id="c-flag" src="${country.flag}" alt="" loading="lazy">
                <h1 id="c-name" class="text-2xl font-bold">${country.name}</h1>
            </div>
            <img id="current-gif" class="w-full object-cover max-h-[300px] rounded-xl" src="${country.image}" alt="">
            <input type="text" id="gif-url" class="w-full p-2 mt-4 border border-gray-300 rounded" placeholder="Enter new gif URL">
            <p id="status-message" class="mt-2"></p>
            <button id="submit-gif-change" class="w-full bg-black text-center text-white p-3 rounded">Submit</button>
        </div>
    </div>
    `
    document.getElementById('close-change-gif').addEventListener('click', () => {
        document.getElementById('change-gif').remove();
        getCountries();
    });
    document.querySelector('#change-gif button#submit-gif-change').addEventListener('click', () => {
        const newGifUrl = document.getElementById('gif-url').value;
        console.log(newGifUrl, country_name);
        if (!newGifUrl || newGifUrl.length == 0 || newGifUrl.split('.')[newGifUrl.split('.').length - 1] != 'gif' || newGifUrl.split('.').length < 2) {
            document.getElementById('status-message').innerText = 'Please enter a valid GIF URL.';
            document.getElementById('status-message').style.color = 'red';
            setTimeout(() => {
                document.getElementById('status-message').innerText = '';
            }, 1500)
            return;
        }; 
        fetch("/updateGif", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ countryName: country_name, gifUrl: newGifUrl })
        }).then(response => response.json())
          .then(json => {
            if (json.error) {
                document.getElementById('status-message').innerText = json.error;
                document.getElementById('status-message').style.color = 'red';
            } else {
                document.getElementById('current-gif').src = newGifUrl;
                document.getElementById('status-message').innerText = json.message;
                document.getElementById('status-message').style.color = 'green';
            }
          });
    });
}
window.addEventListener('DOMContentLoaded', () => {
    setTimeout(() => {
        document.getElementById('loading').remove();
    }, 2000);
})