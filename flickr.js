
// Hämta referenser till DOM-element som behövs
const search_button = document.getElementById('search_button');
const search_field = document.getElementById('search_text');
const mainElement = document.querySelector('main');
const overlayImg = document.querySelector('#overlay img');
const overlayTitle = document.querySelector('#overlay figcaption');
const overlay = document.getElementById('overlay')

// Sätt variabler som kommer att användas senare
let currentPage = 1;
let loadingImages = false;

// Lägg till en eventlyssnare på sök-knappen
search_button.addEventListener('click', async () =>{

    //rensa gamla bilder
    mainElement.innerHTML = '';

    //Hämta bilder
    let imageData = await getImages();

    //visa upp bilder
    updateUI(imageData);
})


// Funktion för att visa upp bilderna på sidan
const updateUI = (data) => {
data.photos.photo.forEach(img => {
    // Skapa en bildtagg för varje bild
    const imgElement = document.createElement('img');
    imgElement.setAttribute('src', imgUrl(img));
    imgElement.setAttribute('alt', img.title);

    imgElement.addEventListener('click', () => {
        openLightBox(img.title, imgUrl(img, 'Large'))

    })

    mainElement.appendChild(imgElement);
    
});

}

const openLightBox = (title,url) => {
overlayImg.setAttribute('src', url);
overlayImg.setAttribute('alt', title);

overlayTitle.innerHTML = title;
overlay.classList.toggle('show');


}

//close lightbox
overlay.addEventListener('click', () => {
    overlay.classList.toggle('show');
})

const imgUrl = (img, size) => {
    let sizeSuffix = 'q';
    if (size == 'thumb') {sizeSuffix = 'p'}
    if (size == 'thumb') {sizeSuffix = 'b'}

    const url = `https://live.staticflickr.com/${img.server}/${img.id}_${img.secret}_${sizeSuffix}.jpg`;

    return url;
}

const getImages = async () => {

    const baseUrl = 'https://www.flickr.com/services/rest';
    const method = 'flickr.photos.search'; 
    const text = search_field.value;
    const apiKey = 'e24881d6c916691e277bf1aa8e1a3c9b';

    const url = `${baseUrl}?method=${method}&api_key=${apiKey}&page=${currentPage}&text=${text}&format=json&nojsoncallback=1`;
    const resp = await fetch(url);
    const data = await resp.json();

    console.log(data);
    return data;
}

window.addEventListener('scroll', () => {
    const { scrollTop, scrollHeight, clientHeight} = document.documentElement;
    const offset = scrollTop + clientHeight;

  //  console.log('scrolltop:', scrollTop)

    if(offset >= scrollHeight) {
        if(!loadingImages){
            nextPage();
        }

    }
})

const nextPage = async () => {
    loadingImages = true;
    currentPage++;
    const imageData = await getImages();

    updateUI(imageData);

    loadingImages = false;
}