import notify from "./pnotifyAlert"
const { initAlert, clearAlert, openAlert } = notify
import debounce from "lodash.debounce"
import * as basicLightbox from 'basiclightbox'


import api from "./apiService.js"
import template from "../templates/card.hbs"



const form = document.createElement("form")
form.class = "search-form"
form.id = "search-form"
form.innerHTML = ` <input
type="text"
name="query"
autocomplete="off"
placeholder="Search images..."
/>`
const input = form.firstElementChild

initAlert(() => input.classList.add("alert"), () => input.classList.remove("alert"))

const gallery = document.createElement("ul")
gallery.class = "gallery"

// const moreBtn = document.createElement("button")
// moreBtn.textContent = "LOAD MORE"

document.body.append(form, gallery)
const addLi = document.createElement("li")
addLi.style.height = getComputedStyle(input).height
addLi.style.padding = 0

// ______


const li = (x) => x.map((el) => `<li>${template(el)}</li>`).join("")

const catcher = (err) => openAlert("just . E R R O R", err.message)

// const scrollDown = () => window.scrollTo(0, window.scrollY + (Number.parseInt(window.innerHeight) - 40))

// ______
form.addEventListener("submit", (e) => e.preventDefault())

let observer = new IntersectionObserver((entries, self) => entries.forEach((e) => (e.isIntersecting) ? api.more().then((data) => {
    if (!input.value.length) {
        gallery.innerHTML = ""
        return
    }
    gallery.insertAdjacentHTML("beforeend", li(data))
    self.observe(gallery.lastElementChild)
    self.unobserve(e.target);
}).catch(catcher) : ""))

// moreBtn.addEventListener("click", () => {
//     api.more().then((data) => {

//         gallery.insertAdjacentHTML("beforeend", li(data))
//         scrollDown()
//     }).catch(catcher)
// })


input.addEventListener("input", debounce(() => {
    clearAlert()
    api.find(input.value).then((data) => {
        if (!input.value.length) {
            gallery.innerHTML = ""
            return
        }
        if (!data.length) {
            openAlert("No results!", "Try another search composition.", "info")
            gallery.innerHTML = ""
            return
        }

        gallery.innerHTML = li(data)
        gallery.insertAdjacentElement("afterbegin", addLi)
        scrollTo(0, 0)
        observer.observe(gallery.lastElementChild)
    }).catch(catcher)
}, 500))

document.addEventListener("click", (e) => (e.target.alt === "picture") ? basicLightbox.create(`<img src="${e.target.dataset.large}" alt="largePicture" />`).show() : "")