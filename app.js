const catalog = document.querySelector('.catalog')
const cards = catalog.querySelectorAll('.product-card')
const modal = document.querySelector('#modal')
const modalContent = document.querySelector('.modal-content')


const fetchCard = async (id) => {
    const parser = new DOMParser();

    const res = await fetch(`/`, {
        method: 'GET'
    })

    const html = await res.text()

    const doc = parser.parseFromString(html, "text/html")
    const card = doc.querySelector(`#product-${id + 1}`)

    return {
        title: card.querySelector(".product-card__title").textContent,
        desc: card.querySelector('.product-card__description').textContent
    }

}

for (let i = 0; i < cards.length; i++) {
    const card = cards[i]

    const counterDecrease = card.querySelector('.counter__decrease')
    const counterInput = card.querySelector('.counter__input')
    const counterIncrease = card.querySelector('.counter__increase')
    const btnCheck = card.querySelector('.product-card__add-to-cart')

    const localStorageCount = localStorage.getItem(`card-${i}`)

    if (localStorageCount){
        counterInput.value = localStorageCount
    }

    counterDecrease.addEventListener("click", () => {
        if (Number(counterInput.value) <= 0) return

        counterInput.value -= 1

        localStorage.setItem(`card-${i}`, counterInput.value)
    })

    counterIncrease.addEventListener("click", () => {
        counterInput.value = Number(counterInput.value) + 1

        localStorage.setItem(`card-${i}`, counterInput.value)
    })

    counterInput.addEventListener("change", (event) => {
        localStorage.setItem(`card-${i}`, event.target.value)
    })


    btnCheck.addEventListener("click", async () => {
        const { title, desc } = await fetchCard(i)
        const modalContent = modal.querySelector('#modal-content')

        const nameElem = document.createElement('div')
        const descElem = document.createElement('div')
        const btnElem = document.createElement('button')

        nameElem.innerHTML = title
        descElem.innerHTML = desc
        btnElem.innerHTML = "Добавить в корзину"

        btnElem.addEventListener("click", () => {
            const count = Number(localStorage.getItem(`card-${i}`))

            localStorage.setItem(`card-${i}`, (count + 1))
        })

        modalContent.append(nameElem, descElem, btnElem)
        modal.classList.add('active')
    })
}

modal.addEventListener("click", (event) => {
    modal.classList.remove("active")

    modal.querySelector('#modal-content').innerHTML = null
})

modalContent.addEventListener('click', (event) => {
    event.stopPropagation()
})