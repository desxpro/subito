const fs = require('fs');
const axios = require('axios');
const cheerio = require('cheerio');

const kol = 20 
const search = ['iphone','samsung','huawei','xiaomi','scontrino','mediaworld','euronics']; 

// Определение заголовков запроса
const headers = {
    'User-Agent': 'Mozilla/5.0 (X11; Linux x86_64; rv:109.0) Gecko/20100101 Firefox/115.0',
  };
  
  // Опции запроса
  const options = {
    headers: headers
  };

for(let a = 0; a <= search.length; a++)
{
for(let i = 1; i <= kol ; i++)
  {
  const url = `https://www.subito.it/annunci-italia/vendita/usato/?q=${search[a]}&o=${i}`;
  
// URL веб-страницы, которую вы хотите запросить


// Выполнение HTTP GET запроса с определенными заголовками
axios.get(url, options)
  .then(response => {
    // Обработка ответа
    const html = response.data;
    const $ = cheerio.load(html);

    // Найти все div с классом 'items__item item-card item-card--small'
    const items = $('.items__item.item-card.item-card--small').map((index, element) => {
      // Найти тег <a> внутри текущего элемента
      const linkElement = $(element).find('a');
      // Получить значение атрибута href у тега <a>
      const href = linkElement.attr('href');
      // Вернуть значение атрибута href
      return href;
    }).get();

    // Запись найденных ссылок в файл
    fs.appendFile('links.txt', items.join('\n') +'\n', (err) => {
      if (err) {
        console.error('Ошибка при записи в файл:', err);
      } else {
        console.log('Ссылки успешно записаны в файл links.txt');
      }
    });
  })
  .catch(error => {
    // Обработка ошибок
    console.error('Ошибка при запросе:', error);
  })};
  };
