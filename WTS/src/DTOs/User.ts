class User {
  id: string;
  name: string;
  description: string;
  usergroup: string;
  constructor(id: string, name: string, description: string) {
    this.id = id;
    this.name = name;
    this.description = description;
  }
}