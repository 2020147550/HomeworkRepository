let loadedCount = 1;
let manufacturer = 'All';
let keyword = '';

function addItem(item)
{
    // 리스트에 추가
    const itemImage = document.createElement('img');
    itemImage.src = 'img/' + item.image;
    itemImage.alt = item.name;

    const itemDescription = document.createElement('div');
    itemDescription.classList.add('item-overlay');
    itemDescription.innerHTML = `제품명 : ${item.name}<br>제조사 : ${item.manufacturer}<br>가격 : ${item.price}원`;
    itemDescription.addEventListener('click', function(event) {  // 상세정보 클릭 시 다시 숨김
        this.style.display = 'none';
        event.cancelBubble = true;
    });
    
    const itemContainer = document.createElement('div');
    itemContainer.classList.add('item');
    itemContainer.appendChild(itemImage);
    itemContainer.appendChild(itemDescription);
    itemContainer.addEventListener('click', function() {  // 클릭 시 상세정보 표시
        this.querySelector('.item-overlay').style.display = 'inline-block';
    });

    document.querySelector('.item-list').appendChild(itemContainer);
}
function loadItems()
{
    const start = loadedCount;
    const end = loadedCount + 2;
    loadedCount += 3;

    // fetch
    fetch('product.json')
    .then(response => {
        if (response.ok) return response;
        throw Error('Cannot load items');
    })
    .then(response => response.json())
    .then(obj => { obj.forEach(item => {
        // 필터링이 있는 경우 필터
        if (manufacturer !== 'All' || keyword.trim() !== '')
        {
            if (manufacturer !== 'All' && item.manufacturer !== manufacturer) return;
            if (keyword.trim() !== '' && item.name.toLowerCase().indexOf(keyword.toLowerCase()) == -1) return;
            addItem(item);
        }
        // 필터링이 없는 경우 3개씩 불러오기
        else
        {
            if (item.order >= start && item.order <= end) addItem(item);
        }
    })})
    .catch(error => { console.log(error.message); });
}
function initEvent()
{
    // Infinite Scroll
    window.onscroll = () => {
        if (window.innerHeight + window.scrollY >= document.body.offsetHeight
            && manufacturer === 'All' && keyword.trim() === '') loadItems();
    };

    // 필터링
    document.querySelector('.item-option').onsubmit = (event) => {
        event.preventDefault();
        manufacturer = document.getElementById('manufacturer').value;
        keyword = document.getElementById('keyword').value;

        // content 초기화 및 다시 불러오기
        loadedCount = 1;
        document.querySelector('.item-list').innerHTML = '';
        loadItems();
    };
}
function init()
{
    loadItems();
    initEvent();
}

document.addEventListener('DOMContentLoaded', init);