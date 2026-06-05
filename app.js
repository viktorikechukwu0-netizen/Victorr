// ── DOM REFERENCES ───────────────────────────────

const hamburger = document.getElementById('hamburger');
const nav = document.getElementById('nav');

const recipeGrid = document.getElementById('recipeGrid');

const modalOverlay = document.getElementById('modalOverlay');
const openFormBtn = document.getElementById('openFormBtn');
const modalClose = document.getElementById('modalClose');
const saveRecipeBtn = document.getElementById('saveRecipeBtn');

const searchInput = document.getElementById('searchInput');
const categoryFilter = document.getElementById('categoryFilter');

const shoppingPanel = document.getElementById('shoppingPanel');
const shoppingItems = document.getElementById('shoppingItems');
const closeShoppingPanel = document.getElementById('closeShoppingPanel');


// ── DATA ─────────────────────────────────────────

let recipes = [
{
id:1,
name:'Jollof Rice',
category:'dinner',
cuisine:'Nigerian',
emoji:'🍚',
ingredients:[
'2 cups rice',
'Tomato paste',
'Onions',
'Seasoning',
'Chicken stock'
],
instructions:'Fry tomato base, add stock, cook rice.',
isFavorite:false
},

{
id:2,
name:'Avocado Toast',
category:'breakfast',
cuisine:'International',
emoji:'🥑',
ingredients:[
'2 slices bread',
'1 ripe avocado',
'Salt',
'Pepper',
'Lemon'
],
instructions:'Toast bread, mash avocado, spread.',
isFavorite:false
},

{
id:3,
name:'Chicken Pasta',
category:'dinner',
cuisine:'Italian',
emoji:'🍝',
ingredients:[
'200g pasta',
'Chicken',
'Cream',
'Garlic',
'Parmesan'
],
instructions:'Cook pasta, fry garlic and chicken, add cream.',
isFavorite:true
},

{
id:4,
name:'Mango Smoothie',
category:'snack',
cuisine:'Tropical',
emoji:'🥭',
ingredients:[
'2 mangoes',
'1 cup milk',
'Honey',
'Ice'
],
instructions:'Blend all until smooth.',
isFavorite:false
},

{
id:5,
name:'Chocolate Cake',
category:'dessert',
cuisine:'American',
emoji:'🎂',
ingredients:[
'Flour',
'Cocoa',
'Sugar',
'Eggs',
'Butter',
'Milk',
'Baking powder'
],
instructions:'Mix and bake.',
isFavorite:false
}
];


// ── LOCAL STORAGE ───────────────────────────────

function saveToStorage() {
localStorage.setItem(
'recipebookData',
JSON.stringify(recipes)
);
}

function loadFromStorage() {
const stored =
localStorage.getItem('recipebookData');

if(stored !== null){
recipes = JSON.parse(stored);
}
}


// ── RENDER RECIPES ──────────────────────────────

function renderRecipes(list){

if(list.length === 0){
recipeGrid.innerHTML = `
<div class="empty-state">
<h3>No recipes found.</h3>
</div>
`;
return;
}

let html = '';

list.forEach(function(recipe){

const preview =
recipe.ingredients
.slice(0,3)
.map(item => `
<span style="font-size:.8rem;color:#6B7280">
• ${item}
</span>
`)
.join('<br>');

const heart =
recipe.isFavorite ? '❤' : '🤍';

const favClass =
recipe.isFavorite
? 'btn-icon btn-favorite active'
: 'btn-icon btn-favorite';

html += `
<div class="card">

<div class="card-header">
${recipe.emoji}
</div>

<div class="card-body">

<h3 class="card-title">
${recipe.name}
</h3>

<span class="card-badge">
${recipe.category}
</span>

<p class="card-cuisine">
Cuisine: ${recipe.cuisine}
</p>

<div style="margin-top:8px">
${preview}
</div>

</div>

<div class="card-actions">

<button
class="btn-icon btn-delete"
data-id="${recipe.id}">
🗑 Delete
</button>

<button
class="btn-icon btn-shopping"
data-id="${recipe.id}">
🛒 Shop
</button>

<button
class="${favClass}"
data-id="${recipe.id}">
${heart} Fav
</button>

</div>

</div>
`;
});

recipeGrid.innerHTML = html;

attachCardEvents();
}


