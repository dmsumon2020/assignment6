document.getElementById('view-more').addEventListener('click', function() {
    const section = document.getElementById('adopt-best-friend');
    section.scrollIntoView({ behavior: 'smooth' });
});

createCategoryBtns();
fetchItems();