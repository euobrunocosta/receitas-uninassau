const showCover = () => {
  const template = /*html*/`
    <h2>Uninassau</h2>
    <div class="coverContainer">
      <h3>Livro de Receitas Juninas Uninassau</h3>
      <a href="#" onclick="showPage(1)">
        Abrir
      </a>
    </div>
  `
  document.querySelector('div.notebook')
    .classList.add('cover')

  document.querySelector('article')
    .innerHTML = template
}

showCover()

const showPage = async (page) => {
  const getSumaryButton = () => (
    page > 1
      ? /*html*/`
        <a href="#" class="sumary" onclick="showPage(1)">
          Sumário
        </a>
      `
      : /*html*/`<div></div>`
  )
  const generatePageTemplate = (content, pagination) => {
    const sumaryButton = getSumaryButton()

    const pageTemplate = /*html*/`
      <a href="#" class="close" onclick="showCover()"></a>
      <h2>Uninassau</h2>
      <img class="title" src="./images/title.png" alt="Receitas Juninas">
      <div class="content">
        ${content}
      </div>
      <nav>
        ${sumaryButton}
        <ul>
          ${pagination}
        </ul>
      </nav>
    `
    return pageTemplate
  }
  
  const recipes = await getJSONRecipies()
  const totalPages = recipes.length + 1
  const index = page - 2

  const titles = recipes.map(recipe => recipe.titulo)

  const recipe = page > 1
    ? recipes.find((_, _index) => _index === index)
    : null

  const contentTemplate = recipe
    ? getRecipeTemplate(recipe)
    : getSumaryTemplate(titles)

  const pagination = getPagination(page, totalPages)

  const pageTemplate = generatePageTemplate(contentTemplate, pagination)

  document.querySelector('div.notebook')
    .classList.remove('cover')

  document.querySelector('article')
    .innerHTML = pageTemplate
}

const getSumaryTemplate = titles => {
  const items = titles.reduce((acc, curr, index) => {
    const pageNumber = index + 2
    const pageView = String(pageNumber).length === 1 ? `0${pageNumber}` : pageNumber
    return /*html*/`
      ${acc}
      <li onclick="showPage(${pageNumber})">
        <span>${curr}</span>
        <span>pag. ${pageView}</span>
      </li>
    `
  }, '')

  const template = /*html*/`
    <h3>Receitas</h3>
    <ul class="sumary">
      ${items}
    </ul>
  `

  return template
}

const getJSONRecipies = async () => {
  const fileRecipies = await fetch('../receitas-uninassau/receitas.json')
  const jsonRecipies = await fileRecipies.json()
  return jsonRecipies
}

const getYoutubeVideoCode = url => {
  if (!url) return

  const regExp = /^.*(youtu\.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/
  const match = url.match(regExp)
  return match[2]
}

const getRecipeTemplate = (recipe) => {
  const {
    titulo,
    imagem = '',
    video = '',
    ingredientes,
    preparo
  } = recipe

  const listaIngredientes = getList(ingredientes)
  const listaPreparo = getList(preparo)

  const _imagem = (!video && imagem)
    ? /*html*/`<img class="picture" src="./images/receitas/${imagem}" alt="${titulo}" />`
    : ''

  const videoCode = getYoutubeVideoCode(video)

  const _video = video && /*html*/`
    <iframe
      height="315"
      src="https://www.youtube.com/embed/${videoCode}"
      title="${titulo}"
      frameborder="0"
      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
      allowfullscreen
    ></iframe>
  `

  const template = /*html*/`
    ${_imagem}
    ${_video}
    <h3>${titulo}</h3>
    <h4>Ingredientes</h4>
    <ul class="list">
      ${listaIngredientes}
    </ul>
    <h4>Preparo</h4>
    <ol class="list">
      ${listaPreparo}
    </ol>
  `

  return template
}

const getList = items => (
  items.reduce((acc, curr) => (
    /*html*/`
      ${acc}
      <li>${curr}</li>
    `
  ), '')
)

const getPagination = (current, total) => {
  const prevPage = current - 1
  const nextPage = current + 1
  const _current = String(current).length === 1 ? `0${current}` : current
  const prev = current > 1 ? /*html*/`<li class="prev" onclick="showPage(${prevPage})">Anterior</li>` : ''
  const page = /*html*/`<li class="page">${_current}</li>`
  const next = current < total ? /*html*/`<li class="next" onclick="showPage(${nextPage})">Próxima</li>` : ''
  return `${prev}${page}${next}`
}