// ── CARD EVENTS ────────────────────────────────

function attachCardEvents(){

document
.querySelectorAll('.btn-delete')
.forEach(function(btn){

btn.addEventListener('click',function(){

const id =
Number(this.dataset.id);

if(!confirm('Delete recipe?')){
return;
}

recipes = recipes.filter(function(recipe){
return recipe.id !== id;
});

saveToStorage();
renderRecipes(recipes);

});

});

document
.querySelectorAll('.btn-favorite')
.forEach(function(btn){

btn.addEventListener('click',function(){
toggleFavorite(
Number(this.dataset.id)
);
});

});

document
.querySelectorAll('.btn-shopping')
.forEach(function(btn){

btn.addEventListener('click',function(){
openShoppingList(
Number(this.dataset.id)
);
});

});

}


// ── HAMBURGER MENU ─────────────────────────────

hamburger.addEventListener(
'click',
function(){
nav.classList.toggle('open');
}
);


// ── MODAL ──────────────────────────────────────

openFormBtn.addEventListener(
'click',
function(){
modalOverlay.classList.add('open');
}
);

modalClose.addEventListener(
'click',
function(){
modalOverlay.classList.remove('open');
}
);

modalOverlay.addEventListener(
'click',
function(e){

if(e.target === modalOverlay){
modalOverlay.classList.remove('open');
}

}
);


// ── ADD RECIPE ─────────────────────────────────

saveRecipeBtn.addEventListener(
'click',
function(){

const name =
document.getElementById('recipeName')
.value.trim();

const category =
document.getElementById('recipeCategory')
.value;

const cuisine =
document.getElementById('recipeCuisine')
.value.trim();

const emoji =
document.getElementById('recipeEmoji')
.value.trim() || '🍽';

const instructions =
document.getElementById('recipeInstructions')
.value.trim();

const ingredients =
document.getElementById('recipeIngredients')
.value
.split('\n')
.map(line => line.trim())
.filter(Boolean);

if(!name || ingredients.length === 0){
alert(
'Please enter a recipe name and ingredients.'
);
return;
}

recipes.push({
id:Date.now(),
name:name,
category:category,
cuisine:cuisine || 'Not specified',
emoji:emoji,
ingredients:ingredients,
instructions:instructions,
isFavorite:false
});

saveToStorage();
renderRecipes(recipes);

modalOverlay.classList.remove('open');

document.getElementById('recipeName').value='';
document.getElementById('recipeCuisine').value='';
document.getElementById('recipeIngredients').value='';
document.getElementById('recipeInstructions').value='';
document.getElementById('recipeEmoji').value='';

}
);


// ── SEARCH & FILTER ────────────────────────────

function applyFilters(){

const search =
searchInput.value
.toLowerCase()
.trim();

const category =
categoryFilter.value;

const filtered =
recipes.filter(function(recipe){

const textMatch =
recipe.name
.toLowerCase()
.includes(search)

||

recipe.cuisine
.toLowerCase()
.includes(search);

const categoryMatch =
category === 'all'
||
recipe.category === category;

return textMatch && categoryMatch;

});

renderRecipes(filtered);

}

searchInput.addEventListener(
'input',
applyFilters
);

categoryFilter.addEventListener(
'change',
applyFilters
);


// ── SHOPPING PANEL ─────────────────────────────

closeShoppingPanel.addEventListener(
'click',
function(){
shoppingPanel.classList.remove('open');
}
);

function openShoppingList(id){

const recipe =
recipes.find(function(r){
return r.id === id;
});

if(!recipe) return;

const items =
recipe.ingredients
.map(function(item){
return `
<div class="shopping-item">
🛒 ${item}
</div>
`;
})
.join('');

shoppingItems.innerHTML = `
<h3>${recipe.emoji} ${recipe.name}</h3>
${items}
<p>
${recipe.ingredients.length}
items total
</p>
`;

shoppingPanel.classList.add('open');
}


// ── FAVORITES ──────────────────────────────────

function toggleFavorite(id){

const recipe =
recipes.find(function(r){
return r.id === id;
});

if(!recipe) return;

recipe.isFavorite =
!recipe.isFavorite;

saveToStorage();
renderRecipes(recipes);

}


// ── INIT ───────────────────────────────────────

function init(){

loadFromStorage();
renderRecipes(recipes);

}

init();