// create category buttons 
const createCategoryBtns = async () => {
    const categoryContainer = document.getElementById("category-container");
    const response = await fetch("https://openapi.programming-hero.com/api/peddy/categories");
    const data = await response.json();
    
    data.categories.forEach(element => {
        const btn = document.createElement("button");
        btn.innerHTML = `
            <img src="${element.category_icon}" alt="${element.category} icon"> ${element.category}
        `;
        btn.classList.add("flex", "justify-center", "items-center", "gap-x-6", "px-[90px]", "py-[10px]", "border", "border-[1px]", "border-[rgba(14,122,129,0.15)]", "rounded-[120px]", "hover:border-[#0E7A81]", "hover:bg-[rgba(14,122,129,0.1)]");
        btn.onclick = () => fetchItemsByCategory(btn.innerText);
        categoryContainer.appendChild(btn);    
    });
};

// Spinner display function
const showSpinner = () => {
    const spinner = document.getElementById("spinner");
    spinner.classList.remove("hidden");
};
const hideSpinner = () => {
    const spinner = document.getElementById("spinner");
    spinner.classList.add("hidden");
};

// populate like sidebar
const showLike = (button) => {
    const cardElement = button.closest(".card");
    const imgElement = cardElement.querySelector("figure img");

    const sidebar = document.querySelector("#liked-pets");

    const likedImageContainer = document.createElement("div");
    likedImageContainer.classList.add("rounded-lg");

    likedImageContainer.innerHTML = `
        <img src="${imgElement.src}" alt="Liked Pet" class="w-full object-cover rounded-lg">
    `;

    sidebar.appendChild(likedImageContainer);
};


// fetching all items or items by category
const fetchItems = async (category, sort = false) => {
    const itemsContainer = document.getElementById("items-container");
    itemsContainer.innerHTML = "";

    showSpinner();
    const spinnerDelay = new Promise(resolve => setTimeout(resolve, 2000));

    let url = category ? `https://openapi.programming-hero.com/api/peddy/category/${category}` : "https://openapi.programming-hero.com/api/peddy/pets";
    
    const response = await fetch(url);
    const data = await response.json();

    let items = category ? data.data : data.pets;

    if (sort) {
        items.sort((a, b) => {
            const priceA = a.price ? parseFloat(a.price) : 0;
            const priceB = b.price ? parseFloat(b.price) : 0;
            return priceB - priceA; 
        });
    }

    await Promise.all([spinnerDelay, response]);

    hideSpinner();
    displayItems(items);
};


// fetching items by category
const fetchItemsByCategory = (category) => {
    const buttons = document.querySelectorAll("#category-container button");
 
    buttons.forEach((btn) => {
        btn.classList.remove("active");
    });

    const activeButton = [...buttons].find(btn => btn.innerText.includes(category));
    if (activeButton) {
        activeButton.classList.add("active");
    }

    fetchItems(category);
};


// this function populates the area with items
const displayItems = (items) => {
    const itemsContainer = document.getElementById("items-container");

    itemsContainer.innerHTML = "";

    if (items.length === 0) {
        const div = document.createElement("div");
        div.classList.add("border-[1px]", "border-[rgba(19,19,19,0.1)]", "p-5");
        div.innerHTML = `
            <div class="flex flex-col items-center justify-center text-center bg-slate-400 py-8">
                <img src="./images/error.webp" alt="No Data Available" class="w-full max-w-xs">
                <h2 class="my-4 text-4xl font-black">Sorry, no pets are available</h2>
            </div>
        `;
        itemsContainer.classList.remove("grid", "grid-cols-1", "md:grid-cols-2", "lg:grid-cols-3", "gap-10");
        itemsContainer.appendChild(div);
        return;
    }

    itemsContainer.classList.add("grid", "grid-cols-1", "md:grid-cols-2", "lg:grid-cols-3", "gap-10");
    items.forEach(element => {

        const div = document.createElement("div");
        div.classList.add("card", "bg-base-100", "border", "border-[1px]", "border-[rgba(19,19,19,0.1)]");

        div.innerHTML = `
            <figure class="px-5 pt-5">
                <img
                    src="${element.image}"
                    alt="Shoes"
                    class="rounded-xl" />
            </figure>
            <div class="card-body">
                <h2 class="card-title text-xl font-bold">${element.pet_name}</h2>
                <div class="description text-base text-stone-500 space-y-2">
                    <p>
                        <i class="fa-solid fa-border-none mr-[10px]"></i>Breed: ${element.breed ? element.breed : 'Not Available'}
                    </p>
                    <p>
                        <i class="fa-regular fa-calendar mr-[10px]"></i>Birth: ${element.date_of_birth ? element.date_of_birth.split('-')[0] : 'Not Available'}
                    </p>
                    <p>
                        <i class="fa-solid fa-venus mr-[10px]"></i>Gender: ${element.gender ? element.gender : 'Not Available'}
                    </p>
                    <p>
                        <i class="fa-solid fa-dollar-sign mr-[10px]"></i>Price: $${element.price ? element.price : 'Not Available'}
                    </p>
                </div>
                <div class="card-actions border-t border-[rgba(19,19,19,0.1)] pt-4 mt-4 flex justify-between">
                    <div onclick="showLike(this)" id="like" class="border border-[1px] border-[rgba(14,122,129,0.15)] px-4 py-2  rounded-lg cursor-pointer hover:bg-primaryColor hover:text-white"><i class="fa-regular fa-thumbs-up"></i></div>
                    <button onclick="handleAdoptionModal(this)" id="adopt" class="border border-[1px] border-[rgba(14,122,129,0.15)] px-4 py-2 text-primaryColor font-bold rounded-lg hover:bg-[#0E7A81] hover:text-white">Adopt</button>
                    <button onclick="handleDetailsModal('${element.petId}')" id="${element.petId}" class="border border-[1px] border-[rgba(14,122,129,0.15)] px-4 py-2 text-primaryColor font-bold rounded-lg hover:bg-[#0E7A81] hover:text-white">Details</button>
                </div>
            </div>
        `;
        
        itemsContainer.appendChild(div);
    });
};

