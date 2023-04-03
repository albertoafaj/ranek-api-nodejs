class Photos {
  constructor(
    id,
    fieldname,
    originalname,
    encoding,
    mimetype,
    destination,
    filename,
    size,
    url,
    title,
    dateCreate,
    productId,
  ) {
    this.id = id;
    this.fieldname = fieldname;
    this.originalname = originalname;
    this.encoding = encoding;
    this.mimetype = mimetype;
    this.destination = destination;
    this.filename = filename;
    this.size = size;
    this.url = url;
    this.title = title;
    this.dateCreate = dateCreate;
    this.productId = productId;
  }
}

module.exports = Photos;
