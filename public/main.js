let countries = [];
function getCountries() {
    fetch("/Countries")
        .then(response => response.json())
        .then(json => {setCountries(json); countries = json;})
}
function setCountries(data){
    let order = 1;
    const countriesList = document.getElementById('countriesList');
    countriesList.innerHTML = '';

    data.forEach(country => {
        const countryDiv = document.createElement('div');
        countryDiv.className = "w-full flex gap-2 p-3 border-b-1 border-gray-300";
        countryDiv.innerHTML = `
            <span id="s-order" class="font-bold self-center">#${order}</span>
            <div class="relative w-28 h-auto" onclick="OpenGifChange('${country.name}')">
                <i class="fa-solid fa-pen absolute left-1 text-gray-500 rounded-full p-2 bg-[#ffffff80] top-1"></i>
                <img class="w-28 h-full object-cover rounded" src="${country.image}" alt="" loading="lazy">
            </div>
            <div class="flex-1">
                <div class="w-full flex gap-2 justify-center items-center">
                    <img class="w-8" id="c-flag" src="${country.flag}" alt="" loading="lazy">
                    <h1 id="c-name" class="text-lg font-bold">
                        ${country.name}
                    </h1>
                </div>
                <div class="w-full flex flex-col justify-center items-center">
                    <p id="${country.name}-score" class="text-orange-600 font-extrabold text-2xl">${country.score}</p>
                </div>
                <div class="flex gap-2 mt-2">
                    <button onclick="(handleIncrease('${country.name}'))" class="cursor-pointer hover:bg-green-700 flex-1 bg-green-600 text-white px-5 py-1 rounded-lg border-green-700 border-3"><i class="text-xl fa-solid fa-caret-up"></i></button>
                    <button onclick="(handleDecrease('${country.name}'))" class="cursor-pointer hover:bg-red-700 flex-1 bg-red-600 text-white px-5 py-1 rounded-lg border-red-700 border-3"><i class="text-xl fa-solid fa-caret-down"></i></button>
                </div>
            </div>
        `;
        countriesList.appendChild(countryDiv);
        order++;
    });
    document.getElementById('loading').style.display = 'none';
}
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

getCountries()