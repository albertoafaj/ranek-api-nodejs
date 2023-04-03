exports.seed = async (knex) => {
  await knex('products').insert([
    {
      id: 10011,
      userId: 10000,
      name: 'Notebook photos delete',
      price: 6999.99,
      description: 'DELL I7',
      photos: JSON.stringify([
        {
          id: 10001,
          fieldname: 'files',
          originalname: 'img-project-portfolio-360x280.jpg',
          encoding: '7bit',
          mimetype: 'image/jpeg',
          destination: 'D:\\Projects\\Pratical-studies\\ranek-api\\uploads',
          filename: 'not-remove-img-project-portfolio-360x280.jpg',
          url: 'D:\\Projects\\Pratical-studies\\ranek-api\\uploads\\not-remove-img-project-portfolio-360x280.jpg',
          size: 6731,
          title: 'Screen portfolio 2',
          dateCreate: '2023-03-30T11:16:17.307Z',
          productId: 10011,
        },
      ]),
      dateCreate: knex.fn.now(),
    },

  ]);
  await knex('photos').insert([
    {
      id: 10000,
      fieldname: 'files',
      originalname: 'img-project-portfolio-360x280.jpg',
      encoding: '7bit',
      mimetype: 'image/jpeg',
      destination: 'D:\\Projects\\Pratical-studies\\ranek-api\\uploads',
      filename: '2b96fa6aabfb94e75c6362b1232d20ef-img-project-portfolio-360x280.jpg',
      url: 'D:\\Projects\\Pratical-studies\\ranek-api\\uploads\\2b96fa6aabfb94e75c6362b1232d20ef-img-project-portfolio-360x280.jpg',
      size: 6731,
      title: 'Screen portfolio',
      dateCreate: knex.fn.now(),
      productId: null,
    },
    {
      id: 10001,
      fieldname: 'files',
      originalname: 'img-project-portfolio-360x280.jpg',
      encoding: '7bit',
      mimetype: 'image/jpeg',
      destination: 'D:\\Projects\\Pratical-studies\\ranek-api\\uploads',
      filename: 'not-remove-img-project-portfolio-360x280.jpg',
      url: 'D:\\Projects\\Pratical-studies\\ranek-api\\uploads\\not-remove-img-project-portfolio-360x280.jpg',
      size: 6731,
      title: 'Screen portfolio 2',
      dateCreate: '2023-03-30T11:16:17.307Z',
      productId: 10011,
    },
  ]);
};
