export class User {
    firstName: string;
    lastName: string;
    avatarUrl: string;

    fullName(): string {
        return (this.firstName ? (this.firstName + ' ') : '' + this.lastName ? this.lastName : '').trim();
    }
}
