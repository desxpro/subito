// npm install axios && npm install cheerio && npm install socks-proxy-agent
const poisk = ['iphone','samsung','huawei','xiaomi','scontrino','mediaworld','euronics'];  // строка поиска 
const pag = 15;           // сколько страниц обьявлений обработать 

const fs = require('fs');
const axios = require('axios');
const cheerio = require('cheerio');
//const SocksProxyAgent = require('socks-proxy-agent');

const headers = {'User-Agent': 'Mozilla/5.0 (X11; Linux x86_64; rv:109.0) Gecko/20100101 Firefox/115.0',};
//const proxy = 'socks5://65.20.96.181:1080'; // socks5://login:pass@1.1.1.1:port
//const agent = new SocksProxyAgent.SocksProxyAgent(proxy);

const axiosInstance = axios.create({
  //httpsAgent: agent,
 // httpAgent: agent,
  headers: headers
});


const start1 = async (search , kol) =>
{
  let link_1 =[]
  for(let a = 0; a < search.length; a++)
  {
  for(let i = 1; i <= kol ; i++)
  {
  const url = `https://www.subito.it/annunci-italia/vendita/usato/?q=${search[a]}&o=${i}`;
  await new Promise(resolve => setTimeout(resolve,1500));
  await axiosInstance.get(url)  //запрос на сайт 
    .then(response => {
      // Обработка ответа
      const html = response.data;
      const $ = cheerio.load(html);
      // Найти все div с классом 'items__item item-card item-card--small'
      const item = $('.items__item.item-card.item-card--small').map((i, element) => {
        // Найти тег <a> внутри текущего элемента
        const linkElement = $(element).find('a');
        // Получить значение атрибута href у тега <a>
        const href = linkElement.attr('href');
        // Вернуть значение атрибута href
        return href   
      }).get();
    
      link_1 = [...link_1,...item]
    })
    .catch(error => {
    // Обработка ошибок
    console.error('Ошибка при запросе:', error);
    });
  }
  }
return link_1 
}

const start2 = async (array) => {
  let link_2 = [];

  // Создание массива обещаний
  const promises = array.map(async (element) => {
    try {
      await new Promise(resolve => setTimeout(resolve,1700));
      const response = await axiosInstance.get(element);
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

        const masiv = srcsetValues.map(a => a.split(' ').filter(link => /3x-auto$/.test(link))[0])
        link_2.push(...masiv);
      } else {
        console.log('Не удалось найти тег <ul> с классом "slider-container"','>>> ', element);
      }
    } catch (error) {
      console.error('Ошибка при запросе:', error);
    }
  });

  // Дождаться выполнения всех запросов
  await Promise.all(promises);

  // Вывести результат
  return link_2;
}

const start3 = (links) =>
{
  async function downloadImage(url, filename) {
    try {
      const response = await axios({
        method: 'GET',
        url: url,
        responseType: 'stream', // Указываем тип ответа потоком
      });
  
      // Создаем поток для записи в файл
      const writer = fs.createWriteStream(filename);
  
      // Подключаем обработчики событий для потока
      response.data.pipe(writer);
  
      // Возвращаем Promise, который разрешается после завершения записи файла
      return new Promise((resolve, reject) => {
        writer.on('finish', resolve);
        writer.on('error', reject);
      });
    } catch (error) {
      throw new Error(`Ошибка при загрузке файла ${filename}: ${error.message}`);
    }
  }
  
  // Функция для скачивания всех картинок по списку ссылок
  async function downloadImages() {
    console.log('Найдено- ', links.length)
    for (let i = 0; i < links.length; i++) {
      const url = links[i];
      const filename = `image${i + 1}.jpg`; // Имя файла для сохранения
      try {
        await downloadImage(url, filename);
        console.log('\x1b[32m','[+]','\x1b[0m',`- ${filename}`);
      } catch (error) {
        console.error(error.message);
      }
    }
  }
  fs.lstat
  // Вызов функции для скачивания картинок
  downloadImages();
}

start1(poisk, pag)
   .then( async (a) => 
   {
     const links = await start2(a)
     await start3(links)
   } )