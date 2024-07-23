class UserDto {
    constructor(model) {
        this.email = model.email;
        this.id = model._id;
        this.isActivated = model.isActivated;
    }
    email;
    id;
    isActivated;
}

module.exports = UserDto;