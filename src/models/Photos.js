class Photos {
  constructor(
    id,
    fieldname,
    originalname,
    encoding,
    mimetype,
    destination,
    filename,
    path,
    size,
    url,
    dateCreate,
  ) {
    this.id = id;
    this.fieldname = fieldname;
    this.originalname = originalname;
    this.encoding = encoding;
    this.mimetype = mimetype;
    this.destination = destination;
    this.filename = filename;
    this.path = path;
    this.size = size;
    this.url = url;
    this.dateCreate = dateCreate;
  }
}

module.exports = Photos;