// modal related functions
function showAdoptionModalBox() {
    const adoptionModal = document.getElementById('adoption-modal');
    adoptionModal.showModal();    
};
const handleAdoptionModal = (button) => {
    const timerElement = document.getElementById("timer");

    let time = timerElement.innerText;

    const timerInterval = setInterval(() => {
        time--
        timerElement.innerText = time;
        if (time === 0) {
            clearInterval(timerInterval);
            document.getElementById('adoption-modal').close();
            button.disabled = true;
            button.classList.add("disabled");
            button.classList.remove("hover:bg-[#0E7A81]", "hover:text-white");
            button.innerText = "Adopted";
            timerElement.innerText = 3;
        }        
    }, 1000);
    
    showAdoptionModalBox();
};

function showDetailsModalBox() {
    const successModal = document.getElementById('show-details');
    successModal.showModal();    
};
const handleDetailsModal = async (id) => {
    const url = `https://openapi.programming-hero.com/api/peddy/pet/${id}`;
    const response = await fetch(url);
    const data = await response.json();

    const modalContainer = document.querySelector("#show-details .modal-box");
    
    modalContainer.innerHTML = "";

    modalContainer.innerHTML = `
                <img src="${data.petData.image}" alt="" class="w-full object-fill">
                <h3 class="text-2xl font-bold my-4">${data.petData.pet_name}</h3>
                
                <div class="w-9/12 justify-between description text-base text-stone-500 space-y-2 flex flex-col md:flex-row">
                    <div >
                        <p><i class="fa-solid fa-border-none mr-[10px]" aria-hidden="true"></i>Breed: ${data.petData.breed ? data.petData.breed : 'Not Available'}</p>
                        <p><i class="fa-solid fa-venus mr-[10px]" aria-hidden="true"></i>Gender: ${data.petData.gender ? data.petData.gender : 'Not Available'}</p>
                        <p><i class="fa-solid fa-venus mr-[10px]" aria-hidden="true"></i>Vaccinated status: ${data.petData.vaccinated_status ? data.petData.vaccinated_status : 'Not Available'}</p>                        
                    </div>
                    <div >
                        <p><i class="fa-regular fa-calendar mr-[10px]" aria-hidden="true"></i>Birth: ${data.petData.date_of_birth ? data.petData.date_of_birth.split('-')[0] : 'Not Available'}</p>
                        <p><i class="fa-solid fa-dollar-sign mr-[10px]" aria-hidden="true"></i>Price: $${data.petData.price ? data.petData.price : 'Not Available'}</p>
                    </div>
                </div>

                <div>
                    <h3 class="text-lg font-semibold my-3 pt-3 border-t border-[rgba(19,19,19,0.1)]">Details Information</h3>
                    <p>${data.petData.pet_details ? data.petData.pet_details : 'Not Available'}</p>
                </div>
                
                <div class="modal-action">
                    <form method="dialog" class="w-full">
                        <button class="btn w-full text-primaryColor border border-[1px] border-[rgba(14,122,129,0.3)] bg-[rgba(14,122,129,0.2)] text-lg font-bold hover:bg-[#0E7A81] hover:text-white">Cancel</button>
                    </form>
                </div>
    `;
    showDetailsModalBox();
}

// Add an event listener to the sort button
document.getElementById("sort").addEventListener("click", () => {
    const activeCategory = document.querySelector("#category-container button.active");
    const category = activeCategory ? activeCategory.innerText : null;
    fetchItems(category, true);
});