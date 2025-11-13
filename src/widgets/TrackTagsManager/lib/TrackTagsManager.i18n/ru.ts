const ru = {
  title: 'Управление тегами',
  trackName: 'Трек: {{name}} - {{artist}}',
  sections: {
    trackTags: {
      title: 'Теги этого трека',
      empty: 'Нет пользовательских тегов',
    },
    allTags: {
      title: 'Все теги',
      empty: 'Нет созданных тегов. Создайте первый!',
    },
  },
  buttons: {
    create: 'Создать тег',
    cancel: 'Отмена',
    delete: 'Удалить тег "{{tag}}" из всех треков?',
  },
  form: {
    placeholder: 'Название тега',
    createButton: 'Создать',
  },
  errors: {
    tagExists: 'Тег с таким названием уже существует',
  },
};

export default ru;
