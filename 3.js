const fs = require('fs');

// Чтение файла
fs.readFile('srcsetValues.txt', 'utf8', (err, data) => {
  if (err) {
    console.error('Ошибка при чтении файла:', err);
    return;
  }

  const regex = /https?:\/\/[^\s]+?3x-auto/g;

  // Использование метода match для нахождения всех совпадений с регулярным выражением
  const matches = data.match(regex);

  // Проверка наличия совпадений
  if (matches) {
    // Преобразование массива совпадений в строку с разделителем "\n" и запись в файл
    const result = matches.join('\n');
    fs.writeFile('filtered_links.txt', result, 'utf8', (err) => {
      if (err) {
        console.error('Ошибка при записи в файл:', err);
      } else {
        console.log('Ссылки успешно записаны в файл filtered_links.txt');
      }
    });
  } else {
    console.log('Ссылки не найдены в файле.');
  }
});
