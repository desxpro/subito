const fs = require('fs');
const axios = require('axios');
const cheerio = require('cheerio');

// Чтение ссылок из файла
fs.readFile('links.txt', 'utf8', (err, data) => {
  if (err) {
    console.error('Ошибка при чтении файла:', err);
    return;
  }

  // Разделение содержимого файла на отдельные ссылки
  const links = data.split('\n');

  // Для каждой ссылки выполняем запрос и обработку
  links.forEach(async url => {
    // Определение заголовков запроса
    const headers = {
      'User-Agent': 'Mozilla/5.0 (X11; Linux x86_64; rv:109.0) Gecko/20100101 Firefox/115.0',
    };

    // Опции запроса
    const options = {
      headers: headers
    };
    await new Promise(resolve => setTimeout(resolve,1500));
    // Выполнение HTTP GET запроса с определенными заголовками
    await axios.get(url, options)
      .then(response => {
        // Обработка ответа
        const html = response.data;
        const $ = cheerio.load(html);
       
        // Найти тег <ul> с классом 'slider-container'
        const sliderContainer = $('ul.slider-container');

        // Проверка наличия найденного элемента
        if (sliderContainer.length > 0) {
          // Найти все теги <img> внутри найденного <ul>
          const images = sliderContainer.find('img');

          // Получить значения атрибута srcset для каждого изображения
          const srcsetValues = images.map((index, element) => {
            return $(element).attr('srcset');
          }).get();

          // Запись значений атрибута srcset в файл
          fs.appendFile('srcsetValues.txt', srcsetValues.join('\n') + '\n', (err) => {
            if (err) {
              console.error('Ошибка при записи в файл:', err);
            } else {
              console.log(`Значения атрибута srcset для ссылки ${url} успешно записаны в файл srcsetValues.txt`);
            }
          });
        } else {
          console.log(`Не удалось найти тег <ul> с классом "slider-container" по ссылке ${url}`);
        }
      })
      .catch(error => {
        // Обработка ошибок
        console.error(`Ошибка при запросе для ссылки ${url}:`, error);
      });
  });
});
