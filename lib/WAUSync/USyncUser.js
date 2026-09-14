export class USyncUser {
    constructor() {
        this.id = '';
        this.lid = '';
        this.phone = '';
        this.type = '';
    }

    withId(id) {
        this.id = id;
        return this;
    }

    withLid(lid) {
        this.lid = lid;
        return this;
    }

    withPhone(phone) {
        this.phone = phone;
        return this;
    }

    withType(type) {
        this.type = type;
        return this;
    }
}
