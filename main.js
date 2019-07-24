window.onload = () => {
    const roverDropdown = document.getElementById('rover-dropdown');
    const dateDropdown = document.getElementById('date-dropdown');
    const cameraDropdown = document.getElementById('camera-dropdown');
    const mainElement = document.querySelector('main');
    const modalElement = document.getElementById('modal');

    const manifests_url = 'https://api.nasa.gov/mars-photos/api/v1/manifests/';
    const images_url = 'https://api.nasa.gov/mars-photos/api/v1/rovers/';
    const api_key = 'ukXdMTzMXvIfqSZlEgiWr38RXRGVBwPflVBfiqoN';

    let currentImage=null;
    let data = null;
    let hideButtons = ()=>{
        if(currentImage.previousSibling===null){
            document.querySelector('#modal > #previous').style.visibility='hidden';
        }
        else{
            document.querySelector('#modal > #previous').style.visibility='visible';
        }
        if(currentImage.nextSibling===null){
            document.querySelector('#modal > #next').style.visibility='hidden';
        }
        else{
            document.querySelector('#modal > #next').style.visibility='visible';
        }
    }

    document.querySelector('#modal > #close').onclick = () => {
        modalElement.classList.remove('shown');
        const image = modalElement.querySelector('img');
        modalElement.removeChild(image);
    };
    document.querySelector('#modal > #next').onclick = () => {
        //Remove current shown image
        const oldImage = modalElement.querySelector('img');
        modalElement.removeChild(oldImage);
        //Update current image
        currentImage=currentImage.nextSibling;
        //Show updated image
        const newImage=currentImage.cloneNode();
        modalElement.appendChild(newImage);
        hideButtons();
    };
    document.querySelector('#modal > #previous').onclick = () => {
        //Remove current shown image
        const oldImage = modalElement.querySelector('img');
        modalElement.removeChild(oldImage);
        //Update current image
        currentImage=currentImage.previousSibling;
        //Show updated image
        const newImage=currentImage.cloneNode();
        modalElement.appendChild(newImage);
        hideButtons();
    };
    cameraDropdown.oninput = (e) => {
        mainElement.innerHTML = '';
        fetch(`${images_url}${roverDropdown.value}/photos?earth_date=${dateDropdown.value}&camera=${cameraDropdown.value}&api_key=${api_key}`)
            .then(response => response.json())
            .then(json => {
                json.photos.forEach(photo => {
                    mainElement.innerHTML += `<img src="${photo.img_src}" alt="${roverDropdown.value.toUpperCase()}'s photo of Mars taken at ${dateDropdown.value} by ${photo.camera.full_name}.">`;
                });
                const images = document.querySelectorAll('body > main > img');
                for (let image of images) {
                    image.onclick = (e) => {
                        // 1st way 
                        // image.requestFullscreen();
                        currentImage=e.target;
                        const copyImage = e.target.cloneNode();
                        modalElement.appendChild(copyImage);
                        modalElement.classList.add('shown');
                        hideButtons();

                    };
                }
            });
    };
    dateDropdown.oninput = (e) => {
        // Remove all options and set disabled=true
        mainElement.innerHTML = '';
        cameraDropdown.innerHTML = '';
        cameraDropdown.setAttribute('disabled', 'true');
        // Then, if date is selected, populate cameras
        if (dateDropdown.value) {
            cameraDropdown.innerHTML = '<option value="" selected>Choose camera</option>';
            data.find(x => x.date === dateDropdown.value)
                .cameras
                .forEach(camera => {
                    cameraDropdown.innerHTML += `<option value="${camera}">${camera}</option>`;
                });
            cameraDropdown.removeAttribute('disabled');
        }
    };
    roverDropdown.oninput = (e) => {
        // Remove all options and set disabled=true
        mainElement.innerHTML = '';
        dateDropdown.innerHTML = '';
        dateDropdown.setAttribute('disabled', 'true');
        cameraDropdown.innerHTML = '';
        cameraDropdown.setAttribute('disabled', 'true');
        // Then, if rover has a value
        if (roverDropdown.value) {
            // Do a HttpRequest to NASA API
            fetch(`${manifests_url}${roverDropdown.value}?api_key=${api_key}`)
                .then(response => response.json())
                .then(json => {
                    data = json.photo_manifest.photos.slice(0, 50).map(x => {
                        return {
                            date: x.earth_date,
                            cameras: x.cameras
                        }
                    });
                    dateDropdown.innerHTML = '<option value="" selected>Choose date</option>';
                    for (let d of data) {
                        dateDropdown.innerHTML += `<option value="${d.date}">${d.date}</option>`;
                    }
                    dateDropdown.removeAttribute('disabled');
                });
        }
    };
    document.onkeydown = (e) => {

        if (e.keyCode == 27 && modalElement.classList.contains('shown')) {
            document.querySelector('#modal > #close').click();
        }
        if (e.keyCode == 39 && modalElement.classList.contains('shown')&&document.querySelector('#modal > #next').style.visibility=='visible') {
            document.querySelector('#modal > #next').click();
        }
        if (e.keyCode == 37 && modalElement.classList.contains('shown')&&document.querySelector('#modal > #previous').style.visibility=='visible') {
            document.querySelector('#modal > #previous').click();
        }
    };
    roverDropdown.selectedIndex="0";
}