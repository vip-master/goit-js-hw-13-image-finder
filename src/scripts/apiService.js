'use strict';
const capsule = () => {
    let search = ""
    let page = 0

    let pages = 0
    let all = 0

    let freeze = false

    let per_page = 0
    let freezeTime = 800

    const delay = (time) => new Promise((res) => setTimeout(() => {
        freeze = false
        res()
    }, time))

    const query = async(s, p, pp) => {

        while (freeze) await freeze
        freeze = delay(freezeTime)

        const response = await fetch(`https://pixabay.com/api/?image_type=photo&orientation=horizontal&q=${s}&page=${p}&per_page=${pp}&key=21059964-5bf790d712106238e57c2f022`)
        if (Math.floor(+response.status / 100) !== 2) throw new Error((await response.text()))
        return await (response).json()
    }

    const _find = async(q, how) => {
        if (q == "") return []
        search = q
        per_page = how
        page = 1

        let result = await query(search, page, per_page)


        all = result.total
        pages = Math.ceil(result.totalHits / per_page)

        return result.hits

    }

    const _more = async() => {
        if (page > pages || page < 1) return []
        let result = await query(search, page, per_page)

        return result.hits
    }

    const getCache = (x) => {
        const cache = JSON.parse(localStorage.getItem(x))

        all = cache.all
        pages = cache.pages
        return cache.result
    }

    const find = async(_, __ = 12) => {
        _ = _.split(" ").join("+")
        if (_[_.length - 1] == "+") _ = _.slice(0, _.length - 1)
        let result
        const req = JSON.stringify([_, 1])

        if (localStorage.getItem(req)) getCache(req)

        result = await _find(_, __)

        if (result.length) localStorage.setItem(req, JSON.stringify({ all, pages, result }))

        return result
    }
    const more = async(_) => {
        if (_ !== undefined) throw new Error("more() has no arguments")
        if (!search) return []


        let result
        page++
        const req = JSON.stringify([search, page])

        if (localStorage.getItem(req)) getCache(req)

        result = await _more()

        if (result.length) localStorage.setItem(req, JSON.stringify({ all, pages, result }))

        return result
    }

    return { find, more }
}


export default capsule()